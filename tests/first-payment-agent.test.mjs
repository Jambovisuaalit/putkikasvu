import test from 'node:test';
import assert from 'node:assert/strict';
import {decide,classify,offerDraft,followupDraft} from '../agent/core.mjs';
function f(){return {
  followup:[['Yritys','Vastaanottaja','Myyntivaihe'],['LVI MIKKI Ky','mikki@example.org','VAPAUTETTU – MANUAALINEN SEURANTA / EI LÄHETETTY'],['Lvi-Upp Oy','upp@example.org','VAPAUTETTU – MANUAALINEN SEURANTA / EI LÄHETETTY']],
  blocks:[['Yritys','Status'],['LVI MIKKI Ky','ESTO – AIEMPI KONTAKTI (EI KIELTO)'],['Lvi-Upp Oy','ESTO – AIEMPI KONTAKTI (EI KIELTO)']],
  sent:[['Yritys','To'],['LVI MIKKI Ky','mikki@example.org'],['Lvi-Upp Oy','upp@example.org']],
  received:[],inboundComplete:true,gmailComplete:false
}}
test('draft for two companies but never send',()=>{
  const d=decide(f());assert.equal(d.length,2);
  for(const item of d){assert.equal(item.state,'DRAFT_ONLY');assert.ok(item.followupDraft);
    assert.equal(item.sendAllowed,false);assert.equal(item.paymentAllowed,false);}
});
test('clearance revoked => hold',()=>{const x=f();x.followup[1][2]='Odottaa';assert.equal(decide(x)[0].state,'HOLD')});
test('blocklist changed => hold',()=>{const x=f();x.blocks[1][1]='ESTETTY';assert.equal(decide(x)[0].state,'HOLD')});
test('missing previous contact => hold',()=>{const x=f();x.sent.splice(1,1);assert.equal(decide(x)[0].state,'HOLD')});
test('duplicate previous contact => hold',()=>{const x=f();x.sent.push(['LVI MIKKI Ky','mikki@example.org']);assert.equal(decide(x)[0].state,'HOLD')});
test('unsubscribe suppresses',()=>{const x=f();x.received=[{from:'Name <mikki@example.org>',text:'Ei viestejä kiitos'}];assert.equal(decide(x)[0].state,'SUPPRESSED')});
test('interest leads to draft offer, no payment',()=>{const x=f();x.received=[{from:'mikki@example.org',text:'Kiinnostaa, lähetä demo'}];const d=decide(x)[0];assert.equal(d.state,'INTERESTED_REVIEW');assert.ok(d.offerDraft);assert.equal(d.paymentAllowed,false)});
test('explicit acceptance still requires review',()=>{const x=f();x.received=[{from:'mikki@example.org',text:'Hyväksyn tarjouksen'}];assert.equal(decide(x)[0].state,'ACCEPTANCE_REVIEW')});
test('unknown reply not a customer reply',()=>{const x=f();x.received=[{from:'other@example.org',text:'ei viestejä'}];assert.equal(decide(x)[0].state,'DRAFT_ONLY')});
test('classification priority',()=>{assert.equal(classify('En halua, ei viestejä'),'OPT_OUT');assert.equal(classify('Ei kiinnosta'),'DECLINED');assert.equal(classify('','',''),'UNKNOWN');assert.equal(classify('','Automaattinen vastaus'),'AUTO_REPLY');assert.equal(classify('Mikä aikataulu?'),'QUESTION')});
test('offer holds price, safeguards and no checkout',()=>{const o=offerDraft('Test Oy').text;assert.match(o,/590,00 €/);assert.match(o,/295,00 €/);assert.match(o,/ennakonpidätys/);assert.doesNotMatch(o,/checkout/);assert.match(followupDraft('Test Oy').text,/ei ole tilaus-/)});
