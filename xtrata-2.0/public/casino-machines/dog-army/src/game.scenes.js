/* ---------- Scene art: a night parade ground under a full moon. All generic military imagery drawn in code: moon, searchlights,
   tents, crates and parachutes, silhouettes of ranks. Original art; never the DOG mascot or anyone's likeness. ---------- */
function tent(g, x, y, w, h, lit) {
  g.save(); g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x - w * .12, y - h); g.lineTo(x + w * .12, y - h); g.lineTo(x + w / 2, y); g.closePath(); g.fillStyle = '#0a0c08'; g.fill(); g.strokeStyle = '#2b2f20'; g.lineWidth = 1.5; g.stroke();
  g.beginPath(); g.moveTo(x - w * .12, y - h); g.lineTo(x, y - h - h * .16); g.lineTo(x + w * .12, y - h); g.fillStyle = '#12150e'; g.fill();
  g.beginPath(); g.moveTo(x - w * .12, y); g.lineTo(x, y - h * .62); g.lineTo(x + w * .12, y); g.closePath(); g.fillStyle = lit ? '#e8b35a' : '#050604'; g.fill();
  if (lit) { g.fillStyle = rad(g, x, y - h * .25, 2, w * .5, ['#e8b35a55', '#e8b35a00']); g.fillRect(x - w / 2, y - h, w, h); }
  g.strokeStyle = '#3a3e2c'; g.lineWidth = 1; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * w * .12, y - h); g.lineTo(x + s * w * .62, y); g.stroke(); } g.restore(); }
function flagPole(g, x, y, h, now, color = '#59613a') { g.save(); g.strokeStyle = '#1c1d17'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h); g.stroke(); g.beginPath(); g.moveTo(x, y - h); for (let i = 0; i <= 8; i++) g.lineTo(x + i * 5, y - h + Math.sin(now / 260 + i * .7) * 2.2 * (i / 8)); for (let i = 8; i >= 0; i--) g.lineTo(x + i * 5, y - h + 20 + Math.sin(now / 260 + i * .7) * 2.2 * (i / 8)); g.closePath(); g.fillStyle = color; g.fill(); g.restore(); }
let nightLayer = null;
function buildNight() {
  const c = canvas(RW * 2, RH * 2), g = c.getContext('2d'); g.scale(2, 2); g.translate(-RX, -RY);
  g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#05060a', '#0b1016', '#171d17', '#20241a']); g.fillRect(RX, RY, RW, RH);
  const gy = RY + RH - 112;
  // distant tent lines and the ground
  let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 9; i++) tent(g, RX + 60 + i * 150 + r() * 40, gy + 14 + r() * 8, 96 + r() * 40, 40 + r() * 14, r() > .5);
  g.beginPath(); g.moveTo(RX, gy + 30); g.bezierCurveTo(RX + 300, gy + 14, RX + 700, gy + 34, RX + RW, gy + 18); g.lineTo(RX + RW, RY + RH); g.lineTo(RX, RY + RH); g.closePath(); g.fillStyle = lin(g, 0, gy, 0, RY + RH, ['#15180f', '#0a0b07']); g.fill();
  g.strokeStyle = '#ffffff0c'; g.lineWidth = 1; for (let i = 0; i < 18; i++) { g.beginPath(); g.moveTo(RX + i * 80, RY + RH); g.lineTo(RX + 300 + i * 40, gy + 40); g.stroke(); }
  return c; }
function drawNight(now, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha, g = sg, still = RM(); if (!nightLayer) nightLayer = buildNight();
  g.save(); g.globalAlpha = a; g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); g.drawImage(nightLayer, RX, RY, RW, RH);
  for (const s of starField.slice(0, 100)) { const y = RY + (s.y % (RH * .62)), tw = still ? .6 : .5 + .5 * Math.sin(now / 500 + s.tw); g.globalAlpha = a * (.25 + .6 * tw * s.s); g.fillStyle = '#fff'; g.beginPath(); g.arc(RX + s.x * RW / 1400, y, s.r * 1.2, 0, 7); g.fill(); }
  g.globalAlpha = a; const m = o.moon === undefined ? { x: RX + RW - 170, y: RY + 104, r: 76 } : o.moon;
  if (m) { g.fillStyle = rad(g, m.x, m.y, m.r * .9, m.r * 3.2, ['rgba(255,244,205,.30)', 'rgba(255,244,205,0)']); g.beginPath(); g.arc(m.x, m.y, m.r * 3.2, 0, 7); g.fill(); moonDisc(g, m.x, m.y, m.r, { glow: .6 }); }
  if (o.beams !== false) beams(now, o.focus || null, o.beamPow == null ? 1 : o.beamPow);
  if (o.ranks) drawRanks(now, o.look || 0, o.ranks);
  if (o.shade) { g.fillStyle = `rgba(3,3,2,${o.shade})`; g.fillRect(RX, RY, RW, RH); }
  g.restore(); }
