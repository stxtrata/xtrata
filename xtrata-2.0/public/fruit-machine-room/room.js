/* ParallaX Casino · Fruit Machine Room
 * A stand-alone 3D hall that holds every fruit machine pack in ../casino-machines/. The look (black marble, brass, blue velvet, halo
 * chandeliers) and the way a cabinet is built and hosted are the casino's own (public/casino/index.html: packedCabinet, buildSlots,
 * createCasinoEngine). The list of machines lives in registry.js: add a line there and the hall gets a new place for it.
 *
 * Nothing in public/casino/ or in any machine folder is read-write here: packs are only fetched. */
(() => {
'use strict';
const CFG = window.FM_ROOM, T = THREE, $ = (id) => document.getElementById(id);
const REG = CFG.machines.filter((m) => !m.hidden);
const V3 = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const touch = (() => { try { return !!(window.matchMedia && matchMedia('(pointer:coarse)').matches) || 'ontouchstart' in window; } catch (_) { return false; } })();
const LITE = touch;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString('en-GB');
const title = (id) => id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const fail = (msg) => { const e = $('err'); e.style.display = 'block'; e.textContent = msg; console.error(msg); };
let toastTimer = 0;
const toast = (msg, ms = 2600) => { const t = $('toast'); t.textContent = msg; t.style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.style.display = 'none'; }, ms); };
const gunzip = async (b64) => { const raw = atob(b64), bytes = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i); return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text(); };
const loadImg = (url) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('image ' + url)); i.src = url; });
if (touch) document.body.classList.add('touch');

/* ------------------------------------------------------------------ layout: the hall grows with the list ------------------------------------------------------------------ */
const W = 16, H = 6, PITCH = 3.4, PAD = 5.5;
const BAYS = Math.max(1, Math.ceil(REG.length / 2));
const L = Math.max(20, BAYS * PITCH + 2 * PAD);
const bayZ = (k) => L / 2 - PAD - PITCH * (k + 0.5);          // bay 0 is next to the entrance
const bndZ = (k) => L / 2 - PAD - PITCH * k;                  // the boundary after k bays
const WALL_X = W / 2 - 0.67;                                  // cabinet origin, as the casino (wall minus 0.67)
const GOLD = 0xc99a48, WARM = 0xffc875;
const LIMIT = { x: W / 2 - 1.9, zMin: -L / 2 + 1.5, zMax: L / 2 - 1.5 };

/* ------------------------------------------------------------------ renderer, scene, camera ------------------------------------------------------------------ */
const canvas = $('view');
let renderer;
try { renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); if (!renderer.getContext()) throw new Error('no gl'); }
catch (e) { fail('This room needs WebGL, which this browser could not start.'); throw e; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, LITE ? 1.5 : 2));
renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
const scene = new T.Scene(); scene.background = new T.Color(0x060b12); scene.fog = new T.Fog(0x060b12, 28, 72);
const camera = new T.PerspectiveCamera(68, 1, 0.05, 90); camera.rotation.order = 'YXZ';

function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d'); draw(ctx, w, h); const t = new T.CanvasTexture(c); t.anisotropy = 4; t.userData = { canvas: c, ctx }; return t; }
let envTex = null;
try {
  const ec = document.createElement('canvas'); ec.width = 512; ec.height = 256; const x = ec.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#131c2a'); gr.addColorStop(0.45, '#78603b'); gr.addColorStop(0.55, '#b88b42'); gr.addColorStop(0.56, '#243248'); gr.addColorStop(1, '#040912'); x.fillStyle = gr; x.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 9; i++) { const lx = 30 + i * 56, g2 = x.createRadialGradient(lx, 50, 2, lx, 50, 38); g2.addColorStop(0, 'rgba(255,235,190,1)'); g2.addColorStop(1, 'rgba(255,200,120,0)'); x.fillStyle = g2; x.fillRect(lx - 40, 10, 80, 90); }
  const et = new T.CanvasTexture(ec); et.mapping = T.EquirectangularReflectionMapping; const pm = new T.PMREMGenerator(renderer); envTex = pm.fromEquirectangular(et).texture; pm.dispose();
} catch (e) { envTex = null; }

const matCache = {};
const M = (color, o) => { const k = color + (o ? JSON.stringify(o) : ''); if (matCache[k]) return matCache[k]; const m = new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0.05 }, o || {})); if (envTex && m.metalness >= 0.5) { m.envMap = envTex; m.envMapIntensity = 0.8; } return (matCache[k] = m); };
const GOLDM = () => M(GOLD, { metalness: 0.85, roughness: 0.28 });
const WARMM = new T.MeshBasicMaterial({ color: 0xffd598 });
const box = (w, h, d, mat, x, y, z, parent = scene) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x || 0, y || 0, z || 0); parent.add(m); return m; };
const cyl = (rt, rb, h, mat, x, y, z, parent = scene, seg = 24) => { const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x || 0, y || 0, z || 0); parent.add(m); return m; };
const glowMap = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.22, 'rgba(255,255,255,.4)'); g.addColorStop(0.6, 'rgba(255,255,255,.08)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
function glowSprite(x, y, z, size, color, op, parent = scene) { const m = new T.SpriteMaterial({ map: glowMap, color, transparent: true, opacity: op || 0.5, blending: T.AdditiveBlending, depthWrite: false, fog: false }); const s = new T.Sprite(m); s.position.set(x, y, z); s.scale.setScalar(size); parent.add(s); return s; }
function marbleTex(size) {
  return canvasTex(size, size, (c, w, h) => {
    c.fillStyle = '#0a0e13'; c.fillRect(0, 0, w, h);
    let seed = 3917; const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 70; i++) {
      let x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y);
      for (let k = 0; k < 12; k++) { x += (r() - 0.35) * 110 * (w / 1024); y += (35 + r() * 65) * (h / 1024); c.lineTo(x, y); }
      c.strokeStyle = i % 6 === 0 ? 'rgba(199,145,63,.49)' : 'rgba(151,168,185,.09)'; c.lineWidth = i % 6 === 0 ? 0.7 + r() * 1.3 : 0.6 + r() * 1.5; c.stroke();
    }
    c.strokeStyle = 'rgba(235,184,95,.3)'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2);
  });
}
function stoneMat(rx, ry, color, rough, size = 1024) { const t = marbleTex(size); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); return new T.MeshStandardMaterial({ color, map: t, roughness: rough, metalness: 0.28, envMap: envTex, envMapIntensity: 0.65 }); }

/* signs: the casino's brass-framed black panel */
const SIGN_IMG = {};
function pxSign(parent, x, y, z, w, h, text, sub, opts = {}) {
  const tx = canvasTex(1024, Math.round(1024 * h / w), (c, cw, ch) => {
    c.fillStyle = '#080c10'; c.fillRect(0, 0, cw, ch); c.strokeStyle = '#bc8e43'; c.lineWidth = 3; c.strokeRect(9, 9, cw - 18, ch - 18); c.lineWidth = 1; c.strokeRect(16, 16, cw - 32, ch - 32);
    if (opts.image && SIGN_IMG[opts.image]) { const im = SIGN_IMG[opts.image], s = Math.min((cw - 60) / im.width, (ch - 40) / im.height); c.drawImage(im, (cw - im.width * s) / 2, (ch - im.height * s) / 2, im.width * s, im.height * s); return; }
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = '#eaa443'; c.shadowBlur = 14; c.fillStyle = '#fff0d0'; c.font = '300 ' + Math.floor(ch * (sub ? 0.37 : 0.46)) + 'px Georgia'; c.fillText(text, cw / 2, sub ? ch * 0.4 : ch * 0.52, cw - 70); c.shadowBlur = 0;
    if (sub) { c.fillStyle = opts.subColor || '#d9ba80'; c.font = Math.floor(ch * 0.14) + 'px Arial'; c.fillText(sub, cw / 2, ch * 0.76, cw - 70); }
    if (opts.accent) { c.fillStyle = opts.accent; c.fillRect(cw * 0.3, ch - 24, cw * 0.4, 5); }
  });
  const g = new T.Group(); g.position.set(x, y, z); parent.add(g); box(w + 0.12, h + 0.12, 0.12, GOLDM(), 0, 0, 0, g);
  const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tx })); m.position.z = 0.065; g.add(m); g.userData.tex = tx; g.userData.face = m; return g;
}

