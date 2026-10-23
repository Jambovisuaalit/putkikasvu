/**
 * Read-only, manually invoked Resend inbound auth smoke test.
 * Strictly for the dedicated Putkikasvu test configuration; no sheet access,
 * writes, mail sends or logging of email bodies, headers or credentials.
 */
import {pathToFileURL} from 'node:url';
import {readConfig} from './crm-sync-config.mjs';
import {mailbox,PUTKIKASVU_INGRESS} from './resend-inbound.mjs';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function json(url, options) {
 const u=new URL(url);
 if(u.origin!=='https://api.resend.com'||!/^\/emails\/receiving\/[0-9a-f-]{36}$/i.test(u.pathname))
  throw new Error('Unauthorized inbound API endpoint');
 const response=await fetch(u,{...options,method:'GET'});
 if(!response.ok)throw new Error('Resend inbound auth smoke HTTP '+response.status);
 return response.json();
}
export async function verifyResendInboundReadOnly({
 environment=process.env,requestJson=json
}={}) {
 const config=readConfig(environment);
 if(config.replySource!=='resend'||environment.CRM_SYNC_WRITE!=='false')
  throw new Error('Resend-only read-only smoke configuration required');
 if(mailbox(environment.CRM_SYNC_RECEIVING_ADDRESS)!==PUTKIKASVU_INGRESS)
  throw new Error('Unexpected forwarding inbox');
 const token=String(environment.RESEND_API_KEY||'').trim();
 const id=String(environment.CRM_SYNC_INBOUND_SMOKE_ID||'').trim();
 if(!token)throw new Error('Missing RESEND_API_KEY');
 if(!UUID.test(id))throw new Error('Missing or invalid internal inbound smoke ID');
 const data=await requestJson('https://api.resend.com/emails/receiving/'+id,{
  headers:{authorization:'Bearer '+token}
 });
 if(data?.id!==id || !Array.isArray(data.to) ||
    !data.to.some(v=>mailbox(v)===PUTKIKASVU_INGRESS) ||
    !mailbox(data.from) || !Number.isFinite(Date.parse(data.created_at||'')))
  throw new Error('Resend inbound metadata check failed');
 if(!data.headers || (typeof data.headers!=='object') || Array.isArray(data.headers))
  throw new Error('Resend inbound headers missing or wrong shape');
 const names=Object.keys(data.headers).map(k=>k.toLowerCase());
 const hasThreadingHeader=names.some(n=>n==='in-reply-to'||n==='references');
 // The smoke never claims a real prospect reply was matched.
 return {mode:'read-only',verified:true,headerShape:'object',
  hasThreadingHeader,crmWrites:0,outboundSends:0};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
 verifyResendInboundReadOnly().then(result=>console.log(JSON.stringify(result)))
  .catch(()=>{console.error('FAIL inbound auth smoke; check protected configuration and provider access');process.exitCode=1;});
}
