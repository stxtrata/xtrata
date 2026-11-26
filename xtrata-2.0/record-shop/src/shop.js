import * as THREE from 'three';
import {primaryName} from './bns.js';
import {XTRATA_LOGO} from './logo.js';
import {rng,hash,fitText,wrapText,fmt,typeName} from './util.js';
import {CD,thick} from './cdstock.js';

const TAGS=['Staff Picks','Fresh On-Chain Press','Listening Station Feature','Audionauts Spotlight','Limited Edition Single','Now Spinning'];
const HEADS=['FOUND ON THE CHAIN','INSCRIBED FOREVER','PERMANENT COLLECTION','NOBODY CAN TAKE THIS DOWN','PRESSED INTO BITCOIN','STILL HERE IN 2126','NO SERVER. NO TAKEDOWN.','SOMEBODY MADE THIS PERMANENT'];
const SLOGANS=[['XTRATA MUSIC','Permanent on-chain records & CDs'],['CREATE. INSCRIBE. SHARE.','Xtrata · the permanent data layer on Stacks'],['EVERY RECORD IN THIS SHOP','lives on the chain. Forever.'],['ON-CHAIN · ON BITCOIN','settled through Stacks, kept by Xtrata'],['PLAY IT. OWN IT. PASS IT ON.','Xtrata Music']];
const PRINTS=[1107]; // extra inscribed prints for the poster frames (inscription ids); override with XTRATA_SHOP_CONFIG.posterInscriptions

