
/* ---------- The cabinet screen: a warehouse doorway with a chalk X on the lintel, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
function wall(g) { // corrugated warehouse steel, dark, with the odd scrap of flyposted paper at the edges
  corrugated(g, 0, 0, 1400, 960, '#1a1c20', 11);
  const r = rnd(77); [[2, 300, 24, 120, PINK], [1372, 330, 26, 150, ACID], [3, 560, 22, 90, CYAN], [1374, 600, 24, 110, PAPER], [4, 800, 20, 100, ACID], [1376, 820, 22, 90, PINK]].forEach(([x, y, w, h, col]) => { g.save(); g.translate(x + w / 2, y + h / 2); g.rotate((r() - .5) * .08); g.globalAlpha = .55; g.fillStyle = col; g.fillRect(-w / 2, -h / 2, w, h); g.globalAlpha = .5; g.fillStyle = INK; g.fillRect(-w / 2 + 4, -h / 2 + 10, w - 8, 3); g.fillRect(-w / 2 + 4, -h / 2 + 18, w - 14, 3); g.restore(); });
  const v = g.createRadialGradient(700, 480, 300, 700, 480, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960);
}
function ibeam(g, x, y, w, h) { brushed(g, x, y, w, h, '#1b1d21', Math.round(x + y)); g.fillStyle = '#ffffff12'; g.fillRect(x, y, w, 2); g.fillStyle = '#00000088'; g.fillRect(x, y + h - 2, w, 2); }
(function drawBase() { const g = baseLayer.getContext('2d'); wall(g);
  // the doorway: a steel frame round the reels, a lintel with the chalk X, hazard tape on the threshold and bolts
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 30; round(g, RX - 24, RY - 26, RW + 48, RH + 52, 6, '#101215'); g.restore();
  ibeam(g, RX - 24, RY - 26, RW + 48, 22); ibeam(g, RX - 24, RY + RH + 10, RW + 48, 16);
  hazard(g, RX - 24, RY + RH + 26, RW + 48, 6, .85);
  for (let x = RX - 10; x < RX + RW + 20; x += 82) { rivet(g, x, RY - 15, 4); rivet(g, x, RY + RH + 18, 4); }
  const r = rnd(5); drawChalkX(g, 700, RY - 15, 9, r, CHALK, 3.4); chalkLine(g, 470, RY - 15, 640, RY - 17, 2.6, '#f7f5efaa', r); chalkLine(g, 760, RY - 14, 930, RY - 16, 2.6, '#f7f5efaa', r);
  text(g, 'DOORS 00:00', 560, RY - 15, 13, '#f7f5efcc', MONO, 'center', '700'); text(g, 'NO PHONES', 840, RY - 15, 13, '#f7f5efcc', MONO, 'center', '700');
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#1a1c1f', '#0e0f11', '#1a1c1f']); g.fillRect(RX + c * CW, RY, CW - 3, RH); g.fillStyle = '#ffffff05'; for (let y = RY; y < RY + RH; y += 6) g.fillRect(RX + c * CW, y, CW - 3, 1); }
  // the ticker rail across the bottom
  round(g, 30, 840, 1340, 44, 4, '#08090b', '#2c3036', 2);
  g.fillStyle = '#ffffff10'; g.fillRect(45, 900, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
function glowText(g, s, x, y, size, color, glow = color, weight = '800', align = 'center', font = COND) { g.save(); g.shadowColor = glow; g.shadowBlur = size * .35; text(g, s, x, y, size, color, font, align, weight); g.restore(); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 240) : 0, col = opts.col || ACID;
  g.save(); g.shadowColor = col; g.shadowBlur = 10 + pulse * 18; round(g, x, y, w, h, 8, opts.ghost ? '#0b0c0eee' : lin(g, x, y, x, y + h, [opts.col2 || ACID2, col, opts.col3 || ACID3]), col, 3); g.restore();
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 26, opts.ghost ? (opts.col2 || ACID2) : INK, COND, 'center', '800'); hits.push({ id, x, y, w, h, fn }); }
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function highlightIndex(now) { return !spinning && !feature() && !pres && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
function drawReels(now, peak) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (peak) { sg.fillStyle = c % 2 ? '#0e1a0f' : '#101f12'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = ACID; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 8, null, ACID2, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 8, null, ACID2, 4);
    // the payline as a laser: acid core with a bright node at each cell
    sg.save(); sg.shadowColor = LASER; sg.shadowBlur = 14; sg.lineWidth = 6; sg.strokeStyle = '#000c'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.lineWidth = 3; sg.strokeStyle = LASER; sg.stroke(); sg.shadowBlur = 0;
    line.forEach((r, c) => { if (c < w.count) { sg.fillStyle = LASER; sg.beginPath(); sg.arc(RX + (c + .5) * CW, RY + (r + .5) * RHT, 8, 0, 7); sg.fill(); sg.fillStyle = '#eafff1'; sg.beginPath(); sg.arc(RX + (c + .5) * CW - 2, RY + (r + .5) * RHT - 2, 3, 0, 7); sg.fill(); } }); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#e6ff0055'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* ---------- The flyer ticker: club-flyer lines scrolling along the bottom, with the live state of the art and the twins ---------- */
