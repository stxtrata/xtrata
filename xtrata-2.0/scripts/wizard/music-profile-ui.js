(()=>{
 const $=id=>document.getElementById(id);if(!$('profile-link'))return;
 let busy=false;
 async function begin(action){
  if(busy)return;
  const name=$('profile-name').value.trim().toLowerCase();
  if(!name){$('profile-status').textContent='Enter your BNS name first.';return;}
  if(!confirm(action==='link'?`Publicly link ${name} to this music wallet and its payment history? This signs a profile request only. You will verify the BNS owner on Xtrata next.`:'Remove the BNS label from this music wallet? Payment history remains public.'))return;
  busy=true;$('profile-open').hidden=true;$('profile-status').textContent='Preparing your profile request…';
  try{
   const r=await fetch('/profile/begin',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,action,method:action==='unlink'?'signature':$('profile-method').value,approved:true})});const d=await r.json();if(!r.ok)throw Error(d.error);
   const url=new URL(d.url);if(url.origin!=='https://xtrata.xyz'||url.pathname!=='/music/profile')throw Error('Unexpected verification link.');
   $('profile-open').href=url.href;$('profile-open').hidden=false;$('profile-status').textContent='Ready. Continue on Xtrata to finish. This request expires in 15 minutes.';
  }catch(e){$('profile-status').textContent=e.message||'Profile linking unavailable. Music is unaffected.';}
  finally{busy=false;}
 }
 $('profile-link').onclick=()=>begin('link');$('profile-unlink').onclick=()=>begin('unlink');
})();
