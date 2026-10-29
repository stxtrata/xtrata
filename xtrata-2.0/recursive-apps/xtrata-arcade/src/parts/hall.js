
(() => {
'use strict';

/* ================================================================
   GAMES — one entry per cabinet (up to 10 placed in the hall).
   src:  the inscription's HTML content URL. null = built-in demo.
   cabinet: look of the machine. Any key left out uses the default.
     w, depth, kick, cp, cpBack, cpRise, tilt, screenH,
     overhang, mH, mLean, roof: flat|slope|curve|peak,
     back: straight|hump|slant, body, trim, panel, start,
     art: stripes|sunset|grid|bolts|checker|stars|waves|chevrons|blocks|dots
   ================================================================ */
/* Machine skins: per game banner / front strip / left + right side, fitted to each cabinet template (WebP). */
const SKIN_BLEED=10;
const SKIN_LAYOUT=XA_HALL_ASSETS.SKIN_LAYOUT;
const SKINS=XA_HALL_ASSETS.SKINS;

const CAB_STYLES = [
  {body:'#1c1a30', art:'stripes', b:'#3be4ff'},
  {body:'#b3163f', art:'sunset', b:'#ff6a3d', roof:'slope', mH:.32, kick:.84, tilt:12},
  {body:'#e9e6ee', art:'grid', b:'#12163a', overhang:.24, tilt:26, cpRise:.12, panel:'#20233a'},
  {body:'#0f3a2c', art:'bolts', b:'#62ffb0', back:'hump', roof:'curve'},
  {body:'#f2b705', art:'checker', b:'#fff4c2', w:.7, kick:.74, screenH:.46, mH:.22, start:'#e8312f', panel:'#1a1a1a'},
  {body:'#0d0b14', art:'stars', b:'#ff3d9a', w:.96, screenH:.6, mH:.3, roof:'peak'},
  {body:'#1f3fbf', art:'waves', b:'#0a1a5c', roof:'curve', back:'slant', mLean:10},
  {body:'#5a22c9', art:'chevrons', b:'#3be4ff', overhang:.03, tilt:22, roof:'slope', back:'slant'},
  {body:'#c9420d', art:'blocks', b:'#2a0f05', kick:.86, mH:.3, back:'hump'},
  {body:'#23272f', art:'dots', b:'#0b0d11', w:.84, tilt:20, overhang:.1, roof:'peak', back:'slant'},
];
/* Every cartridge registered with the engine (XA.registerGame) gets a cabinet. */
const XA = window.XA, XARoom = window.XARoom, XAScores = window.XAScores;
const GAMES = ((XA && XA.games) || []).map((g,i)=>{
  const st = CAB_STYLES[i % CAB_STYLES.length];
  // second lap through the styles flips roof/back so no two machines look identical
  const flip = i >= CAB_STYLES.length ? {roof: st.roof==='curve'?'peak':'curve', back: st.back==='hump'?'slant':'hump'} : {};
  return {id:g.id, title:String(g.title||g.id).toUpperCase(), color:g.color||'#3be4ff', def:g, variants:g.variants||[],
    cabinet:Object.assign({}, st, flip, {trim:g.color, a:g.color}),
    shape:'shape-'+String(i % CAB_STYLES.length + 1).padStart(2,'0'), variant: i >= CAB_STYLES.length ? 'b' : 'a',
    skin: SKINS[g.id] || null};
});

const $ = id => document.getElementById(id);
const isTouch = matchMedia('(pointer: coarse)').matches;
if (isTouch) document.body.classList.add('touch');

/* ---------- Xtrata brand: logo as outline polygons in a -1..1 box ---------- */
const BRAND = {white:'#eef2ff', blue:'#3d86ff', orange:'#ff8a2a'};
const LOGO = (() => {
  const B1=[[-1,.45],[-.52,.45],[-.03,-.04],[-.52,-.53],[-1,-.53],[-.78,-.04]];
  const B2=[[-.72,.24],[-.5,.24],[-.22,-.04],[-.5,-.32],[-.72,-.32],[-.44,-.04]];
  const mir=p=>p.map(([x,y])=>[-x,y]);
  return [
    {c:'white',  pts:[[-1,.89],[-.32,.89],[0,.52],[.32,.89],[1,.89],[1,.77],[.36,.77],[0,.36],[-.36,.77],[-1,.77]]},
    {c:'white',  pts:[[-1,.72],[-.37,.72],[0,.30],[.37,.72],[1,.72],[1,.59],[.48,.59],[0,.09],[-.48,.59],[-1,.59]]},
    {c:'blue', pts:B1}, {c:'blue', pts:B2}, {c:'blue', pts:mir(B1)}, {c:'blue', pts:mir(B2), faulty:true},
    {c:'orange', pts:[[-1,-.65],[-.45,-.65],[0,-.2],[.45,-.65],[1,-.65],[1,-.88],[.36,-.88],[0,-.52],[-.36,-.88],[-1,-.88]]},
  ];
})();
function drawLogo(x,cx,cy,size,lw,glow){
  x.save(); x.lineJoin='miter'; x.lineWidth=lw;
  for(const sh of LOGO){ x.strokeStyle=x.shadowColor=BRAND[sh.c]; x.shadowBlur=glow||0; x.beginPath();
    sh.pts.forEach(([px,py],k)=>{const X=cx+px*size/2, Y=cy-py*size/2; k?x.lineTo(X,Y):x.moveTo(X,Y)}); x.closePath(); x.stroke() }
  x.restore();
}
$('mark').innerHTML = '<svg viewBox="0 0 100 100">' + LOGO.map(sh=>'<polygon fill="none" stroke-width="2.4" stroke-linejoin="miter" stroke="'+BRAND[sh.c]+'" points="'+sh.pts.map(([x,y])=>(50+x*47).toFixed(1)+','+(50-y*47).toFixed(1)).join(' ')+'"/>').join('') + '</svg>';

if (!XA || !XARoom || !GAMES.length) { $('err').textContent = 'The game engine failed to load.'; $('err').hidden = false; $('go').hidden = true; return; }
if (typeof THREE === 'undefined') { document.body.classList.add('flat'); return; }   // no 3D: fall back to the engine's flat arcade room
$('ncab').textContent = GAMES.length === 21 ? 'Twenty-one' : String(GAMES.length);

/* ---------- helpers ---------- */
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function tex(c, rep){const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
const easeIO = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;

/* ---------- audio (starts on first tap) ---------- */
// one audio graph for hall + games: the engine's (respects its mute switch)
function initAudio(){ try{ XA.audio.unlock() }catch(e){} }
function tone(f,t0,d,type='square',vol=.05){ try{ XA.audio.tone(f,d,{delay:t0,type,vol:Math.min(.3,vol*2.4)}) }catch(e){} }
const sfx = { coin(){tone(988,0,.08);tone(1319,.08,.4)}, click(){tone(160,0,.06,'triangle',.09)}, back(){tone(660,0,.07);tone(440,.07,.2)} };

/* ---------- renderer / scene ---------- */
const renderer = new THREE.WebGLRenderer({antialias:true, stencil:true});   // the stencil is how a door's opening shows the room behind it
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
$('stage').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07060c);
scene.fog = new THREE.Fog(0x07060c, 9, 34);
// How you walk and look. The casino room (a page of its own) uses exactly these numbers, so the two rooms feel the same under the hand;
// tests/casino-walk.test.cjs checks that they agree. Touch: left thumb walks, right thumb looks at .005.
const WALK = { fov:68, eye:1.6, speed:3, sprint:4.6, bobRate:9, bobAmp:.025, look:.0022, drag:.004, touchLook:.005, pitch:1.2 };
const camera = new THREE.PerspectiveCamera(WALK.fov, innerWidth/innerHeight, 0.04, 60);
camera.rotation.order = 'YXZ';

const RW = 10, RH = 3.2, HH = 4.2, EYE = WALK.eye, GAP = 2.2;
/* Which wall each cabinet stands on, and where along it (0 = nearest the entrance). With 21 games or fewer this is the original split (left gets the
   extra one). The 21 built-in games never move to the other wall: games added later (from the games contract) take the right wall first, then the
   left, alternately, at the far end of each row, so the room grows at the back and every built-in game keeps its wall and its place in the row. */
const BUILT_IN_GAMES = 21, BUILT_IN_LEFT = 11;
const SIDE_OF = GAMES.map((_,i)=> GAMES.length<=BUILT_IN_GAMES ? (i<Math.ceil(GAMES.length/2) ? -1 : 1)
  : i<BUILT_IN_GAMES ? (i<BUILT_IN_LEFT ? -1 : 1) : ((i-BUILT_IN_GAMES)%2===0 ? 1 : -1));
const ROW = {'-1':[], '1':[]}; SIDE_OF.forEach((sd,i)=>ROW[sd].push(i));
const SLOT_OF = GAMES.map((_,i)=>ROW[SIDE_OF[i]].indexOf(i));
const NL = ROW['-1'].length, NR = ROW['1'].length;                   // cabinets down the left / right walls
const RL = Math.max(16, Math.ceil(NL*GAP + 5.6));
const player = {x:0, z:RL/2-1.4, yaw:0, pitch:-0.06, bob:0};
const machines = [], pickables = [], boxes = [];
/* The lobby: a bare room built for real behind the wall of a door that links to it (a bay scene with interaction 3 and target-room 'lobby').
   It is always there, so when that door opens you see straight into it and walk in: no loading, no fade, no teleport. The door's opening
   writes the stencil, and the walls on both sides skip those pixels (see portal() in doors.js). The lobby sits on the far side of the
   hall wall at that bay, so it is the same room whichever bay holds the door; only one bay at a time can lead to it. */
const LW = 8, LD = 10;                      // lobby width (along the hall wall) and depth (away from it), metres
let HALL_BAYS = 4;                           // how many bays the hall itself has; the lobby's two come after them
let lobbyG = null, lobbyBay = -1, lobbyPass = null, bayDefsAll = [];   // lobbyPass: {side, wallX, z}
const WALL_T = 0.2;                         // the thickness of the wall between the rooms (a drywall cavity you see as the reveal of the doorway)
function holeWall(m,bit){ m.stencilWrite=true; m.stencilRef=bit; m.stencilFuncMask=bit; m.stencilWriteMask=0; m.stencilFunc=THREE.NotEqualStencilFunc; m.stencilFail=m.stencilZFail=m.stencilZPass=THREE.KeepStencilOp; return m }   // bit 1: this room's wall, bit 2: the lobby's
const lobbyOpen = () => lobbyBay>=0 && !!bayEngine && bayEngine.portalOpen(lobbyBay);
const inLobbyZone = () => !!lobbyPass && (lobbyPass.side<0 ? player.x < lobbyPass.wallX-.05 : player.x > lobbyPass.wallX+.05);
let bayEngine = null, bayHint = null, bayHold = true, bayToast = null;   // the bay engine (only when the world reader is on); what the player is looking at in a bay

/* ================================================================
   ROOM
   ================================================================ */
function carpetTexture(){
  const S=512, c=mkCanvas(S,S), x=c.getContext('2d'), R=rng(7);
  x.fillStyle='#120e28'; x.fillRect(0,0,S,S);
  const cols=['#3d86ff','#ff8a2a','#d9deff','#6a4cff'];
  const shapes=[]; for(let i=0;i<64;i++) shapes.push({px:R()*S,py:R()*S,s:10+R()*22,rot:R()*6.28,k:i%5,col:cols[i%4]});
  for(const ox of [-S,0,S]) for(const oy of [-S,0,S]) for(const sh of shapes){
    const s=sh.s; x.save(); x.translate(sh.px+ox, sh.py+oy); x.rotate(sh.rot);
    x.strokeStyle=x.fillStyle=sh.col; x.lineWidth=4; x.lineCap='round'; x.lineJoin='round';
    if(sh.k===0){x.beginPath();x.arc(0,0,s*.6,0,6.28);x.stroke()}
    else if(sh.k===1){x.beginPath();x.moveTo(0,-s*.7);x.lineTo(s*.6,s*.5);x.lineTo(-s*.6,s*.5);x.closePath();x.stroke()}
    else if(sh.k===2){x.beginPath();x.moveTo(-s,0);for(let j=1;j<=4;j++)x.lineTo(-s+j*s/2,(j%2?-1:1)*s*.35);x.stroke()}
    else if(sh.k===3){x.fillRect(-s*.14,-s*.6,s*.28,s*1.2);x.fillRect(-s*.6,-s*.14,s*1.2,s*.28)}
    else {x.beginPath();x.arc(0,0,s*.22,0,6.28);x.fill()}
    x.restore();
  }
  return tex(c,[RW/2.6, RL/2.6]);
}
function wallTexture(){
  const c=mkCanvas(256,256), x=c.getContext('2d');
  x.fillStyle='#17132a'; x.fillRect(0,0,256,256);
  x.fillStyle='#120f22'; for(let i=0;i<4;i++) x.fillRect(i*64,0,3,256);
  x.fillStyle='#1d1834'; x.fillRect(0,150,256,6);
  return tex(c,[1,1]);
}
function signTexture(text, font, color, w, h){
  const c=mkCanvas(w,h), x=c.getContext('2d');
  x.textAlign='center'; x.textBaseline='middle'; x.font=font;
  let size=parseInt(font); const fam=font.replace(/^\d+px\s*/,'');
  while(x.measureText(text).width>w*.92 && size>10){size-=2; x.font=size+'px '+fam}
  x.shadowColor=color; x.fillStyle=color;
  for(const b of [40,20,8]){x.shadowBlur=b; x.fillText(text,w/2,h/2)}
  x.shadowBlur=0; x.fillStyle='#ffffff'; x.globalAlpha=.55; x.fillText(text,w/2,h/2);
  return tex(c);
}

function buildRoom(){
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(RW,RL), new THREE.MeshStandardMaterial({map:carpetTexture(), roughness:.95}));
  floor.rotation.x=-Math.PI/2; scene.add(floor);
  const ceil=new THREE.Mesh(new THREE.PlaneGeometry(RW,RL), new THREE.MeshStandardMaterial({color:0x0c0a14, roughness:1}));
  ceil.rotation.x=Math.PI/2; ceil.position.y=HH; scene.add(ceil);

  const wt=wallTexture();
  const wall=(w,pos,ry)=>{const t=wt.clone(); t.needsUpdate=true; t.repeat.set(w/2.2,1);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,RH), holeWall(new THREE.MeshStandardMaterial({map:t, roughness:.9}),1));
    m.position.set(pos[0],RH/2,pos[1]); m.rotation.y=ry; scene.add(m);
    // above the doors and bays (RH) the wall is plain, up to the hall's higher ceiling (HH)
    const up=new THREE.Mesh(new THREE.PlaneGeometry(w,HH-RH), new THREE.MeshStandardMaterial({color:0x17132a, roughness:.9}));
    up.position.set(pos[0],(RH+HH)/2,pos[1]); up.rotation.y=ry; scene.add(up)};
  wall(RL,[-RW/2,0],Math.PI/2); wall(RL,[RW/2,0],-Math.PI/2); wall(RW,[0,-RL/2],0); wall(RW,[0,RL/2],Math.PI);

  // neon strips: pink high along the long walls, cyan skirting all round
  const neon=(col)=>new THREE.MeshBasicMaterial({color:col, toneMapped:false});
  const pink=neon(0x3d86ff), cyan=neon(0xff8a2a);
  for(const s of [-1,1]){
    const hi=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,RL),pink); hi.position.set(s*(RW/2-.02),2.62,0); scene.add(hi);
    const lo=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,RL),cyan); lo.position.set(s*(RW/2-.02),.07,0); scene.add(lo);
    const le=new THREE.Mesh(new THREE.BoxGeometry(RW,.03,.03),cyan); le.position.set(0,.07,s*(RL/2-.02)); scene.add(le);
  }

  // entrance sign
  const sign2=new THREE.Mesh(new THREE.PlaneGeometry(4.4,.55), new THREE.MeshBasicMaterial({map:signTexture('HIGH SCORES LIVE ON-CHAIN','72px Bungee',BRAND.orange,1024,128), transparent:true, toneMapped:false}));
  sign2.position.set(0,2.82,RL/2-.03); sign2.rotation.y=Math.PI; scene.add(sign2);
  buildBitcoinSign();

  buildLogoSign();
  buildPosters();
  try{ if(window.XAWorld) XAWorld.start(()=>paintWall()) }catch(e){}   // off unless the contracts are configured
  try{ if(window.XAScreen) XAScreen.start(()=>paintDayBoard(true)) }catch(e){}   // the centre screen's contract: off unless configured
  if(window.XA_TEST) XA.bayDoor=(i,fn)=>{ const m=bayEngine&&bayEngine._model(i); return m?fn(m):null };   // tests only
  if(window.XA_TEST) XA.bayHandle=(i)=>bayEngine?bayEngine._handle(i):null;   // tests only
  if(window.XA_TEST) XA.bayCurtain=(i,fn)=>{ const c=bayEngine&&bayEngine._curtain(i); return c?fn(c):null };   // tests only
  XA.roomState=()=>({state, room:roomId(), title:roomCur?roomCur.title:'', depth:roomStack.length, backLabel:roomUI?roomUI.back.textContent:'', sandbox:roomUI&&roomUI.frame?roomUI.frame.getAttribute('sandbox'):null, loading:!!(roomUI&&roomUI.load.style.display!=='none'), frame:!!(roomUI&&roomUI.frame), frameSrc:roomUI&&roomUI.frame?roomUI.frame.getAttribute('src'):null, frameDoc:roomUI&&roomUI.frame?roomUI.frame.hasAttribute('srcdoc'):false, back:!!(roomUI&&roomUI.back.style.display==='block'), still:!!(roomUI&&roomUI.still.style.display==='block'&&Number(roomUI.still.style.opacity)>0), glide:!!(roomUI&&roomUI.glide), ready:!!(roomUI&&roomUI.frame&&roomUI.frame.dataset.ready)});   // read-only, for tests
  if(window.XA_TEST) XA.enterRoom=enterRoom, XA.leaveRoom=leaveRoom;
  XA.doorway=(i)=>bayEngine?bayEngine.doorwayAt(i,player.x,player.z):null;
  XA.doorFrame=(i)=>bayEngine&&bayEngine.frameOf?bayEngine.frameOf(i):null;   // read-only, for tests: where bay i's wall is and which way it faces   // read-only, for tests: where you are in bay i's open doorway
  XA.walkCfg=()=>Object.assign({},WALK);   // read-only, for tests
  XA.where=()=>({x:player.x, z:player.z, yaw:player.yaw, pitch:player.pitch});   // read-only, for tests
  XA.lobbyState=()=>({bay:lobbyBay, open:lobbyOpen(), inside:inLobbyZone(), pass:lobbyPass, visible:!!(lobbyG&&lobbyG.visible), stencil:!!renderer.getContext().getContextAttributes().stencil});   // read-only, for tests
  XA.bayState=()=>bayEngine ? {bays:bayEngine.debug(), voices:bayEngine.audio._voices(), log:bayEngine.audio._log()} : null;   // read-only, for tests
  if(window.XA_TEST) XA.pose=(x,z,yaw,pitch)=>{ player.x=x; player.z=z; player.yaw=yaw; player.pitch=pitch||0 };   // tests only: nothing sets XA_TEST in the shipped page
  XA.wallState=()=>posterSlots.map(s=>({head:s.spec&&s.spec.head, chain:(s.spec&&s.spec.chainId)||0, shown:!s.group||s.group.visible!==false}));   // read-only, for tests
  buildDayBoard();

  // inlaid logo in the carpet
  const fc=mkCanvas(512,512), fx=fc.getContext('2d');
  fx.fillStyle='rgba(8,8,12,.88)'; fx.fillRect(16,16,480,480);
  fx.strokeStyle='rgba(238,242,255,.35)'; fx.lineWidth=4; fx.strokeRect(28,28,456,456);
  drawLogo(fx,256,256,380,9,0);
  const decal=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6), new THREE.MeshStandardMaterial({map:tex(fc), transparent:true, depthWrite:false, roughness:.9}));
  decal.rotation.x=-Math.PI/2; decal.position.set(0,.004,-1.25); scene.add(decal);

  // ceiling panels + lights
  const panelMat=new THREE.MeshBasicMaterial({color:0xe8e2ff, toneMapped:false});
  const lz=[]; for(let z=-Math.floor((RL/2-3)/5)*5; z<=RL/2-3; z+=5) lz.push(z);
  for(const z of lz){
    const p=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.5),panelMat); p.rotation.x=Math.PI/2; p.position.set(0,HH-.01,z); scene.add(p);
    const l=new THREE.PointLight(0xcfc4ff,.55,10,2); l.position.set(0,HH-.3,z); scene.add(l);
  }
  scene.add(new THREE.HemisphereLight(0x6a5cff,0x1a0a20,.45));
}

/* ---------- the lobby (bare) ---------- */
// Built in its own frame: the wall with the opening is the plane z=0 facing +z, the room runs away from it along +z.
function buildLobby(){
  const g=lobbyG;
  const face=(geo,mat,x,y,z,rx,ry)=>{ const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.rotation.set(rx||0,ry||0,0); g.add(m); return m };
  face(new THREE.PlaneGeometry(LW,LD), new THREE.MeshStandardMaterial({map:carpetTexture(), roughness:.95}), 0,0,LD/2, -Math.PI/2,0);
  face(new THREE.PlaneGeometry(LW,LD), new THREE.MeshStandardMaterial({color:0x0c0a14, roughness:1}), 0,RH,LD/2, Math.PI/2,0);
  const wt=wallTexture();
  const wall=(w,x,z,ry,hole)=>{ const t=wt.clone(); t.needsUpdate=true; t.repeat.set(w/2.2,1);
    const m=new THREE.MeshStandardMaterial({map:t, roughness:.9}); face(new THREE.PlaneGeometry(w,RH), hole?holeWall(m,2):m, x,RH/2,z, 0,ry) };
  wall(LW,0,0,0,true);                 // the wall with the opening: skips the pixels the door's opening has marked
  wall(LW,0,LD,Math.PI); wall(LD,-LW/2,LD/2,Math.PI/2); wall(LD,LW/2,LD/2,-Math.PI/2);
  const neon=(col)=>new THREE.MeshBasicMaterial({color:col, toneMapped:false}), pink=neon(0x3d86ff), cyan=neon(0xff8a2a);
  for(const sd of [-1,1]){
    face(new THREE.BoxGeometry(.04,.04,LD),pink, sd*(LW/2-.02),2.62,LD/2);
    face(new THREE.BoxGeometry(.03,.03,LD),cyan, sd*(LW/2-.02),.07,LD/2);
  }
  face(new THREE.BoxGeometry(LW,.03,.03),cyan, 0,.07,LD-.02);
  for(const z of [LD*.3,LD*.7]){
    face(new THREE.PlaneGeometry(1.3,.5), new THREE.MeshBasicMaterial({color:0xe8e2ff, toneMapped:false}), 0,RH-.01,z, Math.PI/2,0);
    const l=new THREE.PointLight(0xcfc4ff,.75,11,2); l.position.set(0,RH-.3,z); g.add(l);
  }
  const sign=(text,w,h,x,y,z,ry)=>face(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({map:signTexture(text,'72px Bungee',BRAND.orange,1024,Math.round(1024*h/w)), transparent:true, toneMapped:false}), x,y,z, 0,ry);
  lobbySign=sign('LOBBY',3.6,.5,-LW/2+.03,2.3,LD/2,Math.PI/2);   // on the left wall: the back wall carries the lobby's doors (with doorways on the side walls too, it moves over the way in: lobbyLayout)
  sign('BACK TO THE ARCADE',3,.4,0,2.8,.03,0);
}
/* The lobby's doorways, from how many it has (1 to 6, LIMITS.lobbyBays in world2.js): two on the back wall first, exactly where the two
   always were (so a lobby with two looks as it always did), then the side walls, one on each in turn (left far, right far, left near, right
   near). One doorway on its own sits in the middle of the back wall. The geometry follows the count; the bay engine moves its bays to it. */
const LOBBY_MAX=6;
function lobbyDefs(n){
  n=Math.max(1,Math.min(LOBBY_MAX,n|0));
  const back=(x)=>({parent:lobbyG, x, z:LD-.02, rot:Math.PI, width:3.4, side:0});
  const out=n===1?[back(0)]:[back(-2.2),back(2.2)];
  for(let k=2;k<n;k++){ const left=k%2===0, z=k<4?LD*.73:LD*.3; out.push({parent:lobbyG, x:left?-LW/2+.02:LW/2-.02, z, rot:left?Math.PI/2:-Math.PI/2, width:2.4, side:0}) }
  return out;
}
let lobbyCount=2, lobbySign=null;
function lobbyLayout(n){
  n=n>=1?Math.min(LOBBY_MAX,n):2;               // no doorways at all: the two places stay as they were (empty)
  if(!bayEngine || !bayEngine.layout) return;
  if(n!==lobbyCount){
    lobbyDefs(n).forEach((d,k)=>{ bayEngine.layout(HALL_BAYS+k,d); bayDefsAll[HALL_BAYS+k]=d });
    lobbyCount=n;
  }
  if(lobbySign){ const side=n>=3; lobbySign.position.set(side?-2.75:-LW/2+.03, 2.3, side?.03:LD/2); lobbySign.rotation.set(0, side?0:Math.PI/2, 0); lobbySign.scale.setScalar(side?.6:1) }
}
// Put the lobby behind the wall of bay i (or take it away with -1). Only a bay whose door links to it counts.
function setLobbyBay(i){
  const d=i>=0 ? bayDefsAll[i] : null;
  if(!d || !lobbyG){ i=-1 }
  if(i===lobbyBay) return;
  if(bayEngine){ if(lobbyBay>=0) bayEngine.setPortal(lobbyBay,false); if(i>=0) bayEngine.setPortal(i,true) }
  lobbyBay=i;
  if(i<0){ lobbyPass=null; if(lobbyG) lobbyG.visible=false; return }
  lobbyPass={side:d.side, wallX:d.side*RW/2, z:d.z};
  lobbyG.position.set(lobbyPass.wallX+d.side*WALL_T,0,d.z); lobbyG.rotation.y=d.side<0?-Math.PI/2:Math.PI/2; lobbyG.visible=true;
}
// A link to the hall's own lobby: from the registry, only the hall's live native lobby space (link.lobby); a scene without a space id (v1, the preview) names it 'lobby'.
const isLobbyLink=(lk)=>!!lk && (lk.to ? lk.lobby===true : String(lk['target-room']||lk.targetRoom||lk.room||'').toLowerCase()==='lobby');
const linksToLobby=(sc)=>!!(sc && sc.base==='door' && Number(sc.interaction)===3 && isLobbyLink(sc.link));
// Where the player may stand while the lobby door is open: the hall, the doorway and the lobby, as rectangles [x0,x1,z0,z1].
function lobbyRects(r){
  const p=lobbyPass, sd=p.side, hw=Math.max(.3, bayEngine.doorHalfWidth(lobbyBay)-.1), wx=p.wallX;
  return [
    [-RW/2+r, RW/2-r, -RL/2+r, RL/2-r],
    sd<0 ? [wx-WALL_T-LD+r, wx-WALL_T-r, p.z-LW/2+r, p.z+LW/2-r] : [wx+WALL_T+r, wx+WALL_T+LD-r, p.z-LW/2+r, p.z+LW/2-r],
    sd<0 ? [wx-WALL_T-r, wx+r, p.z-hw, p.z+hw] : [wx-r, wx+WALL_T+r, p.z-hw, p.z+hw]   // the doorway, through the thickness of the wall
  ];
}

/* ---------- the big flickering neon logo on the end wall ---------- */
const flickers=[]; let signLights=[];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
function neonUnit(mats, faulty, onAt){ const u={mats, faulty, onAt, level:0, until:0, ph:Math.random()*10, next:onAt+(faulty?1.5:4)+Math.random()*6}; flickers.push(u); return u }
function buildLogoSign(){
  const g=new THREE.Group(); g.position.set(0,1.68,-RL/2+.07); scene.add(g);
  const S=1.3;
  const plate=new THREE.Mesh(new THREE.BoxGeometry(2.9,2.9,.05), new THREE.MeshStandardMaterial({color:0x0d0d11, roughness:.35, metalness:.6}));
  plate.position.z=-.04; g.add(plate);
  const groups={};
  for(const [k,y] of [['white',.85],['blue',0],['orange',-.9]]){ const l=new THREE.PointLight(BRAND[k],1.4,7,2); l.position.set(0,y,.7); g.add(l); groups[k]={light:l, units:[]} }
  LOGO.forEach((sh,idx)=>{
    const P=sh.pts.map(([x,y])=>new THREE.Vector3(x*S,y*S,.02)), path=new THREE.CurvePath();
    for(let k=0;k<P.length;k++) path.add(new THREE.LineCurve3(P[k],P[(k+1)%P.length]));
    const col=new THREE.Color(BRAND[sh.c]);
    const core=new THREE.MeshBasicMaterial({color:col.clone(), toneMapped:false});
    const glow=new THREE.MeshBasicMaterial({color:col.clone(), transparent:true, opacity:.28, blending:THREE.AdditiveBlending, depthWrite:false, toneMapped:false});
    g.add(new THREE.Mesh(new THREE.TubeGeometry(path,P.length*18,.02,8,true),core));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(path,P.length*18,.065,8,true),glow));
    groups[sh.c].units.push(neonUnit([{m:core,base:col,kind:'core'},{m:glow,kind:'glow'}], !!sh.faulty, .6+idx*.28));
  });
  signLights.push(...Object.values(groups));
  const word=(text,x,color,delay)=>{
    const m=new THREE.MeshBasicMaterial({map:signTexture(text,'150px Monoton',color,1024,256), transparent:true, depthWrite:false, toneMapped:false});
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.9,.72),m); mesh.position.set(x,1.68,-RL/2+.04); scene.add(mesh);
    neonUnit([{m,base:new THREE.Color(1,1,1),kind:'core'}], false, delay);
  };
  word('XTRATA',-3.45,BRAND.blue,.6+LOGO.length*.28);
  word('ARCADE', 3.45,BRAND.orange,.9+LOGO.length*.28);
}
function updateNeon(t,dt){
  for(const u of flickers){
    let lv;
    if(t<u.onAt) lv=0;
    else if(calm) lv=1;
    else if(t<u.onAt+.45) lv=Math.random()<.55?1:.08;          // power-on stutter
    else {
      if(t>u.next){ u.until=t+.06+Math.random()*(u.faulty?.8:.3); u.next=u.until+(u.faulty?.8+Math.random()*3.5:4+Math.random()*10) }
      lv = t<u.until ? (Math.random()<.5 ? .12+Math.random()*.3 : 1) : .94+Math.sin(t*47+u.ph)*.03;
    }
    u.level += (lv-u.level)*Math.min(1,dt*35);
    for(const s of u.mats){ if(s.kind==='glow') s.m.opacity=.28*u.level; else s.m.color.copy(s.base).multiplyScalar(.12+.88*u.level) }
  }
  for(const g of signLights){ let a=0; for(const u of g.units) a+=u.level; g.light.intensity=(g.max||1.4)*a/g.units.length }
}

/* ---------- Bitcoin mark (public-domain logo) as paths in a unit circle ---------- */
const BTC_ORANGE='#f7931a';
const BTC = (() => {
  const arc=(cx,cy,r,a0,a1,n)=>{const o=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}return o};
  const dedupe=pts=>pts.filter((p,i)=>!i||Math.hypot(p[0]-pts[i-1][0],p[1]-pts[i-1][1])>1e-4);
  const th=-14*Math.PI/180, c=Math.cos(th), sn=Math.sin(th);
  const tf=pts=>dedupe(pts.map(([x,y])=>[x-.06,y]).map(([x,y])=>[x*c-y*sn, x*sn+y*c]));
  return {
    ring: arc(0,0,1,0,Math.PI*2,72).slice(0,-1),
    body: [ tf([[-.3,-.55],[-.3,.55]]),
            tf([[-.3,.55],[.08,.55],...arc(.08,.285,.265,Math.PI/2,-Math.PI/2,16),[-.3,.02]]),
            tf([[-.3,.02],[.13,.02],...arc(.13,-.265,.285,Math.PI/2,-Math.PI/2,16),[-.3,-.55]]) ],
    ticks:[ tf([[-.14,.55],[-.14,.77]]), tf([[.07,.55],[.07,.77]]), tf([[-.14,-.55],[-.14,-.77]]), tf([[.07,-.55],[.07,-.77]]) ],
  };
})();
function drawBitcoin(x,cx,cy,r,glow){
  x.save(); x.fillStyle=BTC_ORANGE; x.shadowColor=BTC_ORANGE; x.shadowBlur=glow||0;
  x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.fill(); x.shadowBlur=0;
  x.strokeStyle='#ffffff'; x.lineWidth=r*.16; x.lineCap='butt'; x.lineJoin='miter';
  for(const path of [...BTC.body, ...BTC.ticks]){ x.beginPath(); path.forEach(([px,py],k)=>{const X=cx+px*r*.92, Y=cy-py*r*.92; k?x.lineTo(X,Y):x.moveTo(X,Y)}); x.stroke() }
  x.restore();
}
function addNeon(g, pts, scale, closed, color, r){
  const P=pts.map(([x,y])=>new THREE.Vector3(x*scale,y*scale,.03)), path=new THREE.CurvePath();
  const n=closed?P.length:P.length-1;
  for(let k=0;k<n;k++) path.add(new THREE.LineCurve3(P[k],P[(k+1)%P.length]));
  const col=new THREE.Color(color), segs=Math.max(8,n*6);
  const core=new THREE.MeshBasicMaterial({color:col.clone(), toneMapped:false});
  const glow=new THREE.MeshBasicMaterial({color:col.clone(), transparent:true, opacity:.28, blending:THREE.AdditiveBlending, depthWrite:false, toneMapped:false});
  g.add(new THREE.Mesh(new THREE.TubeGeometry(path,segs,r,8,closed),core));
  g.add(new THREE.Mesh(new THREE.TubeGeometry(path,segs,r*3.2,8,closed),glow));
  return [{m:core,base:col,kind:'core'},{m:glow,kind:'glow'}];
}
function buildBitcoinSign(){
  const g=new THREE.Group(); g.position.set(0,1.38,RL/2-.07); g.rotation.y=Math.PI; scene.add(g);
  const S=1.02;
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.05,64), new THREE.MeshStandardMaterial({color:0x0d0d11, roughness:.35, metalness:.6}));
  disc.rotation.x=Math.PI/2; disc.position.z=-.04; g.add(disc);
  const orangeL=new THREE.PointLight(BTC_ORANGE,1.6,7,2); orangeL.position.set(0,-.3,.8); g.add(orangeL);
  const whiteL=new THREE.PointLight(0xfff3e0,.8,5,2); whiteL.position.set(0,.3,.7); g.add(whiteL);
  const ring=neonUnit(addNeon(g,BTC.ring,S,true,'#ff7300',.024), false, 1.0);
  const inner=neonUnit(addNeon(g,BTC.ring.map(([x,y])=>[x*.9,y*.9]),S,true,'#ff7300',.012), false, 1.25);
  const bodyM=[]; for(const p of BTC.body) bodyM.push(...addNeon(g,p,S,false,'#fff6ea',.024));
  const body=neonUnit(bodyM, false, 1.55);
  const tickM=[]; for(const p of BTC.ticks) tickM.push(...addNeon(g,p,S,false,'#fff6ea',.024));
  const ticks=neonUnit(tickM, true, 1.8);
  signLights.push({light:orangeL, units:[ring,inner], max:1.6}, {light:whiteL, units:[body,ticks], max:.8});
}

/* ---------- lightbox posters between the cabinets ---------- */
// Optional: paste the official Stacks logo as a data URI (from the Stacks brand kit) to show it on its poster.
const STACKS_LOGO = XA_HALL_ASSETS.STACKS_LOGO;
/* ================================================================
   POSTERS — three sets of nine, one set per Bitcoin day.
   A Bitcoin day is 144 blocks (≈24h at 10 min a block): day = floor(height / 144),
   the same rule Astro Blaster's daily board uses. Set shown = day % 3.
   Each poster: head, sub, c (colour key), art (drawing below). live:true repaints as blocks arrive.
   ================================================================ */
