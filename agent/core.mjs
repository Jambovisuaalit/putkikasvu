// First Payment Agent v1: pure, fail-closed CRM and response decision engine.
// NO sending, booking, CRM mutations, or payment actions are exposed.
export const COMPANIES = Object.freeze(['LVI MIKKI Ky', 'Lvi-Upp Oy']);
export const CLEARANCE = 'VAPAUTETTU – MANUAALINEN SEURANTA / EI LÄHETETTY';
export const HISTORIC_BLOCK = 'ESTO – AIEMPI KONTAKTI (EI KIELTO)';
export const normalize = x => String(x ?? '').normalize('NFKC').trim().toLocaleLowerCase('fi-FI');
export function email(value) {
  const s = String(value ?? '').trim();
  return normalize(s.match(/<([^<>]+@[^<>]+)>/)?.[1] ?? s);
}
export function rows(data) {
  if (!Array.isArray(data) || data.length < 2) throw new Error('CRM has no header/data');
  const head = data[0].map(normalize);
  return data.slice(1).filter(row => row.some(v => String(v ?? '').trim())).map(row =>
    Object.fromEntries(head.map((key,i) => [key, row[i] ?? ''])));
}
const get = (row,key) => row?.[normalize(key)] ?? '';
export function classify(text,subject='') {
  const s = normalize(text).slice(0,9000), h = normalize(subject);
  if (/(ei viestejä|älä lähetä|älkää lähettäkö|poistakaa.*listalta|lopettakaa yhteydenotot|unsubscribe|do not contact|remove me)/iu.test(s)) return 'OPT_OUT';
  if (/(ei kiinnosta|ei tarvetta|emme tarvitse|not interested)/iu.test(s)) return 'DECLINED';
  if (/(automaattinen vastaus|automatic reply|out of office|poissa toimistolta)/iu.test(h+' '+s.slice(0,300))) return 'AUTO_REPLY';
  if (/(hyväksyn|hyväksymme|tilaamme|tilaan|vahvistamme tilauksen|we accept)/iu.test(s)) return 'ACCEPTANCE_REVIEW';
  if (/(kiinnostaa|lähetä|lähettäkää|esikatselu|demo|tarjous|kyllä|interested)/iu.test(s)) return 'INTERESTED_REVIEW';
  if (s.includes('?')) return 'QUESTION';
  return 'UNKNOWN';
}
const safe = x => String(x ?? '').replace(/[<>]/g,'').replace(/[\r\n\t]/g,' ').trim().slice(0,120);
export function followupDraft(company) {
  return {
    subject:'Putkikasvu | aiemman verkkosivuehdotuksen jatko',
    text:'Hei,\n\nPalaan aiempaan Putkikasvun ehdotukseen yritykselle '+safe(company)+'. Voin lähettää pyydettäessä lyhyen, luonnokseksi merkityn verkkosivuesikatselun.\n\nPutkikasvu Standard: enintään kolme sivua, mobiiliystävällinen rakenne ja yksi sovittu korjauskierros. Kiinteä hinta 590 € (295 € + 295 €). Tämä ei ole tilaus- eikä maksupyyntö.\n\nHaluatteko nähdä esikatselun? Voitte vastata kyllä tai ei.\n\nPutkikasvu\njami@putkikasvu.fi\n\nJos ette halua markkinointiviestejä, vastatkaa "ei viestejä".'
  };
}
export function offerDraft(company) {
  return {
    subject:'Putkikasvu Standard | kirjallinen tarjousluonnos | '+safe(company),
    text:[
      'LUONNOS — EI SITOVA TARJOUS TAI MAKSUVAATIMUS',
      'Ostaja: '+safe(company)+' | Y-tunnus, osoite ja valtuutettu hyväksyjä: VAHVISTETTAVA.',
      'Tarjousnumero, voimassaolo, projektiaikataulu, domain/hosting, aineistot ja sovitut liitteet: TÄYDENNETTÄVÄ.',
      'Putkikasvu Standard: enintään kolme sivua, mobiilitoteutus, perus-SEO, yhteydenottopolku ja yksi koottu korjauskierros.',
      'Ei sisälly: jatkuva ylläpito, hosting/domainmaksut, CRM-/maksuintegraatiot eikä erikseen tilaamaton lisätyö.',
      'Hinta 590,00 €, maksuerät 295,00 € kirjallisen tilauksen jälkeen ja 295,00 € julkaisuvalmiuden hyväksynnän jälkeen ennen julkaisua.',
      'Myyjä ei ole ALV-rekisterissä. Vähäisen toiminnan edellytykset vahvistetaan ennen laskutusta.',
      'Myyjä ei ole ennakkoperintärekisterissä: ostajan ennakonpidätys selvitetään ennen maksupyyntöä.',
      'Vahvistettu ehtoversio ja mahdollinen DPA toimitettava ostajan nimenomaista hyväksyntää varten.',
      'EI MAKSU LINKKIÄ. Ei tulkita vastausta automaattisesti tilausvahvistukseksi.'
    ].join('\n\n')
  };
}
export function decide({followup,blocks,sent,received=[],inboundComplete=false,gmailComplete=false}) {
  const f=rows(followup), b=rows(blocks), l=rows(sent);
  return COMPANIES.map(company => {
    const fr=f.find(r=>normalize(get(r,'Yritys'))===normalize(company));
    const br=b.find(r=>normalize(get(r,'Yritys'))===normalize(company));
    const address=email(get(fr,'Vastaanottaja'));
    const historic=l.filter(r=>normalize(get(r,'Yritys'))===normalize(company));
    const reasons=[];
    if(!fr || !br) reasons.push('CRM_ROW_MISSING');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) reasons.push('EMAIL_INVALID');
    if(normalize(get(fr,'Myyntivaihe'))!==normalize(CLEARANCE)) reasons.push('MANUAL_ONLY_CLEARANCE_MISSING');
    if(normalize(get(br,'Status'))!==normalize(HISTORIC_BLOCK)) reasons.push('HISTORIC_BLOCK_CHANGED');
    if(historic.length!==1 || email(get(historic[0],'To'))!==address) reasons.push('HISTORY_UNVERIFIED');
    const matched=received.filter(m=>email(m.from)===address).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
    const reply=matched[0] ? classify(matched[0].text,matched[0].subject) : 'NO_MATCH';
    if(reply==='OPT_OUT' || reply==='DECLINED') reasons.push('SUPPRESSION');
    if(reply!=='NO_MATCH' && reply!=='OPT_OUT' && reply!=='DECLINED') reasons.push('REPLY_REVIEW');
    if(!inboundComplete) reasons.push('RESEND_COVERAGE_INCOMPLETE');
    if(!gmailComplete) reasons.push('GMAIL_COVERAGE_INCOMPLETE');
    const cleanCRM=!reasons.some(code=>['CRM_ROW_MISSING','EMAIL_INVALID','MANUAL_ONLY_CLEARANCE_MISSING','HISTORIC_BLOCK_CHANGED','HISTORY_UNVERIFIED'].includes(code));
    const state=reply==='OPT_OUT'||reply==='DECLINED' ? 'SUPPRESSED'
      : reply==='INTERESTED_REVIEW' ? 'INTERESTED_REVIEW'
      : reply==='ACCEPTANCE_REVIEW' ? 'ACCEPTANCE_REVIEW'
      : reply!=='NO_MATCH'||!cleanCRM ? 'HOLD' : 'DRAFT_ONLY';
    return {company,state,reply,reasons,sendAllowed:false,paymentAllowed:false,
      followupDraft:state==='DRAFT_ONLY'?followupDraft(company):null,
      offerDraft:state==='INTERESTED_REVIEW'?offerDraft(company):null};
  });
}
