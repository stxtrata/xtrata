// Executed only by the native Windows smoke runner through Electron. It uses
// the prepared application backend, Electron safeStorage/DPAPI and a temporary
// Unicode path. Network transport is deliberately unavailable.
import {app,safeStorage} from 'electron';
import {mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {RadioWizard} from './app/scripts/wizard/radio-plays-backend.mjs';
import {createWindowsVaultProtector} from './windows-vault-protection.mjs';
import {Cl,cvToHex} from '@stacks/transactions';

const fail=message=>{process.stderr.write(message+'\n');app.exit(1);};
try{
 await app.whenReady();
 if(process.platform!=='win32')throw Error('Windows-only storage smoke was started on a non-Windows platform.');
 const dir=await mkdtemp(join(tmpdir(),'Xtrata Music Windows DPAPI Δ '));
 try{
  const protector=createWindowsVaultProtector(safeStorage);
  const wizard=new RadioWizard(dir,async()=>{throw Error('Network transport must not be used by this smoke test.');},{platform:'win32',vaultProtector:protector,canRecoverStaleLock:true});
  const wallet=await wizard.setup(),key=await wizard.key(),vault=await readFile(join(dir,'vault.json'),'utf8');
  if(!wallet.address.startsWith('SP')||vault.includes(key)||existsSync(join(dir,'unlock.key')))throw Error('DPAPI wallet persistence check failed.');
  const reopened=new RadioWizard(dir,async()=>{throw Error('Network transport must not be used by this smoke test.');},{platform:'win32',vaultProtector:protector,canRecoverStaleLock:true});
  if((await reopened.setup()).address!==wallet.address||(await reopened.key())!==key)throw Error('DPAPI wallet did not persist across a backend restart.');
  // Exercise the real DPAPI key and journal path with a fully mocked chain.
  // Stop after the durable prepared write, before a broadcast is possible.
  const source=await readFile(new URL('../../contracts/live/xtrata-radio-plays-v1.0.clar',import.meta.url),'utf8');
  let broadcasts=0;
  reopened.api=async path=>{
   if(path.includes('/source/'))return {source};
   if(path==='/v2/info')return {network_id:1};
   if(path.includes('/accounts/'))return {nonce:0,balance:'1000000'};
   if(path.endsWith('/nonces'))return {possible_next_nonce:0};
   if(path.endsWith('/get-owner'))return {okay:true,result:cvToHex(Cl.ok(Cl.some(Cl.standardPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'))))};
   if(path==='/v2/transactions'){broadcasts++;throw Error('A stopped smoke test must not submit.');}
   throw Error('Unexpected mocked chain path '+path);
  };
  const save=reopened.save.bind(reopened);
  reopened.save=async(name,value)=>{await save(name,value);if(name==='journal.json')reopened.stop();};
  let preparedStopped=false;try{await reopened.run({core:3,song:2910,fee:300,count:1});}catch(error){preparedStopped=/stopped/i.test(String(error?.message));}
  const journal=await reopened.journal();
  if(!preparedStopped||broadcasts!==0||journal.length!==1||journal[0].status!=='prepared')throw Error('DPAPI journal pre-broadcast safety check failed.');
  // An interrupted temporary write is ignored; the last complete journal stays
  // authoritative. A dead-process lock is recovered only by the single-app
  // Windows path, never by the standalone source companion.
  await writeFile(join(dir,'.journal.json.interrupted.tmp'),'incomplete');
  const recovered=new RadioWizard(dir,async()=>{throw Error('Network transport must not be used by this smoke test.');},{platform:'win32',vaultProtector:protector,canRecoverStaleLock:true,isProcessAlive:()=>false});
  if((await recovered.setup()).address!==wallet.address||(await recovered.journal())[0]?.status!=='prepared')throw Error('Interrupted journal recovery check failed.');
  await writeFile(join(dir,'run.lock'),JSON.stringify({version:1,pid:999999,createdAt:Date.now()-300000}));
  await recovered.exclusive(async()=>{});
  if(existsSync(join(dir,'run.lock')))throw Error('Dead-process lock was not recovered.');
  await writeFile(join(dir,'vault.json'),JSON.stringify({...JSON.parse(vault),protectedKey:Buffer.from('wrong-user-dpapi-record').toString('base64')}));
  let corruptRefused=false;try{await new RadioWizard(dir,async()=>{throw Error('Network transport must not be used by this smoke test.');},{platform:'win32',vaultProtector:protector,canRecoverStaleLock:true}).setup();}catch{corruptRefused=true;}
  if(!corruptRefused)throw Error('A protected wallet that DPAPI could not unlock was accepted.');
  process.stdout.write(JSON.stringify({pass:true,provider:'Electron safeStorage / Windows DPAPI',addressPrefix:wallet.address.slice(0,4),unlockKeyFile:false,preparedWrite:true,interruptedWritePreserved:true,staleLockRecovered:true,corruptRefused:true})+'\n');
 }finally{await rm(dir,{recursive:true,force:true});}
 app.exit(0);
}catch(error){fail(String(error?.stack||error));}
