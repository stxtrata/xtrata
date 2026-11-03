
/* ---------- The cabinet screen: a curved CRT look with scanlines and a chromatic edge, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
function rainStreaks(g, w, h, a, step = 26, seed = 7) { g.save(); g.strokeStyle = `rgba(190,170,255,${a})`; g.lineWidth = 1; g.beginPath(); for (let x = -h * .2; x < w; x += step) { const o = (Math.sin(x * 12.9898 + seed) * 43758.5453) % 1; const y0 = Math.abs(o) * h; g.moveTo(x, y0); g.lineTo(x - 7, y0 + 38); } g.stroke(); g.restore(); }
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 1400, 960, ['#10061c', '#06030c', '#12061f']); g.fillRect(0, 0, 1400, 960);
  g.strokeStyle = '#ff3ea50d'; g.lineWidth = 2; for (let y = 8; y < 960; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); }
  rainStreaks(g, 1400, 960, .07, 22);
  round(g, RX - 9, RY - 9, RW + 18, RH + 18, 18, '#03010a', MAG, 3);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0a0516', '#150a26', '#0a0516']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff16'; g.fillRect(45, 880, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function neon(g, s, x, y, size, color, glow = color, weight = '900', align = 'center') { g.save(); g.shadowColor = glow; g.shadowBlur = size * .45; text(g, s, x, y, size, color, 'Arial', align, weight); g.restore(); }
function glitchText(g, s, x, y, size, now, color = '#fff', amt = 1) { const o = (Math.sin(now / 37) > .75 ? 5 : 2) * amt * size / 60; g.save(); g.globalCompositeOperation = 'lighter'; text(g, s, x - o, y, size, '#ff2d95aa', 'Arial', 'center', '900'); text(g, s, x + o, y, size, '#22d3eeaa', 'Arial', 'center', '900'); g.restore(); text(g, s, x, y, size, color, 'Arial', 'center', '900'); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 220) : 0;
  g.save(); g.shadowColor = opts.col || MAG; g.shadowBlur = 14 + pulse * 22; round(g, x, y, w, h, 14, opts.ghost ? '#150a26' : lin(g, x, y, x, y + h, [opts.col2 || MAG2, opts.col || MAG]), opts.col || MAG, 3); g.restore();
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 28, opts.ghost ? (opts.col || MAG2) : '#1f0013', 'Arial', 'center', '900'); hits.push({ id, x, y, w, h, fn }); }
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function highlightIndex(now) { return !spinning && !feature() && !pres && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
function drawColumns(jack, now) {
  if (!jack) return;
  sg.save(); for (let c = 0; c < 5; c++) { const x = RX + c * CW, pulse = .55 + .45 * Math.sin(now / 400 + c); sg.fillStyle = 'rgba(8,2,18,.62)'; sg.fillRect(x, RY, CW - 3, RH); sg.shadowColor = MAG; sg.shadowBlur = 18; sg.strokeStyle = `rgba(255,62,165,${.55 + pulse * .4})`; sg.lineWidth = 3; sg.strokeRect(x + 1, RY + 1, CW - 5, RH - 2); sg.shadowColor = CY; sg.strokeStyle = 'rgba(57,216,255,.5)'; sg.lineWidth = 1.5; sg.strokeRect(x + 7, RY + 7, CW - 17, RH - 14); } sg.restore();
}
function drawReels(now, jack) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = MAG; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, MAG2, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, MAG2, 4); sg.save(); sg.shadowColor = MAG; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#ff9bd2c0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#ff3ea555'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// The wireframe metaverse behind Jacked In: grid floor, magenta horizon, a sun cut with scanlines, drifting wire peaks.
function drawJackBackdrop(now) {
  const g = sg, hz = 196; g.fillStyle = lin(g, 0, 0, 0, 960, ['#080018', '#2a0640', '#0a0118']); g.fillRect(0, 0, 1400, 960);
  g.save(); const sx = 700, sy = hz + 8, sr = 150; g.beginPath(); g.arc(sx, sy, sr, Math.PI, 0); g.closePath(); g.clip(); g.fillStyle = lin(g, 0, sy - sr, 0, sy, ['#ffdd55', MAG, '#7a1fd0']); g.fillRect(sx - sr, sy - sr, sr * 2, sr); g.fillStyle = '#080018'; for (let k = 0; k < 7; k++) g.fillRect(sx - sr, sy - 12 - k * 16 - (now / 90 % 16) * (k ? 0 : 0), sr * 2, 2 + k * 1.4); g.restore();
  g.save(); g.strokeStyle = '#ff3ea5'; g.shadowColor = MAG; g.shadowBlur = 10; g.lineWidth = 2; g.beginPath(); g.moveTo(0, hz); g.lineTo(1400, hz); g.stroke();
  g.strokeStyle = '#39d8ff99'; g.lineWidth = 1.5; g.beginPath(); const pk = [[40, 0], [120, -70], [200, -20], [300, -110], [420, -25], [520, -60], [600, 0]]; pk.forEach(([x, y], i) => i ? g.lineTo(x, hz + y) : g.moveTo(x, hz + y)); pk.forEach(([x, y], i) => i ? g.lineTo(1400 - x, hz + y) : 0); g.stroke(); g.restore();
  g.save(); g.beginPath(); g.rect(0, hz, 1400, 960 - hz); g.clip(); g.strokeStyle = 'rgba(255,62,165,.7)'; g.shadowColor = MAG; g.shadowBlur = 8; g.lineWidth = 1.6;
  for (let x = -2800; x <= 4200; x += 190) { g.beginPath(); g.moveTo(700 + (x - 700) * .04, hz); g.lineTo(x, 960); g.stroke(); }
  const t = (now / 1800) % 1; for (let k = 0; k < 14; k++) { const p = (k + t) / 14, y = hz + (960 - hz) * p * p; g.globalAlpha = .25 + p * .6; g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); } g.restore();
}
