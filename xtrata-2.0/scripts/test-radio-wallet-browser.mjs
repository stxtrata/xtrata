// Isolated disposable-wallet smoke test. Every blockchain request and broadcast is mocked.
import {chromium} from 'playwright';
import {readFile,unlink,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';
import {Cl,cvToHex,deserializeTransaction} from '@stacks/transactions';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('contracts/live/xtrata-radio-plays-v1.0.clar',root),'utf8');
const deployer='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',contract=deployer+'.xtrata-radio-plays-v1-0';
const folder=await mkdtemp(join(tmpdir(),'radio-wallet-smoke-'));
const backup=join(folder,'encrypted-backup.json');
const publicRoot=new URL('../public/',import.meta.url);
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const file=new URL('.'+url.pathname,publicRoot);if(!file.href.startsWith(publicRoot.href))throw Error();const data=await readFile(file);const type=file.pathname.endsWith('.js')?'text/javascript':file.pathname.endsWith('.css')?'text/css':'text/html';res.writeHead(200,{'content-type':type});res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;

const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--autoplay-policy=no-user-gesture-required']});
const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();page.setDefaultTimeout(10000);
let wallet='',nonce=0,balance=1000000n,calls=0;
const txs=new Map(),receipts=new Map(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const reply=(route,value,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
const cv=(route,value)=>reply(route,{okay:true,result:cvToHex(value)});
const wav=Buffer.alloc(44+8000*60*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);
await context.route('**/*',async route=>{
 const url=new URL(route.request().url());if(url.origin!==origin){await route.abort();return;}
 if(url.pathname.startsWith('/runtime/content'))return route.fulfill({contentType:'audio/wav',body:wav});
 if(!url.pathname.startsWith('/hiro/'))return route.continue();
 const path=url.pathname;
 if(path.includes('/source/'))return reply(route,{source});
 if(path.endsWith('/get-config'))return cv(route,Cl.ok(Cl.tuple({version:Cl.uint(1),'holder-payment':Cl.uint(50),'receipt-bytes':Cl.uint(16),'core-1':Cl.contractPrincipal(deployer,'xtrata-v1-1-1'),'core-2':Cl.contractPrincipal(deployer,'xtrata-v2-1-0'),'core-3':Cl.contractPrincipal(deployer,'xtrata-v3-2-3')})));
 if(path.endsWith('/get-owner'))return cv(route,Cl.ok(Cl.some(Cl.standardPrincipal(deployer))));
 if(path.endsWith('/get-receipt')){const args=route.request().postDataJSON().arguments;return cv(route,receipts.get(args[1])||Cl.none());}
 if(path.includes('/v2/accounts/'))return reply(route,{balance:'0x'+balance.toString(16),nonce});
 if(path.endsWith('/nonces'))return reply(route,{possible_next_nonce:nonce,last_mempool_tx_nonce:null,detected_missing_nonces:[]});
 if(path.endsWith('/v2/transactions')){
  calls++;const tx=deserializeTransaction(new Uint8Array(route.request().postDataBuffer()));const id='0x'+tx.txid();const fee=tx.auth.spendingCondition.fee;
  if(fee===200n)return reply(route,{error:'transaction rejected',reason:'FeeTooLow'},400);
  const base={tx_id:id,sender_address:wallet,canonical:true,is_unanchored:false,block_height:100,tx_status:'success',fee_rate:fee.toString()};
  if(tx.payload.payloadType===2){assert.equal(tx.payload.functionName.content,'play');assert.equal(tx.postConditions.values[0].amount,50n);const [core,song,receipt]=tx.payload.functionArgs;receipts.set(cvToHex(receipt),Cl.some(Cl.tuple({core,id:song,recipient:Cl.standardPrincipal(deployer)})));Object.assign(base,{tx_type:'contract_call',contract_call:{contract_id:contract,function_name:'play'}});balance-=fee+50n;}
  else{const amount=tx.payload.amount;Object.assign(base,{tx_type:'token_transfer',token_transfer:{recipient_address:deployer,amount:amount.toString()}});balance-=fee+amount;}
  nonce++;txs.set(id,base);return reply(route,id.slice(2));
 }
 if(path.includes('/extended/v1/tx/')){const id=path.split('/').pop();return txs.has(id)?reply(route,txs.get(id)):reply(route,{},404);}
 throw Error('Unexpected mocked request '+path);
});
try{
 await page.goto(origin+'/radio/test-wallet.html');
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Ready.'));
 assert.equal(calls,0);
 await page.click('#get-address');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Create your dedicated wallet first'));assert.equal(await page.locator('#funding').isVisible(),false);
 await page.fill('#password','disposable-test-only-password');await page.click('#create');
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Wallet created'));
 assert.equal(await page.locator('#funding').isVisible(),false);
 const download=page.waitForEvent('download');await page.click('#backup');await (await download).saveAs(backup);
 await page.fill('#password','disposable-test-only-password');await page.setInputFiles('#restore',backup);
 await page.waitForFunction(()=>!document.querySelector('#funding').hidden);wallet=await page.locator('#address').textContent();assert.match(wallet,/^SP/);assert.equal(calls,0);
 await page.click('#get-address');await page.click('#refresh');await page.waitForFunction(()=>document.querySelector('#deposit-status').textContent.includes('Confirmed funds detected'));assert.equal(calls,0);
 await page.fill('#password','disposable-test-only-password');await page.click('#unlock');await page.waitForFunction(()=>document.querySelector('#mode').textContent.includes('Wallet unlocked'));
 await page.click('#preview');await page.waitForSelector('#review[open]');assert.equal(calls,0);await page.click('#approve');
 await page.waitForFunction(()=>document.querySelector('#history').textContent.includes('pending'));
 assert.equal(calls,1);await page.locator('#audio').evaluate(a=>{a.pause();a.play();a.dispatchEvent(new Event('playing'));});await page.waitForTimeout(150);assert.equal(calls,1);
 await page.click('#reconcile');await page.waitForFunction(()=>document.querySelector('#history').textContent.includes('confirmed'));assert.equal(calls,1);
 await page.reload();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Ready.'));assert.match(await page.locator('#mode').textContent(),/Wallet locked/);assert.equal(calls,1);
 const other=await context.newPage();await other.goto(origin+'/radio/test-wallet.html');await other.waitForFunction(()=>document.querySelector('#mode').textContent.includes('Read-only tab'));await other.close();
 await page.fill('#password','disposable-test-only-password');await page.click('#unlock');await page.waitForFunction(()=>document.querySelector('#mode').textContent.includes('Wallet unlocked'));
 await page.fill('#fee','0.0002');await page.click('#preview');await page.waitForSelector('#review[open]');await page.click('#approve');assert.equal(calls,1);await page.check('#low-fee');await page.click('#approve');await page.waitForFunction(()=>document.querySelector('#history').textContent.includes('Node rejected'));assert.equal(calls,2);
 await page.fill('#fee','0.0003');await page.fill('#max','2');await page.fill('#budget','0.0007');await page.click('#session');await page.waitForSelector('#review[open]');await page.click('#approve');await page.waitForFunction(()=>document.querySelector('#history').textContent.includes('pending'));assert.equal(calls,3);
 await page.click('#reconcile');await page.waitForFunction(()=>!document.querySelector('#history').textContent.includes('pending'));
 await page.locator('#audio').evaluate(a=>a.dispatchEvent(new Event('ended')));await page.waitForFunction(()=>document.querySelector('#history').textContent.includes('pending'));assert.equal(calls,4);
 await page.click('#reconcile');await page.waitForFunction(()=>!document.querySelector('#history').textContent.includes('pending'));await page.waitForFunction(()=>document.querySelector('#mode').textContent.includes('Automatic spending OFF'));
 await page.locator('#audio').evaluate(a=>a.dispatchEvent(new Event('ended')));await page.waitForTimeout(200);assert.equal(calls,4);await page.click('#stop');
 await page.fill('#recipient',deployer);await page.fill('#withdraw-amount','0.1');await page.click('#withdraw');await page.waitForSelector('#review[open]');assert.equal(calls,4);await page.click('#approve');await page.waitForFunction(()=>document.querySelector('#history').textContent.includes('Withdrawal'));await page.click('#reconcile');await page.waitForFunction(()=>!document.querySelector('#history').textContent.includes('pending'));assert.equal(calls,5);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
 await page.screenshot({path:join(folder,'mobile.png'),fullPage:true});
 await page.setViewportSize({width:1200,height:900});await page.screenshot({path:join(folder,'desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: encrypted create/backup/restore, funding address, manual approval, single paid start, no repeat on pause, reload lock, two-tab exclusion, rejected fee, capped session, withdrawal, mobile layout. All broadcasts simulated.');console.log('Screenshots: '+folder);
}catch(error){console.error('UI status:',await page.locator('#status').textContent());console.error('Browser errors:',errors);throw error;}finally{await context.close();await browser.close();await unlink(backup).catch(()=>{});await new Promise(resolve=>server.close(resolve));}