const AUDIO_GREEN='#39ff88';
const POSTER_SETS=[
  [ // SET 1
    {head:'PERMANENT GAMES',      sub:'Every cabinet runs an inscription on Stacks.',        c:'blue',   art:'xtrata'},
    {head:'SECURED BY BITCOIN',   sub:'Stacks settles to Bitcoin. The games stay.',           c:'orange', art:'btc'},
    {head:'MUSIC AS DATA',        sub:'Audionals: every beat and sample, inscribed.',         c:'audio',  art:'wave'},
    {head:'BUILT ON STACKS',      sub:'Smart contracts with Bitcoin finality.',               c:'stacks', art:'stacks'},
    {head:'HIGH SCORES ON-CHAIN', sub:'Beat the score. Sign it. Stay on the board.',          c:'white',  art:'scores'},
    {head:'21 MILLION',           sub:'Fixed supply. Permanent record.',                      c:'orange', art:'supply'},
    {head:'THE STACK',            sub:'Bitcoin secures. Stacks runs. Xtrata stores.',         c:'white',  art:'tiers'},
    {head:'INSERT COIN',          sub:'Press start. Your score is forever.',                  c:'orange', art:'btc'},
    {head:'INSCRIBE YOUR OWN',    sub:'Build a game. Put it in a cabinet.',                   c:'blue',   art:'xtrata'},
  ],
  [ // SET 2
    {head:'ONE DAY = 144 BLOCKS', sub:'Bitcoin keeps time in blocks. So does this arcade.',   c:'orange', art:'blocks', live:true},
    {head:'PROOF OF TRANSFER',    sub:'Stacks miners spend BTC to write every block.',        c:'stacks', art:'pox'},
    {head:'RECURSION',            sub:'Inscriptions that load inscriptions. One engine, 21 games.', c:'blue', art:'recursion'},
    {head:'SEQUENCE IT',          sub:'Audionals: beats built from on-chain samples.',        c:'audio',  art:'steps'},
    {head:'GENESIS',              sub:'3 Jan 2009. Chancellor on brink of second bailout for banks.', c:'orange', art:'genesis'},
    {head:'CLARITY',              sub:'No compiler. The code you read is the code that runs.',c:'stacks', art:'code'},
    {head:'FOREVER TWINS',        sub:'Preserve Stacks NFTs fully on-chain with Xtrata.',     c:'blue',   art:'twins'},
    {head:'XTRATA RADIO',         sub:'Every play pays the song’s holder, on-chain.',    c:'audio',  art:'radio'},
    {head:'EVERY SAT COUNTS',     sub:'One bitcoin, divisible all the way down.',             c:'orange', art:'sats'},
  ],
  [ // SET 3
    {head:'HALVING',              sub:'Every 210,000 blocks the new supply halves.',          c:'orange', art:'halving'},
    {head:'sBTC',                 sub:'Bitcoin made programmable. Backed 1:1 on Stacks.',     c:'stacks', art:'sbtc'},
    {head:'ON-CHAIN, NOT ON-SERVER', sub:'No links to rot. With Xtrata the bytes live on the chain.', c:'blue', art:'bytes'},
    {head:'AUDIONAUTS',           sub:'Sound explorers, landing on Xtrata.',                  c:'audio',  art:'helmet'},
    {head:'STACKING',             sub:'Lock STX. Earn BTC.',                                  c:'stacks', art:'stacking'},
    {head:'ASTRO BLASTER',        sub:'The first Xtrata cabinet. Daily runs reset every 144 blocks.', c:'orange', art:'ship'},
    {head:'NAKAMOTO',             sub:'Fast Stacks blocks, settled on Bitcoin.',              c:'stacks', art:'fast'},
    {head:'NOT YOUR KEYS',        sub:'Not your coins. Hold your own keys.',                  c:'white',  art:'key'},
    {head:'CREATE. INSCRIBE. SHARE.', sub:'Art, music and code. On-chain for good.',          c:'blue',   art:'xtrata'},
  ],
];
/* ---------- poster pool, second batch: 27 more (10 Xtrata, 10 Bitcoin, 7 Stacks / sBTC) ---------- */
const POSTERS_MORE=[
  // Xtrata — what it is, what's live, where it could go
  {head:'WHAT IS XTRATA?',       sub:'Art, music, code and games, inscribed on Stacks and secured by Bitcoin.', c:'blue', art:'strata'},
  {head:'RESCUED FOREVER',       sub:'Forever Twins gave Bitcoin Pepes, LEO Cats and Miami Degens on-chain twins.', c:'blue', art:'shield'},
  {head:'PLAY = PAY',            sub:'Xtrata Music: every paid play sends the song’s holder 50 microSTX, on-chain.', c:'audio', art:'eq'},
  {head:'YOUR NAME, YOUR GALLERY', sub:'Any .btc name can have its own Xtrata gallery. Your name, your collection, on-chain.', c:'blue', art:'gallery'},
  {head:'CLAIM WITH 0 STX',      sub:'A sponsor pays the fee, so new collectors can claim without holding STX.', c:'blue', art:'gift'},
  {head:'YOU’RE STANDING IN IT', sub:'21 games, one engine, one leaderboard contract. This arcade is on-chain.', c:'white', art:'joystick'},
  {head:'NEVER SWITCHED OFF',    sub:'No server to shut down. An inscribed game runs as long as the chain does.', c:'blue', art:'power'},
  {head:'THE ON-CHAIN STUDIO',   sub:'Coming: XDAW, an open music-production protocol anchored on Xtrata.', c:'audio', art:'knobs'},
  {head:'PUBLISH FOREVER',       sub:'Books, albums and research that can’t be delisted, edited or lost.', c:'blue', art:'book'},
  {head:'BUILD ON ANYTHING',     sub:'Inscriptions can load other inscriptions. Remix the chain, credit kept forever.', c:'blue', art:'nodes'},
  // Bitcoin
  {head:'THE WHITEPAPER',        sub:'31 Oct 2008. Nine pages: A Peer-to-Peer Electronic Cash System.', c:'orange', art:'paper'},
  {head:'PIZZA DAY',             sub:'22 May 2010: 10,000 BTC bought two pizzas. Price is what you pay.', c:'orange', art:'pizza'},
  {head:'2,016 BLOCKS',          sub:'Every two weeks Bitcoin retunes its difficulty to keep 10-minute blocks.', c:'orange', art:'dial'},
  {head:'DON’T TRUST. VERIFY.', sub:'Run a node and check every rule and every coin yourself.', c:'white', art:'check'},
  {head:'THE LAST SAT',          sub:'Around 2140 the final bitcoin is mined. After that, fees keep the lights on.', c:'orange', art:'hourglass'},
  {head:'TAPROOT',               sub:'Activated Nov 2021 at block 709,632. Leaner, more private, more flexible scripts.', c:'orange', art:'root'},
  {head:'LIGHTNING',             sub:'Instant, tiny payments in channels, settled on Bitcoin when you close.', c:'orange', art:'channel'},
  {head:'WRITE IT DOWN',         sub:'12 or 24 words guard your bitcoin. Never type them into a website.', c:'white', art:'seed'},
  {head:'ORDINALS',              sub:'Since 2023, art has been inscribed straight onto individual sats.', c:'orange', art:'ordinal'},
  {head:'PROOF OF WORK',         sub:'To rewrite history you’d have to redo the work. All of it.', c:'orange', art:'hash'},
  // Stacks, sBTC and layers
  {head:'.BTC NAMES',            sub:'BNS on Stacks: own yourname.btc as an on-chain asset, anchored to Bitcoin.', c:'stacks', art:'bns'},
  {head:'BITCOIN FINALITY',      sub:'Stacks blocks anchor to Bitcoin. Undoing one means undoing Bitcoin.', c:'stacks', art:'anchor'},
  {head:'NO REENTRANCY',         sub:'Clarity is decidable, so whole families of hacks can’t happen.', c:'stacks', art:'lock'},
  {head:'1 STX = 1,000,000 µSTX', sub:'Tiny, exact payments. Contract fees here are counted in microSTX.', c:'stacks', art:'micro'},
  {head:'BITCOIN THAT MOVES',    sub:'sBTC takes BTC into Stacks apps and back out to Bitcoin, 1:1.', c:'stacks', art:'loop'},
  {head:'NO SINGLE CUSTODIAN',   sub:'sBTC is run by a decentralised set of signers, not one custodian.', c:'stacks', art:'signers'},
  {head:'LAYERS, NOT FORKS',     sub:'Layer 2s add speed and apps while Bitcoin’s base rules stay untouched.', c:'white', art:'layers'},
];

function posterArtMore(x,spec,W,col,cx,cy){
  const TAU=Math.PI*2, glow=(c,b)=>{ x.shadowColor=c; x.shadowBlur=b };
  switch(spec.art){
    case 'strata': {           // stacked slabs holding files
      const icons=['♪','</>','▣','★'];
      for(let i=0;i<4;i++){ const y=92+i*44, w=230-i*10;
        x.fillStyle=i===3?BTC_ORANGE:i===2?STACKS_PURPLE:col; x.globalAlpha=i<2?.55+i*.2:1;
        x.beginPath(); x.moveTo(cx-w/2+20,y); x.lineTo(cx+w/2+20,y); x.lineTo(cx+w/2-20,y+34); x.lineTo(cx-w/2-20,y+34); x.closePath(); x.fill();
        x.globalAlpha=1; x.fillStyle='#0b0b10'; x.font='22px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText(i===3?'BITCOIN':i===2?'STACKS':icons[i],cx,y+26) }
      break; }
    case 'shield':
      glow(col,18); x.strokeStyle=col; x.lineWidth=8; x.beginPath(); x.moveTo(cx,70); x.lineTo(cx+90,100); x.quadraticCurveTo(cx+86,220,cx,268); x.quadraticCurveTo(cx-86,220,cx-90,100); x.closePath(); x.stroke();
      x.shadowBlur=0; ['#5fcf4a','#f6c945','#ff4fa3'].forEach((c2,i)=>{ x.fillStyle=c2; x.fillRect(cx-54+i*38,150,30,30) });
      x.fillStyle='#ffffff'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText('ON-CHAIN TWIN',cx,212); break;
    case 'eq': {
      const hs=[40,90,130,70,150,110,60,120,80,40];
      hs.forEach((h,i)=>{ const g=x.createLinearGradient(0,250-h,0,250); g.addColorStop(0,col); g.addColorStop(1,'#0b3d24'); x.fillStyle=g; x.fillRect(64+i*26,250-h,20,h) });
      coin(x,cx+110,96,30,STACKS_PURPLE,'STX'); break; }
    case 'gallery':
      for(let r=0;r<2;r++) for(let q=0;q<3;q++){ const fx=cx-132+q*92, fy=76+r*96; x.strokeStyle=r+q===2?col:'rgba(238,242,255,.55)'; x.lineWidth=4; x.strokeRect(fx,fy,80,80);
        x.fillStyle=['#3d86ff','#ff8a2a','#39ff88','#fc6432','#b98cff','#f7931a'][r*3+q]; x.globalAlpha=.55; x.fillRect(fx+12,fy+12,56,56); x.globalAlpha=1 }
      x.fillStyle='#ffffff'; x.font='26px VT323, monospace'; x.textAlign='center'; x.fillText('yourname.btc',cx,280); break;
    case 'gift':
      glow(col,16); x.fillStyle=col; x.fillRect(cx-90,140,180,120); x.fillRect(cx-100,112,200,34); x.shadowBlur=0;
      x.fillStyle='#ffffff'; x.fillRect(cx-12,112,24,148);
      x.strokeStyle='#ffffff'; x.lineWidth=8; x.beginPath(); x.ellipse(cx-30,98,28,16,-.4,0,TAU); x.stroke(); x.beginPath(); x.ellipse(cx+30,98,28,16,.4,0,TAU); x.stroke();
      x.fillStyle='#0b0b10'; x.font='34px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText('0 STX',cx,214); break;
    case 'joystick':
      x.fillStyle='#1b1b24'; x.fillRect(cx-140,210,280,56); x.fillStyle='#2a2a38'; x.beginPath(); x.ellipse(cx-70,212,40,12,0,0,TAU); x.fill();
      x.strokeStyle='#cfcfd8'; x.lineWidth=10; x.beginPath(); x.moveTo(cx-70,210); x.lineTo(cx-56,120); x.stroke();
      glow('#ff3fa4',18); x.fillStyle='#ff3fa4'; x.beginPath(); x.arc(cx-56,108,30,0,TAU); x.fill();
      ['#3ff0ff','#ffd23f','#39ff88'].forEach((c2,i)=>{ glow(c2,12); x.fillStyle=c2; x.beginPath(); x.ellipse(cx+20+i*44,226,17,9,0,0,TAU); x.fill() }); x.shadowBlur=0; break;
    case 'power':
      glow(col,22); x.strokeStyle=col; x.lineWidth=14; x.lineCap='round';
      x.beginPath(); x.arc(cx,cy+6,82,-Math.PI/2+.55,-Math.PI/2-.55+TAU); x.stroke(); x.beginPath(); x.moveTo(cx,cy-96); x.lineTo(cx,cy-10); x.stroke();
      x.shadowBlur=0; x.fillStyle='#ffffff'; x.font='54px VT323, monospace'; x.textAlign='center'; x.fillText('∞',cx,cy+62); break;
    case 'knobs':
      for(let i=0;i<4;i++){ const kx=cx-120+i*80; x.fillStyle='#1e1f2a'; x.beginPath(); x.arc(kx,112,28,0,TAU); x.fill();
        x.strokeStyle=col; x.lineWidth=4; x.beginPath(); x.arc(kx,112,28,Math.PI*.75,Math.PI*(.75+.4+i*.3)); x.stroke();
        x.fillStyle='#2a2b38'; x.fillRect(kx-4,160,8,100); x.fillStyle=col; glow(col,10); x.fillRect(kx-16,160+[60,20,45,10][i],32,14); x.shadowBlur=0 }
      break;
    case 'book':
      x.fillStyle='#e9e4d8'; x.beginPath(); x.moveTo(cx,96); x.quadraticCurveTo(cx-70,80,cx-140,96); x.lineTo(cx-140,256); x.quadraticCurveTo(cx-70,240,cx,256); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(cx,96); x.quadraticCurveTo(cx+70,80,cx+140,96); x.lineTo(cx+140,256); x.quadraticCurveTo(cx+70,240,cx,256); x.closePath(); x.fill();
      x.fillStyle='#8a8578'; for(let i=0;i<7;i++){ x.fillRect(cx-122,118+i*18,100,4); x.fillRect(cx+22,118+i*18,100-(i===6?50:0),4) }
      drawLogo(x,cx+86,236,26,2,0); break;
    case 'nodes': {
      const P=[[cx,110],[cx-110,170],[cx+110,170],[cx-60,250],[cx+60,250],[cx,190]];
      x.strokeStyle='rgba(238,242,255,.5)'; x.lineWidth=3; [[0,5],[1,5],[2,5],[3,5],[4,5],[0,1],[0,2],[3,4]].forEach(([a,b])=>{ x.beginPath(); x.moveTo(...P[a]); x.lineTo(...P[b]); x.stroke() });
      P.forEach(([px,py],i)=>{ glow(col,14); x.fillStyle=i===5?BTC_ORANGE:col; x.beginPath(); x.arc(px,py,i===5?24:16,0,TAU); x.fill() }); x.shadowBlur=0; break; }
    case 'paper':
      x.fillStyle='#f4f1ea'; x.fillRect(cx-100,70,200,200); x.fillStyle='#2a2a2a'; x.textAlign='center';
      x.font='16px Georgia, serif'; x.fillText('Bitcoin: A Peer-to-Peer',cx,98); x.fillText('Electronic Cash System',cx,118);
      x.font='13px Georgia, serif'; x.fillText('Satoshi Nakamoto',cx,140);
      x.fillStyle='#9a968c'; for(let i=0;i<8;i++) x.fillRect(cx-80,156+i*13,i===7?90:160,4); break;
    case 'pizza':
      x.fillStyle='#d9973a'; x.beginPath(); x.arc(cx,cy,104,0,TAU); x.fill(); x.fillStyle='#f4c44e'; x.beginPath(); x.arc(cx,cy,88,0,TAU); x.fill();
      x.fillStyle='#b8322a'; [[-40,-30],[30,-50],[50,20],[-20,40],[-60,20],[10,0],[60,-10]].forEach(([a,b])=>{ x.beginPath(); x.arc(cx+a,cy+b,13,0,TAU); x.fill() });
      x.strokeStyle='#8a5a1a'; x.lineWidth=3; for(let k=0;k<4;k++){ const a=k*Math.PI/4; x.beginPath(); x.moveTo(cx-Math.cos(a)*88,cy-Math.sin(a)*88); x.lineTo(cx+Math.cos(a)*88,cy+Math.sin(a)*88); x.stroke() }
      coin(x,cx+86,cy+80,28,BTC_ORANGE,'10K'); break;
    case 'dial':
      x.strokeStyle='#2a2a38'; x.lineWidth=18; x.beginPath(); x.arc(cx,cy+40,100,Math.PI,TAU); x.stroke();
      glow(col,14); x.strokeStyle=col; x.beginPath(); x.arc(cx,cy+40,100,Math.PI,Math.PI*1.62); x.stroke(); x.shadowBlur=0;
      x.strokeStyle='#ffffff'; x.lineWidth=6; x.beginPath(); x.moveTo(cx,cy+40); x.lineTo(cx+Math.cos(Math.PI*1.62)*80,cy+40+Math.sin(Math.PI*1.62)*80); x.stroke();
      x.fillStyle='#ffffff'; x.font='30px VT323, monospace'; x.textAlign='center'; x.fillText('10:00',cx,cy+84); break;
    case 'check':
      x.fillStyle='#15151e'; for(let i=0;i<3;i++){ x.fillRect(cx-110,84+i*52,120,44); x.fillStyle=i%2?'#15151e':'#1b1b26'; }
      for(let i=0;i<3;i++){ x.fillStyle=['#39ff88','#39ff88','#ffd23f'][i]; x.fillRect(cx-96,102+i*52,10,8); x.fillStyle='rgba(238,242,255,.3)'; x.fillRect(cx-76,104+i*52,70,4) }
      glow('#39ff88',18); x.strokeStyle='#39ff88'; x.lineWidth=14; x.lineCap='round'; x.beginPath(); x.moveTo(cx+30,170); x.lineTo(cx+62,204); x.lineTo(cx+120,118); x.stroke(); x.shadowBlur=0; break;
    case 'hourglass':
      x.strokeStyle='#ffffff'; x.lineWidth=5; x.beginPath(); x.moveTo(cx-70,76); x.lineTo(cx+70,76); x.lineTo(cx+8,168); x.lineTo(cx+70,260); x.lineTo(cx-70,260); x.lineTo(cx-8,168); x.closePath(); x.stroke();
      x.fillStyle=BTC_ORANGE; x.beginPath(); x.moveTo(cx-30,120); x.lineTo(cx+30,120); x.lineTo(cx+6,160); x.lineTo(cx-6,160); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(cx-62,256); x.lineTo(cx+62,256); x.lineTo(cx+20,206); x.lineTo(cx-20,206); x.closePath(); x.fill();
      x.fillStyle='#ffffff'; x.font='30px VT323, monospace'; x.textAlign='center'; x.fillText('~2140',cx+118-20,176); break;
    case 'root':
      x.strokeStyle='#8a5a2a'; x.lineWidth=12; x.beginPath(); x.moveTo(cx,70); x.lineTo(cx,170); x.stroke();
      glow(col,12); x.strokeStyle=col; x.lineWidth=5; for(const [a,b,c2,d] of [[0,170,-90,260],[0,170,-30,268],[0,170,40,266],[0,170,100,250],[-50,215,-110,230],[60,212,120,212]]){ x.beginPath(); x.moveTo(cx+a,b); x.quadraticCurveTo(cx+(a+c2)/2,b+30,cx+c2,d); x.stroke() }
      x.shadowBlur=0; x.fillStyle='#39ff88'; x.beginPath(); x.arc(cx,86,40,0,TAU); x.fill(); break;
    case 'channel':
      coin(x,cx-100,cy,40,BTC_ORANGE,'A'); coin(x,cx+100,cy,40,BTC_ORANGE,'B');
      glow('#ffd23f',16); x.strokeStyle='#ffd23f'; x.lineWidth=4; for(const o of [-18,18]){ x.beginPath(); x.moveTo(cx-56,cy+o); x.lineTo(cx+56,cy+o); x.stroke() }
      x.shadowBlur=0; x.fillStyle='#ffffff'; for(let i=0;i<4;i++){ x.beginPath(); x.arc(cx-42+i*28,cy+(i%2?18:-18),5,0,TAU); x.fill() }
      x.font='24px VT323, monospace'; x.textAlign='center'; x.fillText('ms, not minutes',cx,cy+86); break;
    case 'seed':
      x.font='17px VT323, monospace'; x.textAlign='left';
      for(let i=0;i<12;i++){ const q=i%3, r=Math.floor(i/3), bx=cx-150+q*102, by=76+r*48; x.strokeStyle='rgba(238,242,255,.45)'; x.lineWidth=2; x.strokeRect(bx,by,92,38);
        x.fillStyle=col; x.fillText(String(i+1).padStart(2,'0'),bx+6,by+24); x.fillStyle='#3a3b48'; x.fillRect(bx+30,by+20,52,4) }
      break;
    case 'ordinal': {
      coin(x,cx,cy,96,BTC_ORANGE,''); const px=14, art=['..####..','.#....#.','#.#..#.#','#......#','#.#..#.#','#..##..#','.#....#.','..####..'];
      x.fillStyle='#0b0b10'; art.forEach((row,r)=>[...row].forEach((ch,q)=>{ if(ch==='#') x.fillRect(cx-56+q*px,cy-56+r*px,px,px) }));
      x.fillStyle='#ffffff'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText('ONE SAT · ONE ARTWORK',cx,cy+122); break; }
    case 'hash': {
      x.fillStyle='#050508'; x.fillRect(30,74,W-60,194); x.strokeStyle=col; x.lineWidth=2; x.strokeRect(30,74,W-60,194);
      const R=rng(21), hex=n=>{ let s=''; for(let i=0;i<n;i++) s+=Math.floor(R()*16).toString(16); return s };
      x.textAlign='left';
      for(let r=0;r<6;r++){ const lead='0000000000000000000'.slice(0, r===5?19:4+r*2), t=lead+hex(28-lead.length);
        x.fillStyle=r===5?col:'rgba(238,242,255,.55)'; fitFont(x,t,24,'VT323, monospace',W-84); x.fillText(t,44,106+r*30) }
      break; }
    case 'bns':
      glow(STACKS_PURPLE,20); x.fillStyle=STACKS_PURPLE; x.beginPath(); x.roundRect ? x.roundRect(cx-150,130,300,76,38) : x.rect(cx-150,130,300,76); x.fill(); x.shadowBlur=0;
      x.fillStyle='#ffffff'; x.textAlign='center'; fitFont(x,'yourname.btc',40,'VT323, monospace',270); x.fillText('yourname.btc',cx,180); break;
    case 'anchor':
      glow(col,16); x.strokeStyle=col; x.lineWidth=12; x.lineCap='round';
      x.beginPath(); x.arc(cx,92,20,0,TAU); x.stroke(); x.beginPath(); x.moveTo(cx,112); x.lineTo(cx,262); x.stroke(); x.beginPath(); x.moveTo(cx-50,142); x.lineTo(cx+50,142); x.stroke();
      x.beginPath(); x.arc(cx,182,84,Math.PI*.15,Math.PI*.85); x.stroke(); x.shadowBlur=0; drawBitcoin(x,cx,262,22,10); break;
    case 'lock':
      x.strokeStyle='#cfd3e2'; x.lineWidth=16; x.beginPath(); x.arc(cx,138,52,Math.PI,TAU); x.lineTo(cx+52,170); x.moveTo(cx-52,138); x.lineTo(cx-52,170); x.stroke();
      glow(col,18); x.fillStyle=col; x.fillRect(cx-86,166,172,110); x.shadowBlur=0; x.fillStyle='#0b0b10'; x.beginPath(); x.arc(cx,208,14,0,TAU); x.fill(); x.fillRect(cx-5,212,10,34); break;
    case 'micro':
      coin(x,cx-100,cy-20,46,STACKS_PURPLE,'1');
      x.fillStyle='#ffffff'; x.font='40px VT323, monospace'; x.textAlign='center'; x.fillText('=',cx-30,cy-8);
      x.fillStyle=col; fitFont(x,'1,000,000',46,'Bungee, Impact, sans-serif',170); x.textAlign='left'; x.fillText('1,000,000',cx-8,cy-6);
      x.fillStyle='#ffffff'; x.font='30px VT323, monospace'; x.textAlign='center'; x.fillText('µSTX',cx+80,cy+32);
      for(let i=0;i<30;i++){ x.fillStyle=col; x.globalAlpha=.25+(i%5)*.12; x.fillRect(60+i*9,cy+70,6,6) } x.globalAlpha=1; break;
    case 'loop':
      drawBitcoin(x,cx,96,34,12); coin(x,cx,248,30,'#ffffff','sBTC',BTC_ORANGE);
      glow(col,12); x.strokeStyle=col; x.lineWidth=6;
      x.beginPath(); x.arc(cx,172,100,-Math.PI*.42,Math.PI*.42); x.stroke(); x.beginPath(); x.arc(cx,172,100,Math.PI*.58,Math.PI*1.42); x.stroke(); x.shadowBlur=0;
      x.fillStyle='#ffffff'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText('APPS',cx+140,178); x.fillText('BITCOIN',cx-138,178); break;
    case 'signers':
      coin(x,cx,cy,44,'#ffffff','sBTC',BTC_ORANGE);
      for(let i=0;i<10;i++){ const a=i/10*TAU, px=cx+Math.cos(a)*110, py=cy+Math.sin(a)*96;
        x.strokeStyle='rgba(252,100,50,.4)'; x.lineWidth=2; x.beginPath(); x.moveTo(cx,cy); x.lineTo(px,py); x.stroke();
        glow(col,10); x.fillStyle=col; x.beginPath(); x.arc(px,py,12,0,TAU); x.fill(); x.shadowBlur=0 }
      break;
    case 'layers':
      x.fillStyle=BTC_ORANGE; x.fillRect(40,236,W-80,36); x.fillStyle='#0b0b10'; x.font='22px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText('BITCOIN L1',cx,262);
      [['STACKS',STACKS_PURPLE,76,196],['LIGHTNING','#ffd23f',-80,196],['XTRATA',BRAND.blue,76,148],['APPS','#39ff88',-80,148]].forEach(([t,c2,o,y])=>{ x.fillStyle=c2; x.fillRect(cx+o-72,y,144,34); x.fillStyle='#0b0b10'; x.font='16px Bungee, Impact, sans-serif'; x.fillText(t,cx+o,y+23) });
      x.strokeStyle='rgba(238,242,255,.4)'; x.lineWidth=2; for(const o of [-80,76]){ x.beginPath(); x.moveTo(cx+o,230); x.lineTo(cx+o,236); x.stroke() }
      break;
    default: posterArtFun(x,spec,W,col,cx,cy);
  }
}

/* ---------- poster pool, third batch: 27 for fun — arcade-universe ads, in-jokes and house rules ---------- */
const POSTERS_FUN=[
  {head:'HODL-O-MATIC',          sub:'Diamond-grade hand warmers. Keeps your grip steady through any dip.', c:'fun', art:'hands', foot:'ADVERTISEMENT'},
  {head:'NONCE FLAKES',          sub:'Part of a complete block. Now with 32 bits of crunch in every bowl.', c:'gold', art:'cereal', foot:'ADVERTISEMENT'},
  {head:'HALL OF FAME',          sub:'If you’re reading this, you’re not on it. Yet. Press START.', c:'gold', art:'trophy'},
  {head:'INSERT SATS',           sub:'All machines accept sats. Change given in microSTX. No tokens, no refunds.', c:'orange', art:'slot', foot:'MANAGEMENT'},
  {head:'MEMPOOL SPA',           sub:'Transaction stuck? Float in our heated pool until the next block finds you.', c:'fun', art:'spa', foot:'ADVERTISEMENT'},
  {head:'BLOCK 0 DINER',         sub:'Genesis burgers since 2009. Two-pizza deal: 10,000 BTC (sold out).', c:'orange', art:'burger', foot:'ADVERTISEMENT'},
  {head:'PILOTS WANTED',         sub:'Astro Blaster Academy: daily runs reset every 144 blocks. Excuses don’t.', c:'blue', art:'target'},
  {head:'SPRINT 40 CHAMPIONSHIP', sub:'Fastest clear on Chainfall wins eternal on-chain glory. Only glory.', c:'blue', art:'tetro'},
  {head:'NO RUNNING',            sub:'In the arcade. Except in Neon Nonce. Especially in Neon Nonce.', c:'white', art:'norun', foot:'MANAGEMENT'},
  {head:'CAUTION: WET HASHES',   sub:'Floor freshly mined. Please proceed at one step every ten minutes.', c:'gold', art:'caution', foot:'MANAGEMENT'},
  {head:'SATOSHI’S SNACK BAR', sub:'Everything costs 1 sat. Please don’t ask what it cost in 2010.', c:'orange', art:'snack', foot:'ADVERTISEMENT'},
  {head:'LOST: ONE PRIVATE KEY', sub:'Last seen on a sticky note. Reward: none. It’s gone. Back yours up properly.', c:'white', art:'sticky', foot:'NOTICEBOARD'},
  {head:'FEW UNDERSTAND',        sub:'This poster. Stare at it for 144 blocks and it all makes sense.', c:'stacks', art:'eye'},
  {head:'GM',                    sub:'Say it to the player next to you. It’s basic on-chain etiquette.', c:'gold', art:'sunrise'},
  {head:'WAGMI GYM',             sub:'Build hash power. Leg day every 2,016 blocks. Rest days: never.', c:'fun', art:'dumbbell', foot:'ADVERTISEMENT'},
  {head:'NUMBER GO UP',          sub:'Our high-score tables only know one direction.', c:'audio', art:'upchart'},
  {head:'TOUCH GRASS',           sub:'Recommended between sessions by 9 out of 10 arcade doctors. Grass not included.', c:'audio', art:'grass', foot:'PUBLIC SERVICE'},
  {head:'PIXEL PETS',            sub:'Adopt a pixel. Eats sats, never sleeps, lives forever on Xtrata.', c:'fun', art:'pet', foot:'ADVERTISEMENT'},
  {head:'ANTI-FUD SPRAY',        sub:'Clears the air in seconds. Warning: do not spray near exchanges.', c:'audio', art:'spray', foot:'ADVERTISEMENT'},
  {head:'404? NOT HERE.',        sub:'On Xtrata nothing goes missing. Inscribed files are always found.', c:'blue', art:'e404'},
  {head:'RAGE-QUIT BOOTH',       sub:'Scream in private. Your score stays public. Forever.', c:'fun', art:'booth', foot:'MANAGEMENT'},
  {head:'ORANGE PILL DISPENSER', sub:'Take one. Side effects include reading whitepapers at 3am.', c:'orange', art:'pill', foot:'ADVERTISEMENT'},
  {head:'THE BLOCKHEADS',        sub:'Live tonight! The house band plays a new set roughly every ten minutes.', c:'audio', art:'band', foot:'GIG POSTER'},
  {head:'SPEEDRUN THE HALVING',  sub:'World record: about four years. Nobody has ever beaten it.', c:'orange', art:'stopwatch'},
  {head:'SATOSHI ONE FLIGHT SCHOOL', sub:'Learn to land softly on the moon. HODLing hard is on the syllabus.', c:'white', art:'lander', foot:'ADVERTISEMENT'},
  {head:'BIT PONG LEAGUE',       sub:'League night every Bitcoin day. Rally the chain, bring your own paddle.', c:'stacks', art:'paddles'},
  {head:'LEADERBOARD COURT',     sub:'All rulings are final. Appeals may be filed with Bitcoin.', c:'white', art:'gavel', foot:'MANAGEMENT'},
];

function posterArtFun(x,spec,W,col,cx,cy){
  const TAU=Math.PI*2, glow=(c,b)=>{ x.shadowColor=c; x.shadowBlur=b }, T=(t,px,y,c,fam)=>{ x.fillStyle=c||'#ffffff'; x.textAlign='center'; x.font=px+'px '+(fam||'Bungee, Impact, sans-serif'); x.fillText(t,cx,y) };
  const star=(sx,sy,r,c)=>{ x.fillStyle=c; x.beginPath(); for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, rr=k%2?r*.45:r; x.lineTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr) } x.closePath(); x.fill() };
  switch(spec.art){
    case 'hands':
      glow('#7df9ff',24); x.fillStyle='#7df9ff'; x.beginPath(); x.moveTo(cx,86); x.lineTo(cx+70,136); x.lineTo(cx,262); x.lineTo(cx-70,136); x.closePath(); x.fill(); x.shadowBlur=0;
      x.strokeStyle='#ffffff'; x.lineWidth=3; x.beginPath(); x.moveTo(cx-70,136); x.lineTo(cx+70,136); x.moveTo(cx-30,136); x.lineTo(cx,262); x.lineTo(cx+30,136); x.moveTo(cx-30,136); x.lineTo(cx,86); x.lineTo(cx+30,136); x.stroke();
      star(cx+96,96,16,'#ffffff'); star(cx-100,220,11,'#ffffff'); break;
    case 'cereal':
      x.fillStyle=col; x.fillRect(cx-80,74,160,196); x.fillStyle='#0b0b10'; x.fillRect(cx-66,88,132,40); T('NONCE',26,117,col);
      x.fillStyle='#ffffff'; x.beginPath(); x.ellipse(cx,212,56,26,0,0,TAU); x.fill();
      x.fillStyle=BTC_ORANGE; for(const [a,b] of [[-26,-6],[0,-12],[24,-4],[-10,6],[14,8]]){ x.beginPath(); x.arc(cx+a,206+b,9,0,TAU); x.fill() }
      x.fillStyle='#0b0b10'; x.font='14px VT323, monospace'; x.textAlign='center'; x.fillText('32 BITS OF CRUNCH',cx,152); break;
    case 'trophy':
      glow(col,24); x.fillStyle=col; x.beginPath(); x.moveTo(cx-70,82); x.lineTo(cx+70,82); x.quadraticCurveTo(cx+66,190,cx,196); x.quadraticCurveTo(cx-66,190,cx-70,82); x.fill();
      x.lineWidth=10; x.strokeStyle=col; x.beginPath(); x.arc(cx-70,122,28,Math.PI*.5,Math.PI*1.5); x.stroke(); x.beginPath(); x.arc(cx+70,122,28,-Math.PI*.5,Math.PI*.5); x.stroke();
      x.fillRect(cx-12,196,24,36); x.fillRect(cx-56,232,112,26); x.shadowBlur=0; T('#1',40,150,'#0b0b10'); break;
    case 'slot':
      x.fillStyle='#1c1c24'; x.fillRect(cx-90,80,180,190); x.strokeStyle='#5a5a66'; x.lineWidth=4; x.strokeRect(cx-90,80,180,190);
      glow(BTC_ORANGE,20); x.fillStyle=BTC_ORANGE; x.fillRect(cx-8,110,16,64); x.shadowBlur=0;
      drawBitcoin(x,cx,226,32,14); T('SATS ONLY',16,262,'#cfd3e2','VT323, monospace'); break;
    case 'spa':
      x.fillStyle='#16384f'; x.beginPath(); x.ellipse(cx,200,130,50,0,0,TAU); x.fill();
      x.strokeStyle='#7df9ff'; x.lineWidth=3; for(let i=0;i<3;i++){ x.beginPath(); x.ellipse(cx,200,110-i*30,40-i*11,0,0,TAU); x.stroke() }
      x.fillStyle='#ffd23f'; for(const [a,b] of [[-60,-2],[40,-8]]){ x.beginPath(); x.ellipse(cx+a,196+b,20,14,0,0,TAU); x.fill(); x.beginPath(); x.arc(cx+a+14,182+b,10,0,TAU); x.fill() }
      x.strokeStyle='rgba(255,255,255,.6)'; x.lineWidth=3; for(const o of [-30,0,30]){ x.beginPath(); x.moveTo(cx+o,140); x.quadraticCurveTo(cx+o+12,120,cx+o,100); x.quadraticCurveTo(cx+o-12,80,cx+o,64); x.stroke() }
      break;
    case 'burger':
      x.fillStyle='#d9973a'; x.beginPath(); x.ellipse(cx,138,110,54,0,Math.PI,TAU); x.fill();
      x.fillStyle='#5fcf4a'; x.fillRect(cx-112,138,224,12); x.fillStyle='#ffd23f'; x.fillRect(cx-108,150,216,12);
      x.fillStyle='#6b3a1f'; x.fillRect(cx-110,162,220,30); x.fillStyle='#d9973a'; x.beginPath(); x.ellipse(cx,196,110,26,0,0,Math.PI); x.fill(); x.fillRect(cx-110,192,220,8);
      x.fillStyle='#fff3c4'; for(const [a,b] of [[-40,-24],[0,-38],[40,-22],[-70,-10],[72,-8]]){ x.beginPath(); x.ellipse(cx+a,138+b,5,3,.4,0,TAU); x.fill() }
      T('BLOCK 0',20,256,col,'VT323, monospace'); break;
    case 'target':
      for(let r=5;r>0;r--){ x.fillStyle=r%2?col:'#0b0b10'; x.beginPath(); x.arc(cx,cy,r*20,0,TAU); x.fill() }
      x.strokeStyle='#ffffff'; x.lineWidth=3; x.beginPath(); x.moveTo(cx-120,cy); x.lineTo(cx+120,cy); x.moveTo(cx,cy-120); x.lineTo(cx,cy+120); x.stroke();
      x.fillStyle=BTC_ORANGE; x.fillRect(cx-3,cy-3,6,6); break;
    case 'tetro': {
      const s=30, cells=[[[0,0],[1,0],[2,0],[1,1]],'#b98cff',[-3,0]],L2=[[[0,0],[0,1],[0,2],[1,2]],BTC_ORANGE,[1,-1]],I=[[[0,0],[1,0],[2,0],[3,0]],'#3ff0ff',[-2,3]];
      for(const [c2,colr,[ox,oy]] of [cells,L2,I]) c2.forEach(([a,b])=>{ x.fillStyle=colr; glow(colr,8); x.fillRect(cx+(ox+a)*s,110+(oy+b)*s,s-3,s-3) });
      x.shadowBlur=0; T('0:39.21',28,262,'#ffffff','VT323, monospace'); break; }
    case 'norun':
      x.strokeStyle='#ff4d6d'; x.lineWidth=14; x.beginPath(); x.arc(cx,cy,96,0,TAU); x.stroke();
      x.fillStyle='#ffffff'; x.beginPath(); x.arc(cx+10,cy-56,14,0,TAU); x.fill(); x.lineWidth=12; x.strokeStyle='#ffffff'; x.lineCap='round';
      x.beginPath(); x.moveTo(cx+4,cy-36); x.lineTo(cx-8,cy+14); x.lineTo(cx-40,cy+50); x.moveTo(cx-8,cy+14); x.lineTo(cx+26,cy+30); x.lineTo(cx+30,cy+64); x.moveTo(cx+2,cy-26); x.lineTo(cx-36,cy-8); x.moveTo(cx+2,cy-26); x.lineTo(cx+40,cy-16); x.stroke();
      x.strokeStyle='#ff4d6d'; x.lineWidth=14; x.beginPath(); x.moveTo(cx-68,cy-68); x.lineTo(cx+68,cy+68); x.stroke(); break;
    case 'caution':
      x.fillStyle=col; x.beginPath(); x.moveTo(cx,70); x.lineTo(cx+120,266); x.lineTo(cx-120,266); x.closePath(); x.fill();
      x.fillStyle='#0b0b10'; x.beginPath(); x.moveTo(cx,100); x.lineTo(cx+96,252); x.lineTo(cx-96,252); x.closePath(); x.fill();
      T('#',96,236,col,'VT323, monospace'); break;
    case 'snack':
      x.fillStyle='#2a1c10'; x.fillRect(cx-120,90,240,150);
      x.fillStyle='#e7c08a'; x.beginPath(); x.arc(cx-70,150,30,0,TAU); x.fill(); x.fillStyle='#ff8fd8'; x.beginPath(); x.arc(cx-70,150,24,0,TAU); x.fill(); x.fillStyle='#2a1c10'; x.beginPath(); x.arc(cx-70,150,9,0,TAU); x.fill();
      x.fillStyle='#ffffff'; x.fillRect(cx-22,128,40,46); x.strokeStyle='#ffffff'; x.lineWidth=5; x.beginPath(); x.arc(cx+22,150,11,-Math.PI/2,Math.PI/2); x.stroke(); x.fillStyle='#6b3a1f'; x.fillRect(cx-18,132,32,8);
      x.fillStyle='#f4c44e'; x.beginPath(); x.moveTo(cx+48,124); x.lineTo(cx+100,124); x.lineTo(cx+74,180); x.closePath(); x.fill(); x.fillStyle='#b8322a'; x.beginPath(); x.arc(cx+72,138,6,0,TAU); x.fill();
      x.fillStyle=BTC_ORANGE; x.fillRect(cx-120,196,240,44); T('1 SAT EACH',26,228,'#0b0b10'); break;
    case 'sticky':
      x.save(); x.translate(cx,cy); x.rotate(-.08); x.fillStyle='#ffe066'; x.fillRect(-100,-96,200,190);
      x.fillStyle='#2a2a2a'; x.font='22px VT323, monospace'; x.textAlign='left';
      ['my seed phrase:','apple ...','(the dog ate','the rest)'].forEach((t,i)=>x.fillText(t,-84,-54+i*34)); x.restore(); break;
    case 'eye':
      glow(col,18); x.strokeStyle=col; x.lineWidth=8; x.beginPath(); x.moveTo(cx-130,cy); x.quadraticCurveTo(cx,cy-110,cx+130,cy); x.quadraticCurveTo(cx,cy+110,cx-130,cy); x.stroke(); x.shadowBlur=0;
      x.fillStyle=col; x.beginPath(); x.arc(cx,cy,44,0,TAU); x.fill(); drawBitcoin(x,cx,cy,26,0);
      break;
    case 'sunrise': {
      const g=x.createLinearGradient(0,70,0,270); g.addColorStop(0,'#1b1040'); g.addColorStop(1,'#ff8a2a'); x.fillStyle=g; x.fillRect(40,70,W-80,200);
      glow(col,30); x.fillStyle=col; x.beginPath(); x.arc(cx,250,80,Math.PI,TAU); x.fill(); x.shadowBlur=0;
      x.fillStyle='#0b0b10'; for(let i=0;i<4;i++) x.fillRect(40,200+i*14,W-80,4+i); break; }
    case 'dumbbell':
      glow(col,14); x.fillStyle=col; x.fillRect(cx-100,cy-8,200,16);
      for(const s of [-1,1]){ x.fillRect(cx+s*100-(s>0?0:26),cy-60,26,120); x.fillRect(cx+s*130-(s>0?0:20),cy-42,20,84) } x.shadowBlur=0;
      T('2,016',22,cy+100,'#ffffff','VT323, monospace'); break;
    case 'upchart':
      x.strokeStyle='rgba(238,242,255,.25)'; x.lineWidth=2; for(let i=0;i<5;i++){ x.beginPath(); x.moveTo(50,90+i*40); x.lineTo(W-50,90+i*40); x.stroke() }
      glow(col,16); x.strokeStyle=col; x.lineWidth=7; x.lineJoin='round'; x.beginPath(); [[50,250],[100,236],[140,244],[190,196],[230,206],[270,140],[300,150],[334,80]].forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b)); x.stroke();
      x.fillStyle=col; x.beginPath(); x.moveTo(346,66); x.lineTo(318,76); x.lineTo(338,98); x.closePath(); x.fill(); x.shadowBlur=0; break;
    case 'grass':
      x.fillStyle='#1d4a22'; x.fillRect(40,236,W-80,34);
      for(let i=0;i<40;i++){ const gx=46+i*7.4, h=40+((i*37)%50); x.strokeStyle=i%3?col:'#5fcf4a'; x.lineWidth=4; x.beginPath(); x.moveTo(gx,240); x.quadraticCurveTo(gx+6,240-h/2,gx+(i%2?10:-6),240-h); x.stroke() }
      glow('#ffd23f',20); x.fillStyle='#ffd23f'; x.beginPath(); x.arc(cx+100,110,30,0,TAU); x.fill(); x.shadowBlur=0; break;
    case 'pet': {
      const px=18, art=['..####..','.######.','##.##.##','########','########','.#.##.#.','#......#'];
      glow(col,14); x.fillStyle=col; art.forEach((row,r)=>[...row].forEach((ch,q)=>{ if(ch==='#') x.fillRect(cx-72+q*px,100+r*px,px-1,px-1) })); x.shadowBlur=0;
      x.fillStyle='#ffffff'; x.fillRect(cx-36+2,100+2*px+4,8,8); x.fillRect(cx+18+2,100+2*px+4,8,8);
      T('♥ ♥ ♥',26,256,'#ff4d6d','VT323, monospace'); break; }
    case 'spray':
      x.fillStyle='#cfd3e2'; x.fillRect(cx-40,120,80,146); x.fillStyle=col; x.fillRect(cx-40,160,80,60); T('FUD',26,200,'#0b0b10');
      x.fillStyle='#8a8fa8'; x.fillRect(cx-16,98,32,22); x.fillRect(cx+16,100,14,8);
      x.fillStyle='rgba(255,255,255,.55)'; for(let i=0;i<26;i++){ const a=-.5+((i*29)%10)/10, r=30+((i*53)%70); x.beginPath(); x.arc(cx+30+Math.cos(a)*r,104+Math.sin(a)*r*.6,3,0,TAU); x.fill() }
      break;
    case 'e404':
      T('404',110,210,'#2a2b38'); x.strokeStyle='#ff4d6d'; x.lineWidth=12; x.beginPath(); x.moveTo(cx-130,110); x.lineTo(cx+130,230); x.stroke();
      glow(col,14); x.strokeStyle=col; x.lineWidth=12; x.lineCap='round'; x.beginPath(); x.moveTo(cx+60,236); x.lineTo(cx+86,262); x.lineTo(cx+132,206); x.stroke(); x.shadowBlur=0; break;
    case 'booth':
      x.fillStyle='#2a1a3a'; x.fillRect(cx-80,74,160,196); x.fillStyle='#0b0b10'; x.fillRect(cx-60,110,120,150);
      glow('#ff4d6d',16); x.fillStyle='#ff4d6d'; x.fillRect(cx-60,82,120,22); x.shadowBlur=0; T('OCCUPIED',16,99,'#0b0b10','VT323, monospace');
      T('AAAAAAH',28,198,'#ffffff'); break;
    case 'pill':
      x.save(); x.translate(cx,cy); x.rotate(-.5); glow(BTC_ORANGE,24);
      x.fillStyle=BTC_ORANGE; x.beginPath(); x.arc(-50,0,48,Math.PI/2,Math.PI*1.5); x.lineTo(0,-48); x.lineTo(0,48); x.closePath(); x.fill();
      x.fillStyle='#ffffff'; x.beginPath(); x.arc(50,0,48,-Math.PI/2,Math.PI/2); x.lineTo(0,48); x.lineTo(0,-48); x.closePath(); x.fill(); x.shadowBlur=0; x.restore(); break;
    case 'band':
      x.fillStyle='#1b1b24'; x.fillRect(40,226,W-80,44);
      for(const [o,c2] of [[-100,'#ff3fa4'],[0,col],[100,'#3ff0ff']]){ glow(c2,14); x.fillStyle=c2; x.fillRect(cx+o-26,150,52,52); x.fillRect(cx+o-14,202,28,24); x.shadowBlur=0; x.fillStyle='#0b0b10'; x.fillRect(cx+o-14,168,8,8); x.fillRect(cx+o+6,168,8,8) }
      x.fillStyle='#ffffff'; x.font='40px sans-serif'; x.textAlign='center'; x.fillText('♫',cx-120,110); x.fillText('♪',cx+124,100); break;
    case 'stopwatch':
      x.strokeStyle='#ffffff'; x.lineWidth=10; x.beginPath(); x.arc(cx,cy+16,92,0,TAU); x.stroke(); x.fillStyle='#ffffff'; x.fillRect(cx-16,56,32,18);
      glow(col,16); x.fillStyle=col; x.beginPath(); x.moveTo(cx,cy+16); x.arc(cx,cy+16,80,-Math.PI/2,-Math.PI/2+TAU*.6); x.closePath(); x.fill(); x.shadowBlur=0;
      T('4Y',36,cy+30,'#0b0b10'); break;
    case 'lander':
      x.fillStyle='#cfd3e2'; x.beginPath(); x.arc(cx+110,96,30,0,TAU); x.fill();
      x.fillStyle='#8a8fa8'; x.fillRect(40,248,W-80,24);
      x.fillStyle='#e9ecf5'; x.fillRect(cx-40,128,80,60); x.fillStyle='#ffd23f'; x.fillRect(cx-40,188,80,12);
      x.strokeStyle='#e9ecf5'; x.lineWidth=5; x.beginPath(); x.moveTo(cx-36,198); x.lineTo(cx-66,246); x.moveTo(cx+36,198); x.lineTo(cx+66,246); x.stroke();
      drawBitcoin(x,cx,156,18,0); break;
    case 'paddles':
      glow('#3ff0ff',18); x.fillStyle='#3ff0ff'; x.fillRect(58,110,18,110); glow('#ff4d6d',18); x.fillStyle='#ff4d6d'; x.fillRect(W-76,130,18,110);
      x.shadowBlur=0; x.setLineDash([10,10]); x.strokeStyle='rgba(238,242,255,.4)'; x.lineWidth=3; x.beginPath(); x.moveTo(cx,76); x.lineTo(cx,268); x.stroke(); x.setLineDash([]);
      drawBitcoin(x,cx+50,160,18,12); break;
    case 'gavel':
      x.save(); x.translate(cx,cy-10); x.rotate(-.6); x.fillStyle='#8a5a2a'; x.fillRect(-10,-10,20,150); x.fillStyle='#b07a3a'; x.fillRect(-60,-50,120,54); x.restore();
      x.fillStyle='#6b4422'; x.fillRect(cx-80,236,160,24); drawBitcoin(x,cx+90,236,20,10); break;
    default: posterArtStacks(x,spec,W,col,cx,cy);
  }
}

