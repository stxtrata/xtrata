#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const tests=['pro-timeline-test','pro-recovery-test','pro-dsp-test','pro-prefetch-test','pro-faces-test','pro-performance-test','pro-fidelity-test','pro-transport-test','pro-export-test','pro-workspace-test','pro-ui-review-test','pro-gate-test','backward-compatibility-test','storage-isolation-test','async-project-test','updates-integration-test','persistence-history-test','performance-regression','voice-lifecycle-test','pro-soak-test'];
const failures=[];
for(const test of tests){const started=Date.now(),result=spawnSync(process.execPath,[fileURLToPath(new URL(`./${test}.mjs`,import.meta.url))],{encoding:'utf8',env:process.env,timeout:test==='pro-soak-test'?(Math.min(7200,Math.max(30,Number(process.env.SOAK_SECONDS)||120))+60)*1000:600000,maxBuffer:20*1024*1024});console.log(`${result.status===0?'PASS':'FAIL'} ${test} (${((Date.now()-started)/1000).toFixed(1)}s)`);if(result.status!==0){failures.push(test);console.error((result.stdout+'\n'+result.stderr).slice(-12000));}}
if(failures.length){console.error('Failed:',failures.join(', '));process.exitCode=1;}else console.log(`All ${tests.length} beta-pro test groups passed.`);
