/* ---------- Canvas helpers ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = 'Arial', align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, weight = '900', font = 'Arial') { let k = size; ctx.font = `${weight} ${k}px ${font}`; while (ctx.measureText(s).width > maxW && k > 7) { k -= 1; ctx.font = `${weight} ${k}px ${font}`; } text(ctx, s, x, y, k, color, font, 'center', weight); return k; }
function spaced(ctx, s, x, y, size, gap, color, weight = '700', font = 'Arial') { ctx.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function rad(g, x, y, r0, r1, stops) { const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function star(g, x, y, r, color = '#fff3a6') { g.save(); g.translate(x, y); g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr = k % 2 ? r * .38 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fillStyle = color; g.fill(); g.restore(); }
const ease = t => t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3), easeIO = t => t < 0 ? 0 : t > 1 ? 1 : t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const backOut = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const HEAD = 'Impact, "Arial Black", "Helvetica Neue", Arial, sans-serif', MONO = 'ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace';
function wrap(ctx, s, maxW, maxLines = 2) { const words = String(s).split(/\s+/), lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); if (lines.length > maxLines) { const keep = lines.slice(0, maxLines); keep[maxLines - 1] = keep[maxLines - 1].replace(/\s*\S*$/, '…') || '…'; return keep; } return lines; }
const num = n => Number(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });
const shortAddr = a => { a = String(a || ''); return a.length > 14 ? a.slice(0, 6) + '…' + a.slice(-4) : a; };

/* ---------- Shared military drawing: generic parade-ground shapes, all original and drawn in code ---------- */
// An isometric block (the halving block's tile).
function cube(g, cx, cy, s, tone = '#cbbf8f') { const w = s * .87; g.save(); g.lineJoin = 'round'; const face = (pts, fill) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(cx + x, cy + y) : g.moveTo(cx + x, cy + y)); g.closePath(); g.fillStyle = fill; g.fill(); g.lineWidth = 2; g.strokeStyle = '#0b0a07'; g.stroke(); };
  face([[0, -s], [w, -s / 2], [0, 0], [-w, -s / 2]], tone); face([[-w, -s / 2], [0, 0], [0, s], [-w, s / 2]], '#8a8157'); face([[w, -s / 2], [0, 0], [0, s], [w, s / 2]], '#5f5a3c'); g.restore(); }
