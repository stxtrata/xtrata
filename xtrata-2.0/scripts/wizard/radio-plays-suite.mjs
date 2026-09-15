#!/usr/bin/env node
/** Explicitly invoked bounded mainnet suite. Never prints secret state or signed bytes. */
import {RadioWizard} from './radio-plays-backend.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {uintCV} from '@stacks/transactions';
if(process.argv[2]!=='--broadcast')throw Error('Live suite requires --broadcast; maximum planned spend 1607 microSTX.');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const folder=join(root,'.artifacts/radio-wizard-reports');await mkdir(folder,{recursive:true});
const wizard=new RadioWizard(join(root,'.artifacts/radio-wizard'));
const report={started:new Date().toISOString(),plannedMaximumMicroSTX:1607,tests:[],before:await wizard.status(true)};
const path=join(folder,'latest.json');
const save=async()=>{await writeFile(path,JSON.stringify(report,null,2)+'\n');};
try{
 report.totalBefore=await wizard.read('get-total',[uintCV(3),uintCV(2910)]);await save();
 for(const [name,fee,count] of [['single-start',300,1],['automated-sequence',300,2],['byte-baseline-fee',257,1],['below-baseline-fee',200,1]]){
  const test={name,fee,count,started:new Date().toISOString(),status:'running'};report.tests.push(test);await save();console.log('Starting '+name);
  try{await wizard.run({core:3,song:2910,fee,count});test.status='confirmed';}catch(error){test.status='stopped';test.error=error.message;throw error;}finally{test.finished=new Date().toISOString();report.after=await wizard.status(true);await save();}
 }
}catch(error){report.stoppedReason=error.message;console.log('Suite stopped: '+error.message);}
finally{report.finished=new Date().toISOString();report.after=await wizard.status(true);report.totalAfter=await wizard.read('get-total',[uintCV(3),uintCV(2910)]);await save();console.log('Public report: '+path);console.log(JSON.stringify({tests:report.tests,balanceMicroSTX:report.after.balanceMicroSTX}));}