/* ---------- poster pool, fourth batch: 27 on the people, platforms, groups and history of Stacks ---------- */
const POSTERS_STACKS=[
  {head:'BLOCKSTACK, 2013',       sub:'Founded by Muneeb Ali and Ryan Shea. Through Y Combinator in 2014.', c:'stacks', art:'founders', foot:'STACKS HISTORY'},
  {head:'DR. MUNEEB',             sub:'Princeton PhD in computer science, 2017. Also a technical adviser to HBO’s Silicon Valley.', c:'stacks', art:'gradcap', foot:'STACKS PEOPLE'},
  {head:'NAMECOIN → BITCOIN', sub:'Blockstack’s naming system started on Namecoin, then moved to Bitcoin for its security.', c:'orange', art:'migrate', foot:'STACKS HISTORY'},
  {head:'FIRST OF ITS KIND',      sub:'July 2019: about $23M raised in the first SEC-qualified token offering.', c:'white', art:'stamp', foot:'STACKS HISTORY'},
  {head:'THE PoX PAPER',          sub:'11 May 2020. Muneeb Ali, Aaron Blankstein, Jude Nelson, Michael J. Freedman and team.', c:'stacks', art:'pages', foot:'STACKS PEOPLE'},
  {head:'CLARITY × ALGORAND', sub:'June 2020: Blockstack and Algorand announced they would both adopt Clarity.', c:'white', art:'brackets', foot:'STACKS HISTORY'},
  {head:'BLOCKSTACK → STACKS', sub:'October 2020: the community renamed the network Stacks.', c:'stacks', art:'rename', foot:'STACKS HISTORY'},
  {head:'14 JANUARY 2021',        sub:'Stacks 2.0 goes live, and the founding company gives up sole control.', c:'gold', art:'launch', foot:'STACKS HISTORY'},
  {head:'HIRO',                   sub:'Blockstack PBC became Hiro: makers of Clarinet, the Stacks API and developer tools.', c:'blue', art:'toolbox', foot:'STACKS PLATFORMS'},
  {head:'1,127 BTC',              sub:'Paid to STX stackers in 2021, the first year of Stacks 2.0.', c:'orange', art:'coinpile', foot:'STACKS HISTORY'},
  {head:'BITCOIN BIRDS',          sub:'A 12-year-old artist’s 400 birds sold over $1M, with proceeds backing bird rescue.', c:'audio', art:'bird', foot:'STACKS NFTS'},
  {head:'CRASHPUNKS',             sub:'Dropped 12 Dec 2021, a nod to Stacks’ Snow Crash roots.', c:'fun', art:'punk', foot:'STACKS NFTS'},
  {head:'MEGAPONT',               sub:'The ape club you could upgrade with swappable robot parts.', c:'gold', art:'robot', foot:'STACKS NFTS'},
  {head:'BOOMBOXES',              sub:'The first NFTs on Stacks that earned yield while you held them.', c:'fun', art:'boombox', foot:'STACKS NFTS'},
  {head:'CITYCOINS',              sub:'2021: MiamiCoin and NYCCoin mined treasuries for their cities. A bold experiment.', c:'gold', art:'skyline', foot:'STACKS HISTORY'},
  {head:'ARKADIKO',               sub:'The USDA stablecoin and self-repaying loans, from Stacks’ first DeFi wave.', c:'audio', art:'vault', foot:'STACKS PLATFORMS'},
  {head:'ALEX',                   sub:'One of the first full-service DeFi platforms on Bitcoin, built on Stacks.', c:'blue', art:'swap', foot:'STACKS PLATFORMS'},
  {head:'STACKINGDAO',            sub:'Liquid stacking: stSTX earns stacking rewards and stays usable.', c:'stacks', art:'drop', foot:'STACKS PLATFORMS'},
  {head:'ZEST',                   sub:'A Bitcoin lending protocol, built on Stacks.', c:'gold', art:'percent', foot:'STACKS PLATFORMS'},
  {head:'GAMMA',                  sub:'A home for Stacks NFTs since the early days, now trading Ordinals too.', c:'fun', art:'storefront', foot:'STACKS PLATFORMS'},
  {head:'TRUST MACHINES',         sub:'2022: Muneeb Ali’s Bitcoin app company raises $150M.', c:'white', art:'gears', foot:'STACKS HISTORY'},
  {head:'LEATHER',                sub:'August 2023: the Hiro Wallet becomes Leather, a Bitcoin wallet from Trust Machines.', c:'orange', art:'wallet', foot:'STACKS PLATFORMS'},
  {head:'XVERSE',                 sub:'A Bitcoin wallet that handles Stacks, Ordinals and sBTC in one place.', c:'blue', art:'phone', foot:'STACKS PLATFORMS'},
  {head:'NAKAMOTO DAY',           sub:'29 Oct 2024: fast blocks and Bitcoin finality arrive on Stacks.', c:'stacks', art:'calendar', foot:'STACKS HISTORY'},
  {head:'sBTC GOES LIVE',         sub:'17 Dec 2024: deposits open, with a 1,000 BTC cap to start.', c:'orange', art:'gate', foot:'STACKS HISTORY'},
  {head:'THE ACCELERATOR',        sub:'April 2021: the Stacks Accelerator launches. 25 teams graduate in the first cohort.', c:'audio', art:'rocket', foot:'STACKS HISTORY'},
  {head:'ZERO AUTHORITY DAO',     sub:'Stacks builders backing builders, including Xtrata’s bounty.', c:'blue', art:'circle', foot:'STACKS GROUPS'},
];

function posterArtStacks(x,spec,W,col,cx,cy){
  const TAU=Math.PI*2, glow=(c,b)=>{ x.shadowColor=c; x.shadowBlur=b }, T=(t,px,y,c,fam,xx)=>{ x.fillStyle=c||'#ffffff'; x.textAlign='center'; fitFont(x,t,px,fam||'Bungee, Impact, sans-serif',W-70); x.fillText(t,xx==null?cx:xx,y) };
  const person=(px,py,c,s=1)=>{ x.fillStyle=c; x.beginPath(); x.arc(px,py-40*s,24*s,0,TAU); x.fill(); x.beginPath(); x.moveTo(px-44*s,py+50*s); x.quadraticCurveTo(px-44*s,py-10*s,px,py-10*s); x.quadraticCurveTo(px+44*s,py-10*s,px+44*s,py+50*s); x.closePath(); x.fill() };
  switch(spec.art){
    case 'founders': person(cx-60,cy+30,'#cfd3e2'); person(cx+60,cy+30,col); T('YC · 2014',22,272,'#ffffff','VT323, monospace'); break;
    case 'gradcap':
      glow(col,16); x.fillStyle=col; x.beginPath(); x.moveTo(cx,86); x.lineTo(cx+120,130); x.lineTo(cx,174); x.lineTo(cx-120,130); x.closePath(); x.fill(); x.shadowBlur=0;
      x.fillStyle='#cfd3e2'; x.beginPath(); x.moveTo(cx-70,152); x.lineTo(cx-70,206); x.quadraticCurveTo(cx,240,cx+70,206); x.lineTo(cx+70,152); x.lineTo(cx,178); x.closePath(); x.fill();
      x.strokeStyle='#ffd23f'; x.lineWidth=4; x.beginPath(); x.moveTo(cx+100,138); x.lineTo(cx+100,210); x.stroke(); T('PhD · 2017',22,272,'#ffffff','VT323, monospace'); break;
    case 'migrate':
      coin(x,cx-96,cy-10,44,'#3b6fb6','NMC'); drawBitcoin(x,cx+96,cy-10,44,16); arrow(x,cx-40,cx+40,cy-10,'#ffffff');
      T('.id → .btc',26,cy+84,'#ffffff','VT323, monospace'); break;
    case 'stamp':
      x.fillStyle='#e9e4d8'; x.fillRect(cx-100,76,200,190); x.fillStyle='#9a968c'; for(let i=0;i<8;i++) x.fillRect(cx-80,100+i*16,i%3?160:110,5);
      x.save(); x.translate(cx+30,200); x.rotate(-.25); x.strokeStyle='#d9304a'; x.lineWidth=5; x.strokeRect(-80,-26,160,52); x.fillStyle='#d9304a'; x.font='22px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText('QUALIFIED',0,8); x.restore(); break;
    case 'pages':
      for(let i=2;i>=0;i--){ x.fillStyle=i?'#b9b4a8':'#f4f1ea'; x.fillRect(cx-90+i*12,80-i*8,180,190) }
      x.fillStyle='#2a2a2a'; x.textAlign='center'; x.font='18px Georgia, serif'; x.fillText('PoX: Proof of',cx,112); x.fillText('Transfer Mining',cx,134); x.fillText('with Bitcoin',cx,156);
      x.fillStyle='#9a968c'; for(let i=0;i<5;i++) x.fillRect(cx-70,176+i*14,140,4); break;
    case 'brackets':
      glow(col,14); x.fillStyle=STACKS_PURPLE; x.font='150px VT323, monospace'; x.textAlign='center'; x.fillText('(',cx-80,cy+46); x.fillStyle='#ffffff'; x.fillText(')',cx+80,cy+46); x.shadowBlur=0;
      T('CLARITY',30,cy+14,'#ffffff'); break;
    case 'rename':
      x.fillStyle='#2a2b38'; x.fillRect(cx-130,96,260,56); T('BLOCKSTACK',30,134,'#6b6f88'); x.strokeStyle='#ff4d6d'; x.lineWidth=5; x.beginPath(); x.moveTo(cx-120,124); x.lineTo(cx+120,124); x.stroke();
      glow(col,18); x.fillStyle=col; x.fillRect(cx-130,188,260,64); x.shadowBlur=0; T('STACKS',40,234,'#0b0b10'); break;
    case 'launch':
      x.strokeStyle='rgba(238,242,255,.2)'; x.lineWidth=2; for(let i=0;i<6;i++){ x.beginPath(); x.moveTo(40,90+i*34); x.lineTo(W-40,90+i*34); x.stroke() }
      glow(col,20); T('2.0',110,cy+36,col); x.shadowBlur=0; break;
    case 'toolbox':
      x.fillStyle=col; x.fillRect(cx-120,140,240,120); x.fillStyle='#0b0b10'; x.fillRect(cx-120,176,240,6); x.strokeStyle=col; x.lineWidth=10; x.strokeRect(cx-40,112,80,32);
      x.strokeStyle='#cfd3e2'; x.lineWidth=12; x.lineCap='round'; x.beginPath(); x.moveTo(cx-80,96); x.lineTo(cx-20,150); x.stroke(); T('</>',30,236,'#ffffff','VT323, monospace'); break;
    case 'coinpile':
      for(let r=0;r<4;r++) for(let q=0;q<=r;q++) drawBitcoin(x,cx-r*34+q*68,110+r*48,28,8);
      break;
    case 'bird':
      glow(col,12); x.fillStyle=col; x.beginPath(); x.ellipse(cx,cy+10,80,56,-.2,0,TAU); x.fill(); x.beginPath(); x.arc(cx+70,cy-40,36,0,TAU); x.fill(); x.shadowBlur=0;
      x.fillStyle='#ffd23f'; x.beginPath(); x.moveTo(cx+102,cy-44); x.lineTo(cx+140,cy-34); x.lineTo(cx+102,cy-26); x.closePath(); x.fill();
      x.fillStyle='#0b0b10'; x.beginPath(); x.arc(cx+80,cy-48,6,0,TAU); x.fill(); x.fillStyle='#1d7a44'; x.beginPath(); x.ellipse(cx-20,cy,50,26,-.5,0,TAU); x.fill(); break;
    case 'punk': {
      const px=16, art=['..######..','.########.','.##....##.','##.#..#.##','##......##','.#..##..#.','.#......#.','..#.##.#..','...####...'];
      art.forEach((row,r)=>[...row].forEach((ch,q)=>{ if(ch==='#'){ x.fillStyle=r<2?col:'#e7c08a'; x.fillRect(cx-80+q*px,88+r*px,px-1,px-1) } }));
      x.fillStyle='#0b0b10'; x.fillRect(cx-48,88+3*px,px*2,px); x.fillRect(cx+16,88+3*px,px*2,px); break; }
    case 'robot':
      x.fillStyle='#8a8fa8'; x.fillRect(cx-60,92,120,100); x.fillStyle='#2a2b38'; x.fillRect(cx-44,116,88,40);
      glow(col,14); x.fillStyle=col; x.fillRect(cx-32,128,20,16); x.fillRect(cx+12,128,20,16); x.shadowBlur=0;
      x.fillStyle='#cfd3e2'; x.fillRect(cx-4,70,8,22); x.beginPath(); x.arc(cx,66,8,0,TAU); x.fill(); x.fillStyle='#6b6f88'; x.fillRect(cx-80,200,160,60); x.fillStyle=col; x.fillRect(cx-20,214,40,12); break;
    case 'boombox':
      x.fillStyle='#2a2b38'; x.fillRect(cx-140,120,280,130); x.strokeStyle='#cfd3e2'; x.lineWidth=8; x.beginPath(); x.moveTo(cx-90,120); x.lineTo(cx-70,86); x.lineTo(cx+70,86); x.lineTo(cx+90,120); x.stroke();
      for(const o of [-80,80]){ x.fillStyle='#0b0b10'; x.beginPath(); x.arc(cx+o,190,44,0,TAU); x.fill(); glow(col,12); x.strokeStyle=col; x.lineWidth=5; x.beginPath(); x.arc(cx+o,190,30,0,TAU); x.stroke(); x.shadowBlur=0 }
      x.fillStyle=BTC_ORANGE; x.fillRect(cx-26,140,52,20); break;
    case 'skyline': {
      const b=[[50,120],[90,80],[130,150],[170,100],[210,170],[250,110],[290,140],[330,90]];
      b.forEach(([bx,h],i)=>{ x.fillStyle=i%2?'#2a2b38':'#3a3b4c'; x.fillRect(bx-18,270-h,36,h); x.fillStyle=col; for(let w=0;w<h/20-1;w++) if((w+i)%3) x.fillRect(bx-8,280-h+w*20,6,8) });
      glow(col,20); x.fillStyle=col; x.beginPath(); x.arc(cx,96,26,0,TAU); x.fill(); x.shadowBlur=0; break; }
    case 'vault':
      x.fillStyle='#2a2b38'; x.fillRect(cx-110,80,220,190); x.strokeStyle='#8a8fa8'; x.lineWidth=6; x.strokeRect(cx-110,80,220,190);
      glow(col,14); x.strokeStyle=col; x.lineWidth=8; x.beginPath(); x.arc(cx,175,58,0,TAU); x.stroke(); x.shadowBlur=0;
      for(let k=0;k<6;k++){ const a=k*Math.PI/3; x.beginPath(); x.moveTo(cx,175); x.lineTo(cx+Math.cos(a)*50,175+Math.sin(a)*50); x.stroke() } T('USDA',20,262,'#ffffff','VT323, monospace'); break;
    case 'swap':
      coin(x,cx-80,cy-40,40,BTC_ORANGE,'BTC'); coin(x,cx+80,cy+40,40,STACKS_PURPLE,'STX');
      x.strokeStyle=col; x.lineWidth=6; x.beginPath(); x.arc(cx,cy,90,-Math.PI*.9,-Math.PI*.2); x.stroke(); x.beginPath(); x.arc(cx,cy,90,Math.PI*.1,Math.PI*.8); x.stroke(); break;
    case 'drop':
      glow(col,20); x.fillStyle=col; x.beginPath(); x.moveTo(cx,76); x.quadraticCurveTo(cx+100,190,cx,262); x.quadraticCurveTo(cx-100,190,cx,76); x.fill(); x.shadowBlur=0;
      T('stSTX',30,212,'#0b0b10'); break;
    case 'percent':
      glow(col,20); T('%',160,cy+60,col); x.shadowBlur=0; drawBitcoin(x,cx+100,96,26,10); break;
    case 'storefront':
      x.fillStyle='#2a2b38'; x.fillRect(cx-130,120,260,150);
      for(let i=0;i<6;i++){ x.fillStyle=i%2?col:'#ffffff'; x.beginPath(); x.moveTo(cx-130+i*43.3,96); x.lineTo(cx-130+(i+1)*43.3,96); x.lineTo(cx-130+(i+1)*43.3,126); x.quadraticCurveTo(cx-130+(i+.5)*43.3,146,cx-130+i*43.3,126); x.closePath(); x.fill() }
      for(let i=0;i<3;i++){ x.strokeStyle='#cfd3e2'; x.lineWidth=3; x.strokeRect(cx-110+i*76,168,60,72); x.fillStyle=['#39ff88','#ff8a2a','#3d86ff'][i]; x.globalAlpha=.6; x.fillRect(cx-104+i*76,174,48,60); x.globalAlpha=1 }
      break;
    case 'gears':
      for(const [gx,gy,r,c2] of [[cx-40,cy+10,64,'#cfd3e2'],[cx+68,cy-58,40,BTC_ORANGE]]){ x.fillStyle=c2; for(let k=0;k<10;k++){ x.save(); x.translate(gx,gy); x.rotate(k*TAU/10); x.fillRect(-9,-r-14,18,20); x.restore() } x.beginPath(); x.arc(gx,gy,r,0,TAU); x.fill(); x.fillStyle='#0b0b10'; x.beginPath(); x.arc(gx,gy,r*.35,0,TAU); x.fill() }
      break;
    case 'wallet':
      x.fillStyle='#7a4a24'; x.fillRect(cx-120,110,240,150); x.fillStyle='#8f5a2e'; x.fillRect(cx-120,110,240,40);
      x.fillStyle='#5e3718'; x.fillRect(cx+40,160,80,56); drawBitcoin(x,cx+80,188,20,8);
      x.strokeStyle='#d9b38a'; x.setLineDash([6,6]); x.lineWidth=2; x.strokeRect(cx-110,120,220,130); x.setLineDash([]); break;
    case 'phone':
      x.fillStyle='#2a2b38'; x.fillRect(cx-70,70,140,210); x.fillStyle='#0b0b10'; x.fillRect(cx-60,86,120,176);
      drawBitcoin(x,cx,130,22,10); [['STX',STACKS_PURPLE],['sBTC',BTC_ORANGE],['ORD','#ffffff']].forEach(([t,c2],i)=>{ x.fillStyle=c2; x.fillRect(cx-50,168+i*30,100,22); x.fillStyle='#0b0b10'; x.font='16px VT323, monospace'; x.textAlign='center'; x.fillText(t,cx,184+i*30) }); break;
    case 'calendar':
      x.fillStyle='#e9e4d8'; x.fillRect(cx-100,90,200,176); glow(col,12); x.fillStyle=col; x.fillRect(cx-100,90,200,46); x.shadowBlur=0;
      T('OCT 2024',24,122,'#0b0b10'); T('29',90,236,'#0b0b10','VT323, monospace'); break;
    case 'gate':
      x.strokeStyle='#cfd3e2'; x.lineWidth=8; x.strokeRect(cx-120,90,240,176);
      x.save(); x.translate(cx-120,90); x.rotate(-.35); x.fillStyle='#8a8fa8'; x.fillRect(0,0,120,176); x.restore();
      coin(x,cx+40,190,40,'#ffffff','sBTC',BTC_ORANGE); T('CAP 1,000 BTC',20,286,'#ffffff','VT323, monospace'); break;
    case 'rocket':
      glow(col,14); x.fillStyle='#e9ecf5'; x.beginPath(); x.moveTo(cx,70); x.quadraticCurveTo(cx+50,130,cx+36,220); x.lineTo(cx-36,220); x.quadraticCurveTo(cx-50,130,cx,70); x.fill(); x.shadowBlur=0;
      x.fillStyle=col; x.beginPath(); x.arc(cx,136,18,0,TAU); x.fill(); x.fillStyle=BTC_ORANGE; x.beginPath(); x.moveTo(cx-24,220); x.lineTo(cx,272); x.lineTo(cx+24,220); x.closePath(); x.fill();
      x.fillStyle='#8a8fa8'; x.fillRect(cx-62,190,26,30); x.fillRect(cx+36,190,26,30); break;
    case 'circle':
      for(let i=0;i<8;i++){ const a=i/8*TAU; person(cx+Math.cos(a)*110, cy+10+Math.sin(a)*88, i%2?col:'#cfd3e2', .45) }
      drawLogo(x,cx,cy+4,60,3,8); break;
    default: posterArtExtra(x,spec,W,col,cx,cy);
  }
}

/* ---------- extras: This Is #1, Chemical X, and a teaser ---------- */
const POSTERS_EXTRA=[
  {head:'THIS IS #1',             sub:'Bitcoin NFTs on Stacks since 2021: Fatboy Slim, Cara Delevingne, Dave Stewart, Orbital and more.', c:'gold', art:'no1', foot:'STACKS HISTORY'},
  {head:'CHEMICAL X',             sub:'The anonymous artist behind the original Ministry of Sound logo, and co-founder of This Is #1.', c:'fun', art:'chemx', foot:'STACKS PEOPLE'},
  {head:'WHO ARE THE COLLIDERS?', sub:'', c:'white', art:'collide', foot:' '},
  {head:'THIS IS #1',             sub:'Bitcoin culture, collected on Stacks.', c:'gold', art:'no1logo', foot:'STACKS NFTS'},
  {head:'AUDIONALS',              sub:'A protocol and set of studios for composing music directly onto Bitcoin.', c:'audio', art:'audionals', foot:'AUDIONALS'},
  {head:'THE SONG IS THE LEDGER', sub:'Every edit, layer and collaboration recorded on-chain: permanent, visible, provable.', c:'audio', art:'ledger', foot:'AUDIONALS PHILOSOPHY'},
  {head:'A DECLARATION OF INDEPENDENCE FOR MUSIC', sub:'Creators own their work. No gatekeepers, no opaque deductions.', c:'audio', art:'declaration', foot:'AUDIONALS PHILOSOPHY'},
  {head:'AUDIONALS \u2014 THE OPERA', sub:'Silence. Sound. Memory. Truth. A rock opera about a broken music industry.', c:'fun', art:'opera', foot:'NOW ON XTRATA RADIO'},
  {head:'JIM.BTC',                sub:'Founder of Xtrata and Audionals. Building scalable permanent culture on Bitcoin.', c:'orange', art:'jim', foot:'MEET THE BUILDER'},
];
/* Drop the official This Is #1 logo in here as a data: URI (PNG/SVG, transparent background) and the logo poster uses it. */
const THISIS1_LOGO='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAB+CAYAAABhy172AAABWGlDQ1BJQ0MgUHJvZmlsZQAAeJx9kLFLw1AQxr9WpaB1EB0cHDKJQ5SSCro4tBVEcQhVweqUvqapkMZHkiIFN/+Bgv+BCs5uFoc6OjgIopPo5uSk4KLleS+JpCJ6j+N+fO+74zggOW5wbvcDqDu+W1zKK5ulLSX1jAS9IAzm8Zyur0r+rj/j/T703k7LWb///43Biukxqp+UGcZdH0ioxPqezyXvE4+5tBRxS7IV8onkcsjngWe9WCC+JlZYzagQvxCr5R7d6uG63WDRDnL7tOlsrMk5lBNYxA48cNgw0IQCHdk//LOBv4BdcjfhUp+FGnzqyZEiJ5jEy3DAMAOVWEOGUpN3ju53F91PjbWDJ2ChI4S4iLWVDnA2Rydrx9rUPDAyBFy1ueEagdRHmaxWgddTYLgEjN5Qz7ZXzWrh9uk8MPAoxNskkDoEui0hPo6E6B5T8wNw6XwBA6diE8HYWhMAAALoSURBVHja7dzfa09xHMfxfTWi+S0bm58zkZ/LlSuZ8iPa3ChKCsUFcuNKuVHKPS5EyZX8mJst1gzJnQvajaEvE5EpZCmWb9v8DS5e5+Lb4/EPvHufc56nc24+pZoCtO5ZNp6e0d/5rpSecebk8vge5y6U43scX9kQ32N0uC7+XF3+Mhi/VqUiAjl4c1v8hlzf9yC+y8jbnfE9Jrfcj+8xsHtdfI/Kp/r4c7X++cP4tZpQAwgEBAICAYGAQEAgIBAQCAgEEAgIBAQCAgGBgEBAICAQEAgIBBAICAQEAgUpLWvfFz8jqWHlSHyRoZev4jP275gWn/G9/DN/0/t+xWdsXDwnPuNA70D8XKza5o698UXGKi/iM5qXjOUfrKW/4zOO7Zgbn7HmYk/8wTrV0RR/8db0+sQC/yAgEBAICAQEAggEBAICAYGAQEAgIBAQCAgEBAIIBAQCAgGBgEBAICAQqCK1g1234kNmrVgfn/Fj4E18xujaBfEZ33rKVfFgvWwqVcUehWyx/Vp//BCx3sOt8V22XDoS3+PxiatV8WT9GWqPX6sp87rj18onFggEBAICAYGAQEAgIBAQCAgEEAgIBAQCAgGBgEBAICAQEAgIBBAICAQEAoWpbazfHD+/6GNXV3yRRW2H4nsMv58d36N519b4HoP3+uLnSZ2987VqAokP+VtqjM9Y2Jbfo66xEp8xsyUf4eC9vviMyqIZPrHAPwgIBBAICAQEAgIBgYBAQCAgEBAIIBAQCAgEBAICAYGAQEAgIBAQCCAQ+B+lIg6Om1W/Or7Ir7m/4zOmzm+JzxgZflLAa3F6fMSCVfn78fX123wgRVS4qfV8PMKn/afju2w42hnf48WVPfE9tl65Ed9jrPIs/8KaUvaJBf5BQCAgEBAICAQQCAgEBAICAYGAQEAgIBAQCAgEEAgIBAQCAgGBgEBAIFA9aosY8mHoUVVcrC/Pb1fFHu+678ZnjI9+js+YNPF7fMY/oZqC3ykpr8MAAAAASUVORK5CYII=';
let thisIs1Img=null;
if(THISIS1_LOGO){ const im=new Image(); im.onload=()=>{ thisIs1Img=im; for(const s of posterSlots) if(s.spec && s.spec.art==='no1logo') paintPoster(s,s.spec) }; im.src=THISIS1_LOGO }
function posterArtExtra(x,spec,W,col,cx,cy){
  const TAU=Math.PI*2, glow=(c,b)=>{ x.shadowColor=c; x.shadowBlur=b };
  switch(spec.art){
    case 'no1':
      glow(col,26); x.fillStyle=col; x.beginPath(); x.arc(cx,cy,100,0,TAU); x.fill(); x.shadowBlur=0;
      x.fillStyle='#0b0b10'; x.beginPath(); x.ellipse(cx-34,cy-26,11,18,0,0,TAU); x.fill(); x.beginPath(); x.ellipse(cx+34,cy-26,11,18,0,0,TAU); x.fill();
      x.strokeStyle='#0b0b10'; x.lineWidth=10; x.lineCap='round'; x.beginPath(); x.arc(cx,cy+6,58,Math.PI*.15,Math.PI*.85); x.stroke();
      x.fillStyle='#ffffff'; x.font='40px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText('#1',cx+96,cy-76); break;
    case 'chemx': {
      const cols=['#ff3fa4','#3ff0ff','#ffd23f','#39ff88','#b98cff'];
      for(let i=0;i<9;i++){ for(const s of [-1,1]){ if(i===4 && s>0) continue; const t=(i-4)/4, px=cx+t*110, py=cy+s*t*110;
        x.save(); x.translate(px,py); x.rotate(s*Math.PI/4); glow(cols[(i+(s>0?2:0))%5],12); x.fillStyle=cols[(i+(s>0?2:0))%5];
        x.beginPath(); x.ellipse(0,0,22,14,0,0,TAU); x.fill(); x.shadowBlur=0; x.fillStyle='rgba(255,255,255,.35)'; x.fillRect(-1,-14,2,28); x.restore() } }
      break; }
    case 'no1logo':
      if(thisIs1Img){ const bw=268, bh=190, k=Math.min(bw/thisIs1Img.width, bh/thisIs1Img.height), w=thisIs1Img.width*k, h=thisIs1Img.height*k; x.imageSmoothingEnabled=false; x.drawImage(thisIs1Img,cx-w/2,cy-h/2,w,h); x.imageSmoothingEnabled=true }
      else { glow(col,24); x.strokeStyle=col; x.lineWidth=10; x.strokeRect(cx-120,70,240,196); x.shadowBlur=0;
        x.fillStyle='#ffffff'; x.textAlign='center'; x.font='30px Bungee, Impact, sans-serif'; x.fillText('THIS IS',cx,118);
        glow(col,20); x.fillStyle=col; x.font='120px Bungee, Impact, sans-serif'; x.fillText('#1',cx,240); x.shadowBlur=0 }
      break;
    case 'audionals': {
      x.fillStyle='#0f1a14'; x.beginPath(); x.arc(cx,cy,104,0,TAU); x.fill();
      for(let i=0;i<32;i++){ const a=i/32*TAU, on=[0,3,4,8,11,12,16,19,22,24,27,28].includes(i);
        glow(col,on?10:0); x.fillStyle=on?col:'#233a2c'; x.save(); x.translate(cx+Math.cos(a)*86,cy+Math.sin(a)*86); x.rotate(a); x.fillRect(-7,-5,14,10); x.restore() }
      x.shadowBlur=0; x.strokeStyle=col; x.lineWidth=3; x.beginPath();
      for(let i=0;i<=60;i++){ const px=cx-56+i*1.87, py=cy+Math.sin(i*.6)*Math.sin(i*.11)*30; i?x.lineTo(px,py):x.moveTo(px,py) } x.stroke();
      drawBitcoin(x,cx,cy+56,14,6); break; }
    case 'ledger': {
      x.strokeStyle='rgba(238,242,255,.45)'; x.lineWidth=2; for(let i=0;i<5;i++){ x.beginPath(); x.moveTo(40,120+i*18); x.lineTo(W-40,120+i*18); x.stroke() }
      const notes=[[80,174],[140,147],[200,156],[260,129],[320,138]];
      x.strokeStyle=col; x.lineWidth=3; for(let i=0;i<notes.length-1;i++){ x.beginPath(); x.moveTo(notes[i][0],notes[i][1]); x.lineTo(notes[i+1][0],notes[i+1][1]); x.stroke() }
      notes.forEach(([nx,ny],i)=>{ glow(col,12); x.fillStyle=i===4?BTC_ORANGE:col; x.fillRect(nx-14,ny-11,28,22); x.shadowBlur=0; x.fillStyle='#0b0b10'; x.font='13px VT323, monospace'; x.textAlign='center'; x.fillText('#'+(i+1),nx,ny+5) });
      x.fillStyle='#ffffff'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText('\u266a  ON-CHAIN  \u266a',cx,250); break; }
    case 'declaration':
      x.fillStyle='#e9e1c9'; x.fillRect(cx-110,86,220,170); x.fillStyle='#cdbf98'; x.beginPath(); x.arc(cx-110,171,14,0,TAU); x.arc(cx+110,171,14,0,TAU); x.fill();
      x.fillRect(cx-124,86,14,170); x.fillRect(cx+110,86,14,170);
      x.fillStyle='#5a4a2a'; x.font='22px Georgia, serif'; x.textAlign='center'; x.fillText('We the Artists',cx,122);
      x.fillStyle='#8a7a58'; for(let i=0;i<5;i++) x.fillRect(cx-86,140+i*16,i===4?90:172,4);
      glow(col,14); x.fillStyle=col; x.font='44px sans-serif'; x.fillText('\u266b',cx+64,244); x.shadowBlur=0; break;
    case 'opera':
      x.fillStyle='#5a0f22'; x.fillRect(40,70,60,200); x.fillRect(W-100,70,60,200); x.fillRect(40,70,W-80,26);
      x.fillStyle='#7a1a30'; for(let i=0;i<4;i++){ x.fillRect(46+i*14,96,6,174); x.fillRect(W-94+i*14,96,6,174) }
      { const g=x.createRadialGradient(cx,250,10,cx,250,130); g.addColorStop(0,'rgba(255,240,200,.55)'); g.addColorStop(1,'rgba(255,240,200,0)'); x.fillStyle=g; x.fillRect(100,96,W-200,174) }
      ['#3ff0ff','#ff3fa4','#ffd23f','#39ff88'].forEach((c2,i)=>{ const px=cx-66+i*44; x.fillStyle=c2; x.beginPath(); x.arc(px,196,11,0,TAU); x.fill(); x.fillRect(px-9,208,18,44) });
      x.fillStyle='#2a1a10'; x.fillRect(100,256,W-200,14); break;
    case 'jim':
      glow(BTC_ORANGE,22); x.fillStyle=BTC_ORANGE; x.beginPath(); x.roundRect ? x.roundRect(cx-140,140,280,80,40) : x.rect(cx-140,140,280,80); x.fill(); x.shadowBlur=0;
      x.fillStyle='#0b0b10'; x.textAlign='center'; x.font='46px VT323, monospace'; x.fillText('jim.btc',cx,194);
      drawLogo(x,cx-70,96,60,3,10); x.fillStyle=col; x.fillStyle=AUDIO_GREEN; for(let i=0;i<9;i++){ const h=8+Math.abs(Math.sin(i*1.3))*34; x.fillRect(cx+30+i*9,96-h/2,6,h) }
      drawBitcoin(x,cx,254,18,8); break;
    case 'collide': {
      const R=rng(1109); x.fillStyle='#ffffff'; for(let i=0;i<60;i++){ x.globalAlpha=.2+R()*.6; x.fillRect(40+R()*304,70+R()*210,2,2) } x.globalAlpha=1;
      for(const [sx,sy,c2] of [[-1,-1,'#3d86ff'],[1,1,'#ff8a2a']]){ const g=x.createLinearGradient(cx+sx*150,cy+sy*90,cx,cy); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,c2);
        x.strokeStyle=g; x.lineWidth=10; x.lineCap='round'; x.beginPath(); x.moveTo(cx+sx*150,cy+sy*90); x.lineTo(cx-sx*8,cy-sy*5); x.stroke() }
      const g2=x.createRadialGradient(cx,cy,0,cx,cy,70); g2.addColorStop(0,'rgba(255,255,255,1)'); g2.addColorStop(.25,'rgba(255,220,160,.8)'); g2.addColorStop(1,'rgba(255,138,42,0)');
      x.fillStyle=g2; x.beginPath(); x.arc(cx,cy,70,0,TAU); x.fill();
      x.strokeStyle='rgba(255,255,255,.7)'; x.lineWidth=2; for(let k=0;k<14;k++){ const a=k/14*TAU+.2, r1=26, r2=60+R()*50; x.beginPath(); x.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); x.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2); x.stroke() }
      break; }
    default: posterArtChain(x,spec,W,col,cx,cy);
  }
}

