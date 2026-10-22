import test from 'node:test';
import assert from 'node:assert/strict';
import {createPilot} from '../tools/manual-pilot/workflow.mjs';
const at='2026-10-22T09:00:00.000Z', by='synthetic-owner';
const reference='PK-SYNTHETIC-001';
const offer={customerId:'SYNTHETIC-CUSTOMER-A',companyName:'Synteettinen Putki Oy',offerVersion:'offer-v1',termsVersion:'terms-v1'};
const acceptance={acceptedBy:'Synteettinen tilaaja',at,offerVersion:'offer-v1',termsVersion:'terms-v1',evidenceRef:'synthetic://acceptance/001'};
function transaction(id='SYN-TXN-DEPOSIT',patch={}) {
 return {id,synthetic:true,source:'synthetic_provider_ledger',status:'settled',refunded:false,disputed:false,grossCents:29500,feeCents:350,netCents:29150,currency:'EUR',payeeAccountId:'SYNTHETIC-PRO-ACCOUNT',customerId:offer.customerId,orderReference:reference,installment:'deposit',paidAt:at,settledAt:at,...patch};
}
function setup(rows=[transaction(),transaction('SYN-TXN-BALANCE',{installment:'balance'})],mode='synthetic') {
 let count=0;
 const pilot=createPilot({mode,sellerAccountId:'SYNTHETIC-PRO-ACCOUNT',reviewers:[by],ledger:rows,referenceFactory:mode==='synthetic'?()=>count++?reference+'-B':reference:undefined,now:()=>at});
 const order=pilot.createOrder(offer,by);return {pilot,id:order.id};
}
const accept=(p,id)=>p.acceptOffer(id,acceptance,by);
const pay=(p,id,installment='deposit',transactionId='SYN-TXN-DEPOSIT',actor=by)=>p.verifyPayment(id,{installment,transactionId,evidenceRef:'synthetic://review/'+transactionId,expectedVersion:p.getOrder(id).version},actor);
function readyForApproval(p,id){
 accept(p,id);pay(p,id);
 p.receiveMaterials(id,{rightsConfirmed:true,evidenceRef:'synthetic://materials',contactRef:'synthetic://contact',scopeRef:'synthetic://scope'},by);
 return p.submitForApproval(id,{buildId:'synthetic-build-001',qaPassed:true,evidenceRef:'synthetic://qa'},by);
}
const approval={acceptedBy:'Synteettinen tilaaja',at,buildId:'synthetic-build-001',evidenceRef:'synthetic://build-approval'};

