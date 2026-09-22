import {describe,it,expect,vi} from 'vitest';
import {mkdir,mkdtemp,readFile,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {deserializeTransaction} from '@stacks/transactions';
import {RadioWizard} from './offline-radio-wallet';
const recipient='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
async function fixture(work){
 const dir=await mkdtemp(join(tmpdir(),'radio-return-test-'));
 try{
  const w=new RadioWizard(dir,async()=>{throw Error('Unmocked network forbidden');});await w.setup();
  const chain={balance:1500000n,nonce:0,broadcasts:[],tx:null,fail:false};
  const api=async(path,options)=>{
   if(path==='/v2/info')return {network_id:1};
   if(path.includes('/accounts/'))return {nonce:chain.nonce,balance:chain.balance.toString()};
   if(path.endsWith('/nonces'))return {possible_next_nonce:chain.nonce};
   if(path.includes('/source/'))return {source:await readFile(new URL('../../../contracts/live/xtrata-radio-plays-v1.0.clar',import.meta.url),'utf8')};
   if(path==='/v2/transactions'){
    const tx=deserializeTransaction(options.body);chain.broadcasts.push(tx);
    const saved=await w.json('returns.json');expect(saved.at(-1).status).toBe('prepared');
    expect(saved.at(-1).txid).toBe('0x'+tx.txid());
    if(chain.fail)throw Error('Simulated network timeout');return tx.txid();
   }
   if(path.startsWith('/extended/v1/tx/')){if(chain.tx)return chain.tx;throw Object.assign(Error('Not found'),{status:404});}
   throw Error('Unexpected mock path '+path);
  };
  w.api=api;
  await work({w,chain,dir,api,confirm:async()=>{
   const e=(await w.json('returns.json')).at(-1);
   chain.tx={tx_id:e.txid,tx_type:'token_transfer',tx_status:'success',canonical:true,is_unanchored:false,
    sender_address:e.address,nonce:e.nonce,fee_rate:String(e.fee),token_transfer:{recipient_address:e.recipient,amount:e.amount}};
   chain.balance-=BigInt(e.amount)+BigInt(e.fee);chain.nonce++;await w.reconcileReturns();
  }});
 }finally{await rm(dir,{recursive:true,force:true});}
}
const input={mode:'excess',recipient,fee:300};
describe('wizard return controls (disposable wallets, mocked chain)',()=>{
 it('reviews exact excess/all amounts without unlocking or broadcasting',()=>fixture(async({w,chain,dir})=>{
  const key=vi.spyOn(w,'key');const q=await w.prepareReturn(input);
  expect(q.amount).toBe('499700');expect(q.remaining).toBe('1000000');expect(key).not.toHaveBeenCalled();
  // Windows does not implement POSIX permission bits. Its secret protection
  // is covered by the Windows vault suite and native Electron DPAPI smoke.
  const quotePath=join(dir,'return-quote.json');
  expect(JSON.parse(await readFile(quotePath,'utf8'))).toEqual(q);
  if(process.platform!=='win32')expect((await stat(quotePath)).mode&0o777).toBe(0o600);
  expect((await w.prepareReturn({...input,mode:'all'})).amount).toBe('1499700');
  chain.balance=1000n;expect((await w.prepareReturn({...input,mode:'all'})).amount).toBe('700');
  expect(chain.broadcasts).toHaveLength(0);
 }));
 it('rejects invalid network addresses, self returns, excessive fees and amounts below fees',()=>fixture(async({w,chain})=>{
  const address=(await w.setup()).address;
  for(const bad of [{recipient:address},{recipient:'ST000000000000000000002AMW42H'},{recipient:'not-an-address'},{fee:0},{fee:1001},{fee:1.5},{mode:'sweep'},{amount:99}])await expect(w.prepareReturn({...input,...bad})).rejects.toThrow();
  for(const balance of [0n,299n,300n,1000000n,1000300n]){chain.balance=balance;await expect(w.prepareReturn(input)).rejects.toThrow('excess');}
  chain.balance=300n;await expect(w.prepareReturn({...input,mode:'all'})).rejects.toThrow('cover');
 }));
 it('signs only the reviewed mainnet transfer, persists before send and deduplicates across restart',()=>fixture(async({w,chain,dir,api,confirm})=>{
  const q=await w.prepareReturn(input),e=await w.confirmReturn(q.id),tx=chain.broadcasts[0];
  expect(tx.version).toBe(0);expect(tx.chainId).toBe(1);expect(tx.payload.amount).toBe(499700n);
  expect(tx.auth.spendingCondition.fee).toBe(300n);expect(tx.auth.spendingCondition.nonce).toBe(0n);
  expect(e.status).toBe('submitted');expect(e.raw).toBeUndefined();
  await w.confirmReturn(q.id);const reopened=new RadioWizard(dir);reopened.api=api;await reopened.confirmReturn(q.id);
  expect(chain.broadcasts).toHaveLength(1);await confirm();
  const status=await w.status(true);expect(status.balanceMicroSTX).toBe('1000000');expect(status.returns[0].status).toBe('confirmed');
  expect(JSON.stringify(status)).not.toContain('raw');expect(JSON.stringify(status)).not.toContain(await w.key());
 }));
 it('returns all including the reserve and keeps the test loop stopped',()=>fixture(async({w,chain,confirm})=>{
  const q=await w.prepareReturn({...input,mode:'all'});await w.confirmReturn(q.id);await confirm();
  expect(chain.balance).toBe(0n);expect(w.stopped).toBe(true);
  expect((await w.status(true)).balanceMicroSTX).toBe('0');
 }));
 it('blocks changed, expired, cancelled, stopped and pre-restart reviews',()=>fixture(async({w,chain,dir,api})=>{
  let q=await w.prepareReturn(input);chain.balance++;await expect(w.confirmReturn(q.id)).rejects.toThrow('changed');chain.balance--;
  q=await w.prepareReturn(input);chain.nonce++;await expect(w.confirmReturn(q.id)).rejects.toThrow('changed');chain.nonce--;
  q=await w.prepareReturn(input);await w.save('return-quote.json',{...q,expires:0});await expect(w.confirmReturn(q.id)).rejects.toThrow('expired');
  q=await w.prepareReturn(input);await w.cancelReturn(q.id);await expect(w.confirmReturn(q.id)).rejects.toThrow('expired');
  q=await w.prepareReturn(input);w.stop();await expect(w.confirmReturn(q.id)).rejects.toThrow('expired');
  q=await w.prepareReturn(input);const reopened=new RadioWizard(dir);reopened.api=api;await expect(reopened.confirmReturn(q.id)).rejects.toThrow('expired');
  expect(chain.broadcasts).toHaveLength(0);
 }));
 it('never rebroadcasts unknown returns and prevents play/return replacement',()=>fixture(async({w,chain,dir,api})=>{
  const q=await w.prepareReturn(input);chain.fail=true;await expect(w.confirmReturn(q.id)).rejects.toThrow('timeout');
  const reopened=new RadioWizard(dir);reopened.api=api;
  expect((await reopened.confirmReturn(q.id)).status).toBe('prepared');
  await expect(reopened.prepareReturn(input)).rejects.toThrow('not visible');
  await expect(reopened.run({core:3,song:2910,fee:300,count:1})).rejects.toThrow('not visible');
  expect(chain.broadcasts).toHaveLength(1);
 }));
 it('blocks pending plays and foreign nonces',()=>fixture(async({w,chain,api})=>{
  await w.save('journal.json',[{status:'submitted',txid:'0x'+'a'.repeat(64)}]);await expect(w.prepareReturn(input)).rejects.toThrow('not visible');
  await w.save('journal.json',[]);w.api=(path,opts)=>path.endsWith('/nonces')?Promise.resolve({possible_next_nonce:1}):api(path,opts);
  await expect(w.prepareReturn(input)).rejects.toThrow('pending');w.api=api;
  expect((await w.status(true)).overLimit).toBe(true);expect(chain.broadcasts).toHaveLength(0);
 }));
 it('uses one process lock for review, payments and returns',()=>fixture(async({w,chain,dir,api})=>{
  const q=await w.prepareReturn(input);let release;
  const blocked=new Promise(resolve=>{release=resolve;});
  w.api=async(path,opts)=>{if(path==='/v2/info')await blocked;return api(path,opts);};
  const sending=w.confirmReturn(q.id);
  await new Promise(resolve=>setTimeout(resolve,10));
  const other=new RadioWizard(dir);other.api=api;
  await expect(other.prepareReturn(input)).rejects.toThrow('lock');release();await sending;expect(chain.broadcasts).toHaveLength(1);
 }));
 it('validates confirmed return identity and does not hide abort fees',()=>fixture(async({w,chain,confirm})=>{
  const q=await w.prepareReturn(input);await w.confirmReturn(q.id);await confirm();
  const log=await w.json('returns.json');log[0].status='submitted';await w.save('returns.json',log);
  chain.tx.token_transfer.amount='1';await expect(w.reconcileReturns()).rejects.toThrow('identity');
  chain.tx.token_transfer.amount=q.amount;chain.tx.tx_status='abort_by_post_condition';await w.reconcileReturns();
  expect((await w.status()).returns[0].status).toBe('aborted');expect((await w.status()).returns[0].fee).toBe(300);
 }));
 it('stops during preflight before unlocking and does not broadcast after a journal failure',()=>fixture(async({w,chain,api})=>{
  let q=await w.prepareReturn(input);const key=vi.spyOn(w,'key');
  w.api=async(path,opts)=>{if(path==='/v2/info')w.stop();return api(path,opts);};
  await expect(w.confirmReturn(q.id)).rejects.toThrow('stopped');expect(key).not.toHaveBeenCalled();
  w.api=api;q=await w.prepareReturn(input);const save=w.save.bind(w);
  w.save=async(name,value)=>{if(name==='returns.json')throw Error('Simulated disk full');return save(name,value);};
  await expect(w.confirmReturn(q.id)).rejects.toThrow('disk full');expect(chain.broadcasts).toHaveLength(0);
 }));
 it('fails closed after a real filesystem storage fault before a return can sign or broadcast',()=>fixture(async({w,chain,dir})=>{
  const q=await w.prepareReturn(input),key=vi.spyOn(w,'key');
  await mkdir(join(dir,'returns.json'));
  await expect(w.save('returns.json',[])).rejects.toThrow();
  await expect(w.confirmReturn(q.id)).rejects.toThrow('Wallet storage needs attention');
  expect(key).not.toHaveBeenCalled();expect(chain.broadcasts).toHaveLength(0);
 }));
 it('respects the kill switch before signing',()=>fixture(async({w,chain})=>{
  const q=await w.prepareReturn(input);const previous=process.env.WIZARD_KILL_SWITCH;
  try{process.env.WIZARD_KILL_SWITCH='1';await expect(w.confirmReturn(q.id)).rejects.toThrow('kill switch');expect(chain.broadcasts).toHaveLength(0);}
  finally{if(previous===undefined)delete process.env.WIZARD_KILL_SWITCH;else process.env.WIZARD_KILL_SWITCH=previous;}
 }));
});
