/* Mempool Madness cabinet, built with THREE and exported in the casino's packed-model format
   ({root, geometries, materials, textures}). Run by build-cabinet.mjs (browser) or build-cabinet-node.mjs (canvas).
   Look: a 1970s mission-control console for Bitcoin's mempool, in grey brushed steel, with rows of small status lamps and
   toggle switches, hazard-stripe trim, a green-phosphor radar screen, a vertical txid ticker down each side of the screen
   section (real pending transactions from art/snapshot.js, read from window.MM_SNAPSHOT) and a topper that is a slowly
   turning column of stacked translucent fee-coloured blocks. The lever is a big red launch-control lever behind a flip-up
   safety cover. Nothing here imitates another project's art or logo; the Xtrata mark on the lower door is drawn with the
   XLOGO vector code. Roles: screenMesh, core (+coreBlock0..9), spinPhysical, lever, safetyCover, sparkAnchor, tickerL,
   tickerR, radarGlow; deck actions spin/betUp/betDown/auto/pays. */
window.buildCabinet = function buildCabinet(opts) {
  const ACC = '#14f195';
  const SNAP = (typeof window !== 'undefined' && window.MM_SNAPSHOT) || (opts && opts.snapshot);
  if (!SNAP || !Array.isArray(SNAP.pending) || !SNAP.pending.length) throw Error('Mempool Madness cabinet needs art/snapshot.js (window.MM_SNAPSHOT.pending)');
  const machine = new THREE.Group(); machine.name = 'Mempool Madness';
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
  // Fee colour, cool (low) to hot (high), on a log scale: used by the ticker, the topper blocks and the lever travel scale.
  const FEE_STOPS = [[.1, '#3b6bff'], [.5, '#1fa2ff'], [1, '#19d8e0'], [2, '#14f195'], [3, '#8be83a'], [4, '#e6e630'], [6, '#ffb62e'], [10, '#ff7a1f'], [20, '#ff4a2a'], [50, '#ff1f4b']];
  const hex2 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function feeColor(rate) { const r = Math.max(FEE_STOPS[0][0], Math.min(FEE_STOPS[FEE_STOPS.length - 1][0], rate)); for (let i = 1; i < FEE_STOPS.length; i++) if (r <= FEE_STOPS[i][0]) { const [a, ca] = FEE_STOPS[i - 1], [b, cb] = FEE_STOPS[i], t = (Math.log(r) - Math.log(a)) / (Math.log(b) - Math.log(a)), A = hex2(ca), B = hex2(cb); return '#' + A.map((v, k) => Math.round(v + (B[k] - v) * t).toString(16).padStart(2, '0')).join(''); } return FEE_STOPS[FEE_STOPS.length - 1][1]; }

  /* ---------- brushed steel: a tileable grain, used on every body part ---------- */
  function steelCanvas(size) {
    const c = canvas(size, size), g = c.getContext('2d');
    g.fillStyle = '#8c98a6'; g.fillRect(0, 0, size, size);
    const wrap = fn => { for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) { g.save(); g.translate(dx, dy); fn(); g.restore(); } };
    for (let i = 0; i < 90; i++) { const x = rnd() * size, y = rnd() * size, r = 40 + rnd() * 140, a = .04 + rnd() * .07, d = rnd() < .5; wrap(() => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, d ? `rgba(20,26,32,${a})` : `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }); }
    for (let i = 0; i < 2600; i++) { const x = rnd() * size, y = rnd() * size, len = 30 + rnd() * 230, a = .025 + rnd() * .085, l = rnd() < .5; wrap(() => { g.strokeStyle = l ? `rgba(255,255,255,${a})` : `rgba(10,14,18,${a})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + .5); g.lineTo(x + len, y + .5); g.stroke(); }); }
    const img = g.getImageData(0, 0, size, size), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 9; d[i] += n; d[i + 1] += n; d[i + 2] += n * 1.05; } g.putImageData(img, 0, 0);
    return c;
  }
  const STEEL = steelCanvas(512);
  const steelTex = new THREE.CanvasTexture(STEEL); steelTex.colorSpace = THREE.SRGBColorSpace; steelTex.wrapS = steelTex.wrapT = THREE.RepeatWrapping; steelTex.jpeg = .82;
  // Steel painted into a flat canvas (panels, plates).
  function steelFill(g, x, y, w, h, tint) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); for (let ty = y; ty < y + h; ty += 512) for (let tx = x; tx < x + w; tx += 512) g.drawImage(STEEL, tx, ty); if (tint) { g.fillStyle = tint; g.fillRect(x, y, w, h); } g.restore(); }

  const steel = std('#dce6f2', .3, .52, { map: steelTex }), steelLight = std('#eef3f8', .35, .45, { map: steelTex }), steelDark = std('#9fabb8', .35, .52, { map: steelTex }), gun = std('#66717d', .4, .48, { map: steelTex }), gunDark = std('#38414b', .4, .5, { map: steelTex });
  const chrome = std('#dfe4e8', .9, .2), black = std('#14171a', .3, .6), rubber = std('#1a1d20', .1, .85);
  const redLever = std('#d4161a', .35, .3), redDark = std('#8c0f12', .4, .4);
  const accBasic = basic(ACC), accDim = basic('#0a6a47'), accHot = basic('#b8ffe4');
  const LAMP = { g: [basic('#38ff98'), basic('#0d5c36')], a: [basic('#ffb62e'), basic('#6e4a0a')], r: [basic('#ff453a'), basic('#661712')], b: [basic('#4aa8ff'), basic('#123a66')], w: [basic('#f4fff8'), basic('#44544c')] };

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
  const rivetMat = std('#aeb6bf', .45, .42), rivet = (x, y, z, parent = machine, axis = 'z') => cyl(.016, .019, .012, x, y, z, rivetMat, parent, 8, axis);
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
  function hazardCanvas(w, h, period) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = '#f2c200'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181b'; for (let x = -h; x < w + h; x += period) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + period / 2, h); g.lineTo(x + period / 2 + h, 0); g.lineTo(x + h, 0); g.closePath(); g.fill(); } g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, w, 2); g.fillRect(0, h - 2, w, 2); return c; }
  const hazard = (w, h, x, y, z, parent = machine, ry = 0) => { const pw = Math.max(24, Math.round(w * 420)), ph = Math.max(10, Math.round(h * 420)); return plane(hazardCanvas(pw, ph, Math.round(ph * 1.1)), w, h, x, y, z, parent, false, ry); };

  /* ---------- the fee-colour legend for the pending transactions of the snapshot ---------- */
  const fmtRate = r => { const s = r < 10 ? String(Math.round(r * 100) / 100) : String(Math.round(r * 10) / 10); return s.includes('.') ? s : s + '.0'; };
  const pend = SNAP.pending.filter(p => p && typeof p.txid === 'string' && typeof p.feeRate === 'number');
  const sorted = pend.slice().sort((a, b) => a.feeRate - b.feeRate), mixed = [];
  for (let i = 0, j = sorted.length - 1; i <= j; i++, j--) { mixed.push(sorted[j]); if (i !== j) mixed.push(sorted[i]); }
  function tickerCanvas(list, shift) {
    const W = 256, H = 2048, c = canvas(W, H), g = c.getContext('2d'), n = list.length, rh = H / n;
    g.fillStyle = lin(g, 0, 0, W, 0, ['#03130d', '#04180f', '#03130d']); g.fillRect(0, 0, W, H);
    for (let i = 0; i < n; i++) {
      const p = list[(i + shift) % n], y0 = i * rh, col = feeColor(p.feeRate), tx = p.txid.slice(0, 8) + '…' + p.txid.slice(-4);
      g.fillStyle = col; g.fillRect(8, y0 + rh * .14, 5, rh * .72);
      g.save(); g.shadowColor = 'rgba(80,255,170,.55)'; g.shadowBlur = 6; text(g, tx, 24, y0 + rh * .32, 22, '#9cf7cf', '600', MONO, 'left'); g.restore();
      g.save(); g.shadowColor = col; g.shadowBlur = 9; text(g, fmtRate(p.feeRate) + ' sat/vB', 24, y0 + rh * .7, 27, col, '800', SANS, 'left'); g.restore();
      text(g, p.vsize + ' vB', W - 12, y0 + rh * .7, 15, '#4f8f78', '600', MONO, 'right');
      g.fillStyle = 'rgba(80,255,170,.14)'; g.fillRect(8, y0 + rh - 1.5, W - 16, 1.5);
    }
    g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y + 2, W, 1.4);
    return c;
  }
  function tickerPlane(list, shift, side, role) {
    const t = new THREE.CanvasTexture(tickerCanvas(list, shift)); t.colorSpace = THREE.SRGBColorSpace; t.jpeg = .66; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, .5); t.offset.set(0, side > 0 ? 0 : .5);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(.29, 1.14), new THREE.MeshBasicMaterial({ map: t })); p.position.set(side * 1.32, 3.39, .4885); p.userData.role = role; machine.add(p); return p;
  }

  /* ---------- plinth ---------- */
  box(2.7, .03, 1.5, 0, .015, 0, accDim, machine, 0);
  box(2.62, .2, 1.42, 0, .13, 0, gun, machine, .03); box(2.66, .04, 1.46, 0, .245, 0, gunDark, machine, 0);
  hazard(2.4, .075, 0, .125, .712);
  for (const x of [-1.15, 1.15]) { box(.07, .13, .02, x, .125, .725, gunDark, machine, .01); }

  /* ---------- lower body: grey steel, a panelled front, a left-flank relay rack ---------- */
  box(2.3, 1.62, 1.12, 0, 1.06, 0, steel, machine, .02);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.06, 1.62, .06, sx * 1.15, 1.06, sz * .56, gun, machine, .012);
  for (const y of [.25, 1.87]) box(2.34, .05, 1.16, 0, y, 0, gunDark, machine, .01);
  { // front panel: seams, screws, engraved tags
    const W = 1150, H = 810, c = canvas(W, H), g = c.getContext('2d'); const px = x => (x + 1.15) * 500, py = y => (1.87 - y) * 500;
    rr(g, 14, 14, W - 28, H - 28, 10, null, 'rgba(10,12,14,.55)', 3); seam(g, 22, py(1.455), W - 22, py(1.455)); seam(g, 22, py(.43), W - 22, py(.43)); seam(g, px(-.95), py(1.455) + 3, px(-.95), py(.43)); seam(g, px(.95), py(1.455) + 3, px(.95), py(.43));
    for (const [x, y] of [[.07, 1.8], [-.07, 1.8], [1.1, 1.8], [-1.1, 1.8], [1.1, .3], [-1.1, .3], [0, .3], [.55, 1.8], [-.55, 1.8], [-.95, 1.44], [.95, 1.44], [-.95, .44], [.95, .44]]) screw(g, px(x), py(y), 7);
    for (const [s, x] of [['FEE ESTIMATOR', -.52], ['ORPHAN POOL', .52]]) { rr(g, px(x) - 150, py(.35) - 28, 300, 56, 8, '#1d2227', 'rgba(255,255,255,.25)', 2); spaced(g, s, px(x), py(.35) + 1, 25, 3, '#bfe9d6', '800'); }
    etch(g, 'RELAY 01–08', px(.45), py(1.53), 20, '#262b31', '800'); rr(g, px(.02), py(1.595) - 24, px(.91) - px(.02), 48, 6, 'rgba(10,14,16,.5)', 'rgba(255,255,255,.18)', 1.5);
    g.save(); g.translate(px(-1.13), py(.88)); g.rotate(-Math.PI / 2); etch(g, 'PEER LINK  ·  RELAY BANK', 0, 0, 17, '#262b31', '800'); g.restore();
    g.save(); g.translate(px(1.13), py(.88)); g.rotate(-Math.PI / 2); etch(g, 'ARM · REPLACE · BUMP', 0, 0, 17, '#262b31', '800'); g.restore();
    for (const [i, s] of ['RBF', 'CPFP', 'DUST', 'SYNC'].entries()) etch(g, s, px(1.04), py(1.32 - i * .2) + 36, 15, '#262b31', '800');
    plane(c, 2.3, 1.62, 0, 1.06, .5625, machine, true);
  }
  // left-flank relay rack: a steel panel with rows of lamps and toggles and two gauges
  const LP = { x: -1.152, top: 1.74 }, lpz = px => -.48 + px / 500, lpy = py => LP.top - py / 500;
  { const W = 480, H = 680, c = canvas(W, H), g = c.getContext('2d'); steelFill(g, 0, 0, W, H, 'rgba(210,216,222,.12)'); rr(g, 8, 8, W - 16, H - 16, 8, null, 'rgba(8,10,12,.6)', 3); rr(g, 12, 12, W - 24, H - 24, 6, null, 'rgba(255,255,255,.3)', 1.5);
    rr(g, 24, 22, W - 48, 44, 6, '#1d2227', 'rgba(255,255,255,.22)', 2); spaced(g, 'MEMPOOL CONTROL · SECTOR 7', W / 2, 45, 22, 3, '#bfe9d6', '800');
    ['RELAY 01–08', 'RELAY 09–16', 'RELAY 17–24', 'RELAY 25–32'].forEach((s, i) => { etch(g, s, 20, 100 + i * 52, 17, '#262b31', '800', SANS, 'left'); });
    seam(g, 24, 322, W - 24, 322); etch(g, 'ARM', 20, 346, 15, '#262b31', '800', SANS, 'left'); etch(g, 'HOLD', 20, 436, 15, '#262b31', '800', SANS, 'left');
    for (let i = 0; i < 8; i++) { etch(g, String(i + 1), 120 + i * 46, 398, 15, '#262b31', '800'); etch(g, String(i + 9), 120 + i * 46, 488, 15, '#262b31', '800'); }
    seam(g, 24, 512, W - 24, 512);
    for (const [cx, s] of [[130, 'FEE ESTIMATOR'], [350, 'ORPHAN POOL']]) { const cy = 585; g.fillStyle = '#e9eee8'; g.beginPath(); g.arc(cx, cy, 66, 0, 7); g.fill(); g.fillStyle = '#10161a'; g.beginPath(); g.arc(cx, cy, 62, 0, 7); g.fill(); g.strokeStyle = '#9cf7cf'; g.lineWidth = 2;
      for (let k = 0; k <= 20; k++) { const a = Math.PI * (.8 + 1.4 * k / 20), r0 = k % 5 ? 50 : 44; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * 57, cy + Math.sin(a) * 57); g.stroke(); }
      g.strokeStyle = feeColor(s[0] === 'F' ? 3 : 8); g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 36, Math.PI * (.8 + 1.4 * .55), Math.PI * 2.2); g.stroke(); g.strokeStyle = '#ff453a'; g.lineWidth = 3; const na = Math.PI * (s[0] === 'F' ? 1.35 : 1.7); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(na) * 52, cy + Math.sin(na) * 52); g.stroke(); g.fillStyle = '#9cf7cf'; g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill(); text(g, 'sat/vB', cx, cy + 24, 11, '#6fbf9d', '700', SANS); etch(g, s, cx, 664, 15, '#262b31', '800'); }
    plane(c, .96, 1.36, LP.x, 1.06, 0, machine, false, -Math.PI / 2, true, .78);
    const LAMPCOL = ['g', 'g', 'g', 'a', 'g', 'g', 'r', 'g', 'g', 'a', 'g', 'g', 'g', 'g', 'a', 'g', 'g', 'g', 'g', 'r', 'g', 'a', 'g', 'g', 'g', 'g', 'g', 'a', 'g', 'g', 'g', 'b'];
    for (let r = 0; r < 4; r++) for (let i = 0; i < 8; i++) { const k = r * 8 + i; lamp(LP.x - .0, lpy(100 + r * 52), lpz(200 + i * 36), LAMPCOL[k], (k * 7 + r) % 5 !== 0, machine, 'x', -1, .014); }
    for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) toggle(LP.x, lpy(370 + r * 90), lpz(120 + i * 46), machine, 'x', -1, (i + r) % 3 === 0 ? -1 : 1);
    for (const cx of [130, 350]) { const m = new THREE.Mesh(cached('gaugeRing', () => new THREE.TorusGeometry(.14, .013, 8, 36).rotateY(Math.PI / 2)), chrome); m.position.set(LP.x - .006, lpy(585), lpz(cx)); machine.add(m); }
    for (const [yy, zz] of [[.4, -.45], [.4, .45], [1.72, -.45], [1.72, .45]]) rivet(LP.x - .006, yy, zz, machine, 'x');
  }
  // left neck flank (above the lower body): lamp column and toggles
  { const x = -1.152, W = 360, H = 360, c = canvas(W, H), g = c.getContext('2d'); steelFill(g, 0, 0, W, H, 'rgba(210,216,222,.1)'); rr(g, 8, 8, W - 16, H - 16, 8, null, 'rgba(8,10,12,.6)', 3); etch(g, 'SYNC · PEERS · FEE FLOOR', W / 2, 30, 17, '#262b31', '800'); seam(g, 20, 52, W - 20, 52);
    for (let i = 0; i < 6; i++) { etch(g, 'P' + (i + 1), 40 + i * 56, 120, 14, '#262b31', '800'); etch(g, 'L' + (i + 1), 40 + i * 56, 230, 14, '#262b31', '800'); }
    plane(c, .72, .72, x, 2.29, -.05, machine, false, -Math.PI / 2, true);
    for (let i = 0; i < 6; i++) { lamp(x, 2.29 + .36 - 80 / 500, -.05 - .36 + (40 + i * 56) / 500, i === 3 ? 'a' : 'g', i !== 5, machine, 'x', -1, .014); toggle(x, 2.29 + .36 - 190 / 500, -.05 - .36 + (40 + i * 56) / 500, machine, 'x', -1, i % 2 ? 1 : -1); }
  }
  // rear of the lower body: service panel with louvres
  { const W = 1150, H = 810, c = canvas(W, H), g = c.getContext('2d'); steelFill(g, 0, 0, W, H, 'rgba(200,206,212,.1)'); rr(g, 14, 14, W - 28, H - 28, 10, null, 'rgba(10,12,14,.55)', 3); seam(g, 22, 400, W - 22, 400);
    for (const [x, y] of [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40], [W / 2, 40], [W / 2, H - 40], [40, 400], [W - 40, 400]]) screw(g, x, y, 7);
    for (let k = 0; k < 14; k++) { const y = 70 + k * 21; g.fillStyle = '#0c0f11'; g.fillRect(150, y, 850, 11); g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(150, y + 11, 850, 1.6); }
    rr(g, 290, 520, 570, 120, 8, '#1d2227', 'rgba(255,255,255,.25)', 2); spaced(g, 'MEMPOOL MADNESS  ·  MM-001', 575, 562, 29, 5, '#bfe9d6', '800'); spaced(g, 'SERVICE ACCESS · ISOLATE POWER FIRST', 575, 608, 16, 3, '#7ebf9f', '700');
    plane(c, 2.3, 1.62, 0, 1.06, -.5625, machine, false, Math.PI, true, .55);
  }

  /* ---------- lower door: the steel hatch, the Xtrata mark, the ticket slot ---------- */
  function stencil(g, s, cx, cy, size, color, maxW) {
    const lc = canvas(1100, Math.ceil(size * 1.5)), lg = lc.getContext('2d'); lg.font = `900 ${size}px ${SANS}`; let w = lg.measureText(s).width; if (w > maxW) { size = Math.floor(size * maxW / w); lg.font = `900 ${size}px ${SANS}`; w = lg.measureText(s).width; }
    lg.textBaseline = 'middle'; lg.textAlign = 'left'; lg.fillStyle = color; const cy0 = lc.height / 2; let x = (1100 - w) / 2; const st = size * .17;
    [...s].forEach(ch => { const cw = lg.measureText(ch).width; lg.fillText(ch, x, cy0); lg.lineWidth = 1.5; lg.strokeStyle = color; lg.strokeText(ch, x, cy0); lg.globalCompositeOperation = 'destination-out'; if ('OQDBPR8A0'.includes(ch)) { lg.fillRect(x + cw * .06, cy0 - size * .03, st * 1.15, size * .075); lg.fillRect(x + cw * .94 - st * 1.15, cy0 - size * .03, st * 1.15, size * .075); } lg.globalCompositeOperation = 'source-over'; x += cw; });
    g.drawImage(lc, cx - 550, cy - lc.height / 2); return size;
  }
  const door = canvas(1100, 640), dg = door.getContext('2d');
  steelFill(dg, 0, 0, 1100, 640, 'rgba(36,42,50,.62)');
  { const v = dg.createRadialGradient(550, 300, 150, 550, 320, 700); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); dg.fillStyle = v; dg.fillRect(0, 0, 1100, 640); }
  rr(dg, 22, 22, 1056, 596, 12, null, '#0c0f11', 10); rr(dg, 34, 34, 1032, 572, 8, null, 'rgba(255,255,255,.28)', 2); rr(dg, 58, 58, 984, 524, 6, null, 'rgba(0,0,0,.55)', 4); rr(dg, 62, 62, 976, 516, 4, null, 'rgba(255,255,255,.14)', 1.5);
  for (const [x, y] of [[50, 50], [1050, 50], [50, 590], [1050, 590], [550, 50], [550, 590], [50, 320], [1050, 320]]) screw(dg, x, y, 9);
  spaced(dg, 'ACCESS HATCH 07', 190, 92, 21, 5, '#9fb3a9', '800'); spaced(dg, 'PRESSURE SEALED', 910, 92, 21, 5, '#9fb3a9', '800');
  dg.save(); dg.shadowColor = '#000'; dg.shadowBlur = 24; xtrataLogo(dg, 550, 218, 218); dg.restore();
  stencil(dg, 'EVERYONE WAITS', 550, 394, 112, '#f2c200', 880); stencil(dg, 'FOR THE NEXT BLOCK', 550, 503, 88, '#f2c200', 880);
  { const gr = dg.createLinearGradient(0, 330, 0, 540); gr.addColorStop(0, 'rgba(255,255,255,.07)'); gr.addColorStop(1, 'rgba(0,0,0,.2)'); dg.fillStyle = gr; dg.fillRect(60, 330, 980, 215); }
  spaced(dg, 'PARALLAX CASINO  ·  MEMPOOL CONTROL', 550, 566, 15, 5, '#7f9288', '700');
  plane(door, 1.72, .96, 0, .93, .572, machine, false, 0, true, .74);
  box(1.86, .07, .05, 0, 1.43, .585, gun, machine, .008); box(1.86, .07, .05, 0, .43, .585, gun, machine, .008); box(.07, 1.07, .05, -.895, .93, .585, gun, machine, .008); box(.07, 1.07, .05, .895, .93, .585, gun, machine, .008);
  for (const [x, y] of [[-.895, 1.43], [.895, 1.43], [-.895, .43], [.895, .43]]) rivet(x, y, .615);
  for (const y of [1.2, .66]) { box(.1, .11, .04, -.98, y, .59, gunDark, machine, .008); rivet(-.98, y, .612); box(.1, .11, .04, .98, y, .59, gunDark, machine, .008); rivet(.98, y, .612); }
  // door-side lamps and toggles
  [['g', 1], ['g', 1], ['a', 1], ['g', 1], ['r', 0], ['g', 1]].forEach(([c, on], i) => lamp(-1.075, 1.34 - i * .13, .565, c, !!on, machine, 'z', 1, .017));
  for (let i = 0; i < 4; i++) toggle(1.075, 1.32 - i * .2, .565, machine, 'z', 1, i % 2 ? -1 : 1);
  // souvenir ticket slot
  box(.62, .1, .06, -.62, 1.66, .59, gunDark, machine, .01); box(.48, .026, .02, -.62, 1.66, .625, basic('#05080a'), machine, 0); box(.48, .008, .02, -.62, 1.646, .626, accBasic, machine, 0);
  const tk = canvas(256, 64), tg = tk.getContext('2d'); tg.fillStyle = '#12171b'; tg.fillRect(0, 0, 256, 64); rr(tg, 3, 3, 250, 58, 6, null, 'rgba(20,241,149,.55)', 2); spaced(tg, 'TICKET', 128, 33, 30, 8, ACC); plane(tk, .3, .075, -.62, 1.575, .567);
  // relay row above the door (right of the ticket slot)
  for (let i = 0; i < 8; i++) lamp(.06 + i * .115, 1.6, .565, ['g', 'g', 'a', 'g', 'g', 'g', 'a', 'g'][i], i !== 2 && i !== 6, machine, 'z', 1, .015);

  /* ---------- deck: a sloped console panel with illuminated keys and the big BROADCAST button ---------- */
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, steelDark, deck, .02); box(2.26, .5, .02, 0, 0, .09, std('#1b2025', .3, .55), deck, 0);
  box(2.34, .045, .17, 0, .29, 0, gun, deck, 0); box(2.34, .045, .17, 0, -.29, 0, gun, deck, 0);
  box(2.2, .008, .02, 0, .262, .092, accBasic, deck, 0); box(2.2, .008, .02, 0, -.262, .092, accBasic, deck, 0);
  function keyLabel(title, w, h, ink, hi, lo) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, h, [hi, lo]); g.fillRect(0, 0, w, h); rr(g, 6, 6, w - 12, h - 12, 10, null, 'rgba(255,255,255,.55)', 3); rr(g, 12, 12, w - 24, h - 24, 7, null, 'rgba(0,0,0,.25)', 2); const sz = title.length > 7 ? 44 : title.length > 4 ? 56 : 70; fit(g, title, w / 2 + 1, h / 2 + 3, w - 40, sz, 'rgba(255,255,255,.35)', '900'); fit(g, title, w / 2, h / 2 + 2, w - 40, sz, ink, '900'); return c; }
  function button(title, x, w, action, ink, hi, lo, glow) {
    box(w + .03, .25, .02, x, -.02, .1, black, deck, 0);
    const base = box(w, .22, .07, x, -.02, .13, gunDark, deck, .025), top = box(w - .03, .2, .065, x, -.02, .18, std(glow, .1, .4, { emissive: glow, emissiveIntensity: .35 }), deck, .02);
    const face = plane(keyLabel(title, 340, 220, ink, hi, lo), w - .06, (w - .06) * 220 / 340, x, -.02, .2155, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('FEES', -.86, .34, 'pays', '#2a2410', '#fff4c0', '#e3b94a', '#c99a22'); button('−FEE', -.48, .32, 'betDown', '#2e1304', '#ffd1a0', '#f08a30', '#c8620f'); button('+FEE', -.13, .32, 'betUp', '#06301c', '#c4ffe0', '#3ddc8f', '#14a863'); button('AUTO-BUMP', .24, .36, 'auto', '#06223a', '#cfe8ff', '#5aa8f0', '#2f78c0');
  { const cap = canvas(1024, 64), cg = cap.getContext('2d'); const items = [['PAYS', -.86], ['BET −', -.48], ['BET +', -.13], ['AUTO', .24], ['SPIN', .8]]; items.forEach(([t, x]) => spaced(cg, t, 512 + x * (1024 / 2.2), 32, 26, 5, '#a9c9bb')); plane(cap, 2.2, .1, 0, -.2, .102, deck, true); }
  for (let i = 0; i < 12; i++) lamp(-1.0 + i * .11, .235, .1, ['g', 'g', 'a', 'g', 'g', 'g', 'a', 'g', 'g', 'r', 'g', 'g'][i], i !== 9 && i !== 2, deck, 'z', 1, .012);
  // The big round spin button. Its cap is spinPhysical; the casino presses it in along z.
  const ring = cyl(.25, .25, .07, .8, -.02, .13, gun, deck, 36, 'z'); ring.userData.action = 'spin';
  const rim = cyl(.226, .226, .075, .8, -.02, .135, accBasic, deck, 36, 'z'); rim.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .8, -.02, .19, std('#12a866', .3, .35), deck, 36, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  { const capFace = canvas(256, 256), cf = capFace.getContext('2d'); { const gr = cf.createRadialGradient(100, 90, 6, 128, 128, 132); gr.addColorStop(0, '#d8ffe9'); gr.addColorStop(.35, '#42f59d'); gr.addColorStop(.8, '#10b36b'); gr.addColorStop(1, '#0a7a4a'); cf.fillStyle = gr; cf.fillRect(0, 0, 256, 256); }
    cf.strokeStyle = '#06301c'; cf.fillStyle = '#06301c'; cf.lineWidth = 7; cf.lineCap = 'round'; cf.beginPath(); cf.arc(128, 82, 9, 0, 7); cf.fill(); for (const r of [24, 40]) for (const s of [-1, 1]) { cf.beginPath(); cf.arc(128, 82, r, Math.PI * (s < 0 ? 1.12 : -.38), Math.PI * (s < 0 ? 1.62 : .12)); cf.stroke(); }
    fit(cf, 'BROADCAST', 129, 160, 190, 38, 'rgba(255,255,255,.4)', '900'); fit(cf, 'BROADCAST', 128, 158, 190, 38, '#06301c', '900'); spaced(cf, 'SPIN', 128, 198, 17, 5, '#0a5a38', '800');
    const t = new THREE.CanvasTexture(capFace); t.colorSpace = THREE.SRGBColorSpace; t.jpeg = .88;
    const R = .425, th = Math.asin(.2 / R), dome = new THREE.SphereGeometry(R, 32, 8, 0, Math.PI * 2, 0, th); dome.rotateX(Math.PI / 2); dome.translate(0, 0, -(R - .05)); { const p = dome.getAttribute('position'), uv = dome.getAttribute('uv'); for (let i = 0; i < p.count; i++) { uv.array[i * 2] = p.array[i * 3] / .4 + .5; uv.array[i * 2 + 1] = p.array[i * 3 + 1] / .4 + .5; } }
    const domeMesh = new THREE.Mesh(dome, std('#ffffff', .15, .32, { map: t, emissive: '#0b7a47', emissiveIntensity: .55 })); domeMesh.position.set(0, 0, .035); domeMesh.userData.action = 'spin'; cap.add(domeMesh); }

  /* ---------- upper body: the neck, the wide head with a ticker down each side, the radar bezel ---------- */
  box(2.3, .85, 1.0, 0, 2.295, -.05, steel, machine, .02);
  box(2.98, 1.31, 1.0, 0, 3.375, -.05, steel, machine, .02);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.07, 1.31, .07, sx * 1.49, 3.375, sz > 0 ? .45 : -.55, gun, machine, .012);
  for (const y of [2.72, 4.03]) box(3.02, .05, 1.04, 0, y, -.05, gunDark, machine, .01);
  for (const sx of [-1, 1]) { hazard(.34, .04, sx * 1.32, 2.752, .4525); box(.34, 1.24, .035, sx * 1.32, 3.39, .4675, gunDark, machine, .01); for (const sy of [-1, 1]) { rivet(sx * 1.32 - .16, 3.39 + sy * .6, .488); rivet(sx * 1.32 + .16, 3.39 + sy * .6, .488); } }
  const tL = tickerPlane(mixed, 0, -1, 'tickerL'), tR = tickerPlane(mixed.slice().reverse(), 13, 1, 'tickerR');
  // radar bezel: a heavy dark slab, an etched graticule, a curved glass lip, an accent-green line round the glass, and the fee readout plate
  box(2.26, 1.72, .06, 0, 2.95, .465, gunDark, machine, .02);
  { const W = 1356, H = 1032, c = canvas(1017, 774), g = c.getContext('2d'); g.scale(.75, .75); g.fillStyle = lin(g, 0, 0, W, H, ['#171c20', '#0d1114', '#171c20']); g.fillRect(0, 0, W, H); const cx = W / 2, cy = H / 2; g.lineCap = 'round';
    g.save(); g.shadowColor = ACC; g.shadowBlur = 5; g.strokeStyle = 'rgba(20,241,149,.62)'; g.lineWidth = 1.6;
    for (const R of [470, 490, 640, 655, 668]) { g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke(); }
    for (let k = 0; k < 120; k++) { const x = 40 + k * (W - 80) / 119, major = k % 10 === 0 ? 26 : k % 5 === 0 ? 18 : 10; for (const y0 of [8, H - 8]) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 + (y0 < 100 ? major : -major)); g.stroke(); } }
    for (let k = 0; k < 90; k++) { const y = 40 + k * (H - 80) / 89, major = k % 10 === 0 ? 26 : k % 5 === 0 ? 18 : 10; for (const x0 of [8, W - 8]) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + (x0 < 100 ? major : -major), y); g.stroke(); } }
    g.lineWidth = 3; for (const [x, y, a] of [[cx, 6, 0], [cx, H - 6, 1], [6, cy, 2], [W - 6, cy, 3]]) { g.beginPath(); if (a < 2) { g.moveTo(x - 34, y); g.lineTo(x + 34, y); g.moveTo(x, y); g.lineTo(x, y + (a ? -40 : 40)); } else { g.moveTo(x, y - 34); g.lineTo(x, y + 34); g.moveTo(x, y); g.lineTo(x + (a === 2 ? 40 : -40), y); } g.stroke(); }
    g.restore();
    text(g, '000', cx, 46, 15, '#5fe0a8', '700', MONO); text(g, '180', cx, H - 46, 15, '#5fe0a8', '700', MONO); g.save(); g.translate(26, cy); g.rotate(-Math.PI / 2); text(g, '270', 0, 0, 15, '#5fe0a8', '700', MONO); g.restore(); g.save(); g.translate(W - 26, cy); g.rotate(Math.PI / 2); text(g, '090', 0, 0, 15, '#5fe0a8', '700', MONO); g.restore();
    for (const [x, y] of [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]]) screw(g, x, y, 9);
    plane(c, 2.26, 1.72, 0, 2.95, .4975, machine, false);
  }
  { const geo = frameGeo(2.12, 1.5, .08, 2.0, 1.38, .04, { depth: .014, bevelEnabled: true, bevelThickness: .016, bevelSize: .012, bevelSegments: 2, curveSegments: 3 }); const lip = new THREE.Mesh(geo, std('#1b2126', .55, .24, { map: steelTex })); lip.position.set(0, 2.95, .5); machine.add(lip); }
  box(2.02, 1.4, .03, 0, 2.95, .505, basic('#02070a'), machine, 0);
  for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { rivet(sx * 1.095, 2.95 + sy * .83, .5); }
  const radarGlow = new THREE.Mesh(frameGeo(2.034, 1.414, .046, 2.0, 1.38, .04, { depth: .003, bevelEnabled: false, curveSegments: 6 }), basic(ACC, { transparent: true, opacity: .95, depthWrite: false })); radarGlow.position.set(0, 2.95, .5305); radarGlow.userData.role = 'radarGlow'; machine.add(radarGlow);
  { const W = 1250, H = 950, c = canvas(W, H), g = c.getContext('2d'); g.save(); g.shadowColor = 'rgba(20,241,149,.9)'; g.shadowBlur = 46; g.fillStyle = 'rgba(20,241,149,.55)'; for (let k = 0; k < 3; k++) { rr(g, W / 2 - 565, H / 2 - 430, 1130, 860, 26, 'rgba(20,241,149,.5)'); } g.restore(); g.globalCompositeOperation = 'destination-out'; rr(g, W / 2 - 566, H / 2 - 431, 1132, 862, 26, '#000'); plane(c, 2.5, 1.9, 0, 2.95, .4962, machine, true); }
  // fee readout plate along the bottom of the bezel
  { const W = 1260, H = 104, c = canvas(W, H), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, H, ['#0a1210', '#04100b']); g.fillRect(0, 0, W, H); rr(g, 5, 5, W - 10, H - 10, 10, null, 'rgba(20,241,149,.6)', 3); rr(g, 12, 12, W - 24, H - 24, 7, null, 'rgba(0,0,0,.6)', 2);
    g.save(); g.shadowColor = ACC; g.shadowBlur = 10; spaced(g, 'FEE', 100, 52, 40, 9, ACC, '900'); g.restore(); const ticks = [['1', 330], ['5', 540], ['20', 750], ['50', 960]]; g.strokeStyle = 'rgba(20,241,149,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(230, 52); g.lineTo(1170, 52); g.stroke();
    ticks.forEach(([s, x], i) => { const col = feeColor([1, 5, 20, 50][i]); g.fillStyle = col; g.fillRect(x - 3, 30, 6, 44); g.save(); g.shadowColor = col; g.shadowBlur = 10; text(g, s, x + 40, 52, 36, col, '900', MONO); g.restore(); }); text(g, 'sat/vB', 1215, 52, 20, '#5fe0a8', '700', MONO, 'right');
    plane(c, 1.3, 1.3 * H / W, 0, 2.2, .5395, machine, false); box(1.34, .115, .02, 0, 2.2, .5285, gunDark, machine, .008); }

  const shot = (opts && opts.screenImage) || (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, 480, ['#02140c', '#031c11', '#02140c']); g.fillRect(0, 0, 700, 480); const cx = 350, cy = 240; g.strokeStyle = 'rgba(20,241,149,.28)'; g.lineWidth = 1.4; for (const r of [70, 140, 210, 280]) { g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(cx, 0); g.lineTo(cx, 480); g.moveTo(0, cy); g.lineTo(700, cy); g.stroke(); const sw = g.createRadialGradient(cx, cy, 0, cx, cy, 300); sw.addColorStop(0, 'rgba(20,241,149,.0)'); sw.addColorStop(1, 'rgba(20,241,149,.0)'); g.save(); g.translate(cx, cy); for (let k = 0; k < 40; k++) { g.rotate(-.025); g.strokeStyle = `rgba(20,241,149,${.34 * (1 - k / 40)})`; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(300, 0); g.stroke(); } g.restore(); pend.slice(0, 26).forEach((p, i) => { const a = i * 2.399, r = 40 + (i * 53 % 230); g.fillStyle = feeColor(p.feeRate); g.shadowColor = g.fillStyle; g.shadowBlur = 10; g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .8, 4, 0, 7); g.fill(); }); g.shadowBlur = 0; g.save(); g.shadowColor = ACC; g.shadowBlur = 24; text(g, 'MEMPOOL MADNESS', 350, 190, 54, '#9dffd6', '900'); g.restore(); spaced(g, 'BROADCAST  \u00b7  OUTBID  \u00b7  WAIT FOR THE NEXT BLOCK', 350, 246, 14, 4, '#4fd9a0'); spaced(g, 'PRESS BROADCAST TO PLAY', 350, 290, 14, 5, '#2fa878'); g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < 480; y += 4) g.fillRect(0, y + 2, 700, 1.4); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .5215, machine, false); screenMesh.userData.role = 'screenMesh';

  /* ---------- marquee: MEMPOOL MADNESS in glowing accent lettering with bulb dots ---------- */
  box(2.98, .74, 1.08, 0, 4.42, -.05, steel, machine, .02); for (const y of [4.07, 4.77]) box(3.02, .06, 1.12, 0, y, -.05, gunDark, machine, .008);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(.06, .74, .06, sx * 1.49, 4.42, sz > 0 ? .5 : -.6, gun, machine, .01);
  function signCanvas(w, h, small) {
    const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, h, ['#050c0a', '#0a1814', '#050c0a']); g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(20,241,149,.07)'; g.lineWidth = 1; for (let x = 0; x < w; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    const letters = [...'MEMPOOL MADNESS'], size = h * .52; g.font = `900 ${size}px ${SANS}`; g.textBaseline = 'middle'; g.textAlign = 'left'; let gap = size * .07, ws = letters.map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (letters.length - 1); const k = Math.min(1, (w * .8) / total); let cx = w / 2 - total * k / 2; const cy = h * .46;
    g.save(); g.translate(0, 0); g.scale(k, 1); cx /= k;
    letters.forEach((ch, i) => { g.shadowColor = 'rgba(20,241,149,.95)'; g.shadowBlur = h * .2; g.fillStyle = ACC; g.fillText(ch, cx, cy); cx += ws[i] + gap; }); cx = (w / 2 - total * k / 2) / k;
    letters.forEach((ch, i) => { g.shadowBlur = 0; g.lineJoin = 'round'; g.lineWidth = h * .035; g.strokeStyle = '#03140d'; g.strokeText(ch, cx, cy); g.fillStyle = lin(g, 0, cy - size * .5, 0, cy + size * .5, ['#e8fff5', '#7dffc6', ACC, '#0dbf78']); g.fillText(ch, cx, cy); g.lineWidth = h * .008; g.strokeStyle = 'rgba(240,255,250,.85)'; g.strokeText(ch, cx, cy - 1); cx += ws[i] + gap; });
    g.restore();
    const bw = w * .035; for (let b = 0; b < 4; b++) for (const sx of [0, 1]) { const x = sx ? w - w * .045 - bw * .6 : w * .045, y = h * .2 + b * h * .16; g.fillStyle = feeColor([.3, 1.5, 6, 30][b]); g.globalAlpha = .9; g.fillRect(sx ? w - w * .045 - bw : w * .045, y, bw, h * .1); g.globalAlpha = 1; }
    spaced(g, 'PARALLAX CASINO', w / 2, h * .9, small ? 11 : h * .06, small ? 3 : h * .02, '#6fa890', '700'); return c;
  }
  const signTex = tex(signCanvas(1500, 306), false, .74); plane(signTex, 2.94, .6, 0, 4.42, .4925, machine, false);
  for (let i = 0; i < 30; i++) { const t = i / 29; sphere(.022, -1.42 + t * 2.84, 4.77, .512, i % 2 ? accHot : accBasic); sphere(.022, -1.42 + t * 2.84, 4.07, .512, i % 2 ? accBasic : accHot); }
  for (let i = 1; i < 6; i++) { sphere(.022, -1.44, 4.07 + i * .1167, .5, i % 2 ? accBasic : accHot); sphere(.022, 1.44, 4.07 + i * .1167, .5, i % 2 ? accHot : accBasic); }
  plane(signTex, 2.94, .6, 0, 4.42, -.5925, machine, false, Math.PI);
  { const c = canvas(640, 300), g = c.getContext('2d'); steelFill(g, 0, 0, 640, 300, 'rgba(210,216,222,.1)'); rr(g, 10, 10, 620, 280, 8, null, 'rgba(8,10,12,.6)', 3); rr(g, 120, 100, 400, 100, 8, '#1d2227', 'rgba(255,255,255,.22)', 2); spaced(g, 'MEMPOOL CONTROL', 320, 150, 28, 5, '#bfe9d6', '800'); for (const [x, y] of [[40, 40], [600, 40], [40, 260], [600, 260]]) screw(g, x, y, 9); const st = tex(c, false, .75); for (const sx of [-1, 1]) plane(st, 1.04, .488, sx * 1.4925, 4.42, -.05, machine, false, sx * Math.PI / 2, true); }

  /* ---------- topper (core): a slowly turning column of stacked translucent fee-coloured blocks ---------- */
  box(1.0, .06, .78, 0, 4.82, -.05, gunDark, machine, .01); cyl(.17, .26, .2, 0, 4.95, -.05, steelDark, machine, 14); box(.82, .04, .62, 0, 5.065, -.05, gun, machine, .01); box(.76, .008, .56, 0, 5.088, -.05, accBasic, machine, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { rivet(sx * .42, 4.855, -.05 + sz * .33, machine, 'y'); }
  for (let i = 0; i < 9; i++) lamp(-.32 + i * .08, 5.065, .26, ['g', 'g', 'a', 'g', 'g', 'g', 'a', 'g', 'g'][i], i !== 2, machine, 'z', 1, .011);
  const core = new THREE.Group(); core.position.set(0, 5.53, -.05); core.userData.role = 'core'; machine.add(core);
  cyl(.016, .016, .9, 0, 0, 0, chrome, core, 8);
  const blockTex = (() => { const c = canvas(128, 128), g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 92); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.55, 'rgba(255,255,255,.68)'); gr.addColorStop(1, 'rgba(255,255,255,.36)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(60, 0); g.lineTo(0, 60); g.closePath(); g.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.webp = .8; return t; })();
  const BLOCKS = [[.84, .6, 0, 0, 0], [.78, .56, .05, -.02, .1], [.86, .62, -.04, .03, -.08], [.8, .58, 0, -.03, .14], [.84, .6, .06, .02, -.12], [.74, .54, -.05, 0, .07], [.82, .58, .03, -.03, -.1], [.78, .56, -.06, .02, .16], [.72, .52, 0, 0, -.05], [.66, .48, .04, .02, .09]];
  const BH = .078, GAP = .0089, edgeMat = basic('#eafff4', { transparent: true, opacity: .95 }), blockFee = [.12, .4, .8, 1.6, 2.6, 3.8, 5.5, 9, 18, 45];
  BLOCKS.forEach(([w, d, ox, oz, yaw], i) => {
    const y = (i - (BLOCKS.length - 1) / 2) * (BH + GAP), mat = basic(feeColor(blockFee[i]), { map: blockTex, transparent: true, opacity: .66, side: THREE.DoubleSide, depthWrite: false });
    const SC = 1.14; w *= SC; d *= SC; ox *= SC; oz *= SC; const m = new THREE.Mesh(new THREE.BoxGeometry(w, BH, d), mat); m.position.set(ox, y, oz); m.rotation.y = yaw; m.userData.role = 'coreBlock' + i; core.add(m);
    const t = .0075, e = []; for (const sy of [-1, 1]) for (const sz of [-1, 1]) e.push(new THREE.BoxGeometry(w, t, t).translate(0, sy * BH / 2, sz * d / 2)); for (const sy of [-1, 1]) for (const sx of [-1, 1]) e.push(new THREE.BoxGeometry(t, t, d).translate(sx * w / 2, sy * BH / 2, 0)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) e.push(new THREE.BoxGeometry(t, BH, t).translate(sx * w / 2, 0, sz * d / 2));
    m.add(new THREE.Mesh(mergeGeos(e), edgeMat));
  });

  /* ---------- lever: a big red launch-control lever on the right flank, behind a flip-up safety cover ---------- */
  const PIV = { x: 1.34, y: 1.3, z: -.1 }, REST = .28, PULL = 1.02, SEC = { r0: .16, r1: .64, t0: .04, t1: 1.5 };
  { // fan-shaped housing plate, the launch-travel scale and the tower that carries the cover hinge
    const s = new THREE.Shape(), N = 28; for (let i = 0; i <= N; i++) { const a = SEC.t0 + (SEC.t1 - SEC.t0) * i / N, p = [SEC.r1 * Math.sin(a), SEC.r1 * Math.cos(a)]; i ? s.lineTo(...p) : s.moveTo(...p); } for (let i = N; i >= 0; i--) { const a = SEC.t0 + (SEC.t1 - SEC.t0) * i / N; s.lineTo(SEC.r0 * Math.sin(a), SEC.r0 * Math.cos(a)); } s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: .1, bevelEnabled: true, bevelThickness: .008, bevelSize: .008, bevelSegments: 1, curveSegments: 1 }); g.rotateY(-Math.PI / 2); g.translate(1.26, PIV.y, PIV.z); machine.add(new THREE.Mesh(g, steelDark));
    const W = 700, H = 700, c = canvas(W, H), cg = c.getContext('2d'), pz = z => (z - PIV.z + .02) * 1000, py = y => (PIV.y + .66 - y) * 1000, P = (r, a) => [pz(PIV.z + r * Math.sin(a)), py(PIV.y + r * Math.cos(a))];
    for (let i = 0; i < 40; i++) { const a0 = REST + PULL * i / 40, a1 = REST + PULL * (i + 1) / 40; cg.strokeStyle = feeColor(Math.exp(Math.log(.1) + (Math.log(50) - Math.log(.1)) * i / 40)); cg.lineWidth = 16; const [x0, y0] = P(.54, a0), [x1, y1] = P(.54, a1); cg.beginPath(); cg.moveTo(x0, y0); cg.lineTo(x1, y1); cg.stroke(); }
    cg.lineCap = 'butt'; for (let k = 0; k <= 20; k++) { const a = REST + PULL * k / 20, [xa, ya] = P(k % 5 ? .58 : .56, a), [xb, yb] = P(.62, a); cg.strokeStyle = '#e8f0ec'; cg.lineWidth = k % 5 ? 2.5 : 5; cg.beginPath(); cg.moveTo(xa, ya); cg.lineTo(xb, yb); cg.stroke(); }
    for (const [lbl, a] of [['ARM', REST], ['LAUNCH', REST + PULL]]) { const [x, y] = P(.43, a); cg.save(); cg.translate(x, y); cg.rotate(Math.PI / 2 - a + (a > .8 ? Math.PI : 0)); text(cg, lbl, 0, 0, 24, '#e8f0ec', '900'); cg.restore(); }
    plane(c, .7, .7, 1.2695, PIV.y + .66 - .35, PIV.z - .02 + .35, machine, true, Math.PI / 2);
    // tower behind the lever: carries the hinge and the LAUNCH plate
    cyl(.17, .17, .12, 1.21, PIV.y, PIV.z, gun, machine, 28, 'x'); box(.12, 1.5, .24, 1.21, 1.72, -.3, gun, machine, .012); box(.4, .04, .13, 1.35, 2.4, -.115, gunDark, machine, .006); for (const y of [1.2, 1.5, 1.8, 2.1, 2.4]) rivet(1.272, y, -.3, machine, 'x');
  }
  { const W = 480, H = 200, c = canvas(W, H), g = c.getContext('2d'); g.fillStyle = '#f2c200'; g.fillRect(0, 0, W, H); g.fillStyle = '#16181b'; g.fillRect(0, 0, W, 16); g.fillRect(0, H - 16, W, 16); for (let x = -20; x < W; x += 40) { g.beginPath(); g.moveTo(x, 16); g.lineTo(x + 20, 16); g.lineTo(x + 10, 0); g.lineTo(x - 10, 0); g.closePath(); g.fill(); } stencil(g, 'LAUNCH', 240, 78, 100, '#15171a', 400); spaced(g, 'AUTHORISED OPERATORS ONLY', 240, 158, 22, 3, '#15171a', '900'); plane(c, .24, .1, 1.2755, 2.2, -.3, machine, false, Math.PI / 2); }
  lamp(1.2755, 2.05, -.3, 'a', true, machine, 'x', 1, .022); { const c = canvas(256, 64), g = c.getContext('2d'); g.fillStyle = '#1d2227'; g.fillRect(0, 0, 256, 64); spaced(g, 'ARMED', 128, 33, 30, 8, '#ffb62e', '900'); plane(c, .2, .05, 1.2755, 1.95, -.3, machine, false, Math.PI / 2); }
  const lever = new THREE.Group(); lever.position.set(PIV.x, PIV.y, PIV.z); lever.rotation.x = REST; lever.userData.role = 'lever'; machine.add(lever);
  const shaft = cyl(.034, .042, .76, 0, .38, 0, redLever, lever, 18), head = sphere(.105, 0, .86, 0, redLever, lever, 24, 16);
  const hub = cyl(.085, .085, .16, 0, 0, 0, chrome, lever, 20, 'x'), hubBolt = cyl(.04, .04, .19, 0, 0, 0, gunDark, lever, 8, 'x'), collar = cyl(.056, .056, .06, 0, .7, 0, chrome, lever, 18), collar2 = cyl(.048, .048, .03, 0, .24, 0, chrome, lever, 18), tail = cyl(.03, .03, .16, 0, -.08, 0, redDark, lever, 12), tailKnob = sphere(.05, 0, -.17, 0, redLever, lever, 14, 10);
  [shaft, head, hub, hubBolt, collar, collar2, tail, tailKnob].forEach(m => { m.userData.action = 'spin'; });
  // flip-up safety cover over the lever grip: hinged at its top/back edge; exported open (tilted up and back).
  const HINGE = { x: PIV.x, y: 2.36, z: -.07 }, COVER_OPEN = -.9;
  const cover = new THREE.Group(); cover.position.set(HINGE.x, HINGE.y, HINGE.z); cover.rotation.x = COVER_OPEN; cover.userData.role = 'safetyCover'; machine.add(cover);
  { const glass = basic('#ff2a2a', { transparent: true, opacity: .34, side: THREE.DoubleSide, depthWrite: false }), D = .34, Hh = .28, Wd = .34;
    cyl(.028, .028, Wd + .06, 0, 0, 0, chrome, cover, 14, 'x');
    box(Wd, .012, D, 0, -.006 - .02, D / 2, glass, cover, 0); for (const s of [-1, 1]) box(.012, Hh, D, s * (Wd / 2 - .006), -Hh / 2 - .02, D / 2, glass, cover, 0); box(Wd, Hh, .012, 0, -Hh / 2 - .02, D - .006, glass, cover, 0);
    for (const s of [-1, 1]) { box(.024, .024, D, s * Wd / 2, -.032, D / 2, gunDark, cover, 0); box(.024, .026, D, s * Wd / 2, -Hh - .02, D / 2, gunDark, cover, 0); hazard(D - .02, .024, s * (Wd / 2 + .0125), -Hh - .02, D / 2, cover, s * Math.PI / 2); }
    box(Wd + .024, .024, .024, 0, -.032, D, gunDark, cover, 0); box(Wd + .024, .028, .024, 0, -Hh - .02, D, gunDark, cover, 0); hazard(Wd + .02, .028, 0, -Hh - .02, D + .0125, cover); box(.12, .04, .05, 0, -.03, D + .03, gunDark, cover, .008);
    box(.05, .05, .06, -Wd / 2 - .005, -.02, .02, gunDark, cover, 0); box(.05, .05, .06, Wd / 2 + .005, -.02, .02, gunDark, cover, 0); }
  // spark anchor: the end of the lever travel on the fan plate (where the launch lands); a green launch-pad lamp sits there
  const th = REST + PULL, SP = { x: 1.3, y: PIV.y + .6 * Math.cos(th), z: PIV.z + .6 * Math.sin(th) };
  cyl(.05, .05, .01, 1.2655, SP.y, SP.z, gunDark, machine, 20, 'x'); cyl(.038, .038, .014, 1.266, SP.y, SP.z, accBasic, machine, 20, 'x');
  const sparkAnchor = new THREE.Group(); sparkAnchor.position.set(SP.x, SP.y, SP.z); sparkAnchor.userData.role = 'sparkAnchor'; machine.add(sparkAnchor);

  /* ---------- head flanks: a monitor board on each side (lamp rows, toggles, vents), and a lamp column on the right neck ---------- */
  { const W = 480, H = 600, c = canvas(W, H), g = c.getContext('2d'); steelFill(g, 0, 0, W, H, 'rgba(210,216,222,.1)'); rr(g, 8, 8, W - 16, H - 16, 8, null, 'rgba(8,10,12,.6)', 3); rr(g, 12, 12, W - 24, H - 24, 6, null, 'rgba(255,255,255,.3)', 1.5);
    rr(g, 24, 22, W - 48, 44, 6, '#1d2227', 'rgba(255,255,255,.22)', 2); spaced(g, 'MEMPOOL MONITOR', W / 2, 45, 22, 4, '#bfe9d6', '800');
    for (let k = 0; k < 6; k++) { const y = 84 + k * 17; g.fillStyle = '#0c0f11'; g.fillRect(40, y, W - 80, 9); g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(40, y + 9, W - 80, 1.5); }
    ['TX IN', 'TX OUT', 'RBF', 'ORPHAN'].forEach((t, i) => etch(g, t, 28, 214 + i * 46, 15, '#262b31', '800', SANS, 'left'));
    seam(g, 24, 396, W - 24, 396); for (let i = 0; i < 8; i++) etch(g, String(i + 1), 64 + i * 50, 462, 15, '#262b31', '800'); etch(g, 'FEE FLOOR \u00b7 NODE SYNC \u00b7 RBF WATCH', W / 2, 508, 15, '#262b31', '800');
    g.drawImage(hazardCanvas(400, 26, 30), 40, 540); for (const [x, y] of [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]]) screw(g, x, y, 7);
    const t = tex(c, false, .75);
    for (const side of [-1, 1]) { plane(t, .96, 1.2, side * 1.4905, 3.375, -.05, machine, false, side * Math.PI / 2, true); const zz = px => -.05 - side * (px / 500 - .48);
      for (let r = 0; r < 4; r++) for (let i = 0; i < 10; i++) lamp(side * 1.4905, 3.375 + .6 - (214 + r * 46) / 500, zz(140 + i * 32), ['g', 'g', 'a', 'g', 'g', 'r', 'g', 'g', 'a', 'g'][(i + r * 3) % 10], (i * 5 + r * 3) % 7 !== 0, machine, 'x', side, .012);
      for (let i = 0; i < 8; i++) toggle(side * 1.4905, 3.375 + .6 - 430 / 500, zz(64 + i * 50), machine, 'x', side, (i + (side > 0 ? 1 : 0)) % 3 === 0 ? -1 : 1); }
  }
  for (let i = 0; i < 6; i++) lamp(1.152, 2.02 + i * .12, .36, ['g', 'g', 'a', 'g', 'r', 'g'][i], i !== 4, machine, 'x', 1, .014);

  /* ---------- back of the head: a data plate and hazard trim ---------- */
  { const W = 1490, H = 640, c = canvas(W, H), g = c.getContext('2d'); steelFill(g, 0, 0, W, H, 'rgba(200,206,212,.1)'); rr(g, 14, 14, W - 28, H - 28, 10, null, 'rgba(10,12,14,.55)', 3); seam(g, 22, 320, W - 22, 320);
    for (const [x, y] of [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40], [W / 2, 40], [W / 2, H - 40], [40, 320], [W - 40, 320]]) screw(g, x, y, 8);
    for (let k = 0; k < 7; k++) { const y = 70 + k * 30; g.fillStyle = '#0c0f11'; g.fillRect(150, y, 1190, 15); g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(150, y + 15, 1190, 1.6); }
    rr(g, 450, 440, 590, 110, 8, '#1d2227', 'rgba(255,255,255,.25)', 2); spaced(g, 'BLOCK TEMPLATE UNIT · MM-001', 745, 478, 27, 5, '#bfe9d6', '800'); spaced(g, 'EVERYONE WAITS FOR THE NEXT BLOCK', 745, 520, 18, 4, '#7ebf9f', '700');
    plane(c, 2.98, 1.28, 0, 3.375 - .015, -.5525, machine, false, Math.PI, true, .55); hazard(2.9, .05, 0, 2.75, -.554, machine, Math.PI); }
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
