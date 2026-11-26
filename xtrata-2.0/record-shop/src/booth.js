import * as THREE from 'three';
import {esc} from './util.js';
// split text into lines that fit maxW on a canvas context
const wrapText=(x,text,maxW)=>{const out=[];let line='';for(const w of String(text).split(/\s+/)){const t=line?line+' '+w:w;if(x.measureText(t).width>maxW&&line){out.push(line);line=w;}else line=t;}if(line)out.push(line);return out;};
import {createStudio,ROWS,LAYERS,LAYER_NAME,LAYER_ROWS,MODES,MAKERS,makerLabel,keyName} from './fork.js';
import {TOPICS,topic,LECTERNS,STATUS_COL,drawTopicPage} from './booth-info.js';

// The Audionaut booth: a permanent 9 ft × 6 ft × 8 ft station recessed into the back wall, running the forking demo.
// A song here is a set of instructions built from credited layers (drums, bass, keys, lead). Visitors fork any version,
// vary a layer, borrow layers from other songs and punch steps by hand, and every hit keeps pointing back to who made it.
// Everything is synthesised in the browser through the shop's shared AudioContext; nothing is saved, inscribed or paid.
// Set into the back wall: its open front is flush with the wall's inner face (z = -5.5) and the booth sits in an alcove behind it.
export const WALL_Z=-5.5;
export const BOOTH={x:-.6,z:WALL_Z-1.83/2,w:2.74,d:1.83,h:2.44};
export const STUDIO_URL='https://xtrata.xyz/audionaut/';

const LCOL={drums:'#f2b84b',bass:'#9b7bff',keys:'#58d7e8',lead:'#ff5fa2'};
const ROWCOL=ROWS.map(r=>LCOL[r.layer]);
const OFF={bass:-24,keys:0,lead:12};
const NN=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
// console screen layout (px)
const CW=1024,CH=624,GX=168,GY=78,CEW=52.5,CEH=52,RG=8,FY=GY+6*(CEH+RG)+4;
// wall screen
const WW=1600,WH=660,TB=62,CHT=WH-TB,TREEW=980; // the top TB px of the wall screen is a row of topic tabs

