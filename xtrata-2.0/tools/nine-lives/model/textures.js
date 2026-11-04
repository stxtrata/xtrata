// Texture painter for the Nine Lives cabinet (LEO Cats). Runs in Chromium; returns {name: {url, w, h}}.
// TEAL = accent #12b5a6, GOLD = lit-window amber. Everything is drawn here from generic shapes (night rooftops, a crescent moon,
// plain cat silhouettes) or supplied (Xtrata mark and ParallaX wordmark SVGs, drawn exactly as given). No project's characters are drawn.
const TEAL = '#12b5a6', TEAL_HI = '#7ff3ea', GOLD = '#ffc765', MOON = '#fdf3d6', NAVY = '#071126';
const FONT = 'Poppins, "Inter", Arial, sans-serif';
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('img ' + src.slice(0, 40))); i.src = src; }); }
function spaced(g, s, x, y, size, gap, color, weight = '800') {
  g.font = `${weight} ${size}px ${FONT}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1);
  let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); return total;
}
function widthOf(g, s, size, gap, weight) { g.font = `${weight} ${size}px ${FONT}`; return [...s].reduce((a, ch) => a + g.measureText(ch).width, 0) + gap * (s.length - 1); }
function fitSize(g, s, size, gap, weight, maxW) { while (size > 8 && widthOf(g, s, size, gap, weight) > maxW) size -= 1; return size; }
function neonTube(g, s, x, y, size, gap, color, weight = '800') { // coloured tube with glow and a paler core
  g.save(); g.shadowColor = color; g.shadowBlur = 26; spaced(g, s, x, y, size, gap, color, weight); g.shadowBlur = 10; spaced(g, s, x, y, size, gap, color, weight);
  g.shadowBlur = 0; g.globalAlpha = .55; spaced(g, s, x, y, size * .97, gap, '#ffffff', weight); g.restore();
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function url(c, type = 'png') { return type === 'jpg' ? c.toDataURL('image/jpeg', .9) : c.toDataURL('image/png'); }
function shade(hex, a) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a))); return '#' + [f(r), f(gg), f(b)].map(v => v.toString(16).padStart(2, '0')).join(''); }

// ---------- shared night-rooftop pieces ----------
function sky(g, W, H, stops) { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach(([o, c]) => gr.addColorStop(o, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function stars(g, W, yMax, n, r, size = 1) {
  for (let i = 0; i < n; i++) { const x = r() * W, y = r() * yMax, a = .25 + r() * .7, s = (.6 + r() * 1.6) * size; g.fillStyle = `rgba(255,248,225,${a})`; g.beginPath(); g.arc(x, y, s, 0, 7); g.fill();
    if (r() < .08) { g.strokeStyle = `rgba(255,248,225,${a * .7})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x - s * 4, y); g.lineTo(x + s * 4, y); g.moveTo(x, y - s * 4); g.lineTo(x, y + s * 4); g.stroke(); } }
}
function moon(g, cx, cy, R, fill, glow) { // a plain crescent: a disc with a bite taken out
  const t = mk(R * 3, R * 3), tg = t.getContext('2d'); tg.fillStyle = fill; tg.beginPath(); tg.arc(R * 1.5, R * 1.5, R, 0, 7); tg.fill();
  tg.globalCompositeOperation = 'destination-out'; tg.beginPath(); tg.arc(R * 1.5 + R * .46, R * 1.5 - R * .2, R * .86, 0, 7); tg.fill();
  g.save(); if (glow) { g.shadowColor = glow; g.shadowBlur = R * 1.1; } g.drawImage(t, cx - R * 1.5, cy - R * 1.5); g.restore();
}
function catSil(g, x, y, s, col, rim, flip = 1) { // a generic sitting-cat silhouette, base centre at (x,y), seen from behind-side
  g.save(); g.translate(x, y); g.scale(flip * s, s); g.fillStyle = col; g.strokeStyle = rim; g.lineWidth = 2.2 / s; g.lineCap = 'round'; g.lineJoin = 'round';
  if (rim) { g.shadowColor = rim; g.shadowBlur = 10; }
  g.beginPath(); g.ellipse(0, -.4, .31, .4, 0, 0, 7); g.fill(); if (rim) g.stroke();                       // body
  g.beginPath(); g.arc(.04, -.88, .23, 0, 7); g.fill(); if (rim) g.stroke();                              // head
  for (const [ax, ay, bx, by, cx2, cy2] of [[-.17, -1.0, -.14, -1.3, .02, -1.08], [.1, -1.08, .24, -1.31, .25, -1.0]]) { g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.lineTo(cx2, cy2); g.closePath(); g.fill(); if (rim) g.stroke(); }
  g.lineWidth = .1; g.strokeStyle = col; g.beginPath(); g.moveTo(-.26, -.12); g.bezierCurveTo(-.62, -.1, -.66, -.52, -.5, -.74); g.stroke();   // tail
  if (rim) { g.shadowBlur = 0; g.lineWidth = .02; g.strokeStyle = rim; g.beginPath(); g.moveTo(-.26, -.12); g.bezierCurveTo(-.62, -.1, -.66, -.52, -.5, -.74); g.stroke(); }
  g.shadowBlur = 0; g.fillStyle = GOLD; for (const ex of [-.04, .13]) { g.beginPath(); g.ellipse(ex, -.9, .035, .05, 0, 0, 7); g.fill(); }
  g.restore();
}
function pawPrint(g, cx, cy, s, color, lw = 7) { // neon paw: four toes and a pad
  g.save(); g.translate(cx, cy); g.lineJoin = 'round'; g.shadowColor = color; g.shadowBlur = 20; g.strokeStyle = color; g.lineWidth = lw;
  for (const [x, y, rx, ry, a] of [[-.52, -.14, .15, .21, -.35], [-.2, -.52, .15, .22, -.1], [.2, -.52, .15, .22, .1], [.52, -.14, .15, .21, .35]]) { g.beginPath(); g.ellipse(x * s, y * s, rx * s, ry * s, a, 0, 7); g.stroke(); }
  g.beginPath(); g.moveTo(-.46 * s, .5 * s); g.bezierCurveTo(-.5 * s, .12 * s, -.22 * s, -.1 * s, 0, -.1 * s); g.bezierCurveTo(.22 * s, -.1 * s, .5 * s, .12 * s, .46 * s, .5 * s); g.bezierCurveTo(.4 * s, .78 * s, .1 * s, .62 * s, 0, .62 * s); g.bezierCurveTo(-.1 * s, .62 * s, -.4 * s, .78 * s, -.46 * s, .5 * s); g.closePath(); g.stroke(); g.restore();
}
function windowPane(g, x, y, w, h, mode) { // mode: 'lit' | 'dark'
  if (mode === 'lit') { g.save(); g.shadowColor = GOLD; g.shadowBlur = 8; g.fillStyle = GOLD; g.fillRect(x, y, w, h); g.restore(); g.fillStyle = 'rgba(80,40,0,.55)'; g.fillRect(x + w / 2 - .8, y, 1.6, h); g.fillRect(x, y + h * .5 - .8, w, 1.6); }
  else { g.fillStyle = '#0a1630'; g.fillRect(x, y, w, h); g.strokeStyle = 'rgba(18,181,166,.35)'; g.lineWidth = 1.2; g.strokeRect(x + .6, y + .6, w - 1.2, h - 1.2); g.fillStyle = 'rgba(18,181,166,.10)'; g.fillRect(x + 2, y + 2, w * .4, h - 4); }
}
function building(g, b, baseY) { // {x,w,top,roof:'flat'|'gable', chim:[offsets]}
  g.fillStyle = '#050c1f'; g.fillRect(b.x, b.top, b.w, baseY - b.top);
  if (b.roof === 'gable') { g.beginPath(); g.moveTo(b.x - 5, b.top); g.lineTo(b.x + b.w / 2, b.top - Math.min(34, b.w * .38)); g.lineTo(b.x + b.w + 5, b.top); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(95,230,215,.55)'; g.lineWidth = 2; g.beginPath(); if (b.roof === 'gable') { g.moveTo(b.x - 5, b.top); g.lineTo(b.x + b.w / 2, b.top - Math.min(34, b.w * .38)); g.lineTo(b.x + b.w + 5, b.top); } else { g.moveTo(b.x, b.top); g.lineTo(b.x + b.w, b.top); } g.stroke();
  for (const o of b.chim || []) { const cx = b.x + o, cy = b.top - (b.roof === 'gable' ? Math.min(34, b.w * .38) * (1 - Math.abs(o - b.w / 2) / (b.w / 2 + 5)) : 0);
    g.fillStyle = '#050c1f'; g.fillRect(cx - 7, cy - 24, 14, 26); g.fillRect(cx - 10, cy - 32, 20, 9);
    g.strokeStyle = 'rgba(95,230,215,.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - 10, cy - 32); g.lineTo(cx + 10, cy - 32); g.stroke(); }
}

// ---------- tall tower fronts and the wide side faces ----------
function tallSky(W, H, seed, u) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed);
  sky(g, W, H, [[0, '#02061a'], [.45, '#071d44'], [.78, '#0b3a5a'], [1, '#0f6f78']]);
  stars(g, W, H * .8, Math.round(W * H / 2600), r, u); return { c, g, r };
}
function rooftops(g, W, H, r, u, y0) { // a row of rooftops from y0 to the bottom, with a few lit windows
  const hz = g.createRadialGradient(W / 2, H, 10, W / 2, H, W * 1.3); hz.addColorStop(0, 'rgba(18,181,166,.45)'); hz.addColorStop(1, 'rgba(18,181,166,0)'); g.fillStyle = hz; g.fillRect(0, y0 - 200 * u, W, H - y0 + 200 * u);
  let x = -10 * u; const out = [];
  while (x < W) { const w = (60 + r() * 70) * u, top = y0 + (r() * 160) * u; const b = { x, w, top, roof: r() < .45 ? 'gable' : 'flat', chim: r() < .7 ? [w * (.2 + r() * .6)] : [] }; building(g, b, H); out.push(b);
    for (let wy = top + 24 * u; wy < H - 30 * u; wy += 40 * u) for (let wx = x + 12 * u; wx < x + w - 24 * u; wx += 32 * u) windowPane(g, wx, wy, 16 * u, 22 * u, r() < .32 ? 'lit' : 'dark');
    x += w + (2 + r() * 8) * u; }
  return out;
}
function paintTowerSign(W, H, seed) {
  const u = W / 296, { c, g, r } = tallSky(W, H, seed, u), cx = W / 2;
  moon(g, cx - 14 * u, 190 * u, 62 * u, MOON, TEAL);
  g.save(); g.shadowColor = TEAL; g.shadowBlur = 22; g.lineWidth = 6; g.strokeStyle = TEAL; rr(g, 22 * u, 360 * u, 252 * u, 640 * u, 14); g.stroke(); g.shadowBlur = 8; g.lineWidth = 2.5; g.strokeStyle = '#fff'; g.globalAlpha = .6; rr(g, 22 * u, 360 * u, 252 * u, 640 * u, 14); g.stroke(); g.restore();
  g.save(); g.translate(cx, 680 * u); g.rotate(-Math.PI / 2); neonTube(g, 'NINE LIVES', 0, 0, 80 * u, 6 * u, TEAL, '900'); g.restore();
  pawPrint(g, cx, 1130 * u, 120 * u, GOLD, 7 * u);
  g.save(); g.shadowColor = GOLD; g.shadowBlur = 20; g.lineWidth = 6; g.strokeStyle = GOLD; rr(g, 30 * u, 1290 * u, 236 * u, 270 * u, 14); g.stroke(); g.restore();
  neonTube(g, 'OPEN', cx, 1360 * u, 62 * u, 4 * u, GOLD); neonTube(g, 'ALL', cx, 1425 * u, 52 * u, 4 * u, '#ffffff', '700'); neonTube(g, 'NIGHT', cx, 1495 * u, 62 * u, 4 * u, GOLD);
  const roofs = rooftops(g, W, H, r, u, 1700 * u);
  const tallest = roofs.reduce((a, b) => (b.top < a.top ? b : a), roofs[0]); catSil(g, tallest.x + tallest.w * .55, tallest.top - (tallest.roof === 'gable' ? 14 * u : 0), 66 * u, '#030814', TEAL_HI);
  return c;
}
function paintSideSign(W, H, seed) {
  const u = W / 512, { c, g, r } = tallSky(W, H, seed, u), cx = W / 2;
  moon(g, W * .7, 230 * u, 120 * u, MOON, TEAL);
  g.save(); g.shadowColor = TEAL; g.shadowBlur = 22; g.lineWidth = 6; g.strokeStyle = TEAL; rr(g, 40 * u, 520 * u, 432 * u, 220 * u, 14); g.stroke(); g.restore();
  neonTube(g, 'NINE', cx, 590 * u, 90 * u, 8 * u, TEAL, '900'); neonTube(g, 'LIVES', cx, 680 * u, 90 * u, 8 * u, TEAL, '900');
  pawPrint(g, 120 * u, 960 * u, 110 * u, GOLD, 7 * u); neonTube(g, 'OPEN ALL NIGHT', 330 * u, 960 * u, 34 * u, 3 * u, GOLD, '700');
  neonTube(g, 'LEO CATS', cx, 1220 * u, 74 * u, 5 * u, TEAL_HI, '800'); neonTube(g, 'FOREVER ON STACKS', cx, 1300 * u, 31 * u, 3 * u, '#ffffff', '600');
  const roofs = rooftops(g, W, H, r, u, 1440 * u);
  for (let i = 0; i < 3; i++) { const b = roofs[1 + i * Math.floor(roofs.length / 3.2)]; if (b) catSil(g, b.x + b.w * (.3 + .4 * (i % 2)), b.top - (b.roof === 'gable' ? 12 * u : 0), (52 + i * 6) * u, '#030814', TEAL_HI, i % 2 ? -1 : 1); }
  return c;
}
function paintGlass(W, H) {
  const c = mk(W, H), g = c.getContext('2d'); g.clearRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,.08)'; for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
  let gr = g.createLinearGradient(0, 0, W * .10, 0); gr.addColorStop(0, 'rgba(18,181,166,.55)'); gr.addColorStop(1, 'rgba(18,181,166,0)'); g.fillStyle = gr; g.fillRect(0, 0, W * .10, H);
  gr = g.createLinearGradient(W, 0, W * .90, 0); gr.addColorStop(0, 'rgba(255,199,101,.40)'); gr.addColorStop(1, 'rgba(255,199,101,0)'); g.fillStyle = gr; g.fillRect(W * .90, 0, W * .10, H);
  gr = g.createLinearGradient(0, 0, 0, H * .09); gr.addColorStop(0, 'rgba(160,220,255,.32)'); gr.addColorStop(1, 'rgba(160,220,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H * .09);
  gr = g.createLinearGradient(0, H, 0, H * .92); gr.addColorStop(0, 'rgba(18,181,166,.35)'); gr.addColorStop(1, 'rgba(18,181,166,0)'); g.fillStyle = gr; g.fillRect(0, H * .92, W, H * .08);
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .45, W / 2, H / 2, Math.max(W, H) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.42)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = .07; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(W * .08, 0); g.lineTo(W * .30, 0); g.lineTo(W * .10, H); g.lineTo(0, H); g.closePath(); g.fill(); g.restore();
  return c;
}
function paintScreenFallback(W, H) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(31); sky(g, W, H, [[0, '#02061a'], [.6, '#08234a'], [1, '#0f6f78']]); stars(g, W, H * .6, 70, r, .8);
  moon(g, W * .82, H * .2, H * .09, MOON, TEAL);
  g.strokeStyle = 'rgba(18,181,166,.08)'; g.lineWidth = 1; for (let y = 3; y < H; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  neonTube(g, 'NINE LIVES', W / 2, H * .42, H * .13, 6, TEAL, '900'); neonTube(g, 'POUNCE', W / 2, H * .62, H * .06, 6, GOLD, '700'); return c;
}

