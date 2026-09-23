// In-page approval avoids Electron/Windows native-confirm focus loss.
// Cancellation is the default; only the explicit Continue button approves.
window.musicConfirm=message=>new Promise(resolve=>{
 if(document.querySelector('#music-confirm')){resolve(false);return;}
 const previous=document.activeElement,dialog=document.createElement('dialog');
 dialog.id='music-confirm';dialog.setAttribute('aria-labelledby','music-confirm-title');
 const title=document.createElement('h2');title.id='music-confirm-title';title.textContent='Review and confirm';
 const text=document.createElement('p');text.textContent=message;
 const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel';cancel.autofocus=true;
 const accept=document.createElement('button');accept.type='button';accept.textContent='Continue';accept.dataset.confirmAccept='';
 let done=false;
 const finish=approved=>{if(done)return;done=true;window.removeEventListener('wizard-stop',stop);window.removeEventListener('pagehide',stop);dialog.remove();if(previous?.isConnected)previous.focus();resolve(approved);};
 const stop=()=>finish(false);
 cancel.onclick=stop;accept.onclick=()=>finish(true);
 dialog.addEventListener('cancel',e=>{e.preventDefault();stop();});dialog.addEventListener('close',stop);
 window.addEventListener('wizard-stop',stop);window.addEventListener('pagehide',stop);
 dialog.append(title,text,cancel,accept);document.body.append(dialog);
 try{dialog.showModal();cancel.focus();}catch{finish(false);}
});