/* ------------------------------------------------------------------ the hall ------------------------------------------------------------------ */
const hall = { dust: null, lights: [] };
function buildHall() {
  const gold = GOLDM(), floorMat = stoneMat(W / 5.2, L / 5.2, 0xcbd4e0, 0.19);
  const floor = new T.Mesh(new T.PlaneGeometry(W, L), floorMat); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const wallSide = stoneMat(L / 5.5, 1.1, 0x8b94a1, 0.24, 512), wallEnd = stoneMat(W / 5.5, 1.1, 0x8b94a1, 0.24, 512);
  [-1, 1].forEach((s) => box(0.18, H, L + 0.36, wallSide, s * (W / 2 + 0.09), H / 2, 0));
  [-1, 1].forEach((s) => box(W, H, 0.18, wallEnd, 0, H / 2, s * (L / 2 + 0.09)));
  box(W + 0.4, 0.12, L + 0.4, M(0x070b10, { roughness: 0.45, metalness: 0.35 }), 0, 6.08, 0);
  // brass lines along both walls
  [-1, 1].forEach((s) => [0.14, 1.05, 5.45, 5.83].forEach((y) => box(0.05, 0.035, L, gold, s * (W / 2 - 0.08), y, 0)));
  // pilasters and sconces at every boundary between bays; portals (column, arch, column) on every second one
  const hw = W / 2 - 1.1, archPath = [[-hw, 0], [-hw, 3.9], [-hw + 0.25, 4.85], [-hw + 1.1, 5.52], [-hw + 2.2, 5.66], [0, 5.66], [hw - 2.2, 5.66], [hw - 1.1, 5.52], [hw - 0.25, 4.85], [hw, 3.9], [hw, 0]];
  const tube = (pts, r, mat) => { const m = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map((p) => V3(...p))), 64, r, 8, false), mat); scene.add(m); return m; };
  const wallStone = stoneMat(1, 1, 0x8b94a1, 0.24, 256);
  for (let k = 0; k <= BAYS; k++) {
    const z = bndZ(k);
    [-1, 1].forEach((s) => {
      box(0.11, 5.75, 0.08, gold, s * (W / 2 - 0.09), 2.94, z);
      if (k % 2 === 1) {
        const sc = new T.Group(); sc.position.set(s * (W / 2 - 0.32), 3.15, z); sc.rotation.y = -s * Math.PI / 2; scene.add(sc);
        box(0.2, 2.3, 0.13, gold, 0, 0, 0, sc); box(0.09, 2.1, 0.18, WARMM, 0, 0, 0.09, sc); [1.13, -1.13].forEach((y) => box(0.32, 0.065, 0.25, gold, 0, y, 0.09, sc));
        glowSprite(s * (W / 2 - 0.9), 3.15, z, 2.6, 0xffbd65, 0.25);
      }
    });
    if (k % 2 === 0) {
      const warmTube = M(0xffd598, { roughness: 1, emissive: 0xffc875, emissiveIntensity: 1 });
      tube(archPath.map(([x, y]) => [x, y, z]), 0.16, gold); tube(archPath.map(([x, y]) => [x * 0.986, y * 0.978, z + 0.06]), 0.035, warmTube); tube(archPath.map(([x, y]) => [x * 0.969, y * 0.95, z + 0.11]), 0.035, gold);
      [-1, 1].forEach((s) => { const x = s * hw; cyl(0.27, 0.32, 5.2, wallStone, x, 2.6, z); cyl(0.4, 0.4, 0.16, gold, x, 0.1, z); cyl(0.41, 0.34, 0.25, gold, x, 5.15, z); [-0.12, 0.12].forEach((dx) => box(0.032, 4.6, 0.04, WARMM, x + dx, 2.7, z + 0.31)); });
    }
  }
  // halo chandeliers over every second boundary that has no arch, with instanced crystal prisms
  const chz = []; for (let k = 1; k < BAYS; k += 2) chz.push(bndZ(k)); if (!chz.length) chz.push(0);
  const crystalGeo = new T.BoxGeometry(0.065, 0.3, 0.075), glass = M(0xe9dcba, { roughness: 0.12, metalness: 0.42, transparent: true, opacity: 0.65, envMap: envTex });
  const crystals = new T.InstancedMesh(crystalGeo, glass, chz.length * 40), dummy = new T.Object3D(); let ci = 0;
  chz.forEach((z) => {
    const r = 2.4;
    [0, 0.32, 0.65].forEach((dy, i) => { const ring = (rr, y, mat, t) => { const m = new T.Mesh(new T.TorusGeometry(rr, t, 8, 96), mat); m.rotation.x = Math.PI / 2; m.position.set(0, y, z); scene.add(m); }; ring(r - i * 0.5, 5.63 - dy, gold, 0.075); ring(r - i * 0.5 - 0.12, 5.59 - dy, WARMM, 0.025); });
    for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; dummy.position.set(Math.cos(a) * (r - 0.2), 5.15, z + Math.sin(a) * (r - 0.2)); dummy.rotation.set(0, -a, 0); dummy.scale.set(1, 0.8 + (i % 3) * 0.25, 1); dummy.updateMatrix(); crystals.setMatrixAt(ci++, dummy.matrix); }
    glowSprite(0, 5.4, z, r * 2.6, 0xffc77d, 0.25);
  });
  scene.add(crystals);
  // ceiling coffers and recessed lights
  [-6, -3, 0, 3, 6].forEach((x) => box(0.035, 0.025, L - 0.4, gold, x, 5.98, 0));
  for (let k = 0; k <= BAYS; k++) box(W - 0.5, 0.025, 0.035, gold, 0, 5.98, bndZ(k));
  const lights = new T.InstancedMesh(new T.CylinderGeometry(0.09, 0.09, 0.025, 12), WARMM, BAYS * 4); let li = 0;
  for (let k = 0; k < BAYS; k++) for (const x of [-5, -2, 2, 5]) { dummy.position.set(x, 5.94, bayZ(k)); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); lights.setMatrixAt(li++, dummy.matrix); }
  scene.add(lights);
  // blue velvet rugs with a gold border: one island per bay, and the gold runner lines
  const rug = canvasTex(1024, 600, (c, w, h) => { c.fillStyle = '#071c3c'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b89450'; c.lineWidth = 5; c.strokeRect(14, 14, w - 28, h - 28); c.lineWidth = 2; c.strokeRect(30, 30, w - 60, h - 60); for (let i = 0; i < 16; i++) { c.strokeStyle = 'rgba(158,177,195,.08)'; c.beginPath(); c.moveTo(i * 90 - 300, 0); c.lineTo(i * 90 + 300, h); c.stroke(); } });
  const rmat = new T.MeshStandardMaterial({ map: rug, roughness: 0.95 });
  for (let k = 0; k < BAYS; k++) { const m = new T.Mesh(new T.PlaneGeometry(10.6, PITCH - 0.5), rmat); m.rotation.x = -Math.PI / 2; m.position.set(0, 0.008, bayZ(k)); scene.add(m); }
  [-1, 1].forEach((s) => { box(0.025, 0.006, L - 2.4, gold, s * 5.45, 0.007, 0); box(0.012, 0.006, L - 2.4, gold, s * 5.58, 0.007, 0); });
  // back wall: pilasters and the house sign
  [-6.4, -3.2, 3.2, 6.4].forEach((x) => {
    box(0.48, 5.65, 0.22, wallStone, x, 2.825, -L / 2 + 0.28); [-0.22, 0.22].forEach((dx) => box(0.035, 5.65, 0.06, gold, x + dx, 2.825, -L / 2 + 0.42));
    box(0.14, 2.45, 0.12, gold, x, 2.9, -L / 2 + 0.49); box(0.065, 2.27, 0.13, WARMM, x, 2.9, -L / 2 + 0.57); glowSprite(x, 2.9, -L / 2 + 0.95, 2.9, 0xffbd6b, 0.28);
    [1.64, 4.16].forEach((y) => box(0.23, 0.07, 0.2, gold, x, y, -L / 2 + 0.56));
  });
  hall.backSign = pxSign(scene, 0, 4.35, -L / 2 + 0.62, 6.1, 1.5, 'PARALLAX CASINO', 'C A S I N O', { image: 'sign' });
  pxSign(scene, 0, 2.7, -L / 2 + 0.62, 4.6, 0.72, 'THE FRUIT MACHINE ROOM', `${REG.length} MACHINES · ${BAYS} BAYS`);
  glowSprite(0, 4.3, -L / 2 + 1.5, 8, 0xeaa443, 0.22);
  // the entrance wall: a closed brass door (this is where the room will be linked to the casino) and the front sign
  const wood = M(0x0b1018, { roughness: 0.24, metalness: 0.3 }), fz = L / 2 - 0.02;
  box(1.45, 2.7, 0.1, wood, -0.725, 1.35, fz - 0.05); box(1.45, 2.7, 0.1, wood, 0.725, 1.35, fz - 0.05);
  [-1.3, -0.15, 0.15, 1.3].forEach((x) => box(0.025, 2.45, 0.015, gold, x, 1.35, fz - 0.115)); [-1, 1].forEach((s) => cyl(0.018, 0.018, 0.22, gold, s * 0.15, 1.1, fz - 0.14, scene, 8));
  box(3.3, 0.14, 0.2, gold, 0, 2.82, fz - 0.1); [-1, 1].forEach((s) => cyl(0.05, 0.06, 2.8, gold, s * 1.6, 1.4, fz - 0.12, scene, 14));
  const ent = pxSign(scene, 0, 3.55, fz - 0.14, 3.4, 0.62, 'TO THE CASINO FLOOR', 'DOOR CLOSED · STAND-ALONE ROOM', { subColor: '#a89570' }); ent.rotation.y = Math.PI;
  const front = pxSign(scene, 0, 4.7, fz - 0.14, 5.5, 1.0, 'PARALLAX', 'A   W O R L D   W I T H I N'); front.rotation.y = Math.PI;
  glowSprite(0, 3.3, L / 2 - 1.4, 5, 0xe2b46b, 0.2);
  // medallion on the floor by the door
  const med = canvasTex(1024, 1024, (c, w, h) => { c.fillStyle = '#080d14'; c.fillRect(0, 0, w, h); for (let i = 0; i < 3; i++) { c.strokeStyle = i === 1 ? '#477dc2' : '#b78d46'; c.lineWidth = 3; c.beginPath(); c.arc(w / 2, h / 2, w * 0.48 - i * 17, 0, 7); c.stroke(); } });
  const medM = new T.Mesh(new T.CircleGeometry(1.8, 96), new T.MeshStandardMaterial({ map: med, metalness: 0.45, roughness: 0.22, envMap: envTex })); medM.rotation.x = -Math.PI / 2; medM.position.set(0, 0.009, L / 2 - 3.4); scene.add(medM); hall.medallion = med;
  // two velvet sofas against the entrance wall
  const velvet = M(0x0a244c, { roughness: 0.86 });
  [-5, 5].forEach((x) => {
    const g = new T.Group(); g.position.set(x, 0, L / 2 - 0.95); g.rotation.y = Math.PI; scene.add(g);
    box(3.1, 0.14, 1.03, gold, 0, 0.18, 0, g); box(3.05, 0.34, 1.02, velvet, 0, 0.43, 0, g); box(3.05, 0.76, 0.24, velvet, 0, 0.86, -0.42, g);
    [-1, 1].forEach((s) => box(0.24, 0.58, 1.08, velvet, s * 1.5, 0.67, 0, g)); for (let i = 0; i < 3; i++) box(0.94, 0.13, 0.83, velvet, -1 + i, 0.65, 0.05, g);
    glowSprite(x, 1, L / 2 - 1.5, 2, 0xffc470, 0.14);
  });
  // lights: the casino's hemisphere, ambient and fill, plus four warm lamps that follow the visitor down the hall
  scene.add(new T.HemisphereLight(0xffead7, 0x192437, 0.8)); hall.ambient = new T.AmbientLight(0xffd4a0, 0.27); scene.add(hall.ambient);
  const fill = new T.DirectionalLight(0xffdfb3, 0.8); fill.position.set(0, 5, 8); scene.add(fill);
  [[-5, -2.5], [5, -2.5], [-5, 2.5], [5, 2.5]].forEach(([dx, dz]) => { const l = new T.PointLight(0xffba62, 0.62, 9, 1.5); l.userData = { dx, dz }; l.position.set(dx, 3.2, dz); scene.add(l); hall.lights.push(l); });
  const dp = new Float32Array(90 * 3); for (let i = 0; i < dp.length; i += 3) { dp[i] = (Math.random() - 0.5) * (W - 1); dp[i + 1] = Math.random() * 5; dp[i + 2] = (Math.random() - 0.5) * L; }
  const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
  hall.dust = new T.Points(dg, new T.PointsMaterial({ size: 0.018, color: 0xffdeb0, transparent: true, opacity: 0.22, depthWrite: false, blending: T.AdditiveBlending })); scene.add(hall.dust);
}

/* ------------------------------------------------------------------ the machines: slots, proxies, plaques ------------------------------------------------------------------ */
let seat = null;   // the cabinet the visitor is playing: { m, loading, view, session }
const floorGlowCache = {};
function floorGlowMat(hex) {
  if (floorGlowCache[hex]) return floorGlowCache[hex];
  const t = canvasTex(256, 256, (c) => { const r = c.createRadialGradient(128, 128, 0, 128, 128, 128); r.addColorStop(0, hex + 'cc'); r.addColorStop(0.5, hex + '44'); r.addColorStop(1, hex + '00'); c.fillStyle = r; c.fillRect(0, 0, 256, 256); });
  return (floorGlowCache[hex] = new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0.55, blending: T.AdditiveBlending }));
}
const shadowMat = new T.MeshBasicMaterial({ map: canvasTex(128, 128, (c) => { const r = c.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(0,0,0,.7)'); r.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = r; c.fillRect(0, 0, 128, 128); }), transparent: true, depthWrite: false });
const proxyGeo = new T.BoxGeometry(1.3, 2.35, 0.74), proxyScreenGeo = new T.PlaneGeometry(0.96, 0.66), proxyCapGeo = new T.CylinderGeometry(0.34, 0.4, 0.22, 20);
const okHex = (h) => (/^#[0-9a-f]{6}$/i.test(h) ? h : '#d9ba80');

const machines = REG.map((r, i) => {
  const side = i % 2 === 0 ? -1 : 1, bay = i >> 1;
  const m = { i, id: r.id, def: r, folder: r.folder || (CFG.base + r.id), no: r.no != null ? r.no : i + 1, name: r.name || title(r.id), accent: okHex(r.accent), side, bay, x: side * WALL_X, z: bayZ(bay), d: 99, model: null, anims: [], res: null, eng: null, pack: null, loading: null };
  m.ax = m.x - side * 1.2; m.az = m.z;                                      // where the visitor stands to play
  const g = new T.Group(); g.position.set(m.x, 0.012, m.z); g.rotation.y = -side * Math.PI / 2; g.name = 'ParallaX · ' + m.name; scene.add(g); m.group = g;
  // proxy cabinet: shown until the real model has streamed in
  const px = new T.Group(); g.add(px); m.proxy = px;
  const body = new T.Mesh(proxyGeo, M(0x14100d, { metalness: 0.55, roughness: 0.4 })); body.position.y = 1.175; px.add(body);
  const scr = new T.Mesh(proxyScreenGeo, new T.MeshBasicMaterial({ color: new T.Color(m.accent).multiplyScalar(0.45) })); scr.position.set(0, 1.55, 0.375); px.add(scr); m.proxyScreen = scr;
  const cap = new T.Mesh(proxyCapGeo, M(0x14100d, { metalness: 0.55, roughness: 0.4 })); cap.position.y = 2.46; px.add(cap);
  const sh = new T.Mesh(new T.PlaneGeometry(2.2, 1.7), shadowMat); sh.rotation.x = -Math.PI / 2; sh.position.set(0, 0.004, 0.2); g.add(sh);
  const fg = new T.Mesh(new T.PlaneGeometry(2.6, 1.6), floorGlowMat(m.accent)); fg.rotation.x = -Math.PI / 2; fg.position.set(0, 0.012, 0.95); g.add(fg); m.floorGlow = fg;
  m.plaque = pxSign(g, 0, 2.94, 0, 1.52, 0.27, m.name, '', { accent: m.accent });
  paintPlaque(m);
  return m;
});
function paintPlaque(m) {
  const tx = m.plaque.userData.tex, c = tx.userData.ctx, w = tx.userData.canvas.width, h = tx.userData.canvas.height, busy = seat && seat.m === m;
  c.fillStyle = '#080c10'; c.fillRect(0, 0, w, h); c.strokeStyle = '#bc8e43'; c.lineWidth = 3; c.strokeRect(9, 9, w - 18, h - 18); c.lineWidth = 1; c.strokeRect(16, 16, w - 32, h - 32);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = '#eaa443'; c.shadowBlur = 14; c.fillStyle = '#fff0d0'; c.font = '300 ' + Math.floor(h * 0.37) + 'px Georgia'; c.fillText(m.name, w / 2, h * 0.4, w - 70); c.shadowBlur = 0;
  c.fillStyle = '#d9ba80'; c.font = Math.floor(h * 0.14) + 'px Arial'; c.fillText('No. ' + String(m.no).padStart(2, '0') + '  ·  ' + (busy ? 'I N   U S E' : 'P L A Y   ↗'), w / 2, h * 0.76, w - 70);
  c.fillStyle = m.accent; c.fillRect(w * 0.3, h - 25, w * 0.4, 5); tx.needsUpdate = true;
}

/* ------------------------------------------------------------------ streaming cabinets in and out (the casino's packedCabinet loader) ------------------------------------------------------------------ */
const packs = new Map();
async function getPack(m) {
  if (packs.has(m.id)) return packs.get(m.id);
  const p = (async () => { const res = await fetch(new URL(m.folder + '/pack.json', location.href)); if (!res.ok) throw new Error(m.name + ': pack.json not found (' + res.status + ')'); return res.json(); })();
  packs.set(m.id, p); p.catch(() => packs.delete(m.id)); return p;
}
function applyPackInfo(m, pack) {
  if (pack.name && pack.name !== m.name) { m.name = pack.name; m.group.name = 'ParallaX · ' + m.name; }
  if (pack.accent && okHex(pack.accent) !== m.accent) { m.accent = okHex(pack.accent); m.floorGlow.material = floorGlowMat(m.accent); m.proxyScreen.material.color.set(m.accent).multiplyScalar(0.45); }
  paintPlaque(m); renderDir();
}
let anisotropy = 8; try { anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); } catch (_) { /* default */ }
async function buildCabinet(pack) {
  const data = JSON.parse(await gunzip(pack.model));
  const imgs = await Promise.all(data.textures.map((t) => loadImg(t.image)));
  const geos = data.geometries.map((g) => { const o = new T.BufferGeometry(); for (const [k, a] of Object.entries(g.attributes)) o.setAttribute(k, new T.BufferAttribute(new Float32Array(a.array), a.size)); if (g.index) o.setIndex(g.index); for (const gr of g.groups || []) o.addGroup(gr.start, gr.count, gr.materialIndex); o.computeBoundingSphere(); return o; });
  const texs = data.textures.map((t, i) => { const o = new T.Texture(imgs[i]); o.wrapS = t.wrapS; o.wrapT = t.wrapT; o.repeat.fromArray(t.repeat); o.offset.fromArray(t.offset); o.flipY = t.flipY; o.anisotropy = anisotropy; o.needsUpdate = true; return o; });
  const mats = data.materials.map((m) => { const p = { color: m.color, map: m.map == null ? null : texs[m.map], transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest }; if (m.type === 'basic') return new T.MeshBasicMaterial(p); return new T.MeshStandardMaterial(Object.assign(p, { roughness: m.roughness, metalness: m.metalness, emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, flatShading: m.flatShading, envMap: envTex, envMapIntensity: 0.65 })); });
  const node = (n) => { const o = n.g == null ? new T.Group() : new T.Mesh(geos[n.g], Array.isArray(n.m) ? n.m.map((id) => mats[id]) : mats[n.m]); o.position.fromArray(n.p); o.quaternion.fromArray(n.q); o.scale.fromArray(n.s); o.visible = n.visible; if (n.role) o.name = 'px-' + n.role; if (n.action) o.userData.pxMachineAction = n.action; n.children.forEach((c) => o.add(node(c))); return o; };
  const model = node(data.root); model.updateMatrixWorld(true);
  return { model, res: { geos, mats, texs } };
}
function loadCabinet(m) {
  if (m.model) return Promise.resolve(m);
  if (m.loading) return m.loading;
  m.loading = (async () => {
    const pack = await getPack(m); m.pack = pack; applyPackInfo(m, pack);
    const { model, res } = await buildCabinet(pack);
    const bb = new T.Box3().setFromObject(model), size = bb.getSize(V3()), scale = 2.6 / size.y;   // every cabinet is scaled to 2.6 m tall, as in the casino
    model.scale.multiplyScalar(scale); model.position.y -= bb.min.y * scale;
    m.model = model; m.res = res; m.group.add(model); m.proxy.visible = false;
    m.anims = []; for (const role of ['crest', 'recordGroup', 'core', 'lever', 'spinPhysical', 'armPivot']) { const o = model.getObjectByName('px-' + role); if (o) m.anims.push({ o, role, base: o.rotation.clone(), home: o.position.clone() }); }
    m.screenMesh = model.getObjectByName('px-screenMesh'); m.origScreenMat = null;
    if (m.eng) applyScreen(m);
    renderDir(); return m;
  })().catch((e) => { console.warn('Could not load', m.id, e); m.failed = e.message; throw e; }).finally(() => { m.loading = null; });
  return m.loading;
}
function disposeRes(res) { if (!res) return; res.geos.forEach((g) => g.dispose()); res.mats.forEach((x) => x.dispose()); res.texs.forEach((t) => t.dispose()); }
function unloadCabinet(m) {
  if (!m.model) return;
  m.group.remove(m.model); if (m.liveMat) { m.liveMat.dispose(); m.liveMat = null; }
  disposeRes(m.res); m.res = null; m.model = null; m.anims = []; m.screenMesh = null; m.origScreenMat = null; m.proxy.visible = true; renderDir();
}
/* Desktop: every cabinet is loaded up front (about 700 MB of graphics memory for 22), so nothing pops in as you walk. Phones and tablets, or ?stream=1,
   stream them by distance instead. */
const STREAM = LITE || new URLSearchParams(location.search).has('stream');
const LOAD_R = STREAM ? (LITE ? 8 : 11) : 1e9, UNLOAD_R = STREAM ? LOAD_R + 3.5 : 1e9, MAX_LOADED = STREAM ? (LITE ? 4 : 9) : 1e6;
const streamJobs = new Set(), MAX_JOBS = STREAM ? 1 : 2;
function streamTick() {
  const px = player.x, pz = player.z;
  for (const m of machines) m.d = Math.hypot(m.x - px, m.z - pz);
  const want = machines.filter((m) => m.d < LOAD_R && !m.failed).sort((a, b) => a.d - b.d).slice(0, MAX_LOADED), keep = new Set(want); if (seat) keep.add(seat.m);
  for (const m of machines) if (m.model && !keep.has(m) && m.d > UNLOAD_R) unloadCabinet(m);
  const loaded = machines.filter((m) => m.model && !keep.has(m)).sort((a, b) => b.d - a.d); let over = machines.filter((m) => m.model).length - (MAX_LOADED + 2); while (over-- > 0 && loaded.length) unloadCabinet(loaded.shift());
  while (streamJobs.size < MAX_JOBS) { const next = want.find((m) => !m.model && !m.loading); if (!next) break; const job = loadCabinet(next).catch(() => {}).finally(() => { streamJobs.delete(job); }); streamJobs.add(job); }
}

/* ------------------------------------------------------------------ the shared LAYR test account ------------------------------------------------------------------ */
const LAYR = window.ParallaxLAYRAccount, LAYR_KEY = 'xtrata.parallax.test.fruit-room.layr.v1';
function resetStorage(fn) { try { const r = JSON.parse(localStorage.getItem(LAYR_KEY) || '{}'); fn(r); localStorage.setItem(LAYR_KEY, JSON.stringify(r)); } catch (e) { console.warn(e); } }

/* ------------------------------------------------------------------ hosting the games (the casino's createCasinoEngine) ------------------------------------------------------------------ */
const RAF_SHIM = '<script>(function(){var w=window,nat=w.requestAnimationFrame&&w.requestAnimationFrame.bind(w),natC=w.cancelAnimationFrame&&w.cancelAnimationFrame.bind(w);if(!nat||w.__pxPump)return;var q=new Map(),n=0,h=0,since=0,driven=false;function run(t){h=0;since=0;var list=Array.from(q.values());q.clear();for(var i=0;i<list.length;i++){try{list[i](t)}catch(e){(function(e){setTimeout(function(){throw e})})(e)}}}w.requestAnimationFrame=function(cb){var id=++n;q.set(id,cb);if(!since)since=performance.now();if(!h&&!driven)h=nat(run);return id};w.cancelAnimationFrame=function(id){q.delete(id)};w.__pxPump=function(){if(!q.size)return;var now=performance.now();if(!driven&&now-since<120)return;driven=true;if(h){natC(h);h=0}run(now)}})();<\/script>';
function intoHead(html, code) { const m = /<head[^>]*>/i.exec(html); return m ? html.slice(0, m.index + m[0].length) + code + html.slice(m.index + m[0].length) : code + html; }
function liteDocument(html) {   // the casino's pxLiteDocument for touch devices: half-size screen canvas, no hidden 3D view
  let out = html;
  if (touch) {
    const re = /const screen *= *canvas\(2800, *1920\), *sg *= *screen\.getContext\('2d'\); *sg\.setTransform\(2, *0, *0, *2, *0, *0\);/g;
    if ((out.match(re) || []).length === 1) out = out.replace(re, "const screen=canvas(1400,960),sg=screen.getContext('2d');sg.setTransform(1,0,0,1,0,0);");
    const rr = /renderer\.render\(\s*scene\s*,\s*camera\s*\)/g;
    if ((out.match(rr) || []).length === 2) out = intoHead(out.replace(rr, '(window.__pxHidden||renderer.render(scene,camera))'), '<script>window.__pxHidden=true<\/script>');
  }
  return out;
}
const engines = [], MAX_ENGINES = LITE ? 2 : 3;
async function startEngine(m) {
  if (m.eng) return m.eng;
  if (m.engLoading) return m.engLoading;
  m.engLoading = (async () => {
    // keep only a few game frames alive: stand the oldest idle one down
    while (engines.length >= MAX_ENGINES) { const old = engines.find((x) => !(seat && seat.m === x)); if (!old) break; if (!destroyEngine(old)) break; }
    const pack = await getPack(m); m.pack = pack;
    let html = liteDocument(await gunzip(pack.game)); if (m.def.inject) html = intoHead(html, '<script>' + m.def.inject + '<\/script>'); html = intoHead(html, RAF_SHIM);
    const frame = document.createElement('iframe'); frame.className = 'fmFrame'; frame.title = m.name + ' game logic'; frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1; frame.allow = 'fullscreen; autoplay'; document.body.appendChild(frame);
    let api;
    try { api = await new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('Machine did not become ready')), 30000); frame.onload = () => { clearTimeout(t); const a = frame.contentWindow.PX_CASINO_ENGINE; a ? res(a) : rej(new Error('Game engine API missing')); }; frame.srcdoc = html; }); }
    catch (e) { frame.remove(); throw e; }
    const tex = new T.CanvasTexture(api.screen); tex.minFilter = tex.magFilter = T.LinearFilter; tex.generateMipmaps = false; tex.anisotropy = anisotropy;
    const fsKind = (api.fullscreen && typeof api.fullscreen.enter === 'function') ? 'obj' : typeof api.fullscreenHost === 'function' ? 'host' : typeof api.fullscreen === 'function' ? 'fn' : 'none';
    const e = { m, frame, api, tex, css: pack.css || '', rev: -1, fsKind, fsHostOn: false, hostReg: false, lastFeat: null, lastModal: null };
    m.eng = e; engines.push(e); applyScreen(m); return e;
  })().finally(() => { m.engLoading = null; });
  return m.engLoading;
}
function destroyEngine(e) {
  try { if (e.api.deactivate() === false) return false; } catch (_) { /* a frame that cannot answer is going anyway */ }
  const m = e.m; if (m.screenMesh && m.origScreenMat) { m.screenMesh.material = m.origScreenMat; } if (m.liveMat) { m.liveMat.dispose(); m.liveMat = null; }
  e.tex.dispose(); e.frame.remove(); m.eng = null; const i = engines.indexOf(e); if (i >= 0) engines.splice(i, 1); return true;
}
function applyScreen(m) {   // the game's canvas becomes the cabinet's screen
  if (!m.model || !m.eng || !m.screenMesh) return;
  if (!m.origScreenMat) m.origScreenMat = m.screenMesh.material;
  if (!m.liveMat) { m.liveMat = m.origScreenMat.clone(); }
  m.liveMat.map = m.eng.tex; m.liveMat.color.setHex(0xffffff); m.liveMat.needsUpdate = true; m.screenMesh.material = m.liveMat;
}

