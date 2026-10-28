import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CONTACT_EMAIL, CONTACT_SUBJECT, CONTACT_BODY, CONTACT_MAILTO, CONTACT_PLAIN_MAILTO } from '../app/contact.mjs';

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');

test('contact email is canonical and the mailto link has a UTF-8-safe subject/body', () => {
  assert.equal(CONTACT_EMAIL, 'jami@putkikasvu.fi');
  assert.equal(CONTACT_PLAIN_MAILTO, 'mailto:' + CONTACT_EMAIL);
  const url = new URL(CONTACT_MAILTO);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.get('subject'), CONTACT_SUBJECT);
  assert.match(CONTACT_SUBJECT, /Putkikasvu/);
  assert.match(CONTACT_SUBJECT, /Esimerkkisivupyyntö/);
  assert.equal(url.searchParams.get('body'), CONTACT_BODY);
  for (const field of ['Yritys:', 'Paikkakunta / palvelualue:', 'Yhteyshenkilö:'])
    assert.ok(CONTACT_BODY.includes(field), field);
  assert.ok(!CONTACT_MAILTO.includes(' '), 'mailto: must URL-encode spaces');
});
test('each purchase-interest CTA uses the same email draft, with a visible fallback', () => {
  const page = read('app/page.jsx');
  assert.match(page, /const contact=CONTACT_MAILTO/);
  assert.equal((page.match(/href=\{contact\}/g) || []).length, 6, 'all six CTAs must use canonical mailto');
  assert.match(page, /id="yhteys"/);
  assert.match(page, /CONTACT_PLAIN_MAILTO/);
  assert.match(page, /\{CONTACT_EMAIL\}/);
  assert.match(page, /<ContactCopyButton\s*\/>/);
  assert.doesNotMatch(page, /<form\b|checkout\.revolut\.com|fetch\s*\(/i);
});
test('copy fallback reports failure and never posts user input to a server', () => {
  const copy = read('app/components/ContactCopyButton.jsx');
  assert.match(copy, /navigator\.clipboard\?\.writeText/);
  assert.match(copy, /type="button"/);
  assert.match(copy, /role="status"/);
  assert.match(copy, /Kopiointi ei onnistunut/);
  assert.doesNotMatch(copy, /fetch\s*\(|XMLHttpRequest|localStorage/);
});
test('visible recipient agrees with the legal and privacy pages', () => {
  for (const f of ['app/ehdot/page.jsx', 'app/tietosuoja/page.jsx'])
    assert.ok(read(f).includes(CONTACT_EMAIL), f);
});
