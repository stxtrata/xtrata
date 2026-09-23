import {randomBytes} from 'node:crypto';
import {policy} from './radio-plays-backend.mjs';
// One tab, bounded approval, no persistent auto-enable and no backlog.
export class RadioListening {
 constructor(wizard,media){this.wizard=wizard;this.media=media;this.active=null;this.events=[];this.seen=new Map();this.inFlight=false;}
 async recover(){
  const a=this.active;if(!a||this.inFlight||this.recovering||this.wizard.running)return;
  if(this.nextRecovery&&Date.now()<this.nextRecovery)return;
  this.nextRecovery=Date.now()+15000;this.recovering=true;
  try{await this.wizard.exclusive(async()=>{this.check({token:a.token,tab:a.tab});await this.wizard.reconcile(await this.wizard.journal(),()=>this.check({token:a.token,tab:a.tab}));});this.recovery=null;this.recoveryFailures=0;}
  catch(e){this.recovery=e.message;this.recoveryFailures=(this.recoveryFailures||0)+1;}
  finally{this.recovering=false;}
 }
 async refreshedSnapshot(){
  await this.recover();
  const log=await this.wizard.journal();
  for(const e of log.filter(e=>e.playbackId).slice(-100)){if(!this.events.some(row=>row.id===e.playbackId))this.events.push({id:e.playbackId,song:e.song,at:e.createdAt,outcome:e.status==='confirmed'?'confirmed':e.status==='failed'?'failed':'unknown',reason:e.status==='confirmed'?'Paid start confirmed.':e.status==='failed'?`Paid start failed on-chain (${e.failureStatus||'abort'}); it was not retried.`:'Saved payment awaits reconciliation.',txid:e.confirmedTxid||e.failedTxid||e.txid});}
  for(const row of this.events){
   const entry=log.find(e=>e.playbackId===row.id);
   if(entry?.status==='confirmed'){row.outcome='confirmed';row.reason='Paid start confirmed.';row.txid=entry.confirmedTxid||entry.txid;}
   if(entry?.status==='failed'){row.outcome='failed';row.reason=`Paid start failed on-chain (${entry.failureStatus||'abort'}); it was not retried.`;row.txid=entry.failedTxid||entry.txid;}
   if(entry){row.title=entry.title;row.artist=entry.artist;row.recipient=entry.recipient;}
  }
  return this.snapshot();
 }
 snapshot(){
  if(this.active&&((!this.active.continuous&&(Date.now()>=this.active.expires||Date.now()>=this.active.lease))||this.active.epoch!==this.wizard.stopEpoch))this.disable();
  const a=this.active;return {enabled:!!a,continuous:!!a?.continuous,fee:a?.fee??null,max:a?.max??0,used:a?.used??0,expires:a?.expires??null,recovery:this.recovery||null,recoveryFailures:this.recoveryFailures||0,events:this.events.slice(-100).reverse()};
 }
 disable(){if(this.active){const epoch=this.active.epoch;clearTimeout(this.timer);this.active=null;if(epoch===this.wizard.stopEpoch)this.wizard.stop();}}
 check(input){this.snapshot();if(!this.active||input.token!==this.active.token||input.tab!==this.active.tab)throw Error('Paid approval is absent, expired or belongs to another tab. Listening stays free.');return this.active;}
 renew(input){const a=this.check(input);a.lease=Date.now()+30000;clearTimeout(this.timer);this.timer=setTimeout(()=>this.snapshot(),30100);this.timer.unref?.();return this.snapshot();}
 async enable(p){
  if(!p||!['fee,max,minutes,tab','continuous,fee,max,minutes,tab'].includes(Object.keys(p).sort().join(','))||(p.continuous!==undefined&&typeof p.continuous!=='boolean')||!Number.isInteger(p.minutes)||p.minutes<1||p.minutes>30||typeof p.tab!=='string'||!/^[a-f0-9]{32}$/.test(p.tab))throw Error('Choose a test duration of 1–30 minutes.');
  policy({core:3,song:0,fee:p.fee,count:1});
  if(!Number.isInteger(p.max)||p.max<1||(!p.continuous&&(p.fee+50)*p.max>5000))throw Error(`Session spending ceiling: choose 1–${Math.floor(5000/(p.fee+50))} starts at this fee (0.005 STX maximum).`);
  this.snapshot();
  if(this.active||this.inFlight)throw Error('A paid test already owns this wizard. Switch it to Free or stop it first.');
  const epoch=this.wizard.stopEpoch;
  await this.wizard.exclusive(async()=>{
   const q=await this.wizard.optional('return-quote.json',null);if(q?.expires>Date.now())throw Error('Finish or cancel the return review first.');
   const log=await this.wizard.journal();try{await this.wizard.reconcile(log);}catch(e){if(!['PAYMENT_UNRESOLVED','RECEIPT_PENDING'].includes(e.code))throw e;this.recovery=e.message;}await this.wizard.reconcileReturns();
   if(!p.continuous&&log.reduce((total,e)=>total+e.fee+50,0)+(p.fee+50)*p.max>10000)throw Error('This approval exceeds the remaining 0.01 STX lifetime test budget.');
   const {address}=await this.wizard.json('vault.json'),account=await this.wizard.returnAccount(address,true);
   if(account.balance<BigInt(p.fee+50+(p.continuous?0:1000)))throw Error('Not enough confirmed funds for the next payment.');
   if(epoch!==this.wizard.stopEpoch)throw Error('Approval was stopped. Enable again when ready.');
   this.active={...p,token:randomBytes(16).toString('hex'),used:0,expires:Date.now()+p.minutes*60000,lease:Date.now()+30000,epoch:this.wizard.stopEpoch};
  });
  this.renew({token:this.active.token,tab:p.tab});return {...this.snapshot(),token:this.active.token};
 }
 free(input){this.check(input);this.disable();return this.snapshot();}
 async start(p){
  const keys=Object.keys(p||{}).sort().join(',');
  if(!p||!['duration,id,song,tab,token','id,song,tab,token'].includes(keys)||typeof p.id!=='string'||!/^[a-f0-9]{32}$/.test(p.id)||!Number.isSafeInteger(p.song)||p.song<0)throw Error('Invalid playback start.');
  const a=this.check(p);if(this.seen.has(p.id))return this.seen.get(p.id);
  const track=this.media.tracks?.find(t=>t.id===p.song);
  const row={title:track?.title,artist:track?.artist,id:p.id,song:p.song,at:new Date().toISOString(),outcome:'free',reason:''};
  this.seen.set(p.id,row);this.events.push(row);
  // A current local client does not send a duration. Older clients may still
  // include it, but it is deliberately ignored while the duration gate is
  // disabled. Verify that this service can still load the selected audio so a
  // malformed or unavailable inscription cannot create a payment.
  try{await this.media.audio(p.song);}catch{row.reason='Audio could not be verified locally. This start stays free.';return row;}
  if(!a.continuous&&a.used>=a.max){row.reason='Approved start limit reached.';this.disable();return row;}
  if(this.inFlight||this.recovering||this.wizard.running){row.reason='Previous wallet operation is still active. This start stays free.';return row;}
  this.inFlight=true;
  try{
   const saved=await this.wizard.journal();const existing=saved.find(e=>e.playbackId===p.id);
   if(existing){row.outcome=existing.status;row.reason='Already recorded; no second payment.';row.txid=existing.txid;return row;}
   // Recheck consent after the asynchronous journal read.
   this.check(p);a.used++;row.outcome='requested';row.reason='Payment requested; check wallet activity for confirmation.';
   const operation=this.wizard.run({core:3,song:p.song,fee:a.fee,count:1},{playbackId:p.id,listeningSession:a.token,title:track?.title,artist:track?.artist,continuous:a.continuous===true});
   void operation.then(()=>{row.outcome='confirmed';row.reason='Paid start confirmed.';}).catch(async error=>{
    row.reason=error.message;row.outcome='unavailable';
    try{const entry=(await this.wizard.journal()).find(e=>e.playbackId===p.id);if(entry){row.outcome=entry.status==='confirmed'?'confirmed':entry.status==='failed'?'failed':'unknown';row.txid=entry.confirmedTxid||entry.failedTxid||entry.txid;}}catch{row.outcome='unknown';}
    if(!a.continuous)this.disable();
   }).finally(()=>{this.inFlight=false;if(this.active===a&&!a.continuous&&a.used>=a.max)this.disable();});
   // run() sets its own lock synchronously. Ownership lasts through confirmation.
   return row;
  }catch(error){this.inFlight=false;row.reason=error.message;if(!a.continuous)this.disable();return row;}
  finally{if(row.outcome!=='requested')this.inFlight=false;}
 }
}