/* ------------------------------------------------------------------ the visitor: walking, camera, seating ------------------------------------------------------------------ */
const player = { x: 0, z: L / 2 - 2.8, yaw: 0, pitch: 0 };
const keys = {}, joy = { x: 0, y: 0 };
let mode = 'walk', ret = null, bob = 0, sprintAll = false, cand = null, locked = false, lastDragAt = -Infinity;
/* the casino's walking constants (public/casino/index.html: WALK) */
const WALK = { fov: 68, eye: 1.6, speed: 3, sprint: 4.6, bobRate: 9, bobAmp: 0.025, look: 0.0022, drag: 0.004, touchLook: 0.005, pitch: 1.2 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const curPos = V3(0, 1.6, player.z), curLook = V3(0, 1.6, player.z - 5), tgtPos = V3(), tgtLook = V3();
let curFov = WALK.fov, tgtFov = WALK.fov;
const eyePose = () => ({ pos: V3(player.x, 1.6, player.z), look: V3(player.x - Math.sin(player.yaw) * Math.cos(player.pitch) * 5, 1.6 + Math.sin(player.pitch) * 5, player.z - Math.cos(player.yaw) * Math.cos(player.pitch) * 5) });
function clearMove() { for (const k in keys) delete keys[k]; joy.x = joy.y = 0; }
/* mouse look, as the casino: the pointer is captured (and disappears) when you click the room, freed for the buttons by Esc or Q */
function tryLock() { if (touch) return; try { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => { /* ignore */ }); } catch (_) { /* ignore */ } }
function freeMouse() { try { if (document.pointerLockElement) document.exitPointerLock(); } catch (_) { /* ignore */ } }
document.addEventListener('pointerlockchange', () => { locked = document.pointerLockElement === canvas; paintHud(); });
const modalOpen = () => $('port').classList.contains('on');
const walkLive = () => mode === 'walk' && (!seat || seat.here) && !anySheetOpen() && !modalOpen();
function teleport(m) { player.x = m.ax - m.side * 1.4; player.z = m.az; player.yaw = -m.side * Math.PI / 2; player.pitch = 0; streamTick(); }

