
/* ---------- The cabinet screen: a specimen case under glass in a warm assay lab, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
function wall(g) { oak(g, 0, 0, 1400, 960, 5, OAK2); // oak panelling: board seams, brass nails, and one cold blue glass lamp over the case
  g.save(); for (let x = 0; x < 1400; x += 175) { g.fillStyle = 'rgba(0,0,0,.38)'; g.fillRect(x, 0, 3, 960); g.fillStyle = 'rgba(255,200,130,.07)'; g.fillRect(x + 3, 0, 1.5, 960); }
  for (let x = 87; x < 1400; x += 175) for (const y of [14, 946]) rivet(g, x, y, 3.4);
  const l = g.createRadialGradient(700, 120, 20, 700, 320, 780); l.addColorStop(0, 'rgba(0,166,251,.17)'); l.addColorStop(1, 'rgba(0,166,251,0)'); g.fillStyle = l; g.fillRect(0, 0, 1400, 960);
  const v = g.createRadialGradient(700, 480, 320, 700, 480, 920); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.58)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960); g.restore(); }
function brassRail(g, x, y, w, h) { brushed(g, x, y, w, h, BRASS3, Math.round(x + y)); g.fillStyle = 'rgba(255,240,190,.5)'; g.fillRect(x, y, w, 2); g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x, y + h - 2, w, 2); }
(function drawBase() { const g = baseLayer.getContext('2d'); wall(g);
  // the brass frame round the reels, with a hatch band, corner plates and rivets
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 30; round(g, RX - 24, RY - 26, RW + 48, RH + 52, 8, BRASS4); g.restore();
  brassRail(g, RX - 24, RY - 26, RW + 48, 16); brassRail(g, RX - 24, RY + RH + 10, RW + 48, 16); brassRail(g, RX - 24, RY - 10, 20, RH + 20); brassRail(g, RX + RW + 4, RY - 10, 20, RH + 20);
  hazard(g, RX - 24, RY + RH + 26, RW + 48, 6, .9);
  for (let x = RX - 10; x < RX + RW + 20; x += 82) { rivet(g, x, RY - 18, 4); rivet(g, x, RY + RH + 18, 4); }
  for (const [x, y] of [[RX - 30, RY - 32], [RX + RW - 26, RY - 32], [RX - 30, RY + RH - 24], [RX + RW - 26, RY + RH - 24]]) { round(g, x, y, 56, 56, 6, lin(g, x, y, x + 56, y + 56, [BRASS2, BRASS3]), BRASS4, 2); rivet(g, x + 14, y + 14, 4); rivet(g, x + 42, y + 42, 4); }
  const r = lcg(77); for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#14394a', '#0c2431', '#14394a']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  for (let i = 0; i < 1800; i++) { g.fillStyle = r() < .5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.1)'; g.fillRect(RX + r() * RW, RY + r() * RH, 1 + r() * 1.5, 1); }
  for (let c = 0; c < 4; c++) { const x = RX + (c + 1) * CW - 3; brushed(g, x - 1, RY, 5, RH, BRASS3, c + 5); g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x + 4, RY, 1, RH); }
  // the ticker rail across the bottom
  round(g, 30, 840, 1340, 44, 4, '#05121a', BRASS3, 2); g.fillStyle = hexA(BRASS2, .12); g.fillRect(45, 900, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
// The sheet of specimen glass over the reels: a faint reflection and a darker edge (drawn once, laid over the reels each frame).
const glassLayer = (() => { const w = RW + 48, h = RH + 52, c = canvas(w, h), g = c.getContext('2d');
  g.fillStyle = lin(g, 0, 0, w * .55, h, ['rgba(255,255,255,.10)', 'rgba(255,255,255,.015)', 'rgba(255,255,255,0)']); g.fillRect(0, 0, w, h);
  g.save(); g.fillStyle = lin(g, w * .12, 0, w * .32, h, ['rgba(255,255,255,0)', 'rgba(210,240,255,.075)', 'rgba(255,255,255,0)']); g.beginPath(); g.moveTo(w * .2, 0); g.lineTo(w * .36, 0); g.lineTo(w * .16, h); g.lineTo(0, h); g.closePath(); g.fill();
  g.fillStyle = 'rgba(210,240,255,.05)'; g.beginPath(); g.moveTo(w * .42, 0); g.lineTo(w * .47, 0); g.lineTo(w * .27, h); g.lineTo(w * .22, h); g.closePath(); g.fill(); g.restore();
  const e = g.createLinearGradient(0, 0, 0, h); e.addColorStop(0, 'rgba(0,0,0,.18)'); e.addColorStop(.1, 'rgba(0,0,0,0)'); e.addColorStop(.9, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(0,0,0,.2)'); g.fillStyle = e; g.fillRect(0, 0, w, h); return c; })();
function glowText(g, s, x, y, size, color, glow = color, weight = '800', align = 'center', font = COND) { g.save(); g.shadowColor = glow; g.shadowBlur = size * .35; text(g, s, x, y, size, color, font, align, weight); g.restore(); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 240) : 0, col = opts.col || BRASS;
  g.save(); g.shadowColor = opts.pulse ? ACCENT2 : col; g.shadowBlur = 10 + pulse * 18; round(g, x, y, w, h, 8, opts.ghost ? '#07121aee' : lin(g, x, y, x, y + h, [opts.col2 || BRASS2, col, opts.col3 || BRASS3]), col, 3); g.restore();
  if (!opts.ghost) { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 6, y + 4, w - 12, 2); }
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 26, opts.ghost ? (opts.col2 || BRASS2) : '#1c1206', COND, 'center', '800'); hits.push({ id, x, y, w, h, fn }); }
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
    if (cycle) { sg.fillStyle = c % 2 ? '#081a24' : '#0a2230'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = ACCENT; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 8, null, ACCENT2, 5); sg.restore(); }
  }
  sg.drawImage(glassLayer, RX - 24, RY - 26);
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 8, null, BRASS2, 4);
    // the payline as a brass wire with a blue glass lamp at each winning cell
    sg.save(); sg.shadowColor = ACCENT; sg.shadowBlur = 14; sg.lineWidth = 6; sg.strokeStyle = '#000c'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.lineWidth = 3; sg.strokeStyle = BRASS; sg.stroke(); sg.shadowBlur = 0;
    line.forEach((r, c) => { if (c < w.count) { sg.fillStyle = ACCENT; sg.beginPath(); sg.arc(RX + (c + .5) * CW, RY + (r + .5) * RHT, 8, 0, 7); sg.fill(); sg.strokeStyle = BRASS2; sg.lineWidth = 2; sg.stroke(); sg.fillStyle = '#e8f8ff'; sg.beginPath(); sg.arc(RX + (c + .5) * CW - 2, RY + (r + .5) * RHT - 2, 3, 0, 7); sg.fill(); } }); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = hexA(BRASS, .4); sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* ---------- The sat ticker: real sat numbers and their rarity running along the bottom of the screen ---------- */
