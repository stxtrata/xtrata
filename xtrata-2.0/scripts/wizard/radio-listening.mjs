import {randomBytes} from 'node:crypto';
import {policy} from './radio-plays-backend.mjs';
// One tab, bounded approval, no persistent auto-enable and no backlog.
export class RadioListening {
 constructor(wizard,media){this.wizard=wizard;this.media=media;this.active=null;this.events=[];this.seen=new Map();this.inFlight=false;}
 snapshot(){
  if(this.active&&(Date.now()>=this.active.expires||Date.now()>=this.active.lease||this.active.epoch!==this.wizard.stopEpoch))this.disable();
  const a=this.active;return {enabled:!!a,fee:a?.fee??null,max:a?.max??0,used:a?.used??0,expires:a?.expires??null,events:this.events.slice(-100).reverse()};
 }
 disable(){if(this.active){const epoch=this.active.epoch;clearTimeout(this.timer);this.active=null;if(epoch===this.wizard.stopEpoch)this.wizard.stop();}}
 check(input){this.snapshot();if(!this.active||input.token!==this.active.token||input.tab!==this.active.tab)throw Error('Paid approval is absent, expired or belongs to another tab. Listening stays free.');return this.active;}
 renew(input){const a=this.check(input);a.lease=Date.now()+30000;clearTimeout(this.timer);this.timer=setTimeout(()=>this.snapshot(),30100);this.timer.unref?.();return this.snapshot();}
 async enable(p){
  if(!p||Object.keys(p).sort().join(',')!=='fee,max,minutes,tab'||!Number.isInteger(p.minutes)||p.minutes<1||p.minutes>30||typeof p.tab!=='string'||!/^[a-f0-9]{32}$/.test(p.tab))throw Error('Choose a test duration of 1–30 minutes.');
  policy({core:3,song:0,fee:p.fee,count:p.max});this.snapshot();
  if(this.active||this.inFlight)throw Error('A paid test already owns this wizard. Switch it to Free or stop it first.');
  const epoch=this.wizard.stopEpoch;
  await this.wizard.exclusive(async()=>{
   const q=await this.wizard.optional('return-quote.json',null);if(q?.expires>Date.now())throw Error('Finish or cancel the return review first.');
   const log=await this.wizard.journal();await this.wizard.reconcile(log);await this.wizard.reconcileReturns();
   if(log.reduce((total,e)=>total+e.fee+50,0)+(p.fee+50)*p.max>10000)throw Error('This approval exceeds the remaining 0.01 STX lifetime test budget.');
   const {address}=await this.wizard.json('vault.json'),account=await this.wizard.returnAccount(address);
   if(account.balance>1000000n)throw Error('Balance exceeds 1 STX. Return the excess before enabling paid tests.');
   if(account.balance<BigInt(p.fee+50+1000))throw Error('Not enough confirmed funds after the 0.001 STX reserve.');
   if(epoch!==this.wizard.stopEpoch)throw Error('Approval was stopped. Enable again when ready.');
   this.active={...p,token:randomBytes(16).toString('hex'),used:0,expires:Date.now()+p.minutes*60000,lease:Date.now()+30000,epoch:this.wizard.stopEpoch};
  });
  this.renew({token:this.active.token,tab:p.tab});return {...this.snapshot(),token:this.active.token};
 }
 free(input){this.check(input);this.disable();return this.snapshot();}
 async start(p){
  if(!p||Object.keys(p).sort().join(',')!=='id,song,tab,token'||typeof p.id!=='string'||!/^[a-f0-9]{32}$/.test(p.id)||!Number.isSafeInteger(p.song)||p.song<0)throw Error('Invalid playback start.');
  const a=this.check(p);if(this.seen.has(p.id))return this.seen.get(p.id);
  const row={id:p.id,song:p.song,at:new Date().toISOString(),outcome:'free',reason:''};
  this.seen.set(p.id,row);this.events.push(row);
  if(a.used>=a.max){row.reason='Approved start limit reached.';this.disable();return row;}
  if(this.inFlight||this.wizard.running){row.reason='Previous wallet operation is still active. This start stays free.';return row;}
  if(!this.media.loaded.has(p.song)){row.reason='Audio was not verified by this local player.';return row;}
  this.inFlight=true;
  try{
   const saved=await this.wizard.journal();const existing=saved.find(e=>e.playbackId===p.id);
   if(existing){row.outcome=existing.status;row.reason='Already recorded; no second payment.';row.txid=existing.txid;return row;}
   // Recheck consent after the asynchronous journal read.
   this.check(p);a.used++;row.outcome='requested';row.reason='Payment requested; check wallet activity for confirmation.';
   const operation=this.wizard.run({core:3,song:p.song,fee:a.fee,count:1},{playbackId:p.id,listeningSession:a.token});
   void operation.then(()=>{row.outcome='confirmed';row.reason='Paid start confirmed.';}).catch(async error=>{
    row.reason=error.message;row.outcome='unavailable';
    try{const entry=(await this.wizard.journal()).find(e=>e.playbackId===p.id);if(entry){row.outcome=entry.status==='confirmed'?'confirmed':'unknown';row.txid=entry.txid;}}catch{row.outcome='unknown';}
    this.disable();
   }).finally(()=>{this.inFlight=false;if(this.active===a&&a.used>=a.max)this.disable();});
   // run() sets its own lock synchronously. Ownership lasts through confirmation.
   return row;
  }catch(error){this.inFlight=false;row.reason=error.message;this.disable();return row;}
  finally{if(row.outcome!=='requested')this.inFlight=false;}
 }
}
