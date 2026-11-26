import * as THREE from 'three';
import {BOOTH,WALL_Z} from './booth.js';
import {rng,lerp,clamp} from './util.js';

export function buildRoom(app){
  const {scene,art}=app,R={posters:[],W:16,D:11,H:4.2};app.room=R;
  const M=app.mats={};
  function wood(base,dark,seed,planks){const c=art.mkCanvas(512),x=c.getContext('2d'),r=rng(seed);x.fillStyle=base;x.fillRect(0,0,512,512);
    for(let i=0;i<1400;i++){x.strokeStyle=r()<.5?dark:'rgba(255,220,170,.5)';x.globalAlpha=.03+r()*.09;x.lineWidth=.5+r()*1.6;const y=r()*512,x0=r()*512,l=40+r()*260;x.beginPath();x.moveTo(x0,y);x.bezierCurveTo(x0+l*.3,y+r()*4-2,x0+l*.6,y+r()*4-2,x0+l,y+r()*3-1.5);x.stroke();}
    x.globalAlpha=1;if(planks){for(let j=0;j<8;j++){x.fillStyle='rgba(0,0,0,.55)';x.fillRect(0,j*64,512,2);x.fillStyle=`rgba(0,0,0,${r()*.14})`;x.fillRect(0,j*64,512,64);x.fillStyle='rgba(0,0,0,.5)';const ex=r()*512;x.fillRect(ex,j*64,2,64);x.fillRect((ex+256)%512,j*64,2,64);}}
    const t=art.mkTex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;art.snapshot(c,t);return t;}
  const std=(o)=>new THREE.MeshStandardMaterial(o);
  const floorT=wood('#6a4a2e','#2a170a',3,true);floorT.repeat.set(5,3.5);
  const walT=wood('#70452a','#2c1508',5,false),darkT=wood('#33231a','#0c0705',9,false);
  M.floor=std({map:floorT,roughness:.58,metalness:.05});
  M.walnut=std({map:walT,roughness:.55});M.dark=std({map:darkT,roughness:.6});
  M.black=std({color:0x141416,roughness:.45,metalness:.6});M.matte=std({color:0x0e0e10,roughness:.85});
  M.brass=std({color:0xc79a3a,roughness:.32,metalness:.9});M.cream=std({color:0xe9dfc8,roughness:.9});
  M.wall=std({color:0x2a3431,roughness:.95});M.ceil=std({color:0x1c1612,roughness:1});
  M.silver=std({color:0xb4b8be,roughness:.38,metalness:.75});M.chrome=std({color:0xdfe3e8,roughness:.16,metalness:.95});
  M.felt=std({color:0x1d2a26,roughness:1});M.rubber=std({color:0x0b0b0c,roughness:.9});
  M.glass=new THREE.MeshStandardMaterial({color:0x9fc4d8,transparent:true,opacity:.1,roughness:.05,metalness:.2,depthWrite:false});
  M.pick=new THREE.MeshBasicMaterial({visible:false,side:THREE.DoubleSide});
  const box=app.box=(parent,w,h,d,mat,x=0,y=0,z=0,o={})=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=o.cast!==false;m.receiveShadow=o.recv!==false;parent.add(m);return m;};
  const cyl=app.cyl=(parent,r1,r2,h,mat,x=0,y=0,z=0,segs=24)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segs),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
  const plane=app.plane=(parent,w,h,mat,x=0,y=0,z=0,ry=0)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.y=ry;parent.add(m);return m;};
  const g=new THREE.Group();scene.add(g);R.group=g;
  const H=R.H;
  // shell
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(16,11),M.floor);fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;g.add(fl);
  const ce=new THREE.Mesh(new THREE.PlaneGeometry(16,11),M.ceil);ce.rotation.x=Math.PI/2;ce.position.y=H;g.add(ce);
  // back wall with an opening for the Audionaut booth, which is recessed into an alcove behind it
  const ox0=BOOTH.x-BOOTH.w/2,ox1=BOOTH.x+BOOTH.w/2,oh=BOOTH.h,bz=WALL_Z-.1;
  box(g,ox0+8,H,.2,M.wall,(ox0-8)/2,H/2,bz,{cast:false});box(g,8-ox1,H,.2,M.wall,(ox1+8)/2,H/2,bz,{cast:false});box(g,BOOTH.w,H-oh,.2,M.wall,BOOTH.x,oh+(H-oh)/2,bz,{cast:false});
  for(const [w,x] of [[ox0+8,(ox0-8)/2],[8-ox1,(ox1+8)/2]])app.addOccluder(w,H,.2,x,H/2,bz);app.addOccluder(BOOTH.w,H-oh,.2,BOOTH.x,oh+(H-oh)/2,bz);
  box(g,BOOTH.w+.16,.08,.05,M.black,BOOTH.x,oh+.04,WALL_Z+.02,{cast:false});for(const x of [ox0-.04,ox1+.04])box(g,.08,oh+.08,.05,M.black,x,oh/2,WALL_Z+.02,{cast:false});box(g,.2,H,11.4,M.wall,-8.1,H/2,0,{cast:false});box(g,.2,H,11.4,M.wall,8.1,H/2,0,{cast:false});
  // front wall with real glazed opening (x -0.6..7.12, y .72..3.66) and a glazed door
  const fz=5.6;
  box(g,5.5,H,.2,M.wall,-5.25,H/2,fz,{cast:false});box(g,1.2,H-2.3,.2,M.wall,-1.9,2.3+(H-2.3)/2,fz,{cast:false});box(g,.7,H,.2,M.wall,-.95,H/2,fz,{cast:false});
  box(g,7.72,.72,.2,M.wall,3.26,.36,fz,{cast:false});box(g,7.72,H-3.66,.2,M.wall,3.26,3.66+(H-3.66)/2,fz,{cast:false});box(g,.88,H,.2,M.wall,7.56,H/2,fz,{cast:false});
  const fr=(w,h,x,y)=>box(g,w,h,.26,M.black,x,y,fz,{cast:false});
  fr(7.8,.09,3.26,.72);fr(7.8,.09,3.26,3.66);fr(.09,2.94,-.6,2.19);fr(.09,2.94,7.12,2.19);fr(7.72,.05,3.26,3.0);for(const x of [1.33,3.26,5.19])fr(.06,2.94,x,2.19);
  box(g,7.9,.05,.4,M.walnut,3.26,.745,5.42);
  plane(g,7.72,2.94,M.glass,3.26,2.19,fz,Math.PI).renderOrder=5;
  fr(.08,2.3,-2.5,1.15);fr(.08,2.3,-1.3,1.15);fr(1.28,.08,-1.9,2.3);fr(1.2,.12,-1.9,.06);fr(1.2,.08,-1.9,1.05);
  plane(g,1.2,2.3,M.glass,-1.9,1.15,fz,Math.PI).renderOrder=5;box(g,.03,.3,.06,M.brass,-1.42,1.1,5.44);
  const decal=art.panel(1024,256,(x,w,h)=>{x.clearRect(0,0,w,h);x.textAlign='center';x.fillStyle='rgba(242,184,75,.92)';x.font=`800 104px ${art.font}`;x.fillText('XTRATA MUSIC',w/2,118);x.fillStyle='rgba(255,246,226,.85)';x.font=`600 40px ${art.font}`;x.fillText('RECORDS · CDS · LISTENING STATIONS',w/2,186);x.strokeStyle='rgba(242,184,75,.8)';x.lineWidth=4;x.strokeRect(40,16,w-80,h-36);});
  {const d=plane(g,3.4,.85,new THREE.MeshBasicMaterial({map:decal,transparent:true,depthWrite:false,side:THREE.DoubleSide}),3.26,2.5,5.612,0);d.renderOrder=6;R.decal=d;} // on the outer face of the glass, facing the street: from inside the lettering reads in reverse
  // beams, wainscot, skirting
  for(const z of [-4.4,-2.2,0,2.2,4.4])box(g,16,.26,.2,M.dark,0,H-.13,z,{cast:false});
  box(g,.22,.3,11,M.dark,-3,H-.15,0,{cast:false});box(g,.22,.3,11,M.dark,3,H-.15,0,{cast:false});
  for(const [w,x] of [[ox0-.08+8,(ox0-.08-8)/2],[8-ox1-.08,(ox1+.08+8)/2]])box(g,w,1,.05,M.dark,x,.5,-5.475,{cast:false});box(g,.05,1,11,M.dark,7.975,.5,0,{cast:false});box(g,.05,1,2.95,M.dark,-7.975,.5,4.02,{cast:false});
  for(const [w,x] of [[ox0-.08+8,(ox0-.08-8)/2],[8-ox1-.08,(ox1+.08+8)/2]])box(g,w,.03,.07,M.brass,x,1.015,-5.47,{cast:false});box(g,.07,.03,11,M.brass,7.97,1.015,0,{cast:false});
  // lights
  R.hemi=new THREE.HemisphereLight(0xffe2bd,0x2a1b10,.75);scene.add(R.hemi);
  scene.add(new THREE.AmbientLight(0xffe9d0,.22));
  const key=new THREE.DirectionalLight(0xffdcae,.75);key.position.set(2.5,9,3.5);key.target.position.set(0,0,-.4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);
  const sc=key.shadow.camera;sc.left=-9;sc.right=9;sc.top=7;sc.bottom=-7;sc.near=1;sc.far=16;key.shadow.bias=-.0006;key.shadow.normalBias=.02;scene.add(key,key.target);
  const shadeM=std({color:0x151312,roughness:.5,metalness:.5,side:THREE.DoubleSide}),bulbM=new THREE.MeshBasicMaterial({color:0xffcf8a});
  for(const [x,z] of [[-6.1,-.6],[-1.9,-.5],[3.1,.1],[-5.3,-4.9],[4.4,-4.95],[-4.8,3.1]]){
    const c=cyl(g,.006,.006,H-2.85,M.matte,x,2.85+(H-2.85)/2,z,6);c.castShadow=false;
    const s=new THREE.Mesh(new THREE.ConeGeometry(.24,.2,24,1,true),shadeM);s.position.set(x,2.76,z);g.add(s);
    const b=new THREE.Mesh(new THREE.SphereGeometry(.05,12,8),bulbM);b.position.set(x,2.69,z);g.add(b);
    const l=new THREE.PointLight(0xffb866,13,8.5,1.8);l.position.set(x,2.6,z);scene.add(l);
  }
  R.winLight=new THREE.PointLight(0x6f93ff,9,8,1.7);R.winLight.position.set(3.2,2.4,4.5);scene.add(R.winLight);
  R.sun=new THREE.DirectionalLight(0xffa24f,0);R.sun.position.set(9,5,14);R.sun.target.position.set(1,0,1);scene.add(R.sun,R.sun.target);
  // neon + signs
  const basic=t=>new THREE.MeshBasicMaterial({map:t,toneMapped:false});
  const sign=(tex,w,h,x,y,z,ry)=>{const f=box(g,w+.08,h+.08,.05,M.black,x,y,z,{cast:false});f.rotation.y=ry;const p=plane(g,w,h,basic(tex),x+Math.sin(ry)*.03,y,z+Math.cos(ry)*.03,ry);return p;};
  sign(art.neon('XTRATA MUSIC','PERMANENT ON-CHAIN RECORDS & CDS'),3.3,.52,-5.32,3.12,-5.47,0);
  sign(art.neon('AUDIONAUTS','LISTENING STATION · BITCOIN & STACKS','#58d7e8'),3.3,.52,4.5,3.12,-5.47,0);
  sign(art.neon('ON-CHAIN · FOREVER',null,'#ff5fa2',768,128),1.5,.25,-.9,3.2,-5.47,0);
  R.sign=sign;
  // posters (about eleven, varied sizes)
  // back wall: two posters either side of the booth opening (x -1.97..0.77)
  const PS=[[-3.5,1.95,-5.45,0,.9,1.2],[-2.47,1.7,-5.45,0,.7,.7],[1.25,1.85,-5.45,0,.62,.87],[2.2,1.75,-5.45,0,.8,.8],
    [7.95,1.95,-2.7,-Math.PI/2,1,1.4],[7.95,1.75,-1.1,-Math.PI/2,.8,.8],[7.95,1.8,.6,-Math.PI/2,1.3,.87],[7.95,1.95,2.4,-Math.PI/2,.9,1.2],[7.95,1.7,4.2,-Math.PI/2,.7,.7],
    [-7.95,1.95,3.45,Math.PI/2,.9,1.2],[-7.95,1.75,4.75,Math.PI/2,.72,.72]];
  PS.forEach(([x,y,z,ry,w,h],i)=>{const c=art.mkCanvas(512,Math.round(512*h/w)),tex=art.mkTex(c);
    const f=box(g,w+.09,h+.09,.045,i%2?M.dark:M.black,x,y,z,{cast:false});f.rotation.y=ry;
    const mat=new THREE.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:0xffffff,emissiveIntensity:.32,roughness:.8});
    const p=plane(g,w,h,mat,x+Math.sin(ry)*.027,y,z+Math.cos(ry)*.027,ry);
    R.posters.push({i,canvas:c,tex,mesh:p,w,h,content:null});});
  // checkout counter + POS
  const cx=-4.8,cz=3.6;
  box(g,1.8,.9,.7,M.walnut,cx,.45,cz);box(g,1.9,.05,.8,M.dark,cx,.925,cz);box(g,1.9,.012,.02,M.brass,cx,.955,cz-.39);
  app.addCollider(cx-.95,cx+.95,cz-.4,cz+.4);app.addOccluder(1.9,.95,.8,cx,.475,cz);
  const pos=new THREE.Group();pos.position.set(cx-.25,.95,cz);pos.rotation.y=Math.PI;g.add(pos);
  box(pos,.34,.04,.3,M.black,0,.02,0);box(pos,.05,.2,.05,M.black,0,.13,-.08);
  R.posTex=art.panel(512,320,()=>{});const scr=box(pos,.36,.24,.02,M.black,0,.3,-.04);scr.rotation.x=-.35;
  const sp=plane(pos,.33,.21,basic(R.posTex),0,.3035,-.028);sp.rotation.x=-.35;
  box(pos,.16,.1,.2,M.silver,.33,.05,0);box(pos,.1,.12,.002,M.cream,.33,.13,.02).rotation.x=-.2;
  const posPick=box(g,.9,.6,.5,M.pick,cx-.1,1.2,cz);R.posPick=posPick;
  const ck=art.card('CHECKOUT','CRATE LIST · REFERENCE RECEIPTS','#17120f','#f2b84b');
  box(g,1.3,.34,.03,M.black,cx,2.55,cz,{cast:false});plane(g,1.24,.3,basic(ck),cx,2.55,cz-.017,Math.PI);
  for(const dx of [-.55,.55])cyl(g,.004,.004,H-2.72,M.matte,cx+dx,2.72+(H-2.72)/2,cz,6).castShadow=false;
  box(g,1.5,.01,.9,std({color:0x3a1512,roughness:1}),-1.9,.006,4.6,{cast:false}); // door mat

  // exterior street (basic materials, two palettes blended by weather)
  const ex=new THREE.Group();scene.add(ex);R.ext=ex;
  const bm=c=>new THREE.MeshBasicMaterial({color:c});
  const E={pave:bm(0),road:bm(0),kerb:bm(0),mark:bm(0),sky:bm(0),far:bm(0),fac:[],lit:[],glow:[],streak:[]};R.E=E;
  const flat=(w,d,mat,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);ex.add(m);return m;};
  flat(90,2.9,E.pave,3,-.02,7.15);box(ex,90,.14,.18,E.kerb,3,-.05,8.65,{cast:false,recv:false});flat(90,6.6,E.road,3,-.12,12);flat(90,2.6,E.pave,3,-.02,16.5);
  for(let x=-30;x<40;x+=3.2)flat(1.5,.14,E.mark,x,-.11,12);
  const skyGeo=new THREE.PlaneGeometry(190,70);skyGeo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(12),3));
  {const m=new THREE.Mesh(skyGeo,new THREE.MeshBasicMaterial({vertexColors:true,fog:false}));m.position.set(3,24,44);m.rotation.y=Math.PI;ex.add(m);}
  const r=rng(2026);let bx=-30;
  while(bx<38){const w=5+r()*4,h=7.5+r()*6,cols=Math.max(3,Math.round(w/1.5)),rows=Math.max(3,Math.round(h/2.3));
    const c=art.mkCanvas(256,256),x=c.getContext('2d'),c2=art.mkCanvas(256,256),x2=c2.getContext('2d');
    const hue=15+r()*30;x.fillStyle=`hsl(${hue},${18+r()*18}%,${46+r()*16}%)`;x.fillRect(0,0,256,256);
    for(let i=0;i<50;i++){x.fillStyle=`rgba(0,0,0,${r()*.07})`;x.fillRect(0,r()*256,256,2+r()*5);}
    x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,256,10);x.fillStyle='rgba(20,14,10,.9)';x.fillRect(0,206,256,50);
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const wx=14+i*(228/cols),wy=22+j*(176/rows),ww=228/cols-12,wh=176/rows-12;x.fillStyle='#1b1e26';x.fillRect(wx,wy,ww,wh);x.strokeStyle='rgba(255,255,255,.25)';x.strokeRect(wx,wy,ww,wh);
      if(r()<.36){x2.fillStyle=`hsla(${35+r()*20},90%,${60+r()*15}%,${.6+r()*.4})`;x2.fillRect(wx+1,wy+1,ww-2,wh-2);}}
    x2.fillStyle='hsla(190,80%,60%,.5)';if(r()<.6)x2.fillRect(20,214,216,30);
    const t1=art.mkTex(c),t2=art.mkTex(c2);art.snapshot(c,t1);art.snapshot(c2,t2);const fm=new THREE.MeshBasicMaterial({map:t1}),lm=new THREE.MeshBasicMaterial({map:t2,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
    plane(ex,w,h,fm,bx+w/2,h/2-.02,17.9,Math.PI);plane(ex,w,h,lm,bx+w/2,h/2-.02,17.88,Math.PI);E.fac.push(fm);E.lit.push(lm);
    if(r()<.8)plane(ex,w*.8,h+5+r()*7,E.far,bx+w/2+r()*3,(h+8)/2,27,Math.PI);
    bx+=w+.05;}
  const gc=art.mkCanvas(128),gx=gc.getContext('2d'),gg=gx.createRadialGradient(64,64,2,64,64,64);gg.addColorStop(0,'rgba(255,214,150,1)');gg.addColorStop(.25,'rgba(255,170,80,.5)');gg.addColorStop(1,'rgba(255,150,60,0)');gx.fillStyle=gg;gx.fillRect(0,0,128,128);
  const gt=art.mkTex(gc);art.snapshot(gc,gt);
  const sg=art.mkCanvas(64,256),sx=sg.getContext('2d'),sgr=sx.createLinearGradient(0,0,0,256);sgr.addColorStop(0,'rgba(255,180,90,.55)');sgr.addColorStop(1,'rgba(255,180,90,0)');sx.fillStyle=sgr;sx.fillRect(0,0,64,256);const st=art.mkTex(sg);art.snapshot(sg,st);
  E.pole=bm(0x0a0a0c);
  for(const [x,z,s] of [[5.7,8.1,1],[-2.6,8.1,1],[-4,15.5,1],[3.3,15.5,1],[10.5,15.5,1],[16,8.1,1]]){
    cyl(ex,.05,.07,4.6,E.pole,x,2.3,z,8);box(ex,.7,.06,.06,E.pole,x,4.6,z+.3*(z<10?1:-1)*0,{cast:false});
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),new THREE.MeshBasicMaterial({color:0xffd9a0}));hd.position.set(x+.3,4.5,z);ex.add(hd);E.glow.push(hd.material);
    const sm=new THREE.SpriteMaterial({map:gt,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true});const sp=new THREE.Sprite(sm);sp.scale.set(3.2,3.2,1);sp.position.set(x+.3,4.5,z);ex.add(sp);E.glow.push(sm);
    const km=new THREE.MeshBasicMaterial({map:st,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});const k=flat(.9,5,km,x+.3,-.1,z<10?10.8:12.6);if(z>10)k.rotation.z=Math.PI;E.streak.push(km);
  }
  // rain outside the glass only
  const N=750,rp=new Float32Array(N*6);R.rainSeed=[];
  for(let i=0;i<N;i++)R.rainSeed.push([-9+r()*26,r()*8,5.95+r()*10.5,7+r()*4]);
  const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(rp,3));
  R.rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xaec4e6,transparent:true,opacity:.34,depthWrite:false}));R.rain.frustumCulled=false;ex.add(R.rain);
  // indoor sun patches + dust
  R.patches=[];for(const x of [.36,2.3,4.22,6.15]){const geo=new THREE.BufferGeometry();const x0=x-.85,x1=x+.85,sh=-1.5;
    geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array([x0,0,5.2,x1,0,5.2,x1+sh,0,1.9,x0,0,5.2,x1+sh,0,1.9,x0+sh,0,1.9]),3));
    const pm=new THREE.MeshBasicMaterial({color:0xffb060,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});const m=new THREE.Mesh(geo,pm);m.position.y=.012;g.add(m);R.patches.push(pm);}
  const dn=140,dp=new Float32Array(dn*3);for(let i=0;i<dn;i++){dp[i*3]=-1+r()*8;dp[i*3+1]=.4+r()*3;dp[i*3+2]=1.2+r()*4;}
  const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
  R.dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xffe2b8,size:.014,transparent:true,opacity:.35,depthWrite:false}));g.add(R.dust);

  // ---------- sky, time of day and weather ----------
  // Three reference looks per surface: [night, day, golden hour]; cloud, rain, snow and fog then modify them.
  const PAL={pave:[0x1a1d25,0x9a9c9e,0x8f7b66],road:[0x0b0d12,0x4a4c50,0x4b4038],kerb:[0x262a33,0xb0b2b4,0xa08c76],mark:[0x6f7480,0xe6e6e0,0xd8c9a8],far:[0x10141f,0x8fa3b8,0xc98f62],fac:[0x4a5578,0xffffff,0xffd4a8],top:[0x05070f,0x4f8fd8,0x5a6fa8],hor:[0x0a0f1d,0xb9d8f2,0xf3b877],bg:[0x070a12,0xb9d8f2,0xe9a868]};
  const ca=new THREE.Color(),cb=new THREE.Color(),cbg=new THREE.Color(),cTop=new THREE.Color(),cHor=new THREE.Color();
  const cur={day:0,gold:0,cloud:.9,rain:1,snow:0,fog:0,sunX:.5,sunY:0},tgt={...cur};R.env=cur;R.envTarget=tgt;
  function col(k,out,ground){const P=PAL[k],e=cur;out.setHex(P[0]).lerp(cb.setHex(P[1]),e.day).lerp(cb.setHex(P[2]),e.gold*(1-.6*e.cloud));
    const oc=e.cloud*.55*e.day;if(oc>0){const l=(out.r+out.g+out.b)/3*.84;out.lerp(cb.setRGB(l,l,l*1.04),oc);}
    if(ground){out.multiplyScalar(1-.22*e.rain*e.day);if(e.snow>0){const b=.2+.72*e.day;out.lerp(cb.setRGB(b*.93,b*.96,b),Math.min(1,e.snow*.8));}}return out;}
  const disc=(hex,size,add)=>{const m=new THREE.SpriteMaterial({map:gt,color:hex,transparent:true,depthWrite:false,fog:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending});const sp=new THREE.Sprite(m);sp.scale.set(size,size,1);ex.add(sp);return sp;};
  const sunS=disc(0xfff2c8,13,true),moonS=disc(0xdfe8ff,4.2,false);moonS.position.set(-9,25,43);
  const sN=170,sP=new Float32Array(sN*3);for(let i=0;i<sN;i++){sP[i*3]=-70+r()*150;sP[i*3+1]=9+r()*42;sP[i*3+2]=43.5;}
  const sG=new THREE.BufferGeometry();sG.setAttribute('position',new THREE.BufferAttribute(sP,3));const stars=new THREE.Points(sG,new THREE.PointsMaterial({color:0xdfe6ff,size:.22,transparent:true,opacity:0,depthWrite:false,fog:false}));ex.add(stars);
  const cc=art.mkCanvas(256,128),cx2=cc.getContext('2d');for(let i=0;i<26;i++){const x=30+r()*196,y=44+r()*44,rad=18+r()*30,gr=cx2.createRadialGradient(x,y,2,x,y,rad);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');cx2.fillStyle=gr;cx2.fillRect(0,0,256,128);}
  const cTex=art.mkTex(cc);art.snapshot(cc,cTex);const clouds=[];
  for(let i=0;i<9;i++){const m=new THREE.MeshBasicMaterial({map:cTex,transparent:true,opacity:0,depthWrite:false,fog:false}),w=26+r()*22,me=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.45),m);me.rotation.y=Math.PI;me.position.set(-60+i*17+r()*8,10+r()*17,30+r()*11);ex.add(me);clouds.push({me,m,sp:.25+r()*.5,k:.6+r()*.4});}
  const fogV=new THREE.Mesh(new THREE.PlaneGeometry(120,40),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,fog:false}));fogV.rotation.y=Math.PI;fogV.position.set(3,14,12.5);ex.add(fogV);
  const flashM=new THREE.MeshBasicMaterial({color:0xcfe0ff,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}),flashP=new THREE.Mesh(new THREE.PlaneGeometry(190,70),flashM);flashP.rotation.y=Math.PI;flashP.position.set(3,24,42.5);ex.add(flashP);
  const SN=520,snP=new Float32Array(SN*3),snS=[];for(let i=0;i<SN;i++)snS.push([-9+r()*26,r()*8,5.95+r()*10.5,.7+r()*.8,r()*6.3]);
  const snG=new THREE.BufferGeometry();snG.setAttribute('position',new THREE.BufferAttribute(snP,3));const snow=new THREE.Points(snG,new THREE.PointsMaterial({color:0xffffff,size:.055,transparent:true,opacity:0,depthWrite:false}));snow.frustumCulled=false;snow.visible=false;ex.add(snow);R.snow=snow;
  scene.background=new THREE.Color(PAL.bg[0]);
  function apply(){const e=cur,lamp=1-Math.min(1,e.day/.42),sunny=e.day*(1-e.cloud)*(.45+.55*e.gold),veil=Math.min(1,e.fog*.75+e.snow*.2+e.rain*.12*e.day);
    col('bg',cbg);col('top',cTop).lerp(cbg,veil*.7);col('hor',cHor).lerp(cbg,veil*.5);
    for(const k of ['pave','road','kerb'])col(k,E[k].color,true);col('mark',E.mark.color,true);col('far',E.far.color).lerp(cbg,veil*.8);
    col('fac',ca).lerp(cbg,veil*.45);for(const m of E.fac)m.color.copy(ca);
    const a=skyGeo.attributes.color;a.setXYZ(0,cTop.r,cTop.g,cTop.b);a.setXYZ(1,cTop.r,cTop.g,cTop.b);a.setXYZ(2,cHor.r,cHor.g,cHor.b);a.setXYZ(3,cHor.r,cHor.g,cHor.b);a.needsUpdate=true;
    scene.background.copy(cbg);fogV.material.color.copy(cbg);fogV.material.opacity=Math.min(.8,e.fog*.62+e.snow*.12);
    for(const m of E.lit)m.opacity=.15+.85*lamp;for(const m of E.glow){m.opacity=.1+.9*lamp;m.transparent=true;}for(const m of E.streak)m.opacity=lamp*(.15+.85*Math.max(e.rain,e.snow*.4));
    R.rain.visible=e.rain>.02;R.rain.material.opacity=.34*Math.min(1,e.rain*1.4)*(1-.35*e.day);R.rain.geometry.setDrawRange(0,2*Math.floor(N*Math.min(1,e.rain)));
    snow.visible=e.snow>.02;snow.material.opacity=Math.min(1,e.snow*1.5)*.9;snG.setDrawRange(0,Math.floor(SN*Math.min(1,e.snow)));
    sunS.position.set(lerp(40,-34,e.sunX),2+e.sunY*30,43);sunS.material.opacity=Math.min(1,e.day*1.6)*(1-e.cloud*.8)*(1-veil*.6);sunS.material.color.setHex(0xfff2c8).lerp(cb.setHex(0xff9a3c),e.gold);sunS.scale.setScalar(11+7*e.gold);
    moonS.material.opacity=(1-Math.min(1,e.day*2.2))*(1-e.cloud*.82);stars.material.opacity=(1-Math.min(1,e.day*3))*(1-e.cloud)*.9;
    ca.setHex(0x232a3d).lerp(cb.setHex(0xf3f5f8),e.day).lerp(cb.setHex(0xffc890),e.gold*.6).multiplyScalar(1-.45*Math.max(e.rain,e.snow*.3)*e.day);
    for(const c of clouds){c.m.color.copy(ca);c.m.opacity=Math.min(.95,e.cloud*1.15)*c.k;}
    for(const p of R.patches){p.opacity=.3*sunny;p.color.setHex(0xfff0cf).lerp(cb.setHex(0xffb060),e.gold);}
    R.sun.intensity=1.7*sunny;R.sun.color.setHex(0xfff1d6).lerp(cb.setHex(0xffa24f),e.gold);
    R.winLight.color.setHex(0x6f93ff).lerp(cb.setHex(0xdfeaff),e.day).lerp(cb.setHex(0xffb56b),e.gold*(1-e.cloud*.7));R.winLight.intensity=lerp(9,15,e.day)+5*e.gold*(1-e.cloud);
    R.dust.material.opacity=lerp(.28,.6,sunny);R.hemi.intensity=lerp(.75,.98,e.day*(1-.4*e.cloud));}
  const qsS=new URLSearchParams(location.search),cfgS=window.XTRATA_SHOP_CONFIG||{};
  const WMO={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Freezing fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Freezing drizzle',57:'Freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Light showers',81:'Showers',82:'Heavy showers',85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorm',96:'Thunderstorm, hail',99:'Thunderstorm, hail'};
  const L=R.live={wx:null,place:null,storm:false,sr:null,ss:null,lat:null};
  const tz=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){return '';}})();
  function sunTimes(now){if(L.sr!=null)return [L.sr,L.ss];const d0=new Date(now.getFullYear(),0,0),doy=Math.floor((now-d0)/864e5),south=L.lat!=null?L.lat<0:/^(Australia|Antarctica|Pacific\/(Auckland|Fiji|Chatham)|Africa\/(Johannesburg|Maputo|Harare|Windhoek)|America\/(Sao_Paulo|Argentina|Santiago|Montevideo|Asuncion|Lima|La_Paz))/.test(tz);
    const len=12+4*Math.cos(2*Math.PI*(doy-172)/365)*(south?-1:1);return [12.5-len/2,12.5+len/2];}
  function liveTarget(now){const h=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600,[sr,ss]=sunTimes(now);let el;
    if(h>sr&&h<ss){const x=(h-sr)/(ss-sr);el=Math.sin(Math.PI*x);tgt.sunX=x;}else{const d=h>=ss?h-ss:sr-h;el=-Math.min(1,d/1.1);tgt.sunX=h>=ss?1.04:-.04;}
    tgt.sunY=Math.max(-.12,el);tgt.day=clamp((el+.1)/.3,0,1);tgt.gold=el>-.2?clamp(1-Math.abs(el-.1)/.24,0,1):0;
    const w=L.wx;let cloud=.25,rain=0,snw=0,fog=0;L.storm=false;
    if(w){const c=w.code;cloud=w.cloud!=null?w.cloud/100:c>=3?.95:c===2?.5:c===1?.2:.03;
      if(c===45||c===48){fog=.85;cloud=Math.max(cloud,.8);}else if(c>=51&&c<=57){rain=.3;cloud=Math.max(cloud,.85);}else if((c>=61&&c<=67)||(c>=80&&c<=82)){rain=c===61||c===80?.5:c===63||c===81||c===66?.75:1;cloud=Math.max(cloud,.9);}
      else if((c>=71&&c<=77)||c===85||c===86){snw=c===71||c===77?.45:c===73||c===85?.75:1;cloud=Math.max(cloud,.9);}else if(c>=95){rain=1;cloud=1;L.storm=true;}}
    tgt.cloud=cloud;tgt.rain=rain;tgt.snow=snw;tgt.fog=fog;}
  function setTarget(){const m=app.state.weather;L.storm=false;
    if(m==='rain')Object.assign(tgt,{day:0,gold:0,cloud:.9,rain:1,snow:0,fog:0,sunX:1.04,sunY:-.12});
    else if(m==='golden')Object.assign(tgt,{day:.78,gold:1,cloud:.12,rain:0,snow:0,fog:0,sunX:.9,sunY:.1});
    else liveTarget(new Date(R.clock?R.clock():Date.now()));}
  R.weatherLabel=()=>{const m=app.state.weather;if(m==='rain')return '☔ Late-Night Rain';if(m==='golden')return '☀ Golden Hour';const d=new Date(R.clock?R.clock():Date.now()),t=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'),w=L.wx;
    return '◉ Live · '+t+(w?' · '+(WMO[w.code]||'Weather')+(w.temp!=null?' '+Math.round(w.temp)+'°':'')+(L.place?' · '+L.place:''):' · local time');};
  async function fetchWeather(){if(qsS.has('offline')||cfgS.weather===false||L.busy)return;L.busy=true;
    const J=async u=>{const r=await Promise.race([fetch(u),new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),9000))]);if(!r.ok)throw new Error('HTTP '+r.status);return r.json();};
    try{let loc=cfgS.location&&cfgS.location.lat!=null?{lat:+cfgS.location.lat,lon:+cfgS.location.lon,name:cfgS.location.name||''}:null;
      if(!loc){const city=tz.split('/').pop().replace(/_/g,' ');if(!city||/^(UTC|GMT|Etc)/i.test(tz))throw new Error('no region');
        try{const c=JSON.parse(localStorage.getItem('xtrata-music/geo-v1')||'null');if(c&&c.tz===tz)loc=c;}catch(e){}
        if(!loc){const g=await J('https://geocoding-api.open-meteo.com/v1/search?count=1&name='+encodeURIComponent(city)),x=g&&g.results&&g.results[0];if(!x)throw new Error('region not found');loc={tz,lat:x.latitude,lon:x.longitude,name:x.name||city};try{localStorage.setItem('xtrata-music/geo-v1',JSON.stringify(loc));}catch(e){}}}
      const f=await J('https://api.open-meteo.com/v1/forecast?latitude='+loc.lat.toFixed(2)+'&longitude='+loc.lon.toFixed(2)+'&current=weather_code,cloud_cover,is_day,temperature_2m&daily=sunrise,sunset&timezone=auto&forecast_days=1'),c=f&&f.current;
      if(!c||typeof c.weather_code!=='number')throw new Error('bad weather reply');
      L.wx={code:c.weather_code,cloud:typeof c.cloud_cover==='number'?c.cloud_cover:null,temp:typeof c.temperature_2m==='number'?c.temperature_2m:null};L.place=loc.name;L.lat=loc.lat;
      const hm=sv=>{const m=/T(\d\d):(\d\d)/.exec(sv||'');return m?+m[1]+m[2]/60:null;},d=f.daily||{},sr=hm(d.sunrise&&d.sunrise[0]),ss=hm(d.sunset&&d.sunset[0]);if(sr!=null&&ss!=null&&ss>sr){L.sr=sr;L.ss=ss;}
      L.at=Date.now();L.error=null;}catch(e){L.error=String(e&&e.message||e);}
    L.busy=false;if(app.state.weather==='live'){setTarget();app.emit('weather');}}
  R.fetchWeather=fetchWeather;
  R.setWeather=(mode,instant)=>{app.state.weather=mode;setTarget();if(instant){Object.assign(cur,tgt);apply();}if(mode==='live'&&(!L.at||Date.now()-L.at>12e5))fetchWeather();app.emit('weather');};
  R.nextWeather=()=>R.setWeather({live:'rain',rain:'golden',golden:'live'}[app.state.weather]||'live');
  {const m=qsS.get('sky')||cfgS.sky;app.state.weather=m==='rain'||m==='golden'?m:'live';setTarget();Object.assign(cur,tgt);apply();if(app.state.weather==='live')setTimeout(fetchWeather,400);}
  let tt=0,liveT=0,lastLabel='',flash=0,nextFlash=6;const KEYS=['day','gold','cloud','rain','snow','fog','sunX','sunY'];
  R.update=dt=>{tt+=dt;
    if(app.state.weather==='live'){liveT+=dt;if(liveT>20){liveT=0;setTarget();const l=R.weatherLabel();if(l!==lastLabel){lastLabel=l;app.emit('weather');}if(L.at&&Date.now()-L.at>12e5)fetchWeather();}}
    let ch=false;for(const k of KEYS){const d=tgt[k]-cur[k];if(d!==0){cur[k]+=Math.sign(d)*Math.min(Math.abs(d),dt/1.1);ch=true;}}if(ch)apply();
    if(R.rain.visible){const n=R.rain.geometry.drawRange.count/2,a=R.rain.geometry.attributes.position.array;for(let i=0;i<n;i++){const s=R.rainSeed[i];s[1]-=s[3]*dt;if(s[1]<-.1)s[1]+=8;a[i*6]=s[0];a[i*6+1]=s[1];a[i*6+2]=s[2];a[i*6+3]=s[0]-.05;a[i*6+4]=s[1]-.32;a[i*6+5]=s[2];}R.rain.geometry.attributes.position.needsUpdate=true;}
    if(snow.visible){const n=snG.drawRange.count;for(let i=0;i<n;i++){const s=snS[i];s[1]-=s[3]*dt;if(s[1]<-.1)s[1]+=8;snP[i*3]=s[0]+Math.sin(tt*.9+s[4])*.18;snP[i*3+1]=s[1];snP[i*3+2]=s[2];}snG.attributes.position.needsUpdate=true;}
    for(const c of clouds){if(c.m.opacity>.01){c.me.position.x-=c.sp*dt;if(c.me.position.x<-75)c.me.position.x+=160;}}
    if(L.storm&&app.state.weather==='live'){nextFlash-=dt;if(nextFlash<=0){nextFlash=5+Math.random()*13;flash=1;}}
    if(flash>0){flash=Math.max(0,flash-dt*3.2);flashM.opacity=flash*.55;if(flash===0)apply();else R.winLight.intensity=lerp(9,15,cur.day)+flash*40;}
    R.dust.rotation.y=Math.sin(tt*.05)*.02;R.dust.position.y=Math.sin(tt*.21)*.05;};
  return R;
}
