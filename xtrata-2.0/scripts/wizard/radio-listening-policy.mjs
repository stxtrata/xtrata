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
