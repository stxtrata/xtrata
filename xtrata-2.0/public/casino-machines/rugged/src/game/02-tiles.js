
/* ---------- Canvas helpers ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = 'Arial', align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
const hashStr = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.decoding = 'async'; const timer = setTimeout(() => { img.src = ''; rej(Error('timeout')); }, ms); img.onload = () => { clearTimeout(timer); res(img); }; img.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; img.src = url; }); }
function fitSize(g, s, maxW, size, min = 9, weight = '900', font = 'Arial') { g.font = `${weight} ${size}px ${font}`; while (g.measureText(s).width > maxW && size > min) { size--; g.font = `${weight} ${size}px ${font}`; } return size; }
function drawInfinity(g, cx, cy, w, color, lw = 3.4) { const h = w * .26; g.save(); g.strokeStyle = color; g.lineWidth = lw; g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx, cy); g.bezierCurveTo(cx + w * .1, cy - h * 1.5, cx + w * .5, cy - h * 1.3, cx + w * .5, cy); g.bezierCurveTo(cx + w * .5, cy + h * 1.3, cx + w * .1, cy + h * 1.5, cx, cy); g.bezierCurveTo(cx - w * .1, cy - h * 1.5, cx - w * .5, cy - h * 1.3, cx - w * .5, cy); g.bezierCurveTo(cx - w * .5, cy + h * 1.3, cx - w * .1, cy + h * 1.5, cx, cy); g.stroke(); g.restore(); }
const sample = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
for (const id of ['brandmark', 'loaderMark']) { const el = $(id); if (el) xtrataLogo(el.getContext('2d'), el.width / 2, el.height / 2, el.width * .9); }

/* ---------- The weave: a real NFT image rendered as a knotted rug ----------
   The central 64×64 of each 100×100 twin holds the bird; every source pixel becomes one knot. The picture itself is drawn as is
   (nearest-neighbour, never redrawn); the loom adds a dyed border of knots, a pile texture over each knot, a fringe at the ends
   and a slight cloth wave. Colour and composition are the artist's. */
