(async()=>{
  const documentRoot=document.documentElement;
  if(window.__XCHESS_V3_LOADING__===documentRoot)return;
  window.__XCHESS_V3_LOADING__=documentRoot;
  const packs=/* PACKS */{};
  const query=new URLSearchParams(location.search), fragment=new URLSearchParams(location.hash.slice(1));
  const value=k=>query.get(k)??fragment.get(k);
  const oldLink=(value('game')||value('tournament')||value('player')) && (!value('contract') || value('contract').endsWith('.xchess-core-v1-canary'));
  const mode=value('xchess-view') || (oldLink?'v2':'v3');
  const change=(target,game)=>{
    const url=new URL(location.href);
    url.searchParams.set('xchess-view',target);
    // Keep the host's wallet bridge token and inscription path intact.
    if(game!==undefined){url.hash='';url.searchParams.set('game',String(game));}
    else {url.hash='';for(const key of ['game','contract','network','endpoint','tournament','player'])url.searchParams.delete(key);}
    location.assign(url.href);
  };
  window.XChessOpenV2=game=>change('v2',game);
  try {
    const compressed=Uint8Array.from(atob(packs[mode==='v2'?'v2':mode==='peer'?'peer':'v3']),c=>c.charCodeAt(0));
    const html=await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    const parsed=new DOMParser().parseFromString(html,'text/html');
    // Preserve runtime-installed listeners and provider globals. document.open
    // would erase the host bridge's message listener.
    for(const style of parsed.querySelectorAll('style'))document.head.append(style.cloneNode(true));
    const scripts=[...parsed.querySelectorAll('script')].map(s=>s.textContent);
    parsed.querySelectorAll('script').forEach(s=>s.remove());
    document.body.replaceChildren(...[...parsed.body.childNodes].map(n=>document.importNode(n,true)));
    const bar=document.createElement('div');bar.id='xchess-version-switch';
    bar.style.cssText='display:flex;gap:12px;align-items:center;justify-content:center;padding:10px;background:#101716;color:#eaf0ef;font:13px system-ui';
    const label=document.createElement('span');label.textContent=mode==='v2'?'X-Chess 3.0 · V2 games':'X-Chess 3.0 · New arena';
    const button=document.createElement('button');button.textContent=mode==='v2'?'New arena & local games':'V2 games, profiles & tournaments';
    button.style.cssText='border:1px solid #657957;border-radius:5px;padding:6px 10px;color:#c0ee65;background:#17201e';
    button.onclick=()=>change(mode==='v2'?'v3':'v2');bar.append(label,button);
    const peerButton=document.createElement('button');peerButton.textContent=mode==='peer'?'New arena':'Peer play';peerButton.onclick=()=>change(mode==='peer'?'v3':'peer');bar.append(peerButton);
    if(mode==='peer')label.textContent='X-Chess 3.0 · Peer play · local development';
    for(const text of scripts){const script=document.createElement('script');script.textContent=text;document.body.append(script);}
    if (!document.getElementById('xchess-version-switch')) document.body.prepend(bar);
    window.__XCHESS_V3_MODE__=mode==='v2'?'v2':mode==='peer'?'peer':'v3';
  } catch(error) {
    const p=document.createElement('p');p.setAttribute('role','alert');p.textContent='X-Chess could not open: '+error.message;document.body.append(p);
  }
})();