export function initBooth(app){
  const {scene,art,mats:M,box}=app,F=art.font,P=app.playback;
  const {w:W,d:D,h:H}=BOOTH;
  app.STUDIO_URL=STUDIO_URL;
  const St=createStudio();
  const B={studio:St,topic:'tree',topicAt:-1e9,playing:false,step:-1,layer:null,ab:false,levels:[0,0,0,0,0,0],hoverCell:null,dirty:true,wallDirty:true,flash:0};app.booth=B;
  const cur=()=>St.get(St.cur),fam=()=>St.family(cur().fam);
  const g=new THREE.Group();g.position.set(BOOTH.x,0,BOOTH.z);scene.add(g);B.root=g;
  const basic=(c)=>new THREE.MeshBasicMaterial({color:c,toneMapped:false});
  const lit=(tex,e=.35)=>new THREE.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:0xffffff,emissiveIntensity:e,roughness:.5});
  const nc=o=>{o.castShadow=false;return o;};
  const rr=(x,X,Y,w,h,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();};
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
    x.fillStyle='#f2b84b';x.font=`700 26px ${F}`;x.fillText('FORK IT · REMIX IT · KEEP THE CREDITS',Math.min(w-560,190+tw),90);
    x.fillStyle='#58d7e8';x.font=`700 30px ${F}`;x.fillText('BLOCKCHAIN AUDIONAL WORK-SPACE-STATION  ·  FORKING DEMO',160,160);});
  const sign=app.plane(g,W-.12,.28,new THREE.MeshBasicMaterial({map:signTex,toneMapped:false}),0,H-.16,D/2+.002);
  const ledW=(W-.32)/16,leds=new THREE.InstancedMesh(new THREE.BoxGeometry(ledW-.025,.022,.022),new THREE.MeshBasicMaterial({toneMapped:false}),16);
  const m4=new THREE.Matrix4(),col=new THREE.Color();
  for(let i=0;i<16;i++){m4.makeTranslation(-(W-.32)/2+ledW*(i+.5),H-.355,D/2-.02);leds.setMatrixAt(i,m4);leds.setColorAt(i,col.set(0x22180f));}
  g.add(leds);
  // ---- console: desk, grid screen, five buttons (FORK in the middle, biggest) ----
  const cg=new THREE.Group();cg.position.set(0,.06,.06);g.add(cg);
  box(cg,1.18,.84,.56,M.black,0,.42,0);
  nc(box(cg,1.06,.016,.015,basic(0xf2b84b),0,.78,.285,{cast:false}));
  const deck=nc(box(cg,1.22,.1,.62,M.matte,0,.88,.02,{cast:false}));deck.rotation.x=.26;
  const scr=art.panel(CW,CH,()=>{});
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(.94,.572),new THREE.MeshBasicMaterial({map:scr,toneMapped:false}));screen.position.set(0,.995,-.05);screen.rotation.x=-Math.PI/2+.38;cg.add(screen);
  const btns={};
  [['play','PLAY',0x35d07f,-.47,.17],['ab','HEAR PARENT',0x58d7e8,-.25,.17],['fork','FORK',0xf2b84b,0,.25],['vary','VARY',0x9b7bff,.25,.17],['borrow','BORROW',0xff5fa2,.47,.17]].forEach(([id,label,c,x0,w])=>{
    const bg=new THREE.Group();bg.position.set(x0,.895,.25);bg.rotation.x=.26;cg.add(bg);const big=id==='fork';
    nc(box(bg,w+.025,.025,big?.1:.085,M.black,0,0,0,{cast:false}));
    const cm=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:big?1:.75,roughness:.25});const cap=nc(box(bg,w,big?.04:.032,big?.08:.065,cm,0,big?.018:.014,0,{cast:false}));cap.userData.y0=cap.position.y;
    const lt=art.panel(256,96,(x,ww,h)=>{x.clearRect(0,0,ww,h);let fs=big?44:30;x.font=`800 ${fs}px ${F}`;while(x.measureText(label).width>ww-20&&fs>16){fs-=2;x.font=`800 ${fs}px ${F}`;}x.fillStyle='#120d09';x.textAlign='center';x.textBaseline='middle';x.fillText(label,ww/2,h/2+2);});
    const lp=new THREE.Mesh(new THREE.PlaneGeometry(w-.008,(w-.008)*96/256),new THREE.MeshBasicMaterial({map:lt,transparent:true,toneMapped:false}));lp.rotation.x=-Math.PI/2;lp.position.y=cap.position.y+(big?.0202:.0162);bg.add(lp);
    btns[id]={cap,mat:cm,c,press:0,lt,label};});
  // ---- left wing: the six starting songs, plus the reset plate ----
  const label=(t,s,c)=>art.panel(512,160,(x,w,h)=>{x.fillStyle='#16110d';x.fillRect(0,0,w,h);x.fillStyle=c;x.fillRect(0,0,14,h);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=3;x.strokeRect(2,2,w-4,h-4);
    x.font=`800 44px ${F}`;x.fillStyle='#fff6e2';x.textBaseline='alphabetic';x.fillText(t,34,72);x.font=`700 22px ${F}`;x.fillStyle=c;x.fillText(s,34,120);
    x.beginPath();x.arc(w-44,52,24,0,7);x.fillStyle=c;x.fill();x.font=`800 30px ${F}`;x.fillStyle='#16110d';x.textAlign='center';x.fillText('i',w-44,63);x.textAlign='left';});
  const lw=new THREE.Group();lw.position.set(-W/2+.11,0,-.04);lw.rotation.y=Math.PI/2;g.add(lw);
  const songsHead=app.plane(lw,1.18,.24,lit(label('SONGS','CLICK ONE TO LOAD IT AND ITS FAMILY TREE','#f2b84b'),.5),0,1.94,.01);
  nc(box(lw,1.4,.04,.22,M.black,0,1.12,.1,{cast:false}));
  const cardTex=f=>art.panel(300,420,(x,w,h)=>{const v4=St.get(f.id+':v4');x.fillStyle='#17130f';x.fillRect(0,0,w,h);x.fillStyle='#f2b84b';x.fillRect(0,0,w,10);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=3;x.strokeRect(8,18,w-16,h-26);
    x.textBaseline='alphabetic';x.font=`800 18px ${F}`;x.fillStyle='#58d7e8';x.fillText(f.style.toUpperCase(),22,50);x.font=`800 30px ${F}`;x.fillStyle='#fff6e2';const lines=wrapText(x,f.title,w-44).slice(0,2);lines.forEach((l,i)=>x.fillText(l,22,88+i*32));
    x.font=`600 17px ${F}`;x.fillStyle='#bfae95';x.fillText(`${f.bpm} BPM · ${keyName(f)}`,22,150);
    if(v4)for(let r=0;r<6;r++)for(let s=0;s<16;s++){const on=r<3?!!v4.cells[r][s]:v4.cells[r][s]!=null;x.fillStyle=on?ROWCOL[r]:'#241d17';x.fillRect(22+s*16,172+r*22,13,17);}
    x.font=`600 14px ${F}`;x.fillStyle='#bfae95';const mk=v4?St.ancestry(v4.id).reverse().map(v=>MAKERS[v.maker].name).join(' → '):'';wrapText(x,'Built by '+mk,w-44).slice(0,2).forEach((l,i)=>x.fillText(l,22,326+i*20));
    x.fillStyle='rgba(255,255,255,.07)';x.fillRect(22,372,w-44,30);x.font=`800 14px ${F}`;x.fillStyle='#f2b84b';x.fillText('▶ CLICK TO LOAD',38,392);});
  const cards=St.families.map((f,i)=>{const h=new THREE.Group();h.position.set(-.575+i*.23,1.29,.11);h.rotation.x=-.16;lw.add(h);
    const tex=cardTex(f),front=lit(tex,.3),body=new THREE.Mesh(new THREE.BoxGeometry(.2,.28,.012),M.black);h.add(body);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(.196,.276),front);mesh.position.z=.0062;h.add(mesh);
    const gm=new THREE.MeshBasicMaterial({color:0xf2b84b,transparent:true,opacity:0,toneMapped:false}),glow=new THREE.Mesh(new THREE.PlaneGeometry(.222,.302),gm);glow.position.z=-.008;h.add(glow);
    return {h,mesh,body,front,gm,fam:f.id};});
  const resetM=new THREE.MeshStandardMaterial({color:0x2a211a,emissive:0xd0604f,emissiveIntensity:.25,roughness:.5});
  const resetBox=nc(box(lw,.36,.12,.05,resetM,0,.86,.05,{cast:false}));
  const resetTex=art.panel(360,120,(x,w,h)=>{x.fillStyle='#1a1410';x.fillRect(0,0,w,h);x.strokeStyle='#d0604f';x.lineWidth=4;x.strokeRect(4,4,w-8,h-8);x.font=`800 30px ${F}`;x.fillStyle='#ffd8cf';x.textAlign='center';x.textBaseline='middle';x.fillText('↺ RESET DEMO',w/2,46);x.font=`600 17px ${F}`;x.fillStyle='#d8a79c';x.fillText('back to the starting songs',w/2,86);});
  const resetFace=app.plane(lw,.35,.117,new THREE.MeshBasicMaterial({map:resetTex,toneMapped:false}),0,.86,.0755);
  // ---- right wing: the four layer blocks ----
  const rw=new THREE.Group();rw.position.set(W/2-.11,0,-.04);rw.rotation.y=-Math.PI/2;g.add(rw);
  const layersHead=app.plane(rw,1.18,.24,lit(label('LAYERS','PICK ONE FOR VARY / BORROW — OR LEAVE IT TO CHANCE','#9b7bff'),.5),0,1.94,.01);
  nc(box(rw,1.24,.96,.03,M.matte,0,1.28,.02,{cast:false}));
  const root=new THREE.Mesh(new THREE.SphereGeometry(.045,20,14),basic(0xf2b84b));root.position.set(0,.92,.06);rw.add(root);
  const blocks=LAYERS.map((layer,i)=>{const bx=i%2?.3:-.3,by=i<2?1.54:1.18,c=new THREE.Color(LCOL[layer]);
    const sx=Math.sign(bx)*(i<2?.045:.02),ex=Math.sign(bx)*.07;
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.92,.055),new THREE.Vector3(sx,.99,.055),new THREE.Vector3(sx,by-.06,.055),new THREE.Vector3(ex,by,.055)]);
    const pm=new THREE.MeshBasicMaterial({color:c.clone(),toneMapped:false});rw.add(new THREE.Mesh(new THREE.TubeGeometry(curve,16,.008,8,false),pm));
    const tex=art.panel(512,230,()=>{});const fm=lit(tex,.55),sm=new THREE.MeshStandardMaterial({color:0x221a14,emissive:c,emissiveIntensity:.45,roughness:.4});
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(.48,.24,.065),sm);mesh.position.set(bx,by,.068);rw.add(mesh);const face=new THREE.Mesh(new THREE.PlaneGeometry(.476,.236),fm);face.position.z=.0331;mesh.add(face);
    return {layer,mesh,face,tex,fm,sm,pm,c};});
  function drawBlock(bk){const x=bk.tex.userData.canvas.getContext('2d'),w=512,h=230,v=cur(),li=St.layerInfo(v.id,bk.layer),sel=B.layer===bk.layer,c=LCOL[bk.layer];
    x.fillStyle=sel?'#2a2016':'#17120e';x.fillRect(0,0,w,h);x.fillStyle=c;x.fillRect(0,0,16,h);x.strokeStyle=sel?'#fff6e2':'rgba(255,255,255,.14)';x.lineWidth=sel?8:3;x.strokeRect(4,4,w-8,h-8);
    x.textBaseline='alphabetic';x.textAlign='left';x.font=`800 50px ${F}`;x.fillStyle='#fff6e2';x.fillText(LAYER_NAME[bk.layer].toUpperCase(),36,66);
    if(sel){x.font=`800 22px ${F}`;x.fillStyle='#f2b84b';x.textAlign='right';x.fillText('CHOSEN',w-26,58);x.textAlign='left';}
    x.font=`700 26px ${F}`;x.fillStyle=c;
    if(li.empty){x.fillText('empty in this version',36,120);}
    else{x.fillText(MAKERS[li.maker].name+(MAKERS[li.maker].demo?' · demo maker':''),36,116);x.font=`600 22px ${F}`;x.fillStyle='#d8c9b0';
      const how=li.how==='new'?'made in '+v.label:li.how==='borrowed'?`borrowed from ${li.song} ${li.version}`:`inherited from ${li.song===fam().title?'':li.song+' '}${li.version}`;
      x.fillText(how,36,154);if(li.makers.length>1){x.fillStyle='#bfae95';x.fillText(`+ ${li.makers.length-1} other maker${li.makers.length>2?'s':''}`,36,188);}}
    bk.tex.needsUpdate=true;bk.sm.emissiveIntensity=sel?.9:.45;bk.mesh.position.z=sel?.085:.068;}
  // ---- back wall: family tree + credits screen ----
  nc(box(g,2.36,2.3*WH/WW+.08,.03,M.black,0,1.66,-D/2+.095,{cast:false}));
  const wallTex=art.panel(WW,WH,()=>{});
  const wall=app.plane(g,2.3,2.3*WH/WW,new THREE.MeshBasicMaterial({map:wallTex,toneMapped:false}),0,1.66,-D/2+.112);
  let nodeRects=[],helpRect=null;
  // ---- sound (shared AudioContext, positional output at the console) ----
  let ac=null,out=null,pan=null,dly=null,noise=null,timer=null,nextT=0,sched=0,queue=[],acc=0;
  const cpos=new THREE.Vector3(0,1.05,.1);
  function setup(){if(out)return true;app.audioInit();ac=P.ctx&&P.ctx();if(!ac)return false;if(ac.state==='suspended')ac.resume().catch(()=>{});
    try{out=ac.createGain();out.gain.value=.5;pan=ac.createPanner();pan.panningModel='HRTF';pan.distanceModel='inverse';pan.refDistance=1.8;pan.rolloffFactor=1.35;pan.maxDistance=40;
      const wp=g.localToWorld(cpos.clone());if(pan.positionX){pan.positionX.value=wp.x;pan.positionY.value=wp.y;pan.positionZ.value=wp.z;}else pan.setPosition(wp.x,wp.y,wp.z);
      out.connect(pan);pan.connect(ac.destination);
      dly=ac.createDelay(1);dly.delayTime.value=.25;const fb=ac.createGain();fb.gain.value=.26;const lp2=ac.createBiquadFilter();lp2.type='lowpass';lp2.frequency.value=2600;dly.connect(lp2);lp2.connect(fb);fb.connect(dly);lp2.connect(out);
      noise=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}catch(e){out=null;return false;}
    return true;}
  const env=(gn,t,v,len)=>{gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+len);};
  const hz=(f,d,off)=>{const sc=MODES[f.mode],o=Math.floor(d/7),m=((d%7)+7)%7;return 440*Math.pow(2,(f.root+off+12*o+sc[m]-69)/12);};
  B.noteName=(f,d)=>{const sc=MODES[f.mode],m=((d%7)+7)%7;return NN[(f.root+sc[m])%12];};
  function kick(t,a){const o=ac.createOscillator(),gn=ac.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.09);o.frequency.exponentialRampToValueAtTime(30,t+.24);env(gn,t,a?1:.9,.28);o.connect(gn);gn.connect(out);o.start(t);o.stop(t+.3);}
  function noiseHit(t,type,f,q,v,len){const s=ac.createBufferSource();s.buffer=noise;const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t);fl.Q.value=q;const gn=ac.createGain();env(gn,t,v,len);s.connect(fl);fl.connect(gn);gn.connect(out);s.start(t,Math.random()*.5);s.stop(t+len+.02);}
  function snare(t,a){noiseHit(t,'bandpass',a?1500:1900,a?.8:1.2,a?.45:.16,a?.17:.08);if(a){const o=ac.createOscillator(),tg=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(110,t+.08);env(tg,t,.24,.1);o.connect(tg);tg.connect(out);o.start(t);o.stop(t+.11);}}
  function hat(t,open){noiseHit(t,'highpass',7200,1.2,open?.13:.1,open?.22:.045);}
  function bass(t,f,d,len){const o=ac.createOscillator(),fl=ac.createBiquadFilter(),gn=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(hz(f,d,OFF.bass),t);fl.type='lowpass';fl.Q.value=5;fl.frequency.setValueAtTime(900,t);fl.frequency.exponentialRampToValueAtTime(170,t+len*.8);env(gn,t,.34,len);o.connect(fl);fl.connect(gn);gn.connect(out);o.start(t);o.stop(t+len+.02);}
  function keys(t,f,c,len){const gn=ac.createGain(),fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=1800;gn.gain.setValueAtTime(.0001,t);gn.gain.linearRampToValueAtTime(.075,t+.015);gn.gain.setValueAtTime(.075,t+Math.max(.03,len-.08));gn.gain.exponentialRampToValueAtTime(.001,t+len);fl.connect(gn);gn.connect(out);
    for(const d of [c,c+2,c+4]){const o=ac.createOscillator();o.type='triangle';o.frequency.setValueAtTime(hz(f,d,OFF.keys),t);o.connect(fl);o.start(t);o.stop(t+len+.02);}}
  function lead(t,f,d,len){const a=ac.createOscillator(),b=ac.createOscillator(),fl=ac.createBiquadFilter(),gn=ac.createGain(),fq=hz(f,d,OFF.lead);a.type='square';b.type='triangle';a.frequency.setValueAtTime(fq,t);b.frequency.setValueAtTime(fq*1.004,t);
    fl.type='lowpass';fl.Q.value=2;fl.frequency.setValueAtTime(2600,t);fl.frequency.exponentialRampToValueAtTime(700,t+len);env(gn,t,.07,len);a.connect(fl);b.connect(fl);fl.connect(gn);gn.connect(out);gn.connect(dly);a.start(t);b.start(t);a.stop(t+len+.02);b.stop(t+len+.02);}
  // what is heard: the current version, or its parent while "hear parent" is on (switching never stops the music)
  B.hearing=()=>{const v=cur();return B.ab&&v.parent?St.get(v.parent):v;};
  const gap=(row,s)=>{for(let k=1;k<=16;k++)if(row[(s+k)%16]!=null)return k;return 16;};
  function trigger(s,t){const v=B.hearing(),f=St.family(v.fam),c=v.cells,s16=60/f.bpm/4;
    try{if(c[0][s])kick(t,c[0][s]===2);if(c[1][s])snare(t,c[1][s]===2||s%8===4);if(c[2][s])hat(t,c[2][s]===2);
      if(c[3][s]!=null)bass(t,f,c[3][s],Math.min(gap(c[3],s),2)*s16*.95);if(c[4][s]!=null)keys(t,f,c[4][s],Math.min(gap(c[4],s),4)*s16*.98);if(c[5][s]!=null)lead(t,f,c[5][s],Math.min(gap(c[5],s),3)*s16*.9);}catch(e){}}
  function tick(){if(!B.playing||!out)return;if(nextT<ac.currentTime-.25){nextT=ac.currentTime+.05;queue=[];}
    while(nextT<ac.currentTime+.12){trigger(sched,nextT);queue.push([sched,nextT]);nextT+=60/St.family(B.hearing().fam).bpm/4;sched=(sched+1)%16;}}
  B.audio=()=>!!(out&&ac&&ac.state==='running');
  function setStep(s){B.step=s;const v=B.hearing();if(s>=0)for(let r=0;r<6;r++){const x=v.cells[r][s];if(r<3?x:x!=null)B.levels[r]=1;}B.dirty=true;head();}
  B.start=()=>{if(B.playing)return;setup();if(P.s.playing){P.pause();app.toast(P.s.source==='vinyl'?'Paused the turntable so you can hear the booth.':'Paused the CD so you can hear the booth.');}
    B.playing=true;sched=0;queue=[];acc=0;B.step=-1;if(out){nextT=ac.currentTime+.06;tick();clearInterval(timer);timer=setInterval(tick,25);}
    btnColor();B.dirty=true;panel();app.emit('booth');};
  B.stop=(msg)=>{if(!B.playing)return;B.playing=false;clearInterval(timer);timer=null;queue=[];setStep(-1);btnColor();if(msg)app.toast(msg);panel();app.emit('booth');};
  B.toggle=()=>{app.foley('click');if(B.playing)B.stop();else B.start();};
  function btnColor(){const p=btns.play;p.mat.color.setHex(B.playing?0xd0604f:0x35d07f);p.mat.emissive.setHex(B.playing?0xd0604f:0x35d07f);
    const a=btns.ab,can=!!cur().parent;a.mat.emissiveIntensity=!can?.12:B.ab?1.2:.75;a.mat.color.setHex(B.ab?0xffffff:0x58d7e8);}
  app.on('playback',()=>{if(P.s.playing&&B.playing)B.stop('Booth stopped — a record is playing.');});
  B.loud=()=>{if(!B.playing)return false;const p=app.camera.position;return Math.hypot(p.x-BOOTH.x,p.z-(BOOTH.z+.1))<6;};
  // ---- actions ----
  const say=m=>{if(!B.near())app.toast(m);};
  function changed(note,opt={}){B.topic='tree';B.autoTopic=false;B.topicAt=performance.now();if(typeof drawLecterns==='function')drawLecterns();B.note=note;B.flash=2.4;B.dirty=true;B.wallDirty=true;blocks.forEach(drawBlock);btnColor();panel();if(note&&!opt.quiet)say(note);if(opt.play&&!B.playing)B.start();app.emit('booth');}
  B.fork=(layer)=>{app.foley('click');B.ab=false;const r=St.fork(St.cur,{layer:layer||B.layer||undefined});changed(r.note,{play:true});return r.version;};
  B.vary=(layer)=>{app.foley('click');B.ab=false;const r=St.vary(St.cur,layer||B.layer||undefined);changed(r.note,{play:true});return r.version;};
  B.borrow=(layer,fromId)=>{app.foley('click');B.ab=false;const r=St.borrow(St.cur,layer||B.layer||undefined,fromId||undefined);changed(r.note,{play:true});return r.version;};
  B.edit=(row,step)=>{app.foley('click');B.ab=false;const r=St.edit(St.cur,row,step);changed(r.note,{quiet:true});return r.version;};
  B.select=(id)=>{if(!St.get(id))return;St.cur=id;B.ab=false;const v=cur();
    changed(`Now playing “${St.family(v.fam).title}” ${v.label} by ${makerLabel(v.maker)}. ${v.note||''}`,{play:true,quiet:true});};
  B.loadSong=(famId)=>{const f=St.family(famId);B.select(f.latest);say(`Loaded “${f.title}” (${f.style}, ${f.bpm} BPM, ${keyName(f)}). Press FORK to make it yours.`);};
  B.toggleAB=()=>{const v=cur();if(!v.parent){app.toast('This is the first version — it has no parent to compare with.');return;}app.foley('click');B.ab=!B.ab;B.dirty=true;B.wallDirty=true;btnColor();panel();if(!B.playing)B.start();
    say(B.ab?`Hearing the parent: ${St.get(v.parent).label}. Press again to hear ${v.label}.`:`Back to ${v.label}.`);};
  B.chooseLayer=(layer)=>{B.layer=!layer||B.layer===layer?null:layer;app.foley('click');blocks.forEach(drawBlock);B.dirty=true;panel();say(B.layer?`${LAYER_NAME[B.layer]} chosen — Fork, Vary and Borrow will change the ${LAYER_NAME[B.layer].toLowerCase()}.`:'No layer chosen — Fork, Vary and Borrow pick one for you.');};
  B.reset=()=>{app.foley('click');B.stop();St.reset();B.layer=null;B.ab=false;changed('Reset: all six starting songs are back, and every fork has been cleared for the next visitor.');};
  B.about=()=>app.ui.openBooth();B.makerLabel=makerLabel;
  B.credits=()=>app.ui.openBoothCredits();
  B.setTopic=(id,auto)=>{if(!TOPICS.some(t=>t.id===id))id='tree';B.autoTopic=!!auto;if(!auto){B.topicAt=performance.now();app.foley('click');}B.topic=id;B.wallDirty=true;drawLecterns();panel();app.emit('booth');};
  // ---- console screen ----
  function draw(){const x=scr.userData.canvas.getContext('2d'),v=cur(),hv=B.hearing(),f=St.family(v.fam),last=v.last||{on:[],off:[],chg:[]},lastSet=new Set([...last.on,...last.chg]),offSet=new Set(last.off),fl=B.flash>0;
    x.fillStyle='#090706';x.fillRect(0,0,CW,CH);x.fillStyle='#17110c';x.fillRect(0,0,CW,64);x.fillStyle=v.mine?'#58d7e8':'#f2b84b';x.fillRect(0,62,CW,3);
    x.textBaseline='alphabetic';x.textAlign='left';x.font=`800 26px ${F}`;x.fillStyle='#fff6e2';x.fillText(`${f.title} · ${v.label}`,18,30);
    x.font=`600 17px ${F}`;x.fillStyle='#bfae95';x.fillText(`${f.style} · ${f.bpm} BPM · ${keyName(f)} · ${v.kind==='fork'?'forked by':'by'} ${makerLabel(v.maker)}`,18,54);
    x.textAlign='right';x.font=`800 20px ${F}`;x.fillStyle=B.playing?'#35d07f':'#f2b84b';x.fillText(B.playing?'● PLAYING':'■ READY',CW-18,30);
    if(B.ab){x.fillStyle='#58d7e8';x.fillText('HEARING PARENT: '+hv.label,CW-18,54);}else if(B.layer){x.fillStyle=LCOL[B.layer];x.fillText('CHOSEN: '+LAYER_NAME[B.layer].toUpperCase(),CW-18,54);}
    x.textAlign='left';
    for(let r=0;r<6;r++){const y=GY+r*(CEH+RG),row=ROWS[r],li=St.layerInfo(hv.id,row.layer),c=ROWCOL[r];
      x.fillStyle=B.layer===row.layer?'#2c2117':'#1d1712';x.fillRect(14,y,GX-22,CEH);x.fillStyle=c;x.fillRect(14,y,6,CEH);
      x.font=`800 17px ${F}`;x.fillStyle='#fff6e2';x.fillText(row.label,28,y+22);x.font=`600 13px ${F}`;x.fillStyle=li.empty?'#6b5d4f':'#bfae95';x.fillText(li.empty?'—':MAKERS[li.maker].name+(li.how==='borrowed'?' · borrowed':li.how==='new'?' · new':''),28,y+42);
      for(let s=0;s<16;s++){const cx=GX+s*CEW,val=hv.cells[r][s],on=r<3?!!val:val!=null,o=hv.org[r][s],how=on?St.how(hv.id,o):null,k=r+':'+s,hd=B.step===s;
        x.fillStyle=on?c:(s%4===0?'#231c16':'#18130f');x.globalAlpha=on&&how==='inherited'?.72:1;x.fillRect(cx,y,CEW-6,CEH);x.globalAlpha=1;
        if(on&&how==='borrowed'){x.save();x.beginPath();x.rect(cx,y,CEW-6,CEH);x.clip();x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=3;for(let q=-CEH;q<CEW;q+=10){x.beginPath();x.moveTo(cx+q,y+CEH);x.lineTo(cx+q+CEH,y);x.stroke();}x.restore();}
        if(on&&how==='new'){x.fillStyle='#fff';x.beginPath();x.arc(cx+CEW-14,y+10,5,0,Math.PI*2);x.fill();}
        if(on&&r>=3){x.font=`800 15px ${F}`;x.fillStyle='rgba(15,10,6,.85)';x.fillText(B.noteName(f,val),cx+5,y+CEH-8);}
        if(on&&r<3&&val===2){x.fillStyle='rgba(15,10,6,.7)';x.fillRect(cx+4,y+CEH-10,CEW-14,4);}
        if(!B.ab&&(lastSet.has(k)||offSet.has(k))){x.strokeStyle=fl?'#ffe27a':'rgba(255,226,122,.75)';x.lineWidth=fl?4:2.5;x.setLineDash(offSet.has(k)?[6,5]:[]);x.strokeRect(cx+2,y+2,CEW-10,CEH-4);x.setLineDash([]);}
        if(hd){x.fillStyle='rgba(255,255,255,.22)';x.fillRect(cx,y,CEW-6,CEH);}
        const h=B.hoverCell;if(h&&h[0]===r&&h[1]===s){x.strokeStyle='#ffffff';x.lineWidth=3;x.strokeRect(cx+1,y+1,CEW-8,CEH-2);}
        if(r===0&&s%4===0){x.fillStyle=hd?'#fff':'#6b5d4f';x.fillRect(cx+16,GY-10,14,3);}}}
    // footer: what just happened + legend
    x.fillStyle='#120e0b';x.fillRect(14,FY,CW-28,CH-FY-10);x.strokeStyle='rgba(255,255,255,.1)';x.lineWidth=2;x.strokeRect(14,FY,CW-28,CH-FY-10);
    x.font=`600 19px ${F}`;x.fillStyle=fl?'#ffe27a':'#efe3cc';wrapText(x,B.note||'Press FORK to make this song your own. Aim at any hit to see who made it.',CW-60).slice(0,3).forEach((l,i)=>x.fillText(l,30,FY+30+i*25));
    const ly=CH-24;x.font=`700 14px ${F}`;let lx=30;const leg=(dr,txt)=>{dr(lx,ly-12);x.fillStyle='#bfae95';x.fillText(txt,lx+26,ly);lx+=x.measureText(txt).width+52;};
    leg((a,b)=>{x.globalAlpha=.72;x.fillStyle='#9b7bff';x.fillRect(a,b,18,14);x.globalAlpha=1;},'inherited');
    leg((a,b)=>{x.fillStyle='#9b7bff';x.fillRect(a,b,18,14);x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.moveTo(a,b+14);x.lineTo(a+14,b);x.stroke();},'borrowed');
    leg((a,b)=>{x.fillStyle='#9b7bff';x.fillRect(a,b,18,14);x.fillStyle='#fff';x.beginPath();x.arc(a+13,b+4,3,0,7);x.fill();},'new in this version');
    leg((a,b)=>{x.strokeStyle='#ffe27a';x.lineWidth=2.5;x.strokeRect(a,b,18,14);},'just changed');
    scr.needsUpdate=true;B.dirty=false;}
  scr.userData.redraw=draw;
  // ---- wall screen: family tree (left) and credits (right) ----
  let tabRects=[];
  function drawTabs(x){tabRects=[];x.fillStyle='#0c0907';x.fillRect(0,0,WW,WH);x.fillStyle='#15100c';x.fillRect(0,0,WW,TB);const tw=(WW-20)/TOPICS.length;
    TOPICS.forEach((t,i)=>{const X=10+i*tw,on=B.topic===t.id;x.fillStyle=on?'#f2b84b':'#211912';rr(x,X+3,10,tw-6,TB-18,10);x.fill();if(!on&&t.status){x.fillStyle=STATUS_COL[t.status];x.fillRect(X+14,TB-16,tw-28,3);}
      x.font=`800 19px ${F}`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=on?'#120d09':'#efe3cc';x.fillText(t.tab,X+tw/2,TB/2-2);x.textAlign='left';x.textBaseline='alphabetic';tabRects.push({id:t.id,x:X,y:0,w:tw,h:TB});});}
  function drawWall(){const x=wallTex.userData.canvas.getContext('2d');drawTabs(x);nodeRects=[];helpRect=null;x.save();x.translate(0,TB);
    if(B.topic==='tree')drawTree(x);else drawTopicPage(x,topic(B.topic),WW,CHT,F);
    x.restore();for(const r of nodeRects)r.y+=TB;if(helpRect)helpRect.y+=TB;wallTex.needsUpdate=true;B.wallDirty=false;}
  function drawTree(x){const v=cur(),f=St.family(v.fam),t=St.tree(v.fam);
    x.fillStyle='#f2b84b';x.fillRect(0,0,WW,4);
    x.textBaseline='alphabetic';x.textAlign='left';x.font=`800 30px ${F}`;x.fillStyle='#fff6e2';x.fillText('FAMILY TREE',30,52);x.font=`700 24px ${F}`;x.fillStyle='#58d7e8';x.fillText(`“${f.title}”`,248,52);
    x.font=`600 17px ${F}`;x.fillStyle='#bfae95';x.fillText('Each version builds on its parent. Forks branch off; borrowed layers link to other songs.',30,82);
    const NW=150,NH=62,top=108,laneH=Math.min(84,(CHT-top-70)/Math.max(1,t.lanes)),maxG=t.gens;const curNode=t.nodes.find(n=>n.id===v.id);
    const nh=Math.min(NH,laneH-10),visG=Math.max(1,Math.floor((TREEW-40)/(NW+26))),g0=Math.max(0,Math.min(maxG-visG,(curNode?curNode.gen:0)-visG+2));
    const pos=n=>({x:30+(n.gen-g0)*(NW+26),y:top+n.lane*laneH});
    x.save();x.beginPath();x.rect(20,top-22,TREEW-30,CHT-top-48);x.clip();
    for(const n of t.nodes){if(!n.parent)continue;const p=t.nodes.find(q=>q.id===n.parent);if(!p)continue;const a=pos(p),b=pos(n);x.strokeStyle=n.mine?'#58d7e8':n.kind==='fork'?'#c69cff':'#f2b84b';x.lineWidth=3;x.beginPath();x.moveTo(a.x+NW,a.y+nh/2);x.bezierCurveTo(a.x+NW+20,a.y+nh/2,b.x-20,b.y+nh/2,b.x,b.y+nh/2);x.stroke();}
    const chips=[];
    for(const n of t.nodes){const p=pos(n),me=n.id===v.id,hear=B.ab&&n.id===v.parent;x.fillStyle=me?'#3a2a12':n.mine?'#0f2427':'#1b1510';rr(x,p.x,p.y,NW,nh,10);x.fill();x.lineWidth=me?5:2.5;x.strokeStyle=me?'#f2b84b':hear?'#58d7e8':n.mine?'#58d7e8':n.kind==='fork'?'#c69cff':'rgba(242,184,75,.5)';x.stroke();
      x.font=`800 ${nh<50?16:19}px ${F}`;x.fillStyle='#fff6e2';let lab=n.label;while(x.measureText(lab).width>NW-20&&lab.length>4)lab=lab.slice(0,-2)+'…';x.fillText(lab,p.x+10,p.y+(nh<50?20:26));
      x.font=`600 ${nh<50?13:15}px ${F}`;x.fillStyle=n.mine?'#9fe9f3':'#bfae95';x.fillText(n.mine?'by you':MAKERS[n.maker].name+' (demo)',p.x+10,p.y+nh-(nh<50?8:12));
      if(me){x.font=`800 13px ${F}`;x.fillStyle='#f2b84b';x.fillText('▶ YOU ARE HERE',p.x+NW-108,p.y-6);}
      else if(hear){x.font=`800 13px ${F}`;x.fillStyle='#58d7e8';x.fillText('HEARING',p.x+NW-70,p.y-6);}
      if(p.x>0&&p.x<TREEW)nodeRects.push({id:n.id,x:p.x,y:p.y,w:NW,h:nh,label:n.label,maker:n.maker,mine:n.mine,parent:n.parent});
      for(const b of n.borrows)chips.push({from:p,b});}
    x.restore();
    // borrowed-layer links drawn to labelled chips along the bottom of the tree area
    chips.slice(-4).forEach((c,i)=>{const cx=40+i*235,cy=CHT-46;x.setLineDash([7,6]);x.strokeStyle=LCOL[c.b.layer];x.lineWidth=2.5;x.beginPath();x.moveTo(c.from.x+NW/2,c.from.y+nh);x.lineTo(cx+100,cy);x.stroke();x.setLineDash([]);
      x.fillStyle='#15100c';rr(x,cx,cy,215,36,8);x.fill();x.strokeStyle=LCOL[c.b.layer];x.lineWidth=2;x.stroke();x.font=`700 15px ${F}`;x.fillStyle='#efe3cc';let tx=`${LAYER_NAME[c.b.layer]} from ${c.b.fromLabel}`;while(x.measureText(tx).width>200)tx=tx.slice(0,-2)+'…';x.fillText(tx,cx+8,cy+24);});
    if(g0>0){x.font=`700 15px ${F}`;x.fillStyle='#bfae95';x.fillText(`◀ ${g0} earlier`,30,top-6);}
    // credits
    const cx0=TREEW+20,cw=WW-cx0-30,cr=St.credits(v.id);x.fillStyle='#130f0b';x.fillRect(cx0-10,20,cw+20,CHT-34);x.strokeStyle='rgba(255,255,255,.1)';x.lineWidth=2;x.strokeRect(cx0-10,20,cw+20,CHT-34);
    x.font=`800 26px ${F}`;x.fillStyle='#fff6e2';x.fillText('CREDITS · '+v.label,cx0+8,58);
    x.font=`600 16px ${F}`;x.fillStyle='#d8c9b0';let y=88;for(const l of wrapText(x,'Ancestry: '+cr.ancestry.join(' ← '),cw-80).slice(0,3)){x.fillText(l,cx0+8,y);y+=21;}
    y+=12;x.font=`800 17px ${F}`;x.fillStyle='#f2b84b';x.fillText('CHTO MADE THE HITS AND NOTES',cx0+8,y);y+=12;
    for(const m of cr.makers.slice(0,6)){const bw=cw-210;x.fillStyle='#221a13';x.fillRect(cx0+150,y+4,bw,16);x.fillStyle=m.key==='you'?'#58d7e8':'#f2b84b';x.fillRect(cx0+150,y+4,Math.max(2,bw*m.pct/100),16);
      x.font=`700 15px ${F}`;x.fillStyle='#efe3cc';x.fillText(MAKERS[m.key].name+(MAKERS[m.key].demo?' (demo)':''),cx0+8,y+18);x.textAlign='right';x.fillText(m.pct+'%',cx0+cw-4,y+18);x.textAlign='left';y+=24;}
    if(cr.makers.length>6){x.font=`600 14px ${F}`;x.fillStyle='#bfae95';x.fillText(`+ ${cr.makers.length-6} more`,cx0+8,y+14);y+=20;}
    y+=30;x.font=`800 17px ${F}`;x.fillStyle='#f2b84b';x.fillText('FROM CHTICH SONGS',cx0+8,y);y+=8;
    for(const s of cr.songs.slice(0,3)){x.font=`700 15px ${F}`;x.fillStyle='#efe3cc';x.fillText(`${s.key} — ${s.pct}%`,cx0+8,y+18);y+=22;}
    y+=8;x.font=`700 15px ${F}`;x.fillStyle='#bfae95';x.fillText(`${cr.how.inherited} inherited · ${cr.how.borrowed} borrowed · ${cr.how.new} new`,cx0+8,y+14);
    x.font=`600 13px ${F}`;x.fillStyle='#8c7f70';wrapText(x,'Shares count hits and notes, not money. Demo makers are placeholders. Nothing here is inscribed or paid.',cw-20).slice(0,2).forEach((l,i)=>x.fillText(l,cx0+8,CHT-48+i*17));
    helpRect={x:WW-70,y:14,w:50,h:44};x.fillStyle='#2a2016';rr(x,helpRect.x,helpRect.y,helpRect.w,helpRect.h,10);x.fill();x.font=`800 26px ${F}`;x.fillStyle='#f2b84b';x.textAlign='center';x.fillText('?',helpRect.x+25,helpRect.y+32);x.textAlign='left';
  }
  wallTex.userData.redraw=drawWall;
  function leds_(){for(let i=0;i<16;i++)leds.setColorAt(i,col.set(B.playing&&i===B.step?0xffe2a8:i%4===0?0x5a3b12:0x1d2a2c));leds.instanceColor.needsUpdate=true;}
  // ---- centre-dot picks (nothing locks the view) ----
  const HOW={inherited:'inherited',borrowed:'borrowed',new:'new in this version'};
  const press=id=>{btns[id].press=.14;({play:B.toggle,ab:B.toggleAB,fork:()=>B.fork(),vary:()=>B.vary(),borrow:()=>B.borrow()})[id]();};
  app.addPick(screen,{id:'booth:screen',reach:3.4,resolve(h){if(!h.uv)return null;const v=cur(),px=h.uv.x*CW,py=(1-h.uv.y)*CH,r=Math.floor((py-GY)/(CEH+RG)),inRow=r>=0&&r<6&&(py-GY)-r*(CEH+RG)<=CEH,s=Math.floor((px-GX)/CEW);
    if(inRow&&s>=0&&s<16&&(px-GX)-s*CEW<=CEW-6){const hv=B.hearing(),info=St.cellInfo(hv.id,r,s),mine=v.mine;
      return {id:`booth:cell:${r}:${s}:${hv.id}:${info.on}:${info.versionId||''}:${hv.cells[r][s]}`,title:`${ROWS[r].label} · step ${s+1}`,
        sub:info.on?`${info.makerName} · ${info.song} ${info.version} · ${HOW[info.how]}${info.via?' (via '+info.via+')':''}`:'Empty step',
        hint:B.ab?'You are hearing the parent — click to go back to your version':mine?`Click to ${info.on?'change':'add'} it — credited to ${v.label}`:`Click to ${info.on?'change':'add'} it — starts your own fork`,
        click:()=>{if(B.ab){B.toggleAB();return;}B.edit(r,s);},hover:on=>{B.hoverCell=on?[r,s]:null;B.dirty=true;}};}
    if(inRow&&px<GX-8){const li=St.layerInfo(v.id,ROWS[r].layer);return {id:'booth:rowlabel:'+r+':'+v.id+':'+B.layer,title:ROWS[r].label+' — '+LAYER_NAME[ROWS[r].layer]+' layer',sub:li.empty?'Empty':`${li.makerName} · ${li.song} ${li.version} · ${HOW[li.how]}`,hint:B.layer===ROWS[r].layer?'Chosen — click to let the booth pick':'Click to choose this layer for Fork / Vary / Borrow',click:()=>B.chooseLayer(ROWS[r].layer)};}
    return {id:'booth:screen:'+v.id+B.playing,title:`${fam().title} · ${v.label}`,sub:`${fam().style} · ${fam().bpm} BPM · ${keyName(fam())}`,hint:'Aim at any hit to see who made it — click a step to edit it'};}});
  const BTN={play:['Play / Stop',()=>B.playing?'Playing — click to stop':'Click to play this version'],ab:['Hear parent',()=>!cur().parent?'This version has no parent':B.ab?`Hearing ${St.get(cur().parent).label} — click to go back to ${cur().label}`:`Switch to ${St.get(cur().parent).label} without stopping the music`],
    fork:['FORK',()=>`Make your own copy of ${cur().label} with a fresh ${B.layer?LAYER_NAME[B.layer].toLowerCase():'layer'} variation — credits kept`],vary:['Vary',()=>`A new ${B.layer?LAYER_NAME[B.layer].toLowerCase():'random-layer'} variation${cur().mine?'':' (starts your own fork)'}`],
    borrow:['Borrow',()=>`Bring in ${B.layer?'the '+LAYER_NAME[B.layer].toLowerCase():'a layer'} from another song — still credited to its makers`]};
  for(const id in btns)app.addPick(btns[id].cap,{id:'booth:btn:'+id,resolve:()=>({id:`booth:btn:${id}:${B.playing}:${B.ab}:${B.layer}:${St.cur}`,title:BTN[id][0],sub:'Audionaut console',hint:BTN[id][1](),click:()=>press(id)})});
  cards.forEach(c=>{const pk={id:'booth:song:'+c.fam,resolve:()=>{const f=St.family(c.fam),here=cur().fam===c.fam;return {id:`booth:song:${c.fam}:${here}:${St.cur}`,title:`“${f.title}” — ${f.style}`,sub:`${f.bpm} BPM · ${keyName(f)} · ${St.tree(f.id).nodes.length} versions`,hint:here?'Click to go back to its latest original version':'Click to load this song and its family tree',click:()=>B.loadSong(c.fam)};}};app.addPick(c.mesh,pk);app.addPick(c.body,pk);});
  blocks.forEach(bk=>{const pk={id:'booth:layer:'+bk.layer,resolve:()=>{const li=St.layerInfo(St.cur,bk.layer),sel=B.layer===bk.layer;return {id:`booth:layer:${bk.layer}:${sel}:${St.cur}`,title:LAYER_NAME[bk.layer]+' layer',sub:li.empty?'Empty in this version':`${li.makerName} · ${li.song} ${li.version} · ${HOW[li.how]}`,hint:sel?'Chosen — click to let the booth pick':'Click to choose it for Fork / Vary / Borrow',click:()=>B.chooseLayer(bk.layer)};}};app.addPick(bk.mesh,pk);app.addPick(bk.face,pk);});
  const resetPick={id:'booth:reset',title:'Reset demo',sub:'Back to the six starting songs',hint:'Click to clear every fork for the next visitor',click:()=>B.reset()};
  app.addPick(resetFace,resetPick);app.addPick(resetBox,resetPick);
  app.addPick(wall,{id:'booth:wall',reach:4,resolve(h){if(!h.uv)return null;const px=h.uv.x*WW,py=(1-h.uv.y)*WH;
    const tb=py<TB&&tabRects.find(r=>px>=r.x&&px<=r.x+r.w);if(tb){const T=topic(tb.id),on=B.topic===tb.id;return {id:'booth:tab:'+tb.id+':'+on,title:T.title,sub:T.status?T.status+(T.kicker?' · '+T.kicker:''):'Versions of the song you are on, and who made them',hint:on?'Showing now':'Click to show it on the big screen',click:()=>B.setTopic(tb.id)};}
    if(B.topic!=='tree'){const T=topic(B.topic);return {id:'booth:wall:topic:'+T.id,title:T.title,sub:T.kicker,hint:'Use the tabs along the top, or the Learn lecterns outside the booth',click:()=>app.ui.openBoothTopic(T.id)};}
    if(helpRect&&px>=helpRect.x&&px<=helpRect.x+helpRect.w&&py>=helpRect.y&&py<=helpRect.y+helpRect.h)return {id:'booth:wall:help',title:'How forking works',sub:'The Audionaut',hint:'Click for the short explanation',click:B.about};
    const n=nodeRects.find(r=>px>=r.x&&px<=r.x+r.w&&py>=r.y&&py<=r.y+r.h);
    if(n){const here=n.id===St.cur;return {id:'booth:node:'+n.id+':'+here,title:n.label+(n.mine?' (your fork)':''),sub:`${makerLabel(n.maker)}${n.parent?' · from '+St.get(n.parent).label:' · the first version'}`,hint:here?'You are here':'Click to hear it',click:()=>B.select(n.id)};}
    if(px>TREEW)return {id:'booth:wall:credits:'+St.cur,title:'Credits · '+cur().label,sub:'Ancestry, makers and shares of the hits and notes',hint:'Click for the full credits',click:B.credits};
    return {id:'booth:wall:tree:'+St.cur,title:'Family tree · '+fam().title,sub:`${St.tree(fam().id).nodes.length} versions`,hint:'Aim at a version and click to hear it'};}});
  // ---- "Learn" lecterns either side of the opening: tiles that switch the big screen to a topic ----
  const LW=512,LH=384,tileAt=(i)=>({x:16+(i%2)*244,y:96+Math.floor(i/2)*140,w:236,h:130});
  const lecterns=LECTERNS.map((L,i)=>{const lx=i?BOOTH.x+W/2+.78:BOOTH.x-W/2-.78,lz=WALL_Z+.55,lg=new THREE.Group();lg.position.set(lx,0,lz);lg.rotation.y=i?-.32:.32;scene.add(lg);
    box(lg,.4,.8,.3,M.walnut,0,.4,0);nc(box(lg,.44,.04,.34,M.dark,0,.82,0,{cast:false}));
    const tg=new THREE.Group();tg.position.set(0,1.05,.03);tg.rotation.x=-.72;lg.add(tg);nc(box(tg,.6,.46,.03,M.black,0,0,-.016,{cast:false}));
    const tex=art.panel(LW,LH,()=>{}),face=app.plane(tg,.57,.57*LH/LW,new THREE.MeshBasicMaterial({map:tex,toneMapped:false}),0,0,.001);
    app.addCollider(lx-.3,lx+.3,lz-.26,lz+.26);return {L,lg,tex,face,hover:-1};});
  function drawLectern(le){const x=le.tex.userData.canvas.getContext('2d'),L=le.L;x.fillStyle='#120e0b';x.fillRect(0,0,LW,LH);x.fillStyle='#f2b84b';x.fillRect(0,0,LW,8);
    x.textBaseline='alphabetic';x.textAlign='left';x.font=`800 30px ${F}`;x.fillStyle='#fff6e2';x.fillText(L.head,18,48);x.font=`600 16px ${F}`;x.fillStyle='#bfae95';x.fillText(L.sub,18,76);
    L.tiles.forEach((id,i)=>{const r=tileAt(i),T=topic(id),on=B.topic===id,hv=le.hover===i;x.fillStyle=on?'#3a2a12':hv?'#2a2016':'#1b1510';rr(x,r.x,r.y,r.w,r.h,12);x.fill();x.lineWidth=on?5:3;x.strokeStyle=on?'#f2b84b':T.status?STATUS_COL[T.status]:'#58d7e8';x.stroke();
      x.font=`800 22px ${F}`;x.fillStyle='#fff6e2';wrapText(x,T.title,r.w-26).slice(0,2).forEach((l,k)=>x.fillText(l,r.x+14,r.y+34+k*26));
      x.font=`800 13px ${F}`;x.fillStyle=T.status?STATUS_COL[T.status]:'#58d7e8';x.fillText(on?'▶ ON THE BIG SCREEN':(T.status||'IN THE BOOTH'),r.x+14,r.y+r.h-16);});
    le.tex.needsUpdate=true;}
  function drawLecterns(){lecterns.forEach(drawLectern);}
  lecterns.forEach((le,li)=>app.addPick(le.face,{id:'booth:learn:'+li,reach:3.2,resolve(h){if(!h.uv)return null;const px=h.uv.x*LW,py=(1-h.uv.y)*LH;
    const i=le.L.tiles.findIndex((id,k)=>{const r=tileAt(k);return px>=r.x&&px<=r.x+r.w&&py>=r.y&&py<=r.y+r.h;});
    if(i<0)return {id:'booth:learn:'+li+':head',title:le.L.head,sub:'Four short explainers for the big screen in the Audionaut booth',hint:'Aim at a tile and click'};
    const id=le.L.tiles[i],T=topic(id),on=B.topic===id;return {id:`booth:learn:${li}:${id}:${on}`,title:T.title,sub:T.kicker||'The song you are on, its versions and who made them',hint:on?'Showing on the big screen':'Click to show it on the big screen in the booth',click:()=>B.setTopic(id),
      hover:v=>{le.hover=v?i:-1;drawLectern(le);}};}}));
  const infoPick=(mesh,id,title)=>app.addPick(mesh,{id:'booth:info:'+id,resolve:()=>{const T=topic(id);return {id:'booth:info:'+id+':'+(B.topic===id),title,sub:T.title,hint:B.topic===id?'Showing on the big screen':'Click to show it on the big screen',click:()=>B.setTopic(id)};}});
  infoPick(songsHead,'audionals','Songs as instructions');infoPick(layersHead,'forking','Reusable, credited parts');infoPick(sign,'studio','The Audionaut');
  // ---- station panel (bottom-left while you are at the booth; compact on phones) ----
  const $st=()=>document.getElementById('station');
  const wx0=BOOTH.x-W/2,wx1=BOOTH.x+W/2,wz1=BOOTH.z+D/2;
  for(const sx of [-1,1])app.addOccluder(.06,H-.12,D-.16,BOOTH.x+sx*(W/2-.05),H/2,BOOTH.z-.02);
  app.addOccluder(1.18,.84,.56,BOOTH.x,.48,BOOTH.z+.06);app.addOccluder(W,.34,.12,BOOTH.x,H-.17,wz1-.06);
  B.near=()=>{const p=app.player;return app.state.entered&&app.state.mode==='room'&&!app.state.modal&&p.x>wx0-.7&&p.x<wx1+.7&&p.z<wz1+1.7;};
  function head(){const el=$st();if(!el||el.hidden)return;for(const b of el.querySelectorAll('.bc[data-c]'))b.classList.toggle('hd',+b.dataset.c===B.step);}
  function panel(){if(!B.near||!B.near())return;const v=cur(),f=fam(),narrow=innerWidth<760||innerHeight>innerWidth,last=v.last||{on:[],off:[],chg:[]},ls=new Set([...last.on,...last.chg,...last.off]),hv=B.hearing();
    const grid=narrow?'':`<div class="bgrid">${ROWS.map((row,r)=>`<div class="br"><button data-s="layer:${row.layer}" class="bl${B.layer===row.layer?' sel':''}" style="--c:${ROWCOL[r]}" title="Choose the ${LAYER_NAME[row.layer].toLowerCase()} layer">${row.label.slice(0,3)}</button>${hv.cells[r].map((val,s)=>{const on=r<3?!!val:val!=null,how=on?St.how(hv.id,hv.org[r][s]):'';return `<button data-s="cell:${r}:${s}" data-c="${s}" class="bc${on?' on '+how:''}${s%4===0?' q':''}${!B.ab&&ls.has(r+':'+s)?' ch':''}" style="--c:${ROWCOL[r]}" aria-label="${row.label} step ${s+1} ${on?'on, '+how:'off'}" aria-pressed="${on}"></button>`;}).join('')}</div>`).join('')}</div>`;
    app.ui.station(`<div data-booth></div><h3>${esc(f.title)} · ${esc(v.label)} <span class="dim small">${B.playing?(B.ab?'hearing parent':'playing'):'ready'}</span></h3><p class="step">${v.kind==='fork'?'Forked by':'By'} ${esc(makerLabel(v.maker))} · ${f.bpm} BPM · ${esc(keyName(f))}</p>
${B.note?`<p class="bnote">${esc(B.note)}</p>`:''}${grid}
<div class="btns"><button data-s="fork" class="gold big">Fork</button><button data-s="vary">Vary</button><button data-s="borrow">Borrow</button><button data-s="play">${B.playing?'■ Stop':'▶ Play'}</button><button data-s="ab"${v.parent?'':' disabled'} class="${B.ab?'on':''}">Hear parent</button></div>
<div class="btns bchips"><span class="dim small">Layer</span><button data-s="layer:auto" class="${B.layer?'':'on'}">Any</button>${LAYERS.map(l=>`<button data-s="layer:${l}" class="${B.layer===l?'on':''}">${LAYER_NAME[l]}</button>`).join('')}</div>
<div class="btns bchips"><span class="dim small">Learn</span>${TOPICS.map(t=>`<button data-s="topic:${t.id}" class="${B.topic===t.id?'on':''}">${esc(t.short)}</button>`).join('')}<button data-s="read">Read ▸</button></div>
<div class="btns bchips"><label class="dim small" for="bsong">Song</label><select id="bsong" data-sel="song">${St.families.map(x=>`<option value="${x.id}"${x.id===v.fam?' selected':''}>${esc(x.title)} — ${esc(x.style)}</option>`).join('')}</select><button data-s="about">How it works</button><button data-s="reset">Reset</button></div>`,act);
    document.body.classList.add('booth-near');head();}
  B.panel=panel;
  function act(a){if(a==='fork'||a==='vary'||a==='borrow'||a==='ab'||a==='play')return press(a);if(a==='reset')return B.reset();if(a==='about')return B.about();if(a==='credits')return B.credits();
    if(a==='read')return B.topic==='tree'?B.credits():app.ui.openBoothTopic(B.topic);
    const [k,p,q]=a.split(':');if(k==='topic')return B.setTopic(p);if(k==='cell'){if(B.ab)B.toggleAB();else B.edit(+p,+q);}else if(k==='layer')B.chooseLayer(p==='auto'?null:p);else if(k==='song')B.loadSong(p);else if(k==='node')B.select(a.slice(5));}
  B.act=act;
  document.addEventListener('change',e=>{const t=e.target;if(t&&t.id==='bsong'&&t.closest('#station'))B.loadSong(t.value);});
  let wasNear=false;
  function nearCheck(){const n=B.near();if(n&&!wasNear){if(B.autoTopic){B.autoTopic=false;B.topic='tree';B.wallDirty=true;drawLecterns();}panel();}else if(!n&&wasNear){document.body.classList.remove('booth-near');const el=$st();if(el&&!el.hidden&&el.querySelector('[data-booth]'))app.ui.stationHide();if(B.hoverCell){B.hoverCell=null;B.dirty=true;}}wasNear=n;}
  app.on('mode',()=>{wasNear=false;});addEventListener('resize',()=>{if(wasNear)panel();});
  // ---- world positions (tests and the quick-jump) ----
  B.world=(what,a,b)=>{const p=new THREE.Vector3();
    if(what==='cell'){const u=(GX+b*CEW+(CEW-6)/2)/CW,v=1-(GY+a*(CEH+RG)+CEH/2)/CH;p.set((u-.5)*.94,(v-.5)*.572,0);screen.localToWorld(p);}
    else if(what==='rowlabel'){const v=1-(GY+a*(CEH+RG)+CEH/2)/CH;p.set((80/CW-.5)*.94,(v-.5)*.572,0);screen.localToWorld(p);}
    else if(what==='node'){const n=nodeRects.find(r=>r.id===a);if(!n)return null;p.set(((n.x+n.w/2)/WW-.5)*2.3,(.5-(n.y+n.h/2)/WH)*2.3*WH/WW,0);wall.localToWorld(p);}
    else if(what==='tab'){const r=tabRects.find(t=>t.id===a);p.set(((r.x+r.w/2)/WW-.5)*2.3,(.5-(r.y+r.h/2)/WH)*2.3*WH/WW,0);wall.localToWorld(p);}
    else if(what==='learn'){const le=lecterns[a],r=tileAt(b);p.set(((r.x+r.w/2)/LW-.5)*.57,(.5-(r.y+r.h/2)/LH)*.57*LH/LW,0);le.face.localToWorld(p);}
    else if(what==='head'){({songs:songsHead,layers:layersHead,sign})[a].getWorldPosition(p);}
    else if(what==='credits'){p.set(((TREEW+300)/WW-.5)*2.3,0,0);wall.localToWorld(p);}
    else if(what==='btn'){btns[a].cap.getWorldPosition(p);p.y+=.02;}else if(what==='song')cards.find(c=>c.fam===a).mesh.getWorldPosition(p);
    else if(what==='layer')blocks.find(bk=>bk.layer===a).face.getWorldPosition(p);else if(what==='reset')resetFace.getWorldPosition(p);else screen.getWorldPosition(p);
    return {x:p.x,y:p.y,z:p.z};};
  // ---- per frame ----
  let since=0;const fwd=new THREE.Vector3(),up=new THREE.Vector3();
  B.update=dt=>{const rd=app.realDt||dt;nearCheck();
    if(B.playing){if(out&&ac.state==='running'){tick();while(queue.length&&queue[0][1]<=ac.currentTime+.012)setStep(queue.shift()[0]);}
      else{acc+=rd;const s16=60/St.family(B.hearing().fam).bpm/4;if(acc>s16*4)acc=s16;while(acc>=s16){acc-=s16;setStep((B.step+1)%16);}}}
    for(let r=0;r<6;r++)if(B.levels[r]>.01)B.levels[r]*=Math.exp(-dt*7);
    if(B.flash>0){B.flash-=rd;if(B.flash<=0)B.dirty=true;}
    since+=dt;if(B.dirty||B.playing&&since>.066){since=0;draw();leds_();}
    if(!B.near()&&performance.now()-B.topicAt>(B.autoTopic?9000:25000)){const i=TOPICS.findIndex(t=>t.id===B.topic);B.setTopic(TOPICS[(i+1)%TOPICS.length].id,true);B.topicAt=performance.now();}
    if(B.wallDirty)drawWall();
    for(const k in btns){const b=btns[k];if(b.press>0){b.press-=dt;b.cap.position.y=b.press>0?b.cap.userData.y0-.009:b.cap.userData.y0;}}
    const here=cur().fam;cards.forEach(c=>{const s=c.fam===here,k=1-Math.exp(-dt*8);c.h.position.y+=((s?1.33:1.29)-c.h.position.y)*k;c.h.position.z+=((s?.15:.11)-c.h.position.z)*k;c.gm.opacity+=((s?.85:0)-c.gm.opacity)*k;c.front.emissiveIntensity+=((s?.6:.3)-c.front.emissiveIntensity)*k;});
    if(out&&B.playing){const c=app.camera,l=ac.listener;c.getWorldDirection(fwd);up.set(0,1,0).applyQuaternion(c.quaternion);
      if(l.positionX){const t=ac.currentTime+.03;for(const [p,v] of [[l.positionX,c.position.x],[l.positionY,c.position.y],[l.positionZ,c.position.z],[l.forwardX,fwd.x],[l.forwardY,fwd.y],[l.forwardZ,fwd.z],[l.upX,up.x],[l.upY,up.y],[l.upZ,up.z]])p.linearRampToValueAtTime(v,t);}
      else{l.setPosition(c.position.x,c.position.y,c.position.z);l.setOrientation(fwd.x,fwd.y,fwd.z,up.x,up.y,up.z);}}};
  B.qa=()=>{const v=cur();return {playing:B.playing,audio:B.audio(),step:B.step,cur:v.id,label:v.label,fam:v.fam,mine:!!v.mine,parent:v.parent,ab:B.ab,hearing:B.hearing().id,layer:B.layer,note:B.note||'',last:v.last?v.last.n:0,
    topic:B.topic,autoTopic:!!B.autoTopic,versions:St.versions.size,yours:[...St.versions.values()].filter(x=>x.mine).length,near:B.near(),loud:B.loud(),hover:B.hoverCell,unique:St.unique(),nodes:nodeRects.length};};
  B.note='';blocks.forEach(drawBlock);btnColor();draw();drawWall();drawLecterns();leds_();B.TOPICS=TOPICS;return B;
}
