// Real Electron window, local audio and simulated wallet; no signing or chain access.
import {_electron as electron} from 'playwright';
import {writeFile,rm,mkdir,mkdtemp} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
const entry=resolve('desktop/music/app/smoke-entry.mjs'),profile=await mkdtemp(join(tmpdir(),'music-desktop-test-'));
await writeFile(entry,`
import {app} from 'electron';
import {launchDesktop} from '../window.mjs';
app.setPath('userData',${JSON.stringify(profile)});void (async()=>{await app.whenReady();
let paid=0;const entries=[];
const wizard={stopEpoch:0,running:false,stop(){this.stopEpoch++;},setup:async()=>({address:'SIMULATED WALLET'}),status:async()=>({address:'SIMULATED WALLET',balanceMicroSTX:'1000000',entries,returns:[],message:'Simulation only'}),optional:async()=>null,journal:async()=>entries,reconcile:async()=>{},reconcileReturns:async()=>{},exclusive:async f=>f(),json:async()=>({address:'SIMULATED WALLET'}),returnAccount:async()=>({balance:1000000n}),run:async(p,meta)=>{paid++;entries.push({...p,...meta,status:'confirmed',recipient:'SIMULATED HOLDER',createdAt:new Date().toISOString()});}};
const samples=8000*8,wav=Buffer.alloc(44+samples*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
const tracks=[{id:315,title:'Entertainment',artist:'melophonic',album:'Desktop test'}];
const media={tracks,loaded:new Set([315]),catalogue:async()=>tracks,audio:async()=>({body:wav,mime:'audio/wav'})};
const result=await launchDesktop(wizard,media);globalThis.testState={...result,paid:()=>paid};
app.on('window-all-closed',()=>app.quit());})();
`);
let app;
try{
 app=await electron.launch({executablePath:resolve('desktop/music/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'),args:[entry],env:Object.fromEntries(Object.entries(process.env).filter(([k])=>k!=='ELECTRON_RUN_AS_NODE'))});
 console.log('Electron launched');app.process().stderr.on('data',b=>process.stderr.write(b));app.process().stdout.on('data',b=>process.stdout.write(b));
 const page=await app.firstWindow({timeout:15000});page.setDefaultTimeout(15000);console.log('Window opened');page.on('dialog',dialog=>dialog.accept());await page.getByText('SIMULATED WALLET',{exact:true}).waitFor();console.log('Wallet rendered');
 assert.equal(await page.evaluate(()=>typeof window.require),'undefined');assert.equal(await page.evaluate(()=>document.cookie),'');
 const origin=await app.evaluate(()=>globalThis.testState.origin);assert.equal((await fetch(origin+'/lounge')).status,400);
 assert.equal((await page.evaluate(()=>fetch('/web-bridge',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(r=>r.status))),400);
 await page.locator('#radio-approve').check();await page.locator('#radio-enable').click();await page.getByText(/SUPPORT ON ·/).waitFor();console.log('Support enabled');
 await page.locator('#radio-play').click();await page.waitForFunction(()=>{const a=document.getElementById('radio-audio');return !a.paused&&a.readyState>=3;});for(let i=0;i<30&&(await app.evaluate(()=>globalThis.testState.paid()))===0;i++)await page.waitForTimeout(100);console.log(await page.locator('#radio-payment').textContent());assert.equal(await app.evaluate(()=>globalThis.testState.paid()),1);
 await page.locator('#radio-play').click();await page.locator('#radio-play').click();await page.waitForTimeout(100);assert.equal(await app.evaluate(()=>globalThis.testState.paid()),1);
 await page.locator('#radio-free').click();await page.locator('#radio-next').click();await page.waitForTimeout(200);assert.equal(await app.evaluate(()=>globalThis.testState.paid()),1);
 const prefs=await app.evaluate(()=>globalThis.testState.window.webContents.getLastWebPreferences());assert.equal(prefs.nodeIntegration,false);assert.equal(prefs.sandbox,true);assert.equal(prefs.contextIsolation,true);
 await mkdir('.artifacts/music-desktop-test',{recursive:true});await page.screenshot({path:'.artifacts/music-desktop-test/lounge.png',fullPage:true});
 console.log('PASS: Electron sandbox, cookie isolation, no extension route, simulated paid start, no pause/resume duplicate, free playback. No real wallet or payments.');
}finally{await app?.close();await rm(entry,{force:true});await rm(profile,{recursive:true,force:true});}
