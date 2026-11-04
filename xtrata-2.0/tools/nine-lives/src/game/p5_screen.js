
/* ---------- The cabinet screen: a curved CRT look with scanlines and a chromatic edge, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
function rng32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// A static starfield (seeded, so it never changes between frames) used by the base layer and every scene backdrop.
function starfield(g, w, h, n, seed, a = .8) { const r = rng32(seed); g.save(); for (let i = 0; i < n; i++) { const x = r() * w, y = r() * h, s = r() < .12 ? 2.2 : 1.2; g.globalAlpha = a * (.3 + r() * .7); g.fillStyle = r() < .18 ? '#bfe9ff' : '#ffffff'; g.fillRect(x, y, s, s); } g.restore(); }
// A skyline silhouette made of flat-topped buildings with chimney pots. Returns the window rectangles so scenes can light them.
function skyline(g, y0, seed, opts = {}) { const r = rng32(seed), wins = []; let x = -20; const base = opts.base || '#050a18', col = opts.col || '#0a1530';
  g.save(); while (x < 1420) { const w = 70 + r() * 110, h = 50 + r() * (opts.h || 150), top = y0 - h; g.fillStyle = r() < .5 ? base : col; g.fillRect(x, top, w, h + 400);
    if (r() < .55) { const cx = x + 12 + r() * (w - 40); g.fillRect(cx, top - 26, 14, 26); g.fillRect(cx - 3, top - 30, 20, 6); } // chimney pot
    if (r() < .3) { g.beginPath(); g.moveTo(x + 6, top); g.lineTo(x + 20, top - 24); g.lineTo(x + 34, top); g.fill(); } // gable
    for (let wy = top + 14; wy < y0 - 12; wy += 26) for (let wx = x + 10; wx < x + w - 16; wx += 22) wins.push([wx, wy, 10, 14, r()]);
    x += w - 2 + r() * 8; } g.restore(); return wins; }
function paw(g, x, y, s, rot, col, a = 1) { g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.ellipse(0, 6 * s, 9 * s, 7.5 * s, 0, 0, 7); g.fill(); for (const [dx, dy] of [[-10, -6], [-4, -13], [5, -13], [11, -6]]) { g.beginPath(); g.ellipse(dx * s, dy * s, 3.6 * s, 4.6 * s, dx * .05, 0, 7); g.fill(); } g.restore(); }
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, 960, ['#091233', '#071026', '#050a18']); g.fillRect(0, 0, 1400, 960);
  starfield(g, 1400, 200, 90, 11, .8); starfield(g, 1400, 960, 70, 23, .35);
  g.fillStyle = '#c8f5f01a'; g.beginPath(); g.arc(120, 70, 60, 0, 7); g.fill(); g.fillStyle = '#c8f5f024'; g.beginPath(); g.arc(120, 70, 36, 0, 7); g.fill();
  const w = skyline(g, 960, 5, { h: 60, base: '#040815', col: '#07102a' }); g.fillStyle = '#ffd27a55'; for (const [x, y, ww, hh, v] of w) if (y > 870 && v < .12) g.fillRect(x, y, ww, hh);
  round(g, RX - 9, RY - 9, RW + 18, RH + 18, 18, '#02050d', MAG, 3);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#071022', '#0d1c3c', '#071022']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff16'; g.fillRect(45, 880, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000000bb'); shadeGrad.addColorStop(.15, '#00000000'); shadeGrad.addColorStop(.82, '#00000000'); shadeGrad.addColorStop(1, '#000000bb');
function neon(g, s, x, y, size, color, glow = color, weight = '900', align = 'center') { g.save(); g.shadowColor = glow; g.shadowBlur = size * .45; text(g, s, x, y, size, color, 'Arial', align, weight); g.restore(); }
function glitchText(g, s, x, y, size, now, color = '#fff', amt = 1) { const o = (Math.sin(now / 420) * .5 + 1.2) * amt * size / 70; g.save(); g.globalCompositeOperation = 'lighter'; text(g, s, x - o, y, size, '#12b5a6aa', 'Arial', 'center', '900'); text(g, s, x + o, y, size, '#ffd98aaa', 'Arial', 'center', '900'); g.restore(); text(g, s, x, y, size, color, 'Arial', 'center', '900'); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 220) : 0;
  g.save(); g.shadowColor = opts.col || MAG; g.shadowBlur = 14 + pulse * 22; round(g, x, y, w, h, 14, opts.ghost ? '#0b1225' : lin(g, x, y, x, y + h, [opts.col2 || MAG2, opts.col || MAG]), opts.col || MAG, 3); g.restore();
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 28, opts.ghost ? (opts.col || MAG2) : '#021d1a', 'Arial', 'center', '900'); hits.push({ id, x, y, w, h, fn }); }
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
  sg.save(); for (let c = 0; c < 5; c++) { const x = RX + c * CW, pulse = .55 + .45 * Math.sin(now / 400 + c); sg.fillStyle = 'rgba(3,7,17,.62)'; sg.fillRect(x, RY, CW - 3, RH); sg.shadowColor = MAG; sg.shadowBlur = 18; sg.strokeStyle = `rgba(255,62,165,${.55 + pulse * .4})`; sg.lineWidth = 3; sg.strokeRect(x + 1, RY + 1, CW - 5, RH - 2); sg.shadowColor = CY; sg.strokeStyle = 'rgba(57,216,255,.5)'; sg.lineWidth = 1.5; sg.strokeRect(x + 7, RY + 7, CW - 17, RH - 14); } sg.restore();
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
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, MAG2, 4); sg.save(); sg.shadowColor = MAG; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#a1f9f0c0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#4af3e255'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// Night Prowl: a rooftop skyline under a big moon. Paw prints walk across the screen and the windows light up one by one as the spins go by.
let prowlSky = null;
function drawJackBackdrop(now) {
  const g = sg; if (!prowlSky) { prowlSky = canvas(1400, 960); const q = prowlSky.getContext('2d'); q.fillStyle = lin(q, 0, 0, 0, 960, ['#060d2a', '#0f2350', '#17386a', '#08122c']); q.fillRect(0, 0, 1400, 960); starfield(q, 1400, 700, 160, 41, .9);
    const wins = skyline(q, 980, 77, { h: 330, base: '#040918', col: '#071029' }); prowlSky.wins = wins.filter(w => w[1] > 300); }
  g.drawImage(prowlSky, 0, 0);
  const R = reduced(), pulse = R ? .6 : .55 + .1 * Math.sin(now / 1800);
  g.save(); const mx = 1150, my = 240, mr = 66; const gl = g.createRadialGradient(mx, my, mr * .6, mx, my, mr * 3.2); gl.addColorStop(0, `rgba(255,246,200,${.35 * pulse})`); gl.addColorStop(1, 'rgba(255,246,200,0)'); g.fillStyle = gl; g.fillRect(0, 0, 1400, 700);
  g.beginPath(); g.arc(mx, my, mr, 0, 7); g.fillStyle = lin(g, mx - mr, my - mr, mx + mr, my + mr, ['#fffbe6', '#f6e7b0', '#d9c88a']); g.fill(); g.fillStyle = '#c9b97455'; for (const [x, y, r] of [[-30, -26, 16], [26, 10, 22], [-16, 44, 12], [44, -40, 9]]) { g.beginPath(); g.arc(mx + x, my + y, r, 0, 7); g.fill(); } g.restore();
  // windows: a base set flickers on and off; more light up as the free spins are played
  const lit = Math.min(1, ((pres && pres.spins) || 0) / 10) * .55 + .12;
  g.save(); for (const [x, y, w, h, v] of prowlSky.wins) { const on = v < lit && (R || Math.sin(now / 1300 + v * 90) > -.85); if (!on) continue; g.fillStyle = v < lit * .5 ? '#ffd27a' : '#8fe9ff'; g.globalAlpha = .75; g.fillRect(x, y, w, h); } g.restore();
  // paw prints: a trail that walks left to right along a gentle curve, then fades
  const T = R ? 0 : now / 1000, n = 18; for (let i = 0; i < n; i++) { const u = (T * .12 + i / n) % 1, x = -40 + u * 1480, side = i % 2 ? 1 : -1, y = 760 + Math.sin(u * 9 + 1) * 26 + side * 22, a = Math.sin(u * Math.PI); paw(g, x, y, 1.15, Math.PI / 2 + Math.cos(u * 9 + 1) * .25, '#d9fff9', .55 * a); }
}
