import test from "node:test";
import assert from "node:assert/strict";
import {
 ApiProblem,backendReady,isUuid,orderReference,sameCustomer,
 validateOnboarding,validatePayment,readLimitedJson
} from "../lib/server/secure-orders.ts";
const id="e0ce1224-97ac-47c4-9d94-a8d9f620812a";
const other="94c615de-54f2-4f26-a7f4-5db90e8d6687";
test("backend defaults to OFF without explicit configuration",()=>{
 assert.equal(backendReady(),false);
});
test("order references are non-sequential and fixed format",()=>{
 const refs=new Set(Array.from({length:200},orderReference));
 assert.equal(refs.size,200);
 for(const x of refs)assert.match(x,/^PK-[A-F0-9]{16}$/);
});
test("customer identity requires exact authenticated owner UUID",()=>{
 assert.ok(isUuid(id));
 assert.equal(sameCustomer(id,id),true);
 assert.equal(sameCustomer(id,other),false);
 assert.equal(sameCustomer("x",id),false);
});
test("valid structured onboarding is normalized",()=>{
 const form=validateOnboarding({orderId:id,phone:" 040   123 4567 ",serviceArea:"Helsinki",
 openingHours:"Arkisin 8-16",services:[" Putkityöt ","LVI-huollot"],notes:"",rightsConfirmed:false});
 assert.equal(form.order_id,id);
 assert.equal(form.contact_phone,"040 123 4567");
 assert.deepEqual(form.services,["Putkityöt","LVI-huollot"]);
});
test("missing or oversized onboarding fields fail closed",()=>{
 const good={orderId:id,phone:"0401234567",serviceArea:"Uusimaa",openingHours:"Ma-Pe 8-16",services:["Putkityöt"]};
 assert.throws(()=>validateOnboarding({...good,orderId:other+"x"}),ApiProblem);
 assert.throws(()=>validateOnboarding({...good,notes:"x".repeat(1201)}),ApiProblem);
 assert.throws(()=>validateOnboarding({...good,services:[]}),ApiProblem);
 assert.throws(()=>validateOnboarding({...good,services:["x".repeat(101)]}),ApiProblem);
});
test("payment is only accepted for 29500 cents EUR and valid external evidence",()=>{
 const good={orderId:id,installment:"deposit",transactionId:"revolut-txn-123",
 grossAmountCents:29500,currency:"EUR",evidenceNote:"Revolut Pro verified manually",paidAt:"2026-10-20T12:00:00.000Z"};
 assert.equal(validatePayment(good).grossCents,29500);
 assert.throws(()=>validatePayment({...good,grossAmountCents:59000}),ApiProblem);
 assert.throws(()=>validatePayment({...good,currency:"GBP"}),ApiProblem);
 assert.throws(()=>validatePayment({...good,installment:"refund"}),ApiProblem);
 assert.throws(()=>validatePayment({...good,transactionId:"1"}),ApiProblem);
 assert.throws(()=>validatePayment({...good,paidAt:"2040-01-01"}),ApiProblem);
});
test("JSON payload size cap rejects oversized bodies",async()=>{
 const req=new Request("https://example.test/api/onboarding",{method:"POST",
  headers:{"content-type":"application/json"},body:JSON.stringify({x:"y".repeat(10000)})});
 await assert.rejects(readLimitedJson(req,1000),e=>e instanceof ApiProblem&&e.status===413);
});
test("wrong content-type and malformed JSON rejected",async()=>{
 await assert.rejects(readLimitedJson(new Request("https://example.test",{method:"POST",body:"{}"})),e=>e instanceof ApiProblem&&e.status===415);
 await assert.rejects(readLimitedJson(new Request("https://example.test",{method:"POST",headers:{"content-type":"application/json"},body:"invalid"})),e=>e instanceof ApiProblem&&e.status===400);
});
