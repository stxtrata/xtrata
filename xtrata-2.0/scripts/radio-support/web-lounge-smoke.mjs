// Real unpacked extension + local HTTP approval; no keys, signing or external requests.
import {chromium} from 'playwright';
import {mkdtemp,readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {createWizardServer} from '../wizard/radio-plays-server.mjs';
const dir=await mkdtemp(join(tmpdir(),'xtrata-web-smoke-'));let browser,server,paid=0,created=false;
const w={stopEpoch:0,running:false,stop(){this.stopEpoch++;},optional:async name=>name==='vault.json'&&created?{address:'simulated'}:null,status:async()=>({address:'simulated',balanceMicroSTX:'1000000',entries:[]}),setup:async()=>{created=true;return {address:'simulated'};},exclusive:async f=>f(),journal:async()=>[],reconcile:async()=>{},reconcileReturns:async()=>{},json:async()=>({address:'simulated'}),returnAccount:async()=>({balance:1000000n}),run:async()=>{paid++;}};
try{
 server=createWizardServer(w,null,{audio:async()=>{},loaded:new Set([315]),tracks:[{id:315,title:'Entertainment',artist:'melophonic'}]});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 const ext=join(dir,'extension');await mkdir(ext);for(const name of ['manifest.json','background.js','content.js','validate.js'])await writeFile(join(ext,name),(await readFile('extensions/music-support/'+name,'utf8')).replaceAll('8798',String(port)));
 const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
 browser=await chromium.launchPersistentContext(join(dir,'profile'),{...(executablePath?{executablePath}:{channel:'chromium'}),headless:true,args:['--disable-extensions-except='+ext,'--load-extension='+ext]});
 await browser.route('https://xtrata.xyz/**',async route=>{const path=new URL(route.request().url()).pathname;if(path==='/radio/counts')return route.fulfill({json:{tracks:[]}});if(path==='/xtrata-radio.js')return route.fulfill({contentType:'text/javascript',body:'window.XtrataRadio={subscribe:f=>f({playing:false,volumeStep:8}),playPause(){},next(){},prev(){}};'});const file=path==='/radio/browser-lounge'?'/radio/browser-lounge.html':path;try{const body=(await readFile('public'+file,'utf8')).replaceAll('8798',String(port));return route.fulfill({body,contentType:file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':'text/css'});}catch{return route.abort();}});
 const page=await browser.newPage();await page.goto('https://xtrata.xyz/radio/browser-lounge');
 // Exercise actual content script/worker, with ephemeral test port.
 const rpc=(method,fields={})=>page.evaluate(({method,fields})=>new Promise(resolve=>{const id=crypto.randomUUID().replaceAll('-','');const fn=e=>{if(e.data?.channel==='xtrata-support-response'&&e.data.id===id){window.removeEventListener('message',fn);resolve(e.data.result);}};window.addEventListener('message',fn);window.postMessage({channel:'xtrata-support-request',request:{id,method,...fields}},location.origin);setTimeout(()=>resolve({error:'timeout'}),10000);}),{method,fields});
 await page.locator('#connect').click();await page.locator('#review').waitFor({state:'visible'});
 const local=await browser.newPage();await local.goto(await page.locator('#review').getAttribute('href'));await local.locator('#consent').check();await local.locator('#approve').click();await local.getByText('Approved. Return',{exact:false}).waitFor();await page.locator('#connected').waitFor({state:'visible',timeout:20000});
 await page.locator('#create').click();await page.getByText('Funds detected.',{exact:false}).waitFor();assert.equal(paid,0);
 await page.locator('#support').click();await page.locator('#review').waitFor({state:'visible'});await local.goto(await page.locator('#review').getAttribute('href'));await local.locator('#consent').check();await local.locator('#approve').click();await local.getByText('Approved. Return',{exact:false}).waitFor();await page.getByText('SUPPORT ON · new starts can pay',{exact:true}).waitFor({timeout:20000});
 const startId='d'.repeat(32);await page.evaluate(id=>window.dispatchEvent(new CustomEvent('xtrata:radio-audible-start',{detail:{song:315,id,duration:60}})),startId);await page.waitForTimeout(300);await rpc('start',{song:315,startId,duration:60});assert.equal(paid,1);await page.locator('#free').click();await page.getByText('FREE PLAY · support off',{exact:true}).waitFor();assert.equal((await rpc('status')).enabled,false);
 for(const width of [1280,390]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await mkdir('.artifacts/web-lounge',{recursive:true});await page.screenshot({path:'.artifacts/web-lounge/lounge-'+width+'.png',fullPage:true});}
 console.log('PASS: real extension pairing, local spending consent, simulated start/dedup/stop, desktop/mobile layout. No wallet or chain transactions.');
}finally{await browser?.close();if(server)await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
