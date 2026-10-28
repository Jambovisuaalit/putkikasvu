/** Bounded decision engine. No network, sends, CRM writes or payment execution. */
import {STANDARD} from './first-payment.mjs';
export const PRODUCT = Object.freeze({name:STANDARD.name,price:STANDARD.totalCents/100,deposit:STANDARD.depositCents/100,balance:STANDARD.finalCents/100,maxPages:3,revisionRounds:1});
const UUID = /^[\w-]{1,100}$/;
const PRIORITIES = new Set(['PK01','PK02']);
const MAX_AGE = 24*60*60*1000;
const email = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
function currentText(text) {
 return String(text || '').split(/\n(?:On .+wrote:|.+kirjoitti:|_{4,}|-{4,}\s*(?:Original|Alkuperäinen)|From:|Lähettäjä:)/i)[0].split('\n').filter(line=>!/^\s*>/.test(line)).join('\n').trim();
}
export function classifyReply(text) {
 const value=currentText(text).normalize('NFKC').toLowerCase();
 if (!value) return {label:'needs_review',reason:'empty_or_quoted_only'};
 if (/äl(?:ä|kää).*lähet|poista.*(?:list|tieto)|lopeta.*(?:viest|yhteyden)|ei.*(?:enää|jatkossa).*viest|unsubscribe|do not contact|stop emailing/.test(value)) return {label:'opt_out',reason:'explicit_stop'};
 if (/automaattinen vastaus|automatic reply|out of (?:the )?office|olen (?:lomalla|poissa)/.test(value)) return {label:'out_of_office',reason:'automatic_reply'};
 if (/ei kiinnosta|emme ole kiinnostuneita|en ole kiinnostunut|ei (?:ole )?tarvetta|not interested/.test(value)) return {label:'declined',reason:'explicit_decline'};
 if (/haluan tilata|haluamme tilata|hyväksy(?:n|mme).*tarjou|accept.*offer/.test(value)) return {label:'acceptance_review',reason:'acceptance_requires_offer_and_authority_check'};
 if (/(?:lähetä|lait(?:a|takaa)|pyydän|haluan|haluamme).*(?:tarjou|ehdotu)|voisi.*tarjou/.test(value)) return {label:'offer_requested',reason:'explicit_offer_request'};
 if (/haluan nähdä|haluamme nähdä|kiinnostaa|kiinnostuneita|kerro lisää/.test(value)) return {label:'interested',reason:'interest_only'};
 if (/\?|mitä.*sisält|paljonko|kuinka|miten/.test(value)) return {label:'question',reason:'question_requires_answer'};
 return {label:'needs_review',reason:'ambiguous_reply'};
}
function assertRecord(record) {
 if (!record || !PRIORITIES.has(record.id)) throw new Error('outside_priority_scope');
 if (typeof record.optOut!=='boolean'||typeof record.followupSent!=='boolean'||!['sent','delivered','delivery_delayed','bounced','complained','failed'].includes(record.delivery)) throw new Error('incomplete_crm_checks');
 if (typeof record.company !== 'string' || !record.company.trim() || record.company.length>180) throw new Error('invalid_company');
 if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email(record.recipient))) throw new Error('invalid_recipient');
 if (!Number.isFinite(Date.parse(record.firstSentAt))) throw new Error('invalid_first_sent_at');
 if (!Array.isArray(record.sentMessageIds) || record.sentMessageIds.length===0 || record.sentMessageIds.some(id=>typeof id!=='string'||!/^<[^<>\s]+>$/.test(id))) throw new Error('invalid_message_ids');
}
export function offerDraft(record) {
 return {status:'draft',requiresOwnerApproval:true,recipient:record.recipient,product:PRODUCT,subject:`Kirjallinen tarjous: ${PRODUCT.name} — ${record.company}`,body:[`Hei!`,`Tarjous yritykselle ${record.company}: ${PRODUCT.name}, enintään 3 sivua. Kokonaishinta 590 €, johon ei ilmoitetun verostatuksen perusteella lisätä arvonlisäveroa.`,`Hintaan sisältyvät responsiivinen toteutus, palvelut ja yhteystiedot, tekninen perus-SEO, asiakkaan materiaalien sijoittelu, yksi koottu korjauskierros sekä sovittu julkaisu.`,`Domain, hosting, jatkuva ylläpito, valokuvaus, laaja tekstintuotanto ja maksulliset integraatiot sovitaan erikseen.`,`Ennakko 295 € kirjallisen hyväksynnän ja myyjän tilausvahvistuksen jälkeen. Loppumaksu 295 € julkaisuvalmiin sivuston kirjallisen hyväksynnän jälkeen ennen julkaisua.`,`Ennen lähettämistä täydennetään tarjouksen tunnus ja versio, voimassaolo, toimitusaikataulu, tarkka sisältö, domain/hosting, luovutusoikeudet sekä liitettävä ehtoversio. Vastaanottajan tilausvaltuus ja tilaustietojen oikeellisuus tarkistetaan.`,`Tämä on tarkistettava tarjousluonnos, ei lähetetty tarjous tai tilausvahvistus.`].join('\n\n')};
}
export function runFirstPayment({crm,mailbox,now=Date.now()}) {
 if (!crm || !mailbox || !Number.isFinite(now)) throw new Error('missing_sources');
 for(const source of [crm,mailbox]) {
  const checked=Date.parse(source.checkedAt);
  if(source.status!=='ok'||!Number.isFinite(checked)||checked>now+60000||now-checked>MAX_AGE) throw new Error('source_not_current');
 }
 if(!Array.isArray(crm.records)||crm.records.length!==2||new Set(crm.records.map(r=>r.id)).size!==2)throw new Error('exactly_two_priority_records_required');
 if(!Array.isArray(mailbox.messages)||mailbox.messages.length>100)throw new Error('invalid_message_batch');
 const records=crm.records.map(record=>{
  assertRecord(record);
  if(Date.parse(record.firstSentAt)>now)throw new Error('future_sent_at');
  const matched=mailbox.messages.filter(m=>email(m.from)===email(record.recipient)&&typeof m.id==='string'&&UUID.test(m.id)&&Array.isArray(m.references)&&m.references.some(ref=>record.sentMessageIds.includes(ref))&&Number.isFinite(Date.parse(m.receivedAt))&&Date.parse(m.receivedAt)>=Date.parse(record.firstSentAt)&&Date.parse(m.receivedAt)<=now+60000&&typeof m.text==='string'&&m.text.length<=20000);
  const replies=[...new Map(matched.map(m=>[m.id,m])).values()].sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
  const classified=replies.map(m=>({messageId:m.id,receivedAt:m.receivedAt,...classifyReply(m.text)}));
  const stopped=record.optOut===true||classified.some(r=>r.label==='opt_out');
  const last=classified.at(-1);
  let action=stopped?'stop_contact':last?.label==='declined'?'close_no_sale':last?.label==='offer_requested'?'review_offer_draft':last?.label==='acceptance_review'?'verify_written_acceptance':last?.label==='interested'?'prepare_written_proposal':last?.label==='question'?'draft_answer':last?.label==='out_of_office'?'wait_return':last?'review_reply':'review_followup';
  if(!stopped&&record.followupPermission!=='manual_one_message'&&!last) action='wait_for_permission';
  if(!stopped&&record.followupSent===true&&!last)action='wait_for_reply';
  if(!stopped&&['bounced','complained','failed'].includes(record.delivery))action='hold_delivery_issue';
  return {id:record.id,company:record.company,action,replies:classified,followupMayBePrepared:action==='review_followup',sendAllowed:false,paymentAllowed:false,...(action==='review_offer_draft'?{offer:offerDraft(record)}:{})};
 });
 return {version:'first-payment-v1',checkedAt:new Date(now).toISOString(),mode:'prepare_and_review',product:PRODUCT,records,externalWrites:0,externalSends:0};
}
