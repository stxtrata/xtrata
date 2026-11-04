
/* ---------- Faces: which letter a tile shows, and which twin floats through Moonshot. Chosen after the result. ---------- */
const LETTERS = 'MOONEEB';
const pickFace = s => s === 'chain' ? LETTERS[Math.floor(Math.random() * LETTERS.length)] : -1;
const tileFor = (s, f) => s === 'chain' ? (letterTiles[f] || letterTiles.M) : symbolImages[s];
let faces = state.grid.map(col => col.map(s => pickFace(s)));

/* ---------- Holder layer v1: the LEO Cats Holder Pot meter (display only; payouts are a later service) ---------- */
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7); return `${y}-W${String(w).padStart(2, '0')}`; }
function weekEndsIn(d = new Date()) { const day = d.getUTCDay() || 7, end = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + (8 - day)); const ms = end - d.getTime(), h = Math.floor(ms / 36e5); return `${Math.floor(h / 24)}D ${h % 24}H`; }
function holder() { if (!state.holder || typeof state.holder !== 'object') state.holder = { period: weekKey(), pot: 0, last: null }; const h = state.holder, k = weekKey(); if (h.period !== k) { h.last = { period: h.period, pot: h.pot, twins: twinCount() }; h.period = k; h.pot = 0; } return h; }
// 1% of every paid bet, funded from the house edge: it never reduces a player's win. Lab runs never touch it.
function addHolder(bet) { if (labRun) return; const h = holder(); h.pot = Math.round((h.pot + bet * .01) * 1e4) / 1e4; }
// TODO(holder-payouts): snapshot at period end, read every twin from the helper (checked reads), split per twin, credit holders.
// TODO(holder-spins), TODO(forever-fund), TODO(collection-cup): need a server or contract; out of scope for v1.
const HolderPayouts = Object.freeze({ snapshot() { throw Error('TODO: holder snapshot service is not built yet'); }, claim() { throw Error('TODO: holder claims are not built yet'); }, holderSpins() { return 0; } });

