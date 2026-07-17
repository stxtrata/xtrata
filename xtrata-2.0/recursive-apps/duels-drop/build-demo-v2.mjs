#!/usr/bin/env node
/**
 * XTRATA DUELS demo v2 — SPACE RENEGADE edition.
 *
 * Sealed-gameplan fight engine prototype: 6 rounds, stance triangle
 * (ALL-IN / COVER / MIND GAMES), 12 energy to allocate, AI opponents with
 * per-variant personalities, ~2 minute playback with round-by-round reveals.
 * Outcome = cards + plans + seed, decided only as the bout unfolds — the
 * mechanics we will port into xtrata-arcade-duels-v2's commit-reveal flow.
 *
 * Usage: node build-demo-v2.mjs [--in ./out] [--outfile ./demo-v2.html]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const IN = opt('in', './out');
const OUTFILE = opt('outfile', './demo-v2.html');

const manifest = JSON.parse(readFileSync(join(IN, 'manifest.json'), 'utf8'));
const load = (dir, e) => {
  const svg = readFileSync(join(IN, dir, e.file), 'utf8');
  const sha = createHash('sha256').update(svg).digest('hex');
  if (sha !== e.sha256) throw new Error('hash drift ' + e.file);
  return { i: e.index, svg, hash: e.sha256 };
};

// Space Renegade variant roster: fighters take these identities (cycled).
const VARIANTS = [
  'Space Renegade', 'Rocket Jim', 'Beard Barbarian', 'Tentacle Wrangler',
  'Professor Renegade', 'Disco Voidwalker', 'Captain Catastrophe', 'The Last Roadie',
  'Neon Noir Renegade', 'Emperor of Absolutely Nothing', 'Moon-Pirate Jim', 'Temporal Double'
];
// AI personality per variant: probability weights for [ALL-IN, COVER, MIND GAMES]
// and energy curve ('front' = front-loaded, 'late' = sandbagger, 'flat').
const PERSONA = {
  'Space Renegade': { w: [4, 3, 3], curve: 'flat' },
  'Rocket Jim': { w: [6, 1, 3], curve: 'front' },
  'Beard Barbarian': { w: [7, 2, 1], curve: 'front' },
  'Tentacle Wrangler': { w: [2, 3, 5], curve: 'late' },
  'Professor Renegade': { w: [2, 5, 3], curve: 'late' },
  'Disco Voidwalker': { w: [3, 2, 5], curve: 'flat' },
  'Captain Catastrophe': { w: [6, 2, 2], curve: 'front' },
  'The Last Roadie': { w: [3, 5, 2], curve: 'flat' },
  'Neon Noir Renegade': { w: [3, 3, 4], curve: 'late' },
  'Emperor of Absolutely Nothing': { w: [5, 4, 1], curve: 'front' },
  'Moon-Pirate Jim': { w: [5, 1, 4], curve: 'flat' },
  'Temporal Double': { w: [3, 3, 4], curve: 'late' }
};
const WEAPON_NAMES = [
  'Ray Gun', 'Rocket Pistol', 'Plasma Drill', 'Beard Axe', 'Tentacle Blaster', 'Alien Grappler',
  'Holo Book', 'Quantum Confusion Ray', 'Disco Blaster', 'Moon Cutlass', 'Pirate Pistol',
  'Neon Pistol', 'Chrono Device', 'Rocket Pack', 'Fusion Hammer', 'Void Scythe',
  'Electro Staff', 'Gravity Axe', 'Chainsaw Saber', 'Banjo Basher'
];

const fighters = manifest.fighters.map((e, idx) => ({
  ...load('fighters', e),
  name: VARIANTS[idx % VARIANTS.length],
}));
const weapons = manifest.weapons.map((e, idx) => ({
  ...load('weapons', e),
  name: WEAPON_NAMES[idx % WEAPON_NAMES.length],
}));

// Cornermen: Jim's actual inscriptions. Loaded live from xtrata.xyz when
// online; emoji fallback offline. Hashes are demo stand-ins for the twin
// blessing (on mainnet the blessing hash comes from the twin binding).
const TWINS = [
  { i: 361, name: 'Jim #361 (the photo)', img: 'https://xtrata.xyz/i/361', emoji: '📸',
    hash: createHash('sha256').update('demo-twin:xtrata-361').digest('hex') },
  { i: 2759, name: 'Jim #2759 (the artwork)', img: 'https://xtrata.xyz/i/2759', emoji: '🎨',
    hash: createHash('sha256').update('demo-twin:xtrata-2759').digest('hex') },
  { i: 77, name: 'Bitcoin Pepe #77', img: '', emoji: '🐸',
    hash: createHash('sha256').update('demo-twin:pepe-77').digest('hex') }
];

const DATA = JSON.stringify({ fighters, weapons, twins: TWINS, personas: PERSONA });

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SPACE RENEGADE — XTRATA DUELS demo v2</title>
<style>
  :root { color-scheme: dark;
    --ink:#0b1626; --panel:#0d1b30; --line:#1f3a5c; --gold:#ffcf5c; --red:#ff5c49;
    --cyan:#66d9ff; --text:#cfe0f5; --dim:#7d94b8; --green:#7dff9e; }
  * { box-sizing:border-box; }
  body { margin:0; background:
    radial-gradient(900px 500px at 80% -10%, #14263f 0%, transparent 60%),
    radial-gradient(700px 400px at 10% 110%, #101f36 0%, transparent 60%), var(--ink);
    color:var(--text); font-family: ui-monospace,'Courier New',monospace; min-height:100vh; }
  header { text-align:center; padding:26px 16px 6px; }
  .logo { font-size:clamp(26px,5vw,44px); font-weight:bold; letter-spacing:.06em;
    color:var(--gold); text-shadow: 3px 3px 0 #7a3c12, 0 0 30px rgba(255,207,92,.35); font-style:italic; }
  .logo span { color:var(--red); }
  .sub { color:var(--cyan); font-size:12px; letter-spacing:.28em; margin-top:2px; }
  .tag { display:inline-block; margin-top:10px; padding:3px 14px; border:1px solid var(--line);
    color:var(--dim); border-radius:3px; font-size:11px; letter-spacing:.1em; background:rgba(13,27,48,.8); }
  main { max-width:1180px; margin:0 auto; padding:14px; }
  section { border:1px solid var(--line); border-radius:6px; background:rgba(13,27,48,.92);
    padding:16px; margin-bottom:14px; box-shadow: inset 0 0 40px rgba(0,20,50,.4); }
  section h2 { margin:0 0 4px; font-size:13px; letter-spacing:.16em; color:var(--gold); text-transform:uppercase; }
  section h2::before { content:'★ '; color:var(--red); }
  .hint { color:var(--dim); font-size:12px; line-height:1.55; }
  .cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(104px,1fr)); gap:10px; margin-top:10px; max-height:280px; overflow:auto; padding:4px; }
  .card { border:1px solid var(--line); border-radius:5px; background:#0a1425; padding:6px; cursor:pointer; transition:transform .08s, box-shadow .08s; }
  .card:hover { transform:translateY(-3px); }
  .card.sel { border-color:var(--gold); box-shadow:0 0 14px rgba(255,207,92,.45); }
  .card .art { width:100%; aspect-ratio:1; border-radius:3px; overflow:hidden; }
  .card .art svg, .card .art img { width:100%; height:100%; object-fit:cover; image-rendering:pixelated; }
  .card .cid { font-size:10px; color:var(--cyan); margin-top:5px; line-height:1.3; min-height:24px; }
  .card .stat { font-size:10px; color:var(--dim); }
  .bar { height:5px; border-radius:2px; background:#152a44; overflow:hidden; margin-top:3px; }
  .bar i { display:block; height:100%; background:linear-gradient(90deg,var(--red),var(--gold)); }
  .twinrow { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
  .twin { width:120px; }
  /* gameplan */
  #planGrid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; margin-top:12px; }
  .round { border:1px solid var(--line); border-radius:5px; background:#0a1425; padding:8px; text-align:center; }
  .round h3 { margin:0 0 6px; font-size:11px; color:var(--gold); letter-spacing:.1em; }
  .stances { display:flex; flex-direction:column; gap:4px; }
  .stances button { font:inherit; font-size:10px; padding:5px 2px; border-radius:3px; border:1px solid var(--line); background:#0e1e35; color:var(--dim); cursor:pointer; }
  .stances button.on-A { background:#3d1410; color:#ffb0a5; border-color:var(--red); }
  .stances button.on-C { background:#0f2c3d; color:#a5e6ff; border-color:var(--cyan); }
  .stances button.on-M { background:#2d2440; color:#d5b8ff; border-color:#9a6cff; }
  .energy { margin-top:8px; font-size:11px; color:var(--gold); }
  .energy .pips { display:flex; gap:2px; justify-content:center; margin-top:3px; }
  .energy .pips b { width:9px; height:12px; border-radius:2px; background:#152a44; cursor:pointer; }
  .energy .pips b.lit { background:linear-gradient(180deg,var(--gold),#c47b1e); box-shadow:0 0 6px rgba(255,207,92,.6); }
  #energyLeft { font-size:12px; color:var(--gold); margin-top:10px; }
  .fightbar { position:sticky; bottom:0; display:flex; gap:12px; align-items:center; padding:13px; background:rgba(8,15,29,.97); border-top:1px solid var(--line); justify-content:center; z-index:5; flex-wrap:wrap; }
  .bigbtn { font-family:inherit; font-size:15px; letter-spacing:.16em; padding:12px 32px; border-radius:4px; border:1px solid var(--red);
    background:linear-gradient(180deg,#5c1c12,#38100a); color:#ffd9c9; cursor:pointer; text-transform:uppercase; }
  .bigbtn:disabled { opacity:.35; cursor:default; }
  .bigbtn:hover:not(:disabled) { box-shadow:0 0 18px rgba(255,92,73,.5); }
  #picksum { font-size:12px; color:var(--dim); }
  /* arena */
  #arena { display:none; position:fixed; inset:0; background:rgba(4,8,17,.98); z-index:60; align-items:center; justify-content:center; overflow:auto; }
  #arena.on { display:flex; }
  .stage { width:min(97vw,940px); border:1px solid var(--line); border-radius:8px;
    background:linear-gradient(180deg,#0e1c33,#081120); padding:22px; margin:14px 0; }
  .vsrow { display:flex; gap:12px; align-items:flex-start; justify-content:space-between; }
  .corner { flex:1; text-align:center; min-width:0; }
  .pit { position:relative; width:min(34vw,190px); margin:0 auto; }
  .pit .f { width:100%; aspect-ratio:1; border-radius:6px; overflow:hidden; border:1px solid var(--line); background:#000; }
  .pit .f svg { width:100%; height:100%; }
  .pit .w { position:absolute; right:-9px; bottom:-9px; width:40%; aspect-ratio:1; border-radius:4px; overflow:hidden; border:1px solid var(--gold); background:#000; }
  .pit .w svg { width:100%; height:100%; }
  .pit .tw { position:absolute; left:-10px; top:-10px; width:34px; height:34px; border-radius:50%; overflow:hidden; border:2px solid var(--gold); background:#0a1425; font-size:20px; line-height:32px; }
  .pit .tw img { width:100%; height:100%; object-fit:cover; }
  .hp { height:14px; border-radius:3px; background:#152a44; overflow:hidden; margin-top:12px; border:1px solid var(--line); }
  .hp i { display:block; height:100%; width:100%; background:linear-gradient(90deg,var(--red),var(--gold) 45%,var(--green)); transition:width .45s; }
  .cname { font-size:12px; color:var(--cyan); margin-top:7px; }
  .rounddots { display:flex; gap:5px; justify-content:center; margin-top:6px; }
  .rounddots s { width:11px; height:11px; border-radius:50%; background:#152a44; border:1px solid var(--line); text-decoration:none; }
  .rounddots s.won { background:var(--gold); box-shadow:0 0 8px rgba(255,207,92,.7); }
  .vsbig { align-self:center; font-size:26px; color:var(--red); text-shadow:0 0 16px rgba(255,92,73,.6); font-style:italic; }
  #roundTitle { text-align:center; font-size:16px; color:var(--gold); letter-spacing:.2em; margin-top:16px; min-height:22px; }
  #clash { display:flex; justify-content:center; gap:18px; margin-top:10px; min-height:64px; align-items:center; }
  .stancecard { width:120px; padding:10px 6px; text-align:center; border-radius:5px; border:1px solid var(--line); background:#0a1425; font-size:11px; letter-spacing:.08em;
    transform:rotateY(90deg); transition:transform .4s; }
  .stancecard.flip { transform:rotateY(0); }
  .stancecard.A { border-color:var(--red); color:#ffb0a5; }
  .stancecard.C { border-color:var(--cyan); color:#a5e6ff; }
  .stancecard.M { border-color:#9a6cff; color:#d5b8ff; }
  .stancecard .big { font-size:20px; display:block; margin-bottom:4px; }
  #commentary { text-align:center; min-height:40px; margin-top:10px; font-size:13px; color:var(--text); }
  #scorecard { display:none; margin-top:12px; font-size:11px; color:var(--dim); border-top:1px solid var(--line); padding-top:10px; overflow:auto; }
  #scorecard table { width:100%; border-collapse:collapse; min-width:520px; }
  #scorecard td, #scorecard th { padding:4px 6px; text-align:center; border-bottom:1px solid #12233c; }
  #scorecard th { color:var(--gold); font-size:10px; letter-spacing:.1em; }
  .stakebanner { text-align:center; margin-top:12px; font-size:13px; min-height:20px; }
  .win { color:var(--green); } .lose { color:var(--red); }
  .arena-actions { display:flex; gap:10px; justify-content:center; margin-top:14px; flex-wrap:wrap; }
  .ghost { border:1px solid var(--line); background:#0e1e35; color:var(--text); }
  .shake { animation:shake .35s; } @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  .flash { animation:flash .35s; } @keyframes flash { 50%{filter:brightness(2.2) saturate(1.5)} }
  .kod { filter:grayscale(1) brightness(.45); transform:rotate(90deg); transition:all .8s; }
  .quote { text-align:center; color:var(--dim); font-size:11px; font-style:italic; margin-top:4px; }
</style>
</head>
<body>
<header>
  <div class="logo">SPACE <span>RENEGADE!</span></div>
  <div class="sub">XTRATA DUELS · PIXEL FIGHTER ARENA</div>
  <div class="tag">DEMO v2 — SEALED GAMEPLANS · real drop stats · simulated chain</div>
  <div class="quote">"The galaxy don't need a hero. It needs a problem solver." — Jim</div>
</header>
<main>
  <section>
    <h2>1 · Choose your renegade</h2>
    <p class="hint">PWR comes from each inscription's sha256 — the number the Clarity contract derives on mainnet.
    Lose the duel and your renegade AND your gear leave with the winner.</p>
    <div class="cards" id="fGrid"></div>
  </section>
  <section>
    <h2>2 · Choose your gear</h2>
    <div class="cards" id="wGrid"></div>
  </section>
  <section>
    <h2>3 · Your cornerman</h2>
    <p class="hint">A Forever Twin in your corner adds its blessing. Never staked, never lost. Style is forever.</p>
    <div class="twinrow" id="tRow"></div>
  </section>
  <section id="planSection">
    <h2>4 · Seal your gameplan</h2>
    <p class="hint">Six rounds. Pick a stance per round — <b style="color:#ffb0a5">ALL-IN</b> crushes
    <b style="color:#d5b8ff">MIND GAMES</b>, mind games unravel <b style="color:#a5e6ff">COVER</b>, cover stuffs all-in —
    and split <b style="color:var(--gold)">12 energy</b> across the rounds. Your plan is sealed before the fight;
    so is theirs. On mainnet this is a commit-reveal: the outcome does not exist until both plans meet the block seed.</p>
    <div id="planGrid"></div>
    <div id="energyLeft"></div>
  </section>
</main>
<div class="fightbar">
  <span id="picksum">assemble your loadout, renegade</span>
  <button class="bigbtn" id="fightBtn" disabled>Seal plan &amp; fight</button>
</div>

<div id="arena">
  <div class="stage">
    <div class="vsrow">
      <div class="corner">
        <div class="pit"><div class="f" id="artA"></div><div class="w" id="wepA"></div><div class="tw" id="twA"></div></div>
        <div class="hp"><i id="hpA"></i></div>
        <div class="cname" id="nameA"></div>
        <div class="rounddots" id="dotsA"></div>
      </div>
      <div class="vsbig">VS</div>
      <div class="corner">
        <div class="pit"><div class="f" id="artB"></div><div class="w" id="wepB"></div><div class="tw" id="twB"></div></div>
        <div class="hp"><i id="hpB"></i></div>
        <div class="cname" id="nameB"></div>
        <div class="rounddots" id="dotsB"></div>
      </div>
    </div>
    <div id="roundTitle"></div>
    <div id="clash"></div>
    <div id="commentary"></div>
    <div id="scorecard"></div>
    <div class="stakebanner" id="stake"></div>
    <div class="arena-actions">
      <button class="bigbtn ghost" id="skipBtn">Skip to verdict</button>
      <button class="bigbtn" id="rematchBtn" style="display:none">New duel</button>
      <button class="bigbtn ghost" id="exitBtn">Back</button>
    </div>
  </div>
</div>

<script>
const DROP = ${DATA};
const $ = (id) => document.getElementById(id);
const hex = (s) => { const o=new Uint8Array(s.length/2); for(let i=0;i<s.length;i+=2)o[i/2]=parseInt(s.substr(i,2),16); return o; };
const u16 = (b,i=0) => (b[i]<<8)|b[i+1];
const cat = (...a)=>{const o=new Uint8Array(a.reduce((n,x)=>n+x.length,0));let p=0;for(const x of a){o.set(x,p);p+=x.length;}return o;};
const sha = async (b)=> new Uint8Array(await crypto.subtle.digest('SHA-256', b));
const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));

/* ---- card stats (unchanged, parity with v1 contract) ---- */
const derive = { pwr:(h)=>u16(h)%100, dmg:(h)=>u16(h)%60, bless:(h)=>u16(h)%40, style:(h)=>h[3]%4 };

/* ---- v2 ROUND ENGINE (prototype for xtrata-arcade-duels-v2) ----
   Round score = cardShare + stanceResult + energy*E_W + roundLuck
   cardShare  = floor((base+wpn+twin+synergy)/6)      // 0..36
   stance     : winner +STANCE_W(40), tie both +15, loser +0
   energy     : pips*12                                // 0..48 across budget 12
   roundLuck  = u16(sha256(seed||side||round))%45      // 0..44
   Fight: 6 rounds; most round wins takes it; 3-3 -> total points; then tie byte. */
const TUNE = { STANCE_W:40, STANCE_TIE:15, ENERGY_W:12, LUCK_W:45, ROUNDS:6, BUDGET:12 };
const STANCES = ['A','C','M']; // All-in, Cover, Mind games
const S_NAME = { A:'ALL-IN', C:'COVER', M:'MIND GAMES' };
const S_ICON = { A:'⚔', C:'🛡', M:'🌀' };
const beats = (a,b)=> (a==='A'&&b==='M')||(a==='M'&&b==='C')||(a==='C'&&b==='A');

function cardShare(f,w,t){
  const fh=hex(f.hash), wh=hex(w.hash), th=hex(t.hash);
  const synergy=((fh[3]^wh[3])%4===0)?20:0;
  return { share: Math.floor((derive.pwr(fh)+derive.dmg(wh)+derive.bless(th)+synergy)/6),
           synergy, pwr:derive.pwr(fh), dmg:derive.dmg(wh), bless:derive.bless(th) };
}
async function roundLuck(seed, side, r){
  return u16(await sha(cat(seed, new Uint8Array([side, r])))) % TUNE.LUCK_W;
}

/* ---- selection state ---- */
const sel = { f:null, w:null, t:null };
const plan = { stances: Array(6).fill(null), energy: Array(6).fill(0) };
function card(entry, grid, kind){
  const h = hex(entry.hash);
  const el = document.createElement('div');
  el.className='card';
  const stat = kind==='f'?derive.pwr(h):derive.dmg(h);
  const max = kind==='f'?99:59;
  el.innerHTML = '<div class="art">'+entry.svg+'</div><div class="cid">#'+entry.i+' '+entry.name+'</div>' +
    '<div class="stat">'+(kind==='f'?'PWR ':'DMG ')+stat+' · sty '+derive.style(h)+'</div>' +
    '<div class="bar"><i style="width:'+Math.round(stat/max*100)+'%"></i></div>';
  el.onclick = ()=>{ grid.querySelectorAll('.card').forEach(c=>c.classList.remove('sel')); el.classList.add('sel'); sel[kind]=entry; syncPick(); };
  grid.appendChild(el);
}
DROP.fighters.forEach(f=>card(f,$('fGrid'),'f'));
DROP.weapons.forEach(w=>card(w,$('wGrid'),'w'));
DROP.twins.forEach(t=>{
  const h=hex(t.hash);
  const el=document.createElement('div');
  el.className='card twin';
  const art = t.img ? '<img src="'+t.img+'" onerror="this.outerHTML=\\'<div style=&quot;font-size:44px;line-height:90px&quot;>'+t.emoji+'</div>\\'">'
                    : '<div style="font-size:44px;line-height:90px;text-align:center">'+t.emoji+'</div>';
  el.innerHTML = '<div class="art">'+art+'</div><div class="cid">'+t.name+'</div>' +
    '<div class="stat" style="color:var(--gold)">BLESS '+derive.bless(h)+'</div>';
  el.onclick=()=>{ $('tRow').querySelectorAll('.card').forEach(c=>c.classList.remove('sel')); el.classList.add('sel'); sel.t=t; syncPick(); };
  $('tRow').appendChild(el);
});

/* ---- gameplan UI ---- */
function buildPlanGrid(){
  const g=$('planGrid'); g.innerHTML='';
  for(let r=0;r<6;r++){
    const el=document.createElement('div'); el.className='round';
    el.innerHTML='<h3>ROUND '+(r+1)+'</h3><div class="stances">'+
      STANCES.map(s=>'<button data-r="'+r+'" data-s="'+s+'">'+S_ICON[s]+' '+S_NAME[s]+'</button>').join('')+
      '</div><div class="energy">energy<div class="pips">'+
      [0,1,2,3].map(p=>'<b data-r="'+r+'" data-p="'+(p+1)+'"></b>').join('')+'</div></div>';
    g.appendChild(el);
  }
  g.onclick=(ev)=>{
    const sb=ev.target.closest('button[data-s]');
    if(sb){ const r=+sb.dataset.r; plan.stances[r]=sb.dataset.s;
      sb.parentElement.querySelectorAll('button').forEach(b=>b.className='');
      sb.className='on-'+sb.dataset.s; syncPick(); return; }
    const pip=ev.target.closest('b[data-p]');
    if(pip){ const r=+pip.dataset.r, want=+pip.dataset.p;
      plan.energy[r] = plan.energy[r]===want ? want-1 : want;
      const spent=plan.energy.reduce((a,b)=>a+b,0);
      if(spent>TUNE.BUDGET) plan.energy[r]-= (spent-TUNE.BUDGET);
      renderPips(); syncPick(); }
  };
  renderPips();
}
function renderPips(){
  document.querySelectorAll('#planGrid .round').forEach((el,r)=>{
    el.querySelectorAll('b[data-p]').forEach((b,p)=> b.classList.toggle('lit', p < plan.energy[r]));
  });
  const spent=plan.energy.reduce((a,b)=>a+b,0);
  $('energyLeft').textContent='energy allocated: '+spent+' / '+TUNE.BUDGET+(spent<TUNE.BUDGET?' — unspent energy is wasted, renegade':'');
}
buildPlanGrid();
function syncPick(){
  const planned = plan.stances.every(Boolean);
  const ok = sel.f&&sel.w&&sel.t&&planned;
  $('fightBtn').disabled=!ok;
  $('picksum').textContent = !sel.f||!sel.w||!sel.t ? 'assemble your loadout, renegade'
    : !planned ? 'seal your gameplan: pick a stance for every round'
    : 'sealed: '+sel.f.name+' · '+sel.w.name+' · plan locked';
}

/* ---- AI opponent plan from persona ---- */
function aiPlan(fighter, rand){
  const p = DROP.personas[fighter.name] || { w:[4,3,3], curve:'flat' };
  const stances=[], energy=[];
  let budget=TUNE.BUDGET;
  const curveW = (r)=> p.curve==='front' ? (6-r) : p.curve==='late' ? (r+1) : 3.5;
  const weights=[0,1,2,3,4,5].map(curveW); const wsum=weights.reduce((a,b)=>a+b,0);
  for(let r=0;r<6;r++){
    const roll=rand()* (p.w[0]+p.w[1]+p.w[2]);
    stances.push(roll<p.w[0]?'A':roll<p.w[0]+p.w[1]?'C':'M');
    energy.push(Math.min(4, Math.round(TUNE.BUDGET*weights[r]/wsum)));
  }
  let spent=energy.reduce((a,b)=>a+b,0);
  while(spent>TUNE.BUDGET){ const i=energy.findIndex(e=>e>0); energy[i]--; spent--; }
  while(spent<TUNE.BUDGET){ const i=energy.findIndex(e=>e<4); if(i<0)break; energy[i]++; spent++; }
  return { stances, energy };
}

/* ---- the bout ---- */
let skipRequested=false, fighting=false;
const LINES = {
  A: ['goes ALL-IN — leather coat flying!','swings for the cheap seats!','full renegade rush!'],
  C: ['covers up behind the gear.','plays it cool. Style is forever.','reads the angles, gives nothing.'],
  M: ['MIND GAMES — a feint inside a feint!','sells the bluff beautifully.','is three moves ahead.']
};
const pickLine=(s,rb)=>LINES[s][rb%LINES[s].length];

async function fight(){
  if(fighting) return; fighting=true; skipRequested=false;
  // opponent
  let of,ow,ot;
  do{ of=DROP.fighters[Math.floor(Math.random()*DROP.fighters.length)];}while(of===sel.f);
  do{ ow=DROP.weapons[Math.floor(Math.random()*DROP.weapons.length)];}while(ow===sel.w);
  do{ ot=DROP.twins[Math.floor(Math.random()*DROP.twins.length)];}while(ot===sel.t);
  const seed = crypto.getRandomValues(new Uint8Array(32));
  const rivalPlan = aiPlan(of, Math.random);
  const mine = cardShare(sel.f, sel.w, sel.t);
  const theirs = cardShare(of, ow, ot);

  // precompute rounds (deterministic given seed + both sealed plans)
  const rounds=[];
  let winsA=0, winsB=0, ptsA=0, ptsB=0;
  for(let r=0;r<6;r++){
    const sA=plan.stances[r], sB=rivalPlan.stances[r];
    const stA = beats(sA,sB)?TUNE.STANCE_W : sA===sB?TUNE.STANCE_TIE:0;
    const stB = beats(sB,sA)?TUNE.STANCE_W : sA===sB?TUNE.STANCE_TIE:0;
    const lA = await roundLuck(seed,1,r), lB = await roundLuck(seed,2,r);
    const tA = mine.share + stA + plan.energy[r]*TUNE.ENERGY_W + lA;
    const tB = theirs.share + stB + rivalPlan.energy[r]*TUNE.ENERGY_W + lB;
    const w = tA>tB?'A':tB>tA?'B':'T';
    if(w==='A')winsA++; if(w==='B')winsB++;
    ptsA+=tA; ptsB+=tB;
    rounds.push({sA,sB,stA,stB,lA,lB,tA,tB,w,eA:plan.energy[r],eB:rivalPlan.energy[r]});
  }
  let iWin = winsA>winsB || (winsA===winsB && (ptsA>ptsB ||
    (ptsA===ptsB && (u16(await sha(cat(seed,new Uint8Array([3]))))%2===0))));

  // stage setup
  $('artA').innerHTML=sel.f.svg; $('wepA').innerHTML=sel.w.svg;
  $('twA').innerHTML= sel.t.img?'<img src="'+sel.t.img+'">':sel.t.emoji;
  $('artB').innerHTML=of.svg; $('wepB').innerHTML=ow.svg;
  $('twB').innerHTML= ot.img?'<img src="'+ot.img+'">':ot.emoji;
  $('nameA').textContent='YOU · '+sel.f.name+' #'+sel.f.i;
  $('nameB').textContent='RIVAL · '+of.name+' #'+of.i;
  ['artA','artB'].forEach(id=>$(id).classList.remove('kod'));
  $('hpA').style.width='100%'; $('hpB').style.width='100%';
  $('dotsA').innerHTML=$('dotsB').innerHTML='<s></s>'.repeat(6);
  $('scorecard').style.display='none'; $('stake').textContent='';
  $('rematchBtn').style.display='none'; $('skipBtn').style.display='';
  $('arena').classList.add('on');
  const say=(t)=>{$('commentary').textContent=t;};
  const wait=async(ms)=>{ if(!skipRequested) await sleep(ms); };

  say('Both gameplans are sealed. The escrow locks. Four inscriptions on the line.');
  await wait(2600);
  let hpA=100,hpB=100;
  const dmgPer = 100/4.4;
  for(let r=0;r<6;r++){
    const R=rounds[r];
    $('roundTitle').textContent='— ROUND '+(r+1)+' OF 6 —';
    $('clash').innerHTML='';
    say('The corners whisper... energy committed: you '+R.eA+' · rival ?');
    await wait(2300);
    // stance reveal
    const mk=(s,who)=>'<div class="stancecard '+s+'" id="sc'+who+'"><span class="big">'+S_ICON[s]+'</span>'+S_NAME[s]+'</div>';
    $('clash').innerHTML=mk(R.sA,'A')+'<div class="vsbig" style="font-size:16px">⚡</div>'+mk(R.sB,'B');
    await sleep(60);
    document.querySelectorAll('.stancecard').forEach(c=>c.classList.add('flip'));
    await wait(1700);
    say('You '+pickLine(R.sA,R.lA)+' Rival '+pickLine(R.sB,R.lB));
    await wait(2200);
    const clashTxt = R.stA>R.stB ? 'Your stance WINS the clash!' :
                     R.stB>R.stA ? 'Rival reads you — stance clash lost!' : 'Stances cancel — pure grit now.';
    say(clashTxt+' Luck: you +'+R.lA+' · rival +'+R.lB);
    await wait(2300);
    if(R.w==='A'){ hpB-=dmgPer*(1+ (R.tA-R.tB)/220); $('artB').classList.add('shake'); $('artA').classList.add('flash');
      $('dotsA').children[r].classList.add('won');
      say('ROUND '+(r+1)+' TO YOU — '+R.tA+' vs '+R.tB+'.'); }
    else if(R.w==='B'){ hpA-=dmgPer*(1+(R.tB-R.tA)/220); $('artA').classList.add('shake'); $('artB').classList.add('flash');
      $('dotsB').children[r].classList.add('won');
      say('Round '+(r+1)+' goes to the rival — '+R.tB+' vs '+R.tA+'.'); }
    else { say('Round '+(r+1)+' is DEAD EVEN at '+R.tA+'.'); }
    $('hpA').style.width=Math.max(iWin?10:2,hpA)+'%';
    $('hpB').style.width=Math.max(iWin?2:10,hpB)+'%';
    setTimeout(()=>{['artA','artB'].forEach(id=>$(id).classList.remove('shake','flash'))},400);
    await wait(2600);
  }
  $('roundTitle').textContent='— THE VERDICT —';
  $('clash').innerHTML='';
  say('Scorecards to the judges... the twins hold their breath.');
  await wait(2400);
  if(iWin){ $('hpB').style.width='0%'; $('artB').classList.add('kod'); }
  else { $('hpA').style.width='0%'; $('artA').classList.add('kod'); }
  const wA=rounds.filter(x=>x.w==='A').length, wB=rounds.filter(x=>x.w==='B').length;
  say('');
  $('commentary').innerHTML = iWin
    ? '<span class="win" style="font-size:16px">VICTORY — '+wA+' rounds to '+wB+'</span>'
    : '<span class="lose" style="font-size:16px">DEFEAT — '+wB+' rounds to '+wA+'</span>';
  // scorecard
  const sc=$('scorecard'); sc.style.display='block';
  sc.innerHTML='<table><tr><th>round</th>'+rounds.map((_,i)=>'<th>R'+(i+1)+'</th>').join('')+'<th>cards/rd</th></tr>'+
    '<tr><td>you</td>'+rounds.map(R=>'<td>'+S_ICON[R.sA]+' e'+R.eA+'<br>'+R.tA+(R.w==='A'?' ✓':'')+'</td>').join('')+'<td>'+mine.share+'</td></tr>'+
    '<tr><td>rival</td>'+rounds.map(R=>'<td>'+S_ICON[R.sB]+' e'+R.eB+'<br>'+R.tB+(R.w==='B'?' ✓':'')+'</td>').join('')+'<td>'+theirs.share+'</td></tr></table>'+
    '<div class="hint" style="margin-top:6px">Round score = cards/rd + stance('+TUNE.STANCE_W+'/'+TUNE.STANCE_TIE+'/0) + energy×'+TUNE.ENERGY_W+' + luck(0-'+(TUNE.LUCK_W-1)+'). '+
    'On mainnet v2: your plan commits at challenge, theirs at accept, yours reveals at resolve — the outcome is born right here, never before.</div>';
  $('stake').innerHTML = iWin
    ? '<span class="win">You take '+of.name+' #'+of.i+' AND their '+ow.name+'. Cornermen walk away untouched. Style is forever.</span>'
    : '<span class="lose">'+sel.f.name+' #'+sel.f.i+' and your '+sel.w.name+' leave with the rival. Your cornerman stays. Reclaim your honour.</span>';
  $('skipBtn').style.display='none';
  $('rematchBtn').style.display='';
  fighting=false;
}
$('fightBtn').onclick=fight;
$('skipBtn').onclick=()=>{skipRequested=true;};
$('rematchBtn').onclick=()=>{ $('arena').classList.remove('on'); window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}); };
$('exitBtn').onclick=()=>$('arena').classList.remove('on');
</script>
</body>
</html>
`;
writeFileSync(OUTFILE, html);
console.log('demo v2 written:', OUTFILE, (Buffer.byteLength(html) / 1024).toFixed(1), 'KB');
