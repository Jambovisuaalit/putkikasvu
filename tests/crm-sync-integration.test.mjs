import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesReply,mergeEvent,safeMetrics,sheetRowIndex} from '../integrations/crm-sync-core.mjs';

// Deterministic isolated integration rehearsal: no network, no credentials, no real CRM writes.
const sent={id:'resend-fixture-1',messageId:'<fixture-message@example.invalid>',to:'prospect@example.invalid',sentAt:1000};
const grid=[['Yritys','Vastaanottaja','Resend ID'],['Test Prospect',sent.to,sent.id]];
test('provider fixtures resolve to one row and preserve accurate metrics',()=>{
 const row=sheetRowIndex(grid,sent.id);
 const state=mergeEvent('sent','delivered');
 const metrics=safeMetrics({opened:1,clicked:0});
 assert.equal(row,2);assert.equal(state,'delivered');
 assert.deepEqual(metrics,{opened:1,clicked:0});
});
test('only genuine reply headers can advance prospect',()=>{
 const valid={from:sent.to,inReplyTo:sent.messageId,receivedAtMs:2000};
 const unrelated={...valid,inReplyTo:'<unrelated@example.invalid>'};
 assert.equal(matchesReply(valid,sent.to,sent.messageId,sent.sentAt),true);
 assert.equal(matchesReply(unrelated,sent.to,sent.messageId,sent.sentAt),false);
});
test('replaying same event is idempotent',()=>{
 assert.equal(mergeEvent(mergeEvent('sent','delivered'),'delivered'),'delivered');
});
test('duplicate IDs fail closed',()=>{
 assert.throws(()=>sheetRowIndex([...grid,['Other',sent.to,sent.id]],sent.id));
});
