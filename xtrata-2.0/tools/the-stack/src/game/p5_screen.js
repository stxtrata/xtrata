
/* ---------- The cabinet screen: black glass, a purple-to-orange gradient behind the reels, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
// Digit cells: each character on its own glass cell; roll(i) gives 0..1 for a character rolling up into place.
function digitCells(g, s, cx, cy, h, opts = {}) {
  const chars = [...s], cw = h * (opts.w || .62), gap = h * .07, isSep = ch => ch === ',' || ch === '.', ww = chars.map(ch => isSep(ch) ? cw * .32 : cw), total = ww.reduce((a, b) => a + b, 0) + gap * (chars.length - 1); let x = cx - total / 2;
  chars.forEach((ch, i) => {
    const w = ww[i];
    if (isSep(ch)) { text(g, ch, x + w / 2, cy + h * .26, h * .5, opts.col || TXT, COND, 'center', '800'); x += w + gap; return; }
    const u = opts.roll ? clampF(opts.roll(i)) : 1, shown = u < 1 && opts.scramble ? String(Math.floor(Math.random() * 10)) : ch;
    round(g, x, cy - h / 2, w, h, h * .14, lin(g, 0, cy - h / 2, 0, cy + h / 2, ['#1c1c2c', '#0e0e17', '#09090f']), opts.edge || '#2a2a3d', 1.5);
    g.save(); g.beginPath(); g.rect(x, cy - h / 2, w, h); g.clip(); text(g, shown, x + w / 2, cy + h * .04 + (1 - ease(u)) * h * .9, h * .8, opts.col || TXT, COND, 'center', '800'); g.restore();
    g.fillStyle = '#ffffff0d'; g.fillRect(x + 2, cy - h / 2 + 2, w - 4, h * .42);
    x += w + gap;
  });
  return total;
}
const clampF = x => Math.max(0, Math.min(1, x));
(function drawBase() { const g = baseLayer.getContext('2d');
  g.fillStyle = '#06060a'; g.fillRect(0, 0, 1400, 960);
  [[180, 120, 700, 'rgba(85,70,255,.22)'], [1260, 860, 760, 'rgba(252,100,50,.16)'], [700, 480, 900, 'rgba(20,18,40,.5)']].forEach(([x, y, r, c]) => { const gr = g.createRadialGradient(x, y, 10, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 960); });
  g.save(); g.strokeStyle = 'rgba(143,132,255,.05)'; g.lineWidth = 1; for (let x = 0; x <= 1400; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 960); g.stroke(); } for (let y = 0; y <= 960; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); } g.restore();
  // the reel window: a purple-to-orange gradient behind the reels, under glass
  g.save(); g.shadowColor = PURPLE; g.shadowBlur = 40; round(g, RX - 18, RY - 18, RW + 36, RH + 36, 22, '#07070b'); g.restore();
  round(g, RX - 18, RY - 18, RW + 36, RH + 36, 22, lin(g, RX, 0, RX + RW, 0, ['#2a1f8c', '#1d1450', '#2a1236', '#5a2410']));
  round(g, RX - 18, RY - 18, RW + 36, RH + 36, 22, null, lin(g, RX, 0, RX + RW, 0, [PURPLE2, VIOLET, ORANGE]), 3);
  for (let c = 0; c < 5; c++) { g.fillStyle = 'rgba(4,4,8,.42)'; g.fillRect(RX + c * CW + 2, RY, CW - 5, RH); g.fillStyle = '#ffffff08'; g.fillRect(RX + c * CW + 2, RY, CW - 5, 2); if (c) { g.fillStyle = '#ffffff12'; g.fillRect(RX + c * CW - 2, RY + 8, 1, RH - 16); } }
  // the ticker rail across the bottom
  round(g, 30, 840, 1340, 44, 22, '#0a0a12', '#2a2a3d', 2); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
function glowText(g, s, x, y, size, color, glow = color, weight = '800', align = 'center', font = SANS) { g.save(); g.shadowColor = glow; g.shadowBlur = size * .35; text(g, s, x, y, size, color, font, align, weight); g.restore(); }
function gradText(g, s, x, y, size, cols = [PURPLE2, '#c58cff', ORANGE], align = 'center', font = SANS, glow = true) { g.save(); g.font = `800 ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; const w = g.measureText(s).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x; g.fillStyle = lin(g, x0, 0, x0 + w, 0, cols); if (glow) { g.shadowColor = cols[0]; g.shadowBlur = size * .3; } g.fillText(s, x, y); g.restore(); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 240) : 0, col = opts.col || ORANGE;
  g.save(); g.shadowColor = col; g.shadowBlur = 10 + pulse * 18; round(g, x, y, w, h, h / 2, opts.ghost ? '#07070bee' : lin(g, x, y, x, y + h, [opts.col2 || ORANGE2, col, opts.col3 || ORANGE3]), col, 2.5); g.restore();
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 26, opts.ghost ? (opts.col2 || ORANGE2) : (opts.ink || INK), SANS, 'center', '800'); hits.push({ id, x, y, w, h, fn }); }
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function highlightIndex(now) { return !spinning && !feature() && !pres && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
function drawReels(now, season) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (season) { sg.fillStyle = c % 2 ? 'rgba(85,70,255,.16)' : 'rgba(85,70,255,.24)'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = ORANGE; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 14, null, ORANGE2, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 16, null, ORANGE2, 4);
    // the payline: a glowing line, purple to orange, with a node on each winning cell
    sg.save(); sg.shadowColor = ORANGE; sg.shadowBlur = 14; sg.lineWidth = 7; sg.strokeStyle = '#000c'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.lineWidth = 3.5; sg.strokeStyle = lin(sg, RX, 0, RX + RW, 0, [PURPLE2, ORANGE]); sg.stroke(); sg.shadowBlur = 0;
    line.forEach((r, c) => { if (c < w.count) { sg.fillStyle = ORANGE; sg.beginPath(); sg.arc(RX + (c + .5) * CW, RY + (r + .5) * RHT, 8, 0, 7); sg.fill(); sg.fillStyle = '#fff'; sg.beginPath(); sg.arc(RX + (c + .5) * CW - 2, RY + (r + .5) * RHT - 2, 3, 0, 7); sg.fill(); } }); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#8f84ff55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* ---------- The block ticker: real recent Stacks blocks and the Bitcoin blocks they settled on, running along the bottom ---------- */
