import * as THREE from 'three';
// Shop radio: an ongoing mix of song openings, artist by artist, played quietly through four ceiling speakers.
// Each speaker is a positional Web Audio source heard only within a few metres of it, so you mostly hear the one you are under,
// and each has its own character (two plain, one tinny and breaking up, one with blown tweeters).
// It goes silent whenever a CD (case or player), a record or the Audionaut booth is playing, wherever you are.
export function initRadio(app){
  const cfg=window.XTRATA_SHOP_CONFIG||{},C=app.chain,P=app.playback,cat=app.catalog,{box,cyl,mats:M,scene}=app;
  const R={on:cfg.radio!==false,available:!!(C&&C.enabled),state:'idle',now:null,fails:0};app.radio=R;
  const SP=[[-7.55,3.55,-5.15],[7.55,3.55,-5.15],[-7.55,3.55,5.15],[7.55,3.55,5.15]];
  const SPK=['plain','blown','tinny','plain'];R.characters=SPK;
  const cone=new THREE.MeshStandardMaterial({color:0x2a2a2e,roughness:.6,metalness:.2});
  for(const [x,y,z] of SP){const g=new THREE.Group();g.position.set(x,y,z);g.lookAt(0,1.4,0);scene.add(g);box(g,.3,.44,.24,M.black,0,0,0,{cast:false});
    const w=cyl(g,.105,.105,.02,cone,0,-.07,.125,24);w.rotation.x=Math.PI/2;w.castShadow=false;const t=cyl(g,.04,.04,.02,M.silver,0,.13,.125,16);t.rotation.x=Math.PI/2;t.castShadow=false;box(g,.04,.3,.04,M.black,0,.3,-.06,{cast:false});}
  R.speakers=SP;
  // artist by artist: up to three songs from one artist, then the next; later rounds pick up that artist's other songs
  const by=new Map();for(const r of cat.releases)for(const t of r.tracks){if(t.seconds<10)continue;const k=(r.artist||'Xtrata Music').trim().toLowerCase();if(!by.has(k))by.set(k,[]);by.get(k).push({rel:r,t});}
  const artists=[...by.values()],order=[];for(let round=0;round<6;round++)for(const a of artists){for(let k=0;k<3;k++){const it=a[round*3+k];if(it)order.push(it);else if(round===0)break;}}
  R.order=order;R.qa=()=>({on:R.on,available:R.available,state:R.state,now:R.now?{id:R.now.id,artist:R.now.artist,title:R.now.title}:null,i:idx,queue:order.length,speakers:panners.length,duck:duck,muted:R.muted(),near:R.nearGain(app.camera.position.x,app.camera.position.z).map(v=>+v.toFixed(3)),level:+R.level().toFixed(5),characters:SPK,time:cur?cur.el.currentTime:0,dur:dur,paused:cur?cur.el.paused:true,artists:order.slice(0,8).map(o=>o.rel.artist)});
  let ctx=null,master=null,panners=[],near=[],meter=null,decks=[],cur=null,idx=0,dur=0,busy=false,duck=1,retry=0,started=false;
  const SECS=Math.max(6,+cfg.radioSeconds||32),VOL=cfg.radioVolume==null?.09:Math.max(0,Math.min(1.5,+cfg.radioVolume)),FADE=1.6;
  function setup(){if(ctx)return true;ctx=P.ctx&&P.ctx();if(!ctx||ctx.state!=='running')return (ctx=null,false);
    const bus=ctx.createGain(),hp=ctx.createBiquadFilter(),pk=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=180;hp.Q.value=.7;pk.type='peaking';pk.frequency.value=1900;pk.gain.value=3;pk.Q.value=.9;lp.type='lowpass';lp.frequency.value=7000;
    bus.connect(hp);hp.connect(pk);pk.connect(lp);master=ctx.createGain();master.gain.value=0;lp.connect(master);
    const n=Math.floor(ctx.sampleRate*.7),ir=ctx.createBuffer(2,n,ctx.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6);}
    const cv=ctx.createConvolver(),wet=ctx.createGain();cv.buffer=ir;wet.gain.value=.3;lp.connect(cv);cv.connect(wet);wet.connect(master);
    // each speaker has its own character and is heard mostly close to it (steep exponential roll-off):
    // back-left and front-right are plain, front-left (by the checkout) is cheap, tinny and breaking up,
    // back-right (above the vinyl bench) has blown tweeters, so only a muffled low end gets through.
    const tone=(i,input)=>{let n=input;const f=(type,fr,q,gain)=>{const b=ctx.createBiquadFilter();b.type=type;b.frequency.value=fr;b.Q.value=q;if(gain!=null)b.gain.value=gain;n.connect(b);n=b;return b;};
      const amp=v=>{const a=ctx.createGain();a.gain.value=v;n.connect(a);n=a;return a;};
      if(SPK[i]==='tinny'){f('highpass',1150,.9);f('peaking',2700,1.3,9);amp(3.2);const ws=ctx.createWaveShaper(),N=1024,c=new Float32Array(N);for(let k=0;k<N;k++){const x=k/(N-1)*2-1;c[k]=Math.tanh(4.5*x)/Math.tanh(4.5);}ws.curve=c;ws.oversample='2x';n.connect(ws);n=ws;f('lowpass',5200,.8);amp(.14);}
      else if(SPK[i]==='blown'){f('lowpass',650,.6);f('lowpass',1000,.7);f('peaking',230,1,4);amp(1.25);}
      else{f('highpass',240,.7);f('lowpass',4600,.7);}
      return n;};
    // Distance is handled here, not by the panner: each speaker has its own gain that is full right under it and
    // silent beyond a few metres (see R.update), so you only really hear the speaker you are standing near.
    // The panner (no distance roll-off) just places the sound in the right direction.
    meter=ctx.createAnalyser();meter.fftSize=1024;
    SP.forEach(([x,y,z],i)=>{const dl=ctx.createDelay(.1);dl.delayTime.value=[0,.011,.019,.027][i];const pn=ctx.createPanner();pn.panningModel='HRTF';pn.distanceModel='linear';pn.rolloffFactor=0;pn.refDistance=1;pn.maxDistance=100;
      if(pn.positionX){pn.positionX.value=x;pn.positionY.value=y;pn.positionZ.value=z;}else pn.setPosition(x,y,z);
      const sg=ctx.createGain();sg.gain.value=0;master.connect(dl);tone(i,dl).connect(sg);sg.connect(pn);sg.connect(meter);pn.connect(ctx.destination);panners.push(pn);near.push(sg);});
    for(let i=0;i<2;i++){const el=new Audio();el.crossOrigin='anonymous';el.preload='auto';const g=ctx.createGain();g.gain.value=0;ctx.createMediaElementSource(el).connect(g);g.connect(bus);decks.push({el,g});}
    return true;}
  const ramp=(g,v,t)=>{const n=ctx.currentTime;g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(g.gain.value,n);g.gain.linearRampToValueAtTime(v,n+t);};
  async function next(){if(busy||!R.on||!R.available)return;busy=true;
    try{if(!setup()){busy=false;return;}const it=order[idx%order.length];idx++;const nx=order[idx%order.length];
      C.pins.add(it.t.id);const a=await C.cue(it.t.id,it.t.seconds);if(!a)throw new Error('no cue');
      const d=decks[cur===decks[0]?1:0],old=cur;await new Promise((res,rej)=>{const ok=()=>{off();res();},bad=()=>{off();rej(new Error('decode'));},off=()=>{d.el.removeEventListener('canplay',ok);d.el.removeEventListener('error',bad);};d.el.addEventListener('canplay',ok);d.el.addEventListener('error',bad);d.el.src=a.url;d.el.load();});
      if(!R.on){busy=false;return;}
      d.el.currentTime=0;await d.el.play();ramp(d.g,1,FADE);if(old){ramp(old.g,0,FADE);const oe=old.el,oid=old.id;setTimeout(()=>{oe.pause();if(oid!==it.t.id)C.pins.delete(oid);},FADE*1000+200);}
      d.id=it.t.id;cur=d;dur=Math.min(SECS,(a.safe>=1e8?it.t.seconds:a.safe)-1);R.now={id:it.t.id,artist:it.rel.artist,title:it.t.title,rel:it.rel};R.state='playing';R.fails=0;app.emit('radio');
      if(nx)C.cue(nx.t.id,nx.t.seconds).catch(()=>{});
    }catch(e){R.fails++;if(R.fails>=4){R.state='off-air';retry=45;app.emit('radio');}}
    busy=false;}
  R.toggle=()=>{if(!R.available){app.toast('The shop radio needs a connection to xtrata.xyz.');return;}R.on=!R.on;app.audioInit();
    if(!R.on){if(ctx&&master)ramp(master,0,.5);for(const d of decks)setTimeout(()=>{if(!R.on)d.el.pause();},600);R.state='idle';}else{if(cur&&cur.el.paused&&cur.el.src)cur.el.play().catch(()=>{});started=true;}
    app.toast(R.on?'Shop radio on — playing through the four ceiling speakers.':'Shop radio off.');app.emit('radio');};
  R.start=()=>{started=true;};
  // silent while anything else is playing: a CD (in its case or the CD player), a record, or the Audionaut booth
  R.muted=()=>!!(P.s.playing||(app.booth&&app.booth.playing));
  // how loud each speaker is for someone standing at (px,pz): full within FULL m (horizontally), silent beyond EDGE m
  const FULL=1.2,EDGE=4.5;R.nearGain=(px,pz)=>SP.map(([x,,z])=>{const d=Math.hypot(px-x,pz-z),k=Math.min(1,Math.max(0,1-(d-FULL)/(EDGE-FULL)));return k*k;});
  const buf=new Float32Array(1024);R.level=()=>{if(!meter)return 0;meter.getFloatTimeDomainData(buf);let a=0;for(const v of buf)a+=v*v;return Math.sqrt(a/buf.length);};
  const fwd=new THREE.Vector3(),up=new THREE.Vector3();let lt=0;
  R.update=dt=>{if(!R.available||!started)return;const rd=app.realDt||dt;
    if(R.on){if(R.state==='off-air'){retry-=rd;if(retry<=0){R.fails=0;R.state='idle';}}else if(!busy&&(!cur||cur.el.paused||cur.el.ended||cur.el.currentTime>=dur-FADE))next();}
    if(!ctx)return;
    // silent whenever someone is listening to a CD (in its case or the player), a record or the booth; back up slowly afterwards
    const want=R.on&&!R.muted()?1:0;if(want!==duck){duck=want;master.gain.setTargetAtTime(want*VOL,ctx.currentTime,want<1?.12:1.2);}
    const c=app.camera,l=ctx.listener,ng=R.nearGain(c.position.x,c.position.z);near.forEach((g,i)=>g.gain.setTargetAtTime(ng[i],ctx.currentTime,.12));c.getWorldDirection(fwd);up.set(0,1,0).applyQuaternion(c.quaternion);
    if(l.positionX){const t=ctx.currentTime+.03;l.positionX.linearRampToValueAtTime(c.position.x,t);l.positionY.linearRampToValueAtTime(c.position.y,t);l.positionZ.linearRampToValueAtTime(c.position.z,t);l.forwardX.linearRampToValueAtTime(fwd.x,t);l.forwardY.linearRampToValueAtTime(fwd.y,t);l.forwardZ.linearRampToValueAtTime(fwd.z,t);l.upX.linearRampToValueAtTime(up.x,t);l.upY.linearRampToValueAtTime(up.y,t);l.upZ.linearRampToValueAtTime(up.z,t);}
    else{l.setPosition(c.position.x,c.position.y,c.position.z);l.setOrientation(fwd.x,fwd.y,fwd.z,up.x,up.y,up.z);}};
  return R;
}
