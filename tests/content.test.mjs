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
  for (const key of ['miten', 'hinta', 'esimerkit', 'mailto:']) {
    assert.ok(home.includes(key), `missing homepage flow: ${key}`);
  }
  for (const source of [home, terms, privacy]) {
    assert.doesNotMatch(source, /checkout\.revolut\.com|checkout\.stripe\.com|payments\.create|api\/orders/i);
  }
});

test('Legal pages visibly remain pending approval', () => {
  assert.match(terms, /Hyväksyntää odottava sopimusluonnos/);
  assert.match(privacy, /Tietosuojan käyttöönoton esteet/);
  assert.match(terms, /Verkkomaksaminen ei ole käytössä/);
});

test('Terms cover B2B, cancellations, ownership and GDPR scope', () => {
  for (const required of ['vain elinkeinotoimintaa', '295 euroa ennakkomaksuna', 'Peruutus ennen aloitusta', '90 €/h',
    'yksi koottu', 'nimenomaista kirjallista hyväksyntää', 'lähdekoodin', 'domain', 'hosting',
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