const CROP = { x: 18, y: 18, s: 64 }, B = 3; // B: border knots on each side
const overlayCache = new Map();
// The pile: each knot is lit at the top and shaded at its base, with a fine seam where the rows meet.
function pileOverlay(cols, rows, k) {
  const key = `${cols}x${rows}@${k}`; if (overlayCache.has(key)) return overlayCache.get(key);
  const W = Math.ceil(cols * k), H = Math.ceil(rows * k), c = canvas(W, H), g = c.getContext('2d'), d = g.createImageData(W, H), p = d.data, amp = Math.min(1, k / 3.2);
  for (let y = 0; y < H; y++) { const v = (y % k) / k; for (let x = 0; x < W; x++) { const u = (x % k) / k, i = (y * W + x) * 4;
    const dark = (.3 * v * v + ((v > .84 || u < .09) ? .16 : 0)) * amp, light = .17 * (1 - v) * (1 - Math.abs(u - .5) * 2) * amp, s = light - dark;
    p[i] = p[i + 1] = p[i + 2] = s > 0 ? 255 : 0; p[i + 3] = Math.min(255, Math.abs(s) * 255); } }
  g.putImageData(d, 0, 0); overlayCache.set(key, c); if (overlayCache.size > 40) overlayCache.delete(overlayCache.keys().next().value); return c;
}
// Desaturate a canvas in place (manual, because ctx.filter is missing in Safari).
function greyCanvas(c) { const g = c.getContext('2d'); try { const d = g.getImageData(0, 0, c.width, c.height), p = d.data; for (let i = 0; i < p.length; i += 4) { const v = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = p[i + 1] = p[i + 2] = v * .78 + 20; } g.putImageData(d, 0, 0); } catch (e) { g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(0, 0, c.width, c.height); g.globalCompositeOperation = 'source-over'; } return c; }
// The rug's body (no fringe): border knots in the tier's dye, the field extended with the picture's own ground colour.
// land: a landscape rug (the field extends left and right), otherwise portrait (it extends top and bottom).
function rugBody(img, k, o = {}) {
  const ext = o.ext ?? 7, land = !!o.land, wide = o.border || 0, fw = CROP.s + (land ? 2 * ext : 0), fh = CROP.s + (land ? 0 : 2 * ext), cols = fw + 2 * B + 2 * wide, rows = fh + 2 * B;
  const c = canvas(cols * k, rows * k), g = c.getContext('2d'), dye = o.dye || ACCENT, dark = o.dark || WOOD;
  g.imageSmoothingEnabled = false;
  if (wide) { // a wide kilim panel each side (the loom's rug): stepped diamonds in the dye, wool, indigo and madder, knot by knot
    const PAL = [dye, WOOL, INDIGO, MADDER, BRASS]; for (let x = 0; x < wide; x++) for (let y = 0; y < rows; y++) { const d = Math.abs(((y + 6) % 14) - 7) + Math.abs((x % 14) - 7), col = PAL[Math.floor(d / 2) % PAL.length]; g.fillStyle = col; g.fillRect(x * k, y * k, k, k); g.fillRect((cols - 1 - x) * k, y * k, k, k); }
    g.translate(wide * k, 0); }
  const cols0 = cols - 2 * wide; { const cols = cols0;
  // Border: an outer dark knot, a dyed band with a wool knot every fourth, an inner wool knot.
  g.fillStyle = dark; g.fillRect(0, 0, cols * k, rows * k);
  g.fillStyle = dye; g.fillRect(k, k, (cols - 2) * k, (rows - 2) * k);
  g.fillStyle = WOOL; for (let x = 1; x < cols - 1; x += 4) { g.fillRect(x * k, k, k, k); g.fillRect(x * k, (rows - 2) * k, k, k); } for (let y = 1; y < rows - 1; y += 4) { g.fillRect(k, y * k, k, k); g.fillRect((cols - 2) * k, y * k, k, k); }
  g.fillRect((B - 1) * k, (B - 1) * k, (fw + 2) * k, (fh + 2) * k);
  const fx = B * k, fy = B * k;
  if (img) {
    // The field's extension is the picture's own ground: its outer row (or column) of pixels, stretched. No colour is invented.
    if (land) { g.drawImage(img, CROP.x, CROP.y, 1, CROP.s, fx, fy, ext * k, CROP.s * k); g.drawImage(img, CROP.x + CROP.s - 1, CROP.y, 1, CROP.s, fx + (ext + CROP.s) * k, fy, ext * k, CROP.s * k); g.drawImage(img, CROP.x, CROP.y, CROP.s, CROP.s, fx + ext * k, fy, CROP.s * k, CROP.s * k); }
    else { g.drawImage(img, CROP.x, CROP.y, CROP.s, 1, fx, fy, CROP.s * k, ext * k); g.drawImage(img, CROP.x, CROP.y + CROP.s - 1, CROP.s, 1, fx, fy + (ext + CROP.s) * k, CROP.s * k, ext * k); g.drawImage(img, CROP.x, CROP.y, CROP.s, CROP.s, fx, fy + ext * k, CROP.s * k, CROP.s * k); }
  } else { g.fillStyle = '#2a2622'; g.fillRect(fx, fy, fw * k, fh * k); }
  } g.setTransform(1, 0, 0, 1, 0, 0);
  if (o.grey) greyCanvas(c);
  g.drawImage(pileOverlay(cols, rows, k), 0, 0);
  return { c, k, cols, rows, w: cols * k, h: rows * k };
}
// Draw a body with its cloth wave (column strips nudged on a sine) and fringe along the two warp ends.
function drawRug(g, body, x, y, o = {}) {
  const { c, k, cols, rows, w, h } = body, amp = o.wave ?? k * .9, ph = o.phase || 0, land = !!o.land, n = land ? rows : cols, fl = o.fringe ?? Math.max(6, k * 5), freq = o.freq || 1.6;
  const off = i => amp * Math.sin(i / n * Math.PI * 2 * freq + ph), shade = i => Math.cos(i / n * Math.PI * 2 * freq + ph);
  g.save(); g.imageSmoothingEnabled = false;
  // A caller's glow or drop shadow is cast once, by one shape under the rug; the strips themselves never carry a blur (a blur per
  // strip would cost ~140 blurs a frame, which starves software canvases).
  if (g.shadowBlur > 0 && g.shadowColor !== 'transparent' && g.shadowColor !== 'rgba(0, 0, 0, 0)') { g.fillStyle = '#1d0f08'; g.fillRect(x + 1, y + 1, w - 2, h - 2); }
  g.shadowBlur = 0; g.shadowOffsetY = 0; g.shadowColor = 'rgba(0,0,0,0)';
  for (let i = 0; i < n; i++) {
    const dy = off(i), sh = shade(i) * (amp > 0 ? .1 : 0);
    if (land) g.drawImage(c, 0, i * k, w, k, x + dy, y + i * k, w, k + .6); else g.drawImage(c, i * k, 0, k, h, x + i * k, y + dy, k + .6, h);
    if (sh) { g.fillStyle = sh > 0 ? `rgba(255,240,210,${sh})` : `rgba(0,0,0,${-sh * 1.4})`; if (land) g.fillRect(x + dy, y + i * k, w, k + .6); else g.fillRect(x + i * k, y + dy, k + .6, h); }
  }
  // Fringe: the warp threads left long at each end, knotted in bundles of four.
  if (fl > 0) { g.strokeStyle = o.fringeColor || WOOL; g.lineWidth = Math.max(1, k * .55); g.lineCap = 'round'; const seed = hashStr(o.seed || 'f');
    for (let i = 1; i < n - 1; i += 2) { const dy = off(i), j = ((seed >> (i % 24)) & 3) - 1.5, len = fl * (.8 + ((seed >> (i % 19)) & 3) * .08);
      g.beginPath(); if (land) { const yy = y + i * k + k / 2; g.moveTo(x + dy, yy); g.lineTo(x + dy - len, yy + j); g.moveTo(x + w + dy, yy); g.lineTo(x + w + dy + len, yy - j); }
      else { const xx = x + i * k + k / 2; g.moveTo(xx, y + dy); g.lineTo(xx + j, y + dy - len); g.moveTo(xx, y + h + dy); g.lineTo(xx - j, y + h + dy + len); } g.stroke(); }
    g.fillStyle = o.fringeColor || WOOL; for (let i = 3; i < n - 2; i += 8) { const dy = off(i), r = Math.max(1.2, k * .7); g.beginPath(); if (land) { g.arc(x + dy - fl * .3, y + i * k, r, 0, 7); g.arc(x + w + dy + fl * .3, y + i * k, r, 0, 7); } else { g.arc(x + i * k, y + dy - fl * .3, r, 0, 7); g.arc(x + i * k, y + h + dy + fl * .3, r, 0, 7); } g.fill(); } }
  g.restore();
}
// The "NOT YET FOREVER" stamp for a Stacks NFT with no permanent twin.
function notYetStamp(g, cx, cy, size = 1) { g.save(); g.translate(cx, cy); g.rotate(-.32); const w = 188 * size, h = 40 * size; g.fillStyle = '#2a0c0ce8'; g.fillRect(-w / 2, -h / 2, w, h); g.lineWidth = 3; g.strokeStyle = '#ff5a5f'; g.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6); text(g, 'NOT YET FOREVER', 0, 1, 20 * size, '#ff7a7e', 'Arial', 'center', '900'); g.restore(); }
// A small brass tag hanging off a rug: what it is and which token.
function brassTag(g, x, y, w, label, sub) { round(g, x, y, w, sub ? 34 : 24, 6, lin(g, x, y, x, y + 34, [BRASS_HI, BRASS, '#9a6a1c']), '#5a3a0c', 2); text(g, label, x + w / 2, y + (sub ? 11 : 12.5), fitSize(g, label, w - 8, 13, 7), '#2a1604', 'Arial', 'center', '900'); if (sub) text(g, sub, x + w / 2, y + 25, fitSize(g, sub, w - 8, 10, 6, '800'), '#4a2e08', 'Arial', 'center', '800'); }

