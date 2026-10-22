/**
 * Putkikasvu CRM sync worker. Run on a private Node 22+ scheduler.
 * Required: RESEND_API_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
 * GMAIL_REFRESH_TOKEN, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET.
 * Google Sheets must be shared with the service account.
 * No outbound mail is sent. No secrets or message bodies are written to Sheets.
 */
import { createSign } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { readConfig } from './crm-sync-config.mjs';
import { matchesReply, mergeEvent, safeMetrics, sheetRowIndex } from './crm-sync-core.mjs';

const env = (key) => { if (!process.env[key]) throw new Error('Missing '+key); return process.env[key]; };
const b64url = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');
async function request(url, opts={}) {
  const r=await fetch(url,opts); const txt=await r.text();
  if (!r.ok) throw new Error('Provider request failed: HTTP '+r.status);
  return txt ? JSON.parse(txt) : {};
}
async function serviceToken(){
  const now=Math.floor(Date.now()/1000);
  const header=b64url({alg:'RS256',typ:'JWT'});
  const payload=b64url({iss:env('GOOGLE_SERVICE_ACCOUNT_EMAIL'),scope:'https://www.googleapis.com/auth/spreadsheets.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
  const unsigned=header+'.'+payload;
  const sign=createSign('RSA-SHA256'); sign.update(unsigned); sign.end();
  const signature=sign.sign(env('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g,'\n'),'base64url');
  const body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:unsigned+'.'+signature});
  return (await request('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body})).access_token;
}
async function gmailToken(){
  const body=new URLSearchParams({client_id:env('GMAIL_CLIENT_ID'),client_secret:env('GMAIL_CLIENT_SECRET'),refresh_token:env('GMAIL_REFRESH_TOKEN'),grant_type:'refresh_token'});
  return (await request('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body})).access_token;
}
const auth=(token)=>({authorization:'Bearer '+token});
/** Importing this module never starts OAuth or network requests. */
export async function runSync({ environment=process.env, requestJson=request,
  tokens={sheet:serviceToken,gmail:gmailToken}, now=()=>new Date() }={}) {
  // Validate isolation and write prohibition before any OAuth or external request.
  const config=readConfig(environment);
  const TAB="'"+config.tab.replaceAll("'","''")+"'";
  const sheetToken=await tokens.sheet();
  const base='https://sheets.googleapis.com/v4/spreadsheets/'+encodeURIComponent(config.sheetId)+'/values/';
  const grid=(await requestJson(base+encodeURIComponent(TAB+'!A1:J'),{headers:auth(sheetToken)})).values||[];
  if(grid[0]?.[0]!=='Yritys'||grid[0]?.[2]!=='Resend ID')throw new Error('Unexpected CRM schema');
  // Validate all IDs before reading other providers.
  for(const row of grid.slice(1)) if(row[2]) sheetRowIndex(grid,row[2]);
  const gmail=await tokens.gmail();
  const updates=[];
  for(const row of grid.slice(1)) {
    const email=row[1], id=row[2];
    if(!email||!id)continue;
    const targetRow=sheetRowIndex(grid,id);
    const r=await requestJson('https://api.resend.com/emails/'+encodeURIComponent(id),{
      headers:auth(environment.RESEND_API_KEY||'')});
    // Raw metrics contract remains unverified: do not call a guessed endpoint or report zero.
    const {opened,clicked}=safeMetrics(undefined);
    const sentAt=Date.parse(r.created_at);
    const messageId=r.message_id;
    let found=false;
    let reply='Kohdistustiedot puuttuvat';
    if(typeof messageId==='string' && /^<[^<>\s]+>$/.test(messageId) && Number.isFinite(sentAt)) {
      const query='from:'+email+' after:'+Math.floor(sentAt/1000);
      let pageToken;
      const seen=new Set();
      do {
        const url=new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
        url.searchParams.set('maxResults','100');url.searchParams.set('q',query);
        if(pageToken)url.searchParams.set('pageToken',pageToken);
        const result=await requestJson(url.toString(),{headers:auth(gmail)});
        for(const candidate of result.messages||[]) {
          const detailUrl=new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages/'+encodeURIComponent(candidate.id));
          detailUrl.searchParams.set('format','metadata');
          for(const name of ['From','In-Reply-To','References'])detailUrl.searchParams.append('metadataHeaders',name);
          const detail=await requestJson(detailUrl.toString(),{headers:auth(gmail)});
          const headers=detail.payload?.headers||[];
          const header=(name)=>headers.filter(h=>h.name.toLowerCase()===name).map(h=>h.value).join(' ');
          const rawFrom=header('from').trim();
          const from=rawFrom.match(/^[^<>]*<([^<>]+)>$/)?.[1]||rawFrom;
          const refs=header('references').match(/<[^<>\s]+>/g)||[];
          const receivedAtMs=detail.internalDate ? Number(detail.internalDate) : NaN;
          if(matchesReply({from,references:refs,inReplyTo:header('in-reply-to'),receivedAtMs},email,messageId,sentAt))found=true;
        }
        pageToken=result.nextPageToken;
        if(pageToken && seen.has(pageToken))throw new Error('Repeated Gmail page token');
        if(pageToken)seen.add(pageToken);
      } while(pageToken && !found);
      reply=found?'Vastaus tunnistettu':'Ei löydetty';
    }
    // Preserve a previously verified reply if a later search no longer finds it.
    const replied=found||row[6]==='Vastaus tunnistettu';
    if(replied)reply='Vastaus tunnistettu';
    const state=replied?'Vastannut':reply==='Kohdistustiedot puuttuvat'?'Tarkista kohdistus':'Odottaa vastausta';
    const values=[[mergeEvent(row[3],r.last_event||r.status),opened,clicked,reply,state,now().toISOString()]];
    updates.push({range:TAB+'!D'+targetRow+':I'+targetRow,values});
  }
  // Deliberately no Sheets write or mail-send implementation in this test-stage worker.
  return {mode:'dry-run',candidates:updates.length,updated:0,updates};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  runSync().then(({mode,candidates,updated})=>console.log(JSON.stringify({mode,candidates,updated})))
    .catch(()=>{console.error('CRM sync failed; check configuration and provider access');process.exitCode=1;});
}
