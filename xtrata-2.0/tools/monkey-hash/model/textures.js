// Texture painter for the Monkey Hash cabinet. Runs in Chromium; returns {name: {url, w, h}}.
// GOLD = accent (#d9a300). Everything is painted here from shapes and type, except the Xtrata mark and the ParallaX wordmark, which are the supplied SVGs drawn as given.
// No character, logo or token art is drawn by hand: the cabinet carries only the machine's name, glyph ornaments, stone, moss, vines and light.
const GOLD = '#d9a300', GOLD2 = '#ffd34d', GOLD3 = '#ffe9a6', MOSS = '#6fbf73', TEAL = '#6fe3c8', TORCH = '#ff8a2b';
const FONT = '"Cinzel","Trajan Pro","Palatino Linotype",Georgia,serif', SANS = 'Arial, Helvetica, sans-serif';
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('img ' + src.slice(0, 40))); i.src = src; }); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function url(c, type = 'png') { return type === 'jpg' ? c.toDataURL('image/jpeg', .9) : c.toDataURL('image/png'); }
function spaced(g, s, x, y, size, gap, color, weight = '800', font = FONT) {
  g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1);
  let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); return total;
}
function carved(g, s, x, y, size, gap, weight = '900') { // letters cut into stone and inlaid with gold
  g.save(); spaced(g, s, x + size * .045, y + size * .06, size, gap, '#050d09', weight);
  const gr = g.createLinearGradient(0, y - size / 2, 0, y + size / 2); gr.addColorStop(0, GOLD3); gr.addColorStop(.45, GOLD2); gr.addColorStop(1, '#a87800');
  g.shadowColor = '#ffb42e'; g.shadowBlur = size * .22; spaced(g, s, x, y, size, gap, gr, weight); g.restore();
}
function glow(g, s, x, y, size, gap, color, weight = '800') { g.save(); g.shadowColor = color; for (const b of [26, 10]) { g.shadowBlur = b; spaced(g, s, x, y, size, gap, color, weight); } g.shadowBlur = 0; g.globalAlpha = .6; spaced(g, s, x, y, size * .97, gap, '#fff', weight); g.restore(); }
function shade(hex, a) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a))); return '#' + [f(r), f(gg), f(b)].map(v => v.toString(16).padStart(2, '0')).join(''); }

