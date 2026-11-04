
/* ---------- The cabinet screen: a mining-rig control panel in raw concrete and black steel, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
function wall(g) { concrete(g, 0, 0, 1400, 960, 5, '#5d5a55'); // board-formed concrete: the plank lines and tie holes of the formwork
  g.save(); for (let y = 0; y < 960; y += 120) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, y, 1400, 2); g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(0, y + 2, 1400, 1); } for (let y = 60; y < 960; y += 240) for (let x = 100; x < 1400; x += 400) { g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.arc(x - 1, y - 1, 3, 0, 7); g.fill(); } g.restore();
  const v = g.createRadialGradient(700, 480, 300, 700, 480, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960); }
function ibeam(g, x, y, w, h) { brushed(g, x, y, w, h, '#1b1d21', Math.round(x + y)); g.fillStyle = '#ffffff12'; g.fillRect(x, y, w, 2); g.fillStyle = '#00000088'; g.fillRect(x, y + h - 2, w, 2); }
(function drawBase() { const g = baseLayer.getContext('2d'); wall(g);
  // the steel frame round the reels, with hazard tape and bolts
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 30; round(g, RX - 24, RY - 26, RW + 48, RH + 52, 6, '#121417'); g.restore();
  ibeam(g, RX - 24, RY - 26, RW + 48, 16); ibeam(g, RX - 24, RY + RH + 10, RW + 48, 16);
  hazard(g, RX - 24, RY + RH + 26, RW + 48, 6, .85);
  for (let x = RX - 10; x < RX + RW + 20; x += 82) { rivet(g, x, RY - 18, 4); rivet(g, x, RY + RH + 18, 4); }
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#1d2024', '#121417', '#1d2024']); g.fillRect(RX + c * CW, RY, CW - 3, RH); g.fillStyle = '#ffffff06'; for (let y = RY; y < RY + RH; y += 6) g.fillRect(RX + c * CW, y, CW - 3, 1); }
  // the ticker rail across the bottom
  round(g, 30, 840, 1340, 44, 4, '#08090b', '#2c3036', 2);
  g.fillStyle = '#ffffff10'; g.fillRect(45, 900, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
function glowText(g, s, x, y, size, color, glow = color, weight = '800', align = 'center', font = COND) { g.save(); g.shadowColor = glow; g.shadowBlur = size * .35; text(g, s, x, y, size, color, font, align, weight); g.restore(); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 240) : 0, col = opts.col || AMBER;
  g.save(); g.shadowColor = col; g.shadowBlur = 10 + pulse * 18; round(g, x, y, w, h, 8, opts.ghost ? '#0b0c0eee' : lin(g, x, y, x, y + h, [opts.col2 || AMBER2, col, opts.col3 || AMBER3]), col, 3); g.restore();
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 26, opts.ghost ? (opts.col2 || AMBER2) : INK, COND, 'center', '800'); hits.push({ id, x, y, w, h, fn }); }
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function highlightIndex(now) { return !spinning && !feature() && !pres && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
function drawReels(now, cycle) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (cycle) { sg.fillStyle = c % 2 ? '#211a07' : '#2a210a'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = AMBER; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 8, null, AMBER2, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 8, null, AMBER2, 4);
    // the payline as a powered cable: amber core with LED nodes at each block
    sg.save(); sg.shadowColor = LED; sg.shadowBlur = 14; sg.lineWidth = 6; sg.strokeStyle = '#000c'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.lineWidth = 3; sg.strokeStyle = AMBER; sg.stroke(); sg.shadowBlur = 0;
    line.forEach((r, c) => { if (c < w.count) { sg.fillStyle = LED; sg.beginPath(); sg.arc(RX + (c + .5) * CW, RY + (r + .5) * RHT, 8, 0, 7); sg.fill(); sg.fillStyle = '#fff4c8'; sg.beginPath(); sg.arc(RX + (c + .5) * CW - 2, RY + (r + .5) * RHT - 2, 3, 0, 7); sg.fill(); } }); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#ffd23f55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* ---------- The block ticker: real recent block heights and their pools, running along the bottom of the screen ---------- */
