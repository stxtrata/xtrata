/* ---------- The cabinet screen: set into a temple doorway arch, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
// Hanging vines: swaying strands with leaves. Used on the idle frame and in the bonus scenes.
function vines(g, now, x0, x1, len, n, seed = 3, col = '#2f6b3a') {
  g.save(); g.lineCap = 'round'; for (let i = 0; i < n; i++) { const o = (Math.sin(i * 12.9898 + seed) * 43758.5453) % 1, x = x0 + (x1 - x0) * ((i + .5 + o * .3) / n), L = len * (.55 + Math.abs(o) * .6), sway = reduced() ? 0 : Math.sin(now / 1500 + i * 1.7) * 6;
    g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + sway * .5, L * .35, x - sway, L * .7, x + sway, L); g.stroke();
    g.fillStyle = '#3f8a4a'; for (let k = 1; k < 5; k++) { const yy = L * k / 5, xx = x + sway * (k / 5) * (k % 2 ? 1 : -1); g.beginPath(); g.ellipse(xx + (k % 2 ? 7 : -7), yy, 7, 3.5, k % 2 ? .6 : -.6, 0, 7); g.fill(); } }
  g.restore();
}
function fireflies(g, now, n = 26, seed = 5) { if (reduced()) return; g.save(); for (let i = 0; i < n; i++) { const a = (Math.sin(i * 91.7 + seed) * 43758.5453) % 1, b = (Math.sin(i * 47.3 + seed) * 12345.678) % 1, t = now / 4000 + i, x = 40 + Math.abs(a) * 1320 + Math.sin(t * 1.3 + i) * 22, y = 120 + Math.abs(b) * 700 + Math.cos(t * 1.1) * 18, k = .35 + .65 * Math.max(0, Math.sin(now / 520 + i * 2.1)); g.globalAlpha = k * .8; g.shadowColor = '#d8ff7a'; g.shadowBlur = 12; g.fillStyle = '#e9ffa0'; g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); } g.restore(); }
function stoneBlocks(g, x, y, w, h, seed = 1) { const r = seedRng(seed); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = lin(g, x, y, x, y + h, ['#2f4036', '#1a261f']); g.fillRect(x, y, w, h); g.strokeStyle = '#0c1511'; g.lineWidth = 2; for (let yy = y; yy < y + h; yy += 52) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); for (let xx = x + ((yy / 52) % 2 ? 40 : 0); xx < x + w; xx += 118 + r() * 30) { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + 52); g.stroke(); } } g.fillStyle = '#4f8a52'; g.globalAlpha = .4; for (let i = 0; i < w * h / 4200; i++) { g.beginPath(); g.arc(x + r() * w, y + r() * h, 2 + r() * 6, 0, 7); g.fill(); } g.restore(); }
(function drawBase() { const g = baseLayer.getContext('2d');
  g.fillStyle = lin(g, 0, 0, 0, 960, ['#07140d', '#030a06', '#0a1a10']); g.fillRect(0, 0, 1400, 960);
  stoneBlocks(g, 0, 0, 1400, 960, 4); g.fillStyle = '#000b'; g.fillRect(0, 0, 1400, 960);
  // the temple doorway arch the reels sit in
  g.save(); g.fillStyle = '#02070400'; g.beginPath(); g.moveTo(RX - 30, RY + RH + 36); g.lineTo(RX - 30, RY + 40); g.bezierCurveTo(RX - 30, 120, 460, 96, 700, 96); g.bezierCurveTo(940, 96, RX + RW + 30, 120, RX + RW + 30, RY + 40); g.lineTo(RX + RW + 30, RY + RH + 36); g.closePath(); g.fillStyle = '#030a06'; g.fill(); g.shadowColor = GOLD; g.shadowBlur = 24; g.strokeStyle = GOLD; g.lineWidth = 5; g.stroke(); g.shadowBlur = 0; g.strokeStyle = '#ffe9a655'; g.lineWidth = 2; g.stroke(); g.restore();
  g.fillStyle = '#ffd34d'; for (const x of [RX - 14, RX + RW + 14]) for (const y of [RY + 30, RY + 150, RY + 270, RY + 390, RY + 510]) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  round(g, RX - 9, RY - 9, RW + 18, RH + 18, 14, '#020604', GOLD, 3);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0a1a10', '#13291b', '#0a1a10']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff16'; g.fillRect(45, 880, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function neon(g, s, x, y, size, color, glow = color, weight = '900', align = 'center') { g.save(); g.shadowColor = glow; g.shadowBlur = size * .45; text(g, s, x, y, size, color, 'Arial', align, weight); g.restore(); }
// A carved-and-gilded headline: dark stone shadow under bright gold lettering (replaces a neon glitch).
function glitchText(g, s, x, y, size, now, color = '#fff', amt = 1) { const o = size / 22; g.save(); text(g, s, x + o, y + o * 1.4, size, '#0b0803', 'Arial', 'center', '900'); g.restore(); g.save(); g.shadowColor = '#ffb42e'; g.shadowBlur = size * .3; text(g, s, x, y, size, color === '#fff' ? '#fff3c4' : color, 'Arial', 'center', '900'); g.restore(); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 220) : 0;
  g.save(); g.shadowColor = opts.col || GOLD; g.shadowBlur = 14 + pulse * 22; round(g, x, y, w, h, 14, opts.ghost ? '#0f2016' : lin(g, x, y, x, y + h, [opts.col2 || GOLD2, opts.col || GOLD]), opts.col || GOLD, 3); g.restore();
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 28, opts.ghost ? (opts.col || GOLD2) : '#241600', 'Arial', 'center', '900'); hits.push({ id, x, y, w, h, fn }); }
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function highlightIndex(now) { return !spinning && !feature() && !pres && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
// Jungle Drums: torches light along both edges, each reel column sits in a carved frame that throbs with the drum beat.
function drawColumns(jack, now) {
  if (!jack) return;
  const beat = reduced() ? 0 : Math.pow(Math.max(0, Math.sin(now / 190)), 6);
  sg.save(); for (let c = 0; c < 5; c++) { const x = RX + c * CW, pulse = .55 + .45 * Math.sin(now / 400 + c); sg.fillStyle = 'rgba(2,10,5,.62)'; sg.fillRect(x, RY, CW - 3, RH); sg.shadowColor = TORCH; sg.shadowBlur = 16 + beat * 22; sg.strokeStyle = `rgba(255,138,43,${.5 + pulse * .35 + beat * .2})`; sg.lineWidth = 3; sg.strokeRect(x + 1, RY + 1, CW - 5, RH - 2); sg.shadowColor = GOLD; sg.strokeStyle = 'rgba(217,163,0,.5)'; sg.lineWidth = 1.5; sg.strokeRect(x + 7, RY + 7, CW - 17, RH - 14); } sg.restore();
}
function drawReels(now, jack) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = GOLD; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, GOLD2, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, GOLD2, 4); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#ffe9a6c0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#d9a30066'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The Jungle Drums scene: a moonlit canopy, tree silhouettes, torches along both screen edges and a drum-beat ring.
function drawTorch(g, x, y, now, seed) { const fl = reduced() ? 1 : .8 + .2 * Math.sin(now / 70 + seed * 3) + .1 * Math.sin(now / 33 + seed); g.save(); g.fillStyle = '#4a3320'; g.fillRect(x - 5, y, 10, 90); g.fillStyle = '#2b1d12'; g.fillRect(x - 9, y - 4, 18, 12);
  const gr = g.createRadialGradient(x, y - 18, 4, x, y - 18, 78 * fl); gr.addColorStop(0, 'rgba(255,214,120,.9)'); gr.addColorStop(.4, 'rgba(255,138,43,.45)'); gr.addColorStop(1, 'rgba(255,138,43,0)'); g.fillStyle = gr; g.fillRect(x - 90, y - 110, 180, 190);
  g.fillStyle = '#ffb347'; g.beginPath(); g.moveTo(x - 11, y - 2); g.quadraticCurveTo(x - 14 * fl, y - 30, x, y - 52 * fl); g.quadraticCurveTo(x + 14 * fl, y - 30, x + 11, y - 2); g.closePath(); g.fill(); g.fillStyle = '#fff1b0'; g.beginPath(); g.ellipse(x, y - 14, 5, 13 * fl, 0, 0, 7); g.fill(); g.restore(); }
function drawJackBackdrop(now) {
  const g = sg, hz = 196; g.fillStyle = lin(g, 0, 0, 0, 960, ['#020a06', '#0b2415', '#04100a']); g.fillRect(0, 0, 1400, 960);
  g.save(); g.shadowColor = '#e6f7d0'; g.shadowBlur = 50; g.fillStyle = '#eaf6d8'; g.beginPath(); g.arc(1090, 118, 46, 0, 7); g.fill(); g.restore();
  g.fillStyle = '#04120a'; for (let k = 0; k < 12; k++) { const x = k * 125 - 40, h = 160 + (k * 53 % 90); g.beginPath(); g.moveTo(x, 330); g.lineTo(x + 20, 330 - h); g.lineTo(x + 70, 330 - h * .8); g.lineTo(x + 130, 330); g.closePath(); g.fill(); g.beginPath(); g.ellipse(x + 62, 330 - h, 78, 40, 0, 0, 7); g.fill(); }
  vines(g, now, 0, 1400, 150, 16, 11, '#1f4a2a');
  const beat = reduced() ? 0 : Math.pow(Math.max(0, Math.sin(now / 190)), 6); g.save(); g.strokeStyle = `rgba(255,138,43,${.18 + beat * .3})`; g.lineWidth = 3 + beat * 6; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(700, 490, 330 + k * 70 + beat * 28, 0, 7); g.stroke(); } g.restore();
  fireflies(g, now, 18, 9); for (let k = 0; k < 4; k++) { drawTorch(g, 22, 150 + k * 190, now, k); drawTorch(g, 1378, 150 + k * 190, now, k + 5); }
}
