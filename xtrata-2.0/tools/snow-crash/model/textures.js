// Texture painter for the Snow Crash cabinet. Runs in Chromium; returns {name: {url, w, h}}.
// PINK = accent, CYAN = secondary. All art is drawn here or supplied (Xtrata mark, ParallaX wordmark, logo).
const PINK = '#ff3ea5', CYAN = '#29e6ff', VIOLET = '#1a0b2e';
const FONT = 'Poppins, "Inter", Arial, sans-serif';
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('img ' + src.slice(0, 40))); i.src = src; }); }
function spaced(g, s, x, y, size, gap, color, weight = '800') {
  g.font = `${weight} ${size}px ${FONT}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1);
  let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); return total;
}
function neonText(g, s, x, y, size, gap, color, glow, weight = '800') {
  g.save(); g.shadowColor = glow; for (const b of [40, 18, 8]) { g.shadowBlur = b; spaced(g, s, x, y, size, gap, color, weight); }
  g.shadowBlur = 0; spaced(g, s, x, y, size, gap, '#ffffff', weight); // hot white core
  g.globalCompositeOperation = 'source-atop'; g.restore();
}
function neonTube(g, s, x, y, size, gap, color, weight = '800') { // coloured tube with glow and a paler core
  g.save(); g.shadowColor = color; g.shadowBlur = 26; spaced(g, s, x, y, size, gap, color, weight); g.shadowBlur = 10; spaced(g, s, x, y, size, gap, color, weight);
  g.shadowBlur = 0; g.globalAlpha = .55; spaced(g, s, x, y, size * .97, gap, '#ffffff', weight); g.restore();
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function url(c, type = 'png') { return type === 'jpg' ? c.toDataURL('image/jpeg', .9) : c.toDataURL('image/png'); }

// ---- city backdrop with neon signs for the glass panels (portrait = tower fronts, wide = tower sides)
function cityBackdrop(g, W, H, r) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a0418'); gr.addColorStop(.55, '#1c0a33'); gr.addColorStop(1, '#2b0d3d'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // far skyline glow
  const hz = g.createRadialGradient(W / 2, H * .72, 10, W / 2, H * .72, W * .9); hz.addColorStop(0, 'rgba(255,62,165,.28)'); hz.addColorStop(1, 'rgba(255,62,165,0)'); g.fillStyle = hz; g.fillRect(0, 0, W, H);
  // building slabs with lit windows
  let y = 0; while (y < H) { const bh = 160 + r() * 300, bw = W * (.55 + r() * .45), bx = r() < .5 ? 0 : W - bw; g.fillStyle = `rgba(${10 + r() * 14 | 0},${4 + r() * 8 | 0},${26 + r() * 20 | 0},.9)`; g.fillRect(bx, y, bw, bh);
    for (let wy = y + 14; wy < y + bh - 10; wy += 22) for (let wx = bx + 8; wx < bx + bw - 8; wx += 20) if (r() < .22) { g.fillStyle = r() < .5 ? 'rgba(41,230,255,.55)' : 'rgba(255,62,165,.5)'; g.fillRect(wx, wy, 7, 10); }
    y += bh + 10 + r() * 20; }
}
function signBox(g, x, y, w, h, color) { g.save(); g.shadowColor = color; g.shadowBlur = 22; g.lineWidth = 6; g.strokeStyle = color; rr(g, x, y, w, h, 14); g.stroke(); g.shadowBlur = 8; g.lineWidth = 2.5; g.strokeStyle = '#fff'; g.globalAlpha = .6; rr(g, x, y, w, h, 14); g.stroke(); g.restore(); }
function pizzaSlice(g, cx, cy, s, color) { g.save(); g.translate(cx, cy); g.lineJoin = 'round'; g.shadowColor = color; g.shadowBlur = 20; g.strokeStyle = color; g.lineWidth = 7;
  g.beginPath(); g.moveTo(-s * .55, -s * .5); g.quadraticCurveTo(0, -s * .72, s * .55, -s * .5); g.lineTo(0, s * .7); g.closePath(); g.stroke();
  g.lineWidth = 5; for (const [x, y] of [[-.18, -.25], [.2, -.2], [0, .15]]) { g.beginPath(); g.arc(x * s, y * s, s * .09, 0, 7); g.stroke(); } g.restore(); }
function paintTowerSign(W, H, seed) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); cityBackdrop(g, W, H, r);
  const cx = W / 2, u = W / 296; // unit scale for tall panel
  // JACK IN
  signBox(g, 22 * u, 120 * u, 252 * u, 330 * u, PINK);
  g.save(); g.translate(cx, 285 * u); g.rotate(-Math.PI / 2); neonTube(g, 'JACK IN', 0, 0, 74 * u, 8 * u, PINK); g.restore();
  g.save(); g.shadowColor = CYAN; g.shadowBlur = 18; g.strokeStyle = CYAN; g.lineWidth = 8 * u; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx - 40 * u, 520 * u); g.lineTo(cx, 560 * u); g.lineTo(cx + 40 * u, 520 * u); g.stroke(); g.beginPath(); g.moveTo(cx - 40 * u, 580 * u); g.lineTo(cx, 620 * u); g.lineTo(cx + 40 * u, 580 * u); g.stroke(); g.restore();
  // PIZZA
  pizzaSlice(g, cx, 800 * u, 150 * u, '#ffd23e');
  signBox(g, 24 * u, 930 * u, 248 * u, 140 * u, '#ffd23e');
  neonTube(g, 'PIZZA', cx, 1000 * u, 58 * u, 4 * u, '#ffd23e');
  // OPEN 24H
  signBox(g, 30 * u, 1240 * u, 236 * u, 270 * u, CYAN);
  neonTube(g, 'OPEN', cx, 1330 * u, 66 * u, 4 * u, CYAN); neonTube(g, '24H', cx, 1440 * u, 96 * u, 2 * u, PINK, '900');
  // vertical kanji-like glyph bars
  g.save(); g.shadowColor = PINK; g.shadowBlur = 16; g.fillStyle = PINK; for (let i = 0; i < 5; i++) g.fillRect(cx - 55 * u + i * 26 * u, 1580 * u, 9 * u, (80 + (i % 3) * 40) * u); g.restore();
  neonTube(g, 'NO VACANCY', cx, 1900 * u, 30 * u, 4 * u, '#8aa0ff', '700');
  // puddle reflection at the bottom
  const rf = g.createLinearGradient(0, H * .93, 0, H); rf.addColorStop(0, 'rgba(255,62,165,0)'); rf.addColorStop(1, 'rgba(255,62,165,.35)'); g.fillStyle = rf; g.fillRect(0, H * .93, W, H * .07);
  return c;
}
function paintSideSign(W, H, seed) {
  const c = mk(W, H), g = c.getContext('2d'), r = rng(seed); cityBackdrop(g, W, H, r); const u = W / 512, cx = W / 2;
  signBox(g, 40 * u, 160 * u, 432 * u, 190 * u, PINK); neonTube(g, 'JACK IN', cx, 255 * u, 88 * u, 6 * u, PINK);
  pizzaSlice(g, 105 * u, 560 * u, 140 * u, '#ffd23e'); neonTube(g, 'PIZZA', 325 * u, 560 * u, 80 * u, 3 * u, '#ffd23e');
  signBox(g, 40 * u, 900 * u, 432 * u, 240 * u, CYAN); neonTube(g, 'OPEN', cx, 985 * u, 100 * u, 6 * u, CYAN); neonTube(g, '24H', cx, 1080 * u, 100 * u, 6 * u, PINK, '900');
  neonTube(g, 'RAMEN', cx, 1380 * u, 90 * u, 6 * u, '#ff7a3e'); neonTube(g, 'CRASH PUNKS', cx, 1640 * u, 58 * u, 4 * u, '#8aa0ff', '700');
  return c;
}
function paintRain(W, H) { // seamless vertical streaks, alpha only
  const c = mk(W, H), g = c.getContext('2d'), r = rng(77); g.lineCap = 'round';
  for (let i = 0; i < 90; i++) { const x = r() * W, y = r() * H, len = 40 + r() * 170, a = .12 + r() * .42, w = .8 + r() * 1.8, slant = len * .08, tint = r(); g.strokeStyle = tint < .12 ? `rgba(41,230,255,${a})` : tint < .2 ? `rgba(255,120,200,${a})` : `rgba(220,236,255,${a})`; g.lineWidth = w;
    for (const dy of [-H, 0, H]) for (const dx of [-W, 0, W]) { g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx - slant, y + dy + len); g.stroke(); } }
  for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H; g.fillStyle = `rgba(220,236,255,${.1 + r() * .25})`; for (const dy of [-H, 0, H]) { g.beginPath(); g.ellipse(x, y + dy, 1.6, 3.2, 0, 0, 7); g.fill(); } }
  return c;
}
function paintScreenFallback(W, H) {
  const c = mk(W, H), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#12061f'); gr.addColorStop(1, '#05020a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,62,165,.10)'; g.lineWidth = 1; for (let y = 3; y < H; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  neonTube(g, 'SNOW CRASH', W / 2, H * .42, H * .14, 6, PINK); neonTube(g, 'JACK IN', W / 2, H * .62, H * .06, 6, CYAN, '700'); return c;
}
function paintGlass(W, H) {
  const c = mk(W, H), g = c.getContext('2d'); g.clearRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,.10)'; for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
  let gr = g.createLinearGradient(0, 0, W * .10, 0); gr.addColorStop(0, 'rgba(255,62,165,.55)'); gr.addColorStop(1, 'rgba(255,62,165,0)'); g.fillStyle = gr; g.fillRect(0, 0, W * .10, H);
  gr = g.createLinearGradient(W, 0, W * .90, 0); gr.addColorStop(0, 'rgba(41,230,255,.55)'); gr.addColorStop(1, 'rgba(41,230,255,0)'); g.fillStyle = gr; g.fillRect(W * .90, 0, W * .10, H);
  gr = g.createLinearGradient(0, 0, 0, H * .09); gr.addColorStop(0, 'rgba(120,200,255,.35)'); gr.addColorStop(1, 'rgba(120,200,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H * .09);
  gr = g.createLinearGradient(0, H, 0, H * .92); gr.addColorStop(0, 'rgba(255,62,165,.35)'); gr.addColorStop(1, 'rgba(255,62,165,0)'); g.fillStyle = gr; g.fillRect(0, H * .92, W, H * .08);
  // corner vignette
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .45, W / 2, H / 2, Math.max(W, H) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  // soft diagonal reflection
  g.save(); g.globalAlpha = .07; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(W * .08, 0); g.lineTo(W * .30, 0); g.lineTo(W * .10, H); g.lineTo(0, H); g.closePath(); g.fill(); g.restore();
  return c;
}
async function paintHeader(W, H, wordmarkImg) {
  const c = mk(W, H), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0b0414'); gr.addColorStop(1, '#190a2a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(41,230,255,.12)'; g.lineWidth = 2; for (let y = 8; y < H; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  // framing neon tubes
  g.save(); g.shadowColor = PINK; g.shadowBlur = 20; g.strokeStyle = PINK; g.lineWidth = 7; rr(g, 16, 14, W - 32, H - 28, 22); g.stroke(); g.restore();
  g.save(); g.shadowColor = CYAN; g.shadowBlur = 14; g.strokeStyle = CYAN; g.lineWidth = 3; rr(g, 34, 30, W - 68, H - 60, 14); g.stroke(); g.restore();
  // machine name (the biggest thing on the sign)
  neonTube(g, 'SNOW CRASH', W / 2, H * .44, H * .50, H * .045, PINK, '900');
  g.save(); g.globalAlpha = .9; g.shadowColor = CYAN; g.shadowBlur = 12; spaced(g, 'A CRASH PUNKS CABINET  ·  FOREVER ON STACKS', W / 2, H * .83, H * .075, H * .03, CYAN, '600'); g.restore();
  // small ParallaX wordmark: top-right corner, far smaller than the name
  const wh = H * .22, ww = wh * (665.5 / 202.1); g.drawImage(wordmarkImg, W - 64 - ww, H - 40 - wh, ww, wh);
  // side chevrons
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { g.save(); g.shadowColor = i % 2 ? CYAN : PINK; g.shadowBlur = 12; g.strokeStyle = i % 2 ? CYAN : PINK; g.lineWidth = 9; g.lineCap = 'round'; g.lineJoin = 'round'; const x = W / 2 + sx * (W * .30 + i * 34); g.beginPath(); g.moveTo(x - sx * 14, H * .30); g.lineTo(x + sx * 14, H * .5); g.lineTo(x - sx * 14, H * .70); g.stroke(); g.restore(); }
  return c;
}
async function paintDoor(W, H, xtrataImg) {
  const c = mk(W, H), g = c.getContext('2d');
  // dark polished chrome plate with a bright bevel
  let gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#d6d0ea'); gr.addColorStop(.25, '#6e6788'); gr.addColorStop(.5, '#c9c2e0'); gr.addColorStop(.75, '#4b4466'); gr.addColorStop(1, '#a29bbd'); g.fillStyle = gr; rr(g, 0, 0, W, H, 26); g.fill();
  const ix = 26, iy = 26; gr = g.createLinearGradient(0, iy, 0, H - iy); gr.addColorStop(0, '#1d1230'); gr.addColorStop(.5, '#0d0717'); gr.addColorStop(1, '#171027'); g.fillStyle = gr; rr(g, ix, iy, W - ix * 2, H - iy * 2, 14); g.fill();
  const r = rng(5); g.globalAlpha = .06; g.strokeStyle = '#fff'; g.lineWidth = 1; for (let i = 0; i < 120; i++) { const y = iy + r() * (H - iy * 2); g.beginPath(); g.moveTo(ix + 4, y); g.lineTo(W - ix - 4, y); g.stroke(); } g.globalAlpha = 1;
  g.save(); g.shadowColor = PINK; g.shadowBlur = 14; g.strokeStyle = PINK; g.lineWidth = 3; rr(g, ix + 12, iy + 12, W - (ix + 12) * 2, H - (iy + 12) * 2, 10); g.stroke(); g.restore();
  // rivets
  for (const [x, y] of [[ix + 30, iy + 30], [W - ix - 30, iy + 30], [ix + 30, H - iy - 30], [W - ix - 30, H - iy - 30]]) { const rg = g.createRadialGradient(x - 2, y - 2, 1, x, y, 9); rg.addColorStop(0, '#fff'); rg.addColorStop(1, '#6e6788'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); }
  // Xtrata mark, supplied SVG drawn as given (square 851x851)
  const m = 330; g.drawImage(xtrataImg, W / 2 - m / 2, 70, m, m);
  g.save(); g.shadowColor = PINK; g.shadowBlur = 18; spaced(g, 'CRASH PUNKS  ·  FOREVER ON STACKS', W / 2, H * .70, 40, 5, '#ffd0ea', '800'); g.restore();
  spaced(g, 'POWERED BY THE XTRATA PROTOCOL', W / 2, H * .82, 24, 6, '#9ad9ff', '600');
  return c;
}
function paintSpin(S) {
  const c = mk(S, S), g = c.getContext('2d'); const rg = g.createRadialGradient(S * .4, S * .35, S * .05, S / 2, S / 2, S * .52); rg.addColorStop(0, '#ff9ad2'); rg.addColorStop(.6, PINK); rg.addColorStop(1, '#a1176a'); g.fillStyle = rg; g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 7); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = S * .02; g.beginPath(); g.arc(S / 2, S / 2, S * .44, 0, 7); g.stroke();
  g.fillStyle = '#2a0420'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${S * .24}px ${FONT}`; g.fillText('JACK', S / 2, S * .40); g.fillText('IN', S / 2, S * .63); return c;
}
function paintLabel(W, H, s, bg, ink, size) {
  const c = mk(W, H), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, bg); gr.addColorStop(1, shade(bg, -.25)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `800 ${size}px ${FONT}`; g.fillText(s, W / 2, H / 2 + 3); return c;
}
function shade(hex, a) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a))); return '#' + [f(r), f(gg), f(b)].map(v => v.toString(16).padStart(2, '0')).join(''); }
function paintTicketLabel(W, H) { const c = mk(W, H), g = c.getContext('2d'); g.fillStyle = '#0a0612'; g.fillRect(0, 0, W, H); g.save(); g.shadowColor = PINK; g.shadowBlur = 8; spaced(g, 'TICKET', W / 2, H / 2, H * .55, H * .12, '#ffc2e3', '800'); g.restore(); return c; }
function paintCoinLabel(W, H) { const c = mk(W, H), g = c.getContext('2d'); g.fillStyle = '#0a0612'; g.fillRect(0, 0, W, H); g.save(); g.shadowColor = CYAN; g.shadowBlur = 8; spaced(g, 'LAYR IN', W / 2, H / 2, H * .55, H * .12, '#bff6ff', '800'); g.restore(); return c; }
// Hologram of light bars cut from the Crash Punks logo (or a loud placeholder tile when the logo file is missing)
async function paintCrest(W, H, logoImg) {
  const m = mk(W, H), mg = m.getContext('2d');
  if (logoImg) {
    const s = Math.min((W * .86) / logoImg.width, (H * .78) / logoImg.height), w = logoImg.width * s, h = logoImg.height * s; mg.drawImage(logoImg, (W - w) / 2, (H - h) / 2, w, h);
    // use the logo's alpha if it has any; otherwise its luminance against the corner colour
    const d = mg.getImageData(0, 0, W, H), p = d.data; let transparent = false; for (let i = 3; i < p.length; i += 4 * 97) if (p[i] < 250) { transparent = true; break; }
    if (!transparent) { const bg = [p[0], p[1], p[2]]; for (let i = 0; i < p.length; i += 4) { const dist = Math.abs(p[i] - bg[0]) + Math.abs(p[i + 1] - bg[1]) + Math.abs(p[i + 2] - bg[2]); p[i + 3] = Math.max(0, Math.min(255, (dist - 40) * 2.5)); p[i] = p[i + 1] = p[i + 2] = 255; } mg.putImageData(d, 0, 0); }
  } else {
    mg.fillStyle = '#fff'; rr(mg, W * .08, H * .2, W * .84, H * .6, 40); mg.fill(); mg.globalCompositeOperation = 'destination-out'; mg.font = `900 ${H * .17}px ${FONT}`; mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.fillText('CRASH PUNKS', W / 2, H * .46); mg.font = `700 ${H * .06}px ${FONT}`; mg.fillText('TEMPORARY PLACEHOLDER - LOGO FILE MISSING', W / 2, H * .64); mg.globalCompositeOperation = 'source-over';
  }
  const c = mk(W, H), g = c.getContext('2d'); const bar = 9, gap = 4; g.shadowColor = PINK; g.shadowBlur = 0;
  for (let y = 0, i = 0; y < H; y += bar + gap, i++) { const col = i % 2 ? CYAN : PINK; const t = mk(W, bar), tg = t.getContext('2d'); tg.drawImage(m, 0, -y); tg.globalCompositeOperation = 'source-in'; tg.fillStyle = col; tg.fillRect(0, 0, W, bar); g.drawImage(t, 0, y); }
  // faint outer glow
  const glow = mk(W, H), gg = glow.getContext('2d'); gg.filter = 'blur(14px)'; gg.globalAlpha = .55; gg.drawImage(c, 0, 0); g.globalCompositeOperation = 'destination-over'; g.drawImage(glow, 0, 0);
  return c;
}

