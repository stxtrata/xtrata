/* Standalone host only. The room supplies its own renderer and account for the identical game pack. */
(async function () {
  'use strict';
  const $=id=>document.getElementById(id),T=THREE,TEST=!!window.PX_STANDALONE_TEST;
  const fmt=n=>Number.isFinite(Number(n))?Number(n).toLocaleString('en-GB',{maximumFractionDigits:2}):'checking';
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setError=e=>{const p=$('hostError');p.hidden=false;p.textContent='The show could not start. '+(e.message||String(e));$('loading').classList.add('done');console.error(e);};
  document.body.classList.toggle('test-enabled',TEST);document.body.dataset.view='cabinet';
  const account=window.ParallaxLAYRAccount;if(!account)throw Error('Standalone LAYR account adapter is missing.');
  if(!await account.acquire())throw Error(account.error()||'The play account is open in another tab.');
  // New standalone accounts are seeded once; a genuine zero balance is never refilled automatically.
  const key='xtrata.parallax.test.corgi-kennel.layr.v1'+(window.CK_TEST_TAB?'.'+window.CK_TEST_TAB:'');
  const prior=JSON.parse(localStorage.getItem(key)||'{}');
  if(!prior.corgiTestSeeded)account.saveRoom({...(typeof prior.bank==='number'?{}:{bank:10000}),corgiTestSeeded:true});
  const paintBalance=()=>{$('hostBalance').textContent=fmt(account.balance());};account.subscribe(paintBalance);paintBalance();

  // Exact room settings: Three r128, ACES at 1.15 and linear output.
  let renderer,software=false;try{renderer=new T.WebGLRenderer({antialias:true,alpha:false});if(!renderer.getContext())throw Error('WebGL unavailable');}catch(e){renderer=new SoftwareRenderer();software=true;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
  if(!software){renderer.outputEncoding=T.LinearEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=false;}
  $('studio').appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Corgi Kennel three-dimensional cabinet');
  const scene=new T.Scene();scene.background=new T.Color('#101a12');
  const camera=new T.PerspectiveCamera(36,innerWidth/innerHeight,.03,80);
  const env=document.createElement('canvas');env.width=512;env.height=256;const eg=env.getContext('2d'),envGradient=eg.createLinearGradient(0,0,0,256);envGradient.addColorStop(0,'#fff1ce');envGradient.addColorStop(.18,'#aeae85');envGradient.addColorStop(.44,'#3c4d35');envGradient.addColorStop(.65,'#182b1e');envGradient.addColorStop(1,'#0e160f');eg.fillStyle=envGradient;eg.fillRect(0,0,512,256);
  const envTex=new T.CanvasTexture(env);envTex.mapping=T.EquirectangularReflectionMapping;
  scene.add(new T.HemisphereLight(0xffedc4,0x354635,.95));scene.add(new T.AmbientLight(0xc4d2af,.35));
  const keyLight=new T.DirectionalLight(0xffe4b4,1.5);keyLight.position.set(2.4,5,4.5);scene.add(keyLight);
  const fill=new T.DirectionalLight(0xc8ead0,.75);fill.position.set(-4,3,2);scene.add(fill);
  const rim=new T.PointLight(0xf5ad38,2.1,8,1.4);rim.position.set(-1.5,2.8,-1.6);scene.add(rim);
  const floor=new T.Mesh(new T.PlaneGeometry(60,60),new T.MeshStandardMaterial({color:'#172217',roughness:.40,metalness:.18,envMap:envTex,envMapIntensity:.35}));floor.rotation.x=-Math.PI/2;floor.position.y=-.002;scene.add(floor);
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=256;const gg=glowCanvas.getContext('2d'),gr=gg.createRadialGradient(128,128,0,128,128,128);gr.addColorStop(0,'#f5a819d0');gr.addColorStop(.3,'#c18b194e');gr.addColorStop(1,'#f59e0b00');gg.fillStyle=gr;gg.fillRect(0,0,256,256);
  const glow=new T.Mesh(new T.PlaneGeometry(2.5,1.8),new T.MeshBasicMaterial({map:new T.CanvasTexture(glowCanvas),transparent:true,depthWrite:false,opacity:.5}));glow.rotation.x=-Math.PI/2;glow.position.set(0,.006,.52);scene.add(glow);
  // Packed decoder uses the same fields and material settings as casino/index.html's packedCabinet().
  const data=typeof window.PX_MODEL==='string'?JSON.parse(window.PX_MODEL):window.PX_MODEL;
  if(!data||!data.root)throw Error('Packed cabinet model is missing.');
  const imgs=await Promise.all(data.textures.map(t=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(Error('A bundled cabinet texture did not decode.'));i.src=t.image;})));
  const geos=data.geometries.map(g=>{const o=new T.BufferGeometry();for(const [k,a]of Object.entries(g.attributes))o.setAttribute(k,new T.BufferAttribute(new Float32Array(a.array),a.size));if(g.index)o.setIndex(g.index);for(const p of g.groups||[])o.addGroup(p.start,p.count,p.materialIndex);o.computeBoundingSphere();return o;});
  const textures=data.textures.map((d,i)=>{const o=new T.Texture(imgs[i]);o.wrapS=d.wrapS;o.wrapT=d.wrapT;o.repeat.fromArray(d.repeat);o.offset.fromArray(d.offset);o.flipY=d.flipY;o.anisotropy=software?1:Math.min(8,renderer.capabilities.getMaxAnisotropy());o.needsUpdate=true;return o;});
  const materials=data.materials.map(m=>{const p={color:m.color,map:m.map==null?null:textures[m.map],transparent:m.transparent,opacity:m.opacity,side:m.side,depthWrite:m.depthWrite,alphaTest:m.alphaTest};return m.type==='basic'?new T.MeshBasicMaterial(p):new T.MeshStandardMaterial({...p,roughness:m.roughness,metalness:m.metalness,emissive:m.emissive,emissiveIntensity:m.emissiveIntensity,flatShading:m.flatShading,envMap:envTex,envMapIntensity:.65});});
  function node(n){const o=n.g==null?new T.Group():new T.Mesh(geos[n.g],Array.isArray(n.m)?n.m.map(i=>materials[i]):materials[n.m]);o.position.fromArray(n.p);o.quaternion.fromArray(n.q);o.scale.fromArray(n.s);o.visible=n.visible!==false;if(n.role){o.name='px-'+n.role;o.userData.role=n.role;}else if(n.name)o.name=n.name;if(n.action)o.userData.pxMachineAction=n.action;if(n.testOnly)o.userData.testOnly=true;n.children.forEach(c=>o.add(node(c)));return o;}
  const model=node(data.root);model.updateMatrixWorld(true);const initial=new T.Box3().setFromObject(model),scale=2.6/(initial.max.y-initial.min.y);model.scale.multiplyScalar(scale);model.position.y=-initial.min.y*scale;scene.add(model);model.updateMatrixWorld(true);
  const part=s=>model.getObjectByName('px-'+s),screenMesh=part('screenMesh'),crest=part('crest'),lever=part('lever')||part('armPivot'),deck=part('deck'),meter=part('jackpotMeter');
  if(!screenMesh||!lever||!crest)throw Error('A required cabinet part is missing.');
  const caps=[];model.traverse(o=>{if(o.userData.role==='spinPhysical'||(o.userData.role||'').startsWith('btn-')&&o.userData.pxMachineAction)caps.push({o,z:o.position.z,action:o.userData.pxMachineAction});});
  const ribbons=['ribbon-left','ribbon-right'].map(part).filter(Boolean).map(o=>({o,z:o.rotation.z}));
  const screenPos=new T.Vector3();screenMesh.getWorldPosition(screenPos);

  // The shared account exists on the parent before the game iframe boots.
  const frame=$('gameFrame');const RAF_SHIM='<script>(function(){var w=window,nat=w.requestAnimationFrame.bind(w),can=w.cancelAnimationFrame.bind(w),q=new Map(),n=0,h=0,since=0,driven=false;function run(t){h=0;since=0;var a=Array.from(q.values());q.clear();for(var i=0;i<a.length;i++){try{a[i](t)}catch(e){setTimeout(function(){throw e})}}}w.requestAnimationFrame=function(cb){var id=++n;q.set(id,cb);if(!since)since=performance.now();if(!h&&!driven)h=nat(run);return id};w.cancelAnimationFrame=function(id){q.delete(id)};w.__pxPump=function(){if(!q.size)return;var now=performance.now();if(!driven&&now-since<120)return;driven=true;if(h){can(h);h=0}run(now)}})();<\/script>';
  const injectShim=h=>{const m=/<head[^>]*>/i.exec(h);return m?h.slice(0,m.index+m[0].length)+RAF_SHIM+h.slice(m.index+m[0].length):RAF_SHIM+h;};
  $('loadingMessage').textContent='Opening the show ring…';
  const api=await new Promise((ok,no)=>{let timer=setTimeout(()=>no(Error('Game engine did not become ready.')),25000);frame.onload=()=>{const a=frame.contentWindow.PX_CASINO_ENGINE;if(a){clearTimeout(timer);ok(a);}else{clearTimeout(timer);no(Error('Game engine API is missing.'));}};frame.srcdoc=injectShim(window.PX_GAME_HTML||'');});
  await api.activate();
  const screenTexture=new T.CanvasTexture(api.screen);screenTexture.minFilter=screenTexture.magFilter=T.LinearFilter;screenTexture.generateMipmaps=false;screenMesh.material=screenMesh.material.clone();screenMesh.material.map=screenTexture;screenMesh.material.color.setHex(0xffffff);screenMesh.material.needsUpdate=true;

  // WebGL-less rendering: live canvas text stays crisp in a real projective DOM plane.
  // This uses the exact screen geometry/camera matrix, while pointer events stay on the 3D host.
  const softwarePlanes=[];
  function addSoftwarePlane(mesh,source,logicalWidth,logicalHeight,id){
    if(!software||!mesh)return null;const c=document.createElement('canvas');c.id=id;c.className='software-plane';c.width=source.width;c.height=source.height;c.style.width=logicalWidth+'px';c.style.height=logicalHeight+'px';$('studio').appendChild(c);mesh.geometry.computeBoundingBox();const b=mesh.geometry.boundingBox,local=new T.Matrix4().set((b.max.x-b.min.x)/logicalWidth,0,0,b.min.x,0,-(b.max.y-b.min.y)/logicalHeight,0,b.max.y,0,0,1,0,0,0,0,1);const p={mesh,source,c,ctx:c.getContext('2d'),local,copiedVersion:undefined};softwarePlanes.push(p);mesh.material.map=null;mesh.material.color.set('#0b2319');mesh.material.needsUpdate=true;return p;
  }
  const softwareScreen=addSoftwarePlane(screenMesh,api.screen,1400,960,'softwareGameScreen');
  function projectSoftwarePlanes(){
    if(!software)return;const viewport=new T.Matrix4().set(width/2,0,0,width/2,0,-height/2,0,height/2,0,0,1,0,0,0,0,1);
    for(const p of softwarePlanes){const front=new T.Vector3(0,0,1).transformDirection(p.mesh.matrixWorld),pos=new T.Vector3().setFromMatrixPosition(p.mesh.matrixWorld),facing=front.dot(camera.position.clone().sub(pos))>.02;p.c.style.visibility=facing&&!fullscreen?'visible':'hidden';if(!facing)continue;const m=new T.Matrix4().copy(viewport).multiply(camera.projectionMatrix).multiply(camera.matrixWorldInverse).multiply(p.mesh.matrixWorld).multiply(p.local);p.c.style.transform='matrix3d('+m.elements.join(',')+')';}
  }
  function copySoftwarePlanes(screenRevision){
    if(!software)return;
    for(const p of softwarePlanes){const version=p===softwareScreen?screenRevision:lastMeter;if(version===p.copiedVersion)continue;p.ctx.clearRect(0,0,p.c.width,p.c.height);p.ctx.drawImage(p.source,0,0);p.copiedVersion=version;}
  }

  let fullscreen=false,modalOpen=false,lastUI={},lastMeter='',lastRev=-1,view='cabinet',width=innerWidth,height=innerHeight;
  let nowGoal={yaw:.27,pitch:.12,dist:5.7,ty:1.35,cz:0},current={...nowGoal};
  let geometryDirty=true,hitsDirty=true,projectionDirty=true,lastGeometryAt=0;
  const cameraKeys=['yaw','pitch','dist','ty','cz'];
  function showFrame(){frame.classList.toggle('panel-open',modalOpen&&!fullscreen);frame.classList.toggle('fullscreen-open',fullscreen);frame.setAttribute('aria-hidden',String(!modalOpen&&!fullscreen));frame.tabIndex=modalOpen||fullscreen?0:-1;document.body.dataset.fullscreen=String(fullscreen);}
  async function showFullscreen(){if(fullscreen)return;fullscreen=true;showFrame();api.stopAuto?.();try{if(document.documentElement.requestFullscreen&&!document.fullscreenElement)await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch(e){/* Fixed viewport remains the iPhone/Safari fallback. */}frame.focus();}
  async function hideFullscreen(){if(!fullscreen)return;fullscreen=false;showFrame();try{if(document.fullscreenElement)await document.exitFullscreen();}catch(e){}resize();$('viewFullscreen').focus();}
  if(api.fullscreenHost&&typeof api.fullscreenHost.setHost==='function')api.fullscreenHost.setHost({enter:showFullscreen,exit:hideFullscreen});else if(typeof api.fullscreenHost==='function')api.fullscreenHost(on=>on?showFullscreen():hideFullscreen());
  const enterFullscreen=()=>{if(api.fullscreenHost&&typeof api.fullscreenHost.enter==='function')api.fullscreenHost.enter();else{api.fullscreen?.(true);showFullscreen();}};
  const exitFullscreen=()=>{if(api.fullscreenHost&&typeof api.fullscreenHost.exit==='function')api.fullscreenHost.exit();else{api.fullscreen?.(false);hideFullscreen();}};
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&fullscreen)exitFullscreen();});
  addEventListener('message',e=>{if(e.source!==frame.contentWindow)return;if(e.data?.type==='PX_PANEL'){modalOpen=!!e.data.open;showFrame();}if(e.data?.type==='PX_FULLSCREEN'){e.data.active?showFullscreen():hideFullscreen();}});
  $('viewFullscreen').onclick=enterFullscreen;
  const act=a=>{api.action(a);geometryDirty=true;syncUI();};
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.action)));

  // Transparent, keyboard-focusable 44px hit areas are centred on each projected physical deck cap.
  // The tiny extra Lab cap is also available as a full-size labelled button on the host strip.
  const targetNames={betDown:'−TREATS · decrease bet',betUp:'+TREATS · increase bet',auto:'AUTO-WALK · automatic spins',pays:'PEDIGREE · pay table',spin:'FETCH · spin'};
  const hitButtons=Object.entries(targetNames).map(([action,title])=>{const el=document.createElement('button');el.className='deck-hit';el.setAttribute('aria-label',title);el.title=title;el.dataset.deckAction=action;el.addEventListener('click',()=>act(action));$('deckHitAreas').appendChild(el);return {action,el};});
  const under=(o,ancestor)=>{for(let p=o;p;p=p.parent)if(p===ancestor)return true;return false;};
  const actionMeshes=[];model.traverse(o=>{if(o.isMesh&&o.userData.pxMachineAction&&!under(o,lever))actionMeshes.push(o);});
  const worldBox=o=>new T.Box3().setFromObject(o);
  const boxCorners=b=>{const a=[];for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])a.push(new T.Vector3(x,y,z));return a;};
  const screenCorners=boxCorners(worldBox(screenMesh));
  function unionBox(list){const b=new T.Box3();b.makeEmpty();for(const o of list)b.union(worldBox(o));return b;}
  const deckBox=unionBox(actionMeshes),deckCorners=boxCorners(deckBox),deckBodyCorners=boxCorners(worldBox(deck||screenMesh));
  const allBox=worldBox(model),allCorners=boxCorners(allBox);
  function place(g){const c=Math.cos(g.pitch);camera.position.set(Math.sin(g.yaw)*g.dist*c,g.ty+Math.sin(g.pitch)*g.dist,g.cz+Math.cos(g.yaw)*g.dist*c);camera.lookAt(0,g.ty,g.cz);camera.updateMatrixWorld(true);camera.matrixWorldInverse.copy(camera.matrixWorld).invert();}
  function projection(points){const b={left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity};for(const p0 of points){const p=p0.clone().project(camera),x=(p.x+1)*width/2,y=(1-p.y)*height/2;b.left=Math.min(b.left,x);b.right=Math.max(b.right,x);b.top=Math.min(b.top,y);b.bottom=Math.max(b.bottom,y);}b.width=b.right-b.left;b.height=b.bottom-b.top;return b;}
  function frameBounds(){return {top:$('topbar').getBoundingClientRect().bottom+10,bottom:$('controlStrip').getBoundingClientRect().top,left:width*.04,right:width*.96};}
  const SV_PITCH=.16;
  function screenGoal(){
    const bounds=frameBounds(),g={yaw:0,pitch:SV_PITCH,dist:1,ty:screenPos.y,cz:screenPos.z};
    const alignDeck=dist=>{
      g.dist=dist;
      let lo=screenPos.y-dist*3,hi=screenPos.y+dist*3;
      for(let i=0;i<40;i++){
        g.ty=(lo+hi)/2;place(g);
        const edge=Math.max(projection(deckCorners).bottom,projection(deckBodyCorners).bottom);
        if(edge<bounds.bottom-1)lo=g.ty;else hi=g.ty;
      }
      g.ty=(lo+hi)/2;place(g);
    };
    let lo=.18,hi=20;
    for(let i=0;i<40;i++){
      const dist=(lo+hi)/2;
      alignDeck(dist);
      const screen=projection(screenCorners),deck=projection(deckCorners);
      if(screen.top>=bounds.top&&Math.min(screen.left,deck.left)>=bounds.left&&Math.max(screen.right,deck.right)<=bounds.right)hi=dist;else lo=dist;
    }
    alignDeck(hi);
    return {...g};
  }
  function cabinetGoal(){
    const b=frameBounds(),g={yaw:.27,pitch:.11,dist:5.7,ty:1.36,cz:0},centre=(b.top+b.bottom)/2;
    const align=d=>{g.dist=d;let lo=-d,hi=d;for(let i=0;i<30;i++){g.ty=(lo+hi)/2;place(g);const p=projection(allCorners);if((p.top+p.bottom)/2<centre)lo=g.ty;else hi=g.ty;}g.ty=(lo+hi)/2;place(g);};
    let lo=2,hi=20;for(let i=0;i<40;i++){align((lo+hi)/2);const q=projection(allCorners);if(q.top>=b.top+12&&q.bottom<=b.bottom-34&&q.left>=width*.10&&q.right<=width*.90)hi=g.dist;else lo=g.dist;}align(hi);return {...g};
  }
  function setView(v,immediate=false){view=v;document.body.dataset.view=v;$('viewCabinet').classList.toggle('active',v==='cabinet');$('viewScreen').classList.toggle('active',v==='screen');$('viewCabinet').setAttribute('aria-pressed',String(v==='cabinet'));$('viewScreen').setAttribute('aria-pressed',String(v==='screen'));nowGoal=v==='screen'?screenGoal():cabinetGoal();if(immediate||reduced())current={...nowGoal};place(current);geometryDirty=hitsDirty=projectionDirty=true;updateHits();}
  $('viewCabinet').onclick=()=>setView('cabinet');$('viewScreen').onclick=()=>setView('screen');
  function resize(){width=innerWidth;height=innerHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();setView(view,true);}
  addEventListener('resize',resize);if(window.visualViewport)visualViewport.addEventListener('resize',resize);
  function updateHits(){
    const hidden=view!=='screen'||fullscreen||modalOpen;
    for(const h of hitButtons)h.el.hidden=hidden||!!h.fitHidden;
    if(hidden||!hitsDirty)return;
    // Read bounds once before writing styles; stable views need no layout reads.
    const bottom=frameBounds().bottom,positions=hitButtons.map(h=>{const cap=caps.find(c=>c.action===h.action);if(!cap)return {h,p:null};const p=projection(boxCorners(worldBox(cap.o))),v=new T.Vector3().setFromMatrixPosition(cap.o.matrixWorld).project(camera);return {h,p,x:(v.x+1)*width/2,y:(1-v.y)*height/2};}).filter(o=>o.p).sort((a,b)=>a.x-b.x);
    const gap=.5,minimum=44,compact=positions.some((p,i)=>i&&p.x-positions[i-1].x<minimum+gap);
    let fallbackLeft=null,fit=true;
    if(compact){
      // A 44px row can be offset slightly while still containing every physical cap centre.
      const step=minimum+gap,total=positions.length*minimum+(positions.length-1)*gap;
      let low=0,high=width-total;
      positions.forEach((p,i)=>{low=Math.max(low,p.x-i*step-minimum+1);high=Math.min(high,p.x-i*step-1);});
      fit=low<=high;if(fit)fallbackLeft=(low+high)/2;
    }
    for(let i=0;i<positions.length;i++){
      const {h,p,x,y}=positions[i],before=i?x-positions[i-1].x-gap:Infinity,after=i+1<positions.length?positions[i+1].x-x-gap:Infinity;
      const w=compact?minimum:Math.max(minimum,Math.min(p.width,before,after)),cx=compact&&fit?fallbackLeft+i*(minimum+gap)+minimum/2:x;
      h.fitHidden=!fit;h.el.hidden=!fit;h.el.style.left=cx+'px';h.el.style.top=y+'px';h.el.style.width=w+'px';h.el.style.height=Math.max(minimum,p.height)+'px';
    }
    if($('screenLowerMask'))$('screenLowerMask').style.top=Math.min(bottom,Math.ceil(projection(deckBodyCorners).bottom)-1)+'px';
    hitsDirty=false;
  }
  function metrics(){
    model.updateMatrixWorld(true);place(current);const bounds=frameBounds(),s=projection(screenCorners),d=projection(deckCorners);
    const pointAction=p=>document.elementFromPoint(p.x,p.y)?.closest('[data-deck-action]')?.dataset.deckAction||null;
    const buttons=[...new Set(actionMeshes.map(o=>o.userData.pxMachineAction))].map(action=>{
      const b=unionBox(actionMeshes.filter(o=>o.userData.pxMachineAction===action)),rect=projection(boxCorners(b)),center={x:(rect.left+rect.right)/2,y:(rect.top+rect.bottom)/2},h=hitButtons.find(x=>x.action===action)?.el,cap=caps.find(c=>c.action===action);
      const v=cap?new T.Vector3().setFromMatrixPosition(cap.o.matrixWorld).project(camera):null,physicalCenter=v?{x:(v.x+1)*width/2,y:(1-v.y)*height/2}:center;
      let hitTarget=null;if(h){const r=h.getBoundingClientRect();hitTarget={left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height,visible:!h.hidden,centerAction:pointAction(center),physicalCenterAction:pointAction(physicalCenter)};}
      return {action,rect,center,physicalCenter,hitTarget};
    });
    const targets=buttons.filter(b=>b.hitTarget),hitOverlaps=[];
    for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){const a=targets[i].hitTarget,b=targets[j].hitTarget,dx=Math.min(a.right,b.right)-Math.max(a.left,b.left),dy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(a.visible&&b.visible&&dx>.01&&dy>.01)hitOverlaps.push({actions:[targets[i].action,targets[j].action],width:dx,height:dy});}
    const hitTargetSize=targets.every(b=>b.hitTarget.visible&&b.hitTarget.width>=43.99&&b.hitTarget.height>=43.99),capCentersRouted=targets.every(b=>b.hitTarget.centerAction===b.action&&b.hitTarget.physicalCenterAction===b.action);
    return {view,width,height,topbarBottom:bounds.top-10,controlsTop:bounds.bottom,screen:s,deck:d,buttons,hitOverlaps,camera:{...current},renderer:software?'software':'WebGL',three:T.REVISION,passes:{screenTop:s.top>=bounds.top-1,deckInside:buttons.every(b=>b.rect.left>=0&&b.rect.right<=width&&b.rect.top>=bounds.top-1&&b.rect.bottom<=bounds.bottom+1),sideMargins:Math.min(s.left,d.left)>=bounds.left-1&&Math.max(s.right,d.right)<=bounds.right+1,hitTargetSize,hitTargetsSeparate:hitOverlaps.length===0,capCentersRouted,hitTargets:hitTargetSize&&hitOverlaps.length===0&&capCentersRouted}};
  }

  // Raycasting uses the same screen logical coordinates as the casino (1400 × 960).
  const ray=new T.Raycaster(),pointer=new T.Vector2();let drag=null;
  const hitAt=(x,y)=>{const r=renderer.domElement.getBoundingClientRect();pointer.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObject(model,true).find(h=>h.object.visible&&(h.object===screenMesh||h.object.userData.pxMachineAction));};
  renderer.domElement.addEventListener('pointerdown',e=>{const hit=hitAt(e.clientX,e.clientY);drag={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false,lever:!!hit&&under(hit.object,lever),fired:false};renderer.domElement.setPointerCapture(e.pointerId);});
  renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=drag.moved||Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>5;if(drag.lever){if(drag.moved&&!drag.fired){drag.fired=true;act('lever');}}else if(drag.moved&&view==='cabinet'){nowGoal.yaw-=dx*.006;nowGoal.pitch=Math.max(-.15,Math.min(.48,nowGoal.pitch+dy*.004));}drag.x=e.clientX;drag.y=e.clientY;});
  renderer.domElement.addEventListener('pointerup',e=>{const d=drag;drag=null;if(!d||d.moved)return;const h=hitAt(e.clientX,e.clientY);if(!h)return;if(h.object===screenMesh&&h.uv){api.tap(h.uv.x*1400,(1-h.uv.y)*960);syncUI();}else if(under(h.object,lever))act('lever');else if(h.object.userData.pxMachineAction)act(h.object.userData.pxMachineAction);});
  renderer.domElement.addEventListener('pointercancel',()=>drag=null);
  renderer.domElement.addEventListener('wheel',e=>{if(view!=='cabinet')return;e.preventDefault();nowGoal.dist=Math.max(2.4,Math.min(12,nowGoal.dist+e.deltaY*.004));},{passive:false});
  addEventListener('keydown',e=>{if(e.repeat||fullscreen||e.target.matches('input,textarea,select'))return;const k=e.key.toLowerCase();if(k==='f'){e.preventDefault();enterFullscreen();}else if(k==='escape'){api.closeModal?.();syncUI();}else if(k==='l'&&TEST){e.preventDefault();act('lab');}else if(e.code==='Space'&&!modalOpen){e.preventDefault();act('spin');}else api.key?.(e.code,e.key);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){api.stopAuto?.();api.deactivate?.();}else api.activate?.();});
  addEventListener('pagehide',()=>api.deactivate?.());

  const meterCanvas=document.createElement('canvas');meterCanvas.width=1400;meterCanvas.height=150;const mg=meterCanvas.getContext('2d'),meterTex=new T.CanvasTexture(meterCanvas);if(meter){meter.material=meter.material.clone();meter.material.map=meterTex;meter.material.needsUpdate=true;}
  addSoftwarePlane(meter,meterCanvas,1400,150,'softwareMeterScreen');
  function drawMeter(stat){const jackpot=typeof stat.jackpot==='object'?(stat.jackpot.amount??stat.jackpot.meter):stat.jackpot;const fund=typeof stat.fund==='object'?stat.fund.balance:stat.fund;const key=[jackpot,fund,stat.bet,stat.periodEnd,stat.lastPayPerTwin].join('|');if(key===lastMeter)return;lastMeter=key;mg.fillStyle='#0b2119';mg.fillRect(0,0,1400,150);mg.textAlign='left';mg.textBaseline='middle';mg.fillStyle='#c5a25b';mg.font='700 25px Arial';mg.fillText('CASINO JACKPOT',28,44);mg.fillStyle='#f5e6bd';mg.font='700 41px Georgia';mg.textAlign='right';mg.fillText(fmt(jackpot)+'  LAYR',1368,45);mg.strokeStyle='#59643b';mg.lineWidth=1;mg.beginPath();mg.moveTo(28,81);mg.lineTo(1372,81);mg.stroke();mg.textAlign='left';mg.font='20px Arial';mg.fillStyle='#afc1a0';const periodDate=new Date(stat.periodEnd),periodText=Number.isFinite(periodDate.getTime())?periodDate.toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'UTC'}).toUpperCase()+' 00:00 UTC':'CHECKING';mg.fillText('FUND '+fmt(fund)+'  ·  ENDS '+periodText,28,115);mg.textAlign='right';mg.fillText('LAST PERIOD: '+(Number.isFinite(stat.lastPayPerTwin)?fmt(stat.lastPayPerTwin)+' / TWIN':'NOT AVAILABLE'),1370,115);meterTex.needsUpdate=true;}
  function syncUI(){let u;try{u=api.ui?api.ui():{};}catch(e){return;}lastUI=u;paintBalance();const s=u;$('hostBet').textContent=fmt(s.bet??100);const sceneName=s.scene?.type||s.scene?.kind||s.scene;const open=u.modalOpen??!!u.modal;if(modalOpen!==!!open)geometryDirty=true;modalOpen=!!open;showFrame();$('hostFetch').disabled=!!u.spinDisabled&&!sceneName;$('hostAuto').setAttribute('aria-pressed',String(!!s.auto));$('hostTurbo').setAttribute('aria-pressed',String(!!s.turbo));$('hostSound').setAttribute('aria-pressed',String(!!s.sound));$('hostSound').textContent=s.sound?'♪':'♩';$('hostState').textContent=s.preview?'BONUS PREVIEW · PRACTICE CHIPS':sceneName?String(sceneName).replaceAll('-',' ').toUpperCase():s.busy?'THE SHOW IS IN MOTION':'READY FOR YOUR NEXT LAP';drawMeter(s);updateHits();}
  resize();syncUI();setInterval(syncUI,140);
  if(TEST)window.CKHostTest={api,frame,model,camera,renderer,setView,enterFullscreen,exitFullscreen,metrics,screenGoal,deckBox:()=>({min:deckBox.min.toArray(),max:deckBox.max.toArray()}),action:act};
  $('loading').classList.add('done');
  const leverBase=lever.rotation.x;let last=0,start=performance.now();
  function leverCurve(t){if(t<=0||t>=1)return 0;if(t<.30){const x=t/.30;return x*x*(3-2*x);}if(t<.48)return 1;if(t<.88){const x=(t-.48)/.4;return (1-x)*(1-x);}const x=(t-.88)/.12;return -.09*Math.sin(x*Math.PI)*(1-x);}
  function loop(now){
    requestAnimationFrame(loop);frame.contentWindow.__pxPump?.();
    if(now-last<1000/30)return;last=now;if(fullscreen)return;
    const rev=api.revision?api.revision():now;if(rev!==lastRev){lastRev=rev;screenTexture.needsUpdate=true;}
    const t=(now-start)/1000,m=api.mechanics?.()||{},hot=m.celebration||((m.show&&m.show.stage!=='outro')?.65:0),calm=reduced();
    const cameraMoving=cameraKeys.some(key=>Math.abs(nowGoal[key]-current[key])>1e-5),lv=m.lever;
    const capDepths=caps.map(c=>{let b=m.buttons?.[c.action];if(b&&typeof b==='object')b=b.value??b.progress??0;return c.z-Math.max(-.2,Math.min(1.3,Number(b)||0))*.058;});
    const capsMoving=caps.some((c,i)=>Math.abs(capDepths[i]-c.z)>1e-4||Math.abs(c.o.position.z-c.z)>1e-4);
    const leverMoving=!!lv||Math.abs(lever.rotation.x-leverBase)>1e-4;
    const interval=cameraMoving||capsMoving||leverMoving?100:200;
    // CPU geometry has a separate cadence. The game pump and changed live pixels remain at 30 fps.
    const geometryDue=!software||(!modalOpen&&(now-lastGeometryAt>=interval||(geometryDirty&&now-lastGeometryAt>=75)));
    if(geometryDue){
      crest.rotation.y=t*(calm?.045:(hot?.75:.20));for(let i=0;i<ribbons.length;i++){const r=ribbons[i];r.o.rotation.z=r.z+(calm?0:Math.sin(t*1.6+i)*.045);r.o.rotation.x=calm?0:Math.sin(t*1.3+i)*.055;}
      if(lv&&typeof lv==='object'){const p=typeof lv.progress==='number'?lv.progress:leverCurve((lv.elapsed||0)/(lv.duration||1050));lever.rotation.x=leverBase+p*(lv.angle||1.02);}else lever.rotation.x=leverBase+(typeof lv==='number'?lv:0)*1.02;
      let capsChanged=false;for(let i=0;i<caps.length;i++){if(Math.abs(caps[i].o.position.z-capDepths[i])>1e-6)capsChanged=true;caps[i].o.position.z=capDepths[i];}
      glow.material.opacity=.48+(calm?0:hot*.2*(.55+.45*Math.sin(now/180)));rim.intensity=2.1+hot*.6;
      // Preserve camera easing in elapsed time when geometry uses fewer frames.
      const dt=lastGeometryAt?now-lastGeometryAt:1000/30,k=calm?1:software?1-Math.pow(.84,dt/(1000/30)):.16;
      if(cameraMoving){for(const key of cameraKeys){current[key]+=(nowGoal[key]-current[key])*k;if(Math.abs(nowGoal[key]-current[key])<1e-5)current[key]=nowGoal[key];}place(current);projectionDirty=true;}
      model.updateMatrixWorld(true);if(cameraMoving||capsChanged||geometryDirty)hitsDirty=true;updateHits();renderer.render(scene,camera);
      if(projectionDirty){projectSoftwarePlanes();projectionDirty=false;}
      geometryDirty=false;lastGeometryAt=now;
    }
    copySoftwarePlanes(rev);
  }
  requestAnimationFrame(loop);
})().catch(e=>{console.error(e);const p=document.getElementById('hostError');if(p){p.hidden=false;p.textContent='The show could not start: '+e.message;}document.getElementById('loading')?.classList.add('done');});
