(() => {
 const $=id=>document.getElementById(id),audio=$('radio-audio');
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
 $('radio-load').click();
})();
