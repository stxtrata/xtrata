import * as THREE from 'three';
import {clamp,lerp,easeIO,esc,fmt,typeName,smooth} from './util.js';
import {stockPose} from './cdstock.js';

// Held-object inspection in a separate camera-relative foreground scene (own lights, depth-cleared pass).
export function initInspector(app){
  const fg=app.fgScene,cam=app.fgCam,art=app.art;
  fg.add(new THREE.AmbientLight(0xfff0dc,.85));const d1=new THREE.DirectionalLight(0xfff4e0,1.9);d1.position.set(.5,1,1.2);fg.add(d1);const d2=new THREE.DirectionalLight(0x9fc8ff,.5);d2.position.set(-1,.2,.6);fg.add(d2);
  const I={item:null,yaw:0,pitch:0,yawT:0,pitchT:0,flip:0,flipA:0,dist:.5,distT:.5,openT:0,t:0,phase:'idle',from:{p:new THREE.Vector3(),q:new THREE.Quaternion()},carry:null,bob:0};
  app.inspector=I;I.makeCase=(rel,slot)=>app.models.makeCase(rel,slot);
  const el=document.getElementById('insp'),ray=new THREE.Raycaster(),v2=new THREE.Vector2();
  const tq=new THREE.Quaternion(),tp=new THREE.Vector3(),eu=new THREE.Euler(0,0,0,'YXZ'),m4=new THREE.Matrix4();
  const portrait=()=>innerWidth<760||innerHeight>innerWidth*1.05;
  function stage(){const p=portrait(),pw=p?0:Math.min(380,innerWidth*.34),top=p?114:94,bot=p?innerHeight*.46:112,h=innerHeight-top-bot;return {cx:(innerWidth-pw)/2,cy:top+h/2,w:innerWidth-pw,h,top,narrow:innerWidth-pw<620};}
  I.stage=stage;
  function offset(dist){const s=stage(),k=2*dist*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))/innerHeight;return {x:(s.cx-innerWidth/2)*k+(I.item&&I.item.kind==='cd'?I.item.model.W*(I.view==='book'?1:I.view==='disc'?0:.5)*smooth(I.item.model.open):0),y:-(s.cy-innerHeight/2)*k};}
  function minDist(it){const s=stage(),t=2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))/innerHeight,cd=it.kind==='cd',w=cd?it.model.W*(1+(I.view==='both'?smooth(it.model.open):0)):it.model.dim.s,h=cd?it.model.H:it.model.dim.s;return Math.max((w/2)/(Math.max(60,s.w/2-(s.narrow?14:64))*t),(h/2)/(Math.max(60,s.h/2-58)*t));} // leaves room for the action chips around the item
  function toCamSpace(obj){ // world transform -> camera-relative transform
    obj.updateMatrixWorld(true);m4.copy(app.camera.matrixWorldInverse).multiply(obj.matrixWorld);m4.decompose(I.from.p,I.from.q,new THREE.Vector3());}
  function camSpaceOf(pos,quat){app.camera.updateMatrixWorld(true);const qi=app.camera.quaternion.clone().invert();return {p:pos.clone().applyMatrix4(app.camera.matrixWorldInverse),q:qi.multiply(quat)};}
  I.open=({kind,slot,model,opts={},from})=>{
    app.camera.updateMatrixWorld(true);app.camera.matrixWorldInverse.copy(app.camera.matrixWorld).invert();
    toCamSpace(model.group);if(model.group.parent)model.group.parent.remove(model.group);fg.add(model.group);model.group.position.copy(I.from.p);model.group.quaternion.copy(I.from.q);
    I.item={kind,slot,model,rel:model.rel,opts,pending:opts.playIdx};I.phase='enter';I.t=0;I.view='both';I.peekT=0;I.yaw=I.pitch=I.yawT=I.pitchT=0;I.flip=0;I.flipA=0;I.openT=opts.autoOpen||opts.playIdx!=null?1:0;I.peek=0;
    I.item.fit=(kind==='cd'?model.H:model.dim.s)/(.6*stage().h*2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))/innerHeight);I.dist=I.distT=I.item.fit;
    if(kind==='cd'){model.setDisc(!(app.cd.state!=='none'&&app.cd.slot===slot));syncBooklet();}
    app.setMode('inspect');render();app.emit('inspect');
  };
  function syncBooklet(){const it=I.item;if(!it||it.kind!=='cd')return;const pb=app.playback.s;const on=pb.source==='cd-case'&&pb.rel===it.rel;it.model.drawBooklet(on?pb.idx:-1,on&&pb.playing);}
  app.on('playback',()=>{syncBooklet();if(I.item)render();});app.on('art',()=>{syncBooklet();if(I.item)render();});
  app.on('inspect',()=>{const it=I.item,c=app.chain;if(it&&it.kind==='cd'&&c&&c.cueDisc)c.cueDisc(it.rel);});app.on('cue',()=>{if(I.item)render();});app.on('crate',()=>{if(I.item)render();});
  I.close=(then)=>{const it=I.item;if(!it||I.phase==='exit')return;I.phase='exit';I.t=0;I.then=then;I.openT=0;
    I.from.p.copy(it.model.group.position);I.from.q.copy(it.model.group.quaternion);
    if(it.kind==='cd'){const s=it.slot,P=stockPose(s,1,app.stock.faceYawFor(s),{});const c=camSpaceOf(new THREE.Vector3(P.x,P.y,P.z),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,P.rotY,0)));I.to=c;I.toWorld=P;}
    else{const w=app.vinyl.jacketWorldPose(it.slot);I.to=camSpaceOf(w.p,w.q);}
  };
  // ---------- on-item action chips: fixed just outside the item's resting outline, own dark backing so they read on any artwork ----------
  const chipsEl=document.getElementById('chips'),SVG=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const IC={flip:'<path d="M4 12a8 8 0 0 1 13.7-5.6L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15"/><path d="M4 20v-5h5"/>',ret:'<path d="M12 3v10"/><path d="M8 9l4 4 4-4"/><path d="M4 13v6h16v-6"/>',
    walk:'<circle cx="13" cy="4.5" r="1.8"/><path d="M13 8l-3 3 1 4-3 5"/><path d="M11 15l4 2 1 4"/><path d="M13 8l3 3 3 1"/><path d="M10 11l-3 1"/>',disc:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/>',
    add:'<path d="M4 9h16l-1.5 10h-13z"/><path d="M12 12v4M10 14h4"/>',added:'<path d="M4 9h16l-1.5 10h-13z"/><path d="M9.5 14l2 2 3.5-4"/>',book:'<path d="M12 6v13"/><path d="M12 6c-2-1.5-5-1.5-8 0v13c3-1.5 6-1.5 8 0 2-1.5 5-1.5 8 0V6c-3-1.5-6-1.5-8 0z"/>',
    peek:'<rect x="3" y="5" width="12" height="14" rx="1"/><path d="M15 7a6 6 0 0 1 0 10"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>'};
  const chip={};for(const n of ['flip','ret','crate','main','carry','prev','next']){const b=document.createElement('button');b.dataset.c=n;chipsEl.appendChild(b);chip[n]={el:b,key:'',tf:''};}
  function setChip(n,icon,label,title,cls=''){const c=chip[n],key=icon+'|'+label+'|'+cls;if(c.key===key)return;c.key=key;c.w=0;c.el.className=cls+(label?'':' ico');c.el.innerHTML=SVG(IC[icon])+(label?`<span>${label}</span>`:'');c.el.title=title;c.el.setAttribute('aria-label',title);}
  function chipText(){const it=I.item;if(!it)return;const cd=it.kind==='cd',inC=app.shop.inCrate(it.rel,it.kind),mineCarry=cd&&app.carry&&app.carry.kind==='cd'&&app.carry.slot===it.slot,out=cd&&app.cd.state!=='none'&&app.cd.slot===it.slot;
    setChip('flip','flip','Flip','Flip front / back (F)');setChip('ret','ret',cd?'Back to shelf':'Back to crate','Return it to its exact '+(cd?'shelf slot':'crate slot')+' (Esc)');
    setChip('crate',inC?'added':'add',inC?'In Crate List':'Crate List',(inC?'Remove from':'Add to')+' your Crate List (C)');
    if(cd){setChip('main','book',I.openT?'Close':'Open',(I.openT?'Close':'Open')+' the case (O)');setChip('carry','disc',mineCarry?'Put disc back':out?'Disc is out':'Take disc',mineCarry?'Put the disc back in this case (T)':out?'This disc is at the CD listening booth':'Take the disc out and carry it to the CD Player (T)','gold');}
    else{setChip('main','peek',I.peekT?'Tuck in':'Peek',(I.peekT?'Slide the record back in':'Peek at the vinyl')+' (O)');setChip('carry','walk','Carry','Walk away holding this sleeve — take it to the Turntable (E)','gold');}
    setChip('prev','prev','','Previous '+(cd?'case':'sleeve')+' (←)');setChip('next','next','','Next '+(cd?'case':'sleeve')+' (→)');}
  function put(n,x,y,ax,ay){const c=chip[n],tf=`translate(${Math.round(x)}px,${Math.round(y)}px) translate(${-ax*100}%,${-ay*100}%)`;if(c.tf!==tf){c.tf=tf;c.el.style.transform=tf;}}
  function layoutChips(){const it=I.item,show=!!it&&I.phase==='hold';if(chipsEl.hidden===show)chipsEl.hidden=!show;if(!show)return;
    const s=stage(),k=I.dist*2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))/innerHeight;let L,Rt,hh;
    if(it.kind==='cd'){const m=it.model,o=smooth(m.open),sh=m.W*(I.view==='book'?1:I.view==='disc'?0:.5)*o;L=(sh-m.W/2-m.W*o)/k;Rt=(sh+m.W/2)/k;hh=m.H/2/k;}
    else{const j=it.model.dim,pk=I.peek||0;L=-j.s/2/k;Rt=Math.max(j.s/2,pk>.03?pk*j.s*.6+it.model.rec.radius:0)/k;hh=j.s/2/k;}
    const lo=s.cx-s.w/2+8,hi=s.cx+s.w/2-8,ex=s.narrow?0:46,xa=Math.max(s.cx+L,lo+ex),xb=Math.min(s.cx+Rt,hi-ex),ya=Math.max(s.cy-hh-12,s.top+40),yb=Math.min(s.cy+hh+12,s.top+s.h-40);
    const W=n=>chip[n].w||(chip[n].w=chip[n].el.offsetWidth),G=8;
    // a row: first chip on the left corner, last on the right corner, the rest centred in the free gap; the row widens past the corners only if it must
    const row=(names,y,ay)=>{let a=xa,b=xb;const need=names.reduce((t,n)=>t+W(n),0)+G*(names.length-1);if(need>b-a){const e=(need-(b-a))/2;a-=e;b+=e;if(a<lo){b+=lo-a;a=lo;}if(b>hi){a=Math.max(lo,a-(b-hi));b=hi;}}
      const f=names[0],l=names[names.length-1],mid=names.slice(1,-1);put(f,a,y,0,ay);put(l,b,y,1,ay);if(!mid.length)return;
      const mw=mid.reduce((t,n)=>t+W(n),0)+G*(mid.length-1);let x=(a+W(f)+b-W(l))/2-mw/2;for(const n of mid){put(n,x,y,0,ay);x+=W(n)+G;}};
    if(s.narrow)row(['flip','prev','next','ret'],ya,1);else{row(['flip','ret'],ya,1);put('prev',Math.max(lo,xa-12-W('prev')),s.cy,0,.5);put('next',Math.min(hi,xb+12+W('next')),s.cy,1,.5);}
    row(['crate','main','carry'],yb,0);}
  chipsEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!I.item||I.phase!=='hold')return;app.audioInit();const n=b.dataset.c,cd=I.item.kind==='cd';
    if(n==='flip')I.flipCase();else if(n==='ret')I.close();else if(n==='crate')app.shop.toggleCrate(I.item.rel,I.item.kind);else if(n==='main'){cd?I.toggleOpen():I.togglePeek();render();}
    else if(n==='carry'){cd?I.takeDisc():I.pickUp();}else if(n==='prev')I.step(-1);else if(n==='next')I.step(1);b.blur();});
  I.chipRects=()=>chipsEl.hidden?null:Object.fromEntries(Object.entries(chip).map(([n,c])=>{const r=c.el.getBoundingClientRect();return [n,[r.left,r.top,r.right,r.bottom,c.el.innerText.trim()]];}));
  function finishExit(){const it=I.item,then=I.then;I.item=null;I.phase='idle';el.hidden=true;fg.remove(it.model.group);
    if(it.kind==='cd'){const P=I.toWorld;it.model.group.position.set(P.x,P.y,P.z);it.model.group.rotation.set(0,P.rotY,0);it.model.setOpen(0);app.setMode('room');app.stock.beginReturn(it.slot,it.model);}
    else{it.model.dispose();app.setMode('room');if(then==='carry')app.vinyl.pickUp(it.slot);else app.vinyl.showJacket(it.slot,true);}
    app.emit('inspect');
  }
  I.flipCase=()=>{if(!I.item)return;if(I.item.kind==='cd'&&I.openT>0)I.openT=0;I.flip^=1;app.foley('click');render();};
  I.setView=v=>{I.view=v;render();};
  I.toggleOpen=(v)=>{const it=I.item;if(!it||it.kind!=='cd')return;I.view='both';I.openT=v==null?(I.openT?0:1):(v?1:0);if(I.openT)I.flip=0;app.foley('click');render();};
  I.step=dir=>{const it=I.item;if(!it||I.phase!=='hold')return;
    if(it.kind==='cd'){const list=it.slot.cap?it.slot.cap.slots:it.slot.row.slots;let i=list.indexOf(it.slot);for(let k=0;k<list.length;k++){i=(i+dir+list.length)%list.length;if(!list[i].out)break;}const ns=list[i];if(ns===it.slot||ns.out)return;
      app.stock.restore(it.slot);app.stock.hide(ns);const pos=it.model.group.position.clone(),q=it.model.group.quaternion.clone();fg.remove(it.model.group);it.model.dispose();
      const m=I.makeCase(ns.rel,ns);fg.add(m.group);m.group.position.copy(pos);m.group.quaternion.copy(q);I.item={kind:'cd',slot:ns,model:m,rel:ns.rel,opts:{},fit:it.fit};I.openT=0;I.flip=0;I.yaw+=dir*.9;m.setDisc(!(app.cd.state!=='none'&&app.cd.slot===ns));syncBooklet();}
    else{const ns=app.vinyl.neighbour(it.slot,dir);if(!ns)return;app.vinyl.showJacket(it.slot,true);app.vinyl.showJacket(ns,false);const pos=it.model.group.position.clone(),q=it.model.group.quaternion.clone();fg.remove(it.model.group);it.model.dispose();
      const m=app.models.makeJacket(ns.rel,true);fg.add(m.group);m.group.position.copy(pos);m.group.quaternion.copy(q);I.item={kind:'vinyl',slot:ns,model:m,rel:ns.rel,opts:{},fit:it.fit};I.flip=0;I.peek=0;I.peekT=0;I.yaw+=dir*.9;}
    app.foley('slide');render();app.emit('inspect');};
  I.playTile=i=>{const it=I.item;if(!it||it.kind!=='cd')return false;
    if(app.cd.state!=='none'&&app.cd.slot===it.slot){app.toast('This disc is out of its case — it is '+(app.cd.state==='carried'?'in your hand':'at the CD listening booth')+'.');return false;}
    const pb=app.playback;if(pb.s.source==='cd-case'&&pb.s.rel===it.rel&&pb.s.idx===i)pb.toggle();else pb.play(it.rel,i,'cd-case',0);return true;};
  I.toggleCurrent=()=>{const it=I.item;if(!it||it.kind!=='cd')return;const pb=app.playback.s;I.playTile(pb.source==='cd-case'&&pb.rel===it.rel?pb.idx:0);};
  I.takeDisc=()=>{const it=I.item;if(!it||it.kind!=='cd')return false;
    if(app.carry&&app.carry.kind==='cd'&&app.carry.slot===it.slot){app.cd={state:'none'};app.setCarry(null);it.model.setDisc(true);app.toast('Disc back in its case.');app.foley('click');render();return true;}
    if(app.carry){app.toast('Your hands are full — return the '+(app.carry.kind==='cd'?'CD':'record')+' you are carrying first.');return false;}
    if(app.cd.state!=='none'){app.toast('Another disc is already out ('+app.cd.rel.title+'). Return it to its case first.');return false;}
    if(I.openT<1||it.model.open<.9){I.toggleOpen(true);app.toast('Case opened — take the disc again.');return false;}
    if(app.playback.s.source==='cd-case'&&app.playback.s.rel===it.rel)app.playback.stop();
    app.cd={state:'carried',rel:it.rel,slot:it.slot};it.model.setDisc(false);app.setCarry({kind:'cd',rel:it.rel,slot:it.slot});app.foley('pull');app.toast('Disc in hand — carry it to the CD Player and press Eject.');render();return true;};
  I.pickUp=()=>{if(I.item&&I.item.kind==='vinyl'){if(app.carry||app.vinyl.busyWith()){app.toast(app.carry?'Your hands are full.':'Another record is on the listening bench — return it first.');return;}I.close('carry');}};
  I.togglePeek=()=>{I.peekT=I.peekT?0:1;app.foley('slide');};
  // ---------- per-frame ----------
  I.update=dt=>{
    cam.aspect=app.camera.aspect;cam.fov=app.camera.fov;cam.updateProjectionMatrix();
    const it=I.item;
    if(it){const g=it.model.group;
      I.dist=lerp(I.dist,Math.max(I.distT,minDist(it)),1-Math.exp(-dt*10));
      if(it.kind==='cd'){const o=it.model.open,n=clamp(o+Math.sign(I.openT-o)*dt/.55,0,1);if(n!==o){it.model.setOpen(I.openT>o?Math.min(n,I.openT):Math.max(n,I.openT));if(it.model.open===1&&it.pending!=null){const p=it.pending;it.pending=null;I.playTile(p);}}
        if(it.model.disc.visible&&app.playback.s.playing&&app.playback.s.source==='cd-case'&&app.playback.s.rel===it.rel)it.model.disc.rotation.z-=dt*5;}
      else{I.peek=lerp(I.peek||0,I.peekT||0,1-Math.exp(-dt*8));it.model.setPeek(I.peek);}
      const steady=it.kind==='cd'&&I.openT>0;
      I.flipA=lerp(I.flipA,I.flip*Math.PI,1-Math.exp(-dt*9));
      const k=1-Math.exp(-dt*(steady?5:9));I.yaw=lerp(I.yaw,steady?I.panYaw||0:I.yawT,k);I.pitch=lerp(I.pitch,steady?I.panPitch||0:I.pitchT,k);
      const off=offset(I.dist);tp.set(off.x,off.y,-I.dist);eu.set(I.pitch,I.yaw+I.flipA,0);tq.setFromEuler(eu);
      if(I.phase==='enter'){I.t=Math.min(1,I.t+dt/.42);const e=easeIO(I.t);g.position.lerpVectors(I.from.p,tp,e);g.quaternion.slerpQuaternions(I.from.q,tq,e);if(I.t>=1)I.phase='hold';}
      else if(I.phase==='exit'){I.t=Math.min(1,I.t+dt/.36);const e=easeIO(I.t);g.position.lerpVectors(I.from.p,I.to.p,e);g.quaternion.slerpQuaternions(I.from.q,I.to.q,e);if(I.t>=1&&(it.kind!=='cd'||it.model.open<=0))finishExit();}
      else{g.position.copy(tp);g.quaternion.copy(tq);}
    }
    layoutChips();
    // carried item in hand
    const c=I.carry;if(c){const mv=app.player.moving?1:0;I.bob+=dt*9*mv;const a=Math.min(1,cam.aspect/1.5),foc=app.state.mode!=='room';
      const tx=(foc?.5:.36)*a,ty=(foc?-.3:-.25)+Math.sin(I.bob)*.008,tz=foc?-1.05:-.72;c.t=Math.min(1,c.t+dt/.35);const e=easeIO(c.t);
      tp.set(tx,ty,tz);c.group.position.lerp(tp,1-Math.exp(-dt*10));c.group.rotation.set(c.kind==='cd'?-.9:-.25,-.5,c.kind==='cd'?.2:.08);c.group.scale.setScalar(e);c.group.visible=!(I.item&&I.phase!=='idle')||true;}
  };
  I.setCarry=carry=>{
    if(I.carry){fg.remove(I.carry.group);I.carry.dispose();I.carry=null;}
    if(!carry)return;
    if(carry.kind==='cd'){const geo=new THREE.RingGeometry(.0102,.0816,48),mat=new THREE.MeshStandardMaterial({map:art.disc(carry.rel),roughness:.22,metalness:.55,side:THREE.DoubleSide});const g=new THREE.Group();g.add(new THREE.Mesh(geo,mat));
      I.carry={kind:'cd',group:g,t:0,dispose(){geo.dispose();mat.dispose();}};}
    else{const j=app.models.makeJacket(carry.rel,false);I.carry={kind:'vinyl',group:j.group,t:0,dispose(){j.dispose();}};}
    I.carry.group.position.set(.4,-.6,-.7);fg.add(I.carry.group);
  };
  I.carryWorld=()=>{ // world pose of the carried model (for hand-offs into the room)
    const c=I.carry;if(!c)return null;app.camera.updateMatrixWorld(true);return {p:c.group.position.clone().applyMatrix4(app.camera.matrixWorld),q:app.camera.quaternion.clone().multiply(c.group.quaternion)};};
  // ---------- pointer input (free cursor) ----------
  let down=null;
  I.pointerMove=e=>{const it=I.item;if(!it)return;const s=stage(),nx=clamp((e.clientX-s.cx)/(s.w/2),-1.2,1.2),ny=clamp((e.clientY-s.cy)/(s.h/2),-1.2,1.2);
    if(down&&(e.buttons&1||e.pointerType==='touch')){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>6)down.drag=true;
      if(down.drag){if(it.kind==='cd'&&I.openT>0){I.panYaw=clamp(down.py+dx*.004,-.6,.6);I.panPitch=clamp(down.pp+dy*.004,-.5,.5);}else if(e.pointerType==='touch'){I.yawT=clamp(down.py+dx*.008,-1.3,1.3);I.pitchT=clamp(down.pp+dy*.006,-.7,.7);}}}
    else if(e.pointerType!=='touch'){I.yawT=nx*.95;I.pitchT=ny*.5;}};
  I.pointerDown=e=>{down={x:e.clientX,y:e.clientY,drag:false,py:I.openT>0?(I.panYaw||0):I.yawT,pp:I.openT>0?(I.panPitch||0):I.pitchT};};
  I.pick=(cx,cy)=>{const it=I.item;if(!it)return null;v2.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);cam.updateMatrixWorld(true);it.model.group.updateMatrixWorld(true);ray.setFromCamera(v2,cam);
    const hits=ray.intersectObjects(it.model.picks.filter(o=>o.visible),false);
    // skip the transparent lid plastic when something printed lies directly behind it
    for(const h of hits){const part=h.object.userData.part;if(part==='lid')continue;return {part:part||'body',uv:h.uv,hit:h,faceFront:h.face?h.face.normal.clone().transformDirection(h.object.matrixWorld).z>0:true,mi:h.face?h.face.materialIndex:0};}
    return hits.length?{part:'lid'}:null;};
  I.pointerUp=e=>{const d=down;down=null;if(!I.item||I.phase!=='hold'||(d&&d.drag))return;I.click(e.clientX,e.clientY);};
  I.click=(cx,cy)=>{const it=I.item,h=I.pick(cx,cy);
    if(it.kind==='vinyl'){if(h){if(h.mi===5&&!I.flip||h.mi===4&&I.flip){}I.togglePeek();}return h;}
    const open=it.model.open>.9;
    if(open){
      if(h&&h.part==='booklet'){const i=it.model.tileAt(h.uv);if(i>=0){I.playTile(i);return {part:'tile',i};}I.toggleOpen(false);return {part:'close'};}
      if(h&&(h.part==='disc'||h.part==='hub')){if(h.part==='disc'||it.model.disc.visible)I.toggleCurrent();else app.toast('The tray is empty — this disc is out.');return h;}
      I.toggleOpen(false);return {part:'close'};
    }
    if(it.model.open>.05)return null;
    if(h&&h.part==='front'){I.toggleOpen(true);return h;}
    if(h&&h.part==='rear'){I.flipCase();return h;}
    return h;};
  I.wheel=dy=>{const it=I.item;if(!it)return;const f=it.fit||.5;I.distT=clamp(Math.max(I.distT,minDist(it))*(1+Math.sign(dy)*.09),f*.55,f*2.6);};
  I.key=e=>{const k=e.key.toLowerCase();if(!I.item||I.phase!=='hold')return false;
    if(k==='escape'){if(I.item.kind==='cd'&&I.openT>0)I.toggleOpen(false);else I.close();return true;}
    if(I.item.kind==='vinyl'&&(k==='w'||k==='s'||k==='arrowup'||k==='arrowdown')){I.pickUp();return true;} // start walking = carry it
    if(k==='f'){I.flipCase();return true;}if(k==='o'||k==='enter'){if(I.item.kind==='cd')I.toggleOpen();else I.togglePeek();return true;}
    if(k==='arrowleft'||k==='a'){I.step(-1);return true;}if(k==='arrowright'||k==='d'){I.step(1);return true;}
    if(k===' '){if(I.item.kind==='cd')I.toggleCurrent();return true;}
    if(k==='t'||k==='e'){if(I.item.kind==='cd')I.takeDisc();else I.pickUp();return true;}
    if(k==='c'){app.shop.toggleCrate(I.item.rel,I.item.kind);return true;}
    if(k==='r'||k==='backspace'){I.close();return true;}
    if(k==='+'||k==='='){I.wheel(-1);return true;}if(k==='-'){I.wheel(1);return true;}
    if(/^[1-9]$/.test(k)&&I.item.kind==='cd'&&I.item.model.open>.9){const i=+k-1;if(i<I.item.rel.tracks.length)I.playTile(i);return true;}
    return false;};
  // ---------- panel ----------
  function render(){const it=I.item;if(!it){el.hidden=true;return;}chipText();const r=it.rel,pb=app.playback.s,cd=it.kind==='cd';
    const mine=cd&&pb.source==='cd-case'&&pb.rel===r,out=cd&&app.cd.state!=='none'&&app.cd.slot===it.slot,inCrate=app.shop.inCrate(r,it.kind);
    const fmtName=cd?'CD':r.vinyl+'-inch vinyl'+(r.vinyl===7?' · 45 rpm':' · 33⅓ rpm');
    el.hidden=false;el.innerHTML=`<header><img alt="" src="${art.thumb(art.cover(r))}"><div><h2>${esc(r.title)}</h2><p>${esc(r.artist||'—')}</p><p class="dim">${typeName(r.type)} · ${fmtName} · ${r.tracks.length} track${r.tracks.length>1?'s':''} · ${fmt(r.seconds)}</p></div></header>
<p class="meta">${esc(r.id)} · trust: ${esc(r.trust)}${r.from?' · from “'+esc(r.from)+'”':''}${r.flags.length?' · flags: '+esc(r.flags.join(', ')):''}${art.cover(r).fallback?' · <em>artwork fallback</em>':''}</p>
${(()=>{const q=cd&&app.chain&&app.chain.cueInfo?app.chain.cueInfo(r):null;return q?`<p class="cue" aria-live="polite">${q.ready>=q.total?'● Cued from the chain — every track starts instantly':'◌ Cueing from the chain… '+q.ready+' of '+q.total+' tracks ready'}</p>`:'';})()}<ol class="trk">${r.tracks.map((t,i)=>`<li class="${mine&&pb.idx===i?'on':''}"><button data-a="trk" data-i="${i}" aria-label="${cd?'Play':'Track'} ${t.n}: ${esc(t.title)}" ${cd?'':'disabled'}><img alt="" src="${art.thumb(art.track(r,t))}"><span><b>${t.n}. ${esc(t.title)}</b><i>#${t.id} · ${fmt(t.seconds)}${mine&&pb.idx===i?(pb.playing?' · ▶ playing':' · ❚❚ paused'):''}</i></span></button></li>`).join('')}</ol>
<div class="btns">${cd?`<button data-a="open">${I.openT?'Close case (O)':'Open case (O)'}</button><button data-a="flip">Flip (F)</button><button data-a="prev" aria-label="Previous case">◀ Prev</button><button data-a="next" aria-label="Next case">Next ▶</button>
${I.openT?`<button data-a="vbook" aria-pressed="${I.view==='book'}">View booklet</button><button data-a="vdisc" aria-pressed="${I.view==='disc'}">View disc</button><button data-a="vboth" aria-pressed="${I.view==='both'}">View both</button>`:''}<button data-a="play">${mine&&pb.playing?'Pause':'Play'} (Space)</button><button data-a="take" class="gold">${app.carry&&app.carry.kind==='cd'&&app.carry.slot===it.slot?'Put disc back':out?'Disc is at the booth':'Take CD to Player (T)'}</button>`
:`<button data-a="flip">Flip (F)</button><button data-a="peek">Peek at vinyl (O)</button><button data-a="prev" aria-label="Previous sleeve">◀ Prev</button><button data-a="next" aria-label="Next sleeve">Next ▶</button><button data-a="pick" class="gold">Pick Up (E)</button>`}
<button data-a="crate">${inCrate?'Remove from Crate':'Add to Crate'} (C)</button><button data-a="ret">Return to ${cd?'shelf':'crate'} (Esc)</button></div>
<p class="dim small">${cd?'Use the chips around the case, or click the cover to open it and click a track artwork to audition it. Scroll to zoom.':'Use the chips around the sleeve: Flip, Back to crate, Carry. Walking forward (W) also carries it. Scroll to zoom.'}</p>`;}
  I.render=render;
  el.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b||!I.item)return;const a=b.dataset.a;
    if(a==='trk')I.item.kind==='cd'&&(I.openT||I.toggleOpen(true),I.item.model.open>.9?I.playTile(+b.dataset.i):(I.item.pending=+b.dataset.i));
    else if(a==='open')I.toggleOpen();else if(a==='flip')I.flipCase();else if(a==='prev')I.step(-1);else if(a==='next')I.step(1);
    else if(a==='play')I.toggleCurrent();else if(a==='take')I.takeDisc();else if(a==='peek')I.togglePeek();else if(a==='pick')I.pickUp();
    else if(a==='crate')app.shop.toggleCrate(I.item.rel,I.item.kind);else if(a==='ret')I.close();else if(a==='vbook')I.setView('book');else if(a==='vdisc')I.setView('disc');else if(a==='vboth')I.setView('both');});
  return I;
}