const FLYER_LINES = ['FOLLOW THE X', 'LONDON · 1991', 'DOORS AT MIDNIGHT', 'CHEMICAL X', 'THIS IS NUMBER ONE', 'NO PHONES · NO NAMES', 'ONE NIGHT ONLY', 'EVERY SPIN IS ANOTHER X FOUND'];
function drawTicker(now, y = 862) {
  const items = FLYER_LINES.concat([poolText()]);
  sg.save(); sg.beginPath(); sg.rect(34, y - 20, 1332, 40); sg.clip(); sg.font = `800 20px ${COND}`; sg.textBaseline = 'middle'; sg.textAlign = 'left';
  const widths = items.map(s => sg.measureText(s).width + 70), total = widths.reduce((a, b) => a + b, 0); let x = 40 - ((reduced() ? 0 : now / 28) % total);
  for (let pass = 0; pass < 3 && x < 1366; pass++) items.forEach((s, i) => { if (x < 1366 && x + widths[i] > 30) { drawChalkXSimple(sg, x + 14, y + 1, 7, i % 2 ? PINK : ACID); sg.fillStyle = i === items.length - 1 ? PINK2 : '#e8e4d4'; sg.fillText(s, x + 34, y + 1); } x += widths[i]; });
  sg.restore();
}
function drawChalkXSimple(g, cx, cy, s, col) { g.save(); g.strokeStyle = col; g.lineWidth = 3.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - s, cy - s); g.lineTo(cx + s, cy + s); g.moveTo(cx + s, cy - s); g.lineTo(cx - s, cy + s); g.stroke(); g.restore(); }
/* ---------- HUD: the name plate, the Number One jackpot meter on split flaps, and the Holder Pot ---------- */
function drawHud(now, bet, peak) {
  // name plate
  round(sg, 30, 24, 380, 152, 6, '#0d0e10e6', '#3b4047', 2); hazard(sg, 30, 24, 380, 10, .9);
  glowText(sg, 'CLUB X', 220, 76, 62, ACID, ACID); text(sg, peak ? 'PEAK TIME · ALL WINS 2×' : 'DOORS AT MIDNIGHT · 20 LINES', 220, 118, 16, peak ? ACID2 : SMOKE, MONO, 'center', '700');
  text(sg, 'FOLLOW THE X', 220, 148, 20, '#f2efe6', COND, 'center', '800'); drawChalkXSimple(sg, 100, 148, 8, PINK); drawChalkXSimple(sg, 340, 148, 8, PINK);
  // jackpot meter on split flaps
  if (!peak) { round(sg, 450, 24, 500, 152, 6, '#060708', ACID3, 3); round(sg, 458, 32, 484, 136, 4, null, '#e6ff0044', 1.5);
    spaced(sg, 'NUMBER ONE JACKPOT', 700, 52, 18, 4, ACID, '800'); flapCells(sg, fmt(Math.round(E.meter(state, bet))), 700, 106, 58, { w: .6, col: '#fff' }); text(sg, `LAYR · ${fmt(bet)} BPM LEVEL`, 700, 154, 14, SMOKE, MONO, 'center', '700'); }
  // the Holder Pot
  round(sg, 990, 24, 380, 152, 6, '#0d0e10e6', '#3b4047', 2); const L = potLines();
  text(sg, 'HOLDER POT', 1180, 46, 18, ACID, COND, 'center', '800'); glowText(sg, fmt(state.pot), 1180, 84, 36, '#fff', ACID, '800', 'center', COND);
  text(sg, `WEEK ${periodKey()} · ${leftText()} LEFT`, 1180, 114, 14, '#cfd5dc', MONO, 'center', '700');
  fitText(sg, L.share, 1180, 138, 12, 356, PINK2, MONO, 'center', '700'); fitText(sg, L.last, 1180, 158, 10, 356, SMOKE, MONO, 'center', '700');
  drawTicker(now);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 922, 26, PAPER, COND, 'left', '800'); text(sg, `BPM  ${fmt(bet)}`, 700, 922, 26, PAPER, COND, 'center', '800'); text(sg, `${peak ? 'PEAK TIME WIN' : 'WIN'}  ${fmt(peak ? state.freeTotal : state.lastWin)}`, 1332, 922, 26, ACID2, COND, 'right', '800');
}
/* ---------- Peak Time (free spins): lasers sweep the room, the crowd lifts its hands, and the kick drum locks to the spins ---------- */
function drawLasers(g, now, alpha = .5) {
  const R = reduced(), t = R ? 0 : now / 1000; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (let k = 0; k < 9; k++) { const ox = 80 + k * 155, a = (R ? .1 * (k % 3 - 1) : Math.sin(t * (.7 + k * .11) + k * 1.3) * .7), ex = ox + Math.tan(a) * 960, col = k % 3 === 0 ? '55,255,122' : k % 3 === 1 ? '230,255,0' : '255,46,136';
    const gr = g.createLinearGradient(ox, 0, ex, 960); gr.addColorStop(0, `rgba(${col},${alpha})`); gr.addColorStop(1, `rgba(${col},0)`); g.strokeStyle = gr; g.lineWidth = 5; g.beginPath(); g.moveTo(ox, 0); g.lineTo(ex, 960); g.stroke(); g.lineWidth = 1.6; g.strokeStyle = `rgba(255,255,255,${alpha * .6})`; g.stroke(); }
  g.restore();
}
function drawCrowd(g, now, y0 = 800, lift = 1) {
  const R = reduced(), t = R ? 0 : now / 1000, beat = R ? 0 : Math.max(0, 1 - (now - kickAt) / 260); g.save(); g.fillStyle = '#04050a';
  for (let i = 0; i < 28; i++) {
    const x = 20 + i * 50 + ((i * 37) % 13), hgt = 70 + (i * 53) % 40, base = 960 + 10 - (i % 3) * 8, hd = 14 + (i % 4), bob = Math.sin(t * 7.4 + i) * 4 * beat - beat * 5;
    g.beginPath(); g.ellipse(x, base - hgt + bob, 26, hgt, 0, Math.PI, 0); g.fill(); g.beginPath(); g.arc(x, base - hgt - 6 + bob, hd, 0, 7); g.fill();
    if (i % 2 === 0 || lift > 1) [-1, 1].forEach(s => { g.lineWidth = 7; g.strokeStyle = '#04050a'; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + s * 18, base - hgt + 14 + bob); g.lineTo(x + s * (26 + Math.sin(t * 4 + i + s) * 5), base - hgt - 40 - (i % 5) * 4 + bob - beat * 10); g.stroke(); });
  }
  g.restore();
}
function drawPeakBackdrop(now) {
  const g = sg; g.drawImage(baseLayer, 0, 0); g.fillStyle = 'rgba(2,6,3,.55)'; g.fillRect(0, 0, 1400, 960);
  drawLasers(g, now, .42); const beat = reduced() ? 0 : Math.max(0, 1 - (now - kickAt) / 300); if (beat > 0) { g.fillStyle = `rgba(230,255,0,${.08 * beat})`; g.fillRect(0, 0, 1400, 960); }
  const p = pres, total = (p.spins || 0) + Math.max(0, state.free), done = p.spins || 0, n = Math.min(24, Math.max(8, total));
  round(g, 450, 24, 500, 152, 6, '#060708', ACID3, 3); text(g, 'PEAK TIME', 700, 46, 20, ACID, COND, 'center', '800');
  for (let k = 0; k < n; k++) { const x = 478 + k * (444 / Math.max(1, n - 1)), on = k < done, nxt = k === done; g.save(); g.shadowColor = on ? LASER : '#000'; g.shadowBlur = on ? 10 : 0; g.fillStyle = on ? LASER : nxt ? ACID : '#1d2a1f'; g.beginPath(); g.arc(x, 92, nxt ? 9 : 7, 0, 7); g.fill(); g.restore(); }
  text(g, `${122 + 2 * done} BPM`, 700, 128, 26, '#fff', COND, 'center', '800'); text(g, `${Math.max(0, state.free)} SPINS LEFT · ALL WINS 2×`, 700, 156, 14, ACID2, MONO, 'center', '700');
  drawCrowd(g, now);
}
