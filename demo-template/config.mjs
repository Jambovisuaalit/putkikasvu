import {readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const demoRoot=path.dirname(fileURLToPath(import.meta.url));
const clean=(x,max=160)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
export function validateDemo(d,{checkAssets=true}={}) {
 const need=(ok,message)=>{if(!ok)throw new Error(message)};
 need(d?.status==='draft','Every demo must remain draft');
 need(clean(d.companyName)&&clean(d.area),'Company and service area required');
 need(d.synthetic===true || (d.verified===true&&clean(d.source)&&clean(d.checkedAt)),'Verified source or explicit synthetic fixture required');
 need(Array.isArray(d.services)&&d.services.length>=1&&d.services.length<=6,'Supply 1–6 verified services');
 for(const s of d.services)need(clean(s.title,60)&&clean(s.description,240),'Service title/description required');
 need(/^\+?[0-9 ()-]{5,25}$/.test(d.phone)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),'Valid phone and email required');
 need(!('reviews' in d)&&!('references' in d),'Reviews and references are not part of this template');
 need(Array.isArray(d.images)&&d.images.length<=3,'Supply at most 3 approved images');
 for(const i of d.images){
  need(i.approved===true&&clean(i.approvedBy)&&clean(i.approvalRef)&&clean(i.source)&&clean(i.alt,180),'Image approval, source and descriptive alt required');
  need(/^\/images\/[a-z0-9-]+\.(png|jpg|jpeg|webp)$/.test(i.src),'Only local raster images with safe filenames allowed');
  if(checkAssets)need(existsSync(path.join(demoRoot,'public',i.src)),'Approved image file missing');
 }
 need(!d.callToAction || d.callToAction==='request','Unsupported CTA');
 return d;
}
export function loadDemo(){
 const file=process.env.PK_DEMO_DATA?path.resolve(process.env.PK_DEMO_DATA):path.join(demoRoot,'data/example.json');
 const d=validateDemo(JSON.parse(readFileSync(file,'utf8')));
 // Never allow unused files to leak into the static public export.
 const folder=path.join(demoRoot,'public/images');
 const allowed=new Set(d.images.map(i=>path.basename(i.src)));
 if(existsSync(folder))for(const name of readdirSync(folder))if(!allowed.has(name))throw new Error('Unreferenced image blocked: '+name);
 return d;
}
export function assertLocalOnly(env=process.env){
 if(env.VERCEL || env.VERCEL_ENV || env.DEPLOYMENT_URL || env.PK_DEMO_ALLOW_PUBLIC)throw new Error('Unpublished demo: remote/public builds are blocked. Separate authenticated deployment review required.');
}
