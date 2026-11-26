import * as THREE from 'three';
import {esc,fmt,typeName} from './util.js';

export function initUI(app){
  const $=id=>document.getElementById(id),U={};app.ui=U;const art=app.art,cat=app.catalog;
  const hud=$('hud'),modal=$('modal'),box=$('modalBox'),stationEl=$('station'),mini=$('mini'),tipEl=$('tip'),toasts=$('toasts'),cue=$('cuetag');
  $('counts').textContent=`${cat.releases.length} releases · ${cat.albums.length} albums/EPs · ${cat.singles.length} singles · ${cat.trackCount} tracks · every title on CD + vinyl`;
  U.toast=m=>{const d=document.createElement('div');d.className='toast';d.textContent=m;d.setAttribute('role','status');toasts.appendChild(d);while(toasts.children.length>3)toasts.firstChild.remove();setTimeout(()=>d.classList.add('out'),3400);setTimeout(()=>d.remove(),3900);U.lastToast=m;};
  app.toast=U.toast;
  let tipId=null;
  U.tip=t=>{const id=t?t.id+'|'+t.title+'|'+t.sub:null;if(id===tipId)return;tipId=id;if(!t){tipEl.hidden=true;return;}tipEl.hidden=false;tipEl.innerHTML=`<b>${esc(t.title)}</b><span>${esc(t.sub||'')}</span><i>${esc(t.hint||'')}</i>`;};
  // contextual station panel
  let stAct=null,stPitch=null,stHTML='';
  U.station=(html,onAct,onPitch)=>{stAct=onAct;stPitch=onPitch;if(html!==stHTML){const f=document.activeElement&&stationEl.contains(document.activeElement)?document.activeElement.dataset.s:null;stHTML=html;stationEl.innerHTML=html;if(f){const b=stationEl.querySelector(`[data-s="${f}"]`);if(b)b.focus();}}stationEl.hidden=false;};
  U.stationHide=()=>{stationEl.hidden=true;stHTML='';stationEl.innerHTML='';};
  stationEl.addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(b&&stAct){app.audioInit();stAct(b.dataset.s);}});
  stationEl.addEventListener('input',e=>{if(e.target.matches('[data-pitch]')&&stPitch)stPitch(+e.target.value);});
  const v3=new THREE.Vector3();
  U.cueTag=(text,obj)=>{if(!text){cue.hidden=true;return;}obj.getWorldPosition(v3);v3.project(app.camera);cue.hidden=false;if(cue.textContent!==text)cue.textContent=text;};
  // ---------- HUD ----------
  const JUMPS=['Entrance','CD Wall','CD Player','Vinyl Crates','Turntable','Checkout','Window','Audionaut Booth'];
  $('jumps').innerHTML=JUMPS.map((j,i)=>`<button data-jump="${j}" title="${j} (${i+1})">${j==='Entrance'?'Entrance / Reset':j}</button>`).join('');
  function renderHUD(){const s=app.state;$('bCrate').textContent='Crate ('+app.shop.crate.length+')';{const wl=app.room.weatherLabel();$('bWeather').textContent=wl;$('bWeather').title='Outside: live local time & weather, Late-Night Rain, or Golden Hour';$('bWeather').setAttribute('aria-label','Outside: '+wl+'. Click to change.');}
    if(app.radio){const r=app.radio,n=r.now;$('bRadio').textContent='📻 Radio: '+(!r.available?'Off-air':r.on?'On':'Off');$('bRadio').setAttribute('aria-pressed',!!r.on);$('radioNow').textContent=r.on&&n?'Shop radio — '+(n.artist||'Xtrata')+' · '+n.title:'';}$('bLook').textContent='Mouse Look: '+(s.mouseLook?'On':'Off');$('bLook').setAttribute('aria-pressed',s.mouseLook);$('zone').textContent=s.zone||'';
    const c=app.carry,ce=$('carry');document.body.classList.toggle('carry-on',!!c);if(c){ce.hidden=false;ce.innerHTML=`<span>Carrying: <b>${esc(c.rel.title)}</b> · ${c.kind==='cd'?'CD':c.rel.vinyl+'-inch sleeve'}</span><button data-act="retcarry">Return to its ${c.kind==='cd'?'case':'crate'}</button>`;}else ce.hidden=true;}
  U.renderHUD=renderHUD;
  hud.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;app.audioInit();
    if(b.dataset.jump){app.jump(b.dataset.jump);b.blur();return;}
    const a=b.dataset.act;if(a==='find')U.openFinder('');else if(a==='crate')U.openCrate();else if(a==='shuffle')app.shop.shuffle((Math.random()*2**32)>>>0);else if(a==='weather')app.room.nextWeather();else if(a==='radio')app.radio.toggle();
    else if(a==='look')app.setMouseLook(!app.state.mouseLook);else if(a==='help')U.openHelp();else if(a==='retcarry')app.returnCarry();
    if(a!=='find'&&a!=='crate'&&a!=='help')b.blur();});
  for(const ev of ['weather','crate','carry','zone','mode','look','radio'])app.on(ev,renderHUD);
  // ---------- modal ----------
  let onClose=null,lastFocus=null;
  U.modal=(name,html,o={})=>{app.cancelInputs();if(document.pointerLockElement)document.exitPointerLock();lastFocus=document.activeElement;app.state.modal=name;box.className=o.wide?'wide':'';box.innerHTML=`<button class="x" data-m="close" aria-label="Close">✕</button>`+html;modal.hidden=false;onClose=o.onClose||null;
    for(const el of [hud,$('insp'),stationEl,mini])el.inert=true;box.setAttribute('aria-label',o.label||name);const f=box.querySelector('[autofocus]')||box.querySelector('button:not(.x),input');if(f)f.focus();app.emit('mode');};
  U.closeModal=()=>{if(modal.hidden)return;modal.hidden=true;box.innerHTML='';app.state.modal=null;for(const el of [hud,$('insp'),stationEl,mini])el.inert=false;if(onClose)onClose();onClose=null;if(lastFocus&&lastFocus.blur)lastFocus.blur();app.emit('mode');};
  modal.addEventListener('pointerdown',e=>{if(e.target===modal)U.closeModal();});
  modal.addEventListener('keydown',e=>{if(e.key==='Tab'){const f=[...box.querySelectorAll('button,input,a[href],select,textarea')].filter(x=>!x.disabled);if(!f.length)return;const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}});
  let handler=null;
  box.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;if(b.dataset.m==='close')return U.closeModal();if(handler)handler(b.dataset.m,b);});
  // ---------- finder ----------
  U.openFinder=(q='',filter='all')=>{let cur=filter;
    U.modal('finder',`<h2>Find a release</h2><p class="dim small">Search titles, artists, formats, release IDs, origins and every track title or ID. Use <b>#digits</b> for an exact inscription ID.</p>
<input id="fq" type="search" placeholder="e.g. Matrimonial · Cicada · single · #3089" autocomplete="off" autofocus aria-label="Search the catalogue" value="${esc(q)}">
<div class="chips" id="fchips"></div><div id="fres" aria-live="polite"></div>`,{wide:true,label:'Finder'});
    const inp=$('fq'),res=$('fres'),chips=$('fchips');
    const draw=()=>{chips.innerHTML=Object.entries(app.shop.filters).map(([k,v])=>`<button data-m="f:${k}" class="${k===cur?'on':''}" aria-pressed="${k===cur}">${v}</button>`).join('');
      const r=app.shop.search(inp.value,cur);U.lastResults=r;
      res.innerHTML=`<p class="dim small">${r.length} of ${cat.releases.length} releases</p>`+(r.length?r.map(({rel,tracks})=>{const loadedCD=app.cd.state!=='none'&&app.cd.rel===rel&&app.cd.state!=='carried',onDeck=app.vinyl.b.rel===rel;
        return `<div class="res"><img alt="" src="${art.thumb(art.cover(rel))}"><div><b>${esc(rel.title)}</b><span>${esc(rel.artist||'—')} · ${typeName(rel.type)} · ${rel.tracks.length} trk · ${fmt(rel.seconds)}</span><span class="dim">${esc(rel.id)}${rel.from?' · from “'+esc(rel.from)+'”':''} · CD + ${rel.vinyl}-inch</span>
${tracks.length?`<span class="hit">${tracks.map(t=>'#'+t.id+' '+esc(t.title)).join(' · ')}</span>`:`<span class="dim">${rel.tracks.map(t=>'#'+t.id).join(' ')}</span>`}</div>
<div class="rb"><button data-m="cd:${rel.id}">${loadedCD?'Go to CD Player':'Go to CD'}</button><button data-m="vinyl:${rel.id}">${onDeck?'Go to Turntable':'Go to Vinyl'}</button><button data-m="inspect:${rel.id}" class="gold">Inspect</button></div></div>`;}).join(''):'<p>No matches. Every release stays discoverable — clear the search or choose “Everything”.</p>');};
    inp.addEventListener('input',draw);inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&U.lastResults&&U.lastResults[0]){const rel=U.lastResults[0].rel;U.closeModal();cur==='v12'||cur==='v7'?app.shop.routeVinyl(rel):app.shop.routeCD(rel);}});
    handler=(m)=>{const [k,id]=m.split(/:(.*)/);if(k==='f'){cur=id;draw();inp.focus();return;}const rel=app.relById[id];U.closeModal();if(k==='cd')app.shop.routeCD(rel);else if(k==='vinyl')app.shop.routeVinyl(rel);else app.shop.openRelease(rel);};
    draw();};
  // ---------- crate + receipt ----------
  U.openCrate=()=>{const S=app.shop;const draw=()=>{const items=S.crate.map(c=>({c,r:app.relById[c.id]}));
      box.querySelector('#cbody').innerHTML=(S.storageNote?`<p class="dim small">${esc(S.storageNote)}</p>`:'')+(items.length?items.map(({c,r})=>`<div class="res"><img alt="" src="${art.thumb(art.cover(r))}"><div><b>${esc(r.title)}</b><span>${esc(r.artist||'—')} · ${typeName(r.type)} · ${c.format==='cd'?'CD':r.vinyl+'-inch vinyl'}</span><span class="dim">${r.tracks.map(t=>'#'+t.id).join(' ')} · ${fmt(r.seconds)}</span></div><div class="rb"><button data-m="rm:${c.format}:${r.id}" aria-label="Remove ${esc(r.title)} ${c.format}">Remove</button></div></div>`).join(''):'<p>Your Crate List is empty. Open any CD case or vinyl sleeve and choose “Add to Crate”.</p>')
        +`<p class="dim small">${items.length} item${items.length===1?'':'s'} · ${items.reduce((a,i)=>a+i.r.tracks.length,0)} tracks. This is a catalogue reference list only — no payment is taken and nothing is purchased here.</p>`;
      box.querySelector('[data-m="receipt"]').disabled=!items.length;box.querySelector('[data-m="clear"]').disabled=!items.length;};
    U.modal('crate',`<h2>Crate List</h2><div id="cbody"></div><div class="btns"><button data-m="receipt" class="gold" autofocus>Create reference receipt</button><button data-m="clear">Clear list</button><button data-m="close">Keep browsing</button></div>`,{wide:true,label:'Crate List'});
    handler=(m)=>{if(m==='receipt')return U.openReceipt();if(m==='clear'){S.clearCrate();return draw();}const [k,f,id]=m.split(/:(.+?):(.*)/);if(k==='rm'){S.toggleCrate(app.relById[id],f);draw();}};draw();};
  U.openReceipt=()=>{const R=app.shop.receipt();U.lastReceipt=R;
    const text=()=>[`XTRATA MUSIC — THE RECORD SHOP`,`Reference receipt ${R.receipt_id}`,R.created_local+' ('+R.created_at+')',`Network: ${R.network} · ${R.platform} · status: ${R.status}`,'',...R.items.flatMap((i,n)=>[`${n+1}. ${i.title} — ${i.artist||'—'} [${i.type} · ${i.format}]`,...i.tracks.map(t=>`     ${String(t.n).padStart(2,'0')} #${t.id}  ${t.title}  (${fmt(t.seconds)})`)]),'',`Total: ${R.totals.items} items · ${R.totals.tracks} tracks`,`payment: none · transaction: none`,R.note].join('\n');
    U.modal('receipt',`<div id="receipt"><h2>XTRATA MUSIC</h2><p class="rc">THE RECORD SHOP · PERMANENT ON-CHAIN RECORDS & CDS</p><p class="rc"><b>REFERENCE RECEIPT</b> ${esc(R.receipt_id)}<br>${esc(R.created_local)}</p><hr>
${R.items.map(i=>`<div class="ri"><b>${esc(i.title)}</b><span>${esc(i.artist||'—')} · ${typeName(i.type)} · ${esc(i.format)}</span><ol>${i.tracks.map(t=>`<li value="${t.n}"><span>${esc(t.title)}</span><i>#${t.id} · ${fmt(t.seconds)}</i></li>`).join('')}</ol></div>`).join('')}
<hr><p class="rc"><b>${R.totals.items} item${R.totals.items===1?'':'s'} · ${R.totals.tracks} tracks</b></p><p class="rc small">Stacks · Xtrata · status: catalogue-reference-only<br>payment: none · transaction_id: none</p><p class="rc small">${esc(R.note)}</p></div>
<div class="btns noprint"><button data-m="copy" autofocus>Copy</button><button data-m="print">Print</button><button data-m="json" class="gold">Export JSON</button><button data-m="back">Back to Crate List</button></div><p id="rmsg" class="dim small noprint" aria-live="polite"></p>`,{label:'Reference receipt'});
    const msg=t=>{$('rmsg').textContent=t;};
    handler=async m=>{if(m==='back')return U.openCrate();
      if(m==='copy'){const t=text();U.lastCopy=t;try{await navigator.clipboard.writeText(t);msg('Receipt copied to the clipboard.');}catch(e){const ta=document.createElement('textarea');ta.value=t;box.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy');}catch(e2){}ta.remove();msg(ok?'Receipt copied to the clipboard.':'Clipboard is blocked here — select the receipt text and copy it manually.');}}
      else if(m==='print'){document.body.classList.add('printing');try{window.print();}catch(e){}setTimeout(()=>document.body.classList.remove('printing'),400);}
      else if(m==='json'){const json=JSON.stringify(R,null,2);U.lastJSON=json;try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([json],{type:'application/json'}));a.download=R.receipt_id+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);msg('Exported '+R.receipt_id+'.json');}catch(e){msg('Download blocked — use Copy instead.');}}};};
  U.openPoster=p=>{const c=p.content,url=p.canvas.toDataURL('image/jpeg',.9),r=c.type==='release'||c.type==='track'?c.rel:null,pr=c.type==='print'?c.print:null;
    // A poster is first of all a print you might buy. Prints are not on sale yet, so the main action is shown but switched off.
    const cta=who=>`<div class="printcta"><button class="printbtn" disabled aria-disabled="true">Buy this poster as a print<small>Not available yet</small></button><p class="dim small">Prints go on sale once ${who} has signed a print collection for this artwork and set a price. Nothing can be bought here today.</p></div>`;
    let head,links,extra='';
    if(r){const ti=c.t?Math.max(0,r.tracks.indexOf(c.t)):0,kind=typeName(r.type);
      head=`<p class="tag">${esc(c.tag||'Cover art')}</p><h2>${esc(c.t?c.t.title:r.title)}</h2><p>${esc(r.artist||'—')} · ${c.t&&c.t.title!==r.title?'from “'+esc(r.title)+'” · ':''}${kind}</p>`;
      links=`<button data-m="play:${ti}" autofocus>▶ Play the music</button><button data-m="open">${kind} on CD</button><button data-m="vinyl">${kind} on ${r.vinyl}-inch vinyl</button>`;
      if(r.tracks.length>1)extra=`<ol class="trk mini">${r.tracks.map((t,i)=>`<li><button data-m="play:${i}" aria-label="Open the CD and play track ${t.n}"><span><b>${t.n}. ${esc(t.title)}</b><i>${fmt(t.seconds)}</i></span></button></li>`).join('')}</ol>`;
      U.modal('poster',`<div class="poster"><img alt="Poster: ${esc(r.title)}" src="${url}"><div>${head}${cta(esc(r.artist||'the artist'))}<p class="plabel">Or go to the music</p><div class="plinks">${links}</div>${extra}</div></div>`,{wide:true,label:'Poster'});
      handler=m=>{U.closeModal();if(m==='open')app.shop.openRelease(r);else if(m==='vinyl')app.shop.routeVinyl(r);else if(m.startsWith('play:'))app.shop.openRelease(r,+m.slice(5));};}
    else if(pr){head=`<p class="tag">${pr.found?'Found at random on the chain':'Inscribed artwork'}</p><h2>${esc(pr.title||(pr.found?c.head:'Inscription #'+pr.id))}</h2><p>Inscription #${pr.id} on Xtrata${pr.creator?' · inscribed by '+(pr.creatorName?'<b>'+esc(pr.creatorName)+'</b> <span class="dim small">('+esc(pr.creator.slice(0,5)+'…'+pr.creator.slice(-4))+')</span>':esc(pr.creator)):''}</p>`;
      U.modal('poster',`<div class="poster"><img alt="Inscribed artwork #${pr.id}" src="${url}"><div>${head}${cta(pr.creatorName?esc(pr.creatorName):'its artist')}<div class="plinks"><a href="https://xtrata.xyz/i/${pr.id}" target="_blank" rel="noopener">View inscription #${pr.id}</a><button data-m="find" autofocus>Browse the catalogue</button></div></div></div>`,{wide:true,label:'Poster'});
      handler=m=>{if(m==='find')U.openFinder('');};}
    else{U.modal('poster',`<div class="poster"><img alt="Xtrata poster" src="${url}"><div><p class="tag">Xtrata</p><h2>${esc(c.slogan[0])}</h2><p>${esc(c.slogan[1])}</p>${cta('Xtrata')}<div class="plinks"><button data-m="find" autofocus>Browse the catalogue</button></div></div></div>`,{wide:true,label:'Poster'});
      handler=m=>{if(m==='find')U.openFinder('');};}};
  const HELP=`<ul class="help"><li><b>Look</b> — click once, then just move the mouse (no dragging). <b>Esc</b> frees the pointer.</li><li><b>Walk</b> — WASD or arrow keys. Quick-jump buttons travel along clear aisles.</li><li><b>Aim + click</b> — the small centre dot is your hand. Click a CD spine or sleeve to pull it out; <b>E</b> grabs a vinyl sleeve.</li>
<li><b>CDs</b> — click the cover to open the case, click a track artwork to audition it, <b>T</b> takes the disc to the CD Player.</li><li><b>Vinyl</b> — carry a sleeve to the Turntable, click the glowing pad, click the sleeve, then hold the record with the mouse and drop it on the platter. Grab the headshell, swing it over the grooves and let go.</li>
<li><b>Audionaut booth</b> — just walk up and aim: click the Play button, any step on the console screen, a Paper Play card to load it or a stem to mute it. The booth panel appears bottom-left while you are there.</li>
<li><b>/</b> Find · <b>B</b> Crate List · <b>M</b> Mouse Look · <b>1–8</b> zone jumps · <b>H</b> this help.</li></ul><p class="dim small">Songs and artwork stream from each track’s on-chain Xtrata player when you are online. CDs are free 30-second previews; vinyl plays each side in full. Offline, the shop runs a demo timer with handling foley only.</p>`;
  U.openBooth=()=>{U.modal('booth',`<h2>The Audionaut booth</h2><p>A 16-step sequencer you can play right here in the shop. Pick a Paper Play card, change any step on the console screen or in the panel, and mute the stems on the right-hand wall.</p>
<p>Everything is synthesised live in your browser. Nothing here is saved, inscribed or paid for, and the shop radio goes quiet while the booth is playing.</p>
<p>The full Audionaut — the Blockchain Audional Work-Space-Station that the Audionauts unlock — is at <b>xtrata.xyz/audionaut</b>.</p>
<div class="btns"><a class="btnlink gold" href="${app.STUDIO_URL}" target="_blank" rel="noopener">Open xtrata.xyz/audionaut ↗</a><button data-m="close" autofocus>Back to the booth</button></div>`,{label:'The Audionaut booth'});handler=null;};
  U.openHelp=()=>{U.modal('help','<h2>How the shop works</h2>'+HELP+'<div class="btns"><button data-m="close" autofocus>Back to the shop</button></div>',{label:'Help'});handler=null;};
  $('introHelp').innerHTML=HELP;
  // ---------- mini-player ----------
  let seeking=false,miniKey='';
  function renderMini(full){const pb=app.playback.s;document.body.classList.toggle('mini-on',!!pb.rel);if(!pb.rel){mini.hidden=true;miniKey='';return;}const t=pb.rel.tracks[pb.idx],key=pb.rel.id+'|'+pb.idx+'|'+pb.playing+'|'+pb.source+'|'+app.vinyl.b.rpm+'|'+app.playback.status();
    if(key!==miniKey||full){miniKey=key;mini.hidden=false;const pv=app.playback.previewLimit?' · '+app.playback.previewLimit+'s PREVIEW':'',src=pb.source==='vinyl'?'VINYL · '+(app.vinyl.b.rpm===45?'45':'33⅓')+' RPM · FULL PLAY':pb.source==='cd-deck'?'CD PLAYER'+pv:'CD CASE AUDITION'+pv;
      mini.innerHTML=`<img alt="" src="${art.thumb(art.track(pb.rel,t))}"><div class="mi"><span class="src">${src}</span><b>${t.n}. ${esc(t.title)}</b><span>${esc(pb.rel.title)} · ${esc(pb.rel.artist||'—')} · #${t.id}</span></div>
<div class="mt"><span id="mEl">${fmt(pb.elapsed)}</span><input id="mSeek" type="range" min="0" max="${t.seconds}" step="0.1" value="${pb.elapsed}" aria-label="Seek within track"><span>${fmt(t.seconds)}</span></div>
<div class="mb"><button data-p="prev" aria-label="Previous track">⏮</button><button data-p="toggle" class="gold" aria-label="${pb.playing?'Pause':'Play'}">${pb.playing?'❚❚':'▶'}</button><button data-p="next" aria-label="Next track">⏭</button><button data-p="station">Return to playing station</button></div>
<p class="st">${esc(app.playback.status())}</p>`;}
    else if(!seeking){const e=$('mEl'),s=$('mSeek');if(e)e.textContent=fmt(pb.elapsed);if(s)s.value=pb.elapsed;}}
  app.on('playback',()=>renderMini());app.on('tick',()=>renderMini());app.on('vinyl',()=>renderMini());app.on('art',()=>{miniKey='';renderMini();});
  mini.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;app.audioInit();const a=b.dataset.p,P=app.playback;if(a==='toggle')P.toggle();else if(a==='prev')P.prev();else if(a==='next')P.next();else if(a==='station')app.goToPlaying();b.blur();});
  mini.addEventListener('input',e=>{if(e.target.id==='mSeek'){seeking=true;$('mEl').textContent=fmt(+e.target.value);}});
  mini.addEventListener('change',e=>{if(e.target.id==='mSeek'){seeking=false;app.playback.seek(+e.target.value);e.target.blur();}});
  U.renderMini=renderMini;renderHUD();
  return U;
}
