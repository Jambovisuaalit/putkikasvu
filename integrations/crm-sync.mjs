/**
 * Putkikasvu CRM sync worker. Run on a private Node 22+ scheduler.
 * Required: RESEND_API_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
 * GMAIL_REFRESH_TOKEN, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET.
 * Google Sheets must be shared with the service account.
 * No outbound mail is sent. No secrets or message bodies are written to Sheets.
 */
import { createSign } from 'node:crypto';

const SHEET_ID = '1xVjcWb8lq4xVwSFu6oMkwdPeLXY8oKAtVfv2qhx23LA';
const TAB = "'SEURANTA 22-10-2026'";
const env = (key) => { if (!process.env[key]) throw new Error('Missing '+key); return process.env[key]; };
const b64url = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');
async function request(url, opts={}) {
  const r=await fetch(url,opts); const txt=await r.text();
  if (!r.ok) throw new Error('HTTP '+r.status+' '+url.split('?')[0]+': '+txt.slice(0,180));
  return txt ? JSON.parse(txt) : {};
}
async function serviceToken(){
  const now=Math.floor(Date.now()/1000);
  const header=b64url({alg:'RS256',typ:'JWT'});
  const payload=b64url({iss:env('GOOGLE_SERVICE_ACCOUNT_EMAIL'),scope:'https://www.googleapis.com/auth/spreadsheets',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
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
async function main(){
  const sheetToken=await serviceToken();
  const base='https://sheets.googleapis.com/v4/spreadsheets/'+SHEET_ID+'/values/';
  const range=encodeURIComponent(TAB+'!A1:J100');
  const grid=(await request(base+range,{headers:auth(sheetToken)})).values||[];
  if(grid[0]?.[0]!=='Yritys'||grid[0]?.[2]!=='Resend ID')throw new Error('Unexpected CRM schema');
  const gmail=await gmailToken();
  const updates=[];
  for(let i=1;i<grid.length;i++){
    const row=grid[i]; const email=row[1];const id=row[2];
    if(!email||!id)continue;
    const r=await request('https://api.resend.com/emails/'+encodeURIComponent(id),{headers:auth(env('RESEND_API_KEY'))});
    // Resend metrics endpoint is used for opens/clicks; absence of an event means zero *tracked* events.
    const start='2026-10-01';const end=new Date().toISOString().slice(0,10);
    const metricsUrl=new URL('https://api.resend.com/emails/metrics');
    metricsUrl.searchParams.set('start_date',start);metricsUrl.searchParams.set('end_date',end);
    metricsUrl.searchParams.set('email_id',id);
    let opens='Ei saatavilla', clicks='Ei saatavilla';
    try {
      const m=await request(metricsUrl,{headers:auth(env('RESEND_API_KEY'))});
      if(m?.data?.length===1){opens=m.data[0].opened??'Ei saatavilla';clicks=m.data[0].clicked??'Ei saatavilla';}
    }catch{ /* avoid falsely reporting zero when metrics endpoint is unavailable */ }
    const query='from:('+email+') after:2026/10/19';
    const result=await request('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=30&q='+encodeURIComponent(query),{headers:auth(gmail)});
    const reply=(result.messages?.length||0)>0?'Mahdollinen vastaus – tarkista ketju':'Ei löydetty';
    const state=reply.startsWith('Mahdollinen')?'Tarkista vastaus':'Odottaa vastausta';
    const stamp=new Date().toISOString();
    const values=[[r.last_event||r.status||'Tuntematon',opens,clicks,reply,state,stamp]];
    updates.push({range:TAB+'!D'+(i+1)+':I'+(i+1),values});
  }
  if(updates.length)await request('https://sheets.googleapis.com/v4/spreadsheets/'+SHEET_ID+'/values:batchUpdate',{method:'POST',headers:{...auth(sheetToken),'content-type':'application/json'},body:JSON.stringify({valueInputOption:'RAW',data:updates})});
  console.log(JSON.stringify({updated:updates.length,at:new Date().toISOString()}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
