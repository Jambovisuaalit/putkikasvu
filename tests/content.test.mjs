import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const page=JSON.parse(read('content/home.json'));
test('Standard price and payment terms',()=>{assert.match(page,/590/);assert.match(page,/295/);assert.doesNotMatch(page,/29 €\/kk/)});
test('Conversion flow contains package, example, process and inquiry',()=>{for(const id of ['paketti','esimerkki','vaiheet','yhteys','inquiry-form'])assert.ok(page.includes(`id="${id}"`));assert.match(page,/mailto:jami@putkikasvu\.fi/);});
test('privacy describes actual inquiry delivery',()=>{const privacy=read('app/tietosuoja/page.jsx');assert.match(privacy,/Resend/);assert.match(privacy,/jami@putkikasvu\.fi/);assert.doesNotMatch(privacy,/Resend- ja Supabase-palveluja ei ilmoiteta/);assert.match(page,/href="\/tietosuoja"/);});
test('payments and database writes remain outside the marketing site',()=>{assert.doesNotMatch(page,/checkout\.revolut\.com|supabase\.co/)});