// Shared display metadata: failures never block wallet operations or playback.
window.radioSongMetadata=new Map();
window.radioSongLabel=e=>{const t=e.core&&e.core!==3?null:window.radioSongMetadata.get(e.song);return `${e.title||t?.title||'Song #'+e.song}${(t?.artist||e.artist)?' — '+(t?.artist||e.artist):''} · #${e.song}`;};
void fetch('/radio/catalogue').then(r=>r.ok?r.json():null).then(v=>{for(const t of v?.tracks||[])window.radioSongMetadata.set(t.id,t);window.dispatchEvent(new Event('wizard-song-metadata'));}).catch(()=>{});
const $=id=>document.getElementById(id);
let state=null,review=null,busy=false,reviewValid=false,paidRadio=false;
const warningSessionKey='xtrata-music-hide-balance-warning';
let warningHidden=false;try{warningHidden=sessionStorage.getItem(warningSessionKey)==='1';}catch{}
function balanceWarning(){
 $('over-limit').hidden=!state?.overLimit||warningHidden;
 if($('warning-show'))$('warning-show').hidden=!state?.overLimit||!warningHidden;
}
for(const [id,hide] of [['warning-hide',true],['warning-show',false]])if($(id))$(id).onclick=()=>{warningHidden=hide;try{if(hide)sessionStorage.setItem(warningSessionKey,'1');else sessionStorage.removeItem(warningSessionKey);}catch{}balanceWarning();};
const stx=value=>{if(value===null||value===undefined)return '—';const n=BigInt(value);return `${n/1000000n}.${(n%1000000n).toString().padStart(6,'0')}`;};
async function api(action,body={}){
 const response=await fetch('/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await response.json();if(!response.ok||data.error)throw Error(data.error||'Request failed. Refresh to check status before trying again.');return data;
}
function controls(){
 for(const id of ['setup','status','run','return-excess','return-all','warning-excess','warning-all','return-cancel'])if($(id))$(id).disabled=busy;
 $('copy').disabled=!state?.address;
 if($('run'))$('run').disabled=busy||state?.running||!!review||paidRadio;
 $('return-confirm').disabled=busy||!reviewValid||!review||review.expires<=Date.now()||!$('return-approve').checked;
}
function activity(){
 const host=$('activity');host.replaceChildren();
 const entries=[...(state?.entries||[]).map(e=>({...e,kind:'play'})),...(state?.returns||[]).map(e=>({...e,kind:'return'}))].reverse();
 if(!entries.length){host.textContent='No payments or returns recorded.';return;}
 for(const e of entries){
  const row=document.createElement('div');row.className='activity-row';
  const title=document.createElement('strong');title.textContent=e.kind==='return'?`Return ${e.mode} · ${e.status}`:`${window.radioSongLabel(e)} · ${e.status}`;row.append(title);
  const p=document.createElement('p');p.textContent=e.kind==='return'?`${stx(e.amount)} STX to ${e.recipient} · fee ${stx(e.fee)} STX`:`Core ${e.core} · network fee ${stx(e.fee)} STX`;row.append(p);
  if(e.kind==='play'){const recipient=document.createElement('p');const payment=e.status==='confirmed'?'paid to':e.status==='failed'?'was not paid to':'intended for';recipient.textContent=e.recipient?`50 microSTX (0.00005 STX) ${payment} ${e.recipient}`:'Payment recipient unavailable.';row.append(recipient);}
  if(/^0x[0-9a-f]{64}$/.test(e.txid)){const a=document.createElement('a');a.href=`https://explorer.hiro.so/txid/${e.txid}?chain=mainnet`;a.target='_blank';a.rel='noopener noreferrer';a.textContent='View transaction ↗';row.append(a);}host.append(row);
 }
}
function render(){
 if(document.body.hasAttribute('data-music-lounge')){$('setup').hidden=!!state?.address;if($('wallet-ready'))$('wallet-ready').hidden=!state?.address;}
 $('address').textContent=state?.address||'No address loaded';$('balance').textContent=stx(state?.balanceMicroSTX);
 $('balance-label').textContent=state?.balanceMicroSTX==null?'· refresh to check funds':state?.balanceStale?'· last known balance — refresh temporarily unavailable':'· confirmed balance';
 balanceWarning();
 if(state?.balanceMicroSTX!=null){const remaining=1000000n-BigInt(state.balanceMicroSTX);$('funding-help').textContent=remaining>0n?`Another ${stx(remaining)} STX would bring your balance to our recommended 1 STX. Check any incoming deposits first. Funding never enables payments.`:'We recommend keeping around 1 STX here. A higher balance does not pause payments.';}
 $('wallet-state').textContent=state?.recovery||state?.message||'No status loaded.';activity();controls();
}
async function refresh(){
 try{state=await api('status');render();if(!review&&state.returnQuote)showReview(state.returnQuote);}
 catch(e){$('balance-label').textContent='· last known; refresh failed';throw e;}
}
async function task(work,target='output'){
 if(busy)return;busy=true;controls();
 try{await work();}catch(e){$(target).textContent=e.message;}finally{busy=false;controls();}
}
function clearReview(){review=null;reviewValid=false;$('return-review').hidden=true;$('return-approve').checked=false;controls();}
function showReview(q){
 const disclosure=$('return-section').closest('details');if(disclosure)disclosure.open=true;
 review=q;reviewValid=true;$('return-approve').checked=false;
 $('return-recipient').value=q.recipient;$('return-fee').value=String(q.fee);
 const details=$('return-details');details.replaceChildren();
 for(const [label,value] of [['Action',q.mode==='all'?'Return all funds':'Return excess'],['Destination',q.recipient],['You receive',`${stx(q.amount)} STX`],['Network fee',`${stx(q.fee)} STX`],['Wallet remaining',`${stx(q.remaining)} STX`]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;details.append(dt,dd);}
 $('return-expiry').textContent='This review expires in two minutes. A changed balance requires another review.';
 $('return-review').hidden=false;$('return-review').scrollIntoView({block:'nearest'});controls();
}
async function prepare(mode){await task(async()=>{
 $('return-message').textContent='Stopping new test payments and checking available funds…';
 reviewValid=false;controls();
 const q=await api('return/prepare',{mode,recipient:$('return-recipient').value.trim(),fee:Number($('return-fee').value)});
 showReview(q);$('return-message').textContent='Review the destination, amount and fee. Nothing has been sent.';
 },'return-message');}
$('setup').onclick=()=>task(async()=>{const wallet=await api('setup');state={...state,...wallet};render();$('output').textContent='Address ready. Use Confirm funds to check your balance.';});
$('copy').onclick=()=>task(async()=>{await navigator.clipboard.writeText(state.address);$('output').textContent='Funding address copied.';});
$('status').onclick=()=>task(async()=>{await refresh();$('output').textContent='Status refreshed. No new transaction was sent.';});
$('stop').onclick=async()=>{window.dispatchEvent(new Event('wizard-stop'));try{const r=await api('stop');reviewValid=false;controls();$('output').textContent=r.message;}catch(e){$('output').textContent=e.message;}};
if($('run'))$('run').onclick=()=>task(async()=>{
 if(!$('approve').checked)throw Error('Approve the bounded run first.');
 const body={};for(const k of ['core','song','fee','count'])body[k]=Number($(k).value);
 if(!await window.musicConfirm(`Run ${body.count} test(s) for song ${body.song}, core ${body.core}, with ${body.fee} microSTX miner fee plus 50 microSTX holder payment per test?`))return;
 $('approve').checked=false;const r=await api('run',body);$('output').textContent=r.message;await refresh();
});
for(const [id,mode] of [['return-excess','excess'],['return-all','all'],['warning-excess','excess'],['warning-all','all']])$(id).onclick=()=>{
 const disclosure=$('return-section').closest('details');if(disclosure)disclosure.open=true;
 $('return-section').scrollIntoView({block:'start'});
 if(!$('return-recipient').value.trim()){$('return-recipient').focus();$('return-message').textContent='Enter your return address, then select Review return '+mode+'.';return;}
 void prepare(mode);
};
for(const id of ['return-recipient','return-fee'])$(id).oninput=()=>{if(review){reviewValid=false;$('return-approve').checked=false;$('return-expiry').textContent='Details changed. Select Review again before sending.';controls();}};
$('return-approve').onchange=controls;
$('return-cancel').onclick=()=>task(async()=>{if(review){const r=await api('return/cancel',{id:review.id});$('return-message').textContent=r.message;}clearReview();},'return-message');
$('return-confirm').onclick=()=>task(async()=>{
 if(!review||!reviewValid||!$('return-approve').checked||review.expires<=Date.now())throw Error('Review and approve the return first.');
 const id=review.id;reviewValid=false;$('return-approve').checked=false;
 $('return-message').textContent='Sending the approved return. If this takes time, refresh status; do not create another return.';
 try{const r=await api('return/confirm',{id});clearReview();$('return-message').textContent=`Return ${r.status}. Refresh to check confirmation. Tests are stopped.`;}
 catch(e){$('return-message').textContent=`${e.message} Refresh status before reviewing another return.`;}
 await refresh();
},'return-message');
setInterval(()=>{if(review&&review.expires<=Date.now()){reviewValid=false;$('return-expiry').textContent='Review expired. Select Review again to refresh the amount.';controls();}},1000);
// Read public status on this local panel only. Never create a wallet or sign on load.
void task(async()=>{await refresh();});

window.addEventListener('wizard-paid-mode',e=>{paidRadio=e.detail;controls();});
window.addEventListener('wizard-refresh',()=>{if(!busy)void task(refresh);});

window.addEventListener('wizard-song-metadata',activity);