/* what the visitor is standing at: the casino's nearestMachineCandidate (approach point 1.2 m in front of the cabinet) */
function nearest() {
  let best = null, score = Infinity;
  const dir = V3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  for (const m of machines) {
    const dx = m.ax - player.x, dz = m.az - player.z, d = Math.hypot(dx, dz); if (d > 2.65) continue;
    const dot = (dx * dir.x + dz * dir.z) / (d + 1e-6); if (d > 0.85 && dot < 0.45) continue;
    const v = d - dot * 0.8; if (v < score) { score = v; best = m; }
  }
  return best;
}
function viewTarget(m, view) {
  const g = m.group; g.updateWorldMatrix(true, true);
  if (view === 'screen' && m.screenMesh) {
    const s = m.screenMesh; s.geometry.computeBoundingBox(); const b = s.geometry.boundingBox, box3 = new T.Box3();
    for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) box3.expandByPoint(g.worldToLocal(s.localToWorld(V3(x, y, z))));
    const c = box3.getCenter(V3()), size = box3.getSize(V3()), height = Math.max(1, innerHeight), top = 80, bottom = ($('cab').getBoundingClientRect().height || 150) + 24;
    const usable = Math.max(0.18, (height - top - bottom) / height), tan = Math.tan(T.MathUtils.degToRad(55 / 2));
    const dist = Math.max(size.y / (2 * tan * usable * 0.88), size.x / (2 * tan * Math.max(0.2, camera.aspect) * 0.86), 1.15);
    const ndc = 1 - (top + (height - top - bottom) / 2) / height * 2, eyeY = c.y - ndc * dist * tan;
    return { pos: g.localToWorld(V3(c.x, eyeY, box3.max.z + dist)), look: g.localToWorld(V3(c.x, eyeY, c.z)) };
  }
  const dist = 3.25 * Math.max(1, 0.75 / Math.max(0.35, camera.aspect));
  return { pos: g.localToWorld(V3(0, 1.55, dist)), look: g.localToWorld(V3(0, 1.12, 0.25)) };
}
function aimSeat() { if (!seat || seat.here) return; const t = viewTarget(seat.m, seat.view); tgtPos.copy(t.pos); tgtLook.copy(t.look); tgtFov = 55; paintHud(); }
/* PLAY HERE (the default, as the casino) keeps you where you stand, walking and looking, with the mouse captured.
   CABINET VIEW / SCREEN VIEW move the camera to the cabinet and free the mouse; PLAY HERE brings you back. */
function setView(kind) {
  if (!seat) return;
  if (kind === 'here') {
    if (seat.here) return; seat.here = true; mode = 'return'; tgtPos.copy(ret.pos); tgtLook.copy(ret.look); tgtFov = WALK.fov;
  } else {
    if (seat.here) { const r = eyePose(); ret = { pos: r.pos, look: r.look }; curPos.copy(camera.position); curLook.copy(r.look); seat.here = false; mode = 'seat'; freeMouse(); clearMove(); }
    seat.view = kind; aimSeat();
  }
  paintHud();
}
async function sit(m) {
  if (seat) { if (seat.m === m) return; if (!leave()) return; }
  if (!m) return;
  closeSheets(); closeDir(); clearMove();
  const session = {}; seat = { m, loading: true, here: true, view: 'cab', session, t0: performance.now(), out: false };
  document.body.classList.add('seated', 'floor'); document.body.classList.remove('view', 'more');
  $('cab').hidden = false; $('cabName').textContent = m.name; setStatus('Connecting to the cabinet…'); for (const id of ['cSpin', 'cBetDown', 'cBetUp']) $(id).disabled = true; $('cSpin').textContent = 'CONNECTING…';
  paintPlaque(m); paintHud(); renderDir();
  try {
    await loadCabinet(m); if (!seat || seat.session !== session) return; aimSeat();
    const e = await startEngine(m); if (!seat || seat.session !== session) return;
    await e.api.activate(); if (!seat || seat.session !== session) { try { e.api.deactivate(); } catch (_) { /* leaving */ } return; }
    const mech = e.api.mechanics && e.api.mechanics(); m.lastLeverSignal = mech && mech.lever ? mech.lever.id : 0;
    seat.loading = false; e.rev = -1; paintCab(true);
  } catch (err) {
    if (!seat || seat.session !== session) return; seat.error = err.message || 'The cabinet could not connect.'; setStatus(seat.error + ' Walk away and try again.'); $('cSpin').textContent = 'UNAVAILABLE'; console.warn(err);
  }
}
function leave() {
  if (!seat) return true;
  const m = seat.m, e = m.eng;
  if (e && !seat.loading) {
    try { e.api.stopAuto && e.api.stopAuto(); } catch (_) { /* ignore */ }
    if (fsActive(e)) exitFs(e);
    let ok = true; try { ok = e.api.deactivate() !== false; } catch (err) { console.warn(err); }
    if (!ok) { setStatus('Let this spin or bonus finish before you leave the cabinet.'); return false; }
  }
  const wasHere = seat.here;
  seat = null; document.body.classList.remove('seated', 'floor', 'view', 'more'); $('cab').hidden = true; setPort('modal', ''); setPort('feature', ''); $('cabStatus').textContent = '';
  if (!wasHere && ret) { mode = 'return'; tgtPos.copy(ret.pos); tgtLook.copy(ret.look); tgtFov = WALK.fov; }
  paintPlaque(m); renderDir(); paintHud(); return true;
}
const setStatus = (t) => { if ($('cabStatus').textContent !== t) $('cabStatus').textContent = t; };

