import * as THREE from 'three';
import {clamp,easeIO,fmt,esc,fitText} from './util.js';

// 1990s-style CD deck with a motorised tray; all transport goes through guarded physical state.
export function initDeck(app){
  const {scene,art,mats:M,box,cyl}=app;
  const K={tray:'closed',t:0,disc:null,slot:null,load:null,press:new Map(),msg:'',msgT:0};app.deck=K;
  const BX=-5.32,BZ=-4.62,TOP=.95;
  const g=new THREE.Group();scene.add(g);
  box(g,2,.9,.9,M.walnut,BX,.45,BZ);box(g,2.1,.05,.98,M.dark,BX,TOP-.025,BZ);box(g,2.1,.012,.02,M.brass,BX,TOP+.004,BZ+.485,{cast:false});
  box(g,2,.7,.04,M.dark,BX,TOP+.35,BZ-.43);box(g,1.9,.03,.22,M.walnut,BX,TOP+.62,BZ-.34);
  app.addCollider(BX-1.05,BX+1.05,-5.5,BZ+.5);app.addOccluder(2.1,TOP,.98,BX,TOP/2,BZ);
  const d=new THREE.Group();d.position.set(BX,TOP,BZ+.08);g.add(d);K.root=d;
  for(const [x,z] of [[-.22,-.13],[.22,-.13],[-.22,.13],[.22,.13]])cyl(d,.02,.02,.012,M.rubber,x,.006,z,12);
  const body=box(d,.52,.12,.34,M.black,0,.072,0);box(d,.524,.124,.006,M.silver,0,.072,.171);
  box(d,.21,.028,.004,M.matte,-.11,.078,.1735,{cast:false});
  const tray=new THREE.Group();tray.position.set(-.11,.078,0);d.add(tray);
  const plate=box(tray,.2,.008,.2,M.matte,0,0,.065);box(tray,.204,.024,.008,M.silver,0,0,.171);
  const recess=new THREE.Mesh(new THREE.RingGeometry(.012,.085,48),new THREE.MeshStandardMaterial({color:0x1c1c20,roughness:.35,metalness:.3}));recess.rotation.x=-Math.PI/2;recess.position.set(0,.0046,.065);tray.add(recess);
  cyl(tray,.0095,.0095,.006,M.silver,0,.007,.065,16);
  const discGeo=new THREE.RingGeometry(.0102,.0816,64);let discMat=null;
  const disc=new THREE.Mesh(discGeo,M.matte);disc.rotation.x=-Math.PI/2;disc.position.set(0,.0062,.065);disc.visible=false;tray.add(disc);
  const flying=new THREE.Mesh(discGeo,M.matte);flying.visible=false;d.add(flying);
  K.vfdTex=art.panel(512,128,()=>{});box(d,.215,.058,.004,M.matte,.13,.092,.1745,{cast:false});
  app.plane(d,.205,.05,new THREE.MeshBasicMaterial({map:K.vfdTex,toneMapped:false}),.13,.092,.1768);
  const lab=art.panel(512,48,(x,w,h)=>{x.fillStyle='#b4b8be';x.fillRect(0,0,w,h);x.fillStyle='#111';x.font=`700 22px ${art.font}`;x.textAlign='center';['EJECT','PLAY','PAUSE','PREV','NEXT'].forEach((t,i)=>x.fillText(t,51+i*102.5,32));});
  app.plane(d,.215,.02,new THREE.MeshBasicMaterial({map:lab}),.13,.054,.1745);
  const btnM=new THREE.MeshStandardMaterial({color:0x2a2c30,roughness:.4,metalness:.5}),btns={};
  ['eject','play','pause','prev','next'].forEach((n,i)=>{const b=box(d,.034,.016,.014,btnM,.044+i*.043,.033,.178);b.userData.btn=n;b.userData.z0=.178;btns[n]=b;});
  const led=(c,x)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.004,8,6),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,.108,.175);d.add(m);return m;};
  led(0x35ff6a,-.235);const playLed=led(0x332200,-.215);
  box(d,.06,.012,.004,M.matte,-.2,.03,.1745,{cast:false});
  // headphones + artwork monitor
  const hp=new THREE.Group();hp.position.set(.72,0,-.02);d.add(hp);cyl(hp,.06,.07,.015,M.black,0,.008,0);cyl(hp,.008,.008,.26,M.black,0,.14,0,8);
  const band=new THREE.Mesh(new THREE.TorusGeometry(.085,.009,8,24,Math.PI),M.matte);band.position.y=.22;hp.add(band);
  for(const s of [-1,1]){const c=cyl(hp,.045,.045,.03,M.black,s*.085,.2,0,20);c.rotation.z=Math.PI/2;const p=cyl(hp,.04,.04,.012,M.brass,s*.103,.2,0,20);p.rotation.z=Math.PI/2;}
  const mon=new THREE.Group();mon.position.set(-.72,0,-.08);mon.rotation.y=.25;d.add(mon);box(mon,.36,.3,.26,M.black,0,.17,0);box(mon,.2,.02,.2,M.black,0,.01,0);
  K.monTex=art.panel(256,256,()=>{});app.plane(mon,.3,.24,new THREE.MeshBasicMaterial({map:K.monTex,toneMapped:false}),0,.175,.131);
  const sg=art.card('CD LISTENING BOOTH','Eject · load · close · play','#17120f','#f2b84b');app.plane(g,.9,.2,new THREE.MeshBasicMaterial({map:sg,toneMapped:false}),BX,TOP+.48,BZ-.408);
  // picks
  const roomPick=box(g,1.9,.55,.7,M.pick,BX,TOP+.28,BZ+.05);roomPick.removeFromParent();
  app.addPick(roomPick,{id:'deck',title:'CD Listening Booth',get sub(){return K.disc?'Loaded: '+K.disc.title:app.carry&&app.carry.kind==='cd'?'You are carrying a disc':'1990s CD deck · tray empty';},hint:'Click to step up to the player',reach:3.6,click:()=>K.focus()});
  const focusPicks=[...Object.values(btns),plate,disc,recess,body];
  K.focusPose={pos:new THREE.Vector3(BX+.02,1.4,BZ+.86),look:new THREE.Vector3(BX+.02,TOP+.06,BZ+.2)};
  K.focus=()=>{const look=K.focusPose.look,d=Math.max(.77,.74/(1.1547*app.camera.aspect));K.focusPose.pos.copy(look).add(new THREE.Vector3(0,.51,.86).normalize().multiplyScalar(d));app.setFocus('cd',K.focusPose.pos,look);panel();};
  const ray=new THREE.Raycaster(),v2=new THREE.Vector2();
  K.pickAt=(cx,cy)=>{v2.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(v2,app.camera);const h=ray.intersectObjects(focusPicks.filter(o=>o.visible),false)[0];if(!h)return null;
    return h.object.userData.btn?{btn:h.object.userData.btn}:(h.object===plate||h.object===disc||h.object===recess)?{tray:true}:{body:true};};
  K.click=(cx,cy)=>{const h=K.pickAt(cx,cy);if(!h)return null;if(h.btn)K.button(h.btn);else if(h.tray)K.trayClick();return h;};
  K.hover=(cx,cy)=>{const h=K.pickAt(cx,cy);app.setCursor(h&&(h.btn||h.tray)?'pointer':'');};
  K.project=name=>{const o=name==='tray'?plate:btns[name];const p=new THREE.Vector3();o.getWorldPosition(p);if(name!=='tray')p.z+=.008;p.project(app.camera);return {x:(p.x+1)/2*innerWidth,y:(1-p.y)/2*innerHeight};};
  const say=(m,toast)=>{K.msg=m;K.msgT=2.2;vfd();if(toast)app.toast(toast);};
  K.flash=m=>say(m);
  K.button=n=>{K.press.set(n,.14);app.foley('click');
    if(n==='eject')return K.eject();
    if(K.tray!=='closed'){say('CLOSE TRAY','Close the tray first — press Eject.');return false;}
    if(!K.disc){say('NO DISC','No disc loaded — take a CD from its case and load it.');return false;}
    const pb=app.playback,mine=pb.s.source==='cd-deck'&&pb.s.rel===K.disc;
    if(n==='play'){if(mine)pb.resume();else pb.play(K.disc,0,'cd-deck',0);}
    else if(n==='pause'){if(mine)pb.pause();}
    else if(n==='next'){if(mine)pb.next();else pb.play(K.disc,0,'cd-deck',0);}
    else if(n==='prev'){if(mine)pb.prev();else pb.play(K.disc,0,'cd-deck',0);}
    return true;};
  K.canPlay=()=>K.tray==='closed'&&!!K.disc;
  K.eject=()=>{
    if(K.tray==='opening'||K.tray==='closing'||K.load){say('WAIT');return false;}
    if(K.tray==='closed'){if(app.playback.s.source==='cd-deck')app.playback.pause();K.tray='opening';app.foley('tray');}
    else{K.tray='closing';app.foley('tray');}
    vfd();panel();return true;};
  K.trayClick=()=>{
    if(K.load||K.tray==='opening'||K.tray==='closing'){app.toast('The tray is moving.');return false;}
    if(K.tray!=='open'){app.toast('The tray is closed — press Eject to open it.');return false;}
    if(K.disc){if(app.carry){app.toast('Your hands are full.');return false;}
      app.setCarry({kind:'cd',rel:K.disc,slot:K.slot});app.cd={state:'carried',rel:K.disc,slot:K.slot};if(app.playback.s.source==='cd-deck')app.playback.stop();K.disc=null;K.slot=null;disc.visible=false;app.foley('pull');vfd();panel();return true;}
    if(!app.carry||app.carry.kind!=='cd'){app.toast(app.carry?'That is a record sleeve — the turntable is at the vinyl bench.':'No disc in hand. Open a jewel case and take its CD first.');return false;}
    const c=app.carry;if(discMat)discMat.dispose();discMat=new THREE.MeshStandardMaterial({map:art.disc(c.rel),roughness:.22,metalness:.55,side:THREE.DoubleSide});disc.material=flying.material=discMat;
    const w=app.inspector.carryWorld();const from=d.worldToLocal(w.p.clone());const to=new THREE.Vector3();disc.getWorldPosition(to);d.worldToLocal(to);
    K.load={t:0,from,to,rel:c.rel,slot:c.slot};flying.visible=true;flying.position.copy(from);flying.rotation.set(-.9,0,0);app.setCarry(null,true);app.cd={state:'tray',rel:c.rel,slot:c.slot};app.foley('slide');panel();return true;};
  K.returnDisc=()=>{
    if(app.carry&&app.carry.kind==='cd'){app.cd={state:'none'};app.setCarry(null);app.toast('Disc returned to its original case.');app.emit('stock');panel();return true;}
    if(K.disc&&K.tray==='open'&&!K.load){if(app.playback.s.source==='cd-deck')app.playback.stop();app.toast('“'+K.disc.title+'” is back in its original case.');K.disc=null;K.slot=null;disc.visible=false;app.cd={state:'none'};vfd();panel();app.emit('stock');return true;}
    if(K.disc){app.toast('Press Eject first — the disc can only be taken from an open tray.');return false;}
    return false;};
  function vfd(){const x=K.vfdTex.userData.canvas.getContext('2d'),pb=app.playback.s,mine=pb.source==='cd-deck'&&K.disc&&pb.rel===K.disc;
    x.fillStyle='#03130b';x.fillRect(0,0,512,128);x.fillStyle='#39ff9a';x.shadowColor='#39ff9a';x.shadowBlur=8;x.textBaseline='alphabetic';x.textAlign='left';
    let st=K.msgT>0?K.msg:K.tray==='opening'||K.tray==='open'?'OPEN':K.tray==='closing'?'CLOSE':K.load?'LOAD':!K.disc?'NO DISC':mine?(pb.playing?'PLAY ▶':'PAUSE ❚❚'):'STOP ■';
    x.font=`700 30px "Courier New",monospace`;x.fillText(st,14,36);
    if(K.disc&&K.tray==='closed'){const t=mine?K.disc.tracks[pb.idx]:null;x.textAlign='right';x.fillText(mine?`TRK ${String(pb.idx+1).padStart(2,'0')}/${String(K.disc.tracks.length).padStart(2,'0')}  ${fmt(pb.elapsed)}`:`${K.disc.tracks.length} TRK  ${fmt(K.disc.seconds)}`,500,36);
      x.textAlign='left';x.font=`700 26px "Courier New",monospace`;x.fillText(fitText(x,(t?t.title:K.disc.title).toUpperCase(),484),14,76);x.font=`700 20px "Courier New",monospace`;x.fillText(t?`ID #${t.id}  ·  ${fmt(t.seconds)}  ·  ${app.playback.adapter()?'XTRATA':'DEMO TIMER'}`:fitText(x,(K.disc.artist||'XTRATA MUSIC').toUpperCase(),484),14,112);}
    else{x.font=`700 20px "Courier New",monospace`;x.fillText('XTRATA MUSIC · COMPACT DISC DIGITAL',14,112);}
    x.shadowBlur=0;K.vfdTex.needsUpdate=true;playLed.material.color.setHex(mine&&pb.playing?0xffb020:0x332200);}
  K.vfd=vfd;
  function panel(){if(app.state.mode!=='cd')return;const pb=app.playback.s,mine=pb.source==='cd-deck'&&K.disc&&pb.rel===K.disc,cc=app.carry&&app.carry.kind==='cd';
    const step=K.disc&&K.tray==='closed'?(mine&&pb.playing?'Playing — use the deck buttons.':'Disc loaded — press Play.'):K.disc?'Disc on the tray — press Eject to close.':cc?(K.tray==='open'?'Click the open tray to place the disc.':'Press Eject to open the tray.'):'Bring a CD: open a jewel case and take its disc.';
    app.ui.station(`<h3>CD Player</h3><p>${esc(step)}</p><p class="dim small">${K.disc?esc(K.disc.title)+' · '+esc(K.disc.artist||'—'):cc?'Carrying: '+esc(app.carry.rel.title):'Tray empty'}</p>
<div class="btns"><button data-s="eject">Eject</button><button data-s="play">Play</button><button data-s="pause">Pause</button><button data-s="prev" aria-label="Previous track">◀◀</button><button data-s="next" aria-label="Next track">▶▶</button>
${cc&&K.tray==='open'&&!K.disc?'<button data-s="load" class="gold">Place disc on tray</button>':''}${(cc||K.disc)?'<button data-s="return">Return disc to its case</button>':''}<button data-s="back">Step back (Esc)</button></div>`,
      a=>{if(a==='back')app.exitFocus();else if(a==='load')K.trayClick();else if(a==='return')K.returnDisc();else K.button(a);});}
  K.panel=panel;
  app.on('playback',()=>{vfd();panel();});app.on('tick',vfd);app.on('carry',panel);
  K.update=dt=>{
    if(K.msgT>0){K.msgT-=dt;if(K.msgT<=0)vfd();}
    for(const [n,t] of K.press){const b=btns[n],nt=t-dt;b.position.z=b.userData.z0-(nt>0?.006:0);if(nt<=0)K.press.delete(n);else K.press.set(n,nt);}
    if(K.tray==='opening'){K.t=Math.min(1,K.t+dt/.64);if(K.t>=1){K.tray='open';if(K.disc)app.cd.state='tray';vfd();panel();}}
    else if(K.tray==='closing'){K.t=Math.max(0,K.t-dt/.64);if(K.t<=0){K.tray='closed';if(K.disc)app.cd.state='loaded';vfd();panel();app.foley('click');}}
    tray.position.z=easeIO(K.t)*.2;
    if(K.load){const L=K.load;L.t=Math.min(1,L.t+dt/.55);const e=easeIO(L.t);flying.position.lerpVectors(L.from,L.to,e);flying.position.y+=Math.sin(e*Math.PI)*.07;flying.rotation.x=-.9+(-Math.PI/2+.9)*e;
      if(L.t>=1){K.disc=L.rel;K.slot=L.slot;K.load=null;flying.visible=false;disc.visible=true;app.foley('click');vfd();panel();}}
    if(disc.visible&&app.playback.s.playing&&app.playback.s.source==='cd-deck')disc.rotation.z-=dt*20;
  };
  K.qa=()=>({tray:K.tray,t:K.t,disc:K.disc?K.disc.id:null,loading:!!K.load});
  vfd();K.vfdTex.userData.redraw=vfd;return K;
}