/* ---------- Reel tiles ---------- */
const TILE = 192; // drawn on a 240-unit grid at 192 px, which keeps ~150 tiles within phone canvas-memory limits
// A rescued rug: the bird woven portrait, the border in its tier's dye, a brass tag with tier and token number.
function rugTile(item, sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym], forever = item.forever !== false; g.scale(TILE / 240, TILE / 240);
  const body = rugBody(item.img, 2.2, { dye: forever ? col.color : '#77706a', grey: !forever, ext: 6 });
  g.save(); g.shadowColor = '#000c'; g.shadowBlur = 10; g.shadowOffsetY = 4; g.fillStyle = '#0000'; g.restore();
  const x = 120 - body.w / 2, y = 112 - body.h / 2;
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 12; g.shadowOffsetY = 5; drawRug(g, body, x, y, { wave: 1.6, phase: item.id * .7, seed: item.id, fringe: 12 }); g.restore();
  brassTag(g, 148, 196, 84, `TIER ${col.tier}`, `#${item.id}`);
  if (!forever) notYetStamp(g, 120, 104, .95);
  return c;
}
// Flying Carpet (the jackpot symbol): a twinned bird woven as a landscape rug, lifted and rippling, gold-fringed with a glow beneath.
function carpetTile(item) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), forever = item.forever !== false; g.scale(TILE / 240, TILE / 240);
  const body = rugBody(item.img, 2.3, { dye: forever ? '#b8860b' : '#77706a', dark: '#3a2306', grey: !forever, land: true, ext: 10 });
  g.save(); const gl = g.createRadialGradient(120, 186, 4, 120, 186, 90); gl.addColorStop(0, '#f2c14e66'); gl.addColorStop(1, '#f2c14e00'); g.fillStyle = gl; g.fillRect(0, 120, 240, 120); g.fillStyle = '#0006'; g.beginPath(); g.ellipse(120, 200, 82, 10, 0, 0, 7); g.fill(); g.restore();
  // Seen from a little above: squashed and sheared, then rippled along its length.
  g.save(); g.translate(120, 100); g.transform(1, -.08, -.35, .62, 0, 0); g.shadowColor = GOLD; g.shadowBlur = 18; drawRug(g, body, -body.w / 2, -body.h / 2, { land: true, wave: 6, freq: 1.2, phase: item.id, seed: item.id, fringe: 12, fringeColor: BRASS_HI }); g.restore();
  for (let k = 0; k < 7; k++) { const h = hashStr(`s${item.id}:${k}`), sx = 24 + h % 192, sy = 20 + (h >>> 8) % 150, r = 2 + (h >>> 16) % 4; g.fillStyle = k % 2 ? '#fff6d0' : GOLD; g.beginPath(); g.moveTo(sx, sy - r * 2); g.lineTo(sx + r * .5, sy - r * .5); g.lineTo(sx + r * 2, sy); g.lineTo(sx + r * .5, sy + r * .5); g.lineTo(sx, sy + r * 2); g.lineTo(sx - r * .5, sy + r * .5); g.lineTo(sx - r * 2, sy); g.lineTo(sx - r * .5, sy - r * .5); g.fill(); }
  brassTag(g, 60, 206, 120, 'FLYING CARPET', `BITCOIN BIRD #${item.id}`);
  if (!forever) notYetStamp(g, 120, 96, .95);
  return c;
}
// Rolled rug (the pick trigger): the same weave rolled up and tied, a flap hanging free, fringe at both ends.
function rollTile(item) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), forever = item.forever !== false; g.scale(TILE / 240, TILE / 240);
  const body = rugBody(item.img, 2.4, { dye: forever ? ACCENT : '#77706a', grey: !forever, land: true, ext: 10 });
  drawRoll(g, body, 120, 96, 196, 66, item.id, 26);
  brassTag(g, 70, 190, 100, 'ROLLED RUG', `#${item.id}`);
  if (!forever) notYetStamp(g, 120, 104, .9);
  return c;
}
// A rolled rug at any size: the roll (a band of the weave wrapped as a cylinder), its spiral ends, two ties and a hanging flap.
function drawRoll(g, body, cx, cy, w, h, seed, flap = 0, open = 0) {
  const x = cx - w / 2, y = cy - h / 2;
  g.save(); g.shadowColor = '#000b'; g.shadowBlur = 14; g.shadowOffsetY = 6;
  if (flap > 0) { // the free end hangs below the roll: the first rows of the rug, picture side out
    g.save(); g.beginPath(); g.rect(x + h * .2, cy, w - h * .4, h / 2 + flap); g.clip(); g.imageSmoothingEnabled = false; g.drawImage(body.c, 0, 0, body.w, body.h * .4, x + h * .2, cy, w - h * .4, h / 2 + flap); g.fillStyle = '#0003'; g.fillRect(x, cy, w, h / 2 + flap); g.restore(); }
  g.imageSmoothingEnabled = false; g.drawImage(body.c, 0, body.h * .3, body.w, body.h * .4, x + h * .25, y, w - h * .5, h); g.restore();
  // Cylinder shading.
  const sh = g.createLinearGradient(0, y, 0, y + h); sh.addColorStop(0, '#0009'); sh.addColorStop(.28, '#fff3'); sh.addColorStop(.42, '#fff0'); sh.addColorStop(.8, '#0005'); sh.addColorStop(1, '#000b'); g.fillStyle = sh; g.fillRect(x + h * .25, y, w - h * .5, h);
  // Spiral ends: the rolled layers, each the rug's border dye and wool.
  for (const ex of [x + h * .25, x + w - h * .25]) { g.save(); g.translate(ex, cy); g.fillStyle = '#3a1d10'; g.beginPath(); g.ellipse(0, 0, h * .22, h / 2, 0, 0, 7); g.fill();
    for (let r = 0; r < 5; r++) { g.strokeStyle = r % 2 ? WOOL : ACCENT; g.lineWidth = Math.max(1.5, h * .045); g.beginPath(); g.ellipse(0, 0, h * .2 * (1 - r * .17), h * .46 * (1 - r * .17), 0, 0, 7); g.stroke(); }
    g.strokeStyle = WOOL; g.lineWidth = 1.5; for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(ex < cx ? -h * .2 : h * .2, i * h * .1); g.lineTo(ex < cx ? -h * .2 - 10 : h * .2 + 10, i * h * .1 + (i % 2)); g.stroke(); } g.restore(); }
  // Ties.
  for (const tx of [x + w * .3, x + w * .7]) { g.fillStyle = lin(g, tx - 5, 0, tx + 5, 0, ['#8a5a14', BRASS_HI, '#8a5a14']); g.fillRect(tx - 5, y - 2, 10, h + 4); if (open) { g.fillStyle = BRASS_HI; g.beginPath(); g.arc(tx, y + h + 6, 5, 0, 7); g.fill(); } }
}
// Knot (the hold-and-respin symbol): original, as the treatment says. A Turkish knot tied round two warp threads, in yarn dyed with a
// real bird's colours (named on the tile), never a drawing of the bird.
const paletteCache = new Map();
function birdPalette(item) { if (paletteCache.has(item.id)) return paletteCache.get(item.id); let out = null;
  try { const t = canvas(CROP.s, CROP.s), tg = t.getContext('2d'); tg.drawImage(item.img, CROP.x, CROP.y, CROP.s, CROP.s, 0, 0, CROP.s, CROP.s); const p = tg.getImageData(0, 0, CROP.s, CROP.s).data, bg = `${p[0]},${p[1]},${p[2]}`, n = new Map();
    for (let i = 0; i < p.length; i += 4) { const k = `${p[i]},${p[i + 1]},${p[i + 2]}`; if (k === bg || p[i + 3] < 200) continue; const l = p[i] + p[i + 1] + p[i + 2]; if (l < 60 || l > 720) continue; n.set(k, (n.get(k) || 0) + 1); }
    out = { bg: `rgb(${bg})`, cols: [...n.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => `rgb(${k})`) }; } catch (e) {}
  if (!out || !out.cols.length) out = { bg: '#2a2622', cols: [ACCENT, BRASS, WOOL] }; paletteCache.set(item.id, out); return out; }
