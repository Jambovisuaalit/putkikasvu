import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
function files(dir) {
  return readdirSync(new URL(dir, root), {withFileTypes:true}).flatMap(e =>
    e.isDirectory() ? files(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
}
test('release has no backend, database migration, mock checkout or server routes', () => {
  for (const p of ['app/api','app/demo','database','lib/server','lib/pilot-order.ts'])
    assert.equal(existsSync(new URL(p, root)), false, p);
  assert.match(read('next.config.mjs'), /output:\s*'export'/);
  for (const f of files('app')) {
    assert.doesNotMatch(path.basename(f), /^route\./, f);
    assert.doesNotMatch(read(f), /use server|PK_BACKEND_ENABLED|SUPABASE_SERVICE_ROLE_KEY|checkout\.revolut\.com|<form\b|fetch\s*\(/i, f);
  }
});
test('each public page supports the shared skip link and uses official logo', () => {
  assert.match(read('app/layout.jsx'), /href="#main-content"/);
  for (const p of ['app/page.jsx','app/ehdot/page.jsx','app/tietosuoja/page.jsx']) {
    const s=read(p);
    assert.match(s, /id="main-content"/);
    assert.match(s, /tabIndex=\{-1\}/);
    assert.match(s, /<BrandLogo\s*\/>/);
  }
});