// Searchlights sweeping the sky from the ground (or, with a focus point, all converging on it).
function beams(now, focus, pow = 1) {
  const g = sg, srcs = [RX + 190, RX + RW * .5, RX + RW - 200], by = RY + RH - 100, t = RM() ? 0 : now / 1000; g.save(); g.globalCompositeOperation = 'lighter';
  srcs.forEach((bx, i) => { const ang = focus ? Math.atan2(focus.y - by, focus.x - bx) : -Math.PI / 2 + Math.sin(t * .55 + i * 2.1) * .5 + (i - 1) * .12, len = 760, sp = .05 + (focus ? .02 : 0), x1 = bx + Math.cos(ang - sp) * len, y1 = by + Math.sin(ang - sp) * len, x2 = bx + Math.cos(ang + sp) * len, y2 = by + Math.sin(ang + sp) * len;
    g.fillStyle = lin(g, bx, by, bx + Math.cos(ang) * len, by + Math.sin(ang) * len, [`rgba(255,246,214,${.26 * pow})`, `rgba(255,246,214,${.08 * pow})`, 'rgba(255,246,214,0)']); g.beginPath(); g.moveTo(bx, by); g.lineTo(x1, y1); g.lineTo(x2, y2); g.closePath(); g.fill();
    g.fillStyle = '#fff6d8'; g.beginPath(); g.ellipse(bx, by, 9, 4, 0, 0, 7); g.fill(); });
  g.restore(); }
// Ranks of silhouette soldiers marching along the foreground. look tips every head back to the sky.
function drawRanks(now, look = 0, density = 1) {
  const g = sg, t = RM() ? 0 : now / 1000, rows = [{ y: RY + RH - 8, h: 92, n: 9, sp: 52, shade: '#030302' }, { y: RY + RH - 62, h: 64, n: 12, sp: 38, shade: '#070806' }];
  for (const row of rows) { const gap = RW / row.n; for (let i = -1; i < row.n + 1; i++) { const x = RX + ((i * gap + t * row.sp * (look > .5 ? 0 : 1)) % (RW + gap)) - gap / 2 + (row.y % 5); soldier(g, x, row.y, row.h * (density > 1 ? 1.1 : 1), t * 5.2 + i * .9, row.shade, look, look > .3 ? 'rgba(244,239,224,.28)' : ''); } } }
/* Parachute crates that drift down and burst into DOG. Cosmetic only: they are released when a free spin wins or on a timer. */
const drops = [], flashes = [];
function spawnDrops(n, now, delay = 0, at = null) { const quickMode = quick(); for (let i = 0; i < n; i++) drops.push({ x: at ? at.x : RX + 120 + Math.random() * (RW - 240), y0: at ? at.y : RY - 90, t0: now + delay + i * (quickMode ? 120 : 360), dur: quickMode ? 1500 : 5200 + Math.random() * 2000, s: .55 + Math.random() * .35, ph: Math.random() * 6, a: Math.random() < .5 ? '#7a7f4a' : '#a39a6e' }); if (drops.length > 12) drops.splice(0, drops.length - 12); }
function drawDrops(now) {
  const g = sg; g.save(); g.beginPath(); g.rect(RX, RY - 40, RW, RH + 40); g.clip();
  for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i], u = (now - d.t0) / d.dur; if (u < 0) continue;
    const land = RY + RH - 70; if (u >= 1) { burst(d.x, land, 18, 'dog', 1); burst(d.x, land, 8, 'star', .8); flashes.push({ x: d.x, y: land, t0: now }); sound('thud'); drops.splice(i, 1); continue; }
    const y = d.y0 + (land - d.y0) * (u < .9 ? u / .9 * .96 : .96 + (u - .9) * .4), x = d.x + (RM() ? 0 : Math.sin(now / 700 + d.ph) * 22 * (1 - u * .5)), sway = RM() ? 0 : Math.sin(now / 700 + d.ph) * .1;
    g.globalAlpha = .92; chute(g, x, y, d.s * (u > .93 ? 1 - (u - .93) * 4 : 1), sway, { a: d.a }); }
  for (let i = flashes.length - 1; i >= 0; i--) { const f = flashes[i], u = (now - f.t0) / 520; if (u >= 1) { flashes.splice(i, 1); continue; } g.globalAlpha = 1 - u; g.fillStyle = rad(g, f.x, f.y, 4, 30 + u * 110, ['rgba(255,236,170,.9)', 'rgba(255,236,170,0)']); g.beginPath(); g.arc(f.x, f.y, 30 + u * 110, 0, 7); g.fill(); }
  g.restore(); }
