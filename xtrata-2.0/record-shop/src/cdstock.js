import * as THREE from 'three';
import {rng,hash,seg,easeIO,easeOut,angDiff,clamp,typeName} from './util.js';

export const CD={S:1.36,W:.142*1.36,H:.125*1.36,TA:.0104*1.36,TS:.0076*1.36,GAP:.0034,LIFT:.043,DRAW:.414,HOVER:.28};
export const thick=rel=>rel.type==='single'?CD.TS:CD.TA;

// Pure pose for a stock case at extraction progress p (lift → slide → swivel, never rotating inside the shelf).
export function stockPose(slot,p,faceYaw,out={}){
  const lift=CD.LIFT*easeOut(seg(p,0,.13)),slide=CD.DRAW*easeIO(seg(p,.13,.68)),sw=easeIO(seg(p,.68,1));
  out.x=slot.pos.x+slot.normal.x*slide;out.y=slot.pos.y+lift;out.z=slot.pos.z+slot.normal.z*slide;
  out.rotY=slot.rotY+(faceYaw==null?0:angDiff(slot.rotY,faceYaw)*sw);return out;
}

export function initStock(app){
  const {scene,art,mats:M,box}=app,cat=app.catalog;
  const ST={slots:[],rows:[],primary:{},faceSlots:[],endcaps:[],active:null,hovering:new Set()};app.stock=ST;
  const g=new THREE.Group();scene.add(g);
  const regroup=g=>{g.clearGroups();g.addGroup(0,6,0);g.addGroup(6,6,1);g.addGroup(12,12,0);g.addGroup(24,6,2);g.addGroup(30,6,3);return g;};
  const geoA=regroup(new THREE.BoxGeometry(CD.W,CD.H,CD.TA)),geoS=regroup(new THREE.BoxGeometry(CD.W,CD.H,CD.TS));
  const edge=new THREE.MeshStandardMaterial({color:0x18181b,roughness:.35,metalness:.2});
  const matCache=new Map();
  ST.caseMats=rel=>{let m=matCache.get(rel.id);if(!m){const sp=new THREE.MeshStandardMaterial({map:art.spine(rel),roughness:.45}),cv=new THREE.MeshStandardMaterial({map:art.cover(rel).tex,roughness:.3});
    m=[edge,sp,cv,M.cream];matCache.set(rel.id,m);}return m;};
  ST.geo=rel=>rel.type==='single'?geoS:geoA;

  // ---------- wall unit ----------
  const SPX=-7.388,FCX=-7.36,FRONT=-7.325,PL=[.68,1.06,1.44,1.82];
  box(g,.04,2.35,6.3,M.dark,-7.93,1.175,-.58);
  for(const z of [-3.68,-.58,2.52])box(g,.62,2.35,.06,M.walnut,-7.635,1.175,z);
  box(g,.66,.06,6.3,M.walnut,-7.63,2.35,-.58);box(g,.62,.5,6.2,M.dark,-7.635,.25,-.58);box(g,.03,.012,6.2,M.brass,-7.32,.505,-.58);
  for(const y of PL){box(g,.6,.04,6.14,M.walnut,-7.625,y,-.58);box(g,.012,.016,6.14,M.brass,FRONT-.004,y+.026,-.58,{cast:false});}
  app.addCollider(-8,FRONT,-3.75,2.6);
  const bays=[{id:'S',name:'CD · SINGLES',filter:'cd-singles',z0:-3.63,z1:-.63,rels:cat.singles,nF:7},{id:'A',name:'CD · ALBUMS & EPs',filter:'cd-albums',z0:-.53,z1:2.47,rels:cat.albums,nF:6}];
  const basic=t=>new THREE.MeshBasicMaterial({map:t,toneMapped:false});
  function addSlot(s){s.hover=0;s.hoverT=0;s.out=false;s.id=s.fixture+'-'+ST.slots.length;ST.slots.push(s);return s;}
  for(const bay of bays){
    const hd=art.card(bay.name,'tap sign to browse this bay','#17120f','#f2b84b');
    box(g,2.2,.22,.03,M.black,-7.34,2.2,(bay.z0+bay.z1)/2,{cast:false}).rotation.y=Math.PI/2;
    const hp=app.plane(g,2.14,.18,basic(hd),-7.322,2.2,(bay.z0+bay.z1)/2,Math.PI/2);
    app.addPick(hp,{id:'sign:'+bay.filter,title:bay.name,sub:'Category sign',hint:'Click to browse this bay',reach:6,click:()=>app.ui.openFinder('',bay.filter)});
    const r=rng(hash('bay'+bay.id)),n=bay.rels.length,T=thick(bay.rels[0]),pitch=T+CD.GAP,FW=CD.W+.016;
    const blockW=(bay.z1-bay.z0-.02-bay.nF*FW)/bay.nF,per=Math.floor(blockW/pitch);
    let fi=0,ci=Math.floor(r()*n);const maxRun=Math.max(1,Math.floor(per*bay.nF*4/n)); // larger catalogues: shorter runs so every release keeps a physical copy
    for(let row=3;row>=0;row--){
      const y=PL[row]+.105,R={y0:PL[row]+.02,y1:PL[row]+.215,slots:[],lipTop:PL[row]+.034,ceilY:row<3?PL[row+1]-.02:2.17,front:FRONT};
      let z=bay.z1-.01; // viewer-left (+Z) to viewer-right (-Z)
      for(let b=0;b<bay.nF;b++){
        const rel=bay.rels[fi%n],s=addSlot({fixture:'wall',kind:'face',rel,row:R,pos:new THREE.Vector3(FCX,y,z-FW/2),rotY:Math.PI/2,normal:new THREE.Vector3(1,0,0),z0:z-FW,z1:z,primary:fi<n});
        if(fi<n)ST.primary[rel.id]=s;ST.faceSlots.push(s);R.slots.push(s);fi++;z-=FW;
        const pad=(blockW-per*pitch)/2;let zz=z-pad;
        for(let k=0;k<per;){const rel2=bay.rels[ci%n];ci++;const run=Math.min(maxRun,2+Math.floor(r()*4));
          for(let q=0;q<run&&k<per;q++,k++){R.slots.push(addSlot({fixture:'wall',kind:'spine',rel:rel2,row:R,pos:new THREE.Vector3(SPX-CD.W/2,y,zz-pitch/2),rotY:Math.PI,normal:new THREE.Vector3(1,0,0),z0:zz-pitch,z1:zz}));zz-=pitch;}}
        z-=blockW;
      }
      R.slots.sort((a,b)=>a.z0-b.z0);ST.rows.push(R);
      const pm=new THREE.Mesh(new THREE.PlaneGeometry(bay.z1-bay.z0,R.y1-R.y0),M.pick);pm.position.set(-7.372,(R.y0+R.y1)/2,(bay.z0+bay.z1)/2);pm.rotation.y=Math.PI/2;
      app.addPick(pm,{reach:3.3,resolve:(h,ray)=>slotTarget(wallSlot(R,h,ray))});
    }
  }
  // exact slot under the ray: test the face-out cover plane first, then the spine-face plane (no parallax error at oblique angles)
  function wallSlot(R,h,ray){const o=ray.origin,d=ray.direction;if(Math.abs(d.x)<1e-6)return findSlot(R,h.point.z);
    const zAt=x=>o.z+d.z*(x-o.x)/d.x,zf=zAt(FCX+CD.TA/2),sf=findSlot(R,zf);if(sf.kind==='face'&&zf>=sf.z0&&zf<=sf.z1)return sf;
    const ss=findSlot(R,zAt(SPX));if(ss===sf||ss.kind==='face')return ss;
    const a=R.slots.indexOf(sf),b=R.slots.indexOf(ss);for(let i=Math.min(a,b);i<=Math.max(a,b);i++)if(R.slots[i].kind==='face')return R.slots[i]; // ray enters the side of a protruding face-out
    return ss;}
  // ---------- feature island (double-sided, face-out duplicates) ----------
  const IX=-1.9,IZ=-.5,IL=2.4;
  box(g,.5,.2,IL+.1,M.dark,IX,.1,IZ);box(g,.16,1.5,IL,M.walnut,IX,.95,IZ);box(g,.26,.05,IL+.06,M.dark,IX,1.72,IZ);
  app.addCollider(IX-.3,IX+.3,IZ-IL/2-.55,IZ+IL/2+.55);app.addOccluder(.16,1.7,IL,IX,.85,IZ);
  const LEDGE=[.5,.86,1.22];
  for(const side of [1,-1]){
    const rels=side>0?cat.albums:cat.singles;let k=0;
    for(const ly of LEDGE){
      box(g,.12,.03,IL,M.walnut,IX+side*.14,ly-.015,IZ);box(g,.01,.014,IL,M.brass,IX+side*.196,ly+.005,IZ,{cast:false});
      const R={y0:ly,y1:ly+.2,slots:[],lipTop:ly+.012,ceilY:ly+.33,front:.2,island:side};const FW=CD.W+.035,n=Math.floor((IL-.04)/FW),pad=(IL-n*FW)/2;
      for(let i=0;i<n;i++){const rel=rels[k++%rels.length],zc=IZ-IL/2+pad+FW*(i+.5);
        R.slots.push(addSlot({fixture:'island',kind:'face',rel,row:R,pos:new THREE.Vector3(IX+side*(.08+.012+thick(rel)/2),ly+CD.H/2,zc),rotY:side>0?Math.PI/2:-Math.PI/2,normal:new THREE.Vector3(side,0,0),z0:zc-FW/2,z1:zc+FW/2}));}
      ST.rows.push(R);
      const pm=new THREE.Mesh(new THREE.PlaneGeometry(IL,.2),M.pick);pm.position.set(IX+side*.115,ly+.1,IZ);pm.rotation.y=side*Math.PI/2;
      app.addPick(pm,{reach:3.3,resolve:h=>slotTarget(findSlot(R,h.point.z))});
    }
    const tx=art.card(side>0?'FEATURED · ALBUMS & EPs':'FEATURED · SINGLES','XTRATA MUSIC — every release on CD and vinyl','#17120f','#f2b84b');
    app.plane(g,1.5,.2,basic(tx),IX+side*.082,1.58,IZ,side*Math.PI/2);
  }
  // rotating end-cap displays
  for(const dz of [-1,1]){
    const cz=IZ+dz*(IL/2+.3);app.cyl(g,.16,.2,.06,M.dark,IX,.03,cz);app.cyl(g,.025,.025,1.3,M.black,IX,.68,cz,12);
    const car=new THREE.Group();car.position.set(IX,1.2,cz);g.add(car);app.cyl(car,.1,.1,.02,M.brass,0,-.1,0);
    const E={group:car,slots:[],paused:false,speed:.35*dz};
    for(let i=0;i<4;i++){const rel=cat.releases[(i*5+(dz>0?2:11))%cat.releases.length];
      const m=new THREE.Mesh(ST.geo(rel),ST.caseMats(rel));const a=i*Math.PI/2;m.position.set(Math.sin(a)*.115,0,Math.cos(a)*.115);m.rotation.y=a;m.castShadow=true;car.add(m);
      const s=addSlot({fixture:'endcap',kind:'face',rel,mesh:m,cap:E,pos:new THREE.Vector3(),rotY:0,normal:new THREE.Vector3(),row:{lipTop:0,ceilY:9,front:.13,cap:true}});
      E.slots.push(s);app.addPick(m,{reach:3.3,resolve:()=>slotTarget(s)});}
    const tagT=art.panel(512,128,()=>{});const tm=basic(tagT);
    for(const ry of [0,Math.PI]){const p=app.plane(g,.42,.105,tm,IX,1.5,cz+(ry?-.012:.012),ry);}
    box(g,.44,.125,.02,M.black,IX,1.5,cz,{cast:false});E.tagTex=tagT;ST.endcaps.push(E);
  }
  for(const s of ST.slots)if(s.fixture==='wall'&&!ST.primary[s.rel.id])ST.primary[s.rel.id]=s; // releases beyond the face-out count: first spine copy is primary
  for(const r of cat.releases)if(!ST.primary[r.id])ST.unstocked=(ST.unstocked||0)+1;
  // ---------- instanced stock ----------
  const dummy=new THREE.Object3D(),byRel=new Map();
  for(const s of ST.slots)if(s.fixture!=='endcap'){if(!byRel.has(s.rel.id))byRel.set(s.rel.id,[]);byRel.get(s.rel.id).push(s);}
  for(const [id,list] of byRel){const rel=list[0].rel,im=new THREE.InstancedMesh(ST.geo(rel),ST.caseMats(rel),list.length);im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);im.castShadow=true;im.receiveShadow=true;im.frustumCulled=false;
    list.forEach((s,i)=>{s.mesh=im;s.inst=i;});g.add(im);}
  const P={};
  function place(s,p,hidden){
    if(s.fixture==='endcap'){s.mesh.visible=!hidden;return;}
    stockPose(s,p,null,P);dummy.position.set(P.x,P.y,P.z);dummy.rotation.set(0,P.rotY,0);dummy.scale.setScalar(hidden?0:1);dummy.updateMatrix();s.mesh.setMatrixAt(s.inst,dummy.matrix);s.mesh.instanceMatrix.needsUpdate=true;
  }
  for(const s of ST.slots)place(s,0,false);
  ST.place=place;
  ST.count={spines:ST.slots.filter(s=>s.kind==='spine').length,faces:ST.slots.filter(s=>s.kind==='face').length,rows:ST.rows.filter(r=>!r.island).length};

  function findSlot(R,z){const a=R.slots;let lo=0,hi=a.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(a[m].z0<=z)lo=m;else hi=m-1;}return a[lo];}
  ST.findSlot=findSlot;
  function slotTarget(s){
    if(s.out)return null;
    if(!s.target)s.target={id:'cd:'+s.id,slot:s,get title(){return s.rel.title;},get sub(){return (s.rel.artist||'—')+' · '+typeName(s.rel.type)+' CD · '+s.rel.tracks.length+' track'+(s.rel.tracks.length>1?'s':'');},
      hint:'Click or E — pull this case out',click:()=>ST.extract(s),e:()=>ST.extract(s),hover:on=>{if(s.fixture==='endcap')return;s.hoverT=on?CD.HOVER:0;ST.hovering.add(s);}};
    return s.target;
  }
  ST.slotTarget=slotTarget;
  function capPose(s){s.mesh.updateWorldMatrix(true,false);s.mesh.getWorldPosition(s.pos);const q=new THREE.Quaternion();s.mesh.getWorldQuaternion(q);const e=new THREE.Euler().setFromQuaternion(q,'YXZ');s.rotY=e.y;s.normal.set(Math.sin(e.y),0,Math.cos(e.y));}
  ST.faceYawFor=(s)=>{const end=stockPose(s,.68,null,{});return Math.atan2(app.camera.position.x-end.x,app.camera.position.z-end.z);};
  ST.extract=(s,opts={})=>{
    if(ST.active||app.inspector.item||s.out||app.state.mode!=='room')return false;
    if(s.fixture==='endcap'){s.cap.paused=true;capPose(s);}
    s.out=true;s.hoverT=0;ST.hovering.delete(s);place(s,0,true);
    const model=app.inspector.makeCase(s.rel,s);scene.add(model.group);
    ST.active={slot:s,model,p:s.hover,dir:1,faceYaw:ST.faceYawFor(s),opts};s.hover=0;
    app.setBusy('extract');app.foley('pull');poseModel();return true;
  };
  function poseModel(){const a=ST.active;stockPose(a.slot,a.p,a.faceYaw,P);a.model.group.position.set(P.x,P.y,P.z);a.model.group.rotation.set(0,P.rotY,0);}
  ST.cancelExtract=()=>{if(ST.active&&ST.active.dir>0){ST.active.dir=-1;return true;}return false;};
  // called by inspector when the case has been handed back into the room at pose p=1
  ST.beginReturn=(slot,model)=>{scene.add(model.group);ST.active={slot,model,p:1,dir:-1,faceYaw:ST.faceYawFor(slot),opts:{}};const e=new THREE.Euler().setFromQuaternion(model.group.quaternion,'YXZ');ST.active.faceYaw=e.y;app.setBusy('extract');poseModel();};
  ST.restore=slot=>{slot.out=false;place(slot,0,false);if(slot.cap)slot.cap.paused=false;};
  ST.hide=slot=>{slot.out=true;place(slot,0,true);if(slot.cap){slot.cap.paused=true;capPose(slot);}};
  ST.update=dt=>{
    for(const E of ST.endcaps)if(!E.paused)E.group.rotation.y+=E.speed*dt;
    for(const s of ST.hovering){if(s.out){ST.hovering.delete(s);continue;}const d=s.hoverT-s.hover;s.hover+=Math.sign(d)*Math.min(Math.abs(d),dt*1.9);place(s,s.hover,false);if(s.hover===0&&s.hoverT===0)ST.hovering.delete(s);}
    const a=ST.active;if(a){a.p=clamp(a.p+a.dir*dt/.82,0,1);poseModel();
      if(a.dir>0&&a.p>=1){ST.active=null;app.setBusy(null);app.inspector.open({kind:'cd',slot:a.slot,model:a.model,opts:a.opts});}
      else if(a.dir<0&&a.p<=0){ST.active=null;scene.remove(a.model.group);a.model.dispose();ST.restore(a.slot);app.setBusy(null);app.foley('click');app.emit('stock');}}
  };
  // numerical clearance evidence from actual transformed box corners
  ST.clearance=(s,camPos)=>{
    if(s.fixture==='endcap')capPose(s);
    const T=thick(s.rel),hw=CD.W/2,hh=CD.H/2,ht=T/2,r=s.row,end=stockPose(s,.68,null,{});
    const cp=camPos||app.camera.position,fy=Math.atan2(cp.x-end.x,cp.z-end.z);
    const along0=s.pos.x*s.normal.x+s.pos.z*s.normal.z; // front plane expressed along outward normal
    const frontAlong=s.fixture==='wall'?r.front*s.normal.x:s.fixture==='island'?(IX*s.normal.x+r.front):along0+r.front;
    let minSwivel=1e9,minLip=1e9,minCeil=1e9,rotInside=0,p0={};
    for(let i=0;i<=200;i++){const p=i/200;stockPose(s,p,fy,p0);const c=Math.cos(p0.rotY),sn=Math.sin(p0.rotY);let minAlong=1e9;
      for(const sx of [-1,1])for(const sz of [-1,1]){const lx=sx*hw,lz=sz*ht,wx=p0.x+lx*c+lz*sn,wz=p0.z-lx*sn+lz*c;minAlong=Math.min(minAlong,wx*s.normal.x+wz*s.normal.z);}
      const rotated=Math.abs(angDiff(s.rotY,p0.rotY))>1e-6;
      if(rotated)minSwivel=Math.min(minSwivel,minAlong-frontAlong);
      if(minAlong<frontAlong){if(rotated)rotInside++;if(p>.13){minLip=Math.min(minLip,p0.y-hh-r.lipTop);}minCeil=Math.min(minCeil,r.ceilY-(p0.y+hh));}
    }
    return {swivel:minSwivel,lip:minLip,ceil:minCeil,rotInside};
  };
  return ST;
}
