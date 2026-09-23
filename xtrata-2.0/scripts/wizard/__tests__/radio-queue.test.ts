import {describe,it,expect} from 'vitest';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Cl,cvToHex,deserializeTransaction,deserializeCV} from '@stacks/transactions';
import {RadioWizard} from './offline-radio-wallet';
import {RadioWizard as LegacyWizard} from './fixtures/radio-backend-103.mjs';
import {RadioListening} from '../radio-listening.mjs';
const owner='SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const tab='a'.repeat(32);
async function fixture(work){
 const dir=await mkdtemp(join(tmpdir(),'radio-queue-'));
 try{
  const state={nonce:0,balance:'1000000',sent:[],status:new Map(),bad:false,foreign:[],missing:[],reads:0};
  const source=await readFile(new URL('../../../contracts/live/xtrata-radio-plays-v1.0.clar',import.meta.url),'utf8');
  let address;
  const transport=async(url,opts)=>{
   let value;state.reads++;
   if(url.endsWith('/v2/info'))value={network_id:1};
   else if(url.includes('/source/'))value={source};
   else if(url.includes('/accounts/'))value={nonce:state.nonce,balance:state.balance};
   else if(url.endsWith('/nonces')){const pending=[...new Set(state.sent.filter(t=>Number(t.auth.spendingCondition.nonce)>=state.nonce&&state.status.get('0x'+t.txid())!=='missing').map(t=>Number(t.auth.spendingCondition.nonce)))];value={possible_next_nonce:pending.length?Math.max(...pending)+1:state.nonce,detected_mempool_nonces:[...pending,...state.foreign],detected_missing_nonces:state.missing};}
   else if(url.endsWith('/get-owner'))value={okay:true,result:cvToHex(Cl.ok(Cl.some(Cl.standardPrincipal(owner))))};
   else if(url.endsWith('/get-receipt')){const hex=Buffer.from(deserializeCV(JSON.parse(opts.body).arguments[1]).buffer).toString('hex');const tx=state.sent.find(t=>Buffer.from(t.payload.functionArgs[2].buffer).toString('hex')===hex&&state.status.get('0x'+t.txid())==='success');value={okay:true,result:cvToHex(tx?Cl.some(Cl.tuple({core:Cl.uint(3),id:Cl.uint(2910),recipient:Cl.standardPrincipal(owner)})):Cl.none())};}
   else if(url.endsWith('/v2/transactions')){const t=deserializeTransaction(opts.body);state.sent.push(t);state.status.set('0x'+t.txid(),'pending');value=state.bad?'unexpected':t.txid();}
   else if(url.includes('/extended/v1/tx/')){const id=url.split('/').pop(),t=state.sent.find(t=>'0x'+t.txid()===id),status=state.status.get(id);if(!t||status==='missing')return {ok:false,status:404};value={tx_id:id,nonce:Number(t.auth.spendingCondition.nonce),fee_rate:String(t.auth.spendingCondition.fee),tx_status:status,canonical:true,is_unanchored:false,sender_address:address,block_height:100,contract_call:{contract_id:owner+'.xtrata-radio-plays-v1-0',function_name:'play'}};}
   else throw Error('Unexpected offline path '+url);
   return {ok:true,json:async()=>value};
  };
  const w=new RadioWizard(dir,transport);address=(await w.setup()).address;w.queuedPaidStarts=true;
  const media={tracks:[{id:2910,title:'Offline track'}],audio:async()=>({duration:61})};
  const s=new RadioListening(w,media);const a=await s.enable({fee:257,max:10,minutes:10,tab,continuous:true});
  const start=n=>s.start({id:n.toString(16).padStart(32,'0'),song:2910,tab,token:a.token});
  const confirm=async()=>{for(const t of state.sent)state.status.set('0x'+t.txid(),'success');state.nonce=Math.max(...state.sent.map(t=>Number(t.auth.spendingCondition.nonce)))+1;await w.exclusive(async()=>w.reconcile(await w.journal()));};
  await work({w,s,a,state,start,confirm,dir,transport});s.disable();
 }finally{await rm(dir,{recursive:true,force:true});}
}
describe('queued paid starts with real offline wallet',()=>{
 it('submits three rapid starts with distinct nonces and verifies all receipts',()=>fixture(async({w,state,start,confirm})=>{
  for(let n=1;n<=3;n++)expect((await start(n)).outcome).toBe('submitted');
  expect(state.sent.map(t=>Number(t.auth.spendingCondition.nonce))).toEqual([0,1,2]);expect(w.running).toBe(false);
  await confirm();expect((await w.journal()).map(e=>e.status)).toEqual(['confirmed','confirmed','confirmed']);
 }));
 it('serializes same-tick starts and never duplicates a playback',()=>fixture(async({start,state})=>{
  const rows=await Promise.all([start(1),start(2),start(1)]);expect(rows.every(r=>r.outcome==='submitted')).toBe(true);expect(state.sent).toHaveLength(2);
 }));
 it('blocks an uncertain head then recovers saved bytes without signing again',()=>fixture(async({w,state,start})=>{
  state.bad=true;expect((await start(1)).outcome).toBe('unknown');expect((await start(2)).outcome).toBe('free');expect(state.sent).toHaveLength(1);
  const first=state.sent[0].txid();state.bad=false;state.status.set('0x'+first,'missing');
  await w.exclusive(async()=>w.rebroadcastMissing(await w.journal(),()=>{}));expect(state.sent[1].txid()).toBe(first);expect((await start(3)).outcome).toBe('submitted');
 }));
 it('resends only the lowest missing nonce and enforces spacing and retry limit',()=>fixture(async({w,state,start})=>{
  await start(1);await start(2);let now=Date.now();w.now=()=>now;
  const head=state.sent[0].txid();state.status.set('0x'+head,'missing');
  const resend=()=>w.exclusive(async()=>w.rebroadcastMissing(await w.journal(),()=>{}));
  await resend();state.status.set('0x'+head,'missing');await resend();expect(state.sent).toHaveLength(3);
  now+=60000;await resend();state.status.set('0x'+head,'missing');now+=60000;await resend();state.status.set('0x'+head,'missing');now+=60000;
  await expect(resend()).rejects.toThrow('retry limit');expect(state.sent.slice(2).every(t=>t.txid()===head)).toBe(true);expect((await start(3)).outcome).toBe('free');
 }));
 it('handles canonical abort in the queue and continues with the next unused nonce',()=>fixture(async({w,state,start,confirm})=>{
  await start(1);await start(2);await start(3);for(const t of state.sent)state.status.set('0x'+t.txid(),t.auth.spendingCondition.nonce===1n?'abort_by_response':'success');state.nonce=3;await w.exclusive(async()=>w.reconcile(await w.journal()));
  expect((await w.journal())[1].status).toBe('failed');expect((await start(4)).outcome).toBe('submitted');expect(state.sent[3].auth.spendingCondition.nonce).toBe(3n);
 }));
 it('refuses foreign nonces, known gaps and pending depth overflow',()=>fixture(async({w,state,start})=>{
  state.foreign=[4];expect((await start(1)).outcome).toBe('free');state.foreign=[];await start(2);state.missing=[0];expect((await start(3)).outcome).toBe('free');state.missing=[];w.maxPending=1;expect((await start(4)).outcome).toBe('free');expect(state.sent).toHaveLength(1);
 }));
 it('reserves pending spends against confirmed balance',()=>fixture(async({state,start})=>{
  state.balance='600';expect((await start(1)).outcome).toBe('submitted');expect((await start(2)).outcome).toBe('free');expect(state.sent).toHaveLength(1);
 }));
 it('persists prepared evidence and broadcasts nothing after stop during save',()=>fixture(async({w,s,state,start})=>{
  const save=w.save.bind(w);w.save=async(name,v)=>{await save(name,v);if(name==='journal.json')s.disable();};expect((await start(1)).outcome).toBe('unknown');expect(state.sent).toHaveLength(0);expect((await w.journal())[0].status).toBe('prepared');
 }));
 it.each(['epoch','lease','kill'])('blocks broadcast after %s changes during durable save',kind=>fixture(async({w,s,state,start})=>{
  const save=w.save.bind(w),previous=process.env.WIZARD_KILL_SWITCH;
  w.save=async(name,value)=>{await save(name,value);if(name==='journal.json'){if(kind==='epoch')w.stopEpoch++;if(kind==='lease'){s.active.continuous=false;s.active.lease=0;}if(kind==='kill')process.env.WIZARD_KILL_SWITCH='1';}};
  try{expect((await start(1)).outcome).toBe('unknown');expect(state.sent).toHaveLength(0);expect((await w.journal())[0].status).toBe('prepared');}
  finally{if(previous===undefined)delete process.env.WIZARD_KILL_SWITCH;else process.env.WIZARD_KILL_SWITCH=previous;}
 }));
 it('counts submitted entries against bounded session limits and reserve',()=>fixture(async({s,state,start})=>{
  s.active.continuous=false;s.active.max=2;state.balance='2000';expect((await start(1)).outcome).toBe('submitted');expect((await start(2)).outcome).toBe('submitted');expect((await start(3)).outcome).toBe('free');expect(state.sent).toHaveLength(2);
 }));
 it('retains the bounded reserve while reserving pending payments',()=>fixture(async({s,state,start})=>{
  s.active.continuous=false;state.balance='1500';expect((await start(1)).outcome).toBe('submitted');expect((await start(2)).outcome).toBe('free');expect(state.sent).toHaveLength(1);
 }));
 it('does no network work during 429 cooldown',()=>fixture(async({w,state,start})=>{
  w.cooldownUntil=Date.now()+60000;const before=state.reads;expect((await start(1)).outcome).toBe('free');expect(state.reads).toBe(before);expect(state.sent).toHaveLength(0);
 }));
 it('backfills nonce after restart and blocks raw-less history',()=>fixture(async({w,state,start,dir,transport})=>{
  await start(1);const log=await w.journal();delete log[0].nonce;await w.save('journal.json',log);
  const reopened=new RadioWizard(dir,transport);expect((await reopened.journal())[0].nonce).toBe('0');
  delete log[0].raw;delete log[0].nonce;await w.save('journal.json',log);expect((await start(2)).outcome).toBe('free');expect(state.sent).toHaveLength(1);
 }));
 it('refuses returns until the entire queue is reconciled',()=>fixture(async({w,start,confirm})=>{
  await start(1);await start(2);await expect(w.prepareReturn({mode:'all',recipient:owner,fee:300})).rejects.toThrow();await confirm();expect((await w.prepareReturn({mode:'all',recipient:owner,fee:300})).amount).toBeTruthy();
 }));
 it('old released backend refuses a multi-entry journal without signing or resending',()=>fixture(async({w,start,state,dir,transport})=>{
  await start(1);await start(2);const old=new LegacyWizard(dir,transport,{readIntervalMs:0,vaultProtector:w.vaultProtector});
  await expect(old.rebroadcastMissing(await old.journal(),()=>{})).rejects.toThrow('exactly one');
  await expect(old.run({core:3,song:2910,fee:300,count:1})).rejects.toThrow('earlier payment');expect(state.sent).toHaveLength(2);
 }));
 it('restores and confirms a pending queue after a process restart without re-signing',()=>fixture(async({w,start,state,dir,transport})=>{
  await start(1);await start(2);const reopened=new RadioWizard(dir,transport);
  for(const t of state.sent)state.status.set('0x'+t.txid(),'success');state.nonce=2;
  await reopened.exclusive(async()=>reopened.reconcile(await reopened.journal()));
  expect((await reopened.journal()).every(e=>e.status==='confirmed')).toBe(true);expect(state.sent).toHaveLength(2);
 }));
 it('default flag refuses queued signing',()=>fixture(async({w,state,a})=>{
  w.queuedPaidStarts=false;await expect(w.submitNext({core:3,song:2910,fee:257,count:1},{playbackId:'b'.repeat(32),authorised:()=>a})).rejects.toThrow('disabled');expect(state.sent).toHaveLength(0);
 }));
 it.each([false,true])('bumps only the lowest nonce and reconciles either attempt with its tail (replacement wins=%s)',replacementWins=>fixture(async({w,state,start})=>{
  await start(1);await start(2);const log=await w.journal();await expect(w.retryPreparedPlay(log[1].txid,400)).rejects.toThrow('first');
  const replacement=await w.retryPreparedPlay(log[0].txid,400);expect(replacement.priorAttempts[0].raw).toBeUndefined();expect(state.sent[2].auth.spendingCondition.nonce).toBe(0n);
  state.status.set(replacementWins?replacement.txid:log[0].txid,'success');state.status.set(log[1].txid,'success');state.nonce=2;
  await w.exclusive(async()=>w.reconcile(await w.journal()));expect((await w.journal()).map(e=>e.status)).toEqual(['confirmed','confirmed']);
 }));
});
