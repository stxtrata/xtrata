#!/usr/bin/env node
// Actual Pro gate bundle, simulated server sessions, no wallet connection or chain calls.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {serve,browser} from './serve.mjs';
const {srv,url}=await serve(),b=await browser();
const ADDRESS='SP'+'0'.repeat(39),KEY='xtrata.v15.1.wallet.session';
try{
async function scenario({signedIn=true,allowed=true,expired=false,session=true}={}){
 const context=await b.newContext(),page=await context.newPage(),errors=[];let mounted=0,deleted=0,posts=0,current={signedIn,allowed,address:ADDRESS,tokenId:999999};
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({KEY,ADDRESS,session})=>{if(window!==top)return;if(session)localStorage.setItem(KEY,JSON.stringify({isConnected:true,address:ADDRESS,network:'mainnet'}));const interval=window.setInterval;window.setInterval=(fn,ms,...args)=>{if(ms===60000)window.__proRecheck=fn;return interval(fn,ms,...args);};},{KEY,ADDRESS,session});
 await context.route('**/*',route=>{const req=route.request(),target=new URL(req.url());if(target.origin!==url)return route.abort();
  if(target.pathname==='/api/audionaut-beta-pro/session'){
   if(req.method()==='DELETE'){deleted++;current={signedIn:false,allowed:false};}
   if(req.method()==='POST')posts++;
   return route.fulfill({contentType:'application/json',body:JSON.stringify(current)});
  }
  if(target.pathname==='/audionaut/sell/audionaut-sell.js')return route.fulfill({contentType:'text/javascript',body:'// purchasing excluded'});
  if(target.pathname==='/audionaut-beta-pro/daw.html'){mounted++;return route.fulfill({contentType:'text/html',body:`<!doctype html><title>Loaded project</title><script>window.workingProject={name:'Unsaved work'};addEventListener('message',e=>{if(e.origin!==location.origin)return;if(e.data.type==='audionaut-pro-access-expired')window.accessPaused=true;if(e.data.type==='audionaut-pro-export-project'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(window.workingProject)],{type:'application/json'}));a.download='recovered.json';a.click();}});</script>`});}
  if(target.pathname.startsWith('/hiro/'))return route.fulfill({contentType:'application/json',body:JSON.stringify(target.pathname.includes('/holdings')?{total:0,results:[]}:{okay:true,result:'0x09'})});
  if(target.pathname.startsWith('/i/'))return route.fulfill({contentType:'text/plain',body:'display-only fixture'});
  return route.continue();
 });
 await page.goto(url+'/audionaut-beta-pro/');
 if(!session){await page.waitForTimeout(250);assert.equal(mounted,0);assert.equal(posts,0);}
 else if(!signedIn||!allowed){await page.waitForFunction(()=>['Signal lost','Access denied'].includes(document.querySelector('#headline').textContent));assert.equal(mounted,0);assert.equal(posts,0,'returning visits never trigger a signature automatically');}
 else{
  await page.waitForFunction(()=>document.body.dataset.view==='seq');assert.equal(mounted,1);const frame=page.frames().find(f=>f.url().endsWith('/audionaut-beta-pro/daw.html'));assert.ok(frame);
  if(expired){current={signedIn:false,allowed:false};await page.evaluate(()=>window.__proRecheck());await page.waitForFunction(()=>document.querySelector('#pro-export-current'));assert.equal(mounted,1);assert.equal(await frame.evaluate(()=>window.workingProject.name),'Unsaved work');assert.equal(await frame.evaluate(()=>window.accessPaused),true);const download=page.waitForEvent('download');await page.click('#pro-export-current');assert.equal((await download).suggestedFilename(),'recovered.json');assert.equal(await page.locator('#daw').getAttribute('src'),'/audionaut-beta-pro/daw.html');}
  else{await page.click('#leave');await page.waitForFunction(()=>!document.querySelector('#daw').hasAttribute('src'));assert.equal(deleted,1);assert.equal(await page.evaluate(KEY=>localStorage.getItem(KEY),KEY),null);}
 }
 assert.deepEqual(errors,[]);await context.close();
}
await scenario({session:false});await scenario({signedIn:false,allowed:false});await scenario({signedIn:true,allowed:false});await scenario();await scenario({expired:true});
const pkg=JSON.parse(await readFile(new URL('../../../package.json',import.meta.url)));assert.ok(pkg.scripts.prebuild.includes('build:audionaut-beta-pro'));assert.ok(pkg.scripts['build:audionaut-beta-pro'].includes('vite.audionaut-beta-pro.config.ts'));
console.log('PASS Pro gate: sealed/unverified/nonmember, authenticated membership, disconnect, expiry retains project and allows rescue download; dedicated build script');
}finally{await b.close();srv.close();}
