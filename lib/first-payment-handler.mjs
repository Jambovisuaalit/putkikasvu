import {timingSafeEqual} from 'node:crypto';
import {runFirstPayment} from './first-payment-agent.mjs';
const LIMIT=128000;
const reply=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
export async function handleFirstPayment(request,env) {
 if(!env.FIRST_PAYMENT_AGENT_TOKEN || !env.FIRST_PAYMENT_SCOPE_JSON)return reply(503,{error:'agent_not_configured'});
 const token=request.headers.get('authorization')||'';const expected=`Bearer ${env.FIRST_PAYMENT_AGENT_TOKEN}`;
 if(Buffer.byteLength(token)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(token),Buffer.from(expected)))return reply(401,{error:'unauthorized'});
 if(request.method!=='POST')return reply(405,{error:'method_not_allowed'});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'json_required'});
 let body;try {
  const reader=request.body?.getReader();if(!reader)return reply(400,{error:'missing_snapshot'});
  const chunks=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>LIMIT){await reader.cancel();return reply(413,{error:'snapshot_too_large'});}chunks.push(value);}
  body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
 }catch{return reply(400,{error:'invalid_snapshot'});}
 try {
  const scope=JSON.parse(env.FIRST_PAYMENT_SCOPE_JSON);
  if(!Array.isArray(scope)||scope.length!==2)return reply(503,{error:'invalid_agent_scope'});
  for(const record of body.crm?.records||[]) {
   const allowed=scope.find(r=>r.id===record.id);
   if(!allowed||record.recipient!==allowed.recipient||record.company!==allowed.company||JSON.stringify(record.sentMessageIds)!==JSON.stringify(allowed.sentMessageIds))return reply(403,{error:'scope_mismatch'});
  }
  // The server supplies time. Incoming mail and CRM fields are data, never tools or instructions.
  return reply(200,runFirstPayment({crm:body.crm,mailbox:body.mailbox,now:Date.now()}));
 }catch{return reply(422,{error:'snapshot_not_current_or_invalid'});}
}
