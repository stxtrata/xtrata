import * as THREE from 'three';
import {clamp,lerp,easeIO,easeOut,smooth,fmt,esc,fitText,typeName} from './util.js';
import {REC,JK,recScale} from './models.js';

export function initVinyl(app){
  const {scene,art,mats:M,box,cyl,plane}=app,cat=app.catalog;
  const V={lanes:[],primary:{},items:[]};app.vinyl=V;
  const g=new THREE.Group();scene.add(g);
  const basic=t=>new THREE.MeshBasicMaterial({map:t,toneMapped:false});
  const jEdge=new THREE.MeshStandardMaterial({color:0xe8e0cf,roughness:.9}),jrg=g=>{g.clearGroups();g.addGroup(0,24,0);g.addGroup(24,6,1);g.addGroup(30,6,2);return g;},jGeo={12:jrg(new THREE.BoxGeometry(.315,.315,.008)),7:jrg(new THREE.BoxGeometry(.205,.205,.006))},jm=new Map();
  const jMats=rel=>{let m=jm.get(rel.id);if(!m){m=[jEdge,new THREE.MeshStandardMaterial({map:art.cover(rel).tex,roughness:.6}),new THREE.MeshStandardMaterial({map:art.jacketBack(rel),roughness:.75})];jm.set(rel.id,m);}return m;};

  // =============== crates ===============
  const FLOOR=.70,REST_TILT=-.16,FLIP=.92;
  function bin(cx,cz,size,specs,label,filter){
    const j=JK[size],lw=j.s+.03,n=specs.length,W=n*lw+(n+1)*.02,D=.66;
    box(g,W,.03,D,M.walnut,cx,FLOOR-.015,cz);box(g,W,.105,.02,M.walnut,cx,FLOOR+.0375,cz+D/2-.01);box(g,W,.26,.02,M.walnut,cx,FLOOR+.115,cz-D/2+.01);
    for(const s of [-1,1]){box(g,.02,.24,D,M.walnut,cx+s*(W/2-.01),FLOOR+.105,cz);for(const z of [-1,1])box(g,.045,FLOOR,.045,M.dark,cx+s*(W/2-.04),FLOOR/2,cz+z*(D/2-.04));}
    box(g,W-.08,.03,D-.08,M.dark,cx,.2,cz);box(g,W,.012,.012,M.brass,cx,FLOOR+.092,cz+D/2,{cast:false});
    app.addCollider(cx-W/2,cx+W/2,cz-D/2,cz+D/2);app.addOccluder(W,FLOOR+.15,D,cx,(FLOOR+.15)/2,cz);
    cyl(g,.012,.012,1.0,M.black,cx,FLOOR+.5+.13,cz-D/2-.0,8);
    const st=art.card(label,'tap sign to browse','#17120f','#f2b84b');box(g,Math.min(W,.7),.2,.02,M.black,cx,FLOOR+1.05,cz-D/2,{cast:false});
    const sp=plane(g,Math.min(W,.7)-.04,.17,basic(st),cx,FLOOR+1.05,cz-D/2+.011,0);
    app.addPick(sp,{id:'sign:'+filter,title:label,sub:'Category sign',hint:'Click to browse these crates',reach:6,click:()=>app.ui.openFinder('',filter)});
    specs.forEach((sp2,li)=>{
      const x=cx-W/2+.02+lw/2+li*(lw+.02);if(li>0)box(g,.012,.2,D-.04,M.walnut,x-lw/2-.01,FLOOR+.1,cz);
      const cap=18,zFront=cz+D/2-.14,pitch=Math.min(.03,(D-.24)/Math.min(cap,sp2.items.length));
      const L={id:'lane'+V.lanes.length,x,zFront,pitch,size,j,lw,items:[],aim:-1,force:-1,forceT:0,page:0,cap,label:sp2.label,active:true};
      sp2.items.forEach((rel,idx)=>{const piv=new THREE.Group();piv.position.set(x,FLOOR,zFront-(idx%cap)*pitch);piv.rotation.x=REST_TILT;
        const m=new THREE.Mesh(jGeo[size],jMats(rel));m.position.y=j.s/2;m.castShadow=true;piv.add(m);g.add(piv);
        const it={id:L.id+'-'+idx,rel,lane:L,idx,pos:idx%cap,pg:Math.floor(idx/cap),out:false,piv,mesh:m,ang:REST_TILT,lift:0};piv.visible=it.pg===0;
        L.items.push(it);V.items.push(it);if(!V.primary[rel.id])V.primary[rel.id]=it;});
      L.pages=Math.max(1,Math.ceil(L.items.length/cap));
      const dv=art.card(sp2.label,null,'#efe6d2','#1c1814',256,64);const tab=plane(g,lw-.03,.07,basic(dv),x,FLOOR+j.s+.045,zFront-Math.min(cap,L.items.length)*pitch-.03,0);tab.rotation.x=REST_TILT;
      box(g,lw-.02,j.s+.02,.004,M.cream,x,FLOOR+(j.s+.02)/2,zFront-Math.min(cap,L.items.length)*pitch-.034).rotation.x=REST_TILT;
      const pg=plane(g,.12,.05,basic(art.card('MORE ▸',null,'#f2b84b','#17120f',256,96)),x,FLOOR+.03,cz+D/2+.012,0);pg.visible=L.pages>1;
      app.addPick(pg,{id:'page:'+L.id,title:'More '+sp2.label,sub:'Next page of this lane',hint:'Click to turn the lane page',enabled:()=>L.pages>1,click:()=>V.setPage(L,(L.page+1)%L.pages)});
      const zb=zFront-cap*pitch-.04,zf=zFront+.3,pm=new THREE.Mesh(new THREE.BoxGeometry(lw,j.s+.06,zf-zb),M.pick);pm.position.set(x,FLOOR+(j.s+.06)/2,(zf+zb)/2);
      app.addPick(pm,{reach:2.9,resolve:(h,ray)=>laneResolve(L,h,ray)});V.lanes.push(L);
    });
  }
  const eps=cat.albums.filter(r=>r.type==='ep'),albs=cat.albums.filter(r=>r.type==='album');
  const rep=(a,n)=>{const o=[];for(let i=0;i<n;i++)o.push(...a);return o;};
  bin(2.2,-.25,12,[{label:'ALBUMS',items:rep(albs,Math.max(1,Math.ceil(6/Math.max(1,albs.length))))},{label:'EPs',items:rep(eps,2)}],'12-INCH · ALBUMS | EPs','v12');
  bin(4.05,-.25,7,[{label:'SINGLES 1',items:rep(cat.singles.slice(0,Math.ceil(cat.singles.length/2)),2)},{label:'SINGLES 2',items:rep(cat.singles.slice(Math.ceil(cat.singles.length/2)),2)}],'7-INCH · SINGLES','v7');
  V.setPage=(L,p)=>{L.page=p;L.aim=-1;for(const it of L.items)it.piv.visible=!it.out&&it.pg===p;app.foley('slide');};
  const shown=it=>!it.out&&it.pg===it.lane.page;
  function itemTarget(it){if(!it.target)it.target={id:'vin:'+it.id,item:it,get title(){return it.rel.title;},get sub(){return (it.rel.artist||'—')+' · '+typeName(it.rel.type)+' · '+it.rel.vinyl+'-inch vinyl · '+it.rel.tracks.length+' track'+(it.rel.tracks.length>1?'s':'');},
    hint:'Click to inspect · E to pick up',click:()=>V.inspect(it),e:()=>V.pickUp(it),hover:on=>{if(on)it.lane.aim=it.idx;else if(it.lane.aim===it.idx)it.lane.aim=-1;}};return it.target;}
  function laneResolve(L,h,ray){
    const o=ray.origin,d=ray.direction,top=FLOOR+L.j.s;
    const sticky=L.aim>=0?L.aim:L.force;
    if(sticky>=0){const it=L.items[sticky];if(it&&shown(it)&&Math.abs(d.z)>1e-5){const t=(it.piv.position.z-o.z)/d.z;if(t>0){const y=o.y+d.y*t,x=o.x+d.x*t;if(y>FLOOR+.04&&y<top+.05&&Math.abs(x-L.x)<L.lw/2)return itemTarget(it);}}}
    let z=h.point.z;if(d.y<-1e-4){const t=(top-o.y)/d.y;if(t>0)z=o.z+d.z*t;}
    const want=clamp(Math.round((L.zFront-.05-z)/L.pitch),0,L.cap-1);let best=null,bd=1e9;
    for(const it of L.items)if(shown(it)){const dd=Math.abs(it.pos-want);if(dd<bd){bd=dd;best=it;}}
    return best?itemTarget(best):null;
  }
  V.laneResolve=laneResolve;
  V.showJacket=(it,vis)=>{it.out=!vis;it.piv.visible=vis&&it.pg===it.lane.page;app.emit('stock');};
  V.jacketWorldPose=it=>{it.mesh.updateWorldMatrix(true,false);const p=new THREE.Vector3(),q=new THREE.Quaternion();it.mesh.getWorldPosition(p);it.mesh.getWorldQuaternion(q);p.y+=.12;return {p,q};};
  V.neighbour=(it,dir)=>{const a=it.lane.items;let i=it.idx;for(let k=0;k<a.length;k++){i=(i+dir+a.length)%a.length;if(!a[i].out&&a[i].pg===it.lane.page)return a[i]===it?null:a[i];}return null;};
  V.inspect=it=>{if(app.inspector.item||it.out||app.state.mode!=='room')return false;const m=app.models.makeJacket(it.rel,true),w=V.jacketWorldPose(it);m.group.position.copy(w.p);m.group.quaternion.copy(w.q);scene.add(m.group);V.showJacket(it,false);app.foley('slide');app.inspector.open({kind:'vinyl',slot:it,model:m});return true;};
  V.busyWith=()=>B.phase!=='empty'&&B.phase!=='ready';
  V.pickUp=it=>{if(app.carry){app.toast('Your hands are full — return what you are carrying first.');V.showJacket(it,true);return false;}
    if(V.busyWith()){app.toast('“'+B.rel.title+'” is still on the listening bench — return it to its crate first.');V.showJacket(it,true);return false;}
    V.showJacket(it,false);app.setCarry({kind:'vinyl',rel:it.rel,slot:it});app.foley('pull');app.toast('Sleeve in hand — take it to the Turntable.');return true;};
  V.returnCarried=()=>{const c=app.carry;if(!c||c.kind!=='vinyl')return false;V.showJacket(c.slot,true);app.setCarry(null);if(B.phase==='ready')B.phase='empty';app.foley('slide');app.toast('Sleeve returned to its exact crate slot.');panel();return true;};
  V.highlight=it=>{const L=it.lane;if(L.page!==it.pg)V.setPage(L,it.pg);L.force=it.idx;L.forceT=9;};

  // =============== listening bench ===============
  const RX=4.74,RY=1.02,RZ=-4.61;
  box(g,3.2,.96,1,M.walnut,4.5,.48,-4.65);box(g,3.32,.06,1.12,M.dark,4.5,.99,-4.65);box(g,3.32,.012,.02,M.brass,4.5,1.024,-4.095,{cast:false});
  box(g,3.32,.5,.04,M.dark,4.5,1.27,-5.23);box(g,3.32,.03,.3,M.walnut,4.5,1.5,-5.36);
  app.addCollider(2.84,6.16,-5.5,-4.09);app.addOccluder(3.32,1.02,1.12,4.5,.51,-4.65);
  const root=new THREE.Group();root.position.set(RX,RY,RZ);g.add(root);V.root=root;
  const SLEEVE=new THREE.Vector3(-1.045,.022,.02),REST=new THREE.Vector3(-.575,.0195,.02),SPIN=new THREE.Vector3(-.045,.0975,.01),CARRY_Y=.245,PAD_TOP=.018;
  const DECK={x0:-.28,x1:.28,z0:-.225,z1:.225};
  const pad=(c,s)=>{const m=box(root,s,PAD_TOP,s,M.felt,c.x,PAD_TOP/2,c.z);for(const [dx,dz,w,d] of [[0,-1,s,.006],[0,1,s,.006],[-1,0,.006,s],[1,0,.006,s]])box(root,w,.0006,d,M.brass,c.x+dx*(s/2-.003),PAD_TOP+.0003,c.z+dz*(s/2-.003),{cast:false});return m;};
  const sleevePad=pad(SLEEVE,.37),restPad=pad(REST,.39);
  const phTex=art.panel(512,512,()=>{}),phMat=new THREE.MeshBasicMaterial({map:phTex,transparent:true,depthWrite:false,toneMapped:false});
  const ph=new THREE.Mesh(new THREE.PlaneGeometry(.36,.36),phMat);ph.rotation.x=-Math.PI/2;ph.position.set(SLEEVE.x,PAD_TOP+.0012,SLEEVE.z);ph.renderOrder=2;root.add(ph);
  function drawPlaceholder(rel){phRel=rel;const x=phTex.userData.canvas.getContext('2d');x.textAlign='left';x.clearRect(0,0,512,512);
    if(rel){x.globalAlpha=.28;x.drawImage(art.cover(rel).canvas,56,56,400,400);x.globalAlpha=1;}
    x.strokeStyle='#f2b84b';x.lineWidth=9;x.setLineDash([30,18]);x.strokeRect(28,28,456,456);x.setLineDash([]);
    x.fillStyle='rgba(10,8,6,.62)';x.fillRect(70,150,372,212);x.fillStyle='#f2b84b';x.textAlign='center';x.font=`700 30px ${art.font}`;x.fillText('01 · SLEEVE',256,198);x.font=`800 46px ${art.font}`;x.fillStyle='#fff3d6';x.fillText('PLACE SLEEVE',256,258);x.fillStyle='#f2b84b';x.font=`800 38px ${art.font}`;x.fillText('CLICK HERE',256,312);
    if(rel){x.font=`600 22px ${art.font}`;x.fillStyle='#fff3d6';x.fillText(fitText(x,rel.title,340),256,346);}phTex.needsUpdate=true;}
  let phRel=null;drawPlaceholder(null);phTex.userData.redraw=()=>drawPlaceholder(phRel);
  const rlT=art.panel(512,512,(x)=>{x.clearRect(0,0,512,512);x.strokeStyle='rgba(242,184,75,.55)';x.lineWidth=5;x.setLineDash([16,14]);x.beginPath();x.arc(256,256,196,0,7);x.stroke();x.setLineDash([]);x.fillStyle='rgba(242,184,75,.8)';x.textAlign='center';x.font=`700 34px ${art.font}`;x.fillText('02 · RECORD REST',256,268);});
  const rl=new THREE.Mesh(new THREE.PlaneGeometry(.38,.38),new THREE.MeshBasicMaterial({map:rlT,transparent:true,depthWrite:false,opacity:.6}));rl.rotation.x=-Math.PI/2;rl.position.set(REST.x,PAD_TOP+.0008,REST.z);root.add(rl);
  // ---- turntable ----
  for(const [x,z] of [[-.24,-.19],[.24,-.19],[-.24,.19],[.24,.19]])cyl(root,.028,.03,.012,M.rubber,x,.006,z,16);
  const plinth=box(root,.56,.05,.45,new THREE.MeshStandardMaterial({color:0xc3c9d2,roughness:.42,metalness:.35}),0,.045,0);box(root,.562,.012,.452,M.black,0,.016,0);
  const PG=new THREE.Group();PG.position.set(SPIN.x,0,SPIN.z);root.add(PG);
  const platter=cyl(PG,.185,.185,.024,M.chrome,0,.082,0,64);
  const dots=new THREE.InstancedMesh(new THREE.BoxGeometry(.0034,.0024,.0012),new THREE.MeshStandardMaterial({color:0x2a2a2e,roughness:.4,metalness:.6}),4*120),dm=new THREE.Object3D();
  for(let r=0;r<4;r++){const n=[120,116,112,108][r];for(let i=0;i<120;i++){const a=i/n*Math.PI*2;dm.position.set(Math.sin(a)*.1855,.0735+r*.0052,Math.cos(a)*.1855);dm.rotation.y=a;dm.scale.setScalar(i<n?1:0);dm.updateMatrix();dots.setMatrixAt(r*120+i,dm.matrix);}}PG.add(dots);
  const matT=art.panel(512,512,(x)=>{x.fillStyle='#121216';x.fillRect(0,0,512,512);x.strokeStyle='#2c2c33';x.lineWidth=2;for(let r=60;r<250;r+=14){x.beginPath();x.arc(256,256,r,0,7);x.stroke();}x.fillStyle='#f2b84b';x.font=`800 44px ${art.font}`;x.textAlign='center';x.fillText('XTRATA',256,150);x.font=`600 22px ${art.font}`;x.fillText('MUSIC · ON-CHAIN',256,390);});
  const mat=new THREE.Mesh(new THREE.CylinderGeometry(.152,.152,.002,48),[M.rubber,new THREE.MeshStandardMaterial({map:matT,roughness:.95}),M.rubber]);mat.position.y=.095;PG.add(mat);
  cyl(PG,.0036,.0036,.019,M.chrome,0,.1035,0,12);
  const ringM=new THREE.MeshBasicMaterial({color:0xf2b84b,transparent:true,opacity:.9,depthTest:false,toneMapped:false});
  const ring=new THREE.Mesh(new THREE.RingGeometry(.146,.157,64),ringM);ring.rotation.x=-Math.PI/2;ring.position.set(SPIN.x,.1,SPIN.z);ring.visible=false;ring.renderOrder=8;root.add(ring);
  const ctl=(m,name)=>{m.userData.ctl=name;return m;};
  const btnM=new THREE.MeshStandardMaterial({color:0xc9ccd2,roughness:.3,metalness:.8});
  const startBtn=ctl(box(root,.052,.012,.036,btnM,-.238,.076,.192),'start');
  const b33=ctl(box(root,.027,.009,.02,btnM,-.186,.0745,.2075),'33'),b45=ctl(box(root,.027,.009,.02,btnM,-.154,.0745,.2075),'45');
  const ledM=()=>new THREE.MeshBasicMaterial({color:0x330000});const l33=new THREE.Mesh(new THREE.SphereGeometry(.0028,8,6),ledM());l33.position.set(-.186,.0725,.192);root.add(l33);const l45=l33.clone();l45.material=ledM();l45.position.x=-.154;root.add(l45);
  const power=ctl(cyl(root,.016,.016,.016,M.black,-.255,.078,.135,20),'power');const strobe=new THREE.Mesh(new THREE.SphereGeometry(.005,8,6),new THREE.MeshBasicMaterial({color:0xff3020}));strobe.position.set(-.238,.074,.118);root.add(strobe);
  const lbl=art.panel(256,64,(x)=>{x.clearRect(0,0,256,64);x.fillStyle='#111';x.font=`700 20px ${art.font}`;x.fillText('START·STOP',6,26);x.fillText('33   45',150,26);x.fillText('PITCH ±8%',6,54);});
  const lp=new THREE.Mesh(new THREE.PlaneGeometry(.12,.03),new THREE.MeshBasicMaterial({map:lbl,transparent:true}));lp.rotation.x=-Math.PI/2;lp.position.set(-.2,.0706,.168);root.add(lp);
  const PZ0=.105,PSPAN=.085;
  const pTrack=ctl(box(root,.022,.003,.2,M.matte,.252,.0715,PZ0),'pitch');const pKnob=ctl(box(root,.032,.014,.016,M.black,.252,.079,PZ0),'pitch');
  const pm=art.panel(64,256,(x)=>{x.clearRect(0,0,64,256);x.fillStyle='#111';x.font=`700 20px ${art.font}`;x.textAlign='center';x.fillText('−8',32,22);x.fillText('0',32,134);x.fillText('+8',32,250);for(let i=0;i<=8;i++)x.fillRect(48,14+i*28.5,14,2);});
  const pmp=new THREE.Mesh(new THREE.PlaneGeometry(.022,.19),new THREE.MeshBasicMaterial({map:pm,transparent:true}));pmp.rotation.x=-Math.PI/2;pmp.position.set(.226,.0706,PZ0);root.add(pmp);
  const cueBase=box(root,.03,.012,.03,M.black,.255,.076,-.035);const cueLever=ctl(cyl(root,.004,.004,.04,M.chrome,.255,.095,-.035,8),'cue');ctl(cueBase,'cue');
  const PIV=new THREE.Vector3(.19,.12,-.12),TIP=new THREE.Vector3(-.009,-.021,.248),ARM_L=Math.hypot(TIP.y,TIP.z),PHI0=Math.atan2(-TIP.y,TIP.z);
  cyl(root,.034,.036,.04,M.black,PIV.x,.09,PIV.z,24);const gim=new THREE.Mesh(new THREE.TorusGeometry(.021,.004,8,20),M.chrome);gim.position.set(PIV.x,.118,PIV.z);gim.rotation.x=Math.PI/2;root.add(gim);
  cyl(root,.005,.005,.036,M.chrome,.203,.088,.012,8);box(root,.016,.006,.01,M.black,.203,.107,.012);
  const yawG=new THREE.Group();yawG.position.copy(PIV);root.add(yawG);const pitchG=new THREE.Group();yawG.add(pitchG);
  const tube=ctl(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,-.04),new THREE.Vector3(0,0,0),new THREE.Vector3(.011,0,.07),new THREE.Vector3(-.005,0,.15),new THREE.Vector3(-.0105,-.003,.206)]),40,.0042,8),M.chrome),'arm');tube.castShadow=true;pitchG.add(tube);
  const cw=cyl(pitchG,.019,.019,.042,M.silver,0,0,-.06,20);cw.rotation.x=Math.PI/2;
  const head=ctl(box(pitchG,.02,.004,.05,M.black,-.0105,-.005,.226),'arm'),cart=ctl(box(pitchG,.015,.011,.024,new THREE.MeshStandardMaterial({color:0xd4a017,roughness:.4,metalness:.5}),-.0095,-.0125,.236),'arm');
  const sty=new THREE.Mesh(new THREE.ConeGeometry(.0013,.0045,8),M.chrome);sty.rotation.x=Math.PI;sty.position.set(TIP.x,TIP.y+.00225,TIP.z);pitchG.add(sty);
  const fl=ctl(cyl(pitchG,.0016,.0016,.03,M.chrome,.009,-.003,.238,6),'arm');fl.rotation.z=Math.PI/2;
  const armHit=ctl(box(pitchG,.07,.05,.11,M.pick,-.008,-.004,.215),'arm');const pitchHit=ctl(box(root,.05,.03,.21,M.pick,.252,.08,PZ0),'pitch');const startHit=ctl(box(root,.07,.03,.05,M.pick,-.238,.08,.192),'start');
  const marker=new THREE.Mesh(new THREE.RingGeometry(.004,.008,24),new THREE.MeshBasicMaterial({color:0xf2b84b,depthTest:false,transparent:true,toneMapped:false}));marker.rotation.x=-Math.PI/2;marker.visible=false;marker.renderOrder=9;root.add(marker);
  // headphones, monitor, mixer/VU
  const hp=new THREE.Group();hp.position.set(-1.45,0,-.02);root.add(hp);cyl(hp,.06,.07,.015,M.black,0,.008,0);cyl(hp,.008,.008,.26,M.black,0,.14,0,8);
  const band=new THREE.Mesh(new THREE.TorusGeometry(.085,.009,8,24,Math.PI),M.matte);band.position.y=.22;hp.add(band);for(const s of [-1,1]){const c=cyl(hp,.045,.045,.03,M.black,s*.085,.2,0,20);c.rotation.z=Math.PI/2;}
  const mon=new THREE.Group();mon.position.set(.82,0,-.3);mon.rotation.y=-.3;root.add(mon);box(mon,.34,.28,.05,M.black,0,.2,0);box(mon,.16,.06,.12,M.black,0,.03,0);
  V.monTex=art.panel(256,256,()=>{});plane(mon,.31,.25,basic(V.monTex),0,.2,.0265);
  const mix=new THREE.Group();mix.position.set(.62,0,.2);root.add(mix);box(mix,.22,.05,.16,M.black,0,.025,0);V.vuTex=art.panel(256,96,()=>{});const vp=plane(mix,.2,.075,basic(V.vuTex),0,.0505,0);vp.rotation.x=-Math.PI/2;
  V.labelTex=art.panel(256,256,()=>{});
  function drawLabel(rel,t,rpm){const x=V.labelTex.userData.canvas.getContext('2d');x.fillStyle='#111';x.fillRect(0,0,256,256);x.save();x.beginPath();x.arc(128,128,128,0,7);x.clip();
    x.drawImage(art.track(rel,t).canvas,0,0,256,256);x.fillStyle='rgba(0,0,0,.45)';x.fillRect(0,0,256,256);x.fillStyle='#fff3d6';x.textAlign='center';x.font=`800 20px ${art.font}`;x.fillText(fitText(x,t.title,190),128,62);
    x.font=`600 14px ${art.font}`;x.fillText(fitText(x,rel.artist||'XTRATA MUSIC',170),128,84);x.fillStyle='#f2b84b';x.font=`700 15px ${art.font}`;x.fillText((rpm===45?'45':'33⅓')+' RPM · #'+t.id,128,188);x.font=`600 12px ${art.font}`;x.fillText('SIDE A · TRK '+t.n+'/'+rel.tracks.length,128,208);x.restore();V.labelTex.needsUpdate=true;}

  // ---- state ----
  const PHI_UP=.085,PHI_REST=.034,YAW_MAX=.04;
  const B={phase:'empty',rel:null,slot:null,sleeve:null,rec:null,onPlatter:false,motor:{on:false,speed:0,angle:0,power:true},rpm:33,pitch:0,arm:{yaw:0,phi:PHI_REST,vel:0,state:'rest'},side:0,g:null,cue:null,labelIdx:-1,seq:0};V.b=B;
  const nominal=()=>B.rec&&B.rec.size===7?45:100/3,rpmVal=()=>B.rpm===45?45:100/3;
  const surfY=()=>B.onPlatter?SPIN.y+REC.TH/2:.097;
  const contactPhi=()=>Math.asin(clamp((surfY()-PIV.y)/ARM_L,-1,1))+PHI0;
  function tipAt(yaw,phi,out=new THREE.Vector3()){const a=phi-PHI0,y=ARM_L*Math.sin(a),zz=ARM_L*Math.cos(a);out.set(PIV.x+TIP.x*Math.cos(yaw)+zz*Math.sin(yaw),PIV.y+y,PIV.z-TIP.x*Math.sin(yaw)+zz*Math.cos(yaw));return out;}
  const tmp=new THREE.Vector3();
  const radiusAt=yaw=>{tipAt(yaw,contactPhi(),tmp);return Math.hypot(tmp.x-SPIN.x,tmp.z-SPIN.z);};
  let YAW_MIN=0;{let lo=-1.3,hi=0;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(radiusAt(m)<.022)lo=m;else hi=m;}YAW_MIN=hi;}
  const yawForRadius=r=>{let lo=YAW_MIN,hi=YAW_MAX;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(radiusAt(m)<r)lo=m;else hi=m;}return (lo+hi)/2;};
  const grooves=()=>{const s=B.rec?recScale(B.rec.size):REC.S12;return {o:REC.GO*s,i:REC.GI*s,R:REC.R*s};};
  function cueAt(yaw){const r=radiusAt(yaw),G=grooves(),legal=B.onPlatter&&r<=G.o&&r>=G.i;if(!B.rel)return {r,legal:false,where:'no record'};
    const f=clamp((G.o-r)/(G.o-G.i),0,1),side=f*B.rel.seconds;const tr=trackAt(side);
    return {r,legal,f,side,idx:tr.idx,offset:tr.offset,zone:f<.2?'START':f<.8?'MIDDLE':'END',where:!B.onPlatter?'no record':r>G.R?'off the record':r>G.o?'outer edge':r<G.i?'centre label':'groove'};}
  function trackAt(side){const ts=B.rel.tracks;let acc=0;for(let i=0;i<ts.length;i++){if(side<acc+ts[i].seconds||i===ts.length-1)return {idx:i,offset:clamp(side-acc,0,ts[i].seconds)};acc+=ts[i].seconds;}return {idx:0,offset:0};}
  const trackStart=i=>B.rel.tracks.slice(0,i).reduce((a,t)=>a+t.seconds,0);
  V.math={tipAt,radiusAt,yawForRadius,contactPhi,cueAt,trackAt,get YAW_MIN(){return YAW_MIN;},PIV,TIP,SPIN,REST,SLEEVE,DECK,CARRY_Y,PHI_UP,PHI_REST};
  const playing=()=>B.arm.state==='down'&&B.motor.on&&B.motor.power;
  const rate=()=>rpmVal()/nominal()*(1+B.pitch);
  function sync(){if(!B.rel||!B.onPlatter){app.playback.vinylClear();return;}const t=trackAt(B.side);app.playback.vinylSync(B.rel,t.idx,t.offset,playing(),rate(),B.arm.state==='down'||B.arm.state==='raised'||B.arm.state==='held'||B.arm.state==='falling'||B.arm.state==='cueing');
    if(t.idx!==B.labelIdx){B.labelIdx=t.idx;drawLabel(B.rel,B.rel.tracks[t.idx],B.rpm);}}
  const setPhase=p=>{B.phase=p;ph.visible=p==='ready'||p==='empty';rl.material.opacity=(p==='sleeved'||p==='extracting')?.95:.45;panel();app.emit('vinyl');};
  // ---- focus / camera ----
  function pose(close){const a=app.camera.aspect;if(close){const look=new THREE.Vector3(RX-.01,RY+.07,RZ+.01),d=Math.max(.98,.8/(1.1547*a));return {pos:look.clone().add(new THREE.Vector3(0,.8,.6).normalize().multiplyScalar(d)),look};}
    const look=new THREE.Vector3(RX-.5,RY+.02,RZ),d=Math.max(1.5,1.95/(1.1547*a));return {pos:look.clone().add(new THREE.Vector3(0,.76,.65).normalize().multiplyScalar(d)),look};}
  V.focus=()=>{const p=pose(B.phase==='parked');app.setFocus('vinyl',p.pos,p.look);if(B.phase==='empty'&&app.carry&&app.carry.kind==='vinyl'){drawPlaceholder(app.carry.rel);setPhase('ready');}else{if(B.phase==='empty')drawPlaceholder(null);panel();}};
  V.onExit=()=>{V.cancelGesture('exit');if(B.phase==='ready')setPhase('empty');};
  const refocus=()=>{if(app.state.mode==='vinyl'){const p=pose(B.phase==='parked');app.setFocus('vinyl',p.pos,p.look,.7);}};
  const roomPick=new THREE.Mesh(new THREE.BoxGeometry(3.3,.5,1.1),M.pick);roomPick.position.set(4.5,1.27,-4.65);
  app.addPick(roomPick,{id:'bench',title:'Vinyl Listening Bench',get sub(){return B.rel?'On the bench: '+B.rel.title:app.carry&&app.carry.kind==='vinyl'?'You are carrying a sleeve — step up to place it':'Turntable · sleeve pad · record rest';},hint:'Click to step up to the turntable',reach:3.6,click:()=>V.focus()});
  // ---- workflow ----
  const A=(dur,fn,ease=easeIO)=>app.anim(dur,t=>fn(ease(t)));
  V.placeSleeve=async()=>{if(B.phase!=='ready'||!app.carry||app.carry.kind!=='vinyl')return false;
    const c=app.carry,w=app.inspector.carryWorld();B.rel=c.rel;B.slot=c.slot;setPhase('docking');
    const s=app.models.makeJacket(c.rel,false);B.sleeve=s;root.add(s.group);const p0=root.worldToLocal(w.p.clone()),q0=w.q.clone(),q1=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
    s.group.position.copy(p0);s.group.quaternion.copy(q0);app.setCarry(null,true);app.foley('slide');
    const hover=new THREE.Vector3(SLEEVE.x,.3,SLEEVE.z);
    await A(.6,t=>{s.group.position.lerpVectors(p0,hover,t);s.group.quaternion.slerpQuaternions(q0,q1,t);phMat.opacity=1-t;});
    await A(.42,t=>{s.group.position.set(SLEEVE.x,lerp(.3,SLEEVE.y,t),SLEEVE.z);});
    s.group.quaternion.copy(q1);app.foley('thud');B.rec=app.models.makeRecord(c.rel.vinyl,V.labelTex);B.rec.group.position.copy(SLEEVE);B.rec.group.position.y=SLEEVE.y;B.rec.group.visible=false;root.add(B.rec.group);
    B.side=0;B.labelIdx=-1;drawLabel(c.rel,c.rel.tracks[0],c.rel.vinyl===7?45:33);B.labelIdx=0;B.rpm=c.rel.vinyl===7?45:33;setPhase('sleeved');return true;};
  V.extract=async()=>{if(B.phase!=='sleeved')return false;setPhase('extracting');const r=B.rec.group;r.visible=true;app.foley('slide');
    await A(.95,t=>{r.position.set(lerp(SLEEVE.x,REST.x,t),lerp(SLEEVE.y,REST.y,smooth((t-.7)/.3)),REST.z);});
    app.foley('thud');setPhase('loose');return true;};
  async function moveDisc(to,thenPhase){const r=B.rec.group,p0=r.position.clone();
    if(p0.y<CARRY_Y-.002)await A(.22*(CARRY_Y-p0.y)/CARRY_Y+.05,t=>{r.position.y=lerp(p0.y,CARRY_Y,t);},easeOut);
    const p1=r.position.clone();const d=Math.hypot(to.x-p1.x,to.z-p1.z);if(d>.001)await A(clamp(d*1.1,.12,.55),t=>{r.position.x=lerp(p1.x,to.x,t);r.position.z=lerp(p1.z,to.z,t);});
    await A(.3,t=>{r.position.y=lerp(CARRY_Y,to.y,t);});r.position.copy(to);}
  async function seat(){setPhase('placing');ring.visible=false;if(B.onPlatter){}else root.attach(B.rec.group);B.rec.group.rotation.set(0,B.rec.group.rotation.y,0);
    await moveDisc(SPIN);PG.attach(B.rec.group);B.rec.group.position.set(0,SPIN.y,0);B.onPlatter=true;B.rpm=B.rec.size===7?45:33;app.foley('thud');setPhase('parked');sync();refocus();}
  async function toRest(){const wasOn=B.onPlatter;setPhase('placing');ring.visible=false;root.attach(B.rec.group);B.rec.group.rotation.set(0,0,0);B.onPlatter=false;if(wasOn)app.playback.vinylClear();
    await moveDisc(REST);app.foley('thud');setPhase('loose');if(wasOn)refocus();}
  V.placeOnSpindle=()=>{if(B.phase!=='loose'||B.g)return false;seat();return true;};
  V.liftToRest=async()=>{if(B.phase!=='parked'||B.g)return false;if(!canLift())return false;await toRest();return true;};
  function canLift(){if(B.arm.state!=='rest'){app.toast('Park the tonearm on its rest before lifting the record.');return false;}if(B.motor.on||B.motor.speed>.3){app.toast('Stop the platter first (Start·Stop).');return false;}return true;}
  V.resleeve=async()=>{if(B.phase!=='loose'||B.g)return false;setPhase('resleeving');const r=B.rec.group;app.foley('slide');
    await A(.9,t=>{r.position.set(lerp(REST.x,SLEEVE.x,t),lerp(REST.y,SLEEVE.y,smooth(t/.3)),REST.z);});r.visible=false;setPhase('sleeved');return true;};
  V.pickUpSleeve=()=>{if(B.phase!=='sleeved')return false;if(app.carry){app.toast('Your hands are full.');return false;}
    root.remove(B.sleeve.group);B.sleeve.dispose();root.remove(B.rec.group);B.rec.dispose();const c={kind:'vinyl',rel:B.rel,slot:B.slot};B.sleeve=B.rec=null;B.rel=B.slot=null;B.side=0;app.playback.vinylClear();
    app.setCarry(c);phMat.opacity=1;drawPlaceholder(c.rel);setPhase(app.state.mode==='vinyl'?'ready':'empty');app.foley('pull');return true;};
  V.returnAll=async()=>{if(B.g||B.returning)return false;if(B.phase==='ready'||(B.phase==='empty'&&app.carry&&app.carry.kind==='vinyl'))return V.returnCarried();
    if(!['sleeved','loose','parked'].includes(B.phase))return false;B.returning=true;
    try{if(B.phase==='parked'){if(B.arm.state!=='rest')await park();B.motor.on=false;sync();while(B.motor.speed>.25)await app.anim(.1,()=>{});await toRest();}
      if(B.phase==='loose')await V.resleeve();
      if(B.phase==='sleeved'){const s=B.sleeve.group,p0=s.position.clone();await A(.45,t=>{s.position.y=lerp(p0.y,.34,t);s.scale.setScalar(1-t*.25);});
        const slot=B.slot;root.remove(s);B.sleeve.dispose();root.remove(B.rec.group);B.rec.dispose();B.sleeve=B.rec=null;B.rel=B.slot=null;B.side=0;app.playback.vinylClear();V.showJacket(slot,true);phMat.opacity=1;drawPlaceholder(null);setPhase('empty');app.foley('slide');app.toast('Record resleeved and returned to its exact crate slot.');}
    }finally{B.returning=false;}return true;};
  // ---- arm ----
  async function park(){const a=B.arm;if(a.state==='rest')return;const was=a.state;a.state='parking';a.vel=0;if(was==='down')sync();marker.visible=false;const seq=++B.seq,p0=a.phi,y0=a.yaw;
    await A(.2,t=>{a.phi=lerp(p0,PHI_UP,t);});await A(.3+Math.abs(y0)*.5,t=>{a.yaw=lerp(y0,0,t);});await A(.25,t=>{a.phi=lerp(PHI_UP,PHI_REST,t);});
    if(B.seq===seq){a.state='rest';a.yaw=0;a.phi=PHI_REST;sync();panel();app.emit('vinyl');}}
  V.park=park;
  function releaseArm(){const a=B.arm,c=cueAt(a.yaw);marker.visible=false;if(c.legal){a.state='falling';a.vel=0;}else{if(B.onPlatter)app.toast(c.where==='centre label'?'That is the centre label — the arm returns to its rest.':c.where==='outer edge'?'Outside the first groove — the arm returns to its rest.':'Not over the record — the arm returns to its rest.');park();}panel();}
  function land(){const a=B.arm,c=cueAt(a.yaw);a.phi=contactPhi();a.vel=0;if(!c.legal){park();return;}a.state='down';B.side=Math.min(c.side,B.rel.seconds-.05);app.foley('needle');sync();panel();app.emit('vinyl');}
  V.cueTo=async(side)=>{if(B.phase!=='parked'||!B.onPlatter||B.g)return false;const a=B.arm;if(['parking','cueing'].includes(a.state))return false;
    side=clamp(side,0,B.rel.seconds-.2);if(!B.motor.power)B.motor.power=true;if(!B.motor.on){B.motor.on=true;app.foley('click');}
    const was=a.state;a.state='cueing';a.vel=0;if(was==='down')sync();const seq=++B.seq,G=grooves(),yt=yawForRadius(G.o-(side/B.rel.seconds)*(G.o-G.i)),p0=a.phi,y0=a.yaw;
    await A(.18,t=>{a.phi=lerp(p0,PHI_UP,t);});await A(.25+Math.abs(yt-y0)*.5,t=>{a.yaw=lerp(y0,yt,t);});if(B.seq!==seq)return false;B.side=side;a.state='falling';a.vel=0;panel();return true;};
  V.cueLever=()=>{const a=B.arm;app.foley('click');if(a.state==='down'){a.state='raised';sync();panel();return true;}if(a.state==='raised'){releaseArm();return true;}
    if(a.state==='rest'){app.toast(B.onPlatter?'Swing the tonearm over the record first — or pick a track in the panel.':'Put a record on the platter first.');return false;}return false;};
  V.motorToggle=()=>{if(!B.motor.power){app.toast('Turntable power is off — click the power dial.');return false;}B.motor.on=!B.motor.on;app.foley('click');sync();panel();return true;};
  V.setRpm=r=>{B.rpm=r;app.foley('click');sync();panel();};
  V.setPitch=p=>{B.pitch=clamp(p,-.08,.08);pKnob.position.z=PZ0+B.pitch/.08*PSPAN;if(playing())sync();if(!B.g)panel();};
  V.powerToggle=()=>{B.motor.power=!B.motor.power;if(!B.motor.power)B.motor.on=false;app.foley('click');sync();panel();};
  // transport requests coming from the shared mini-player
  V.transport=(act,arg)=>{if(B.phase!=='parked'){app.toast('The record is not on the platter.');return false;}const a=B.arm;
    if(act==='toggle'){if(a.state==='down'&&playing()){a.state='raised';sync();panel();return true;}if(a.state==='down'){return V.motorToggle();}if(a.state==='raised'){if(!B.motor.on)B.motor.on=true;releaseArm();return true;}return V.cueTo(B.side||0);}
    if(act==='pause'){if(a.state==='down'){a.state='raised';sync();panel();}return true;}
    const t=trackAt(B.side);if(act==='next'){if(t.idx+1>=B.rel.tracks.length)return false;return V.cueTo(trackStart(t.idx+1)+.01);}
    if(act==='prev')return V.cueTo(trackStart(t.offset>3?t.idx:Math.max(0,t.idx-1))+.01);
    if(act==='seek')return V.cueTo(trackStart(t.idx)+arg);if(act==='track')return V.cueTo(trackStart(arg)+.01);return false;};
  // ---- pointer picking (screen-coordinate raycasts on real geometry) ----
  const ray=new THREE.Raycaster(),v2=new THREE.Vector2(),pl=new THREE.Plane(),hitP=new THREE.Vector3();
  const tier1=[startBtn,b33,b45,power,pKnob,pTrack,cueLever,cueBase,tube,head,cart,fl],tier2=[armHit,pitchHit,startHit];
  function setRay(cx,cy){v2.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);app.camera.updateMatrixWorld(true);ray.setFromCamera(v2,app.camera);}
  V.pickAt=(cx,cy)=>{setRay(cx,cy);root.updateMatrixWorld(true);
    let h=ray.intersectObjects(tier1,false)[0];if(h)return {ctl:h.object.userData.ctl,tier:1,d:h.distance};
    h=ray.intersectObjects(tier2,false)[0];if(h)return {ctl:h.object.userData.ctl,tier:2,d:h.distance};
    const big=[sleevePad,restPad,platter,plinth];if(B.sleeve)big.push(B.sleeve.body);if(B.rec&&B.rec.group.visible)big.push(B.rec.disc);if(ph.visible)big.push(ph);
    h=ray.intersectObjects(big,false)[0];if(!h)return null;const o=h.object;
    return {ctl:B.rec&&o===B.rec.disc?'disc':B.sleeve&&o===B.sleeve.body?'sleeve':(o===sleevePad||o===ph)?'pad':o===restPad?'rest':'deck',tier:3,d:h.distance};};
  function planeHit(cx,cy,y){setRay(cx,cy);pl.set(new THREE.Vector3(0,1,0),-(RY+y));if(!ray.ray.intersectPlane(pl,hitP))return null;return root.worldToLocal(hitP.clone());}
  let down=null;
  V.pointerDown=e=>{if(B.g)return;const h=V.pickAt(e.clientX,e.clientY);down={x:e.clientX,y:e.clientY,h};if(!h)return;
    if(h.ctl==='arm'){const a=B.arm;if(['parking','cueing'].includes(a.state)||['docking','extracting','placing','resleeving'].includes(B.phase))return;
      const p=planeHit(e.clientX,e.clientY,PIV.y);if(!p)return;const was=a.state;a.state='held';a.vel=0;if(was==='down')sync();
      B.g={type:'arm',off:a.yaw-Math.atan2(p.x-PIV.x,p.z-PIV.z),id:e.pointerId};app.beginGesture(e);app.foley('click');panel();}
    else if(h.ctl==='disc'){if(B.phase==='parked'){if(!canLift())return;}else if(B.phase!=='loose')return;
      const p=planeHit(e.clientX,e.clientY,CARRY_Y);if(!p)return;const from=B.phase==='parked'?'platter':'rest';
      if(from==='platter'){root.attach(B.rec.group);B.rec.group.rotation.set(0,B.rec.group.rotation.y,0);B.onPlatter=false;app.playback.vinylClear();}
      const o=B.rec.group.position.clone();B.g={type:'disc',from,o,gx:o.x-p.x,gz:o.z-p.z,lift:0,engaged:from==='platter',mag:from==='platter'?1:0,ix:o.x,iz:o.z,id:e.pointerId};ring.visible=true;app.beginGesture(e);app.foley('pull');panel();}
    else if(h.ctl==='pitch'){B.g={type:'pitch',id:e.pointerId};app.beginGesture(e,true);V.pointerMove(e);}
  };
  V.pointerMove=e=>{const G=B.g;if(!G){if(!down)V.hover(e.clientX,e.clientY);return;}
    if(G.type==='arm'){const p=planeHit(e.clientX,e.clientY,PIV.y);if(p)B.arm.yaw=clamp(Math.atan2(p.x-PIV.x,p.z-PIV.z)+G.off,YAW_MIN,YAW_MAX);}
    else if(G.type==='disc'){const p=planeHit(e.clientX,e.clientY,CARRY_Y);if(p){G.ix=clamp(p.x+G.gx,-1.6,.22);G.iz=clamp(p.z+G.gz,-.36,.34);}}
    else if(G.type==='pitch'){const p=planeHit(e.clientX,e.clientY,.08);if(p)V.setPitch((p.z-PZ0)/PSPAN*.08);}};
  V.pointerUp=e=>{const G=B.g;if(G){B.g=null;app.endGesture();
      if(G.type==='arm')releaseArm();else if(G.type==='disc'){if(G.engaged)seat();else toRest();}else panel();down=null;return;}
    const d=down;down=null;if(!d||!d.h||!e)return;const dx=e.clientX-d.x,moved=Math.hypot(dx,e.clientY-d.y);
    if(d.h.ctl==='sleeve'&&B.phase==='sleeved'&&(moved<8||dx>36)){V.extract();return;}
    if(moved>8)return;const c=d.h.ctl;
    if(c==='pad'){if(B.phase==='ready')V.placeSleeve();else if(B.phase==='empty')app.toast('Pick a sleeve from the crates and carry it here first.');}
    else if(c==='sleeve'&&B.phase==='loose')V.resleeve();
    else if(c==='start')V.motorToggle();else if(c==='33')V.setRpm(33);else if(c==='45')V.setRpm(45);else if(c==='power')V.powerToggle();else if(c==='cue')V.cueLever();};
  V.cancelGesture=why=>{const G=B.g;down=null;if(!G)return false;B.g=null;app.endGesture();marker.visible=false;
    if(G.type==='arm'){const c=cueAt(B.arm.yaw);if(c.legal){B.arm.state='raised';sync();}else park();}
    else if(G.type==='disc'){if(G.from==='platter')seat();else toRest();}
    panel();return true;};
  V.hover=(cx,cy)=>{if(app.state.mode!=='vinyl')return;const h=V.pickAt(cx,cy);let c='';if(h){if(h.ctl==='arm'||(h.ctl==='disc'&&(B.phase==='loose'||B.phase==='parked')))c='grab';else if(['start','33','45','power','cue','pitch'].includes(h.ctl)||(h.ctl==='pad'&&B.phase==='ready')||(h.ctl==='sleeve'&&(B.phase==='sleeved'||B.phase==='loose')))c='pointer';}app.setCursor(c);};
  V.key=e=>{const k=e.key.toLowerCase();if(k==='enter'||k===' '){if(B.phase==='ready')V.placeSleeve();else if(B.phase==='sleeved')V.extract();else if(B.phase==='loose')V.placeOnSpindle();else if(B.phase==='parked'){if(k===' ')V.transport('toggle');else V.motorToggle();}return true;}
    if(k==='c'&&B.phase==='parked'){V.cueLever();return true;}if(k==='r'){V.returnAll();return true;}
    if(/^[1-9]$/.test(k)&&B.phase==='parked'&&+k<=B.rel.tracks.length){V.transport('track',+k-1);return true;}
    if(k==='['||k===']'){V.setPitch(B.pitch+(k===']'?.01:-.01));return true;}return false;};
  // ---- per-frame ----
  let vuT=0,pulse=0;
  V.update=dt=>{
    // crates
    for(const L of V.lanes){if(L.forceT>0){L.forceT-=dt;if(L.forceT<=0)L.force=-1;}const aim=L.aim>=0?L.aim:L.force;
      for(const it of L.items){if(!it.piv.visible)continue;const tgt=aim>=0&&it.pg===L.page&&it.idx<aim?FLIP:REST_TILT,lt=it.idx===aim?.022:0;
        if(Math.abs(it.ang-tgt)>.0005||Math.abs(it.lift-lt)>.0005){const k=1-Math.exp(-dt*11);it.ang=lerp(it.ang,tgt,k);it.lift=lerp(it.lift,lt,k);it.piv.rotation.x=it.ang;it.piv.position.y=FLOOR+it.lift;}}}
    // placeholder pulse
    if(B.phase==='ready'){pulse+=dt;phMat.opacity=.72+.28*Math.sin(pulse*4);}
    // motor
    const m=B.motor,target=m.on&&m.power?rpmVal()*2*Math.PI/60*(1+B.pitch):0,ds=target-m.speed;m.speed+=Math.sign(ds)*Math.min(Math.abs(ds),(ds>0?5.2:4)*dt);m.angle+=m.speed*dt;PG.rotation.y=-m.angle;
    strobe.material.color.setHex(m.power?0xff3020:0x220400);l33.material.color.setHex(m.power&&B.rpm===33?0xff2a1a:0x330000);l45.material.color.setHex(m.power&&B.rpm===45?0xff2a1a:0x330000);
    startBtn.position.y=m.on?.0745:.076;
    // disc gesture
    const G=B.g;
    if(G&&G.type==='disc'){G.lift=Math.min(1,G.lift+dt/.2);const r=B.rec.group,w=smooth((G.lift-.45)/.55),dist=Math.hypot(G.ix-SPIN.x,G.iz-SPIN.z);
      if(G.lift>=1||G.from==='platter')G.engaged=G.engaged?dist<.202:dist<.166;G.mag=lerp(G.mag,G.engaged?1:0,1-Math.exp(-dt*12));
      const tx=lerp(G.ix,SPIN.x,G.mag*.88),tz=lerp(G.iz,SPIN.z,G.mag*.88);
      r.position.set(lerp(G.o.x,tx,w),lerp(G.o.y,CARRY_Y,easeOut(G.lift)),lerp(G.o.z,tz,w));ringM.color.setHex(G.engaged?0x42e87a:0xf2b84b);}
    // arm
    const a=B.arm;
    if(a.state==='held'||a.state==='raised')a.phi=lerp(a.phi,PHI_UP,1-Math.exp(-dt*22));
    else if(a.state==='falling'){let rem=Math.min(dt,.05);const pc=contactPhi();while(rem>1e-6&&a.state==='falling'){const h=Math.min(rem,1/240);rem-=h;a.vel+=(-9.81*.13*Math.cos(a.phi)/ARM_L-5.6*a.vel)*h;a.phi+=a.vel*h;if(a.phi<=pc){a.phi=pc;land();}}}
    else if(a.state==='down'){a.phi=contactPhi();
      if(playing()||m.speed>.05){const rt=m.speed/(nominal()*2*Math.PI/60);B.side+=app.realDt*rt;
        if(B.side>=B.rel.seconds){B.side=B.rel.seconds;app.playback.vinylEnd();app.toast('End of side — the tonearm lifts and returns to its rest.');m.on=false;park();}
        else{const G2=grooves();a.yaw=yawForRadius(G2.o-(B.side/B.rel.seconds)*(G2.o-G2.i));const t=trackAt(B.side);if(t.idx!==B.labelIdx)sync();app.playback.vinylTime(t.idx,t.offset);}}}
    else if(a.state==='rest'){a.yaw=lerp(a.yaw,0,1-Math.exp(-dt*10));a.phi=lerp(a.phi,PHI_REST,1-Math.exp(-dt*10));}
    yawG.rotation.y=a.yaw;pitchG.rotation.x=-a.phi;
    if(a.state==='held'){B.cue=cueAt(a.yaw);tipAt(a.yaw,contactPhi(),tmp);marker.visible=B.onPlatter;marker.position.set(tmp.x,surfY()+.0012,tmp.z);marker.material.color.setHex(B.cue.legal?0x42e87a:0xff5a3c);app.ui.cueTag(cueText(B.cue),marker);}
    else if(B.cue){B.cue=null;marker.visible=false;app.ui.cueTag(null);}
    // VU
    vuT+=dt;if(vuT>.1){vuT=0;drawVU();}
  };
  function cueText(c){if(!B.rel)return 'No record';if(!c.legal)return c.where==='groove'?'':'✕ '+c.where+' — releases to rest';const t=B.rel.tracks[c.idx];return c.zone+' · '+t.n+'. '+t.title+' · '+fmt(c.offset);}
  let vuL=0,vuR=0,vuOn=false;
  function drawVU(){const pb=app.playback,on=pb.s.playing&&pb.s.source==='vinyl';if(!on&&!vuOn&&vuL<.01)return;vuOn=on;let lv=pb.levels();const live=!!lv;
    if(!lv){const t=performance.now()/1000;lv=on?[.45+.3*Math.sin(t*7.1)+.2*Math.sin(t*13.7),.45+.3*Math.sin(t*6.3+1)+.2*Math.sin(t*15.1)]:[0,0];}
    vuL=lerp(vuL,clamp(lv[0],0,1),.5);vuR=lerp(vuR,clamp(lv[1],0,1),.5);const x=V.vuTex.userData.canvas.getContext('2d');x.fillStyle='#0b0b0d';x.fillRect(0,0,256,96);
    [vuL,vuR].forEach((v,i)=>{for(let k=0;k<16;k++){x.fillStyle=k/16<v?(k>12?'#ff4d3a':k>9?'#f2b84b':'#39d98a'):'#1d1f22';x.fillRect(28+k*13.6,12+i*26,10,18);}});
    x.fillStyle='#8d949c';x.font=`700 13px ${art.font}`;x.fillText('L',8,26);x.fillText('R',8,52);x.fillStyle=live?'#39d98a':'#f2b84b';x.fillText(live?'LIVE LEVELS · XTRATA ADAPTER':pb.adapter()?'SIMULATED LEVEL METER':'SIMULATED LEVELS · DEMO TIMER',8,84);V.vuTex.needsUpdate=true;}
  drawVU();vuL=.02;V.vuTex.userData.redraw=()=>{vuL=Math.max(vuL,.02);drawVU();};V.labelTex.userData.redraw=()=>{if(B.rel)drawLabel(B.rel,B.rel.tracks[Math.max(0,B.labelIdx)],B.rpm);};
  // ---- contextual panel ----
  function panel(){if(app.state.mode!=='vinyl')return;const p=B.phase,a=B.arm,carrying=app.carry&&app.carry.kind==='vinyl';
    const steps={empty:[0,carrying?'Click the sleeve pad to place your sleeve.':'Bring a sleeve from the crates (E to pick up).'],ready:[1,'Click the glowing pad “01 · SLEEVE” to place the sleeve.'],docking:[1,'Placing the sleeve…'],sleeved:[2,'Click the sleeve to slide the record onto “02 · RECORD REST”.'],extracting:[2,'Sliding the record out…'],
      loose:[3,B.g?'Carry the record over the platter — release when the ring turns green.':'Hold the record with the mouse, lift it and drop it on the platter.'],placing:[3,'Seating the record…'],resleeving:[3,'Sliding the record back into its sleeve…'],
      parked:[4,a.state==='held'?'Swing the arm over the grooves and release — gravity lowers the stylus.':a.state==='down'?(playing()?'Playing — grab the headshell to re-cue, or adjust pitch.':'Stylus is down — press Start·Stop to spin.'):a.state==='raised'?'Arm raised — release it with the cue lever (C) or grab the headshell.':B.motor.on?'Platter spinning — grab the headshell, swing it over the record and let go.':'Press Start·Stop, then grab the headshell and lower it onto the record.']}[p];
    const b=[];if(p==='ready')b.push(['place','Place sleeve on pad','gold']);if(p==='sleeved')b.push(['extract','Slide record out','gold'],['pickup','Pick sleeve back up']);
    if(p==='loose')b.push(['spindle','Place on spindle','gold'],['resleeve','Resleeve record']);
    if(p==='parked'){b.push(['start',B.motor.on?'Stop platter':'Start platter','gold'],['cue',a.state==='down'?'Cue up':'Cue down'],['33','33⅓'+(B.rpm===33?' ●':'')],['45','45'+(B.rpm===45?' ●':'')],['park','Park arm'],['lift','Lift record to rest']);}
    if(['sleeved','loose','parked'].includes(p))b.push(['return','Return record to crate (R)']);if(carrying)b.push(['retcarry','Return sleeve to crate']);b.push(['back','Step back (Esc)']);
    const pb=app.playback.s;
    app.ui.station(`<h3>Turntable ${steps[0]?`<span class="step">Step ${steps[0]}/4</span>`:''}</h3><p>${esc(steps[1])}</p>${B.rel?`<p class="dim small">${esc(B.rel.title)} · ${B.rel.vinyl}-inch · ${B.rpm===45?'45':'33⅓'} rpm · pitch ${(B.pitch*100>=0?'+':'')+(B.pitch*100).toFixed(1)}%${p==='parked'?' · side '+fmt(B.side)+' / '+fmt(B.rel.seconds):''}</p>`:''}
${p==='parked'?`<div class="trksel">${B.rel.tracks.map((t,i)=>`<button data-s="trk${i}" class="${pb.source==='vinyl'&&pb.idx===i&&a.state==='down'?'on':''}" aria-label="Cue track ${t.n}: ${esc(t.title)}">${t.n}</button>`).join('')}</div><label class="pitch">Pitch <input type="range" min="-8" max="8" step="0.1" value="${(B.pitch*100).toFixed(1)}" data-pitch aria-label="Pitch percent"></label>`:''}
<div class="btns">${b.map(([k,t,c])=>`<button data-s="${k}" class="${c||''}">${t}</button>`).join('')}</div>`,
      act=>{if(act==='back')app.exitFocus();else if(act==='place')V.placeSleeve();else if(act==='extract')V.extract();else if(act==='pickup')V.pickUpSleeve();else if(act==='spindle')V.placeOnSpindle();else if(act==='resleeve')V.resleeve();
        else if(act==='start')V.motorToggle();else if(act==='cue'){if(B.arm.state==='rest')V.cueTo(B.side||0);else V.cueLever();}else if(act==='33')V.setRpm(33);else if(act==='45')V.setRpm(45);else if(act==='park')park();else if(act==='lift')V.liftToRest();
        else if(act==='return')V.returnAll();else if(act==='retcarry')V.returnCarried();else if(act.startsWith('trk'))V.transport('track',+act.slice(3));},
      v=>V.setPitch(v/100));}
  V.panel=panel;app.on('carry',()=>{if(app.state.mode==='vinyl'){if(B.phase==='empty'&&app.carry&&app.carry.kind==='vinyl'){drawPlaceholder(app.carry.rel);setPhase('ready');}else panel();}});
  app.on('playback',()=>{if(app.state.mode==='vinyl'&&!B.g)panel();});
  app.on('art',()=>{V.labelTex.userData.redraw();phTex.userData.redraw();});
  app.on('vinyl',()=>{const c=app.chain;if(B.rel&&B.phase==='sleeved'&&c&&c.prefetch)c.prefetch(B.rel.tracks[0].id);}); // start fetching side A while the record is being handled
  // ---- QA helpers ----
  const proj=(v)=>{const p=v.clone();root.localToWorld(p);p.project(app.camera);return {x:(p.x+1)/2*innerWidth,y:(1-p.y)/2*innerHeight};};
  V.project=name=>{root.updateMatrixWorld(true);app.camera.updateMatrixWorld(true);const w=new THREE.Vector3();
    if(name==='pad')return proj(new THREE.Vector3(SLEEVE.x,PAD_TOP,SLEEVE.z));if(name==='rest')return proj(new THREE.Vector3(REST.x,PAD_TOP,REST.z));if(name==='spindle')return proj(new THREE.Vector3(SPIN.x,.1,SPIN.z));
    if(name==='sleeve')return proj(new THREE.Vector3(SLEEVE.x-.05,.027,SLEEVE.z+.05));
    if(name==='disc'){B.rec.group.getWorldPosition(w);root.worldToLocal(w);w.x-=B.rec.radius*.6;w.y+=.002;return proj(w);}
    if(name==='headshell'){head.getWorldPosition(w);root.worldToLocal(w);w.y+=.002;return proj(w);}
    const o={start:startBtn,b33,b45,power,pitch:pKnob,cue:cueLever}[name];o.getWorldPosition(w);root.worldToLocal(w);w.y+=.006;return proj(w);};
  V.projectLocal=(x,y,z)=>proj(new THREE.Vector3(x,y,z));
  V.qa=()=>{root.updateMatrixWorld(true);const tipW=pitchG.localToWorld(TIP.clone()),tipL=root.worldToLocal(tipW.clone()),rp=new THREE.Vector3();if(B.rec){B.rec.group.getWorldPosition(rp);root.worldToLocal(rp);}
    const G=grooves();return {phase:B.phase,rel:B.rel?B.rel.id:null,size:B.rec?B.rec.size:null,onPlatter:B.onPlatter,rec:B.rec?{x:rp.x,y:rp.y,z:rp.z,r:B.rec.radius,visible:B.rec.group.visible}:null,
      sleeve:B.sleeve?{x:B.sleeve.group.position.x,y:B.sleeve.group.position.y,z:B.sleeve.group.position.z,half:B.sleeve.dim.s/2}:null,
      arm:{state:B.arm.state,yaw:B.arm.yaw,phi:B.arm.phi,vel:B.arm.vel},tip:{x:tipL.x,y:tipL.y,z:tipL.z},tipAnalytic:tipAt(B.arm.yaw,B.arm.phi),surfaceY:surfY(),tipRadius:Math.hypot(tipL.x-SPIN.x,tipL.z-SPIN.z),groove:G,
      motor:{on:B.motor.on,speed:B.motor.speed,power:B.motor.power,target:rpmVal()*2*Math.PI/60*(1+B.pitch)},rpm:B.rpm,pitch:B.pitch,side:B.side,gesture:B.g?B.g.type:null,engaged:B.g?!!B.g.engaged:false,ring:{visible:ring.visible,green:ringM.color.getHex()===0x42e87a},
      placeholder:{visible:ph.visible,opacity:phMat.opacity},cue:B.cue,deck:DECK,restClear:B.rec?{toDeck:DECK.x0-(REST.x+B.rec.radius),toSleeve:(REST.x-B.rec.radius)-(SLEEVE.x+JK[B.rec.size].s/2)}:null};};
  setPhase('empty');
  return V;
}