function drawTicker(now, y = 862) {
  const list = allSats().slice(0, 18); if (!list.length) return;
  sg.save(); sg.beginPath(); sg.rect(34, y - 20, 1332, 40); sg.clip(); sg.font = `700 17px ${MONO}`; sg.textBaseline = 'middle'; sg.textAlign = 'left';
  const items = list.map(rec => `${rec.str}  ${RAR[rarityKey(rec)].name}`), widths = items.map(s => sg.measureText(s).width + 70), total = widths.reduce((a, b) => a + b, 0);
  let x = 40 - ((reduced() ? 0 : now / 30) % total);
  for (let pass = 0; pass < 3 && x < 1366; pass++) items.forEach((s, i) => { if (x < 1366 && x + widths[i] > 30) { coinFace(sg, x + 14, y + 1, 10, list[i], { glow: 0, center: false, rim: false }); sg.fillStyle = '#e8dcb0'; sg.font = `700 17px ${MONO}`; sg.textAlign = 'left'; sg.fillText(s, x + 32, y + 1); } x += widths[i]; });
  sg.restore();
  text(sg, 'EVERY SAT IS REAL', 1352, y - 14, 9, ACCENT2, MONO, 'right', '700');
}
/* ---------- HUD: the name plate, the Mythic jackpot meter in brass counters, and the Holder Pot ---------- */
function potText() { return shareText(); }
function hudPanel(g, x, y, w, h) { round(g, x, y, w, h, 6, lin(g, x, y, x, y + h, ['#2b1a0f', '#170d07']), BRASS3, 3); round(g, x + 5, y + 5, w - 10, h - 10, 4, null, hexA(BRASS2, .25), 1.2); [[x + 10, y + 10], [x + w - 10, y + 10], [x + 10, y + h - 10], [x + w - 10, y + h - 10]].forEach(([a, b]) => rivet(g, a, b, 3)); }
function drawHud(now, bet, cycle) {
  const list = allSats(), rec = list.length ? list[Math.floor(now / 5000) % list.length] : null;
  // name plate
  hudPanel(sg, 30, 24, 380, 152); hazard(sg, 40, 30, 360, 7, .9);
  glowText(sg, 'SAT HUNTER', 220, 76, 56, BRASS2, ACCENT); text(sg, cycle ? "SATOSHI'S STASH · ALL WINS 2×" : 'EVERY SAT HAS A STORY · 20 LINES', 220, 114, 15, cycle ? BRASS2 : SMOKE, MONO, 'center', '700');
  if (rec) { text(sg, `ON THE BENCH · SAT ${rec.str}`, 220, 142, 16, '#fff6d0', COND, 'center', '800'); text(sg, `${RAR[rarityKey(rec)].name} · BLOCK ${fmt(rec.block)}`, 220, 162, 11, ACCENT2, MONO, 'center', '700'); }
  // the Mythic jackpot meter on brass counters
  if (!cycle) { hudPanel(sg, 450, 24, 500, 152);
    spaced(sg, 'MYTHIC JACKPOT', 700, 54, 18, 5, BRASS2, '800'); flapCells(sg, fmt(Math.round(E.meter(state, bet))), 700, 108, 58, { w: .6, col: '#fff6d0' }); text(sg, `LAYR · ${fmt(bet)} BET LEVEL · FIVE EPIC SATS, CENTRE ROW`, 700, 154, 13, SMOKE, MONO, 'center', '700'); }
  // the Holder Pot
  hudPanel(sg, 990, 24, 380, 152);
  text(sg, 'HOLDER POT', 1180, 48, 18, BRASS2, COND, 'center', '800'); glowText(sg, fmt(state.pot), 1180, 84, 36, '#fff', ACCENT, '800', 'center', COND);
  text(sg, `PERIOD ENDS IN ${periodText()}`, 1180, 114, 14, '#e8dcc0', MONO, 'center', '700');
  text(sg, poolText(), 1180, 134, 12, SMOKE, MONO, 'center', '700'); text(sg, potText(), 1180, 150, 12, SMOKE, MONO, 'center', '700');
  text(sg, state.lastPot ? `LAST PERIOD: ${state.lastPot.perWallet != null ? fmt(state.lastPot.perWallet) + ' LAYR PER WALLET' : fmt(state.lastPot.pot) + ' LAYR · SHARE UNKNOWN'}` : 'CLOSES EVERY MONDAY 00:00 UTC', 1180, 166, 10, SMOKE, MONO, 'center', '700');
  drawTicker(now);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 922, 26, PAPER, COND, 'left', '800'); text(sg, `SATS  ${fmt(bet)}`, 700, 922, 26, PAPER, COND, 'center', '800'); text(sg, `${cycle ? 'STASH WIN' : 'WIN'}  ${fmt(cycle ? state.freeTotal : state.lastWin)}`, 1332, 922, 26, BRASS2, COND, 'right', '800');
}
/* ---------- Satoshi's Stash (free spins): the lab lights dim and a 2009 timeline across the top lights one early-block sat per spin ---------- */
const stashList = () => SAT_RECORDS.timeline || [];
const timelineRec = t => ({ str: String(t.n), n: t.n, block: t.block, offset: 0, rarity: t.n === 0 ? 'mythic' : 'vintage', tags: [t.n === 0 ? 'mythic' : 'vintage'] });
function cycleEra(p) { const n = stashList().length; return Math.min(n, Math.max(0, p.spins || 0)); } // how many timeline sats are lit
function drawCycleBackdrop(now) {
  const g = sg; g.drawImage(baseLayer, 0, 0); g.fillStyle = 'rgba(3,9,14,.5)'; g.fillRect(0, 0, 1400, 960);
  const sp = g.createRadialGradient(700, 490, 80, 700, 490, 640); sp.addColorStop(0, 'rgba(0,166,251,.16)'); sp.addColorStop(1, 'rgba(0,166,251,0)'); g.fillStyle = sp; g.fillRect(0, 150, 1400, 700);
  const p = pres, tl = stashList(), lit = cycleEra(p);
  if (p.era !== lit) { if (p.era != null && p.era < lit) { p.split = now; sound('split'); } p.era = lit; }
  hudPanel(g, 450, 24, 500, 152); text(g, "SATOSHI'S STASH · 2009", 700, 46, 16, BRASS2, COND, 'center', '800');
  const x0 = 484, dx = tl.length > 1 ? 432 / (tl.length - 1) : 0, ly = 98;
  g.strokeStyle = hexA(BRASS, .5); g.lineWidth = 2; g.beginPath(); g.moveTo(x0 - 16, ly + 22); g.lineTo(x0 + 432 + 16, ly + 22); g.stroke();
  tl.forEach((t, k) => { const x = x0 + k * dx, on = k < lit, cur = k === lit - 1;
    if (on) coinFace(g, x, ly, cur ? 14 : 12, timelineRec(t), { glow: cur ? 22 : 6, t: now, center: false, rim: false }); else { g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(x, ly, 11, 0, 7); g.fill(); g.strokeStyle = hexA(BRASS3, .8); g.lineWidth = 1.5; g.stroke(); }
    g.fillStyle = on ? BRASS2 : BRASS4; g.fillRect(x - 1, ly + 18, 2, 8); });
  const sx = x0 + (reduced() ? .5 : .5 + .5 * Math.sin(now / 1100)) * 432; drawLoupe(g, sx, ly, 24, -Math.PI / 4); glassLens(g, sx, ly, 24);
  const cur = lit ? tl[lit - 1] : null;
  text(g, cur ? `${cur.label}${cur.date ? ' · ' + cur.date.toUpperCase() : ''} · SAT ${cur.n}` : 'THE STASH IS DARK · SPIN TO LIGHT A SAT', 700, 140, 14, '#fff6d0', MONO, 'center', '700');
  text(g, `${Math.max(0, state.free)} SPINS LEFT · ALL WINS 2×`, 700, 162, 14, ACCENT2, MONO, 'center', '700');
}
function drawCycleSplit(now) {
  const g = sg, p = pres, tl = stashList(), t = tl[Math.min(tl.length, p.era || 0) - 1];
  if (t && p.split && now - p.split < 1500 && !reduced()) { const age = now - p.split, k = ease(age / 500), fade = 1 - clamp01((age - 900) / 600);
    g.save(); g.globalAlpha = fade; g.fillStyle = 'rgba(3,9,14,.55)'; g.fillRect(RX, RY, RW, RH); const r = 150 * (.7 + .3 * k);
    coinFace(g, 700, 440, r * .72, timelineRec(t), { glow: 30, t: now }); drawLoupe(g, 700, 440, r, -Math.PI / 4); glassLens(g, 700, 440, r);
    glowText(g, t.label, 700, 650, 54, '#fff', ACCENT); text(g, `SAT ${t.n}${t.date ? ' · ' + t.date.toUpperCase() : ''}`, 700, 700, 22, BRASS2, MONO, 'center', '800'); g.restore(); }
}
