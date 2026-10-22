import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateDemo,assertLocalOnly} from '../demo-template/config.mjs';
const base=JSON.parse(readFileSync(new URL('../demo-template/data/example.json',import.meta.url),'utf8'));
test('synthetic sample validates with no fabricated image or reference',()=>assert.equal(validateDemo(base).images.length,0));
test('real company requires explicit source verification',()=>{assert.throws(()=>validateDemo({...base,synthetic:false}),/Verified source/);assert.doesNotThrow(()=>validateDemo({...base,synthetic:false,verified:true,source:'operator-verified-source',checkedAt:'2026-10-22'}));});
test('no published status, fake reviews or fake reference fields',()=>{for(const patch of [{status:'published'},{reviews:[]},{references:[]}])assert.throws(()=>validateDemo({...base,...patch}));});
test('contact injection and empty service lists are rejected',()=>{for(const patch of [{phone:'<script>'},{email:'a@b.fi\r\nBcc:x@y.fi'},{services:[]}])assert.throws(()=>validateDemo({...base,...patch}));});
test('photos need rights evidence and local safe file paths',()=>{
 const i={src:'/images/approved.jpg',alt:'Hyväksytty tekninen testikuva',approved:true,approvedBy:'owner',approvalRef:'private-proof',source:'owner-provided'};
 assert.doesNotThrow(()=>validateDemo({...base,images:[i]},{checkAssets:false}));
 for(const patch of [{approved:false},{approvalRef:''},{src:'https://example.com/image.jpg'},{src:'/images/../../secret.png'},{src:'/images/payload.svg'},{alt:''}])assert.throws(()=>validateDemo({...base,images:[{...i,...patch}]},{checkAssets:false}));
 assert.throws(()=>validateDemo({...base,images:[i]}),/missing/);
});
test('remote builds fail closed even with an allow-public flag',()=>{assert.doesNotThrow(()=>assertLocalOnly({}));for(const env of [{VERCEL:'1'},{VERCEL_ENV:'production'},{VERCEL_ENV:'preview'},{PK_DEMO_ALLOW_PUBLIC:'true'}])assert.throws(()=>assertLocalOnly(env),/blocked/);});
test('template uses native anchors, skip target, draft notice and inert contact preview',()=>{const s=readFileSync(new URL('../demo-template/app/page.jsx',import.meta.url),'utf8');for(const id of ['sisalto','palvelut','toiminta','yhteys'])assert.match(s,new RegExp('id="'+id+'"'));assert.match(s,/LUONNOS/);assert.doesNotMatch(s,/dangerouslySetInnerHTML|href=\{.*tel:|<form\b|fetch\(/);});
test('generator stages only approved images, preserves originals and refuses overwrites',async()=>{
 const fs=await import('node:fs'),os=await import('node:os'),path=await import('node:path');const {spawnSync}=await import('node:child_process');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pk-image-test-')),slug='test-'+Date.now();
 const config=path.join(dir,'input.json'),image=path.resolve('public/brand/putkikasvu-symbol-v1.1.png');
 const d={...base,images:[{localPath:image,alt:'Tekninen P-symbolitestikuva, ei asiakastyö',approved:true,approvedBy:'synthetic-fixture',approvalRef:'synthetic-test-only',source:'existing-official-brand-fixture'}]};
 fs.writeFileSync(config,JSON.stringify(d));
 const run=()=>spawnSync(process.execPath,['scripts/create-lvi-demo.mjs','--input',config,'--slug',slug],{encoding:'utf8'});
 assert.equal(run().status,0);const output=path.resolve('.demo-output',slug);const generated=JSON.parse(fs.readFileSync(path.join(output,'data/example.json'),'utf8'));
 assert.equal(generated.images[0].src,'/images/'+slug+'-1.png');assert.equal(generated.images[0].localPath,undefined);
 assert.deepEqual(fs.readFileSync(path.join(output,'public/images',slug+'-1.png')),fs.readFileSync(image));
 assert.notEqual(run().status,0);
 // Remove only this test's own generated directory and input.
 fs.rmSync(output,{recursive:true});fs.rmSync(dir,{recursive:true});
});
test('verified email-only company does not require a fabricated phone',()=>{assert.doesNotThrow(()=>validateDemo({...base,phone:null,businessId:'3454047-8',heroTitle:'Asennustyöt'}));assert.throws(()=>validateDemo({...base,businessId:'invalid'}));assert.throws(()=>validateDemo({...base,heroTitle:'x'.repeat(301)}));});