/* Title card, panels and rule card, in brass on black. */
function drawTitleCard(now, title, sub, color, t) {
  const k = RM() ? 1 : backOut(t * 2.2), y = RY + RH / 2 - 10;
  sg.save(); sg.globalAlpha = clamp(t * 4); sg.translate(700, y); sg.scale(k, k);
  sg.shadowColor = color; sg.shadowBlur = 40; round(sg, -380, -86, 760, 172, 30, lin(sg, 0, -86, 0, 86, ['#1f1c14f4', '#0a0907f4']), color, 6); sg.shadowBlur = 0; round(sg, -366, -72, 732, 144, 20, null, color + '55', 1.5);
  sg.save(); sg.shadowColor = color; sg.shadowBlur = 24; fitText(sg, title, 0, -16, 78, 690, '#fff8e0', '900', HEAD); sg.restore();
  fitText(sg, sub, 0, 46, 22, 690, color, '800'); sg.restore();
}
function drawPanel(x, y, w, h, color = BRASS) { sg.save(); sg.shadowColor = color; sg.shadowBlur = 30; round(sg, x, y, w, h, 28, lin(sg, 0, y, 0, y + h, ['#201d15f4', '#0a0907f4']), color, 5); sg.restore(); round(sg, x + 10, y + 10, w - 20, h - 20, 20, null, color + '44', 1.5); }
function drawRuleCard(now, title, rule, t, color) {
  const a = clamp(t * 3); sg.save(); sg.globalAlpha = a; drawPanel(300, RY + 300, 800, 220, color);
  fitText(sg, title.toUpperCase(), 700, RY + 350, 50, 740, '#fff8e0', '900', HEAD); fitText(sg, rule, 700, RY + 402, 22, 740, '#e6dfc4', '700'); sg.restore();
}
/* ----- The Airdrop ----- */
function drawAirdropField(now, alpha = 1) { drawNight(now, { alpha }); }
/* ----- Dog Tags: nine tags hang on a barracks board; flip three ----- */
const TAGW = 196, TAGH = 118;
function tagCell(i) { const gx = 330, gy = 182, cols = 3, x = RX + 190 + (i % cols) * gx, y = RY + 14 + Math.floor(i / cols) * gy; return [x, y, 250, 170]; }
function drawBarracks(now, a = 1) {
  const g = sg; g.save(); g.globalAlpha = a; g.beginPath(); g.rect(RX, RY, RW, RH); g.clip();
  g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#1d1810', '#2a2216', '#1a150d']); g.fillRect(RX, RY, RW, RH);
  for (let x = RX; x < RX + RW; x += 54) { g.fillStyle = (Math.floor(x / 54) % 2) ? '#ffffff05' : '#00000020'; g.fillRect(x, RY, 52, RH); g.fillStyle = '#00000040'; g.fillRect(x + 52, RY, 2, RH); }
  g.strokeStyle = '#0000002a'; g.lineWidth = 1; for (let k = 0; k < 22; k++) { const x = RX + (k * 137) % RW, y = RY + (k * 71) % RH; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 6, y + 30, x - 4, y + 60, x + 3, y + 90); g.stroke(); }
  // a hanging lamp and its warm light
  g.fillStyle = rad(g, RX + RW / 2, RY + 8, 10, 520, ['rgba(255,214,140,.30)', 'rgba(255,214,140,.08)', 'rgba(255,214,140,0)']); g.fillRect(RX, RY, RW, RH);
  // three rails with brass hooks
  for (let r = 0; r < 3; r++) { const y = RY + 14 + r * 182 + 2; g.fillStyle = lin(g, 0, y, 0, y + 9, ['#7d6a35', '#4d4121']); g.fillRect(RX + 110, y, RW - 220, 9); g.fillStyle = '#00000050'; g.fillRect(RX + 110, y + 9, RW - 220, 4); for (let c = 0; c < 3; c++) { const cx = tagCell(r * 3 + c)[0] + 125; g.beginPath(); g.arc(cx, y + 4, 6, 0, 7); g.fillStyle = '#d9c07a'; g.fill(); g.lineWidth = 1.5; g.strokeStyle = '#3a2d0e'; g.stroke(); } for (const x of [RX + 126, RX + RW - 126]) { g.beginPath(); g.arc(x, y + 4, 4, 0, 7); g.fillStyle = '#9a8a58'; g.fill(); } }
  g.restore(); }
