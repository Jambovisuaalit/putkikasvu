import test from 'node:test';
import assert from 'node:assert/strict';
import {runSync} from '../integrations/crm-sync.mjs';
import {readConfig} from '../integrations/crm-sync-config.mjs';
import {inboundMetadata,mailbox,listInboundReplyMetadata,PUTKIKASVU_INGRESS} from '../integrations/resend-inbound.mjs';

// No network, outbound delivery, provider tokens or production CRM.
globalThis.fetch=async()=>{throw new Error('Unexpected network I/O');};
const original='<outbound-fixture@example.invalid>';
const sentAt='2026-10-22T10:00:00.000Z';
const after='2026-10-22T10:01:00.000Z';
const env={
 CRM_SYNC_ENV:'test',CRM_SYNC_TEST_SHEET_ID:'isolated-synthetic-sheet',
 CRM_SYNC_TEST_TAB:'TEST CRM',CRM_SYNC_WRITE:'false',
 CRM_SYNC_FIXTURE_MODE:'true',CRM_SYNC_REPLY_SOURCE:'resend',
 CRM_SYNC_RECEIVING_ADDRESS:PUTKIKASVU_INGRESS
};
const grid=[['Yritys','Vastaanottaja','Resend ID'],
 ['Fixture Company','prospect@example.invalid','outbound-fixture','delivered']];
const entry={
 id:'inbound-fixture',to:[PUTKIKASVU_INGRESS],
 from:'Test Prospect <prospect@example.invalid>',created_at:after
};
const full={
 ...entry,headers:{'In-Reply-To':original,'References':'<another@example.invalid> '+original},
 text:'This is a fake body that must never be exposed in the CRM.'
};
function fake({items=[entry],detail=full,hasMore=false,pages,rows=grid}={}){
 const calls=[];
 const requestJson=async(raw,options={})=>{
  const url=new URL(raw);calls.push({url,options});
  assert.equal(options.method||'GET','GET');
  if(url.hostname==='sheets.googleapis.com')return {values:rows};
  if(url.hostname==='gmail.googleapis.com')throw new Error('Gmail not needed in Resend-only mode');
  if(url.pathname==='/emails/outbound-fixture')
   return {message_id:original,created_at:sentAt,last_event:'delivered'};
  if(url.pathname==='/emails/receiving'){
   if(pages)return pages(url.searchParams.get('after'));
   return {data:items,has_more:hasMore};
  }
  if(url.pathname==='/emails/receiving/inbound-fixture')return detail;
  throw new Error('Unexpected read '+url);
 };
 return {calls,requestJson,options:{
  environment:env,requestJson,tokens:{sheet:async()=>'fixture-sheet',gmail:async()=>assert.fail('No Gmail OAuth')},
  now:()=>new Date(after)
 }};
}
test('isolated worker matches actual inbound metadata by sender, original Message-ID and time',async()=>{
 const {calls,options}=fake();
 const result=await runSync(options);
 assert.equal(result.mode,'dry-run');
 assert.equal(result.updated,0);
 assert.equal(result.candidates,1);
 assert.deepEqual(result.updates[0],{
  range:"'TEST CRM'!D2:I2",
  values:[['delivered','Ei saatavilla','Ei saatavilla','Vastaus tunnistettu','Vastannut',after]]
 });
 assert.equal(calls.filter(c=>c.url.pathname==='/emails/receiving').length,1);
 assert.equal(calls.filter(c=>c.url.pathname==='/emails/receiving/inbound-fixture').length,1);
 assert.equal(JSON.stringify(result).includes('fake body'),false);
 assert.ok(calls.every(c=>(c.options.method||'GET')==='GET'));
 const replay=await runSync(options);
 assert.deepEqual(replay,result);
});
test('forwarded message with no reply headers must not be mistaken for a reply',async()=>{
 const data={...full,headers:{'Message-ID':'<fresh@example.invalid>'}};
 const result=await runSync(fake({detail:data}).options);
 assert.equal(result.updates[0].values[0][3],'Ei löydetty');
});
test('unrelated sender, receiving address or timestamps do not advance a CRM row',async()=>{
 const cases=[
  {entry:{...entry,from:'stranger@example.invalid'},detail:full},
  {entry:{...entry,to:['other@resend.app']},detail:full},
  {entry,detail:{...full,from:'stranger@example.invalid'}},
  {entry,detail:{...full,created_at:'2026-10-20T00:00:00.000Z'}},
  {entry,detail:{...full,headers:{'In-Reply-To':'<unrelated@example.invalid>'}}},
 ];
 for(const c of cases){
  if(c.detail.from!==c.entry.from && c.entry.from===entry.from){
   await assert.rejects(runSync(fake({items:[c.entry],detail:c.detail}).options),/metadata mismatch/);
  }else{
   const result=await runSync(fake({items:[c.entry],detail:c.detail}).options);
   assert.equal(result.updates[0].values[0][3],'Ei löydetty');
  }
 }
});
test('paginates with cursor and rejects incomplete or malformed history',async()=>{
 const reader=(pages)=>listInboundReplyMetadata({
  requestJson:async(raw)=>{
   const url=new URL(raw);
   if(url.pathname==='/emails/receiving')return pages(url.searchParams.get('after'));
   if(url.pathname==='/emails/receiving/inbound-fixture')return full;
   throw Error('Unexpected endpoint');
  },
  token:'fixture',recipients:['prospect@example.invalid'],maxPages:2
 });
 const two=await reader(afterCursor=>afterCursor
 ? {data:[entry],has_more:false}
 : {data:[{id:'other-id',to:[PUTKIKASVU_INGRESS],from:'nobody@example.invalid'}],has_more:true});
 assert.equal(two.length,1);
 await assert.rejects(reader(()=>({data:[entry],has_more:true})),/pagination limit reached|Repeated Resend/);
 await assert.rejects(reader(()=>({data:[],has_more:true})),/pagination stopped/);
 await assert.rejects(reader(()=>({data:[]})),/Unexpected Resend inbound list/);
});
test('configuration cannot be redirected to another inbox or production',async()=>{
 assert.equal(readConfig(env).replySource,'resend');
 for(const bad of [
  {...env,CRM_SYNC_RECEIVING_ADDRESS:'elsewhere@resend.app'},
  {...env,CRM_SYNC_REPLY_SOURCE:'unknown'},
  {...env,CRM_SYNC_ENV:'production'},
  {...env,CRM_SYNC_WRITE:'true'}
 ]){
  await assert.rejects(runSync({environment:bad,tokens:{sheet:()=>assert.fail('No OAuth')}}));
 }
});
test('inbound metadata parser handles display names, case-insensitive headers and rejects ambiguous addresses',()=>{
 assert.equal(mailbox('Person <PROSPECT@example.invalid>'),'prospect@example.invalid');
 assert.equal(mailbox('a@example.invalid,b@example.invalid'),'');
 assert.deepEqual(inboundMetadata({from:'Test <prospect@example.invalid>',created_at:after,
  headers:[{name:'REFERENCES',value:original},{name:'in-reply-to',value:original}]}),{
   from:'prospect@example.invalid',receivedAtMs:Date.parse(after),
   references:[original],inReplyTo:original
  });
});
