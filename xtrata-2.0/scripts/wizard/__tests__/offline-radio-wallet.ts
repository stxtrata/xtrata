// Test-only adapter: real wallet/filesystem code, no default network transport.
// Native DPAPI is tested separately by the Electron Windows storage smoke.
import {RadioWizard as Backend} from '../radio-plays-backend.mjs';
import {WINDOWS_VAULT_SCHEME} from '../../../desktop/music/windows-vault-protection.mjs';
const offline=async()=>{throw Error('Unmocked network forbidden');};
const protector={
 scheme:WINDOWS_VAULT_SCHEME,
 async protect(secret:string){return Buffer.from('test-only:'+secret).toString('base64');},
 async unprotect(value:string){
  const decoded=Buffer.from(value,'base64').toString();
  if(!decoded.startsWith('test-only:'))throw Error('Invalid test vault');
  return {secret:decoded.slice(10),reprotected:null};
 },
};
export class RadioWizard extends Backend {
 constructor(dir:string,transport=offline){
  super(dir,transport,{readIntervalMs:0,vaultProtector:process.platform==='win32'?protector:null});
 }
}
