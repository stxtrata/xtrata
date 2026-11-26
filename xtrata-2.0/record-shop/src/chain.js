import {clamp} from './util.js';
// Streams each track straight from its on-chain Xtrata player inscription (https://xtrata.xyz/i/<inscription id>).
// A player is an HTML document that either embeds its audio + cover as base64 data URIs, or points at other
// inscriptions ("recursive" players). Nothing here is required: offline, the shop falls back to the demo timer.
export function initChain(app){
  const qs=new URLSearchParams(location.search),cfg=window.XTRATA_SHOP_CONFIG||{},P=app.playback,art=app.art,cat=app.catalog;
  const C={enabled:!qs.has('offline')&&cfg.stream!==false,base:String(cfg.contentBase||'https://xtrata.xyz/i/'),state:'idle',id:null,pct:0,error:null,artDone:0,artFail:0};
  app.chain=C;if(!C.enabled)return C;
  const urlOf=id=>C.base+id;
  const attr=(html,re)=>{const m=re.exec(html);return m?m[1].replace(/&amp;/g,'&'):null;};
  const audioSrc=h=>attr(h,/<source\b[^>]*?\ssrc="([^"]+)"[^>]*?type="audio\//i)||attr(h,/<audio\b[^>]*?\ssrc="([^"]+)"/i)||attr(h,/\ssrc="(data:audio\/[^"]+)"/i);
  const imageSrc=h=>attr(h,/<img\b[^>]*?\ssrc="((?:data:image\/|https?:\/\/)[^"]+)"/i);
  const depId=src=>{const m=/\/(?:inscription|i|content)\/(\d+)(?:[/?#]|$)/.exec(src);return m?m[1]:null;};
  function dataToBlobUrl(uri){const i=uri.indexOf(','),mime=uri.slice(5,i).replace(/;base64$/i,''),bin=atob(uri.slice(i+1)),n=bin.length,u=new Uint8Array(n);for(let k=0;k<n;k++)u[k]=bin.charCodeAt(k);return URL.createObjectURL(new Blob([u],{type:mime}));}
  async function getText(url,range,onPct){const r=await fetch(url,range?{headers:{Range:'bytes=0-'+(range-1)}}:{});if(!r.ok)throw new Error('HTTP '+r.status);
    if(!onPct||!r.body)return r.text();const total=+(r.headers.get('content-length')||r.headers.get('x-xtrata-runtime-total-size')||0),rd=r.body.getReader(),parts=[];let got=0;
    for(;;){const {done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;if(total)onPct(Math.min(99,Math.round(got/total*100)));}return new Blob(parts).text();}
  // ---------- audio ----------
  const el=new Audio();el.preload='auto';try{el.preservesPitch=false;el.mozPreservesPitch=false;el.webkitPreservesPitch=false;}catch(e){}
  C.el=el;let cur=null,mode=null,ready=false,unlocked=false,lastPct=-10;const full=new Map(),part=new Map();
  C.unlock=()=>{if(unlocked)return;unlocked=true;try{el.muted=true;el.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';const p=el.play();if(p&&p.then)p.then(()=>{if(!cur){el.pause();}el.muted=false;}).catch(()=>{el.muted=false;});else el.muted=false;}catch(e){el.muted=false;}};
  const setState=(st,err)=>{C.state=st;C.error=err||null;app.emit('playback');};
  const b64Blob=(b64,mime)=>{const bin=atob(b64),n=bin.length,u=new Uint8Array(n);for(let k=0;k<n;k++)u[k]=bin.charCodeAt(k);return URL.createObjectURL(new Blob([u],{type:mime}));};
  C.pins=new Set();
  const trim=(map,max,keep)=>{if(map.size<=max)return;const k=[...map.keys()].find(k=>k!==cur&&k!==keep&&!C.pins.has(k));if(k==null)return;const o=map.get(k);map.delete(k);o.then(a=>{if(a&&a.blob)URL.revokeObjectURL(a.url);}).catch(()=>{});};
  // whole song (vinyl, or a CD seek beyond the cued opening)
  function loadFull(id){let p=full.get(id);if(p)return p;
    p=(async()=>{const html=await getText(urlOf(id),0,pct=>{if(cur===id&&pct-lastPct>=4){lastPct=pct;C.pct=pct;app.emit('playback');}}),src=audioSrc(html);
      if(!src)throw new Error('no audio found in the player');if(src.startsWith('data:'))return {url:dataToBlobUrl(src),blob:true,kind:'embedded',safe:1e9};
      const d=depId(src);return {url:d?urlOf(d):src,blob:false,kind:d?'recursive #'+d:'linked',safe:1e9};})();
    full.set(id,p);p.catch(()=>full.delete(id));trim(full,4,id);return p;}
  // quick cue: only the opening of the song (the start of the player file), enough for a CD preview to begin at once
  const CUE_BYTES=1500000;
  async function getRange(url,n){const r=await fetch(url,{headers:{Range:'bytes=0-'+(n-1)}});if(!r.ok)throw new Error('HTTP '+r.status);const cr=/\/(\d+)\s*$/.exec(r.headers.get('content-range')||''),total=cr?+cr[1]:+(r.headers.get('x-xtrata-runtime-total-size')||0);return {text:await r.text(),total,whole:r.status===200};}
  function loadCue(id,seconds){let p=part.get(id);if(p)return p;
    p=(async()=>{let n=CUE_BYTES,r=await getRange(urlOf(id),n),m,linked;
      const find=()=>{linked=attr(r.text,/<source\b[^>]*?\ssrc="(https?:\/\/[^"]+)"[^>]*?type="audio\//i)||attr(r.text,/<audio\b[^>]*?\ssrc="(https?:\/\/[^"]+)"/i);m=/\ssrc="data:(audio\/[^",]*?)(?:;base64)?,/i.exec(r.text);};find();
      if(!linked&&(!m||(r.text.length-(m.index+m[0].length)<260000&&r.text.indexOf('"',m.index+m[0].length)<0))&&!r.whole&&r.text.length>=n-8){n=m?m.index+m[0].length+1100000:3000000;r=await getRange(urlOf(id),n);find();}
      if(linked){const d=depId(linked);return {url:d?urlOf(d):linked,blob:false,kind:d?'recursive #'+d:'linked',safe:1e9};}
      if(!m)return null;const st=m.index+m[0].length,end=r.text.indexOf('"',st);
      if(end>=0)return {url:b64Blob(r.text.slice(st,end),m[1]),blob:true,kind:'embedded',safe:1e9};            // short song: the cue is the whole thing
      let b=r.text.slice(st).replace(/[^A-Za-z0-9+/]/g,'');b=b.slice(0,b.length-b.length%4);const all=r.total?r.total-st:0;
      const safe=all>0?b.length/all*seconds*.9-1.5:8;if(safe<4)return null;return {url:b64Blob(b,m[1]),blob:true,kind:'embedded',safe,cue:true};})();
    part.set(id,p);p.catch(()=>part.delete(id));trim(part,24,id);return p;}
  C.cue=loadCue;
  C.prefetch=id=>{if(C.enabled&&id!=null)loadFull(id).catch(()=>{});};
  // as soon as a CD case is picked up, cue the opening of every song on it (two at a time, in track order)
  const cued=new Map();C.cueInfo=rel=>cued.get(rel.id)||null;
  C.cueDisc=rel=>{if(!C.enabled||cued.has(rel.id))return;const info={ready:0,failed:0,total:rel.tracks.length};cued.set(rel.id,info);const q=rel.tracks.slice();
    const w=async()=>{for(;;){const t=q.shift();if(!t)return;try{const a=full.has(t.id)?await full.get(t.id):await loadCue(t.id,t.seconds);a?info.ready++:info.failed++;}catch(e){info.failed++;}app.emit('cue');}};w();w();};
  const curTrack=()=>P.s.rel?P.s.rel.tracks[P.s.idx]:null;
  const LIM=()=>P.previewLimit||0;
  // how far into the song the current play may run before it needs more than the cued opening
  const reach=s=>s.source==='vinyl'||!LIM()?1e9:s.elapsed+Math.max(0,LIM()-(s.preview>=LIM()?0:s.preview))+1;
  function attach(id,a,m){return new Promise((res,rej)=>{if(cur!==id)return res(null);const ok=()=>{off();res(a);},bad=()=>{off();rej(new Error('this browser could not decode the audio'));},off=()=>{el.removeEventListener('loadedmetadata',ok);el.removeEventListener('error',bad);};
    el.addEventListener('loadedmetadata',ok);el.addEventListener('error',bad);mode=m;el.src=a.url;el.load();});}
  function begin(t,wantFull){const id=t.id;el.pause();cur=id;ready=false;C.id=id;C.pct=0;lastPct=-10;setState('loading');
    const pick=wantFull||full.has(id)?loadFull(id).then(a=>[a,'full']):loadCue(id,t.seconds).catch(()=>null).then(a=>a&&reach(P.s)<=a.safe?[a,a.cue?'cue':'full']:loadFull(id).then(f=>[f,'full']));
    pick.then(([a,m])=>cur===id?attach(id,a,m):null)
      .then(a=>{if(cur!==id||!a)return;ready=true;C.kind=a.kind;C.safe=a.safe;const s2=P.s;try{el.currentTime=clamp(s2.elapsed,0,Math.max(0,(el.duration||1e9)-.05));}catch(e){}setState('stream');sync();})
      .catch(e=>{if(cur!==id)return;ready=false;setState('error',String(e&&e.message||e));if(!C.warned){C.warned=true;app.toast('Could not stream inscription #'+id+' from the chain — running the demo timer instead.');}});}
  function sync(){const s=P.s,t=curTrack();if(!t){el.pause();return;}
    if(cur!==t.id){begin(t,reach(s)>=1e9);return;}
    if(!ready){return;}
    if(mode==='cue'&&reach(s)>C.safe){cur=null;begin(t,true);return;}     // seeking past the cued opening, or moved to vinyl: fetch the whole song
    try{el.playbackRate=clamp(s.rate||1,.5,2);}catch(e){}
    if(s.playing){if(el.paused){if(Math.abs(el.currentTime-s.elapsed)>.25){try{el.currentTime=s.elapsed;}catch(e){}}const p=el.play();if(p&&p.catch)p.catch(e=>{if(cur===t.id&&P.s.playing&&!C.blocked){C.blocked=true;app.toast('The browser blocked audio — click anywhere in the shop, then press play again.');}});}}
    else if(!el.paused)el.pause();}
  const ranOut=()=>{const s=P.s,t=curTrack();if(!t||t.id!==cur||!ready||mode!=='cue')return false;if(s.elapsed>=t.seconds-1.5)return false;cur=null;begin(t,true);return true;}; // cue ended early: carry on with the whole song
  C.adapter={chain:true,play:sync,pause:sync,setRate:sync,seek(){sync();if(ready){try{el.currentTime=P.s.elapsed;}catch(e){}}}};
  el.addEventListener('ended',()=>{if(ranOut())return;const s=P.s,t=curTrack();if(t&&t.id===cur&&s.playing&&s.source!=='vinyl')s.elapsed=t.seconds;});
  el.addEventListener('error',()=>{if(ready)ranOut();});
  C.driving=()=>ready&&C.state==='stream'&&!el.paused;
  C.holding=()=>C.state==='loading'&&P.s.playing&&P.s.source!=='vinyl';
  let dT=0;
  C.update=dt=>{const s=P.s,t=curTrack();if(!t||t.id!==cur||!ready||!s.playing||el.paused)return;
    if(s.source!=='vinyl'){if(el.currentTime<t.seconds)s.elapsed=el.currentTime;}
    else{dT+=app.realDt||dt;if(dT>.5){dT=0;if(Math.abs(el.currentTime-s.elapsed)>.35){try{el.currentTime=s.elapsed;}catch(e){}}}}};
  C.status=()=>{const t=curTrack(),id=t?t.id:C.id;if(C.state==='loading')return 'Loading inscription #'+id+' from the chain… '+C.pct+'%';
    if(C.state==='error')return 'Demo timer · could not stream inscription #'+id+' from xtrata.xyz ('+C.error+'). Foley only.';
    return 'Streaming from the on-chain player'+(id!=null?' · inscription #'+id:'')+(P.s.source==='vinyl'?' · full play on vinyl':P.previewLimit?' · free '+P.previewLimit+'-second CD preview':'');};
  // ---------- artwork (same players; only the first part of each is downloaded) ----------
  const keys=new Map();for(const r of cat.releases)for(const t of r.tracks)if(!cat.images[t.img]){let k=keys.get(t.img);if(!k)keys.set(t.img,k={key:t.img,ids:[],cover:false});k.ids.push(t.id);if(t.img===r.cover)k.cover=true;}
  async function fetchArt(k){let src=null;for(const id of k.ids.slice(0,2)){try{let html=await getText(urlOf(id),400000);if(/\ssrc="data:image\/[^"]*$/.test(html))html=await getText(urlOf(id),2400000);src=imageSrc(html);if(src)break;}catch(e){}}
    if(!src)throw new Error('no image');const d=src.startsWith('data:')?null:depId(src),url=d?urlOf(d):src;
    const im=await new Promise((res,rej)=>{const i=new Image();if(!url.startsWith('data:'))i.crossOrigin='anonymous';i.onload=()=>i.width?res(i):rej(new Error('empty'));i.onerror=()=>rej(new Error('image failed'));i.src=url;});
    const touched=new Set();for(const r of cat.releases){if(r.cover===k.key){art.setImage(art.cover(r),im);touched.add(r);}for(const t of r.tracks)if(t.img===k.key){art.setImage(art.track(r,t),im);touched.add(r);}}
    for(const r of touched)art.refresh(r);C.artDone++;app.emit('art');}
  // an inscribed print for a poster frame: either an image inscription, or a page/player whose first image is used
  C.fetchPrint=async id=>{const r=await fetch(urlOf(id),{headers:{Range:'bytes=0-2399999'}});if(!r.ok)throw new Error('HTTP '+r.status);const ct=(r.headers.get('content-type')||'').toLowerCase();let url,title='';
    if(ct.startsWith('image/'))url=urlOf(id);else{const h=await r.text(),src=imageSrc(h);if(!src)throw new Error('no image in inscription #'+id);const d=src.startsWith('data:')?null:depId(src);url=d?urlOf(d):src;const m=/<title>([^<]{0,120})/i.exec(h);title=m?m[1].trim():'';}
    const im=await new Promise((res,rej)=>{const i=new Image();if(!url.startsWith('data:'))i.crossOrigin='anonymous';i.onload=()=>i.width?res(i):rej(new Error('empty'));i.onerror=()=>rej(new Error('image failed'));i.src=url;});return {id,img:im,title};};
  // random image inscriptions from anywhere on the chain, via the public index (id, mime, size, creator)
  const INDEX=String(cfg.indexUrl||'https://xtrata.xyz/index/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3');let minted=+cfg.indexCount||3000;
  C.randomPrints=async(n,rand=Math.random)=>{const out=[],seen=new Set(),only=Array.isArray(cfg.posterCreators)&&cfg.posterCreators.length?new Set(cfg.posterCreators):null;
    for(let page=0;page<6&&out.length<n;page++){let j;try{const r=await fetch(INDEX+'?from='+(1+Math.floor(rand()*Math.max(1,minted-40)))+'&limit=40&order=asc');if(!r.ok)break;j=await r.json();}catch(e){break;}
      if(j&&j.mintedCount>0)minted=j.mintedCount;const c=(j&&j.tokens||[]).filter(t=>/^image\/(png|jpe?g|webp|gif)$/i.test(t.mime||'')&&t.sealed!==false&&t.totalSize>=12000&&t.totalSize<=2500000&&(!only||only.has(t.creator))).sort(()=>rand()-.5);
      let took=0;for(const t of c){if(took>=2||out.length>=n)break;if(seen.has(t.creator)&&c.length>3&&took>=1)continue;
        try{const im=await new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>i.width>=64&&i.height>=64?res(i):rej(new Error('small'));i.onerror=()=>rej(new Error('image failed'));i.src=urlOf(t.id);});out.push({id:t.id,img:im,title:'',mime:t.mime,size:t.totalSize,creator:t.creator||'',found:true});seen.add(t.creator);took++;}catch(e){}}}
    return out;};
  const queue=[...keys.values()].sort((a,b)=>(b.cover?1:0)-(a.cover?1:0));C.artTotal=queue.length;
  const worker=async()=>{for(;;){const k=queue.shift();if(!k)return;try{await fetchArt(k);}catch(e){C.artFail++;if(C.artFail>=6&&C.artDone===0){queue.length=0;return;}}}}; // offline: give up quietly
  C.startArt=()=>{if(C.artStarted||cfg.art===false)return;C.artStarted=true;worker();worker();worker();};
  C.qa=()=>({enabled:C.enabled,state:C.state,id:C.id,pct:C.pct,error:C.error,ready,cur,mode,safe:C.safe||0,paused:el.paused,time:el.currentTime,duration:el.duration||0,rate:el.playbackRate,srcKind:C.kind||null,src:(el.currentSrc||'').slice(0,40),artDone:C.artDone,artFail:C.artFail,artTotal:C.artTotal});
  return C;
}
