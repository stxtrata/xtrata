import { Kit } from "./runtime.js";
/* faces/opto.js — Opto Leveler (peakRed / gain / mode / hf / mix / out). Faces: A Stablecoin, B Peg, C DCA.
 * Real meter: P.meter().reduction (dB, <= 0). Mode values are 'compress' | 'limit' (option index 0 | 1 in the face). */
(function () {
const MONO = "'JetBrains Mono',ui-monospace,Menlo,Consolas,'Courier New',monospace";
Kit.register('opto', {
  fonts: 'family=Sora:wght@400;600;800&family=JetBrains+Mono:wght@400;600&family=Cinzel:wght@500;700&family=Special+Elite&family=Inter:wght@400;600;800&family=Fraunces:wght@600;800',
  w: 960, h: 560,
  fmts: {
    peakRed: v => String(Math.round(v)),
    gain: v => String(Math.round(v)),
    out: v => (v > 0.04 ? '+' : '') + v.toFixed(1) + ' dB'
  },
  presets: [
    { name: 'Vocal Level', values: { peakRed: 45, gain: 55, mode: 'compress', hf: 0.2, mix: 1, out: 0 } },
    { name: 'Bass Hug', values: { peakRed: 58, gain: 52, mode: 'compress', hf: 0, mix: 1, out: 0 } },
    { name: 'Drum Glue', values: { peakRed: 30, gain: 50, mode: 'compress', hf: 0.1, mix: 0.7, out: 0 } },
    { name: 'Bus Lift', values: { peakRed: 22, gain: 58, mode: 'compress', hf: 0.35, mix: 1, out: -0.5 } },
    { name: 'Parallel Squeeze', values: { peakRed: 85, gain: 64, mode: 'compress', hf: 0.15, mix: 0.4, out: 0 } },
    { name: 'Safety Net', values: { peakRed: 70, gain: 48, mode: 'limit', hf: 0.3, mix: 1, out: -1 } },
    { name: 'Spoken Word', values: { peakRed: 62, gain: 60, mode: 'limit', hf: 0.55, mix: 1, out: -1.5 } }
  ],
  faces: [
    { key: 'A', name: 'Stablecoin', accent: '#34e8a0', w: 960, h: 560, build: buildCoin },
    undefined,
    undefined
  ].filter(Boolean)
});

/* =========================== shared helpers =========================== */
function clampO(x, a, b) { return x < a ? a : x > b ? b : x; }
function lvlO(db) { return clampO((db + 60) / 60, 0, 1); }
function readO(P) {
  const m = P.meter() || {};
  return { red: clampO(-(m.reduction || 0), 0, 40), inDb: P.toDb(m.inPeak || 0), outDb: P.toDb(m.outPeak || 0), sig: (m.inPeak || 0) > 0.003 };
}
function histO(P, n, dt) {
  const gr = new Float32Array(n), inn = new Float32Array(n).fill(-60);
  let last = -1, count = 0, m = readO(P);
  return {
    gr, inn, n, get count() { return count; }, get m() { return m; },
    get quiet() { for (let i = 0; i < n; i++) if (inn[i] > -55) return false; return true; },
    update(t) {
      m = readO(P); if (last < 0) last = t; let k = 0;
      while (t - last >= dt && k < 6) { last += dt; k++; gr.copyWithin(0, 1); inn.copyWithin(0, 1); gr[n - 1] = m.red; inn[n - 1] = m.inDb; count++; }
      if (t - last > dt * 6) last = t;
      return m;
    }
  };
}
function dbTxt(red) { return red < 0.05 ? '0.0 dB' : '−' + red.toFixed(1) + ' dB'; }
function wireO(root, P) {
  root.querySelectorAll('[data-k]').forEach(e => {
    const o = {}; if (e.dataset.abs) { o.abs = true; o.axis = e.dataset.abs; } if (e.dataset.rng) o.range = +e.dataset.rng; if (e.dataset.inv) o.invert = true;
    P.bind(e, e.dataset.k, o);
  });
  root.querySelectorAll('[data-t]').forEach(e => P.text(e, e.dataset.t));
  root.querySelectorAll('[data-byp]').forEach(e => P.bind(e, '__bypass'));
  P.sub('__bypass', on => root.querySelectorAll('[data-bt]').forEach(e => { e.textContent = on ? e.dataset.on : e.dataset.off; }));
  const sels = [...root.querySelectorAll('[data-sel]')];
  sels.forEach(b => b.addEventListener('click', () => P.set(b.dataset.sel, +b.dataset.v)));
  [...new Set(sels.map(b => b.dataset.sel))].forEach(id => P.sub(id, v => sels.forEach(b => { if (b.dataset.sel === id) b.classList.toggle('on', +b.dataset.v === v); })));
  const n = P.presets.length; let idx = -1;
  P.onPreset((i, nm) => {
    idx = i;
    root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || 'Init'; });
    root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'); });
    root.querySelectorAll('[data-pip]').forEach(e => e.classList.toggle('on', +e.dataset.pip === i));
    root.querySelectorAll('[data-pos]').forEach(e => e.style.setProperty('--i', Math.max(i, 0)));
  });
  const step = d => P.loadPreset((idx + d + n) % n);
  root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', e => step(e.shiftKey ? 1 : -1)));
  root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', e => step(e.shiftKey ? -1 : 1)));
  root.querySelectorAll('[data-pip]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pip)));
  root.querySelectorAll('[data-pos]').forEach(b => {
    b.addEventListener('click', e => step(e.shiftKey ? -1 : 1));
    b.addEventListener('wheel', e => { e.preventDefault(); step(e.deltaY > 0 ? 1 : -1); }, { passive: false });
  });
  if (idx < 0 && n) P.loadPreset(0);
}
function pipsO(P) { return P.presets.map((p, i) => `<i data-pip="${i}" title="${p.name}"></i>`).join(''); }
function mkCanvas(root, sel, lw, lh) { const c = root.querySelector(sel); c.width = lw * 2; c.height = lh * 2; c.style.width = lw + 'px'; c.style.height = lh + 'px'; const x = c.getContext('2d'); x.setTransform(2, 0, 0, 2, 0, 0); return x; }
function rr(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }

/* =========================== FACE A — STABLECOIN =========================== */
function buildCoin(root, P) {
  const coin = (id, cap, sub, cls, den) => `<div class="cw ${cls}">
    <div class="coin" data-k="${id}" data-rng="230"><div class="arc"></div><div class="rim"></div>
      <div class="face"><svg class="ring" viewBox="0 0 188 188"><defs><path id="p-${id}" d="M94 94 m-62 0 a62 62 0 1 1 124 0 a62 62 0 1 1 -124 0"/></defs>
        <text><textPath href="#p-${id}" startOffset="0" textLength="380" lengthAdjust="spacing">${cls === 'si' ? '★ IN HEADROOM WE TRUST ★ ONE FOR ONE ★' : '★ FULLY BACKED ★ EVERY DECIBEL ACCOUNTED ★'}</textPath></text></svg>
        <div class="ptr"></div><div class="den"><b data-t="${id}"></b><span>${den}</span></div></div></div>
    <div class="cap">${cap}</div><div class="sub">${sub}</div></div>`;
  root.innerHTML = `<style>
  .a{position:absolute;inset:0;overflow:hidden;background:radial-gradient(ellipse at 50% -8%,#12382d 0,#09160f 52%,#050b09 100%);color:#d6efe5;font-family:'Sora','DM Sans','Helvetica Neue',Arial,sans-serif;--em:#34e8a0;--sv:#dfe8ea}
  .a *{box-sizing:border-box;user-select:none;-webkit-user-select:none}.a>*{position:absolute}
  .a:before{content:"";position:absolute;inset:0;background:repeating-radial-gradient(circle at 50% 135%,rgba(120,255,200,.05) 0 1px,transparent 1px 8px);pointer-events:none}
  header{left:0;top:0;width:960px;height:64px;display:flex;align-items:center;gap:22px;padding:0 24px;border-bottom:1px solid #153a2f;background:linear-gradient(#0c2019cc,#08140fcc)}
  .brand{display:flex;align-items:center;gap:12px;width:292px}
  .brand b{display:block;font-size:21px;font-weight:800;letter-spacing:.17em;color:#fff;line-height:1}
  .brand small{display:block;margin-top:5px;font:400 9px/1 ${MONO};letter-spacing:.13em;color:#5d9784;white-space:nowrap}
  .pb{display:flex;align-items:center;gap:10px;margin-left:auto}
  .pb button{all:unset;cursor:pointer;width:28px;height:28px;border-radius:50%;border:1px solid #2a5c4c;color:var(--em);text-align:center;line-height:26px;font-size:16px}
  .pb button:hover{background:#34e8a024}
  .pbm{width:196px;text-align:center}.pbm b{display:block;font-size:14px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .pbm em{display:block;font:400 9px/1 ${MONO};letter-spacing:.14em;color:#5d9784;margin-top:4px;font-style:normal}
  .pips{display:flex;gap:5px;justify-content:center;margin-top:6px}.pips i{width:8px;height:8px;border-radius:50%;border:1px solid #3f8a72;cursor:pointer}.pips i.on{background:var(--em);box-shadow:0 0 8px var(--em)}
  .mint{all:unset;cursor:pointer;display:flex;align-items:center;gap:9px;height:34px;padding:0 15px;border-radius:17px;border:1px solid #2a5c4c;font:600 11px/1 ${MONO};letter-spacing:.14em;color:#6aa793;margin-left:6px;min-width:134px}
  .mint i{width:9px;height:9px;border-radius:50%;background:#27403a}.mint.on{border-color:var(--em);color:#04120c;background:var(--em)}.mint.on i{background:#04120c}
  .cw{left:30px;top:86px;width:268px;height:330px;text-align:center}
  .cw.si{left:30px}.cw.go{left:662px}
  .coin{position:absolute;left:30px;top:16px;width:208px;height:208px;border-radius:50%;cursor:ns-resize;touch-action:none;outline:none}
  .arc{position:absolute;inset:-13px;border-radius:50%;background:conic-gradient(from -135deg,var(--ac) 0,var(--ac) calc(var(--v)*270deg),#12302a calc(var(--v)*270deg),#12302a 270deg,transparent 270deg);-webkit-mask:radial-gradient(closest-side,transparent 92%,#000 93%);mask:radial-gradient(closest-side,transparent 92%,#000 93%);filter:drop-shadow(0 0 7px var(--ac))}
  .rim{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from 0deg,var(--r1) 0 2deg,var(--r2) 2deg 4deg);box-shadow:0 12px 30px #000a,inset 0 0 0 2px #0006}
  .face{position:absolute;inset:11px;border-radius:50%;background:radial-gradient(circle at 34% 26%,var(--f1),var(--f2) 62%,var(--f3));box-shadow:inset 0 0 0 2px #0003,inset 0 6px 14px #fff6,inset 0 -8px 16px #0003}
  .face:after{content:"";position:absolute;inset:36px;border-radius:50%;border:1.5px solid #0002;box-shadow:inset 0 1px 0 #fff8}
  .ring{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.ring text{font:700 8.5px/1 ${MONO};fill:#3b4a50;opacity:.85}
  .ptr{position:absolute;left:calc(50% - 3.5px);top:4px;width:7px;height:17px;border-radius:3px;background:var(--ac);box-shadow:0 0 6px var(--ac);transform-origin:50% 90px;transform:rotate(calc(-135deg + var(--v)*270deg))}
  .den{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
  .den b{font-size:54px;font-weight:800;color:#1b2a30;letter-spacing:-.02em;line-height:1;text-shadow:0 1px 0 #fff9,0 -1px 0 #0003}
  .den span{font:700 8.5px/1 ${MONO};letter-spacing:.2em;color:#3b4a50;margin-top:7px}
  .coin.drag .rim{filter:brightness(1.12)}
  .si{--ac:#34e8a0;--r1:#f3f7f8;--r2:#8d9ba1;--f1:#ffffff;--f2:#cdd7da;--f3:#9aa8ad}
  .go{--ac:#f0c45a;--r1:#ffe9a0;--r2:#a47d25;--f1:#fff3c4;--f2:#e5c46c;--f3:#b08a2e}
  .cap{position:absolute;left:0;right:0;top:246px;font-weight:800;font-size:13px;letter-spacing:.2em;color:#fff}
  .sub{position:absolute;left:0;right:0;top:268px;font:400 10px/1.35 ${MONO};letter-spacing:.06em;color:#5d9784}
  .mon{left:304px;top:76px;width:352px;height:338px;border:1px solid #17463a;border-radius:14px;background:linear-gradient(#071410,#050d0b);padding:9px 8px 0}
  .mon h4{margin:0 0 5px 4px;font:600 9px/1 ${MONO};letter-spacing:.2em;color:#5d9784;display:flex;justify-content:space-between}
  .mon canvas{display:block;border-radius:8px}
  .stat{display:flex;justify-content:space-between;align-items:center;padding:8px 6px 0}
  .stat b{font-size:12px;font-weight:800;letter-spacing:.18em;color:var(--em)}.stat b.hot{color:#ffb547}.stat b.mute{color:#4d7a6c}
  .stat span{font:600 17px/1 ${MONO};color:#fff}
  .card{top:424px;height:104px;border:1px solid #17463a;border-radius:12px;background:#071410cc;padding:11px 14px}
  .card h5{margin:0 0 9px;font:600 9px/1 ${MONO};letter-spacing:.2em;color:#5d9784;display:flex;justify-content:space-between}.card h5 b{color:#fff;font-weight:600;letter-spacing:.05em}
  .card p{margin:7px 0 0;font:400 9px/1.3 ${MONO};color:#4d7a6c;letter-spacing:.04em}
  .pol button{all:unset;cursor:pointer;display:flex;justify-content:space-between;align-items:center;width:100%;height:25px;padding:0 10px;margin-bottom:4px;border:1px solid #1f4d40;border-radius:8px;font:700 10px/1 ${MONO};letter-spacing:.14em;color:#6aa793}
  .pol button small{font-weight:400;letter-spacing:.04em;opacity:.7}.pol button.on{background:var(--em);border-color:var(--em);color:#04120c}
  .fd{position:relative;height:26px;cursor:ew-resize;touch-action:none;outline:none}
  .fd:before{content:"";position:absolute;left:0;right:0;top:11px;height:4px;border-radius:2px;background:#12302a}
  .fd:after{content:"";position:absolute;left:0;top:11px;height:4px;border-radius:2px;width:calc(var(--v)*100%);background:var(--em);box-shadow:0 0 8px #34e8a077}
  .fd i{position:absolute;top:2px;left:calc(var(--v)*(100% - 22px));width:22px;height:22px;border-radius:50%;z-index:2;background:radial-gradient(circle at 35% 30%,#fff,#aab7bb);border:2px solid #0b1f19;box-shadow:0 2px 6px #000a}
  .mini{position:relative;margin:0 auto;width:54px;height:54px;border-radius:50%;cursor:ns-resize;touch-action:none;outline:none;background:repeating-conic-gradient(#f3f7f8 0 4deg,#8d9ba1 4deg 8deg);box-shadow:0 5px 12px #000a}
  .mini:before{content:"";position:absolute;inset:5px;border-radius:50%;background:radial-gradient(circle at 34% 26%,#fff,#cdd7da 60%,#9aa8ad)}
  .mini:after{content:"";position:absolute;left:calc(50% - 2px);top:6px;width:4px;height:12px;border-radius:2px;background:#0b8f62;transform-origin:50% 21px;transform:rotate(calc(-135deg + var(--v)*270deg))}
  .led{position:relative;height:10px;border-radius:2px;overflow:hidden;background:linear-gradient(90deg,#34e8a0 0,#34e8a0 62%,#f0c45a 80%,#ff6a5c 100%)}
  .led i{position:absolute;right:0;top:0;bottom:0;width:calc((1 - var(--l,0))*100%);background:#09150f}
  .led:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 5px,#071410 5px 7px)}
  .fr{display:grid;grid-template-columns:24px 1fr 58px;align-items:center;gap:8px;margin-bottom:8px;font:600 9px/1 ${MONO};letter-spacing:.1em;color:#5d9784}.fr b{color:#fff;text-align:right;font-weight:600}
  .foot{left:0;width:960px;top:538px;text-align:center;font:400 9px/1 ${MONO};letter-spacing:.24em;color:#3d6a5c}
  </style>
  <div class="a">
   <header>
    <div class="brand"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#dfe8ea" stroke="#8d9ba1" stroke-width="2"/><circle cx="20" cy="20" r="13.5" stroke="#34e8a0" stroke-width="1.5" stroke-dasharray="2.2 2.2"/><path d="M12.5 16.5h15M12.5 23.5h15" stroke="#10382d" stroke-width="3" stroke-linecap="round"/></svg>
      <div><b>STABLECOIN</b><small>OPTO LEVELLER · PEGGED AT UNITY</small></div></div>
    <div class="pb"><button data-prev title="previous preset">‹</button><div class="pbm"><b data-pname></b><em data-pidx></em><div class="pips">${pipsO(P)}</div></div><button data-next title="next preset">›</button></div>
    <button class="mint" data-byp title="effect on / off"><i></i><span data-bt data-on="MINTING" data-off="HALTED"></span></button>
   </header>
   ${coin('peakRed', 'PEG PRESSURE', 'peak reduction · how hard it defends', 'si', 'PRESSURE')}
   <section class="mon"><h4><span>PEG MONITOR</span><span data-rtxt>HISTORY · 17 S</span></h4>
     <canvas id="mon"></canvas>
     <div class="stat"><b id="st">PEG HELD</b><span id="grv">0.0 dB</span></div></section>
   ${coin('gain', 'RESERVE', 'gain · make-up after the squeeze', 'go', 'RESERVE')}
   <section class="card pol" style="left:24px;width:150px"><h5><span>POLICY</span></h5>
     <button data-sel="mode" data-v="0">SOFT PEG <small>compress</small></button><button data-sel="mode" data-v="1">HARD PEG <small>limit</small></button></section>
   <section class="card" style="left:184px;width:160px"><h5><span>ORACLE · HF</span><b data-t="hf"></b></h5><div class="fd" data-k="hf" data-abs="x"><i></i></div><p>feeds the peg bright spikes first</p></section>
   <section class="card" style="left:354px;width:160px"><h5><span>BACKING</span><b data-t="mix"></b></h5><div class="fd" data-k="mix" data-abs="x"><i></i></div><p>dry ↔ wet · 100% = fully backed</p></section>
   <section class="card" style="left:524px;width:128px;text-align:center"><h5><span>REDEEM</span><b data-t="out"></b></h5><div class="mini" data-k="out" data-rng="150"></div></section>
   <section class="card" style="left:662px;width:274px"><h5><span>CIRCULATION</span><b id="def">0.0 dB</b></h5>
     <div class="fr">IN<div class="led" id="li"><i></i></div><b id="ti">-∞</b></div><div class="fr">OUT<div class="led" id="lo"><i></i></div><b id="to">-∞</b></div></section>
   <div class="foot">1.00 = 1.00 · ISSUED BY HEADROOM · SLOW TO PANIC, SLOWER TO RELEASE</div>
  </div>`;
  const $ = s => root.querySelector(s);
  wireO(root, P);
  const cx = mkCanvas(root, '#mon', 336, 264), H = histO(P, 202, 85);
  const hatch = document.createElement('canvas'); hatch.width = hatch.height = 8; { const g = hatch.getContext('2d'); g.strokeStyle = 'rgba(255,181,71,.55)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-2, 10); g.lineTo(10, -2); g.stroke(); }
  const pat = cx.createPattern(hatch, 'repeat');
  const TOP = 22, PEG = 112, BOT = 250, SC = (PEG - TOP) / 18, HX0 = 30, HX1 = 232, TX0 = 262, TX1 = 318;
  let cap = 0, li = 0, lo = 0;
  P.raf(t => {
    const m = H.update(t), c = cx;
    cap += (m.red - cap) * 0.5;
    c.fillStyle = '#050d0b'; c.fillRect(0, 0, 336, 264);
    const eg = c.createLinearGradient(0, PEG, 0, BOT); eg.addColorStop(0, 'rgba(52,232,160,.12)'); eg.addColorStop(1, 'rgba(52,232,160,.02)'); c.fillStyle = eg; c.fillRect(HX0, PEG, HX1 - HX0, BOT - PEG);
    c.font = '9px ' + MONO; c.textBaseline = 'middle'; c.textAlign = 'left';
    for (let d = 3; d <= 18; d += 3) { const y = PEG - d * SC; c.strokeStyle = 'rgba(120,255,200,.08)'; c.lineWidth = 1; c.beginPath(); c.moveTo(HX0, y); c.lineTo(HX1, y); c.stroke(); c.fillStyle = '#4f7d6e'; c.fillText(String(d), 8, y); }
    for (let k = 0; k <= 4; k++) { const x = HX0 + (HX1 - HX0) * k / 4; c.strokeStyle = 'rgba(120,255,200,.05)'; c.beginPath(); c.moveTo(x, TOP); c.lineTo(x, BOT); c.stroke(); }
    const n = H.n, dx = (HX1 - HX0) / (n - 1), yy = v => PEG - clampO(v, 0, 18) * SC;
    const ag = c.createLinearGradient(0, TOP, 0, PEG); ag.addColorStop(0, 'rgba(255,106,92,.6)'); ag.addColorStop(1, 'rgba(255,181,71,.12)');
    c.beginPath(); c.moveTo(HX0, PEG); for (let i = 0; i < n; i++) c.lineTo(HX0 + i * dx, yy(H.gr[i])); c.lineTo(HX1, PEG); c.closePath(); c.fillStyle = ag; c.fill();
    c.beginPath(); for (let i = 0; i < n; i++) { const x = HX0 + i * dx, y = yy(H.gr[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.strokeStyle = '#ffb547'; c.lineWidth = 1.6; c.stroke();
    c.setLineDash([4, 4]); c.strokeStyle = '#34e8a0'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(HX0, PEG); c.lineTo(TX0, PEG); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#34e8a0'; c.font = '700 10px ' + MONO; c.fillText('1.00', 4, PEG + 11);
    c.fillStyle = '#4f7d6e'; c.font = '8px ' + MONO; c.fillText('HELD AT PEG', HX0 + 6, PEG + 14);
    c.beginPath(); for (let i = 0; i < n; i++) { const x = HX0 + i * dx, y = BOT - lvlO(H.inn[i]) * (BOT - PEG - 40); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.strokeStyle = 'rgba(160,230,205,.55)'; c.lineWidth = 1; c.stroke();
    c.fillStyle = '#4f7d6e'; c.fillText('MARKET LEVEL IN', HX0 + 6, BOT - 6); c.fillText('dB ABOVE PEG = PRESSURE ABSORBED', HX0 + 6, TOP - 8);
    // connector to tube
    const cy = yy(cap); c.setLineDash([2, 3]); c.strokeStyle = 'rgba(255,181,71,.7)'; c.beginPath(); c.moveTo(HX1, yy(H.gr[n - 1])); c.lineTo(TX0 + 6, cy); c.stroke(); c.setLineDash([]);
    // tube
    c.save(); rr(c, TX0, 12, TX1 - TX0, 246, 26); c.fillStyle = '#0a1a15'; c.fill(); c.clip();
    const lg = c.createLinearGradient(0, PEG, 0, 258); lg.addColorStop(0, '#2ee59d'); lg.addColorStop(1, '#0a6a4d'); c.fillStyle = lg;
    c.beginPath(); c.moveTo(TX0, 258); c.lineTo(TX0, PEG); for (let x = 0; x <= TX1 - TX0; x += 4) c.lineTo(TX0 + x, PEG + Math.sin(t / 380 + x / 7) * 1.4); c.lineTo(TX1, 258); c.closePath(); c.fill();
    for (let k = 0; k < 7; k++) { const sp = 0.012 + k * 0.004, y = 256 - ((t * sp + k * 31) % (256 - PEG)); c.strokeStyle = 'rgba(210,255,235,.55)'; c.lineWidth = 1; c.beginPath(); c.arc(TX0 + 9 + ((k * 23) % 38), y, 1.4 + (k % 3), 0, 6.3); c.stroke(); }
    c.fillStyle = pat; c.fillRect(TX0 + 4, cy, TX1 - TX0 - 8, PEG - cy);
    c.fillStyle = 'rgba(255,181,71,.22)'; c.fillRect(TX0 + 4, cy, TX1 - TX0 - 8, PEG - cy);
    c.fillStyle = '#ffd37a'; c.fillRect(TX0 + 4, cy - 1, TX1 - TX0 - 8, 2.5);
    c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(TX0 + 7, 20, 7, 232);
    c.restore();
    rr(c, TX0, 12, TX1 - TX0, 246, 26); c.strokeStyle = 'rgba(190,230,215,.65)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#34e8a0'; c.beginPath(); c.moveTo(TX1 + 3, PEG); c.lineTo(TX1 + 12, PEG - 5); c.lineTo(TX1 + 12, PEG + 5); c.closePath(); c.fill();
        if (H.quiet) { c.fillStyle = '#5d9784'; c.font = '700 9px ' + MONO; c.textAlign = 'left'; c.fillText('NO FLOW — AWAITING SIGNAL', HX0 + 6, PEG + 52); }
    // status
    const st = $('#st'); const s = !m.sig && cap < 0.2 ? ['NO FLOW', 'mute'] : cap < 0.6 ? ['PEG HELD', ''] : cap < 6 ? ['DEFENDING', 'hot'] : ['HEAVY DEFENCE', 'hot'];
    if (st.textContent !== s[0]) { st.textContent = s[0]; st.className = s[1]; }
    $('#grv').textContent = dbTxt(cap); $('#def').textContent = dbTxt(cap);
    li = Math.max(lvlO(m.inDb), li - 0.02); lo = Math.max(lvlO(m.outDb), lo - 0.02);
    $('#li').style.setProperty('--l', li); $('#lo').style.setProperty('--l', lo);
    $('#ti').textContent = m.inDb < -59 ? '−∞' : m.inDb.toFixed(1); $('#to').textContent = m.outDb < -59 ? '−∞' : m.outDb.toFixed(1);
  });
}

/* =========================== FACE B — PEG =========================== */


/* =========================== FACE C — DCA =========================== */

})();
