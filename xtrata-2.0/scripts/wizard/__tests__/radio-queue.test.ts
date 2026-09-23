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
  const state={nonce:0,balance:'1000000',sent:[],status:new Map(),bad:false,foreign:[],missing:[],reads:0,estimate:257,estimateReads:0,estimateError:null,transferRate:2};
  const source=await readFile(new URL('../../../contracts/live/xtrata-radio-plays-v1.0.clar',import.meta.url),'utf8');
  let address;
  const transport=async(url,opts)=>{
   let value;state.reads++;
   if(url.endsWith('/v2/fees/transaction')){state.estimateReads++;if(state.estimateError)return {ok:false,status:state.estimateError==='429'?429:400,json:async()=>({reason:state.estimateError})};value={estimations:[state.estimate,state.estimate+10,state.estimate+20].map(fee=>({fee}))};}
   else if(url.endsWith('/v2/fees/transfer'))value=state.transferRate;
   else if(url.endsWith('/v2/info'))value={network_id:1};
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
 it('signs threshold receipts on distinct queued nonces with actual offline wallet code',()=>fixture(async({s,a,state,w})=>{
  for(let n=1;n<=3;n++){
   const p={id:n.toString(16).padStart(32,'0'),song:2910,tab,token:a.token};
   await s.begin(p);s.begins.get(p.id).at-=30000;s.active.beganAt-=30000;
   expect((await s.qualify({...p,audibleSeconds:30,threshold:30})).outcome).toBe('submitted');
  }
  expect(state.sent.map(t=>Number(t.auth.spendingCondition.nonce))).toEqual([0,1,2]);
  const log=await w.journal();expect(log.every(e=>e.receipt.startsWith('584d01'))).toBe(true);expect(log.every(e=>e.bytes===257&&e.fee===257)).toBe(true);
 }));

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

async function capStart(s,a,n=1){s.active.feeMode='cap';s.active.fee=1000;const p={id:n.toString(16).padStart(32,'0'),song:2910,tab,token:a.token};await s.begin(p);s.begins.get(p.id).at-=30000;s.active.beganAt-=30000;return s.qualify({...p,audibleSeconds:30,threshold:30});}
const bumpApproval=(s,a)=>({feeCap:1000,listeningSession:a.token,continuous:true,authorised:()=>s.check({token:a.token,tab})});
describe('capped congestion fees and replacements, real offline wallet',()=>{
 it('uses floor, caches across receipts, and records estimates/cap',()=>fixture(async({s,a,w,state})=>{
  await capStart(s,a);await capStart(s,a,2);expect(state.estimateReads).toBe(1);const log=await w.journal();expect(log.map(e=>e.fee)).toEqual([257,257]);expect(log[0]).toMatchObject({feeCap:1000,feeChosen:257,feeReason:'floor',feeEstimates:{low:257}});
 }));
 it('uses the low estimate, rejects above cap, and reserves cap headroom',()=>fixture(async({s,a,w,state})=>{
  state.estimate=700;await capStart(s,a);expect((await w.journal())[0].fee).toBe(700);
  state.balance='1500';expect((await capStart(s,a,2)).outcome).toBe('free');expect(state.sent).toHaveLength(1);
  state.balance='1000000';w.feeEstimateCheckedAt=undefined;state.estimate=1001;expect((await capStart(s,a,3)).outcome).toBe('free');expect(state.sent).toHaveLength(1);
 }));
 it('uses transfer rate when estimates are unavailable',()=>fixture(async({s,a,w,state})=>{
  state.estimateError='NoEstimateAvailable';await capStart(s,a);expect((await w.journal())[0].fee).toBe(514);
 }));
 it('does not sign during 429 cooldown even with a cached estimate',()=>fixture(async({s,a,w,state})=>{
  await capStart(s,a);state.estimateError='429';w.feeEstimateCheckedAt=undefined;
  expect((await capStart(s,a,2)).outcome).toBe('free');expect(state.sent).toHaveLength(1);expect(w.cooldownUntil).toBeGreaterThan(w.now());
 }));
 it('bumps only the head twice, then refuses another queued listen',()=>fixture(async({s,a,w,state})=>{
  await capStart(s,a);await capStart(s,a,2);let now=Date.now()+180001;w.now=()=>now;
  const bump=()=>w.exclusive(async()=>w.bumpPending(await w.journal(),bumpApproval(s,a)));
  await bump();let log=await w.journal();expect(log.map(e=>e.fee)).toEqual([386,257]);expect(log[0].priorAttempts).toHaveLength(1);
  now+=180001;await bump();log=await w.journal();expect(log[0].fee).toBe(579);expect(log[0].priorAttempts).toHaveLength(2);
  now+=180001;await bump();expect(state.sent).toHaveLength(4);expect((await capStart(s,a,3)).outcome).toBe('free');
  expect(new Set(state.sent.filter(t=>t.auth.spendingCondition.nonce===0n).map(t=>Buffer.from(t.payload.functionArgs[2].buffer).toString('hex'))).size).toBe(1);
 }));
 it.each([0,1])('reconciles winning attempt %s without another holder payment',winner=>fixture(async({s,a,w,state})=>{
  await capStart(s,a);w.now=()=>Date.now()+180001;await w.exclusive(async()=>w.bumpPending(await w.journal(),bumpApproval(s,a)));
  const id='0x'+state.sent[winner].txid();state.status.set(id,'success');state.nonce=1;await w.exclusive(async()=>w.reconcile(await w.journal()));
  expect((await w.journal())[0]).toMatchObject({status:'confirmed',confirmedTxid:id,actualFee:winner?386:257});expect(state.sent).toHaveLength(2);
 }));
 it('will not bump prepared, too-young or ended approval; stop during save prevents broadcast',()=>fixture(async({s,a,w,state})=>{
  await capStart(s,a);const approval=bumpApproval(s,a);await w.exclusive(async()=>w.bumpPending(await w.journal(),approval));expect(state.sent).toHaveLength(1);
  w.now=()=>Date.now()+180001;let log=await w.journal();log[0].status='prepared';await w.save('journal.json',log);await w.exclusive(async()=>w.bumpPending(await w.journal(),approval));expect(state.sent).toHaveLength(1);
  log[0].status='submitted';await w.save('journal.json',log);const save=w.save.bind(w);w.save=async(n,v)=>{await save(n,v);if(n==='journal.json')s.disable();};
  await expect(w.exclusive(async()=>w.bumpPending(await w.journal(),approval))).rejects.toThrow();expect(state.sent).toHaveLength(1);expect((await w.journal())[0].status).toBe('prepared');
 }));
});

it('falls back to recent estimates, expires them and backs off failed estimation reads',()=>fixture(async({s,a,w,state})=>{
 state.estimate=400;await capStart(s,a);const tx=state.sent[0];let now=Date.now()+61000;w.now=()=>now;state.estimateError='ServiceUnavailable';
 expect((await w.choosePlayFee(tx,1000)).fee).toBe(400);const reads=state.estimateReads;await w.choosePlayFee(tx,1000);expect(state.estimateReads).toBe(reads);
 now+=600000;expect((await w.choosePlayFee(tx,1000)).fee).toBe(257);
}));
it('never bumps beyond cap or from a different session and reuses latest missing bytes',()=>fixture(async({s,a,w,state})=>{
 await capStart(s,a);w.now=()=>Date.now()+180001;const approval=bumpApproval(s,a);
 await w.exclusive(async()=>w.bumpPending(await w.journal(),{...approval,listeningSession:'other'}));expect(state.sent).toHaveLength(1);
 state.estimate=5000;w.feeEstimateCheckedAt=undefined;await w.exclusive(async()=>w.bumpPending(await w.journal(),approval));expect((await w.journal())[0].fee).toBe(1000);
 const latest=state.sent[1].txid();for(const tx of state.sent)state.status.set('0x'+tx.txid(),'missing');
 await w.exclusive(async()=>w.rebroadcastMissing(await w.journal(),approval.authorised));expect(state.sent[2].txid()).toBe(latest);
 expect((await capStart(s,a,2)).outcome).toBe('free');expect(state.sent).toHaveLength(3);
}));
it('revoking consent during key access prevents signing a replacement',()=>fixture(async({s,a,w,state})=>{
 await capStart(s,a);w.now=()=>Date.now()+180001;const key=w.key.bind(w);w.key=async()=>{const value=await key();s.disable();return value;};
 await expect(w.exclusive(async()=>w.bumpPending(await w.journal(),bumpApproval(s,a)))).rejects.toThrow();expect(state.sent).toHaveLength(1);expect((await w.journal())[0].priorAttempts).toBeUndefined();
}));
