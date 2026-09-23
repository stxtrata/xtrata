// Real bundled chooser, isolated browser and simulated extensions. No signing or network payments.
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 for(const wallet of ['Leather','Xverse Wallet']){
  const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.requests=[];
   const provider=name=>({request:async(method)=>{window.requests.push({name,method});return {addresses:[{address:'SP13MTGDX16JT7PVP60PSV6DQV422KZ8WXGXD34PY',publicKey:'02'+'11'.repeat(32),symbol:'STX'}]};}});
   window.LeatherProvider=provider('Leather');window.XverseProviders={StacksProvider:provider('Xverse'),BitcoinProvider:provider('Xverse')};
  });
  await page.route('**/*',async route=>{
   const p=new URL(route.request().url()).pathname;
   const file={'/music/profile':'music/profile.html','/radio/music-profile.js':'public/radio/music-profile.js','/radio/music-hub.css':'public/radio/music-hub.css','/radio/music-heroes.css':'public/radio/music-heroes.css'}[p];
   if(!file)return route.fulfill({status:404,body:''});
   return route.fulfill({body:await readFile(file),contentType:file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript'});
  });
  await page.goto('https://profile.test/music/profile');await page.locator('#profile-connect').click();
  const modal=page.locator('connect-modal');await modal.getByText('Connect a wallet',{exact:true}).waitFor();
  const row=modal.locator('li').filter({hasText:wallet});await row.getByRole('button',{name:'Connect',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#profile-wallet-address').textContent.includes('SP13MTGDX'));
  const calls=await page.evaluate(()=>window.requests);assert.ok(calls.some(c=>c.name===(wallet==='Leather'?'Leather':'Xverse')));assert.ok(calls.every(c=>!/(sign|transfer|broadcast)/i.test(c.method)));
  await page.locator('#profile-connect').click();await modal.getByText('Connect a wallet',{exact:true}).waitFor();await page.keyboard.press('Escape');await modal.waitFor({state:'detached'});
  assert.deepEqual(errors,[]);console.log('PASS:',wallet,'chooser selection, connection, switch and cancel; no signing.');await context.close();
 }
}finally{await browser.close();}