/* ---------------------------------------------------------------
   PLAYABLE ON-CHAIN POSTERS + "IMAGINE WHAT ELSE" POSTERS
   `play` posters open the real inscription in a panel (walk up, press E or click).
   Numbers are Xtrata inscription IDs. XTRATA_BASE is only used to open them; it is never drawn on a poster.
   --------------------------------------------------------------- */
const XTRATA_BASE='https://xtrata.xyz';
const POSTERS_PLAY=[
  {head:'X CHESS', sub:'Chess that lives on Bitcoin. Play the original straight from the chain.', c:'white', art:'oc_chess', foot:'INSCRIPTION #3072',
   play:{id:3072, title:'X Chess', note:'An HTML game inscribed on Stacks and served from the chain.'}},
  {head:'ASTRO BLASTER 3', sub:'Six sectors, one pilot. Beat the Top 10 and post your score on-chain.', c:'blue', art:'oc_blaster', foot:'INSCRIPTION #3075',
   play:{id:3075, title:'Astro Blaster 3', note:'Every top score lives on Bitcoin. To post yours you need your wallet: use OPEN ON XTRATA.'}},
  {head:'NEW ON XTRATA', sub:'Astro Blaster 3. The newest game inscription. Every top score is permanent.', c:'orange', art:'oc_blaster2', foot:'PLAY IT HERE',
   play:{id:3075, title:'Astro Blaster 3', note:'Every top score lives on Bitcoin. To post yours you need your wallet: use OPEN ON XTRATA.'}},
  {head:'SILENCE. SOUND. MEMORY.', sub:'Audionals: The Opera. Seven tracks, played straight from the chain.', c:'audio', art:'oc_album', foot:'AUDIONALS',
   play:{title:'Silence. Sound. Memory.', note:'Audionals: The Opera. Every track is its own inscription.', tracks:[
     [2883,'Let The Score Remember All'],[2885,'NEVER ENEMIES'],[2889,'Where Every Note Remains'],[2892,'A Thousand Small Percentages'],
     [2895,'It Was Only Midnight'],[2896,'When the Server Falls'],[2910,'MORE LIKE THIS']]}},
  {head:'THE OPERA IS ON-CHAIN', sub:'Press play. No label, no platform: just the inscriptions.', c:'audio', art:'oc_album', foot:'SILENCE. SOUND. MEMORY.',
   play:{title:'Silence. Sound. Memory.', note:'Audionals: The Opera. Every track is its own inscription.', tracks:[
     [2883,'Let The Score Remember All'],[2885,'NEVER ENEMIES'],[2889,'Where Every Note Remains'],[2892,'A Thousand Small Percentages'],
     [2895,'It Was Only Midnight'],[2896,'When the Server Falls'],[2910,'MORE LIKE THIS']]}},
  {head:'TIMELOOP DETECTIVE', sub:'Meridian. A detective game that runs from an inscription.', c:'fun', art:'oc_loop', foot:'INSCRIPTION #3047',
   play:{id:3047, title:'Timeloop Detective · Meridian', note:'An HTML game served from the chain.'}},
  {head:'XTRATA RADIO', sub:'Free to listen. The holders get paid.', c:'audio', art:'oc_radio', foot:'PRESS PLAY',
   play:{path:'/radio', title:'Xtrata Radio', note:'On-chain songs, played from the chain.'}}
];

const POSTERS_IDEAS=[
  {head:'A TREE OF RIGHTS', sub:'Every stem, sample and split hangs from one root. Prove who owns what with a single hash.', c:'audio', art:'oc_merkle', foot:'IMAGINE · MERKLE RIGHTS'},
  {head:'PAID IN THE SAME BLOCK', sub:'A play, a sale, a remix: royalties split by code and settled instantly. No statements, no wait.', c:'orange', art:'oc_split', foot:'IMAGINE · INSTANT ROYALTIES'},
  {head:'FAIR BY DEFAULT', sub:'Splits written in the open, the same rules for every artist, checkable by anyone.', c:'white', art:'oc_scales', foot:'IMAGINE · FAIRNESS'},
  {head:'SAMPLES THAT CREDIT THEMSELVES', sub:'Use a loop, and its maker is paid automatically. Every sample knows where it came from.', c:'audio', art:'oc_lib', foot:'IMAGINE · LIVING LIBRARIES'},
  {head:'PROVENANCE, FOREVER', sub:'Who made it, when, and every hand it passed through. Art, photos, records: one unbroken trail.', c:'stacks', art:'oc_prov', foot:'IMAGINE · REGISTRIES'},
  {head:'LIBRARIES THAT CANNOT VANISH', sub:'Inscribe code once and any app can import it by ID. No package yanked, no link rot.', c:'blue', art:'oc_deps', foot:'IMAGINE · RECURSIVE CODE'},
  {head:'DOCUMENTS WITH A MEMORY', sub:'Wikis, specs, manifestos. Every edit is a new inscription and history cannot be rewritten.', c:'white', art:'oc_doc', foot:'IMAGINE · LIVING DOCUMENTS'},
  {head:'NOBODY PATCHES A HIGH SCORE', sub:'Rules, code and scores all on Bitcoin. A leaderboard you can trust because you can check it.', c:'gold', art:'oc_score', foot:'IMAGINE · HONEST GAMES'},
  {head:'LICENCES THAT TRAVEL', sub:'Fonts, footage, photographs. The terms are inscribed beside the file, for good.', c:'orange', art:'oc_licence', foot:'IMAGINE · CLEAR RIGHTS'},
  {head:'LETTERS TO THE FUTURE', sub:'Time capsules that cannot be lost, edited or quietly taken down. Written now, opened whenever.', c:'fun', art:'oc_capsule', foot:'IMAGINE · TIME CAPSULES'},
  {head:'DATA THAT CANNOT 404', sub:'Datasets, papers and their citations, linked by ID and kept as long as Bitcoin is.', c:'blue', art:'oc_data', foot:'IMAGINE · OPEN SCIENCE'},
  {head:'AGENTS THAT READ THE CHAIN', sub:'Software that finds, verifies and pays for work on its own, using rules anyone can read.', c:'stacks', art:'oc_agent', foot:'IMAGINE · MACHINE-READABLE'},
  {head:'YOUR TWIN, PRESERVED', sub:'Keep a copy of what matters as a permanent on-chain twin: the file, its story, its owner.', c:'fun', art:'oc_twin', foot:'FOREVER TWINS'},
  {head:'INSCRIBE ANYTHING', sub:'Songs, art, apps, games and ideas. If it is a file, it can live on-chain and link to other files.', c:'orange', art:'oc_inscribe', foot:'XTRATA'},
  {head:'THE XTRATA MARKET', sub:'Buy, sell and trade on-chain objects with STX, sBTC or USDCx.', c:'blue', art:'oc_market', foot:'XTRATA MARKET'},
  {head:'BROWSE EVERYTHING', sub:'Xplorer: every object ever inscribed, its parents, its children and its owners.', c:'white', art:'oc_xplorer', foot:'XPLORER'},
  {head:'FREE TO CLAIM', sub:'Sponsored drops: claim on-chain music and art with zero fees.', c:'gold', art:'oc_claim', foot:'XTRATA DROPS'}
];