/* cabinet controls: the HUD bar, the cabinet's own buttons and keys all call these */
const gdoc = (e) => { try { return e.frame.contentDocument; } catch (_) { return null; } };
function act(name) {
  if (!seat || seat.loading || !seat.m.eng) return; const e = seat.m.eng, d = gdoc(e);
  try {
    if (name === 'turbo' || name === 'sound' || name === 'gamble') { const b = d && d.getElementById(name); if (b && !b.disabled) b.click(); else if (!b) e.api.action(name); }
    else e.api.action(name);
  } catch (err) { console.error(err); setStatus('Please try that control again.'); }
  paintCab(true);
}
let lastCab = 0;
function paintCab(force) {
  if (!seat || seat.loading || !seat.m.eng) return; const e = seat.m.eng, now = performance.now(); if (!force && now - lastCab < 90) return; lastCab = now;
  let u; try { u = e.api.ui(); } catch (_) { return; }
  const set = (id, v) => { const el = $(id); if (el.textContent !== v) el.textContent = v; };
  set('cBal', fmt(u.balance)); set('cBet', fmt(u.bet)); set('cWin', fmt(u.win)); set('cSpin', u.button || 'SPIN'); setStatus(u.status || '');
  const away = !!seat.out; $('cSpin').disabled = (!!(u.spinDisabled || u.spinning) && !u.scene) || away; $('cBetDown').disabled = !!u.betDownDisabled || away; $('cBetUp').disabled = !!u.betUpDisabled || away;
  if (seat.here && !fsActive(e)) {   // the casino's rule: walk more than 4 m from the cabinet and you disconnect once the spin is done
    const far = Math.hypot(seat.m.ax - player.x, seat.m.az - player.z) > 4;
    if (far && !seat.out) { try { e.api.stopAuto && e.api.stopAuto(); } catch (_) { /* ignore */ } }
    seat.out = far; if (far && !u.spinning && !u.scene) { leave(); return; }
    if (far) u.status = 'Finishing your spin · disconnecting as you walk away';
  }
  const g = $('cGamble'); g.hidden = !u.gamble; if (u.gamble) set('cGamble', u.gamble);
  $('cAuto').setAttribute('aria-pressed', String(!!u.auto)); $('cTurbo').setAttribute('aria-pressed', String(!!u.turbo)); set('cSound', u.muted ? 'SOUND OFF' : 'SOUND ON');
  if (fsActive(e)) { setPort('modal', ''); setPort('feature', ''); return; }
  setPort('modal', u.modal || '', e.css); setPort('feature', u.feature || '', e.css);
}
/* the game's dialogs and feature bar are shown from the game's own markup, wired back to the game through data-px-source */
const portRoots = {}, portLast = { modal: '', feature: '' };
function portCSS(css) { return '<style>' + css.replaceAll(':root', ':host') + '\n:host{all:initial;font-family:Arial,sans-serif;color:#f5ebdc}*{box-sizing:border-box}dialog{position:static!important;display:block;margin:0 auto;max-height:84vh;overflow:auto;width:min(680px,94vw)}dialog::backdrop{display:none}#featureBar{position:static!important;inset:auto!important;transform:none!important;display:flex!important;width:100%!important;max-width:none!important;margin:0!important;flex-wrap:wrap!important;gap:12px!important}#fbBody{display:flex;flex-wrap:wrap;gap:7px}</style>'; }
function setPort(kind, html, css) {
  const host = kind === 'modal' ? $('port') : $('featPort');
  if (!html) { if (portLast[kind]) { portLast[kind] = ''; if (kind === 'modal') host.classList.remove('on'); portRoots[kind] && (portRoots[kind].innerHTML = ''); } return; }
  if (portLast[kind] === html) return; portLast[kind] = html; if (kind === 'modal') { clearMove(); freeMouse(); }
  const root = portRoots[kind] || (portRoots[kind] = host.attachShadow({ mode: 'open' }));
  if (!root.fmBound) {
    root.fmBound = true;
    root.addEventListener('click', (ev) => { const b = ev.target.closest('[data-px-source]'); if (!b) { if (ev.target.closest('button,a')) ev.preventDefault(); return; } ev.preventDefault(); const e = seat && seat.m.eng; if (e) { e.api.click(b.getAttribute('data-px-source')); paintCab(true); } });
    for (const n of ['input', 'change']) root.addEventListener(n, (ev) => { const el = ev.target, t = el.getAttribute && el.getAttribute('data-px-source'); const e = seat && seat.m.eng; if (t && e) e.api.input(t, el.value, el.checked, n); });
  }
  root.innerHTML = portCSS(css || '') + html; if (kind === 'modal') host.classList.add('on');
}
$('port').addEventListener('click', (ev) => { if (ev.target === $('port') && seat && seat.m.eng) { seat.m.eng.api.closeModal(); paintCab(true); } });

/* fullscreen: four generations of games, one button (see README) */
/* a game shows its frame full-window either by itself (it styles its own frame), through fullscreenHost, or by telling the host with a message
   ({type:'px-fullscreen', on} from Genesis 21 and Plebs & Legends, {px:'archive-fullscreen', on} from The Archive) */
function frameFull(e, on) {
  const f = e.frame;
  if (on) { f.style.cssText = ['position:fixed', 'inset:0', 'left:0', 'top:0', 'width:100vw', 'height:100vh', 'visibility:visible', 'pointer-events:auto', 'z-index:2147483000', 'border:0', 'background:#000'].map((x) => x + '!important').join(';'); f.removeAttribute('aria-hidden'); f.tabIndex = 0; }
  else { f.style.cssText = ''; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; }
}
addEventListener('message', (ev) => {
  const d = ev.data; if (!d || typeof d !== 'object') return;
  const on = d.type === 'px-fullscreen' ? !!d.on : d.px === 'archive-fullscreen' ? !!d.on : null; if (on === null) return;
  const e = engines.find((x) => x.frame.contentWindow === ev.source); if (!e) return;
  frameFull(e, on); if (on) setTimeout(() => { try { e.frame.focus(); } catch (_) { /* ignore */ } }, 60); else { setPort('modal', ''); paintCab(true); }
});
function fsActive(e) {
  if (!e) return false;
  try {
    if (e.fsKind === 'host') return e.fsHostOn;
    if (e.fsKind === 'obj') return !!e.api.fullscreen.active();
    if (typeof e.api.isFullscreen === 'function') return !!e.api.isFullscreen();
    return !!(e.api.ui() || {}).fullscreen;
  } catch (_) { return false; }
}
async function enterFs(e) {
  if (!e || fsActive(e)) return;
  const f = e.frame;
  try {
    if (e.fsKind === 'host') {
      if (!e.hostReg) { e.hostReg = true; e.api.fullscreenHost((on) => (on ? enterFs(e) : exitFs(e))); }
      e.fsHostOn = true; frameFull(e, true);
      try { if (f.requestFullscreen) await f.requestFullscreen({ navigationUI: 'hide' }); } catch (_) { /* the fixed full-window frame is the fallback (iPhone Safari) */ }
      e.api.fullscreen(true);
    } else if (e.fsKind === 'obj') e.api.fullscreen.enter();
    else if (e.fsKind === 'fn') e.api.fullscreen(true);
    else { toast('This machine has no full screen layout.'); return; }
  } catch (err) { console.warn('fullscreen', err); }
  clearMove(); freeMouse(); setTimeout(() => { try { f.focus(); } catch (_) { /* ignore */ } }, 60); setPort('modal', ''); setPort('feature', '');
}
async function exitFs(e) {
  if (!e) return; const f = e.frame;
  try {
    if (e.fsKind === 'host') { if (!e.fsHostOn) return; e.fsHostOn = false; try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (_) { /* ignore */ } e.api.fullscreen(false); frameFull(e, false); }
    else if (e.fsKind === 'obj') { if (e.api.fullscreen.active()) e.api.fullscreen.exit(); }
    else if (e.fsKind === 'fn') { e.api.fullscreen(false); }
    if (document.fullscreenElement && e.fsKind !== 'host') { try { await document.exitFullscreen(); } catch (_) { /* ignore */ } }
  } catch (err) { console.warn('exit fullscreen', err); }
  setTimeout(() => { if (!fsActive(e) && e.fsKind !== 'host') { f.style.cssText = ''; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; } try { canvas.focus(); } catch (_) { /* ignore */ } paintCab(true); }, 120);
}
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && seat && seat.m.eng && fsActive(seat.m.eng)) exitFs(seat.m.eng); });
function toggleFs() { if (!seat || seat.loading) { toast('Sit at a cabinet first.'); return; } const e = seat.m.eng; fsActive(e) ? exitFs(e) : enterFs(e); }

/* bonus lab: every machine gets one way in; the standing flags set in index.html switch the games' Lab and test panels on */
async function openLab() {
  if (!seat || seat.loading || !seat.m.eng) { toast('Sit at a cabinet first, then open its Bonus Lab.'); return false; }
  const m = seat.m, e = m.eng, api = e.api, d = gdoc(e);
  const state = () => { try { const u = api.ui() || {}; return (u.modal || '') + '|' + (u.feature || '') + '|' + (u.lab ? 'lab' : ''); } catch (_) { return ''; } };
  const before = state();
  const tries = [
    () => { if (m.def.labAction) { api.action(m.def.labAction); return true; } return false; },
    () => { if (typeof api.labAvailable === 'function' && !api.labAvailable()) return false; api.action('lab'); return true; },
    () => { const b = d && d.getElementById('labBtn'); if (b && !b.disabled) { b.click(); return true; } return false; },
    () => { if (typeof api.openTest === 'function') { api.openTest(); return true; } return false; },
    () => { const b = d && d.getElementById('testBtn'); if (b) { b.click(); return true; } return false; },
    () => { api.action('preview'); return true; }
  ];
  for (const t of tries) {
    let ran = false; try { ran = t(); } catch (err) { console.warn(err); }
    if (!ran) continue; await sleep(260); if (state() !== before) { paintCab(true); return true; }
  }
  // no lab control answered: the game's own bar carries a TEST or LAB button (its full screen bar is in its page whether shown or not), so press that
  const sel = '#fsTest, [data-fs="test"], [data-fs="lab"], #fsLab, #fsBar [id*="est"], #fsBar [id*="Lab"]', hid = d && d.querySelector(sel);
  if (hid) { try { hid.click(); } catch (_) { /* ignore */ } await sleep(300); if (state() !== before) { paintCab(true); return true; } }
  // still nothing: open the full screen layout, which shows that bar
  await enterFs(e); await sleep(350);
  const bar = d && d.querySelector(sel); if (bar) { try { bar.click(); } catch (_) { /* ignore */ } toast('Bonus Lab opened in the full screen layout.'); return true; }
  toast('Full screen opened. Use the TEST or LAB button on the game\'s bottom bar.'); return false;
}

/* ------------------------------------------------------------------ input ------------------------------------------------------------------ */
/* ---- on-screen buttons: the casino's createScreenButtons, unchanged. Turbo, gamble and bonus-round buttons are drawn on the cabinet's own screen,
   so the crosshair can press them without freeing the mouse. A see-through second layer over the live screen (1400 x 960 canvas units); it runs
   no game logic: the room tells it what the HUD is offering (collect) and what pressing a button means (click). ---- */
