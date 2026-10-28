import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
test('server release only enables the approved inquiry endpoint',()=>{
 assert.deepEqual(readdirSync(new URL('app/api',root)),['tarjous']);
 assert.match(read('app/api/tarjous/route.js'),/export async function POST/);
 for(const p of ['database','lib/server','lib/pilot-order.ts','app/demo']) assert.equal(existsSync(new URL(p,root)),false,p);
 assert.doesNotMatch(read('next.config.mjs'),/output:.*export/);
 assert.doesNotMatch(read('public/app.js'),/re_[A-Za-z0-9]{15}|RESEND_API_KEY/);
});
test('pages support the shared skip link and official logo',()=>{
 assert.match(read('app/layout.jsx'),/<SkipLink\s*\/>/);
 assert.match(read('app/components/SkipLink.jsx'),/href="#main-content"/);
 const home=JSON.parse(read('content/home.json'));
 assert.match(home,/id="main-content" tabindex="-1"/);
 assert.match(home,/putkikasvu-wordmark-white-v1\.1\.png/);
 for(const p of ['app/ehdot/page.jsx','app/tietosuoja/page.jsx']){const s=read(p);assert.match(s,/id="main-content"/);assert.match(s,/tabIndex=\{-1\}/);assert.match(s,/<BrandLogo\s*\/>/);}
});