function drawTicker(now, y = 862) {
  const list = chain.recent.length ? chain.recent : REC.recent || []; if (!list.length) return;
  sg.save(); sg.beginPath(); sg.rect(34, y - 20, 1332, 40); sg.clip(); sg.font = `700 17px ${MONO}`; sg.textBaseline = 'middle'; sg.textAlign = 'left';
  const items = list.slice(0, 16).map(b => `#${fmt(b.height)} ${String(b.pool || '').toUpperCase()}`), widths = items.map(s => sg.measureText(s).width + 64), total = widths.reduce((a, b) => a + b, 0);
  let x = 40 - ((reduced() ? 0 : now / 30) % total);
  for (let pass = 0; pass < 3 && x < 1366; pass++) items.forEach((s, i) => { if (x < 1366 && x + widths[i] > 30) { cube(sg, x + 14, y + 2, 9, i ? AMBER : GREEN2, i ? '#9c7a0c' : '#2f7a4f', i ? '#6b5308' : '#1d4d33'); sg.fillStyle = i ? '#e8dcb0' : GREEN2; sg.fillText(s, x + 32, y + 1); } x += widths[i]; });
  sg.restore();
  text(sg, staleTag(), 1352, y - 13, 9, chain.stale ? RED2 : GREEN2, MONO, 'right', '700');
}
/* ---------- HUD: the name plate, the 21 Million jackpot meter on split flaps, and the Epoch Pot ---------- */
function potText() { if (!Number.isFinite(sources.twins)) return sources.registry === 'pending' ? 'COUNTING TWINS…' : 'TWINS UNKNOWN'; if (!sources.twins) return 'NO TWINS COUNTED'; const sh = potShare(); return `≈ ${fmt(sh)} LAYR PER TWIN · ${fmt(sources.twins)} TWINS`; }
function drawHud(now, bet, cycle) {
  const left = blocksLeft(), ep = epochLeft();
  // name plate
  round(sg, 30, 24, 380, 152, 6, '#0d0e10e6', '#3b4047', 2); hazard(sg, 30, 24, 380, 10, .9);
  glowText(sg, 'THE HALVING', 220, 74, 56, AMBER, LED); text(sg, cycle ? 'HALVING CYCLE · ALL WINS 2×' : 'EVERY 210,000 BLOCKS · 20 LINES', 220, 112, 15, cycle ? AMBER2 : SMOKE, MONO, 'center', '700');
  text(sg, Number.isFinite(left) ? `NEXT HALVING IN ${fmt(left)} BLOCKS` : 'NEXT HALVING · TIP UNKNOWN', 220, 144, 17, chain.stale ? '#ffb3aa' : '#fff6d0', COND, 'center', '800');
  text(sg, staleTag(), 220, 164, 10, chain.stale ? RED2 : GREEN2, MONO, 'center', '700');
  // jackpot meter on split flaps
  if (!cycle) { round(sg, 450, 24, 500, 152, 6, '#060708', AMBER3, 3); round(sg, 458, 32, 484, 136, 4, null, '#ffd23f44', 1.5);
    spaced(sg, '21 MILLION JACKPOT', 700, 52, 18, 4, AMBER2, '800'); flapCells(sg, fmt(Math.round(E.meter(state, bet))), 700, 106, 58, { w: .6, col: '#fff6d0' }); text(sg, `LAYR · ${fmt(bet)} BET LEVEL`, 700, 154, 14, SMOKE, MONO, 'center', '700'); }
  // the Epoch Pot
  round(sg, 990, 24, 380, 152, 6, '#0d0e10e6', '#3b4047', 2);
  text(sg, 'EPOCH POT', 1180, 48, 18, AMBER2, COND, 'center', '800'); glowText(sg, fmt(state.pot), 1180, 86, 36, '#fff', AMBER, '800', 'center', COND);
  text(sg, Number.isFinite(ep) ? `EPOCH ${fmt(epochOf(tipNow()))} · ${fmt(ep)} BLOCKS LEFT` : 'EPOCH · TIP UNKNOWN', 1180, 118, 14, '#cfd5dc', MONO, 'center', '700');
  text(sg, potText(), 1180, 140, 12, SMOKE, MONO, 'center', '700');
  text(sg, state.lastPot ? `LAST EPOCH: ${state.lastPot.perTwin != null ? fmt(state.lastPot.perTwin) + ' LAYR PER TWIN' : fmt(state.lastPot.pot) + ' LAYR'}` : 'PAID PER TWIN AT EACH DIFFICULTY ADJUSTMENT', 1180, 160, 10, SMOKE, MONO, 'center', '700');
  drawTicker(now);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 922, 26, PAPER, COND, 'left', '800'); text(sg, `HASH  ${fmt(bet)}`, 700, 922, 26, PAPER, COND, 'center', '800'); text(sg, `${cycle ? 'CYCLE WIN' : 'WIN'}  ${fmt(cycle ? state.freeTotal : state.lastWin)}`, 1332, 922, 26, AMBER2, COND, 'right', '800');
}
/* ---------- Halving Cycle (free spins): the subsidy era steps 50 → 3.125 as the spins run; a coin splits at each step ---------- */
function cycleEra(p) { const total = (p.spins || 0) + Math.max(0, state.free), done = p.spins || 0; return total ? Math.min(4, Math.floor(done / total * 5)) : 0; }
function drawCycleBackdrop(now) {
  const g = sg; g.drawImage(baseLayer, 0, 0); g.fillStyle = 'rgba(40,30,0,.35)'; g.fillRect(0, 0, 1400, 960);
  const p = pres, era = cycleEra(p);
  if (p.era !== era) { if (p.era != null && p.era < era) { p.split = now; sound('split'); } p.era = era; }
  // the era timeline across the top: 50 → 25 → 12.5 → 6.25 → 3.125
  round(g, 450, 24, 500, 152, 6, '#060708', AMBER3, 3); text(g, 'HALVING CYCLE · ERA', 700, 46, 16, AMBER2, COND, 'center', '800');
  for (let k = 0; k < 5; k++) { const x = 486 + k * 107, on = k === era, past = k < era; coinFace(g, x, 104, on ? 38 : 30, k, { label: false, glow: on ? 26 : 0 }); if (!on && !past) { g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(x, 104, 31, 0, 7); g.fill(); } if (past) { g.strokeStyle = RED2; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 22, 126); g.lineTo(x + 22, 82); g.stroke(); } if (k < 4) text(g, '→', x + 53, 104, 20, past ? AMBER : '#555', COND, 'center', '800'); }
  text(g, `${Math.max(0, state.free)} SPINS LEFT · ALL WINS 2×`, 700, 158, 15, '#fff6d0', MONO, 'center', '700');
}
function drawCycleSplit(now) {
  const g = sg, p = pres, era = p.era || 0;
  if (p.split && now - p.split < 1400 && !reduced()) { const k = ease((now - p.split) / 1200); g.save(); g.globalAlpha = 1 - k; [-1, 1].forEach(sx => { g.save(); g.beginPath(); g.rect(sx < 0 ? 0 : 700, 0, 700, 960); g.clip(); g.translate(sx * 160 * k, 30 * k); g.rotate(sx * .25 * k); coinFace(g, 700, 480, 170, Math.max(0, era - 1), { label: false }); g.restore(); }); g.restore(); text(g, `SUBSIDY HALVED: ${amt((REC.subsidies[era] || {}).btc || 50 / 2 ** era)} BTC`, 700, 480, 48, AMBER2, COND, 'center', '800'); }
}
