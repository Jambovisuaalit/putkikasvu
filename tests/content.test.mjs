import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const home = read('../app/page.jsx');
const terms = read('../app/ehdot/page.jsx');
const privacy = read('../app/tietosuoja/page.jsx');

test('Standard price and payment amounts stay consistent', () => {
  assert.match(home, /590/);
  assert.match(home, /295/);
  assert.match(terms, /590 euroa/);
  assert.match(terms, /295 euroa/);
});

test('Static conversion flow remains contact-only', () => {
  for (const key of ['miten', 'hinta', 'esimerkit', 'yhteys']) {
    assert.ok(home.includes(key), `missing homepage flow: ${key}`);
  }
  for (const source of [home, terms, privacy]) {
    assert.doesNotMatch(source, /checkout\.revolut\.com|checkout\.stripe\.com|payments\.create|api\/orders/i);
  }
});

test('Legal pages visibly remain pending approval', () => {
  assert.match(terms, /Ei vielä asiakastilauksiin hyväksytty/);
  assert.match(privacy, /Käsittelykartta ei ole vielä hyväksytty/);
  assert.match(terms, /Verkkomaksaminen ei ole käytössä/);
});

test('Terms cover B2B, cancellations, ownership and GDPR scope', () => {
  for (const required of ['vain elinkeinotoimintaa', '295 euroa ennakkomaksuna', 'Peruutus ennen aloitusta', '90 €/h',
    'yhden kootun', 'nimenomaista kirjallista hyväksyntää', 'lähdekoodin', 'domain', 'hosting',
    'GDPR 28 artiklan', 'ei-yksinomaisen']) {
    assert.ok(terms.toLowerCase().includes(required.toLowerCase()), `missing term: ${required}`);
  }
});

test('Privacy covers retention, role distinction, rights and information duty', () => {
  for (const required of ['12 kuukautta', 'kolme vuotta', '90 päivän', 'kuusi vuotta',
    'kymmenen vuotta', 'Rekisteröidyn oikeudet', 'oikeutettu etu', 'artiklan 1 kohdan',
    'Kansainväliset tietojen siirrot', 'Asiakkaidemme sivustojen henkilötiedot',
    'Suoramarkkinointia voi vastustaa']) {
    assert.ok(privacy.includes(required), `missing privacy item: ${required}`);
  }
});

test('written legal signoff is distinct from commercial GO', () => {
  const signoff = read('../docs/legal/WRITTEN_APPROVAL_PACKAGE.md');
  const dataMap = read('../docs/legal/DATA_FLOW_AND_RETENTION.md');
  const offer = read('../docs/legal/OFFER_AND_ACCEPTANCE_TEMPLATE.md');
  const dpa = read('../docs/legal/DPA_TEMPLATE.md');
  assert.match(signoff, /TEKSTIEHDOT HYVÄKSYTTY|TEXT APPROVED/);
  assert.match(signoff, /EI MYYNTI-\/LASKUTUS-\/JULKAISULUPA/);
  assert.match(signoff, /P0/);
  assert.match(signoff, /ennakkoperintärekisterin/i);
  assert.match(signoff, /yritysosoitteeksi/i);
  assert.match(signoff, /Virallinen rekisterivarmennus/);
  assert.match(dataMap, /EI TODETTU/);
  assert.match(dataMap, /Kuluttaja-Gmailiin ei oleteta Google Workspace/);
  assert.match(offer, /valtuutettu hyväksyjä/);
  assert.match(offer, /kirjallinen hyväksyntä/);
  assert.match(dpa, /Liite B/);
  assert.match(dpa, /Liite C/);
  assert.match(dpa, /allekirjoitus/);
  assert.match(terms, /maantieteellinen yritysosoite/);
  assert.match(privacy, /Säilytysajat/);
});
