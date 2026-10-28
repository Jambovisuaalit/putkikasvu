import test from 'node:test';
import assert from 'node:assert/strict';
import { STANDARD, buildDepositRequest, confirmDeposit } from '../lib/first-payment.mjs';

const approved = Object.freeze({
  orderNumber:'PK-TEST-001',
  offerNumber:'PK-OFFER-TEST-001',
  status:'ACCEPTED',
  offerAccepted:true,
  termsAccepted:true,
  buyerAuthorized:true,
  acceptanceEvidence:'recorded written acceptance',
  termsVersion:'v1.2',
  buyerCompany:'Testi LVI Oy',
  buyerBusinessId:'0000000-0',
  representativeName:'Test Buyer',
  buyerEmail:'buyer@example.invalid',
  deliveryScope:'Up to three company webpages',
  deliverySchedule:'Agreed in writing upon materials received',
  totalCents:59000,
  currency:'EUR'
});

test('Standard amount and deposit are exactly 590/295 EUR',()=>{
  assert.equal(STANDARD.totalCents,59000);
  assert.equal(STANDARD.depositCents,29500);
  assert.equal(STANDARD.finalCents,29500);
  assert.equal(STANDARD.currency,'EUR');
});
test('deposit email requires written acceptance and order details',()=>{
  for(const diff of [
    {status:'LEAD'}, {offerAccepted:false}, {termsAccepted:false},
    {buyerAuthorized:false}, {acceptanceEvidence:''}, {offerNumber:''},
    {buyerEmail:'not-an-email'}, {deliverySchedule:''},
    {totalCents:99000}, {currency:'USD'}
  ]){
    assert.throws(()=>buildDepositRequest({...approved,...diff}));
  }
});
test('creates draft for verified approval, not a payment confirmation',()=>{
  const draft=buildDepositRequest(approved);
  assert.equal(draft.nextStatus,'DEPOSIT_REQUESTED');
  assert.equal(draft.amountCents,29500);
  assert.equal(draft.to,'buyer@example.invalid');
  assert.ok(draft.text.includes(STANDARD.depositCheckoutUrl));
  assert.ok(draft.text.includes('Maksun kirjaaminen vahvistetaan erikseen'));
  assert.ok(!draft.text.includes('DEPOSIT_PAID'));
});
test('cannot mark payment paid without exact independent Revolut Pro evidence',()=>{
  const pending={...approved,status:'DEPOSIT_REQUESTED'};
  const good={source:'REVOLUT_PRO_OWNER_VERIFIED',status:'COMPLETED',orderNumber:approved.orderNumber,transactionId:'tx-test-001',amountCents:29500,currency:'EUR'};
  for(const diff of [
    {source:'CUSTOMER_EMAIL'}, {source:'SCREENSHOT'}, {status:'PENDING'},
    {orderNumber:'OTHER'}, {amountCents:29400}, {currency:'USD'},
    {transactionId:''}
  ]) assert.throws(()=>confirmDeposit(pending,{...good,...diff}));
  assert.throws(()=>confirmDeposit(pending,good,['tx-test-001']));
  assert.throws(()=>confirmDeposit(approved,good));
  assert.deepEqual(confirmDeposit(pending,good).status,'DEPOSIT_PAID');
});
