import {describe,it,expect} from 'vitest';
import {mkdtemp,readFile,writeFile,rm,readdir,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {RadioWizard} from '../radio-plays-backend.mjs';
import {WINDOWS_VAULT_SCHEME} from '../../../desktop/music/windows-vault-protection.mjs';

const offline=async()=>{throw Error('network disabled in wallet tests');};
function protector({rotate=false}={}){
 const prefix='dpapi-test:';
 return {
  scheme:WINDOWS_VAULT_SCHEME,
  async protect(secret:string){return Buffer.from(prefix+secret).toString('base64');},
  async unprotect(value:string){
   const decoded=Buffer.from(value,'base64').toString('utf8');
   if(!decoded.startsWith(prefix))throw Error('DPAPI data could not be read');
   const secret=decoded.slice(prefix.length);
   return {secret,reprotected:rotate?Buffer.from(prefix+secret).toString('base64'):null};
  },
 };
}
async function fixture(work:(input:{dir:string;w:RadioWizard})=>Promise<void>){
 const dir=await mkdtemp(join(tmpdir(),'Xtrata Music Windows Δ '));
 try{await work({dir,w:new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector()})});}finally{await rm(dir,{recursive:true,force:true});}
}

describe('Windows protected local wallet (mocked DPAPI adapter, real filesystem)',()=>{
 it('stores only a protected key, persists identity and never creates a file wrapping key',()=>fixture(async({dir,w})=>{
  const first=await w.setup(),key=await w.key(),vault=await readFile(join(dir,'vault.json'),'utf8');
  expect(vault).toContain(WINDOWS_VAULT_SCHEME);expect(vault).not.toContain(key);
  await expect(readFile(join(dir,'unlock.key'))).rejects.toMatchObject({code:'ENOENT'});
  const reopened=new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector()});
  expect(await reopened.setup()).toEqual(first);expect(await reopened.key()).toBe(key);
  expect(JSON.stringify(await reopened.status())).not.toContain(key);
  expect((await readdir(dir)).filter(name=>name.includes('.tmp'))).toEqual([]);
 }));
 it('fails closed when DPAPI is unavailable, data is corrupt, or a legacy wallet is encountered',()=>fixture(async({dir,w})=>{
 const unavailable=new RadioWizard(dir,offline,{platform:'win32'});
 await expect(unavailable.setup()).rejects.toThrow('protected storage');
  await w.setup();await writeFile(join(dir,'vault.json'),'{');
  await expect(new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector()}).setup()).rejects.toThrow();
 }));
 it('refuses a syntactically valid vault that DPAPI cannot unlock before support can be enabled',()=>fixture(async({dir,w})=>{
  await w.setup();const vault=JSON.parse(await readFile(join(dir,'vault.json'),'utf8'));
  await writeFile(join(dir,'vault.json'),JSON.stringify({...vault,protectedKey:Buffer.from('unreadable-for-this-user').toString('base64')}));
  await expect(new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector()}).setup()).rejects.toThrow('DPAPI data could not be read');
 }));
 it('does not migrate or replace a legacy wallet on Windows',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'radio-legacy-wallet-'));
  try{
   const before=JSON.stringify({version:1,address:'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',encrypted:'legacy-fixture'});await writeFile(join(dir,'vault.json'),before);
   const windows=new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector()});
   await expect(windows.setup()).rejects.toThrow('legacy wallet');
   expect(await readFile(join(dir,'vault.json'),'utf8')).toBe(before);
  }finally{await rm(dir,{recursive:true,force:true});}
 });
 it('keeps the last complete journal after an interrupted temporary write and stops on a durable-write failure',()=>fixture(async({dir,w})=>{
  await w.setup();await w.save('journal.json',[{status:'confirmed',song:315}]);
  await writeFile(join(dir,'.journal.json.interrupted.tmp'),'{"status":"prepared"');
  const reopened=new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector()});
  expect(await reopened.journal()).toEqual([{status:'confirmed',song:315}]);
  await mkdir(join(dir,'returns.json'));
  await expect(w.save('returns.json',[])).rejects.toThrow();
  expect(w.stopped).toBe(true);expect(w.storageFault).toContain('Wallet storage needs attention');
 }));
 it('recovers only a verified dead stale lock and refuses live or malformed locks',()=>fixture(async({dir,w})=>{
  await w.setup();const stale={version:1,pid:912345,createdAt:Date.now()-300000};
  await writeFile(join(dir,'run.lock'),JSON.stringify(stale));
  const recovering=new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector(),isProcessAlive:()=>false,canRecoverStaleLock:true});
  await recovering.exclusive(async()=>{});
  expect((await readdir(dir)).some(name=>name.startsWith('run.lock.stale-912345-'))).toBe(true);
  await writeFile(join(dir,'run.lock'),JSON.stringify({...stale,pid:123}));
  const live=new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector(),isProcessAlive:()=>true});
  await expect(live.exclusive(async()=>{})).rejects.toThrow('Another operation');
  await rm(join(dir,'run.lock'));
  await writeFile(join(dir,'run.lock'),'broken');
  await expect(live.exclusive(async()=>{})).rejects.toThrow('unreadable');
 }));
 it('does not recover a stale lock without the desktop single-instance guard',()=>fixture(async({dir,w})=>{
  await w.setup();await writeFile(join(dir,'run.lock'),JSON.stringify({version:1,pid:912345,createdAt:Date.now()-300000}));
  const standalone=new RadioWizard(dir,offline,{platform:'win32',vaultProtector:protector(),isProcessAlive:()=>false});
  await expect(standalone.exclusive(async()=>{})).rejects.toThrow('stale wallet lock');
 }));
});
