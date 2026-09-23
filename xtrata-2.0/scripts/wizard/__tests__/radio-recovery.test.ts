import {describe,it,expect,vi} from 'vitest';
import {mkdir,mkdtemp,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {RadioWizard} from './offline-radio-wallet';
import {Cl,cvToHex,deserializeTransaction} from '@stacks/transactions';
const owner='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
async function fixture(work){
 const dir=await mkdtemp(join(tmpdir(),'radio-recovery-'));
 try{
  const w=new RadioWizard(dir),{address}=await w.setup();const source=await readFile(new URL('../../../contracts/live/xtrata-radio-plays-v1.0.clar',import.meta.url),'utf8');
  const state={sent:[],nonce:0,winner:null,failure:null,receipt:null};
  w.api=async(path,opts)=>{
   if(path==='/v2/info')return {network_id:1};if(path.includes('/source/'))return {source};
   if(path.includes('/accounts/'))return {balance:'1000000',nonce:state.nonce};if(path.endsWith('/nonces'))return {possible_next_nonce:state.nonce};
   if(path.endsWith('/get-owner'))return {okay:true,result:cvToHex(Cl.ok(Cl.some(Cl.standardPrincipal(owner))))};
   if(path.endsWith('/get-receipt'))return {okay:true,result:cvToHex(state.receipt||Cl.none())};
   if(path==='/v2/transactions'){const tx=deserializeTransaction(opts.body);state.sent.push(tx);if(state.sent.length===1)throw Error('Simulated original fee rejection');return tx.txid();}
   if(path.startsWith('/extended/v1/tx/')){if(state.winner&&path.endsWith(state.winner.id))return {tx_id:state.winner.id,nonce:0,fee_rate:String(state.winner.fee),tx_status:'success',canonical:true,is_unanchored:false,sender_address:address,contract_call:{contract_id:owner+'.xtrata-radio-plays-v1-0',function_name:'play'}};if(state.failure&&path.endsWith(state.failure.id))return {tx_id:state.failure.id,nonce:0,fee_rate:String(state.failure.fee),tx_status:'abort_by_response',canonical:true,is_unanchored:false,sender_address:address,contract_call:{contract_id:owner+'.xtrata-radio-plays-v1-0',function_name:'play'}};throw Object.assign(Error('absent'),{status:404});}
   throw Error('Unexpected path');
  };
  await expect(w.run({core:3,song:2910,fee:200,count:1})).rejects.toThrow('rejection');
  const original=(await w.journal())[0];await work({w,state,original,dir});
 }finally{await rm(dir,{recursive:true,force:true});}
}
describe('explicit same-nonce play recovery',()=>{
 it('keeps the same receipt/nonce, preserves evidence and reconciles either winning attempt',()=>fixture(async({w,state,original,dir})=>{
  const retry=await w.retryPreparedPlay(original.txid,257);expect(retry.fee).toBe(257);expect(retry.raw).toBeUndefined();expect(state.sent).toHaveLength(2);
  expect(state.sent[1].auth.spendingCondition.nonce).toBe(state.sent[0].auth.spendingCondition.nonce);
  expect(state.sent[1].payload.functionArgs.map(cvToHex)).toEqual(state.sent[0].payload.functionArgs.map(cvToHex));
  expect(JSON.parse(await readFile(join(dir,'recovery-original-'+original.txid.slice(2)+'.json'),'utf8')).raw).toBe(original.raw);
  await expect(w.retryPreparedPlay(original.txid,257)).rejects.toThrow('prepared');expect(state.sent).toHaveLength(2);
  state.receipt=Cl.some(Cl.tuple({core:Cl.uint(3),id:Cl.uint(2910),recipient:Cl.standardPrincipal(owner)}));
  for(const winner of [{id:retry.txid,fee:257},{id:original.txid,fee:200}]){const log=await w.journal();log[0].status='submitted';state.winner=winner;await w.reconcile(log);expect(log[0].status).toBe('confirmed');expect(log[0].confirmedTxid).toBe(winner.id);expect(log[0].actualFee).toBe(winner.fee);}
 }));
 it('refuses a used nonce, visible transaction, non-increasing fee and an existing receipt',()=>fixture(async({w,state,original})=>{
  await expect(w.retryPreparedPlay(original.txid,200)).rejects.toThrow('higher');state.nonce=1;
  await expect(w.retryPreparedPlay(original.txid,257)).rejects.toThrow('nonce');state.nonce=0;state.winner={id:original.txid,fee:200};
  await expect(w.retryPreparedPlay(original.txid,257)).rejects.toThrow('visible');state.winner=null;
  state.receipt=Cl.some(Cl.tuple({core:Cl.uint(3)}));await expect(w.retryPreparedPlay(original.txid,257)).rejects.toThrow('receipt');expect(state.sent).toHaveLength(1);
 }));
 it('records a canonical aborted call as failed and never re-broadcasts it',()=>fixture(async({w,state,original})=>{
  state.failure={id:original.txid,fee:200};const log=await w.journal();log[0].status='submitted';
  await w.reconcile(log);
  expect(log[0]).toMatchObject({status:'failed',failureStatus:'abort_by_response',failedTxid:original.txid,actualFee:200});
  await expect(w.retryPreparedPlay(original.txid,257)).rejects.toThrow('prepared');
  expect(state.sent).toHaveLength(1);
 }));
 it('fails closed after a real filesystem storage fault before recovery can sign or broadcast',()=>fixture(async({w,state,original,dir})=>{
  const key=vi.spyOn(w,'key');
  await mkdir(join(dir,'returns.json'));
  await expect(w.save('returns.json',[])).rejects.toThrow();
  await expect(w.retryPreparedPlay(original.txid,257)).rejects.toThrow('Wallet storage needs attention');
  expect(key).not.toHaveBeenCalled();expect(state.sent).toHaveLength(1);
 }));
});

describe('receipt indexing delay',()=>{
 it('distinguishes an absent receipt from a mismatched receipt',()=>fixture(async({w,state,original})=>{
  state.winner={id:original.txid,fee:200};
  await expect(w.reconcile(await w.journal())).rejects.toMatchObject({code:'RECEIPT_PENDING'});
  state.receipt=Cl.some(Cl.tuple({core:Cl.uint(3),id:Cl.uint(999),recipient:Cl.standardPrincipal(owner)}));
  await expect(w.reconcile(await w.journal())).rejects.toThrow('Receipt verification failed');
 }));
});

describe('automatic exact-byte recovery under current consent',()=>{
 it('never resends during passive reconciliation; resends identical bytes and persists its limit across restart',()=>fixture(async({w,state,original,dir})=>{
  await expect(w.reconcile(await w.journal())).rejects.toMatchObject({code:'PAYMENT_UNRESOLVED'});expect(state.sent).toHaveLength(1);
  const consent=vi.fn();let now=Date.now();w.now=()=>now;
  for(let n=0;n<3;n++){await expect(w.reconcile(await w.journal(),consent)).rejects.toMatchObject({code:'PAYMENT_UNRESOLVED'});now+=61000;}
  expect(state.sent).toHaveLength(4);for(const tx of state.sent)expect(Buffer.from(tx.serialize()).toString('hex')).toBe(original.raw);
  const restarted=new RadioWizard(dir);restarted.api=w.api;restarted.now=()=>now;
  await expect(restarted.reconcile(await restarted.journal(),consent)).rejects.toThrow('retry limit');expect(state.sent).toHaveLength(4);
  expect((await w.journal())[0].resendAttempts).toBe(3);
 }));
 it('does not resend when nonce is used, receipt exists, or stop happens after saving',()=>fixture(async({w,state,original})=>{
  state.nonce=1;await expect(w.reconcile(await w.journal(),()=>{})).rejects.toThrow('nonce');state.nonce=0;
  state.receipt=Cl.some(Cl.tuple({core:Cl.uint(3)}));await expect(w.reconcile(await w.journal(),()=>{})).rejects.toThrow('receipt');state.receipt=null;
  const epoch=w.stopEpoch,save=w.save.bind(w);w.save=async(...args)=>{await save(...args);w.stop();};
  await expect(w.reconcile(await w.journal(),()=>{if(w.stopEpoch!==epoch)throw Error('Consent stopped');})).rejects.toThrow('Consent stopped');expect(state.sent).toHaveLength(1);
 }));
 it('backs off an ambiguous submission and never creates a replacement',()=>fixture(async({w,state,original})=>{
  const api=w.api;w.api=async(path,opts)=>{if(path==='/v2/transactions')throw Error('transport interrupted');return api(path,opts);};
  await expect(w.reconcile(await w.journal(),()=>{})).rejects.toThrow('transport interrupted');
  const post=vi.spyOn(w,'api');await expect(w.reconcile(await w.journal(),()=>{})).rejects.toMatchObject({code:'PAYMENT_UNRESOLVED'});
  expect(post.mock.calls.some(([p])=>p==='/v2/transactions')).toBe(false);expect((await w.journal())[0].txid).toBe(original.txid);
 }));
 it('does not resend if the transaction becomes visible during diagnosis',()=>fixture(async({w,state,original})=>{
  const api=w.api;let lookups=0;w.api=async(path,opts)=>{if(path.startsWith('/extended/v1/tx/')&&++lookups===2)return {tx_status:'pending'};return api(path,opts);};
  await expect(w.reconcile(await w.journal(),()=>{})).rejects.toMatchObject({code:'PAYMENT_UNRESOLVED'});expect(state.sent).toHaveLength(1);
 }));
});