function posterArtChain(x,spec,W,col,cx,cy){
  const TAU=Math.PI*2, glow=(c,b)=>{ x.shadowColor=c; x.shadowBlur=b };
  const R=rng(spec.art.length*977+spec.head.length);
  const box=(px,py,w,h,c,line)=>{ x.fillStyle=c; x.fillRect(px,py,w,h); if(line){ x.strokeStyle=line; x.lineWidth=2; x.strokeRect(px,py,w,h) } };
  const dot=(px,py,r,c)=>{ x.fillStyle=c; x.beginPath(); x.arc(px,py,r,0,TAU); x.fill() };
  const ln=(x0,y0,x1,y1,c,w)=>{ x.strokeStyle=c; x.lineWidth=w||3; x.beginPath(); x.moveTo(x0,y0); x.lineTo(x1,y1); x.stroke() };
  switch(spec.art){
    case 'oc_chess': {
      const s=40, ox=cx-4*s/2*1.0-s*0, oy=86;
      for(let r=0;r<4;r++) for(let c=0;c<5;c++){ x.fillStyle=(r+c)%2?'#2a2a36':'#dcdce8'; x.fillRect(cx-100+c*40,oy+r*40,40,40) }
      glow(col,20); x.fillStyle='#ffffff'; x.strokeStyle='#0b0b10'; x.lineWidth=3;
      x.beginPath(); x.rect(cx-30,222,60,14); x.fill(); x.stroke();                               // rook base
      x.beginPath(); x.moveTo(cx-22,222); x.lineTo(cx-16,150); x.lineTo(cx+16,150); x.lineTo(cx+22,222); x.closePath(); x.fill(); x.stroke();
      x.beginPath(); x.rect(cx-28,134,56,18); x.fill(); x.stroke();
      for(const dx of [-28,-9,10]){ x.beginPath(); x.rect(cx+dx,112,18,24); x.fill(); x.stroke() }
      x.shadowBlur=0; drawBitcoin(x,cx,190,11,0); break; }
    case 'oc_blaster': case 'oc_blaster2': {
      x.fillStyle='#ffffff'; for(let i=0;i<50;i++){ x.globalAlpha=.25+R()*.6; x.fillRect(30+R()*324,64+R()*210,2,2) } x.globalAlpha=1;
      const cols=[col,'#ff3fa4','#ffd23f'];
      for(let r=0;r<3;r++) for(let c=0;c<6;c++){ const px=cx-100+c*40, py=92+r*32; glow(cols[r],8); x.fillStyle=cols[r];
        x.fillRect(px-11,py,22,10); x.fillRect(px-15,py+5,30,7); x.fillRect(px-11,py+12,5,6); x.fillRect(px+6,py+12,5,6); x.shadowBlur=0; x.fillStyle='#0b0b10'; x.fillRect(px-6,py+3,3,3); x.fillRect(px+3,py+3,3,3) }
      const t=spec.art==='oc_blaster2'?.5:0; glow('#ffffff',12); ln(cx+t*20,232,cx+t*20,200,'#39ff88',4);
      x.fillStyle='#ffffff'; x.beginPath(); x.moveTo(cx,236); x.lineTo(cx-20,262); x.lineTo(cx+20,262); x.closePath(); x.fill(); x.shadowBlur=0;
      if(spec.art==='oc_blaster2'){ drawBitcoin(x,cx+90,236,16,0) } break; }
    case 'oc_album': {
      glow(col,22); x.fillStyle='#0f1512'; x.beginPath(); x.arc(cx,cy,104,0,TAU); x.fill(); x.shadowBlur=0;
      x.strokeStyle='rgba(57,255,136,.35)'; x.lineWidth=1.5; for(let r=40;r<100;r+=8){ x.beginPath(); x.arc(cx,cy,r,0,TAU); x.stroke() }
      x.fillStyle=col; x.beginPath(); x.arc(cx,cy,34,0,TAU); x.fill(); drawBitcoin(x,cx,cy,20,0);
      for(let i=0;i<7;i++){ const px=cx-72+i*24; dot(px,270,i===0?7:5,i===0?'#ffffff':col) } break; }
    case 'oc_loop': {
      glow(col,18); x.strokeStyle=col; x.lineWidth=9; x.lineCap='round'; x.beginPath(); x.arc(cx,cy,74,-.4,TAU*.82); x.stroke(); x.shadowBlur=0;
      x.fillStyle=col; x.beginPath(); x.moveTo(cx+62,cy-58); x.lineTo(cx+104,cy-46); x.lineTo(cx+70,cy-18); x.closePath(); x.fill();
      x.strokeStyle='#ffffff'; x.lineWidth=6; x.beginPath(); x.arc(cx-8,cy-6,26,0,TAU); x.stroke(); ln(cx+10,cy+14,cx+34,cy+44,'#ffffff',9);
      ln(cx-8,cy-6,cx-8,cy-20,'#ffffff',3); ln(cx-8,cy-6,cx+4,cy-6,'#ffffff',3); break; }
    case 'oc_radio': {
      box(cx-110,110,220,130,'#15221a',col); dot(cx-58,175,44,'#0b1510'); x.strokeStyle=col; x.lineWidth=3; x.beginPath(); x.arc(cx-58,175,44,0,TAU); x.stroke();
      x.fillStyle=col; for(let i=0;i<9;i++){ const h=10+Math.abs(Math.sin(i*1.7))*28; x.fillRect(cx-90+i*8,175-h/2,5,h) }
      x.fillStyle='#0b1510'; x.fillRect(cx+2,124,96,20); x.fillStyle=col; x.font='20px VT323, monospace'; x.textAlign='center'; x.fillText('ON-CHAIN FM',cx+50,140);
      dot(cx+30,200,14,col); dot(cx+72,200,14,col); ln(cx-40,110,cx+30,80,'#ffffff',3); break; }
    case 'oc_merkle': {
      const lv=[[cx],[cx-70,cx+70],[cx-105,cx-35,cx+35,cx+105]], ys=[92,150,208];
      for(let l=0;l<2;l++) lv[l].forEach((px,i)=>{ for(const k of [0,1]){ const c2=lv[l+1][i*2+k]; ln(px,ys[l],c2,ys[l+1],'rgba(238,242,255,.5)',3) } });
      lv[2].forEach(px=>{ for(const k of [-14,14]) ln(px,ys[2],px+k,262,'rgba(238,242,255,.3)',2); });
      lv.forEach((row,l)=>row.forEach(px=>dot(px,ys[l],l===0?18:11,l===0?BTC_ORANGE:col)));
      for(const px of lv[2]) for(const k of [-14,14]) box(px+k-6,258,12,10,col);
      drawBitcoin(x,cx,92,11,0); break; }
    case 'oc_split': {
      glow(BTC_ORANGE,16); dot(cx,96,26,BTC_ORANGE); x.shadowBlur=0; drawBitcoin(x,cx,96,16,0);
      const tx=[cx-120,cx-40,cx+40,cx+120], pc=['40%','30%','20%','10%'];
      tx.forEach((px,i)=>{ x.strokeStyle=col; x.lineWidth=4+ (3-i); x.beginPath(); x.moveTo(cx,124); x.quadraticCurveTo(cx,190,px,222); x.stroke(); dot(px,236,18,'#15151d'); dot(px,236,18,'rgba(0,0,0,0)');
        x.strokeStyle=col; x.lineWidth=3; x.beginPath(); x.arc(px,236,18,0,TAU); x.stroke(); x.fillStyle='#ffffff'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText(pc[i],px,243) }); break; }
    case 'oc_scales': {
      x.strokeStyle='#ffffff'; x.lineWidth=6; x.lineCap='round'; ln(cx,90,cx,240,'#ffffff',6); ln(cx-100,120,cx+100,120,'#ffffff',6); ln(cx-46,246,cx+46,246,'#ffffff',8);
      for(const s of [-1,1]){ const px=cx+s*100; ln(px,120,px-30,190,'rgba(238,242,255,.6)',2); ln(px,120,px+30,190,'rgba(238,242,255,.6)',2);
        glow(col,12); x.fillStyle=col; x.beginPath(); x.moveTo(px-40,190); x.lineTo(px+40,190); x.quadraticCurveTo(px,236,px-40,190); x.fill(); x.shadowBlur=0; dot(px,176,9,BTC_ORANGE) }
      dot(cx,90,10,BTC_ORANGE); break; }
    case 'oc_lib': {
      const names=[[cx-112,96],[cx-112,158],[cx-112,220]];
      names.forEach(([px,py],i)=>{ box(px,py,64,40,'#15221a',col); x.fillStyle=col; for(let k=0;k<5;k++) x.fillRect(px+8+k*10,py+20-Math.abs(Math.sin(k+i))*12,5,Math.abs(Math.sin(k+i))*24+4);
        arrow(x,px+64,cx+16,py+20,'rgba(238,242,255,.55)'); });
      box(cx+16,140,96,60,BTC_ORANGE); x.fillStyle='#0b0b10'; x.font='24px VT323, monospace'; x.textAlign='center'; x.fillText('NEW TRACK',cx+64,175);
      for(let i=0;i<3;i++) dot(cx-48+i*8,120+i*0,0,col); break; }
    case 'oc_prov': {
      const xs=[cx-96,cx,cx+96];
      xs.forEach((px,i)=>{ box(px-30,128,60,60,'#15151d',col); drawBitcoin(x,px,158,14,0); if(i<2) arrow(x,px+30,xs[i+1]-30,158,BTC_ORANGE) });
      x.fillStyle='rgba(238,242,255,.75)'; x.font='22px VT323, monospace'; x.textAlign='center'; ['MAKER','COLLECTOR','ARCHIVE'].forEach((t,i)=>x.fillText(t,xs[i],212)); break; }
    case 'oc_deps': {
      const sat=[[cx-100,100],[cx+100,100],[cx-110,210],[cx+110,210],[cx,262]];
      sat.forEach(([px,py])=>{ ln(cx,170,px,py,'rgba(238,242,255,.45)',3); dot(px,py,15,col) });
      glow(BTC_ORANGE,18); dot(cx,170,34,BTC_ORANGE); x.shadowBlur=0; x.fillStyle='#0b0b10'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText('LIB #',cx,178); break; }
    case 'oc_doc': {
      for(let i=3;i>=0;i--){ box(cx-70+i*10,90-i*0+i*8,140,170,i?'#1a1a22':'#eef2ff',col) }
      x.fillStyle='#22222c'; for(let i=0;i<8;i++) x.fillRect(cx-56+30,120+i*17-0,i%3===2?50:84,6);
      x.fillStyle=BTC_ORANGE; x.fillRect(cx-26,108,44,10); drawBitcoin(x,cx+82,254,14,0); break; }
    case 'oc_score': {
      const rows=[['1','ACE',9420],['2','K7',8110],['3','BTC',7350],['4','SAT',6020]];
      rows.forEach(([r,n,s],i)=>{ const py=92+i*44; box(cx-112,py,224,36,'#15151d',i===0?BTC_ORANGE:'rgba(238,242,255,.3)'); x.fillStyle=i===0?BTC_ORANGE:'#ffffff'; x.font='26px VT323, monospace'; x.textAlign='left'; x.fillText(r+'  '+n,cx-100,py+26); x.textAlign='right'; x.fillText(String(s),cx+100,py+26) });
      drawBitcoin(x,cx+98,72,10,0); break; }
    case 'oc_licence': {
      box(cx-80,90,160,180,'#eef2ff'); x.fillStyle='#22222c'; for(let i=0;i<6;i++) x.fillRect(cx-60,112+i*18,i===0?70:120,6);
      glow(col,14); dot(cx+40,232,26,BTC_ORANGE); x.shadowBlur=0; drawBitcoin(x,cx+40,232,15,0);
      x.strokeStyle='#0b7a3a'; x.lineWidth=8; x.lineCap='round'; x.beginPath(); x.moveTo(cx-60,236); x.lineTo(cx-44,250); x.lineTo(cx-16,220); x.stroke(); break; }
    case 'oc_capsule': {
      glow(col,18); x.fillStyle=col; x.beginPath(); x.roundRect ? x.roundRect(cx-44,88,88,176,44) : x.rect(cx-44,88,88,176); x.fill(); x.shadowBlur=0;
      x.fillStyle='#0b0b10'; x.fillRect(cx-44,168,88,6); dot(cx,128,22,'#0b0b10'); x.strokeStyle='#ffffff'; x.lineWidth=3; x.beginPath(); x.arc(cx,128,22,0,TAU); x.stroke();
      ln(cx,128,cx,114,'#ffffff',3); ln(cx,128,cx+11,134,'#ffffff',3); drawBitcoin(x,cx,218,16,0);
      x.fillStyle='rgba(238,242,255,.8)'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText('OPEN IN 2126',cx+0,284); break; }
    case 'oc_data': {
      for(let r=0;r<5;r++) for(let c=0;c<7;c++){ const h=R(); x.fillStyle=h>.55?col:'#1e2a44'; x.fillRect(cx-108+c*32,92+r*28,26,22) }
      for(const [a,b] of [[0,1],[2,4],[4,2]]) ln(cx-108+a*32+13,103+b*28,cx-108+(a+2)*32+13,103+(b+1)*28,BTC_ORANGE,3);
      drawBitcoin(x,cx+92,262,14,0); break; }
    case 'oc_agent': {
      glow(col,14); box(cx-56,110,112,96,'#15151d',col); x.shadowBlur=0; ln(cx,110,cx,86,col,4); dot(cx,82,8,BTC_ORANGE);
      dot(cx-24,150,12,col); dot(cx+24,150,12,col); dot(cx-24,150,5,'#0b0b10'); dot(cx+24,150,5,'#0b0b10');
      x.fillStyle=col; for(let i=0;i<5;i++) x.fillRect(cx-30+i*13,184,8,8);
      box(cx-30,212,60,44,'#15151d',col); drawBitcoin(x,cx,234,13,0); break; }
    case 'oc_twin': {
      for(const s of [-1,1]){ const px=cx+s*64; glow(col,s>0?14:0); x.globalAlpha=s>0?1:.55; dot(px,130,28,col); x.beginPath(); x.roundRect ? x.roundRect(px-38,166,76,80,30) : x.rect(px-38,166,76,80); x.fillStyle=col; x.fill(); x.globalAlpha=1; x.shadowBlur=0 }
      drawBitcoin(x,cx,206,18,0); ln(cx-30,206,cx-18,206,'#ffffff',3); ln(cx+18,206,cx+30,206,'#ffffff',3); break; }
    case 'oc_inscribe': {
      box(cx-116,110,64,80,'#eef2ff'); x.fillStyle='#22222c'; for(let i=0;i<4;i++) x.fillRect(cx-108,124+i*14,i%2?36:48,5);
      arrow(x,cx-44,cx+8,150,BTC_ORANGE);
      for(let i=0;i<3;i++){ box(cx+16+i*32,120+i*8,28,60,BTC_ORANGE,'#0b0b10') ; drawBitcoin(x,cx+30+i*32,150+i*8,8,0) }
      x.fillStyle='rgba(238,242,255,.8)'; x.font='22px VT323, monospace'; x.textAlign='center'; x.fillText('FILE  >  CHAIN',cx,240); break; }
    case 'oc_market': {
      [['STX',cx-96,'#5546ff'],['sBTC',cx,BTC_ORANGE],['USDCx',cx+96,'#2775ca']].forEach(([t,px,c])=>{ glow(c,14); dot(px,170,38,c); x.shadowBlur=0; x.fillStyle='#ffffff'; x.font='26px Bungee, Impact, sans-serif'; x.textAlign='center'; fitFont(x,t,26,'Bungee, Impact, sans-serif',66); x.fillText(t,px,180) });
      arrow(x,cx-70,cx+70,246,'rgba(238,242,255,.6)',true); break; }
    case 'oc_xplorer': {
      for(let r=0;r<3;r++) for(let c=0;c<4;c++){ x.fillStyle=['#3d86ff','#ff8a2a','#39ff88','#ff3fa4','#ffd23f'][(r*4+c*3)%5]; x.globalAlpha=.85; x.fillRect(cx-104+c*54,92+r*54,46,46) } x.globalAlpha=1;
      x.strokeStyle='#ffffff'; x.lineWidth=8; x.beginPath(); x.arc(cx+30,190,44,0,TAU); x.stroke(); ln(cx+62,222,cx+96,258,'#ffffff',12); break; }
    case 'oc_claim': {
      glow(col,18); box(cx-70,140,140,100,col); box(cx-78,118,156,30,col); x.shadowBlur=0;
      box(cx-9,118,18,122,'#0b0b10'); x.fillStyle='#0b0b10'; x.beginPath(); x.ellipse(cx-22,106,24,14,-.4,0,TAU); x.ellipse(cx+22,106,24,14,.4,0,TAU); x.fill();
      x.fillStyle=col; x.font='34px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText('0 FEE',cx,272); break; }
  }
}

const POSTER_POOL=POSTER_SETS.flat().concat(POSTERS_MORE, POSTERS_FUN, POSTERS_STACKS, POSTERS_EXTRA, POSTERS_PLAY, POSTERS_IDEAS);
const STACKS_PURPLE='#fc6432';
const posterColor=c=>c==='stacks'?STACKS_PURPLE:c==='orange'?BTC_ORANGE:c==='audio'?AUDIO_GREEN:c==='fun'?'#ff3fa4':c==='gold'?'#ffd23f':BRAND[c];
function wrapText(x,text,cx,y,maxW,lh){
  const words=text.split(' '); let line='';
  for(const w of words){ const tryL=line?line+' '+w:w; if(x.measureText(tryL).width>maxW && line){ x.fillText(line,cx,y); y+=lh; line=w } else line=tryL }
  if(line){ x.fillText(line,cx,y); y+=lh } return y;
}
function fitFont(x,text,px,fam,maxW){ let s=px; x.font=s+'px '+fam; while(x.measureText(text).width>maxW && s>10){ s-=2; x.font=s+'px '+fam } }
function coin(x,cx,cy,r,col,txt,tcol){
  x.save(); x.fillStyle=col; x.shadowColor=col; x.shadowBlur=18; x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.fill(); x.shadowBlur=0;
  x.fillStyle=tcol||'#ffffff'; x.textAlign='center'; x.textBaseline='middle'; fitFont(x,txt,Math.round(r*.62),'Bungee, Impact, sans-serif',r*1.6);
  x.fillText(txt,cx,cy+2); x.restore();
}
function arrow(x,x0,x1,y,col,both){
  x.save(); x.strokeStyle=x.fillStyle=col; x.lineWidth=5;
  x.beginPath(); x.moveTo(x0+(both?14:0),y); x.lineTo(x1-14,y); x.stroke();
  const head=(tx,dir)=>{ x.beginPath(); x.moveTo(tx,y); x.lineTo(tx-dir*16,y-10); x.lineTo(tx-dir*16,y+10); x.closePath(); x.fill() };
  head(x1,1); if(both) head(x0,-1); x.restore();
}
let stacksImg=null;
function posterArt(x,spec,W,col){
  const cx=W/2, cy=168;
  x.save(); x.textBaseline='alphabetic';
  switch(spec.art){
    case 'xtrata': drawLogo(x,cx,cy,190,5,14); break;
    case 'btc':    drawBitcoin(x,cx,cy,92,24); break;
    case 'supply':
      drawBitcoin(x,cx,cy-30,58,18);
      x.textAlign='center'; x.fillStyle='#ffffff'; x.font='44px Bungee, Impact, sans-serif'; x.fillText('21,000,000',cx,cy+78); break;
    case 'stacks':
      if(stacksImg){ const sz=180, r=26, x0=cx-sz/2, y0=cy-sz/2; x.shadowColor=STACKS_PURPLE; x.shadowBlur=26; x.beginPath(); x.moveTo(x0+r,y0); x.arcTo(x0+sz,y0,x0+sz,y0+sz,r); x.arcTo(x0+sz,y0+sz,x0,y0+sz,r); x.arcTo(x0,y0+sz,x0,y0,r); x.arcTo(x0,y0,x0+sz,y0,r); x.closePath(); x.fillStyle=STACKS_PURPLE; x.fill(); x.shadowBlur=0; x.clip(); x.drawImage(stacksImg,x0,y0,sz,sz) }
      else { x.textAlign='center'; x.textBaseline='middle'; x.font='118px Bungee, Impact, sans-serif';
        x.shadowColor=STACKS_PURPLE; x.shadowBlur=24; x.fillStyle=STACKS_PURPLE; x.fillText('STX',cx,cy+6);
        x.shadowBlur=0; x.lineWidth=3; x.strokeStyle='#ffffff'; x.strokeText('STX',cx,cy+6) }
      break;
    case 'scores': {
      x.fillStyle='#050508'; x.fillRect(40,70,W-80,200); x.strokeStyle='rgba(238,242,255,.4)'; x.lineWidth=2; x.strokeRect(40,70,W-80,200);
      x.font='30px VT323, monospace'; x.textAlign='center'; x.fillStyle=BRAND.orange; x.fillText('HIGH SCORES',cx,108);
      const rows=[['1ST','AAA','98450'],['2ND','JIM','87210'],['3RD','STX','76090'],['4TH','SAT','52300']];
      x.font='28px VT323, monospace';
      rows.forEach(([a,b,n],i)=>{ const y=148+i*32; x.fillStyle=i?'#eef2ff':'#ffd23d';
        x.textAlign='left'; x.fillText(a,62,y); x.fillText(b,140,y); x.textAlign='right'; x.fillText(n,W-62,y) });
      break; }
    case 'tiers': {
      const bars=[['XTRATA',BRAND.blue],['STACKS',STACKS_PURPLE],['BITCOIN',BTC_ORANGE]];
      bars.forEach(([t,c2],i)=>{ const y=78+i*64, inset=i*14;
        x.fillStyle=c2; x.fillRect(58-inset,y,W-116+inset*2,50);
        x.fillStyle='#0b0b10'; x.font='24px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText(t,cx,y+35) });
      break; }
    case 'wave': {
      x.fillStyle=col; x.shadowColor=col; x.shadowBlur=14;
      for(let i=0;i<40;i++){ const a=Math.abs(Math.sin(i*.45)*Math.sin(i*.13+1))*.9+.08, h=a*100; x.fillRect(52+i*7,cy-h,5,h*2) }
      break; }
    case 'blocks': {   // today's 144 blocks, filled as they arrive
      const h=chain.height||0, done=h%BLOCKS_PER_DAY, s=13, g=2, x0=cx-(12*(s+g)-g)/2, y0=66;
      for(let i=0;i<BLOCKS_PER_DAY;i++){ const r=Math.floor(i/12), q=i%12;
        x.fillStyle = i<done ? BTC_ORANGE : i===done ? '#ffffff' : '#23232e'; x.fillRect(x0+q*(s+g), y0+r*(s+g), s, s) }
      x.fillStyle='#ffffff'; x.textAlign='center';
      if(chain.day>=0){ const t='DAY '+String(chain.day)+' · BLOCK '+(done+1)+' OF 144'; fitFont(x,t,26,'VT323, monospace',W-60); x.fillText(t,cx,y0+12*(s+g)+24) }
      break; }
    case 'pox':
      drawBitcoin(x,cx-92,cy-10,50,16); arrow(x,cx-32,cx+32,cy-10,'#ffffff'); coin(x,cx+92,cy-10,50,STACKS_PURPLE,'STX');
      x.fillStyle='#ffffff'; x.textAlign='center'; fitFont(x,'BTC SPENT → STACKS BLOCK MINED',24,'VT323, monospace',W-60); x.fillText('BTC SPENT → STACKS BLOCK MINED',cx,cy+84); break;
    case 'recursion': {
      let s=200; for(let k=0;k<7;k++){ x.save(); x.translate(cx,cy); x.rotate(k*.12); x.strokeStyle=k%2?'#ffffff':col; x.globalAlpha=1-k*.1; x.lineWidth=4; x.strokeRect(-s/2,-s/2,s,s); x.restore(); s*=.76 }
      drawLogo(x,cx,cy,34,2,6); break; }
    case 'steps': {
      const on=[[1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0],[1,0,1,1,0,1,0,1],[0,1,0,0,0,0,1,1]], s=30, g=8, x0=cx-(8*(s+g)-g)/2, y0=cy-(4*(s+g)-g)/2;
      for(let r=0;r<4;r++) for(let q=0;q<8;q++){ const lit=on[r][q]; x.fillStyle=lit?col:'#1c1d28'; x.shadowColor=col; x.shadowBlur=lit?12:0; x.fillRect(x0+q*(s+g),y0+r*(s+g),s,s) }
      x.shadowBlur=0; x.fillStyle='#ffffff'; x.fillRect(x0+2*(s+g)-5,y0-12,3,4*(s+g)+16); break; }
    case 'genesis':
      x.strokeStyle=BTC_ORANGE; x.lineWidth=5; x.strokeRect(cx-120,76,240,176); x.fillStyle=BTC_ORANGE; x.fillRect(cx-120,76,240,42);
      x.fillStyle='#0b0b10'; x.textAlign='center'; x.font='26px Bungee, Impact, sans-serif'; x.fillText('BLOCK 0',cx,107);
      x.fillStyle='#ffffff'; fitFont(x,'03 · 01 · 2009',52,'VT323, monospace',210); x.fillText('03 · 01 · 2009',cx,180);
      x.fillStyle=col; x.font='24px VT323, monospace'; x.fillText('REWARD: 50 BTC',cx,228); break;
    case 'code': {
      x.fillStyle='#050508'; x.fillRect(30,74,W-60,194); x.strokeStyle=col; x.lineWidth=2; x.strokeRect(30,74,W-60,194);
      x.textAlign='left'; const L=[['(define-read-only (bitcoin-day)','#ffffff'],['  (/ burn-block-height u144))',col],['',''],[';; interpreted, not compiled.','#8a8fa8'],[';; what you read is what runs.','#8a8fa8']];
      L.forEach(([t,c2],i)=>{ if(!t) return; x.fillStyle=c2; fitFont(x,t,22,'VT323, monospace',W-84); x.fillText(t,44,112+i*34) }); break; }
    case 'twins':
      for(const s of [-1,1]){ const bx=cx+s*74-50, by=cy-58; x.strokeStyle=col; x.lineWidth=4; x.strokeRect(bx,by,100,116); drawLogo(x,bx+50,by+58,66,3,8) }
      x.strokeStyle='#ffffff'; x.lineWidth=4; for(const o of [-9,9]){ x.beginPath(); x.ellipse(cx+o,cy,11,7,0,0,Math.PI*2); x.stroke() } break;
    case 'radio':
      x.fillStyle='#111116'; x.beginPath(); x.arc(cx,cy,100,0,Math.PI*2); x.fill();
      x.strokeStyle='rgba(255,255,255,.13)'; x.lineWidth=1.5; for(let r=42;r<98;r+=7){ x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.stroke() }
      x.fillStyle=col; x.shadowColor=col; x.shadowBlur=16; x.beginPath(); x.arc(cx,cy,34,0,Math.PI*2); x.fill(); x.shadowBlur=0;
      x.fillStyle='#0b0b10'; x.beginPath(); x.moveTo(cx-10,cy-14); x.lineTo(cx+16,cy); x.lineTo(cx-10,cy+14); x.closePath(); x.fill(); break;
    case 'sats':
      drawBitcoin(x,cx,cy-52,44,16);
      x.textAlign='center'; x.fillStyle='#ffffff'; fitFont(x,'100,000,000',48,'Bungee, Impact, sans-serif',W-70); x.fillText('100,000,000',cx,cy+50);
      x.fillStyle=col; x.font='28px VT323, monospace'; x.fillText('SATS = 1 BTC',cx,cy+90); break;
    case 'halving': {
      const vals=['50','25','12.5','6.25','3.125'], bw=46, g=14, x0=cx-(5*(bw+g)-g)/2, base=248;
      vals.forEach((v,i)=>{ const h=150/Math.pow(2,i); x.fillStyle=i===4?BTC_ORANGE:'rgba(247,147,26,'+(.3+i*.12)+')';
        x.fillRect(x0+i*(bw+g),base-h,bw,h); x.fillStyle='#ffffff'; fitFont(x,v,21,'VT323, monospace',bw+g-4); x.textAlign='center'; x.fillText(v,x0+i*(bw+g)+bw/2,base-h-8) });
      x.strokeStyle='#ffffff'; x.lineWidth=2; x.beginPath(); x.moveTo(x0-6,base+2); x.lineTo(x0+5*(bw+g),base+2); x.stroke();
      x.fillStyle=col; x.textAlign='center'; fitFont(x,'BTC PER BLOCK, EPOCH BY EPOCH',22,'VT323, monospace',W-60); x.fillText('BTC PER BLOCK, EPOCH BY EPOCH',cx,base+26); break; }
    case 'sbtc':
      drawBitcoin(x,cx-94,cy-6,48,16); arrow(x,cx-36,cx+36,cy-6,'#ffffff',true); coin(x,cx+94,cy-6,48,'#ffffff','sBTC',BTC_ORANGE);
      x.fillStyle='#ffffff'; x.textAlign='center'; x.font='30px VT323, monospace'; x.fillText('1 : 1',cx,cy+86); break;
    case 'bytes': {
      x.fillStyle='#050508'; x.fillRect(30,74,W-60,194); x.strokeStyle=col; x.lineWidth=2; x.strokeRect(30,74,W-60,194);
      const src='<!doctype html><html><body><canvas></canvas><script>', B=[...src].map(ch=>ch.charCodeAt(0));
      x.textAlign='left';
      for(let r=0;r<7;r++){ const row=B.slice(r*6,r*6+6); if(!row.length) break;
        const hex=row.map(b=>b.toString(16).padStart(2,'0')).join(' ').padEnd(17,' '), txt=row.map(b=>String.fromCharCode(b)).join('');
        x.fillStyle=r===0?col:'rgba(238,242,255,.75)'; fitFont(x,'0000  '+hex+'  '+txt,22,'VT323, monospace',W-84);
        x.fillText((r*6).toString(16).padStart(4,'0')+'  '+hex+'  '+txt,44,104+r*25) }
      break; }
    case 'helmet': {
      x.fillStyle='#e9ecf5'; x.beginPath(); x.arc(cx,cy,92,0,Math.PI*2); x.fill();
      x.fillStyle='#c7ccd9'; x.fillRect(cx-70,cy+74,140,26);
      const g2=x.createLinearGradient(cx-60,cy-40,cx+60,cy+40); g2.addColorStop(0,col); g2.addColorStop(1,'#0b1a3a');
      x.fillStyle=g2; x.beginPath(); x.ellipse(cx,cy+2,66,50,0,0,Math.PI*2); x.fill();
      x.strokeStyle='#ffffff'; x.lineWidth=3; x.beginPath();
      for(let i=0;i<=40;i++){ const px=cx-50+i*2.5, py=cy+2+Math.sin(i*.9)*Math.sin(i*.2)*20; i?x.lineTo(px,py):x.moveTo(px,py) } x.stroke(); break; }
    case 'stacking':
      for(let i=0;i<4;i++){ const w=210-i*14, y=250-i*34; x.fillStyle=STACKS_PURPLE; x.globalAlpha=.5+i*.16; x.fillRect(cx-w/2,y,w,28) }
      x.globalAlpha=1; x.fillStyle='#0b0b10'; x.textAlign='center'; x.font='20px Bungee, Impact, sans-serif'; x.fillText('STX',cx,272);
      drawBitcoin(x,cx,cy-62,40,20); break;
    case 'ship': {
      const R=rng(7); x.fillStyle='#ffffff'; for(let i=0;i<46;i++){ x.globalAlpha=.3+R()*.7; x.fillRect(40+R()*304,70+R()*200,2,2) } x.globalAlpha=1;
      x.strokeStyle=col; x.lineWidth=4; x.shadowColor=col; x.shadowBlur=12;
      x.beginPath(); x.moveTo(cx,cy+26); x.lineTo(cx-28,cy+86); x.lineTo(cx,cy+70); x.lineTo(cx+28,cy+86); x.closePath(); x.stroke();
      x.fillStyle=col; x.fillRect(cx-2,cy-36,4,24); x.fillRect(cx-2,cy-84,4,24);
      x.shadowBlur=0; x.strokeStyle='#ffffff'; x.lineWidth=3;
      for(const [ax,ay,r] of [[cx-94,cy-56,28],[cx+84,cy-24,18],[cx+44,cy-92,12]]){ x.beginPath();
        for(let k=0;k<9;k++){ const a=k/9*Math.PI*2, rr=r*(k%2?.78:1); k?x.lineTo(ax+Math.cos(a)*rr,ay+Math.sin(a)*rr):x.moveTo(ax+Math.cos(a)*rr,ay+Math.sin(a)*rr) }
        x.closePath(); x.stroke() }
      break; }
    case 'fast': {
      x.fillStyle=col; x.shadowColor=col; x.shadowBlur=24; x.beginPath();
      [[22,-104],[-52,12],[-8,12],[-26,106],[54,-18],[8,-18],[34,-104]].forEach(([px,py],k)=>k?x.lineTo(cx+px,cy+py):x.moveTo(cx+px,cy+py));
      x.closePath(); x.fill(); x.shadowBlur=0; drawBitcoin(x,cx+92,cy+78,26,10); break; }
    case 'key':
      x.strokeStyle=col; x.lineWidth=12; x.lineCap='round'; x.shadowColor=col; x.shadowBlur=14;
      x.beginPath(); x.arc(cx-64,cy,40,0,Math.PI*2); x.stroke();
      x.beginPath(); x.moveTo(cx-24,cy); x.lineTo(cx+104,cy); x.moveTo(cx+62,cy); x.lineTo(cx+62,cy+30); x.moveTo(cx+92,cy); x.lineTo(cx+92,cy+22); x.stroke(); break;
    default: posterArtMore(x,spec,W,col,cx,cy);
  }
  x.restore(); x.textAlign='center'; x.textBaseline='alphabetic';
}
/* each wall poster keeps its own canvas so a new set can be painted in place */

/* ---------- the one-off animated poster: a neon shape-morph, 180 frames at 25 fps from a sprite sheet ---------- */
const ANIM_POSTER={art:'anim', anim:true, head:'', sub:'', foot:' '};
const ANIM={cols:15, size:192, frames:180, fps:25};
const ANIM_SHEET=XA_HALL_ASSETS.ANIM_SHEET;
let animImg=null; { const im=new Image(); im.onload=()=>{ animImg=im }; im.src=ANIM_SHEET }
function updateAnimPosters(t){
  const f=Math.floor(t*ANIM.fps)%ANIM.frames;
  for(const s of posterSlots) if(s.spec && s.spec.anim && (s.frame!==f || !s.drawn) && animImg){ s.frame=f; s.drawn=true; paintPoster(s,s.spec) }
  for(const s of posterSlots) if(s.spec && s.spec.pic && s.spec.pic.sheet && s.spec.pic.img){
    const e=s.spec.pic.entry, g=Math.floor(t*e.fps)%Math.max(1,e.frames); if(s.frame!==g){ s.frame=g; paintPoster(s,s.spec) } }
}

const posterSlots=[];
function makePosterSlot(){ const cv=mkCanvas(384,576); const s={cv, x:cv.getContext('2d'), tex:tex(cv), spec:null}; posterSlots.push(s); return s }
function paintPoster(slot, spec){
  const W=384, H=576, x=slot.x; slot.spec=spec;
  if(spec.anim){   // nothing on it but the animation, centred on black
    x.setTransform(1,0,0,1,0,0); x.fillStyle='#000'; x.fillRect(0,0,W,H);
    if(animImg){ const f=slot.frame||0, n=ANIM.size, d=330; x.drawImage(animImg,(f%ANIM.cols)*n,Math.floor(f/ANIM.cols)*n,n,n,(W-d)/2,(H-d)/2,d,d) }
    slot.tex.needsUpdate=true; return;
  }
  const col=posterColor(spec.c);
  x.save(); x.setTransform(1,0,0,1,0,0); x.shadowBlur=0; x.globalAlpha=1;
  x.fillStyle='#0b0b10'; x.fillRect(0,0,W,H);
  x.strokeStyle=col; x.lineWidth=6; x.strokeRect(16,16,W-32,H-32);
  posterArt(x,spec,W,col);
  x.textAlign='center'; x.textBaseline='alphabetic';
  const lines=(t,maxW)=>{ const out=[]; let line=''; for(const w of t.split(' ')){ const tl=line?line+' '+w:w; if(x.measureText(tl).width>maxW && line){ out.push(line); line=w } else line=tl } if(line) out.push(line); return out };
  let hs=36, ss=30, hl, sl;
  for(;;){ x.font=hs+'px Bungee, Impact, sans-serif'; hl=lines(spec.head,W-70); x.font=ss+'px VT323, monospace'; sl=lines(spec.sub,W-80);
    const end=298+hl.length*hs*1.15+ss*.55+sl.length*ss; if(end<=H-92 || ss<=20) break; if(hl.length>2 && hs>26) hs-=2; else ss-=2 }
  let y=298+hs; x.fillStyle='#ffffff'; x.font=hs+'px Bungee, Impact, sans-serif'; for(const l of hl){ x.fillText(l,W/2,y); y+=hs*1.15 }
  y+=ss*.55; x.fillStyle=col; x.font=ss+'px VT323, monospace'; for(const l of sl){ x.fillText(l,W/2,y); y+=ss }
  if(spec.foot!==' ') x.fillRect(48,H-78,W-96,3);
  x.fillStyle='rgba(238,242,255,.75)'; fitFont(x,spec.foot||'XTRATA ARCADE',22,'Bungee, Impact, sans-serif',W-72); x.fillText(spec.foot||'XTRATA ARCADE',W/2,H-42);
  if(spec.pic){
    if(spec.pic.img){
      const im=spec.pic.img;
      if(spec.pic.sheet){ const e=spec.pic.entry, cw=Math.floor(im.width/Math.max(1,e.cols)), ch=cw>0 && e.frames>0 ? Math.floor(im.height/Math.ceil(e.frames/e.cols)) : 0, f=(slot.frame||0)%Math.max(1,e.frames);
        if(cw>0 && ch>0) x.drawImage(im,(f%e.cols)*cw,Math.floor(f/e.cols)*ch,cw,ch,0,0,W,H) }
      else x.drawImage(im,0,0,W,H);
    } else ensurePic(spec);
  }
  if(spec.play){   // playable: a PLAY tab in the top corner
    x.fillStyle=BTC_ORANGE; x.beginPath(); x.roundRect ? x.roundRect(W-120,30,88,30,15) : x.rect(W-120,30,88,30); x.fill();
    x.fillStyle='#0b0b10'; x.beginPath(); x.moveTo(W-106,38); x.lineTo(W-106,52); x.lineTo(W-94,45); x.closePath(); x.fill();
    x.font='18px Bungee, Impact, sans-serif'; x.textAlign='left'; x.fillText('PLAY',W-88,52);
  }
  x.restore();
  slot.tex.needsUpdate=true;
}
/* Daily rotation, deterministic from the Bitcoin day alone (everyone sees the same walls).
   The pool is dealt in a fixed shuffled order. Each day the oldest 9-13 posters come down and the
   next ones in the deck go up in their places, so 30-50% of the walls change daily and no poster
   is ever up twice at once. Replayed from a fixed start day, so it's the same on every machine. */
const ROTATION_START_DAY=6700;
function hash32(n){ n=Math.imul(n^0x9e3779b9,0x85ebca6b); n^=n>>>13; n=Math.imul(n,0xc2b2ae35); return (n^(n>>>16))>>>0 }
function seededShuffle(arr,seed){ const R=rng(seed), a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }
/* Weighted daily rotation. Sets are drawn with falling weights: the first 27 most often, then each later
   set less, and the animated poster least of all. Each day the oldest 9-13 wall posters come down and
   replacements are drawn by weight from the posters not already up (and not just taken down). */
const SET_WEIGHTS=[1, .7, .5, .35, .22, 1, .6, .05];   // sets 1-5, then the PLAYABLE on-chain posters, the IMAGINE posters, then the animated poster
const ROTATION_POOL=[], ROTATION_W=[];
[POSTER_SETS.flat(), POSTERS_MORE, POSTERS_FUN, POSTERS_STACKS, POSTERS_EXTRA, POSTERS_PLAY, POSTERS_IDEAS, [ANIM_POSTER]]
  .forEach((set,k)=>set.forEach(p=>{ ROTATION_POOL.push(p); ROTATION_W.push(SET_WEIGHTS[k]) }));
function pickWeighted(R, taken){
  let tot=0; for(let i=0;i<ROTATION_POOL.length;i++) if(!taken.has(i)) tot+=ROTATION_W[i];
  let r=R()*tot, last=-1;
  for(let i=0;i<ROTATION_POOL.length;i++) if(!taken.has(i)){ last=i; r-=ROTATION_W[i]; if(r<=0) return i }
  return last;
}
function wallForDay(day, nSlots){
  const n=Math.min(nSlots, ROTATION_POOL.length-13), R0=rng(0x58545241), on=new Set(), wall=[];
  for(let i=0;i<n;i++){ const p=pickWeighted(R0,on); on.add(p); wall.push(p) }
  let age=wall.map((_,i)=>i), fresh=n;                                      // slot indices, oldest first
  for(let d=Math.min(day,ROTATION_START_DAY)+1; d<=day; d++){
    const k=Math.min(n, 9+hash32(d)%5), R=rng(hash32(d*13+5));             // 9-13 swaps
    const freed=seededShuffle(age.slice(0,k), hash32(d*7+3)); age=age.slice(k).concat(freed);
    const outgoing=freed.map(sl=>wall[sl]);
    for(const sl of freed){ const p=pickWeighted(R,on); on.add(p); wall[sl]=p }
    for(const p of outgoing) on.delete(p);
    fresh=k;
  }
  return {wall, fresh};
}
function applyDay(day){
  const {wall, fresh}=wallForDay(day, posterSlots.length); chain.fresh=fresh;
  baseWall={day, wall};
  paintWall();
}
/* The wall is the embedded rotation above (never changed). When the world contracts are on and have been read,
   chain posters are laid over it (XAWorld.composeWall). With no contracts, or a failed read, the wall is the
   embedded one exactly: that is the v1.3 hall. */
let baseWall=null;
/* Pin spots (the posters contract's set-pin `spot`) cover EVERY poster slot on the wall, 1 to the number of slots:
   spots 1-4 are the four free slots nearest the entrance, 5-12 are the bays' posters (bay 0: 5,6  bay 1: 7,8  bay 2: 9,10  bay 3: 11,12),
   then the rest in wall order. A bay whose scene is not "posters" hides its pinned posters (the scene wins; see applyBays). */
function pinSlots(){
  const first=[2,16,3,17];
  for(const code of ['L','R','NL','NR']) posterSlots.forEach((s,i)=>{ if(s.bay===code) first.push(i) });
  return window.XAWorld.pinSlotMap(posterSlots.length, first);
}
function paintWall(){
  if(!baseWall) return;
  const W=window.XAWorld, snap=W && W.enabled() ? W.snapshot() : null;
  let items=null;
  if(snap){
    try{ items=W.composeWall(baseWall.wall,{day:baseWall.day, nEmbedded:ROTATION_POOL.length, weights:ROTATION_W, snapshot:snap,
      overlaySlots:posterSlots.map((s,i)=>s.bay?-1:i).filter(i=>i>=0), pinSlots:pinSlots()}) }catch(e){ items=null }
  }
  posterSlots.forEach((s,i)=>{
    const spec=items ? (items[i].src==='c' ? chainSpec(items[i].entry) : ROTATION_POOL[items[i].idx]) : ROTATION_POOL[baseWall.wall[i]];
    if(s.spec!==spec){ s.drawn=false; paintPoster(s,spec) }
  });
  applyBays(snap);
}
/* Bays (the four wall areas at the ends of the rows: 0 far left, 1 far right, 2 near left, 3 near right, the contract's order).
   Posters mode, or any failure, shows the bay's two posters as always.
   Other scenes are drawn by the bay engine; until then a bay with another scene shows plain wall. */
const BAY_INDEX={L:0, R:1, NL:2, NR:3};
function applyBays(snap){
  if(bayEngine){ try{
    // the hall's bays, then the lobby's (snap.rooms.lobby.bays), in the engine's order
    const lb=snap && snap.rooms && snap.rooms.lobby && snap.rooms.lobby.bays;
    let n=0; if(Array.isArray(lb)) lb.slice(0,LOBBY_MAX).forEach((b,k)=>{ if(b) n=k+1 });   // as many doorways as the lobby's highest bay object
    lobbyLayout(n);
    const room=[]; for(let k=0;k<bayEngine.count()-HALL_BAYS;k++) room.push(k<lobbyCount && lb ? lb[k]||null : null);
    const all=lb && snap.bays ? Object.assign({}, snap, {bays:snap.bays.slice(0,HALL_BAYS).concat(room)}) : snap;
    bayEngine.apply(all,{instant:state==='intro'})
  }catch(e){ console.error(e) } }
  { let lb=-1; if(snap && snap.bays) for(let i=0;i<snap.bays.length && lb<0;i++) if(linksToLobby(snap.bays[i] && snap.bays[i].scene)) lb=i; setLobbyBay(lb) }
  for(const s of posterSlots){
    if(!s.bay) continue;
    const i=BAY_INDEX[s.bay];
    const bay=snap && snap.bays ? snap.bays[i] : null;
    const show=bayEngine ? bayEngine.showPosters(i) : (!bay || !bay.scene || bay.scene.base==='posters');
    if(s.group && s.group.visible!==show) s.group.visible=show;
  }
}
/* A chain poster as a hall poster spec. Cached by id and content, so an unchanged poster keeps its identity
   (and is not repainted). Everything on it is text and numbers; pictures are checked against their chain hash. */
const chainSpecs=new Map();
function safePath(p){ return typeof p==='string' && /^\/[A-Za-z0-9._~\-][A-Za-z0-9._~\-\/?=&%#]*$/.test(p) && p.length<=64 }
function chainSpec(e){
  const key=e.id+'|'+e.kind+'|'+e.head+'|'+e.sub+'|'+e.foot+'|'+e.c+'|'+e.art+'|'+e.imageId+'|'+e.actKind+'|'+e.actId+'|'+e.actText;
  const old=chainSpecs.get(e.id); if(old && old.key===key) return old.spec;
  const spec={head:e.head, sub:e.sub, foot:e.foot||'XTRATA ARCADE', c:e.c, art:e.art, chainId:e.id};
  if(e.kind===3 && e.art==='blocks'){ spec.live=true }        // live posters: the only binding so far is the Bitcoin day board
  if((e.kind===1 || e.kind===2) && e.imageHash) spec.pic={entry:e, sheet:e.kind===2, img:null, state:0};
  if(e.actKind===1 && e.actId>0) spec.play={id:e.actId, title:e.head, note:e.sub};
  else if(e.actKind===2 && safePath(e.actText)) spec.play={path:e.actText, title:e.head, note:e.sub};
  else if(e.actKind===3 && e.actId>0) spec.play={playlist:e.actId, title:e.head, note:e.sub};
  chainSpecs.set(e.id,{key,spec});
  return spec;
}
/* Poster pictures: one at a time, only for posters on the wall. PNG, WebP or JPEG only (checked by their first bytes). */
const picQueue=[]; let picBusy=false;
function picMime(b){
  if(b.length>12 && b[0]===0x89 && b[1]===0x50 && b[2]===0x4e && b[3]===0x47) return 'image/png';
  if(b.length>12 && b[0]===0x52 && b[1]===0x49 && b[2]===0x46 && b[3]===0x46 && b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50) return 'image/webp';
  if(b.length>3 && b[0]===0xff && b[1]===0xd8 && b[2]===0xff) return 'image/jpeg';
  return null;
}
function ensurePic(spec){
  const pic=spec.pic; if(!pic || pic.state!==0 || !window.XAWorld) return;
  pic.state=1; picQueue.push(spec); if(!picBusy) nextPic();
}
function nextPic(){
  const spec=picQueue.shift(); if(!spec){ picBusy=false; return }
  picBusy=true;
  XAWorld.loadImageBytes(spec.pic.entry).then(bytes=>{
    const mime=picMime(bytes); if(!mime) throw new Error('not a picture');
    const url=URL.createObjectURL(new Blob([bytes],{type:mime})), im=new Image();
    return new Promise((ok,bad)=>{ im.onload=()=>{ URL.revokeObjectURL(url); ok(im) }; im.onerror=()=>{ URL.revokeObjectURL(url); bad(new Error('bad picture')) }; im.src=url });
  }).then(im=>{
    spec.pic.img=im; spec.pic.state=2;
    for(const s of posterSlots) if(s.spec===spec){ s.drawn=false; paintPoster(s,spec) }
  }).catch(()=>{ spec.pic.state=3 }).then(()=>setTimeout(nextPic,150));
}
function repaintLivePosters(){ for(const s of posterSlots) if(s.spec && s.spec.live) paintPoster(s,s.spec) }
if(STACKS_LOGO){ const im=new Image(); im.onload=()=>{ stacksImg=im; for(const s of posterSlots) if(s.spec && s.spec.art==='stacks') paintPoster(s,s.spec) }; im.src=STACKS_LOGO }

function buildPosters(){
  const frameMat=new THREE.MeshStandardMaterial({color:0x1b1b22, metalness:.7, roughness:.35});
  // a poster in every other gap between cabinets, alternating walls
  // one poster in every gap between machines, and two in the open wall at each end of each row
  const spots=[], bayDefs=[];
  for(const [side,n] of [[-1,NL],[1,NR]]){
    const zHi=cabZ(0,n)+.62, zLo=cabZ(n-1,n)-.62, wallEnd=RL/2-.35;
    const endPair=(a,b,bay)=>{ const mid=(a+b)/2; spots.push([side,mid+.52,bay],[side,mid-.52,bay]) };
    endPair(zHi, wallEnd, side<0?'NL':'NR');   // entrance end: also a bay (2, 3)
    bayDefs[side<0?2:3]={side, z:(zHi+wallEnd)/2, width:wallEnd-zHi};
    for(let k=0;k<n-1;k++) spots.push([side, cabZ(k,n)-GAP/2, undefined, {gap:k, birth:ROW[side][k+1]}]);
    endPair(-wallEnd, zLo, side<0?'L':'R');   // far end (bays 0, 1)
    bayDefs[side<0?0:1]={side, z:(-wallEnd+zLo)/2, width:zLo+wallEnd};
  }
  /* Poster slot numbers are permanent: pinned posters and the day's wall are keyed by slot index. With the built-in 21 games the slots are the
     original 27, in the original order. When more games add more gaps between cabinets, those new slots go AFTER the original ones, in the order
     the games were added, so no existing slot changes number. */
  if(GAMES.length>BUILT_IN_GAMES){
    const baseGap={'-1':BUILT_IN_LEFT-1, '1':BUILT_IN_GAMES-BUILT_IN_LEFT-1};
    const isNew=(sp,side)=>sp[3] && sp[3].gap>=baseGap[side];
    const keep=[], extra=[];
    spots.forEach(sp=>{ (isNew(sp,sp[0]) ? extra : keep).push(sp) });
    extra.sort((a,b)=>a[3].birth-b[3].birth);
    spots.length=0; spots.push(...keep, ...extra);
  }
  bayDefsAll=bayDefs;
  // the lobby has two doorways of its own, on its back wall (the hall's four come first, so the lobby's are bays 4 and 5). The lobby group exists
  // from the start so they can hang in it; it is moved behind the right wall when a door links to the lobby.
  lobbyG=new THREE.Group(); lobbyG.visible=false; scene.add(lobbyG);
  HALL_BAYS=bayDefs.length;
  bayDefs.push(...lobbyDefs(2));
  spots.forEach(([side,z,bay])=>{
    const g=new THREE.Group(); g.position.set(side*(RW/2-.03),1.95,z); g.rotation.y = side<0 ? Math.PI/2 : -Math.PI/2;
    g.add(new THREE.Mesh(new THREE.BoxGeometry(.84,1.22,.03),frameMat));
    const slot=makePosterSlot(); slot.pos={x:side*(RW/2-.03), z}; slot.group=g; if(bay) slot.bay=bay;
    const p=new THREE.Mesh(new THREE.PlaneGeometry(.76,1.14), new THREE.MeshBasicMaterial({map:slot.tex, color:0xdadada}));
    p.position.z=.017; p.userData.slot=slot; posterMeshes.push(p); g.add(p); scene.add(g);
  });
  try{
    if(window.XAWorld && window.XA_WORLD_CONFIG) XAWorld.configure(window.XA_WORLD_CONFIG);
    if(window.XABays && window.XAWorld && XAWorld.enabled())
      bayEngine=XABays.create({THREE, scene, camera, mkCanvas, tex, RW, RH, bays:bayDefs, wallT:WALL_T, listener:()=>player, stillFor:(lk)=>stillFor(lk)});
    if(bayEngine) buildLobby();
  }catch(e){ console.error(e); bayEngine=null }
  applyDay(Math.max(chain.day, ROTATION_START_DAY));
}

/* ================================================================
   BITCOIN CLOCK + the hanging LED day board
   ================================================================ */
const BLOCKS_PER_DAY=144;
const ANCHOR={h:969000, t:1790636400, spb:585};  // ≈ block 969,000 at 23:00 UTC 28 Sep 2026, ~585 s a block lately (offline estimate only)
const chain={height:0, day:-1, fresh:0, live:false};
function estHeight(){ return ANCHOR.h + Math.floor((Date.now()/1000-ANCHOR.t)/ANCHOR.spb) }
async function fetchHeight(){
  const sc=(XAScores && XAScores.config && XAScores.config()) || {};
  const net=sc.network==='testnet' ? 'testnet' : 'mainnet', urls=[];
  if(Array.isArray(sc.apiBases) && sc.apiBases.length) sc.apiBases.forEach(b=>urls.push([String(b).replace(/\/+$/,'')+'/v2/info','hiro']));
  else {
    try{ if(/xtrata\.xyz$/.test(location.hostname)) urls.push([location.origin+'/hiro/'+net+'/v2/info','hiro']) }catch(e){}
    urls.push(['https://api.'+net+'.hiro.so/v2/info','hiro']);
  }
  if(net==='mainnet') urls.push(['https://mempool.space/api/blocks/tip/height','text']);
  for(const [u,kind] of urls){
    try{
      const ctl=new AbortController(), to=setTimeout(()=>ctl.abort(),8000);
      const r=await fetch(u,{signal:ctl.signal, cache:'no-store'}); clearTimeout(to);
      if(!r.ok) continue;
      const h = kind==='hiro' ? Number((await r.json()).burn_block_height) : parseInt(await r.text(),10);
      if(Number.isFinite(h) && h>0) return h;
    }catch(e){}
  }
  return null;
}
function setHeight(h, live){
  const prev=chain.height; chain.height=h; chain.live=live;
  try{ if(window.XAWorld) XAWorld.onHeight(h) }catch(e){}   // a scene can start at this block
  const day=Math.floor(h/BLOCKS_PER_DAY);
  if(day!==chain.day){ const first=chain.day<0; chain.day=day; applyDay(day+devDayOffset); if(!first && state==='walk') sfx.coin() }
  else if(h!==prev) repaintLivePosters();
  paintDayBoard();
}
async function pollChain(){ const h=await fetchHeight(); if(h) setHeight(h,true); else if(!chain.live) setHeight(estHeight(),false) }
function startChainClock(){ setHeight(estHeight(),false); pollChain(); setInterval(pollChain,60000) }

/* ---------- the centre screen ----------
   One 16:9 screen hung in the middle of the hall: the Bitcoin Day clock along the top, LATEST SCORERS from the score boards the
   hall already reads, a rotating feature (news / ads / messages from xtrata-screen-v1) and a ticker. All the drawing and the
   contract reader live in screen.js; this part only builds the panel, feeds it and repaints it. With no screen contract it is the
   clock plus the latest scorers. It replaces the old Bitcoin Day board in the same spot. */
let dayBoard=null;
const CENTRE_SCREEN={W:3.2, H:1.8, cy:3.15, z:RL/2-6, px:1280, py:720, gapMs:120, animGapMs:40};
function buildDayBoard(){
  const S=CENTRE_SCREEN, cv=mkCanvas(S.px,S.py), t=tex(cv), mat=new THREE.MeshBasicMaterial({map:t, toneMapped:false});
  const g=new THREE.Group(); g.position.set(0,S.cy,S.z); scene.add(g);
  const W=S.W, H=S.H;
  g.add(new THREE.Mesh(new THREE.BoxGeometry(W+.12,H+.12,.1), new THREE.MeshStandardMaterial({color:0x121118, metalness:.6, roughness:.4})));
  const front=new THREE.Mesh(new THREE.PlaneGeometry(W,H),mat); front.position.z=.052; g.add(front);
  const back=new THREE.Mesh(new THREE.PlaneGeometry(W,H),mat); back.position.z=-.052; back.rotation.y=Math.PI; g.add(back);
  const rodMat=new THREE.MeshStandardMaterial({color:0x2a2a33, metalness:.8, roughness:.3});
  for(const sx of [-1,1]){ const len=HH-(S.cy+H/2+.06); const rod=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,len,6),rodMat); rod.position.set(sx*(W/2-.25),H/2+.06+len/2,0); g.add(rod) }
  const edge=new THREE.Mesh(new THREE.BoxGeometry(W+.14,.025,.12), new THREE.MeshBasicMaterial({color:BTC_ORANGE, toneMapped:false})); edge.position.y=-(H/2+.07); g.add(edge);
  // no collider: its bottom edge (2.25 m) is above head height, so you walk under it
  dayBoard={cv, x:cv.getContext('2d'), tex:t, last:0, scorers:[], scorersAt:-1e9};
  paintDayBoard(true);
}
// Latest scorers: the newest top-10 entries across every board the hall has cached, whatever their age (the row shows how old), no extra reads.
function screenScorers(){
  const boards=[]; GAMES.forEach(g=>boardsFor(g).forEach(b=>{ const t=TOP[b.board]; if(t && t.entries && t.entries.length) boards.push({game:g.title, colour:g.color, mode:b.mode, entries:t.entries}) }));
  return window.XAScreen ? XAScreen.latestScorers(boards, chain.height, 0, fmtBoard, 8) : [];
}
function paintDayBoard(force){
  if(!dayBoard || chain.day<0) return;
  const now=performance.now();
  const gap=(window.XAScreen && XAScreen.animating && XAScreen.animating()) ? CENTRE_SCREEN.animGapMs : CENTRE_SCREEN.gapMs;   // a GIF or clip on show repaints at about 25 fps
  if(!force && now-dayBoard.last<gap) return;
  dayBoard.last=now;
  if(now-dayBoard.scorersAt>2000){ dayBoard.scorersAt=now; try{ dayBoard.scorers=screenScorers() }catch(e){ dayBoard.scorers=[] } }
  const d={height:chain.height, day:chain.day, live:chain.live, blocksPerDay:BLOCKS_PER_DAY, t:now/1000, scorers:dayBoard.scorers,
           items: window.XAScreen ? XAScreen.activeItems(XAScreen.items(), chain.height)   /* estimated height when the node is down, so a cached snapshot still expires */ : []};
  if(window.XAScreen) XAScreen.paint(dayBoard.x, CENTRE_SCREEN.px, CENTRE_SCREEN.py, d);
  else paintPlainClock(dayBoard.x, CENTRE_SCREEN.px, CENTRE_SCREEN.py, d);   // a release without screen.js: just the day clock
  dayBoard.tex.needsUpdate=true;
}
function paintPlainClock(x,W,H,d){
  const left=d.blocksPerDay-(d.height%d.blocksPerDay);
  x.save(); x.setTransform(1,0,0,1,0,0); x.fillStyle='#050408'; x.fillRect(0,0,W,H); x.textAlign='center'; x.textBaseline='alphabetic';
  x.font='60px Bungee, Impact, sans-serif'; x.fillStyle=BTC_ORANGE; x.fillText('BITCOIN DAY',W/2,H*.3);
  x.font='320px VT323, monospace'; x.fillStyle='#ffc53d'; x.fillText(String(d.day),W/2,H*.7);
  x.font='64px VT323, monospace'; x.fillStyle='#8fd3ff'; x.fillText((d.live?'':'≈')+'NEXT DAY IN '+left+' BLOCK'+(left===1?'':'S'),W/2,H*.9);
  x.restore();
}
// Per frame: the ticker and the rotation move, so repaint a few times a second while the screen is within sight.
function tickCentreScreen(){ if(dayBoard && Math.abs(player.z-CENTRE_SCREEN.z)<11) paintDayBoard(); else if(window.XAScreen && XAScreen.idle) XAScreen.idle() }   // far from the screen: clips pause


/* ==================== TEMPORARY DEV OVERRIDE — REMOVE BEFORE RELEASE ====================
   Lets you preview the poster rotation without waiting for real Bitcoin days.
     Alt+Shift+.  (>)   next day's posters
     Alt+Shift+,  (<)   previous day's posters
     Alt+Shift+0        back to today's (live) posters
     Alt+Shift+A        put the animated poster in the wall slot nearest to you
     Alt+Shift+P        cycle the playable on-chain posters into the nearest wall slot
   To remove: delete this block and set devDayOffset back to a plain 0 (or remove its use in setHeight). */
const DEV_POSTER_KEYS=false;
var devDayOffset=0, devPlayIdx=-1;
function devToast(msg){
  let el=document.getElementById('devtoast');
  if(!el){ el=document.createElement('div'); el.id='devtoast';
    el.style.cssText='position:fixed;left:50%;top:calc(56px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:40;padding:8px 14px;border-radius:6px;background:rgba(20,16,34,.92);border:1px solid #ff3fa4;color:#fff;font:18px VT323,monospace;letter-spacing:.05em;pointer-events:none';
    document.body.appendChild(el) }
  el.textContent='DEV · '+msg; el.style.opacity=1; clearTimeout(el._t); el._t=setTimeout(()=>{ el.style.opacity=0 },2200);
}
if(DEV_POSTER_KEYS) addEventListener('keydown', e=>{
  if(!(e.altKey && e.shiftKey) || chain.day<0) return;
  const c=e.code;
  if(c==='Period') devDayOffset++;
  else if(c==='Comma') devDayOffset--;
  else if(c==='Digit0') devDayOffset=0;
  else if(c==='KeyA'){
    let best=null, bd=1e9; for(const sl of posterSlots){ const d=Math.hypot(sl.pos.x-player.x, sl.pos.z-player.z); if(d<bd){ bd=d; best=sl } }
    e.preventDefault(); e.stopImmediatePropagation();
    if(best){ best.drawn=false; paintPoster(best, ANIM_POSTER); devToast('animated poster in the nearest slot') }
    return;
  } else if(c==='KeyP'){
    let best=null, bd=1e9; for(const sl of posterSlots){ const d=Math.hypot(sl.pos.x-player.x, sl.pos.z-player.z); if(d<bd){ bd=d; best=sl } }
    e.preventDefault(); e.stopImmediatePropagation();
    devPlayIdx=(devPlayIdx+1)%POSTERS_PLAY.length;
    if(best){ best.drawn=false; paintPoster(best, POSTERS_PLAY[devPlayIdx]); devToast('playable poster "'+POSTERS_PLAY[devPlayIdx].head+'" in the nearest slot') }
    return;
  } else return;
  e.preventDefault(); e.stopImmediatePropagation();
  const d=chain.day+devDayOffset; applyDay(d);
  devToast('posters for day '+d+(devDayOffset?' ('+(devDayOffset>0?'+':'')+devDayOffset+')':' (live)')+' · '+chain.fresh+' changed');
}, true);
/* ================================ END TEMPORARY DEV OVERRIDE ================================ */

/* ================================================================
   PLAYABLE POSTERS: face one that carries a `play` block, press E (or click / tap) and the real
   inscription opens in a panel, served from the chain. Esc or CLOSE returns to the hall.
   ================================================================ */
let chainOpen=false, posterFocus=null;
const posterMeshes=[];
const pray=new THREE.Raycaster(); pray.far=5;
function posterAt(v){
  if(!posterMeshes.length) return null;
  pray.setFromCamera(v,camera);
  const h=pray.intersectObjects(posterMeshes,false).find(x=>x.object.parent && x.object.parent.visible);
  const s=h && h.object.userData.slot;
  return s && s.spec && s.spec.play ? s : null;
}
function updatePosterFocus(){
  const s=state==='walk' && !chainOpen ? posterAt(center) : null;
  if(s!==posterFocus){ posterFocus=s; updateHud() }
}
function chainUrl(id){ return XTRATA_BASE+'/i/'+id }
function loadChainFrame(url){ const f=$('cpf'); f.src='about:blank'; setTimeout(()=>{ f.src=url }, 30); $('cpo').href=url }
function openChain(play){
  if(!play || chainOpen || state!=='walk') return;
  if(play.playlist && !play.tracks){   // a playlist poster: the track list is a small JSON inscription
    const pl=play; fetch(XTRATA_BASE+'/i/'+pl.playlist+'?raw=1').then(r=>r.ok?r.json():Promise.reject()).then(j=>{
      const t=Array.isArray(j.tracks) ? j.tracks.filter(x=>Array.isArray(x) && Number.isInteger(x[0]) && x[0]>0 && typeof x[1]==='string').slice(0,40).map(x=>[x[0],x[1].slice(0,60)]) : [];
      if(t.length) pl.tracks=t;
    }).catch(()=>{}).then(()=>{ if(pl.tracks) openChain(pl) });
    return;
  }
  if(!play.tracks && !play.path && !play.id) return;
  chainOpen=true; if(document.pointerLockElement) document.exitPointerLock();
  try{ Room.pause() }catch(e){}
  $('cpt').textContent=play.title; $('cpn').textContent=play.note||'';
  const tl=$('cptracks'); tl.innerHTML='';
  if(play.tracks){
    tl.hidden=false;
    play.tracks.forEach(([id,name],i)=>{
      const b=document.createElement('button'); b.type='button'; b.textContent=(i+1)+'. '+name; b.dataset.id=id;
      b.addEventListener('click',()=>{ for(const o of tl.children) o.classList.toggle('on',o===b); loadChainFrame(chainUrl(id)) });
      tl.appendChild(b);
    });
    tl.firstChild.classList.add('on'); loadChainFrame(chainUrl(play.tracks[0][0]));
  } else { tl.hidden=true; loadChainFrame(play.path ? XTRATA_BASE+play.path : chainUrl(play.id)) }
  $('chainp').hidden=false; updateHud();
  const c=$('cpx'); if(c) c.focus({preventScroll:true});
}
function closeChain(){
  if(!chainOpen) return;
  chainOpen=false; $('chainp').hidden=true; $('cpf').src='about:blank';
  try{ Room.resume() }catch(e){}
  updateHud(); tryLock();
}
$('cpx').addEventListener('click', closeChain);
addEventListener('keydown', e=>{ if(chainOpen && e.code==='Escape'){ e.preventDefault(); e.stopPropagation(); closeChain() } }, true);
$('chainp').addEventListener('click', e=>{ if(e.target===$('chainp')) closeChain() });
/* ================================================================
   RADIO DOCK: music is part of the hall's own frame, so it is there in the hall, the lobby and every room.
   One small button (bottom left). It opens Xtrata Radio (radio.xtrata.xyz/radio, the one origin the listening wallet trusts) in a panel:
   free listening for everyone, and a holder unlocks their passkey wallet there to play the albums they hold. The panel is only HIDDEN when
   you close it, never taken down, so an album keeps playing while you walk, play a game or go through a door. Nothing here touches money or
   keys: the radio app does all of that in its own page. A room cannot see or reach this panel (rooms run in their own sandboxed frames).
   ================================================================ */
const RADIO_URL='https://radio.xtrata.xyz/radio';
let radioOpen=false, radioLoaded=false;
function radioPaint(){   // the button is there while you can walk or are in a room; games take the whole screen, so it steps aside (the music goes on)
  const b=$('xa-radio-btn'); if(!b) return;
  const show=(state==='walk' || state==='room') && !chainOpen;
  if(b.hidden===show) b.hidden=!show;
  b.classList.toggle('on',radioOpen);
}
function radioShow(){
  if(radioOpen || chainOpen) return;
  radioOpen=true;
  if(document.pointerLockElement) document.exitPointerLock();
  for(const k in keys) keys[k]=false;
  const f=$('xa-radio-frame'), box=$('xa-radio');
  if(!radioLoaded){   // the radio is loaded the first time it is asked for, not when the hall starts
    radioLoaded=true; $('xa-radio-open').href=RADIO_URL;
    f.setAttribute('allow','autoplay; fullscreen; clipboard-write; publickey-credentials-get https://radio.xtrata.xyz; publickey-credentials-create https://radio.xtrata.xyz');   // passkeys, to the radio's origin only (set with the address, so the empty frame does not name an origin it is not on)
    f.src=RADIO_URL;
    try{ if(Room.isOn()){ Room.toggle(); paintRoom() } }catch(e){}   // the machines' own music steps aside for the radio (the music button brings it back)
  }
  box.classList.remove('away'); box.removeAttribute('inert'); box.setAttribute('aria-hidden','false');
  radioPaint(); try{ $('xa-radio-hide').focus({preventScroll:true}) }catch(e){}
}
function radioHide(){
  if(!radioOpen) return;
  radioOpen=false;
  const box=$('xa-radio'); box.classList.add('away'); box.setAttribute('inert',''); box.setAttribute('aria-hidden','true');
  try{ document.activeElement && document.activeElement.blur && document.activeElement.blur() }catch(e){}
  radioPaint(); if(state==='walk') tryLock(); else if(state==='room' && roomUI && roomUI.frame){ try{ roomUI.frame.focus() }catch(e){} }
}
$('xa-radio-btn').addEventListener('click', ()=>{ initAudio(); radioOpen ? radioHide() : radioShow() });
$('xa-radio-hide').addEventListener('click', radioHide);
$('xa-radio').addEventListener('click', e=>{ if(e.target===$('xa-radio')) radioHide() });
addEventListener('keydown', e=>{ if(radioOpen && e.code==='Escape'){ e.preventDefault(); e.stopPropagation(); radioHide() } }, true);
setInterval(radioPaint, 400);   // (not called here: `state` is declared further down)
if(window.XA_TEST) XA.startGame=(i)=>startGame(i), XA.hallState=()=>state;   // tests only
if(window.XA_TEST) XA.radioState=()=>({open:radioOpen, loaded:radioLoaded, src:$('xa-radio-frame').getAttribute('src'), shown:!$('xa-radio-btn').hidden, away:$('xa-radio').classList.contains('away'), sandbox:$('xa-radio-frame').getAttribute('sandbox'), allow:$('xa-radio-frame').getAttribute('allow')});   // read-only, for tests
/* ================================================================
   CABINETS — one generator, ten configs
   ================================================================ */
const CAB_DEFAULTS = {w:.8, depth:.72, kick:.8, cp:.2, cpBack:.16, cpRise:.09, tilt:16, screenH:.54,
  overhang:.15, mH:.26, mLean:0, roof:'flat', back:'straight', body:'#222', trim:'#ff3d9a', panel:'#16131f',
  start:'#ffc53d', art:'stripes', a:'#ff3d9a', b:'#3be4ff'};

function sideArt(kind, body, a, b, seed){
  const S=512, c=mkCanvas(S,S), x=c.getContext('2d'), R=rng(seed+11);
  x.fillStyle=body; x.fillRect(0,0,S,S); x.lineCap='round'; x.lineJoin='round';
  switch(kind){
    case 'stripes': x.save(); x.translate(S*.45,S*.6); x.rotate(-.55);
      [[a,-70,44],[b,-12,20],[a,22,10]].forEach(([c2,y,h])=>{x.fillStyle=c2;x.fillRect(-S,y,S*2,h)}); x.restore(); break;
    case 'sunset': { const g=x.createLinearGradient(0,120,0,330); g.addColorStop(0,a); g.addColorStop(1,b);
      x.fillStyle=g; x.beginPath(); x.arc(S*.38,300,130,Math.PI,0); x.fill();
      x.fillStyle=body; for(let i=0;i<6;i++) x.fillRect(0,300-i*20-i*i*1.5,S,4+i*1.2);
      x.strokeStyle=a; x.lineWidth=3; for(let i=0;i<7;i++){const y=320+i*i*6; x.beginPath(); x.moveTo(0,y); x.lineTo(S,y); x.stroke()} break; }
    case 'grid': x.strokeStyle=a; x.lineWidth=3; const hy=200;
      for(let i=-8;i<=8;i++){x.beginPath(); x.moveTo(S*.4,hy); x.lineTo(S*.4+i*90,S); x.stroke()}
      for(let i=0;i<9;i++){const y=hy+Math.pow(i/8,2)*(S-hy); x.beginPath(); x.moveTo(0,y); x.lineTo(S,y); x.stroke()}
      x.fillStyle=b; x.fillRect(0,hy-60,S,8); break;
    case 'bolts': for(let k=0;k<3;k++){ x.strokeStyle=k===1?b:a; x.lineWidth=k===1?10:18; x.beginPath();
      let px=60+k*110, py=40; x.moveTo(px,py); while(py<S){px+= (R()>.5?1:-1)*40; py+=50+R()*30; x.lineTo(px,py)} x.stroke() } break;
    case 'checker': { const s=32; for(let r=0;r<3;r++) for(let q=0;q<16;q++){ x.fillStyle=(r+q)%2?a:b; x.fillRect(q*s,300+r*s,s,s)}
      x.fillStyle=a; x.fillRect(0,280,S,10); x.fillRect(0,396,S,10); break; }
    case 'stars': for(let i=0;i<160;i++){x.fillStyle=R()>.8?b:'#ffffff'; x.globalAlpha=.4+R()*.6; const r=R()*2.2+.5; x.beginPath(); x.arc(R()*S,R()*S,r,0,6.28); x.fill()}
      x.globalAlpha=1; x.fillStyle=a; x.beginPath(); x.arc(S*.34,250,70,0,6.28); x.fill();
      x.strokeStyle=b; x.lineWidth=8; x.beginPath(); x.ellipse(S*.34,250,130,26,-.3,0,6.28); x.stroke(); break;
    case 'waves': for(let k=0;k<6;k++){ x.strokeStyle=k%2?b:a; x.lineWidth=16; x.beginPath();
      for(let px=0;px<=S;px+=8){const y=170+k*42+Math.sin(px/48+k)*22; px?x.lineTo(px,y):x.moveTo(px,y)} x.stroke() } break;
    case 'chevrons': for(let k=0;k<7;k++){ x.strokeStyle=k%2?b:a; x.lineWidth=18; x.beginPath();
      const y=140+k*48; x.moveTo(20,y); x.lineTo(S*.35,y+60); x.lineTo(S*.7,y); x.stroke() } break;
    case 'blocks': { const s=36; const T=[[[0,0],[1,0],[2,0],[1,1]],[[0,0],[0,1],[1,1],[2,1]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[3,0]],[[1,0],[2,0],[0,1],[1,1]]];
      for(let i=0;i<9;i++){ const t=T[i%5], ox=Math.floor(R()*10)*s, oy=120+Math.floor(R()*8)*s; x.fillStyle=i%3?a:b;
        for(const [q,r] of t){x.fillRect(ox+q*s+2,oy+r*s+2,s-4,s-4)} } break; }
    case 'dots': for(let r=0;r<22;r++) for(let q=0;q<22;q++){ const rad=(r/22)*11; if(rad<1) continue;
      x.fillStyle=(q+r)%7===0?b:a; x.beginPath(); x.arc(q*24+12,r*24+12,rad,0,6.28); x.fill() } break;
  }
  return tex(c);
}

function marqueeTexture(title, c){
  const W=512, H=128, cv=mkCanvas(W,H), x=cv.getContext('2d');
  const g=x.createLinearGradient(0,0,W,0); g.addColorStop(0,'#0a0812'); g.addColorStop(.5,c.body); g.addColorStop(1,'#0a0812');
  x.fillStyle=g; x.fillRect(0,0,W,H);
  x.fillStyle=c.trim; x.fillRect(0,6,W,4); x.fillRect(0,H-10,W,4);
  let size=66; x.font=size+'px Bungee, Impact, sans-serif';
  while(x.measureText(title).width>W*.7){size-=2; x.font=size+'px Bungee, Impact, sans-serif'}
  x.textAlign='center'; x.textBaseline='middle';
  x.shadowColor=c.trim; x.shadowBlur=22; x.fillStyle='#ffffff'; x.fillText(title,W/2,H/2+3);
  x.shadowBlur=0; x.lineWidth=2; x.strokeStyle=c.trim; x.strokeText(title,W/2,H/2+3);
  drawLogo(x,46,H/2,58,3,8); drawLogo(x,W-46,H/2,58,3,8);
  return tex(cv);
}

function panelTexture(c){
  const cv=mkCanvas(256,128), x=cv.getContext('2d');
  x.fillStyle=c.panel; x.fillRect(0,0,256,128);
  x.strokeStyle=c.trim; x.globalAlpha=.6; x.lineWidth=3; x.strokeRect(6,6,244,116); x.globalAlpha=1;
  x.fillStyle=c.start; x.font='16px Bungee, Impact, sans-serif'; x.textAlign='center'; x.fillText('START',203,112);
  x.fillStyle='rgba(255,255,255,.5)'; x.font='13px Bungee, Impact, sans-serif'; x.fillText('1 PLAYER',203,22);
  return tex(cv);
}

// Put a plane flush on a profile segment p→q (points are [z,y] in cabinet-local space)
let _lpm=null;
function logoPlateMat(){ if(_lpm) return _lpm; const cv=mkCanvas(128,128), x=cv.getContext('2d');
  x.fillStyle='#0b0b10'; x.fillRect(0,0,128,128); drawLogo(x,64,64,100,4,6);
  return _lpm=new THREE.MeshBasicMaterial({map:tex(cv), toneMapped:false}) }
function onSegment(mesh, p, q, out){
  const dz=q[0]-p[0], dy=q[1]-p[1], L=Math.hypot(dz,dy), ux=dz/L, uy=dy/L;
  const nz=uy, ny=-ux;               // outward normal (forward side)
  mesh.position.set(0, (p[1]+q[1])/2 + ny*out, (p[0]+q[0])/2 + nz*out);
  mesh.rotation.x = -Math.atan2(-ux, uy);
  return {len:L, n:[nz,ny]};
}

/* skins: one Image per data URI, a Texture per use so each can carry its own crop (repeat/offset) */
const _skinImgs={};
function skinTex(src){
  let img=_skinImgs[src]; if(!img){ img=new Image(); img.src=src; _skinImgs[src]=img }
  const t=new THREE.Texture(img); t.encoding=THREE.sRGBEncoding; t.anisotropy=4;
  if(img.complete && img.naturalWidth) t.needsUpdate=true; else img.addEventListener('load',()=>{ t.needsUpdate=true },{once:true});
  return t;
}
function skinMat(t, glow){ return new THREE.MeshStandardMaterial({map:t, emissive:0xffffff, emissiveMap:t, emissiveIntensity:glow==null?.35:glow, roughness:.55}) }
function buildCabinet(game, i){
  const c = Object.assign({}, CAB_DEFAULTS, game.cabinet);
  const D=c.depth, t=THREE.MathUtils.degToRad(c.tilt), lean=THREE.MathUtils.degToRad(c.mLean);
  // side profile, z forward / y up
  const A=[0,0], B=[D,0], C=[D,c.kick], Dp=[D+c.cp,c.kick+.06], Dl=[D+c.cp,c.kick+.12];
  const E=[D-c.cpBack, c.kick+.12+c.cpRise];
  const F=[E[0]-c.screenH*Math.sin(t), E[1]+c.screenH*Math.cos(t)];
  const G=[F[0]+c.overhang, F[1]];
  const Hm=[G[0]+c.mH*Math.sin(lean), G[1]+c.mH*Math.cos(lean)];
  const top=Hm[1], endZ = c.back==='slant' ? .2 : c.back==='hump' ? .06 : 0;

  const s=new THREE.Shape(); s.moveTo(...A);
  for(const p of [B,C,Dp,Dl,E,F,G,Hm]) s.lineTo(...p);
  let endY=top;
  if(c.roof==='slope'){endY=top+.14; s.lineTo(endZ,endY)}
  else if(c.roof==='curve'){s.quadraticCurveTo((Hm[0]+endZ)/2, top+.2, endZ, top)}
  else if(c.roof==='peak'){s.lineTo(Hm[0]*.45, top+.1); endY=top-.03; s.lineTo(endZ,endY)}
  else s.lineTo(endZ,top);
  if(c.back==='hump') s.quadraticCurveTo(-.26, endY*.72, 0, endY*.34);
  else if(c.back==='slant') s.lineTo(0, endY*.5);

  const geo=new THREE.ExtrudeGeometry(s,{depth:c.w, bevelEnabled:false, curveSegments:10});
  geo.rotateY(-Math.PI/2); geo.translate(c.w/2,0,0);
  const art=sideArt(c.art, c.body, c.a, c.b, i); art.wrapS=art.wrapT=THREE.RepeatWrapping; art.repeat.set(1/1.2, 1/2.15);
  const bodyMat=new THREE.MeshStandardMaterial({color:c.body, roughness:.5, metalness:.1});
  const artMat=new THREE.MeshStandardMaterial({map:art, roughness:.55});
  const group=new THREE.Group();
  const skin=game.skin, lay=skin && SKIN_LAYOUT[game.shape];
  // front-strip crop for one panel (template mm → texture repeat/offset)
  const skinRegion = lay ? name=>{ const fr=lay.front, p=fr.panels[name], t=skinTex(skin.front);
    t.repeat.set(c.w*1000/fr.W, p[1]/fr.H); t.offset.set(SKIN_BLEED/fr.W, 1-(p[0]+p[1])/fr.H); return t } : null;
  if(lay){
    // cap UVs are profile metres (u=z, v=y): map them onto the side templates.
    // first half of the cap group = +x face = the machine's RIGHT side (template drawn front-left, so u runs backwards)
    const sd=lay.sides[game.variant];
    const side=(src,mirror)=>{ const t=skinTex(src);
      t.repeat.set((mirror?-1:1)*1000/sd.W, 1000/sd.H);
      t.offset.set(mirror ? (SKIN_BLEED+sd.zmax*1000)/sd.W : (SKIN_BLEED-sd.zmin*1000)/sd.W, 1-(SKIN_BLEED+sd.ymax*1000)/sd.H);
      return skinMat(t) };
    const [caps, walls]=geo.groups.map(g=>({...g})), half=caps.count/2;
    geo.clearGroups(); geo.addGroup(caps.start, half, 0); geo.addGroup(caps.start+half, half, 2); geo.addGroup(walls.start, walls.count, 1);
    group.add(new THREE.Mesh(geo,[side(skin.right,true), bodyMat, side(skin.left,false)]));
    // front panels, each a crop of the unfolded front strip
    const face=(name,P,Q)=>{ const len=Math.hypot(Q[0]-P[0],Q[1]-P[1]); if(len<.005) return;
      const m=new THREE.Mesh(new THREE.PlaneGeometry(c.w, len), skinMat(skinRegion(name), .3)); onSegment(m,P,Q,.002); group.add(m) };
    face('KICK PANEL',B,C); face('LIP',C,Dp); face('LIP FACE',Dp,Dl); face('SCREEN SURROUND',E,F); face('MARQUEE UNDERSIDE',F,G);
  } else group.add(new THREE.Mesh(geo,[artMat,bodyMat]));

  // T-molding glow along both side edges
  const pts=s.getPoints(8); if(pts[0].distanceTo(pts[pts.length-1])<1e-4) pts.pop();
  const trimMat=new THREE.MeshBasicMaterial({color:c.trim, toneMapped:false});
  for(const sx of [-1,1]){
    const path=new THREE.CurvePath(), X=sx*(c.w/2+.004);
    for(let k=0;k<pts.length;k++){const p=pts[k], q=pts[(k+1)%pts.length];
      path.add(new THREE.LineCurve3(new THREE.Vector3(X,p.y,p.x), new THREE.Vector3(X,q.y,q.x)))}
    group.add(new THREE.Mesh(new THREE.TubeGeometry(path, pts.length*3, .011, 6, true), trimMat));
  }

  // bezel + screen
  const bezel=new THREE.Mesh(new THREE.PlaneGeometry(c.w*.9, c.screenH*.97), new THREE.MeshStandardMaterial({color:0x050508, roughness:.3}));
  onSegment(bezel,E,F,.004); group.add(bezel);
  const sw=c.w*.76, sh=Math.min(c.screenH*.84, sw*.78);
  const sc=mkCanvas(256,192), sctx=sc.getContext('2d'), stex=tex(sc);
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(sw,sh), new THREE.MeshBasicMaterial({map:stex, toneMapped:false}));
  const seg=onSegment(screen,E,F,.009); group.add(screen);

  // marquee
  const mq=new THREE.Mesh(new THREE.PlaneGeometry(c.w*.94, c.mH*.84), new THREE.MeshBasicMaterial({map:lay ? skinTex(skin.banner) : marqueeTexture(game.title,c), toneMapped:false}));
  onSegment(mq,G,Hm,.006); group.add(mq);

  // control panel
  const cpLen=Math.hypot(Dl[0]-E[0], Dl[1]-E[1]);
  const cpG=new THREE.Group(); cpG.position.set(0,(Dl[1]+E[1])/2,(Dl[0]+E[0])/2);
  cpG.rotation.x=Math.atan2(E[1]-Dl[1], Dl[0]-E[0]); group.add(cpG);
  const top2=new THREE.Mesh(new THREE.PlaneGeometry(c.w*.98, cpLen*.98), (lay ? skinMat(skinRegion('CONTROL PANEL'), .3) : new THREE.MeshStandardMaterial({map:panelTexture(c), roughness:.6})));
  top2.rotation.x=-Math.PI/2; top2.position.y=.003; cpG.add(top2);
  const dark=new THREE.MeshStandardMaterial({color:0x0b0b0e, roughness:.4});
  const jx=-c.w*.28;
  const jb=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.012,20),dark); jb.position.set(jx,.006,0); cpG.add(jb);
  const js=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.09,8), new THREE.MeshStandardMaterial({color:0xbbbbbb, metalness:.8, roughness:.3})); js.position.set(jx,.05,0); cpG.add(js);
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.028,16,12), new THREE.MeshStandardMaterial({color:c.a, roughness:.35})); ball.position.set(jx,.1,0); cpG.add(ball);
  [c.a,c.b,'#eeeeee'].forEach((col,k)=>{
    const bt=new THREE.Mesh(new THREE.CylinderGeometry(.021,.021,.02,18), new THREE.MeshStandardMaterial({color:col, roughness:.35}));
    bt.position.set(-c.w*.06+k*.075, .01, k===1?-.03:0); cpG.add(bt);
  });
  const sx=c.w*.28;
  const ring=new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,.01,24),dark); ring.position.set(sx,.005,-.01); cpG.add(ring);
  const startMat=new THREE.MeshStandardMaterial({color:c.start, emissive:c.start, emissiveIntensity:.4, roughness:.3});
  const startBtn=new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,.024,24), startMat); startBtn.position.set(sx,.016,-.01); cpG.add(startBtn);

  // coin door
  // skinned machines keep the whole kick panel for art: the coin slots move to the angled lip under the controls
  const slotMat=new THREE.MeshBasicMaterial({color:0xff7a1a, toneMapped:false});
  if(lay){
    const plateM=new THREE.Mesh(new THREE.PlaneGeometry(.2,.1), new THREE.MeshStandardMaterial({color:0x1c1c22, metalness:.6, roughness:.35}));
    onSegment(plateM,C,Dp,.004); group.add(plateM);
    for(const ox of [-.045,.045]){ const sl=new THREE.Mesh(new THREE.PlaneGeometry(.03,.05),slotMat); onSegment(sl,C,Dp,.006); sl.position.x=ox; group.add(sl) }
  } else {
    const door=new THREE.Mesh(new THREE.PlaneGeometry(.22,.3), new THREE.MeshStandardMaterial({color:0x1c1c22, metalness:.6, roughness:.35}));
    door.position.set(0,c.kick*.5,D+.004); group.add(door);
    const plate=new THREE.Mesh(new THREE.PlaneGeometry(.15,.15), logoPlateMat()); plate.position.set(0,c.kick*.5+.26,D+.004); group.add(plate);
    for(const ox of [-.05,.05]){const sl=new THREE.Mesh(new THREE.PlaneGeometry(.035,.05),slotMat); sl.position.set(ox,c.kick*.5+.07,D+.006); group.add(sl)}
  }

  // screen glow on the floor / player
  const n=seg.n, scy=(E[1]+F[1])/2, scz=(E[0]+F[0])/2;
  const glow=new THREE.Mesh(new THREE.PlaneGeometry(c.w*1.9,1.25), new THREE.MeshBasicMaterial({map:glowTex(), color:game.color, transparent:true, opacity:.5, blending:THREE.AdditiveBlending, depthWrite:false, toneMapped:false}));
  glow.rotation.x=-Math.PI/2; glow.position.set(0,.006,D+.5); glow.renderOrder=1;

  group.traverse(o=>{ if(o.isMesh){ o.userData.cab=i; pickables.push(o) } });
  return {i, game, cfg:c, group, glow, screen, sw, sh, sctx, stex, startBtn, startMat, frontLocal:new THREE.Vector3(0,0,D+c.cp+.1), press:-1, fails:0};
}

