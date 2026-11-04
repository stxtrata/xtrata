// Genesis 21 cabinet: builds the packed model JSON in the format of the ParallaX Casino packs.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'cab/out'); fs.mkdirSync(OUT, { recursive: true });
const WEBP_Q = Number(process.env.G21_WEBP_Q || 90); // cabinet textures are WebP (lossy, alpha kept) to keep the pack small
const LINEAR = process.env.G21_LINEAR === '1'; // pre-darken textures if the room samples them as linear

// ---------- palette ----------
const C = { purple: 0x5546ff, deep: 0x2a1f7a, ink: 0x14102e, cream: 0xf3ead6, lav: 0xb9adff, gold: 0xf0b429, chrome: 0xdfe3ee, glow: 0x8d83ff };
const css = n => '#' + n.toString(16).padStart(6, '0');

// ---------- model store ----------
const geometries = [], materials = [], textures = [], geoKey = new Map(), matKey = new Map();
const r3 = v => Math.round(v * 1000) / 1000;
function addGeo(geo, key) {
  if (key && geoKey.has(key)) return geoKey.get(key);
  const attrs = {};
  for (const name of ['position', 'normal', 'uv']) { const a = geo.attributes[name]; if (a) attrs[name] = { size: a.itemSize, array: Array.from(a.array, r3) }; }
  const index = geo.index ? Array.from(geo.index.array) : null;
  geometries.push({ attributes: attrs, index, groups: [] });
  const id = geometries.length - 1; if (key) geoKey.set(key, id); return id;
}
function addTexture(canvas) {
  let c = canvas;
  if (LINEAR) { c = createCanvas(canvas.width, canvas.height); const g = c.getContext('2d'); g.drawImage(canvas, 0, 0); const d = g.getImageData(0, 0, c.width, c.height), a = d.data; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) a[i + k] = Math.round(255 * Math.pow(a[i + k] / 255, 2.2)); g.putImageData(d, 0, 0); }
  textures.push({ image: 'data:image/webp;base64,' + c.toBuffer('image/webp', WEBP_Q).toString('base64'), wrapS: 1001, wrapT: 1001, repeat: [1, 1], offset: [0, 0], flipY: true });
  return textures.length - 1;
}
function mat(o) {
  const m = { type: 'standard', color: 0xffffff, roughness: .5, metalness: 0, transparent: false, opacity: 1, side: 0, depthWrite: true, alphaTest: 0, flatShading: false, map: null, emissive: 0, emissiveIntensity: 1, ...o };
  if (m.type === 'basic') delete m.flatShading;
  const k = JSON.stringify(m); if (matKey.has(k)) return matKey.get(k);
  materials.push(m); const id = materials.length - 1; matKey.set(k, id); return id;
}
const quat = (rx = 0, ry = 0, rz = 0) => { const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz, 'XYZ')); return [r3(q.x * 1000) / 1000, r3(q.y * 1000) / 1000, r3(q.z * 1000) / 1000, r3(q.w * 1000) / 1000].map(v => Math.round(v * 100000) / 100000); };
function node(o = {}) {
  const n = { p: (o.p || [0, 0, 0]).map(r3), q: o.rot ? quat(...o.rot) : [0, 0, 0, 1], s: o.s || [1, 1, 1], visible: true, role: o.role || '', children: o.children || [] };
  if (o.action) n.action = o.action;
  if (o.g != null) { n.g = o.g; n.m = o.m; }
  return n;
}
const add = (parent, n) => { parent.children.push(n); return n; };
const rbox = (w, h, d, r = .06, seg = 3) => addGeo(new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)), `rb${w}|${h}|${d}|${r}|${seg}`);
const box = (w, h, d) => addGeo(new THREE.BoxGeometry(w, h, d), `b${w}|${h}|${d}`);
const cyl = (rt, rb, h, seg = 36) => addGeo(new THREE.CylinderGeometry(rt, rb, h, seg), `c${rt}|${rb}|${h}|${seg}`);
const plane = (w, h) => addGeo(new THREE.PlaneGeometry(w, h), `p${w}|${h}`);
const sphere = (r, seg = 28) => addGeo(new THREE.SphereGeometry(r, seg, seg / 2), `s${r}|${seg}`);
const torus = (R, t) => addGeo(new THREE.TorusGeometry(R, t, 12, 36), `t${R}|${t}`);
const circle = r => addGeo(new THREE.CircleGeometry(r, 48), `ci${r}`);

