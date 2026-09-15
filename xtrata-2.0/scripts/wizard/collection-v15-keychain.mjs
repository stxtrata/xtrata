#!/usr/bin/env node
// Unlock only this dedicated wizard. Never prints credentials or imports other wallets.
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const service='xtrata.collection-v15.setup-wizard', account='collection-v15';
const command=process.argv[2] || 'status';
if(!['setup','status'].includes(command))throw new Error('Use setup or status. Live setup transactions use a separately reviewed setup-only runner.');
const security=(args)=>spawnSync('/usr/bin/security',args,{encoding:'utf8'});
let secret;
if(command==='setup'){
  const existing=security(['find-generic-password','-s',service,'-a',account,'-w']);
  if(existing.status===0)secret=existing.stdout.trim();
  else {
    if(existsSync(join(root,'.collection-v15/config.json')))throw new Error('Existing wallet has no accessible Keychain passphrase; refusing replacement.');
    secret=randomBytes(32).toString('base64url');
    const saved=security(['add-generic-password','-s',service,'-a',account,'-w',secret]);
    if(saved.status!==0)throw new Error('Keychain storage failed; no wallet generated.');
    const verify=security(['find-generic-password','-s',service,'-a',account,'-w']);
    if(verify.status!==0 || verify.stdout.trim()!==secret)throw new Error('Keychain recovery check failed; no wallet generated.');
  }
}
const result=spawnSync(process.execPath,[join(root,'collection-v15-live.mjs'),command],{env:{...process.env,...(secret?{COLLECTION_WIZARD_PASSPHRASE:secret}:{})},encoding:'utf8'});
if(result.status!==0)throw new Error('Dedicated wizard command failed; wallet state preserved. Check kill switch or existing configuration.');
process.stdout.write(result.stdout);
