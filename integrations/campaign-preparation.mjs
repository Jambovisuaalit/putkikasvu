/**
 * Putkikasvu outbound preparation: research scoring and approval queue.
 * No network calls, send APIs, CRM writes, or campaign scheduling.
 * Every observation must carry a public source and verification timestamp.
 */
const clamp=(n)=>Math.max(0,Math.min(100,n));
const supported=(x)=>Boolean(x && typeof x.source==='string' && x.source.trim() && typeof x.checkedAt==='string' && Number.isFinite(Date.parse(x.checkedAt)));
export const QUEUE_STATES=Object.freeze(['research','needs-verification','ready-for-review','approved','rejected','suppressed']);
export function evaluateProspect(p) {
  if(!p || typeof p!=='object')throw new Error('Missing prospect');
  const blockers=[];
  if(!p.company || !p.businessId)blockers.push('company-identity');
  if(!p.contact || !supported(p.contactEvidence))blockers.push('verified-contact');
  if(!p.websiteEvidence || !supported(p.websiteEvidence))blockers.push('website-observation');
  if(!p.legalBasisReviewed)blockers.push('contact-channel-review');
  if(!p.providerAllowsOutreach)blockers.push('provider-policy');
  if(!p.previousContactsReviewed)blockers.push('contact-history');
  if(!p.suppressionChecked)blockers.push('suppression-check');
  if(p.optOut || p.complaint || p.hardBounce)blockers.push('suppressed');
  const score=clamp(
    (supported(p.websiteEvidence)?35:0)+
    (p.websiteIssueRelevant===true?25:0)+
    (p.staffCount>=1 && p.staffCount<=10?15:0)+
    (p.inUusimaa===true?15:0)+
    (supported(p.contactEvidence)?10:0)
  );
  const eligible=blockers.length===0;
  return {score,blockers,eligible,queueState: blockers.includes('suppressed')?'suppressed':eligible?'ready-for-review':'needs-verification'};
}
export function prepareDraft(p,assessment=evaluateProspect(p)){
  if(!assessment.eligible)throw new Error('Cannot draft prospect with unverified prerequisites');
  if(!p.observation || !supported(p.websiteEvidence) || !p.websiteIssueRelevant)throw new Error('Verified concrete observation required');
  if(!p.observation.trim() || p.observation.length>280)throw new Error('Invalid observation');
  const company=p.company.trim();
  return {
    company,businessId:p.businessId,
    subject:`Kysymys yrityksen ${company} verkkosivuista`,
    text:`Hei,\n\nHuomasin yrityksenne ${company} verkkosivuilla seuraavan asian: ${p.observation.trim()}\n\nPutkikasvu toteuttaa LVI-yrityksille mobiiliystävällisen, enintään kolmisivuisen verkkosivun hintaan 590 €. Hintaan sisältyy yksi sovittu muutoskierros. Maksu kahdessa osassa, 295 € + 295 €.\n\nKiinnostaisiko nähdä yrityksellenne suunniteltu demo? Valmistamme sen vasta myönteisen vastauksenne jälkeen.\n\nYstävällisin terveisin,\nPutkikasvu\n\nJos et halua vastaavia yhteydenottoja, ilmoita vastaamalla tähän viestiin.`,
    evidence:{website:p.websiteEvidence,contact:p.contactEvidence},
    status:'ready-for-review',approvedAt:null,sendAuthorized:false
  };
}
export function approveDraft(d,review){
  if(d?.status!=='ready-for-review')throw new Error('Draft is not reviewable');
  if(!review?.reviewer || !review?.confirmedContent || !review?.confirmedSuppression || !review?.confirmedProviderPolicy)throw new Error('Explicit content, suppression and provider checks required');
  return {...d,status:'approved',approvedAt:new Date(review.approvedAt).toISOString(),approvedBy:review.reviewer,sendAuthorized:false};
}
