import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareTestWrites,writeTestUpdates} from '../integrations/crm-sync-test-writer.mjs';
const env={CRM_SYNC_ENV:'test',CRM_SYNC_TEST_SHEET_ID:'1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc',CRM_SYNC_TEST_TAB:'TEST CRM',CRM_SYNC_WRITE:'test-only'};
const row=['Fixture','fixture@example.invalid','synthetic-001','sent','','','','','','',''];
const grid=[['Yritys','Vastaanottaja','Resend ID','','','','','','','',''],row];
const update={range:"'TEST CRM'!D2:I2",values:[['delivered','Ei saatavilla','Ei saatavilla','Ei löydetty','Odottaa vastausta','2026-10-23T00:00:00Z']]};
test('test-only writer targets the isolated workbook and persists fingerprint in K',()=>{
 const p=prepareTestWrites({environment:env,grid,updates:[update]});
 assert.equal(p.updated,1);assert.equal(p.data[1].range,"'TEST CRM'!K2");
 const repeated=prepareTestWrites({environment:env,grid:[grid[0],[...row.slice(0,10),p.data[1].values[0][0]]],updates:[update]});
 assert.equal(repeated.updated,0);
});
test('production destination and blank approval both rejected',()=>{
 assert.throws(()=>prepareTestWrites({environment:{...env,CRM_SYNC_TEST_SHEET_ID:'other'},grid,updates:[update]}),/Unapproved|outside dedicated/);
 assert.throws(()=>prepareTestWrites({environment:{...env,CRM_SYNC_WRITE:'false'},grid,updates:[update]}),/blocked|explicitly/);
 assert.throws(()=>prepareTestWrites({environment:env,grid:[grid[0],['Real','real@example.com','id']],updates:[update]}),/Non-synthetic/);
});
test('duplicate or wrong row cannot be written',()=>{
 assert.throws(()=>prepareTestWrites({environment:env,grid,updates:[update,update]}),/Duplicate/);
 assert.throws(()=>prepareTestWrites({environment:env,grid,updates:[{...update,range:"'TEST CRM'!D3:I3"}]}),/outside/);
});
test('mock API receives one batch with CRM range and ledger together',async()=>{
 const calls=[];const requestJson=async(u,o)=>{calls.push([u,o]);return {totalUpdatedCells:7};};
 const result=await writeTestUpdates({environment:env,requestJson,token:'fixture-token',grid,updates:[update]});
 assert.equal(result.updated,1);assert.equal(calls.length,1);
 assert.equal(calls[0][1].method,'POST');const body=JSON.parse(calls[0][1].body);
 assert.deepEqual(body.data.map(x=>x.range),["'TEST CRM'!K1","'TEST CRM'!D2:I2","'TEST CRM'!K2"]);
});
