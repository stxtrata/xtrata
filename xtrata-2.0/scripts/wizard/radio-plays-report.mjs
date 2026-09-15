#!/usr/bin/env node
/** Read-only audit of the dedicated wizard. No private key access. */
import {RadioWizard} from './radio-plays-backend.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const dir=join(root,'.artifacts/radio-wizard-reports');
const wizard=new RadioWizard(join(root,'.artifacts/radio-wizard'));
const report=JSON.parse(await readFile(join(dir,'latest.json'),'utf8'));
const state=await wizard.status(true);report.audit={at:new Date().toISOString(),balanceMicroSTX:state.balanceMicroSTX,transactions:[]};
for(const e of state.entries){
 let tx;try{tx=await wizard.api('/extended/v1/tx/'+e.txid);}catch(error){report.audit.transactions.push({txid:e.txid,error:error.message});continue;}
 const transfers=(tx.events||[]).filter(x=>x.event_type==='stx_asset'&&x.asset?.asset_event_type==='transfer').map(x=>x.asset);
 const transfer=transfers.find(x=>x.sender===state.address&&x.recipient===e.recipient&&x.amount==='50');
 const confirmed=tx.tx_status==='success'&&tx.canonical===true&&tx.is_unanchored===false;
 report.audit.transactions.push({txid:e.txid,receipt:e.receipt,requestedFee:e.fee,actualFee:tx.fee_rate,status:tx.tx_status,canonical:tx.canonical,block:tx.block_height,confirmed,exactHolderTransfer:!!transfer,transfers});
}
await writeFile(join(dir,'audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.audit,null,2));
