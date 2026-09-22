(() => {
 const $=id=>document.getElementById(id),audio=$('radio-audio');
 async function version(check=false){
  const button=$('check-update');button.disabled=true;
  try{
   const r=await fetch('/app-version'+(check?'?check=1':''));const data=await r.json();if(!r.ok||data.error)throw Error(data.error||'Update check unavailable.');
   $('app-version').textContent='Xtrata Music '+data.version;
   if(check){const a=data.version.split('.').map(Number),b=data.latest?.split('.').map(Number);const difference=b?.map((n,i)=>n-a[i]).find(n=>n!==0)||0;
    const install=data.platform==='win32'?'run the downloaded Windows installer':data.platform==='darwin'?'replace the app in Applications':'follow the update instructions for your system';
    $('update-status').textContent=difference>0?`Version ${data.latest} is available. Download it, quit Xtrata Music, ${install}, then reopen. Your wallet stays in place.`:data.latest?'You are running the latest published version or a newer local build.':'No published update is available yet.';
   }
  }catch(e){$('update-status').textContent=e.message;}finally{button.disabled=false;}
 }
 $('check-update').onclick=()=>void version(true);void version();
 window.addEventListener('radio-track',({detail:track})=>{
  const cover=$('cover');cover.hidden=true;$('cover-fallback').hidden=false;
  cover.alt=`Cover artwork for ${track.title}`;
  cover.onload=()=>{cover.hidden=false;$('cover-fallback').hidden=true;};
  cover.onerror=()=>{cover.hidden=true;$('cover-fallback').hidden=false;};
  if(track.hasArtwork)cover.src='/radio/artwork?id='+track.id;else cover.removeAttribute('src');
  $('song-link').href='https://xtrata.xyz/radio/catalogue?id='+track.id;
 });
 function air(){const playing=!audio.paused&&!audio.ended&&!audio.muted&&audio.volume>0&&audio.readyState>=3;$('on-air').classList.toggle('live',playing);$('on-air').textContent=playing?'● ON AIR':'● OFF AIR';}
 for(const event of ['playing','pause','ended','waiting','volumechange','emptied'])audio.addEventListener(event,air);
 function costs(){const fee=Number($('radio-paid-fee').value);$('cost-preview').textContent=Number.isInteger(fee)&&fee>=1&&fee<=1000?`Each paid start: ${((fee+50)/1000000).toFixed(6)} STX total. 1 STX covers up to ${Math.floor(1000000/(fee+50)).toLocaleString()} starts at this fee.`:'Choose a network fee between 1 and 1000 microSTX.';}
 $('radio-paid-fee').addEventListener('input',costs);costs();
 window.addEventListener('radio-ready',()=>$('radio-load').click(),{once:true});
})();