function drawTagBoard(now, f, introT = 1) {
  const milestone = i => MILES.length ? MILES[scene.mile[i % scene.mile.length]] : null;
  for (let i = 0; i < 9; i++) {
    const [x, y, w] = tagCell(i), cx = x + w / 2, pk = scene.picks.find(p => p.i === i), drop = RM() ? 1 : backOut(clamp(introT * 2 - i * .08)), yy = y - (1 - drop) * 300, hot = scene.hover === 'tag' + i, done = f.picks.length >= 3;
    const age = pk ? now - pk.t : 0, flip = pk ? (quick() ? clamp(age / 200) : clamp((age - 250) / 520)) : 0, shown = flip >= .5, sx = Math.max(.02, Math.abs(Math.cos(Math.PI * flip))), swing = RM() || pk ? 0 : Math.sin(now / 900 + i * 1.3) * .035;
    const hookY = yy + 4, top = yy + 34, ty = top + TAGH / 2;
    sg.save(); sg.translate(cx, hookY); sg.rotate(swing); sg.translate(-cx, -hookY);
    ballChain(sg, cx, hookY + 2, cx, top + 5, 5, 2.4); sg.translate(cx, ty); if (hot && !pk && !done) sg.scale(1.05, 1.05); sg.scale(sx, 1);
    const v = f.awards[i], ps = PRIZE_SYM[v];
    if (!pk) {
      sg.globalAlpha = done ? .5 : 1; dogTag(sg, -TAGW / 2, -TAGH / 2, TAGW, TAGH, { r: 26, glow: hot ? BRASS : '#000', blur: hot ? 22 : 8 });
      if (!done) { spaced(sg, 'DOG ARMY', 0, -TAGH / 2 + 24, 12, 3, '#3a3e40', '900'); sg.save(); sg.shadowColor = '#fff9'; sg.shadowOffsetY = 1.5; fitText(sg, String(i + 1), 0, 6, 56, 80, '#1d2022', '900', HEAD); sg.restore(); text(sg, 'FLIP TO READ', 0, TAGH / 2 - 18, 11, '#3a3e40', 'Arial', 'center', '900'); sbtn.push({ id: 'tag' + i, x, y: yy, w: 250, h: 170, act: () => pickTag(i) }); }
      else { fitText(sg, `${v}×`, 0, 0, 52, 120, '#2a2d2f', '900', HEAD); text(sg, 'NOT OPENED', 0, TAGH / 2 - 18, 11, '#3a3e40', 'Arial', 'center', '900'); }
    } else if (!shown) { dogTag(sg, -TAGW / 2, -TAGH / 2, TAGW, TAGH, { r: 26, glow: BRASS, blur: 24 }); }
    else { // the back: a real DOG milestone and the prize
      dogTag(sg, -TAGW / 2, -TAGH / 2, TAGW, TAGH, { r: 26, glow: BRASS, blur: 30, steel: ['#f1f2f2', '#c3c6c7', '#8a8e90'] }); sg.save(); sg.beginPath(); sg.roundRect(-TAGW / 2 + 6, -TAGH / 2 + 6, TAGW - 12, TAGH - 12, 20); sg.clip();
      const m = milestone(i);
      if (m) { spaced(sg, 'MILESTONE', 0, -TAGH / 2 + 20, 9.5, 2.4, '#4a4f52', '900'); sg.save(); sg.shadowColor = '#fff9'; sg.shadowOffsetY = 1; fitText(sg, String(m.value), 0, -TAGH / 2 + 42, 27, TAGW - 40, '#1b1d1e', '900', HEAD); sg.restore(); sg.font = '800 10px Arial'; wrap(sg, String(m.label).toUpperCase(), TAGW - 40, 2).forEach((l, k) => text(sg, l, 0, -TAGH / 2 + 62 + k * 11.5, 10, '#33383a', 'Arial', 'center', '800')); }
      else { spaced(sg, 'DOG ARMY', 0, -TAGH / 2 + 22, 11, 3, '#4a4f52', '900'); fitText(sg, 'RUNE #3', 0, -TAGH / 2 + 46, 26, 120, '#1b1d1e', '900', HEAD); text(sg, 'MILESTONE TO CONFIRM', 0, -TAGH / 2 + 66, 9.5, '#33383a', 'Arial', 'center', '900'); }
      sg.fillStyle = '#0b0a07'; sg.fillRect(-TAGW / 2, TAGH / 2 - 38, TAGW, 40); const t = tileFor(ps, FACED[ps] && FACED[ps]() ? 0 : -1); if (t) sg.drawImage(t, -TAGW / 2 + 8, TAGH / 2 - 35, 34, 34);
      text(sg, `${v}×`, -TAGW / 2 + 82, TAGH / 2 - 17, 28, BRASS, HEAD, 'center', '900'); text(sg, `${fmt(v * f.bet)} LAYR`, 38, TAGH / 2 - 17, 15, '#f4efe0', 'Arial', 'center', '900'); sg.restore();
      if (m && m.status && m.status !== 'verified') { sg.font = '900 8px Arial'; const tt = STAT_TAG[m.status] || m.status.toUpperCase(), tw = sg.measureText(tt).width + 10; round(sg, TAGW / 2 - tw - 8, -TAGH / 2 + 8, tw, 12, 6, '#0b0a07dd', '#d9c07a', 1); text(sg, tt, TAGW / 2 - tw / 2 - 8, -TAGH / 2 + 14.5, 8, '#f1dc9a', 'Arial', 'center', '900'); }
    }
    sg.restore();
  }
}
/* ----- March of the Army: every lock adds a rank, a real DOG transfer marching across the screen with its value ----- */
const MARCH_DUR = 2000, MARCH_GAP = 420;
const marchTime = n => quick() ? 520 + (n - 1) * 90 : MARCH_DUR + (n - 1) * MARCH_GAP;
function chainFace(i) { return TRANSFERS.length ? ((scene ? scene.tOff : 0) + i) % TRANSFERS.length : -1; }
function marchBanner(g, x, y, tr, val, phase) {
  g.save(); g.translate(x, y);
  for (let k = 0; k < 4; k++) soldier(g, -190 + k * 34, 64, 78, phase + k * .35, '#050504', 0, 'rgba(244,239,224,.22)');
  g.strokeStyle = '#1b1c16'; g.lineWidth = 3.5; g.beginPath(); g.moveTo(-70, 64); g.lineTo(-70, -66); g.stroke(); g.beginPath(); g.arc(-70, -68, 5, 0, 7); g.fillStyle = BRASS; g.fill();
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 14; round(g, -66, -64, 330, 96, 10, lin(g, 0, -64, 0, 32, ['#26231a', '#0d0c08']), BRASS, 3.5); g.restore(); round(g, -60, -58, 318, 84, 6, null, '#dcb95e55', 1);
  chevrons(g, -34, -16, 30, 3, '#d9c28a', 4);
  if (tr) { fitText(g, `${num(tr.amount)} DOG`, 126, -34, 30, 205, MOONC, '900', HEAD); text(g, `BLOCK ${num(tr.block)}`, 126, -6, 14, '#cfc7a6', 'Arial', 'center', '800'); if (tr.from && tr.to) text(g, `${shortAddr(tr.from)} → ${shortAddr(tr.to)}`, 126, 13, 10, '#8d876c', MONO, 'center', '700'); }
  else { fitText(g, 'THE ARMY MARCHES', 126, -30, 24, 205, MOONC, '900', HEAD); text(g, 'TRANSFER DATA PENDING', 126, -2, 11, '#cfc7a6', 'Arial', 'center', '800'); }
  g.beginPath(); g.arc(228, -16, 26, 0, 7); g.fillStyle = lin(g, 0, -42, 0, 10, ['#f6e3a6', BRASS, BRASS_D]); g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); text(g, `${val}×`, 228, -15, 26, INK, HEAD, 'center', '900');
  g.restore(); }