// A dog tag: rounded plate with a flat notch hole at the top, filled with a steel gradient.
function tagPath(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function dogTag(g, x, y, w, h, o = {}) {
  const r = o.r || Math.min(w, h) * .2, steel = o.steel || ['#e9ebec', '#a9adaf', '#6f7477'];
  g.save(); if (o.glow) { g.shadowColor = o.glow; g.shadowBlur = o.blur || 18; } tagPath(g, x, y, w, h, r); g.fillStyle = lin(g, x, y, x + w * .3, y + h, steel); g.fill(); g.restore();
  g.save(); tagPath(g, x, y, w, h, r); g.lineWidth = Math.max(1.5, w * .018); g.strokeStyle = o.edge || '#3a3d3f'; g.stroke(); tagPath(g, x + w * .045, y + h * .06, w * .91, h * .88, r * .7); g.lineWidth = Math.max(1, w * .01); g.strokeStyle = '#ffffff66'; g.stroke(); g.restore();
  round(g, x + w / 2 - w * .07, y + h * .05, w * .14, h * .08, h * .04, '#1c1d1e'); }
function ballChain(g, x0, y0, x1, y1, n = 8, r = 2.2, color = '#c9cbcc') { g.save(); for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 2; g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = color; g.fill(); g.lineWidth = .8; g.strokeStyle = '#2a2c2d'; g.stroke(); } g.restore(); }
// Rank chevrons (sergeant's stripes).
function chevrons(g, cx, cy, w, n, color, thick) { g.save(); g.lineJoin = 'miter'; g.lineCap = 'butt'; g.strokeStyle = color; g.lineWidth = thick || w * .13; for (let i = 0; i < n; i++) { const y = cy + i * (thick || w * .13) * 1.55 - (n - 1) * (thick || w * .13) * .78; g.beginPath(); g.moveTo(cx - w / 2, y + w * .22); g.lineTo(cx, y - w * .06); g.lineTo(cx + w / 2, y + w * .22); g.stroke(); } g.restore(); }
// A Spartan-style helmet and crest, original generic art (a front-on silhouette with a transverse crest). Not a portrait of anyone.
function spartanHelmet(g, cx, cy, s, o = {}) {
  const bronze = o.bronze || ['#f0d489', '#c9a24a', '#7a5a1c'], plume = o.plume || ['#d9533d', '#9b2f22'];
  g.save(); g.translate(cx, cy); g.scale(s, s); g.lineJoin = 'round';
  // transverse crest
  g.beginPath(); g.moveTo(-60, -30); g.bezierCurveTo(-64, -96, 64, -96, 60, -30); g.lineTo(46, -34); g.bezierCurveTo(42, -70, -42, -70, -46, -34); g.closePath(); g.fillStyle = lin(g, 0, -90, 0, -30, plume); g.fill(); g.lineWidth = 3; g.strokeStyle = '#2a0f0b'; g.stroke();
  g.strokeStyle = '#ffffff30'; g.lineWidth = 1.4; for (let i = -5; i <= 5; i++) { const a = i / 5; g.beginPath(); g.moveTo(a * 52, -34 + Math.abs(a) * 8); g.lineTo(a * 56, -70 + a * a * 22); g.stroke(); }
  // the helmet body
  g.beginPath(); g.moveTo(-50, -24); g.bezierCurveTo(-54, -62, 54, -62, 50, -24); g.lineTo(52, 16); g.bezierCurveTo(52, 44, 40, 64, 24, 76); g.lineTo(10, 82); g.lineTo(-10, 82); g.lineTo(-24, 76); g.bezierCurveTo(-40, 64, -52, 44, -52, 16); g.closePath();
  g.fillStyle = lin(g, -50, -50, 50, 80, bronze); g.fill(); g.lineWidth = 3.5; g.strokeStyle = '#2b1d08'; g.stroke();
  // the face opening: two eye slots, the nose guard stays metal, and a mouth slit
  g.fillStyle = '#0d0905';
  for (const m of [-1, 1]) { g.beginPath(); g.moveTo(m * 8, -6); g.lineTo(m * 40, -6); g.lineTo(m * 42, 12); g.lineTo(m * 30, 20); g.lineTo(m * 12, 18); g.closePath(); g.fill(); }
  for (const m of [-1, 1]) { g.beginPath(); g.moveTo(m * 12, 26); g.lineTo(m * 36, 26); g.lineTo(m * 30, 56); g.lineTo(m * 16, 66); g.lineTo(m * 12, 46); g.closePath(); g.fill(); }
  g.fillRect(-14, 70, 28, 5);
  g.strokeStyle = '#fff6'; g.lineWidth = 2; g.beginPath(); g.moveTo(-40, -30); g.bezierCurveTo(-30, -46, -10, -52, 4, -52); g.stroke();
  g.restore();
}
// A full moon: pale disc with soft, generic maria. Used by the $DOG tile and the moon scenes.
function moonDisc(g, x, y, r, o = {}) {
  g.save(); if (o.glow !== 0) { g.shadowColor = o.glowColor || '#fff3c8'; g.shadowBlur = (o.glow || 1) * r * .5; }
  g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = rad(g, x - r * .3, y - r * .3, r * .1, r * 1.05, o.stops || ['#fffdf2', '#efe8cf', '#cfc6a6']); g.fill(); g.restore();
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
  const maria = [[-.35, -.25, .26, .08], [.22, -.4, .18, .07], [.32, .12, .3, .09], [-.2, .35, .22, .07], [-.5, .1, .14, .06], [.05, .0, .12, .05]];
  for (const [mx, my, mr, a] of maria) { g.beginPath(); g.arc(x + mx * r, y + my * r, mr * r, 0, 7); g.fillStyle = `rgba(120,110,80,${a * (o.maria == null ? 1 : o.maria)})`; g.fill(); }
  g.restore(); }
