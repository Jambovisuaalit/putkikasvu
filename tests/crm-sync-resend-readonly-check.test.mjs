import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyResendCrmReadOnly} from '../integrations/crm-sync-resend-readonly-check.mjs';

globalThis.fetch=async()=>{throw Error('Network prohibited in credentials-free rehearsal');};
const env={
 CRM_SYNC_ENV:'test',CRM_SYNC_WRITE:'false',CRM_SYNC_REPLY_SOURCE:'resend',
 CRM_SYNC_RECEIVING_ADDRESS:'04687389@pixoosal.resend.app',
 CRM_SYNC_TEST_SHEET_ID:'1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc',
 CRM_SYNC_TEST_TAB:'TEST CRM',
 GOOGLE_SERVICE_ACCOUNT_EMAIL:'synthetic@example.invalid',
 GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:'synthetic-not-a-key',
 RESEND_API_KEY:'synthetic-not-a-key',
};
const verified=()=>({verified:true,crmWrites:0,outboundSends:0});
const plan=()=>({mode:'dry-run',updated:0,candidates:1,
 updates:[{range:"'TEST CRM'!D2:I2",values:[['delivered','Ei saatavilla','Ei saatavilla','Ei löydetty','Odottaa vastausta','2026-10-23T09:00:00.000Z']]}]});
test('one-command verifier authenticates first, plans twice, never reports writes or addresses',async()=>{
 const seq=[];
 const r=await verifyResendCrmReadOnly({
  environment:env,now:()=>new Date('2026-10-23T09:00:00.000Z'),
  smoke:async()=>{seq.push('inbound GET');return verified();},
  planner:async()=>{seq.push('dry-run');return plan();}
 });
 assert.deepEqual(seq,['inbound GET','dry-run','dry-run']);
 assert.deepEqual(r,{mode:'read-only',inboundAuthenticated:true,candidateUpdates:1,
   actualSheetWrites:0,emailsSent:0,repeatPlanIdentical:true});
 assert.equal(JSON.stringify(r).includes('synthetic@example.invalid'),false);
});
test('aborts before network unless isolated read-only and required credentials present',async()=>{
 for(const update of [
  {CRM_SYNC_ENV:'production'},
  {CRM_SYNC_WRITE:'test-only'},
  {CRM_SYNC_TEST_TAB:'CRM'},
  {CRM_SYNC_TEST_SHEET_ID:'other-sheet'},
  {CRM_SYNC_REPLY_SOURCE:'both'},
  {CRM_SYNC_FIXTURE_MODE:'true'},
  {RESEND_API_KEY:''},
  {GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:''},
  {CRM_SYNC_RECEIVING_ADDRESS:'different@resend.app'},
 ]){
  let count=0;
  await assert.rejects(verifyResendCrmReadOnly({
   environment:{...env,...update},
   smoke:async()=>{count++;return verified();},
   planner:async()=>{count++;return plan();}
  }));
  assert.equal(count,0);
 }
});
test('rejects unverified inbound smoke and unsafe planner responses',async()=>{
 for(const probe of [
  {verified:false,crmWrites:0,outboundSends:0},
  {verified:true,crmWrites:1,outboundSends:0},
  {verified:true,crmWrites:0,outboundSends:1}
 ]){
  let ran=false;
  await assert.rejects(verifyResendCrmReadOnly({
   environment:env,smoke:async()=>probe,
   planner:async()=>{ran=true;return plan();}
  }));
  assert.equal(ran,false);
 }
 for(const broken of [
   {...plan(),updated:1},
   {...plan(),mode:'test-only'},
   {...plan(),updates:[{range:"'TEST CRM'!D2:I3",values:[]}]},
   {...plan(),updates:[{range:"'PRODUCTION'!D2:I2",values:[]}]},
   {...plan(),updates:[],candidates:1},
   {...plan(),updates:[{range:"'TEST CRM'!D1:I1",values:[]}]}
 ]){
   await assert.rejects(verifyResendCrmReadOnly({
    environment:env,smoke:async()=>verified(),planner:async()=>broken
   }));
 }
});
test('replay must be identical with same frozen time',async()=>{
 let tick=0;
 await assert.rejects(verifyResendCrmReadOnly({
  environment:env,smoke:async()=>verified(),
  planner:async()=>{tick++;return {...plan(),candidates:tick,updates:
    Array.from({length:tick},(_,i)=>({range:"'TEST CRM'!D"+(i+2)+':I'+(i+2),values:[[]]}))};}
 }),/Two read-only plans differ/);
});