function cabZ(k,n){ return (n-1)*GAP/2 - k*GAP }
let _glow=null;
function glowTex(){ if(_glow) return _glow; const c=mkCanvas(128,128), x=c.getContext('2d');
  const g=x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,255,255,.9)'); g.addColorStop(.45,'rgba(255,255,255,.3)'); g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g; x.fillRect(0,0,128,128); return _glow=new THREE.CanvasTexture(c) }
function placeCabinets(){
  GAMES.forEach((g,i)=>{
    const m=buildCabinet(g,i), left=SIDE_OF[i]<0, z=cabZ(SLOT_OF[i], left?NL:NR);
    m.group.position.set(left ? -RW/2+.16 : RW/2-.16, 0, z);
    m.group.rotation.y = left ? Math.PI/2 : -Math.PI/2;
    scene.add(m.group); m.group.updateMatrixWorld(true);
    boxes.push(new THREE.Box3().setFromObject(m.group));
    m.group.add(m.glow);                       // after the collision box, so the floor glow isn't solid
    m.front=m.frontLocal.clone().applyMatrix4(m.group.matrixWorld);
    m.audioPos=new THREE.Vector3(); m.screen.getWorldPosition(m.audioPos); m.audioDir=new THREE.Vector3(left?1:-1,0,0);   // the machine's speaker
    machines.push(m);
  });
}

/* ---------- idle screens: attract loop, then the on-chain Top 10 over it ----------
   Every idle cabinet cycles: its game's attract loop, then each of its boards'
   Top 10 drawn over the still-running attract (so the game stays visible), then
   the loop again. Neighbouring machines are staggered. The #1 name stays in a
   strip along the top during the attract loop, so a leader is always on show.
   Boards with no entries are skipped; a board that failed to load is skipped
   too (never shown as "empty"). Tune here: */
const SCREEN_BOARD = {
  attractSecs: 7,     // attract loop on its own
  boardSecs: 6,       // each Top 10 (the main board, then any timed variant)
  veil: 0.62,         // darkness behind the Top 10 (0 = see-through, 1 = solid)
  leaderStrip: true,  // "#1 NAME SCORE" along the top during the attract loop
  stagger: 1.7,       // seconds between neighbouring machines' cycles
  refreshSecs: 180,   // re-read each board this often
  fetchGapSecs: 1.2   // spacing between board reads (stays polite to the API)
};
const TOP = {};                        // board id -> { ok, entries, at }
let feedStarted = false;
function boardsFor(g){
  const R = XA && XA.replay, def = g.def;
  if(!R || !R.boardFor) return [];
  const list = [{ board: R.boardFor(def, def.mode), mode: def.mode, label: 'TOP 10' }];
  (def.variants || []).forEach(v => { if(v.mode !== def.mode) list.push({ board: R.boardFor(def, v.mode), mode: v.mode, label: String(v.label || v.key).toUpperCase() + ' TOP 10' }) });
  return list;
}
function startBoardFeed(){
  if(feedStarted || !XAScores || !XAScores.getTop10) return; feedStarted = true;
  const queue = []; GAMES.forEach(g => boardsFor(g).forEach(b => queue.push(b)));
  let k = 0;
  const next = () => {
    const b = queue[k++ % queue.length];
    XAScores.getTop10(b.board, b.mode).then(r => { if(r && r.ok) TOP[b.board] = { ok: true, entries: r.entries || [], at: Date.now() } }).catch(() => {});
    const gap = k < queue.length ? SCREEN_BOARD.fetchGapSecs : Math.max(SCREEN_BOARD.fetchGapSecs, SCREEN_BOARD.refreshSecs / queue.length);
    setTimeout(next, gap * 1000);
  };
  if(queue.length) next();
}
function fmtBoard(mode, v){
  v = Math.max(0, Math.round(Number(v) || 0));
  if(mode !== 'time') return XA && XA.util && XA.util.fmt ? XA.util.fmt(v) : String(v);
  const mm = Math.floor(v / 6000), ss = Math.floor(v / 100) % 60, cs = v % 100;
  return (mm ? mm + ':' + (ss < 10 ? '0' : '') : '') + ss + '.' + (cs < 10 ? '0' : '') + cs + (mm ? '' : 's');
}
// What a machine's screen shows at time t: { kind:'attract' } or { kind:'board', b, top }.
function screenPhase(m, t){
  const shown = boardsFor(m.game).map(b => ({ b, top: TOP[b.board] })).filter(x => x.top && x.top.entries.length);
  if(!shown.length) return { kind: 'attract', leader: null };
  const cyc = SCREEN_BOARD.attractSecs + shown.length * SCREEN_BOARD.boardSecs;
  const u = ((t + m.i * SCREEN_BOARD.stagger) % cyc + cyc) % cyc;
  const lead = shown[0];
  if(u < SCREEN_BOARD.attractSecs) return { kind: 'attract', leader: lead };
  return Object.assign({ kind: 'board' }, shown[Math.min(shown.length - 1, Math.floor((u - SCREEN_BOARD.attractSecs) / SCREEN_BOARD.boardSecs))]);
}
function drawLeader(x, W, lead, col){
  const e = lead.top.entries[0];
  x.fillStyle = 'rgba(3,2,10,.62)'; x.fillRect(0, 0, W, 20);
  x.font = '17px VT323, monospace'; x.textBaseline = 'middle';
  x.textAlign = 'left'; x.fillStyle = col; x.fillText('#1', 6, 11);
  x.fillStyle = '#fff'; x.fillText(String(e.name).slice(0, 12), 28, 11);
  x.textAlign = 'right'; x.fillStyle = '#ffc53d'; x.fillText(fmtBoard(lead.b.mode, e.score), W - 6, 11);
}
function drawBoard(x, W, H, ph, col){
  x.fillStyle = 'rgba(3,2,10,' + SCREEN_BOARD.veil + ')'; x.fillRect(0, 0, W, H);
  x.textBaseline = 'middle'; x.textAlign = 'center';
  x.font = '21px VT323, monospace'; x.shadowColor = col; x.shadowBlur = 8; x.fillStyle = '#fff';
  x.fillText(ph.b.label, W / 2, 13); x.shadowBlur = 0;
  x.fillStyle = col; x.fillRect(W * .18, 25, W * .64, 1);
  const rows = ph.top.entries.slice(0, 10), top = 32, rh = (H - top - 6) / 10;
  x.font = '17px VT323, monospace';
  rows.forEach((e, i) => {
    const y = top + rh * i + rh / 2;
    if(i === 0){ x.fillStyle = 'rgba(255,197,61,.14)'; x.fillRect(4, y - rh / 2, W - 8, rh) }
    x.textAlign = 'right'; x.fillStyle = i === 0 ? '#ffc53d' : col; x.fillText(String(i + 1), 26, y);
    x.textAlign = 'left'; x.fillStyle = i === 0 ? '#fff' : '#e6e1ff'; x.fillText(String(e.name).slice(0, 12), 34, y);
    x.textAlign = 'right'; x.fillStyle = i === 0 ? '#ffc53d' : '#bfb8e6'; x.fillText(fmtBoard(ph.b.mode, e.score), W - 8, y);
  });
}
/* ---------- attract mode: each screen runs its own cartridge's attract() ---------- */
let _scan=null;
function scanOverlay(){ if(_scan) return _scan; const c=mkCanvas(256,192), x=c.getContext('2d');
  x.fillStyle='rgba(0,0,0,.22)'; for(let y=0;y<192;y+=3) x.fillRect(0,y,256,1);
  const v=x.createRadialGradient(128,96,192*.4,128,96,192*.85); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.55)');
  x.fillStyle=v; x.fillRect(0,0,256,192); return _scan=c }
function drawAttract(m, t){
  const x=m.sctx, W=256, H=192, col=m.game.color, on=focusIdx===m.i;
  x.save(); x.setTransform(1,0,0,1,0,0); x.globalAlpha=1; x.globalCompositeOperation='source-over';
  x.fillStyle='#03020a'; x.fillRect(0,0,W,H);
  if(m.fails<3){ try{ m.game.def.attract(x,W,H,t) }catch(e){ m.fails++ } }
  x.restore();
  x.save(); x.setTransform(1,0,0,1,0,0); x.globalAlpha=1; x.shadowBlur=0; x.textAlign='center'; x.textBaseline='middle';
  if(m.fails>=3){ x.font='34px VT323, monospace'; x.shadowColor=col; x.shadowBlur=12; x.fillStyle='#fff'; x.fillText(m.game.title,W/2,80); x.shadowBlur=0 }
  // real clock: the rotation keeps time even when frames drop
  const ph=screenPhase(m,performance.now()/1000); m.phase=ph.kind; m.phaseBoard=ph.kind==='board'?ph.b.board:null;
  if(ph.kind==='board'){ x.save(); drawBoard(x,W,H,ph,col); x.restore(); x.textAlign='center'; x.textBaseline='middle' }
  else if(SCREEN_BOARD.leaderStrip && ph.leader){ x.save(); drawLeader(x,W,ph.leader,col); x.restore(); x.textAlign='center'; x.textBaseline='middle' }
  if(on || (ph.kind!=='board' && Math.floor(t*1.8+m.i*.37)%2===0)){
    x.fillStyle='rgba(3,2,10,.7)'; x.fillRect(0,H-28,W,28);
    x.font='22px VT323, monospace'; x.fillStyle=on?'#ffc53d':'#f3eeff'; x.fillText(on?'▶ PRESS START':'PRESS START',W/2,H-14);
  }
  x.drawImage(scanOverlay(),0,0);
  x.restore();
  m.stex.needsUpdate=true;
}
// budget: focused screen every frame, the 6 nearest ~20fps, everything else a few fps
let scrOrder=[], scrT=0, scrNear=0, scrFar=0;
function updateScreens(dt){
  if(!feedStarted) startBoardFeed();
  if((scrT-=dt)<=0){ scrT=.4; scrOrder=machines.map(m=>({m,d:Math.hypot(m.front.x-player.x,m.front.z-player.z)})).sort((a,b)=>a.d-b.d).map(o=>o.m) }
  const near=scrOrder.slice(0,6), rest=scrOrder.slice(6);
  if(focusIdx>=0) drawAttract(machines[focusIdx],time);
  for(let k=0;k<2 && near.length;k++){ const m=near[scrNear++%near.length]; if(m.i!==focusIdx) drawAttract(m,time) }
  if(rest.length) drawAttract(rest[scrFar++%rest.length],time);
}

/* ================================================================
   INPUT
   ================================================================ */
/* ================================================================
   ROOM SOUND — every cabinet plays its own idle loop from its speaker.
   Sound is placed in 3D (HRTF), falls off with distance, dulls with distance
   (air), is louder in front of a machine than behind it, and sits in a short
   room reverb. Only the nearest few machines are actually playing; the rest
   are silent, which you can't hear anyway at that distance.
   The whole room fades out behind a closing low-pass when a game starts.
   Tune by ear: */
const ROOM_AUDIO = {
  voices: 4,        // machines actually playing at once (the nearest ones)
  reach: 6.5,       // metres: machines further than this stay silent
  refDist: 1.0,     // distance at which a machine plays at full level
  rolloff: 2.4,     // how quickly level falls off beyond refDist (higher = tighter)
  focus: 2.4,       // how strongly the nearest machine dominates the others (higher = more)
  level: .6,        // per-machine level before distance
  reverb: .16,      // room reverb amount
  airDull: .35,     // how quickly distance dulls the top end
  fadeIn: 1.6, fadeOut: 1.2, // seconds
};

/* Loudness matching: measured level of each loop, so every machine sits at about the same volume. */
const IDLE_NORM = {"xa_neon_snake": 0.51, "xa_block_drop": 2.06, "xa_cave_diver": 0.47, "xa_orbit_merge": 0.35, "xa_block_runner": 3, "xa_brick_breaker": 1.13, "xa_rock_drift": 0.88, "xa_stack_tower": 2.5, "xa_road_hopper": 3, "xa_tile_tap": 1.59, "xa_merge_2048": 0.56, "xa_block_defence": 3, "xa_maze_muncher": 0.76, "xa_invader_wave": 1.84, "xa_helix_drop": 1.4, "xa_bubble_pop": 3, "xa_swerve": 0.56, "xa_lunar_lander": 0.36, "xa_reflex_tap": 1.0, "xa_mine_sprint": 1.21, "xa_pong_streak": 1.75};

/* Idle loops, one per game id. Songs are engine song data (see arcade-music.js). */
const P = (inst, pattern, o) => Object.assign({ inst, pattern }, o || {});
const PAD = (inst, oct, gain, params) => ({ inst, octave: oct, gain, params,
  fn: i => i.stepInBar === 0 ? [0, 2, 4].map(d => ({ deg: d + i.chord, steps: 16 })) : null });