// ---------- drawing helpers ----------
const FONT = 'Poppins', SERIF = 'DejaVu Serif';
function cv(w, h) { const c = createCanvas(w, h); return [c, c.getContext('2d')]; }
function rr(g, x, y, w, h, r, fill, stroke, lw = 2) { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw; g.strokeStyle = stroke; g.stroke(); } }
function tx(g, s, x, y, size, color, weight = '700', align = 'center', font = FONT) { g.font = `${weight} ${size}px "${font}"`; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); }
function spaced(g, s, x, y, size, gap, color, weight = '600', font = FONT) { g.font = `${weight} ${size}px "${font}"`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function grad(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
// Xtrata mark: the vector trace used in every machine (no image data).
const XLOGO = (() => { const M = 851, mirror = pts => pts.map(([x, y]) => [M - x, y]); const outer = [[31, 244], [229, 244], [405, 439], [227, 634], [31, 634], [100, 559], [196, 559], [304, 438], [197, 320], [100, 320]]; const inner = [[120, 320], [197, 320], [304, 438], [196, 559], [120, 559], [221, 439]]; return { white: [[[24, 70], [290, 70], [425.5, 218], [561, 70], [827, 70], [827, 186], [606, 186], [425.5, 382], [245, 186], [24, 186]]], whiteOpen: [[[24, 112], [273, 112], [425.5, 276], [578, 112], [827, 112]]], blue: [outer, inner, mirror(outer), mirror(inner)], orange: [[[24, 691], [250, 691], [425.5, 500], [601, 691], [827, 691], [827, 784], [563, 784], [425.5, 635], [288, 784], [24, 784]]], depth: [[[38, 192], [68, 238]], [[813, 192], [783, 238]], [[38, 683], [68, 640]], [[813, 683], [783, 640]]] }; })();
function xtrataLogo(g, cx, cy, size) {
  const s = size / 851; g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(s, s); g.lineJoin = 'miter'; g.miterLimit = 6; g.lineCap = 'butt';
  const path = (pts, closed) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (closed) g.closePath(); };
  const metal = (c1, c2, c3, y0, y1) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c1); gr.addColorStop(.5, c2); gr.addColorStop(1, c3); return gr; };
  g.lineWidth = 6; g.strokeStyle = '#2b4a78aa'; XLOGO.depth.forEach(p => { path(p); g.stroke(); });
  const layers = [['blue', metal('#6593cf', '#4675b6', '#315c95', 240, 640)], ['orange', metal('#f2aa5a', '#e28c3b', '#c9762c', 495, 790)], ['white', metal('#ffffff', '#e2e3e1', '#b9bbb8', 64, 392)]];
  for (const [k, stroke] of layers) { g.shadowColor = '#000c'; g.shadowBlur = 10; g.shadowOffsetY = 5; g.lineWidth = 13; g.strokeStyle = stroke; XLOGO[k].forEach(p => { path(p, true); g.stroke(); }); if (k === 'white') XLOGO.whiteOpen.forEach(p => { path(p); g.stroke(); }); g.shadowColor = 'transparent'; g.lineWidth = 2; g.strokeStyle = '#ffffff33'; XLOGO[k].forEach(p => { path(p, true); g.stroke(); }); }
  g.restore();
}
// small blocky "chain" motif: a row of linked blocks
function blocks(g, x, y, n, size, color, gap = 8) { for (let i = 0; i < n; i++) { rr(g, x + i * (size + gap), y, size, size, size * .22, null, color, Math.max(2, size * .12)); if (i) { g.fillStyle = color; g.fillRect(x + i * (size + gap) - gap, y + size / 2 - 2, gap, 4); } } }
const XMARK = await loadImage(fs.readFileSync(path.join(ROOT, 'brand/xtrata-logo.svg')));
const CH = JSON.parse(fs.readFileSync(path.join(ROOT, 'chain/chain.json'), 'utf8'));

