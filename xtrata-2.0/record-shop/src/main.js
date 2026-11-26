import * as THREE from 'three';
import {RAW,normalize} from './catalog.js';
import {clamp,lerp,easeIO,angDiff} from './util.js';
import {initArt} from './art.js';
import {buildRoom} from './room.js';
import {initStock,stockPose,CD,thick} from './cdstock.js';
import {initModels} from './models.js';
import {initInspector} from './inspector.js';
import {initDeck} from './cddeck.js';
import {initVinyl} from './vinyl.js';
import {initPlayback} from './playback.js';
import {initShop} from './shop.js';
import {initUI} from './ui.js';
import {initChain} from './chain.js';
import {initRadio} from './radio.js';

const qs=new URLSearchParams(location.search),$=id=>document.getElementById(id);
const app={THREE,state:{mode:'room',entered:false,locked:false,look:'released',mouseLook:true,lockDenied:qs.has('nolock')||!document.documentElement.requestPointerLock||(matchMedia('(pointer:coarse)').matches&&!matchMedia('(any-pointer:fine)').matches),weather:'live',modal:null,busy:null,zone:'Entrance'},
  player:{x:.05,z:4.22,yaw:0,pitch:0,vx:0,vz:0,moving:false,travel:null},colliders:[],picks:[],carry:null,cd:{state:'none'},handlers:{},anims:[],idleQ:[],notes:[]};
app.on=(ev,fn)=>{(app.handlers[ev]=app.handlers[ev]||[]).push(fn);};
app.emit=ev=>{const h=app.handlers[ev];if(h)for(const f of h){try{f();}catch(e){console.error(e);}}};
app.toast=m=>console.log(m);app.foley=()=>{};app.audioInit=()=>{};
app.anim=(dur,fn)=>new Promise(res=>{app.anims.push({t:0,dur:Math.max(.001,dur),fn,res});});
app.addCollider=(x0,x1,z0,z1)=>app.colliders.push({x0,x1,z0,z1});
app.addPick=(mesh,pick)=>{mesh.userData.pick=pick;mesh.updateMatrixWorld(true);app.picks.push(mesh);return mesh;};
app.addOccluder=(w,h,d,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),app.mats.pick);m.position.set(x,y,z);m.userData.pick=null;m.updateMatrixWorld(true);app.picks.push(m);};
app.whenIdle=fn=>app.idleQ.push(fn);

function fatal(msg){const l=$('loader');l.hidden=false;l.querySelector('p').textContent=msg;}

