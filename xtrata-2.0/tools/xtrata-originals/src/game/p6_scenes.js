/* ---------- The Chorus: nine cicadas on a branch; each one opened sings its seed-encoded call as its prize is revealed ---------- */
const BRANCH = Array.from({ length: 9 }, (_, i) => { const t = i / 8, x = 150 + t * 1100, y = 650 - t * 250 - Math.sin(t * Math.PI) * 70; return [x, y, i % 2 ? -1 : 1]; });
function chorusFace(i, f) { // after the deal: rarer cicadas sing the bigger prizes (art only, Math.random among equals)
  pres.faces = pres.faces || {}; if (pres.faces[i]) return pres.faces[i];
  const order = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'], m = f.awards[i], want = m >= 15 ? 5 : m >= 10 ? 4 : m >= 8 ? 3 : m >= 5 ? 2 : m >= 3 ? 1 : 0;
  const pool = pools.vault.length ? pools.vault : []; let best = null, bd = 9; for (const it of pool.slice().sort(() => Math.random() - .5)) { const d = Math.abs(order.indexOf(it.tier) - want); if (d < bd) { bd = d; best = it; } }
  return (pres.faces[i] = best);
}
function drawChorusBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#0a1430', '#1b2350', '#3a2a46', '#1a1310']); g.fillRect(0, 0, 1400, 960);
  g.save(); g.fillStyle = '#ffffff'; let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 110; i++) { g.globalAlpha = .2 + rnd() * .6 * (reduced() ? 1 : .7 + .3 * Math.sin(now / 700 + i)); g.fillRect(rnd() * 1400, rnd() * 420, 1.6, 1.6); } g.restore();
  g.save(); g.shadowColor = '#ffe6b0'; g.shadowBlur = 50; g.fillStyle = '#f6e8c8'; g.beginPath(); g.arc(1180, 150, 58, 0, 7); g.fill(); g.restore();
  g.fillStyle = '#0d0a08'; g.beginPath(); g.moveTo(0, 960); for (let x = 0; x <= 1400; x += 70) g.lineTo(x, 860 + Math.sin(x * .013) * 30 + Math.sin(x * .041) * 12); g.lineTo(1400, 960); g.fill();
  // the branch
  g.save(); g.lineCap = 'round'; g.strokeStyle = '#2b1d12'; g.lineWidth = 46; g.beginPath(); g.moveTo(-40, 720); BRANCH.forEach(([x, y]) => g.lineTo(x, y + 64)); g.lineTo(1460, 330); g.stroke();
  g.strokeStyle = '#4a3423'; g.lineWidth = 14; g.beginPath(); g.moveTo(-40, 708); BRANCH.forEach(([x, y]) => g.lineTo(x, y + 52)); g.lineTo(1460, 318); g.stroke();
  g.strokeStyle = '#2b1d12'; g.lineWidth = 16; g.beginPath(); g.moveTo(560, 590); g.quadraticCurveTo(640, 470, 760, 430); g.stroke(); g.beginPath(); g.moveTo(1000, 470); g.quadraticCurveTo(1060, 610, 1150, 650); g.stroke(); g.restore();
}
function drawChorus(f, now) {
  drawChorusBackdrop(now); const done = f.picks.length === 3, R = reduced();
  text(sg, 'THE CHORUS', 700, 70, 52, '#d8f5a8', 'Arial', 'center', '900'); text(sg, 'Open three. Each cicada sings its own seed-encoded call.', 700, 116, 20, '#b8c9a8', 'Arial', 'center', '400');
  BRANCH.forEach(([x, y, side], i) => {
    const picked = f.picks.includes(i), t0 = pres.reveal && pres.reveal[i], open = t0 !== undefined ? (now - t0) / (R ? 1 : 900) : (picked ? 1 : -1), face = (open >= 0 || done) ? chorusFace(i, f) : null, sz = 132;
    const bob = R ? 0 : Math.sin(now / 600 + i) * 3, cx = x, cy = y + bob;
    if (picked && face) { // singing: rings radiate for the length of the call
      const el = (now - (t0 || now)) / 1000, dur = face.seconds || 6.5;
      if (el < dur && !R) for (let k = 0; k < 4; k++) { const ph = ((el * 1.6 + k / 4) % 1); sg.save(); sg.globalAlpha = (1 - ph) * .55; sg.strokeStyle = '#d8f5a8'; sg.lineWidth = 3; sg.beginPath(); sg.arc(cx, cy, sz * .45 + ph * 140, 0, 7); sg.stroke(); sg.restore(); }
      const k = ease(open), s = sz * (1 + .25 * Math.sin(Math.PI * clamp01(open)) * (R ? 0 : 1));
      sg.save(); sg.shadowColor = '#d8f5a8'; sg.shadowBlur = 30; sg.beginPath(); sg.arc(cx, cy, s / 2 + 6, 0, 7); sg.fillStyle = '#0d1306'; sg.fill(); sg.clip(); sg.drawImage(face.img, cx - s / 2, cy - s / 2, s, s); sg.restore();
      sg.strokeStyle = CICADA_TIER[face.tier] || '#d8f5a8'; sg.lineWidth = 4; sg.beginPath(); sg.arc(cx, cy, s / 2 + 6, 0, 7); sg.stroke();
      const py = side > 0 ? cy + 118 : cy - 132; round(sg, cx - 92, py - 34, 184, 92, 14, 'rgba(8,14,4,.92)', '#d8f5a8', 3);
      neon(sg, `${Math.max(1, Math.round(f.awards[i] * k))}×`, cx, py - 2, 40, '#fff', '#9bcf6a', '900'); text(sg, `${fmt(f.awards[i] * f.bet * k)} LAYR`, cx, py + 32, 15, '#d8f5a8');
      const n = face.env.length, w = 150 / n, prog = clamp01(el / dur); for (let j = 0; j < n; j++) { const h = Math.max(2, face.env[j] * 26); sg.fillStyle = j / n <= prog ? '#d8f5a8' : '#3a4a2a'; sg.fillRect(cx - 75 + j * w, (side > 0 ? cy - 100 : cy + 96) - h / 2, Math.max(1, w - .6), h); }
      text(sg, `SEED ${face.seed} · ${face.tier.toUpperCase()}`, cx, side > 0 ? cy - 126 : cy + 124, 13, CICADA_TIER[face.tier] || '#d8f5a8', 'Arial', 'center', '800');
      if (open < .18) { sg.fillStyle = `rgba(255,255,255,${.7 * (1 - open / .18)})`; sg.beginPath(); sg.arc(cx, cy, s / 2 + 30, 0, 7); sg.fill(); }
    } else if (done && face) { // the ones left unopened show what they held, quietly
      sg.save(); sg.globalAlpha = .38; sg.beginPath(); sg.arc(cx, cy, sz * .38, 0, 7); sg.clip(); sg.drawImage(face.img, cx - sz * .38, cy - sz * .38, sz * .76, sz * .76); sg.restore(); text(sg, `${f.awards[i]}×`, cx, side > 0 ? cy + 82 : cy - 82, 24, '#6f7d5f');
    } else { // sealed: a cicada shell in silhouette, numbered, waiting to sing
      const hv = pres.stage === 'play' && !R ? .5 + .5 * Math.sin(now / 500 + i) : 0, it = pools.vault[i % Math.max(1, pools.vault.length)];
      sg.save(); sg.shadowColor = '#9bcf6a'; sg.shadowBlur = 10 + hv * 16; sg.beginPath(); sg.arc(cx, cy, sz * .42, 0, 7); sg.fillStyle = '#0e1508'; sg.fill(); sg.restore();
      if (it && it.img) { sg.save(); sg.beginPath(); sg.arc(cx, cy, sz * .42, 0, 7); sg.clip(); sg.drawImage(it.img, cx - sz * .42, cy - sz * .42, sz * .84, sz * .84); sg.fillStyle = 'rgba(8,12,4,.84)'; sg.fillRect(cx - sz * .42, cy - sz * .42, sz * .84, sz * .84); sg.restore(); }
      sg.strokeStyle = `rgba(155,207,106,${.5 + hv * .5})`; sg.lineWidth = 3; sg.beginPath(); sg.arc(cx, cy, sz * .42, 0, 7); sg.stroke();
      text(sg, String(i + 1), cx, cy, 44, '#d8f5a8', 'Arial', 'center', '900'); text(sg, 'TAP TO HEAR', cx, side > 0 ? cy + 74 : cy - 74, 13, '#9bb58a', 'Arial', 'center', '700');
      if (pres.stage === 'play') hits.push({ id: 'cicada' + i, x: cx - 70, y: cy - 70, w: 140, h: 140, fn: () => pickBind(i) });
    }
  });
}
/* ---------- Layers: each lock stacks a glowing layer, a real Xtrata inscription with its value, into a rising tower ---------- */
const GX = 40, GY = 210, GW = 166, GH = 186;
function layerItem(f, i) { const arr = pools.chain; let h = 2166136261; for (const ch of String(f.roundId || 'layers') + i) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return arr.length ? arr[(h >>> 0) % arr.length] : null; }
function lockOrder(f) { const order = []; f.frames.slice(0, f.index + 1).forEach((fr, k) => { if (k === 0) fr.cells.forEach((v, i) => { if (v) order.push(i); }); else fr.added.forEach(i => order.push(i)); }); return order; }
function drawLayersBackdrop(now) { const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#070a12', '#0a1020', '#05070b']); g.fillRect(0, 0, 1400, 960); strata(g, 0, 960, 0); round(g, GX - 10, GY - 10, GW * 5 + 20, GH * 3 + 20, 16, '#04060a', BLUE, 2); }
function drawLayers(f, now) {
  drawLayersBackdrop(now); const fr = f.frames[f.index], fresh = now - chainFlash < 900 ? fr.added : [], R = reduced();
  text(sg, 'LAYERS', GX + GW * 2.5, 70, 50, WHITE, 'Arial', 'center', '900'); text(sg, 'Every lock stacks a real Xtrata inscription onto the tower. Fill all 15 for The X.', GX + GW * 2.5, 112, 17, MUTE, 'Arial', 'center', '400');
  const left = fr.left; for (let k = 0; k < 3; k++) { const on = k < left, x = GX + GW * 2.5 - 90 + k * 90, y = 158, pulse = fresh.length && on && !R ? 1 + .3 * (1 - clamp01((now - chainFlash) / 600)) : 1; sg.save(); sg.shadowColor = OR2; sg.shadowBlur = on ? 20 : 0; sg.beginPath(); sg.arc(x, y, 16 * pulse, 0, 7); sg.fillStyle = on ? OR2 : '#1b2230'; sg.fill(); sg.restore(); }
  text(sg, `${left} RESPIN${left === 1 ? '' : 'S'}`, GX + GW * 2.5 + 190, 158, 15, OR2, 'Arial', 'left', '800');
  fr.cells.forEach((v, i) => { const x = GX + (i % 5) * GW + 6, y = GY + Math.floor(i / 5) * GH + 6, w = GW - 12, h = GH - 12, isNew = fresh.includes(i), age = isNew ? (now - chainFlash) / 900 : 1;
    if (v) { const it = layerItem(f, i); sg.save(); sg.shadowColor = BLUE2; sg.shadowBlur = isNew ? 36 : 12; round(sg, x, y, w, h, 12, '#0b1220', BLUE2, 3); sg.restore();
      if (it) { sg.save(); sg.beginPath(); sg.roundRect(x + 4, y + 4, w - 8, h - 8, 9); sg.clip(); sg.globalAlpha = .55; sg.drawImage(it.tile, x - 6, y - 4, w + 12, w + 12); sg.restore(); }
      sg.fillStyle = 'rgba(4,7,12,.55)'; sg.fillRect(x + 4, y + h - 62, w - 8, 58); neon(sg, `${v}×`, x + w / 2, y + h - 40, 34, '#fff', BLUE2, '900'); text(sg, it ? `#${it.id}` : 'LAYER', x + w / 2, y + h - 14, 14, OR2, 'Courier New', 'center', '700');
      if (isNew) { const k = R ? 1 : ease(age * 2.2), sc = 1.6 - .6 * k; sg.save(); sg.translate(x + w / 2, y + h / 2); sg.rotate(-.18); sg.scale(sc, sc); sg.globalAlpha = 1 - clamp01((age - .5) * 2); round(sg, -70, -22, 140, 44, 8, null, OR2, 4); text(sg, 'LOCKED', 0, 1, 24, OR2, 'Arial', 'center', '900'); sg.restore(); sg.fillStyle = `rgba(255,255,255,${.6 * (1 - age)})`; sg.fillRect(x, y, w, h); }
    } else { round(sg, x, y, w, h, 12, '#06080d', '#1b2434', 2); for (let k = 0; k < 6; k++) { sg.fillStyle = [BLUE, OR, WHITE][k % 3] + '14'; sg.fillRect(x + 8, y + 26 + k * 24, w - 16, 3); } text(sg, 'EMPTY', x + w / 2, y + h / 2, 15, '#2d3a50', 'Arial', 'center', '800'); } });
  // the tower
  const order = lockOrder(f), TX = 900, TW = 440, base = 800, sh = 34; sg.fillStyle = '#0b0f18'; sg.fillRect(TX - 10, base, TW + 20, 14); spaced(sg, 'THE TOWER', TX + TW / 2, base + 34, 15, 6, BLUE3, '800');
  text(sg, `${order.length} / 15 LAYERS · ${fmt(f.frames[f.index].cells.reduce((a, b) => a + b, 0) * f.bet)} LAYR`, TX + TW / 2, base + 60, 16, OR2, 'Arial', 'center', '700');
  order.forEach((ci, k) => { const v = fr.cells[ci], it = layerItem(f, ci), isNew = fresh.includes(ci), drop = isNew && !R ? (1 - ease((now - chainFlash) / 500)) * 260 : 0, y = base - (k + 1) * sh - drop, w = TW - k * 9, x = TX + (TW - w) / 2, col = [BLUE2, OR2, WHITE][k % 3];
    sg.save(); sg.shadowColor = col; sg.shadowBlur = isNew ? 30 : 10; sg.fillStyle = lin(sg, x, y, x, y + sh - 4, [col, col + '88']); sg.beginPath(); sg.roundRect(x, y, w, sh - 4, 6); sg.fill(); sg.restore();
    text(sg, it ? `#${it.id}` : 'LAYER', x + 16, y + sh / 2 - 2, 15, '#05070b', 'Courier New', 'left', '700'); text(sg, `${v}×`, x + w - 16, y + sh / 2 - 2, 17, '#05070b', 'Arial', 'right', '900'); });
  if (f.full || order.length === 15) { const p = R ? 1 : .5 + .5 * Math.sin(now / 160); sg.save(); sg.globalAlpha = p; xBand(sg, TX + TW / 2, base - 15 * sh - 70, 110, 'white', 1, 0, 0, 8); xBand(sg, TX + TW / 2, base - 15 * sh - 70, 110, 'blue', 1, 0, 0, 8); xBand(sg, TX + TW / 2, base - 15 * sh - 70, 110, 'orange', 1, 0, 0, 8); sg.restore(); }
}
/* ---------- The X: five Xtrata marks on the centre row; the three bands of the X assemble with a light sweep ---------- */
function drawXAssembly(now, t, R) {
  const g = sg, k = R ? 1 : clamp01(t / 2600), cx = 700, cy = 360, size = 470;
  const kw = ease(clamp01(k * 1.6)), kb = ease(clamp01(k * 1.6 - .25)), ko = ease(clamp01(k * 1.6 - .5));
  xBand(g, cx, cy, size, 'blue', kb, (1 - kb) * -700, 0, 14 * kb); xBand(g, cx, cy, size, 'orange', ko, 0, (1 - ko) * 600, 14 * ko); xBand(g, cx, cy, size, 'white', kw, 0, (1 - kw) * -600, 14 * kw);
  if (!R && k >= .85) { const u = clamp01((t - 2200) / 1100), x = -400 + u * 2200; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(x - 160, 0, x + 160, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,240,220,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.translate(cx, cy); g.rotate(-.35); g.fillRect(-900 + x - 700, -400, 1800, 800); g.restore(); }
}
function drawJackpotPlay(now) {
  const p = pres, t = p.stage === 'summary' ? 1e9 : now - p.t0, R = reduced(), k = ease(t / (R ? 1200 : 3800)); // behind the summary card the meter holds its full amount
  sg.fillStyle = lin(sg, 0, 0, 0, 960, ['#020306', '#0a0f1c', '#020306']); sg.fillRect(0, 0, 1400, 960);
  if (!R) { sg.save(); sg.translate(700, 360); for (let i = 0; i < 18; i++) { const a = i * Math.PI / 9 + t / 3000; sg.fillStyle = [BLUE + '22', OR + '1c', '#ffffff10'][i % 3]; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 1100, a, a + Math.PI / 18); sg.closePath(); sg.fill(); } sg.restore(); }
  drawXAssembly(now, t, R);
  neon(sg, 'THE X', 700, 650, 92, WHITE, OR, '900'); text(sg, 'XTRATA ORIGINALS · PROGRESSIVE JACKPOT', 700, 712, 22, OR2, 'Arial', 'center', '700');
  neon(sg, fmt(p.amount * k), 700, 800, 96, '#fff', BLUE2, '900'); text(sg, `LAYR · ${fmt(p.bet)} BET LEVEL`, 700, 868, 22, BLUE3, 'Arial', 'center', '700');
}
/* ---------- Bitcoin or Stacks: a coin with the base layer on one face and the layer above it on the other ---------- */
function drawCoin(g, cx, cy, r, angle) {
  const k = Math.cos(angle), btc = k >= 0, w = Math.max(.04, Math.abs(k));
  g.save(); g.translate(cx, cy); g.scale(w, 1); g.shadowColor = btc ? '#f7931a' : '#5546ff'; g.shadowBlur = 34;
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = btc ? lin(g, 0, -r, 0, r, ['#ffc46b', '#f7931a', '#b8640a']) : lin(g, 0, -r, 0, r, ['#8b7dff', '#5546ff', '#2e22b8']); g.fill(); g.shadowBlur = 0; g.lineWidth = 9; g.strokeStyle = btc ? '#ffe2b0' : '#c9c2ff'; g.stroke();
  g.lineWidth = 3; g.strokeStyle = btc ? '#7a4206' : '#1c1470'; g.beginPath(); g.arc(0, 0, r - 18, 0, 7); g.stroke();
  if (btc) { text(g, '₿', 0, -8, r * 1.0, '#fff7e8', 'Arial', 'center', '900'); spaced(g, 'BITCOIN', 0, r * .62, r * .16, 6, '#5a2e02', '900'); }
  else { spaced(g, 'STACKS', 0, -6, r * .3, 4, '#ffffff', '900'); spaced(g, 'LAYER 2 · ON BITCOIN', 0, r * .46, r * .1, 3, '#ddd8ff', '800'); }
  g.restore();
}
function drawGamble(now) {
  const g = sg, p = pres, t = now - p.t0, R = reduced(); g.fillStyle = lin(g, 0, 0, 0, 960, ['#05070b', '#0d1220', '#05070b']); g.fillRect(0, 0, 1400, 960); strata(g, 0, 960, 0);
  const gr = g.createRadialGradient(700, 400, 20, 700, 400, 460); gr.addColorStop(0, 'rgba(70,117,182,.35)'); gr.addColorStop(1, 'rgba(70,117,182,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 960);
  let angle = 0, ly = 420; const fin = p.result && p.result.parity === 'odd' ? Math.PI : 0;
  if (p.stage === 'play') { const u = clamp01(t / (R ? 600 : 1800)); angle = (R ? (u > .5 ? fin : 0) : Math.PI * 2 * 6 * easeIO(u) + fin * easeIO(u)); ly = 420 - Math.sin(u * Math.PI) * (R ? 0 : 190); }
  else if (p.stage === 'summary') angle = fin; else angle = R ? 0 : Math.sin(now / 700) * .6;
  drawCoin(g, 700, ly, 150, angle);
  if (p.result && (p.stage === 'summary' || (p.stage === 'play' && t > (R ? 500 : 1700)))) { const h = p.result.hash; text(g, 'ROUND HASH', 700, 628, 13, MUTE, 'Arial', 'center', '700'); text(g, h.slice(0, 40), 700, 654, 15, '#9fb0c8', 'Courier New', 'center', '700'); text(g, `…${h.slice(40, 63)}`, 700, 676, 15, '#9fb0c8', 'Courier New', 'center', '700');
    round(g, 600, 694, 200, 50, 10, '#0b0f16', p.result.parity === 'odd' ? '#8b7dff' : '#f7931a', 3); text(g, `LAST DIGIT ${h.slice(-1)} · ${p.result.parity === 'odd' ? 'STACKS' : 'BITCOIN'}`, 700, 719, 15, '#fff', 'Arial', 'center', '800'); }
}