export function initShop(app){
  const {art,scene,mats:M}=app,cat=app.catalog,S={crate:[],seed:0,prints:[],beacon:null};app.shop=S;
  const F=art.font;
  // Every poster frame shows inscribed artwork: release covers, individual track artwork, and extra inscribed prints. No generated stand-ins.
  // ---------- posters ----------
  function drawPoster(p){const c=p.canvas,x=c.getContext('2d'),W=c.width,H=c.height,ct=p.content;
    if(ct.type==='release'||ct.type==='track'){const r=ct.rel,tk=ct.t,land=W>H*1.2;x.fillStyle='#120e0c';x.fillRect(0,0,W,H);
      const side=land?H-40:W-40,ax=20,ay=20;x.drawImage((tk?art.track(r,tk):art.cover(r)).canvas,ax,ay,side,side);
      x.fillStyle='#f2b84b';const tx=land?side+40:20,tw=land?W-side-60:W-40;let y=land?70:side+62;
      x.font=`800 ${land?30:28}px ${F}`;x.textAlign='left';x.fillText(fitText(x,ct.tag.toUpperCase(),tw),tx,y);y+=land?50:42;
      x.fillStyle='#fff3d6';x.font=`800 ${land?40:36}px ${F}`;y=wrapText(x,tk?tk.title:r.title,tx,y,tw,land?46:40,land?4:2);
      x.font=`500 26px ${F}`;x.fillStyle='#c9b48a';x.fillText(fitText(x,r.artist||'—',tw),tx,y+4);y+=38;
      if(y<H-50){x.font=`600 20px ${F}`;x.fillStyle='#58d7e8';x.fillText(fitText(x,'CD + '+r.vinyl+'-INCH VINYL · '+r.tracks.length+' TRK · '+fmt(r.seconds),tw),tx,y+4);}
      x.font=`700 18px ${F}`;x.fillStyle='#8a7a5a';x.fillText('XTRATA MUSIC',tx,H-18);}
    else if(ct.type==='promo'){const [l1,l2]=ct.slogan,g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#17100b');g.addColorStop(1,ct.alt?'#0c1d24':'#2a1a08');x.fillStyle=g;x.fillRect(0,0,W,H);
      x.strokeStyle='rgba(242,184,75,.75)';x.lineWidth=3;x.strokeRect(16,16,W-32,H-32);const ls=Math.min(W,H)*(W>H*1.2?.5:.46),lx=W>H*1.2?40:(W-ls)/2,ly=W>H*1.2?(H-ls)/2:H*.12;
      if(S.logo)x.drawImage(S.logo,lx,ly,ls,ls);x.fillStyle='#fff3d6';const land=W>H*1.2,tx=land?lx+ls+30:W/2,tw=land?W-tx-36:W-60;x.textAlign=land?'left':'center';let fs=land?40:38;x.font=`800 ${fs}px ${F}`;
      let y=wrapText(x,l1,tx,land?H*.4:ly+ls+58,tw,fs+6,3);x.font=`500 22px ${F}`;x.fillStyle='#f2b84b';y=wrapText(x,l2,tx,y+6,tw,28,3);x.font=`700 15px ${F}`;x.fillStyle='rgba(88,215,232,.9)';x.fillText('xtrata.xyz/music',tx,H-34);}
    else{const pr=ct.print,im=pr.img;
      if(pr.found){x.fillStyle=ct.alt?'#101820':'#17120f';x.fillRect(0,0,W,H);const land=W>H*1.2,m=22,bw=land?H-2*m:W-2*m,bh=land?H-2*m:H-2*m-118,sc=Math.min(bw/im.width,bh/im.height),iw=im.width*sc,ih=im.height*sc,ix=land?m+(bw-iw)/2:(W-iw)/2,iy=m+(bh-ih)/2;
        x.fillStyle='#efe6d2';x.fillRect(ix-7,iy-7,iw+14,ih+14);x.imageSmoothingEnabled=im.width>=96;x.drawImage(im,ix,iy,iw,ih);x.imageSmoothingEnabled=true;
        const tx=land?m+bw+26:m,tw=land?W-tx-m:W-2*m;let y=land?H*.3:H-92;x.textAlign='left';x.fillStyle='#f2b84b';x.font=`800 ${land?34:30}px ${F}`;y=wrapText(x,ct.head,tx,y,tw,land?40:34,land?4:2);
        x.fillStyle='#fff3d6';x.font=`600 18px ${F}`;x.fillText(fitText(x,'Inscription #'+pr.id+' · '+(pr.mime||'').replace('image/','').toUpperCase()+' · '+Math.max(1,Math.round(pr.size/1024))+' KB',tw),tx,y+4);
        x.fillStyle='rgba(88,215,232,.9)';x.font=`600 14px ${F}`;x.fillText(fitText(x,'on Xtrata · inscribed by '+(pr.creatorName||(pr.creator?pr.creator.slice(0,5)+'…'+pr.creator.slice(-4):'someone')),tw),tx,y+26);}
      else{const sc=Math.max(W/im.width,H/im.height);x.fillStyle='#000';x.fillRect(0,0,W,H);x.drawImage(im,(W-im.width*sc)/2,(H-im.height*sc)/2,im.width*sc,im.height*sc);
        x.fillStyle='rgba(0,0,0,.6)';x.fillRect(0,H-40,W,40);x.fillStyle='#fff3d6';x.textAlign='left';x.font=`700 18px ${F}`;x.fillText(fitText(x,'INSCRIPTION #'+pr.id+(pr.title?' · '+pr.title:''),W-28),14,H-14);}}
    p.tex.needsUpdate=true;}
  S.redrawPosters=()=>{for(const p of app.room.posters)if(p.content)drawPoster(p);};
  for(const p of app.room.posters)art.keep(p.canvas,()=>{if(p.content)drawPoster(p);});
  for(const p of app.room.posters)app.addPick(p.mesh,{id:'poster'+p.i,get title(){const c=p.content;return c.type==='promo'?c.slogan[0]:c.type==='print'?(c.print.title||(c.print.found?c.head:'Inscribed print')):c.t?c.t.title:c.rel.title;},get sub(){return p.content.type==='promo'?'Xtrata · poster':p.content.type==='print'?'Inscription #'+p.content.print.id+' · print':p.content.tag+' · poster';},hint:'Click to enlarge this print',reach:7,click:()=>app.ui.openPoster(p)});
  // ---------- staff-pick plaques on the CD wall ----------
  const plaques=[];for(let i=0;i<6;i++){const t=art.panel(256,56,()=>{});const m=new THREE.Mesh(new THREE.PlaneGeometry(.17,.037),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));m.rotation.y=Math.PI/2;scene.add(m);plaques.push({m,t});}
  // ---------- seeded shuffle ----------
  S.shuffle=(seed,quiet)=>{S.seed=seed>>>0;const r=rng(S.seed),pick=a=>a[Math.floor(r()*a.length)];
    const pb=app.playback.s,rels=cat.releases.slice().sort(()=>r()-.5),singles=cat.singles.slice().sort(()=>r()-.5);
    const frames=app.room.posters.slice().sort(()=>r()-.5);let ri=0,ti=0,pi=0;
    const tks=[];for(const rel of cat.releases)for(const t of rel.tracks)tks.push({rel,t,own:t.img!==rel.cover});tks.sort((a,b)=>(b.own-a.own)||(r()-.5)); // track artwork that differs from its cover comes first
    // mostly album artwork; then one Xtrata poster, up to three images found at random on the chain, and track artwork for the rest
    const prints=S.prints.slice().sort(()=>r()-.5),heads=HEADS.slice().sort(()=>r()-.5),slog=SLOGANS.slice().sort(()=>r()-.5);
    frames.forEach((p,i)=>{if(i<TAGS.length){const tag=TAGS[i];const rel=tag==='Now Spinning'&&pb.rel?pb.rel:tag==='Limited Edition Single'?singles[0]:rels[ri++%rels.length];p.content={type:'release',rel,tag};}
      else if(i===TAGS.length)p.content={type:'promo',slogan:slog[0],alt:r()<.5};
      else if(pi<prints.length&&pi<3){p.content={type:'print',print:prints[pi],head:heads[pi%heads.length],alt:r()<.5};pi++;}
      else{const k=tks[ti++%tks.length];p.content={type:'track',rel:k.rel,t:k.t,tag:'Track Artwork · #'+k.t.id};}drawPoster(p);});
    if(S.printsAsked&&!quiet)S.morePrints();
    for(const E of app.stock.endcaps){for(const s of E.slots){if(s.out)continue;const rel=pick(cat.releases);s.rel=rel;s.mesh.geometry=app.stock.geo(rel);s.mesh.material=app.stock.caseMats(rel);s.target=null;}
      const tag=pick(TAGS),x=E.tagTex.userData.canvas.getContext('2d');x.fillStyle='#f2b84b';x.fillRect(0,0,512,128);x.fillStyle='#17120f';x.textAlign='center';let fs=54;x.font=`800 ${fs}px ${F}`;while(x.measureText(tag.toUpperCase()).width>480){fs-=2;x.font=`800 ${fs}px ${F}`;}x.fillText(tag.toUpperCase(),256,82);E.tagTex.needsUpdate=true;E.tagTex.userData.redraw=()=>{x.fillStyle='#f2b84b';x.fillRect(0,0,512,128);x.fillStyle='#17120f';x.textAlign='center';x.font=`800 ${fs}px ${F}`;x.fillText(tag.toUpperCase(),256,82);};}
    const dup=app.stock.faceSlots.filter(s=>!s.primary).sort(()=>r()-.5);
    plaques.forEach((pl,i)=>{const s=dup[i];if(!s){pl.m.visible=false;return;}pl.m.position.set(-7.316,s.row.lipTop-.03,s.pos.z);const x=pl.t.userData.canvas.getContext('2d');x.fillStyle=i%2?'#58d7e8':'#f2b84b';x.fillRect(0,0,256,56);x.fillStyle='#14100d';x.textAlign='center';let fs=26;x.font=`800 ${fs}px ${F}`;const tx=TAGS[i].toUpperCase();while(x.measureText(tx).width>240){fs-=1;x.font=`800 ${fs}px ${F}`;}x.fillText(tx,128,37);pl.t.needsUpdate=true;pl.t.userData.redraw=()=>{x.fillStyle=i%2?'#58d7e8':'#f2b84b';x.fillRect(0,0,256,56);x.fillStyle='#14100d';x.textAlign='center';x.font=`800 ${fs}px ${F}`;x.fillText(tx,128,37);};});
    if(!quiet){app.toast('Displays shuffled · seed '+S.seed.toString(36).toUpperCase());app.foley('slide');}app.emit('shuffle');};
  // ---------- finder ----------
  const FILTERS={all:()=>true,'cd-albums':r=>r.type!=='single','cd-singles':r=>r.type==='single',v12:r=>r.vinyl===12,v7:r=>r.vinyl===7};
  S.filters={all:'Everything','cd-albums':'CD bay · Albums & EPs','cd-singles':'CD bay · Singles',v12:'12-inch crates',v7:'7-inch crates'};
  S.search=(q,filter='all')=>{q=String(q||'').trim().toLowerCase();const out=[],f=FILTERS[filter]||FILTERS.all;
    const exact=/^#(\d+)$/.exec(q);
    for(const r of cat.releases){if(!f(r))continue;let tracks=[];
      if(exact){tracks=r.tracks.filter(t=>String(t.id)===exact[1]);if(!tracks.length)continue;}
      else if(q){const hay=[r.title,r.artist,typeName(r.type),r.type,r.id,r.from||'',r.flags.join(' '),'cd compact disc vinyl record '+r.vinyl+'-inch '+r.vinyl+'" '+(r.vinyl===7?'45 single seven':'33 lp twelve')].join(' \n ').toLowerCase();
        const toks=q.split(/\s+/);let ok=true;for(const tk of toks){const t2=tk.replace(/^#/,'');const tm=r.tracks.filter(t=>t.title.toLowerCase().includes(tk)||String(t.id)===t2||('#'+t.id)===tk);if(tm.length){for(const t of tm)if(!tracks.includes(t))tracks.push(t);}else if(!hay.includes(tk)){ok=false;break;}}
        if(!ok)continue;}
      out.push({rel:r,tracks});}
    return out;};
  // ---------- beacon ----------
  const bg=new THREE.Group();bg.visible=false;scene.add(bg);
  const bl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1)),new THREE.LineBasicMaterial({color:0xffc94d,transparent:true,toneMapped:false,depthTest:false}));bl.renderOrder=20;bg.add(bl);
  const bc=new THREE.Mesh(new THREE.CylinderGeometry(.006,.022,1.1,12,1,true),new THREE.MeshBasicMaterial({color:0xffc94d,transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));bg.add(bc);
  S.setBeacon=(pos,size,rotY=0,secs=9)=>{bg.visible=true;bg.position.copy(pos);bl.scale.copy(size);bl.rotation.y=rotY;bc.position.y=size.y/2+.62;S.beacon={t:secs,pos:pos.clone()};};
  S.routeCD=(rel,then)=>{
    if(app.cd.state!=='none'&&app.cd.rel===rel&&app.cd.state!=='carried'){app.jump('CD Player');app.toast('“'+rel.title+'” is loaded at the CD listening booth.');return;}
    let s=app.stock.primary[rel.id];if(!s){app.toast('“'+rel.title+'” has no CD copy on the wall in this oversized catalogue — find its vinyl instead.');return;}if(s.out)s=app.stock.slots.find(x=>x.rel===rel&&!x.out&&x.fixture!=='endcap')||s;
    const stand={x:s.pos.x+1.35,z:s.pos.z};app.jump(null,{x:stand.x,z:stand.z,look:new THREE.Vector3(s.pos.x,s.pos.y,s.pos.z),then:()=>{S.setBeacon(new THREE.Vector3(s.pos.x+.02,s.pos.y,s.pos.z),new THREE.Vector3(.05,CD.H+.03,CD.W+.03));if(then)then(s);}});};
  S.routeVinyl=rel=>{
    if(app.vinyl.b.rel===rel){app.jump('Turntable');app.toast('“'+rel.title+'” is on the vinyl listening bench.');return;}
    if(app.carry&&app.carry.kind==='vinyl'&&app.carry.rel===rel){app.toast('You are carrying that sleeve.');return;}
    let it=app.vinyl.primary[rel.id];if(it.out)it=app.vinyl.items.find(x=>x.rel===rel&&!x.out)||it;const L=it.lane;
    app.jump(null,{x:L.x,z:L.zFront+.82,look:new THREE.Vector3(L.x,.7+L.j.s-.03,it.piv.position.z-.05),then:()=>{app.vinyl.highlight(it);S.setBeacon(new THREE.Vector3(L.x,.7+L.j.s/2+.02,it.piv.position.z-.03),new THREE.Vector3(L.j.s+.03,L.j.s+.03,.03),0);}});};
  S.openRelease=(rel,playIdx)=>{S.routeCD(rel,s=>{app.whenIdle(()=>{if(!s.out)app.stock.extract(s,playIdx!=null?{playIdx}:{autoOpen:true});});});};
  // ---------- crate list ----------
  const KEY='xtrata-music/crate-v1';
  try{const raw=localStorage.getItem(KEY);if(raw){const a=JSON.parse(raw);if(Array.isArray(a))for(const e of a)if(e&&app.relById[e.id]&&(e.format==='cd'||e.format==='vinyl')&&!S.crate.some(c=>c.id===e.id&&c.format===e.format))S.crate.push({id:e.id,format:e.format});}}catch(e){S.crate=[];S.storageNote='Saved crate list was unreadable and has been reset.';}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S.crate));}catch(e){}};
  S.inCrate=(rel,format)=>S.crate.some(c=>c.id===rel.id&&c.format===format);
  S.toggleCrate=(rel,format)=>{const i=S.crate.findIndex(c=>c.id===rel.id&&c.format===format);if(i>=0){S.crate.splice(i,1);app.toast('Removed from Crate List: '+rel.title+' ('+(format==='cd'?'CD':'Vinyl')+')');}else{S.crate.push({id:rel.id,format});app.toast('Added to Crate List: '+rel.title+' ('+(format==='cd'?'CD':'Vinyl')+')');}save();app.foley('click');drawPOS();app.emit('crate');};
  S.clearCrate=()=>{S.crate=[];save();drawPOS();app.emit('crate');};
  S.receipt=()=>{const now=new Date(),items=S.crate.map(c=>{const r=app.relById[c.id];const o={release_id:r.id,title:r.title,artist:r.artist,type:r.type,format:c.format==='cd'?'CD':r.vinyl+'-inch vinyl',trust:r.trust,minutes:r.minutes,cover:r.cover,flags:r.flags.slice()};if(r.from!=null)o.from=r.from;o.tracks=r.tracks.map(t=>({n:t.n,id:t.id,seconds:t.seconds,img:t.img,title:t.title}));return o;});
    return {schema:'xtrata-music/crate-receipt-v1',receipt_id:'XM-'+now.getTime().toString(36).toUpperCase()+'-'+Math.floor(Math.random()*46656).toString(36).toUpperCase().padStart(3,'0'),created_at:now.toISOString(),created_local:now.toLocaleString(),network:'Stacks',platform:'Xtrata',shop:'XTRATA MUSIC — The Record Shop',status:'catalogue-reference-only',payment:null,transaction_id:null,
      note:'Reference receipt only. No payment was taken, nothing was purchased and no on-chain transaction was created.',totals:{items:items.length,tracks:items.reduce((a,i)=>a+i.tracks.length,0)},items};};
  function drawPOS(){const x=app.room.posTex.userData.canvas.getContext('2d');x.fillStyle='#07130f';x.fillRect(0,0,512,320);x.fillStyle='#f2b84b';x.font=`800 40px ${F}`;x.textAlign='left';x.fillText('CRATE LIST',24,54);x.fillStyle='#58d7e8';x.font=`700 30px ${F}`;x.textAlign='right';x.fillText(S.crate.length+' item'+(S.crate.length===1?'':'s'),488,52);x.textAlign='left';
    x.font=`500 22px ${F}`;x.fillStyle='#d8ead9';S.crate.slice(0,6).forEach((c,i)=>{const r=app.relById[c.id];x.fillText(fitText(x,(c.format==='cd'?'CD  ':'LP  ')+r.title,460),24,98+i*30);});
    if(!S.crate.length){x.fillStyle='#7fa08a';x.fillText('Add CDs or vinyl from any case or sleeve',24,120);}
    x.fillStyle='#f2b84b';x.font=`700 20px ${F}`;x.fillText('CLICK TERMINAL · REFERENCE RECEIPTS ONLY',24,298);app.room.posTex.needsUpdate=true;}
  S.drawPOS=drawPOS;drawPOS();app.room.posTex.userData.redraw=drawPOS;
  app.addPick(app.room.posPick,{id:'pos',title:'Checkout Terminal',get sub(){return 'Crate List · '+S.crate.length+' item'+(S.crate.length===1?'':'s');},hint:'Click to open your Crate List',reach:3.6,click:()=>app.ui.openCrate()});
  app.room.posPick.removeFromParent();
  // ---------- artwork monitors ----------
  const mons=[{tex:app.deck.monTex,src:['cd-deck','cd-case'],x:-5.3,z:-4.4},{tex:app.vinyl.monTex,src:['vinyl'],x:4.7,z:-4.4}];let mt=0,frameN=0;
  function drawMon(m,idle){const x=m.tex.userData.canvas.getContext('2d'),pb=app.playback.s;
    if(pb.rel&&m.src.includes(pb.source)){const t=pb.rel.tracks[pb.idx];x.drawImage(art.track(pb.rel,t).canvas,0,0,256,256);x.fillStyle='rgba(0,0,0,.7)';x.fillRect(0,196,256,60);x.fillStyle='#fff3d6';x.font=`800 18px ${F}`;x.textAlign='left';x.fillText(fitText(x,t.n+'. '+t.title,240),8,220);x.font=`600 14px ${F}`;x.fillStyle='#f2b84b';x.fillText((pb.playing?'▶ ':'❚❚ ')+fmt(pb.elapsed)+' / '+fmt(t.seconds)+' · #'+t.id,8,242);m.idle=false;}
    else{const T=performance.now()/1000,rel=cat.releases[Math.floor(T/5)%cat.releases.length];x.fillStyle='#0a0810';x.fillRect(0,0,256,256);x.globalAlpha=.55;x.drawImage(art.cover(rel).canvas,58,26,140,140);x.globalAlpha=1;
      x.fillStyle='#58d7e8';for(let i=0;i<32;i++){const h=8+26*Math.abs(Math.sin(T*2.2+i*.45)*Math.sin(T*.7+i*.21));x.fillRect(8+i*7.6,214-h/2,4,h);}
      x.fillStyle='#f2b84b';x.font=`800 20px ${F}`;x.textAlign='center';x.fillText('XTRATA MUSIC',128,190);x.font=`600 12px ${F}`;x.fillStyle='#fff3d6';x.fillText(fitText(x,'Now in stock: '+rel.title,240),128,246);m.idle=true;}
    m.tex.needsUpdate=true;}
  app.on('playback',()=>mons.forEach(m=>drawMon(m)));app.on('tick',()=>mons.forEach(m=>{if(!m.idle)drawMon(m);}));
  mons.forEach(m=>{drawMon(m);m.tex.userData.redraw=()=>drawMon(m);});
  let artT=0;app.on('art',()=>{clearTimeout(artT);artT=setTimeout(()=>{S.redrawPosters();mons.forEach(m=>drawMon(m));},250);});
  {const im=new Image();im.onload=()=>{S.logo=im;S.redrawPosters();};im.src=XTRATA_LOGO;}
  // show the inscriber's primary BNS name (e.g. dyle.btc) instead of a raw address whenever the address has one
  const nameOf=pr=>{const c=app.chain;if(!pr.creator||pr.creatorName||!c||!c.enabled)return;const C2=window.XTRATA_SHOP_CONFIG||{};let bases=[];try{bases=[C2.hiroBase||new URL(c.base).origin+'/hiro/mainnet'];}catch(e){}
    primaryName(pr.creator,bases).then(n=>{if(!n)return;pr.creatorName=n;app.room.posters.forEach(p=>{if(p.content&&p.content.print===pr)drawPoster(p);});});};
  const place=pr=>{nameOf(pr);S.prints.push(pr);if(S.prints.length>14)S.prints.splice(0,S.prints.length-14);const f=app.room.posters.find(p=>p.content&&p.content.type==='track');
    if(f&&app.room.posters.filter(p=>p.content.type==='print').length<3){f.content={type:'print',print:pr,head:HEADS[(pr.id+S.seed)%HEADS.length],alt:pr.id%2===0};drawPoster(f);}};
  S.morePrints=()=>{const c=app.chain;if(!c||!c.randomPrints||S.finding)return;S.finding=true;c.randomPrints(3).then(l=>{for(const pr of l)if(!S.prints.some(q=>q.id===pr.id))place(pr);}).catch(()=>{}).then(()=>{S.finding=false;});};
  S.loadPrints=()=>{const c=app.chain;if(S.printsAsked||!c||!c.fetchPrint)return;S.printsAsked=true;const C2=window.XTRATA_SHOP_CONFIG||{},ids=Array.isArray(C2.posterInscriptions)?C2.posterInscriptions:PRINTS;
    for(const id of ids.slice(0,11))c.fetchPrint(id).then(place).catch(()=>{});if(C2.randomPosters!==false)S.morePrints();};
  S.update=dt=>{
    if(S.beacon){S.beacon.t-=dt;const k=.5+.5*Math.sin(performance.now()/130);bl.material.opacity=.45+.55*k;bl.scale.multiplyScalar(1);bc.material.opacity=.08+.16*k;if(S.beacon.t<=0){S.beacon=null;bg.visible=false;}}
    mt+=dt;if(mt>.16){mt=0;frameN++;for(const m of mons)if(m.idle&&Math.hypot(app.player.x-m.x,app.player.z-m.z)<5.5)drawMon(m);}
  };
  return S;
}