function knotTile(item, v = 0) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), pal = birdPalette(item), yarn = pal.cols[0], yarn2 = pal.cols[1] || WOOL; g.scale(TILE / 240, TILE / 240);
  round(g, 22, 10, 196, 202, 18, lin(g, 0, 10, 0, 212, ['#2b170d', '#3a2012', '#1d0f08']), BRASS, 5);
  round(g, 34, 22, 172, 26, 6, pal.bg); text(g, 'KNOT', 120, 36, 17, '#1b0f07', 'Arial', 'center', '900');
  // Two warp threads.
  for (const wx of [92, 148]) { g.strokeStyle = '#6b5a3c'; g.lineWidth = 9; g.beginPath(); g.moveTo(wx, 52); g.lineTo(wx, 196); g.stroke(); g.strokeStyle = WOOL; g.lineWidth = 5; g.stroke(); }
  // The yarn: over the left warp, under, round the right, the two ends drawn up between them as pile.
  const yarnPath = () => { g.beginPath(); g.moveTo(108, 168); g.bezierCurveTo(108, 130, 70, 128, 72, 106); g.bezierCurveTo(74, 82, 108, 84, 120, 100); g.bezierCurveTo(132, 84, 166, 82, 168, 106); g.bezierCurveTo(170, 128, 132, 130, 132, 168); };
  g.lineCap = 'round'; g.lineJoin = 'round'; yarnPath(); g.strokeStyle = '#120a06'; g.lineWidth = 26; g.stroke(); g.strokeStyle = yarn; g.lineWidth = 20; g.stroke(); g.strokeStyle = '#ffffff40'; g.lineWidth = 6; g.save(); g.translate(-3, -4); yarnPath(); g.stroke(); g.restore();
  g.strokeStyle = '#0004'; g.lineWidth = 2; for (let t = 0; t < 14; t++) { const a = t / 14; g.beginPath(); g.arc(120 + Math.cos(a * 7) * 40, 110 + Math.sin(a * 9) * 12, 8, a, a + 1.2); g.stroke(); } // the ply's twist
  // The warp over the yarn on the near side.
  g.strokeStyle = WOOL; g.lineWidth = 5; g.beginPath(); g.moveTo(92, 92); g.lineTo(92, 120); g.moveTo(148, 92); g.lineTo(148, 120); g.stroke();
  // Swatches of the bird's own colours, and whose they are.
  pal.cols.slice(0, 4).forEach((cc, i) => round(g, 46 + i * 20, 176, 16, 16, 3, cc, '#120a06', 1.5));
  text(g, `#${item.id}`, 178, 184, 18, BRASS_HI, 'Arial', 'center', '900');
  text(g, 'BITCOIN BIRDS', 120, 202, 10, '#c9a77a', 'Arial', 'center', '800');
  if (typeof v === 'number' && v) { round(g, 150, 54, 60, 26, 6, '#120a06d0', BRASS, 2); text(g, `${v}×`, 180, 67, 15, BRASS_HI, 'Arial', 'center', '900'); }
  return c;
}
// Forever Twins ∞ (the rescue badge): Xtrata's own mark, drawn with the XLOGO vector code, on a brass medallion with the ∞ sign.
function markTile() {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  g.save(); g.shadowColor = '#6593cf'; g.shadowBlur = 18; g.beginPath(); g.arc(120, 112, 100, 0, 7); g.fillStyle = lin(g, 20, 12, 220, 212, [BRASS_HI, BRASS, '#8a5a14', BRASS_HI]); g.fill(); g.restore();
  g.beginPath(); g.arc(120, 112, 86, 0, 7); g.fillStyle = '#0d1424'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#6593cf'; g.stroke();
  xtrataLogo(g, 120, 96, 104);
  drawInfinity(g, 120, 166, 64, BRASS_HI, 6);
  g.save(); g.translate(120, 212); round(g, -74, -14, 148, 26, 6, ACCENT, WOOL, 2); text(g, 'FOREVER TWINS', 0, 0, 14, WOOL, 'Arial', 'center', '900'); g.restore();
  return c;
}
// WELSH (the wild): the official token logo exactly as supplied, in a woven frame with a WILD ribbon. The logo is never woven or recoloured.
function welshTile(img, forever = true) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  round(g, 14, 8, 212, 212, 16, '#1d0f08', null);
  g.save(); g.beginPath(); g.roundRect(14, 8, 212, 212, 16); g.clip(); for (let r = 0; r < 53; r++) for (let q = 0; q < 53; q++) { const edge = r < 4 || q < 4 || r > 48 || q > 48; if (!edge) continue; g.fillStyle = (r + q) % 4 === 0 ? WOOL : (r < 2 || q < 2 || r > 50 || q > 50) ? WOOD : '#f08c00'; g.fillRect(14 + q * 4, 8 + r * 4, 4, 4); } g.restore();
  if (img) { const s = 168, k = Math.min(s / img.width, s / img.height); g.drawImage(img, 120 - img.width * k / 2, 108 - img.height * k / 2, img.width * k, img.height * k); }
  else { text(g, 'WELSH', 120, 100, 52, '#f08c00', 'Arial', 'center', '900'); text(g, 'WELSHCORGICOIN', 120, 140, 14, WOOL, 'Arial', 'center', '800'); }
  g.save(); g.translate(120, 206); round(g, -48, -14, 96, 28, 7, '#f08c00', WOOL, 3); text(g, 'WILD', 0, 1, 18, '#1d0f08', 'Arial', 'center', '900'); g.restore();
  if (!forever) notYetStamp(g, 120, 104, .9);
  return c;
}
// 404 (the free-spins scatter): a broken gilt frame round a dead web page that shows the real art link the collection's contract returns.
function deadTile(label = '404', sub = 'NOT FOUND') {
  const c = canvas(TILE, TILE), g = c.getContext('2d'); g.scale(TILE / 240, TILE / 240);
  // The page.
  g.fillStyle = '#ece8df'; g.fillRect(30, 26, 180, 168); g.fillStyle = '#d6d0c4'; g.fillRect(30, 26, 180, 18); for (let i = 0; i < 3; i++) { g.fillStyle = ['#c9533f', '#d9a441', '#6a9a5a'][i]; g.beginPath(); g.arc(40 + i * 10, 35, 3.2, 0, 7); g.fill(); }
  round(g, 70, 30, 134, 10, 3, '#fff'); text(g, deadHost(DEAD.uri), 137, 35.5, fitSize(g, deadHost(DEAD.uri), 128, 8, 5, '700', 'Courier New'), '#6b645a', 'Courier New', 'center', '700');
  g.save(); g.shadowColor = '#c9533f'; g.shadowBlur = 0; text(g, label, 120, 100, 70, '#4a4540', 'Georgia, serif', 'center', '900'); g.restore();
  g.fillStyle = '#c9533f88'; g.fillRect(56, 92, 128, 4); g.fillStyle = '#4a90c088'; g.fillRect(64, 104, 112, 3); // the glitch
  text(g, sub, 120, 146, 17, '#6b645a', 'Courier New', 'center', '900');
  text(g, 'ART LINK · BITCOIN BIRDS', 120, 172, 10, '#8a8274', 'Arial', 'center', '800');
  // The frame, cracked across one corner: four gilt bars, the top-right one snapped and dropped.
  const bar = (x, y, w, h) => { g.fillStyle = lin(g, x, y, x + w, y + h, ['#8a5a14', BRASS_HI, BRASS, '#6b440e']); g.fillRect(x, y, w, h); g.strokeStyle = '#3a2306'; g.lineWidth = 2; g.strokeRect(x, y, w, h); };
  bar(16, 182, 208, 20); bar(16, 14, 20, 188); bar(204, 70, 20, 132); bar(16, 14, 120, 20);
  g.save(); g.translate(150, 24); g.rotate(.22); bar(0, -10, 74, 20); g.restore(); g.save(); g.translate(214, 40); g.rotate(-.1); bar(-10, 0, 20, 34); g.restore();
  g.strokeStyle = '#3a2306'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(138, 26); g.lineTo(146, 40); g.lineTo(140, 52); g.lineTo(150, 68); g.stroke(); // the crack in the glass
  return c;
}
// Shown only until art exists: the symbol's name set in type, in its colour. Never a drawing.
function nameTile(sym) {
  const c = canvas(TILE, TILE), g = c.getContext('2d'), col = COLS[sym]; g.scale(TILE / 240, TILE / 240);
  round(g, 12, 6, 216, 216, 14, '#1d0f08', col.color, 4);
  const words = col.name.toUpperCase().replace(',', '').split(' '); words.forEach((w, i) => text(g, w, 120, 110 - (words.length - 1) * 18 + i * 36, w.length > 9 ? 22 : 30, col.color, 'Arial', 'center', '900'));
  text(g, 'LOADING', 120, 196, 13, '#8a7a6a'); return c;
}

