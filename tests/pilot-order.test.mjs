import test from "node:test";
import assert from "node:assert/strict";
import {INITIAL,PRICE,DEPOSIT,BALANCE,transition} from "../lib/pilot-order.ts";
test("590 € hinta jakautuu 295 € + 295 €",()=>{assert.equal(PRICE,590);assert.equal(DEPOSIT,295);assert.equal(BALANCE,295)});
test("ilman hyväksyntää ei voi jatkaa",()=>assert.throws(()=>transition(INITIAL,"accept")));
test("kokonainen tilauspolku läpäistään simuloidusti",()=>{
let order=transition({...INITIAL,termsAccepted:true},"accept");
assert.equal(order.stage,"deposit");
order=transition(order,"deposit_test");
assert.equal(order.depositVerified,true);
order=transition(order,"onboard");
assert.equal(order.onboardingComplete,true);
order=transition(order,"balance_test");
assert.equal(order.balanceVerified,true);
order=transition(order,"approve");
assert.equal(order.stage,"complete");assert.equal(order.publicationApproved,true);
});
test("maksujen ja julkaisuhyväksynnän vaiheita ei voi ohittaa",()=>{
for(const action of ["deposit_test","onboard","balance_test","approve"])assert.throws(()=>transition(INITIAL,action));
const accepted=transition({...INITIAL,termsAccepted:true},"accept");
assert.throws(()=>transition(accepted,"balance_test"));
});
test("aloitustilassa ei ole vahvistettuja maksuja",()=>{assert.equal(INITIAL.depositVerified,false);assert.equal(INITIAL.balanceVerified,false);});
