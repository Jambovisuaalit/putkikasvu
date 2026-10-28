import {createSign} from 'node:crypto';
const id='1xVjcWb8lq4xVwSFu6oMkwdPeLXY8oKAtVfv2qhx23LA';
const ranges={
  followup:"'SEURANTA 22-10-2026'!A1:J100",
  blocks:"'ESTOLISTA'!A1:J100",
  sent:"'LÄHETYSLOKI'!A1:P100"
};
const b64=x=>Buffer.from(x).toString('base64url');
async function googleToken(json) {
  const {client_email,private_key}=JSON.parse(json);
  if(!client_email||!private_key) throw Error('Incomplete Google service-account secret');
  const now=Math.floor(Date.now()/1000);
  const data=b64(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+b64(JSON.stringify({
    iss:client_email,scope:'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+1800}));
  const sign=createSign('RSA-SHA256');sign.update(data);sign.end();
  const assertion=data+'.'+sign.sign(private_key).toString('base64url');
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',
    headers:{'content-type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),
    signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw Error('OAuth failed: '+response.status);
  return (await response.json()).access_token;
}
async function readSheet(token,range) {
  const url='https://sheets.googleapis.com/v4/spreadsheets/'+id+'/values/'+encodeURIComponent(range);
  const r=await fetch(url,{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(15000)});
  if(!r.ok) throw Error('Sheets read failed: '+r.status);
  const v=(await r.json()).values;
  if(!Array.isArray(v)) throw Error('Sheets range empty');
  return v;
}
async function resend(key,path) {
  const r=await fetch('https://api.resend.com'+path,
    {headers:{authorization:'Bearer '+key},signal:AbortSignal.timeout(15000)});
  if(!r.ok) throw Error('Resend read failed: '+r.status);
  return r.json();
}
export async function liveSnapshot(env=process.env) {
  if(!env.PK_GOOGLE_SERVICE_ACCOUNT_JSON||!env.PK_RESEND_READ_API_KEY)
    throw Error('Read-only credentials not configured');
  const token=await googleToken(env.PK_GOOGLE_SERVICE_ACCOUNT_JSON);
  const [followup,blocks,sent,page]=await Promise.all([
    readSheet(token,ranges.followup),readSheet(token,ranges.blocks),readSheet(token,ranges.sent),
    resend(env.PK_RESEND_READ_API_KEY,'/emails/receiving?limit=100')]);
  if(!Array.isArray(page.data)) throw Error('Invalid Resend list response');
  const addresses=new Set(followup.slice(1)
    .filter(r=>['LVI MIKKI Ky','Lvi-Upp Oy'].includes(r[0]))
    .map(r=>String(r[1]??'').toLowerCase().trim()));
  const matches=page.data.filter(item=>{
    const from=String(item.from??'').toLowerCase().trim();
    return addresses.has((from.match(/<([^<>]+)>/)?.[1]??from).trim());
  });
  const received=await Promise.all(matches.map(async item=>{
    const msg=await resend(env.PK_RESEND_READ_API_KEY,'/emails/receiving/'+encodeURIComponent(item.id));
    return {from:msg.from,subject:msg.subject,text:msg.text??'',created_at:msg.created_at};
  }));
  // Gmail is a separate provider and cannot be declared checked by this worker.
  return {followup,blocks,sent,received,inboundComplete:page.has_more===false,gmailComplete:false};
}
