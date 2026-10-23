import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyResendInboundReadOnly} from '../integrations/crm-sync-resend-inbound-auth-smoke.mjs';

globalThis.fetch=async()=>{throw new Error('Native network is prohibited');};
const id='550e8400-e29b-41d4-a716-446655440000';
const environment={
 CRM_SYNC_ENV:'test',CRM_SYNC_WRITE:'false',
 CRM_SYNC_TEST_SHEET_ID:'isolated-fixture',CRM_SYNC_TEST_TAB:'TEST CRM',
 CRM_SYNC_REPLY_SOURCE:'resend',
 CRM_SYNC_RECEIVING_ADDRESS:'04687389@pixoosal.resend.app',
 CRM_SYNC_INBOUND_SMOKE_ID:id,RESEND_API_KEY:'fixture-only-never-a-secret'
};
const msg={
 id,to:['04687389@pixoosal.resend.app'],
 from:'Fixture Sender <sender@example.invalid>',
 created_at:'2026-10-23T08:32:06.938Z',
 headers:{'Message-ID':'<abc@example.invalid>','Received':'from fixture.invalid'},
 text:'private simulated email body'
};
test('read-only authenticated inbound shape probe returns only safe flags',async()=>{
 let count=0;
 const r=await verifyResendInboundReadOnly({environment,requestJson:async(url,opts)=>{
  count++;
  assert.equal(url,'https://api.resend.com/emails/receiving/'+id);
  assert.equal(opts.headers.authorization,'Bearer fixture-only-never-a-secret');
  assert.equal(opts.method,undefined);
  return msg;
 }});
 assert.deepEqual(r,{mode:'read-only',verified:true,headerShape:'object',
  hasThreadingHeader:false,crmWrites:0,outboundSends:0});
 assert.equal(count,1);
 assert.equal(JSON.stringify(r).includes('private simulated'),false);
});
test('threading flag does not automatically claim prospect matched',async()=>{
 const r=await verifyResendInboundReadOnly({environment,
  requestJson:async()=>({...msg,headers:{'In-Reply-To':'<outbound@example.invalid>'}})});
 assert.equal(r.hasThreadingHeader,true);
 assert.equal(r.crmWrites,0);
});
test('all missing or unauthorized configuration fails before touching network',async()=>{
 for(const updates of [
  {CRM_SYNC_WRITE:'test-only'},
  {CRM_SYNC_ENV:'production'},
  {CRM_SYNC_REPLY_SOURCE:'gmail'},
  {CRM_SYNC_RECEIVING_ADDRESS:'other@resend.app'},
  {CRM_SYNC_INBOUND_SMOKE_ID:'malformed'},
  {RESEND_API_KEY:''}
 ]){
  let requests=0;
  await assert.rejects(verifyResendInboundReadOnly({environment:{...environment,...updates},
   requestJson:async()=>{requests++;return msg;}}));
  assert.equal(requests,0);
 }
});
test('unexpected sender, recipient, timestamp, schema or headers abort',async()=>{
 for(const invalid of [
  {...msg,id:'wrong'},
  {...msg,from:'not an address'},
  {...msg,to:['other@resend.app']},
  {...msg,created_at:'invalid'},
  {...msg,headers:undefined},
  {...msg,headers:['non-object']}
 ]){
  await assert.rejects(verifyResendInboundReadOnly({
   environment,requestJson:async()=>invalid
  }));
 }
});