// A silhouette soldier (generic helmeted figure): feet at (x, y), h tall. phase swings arms and legs; look (0..1) tips the head back to the sky.
function soldier(g, x, y, h, phase = 0, color = '#0a0908', look = 0, rim = '') {
  const u = h / 10, sw = Math.sin(phase), lean = look * .22; g.save(); g.translate(x, y); g.lineCap = 'round'; g.lineJoin = 'round';
  const body = (c, dx = 0, dy = 0) => { g.strokeStyle = c; g.fillStyle = c; g.translate(dx, dy);
    g.lineWidth = 1.25 * u; g.beginPath(); g.moveTo(-.55 * u, -4.2 * u); g.lineTo(-.55 * u + sw * 1.1 * u, 0); g.stroke(); g.beginPath(); g.moveTo(.55 * u, -4.2 * u); g.lineTo(.55 * u - sw * 1.1 * u, 0); g.stroke();      // legs
    g.save(); g.rotate(-lean); g.beginPath(); g.roundRect(-1.5 * u, -8.2 * u, 3 * u, 4.2 * u, .6 * u); g.fill();                                                                                        // torso
    g.lineWidth = 1 * u; g.beginPath(); g.moveTo(-1.3 * u, -7.6 * u); g.lineTo(-1.5 * u - sw * .5 * u, -5 * u); g.stroke();                                                                                // back arm
    g.beginPath(); g.moveTo(1.3 * u, -7.6 * u); g.lineTo(1.7 * u, -6 * u); g.stroke(); g.lineWidth = .45 * u; g.beginPath(); g.moveTo(1.9 * u, -5.4 * u); g.lineTo(2.2 * u, -11.4 * u); g.stroke();                // front arm holding a rifle at the shoulder
    g.translate(0, -8.4 * u); g.rotate(-look * .85); g.beginPath(); g.ellipse(0, -.85 * u, .95 * u, 1.05 * u, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(.4 * u, -.2 * u); g.lineTo(1.35 * u, .45 * u); g.lineTo(.55 * u, .9 * u); g.fill();    // head with a chin
    g.beginPath(); g.ellipse(0, -1.45 * u, 1.35 * u, .95 * u, 0, Math.PI, 0); g.fill(); g.fillRect(-1.45 * u, -1.5 * u, 2.9 * u, .26 * u);                                                                    // helmet and brim
    g.restore(); g.translate(-dx, -dy); };
  if (rim) body(rim, 0, -.35); body(color); g.restore(); }
// A cargo plane in silhouette (generic): fuselage, high wing, tail and two propellers. Nose to the right.
function cargoPlane(g, x, y, s, now) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#0c0d0c'; g.strokeStyle = '#2a2c28'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-170, -8); g.lineTo(-150, -32); g.lineTo(-135, -62); g.lineTo(-112, -62); g.lineTo(-112, -22); g.lineTo(60, -26); g.bezierCurveTo(120, -26, 168, -12, 176, 4); g.bezierCurveTo(150, 22, 110, 26, 40, 26); g.lineTo(-100, 22); g.lineTo(-170, 6); g.closePath(); g.fill(); g.stroke();   // fuselage and tail
  g.beginPath(); g.moveTo(-30, -26); g.lineTo(6, -30); g.lineTo(40, -26); g.lineTo(26, -20); g.lineTo(-40, -20); g.closePath(); g.fillStyle = '#121312'; g.fill();                                                               // high wing
  for (const px of [-8, 26]) { g.beginPath(); g.ellipse(px, -30, 4, 8, 0, 0, 7); g.fillStyle = '#1b1c1a'; g.fill(); g.save(); g.globalAlpha = .35; g.beginPath(); g.ellipse(px + 4, -30, 3, 18 + Math.sin(now / 40 + px) * 2, 0, 0, 7); g.fillStyle = '#9a9a8a'; g.fill(); g.restore(); }
  g.fillStyle = '#e4dcc0'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(70 + i * 16, -8, 3.2, 0, 7); g.fill(); }                                                                                    // lit windows
  g.restore(); }
// A parachute crate: canopy in khaki and olive panels, cords, and a stencilled olive crate. s scales the whole thing; sway tilts it.
// o.face(g, w, h) draws on the crate's front in its own coordinates (0,0 = centre of the face).
function chute(g, x, y, s, sway = 0, o = {}) {
  const rx = o.rx || 54, ry = o.ry || 38, len = o.len || 56, cw = o.cw || 46, ch = o.ch || 36, cyc = -12 - len, panels = 6;
  g.save(); g.translate(x, y); g.rotate(sway); g.scale(s, s);
  g.save(); g.shadowColor = '#000a'; g.shadowBlur = 8;
  for (let i = 0; i < panels; i++) { const a0 = Math.PI + (i / panels) * Math.PI, a1 = Math.PI + ((i + 1) / panels) * Math.PI; g.beginPath(); g.moveTo(0, cyc); g.ellipse(0, cyc, rx, ry, 0, a0, a1); g.closePath(); g.fillStyle = i % 2 ? (o.b || '#d8d0a8') : (o.a || '#7a7f4a'); g.fill(); }
  g.restore(); g.lineWidth = 1.6; g.strokeStyle = '#1b1a14'; g.beginPath(); g.ellipse(0, cyc, rx, ry, 0, Math.PI, 0); g.closePath(); g.stroke();
  for (let i = 1; i < panels; i++) { const a = Math.PI + (i / panels) * Math.PI; g.beginPath(); g.moveTo(0, cyc); g.lineTo(Math.cos(a) * rx, cyc + Math.sin(a) * ry); g.stroke(); }
  g.strokeStyle = '#e4dcc0aa'; g.lineWidth = 1; for (const k of [-1, -.34, .34, 1]) { g.beginPath(); g.moveTo(k * rx, cyc); g.lineTo(k * cw * .45, -12); g.stroke(); }
  round(g, -cw / 2, -12, cw, ch, 3, lin(g, 0, -12, 0, -12 + ch, ['#6b7244', '#454c2c']), '#1b1d12', 2); g.strokeStyle = '#d8d0a844'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-cw / 2, -12 + ch * .72); g.lineTo(cw / 2, -12 + ch * .72); g.stroke();
  if (o.face) { g.save(); g.beginPath(); g.rect(-cw / 2 + 3, -9, cw - 6, ch - 6); g.clip(); g.translate(0, -12 + ch / 2); o.face(g, cw - 8, ch - 8); g.restore(); }
  g.restore(); }