/* ---------- The screen: 1400 × 960 units, drawn at 2× ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const baseLayer = canvas(1400, 960);
const starField = Array.from({ length: 140 }, () => ({ x: Math.random() * 1400, y: Math.random() * 960, r: Math.random() * 1.8 + .3, s: Math.random() * .8 + .2, tw: Math.random() * 6 }));
(function drawBase() { const g = baseLayer.getContext('2d');
  g.fillStyle = rad(g, 700, 300, 50, 1000, ['#2c1268', '#170736', '#0b0418']); g.fillRect(0, 0, 1400, 960);
  g.fillStyle = '#ffffff'; for (const s of starField) { g.globalAlpha = .15 + s.s * .35; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill(); } g.globalAlpha = 1;
  round(g, 20, 14, 1360, 176, 22, '#0e0622bb', '#c084fc44', 2);
  g.save(); g.shadowColor = '#c084fc'; g.shadowBlur = 20; round(g, RX - 12, RY - 12, RW + 24, RH + 24, 30, '#08021a', '#c084fc', 5); g.restore();
  round(g, RX - 4, RY - 4, RW + 8, RH + 8, 24, null, '#f4ecff55', 2);
  for (let k = 0; k < 26; k++) { const t = k / 26, x = RX - 6 + t * (RW + 12); for (const y of [RY - 7, RY + RH + 7]) { g.beginPath(); g.arc(x + 25, y, 4, 0, 7); g.fillStyle = '#d9c8ff'; g.fill(); g.fillStyle = '#5b3a8f'; g.beginPath(); g.arc(x + 26, y + 1, 1.6, 0, 7); g.fill(); } }
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#140834', '#22104c', '#140834']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff14'; g.fillRect(45, 880, 1310, 1);
  text(g, '3 ROCKETS = MOONSHOT   ·   3 MOONEY BAGS = PICK   ·   5 LETTER TILES = SPELL IT', 700, 852, 19, '#b7a6d6'); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
let sbtn = [];   // buttons drawn on the screen this frame: tappable in every view
function screenButton(id, label, x, y, w, h, act, style = 'gold', sub = '') {
  const hot = scene && scene.hover === id, g = sg; g.save();
  g.shadowColor = style === 'gold' ? GOLD : ACCENT; g.shadowBlur = hot ? 30 : 16;
  round(g, x, y, w, h, h / 2, style === 'gold' ? lin(g, 0, y, 0, y + h, ['#fff1a8', '#ffcf45', '#f5a524']) : style === 'moon' ? lin(g, 0, y, 0, y + h, ['#efe6ff', '#b7a0ff']) : '#1a0b38e8', style === 'ghost' ? '#c084fcaa' : INK, 4); g.restore();
  fitText(g, label, x + w / 2, y + h / 2 - (sub ? 9 : 1), sub ? 26 : 28, w - 30, style === 'ghost' ? '#efe6ff' : INK, '900'); if (sub) text(g, sub, x + w / 2, y + h / 2 + 18, 13, style === 'ghost' ? '#c9b8ea' : '#5a3a12', 'Arial', 'center', '800');
  sbtn.push({ id, x, y, w, h, act });
}
function highlightIndex(now) { return !spinning && !scene && !feature() && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const cellX = c => RX + c * CW + (CW - 176) / 2;
function drawStarfield(now, alpha = 1, speed = 1) {
  const g = sg; g.save(); g.globalAlpha = alpha; g.fillStyle = rad(g, 700, 480, 40, 900, ['#1e0f52', '#0a0322', '#03010b']); g.fillRect(RX, RY, RW, RH); g.beginPath(); g.rect(RX, RY, RW, RH); g.clip();
  for (const s of starField) { const y = RY + ((s.y + now * .05 * s.s * speed) % RH), tw = .5 + .5 * Math.sin(now / 400 + s.tw); g.globalAlpha = alpha * (.3 + .7 * tw * s.s); g.fillStyle = '#fff'; g.beginPath(); g.arc(RX + s.x * RW / 1400, y, s.r * 1.3, 0, 7); g.fill(); }
  g.globalAlpha = alpha; g.fillStyle = rad(g, 1230, RY + 90, 10, 120, ['#fff6c4', '#ffe08a66', '#ffe08a00']); g.beginPath(); g.arc(1230, RY + 90, 120, 0, 7); g.fill(); g.restore();
}
function drawReels(now, opts = {}) {
  const lift = opts.lift || null, dim = opts.dim || 0;
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (freeMode) { sg.fillStyle = '#0a0322aa'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; const t = tileFor(s, f); if (t) sg.drawImage(t, cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) { if (lift && lift(c, r)) continue; const t = tileFor(state.grid[c][r], faces[c][r]); if (t) sg.drawImage(t, cellX(c), RY + r * RHT + 7, 176, 176); }
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = GOLD; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 16, null, GOLD, 5); sg.restore(); }
  }
  if (dim) { sg.fillStyle = `rgba(6,2,16,${dim})`; sg.fillRect(RX, RY, RW, RH); }
  if (lift) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (lift(c, r)) { const k = lift(c, r), t = tileFor(state.grid[c][r], faces[c][r]); sg.save(); sg.translate(cellX(c) + 88, RY + r * RHT + 95 - k.up); sg.scale(k.scale, k.scale); sg.shadowColor = k.color || GOLD; sg.shadowBlur = 40; if (t) sg.drawImage(t, -88, -88, 176, 176); sg.restore(); }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 18, null, GOLD, 5); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 14; sg.lineWidth = 5; sg.strokeStyle = '#ffd76ad0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning && !scene) { sg.strokeStyle = '#c084fc55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The word ladder, top left: each rung lights when its symbol wins, and the jackpot lights them all, M to MOONEEB.
function drawLadder(now) {
  const x0 = 60, y0 = 34;
  for (let i = 0; i < 5; i++) { const lit = ladderGlow[i], y = y0 + i * 29, w = 90 + i * 34;
    sg.save(); sg.shadowColor = i === 4 ? GOLD : ACCENT; sg.shadowBlur = lit > .05 ? 26 * lit : 0; round(sg, x0, y - 12, w, 24, 12, lit > .05 ? (i === 4 ? `rgba(255,215,106,${.25 + .6 * lit})` : `rgba(192,132,252,${.2 + .6 * lit})`) : '#1a0b38', lit > .05 ? (i === 4 ? GOLD : ACCENT) : '#c084fc44', 2); sg.restore();
    text(sg, RUNGS[i], x0 + 14, y + 1, 15, lit > .05 ? '#fff' : '#9f8cc9', 'Arial', 'left', '900'); }
}
function holderLines() {
  const h = holder(), n = twinCount(), count = n == null ? (sources.countState === 'reading' ? 'READING TWINS…' : 'TWIN COUNT UNKNOWN') : n === 0 ? 'NO TWINS YET · POT WAITS' : `≈ ${fmt(h.pot / n)} PER TWIN · ${fmt(n)} TWINS${sources.countState === 'stale' ? ' (STALE)' : ''}`;
  return { pot: fmt(h.pot), period: `${h.period.replace('-', ' · ')} · ENDS IN ${weekEndsIn()}`, count, last: h.last ? `LAST ${h.last.period.split('-')[1]}: ${fmt(h.last.pot)} LAYR${h.last.twins ? ` · ${fmt(h.last.pot / h.last.twins)} PER TWIN` : ''}` : '' };
}
function drawTop(now, shownBet) {
  drawLadder(now);
  text(sg, 'FULL MOONEEB JACKPOT', 700, 40, 22, GOLD, 'Arial', 'center', '900');
  sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = excite > 0 ? 30 : 10; text(sg, fmt(G.meter(state, shownBet)), 700, 104, 60, '#ffffff', 'Arial', 'center', '300'); sg.restore();
  text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 16, '#b7a6d6');
  const hl = holderLines(), rx = 1190;
  text(sg, 'LEO CATS HOLDER POT', rx, 40, 17, LEO.accent, 'Arial', 'center', '900');
  text(sg, `${hl.pot} LAYR`, rx, 80, 34, '#ffffff', 'Arial', 'center', '400');
  text(sg, hl.period, rx, 118, 13, '#c9b8ea', 'Arial', 'center', '700'); fitText(sg, hl.count, rx, 142, 13, 330, '#9fe8df', '700'); if (hl.last) fitText(sg, hl.last, rx, 166, 12, 330, '#8f7fb8', '700');
  if (labRun) { round(sg, 590, 172, 220, 26, 13, '#ff5c8a'); text(sg, 'BONUS LAB · NOT REAL PLAY', 700, 185, 13, '#fff', 'Arial', 'center', '900'); }
}
// The supplied MOO! burst pops over the screen on big wins and when the coin lands Moo.
let mooBurstAt = -1e9;
function drawMooBurst(now) { const t = (now - mooBurstAt) / 1600; if (t < 0 || t > 1 || !img.mooBurst) return; const k = RM() ? 1 : backOut(clamp(t * 4)) * (t > .8 ? 1 - (t - .8) * 5 : 1), sz = 330; sg.save(); sg.globalAlpha = t > .8 ? 1 - (t - .8) * 5 : 1; sg.translate(700, RY + RH / 2); sg.rotate(-.1); sg.scale(k, k); sg.shadowColor = '#ffe23d'; sg.shadowBlur = 40; round(sg, -sz / 2 - 8, -sz / 2 - 8, sz + 16, sz + 16, 28, '#1b1240'); sg.shadowBlur = 0; sg.beginPath(); sg.roundRect(-sz / 2, -sz / 2, sz, sz, 22); sg.clip(); sg.drawImage(img.mooBurst, -sz / 2, -sz / 2, sz, sz); sg.restore(); }
/* Particles drawn on the screen itself (coins, sparks, confetti), so effects show on the cabinet and in fullscreen alike. */
const fx = [];
function burst(x, y, n, kind = 'coin', spread = 1) { if (RM()) { if (fx.length >= 8) return; n = Math.min(n, 3, 8 - fx.length); spread *= .6; } for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 6) * spread; fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5 * spread, life: 1, kind, rot: Math.random() * 6, hue: Math.random() }); } }
function drawFx(dt) {
  for (let i = fx.length - 1; i >= 0; i--) { const p = fx[i]; p.x += p.vx; p.y += p.vy; p.vy += .28; p.rot += .15; p.life -= dt * .55; if (p.life <= 0 || p.y > 980) { fx.splice(i, 1); continue; }
    sg.save(); sg.globalAlpha = Math.min(1, p.life * 1.6); sg.translate(p.x, p.y); sg.rotate(p.rot);
    if (p.kind === 'coin') { sg.scale(Math.abs(Math.cos(p.rot * 1.3)) * .8 + .2, 1); sg.beginPath(); sg.arc(0, 0, 11, 0, 7); sg.fillStyle = '#ffcf45'; sg.fill(); sg.lineWidth = 3; sg.strokeStyle = '#9a5f12'; sg.stroke(); }
    else if (p.kind === 'star') star(sg, 0, 0, 12, p.hue > .5 ? '#fff3a6' : '#e9d5ff');
    else { sg.fillStyle = ['#ffd76a', '#c084fc', '#ff9ec0', '#6fe3ff', '#ffffff'][Math.floor(p.hue * 5)]; sg.fillRect(-6, -3, 12, 6); }
    sg.restore(); }
}
