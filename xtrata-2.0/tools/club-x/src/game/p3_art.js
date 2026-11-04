
/* ---------- The symbols. The X marks, the Mask, the door, the wristband and the tag are original club-flyer art drawn here in code
   (this machine's agreed exception: the X is Chemical X's signature subject, so it is drawn fresh and never copied from his works).
   Chemical X's own works are different: they are loaded from the chain exactly as he made them, and are never redrawn. ---------- */
const pools = { cherry: [], lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], scatter: [], vault: [], chain: [] };
const TAB = { cherry: CHALK, lemon: PINK, chip: CYAN, block: LASER, artifact: '#ffffff', bitcoin: ACID, wild: CHALK, scatter: ACID, vault: ACID, chain: PINK };
const amt = v => String(v).replace(/\.0+$/, '');
const rnd = seed => mul32(seed * 2654435761 >>> 0 || 1);
const clampF = x => Math.max(0, Math.min(1, x));
// A tile: a steel plate with a coloured tab carrying the symbol's name, and an interior (x 12..228, y 44..226) the painter fills.
function tile(label, tab, glow, paint, seed = 1) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = glow || '#000'; g.shadowBlur = glow ? 18 : 10; g.shadowOffsetY = glow ? 0 : 4; round(g, 12, 10, 216, 216, 12, STEEL); g.restore();
  g.save(); g.beginPath(); g.roundRect(12, 44, 216, 182, [0, 0, 12, 12]); g.clip(); paint(g, rnd(seed)); g.restore();
  round(g, 12, 10, 216, 34, [12, 12, 0, 0], tab); fitText(g, label, 120, 28, 18, 196, INK, COND, 'center', '800');
  round(g, 12, 10, 216, 216, 12, null, glow || '#000', glow ? 3 : 2);
  return c;
}
// Chalk: several wobbling passes of a broken line, and a scatter of dust.
function chalkLine(g, x0, y0, x1, y1, w, col, r) {
  g.save(); g.lineCap = 'round'; g.strokeStyle = col;
  for (let pass = 0; pass < 4; pass++) { g.globalAlpha = pass ? .38 : .9; g.lineWidth = w * (pass ? .6 : 1) * (.85 + r() * .3); g.beginPath(); const j = () => (r() - .5) * w * .5; g.moveTo(x0 + j(), y0 + j()); const n = 6; for (let k = 1; k <= n; k++) { const u = k / n; g.lineTo(x0 + (x1 - x0) * u + j(), y0 + (y1 - y0) * u + j()); } g.stroke(); }
  g.globalAlpha = .55; g.fillStyle = col; for (let k = 0; k < 40; k++) { const u = r(), px = x0 + (x1 - x0) * u + (r() - .5) * w * 2.4, py = y0 + (y1 - y0) * u + (r() - .5) * w * 2.4; g.fillRect(px, py, 1 + r() * 2, 1 + r() * 2); }
  g.restore();
}
function drawChalkX(g, cx, cy, s, r, col = CHALK, w = 13) { chalkLine(g, cx - s, cy - s, cx + s, cy + s, w, col, r); chalkLine(g, cx + s * .92, cy - s * 1.02, cx - s * 1.02, cy + s * .94, w, col, r); }
function corrugated(g, x, y, w, h, base = '#1e2125', seed = 4) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h);
  for (let px = x; px < x + w; px += 14) { const gr = g.createLinearGradient(px, 0, px + 14, 0); gr.addColorStop(0, 'rgba(255,255,255,.07)'); gr.addColorStop(.5, 'rgba(0,0,0,.18)'); gr.addColorStop(1, 'rgba(0,0,0,.28)'); g.fillStyle = gr; g.fillRect(px, y, 14, h); }
  const r = rnd(seed); for (let k = 0; k < 9; k++) { g.fillStyle = `rgba(110,60,25,${.05 + r() * .09})`; g.fillRect(x + r() * w, y + r() * h * .4, 3 + r() * 6, 30 + r() * 90); }
  g.restore();
}
// 1 · cherry · Chalk X on a warehouse door
function chalkTile(v = 0) {
  return tile('CHALK X', CHALK, '', (g, r) => {
    corrugated(g, 12, 44, 216, 182, '#202327', 3 + v); g.fillStyle = '#00000066'; g.fillRect(12, 44, 6, 182); g.fillRect(222, 44, 6, 182);
    g.fillStyle = '#2d3136'; g.fillRect(12, 196, 216, 30); hazard(g, 12, 216, 216, 10, .8); rivet(g, 28, 60, 4); rivet(g, 212, 60, 4);
    if (v === 0) drawChalkX(g, 120, 126, 54, r);
    else if (v === 1) { drawChalkX(g, 120, 126, 46, r); g.save(); g.strokeStyle = '#f7f5ef99'; g.lineWidth = 5; g.setLineDash([2, 11]); g.lineCap = 'round'; g.beginPath(); g.arc(120, 126, 78, 0, 7); g.stroke(); g.restore(); }
    else { drawChalkX(g, 98, 120, 38, r, CHALK, 11); chalkLine(g, 150, 100, 202, 100, 7, CHALK, r); chalkLine(g, 202, 100, 186, 86, 7, CHALK, r); chalkLine(g, 202, 100, 186, 114, 7, CHALK, r); }
    g.save(); g.font = `italic 700 17px ${SANS}`; g.fillStyle = '#f7f5efcc'; g.textAlign = 'center'; g.fillText(['TONIGHT', 'FOLLOW', 'THIS WAY'][v % 3], 120, 206); g.restore();
  }, 3 + v);
}
// 2 · lemon · Stencil X, sprayed on a wall
function stencilTile(v = 0) {
  const col = v ? ACID : PINK;
  return tile(!v && PINKX.img ? 'CHEMICAL X' : 'STENCIL X', PINK, '', (g, r) => {
    concrete(g, 12, 44, 216, 182, 6 + v, '#4d4b47'); g.fillStyle = '#00000030'; g.fillRect(12, 134, 216, 2);
    if (!v && PINKX.img) { drawCxX(g, 120, 130, 118); return; }
    const o = canvas(240, 240), og = o.getContext('2d'); og.lineCap = 'butt'; og.strokeStyle = col; og.lineWidth = 36;
    og.beginPath(); og.moveTo(70, 70 + 4); og.lineTo(170, 196); og.moveTo(170, 70 + 4); og.lineTo(70, 196); og.stroke();
    og.globalCompositeOperation = 'destination-out'; [[100, 106], [140, 106], [104, 160], [136, 160], [120, 134]].forEach(([x, y]) => og.fillRect(x - 3, y - 9, 6, 18)); [[120, 96], [120, 172]].forEach(([x, y]) => og.fillRect(x - 12, y - 2.5, 24, 5));
    g.save(); g.shadowColor = col; g.shadowBlur = 16; g.globalAlpha = .55; g.drawImage(o, 0, 0); g.restore(); g.drawImage(o, 0, 0);
    g.save(); g.globalAlpha = .5; g.fillStyle = col; for (let k = 0; k < 90; k++) { const a = r() * 7, d = 50 + r() * 70; g.fillRect(120 + Math.cos(a) * d * .9, 134 + Math.sin(a) * d * .8, 1 + r() * 1.6, 1 + r() * 1.6); } g.restore();
    [[86, 178], [150, 186], [118, 150]].forEach(([x, y], k) => { g.fillStyle = col; g.fillRect(x, y, 3.2, 20 + k * 9 + r() * 10); g.beginPath(); g.arc(x + 1.6, y + 20 + k * 9 + 8, 3.2, 0, 7); g.fill(); });
  }, 6 + v);
}
// 3 · chip · Neon X: glass tubes on a dark brick wall
function neonTile(v = 0) {
  const col = v ? PINK : CYAN, col2 = v ? PINK2 : '#b9f5ff';
  return tile('NEON X', CYAN, col + '88', (g, r) => {
    g.fillStyle = '#0a0b12'; g.fillRect(12, 44, 216, 182); for (let y = 44; y < 226; y += 18) { g.fillStyle = '#ffffff08'; g.fillRect(12, y, 216, 1); for (let x = 12 + ((y / 18) % 2) * 22; x < 228; x += 44) g.fillRect(x, y, 1, 18); }
    const gl = g.createRadialGradient(120, 134, 8, 120, 134, 120); gl.addColorStop(0, col + '55'); gl.addColorStop(1, col + '00'); g.fillStyle = gl; g.fillRect(12, 44, 216, 182);
    const tube = (a, b, c, d) => { g.save(); g.lineCap = 'round'; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 26; g.lineWidth = 16; g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); g.shadowBlur = 8; g.lineWidth = 10; g.stroke(); g.shadowBlur = 0; g.strokeStyle = col2; g.lineWidth = 4; g.stroke(); g.restore(); };
    tube(76, 88, 164, 180); tube(164, 88, 76, 180);
    [[76, 88], [164, 88], [76, 180], [164, 180], [120, 134]].forEach(([x, y]) => { g.fillStyle = '#31353a'; g.fillRect(x - 5, y - 5, 10, 10); g.fillStyle = '#ffffff44'; g.fillRect(x - 5, y - 5, 10, 2); });
    g.strokeStyle = '#0006'; g.lineWidth = 2; g.beginPath(); g.moveTo(12, 214); g.lineTo(228, 214); g.stroke(); g.save(); g.globalAlpha = .55 + .2 * r(); text(g, 'OPEN LATE', 120, 208, 15, col2, COND, 'center', '800'); g.restore();
  }, 9 + v);
}
// 4 · block · Laser X, drawn in green beams through haze
function laserTile(v = 0) {
  return tile('LASER X', LASER, LASER + '77', (g, r) => {
    g.fillStyle = '#020604'; g.fillRect(12, 44, 216, 182);
    for (let k = 0; k < 7; k++) { const gr = g.createRadialGradient(40 + r() * 160, 70 + r() * 130, 4, 120, 134, 90 + r() * 40); gr.addColorStop(0, 'rgba(55,255,122,.16)'); gr.addColorStop(1, 'rgba(55,255,122,0)'); g.fillStyle = gr; g.fillRect(12, 44, 216, 182); }
    const beam = (x0, y0, x1, y1, w = 1) => { g.save(); g.lineCap = 'round'; g.strokeStyle = LASER; g.shadowColor = LASER; g.shadowBlur = 22; g.lineWidth = 9 * w; g.globalAlpha = .55; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.globalAlpha = 1; g.shadowBlur = 8; g.lineWidth = 4 * w; g.stroke(); g.strokeStyle = '#eafff1'; g.shadowBlur = 0; g.lineWidth = 1.8 * w; g.stroke(); g.restore(); };
    if (v === 0) { beam(18, 54, 222, 218); beam(222, 54, 18, 218); } else { beam(18, 60, 222, 214); beam(222, 60, 18, 214); beam(120, 44, 120, 226, .5); beam(12, 134, 228, 134, .5); }
    g.fillStyle = '#eafff1'; g.shadowColor = LASER; g.shadowBlur = 20; g.beginPath(); g.arc(120, 136, 6, 0, 7); g.fill(); g.shadowBlur = 0;
    for (let k = 0; k < 26; k++) { g.fillStyle = `rgba(180,255,208,${.15 + r() * .5})`; g.fillRect(12 + r() * 216, 44 + r() * 182, 1.4, 1.4); }
    g.fillStyle = '#0a1a10'; g.fillRect(12, 206, 216, 20); text(g, 'KEEP YOUR EYES UP', 120, 217, 12, LASER2, MONO, 'center', '700');
  }, 12 + v);
}
// Chemical X's works: loaded art on a plate. A work without a Forever Twins twin is shown desaturated with a NOT YET FOREVER stamp.
// The real This Is Number One logo (the pixel 1 from thisisnumberone.com), embedded by build.py from art/brand/this-is-number-one-logo.svg, used as supplied.
const TIN = { img: null };
(() => { const d = window.CLUBX_BRAND && window.CLUBX_BRAND.tin; if (!d) return; const im = new Image(); im.onload = () => { TIN.img = im; if (typeof refreshArtTiles === 'function') refreshArtTiles(); }; im.src = d; })();
const PINKX = { img: null }; // the genuine Chemical X pink X (official tile 7, keyed to transparent); the drawn spray X is the fallback until it loads
(() => { const d = window.CLUBX_BRAND && window.CLUBX_BRAND.pinkX; if (!d) return; const im = new Image(); im.onload = () => { PINKX.img = im; if (typeof refreshArtTiles === 'function') refreshArtTiles(); }; im.src = d; })();
function drawCxX(g, cx, cy, h, glow = PINK) { const im = PINKX.img, w = h * im.width / im.height; g.save(); if (glow) { g.shadowColor = glow; g.shadowBlur = h * .28; g.globalAlpha *= .6; g.drawImage(im, cx - w / 2, cy - h / 2, w, h); g.restore(); g.save(); } g.drawImage(im, cx - w / 2, cy - h / 2, w, h); g.restore(); }
function desaturate(c) { const g = c.getContext('2d'); try { const d = g.getImageData(0, 0, c.width, c.height), p = d.data; for (let i = 0; i < p.length; i += 4) { const y = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = p[i + 1] = p[i + 2] = y * .82; } g.putImageData(d, 0, 0); return true; } catch (e) { g.fillStyle = 'rgba(30,30,30,.7)'; g.fillRect(0, 0, c.width, c.height); return false; } }
function isForever(tok) { if (sources.test === 'all') return true; if (sources.test === 'some') return tok.idx % 2 === 0; if (sources.test === 'none') return false; return sources.forever.has(tok.key); }
const xidOf = tok => sources.forever.get(tok.key) || null;
function artName(tok) { return String((tok.meta && tok.meta.name) || tok.fallbackName || `${tok.work.name} #${tok.id}`).replace(/_/g, ' '); }
function nameTile(tok, jack) {
  return tile(jack ? 'NUMBER ONE' : tok.work.name.toUpperCase(), jack ? ACID : '#ffffff', jack ? ACID + '88' : '', (g, r) => {
    g.fillStyle = jack ? '#12130a' : '#0b0c0e'; g.fillRect(12, 44, 216, 182); const gh = canvas(240, 240); drawChalkX(gh.getContext('2d'), 120, 134, 70, r, CHALK, 22); g.save(); g.globalAlpha = .09; g.drawImage(gh, 0, 0); g.restore();
    if (jack && TIN.img) { hazard(g, 12, 44, 216, 10); g.drawImage(TIN.img, 120 - 84, 72, 168, 105); fitText(g, 'THIS IS NUMBER ONE', 120, 200, 22, 196, CHALK, COND, 'center', '800'); }
    else if (jack) { hazard(g, 12, 44, 216, 10); fitText(g, 'THIS IS', 120, 92, 40, 190, CHALK, COND, 'center', '800'); fitText(g, 'NUMBER ONE', 120, 142, 50, 196, ACID, COND, 'center', '800'); text(g, '#1', 120, 192, 34, CHALK, COND, 'center', '800'); }
    else { fitText(g, tok.work.name.toUpperCase(), 120, 110, 44, 190, CHALK, COND, 'center', '800'); text(g, `#${tok.id}`, 120, 158, 38, ACID, COND, 'center', '800'); text(g, tok.state === 'pending' ? 'LOADING ART…' : 'ART NOT LOADED', 120, 200, 13, SMOKE, MONO, 'center', '700'); }
  }, 20 + tok.id);
}
function nftTile(tok, jack) {
  if (!tok.img) return nameTile(tok, jack);
  const official = !!tok.work.official, forever = !official && isForever(tok), xid = xidOf(tok), ax = 22, ay = 52, aw = 196, ah = 142;
  return tile(jack ? 'NUMBER ONE' : tok.work.name.toUpperCase(), jack ? ACID : '#ffffff', forever ? (jack ? ACID + 'aa' : '#ffffff55') : '', (g, r) => {
    g.fillStyle = jack ? '#12130a' : '#0b0c0e'; g.fillRect(12, 44, 216, 182);
    const a = canvas(aw, ah), ag = a.getContext('2d'), iw = tok.img.naturalWidth || tok.img.width, ih = tok.img.naturalHeight || tok.img.height, k = Math.max(aw / iw, ah / ih);
    ag.fillStyle = '#000'; ag.fillRect(0, 0, aw, ah); ag.drawImage(tok.img, (aw - iw * k) / 2, (ah - ih * k) / 2, iw * k, ih * k);
    if (!forever && !official) desaturate(a); g.drawImage(a, ax, ay); g.strokeStyle = '#000'; g.lineWidth = 2; g.strokeRect(ax, ay, aw, ah);
    g.fillStyle = '#0b0c0e'; g.fillRect(12, 198, 216, 28); fitText(g, artName(tok).toUpperCase(), 120, 207, 13, 196, forever || official ? CHALK : SMOKE, COND, 'center', '800'); text(g, official ? 'OFFICIAL · CHEMICAL X' : forever ? `∞ #${tok.id}${xid ? ' · XTRATA ' + xid : ''}` : `#${tok.id} · NOT TWINNED`, 120, 220, 10, forever || official ? ACID : SMOKE, MONO, 'center', '700');
    if (forever) { round(g, 190, 56, 24, 22, 11, '#000c', ACID, 1.5); text(g, '∞', 202, 68, 17, ACID, COND, 'center', '800'); }
    else if (!official) rubberStamp(g, 'NOT YET FOREVER', 120, 126, 17, PINK, -.16, .9);
  }, 20 + tok.id);
}
// 7 · wild · The Mask: a plain white mask with an X on its forehead (original, until Chemical X supplies his own PFP)
function maskTile() {
  return tile('THE MASK', CHALK, ACID + 'aa', (g, r) => {
    const bg = g.createRadialGradient(120, 130, 10, 120, 130, 130); bg.addColorStop(0, ACID); bg.addColorStop(1, ACID3); g.fillStyle = bg; g.fillRect(12, 44, 216, 182);
    g.save(); g.globalAlpha = .18; g.fillStyle = INK; for (let k = 0; k < 12; k++) { g.save(); g.translate(120, 134); g.rotate(k * Math.PI / 6); g.beginPath(); g.moveTo(0, 0); g.lineTo(240, -9); g.lineTo(240, 9); g.closePath(); if (k % 2) g.fill(); g.restore(); } g.restore();
    g.save(); g.shadowColor = '#0008'; g.shadowBlur = 14; g.shadowOffsetY = 6; g.beginPath(); g.moveTo(120, 64); g.bezierCurveTo(168, 64, 182, 98, 176, 134); g.bezierCurveTo(170, 176, 146, 202, 120, 206); g.bezierCurveTo(94, 202, 70, 176, 64, 134); g.bezierCurveTo(58, 98, 72, 64, 120, 64); g.closePath(); g.fillStyle = lin(g, 70, 64, 170, 206, ['#ffffff', '#ececea', '#c8c8c4']); g.fill(); g.restore();
    g.strokeStyle = '#0003'; g.lineWidth = 2; g.stroke();
    g.fillStyle = INK; [[-1], [1]].forEach(([s]) => { g.save(); g.translate(120 + s * 30, 130); g.rotate(s * -.16); g.beginPath(); g.ellipse(0, 0, 21, 8.5, 0, 0, 7); g.fill(); g.restore(); });
    g.strokeStyle = '#0004'; g.lineWidth = 3; g.beginPath(); g.moveTo(120, 140); g.quadraticCurveTo(113, 160, 122, 166); g.stroke(); g.strokeStyle = '#0003'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(100, 184); g.quadraticCurveTo(120, 192, 140, 184); g.stroke();
    g.strokeStyle = INK; g.lineCap = 'round'; g.lineWidth = 9; g.beginPath(); g.moveTo(104, 76); g.lineTo(136, 108); g.moveTo(136, 76); g.lineTo(104, 108); g.stroke();
    round(g, 40, 202, 160, 20, 3, INK); spaced(g, 'WILD', 120, 212, 14, 8, ACID, '800');
  }, 30);
}
// 8 · scatter · Midnight: the warehouse door, its X, opening onto light
function midnightTile() {
  return tile('MIDNIGHT', ACID, ACID + 'aa', (g, r) => {
    g.fillStyle = '#05060a'; g.fillRect(12, 44, 216, 182);
    const lt = g.createLinearGradient(120, 70, 120, 226); lt.addColorStop(0, '#fff6a8'); lt.addColorStop(.5, '#e6ff0099'); lt.addColorStop(1, '#e6ff0000'); g.fillStyle = lt; g.beginPath(); g.moveTo(104, 70); g.lineTo(136, 70); g.lineTo(228, 226); g.lineTo(12, 226); g.closePath(); g.globalAlpha = .55; g.fill(); g.globalAlpha = 1;
    g.fillStyle = '#fffbd0'; g.fillRect(100, 66, 40, 140);
    corrugated(g, 40, 62, 62, 148, '#23262a', 14); corrugated(g, 138, 62, 62, 148, '#23262a', 15);
    g.save(); g.beginPath(); g.moveTo(40, 62); g.lineTo(102, 70); g.lineTo(102, 202); g.lineTo(40, 210); g.closePath(); g.clip(); corrugated(g, 40, 62, 62, 148, '#2a2e33', 16); drawChalkX(g, 66, 136, 18, r, CHALK, 7); g.restore();
    g.save(); g.beginPath(); g.moveTo(200, 62); g.lineTo(138, 70); g.lineTo(138, 202); g.lineTo(200, 210); g.closePath(); g.clip(); corrugated(g, 138, 62, 62, 148, '#2a2e33', 17); drawChalkX(g, 172, 136, 18, r, CHALK, 7); g.restore();
    g.fillStyle = '#000'; g.fillRect(26, 58, 188, 6); g.fillRect(26, 58, 14, 156); g.fillRect(200, 58, 14, 156);
    g.beginPath(); g.arc(120, 82, 15, 0, 7); g.fillStyle = INK; g.fill(); g.strokeStyle = ACID; g.lineWidth = 2; g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(120, 82); g.lineTo(120, 72); g.moveTo(120, 82); g.lineTo(120, 74); g.stroke();
    text(g, '12', 120, 74, 9, ACID, MONO, 'center', '700');
    round(g, 40, 206, 160, 18, 3, INK); spaced(g, 'DOORS OPEN', 120, 215, 11, 5, ACID, '800');
  }, 40);
}
// 9 · vault · Wristband stamped with an X
function wristbandTile() {
  return tile('WRISTBAND', ACID, '', (g, r) => {
    g.fillStyle = '#17191c'; g.fillRect(12, 44, 216, 182); g.save(); g.globalAlpha = .06; g.fillStyle = '#fff'; for (let y = 44; y < 226; y += 6) g.fillRect(12, y, 216, 1); g.restore();
    g.save(); g.translate(120, 138); g.rotate(-.1); g.shadowColor = '#000b'; g.shadowBlur = 16; g.shadowOffsetY = 8;
    g.beginPath(); g.roundRect(-96, -44, 192, 88, 8); g.fillStyle = lin(g, 0, -44, 0, 44, ['#f2ff4a', ACID, '#c3d800']); g.fill(); g.restore();
    g.save(); g.translate(120, 138); g.rotate(-.1); g.beginPath(); g.roundRect(-96, -44, 192, 88, 8); g.clip();
    g.fillStyle = '#00000018'; for (let k = -100; k < 100; k += 12) g.fillRect(k, -44, 2, 88); g.fillStyle = INK; g.fillRect(-96, -44, 192, 8); g.fillRect(-96, 36, 192, 8);
    for (let k = 0; k < 7; k++) { g.fillStyle = '#00000022'; g.fillRect(-90 + k * 28, -30, 14, 3); }
    g.strokeStyle = INK; g.lineCap = 'round'; g.lineWidth = 15; g.beginPath(); g.moveTo(-28, -22); g.lineTo(28, 24); g.moveTo(28, -22); g.lineTo(-28, 24); g.stroke();
    g.globalCompositeOperation = 'destination-out'; for (let k = 0; k < 18; k++) g.fillRect(-40 + r() * 80, -30 + r() * 56, 1 + r() * 3, 1 + r() * 2);
    g.restore();
    g.save(); g.translate(120, 138); g.rotate(-.1); text(g, 'ADMIT ONE', -66, 0, 11, INK, MONO, 'center', '700'); g.rotate(-Math.PI / 2); g.restore();
    g.save(); g.translate(120, 138); g.rotate(-.1); g.fillStyle = '#0006'; g.beginPath(); g.arc(80, 0, 6, 0, 7); g.fill(); g.restore();
    text(g, 'GUEST LIST', 120, 208, 15, CHALK, COND, 'center', '800');
  }, 50);
}
// 10 · chain · Tag: an X sprayed on a spot on a city map. Districts are only labels for places; nothing here copies a map product.
const SPOTS = ['SOHO', 'SHOREDITCH', 'HACKNEY', 'PECKHAM', 'BRIXTON', 'CAMDEN', "KING'S CROSS", 'VAUXHALL', 'BERMONDSEY', 'DEPTFORD', 'STRATFORD', 'LEYTON', 'DALSTON', 'ELEPHANT', 'BATTERSEA'];
function nightMap(g, x, y, w, h, seed = 2) {
  const r = rnd(seed); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = '#080c16'; g.fillRect(x, y, w, h);
  g.strokeStyle = '#18233a'; g.lineWidth = 1.5; for (let i = -4; i < 14; i++) { g.beginPath(); g.moveTo(x + i * w / 9, y); g.lineTo(x + i * w / 9 + w * .35, y + h); g.stroke(); g.beginPath(); g.moveTo(x, y + i * h / 6 + 6); g.lineTo(x + w, y + i * h / 6 - h * .12); g.stroke(); }
  g.strokeStyle = '#1f2f50'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x + r() * w, y); g.quadraticCurveTo(x + r() * w, y + h / 2, x + r() * w, y + h); g.stroke(); }
  g.fillStyle = '#0c1f1a'; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(x + r() * w, y + r() * h, w * (.05 + r() * .06), h * (.06 + r() * .06), r() * 3, 0, 7); g.fill(); }
  g.strokeStyle = '#143a63'; g.lineWidth = Math.max(8, h * .09); g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 10, y + h * .66); g.bezierCurveTo(x + w * .25, y + h * .4, x + w * .45, y + h * .95, x + w * .66, y + h * .6); g.bezierCurveTo(x + w * .82, y + h * .38, x + w * .9, y + h * .5, x + w + 10, y + h * .3); g.stroke();
  g.strokeStyle = '#2a5d95'; g.lineWidth = 1.5; g.stroke(); g.restore();
}
function sprayX(g, cx, cy, s, col = PINK, grow = 1, seed = 1) {
  const r = rnd(seed); g.save(); g.translate(cx, cy); g.scale(.4 + .6 * grow, .4 + .6 * grow); g.globalAlpha = Math.min(1, grow * 1.4);
  if (col === PINK && PINKX.img) { drawCxX(g, 0, 0, s * 2.1); g.restore(); return; } // the genuine pink X stands in for the spray X wherever the room tags a spot
  g.shadowColor = col; g.shadowBlur = s * .6; g.strokeStyle = col; g.lineCap = 'round'; g.lineWidth = s * .42; g.beginPath(); g.moveTo(-s, -s); g.lineTo(s, s); g.moveTo(s, -s); g.lineTo(-s, s); g.stroke(); g.shadowBlur = 0; g.lineWidth = s * .2; g.strokeStyle = '#ffffff55'; g.stroke();
  g.globalAlpha *= .6; g.fillStyle = col; for (let k = 0; k < 40; k++) { const a = r() * 7, d = s * (1 + r() * .9); g.fillRect(Math.cos(a) * d, Math.sin(a) * d, 1 + r() * 2, 1 + r() * 2); }
  g.globalAlpha = Math.min(1, grow * 1.4); [[-s * .5, s * .9], [s * .6, s * .8]].forEach(([x, y]) => { g.fillStyle = col; g.fillRect(x, y, s * .1, s * (.5 + r() * .5)); }); g.restore();
}
function tagTile(v = 0) {
  const spots = [[SPOTS[0], 92, 120], [SPOTS[2], 150, 98], [SPOTS[9], 162, 160]][v % 3];
  return tile('TAG', PINK, PINK + '77', (g, r) => {
    nightMap(g, 12, 44, 216, 182, 5 + v); sprayX(g, spots[1], spots[2], 26, PINK, 1, 4 + v);
    g.strokeStyle = '#ffffff30'; g.lineWidth = 1; g.setLineDash([3, 5]); g.beginPath(); g.arc(spots[1], spots[2], 44, 0, 7); g.stroke(); g.setLineDash([]);
    round(g, 24, 196, 192, 22, 3, '#000b'); text(g, `SPOT · ${spots[0]}`, 120, 207, 14, PINK2, MONO, 'center', '700');
  }, 60 + v);
}
/* ---------- The pools: which picture each symbol can show. Chosen with Math.random AFTER the engine fixes a result. ---------- */
const art = { tokens: [], loaded: 0, failed: 0, rev: 0 };
(WORKS.works || []).forEach(w => { (w.ids || []).forEach((id, i) => art.tokens.push({ work: w, id, idx: art.tokens.length, key: `${w.key}:${id}`, state: w.contract || w.official ? 'pending' : 'none', img: null, meta: null, fallbackName: w.titles && w.titles.length === (w.ids || []).length ? w.titles[i] : '' })); if ((!w.contract && !w.official) || !(w.ids || []).length) art.tokens.push({ work: w, id: 1, idx: art.tokens.length, key: `${w.key}:1`, state: 'none', img: null, meta: null, fallbackName: (w.titles || [])[0] || w.name, placeholder: true }); });
const tokensOf = slot => art.tokens.filter(t => t.work.slot === slot);
function rebuildPools() {
  pools.cherry = [0, 1, 2].map(v => ({ v, tile: chalkTile(v) })); pools.lemon = [0, 1].map(v => ({ v, tile: stencilTile(v) })); pools.chip = [0, 1].map(v => ({ v, tile: neonTile(v) })); pools.block = [0, 1].map(v => ({ v, tile: laserTile(v) }));
  pools.artifact = tokensOf('artifact').map(t => ({ tok: t, tile: nftTile(t, false) })); pools.bitcoin = tokensOf('bitcoin').map(t => ({ tok: t, tile: nftTile(t, true) }));
  pools.wild = [{ v: 0, tile: maskTile() }]; pools.scatter = [{ v: 0, tile: midnightTile() }]; pools.vault = [{ v: 0, tile: wristbandTile() }]; pools.chain = [0, 1, 2].map(v => ({ v, tile: tagTile(v) }));
  for (const k of Object.keys(pools)) if (!pools[k].length) pools[k] = [{ tile: k === 'bitcoin' ? nameTile({ work: { name: 'This Is Number One' }, id: 1, state: 'none' }, true) : nameTile({ work: { name: 'Chemical X' }, id: 1, state: 'none' }, false) }];
  for (const k in iconURL) delete iconURL[k]; art.rev++;
}
const iconURL = {};
rebuildPools();
let rebuildTimer = 0;
function refreshArtTiles() { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(() => { rebuildPools(); refaceIdle(); screenDirty = true; if (typeof liveLabel === 'function') liveLabel(); }, 120); }
const tileFor = (s, f) => { const p = pools[s]; return p[f >= 0 && f < p.length ? f : 0].tile; };
const faceItem = (s, f) => { const p = pools[s]; return p ? p[f >= 0 && f < p.length ? f : 0] : null; };
// Which picture shows in a cell is chosen with Math.random AFTER the engine has fixed the result: loaded art can never change a result.
const pickFace = s => pools[s] && pools[s].length ? Math.floor(Math.random() * pools[s].length) : 0;
let faces = state.grid.map(col => col.map(s => pickFace(s)));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c] && faces[c][r] >= 0 && faces[c][r] < pools[s].length ? faces[c][r] : pickFace(s))); }
// A round's own little generator (FNV hash of its id): used only to choose which picture a bonus shows, never a prize.
function roundHash(id, salt = '') { let h = 2166136261; for (const ch of String(id || 'clubx') + salt) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
function permFor(id, n) { const a = [...Array(n).keys()]; let s = roundHash(id, 'perm') || 1; const r = () => (s = Math.imul(s ^ s >>> 15, 2246822507) + 1 >>> 0) / 4294967296; for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// Split-flap cells: one character per flap, a hinge line across the middle. opts.flip(i) gives 0..1 flip progress for cell i.
function flapCells(g, s, cx, cy, h, opts = {}) {
  const chars = [...s], cw = h * (opts.w || .64), gap = h * .08, isSep = ch => ch === ',' || ch === '.', ww = chars.map(ch => isSep(ch) ? cw * .32 : cw), total = ww.reduce((a, b) => a + b, 0) + gap * (chars.length - 1); let x = cx - total / 2;
  chars.forEach((ch, i) => {
    const w = ww[i];
    if (isSep(ch)) { text(g, ch, x + w / 2, cy + h * .28, h * .5, opts.col || ACID, COND, 'center', '800'); x += w + gap; return; }
    const u = opts.flip ? clampF(opts.flip(i)) : 1, shown = u < 1 && opts.scramble ? String(Math.floor(Math.random() * 10)) : ch;
    round(g, x, cy - h / 2, w, h, h * .08, lin(g, 0, cy - h / 2, 0, cy + h / 2, ['#2a2d33', '#141619', '#0d0e10', '#1d2025']), '#000', 1.5);
    g.save(); g.beginPath(); g.rect(x, cy - h / 2, w, h); g.clip(); text(g, shown, x + w / 2, cy + h * .04, h * .82, opts.col || ACID, COND, 'center', '800');
    if (u < 1) { const k = Math.abs(Math.cos(u * Math.PI)); g.fillStyle = '#0d0e10'; g.fillRect(x, cy - h / 2 + (u < .5 ? 0 : h / 2), w, h / 2 * (1 - k)); }
    g.restore(); g.fillStyle = '#000'; g.fillRect(x, cy - 1.5, w, 3); g.fillStyle = '#ffffff10'; g.fillRect(x, cy + 1.5, w, 1);
    x += w + gap;
  });
  return total;
}