function createScreenButtons(cfg) {
  const W = cfg.w || 1400, H = cfg.h || 960, THREE = cfg.THREE, screen = cfg.screenMesh;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.minFilter = THREE.LinearFilter; tex.anisotropy = 4;
  const mesh = new THREE.Mesh(screen.geometry, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  mesh.userData.noShadow = true; mesh.castShadow = false; mesh.receiveShadow = false; mesh.visible = false; mesh.renderOrder = 2; screen.add(mesh);
  const acc = cfg.color || '#e4b457', FONT = '"Josefin Sans",Arial,sans-serif', FLASH = 220;
  let btns = [], panel = null, sig = '', hov = '', flashId = '', flashT = 0;
  const rrect = (x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  function fit(str, maxW, size, weight) {
    let s = size; c.font = (weight || 700) + ' ' + s + 'px ' + FONT;
    while (c.measureText(str).width > maxW && s > 14) { s -= 2; c.font = (weight || 700) + ' ' + s + 'px ' + FONT; }
    if (c.measureText(str).width > maxW) { while (str.length > 3 && c.measureText(str + '…').width > maxW) str = str.slice(0, -1); str += '…'; }
    return str;
  }
  function layout(items) {
    btns = []; panel = null;
    for (const it of items) {
      if (it.kind === 'turbo') btns.push({ id: 'turbo', x: 262, y: 890, w: 270, h: 54, label: it.label + (it.on ? '  ·  ON' : '  ·  OFF'), on: it.on, ref: it.ref });
      else if (it.kind === 'gamble') btns.push({ id: 'gamble', x: 840, y: 890, w: 360, h: 54, label: it.label, ref: it.ref, gold: true });
      else if (it.kind === 'bonus') {   // the bonus strip sits where the printed caption is, so it never covers the reels
        panel = { x: 150, y: 780, w: 1100, h: 92, tag: it.tag, title: it.title, info: it.info };
        c.font = '800 26px ' + FONT; let rx = panel.x + panel.w - 18;
        for (let i = it.items.length - 1; i >= 0; i--) { const b = it.items[i], w = Math.min(430, Math.max(200, c.measureText(b.label).width + 76)); rx -= w; btns.push({ id: 'bonus' + i, x: rx, y: panel.y + 16, w, h: 60, label: b.label, ref: b.ref, cta: true }); rx -= 14; }
        panel.textW = Math.max(120, rx - panel.x - 30);
      }
    }
  }
  function paint(now) {
    c.clearRect(0, 0, W, H);
    if (panel) {
      c.save(); c.shadowColor = acc; c.shadowBlur = 24; c.fillStyle = 'rgba(5,7,13,.92)'; rrect(panel.x, panel.y, panel.w, panel.h, 22); c.fill(); c.shadowBlur = 0; c.lineWidth = 3; c.strokeStyle = acc; c.stroke(); c.restore();
      c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = acc; c.fillText(fit(panel.tag + (panel.title ? '  ·  ' + panel.title : ''), panel.textW, 24, 800), panel.x + 28, panel.y + 30);
      c.fillStyle = '#d8dbe6'; c.fillText(fit(panel.info, panel.textW, 20, 600), panel.x + 28, panel.y + 62);
    }
    for (const b of btns) {
      const hot = hov === b.id, flash = flashId === b.id && now - flashT < FLASH, fill = b.on || b.cta || flash;
      c.save(); c.shadowColor = b.gold ? '#ffd76a' : acc; c.shadowBlur = fill || hot ? 26 : 8;
      c.fillStyle = flash ? '#ffffff' : fill ? (b.gold ? '#ffd76a' : acc) : b.gold ? 'rgba(46,34,8,.92)' : 'rgba(6,8,14,.9)'; rrect(b.x, b.y, b.w, b.h, b.h / 2); c.fill(); c.shadowBlur = 0;
      c.lineWidth = hot ? 5 : 3; c.strokeStyle = hot ? '#ffffff' : b.gold ? '#ffd76a' : acc; c.stroke(); c.restore();
      c.fillStyle = fill ? '#06080e' : b.gold ? '#ffe9a8' : '#f4f1e6'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(fit(b.label, b.w - 36, b.cta ? 28 : 24, 800), b.x + b.w / 2, b.y + b.h / 2 + 1);
    }
  }
  return {
    mesh,
    sync(active, now) {   // called every frame while the machine is live; repaints only when what is offered (or the hover or flash) changed
      if (mesh.visible !== !!active) mesh.visible = !!active;
      if (!active) { if (hov || btns.length || panel) { hov = ''; sig = ''; btns = []; panel = null; } return; }
      const items = cfg.collect() || [], fl = flashId && now - flashT < FLASH ? flashId : '';
      const s2 = JSON.stringify(items.map((i) => [i.kind, i.label, i.on, i.tag, i.title, i.info, i.items && i.items.map((x) => x.label)])) + '|' + hov + '|' + fl;
      if (s2 === sig) return; sig = s2; layout(items); paint(now); tex.needsUpdate = true;
    },
    at(x, y) { if (!mesh.visible) return null; for (const b of btns) if (x >= b.x - 10 && x <= b.x + b.w + 10 && y >= b.y - 10 && y <= b.y + b.h + 10) return b; return null; },
    hover(b) { const id = b ? b.id : ''; if (id !== hov) { hov = id; sig = ''; } },
    click(b) { flashId = b.id; flashT = performance.now(); sig = ''; try { if (cfg.sfx) cfg.sfx(); } catch (e) { /* ignore */ } try { cfg.click(b); } catch (e) { console.warn('machine button failed', e); } },
    get buttons() { return btns.map((b) => ({ id: b.id, label: b.label, x: b.x, y: b.y, w: b.w, h: b.h })); },
  };
}
const pxScreenOv = new WeakMap(), pxOvRay = new T.Raycaster(), pxOvV = new T.Vector2(), pxPtr = { x: 0, y: 0, on: false };
let pxOvLast = null, pxOvAt = 0;
function pxOvOffers() {
  const out = []; if (!seat || seat.loading || seat.out || !seat.m.eng || modalOpen() || fsActive(seat.m.eng)) return out;
  const txt = (el) => (el ? el.textContent : '').replace(/\s+/g, ' ').trim(), fr = portRoots.feature;
  if (fr && portLast.feature) {
    const fb = fr.querySelector('#featureBar');
    if (fb && !fb.hidden) {
      const items = [...fr.querySelectorAll('#fbBody button')].filter((b) => !b.disabled && !b.classList.contains('pick') && !b.hasAttribute('data-pick'));   // the numbered picks are pressed by tapping the screen itself
      if (items.length) out.push({ kind: 'bonus', tag: txt(fr.querySelector('#fbTag')), title: txt(fr.querySelector('#fbTitle')), info: txt(fr.querySelector('#fbInfo')), items: items.map((b) => ({ label: txt(b).toUpperCase() || 'GO', ref: b })) });
    }
  }
  const gb = $('cGamble'); if (gb && !gb.hidden && !gb.disabled) out.push({ kind: 'gamble', label: txt(gb), ref: gb });
  const tb = $('cTurbo'); if (tb) out.push({ kind: 'turbo', label: 'TURBO', on: tb.getAttribute('aria-pressed') === 'true', ref: tb });
  return out;
}
function pxOvFor(m) {
  let o = pxScreenOv.get(m.model);
  if (!o) { if (!m.screenMesh || !m.screenMesh.geometry) return null; o = createScreenButtons({ THREE: T, screenMesh: m.screenMesh, color: m.accent || '#e4b457', collect: pxOvOffers, click: (b) => b.ref.click() }); pxScreenOv.set(m.model, o); }
  return o;
}
function pxOvHit(o, m) {   // which on-screen button the crosshair (or the mouse, when it is free) is resting on
  const r = canvas.getBoundingClientRect(), cx = locked ? r.left + r.width / 2 : pxPtr.x, cy = locked ? r.top + r.height / 2 : pxPtr.y;
  pxOvV.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); pxOvRay.setFromCamera(pxOvV, camera);
  const h = m.screenMesh && pxOvRay.intersectObject(m.screenMesh, false)[0];
  return h && h.uv ? o.at(h.uv.x * 1400, (1 - h.uv.y) * 960) : null;
}
function pxOvFrame() {
  const m = seat && !seat.loading && !seat.out && seat.m.model && seat.m.eng ? seat.m : null;
  if (pxOvLast && (!m || pxOvLast.m !== m)) { pxOvLast.o.sync(false, 0); pxOvLast = null; }
  if (!m) return; const o = pxOvFor(m); if (!o) return; pxOvLast = { o, m };
  const now = performance.now(); if (now - pxOvAt < 40) return; pxOvAt = now;
  o.sync(true, now);
  if (o.buttons.length) { o.hover(locked || pxPtr.on ? pxOvHit(o, m) : null); o.sync(true, now); } else o.hover(null);
}

const ray = new T.Raycaster(), ptr = new THREE.Vector2();
const lookBy = (dx, dy, k) => { player.yaw -= dx * k; player.pitch = clamp(player.pitch - dy * k, -WALK.pitch, WALK.pitch); };
function setRay(cx, cy) { const r = canvas.getBoundingClientRect(); ptr.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, camera); }
const rayAt = (ev) => { const r = canvas.getBoundingClientRect(); return locked ? [r.left + r.width / 2, r.top + r.height / 2] : [ev.clientX, ev.clientY]; };
/* which cabinet is under the pointer (the casino's clickCand: within 5.5 m) */
function clickCand(cx, cy) {
  setRay(cx, cy); let best = null, bd = 5.5;
  for (const m of machines) { const h = ray.intersectObject(m.group, true).find((x) => x.object.visible); if (h && h.distance < bd) { bd = h.distance; best = m; } }
  return best;
}
/* the connected cabinet's own surface: its buttons, lever and screen (the casino's machineSurfaceClick) */
function surfaceClick(ev) {
  if (!seat || seat.loading || seat.out || !seat.m.model || !seat.m.eng) return false;
  if (performance.now() - seat.t0 < 300 || performance.now() - lastDragAt < 100) return false;
  const [cx, cy] = rayAt(ev); setRay(cx, cy);
  const hit = ray.intersectObject(seat.m.model, true).find((h) => h.object.visible && (h.object.name === 'px-screenMesh' || h.object.userData.pxMachineAction || (h.object.parent && h.object.parent.userData && h.object.parent.userData.pxMachineAction)));
  if (!hit) return false;
  let o = hit.object; while (o && !o.userData.pxMachineAction && o.name !== 'px-screenMesh') o = o.parent;
  if (o && o.userData.pxMachineAction) { act(o.userData.pxMachineAction); return true; }
  if (hit.uv) { const sx = hit.uv.x * 1400, sy = (1 - hit.uv.y) * 960, ov = pxScreenOv.get(seat.m.model), bx = ov && ov.at(sx, sy); if (bx) { ov.click(bx); paintCab(true); return true; } seat.m.eng.api.tap(sx, sy); paintCab(true); return true; }
  return false;
}
function roomClick(ev) {   // a click (not a drag) while walking
  if (seat && seat.here && surfaceClick(ev)) return;
  const c = locked ? cand : clickCand(ev.clientX, ev.clientY);
  if (c) { if (!(seat && seat.m === c)) sit(c); } else if (!locked) tryLock();
}
let drag = null;
canvas.addEventListener('mousedown', (e) => { if (e.button) return; canvas.focus(); if (!walkLive()) return; drag = { moved: 0, px: e.clientX, py: e.clientY }; });
addEventListener('mousemove', (e) => {
  if (!walkLive()) return;
  if (locked) lookBy(e.movementX, e.movementY, WALK.look);
  else if (drag) { const dx = e.clientX - drag.px, dy = e.clientY - drag.py; drag.moved += Math.abs(dx) + Math.abs(dy); lookBy(dx, dy, WALK.drag); drag.px = e.clientX; drag.py = e.clientY; }
});
addEventListener('mouseup', (e) => {
  if (!drag) return; const click = drag.moved < 5; if (!click) lastDragAt = performance.now(); drag = null;
  if (!click || !walkLive()) return; roomClick(e);
});
/* the pointer shows as a hand over something you can use, as the casino does while the mouse is free */
canvas.addEventListener('pointermove', (ev) => { if (ev.pointerType === 'touch') return; canvas.style.cursor = locked ? '' : (cand || (seat && seat.here && clickCand(ev.clientX, ev.clientY) === seat.m)) ? 'pointer' : 'default'; pxPtr.x = ev.clientX; pxPtr.y = ev.clientY; pxPtr.on = true; });
canvas.addEventListener('pointerleave', () => { pxPtr.on = false; });
/* touch: one finger looks, a tap plays (the joystick walks) */
let tdrag = null;
canvas.addEventListener('pointerdown', (ev) => { if (ev.pointerType !== 'touch') return; tdrag = { x: ev.clientX, y: ev.clientY, id: ev.pointerId, moved: 0 }; try { canvas.setPointerCapture(ev.pointerId); } catch (_) { /* ignore */ } canvas.focus(); });
canvas.addEventListener('pointermove', (ev) => {
  if (!tdrag || ev.pointerId !== tdrag.id || ev.pointerType !== 'touch') return; const dx = ev.clientX - tdrag.x, dy = ev.clientY - tdrag.y; tdrag.moved += Math.abs(dx) + Math.abs(dy);
  if (tdrag.moved > 10 && walkLive()) lookBy(dx, dy, WALK.touchLook); tdrag.x = ev.clientX; tdrag.y = ev.clientY;
});
const tEnd = (ev) => { if (!tdrag || ev.pointerId !== tdrag.id) return; const t = tdrag; tdrag = null; try { canvas.releasePointerCapture(ev.pointerId); } catch (_) { /* ignore */ } if (t.moved < 10 && walkLive()) roomClick(ev); };
canvas.addEventListener('pointerup', tEnd); canvas.addEventListener('pointercancel', () => { tdrag = null; });
const isTyping = (ev) => { const t = (ev.composedPath && ev.composedPath()[0]) || ev.target; return t && t.matches && t.matches('input,textarea,select,[contenteditable]'); };
const WALKKEY = /^(Key[WASD]|Arrow(Up|Down|Left|Right)|Shift(Left|Right))$/;
addEventListener('keydown', (ev) => {
  if (isTyping(ev) || ev.metaKey || ev.ctrlKey || ev.altKey) return;
  const c = ev.code;
  if (c === 'Escape') { if (anySheetOpen()) { closeSheets(); closeDir(); } else if (seat) { const u = seat.m.eng && !seat.loading && seat.m.eng.api.ui(); if (u && u.modal) { seat.m.eng.api.closeModal(); paintCab(true); } else leave(); } ev.preventDefault(); return; }
  if (c === 'KeyG') { ev.preventDefault(); toggleDir(); return; } if (c === 'KeyH') { ev.preventDefault(); toggleSheet('help'); return; }
  if (seat) {   // the casino's handleMachineKey
    if (modalOpen()) return;
    if (seat.here && mode === 'walk' && WALKKEY.test(c)) { keys[c] = true; if (c.startsWith('Arrow')) ev.preventDefault(); return; }
    if (ev.repeat) return;
    if (c === 'KeyQ') { ev.preventDefault(); freeMouse(); clearMove(); document.body.classList.toggle('more'); return; }
    if (c === 'KeyF') { ev.preventDefault(); toggleFs(); return; } if (c === 'KeyL') { ev.preventDefault(); openLab(); return; } if (c === 'KeyV') { ev.preventDefault(); $('cView').click(); return; }
    if (c === 'KeyE') { ev.preventDefault(); const next = seat.here && mode === 'walk' ? nearest() : null; if (next && next !== seat.m) { if (leave()) sit(next); } else leave(); return; }
    const map = { Space: 'spin', BracketLeft: 'betDown', BracketRight: 'betUp', KeyT: 'turbo', KeyM: 'sound' }; if (!seat.here) Object.assign(map, { ArrowLeft: 'betDown', ArrowRight: 'betUp', KeyA: 'auto' });
    if (map[c]) { ev.preventDefault(); act(map[c]); } else if (/^Digit[1-9]$/.test(c) && seat.m.eng && !seat.loading) { ev.preventDefault(); seat.m.eng.api.key(c, ev.key); paintCab(true); }
    return;
  }
  if (mode !== 'walk') return;
  if (WALKKEY.test(c)) { keys[c] = true; if (c.startsWith('Arrow')) ev.preventDefault(); return; }
  if (!ev.repeat && (c === 'KeyE' || c === 'Enter' || c === 'Space') && cand) { ev.preventDefault(); sit(cand); }
});
addEventListener('keyup', (ev) => { delete keys[ev.code]; });
addEventListener('blur', () => { for (const k in keys) delete keys[k]; });
/* touch joystick */
{ const j = $('joy'), knob = j.firstElementChild; let id = null;
  const set = (ev) => { const r = j.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = (ev.clientX - cx) / (r.width / 2), dy = (ev.clientY - cy) / (r.height / 2); const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; } joy.x = dx; joy.y = dy; knob.style.transform = `translate(${dx * 36}px,${dy * 36}px)`; };
  j.addEventListener('pointerdown', (ev) => { id = ev.pointerId; j.setPointerCapture(id); set(ev); }); j.addEventListener('pointermove', (ev) => { if (ev.pointerId === id) set(ev); });
  const end = (ev) => { if (ev.pointerId !== id) return; id = null; joy.x = joy.y = 0; knob.style.transform = ''; }; j.addEventListener('pointerup', end); j.addEventListener('pointercancel', end); }

