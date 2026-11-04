
/* ---------- The cabinet screen: a tapestry hung from a brass rod in a bazaar stall, tasselled at the foot ---------- */
// The casino turns this canvas into the cabinet's screen texture; the version bump is how it knows to re-upload.
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const screenTexture = { version: 0, set needsUpdate(v) { if (v) this.version++; } };
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
// A kilim band: a stepped run of knots in wool, indigo and brass (a weaving pattern, not anyone's art).
function kilimBand(g, x, y, w, h, vertical = false, k = 6) { const n = Math.floor((vertical ? h : w) / k), m = Math.max(1, Math.floor((vertical ? w : h) / k)), PAL = [MADDER, WOOL, INDIGO, BRASS];
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const d = Math.abs(((i % 12) - 6)) , band = (j + d) % 4; g.fillStyle = j === 0 || j === m - 1 ? WOOD : PAL[band]; if (vertical) g.fillRect(x + j * k, y + i * k, k, k); else g.fillRect(x + i * k, y + j * k, k, k); } }
(function drawBase() { const g = baseLayer.getContext('2d');
  // The stall wall behind: dark wood planks.
  g.fillStyle = lin(g, 0, 0, 1400, 0, ['#1a0d07', '#2a160c', '#1a0d07']); g.fillRect(0, 0, 1400, 960); for (let x = 0; x < 1400; x += 70) { g.fillStyle = '#0000002a'; g.fillRect(x, 0, 3, 960); }
  // The tapestry: a madder field with a fine weft texture.
  g.fillStyle = lin(g, 0, 24, 0, 930, ['#5e1610', '#7c1d14', '#6a1911', '#4e120c']); g.fillRect(8, 24, 1384, 900);
  for (let y = 24; y < 924; y += 4) { g.fillStyle = (y / 4) % 2 ? '#ffffff07' : '#00000012'; g.fillRect(8, y, 1384, 2); }
  for (let k = 0; k < 900; k++) { const h = hashStr('t' + k); g.fillStyle = (h & 1) ? '#ffd9a00a' : '#00000018'; g.fillRect(8 + h % 1384, 24 + (h >>> 11) % 900, 3, 2); }
  kilimBand(g, 8, 24, 1384, 18); kilimBand(g, 8, 900, 1384, 18); kilimBand(g, 8, 24, 18, 894, true); kilimBand(g, 1374, 24, 18, 894, true);
  // The brass rod it hangs from, with finials and rings.
  g.fillStyle = lin(g, 0, 6, 0, 22, [BRASS_HI, BRASS, '#7a5212']); round(g, 0, 6, 1400, 16, 8, g.fillStyle);
  for (const x of [10, 1390]) { g.beginPath(); g.arc(x, 14, 13, 0, 7); g.fillStyle = BRASS_HI; g.fill(); g.strokeStyle = '#5a3a0c'; g.lineWidth = 2; g.stroke(); }
  for (let x = 60; x < 1360; x += 110) { g.strokeStyle = BRASS; g.lineWidth = 4; g.beginPath(); g.ellipse(x, 22, 9, 12, 0, 0, 7); g.stroke(); }
  // Tassels along the foot.
  for (let x = 30; x < 1380; x += 34) { g.fillStyle = BRASS; g.fillRect(x - 3, 918, 6, 8); g.fillStyle = lin(g, 0, 926, 0, 956, [WOOL, '#cdb88f']); g.beginPath(); g.moveTo(x - 6, 926); g.lineTo(x + 6, 926); g.lineTo(x + 9, 956); g.lineTo(x - 9, 956); g.closePath(); g.fill(); g.strokeStyle = '#9a8460'; g.lineWidth = 1; for (let t = -6; t <= 6; t += 3) { g.beginPath(); g.moveTo(x + t * .7, 930); g.lineTo(x + t * 1.3, 955); g.stroke(); } }
  // Header cartouches: the rescue ledger, the jackpot, the Rescue Pot.
  for (const x of [34, 1002]) { round(g, x, 50, 364, 140, 14, '#f1e4c6', BRASS, 4); g.fillStyle = '#e2d0aa'; for (let y = 92; y < 186; y += 22) g.fillRect(x + 14, y, 336, 1); }
  g.shadowColor = GOLD; g.shadowBlur = 14; round(g, 412, 46, 576, 148, 14, '#2a1206', lin(g, 412, 46, 988, 194, [BRASS_HI, BRASS, '#8a5a14', BRASS_HI, '#b8862e']), 6); g.shadowBlur = 0;
  text(g, 'RESCUE LEDGER', 216, 70, 17, MADDER, 'Arial', 'center', '900'); text(g, 'MAGIC CARPET RIDE JACKPOT', 700, 72, 23, BRASS_HI, 'Georgia, serif', 'center', '900'); text(g, 'RESCUE POT', 1184, 70, 17, MADDER, 'Arial', 'center', '900');
  // The reel window: a brass frame round a deep indigo ground.
  round(g, RX - 14, RY - 14, RW + 28, RH + 28, 18, '#0d1020', lin(g, 0, RY - 14, 0, RY + RH + 14, [BRASS_HI, '#9a6a1c', BRASS, '#6b440e']), 7);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#141a30', '#1f2a4a', '#141a30']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff10'; g.fillRect(45, 893, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function highlightIndex(now) { return !spinning && !feature() && !scene && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
// The twin shown in the first paying cell of a winning line: its cameo (and, later, its holder's royalty).
function cameoFor(w, grid = state.grid, fc = faces) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = grid[c][line[c]]; if ((s === w.symbol || s === 'wild') && itemFor(s, fc[c][line[c]])?.bird) return itemFor(s, fc[c][line[c]]); } return null; }
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = GOLD; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, GOLD, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, BRASS_HI, 4); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 14; sg.lineWidth = 5; sg.strokeStyle = '#f6dc94c8'; sg.setLineDash([14, 8]); sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); } // the winning line as a running stitch
  else if (state.showLines && !spinning) { sg.strokeStyle = '#d9a44166'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The last 21 rounds as small rug swatches: lit where the round paid. It scrolls; it never fills, resets or builds towards anything.
function drawBlocks() { const h = state.history.slice(0, 21).reverse(), n = 21, s = 15, gap = 6, w = n * (s + gap) - gap, x0 = 700 - w / 2, y = 866;
  text(sg, 'LAST 21 ROUNDS', x0 - 20, y + s / 2 + 2, 12, '#e2b98a', 'Arial', 'right', '700');
  for (let i = 0; i < n; i++) { const e = h[i - (n - h.length)], x = x0 + i * (s + gap); round(sg, x, y + 2, s * .8, s, 2, e ? (e.win > 0 ? BRASS_HI : '#3a1d14') : '#2a1410', i === n - 1 && e ? WOOL : null, 1.5); if (e && e.win > 0) { sg.fillStyle = WOOL; sg.fillRect(x + 1, y - 1, 1, 3); sg.fillRect(x + s * .8 - 2, y - 1, 1, 3); sg.fillRect(x + 1, y + s + 2, 1, 3); sg.fillRect(x + s * .8 - 2, y + s + 2, 1, 3); } } }
