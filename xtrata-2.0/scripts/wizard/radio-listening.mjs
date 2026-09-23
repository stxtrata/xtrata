import {decodePaidReceipt} from '../../public/radio/paid-receipt.mjs';
import {listenThreshold} from './radio-listening-policy.mjs';
import {randomBytes} from 'node:crypto';
import {policy,publicEntry} from './radio-plays-backend.mjs';
// One tab, session approval. Optional bounded chaining retains only signed submissions.
export class RadioListening {
 constructor(wizard,media,app={platform:'dev',version:'1.0.7'}){this.app=app;this.begins=new Map();this.wizard=wizard;this.media=media;this.active=null;this.events=[];this.seen=new Map();this.inFlight=false;this.startTail=Promise.resolve();this.waitingStarts=0;}
 async recover(){
  const a=this.active;if(!a||this.inFlight||this.waitingStarts||this.recovering||this.wizard.running)return;
  if(this.nextRecovery&&Date.now()<this.nextRecovery)return;
  const pending=await this.wizard.journal();if(!pending.some(e=>!['confirmed','failed'].includes(e.status))){this.recovery=null;this.recoveryFailures=0;return;}
  this.nextRecovery=Date.now()+30000;this.recovering=true;
  try{this.recoveryTask=this.wizard.exclusive(async()=>{this.check({token:a.token,tab:a.tab});await this.wizard.reconcile(await this.wizard.journal(),()=>this.check({token:a.token,tab:a.tab}),a.feeMode==='cap'?{feeCap:a.fee,listeningSession:a.token,continuous:a.continuous,authorised:()=>this.check({token:a.token,tab:a.tab})}:null);});await this.recoveryTask;this.recovery=null;this.recoveryFailures=0;}
  catch(e){this.recovery=e.message;this.recoveryFailures=(this.recoveryFailures||0)+1;}
  finally{this.recovering=false;}
 }
 async refreshedSnapshot(){
  await this.recover();
  const log=await this.wizard.journal();
  for(const e of log.filter(e=>e.playbackId).slice(-100)){if(!this.events.some(row=>row.id===e.playbackId))this.events.push({id:e.playbackId,song:e.song,at:e.createdAt,outcome:e.status==='confirmed'?'confirmed':e.status==='failed'?'failed':'unknown',reason:e.status==='confirmed'?'Paid start confirmed.':e.status==='failed'?`Paid start failed on-chain (${e.failureStatus||'abort'}); it was not retried.`:'Saved payment awaits reconciliation.',txid:e.confirmedTxid||e.failedTxid||e.txid});}
  for(const row of this.events){
   const entry=log.find(e=>e.playbackId===row.id);
   if(entry?.status==='confirmed'){row.outcome='confirmed';row.reason=decodePaidReceipt(entry.receipt).kind==='listen'?'Paid listen confirmed.':'Paid start confirmed.';row.txid=entry.confirmedTxid||entry.txid;}
   if(entry?.status==='failed'){row.outcome='failed';row.reason=`Paid start failed on-chain (${entry.failureStatus||'abort'}); it was not retried.`;row.txid=entry.failedTxid||entry.txid;}
   if(entry){row.receiptLabel=decodePaidReceipt(entry.receipt).label;const diagnostic=publicEntry(entry);for(const key of ['nonce','bytes','fee','actualFee','feeChosen','feeCap','feeReason','feeEstimates','submittedAt','confirmedAt','blockHeight','confirmationSeconds','rejectionReason'])if(diagnostic[key]!==undefined)row[key]=diagnostic[key];row.title=entry.title;row.artist=entry.artist;row.recipient=entry.recipient;}
  }
  return this.snapshot();
 }
 snapshot(){
  if(this.active&&((!this.active.continuous&&(Date.now()>=this.active.expires||Date.now()>=this.active.lease))||this.active.epoch!==this.wizard.stopEpoch))this.disable();
  const a=this.active;return {enabled:!!a,continuous:!!a?.continuous,fee:a?.fee??null,max:a?.max??0,used:a?.used??0,expires:a?.expires??null,recovery:this.wizard.now?.()<this.wizard.cooldownUntil?'Chain service is busy; checks are cooling down. Music continues free.':this.recovery||null,recoveryFailures:this.recoveryFailures||0,events:this.events.slice(-100).reverse()};
 }
 disable(){if(this.active){const epoch=this.active.epoch;clearTimeout(this.timer);this.active=null;if(epoch===this.wizard.stopEpoch)this.wizard.stop();}}
 check(input){this.snapshot();if(!this.active||input.token!==this.active.token||input.tab!==this.active.tab)throw Error('Paid approval is absent, expired or belongs to another tab. Listening stays free.');return this.active;}
 renew(input){const a=this.check(input);a.lease=Date.now()+30000;clearTimeout(this.timer);this.timer=setTimeout(()=>this.snapshot(),30100);this.timer.unref?.();return this.snapshot();}
 async enable(p){
  if(!p||!['fee,max,minutes,tab','continuous,fee,max,minutes,tab','continuous,fee,feeMode,max,minutes,tab'].includes(Object.keys(p).sort().join(','))||(p.feeMode!==undefined&&p.feeMode!=='cap')||(p.continuous!==undefined&&typeof p.continuous!=='boolean')||!Number.isInteger(p.minutes)||p.minutes<1||p.minutes>30||typeof p.tab!=='string'||!/^[a-f0-9]{32}$/.test(p.tab))throw Error('Choose a test duration of 1–30 minutes.');
  policy({core:3,song:0,fee:p.fee,count:1});
  if(p.fee<257)throw Error('A play requires at least 257 microSTX. Review the fee before approving.');
  if(!Number.isInteger(p.max)||p.max<1||(!p.continuous&&(p.fee+50)*p.max>5000))throw Error(`Session spending ceiling: choose 1–${Math.floor(5000/(p.fee+50))} starts at this fee (0.005 STX maximum).`);
  this.snapshot();
  if(this.active||this.inFlight)throw Error('A paid test already owns this wizard. Switch it to Free or stop it first.');
  const epoch=this.wizard.stopEpoch;
  await this.wizard.exclusive(async()=>{
   const q=await this.wizard.optional('return-quote.json',null);if(q?.expires>Date.now())throw Error('Finish or cancel the return review first.');
   const log=await this.wizard.journal();try{await this.wizard.reconcile(log);}catch(e){if(!['PAYMENT_UNRESOLVED','RECEIPT_PENDING'].includes(e.code))throw e;this.recovery=e.message;}await this.wizard.reconcileReturns();
   if(!p.continuous&&log.reduce((total,e)=>total+(e.feeCap||e.fee)+50,0)+(p.fee+50)*p.max>10000)throw Error('This approval exceeds the remaining 0.01 STX lifetime test budget.');
   const {address}=await this.wizard.json('vault.json'),account=await this.wizard.returnAccount(address,true);
   if(account.balance<BigInt(p.fee+50+(p.continuous?0:1000)))throw Error('Not enough confirmed funds for the next payment.');
   if(epoch!==this.wizard.stopEpoch)throw Error('Approval was stopped. Enable again when ready.');
   this.begins.clear();this.active={beganAt:Date.now(),qualifiedSeconds:0,...p,token:randomBytes(16).toString('hex'),used:0,expires:Date.now()+p.minutes*60000,lease:Date.now()+30000,epoch:this.wizard.stopEpoch};
  });
  this.renew({token:this.active.token,tab:p.tab});return {...this.snapshot(),token:this.active.token};
 }
 free(input){this.check(input);this.disable();return this.snapshot();}
 validateListen(p,qualify=false){
  const keys=qualify?'audibleSeconds,id,song,tab,threshold,token':'id,song,tab,token';
  if(!p||Object.keys(p).sort().join(',')!==keys||typeof p.id!=='string'||!/^[a-f0-9]{32}$/.test(p.id)||!Number.isSafeInteger(p.song)||p.song<0||typeof p.token!=='string'||typeof p.tab!=='string')throw Error('Invalid listening request.');
  if(qualify&&(!Number.isFinite(p.audibleSeconds)||p.audibleSeconds<0||!Number.isInteger(p.threshold)||p.threshold<1||p.threshold>30))throw Error('Invalid audible time.');
 }
 async begin(p){
  this.validateListen(p);const a=this.check(p);
  if(this.begins.has(p.id)||this.seen.has(p.id))throw Error('Playback already registered.');
  if(this.begins.size>=10000)throw Error('Listening session is full. Start a new session.');
  if(!this.media.tracks?.some(t=>t.id===p.song))throw Error('Song is not in the catalogue.');
  // Reserve before awaiting audio so concurrent duplicate begin requests fail.
  const record={song:p.song,token:a.token,ready:false,qualified:false};this.begins.set(p.id,record);
  const audio=await this.media.audio(p.song);this.check(p);
  record.threshold=listenThreshold(audio.duration);record.unknownDuration=!(Number.isFinite(audio.duration)&&audio.duration>0);record.at=Date.now();record.ready=true;
  return {threshold:record.threshold,unknownDuration:record.unknownDuration};
 }
 async qualify(p){
  this.validateListen(p,true);const a=this.check(p),record=this.begins.get(p.id);
  if(!record?.ready||record.token!==a.token||record.song!==p.song)throw Error('No verified listening begin. This listen stays free.');
  if(record.qualified||this.seen.has(p.id))throw Error('Listen already qualified.');
  const elapsed=(Date.now()-record.at)/1000;
  if(p.threshold!==record.threshold||p.audibleSeconds<record.threshold||elapsed<record.threshold-2||p.audibleSeconds>elapsed+2)throw Error('Listening threshold has not been verified. This listen stays free.');
  if(a.qualifiedSeconds+record.threshold>(Date.now()-a.beganAt)/1000+2)throw Error('Session listening rate exceeded. This listen stays free.');
  record.qualified=true;a.qualifiedSeconds+=record.threshold;
  return this.start({id:p.id,song:p.song,token:p.token,tab:p.tab},{...this.app,audibleSeconds:p.audibleSeconds,threshold:record.threshold,unknownDuration:record.unknownDuration});
 }
 async start(p,listen){
  if(!this.wizard.queuedPaidStarts)return this.startImmediate(p,listen);
  this.check(p);
  const free=reason=>({id:p.id,song:p.song,outcome:'free',reason});
  if(this.waitingStarts>=this.wizard.maxPending)return free('Submission busy. This start stays free.');
  const deadline=Date.now()+20000;this.waitingStarts++;
  const task=this.startTail.catch(()=>{}).then(async()=>{
   if(this.recoveryTask)await this.recoveryTask.catch(()=>{});
   this.check(p);if(Date.now()>deadline)return free('Submission window elapsed. This start stays free.');
   return this.startImmediate(p,listen);
  });
  this.startTail=task.catch(()=>{});
  try{return await task;}finally{this.waitingStarts--;}
 }
 async startImmediate(p,listen){
  const keys=Object.keys(p||{}).sort().join(',');
  if(!p||!['duration,id,song,tab,token','id,song,tab,token'].includes(keys)||typeof p.id!=='string'||!/^[a-f0-9]{32}$/.test(p.id)||!Number.isSafeInteger(p.song)||p.song<0)throw Error('Invalid playback start.');
  const a=this.check(p);if(this.seen.has(p.id))return this.seen.get(p.id);
  if(this.seen.size>=10000)throw Error('Playback history limit reached. Restart the listening service.');
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
   const input={core:3,song:p.song,fee:a.fee,count:1},context={...(a.feeMode==='cap'?{feeCap:a.fee}:{}),listen,playbackId:p.id,listeningSession:a.token,title:track?.title,artist:track?.artist,continuous:a.continuous===true,authorised:()=>this.check(p)};
   if(this.wizard.queuedPaidStarts){
    try{const entry=await this.wizard.submitNext(input,context);row.outcome=entry.status;row.txid=entry.txid;row.reason='Payment submitted; waiting for confirmation.';return row;}
    catch(error){const entry=(await this.wizard.journal()).find(e=>e.playbackId===p.id);row.outcome=entry?'unknown':'free';row.reason=error.message;if(entry)row.txid=entry.txid;return row;}
    finally{this.inFlight=false;}
   }
   const operation=this.wizard.run(input,context);
   void operation.then(()=>{row.outcome='confirmed';row.reason=listen?'Paid listen confirmed.':'Paid start confirmed.';}).catch(async error=>{
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
