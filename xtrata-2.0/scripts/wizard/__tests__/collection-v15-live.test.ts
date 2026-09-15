import { it, expect } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
it('runs encrypted setup and the entire funded workflow against an offline API', () => {
 const directory=mkdtempSync(join(tmpdir(),'collection-wizard-test-'));
 const env={...process.env,COLLECTION_WIZARD_STATE_DIR:directory,COLLECTION_WIZARD_PASSPHRASE:'only an ephemeral test passphrase',WIZARD_KILL_SWITCH:'0'};
 const run=(args:string[],mock=false,highFee=false)=>spawnSync(process.execPath,[...(mock?['--import',resolve('scripts/wizard/__tests__/fixtures/collection-v15-api.mjs')]:[]),'scripts/wizard/collection-v15-live.mjs',...args],{env:{...env,...(highFee?{TEST_HIGH_FEE:'1'}:{})},encoding:'utf8',timeout:20000});
 try {
  expect(run(['setup']).status).toBe(0);
  expect(run(['setup']).status).not.toBe(0);
  expect(run(['run','--broadcast']).status).not.toBe(0);
  expect(run(['authorize','10000000']).status).toBe(0);
  const prepared=run(['prepare','--broadcast'],true,true);
  expect(prepared.stderr).toBe('');expect(prepared.status).toBe(0);
  const preparation=JSON.parse(readFileSync(join(directory,'journal.json'),'utf8'));
  expect(preparation.configurationPrepared).toBe(true);
  expect(preparation.spent).toBe('1030000');
  expect(Object.keys(preparation.steps).some(k=>k.startsWith('mint-'))).toBe(false);
  const manifest=JSON.parse(readFileSync('../media/wizard-numbered-jpegs/manifest.json','utf8'));
  writeFileSync(join(directory,'staging.json'),JSON.stringify({complete:true,assets:Object.fromEntries(manifest.items.map(item=>[item.filename,{verified:true,rollingHash:item.rollingHash,tokenUri:'urn:test:'+item.number}]))}));
  const registration=run(['register','--broadcast'],true);
  expect(registration.stderr).toBe('');expect(registration.status).toBe(0);
  const registered=JSON.parse(readFileSync(join(directory,'journal.json'),'utf8'));
  expect(registered.inventoryRegistered).toBe(true);
  expect(Object.keys(registered.steps).some(k=>k.startsWith('mint-'))).toBe(false);
  const result=run(['run','--broadcast'],true);
  expect(result.stderr).toBe('');expect(result.status).toBe(0);
  const journal=JSON.parse(readFileSync(join(directory,'journal.json'),'utf8'));
  expect(journal.complete).toBe(true);
  expect(Object.keys(journal.steps).filter(k=>k.startsWith('mint-'))).toHaveLength(10);
  expect(BigInt(journal.spent)).toBeLessThan(10000000n);
  const resumed=run(['run','--broadcast'],true);
  expect(resumed.stderr).toBe('');expect(resumed.status).toBe(0);
  expect(JSON.parse(readFileSync(join(directory,'journal.json'),'utf8')).spent).toBe(journal.spent);
 } finally {rmSync(directory,{recursive:true,force:true});}
},30000);

it('replaces ten registered hashes while paused and prevents restoration of original inventory',()=>{
 const directory=mkdtempSync(join(tmpdir(),'collection-replace-test-'));
 const env={...process.env,COLLECTION_WIZARD_STATE_DIR:directory,COLLECTION_WIZARD_PASSPHRASE:'ephemeral replacement test phrase',WIZARD_KILL_SWITCH:'0'};
 const run=(args:string[],mock=false)=>spawnSync(process.execPath,[...(mock?['--import',resolve('scripts/wizard/__tests__/fixtures/collection-v15-api.mjs')]:[]),'scripts/wizard/collection-v15-live.mjs',...args],{env,encoding:'utf8',timeout:20000});
 try {
  expect(run(['setup']).status).toBe(0);expect(run(['authorize','10000000']).status).toBe(0);
  expect(run(['prepare','--broadcast'],true).status).toBe(0);
  const originals=JSON.parse(readFileSync('../media/wizard-numbered-jpegs/manifest.json','utf8'));
  writeFileSync(join(directory,'staging.json'),JSON.stringify({complete:true,assets:Object.fromEntries(originals.items.map(item=>[item.filename,{verified:true,rollingHash:item.rollingHash,tokenUri:'urn:test:original:'+item.number}]))}));
  expect(run(['register','--broadcast'],true).status).toBe(0);
  expect(spawnSync(process.execPath,['scripts/wizard/optimize-numbered-jpegs.mjs'],{encoding:'utf8'}).status).toBe(0);
  const optimized=JSON.parse(readFileSync('../media/wizard-numbered-jpegs-optimized/manifest.json','utf8'));
  writeFileSync(join(directory,'replacement.json'),JSON.stringify({staged:true,assets:Object.fromEntries(optimized.items.map(item=>[item.filename,{verified:true,rollingHash:item.rollingHash,tokenUri:'urn:test:optimized:'+item.number}]))}));
  const result=run(['replace','--broadcast'],true);expect(result.stderr).toBe('');expect(result.status).toBe(0);
  const journal=JSON.parse(readFileSync(join(directory,'journal.json'),'utf8'));
  expect(journal.replacementComplete).toBe(true);expect(Object.keys(journal.steps).filter(k=>k.startsWith('clear-original-'))).toHaveLength(10);
  expect(Object.keys(journal.steps).some(k=>k.startsWith('mint-'))).toBe(false);
  expect(run(['register','--broadcast'],true).status).not.toBe(0);
  expect(run(['replace','--broadcast'],true).status).toBe(0);
  expect(JSON.parse(readFileSync(join(directory,'journal.json'),'utf8')).spent).toBe(journal.spent);
 }finally{rmSync(directory,{recursive:true,force:true});}
},30000);