async function boot(){
  // ---- catalogue: embedded snapshot, optional valid override ----
  const ej=id=>{const e=$(id);if(!e)return null;try{return JSON.parse(e.textContent);}catch(e2){return null;}};
  let cat=normalize(RAW);app.catalogSource='embedded snapshot';
  const bc=ej('bundled-catalog');if(bc&&bc.images&&typeof bc.images==='object')cat.images=bc.images;
  app.media=ej('bundled-media')||{};
  const tryOverride=(raw,label)=>{try{const c=normalize(raw);if(!Object.keys(c.images).length)c.images=cat.images;cat=c;app.catalogSource=label;}catch(e){app.notes.push(label+' rejected ('+e.message+') — using the embedded catalogue.');}};
  if(window.XTRATA_SHOP_DATA)tryOverride(window.XTRATA_SHOP_DATA,'window.XTRATA_SHOP_DATA');
  else if(/^https?:$/.test(location.protocol)&&!qs.has('nodata')){try{const r=await Promise.race([fetch('data.json',{cache:'no-store'}),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),2500))]);if(r.ok)tryOverride(await r.json(),'data.json');}catch(e){}}
  app.catalog=cat;app.relById={};for(const r of cat.releases)app.relById[r.id]=r;
  // ---- renderer ----
  const canvas=$('c');let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch(e){return fatal('This browser could not start WebGL, which the 3D shop needs.');}
  app.renderer=renderer;app.canvas=canvas;
  let PR=clamp(window.devicePixelRatio||1,.85,1.5);renderer.setPixelRatio(PR);renderer.setSize(innerWidth,innerHeight);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.autoClear=false;
  const scene=app.scene=new THREE.Scene(),camera=app.camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.05,90);
  app.fgScene=new THREE.Scene();app.fgCam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.02,8);
  camera.rotation.order='YXZ';
  const art=app.art=initArt(app);await art.preload();
  buildRoom(app);initModels(app);initPlayback(app);initStock(app);initInspector(app);initDeck(app);initVinyl(app);initShop(app);initChain(app);initRadio(app);const ui=initUI(app);
  for(const n of app.notes)app.toast(n);
  const {state,player}=app,stock=app.stock,insp=app.inspector,deck=app.deck,vinyl=app.vinyl;
  app.shop.shuffle((Date.now()^0x5bd1e995)>>>0,true);
  renderer.shadowMap.needsUpdate=true;

  // ---- navigation grid ----
  const BX=7.68,BZ=5.18;
  const blocked=(x,z,r)=>{if(x<-BX||x>BX||z<-BZ||z>BZ)return true;for(const c of app.colliders)if(x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r)return true;return false;};
  app.blocked=blocked;
  const GS=.2,GX0=-7.8,GZ0=-5.4,GW=79,GH=55,grid=new Uint8Array(GW*GH);
  for(let j=0;j<GH;j++)for(let i=0;i<GW;i++)grid[j*GW+i]=blocked(GX0+i*GS,GZ0+j*GS,.36)?1:0;
  const cell=(x,z)=>[clamp(Math.round((x-GX0)/GS),0,GW-1),clamp(Math.round((z-GZ0)/GS),0,GH-1)];
  function freeCell(i,j){if(!grid[j*GW+i])return [i,j];for(let r=1;r<14;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const a=i+di,b=j+dj;if(a>=0&&b>=0&&a<GW&&b<GH&&!grid[b*GW+a])return [a,b];}return [i,j];}
  const clearLine=(ax,az,bx,bz)=>{const d=Math.hypot(bx-ax,bz-az),n=Math.ceil(d/.08);for(let k=0;k<=n;k++){const t=k/n;if(blocked(lerp(ax,bx,t),lerp(az,bz,t),.3))return false;}return true;};
  function findPath(x0,z0,x1,z1){
    if(clearLine(x0,z0,x1,z1))return [[x1,z1]];
    const [si,sj]=freeCell(...cell(x0,z0)),[gi,gj]=freeCell(...cell(x1,z1)),N=GW*GH,gS=new Float32Array(N).fill(1e9),came=new Int32Array(N).fill(-1),closed=new Uint8Array(N),open=[sj*GW+si];gS[open[0]]=0;
    const hh=(i,j)=>Math.hypot(i-gi,j-gj);let found=false;
    while(open.length){let bi=0,bf=1e9;for(let k=0;k<open.length;k++){const n=open[k],f=gS[n]+hh(n%GW,(n/GW)|0);if(f<bf){bf=f;bi=k;}}
      const n=open.splice(bi,1)[0];if(closed[n])continue;closed[n]=1;const i=n%GW,j=(n/GW)|0;if(i===gi&&j===gj){found=true;break;}
      for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const a=i+di,b=j+dj;if(a<0||b<0||a>=GW||b>=GH)continue;const m=b*GW+a;if(grid[m]||closed[m])continue;if(di&&dj&&(grid[j*GW+a]||grid[b*GW+i]))continue;
        const c=gS[n]+(di&&dj?1.4142:1);if(c<gS[m]){gS[m]=c;came[m]=n;open.push(m);}}}
    if(!found)return [[x1,z1]];
    let pts=[],n=gj*GW+gi;while(n>=0){pts.push([GX0+(n%GW)*GS,GZ0+((n/GW)|0)*GS]);n=came[n];}pts.reverse();pts.push([x1,z1]);
    const out=[];let cx=x0,cz=z0,k=0;while(k<pts.length){let far=k;for(let m=pts.length-1;m>k;m--)if(clearLine(cx,cz,pts[m][0],pts[m][1])){far=m;break;}out.push(pts[far]);cx=pts[far][0];cz=pts[far][1];k=far+1;}
    return out;}
  app.findPath=findPath;
  const J={'Entrance':{x:.05,z:4.22,yaw:0,pitch:0},'CD Wall':{x:-6.05,z:-.55,yaw:Math.PI/2,pitch:-.1},'CD Player':{x:-5.32,z:-3.5,yaw:0,pitch:-.3,then:()=>deck.focus()},
    'Vinyl Crates':{x:3.1,z:1.02,yaw:0,pitch:-.6},'Turntable':{x:4.3,z:-3.45,yaw:0,pitch:-.35,then:()=>vinyl.focus()},'Checkout':{x:-4.9,z:2.72,yaw:Math.PI,pitch:-.33},'Window':{x:3.2,z:3.6,yaw:Math.PI,pitch:.04}};
  app.jumps=J;
  app.jump=(name,custom)=>{const t=custom||J[name];if(!t)return;if(state.modal)ui.closeModal();if(insp.item)insp.close();if(state.mode==='cd'||state.mode==='vinyl')app.exitFocus();if(stock.active)stock.cancelExtract();
    app.whenIdle(()=>{let [gi,gj]=freeCell(...cell(t.x,t.z));let gx=t.x,gz=t.z;if(blocked(gx,gz,.3)){gx=GX0+gi*GS;gz=GZ0+gj*GS;}
      const pts=findPath(player.x,player.z,gx,gz);let yaw=t.yaw,pitch=t.pitch;if(t.look){yaw=Math.atan2(-(t.look.x-gx),-(t.look.z-gz));pitch=Math.atan2(t.look.y-1.62,Math.hypot(t.look.x-gx,t.look.z-gz));}
      player.travel={pts,i:0,yaw,pitch,then:t.then,turn:0,name};});};
  // ---- modes / focus camera ----
  const focus={active:false,t:1,dur:.65,p0:new THREE.Vector3(),q0:new THREE.Quaternion(),p1:new THREE.Vector3(),q1:new THREE.Quaternion(),exiting:false};app.focus=focus;
  const tmpCam=new THREE.PerspectiveCamera();tmpCam.rotation.order='YXZ';
  function setLook(){state.look=!state.mouseLook?'off':state.locked?'locked':state.lockDenied?'free':'released';document.body.dataset.look=state.look;app.emit('look');}
  app.setMode=m=>{if(state.mode===m)return;state.mode=m;document.body.dataset.mode=m;clearKeys();hoverSet(null);
    if(m!=='room'){if(document.pointerLockElement){selfUnlock=true;document.exitPointerLock();}}else{ui.stationHide();canvas.style.cursor='';if(performance.now()-lastGesture<900)requestLock();}
    app.emit('mode');};
  app.setBusy=b=>{state.busy=b;if(b){clearKeys();hoverSet(null);}};
  app.setFocus=(mode,pos,look,dur=.65)=>{focus.p0.copy(camera.position);focus.q0.copy(camera.quaternion);tmpCam.position.copy(pos);tmpCam.lookAt(look);focus.p1.copy(pos);focus.q1.copy(tmpCam.quaternion);focus.t=0;focus.dur=dur;focus.active=true;focus.exiting=false;player.travel=null;app.setMode(mode);};
  app.exitFocus=()=>{if(state.mode!=='cd'&&state.mode!=='vinyl')return;if(state.mode==='vinyl')vinyl.onExit();focus.p0.copy(camera.position);focus.q0.copy(camera.quaternion);tmpCam.position.set(player.x,1.62,player.z);tmpCam.rotation.set(player.pitch,player.yaw,0);focus.p1.copy(tmpCam.position);focus.q1.copy(tmpCam.quaternion);focus.t=0;focus.dur=.5;focus.exiting=true;app.setMode('room');};
  app.setCursor=c=>{if(state.mode!=='room')canvas.style.cursor=c||'';};
  let gesturePid=null;
  app.beginGesture=(e,keepCursor)=>{state.gesture=true;if(!keepCursor)document.body.classList.add('nocursor');gesturePid=e.pointerId;try{canvas.setPointerCapture(e.pointerId);}catch(er){}};
  app.endGesture=()=>{state.gesture=false;document.body.classList.remove('nocursor');if(gesturePid!=null){try{canvas.releasePointerCapture(gesturePid);}catch(er){}}gesturePid=null;};
  app.cancelInputs=()=>{clearKeys();vinyl.cancelGesture('cancel');touch=null;downOnCanvas=false;};
  app.setCarry=(c)=>{app.carry=c;insp.setCarry(c);app.emit('carry');};
  app.returnCarry=()=>{const c=app.carry;if(!c)return;if(c.kind==='cd'){if(insp.item&&insp.item.slot===c.slot)insp.takeDisc();else deck.returnDisc();}else vinyl.returnCarried();};
  app.setMouseLook=v=>{state.mouseLook=v;if(!v&&document.pointerLockElement){selfUnlock=true;document.exitPointerLock();}setLook();ui.toast(v?'Mouse Look on — click the shop, then move the mouse.':'Mouse Look off — arrow keys turn, click still uses the centre dot.');};
  app.goToPlaying=()=>{const pb=app.playback.s;if(!pb.rel)return;if(pb.source==='vinyl')app.jump('Turntable');else if(pb.source==='cd-deck')app.jump('CD Player');else if(insp.item&&insp.item.rel===pb.rel)ui.toast('That CD is the one in your hands.');else app.shop.routeCD(pb.rel);};
  // ---- pointer lock / look ----
  let selfUnlock=false,lastUnlock=-1e9,lastGesture=-1e9,swallow=false,fails=0;
  function requestLock(strict){if(!state.mouseLook||state.lockDenied||state.locked||!canvas.requestPointerLock||state.mode!=='room')return setLook();
    const bad=()=>{if(strict&&performance.now()-lastUnlock>1600&&++fails>=2){state.lockDenied=true;ui.toast('Pointer lock is unavailable — move the mouse over the shop (or to the screen edges) to look around.');}setLook();};
    try{const p=canvas.requestPointerLock();if(p&&p.catch)p.catch(bad);}catch(e){bad();}}
  document.addEventListener('pointerlockerror',()=>setLook());
  document.addEventListener('pointerlockchange',()=>{const was=state.locked;state.locked=document.pointerLockElement===canvas;if(state.locked)fails=0;
    if(was&&!state.locked){lastUnlock=performance.now();if(!selfUnlock&&state.mode==='room'&&!state.modal){swallow=true;clearKeys();ui.toast('Pointer released — click the shop to look around again.');}}selfUnlock=false;setLook();});
  const keys={};function clearKeys(){for(const k in keys)keys[k]=false;}
  // ---- centre picking ----
  const ray=new THREE.Raycaster(),centre=new THREE.Vector2(0,0);let hover=null;
  function hoverSet(t){if((hover&&hover.id)===(t&&t.id)){hover=t||null;return;}if(hover&&hover.hover)hover.hover(false);hover=t;if(hover&&hover.hover)hover.hover(true);ui.tip(hover);}
  function pickCentre(){camera.updateMatrixWorld(true);ray.setFromCamera(centre,camera);const hits=ray.intersectObjects(app.picks,false);
    for(const h of hits){const o=h.object;if(o.visible===false&&o.material!==app.mats.pick)continue;const p=o.userData.pick;if(!p)return null;if(p.enabled&&!p.enabled())continue;if(h.distance>(p.reach||3.3))return null;return p.resolve?p.resolve(h,ray.ray):p;}return null;}
  app.pickCentre=pickCentre;
  const canAct=()=>state.entered&&state.mode==='room'&&state.look!=='released'&&!state.modal&&!state.busy&&!focus.active&&!player.travel;
  const RELOCK={id:'relock',title:'Click the shop to look around',sub:'The pointer is free — buttons and menus are clickable',hint:'Esc frees the pointer again at any time'};
  function clickCentre(useE){if(state.busy==='extract'){stock.cancelExtract();return;}if(!canAct())return;const t=pickCentre();hoverSet(t);if(!t)return;if(useE&&t.e)t.e();else if(t.click)t.click();}
  app.clickCentre=clickCentre;
  // ---- input ----
  let downOnCanvas=false,touch=null,cursorX=-1,cursorY=-1,overCanvas=false;
  const SENS=.0022;
  function turn(dx,dy){player.yaw-=dx*SENS;player.pitch=clamp(player.pitch-dy*SENS,-1.25,1.2);}
  function enter(){if(state.entered)return;state.entered=true;document.body.classList.add('entered');$('intro').hidden=true;lastGesture=performance.now();app.audioInit();if(app.chain.startArt)app.chain.startArt();app.shop.loadPrints();setTimeout(()=>app.radio.start(),1800);requestLock(true);setLook();canvas.focus();}
  app.enter=enter;
  $('enterBtn').addEventListener('click',enter);
  canvas.addEventListener('pointerdown',e=>{lastGesture=performance.now();app.audioInit();if(!state.entered||state.modal)return;downOnCanvas=true;
    if(state.mode==='room'){if(e.pointerType==='touch'){if(!state.lockDenied){state.lockDenied=true;setLook();}touch={id:e.pointerId,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:performance.now()};return;}
      if(e.button!==0)return;if(state.look==='released'){requestLock(true);swallow=false;if(state.busy!=='extract')return;}
      clickCentre();}
    else if(state.mode==='inspect')insp.pointerDown(e);else if(state.mode==='vinyl'&&!focus.exiting)vinyl.pointerDown(e);});
  window.addEventListener('pointermove',e=>{cursorX=e.clientX;cursorY=e.clientY;overCanvas=e.target===canvas;if(!state.entered||state.modal)return;
    if(state.mode==='room'){if(touch&&e.pointerId===touch.id){turn(-(e.clientX-touch.x)*2.2,-(e.clientY-touch.y)*2.2);touch.x=e.clientX;touch.y=e.clientY;}
      else if(e.pointerType!=='touch'&&!focus.active&&(state.look==='locked'||(state.look==='free'&&overCanvas)))turn(e.movementX||0,e.movementY||0);}
    else if(state.mode==='inspect'){if(overCanvas||downOnCanvas)insp.pointerMove(e);}else if(state.mode==='cd'){if(overCanvas)deck.hover(e.clientX,e.clientY);}else if(state.mode==='vinyl')vinyl.pointerMove(e);});
  window.addEventListener('pointerup',e=>{const was=downOnCanvas;downOnCanvas=false;if(!state.entered)return;
    if(state.mode==='vinyl'){if(vinyl.b.g||was)vinyl.pointerUp(e);return;}if(state.modal||!was)return;
    if(state.mode==='room'){if(touch&&e.pointerId===touch.id){const tap=performance.now()-touch.t<320&&Math.hypot(e.clientX-touch.x0,e.clientY-touch.y0)<12;touch=null;if(tap)clickCentre();}}
    else if(state.mode==='inspect')insp.pointerUp(e);else if(state.mode==='cd'&&!focus.exiting&&e.target===canvas)deck.click(e.clientX,e.clientY);});
  canvas.addEventListener('pointercancel',()=>app.cancelInputs());
  canvas.addEventListener('lostpointercapture',()=>{if(vinyl.b.g)vinyl.cancelGesture('lostcapture');});
  window.addEventListener('blur',()=>app.cancelInputs());document.addEventListener('visibilitychange',()=>{if(document.hidden)app.cancelInputs();});
  canvas.addEventListener('wheel',e=>{if(state.mode==='inspect'){e.preventDefault();insp.wheel(e.deltaY);}},{passive:false});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  const pad=$('pad');for(const b of pad.querySelectorAll('button')){const k=b.dataset.k;const on=e=>{e.preventDefault();keys[k]=true;app.audioInit();},off=()=>{keys[k]=false;};b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off);}
  window.addEventListener('keydown',e=>{const tg=e.target,typing=tg&&(tg.tagName==='INPUT'||tg.tagName==='TEXTAREA'||tg.tagName==='SELECT')&&tg.type!=='range';const k=e.key.toLowerCase();if(k!=='escape')lastGesture=performance.now();
    if(k==='escape'){if(state.modal){ui.closeModal();e.preventDefault();return;}if(typing){tg.blur();return;}}
    if(typing||e.metaKey||e.ctrlKey||e.altKey)return;if(state.modal)return;
    if(!state.entered){if(k==='enter'||k===' ')enter();return;}
    if(k==='/'){e.preventDefault();ui.openFinder('');return;}
    if(tg&&tg.tagName==='BUTTON'&&(k==='enter'||k===' '))return;
    if(state.mode==='inspect'){if(insp.key(e))e.preventDefault();return;}
    if(state.mode==='cd'){if(k==='escape'||k==='backspace')app.exitFocus();else if(k==='e')deck.button('eject');else if(k===' '||k==='p'){const pb=app.playback.s;deck.button(pb.source==='cd-deck'&&pb.playing?'pause':'play');}else if(k==='arrowright'||k==='n')deck.button('next');else if(k==='arrowleft')deck.button('prev');else if(k==='enter'||k==='l')deck.trayClick();else if(k==='r')deck.returnDisc();else return;e.preventDefault();return;}
    if(state.mode==='vinyl'){if(k==='escape'||k==='backspace'){if(!vinyl.cancelGesture('escape'))app.exitFocus();}else if(!vinyl.key(e))return;e.preventDefault();return;}
    if(k==='escape'){if(state.busy==='extract')stock.cancelExtract();else if(player.travel)player.travel=null;return;}
    if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){keys[k]=true;if(player.travel)player.travel=null;e.preventDefault();return;}
    if(e.repeat)return;
    if(k==='e')clickCentre(true);else if(k==='enter'||k===' '){e.preventDefault();clickCentre();}else if(k==='m')app.setMouseLook(!state.mouseLook);else if(k==='b')ui.openCrate();else if(k==='h'||k==='?')ui.openHelp();
    else if(k==='r'&&app.carry)app.returnCarry();else if(/^[1-7]$/.test(k))app.jump(Object.keys(J)[+k-1]);});
  window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
  window.addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();if(state.mode==='vinyl'&&!vinyl.b.g&&!focus.exiting)vinyl.focus();if(state.mode==='cd')deck.focus();});
  // ---- update ----
  const ZONES=[['CD Wall',p=>p.x<-5.1&&p.z>-3.4&&p.z<2.9],['CD Listening Booth',p=>p.x<-3.4&&p.z<=-2.9],['Vinyl Listening Bench',p=>p.x>2.3&&p.z<-2.8],['Vinyl Crates',p=>p.x>1&&p.x<5.5&&p.z>-1.5&&p.z<1.9],['Checkout',p=>p.x<-3.1&&p.z>2.1],['Feature Island',p=>p.x>-3.5&&p.x<-.4&&p.z>-3&&p.z<2],['Storefront Window',p=>p.x>.9&&p.z>2.9],['Entrance',p=>p.z>3.2&&p.x>-3&&p.x<=.9]];
  let zt=0,bob=0;
  function update(dt,real){app.realDt=real==null?dt:real; // song time follows the wall clock even when frames are slow
    for(let i=app.anims.length-1;i>=0;i--){const a=app.anims[i];a.t+=dt;const t=Math.min(1,a.t/a.dur);a.fn(t);if(t>=1){app.anims.splice(i,1);a.res();}}
    // player
    const tr=player.travel;player.moving=false;
    if(state.mode==='room'&&!state.modal&&!state.busy&&!focus.active){
      if(tr){const p=tr.pts[tr.i];if(p){const dx=p[0]-player.x,dz=p[1]-player.z,d=Math.hypot(dx,dz),stepL=4.4*dt;player.moving=true;
          if(d<=stepL){player.x=p[0];player.z=p[1];tr.i++;}else{player.x+=dx/d*stepL;player.z+=dz/d*stepL;const wy=Math.atan2(-dx,-dz);player.yaw+=angDiff(player.yaw,wy)*(1-Math.exp(-dt*7));player.pitch=lerp(player.pitch,-.08,1-Math.exp(-dt*5));}}
        else{tr.turn=Math.min(1,tr.turn+dt/.38);const k=1-Math.exp(-dt*12);player.yaw+=angDiff(player.yaw,tr.yaw)*k;player.pitch=lerp(player.pitch,tr.pitch,k);
          if(tr.turn>=1){player.yaw=tr.yaw;player.pitch=tr.pitch;player.travel=null;if(tr.then)tr.then();}}}
      else{const f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);let st=(keys.d?1:0)-(keys.a?1:0);const ar=(keys.arrowright?1:0)-(keys.arrowleft?1:0);
        if(state.mouseLook)st+=ar;else player.yaw-=ar*1.9*dt;st=clamp(st,-1,1);
        let wx=-Math.sin(player.yaw)*f+Math.cos(player.yaw)*st,wz=-Math.cos(player.yaw)*f-Math.sin(player.yaw)*st;const l=Math.hypot(wx,wz);if(l>1){wx/=l;wz/=l;}
        const k=1-Math.exp(-dt*12);player.vx=lerp(player.vx,wx*2.65,k);player.vz=lerp(player.vz,wz*2.65,k);
        if(Math.abs(player.vx)+Math.abs(player.vz)>.02){const nx=player.x+player.vx*dt,nz=player.z+player.vz*dt;if(!blocked(nx,player.z,.3))player.x=nx;else player.vx=0;if(!blocked(player.x,nz,.3))player.z=nz;else player.vz=0;player.moving=l>0;}
        if(state.look==='free'&&overCanvas&&state.entered){const ex=cursorX/innerWidth;if(ex<.05)player.yaw+=1.5*dt*(1-ex/.05);else if(ex>.95)player.yaw-=1.5*dt*((ex-.95)/.05);}}
    }
    bob=player.moving&&!tr?bob+dt*9:0;
    // camera
    if(focus.active){focus.t=Math.min(1,focus.t+dt/focus.dur);const e=easeIO(focus.t);camera.position.lerpVectors(focus.p0,focus.p1,e);camera.quaternion.slerpQuaternions(focus.q0,focus.q1,e);if(focus.t>=1&&focus.exiting){focus.active=false;focus.exiting=false;}}
    if(!focus.active){camera.position.set(player.x,1.62+Math.sin(bob)*.012,player.z);camera.rotation.set(player.pitch,player.yaw,0);}
    camera.updateMatrixWorld(true);camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    app.room.update(dt);stock.update(dt);app.playback.update(dt);deck.update(dt);vinyl.update(dt);insp.update(dt);app.shop.update(dt);app.radio.update(dt);
    if(app.idleQ.length&&state.mode==='room'&&!state.busy&&!focus.active&&!stock.active&&!insp.item&&!state.modal){const q=app.idleQ.splice(0);for(const f of q)f();}
    if(canAct())hoverSet(pickCentre());else if(state.entered&&state.mode==='room'&&state.look==='released'&&!state.modal&&!state.busy&&!focus.active)hoverSet(RELOCK);else if(hover&&(state.mode!=='room'||state.modal||player.travel||hover===RELOCK))hoverSet(null);
    zt+=dt;if(zt>.25){zt=0;let z='Shop Floor';for(const [n,f] of ZONES)if(f(player)){z=n;break;}if(state.mode==='cd')z='CD Listening Booth';if(state.mode==='vinyl')z='Vinyl Listening Bench';if(z!==state.zone){state.zone=z;app.emit('zone');}}
  }
  renderer.info.autoReset=false;
  function render(){renderer.info.reset();renderer.clear();renderer.render(scene,camera);renderer.clearDepth();renderer.render(app.fgScene,app.fgCam);}
  app.render=render;app.update=update;
  let last=performance.now(),acc=0,nfr=0,auto=true,shadowKick=3,renderOnce=false;
  function loop(now){requestAnimationFrame(loop);const real=(now-last)/1000;last=now;const dt=Math.min(.1,Math.max(0,real));if(auto)update(dt,Math.min(.5,Math.max(0,real)));
    if(shadowKick>0&&--shadowKick===0)renderer.shadowMap.needsUpdate=true;
    if(auto||renderOnce||shadowKick>0){render();renderOnce=false;}
    acc+=real;nfr++;if(nfr>=50){const avg=acc/nfr;acc=0;nfr=0;if(!qs.has('qa')){const cap=clamp(window.devicePixelRatio||1,.85,1.5);if(avg>.027&&PR>.85){PR=Math.max(.85,PR-.15);renderer.setPixelRatio(PR);}else if(avg<.0125&&PR<cap){PR=Math.min(cap,PR+.1);renderer.setPixelRatio(PR);}}}}
  app.on('weather',()=>{shadowKick=2;});canvas.addEventListener('webglcontextrestored',()=>{shadowKick=4;});
  setLook();document.body.dataset.mode='room';update(0);render();
  $('loader').hidden=true;$('intro').hidden=false;$('enterBtn').focus();
  requestAnimationFrame(loop);

  // ---- optional read-only QA interface (?qa=1) with explicit test drivers ----
  if(qs.has('qa')){
    const ndc=(v)=>{const p=v.clone().project(camera);return {x:(p.x+1)/2*innerWidth,y:(1-p.y)/2*innerHeight,z:p.z};};
    window.__QA={app,THREE,stockPose,CD,thick,
      setAuto(v){auto=v;},
      async step(sec,h=1/60){const n=Math.max(1,Math.round(sec/h));let t=performance.now();for(let i=0;i<n;i++){update(h);for(let k=0;k<6;k++)await null;if(performance.now()-t>60){await new Promise(r=>setTimeout(r,0));t=performance.now();}}if(sec>=.04){renderOnce=true;await new Promise(r=>requestAnimationFrame(()=>r()));}},
      state(){return {mode:state.mode,busy:state.busy,modal:state.modal,look:state.look,locked:state.locked,zone:state.zone,entered:state.entered,weather:state.weather,gesture:!!state.gesture,cursorHidden:document.body.classList.contains('nocursor'),canvasCursor:getComputedStyle(canvas).cursor,
        player:{x:player.x,z:player.z,yaw:player.yaw,pitch:player.pitch,travel:!!player.travel},cam:{x:camera.position.x,y:camera.position.y,z:camera.position.z},focus:focus.active,
        carry:app.carry?{kind:app.carry.kind,rel:app.carry.rel.id}:null,cd:{state:app.cd.state,rel:app.cd.rel?app.cd.rel.id:null,slot:app.cd.slot?app.cd.slot.id:null},
        hover:hover?{id:hover.id,title:hover.title,sub:hover.sub}:null,inspect:insp.item?{kind:insp.item.kind,rel:insp.item.rel.id,slot:insp.item.slot.id,open:insp.item.model.open||0,phase:insp.phase,discVisible:insp.item.kind==='cd'?insp.item.model.disc.visible:null}:null,
        extract:stock.active?{slot:stock.active.slot.id,p:stock.active.p,dir:stock.active.dir}:null,playback:app.playback.qa(),deck:deck.qa(),vinyl:vinyl.qa(),chain:app.chain.qa?app.chain.qa():{enabled:false},radio:app.radio.qa(),crate:app.shop.crate.slice(),seed:app.shop.seed,
        catalog:{source:app.catalogSource,albums:cat.albums.length,singles:cat.singles.length,releases:cat.releases.length,tracks:cat.trackCount,feed:cat.feed_songs},stock:stock.count,art:{...art.stats,entries:art.entries.size},
        render:{calls:renderer.info.render.calls,tris:renderer.info.render.triangles,textures:renderer.info.memory.textures,geometries:renderer.info.memory.geometries,pr:renderer.getPixelRatio()},toast:ui.lastToast||null};},
      teleport(x,z,yaw=player.yaw,pitch=player.pitch){player.x=x;player.z=z;player.yaw=yaw;player.pitch=pitch;player.travel=null;player.vx=player.vz=0;update(0);},
      lookAt(x,y,z){player.yaw=Math.atan2(-(x-player.x),-(z-player.z));player.pitch=Math.atan2(y-1.62,Math.hypot(x-player.x,z-player.z));update(0);},
      project(x,y,z){camera.updateMatrixWorld(true);return ndc(new THREE.Vector3(x,y,z));},
      fgProject(obj,local){app.fgCam.updateMatrixWorld(true);obj.updateWorldMatrix(true,false);const p=obj.localToWorld(local.clone()).project(app.fgCam);return {x:(p.x+1)/2*innerWidth,y:(1-p.y)/2*innerHeight};},
      pick(){const t=pickCentre();return t?{id:t.id,title:t.title,sub:t.sub}:null;},blocked};
  }
}
boot().catch(e=>{console.error(e);fatal('The shop failed to start: '+(e&&e.message||e));});
