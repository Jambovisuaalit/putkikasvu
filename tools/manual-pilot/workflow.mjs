/** Offline synthetic model only. No provider, storage, payment or publishing adapters. */
import {randomUUID} from 'node:crypto';
export const INSTALLMENT_CENTS = 29500;
const frozen = value => {
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) frozen(item);
    Object.freeze(value);
  }
  return value;
};
const snapshot = value => frozen(structuredClone(value));
const fail = message => { throw new Error(message); };
const text = value => typeof value === 'string' && value.trim().length >= 3;
const date = value => typeof value === 'string' && Number.isFinite(Date.parse(value));

export function createPilot({mode='live', sellerAccountId, reviewers=[], ledger=[], referenceFactory, now=()=>new Date().toISOString()}={}) {
  if (!['live','synthetic'].includes(mode)) fail('INVALID_MODE');
  if (mode === 'live' && (ledger.length || referenceFactory)) fail('LIVE_FIXTURES_FORBIDDEN');
  if (!text(sellerAccountId) || !reviewers.length || !reviewers.every(text)) fail('CONFIG_REQUIRED');
  const actors=new Set(reviewers), transactions=new Map(), orders=new Map(), used=new Map(), references=new Set();
  const nextReference=referenceFactory ?? (()=>'PK-'+randomUUID().slice(0,8).toUpperCase());
  for (const row of structuredClone(ledger)) {
    if (row.synthetic!==true || row.source!=='synthetic_provider_ledger' || !text(row.id) || transactions.has(row.id)) fail('INVALID_FIXTURE');
    transactions.set(row.id, snapshot(row));
  }
  function actor(id) { if(!actors.has(id)) fail('UNAUTHORIZED_REVIEWER'); }
  function get(id) { return orders.get(id) ?? fail('ORDER_NOT_FOUND'); }
  function active(o) { if(o.hold) fail('ORDER_ON_HOLD'); }
  function event(o,type,by,details={}) {
    const at=now(); if(!date(at)) fail('INVALID_CLOCK');
    o.version++; o.events.push(snapshot({sequence:o.version,type,by,at,...details}));
  }
  function step(id,by,expectedStage) {
    actor(by); const o=get(id); active(o);
    if(o.stage!==expectedStage) fail('INVALID_STAGE');
    return o;
  }
  function proof(o,p) { if(!p || !text(p.evidenceRef) || !text(p.acceptedBy) || !date(p.at) || Date.parse(p.at)>Date.parse(now()) || Date.parse(p.at)<Date.parse(o.events.at(-1).at)) fail('ACCEPTANCE_REQUIRED'); }
  return Object.freeze({
    createOrder({customerId,companyName,offerVersion,termsVersion},by) {
      actor(by);
      if(![customerId,companyName,offerVersion,termsVersion].every(text)) fail('ORDER_DETAILS_REQUIRED');
      const reference=nextReference();if(!text(reference)||references.has(reference))fail('DUPLICATE_ORDER_REFERENCE');
      const o={id:randomUUID(),reference,customerId,companyName,offerVersion,termsVersion,totalCents:59000,currency:'EUR',stage:'offer',version:0,hold:null,payments:{},events:[]};
      event(o,'offer_created',by);orders.set(o.id,o);references.add(reference);return snapshot(o);
    },
    acceptOffer(id,p,by) {
      const o=step(id,by,'offer');proof(o,p);
      if(p.offerVersion!==o.offerVersion || p.termsVersion!==o.termsVersion) fail('ACCEPTANCE_VERSION_MISMATCH');
      o.acceptance=snapshot(p);o.stage='awaiting_deposit';event(o,'offer_accepted',by,{evidenceRef:p.evidenceRef});return snapshot(o);
    },
    verifyPayment(id,{installment,transactionId,evidenceRef,expectedVersion},by) {
      actor(by);const o=get(id);active(o);
      if(mode!=='synthetic') fail('LIVE_VERIFIER_NOT_CONFIGURED');
      if(!['deposit','balance'].includes(installment)) fail('INVALID_INSTALLMENT');
      if(!text(evidenceRef)) fail('REVIEW_RECORD_REQUIRED');
      const assigned=used.get(transactionId);
      if(assigned) {
        if(assigned.orderId===id && assigned.installment===installment) return snapshot(o);
        fail('TRANSACTION_ALREADY_ASSIGNED');
      }
      if(expectedVersion!==o.version) fail('STALE_ORDER_VERSION');
      if(o.stage!==(installment==='deposit'?'awaiting_deposit':'awaiting_balance')) fail('INVALID_STAGE');
      const row=transactions.get(transactionId);
      if(!row) fail('TRUSTED_TRANSACTION_NOT_FOUND');
      if(row.status!=='settled' || row.refunded!==false || row.disputed!==false) fail('PAYMENT_NOT_SETTLED');
      if(row.grossCents!==INSTALLMENT_CENTS || row.currency!=='EUR') fail('PAYMENT_AMOUNT_MISMATCH');
      if(row.payeeAccountId!==sellerAccountId || row.customerId!==o.customerId || row.orderReference!==o.reference) fail('PAYMENT_IDENTITY_MISMATCH');
      if(row.installment!==installment || !date(row.paidAt) || !date(row.settledAt) || Date.parse(row.paidAt)<Date.parse(installment==='deposit'?o.acceptance.at:o.buildApproval.at) || Date.parse(row.settledAt)<Date.parse(row.paidAt) || Date.parse(row.settledAt)>Date.parse(now())) fail('PAYMENT_TIME_OR_INSTALLMENT_MISMATCH');
      if(!Number.isInteger(row.feeCents) || row.feeCents<0 || row.feeCents>row.grossCents || row.netCents!==row.grossCents-row.feeCents) fail('PAYMENT_FEE_MISMATCH');
      o.payments[installment]=snapshot({transactionId,grossCents:row.grossCents,feeCents:row.feeCents,netCents:row.netCents,currency:'EUR',settledAt:row.settledAt,reviewedBy:by,evidenceRef,synthetic:true});
      used.set(transactionId,{orderId:id,installment});o.stage=installment==='deposit'?'materials':'ready_to_publish';event(o,installment+'_verified_synthetic',by,{transactionId,evidenceRef});return snapshot(o);
    },
    receiveMaterials(id,p,by) {
      const o=step(id,by,'materials');
      if(!p || p.rightsConfirmed!==true || !text(p.evidenceRef) || !text(p.contactRef) || !text(p.scopeRef)) fail('MATERIALS_AND_RIGHTS_REQUIRED');
      o.materials=snapshot(p);o.stage='production';event(o,'materials_received',by,{evidenceRef:p.evidenceRef});return snapshot(o);
    },
    submitForApproval(id,{buildId,qaPassed,evidenceRef},by) {
      const o=step(id,by,'production');if(!text(buildId) || qaPassed!==true || !text(evidenceRef)) fail('BUILD_QA_REQUIRED');
      o.buildId=buildId;o.stage='awaiting_approval';event(o,'build_submitted',by,{buildId,evidenceRef});return snapshot(o);
    },
    requestRevision(id,{evidenceRef},by) {
      const o=step(id,by,'awaiting_approval');if(!text(evidenceRef)) fail('REVISION_EVIDENCE_REQUIRED');
      o.stage='production';event(o,'revision_requested',by,{evidenceRef});return snapshot(o);
    },
    approveBuild(id,p,by) {
      const o=step(id,by,'awaiting_approval');proof(o,p);if(p.buildId!==o.buildId) fail('BUILD_VERSION_MISMATCH');
      o.buildApproval=snapshot(p);o.stage='awaiting_balance';event(o,'build_approved',by,{buildId:p.buildId,evidenceRef:p.evidenceRef});return snapshot(o);
    },
    recordIncident(id,{reason,evidenceRef},by) {
      actor(by);const o=get(id);if(!text(reason)||!text(evidenceRef))fail('INCIDENT_EVIDENCE_REQUIRED');
      o.hold={reason,evidenceRef};event(o,'order_held',by,{reason,evidenceRef});return snapshot(o);
    },
    recordSyntheticPublication(id,{buildId,domainRightsConfirmed,qaPassed,evidenceRef},by) {
      const o=step(id,by,'ready_to_publish');
      if(mode!=='synthetic') fail('LIVE_PUBLICATION_DISABLED');
      if(buildId!==o.buildApproval.buildId || domainRightsConfirmed!==true || qaPassed!==true || !text(evidenceRef)) fail('PUBLICATION_GATES_REQUIRED');
      o.stage='published_synthetic';event(o,'publication_simulated',by,{buildId,evidenceRef});return snapshot(o);
    },
    getOrder(id) { return snapshot(get(id)); }
  });
}