// ---- tileable carved stone with moss: blocks on a grid that wraps, grain, cracks, moss in the mortar
function paintStone(W, H, seed, cols = 4, rows = 4, moss = 1) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); g.fillStyle = '#26352d'; g.fillRect(0, 0, W, H);
  const bw = W / cols, bh = H / rows;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const off = j % 2 ? bw / 2 : 0, x = i * bw + off, y = j * bh, t = r(), base = t < .33 ? '#2f4036' : t < .66 ? '#364a3e' : '#2a3b31';
    for (const dx of [-W, 0, W]) { const gr = g.createLinearGradient(x + dx, y, x + dx + bw, y + bh); gr.addColorStop(0, shade(base, .08)); gr.addColorStop(1, shade(base, -.14)); g.fillStyle = gr; g.fillRect(x + dx + 3, y + 3, bw - 6, bh - 6);
      g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x + dx + 3, y + 3, bw - 6, 3); g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x + dx + 3, y + bh - 7, bw - 6, 4); }
  }
  for (let n = 0; n < W * H / 520; n++) { const x = r() * W, y = r() * H, a = r() * .09; g.fillStyle = r() < .5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a * 2})`; for (const dx of [-W, 0, W]) for (const dy of [-H, 0, H]) g.fillRect(x + dx, y + dy, 1 + r() * 3, 1 + r() * 2); }
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.4; for (let n = 0; n < cols * rows * .5; n++) { let x = r() * W, y = r() * H; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - .5) * 26; y += r() * 22; g.lineTo(x, y); } g.stroke(); }
  // moss: soft green clumps gathered along the mortar lines and the lower edge of each block
  for (let n = 0; n < 150 * moss; n++) { const j = Math.floor(r() * rows), x = r() * W, y = (j + 1) * bh + (r() - .5) * 14, s = 5 + r() * 18; for (const dx of [-W, 0, W]) { const rg = g.createRadialGradient(x + dx, y, 1, x + dx, y, s); rg.addColorStop(0, `rgba(${70 + r() * 40 | 0},${150 + r() * 50 | 0},${70 + r() * 30 | 0},${.5 + r() * .3})`); rg.addColorStop(1, 'rgba(60,130,60,0)'); g.fillStyle = rg; g.beginPath(); g.ellipse(x + dx, y, s * 1.4, s * .8, 0, 0, 7); g.fill(); } }
  return c;
}
function paintCarvedBand(W, H, seed) { // a frieze of simple geometric glyphs: spirals, steps, rays (ornament only)
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); g.drawImage(paintStone(W, H, seed, 6, 1, .6), 0, 0);
  const n = Math.floor(W / (H * .95)), cell = W / n;
  for (let i = 0; i < n; i++) { const cx = (i + .5) * cell, cy = H / 2, s = H * .32, k = i % 4; g.save(); g.translate(cx, cy); g.lineWidth = H * .05; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#06100a'; g.shadowColor = '#000'; g.shadowBlur = 2;
    const stroke = () => { g.stroke(); g.shadowBlur = 0; g.strokeStyle = 'rgba(217,163,0,.85)'; g.lineWidth = H * .022; g.stroke(); g.strokeStyle = '#06100a'; g.lineWidth = H * .05; g.shadowBlur = 2; };
    if (k === 0) { g.beginPath(); for (let t = 0; t < 14; t += .15) { const rad = s * t / 14, a = t * 1.2; g.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } stroke(); }
    else if (k === 1) { g.beginPath(); g.moveTo(-s, s * .8); g.lineTo(-s, s * .3); g.lineTo(-s * .3, s * .3); g.lineTo(-s * .3, -s * .2); g.lineTo(s * .4, -s * .2); g.lineTo(s * .4, -s * .7); g.lineTo(s, -s * .7); stroke(); }
    else if (k === 2) { g.beginPath(); g.arc(0, 0, s * .45, 0, 7); stroke(); for (let a = 0; a < 8; a++) { g.beginPath(); g.moveTo(Math.cos(a * .785) * s * .6, Math.sin(a * .785) * s * .6); g.lineTo(Math.cos(a * .785) * s, Math.sin(a * .785) * s); stroke(); } }
    else { g.beginPath(); g.moveTo(-s, 0); g.quadraticCurveTo(-s * .5, -s, 0, 0); g.quadraticCurveTo(s * .5, s, s, 0); stroke(); }
    g.restore(); }
  return c;
}
function vineStrand(g, x, y0, len, r, color, leafColor, sway = 1) {
  g.save(); g.strokeStyle = color; g.lineWidth = 3 + r() * 2.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y0); let px = x;
  const pts = []; for (let k = 1; k <= 12; k++) { const y = y0 + len * k / 12, nx = x + Math.sin(k * .7 + r() * 2) * 10 * sway; g.lineTo(nx, y); pts.push([nx, y]); px = nx; } g.stroke();
  g.fillStyle = leafColor; pts.forEach(([lx, ly], i) => { if (i % 2 === 0 || r() < .4) { const s = 7 + r() * 9, side = i % 4 < 2 ? 1 : -1; g.save(); g.translate(lx, ly); g.rotate(side * (.7 + r() * .5)); g.beginPath(); g.ellipse(side * s * .8, 0, s, s * .5, 0, 0, 7); g.fill(); g.restore(); } });
  g.restore();
}
function firefly(g, x, y, s) { const rg = g.createRadialGradient(x, y, 0, x, y, s * 4); rg.addColorStop(0, 'rgba(255,248,170,.95)'); rg.addColorStop(.25, 'rgba(210,255,120,.5)'); rg.addColorStop(1, 'rgba(180,255,90,0)'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, s * 4, 0, 7); g.fill(); }

// ---- side towers. Left: glyph pillar wrapped in vines. Right: lit waterfall (the water itself is the scrolling 'waterfall' layer)
function jungleBackdrop(g, W, H, r, tint) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#04120a'); gr.addColorStop(.6, tint || '#0b2a19'); gr.addColorStop(1, '#03100a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 28; i++) { const x = r() * W, y = r() * H, s = 30 + r() * 80; const rg = g.createRadialGradient(x, y, 2, x, y, s); rg.addColorStop(0, `rgba(${30 + r() * 40 | 0},${90 + r() * 80 | 0},${40 + r() * 40 | 0},.55)`); rg.addColorStop(1, 'rgba(20,70,30,0)'); g.fillStyle = rg; g.beginPath(); g.ellipse(x, y, s * 1.3, s * .7, r() * 3, 0, 7); g.fill(); }
}
function paintTowerL(W, H, seed) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); g.drawImage(paintStone(W, H, seed, 2, 14, 1.3), 0, 0);
  // stacked glyph panels
  const n = 6, ph = H / n; for (let i = 0; i < n; i++) { const y = i * ph + ph * .12; g.save(); g.fillStyle = 'rgba(2,10,6,.55)'; rr(g, W * .12, y, W * .76, ph * .74, 14); g.fill(); g.strokeStyle = 'rgba(217,163,0,.8)'; g.lineWidth = 3; rr(g, W * .12, y, W * .76, ph * .74, 14); g.stroke(); g.translate(W / 2, y + ph * .37); g.lineWidth = 5; g.strokeStyle = GOLD2; g.shadowColor = '#ffb42e'; g.shadowBlur = 8; g.lineCap = 'round';
    const k = i % 3, s = W * .24; g.beginPath(); if (k === 0) { for (let t = 0; t < 14; t += .2) g.lineTo(Math.cos(t * 1.15) * s * t / 14, Math.sin(t * 1.15) * s * t / 14); } else if (k === 1) { g.arc(0, 0, s * .6, 0, 7); g.moveTo(-s, 0); g.lineTo(s, 0); g.moveTo(0, -s); g.lineTo(0, s); } else { g.moveTo(-s, s * .6); g.lineTo(0, -s * .7); g.lineTo(s, s * .6); g.moveTo(-s * .5, s * .6); g.lineTo(0, -s * .1); g.lineTo(s * .5, s * .6); } g.stroke(); g.restore(); }
  for (let i = 0; i < 9; i++) vineStrand(g, r() * W, -10 + r() * H * .5, 220 + r() * 520, r, '#1f5a2c', '#3f9a4c');
  for (let i = 0; i < 14; i++) firefly(g, r() * W, r() * H, 2 + r() * 2);
  return c;
}
function paintTowerR(W, H, seed) { // dark rock, a lit pool at the foot, light spilling from behind the falls
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); g.drawImage(paintStone(W, H, seed, 2, 12, 1.5), 0, 0);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(2,12,8,.7)'); gr.addColorStop(.7, 'rgba(8,60,50,.35)'); gr.addColorStop(1, 'rgba(111,227,200,.45)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const lg = g.createLinearGradient(W * .2, 0, W * .8, 0); lg.addColorStop(0, 'rgba(111,227,200,0)'); lg.addColorStop(.5, 'rgba(111,227,200,.42)'); lg.addColorStop(1, 'rgba(111,227,200,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) vineStrand(g, r() * W, -10, 160 + r() * 300, r, '#1f5a2c', '#3f9a4c', .6);
  for (let i = 0; i < 10; i++) firefly(g, r() * W, r() * H, 2 + r() * 2);
  return c;
}
function paintSide(W, H, seed, waterfall) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); jungleBackdrop(g, W, H, r, waterfall ? '#0b3a34' : '#0b2a19');
  g.drawImage(paintStone(W, H, seed + 1, 3, 12, 1.2), 0, 0, W, H); g.fillStyle = waterfall ? 'rgba(2,24,22,.55)' : 'rgba(2,12,6,.5)'; g.fillRect(0, 0, W, H);
  if (waterfall) { const lg = g.createLinearGradient(0, 0, W, 0); lg.addColorStop(0, 'rgba(111,227,200,0)'); lg.addColorStop(.5, 'rgba(111,227,200,.38)'); lg.addColorStop(1, 'rgba(111,227,200,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); }
  for (let i = 0; i < 8; i++) vineStrand(g, r() * W, -10, 200 + r() * 500, r, '#1f5a2c', '#3f9a4c');
  for (let i = 0; i < 16; i++) firefly(g, r() * W, r() * H, 2 + r() * 2);
  return c;
}
function paintWaterfall(W, H) { // seamless, alpha only: light streaks falling, with foam flecks
  const c = mk(W, H), g = c.getContext('2d'), r = rng(31); g.lineCap = 'round';
  const body = g.createLinearGradient(0, 0, W, 0); body.addColorStop(0, 'rgba(111,227,200,0)'); body.addColorStop(.18, 'rgba(111,227,200,.34)'); body.addColorStop(.82, 'rgba(111,227,200,.34)'); body.addColorStop(1, 'rgba(111,227,200,0)'); g.fillStyle = body; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 130; i++) { const x = W * (.14 + r() * .72), y = r() * H, len = 60 + r() * 260, a = .14 + r() * .5, w = .8 + r() * 2.4; g.strokeStyle = r() < .2 ? `rgba(255,255,255,${a})` : `rgba(180,255,240,${a})`; g.lineWidth = w;
    for (const dy of [-H, 0, H]) { g.beginPath(); g.moveTo(x, y + dy); g.lineTo(x + (r() - .5) * 2, y + dy + len); g.stroke(); } }
  for (let i = 0; i < 50; i++) { const x = W * (.14 + r() * .72), y = r() * H; g.fillStyle = `rgba(255,255,255,${.12 + r() * .3})`; for (const dy of [-H, 0, H]) { g.beginPath(); g.ellipse(x, y + dy, 1.8, 3.6, 0, 0, 7); g.fill(); } }
  return c;
}
function paintVines(W, H, seed) { // hanging vines with leaves and fireflies; alpha everywhere else
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); g.clearRect(0, 0, W, H);
  for (let i = 0; i < 16; i++) vineStrand(g, (i + .3 + r() * .4) * W / 16, -6, H * (.35 + r() * .65), r, i % 3 ? '#1f5a2c' : '#2f7a3a', i % 2 ? '#3f9a4c' : '#5cc065');
  for (let i = 0; i < 18; i++) firefly(g, r() * W, r() * H * .9, 2 + r() * 2);
  return c;
}
// ---- screen surround: a temple doorway. The opening is transparent, so the live game screen shows through.
function paintArch(W, H, seed, ow, oh) { // ow x oh = opening size in texture pixels, centred
  const c = mk(W, H), g = c.getContext('2d'); g.drawImage(paintStone(W, H, seed, 6, 6, 1.1), 0, 0);
  const x0 = (W - ow) / 2, y0 = (H - oh) / 2, rad = ow * .07;
  const path = (inset = 0) => { g.beginPath(); g.moveTo(x0 + inset, y0 + oh - inset); g.lineTo(x0 + inset, y0 + rad + inset); g.quadraticCurveTo(x0 + inset, y0 + inset, x0 + rad + inset, y0 + inset); g.lineTo(x0 + ow - rad - inset, y0 + inset); g.quadraticCurveTo(x0 + ow - inset, y0 + inset, x0 + ow - inset, y0 + rad + inset); g.lineTo(x0 + ow - inset, y0 + oh - inset); g.closePath(); };
  // gold inlay around the opening, then a glow, then the cut-out
  g.save(); g.shadowColor = '#ffb42e'; g.shadowBlur = 24; g.strokeStyle = GOLD2; g.lineWidth = 9; path(-14); g.stroke(); g.restore();
  g.save(); g.strokeStyle = '#0a1710'; g.lineWidth = 6; path(-30); g.stroke(); g.strokeStyle = 'rgba(217,163,0,.55)'; g.lineWidth = 2.5; path(-38); g.stroke(); g.restore();
  // keystone and corner studs
  g.save(); g.fillStyle = GOLD2; g.shadowColor = '#ffb42e'; g.shadowBlur = 14; g.beginPath(); g.moveTo(W / 2 - 22, y0 - 54); g.lineTo(W / 2 + 22, y0 - 54); g.lineTo(W / 2 + 14, y0 - 18); g.lineTo(W / 2 - 14, y0 - 18); g.closePath(); g.fill(); g.restore();
  for (const [x, y] of [[x0 - 34, y0 + oh * .5], [x0 + ow + 34, y0 + oh * .5], [x0 - 34, y0 + oh + 18], [x0 + ow + 34, y0 + oh + 18]]) { const rg = g.createRadialGradient(x - 3, y - 3, 1, x, y, 11); rg.addColorStop(0, GOLD3); rg.addColorStop(1, '#8a6400'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, 10, 0, 7); g.fill(); }
  g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; path(0); g.fill(); g.restore();
  return c;
}
function paintGlass(W, H) {
  const c = mk(W, H), g = c.getContext('2d'); g.clearRect(0, 0, W, H);
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .45, W / 2, H / 2, Math.max(W, H) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.38)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = .06; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(W * .08, 0); g.lineTo(W * .30, 0); g.lineTo(W * .10, H); g.lineTo(0, H); g.closePath(); g.fill(); g.restore(); return c;
}
function paintScreenFallback(W, H) {
  const c = mk(W, H), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#0e2a19'); gr.addColorStop(1, '#04120a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  carved(g, 'MONKEY HASH', W / 2, H * .44, H * .13, 6); glow(g, 'SWING', W / 2, H * .62, H * .06, 8, TORCH, '700'); return c;
}
async function paintHeader(W, H, wordmarkImg) {
  const c = mk(W, H), g = c.getContext('2d'); g.drawImage(paintStone(W, H, 71, 12, 2, .9), 0, 0);
  g.save(); g.shadowColor = '#ffb42e'; g.shadowBlur = 20; g.strokeStyle = GOLD2; g.lineWidth = 7; rr(g, 16, 14, W - 32, H - 28, 22); g.stroke(); g.restore();
  g.strokeStyle = 'rgba(217,163,0,.6)'; g.lineWidth = 3; rr(g, 34, 30, W - 68, H - 60, 14); g.stroke();
  carved(g, 'MONKEY HASH', W / 2, H * .44, H * .48, H * .05, '900');
  g.save(); g.globalAlpha = .95; spaced(g, 'BITCOIN MONKEYS  ·  FOREVER ON STACKS', W / 2, H * .83, H * .07, H * .03, GOLD3, '700'); g.restore();
  const wh = H * .22, ww = wh * (665.5 / 202.1); g.drawImage(wordmarkImg, W - 64 - ww, H - 40 - wh, ww, wh);
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { g.save(); g.shadowColor = '#ffb42e'; g.shadowBlur = 10; g.strokeStyle = i % 2 ? GOLD : GOLD2; g.lineWidth = 9; g.lineCap = 'round'; g.lineJoin = 'round'; const x = W / 2 + sx * (W * .30 + i * 34); g.beginPath(); g.moveTo(x - sx * 14, H * .30); g.lineTo(x + sx * 14, H * .5); g.lineTo(x - sx * 14, H * .70); g.stroke(); g.restore(); }
  return c;
}
async function paintDoor(W, H, xtrataImg) { // the lower door: a stone tablet
  const c = mk(W, H), g = c.getContext('2d'); g.drawImage(paintStone(W, H, 91, 5, 4, 1.2), 0, 0);
  g.fillStyle = 'rgba(2,10,6,.5)'; rr(g, 26, 26, W - 52, H - 52, 16); g.fill();
  g.save(); g.shadowColor = '#ffb42e'; g.shadowBlur = 14; g.strokeStyle = GOLD2; g.lineWidth = 5; rr(g, 38, 38, W - 76, H - 76, 12); g.stroke(); g.restore();
  for (const [x, y] of [[62, 62], [W - 62, 62], [62, H - 62], [W - 62, H - 62]]) { const rg = g.createRadialGradient(x - 2, y - 2, 1, x, y, 10); rg.addColorStop(0, GOLD3); rg.addColorStop(1, '#8a6400'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); }
  const m = 330; g.drawImage(xtrataImg, W / 2 - m / 2, 70, m, m);
  carved(g, 'BITCOIN MONKEYS', W / 2, H * .66, 54, 6, '900'); carved(g, 'FOREVER ON STACKS', W / 2, H * .79, 46, 6, '900');
  spaced(g, 'POWERED BY THE XTRATA PROTOCOL', W / 2, H * .90, 22, 6, '#bfe3c8', '600', SANS);
  return c;
}
function paintSpin(S) { // the swing button: a gold coin with a banana-yellow rim; type only
  const c = mk(S, S), g = c.getContext('2d'); const rg = g.createRadialGradient(S * .4, S * .35, S * .05, S / 2, S / 2, S * .52); rg.addColorStop(0, GOLD3); rg.addColorStop(.55, GOLD2); rg.addColorStop(1, '#a87800'); g.fillStyle = rg; g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 7); g.fill();
  g.strokeStyle = 'rgba(60,35,0,.55)'; g.lineWidth = S * .025; g.beginPath(); g.arc(S / 2, S / 2, S * .44, 0, 7); g.stroke();
  g.fillStyle = '#3a2400'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${S * .27}px ${FONT}`; g.fillText('SWING', S / 2, S * .46); g.font = `700 ${S * .09}px ${SANS}`; g.fillText('SPIN THE REELS', S / 2, S * .68); return c;
}
function paintLabel(W, H, s, sub, bg, ink) {
  const c = mk(W, H), g = c.getContext('2d'); g.drawImage(paintStone(W, H, s.length * 7, 3, 2, .5), 0, 0); g.fillStyle = bg; g.globalAlpha = .88; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
  g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${s.length > 8 ? 46 : 58}px ${FONT}`; g.fillText(s, W / 2, H * .40); g.font = `700 26px ${SANS}`; g.fillText(sub, W / 2, H * .75); return c;
}
function paintSlotLabel(W, H, s, col) { const c = mk(W, H), g = c.getContext('2d'); g.fillStyle = '#050d09'; g.fillRect(0, 0, W, H); glow(g, s, W / 2, H / 2, H * .5, H * .12, col, '800'); return c; }
function paintWheel(S) { // stone wheel face: ring of glyphs, spokes (alpha outside the rim)
  const c = mk(S, S), g = c.getContext('2d'), r = rng(5), R = S / 2; g.save(); g.beginPath(); g.arc(R, R, R - 2, 0, 7); g.clip(); g.drawImage(paintStone(S, S, 17, 5, 5, 1.2), 0, 0);
  g.fillStyle = 'rgba(2,10,6,.35)'; g.beginPath(); g.arc(R, R, R * .8, 0, 7); g.fill(); g.restore();
  g.strokeStyle = GOLD2; g.shadowColor = '#ffb42e'; g.shadowBlur = 8; g.lineWidth = 7; g.beginPath(); g.arc(R, R, R * .93, 0, 7); g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(R, R, R * .62, 0, 7); g.stroke();
  g.lineWidth = 4; for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; g.save(); g.translate(R + Math.cos(a) * R * .78, R + Math.sin(a) * R * .78); g.rotate(a + Math.PI / 2); g.beginPath(); const t = k % 3; if (t === 0) { g.arc(0, 0, R * .05, 0, 7); g.moveTo(0, -R * .12); g.lineTo(0, R * .12); } else if (t === 1) { g.moveTo(-R * .07, R * .08); g.lineTo(0, -R * .1); g.lineTo(R * .07, R * .08); } else { g.moveTo(-R * .07, -R * .07); g.lineTo(R * .07, R * .07); g.moveTo(R * .07, -R * .07); g.lineTo(-R * .07, R * .07); } g.stroke(); g.restore(); }
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + .2; g.beginPath(); g.moveTo(R + Math.cos(a) * R * .3, R + Math.sin(a) * R * .3); g.lineTo(R + Math.cos(a) * R * .62, R + Math.sin(a) * R * .62); g.stroke(); }
  return c;
}
function paintCoin(S) { // the gold coin at the hub: a plain Bitcoin sign cut into gold (a type glyph, not a drawn logo)
  const c = mk(S, S), g = c.getContext('2d'), R = S / 2; const rg = g.createRadialGradient(S * .38, S * .34, S * .04, R, R, R); rg.addColorStop(0, GOLD3); rg.addColorStop(.6, GOLD2); rg.addColorStop(1, '#9a6c00'); g.fillStyle = rg; g.beginPath(); g.arc(R, R, R - 1, 0, 7); g.fill();
  g.strokeStyle = 'rgba(70,40,0,.6)'; g.lineWidth = S * .03; g.beginPath(); g.arc(R, R, R * .8, 0, 7); g.stroke(); g.fillStyle = '#4a2c00'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${S * .56}px ${SANS}`; g.fillText('₿', R, R + S * .02); return c;
}
window.renderAll = async (args) => {
  await document.fonts.load('800 40px Cinzel').catch(() => {});
  const xt = await loadImg('data:image/svg+xml;base64,' + args.xtrata), wm = await loadImg('data:image/svg+xml;base64,' + args.parallax); const out = {};
  const add = (n, c, type = 'png') => { out[n] = { url: url(c, type), w: c.width, h: c.height }; };
  add('stone', paintStone(512, 512, 3, 4, 4, 1), 'jpg'); add('stoneDark', paintStone(512, 512, 8, 4, 4, .6), 'jpg'); add('plinth', paintStone(512, 128, 13, 8, 1, .8), 'jpg');
  add('towerL', paintTowerL(296, 2240, 21), 'jpg'); add('towerR', paintTowerR(296, 2240, 22), 'jpg'); add('sideL', paintSide(512, 1792, 23, false), 'jpg'); add('sideR', paintSide(512, 1792, 24, true), 'jpg');
  add('waterfall', paintWaterfall(256, 1024)); add('vines', paintVines(1360, 400, 41)); add('vinesTall', paintVines(256, 1024, 42));
  add('arch', paintArch(1280, 960, 5, 1040, 716)); add('glass', paintGlass(512, 352)); add('screen', paintScreenFallback(700, 480), 'jpg');
  add('header', await paintHeader(1700, 250, wm), 'jpg'); add('door', await paintDoor(1032, 624, xt), 'jpg'); add('band', paintCarvedBand(1024, 96, 9), 'jpg');
  add('spin', paintSpin(256), 'jpg');
  add('lblPays', paintLabel(400, 160, 'MAP', 'PAYS', '#c9b27a', '#1b1306'), 'jpg'); add('lblDown', paintLabel(400, 160, '−BANANAS', 'LOWER BET', '#c9b27a', '#1b1306'), 'jpg');
  add('lblUp', paintLabel(400, 160, '+BANANAS', 'RAISE BET', '#c9b27a', '#1b1306'), 'jpg'); add('lblAuto', paintLabel(400, 160, 'AUTO-SWING', 'AUTO-SPIN', '#8fd49a', '#06210f'), 'jpg');
  add('ticket', paintSlotLabel(256, 64, 'TICKET', GOLD2), 'jpg'); add('coin', paintSlotLabel(256, 64, 'LAYR IN', TEAL), 'jpg');
  add('wheel', paintWheel(512)); add('hub', paintCoin(256));
  return out;
};
