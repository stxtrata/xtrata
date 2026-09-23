export const TIERS = [
  [1, 'First Supporter', '#171b1c'], [100, 'Bronze', '#dc9965'],
  [1000, 'Silver', '#d7e0e7'], [10000, 'Gold', '#f2cd68'],
  [100000, 'Platinum', '#69e3ea'], [1000000, 'Diamond', '#c7a1ff']
];
export const tierFor = count => [...TIERS].reverse().find(t => count >= t[0]) || TIERS[0];
export const stx = amount => `${amount / 1000000n}.${String(amount % 1000000n).padStart(6, '0')}`;
export function aggregateHeroes(plays, tracks = new Map()) {
  const seen = new Set(), wallets = new Map();
  for (const p of plays) {
    // The deployed contract emits one paid-start receipt per transaction.
    if (seen.has(p.txid)) continue;
    seen.add(p.txid);
    const w = wallets.get(p.payer) || {address:p.payer, count:0, amount:0n, songs:new Map(), recipients:new Set(), times:[], plays:[]};
    w.count++; w.amount += BigInt(p.amount); w.recipients.add(p.recipient); w.plays.push(p);
    if (Number.isSafeInteger(p.timestamp) && p.timestamp > 0) w.times.push(p.timestamp);
    const key = `${p.core}:${p.id}`, track = p.core === 3 ? tracks.get(p.id) : null;
    const song = w.songs.get(key) || {id:p.id, core:p.core, title:track?.title || `Song #${p.id}`, artist:track?.artist || '', count:0};
    song.count++; w.songs.set(key, song); wallets.set(p.payer, w);
  }
  let previous = -1, rank = 0;
  return [...wallets.values()].sort((a,b) => b.count-a.count || a.address.localeCompare(b.address)).map((w,i) => {
    if (w.count !== previous) rank = i+1;
    previous = w.count;
    const songs = [...w.songs.values()].sort((a,b)=>b.count-a.count || a.core-b.core || a.id-b.id);
    const days = new Set(w.times.map(t => new Date(t).toISOString().slice(0,10)));
    return {...w, rank, songs, tier:tierFor(w.count), first:w.times.length?Math.min(...w.times):null, last:w.times.length?Math.max(...w.times):null, activeDays:days.size, timingComplete:w.times.length===w.count};
  });
}
const el = (tag, text, cls) => {const n=document.createElement(tag); if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const date = t => t ? new Date(t).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) : 'Unavailable';
export function mountHeroes() {
  const reader=document.querySelector('[data-heroes-reader]'); if(!reader)return;
  const list=document.querySelector('#heroes-list'), search=document.querySelector('#hero-search');
  let state={plays:[],tracks:new Map(),complete:false,status:'Loading confirmed payments…'}, shown=50;
  const profiles=new Map(),checked=new Map();let fetchingProfiles=false;
  async function loadProfiles(heroes){
    if(fetchingProfiles)return;
    const addresses=heroes.map(w=>w.address).filter(a=>/^SP[A-Z0-9]{26,40}$/.test(a)&&Date.now()-(checked.get(a)||0)>300000).slice(0,5);
    if(!addresses.length)return;fetchingProfiles=true;
    addresses.forEach(a=>checked.set(a,Date.now()));
    try{
      const r=await fetch('/api/music-profile?addresses='+encodeURIComponent(addresses.join(',')),{signal:AbortSignal.timeout(15000),cache:'no-store'});
      if(r.ok){const data=await r.json();addresses.forEach(a=>profiles.delete(a));for(const p of data.profiles||[])if(addresses.includes(p.address)&&typeof p.name==='string')profiles.set(p.address,p);}
      else addresses.forEach(a=>profiles.delete(a));
    }catch{addresses.forEach(a=>profiles.delete(a));}
    finally{fetchingProfiles=false;render();}
  }
  function render() {
    const opened=new Set([...list.querySelectorAll('details[open]')].map(n=>n.dataset.address));
    const heroes=aggregateHeroes(state.plays,state.tracks), amount=heroes.reduce((n,w)=>n+w.amount,0n), count=heroes.reduce((n,w)=>n+w.count,0);
    document.querySelector('#hero-totals').textContent=`${count.toLocaleString()} paid plays · ${heroes.length.toLocaleString()} support wallets · ${stx(amount)} STX to holders`;
    document.querySelector('#hero-status').textContent=`${state.complete?'Full history loaded.':'Provisional rankings — full history is loading.'} ${state.status || ''}`;
    void loadProfiles(heroes);
    const term=search.value.trim().toLowerCase();
    const matches=heroes.filter(w=>[w.address,profiles.get(w.address)?.name||'',...w.songs.flatMap(s=>[s.title,s.artist,String(s.id)])].some(v=>v.toLowerCase().includes(term)));
    list.replaceChildren();
    for(const w of matches.slice(0,shown)) {
      const card=el('details',undefined,'hero-card');card.dataset.address=w.address;card.open=opened.has(w.address);card.style.setProperty('--tier',w.tier[2]);
      const summary=el('summary'), rank=el('span',`#${w.rank}`,'hero-rank'), identity=el('span',undefined,'hero-identity');
      const profile=profiles.get(w.address);let evidence;
      identity.append(el('strong',profile?.name||w.address),el('span',w.tier[1],'tier-badge'));
      if(profile){identity.append(el('small',w.address),el('small','BNS link verified by Xtrata'));evidence=el('a','View verification evidence');evidence.href='/api/music-profile?addresses='+encodeURIComponent(w.address);evidence.target='_blank';evidence.rel='noopener';}
      summary.append(rank,identity,el('strong',`${w.count.toLocaleString()} paid plays`));card.append(summary);if(evidence)card.append(evidence);
      const stats=el('div',undefined,'hero-stats');
      const stat=(label,value)=>{const item=el('div');item.append(el('small',label),el('strong',value));stats.append(item);};
      stat('Direct support',`${stx(w.amount)} STX`);stat('Songs supported',String(w.songs.length));stat('Recipients supported',String(w.recipients.size));
      stat('Most supported song',`${w.songs[0].title} · ${w.songs[0].count} plays`);
      stat('First payment',w.timingComplete?date(w.first):'Timestamp history unavailable');stat('Latest payment',w.timingComplete?date(w.last):'Timestamp history unavailable');
      if(w.timingComplete){stat('Active days (UTC)',String(w.activeDays));stat('Supporting for',`${Math.max(0,Math.floor((Date.now()-w.first)/86400000))} days`);}
      card.append(stats);
      const next=TIERS.find(t=>t[0]>w.count);card.append(el('p',next?`${(next[0]-w.count).toLocaleString()} more paid plays until ${next[1]}.`:'Diamond supporter — thank you for supporting music.'));
      const copy=el('button','Copy wallet address');copy.type='button';copy.onclick=async()=>{try{await navigator.clipboard.writeText(w.address);copy.textContent='Address copied';}catch{copy.textContent='Select and copy the address above';}};
      const wallet=el('a','View wallet ↗');wallet.href=`https://explorer.hiro.so/address/${encodeURIComponent(w.address)}?chain=mainnet`;wallet.target='_blank';wallet.rel='noopener';card.append(copy,document.createTextNode(' '),wallet);
      card.append(el('h3','Most supported songs'));const top=el('ol');
      for(const s of w.songs.slice(0,5)){const item=el('li',`${s.title}${s.artist?' — '+s.artist:''} · core ${s.core} / #${s.id} · ${s.count} plays`);top.append(item);}card.append(top);
      card.append(el('h3','Recent payments'));const payments=el('ul');
      for(const p of w.plays.slice(0,5)){const item=el('li'),link=el('a',`Song #${p.id} · ${stx(BigInt(p.amount))} STX → ${p.recipient}`);link.href=`https://explorer.hiro.so/txid/${p.txid}?chain=mainnet`;link.target='_blank';link.rel='noopener';item.append(link);payments.append(item);}card.append(payments);list.append(card);
    }
    if(!matches.length)list.append(el('p',state.plays.length?'No matching support wallets.':'No paid plays loaded yet.'));
    document.querySelector('#heroes-more').hidden=shown>=matches.length;
  }
  reader.addEventListener('paid-history',e=>{state=e.detail;render();});
  search.addEventListener('input',()=>{shown=50;render();});
  document.querySelector('#heroes-more').onclick=()=>{shown+=50;render();};
  document.querySelector('#heroes-refresh').onclick=()=>reader.querySelector('[data-chain-refresh]').click();
  render();
}