// Stamp for records that are not verified yet: shown on the tile itself, in small type.
const STAT_TAG = { 'brief-only': 'BRIEF ONLY · TO CONFIRM', unconfirmed: 'UNCONFIRMED', unavailable: 'UNAVAILABLE' };
function stamp(g, st) { if (!st || st === 'verified') return; const t = STAT_TAG[st] || String(st).toUpperCase(); g.save(); g.font = '900 9px Arial'; const w = g.measureText(t).width + 14; round(g, 120 - w / 2, 166, w, 13, 6, '#0b0a07dd', '#d9c07a', 1.2); text(g, t, 120, 172.6, 9, '#f1dc9a', 'Arial', 'center', '900'); g.restore(); }

/* ---------- Art: the real DOG data and images bundled by tools/build-pack.mjs (window.DOGARMY_ART) ----------
   Nothing here is invented: a value comes from data.json with its status, or the tile falls back to a labelled type tile. */
const ART = window.DOGARMY_ART || {}, DATA = ART.data || {}, FILES = ART.files || {};
const asArr = x => Array.isArray(x) ? x : [];
const img = {}, logoSrc = { alex: 'type tile (official file not bundled)', dog: 'type tile (official file pending)' };
const RS = [];          // Runestone inscriptions whose thumbnails loaded: { id, number, im }
const TRANSFERS = asArr(DATA.transfers).filter(t => t && t.amount != null && t.block != null);
const MILES = asArr(DATA.milestones).filter(m => m && m.label && m.value != null);
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async'; const timer = setTimeout(() => { im.src = ''; rej(Error('timeout')); }, ms); im.onload = () => { clearTimeout(timer); res(im); }; im.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; im.src = url; }); }
// A value from data.json with its status; the brief's own figure (labelled brief-only) when the file has none.
function field(obj, key, fallback) { if (obj && obj[key] != null && obj[key] !== '') return { v: obj[key], st: obj.status || 'unconfirmed' }; return { v: fallback, st: 'brief-only' }; }
const DATA_ST = () => ({
  halving: field(DATA.halving, 'height', 840000), rune: field(DATA.rune, 'number', 3), name: field(DATA.rune, 'spacedName', 'DOG•GO•TO•THE•MOON'),
  per: field(DATA.runestone, 'perHolderDOG', 889806), snapshot: DATA.snapshot && DATA.snapshot.status === 'verified' && DATA.snapshot.height != null ? { v: DATA.snapshot.height, st: 'verified' } : null
});
const TIER = { cherry: '#c3bb9f', lemon: '#dcd6c2', chip: '#d1ae52', block: '#e7e5e4', artifact: '#e2c06a', bitcoin: '#fff1c0', wild: '#c4503b', scatter: '#a9b46f', vault: '#c9cbcc', chain: '#d9c28a' };
const LABEL = { cherry: 'HALVING BLOCK', lemon: 'RUNE #3', chip: '889,806 DOG', block: 'DOG ON STACKS', artifact: 'RUNESTONE', bitcoin: '$DOG', wild: 'LEONIDAS · WILD', scatter: 'SNAPSHOT', vault: 'DOG TAG', chain: 'MARCH' };
function newTile() { const c = canvas(480, 480), g = c.getContext('2d'); g.scale(2, 2); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; return [c, g]; }
// The tile plate: black parade-ground steel with a khaki-brass border, canvas weave and rivets.
function tileFrame(g, sym) {
  const edge = TIER[sym], hi = sym === 'bitcoin';
  g.save(); g.shadowColor = edge; g.shadowBlur = hi ? 24 : 9; round(g, 14, 6, 212, 212, 24, rad(g, 120, 90, 10, 170, hi ? ['#3a3322', '#12100b'] : sym === 'wild' ? ['#3a1a14', '#120807'] : ['#2c2a22', '#12110d']), edge, hi ? 8 : 4); g.restore();
  g.save(); g.beginPath(); g.roundRect(14, 6, 212, 212, 24); g.clip(); g.strokeStyle = '#ffffff0a'; g.lineWidth = 1; for (let i = -240; i < 240; i += 7) { g.beginPath(); g.moveTo(i, 6); g.lineTo(i + 212, 218); g.stroke(); g.beginPath(); g.moveTo(i + 212, 6); g.lineTo(i, 218); g.stroke(); } g.restore();
  round(g, 22, 14, 196, 196, 18, null, edge + '66', 1.5);
  g.fillStyle = edge; for (const [x, y] of [[29, 21], [211, 21], [29, 203], [211, 203]]) { g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); g.beginPath(); g.arc(x + .6, y + .7, .9, 0, 7); g.fillStyle = '#0006'; g.fill(); g.fillStyle = edge; }
}
function tileLabel(g, s, color = '#f4efe0', bg = '#080706dd') { round(g, 34, 180, 172, 28, 14, bg); fitText(g, s, 120, 195, 17, 156, color, '900', HEAD); }
const TILE = {
  cherry() {
    const [c, g] = newTile(), h = DATA_ST().halving, hz = DATA.halving && DATA.halving.hash; tileFrame(g, 'cherry');
    spaced(g, 'BITCOIN HALVING', 120, 27, 10.5, 1.6, '#cfc7a6', '800'); cube(g, 120, 62, 29);
    g.save(); g.shadowColor = '#000'; g.shadowBlur = 6; fitText(g, num(h.v), 120, 118, 50, 176, '#f4efe0', '900', HEAD); g.restore();
    if (hz) text(g, hz.length > 18 ? hz.slice(0, 8) + '…' + hz.slice(-8) : hz, 120, 145, 10.5, '#bdb590', MONO, 'center', '700'); else text(g, 'RUNES LAUNCH HERE', 120, 145, 12, '#bdb590', 'Arial', 'center', '800');
    const t = DATA.halving && DATA.halving.time; if (t) { const d = new Date(t); if (!isNaN(d)) text(g, d.toUTCString().slice(5, 16).toUpperCase(), 120, 160, 10.5, '#8d876c', 'Arial', 'center', '800'); }
    stamp(g, h.st); tileLabel(g, LABEL.cherry); return c; },
  lemon() {
    const [c, g] = newTile(), d = DATA_ST(), sym = DATA.rune && DATA.rune.symbol; tileFrame(g, 'lemon');
    spaced(g, 'RUNE', 120, 27, 12, 3, '#cfc7a6', '800'); g.save(); g.shadowColor = '#000'; g.shadowBlur = 6; fitText(g, '#' + d.rune.v, 120, 76, 74, 120, '#f4efe0', '900', HEAD); g.restore();
    const parts = String(d.name.v).split('•'), half = Math.ceil(parts.length / 2), l1 = parts.slice(0, half).join('•'), l2 = parts.slice(half).join('•');
    fitText(g, l1, 120, 118, 21, 176, BRASS, '900', HEAD); fitText(g, l2, 120, 142, 21, 176, BRASS, '900', HEAD);
    if (sym) { g.beginPath(); g.arc(194, 40, 15, 0, 7); g.fillStyle = '#0b0a07'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#dcd6c2'; g.stroke(); text(g, sym, 194, 41, 17, '#f4efe0', 'Arial', 'center', '700'); }
    stamp(g, d.rune.st === 'verified' && d.name.st === 'verified' ? 'verified' : (d.rune.st === 'verified' ? d.name.st : d.rune.st)); tileLabel(g, LABEL.lemon); return c; },
  chip() {
    const [c, g] = newTile(), d = DATA_ST(), rec = DATA.runestone && DATA.runestone.recipients; tileFrame(g, 'chip');
    spaced(g, 'EACH RUNESTONE GOT', 120, 27, 10, 1.4, '#cfc7a6', '800'); g.save(); g.shadowColor = '#000'; g.shadowBlur = 6; fitText(g, num(d.per.v), 120, 68, 46, 178, BRASS, '900', HEAD); g.restore();
    fitText(g, 'DOG', 120, 106, 36, 120, '#f4efe0', '900', HEAD);
    for (let i = 0; i < 3; i++) { const y = 146 - i * 7; g.beginPath(); g.ellipse(120, y, 30, 8, 0, 0, 7); g.fillStyle = lin(g, 0, y - 8, 0, y + 8, ['#f2d98a', '#b8923a']); g.fill(); g.lineWidth = 1.5; g.strokeStyle = '#3b2c0a'; g.stroke(); }
    if (rec) text(g, `${num(rec)} RUNESTONES`, 120, 128, 10, '#8d876c', 'Arial', 'center', '800');
    stamp(g, d.per.st); tileLabel(g, LABEL.chip); return c; },
  block() {
    const [c, g] = newTile(); tileFrame(g, 'block');
    if (img.alex) { g.save(); g.beginPath(); g.roundRect(46, 22, 148, 148, 26); g.clip(); const k = Math.min(148 / img.alex.width, 148 / img.alex.height); g.fillStyle = '#f4f2ee'; g.fillRect(46, 22, 148, 148); g.drawImage(img.alex, 120 - img.alex.width * k / 2, 96 - img.alex.height * k / 2, img.alex.width * k, img.alex.height * k); g.restore(); round(g, 46, 22, 148, 148, 26, null, '#e7e5e4', 3); }
    else { round(g, 46, 28, 148, 126, 18, lin(g, 0, 28, 0, 154, ['#f6f4f0', '#cfcac2']), '#ffffff', 3); fitText(g, 'DOG', 120, 76, 56, 128, INK, '900', HEAD); fitText(g, 'ON STACKS', 120, 110, 22, 126, '#3a352c', '900', HEAD); text(g, 'ALEX · runes-dog', 120, 134, 10, '#5a5346', 'Arial', 'center', '800'); }
    tileLabel(g, LABEL.block); return c; },
  artifact(f) {
    const [c, g] = newTile(), r = f >= 0 ? RS[f] : null; tileFrame(g, 'artifact');
    if (r) { g.save(); g.beginPath(); g.roundRect(22, 14, 196, 196, 18); g.clip(); g.fillStyle = '#0b0a07'; g.fillRect(22, 14, 196, 196); const k = Math.max(196 / r.im.width, 196 / r.im.height); g.drawImage(r.im, 120 - r.im.width * k / 2, 112 - r.im.height * k / 2, r.im.width * k, r.im.height * k); g.restore(); round(g, 22, 14, 196, 196, 18, null, TIER.artifact, 3); round(g, 30, 20, 78, 18, 9, '#080706cc'); text(g, 'RUNESTONE', 69, 29.5, 10, '#f1dc9a', 'Arial', 'center', '900'); tileLabel(g, `#${r.number != null ? r.number : String(r.id).slice(0, 8)}`, '#f1dc9a'); }
    else { // a carved tablet when no thumbnail is bundled
      round(g, 52, 28, 136, 130, 14, lin(g, 0, 28, 0, 158, ['#8d887a', '#5b574c']), '#cfc9b6', 3); g.strokeStyle = '#2a2820'; g.lineWidth = 3; g.lineCap = 'round'; for (const [x, y] of [[78, 52], [100, 52], [122, 52], [144, 52], [166, 52]]) { g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 8, y); g.lineTo(x, y + 8); g.moveTo(x + 8, y - 8); g.lineTo(x + 8, y + 8); g.stroke(); }
      fitText(g, 'RUNESTONE', 120, 98, 24, 118, '#1c1a14', '900', HEAD); text(g, 'ORDINALS INSCRIPTION', 120, 122, 9.5, '#25231b', 'Arial', 'center', '800'); text(g, 'ART PENDING', 120, 140, 10, '#25231b', 'Arial', 'center', '900'); tileLabel(g, LABEL.artifact); }
    return c; },
  bitcoin() {
    const [c, g] = newTile(), black = img.dogBlack, white = img.dogWhite; tileFrame(g, 'bitcoin');
    g.save(); g.shadowColor = '#fff3c8'; g.shadowBlur = 26; g.beginPath(); g.arc(120, 96, 80, 0, 7); g.fillStyle = '#fff3c855'; g.fill(); g.restore();
    if (black || white) {
      const dark = !black; moonDisc(g, 120, 96, 72, dark ? { stops: ['#3b3a33', '#1d1c17', '#0b0a07'], maria: .3, glowColor: '#fff3c8' } : {});
      const lg = black || white, k = Math.min(104 / lg.width, 104 / lg.height); g.drawImage(lg, 120 - lg.width * k / 2, 96 - lg.height * k / 2, lg.width * k, lg.height * k);
    } else { moonDisc(g, 120, 96, 72); g.save(); g.shadowColor = '#0004'; g.shadowBlur = 4; fitText(g, '$DOG', 120, 98, 44, 108, '#1c1a14', '900', 'Arial Black, Arial'); g.restore(); }
    tileLabel(g, LABEL.bitcoin, INK, BRASS); return c; },
  wild() {
    const [c, g] = newTile(), pfp = img.leonidas; tileFrame(g, 'wild');
    if (pfp) { // Leonidas's own PFP, supplied by Jim: a circle with a red-hot ring
      g.save(); g.shadowColor = '#ff3b2a'; g.shadowBlur = 22; g.beginPath(); g.arc(120, 98, 79, 0, 7); g.fillStyle = '#000'; g.fill(); g.restore();
      g.save(); g.beginPath(); g.arc(120, 98, 76, 0, 7); g.clip(); g.drawImage(pfp, 44, 22, 152, 152); g.restore();
      g.save(); g.lineWidth = 4; g.strokeStyle = lin(g, 0, 20, 0, 176, ['#ffd7cf', '#e0624a', '#8f2a1d']); g.beginPath(); g.arc(120, 98, 77.5, 0, 7); g.stroke(); g.restore();
    } else { g.save(); g.shadowColor = '#e0624a'; g.shadowBlur = 16; spartanHelmet(g, 120, 100, .88); g.restore(); }
    round(g, 30, 20, 56, 18, 9, '#080706dd', '#e0624a', 1.5); text(g, 'WILD', 58, 29.5, 11, '#f6c8bd', 'Arial', 'center', '900');
    tileLabel(g, LABEL.wild, '#fbe3dc'); return c; },
  scatter() {
    const [c, g] = newTile(), snap = DATA_ST().snapshot; tileFrame(g, 'scatter');
    g.save(); g.beginPath(); g.roundRect(22, 14, 196, 196, 18); g.clip(); g.fillStyle = lin(g, 0, 14, 0, 210, ['#2d3326', '#161812']); g.fillRect(22, 14, 196, 196); for (const [x, y] of [[52, 40], [190, 56], [70, 120], [196, 130], [140, 30]]) { g.beginPath(); g.arc(x, y, 1.2, 0, 7); g.fillStyle = '#ffffff55'; g.fill(); } g.restore();
    // the crate face carries the snapshot: the block number only when it is verified, never a guess
    chute(g, 120, 116, 1, 0, { rx: 62, ry: 34, len: 44, cw: 104, ch: 54, face: (g2, w) => {
      if (snap) { fitText(g2, 'SNAPSHOT', 0, -11, 20, w, '#efe9cc', '900', HEAD); fitText(g2, num(snap.v), 0, 12, 26, w, BRASS, '900', HEAD); }
      else { fitText(g2, 'SNAPSHOT', 0, -12, 20, w, '#efe9cc', '900', HEAD); fitText(g2, 'BLOCK TO CONFIRM', 0, 11, 11, w, '#f1dc9a', '900', 'Arial'); } } });
    stamp(g, snap ? snap.st : 'unconfirmed'); tileLabel(g, LABEL.scatter); return c; },
  vault(f) {
    const [c, g] = newTile(), m = f >= 0 ? MILES[f] : null; tileFrame(g, 'vault');
    ballChain(g, 120, 22, 120, 36, 3, 2.3); dogTag(g, 54, 36, 132, 124, { r: 22, glow: '#c9cbcc', blur: 10 });
    g.fillStyle = '#2a2d2f'; g.textBaseline = 'middle';
    if (m) { spaced(g, 'DOG ARMY', 120, 58, 9.5, 2, '#34383a', '900'); g.save(); g.shadowColor = '#fff8'; g.shadowOffsetY = 1; fitText(g, String(m.value), 120, 86, 30, 110, '#1b1d1e', '900', HEAD); g.restore(); g.font = '800 10.5px Arial'; const ls = wrap(g, String(m.label).toUpperCase(), 108, 3); ls.forEach((l, i) => text(g, l, 120, 108 + i * 12, 10.5, '#2f3335', 'Arial', 'center', '800')); stamp(g, m.status); }
    else { spaced(g, 'DOG ARMY', 120, 62, 11, 2.4, '#34383a', '900'); fitText(g, 'RUNE #3', 120, 92, 26, 100, '#1b1d1e', '900', HEAD); text(g, 'MILESTONE TO CONFIRM', 120, 120, 9.5, '#2f3335', 'Arial', 'center', '900'); text(g, 'NO·TEAM·NO·PRESALE', 120, 136, 9, '#4a4f52', 'Arial', 'center', '800'); }
    tileLabel(g, LABEL.vault); return c; },
  chain(f) {
    const [c, g] = newTile(), t = f >= 0 ? TRANSFERS[f] : null; tileFrame(g, 'chain');
    g.save(); g.beginPath(); g.roundRect(22, 14, 196, 196, 18); g.clip(); g.fillStyle = lin(g, 0, 14, 0, 210, ['#35311f', '#171510']); g.fillRect(22, 14, 196, 196); g.restore();
    chevrons(g, 66, 54, 40, 3, '#d9c28a', 5); spaced(g, 'DOG TRANSFER', 146, 40, 10, 1.2, '#cfc7a6', '800'); spaced(g, 'MARCHES ON', 146, 56, 10, 1.2, '#8d876c', '800');
    if (t) { g.save(); g.shadowColor = '#000'; g.shadowBlur = 5; fitText(g, num(t.amount), 120, 104, 38, 176, '#f4efe0', '900', HEAD); g.restore(); fitText(g, 'DOG', 120, 130, 22, 100, BRASS, '900', HEAD); text(g, `BLOCK ${num(t.block)}`, 120, 150, 12, '#cfc7a6', 'Arial', 'center', '900'); if (t.from && t.to) text(g, `${shortAddr(t.from)} → ${shortAddr(t.to)}`, 120, 164, 8.5, '#8d876c', MONO, 'center', '700'); stamp(g, t.status); }
    else { fitText(g, 'MARCH', 120, 104, 42, 150, '#f4efe0', '900', HEAD); text(g, 'A REAL DOG TRANSFER', 120, 130, 11, BRASS, 'Arial', 'center', '900'); text(g, 'TRANSFER DATA PENDING', 120, 150, 10, '#8d876c', 'Arial', 'center', '800'); }
    tileLabel(g, LABEL.chain); return c; }
};
// Face indexes are cosmetic and chosen with Math.random after the result is fixed, never with the engine's rng.
const FACED = { artifact: () => RS.length, chain: () => TRANSFERS.length, vault: () => MILES.length };
const pickFace = s => FACED[s] && FACED[s]() ? Math.floor(Math.random() * FACED[s]()) : -1;
const tileCache = new Map();
let artReady = false;
function tileFor(s, f = -1) { if (!FACED[s]) f = -1; else if (f >= FACED[s]()) f = -1; const key = s + ':' + f; let t = tileCache.get(key); if (!t) { t = TILE[s](f); tileCache.set(key, t); } return t; }
const iconURL = {};
const icon = s => iconURL[s] || (iconURL[s] = artReady ? tileFor(s, FACED[s] && FACED[s]() ? 0 : -1).toDataURL() : '');
async function buildArt() {
  const paths = { alex: DATA.stacks && DATA.stacks.alex && DATA.stacks.alex.image, dogBlack: DATA.logos && DATA.logos.dogBlack, dogWhite: DATA.logos && DATA.logos.dogWhite };
  try { if (FILES['img/supplied/leonidas-pfp.jpg']) img.leonidas = await loadImage(FILES['img/supplied/leonidas-pfp.jpg'], 8000); } catch (e) {}
  await Promise.all(Object.entries(paths).map(async ([k, p]) => { if (p && FILES[p]) { try { img[k] = await loadImage(FILES[p], 8000); logoSrc[k === 'alex' ? 'alex' : 'dog'] = 'bundled: ' + p; } catch (e) {} } }));
  await Promise.all(asArr(DATA.runestones).map(async r => { const p = r && r.img; if (p && FILES[p]) { try { RS.push({ id: r.inscriptionId, number: r.number, im: await loadImage(FILES[p], 8000) }); } catch (e) {} } }));
  RS.sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0));
  tileCache.clear(); artReady = true; for (const k of Object.keys(iconURL)) delete iconURL[k];
  faces = state.grid.map(col => col.map(s => pickFace(s))); screenDirty = true; update();
}
// The ALEX runes-dog token's own image, read live from its metadata through xtrata.xyz's Hiro proxy, only if no bundled file exists.
// Drawn only if the host serves it with CORS (so the screen canvas stays clean); otherwise the type tile stays.
const SRC = { origin: 'https://xtrata.xyz', alex: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.runes-dog', pontis: 'SP14NS8MVBRHXMM96BQY0727AJ59SWPV7RMHC0NCG.pontis-bridge-DOG', hiro: 'https://api.hiro.so' };
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
async function loadLiveLogos() {
  if (img.alex) return;
  try {
    const meta = await getJSON(`${SRC.origin}/hiro/mainnet/metadata/v1/ft/${SRC.alex}`, 1);
    for (const url of [meta.image_canonical_uri, meta.image_uri, meta.metadata && meta.metadata.image].filter(Boolean)) {
      try { const im = await loadImage(url, 12000); const t = canvas(8, 8).getContext('2d'); t.drawImage(im, 0, 0, 8, 8); t.getImageData(0, 0, 1, 1); img.alex = im; logoSrc.alex = url + ' (live, from the runes-dog metadata)'; tileCache.delete('block:-1'); delete iconURL.block; screenDirty = true; return; } catch (e) {}
    }
  } catch (e) {}
}