const IDLE_SONGS = {
  xa_neon_snake: { bpm: 100, key: 57, scale: 'minor', chords: [0, 5, 3, 4], tracks: [
    PAD('pad', 0, .32, { cutoff: 900 }),
    P('arp', '0 2 4 7 4 2 0 2 4 7 9 7 4 2 0 -1', { chord: true, octave: 1, gain: .2, params: { cutoff: 2200 } }),
    P('bass', '0 . . 0 . . 0 . 0 . . 0 . 2 . .', { chord: true, octave: -2, gain: .38, params: { cutoff: 600 } }),
    P('hat', '..x...x...x...x.', { gain: .16 })] },
  xa_block_drop: { bpm: 120, key: 52, scale: 'minor', chords: [0, 3, 4, 0], tracks: [
    P('pluck', '4 . 2 3 4 . 3 2 1 . 1 3 5 . 4 3 2 . . 3 4 . 5 . 3 . 1 . 1 . . .', { octave: 1, gain: .28 }),
    P('bass', '0 . 7 . 0 . 7 . 0 . 7 . 0 . 7 .', { chord: true, octave: -2, gain: .34 }),
    P('snare', '....x.......x...', { gain: .18 }), P('kick', 'x.......x.......', { gain: .28 })] },
  xa_cave_diver: { bpm: 76, key: 50, scale: 'dorian', chords: [0, 3], barsPerChord: 2, tracks: [
    PAD('pad', 0, .38, { cutoff: 700, attack: 1.2, release: 2 }),
    P('bell', '4 . . . . . . . . . 7 . . . . . . . 2 . . . . . . . . . . . . .', { octave: 1, gain: .17 }),
    P('sub', '0 - - - - - - - . . . . . . . .', { chord: true, octave: -1, gain: .34 }),
    P('shaker', '....x.......x..x', { gain: .11 })] },
  xa_orbit_merge: { bpm: 68, key: 53, scale: 'lydian', chords: [0, 1, 4, 0], tracks: [
    PAD('pad', 0, .38, { cutoff: 1200, attack: 1, release: 2 }),
    P('bell', '0 . . 4 . . 7 . . . 3 . . . . .', { chord: true, octave: 1, gain: .19 }),
    P('sub', '0 - - - - - - - - - - - - - - -', { chord: true, octave: -1, gain: .28 })] },
  xa_block_runner: { bpm: 124, key: 48, scale: 'minor', chords: [0, 5, 6, 4], tracks: [
    P('kick', 'x...x...x...x...', { gain: .32 }), P('hat', '..x...x...x...x.', { gain: .15 }),
    P('bass', '. . 0 . . . 0 . . . 0 . . . 0 7', { chord: true, octave: -1, gain: .33, params: { cutoff: 700 } }),
    P('arp', '0 4 7 4 0 4 7 9 0 4 7 4 2 4 7 11', { chord: true, octave: 1, gain: .15 })] },
  xa_brick_breaker: { bpm: 118, key: 55, scale: 'mixolydian', chords: [0, 6, 3, 0], tracks: [
    P('pluck', '0 . 2 4 . 2 4 6 . 4 2 . 1 . 2 .', { chord: true, octave: 1, gain: .26 }),
    P('bass', '0 . . 0 . . 4 . 0 . . 0 . . 6 .', { chord: true, octave: -2, gain: .33 }),
    P('snare', '....x.......x...', { gain: .18 }), P('kick', 'x.....x...x.....', { gain: .26 }), P('hat', 'x.x.x.x.x.x.x.x.', { gain: .09 })] },
  xa_rock_drift: { bpm: 88, key: 52, scale: 'phrygian', chords: [0, 1], barsPerChord: 2, tracks: [
    PAD('pad', 0, .32, { cutoff: 800 }),
    P('sub', '0 . . 0 . . 0 . 0 . . 0 . . 0 .', { chord: true, octave: -1, gain: .33 }),
    P('lead', '4 - - - 3 - 1 - 0 - - - - - - - . . . . . . . . . . . . . . . .', { octave: 1, gain: .13, params: { cutoff: 1800 } }),
    P('hat', 'x...x...x...x.x.', { gain: .09 })] },
  xa_stack_tower: { bpm: 104, key: 50, scale: 'major', chords: [0, 4, 5, 3], tracks: [
    P('marimba', '0 2 4 7 2 4 7 9 4 7 9 11 7 9 11 14', { chord: true, gain: .24 }),
    P('bass', '0 . . . 0 . . . 4 . . . 0 . . .', { chord: true, octave: -2, gain: .3 }),
    P('clap', '....x.......x...', { gain: .15 }), P('shaker', 'x.x.x.x.x.x.x.x.', { gain: .07 })] },
  xa_road_hopper: { bpm: 120, key: 53, scale: 'major', chords: [0, 3, 4, 0], tracks: [
    P('marimba', '0 . 2 . 4 . 2 . 5 . 4 . 2 . . .', { chord: true, octave: 1, gain: .24 }),
    P('pluck', '0 . . 0 4 . . . 0 . . 0 4 . . .', { chord: true, octave: -1, gain: .23, params: { cutoff: 1400 } }),
    P('shaker', '..x...x...x...x.', { gain: .11 }), P('kick', 'x.......x.......', { gain: .23 })] },
  xa_tile_tap: { bpm: 110, key: 59, scale: 'minor', chords: [0, 5, 3, 6], tracks: [
    P('kick', 'x.....x...x.....', { gain: .3 }), P('snare', '....x.......x...', { gain: .18 }), P('hat', 'x.xxx.x.x.xxx.x.', { gain: .09 }),
    P('pluck', '. . 0 . . 2 . . 4 . . 2 . 0 . .', { chord: true, gain: .22 }), PAD('pad', 0, .18, { cutoff: 1400 })] },
  xa_merge_2048: { bpm: 92, key: 60, scale: 'pentatonic', chords: [0, 3, 1, 4], tracks: [
    P('bell', '0 . 2 . 4 . . . 3 . . . 1 . . .', { chord: true, octave: 1, gain: .17 }),
    PAD('pad', 0, .28, { cutoff: 1000 }),
    P('sub', '0 - - - - - - - . . . . . . . .', { chord: true, octave: -1, gain: .24 })] },
  xa_block_defence: { bpm: 84, key: 50, scale: 'harmonic', chords: [0, 3, 4, 0], tracks: [
    P('snare', 'x..x..x.x.x.x...', { gain: .15 }), P('kick', 'x.......x.......', { gain: .28 }),
    P('bass', '0 . . . 0 . 0 . 4 . . . 4 . 4 .', { chord: true, octave: -2, gain: .33 }),
    P('lead', '0 - - 2 4 - - - 3 - 2 - 1 - - -', { chord: true, gain: .12, params: { cutoff: 1600 } })] },
  xa_maze_muncher: { bpm: 128, key: 57, scale: 'minorPent', chords: [0, 3, 2, 4], tracks: [
    P('arp', '0 2 4 5 4 2 0 2 0 2 4 5 7 5 4 2', { chord: true, octave: 1, gain: .15 }),
    P('bass', '0 . 0 . 5 . 0 . 0 . 0 . 5 . 3 .', { chord: true, octave: -1, gain: .28 }),
    P('hat', '..x...x...x...x.', { gain: .11 }), P('kick', 'x...x...x...x...', { gain: .2 })] },
  xa_invader_wave: { bpm: 100, key: 52, scale: 'minor', chords: [0], tracks: [
    P('bass', '0 . . . 1 . . . 2 . . . 1 . . .', { octave: -2, gain: .38, params: { cutoff: 500 } }),
    P('hat', 'x...x...x...x...', { gain: .09 }), PAD('pad', 0, .17, { cutoff: 700 }),
    P('lead', '. . . . . . . . . . . . 4 . 3 .', { octave: 1, gain: .1 })] },
  xa_helix_drop: { bpm: 112, key: 56, scale: 'whole', chords: [0, 1], barsPerChord: 2, tracks: [
    P('arp', '12 10 8 6 4 2 0 -2 10 8 6 4 2 0 -2 -4', { chord: true, gain: .14 }),
    PAD('pad', 0, .23, { cutoff: 1300 }), P('kick', 'x.......x.......', { gain: .24 }), P('shaker', '..x...x...x...x.', { gain: .09 })] },
  xa_bubble_pop: { bpm: 106, key: 55, scale: 'major', chords: [0, 4, 5, 3], tracks: [
    P('pluck', '7 . 9 . 11 . 9 . 7 . . 4 . . 7 .', { chord: true, gain: .21, params: { decay: .18 } }),
    P('marimba', '0 . . . 4 . . . 2 . . . 4 . . .', { chord: true, octave: -1, gain: .24 }),
    P('shaker', 'x.x.x.x.x.x.x.x.', { gain: .07 }), P('kick', 'x.......x.......', { gain: .19 })] },
  xa_swerve: { bpm: 128, key: 57, scale: 'minor', chords: [0, 5, 2, 6], tracks: [
    P('kick', 'x...x...x...x...', { gain: .3 }),
    P('bass', '0 0 7 0 0 7 0 0 0 0 7 0 0 7 0 7', { chord: true, octave: -2, gain: .28, params: { cutoff: 500 } }),
    P('arp', '0 4 7 11 7 4 0 4 0 4 7 11 14 11 7 4', { chord: true, octave: 1, gain: .12 }),
    PAD('pad', 0, .18, { cutoff: 1500 })] },
  xa_lunar_lander: { bpm: 64, key: 48, scale: 'lydian', chords: [0, 4], barsPerChord: 2, tracks: [
    PAD('pad', 0, .34, { cutoff: 900, attack: 1.5, release: 2.5 }),
    P('bell', '11 . . . . . . . . . . . . . . . . . . . . . . . 7 . . . . . 4 .', { octave: 1, gain: .14 }),
    P('sub', '0 - - - - - - - - - - - - - - -', { chord: true, octave: -1, gain: .28 })] },
  xa_reflex_tap: { bpm: 92, key: 50, scale: 'harmonic', chords: [0, 3, 4, 4], tracks: [
    P('pluck', '0 . 4 . 7 . 4 . 0 . 4 . 7 . 8 .', { chord: true, gain: .22, params: { wave: 'sawtooth', cutoff: 2500, decay: .22 } }),
    P('bass', '0 . . . . . 0 . 4 . . . . . 4 .', { chord: true, octave: -2, gain: .3 }),
    P('shaker', 'x..xx..xx..xx..x', { gain: .09 }),
    P('bell', '. . . . . . . . . . . . . . . . 7 . . . . . . . . . . . . . . .', { octave: 1, gain: .11 })] },
  xa_mine_sprint: { bpm: 88, key: 57, scale: 'dorian', chords: [0, 3], barsPerChord: 2, tracks: [
    P('marimba', '0 . . 4 . . 2 . . 4 . . 3 . 1 .', { chord: true, octave: 1, gain: .19 }),
    P('sub', '0 . . . . . . . 0 . . . . . . .', { chord: true, octave: -1, gain: .28 }),
    P('hat', 'x.x.x.x.x.x.x.x.', { gain: .06 }), P('kick', 'x.........x.....', { gain: .22 })] },
  xa_pong_streak: { bpm: 120, key: 60, scale: 'major', chords: [0, 5, 3, 4], tracks: [
    P('pluck', '0 . . . 7 . . . 0 . . . 7 . . .', { chord: true, gain: .22 }),
    P('pluck', '. . 4 . . . 2 . . . 4 . . . 9 .', { chord: true, octave: 1, gain: .15 }),
    P('kick', 'x.......x.......', { gain: .24 }), P('snare', '....x.......x...', { gain: .15 }),
    P('bass', '0 . . . 0 . . . 0 . . . 0 . 4 .', { chord: true, octave: -2, gain: .26 })] },
};

const Room = (() => {
  let ctx = null, master = null, door = null, wet = null, on = true, running = false, lastPick = 0;
  const voices = new Map();                 // machine index -> voice
  const V = new THREE.Vector3(), F = new THREE.Vector3(), U = new THREE.Vector3();
  const ramp = (param, v, t, secs) => { param.cancelScheduledValues(t); param.setValueAtTime(Math.max(.0001, param.value), t); param.exponentialRampToValueAtTime(Math.max(.0001, v), t + secs) };
  const setXYZ = (node, pre, x, y, z, t) => {
    if (node[pre + 'X']) { node[pre + 'X'].setTargetAtTime(x, t, .03); node[pre + 'Y'].setTargetAtTime(y, t, .03); node[pre + 'Z'].setTargetAtTime(z, t, .03); return true }
    return false;
  };
  function impulse(secs, decay) {
    const n = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay) }
    return b;
  }
  function init() {
    if (ctx) return true;
    if (!XA.music || !XA.music.makeRoomDeck || !XA.music.ensure()) return false;
    ctx = XA.audio.context();
    master = ctx.createGain(); master.gain.value = .0001;
    door = ctx.createBiquadFilter(); door.type = 'lowpass'; door.frequency.value = 20000;   // closes when a game starts
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 8; comp.attack.value = .01; comp.release.value = .3;
    master.connect(door); door.connect(comp); comp.connect(XA.audio.bus());   // through the shared master, so Mute silences it
    const conv = ctx.createConvolver(); conv.buffer = impulse(1.8, 2.6);
    wet = ctx.createGain(); wet.gain.value = ROOM_AUDIO.reverb; wet.connect(conv); conv.connect(master);
    if (bayEngine) bayEngine.audio.attach({ ctx, master, wet });   // bay sounds ride the same bus (and Mute)
    setInterval(tick, 25);
    return true;
  }
  function tick() {
    if (!ctx || !voices.size) return;   // voices keep playing while they fade, even after the room stops picking new ones
    const h = ctx.currentTime + .3;   // generous lookahead: room music never needs tight timing, and a busy frame mustn't drop notes
    for (const v of voices.values()) XA.music.runRoomDeck(v.deck, h);   // fading voices keep playing until they're gone
  }
  function makeVoice(m) {
    const song = IDLE_SONGS[m.game.id]; if (!song) return null;
    const g = ctx.createGain(); g.gain.value = .0001;
    const air = ctx.createBiquadFilter(); air.type = 'lowpass'; air.frequency.value = 16000;
    const pan = ctx.createPanner();
    pan.panningModel = 'HRTF'; pan.distanceModel = 'inverse';
    pan.refDistance = ROOM_AUDIO.refDist; pan.rolloffFactor = ROOM_AUDIO.rolloff; pan.maxDistance = 60;
    pan.coneInnerAngle = 140; pan.coneOuterAngle = 300; pan.coneOuterGain = .35;   // louder in front of the machine
    const t = ctx.currentTime, p = m.audioPos, d = m.audioDir;
    if (!setXYZ(pan, 'position', p.x, p.y, p.z, t)) pan.setPosition(p.x, p.y, p.z);
    if (!setXYZ(pan, 'orientation', d.x, d.y, d.z, t)) pan.setOrientation(d.x, d.y, d.z);
    const send = ctx.createGain(); send.gain.value = .3;
    const foc = ctx.createGain(); foc.gain.value = 1;
    g.connect(foc); foc.connect(air); air.connect(pan); pan.connect(master); air.connect(send); send.connect(wet);
    const deck = XA.music.makeRoomDeck(song, g);
    if (!deck) return null;
    ramp(g.gain, ROOM_AUDIO.level * (IDLE_NORM[m.game.id] || 1), t, ROOM_AUDIO.fadeIn);
    return { m, g, foc, air, pan, send, deck, dying: false };
  }
  function killVoice(i, secs) {
    const v = voices.get(i); if (!v || v.dying) return;
    v.dying = true; ramp(v.g.gain, .0001, ctx.currentTime, secs == null ? ROOM_AUDIO.fadeOut : secs);
    setTimeout(() => { try { v.g.disconnect(); v.send.disconnect(); v.pan.disconnect() } catch (e) {} XA.music.killRoomDeck(v.deck); if (voices.get(i) === v) voices.delete(i) }, ((secs == null ? ROOM_AUDIO.fadeOut : secs) + .2) * 1000);
  }
  function killAll(secs) { for (const i of [...voices.keys()]) killVoice(i, secs) }
  function update(dt) {
    if (!running || !ctx) { if (bayEngine) bayEngine.audio.hush(); return }
    const t = ctx.currentTime, L = ctx.listener, p = camera.position;
    F.set(0, 0, -1).applyQuaternion(camera.quaternion); U.set(0, 1, 0).applyQuaternion(camera.quaternion);
    if (!setXYZ(L, 'position', p.x, p.y, p.z, t)) L.setPosition(p.x, p.y, p.z);
    if (L.forwardX) { setXYZ(L, 'forward', F.x, F.y, F.z, t); setXYZ(L, 'up', U.x, U.y, U.z, t) } else L.setOrientation(F.x, F.y, F.z, U.x, U.y, U.z);
    if (bayEngine) bayEngine.audio.update(dt, { x: p.x, z: p.z }, on && !XA.audio.isMuted());
    // which machines should be playing: the nearest few in reach (with a little slack so edges don't flicker)
    if ((lastPick -= dt) <= 0) {
      lastPick = .25;
      const muted = XA.audio.isMuted();
      const ranked = machines.map(m => ({ m, d: Math.hypot(m.audioPos.x - p.x, m.audioPos.z - p.z) })).sort((a, b) => a.d - b.d);
      ranked.forEach((r, rank) => {
        const i = r.m.i, has = voices.has(i) && !voices.get(i).dying;
        const want = !muted && on && rank < ROOM_AUDIO.voices && r.d < ROOM_AUDIO.reach;
        const keep = !muted && on && rank < ROOM_AUDIO.voices + 1 && r.d < ROOM_AUDIO.reach + 1.2;
        if (want && !has) { if (voices.has(i)) voices.delete(i); const v = makeVoice(r.m); if (v) voices.set(i, v) }
        else if (has && !keep) killVoice(i);
      });
    }
    // distance dulls the top end, and far machines are heard more through the room than directly
    let d0 = 1e9;
    for (const v of voices.values()) if (!v.dying) d0 = Math.min(d0, Math.hypot(v.m.audioPos.x - p.x, v.m.audioPos.z - p.z));
    for (const v of voices.values()) {
      if (v.dying) continue;
      const d = Math.hypot(v.m.audioPos.x - p.x, v.m.audioPos.z - p.z);
      // the nearest machine leads: the others sink away as you close in on it
      v.foc.gain.setTargetAtTime(Math.pow((d0 + .8) / (d + .8), ROOM_AUDIO.focus), t, .15);
      v.air.frequency.setTargetAtTime(Math.max(900, 16000 / (1 + d * ROOM_AUDIO.airDull)), t, .1);
      v.send.gain.setTargetAtTime(.12 + Math.min(.2, d * .03), t, .1);
    }
  }
  function start() {
    if (!init()) return;
    running = on;
    const t = ctx.currentTime;
    door.frequency.cancelScheduledValues(t); door.frequency.setValueAtTime(20000, t);
    if (on) ramp(master.gain, 1, t, 1.5);
  }
  function enterGame() {        // the room closes behind you as the camera flies in
    if (!ctx) return;
    const t = ctx.currentTime;
    ramp(master.gain, .0001, t, .7);
    door.frequency.cancelScheduledValues(t); door.frequency.setValueAtTime(Math.max(300, door.frequency.value), t);
    door.frequency.exponentialRampToValueAtTime(280, t + .6);
    running = false;
    setTimeout(() => { if (!running) killAll(.05) }, 800);
  }
  function exitGame() {         // and opens again as you step back out
    if (!ctx || !on) return;
    running = true; lastPick = 0;
    const t = ctx.currentTime;
    door.frequency.cancelScheduledValues(t); door.frequency.setValueAtTime(400, t); door.frequency.exponentialRampToValueAtTime(20000, t + 1.4);
    ramp(master.gain, 1, t, 1.2);
  }
  function pause() { if (!ctx) return; ramp(master.gain, .0001, ctx.currentTime, .2); running = false; setTimeout(() => { if (!running) killAll(.05) }, 300) }
  function resume() { if (!ctx || !on) return; running = true; ramp(master.gain, 1, ctx.currentTime, .6) }
  function toggle() {
    on = !on;
    if (!on) { running = false; if (ctx) { ramp(master.gain, .0001, ctx.currentTime, .4); setTimeout(() => { if (!running) killAll(.05) }, 450) } }
    else start();
    return on;
  }
  return { start, update, enterGame, exitGame, pause, resume, toggle, isOn: () => on, _voices: () => voices.size, _voicesMap: () => voices };
})();

const keys = {};
let state='intro', focusIdx=-1, locked=false, tween=null, saved=null, zoomTarget=null, activeIdx=-1;
const ray=new THREE.Raycaster(); ray.far=2.8;
const center=new THREE.Vector2(0,0);

const modalOpen = () => chainOpen || radioOpen || !!document.querySelector('#xa-root .xa-modal');
addEventListener('keydown', e=>{
  if(state==='play' || modalOpen()) return;          // the engine owns the keyboard while a game or dialog is up
  keys[e.code]=true;
  if(state!=='walk' || e.repeat) return;
  const onBtn = e.target && e.target.tagName==='BUTTON';
  if((e.code==='KeyE'||(!onBtn&&(e.code==='Enter'||e.code==='Space'))) && focusIdx>=0){ e.preventDefault(); startGame(focusIdx) }
  else if((e.code==='KeyE'||(!onBtn&&(e.code==='Enter'||e.code==='Space'))) && focusIdx<0 && posterFocus){ e.preventDefault(); openChain(posterFocus.spec.play) }
  else if(e.code==='KeyE' && focusIdx<0 && !posterFocus && bayEngine && bayHint && !(bayToast && performance.now()<bayToast.until)){ e.preventDefault(); bayEngine.toggleFocused() }
  else if(e.code==='KeyQ' && focusIdx>=0 && GAMES[focusIdx].variants[0]){ startGame(focusIdx, GAMES[focusIdx].variants[0].key) }
  else if(e.code==='KeyT'){ openScores() }
  else if(e.code==='KeyM'){ toggleMute() }
  else if(e.code==='KeyR'){ Room.toggle(); paintRoom() }
});
addEventListener('keyup', e=>{ keys[e.code]=false });
addEventListener('blur', ()=>{ for(const k in keys) keys[k]=false });

const cvs=renderer.domElement;
document.addEventListener('pointerlockchange', ()=>{ locked = document.pointerLockElement===cvs; updateHud() });
function tryLock(){ if(isTouch) return; try{ const p=cvs.requestPointerLock(); if(p&&p.catch) p.catch(()=>{}) }catch(e){} }

let drag=null, bayDrag=false, bayTouch=null, bayTouchPos={x:0,y:0};
cvs.addEventListener('mousedown', e=>{
  if(state!=='walk' || modalOpen()) return; initAudio();
  if(bayEngine && focusIdx<0 && !posterFocus){   // grab a curtain you may pull
    const nd = locked ? new THREE.Vector2(0,0) : new THREE.Vector2(e.clientX/innerWidth*2-1, -(e.clientY/innerHeight)*2+1);
    if(bayEngine.grabStart(nd)){ bayDrag=true; drag=null; return }
  }
  drag={x:e.clientX,y:e.clientY,moved:0} });
addEventListener('mousemove', e=>{
  if(state!=='walk') return;
  if(bayDrag){ bayEngine.grabMove(e.movementX/(innerWidth/2), -e.movementY/(innerHeight/2)); return }
  if(locked){ look(e.movementX, e.movementY, WALK.look) }
  else if(drag){ const dx=e.clientX-drag.x, dy=e.clientY-drag.y; drag.moved+=Math.abs(dx)+Math.abs(dy); drag.x=e.clientX; drag.y=e.clientY; look(dx,dy,WALK.drag) }
});
addEventListener('mouseup', e=>{
  if(bayDrag){ bayDrag=false; bayEngine.grabEnd(); drag=null; return }
  if(!drag || state!=='walk'){ drag=null; return }
  const wasClick = drag.moved<5; drag=null; if(!wasClick) return;
  if(locked){ if(focusIdx>=0) startGame(focusIdx); else if(posterFocus) openChain(posterFocus.spec.play); return }
  const hit=pickAt(e.clientX,e.clientY);
  if(hit>=0) startGame(hit);
  else { const ps=posterAt(new THREE.Vector2(e.clientX/innerWidth*2-1, -(e.clientY/innerHeight)*2+1)); if(ps) openChain(ps.spec.play); else tryLock() }
});
function look(dx,dy,k){ player.yaw-=dx*k; player.pitch=clamp(player.pitch-dy*k,-WALK.pitch,WALK.pitch) }
function pickAt(cx,cy){
  const v=new THREE.Vector2(cx/innerWidth*2-1, -(cy/innerHeight)*2+1);
  ray.setFromCamera(v,camera); const h=ray.intersectObjects(pickables,false)[0];
  return h ? h.object.userData.cab : -1;
}

// touch: left thumb walks, right thumb looks, tap a machine to start
const joy={id:null,ox:0,oy:0,vx:0,vy:0}, lk={id:null,x:0,y:0,moved:0};
const stick=$('stick'), knob=$('knob');
cvs.addEventListener('touchstart', e=>{
  if(state!=='walk') return; initAudio();
  for(const t of e.changedTouches){
    if(t.clientX<innerWidth*.45 && joy.id===null){ joy.id=t.identifier; joy.ox=t.clientX; joy.oy=t.clientY; stick.style.left=t.clientX+'px'; stick.style.top=t.clientY+'px'; stick.hidden=false }
    else if(bayEngine && bayTouch===null && bayEngine.grabStart(new THREE.Vector2(t.clientX/innerWidth*2-1, -(t.clientY/innerHeight)*2+1))){ bayTouch=t.identifier; bayTouchPos={x:t.clientX,y:t.clientY} }
    else if(lk.id===null){ lk.id=t.identifier; lk.x=t.clientX; lk.y=t.clientY; lk.moved=0 }
  }
},{passive:true});
cvs.addEventListener('touchmove', e=>{
  e.preventDefault();
  for(const t of e.changedTouches){
    if(t.identifier===joy.id){ let dx=t.clientX-joy.ox, dy=t.clientY-joy.oy; const d=Math.hypot(dx,dy), mx=50; if(d>mx){dx*=mx/d; dy*=mx/d}
      joy.vx=dx/mx; joy.vy=dy/mx; knob.style.transform=`translate(${dx}px,${dy}px)` }
    else if(t.identifier===bayTouch){ bayEngine.grabMove((t.clientX-bayTouchPos.x)/(innerWidth/2), -(t.clientY-bayTouchPos.y)/(innerHeight/2)); bayTouchPos={x:t.clientX,y:t.clientY} }
    else if(t.identifier===lk.id){ const dx=t.clientX-lk.x, dy=t.clientY-lk.y; lk.moved+=Math.abs(dx)+Math.abs(dy); lk.x=t.clientX; lk.y=t.clientY; if(state==='walk') look(dx,dy,WALK.touchLook) }
  }
},{passive:false});
const endTouch=e=>{
  for(const t of e.changedTouches){
    if(t.identifier===joy.id){ joy.id=null; joy.vx=joy.vy=0; stick.hidden=true; knob.style.transform='' }
    else if(t.identifier===bayTouch){ bayEngine.grabEnd(); bayTouch=null }
    else if(t.identifier===lk.id){ lk.id=null; if(lk.moved<10 && state==='walk'){ const h=pickAt(t.clientX,t.clientY); if(h>=0) startGame(h); else { const ps=posterAt(new THREE.Vector2(t.clientX/innerWidth*2-1, -(t.clientY/innerHeight)*2+1)); if(ps) openChain(ps.spec.play) } } }
  }
};
cvs.addEventListener('touchend', endTouch); cvs.addEventListener('touchcancel', endTouch);
$('tapstart').addEventListener('click', ()=>{ if(focusIdx>=0) startGame(focusIdx) });
$('tapalt').addEventListener('click', ()=>{ const v=focusIdx>=0 && GAMES[focusIdx].variants[0]; if(v) startGame(focusIdx, v.key) });

/* ================================================================
   HUD
   ================================================================ */
if(XAScores && XAScores.onChange) XAScores.onChange(()=>{ try{ updateHud() }catch(e){} });   // wallet tag in the START prompt
function updateHud(){
  const walking = state==='walk';
  $('cross').hidden = !walking;
  $('cross').classList.toggle('on', focusIdx>=0);
  $('prompt').hidden = !(walking && focusIdx>=0);
  if(focusIdx>=0) $('ptitle').textContent = GAMES[focusIdx].title;
  // Say before you sit down whether this run can be posted (a run is bound to the wallet it starts with).
  if(focusIdx>=0){ let w=$('pwallet'); if(!w){ w=document.createElement('span'); w.id='pwallet'; w.style.cssText='font-size:14px;letter-spacing:.06em;margin-left:4px'; $('prompt').appendChild(w) }
    const st=(XAScores && XAScores.status) ? XAScores.status() : {}, on=!!st.address;
    w.textContent = on ? '\u25CF RANKED' : st.route==='none' ? '\u25CB VIEW ONLY' : '\u25CB PRACTICE \u00B7 connect to post scores';
    w.style.color = on ? '#7dffb2' : '#ffc53d' }
  $('tapstart').hidden = !(walking && isTouch && focusIdx>=0);
  $('hint').hidden = !walking || isTouch;
  $('lockhint').hidden = !walking || isTouch || locked;
  const v = focusIdx>=0 ? GAMES[focusIdx].variants[0] : null;
  $('palt').hidden = !v; if(v) $('pvar').textContent = v.label.toUpperCase();
  $('tapalt').hidden = !(walking && isTouch && v); if(v) $('tapalt').textContent = v.label.toUpperCase();
  $('hallbar').hidden = !(walking || state==='intro');
  $('pprompt').hidden = !(walking && focusIdx<0 && posterFocus && !chainOpen);
  if(!walking && bayHint){ bayHint=null; paintBayHint() }
  if(posterFocus) $('pptitle').textContent = posterFocus.spec.play.title;
}

/* Read-only look at the cabinet screens (tests and debugging). */
window.XAHall = Object.freeze({
  screens: () => machines.map(m => ({ id: m.game.id, phase: m.phase || null, board: m.phaseBoard || null })),
  layout: () => ({ room: { w: RW, l: RL }, left: NL, right: NR, cabinets: GAMES.map((g,i)=>({ id: g.id, side: SIDE_OF[i], slot: SLOT_OF[i], z: cabZ(SLOT_OF[i], SIDE_OF[i]<0?NL:NR) })), posterSlots: posterSlots.length, posterTags: posterSlots.map(sl=>(sl.pos.x<0?'L':'R')+(sl.bay||'-')) }),
  boards: () => Object.keys(TOP).map(k => ({ board: k, entries: TOP[k].entries.length })),
  screenImage: i => machines[i] && machines[i].sctx ? machines[i].sctx.canvas.toDataURL('image/png') : null
});
/* hall toolbar → the engine's scoreboards, wallet and sound */
function freeMouse(){ if(document.pointerLockElement) document.exitPointerLock() }
function openScores(){ freeMouse(); initAudio(); const g=GAMES[focusIdx>=0?focusIdx:0]; try{ XARoom.boards(g.id) }catch(e){ console.error(e) } }
function paintMute(){ $('hmute').textContent = XA.audio.isMuted() ? '🔇' : '🔊' }
function toggleMute(){ XA.audio.setMuted(!XA.audio.isMuted()); XA.audio.unlock(); paintMute() }
function toggleFs(){ try{ if(document.fullscreenElement) document.exitFullscreen(); else { const el=document.documentElement, p=(el.requestFullscreen||el.webkitRequestFullscreen).call(el); if(p&&p.catch) p.catch(()=>{}) } }catch(e){} }
$('hscores').addEventListener('click', openScores);
$('hwallet').addEventListener('click', ()=>{ freeMouse(); initAudio(); try{ XARoom.wallet() }catch(e){ console.error(e) } });
$('hmute').addEventListener('click', toggleMute);
function paintRoom(){ const b=$('hroom'); b.style.opacity=Room.isOn()?1:.45; b.title=Room.isOn()?'Room music on (R)':'Room music off (R)' }
$('hroom').addEventListener('click', ()=>{ initAudio(); Room.toggle(); paintRoom() }); paintRoom();
document.addEventListener('visibilitychange', ()=>{ if(document.hidden) Room.pause(); else if(state==='walk'||state==='intro') Room.resume() });
$('hfs').addEventListener('click', toggleFs);
for(const b of document.querySelectorAll('#hallbar button')) b.addEventListener('mouseup', e=>e.currentTarget.blur());
paintMute();
if(XAScores && XAScores.onChange) XAScores.onChange(st=>{ const b=$('hwallet'), dot=b.querySelector('.dot'), l=b.querySelector('.lbl');
  dot.className='dot'+(st.address?' on':st.route==='none'?' warn':'');
  l.textContent = st.address ? XAScores.shortAddress(st.address) : st.route==='none' ? 'VIEW ONLY' : 'CONNECT';
  b.title = st.address ? 'Connected '+st.address : st.route==='none' ? 'Scores can be posted when the arcade is opened on xtrata.xyz' : 'Connect a Stacks wallet to post high scores' });

$('go').addEventListener('click', ()=>{
  initAudio(); sfx.click();
  $('intro').hidden = true; state='walk'; tryLock(); updateHud(); Room.start(); try{ $('go').blur() }catch(e){}
});

/* ================================================================
   START → ZOOM → PLAY → BACK
   ================================================================ */
function startGame(i, vkey){
  if(state!=='walk' || modalOpen()) return;
  state='zoom'; activeIdx=i; sfx.coin(); Room.enterGame();
  if(document.pointerLockElement) document.exitPointerLock();
  focusIdx=i; updateHud(); $('cross').hidden=true; $('prompt').hidden=true; $('tapstart').hidden=true; $('lockhint').hidden=true; $('hint').hidden=true;
  const m=machines[i]; m.press=0;
  saved={pos:camera.position.clone(), quat:camera.quaternion.clone()};
  const P=new THREE.Vector3(), q=new THREE.Quaternion();
  m.screen.getWorldPosition(P); m.screen.getWorldQuaternion(q);
  const N=new THREE.Vector3(0,0,1).applyQuaternion(q), U=new THREE.Vector3(0,1,0).applyQuaternion(q);
  const tn=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  const dist=Math.min(m.sh/2/tn, m.sw/2/(tn*camera.aspect))*.96;
  const to=P.clone().addScaledVector(N,dist);
  const toQ=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(to,P,U));
  zoomTarget={to,toQ};
  tween={fromP:saved.pos.clone(), fromQ:saved.quat.clone(), toP:to, toQ, t:-.22, dur:1.15, fadeAt:.8, faded:false, done:()=>openGame(i, vkey)};
}

function openGame(i, vkey){
  state='play'; for(const k in keys) keys[k]=false;
  try{ XARoom.start(GAMES[i].id, vkey) }
  catch(e){ console.error(e); exitGame(); return }
  requestAnimationFrame(()=>{ $('flash').style.opacity=0 });
}

// called by the engine when a session ends (◀ back, Quit, or ◀ Arcade on the game-over card)
function exitGame(){
  if(state!=='play') return;
  state='out'; sfx.back(); Room.exitGame();
  const fl=$('flash'); fl.style.transition='none'; fl.style.opacity=1; void fl.offsetWidth; fl.style.transition='';
  for(const k in keys) keys[k]=false;
  camera.position.copy(zoomTarget.to); camera.quaternion.copy(zoomTarget.toQ);
  renderer.render(scene,camera);
  requestAnimationFrame(()=>{ fl.style.opacity=0 });
  tryLock();
  tween={fromP:zoomTarget.to.clone(), fromQ:zoomTarget.toQ.clone(), toP:saved.pos, toQ:saved.quat, t:.05, dur:.9, fadeAt:99, faded:true,
    done:()=>{ state='walk'; activeIdx=-1; updateHud() }};
}
window.XA_CONFIG = window.XA_CONFIG || {};
window.XA_CONFIG.onExit = exitGame;

/* ================================================================
   LOOP
   ================================================================ */
const fwd=new THREE.Vector3(), tmp=new THREE.Vector3();
function move(dt){
  let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0) - joy.vy;
  let s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0) + joy.vx;
  const len=Math.hypot(f,s); if(len>1){f/=len; s/=len}
  const sp=(keys.ShiftLeft?WALK.sprint:WALK.speed)*dt, sy=Math.sin(player.yaw), cy=Math.cos(player.yaw);
  const px=player.x, pz=player.z;
  player.x += (-sy*f + cy*s)*sp; player.z += (-cy*f - sy*s)*sp;
  if(len>.05) player.bob+=dt*WALK.bobRate*Math.min(1,len);
  // collision
  const r=.32;
  if(lobbyPass && lobbyOpen()){   // the door is open onto the lobby: the hall, the doorway and the lobby are one space
    const R=lobbyRects(r), ok=(x,z)=>R.some(a=>x>=a[0]&&x<=a[1]&&z>=a[2]&&z<=a[3]);
    if(!ok(player.x,player.z)){
      const nx=player.x, nz=player.z;
      if(ok(nx,pz)) player.z=pz; else if(ok(px,nz)) player.x=px; else if(ok(px,pz)){ player.x=px; player.z=pz }
      else { let bd=1e9; for(const a of R){ const cx=clamp(nx,a[0],a[1]), cz=clamp(nz,a[2],a[3]), d=(cx-nx)**2+(cz-nz)**2; if(d<bd){ bd=d; player.x=cx; player.z=cz } } }   // put somewhere (a jump): the nearest allowed spot
    }
  } else {
    if(inLobbyZone()){ player.x=px; player.z=pz }   // (cannot happen: the door is held open while you are inside)
    player.x=clamp(player.x,-RW/2+r,RW/2-r); player.z=clamp(player.z,-RL/2+r,RL/2-r);
  }
  if(Math.abs(player.x)<=RW/2) for(const b of boxes){
    const nx=clamp(player.x,b.min.x,b.max.x), nz=clamp(player.z,b.min.z,b.max.z);
    const dx=player.x-nx, dz=player.z-nz, d2=dx*dx+dz*dz;
    if(d2<r*r){ if(d2<1e-8){ player.x = player.x<(b.min.x+b.max.x)/2 ? b.min.x-r : b.max.x+r }
      else { const d=Math.sqrt(d2); player.x=nx+dx/d*r; player.z=nz+dz/d*r } }
  }
}

function findFocus(){
  ray.setFromCamera(center,camera);
  const h=ray.intersectObjects(pickables,false)[0];
  if(h) return h.object.userData.cab;
  // forgiving: standing close and roughly facing a machine
  camera.getWorldDirection(fwd); fwd.y=0; fwd.normalize();
  let best=-1, bd=1.5;
  for(const m of machines){
    tmp.set(m.front.x-player.x,0,m.front.z-player.z); const d=tmp.length();
    if(d<bd && tmp.normalize().dot(fwd)>.8){bd=d; best=m.i}
  }
  return best;
}

/* What the player is looking at in a bay (a curtain they may pull). Cabinets and playable posters come first. */
function updateBayFocus(){
  if(bayEngine.isGrabbing()) return;
  let h=null, hold=true;
  if(bayToast && performance.now()<bayToast.until){ h=bayToast.text; hold=false }
  else if(state==='walk' && !chainOpen && focusIdx<0 && !posterFocus){ bayEngine.setScope(inLobbyZone() ? (i=>i>=HALL_BAYS) : (i=>i<HALL_BAYS)); const f=bayEngine.focus(); h=f?f.hint:null; hold=!!(f&&f.hold) }
  if(h!==bayHint || hold!==bayHold){ bayHint=h; bayHold=hold; paintBayHint() }
}
/* ---------- rooms that take the whole screen (the casino, and any room in the world registry) ----------
   A door leads to a SPACE in the world registry (scene.link.to). Where it goes is read from the chain when the door is used: the space's
   slug, title, state, runtime and entry (XAWorld.registry().destination). The hall's own live, native lobby is built behind its door (above);
   everything else is a PAGE: the space's entry inscription, fetched by id and checked against its Xtrata chain hash and size
   (XAScores.getInscription: gateway first, the chain as fallback), and framed as srcdoc. No list of rooms lives in the hall or its parent.
     live + entry        the room opens (a short loading screen, the page full screen, BACK above it)
     live, no entry      THIS DOOR LEADS TO <TITLE> · NOT OPEN YET
     draft / suspended / retired   THIS DOOR LEADS TO <TITLE> · CLOSED
     the read failed     COULD NOT CHECK THE DOOR · TRY AGAIN   (never "not open": a failed read is not an answer)
   Every room runs in a sandboxed frame (allow-scripts allow-pointer-lock allow-downloads, never allow-same-origin), whatever its runtime: it
   cannot touch the hall's page, wallet or storage. It talks to the hall only through window.XA_ROOM, a small script the hall puts at the top
   of the page (docs/room-bridge.md, protocol version 1): ready(), leave(), go(door), and for a HOSTED room (runtime 3) only, call() and account().
   window.XA_ROOMS = { casino:{ src:'casino-room.html', title, still, depth } } is for the local preview only (a page beside the hall), never for
   an inscribed room. A door's entry picture comes from the door's params (still/stillHash, depth/depthHash: inscription ids and chain hashes),
   or for a preview room from XA_ROOMS: the open doorway shows it with parallax (doors.js windowTo) and walking in glides into it.
   BACK works at any depth: the hall keeps where you came from; BACK re-opens the room before (read again: rooms are torn down when you leave
   them) at the door you went through, or takes you back to the doorway in the hall. A destination whose entry or state changes while you are
   inside changes nothing until you leave. */
