import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile,mkdir} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import {chromium} from "playwright";

const root=path.resolve("out");
const screenshots=path.resolve("qa-screenshots");
const errors=[];
let passed=0;
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".png":"image/png",".svg":"image/svg+xml",".woff2":"font/woff2",".woff":"font/woff",".ico":"image/x-icon"};
const server=createServer(async(req,res)=>{
 try{
  let p=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  if(p==="/")p="/index.html";
  let file=path.resolve(root,"."+p);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  if(!existsSync(file)&&!path.extname(file))file+=".html";
  if(!existsSync(file)){res.writeHead(404);res.end("Not found");return}
  const buf=await readFile(file);
  res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
  res.end(buf);
 }catch(e){res.writeHead(500);res.end(String(e))}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const base="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
await mkdir(screenshots,{recursive:true});

async function check(name,fn){try{await fn();passed++;console.log("PASS "+name)}catch(e){errors.push(name+": "+String(e));console.error("FAIL "+name,e)}}
async function overflow(page,context){
 const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 assert.ok(sizes.scroll<=sizes.client+2,context+": "+JSON.stringify(sizes));
}
for(const width of [375,390,768,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});
 page.setDefaultTimeout(12000);
 page.setDefaultNavigationTimeout(12000);
 await check("home "+width+"px: layout/images/fonts",async()=>{
  const result=await page.goto(base+"/",{waitUntil:"domcontentloaded"});
  assert.equal(result.status(),200);
  await page.waitForTimeout(300);
  assert.equal(await page.locator("h1").count(),1);
  assert.equal(await page.locator("main#main-content").count(),1);
  const images=await page.locator("img").evaluateAll(xs=>xs.map(x=>({src:x.getAttribute("src"),ok:x.complete&&x.naturalWidth>0})));
  assert.ok(images.length>=2);
  assert.ok(images.every(x=>x.ok),JSON.stringify(images));
  const fonts=await page.evaluate(()=>({h:getComputedStyle(document.querySelector(".hero h1")).fontFamily,p:getComputedStyle(document.querySelector(".lead")).fontFamily}));
  assert.match(fonts.h,/Manrope/i);
  assert.match(fonts.p,/Inter/i);
  await overflow(page,"home "+width);
  assert.equal(await page.locator(".navlinks a[href='#miten']").isVisible(),true);
  assert.equal(await page.locator(".hero a[href^='mailto:']").isVisible(),true);
  assert.match(await page.locator(".hero a[href^='mailto:']").getAttribute("href"),/jami@putkikasvu\.com/);
  assert.equal(await page.locator("a[href*='checkout.revolut.com']").count(),0);
  await page.screenshot({timeout:12000,path:path.join(screenshots,"home-"+width+".png"),fullPage:true});
 });
 await check("home "+width+"px: real click resolves prefilled email draft and accessible fallback",async()=>{
  await page.goto(base+"/",{waitUntil:"domcontentloaded"});
  const links=page.locator('a[href^="mailto:jami@putkikasvu.com?"]');
  assert.equal(await links.count(),6);
  const href=await links.first().getAttribute("href");
  const parsed=new URL(href);
  assert.equal(parsed.protocol,"mailto:");
  assert.equal(parsed.pathname,"jami@putkikasvu.com");
  assert.equal(parsed.searchParams.get("subject"),"Putkikasvu | Esimerkkisivupyyntö");
  const body=parsed.searchParams.get("body");
  for(const term of ["Yritys:","Paikkakunta / palvelualue:","Yhteyshenkilö:"])
    assert.ok(body.includes(term),term);
  // Intercept navigation ONLY in this local Chromium test: no mail client launched.
  await page.evaluate(()=>{window.__mailtoClicks=0;document.addEventListener("click",event=>{
    if(event.target?.closest?.('a[href^="mailto:"]')){event.preventDefault();window.__mailtoClicks++;}
  },true)});
  await links.first().click();
  assert.equal(await page.evaluate(()=>window.__mailtoClicks),1);
  const fallback=page.locator('#yhteys');
  assert.equal(await fallback.count(),1);
  assert.equal(await fallback.locator('a[href="mailto:jami@putkikasvu.com"]').count(),1);
  const copy=fallback.getByRole("button",{name:"Kopioi sähköpostiosoite"});
  assert.equal(await copy.isVisible(),true);
  // Next.js static HTML can arrive before client-side hydration. Wait for all
  // page assets/React listeners rather than treating pre-hydration clicks as failure.
  await page.waitForLoadState("networkidle",{timeout:12000});
  await copy.click();
  await page.waitForFunction(()=>/Osoite kopioitu|Kopiointi ei onnistunut/.test(document.querySelector("#yhteys [role=status]")?.textContent||""),null,{timeout:5000});
  const status=await fallback.locator('[role="status"]').innerText();
  assert.match(status,/Osoite kopioitu|Kopiointi ei onnistunut/);
 });
 await check("home "+width+"px: anchors and FAQ keyboard",async()=>{
  await page.goto(base+"/",{waitUntil:"domcontentloaded"});
  await page.locator(".navlinks a[href='#hinta']").click();
  assert.equal(new URL(page.url()).hash,"#hinta");
  const summary=page.locator("details summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("details").first().getAttribute("open"),"");
 });
 for(const route of ["ehdot","tietosuoja"]){
  await check(route+" "+width+"px: route/logo/reflow",async()=>{
   const result=await page.goto(base+"/"+route,{waitUntil:"domcontentloaded"});
   assert.equal(result.status(),200);
   assert.equal(await page.locator("h1").count(),1);
   assert.equal(await page.locator("main#main-content").count(),1);
   const image=page.locator("img.brand-wordmark").first();
   assert.equal(await image.evaluate(x=>x.complete&&x.naturalWidth>0),true);
   await overflow(page,route+" "+width);
   await page.screenshot({path:path.join(screenshots,route+"-"+width+".png"),fullPage:true});
  });
 }
 await page.close();
}
const keyboard=await browser.newPage({viewport:{width:1440,height:900}});
keyboard.setDefaultTimeout(12000);
await check("skip link and main landmark via keyboard",async()=>{
 await keyboard.goto(base+"/",{waitUntil:"domcontentloaded"});
 await keyboard.waitForTimeout(350);
 await keyboard.keyboard.press("Tab");
 assert.equal(await keyboard.evaluate(()=>document.activeElement?.classList.contains("skip-link")),true);
 await keyboard.keyboard.press("Enter");
 assert.equal(new URL(keyboard.url()).hash,"#main-content");
 assert.equal(await keyboard.evaluate(()=>document.activeElement?.id),"main-content");
});
await keyboard.close();
for(const width of [768,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});
 page.setDefaultTimeout(12000);
 page.setDefaultNavigationTimeout(12000);
 await check("200% equivalent browser reflow at "+width+"px",async()=>{
  await page.goto(base+"/",{waitUntil:"domcontentloaded"});
  await page.setViewportSize({width:Math.floor(width/2),height:900});
  await overflow(page,"zoom "+width);
  await page.screenshot({path:path.join(screenshots,"zoom-200-"+width+".png"),fullPage:true});
 });
 await page.close();
}
const page=await browser.newPage();
await check("404 output, robots and no write form",async()=>{
 assert.equal((await page.goto(base+"/404.html")).status(),200);
 await page.goto(base+"/",{waitUntil:"domcontentloaded"});
 assert.match(await page.locator('meta[name="robots"]').getAttribute("content"),/noindex/);
 assert.equal(await page.locator("form").count(),0);
});
await page.close();
await browser.close();
await new Promise(resolve=>server.close(resolve));
console.log("BROWSER_QA "+JSON.stringify({passed,failed:errors.length,errors}));
if(errors.length)process.exitCode=1;
