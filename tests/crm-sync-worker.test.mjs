import test from 'node:test';
import assert from 'node:assert/strict';
import {runSync} from '../integrations/crm-sync.mjs';
import {readConfig} from '../integrations/crm-sync-config.mjs';

// Any accidental native fetch (including OAuth) fails this suite; all data is synthetic.
globalThis.fetch=async()=>{throw new Error('Network forbidden in credential-free tests');};
const environment={CRM_SYNC_ENV:'test',CRM_SYNC_TEST_SHEET_ID:'synthetic-sheet',CRM_SYNC_TEST_TAB:"TEST O'Brien",CRM_SYNC_FIXTURE_MODE:'true'};
const original='<sent@example.invalid>';
const sentAt='2026-10-22T00:00:00.000Z';
const grid=()=>[['Yritys','Vastaanottaja','Resend ID'],['Fixture','prospect@example.invalid','fixture-id','delivered']];
function harness({rows=grid(),matching=true,missingMetadata=false,fail=false,paginated=false}={}) {
 const calls=[];
 const requestJson=async(raw,opts={})=>{
  const url=new URL(raw);calls.push(url);
  assert.equal(opts.method||'GET','GET');
  if(url.hostname==='sheets.googleapis.com') {
   assert.ok(url.pathname.includes('/synthetic-sheet/values/'));
   assert.equal(decodeURIComponent(url.pathname.split('/values/')[1]),"'TEST O''Brien'!A1:J");
   return {values:rows};
  }
  if(url.hostname==='api.resend.com' && url.pathname==='/emails/fixture-id')return {last_event:'delivery_delayed',...(!missingMetadata && {message_id:original,created_at:sentAt})};
  if(url.hostname==='gmail.googleapis.com' && url.pathname.endsWith('/messages')) {
   if(fail)throw new Error('synthetic provider failure');
   if(paginated && !url.searchParams.has('pageToken'))return {messages:[{id:'unrelated'}],nextPageToken:'page2'};
   return {messages:[{id:'reply'}]};
  }
  if(url.hostname==='gmail.googleapis.com' && /\/messages\/(reply|unrelated)$/.test(url.pathname)) {
   assert.equal(url.searchParams.get('format'),'metadata');
   const ref=matching && url.pathname.endsWith('/reply')?original:'<other@example.invalid>';
   return {internalDate:String(Date.parse(sentAt)+1000),payload:{headers:[
    {name:'From',value:'Test Person <prospect@example.invalid>'},
    {name:'References',value:'<older@example.invalid> '+ref}
   ]}};
  }
  assert.fail('Unexpected request '+url);
 };
 return {calls,options:{environment,requestJson,tokens:{sheet:async()=>'fixture-sheet-token',gmail:async()=>'fixture-gmail-token'},now:()=>new Date(sentAt)}};
}
test('actual worker correlates paginated reply metadata, keeps delivery state, and never writes',async()=>{
 const {calls,options}=harness({paginated:true});
 const result=await runSync(options);
 assert.equal(result.updated,0);assert.equal(result.candidates,1);
 assert.deepEqual(result.updates[0],{range:"'TEST O''Brien'!D2:I2",values:[['delivered','Ei saatavilla','Ei saatavilla','Vastaus tunnistettu','Vastannut',sentAt]]});
 assert.equal(calls.filter(x=>x.pathname.endsWith('/messages')).length,2);
 const replay=await runSync({...options,requestJson:harness({paginated:true}).options.requestJson});
 assert.deepEqual(replay,result); // repeat planning only; persistence is intentionally disabled
});
test('unrelated message never advances the row',async()=>{
 const {options}=harness({matching:false});const r=await runSync(options);
 assert.equal(r.updates[0].values[0][3],'Ei löydetty');
});
test('missing original Message-ID is explicit and does not search Gmail',async()=>{
 const {calls,options}=harness({missingMetadata:true});const r=await runSync(options);
 assert.equal(r.updates[0].values[0][3],'Kohdistustiedot puuttuvat');
 assert.equal(calls.filter(x=>x.hostname==='gmail.googleapis.com').length,0);
});
test('previous verified reply survives empty later correlation',async()=>{
 const rows=grid();rows[1][6]='Vastaus tunnistettu';
 const r=await runSync(harness({rows,matching:false}).options);
 assert.equal(r.updates[0].values[0][4],'Vastannut');
});
test('provider failure aborts instead of claiming no reply',async()=>{
 await assert.rejects(runSync(harness({fail:true}).options),/synthetic provider failure/);
});
test('duplicate IDs abort before reading Resend or Gmail',async()=>{
 const rows=grid();rows.push([...rows[1]]);const {options,calls}=harness({rows});
 await assert.rejects(runSync(options),/duplicated/);assert.equal(calls.length,1);
});
test('missing configuration, production mode and any write enablement fail before OAuth',async()=>{
 for(const env of [{},{...environment,CRM_SYNC_ENV:'production'},{...environment,CRM_SYNC_TEST_TAB:'CRM'},{...environment,CRM_SYNC_WRITE:'true'}]) {
  await assert.rejects(runSync({environment:env,tokens:{sheet:()=>assert.fail('OAuth must not run')}}));
 }
 assert.equal(readConfig(environment).sheetId,'synthetic-sheet');
});