// ---------- textures ----------
const T = {};
{ // marquee
  const [c, g] = cv(1800, 340);
  g.fillStyle = grad(g, 0, 0, 0, 340, ['#3a2db8', '#1d1560', '#140e44']); g.fillRect(0, 0, 1800, 340);
  g.fillStyle = '#ffffff10'; for (let x = 0; x < 1800; x += 90) g.fillRect(x, 0, 2, 340);
  g.save(); g.shadowColor = '#8d83ff'; g.shadowBlur = 36; spaced(g, 'GENESIS', 640, 150, 148, 22, '#fff4d8', '700'); g.restore();
  g.save(); g.shadowColor = '#f0b429'; g.shadowBlur = 40; tx(g, '21', 1370, 150, 210, '#f6c453', '800'); g.restore();
  spaced(g, 'THE FIRST NFTs ON STACKS  ·  MAINNET  ·  JANUARY 2021', 900, 282, 34, 10, '#cfc8ff', '600');
  blocks(g, 60, 120, 3, 56, '#8d83ff', 12); blocks(g, 1800 - 60 - 3 * 68 + 12, 120, 3, 56, '#8d83ff', 12);
  g.strokeStyle = '#f0b429'; g.lineWidth = 6; g.strokeRect(10, 10, 1780, 320); T.marquee = addTexture(c); c.toBuffer('image/png'); fs.writeFileSync(path.join(OUT, 'marquee.png'), c.toBuffer('image/png'));
}
{ // door
  const [c, g] = cv(1450, 480);
  g.fillStyle = grad(g, 0, 0, 0, 480, ['#f6eed9', '#e7dcc0']); g.fillRect(0, 0, 1450, 480);
  g.strokeStyle = '#5546ff'; g.lineWidth = 8; g.strokeRect(14, 14, 1422, 452);
  g.strokeStyle = '#5546ff55'; g.lineWidth = 2; g.strokeRect(30, 30, 1390, 420);
  g.drawImage(XMARK, 400 - 145, 130 - 145, 290, 290); // the brand SVG exactly as supplied, drawn square at its own aspect
  spaced(g, 'WHERE BITCOIN', 960, 100, 56, 7, '#2a1f7a', '800'); spaced(g, 'NFTs ON STACKS BEGAN', 960, 168, 56, 7, '#2a1f7a', '800');
  g.fillStyle = '#5546ff'; g.fillRect(600, 222, 720, 5);
  spaced(g, 'BLOCK 1  ·  14 JAN 2021  ·  STACKS 2.0 MAINNET', 960, 270, 24, 5, '#5546ff', '700');
  spaced(g, 'XTRATA ARCADE  /  GENESIS 21', 640, 345, 24, 6, '#7a6e57', '600');
  T.door = addTexture(c); fs.writeFileSync(path.join(OUT, 'door.png'), c.toBuffer('image/png'));
}
{ // screen splash (replaced by the live canvas in the room)
  const [c, g] = cv(700, 480);
  g.fillStyle = grad(g, 0, 0, 0, 480, ['#2b1f8f', '#150f47']); g.fillRect(0, 0, 700, 480);
  g.save(); g.shadowColor = '#8d83ff'; g.shadowBlur = 20; spaced(g, 'GENESIS', 350, 190, 84, 12, '#fff4d8', '700'); g.restore();
  tx(g, '21', 350, 290, 120, '#f6c453', '800'); spaced(g, 'JANUARY 2021', 350, 390, 24, 8, '#cfc8ff', '600');
  T.splash = addTexture(c);
}
{ // date stamp
  const [c, g] = cv(300, 64); rr(g, 2, 2, 296, 60, 14, '#5546ff'); spaced(g, 'JAN 2021', 150, 33, 30, 6, '#f3ead6', '700'); T.stamp = addTexture(c);
}
{ // ticket
  const [c, g] = cv(300, 220); g.fillStyle = '#f3ead6'; g.fillRect(0, 0, 300, 220); g.fillStyle = '#5546ff'; g.fillRect(0, 0, 300, 52); tx(g, 'GENESIS 21', 150, 27, 30, '#f3ead6', '800');
  tx(g, 'SOUVENIR · BLOCK #1', 150, 82, 17, '#2a1f7a', '700'); tx(g, 'THIS IS #1', 150, 124, 34, '#2a1f7a', '800', 'center', SERIF);
  g.fillStyle = '#2a1f7a'; for (let x = 20, i = 0; x < 280; i++) { const w = [3, 2, 5, 2, 3][i % 5]; g.fillRect(x, 160, w, 40); x += w + 4; }
  g.fillStyle = '#c9bd9c'; for (let x = 6; x < 300; x += 14) { g.beginPath(); g.arc(x, 216, 4, 0, 7); g.fill(); } T.ticket = addTexture(c);
}
{ // trophy badge
  const [c, g] = cv(512, 512);
  g.fillStyle = grad(g, 0, 0, 512, 512, ['#ffe08a', '#e9a717', '#b87b08']); g.beginPath(); g.arc(256, 256, 256, 0, 7); g.fill();
  g.lineWidth = 14; g.strokeStyle = '#7a4f00'; g.beginPath(); g.arc(256, 256, 236, 0, 7); g.stroke();
  g.shadowColor = '#fff3'; g.shadowBlur = 8; tx(g, '#1', 256, 262, 270, '#3a2400', '900'); T.badge = addTexture(c);
}
{ // coin plate label
  const [c, g] = cv(256, 96); rr(g, 2, 2, 252, 92, 16, '#14102e'); spaced(g, 'LAYR', 128, 34, 32, 8, '#f6c453', '800'); spaced(g, 'COIN IN', 128, 70, 20, 6, '#cfc8ff', '600'); T.coin = addTexture(c);
}
// deck button labels
const BTN = {
  pays: { t: 'ROADMAP', bg: '#f3ead6', ink: '#2a1f7a', fs: 44 }, betDown: { t: '−STX', bg: '#f3ead6', ink: '#2a1f7a', fs: 60 }, betUp: { t: '+STX', bg: '#f3ead6', ink: '#2a1f7a', fs: 60 },
  auto: { t: 'AUTO-STACK', bg: '#b9adff', ink: '#14102e', fs: 40 }, spin: { t: 'MINT', bg: '#f0b429', ink: '#2a1f00', fs: 84 },
};
for (const [k, b] of Object.entries(BTN)) { const [c, g] = cv(400, 160); g.fillStyle = b.bg; g.fillRect(0, 0, 400, 160); g.strokeStyle = b.ink + '33'; g.lineWidth = 6; g.strokeRect(5, 5, 390, 150); tx(g, b.t, 200, 84, b.fs, b.ink, '800'); b.tex = addTexture(c); }

