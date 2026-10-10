/* SNES on the big screen. The emulator (the frozen, hash-pinned page) runs in a hidden same-origin frame; this script gives the room
   its picture, buttons and volume, and adds the Games panel. The emulator never talks to the room's wallet or the network. */
(function start(){
 const room=window.BasementLounge;if(!room){setTimeout(start,50);return}
 const $=id=>document.getElementById(id);
 const now=$('snesNow');let hold=0;const say=(t,keep)=>{if(now)now.textContent=t;if(keep)hold=Date.now()+keep};
 let frame,win,X,proxy,pad={};
 function boot(){
  const b64=$('emuB64').textContent.trim();
  if(!b64||b64.startsWith('/*')){say('No emulator is bundled in this build.');return}
  const bin=atob(b64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  const url=URL.createObjectURL(new Blob([bytes],{type:'text/html'}));
  frame=document.createElement('iframe');frame.src=url;frame.title='SNES emulator (hidden; shown on the room screen)';frame.tabIndex=-1;frame.setAttribute('aria-hidden','true');
  frame.allow='autoplay';
  frame.style.cssText='position:fixed;left:0;top:0;width:640px;height:520px;border:0;opacity:.01;pointer-events:none;z-index:-1';
  frame.onload=()=>waitReady(0);document.body.appendChild(frame);
 }
 function waitReady(n){
  try{win=frame.contentWindow;X=win&&win.XtrataSNES;if(X&&win.document.getElementById('cv')&&X.info){attach();return}}catch(e){}
  if(n>200){say('The emulator did not start.');return}
  setTimeout(()=>waitReady(n+1),50);
 }
 function attach(){
  const cv=win.document.getElementById('cv');
  // The room needs a canvas from its own document: mirror the emulator's canvas into one each frame.
  proxy=document.createElement('canvas');proxy.width=512;proxy.height=224;const px=proxy.getContext('2d',{alpha:false});
  room.attachEmulator({
   title:'SNES',canvas:proxy,aspectRatio:4/3,
   beforeFrame(){if(proxy.width!==cv.width||proxy.height!==cv.height){proxy.width=cv.width;proxy.height=cv.height}px.drawImage(cv,0,0)},
   onButton(button,down){if(down)pad[button]=true;else delete pad[button];try{X.setInput(1,pad)}catch(e){}},
   onBlur(){pad={};try{X.setInput(1,{})}catch(e){}},
   setVolume(v){const el=win.document.getElementById('vol');el.value=String(Math.round(Math.max(0,Math.min(1,v))*100));el.dispatchEvent(new win.Event('input'))},
   setMuted(m){try{X.control(m?'mute':'unmute')}catch(e){}},
   resumeAudio(){try{win.dispatchEvent(new win.Event('pointerdown'))}catch(e){}}
  });
  const hint=$('theaterHint');if(hint)hint.innerHTML='ARROWS MOVE &nbsp;·&nbsp; Z B &nbsp; X A &nbsp; A Y &nbsp; S X &nbsp;·&nbsp; Q L &nbsp; W R &nbsp;·&nbsp; ENTER START &nbsp;·&nbsp; BACKSPACE SELECT &nbsp;·&nbsp; ESC BACK';
  loadBuiltIn();
  poll();setInterval(poll,1000);
 }
 function poll(){
  if(Date.now()<hold)return;
  try{const i=X.info();const r=i.rom;say(r?`${r.title||'Untitled'} · ${r.mapping||''} · ${Math.round(r.size/1024)} KB${r.pal?' · PAL':''}${i.stopped?' · stopped':''}`:'Built-in demo')}catch(e){}
 }
 function romBytes(){const t=$('romB64').textContent.trim();if(!t||t.startsWith('/*'))return null;const bin=atob(t),u=new win.Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u}
 async function loadBuiltIn(){try{const r=romBytes();if(r){await X.loadRom(r,'star-patrol-1.0.1.sfc');hold=0;poll()}else win.document.getElementById('btnTest').click()}catch(e){try{win.document.getElementById('btnTest').click()}catch(_){}}}
 async function loadFile(file){
  if(!file||!X)return;
  if(file.size>8*1024*1024){say('That file is too big for a SNES cartridge.');return}
  try{await X.loadRom(new win.Uint8Array(await file.arrayBuffer()),file.name);hold=0;poll()}catch(e){say('Could not load that file: '+(e&&e.message||e),6000)}
 }
 $('snesStar').onclick=()=>loadBuiltIn();
 addEventListener('lounge-console-reset',()=>{try{X.control('reset');say('Console reset',3000);setTimeout(poll,3200)}catch(e){}});
 $('snesReset').onclick=()=>{try{X.control('reset');say('Console reset');setTimeout(poll,600)}catch(e){}};
 $('snesLoadBtn').onclick=()=>$('snesFile').click();
 $('snesFile').onchange=e=>{const f=e.target.files[0];e.target.value='';loadFile(f)};
 $('gamesBtn').onclick=()=>{room.openSettings();setTimeout(()=>{const d=$('section-05');d.open=true;d.scrollIntoView({block:'start'})},60)};
 addEventListener('dragover',e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')){e.preventDefault();document.body.classList.add('dropping')}});
 addEventListener('dragleave',e=>{if(!e.relatedTarget)document.body.classList.remove('dropping')});
 addEventListener('drop',e=>{e.preventDefault();document.body.classList.remove('dropping');loadFile(e.dataTransfer&&e.dataTransfer.files[0])});
 window.SnesLounge=Object.freeze({loadRom:loadFile,emulator:()=>X,frame:()=>frame});
 boot();
})();
