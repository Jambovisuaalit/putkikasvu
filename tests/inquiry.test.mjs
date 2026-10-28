import test from 'node:test';
import assert from 'node:assert/strict';
import {handleInquiry} from '../lib/inquiry.mjs';
const url='https://putkikasvu.test/api/tarjous';
const env={RESEND_API_KEY:'unit-test-key'};
const values={name:'Testiasiakas',contact:'asiakas@example.com',message:'Tarvitsen yritykselleni uudet verkkosivut.',website:'',requestId:'8b757bb9-cdaa-439e-ac5b-626999809ce5'};
const request=(data=values,headers={})=>new Request(url,{method:'POST',headers:{Origin:'https://putkikasvu.test','Content-Type':'application/json','cf-connecting-ip':crypto.randomUUID(),...headers},body:JSON.stringify(data)});
test('accepts email and sets a fixed destination, reply-to and idempotency key',async()=>{
 let calls=0;
 const send=async(endpoint,options)=>{calls++;assert.equal(endpoint,'https://api.resend.com/emails');const payload=JSON.parse(options.body);assert.deepEqual(payload.to,['jami@putkikasvu.fi']);assert.equal(payload.reply_to,values.contact);assert.equal(payload.from,'PutkiKasvu <lomake@putkikasvu.fi>');assert.ok(payload.text.includes(values.message));assert.equal(payload.html,undefined);assert.equal(options.headers['Idempotency-Key'],`putkikasvu-inquiry/${values.requestId}`);return Response.json({id:'test-email-id'});};
 const response=await handleInquiry(request({...values,to:'other@example.com'}),env,send);assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true});assert.equal(calls,1);
});
test('accepts phone contact without putting it into reply-to',async()=>{const response=await handleInquiry(request({...values,contact:'+358 40 123 4567'}),env,async(_,options)=>{assert.equal(JSON.parse(options.body).reply_to,undefined);return Response.json({id:'test-email-id'});});assert.equal(response.status,200);});
test('rejects malformed, oversized and cross-origin requests without sending',async()=>{
 const never=()=>{throw Error('must not send');};
 for(const data of [{...values,name:' '},{...values,contact:'invalid'},{...values,contact:'person@example.com\nBcc: other@example.com'},{...values,message:'short'},{...values,website:'spam'},{...values,requestId:'bad'},null]) assert.equal((await handleInquiry(request(data),env,never)).status,400);
 assert.equal((await handleInquiry(request(values,{Origin:'https://other.test'}),env,never)).status,403);
 assert.equal((await handleInquiry(request({...values,message:'x'.repeat(20000)}),env,never)).status,400);
});
test('provider errors and missing configuration cannot produce success',async()=>{
 assert.equal((await handleInquiry(request(),{},()=>{throw Error('must not send');})).status,503);
 for(const send of [async()=>Response.json({message:'failed'},{status:403}),async()=>Response.json({}),async()=>{throw Error('timeout');}]){
 const response=await handleInquiry(request(),env,send);assert.equal(response.status,502);assert.equal((await response.json()).ok,undefined);
 }
});
test('limits repeated submissions from one client',async()=>{const headers={'cf-connecting-ip':crypto.randomUUID()};const send=async()=>Response.json({id:'rate-test'});for(let i=0;i<5;i++)assert.equal((await handleInquiry(request(values,headers),env,send)).status,200);const result=await handleInquiry(request(values,headers),env,()=>{throw Error('must not send');});assert.equal(result.status,429);});
