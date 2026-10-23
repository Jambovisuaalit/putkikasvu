import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesReply,mergeEvent,safeMetrics,sheetRowIndex} from '../integrations/crm-sync-core.mjs';
test('only matching sender with real In-Reply-To after send qualifies',()=>{
 const msg={from:'PROSPECT@EXAMPLE.COM',inReplyTo:'<sent@id>',receivedAtMs:2000};
 assert.equal(matchesReply(msg,'prospect@example.com','<sent@id>',1000),true);
 assert.equal(matchesReply({...msg,inReplyTo:'<other>'},'prospect@example.com','<sent@id>',1000),false);
 assert.equal(matchesReply({...msg,receivedAtMs:500},'prospect@example.com','<sent@id>',1000),false);
 assert.equal(matchesReply({...msg,from:'stranger@example.com'},'prospect@example.com','<sent@id>',1000),false);
});
test('delivery state does not regress',()=>{assert.equal(mergeEvent('delivered','sent'),'delivered');assert.equal(mergeEvent('delivered','bounced'),'bounced');});
test('unknown engagement never becomes zero',()=>{assert.deepEqual(safeMetrics({}),{opened:'Ei saatavilla',clicked:'Ei saatavilla'});assert.deepEqual(safeMetrics({opened:0,clicked:2}),{opened:0,clicked:2});});
test('duplicate or missing message IDs prevent writes',()=>{assert.equal(sheetRowIndex([['header'],['A','x','id']],'id'),2);assert.throws(()=>sheetRowIndex([['header'],['A','x','id'],['B','y','id']],'id'));assert.throws(()=>sheetRowIndex([['header']],'id'));});