/* ----- Respin animation: empty ranks spin like reels, stop with a bounce; locks slam in with a shake; the last respin builds tension ----- */
const shakeOf = now => { const sh = scene && scene.shakes; if (!sh || !sh.length || RM()) return null; let x = 0, y = 0; for (let i = sh.length - 1; i >= 0; i--) { const a = now - sh[i].t; if (a > 380) { sh.splice(i, 1); continue; } if (a < 0) continue; const k = sh[i].amp * Math.exp(-a / 90); x += Math.sin(a * .09 + i) * k; y += Math.cos(a * .13 + i * 2) * k; } return [x, y]; };
function drawSpinCell(g, x, y, w, h, i, now, speed, reach, phase) {
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, 18); g.clip(); g.fillStyle = '#080806'; g.fillRect(x, y, w, h);
  const th = h * .8, len = TRANSFERS.length, base = (scene ? scene.tOff : 0);
  for (let k = -1; k < 3; k++) {
    const idx = Math.floor(phase / th) - k, ty = y + ((phase % th) + k * th) - th * .3, wild = i === MARCH_CELLS && ((idx % 3) + 3) % 3 === 0;
    const tile = wild ? tileFor('wild') : tileFor('chain', len ? (((base + i + idx * 3) % len) + len) % len : -1);
    if (!tile) continue; const sz = th * .92;
    for (let b = 0; b < 3; b++) { g.globalAlpha = (b === 1 ? .62 : .2) * Math.min(1, .35 + speed); g.drawImage(tile, x + w / 2 - sz / 2, ty + (b - 1) * Math.min(26, 4 + speed * 30), sz, sz); }
  }
  g.globalAlpha = 1; const vg = lin(g, 0, y, 0, y + h, ['#050504ee', '#05050400', '#05050400', '#050504ee']); g.fillStyle = vg; g.fillRect(x, y, w, h);
  g.fillStyle = '#ffffff'; for (let k = 0; k < 7; k++) { const sx = x + 14 + ((k * 53 + i * 17) % (w - 28)), sy = y + (((now * (.5 + speed) * .9 + k * 97 + i * 31) % h)); g.globalAlpha = .07 + .06 * speed; g.fillRect(sx, sy, 2, 18 + speed * 30); }
  g.restore();
  const pulse = .5 + .5 * Math.sin(now / (reach ? 110 : 160) + i);
  g.save(); g.globalAlpha = reach ? .55 + .45 * pulse : .35 + .3 * pulse; g.shadowColor = reach ? BRASS : ACCENT; g.shadowBlur = reach ? 26 : 12; round(g, x, y, w, h, 18, null, reach ? BRASS : '#d9c07a', reach ? 4 : 2.5); g.restore();
  if (i === MARCH_CELLS) { g.save(); g.globalAlpha = .5 + .5 * pulse; g.shadowColor = '#ff3b2a'; g.shadowBlur = 24; round(g, x - 2, y - 2, w + 4, h + 4, 20, null, '#ff6a52', 3); g.restore(); text(g, 'LEONIDAS', x + w / 2, y + 20, 13, '#ffb3a6', 'Arial', 'center', '900'); }
}
function drawMarchBoard(now, f, introT = 1) {
  const fr = f.frames[f.index]; drawNight(now, { ranks: 0, beamPow: .6, moon: { x: RX + RW - 150, y: RY + 90, r: 60 }, shade: .5 });
  const shk = shakeOf(now); sg.save(); if (shk) sg.translate(shk[0], shk[1]);
  const pdt = scene.phT == null ? 16 : Math.min(64, now - scene.phT); scene.phT = now; if (!scene.ph) scene.ph = new Array(15).fill(0);
  const stamps = scene.stamps, shownCells = [], stopsM = scene.stops, spinEnd = scene.spinEnd || 0, allDone = fr.cells.every(Boolean) && [...stamps.values()].every(t => now >= t); let totalNow = 0;
  fr.cells.forEach((v, i) => {
    const c = i % 5, r = Math.floor(i / 5), x = RX + c * CW + 10, y = RY + r * RHT + 8, w = CW - 23, h = RHT - 16, appear = RM() ? 1 : clamp(introT * 2.5 - i * .05), st = stamps.get(i), vis = v && (st == null || now >= st);
    if (vis) {
      totalNow += v; shownCells.push(i); const age = st == null ? 1e9 : now - st, fresh = age < 900, s = fresh && !RM() ? 1 + .4 * (1 - ease(age / 350)) : 1, dy = fresh && !RM() ? -110 * (1 - ease(age / 300)) : 0;
      sg.save(); sg.globalAlpha = appear; sg.translate(x + w / 2, y + h / 2 + dy); sg.scale(s, s); sg.shadowColor = BRASS; sg.shadowBlur = fresh ? 34 : 12;
      round(sg, -w / 2 + 6, -h / 2 + 2, w - 12, h - 4, 14, '#0b0a07cc', BRASS, 2); sg.shadowBlur = 0;
      const tile = i < MARCH_CELLS ? tileFor('chain', chainFace(i)) : tileFor('wild'); if (tile) sg.drawImage(tile, -84, -84, 168, 168);
      round(sg, 34, 34, 70, 40, 14, BRASS, INK, 3); text(sg, `${v}×`, 69, 54.5, 24, INK, HEAD, 'center', '900'); text(sg, i < MARCH_CELLS ? `RANK ${i + 1}` : 'LEONIDAS · RANK 15', -w / 2 + 14, -h / 2 + 18, 12, '#cfc7a6', 'Arial', 'left', '900');
      if (fresh && !RM()) { sg.globalAlpha = 1 - age / 900; sg.lineWidth = 6; sg.strokeStyle = BRASS; sg.beginPath(); sg.arc(0, 0, 90 + age / 4, 0, 7); sg.stroke(); sg.globalAlpha = Math.max(0, .5 - age / 500); sg.fillStyle = '#fff6d6'; sg.beginPath(); sg.roundRect(-w / 2 + 6, -h / 2 + 2, w - 12, h - 4, 14); sg.fill(); }
      if (!RM() && !fresh) { sg.save(); sg.globalAlpha = .13; sg.beginPath(); sg.roundRect(-w / 2 + 6, -h / 2 + 2, w - 12, h - 4, 14); sg.clip(); const sh = (((now / 2200 + i * .11) % 1.7) - .35) * (w + h) - w / 2 - 40; sg.fillStyle = '#fff6d6'; sg.beginPath(); sg.moveTo(sh, -h / 2); sg.lineTo(sh + 34, -h / 2); sg.lineTo(sh - 30 + 34 - h * .3, h / 2); sg.lineTo(sh - 30 - h * .3, h / 2); sg.fill(); sg.restore(); }
      if (i === MARCH_CELLS && allDone && !RM()) { // Leonidas's eyes fire red beams along the front rank when the whole parade is in
        const fl = .7 + .3 * Math.sin(now / 45); sg.save(); sg.globalCompositeOperation = 'lighter'; sg.shadowColor = '#ff2a1a'; sg.shadowBlur = 26; sg.lineCap = 'round';
        for (const [ex, sgn] of [[-8.5, -1], [13.9, 1]]) for (const [wd, col] of [[16, 'rgba(255,40,20,.25)'], [7, 'rgba(255,90,60,.55)'], [2.5, 'rgba(255,255,255,.95)']]) { sg.strokeStyle = col; sg.lineWidth = wd * fl; sg.beginPath(); sg.moveTo(ex, -18.6); sg.lineTo(ex + sgn * (sgn < 0 ? 760 : 90), -18.6 + (sgn < 0 ? -6 : -3) + Math.sin(now / 70) * 3); sg.stroke(); }
        sg.restore(); }
      sg.restore();
    } else {
      const stopT = stopsM ? stopsM.get(i) : null, spinning = stopT != null && now < stopT && introT >= 1 && !RM(), reach = spinning && stamps.has(i);
      if (spinning) { const sp = reach && now >= spinEnd ? .32 : Math.max(.2, Math.min(1, (stopT - now) / Math.max(1, stopT - spinEnd) + .25)); scene.ph[i] += pdt * .9 * sp; drawSpinCell(sg, x, y, w, h, i, now, sp, reach, scene.ph[i]); }
      else { const a = stopT != null ? now - stopT : 1e9, bounce = a >= 0 && a < 380 && !RM() ? Math.sin(a / 380 * Math.PI) * 9 * Math.exp(-a / 200) : 0;
        sg.save(); sg.globalAlpha = appear * .92; sg.translate(0, bounce); round(sg, x, y, w, h, 18, '#0a0a07dd', i === MARCH_CELLS ? '#e0624a99' : '#d9c07a44', 2); soldier(sg, x + w / 2, y + h - 22, 96, 0, '#d9c07a22'); text(sg, String(i + 1), x + 22, y + 24, 18, '#d9c07a66', HEAD, 'center', '900'); sg.restore(); }
    }
  });
  // marching banners
  const xs = RX - 230, xe = RX + RW + 230;
  for (const b of scene.banners) { const u = (now - b.t0) / b.dur; if (u < 0 || u > 1) continue; const cy = RY + Math.floor(b.cell / 5) * RHT + RHT / 2; marchBanner(sg, xs + (xe - xs) * u, cy, b.tr, b.val, now / 120); }
  const k = shownCells.length, waiting = scene.resetFlash && now < scene.resetFlash && scene.prevLeft != null, left = waiting ? scene.prevLeft : fr.left, flash = scene.resetFlash && !waiting && now - scene.resetFlash < 900 && left === 3;
  sg.save(); sg.shadowColor = flash ? BRASS : ACCENT; sg.shadowBlur = flash ? 30 : 12; round(sg, 430, RY - 30, 540, 52, 26, '#14120ef2', flash ? BRASS : ACCENT, 3); sg.restore();
  text(sg, `MARCH · ${k}/15 RANKS · RESPINS`, 630, RY - 4, 20, '#f4efe0', 'Arial', 'center', '900');
  for (let d = 0; d < 3; d++) { sg.beginPath(); sg.arc(850 + d * 28, RY - 4, 10, 0, 7); sg.fillStyle = d < left ? (flash ? '#fff' : BRASS) : '#3a3629'; sg.fill(); if (flash && d < left && !RM()) { sg.strokeStyle = '#fff'; sg.lineWidth = 2; sg.beginPath(); sg.arc(850 + d * 28, RY - 4, 10 + (now - scene.resetFlash) / 60, 0, 7); sg.stroke(); } }
  // the respin just spent: its pip pops and fades
  if (scene.pipUse && now - scene.pipUse.t < 700 && !RM()) { const a = (now - scene.pipUse.t) / 700, px = 850 + scene.pipUse.i * 28; sg.save(); sg.globalAlpha = 1 - a; sg.strokeStyle = '#ff7a5a'; sg.lineWidth = 3; sg.beginPath(); sg.arc(px, RY - 4, 10 + a * 26, 0, 7); sg.stroke(); sg.restore(); }
  // running total, counting up as each rank lands
  { if (scene.totShown == null) scene.totShown = totalNow; scene.totShown += (totalNow - scene.totShown) * Math.min(1, pdt / 160); if (Math.abs(totalNow - scene.totShown) < .5) scene.totShown = totalNow; const bump = scene.totBump && now - scene.totBump < 400 ? 1 + .18 * Math.sin((now - scene.totBump) / 400 * Math.PI) : 1;
    sg.save(); sg.translate(RX + 190, RY - 4); sg.scale(bump, bump); sg.shadowColor = BRASS; sg.shadowBlur = bump > 1 ? 26 : 8; round(sg, -150, -26, 300, 52, 26, '#14120ef2', BRASS, 3); sg.shadowBlur = 0; text(sg, 'WIN', -108, 1, 15, '#cfc7a6', 'Arial', 'center', '900'); fitText(sg, fmt(Math.round(scene.totShown) * f.bet), 34, 1, 28, 190, '#f4efe0', '900', HEAD); sg.restore(); }
  // the last respin: a red edge pulse and a warning
  const spinningNow = stopsM && [...stopsM.values()].some(t => now < t);
  if (scene.lastRespin && spinningNow && !RM()) { const pu = .5 + .5 * Math.sin(now / 120); sg.save(); sg.beginPath(); sg.rect(0, RY + 26, 1400, 960); sg.clip(); sg.globalAlpha = .25 + .45 * pu; sg.shadowColor = '#ff3b2a'; sg.shadowBlur = 36; round(sg, RX - 4, RY - 4, RW + 8, RH + 8, 22, null, '#ff5a40', 6); sg.restore(); sg.save(); sg.globalAlpha = .6 + .4 * pu; text(sg, 'LAST RESPIN', 1150, RY - 4, 22, '#ffb3a6', HEAD, 'center', '900'); sg.restore(); }
  if (allDone && !RM()) { const u = (now / 1600) % 1, per = 2 * (RW + RH); let d0 = u * per; sg.save(); sg.shadowColor = BRASS; sg.shadowBlur = 24; sg.strokeStyle = '#fff3c0'; sg.lineWidth = 6; sg.lineCap = 'round'; sg.beginPath(); const pts = [[RX, RY], [RX + RW, RY], [RX + RW, RY + RH], [RX, RY + RH], [RX, RY]]; let rem = d0, started = false; for (let q = 0; q < 4; q++) { const [ax, ay] = pts[q], [bx, by] = pts[q + 1], L = Math.hypot(bx - ax, by - ay); if (rem > L) { rem -= L; continue; } const fx0 = ax + (bx - ax) * rem / L, fy0 = ay + (by - ay) * rem / L, e = Math.min(rem + 260, L), fx1 = ax + (bx - ax) * e / L, fy1 = ay + (by - ay) * e / L; sg.moveTo(fx0, fy0); sg.lineTo(fx1, fy1); break; } sg.stroke(); sg.restore(); }
  sg.restore();
}
/* ----- To the Moon: the army looks up as the moon fills the screen ----- */
function drawDogMark(g, x, y, size, onDark) {
  const lg = onDark ? (img.dogWhite || img.dogBlack) : (img.dogBlack || img.dogWhite);
  if (lg) { const k = Math.min(size / lg.width, size / lg.height); g.drawImage(lg, x - lg.width * k / 2, y - lg.height * k / 2, lg.width * k, lg.height * k); }
  else { g.save(); g.shadowColor = '#0004'; g.shadowBlur = 6; fitText(g, '$DOG', x, y, size * .62, size * 1.1, onDark ? '#f4efe0' : '#1c1a14', '900', 'Arial Black, Arial'); g.restore(); } }
