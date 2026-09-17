// Isolated real browser/audio, temporary wizard, entirely simulated chain.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {cvToHex,Cl,deserializeTransaction} from '@stacks/transactions';
import {RadioWizard} from '../wizard/radio-plays-backend.mjs';
import {createWizardServer} from '../wizard/radio-plays-server.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),output=join(root,'.artifacts/radio-wizard-listening');await mkdir(output,{recursive:true});
const lounge=process.env.RADIO_LOUNGE==='1';
const recipient='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
// A real, short PCM tone generated in memory; no remote music or personal profile.
const samples=8000*20,wav=Buffer.alloc(44+samples*2);wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);for(let i=0;i<samples;i++)wav.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*440/8000)*2000),44+i*2);
const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const width of [1200,390]){
 const dir=await mkdtemp(join(tmpdir(),'wizard-listening-'));let server,page,w;
 try{
  w=new RadioWizard(dir,async()=>{throw Error('Network forbidden');});const {address}=await w.setup();let sent=0,confirmed=false,balance=1000000n;
  const source=await readFile(join(root,'contracts/live/xtrata-radio-plays-v1.0.clar'),'utf8');
  w.api=async(path,opts)=>{
   if(path==='/v2/info')return {network_id:1};if(path.includes('/source/'))return {source};
   if(path.includes('/accounts/'))return {nonce:confirmed?sent:Math.max(0,sent-1),balance:balance.toString()};
   if(path.endsWith('/nonces'))return {possible_next_nonce:confirmed?sent:Math.max(0,sent-1)};
   if(path.includes('/get-owner'))return {okay:true,result:cvToHex(Cl.ok(Cl.some(Cl.standardPrincipal(recipient))))};
   if(path.includes('/get-receipt')){const row=(await w.journal()).at(-1);return {okay:true,result:cvToHex(Cl.some(Cl.tuple({core:Cl.uint(3),id:Cl.uint(row.song),recipient:Cl.standardPrincipal(recipient)})))};}
   if(path==='/v2/transactions'){const tx=deserializeTransaction(opts.body);assert.equal(tx.payload.functionName.content,'play');assert.equal(tx.auth.spendingCondition.fee,300n);sent++;balance-=350n;return tx.txid();}
   if(path.startsWith('/extended/v1/tx/'))return {tx_status:confirmed?'success':'pending',canonical:true,is_unanchored:false,sender_address:address,contract_call:{contract_id:recipient+'.xtrata-radio-plays-v1-0',function_name:'play'}};
   throw Error('Unexpected simulated path');
  };
  const tracks=[{id:2910,title:'Test song one',artist:'Fixture artist',album:'Local test album'},{id:2985,title:'Test song two',artist:'Fixture artist',album:''}];
  const media={loaded:new Set(),catalogue:async()=>tracks,audio:async id=>{media.loaded.add(id);return {mime:'audio/wav',body:wav};}};
  server=createWizardServer(w,null,media);await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
  page=await browser.newPage({viewport:{width,height:1000}});page.setDefaultTimeout(15000);page.on('dialog',d=>d.accept());
  await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin+(lounge?'/lounge':''));
  await page.locator('#radio-load').click();await page.waitForFunction(()=>document.querySelectorAll('#radio-songs option').length===2);
  await page.locator('#radio-play').click();await page.waitForFunction(()=>document.getElementById('radio-audio').currentTime>.05);assert.equal(sent,0);
  if(!lounge){await page.getByText('Paid mainnet test settings',{exact:true}).click();await page.locator('#radio-paid-max').fill('2');}await page.locator('#radio-approve').check();await page.locator('#radio-enable').click();
  await page.waitForFunction(()=>/^(PAID TEST|CONTINUOUS PAID)/.test(document.getElementById('radio-mode').textContent));assert.equal(sent,0);
  await page.locator('#radio-next').click();await page.waitForFunction(()=>document.getElementById('radio-payment').textContent.includes('Payment requested'));
  await new Promise(r=>setTimeout(r,200));assert.equal(sent,1);
  await page.locator('#radio-play').click();await page.locator('#radio-play').click();await page.evaluate(()=>{document.getElementById('radio-audio').currentTime=2;});assert.equal(sent,1);
  await page.locator('#radio-next').click();await page.waitForFunction(()=>document.getElementById('radio-payment').textContent.includes('stays free'));assert.equal(sent,1);
  confirmed=true;await new Promise(r=>setTimeout(r,5500));assert.equal(sent,1);
  await page.locator('#radio-next').click();await page.waitForFunction(()=>document.getElementById('radio-payment').textContent.includes('Payment requested'));await new Promise(r=>setTimeout(r,200));assert.equal(sent,2);
  await page.locator('#radio-free').click();await page.waitForFunction(()=>document.getElementById('radio-mode').textContent.startsWith('FREE'));assert.equal(await page.locator('#radio-audio').evaluate(a=>a.paused),false);
  await page.locator('#radio-next').click();await page.waitForFunction(()=>document.getElementById('radio-payment').textContent.startsWith('Free start'));assert.equal(sent,2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.locator(lounge?'main':'#listening-section').screenshot({path:join(output,`${lounge?'lounge':'player'}-${width}.png`)});
  await page.reload();assert.match(await page.locator('#radio-mode').textContent(),/^FREE/);assert.equal(sent,2);assert.deepEqual(errors,[]);
  console.log(`Radio ${width}px: real audio, free/paid switch, no mid-song debit, skip, pause/resume, seek, pending-free fallback and reload passed. Two simulated mainnet calls.`);
 }finally{await page?.close();if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}w?.stop();for(let i=0;i<30&&w?.running;i++)await new Promise(r=>setTimeout(r,200));await rm(dir,{recursive:true,force:true});}
}}finally{await browser.close();}
