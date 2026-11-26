import * as THREE from 'three';
import {CD,thick} from './cdstock.js';
import {fitText,fmt} from './util.js';

export const REC={R:.172,GO:.164,GI:.072,LABEL:.058,TH:.003,S12:.87,S7:.56};
export const recScale=size=>size===7?REC.S7:REC.S12;
export const JK={12:{s:.315,t:.008},7:{s:.205,t:.006}};

export function initModels(app){
  const {art,mats:M}=app;
  const plastic=new THREE.MeshStandardMaterial({color:0xeaf2f6,transparent:true,opacity:.2,roughness:.08,metalness:.1,depthWrite:false});
  const tray=new THREE.MeshStandardMaterial({color:0x0c0c0e,roughness:.55});
  const hubM=new THREE.MeshStandardMaterial({color:0x1a1a1d,roughness:.4});
  const vinylSide=new THREE.MeshStandardMaterial({color:0x050505,roughness:.4});
  let vinylTop=null;
  const recGeo=new THREE.CylinderGeometry(REC.R,REC.R,REC.TH,72),labGeo=new THREE.CircleGeometry(REC.LABEL,48),holeGeo=new THREE.CircleGeometry(.0042,16);
  const holeM=new THREE.MeshBasicMaterial({color:0x000000});
  const jEdge=new THREE.MeshStandardMaterial({color:0xe8e0cf,roughness:.9});
  const X={};app.models=X;

  // Vinyl record (lies in XZ, Y up). labelMap: texture for the centre label.
  X.makeRecord=(size,labelMap)=>{
    if(!vinylTop)vinylTop=new THREE.MeshStandardMaterial({map:art.groove(),roughness:.32,metalness:.35});
    const g=new THREE.Group(),s=recScale(size);
    const d=new THREE.Mesh(recGeo,[vinylSide,vinylTop,vinylTop]);d.castShadow=true;g.add(d);
    const lm=new THREE.MeshStandardMaterial({map:labelMap,roughness:.7});
    const l=new THREE.Mesh(labGeo,lm);l.rotation.x=-Math.PI/2;l.position.y=REC.TH/2+.0003;g.add(l);
    const l2=new THREE.Mesh(labGeo,lm);l2.rotation.x=Math.PI/2;l2.position.y=-REC.TH/2-.0003;g.add(l2);
    const h=new THREE.Mesh(holeGeo,holeM);h.rotation.x=-Math.PI/2;h.position.y=REC.TH/2+.0006;g.add(h);
    g.scale.set(s,1,s);
    return {group:g,disc:d,label:l,labelMat:lm,size,radius:REC.R*s,dispose(){lm.dispose();}};
  };
  // Vinyl jacket standing in XY plane, front cover +Z, opening on +X edge.
  X.makeJacket=(rel,withRecord)=>{
    const j=JK[rel.vinyl],g=new THREE.Group();
    const front=new THREE.MeshStandardMaterial({map:art.cover(rel).tex,roughness:.6}),back=new THREE.MeshStandardMaterial({map:art.jacketBack(rel),roughness:.7});
    const geo=new THREE.BoxGeometry(j.s,j.s,j.t);geo.clearGroups();geo.addGroup(0,24,0);geo.addGroup(24,6,1);geo.addGroup(30,6,2);const body=new THREE.Mesh(geo,[jEdge,front,back]);body.castShadow=true;g.add(body);
    let rec=null;
    if(withRecord){rec=X.makeRecord(rel.vinyl,art.cover(rel).tex);rec.group.rotation.x=Math.PI/2;rec.group.position.z=0;rec.group.scale.y=.6;g.add(rec.group);rec.group.visible=false;}
    return {group:g,body,rel,size:rel.vinyl,dim:j,rec,picks:[body],
      setPeek(t){if(!rec)return;rec.group.visible=t>.001;rec.group.position.x=t*j.s*.6;},
      dispose(){geo.dispose();front.dispose();back.dispose();if(rec)rec.dispose();}};
  };
  // Hinged jewel case. Local: X width, Y height, Z thickness; front cover +Z; hinge along the spine edge x=-W/2.
  X.makeCase=(rel,slot)=>{
    const W=CD.W,H=CD.H,T=thick(rel),g=new THREE.Group(),own=[];
    const mesh=(geo,mat,parent)=>{const m=new THREE.Mesh(geo,mat);parent.add(m);own.push(geo);return m;};
    const mm=o=>{const m=new THREE.MeshStandardMaterial(o);own.push(m);return m;};
    const base=new THREE.Group();g.add(base);
    const tr=mesh(new THREE.BoxGeometry(W,H,T*.55),tray,base);tr.position.z=-T*.225;tr.userData.part='tray';
    const rear=mesh(new THREE.PlaneGeometry(W*.985,H*.985),mm({map:art.rear(rel),roughness:.8}),base);rear.rotation.y=Math.PI;rear.position.z=-T/2-.0004;rear.userData.part='rear';
    const sp=mesh(new THREE.PlaneGeometry(T,H),mm({map:art.spine(rel),roughness:.45}),base);sp.rotation.y=-Math.PI/2;sp.position.x=-W/2-.0004;sp.userData.part='spine';
    const zf=T*.05+.0004;
    const hub=mesh(new THREE.CylinderGeometry(.0105,.0105,T*.12,20),hubM,base);hub.rotation.x=Math.PI/2;hub.position.set(.004,0,zf+T*.05);hub.userData.part='hub';
    const well=mesh(new THREE.RingGeometry(.012,.083,48),mm({color:0x151518,roughness:.3,metalness:.4}),base);well.position.set(.004,0,zf);well.userData.part='tray';
    const disc=mesh(new THREE.RingGeometry(.0102,.0816,64),mm({map:art.disc(rel),roughness:.22,metalness:.55}),base);disc.position.set(.004,0,zf+T*.03);disc.userData.part='disc';
    // RingGeometry UVs already map the full square, so the printed disc texture lines up.
    const lid=new THREE.Group();lid.position.set(-W/2,0,T/2-T*.2);g.add(lid);
    const pl=mesh(new THREE.BoxGeometry(W,H,T*.4),plastic,lid);pl.position.x=W/2;pl.renderOrder=3;pl.userData.part='lid';
    const cover=mesh(new THREE.PlaneGeometry(W*.97,H*.97),mm({map:art.cover(rel).tex,roughness:.35}),lid);cover.position.set(W/2,0,T*.2+.0005);cover.userData.part='front';
    const bc=art.mkCanvas(1024,900),bt=art.mkTex(bc);
    const book=mesh(new THREE.PlaneGeometry(W*.97,H*.97),mm({map:bt,emissiveMap:bt,emissive:0xffffff,emissiveIntensity:.18,roughness:.75}),lid);book.rotation.y=Math.PI;book.position.set(W/2,0,-T*.2-.0005);book.userData.part='booklet';
    const tiles=[];
    let lastA=-1,lastP=false;
    function drawBooklet(active,playing){lastA=active;lastP=playing;
      const x=bc.getContext('2d'),n=rel.tracks.length,cols=n===1?1:n<=4?2:n<=9?3:Math.ceil(Math.sqrt(n)),rows=Math.ceil(n/cols),pad=24;
      x.fillStyle='#efe6d2';x.fillRect(0,0,1024,900);x.fillStyle='#1c1814';x.font=`800 30px ${art.font}`;x.textAlign='left';x.textBaseline='alphabetic';
      x.fillText(fitText(x,rel.title,700),pad,44);x.font=`500 22px ${art.font}`;x.fillStyle='#6b4a1e';x.textAlign='right';x.fillText(fitText(x,rel.artist||'',280),1024-pad,44);x.textAlign='left';
      const top=60,cw=(1024-pad*2)/cols,ch=(900-top-pad)/rows,cap=n===1?70:54,side=Math.min(cw-18,ch-cap-10);
      tiles.length=0;
      rel.tracks.forEach((t,i)=>{const c=i%cols,r=Math.floor(i/cols),cx=pad+c*cw,cy=top+r*ch,ax=cx+(cw-side)/2,ay=cy+4;
        const on=i===active;
        if(on){x.fillStyle=playing?'#f2b84b':'#9a8a66';x.fillRect(ax-7,ay-7,side+14,side+14);}
        x.drawImage(art.track(rel,t).canvas,ax,ay,side,side);
        x.fillStyle='#1c1814';x.textAlign='center';const fs=Math.max(15,Math.min(26,side*.11));x.font=`800 ${fs}px ${art.font}`;
        x.fillText(fitText(x,String(t.n).padStart(2,'0')+' · '+t.title,cw-12),cx+cw/2,ay+side+fs+8);
        x.font=`500 ${fs*.78}px ${art.font}`;x.fillStyle='#5a5148';x.fillText('#'+t.id+' · '+fmt(t.seconds),cx+cw/2,ay+side+fs*2+10);
        if(on){x.fillStyle='rgba(0,0,0,.72)';x.fillRect(ax,ay,side,Math.max(26,side*.14));x.fillStyle='#f2b84b';x.font=`800 ${Math.max(16,side*.085)}px ${art.font}`;x.fillText(playing?'▶ PLAYING':'❚❚ PAUSED',ax+side/2,ay+Math.max(20,side*.105));}
        tiles.push({i,u0:cx/1024,u1:(cx+cw)/1024,v1:1-cy/900,v0:1-(cy+ch)/900,au0:ax/1024,au1:(ax+side)/1024,av1:1-ay/900,av0:1-(ay+side)/900});});
      bt.needsUpdate=true;
    }
    drawBooklet(-1,false);art.keep(bc,()=>drawBooklet(lastA,lastP));
    const model={group:g,rel,slot,lid,disc,hub,cover,rear,book,tiles,open:0,W,H,T,picks:[cover,rear,book,disc,hub,well,tr,pl,sp],
      setOpen(t){model.open=t;lid.rotation.y=-t*3.02;},
      setDisc(v){disc.visible=v;},
      drawBooklet,
      tileAt(uv){for(const t of tiles)if(uv.x>=t.u0&&uv.x<t.u1&&uv.y>=t.v0&&uv.y<t.v1)return t.i;return -1;},
      dispose(){for(const o of own)o.dispose();bt.dispose();}};
    return model;
  };
  return X;
}
