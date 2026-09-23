// Compatibility helper for older local/browser clients. The duration gate is
// temporarily disabled: every playable catalogue entry may request support.
// Keep this exported while older desktop and extension code is in circulation.
export function eligibleSongDuration(_seconds) {
 return true;
}

export function listenThreshold(duration) {
 return Number.isFinite(duration)&&duration>0?Math.min(30,Math.max(1,Math.floor(duration)-1)):30;
}
// Call on state changes and periodically. Credit only intervals whose endpoints
// are both audible. This conservatively excludes pause/mute/stall boundaries.
export class AudibleClock {
 constructor(){this.seconds=0;this.previous=null;this.wasAudible=false;}
 sample(now,audible){
  if(this.previous!==null&&this.wasAudible&&audible&&now>=this.previous)this.seconds+=(now-this.previous)/1000;
  this.previous=now;this.wasAudible=audible;return this.seconds;
 }
}

export function supportModeLabel(text,enabled,muted,volume){
 return enabled&&(muted||volume===0)
  ?'SUPPORT ON · MUTED — listening timer paused; no new payment requests. Earlier requests may still complete.'
  :text;
}
export function miningFeeLabel(event){
 const settled=['confirmed','failed'].includes(event.outcome);
 const fee=settled?event.actualFee:(event.feeChosen??event.fee);
 if(!Number.isSafeInteger(fee)||fee<0)return settled?'Mining fee paid: unavailable':'';
 const amount=BigInt(fee),stx=`${amount/1000000n}.${String(amount%1000000n).padStart(6,'0')}`;
 return `Mining fee ${settled?'paid':'selected (not yet confirmed)'}: ${fee} microSTX (${stx} STX)`;
}
