import {clamp} from './util.js';
// One authoritative playback state shared by case tiles, CD deck, turntable, monitors and the mini-player.
export function initPlayback(app){
  const s={rel:null,idx:0,elapsed:0,playing:false,source:null,rate:1,preview:0};
  const cfg=window.XTRATA_SHOP_CONFIG||{},LIMIT=cfg.cdPreviewSeconds===undefined?30:Math.max(0,+cfg.cdPreviewSeconds||0); // CDs are free previews: each song stops after this many seconds of playback (0 = no limit). Vinyl plays in full.
  const P={s,adapterError:null,caseSlot:null,log:[]};app.playback=P;
  P.previewLimit=LIMIT;
  P.adapter=()=>{const a=window.XTRATA_AUDIO_ADAPTER;if(a&&typeof a.play==='function')return a;const c=app.chain;return c&&c.enabled?c.adapter:null;};
  P.payload=()=>s.rel?{release:s.rel,track:s.rel.tracks[s.idx],source:s.source==='cd-case'?'cd case':s.source,offset:s.elapsed,rate:s.rate,playing:s.playing}:null;
  function fail(e){P.adapterError=String(e&&e.message||e);if(!P.warned){P.warned=true;app.toast('Xtrata audio adapter reported an error — continuing with the demo timer.');}app.emit('playback');}
  function call(name){const a=P.adapter(),pl=P.payload();if(!pl)return;P.log.push([name,pl.track.id,pl.source,+pl.offset.toFixed(2),pl.rate,pl.playing]);if(P.log.length>60)P.log.shift();
    if(!a||typeof a[name]!=='function')return;try{const r=a[name](pl);if(r&&typeof r.catch==='function')r.catch(fail);}catch(e){fail(e);}}
  P.status=()=>P.adapter()&&P.adapter().chain?app.chain.status():P.adapter()?(P.adapterError?'Xtrata adapter error ('+P.adapterError+') · demo timer running':'Xtrata Radio adapter connected · authorised playback'):'Demo timer · song audio requires the paid Xtrata Radio adapter. Foley only.';
  P.levels=()=>{const a=P.adapter();if(!a||typeof a.levels!=='function'||!s.playing)return null;try{const l=a.levels();return Array.isArray(l)&&l.length>=2?l:null;}catch(e){return null;}};
  const emit=()=>{surface();app.emit('playback');};
  P.play=(rel,idx,source,offset=0)=>{
    if(source==='cd-deck'&&!app.deck.canPlay())return false;
    if(s.source==='vinyl'&&source!=='vinyl'){if(s.playing)app.vinyl.transport('pause');}
    else if(s.playing)call('pause');
    s.rel=rel;s.idx=clamp(idx,0,rel.tracks.length-1);s.elapsed=clamp(offset,0,rel.tracks[s.idx].seconds);s.source=source;s.rate=1;s.playing=true;s.preview=0;
    if(source==='cd-case')P.caseSlot=app.inspector.item?app.inspector.item.slot:P.caseSlot;
    call('play');emit();return true;};
  P.pause=()=>{if(!s.rel||!s.playing)return;if(s.source==='vinyl')return app.vinyl.transport('pause');s.playing=false;call('pause');emit();};
  P.resume=()=>{if(!s.rel||s.playing)return;if(s.source==='vinyl')return app.vinyl.transport('toggle');if(s.source==='cd-deck'&&!app.deck.canPlay()){app.toast('Close the CD tray with the disc loaded first.');return;}
    if(s.elapsed>=s.rel.tracks[s.idx].seconds-.05)s.elapsed=0;if(LIMIT&&s.preview>=LIMIT)s.preview=0;s.playing=true;call('play');emit();};
  P.toggle=()=>{if(!s.rel)return;if(s.source==='vinyl')return app.vinyl.transport('toggle');s.playing?P.pause():P.resume();};
  P.stop=()=>{if(!s.rel)return;if(s.playing){s.playing=false;call('pause');}s.rel=null;s.source=null;s.elapsed=0;s.idx=0;emit();};
  P.seek=sec=>{if(!s.rel)return;if(s.source==='vinyl')return app.vinyl.transport('seek',sec);s.elapsed=clamp(sec,0,s.rel.tracks[s.idx].seconds-.05);call('seek');emit();};
  P.next=()=>{if(!s.rel)return;if(s.source==='vinyl')return app.vinyl.transport('next');if(s.idx+1>=s.rel.tracks.length)return;const was=s.playing;s.idx++;s.elapsed=0;s.preview=0;call(was?'play':'seek');emit();};
  P.prev=()=>{if(!s.rel)return;if(s.source==='vinyl')return app.vinyl.transport('prev');const was=s.playing;if(s.elapsed<=3&&s.idx>0)s.idx--;s.elapsed=0;s.preview=0;call(was?'play':'seek');emit();};
  let lastSec=-1;
  const tick=()=>{const t=Math.floor(s.elapsed);if(t!==lastSec){lastSec=t;app.emit('tick');}};
  P.update=dt=>{const ch=app.chain;if(!s.playing||s.source==='vinyl'){P.lastNow=0;if(ch&&ch.update)ch.update(dt);return;}
    if(ch&&ch.holding&&ch.holding())return; // wait for the on-chain audio so a preview starts at its first note
    const now=performance.now(),wall=Math.min(2,(now-(P.lastNow||now))/1000);P.lastNow=now;
    s.elapsed+=dt*s.rate;s.preview+=ch&&ch.driving&&ch.driving()?wall:dt;if(ch&&ch.update)ch.update(dt); // real audio is timed by the wall clock, the demo timer by the frame clock
    const len=s.rel.tracks[s.idx].seconds;
    if(LIMIT&&s.preview>=LIMIT&&s.elapsed<len){const t=s.rel.tracks[s.idx];s.playing=false;call('pause');s.elapsed=0;s.preview=0;P.previewEnded=t.id;call('seek');if(app.deck&&s.source==='cd-deck')app.deck.flash('PREVIEW END');app.toast('Free '+LIMIT+'-second preview of “'+t.title+'” finished — play the vinyl to hear the whole song.');emit();return;}
    if(s.elapsed>=len){if(s.idx+1<s.rel.tracks.length){s.idx++;s.elapsed=0;s.preview=0;call('play');emit();}else{s.elapsed=len;s.playing=false;call('pause');s.idx=0;s.elapsed=0;emit();}}
    tick();};
  // vinyl is driven by the physical deck (platter + stylus); the deck reports here
  P.vinylSync=(rel,idx,offset,playing,rate,armed)=>{
    if(s.source!=='vinyl'){if(!playing)return;if(s.playing){s.playing=false;call('pause');}}
    const changed=s.rel!==rel||s.idx!==idx||s.source!=='vinyl',was=s.playing&&!changed,wasRate=s.rate;
    s.rel=rel;s.idx=idx;s.elapsed=offset;s.source='vinyl';s.playing=playing;s.rate=rate;
    if(playing&&(!was||changed))call('play');else if(!playing&&was)call('pause');else if(playing&&Math.abs(rate-wasRate)>1e-6)call('setRate');
    emit();};
  P.vinylTime=(idx,offset)=>{if(s.source==='vinyl'){s.idx=idx;s.elapsed=offset;tick();}};
  P.vinylEnd=()=>{if(s.source==='vinyl'){if(s.playing){s.playing=false;call('pause');}emit();}};
  P.vinylClear=()=>{if(s.source==='vinyl'){if(s.playing){s.playing=false;call('pause');}s.rel=null;s.source=null;s.elapsed=0;s.idx=0;emit();}};

  // ---- Web Audio foley (synthesised, starts only after a user gesture) ----
  let ac=null,noise=null,surf=null,surfGain=null;
  P.ctx=()=>ac;
  app.audioInit=()=>{if(app.chain&&app.chain.unlock)app.chain.unlock();if(ac){if(ac.state==='suspended')ac.resume().catch(()=>{});return;}try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ac=new C();
    noise=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}catch(e){ac=null;}};
  function burst(dur,freq,q,gain,type='bandpass',f2){const n=ac.createBufferSource();n.buffer=noise;const f=ac.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;if(f2)f.frequency.linearRampToValueAtTime(f2,ac.currentTime+dur);
    const g=ac.createGain();g.gain.setValueAtTime(gain,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0005,ac.currentTime+dur);n.connect(f).connect(g).connect(ac.destination);n.start(ac.currentTime,Math.random());n.stop(ac.currentTime+dur+.02);}
  function tone(dur,f0,f1,gain,type='sine'){const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,ac.currentTime);o.frequency.exponentialRampToValueAtTime(f1,ac.currentTime+dur);const g=ac.createGain();g.gain.setValueAtTime(gain,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0005,ac.currentTime+dur);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+dur+.02);}
  app.foley=name=>{P.lastFoley=name;if(!ac||ac.state!=='running')return;try{
    if(name==='click')burst(.035,2600,2,.16);else if(name==='slide')burst(.34,900,.7,.07,'bandpass',2400);else if(name==='pull'){burst(.16,1400,.8,.09);tone(.09,110,60,.12);}
    else if(name==='thud')tone(.13,85,42,.26);else if(name==='tray'){tone(.6,95,120,.03,'sawtooth');burst(.03,1800,2,.08);}
    else if(name==='needle'){tone(.09,140,50,.2);burst(.3,5200,.6,.05,'highpass');}}catch(e){}};
  function surface(){if(!ac||ac.state!=='running')return;const on=s.playing&&s.source==='vinyl';
    if(on&&!surf){surf=ac.createBufferSource();surf.buffer=noise;surf.loop=true;const f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=3800;surfGain=ac.createGain();surfGain.gain.value=.011;surf.connect(f).connect(surfGain).connect(ac.destination);surf.start();}
    else if(!on&&surf){try{surf.stop();}catch(e){}surf=null;}}
  P.qa=()=>({rel:s.rel?s.rel.id:null,trackId:s.rel?s.rel.tracks[s.idx].id:null,idx:s.idx,elapsed:s.elapsed,playing:s.playing,source:s.source,rate:s.rate,preview:s.preview,previewLimit:LIMIT,previewEnded:P.previewEnded||null,status:P.status(),log:P.log.slice(-12),lastFoley:P.lastFoley});
  return P;
}
