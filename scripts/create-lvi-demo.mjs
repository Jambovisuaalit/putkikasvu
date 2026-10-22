import {readFileSync,writeFileSync,mkdirSync,existsSync,cpSync,copyFileSync,statSync,chmodSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateDemo,demoRoot} from '../demo-template/config.mjs';
const args=process.argv.slice(2), input=args[args.indexOf('--input')+1], slug=args[args.indexOf('--slug')+1];
if(!args.includes('--input')||!args.includes('--slug')||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug??''))throw new Error('Usage: node scripts/create-lvi-demo.mjs --input verified.json --slug yritys-demo');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),target=path.join(root,'.demo-output',slug);
if(existsSync(target))throw new Error('Demo already exists; choose another slug. No files overwritten.');
const d=JSON.parse(readFileSync(path.resolve(input),'utf8'));
const assets=(d.images??[]).map((i,index)=>{
 const source=path.resolve(path.dirname(path.resolve(input)),i.localPath??'');
 const ext=path.extname(source).toLowerCase(),size=statSync(source).size;
 if(!['.png','.jpg','.jpeg','.webp'].includes(ext)||size>10*1024*1024)throw new Error('Image must be PNG/JPEG/WebP, maximum 10 MB');
 const data=readFileSync(source),png=data.subarray(0,8).toString('hex')==='89504e470d0a1a0a',jpg=data[0]===255&&data[1]===216,webp=data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP';
 if(!(ext==='.png'?png:ext==='.webp'?webp:jpg))throw new Error('Image signature does not match extension');
 const filename=slug+'-'+(index+1)+ext;return {source,filename,image:{...i,src:'/images/'+filename,localPath:undefined}};
});
const generated={...d,images:assets.map(a=>a.image)};validateDemo(generated,{checkAssets:false});
mkdirSync(target,{recursive:true,mode:0o700});chmodSync(path.dirname(target),0o700);
cpSync(demoRoot,target,{recursive:true,filter:src=>!['.next','out','private','node_modules'].some(part=>path.relative(demoRoot,src).split(path.sep).includes(part))});
for(const a of assets){mkdirSync(path.join(target,'public/images'),{recursive:true,mode:0o700});copyFileSync(a.source,path.join(target,'public/images',a.filename));}
const config=path.join(target,'data/example.json');writeFileSync(config,JSON.stringify(generated,null,2)+'\n',{mode:0o600});chmodSync(config,0o600);
console.log(JSON.stringify({slug,directory:target,status:'draft',mode:'local-only',approvedImages:assets.length}));
