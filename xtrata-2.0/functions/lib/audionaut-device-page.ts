import { PRO_NO_STORE } from './audionaut-pro-auth';

// Standalone pairing screen. The wallet and the device session stay in their
// respective HttpOnly cookies. No analytics or external assets on this page.
export function devicePairingPage() {
  const nonce = crypto.randomUUID();
  const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pair an iPad · AudioNaut beta-pro</title>
<style nonce="${nonce}">
:root{color-scheme:dark;font:16px/1.55 system-ui,sans-serif;background:#0c121a;color:#edf3f7}
body{max-width:32rem;margin:clamp(2rem,10vh,7rem) auto;padding:0 1.3rem}
h1{line-height:1.2;margin:.3rem 0 1.2rem}p{margin:.7rem 0 1.1rem}
small{color:#82d6cc}label,input,output{display:block}
input,button,a{font:inherit}input{box-sizing:border-box;width:100%;padding:.7rem;background:#172330;color:inherit;border:1px solid #818e9b;border-radius:5px}
button,a{display:inline-block;cursor:pointer;color:#a9ede6;padding:.65rem .9rem;margin:.4rem .4rem .4rem 0;border-radius:5px;border:1px solid #45645f;background:#182825}
button:disabled{opacity:.55}output{font:600 clamp(1rem,5vw,1.55rem) monospace;letter-spacing:.06em;margin:1rem 0}
[hidden]{display:none!important}
</style><main><small>AudioNaut beta-pro</small><h1>Pair an iPad</h1>
<section id="mac" hidden><p>On your iPad, open this page in Safari and tap <b>Get pairing code</b>. Share the code to your Mac with AirDrop, or enter it here. Approve only the code shown on your own iPad.</p>
<form><label for="code">iPad pairing code</label><input id="code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="32" required>
<button>Approve this iPad</button></form><p>Access lasts up to eight hours. Pairing a new iPad replaces the previous one. Signing out of this wallet ends its paired session.</p>
<button id="revoke">Disconnect paired iPad</button></section>
<section id="ipad" hidden><p>Keep this page open on your iPad. Use your unlocked Mac to approve the code at this same address.</p>
<button id="start">Get pairing code</button><output id="display"></output><button id="share" hidden>Share with Mac</button><button id="copy" hidden>Copy code</button></section>
<section id="ready" hidden><a href="/audionaut-beta-pro/daw.html">Open beta-pro studio</a><button id="disconnect">Disconnect this iPad</button></section>
<p id="status" role="status">Checking device…</p></main>
<script nonce="${nonce}">
const byId=id=>document.getElementById(id), statusLine=byId('status');
const shared=location.hash.slice(1);
if(location.hash)history.replaceState(null,'',location.pathname);
if(/^[A-Z2-9]{4}(-[A-Z2-9]{4}){3}$/.test(shared))byId('code').value=shared;
let timer,deadline,version=0;
async function send(action,code) {
  const r=await fetch(location.pathname,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,code}),cache:'no-store'});
  const data=await r.json(); if (!r.ok) throw Error(data.error||'Could not contact the studio.'); return data;
}
function handle(fn) {return async e=>{e.preventDefault();const button=e.submitter||e.currentTarget;
  button.disabled=true;try{await fn();}catch(err){statusLine.textContent=err.message;}finally{button.disabled=false;}};}
function show(part) {for(const id of ['mac','ipad','ready'])byId(id).hidden=id!==part;}
async function poll(ticket) {
  if(ticket!==version)return;
  if(Date.now()>=deadline){statusLine.textContent='The code expired. Get a new code.';byId('display').textContent='';byId('copy').hidden=byId('share').hidden=true;return;}
  try {
    const result=await send('claim');if(ticket!==version)return;
    if(result.ready){show('ready');statusLine.textContent='Your Mac approved this iPad.';location.replace('/audionaut-beta-pro/daw.html');return;}
  } catch(err){statusLine.textContent=err.message;}
  if(ticket===version)timer=setTimeout(()=>poll(ticket),3000);
}
byId('start').onclick=handle(async()=>{
  const ticket=++version;clearTimeout(timer);const result=await send('start');deadline=result.expiresAt;
  byId('display').textContent=result.code.match(/.{4}/g).join('-');byId('copy').hidden=!navigator.clipboard;byId('share').hidden=!navigator.share;
  statusLine.textContent='Waiting for your Mac. This code lasts ten minutes.';poll(ticket);
});
byId('share').onclick=handle(async()=>{try {
  await navigator.share({title:'Approve my iPad in AudioNaut',url:location.origin+location.pathname+'#'+byId('display').textContent});
} catch(err){if(err.name!=='AbortError')throw err;}});
byId('copy').onclick=handle(async()=>{await navigator.clipboard.writeText(byId('display').textContent);statusLine.textContent='Code copied. Approve it on your Mac.';});
document.querySelector('form').onsubmit=handle(async()=>{await send('approve',byId('code').value);byId('code').value='';
  statusLine.textContent='Approved. The studio will open on the iPad that supplied this code.';});
byId('revoke').onclick=handle(async()=>{await send('revoke');statusLine.textContent='The iPad and any pending approval are disconnected.';});
byId('disconnect').onclick=handle(async()=>{await send('disconnect-device');show('ipad');statusLine.textContent='This iPad is disconnected.';});
send('status').then(data=>{show(data.manager?'mac':data.paired?'ready':'ipad');statusLine.textContent='';}).catch(err=>{statusLine.textContent=err.message;});
</script></html>`;
  return new Response(html, {
    headers: {
      ...PRO_NO_STORE,
      'Content-Type': 'text/html; charset=utf-8',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'`
    }
  });
}
