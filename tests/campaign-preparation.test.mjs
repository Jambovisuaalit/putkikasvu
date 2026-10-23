import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateProspect,prepareDraft,approveDraft} from '../integrations/campaign-preparation.mjs';
const evidence={source:'https://example.invalid/verified-source',checkedAt:'2026-10-23T08:00:00Z'};
const p={company:'Example LVI Oy',businessId:'0000000-0',contact:'info@example.invalid',contactEvidence:evidence,websiteEvidence:evidence,websiteIssueRelevant:true,observation:'Tarjouspyyntöpainike on hankala löytää mobiilissa.',staffCount:4,inUusimaa:true,legalBasisReviewed:true,providerAllowsOutreach:true,previousContactsReviewed:true,suppressionChecked:true};
test('verified prospect is ready for review but never send-authorized',()=>{
 const result=evaluateProspect(p);
 assert.equal(result.score,100);assert.equal(result.eligible,true);
 const draft=prepareDraft(p,result);
 assert.equal(draft.sendAuthorized,false);
 assert.equal(draft.status,'ready-for-review');
 assert.match(draft.text,/vasta myönteisen vastauksenne jälkeen/);
});
test('missing provenance and policy approval block drafting',()=>{
 const q={...p,providerAllowsOutreach:false,websiteEvidence:{source:'',checkedAt:''}};
 assert.equal(evaluateProspect(q).eligible,false);
 assert.throws(()=>prepareDraft(q));
});
test('opt-out always suppresses even otherwise highly ranked prospects',()=>{
 const result=evaluateProspect({...p,optOut:true});
 assert.equal(result.score,100);assert.equal(result.queueState,'suppressed');
 assert.equal(result.eligible,false);
});
test('review approval cannot authorize a send',()=>{
 const draft=prepareDraft(p);
 assert.throws(()=>approveDraft(draft,{reviewer:'reviewer',confirmedContent:true,confirmedSuppression:false,confirmedProviderPolicy:true,approvedAt:'2026-10-23T09:00:00Z'}));
 const approved=approveDraft(draft,{reviewer:'reviewer',confirmedContent:true,confirmedSuppression:true,confirmedProviderPolicy:true,approvedAt:'2026-10-23T09:00:00Z'});
 assert.equal(approved.status,'approved');
 assert.equal(approved.sendAuthorized,false);
});
