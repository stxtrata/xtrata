/* DOG Army cabinet, built with THREE r128 (the room's version) and exported to the packed model format.
   Named parts the room expects: screenMesh, crest (the turning $DOG moon), spinPhysical (MARCH), lever (parachute-crate release lever),
   deck buttons with actions spin, betUp, betDown, auto, pays, and the dog-tag light rows px-tag0 (bottom) .. px-tag7 (top):
   every row is TWO meshes (left and right side column), each with its OWN emissive material, so a host can drive them one by one.
   Theme: an army parade ground under a full moon. Black and bone body, khaki trim, brass buttons, a field-camp tent around the screen. */
function buildDogArmyCabinet(THREE, opts = {}) {
  const machine = new THREE.Group(); machine.name = 'DOG Army cabinet';
  const C = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const texCache = new Map();   // one texture per canvas, so repeated faces share it in the packed model
  const tex = (c, opaque = true, q = .86) => { if (texCache.has(c)) return texCache.get(c); const t = new THREE.CanvasTexture(c); t.userData = { opaque, q }; t.anisotropy = 8; texCache.set(c, t); return t; };
  // The room's key + hemisphere lights add up to roughly 2.5x irradiance, so lit albedo is authored at ALBEDO x the colour it should look like.
  const ALBEDO = .5, dim = (c, k = ALBEDO) => new THREE.Color(c).multiplyScalar(k);
  const std = (color, metal = .2, rough = .5, extra = {}) => { const { raw, ...rest } = extra; return new THREE.MeshStandardMaterial({ color: raw ? color : dim(color), metalness: metal, roughness: rough, ...rest }); };
  const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
  const FONT = '"Inter Display","Inter","DejaVu Sans",Arial,sans-serif';
  const BLACK = std('#1b1a19', .3, .34, { raw: true }), BLACK2 = std('#0d0c0b', .2, .5, { raw: true }), BONE = std('#cdc9bf', .05, .5), KHAKI = std('#9a8a56', .2, .55), OLIVE = std('#4c5330', .05, .8),
    BRASS = std('#c8942c', .5, .32), STEEL = std('#a3a5a3', .55, .34), WOOD = std('#7a5630', .05, .85), INK = std('#0f0e0c', .2, .5, { raw: true }),
    GLOW = basic('#f1eee6'), GLOW_WARM = basic('#ffe0a0');
  const geos = new Map(); const cached = (k, f) => { if (!geos.has(k)) geos.set(k, f()); return geos.get(k); };
  function rrShape(w, h, r) { const s = new THREE.Shape(), a = -w / 2, b = -h / 2; s.moveTo(a + r, b); s.lineTo(a + w - r, b); s.quadraticCurveTo(a + w, b, a + w, b + r); s.lineTo(a + w, b + h - r); s.quadraticCurveTo(a + w, b + h, a + w - r, b + h); s.lineTo(a + r, b + h); s.quadraticCurveTo(a, b + h, a, b + h - r); s.lineTo(a, b + r); s.quadraticCurveTo(a, b, a + r, b); return s; }
  function box(w, h, d, x, y, z, m, parent = machine, r = .03) { const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const R = Math.min(r, w / 3, h / 3, d / 2.1); const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * R, h - 2 * R, Math.max(.001, R * .6)), { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 2 }); g.translate(0, 0, -d / 2 + R); return g; }); const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 32) { const mesh = new THREE.Mesh(cached(`c${r1}|${r2}|${h}|${seg}`, () => new THREE.CylinderGeometry(r1, r2, h, seg)), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  function sphere(r, x, y, z, m, parent = machine, seg = 24) { const mesh = new THREE.Mesh(cached(`s${r}|${seg}`, () => new THREE.SphereGeometry(r, seg, Math.round(seg * .7))), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  function plane(c, w, h, x, y, z, parent = machine, transparent = false, side = THREE.FrontSide, q = .86) { const m = new THREE.MeshBasicMaterial({ map: tex(c, !transparent, q), transparent, alphaTest: transparent ? .02 : 0, side, depthWrite: !transparent }); const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const txt = (g, s, x, y, size, color, weight = '900', font = FONT, track = 0) => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; if ('letterSpacing' in g) g.letterSpacing = track + 'px'; g.fillText(s, x, y); if ('letterSpacing' in g) g.letterSpacing = '0px'; };
  const fit = (g, s, maxW, size, weight = '900') => { g.font = `${weight} ${size}px ${FONT}`; const w = g.measureText(s).width; return w > maxW ? size * maxW / w : size; };
  let seed0 = 1; const rng = s => { let v = s; return () => (v = (v * 16807) % 2147483647) / 2147483647; };

  /* ----- Geometry merging: many small identical parts become one mesh ----- */
  function merge(items) {
    const pos = [], nor = [], uv = [], idx = []; let off = 0; const v = new THREE.Vector3();
    for (const { geo, m } of items) {
      const p = geo.attributes.position, n = geo.attributes.normal, u = geo.attributes.uv, nm = new THREE.Matrix3().getNormalMatrix(m);
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(m); pos.push(v.x, v.y, v.z); v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z); uv.push(u ? u.getX(i) : 0, u ? u.getY(i) : 0); }
      if (geo.index) for (let k = 0; k < geo.index.count; k++) idx.push(geo.index.getX(k) + off); else for (let i = 0; i < p.count; i++) idx.push(i + off);
      off += p.count;
    }
    const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); out.setIndex(idx); return out;
  }
  const M4 = (x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
  function planarUV(geo, w, h, ox = 0, oy = 0, su = 1, sv = 1) { const p = geo.attributes.position, uv = new Float32Array(p.count * 2); for (let i = 0; i < p.count; i++) { uv[i * 2] = (p.getX(i) - ox) / w * su + .5; uv[i * 2 + 1] = (p.getY(i) - oy) / h * sv + .5; } geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return geo; }
  // A brass button: a thin rim and a dome, facing +z.
  const buttonGeo = (r = .03) => cached('btn' + r, () => merge([{ geo: new THREE.CylinderGeometry(r, r * 1.06, r * .22, 10), m: M4(0, 0, 0, Math.PI / 2) }, { geo: new THREE.SphereGeometry(r * .8, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2), m: M4(0, 0, r * .1, Math.PI / 2) }]));
  function buttonRow(pts, mat, parent = machine, r = .03, ry = 0) { const g = buttonGeo(r); const mesh = new THREE.Mesh(merge(pts.map(([x, y, z]) => ({ geo: g, m: M4(x, y, z, 0, ry) }))), mat); parent.add(mesh); return mesh; }
  function grommetRow(pts, mat, parent = machine, r = .017) { const g = cached('grom' + r, () => merge([{ geo: new THREE.TorusGeometry(r, r * .38, 4, 10), m: M4(0, 0, 0) }])); const mesh = new THREE.Mesh(merge(pts.map(([x, y, z]) => ({ geo: g, m: M4(x, y, z) }))), mat); parent.add(mesh); return mesh; }

  /* ----- Procedural textures ----- */
  // Olive-drab canvas: woven threads, mottling, a hint of wear.
  function canvasCloth(w, h, base = [104, 108, 66], seed = 5, scuff = true) {
    const c = C(w, h), g = c.getContext('2d'), r = rng(seed); g.fillStyle = `rgb(${base})`; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, R = 20 + r() * 90; const gr = g.createRadialGradient(x, y, 0, x, y, R); const d = r() < .5 ? 0 : 255; gr.addColorStop(0, `rgba(${d},${d},${d * .8},.07)`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R); }
    g.globalAlpha = .09; for (let y = 0; y < h; y += 3) { g.fillStyle = (y / 3) % 2 ? '#000' : '#fff'; g.fillRect(0, y, w, 1); } for (let x = 0; x < w; x += 3) { g.fillStyle = (x / 3) % 2 ? '#000' : '#fff'; g.fillRect(x, 0, 1, h); } g.globalAlpha = 1;
    if (scuff) { g.globalAlpha = .1; g.fillStyle = '#2a2a14'; for (let i = 0; i < 160; i++) g.fillRect(r() * w, r() * h, 1 + r() * 4, 1); g.globalAlpha = 1; }
    return c;
  }
  // Stencil lettering: draws each letter and cuts bridges so it reads as spray-stencil type.
  const BR = { O: 'h', D: 'v', Q: 'h', A: 'v', R: 'v', G: 'g', M: 'v', Y: 'y', P: 'v', B: 'h', S: 'h', '3': 'h3', '0': 'h', '8': 'h', '6': 'g', '9': 'h', '#': '' };
  function stencil(g, s, cx, cy, size, color, track = .06, bridge = .075) {
    const letters = [...s]; g.font = `900 ${size}px ${FONT}`; const ws = letters.map(ch => g.measureText(ch).width), gap = size * track, total = ws.reduce((a, b) => a + b, 0) + gap * (letters.length - 1);
    const pad = size * .3, t = C(Math.ceil(total + pad * 2), Math.ceil(size * 1.6)), tg = t.getContext('2d'); tg.font = g.font; tg.textBaseline = 'alphabetic'; tg.fillStyle = '#000';
    const base = size * 1.15, cap = size * .73; let x = pad;
    letters.forEach((ch, i) => {
      tg.fillText(ch, x, base); const w = ws[i], k = BR[ch.toUpperCase()] || '', th = size * bridge; tg.save(); tg.globalCompositeOperation = 'destination-out';
      const vcut = fx => tg.fillRect(x + w * fx - th / 2, base - cap - 4, th, cap + 8), hcut = fy => tg.fillRect(x - 2, base - cap * fy - th / 2, w + 4, th);
      if (k === 'h') hcut(.5); else if (k === 'v') vcut(ch.toUpperCase() === 'A' || ch.toUpperCase() === 'M' ? .5 : .3); else if (k === 'g') { tg.fillRect(x + w * .55, base - cap * .55 - th / 2, w * .5, th); } else if (k === 'y') hcut(.5); else if (k === 'h3') { hcut(.74); hcut(.28); }
      tg.restore(); x += w + gap;
    });
    tg.globalCompositeOperation = 'source-in'; tg.fillStyle = color; tg.fillRect(0, 0, t.width, t.height);
    g.drawImage(t, cx - t.width / 2, cy - (base - cap / 2)); return total;
  }
  function moonTex(capAng, dark) {
    const W = 1280, H = 640, c = C(W, H), g = c.getContext('2d'), img = g.createImageData(W, H), d = img.data;
    const hash = (x, y, z) => { let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; h = h ^ (h >>> 16); return (h & 0xffff) / 65535; };
    const sm = t => t * t * (3 - 2 * t), lerp = (a, b, t) => a + (b - a) * t;
    const vn = (x, y, z) => { const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = sm(x - ix), fy = sm(y - iy), fz = sm(z - iz); let r = 0; const v = (a, b, cc) => hash(ix + a, iy + b, iz + cc); return lerp(lerp(lerp(v(0, 0, 0), v(1, 0, 0), fx), lerp(v(0, 1, 0), v(1, 1, 0), fx), fy), lerp(lerp(v(0, 0, 1), v(1, 0, 1), fx), lerp(v(0, 1, 1), v(1, 1, 1), fx), fy), fz); };
    const fbm = (x, y, z, o = 5) => { let a = .5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * vn(x * f, y * f, z * f); a *= .5; f *= 2.03; } return s; };
    const r = rng(33), craters = []; for (let i = 0; i < 230; i++) { const u = r() * 2 - 1, p = r() * Math.PI * 2, s = Math.sqrt(1 - u * u), rad = (i < 12 ? .09 : i < 50 ? .045 : .02) * (.6 + r() * .8); craters.push([s * Math.cos(p), u, s * Math.sin(p), rad]); }
    const L = [-.55, .6, .58]; const ll = Math.hypot(...L);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const th = (j + .5) / H * Math.PI, ph = (i + .5) / W * Math.PI * 2, x = -Math.cos(ph) * Math.sin(th), y = Math.cos(th), z = Math.sin(ph) * Math.sin(th);
      let m = fbm(x * 1.7 + 9, y * 1.7 + 3, z * 1.7 + 5, 5); const mare = sm(Math.min(1, Math.max(0, (m - .5) / .1))); let hi = fbm(x * 9, y * 9, z * 9, 4);
      let v = lerp(206, 98, mare * .9) + (hi - .5) * 50; // highland vs maria
      for (const [cx, cy, cz, rad] of craters) { const dt = x * cx + y * cy + z * cz; if (dt < Math.cos(rad * 1.7)) continue; const ang = Math.acos(Math.min(1, dt)), t = ang / rad; if (t < 1) v -= (1 - t * t) * 26; else if (t < 1.7) { const e = (t - 1) / .7, side = ((x - cx) * L[0] + (y - cy) * L[1] + (z - cz) * L[2]) / (ang * ll + 1e-6); v += (1 - e) * (14 + side * 38); } }
      { const ang = Math.acos(Math.min(1, Math.abs(z))), pa = sm(Math.min(1, Math.max(0, (capAng + .22 - ang) / .22))); if (pa > 0) v = lerp(v, dark ? 6 + (hi - .5) * 8 : 216 + (hi - .5) * 22, pa * .94); }
      const k = (j * W + i) * 4, cool = (hi - .5) * 6; d[k] = Math.max(0, Math.min(255, v + 4 + cool)); d[k + 1] = Math.max(0, Math.min(255, v + 2)); d[k + 2] = Math.max(0, Math.min(255, v - 8)); d[k + 3] = 255;
    }
    g.putImageData(img, 0, 0); return c;
  }

  /* ===================== Plinth, body and trims ===================== */
  const HW = 1.15, SY = 2.94, SZ = .455;
  box(2.7, .22, 1.52, 0, .11, 0, BLACK2); box(2.74, .05, 1.56, 0, .045, 0, KHAKI, machine, .015); box(2.62, .03, 1.44, 0, .235, 0, GLOW, machine, 0);
  { const lb = box(2.3, 1.56, 1.06, 0, 1.0, 0, BONE); lb.userData.role = 'lowerBody'; }
  box(2.3, 2.32, .98, 0, 2.95, -.04, BLACK);
  for (const y of [1.74, .27]) box(2.38, .075, 1.14, 0, y, 0, KHAKI, machine, .02);
  for (const sx of [-1, 1]) { box(.05, 1.4, .05, sx * 1.15, 1.0, .53, BLACK2, machine, .015); box(.03, 2.2, .03, sx * 1.145, 2.95, .47, GLOW, machine, 0); }
  // Brass button columns down the lower front, either side of the door: a double-breasted tunic.
  for (const sx of [-1, 1]) for (const cx of [1.0, 1.09]) buttonRow(Array.from({ length: 11 }, (_, i) => [sx * cx, .44 + i * .116, .535]), BRASS, machine, .029);

  /* ----- Side panels: webbing straps carrying eight rows of dog tags on each side ----- */
  const ROWS = 8, rowY = i => .98 + i * .4, STRAP = .26, SIDEX = HW + .07 + .0, PANEL_Z = -.02;
  function panelTex() { const w = 360, h = 1368, c = C(w, h), g = c.getContext('2d'); g.fillStyle = '#121211'; g.fillRect(0, 0, w, h); const r = rng(77); g.globalAlpha = .1; for (let y = 0; y < h; y += 4) { g.fillStyle = (y / 4) % 2 ? '#000' : '#777'; g.fillRect(0, y, w, 1); } g.globalAlpha = 1;
    rr(g, 10, 10, w - 20, h - 20, 26, null, '#b9a972', 8); rr(g, 24, 24, w - 48, h - 48, 18, null, '#b9a97255', 2);
    const u = dz => (dz + .51) / 1.02 * w; // offset from the panel centre -> texture x
    for (const dz of [-STRAP, STRAP]) { const x = u(dz), sw = 62; g.fillStyle = '#7b7452'; g.fillRect(x - sw / 2, 30, sw, h - 60); g.fillStyle = '#9a916a'; g.fillRect(x - sw / 2 + 4, 30, 6, h - 60); g.fillRect(x + sw / 2 - 10, 30, 6, h - 60); g.setLineDash([9, 7]); g.strokeStyle = '#2a2618'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - sw / 2 + 12, 30); g.lineTo(x - sw / 2 + 12, h - 30); g.moveTo(x + sw / 2 - 12, 30); g.lineTo(x + sw / 2 - 12, h - 30); g.stroke(); g.setLineDash([]); }
    return c; }
  const panelMat = new THREE.MeshBasicMaterial({ map: tex(panelTex(), true, .8) });
  const tagGeo = cached('tag', () => {
    const w = .2, h = .34, s = rrShape(w, h, .04), hole = new THREE.Path(); hole.absarc(0, h / 2 - .045, .017, 0, Math.PI * 2, true); s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: .014, bevelEnabled: true, bevelSegments: 1, bevelSize: .007, bevelThickness: .006, curveSegments: 5 }); return planarUV(g, w + .014, h + .014); });
  const TAGS = [['DOG', 'ARMY', '3'], ['RUNE', '#3', 'DOG'], ['BLOCK', '840000', 'HALVING'], ['NO', 'TEAM', ''], ['NO', 'PRESALE', ''], ['112,383', 'WALLETS', 'AIRDROP'], ['889,806', 'DOG EACH', ''], ['ALL', 'ARMY', '']];
  function tagTex(i) { const w = 256, h = 435, c = C(w, h), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#eceff0'); gr.addColorStop(.5, '#b9bec2'); gr.addColorStop(1, '#8c9296'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.globalAlpha = .08; for (let y = 0; y < h; y += 3) { g.fillStyle = y % 6 ? '#000' : '#fff'; g.fillRect(0, y, w, 1); } g.globalAlpha = 1;
    rr(g, 20, 20, w - 40, h - 40, 30, null, '#2a2d30', 5); rr(g, 28, 28, w - 56, h - 56, 24, null, '#ffffff88', 2);
    const [a, b, cc] = TAGS[i]; const fa = fit(g, a, 170, 56), fb = fit(g, b, 180, 54); txt(g, a, w / 2, 190, fa, '#1c1e20'); txt(g, b, w / 2, 262, fb, '#1c1e20'); if (cc) txt(g, cc, w / 2, 330, fit(g, cc, 170, 30), '#2f3236', '800', FONT, 3);
    txt(g, '$DOG', w / 2, 110, 28, '#2f3236', '800', FONT, 2); return c; }
  const tags = []; const tagTexs = Array.from({ length: ROWS }, (_, i) => tex(tagTex(i), true, .85));
  const tagRow = cached('tagrow', () => merge([-1, 1].map(s => ({ geo: tagGeo, m: M4(s * STRAP, 0, 0) }))));
  const chainBead = cached('bead', () => new THREE.SphereGeometry(.0085, 5, 3));
  for (const side of [-1, 1]) {
    box(.07, 3.92, 1.12, side * (HW + .035), 2.17, PANEL_Z, BLACK2, machine, .025);
    const pnl = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 3.8), panelMat); pnl.position.set(side * (HW + .0715), 2.17, PANEL_Z); pnl.rotation.y = side * Math.PI / 2; machine.add(pnl);
    const chain = [];
    for (let i = 0; i < ROWS; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: '#a8a8a8', map: tagTexs[i], metalness: .3, roughness: .4, emissive: '#c07a1c', emissiveIntensity: .12 });
      const m = new THREE.Mesh(tagRow, mat); m.position.set(side * (HW + .0715 + .008), rowY(i), PANEL_Z); m.rotation.y = side * Math.PI / 2; m.userData.role = 'tag' + i; machine.add(m); tags.push(m);
      for (const s of [-1, 1]) { const top = .17 + .0, n = 4; const yA = rowY(i) + .17 - .045 + .0, yB = (i < ROWS - 1 ? rowY(i + 1) - .17 + .0 : rowY(i) + .30); for (let k = 0; k <= n; k++) chain.push([0, lerp(yA + .0, yB, k / n) + 0, s * STRAP]); }
    }
    // ball chain joining each tag to the next, and the pins they hang from
    const cm = new THREE.Mesh(merge(chain.map(([_, y, z]) => ({ geo: chainBead, m: M4(side * (HW + .0715 + .02), y, PANEL_Z + z) }))), STEEL); cm.userData.role = 'tagChain'; machine.add(cm);
    for (const s of [-1, 1]) { sphere(.022, side * (HW + .0715 + .02), rowY(ROWS - 1) + .33, PANEL_Z + s * STRAP, BRASS, machine, 10); }
  }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ===================== Marquee: DOG ARMY in stencil type ===================== */
  box(2.46, .5, 1.18, 0, 4.35, -.04, BLACK2, machine, .02); for (const y of [4.1, 4.6]) { box(2.5, .04, 1.2, 0, y, -.04, KHAKI, machine, .012); }
  { const w = 2048, h = 400, c = C(w, h), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#171614'); gr.addColorStop(1, '#0a0908'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rng(9); for (let i = 0; i < 120; i++) { g.globalAlpha = .2 + r() * .6; g.fillStyle = '#ffffff'; g.beginPath(); g.arc(r() * w, r() * h, r() * 1.8 + .4, 0, 7); g.fill(); } g.globalAlpha = 1;
    const mg = g.createRadialGradient(w / 2, 150, 20, w / 2, 150, 900); mg.addColorStop(0, 'rgba(231,229,228,.20)'); mg.addColorStop(1, 'rgba(231,229,228,0)'); g.fillStyle = mg; g.fillRect(0, 0, w, h);
    rr(g, 14, 14, w - 28, h - 28, 30, null, '#b9a972', 6); rr(g, 30, 30, w - 60, h - 60, 22, null, '#b9a97266', 2);
    // sergeant chevrons either side of the name
    for (const [cx, dir] of [[190, 1], [w - 190, 1]]) { for (let k = 0; k < 3; k++) { const y = 105 + k * 52; g.beginPath(); g.moveTo(cx - 90, y); g.lineTo(cx, y + 56); g.lineTo(cx + 90, y); g.lineTo(cx + 90, y + 28); g.lineTo(cx, y + 84); g.lineTo(cx - 90, y + 28); g.closePath(); g.fillStyle = '#c9ba82'; g.fill(); } g.fillStyle = '#e7e5e4'; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rad = k % 2 ? 17 : 40; g.lineTo(cx + Math.cos(a) * rad, 62 + Math.sin(a) * rad); } g.closePath(); g.fill(); }
    g.save(); g.shadowColor = 'rgba(231,229,228,.8)'; g.shadowBlur = 26; stencil(g, 'DOG ARMY', w / 2, 168, 238, '#d9d7d3', .075, .06); g.shadowBlur = 0; stencil(g, 'DOG ARMY', w / 2, 168, 238, '#ece9e4', .075, .06); g.restore();
    txt(g, 'DOG•GO•TO•THE•MOON', w / 2, 316, 50, '#d3c48a', '800', FONT, 14);
    if (opts.wordmark) { const im = opts.wordmark, k = 140 / im.width; g.globalAlpha = .95; g.drawImage(im, w / 2 - 70, 342, 140, im.height * k); g.globalAlpha = 1; }
    plane(c, 2.36, .46, 0, 4.35, .5535, machine, false, THREE.FrontSide, .88); }
  // marquee bulbs
  { const pts = []; for (let k = 0; k < 24; k++) { const x = -1.15 + k * (2.3 / 23); pts.push([x, 4.125, .6]); pts.push([x, 4.575, .6]); } const bg = cached('bulb', () => new THREE.SphereGeometry(.017, 6, 4)); const bm = new THREE.Mesh(merge(pts.map(([x, y, z]) => ({ geo: bg, m: M4(x, y, z) }))), GLOW_WARM); bm.userData.role = 'marqueeBulbs'; machine.add(bm); }
  for (const side of [-1, 1]) { const c = C(512, 256), g = c.getContext('2d'); g.fillStyle = '#0d0c0b'; g.fillRect(0, 0, 512, 256); rr(g, 10, 10, 492, 236, 20, null, '#b9a972', 6); for (let k = 0; k < 3; k++) { const y = 50 + k * 38, cx = 256; g.beginPath(); g.moveTo(cx - 90, y); g.lineTo(cx, y + 44); g.lineTo(cx + 90, y); g.lineTo(cx + 90, y + 22); g.lineTo(cx, y + 66); g.lineTo(cx - 90, y + 22); g.closePath(); g.fillStyle = '#c9ba82'; g.fill(); } const p = plane(c, 1.1, .44, side * 1.2335, 4.35, -.04, machine); p.rotation.y = side * Math.PI / 2; }

  /* ===================== Topper: the $DOG moon ===================== */
  box(.24, .06, .24, 0, 4.64, -.04, KHAKI, machine, .015); cyl(.07, .1, .34, 0, 4.82, -.04, STEEL); cyl(.11, .11, .04, 0, 4.66, -.04, BRASS, machine, 24);
  const beamTex = (() => { const c = C(8, 128), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, 'rgba(255,248,225,0)'); gr.addColorStop(1, 'rgba(255,248,225,.5)'); g.fillStyle = gr; g.fillRect(0, 0, 8, 128); return tex(c, false, 1); })();
  for (const sx of [-1, 1]) {   // searchlights flanking the moon, throwing their beams at it
    const lamp = new THREE.Group(); lamp.position.set(sx * .98, 4.72, -.04); lamp.rotation.z = sx * .86; machine.add(lamp);
    box(.2, .12, .2, 0, -.02, 0, BLACK2, lamp, .02); cyl(.1, .13, .26, 0, .14, 0, KHAKI, lamp, 20); cyl(.095, .095, .02, 0, .278, 0, GLOW_WARM, lamp, 20);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(.24, .09, 1.2, 20, 1, true), new THREE.MeshBasicMaterial({ color: '#ffffff', map: beamTex, transparent: true, opacity: .4, side: THREE.DoubleSide, depthWrite: false })); beam.position.set(0, .9, 0); beam.userData.role = 'searchBeam'; lamp.add(beam); }
  const crest = new THREE.Group(); crest.position.set(0, 5.5, -.04); crest.userData.role = 'crest'; machine.add(crest);
  const MR = .56, ZC = .42, CAP = Math.sqrt(MR * MR - ZC * ZC), logoOpt = opts.logo || null;
  const moonGeo = new THREE.SphereGeometry(MR, 56, 36); { const p = moonGeo.attributes.position, n = moonGeo.attributes.normal; for (let i = 0; i < p.count; i++) { const z = p.getZ(i); if (Math.abs(z) > ZC) { p.setZ(i, Math.sign(z) * ZC); n.setXYZ(i, 0, 0, Math.sign(z)); } } }
  const moonMat = std('#d4d0c6', 0, .92, { map: tex(moonTex(Math.atan2(CAP, ZC), !!(logoOpt && logoOpt.kind === 'white')), true, .88), emissive: '#7c7970', emissiveIntensity: .5 }); const moon = new THREE.Mesh(moonGeo, moonMat); crest.add(moon);
    // The official logo set into the front and back of the moon. Uses art/dog/img/dog-logo-black.png (or -white.png) uncropped when present; otherwise "$DOG" in plain type.
  const logo = logoOpt;
  const plateR = CAP - .016;
  const logoCanvas = (() => { const c = C(1024, 1024), g = c.getContext('2d');
    if (logo && logo.img) { const im = logo.img, iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height, k = 2 * (plateR - .02) / Math.hypot(iw, ih) / (2 * plateR) * 1024; g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, iw, ih, (1024 - iw * k) / 2, (1024 - ih * k) / 2, iw * k, ih * k); }   // uniform scale to fit the whole image inside the ring: never cropped or stretched
    else { txt(g, '$DOG', 512, 470, fit(g, '$DOG', 760, 330), '#141311', '900', FONT, 4); txt(g, 'DOG•GO•TO•THE•MOON', 512, 690, 52, '#3a3832', '800', FONT, 6); txt(g, 'RUNE #3', 512, 330, 56, '#3a3832', '800', FONT, 8); }
    return c; })();
  const logoMat = new THREE.MeshBasicMaterial({ map: tex(logoCanvas, false, .9), transparent: true, alphaTest: .02, depthWrite: false });
  for (const s of [1, -1]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(CAP - .004, .017, 8, 64), BRASS); ring.position.z = s * ZC; crest.add(ring);
    const lp = new THREE.Mesh(new THREE.PlaneGeometry(2 * plateR, 2 * plateR), logoMat); lp.position.z = s * (ZC + .008); if (s < 0) lp.rotation.y = Math.PI; lp.userData.role = s > 0 ? 'moonLogoFront' : 'moonLogoBack'; crest.add(lp);
  }

  /* ===================== Screen: a field-camp tent opening onto the parade ground ===================== */
  const cloth = canvasCloth(512, 512, [58, 62, 34], 5); const clothMat = (rep = 1) => { const t = tex(cloth, true, .85); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  const tentTex = clothMat(); const TENT = new THREE.MeshStandardMaterial({ map: tentTex, color: '#b0b0b0', metalness: 0, roughness: .92, side: THREE.DoubleSide });
  const FW = 2.3, FH = 1.72;    // outer size of the canvas frame; the opening is 2.0 x 1.38 so the screen (1.98 x 1.36) is never covered
  { const outer = rrShape(FW, FH, .05), hole = rrShape(2.0, 1.38, .02); outer.holes.push(hole); const g = new THREE.ExtrudeGeometry(outer, { depth: .035, bevelEnabled: false, curveSegments: 6 }); planarUV(g, 1.2, 1.2, 0, 0, 1, 1); const frame = new THREE.Mesh(g, std('#2e3020', 0, .9)); frame.position.set(0, SY, .452); machine.add(frame); }
  box(2.0, 1.38, .02, 0, SY, .44, INK, machine, 0);
  const screenMat = new THREE.MeshBasicMaterial({ map: tex((() => { const c = C(1400, 960), g = c.getContext('2d'); g.fillStyle = '#0a0b0a'; g.fillRect(0, 0, 1400, 960); return c; })()), color: '#ffffff' });
  const sc = screenMat.map.image, sgc = sc.getContext('2d');
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.36), screenMat); screenMesh.position.set(0, SY, SZ); screenMesh.userData.role = 'screenMesh'; machine.add(screenMesh);
  if (opts.screenImage) { sgc.drawImage(opts.screenImage, 0, 0, 1400, 960); } else {
    // idle placeholder: the parade ground at night
    const g = sgc, gr = g.createLinearGradient(0, 0, 0, 960); gr.addColorStop(0, '#05070a'); gr.addColorStop(.7, '#10151a'); gr.addColorStop(1, '#1c2218'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 960);
    const r = rng(4); for (let i = 0; i < 140; i++) { g.globalAlpha = .3 + r() * .7; g.fillStyle = '#fff'; g.beginPath(); g.arc(r() * 1400, r() * 600, r() * 1.8 + .4, 0, 7); g.fill(); } g.globalAlpha = 1;
    const mg = g.createRadialGradient(700, 280, 10, 700, 280, 360); mg.addColorStop(0, '#f2efe6'); mg.addColorStop(.2, '#d9d5c8'); mg.addColorStop(.21, 'rgba(231,229,228,.18)'); mg.addColorStop(1, 'rgba(231,229,228,0)'); g.fillStyle = mg; g.fillRect(0, 0, 1400, 960);
    g.fillStyle = '#0a0d0a'; g.fillRect(0, 700, 1400, 260); txt(g, 'DOG ARMY', 700, 520, 150, '#e7e5e4'); txt(g, 'FALL IN', 700, 640, 50, '#d3c48a', '800', FONT, 10); }
  screenMat.map.needsUpdate = true;
  // Canvas valance (scalloped, hanging from the ridge), ridge pole, tent poles and finials
  { const n = 10, W = FW, top = 3.96, bot = 3.72, sh = new THREE.Shape(); sh.moveTo(-W / 2, top); sh.lineTo(W / 2, top); sh.lineTo(W / 2, bot + .03); for (let k = n - 1; k >= 0; k--) { const x1 = -W / 2 + (k + 1) * W / n, x0 = -W / 2 + k * W / n; sh.quadraticCurveTo((x0 + x1) / 2, bot - .09, x0, bot + .03); } sh.lineTo(-W / 2, top);
    const g = new THREE.ExtrudeGeometry(sh, { depth: .02, bevelEnabled: true, bevelSize: .008, bevelThickness: .008, bevelSegments: 1, curveSegments: 6 }); planarUV(g, 1.4, .5, 0, 3.84, 1.6, 1.2); const v = new THREE.Mesh(g, TENT); v.position.set(0, 0, .505); machine.add(v);
    const gp = []; for (let k = 0; k < n; k++) gp.push([-W / 2 + (k + .5) * W / n, bot - .01, .538]); grommetRow(gp, BRASS, machine, .015); }
  { const c = C(1024, 96), g = c.getContext('2d'); stencil(g, 'FIELD CAMP · PARADE GROUND', 512, 50, fit(g, 'FIELD CAMP · PARADE GROUND', 900, 62) * .93, '#d8d1ac', .09, .07); const vt = plane(c, 1.35, .127, 0, 3.84, .536, machine, true); vt.material.map.userData.opaque = false; }
  { const rp = cyl(.034, .034, 2.7, 0, 3.97, .56, WOOD, machine, 14); rp.rotation.z = Math.PI / 2; for (const sx of [-1, 1]) { sphere(.055, sx * 1.4, 3.97, .56, BRASS, machine, 14); cyl(.04, .04, .06, sx * 1.33, 3.97, .56, BRASS, machine, 14).rotation.z = Math.PI / 2;
      cyl(.03, .034, 1.92, sx * 1.165, 3.0, .575, WOOD, machine, 12); cyl(.036, .036, .08, sx * 1.165, 2.05, .575, BRASS, machine, 12); cyl(.036, .036, .06, sx * 1.165, 3.92, .575, BRASS, machine, 12); } }
  // tied-back flaps
  function flapGeo(side) { const nu = 8, nv = 30, y0 = SY - .9, y1 = SY + .9, r = rng(side > 0 ? 3 : 8), pos = [], uv = [], idx = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const u = i / nu, v = j / nv, waist = Math.exp(-Math.pow((v - .46) / .14, 2)), w = .16 * (1 - .66 * waist), xo = HW + .02, xi = xo - w - .02 * 0, x = side * (xo + (xi - xo) * u), fold = Math.sin(u * Math.PI * 3.2 + v * 2.2 + (side > 0 ? 0 : 1)) * (.012 + .016 * waist), z = .535 + fold + waist * .035 + Math.sin(v * Math.PI) * .01; pos.push(x, y0 + (y1 - y0) * v, z); uv.push(u * .35, v * 2.2); }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; }
  for (const sx of [-1, 1]) {
    const f = new THREE.Mesh(flapGeo(sx), TENT); machine.add(f);
    const wy = SY - .9 + 1.8 * .46, wx = sx * (HW - .035);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(.062, .013, 6, 18), std('#b7a574', 0, .9)); tie.rotation.x = Math.PI / 2; tie.scale.set(1.0, 1.0, 1.0); tie.position.set(wx, wy, .548); machine.add(tie);
    const rc = new THREE.CatmullRomCurve3([new THREE.Vector3(wx + sx * .03, wy, .6), new THREE.Vector3(wx - sx * .01, wy - .09, .62), new THREE.Vector3(wx + sx * .02, wy - .2, .6)]); machine.add(new THREE.Mesh(new THREE.TubeGeometry(rc, 14, .01, 5, false), std('#b7a574', 0, .9)));
    const tg = cyl(.017, .017, .07, wx + sx * .02, wy - .245, .6, WOOD, machine, 10); tg.rotation.z = sx * .1; sphere(.016, wx + sx * .02, wy - .29, .6, BRASS, machine, 8);
  }
  // sill: groundsheet strip with brass grommets and a laced cord
  { const gp = [], cords = []; for (let k = 0; k < 17; k++) { const x = -1.0 + k * .125; gp.push([x, SY - .745, .492], [x, SY - .835, .492]); }
    grommetRow(gp, BRASS, machine, .017);
    const cg = cached('cord', () => new THREE.BoxGeometry(1, .012, .012)); const len = Math.hypot(.125, .09), ang = Math.atan2(.09, .125);
    for (let k = 0; k < 16; k++) { const xm = -1.0 + (k + .5) * .125; cords.push({ geo: cg, m: M4(xm, SY - .79, .497, 0, 0, (k % 2 ? 1 : -1) * ang, len, 1, 1) }); }
    const lace = new THREE.Mesh(merge(cords), std('#c9b988', 0, .9)); machine.add(lace); }

  /* ===================== Deck and buttons ===================== */
  const deck = new THREE.Group(); deck.position.set(0, 1.82, .62); deck.rotation.x = -.72; machine.add(deck);
  box(2.36, .6, .16, 0, 0, 0, BLACK, deck); box(2.28, .52, .02, 0, 0, .09, INK, deck, 0); box(2.34, .045, .02, 0, .275, .09, KHAKI, deck, .006); box(2.34, .045, .02, 0, -.275, .09, KHAKI, deck, .006);
  buttonRow(Array.from({ length: 21 }, (_, i) => [-1.1 + i * .11, .235, .104]), BRASS, deck, .019); buttonRow(Array.from({ length: 21 }, (_, i) => [-1.1 + i * .11, -.235, .104]), BRASS, deck, .019);
  function label(main, sub, w, h, fg, bg, brd) { const c = C(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); if (brd) { g.strokeStyle = brd; g.lineWidth = h * .035; g.strokeRect(h * .05, h * .05, w - h * .1, h - h * .1); } const fs = fit(g, main, w * .86, h * .42); stencil(g, main, w / 2, h * .42, fs, fg, .04, .07); txt(g, sub, w / 2, h * .8, h * .17, fg, '800', FONT, 3); return c; }
  function pill(main, sub, x, w, color, ink, action) { const ph = .22; const base = box(w, ph + .03, .07, x, -.02, .13, BRASS, deck, .03); const top = box(w - .03, ph, .065, x, -.02, .172, std(color, .1, .45), deck, .03); const face = plane(label(main, sub, Math.round((w - .06) * 1500), Math.round((ph - .04) * 1500), ink, color), w - .06, ph - .04, x, -.02, .2085, deck); [base, top, face].forEach(m => { m.userData.action = action; }); return top; }
  pill('ORDERS', 'PAYS', -.86, .4, '#e7e5e4', '#16150f', 'pays'); pill('−DOGS', 'BET −', -.44, .36, '#c8b883', '#16150f', 'betDown'); pill('+DOGS', 'BET +', -.04, .36, '#c8b883', '#16150f', 'betUp'); pill('AUTO-MARCH', 'AUTO', .44, .52, '#5b623a', '#ece6c8', 'auto');
  { const ring = cyl(.255, .255, .06, .96, -.02, .12, BRASS, deck, 48); ring.rotation.x = Math.PI / 2; ring.userData.action = 'spin';
    const c = C(512, 512), g = c.getContext('2d'); const gr = g.createRadialGradient(200, 190, 20, 256, 256, 280); gr.addColorStop(0, '#7b8350'); gr.addColorStop(.7, '#5b623a'); gr.addColorStop(1, '#434a2a'); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); g.translate(256, 256); g.rotate(-Math.PI / 2); g.translate(-256, -256);
    g.strokeStyle = '#ece6c8'; g.lineWidth = 8; g.beginPath(); g.arc(256, 256, 230, 0, 7); g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(256, 256, 214, 0, 7); g.stroke();
    stencil(g, 'MARCH', 256, 238, fit(g, 'MARCH', 360, 118), '#f1ecd2', .05, .07); txt(g, 'SPIN', 256, 345, 56, '#f1ecd2', '800', FONT, 8);
    g.fillStyle = '#ece6c8'; for (let k = 0; k < 3; k++) { const y = 92 + k * 20; g.beginPath(); g.moveTo(206, y + 14); g.lineTo(256, y); g.lineTo(306, y + 14); g.lineTo(306, y + 24); g.lineTo(256, y + 10); g.lineTo(206, y + 24); g.fill(); }
    const capMat = new THREE.MeshStandardMaterial({ map: tex(c, true, .88), color: '#8a8a8a', metalness: .1, roughness: .62 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(.215, .22, .07, 48), [BRASS, capMat, BRASS]); top.rotation.x = Math.PI / 2; top.position.set(.96, -.02, .18); top.userData.role = 'spinPhysical'; top.userData.action = 'spin'; deck.add(top); }

  /* ===================== Lever: a parachute-crate release lever ===================== */
  { const LX = HW + .2;
    box(.14, .54, .44, HW + .13, 2.32, .12, BLACK2, machine, .03); box(.03, .46, .36, HW + .21, 2.32, .12, KHAKI, machine, .01); const hub = cyl(.15, .15, .2, LX - .04, 2.32, .12, BRASS, machine, 28); hub.rotation.z = Math.PI / 2; cyl(.07, .07, .26, LX - .04, 2.32, .12, STEEL, machine, 16).rotation.z = Math.PI / 2;
    const lever = new THREE.Group(); lever.position.set(LX, 2.32, .12); lever.userData.role = 'lever'; machine.add(lever);
    const parts = [];
    parts.push(cyl(.04, .05, .84, 0, .42, 0, STEEL, lever, 16), cyl(.07, .07, .08, 0, .05, 0, BRASS, lever, 18)); parts[1].rotation.z = Math.PI / 2;
    const CW = .44, CH = .38, CD = .3, CY = .98;
    const crateMat = std('#5b623a', .05, .78); parts.push(box(CW, CH, CD, 0, CY, 0, crateMat, lever, .012));
    // painted crate faces: slats, edge bands, stencilled 3
    const paint = (w, h, front) => { const c = canvasCloth(w, h, [84, 90, 48], front ? 21 : 22, true), g = c.getContext('2d'); g.fillStyle = 'rgba(20,22,8,.5)'; for (let k = 1; k < 5; k++) g.fillRect(0, h * k / 5 - 2, w, 4);
      g.fillStyle = '#7d7650'; g.fillRect(0, 0, w, h * .07); g.fillRect(0, h * .93, w, h * .07); if (front) { g.fillStyle = '#80794f'; g.fillRect(w * .5 - 18, 0, 36, h); g.setLineDash([10, 8]); g.strokeStyle = '#1b1a0e'; g.lineWidth = 3; g.strokeRect(w * .5 - 12, 4, 24, h - 8); g.setLineDash([]); g.fillStyle = '#4c5330'; g.fillRect(w * .5 - 100, h * .2, 200, h * .6);
        stencil(g, '3', w * .5, h * .5, h * .62, '#ece8cf', .02, .08); txt(g, 'RELEASE', w * .5, h * .86, h * .075, '#ece8cf', '800', FONT, 6); } else { stencil(g, '3', w * .5, h * .5, h * .5, '#ece8cf', .02, .08); } return c; };
    const frontC = paint(512, 440, true), sideC = paint(360, 440, false); const f1 = plane(frontC, CW - .004, CH - .004, 0, CY, CD / 2 + .005, lever); const f2 = plane(frontC, CW - .004, CH - .004, 0, CY, -CD / 2 - .005, lever); f2.rotation.y = Math.PI;
    for (const s of [-1, 1]) { const pp = plane(sideC, CD - .004, CH - .004, s * (CW / 2 + .005), CY, 0, lever); pp.rotation.y = s * Math.PI / 2; parts.push(pp); }
    parts.push(f1, f2);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) parts.push(box(.045, .045, .05, sx * (CW / 2 - .005), CY + sy * (CH / 2 - .005), CD / 2 - .004, STEEL, lever, .008));
    // webbing strap around the crate top and rods, brass buckle, parachute cord with a D-ring
    parts.push(box(.05, .018, CD + .02, -.1, CY + CH / 2 + .002, 0, std('#b9a972', 0, .8), lever, .004), box(.05, .018, CD + .02, .1, CY + CH / 2 + .002, 0, std('#b9a972', 0, .8), lever, .004));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.06, .013, 8, 20), BRASS); ring.position.set(0, CY + CH / 2 + .075, 0); ring.rotation.y = Math.PI / 2; lever.add(ring); parts.push(ring);
    const cord = new THREE.CatmullRomCurve3([new THREE.Vector3(0, CY + CH / 2 + .02, .0), new THREE.Vector3(.1, CY + CH / 2 + .12, .06), new THREE.Vector3(.26, CY + CH / 2 - .04, .13), new THREE.Vector3(.25, CY - CH / 2 - .02, .16), new THREE.Vector3(.2, CY - CH / 2 - .14, .14), new THREE.Vector3(.14, CY - CH / 2 - .2, .15)]);
    const cm = new THREE.Mesh(new THREE.TubeGeometry(cord, 30, .0105, 6, false), std('#e9dfbc', 0, .85)); lever.add(cm); parts.push(cm, sphere(.022, .14, CY - CH / 2 - .215, .15, std('#e9dfbc', 0, .85), lever, 8));
    parts.forEach(m => { m.userData.action = 'spin'; }); }

  /* ===================== Lower door ===================== */
  box(1.86, 1.2, .035, 0, .985, .535, KHAKI, machine, .012);
  { const c = C(1024, 640), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#1d1c1a'); gr.addColorStop(1, '#0c0b0a'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 640);
    g.globalAlpha = .07; for (let x = 0; x < 1024; x += 5) { g.fillStyle = x % 10 ? '#fff' : '#000'; g.fillRect(x, 0, 1, 640); } g.globalAlpha = 1;
    rr(g, 16, 16, 992, 608, 26, null, '#b9a972', 6); rr(g, 30, 30, 964, 580, 18, null, '#b9a97255', 2);
    const rv = [[48, 48], [976, 48], [48, 592], [976, 592], [512, 40], [512, 600]]; for (const [x, y] of rv) { g.fillStyle = '#c9b27a'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.fillStyle = '#6b5a2c'; g.beginPath(); g.arc(x + 2, y + 2, 4, 0, 7); g.fill(); }
    if (opts.xtrataLogo) opts.xtrataLogo(g, 512, 165, 280);
    g.fillStyle = '#b9a972'; g.fillRect(250, 300, 524, 3);
    // the plate
    g.fillStyle = '#c9ba82'; rr(g, 64, 330, 896, 120, 14, '#c9ba82'); rr(g, 72, 338, 880, 104, 10, null, '#16150f', 3); for (const [x, y] of [[88, 346], [936, 346], [88, 434], [936, 434]]) { g.fillStyle = '#7d6e3a'; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }
    const pl = 'RUNE #3 · NO TEAM · NO PRESALE · ALL ARMY'; const fs = fit(g, pl, 800, 56); stencil(g, pl, 512, 392, fs, '#16150f', .035, .065);
    txt(g, 'DOG•GO•TO•THE•MOON', 512, 505, 44, '#e7e5e4', '800', FONT, 10); txt(g, 'POWERED BY THE XTRATA PROTOCOL', 512, 570, 26, '#b9a972', '700', FONT, 5);
    plane(c, 1.76, 1.1, 0, .985, .5585, machine, false, THREE.FrontSide, .88); }
  for (const sx of [-1, 1]) for (const y of [.62, 1.35]) box(.05, .12, .06, sx * .94, y, .565, STEEL, machine, .012);
  // slots: enlist (left) and souvenir ticket (right)
  box(.46, .12, .07, -.56, .3, .56, KHAKI, machine, .02); box(.34, .026, .02, -.56, .3, .598, INK, machine, 0);
  { const c = C(256, 40), g = c.getContext('2d'); txt(g, 'ENLIST', 128, 22, 30, '#16150f', '800', FONT, 8); const lp = plane(c, .3, .045, -.56, .372, .56, machine, true); lp.rotation.x = -.0; lp.material.map.userData.opaque = false; }
  box(.54, .12, .07, .52, .3, .56, KHAKI, machine, .02); box(.44, .026, .02, .52, .3, .598, INK, machine, 0);
  { const c = C(512, 240), g = c.getContext('2d'); g.fillStyle = '#efe6c8'; g.fillRect(0, 0, 512, 240); g.strokeStyle = '#2c2a1a'; g.setLineDash([8, 6]); g.lineWidth = 3; g.strokeRect(10, 10, 492, 220); g.setLineDash([]);
    if (opts.wordmark) { const im = opts.wordmark, k = 280 / im.width; g.drawImage(im, 256 - 140, 18, 280, im.height * k); }
    txt(g, 'DOG ARMY · SOUVENIR', 256, 150, 36, '#2c2a1a'); txt(g, 'ALL ARMY · NO TEAM · NO PRESALE', 256, 196, 20, '#5a4a1a', '800', FONT, 2);
    const tk = plane(c, .38, .178, .52, .245, .64, machine); tk.rotation.x = -1.15; }

  /* ===================== Back ===================== */
  { const c = C(1024, 200), g = c.getContext('2d'); g.fillStyle = '#0d0c0b'; g.fillRect(0, 0, 1024, 200); stencil(g, 'DOG ARMY', 512, 80, 90, '#e7e5e4', .08); txt(g, 'PARALLAX CASINO · RUNE #3 · XTRATA', 512, 152, 26, '#b9a972', '700', FONT, 4); const p = plane(c, 1.9, .37, 0, 3.4, -.535, machine); p.rotation.y = Math.PI; }
  box(1.96, 1.26, .03, 0, .99, -.535, KHAKI, machine, .012);
  { const c = C(1024, 640), g = c.getContext('2d'); g.fillStyle = '#0d0c0b'; g.fillRect(0, 0, 1024, 640); rr(g, 16, 16, 992, 608, 26, null, '#b9a972', 6);
    for (const [x, y] of [[48, 48], [976, 48], [48, 592], [976, 592]]) { g.fillStyle = '#c9b27a'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); }
    stencil(g, 'RUNE #3', 512, 250, 150, '#e7e5e4', .06, .06); txt(g, 'NO TEAM · NO PRESALE · ALL ARMY', 512, 400, 44, '#b9a972', '800', FONT, 6); txt(g, 'SERVICE ACCESS · KEEP CLEAR', 512, 520, 28, '#6d6648', '700', FONT, 6);
    const bd = plane(c, 1.86, 1.16, 0, .99, -.5515, machine); bd.rotation.y = Math.PI; }
  machine.updateMatrixWorld(true);
  return { machine, crest, screenMesh, tags, logoUsed: !!(logo && logo.img), logoKind: logo ? logo.kind : null };
}

