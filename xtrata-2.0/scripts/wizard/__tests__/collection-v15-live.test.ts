import { it, expect } from 'vitest';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
it('runs encrypted setup and the entire funded workflow against an offline API', () => {
 const directory=mkdtempSync(join(tmpdir(),'collection-wizard-test-'));
 const env={...process.env,COLLECTION_WIZARD_STATE_DIR:directory,COLLECTION_WIZARD_PASSPHRASE:'only an ephemeral test passphrase',WIZARD_KILL_SWITCH:'0'};
 const run=(args:string[],mock=false)=>spawnSync(process.execPath,[...(mock?['--import',resolve('scripts/wizard/__tests__/fixtures/collection-v15-api.mjs')]:[]),'scripts/wizard/collection-v15-live.mjs',...args],{env,encoding:'utf8',timeout:20000});
 try {
  expect(run(['setup']).status).toBe(0);
  expect(run(['setup']).status).not.toBe(0);
  expect(run(['run','--broadcast']).status).not.toBe(0);
  expect(run(['authorize','10000000']).status).toBe(0);
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
