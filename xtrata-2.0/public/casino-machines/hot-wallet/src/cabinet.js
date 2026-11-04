/* Hot Wallet cabinet, built with THREE and exported in the casino's packed-model format ({root, geometries, materials, textures}).
   Run by tools/build-cabinet.mjs (browser). Look: THE HEIST MUSEUM, an exhibit case in dark walnut and brass. The screen sits in a
   museum display-case frame under a brass plaque ("THE HEIST MUSEUM · 2011 to 2026"); the topper is a big steel bank-vault wheel;
   a red alarm beacon sits on each top corner; the head flanks are glass display cases of sealed evidence bags, one for each year
   from 2011 to 2026; the lever is a heavy chrome vault-door handle that travels a brass scale of years. Nothing here uses an
   exchange's logo or any person's likeness; the Xtrata mark on the lower door is drawn with the XLOGO vector code, unmodified.
   Roles: screenMesh, screenGlow, crest (+ crestWheel), spinPhysical, lever, beaconL, beaconR; deck actions spin/betUp/betDown/auto/pays. */
window.buildCabinet = function buildCabinet(opts) {
  const ACC = '#e11d48';
  const machine = new THREE.Group(); machine.name = 'Hot Wallet';
  let seedN = 11; const rnd = () => { seedN |= 0; seedN = seedN + 0x6D2B79F5 | 0; let t = Math.imul(seedN ^ seedN >>> 15, 1 | seedN); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const SANS = '"DejaVu Sans Condensed", "DejaVu Sans", Arial, sans-serif', MONO = '"DejaVu Sans Mono", "Courier New", monospace';
  const text = (g, s, x, y, size, color, weight = '800', font = SANS, align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '700', font = SANS) => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const basic = (color, extra = {}) => new THREE.MeshBasicMaterial(Object.assign({ color }, extra));
  // Text that fits maxW: shrinks the font if needed. Engraved text: a light lip under a dark cut.
  function fit(g, s, x, y, maxW, size, color, weight = '800', font = SANS) { g.font = `${weight} ${size}px ${font}`; const w = g.measureText(s).width; if (w > maxW) size = Math.floor(size * maxW / w); text(g, s, x, y, size, color, weight, font); return size; }
  const etch = (g, s, x, y, size, col = '#262b31', weight = '800', font = SANS, align = 'center') => { text(g, s, x + 1, y + 1.6, size, 'rgba(255,255,255,.42)', weight, font, align); text(g, s, x, y, size, col, weight, font, align); };
  const screw = (g, x, y, r = 6) => { const gr = g.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); gr.addColorStop(0, '#e6eaee'); gr.addColorStop(1, '#6d747b'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1; g.stroke(); g.strokeStyle = 'rgba(20,24,28,.85)'; g.lineWidth = Math.max(1.4, r * .26); const a = (x * 7 + y * 3) % 3; g.beginPath(); g.moveTo(x - r * .7 * Math.cos(a), y - r * .7 * Math.sin(a)); g.lineTo(x + r * .7 * Math.cos(a), y + r * .7 * Math.sin(a)); g.stroke(); };
  const seam = (g, x0, y0, x1, y1) => { g.lineCap = 'butt'; g.strokeStyle = 'rgba(8,10,12,.75)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x0 + (y0 === y1 ? 0 : 2), y0 + (y0 === y1 ? 2.4 : 0)); g.lineTo(x1 + (y0 === y1 ? 0 : 2), y1 + (y0 === y1 ? 2.4 : 0)); g.stroke(); };
  const SERIF = '"DejaVu Serif Condensed", "DejaVu Serif", Georgia, "Times New Roman", serif';
  const lerpHex = (a, b, t) => { const A = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), B = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + A.map((v, k) => Math.round(v + (B[k] - v) * t).toString(16).padStart(2, '0')).join(''); };

  /* ---------- tileable grains: brushed metal (steel, brass) and walnut ---------- */
  function metalCanvas(size, base) {
    const c = canvas(size, size), g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, size, size);
    const wrap = fn => { for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) { g.save(); g.translate(dx, dy); fn(); g.restore(); } };
    for (let i = 0; i < 90; i++) { const x = rnd() * size, y = rnd() * size, r = 40 + rnd() * 140, a = .04 + rnd() * .07, d = rnd() < .5; wrap(() => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, d ? `rgba(20,14,6,${a})` : `rgba(255,248,230,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }); }
    for (let i = 0; i < 2600; i++) { const x = rnd() * size, y = rnd() * size, len = 30 + rnd() * 230, a = .025 + rnd() * .085, l = rnd() < .5; wrap(() => { g.strokeStyle = l ? `rgba(255,250,235,${a})` : `rgba(14,10,4,${a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + .5); g.lineTo(x + len, y + .5); g.stroke(); }); }
    const img = g.getImageData(0, 0, size, size), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 9; d[i] += n; d[i + 1] += n; d[i + 2] += n * 1.05; } g.putImageData(img, 0, 0);
    return c;
  }
  function walnutCanvas(size) {
    const c = canvas(size, size), g = c.getContext('2d');
    g.fillStyle = '#4e2c18'; g.fillRect(0, 0, size, size);
    const wrap = fn => { for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) { g.save(); g.translate(dx, dy); fn(); g.restore(); } };
    for (let i = 0; i < 70; i++) { const y = rnd() * size, h = 6 + rnd() * 40, a = .05 + rnd() * .12, dk = rnd() < .6; wrap(() => { g.fillStyle = dk ? `rgba(22,9,3,${a})` : `rgba(170,105,58,${a * .8})`; g.fillRect(0, y, size, h); }); }
    for (let i = 0; i < 900; i++) { const x = rnd() * size, y = rnd() * size, len = 60 + rnd() * 300, a = .04 + rnd() * .13, amp = 1 + rnd() * 3, ph = rnd() * 6, dk = rnd() < .65, lw = 1 + rnd() * 1.3; wrap(() => { g.strokeStyle = dk ? `rgba(18,7,2,${a})` : `rgba(190,122,72,${a * .8})`; g.lineWidth = lw; g.beginPath(); for (let k = 0; k <= 24; k++) { const px = x + len * k / 24, py = y + Math.sin(ph + k * .5) * amp; k ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }); }
    for (let i = 0; i < 5; i++) { const x = rnd() * size, y = rnd() * size; wrap(() => { for (let k = 1; k < 7; k++) { g.strokeStyle = `rgba(16,6,2,${.16 - k * .018})`; g.lineWidth = 1.6; g.beginPath(); g.ellipse(x, y, 16 + k * 11, 5 + k * 3, 0, 0, 7); g.stroke(); } }); }
    const img = g.getImageData(0, 0, size, size), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 8; d[i] += n; d[i + 1] += n * .8; d[i + 2] += n * .6; } g.putImageData(img, 0, 0);
    return c;
  }
  const mkTex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.jpeg = .82; return t; };
  const STEEL = metalCanvas(512, '#8c98a6'), BRASS = metalCanvas(512, '#a8822f'), WALNUT = walnutCanvas(512);
  const steelTex = mkTex(STEEL), brassTex = mkTex(BRASS), walnutTex = mkTex(WALNUT);
  const tileFill = (SRC, g, x, y, w, h, tint) => { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); for (let ty = y; ty < y + h; ty += 512) for (let tx = x; tx < x + w; tx += 512) g.drawImage(SRC, tx, ty); if (tint) { g.fillStyle = tint; g.fillRect(x, y, w, h); } g.restore(); };
  const steelFill = (g, x, y, w, h, tint) => tileFill(STEEL, g, x, y, w, h, tint), brassFill = (g, x, y, w, h, tint) => tileFill(BRASS, g, x, y, w, h, tint), walnutFill = (g, x, y, w, h, tint) => tileFill(WALNUT, g, x, y, w, h, tint);

  const walnut = std('#ffffff', .1, .6, { map: walnutTex }), walnutDark = std('#bda594', .1, .64, { map: walnutTex });
  const steel = std('#d5dde6', .38, .5, { map: steelTex }), steelDark = std('#8e99a6', .4, .5, { map: steelTex });
  const brass = std('#f1cf86', .85, .3, { map: brassTex }), brassDark = std('#b58f45', .8, .38, { map: brassTex });
  const gun = std('#9b7633', .75, .4, { map: brassTex }), gunDark = std('#35241a', .45, .55, { map: walnutTex });
  const chrome = std('#e6e9ee', .95, .16), black = std('#14110f', .3, .6), rubber = std('#1a1d20', .1, .85);
  const accBasic = basic(ACC), accDim = basic('#6e0d22'), accHot = basic('#ffd9e0'), bulbWarm = basic('#ffd27a'), bulbHot = basic('#fff1c9');
  const LAMP = { g: [basic('#38ff98'), basic('#0d5c36')], a: [basic('#ffb62e'), basic('#6e4a0a')], r: [basic('#ff453a'), basic('#661712')], b: [basic('#4aa8ff'), basic('#123a66')], w: [basic('#f4fff8'), basic('#44544c')] };
  // Brass engraving: a bright face over a dark lip, so plaques read as cut into metal.
  const BRASS_INK = '#3a2608';
  const engrave = (g, s, x, y, size, col = BRASS_INK, weight = '800', font = SERIF, align = 'center') => { text(g, s, x + 1, y + 1.8, size, 'rgba(255,240,200,.55)', weight, font, align); text(g, s, x, y, size, col, weight, font, align); };
  const brassPlate = (g, x, y, w, h, r = 8) => { rr(g, x, y, w, h, r, lin(g, x, y, x, y + h, ['#f5d894', '#c79a45', '#8d6a28', '#d7ae5a'])); rr(g, x + 1.5, y + 1.5, w - 3, h - 3, r, null, 'rgba(255,245,210,.55)', 2); rr(g, x + 5, y + 5, w - 10, h - 10, Math.max(2, r - 3), null, 'rgba(60,38,6,.5)', 2); };
  const goldText = (g, s, x, y, size, maxW, weight = '800', font = SERIF) => { g.font = `${weight} ${size}px ${font}`; const w = g.measureText(s).width; if (w > maxW) size = Math.floor(size * maxW / w); g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(20,8,0,.8)'; g.fillText(s, x + 1.5, y + 2.2); g.fillStyle = lin(g, 0, y - size * .5, 0, y + size * .5, ['#fff0bf', '#e9c46d', '#b78a35']); g.fillText(s, x, y); return size; };

  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    if (r && Math.min(w, h, d) < .09) r = 0;
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const R = Math.min(r, w / 3, h / 3, d / 2.1), s = new THREE.Shape(), a = -w / 2 + R, b = -h / 2 + R, W = w - 2 * R, H = h - 2 * R; s.moveTo(a, b); s.lineTo(a + W, b); s.lineTo(a + W, b + H); s.lineTo(a, b + H); s.closePath(); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 1 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates core and lever).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); if (axis === 'hex') g.rotateY(Math.PI / 6); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine, ws = 10, hs = 8) { const m3 = new THREE.Mesh(cached(`s${r}|${ws}|${hs}`, () => new THREE.SphereGeometry(r, ws, hs)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function tex(c, transparent, q) { if (c.isTexture) return c; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (!transparent) t.jpeg = q || .86; else t.webp = q || .8; return t; }
  // Unlit canvas plane (labels, screens, glowing signs). lit = true makes a steel-lit plane instead.
  function plane(c, w, h, x, y, z, parent = machine, transparent = false, ry = 0, lit = false, q = 0) { const t = tex(c, transparent, q); const m = lit ? std('#ffffff', .35, .5, { map: t }) : new THREE.MeshBasicMaterial({ map: t, transparent, alphaTest: transparent ? .02 : 0 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); if (ry) p.rotation.y = ry; parent.add(p); return p; }
  function mergeGeos(list) {
    const pos = [], nor = [], uv = [], idx = []; let off = 0;
    for (const g of list) { const p = g.getAttribute('position'), n = g.getAttribute('normal'), u = g.getAttribute('uv'); for (let i = 0; i < p.count; i++) { pos.push(p.array[i * 3], p.array[i * 3 + 1], p.array[i * 3 + 2]); nor.push(n.array[i * 3], n.array[i * 3 + 1], n.array[i * 3 + 2]); uv.push(u ? u.array[i * 2] : 0, u ? u.array[i * 2 + 1] : 0); } if (g.index) for (const k of g.index.array) idx.push(k + off); else for (let i = 0; i < p.count; i++) idx.push(i + off); off += p.count; }
    const o = new THREE.BufferGeometry(); o.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3)); o.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nor), 3)); o.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2)); o.setIndex(new THREE.BufferAttribute(off > 65000 ? new Uint32Array(idx) : new Uint16Array(idx), 1)); return o;
  }
  const rrShape = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
  const frameGeo = (ow, oh, or, iw, ih, ir, opt) => { const s = rrShape(ow, oh, or); s.holes.push(rrShape(iw, ih, ir)); return new THREE.ExtrudeGeometry(s, opt); };

  /* ---------- lamps, toggles, hazard stripes ---------- */
  const off = (axis, dir, x, y, z, d) => axis === 'x' ? [x + dir * d, y, z] : axis === 'y' ? [x, y + dir * d, z] : [x, y, z + dir * d];
  function lamp(x, y, z, col, on, parent = machine, axis = 'z', dir = 1, r = .02) { cyl(r + .008, r + .01, .012, ...off(axis, dir, x, y, z, .006), gun, parent, 14, axis); return cyl(r, r + .002, .014, ...off(axis, dir, x, y, z, .013), LAMP[col][on ? 0 : 1], parent, 14, axis); }
  function toggle(x, y, z, parent = machine, axis = 'z', dir = 1, up = 1) {
    cyl(.022, .025, .014, ...off(axis, dir, x, y, z, .007), chrome, parent, 6, axis);
    const geo = cached(`tg${axis}${dir}${up}`, () => { const g = mergeGeos([new THREE.CylinderGeometry(.008, .011, .048, 8).translate(0, .024, 0), new THREE.SphereGeometry(.014, 8, 6).translate(0, .051, 0)]); if (axis === 'z') { g.rotateX(dir * Math.PI / 2); g.rotateX(-dir * up * .5); } else { g.rotateZ(-dir * Math.PI / 2); g.rotateZ(dir * up * .5); } return g; });
    const m3 = new THREE.Mesh(geo, chrome); m3.position.set(...off(axis, dir, x, y, z, .012)); parent.add(m3); return m3;
  }
  const rivetMat = std('#e2b85a', .85, .3), rivet = (x, y, z, parent = machine, axis = 'z') => cyl(.016, .019, .012, x, y, z, rivetMat, parent, 8, axis);
  // A lit (shaded) canvas plane: walnut and brass panels, so the room's lights model them.
  function litPlane(c, w, h, x, y, z, parent = machine, ry = 0, q = .8, metal = .18, rough = .5) { const m = std('#ffffff', metal, rough, { map: tex(c, false, q) }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); if (ry) p.rotation.y = ry; parent.add(p); return p; }
  // A raised-panel moulding: a brass bead round a recessed field.
  function bead(g, x, y, w, h) { rr(g, x, y, w, h, 6, null, 'rgba(10,4,0,.75)', 7); rr(g, x + 4, y + 4, w - 8, h - 8, 4, null, lin(g, x, y, x + w, y + h, ['#f0cf86', '#9a7330', '#ecd08a']), 4); rr(g, x + 10, y + 10, w - 20, h - 20, 3, null, 'rgba(0,0,0,.38)', 3); }
  const brassScrew = (g, x, y, r = 7) => screw(g, x, y, r);

  /* ---------- plinth ---------- */
  box(2.7, .03, 1.5, 0, .015, 0, accDim, machine, 0);
  box(2.62, .2, 1.42, 0, .13, 0, walnutDark, machine, .03); box(2.66, .04, 1.46, 0, .245, 0, brassDark, machine, 0);
  box(2.42, .075, .012, 0, .125, .716, brass, machine, 0); box(2.2, .012, .012, 0, .188, .72, accBasic, machine, 0);
  for (const x of [-1.15, 1.15]) box(.07, .13, .02, x, .125, .725, brassDark, machine, .01);

  /* ---------- lower body: dark walnut, brass corner posts, a panelled front, a security console on the left flank ---------- */
  box(2.3, 1.62, 1.12, 0, 1.06, 0, walnut, machine, .02);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.06, 1.62, .06, sx * 1.15, 1.06, sz * .56, brassDark, machine, .012);
  for (const y of [.25, 1.87]) box(2.34, .05, 1.16, 0, y, 0, brass, machine, .01);
  { // front panel: raised-panel mouldings, brass screws, a notice
    const W = 1150, H = 810, c = canvas(W, H), g = c.getContext('2d'); const px = x => (x + 1.15) * 500, py = y => (1.87 - y) * 500;
    walnutFill(g, 0, 0, W, H);
    bead(g, 25, py(1.8), 1100, py(1.5) - py(1.8)); bead(g, 25, py(1.45), 85, py(.45) - py(1.45)); bead(g, px(.93), py(1.45), 85, py(.45) - py(1.45)); bead(g, 25, py(.42), 1100, 72);
    for (const [x, y] of [[40, 52], [1110, 52], [40, 183], [1110, 183], [40, 735], [1110, 735], [40, 780], [1110, 780]]) brassScrew(g, x, y, 6);
    goldText(g, 'PLEASE DO NOT TOUCH THE EXHIBITS', px(.46), py(1.745), 24, 520); goldText(g, 'EXHIBIT HALL  ·  NO FLASH PHOTOGRAPHY', px(0), py(.352), 20, 700);
    litPlane(c, 2.3, 1.62, 0, 1.06, .5625, machine, 0, .8);
  }
  // left-flank security console: a walnut panel with a brass header, alarm zone lamps, toggles and two gauges
  const LP = { x: -1.152, top: 1.74 }, lpz = px => -.48 + px / 500, lpy = py => LP.top - py / 500;
  { const W = 480, H = 680, c = canvas(W, H), g = c.getContext('2d'); walnutFill(g, 0, 0, W, H); rr(g, 8, 8, W - 16, H - 16, 8, null, 'rgba(8,4,0,.7)', 3); rr(g, 12, 12, W - 24, H - 24, 6, null, 'rgba(240,200,120,.5)', 1.5);
    brassPlate(g, 24, 22, W - 48, 44, 6); engrave(g, 'SECURITY  ·  EXHIBIT HALL', W / 2, 45, 19, BRASS_INK, '800');
    ['ZONE 01–08', 'ZONE 09–16', 'ZONE 17–24', 'ZONE 25–32'].forEach((s, i) => engrave(g, s, 20, 100 + i * 52, 16, '#d9b25e', '800', SERIF, 'left'));
    seam(g, 24, 322, W - 24, 322); engrave(g, 'ALARM', 20, 346, 14, '#d9b25e', '800', SERIF, 'left'); engrave(g, 'SENSORS', 20, 436, 14, '#d9b25e', '800', SERIF, 'left');
    for (let i = 0; i < 8; i++) { engrave(g, String(i + 1), 120 + i * 46, 398, 15, '#d9b25e'); engrave(g, String(i + 9), 120 + i * 46, 488, 15, '#d9b25e'); }
    seam(g, 24, 512, W - 24, 512);
    for (const [cx, s] of [[130, 'HUMIDITY'], [350, 'VAULT TEMP']]) { const cy = 585; g.fillStyle = '#e9dcc0'; g.beginPath(); g.arc(cx, cy, 66, 0, 7); g.fill(); g.fillStyle = '#17110c'; g.beginPath(); g.arc(cx, cy, 62, 0, 7); g.fill(); g.strokeStyle = '#e9c97a'; g.lineWidth = 2;
      for (let k = 0; k <= 20; k++) { const a = Math.PI * (.8 + 1.4 * k / 20), r0 = k % 5 ? 50 : 44; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * 57, cy + Math.sin(a) * 57); g.stroke(); }
      g.strokeStyle = ACC; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 36, Math.PI * (.8 + 1.4 * .62), Math.PI * 2.2); g.stroke(); g.strokeStyle = '#ff6a82'; g.lineWidth = 3; const na = Math.PI * (s[0] === 'H' ? 1.4 : 1.65); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(na) * 52, cy + Math.sin(na) * 52); g.stroke(); g.fillStyle = '#e9dcc0'; g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill();
      text(g, s, cx, cy + 28, 11, '#e9dcc0', '800', SERIF); }
    litPlane(c, .96, 1.36, LP.x, 1.06, 0, machine, -Math.PI / 2, .78);
    const LAMPCOL = ['g', 'g', 'g', 'a', 'g', 'g', 'r', 'g', 'g', 'a', 'g', 'g', 'g', 'g', 'a', 'g', 'g', 'g', 'g', 'r', 'g', 'a', 'g', 'g', 'g', 'g', 'g', 'a', 'g', 'g', 'g', 'b'];
    for (let r = 0; r < 4; r++) for (let i = 0; i < 8; i++) { const k = r * 8 + i; lamp(LP.x, lpy(100 + r * 52), lpz(200 + i * 36), LAMPCOL[k], (k * 7 + r) % 5 !== 0, machine, 'x', -1, .014); }
    for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) toggle(LP.x, lpy(370 + r * 90), lpz(120 + i * 46), machine, 'x', -1, (i + r) % 3 === 0 ? -1 : 1);
    for (const cx of [130, 350]) { const m = new THREE.Mesh(cached('gaugeRing', () => new THREE.TorusGeometry(.14, .013, 8, 36).rotateY(Math.PI / 2)), brass); m.position.set(LP.x - .006, lpy(585), lpz(cx)); machine.add(m); }
    for (const [yy, zz] of [[.4, -.45], [.4, .45], [1.72, -.45], [1.72, .45]]) rivet(LP.x - .006, yy, zz, machine, 'x');
  }
  // left neck flank (above the lower body): a brass notice with lamps and toggles
  { const x = -1.152, W = 360, H = 360, c = canvas(W, H), g = c.getContext('2d'); walnutFill(g, 0, 0, W, H); rr(g, 8, 8, W - 16, H - 16, 8, null, 'rgba(8,4,0,.7)', 3); brassPlate(g, 30, 14, W - 60, 40, 6); engrave(g, 'ROPE LINE  ·  KEEP BACK', W / 2, 35, 15);
    for (let i = 0; i < 6; i++) { engrave(g, 'A' + (i + 1), 40 + i * 56, 120, 14, '#d9b25e'); engrave(g, 'B' + (i + 1), 40 + i * 56, 230, 14, '#d9b25e'); }
    litPlane(c, .72, .72, x, 2.29, -.05, machine, -Math.PI / 2, .78);
    for (let i = 0; i < 6; i++) { lamp(x, 2.29 + .36 - 80 / 500, -.05 - .36 + (40 + i * 56) / 500, i === 3 ? 'a' : 'g', i !== 5, machine, 'x', -1, .014); toggle(x, 2.29 + .36 - 190 / 500, -.05 - .36 + (40 + i * 56) / 500, machine, 'x', -1, i % 2 ? 1 : -1); }
  }
  // rear of the lower body: service panel with a brass grille
  { const W = 1150, H = 810, c = canvas(W, H), g = c.getContext('2d'); walnutFill(g, 0, 0, W, H); bead(g, 25, 25, 1100, 360); bead(g, 25, 410, 1100, 375);
    for (const [x, y] of [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40], [40, 398], [W - 40, 398]]) brassScrew(g, x, y, 7);
    for (let k = 0; k < 12; k++) { const y = 70 + k * 24; g.fillStyle = '#0c0805'; g.fillRect(180, y, 790, 12); g.fillStyle = 'rgba(240,200,120,.4)'; g.fillRect(180, y + 12, 790, 1.8); }
    brassPlate(g, 290, 520, 570, 130, 8); engrave(g, 'HOT WALLET  ·  HM-001', 575, 566, 34, BRASS_INK, '800'); engrave(g, 'SERVICE ACCESS · COLD STORAGE KEYS HELD OFFLINE', 575, 614, 15, BRASS_INK, '700');
    litPlane(c, 2.3, 1.62, 0, 1.06, -.5625, machine, Math.PI, .55);
  }

  /* ---------- lower door: the vault hatch, the Xtrata mark, the ticket slot ---------- */
  const door = canvas(1100, 640), dg = door.getContext('2d');
  steelFill(dg, 0, 0, 1100, 640, 'rgba(40,36,34,.7)');
  { const v = dg.createRadialGradient(550, 300, 150, 550, 320, 700); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); dg.fillStyle = v; dg.fillRect(0, 0, 1100, 640); }
  rr(dg, 22, 22, 1056, 596, 12, null, '#0c0805', 10); rr(dg, 34, 34, 1032, 572, 8, null, 'rgba(255,230,170,.35)', 2); rr(dg, 58, 58, 984, 524, 6, null, 'rgba(0,0,0,.55)', 4); rr(dg, 62, 62, 976, 516, 4, null, 'rgba(255,230,170,.16)', 1.5);
  for (const [x, y] of [[50, 50], [1050, 50], [50, 590], [1050, 590], [550, 50], [550, 590], [50, 320], [1050, 320]]) screw(dg, x, y, 9);
  for (const y of [150, 235, 320, 405, 490]) for (const x of [96, 1004]) { dg.fillStyle = lin(dg, x - 18, y - 18, x + 18, y + 18, ['#f1d28b', '#8f6a2a']); dg.beginPath(); dg.arc(x, y, 17, 0, 7); dg.fill(); dg.strokeStyle = 'rgba(0,0,0,.6)'; dg.lineWidth = 2; dg.stroke(); dg.fillStyle = 'rgba(0,0,0,.4)'; dg.fillRect(x - 11, y - 2, 22, 4); }
  spaced(dg, 'COLD STORAGE', 215, 92, 20, 5, '#caa968', '800', SERIF); spaced(dg, 'TIME-LOCKED', 885, 92, 20, 5, '#caa968', '800', SERIF);
  dg.save(); dg.shadowColor = '#000'; dg.shadowBlur = 24; xtrataLogo(dg, 550, 214, 210); dg.restore();
  brassPlate(dg, 150, 330, 800, 200, 14);
  engrave(dg, 'NOT YOUR KEYS,', 550, 392, 78, BRASS_INK, '900'); engrave(dg, 'NOT YOUR COINS', 550, 484, 78, BRASS_INK, '900');
  spaced(dg, 'PARALLAX CASINO  ·  THE HEIST MUSEUM', 550, 566, 14, 5, '#a98f5e', '700', SERIF);
  litPlane(door, 1.72, .96, 0, .93, .572, machine, 0, .74, .4, .42);
  box(1.86, .07, .05, 0, 1.43, .585, brass, machine, .008); box(1.86, .07, .05, 0, .43, .585, brass, machine, .008); box(.07, 1.07, .05, -.895, .93, .585, brass, machine, .008); box(.07, 1.07, .05, .895, .93, .585, brass, machine, .008);
  for (const [x, y] of [[-.895, 1.43], [.895, 1.43], [-.895, .43], [.895, .43]]) rivet(x, y, .615);
  for (const y of [1.2, .66]) { box(.1, .11, .04, -.98, y, .59, gun, machine, .008); rivet(-.98, y, .612); box(.1, .11, .04, .98, y, .59, gun, machine, .008); rivet(.98, y, .612); }
  [['g', 1], ['g', 1], ['a', 1], ['g', 1], ['r', 0], ['g', 1]].forEach(([c, on], i) => lamp(-1.075, 1.34 - i * .13, .565, c, !!on, machine, 'z', 1, .017));
  for (let i = 0; i < 4; i++) toggle(1.075, 1.32 - i * .2, .565, machine, 'z', 1, i % 2 ? -1 : 1);
  // souvenir ticket slot
  box(.62, .1, .06, -.62, 1.66, .59, gunDark, machine, .01); box(.48, .026, .02, -.62, 1.66, .625, basic('#05080a'), machine, 0); box(.48, .008, .02, -.62, 1.646, .626, accBasic, machine, 0);
  { const tk = canvas(256, 64), tg = tk.getContext('2d'); brassPlate(tg, 2, 2, 252, 60, 6); spaced(tg, 'TICKET', 128, 33, 28, 9, BRASS_INK, '900', SERIF); plane(tk, .3, .075, -.62, 1.575, .567); }
  // exhibit lamps above the door (right of the ticket slot)
  for (let i = 0; i < 8; i++) lamp(.06 + i * .115, 1.6, .565, ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'][i], i !== 2 && i !== 6, machine, 'z', 1, .015);

  /* ---------- deck: a sloped brass-and-walnut console with illuminated keys and the big TIME TRAVEL button ---------- */
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, walnutDark, deck, .02); box(2.26, .5, .02, 0, 0, .09, std('#1c130d', .3, .55), deck, 0);
  box(2.34, .045, .17, 0, .29, 0, brassDark, deck, 0); box(2.34, .045, .17, 0, -.29, 0, brassDark, deck, 0);
  box(2.2, .008, .02, 0, .262, .092, accBasic, deck, 0); box(2.2, .008, .02, 0, -.262, .092, accBasic, deck, 0);
  function keyLabel(title, w, h, ink, hi, lo) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, h, [hi, lo]); g.fillRect(0, 0, w, h); rr(g, 6, 6, w - 12, h - 12, 10, null, 'rgba(255,255,255,.55)', 3); rr(g, 12, 12, w - 24, h - 24, 7, null, 'rgba(0,0,0,.25)', 2); fit(g, title, w / 2 + 1, h / 2 + 2, w - 54, title.length > 7 ? 44 : 58, 'rgba(255,255,255,.4)', '900', SERIF); fit(g, title, w / 2, h / 2, w - 54, title.length > 7 ? 44 : 58, ink, '900', SERIF); return c; }
  function button(title, x, w, action, ink, hi, lo, glow) {
    box(w + .03, .25, .02, x, -.02, .1, black, deck, 0);
    const base = box(w, .22, .07, x, -.02, .13, gunDark, deck, .025), top = box(w - .03, .2, .065, x, -.02, .18, std(glow, .1, .4, { emissive: glow, emissiveIntensity: .35 }), deck, .02);
    const face = plane(keyLabel(title, 340, 220, ink, hi, lo), w - .06, (w - .06) * 220 / 340, x, -.02, .2155, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('GUIDE', -.86, .34, 'pays', '#2a2410', '#fff4d0', '#e3c25a', '#c99a22'); button('−YEARS', -.48, .32, 'betDown', '#2e1304', '#ffd8aa', '#f09a40', '#c8720f'); button('+YEARS', -.13, .32, 'betUp', '#06301c', '#d0ffe6', '#4ddc9a', '#14a863'); button('AUTO-TOUR', .24, .36, 'auto', '#06223a', '#d4e8ff', '#6aa8f0', '#2f78c0');
  { const cap = canvas(1024, 64), cg = cap.getContext('2d'); const items = [['PAYS', -.86], ['BET −', -.48], ['BET +', -.13], ['AUTO', .24], ['SPIN', .8]]; items.forEach(([t, x]) => spaced(cg, t, 512 + x * (1024 / 2.2), 32, 26, 5, '#e2c27a', '700', SERIF)); plane(cap, 2.2, .1, 0, -.2, .102, deck, true); }
  for (let i = 0; i < 12; i++) lamp(-1.0 + i * .11, .235, .1, ['a', 'a', 'r', 'a', 'a', 'a', 'r', 'a', 'a', 'r', 'a', 'a'][i], i !== 9 && i !== 2, deck, 'z', 1, .012);
  // The big round TIME TRAVEL button. Its cap is spinPhysical; the casino presses it in along z.
  const ring = cyl(.25, .25, .07, .8, -.02, .13, brass, deck, 36, 'z'); ring.userData.action = 'spin';
  const rim = cyl(.226, .226, .075, .8, -.02, .135, accBasic, deck, 36, 'z'); rim.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .8, -.02, .19, std('#c4153d', .3, .35), deck, 36, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  { const capFace = canvas(256, 256), cf = capFace.getContext('2d'); { const gr = cf.createRadialGradient(100, 90, 6, 128, 128, 132); gr.addColorStop(0, '#ffc2cf'); gr.addColorStop(.35, '#f2456c'); gr.addColorStop(.8, '#c4153d'); gr.addColorStop(1, '#7c0c28'); cf.fillStyle = gr; cf.fillRect(0, 0, 256, 256); }
    // a clock face with a counter-clockwise arrow: time travel
    cf.strokeStyle = '#3d0614'; cf.fillStyle = '#3d0614'; cf.lineWidth = 7; cf.lineCap = 'round'; cf.beginPath(); cf.arc(128, 78, 27, 0, 7); cf.stroke(); cf.beginPath(); cf.moveTo(128, 78); cf.lineTo(128, 60); cf.moveTo(128, 78); cf.lineTo(112, 86); cf.stroke(); cf.beginPath(); cf.arc(128, 78, 40, Math.PI * .15, Math.PI * 1.4, true); cf.lineWidth = 6; cf.stroke(); cf.beginPath(); cf.moveTo(86, 70); cf.lineTo(92, 92); cf.lineTo(108, 76); cf.closePath(); cf.fill();
    fit(cf, 'TIME', 129, 134, 190, 38, 'rgba(255,255,255,.4)', '900', SERIF); fit(cf, 'TIME', 128, 132, 190, 38, '#3d0614', '900', SERIF); fit(cf, 'TRAVEL', 129, 172, 200, 38, 'rgba(255,255,255,.4)', '900', SERIF); fit(cf, 'TRAVEL', 128, 170, 200, 38, '#3d0614', '900', SERIF); spaced(cf, 'SPIN', 128, 208, 16, 5, '#5a0a1e', '800', SERIF);
    const t = new THREE.CanvasTexture(capFace); t.colorSpace = THREE.SRGBColorSpace; t.jpeg = .88;
    const R = .425, th = Math.asin(.2 / R), dome = new THREE.SphereGeometry(R, 32, 8, 0, Math.PI * 2, 0, th); dome.rotateX(Math.PI / 2); dome.translate(0, 0, -(R - .05)); { const p = dome.getAttribute('position'), uv = dome.getAttribute('uv'); for (let i = 0; i < p.count; i++) { uv.array[i * 2] = p.array[i * 3] / .4 + .5; uv.array[i * 2 + 1] = p.array[i * 3 + 1] / .4 + .5; } }
    const domeMesh = new THREE.Mesh(dome, std('#ffffff', .15, .32, { map: t, emissive: '#a00f30', emissiveIntensity: .5 })); domeMesh.position.set(0, 0, .035); domeMesh.userData.action = 'spin'; cap.add(domeMesh); }

  /* ---------- upper body: the neck, the wide head with a roll of years down each side, the display-case frame ---------- */
  box(2.3, .85, 1.0, 0, 2.295, -.05, walnut, machine, .02);
  box(2.98, 1.31, 1.0, 0, 3.375, -.05, walnut, machine, .02);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.07, 1.31, .07, sx * 1.49, 3.375, sz > 0 ? .45 : -.55, brassDark, machine, .012);
  for (const y of [2.72, 4.03]) box(3.02, .05, 1.04, 0, y, -.05, brass, machine, .01);
  // roll of years: a velvet strip in a brass frame on each side of the screen (2011 to 2018 left, 2019 to 2026 right)
  function yearStrip(from) {
    const W = 232, H = 912, c = canvas(W, H), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, H, ['#3a0714', '#240510', '#3a0714']); g.fillRect(0, 0, W, H);
    g.strokeStyle = '#d6ae5a'; g.lineWidth = 4; g.beginPath(); g.moveTo(46, 40); g.lineTo(46, H - 40); g.stroke();
    for (let i = 0; i < 8; i++) { const y = 74 + i * 109, hi = i === 0 || i === 7; g.fillStyle = hi ? '#ff4d73' : '#e11d48'; g.beginPath(); g.arc(46, y, hi ? 10 : 7, 0, 7); g.fill(); g.strokeStyle = '#f5dca0'; g.lineWidth = 2; g.stroke(); g.save(); g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 6; text(g, String(from + i), 138, y, 52, '#f5dca0', '900', SERIF); g.restore(); }
    rr(g, 5, 5, W - 10, H - 10, 8, null, '#c79a45', 5); rr(g, 12, 12, W - 24, H - 24, 5, null, 'rgba(255,225,150,.3)', 2); return c;
  }
  for (const sx of [-1, 1]) { box(.34, 1.24, .035, sx * 1.32, 3.39, .4675, brassDark, machine, .01); plane(yearStrip(sx < 0 ? 2011 : 2019), .29, 1.14, sx * 1.32, 3.39, .4885); for (const sy of [-1, 1]) { rivet(sx * 1.32 - .16, 3.39 + sy * .6, .488); rivet(sx * 1.32 + .16, 3.39 + sy * .6, .488); } }
  // the display-case frame round the screen: a heavy walnut slab with a brass moulding and corner brackets
  box(2.26, 1.72, .06, 0, 2.95, .465, walnutDark, machine, .02);
  { const W = 1017, H = 774, c = canvas(W, H), g = c.getContext('2d'); walnutFill(g, 0, 0, W, H);
    rr(g, 12, 12, W - 24, H - 24, 8, null, lin(g, 0, 0, W, H, ['#f0cf86', '#8e6a2a', '#f0cf86']), 6); rr(g, 40, 56, W - 80, H - 112, 8, null, 'rgba(8,3,0,.85)', 8); rr(g, 44, 60, W - 88, H - 120, 6, null, lin(g, 0, 0, W, H, ['#f5dc9a', '#9a7330', '#f5dc9a']), 5);
    for (const [x, y, sx, sy] of [[14, 14, 1, 1], [W - 14, 14, -1, 1], [14, H - 14, 1, -1], [W - 14, H - 14, -1, -1]]) { g.fillStyle = lin(g, x, y, x + sx * 90, y + sy * 90, ['#f3d48c', '#8e6a2a']); g.beginPath(); g.moveTo(x, y); g.lineTo(x + sx * 90, y); g.lineTo(x + sx * 90, y + sy * 14); g.lineTo(x + sx * 14, y + sy * 14); g.lineTo(x + sx * 14, y + sy * 90); g.lineTo(x, y + sy * 90); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 2; g.stroke(); brassScrew(g, x + sx * 40, y + sy * 40, 7); }
    for (const x of [W / 2 - 150, W / 2, W / 2 + 150]) { g.fillStyle = '#e11d48'; g.beginPath(); g.arc(x, 34, 5, 0, 7); g.fill(); g.beginPath(); g.arc(x, H - 34, 5, 0, 7); g.fill(); }
    plane(c, 2.26, 1.72, 0, 2.95, .4975, machine, false); }
  { const geo = frameGeo(2.12, 1.5, .08, 2.0, 1.38, .04, { depth: .014, bevelEnabled: true, bevelThickness: .016, bevelSize: .012, bevelSegments: 2, curveSegments: 3 }); const lip = new THREE.Mesh(geo, brass); lip.position.set(0, 2.95, .5); machine.add(lip); }
  box(2.02, 1.4, .03, 0, 2.95, .505, basic('#05030a'), machine, 0);
  for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) rivet(sx * 1.095, 2.95 + sy * .83, .5);
  const screenGlow = new THREE.Mesh(frameGeo(2.034, 1.414, .046, 2.0, 1.38, .04, { depth: .003, bevelEnabled: false, curveSegments: 6 }), basic(ACC, { transparent: true, opacity: .9, depthWrite: false })); screenGlow.position.set(0, 2.95, .5305); screenGlow.userData.role = 'screenGlow'; machine.add(screenGlow);
  { const W = 1250, H = 950, c = canvas(W, H), g = c.getContext('2d'); g.save(); g.shadowColor = 'rgba(225,29,72,.9)'; g.shadowBlur = 46; for (let k = 0; k < 3; k++) rr(g, W / 2 - 565, H / 2 - 430, 1130, 860, 26, 'rgba(225,29,72,.5)'); g.restore(); g.globalCompositeOperation = 'destination-out'; rr(g, W / 2 - 566, H / 2 - 431, 1132, 862, 26, '#000'); plane(c, 2.5, 1.9, 0, 2.95, .5265, machine, true); }
  // brass plaque above the glass (the deck hides anything below it): THE HEIST MUSEUM · 2011 to 2026, with a brass sconce on each side
  { const W = 1400, H = 118, c = canvas(W, H), g = c.getContext('2d'); brassPlate(g, 2, 2, W - 4, H - 4, 10); engrave(g, 'THE HEIST MUSEUM  ·  2011 to 2026', W / 2, H / 2 + 1, 56, BRASS_INK, '900'); for (const x of [34, W - 34]) brassScrew(g, x, H / 2, 8);
    box(1.44, .13, .03, 0, 3.925, .4725, gunDark, machine, .008); plane(c, 1.4, 1.4 * H / W, 0, 3.925, .4885, machine, false); }
  for (const x of [-.92, .92]) { box(.14, .07, .06, x, 3.925, .49, brassDark, machine, .01); box(.1, .02, .05, x, 3.885, .5, basic('#ffe2a8'), machine, 0); sphere(.02, x, 3.94, .525, bulbHot, machine, 8, 6); }
  const shot = (opts && opts.screenImage) || (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, 480, ['#16060c', '#2a0b16', '#16060c']); g.fillRect(0, 0, 700, 480); g.strokeStyle = 'rgba(245,220,160,.25)'; g.lineWidth = 2; rr(g, 24, 24, 652, 432, 12, null, 'rgba(245,220,160,.3)', 2); goldText(g, 'THE HEIST MUSEUM', 350, 210, 64, 560, '900'); spaced(g, '2011  TO  2026', 350, 280, 26, 8, '#c9a45c', '700', SERIF); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .5215, machine, false); screenMesh.userData.role = 'screenMesh';

  /* ---------- marquee: HOT WALLET in crimson neon with bulb dots ---------- */
  box(2.98, .74, 1.08, 0, 4.42, -.05, walnut, machine, .02); for (const y of [4.07, 4.77]) box(3.02, .06, 1.12, 0, y, -.05, brass, machine, .008);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.06, .74, .06, sx * 1.49, 4.42, sz > 0 ? .5 : -.6, brassDark, machine, .01);
  function signCanvas(w, h) {
    const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, h, ['#1a0610', '#2a0a16', '#1a0610']); g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(245,215,150,.06)'; g.lineWidth = 1; for (let x = 0; x < w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    rr(g, 10, 10, w - 20, h - 20, 10, null, lin(g, 0, 0, w, h, ['#f0cf86', '#8e6a2a', '#f0cf86']), 6);
    const letters = [...'HOT WALLET'], size = h * .56; g.font = `900 ${size}px ${SANS}`; g.textBaseline = 'middle'; g.textAlign = 'left'; const gap = size * .09, ws = letters.map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (letters.length - 1); const k = Math.min(1, (w * .78) / total); const cy = h * .42;
    g.save(); g.scale(k, 1); let cx = (w / 2 - total * k / 2) / k;
    letters.forEach((ch, i) => { g.shadowColor = 'rgba(225,29,72,.95)'; g.shadowBlur = h * .2; g.fillStyle = ACC; g.fillText(ch, cx, cy); cx += ws[i] + gap; }); cx = (w / 2 - total * k / 2) / k;
    letters.forEach((ch, i) => { g.shadowBlur = 0; g.lineJoin = 'round'; g.lineWidth = h * .035; g.strokeStyle = '#2a0610'; g.strokeText(ch, cx, cy); g.fillStyle = lin(g, 0, cy - size * .5, 0, cy + size * .5, ['#fff0f3', '#ff8aa3', ACC, '#b3123a']); g.fillText(ch, cx, cy); g.lineWidth = h * .008; g.strokeStyle = 'rgba(255,240,244,.85)'; g.strokeText(ch, cx, cy - 1); cx += ws[i] + gap; });
    g.restore();
    spaced(g, 'THE HEIST MUSEUM', w / 2, h * .78, h * .085, h * .03, '#e7c57c', '800', SERIF); spaced(g, 'PARALLAX CASINO', w / 2, h * .9, 11, 3, '#9d7f4a', '700', SERIF); return c;
  }
  const signTex = tex(signCanvas(1500, 306), false, .74); plane(signTex, 2.94, .6, 0, 4.42, .4925, machine, false);
  for (let i = 0; i < 30; i++) { const t = i / 29; sphere(.022, -1.42 + t * 2.84, 4.77, .512, i % 2 ? bulbHot : bulbWarm); sphere(.022, -1.42 + t * 2.84, 4.07, .512, i % 2 ? bulbWarm : bulbHot); }
  for (let i = 1; i < 6; i++) { sphere(.022, -1.44, 4.07 + i * .1167, .5, i % 2 ? bulbWarm : bulbHot); sphere(.022, 1.44, 4.07 + i * .1167, .5, i % 2 ? bulbHot : bulbWarm); }
  plane(signTex, 2.94, .6, 0, 4.42, -.5925, machine, false, Math.PI);
  { const c = canvas(640, 300), g = c.getContext('2d'); walnutFill(g, 0, 0, 640, 300); bead(g, 10, 10, 620, 280); brassPlate(g, 120, 100, 400, 100, 8); engrave(g, 'HOT WALLET  ·  HM-001', 320, 150, 28, BRASS_INK, '900'); for (const [x, y] of [[40, 40], [600, 40], [40, 260], [600, 260]]) brassScrew(g, x, y, 9); litPlane(c, 2.94, 2.94 * 300 / 640, 0, 4.42, -.5925 - .001, machine, Math.PI, .75); }
  // alarm beacons on the top corners: each lens has its OWN material so the host can flash it. Exported dim.
  function beacon(sx, role) {
    const x = sx * 1.36, z = .3;
    cyl(.1, .115, .05, x, 4.825, z, brassDark, machine, 20); cyl(.075, .09, .03, x, 4.865, z, brass, machine, 20);
    const lens = sphere(.085, x, 4.9, z, basic('#6b1022'), machine, 20, 12); lens.userData.role = role;
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; cyl(.006, .006, .15, x + Math.cos(a) * .088, 4.935, z + Math.sin(a) * .088, chrome, machine, 6); }
    cyl(.09, .09, .014, x, 5.01, z, brassDark, machine, 20); sphere(.016, x, 5.025, z, brass, machine, 8, 6);
    return lens;
  }
  beacon(-1, 'beaconL'); beacon(1, 'beaconR');

  /* ---------- topper (crest): a big steel bank-vault wheel on a brass stand ---------- */
  box(1.0, .06, .78, 0, 4.82, -.05, gunDark, machine, .01); cyl(.17, .26, .2, 0, 4.95, -.05, brassDark, machine, 14); box(.82, .04, .62, 0, 5.065, -.05, brass, machine, .01); box(.76, .008, .56, 0, 5.088, -.05, accBasic, machine, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) rivet(sx * .42, 4.855, -.05 + sz * .33, machine, 'y');
  for (let i = 0; i < 9; i++) lamp(-.32 + i * .08, 5.065, .26, ['a', 'a', 'r', 'a', 'a', 'a', 'r', 'a', 'a'][i], i !== 2, machine, 'z', 1, .011);
  const crest = new THREE.Group(); crest.position.set(0, 5.6, -.05); crest.userData.role = 'crest'; machine.add(crest);
  cyl(.045, .06, .36, 0, -.33, 0, chrome, crest, 14); cyl(.085, .085, .03, 0, -.5, 0, brassDark, crest, 16);
  const wheel = new THREE.Group(); wheel.userData.role = 'crestWheel'; crest.add(wheel);
  { const rim = new THREE.Mesh(new THREE.TorusGeometry(.36, .04, 14, 56), chrome); wheel.add(rim);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(.27, .016, 8, 44), accBasic); wheel.add(inner);
    cyl(.285, .285, .028, 0, 0, 0, steelDark, wheel, 44, 'z'); cyl(.18, .18, .07, 0, 0, 0, steel, wheel, 32, 'z');
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; cyl(.014, .014, .05, Math.cos(a) * .23, Math.sin(a) * .23, 0, brass, wheel, 8, 'z'); }
    const sp = [], balls = []; for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5; const g = new THREE.CylinderGeometry(.02, .026, .31, 10); g.translate(0, .13 + .155, 0); g.rotateZ(-a); sp.push(g); const b = new THREE.SphereGeometry(.052, 14, 10); b.translate(0, .445, 0); b.rotateZ(-a); balls.push(b); }
    wheel.add(new THREE.Mesh(mergeGeos(sp), chrome)); wheel.add(new THREE.Mesh(mergeGeos(balls), brass));
    const dial = canvas(256, 256), dg2 = dial.getContext('2d'); dg2.fillStyle = lin(dg2, 0, 0, 256, 256, ['#f6dc9c', '#b58a38']); dg2.beginPath(); dg2.arc(128, 128, 126, 0, 7); dg2.fill(); dg2.strokeStyle = '#3a2608'; dg2.lineWidth = 4; dg2.stroke(); dg2.fillStyle = '#2a1a06'; dg2.beginPath(); dg2.arc(128, 128, 98, 0, 7); dg2.fill();
    for (let k = 0; k < 40; k++) { const a = k * Math.PI / 20 - Math.PI / 2, r0 = k % 5 ? 82 : 72; dg2.strokeStyle = '#f0d58a'; dg2.lineWidth = k % 5 ? 2 : 4; dg2.beginPath(); dg2.moveTo(128 + Math.cos(a) * r0, 128 + Math.sin(a) * r0); dg2.lineTo(128 + Math.cos(a) * 94, 128 + Math.sin(a) * 94); dg2.stroke(); }
    dg2.fillStyle = '#e11d48'; dg2.beginPath(); dg2.moveTo(128, 16); dg2.lineTo(114, 44); dg2.lineTo(142, 44); dg2.closePath(); dg2.fill(); dg2.fillStyle = '#f0d58a'; dg2.beginPath(); dg2.arc(128, 128, 30, 0, 7); dg2.fill(); dg2.strokeStyle = '#3a2608'; dg2.lineWidth = 3; dg2.stroke();
    const dt = tex(dial, true, .85); for (const s of [1, -1]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.32, .32), new THREE.MeshBasicMaterial({ map: dt, transparent: true, alphaTest: .02 })); m.position.z = s * .0365; if (s < 0) m.rotation.y = Math.PI; wheel.add(m); }
    sphere(.032, 0, 0, .05, brass, wheel, 12, 8); sphere(.032, 0, 0, -.05, brass, wheel, 12, 8); }

  /* ---------- lever: a heavy chrome vault-door handle on the right flank, travelling a brass scale of years ---------- */
  const PIV = { x: 1.34, y: 1.3, z: -.1 }, REST = .28, PULL = 1.02, SEC = { r0: .16, r1: .64, t0: .04, t1: 1.5 };
  { // fan-shaped housing plate and the scale of years
    const s = new THREE.Shape(), N = 28; for (let i = 0; i <= N; i++) { const a = SEC.t0 + (SEC.t1 - SEC.t0) * i / N, p = [SEC.r1 * Math.sin(a), SEC.r1 * Math.cos(a)]; i ? s.lineTo(...p) : s.moveTo(...p); } for (let i = N; i >= 0; i--) { const a = SEC.t0 + (SEC.t1 - SEC.t0) * i / N; s.lineTo(SEC.r0 * Math.sin(a), SEC.r0 * Math.cos(a)); } s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: .1, bevelEnabled: true, bevelThickness: .008, bevelSize: .008, bevelSegments: 1, curveSegments: 1 }); g.rotateY(-Math.PI / 2); g.translate(1.26, PIV.y, PIV.z); machine.add(new THREE.Mesh(g, walnutDark));
    const W = 700, H = 700, c = canvas(W, H), cg = c.getContext('2d'), pz = z => (z - PIV.z + .02) * 1000, py = y => (PIV.y + .66 - y) * 1000, P = (r, a) => [pz(PIV.z + r * Math.sin(a)), py(PIV.y + r * Math.cos(a))];
    for (let i = 0; i < 40; i++) { const a0 = REST + PULL * i / 40, a1 = REST + PULL * (i + 1) / 40; cg.strokeStyle = lerpHex('#8a6a2e', '#e11d48', i / 39); cg.lineWidth = 16; const [x0, y0] = P(.54, a0), [x1, y1] = P(.54, a1); cg.beginPath(); cg.moveTo(x0, y0); cg.lineTo(x1, y1); cg.stroke(); }
    cg.lineCap = 'butt'; for (let k = 0; k <= 15; k++) { const a = REST + PULL * k / 15, major = k % 5 === 0, [xa, ya] = P(major ? .56 : .58, a), [xb, yb] = P(.62, a); cg.strokeStyle = '#f5dca0'; cg.lineWidth = major ? 5 : 2.5; cg.beginPath(); cg.moveTo(xa, ya); cg.lineTo(xb, yb); cg.stroke(); }
    for (const [lbl, k] of [['2011', 0], ['2016', 5], ['2021', 10], ['2026', 15]]) { const a = REST + PULL * k / 15, [x, y] = P(.45, a); cg.save(); cg.translate(x, y); cg.rotate(Math.PI / 2 - a + (a > .8 ? Math.PI : 0)); text(cg, lbl, 0, 0, 24, '#f5dca0', '900', SERIF); cg.restore(); }
    plane(c, .7, .7, 1.2695, PIV.y + .66 - .35, PIV.z - .02 + .35, machine, true, Math.PI / 2);
    // vault-door boss behind the lever: a brass disc ringed with bolts
    cyl(.17, .17, .12, 1.21, PIV.y, PIV.z, brassDark, machine, 28, 'x'); cyl(.12, .12, .02, 1.275, PIV.y, PIV.z, chrome, machine, 28, 'x');
    for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; rivet(1.273, PIV.y + Math.cos(a) * .145, PIV.z + Math.sin(a) * .145, machine, 'x'); }
    // brass pilaster behind the lever with the TIME LEVER plate
    box(.12, 1.5, .24, 1.21, 1.72, -.3, gun, machine, .012); for (const y of [1.2, 1.5, 1.8, 2.1, 2.4]) rivet(1.272, y, -.3, machine, 'x');
  }
  { const W = 480, H = 200, c = canvas(W, H), g = c.getContext('2d'); brassPlate(g, 2, 2, W - 4, H - 4, 10); engrave(g, 'TIME LEVER', 240, 78, 64, BRASS_INK, '900'); engrave(g, 'PULL TO TRAVEL', 240, 150, 26, BRASS_INK, '800'); plane(c, .24, .1, 1.2755, 2.2, -.3, machine, false, Math.PI / 2); }
  lamp(1.2755, 2.05, -.3, 'a', true, machine, 'x', 1, .022); { const c = canvas(256, 64), g = c.getContext('2d'); brassPlate(g, 2, 2, 252, 60, 6); spaced(g, 'READY', 128, 33, 28, 8, BRASS_INK, '900', SERIF); plane(c, .2, .05, 1.2755, 1.95, -.3, machine, false, Math.PI / 2); }
  const lever = new THREE.Group(); lever.position.set(PIV.x, PIV.y, PIV.z); lever.rotation.x = REST; lever.userData.role = 'lever'; machine.add(lever);
  // children[0] = shaft, children[1] = the T-grip (the click target), then the hub parts
  const shaft = cyl(.04, .05, .76, 0, .38, 0, chrome, lever, 20), grip = cyl(.052, .052, .36, 0, .86, 0, chrome, lever, 20, 'x');
  const gripCapL = cyl(.066, .066, .03, -.19, .86, 0, brass, lever, 18, 'x'), gripCapR = cyl(.066, .066, .03, .19, .86, 0, brass, lever, 18, 'x'), neck = sphere(.062, 0, .8, 0, brass, lever, 18, 12);
  const hub = cyl(.085, .085, .16, 0, 0, 0, chrome, lever, 20, 'x'), hubBolt = cyl(.04, .04, .19, 0, 0, 0, gunDark, lever, 8, 'x'), collar = cyl(.062, .062, .06, 0, .66, 0, brass, lever, 18), collar2 = cyl(.056, .056, .03, 0, .24, 0, brass, lever, 18), tail = cyl(.032, .032, .16, 0, -.08, 0, chrome, lever, 12), tailKnob = sphere(.05, 0, -.17, 0, brass, lever, 14, 10);
  const ridges = []; for (let k = -2; k <= 2; k++) ridges.push(cyl(.057, .057, .018, k * .055, .86, 0, black, lever, 16, 'x'));
  [shaft, grip, gripCapL, gripCapR, neck, hub, hubBolt, collar, collar2, tail, tailKnob, ...ridges].forEach(m => { m.userData.action = 'spin'; });

  /* ---------- head flanks: a glass display case of sealed evidence bags on each side, one bag for every year ---------- */
  function drawKey(g, x, y, s) { g.strokeStyle = '#e2b95e'; g.fillStyle = '#e2b95e'; g.lineWidth = 5 * s; g.lineCap = 'round'; g.beginPath(); g.arc(x - 13 * s, y, 8 * s, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x - 5 * s, y); g.lineTo(x + 22 * s, y); g.moveTo(x + 14 * s, y); g.lineTo(x + 14 * s, y + 8 * s); g.moveTo(x + 21 * s, y); g.lineTo(x + 21 * s, y + 6 * s); g.stroke(); }
  function drawCoin(g, x, y, s) { const gr = g.createRadialGradient(x - 5 * s, y - 5 * s, 2, x, y, 17 * s); gr.addColorStop(0, '#fff0b8'); gr.addColorStop(1, '#b8892f'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 16 * s, 0, 7); g.fill(); g.strokeStyle = '#6e4d12'; g.lineWidth = 2 * s; g.stroke(); g.beginPath(); g.arc(x, y, 11 * s, 0, 7); g.stroke(); }
  function drawLock(g, x, y, s) { g.strokeStyle = '#d7dde6'; g.lineWidth = 5 * s; g.beginPath(); g.arc(x, y - 4 * s, 9 * s, Math.PI, 0); g.stroke(); rr(g, x - 14 * s, y - 4 * s, 28 * s, 22 * s, 4 * s, '#c79a45', '#6e4d12', 2); g.fillStyle = '#3a2608'; g.beginPath(); g.arc(x, y + 6 * s, 3 * s, 0, 7); g.fill(); }
  function drawChip(g, x, y, s) { g.strokeStyle = '#cfd6df'; g.lineWidth = 3 * s; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x + k * 7 * s, y - 20 * s); g.lineTo(x + k * 7 * s, y + 20 * s); g.moveTo(x - 20 * s, y + k * 7 * s); g.lineTo(x + 20 * s, y + k * 7 * s); g.stroke(); } rr(g, x - 14 * s, y - 14 * s, 28 * s, 28 * s, 4 * s, '#20262e', '#8a96a6', 2); g.fillStyle = '#8a96a6'; g.beginPath(); g.arc(x - 8 * s, y - 8 * s, 2.5 * s, 0, 7); g.fill(); }
  function drawStick(g, x, y, s) { rr(g, x - 22 * s, y - 9 * s, 30 * s, 18 * s, 4 * s, '#2b3441', '#8a96a6', 2); rr(g, x + 8 * s, y - 6 * s, 16 * s, 12 * s, 2, '#d7dde6', '#6a7480', 2); g.fillStyle = '#e11d48'; g.fillRect(x - 12 * s, y - 3 * s, 8 * s, 6 * s); }
  function bagCase(from, side) {
    const W = 480, H = 600, c = canvas(W, H), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, H, ['#3a0a18', '#1e060e', '#2e0812']); g.fillRect(0, 0, W, H);
    for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(255,200,200,${.01 + (k % 4) * .004})`; g.fillRect(0, k * 15, W, 7); }
    const ROWS = (typeof window !== 'undefined' && window.CAB_ROWS) || null, LG = (typeof window !== 'undefined' && window.CAB_LOGO_IMGS) || {}, base = side > 0 ? 8 : 0;
    brassPlate(g, 22, 14, W - 44, 46, 6); engrave(g, ROWS ? `EVIDENCE  ${ROWS[base].year} – ${ROWS[base + 7].year}` : `EVIDENCE  ${from} – ${from + 7}`, W / 2, 38, 22, BRASS_INK, '900');
    const cw = 214, ch = 118, x0 = 17, y0 = 74, items = [drawKey, drawCoin, drawLock, drawChip, drawStick];
    for (let i = 0; i < 8; i++) { const col = i % 2, row = i >> 1, x = x0 + col * (cw + 18), y = y0 + row * (ch + 8), yr = ROWS ? ROWS[base + i].year : from + i, lg = ROWS && LG[ROWS[base + i].logo] ? LG[ROWS[base + i].logo] : null;
      g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 8; rr(g, x, y, cw, ch, 8, 'rgba(228,236,248,.14)', 'rgba(255,255,255,.5)', 2); g.restore();
      g.fillStyle = '#c8102e'; g.fillRect(x + 6, y + 6, cw - 12, 15); g.fillStyle = 'rgba(255,255,255,.85)'; for (let k = 0; k < 14; k++) g.fillRect(x + 12 + k * 14, y + 9, 7, 9); g.fillStyle = '#05060a'; g.beginPath(); g.arc(x + cw / 2, y + 28, 4, 0, 7); g.fill();
      rr(g, x + 10, y + 36, 88, 70, 4, '#f3eddc', '#9b8f70', 1.5); text(g, 'EXH. ' + String(i + 1 + (side > 0 ? 8 : 0)).padStart(2, '0'), x + 54, y + 49, 12, '#7a1a2a', '800', SERIF); text(g, String(yr), x + 54, y + 75, 29, '#1a1208', '900', SERIF); for (let k = 0; k < 18; k++) { g.fillStyle = '#1a1208'; g.fillRect(x + 16 + k * 4.4, y + 92, k % 3 ? 2 : 3, 10); }
      if (lg) { /* the company's own logo, as supplied, on a plate of its own background colour */ const px = x + 104, py = y + 38, pw = 100, ph = 66; g.save(); g.beginPath(); g.roundRect(px, py, pw, ph, 4); g.fillStyle = lg.bg; g.fill(); g.lineWidth = 1.5; g.strokeStyle = '#9b8f70'; g.stroke(); g.clip(); const k = Math.min((pw - 10) / lg.img.width, (ph - 10) / lg.img.height); g.drawImage(lg.img, px + (pw - lg.img.width * k) / 2, py + (ph - lg.img.height * k) / 2, lg.img.width * k, lg.img.height * k); g.restore(); }
      else items[(i + (side > 0 ? 2 : 0)) % items.length](g, x + 150, y + 74, 1.05); }
    // glass: a soft diagonal sheen and a brass frame
    g.save(); const gl = g.createLinearGradient(0, 0, W, H); gl.addColorStop(0, 'rgba(255,255,255,.0)'); gl.addColorStop(.3, 'rgba(255,255,255,.1)'); gl.addColorStop(.38, 'rgba(255,255,255,.0)'); gl.addColorStop(.62, 'rgba(255,255,255,.07)'); gl.addColorStop(.7, 'rgba(255,255,255,.0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H); g.restore();
    rr(g, 4, 4, W - 8, H - 8, 8, null, lin(g, 0, 0, W, H, ['#f0cf86', '#8e6a2a', '#f0cf86']), 8);
    return c;
  }
  for (const side of [-1, 1]) litPlane(bagCase(side < 0 ? 2011 : 2019, side), .96, 1.2, side * 1.4925, 3.375, -.05, machine, side * Math.PI / 2, .86, .25, .35);
  for (let i = 0; i < 6; i++) lamp(1.152, 2.02 + i * .12, .36, ['g', 'g', 'a', 'g', 'r', 'g'][i], i !== 4, machine, 'x', 1, .014);

  /* ---------- back of the head: a walnut panel with a brass plate ---------- */
  { const W = 1490, H = 640, c = canvas(W, H), g = c.getContext('2d'); walnutFill(g, 0, 0, W, H); bead(g, 25, 25, W - 50, 280); bead(g, 25, 330, W - 50, 285);
    for (const [x, y] of [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40], [40, 318], [W - 40, 318]]) brassScrew(g, x, y, 8);
    brassPlate(g, 450, 420, 590, 130, 10); engrave(g, 'HOT WALLET  ·  HM-001', 745, 468, 38, BRASS_INK, '900'); engrave(g, 'NOT YOUR KEYS, NOT YOUR COINS', 745, 520, 18, BRASS_INK, '700');
    litPlane(c, 2.98, 1.28, 0, 3.375 - .015, -.5525, machine, Math.PI, .55); }
  return exportPacked(machine);
};


// Export in the same format as the existing packs: shared geometry/material/texture tables and a node tree.
function exportPacked(root) {
  const geometries = [], materials = [], textures = [], gi = new Map(), mi = new Map(), ti = new Map();
  const rp = (v, k) => Math.round(v * k) / k;
  const texIndex = t => { if (!t) return null; if (ti.has(t)) return ti.get(t); const img = t.image; const url = img.toDataURL ? (t.jpeg ? img.toDataURL('image/jpeg', t.jpeg) : t.webp ? img.toDataURL('image/webp', t.webp) : img.toDataURL('image/png')) : null; if (!/^data:image\/(jpeg|webp|png)/.test(url)) throw Error('texture encode failed'); textures.push({ image: url, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); ti.set(t, textures.length - 1); return textures.length - 1; };
  const matIndex = m => { if (mi.has(m)) return mi.get(m); const basic = m.isMeshBasicMaterial; materials.push({ type: basic ? 'basic' : 'standard', color: m.color.getHex(), roughness: basic ? .4 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texIndex(m.map), emissive: m.emissive ? m.emissive.getHex() : 0, emissiveIntensity: m.emissiveIntensity ?? 1 }); mi.set(m, materials.length - 1); return materials.length - 1; };
  const geoIndex = g => { if (gi.has(g)) return gi.get(g); const attributes = {}; for (const k of ['position', 'normal', 'uv']) { const a = g.getAttribute(k); if (a) attributes[k] = { size: a.itemSize, array: Array.from(a.array, v => rp(v, k === 'position' ? 2e3 : k === 'normal' ? 100 : 1e3)) }; } geometries.push({ attributes, index: g.index ? Array.from(g.index.array) : null, groups: g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex ?? 0 })) }); gi.set(g, geometries.length - 1); return geometries.length - 1; };
  const node = o => { const n = { p: o.position.toArray().map(v => rp(v, 1e5)), q: o.quaternion.toArray().map(v => rp(v, 1e5)), s: o.scale.toArray().map(v => rp(v, 1e5)), visible: o.visible, role: o.userData.role || '', children: [] }; if (o.userData.action) n.action = o.userData.action; if (o.isMesh) { n.g = geoIndex(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(matIndex) : matIndex(o.material); } n.children = o.children.map(node); return n; };
  root.updateMatrixWorld(true);
  const out = { root: node(root), geometries, materials, textures };
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9], v = new THREE.Vector3();
  root.traverse(o => { if (!o.isMesh) return; const a = o.geometry.getAttribute('position'); for (let i = 0; i < a.count; i++) { v.fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld); const p = [v.x, v.y, v.z]; for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); } } });
  return { json: JSON.stringify(out), stats: { geometries: geometries.length, materials: materials.length, textures: textures.length, size: hi.map((h, k) => +(h - lo[k]).toFixed(3)), min: lo.map(x => +x.toFixed(3)), max: hi.map(x => +x.toFixed(3)), texKB: textures.map(t => Math.round(t.image.length / 1024)) } };
}
