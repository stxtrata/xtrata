(() => {
 const $=id=>document.getElementById(id),audio=$('radio-audio');
 const tab=crypto.randomUUID().replaceAll('-','');
 let tracks=[],index=-1,start=null,approval=null,loading=0,modeGeneration=0;
 async function api(action,body={}){const r=await fetch('/listening/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const v=await r.json();if(!r.ok||v.error)throw Error(v.error||'Local service unavailable.');return v;}
 function mode(text){$('radio-mode').textContent=text;window.dispatchEvent(new CustomEvent('wizard-paid-mode',{detail:!!approval}));}
 let recentEvents=[];
 window.addEventListener('wizard-song-metadata',()=>renderEvents(recentEvents));
 function renderEvents(events){
  recentEvents=events;
  const host=$('radio-events');host.replaceChildren();
  for(const e of events.slice(0,15)){const p=document.createElement('p');p.textContent=`${window.radioSongLabel(e)}: ${e.outcome} — ${e.reason}${e.recipient?` · 50 microSTX ${e.outcome==='confirmed'?'paid to':'intended for'} ${e.recipient}`:''}`;host.append(p);}
 }
 async function free(){modeGeneration++;const old=approval;approval=null;mode('FREE · no paid starts');if(old){try{await api('free',{token:old.token,tab});}catch(e){$('radio-payment').textContent=e.message;}}}
 async function select(i){
  if(!tracks.length)return;const version=++loading;audio.pause();index=(i+tracks.length)%tracks.length;
  const track=tracks[index];start={id:crypto.randomUUID().replaceAll('-',''),song:track.id,observed:false};
  window.dispatchEvent(new CustomEvent('radio-track',{detail:track}));
  $('radio-songs').value=String(index);$('radio-title').textContent=track.title;
  $('radio-info').textContent=[track.artist,track.album&&'Album: '+track.album,'Inscription #'+track.id].filter(Boolean).join(' · ');
  $('radio-payment').textContent='Loading audio. No payment is requested until playback begins.';
  start.src=new URL(`/radio/audio?id=${track.id}&playback=${start.id}`,location.origin).href;
  audio.src=start.src;
  try{await audio.play();}catch{if(version===loading)$('radio-payment').textContent='Audio could not start. Press Play to retry, or choose another song. No start payment was requested.';}
 }
 function audible(){
  if(!start||start.observed||audio.paused||audio.ended||audio.muted||audio.volume===0||audio.currentSrc!==start.src)return;
  start.observed=true;const observed={...start},a=approval;
  if(!a){$('radio-payment').textContent='Free start. Enabling Paid now applies to the next song.';return;}
  $('radio-payment').textContent='Paid start requested. Music continues while the wallet checks it.';
  void api('start',{token:a.token,tab,id:observed.id,song:observed.song}).then(e=>{
   if(start?.id===observed.id)$('radio-payment').textContent=e.reason;
   window.dispatchEvent(new Event('wizard-refresh'));
  }).catch(e=>{if(start?.id===observed.id)$('radio-payment').textContent=`Payment outcome needs checking: ${e.message} No automatic retry will be made.`;if(!a.continuous)void free();});
 }
 audio.addEventListener('playing',audible);audio.addEventListener('volumechange',audible);
 audio.addEventListener('ended',()=>{if(index<tracks.length-1||$('radio-loop').checked)void select(index+1);});
 audio.addEventListener('error',()=>{$('radio-payment').textContent='Audio unavailable. Choose another song. Check activity for any payment already requested.';});
 $('radio-play').onclick=()=>{if(!start)void select(Number($('radio-songs').value)||0);else if(audio.paused)void audio.play().catch(()=>{$('radio-payment').textContent='Could not resume audio.';});else audio.pause();};
 $('radio-next').onclick=()=>void select(index+1);$('radio-prev').onclick=()=>void select(index<0?0:index-1);
 $('radio-songs').onchange=()=>void select(Number($('radio-songs').value));
 $('radio-free').onclick=()=>void free();
 $('radio-enable').onclick=async()=>{
  if(!$('radio-approve').checked){$('radio-payment').textContent='Approve the bounded paid session first.';return;}
  const generation=++modeGeneration;$('radio-enable').disabled=true;
  try{
   const continuous=$('radio-continuous').checked,fee=Number($('radio-paid-fee').value),max=Number($('radio-paid-max').value),minutes=Number($('radio-paid-minutes').value);
   if(!confirm(`Enable ${continuous?'continuous paid listening until funds run out or you stop':`up to ${max} paid starts over ${minutes} minutes`}? Each costs ${fee} microSTX miner fee + 50 microSTX to the holder, ${continuous?'using the available wallet balance with no test spending cap':`up to ${max*(fee+50)} microSTX total`}. This uses the dedicated wizard on mainnet.`))return;
   const a=await api('enable',{fee,max,minutes,tab,continuous});if(generation!==modeGeneration){await api('free',{token:a.token,tab});return;}approval={token:a.token,continuous};$('radio-approve').checked=false;
   mode(`${a.continuous?'CONTINUOUS PAID':'PAID TEST'} · ${a.used}${a.continuous?'':'/'+a.max} starts · fee ${a.fee} microSTX + 50 to holder`);
   $('radio-payment').textContent='Paid tests enabled for new song starts. The current song is not charged retrospectively.';
  }catch(e){$('radio-payment').textContent=e.message;}finally{$('radio-enable').disabled=false;}
 };
 function limits(){const continuous=$('radio-continuous').checked;$('radio-paid-max').disabled=continuous;$('radio-paid-minutes').disabled=continuous;const fee=Number($('radio-paid-fee').value),max=Math.floor(5000/(fee+50));$('radio-paid-max').max=String(max);$('radio-session-help').textContent=continuous?'One approval lasts until you stop or close this page. New song starts retry checks automatically after interruptions. No time or count limit applies.':`One approval covers the whole session. At this fee, choose up to ${max} starts within the 0.005 STX session cap. The duration and remaining lifetime budget also apply.`;}
 limits();
 for(const id of ['radio-paid-fee','radio-paid-max','radio-paid-minutes','radio-continuous'])$(id).oninput=()=>{limits();$('radio-approve').checked=false;void free();};
 async function load(){
  $('radio-load').disabled=true;
  try{const r=await fetch('/radio/catalogue');const v=await r.json();if(!r.ok||v.error)throw Error(v.error||'Catalogue unavailable.');tracks=v.tracks;
   const list=$('radio-songs');list.replaceChildren();tracks.forEach((t,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`#${t.id} · ${t.title}${t.artist?' — '+t.artist:''}`;list.append(o);});
   $('radio-payment').textContent=tracks.length?`${tracks.length} songs ready. Press Play to listen free.`:'No verified songs available.';
  }catch(e){$('radio-payment').textContent=e.message;}finally{$('radio-load').disabled=false;}
 }
 $('radio-load').onclick=()=>void load();
 let polling=false;
 setInterval(async()=>{
  if(polling)return;polling=true;
  try{const s=approval?await api('heartbeat',{token:approval.token,tab}):await api('status');renderEvents(s.events);
   if(approval&&!s.enabled){approval=null;mode('FREE · paid session ended');}
   else if(approval)mode(`${s.continuous?'CONTINUOUS PAID':'PAID TEST'} · ${s.used}${s.continuous?'':'/'+s.max} starts · fee ${s.fee} microSTX + 50 to holder`);
   else if(s.enabled)mode('FREE in this tab · another tab has a paid session');
   window.dispatchEvent(new Event('wizard-refresh'));
  }catch(e){if(approval){if(!approval.continuous)approval=null;mode('FREE · payment connection unavailable; retrying');$('radio-payment').textContent=e.message;}}
  finally{polling=false;}
 },10000);
 window.addEventListener('pagehide',()=>{if(approval){void fetch('/listening/free',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:approval.token,tab}),keepalive:true}).catch(()=>{});}audio.pause();});
 window.addEventListener('wizard-stop',()=>void free());
 mode('FREE · no paid starts');
})();