// side panels: top = two rows of framed twins, below = the nine collection names (lit when a helper has twins)
const reg = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'art/twins/manifest.json'), 'utf8')); } catch { return {}; } })();
const NINE = [['Arties', false], ['SatoSHE', false], ['Satoshibles', false], ['Stacks Punks', false], ['Bitcoin Birds', true], ['This Is #1', false], ['Megapont Ape Club', true], ['Bitcoin Monkeys', true], ['Boomboxes', false]];
async function sidePanel(imgs) {
  const W = 560, H = 1700, [c, g] = cv(W, H);
  g.fillStyle = grad(g, 0, 0, 0, H, ['#4a3bdb', '#3a2db8']); g.fillRect(0, 0, W, H);
  g.fillStyle = '#ffffff12'; for (let y = 0; y < H; y += 56) g.fillRect(0, y, W, 2);
  // frames: 2 rows x 3
  const fw = 150, gap = 20, x0 = (W - (3 * fw + 2 * gap)) / 2;
  for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) {
    const i = r * 3 + k, x = x0 + k * (fw + gap), y = 40 + r * (fw + 52);
    rr(g, x - 10, y - 10, fw + 20, fw + 44, 10, '#f3ead6', '#b8a979', 3); g.fillStyle = '#14102e'; g.fillRect(x, y, fw, fw);
    const im = imgs[i]; if (im) { const s = Math.min(fw / im.img.width, fw / im.img.height), w = im.img.width * s, h = im.img.height * s; g.imageSmoothingEnabled = im.img.width > 100; g.drawImage(im.img, x + (fw - w) / 2, y + (fw - h) / 2, w, h); tx(g, '#' + im.tokenId, x + fw / 2, y + fw + 15, 19, '#2a1f7a', '700'); }
  }
  tx(g, 'HALL OF TWINS', W / 2, 395, 26, '#f3ead6', '700'); g.fillStyle = '#f6c453'; g.fillRect(W / 2 - 60, 418, 120, 4);
  // nine names
  const y0 = 470, rh = 134;
  NINE.forEach(([name, lit], i) => {
    const y = y0 + i * rh;
    rr(g, 34, y, W - 68, rh - 16, 16, lit ? '#f3ead6' : '#2a1f7a', lit ? '#f6c453' : '#6f63d6', lit ? 5 : 3);
    g.fillStyle = lit ? '#f6c453' : '#4f46a8'; g.beginPath(); g.arc(78, y + (rh - 16) / 2, 15, 0, 7); g.fill();
    if (lit) { g.shadowColor = '#f6c453'; g.shadowBlur = 22; g.beginPath(); g.arc(78, y + (rh - 16) / 2, 15, 0, 7); g.fill(); g.shadowBlur = 0; }
    tx(g, name.toUpperCase(), 112, y + (rh - 16) / 2 - 12, name.length > 14 ? 28 : 33, lit ? '#2a1f7a' : '#9d94e8', '800', 'left');
    tx(g, lit ? '∞  FOREVER TWINS LIVE' : 'NOT YET FOREVER', 112, y + (rh - 16) / 2 + 26, 19, lit ? '#5546ff' : '#7f75d6', '700', 'left');
  });
  return c;
}
async function loadTwinImgs(slug, n) { const out = []; const list = (reg.collections && reg.collections[slug] && reg.collections[slug].tokens) || []; for (const e of list.slice(0, n)) { try { out.push({ img: await loadImage(path.join(ROOT, 'art/twins', e.file)), tokenId: e.tokenId }); } catch (err) { console.log('img fail', e.file, err.message); } } return out; }
const birds = await loadTwinImgs('bitcoin-birds', 12), apes = await loadTwinImgs('megapont-ape-club', 6), monkeys = await loadTwinImgs('bitcoin-monkeys', 6);
const mix = (a, b) => [...a.slice(0, 3), ...b.slice(0, 3)];
T.sideL = addTexture(await sidePanel(mix(birds.slice(0, 3), monkeys)));
T.sideR = addTexture(await sidePanel(mix(birds.slice(3, 6), apes)));
console.log('side twins', birds.length, apes.length, monkeys.length);