/* ---------- Pools: which real items each symbol can show ---------- */
const pools = Object.fromEntries(Object.keys(COLS).map(s => [s, []])), names = Object.fromEntries(Object.keys(COLS).map(s => [s, nameTile(s)]));
const sources = { registry: 'pending', lists: 0, listFailures: 0, images: 0, imageFailures: 0, cached: false, done: false, bundled: 0, welsh: false };
const birds = new Map(); // tokenId -> { id, xtrataId, img, bundled, forever }
let twinMode = 'default'; // the test page's twins switch: default | none | some | all
const foreverFor = (b) => twinMode === 'none' ? false : twinMode === 'all' ? true : twinMode === 'some' ? b.id % 3 === 0 : b.baseForever !== false;
const MAKERS = { cherry: rugTile, lemon: rugTile, chip: rugTile, block: rugTile, bitcoin: carpetTile, vault: rollTile, chain: knotTile };
// A pool item: the tile is drawn the first time it is shown (lazily), so a large pool never stalls start-up.
function birdItem(sym, b) { return { key: COLS[sym].key, id: b.id, xtrataId: b.xtrataId, num: `#${b.id}`, collection: MAIN.key, bird: b, get img() { return b.img; }, get forever() { return foreverFor(b); }, _t: null, get tile() { return this._t || (this._t = MAKERS[sym](this, sym)); } }; }
const inRange = (sym, id) => id >= (COLS[sym].lo ?? 0) && id <= (COLS[sym].hi ?? 1e9);
function buildPools() {
  const all = [...birds.values()];
  for (const sym of ['cherry', 'lemon', 'chip', 'block']) { const list = all.filter(b => inRange(sym, b.id)); pools[sym] = (list.length ? sample(list, 24) : []).map(b => birdItem(sym, b)); }
  const hero = birds.get(0); pools.bitcoin = sample(all.filter(b => b.id !== 0), 17).concat(hero ? [hero] : []).map(b => birdItem('bitcoin', b));
  pools.vault = sample(all, 16).map(b => birdItem('vault', b)); pools.chain = sample(all, 16).map(b => birdItem('chain', b));
  screenDirty = true;
}
function retileAll() { for (const s of Object.keys(pools)) pools[s].forEach(it => { if ('_t' in it) it._t = null; }); rugCache.clear(); revealCache.clear(); screenDirty = true; }
let welshImg = null;
pools.artifact = [{ key: 'forever-twins', id: 'XTRATA', num: 'FOREVER TWINS', tile: markTile() }];
pools.scatter = [{ key: 'dead-link', id: '404', num: deadHost(DEAD.uri), tile: deadTile() }];
pools.wild = [{ key: 'welsh', id: 'WELSH', num: 'WELSH', tile: welshTile(null) }];
const rugCache = new Map(), revealCache = new Map();
// Big rugs for the scenes, cached by bird, size and look.
function bigRug(b, k, o = {}) { const key = `${b.id}:${k}:${o.land ? 1 : 0}:${o.dye || ''}:${foreverFor(b) ? 1 : 0}:${o.ext ?? ''}:${o.border || 0}`; let r = rugCache.get(key); if (!r) { r = rugBody(b.img, k, { ...o, grey: !foreverFor(b) }); rugCache.set(key, r); if (rugCache.size > 60) rugCache.delete(rugCache.keys().next().value); } return r; }
const birdList = () => [...birds.values()];
const birdBySeed = (seed, sym) => { const l = sym ? birdList().filter(b => inRange(sym, b.id)) : birdList(), use = l.length ? l : birdList(); return use.length ? use[seed % use.length] : null; };

