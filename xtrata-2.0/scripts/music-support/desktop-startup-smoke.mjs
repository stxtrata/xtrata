// Exercise the real entrypoint twice with an empty disposable wallet and stubbed network.
import {_electron as electron} from 'playwright';
import {writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
const dir=await mkdtemp(join(tmpdir(),'music-startup-')),entry=resolve('desktop/music/app/startup-test.mjs');
await writeFile(entry,`import {app} from 'electron';app.setPath('userData',${JSON.stringify(dir)});globalThis.fetch=async url=>new Response(JSON.stringify(String(url).includes('/accounts/')?{balance:'0',nonce:0}:{tracks:[]}),{headers:{'Content-Type':'application/json'}});void import('../main.mjs');`);
let first;
try{for(let n=0;n<2;n++){let app;try{app=await electron.launch({executablePath:resolve('desktop/music/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'),args:[entry],env:Object.fromEntries(Object.entries(process.env).filter(([key])=>key!=='ELECTRON_RUN_AS_NODE'))});const page=await app.firstWindow({timeout:15000});page.setDefaultTimeout(15000);await page.waitForFunction(()=>document.getElementById('address')?.textContent.startsWith('SP'));const address=await page.locator('#address').textContent();assert.match(address,/^SP[A-Z0-9]+$/);if(n===0)first=address;else assert.equal(address,first);assert.match(await page.locator('#radio-mode').textContent(),/FREE/);assert.equal(await page.evaluate(()=>typeof require),'undefined');}finally{await app?.close();}}console.log('PASS: actual entrypoint auto-creates and reuses a disposable wallet; both launches stay free. No live network or payments.');}finally{await rm(entry,{force:true});await rm(dir,{recursive:true,force:true});}
