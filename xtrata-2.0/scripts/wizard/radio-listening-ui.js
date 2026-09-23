import {AudibleClock} from './radio-policy.js';
(() => {
 const $=id=>document.getElementById(id),audio=$('radio-audio');
 const tab=crypto.randomUUID().replaceAll('-','');
 let tracks=[],index=-1,start=null,approval=null,loading=0,modeGeneration=0,refreshing=false,metadataAbort=null;
 function renderSongs(){const list=$('radio-songs');list.replaceChildren();tracks.forEach((t,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`#${t.id} · ${t.title}${t.artist?' — '+t.artist:''}`;list.append(o);});list.value=String(index<0?0:index);}
 async function api(action,body={}){const r=await fetch('/listening/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const v=await r.json();if(!r.ok||v.error)throw Error(v.error||'Local service unavailable.');return v;}
 function mode(text){const active=!!approval;$('radio-mode').textContent=text;$('radio-mode').dataset.mode=active?(text.includes('WAITING')?'waiting':'support'):'free';document.body.dataset.paymentMode=$('radio-mode').dataset.mode;$('radio-enable').disabled=active;$('radio-enable').textContent=active?'Music support is on':'Turn on music support';$('radio-approve').checked=active;$('radio-approve').disabled=active;for(const id of ['radio-paid-fee','radio-continuous'])$(id).disabled=active;limits();window.dispatchEvent(new CustomEvent('wizard-paid-mode',{detail:!!approval}));}
 let recentEvents=[],diagnostic=null,recoveryDismissed=false;
 if($('dismiss-recovery'))$('dismiss-recovery').onclick=()=>{recoveryDismissed=true;$('recovery-notice').hidden=true;};
 if($('copy-recovery'))$('copy-recovery').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(diagnostic,null,2));$('recovery-copy-status').textContent='Report copied. No private keys or signed transaction data included.';}catch{$('recovery-copy-status').textContent='Clipboard unavailable. '+JSON.stringify(diagnostic);}};
 window.addEventListener('wizard-song-metadata',()=>renderEvents(recentEvents));
 function renderEvents(events){
  recentEvents=events;
  const host=$('radio-events');host.replaceChildren();
  for(const e of events.slice(0,15)){const p=document.createElement('p');const payment=e.outcome==='confirmed'?'paid to':e.outcome==='failed'?'was not paid to':'intended for';p.textContent=`${window.radioSongLabel(e)}${e.receiptLabel?' · '+e.receiptLabel:''}: ${e.outcome} — ${e.reason}${e.recipient?` · 50 microSTX ${payment} ${e.recipient}`:''}`;host.append(p);}
 }
 async function free(){modeGeneration++;const old=approval;approval=null;mode('FREE PLAY · support off');if(old){try{await api('free',{token:old.token,tab});}catch(e){$('radio-payment').textContent=e.message;}}}
 async function select(i){
  if(!tracks.length)return;const previousFree=start&&!start.requested;metadataAbort?.abort();const controller=new AbortController();metadataAbort=controller;const version=++loading;if(start&&!start.requested)$('radio-payment').textContent='Skipped — free';audio.pause();index=(i+tracks.length)%tracks.length;
  const track=tracks[index];start={id:crypto.randomUUID().replaceAll('-',''),song:track.id,observed:false,clock:new AudibleClock(),requested:false,playing:false};
  window.dispatchEvent(new CustomEvent('radio-track',{detail:track}));
  $('radio-songs').value=String(index);$('radio-title').textContent=track.title;
  $('radio-info').textContent=[track.artist,track.album&&'Album: '+track.album,'Inscription #'+track.id].filter(Boolean).join(' · ');
  $('radio-payment').textContent=(previousFree?'Previous song skipped — free. ':'')+'Loading audio. Support is requested only after audible listening reaches its threshold.';
  start.src=new URL(`/radio/audio?id=${track.id}&playback=${start.id}`,location.origin).href;
  try{
   await new Promise((resolve,reject)=>{
    const cleanup=()=>{clearTimeout(timer);audio.removeEventListener('loadedmetadata',ready);audio.removeEventListener('error',failed);controller.signal.removeEventListener('abort',failed);};
    const ready=()=>{cleanup();resolve();};const failed=()=>{cleanup();reject(Error('Metadata unavailable'));};
    const timer=setTimeout(failed,60000);
    audio.addEventListener('loadedmetadata',ready);audio.addEventListener('error',failed);controller.signal.addEventListener('abort',failed,{once:true});
    audio.src=start.src;audio.load();
   });
   if(version!==loading)return;
   await audio.play();
  }catch{if(version===loading)$('radio-payment').textContent='Audio could not start. Press Play to retry, or choose another song. No start payment was requested.';}
 }
 function audible(){
  if(!start)return;
  const active=start.playing&&!audio.paused&&!audio.ended&&!audio.muted&&audio.volume>0&&!audio.seeking&&audio.readyState>=3&&audio.currentSrc===start.src;
  const seconds=start.clock.sample(performance.now(),active);
  if(!start.observed&&active){
   start.observed=true;start.approval=approval;
   if(!approval){$('radio-payment').textContent='Free listen. Turning support on applies to the next song.';return;}
   const observed=start,a=approval;
   void api('begin',{token:a.token,tab,id:observed.id,song:observed.song}).then(result=>{
    if(start!==observed||approval!==a)return;
    observed.threshold=result.threshold;observed.unknownDuration=result.unknownDuration;
    // Start timing after the server registration, excluding network setup time.
    observed.clock=new AudibleClock();audible();
   }).catch(e=>{observed.requested=true;if(start===observed)$('radio-payment').textContent=`This listen stays free: ${e.message}`;});
  }
  if(!start.observed&&(audio.muted||audio.volume===0))$('radio-payment').textContent='Muted — listening timer paused. Unmute to continue.';
  if(!start.approval||start.approval!==approval||start.requested||start.threshold===undefined)return;
  if(!active){if(audio.muted||audio.volume===0)$('radio-payment').textContent='Muted — listening timer paused. Unmute to continue.';return;}
  $('radio-payment').textContent=`Listening… support payment at 0:${String(start.threshold).padStart(2,'0')} · ${Math.floor(seconds)} s audible`;
  if(seconds<start.threshold)return;
  start.requested=true;const observed=start,a=approval;
  $('radio-payment').textContent='Support payment requested. Music continues while the wallet checks it.';
  void api('qualify',{token:a.token,tab,id:observed.id,song:observed.song,audibleSeconds:seconds,threshold:observed.threshold}).then(e=>{
   if(start===observed)$('radio-payment').textContent=e.reason;
   if(approval===a&&e.outcome==='free')mode('SUPPORT ON · this listen plays free while payment checks wait');
   window.dispatchEvent(new Event('wizard-refresh'));
  }).catch(e=>{if(start===observed)$('radio-payment').textContent=`Payment outcome needs checking: ${e.message} No automatic retry will be made.`;});
 }
 audio.addEventListener('playing',()=>{if(start)start.playing=true;});
 for(const event of ['pause','waiting','stalled','ended'])audio.addEventListener(event,()=>{if(start)start.playing=false;});
 for(const event of ['playing','volumechange','timeupdate','pause','seeking','seeked','waiting','stalled'])audio.addEventListener(event,audible);
 const audibleTimer=setInterval(audible,200);
 window.addEventListener('pagehide',()=>clearInterval(audibleTimer));
 audio.addEventListener('ended',()=>{audible();if(start&&!start.requested)$('radio-payment').textContent=start.unknownDuration?'Duration unknown and listen ended before 30 audible seconds — free.':'Ended before listening threshold — free.';if(index<tracks.length-1||$('radio-loop').checked)void select(index+1);});
 audio.addEventListener('error',()=>{$('radio-payment').textContent='Audio unavailable. Choose another song. Check activity for any payment already requested.';});
 $('radio-play').onclick=()=>{if(!start)void select(Number($('radio-songs').value)||0);else if(audio.paused)void audio.play().catch(()=>{$('radio-payment').textContent='Could not resume audio.';});else audio.pause();};
 $('radio-next').onclick=()=>void select(index+1);$('radio-prev').onclick=()=>void select(index<0?0:index-1);
 $('radio-songs').onchange=()=>void select(Number($('radio-songs').value));
 $('radio-approve').addEventListener('change',()=>{if($('support-consent-prompt')){$('support-consent-prompt').hidden=true;$('support-agreement').classList.remove('needs-agreement');$('radio-approve').removeAttribute('aria-invalid');}});
 $('radio-free').onclick=()=>void free();
 $('radio-enable').onclick=async()=>{
  if(approval)return;
  const activationStatus=$('support-activation-status');if(activationStatus){activationStatus.hidden=false;activationStatus.textContent='Checking wallet and previous payments…';}
  if(!$('radio-approve').checked){if(activationStatus)activationStatus.hidden=true;const message='Please tick the agreement above before turning on automatic payments. Listening stays free.';$('radio-payment').textContent=message;const prompt=$('support-consent-prompt');if(prompt){prompt.textContent=message;prompt.hidden=false;$('support-agreement').classList.add('needs-agreement');$('radio-approve').setAttribute('aria-invalid','true');$('radio-approve').scrollIntoView({block:'center',behavior:'smooth'});}$('radio-approve').focus();return;}
  const generation=++modeGeneration;$('radio-enable').disabled=true;
  try{
   const continuous=$('radio-continuous').checked,fee=Number($('radio-paid-fee').value),max=Number($('radio-paid-max').value),minutes=Number($('radio-paid-minutes').value);
   if(!confirm(`Enable ${continuous?'continuous paid listening until funds run out or you stop':`up to ${max} paid listens over ${minutes} minutes`}? Network fee usually 257 microSTX; up to ${fee} microSTX if busy, plus 50 microSTX to the holder. You also approve up to two fee increases on the same pending payment within this cap, ${continuous?'using the available wallet balance with no test spending cap':`up to ${max*(fee+50)} microSTX total`}. This uses the dedicated wizard on mainnet. It may resend an unresolved previously authorised payment unchanged at its original fee.`))return;
   const a=await api('enable',{fee,max,minutes,tab,continuous,feeMode:'cap'});if(generation!==modeGeneration){await api('free',{token:a.token,tab});return;}approval={token:a.token,continuous};$('radio-approve').checked=false;
   mode(`${a.continuous?'SUPPORT ON':'SUPPORT ON · bounded test'} · ${a.used}${a.continuous?'':'/'+a.max} listens · network fee cap ${a.fee} microSTX + 50 to holder`);
   $('radio-payment').textContent='Music support stays on for this session. New songs can pay after their listening threshold; the current song is not charged retrospectively. Switch to Free play before changing payment settings.';
  }catch(e){$('radio-payment').textContent=e.message;if(activationStatus){activationStatus.hidden=false;activationStatus.textContent='Support could not start: '+e.message+' Listening remains free. Check wallet activity and refresh the balance to check again.';}}finally{if(activationStatus&&(approval||activationStatus.textContent==='Checking wallet and previous payments…'))activationStatus.hidden=true;$('radio-enable').disabled=!!approval;}
 };
 function limits(){const continuous=$('radio-continuous').checked;$('radio-paid-max').disabled=!!approval||continuous;$('radio-paid-minutes').disabled=!!approval||continuous;const fee=Number($('radio-paid-fee').value),max=Math.floor(5000/(fee+50));$('radio-paid-max').max=String(max);$('radio-session-help').textContent=continuous?'One approval lasts until you stop or close this page. New song starts retry checks automatically after interruptions. No time or count limit applies.':`One approval covers the whole session. At this fee, choose up to ${max} starts within the 0.005 STX session cap. The remaining lifetime budget also applies.`;}
 limits();
 for(const id of ['radio-paid-fee','radio-paid-max','radio-paid-minutes','radio-continuous'])$(id).oninput=()=>{limits();$('radio-approve').checked=false;void free();};
 async function load(automatic=false){
  if(refreshing)return;refreshing=true;$('radio-load').disabled=true;
  try{
   const r=await fetch('/radio/catalogue'+(automatic?'':'?refresh=1'),{signal:AbortSignal.timeout(35000)});const v=await r.json();if(!r.ok||v.error||!Array.isArray(v.tracks))throw Error(v.error||'Catalogue unavailable.');
   const current=tracks.find(t=>t.id===start?.song);
   tracks=v.tracks.slice();
   // Keep the playing item stable even if a catalogue refresh temporarily omits it.
   if(current&&!tracks.some(t=>t.id===current.id))tracks.push(current);
   index=start?tracks.findIndex(t=>t.id===start.song):-1;renderSongs();
   for(const track of tracks)window.radioSongMetadata?.set(track.id,track);
   window.dispatchEvent(new Event('wizard-song-metadata'));
   $('radio-load').title=`Last updated ${new Date().toLocaleTimeString()}. Automatically checks every 3 minutes.`;
   if(!start)$('radio-payment').textContent=tracks.length?`${tracks.length} songs ready. Playable songs can receive support.`:'No verified songs available.';
  }catch(e){if(!automatic)$('radio-payment').textContent=e.message;}finally{refreshing=false;$('radio-load').disabled=false;}
 }
 $('radio-load').onclick=()=>void load();
 const catalogueTimer=setInterval(()=>void load(true),180000);
 window.addEventListener('pagehide',()=>{clearInterval(catalogueTimer);metadataAbort?.abort();});
 let polling=false,lastWalletRefresh=0;
 setInterval(async()=>{
  if(polling)return;polling=true;
  const polledApproval=approval;
  try{const s=polledApproval?await api('heartbeat',{token:polledApproval.token,tab}):await api('status');if(approval!==polledApproval)return;renderEvents(s.events);diagnostic={version:$('app-version')?.textContent,at:new Date().toISOString(),reason:s.recovery,failedChecks:s.recoveryFailures,events:s.events.map(e=>({song:e.song,at:e.at,outcome:e.outcome,reason:e.reason,txid:e.txid,nonce:e.nonce,bytes:e.bytes,fee:e.fee,feeChosen:e.feeChosen,feeCap:e.feeCap,feeReason:e.feeReason,feeEstimates:e.feeEstimates,submittedAt:e.submittedAt,confirmedAt:e.confirmedAt,blockHeight:e.blockHeight,confirmationSeconds:e.confirmationSeconds,rejectionReason:e.rejectionReason}))};if($('recovery-notice'))$('recovery-notice').hidden=recoveryDismissed||!(s.recoveryFailures>=10);
   if(approval&&!s.enabled){approval=null;mode('FREE PLAY · support session ended');}
   else if(approval&&s.recovery)mode('SUPPORT WAITING · '+s.recovery);
   else if(approval)mode(`${s.continuous?'SUPPORT ON':'SUPPORT ON · bounded test'} · ${s.used}${s.continuous?'':'/'+s.max} listens · network fee cap ${s.fee} microSTX + 50 to holder`);
   else if(s.enabled)mode('FREE PLAY in this tab · support is active in another tab');
   if(Date.now()-lastWalletRefresh>=60000){lastWalletRefresh=Date.now();window.dispatchEvent(new Event('wizard-refresh'));}
  }catch(e){if(approval&&approval===polledApproval){if(!approval.continuous)approval=null;mode(approval?'SUPPORT WAITING · still enabled; reconnecting automatically':'FREE PLAY · connection unavailable');$('radio-payment').textContent=e.message;}}
  finally{polling=false;}
 },10000);
 window.addEventListener('pagehide',()=>{if(approval){void fetch('/listening/free',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:approval.token,tab}),keepalive:true}).catch(()=>{});}audio.pause();});
 window.addEventListener('wizard-stop',()=>void free());
 mode('FREE PLAY · support off');
 // The lounge script starts its initial catalogue load after the module has
 // attached its controls. This avoids a deferred-module race on desktop.
 window.dispatchEvent(new Event('radio-ready'));
})();
