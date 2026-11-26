import * as THREE from 'three';
import {clamp,esc} from './util.js';

// The Audionaut booth: a permanent 9 ft × 6 ft × 8 ft station recessed into the back wall.
// A 16-step sequencer synthesised in the browser (nothing is saved, inscribed or paid for), four Paper Play
// pattern cards on the left wing and four mutable stems on the right wing. It plays through the shop's shared
// AudioContext from a positional source at the console, so it fades as you walk away and the radio ducks under it.
// Set into the back wall: its open front is flush with the wall's inner face (z = -5.5) and the booth sits in an alcove behind it.
export const WALL_Z=-5.5;
export const BOOTH={x:-.6,z:WALL_Z-1.83/2,w:2.74,d:1.83,h:2.44};
export const STUDIO_URL='https://xtrata.xyz/audionaut/';

const TRACKS=[{label:'DRUMS',short:'KCK',color:'#f2b84b'},{label:'PERC',short:'PRC',color:'#58d7e8'},{label:'BASS',short:'BAS',color:'#9b7bff'},{label:'SYNTH',short:'SYN',color:'#ff5fa2'}];
const TEMPOS=[108,120,128,136];
const CARDS=[
  {code:'01',name:'ACID PULSE',sub:'Hypnotic 303-style groove',accent:'#f2b84b',bpm:120,
    steps:[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0],[0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,1],[1,0,1,0,0,1,0,1,1,0,0,1,0,1,1,0],[0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1]],
    bass:[55,55,65.4,55,55,73.4,55,82.4,55,55,65.4,73.4,55,82.4,65.4,49],synth:[220,261.6,329.6,440,329.6,261.6,392,329.6,220,329.6,392,440,523.2,392,329.6,261.6]},
  {code:'02',name:'BREAKBEAT LAB',sub:'Syncopated warehouse drums',accent:'#58d7e8',bpm:128,
    steps:[[1,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0],[0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1],[1,0,0,1,0,0,1,0,1,0,0,0,0,1,0,1],[1,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0]],
    bass:[49,49,55,65.4,49,49,73.4,49,49,55,65.4,49,55,65.4,73.4,82.4],synth:[293.7,349.2,440,523.2,293.7,349.2,440,587.3,349.2,440,523.2,440,392,349.2,329.6,293.7]},
  {code:'03',name:'COSMIC ARPS',sub:'Shimmering orbital arpeggio',accent:'#9b7bff',bpm:120,
    steps:[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1],[1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,1],[1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1]],
    bass:[65.4,65.4,65.4,65.4,73.4,73.4,82.4,73.4,55,55,55,55,49,55,65.4,73.4],synth:[261.6,329.6,392,523.2,329.6,392,523.2,659.3,220,261.6,329.6,440,293.7,392,440,587.3]},
  {code:'04',name:'DUB CHORDS',sub:'Deep sub and echoing stabs',accent:'#ff5fa2',bpm:108,
    steps:[[1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],[0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,1],[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0],[0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0]],
    bass:[43.65,43.65,49,55,43.65,43.65,65.4,43.65,43.65,55,49,43.65,55,49,43.65,38.89],synth:[196,233.1,293.7,349.2,196,233.1,293.7,392,233.1,293.7,349.2,293.7,261.6,233.1,196,174.6]}];
// console screen canvas layout (px)
const CW=768,CH=480,GL=100,GT=86,CEW=40,CEH=56,RG=10,FY=362;