// ---------- marquee: a rooftop silhouette with chimney pots; the flickering windows are separate meshes win0..winN ----------
async function paintHeader(W, H, wm, L) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(9);
  sky(g, W, H, [[0, '#03091c'], [.55, '#0a2a52'], [1, '#0f6a73']]); stars(g, W, H * .65, 90, r, .9);
  const hz = g.createRadialGradient(W / 2, H, 10, W / 2, H, W * .55); hz.addColorStop(0, 'rgba(18,181,166,.38)'); hz.addColorStop(1, 'rgba(18,181,166,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H);
  g.save(); rr(g, 34, 30, W - 68, H - 60, 14); g.clip();
  for (const b of L.buildings) building(g, b, L.base);
  for (const w of L.windows) windowPane(g, w.x, w.y, w.w, w.h, w.mode === 'lit' ? 'lit' : 'dark');
  g.restore();
  g.save(); g.shadowColor = TEAL; g.shadowBlur = 20; g.strokeStyle = TEAL; g.lineWidth = 7; rr(g, 16, 14, W - 32, H - 28, 22); g.stroke(); g.restore();
  g.save(); g.shadowColor = GOLD; g.shadowBlur = 12; g.strokeStyle = GOLD; g.lineWidth = 3; rr(g, 34, 30, W - 68, H - 60, 14); g.stroke(); g.restore();
  neonTube(g, 'NINE LIVES', W / 2, H * .36, H * .38, H * .04, TEAL, '900');                      // the machine's name is the biggest thing on the sign
  g.save(); g.globalAlpha = .92; g.shadowColor = GOLD; g.shadowBlur = 10; spaced(g, 'A LEO CATS CABINET  ·  FOREVER ON STACKS', W / 2, H * .63, H * .068, H * .022, '#ffe2a8', '600'); g.restore();
  const wh = H * .16, ww = wh * (665.5 / 202.1); g.drawImage(wm, W / 2 - ww / 2, H * .70, ww, wh);   // small ParallaX wordmark, far smaller than the name
  return c;
}
async function paintDoor(W, H, xt) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(5);
  let gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#9fb7cf'); gr.addColorStop(.25, '#44566e'); gr.addColorStop(.5, '#a9bdd2'); gr.addColorStop(.75, '#34455c'); gr.addColorStop(1, '#8aa0b8'); g.fillStyle = gr; rr(g, 0, 0, W, H, 26); g.fill();
  const ix = 26, iy = 26; gr = g.createLinearGradient(0, iy, 0, H - iy); gr.addColorStop(0, '#0e2142'); gr.addColorStop(.5, '#06122a'); gr.addColorStop(1, '#0b1a38'); g.fillStyle = gr; rr(g, ix, iy, W - ix * 2, H - iy * 2, 14); g.fill();
  g.globalAlpha = .06; g.strokeStyle = '#fff'; g.lineWidth = 1; for (let i = 0; i < 120; i++) { const y = iy + r() * (H - iy * 2); g.beginPath(); g.moveTo(ix + 4, y); g.lineTo(W - ix - 4, y); g.stroke(); } g.globalAlpha = 1;
  g.save(); g.shadowColor = TEAL; g.shadowBlur = 14; g.strokeStyle = TEAL; g.lineWidth = 3; rr(g, ix + 12, iy + 12, W - (ix + 12) * 2, H - (iy + 12) * 2, 10); g.stroke(); g.restore();
  for (const [x, y] of [[ix + 30, iy + 30], [W - ix - 30, iy + 30], [ix + 30, H - iy - 30], [W - ix - 30, H - iy - 30]]) { const rg = g.createRadialGradient(x - 2, y - 2, 1, x, y, 9); rg.addColorStop(0, '#fff'); rg.addColorStop(1, '#5c708a'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); }
  const m = 310; g.drawImage(xt, W / 2 - m / 2, 64, m, m);                                              // Xtrata mark: supplied SVG, as given
  const t1 = 'LEO CATS  ·  FOREVER ON STACKS', s1 = fitSize(g, t1, 42, 5, '800', W - 200);
  g.save(); g.shadowColor = TEAL; g.shadowBlur = 18; spaced(g, t1, W / 2, H * .70, s1, 5, '#c6fff6', '800'); g.restore();
  const t2 = 'POWERED BY THE XTRATA PROTOCOL', s2 = fitSize(g, t2, 24, 6, '600', W - 260); spaced(g, t2, W / 2, H * .82, s2, 6, '#ffe2a8', '600');
  for (const x of [96, W - 96]) pawPrint(g, x, H * .86, 22, 'rgba(18,181,166,.8)', 2.5);
  return c;
}
function paintSpin(S) {
  const c = mk(S, S), g = c.getContext('2d'); const rg = g.createRadialGradient(S * .4, S * .35, S * .05, S / 2, S / 2, S * .52); rg.addColorStop(0, '#7ff3ea'); rg.addColorStop(.6, TEAL); rg.addColorStop(1, '#0a6f66'); g.fillStyle = rg; g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 7); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = S * .02; g.beginPath(); g.arc(S / 2, S / 2, S * .44, 0, 7); g.stroke();
  pawPrint(g, S / 2, S * .38, S * .22, '#02302b', S * .02);
  g.fillStyle = '#02302b'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${S * .15}px ${FONT}`; g.fillText('POUNCE', S / 2, S * .72); return c;
}
function paintLabel(W, H, s, bg, ink, size, paw) {
  const c = mk(W, H), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, bg); gr.addColorStop(1, shade(bg, -.25)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle'; size = fitSize(g, s, size, 0, '800', W - (paw ? 170 : 40)); g.font = `800 ${size}px ${FONT}`; g.fillText(s, W / 2 + (paw ? 44 : 0), H / 2 + 3);
  if (paw) pawPrint(g, 82, H / 2 + 2, 38, ink, 6); return c;
}
function paintTicketLabel(W, H) { const c = mk(W, H), g = c.getContext('2d'); g.fillStyle = '#050c1c'; g.fillRect(0, 0, W, H); g.save(); g.shadowColor = TEAL; g.shadowBlur = 8; spaced(g, 'TICKET', W / 2, H / 2, H * .55, H * .12, '#bff9f1', '800'); g.restore(); return c; }
function paintCoinLabel(W, H) { const c = mk(W, H), g = c.getContext('2d'); g.fillStyle = '#050c1c'; g.fillRect(0, 0, W, H); g.save(); g.shadowColor = GOLD; g.shadowBlur = 8; spaced(g, 'LAYR IN', W / 2, H / 2, H * .55, H * .12, '#ffe2a8', '800'); g.restore(); return c; }
function paintWood(S, vertical) { // tileable painted-wood grain for the attic-window frame and sill
  const c = mk(S, S), g = c.getContext('2d'), r = rng(vertical ? 18 : 17); g.fillStyle = '#b9552a'; g.fillRect(0, 0, S, S);
  const gr = g.createLinearGradient(0, 0, 0, S); gr.addColorStop(0, 'rgba(255,210,150,.12)'); gr.addColorStop(.5, 'rgba(0,0,0,.10)'); gr.addColorStop(1, 'rgba(255,210,150,.12)'); g.fillStyle = gr; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 90; i++) { const y0 = r() * S, a = 6 + r() * 14, k = 1 + (r() * 2 | 0), ph = r() * 6.28, dark = r() < .65; g.strokeStyle = dark ? `rgba(30,14,4,${.12 + r() * .25})` : `rgba(255,214,160,${.06 + r() * .12})`; g.lineWidth = .8 + r() * 1.8;
    for (const dy of [-S, 0, S]) { g.beginPath(); for (let x = 0; x <= S; x += 8) { const y = y0 + dy + a * .12 * Math.sin(x / S * 6.2832 * k + ph); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } }
  for (let i = 0; i < 3; i++) { const x = r() * S, y = r() * S; for (const dx of [-S, 0, S]) { g.strokeStyle = 'rgba(25,10,2,.3)'; g.lineWidth = 1.4; for (let k = 1; k < 5; k++) { g.beginPath(); g.ellipse(x + dx, y, 4 + k * 3.2, 2 + k * 1.3, 0, 0, 7); g.stroke(); } } }
  if (!vertical) return c; const v = mk(S, S), vg = v.getContext('2d'); vg.translate(S / 2, S / 2); vg.rotate(Math.PI / 2); vg.drawImage(c, -S / 2, -S / 2); return v;
}
function paintHalo(S) { const c = mk(S, S), g = c.getContext('2d'); const gr = g.createRadialGradient(S / 2, S / 2, S * .06, S / 2, S / 2, S / 2); gr.addColorStop(0, 'rgba(120,255,238,.55)'); gr.addColorStop(.45, 'rgba(18,181,166,.28)'); gr.addColorStop(1, 'rgba(18,181,166,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S); return c; }

window.renderAll = async (args) => {
  await document.fonts.load('800 40px Poppins'); await document.fonts.load('900 40px Poppins'); await document.fonts.load('600 40px Poppins');
  const xt = await loadImg('data:image/svg+xml;base64,' + args.xtrata), wm = await loadImg('data:image/svg+xml;base64,' + args.parallax); const out = {};
  const add = (n, c, type = 'png') => { out[n] = { url: url(c, type), w: c.width, h: c.height }; };
  add('towerSign', paintTowerSign(296, 2240, 21), 'jpg'); add('sideSign', paintSideSign(512, 1792, 22), 'jpg');
  add('screen', paintScreenFallback(700, 480), 'jpg'); add('glass', paintGlass(512, 352));
  add('header', await paintHeader(1700, 250, wm, args.marquee), 'jpg'); add('door', await paintDoor(1032, 624, xt), 'jpg');
  add('spin', paintSpin(256), 'jpg');
  add('lblPays', paintLabel(400, 160, 'PAWS', '#f3e9cf', '#071126', 76, true), 'jpg'); add('lblDown', paintLabel(400, 160, '− TREATS', '#f3e9cf', '#071126', 66), 'jpg');
  add('lblUp', paintLabel(400, 160, '+ TREATS', '#f3e9cf', '#071126', 66), 'jpg'); add('lblAuto', paintLabel(400, 160, 'AUTO-PROWL', '#ffc765', '#2a1700', 56), 'jpg');
  add('ticket', paintTicketLabel(256, 64), 'jpg'); add('coin', paintCoinLabel(256, 64), 'jpg');
  add('wood', paintWood(256, false), 'jpg'); add('woodV', paintWood(256, true), 'jpg'); add('halo', paintHalo(256));
  return out;
};
