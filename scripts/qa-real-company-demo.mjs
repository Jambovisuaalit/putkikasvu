import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,readFileSync,mkdirSync,existsSync} from "node:fs";
import {tmpdir} from "node:os";
import {performance} from "node:perf_hooks";
import {createServer} from "node:http";
import path from "node:path";
import assert from "node:assert/strict";
import {chromium} from "playwright";

/* Only verifiable PUBLIC company facts. Not a customer reference. */
const company={
  status:"draft",synthetic:false,verified:true,
  source:"https://www.lviupp.fi/; https://www.lviupp.fi/palvelut/",
  checkedAt:"2026-10-22",companyName:"Lvi-Upp Oy",
  area:"Pääkaupunkiseutu ja sopimuksen mukaan Uusimaa",
  phone:"050 595 5118",email:"info@lviupp.fi",
  services:[
    {title:"Putkityöt",description:"Putkityöt pienistä huoltotöistä suurempiin projekteihin yksityisille ja yrityksille."},
    {title:"Uudis- ja saneeraustyöt",description:"Putkityöt uudis- ja saneerauskohteisiin sekä urakat erikseen sovitusti."},
    {title:"LVI-huoltotyöt",description:"LVI-huoltotyöt sekä työn laajuuden ja aikataulun sopiminen yhteydenoton perusteella."}
  ],images:[]
};
const reportDir=path.resolve("qa-real-company-demo");
mkdirSync(reportDir,{recursive:true});
const fixture=path.join(mkdtempSync(path.join(tmpdir(),"pk-real-lvi-")),"verified-public.json");
writeFileSync(fixture,JSON.stringify(company,null,2),{mode:0o600});
const start=performance.now(),slug="lvi-upp-internal-20261022";
function run(args){
 const p=spawnSync(process.execPath,args,{encoding:"utf8",env:{...process.env,VERCEL:"",VERCEL_ENV:"",DEPLOYMENT_URL:"",PK_DEMO_ALLOW_PUBLIC:""},timeout:180000});
 assert.equal(p.status,0,args.join(" ")+"\n"+p.stdout+"\n"+p.stderr);
 return p.stdout;
}
const generated=JSON.parse(run(["scripts/create-lvi-demo.mjs","--input",fixture,"--slug",slug]));
run(["node_modules/next/dist/bin/next","build",generated.directory]);
const buildSeconds=Number(((performance.now()-start)/1000).toFixed(3));
const out=path.join(generated.directory,"out"),html=readFileSync(path.join(out,"index.html"),"utf8");
for(const x of [company.companyName,company.area,company.phone,company.email,...company.services.map(s=>s.title)])assert.ok(html.includes(x),x);
assert.match(html,/LUONNOS/);
assert.match(html,/noindex/i);
assert.doesNotMatch(html,/href="(?:tel:|mailto:)|<form\b|checkout\.revolut|supabase/i);
assert.ok(existsSync(path.join(out,"404.html")));
const server=createServer((req,res)=>{
 let url=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
 if(url==="/")url="/index.html";
 let file=path.resolve(out,"."+url);
 if(!file.startsWith(out+path.sep)){res.writeHead(403);res.end();return}
 if(!existsSync(file)&&!path.extname(file))file+=".html";
 if(!existsSync(file)){res.writeHead(404);res.end();return}
 const type=file.endsWith(".css")?"text/css":file.endsWith(".js")?"text/javascript":file.endsWith(".png")?"image/png":"text/html";
 res.writeHead(200,{"Content-Type":type});res.end(readFileSync(file));
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
let checks=0;
for(const width of [375,390,768,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});
 try {
  const response=await page.goto(base+"/",{waitUntil:"domcontentloaded",timeout:20000});
  assert.equal(response.status(),200);
  assert.equal(await page.locator("h1").count(),1);
  assert.equal(await page.locator(".draft").count(),1);
  assert.equal(await page.locator("a[href^='mailto:'],a[href^='tel:']").count(),0);
  const dims=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  assert.ok(dims.sw<=dims.cw+2,width+": "+JSON.stringify(dims));
  await page.screenshot({path:path.join(reportDir,"lvi-upp-"+width+".png"),fullPage:true});
  checks++;
 }finally{await page.close()}
}
await browser.close();
await new Promise(resolve=>server.close(resolve));
const seconds=Number(((performance.now()-start)/1000).toFixed(3));
const report={
 status:"PASS",date:"2026-10-22",legalCompany:"Lvi-Upp Oy",businessId:"2911820-5",
 source:["https://www.lviupp.fi/","https://www.lviupp.fi/palvelut/","https://www.asiakastieto.fi/yritykset/fi/lvi-upp-oy/29118205/rekisteritiedot"],
 companyConsent:false,publishApproval:false,
 images:0,contactLinksActive:false,published:false,
 techSeconds:seconds,buildSeconds,viewportChecks:checks,targetSeconds:1800,
 note:"Real, publicly verifiable corporate facts, local draft only; generation/build/browser QA timed. Does NOT measure source research, rights verification for future photos, human editorial approval, customer acceptance or deployment. Full 30-minute end-to-end promise remains UNVERIFIED."
};
writeFileSync(path.join(reportDir,"report.json"),JSON.stringify(report,null,2)+"\n");
console.log("REAL_DEMO_QA "+JSON.stringify(report));
