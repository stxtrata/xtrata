/* Standalone studio. It consumes the same model, game canvas and controls as
 * the room. The only account is the clearly labelled host test account. */
(async () => {
  'use strict';
  const $ = id => document.getElementById(id);
  const stage = $('stage'), frame = $('gameFrame'), studio = $('studio');
  const V3 = (x,y,z) => new THREE.Vector3(x,y,z);
  const SV_PITCH = .16, SOLVER_ITERATIONS = 40;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const actions = new Map(), roles = new Map(), capRest = new Map(), hitButtons = new Map();
  let api = null, view = 'cabinet', fullscreen = false, active = false;
  let lastUi = {}, rev = -1, lastFrame = 0, lastPoll = 0, lastMeters = '', fitStats = null;
  let orbit = {azimuth:.24,elevation:.10,distance:12.5}, down = null, dragging = false;
  let launchPhase='',launchStarted=0,liftUntil=0,lastWinSpin=-1;
  const counts = {}, actionLog = [];
  const fmt = n => Number.isFinite(Number(n)) ? Number(n).toLocaleString('en-GB',{maximumFractionDigits:2}) : 'CHECKING';

  function toast(s) {
    $('toast').textContent = s; $('toast').classList.add('show');
    clearTimeout(toast.timer); toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3200);
  }
  function fail(e) {
    console.error(e); $('boot').style.display='flex';
    $('bootDetail').textContent=String(e?.message||e);
    $('boot').querySelector('strong').textContent='LAUNCHPAD COULD NOT START';
  }
  async function unzip(data) {
    if (!window.DecompressionStream) throw Error('This build needs gzip decompression support. Open it in a current Chrome, Safari, Firefox or Edge.');
    const bytes=Uint8Array.from(atob(data), c=>c.charCodeAt(0));
    return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  }
  function recordAction(name) {
    counts[name]=(counts[name]||0)+1; actionLog.push({name,time:Date.now()});
    if(actionLog.length>60)actionLog.shift();
  }
  function action(name,value) {
    if(!api||!active)return;
    recordAction(name);
    try {
      if(name==='fullscreen') { api.stopAuto?.();setFullscreen(!fullscreen); return; }
      api.action(name,value);
      for(const b of document.querySelectorAll('[data-action="'+name+'"]')) {
        b.classList.add('pressed'); setTimeout(()=>b.classList.remove('pressed'),130);
      }
      updateUi(true);
    } catch(e) { toast(e.message||String(e)); }
  }

  // The host owns the frame. Game panels therefore remain usable in both
  // normal and fullscreen presentation without porting or cloning their DOM.
  async function setFullscreen(on, native=true) {
    if(!api)return;
    fullscreen=!!on;
    document.body.classList.toggle('fullscreen-mode',fullscreen);
    frame.classList.toggle('full-layer',fullscreen);
    frame.classList.toggle('panel-layer',!fullscreen&&!!lastUi.modalOpen);
    frame.setAttribute('aria-hidden',String(!fullscreen&&!lastUi.modalOpen));
    api.fullscreen?.(fullscreen);
    if(fullscreen) {
      frame.focus();
      if(native&&!document.fullscreenElement&&document.documentElement.requestFullscreen) {
        try { await document.documentElement.requestFullscreen(); } catch(_) { /* iOS / embedded fixed-layer fallback */ }
      }
    } else {
      if(native&&document.fullscreenElement&&document.exitFullscreen) {
        try { await document.exitFullscreen(); } catch(_) {}
      }
      resize(); $('fullTop').focus({preventScroll:true});
    }
  }
  document.addEventListener('fullscreenchange',()=>{
    if(!document.fullscreenElement&&fullscreen)setFullscreen(false,false);
  });

  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#111b24');
  if(THREE.FogExp2)scene.fog=new THREE.FogExp2('#111b24',.024);
  const camera=new THREE.PerspectiveCamera(32,1,.05,100);
  let renderer;
  try {
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.15;
    renderer.outputEncoding=THREE.LinearEncoding;
    renderer.shadowMap.enabled=true;
    if(THREE.PCFSoftShadowMap)renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  } catch(_) { renderer=new SoftwareRenderer(); }
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,renderer.software?1.25:1.7));
  renderer.domElement.setAttribute('aria-label','Interactive Launchpad cabinet. Use the accessible controls below or click the physical buttons.');
  renderer.domElement.tabIndex=0;
  stage.insertBefore(renderer.domElement,stage.firstChild);
  $('rendererNote').textContent=renderer.software?'SOFTWARE RENDERER':'THREE r128 · STUDIO PREVIEW';
  scene.add(new THREE.HemisphereLight('#eaf7f6','#202027',1.4));
  function light(color,intensity,x,y,z) {
    const l=new THREE.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);return l;
  }
  const key=light('#fff3db',2.3,3,8,7),fill=light('#c3e8ee',1.05,-5,4,4);
  light('#ff9b51',1.2,1,5,-4);
  key.castShadow=true;
  if(key.shadow) {key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=8;key.shadow.camera.bottom=-3;key.shadow.bias=-.001;}
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:'#101922',roughness:.8,metalness:.18}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.012;ground.receiveShadow=true;scene.add(ground);
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=256;
  const gg=glowCanvas.getContext('2d'),gr=gg.createRadialGradient(128,128,3,128,128,126);
  gr.addColorStop(0,'#f9731677');gr.addColorStop(.35,'#f973163d');gr.addColorStop(1,'#f9731600');gg.fillStyle=gr;gg.fillRect(0,0,256,256);
  const glowTex=new THREE.CanvasTexture(glowCanvas);
  const floorGlow=new THREE.Mesh(new THREE.PlaneGeometry(7,6),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
  floorGlow.rotation.x=-Math.PI/2;floorGlow.position.set(0,.008,.7);scene.add(floorGlow);

  function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('A bundled cabinet texture could not be decoded.'));i.src=src;});}
  const images=await Promise.all(MODEL.textures.map(t=>loadImage(t.image)));
  const geos=MODEL.geometries.map(g=>{
    const o=new THREE.BufferGeometry();
    for(const [k,a] of Object.entries(g.attributes))o.setAttribute(k,new THREE.BufferAttribute(new Float32Array(a.array),a.size));
    if(g.index)o.setIndex(g.index);
    for(const gr of g.groups||[])o.addGroup(gr.start,gr.count,gr.materialIndex);
    o.computeBoundingBox();o.computeBoundingSphere();return o;
  });
  const textures=MODEL.textures.map((t,i)=>{
    const o=new THREE.Texture(images[i]);o.wrapS=t.wrapS;o.wrapT=t.wrapT;
    o.repeat.fromArray(t.repeat);o.offset.fromArray(t.offset);o.flipY=t.flipY;o.anisotropy=4;o.needsUpdate=true;return o;
  });
  const env=document.createElement('canvas');env.width=512;env.height=256;
  const eg=env.getContext('2d'),en=eg.createLinearGradient(0,0,0,256);
  en.addColorStop(0,'#d6e4e6');en.addColorStop(.33,'#64747b');en.addColorStop(.49,'#c7b99a');en.addColorStop(.55,'#29333c');en.addColorStop(1,'#121a22');
  eg.fillStyle=en;eg.fillRect(0,0,512,256);eg.fillStyle='#f3f1df';eg.fillRect(70,25,38,125);eg.fillRect(340,40,20,105);
  const envTex=new THREE.CanvasTexture(env);envTex.mapping=THREE.EquirectangularReflectionMapping;
  const mats=MODEL.materials.map(m=>{
    const p={color:m.color,map:m.map==null?null:textures[m.map],transparent:m.transparent,opacity:m.opacity,
      side:m.side,depthWrite:m.depthWrite,alphaTest:m.alphaTest};
    if(m.type==='basic')return new THREE.MeshBasicMaterial(p);
    return new THREE.MeshStandardMaterial({...p,roughness:m.roughness,metalness:m.metalness,emissive:m.emissive||0,
      emissiveIntensity:m.emissiveIntensity||0,flatShading:m.flatShading,envMap:envTex,envMapIntensity:.55});
  });
  function unpack(n) {
    const o=n.g==null?new THREE.Group():new THREE.Mesh(geos[n.g],Array.isArray(n.m)?n.m.map(i=>mats[i]):mats[n.m]);
    o.position.fromArray(n.p);o.quaternion.fromArray(n.q);o.scale.fromArray(n.s);o.visible=n.visible!==false;
    o.name=n.role?'px-'+n.role:(n.name||'');o.userData={...(n.userData||{}),role:n.role||''};
    if(n.action)o.userData.pxMachineAction=n.action;
    if(n.role) {if(!roles.has(n.role))roles.set(n.role,[]);roles.get(n.role).push(o);}
    if(n.action) {if(!actions.has(n.action))actions.set(n.action,[]);actions.get(n.action).push(o);}
    if(n.role?.startsWith('btn-'))capRest.set(o,o.position.z);
    o.castShadow=!!o.isMesh;o.receiveShadow=!!o.isMesh;
    if(o.material?.isMeshBasicMaterial)o.castShadow=false;
    for(const c of n.children)o.add(unpack(c));return o;
  }
  const machine=unpack(MODEL.root);scene.add(machine);machine.updateMatrixWorld(true);
  const screenMesh=roles.get('screenMesh')?.[0],deck=roles.get('deck')?.[0],crest=roles.get('crest')?.[0],lever=roles.get('lever')?.[0],cover=roles.get('launchCover')?.[0];
  if(!screenMesh||!deck)throw Error('The packed cabinet is missing its screen or control deck.');
  const crestY=crest?.position.y||0,coverBase=cover?.rotation.x||0;
  const screenTex=new THREE.CanvasTexture(document.createElement('canvas'));
  screenTex.anisotropy=8;screenMesh.material=new THREE.MeshBasicMaterial({map:screenTex,color:'#ffffff'});
  const sceneBox=new THREE.Box3().setFromObject(machine),boxSize=sceneBox.getSize(new THREE.Vector3()),boxCenter=sceneBox.getCenter(new THREE.Vector3());

  // A handful of restrained, transparent steam puffs, generated as geometry.
  const steam=[];
  if(!reduced) {
    const puffCanvas=document.createElement('canvas');puffCanvas.width=puffCanvas.height=64;
    const p=puffCanvas.getContext('2d'),g=p.createRadialGradient(32,32,0,32,32,32);
    g.addColorStop(0,'#dbe9e855');g.addColorStop(1,'#dbe9e800');p.fillStyle=g;p.fillRect(0,0,64,64);
    const map=new THREE.CanvasTexture(puffCanvas);
    for(let i=0;i<6;i++) {
      const m=new THREE.Mesh(new THREE.PlaneGeometry(.27,.27),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,opacity:.28,side:THREE.DoubleSide}));
      m.userData.steamIndex=i;scene.add(m);steam.push(m);
    }
  }
  const telemetrySurfaces={};
  for(const role of ['jackpotMeter','fundMeter']) {
    const mesh=roles.get(role)?.[0];if(!mesh)continue;
    const c=document.createElement('canvas');c.width=1300;c.height=role==='fundMeter'?80:135;
    const t=new THREE.CanvasTexture(c);mesh.material=new THREE.MeshBasicMaterial({map:t});
    telemetrySurfaces[role]={canvas:c,ctx:c.getContext('2d'),texture:t};
  }
  function meters(u) {
    const data=JSON.stringify([u.jackpot,u.fund,u.bet,u.practice]);if(data===lastMeters)return;lastMeters=data;
    const j=telemetrySurfaces.jackpotMeter;
    if(j) {
      const c=j.ctx;c.fillStyle='#0b151b';c.fillRect(0,0,1300,135);c.textAlign='center';c.textBaseline='middle';
      c.font='bold 22px Arial';c.fillStyle='#a4b8b9';c.fillText(u.practice?'PRACTICE JACKPOT':'CASINO JACKPOT',650,31);
      c.font='bold 49px monospace';c.fillStyle='#ffd5a1';
      const n=typeof u.jackpot==='object'?u.jackpot.amount??u.jackpot.meter:u.jackpot;
      c.fillText(fmt(n)+(Number.isFinite(Number(n))?' LAYR':''),650,91);j.texture.needsUpdate=true;
    }
    const f=telemetrySurfaces.fundMeter;
    if(f) {
      const c=f.ctx,fd=u.fund||{};c.fillStyle='#0b151b';c.fillRect(0,0,1300,80);c.textAlign='center';c.textBaseline='middle';
      c.fillStyle='#c5d0c6';c.font='bold 18px monospace';
      c.fillText('MACHINE FUND · '+(Number.isFinite(fd.balance)?fmt(fd.balance)+' LAYR':'CHECKING')+' · ALL LIVE TWINS',650,24);
      c.fillStyle='#8ce4de';c.font='18px monospace';
      c.fillText((fd.periodEnd?'ENDS '+new Date(fd.periodEnd).toLocaleDateString('en-GB',{day:'2-digit',month:'short',timeZone:'UTC'}).toUpperCase()+' 00:00 UTC':'WEEKLY · MONDAY 00:00 UTC')+' / LAST PAY: '+(Number.isFinite(fd.lastPay)?fmt(fd.lastPay)+' PER TWIN':'CHECKING'),650,57);f.texture.needsUpdate=true;
    }
  }

  function worldCorners(mesh) {
    mesh.geometry.computeBoundingBox();const b=mesh.geometry.boundingBox,pts=[];
    for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])pts.push(V3(x,y,z).applyMatrix4(mesh.matrixWorld));
    return pts;
  }
  function projectPoints(pts) {
    let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    const w=stage.clientWidth,h=stage.clientHeight;
    for(const pt of pts) {const p=pt.clone().project(camera),x=(p.x+1)*w/2,y=(1-p.y)*h/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    return {left,top,right,bottom,width:right-left,height:bottom-top};
  }
  const spinAssembly=roles.get('spinPhysical')?.[0],spinRestZ=spinAssembly?.position.z;
  const faces=new Map([...capRest.keys()].map(cap=>{
    const face=roles.get('btnface-'+cap.userData.pxMachineAction)?.[0];
    return [cap,face?{mesh:face,z:face.position.z}:null];
  }));
  const screenPoints=worldCorners(screenMesh);
  const capMeshes=[...capRest.keys()];
  function deckPoints(){return capMeshes.flatMap(c=>worldCorners(c));}
  function setScreenCamera(distance) {
    let target=V3(0,2.78,.57),up=V3(0,Math.cos(SV_PITCH),-Math.sin(SV_PITCH));
    const dir=V3(0,Math.sin(SV_PITCH),Math.cos(SV_PITCH));
    camera.position.copy(target).addScaledVector(dir,distance);camera.lookAt(target);camera.updateMatrixWorld(true);
    // Translate in the camera's up direction until the glass begins 10 px
    // below the header. Perspective depth is unchanged by that translation.
    for(let i=0;i<3;i++) {
      const box=projectPoints(screenPoints),wpp=2*distance*Math.tan(camera.fov*Math.PI/360)/stage.clientHeight;
      const shift=(10-box.top)*wpp;
      target.addScaledVector(up,shift);camera.position.addScaledVector(up,shift);camera.lookAt(target);camera.updateMatrixWorld(true);
    }
    const s=projectPoints(screenPoints),d=projectPoints(deckPoints()),margin=stage.clientWidth*.04;
    const fits=Math.min(s.left,d.left)>=margin&&Math.max(s.right,d.right)<=stage.clientWidth-margin&&d.bottom<=stage.clientHeight-9&&s.top>=8;
    return {screen:s,deck:d,fits,distance};
  }
  function screenGoal() {
    machine.updateMatrixWorld(true);
    let lo=.5,hi=32;
    for(let i=0;i<SOLVER_ITERATIONS;i++) {const mid=(lo+hi)/2,b=setScreenCamera(mid);if(b.fits)hi=mid;else lo=mid;}
    fitStats={...setScreenCamera(hi),iterations:SOLVER_ITERATIONS,pitch:SV_PITCH};
    updateHitTargets();
  }
  function cabinetCamera(reset=false) {
    if(reset) {
      const v=boxSize.y/(2*Math.tan(camera.fov*Math.PI/360)),h=boxSize.x/(2*Math.tan(camera.fov*Math.PI/360)*camera.aspect);
      orbit.distance=Math.max(v,h)*1.17;orbit.azimuth=.24;orbit.elevation=.11;
    }
    const target=boxCenter.clone();target.y-=.13;
    camera.position.set(target.x+Math.sin(orbit.azimuth)*Math.cos(orbit.elevation)*orbit.distance,
      target.y+Math.sin(orbit.elevation)*orbit.distance,target.z+Math.cos(orbit.azimuth)*Math.cos(orbit.elevation)*orbit.distance);
    camera.lookAt(target);camera.updateMatrixWorld(true);
  }
  let layoutBusy=false,resizeQueued=false,lastStageBox='';
  const stageSizeKey=()=>stage.clientWidth+'x'+stage.clientHeight;
  function projectionSize() {
    camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();
    renderer.setSize(stage.clientWidth,stage.clientHeight);
  }
  function resize() {
    if(layoutBusy||fullscreen)return;
    layoutBusy=true;
    try {
      // A previous portrait fit must never constrain a new viewport or the
      // cabinet view. Measure the strip's current intrinsic size first.
      const strip=$('controlStrip');strip.style.removeProperty('height');
      if(!stage.clientWidth||!stage.clientHeight)return;
      projectionSize();
      if(view==='screen') {
        screenGoal();
        const portrait=matchMedia('(max-width:520px) and (min-height:700px) and (orientation:portrait)').matches;
        const unused=stage.clientHeight-fitStats.deck.bottom-9;
        if(portrait&&unused>1) {
          // Fixed cabinet proportions are width-limited on a tall phone.
          // Give that spare height to useful controls, then solve once more;
          // neither the screen nor the 3D model is stretched or cropped.
          const naturalHeight=strip.getBoundingClientRect().height;
          strip.style.height=Math.ceil(naturalHeight+unused)+'px';
          projectionSize();screenGoal();
        }
      } else cabinetCamera(true);
      updateHitTargets();lastStageBox=stageSizeKey();
    } finally {layoutBusy=false;}
  }
  function queueResize() {
    if(layoutBusy||resizeQueued)return;
    resizeQueued=true;requestAnimationFrame(()=>{resizeQueued=false;resize();});
  }
  function setView(next) {
    view=next;studio.dataset.view=next;
    $('screenView').classList.toggle('selected',next==='screen');$('cabinetView').classList.toggle('selected',next==='cabinet');
    $('screenView').setAttribute('aria-pressed',String(next==='screen'));$('cabinetView').setAttribute('aria-pressed',String(next==='cabinet'));
    resize();
  }
  $('screenView').onclick=()=>setView('screen');$('cabinetView').onclick=()=>setView('cabinet');

  const labels={pays:'CURVE — pays and rules',betDown:'−STX — decrease bet',spin:'LAUNCH — spin',betUp:'+STX — increase bet',auto:'AUTO-APE — automatic spins',lab:'LAB — bonus laboratory'};
  for(const cap of capMeshes) {
    const a=cap.userData.pxMachineAction;if(!a)continue;
    const b=document.createElement('button');b.type='button';b.className='physical-hit';b.setAttribute('aria-label',labels[a]||a);b.dataset.physicalAction=a;
    b.onclick=e=>{e.stopPropagation();action(a);};$('hitTargets').appendChild(b);hitButtons.set(cap,b);
  }
  const autoTarget=[...hitButtons.values()].find(b=>b.dataset.physicalAction==='auto');
  function updateHitTargets() {
    if(view==='screen')$('screenMask').style.top=Math.min(stage.clientHeight,projectPoints(deckPoints()).bottom+6)+'px';
    for(const [cap,b] of hitButtons) {
      b.hidden=view!=='screen';if(b.hidden)continue;
      const q=projectPoints(worldCorners(cap)),w=Math.max(44,q.width),h=Math.max(44,q.height),cx=(q.left+q.right)/2,cy=(q.top+q.bottom)/2;
      const a=cap.userData.pxMachineAction;
      // At short landscape heights the LAB minimum target grows over Auto.
      // Keep Auto's centre clickable while preserving LAB's 44px target.
      const autoCentre=autoTarget?autoTarget.offsetLeft+autoTarget.offsetWidth/2:0;
      const left=a==='lab'?Math.max(cx-w/2,autoCentre+2):cx-w/2;
      b.style.left=Math.max(0,Math.min(stage.clientWidth-w,left))+'px';
      b.style.top=Math.max(projectPoints(screenPoints).bottom+2,Math.min(stage.clientHeight-h,cy-h/2))+'px';
      b.style.width=w+'px';b.style.height=h+'px';
      b.disabled=a==='spin'?!!lastUi.spinDisabled:a==='betDown'?!!lastUi.betDownDisabled:a==='betUp'?!!lastUi.betUpDisabled:false;
    }
  }
  function bounds() {
    const r=stage.getBoundingClientRect(),top=$('topbar').getBoundingClientRect(),bottom=$('controlStrip').getBoundingClientRect();
    const offset=b=>({...b,left:b.left+r.left,right:b.right+r.left,top:b.top+r.top,bottom:b.bottom+r.top});
    return {view,viewport:{width:innerWidth,height:innerHeight},topbarBottom:top.bottom,controlsTop:bottom.top,
      screen:offset(projectPoints(worldCorners(screenMesh))),deck:offset(projectPoints(deckPoints())),
      buttons:capMeshes.map(c=>{const q=offset(projectPoints(worldCorners(c))),b=hitButtons.get(c)?.getBoundingClientRect();return {action:c.userData.pxMachineAction,label:labels[c.userData.pxMachineAction],...q,target:b?{left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height}:null};}),
      pitch:view==='screen'?SV_PITCH:null,iterations:view==='screen'?SOLVER_ITERATIONS:0,renderer:renderer.software?'software':'webgl',fits:fitStats?.fits};
  }
  // Read-only diagnostics; this exposes no state, engine, forcing or mutation.
  window.PX_STUDIO=Object.freeze({viewBounds:bounds,diagnostics:()=>({ready:active,view,fullscreen,renderer:renderer.software?'software':'webgl',actions:{...counts},recentActions:actionLog.map(x=>({...x})),triangles:renderer.info.render.triangles})});

  const ray=new THREE.Raycaster();
  function hit(event) {
    const r=renderer.domElement.getBoundingClientRect();
    ray.setFromCamera({x:(event.clientX-r.left)/r.width*2-1,y:1-(event.clientY-r.top)/r.height*2},camera);
    const hits=ray.intersectObject(machine,true);
    for(const h of hits) {
      let o=h.object,selected=null;
      while(o&&o!==machine) {
        if(o.userData.role==='lever'||o.userData.role==='launchCover'){selected='lever';break;}
        if(o.userData.pxMachineAction){selected=o.userData.pxMachineAction;break;}
        if(o.userData.role==='fundMeter'){selected='fund';break;}
        o=o.parent;
      }
      if(selected){action(selected);return;}
      if(h.object===screenMesh&&h.uv){api?.tap(h.uv.x*1400,(1-h.uv.y)*960);updateUi(true);return;}
      // Opaque cabinet surfaces block clicks to controls behind them.
      if(h.object.material&&!h.object.material.transparent)return;
    }
  }
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,azimuth:orbit.azimuth,elevation:orbit.elevation};dragging=false;renderer.domElement.setPointerCapture(e.pointerId);});
  renderer.domElement.addEventListener('pointermove',e=>{
    if(!down||view!=='cabinet')return;
    const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>5)dragging=true;
    if(dragging){orbit.azimuth=Math.max(-1.05,Math.min(1.05,down.azimuth+dx*.006));orbit.elevation=Math.max(-.02,Math.min(.40,down.elevation+dy*.003));cabinetCamera();}
  });
  renderer.domElement.addEventListener('pointerup',e=>{if(down&&!dragging)hit(e);down=null;dragging=false;});
  renderer.domElement.addEventListener('pointercancel',()=>{down=null;dragging=false;});
  renderer.domElement.addEventListener('wheel',e=>{if(view!=='cabinet')return;e.preventDefault();orbit.distance=Math.max(7,Math.min(23,orbit.distance*Math.exp(e.deltaY*.0006)));cabinetCamera();},{passive:false});
  for(const b of document.querySelectorAll('[data-action]'))b.onclick=()=>action(b.dataset.action);
  $('hostVolume').oninput=e=>action('volume',Number(e.target.value));
  document.addEventListener('keydown',e=>{
    if(e.repeat||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.code==='Space'){e.preventDefault();action('spin');}
    else if(e.key.toLowerCase()==='f'){e.preventDefault();action('fullscreen');}
    else if(e.key.toLowerCase()==='l'){e.preventDefault();action('lab');}
    else if(e.key==='Escape'){if(fullscreen)setFullscreen(false);else api?.closeModal?.();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)api?.stopAuto?.();});
  addEventListener('pagehide',()=>{active=false;api?.stopAuto?.();api?.deactivate?.();renderer.dispose?.();});

  function updateUi(force=false) {
    if(!api)return;
    const u=api.ui();lastUi=u;
    if(u.spins!==lastWinSpin){lastWinSpin=u.spins;if(u.win>=u.bet*5)liftUntil=performance.now()+1800;}
    $('balance').textContent=fmt(u.balance);$('betValue').textContent=fmt(u.bet);$('winValue').textContent=fmt(u.win);
    $('statusText').textContent=u.status||'SYSTEM READY';$('practiceNotice').hidden=!u.practice;
    for(const b of document.querySelectorAll('[data-action]')) {
      const a=b.dataset.action;
      if(a==='spin')b.disabled=!!u.spinDisabled;
      else if(a==='betDown')b.disabled=!!u.betDownDisabled;
      else if(a==='betUp')b.disabled=!!u.betUpDisabled;
      if(a==='auto'||a==='turbo')b.setAttribute('aria-pressed',String(!!u[a]));
      if(a==='sound'){b.setAttribute('aria-pressed',String(!u.muted));b.textContent=u.muted?'Sound off':'Sound on';}
    }
    const f=$('featureAction');f.hidden=!u.featureLabel;f.querySelector('b').textContent=u.featureLabel||'CONTINUE';
    if(document.activeElement!==$('hostVolume')&&Number.isFinite(u.volume))$('hostVolume').value=u.volume;
    if(!fullscreen) {
      const was=frame.classList.contains('panel-layer');
      frame.classList.toggle('panel-layer',!!u.modalOpen);frame.setAttribute('aria-hidden',String(!u.modalOpen));
      if(u.modalOpen&&!was)frame.focus();
    }
    meters(u);updateHitTargets();
  }
  const capSprings=new Map();
  function leverCurve(s) {
    if(s<.26){const u=s/.26;return u*u*(3-2*u);}
    if(s<.38)return 1+.02*Math.sin((s-.26)*70)*Math.exp(-(s-.26)*12);
    if(s<.72){const u=(s-.38)/.34;return 1-u*u*(3-2*u);}
    return -.08*Math.sin(Math.PI*Math.min(1,(s-.72)/.18));
  }
  function mechanics(t,dt) {
    if(!api)return;
    const m=api.mechanics?.()||{},calm=reduced||!!m.reduced;
    if(lever){const l=m.lever;lever.rotation.x=l?leverCurve(l.elapsed/1000)*l.angle:0;}
    if(cover){const l=m.lever;cover.rotation.x=coverBase-(l?Math.sin(Math.min(1,l.elapsed/l.duration)*Math.PI)*.8:0);}
    for(const [cap,z0] of capRest) {
      const a=cap.userData.pxMachineAction;
      const spring=capSprings.get(cap)||{x:0,v:0};
      const target=m.buttons?.[a]?1:0, w=target?62:36, damping=target?1:.36;
      const step=Math.min(.12,Math.max(.001,dt)), n=Math.max(4,Math.ceil(step*240)), h=step/n;
      for(let i=0;i<n;i++){spring.v+=(-w*w*(spring.x-target)-2*damping*w*spring.v)*h;spring.x+=spring.v*h;}
      spring.x=Math.max(-.14,Math.min(1.03,spring.x));
      if(Math.abs(spring.x-target)<.002&&Math.abs(spring.v)<.02){spring.x=target;spring.v=0;}
      if(a==='spin'&&spinAssembly)spinAssembly.position.z=spinRestZ-spring.x*.05;
      else {
        const depth=spring.x*.034,face=faces.get(cap);
        cap.position.z=z0-depth;
        if(face)face.mesh.position.z=face.z-depth;
      }
      capSprings.set(cap,spring);
    }
    const jackpot=/jackpot|graduation.day/i.test(lastUi.sceneDetail?.kind||'');
    const phase=jackpot?lastUi.sceneDetail.stage:'';
    if(phase!==launchPhase){launchPhase=phase;if(phase==='play')launchStarted=t;}
    if(crest) {
      if(!calm)crest.rotation.y+=dt*.0733;
      const launch=jackpot&&phase==='play'&&!calm?Math.min(6,Math.pow(Math.max(0,t-launchStarted)/850,2)):0;
      const lift=t<liftUntil?Math.sin(Math.max(0,1800-(liftUntil-t))/1800*Math.PI)*(calm?.035:.16):0;
      crest.position.y=crestY+launch+(jackpot?(calm?.06:.20+.06*Math.sin(t*.002)):lift);
    }
    for(let i=0;i<steam.length;i++) {
      const p=steam[i];p.visible=!calm;const u=(t*.00017+i/steam.length)%1,s=i%2?-1:1;
      p.position.set(s*(.44+u*.28),5.02+u*.58,-.02+Math.sin(t*.0006+i)*.10);
      p.quaternion.copy(camera.quaternion);p.scale.setScalar(.45+u*1.3);p.material.opacity=.25*(1-u)*(jackpot?1.4:1);
    }
    floorGlow.material.opacity=jackpot&&!calm?.8+.18*Math.sin(t*.004):.8;
    machine.updateMatrixWorld(true);
  }
  function tick(t) {
    requestAnimationFrame(tick);
    if(t-lastFrame<32||document.hidden)return;
    const dt=Math.min(.08,(t-lastFrame)/1000);lastFrame=t;
    if(api) {
      const v=api.revision?.();if(v!==rev){rev=v;screenTex.needsUpdate=true;}
      if(t-lastPoll>100){lastPoll=t;updateUi();}
      mechanics(t,dt);
    }
    if(!fullscreen)renderer.render(scene,camera);
  }
  new ResizeObserver(()=>{if(stageSizeKey()!==lastStageBox)queueResize();}).observe(stage);
  addEventListener('resize',queueResize);setView('cabinet');requestAnimationFrame(tick);
  try {
    const html=await unzip(PACK.game);
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('The game did not initialise.')),25000);
      frame.onload=()=>{clearTimeout(timer);resolve();};frame.srcdoc=html;
    });
    api=frame.contentWindow.PX_CASINO_ENGINE;
    if(!api)throw Error('The packed game did not expose the room canvas-and-controls API.');
    screenTex.image=api.screen;screenTex.needsUpdate=true;
    api.fullscreenHost?.(on=>setFullscreen(on));
    await api.activate();active=true;updateUi(true);$('boot').style.display='none';
    if(renderer.software)toast('Software rendering is active. All game controls remain available.');
    resize();
  } catch(e) {fail(e);}
})().catch(e=>{
  console.error(e);const b=document.getElementById('bootDetail');if(b)b.textContent=String(e?.message||e);
});
