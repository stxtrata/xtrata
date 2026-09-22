// Native Windows-only test. It never creates a network request or wallet with
// funds; Electron safeStorage is exercised through its actual Windows DPAPI.
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

if(process.platform!=='win32'){
 console.log('SKIPPED: Windows DPAPI storage smoke requires native Windows 11 x64.');
 process.exit(0);
}
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const electron=resolve(root,'desktop/music/node_modules/electron/dist/electron.exe');
const entry=resolve(root,'desktop/music/windows-storage-entry.mjs');
if(!existsSync(electron))throw Error('Electron runtime is missing. Run npm ci --prefix desktop/music first.');
const child=spawn(electron,[entry],{windowsHide:true,env:{...process.env,ELECTRON_RUN_AS_NODE:undefined}});
let stdout='',stderr='';child.stdout.on('data',data=>{stdout+=data;});child.stderr.on('data',data=>{stderr+=data;});
const exit=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{child.kill();reject(Error('Windows DPAPI storage smoke timed out.'));},30000);child.on('error',reject);child.on('exit',code=>{clearTimeout(timer);resolve(code);});});
if(exit!==0)throw Error('Windows DPAPI storage smoke failed: '+stderr.slice(0,1000));
const result=JSON.parse(stdout.trim());if(result?.pass!==true||result.unlockKeyFile!==false||result.preparedWrite!==true||result.interruptedWritePreserved!==true||result.staleLockRecovered!==true||result.corruptRefused!==true)throw Error('Windows DPAPI storage smoke returned an invalid result.');
console.log('PASS: Windows Electron safeStorage/DPAPI protected wallet persisted, uses DPAPI for a pre-broadcast journal write, preserves the completed journal across an interrupted temporary file, recovers a dead-process lock, rejects unreadable protected data, and has no unlock.key or network access.');