/* Export a THREE group to the packed format the room reads: nodes {p,q,s,visible,role,children,g,m,action},
   de-duplicated geometries, materials and textures (data URLs). */
function packCabinet(THREE, root) {
  const geos = [], gIdx = new Map(), mats = [], mIdx = new Map(), texs = [], tIdx = new Map();
  const R = v => Math.round(v * 1e5) / 1e5, R4 = v => Math.round(v * 1e4) / 1e4, R3 = v => Math.round(v * 1e3) / 1e3;
  const colorInt = c => c ? c.getHex() : 0;
  function texture(t) { if (!t) return null; if (tIdx.has(t.uuid)) return tIdx.get(t.uuid); const img = t.image, opaque = t.userData && t.userData.opaque, q = (t.userData && t.userData.q) || .9; const data = img.toDataURL ? img.toDataURL(opaque ? 'image/jpeg' : 'image/png', q) : img.src; texs.push({ image: data, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); tIdx.set(t.uuid, texs.length - 1); return texs.length - 1; }
  function material(m) { if (mIdx.has(m.uuid)) return mIdx.get(m.uuid); const basic = m.isMeshBasicMaterial; mats.push({ type: basic ? 'basic' : 'standard', color: colorInt(m.color), roughness: basic ? 1 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texture(m.map), emissive: basic ? 0 : colorInt(m.emissive), emissiveIntensity: basic ? 1 : m.emissiveIntensity }); mIdx.set(m.uuid, mats.length - 1); return mats.length - 1; }
  function geometry(g) { if (gIdx.has(g.uuid)) return gIdx.get(g.uuid); const out = { attributes: {} }; for (const k of ['position', 'normal', 'uv']) { const a = g.attributes[k]; if (a) out.attributes[k] = { size: a.itemSize, array: Array.from(a.array, k === 'normal' ? R3 : R4) }; } if (g.index) out.index = Array.from(g.index.array); if (g.groups && g.groups.length) out.groups = g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex })); geos.push(out); gIdx.set(g.uuid, geos.length - 1); return geos.length - 1; }
  function node(o) { const n = { p: o.position.toArray().map(R), q: o.quaternion.toArray().map(R), s: o.scale.toArray().map(R), visible: o.visible, role: (o.userData && o.userData.role) || '', children: [] }; if (o.isMesh) { n.g = geometry(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(material) : material(o.material); } if (o.userData && typeof o.userData.action === 'string') n.action = o.userData.action; o.children.forEach(c => n.children.push(node(c))); return n; }
  return { root: node(root), geometries: geos, materials: mats, textures: texs };
}
