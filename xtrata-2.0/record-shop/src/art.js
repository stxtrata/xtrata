import * as THREE from 'three';
import {hash,rng,wrapText,fitText,fmt,typeName} from './util.js';

// Art cache: one stable canvas + texture per unique art identity. Real image bytes (catalog.images[key] = {t,c})
// are drawn into the existing canvas when available; otherwise a deterministic, labelled fallback card stays.
export function initArt(app){
  const images=app.catalog.images||{};
  const A={entries:new Map(),stats:{real:0,fallback:0,failed:0}};
  const aniso=Math.min(8,app.renderer.capabilities.getMaxAnisotropy());
  const mkCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h||w;c.getContext('2d',{willReadFrequently:true});return c;}; // CPU-backed: content survives GPU resource eviction
  function mkTex(canvas){const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=aniso;return t;}
  // 2D canvas contexts can be lost (GPU reset, sleep/wake). Every canvas that backs a texture registers a redraw so art recovers.
  function keep(c,fn){c.addEventListener('contextrestored',()=>{try{fn();}catch(e){console.warn(e);}});return c;}
  A.keep=keep;
  A.snapshot=(c,tex)=>{let img=null;try{img=c.getContext('2d').getImageData(0,0,c.width,c.height);}catch(e){}keep(c,()=>{if(img){c.getContext('2d').putImageData(img,0,0);if(tex)tex.needsUpdate=true;}});};
  A.mkCanvas=mkCanvas;A.mkTex=mkTex;
  const F='"Helvetica Neue",Helvetica,Arial,sans-serif';
  A.font=F;

  function drawFallback(c,idKey,info){
    const S=c.width,x=c.getContext('2d'),r=rng(hash(idKey));x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.textAlign='left';
    const h=Math.floor(r()*360),h2=(h+40+Math.floor(r()*150))%360,style=Math.floor(r()*6);
    const g=x.createLinearGradient(0,0,S,S);g.addColorStop(0,`hsl(${h},55%,${18+r()*10}%)`);g.addColorStop(1,`hsl(${h2},60%,${10+r()*8}%)`);
    x.fillStyle=g;x.fillRect(0,0,S,S);
    x.save();x.globalAlpha=.9;
    const a=`hsl(${h2},75%,62%)`,b=`hsl(${h},70%,70%)`;
    if(style===0){for(let i=9;i>0;i--){x.strokeStyle=i%2?a:b;x.lineWidth=S*.012;x.globalAlpha=.25+.07*i;x.beginPath();x.arc(S*(.3+r()*.4),S*.42,S*.045*i,0,7);x.stroke();}}
    else if(style===1){x.rotate(-.5);for(let i=0;i<9;i++){x.fillStyle=i%2?a:b;x.globalAlpha=.18+r()*.35;x.fillRect(-S,i*S*.14,S*3,S*(.03+r()*.07));}}
    else if(style===2){x.translate(S*.5,S*.42);for(let i=0;i<24;i++){x.rotate(Math.PI/12);x.fillStyle=i%2?a:b;x.globalAlpha=.12+r()*.3;x.beginPath();x.moveTo(0,0);x.lineTo(S*.9,-S*.05);x.lineTo(S*.9,S*.05);x.fill();}x.globalAlpha=1;x.fillStyle=`hsl(${h},60%,12%)`;x.beginPath();x.arc(0,0,S*.12,0,7);x.fill();}
    else if(style===3){for(let i=0;i<10;i++)for(let j=0;j<7;j++){x.fillStyle=(i+j)%3?a:b;x.globalAlpha=.15+r()*.6;x.beginPath();x.arc(S*(.08+i*.094),S*(.1+j*.094),S*(.008+r()*.03),0,7);x.fill();}}
    else if(style===4){for(let i=0;i<40;i++){const hh=S*(.05+r()*.42)*(0.5+0.5*Math.sin(i*.33+r()));x.fillStyle=i%5?a:b;x.globalAlpha=.55;x.fillRect(S*(.05+i*.0228),S*.42-hh/2,S*.013,hh);}}
    else{for(let i=0;i<7;i++){x.fillStyle=i%2?a:b;x.globalAlpha=.16+r()*.2;x.beginPath();x.arc(S*r(),S*r()*.75,S*(.1+r()*.22),0,7);x.fill();}}
    x.restore();
    const sc=x.createLinearGradient(0,S*.5,0,S);sc.addColorStop(0,'rgba(0,0,0,0)');sc.addColorStop(.45,'rgba(0,0,0,.72)');sc.addColorStop(1,'rgba(0,0,0,.9)');
    x.fillStyle=sc;x.fillRect(0,S*.5,S,S*.5);
    x.fillStyle='#fff6e2';x.textBaseline='alphabetic';
    x.font=`800 ${S*.085}px ${F}`;let y=wrapText(x,info.title||'Untitled',S*.06,S*.74,S*.88,S*.092,2);
    x.font=`500 ${S*.05}px ${F}`;x.fillStyle=`hsl(${h2},80%,78%)`;x.fillText(fitText(x,info.artist||'—',S*.88),S*.06,Math.min(y+S*.012,S*.925));
    x.font=`600 ${S*.03}px ${F}`;x.fillStyle='rgba(255,246,226,.72)';x.textAlign='right';x.fillText(info.tag||'',S*.94,S*.965);
    x.textAlign='left';x.fillStyle='rgba(0,0,0,.55)';x.fillRect(0,0,S,S*.062);x.fillStyle='rgba(255,246,226,.85)';x.font=`600 ${S*.03}px ${F}`;
    x.fillText('ARTWORK FALLBACK · key '+(info.key||''),S*.03,S*.044);
    return `hsl(${h},42%,24%)`;
  }
  function sampleColor(c){try{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let R=0,G=0,B=0,n=0;for(let i=0;i<d.length;i+=4*97){R+=d[i];G+=d[i+1];B+=d[i+2];n++;}R/=n;G/=n;B/=n;const m=.55;return `rgb(${R*m|0},${G*m|0},${B*m|0})`;}catch(e){return '#2b2622';}}
  function loadInto(e,key){
    const src=images[key];if(!src)return Promise.resolve(false);
    const tryOne=u=>new Promise(res=>{if(!u)return res(false);const im=new Image();let done=false;const fin=v=>{if(!done){done=true;res(v);}};
      im.onload=()=>{try{if(!im.width)return fin(false);const x=e.canvas.getContext('2d'),S=e.canvas.width,s=Math.max(S/im.width,S/im.height);x.fillStyle='#111';x.fillRect(0,0,S,S);x.drawImage(im,(S-im.width*s)/2,(S-im.height*s)/2,im.width*s,im.height*s);fin(true);}catch(er){fin(false);}};
      im.onerror=()=>fin(false);setTimeout(()=>fin(false),6000);im.src=u;});
    return tryOne(src.c).then(ok=>ok||tryOne(src.t)).then(ok=>{
      if(ok){e.fallback=false;e.thumbURL=null;e.color=sampleColor(e.canvas);if(e.tex)e.tex.needsUpdate=true;A.stats.real++;A.stats.fallback--;}else A.stats.failed++;return ok;});
  }
  // real artwork arriving later (streamed from the on-chain player): drawn into the SAME canvas/texture
  A.setImage=(e,im)=>{const x=e.canvas.getContext('2d'),S=e.canvas.width,s=Math.max(S/im.width,S/im.height);x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.fillStyle='#111';x.fillRect(0,0,S,S);x.drawImage(im,(S-im.width*s)/2,(S-im.height*s)/2,im.width*s,im.height*s);
    if(e.fallback){e.fallback=false;A.stats.real++;A.stats.fallback--;}e.img=im;e.thumbURL=null;e.color=sampleColor(e.canvas);if(e.tex)e.tex.needsUpdate=true;};
  A.refresh=rel=>{for(const k of ['spine:','disc:']){const t=memo.get(k+rel.id);if(t&&t.userData.redraw)t.userData.redraw();}};
  const pending=[];
  function entry(id,size,info,imgKey,withTex){
    let e=A.entries.get(id);if(e){if(withTex&&!e.tex)e.tex=mkTex(e.canvas);return e;}
    e={id,canvas:mkCanvas(size),tex:null,fallback:true,color:'#333'};
    e.color=drawFallback(e.canvas,id,info);A.stats.fallback++;
    if(withTex)e.tex=mkTex(e.canvas);
    A.entries.set(id,e);
    keep(e.canvas,()=>{if(e.img){const f=e.fallback;A.setImage(e,e.img);return;}e.color=drawFallback(e.canvas,id,info);e.thumbURL=null;if(e.tex)e.tex.needsUpdate=true;if(images[imgKey])loadInto(e,imgKey);});
    if(images[imgKey])pending.push(loadInto(e,imgKey));
    return e;
  }
  A.cover=rel=>entry(images[rel.cover]?'img:'+rel.cover:'cover:'+rel.id,512,{title:rel.title,artist:rel.artist,tag:typeName(rel.type)+' · '+rel.tracks.length+' trk',key:rel.cover},rel.cover,true);
  A.track=(rel,t)=>images[t.img]&&t.img===rel.cover?A.cover(rel):entry(images[t.img]?'img:'+t.img:'track:'+t.id,256,{title:t.title,artist:rel.artist,tag:'#'+t.id,key:t.img},t.img,false);
  A.preload=()=>{for(const r of app.catalog.releases){A.cover(r);for(const t of r.tracks)A.track(r,t);}return Promise.race([Promise.all(pending),new Promise(r=>setTimeout(r,9000))]);};

  A.thumb=e=>{if(!e.thumbURL){const c=mkCanvas(96);c.getContext('2d').drawImage(e.canvas,0,0,96,96);e.thumbURL=c.toDataURL('image/jpeg',.82);}return e.thumbURL;};
  const memo=new Map();const once=(k,f)=>{let v=memo.get(k);if(!v){v=f();memo.set(k,v);}return v;};
  const tx=(k,w,h,draw)=>once(k,()=>{const c=mkCanvas(w,h),t=mkTex(c),x=c.getContext('2d');const d=()=>{x.save();draw(x,c);x.restore();t.needsUpdate=true;};d();keep(c,d);t.userData={redraw:d};return t;});
  A.spine=rel=>tx('spine:'+rel.id,64,512,(x)=>{const e=A.cover(rel);
    x.fillStyle=e.color;x.fillRect(0,0,64,512);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(0,0,5,512);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(56,0,8,512);
    x.fillStyle='#f2b84b';x.fillRect(8,10,48,5);x.fillRect(8,497,48,5);
    x.translate(32,256);x.rotate(Math.PI/2);x.textAlign='left';x.textBaseline='middle';x.fillStyle='#fff8e8';
    x.font=`800 34px ${F}`;const t=fitText(x,rel.title.toUpperCase(),300);x.fillText(t,-232,2);const w=x.measureText(t).width;
    x.font=`500 26px ${F}`;x.fillStyle='rgba(255,248,232,.78)';if(rel.artist)x.fillText(fitText(x,rel.artist,440-w),-232+w+18,2);});
  function drawBack(c,rel,sq){const x=c.getContext('2d'),W=c.width,H=c.height;
    x.fillStyle='#efe6d2';x.fillRect(0,0,W,H);x.fillStyle='rgba(120,90,40,.06)';for(let i=0;i<40;i++)x.fillRect(0,(hash(rel.id+i)%H),W,1);
    x.fillStyle='#1c1814';x.textBaseline='alphabetic';x.font=`800 ${W*.052}px ${F}`;let y=wrapText(x,rel.title,W*.06,H*.105,W*.88,W*.058,2);
    x.font=`500 ${W*.036}px ${F}`;x.fillStyle='#6b4a1e';x.fillText(fitText(x,(rel.artist||'—')+'  ·  '+typeName(rel.type)+'  ·  '+fmt(rel.seconds),W*.88),W*.06,y+W*.004);y+=W*.03;
    x.fillStyle='#1c1814';x.fillRect(W*.06,y,W*.88,2);y+=W*.012;
    const n=rel.tracks.length,avail=H*(sq?.66:.62)-y+H*.1,lh=Math.min(W*.062,avail/n);
    rel.tracks.forEach(t=>{y+=lh;x.font=`700 ${lh*.52}px ${F}`;x.fillStyle='#1c1814';x.textAlign='left';x.fillText(String(t.n).padStart(2,'0'),W*.06,y);
      x.fillText(fitText(x,t.title,W*.5),W*.125,y);x.font=`500 ${lh*.44}px ${F}`;x.fillStyle='#5a5148';x.textAlign='right';x.fillText(fmt(t.seconds)+'   #'+t.id,W*.94,y);x.textAlign='left';});
    const by=H*.86;x.fillStyle='#1c1814';let bx=W*.62;const r=rng(hash(rel.id));while(bx<W*.93){const w=1+Math.floor(r()*4);x.fillRect(bx,by,w,H*.085);bx+=w+1+Math.floor(r()*4);}
    x.font=`600 ${W*.024}px ${F}`;x.fillStyle='#5a5148';x.fillText('XTRATA MUSIC · PERMANENT ON-CHAIN RECORDS & CDS',W*.06,by+H*.03);
    x.fillText(rel.id+(rel.from?'  ·  from '+rel.from:''),W*.06,by+H*.062);
    if(rel.flags&&rel.flags.length)x.fillText(fitText(x,rel.flags.join(' · '),W*.5),W*.06,by+H*.094);
  }
  A.rear=rel=>tx('rear:'+rel.id,640,563,(x,c)=>drawBack(c,rel,false));
  A.jacketBack=rel=>tx('jback:'+rel.id,512,512,(x,c)=>drawBack(c,rel,true));
  A.disc=rel=>tx('disc:'+rel.id,512,512,(x)=>{x.drawImage(A.cover(rel).canvas,0,0,512,512);
    x.fillStyle='rgba(8,8,10,.42)';x.fillRect(0,0,512,512);
    x.fillStyle='#d9dde2';x.beginPath();x.arc(256,256,74,0,7);x.fill();x.fillStyle='#8d949c';x.beginPath();x.arc(256,256,34,0,7);x.fill();x.fillStyle='#17181a';x.beginPath();x.arc(256,256,30,0,7);x.fill();
    x.fillStyle='#fff';x.textAlign='center';x.font=`800 30px ${F}`;x.fillText(fitText(x,rel.title,330),256,120);x.font=`500 22px ${F}`;x.fillText(fitText(x,rel.artist||'',300),256,152);
    x.font=`600 17px ${F}`;x.fillText('XTRATA MUSIC · COMPACT DISC',256,420);});
  A.groove=()=>tx('groove',1024,1024,(x)=>{x.fillStyle='#050506';x.fillRect(0,0,1024,1024);
    const r=rng(77);for(let rad=505;rad>190;rad-=1.6){const gap=r()<.02;x.strokeStyle=gap?'#020202':`rgba(${60+r()*50|0},${60+r()*50|0},${66+r()*50|0},${.35+r()*.4})`;x.lineWidth=gap?3:1;x.beginPath();x.arc(512,512,rad,0,7);x.stroke();}
    for(let i=0;i<4;i++){const g=x.createConicGradient?x.createConicGradient(i*Math.PI/2+.4,512,512):null;if(!g)break;g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.035,'rgba(255,255,255,.2)');g.addColorStop(.07,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(512,512,505,0,7);x.fill();}
    x.fillStyle='#070707';x.beginPath();x.arc(512,512,190,0,7);x.fill();});
  // generic text panel texture
  A.panel=(w,h,draw)=>{const c=mkCanvas(w,h),x=c.getContext('2d');draw(x,w,h);const t=mkTex(c);t.userData={canvas:c,redraw:null};keep(c,()=>{x.save();draw(x,w,h);x.restore();if(t.userData.redraw)t.userData.redraw();t.needsUpdate=true;});return t;};
  A.neon=(text,sub,col='#f2b84b',w=1024,h=160)=>A.panel(w,h,(x)=>{x.fillStyle='#0d0b0a';x.fillRect(0,0,w,h);x.strokeStyle='rgba(242,184,75,.5)';x.lineWidth=3;x.strokeRect(6,6,w-12,h-12);
    x.textAlign='center';x.textBaseline='middle';x.shadowColor=col;x.shadowBlur=22;x.fillStyle=col;x.font=`800 ${h*.38}px ${F}`;let fs=h*.38;while(x.measureText(text).width>w*.92&&fs>10){fs-=2;x.font=`800 ${fs}px ${F}`;}
    x.fillText(text,w/2,sub?h*.38:h*.5);x.fillText(text,w/2,sub?h*.38:h*.5);
    if(sub){x.shadowColor='#58d7e8';x.fillStyle='#9eeaf4';fs=h*.2;x.font=`600 ${fs}px ${F}`;while(x.measureText(sub).width>w*.92&&fs>8){fs-=1;x.font=`600 ${fs}px ${F}`;}x.fillText(sub,w/2,h*.76);}});
  A.card=(text,sub,bg='#efe6d2',fg='#1c1814',w=512,h=128)=>A.panel(w,h,(x)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=4;x.strokeRect(5,5,w-10,h-10);x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';
    let fs=h*.4;x.font=`800 ${fs}px ${F}`;while(x.measureText(text).width>w*.9&&fs>8){fs-=2;x.font=`800 ${fs}px ${F}`;}x.fillText(text,w/2,sub?h*.4:h*.52);if(sub){x.font=`600 ${h*.17}px ${F}`;x.fillText(fitText(x,sub,w*.9),w/2,h*.76);}});
  return A;
}