/* ------------------------------------------------------------------ HUD wiring ------------------------------------------------------------------ */
document.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('button'); if (b && b !== $('introGo')) setTimeout(() => b.blur(), 0); }, true);
$('cSpin').onclick = () => act('spin'); $('cBetDown').onclick = () => act('betDown'); $('cBetUp').onclick = () => act('betUp'); $('cAuto').onclick = () => act('auto'); $('cTurbo').onclick = () => act('turbo');
$('cGamble').onclick = () => act('gamble'); $('cSound').onclick = () => act('sound'); $('cPays').onclick = () => act('pays'); $('cLab').onclick = () => openLab(); $('cFs').onclick = () => toggleFs(); $('cLeave').onclick = () => leave();
/* the casino's two buttons: PLAY HERE (stay where you stand) and CABINET VIEW / SCREEN VIEW (the camera goes to the cabinet, the mouse is free) */
$('cHere').onclick = () => setView('here');
$('cView').onclick = () => { if (!seat) return; setView(seat.here || seat.view === 'screen' ? 'cab' : 'screen'); };
$('cMore').onclick = () => { freeMouse(); clearMove(); document.body.classList.toggle('more'); };
function paintHud() {
  const walking = walkLive(), view = !!seat && !seat.here;
  document.body.classList.toggle('view', view);
  $('cross').hidden = !walking; $('cross').classList.toggle('on', !!cand);
  $('hint').hidden = !walking || touch; $('lockhint').hidden = !walking || touch || locked;
  $('hint').textContent = seat ? 'WASD WALK · MOUSE LOOK · SPACE SPIN · Q MORE CONTROLS · E DISCONNECT · ESC FREES THE MOUSE' : 'WASD WALK · MOUSE LOOK · SHIFT RUNS · E OR CLICK A CABINET TO PLAY · G MACHINES · ESC FREES THE MOUSE';
  $('cHere').setAttribute('aria-pressed', String(!!seat && seat.here));
  const v = $('cView'), t = seat && (seat.here || seat.view === 'screen') ? 'CABINET VIEW' : 'SCREEN VIEW'; if (v.textContent !== t) v.textContent = t;
  const p = $('prompt'), show = walking && !!cand;
  p.hidden = !show; if (show) { const tx = (touch ? 'TAP' : 'E') + ' · ' + (seat && seat.m === cand ? 'DISCONNECT ' : 'PLAY HERE · ') + cand.name.toUpperCase(); if (p.textContent !== tx) p.textContent = tx; }
}
const sheets = ['test', 'help'];
function closeSheets() { for (const s of sheets) { $(s).hidden = true; } $('bTest').setAttribute('aria-pressed', 'false'); $('bHelp').setAttribute('aria-pressed', 'false'); }
function anySheetOpen() { return sheets.some((s) => !$(s).hidden) || !$('dir').hidden; }
function toggleSheet(name) { const was = !$(name).hidden; closeSheets(); closeDir(); if (!was) { freeMouse(); clearMove(); $(name).hidden = false; $(name === 'test' ? 'bTest' : 'bHelp').setAttribute('aria-pressed', 'true'); if (name === 'test') paintTest(); } }
document.querySelectorAll('[data-close]').forEach((b) => { b.onclick = () => closeSheets(); });
$('bTest').onclick = () => toggleSheet('test'); $('bHelp').onclick = () => toggleSheet('help');
function closeDir() { $('dir').hidden = true; $('bDir').setAttribute('aria-pressed', 'false'); }
function toggleDir() { const was = !$('dir').hidden; closeSheets(); closeDir(); if (!was) { freeMouse(); clearMove(); $('dir').hidden = false; $('bDir').setAttribute('aria-pressed', 'true'); renderDir(); } }
$('bDir').onclick = toggleDir; $('dirClose').onclick = closeDir;
function renderDir() {
  const ol = $('dirList'); if ($('dir').hidden && ol.childElementCount) return; ol.textContent = '';
  for (const m of machines) {
    const li = document.createElement('li'); if (seat && seat.m === m) li.className = 'here';
    const b = document.createElement('button'); b.type = 'button';
    b.innerHTML = `<span class="no">${String(m.no).padStart(2, '0')}</span><span class="sw" style="color:${m.accent}"></span><span class="nm"></span><span class="st">${seat && seat.m === m ? 'PLAYING' : m.model ? 'NEAR' : ''}</span>`;
    b.querySelector('.nm').textContent = m.name; b.title = 'Walk to ' + m.name;
    b.onclick = () => { if (seat && !leave()) return; teleport(m); mode = 'walk'; closeDir(); canvas.focus(); tryLock(); };
    li.appendChild(b); ol.appendChild(li);
  }
}
$('prompt').onclick = () => { const m = nearest(); if (!m) return; if (seat && seat.m === m) leave(); else sit(m); };
function paintTest() {
  const e = seat && seat.m.eng; $('tLab').disabled = !(seat && !seat.loading); $('tFs').disabled = !(seat && !seat.loading); $('tResetMachine').disabled = !seat;
  $('tLabNote').textContent = seat ? 'Opens the ' + seat.m.name + ' Bonus Lab (or its test panel), where you pick any bonus round or special event and play it now.' : 'Sit at a cabinet first. The Lab lets you pick any bonus round or special event and play it now, on a separate lab balance.';
  statsText();
}
function statsText() {
  const i = renderer.info; $('stats').textContent = `cabinets loaded        ${machines.filter((m) => m.model).length} of ${machines.length}  (${STREAM ? 'streamed by distance, max ' + (MAX_LOADED + 2) : 'all kept loaded'})\ngame frames alive      ${engines.length}  (max ${MAX_ENGINES})\ndraw calls             ${i.render.calls}\ntriangles              ${i.render.triangles.toLocaleString('en-GB')}\ntextures / geometries  ${i.memory.textures} / ${i.memory.geometries}\nhall                   ${BAYS} bays · ${W} × ${L.toFixed(1)} m`;
}
$('tLab').onclick = () => { closeSheets(); openLab(); }; $('tFs').onclick = () => { closeSheets(); toggleFs(); };
$('tResetBal').onclick = () => { resetStorage((r) => { r.bank = 100000; }); const e = seat && seat.m.eng; if (e) e.api.refreshAccount(); paintBal(); toast('Test balance reset to 100,000.'); };
$('tResetMachine').onclick = () => { if (!seat) return; const id = seat.m.id; if (!confirm('Reset the ' + seat.m.name + ' test state (history, meters, settings) and reload the room?')) return; try { seat.m.eng && seat.m.eng.api.deactivate(); } catch (_) { /* ignore */ } resetStorage((r) => { if (r.layrGames) delete r.layrGames[id]; r.bank = Math.max(r.bank || 0, 100000); }); location.reload(); };
$('tResetAll').onclick = () => { if (!confirm('Reset the test balance and the state of EVERY machine in this room, then reload?')) return; resetStorage((r) => { r.layrGames = {}; r.bank = 100000; }); location.reload(); };
$('tSprint').onclick = () => { sprintAll = !sprintAll; $('tSprint').setAttribute('aria-pressed', String(sprintAll)); };
$('tTourStart').onclick = () => { if (seat && !leave()) return; teleport(machines[0]); mode = 'walk'; closeSheets(); }; $('tTourEnd').onclick = () => { if (seat && !leave()) return; teleport(machines[machines.length - 1]); mode = 'walk'; closeSheets(); };
const paintBal = () => { try { $('bal').textContent = fmt(LAYR.balance()); } catch (_) { /* ignore */ } };

