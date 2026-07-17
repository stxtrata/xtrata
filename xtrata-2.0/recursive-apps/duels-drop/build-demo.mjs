#!/usr/bin/env node
/**
 * Builds the self-contained playable demo (public/duels/demo/index.html) from
 * the generated drop. Embeds every fighter/weapon SVG plus its REAL sha256 so
 * the demo derives stats exactly like the contract will on mainnet.
 *
 * Usage: node build-demo.mjs [--in ./out] [--outfile ./demo-index.html]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const IN = opt('in', './out');
const OUTFILE = opt('outfile', './demo-index.html');

const manifest = JSON.parse(readFileSync(join(IN, 'manifest.json'), 'utf8'));
const load = (dir, e) => {
  const svg = readFileSync(join(IN, dir, e.file), 'utf8');
  const sha = createHash('sha256').update(svg).digest('hex');
  if (sha !== e.sha256) throw new Error(`hash drift for ${e.file}`);
  return { i: e.index, cls: e.class, pal: e.palette, svg, hash: e.sha256 };
};
const fighters = manifest.fighters.map((e) => load('fighters', e));
const weapons = manifest.weapons.map((e) => load('weapons', e));
// Demo twins: stand-ins for Forever Twins (hash from a label; on mainnet the
// twin hash comes from the helper binding).
const TWINS = ['Bitcoin Pepe #77', 'LeoCat #12', 'Miami Degen #4', 'Bitcoin Pepe #300'].map((name, idx) => ({
  i: idx + 1, name,
  hash: createHash('sha256').update('demo-twin:' + name).digest('hex'),
  emoji: ['🐸', '🐱', '🦩', '🐸'][idx]
}));

const DATA = JSON.stringify({ fighters, weapons, twins: TWINS });

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>XTRATA DUELS — playable demo</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; background:radial-gradient(1200px 600px at 50% -10%, #101b3d 0%, #07091a 60%); color:#dfe8ff; font-family: ui-monospace,'Courier New',monospace; min-height:100vh; }
  header { text-align:center; padding:26px 16px 8px; }
  h1 { margin:0; font-size:clamp(22px,4vw,34px); letter-spacing:0.18em; color:#8fd0ff; text-shadow:0 0 24px rgba(90,170,255,.6); }
  .sub { color:#7d8db8; font-size:12px; margin-top:6px; }
  .demo-tag { display:inline-block; margin-top:8px; padding:3px 12px; border:1px solid #8a742f; color:#ffd561; border-radius:20px; font-size:11px; letter-spacing:.1em; }
  main { max-width:1150px; margin:0 auto; padding:14px; }
  section { border:1px solid #1d2c47; border-radius:14px; background:rgba(10,18,35,.85); padding:16px; margin-bottom:16px; }
  section h2 { margin:0 0 4px; font-size:13px; letter-spacing:.12em; color:#9fc2ff; text-transform:uppercase; }
  .hint { color:#7d8db8; font-size:12px; line-height:1.5; }
  .cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(96px,1fr)); gap:10px; margin-top:10px; max-height:300px; overflow:auto; padding:4px; }
  .card { border:1px solid #2a3a63; border-radius:10px; background:#0e1730; padding:6px; cursor:pointer; transition:transform .08s, box-shadow .08s; }
  .card:hover { transform:translateY(-3px); }
  .card.sel { border-color:#61ff9e; box-shadow:0 0 14px rgba(97,255,158,.4); }
  .card .art { width:100%; aspect-ratio:1; border-radius:6px; overflow:hidden; }
  .card .art svg { width:100%; height:100%; }
  .card .cid { font-size:10px; color:#8fd0ff; margin-top:5px; }
  .card .stat { font-size:10px; color:#9db4e8; }
  .bar { height:4px; border-radius:2px; background:#182448; overflow:hidden; margin-top:3px; }
  .bar i { display:block; height:100%; background:linear-gradient(90deg,#3a7bff,#61ff9e); }
  .twinrow { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
  .twin { border:1px solid #2a3a63; border-radius:10px; background:#0e1730; padding:10px 14px; cursor:pointer; font-size:12px; }
  .twin.sel { border-color:#ffd561; box-shadow:0 0 12px rgba(255,213,97,.35); }
  .twin .e { font-size:22px; }
  .fightbar { position:sticky; bottom:0; display:flex; gap:12px; align-items:center; padding:14px; background:rgba(7,9,26,.95); border-top:1px solid #1d2c47; justify-content:center; }
  .bigbtn { font-size:16px; letter-spacing:.14em; padding:12px 34px; border-radius:10px; border:1px solid #2f8a52; background:linear-gradient(180deg,#1b4d2e,#123320); color:#a8ffc9; cursor:pointer; }
  .bigbtn:disabled { opacity:.4; cursor:default; }
  .bigbtn:hover:not(:disabled) { box-shadow:0 0 18px rgba(97,255,158,.4); }
  #picksum { font-size:12px; color:#9db4e8; }
  /* arena */
  #arena { display:none; position:fixed; inset:0; background:rgba(3,4,12,.97); z-index:60; align-items:center; justify-content:center; }
  #arena.on { display:flex; }
  .stage { width:min(96vw,860px); border:1px solid #33518f; border-radius:16px; background:linear-gradient(180deg,#0d1530,#080c1e); padding:24px; }
  .vsrow { display:flex; gap:14px; align-items:flex-start; justify-content:space-between; }
  .corner { flex:1; text-align:center; }
  .corner .pit { position:relative; width:min(38vw,220px); margin:0 auto; }
  .corner .pit .f { width:100%; aspect-ratio:1; border-radius:12px; overflow:hidden; border:1px solid #2a3a63; background:#000; }
  .corner .pit .f svg { width:100%; height:100%; }
  .corner .pit .w { position:absolute; right:-8px; bottom:-8px; width:38%; aspect-ratio:1; border-radius:8px; overflow:hidden; border:1px solid #33518f; background:#000; }
  .corner .pit .w svg { width:100%; height:100%; }
  .corner .pit .tw { position:absolute; left:-8px; top:-8px; font-size:26px; filter:drop-shadow(0 0 6px rgba(255,213,97,.8)); }
  .hp { height:14px; border-radius:7px; background:#182448; overflow:hidden; margin-top:12px; border:1px solid #2a3a63; }
  .hp i { display:block; height:100%; width:100%; background:linear-gradient(90deg,#ff5d5d,#ffd561 45%,#61ff9e); transition:width .3s; }
  .cname { font-size:12px; color:#9fc2ff; margin-top:8px; }
  .vsbig { align-self:center; font-size:30px; color:#8fd0ff; text-shadow:0 0 16px rgba(90,170,255,.7); padding:0 4px; }
  #announcer { text-align:center; min-height:44px; margin-top:14px; font-size:15px; color:#ffd561; }
  #breakdown { display:none; margin-top:12px; font-size:12px; color:#9db4e8; border-top:1px solid #1d2c47; padding-top:10px; }
  #breakdown table { width:100%; border-collapse:collapse; }
  #breakdown td, #breakdown th { padding:4px 8px; text-align:center; border-bottom:1px solid #14203f; }
  #breakdown th { color:#7d8db8; font-size:10px; text-transform:uppercase; letter-spacing:.08em; }
  .stakebanner { text-align:center; margin-top:12px; font-size:13px; }
  .win { color:#61ff9e; } .lose { color:#ff8a8a; }
  .arena-actions { display:flex; gap:10px; justify-content:center; margin-top:16px; }
  .shake { animation: shake .3s; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
  .flash { animation: flash .3s; }
  @keyframes flash { 50%{filter:brightness(2.4) saturate(1.6)} }
  .kod { filter:grayscale(1) brightness(.5); transform:rotate(90deg); transition: all .7s; }
</style>
</head>
<body>
<header>
  <h1>XTRATA DUELS</h1>
  <div class="sub">stake your inscriptions · winner takes all · your Forever Twin blesses, never bleeds</div>
  <div class="demo-tag">PLAYABLE DEMO — real drop art, real stat formula, simulated chain</div>
</header>
<main>
  <section>
    <h2>1 · Choose your fighter</h2>
    <p class="hint">All 100 fighters from the first drop. PWR comes from each SVG's sha256 content hash, the exact
    number the Clarity contract derives on mainnet. On-chain you'd hold one; here, take your pick.</p>
    <div class="cards" id="fGrid"></div>
  </section>
  <section>
    <h2>2 · Choose your relic</h2>
    <div class="cards" id="wGrid"></div>
  </section>
  <section>
    <h2>3 · Your Forever Twin</h2>
    <p class="hint">The twin joins your corner and adds its blessing. It is never staked; win or lose it stays yours.</p>
    <div class="twinrow" id="tRow"></div>
  </section>
</main>
<div class="fightbar">
  <span id="picksum">pick a fighter, a relic and a twin</span>
  <button class="bigbtn" id="fightBtn" disabled>FIGHT</button>
</div>

<div id="arena">
  <div class="stage">
    <div class="vsrow">
      <div class="corner">
        <div class="pit"><div class="f" id="artA"></div><div class="w" id="wepA"></div><div class="tw" id="twA"></div></div>
        <div class="hp"><i id="hpA"></i></div><div class="cname" id="nameA"></div>
      </div>
      <div class="vsbig">VS</div>
      <div class="corner">
        <div class="pit"><div class="f" id="artB"></div><div class="w" id="wepB"></div><div class="tw" id="twB"></div></div>
        <div class="hp"><i id="hpB"></i></div><div class="cname" id="nameB"></div>
      </div>
    </div>
    <div id="announcer"></div>
    <div id="breakdown"></div>
    <div class="stakebanner" id="stake"></div>
    <div class="arena-actions">
      <button class="bigbtn" id="rematchBtn">REMATCH</button>
      <button class="bigbtn" id="exitBtn" style="border-color:#33518f;background:#12204a;color:#cfe0ff">BACK</button>
    </div>
  </div>
</div>

<script>
const DROP = ${DATA};
const $ = (id) => document.getElementById(id);
const hex = (s) => { const o = new Uint8Array(s.length/2); for (let i=0;i<s.length;i+=2) o[i/2]=parseInt(s.substr(i,2),16); return o; };
const u16 = (b,i=0) => (b[i]<<8)|b[i+1];
const cat = (...a) => { const o=new Uint8Array(a.reduce((n,x)=>n+x.length,0)); let p=0; for(const x of a){o.set(x,p);p+=x.length;} return o; };
const sha = async (b) => new Uint8Array(await crypto.subtle.digest('SHA-256', b));

/* PARITY-LOCKED with xtrata-arcade-duels-v1.clar */
const derive = {
  pwr: (h) => u16(h)%100, dmg: (h) => u16(h)%60, bless: (h) => u16(h)%40, style: (h) => h[3]%4
};
async function loadout(fh, wh, th, seed, side) {
  const base=derive.pwr(fh), wpn=derive.dmg(wh), twin=derive.bless(th);
  const synergy = ((fh[3]^wh[3])%4===0)?20:0;
  const luck = u16(await sha(cat(seed, new Uint8Array([side]))))%120;
  return { base, wpn, twin, synergy, luck, total: base+wpn+twin+synergy+luck };
}

const sel = { f:null, w:null, t:null };
function card(entry, grid, kind) {
  const h = hex(entry.hash);
  const el = document.createElement('div');
  el.className = 'card';
  const stat = kind==='f' ? derive.pwr(h) : derive.dmg(h);
  const max = kind==='f' ? 99 : 59;
  el.innerHTML = '<div class="art">'+entry.svg+'</div>' +
    '<div class="cid">#'+entry.i+' '+entry.cls+'</div>' +
    '<div class="stat">'+(kind==='f'?'PWR ':'DMG ')+stat+' · sty '+derive.style(h)+'</div>' +
    '<div class="bar"><i style="width:'+Math.round(stat/max*100)+'%"></i></div>';
  el.onclick = () => {
    grid.querySelectorAll('.card').forEach(c=>c.classList.remove('sel'));
    el.classList.add('sel');
    sel[kind] = entry; syncPick();
  };
  grid.appendChild(el);
}
DROP.fighters.forEach(f=>card(f, $('fGrid'), 'f'));
DROP.weapons.forEach(w=>card(w, $('wGrid'), 'w'));
DROP.twins.forEach(t=>{
  const h = hex(t.hash);
  const el = document.createElement('div');
  el.className='twin';
  el.innerHTML = '<span class="e">'+t.emoji+'</span> '+t.name+'<br><span class="stat" style="color:#ffd561">BLESS '+derive.bless(h)+'</span>';
  el.onclick = () => { document.querySelectorAll('.twin').forEach(x=>x.classList.remove('sel')); el.classList.add('sel'); sel.t=t; syncPick(); };
  $('tRow').appendChild(el);
});
function syncPick(){
  const ok = sel.f && sel.w && sel.t;
  $('fightBtn').disabled = !ok;
  $('picksum').textContent = ok
    ? 'ready: fighter #'+sel.f.i+' + '+sel.w.cls+' #'+sel.w.i+' + '+sel.t.name
    : 'pick a fighter, a relic and a twin';
}

const sleep = (ms) => new Promise(r=>setTimeout(r,ms));
let lastSeed = null;
async function fight(reuseSeed) {
  // opponent: random loadout that isn't yours
  let of, ow, ot;
  do { of = DROP.fighters[Math.floor(Math.random()*DROP.fighters.length)]; } while (of===sel.f);
  do { ow = DROP.weapons[Math.floor(Math.random()*DROP.weapons.length)]; } while (ow===sel.w);
  do { ot = DROP.twins[Math.floor(Math.random()*DROP.twins.length)]; } while (ot===sel.t);
  // seed: on mainnet this is sha256(block-header-hash || duel-id); here random but replayable
  const seed = reuseSeed || crypto.getRandomValues(new Uint8Array(32));
  lastSeed = seed;
  const me = await loadout(hex(sel.f.hash), hex(sel.w.hash), hex(sel.t.hash), seed, 1);
  const op = await loadout(hex(of.hash), hex(ow.hash), hex(ot.hash), seed, 2);
  let iWin = me.total > op.total;
  if (me.total === op.total) iWin = (u16(await sha(cat(seed, new Uint8Array([3]))))%2)===0;

  $('artA').innerHTML = sel.f.svg; $('wepA').innerHTML = sel.w.svg; $('twA').textContent = sel.t.emoji;
  $('artB').innerHTML = of.svg;   $('wepB').innerHTML = ow.svg;   $('twB').textContent = ot.emoji;
  $('nameA').textContent = 'YOU · #'+sel.f.i+' '+sel.f.cls;
  $('nameB').textContent = 'RIVAL · #'+of.i+' '+of.cls;
  ['artA','artB'].forEach(id=>$(id).classList.remove('kod'));
  $('hpA').style.width='100%'; $('hpB').style.width='100%';
  $('breakdown').style.display='none'; $('stake').textContent='';
  $('arena').classList.add('on');
  const ann = $('announcer');
  ann.textContent = 'The escrow locks. Four inscriptions on the line...';
  await sleep(1100);

  // choreography: 7 seeded exchanges; damage scaled so the true winner lands the KO
  let hpA=100, hpB=100;
  const adv = (me.total-op.total)/Math.max(me.total,op.total,1);
  for (let i=0;i<7;i++){
    const rb = await sha(cat(seed, new Uint8Array([32+i])));
    const meHits = rb[0]%2===0;
    const dmg = 7+(rb[1]%11);
    const toB = Math.max(3, Math.round(dmg*(1+adv)));
    const toA = Math.max(3, Math.round(dmg*(1-adv)));
    await sleep(620);
    if (meHits){ hpB-=toB; $('artB').classList.add('shake'); $('artA').classList.add('flash');
      ann.textContent = 'R'+(i+1)+' — your '+sel.w.cls+' connects for '+toB+'!'; }
    else { hpA-=toA; $('artA').classList.add('shake'); $('artB').classList.add('flash');
      ann.textContent = 'R'+(i+1)+' — rival '+ow.cls+' bites for '+toA+'!'; }
    $('hpA').style.width=Math.max(iWin?8:0,hpA)+'%';
    $('hpB').style.width=Math.max(iWin?0:8,hpB)+'%';
    setTimeout(()=>{['artA','artB'].forEach(id=>$(id).classList.remove('shake','flash'))},350);
  }
  await sleep(700);
  ann.textContent = 'The twins lean in... luck reveals: you '+me.luck+' vs rival '+op.luck;
  await sleep(1200);
  if (iWin){ $('hpB').style.width='0%'; $('artB').classList.add('kod'); }
  else { $('hpA').style.width='0%'; $('artA').classList.add('kod'); }
  ann.innerHTML = iWin
    ? '<span class="win">K.O. — YOU WIN THE DUEL</span>'
    : '<span class="lose">K.O. — YOUR RIVAL TAKES IT</span>';
  const bd = $('breakdown');
  bd.style.display='block';
  bd.innerHTML = '<table><tr><th></th><th>base</th><th>weapon</th><th>twin</th><th>synergy</th><th>luck</th><th>total</th></tr>' +
    '<tr><td>you</td><td>'+me.base+'</td><td>'+me.wpn+'</td><td>'+me.twin+'</td><td>'+me.synergy+'</td><td>'+me.luck+'</td><td><b>'+me.total+'</b></td></tr>' +
    '<tr><td>rival</td><td>'+op.base+'</td><td>'+op.wpn+'</td><td>'+op.twin+'</td><td>'+op.synergy+'</td><td>'+op.luck+'</td><td><b>'+op.total+'</b></td></tr></table>' +
    '<div class="hint" style="margin-top:6px">On mainnet this exact table is computed inside the Clarity contract from the block-hash seed; the fight you just watched is the deterministic replay of it.</div>';
  $('stake').innerHTML = iWin
    ? '<span class="win">You claim rival fighter #'+of.i+' and '+ow.cls+' #'+ow.i+'. Both twins walk away untouched.</span>'
    : '<span class="lose">Your fighter #'+sel.f.i+' and '+sel.w.cls+' #'+sel.w.i+' leave with the rival. '+sel.t.name+' stays with you.</span>';
}
$('fightBtn').onclick = () => fight();
$('rematchBtn').onclick = () => fight();
$('exitBtn').onclick = () => $('arena').classList.remove('on');
</script>
</body>
</html>
`;
writeFileSync(OUTFILE, html);
console.log('demo written:', OUTFILE, (Buffer.byteLength(html) / 1024).toFixed(1), 'KB');
