import test from 'node:test';
import assert from 'node:assert/strict';
import {runTestSync} from '../integrations/crm-sync-test-runner.mjs';
const environment={CRM_SYNC_ENV:'test',CRM_SYNC_TEST_SHEET_ID:'1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc',CRM_SYNC_TEST_TAB:'TEST CRM',CRM_SYNC_WRITE:'test-only'};
const grid=[['Yritys','Vastaanottaja','Resend ID'],['Fixture','fixture@example.invalid','test-id','sent']];
const update={range:"'TEST CRM'!D2:I2",values:[['delivered','Ei saatavilla','Ei saatavilla','Ei löydetty','Odottaa vastausta','2026-10-23T01:00:00Z']]};
test('test runner writes to isolated CRM exactly once on replay',async()=>{
 let ledger='';let writes=0;
 const requestJson=async(url,opts)=> {
   if(url.includes('/values/'))return {values:[grid[0],[...Array.from({length:10},(_,i)=>grid[1][i]??''),ledger]]};
   if(url.includes('/values:batchUpdate')){writes++;const b=JSON.parse(opts.body);ledger=b.data.find(x=>x.range==="'TEST CRM'!K2").values[0][0];return {totalUpdatedCells:8};}
   throw new Error('Unexpected network URL');
 };
 const tokens={sheet:async()=> 'test-token'};
 const planner=async({environment:env})=>{assert.equal(env.CRM_SYNC_WRITE,'false');return {mode:'dry-run',updated:0,updates:[update]};};
 const args={environment,requestJson,tokens,planner};
 const a=await runTestSync(args);const b=await runTestSync(args);
 assert.deepEqual([a.updated,b.updated,writes],[1,0,1]);
});
test('reject non-test write target before network calls',async()=>{
 await assert.rejects(()=>runTestSync({environment:{...environment,CRM_SYNC_TEST_SHEET_ID:'production'},requestJson:()=>assert.fail('network'),tokens:{sheet:()=>assert.fail('OAuth')}}),/outside|Wrong test target/);
});