/* ------------------------------------------------------------------ main loop ------------------------------------------------------------------ */
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (seat && !seat.here) aimSeat(); }
addEventListener('resize', resize); resize();
let last = performance.now(), t0 = last, streamAt = 0, uiAt = 0, running = false, promptFor = null;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - last) / 1000); last = now; const t = (now - t0) / 1000;
  const eng = seat && seat.m.eng, inFs = eng && fsActive(eng);
  // pump every live game frame: browsers pause animation frames in hidden frames
  if (eng) { try { eng.frame.contentWindow.__pxPump && eng.frame.contentWindow.__pxPump(); } catch (_) { /* ignore */ } }
  if (running) {
    if (mode === 'walk') {
      let fwd = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - joy.y, strafe = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0) + joy.x;
      const mag = Math.hypot(fwd, strafe), len = mag > 1 ? mag : 1; if (mag > 1) { fwd /= mag; strafe /= mag; }
      const sp = ((keys.ShiftLeft || keys.ShiftRight || sprintAll) ? WALK.sprint : WALK.speed) * (sprintAll ? 2 : 1) * dt;
      if (mag > 0.05) {
        const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw), rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw);
        player.x += (fx * fwd + rx * strafe) * sp; player.z += (fz * fwd + rz * strafe) * sp; bob += dt * WALK.bobRate * Math.min(1, mag);
      }
      player.x = Math.max(-LIMIT.x, Math.min(LIMIT.x, player.x)); player.z = Math.max(LIMIT.zMin, Math.min(LIMIT.zMax, player.z));
      camera.position.set(player.x, WALK.eye + (mag > 0.05 ? Math.sin(bob) * WALK.bobAmp : 0), player.z); camera.rotation.set(player.pitch, player.yaw, 0);
      curPos.copy(camera.position); curFov += (WALK.fov - curFov) * Math.min(1, dt * 8); if (Math.abs(camera.fov - curFov) > 0.01) { camera.fov = curFov; camera.updateProjectionMatrix(); }
    } else {
      const k = 1 - Math.exp(-dt * 6); curPos.lerp(tgtPos, k); curLook.lerp(tgtLook, k); curFov += (tgtFov - curFov) * k;
      camera.position.copy(curPos); camera.up.set(0, 1, 0); camera.lookAt(curLook); if (Math.abs(camera.fov - curFov) > 0.01) { camera.fov = curFov; camera.updateProjectionMatrix(); }
      if (mode === 'return' && curPos.distanceTo(tgtPos) < 0.06) { mode = 'walk'; camera.rotation.order = 'YXZ'; camera.rotation.set(player.pitch, player.yaw, 0); curFov = WALK.fov; camera.fov = WALK.fov; camera.updateProjectionMatrix(); paintHud(); }
    }
    for (const l of hall.lights) { l.position.z += ((Math.max(-L / 2 + 3, Math.min(L / 2 - 3, player.z)) + l.userData.dz) - l.position.z) * Math.min(1, dt * 2.5); }
    if (now - streamAt > 350) { streamAt = now; streamTick(); }
    // cabinet animation: toppers turn, the lever and button move with the game, as in the casino
    const nowMs = performance.now();
    for (const m of machines) {
      if (!m.model || m.d > 22) continue;
      const live = seat && seat.m === m && !seat.loading && m.eng ? (() => { try { return m.eng.api.mechanics(); } catch (_) { return null; } })() : null;
      if (live && live.lever && live.lever.id !== m.lastLeverSignal) { m.lastLeverSignal = live.lever.id; if (live.lever.elapsed < live.lever.duration) m.leverPull = { start: nowMs - live.lever.elapsed, duration: live.lever.duration, angle: live.lever.angle }; }
      for (const a of m.anims) {
        if (a.role === 'lever') { const p = m.leverPull, u = p ? Math.max(0, Math.min(1, (nowMs - p.start) / p.duration)) : 1; a.o.rotation.x = a.base.x + (p && u < 1 ? Math.sin(u * Math.PI) * p.angle : 0); if (u >= 1) m.leverPull = null; }
        else if (a.role === 'spinPhysical') a.o.position.z = live && live.spinZ != null ? live.spinZ : a.home.z;
        else if (a.role === 'armPivot') a.o.rotation.z += (((live && live.armZ != null) ? live.armZ : a.base.z) - a.o.rotation.z) * (1 - Math.exp(-dt * 12));
        else if (a.role === 'recordGroup') a.o.rotation.z = a.base.z - t * 0.25;
        else a.o.rotation.y = a.base.y + t * (a.role === 'core' ? 0.32 : 0.4);
      }
      const extra = CFG.extras && CFG.extras[m.id]; if (extra) { try { extra(m, t, live, nowMs); } catch (_) { /* a broken extra must not stop the room */ } }
    }
    // the screen: redraw the texture only when the game says it changed
    if (eng && !inFs) { const rev = eng.api.revision(); if (rev !== eng.rev) { eng.rev = rev; eng.tex.needsUpdate = true; } }
    // what you are standing at (the crosshair ring and the E prompt), and the on-screen buttons of the connected cabinet
    { const n = mode === 'walk' ? nearest() : null; if (n !== cand) { cand = n; paintHud(); } }
    pxOvFrame();
    if (now - uiAt > 120) { uiAt = now; if (eng && !inFs && document.activeElement === eng.frame) canvas.focus();   /* a game that grabs focus in its hidden frame must not swallow the room's keys */
      paintBal(); paintCab(); paintHud(); if (!$('test').hidden) statsText(); }
    if (hall.dust) hall.dust.rotation.y = t * 0.01;
  }
  if (!inFs) renderer.render(scene, camera);
}

/* ------------------------------------------------------------------ start ------------------------------------------------------------------ */
(async () => {
  try {
    SIGN_IMG.sign = await loadImg('vendor/brand/parallax-casino-sign.svg').catch(() => null);
    buildHall();
    $('sub').textContent = `${machines.length} MACHINES · STANDALONE · TEST LAYR`;
    $('introCount').textContent = `${machines.length} fruit machines in ${BAYS} bays. New machines are added in registry.js.`;
    if (!LAYR) throw new Error('layr-room-account.js did not load.');
    if (!(await LAYR.acquire())) fail((LAYR.error && LAYR.error()) || 'The test LAYR account is open in another tab. Close that tab and reload.');
    LAYR.subscribe && LAYR.subscribe(paintBal); paintBal();
    // optional deep link for testing: ?at=<id> stands at a machine; &sit=1 sits at it
    const q = new URLSearchParams(location.search), at = q.get('at') && machines.find((m) => m.id === q.get('at'));
    if (at) teleport(at); camera.position.set(player.x, 1.6, player.z); camera.rotation.set(player.pitch, player.yaw, 0); curPos.copy(camera.position);
    resize(); running = true; requestAnimationFrame(frame);
    // stream in the machines around the start while the intro is up
    // load the cabinets while the intro is up: nearest first, and the visitor can go in once the first few are ready
    streamTick(); const total = STREAM ? Math.min(4, machines.filter((m) => m.d < LOAD_R).length) : machines.length, early = Math.min(4, total), t1 = performance.now(), go = $('introGo');
    go.onclick = () => { const iv = $('intro'); if (iv) iv.remove(); renderDir(); canvas.focus(); tryLock(); paintHud(); if (at && q.get('sit')) sit(at); };
    if (q.get('skipintro')) { while (performance.now() - t1 < 120000) { const done = machines.filter((m) => m.model || m.failed).length; if (done >= total) break; await sleep(150); streamTick(); } go.disabled = false; go.click(); return; }
    while (performance.now() - t1 < 150000 && document.getElementById('intro')) {
      const done = machines.filter((m) => m.model || m.failed).length; $('introBar').style.width = (total ? Math.min(100, done / total * 100) : 100) + '%';
      go.disabled = done < early; go.textContent = done >= total ? 'ENTER THE ROOM' : done >= early ? `ENTER NOW · ${done} OF ${total} CABINETS READY` : `LOADING CABINETS · ${done} OF ${total}`;
      if (done >= total) break; await sleep(200); streamTick();
    }
    if (document.getElementById('intro')) { $('introBar').style.width = '100%'; go.disabled = false; go.textContent = 'ENTER THE ROOM'; }
  } catch (e) { fail('The room could not start: ' + (e && e.message || e)); }
})();

/* handle for tests and for whoever links the room into the casino */
window.FM = { machines, player, get seat() { return seat; }, get mode() { return mode; }, sit, leave, teleport, openLab, toggleFs, act, enterFs, exitFs, fsActive, startEngine, loadCabinet, unloadCabinet, engines, renderer, scene, camera, THREE: T, layout: { W, H, L, BAYS, PITCH } };
})();