window.renderAll = async (args) => {
  await document.fonts.load('800 40px Poppins'); await document.fonts.load('900 40px Poppins'); await document.fonts.load('600 40px Poppins');
  const xt = await loadImg('data:image/svg+xml;base64,' + args.xtrata), wm = await loadImg('data:image/svg+xml;base64,' + args.parallax);
  const logo = args.logo ? await loadImg(args.logo) : null; const out = {};
  const add = (n, c, type = 'png') => { out[n] = { url: url(c, type), w: c.width, h: c.height }; };
  add('towerSign', paintTowerSign(296, 2240, 11), 'jpg'); add('sideSign', paintSideSign(512, 1792, 12), 'jpg');
  add('rain', paintRain(256, 1024)); add('screen', paintScreenFallback(700, 480), 'jpg'); add('glass', paintGlass(512, 352));
  add('header', await paintHeader(1700, 250, wm), 'jpg'); add('door', await paintDoor(1032, 624, xt), 'jpg');
  add('spin', paintSpin(256), 'jpg');
  add('lblPays', paintLabel(400, 160, 'MANUAL', '#cfc8e6', '#0a0612', 64), 'jpg'); add('lblDown', paintLabel(400, 160, '− CRED', '#cfc8e6', '#0a0612', 72), 'jpg');
  add('lblUp', paintLabel(400, 160, '+ CRED', '#cfc8e6', '#0a0612', 72), 'jpg'); add('lblAuto', paintLabel(400, 160, 'AUTOPILOT', '#29e6ff', '#02161c', 54), 'jpg');
  add('ticket', paintTicketLabel(256, 64), 'jpg'); add('coin', paintCoinLabel(256, 64), 'jpg');
  add('crest', await paintCrest(1024, 640, logo));
  return out;
};