test('complete synthetic lifecycle: acceptance, deposit, materials, build, approval, balance, publication',()=>{
 const {pilot:p,id}=setup();readyForApproval(p,id);p.approveBuild(id,approval,by);pay(p,id,'balance','SYN-TXN-BALANCE');
 const o=p.recordSyntheticPublication(id,{buildId:approval.buildId,qaPassed:true,domainRightsConfirmed:true,evidenceRef:'synthetic://publish'},by);
 assert.equal(o.stage,'published_synthetic');assert.equal(o.payments.deposit.grossCents+o.payments.balance.grossCents,59000);
 assert.deepEqual(o.events.map(e=>e.type),['offer_created','offer_accepted','deposit_verified_synthetic','materials_received','build_submitted','build_approved','balance_verified_synthetic','publication_simulated']);
 assert.ok(o.events.every((e,i)=>e.sequence===i+1));
});
test('live mode fails closed: no fixtures, flags, free text or event payload can verify payment',()=>{
 assert.throws(()=>setup([transaction()],'live'),/LIVE_FIXTURES_FORBIDDEN/);
 const {pilot:p,id}=setup([],'live');accept(p,id);
 assert.throws(()=>pay(p,id),/LIVE_VERIFIER_NOT_CONFIGURED/);
 assert.deepEqual(p.getOrder(id).payments,{});
});
test('customer screenshot, return URL, typed note and forged transaction objects are not trusted sources',()=>{
 const {pilot:p,id}=setup([]);accept(p,id);
 for(const payload of ['customer-screenshot','return-url-success','I checked Revolut',transaction()]) {
  assert.throws(()=>pay(p,id,'deposit',payload),/TRUSTED_TRANSACTION_NOT_FOUND/);
 }
 assert.equal(p.getOrder(id).stage,'awaiting_deposit');
});
for(const [name,patch,expected] of [
 ['pending',{status:'pending'},'PAYMENT_NOT_SETTLED'],['authorised',{status:'authorised'},'PAYMENT_NOT_SETTLED'],
 ['failed',{status:'failed'},'PAYMENT_NOT_SETTLED'],['refunded',{refunded:true},'PAYMENT_NOT_SETTLED'],['disputed',{disputed:true},'PAYMENT_NOT_SETTLED'],
 ['wrong amount',{grossCents:29499},'PAYMENT_AMOUNT_MISMATCH'],['overpayment',{grossCents:59000},'PAYMENT_AMOUNT_MISMATCH'],['currency',{currency:'USD'},'PAYMENT_AMOUNT_MISMATCH'],
 ['wrong receiver',{payeeAccountId:'OTHER-ACCOUNT'},'PAYMENT_IDENTITY_MISMATCH'],['wrong customer',{customerId:'OTHER-CUSTOMER'},'PAYMENT_IDENTITY_MISMATCH'],['wrong order',{orderReference:'OTHER-ORDER'},'PAYMENT_IDENTITY_MISMATCH'],
 ['wrong installment',{installment:'balance'},'PAYMENT_TIME_OR_INSTALLMENT_MISMATCH'],['future settlement',{settledAt:'2040-01-01T00:00:00Z'},'PAYMENT_TIME_OR_INSTALLMENT_MISMATCH'],
 ['before acceptance',{paidAt:'2026-01-01T00:00:00Z'},'PAYMENT_TIME_OR_INSTALLMENT_MISMATCH'],['net used as gross',{grossCents:29150},'PAYMENT_AMOUNT_MISMATCH'],['fee mismatch',{netCents:29500},'PAYMENT_FEE_MISMATCH']
])test('reject '+name+' without mutating order',()=>{
 const {pilot:p,id}=setup([transaction('SYN-TXN-DEPOSIT',patch)]);accept(p,id);const before=p.getOrder(id);
 assert.throws(()=>pay(p,id),new RegExp(expected));assert.deepEqual(p.getOrder(id),before);
});
test('missing acceptance, versions, rights and QA block progression',()=>{
 const {pilot:p,id}=setup();assert.throws(()=>pay(p,id),/INVALID_STAGE/);
 assert.throws(()=>p.acceptOffer(id,{...acceptance,offerVersion:'other-v'},by),/VERSION_MISMATCH/);
 assert.throws(()=>p.acceptOffer(id,{...acceptance,evidenceRef:''},by),/ACCEPTANCE_REQUIRED/);
 accept(p,id);pay(p,id);assert.throws(()=>p.receiveMaterials(id,{rightsConfirmed:false},by),/MATERIALS_AND_RIGHTS_REQUIRED/);
 assert.throws(()=>p.submitForApproval(id,{buildId:'build',qaPassed:true,evidenceRef:'qa-proof'},by),/INVALID_STAGE/);
});
test('balance cannot be verified before exact build approval; revisions require a new approval',()=>{
 const {pilot:p,id}=setup();readyForApproval(p,id);
 assert.throws(()=>pay(p,id,'balance','SYN-TXN-BALANCE'),/INVALID_STAGE/);
 assert.throws(()=>p.approveBuild(id,{...approval,buildId:'wrong-build'},by),/BUILD_VERSION_MISMATCH/);
 p.requestRevision(id,{evidenceRef:'synthetic://revision'},by);
 assert.throws(()=>p.approveBuild(id,approval,by),/INVALID_STAGE/);
 p.submitForApproval(id,{buildId:'new-build',qaPassed:true,evidenceRef:'synthetic://qa2'},by);
 assert.throws(()=>p.approveBuild(id,approval,by),/BUILD_VERSION_MISMATCH/);
 p.approveBuild(id,{...approval,buildId:'new-build'},by);assert.equal(pay(p,id,'balance','SYN-TXN-BALANCE').stage,'ready_to_publish');
});
test('one transaction cannot settle both installments or another order; retry is idempotent',()=>{
 const {pilot:p,id}=setup();accept(p,id);const once=pay(p,id);assert.deepEqual(pay(p,id),once);
 assert.throws(()=>pay(p,id,'balance'),/TRANSACTION_ALREADY_ASSIGNED/);
 const other=p.createOrder({...offer,customerId:'OTHER-CUSTOMER'},by);accept(p,other.id);
 assert.throws(()=>pay(p,other.id),/TRANSACTION_ALREADY_ASSIGNED/);
});
test('only named reviewers can act; stale order version is rejected',()=>{
 const {pilot:p,id}=setup();accept(p,id);
 assert.throws(()=>pay(p,id,'deposit','SYN-TXN-DEPOSIT','unknown-person'),/UNAUTHORIZED/);
 assert.throws(()=>p.verifyPayment(id,{installment:'deposit',transactionId:'SYN-TXN-DEPOSIT',evidenceRef:'synthetic://review',expectedVersion:0},by),/STALE_ORDER_VERSION/);
});
test('refund/dispute incident blocks publication and preserves history',()=>{
 const {pilot:p,id}=setup();readyForApproval(p,id);p.approveBuild(id,approval,by);pay(p,id,'balance','SYN-TXN-BALANCE');
 const o=p.recordIncident(id,{reason:'Synthetic refund discovered',evidenceRef:'synthetic://refund'},by);
 assert.equal(o.events.at(-1).type,'order_held');assert.equal(o.payments.deposit.grossCents,29500);
 assert.throws(()=>p.recordSyntheticPublication(id,{buildId:approval.buildId,qaPassed:true,domainRightsConfirmed:true,evidenceRef:'synthetic://publish'},by),/ORDER_ON_HOLD/);
});
test('public snapshots and input fixtures cannot mutate internal payment or audit state',()=>{
 const rows=[transaction()],{pilot:p,id}=setup(rows);rows[0].grossCents=1;accept(p,id);pay(p,id);
 const o=p.getOrder(id);assert.throws(()=>{o.payments.deposit.grossCents=0},TypeError);assert.throws(()=>o.events.push({}),TypeError);
 assert.equal(p.getOrder(id).payments.deposit.grossCents,29500);
});
test('publication requires both verified payments, exact approved build, rights and QA',()=>{
 const {pilot:p,id}=setup();readyForApproval(p,id);p.approveBuild(id,approval,by);
 assert.throws(()=>p.recordSyntheticPublication(id,{},by),/INVALID_STAGE/);pay(p,id,'balance','SYN-TXN-BALANCE');
 for(const patch of [{buildId:'other'},{domainRightsConfirmed:false},{qaPassed:false}])assert.throws(()=>p.recordSyntheticPublication(id,{buildId:approval.buildId,qaPassed:true,domainRightsConfirmed:true,evidenceRef:'synthetic://publish',...patch},by),/PUBLICATION_GATES_REQUIRED/);
});
test('only explicitly synthetic, unique fixture transactions can enter the test authority',()=>{
 assert.throws(()=>setup([transaction(),transaction()]),/INVALID_FIXTURE/);
 assert.throws(()=>setup([transaction('real-ish',{synthetic:false})]),/INVALID_FIXTURE/);
 assert.throws(()=>setup([transaction('wrong-source',{source:'customer_receipt'})]),/INVALID_FIXTURE/);
});
test('acceptance cannot be future-dated or backdated before the offer',()=>{
 const {pilot:p,id}=setup();
 for(const value of ['2040-01-01T00:00:00Z','2020-01-01T00:00:00Z','not-a-date'])assert.throws(()=>p.acceptOffer(id,{...acceptance,at:value},by),/ACCEPTANCE_REQUIRED/);
 assert.equal(p.getOrder(id).stage,'offer');
});
test('balance payment must postdate exact build acceptance, not only the original offer',()=>{
 const {pilot:p,id}=setup([transaction(),transaction('SYN-TXN-BALANCE',{installment:'balance',paidAt:'2026-10-22T08:59:59Z'})]);
 readyForApproval(p,id);p.approveBuild(id,approval,by);
 assert.throws(()=>pay(p,id,'balance','SYN-TXN-BALANCE'),/PAYMENT_TIME_OR_INSTALLMENT_MISMATCH/);
});
test('valid materials do not bypass QA and missing review evidence cannot verify payment',()=>{
 const {pilot:p,id}=setup();accept(p,id);
 assert.throws(()=>p.verifyPayment(id,{installment:'deposit',transactionId:'SYN-TXN-DEPOSIT',evidenceRef:'',expectedVersion:2},by),/REVIEW_RECORD_REQUIRED/);
 pay(p,id);p.receiveMaterials(id,{rightsConfirmed:true,evidenceRef:'synthetic://materials',contactRef:'synthetic://contact',scopeRef:'synthetic://scope'},by);
 assert.throws(()=>p.submitForApproval(id,{buildId:'build-001',qaPassed:false,evidenceRef:'synthetic://qa'},by),/BUILD_QA_REQUIRED/);
});
test('network and disk APIs are not used by offline simulator and frontend never imports it',async()=>{
 const {readFileSync,readdirSync}=await import('node:fs');
 const module=readFileSync(new URL('../tools/manual-pilot/workflow.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(module,/fetch\s*\(|node:fs|node:http|node:https|process\.env|localStorage|sessionStorage/);
 const scan=dir=>readdirSync(new URL('../'+dir,import.meta.url),{withFileTypes:true}).forEach(e=>e.isDirectory()?scan(dir+'/'+e.name):assert.doesNotMatch(readFileSync(new URL('../'+dir+'/'+e.name,import.meta.url),'utf8'),/manual-pilot\/workflow/));
 scan('app');
});
