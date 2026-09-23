// Release data contains published artifacts only; never invent a download URL.
fetch('/radio/music-releases.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(release=>{
 if(typeof release.summary==='string')document.getElementById('release-summary').textContent=release.summary;
 const platforms={'mac-universal':'Mac · Intel & Apple silicon','mac-universal-legacy':'Mac · Monterey preview','mac-arm64':'Mac · Apple silicon','mac-x64':'Mac · Intel','win-x64':'Windows · Intel/AMD','linux-x64':'Linux · AppImage'};
 const versionOf=d=>{const version=Object.hasOwn(d,'version')?d.version:release.version;return typeof version==='string'&&/^\d+\.\d+\.\d+$/.test(version)?version:null;};
 const verified=(release.downloads||[]).filter(d=>{try{const u=new URL(d.url);return versionOf(d)&&platforms[d.platform]&&d.verified===true&&(d.signed===true||(release.channel==='preview'&&d.signed===false&&d.preview===true))&&u.origin==='https://github.com'&&u.pathname.startsWith('/stxtrata/xtrata/releases/download/')&&/^[a-f0-9]{64}$/.test(d.sha256);}catch{return false;}});
 if(!verified.length)return;
 const previewNote=platform=>platform.startsWith('mac-')?'Unsigned early-access build. macOS may block opening it. See the testing instructions below before installing.':platform==='win-x64'?'Unsigned early-access build. Windows may show a security warning. Verify the SHA-256 before opening it; do not disable Windows security protections.':'Unsigned early-access build. Verify the SHA-256 and read the testing instructions before installing.';
 const host=document.getElementById('downloads-list');host.replaceChildren();for(const d of verified){const card=document.createElement('article'),title=document.createElement('h3'),p=document.createElement('p'),link=document.createElement('a'),details=document.createElement('details'),summary=document.createElement('summary'),hash=document.createElement('code');title.textContent=platforms[d.platform];p.textContent=d.requirements||'See release notes for compatibility.';link.className='button';link.href=d.url;link.textContent=(d.preview?'Download test preview ':'Download ')+versionOf(d);summary.textContent='Verify download (SHA-256)';hash.textContent=d.sha256;details.append(summary,hash);card.append(title,p,link,details);if(d.preview){const note=document.createElement('p');note.textContent=previewNote(d.platform);card.append(note);}host.append(card);}
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