// ---------- materials ----------
const M = {
  purple: mat({ color: C.purple, roughness: .38, metalness: .12 }), deep: mat({ color: C.deep, roughness: .45, metalness: .1 }), ink: mat({ color: C.ink, roughness: .5, metalness: .2 }),
  cream: mat({ color: C.cream, roughness: .42, metalness: .05 }), lav: mat({ color: C.lav, roughness: .35, metalness: .2 }), gold: mat({ color: C.gold, roughness: .22, metalness: .92 }),
  chrome: mat({ color: C.chrome, roughness: .1, metalness: .95 }), rubber: mat({ color: 0x0a0818, roughness: .8, metalness: .1 }),
  glowP: mat({ color: C.glow, roughness: .4, emissive: C.purple, emissiveIntensity: 1.6 }), glowG: mat({ color: 0xf6c453, roughness: .4, emissive: 0xf0b429, emissiveIntensity: 1.3 }),
  basic: t => mat({ type: 'basic', map: t, roughness: .4 }),
};

// ---------- cabinet ----------
const root = node();
const body = add(root, node({ p: [0, 0, 0] }));
add(body, node({ p: [0, .17, .02], g: rbox(3.34, .34, 1.4, .06), m: M.ink }));                   // plinth
add(body, node({ p: [0, 2.22, 0], g: rbox(3.2, 3.76, 1.26, .14, 4), m: M.purple }));              // main body
add(body, node({ p: [0, .93, .634], g: plane(2.92, .96), m: M.basic(T.door) }));                    // lower door print
add(body, node({ p: [0, .93, .628], g: rbox(3.0, 1.06, .02, .05), m: M.cream }));                   // door frame
add(body, node({ p: [0.9, .66, .648], g: rbox(.64, .1, .06, .03), m: M.rubber }));                  // ticket slot
add(body, node({ p: [0.9, .43, .668], g: plane(.5, .366), m: M.basic(T.ticket) }));                 // ticket tongue
add(body, node({ p: [-1.2, .7, .65], g: rbox(.4, .56, .05, .05), m: M.chrome }));                   // coin plate
add(body, node({ p: [-1.2, .74, .68], g: rbox(.22, .028, .02, .01), m: M.rubber }));                // coin slit
add(body, node({ p: [-1.2, .5, .68], g: plane(.34, .128), m: M.basic(T.coin) }));
// header/marquee and trim
add(body, node({ p: [0, 4.49, 0], g: rbox(3.24, .86, 1.18, .1, 4), m: M.deep }));
add(body, node({ p: [0, 4.49, .595], g: plane(3.04, .574), m: M.basic(T.marquee) }));
add(body, node({ p: [0, 4.08, 0], g: rbox(3.26, .05, 1.24, .02), m: M.glowP }));
add(body, node({ p: [0, 4.93, 0], g: rbox(3.26, .05, 1.2, .02), m: M.glowG }));
for (const sx of [-1, 1]) add(body, node({ p: [sx * 1.5, 2.22, .648], g: rbox(.05, 3.5, .03, .015), m: M.glowP }));
// screen bezel
add(body, node({ p: [0, 2.98, .64], g: rbox(2.74, 1.98, .2, .1, 4), m: M.cream }));
add(body, node({ p: [0, 2.98, .72], g: rbox(2.44, 1.7, .08, .05), m: M.rubber }));
const screen = add(body, node({ p: [0, 2.98, .765], role: 'screenMesh', g: plane(2.34, 1.6055), m: M.basic(T.splash) }));
add(body, node({ p: [.98, 2.07, .745], g: plane(.62, .132), m: M.basic(T.stamp) }));
// side panels
add(body, node({ p: [-1.604, 2.3, 0], rot: [0, -Math.PI / 2, 0], g: plane(1.12, 3.4), m: M.basic(T.sideL) }));
add(body, node({ p: [1.604, 2.3, 0], rot: [0, Math.PI / 2, 0], g: plane(1.12, 3.4), m: M.basic(T.sideR) }));
// deck
const deck = add(body, node({ p: [0, 1.66, .78], rot: [-.62, 0, 0] }));
add(deck, node({ g: rbox(3.04, .62, .16, .05), m: M.deep }));
add(deck, node({ p: [0, 0, .09], g: rbox(2.96, .54, .02, .03), m: M.ink }));
function button(key, x, w, action, role) {
  const b = BTN[key], capM = mat({ color: 0xffffff, roughness: .3, metalness: .15 });
  add(deck, node({ p: [x, -.02, .13], g: rbox(w, .26, .07, .03), m: M.chrome, action }));
  const cap = add(deck, node({ p: [x, -.02, .18], role: role || '', g: rbox(w - .03, .24, .065, .03), m: mat({ color: parseInt(b.bg.slice(1), 16), roughness: .3, metalness: .15 }), action }));
  add(deck, node({ p: [x, -.02, .216], g: plane(w - .06, (w - .06) * .4 > .2 ? .2 : (w - .06) * .4), m: M.basic(b.tex), action }));
}
button('pays', -1.12, .5, 'pays'); button('betDown', -.58, .46, 'betDown'); button('betUp', -.08, .46, 'betUp'); button('auto', .5, .6, 'auto'); button('spin', 1.14, .68, 'spin', 'spinPhysical');
// lever (right side): pivot housing + stem + chrome ball
add(body, node({ p: [1.69, 2.4, .12], rot: [0, 0, Math.PI / 2], g: cyl(.11, .11, .24), m: M.chrome }));
add(body, node({ p: [1.62, 2.4, .12], rot: [0, 0, Math.PI / 2], g: cyl(.15, .15, .06), m: M.deep }));
const lever = add(body, node({ p: [1.8, 2.4, .12], role: 'lever' }));
add(lever, node({ p: [0, .46, 0], g: cyl(.032, .032, .92, 20), m: M.chrome }));
add(lever, node({ p: [0, .98, 0], g: sphere(.115), m: M.chrome }));
add(lever, node({ p: [0, .06, 0], g: cyl(.065, .065, .1, 20), m: M.gold }));
// topper: lavender plinth + turning gold #1 trophy
add(body, node({ p: [0, 5.0, 0], g: cyl(.46, .58, .16, 48), m: M.lav }));
add(body, node({ p: [0, 5.1, 0], g: cyl(.4, .44, .05, 48), m: M.cream }));
const crest = add(body, node({ p: [0, 5.125, 0], role: 'crest' }));
const lathePts = [[0, 0], [.30, 0], [.30, .04], [.26, .07], [.12, .12], [.07, .18], [.07, .32], [.12, .36], [.2, .4], [.3, .5], [.34, .62], [.34, .76], [.32, .86], [.29, .88], [.27, .84], [0, .8]].map(([x, y]) => new THREE.Vector2(x, y));
const trophy = addGeo(new THREE.LatheGeometry(lathePts, 48), 'trophy');
add(crest, node({ g: trophy, m: M.gold }));
for (const sx of [-1, 1]) add(crest, node({ p: [sx * .37, .66, 0], s: [.8, 1, 1], g: torus(.14, .03), m: M.gold }));
add(crest, node({ p: [0, .6, .345], g: circle(.2), m: M.basic(T.badge) }));
add(crest, node({ p: [0, .6, -.345], rot: [0, Math.PI, 0], g: circle(.2), m: M.basic(T.badge) }));

const model = { root, geometries, materials, textures };
const json = JSON.stringify(model);
fs.writeFileSync(path.join(ROOT, 'build/g21.model.json'), json);
console.log('model', (json.length / 1024).toFixed(0) + ' KB', 'geos', geometries.length, 'mats', materials.length, 'tex', textures.length);