function drawJackpotShow(now, t, amount) {
  const g = sg, still = RM(), outro = scene.stage === 'outro', tt = outro ? 99 : t, u = still ? 1 : ease(clamp(tt / (quick() ? 1.2 : 3.4))), R = 70 + u * 600, mx = 700, my = 330 + (1 - u) * 160, look = still ? 1 : clamp(tt / 1.3);
  g.save(); g.fillStyle = lin(g, 0, 0, 0, 960, ['#020203', '#080b10', '#141a16']); g.fillRect(0, 0, 1400, 960);
  for (const s of starField) { g.globalAlpha = .2 + .6 * s.s * (still ? .7 : .5 + .5 * Math.sin(now / 400 + s.tw)); g.fillStyle = '#fff'; g.beginPath(); g.arc(s.x, s.y, s.r * 1.2, 0, 7); g.fill(); } g.globalAlpha = 1;
  g.fillStyle = rad(g, mx, my, R * .8, R * 2.3, ['rgba(255,244,205,.38)', 'rgba(255,244,205,0)']); g.beginPath(); g.arc(mx, my, R * 2.3, 0, 7); g.fill();
  g.save(); g.beginPath(); g.rect(0, 0, 1400, 960); g.clip(); moonDisc(g, mx, my, R, { glow: 1.2 }); drawDogMark(g, mx, my + R * .02, R * 1.15, !!(!img.dogBlack && img.dogWhite)); g.restore();
  g.save(); g.translate(0, 0); const bx0 = RX, bx1 = RX + RW; g.globalCompositeOperation = 'lighter'; [200, 520, 880, 1200].forEach((bx, i) => { const by = 900, ang = Math.atan2(my - by, mx - bx) + (still ? 0 : Math.sin(now / 700 + i) * .05 * (1 - u)), len = 1100, sp = .045; g.fillStyle = lin(g, bx, by, bx + Math.cos(ang) * len, by + Math.sin(ang) * len, [`rgba(255,246,214,${.22 * u})`, `rgba(255,246,214,${.06 * u})`, 'rgba(255,246,214,0)']); g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(ang - sp) * len, by + Math.sin(ang - sp) * len); g.lineTo(bx + Math.cos(ang + sp) * len, by + Math.sin(ang + sp) * len); g.closePath(); g.fill(); }); g.restore(); void bx0; void bx1;
  // the whole army, looking up
  const rows = [{ y: 980, h: 210, n: 8, sh: '#010101' }, { y: 930, h: 150, n: 11, sh: '#030303' }, { y: 884, h: 104, n: 15, sh: '#050605' }];
  for (const row of rows) { const gap = 1500 / row.n; for (let i = 0; i < row.n; i++) soldier(g, -50 + i * gap + (row.y % 13) + gap / 2, row.y, row.h, still ? 0 : now / 900 + i, row.sh, look, 'rgba(244,239,224,.34)'); }
  g.restore();
  if (outro) { if (!still && Math.random() < .08) burst(200 + Math.random() * 1000, 120 + Math.random() * 200, 14, 'confetti', 1); return; }
  g.save(); g.shadowColor = BRASS; g.shadowBlur = 40; fitText(g, 'TO THE MOON', 700, 100, 108, 1200, '#fff3c0', '900', HEAD); g.restore(); spaced(g, 'JACKPOT', 700, 172, 24, 14, BRASS, '900');
  if (tt > 1.3) { const letters = 'A W O O O O O O !'.split(' '); g.save(); g.shadowColor = '#000'; g.shadowBlur = 8; letters.forEach((ch, i) => { const o = clamp((tt - 1.3 - i * .1) * 4); g.globalAlpha = o; text(g, ch, 380 + i * 80, 255 + (still ? 0 : Math.sin(now / 260 + i * .7) * 9) - (1 - o) * 20, 40, '#fffbe6', HEAD, 'center', '900'); }); g.restore(); }
  const shown = amount * ease(clamp((tt - .4) / (quick() ? .9 : 3.2)));
  g.save(); round(g, 360, 640, 680, 120, 28, '#05040299', '#dcb95e', 3); g.shadowColor = BRASS; g.shadowBlur = 30; text(g, `${fmt(Math.floor(shown))} LAYR`, 700, 700, 68, '#ffffff', 'Arial', 'center', '900'); g.restore();
  if (!still && Math.random() < .12) burst(200 + Math.random() * 1000, 150 + Math.random() * 300, 20, Math.random() < .5 ? 'dog' : 'star', 1);
}
/* ----- Moon or Doom: a coin with the full moon on one side and the eclipse on the other ----- */
function drawCoin(now, face, spinT) {
  const cx = 700, cy = RY + 250, r = 120, flip = spinT == null ? Math.sin(now / 600) * .2 + 1 : Math.cos(spinT * Math.PI * 10), sx = Math.max(.05, Math.abs(flip)), show = spinT == null ? 'moon' : flip >= 0 ? face : (face === 'moon' ? 'doom' : 'moon');
  sg.save(); sg.translate(cx, cy - (spinT != null && !RM() ? Math.sin(clamp(spinT) * Math.PI) * 120 : 0)); sg.scale(sx, 1);
  sg.shadowColor = show === 'moon' ? BRASS : '#b3402f'; sg.shadowBlur = 30; sg.beginPath(); sg.arc(0, 0, r, 0, 7); sg.fillStyle = rad(sg, -30, -40, 10, 160, ['#f6e3a6', '#c9a24a', '#7a5d1a']); sg.fill(); sg.lineWidth = 10; sg.strokeStyle = INK; sg.stroke(); sg.shadowBlur = 0;
  sg.beginPath(); sg.arc(0, 0, r - 18, 0, 7); sg.setLineDash([4, 9]); sg.lineWidth = 4; sg.strokeStyle = '#6d5316'; sg.stroke(); sg.setLineDash([]);
  if (show === 'moon') { moonDisc(sg, 0, -6, r - 28, { glow: 0 }); sg.save(); sg.shadowColor = '#fff8'; sg.shadowBlur = 4; text(sg, 'MOON', 0, 64, 30, '#2a261c', HEAD, 'center', '900'); sg.restore(); }
  else { sg.beginPath(); sg.arc(0, -6, r - 28, 0, 7); sg.fillStyle = '#060606'; sg.fill(); sg.save(); sg.beginPath(); sg.arc(0, -6, r - 28, 0, 7); sg.clip(); sg.fillStyle = rad(sg, 0, -6, r - 48, r - 26, ['rgba(255,170,90,0)', 'rgba(255,150,70,.85)', 'rgba(255,238,200,.95)']); sg.beginPath(); sg.arc(0, -6, r - 26, 0, 7); sg.fill(); sg.beginPath(); sg.arc(0, -6, r - 50, 0, 7); sg.fillStyle = '#050505'; sg.fill(); sg.restore(); sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 6; text(sg, 'DOOM', 0, 64, 30, '#ff7a5c', HEAD, 'center', '900'); sg.restore(); }
  sg.restore(); }
