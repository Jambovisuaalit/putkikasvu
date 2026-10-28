import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
for (const route of ['index','ehdot','tietosuoja','404']) {
 const html=readFileSync(`out/${route}.html`,'utf8');
 assert.match(html, /<html[^>]*lang="fi"/);
 assert.match(html, /noindex/);
 assert.doesNotMatch(html, /<form\b|checkout\.revolut\.com|supabase\.co/i);
 if(route!=='404') {
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route);
  assert.match(html,/id="main-content"/);
  assert.match(html,/putkikasvu-wordmark-white-v1\.1\.png/);
 }
 // Ensure every emitted local image, font, script and stylesheet URL resolves.
 for (const match of html.matchAll(/(?:src|href)="(\/(?:_next|brand)\/[^"?]+)(?:\?[^\"]*)?"/g))
  assert.ok(existsSync(path.join('out',match[1])),match[1]);
}
const home=readFileSync('out/index.html','utf8');
assert.match(home,/mailto:jami@putkikasvu\.fi/);
for(const id of ['miten','hinta','esimerkit'])assert.match(home,new RegExp(`id="${id}"`));
assert.equal((home.match(/<summary\b/g)||[]).length,4);
console.log('Static export checks PASS: routes, 404, assets, headings, anchors, FAQ and no write/payment forms.');