export function initBooth(app){
  const {scene,art,mats:M,box}=app,F=art.font,P=app.playback;
  const {w:W,d:D,h:H}=BOOTH;
  app.STUDIO_URL=STUDIO_URL;
  const B={playing:false,step:-1,card:0,bpm:120,grid:[],bass:[],synth:[],muted:[false,false,false,false],levels:[0,0,0,0],hoverCell:null,dirty:true};app.booth=B;
  const g=new THREE.Group();g.position.set(BOOTH.x,0,BOOTH.z);scene.add(g);B.root=g;
  const basic=(c)=>new THREE.MeshBasicMaterial({color:c,toneMapped:false});
  const lit=(tex,e=.35)=>new THREE.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:0xffffff,emissiveIntensity:e,roughness:.5});
  const nc=o=>{o.castShadow=false;return o;};
  // ---- structure ----
  nc(box(g,W,.06,D,M.matte,0,.03,0));
  nc(box(g,W-.16,.012,.016,basic(0xf2b84b),0,.062,D/2-.02,{cast:false}));
  for(const sx of [-1,1])for(const sz of [-1,1])nc(box(g,.08,H,.08,M.black,sx*(W/2-.04),H/2,sz*(D/2-.04)));
  nc(box(g,W,.08,D,M.black,0,H-.04,0,{cast:false}));
  nc(box(g,W-.08,H-.12,.06,M.dark,0,H/2,-D/2+.05,{cast:false}));
  for(const sx of [-1,1])nc(box(g,.06,H-.12,D-.16,M.dark,sx*(W/2-.05),H/2,-.02,{cast:false}));
  nc(box(g,.015,H-.45,.015,basic(0x58d7e8),-(W/2-.085),H/2-.08,D/2-.035,{cast:false}));
  nc(box(g,.015,H-.45,.015,basic(0x9b7bff),W/2-.085,H/2-.08,D/2-.035,{cast:false}));
  const lamp=new THREE.PointLight(0xffdcb4,5.5,3.6,1.6);lamp.position.set(0,H-.3,.25);g.add(lamp);
  // header fascia + 16-step LED bar
  nc(box(g,W-.02,.34,.12,M.black,0,H-.17,D/2-.06,{cast:false}));
  const signTex=art.panel(1400,220,(x,w,h)=>{const bg=x.createLinearGradient(0,0,w,0);bg.addColorStop(0,'#120e0b');bg.addColorStop(.5,'#1d1611');bg.addColorStop(1,'#120e0b');x.fillStyle=bg;x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(242,184,75,.55)';x.lineWidth=4;x.strokeRect(10,10,w-20,h-20);
    x.beginPath();x.arc(92,106,36,0,Math.PI*2);x.strokeStyle='#f2b84b';x.lineWidth=7;x.stroke();x.beginPath();x.arc(92,106,14,0,Math.PI*2);x.fillStyle='#58d7e8';x.fill();
    x.textBaseline='middle';x.fillStyle='#fff6e2';x.font=`800 76px ${F}`;x.fillText('THE AUDIONAUT',158,86);const tw=x.measureText('THE AUDIONAUT').width;
    x.fillStyle='#f2b84b';x.font=`700 26px ${F}`;x.fillText('STEP UP AND PLAY',Math.min(w-300,190+tw),90);
    x.fillStyle='#58d7e8';x.font=`700 30px ${F}`;x.fillText('BLOCKCHAIN AUDIONAL WORK-SPACE-STATION  ·  16-STEP SEQUENCER',160,160);});
  app.plane(g,W-.12,.28,new THREE.MeshBasicMaterial({map:signTex,toneMapped:false}),0,H-.16,D/2+.002);
  const ledW=(W-.32)/16,leds=new THREE.InstancedMesh(new THREE.BoxGeometry(ledW-.025,.022,.022),new THREE.MeshBasicMaterial({toneMapped:false}),16);
  const m4=new THREE.Matrix4(),col=new THREE.Color();
  for(let i=0;i<16;i++){m4.makeTranslation(-(W-.32)/2+ledW*(i+.5),H-.355,D/2-.02);leds.setMatrixAt(i,m4);leds.setColorAt(i,col.set(0x22180f));}
  g.add(leds);
  // ---- console ----
  const cg=new THREE.Group();cg.position.set(0,.06,.06);g.add(cg);
  box(cg,1.18,.84,.56,M.black,0,.42,0);
  nc(box(cg,1.06,.016,.015,basic(0xf2b84b),0,.78,.285,{cast:false}));
  const deck=nc(box(cg,1.22,.1,.62,M.matte,0,.88,.02,{cast:false}));deck.rotation.x=.26;
  const scr=art.panel(CW,CH,()=>{});B.screenTex=scr;
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(.92,.56),new THREE.MeshBasicMaterial({map:scr,toneMapped:false}));screen.position.set(0,.99,-.04);screen.rotation.x=-Math.PI/2+.38;cg.add(screen);
  const btns={};
  [['play','PLAY / STOP',0xf2b84b],['tempo','TEMPO',0x58d7e8],['reset','RESET CARD',0x9b7bff]].forEach(([id,label,c],i)=>{const bg=new THREE.Group();bg.position.set(-.28+i*.28,.895,.25);bg.rotation.x=.26;cg.add(bg);
    nc(box(bg,.19,.025,.085,M.black,0,0,0,{cast:false}));
    const cm=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.8,roughness:.25});const cap=nc(box(bg,.165,.032,.065,cm,0,.014,0,{cast:false}));cap.userData.btn=id;cap.userData.y0=.014;
    const lt=art.panel(256,96,(x,w,h)=>{x.clearRect(0,0,w,h);x.font=`800 30px ${F}`;x.fillStyle='#120d09';x.textAlign='center';x.textBaseline='middle';x.fillText(label,w/2,h/2+2);});
    const lp=new THREE.Mesh(new THREE.PlaneGeometry(.16,.06),new THREE.MeshBasicMaterial({map:lt,transparent:true,toneMapped:false}));lp.rotation.x=-Math.PI/2;lp.position.y=.0312;bg.add(lp);
    btns[id]={cap,mat:cm,c,press:0};});
  // ---- left wing: Paper Play cards ----
  const label=(t,s,c)=>art.panel(512,160,(x,w,h)=>{x.fillStyle='#16110d';x.fillRect(0,0,w,h);x.fillStyle=c;x.fillRect(0,0,14,h);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=3;x.strokeRect(2,2,w-4,h-4);
    x.font=`800 44px ${F}`;x.fillStyle='#fff6e2';x.textBaseline='alphabetic';x.fillText(t,34,72);x.font=`700 22px ${F}`;x.fillStyle=c;x.fillText(s,34,120);});
  const lw=new THREE.Group();lw.position.set(-W/2+.11,0,-.04);lw.rotation.y=Math.PI/2;g.add(lw);
  app.plane(lw,1.18,.24,lit(label('PAPER PLAY','CLICK A CARD TO LOAD ITS PATTERN','#58d7e8'),.5),0,1.94,.01);
  nc(box(lw,1.36,.04,.22,M.black,0,1.0,.1,{cast:false}));
  const cardTex=card=>art.panel(512,680,(x,w,h)=>{x.fillStyle='#17130f';x.fillRect(0,0,w,h);x.fillStyle=card.accent;x.fillRect(0,0,w,18);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=4;x.strokeRect(14,28,w-28,h-42);
    x.textBaseline='alphabetic';x.font=`800 22px ${F}`;x.fillStyle=card.accent;x.fillText('PAPER PLAY · CARD '+card.code,36,78);x.font=`800 40px ${F}`;x.fillStyle='#fff6e2';x.fillText(card.name,36,130);
    x.font=`500 21px ${F}`;x.fillStyle='#bfae95';x.fillText(card.sub,36,168);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(36,192,140,38);x.font=`800 20px ${F}`;x.fillStyle='#efe3cc';x.fillText(card.bpm+' BPM',58,218);
    for(let r=0;r<4;r++){x.font=`800 15px ${F}`;x.fillStyle=TRACKS[r].color;x.fillText(TRACKS[r].label,36,268+r*82-8);
      for(let c=0;c<16;c++){const on=card.steps[r][c];x.fillStyle=on?TRACKS[r].color:(c%4===0?'#2b241d':'#211b16');x.fillRect(36+c*27.5,268+r*82,23.5,44);if(on){x.fillStyle='rgba(255,255,255,.45)';x.fillRect(40+c*27.5,272+r*82,15.5,6);}}}
    x.fillStyle='rgba(255,255,255,.06)';x.fillRect(36,598,440,44);x.font=`700 18px ${F}`;x.fillStyle='#efe3cc';x.fillText('▶ CLICK TO LOAD THIS PATTERN',72,626);});
  const cards=CARDS.map((card,i)=>{const h=new THREE.Group();h.position.set(-.465+i*.31,1.24,.11);h.rotation.x=-.18;lw.add(h);
    const front=lit(cardTex(card),.3),body=new THREE.Mesh(new THREE.BoxGeometry(.26,.36,.014),M.black);body.userData.card=i;h.add(body);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(.256,.356),front);mesh.position.z=.0072;mesh.userData.card=i;h.add(mesh);
    const gm=new THREE.MeshBasicMaterial({color:new THREE.Color(card.accent),transparent:true,opacity:0,toneMapped:false}),glow=new THREE.Mesh(new THREE.PlaneGeometry(.285,.385),gm);glow.position.z=-.009;h.add(glow);
    return {h,mesh,body,front,gm};});
  // ---- right wing: stems ----
  const rw=new THREE.Group();rw.position.set(W/2-.11,0,-.04);rw.rotation.y=-Math.PI/2;g.add(rw);
  app.plane(rw,1.18,.24,lit(label('STEMS','CLICK A PART TO MUTE OR UNMUTE IT','#9b7bff'),.5),0,1.94,.01);
  nc(box(rw,1.24,.96,.03,M.matte,0,1.28,.02,{cast:false}));
  const rootM=basic(0xf2b84b),root=new THREE.Mesh(new THREE.SphereGeometry(.045,20,14),rootM);root.position.set(0,.92,.06);rw.add(root);
  const stems=TRACKS.map((t,i)=>{const bx=i%2?.3:-.3,by=i<2?1.54:1.18,c=new THREE.Color(t.color);
    const sx=Math.sign(bx)*(i<2?.045:.02),ex=Math.sign(bx)*.07; // fibre runs up the centre gap and into the block's inner edge
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.92,.055),new THREE.Vector3(sx,.99,.055),new THREE.Vector3(sx,by-.06,.055),new THREE.Vector3(ex,by,.055)]);
    const pm=new THREE.MeshBasicMaterial({color:c.clone(),toneMapped:false});rw.add(new THREE.Mesh(new THREE.TubeGeometry(curve,16,.008,8,false),pm));
    const tex=art.panel(512,160,(x,w,h)=>{const m=B.muted[i];x.fillStyle=m?'#120f0c':'#1a140f';x.fillRect(0,0,w,h);x.fillStyle=m?'#4a4038':t.color;x.fillRect(0,0,14,h);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=3;x.strokeRect(2,2,w-4,h-4);
      x.font=`800 48px ${F}`;x.fillStyle=m?'#7d7064':'#fff6e2';x.textBaseline='alphabetic';x.fillText(t.label,34,74);x.font=`700 24px ${F}`;x.fillStyle=m?'#d0604f':t.color;x.fillText(m?'MUTED · CLICK TO UNMUTE':'STEM '+(i+1)+' · LIVE',34,124);});
    const fm=lit(tex,.55),sm=new THREE.MeshStandardMaterial({color:0x221a14,emissive:c,emissiveIntensity:.45,roughness:.4});
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(.48,.22,.065),sm);mesh.position.set(bx,by,.068);mesh.userData.stem=i;rw.add(mesh);const face=new THREE.Mesh(new THREE.PlaneGeometry(.476,.216),fm);face.position.z=.0331;face.userData.stem=i;mesh.add(face);
    return {mesh,face,tex,fm,sm,pm,c};});
  // ---- back wall panel ----
  nc(box(g,1.78,.72,.03,M.black,0,1.66,-D/2+.095,{cast:false}));
  const aboutTex=art.panel(1024,410,(x,w,h)=>{x.fillStyle='#15100c';x.fillRect(0,0,w,h);x.fillStyle='#f2b84b';x.fillRect(0,0,w,10);
    x.textBaseline='alphabetic';x.font=`800 26px ${F}`;x.fillStyle='#58d7e8';x.fillText('XTRATA MUSIC · IN-STORE STATION',44,62);
    x.font=`800 64px ${F}`;x.fillStyle='#fff6e2';x.fillText('THE AUDIONAUT',44,138);
    x.font=`600 28px ${F}`;x.fillStyle='#e6d6bb';
    ['Pick a Paper Play card, change any step on the console,','mute a stem. Everything is synthesised live in your browser —','nothing here is saved, inscribed or paid for.'].forEach((l,i)=>x.fillText(l,44,198+i*40));
    x.fillStyle='rgba(255,255,255,.07)';x.fillRect(44,330,w-88,52);x.font=`800 24px ${F}`;x.fillStyle='#f2b84b';x.fillText('THE FULL STUDIO: XTRATA.XYZ/AUDIONAUT  ·  CLICK FOR DETAILS →',70,364);});
  const about=app.plane(g,1.7,.68,lit(aboutTex,.5),0,1.66,-D/2+.112);about.userData.about=true;
  // ---- the booth is behind the wall line, so the room's own bounds keep you at its open front; occluders stop picks through its walls ----
  const wx0=BOOTH.x-W/2,wx1=BOOTH.x+W/2,wz1=BOOTH.z+D/2;
  for(const sx of [-1,1])app.addOccluder(.06,H-.12,D-.16,BOOTH.x+sx*(W/2-.05),H/2,BOOTH.z-.02);
  app.addOccluder(1.18,.84,.56,BOOTH.x,.48,BOOTH.z+.06);app.addOccluder(W,.34,.12,BOOTH.x,H-.17,wz1-.06);
  // ---- sequencer state ----
  function loadCard(i,quiet){B.card=i;const c=CARDS[i];B.grid=c.steps.map(r=>r.slice());B.bass=c.bass.slice();B.synth=c.synth.slice();B.bpm=c.bpm;B.dirty=true;if(!quiet){app.foley('click');app.toast('Loaded Paper Play card '+c.code+' — '+c.name+' ('+c.bpm+' BPM).');}panel();}
  loadCard(0,true);
  // ---- audio (shared AudioContext, positional output) ----
  let ac=null,out=null,pan=null,dly=null,noise=null,timer=null,nextT=0,sched=0,queue=[],acc=0;
  const cpos=new THREE.Vector3(0,1.05,.1);
  function setup(){if(out)return true;app.audioInit();ac=P.ctx&&P.ctx();if(!ac)return false;if(ac.state==='suspended')ac.resume().catch(()=>{});
    try{out=ac.createGain();out.gain.value=.5;pan=ac.createPanner();pan.panningModel='HRTF';pan.distanceModel='inverse';pan.refDistance=1.8;pan.rolloffFactor=1.35;pan.maxDistance=40;
      const wp=g.localToWorld(cpos.clone());if(pan.positionX){pan.positionX.value=wp.x;pan.positionY.value=wp.y;pan.positionZ.value=wp.z;}else pan.setPosition(wp.x,wp.y,wp.z);
      out.connect(pan);pan.connect(ac.destination);
      dly=ac.createDelay(1);dly.delayTime.value=.25;const fb=ac.createGain();fb.gain.value=.28;const lp2=ac.createBiquadFilter();lp2.type='lowpass';lp2.frequency.value=2600;dly.connect(lp2);lp2.connect(fb);fb.connect(dly);lp2.connect(out);
      noise=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}catch(e){out=null;return false;}
    return true;}
  const env=(gn,t,v,len)=>{gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+len);};
  function kick(t){const o=ac.createOscillator(),gn=ac.createGain();o.type='sine';o.frequency.setValueAtTime(145,t);o.frequency.exponentialRampToValueAtTime(42,t+.09);o.frequency.exponentialRampToValueAtTime(28,t+.24);env(gn,t,.95,.28);o.connect(gn);gn.connect(out);o.start(t);o.stop(t+.3);}
  function perc(t,snare){const s=ac.createBufferSource();s.buffer=noise;const f=ac.createBiquadFilter();f.type=snare?'bandpass':'highpass';f.frequency.setValueAtTime(snare?1400:6800,t);f.Q.value=snare?.9:1.4;const gn=ac.createGain();env(gn,t,snare?.42:.18,snare?.16:.055);
    s.connect(f);f.connect(gn);gn.connect(out);s.start(t,Math.random()*.5);s.stop(t+(snare?.18:.065));
    if(snare){const o=ac.createOscillator(),tg=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(195,t);o.frequency.exponentialRampToValueAtTime(110,t+.08);env(tg,t,.24,.1);o.connect(tg);tg.connect(out);o.start(t);o.stop(t+.11);}}
  function bass(t,fq){const o=ac.createOscillator(),f=ac.createBiquadFilter(),gn=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(fq,t);f.type='lowpass';f.Q.value=6.5;f.frequency.setValueAtTime(980,t);f.frequency.exponentialRampToValueAtTime(160,t+.19);env(gn,t,.36,.22);o.connect(f);f.connect(gn);gn.connect(out);o.start(t);o.stop(t+.24);}
  function synth(t,fq){const a=ac.createOscillator(),b=ac.createOscillator(),f=ac.createBiquadFilter(),gn=ac.createGain();a.type='triangle';b.type='sawtooth';a.frequency.setValueAtTime(fq,t);b.frequency.setValueAtTime(fq*1.005,t);
    f.type='lowpass';f.Q.value=2.2;f.frequency.setValueAtTime(2400,t);f.frequency.exponentialRampToValueAtTime(520,t+.26);env(gn,t,.18,.28);a.connect(f);b.connect(f);f.connect(gn);gn.connect(out);gn.connect(dly);a.start(t);b.start(t);a.stop(t+.3);b.stop(t+.3);}
  function trigger(s,t){try{if(B.grid[0][s]&&!B.muted[0])kick(t);if(B.grid[1][s]&&!B.muted[1])perc(t,s%8===4);if(B.grid[2][s]&&!B.muted[2])bass(t,B.bass[s]||55);if(B.grid[3][s]&&!B.muted[3])synth(t,B.synth[s]||261.6);}catch(e){}}
  function tick(){if(!B.playing||!out)return;if(nextT<ac.currentTime-.25){nextT=ac.currentTime+.05;queue=[];}
    while(nextT<ac.currentTime+.12){trigger(sched,nextT);queue.push([sched,nextT]);nextT+=60/B.bpm/4;sched=(sched+1)%16;}}
  B.audio=()=>!!(out&&ac&&ac.state==='running');
  function setStep(s){B.step=s;if(s>=0)for(let r=0;r<4;r++)if(B.grid[r][s]&&!B.muted[r])B.levels[r]=1;B.dirty=true;head();}
  B.start=()=>{if(B.playing)return;setup();if(P.s.playing&&P.s.source!=='vinyl'){P.pause();app.toast('Paused the CD so you can hear the booth.');}else if(P.s.playing){P.pause();app.toast('Paused the turntable so you can hear the booth.');}
    B.playing=true;sched=0;queue=[];acc=0;B.step=-1;if(out){nextT=ac.currentTime+.06;tick();clearInterval(timer);timer=setInterval(tick,25);}
    btns.play.mat.color.setHex(0x35d07f);btns.play.mat.emissive.setHex(0x35d07f);B.dirty=true;panel();app.emit('booth');};
  B.stop=(msg)=>{if(!B.playing)return;B.playing=false;clearInterval(timer);timer=null;queue=[];setStep(-1);btns.play.mat.color.setHex(0xf2b84b);btns.play.mat.emissive.setHex(0xf2b84b);if(msg)app.toast(msg);panel();app.emit('booth');};
  B.toggle=()=>{app.foley('click');if(B.playing)B.stop();else B.start();};
  B.tempo=()=>{const i=(TEMPOS.indexOf(B.bpm)+1)%TEMPOS.length;B.bpm=TEMPOS[i<0?0:i];app.foley('click');B.dirty=true;panel();};
  B.loadCard=i=>{loadCard(clamp(i|0,0,3));if(!B.playing)B.start();};
  B.reset=()=>loadCard(B.card);
  B.clear=()=>{B.grid=B.grid.map(r=>r.map(()=>0));B.dirty=true;app.foley('click');panel();};
  B.toggleStep=(r,c)=>{B.grid[r][c]=B.grid[r][c]?0:1;B.dirty=true;app.foley('click');panel();};
  B.toggleMute=r=>{B.muted[r]=!B.muted[r];const s=stems[r];redrawStem(r);s.sm.emissiveIntensity=B.muted[r]?.04:.45;s.pm.color.copy(B.muted[r]?new THREE.Color(0x3a322b):s.c);s.mesh.position.z=B.muted[r]?.048:.068;
    app.foley('click');B.dirty=true;panel();app.toast(TRACKS[r].label+(B.muted[r]?' muted.':' back in.'));};
  function redrawStem(r){const s=stems[r];const c=s.tex.userData.canvas,x=c.getContext('2d'),t=TRACKS[r],m=B.muted[r],w=c.width,h=c.height;
    x.fillStyle=m?'#120f0c':'#1a140f';x.fillRect(0,0,w,h);x.fillStyle=m?'#4a4038':t.color;x.fillRect(0,0,14,h);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=3;x.strokeRect(2,2,w-4,h-4);
    x.font=`800 48px ${F}`;x.fillStyle=m?'#7d7064':'#fff6e2';x.textBaseline='alphabetic';x.fillText(t.label,34,74);x.font=`700 24px ${F}`;x.fillStyle=m?'#d0604f':t.color;x.fillText(m?'MUTED · CLICK TO UNMUTE':'STEM '+(r+1)+' · LIVE',34,124);s.tex.needsUpdate=true;}
  // music elsewhere in the shop takes over from the booth
  app.on('playback',()=>{if(P.s.playing&&B.playing)B.stop('Booth stopped — a record is playing.');});
  B.loud=()=>{if(!B.playing)return false;const p=app.camera.position;return Math.hypot(p.x-BOOTH.x,p.z-(BOOTH.z+.1))<6;};
  // ---- console screen ----
  function draw(){const x=scr.userData.canvas.getContext('2d'),card=CARDS[B.card];
    x.fillStyle='#090706';x.fillRect(0,0,CW,CH);x.fillStyle='#17110c';x.fillRect(0,0,CW,62);x.fillStyle='#f2b84b';x.fillRect(0,60,CW,3);
    x.textBaseline='alphabetic';x.textAlign='left';x.font=`800 24px ${F}`;x.fillStyle='#fff6e2';x.fillText(`${card.code}  ${card.name}`,20,40);
    x.textAlign='right';x.font=`800 22px ${F}`;x.fillStyle=B.playing?'#35d07f':'#f2b84b';x.fillText(B.playing?'● PLAYING':'■ READY',600,40);x.fillStyle='#58d7e8';x.fillText(B.bpm+' BPM',748,40);x.textAlign='left';
    for(let r=0;r<4;r++){const y=GT+r*(CEH+RG),t=TRACKS[r],m=B.muted[r];x.fillStyle=m?'#15110e':'#1d1712';x.fillRect(18,y,72,CEH);x.fillStyle=m?'#4a4038':t.color;x.fillRect(18,y,6,CEH);
      x.font=`800 17px ${F}`;x.fillStyle=m?'#7d7064':'#fff6e2';x.fillText(t.short,32,y+26);x.font=`700 12px ${F}`;x.fillStyle=m?'#d0604f':'#bfae95';x.fillText(m?'MUTE':'LIVE',32,y+46);
      for(let c=0;c<16;c++){const cx=GL+c*CEW,on=B.grid[r][c],hd=B.step===c;x.fillStyle=on?(m?'#3d342c':t.color):(c%4===0?'#231c16':'#18130f');x.fillRect(cx,y,CEW-5,CEH);
        if(hd){x.fillStyle=on?'rgba(255,255,255,.42)':'rgba(88,215,232,.22)';x.fillRect(cx,y,CEW-5,CEH);x.strokeStyle='#fff';x.lineWidth=2.5;x.strokeRect(cx+1.5,y+1.5,CEW-8,CEH-3);}
        const hv=B.hoverCell;if(hv&&hv[0]===r&&hv[1]===c){x.strokeStyle='#f2b84b';x.lineWidth=3;x.strokeRect(cx+1.5,y+1.5,CEW-8,CEH-3);}
        if(r===0&&c%4===0){x.fillStyle=hd?'#fff':'#6b5d4f';x.fillRect(cx+12,GT-12,12,3);}}}
    x.fillStyle='#120e0b';x.fillRect(18,FY,CW-36,104);x.strokeStyle='rgba(255,255,255,.1)';x.lineWidth=2;x.strokeRect(18,FY,CW-36,104);
    for(let t=0;t<4;t++){const bx=34+t*66,lv=B.muted[t]?.04:Math.max(.06,B.levels[t]),bh=lv*62;x.fillStyle='#1d1712';x.fillRect(bx,FY+12,46,62);x.fillStyle=TRACKS[t].color;x.fillRect(bx,FY+12+62-bh,46,bh);x.font=`700 11px ${F}`;x.fillStyle='#d8c9b0';x.fillText(TRACKS[t].label,bx+2,FY+92);}
    const e=B.playing?B.levels[0]*20+B.levels[2]*14+B.levels[3]*10+5:3,ph=performance.now()*.012;x.beginPath();x.strokeStyle='#58d7e8';x.lineWidth=2.5;
    for(let i=0;i<=90;i++){const px=318+i/90*420,en=Math.sin(i/90*Math.PI),py=FY+52+Math.sin(i*.32+ph)*e*en+Math.cos(i*.72-ph*1.4)*e*.4*en;if(i)x.lineTo(px,py);else x.moveTo(px,py);}x.stroke();
    if(!B.audio()&&B.playing){x.font=`700 12px ${F}`;x.fillStyle='#bfae95';x.textAlign='right';x.fillText('SOUND STARTS AFTER YOUR NEXT CLICK',748,FY+98);x.textAlign='left';}
    scr.needsUpdate=true;B.dirty=false;}
  scr.userData.redraw=draw;
  function leds_(){for(let i=0;i<16;i++)leds.setColorAt(i,col.set(B.playing&&i===B.step?0xffe2a8:i%4===0?0x5a3b12:0x1d2a2c));leds.instanceColor.needsUpdate=true;}
  // ---- free interaction: everything is aimed at with the centre dot while you walk around; nothing locks the view ----
  const press=id=>{btns[id].press=.14;if(id==='play')B.toggle();else if(id==='tempo')B.tempo();else if(id==='reset')B.reset();};
  app.addPick(screen,{id:'booth:screen',reach:3.3,resolve(h){const card=CARDS[B.card];if(!h.uv)return null;const px=h.uv.x*CW,py=(1-h.uv.y)*CH,r=Math.floor((py-GT)/(CEH+RG)),inRow=r>=0&&r<4&&(py-GT)-r*(CEH+RG)<=CEH;
    if(inRow&&px>=18&&px<=90){const t=TRACKS[r],m=B.muted[r];return {id:`booth:mute:${r}:${m}`,title:t.label+(m?' — muted':' — live'),sub:'Audionaut console',hint:'Click to '+(m?'unmute':'mute')+' it',click:()=>B.toggleMute(r)};}
    const c=Math.floor((px-GL)/CEW);
    if(inRow&&c>=0&&c<16&&(px-GL)-c*CEW<=CEW-5){const t=TRACKS[r],on=!!B.grid[r][c];return {id:`booth:cell:${r}:${c}:${on}`,title:`${t.label} · step ${c+1}`,sub:on?'On':'Off',hint:'Click to switch it '+(on?'off':'on'),click:()=>B.toggleStep(r,c),hover:v=>{B.hoverCell=v?[r,c]:null;B.dirty=true;}};}
    return {id:'booth:screen:'+B.playing,title:'The Audionaut console',sub:`${card.code} ${card.name} · ${B.bpm} BPM · ${B.playing?'playing':'ready'}`,hint:'Aim at a step and click to change it'};}});
  const BTN={play:['Play / Stop',()=>B.playing?'Playing — click to stop':'Click to start the sequencer'],tempo:['Tempo',()=>`${B.bpm} BPM — click for the next tempo`],reset:['Reset card',()=>'Put the current card’s pattern back']};
  for(const id in btns)app.addPick(btns[id].cap,{id:'booth:btn:'+id,resolve:()=>({id:`booth:btn:${id}:${B.playing}:${B.bpm}`,title:BTN[id][0],sub:'Audionaut console',hint:BTN[id][1](),click:()=>press(id)})});
  cards.forEach((c,i)=>{const pk={id:'booth:card:'+i,resolve:()=>{const k=CARDS[i],cur=i===B.card;return {id:`booth:card:${i}:${cur}`,title:`Paper Play ${k.code} — ${k.name}`,sub:`${k.sub} · ${k.bpm} BPM`,hint:cur?'Loaded — click to start it again from the card':'Click to load this pattern',click:()=>B.loadCard(i)};}};
    app.addPick(c.mesh,pk);app.addPick(c.body,pk);});
  stems.forEach((st,r)=>{const pk={id:'booth:stem:'+r,resolve:()=>{const m=B.muted[r];return {id:`booth:stem:${r}:${m}`,title:TRACKS[r].label+' stem',sub:m?'Muted':'Live',hint:'Click to '+(m?'unmute':'mute')+' it',click:()=>B.toggleMute(r)};}};
    app.addPick(st.mesh,pk);app.addPick(st.face,pk);});
  app.addPick(about,{id:'booth:about',title:'The Audionaut',sub:'In-store station · nothing saved, inscribed or paid for',hint:'Click for details and the link to the full studio',click:()=>app.ui.openBooth()});
  // ---- station panel: shown bottom-left while you are at the booth, hidden when you walk away ----
  const $st=()=>document.getElementById('station');
  B.near=()=>{const p=app.player;return app.state.entered&&app.state.mode==='room'&&!app.state.modal&&p.x>wx0-.7&&p.x<wx1+.7&&p.z<wz1+1.7;};
  function head(){const el=$st();if(!el||el.hidden)return;for(const b of el.querySelectorAll('.bc[data-c]'))b.classList.toggle('hd',+b.dataset.c===B.step);}
  function panel(){if(!B.near||!B.near())return;const card=CARDS[B.card],narrow=innerWidth<760||innerHeight>innerWidth;
    const grid=narrow?'':`<div class="bgrid">${TRACKS.map((t,r)=>`<div class="br"><button data-s="mute:${r}" class="bl${B.muted[r]?' off':''}" style="--c:${t.color}" aria-pressed="${!B.muted[r]}" title="${B.muted[r]?'Unmute':'Mute'} ${t.label}">${t.short}</button>${B.grid[r].map((on,c)=>`<button data-s="cell:${r}:${c}" data-c="${c}" class="bc${on?' on':''}${c%4===0?' q':''}" style="--c:${t.color}" aria-label="${t.label} step ${c+1} ${on?'on':'off'}" aria-pressed="${!!on}"></button>`).join('')}</div>`).join('')}</div>`;
    app.ui.station(`<div data-booth></div><h3>The Audionaut <span class="dim small">${B.playing?'playing':'ready'}</span></h3><p class="step">${esc(card.code+' '+card.name)} · ${B.bpm} BPM</p>${grid}
<div class="btns"><button data-s="play" class="gold">${B.playing?'■ Stop':'▶ Play'}</button><button data-s="tempo">Tempo ${B.bpm}</button><button data-s="reset">Reset card</button>${narrow?'':'<button data-s="clear">Clear</button>'}<button data-s="about">About</button></div>
<div class="btns bcards">${CARDS.map((c,i)=>`<button data-s="card:${i}" class="${i===B.card?'on':''}" aria-pressed="${i===B.card}" title="${esc(c.sub)}">${narrow?c.code:c.code+' '+esc(c.name)}</button>`).join('')}</div>
${narrow?'':'<p class="dim small">Aim the centre dot at the console, the cards or the stems and click. Free the pointer (Esc) to use this panel.</p>'}`,act);
    document.body.classList.add('booth-near');head();}
  B.panel=panel;
  function act(a){if(a==='play')return press('play');if(a==='tempo')return press('tempo');if(a==='reset')return press('reset');if(a==='clear')return B.clear();if(a==='about')return app.ui.openBooth();
    const [k,p,q]=a.split(':');if(k==='mute')B.toggleMute(+p);else if(k==='cell')B.toggleStep(+p,+q);else if(k==='card')B.loadCard(+p);}
  let wasNear=false;
  function nearCheck(){const n=B.near();if(n&&!wasNear)panel();else if(!n&&wasNear){document.body.classList.remove('booth-near');const el=$st();if(el&&!el.hidden&&el.querySelector('[data-booth]'))app.ui.stationHide();if(B.hoverCell){B.hoverCell=null;B.dirty=true;}}wasNear=n;}
  app.on('mode',()=>{wasNear=false;});addEventListener('resize',()=>{if(wasNear)panel();});
  // world position of a part, for tests and the quick-jump
  B.world=(what,a,b)=>{const p=new THREE.Vector3();if(what==='cell'){const u=(GL+b*CEW+(CEW-5)/2)/CW,v=1-(GT+a*(CEH+RG)+CEH/2)/CH;p.set((u-.5)*.92,(v-.5)*.56,0);screen.localToWorld(p);}
    else if(what==='label'){const v=1-(GT+a*(CEH+RG)+CEH/2)/CH;p.set((54/CW-.5)*.92,(v-.5)*.56,0);screen.localToWorld(p);}
    else if(what==='btn'){btns[a].cap.getWorldPosition(p);p.y+=.016;}else if(what==='card')cards[a].mesh.getWorldPosition(p);else if(what==='stem')stems[a].face.getWorldPosition(p);else if(what==='about')about.getWorldPosition(p);else screen.getWorldPosition(p);
    return {x:p.x,y:p.y,z:p.z};};
  // ---- per frame ----
  let since=0;const fwd=new THREE.Vector3(),up=new THREE.Vector3();
  B.update=dt=>{const rd=app.realDt||dt;nearCheck();
    if(B.playing){if(out&&ac.state==='running'){tick();while(queue.length&&queue[0][1]<=ac.currentTime+.012)setStep(queue.shift()[0]);}
      else{acc+=rd;const s16=60/B.bpm/4;if(acc>s16*4)acc=s16;while(acc>=s16){acc-=s16;setStep((B.step+1)%16);}}}
    let any=false;for(let r=0;r<4;r++){if(B.levels[r]>.01){B.levels[r]*=Math.exp(-dt*7);any=true;}}
    since+=dt;if(B.dirty||(B.playing||any)&&since>.066){since=0;draw();leds_();}
    for(const k in btns){const b=btns[k];if(b.press>0){b.press-=dt;b.cap.position.y=b.press>0?.005:b.cap.userData.y0;}}
    cards.forEach((c,i)=>{const s=i===B.card,k=1-Math.exp(-dt*8);c.h.position.y+=((s?1.305:1.24)-c.h.position.y)*k;c.h.position.z+=((s?.165:.11)-c.h.position.z)*k;c.h.rotation.x+=((s?-.05:-.18)-c.h.rotation.x)*k;c.gm.opacity+=((s?.85:0)-c.gm.opacity)*k;c.front.emissiveIntensity+=((s?.6:.3)-c.front.emissiveIntensity)*k;});
    if(out&&B.playing){const c=app.camera,l=ac.listener;c.getWorldDirection(fwd);up.set(0,1,0).applyQuaternion(c.quaternion);
      if(l.positionX){const t=ac.currentTime+.03;for(const [p,v] of [[l.positionX,c.position.x],[l.positionY,c.position.y],[l.positionZ,c.position.z],[l.forwardX,fwd.x],[l.forwardY,fwd.y],[l.forwardZ,fwd.z],[l.upX,up.x],[l.upY,up.y],[l.upZ,up.z]])p.linearRampToValueAtTime(v,t);}
      else{l.setPosition(c.position.x,c.position.y,c.position.z);l.setOrientation(fwd.x,fwd.y,fwd.z,up.x,up.y,up.z);}}};
  B.qa=()=>({playing:B.playing,audio:B.audio(),step:B.step,card:B.card,bpm:B.bpm,near:B.near(),muted:B.muted.slice(),on:B.grid.map(r=>r.reduce((a,b)=>a+b,0)),grid:B.grid.map(r=>r.join('')),loud:B.loud(),hover:B.hoverCell});
  B.CARDS=CARDS;B.TRACKS=TRACKS;
  draw();leds_();return B;
}