function drawTicker(now, y = 862) {
  const list = chain.recent.length ? chain.recent : REC.blocks || []; if (!list.length) return;
  sg.save(); sg.beginPath(); sg.roundRect(34, y - 20, 1332, 40, 20); sg.clip(); sg.font = `700 17px ${MONO}`; sg.textBaseline = 'middle'; sg.textAlign = 'left';
  const items = list.slice(0, 16).map(b => [`#${fmt(b.height)}`, `₿ ${fmt(b.burn)}`]), widths = items.map(([a, b]) => sg.measureText(a + '  ' + b).width + 70), total = widths.reduce((a, b) => a + b, 0);
  const fresh = Math.max(0, 1 - (now - tickKick) / 1600);
  let x = 40 - ((reduced() ? 0 : now / 30) % total);
  for (let pass = 0; pass < 3 && x < 1366; pass++) items.forEach(([a, b], i) => { if (x < 1366 && x + widths[i] > 30) { btcSlab(sg, x + 14, y + 4, 18, 4); stxSlab(sg, x + 14, y - 3, 14, 3); sg.fillStyle = i ? TXT : fresh > 0 ? GREEN2 : '#fff'; sg.fillText(a, x + 32, y + 1); sg.fillStyle = '#ffcf8f'; sg.fillText(b, x + 32 + sg.measureText(a + '  ').width, y + 1); } x += widths[i]; });
  sg.restore();
  text(sg, staleTag(), 1352, y - 13, 9, chain.stale ? RED : GREEN2, MONO, 'right', '700');
}
/* ---------- HUD: the name plate, the Bitcoin Finality jackpot meter and the Floor Pot ---------- */
function potText() { if (!Number.isFinite(sources.twins)) return sources.registry === 'pending' ? 'COUNTING TWINS…' : 'TWINS UNKNOWN'; if (!sources.twins) return 'NO TWINS COUNTED'; const sh = potShare(); return `≈ ${fmt(sh)} LAYR PER TWIN · ${fmt(sources.twins)} TWINS`; }
function drawHud(now, bet, season) {
  const c = cycleNow(), left = cycleLeft();
  glassPanel(sg, 30, 24, 380, 152, 18, '#2a2a3d');
  gradText(sg, 'THE STACK', 220, 70, 54); text(sg, season ? 'STACKING SEASON · ALL WINS 2×' : 'SECURED BY BITCOIN · 20 LINES', 220, 108, 14, season ? ORANGE2 : MUTED, MONO, 'center', '700');
  text(sg, Number.isFinite(c) ? `CYCLE ${c} · ENDS IN ${endsIn()}` : 'CYCLE · TIP UNKNOWN', 220, 140, 19, chain.stale ? '#ffb3bd' : TXT, SANS, 'center', '800');
  text(sg, `${staleTag()}${inPrepare() ? ' · PREPARE PHASE' : ''}`, 220, 162, 10, chain.stale ? RED : GREEN2, MONO, 'center', '700');
  if (!season) { glassPanel(sg, 450, 24, 500, 152, 18, BTC + '88', 2);
    spaced(sg, 'BITCOIN FINALITY JACKPOT', 700, 50, 16, 3, '#ffcf8f', '800'); digitCells(sg, fmt(Math.round(E.meter(state, bet))), 700, 104, 58, { w: .58, col: '#fff' }); text(sg, `LAYR · ${fmt(bet)} BET LEVEL`, 700, 154, 13, MUTED, MONO, 'center', '700'); }
  glassPanel(sg, 990, 24, 380, 152, 18, PURPLE + '99', 2);
  text(sg, 'FLOOR POT', 1180, 46, 18, PURPLE2, SANS, 'center', '800'); glowText(sg, fmt(state.pot), 1180, 84, 36, '#fff', PURPLE, '800', 'center', COND);
  text(sg, Number.isFinite(left) ? `CYCLE ${c} · ${fmt(left)} BTC BLOCKS LEFT` : 'CYCLE · TIP UNKNOWN', 1180, 116, 14, TXT, MONO, 'center', '700');
  text(sg, potText(), 1180, 138, 12, MUTED, MONO, 'center', '700');
  text(sg, state.lastPot ? `LAST CYCLE: ${state.lastPot.perTwin != null ? fmt(state.lastPot.perTwin) + ' LAYR PER TWIN' : fmt(state.lastPot.pot) + ' LAYR'}` : 'PAID PER TWIN AT EACH CYCLE’S END', 1180, 158, 10, MUTED, MONO, 'center', '700');
  drawTicker(now);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 922, 26, TXT, SANS, 'left', '800'); text(sg, `STX BET  ${fmt(bet)}`, 700, 922, 26, TXT, SANS, 'center', '800'); text(sg, `${season ? 'SEASON WIN' : 'WIN'}  ${fmt(season ? state.freeTotal : state.lastWin)}`, 1332, 922, 26, ORANGE2, SANS, 'right', '800');
}
/* ---------- Stacking Season (free spins): a cycle ring fills round the screen edge as the spins count down ---------- */
function perimeterPoint(f, x0 = 12, y0 = 12, x1 = 1388, y1 = 948) {
  const w = x1 - x0, h = y1 - y0, P = 2 * (w + h); let d = ((f % 1) + 1) % 1 * P;
  // start at the top centre and run clockwise
  d += w / 2; d %= P;
  if (d < w) return [x0 + d, y0]; d -= w; if (d < h) return [x1, y0 + d]; d -= h; if (d < w) return [x1 - d, y1]; d -= w; return [x0, y1 - d];
}
function seasonProgress(p) { const total = (p.spins || 0) + Math.max(0, state.free); return { total, done: p.spins || 0, p: total ? (p.spins || 0) / total : 0 }; }
function drawSeasonRing(now) {
  const p = pres, S = seasonProgress(p); if (!S.total) return;
  if (p.ringDone !== S.done) { if (p.ringDone != null && S.done > p.ringDone) { p.ringStep = now; sound('ring'); } p.ringDone = S.done; }
  const R = reduced(), k = p.ringStep && !R ? ease((now - p.ringStep) / 600) : 1, prevP = S.total ? Math.max(0, S.done - 1) / S.total : 0, shown = p.ringStep ? prevP + (S.p - prevP) * k : S.p;
  sg.save(); sg.lineCap = 'round';
  sg.lineWidth = 10; sg.strokeStyle = '#ffffff10'; sg.strokeRect(12, 12, 1376, 936);
  const steps = 160, lit = Math.round(steps * shown);
  for (let i = 0; i < lit; i++) { const [xa, ya] = perimeterPoint(i / steps), [xb, yb] = perimeterPoint((i + 1) / steps); const t = i / steps; sg.strokeStyle = t < .5 ? PURPLE2 : t < .75 ? VIOLET : ORANGE; sg.shadowColor = sg.strokeStyle; sg.shadowBlur = R ? 0 : 14; sg.lineWidth = 9; sg.beginPath(); sg.moveTo(xa, ya); sg.lineTo(xb, yb); sg.stroke(); }
  sg.shadowBlur = 0;
  for (let s = 0; s <= S.total; s++) { const [x, y] = perimeterPoint(s / S.total); sg.fillStyle = s <= S.done ? '#fff' : '#ffffff33'; sg.beginPath(); sg.arc(x, y, s <= S.done ? 6 : 4, 0, 7); sg.fill(); }
  if (!R) { const [hx, hy] = perimeterPoint(shown); const pulse = .5 + .5 * Math.sin(now / 160); sg.fillStyle = ORANGE; sg.shadowColor = ORANGE; sg.shadowBlur = 20 + 10 * pulse; sg.beginPath(); sg.arc(hx, hy, 9 + 3 * pulse, 0, 7); sg.fill(); }
  sg.restore();
}
function drawSeasonBackdrop(now) {
  const g = sg; g.drawImage(baseLayer, 0, 0); g.fillStyle = 'rgba(40,30,120,.22)'; g.fillRect(0, 0, 1400, 960);
  const S = seasonProgress(pres);
  glassPanel(g, 450, 24, 500, 152, 18, ORANGE + '99', 2);
  spaced(g, 'STACKING SEASON', 700, 52, 22, 5, ORANGE2, '800');
  digitCells(g, `${String(Math.max(0, state.free)).padStart(2, '0')}`, 640, 108, 62, { w: .6, col: '#fff' }); text(g, 'SPINS', 700, 96, 15, MUTED, MONO, 'left', '700'); text(g, 'LEFT', 700, 116, 15, MUTED, MONO, 'left', '700');
  text(g, '2×', 830, 108, 54, ORANGE, SANS, 'center', '800');
  text(g, `SPIN ${S.done} OF ${S.total} · THE RING IS THE CYCLE`, 700, 156, 13, TXT, MONO, 'center', '700');
}
