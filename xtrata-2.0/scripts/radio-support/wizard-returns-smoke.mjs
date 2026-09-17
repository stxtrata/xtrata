// Real local UI/server + disposable wallet; every chain request is simulated.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {deserializeTransaction} from '@stacks/transactions';
import {RadioWizard} from '../wizard/radio-plays-backend.mjs';
import {createWizardServer} from '../wizard/radio-plays-server.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),artifacts=join(root,'.artifacts/radio-wizard-returns');
await mkdir(artifacts,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const width of [1200,390]){
  const dir=await mkdtemp(join(tmpdir(),'radio-returns-ui-'));let server,page;
  try{
   const w=new RadioWizard(dir,async()=>{throw Error('External network forbidden');});const {address}=await w.setup();
   let balance=1500000n,nonce=0,broadcasts=0,txs=new Map();
   w.api=async(path,options)=>{
    if(path==='/v2/info')return {network_id:1};
    if(path.includes('/accounts/'))return {nonce,balance:balance.toString()};
    if(path.endsWith('/nonces'))return {possible_next_nonce:nonce};
    if(path.startsWith('/extended/v1/tx/'))return txs.get(path.split('/').at(-1));
    if(path==='/v2/transactions'){
     const tx=deserializeTransaction(options.body),entry=(await w.json('returns.json')).at(-1);
     assert.equal(tx.payload.amount,BigInt(entry.amount));assert.equal(tx.auth.spendingCondition.fee,300n);
     broadcasts++;balance-=BigInt(entry.amount)+300n;
     txs.set(entry.txid,{tx_id:entry.txid,tx_type:'token_transfer',tx_status:'success',canonical:true,is_unanchored:false,
      sender_address:address,nonce,fee_rate:'300',token_transfer:{recipient_address:entry.recipient,amount:entry.amount}});nonce++;return tx.txid();
    }
    throw Error('Unmocked chain path');
   };
   server=createWizardServer(w,null);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
   const origin=`http://127.0.0.1:${server.address().port}`;
   for(const [path,options] of [['/return/confirm',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{"id":"bad"}'}],['/return/confirm',{method:'GET'}],['/return/prepare',{method:'POST',headers:{Origin:origin,'Content-Type':'text/plain'},body:'{}'}]])assert.equal((await fetch(origin+path,options)).status,400);
   page=await browser.newPage({viewport:{width,height:1000}});page.setDefaultTimeout(10000);
   await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin);await page.waitForFunction(()=>document.getElementById('balance').textContent==='1.500000');
   assert.equal(await page.locator('#over-limit').isVisible(),true);assert.equal(await page.locator('#run').isDisabled(),true);
   await page.locator('#return-recipient').fill('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
   await page.locator('#warning-excess').click();await page.locator('#return-review').waitFor();
   assert.match(await page.locator('#return-details').textContent(),/0.499700 STX/);assert.equal(broadcasts,0);
   assert.equal(await page.locator('#return-confirm').isDisabled(),true);
   await page.locator('#return-approve').check();await page.locator('#return-fee').fill('301');assert.equal(await page.locator('#return-confirm').isDisabled(),true);
   await page.locator('#return-cancel').click();assert.equal(broadcasts,0);
   await page.locator('#return-fee').fill('300');await page.locator('#return-excess').click();await page.locator('#return-review').waitFor();
   await page.reload();await page.locator('#return-review').waitFor();
   assert.equal(await page.locator('#return-approve').isChecked(),false);assert.equal(broadcasts,0);
   await page.screenshot({path:join(artifacts,`review-${width}.png`),fullPage:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.locator('#return-approve').check();await page.locator('#return-confirm').click();
   await page.waitForFunction(()=>document.getElementById('balance').textContent==='1.000000');assert.equal(broadcasts,1);assert.equal(await page.locator('#over-limit').isVisible(),false);
   await page.locator('#return-all').click();await page.locator('#return-review').waitFor();assert.match(await page.locator('#return-details').textContent(),/0.999700 STX/);
   await page.locator('#return-approve').check();await page.locator('#return-confirm').click();
   await page.waitForFunction(()=>document.getElementById('balance').textContent==='0.000000');assert.equal(broadcasts,2);assert.equal(w.stopped,true);
   assert.match(await page.locator('#activity').textContent(),/Return all · confirmed/);
   await page.reload();await page.waitForFunction(()=>document.getElementById('balance').textContent==='0.000000');assert.equal(broadcasts,2);
   await page.screenshot({path:join(artifacts,`completed-${width}.png`),fullPage:true});assert.deepEqual(errors,[]);
   console.log(`Wizard return UI ${width}px: excess, all, fee review, cancellation, reload, history and HTTP origin guards passed; 2 simulated transfers.`);
  }finally{await page?.close();if(server)await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});}
 }
}finally{await browser.close();}
