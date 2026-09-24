// Release data contains published artifacts only; never invent a download URL.
fetch('/radio/music-releases.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(release=>{
 if(typeof release.summary==='string')document.getElementById('release-summary').textContent=release.summary;
 const platforms={'mac-universal':'Mac · Intel & Apple silicon','mac-universal-legacy':'Mac · Monterey preview','mac-arm64':'Mac · Apple silicon','mac-x64':'Mac · Intel','win-x64':'Windows · Intel/AMD','linux-x64':'Linux · AppImage'};
 const versionOf=d=>{const version=Object.hasOwn(d,'version')?d.version:release.version;return typeof version==='string'&&/^\d+\.\d+\.\d+$/.test(version)?version:null;};
 const verified=[...(release.downloads||[]).map(d=>({...d,beta:false})),...(release.betaDownloads||[]).map(d=>({...d,beta:true}))].filter(d=>{try{const u=new URL(d.url);return versionOf(d)&&platforms[d.platform]&&d.verified===true&&(d.signed===true||(release.channel==='preview'&&d.signed===false&&d.preview===true))&&u.origin==='https://github.com'&&u.pathname.startsWith('/stxtrata/xtrata/releases/download/')&&/^[a-f0-9]{64}$/.test(d.sha256);}catch{return false;}});
 if(!verified.length)return;
 const previewNote=platform=>platform.startsWith('mac-')?'Unsigned early-access build. macOS may block opening it. See the testing instructions below before installing.':platform==='win-x64'?'Unsigned early-access build. Windows may show a security warning. Verify the SHA-256 before opening it; do not disable Windows security protections.':'Unsigned early-access build. Verify the SHA-256 and read the testing instructions before installing.';
 const compare=(a,b)=>{const av=versionOf(a).split('.').map(Number),bv=versionOf(b).split('.').map(Number);for(let i=0;i<3;i++){if(av[i]!==bv[i])return bv[i]-av[i];}return (b.betaBuild||0)-(a.betaBuild||0);};
 verified.sort(compare);
 const latest=new Set();const seen=new Set();for(const d of verified){if(d.beta&&!seen.has(d.platform)){latest.add(d);seen.add(d.platform);}}
 verified.sort((a,b)=>Number(latest.has(b))-Number(latest.has(a))||compare(a,b));
 const host=document.getElementById('downloads-list');host.replaceChildren();
 for(const d of verified){
  const row=document.createElement('details'),heading=document.createElement('summary'),link=document.createElement('a'),p=document.createElement('p'),details=document.createElement('details'),summary=document.createElement('summary'),hash=document.createElement('code');
  row.className='beta-download-row';row.open=latest.has(d);link.className='beta-download-link';link.href=d.url;
  link.textContent=platforms[d.platform]+' · '+versionOf(d)+(d.beta?' · Beta':' · Preview')+(d.betaBuild?' · build '+d.betaBuild:'')+(latest.has(d)?' · Latest beta':'');
  heading.append(link);p.textContent=d.requirements||'See release notes for compatibility.';summary.textContent='Verify download (SHA-256)';hash.textContent=d.sha256;details.append(summary,hash);row.append(heading,p,details);
  if(d.preview){const note=document.createElement('p');note.textContent=previewNote(d.platform);row.append(note);}host.append(row);
 }

}).catch(()=>{});

// Native dialog supplies focus trapping and Escape-to-close; image links still
// work if scripting is unavailable.
const guideViewer=document.getElementById('guide-viewer');
if(guideViewer){
 const fullImage=document.getElementById('guide-full-image');
 document.querySelectorAll('[data-guide]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();fullImage.src=link.href;fullImage.alt=link.querySelector('img').alt;
  document.getElementById('guide-viewer-title').textContent=link.dataset.guide;
  guideViewer.showModal();document.body.classList.add('guide-open');
  guideViewer.querySelector('.guide-scroll').scrollTo(0,0);
 }));
 document.getElementById('guide-close').addEventListener('click',()=>guideViewer.close());
 guideViewer.addEventListener('close',()=>document.body.classList.remove('guide-open'));
 guideViewer.addEventListener('click',event=>{if(event.target===guideViewer)guideViewer.close();});
}