const ROOM_CAP=16*1024*1024;                          // a room page bigger than this is not opened here (it would not fit a viewer's frame well)
const ROOM_SANDBOX='allow-scripts allow-pointer-lock allow-downloads';
const roomCfg=(id)=>{ const r=window.XA_ROOMS && window.XA_ROOMS[String(id||'').toLowerCase()]; return r && typeof r.src==='string' && r.src ? r : null };   // local preview pages only
const linkSlug=(lk)=>String((lk && (lk['target-room']||lk.targetRoom||lk.room))||'').toLowerCase();
const signText=(s,max)=>String(s==null?'':s).toUpperCase().replace(/[^A-Z0-9 .,!?:'&\/-]/g,' ').replace(/\s+/g,' ').trim().slice(0,max||32);   // what the hall shows of a chain title: the sign alphabet, as text
const kb=(n)=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
let roomUI=null, roomBay=-1, roomT0=0, roomTimer=0, roomSlow=0, roomCur=null, roomStack=[], roomBusy=false, callBusy=false, enterSeq=0;
const roomId=()=>roomCur?(roomCur.slug||''):'';

/* where a door goes: read once per space for a short while (a failed read is never kept, so the next try reads again) */
const destCache=new Map();
function resolveDest(id,fresh){
  const R=window.XAWorld && XAWorld.registry && XAWorld.registry();
  if(!R) return Promise.resolve({ok:false, value:null, error:'no registry'});
  const now=performance.now(), c=destCache.get(id);
  if(!fresh && c && now-c.t<15000) return c.p;
  const p=Promise.resolve().then(()=>R.destination(id)).catch(e=>({ok:false, value:null, error:String(e&&e.message||e)})).then(r=>{ if(!r.ok && destCache.get(id) && destCache.get(id).p===p) destCache.delete(id); return r });
  destCache.set(id,{t:now,p}); return p;
}
// A resolved destination as the hall acts on it. kind: page | lobby | closed | soon | nowhere | unknown (the read failed) | big
function targetOf(r){
  if(!r || !r.ok) return {kind:'unknown', title:''};
  const d=r.value; if(!d) return {kind:'nowhere', title:''};
  const title=signText(d.title||d.slug,32);
  if(d.lobby) return {kind:'lobby', title};
  if(!d.open) return {kind:'closed', title};
  if(!d.entry) return {kind:'soon', title};
  if(d.entry.size>ROOM_CAP) return {kind:'big', title, size:d.entry.size};
  return {kind:'page', title, space:d.id, slug:d.slug, runtime:d.runtime, entry:d.entry};
}
function doorSays(t){
  if(t.kind==='unknown') return 'COULD NOT CHECK THE DOOR · TRY AGAIN';
  const to=t.title?'THIS DOOR LEADS TO '+t.title+' · ':'';
  if(t.kind==='closed') return (to||'THIS DOOR IS ')+'CLOSED';
  if(t.kind==='big') return (to||'')+'TOO BIG TO OPEN HERE ('+kb(t.size)+', THE LIMIT IS 16 MB)';
  return to?to+'NOT OPEN YET':'THIS DOOR IS NOT OPEN YET';
}
const hallSlug=()=>{ try{ const p=window.XAWorld && XAWorld.config().path; return Array.isArray(p)&&p.length?String(p[p.length-1]):'hall' }catch(e){ return 'hall' } };
// what the room is told about how you came in (window.XA_ENTRY): the space you came from, the door you came through, where to put you
function entryFrom(bay,lk){ const lob=bay>=HALL_BAYS; return {from:lob?'lobby':hallSlug(), door:'bay-'+(lob?bay-HALL_BAYS:bay), arrival:Number(lk&&lk.arrival)||0} }
function withEntry(t,e){ t.xaEntry={from:String(e.from||''), door:String(e.door||''), arrival:Number(e.arrival)||0}; t.key=t.kind==='src'?'src:'+t.slug:'e:'+t.entry.id+':'+t.entry.hash+'|'+t.xaEntry.from+'|'+t.xaEntry.door+'|'+t.xaEntry.arrival; return t }
// door link -> Promise<target>
function doorTarget(lk,bay){
  if(lk && lk.to) return resolveDest(lk.to).then(r=>{ const t=targetOf(r); if(t.kind==='page'){ withEntry(t,entryFrom(bay,lk)); t.view=stillFor(lk) } return t });
  const slug=linkSlug(lk), cfg=roomCfg(slug);
  if(cfg) return Promise.resolve(withEntry({kind:'src', title:signText(cfg.title||slug,32), label:String(cfg.title||slug), slug, cfg, runtime:2, view:stillFor(lk)}, entryFrom(bay,lk)));
  return Promise.resolve({kind:'soon', title:signText(slug,32)});
}

/* a door's entry picture: from the chain (hash-checked, like a poster's), or a preview room's file */
const picCache=new Map();
function chainPic(p){
  if(!p || !window.XAScores) return null;
  const k=p.id+':'+p.hash; let c=picCache.get(k);
  if(!c){ c={state:0,url:''}; picCache.set(k,c);
    XAScores.getInscription(p.id, XAScores._codec.hexToBytes(p.hash)).then(b=>{ const mime=picMime(b); if(!mime) throw new Error('not a picture'); c.url=URL.createObjectURL(new Blob([b],{type:mime})); c.state=1 }).catch(()=>{ c.state=2 }) }
  return c.state===1?c.url:null;
}
function stillFor(lk){
  if(!lk || isLobbyLink(lk)) return null;
  if(lk.to){ const s=lk.still?chainPic(lk.still):null; return s?{still:s, depth:(lk.depth&&chainPic(lk.depth))||''}:null }
  const r=roomCfg(linkSlug(lk)); return r&&typeof r.still==='string'&&r.still?{still:r.still, depth:typeof r.depth==='string'?r.depth:''}:null;
}

/* three.js for a room: the arcade's own copy (r128) instead of a CDN. The room page asks with the cdnjs r128 tag (so it also opens on its own)
   or with an empty <script data-xa-part="three.js"><\/script>. The text comes from the parent (window.XA_PARTS.threeText), or from the hall's own page. */
const THREE_SLOT=/<script[^>]*\bdata-xa-part=["']three\.js["'][^>]*>\s*<\/script>/i, THREE_TAG=/<script[^>]*\bsrc="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/[^"]*"[^>]*><\/script>/i;
function threeText(){
  try{ if(window.XA_PARTS && typeof XA_PARTS.threeText==='function'){ const t=XA_PARTS.threeText(); if(typeof t==='string' && t) return t } }catch(e){}
  const banner=/^\s*\/\*\*[\s\S]{0,40}@license[\s\S]{0,60}Three\.js Authors/;
  for(const s of document.scripts){ const t=s.text||''; if(t.length>100000 && banner.test(t.slice(0,200))) return t.replace(/\n\/\/# sourceURL=[^\n]*\s*$/,'') }
  return '';
}
function withThree(html){
  const at=THREE_SLOT.test(html)?THREE_SLOT:THREE_TAG.test(html)?THREE_TAG:null; if(!at) return html;
  const t=threeText(); if(!t) return html;
  return html.replace(at,()=>'<script>'+t.replace(/<\/script/gi,'<\\/script')+'<\/script>');
}
/* window.XA_ROOM (protocol version 1, frozen: docs/room-bridge.md), put at the top of every room page the hall frames from the chain */
function bridgeScript(t){
  const sc=(window.XAScores && XAScores.config && XAScores.config())||{};
  const info={v:1, title:t.title, slug:t.slug||'', runtime:t.runtime, network:sc.network==='testnet'?'testnet':'mainnet',
    apiBases:(window.XAWorld && XAWorld.apiBases ? XAWorld.apiBases() : []).filter(b=>typeof b==='string'), entry:t.xaEntry};
  const j=JSON.stringify(info).replace(/</g,'\\u003c').replace(/[\u2028\u2029]/g,c=>'\\u'+c.charCodeAt(0).toString(16));
  return '<script>(function(I){"use strict";var P=window.parent,n=0,wait={};'
    +'window.__XA_FROM_ARCADE=1;window.XA_ENTRY=Object.freeze({from:I.entry.from,door:I.entry.door,arrival:I.entry.arrival});'
    +'function send(m){try{P.postMessage(m,"*")}catch(e){}}'
    +'function ask(m){return new Promise(function(ok,no){var id="r"+(++n)+"-"+Date.now().toString(36);wait[id]={ok:ok,no:no};m.id=id;send(m)})}'
    +'window.addEventListener("message",function(e){var d=e.data;if(e.source!==P||!d||d.xa!=="result"||typeof d.id!=="string"||!wait[d.id])return;var w=wait[d.id];delete wait[d.id];if(d.ok)w.ok(d);else{var x=new Error(String(d.error||"refused"));x.code=String(d.error||"refused");w.no(x)}});'
    +'window.XA_ROOM=Object.freeze({version:1,title:I.title,slug:I.slug,runtime:I.runtime,network:I.network,apiBases:Object.freeze(I.apiBases.slice()),'
    +'ready:function(){send({xa:"room-ready"})},leave:function(){send({xa:"leave-room"})},'
    +'go:function(door){return ask({xa:"go",door:String(door==null?"":door)}).then(function(){return true})},'
    +'call:function(o){o=o||{};return ask({xa:"call",contract:o.contract,fn:o.fn,args:o.args,postConditions:o.postConditions,maxStx:o.maxStx}).then(function(r){return r.txid})},'
    +'account:function(){return ask({xa:"account"}).then(function(r){return r.address||null})}})'
    +'})('+j+')<\/script>';
}
function withBridge(html,t){ const s=bridgeScript(t); return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i,m=>m+s) : s+html }
// the room's page, ready to frame: its inscription, checked (chain hash, then size), three.js swapped, the bridge on top
async function roomHtml(t){
  const S=window.XAScores; if(!S || !S.getInscription) throw new Error('no reader');
  const bytes=await S.getInscription(t.entry.id, S._codec.hexToBytes(t.entry.hash));
  if(!bytes || bytes.length!==t.entry.size) throw new Error('the room is not the size its space says');
  return withBridge(withThree(new TextDecoder('utf-8').decode(bytes)), t);
}

function roomEls(){
  if(roomUI) return roomUI;
  const mk=(css,html)=>{ const e=document.createElement('div'); e.style.cssText=css; if(html!=null) e.innerHTML=html; return e };
  const load=mk('position:fixed;inset:0;z-index:9000;background:radial-gradient(ellipse at 50% 40%,#1b1233,#05040a 70%);display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;color:#e8e2ff;text-align:center;opacity:0;transition:opacity .25s',
    '<div class="rl-t" style="font:34px Bungee,Impact,sans-serif;letter-spacing:.08em;color:#ffb347;text-shadow:0 0 18px rgba(255,150,40,.55)"></div><div class="rl-s" style="font:16px VT323,monospace;letter-spacing:.14em;opacity:.8">OPENING THE ROOM…</div><div style="width:min(60vw,320px);height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden"><i class="rl-b" style="display:block;height:100%;width:35%;background:linear-gradient(90deg,#3d86ff,#ff8a2a);animation:rlbar 1.1s ease-in-out infinite alternate"></i></div>');
  // the room's entry still: shown full screen from the moment you cross the threshold until the live room has drawn its first frames, so the doorway you were looking into simply becomes the room
  const still=mk('position:fixed;inset:0;z-index:8900;background:#05040a center/cover no-repeat;display:none;opacity:0;transform:scale(1);will-change:transform,opacity');
  const st=document.createElement('style'); st.textContent='@keyframes rlbar{from{transform:translateX(-30%)}to{transform:translateX(190%)}}'; document.head.appendChild(st);
  const back=document.createElement('button'); back.type='button'; back.id='xa-room-back'; back.textContent='← BACK TO THE LOBBY';
  back.style.cssText='position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:9500;display:none;padding:9px 16px;font:15px VT323,monospace;letter-spacing:.12em;color:#e8e2ff;background:rgba(10,12,24,.88);border:1px solid #3b4a8a;border-radius:8px;cursor:pointer';
  back.addEventListener('click',e=>{ e.stopPropagation(); roomBack() });
  // a line over the room (a door the room asked for that is closed, or could not be checked)
  const note=mk('position:fixed;top:calc(max(10px,env(safe-area-inset-top)) + 46px);left:50%;transform:translateX(-50%);z-index:9500;display:none;max-width:min(92vw,560px);padding:8px 14px;font:15px VT323,monospace;letter-spacing:.1em;color:#ffd7a0;background:rgba(10,12,24,.92);border:1px solid #8a5a3b;border-radius:8px;text-align:center');
  document.body.append(still,load,back,note); roomUI={load,still,glide:null,back,note,frame:null,frameId:'',title:load.querySelector('.rl-t'),sub:load.querySelector('.rl-s')};
  // Only the current room's frame is listened to, and only its own window.
  window.addEventListener('message',e=>{
    const f=roomUI&&roomUI.frame, d=e.data;
    if(window.XA_TEST && d && typeof d==='object' && d.xa) (XA._msgs=XA._msgs||[]).push({xa:String(d.xa), mine:!!f && e.source===f.contentWindow, state, cur:!!roomCur});   // tests only
    if(!f || e.source!==f.contentWindow || !d || typeof d!=='object') return;
    if(d.xa==='room-ready'){ f.dataset.ready='1'; f.dispatchEvent(new Event('xa-room-ready')); return }   // at any time after it loads, even while it is still hidden behind the hall
    if(state!=='room' || !roomCur) return;
    if(d.xa==='leave-room'){ roomBack(); return }
    if(d.xa==='go' || d.xa==='call' || d.xa==='account') roomAsk(f,d);
  });
  return roomUI;
}
function roomNote(text,ms){ const U=roomEls(); U.note.textContent=text; U.note.style.display='block'; clearTimeout(roomNote.t); roomNote.t=setTimeout(()=>{ U.note.style.display='none' },ms||4000) }
function dropFrame(){ const U=roomUI; if(!U || !U.frame) return; try{ U.frame.src='about:blank' }catch(e){} U.frame.remove(); U.frame=null; U.frameId='' }
// The room's page is loaded quietly as soon as its door is opened (hidden, behind the hall), so by the time you walk in there is little or nothing to wait for.
// roomPrep makes it (keyed by the entry's id and hash, and how you come in); showRoom uses it (or makes it, if you got there first); roomDrop throws it away (the door shut, or you left the lobby).
const roomSrc=(cfg)=>cfg.src+(cfg.src.indexOf('?')<0?'?':'&')+'from=arcade';   // a preview room: told it was entered from the arcade, it starts walking just inside its door
function roomPrep(t){
  const U=roomEls(), v=t.view;
  if(v && v.still){ if(!roomPrep.im||roomPrep.im.u!==v.still){ const im=new Image(); im.src=v.still; roomPrep.im={u:v.still,im} } }   // the still is decoded before it is needed
  if(U.frame && U.frameId===t.key) return U.frame;
  dropFrame();
  const f=document.createElement('iframe'); f.title=t.label||t.title||t.slug||'room'; f.setAttribute('sandbox',ROOM_SANDBOX); f.dataset.xaRoom='1'; f.setAttribute('allow','autoplay; fullscreen; clipboard-write');
  f.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:8000;background:#05040a;visibility:hidden;pointer-events:none';
  f.dataset.loaded='';
  U.frame=f; U.frameId=t.key;
  if(t.kind==='page'){
    // Insert first, then listen, so the empty frame's own load is not mistaken for the room.
    document.body.appendChild(f);
    const fail=(e)=>{ f.dataset.failed='1'; f.dataset.why=String(e&&e.message||e||''); f.dispatchEvent(new Event('xa-room-failed')) };
    roomHtml(t).then(html=>{
      if(roomUI.frame!==f) return;                       // dropped while it was loading
      f.addEventListener('load',()=>{ f.dataset.loaded='1' });
      f.srcdoc=html;
    }).catch(fail);
    return f;
  }
  f.addEventListener('load',()=>{ f.dataset.loaded='1' });
  f.src=roomSrc(t.cfg); document.body.appendChild(f); return f;   // (src first: an empty frame fires a load of its own on insert)
}
function roomDrop(){ if(!roomUI || !roomUI.frame || state==='room') return; dropFrame() }
function backLabel(){
  const top=roomStack[roomStack.length-1];
  if(!top || top.kind==='hall') return '← BACK TO '+(top && top.bay>=HALL_BAYS ? 'THE LOBBY' : 'THE HALL');
  return '← BACK TO '+(top.t.title||'THE ROOM');
}
// Walking through a door into a room: from the hall (or the lobby).
function enterRoom(t, bayIdx){
  if(state!=='walk' || !t || (t.kind!=='page' && t.kind!=='src')) return;
  roomBay=bayIdx==null?-1:bayIdx; roomStack=[{kind:'hall', bay:roomBay}];
  roomEls(); state='room'; sfx.coin();
  if(document.pointerLockElement) document.exitPointerLock();
  for(const k in keys) keys[k]=false;
  $('cross').hidden=true; $('prompt').hidden=true; $('tapstart').hidden=true; $('lockhint').hidden=true; $('hint').hidden=true; if($('bprompt')) $('bprompt').hidden=true;
  try{ Room.enterGame() }catch(e){}                   // the hall's own sound closes behind you
  const hb=$('hallbar'); if(hb) hb.style.visibility='hidden';   // and its buttons (scores, wallet, sound) stay out of the room's picture
  showRoom(t,{door:true});
}
// Show room t full screen. opts.door: you walked in through a door of the hall (the entry still and the glide can play); otherwise a room
// is replacing another (a door inside a room, or BACK): the loading screen covers the change.
function showRoom(t, opts){
  opts=opts||{};
  const U=roomEls(); clearTimeout(roomTimer); clearTimeout(roomSlow); U.note.style.display='none';
  if(!opts.door){ U.still.style.display='none'; U.still.style.opacity=0; if(U.glide){ U.glide.dispose(); U.glide=null } if(U.frameId!==t.key) dropFrame() }
  const f=roomPrep(t); roomCur=t; roomT0=performance.now(); roomBusy=false;
  U.back.textContent=backLabel(); U.back.style.zIndex='9500';
  const ready=!!f.dataset.loaded, minWait=ready?250:700;   // a page that is already there still gets a beat of loading screen, never a flash
  U.title.textContent=String(t.title||t.slug||'ROOM').toUpperCase(); U.sub.textContent='OPENING THE ROOM…'+(t.entry?' '+kb(t.entry.size):'');
  const still=opts.door && t.view && t.view.still, depth=still && t.view.depth;
  const showLoad=()=>{ U.load.style.display='flex'; void U.load.offsetWidth; U.load.style.opacity=1 };
  // Best: the room has a depth map, so you glide forward from where you stand to where the room starts you, through the same view the doorway showed (a canvas of its own over the hall).
  let glide=null;
  if(still && depth && roomBay>=0 && bayEngine && bayEngine.glideInto){ try{ glide=bayEngine.glideInto(roomBay,{fov:camera.fov}) }catch(e){ glide=null; console.warn('room glide not available:',e) } }
  if(glide){
    U.glide=glide; document.body.appendChild(glide.dom); glide.render(performance.now()); void glide.dom.offsetWidth; glide.dom.style.transition='opacity .22s'; glide.dom.style.opacity=1;
    let gw=innerWidth, gh=innerHeight;
    const tick=(now)=>{ if(U.glide!==glide) return; if(innerWidth!==gw||innerHeight!==gh){ gw=innerWidth; gh=innerHeight; glide.resize(gw,gh) } glide.render(now); if(!glide.done) requestAnimationFrame(tick) };
    requestAnimationFrame(tick);
  } else if(still){   // else the doorway you were looking into fills the screen and moves in a little, as a step forward would; the loading screen only comes if the room is slow
    const S=U.still; S.style.transition='none';   // (the picture is wider than the room's own view, 80 degrees up and down against 68, so it is shown at its middle)
    S.style.backgroundImage='url("'+String(still).replace(/"/g,'%22')+'")'; S.style.backgroundSize='auto '+(100*Math.max(Math.tan(40*Math.PI/180)/Math.tan(34*Math.PI/180),(innerWidth/innerHeight)/(16/9))).toFixed(1)+'%'; S.style.transform='scale(1)'; S.style.opacity=0; S.style.display='block'; void S.offsetWidth;
    S.style.transition='opacity .25s,transform 2.6s cubic-bezier(.25,.6,.35,1)'; S.style.opacity=1; S.style.transform='scale(1.035)';
  } else showLoad();
  f.style.pointerEvents='auto';
  const done=()=>{ clearTimeout(roomTimer); const wait=Math.max(0,minWait-(performance.now()-roomT0));
    setTimeout(()=>{ if(state!=='room' || roomUI.frame!==f) return; f.style.visibility='visible'; U.load.style.opacity=0; setTimeout(()=>{ if(state==='room' && roomUI.frame===f) U.load.style.display='none' },280); U.back.style.display='block'; try{ f.focus() }catch(e){} },wait) };
  const failed=()=>{ if(roomUI.frame!==f) return; clearTimeout(roomTimer); clearTimeout(roomSlow); if(still) showLoad(); U.sub.textContent='THE ROOM COULD NOT BE LOADED. YOU CAN GO BACK'; U.back.style.display='block'; U.back.style.zIndex=9600 };
  if(f.dataset.failed) failed(); else f.addEventListener('xa-room-failed',failed,{once:true});
  if(still){
    // Ready = the room has said so ({xa:'room-ready'}, after its first frames), and the still has been up for a beat. A room that never says it is ready is shown 2.5 s after it loads.
    let shown=false;
    const reveal=()=>{ if(shown || state!=='room' || roomUI.frame!==f) return; shown=true; clearTimeout(roomSlow); clearTimeout(roomTimer);
      f.style.visibility='visible'; U.still.style.opacity=0; U.load.style.opacity=0; if(U.glide){ const g=U.glide; U.glide=null; g.dom.style.transition='opacity .45s'; g.dom.style.opacity=0; setTimeout(()=>g.dispose(),520) } setTimeout(()=>{ if(state==='room' && roomUI.frame===f){ U.still.style.display='none'; U.load.style.display='none' } },450); U.back.style.display='block'; try{ f.focus() }catch(e){} };
    const when=(ms)=>setTimeout(reveal,Math.max(0,ms-(performance.now()-roomT0)));
    const MIN=glide?glide.ms+150:900;   // (a glide has to arrive before the live room, which starts where it ends, takes over)
    if(f.dataset.ready) when(MIN); else f.addEventListener('xa-room-ready',()=>when(MIN),{once:true});
    const late=()=>setTimeout(()=>when(MIN),2500); if(f.dataset.loaded) late(); else f.addEventListener('load',late,{once:true});
    roomSlow=setTimeout(()=>{ if(!shown && state==='room' && roomUI.frame===f) showLoad() },3500);
  } else if(ready) done(); else f.addEventListener('load',done,{once:true});
  roomTimer=setTimeout(()=>{ if(state==='room' && roomUI.frame===f && f.style.visibility!=='visible'){ if(still) showLoad(); U.sub.textContent='THE ROOM IS TAKING A WHILE… YOU CAN GO BACK'; U.back.style.display='block'; U.back.style.zIndex=9600 } },20000);
}
// BACK (the button, or the room's own leave()): one step back. The room before is read again and re-opened at the door you went through;
// at the bottom of the stack you are back in the hall, in front of the door you came in by.
function roomBack(){
  if(state!=='room') return;
  const top=roomStack[roomStack.length-1];
  if(!top || top.kind==='hall' || roomBusy){ if(!roomBusy) leaveRoom(); return }
  roomBusy=true;
  const cur=roomCur;
  resolveDest(top.t.space,true).then(r=>{
    if(state!=='room' || roomCur!==cur) return;
    const t=targetOf(r);
    roomStack.pop();
    if(t.kind!=='page'){ roomBusy=false; leaveRoom(); bayToast={text:doorSays(t), until:performance.now()+4000}; updateBayFocus(); return }
    withEntry(t,{from:cur.slug||'', door:top.door.name, arrival:top.door.id});
    showRoom(t);
  });
}
function leaveRoom(){
  if(state!=='room' || !roomUI) return;
  const U=roomUI; clearTimeout(roomTimer); clearTimeout(roomSlow); const hb=$('hallbar'); if(hb) hb.style.visibility=''; U.still.style.display='none'; U.still.style.opacity=0; if(U.glide){ U.glide.dispose(); U.glide=null }
  dropFrame(); U.note.style.display='none';
  U.load.style.opacity=0; U.load.style.display='none'; U.back.style.display='none';
  state='out'; sfx.back(); try{ Room.exitGame() }catch(e){}
  const fl=$('flash'); fl.style.transition='none'; fl.style.opacity=1; void fl.offsetWidth; fl.style.transition=''; requestAnimationFrame(()=>{ fl.style.opacity=0 });
  for(const k in keys) keys[k]=false;
  const b=roomStack.length && roomStack[0].kind==='hall' ? roomStack[0].bay : roomBay;
  if(b>=0 && bayEngine && bayEngine.posOf && bayEngine.frameOf){   // you come out of the door: a step in front of it, facing away from it
    const q=bayEngine.posOf(b), fr=bayEngine.frameOf(b);
    if(q && fr){ player.x=q.x+fr.nx*1.2; player.z=q.z+fr.nz*1.2; player.yaw=Math.atan2(-fr.nx,-fr.nz); player.pitch=0 }
  }
  roomBay=-1; roomCur=null; roomStack=[]; roomBusy=false; inDoorway=-1; roomRested=true;
  setTimeout(()=>{ if(state==='out'){ state='walk'; updateHud() } },120); tryLock();
}
/* ---------- the room bridge (hall side). Messages come only from the current room frame; each ask is answered {xa:'result', id, ok, …} ---------- */
function roomReply(f,id,o){ if(roomUI && roomUI.frame===f && typeof id==='string') try{ f.contentWindow.postMessage(Object.assign({xa:'result', id}, o),'*') }catch(e){} }
function roomAsk(f,d){
  const id=typeof d.id==='string' && d.id.length<=64 ? d.id : null; if(!id) return;
  const t=roomCur, hosted=!!t && t.kind==='page' && t.runtime===3;
  if(d.xa==='account'){ const st=window.XAScores && XAScores.status ? XAScores.status() : {}; return roomReply(f,id, hosted?{ok:true, address:st.address||null}:{ok:false, error:'not-hosted'}) }
  if(d.xa==='call') return roomCall(f,id,d,t);
  // go(door): the door must be an object of this room's own space, with a portal; its destination follows the same rules as a hall door
  if(!t || t.kind!=='page' || !t.space) return roomReply(f,id,{ok:false, error:'not-available'});
  if(roomBusy) return roomReply(f,id,{ok:false, error:'busy'});
  const R=window.XAWorld && XAWorld.registry && XAWorld.registry(); if(!R) return roomReply(f,id,{ok:false, error:'not-available'});
  roomBusy=true;
  const name=String(d.door||'');
  R.door(t.space,name).then(r=>{
    if(state!=='room' || roomCur!==t){ roomBusy=false; return null }
    if(!r.ok){ roomBusy=false; roomNote('COULD NOT CHECK THE DOOR · TRY AGAIN'); roomReply(f,id,{ok:false, error:'could-not-check'}); return null }
    const pt=r.value && r.value.portal;
    if(!pt || !(pt.to>0)){ roomBusy=false; roomReply(f,id,{ok:false, error:'unknown-door'}); return null }
    return resolveDest(pt.to,true).then(dr=>{
      roomBusy=false;
      if(state!=='room' || roomCur!==t) return;
      const nt=targetOf(dr);
      if(nt.kind==='lobby'){ roomReply(f,id,{ok:true}); leaveRoom(); return }   // the hall's own lobby: back into the 3D world
      if(nt.kind!=='page'){ roomNote(doorSays(nt)); roomReply(f,id,{ok:false, error:nt.kind==='unknown'?'could-not-check':nt.kind==='closed'?'closed':nt.kind==='big'?'too-big':'not-open'}); return }
      roomReply(f,id,{ok:true});
      roomStack.push({kind:'room', t, door:{name, id:r.value.id}});
      if(roomStack.length>16) roomStack.splice(1,1);           // a long walk forgets its oldest rooms, never the way back to the hall
      showRoom(withEntry(nt,{from:t.slug||'', door:name, arrival:pt.arrival}));
    });
  });
}
// call({contract, fn, args, postConditions, maxStx}): only from a HOSTED room (runtime 3), only to a contract the registry approves at the
// moment of the call (is-approved), only after the player says yes in the hall's own dialog, and signed through the hall's wallet path
// (XAScores.callContract: deny mode, one STX post-condition capped at maxStx, no `sender`, an account mismatch aborts).
// maxStx is STX as a decimal (up to 6 places). postConditions may only repeat that cap ({type:'stx', amount: micro-STX <= maxStx}).
function cleanCall(d){
  const contract=String(d.contract||''), fn=String(d.fn||'');
  if(!/^S[0-9A-Z]{25,41}\.[a-zA-Z][a-zA-Z0-9-]{0,39}$/.test(contract)) return {why:'contract'};
  if(!/^[a-zA-Z][a-zA-Z0-9!?_-]{0,127}$/.test(fn)) return {why:'fn'};
  const args=d.args==null?[]:d.args;
  if(!Array.isArray(args) || args.length>32 || !args.every(a=>typeof a==='string' && /^(0x)?([0-9a-fA-F]{2})+$/.test(a) && a.length<=131074)) return {why:'args'};
  const m=/^([0-9]{1,9})(?:\.([0-9]{1,6}))?$/.exec(typeof d.maxStx==='number' && isFinite(d.maxStx) && d.maxStx>=0 ? d.maxStx.toFixed(6).replace(/\.?0+$/,'') : String(d.maxStx==null?'':d.maxStx));
  if(!m) return {why:'maxStx'};
  const maxUstx=BigInt(m[1])*1000000n+BigInt((m[2]||'').padEnd(6,'0')||'0');
  const pcs=d.postConditions==null?[]:d.postConditions;
  if(!Array.isArray(pcs) || pcs.length>4 || !pcs.every(p=>p && typeof p==='object' && p.type==='stx' && /^[0-9]{1,16}$/.test(String(p.amount)) && BigInt(String(p.amount))<=maxUstx)) return {why:'postConditions'};
  return {ok:true, contract, fn, args, maxUstx:maxUstx.toString()};
}
async function roomCall(f,id,d,t){
  if(!t || t.kind!=='page' || t.runtime!==3) return roomReply(f,id,{ok:false, error:'not-hosted'});
  const c=cleanCall(d); if(!c.ok) return roomReply(f,id,{ok:false, error:'bad-request:'+c.why});
  if(callBusy) return roomReply(f,id,{ok:false, error:'busy'});
  const R=window.XAWorld && XAWorld.registry && XAWorld.registry(), S=window.XAScores;
  if(!R || !S || !S.callContract || !window.XARoom || !XARoom.confirmCall) return roomReply(f,id,{ok:false, error:'not-available'});
  callBusy=true;
  try{
    const ap=await R.approved(c.contract);
    if(!ap.ok) return roomReply(f,id,{ok:false, error:'could-not-check'});
    if(!ap.value) return roomReply(f,id,{ok:false, error:'not-approved'});
    if(state!=='room' || roomCur!==t) return;
    const who=(S.status()||{}).address||'';
    if(document.pointerLockElement) document.exitPointerLock();
    const yes=await XARoom.confirmCall({room:t.title, contract:c.contract, fn:c.fn, maxUstx:c.maxUstx, address:who});
    if(!yes) return roomReply(f,id,{ok:false, error:'cancelled'});
    if(state!=='room' || roomCur!==t) return;
    const r=await S.callContract({contract:c.contract, fn:c.fn, args:c.args, maxUstx:c.maxUstx, expectAddress:who});
    roomReply(f,id,{ok:true, txid:r.txid});
  }catch(e){ roomReply(f,id,{ok:false, error:String((e&&e.code===4001)?'cancelled':(e&&e.message)||e).slice(0,200)}) }
  finally{ callBusy=false }
}
// A door that leads somewhere: you walk into an open doorway to go through it (there is no button). The lobby is already there, behind its wall,
// so walking in needs nothing; any other door is read from the chain (or a preview room in XA_ROOMS) and either opens its room or says why not.
function toast(text,ms){ bayToast={text, until:performance.now()+(ms||3500)}; updateBayFocus() }
function bayEnter(link, bayIdx){
  if(isLobbyLink(link) && lobbyPass) return;
  const seq=++enterSeq;
  const slow=setTimeout(()=>{ if(seq===enterSeq && state==='walk') toast('CHECKING THE DOOR…',8000) },300);
  doorTarget(link,bayIdx).then(t=>{
    clearTimeout(slow);
    if(seq!==enterSeq || state!=='walk') return;
    if(t.kind==='page' || t.kind==='src'){ bayToast=null; enterRoom(t,bayIdx); return }
    if(t.kind==='lobby') return;
    toast(doorSays(t), t.kind==='unknown'?4500:3500);
  });
}
// Walking into an open doorway (the door's own width, up against the wall) goes through it. It fires once per arrival, not every frame.
let inDoorway=-1, roomWantT=0, roomRested=false, prepAt=0;   // roomRested: you have just come out of a room, so it is not loaded again until you have moved away or shut the door
function checkDoorways(){
  if(!bayEngine || !bayDefsAll.length) return;
  const lob=inLobbyZone(), n=bayEngine.count?bayEngine.count():bayDefsAll.length; let hit=-1, link=null;
  for(let i=0;i<n;i++){
    if(lob ? i<HALL_BAYS : i>=HALL_BAYS) continue;
    const d=bayEngine.doorwayAt(i,player.x,player.z);
    if(d && d.interaction===3 && d.z<.6 && Math.abs(d.x)<d.half-.08){ hit=i; link=d.link; break }
  }
  if(hit!==inDoorway){ inDoorway=hit; if(hit>=0) bayEnter(link,hit) }
  // a door to a room is open: start loading the room. It is dropped again when the door has been shut (or you have left) for a while.
  const now=performance.now(); let want=null;
  for(let i=lob?HALL_BAYS:0;i<(lob?n:HALL_BAYS) && !want;i++){
    const d=bayEngine.doorwayAt(i,player.x,player.z), l=d&&d.link;
    if(l && !isLobbyLink(l) && (l.to || roomCfg(linkSlug(l))) && d.z<6 && Math.abs(d.x)<4) want={bay:i, link:l};   // an open door to a room, and you are within a few steps of it
  }
  if(!want) roomRested=false;
  else if(!roomRested){ roomWantT=now;
    if(now-prepAt>500){ prepAt=now; doorTarget(want.link,want.bay).then(t=>{ if(state==='walk' && !roomRested && (t.kind==='page'||t.kind==='src') && (!roomUI||!roomUI.frame||roomUI.frameId!==t.key)) roomPrep(t) }) } }
  if(!want && roomUI && roomUI.frame && now-roomWantT>8000) roomDrop();
}
function paintBayHint(){ const el=$('bprompt'); if(!el) return; el.hidden=!bayHint; if(bayHint){ $('bptext').textContent=bayHint; const a=$('bpalt'); if(a) a.hidden=!bayHold } }

let last=performance.now(), time=0;
function frame(now){
  const dt=Math.min(.05,(now-last)/1000); last=now; time+=dt;
  requestAnimationFrame(frame);
  if(state==='play' || state==='room') return;     // a game or a room (the casino) has the screen; the hall sleeps

  if(state==='walk' && !modalOpen()){ move(dt) }
  if(state==='walk' || state==='intro'){
    camera.position.set(player.x, EYE+Math.sin(player.bob)*WALK.bobAmp, player.z);
    camera.rotation.set(player.pitch, player.yaw, 0);
    if(state==='intro') player.yaw = Math.sin(time*.15)*.18;
  }
  if(state==='walk'){ const f=findFocus(); if(f!==focusIdx){ focusIdx=f; updateHud() } updatePosterFocus() }
  if(state==='walk' || state==='intro') tickCentreScreen();

  if(tween){
    tween.t+=dt; const k=clamp(tween.t/tween.dur,0,1), e=easeIO(k);
    camera.position.lerpVectors(tween.fromP,tween.toP,e);
    camera.quaternion.copy(tween.fromQ).slerp(tween.toQ,e);
    if(!tween.faded && tween.t>=tween.fadeAt){ tween.faded=true; $('flash').style.opacity=1 }
    if(k>=1){ const d=tween.done; tween=null; if(state==='zoom') setTimeout(d,300); else d() }
  }

  // START buttons: gentle pulse, bright on the machine you face, press animation
  for(const m of machines){
    const on=m.i===focusIdx && state!=='intro';
    m.startMat.emissiveIntensity = on ? 1.2+Math.sin(time*8)*.5 : .35+Math.sin(time*2+m.i)*.15;
    if(m.press>=0){ m.press+=dt; const p=m.press<.1 ? m.press/.1 : Math.max(0,1-(m.press-.1)/.15); m.startBtn.position.y=.016-.012*p; if(m.press>.3){m.press=-1; m.startBtn.position.y=.016} }
  }

  updateNeon(time,dt);
  if(bayEngine){ if(lobbyBay>=0 && inLobbyZone()) bayEngine.doorOpen(lobbyBay); bayEngine.update(dt,time); updateBayFocus(); if(state==='walk') checkDoorways() }

  updateScreens(dt);
  updateAnimPosters(time);
  Room.update(dt);

  renderer.render(scene,camera);
}

addEventListener('resize', ()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight) });

/* ---------- boot (wait briefly for the sign fonts) ---------- */
const fontsReady = document.fonts && document.fonts.load
  ? Promise.race([Promise.all(['64px Bungee','64px Monoton','28px VT323'].map(f=>document.fonts.load(f))), new Promise(r=>setTimeout(r,2500))]).catch(()=>{})
  : Promise.resolve();
fontsReady.then(()=>{
  buildRoom(); placeCabinets(); startChainClock();
  for(const m of machines) drawAttract(m,0);
  updateHud();
  requestAnimationFrame(t=>{ last=t; frame(t) });
});
})();