/* ---------- Art loading: bundled twins decode at once; Xtrata tops them up once a player connects ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: ART.core || 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so' };
const CACHE_KEY = 'xtrata.rugged.twins';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
const twinUrl = xid => { const [a, n] = SRC.core.split('.'); return `${SRC.origin}/inscription/mainnet/${a}/${n}/${xid}`; };
async function loadBundled() {
  await Promise.all((MAIN.birds || []).map(async a => { try { const img = await loadImage(a.src, 8000); birds.set(a.tokenId, { id: a.tokenId, xtrataId: a.xtrataId, img, bundled: true, baseForever: true }); sources.bundled++; } catch (e) {} }));
  if (ART.logos && ART.logos.welsh) { try { welshImg = await loadImage(ART.logos.welsh, 8000); sources.welsh = true; pools.wild = [{ key: 'welsh', id: 'WELSH', num: 'WELSH', img: welshImg, tile: welshTile(welshImg) }]; } catch (e) {} }
  buildPools(); revealCache.clear();
}
// The helper's newest page gives the twin count (inscribed-count) and fresh token ids; the twin manifest bundled with the build
// names every token's Xtrata id, so any bird can be loaded straight from Xtrata. A failed read leaves the count "unknown", never "none".
async function loadLive() {
  let helper = MAIN.helper;
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; const c = (reg.collections || []).find(x => x.key === MAIN.key); if (c && c.helper) helper = c.helper; sources.registry = 'live'; }
  catch (e) { sources.registry = 'fallback'; }
  let list = [];
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core; sources.cached = !!fresh;
  if (helper) { try { if (fresh) list = cache.list; else { const first = parseEvents(await eventsPage(helper, 0)); list = first.list; if (first.count) { twinCount = { value: first.count, at: Date.now(), live: true, stale: false }; try { localStorage.setItem(TWIN_KEY, JSON.stringify(twinCount)); } catch (e) {} } } sources.lists++; } catch (e) { sources.listFailures++; twinCount = { ...twinCount, stale: true, live: false, failed: true }; } }
  const known = new Map(((MANIFEST.collections || []).find(c => c.key === MAIN.key) || { tokens: [] }).tokens.filter(t => t[2]).map(t => [t[0], String(t[1])]));
  list.forEach(t => known.set(t.tokenId, t.xtrataId));
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, list })); } catch (e) {}
  const queue = sample([...known.entries()].filter(([id]) => !birds.has(id)), 36); let i = 0, added = 0;
  const worker = async () => { while (i < queue.length) { const [id, xid] = queue[i++]; try { const img = await loadImage(twinUrl(xid)); birds.set(id, { id, xtrataId: xid, img, bundled: false, baseForever: true }); sources.images++; added++; } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker)); if (added) buildPools(); sources.done = true; screenDirty = true;
}

/* ---------- Faces: which twin a cell shows. Chosen after the result, with Math.random only. ---------- */
const pickFace = s => pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
const itemFor = (s, f) => f >= 0 && pools[s][f] ? pools[s][f] : null;
const tileFor = (s, f) => { const it = itemFor(s, f); return it ? it.tile : names[s]; };
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }
// A rug for a reveal (Unroll), chosen from the round id alone (cosmetic): same round, same rug, never touching the engine.
const REVEAL_SYM = { 15: 'bitcoin', 10: 'block', 8: 'chip', 5: 'lemon', 4: 'lemon', 3: 'cherry', 2: 'cherry', 1: 'cherry' };
const TIER_OF = { 15: 'FLYING CARPET', 10: 'TIER I', 8: 'TIER II', 5: 'TIER III', 4: 'TIER III', 3: 'TIER IV', 2: 'TIER IV', 1: 'TIER IV' };
function revealRug(prize, roundId, k) { const sym = REVEAL_SYM[prize] || 'cherry', seed = hashStr(`${roundId}:${k}:${prize}`), key = `${sym}:${seed}`; let t = revealCache.get(key);
  if (!t) { const b = birdBySeed(seed, sym === 'bitcoin' ? null : sym); t = { sym, b, dye: sym === 'bitcoin' ? '#b8860b' : COLS[sym].color }; revealCache.set(key, t); if (revealCache.size > 80) revealCache.delete(revealCache.keys().next().value); } return t; }
// Fully Woven: the bird on the loom, chosen by the round id (each round weaves one rug).
const loomBird = f => birdBySeed(hashStr(`${f.roundId || 'loom'}:loom`));
