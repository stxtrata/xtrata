/* Rune Pit cabinet, built with THREE and exported in the casino's packed-model format
   ({root, geometries, materials, textures}). Run by build-cabinet.mjs in a headless browser.
   Look: a volcanic forge. Cracked black basalt body with lava glowing in the cracks and in the corner seams, iron
   corner bands with rivets, the screen set in a stepped, carved stone tablet, a turning ring of dark stone on top with
   the first rune names carved round it and glowing orange from inside, and an iron forge hammer for a lever that
   strikes an anvil on a basalt block. Nothing here imitates another project's art or logo; the Xtrata mark on the
   lower door is drawn with the XLOGO vector code. Part names/roles follow Ordinal Rush (screenMesh, core as the
   topper, spinPhysical, lever, deck actions spin/betUp/betDown/auto/pays), plus anvil and sparkAnchor. */
window.buildCabinet = function buildCabinet(opts) {
  const ACC = '#d64545', EMBER = '#ff8a3d', HOT = '#ffc060';
  const machine = new THREE.Group(); machine.name = 'Rune Pit';
  let seedN = 7; const rnd = () => { seedN |= 0; seedN = seedN + 0x6D2B79F5 | 0; let t = Math.imul(seedN ^ seedN >>> 15, 1 | seedN); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const SERIF = '"DejaVu Serif Condensed", "DejaVu Serif", Georgia, serif', SANS = '"DejaVu Sans Condensed", "DejaVu Sans", Arial, sans-serif';
  const text = (g, s, x, y, size, color, weight = '800', font = SERIF, align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '700', font = SANS) => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const basic = (color, extra = {}) => new THREE.MeshBasicMaterial(Object.assign({ color }, extra));

  /* ---------- procedural stone: a tileable basalt grain and lava-crack overlays ---------- */
  function basaltCanvas(size) {
    const c = canvas(size, size), g = c.getContext('2d');
    g.fillStyle = '#222024'; g.fillRect(0, 0, size, size);
    const wrap = fn => { for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) { g.save(); g.translate(dx, dy); fn(); g.restore(); } };
    for (let i = 0; i < 260; i++) { const x = rnd() * size, y = rnd() * size, r = 18 + rnd() * 70, dark = rnd() < .55, a = .05 + rnd() * .1; wrap(() => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, dark ? `rgba(8,5,8,${a})` : `rgba(96,92,110,${a * .9})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }); }
    for (let i = 0; i < 520; i++) { const x = rnd() * size, y = rnd() * size, r = 1 + rnd() * 3.2; wrap(() => { g.fillStyle = 'rgba(6,3,5,.7)'; g.beginPath(); g.ellipse(x, y, r, r * .8, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(130,120,140,.2)'; g.beginPath(); g.ellipse(x + r * .35, y + r * .45, r * .8, r * .45, 0, 0, 7); g.fill(); }); }
    g.lineCap = 'round';
    for (let i = 0; i < 70; i++) { let x = rnd() * size, y = rnd() * size, a = rnd() * 6.28; const pts = [[x, y]]; for (let k = 0; k < 6; k++) { a += (rnd() - .5) * 1.2; x += Math.cos(a) * (8 + rnd() * 16); y += Math.sin(a) * (8 + rnd() * 16); pts.push([x, y]); } wrap(() => { g.strokeStyle = 'rgba(5,2,4,.55)'; g.lineWidth = .8 + rnd() * .8; g.beginPath(); pts.forEach(([px, py], j) => j ? g.lineTo(px, py) : g.moveTo(px, py)); g.stroke(); }); }
    for (let i = 0; i < 16; i++) { let x = rnd() * size, y = rnd() * size, a = rnd() * 6.28; const pts = [[x, y]]; for (let k = 0; k < 14; k++) { a += (rnd() - .5) * .7; x += Math.cos(a) * (14 + rnd() * 26); y += Math.sin(a) * (14 + rnd() * 26); pts.push([x, y]); } wrap(() => { for (const [lw, col, off] of [[3.2, 'rgba(2,1,2,.8)', 0], [1.1, 'rgba(110,100,125,.22)', 1.6]]) { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); pts.forEach(([px, py], j) => j ? g.lineTo(px + off, py + off) : g.moveTo(px + off, py + off)); g.stroke(); } }); }
    const img = g.getImageData(0, 0, size, size), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 11; d[i] += n; d[i + 1] += n * .9; d[i + 2] += n; if (rnd() < .0016) { d[i] += 70; d[i + 1] += 64; d[i + 2] += 80; } } g.putImageData(img, 0, 0);
    return c;
  }
  const basaltTex = new THREE.CanvasTexture(basaltCanvas(512)); basaltTex.colorSpace = THREE.SRGBColorSpace; basaltTex.wrapS = basaltTex.wrapT = THREE.RepeatWrapping; basaltTex.jpeg = .8;

  // Branching lava cracks on a transparent canvas: a soft glow halo, a dark rim, the lava itself and a hot core.
  function crackCanvas(w, h, seed, trunks, o = {}) {
    seedN = seed; const c = canvas(w, h), g = c.getContext('2d'), segs = [], S = o.scale || 1;
    const walk = (x, y, a, steps, wd, depth) => { for (let i = 0; i < steps; i++) { const nx = x + Math.cos(a) * (10 + rnd() * 18) * S, ny = y + Math.sin(a) * (10 + rnd() * 18) * S, t = 1 - i / steps; segs.push([x, y, nx, ny, wd * (.55 + .45 * t) * (.8 + rnd() * .5)]); x = nx; y = ny; a += (rnd() - .5) * .5 + (rnd() < .13 ? (rnd() < .5 ? -1 : 1) * (.7 + rnd() * .5) : 0); if (depth < 2 && rnd() < .1) walk(x, y, a + (rnd() < .5 ? -1 : 1) * (.6 + rnd() * .7), Math.floor(steps * (.4 + rnd() * .3)), wd * .6, depth + 1); if (x < -40 || y < -40 || x > w + 40 || y > h + 40) break; } };
    for (let i = 0; i < trunks; i++) { const edge = rnd() < .75; let x, y, a; if (edge) { const s = Math.floor(rnd() * 4); if (s === 0) { x = rnd() * w; y = -6; a = 1.57 + (rnd() - .5) * 1.2; } else if (s === 1) { x = w + 6; y = rnd() * h; a = 3.14 + (rnd() - .5) * 1.2; } else if (s === 2) { x = rnd() * w; y = h + 6; a = -1.57 + (rnd() - .5) * 1.2; } else { x = -6; y = rnd() * h; a = (rnd() - .5) * 1.2; } } else { x = rnd() * w; y = rnd() * h; a = rnd() * 6.28; } walk(x, y, a, 9 + Math.floor(rnd() * 12), (o.width || 5) * (.8 + rnd() * .6), 0); }
    g.lineCap = 'round'; g.lineJoin = 'round';
    const pass = (k, style) => { g.strokeStyle = style; segs.forEach(([x0, y0, x1, y1, wd]) => { g.lineWidth = Math.max(.8, wd * k); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }); };
    pass(8, 'rgba(255,90,20,.06)'); pass(4.6, 'rgba(255,100,24,.12)'); pass(2.5, 'rgba(6,2,3,.94)'); pass(1.35, '#c8301a'); pass(1.0, '#ff6a1c'); pass(.55, '#ffae45'); pass(.2, '#fff0b0');
    return c;
  }

  const rock = std('#8c8590', .08, .9, { map: basaltTex, emissive: '#0e0504', emissiveIntensity: 1 });
  const rockDark = std('#625c66', .08, .9, { map: basaltTex, emissive: '#0c0404', emissiveIntensity: 1 });
  const rockFlat = std('#8a838e', .08, .9, { map: basaltTex, flatShading: true, emissive: '#0e0504', emissiveIntensity: 1 }), rockFlat2 = std('#756f7a', .08, .9, { map: basaltTex, flatShading: true, emissive: '#0c0404', emissiveIntensity: 1 }), rockFlat3 = std('#9c95a2', .08, .88, { map: basaltTex, flatShading: true, emissive: '#100604', emissiveIntensity: 1 });
  const iron = std('#3b3639', .85, .42), ironDark = std('#242123', .8, .5), ironLight = std('#6d645f', .9, .32), wood = std('#3a2516', .05, .75), steel = std('#7c7f86', .9, .28);
  const lava = basic('#ff6a1c'), lavaHot = basic('#ffb14a'), lavaDeep = basic('#b42a12'), lavaDim = basic('#5a1a0c'), bulbOn = basic('#ffd27a');
  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const R = Math.min(r, w / 3, h / 3, d / 2.1), s = new THREE.Shape(), a = -w / 2 + R, b = -h / 2 + R, W = w - 2 * R, H = h - 2 * R; s.moveTo(a, b); s.lineTo(a + W, b); s.lineTo(a + W, b + H); s.lineTo(a, b + H); s.closePath(); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 1 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates core and lever).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); if (axis === 'hex') g.rotateY(Math.PI / 6); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine) { const m3 = new THREE.Mesh(cached(`s${r}`, () => new THREE.SphereGeometry(r, 10, 8)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function plane(c, w, h, x, y, z, parent = machine, transparent = false, ry = 0) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (!transparent) t.jpeg = .86; else t.webp = .8; const m = new THREE.MeshBasicMaterial({ map: t, transparent, alphaTest: transparent ? .02 : 0 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); if (ry) p.rotation.y = ry; parent.add(p); return p; }
  const rivet = (x, y, z, parent = machine, axis = 'z') => cyl(.02, .024, .018, x, y, z, ironLight, parent, 8, axis);

  /* ---------- hand-built rune strokes (no font): Elder Futhark in a unit box, y down ---------- */
  const RUNES = { f: [[[.3, 1], [.3, 0]], [[.3, .3], [.8, 0]], [[.3, .62], [.8, .32]]], u: [[[.2, 1], [.2, 0], [.75, .3], [.75, 1]]], th: [[[.3, 0], [.3, 1]], [[.3, .25], [.8, .5], [.3, .75]]], a: [[[.3, 0], [.3, 1]], [[.3, .1], [.8, .4]], [[.3, .4], [.8, .7]]], r: [[[.25, 0], [.25, 1]], [[.25, .05], [.75, .28], [.25, .55]], [[.25, .55], [.8, 1]]], k: [[[.7, .15], [.25, .5], [.7, .85]]], g: [[[.2, .1], [.8, .9]], [[.8, .1], [.2, .9]]], w: [[[.3, 0], [.3, 1]], [[.3, .05], [.75, .3], [.3, .55]]], h: [[[.25, 0], [.25, 1]], [[.75, 0], [.75, 1]], [[.25, .35], [.75, .65]]], n: [[[.5, 0], [.5, 1]], [[.2, .35], [.8, .65]]], i: [[[.5, 0], [.5, 1]]], s: [[[.7, 0], [.3, .35], [.7, .65], [.3, 1]]], t: [[[.5, 0], [.5, 1]], [[.2, .35], [.5, 0], [.8, .35]]], b: [[[.25, 0], [.25, 1]], [[.25, 0], [.7, .25], [.25, .5], [.7, .75], [.25, 1]]], m: [[[.2, 0], [.2, 1]], [[.8, 0], [.8, 1]], [[.2, 0], [.5, .4], [.8, 0]]], l: [[[.3, 0], [.3, 1]], [[.3, .1], [.75, .4]]], d: [[[.2, 0], [.2, 1]], [[.8, 0], [.8, 1]], [[.2, 0], [.8, 1]], [[.8, 0], [.2, 1]]], o: [[[.5, 0], [.2, .35], [.5, .7], [.8, .35], [.5, 0]], [[.2, 1], [.5, .7], [.8, 1]]] };
  const RUNE_KEYS = Object.keys(RUNES);
  function rune(g, key, cx, cy, h, style) { const w = h * .62, [x0, y0] = [cx - w / 2, cy - h / 2]; g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; for (const [lw, col] of style) { g.lineWidth = lw; g.strokeStyle = col; RUNES[key].forEach(p => { g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x0 + x * w, y0 + y * h) : g.moveTo(x0 + x * w, y0 + y * h)); g.stroke(); }); } g.restore(); }
  const glowRune = (g, key, cx, cy, h, lw) => rune(g, key, cx, cy, h, [[lw * 3.4, 'rgba(255,100,24,.22)'], [lw * 1.9, 'rgba(10,4,5,.9)'], [lw * 1.1, '#ff6a1c'], [lw * .5, '#ffc060']]);
  // Text that fits exactly maxW: shrinks the font if needed.
  function fit(g, s, x, y, maxW, size, color, weight = '800', font = SERIF) { g.font = `${weight} ${size}px ${font}`; const w = g.measureText(s).width; if (w > maxW) size = Math.floor(size * maxW / w); text(g, s, x, y, size, color, weight, font); return size; }
  // Engraved text: a dark offset for the cut, a glow, then the lit face.
  function engrave(g, s, x, y, size, color, glow = EMBER, weight = '800', font = SERIF, blur = 18) { g.save(); text(g, s, x + 2, y + 3, size, 'rgba(0,0,0,.9)', weight, font); g.shadowColor = glow; g.shadowBlur = blur; text(g, s, x, y, size, color, weight, font); g.shadowBlur = 0; text(g, s, x, y - 1, size, color, weight, font); g.restore(); }

  /* ---------- plinth: a basalt foot with a molten rim on the floor ---------- */
  box(2.68, .035, 1.48, 0, .0175, 0, lava, machine, 0);
  box(2.62, .2, 1.42, 0, .145, 0, rock, machine, .03); box(2.64, .03, 1.44, 0, .26, 0, ironDark, machine, 0);
  // A few broken basalt columns at the left foot, as if the machine grew out of the floor.
  for (const [x, z, h, r, m] of [[-1.38, .5, .46, .125, rockFlat2], [-1.33, .2, .66, .12, rockFlat], [-1.42, -.06, .34, .1, rockFlat3], [-1.35, -.32, .52, .105, rockFlat2]]) { cyl(r, r, h, x, h / 2, z, m, machine, 6, 'hex') }

  /* ---------- lower body: black basalt, basalt columns on the flanks with lava in the joints, iron corner bands ---------- */
  box(2.3, 1.62, 1.12, 0, 1.06, 0, rock, machine, .02);
  plane(crackCanvas(368, 260, 11, 7, { width: 4.4, scale: 1.4 }), 2.3, 1.62, 0, 1.06, .565, machine, true);
  plane(crackCanvas(368, 260, 33, 7, { width: 4.4, scale: 1.4 }), 2.3, 1.62, 0, 1.06, -.565, machine, true, Math.PI);
  // Flank: a row of hexagonal basalt columns with a slit of lava between them (the backing plane shows through the joints).
  const mats3 = [rockFlat, rockFlat2, rockFlat3];
  function columns(side, y0, y1, zc, n, r, step) { box(.012, y1 - y0, step * n, side * 1.152, (y0 + y1) / 2, zc, lavaHot, machine, 0); for (let i = 0; i < n; i++) { const z = zc + (i - (n - 1) / 2) * step, h = y1 - y0 - (rnd() < .3 ? .04 : 0); cyl(r, r, h, side * (1.12 + (i % 2 ? .012 : -.008)), y0 + h / 2, z, mats3[(i + (side > 0 ? 1 : 0)) % 3], machine, 6, 'hex'); } }
  columns(-1, .27, 1.84, 0, 5, .108, .222); columns(1, .27, 1.84, 0, 5, .108, .222);
  // Corner seams: a rod of lava sits in each vertical corner and iron bands wrap round it, so the lava shows between the bands.
  function cornerBands(cx, cz, y0, y1, bandYs, parent = machine, slab = .13) {
    const sx = Math.sign(cx), sz = Math.sign(cz), pts = [y0]; bandYs.forEach(y => pts.push(y - .06, y + .06)); pts.push(y1);
    for (let i = 0; i < pts.length; i += 2) { const lo = pts[i], hi = pts[i + 1]; if (hi - lo > .02) box(.04, hi - lo, .04, cx - sx * .005, (lo + hi) / 2, cz - sz * .005, (i / 2) % 3 === 1 ? lavaHot : lava, parent, 0); }
    const outer = cx + sx * (slab - .025);
    for (const y of bandYs) {
      box(.2, .12, .05, cx - sx * .075, y, cz + sz * .02, iron, parent, .008); box(slab, .12, .2, cx + sx * (slab / 2 - .025), y, cz - sz * .075, iron, parent, .008);
      rivet(cx - sx * .13, y, cz + sz * .047, parent); rivet(cx - sx * .04, y, cz + sz * .047, parent); rivet(outer + sx * .005, y, cz - sz * .13, parent, 'x'); rivet(outer + sx * .005, y, cz - sz * .04, parent, 'x');
    }
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { cornerBands(sx * 1.15, sz * .56, .27, 1.84, [.4, .8, 1.2, 1.6, 1.78]); }
  for (const sx of [-1, 1]) for (const y of [.3, 1.84]) box(.07, .08, 1.14, sx * 1.205, y, 0, iron, machine, .008);
  // Horizontal iron rails top and bottom of the front, with a thin lava line under the top rail and over the bottom one.
  box(2.34, .08, .06, 0, 1.84, .575, iron, machine, .008); box(2.34, .08, .06, 0, .3, .575, iron, machine, .008);
  box(2.1, .014, .02, 0, 1.78, .578, lava, machine, 0); box(2.1, .014, .02, 0, .36, .578, lava, machine, 0);
  for (let i = 0; i < 9; i++) { rivet(-1.0 + i * .25, 1.84, .608); rivet(-1.0 + i * .25, .3, .608); }
  // Lower door: a stone plate, iron frame, "RUNES · SINCE BLOCK 840,000" and the Xtrata mark (drawn with the XLOGO vector code, no image).
  const door = canvas(1100, 640), dg = door.getContext('2d');
  dg.drawImage(basaltCanvas(512), 0, 0, 1100, 640); dg.fillStyle = 'rgba(20,10,10,.45)'; dg.fillRect(0, 0, 1100, 640);
  { const v = dg.createRadialGradient(550, 300, 150, 550, 320, 700); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.65)'); dg.fillStyle = v; dg.fillRect(0, 0, 1100, 640); }
  { const cr = crackCanvas(1100, 640, 77, 4, { scale: 1.7, width: 5 }); dg.globalAlpha = .9; dg.drawImage(cr, 0, 0); dg.globalAlpha = 1; }
  rr(dg, 26, 26, 1048, 588, 14, null, '#0c0708', 14); rr(dg, 36, 36, 1028, 568, 10, null, 'rgba(255,138,61,.55)', 3); rr(dg, 62, 62, 976, 516, 8, null, 'rgba(0,0,0,.8)', 5); rr(dg, 66, 66, 968, 508, 6, null, 'rgba(255,138,61,.25)', 2);
  for (let i = 0; i < 6; i++) { glowRune(dg, RUNE_KEYS[i * 3 % 18], 130 + i * 168, 112, 44, 4.2); }
  dg.save(); dg.shadowColor = '#000'; dg.shadowBlur = 24; xtrataLogo(dg, 550, 262, 250); dg.restore();
  { const s = 'RUNES  ·  SINCE BLOCK 840,000'; dg.font = `800 76px ${SERIF}`; const sz = Math.min(76, Math.floor(76 * 900 / dg.measureText(s).width)); engrave(dg, s, 550, 458, sz, '#ffc680', EMBER, '800', SERIF, 22); }
  spaced(dg, 'ETCHED ON BITCOIN  ·  APRIL 2024  ·  PARALLAX CASINO', 550, 538, 22, 5, '#a8704a');
  plane(door, 1.72, .96, 0, .93, .572);
  box(1.86, .07, .05, 0, 1.43, .585, iron, machine, .008); box(1.86, .07, .05, 0, .43, .585, iron, machine, .008); box(.07, 1.07, .05, -.895, .93, .585, iron, machine, .008); box(.07, 1.07, .05, .895, .93, .585, iron, machine, .008);
  for (const [x, y] of [[-.895, 1.43], [.895, 1.43], [-.895, .43], [.895, .43]]) { rivet(x, y, .615); }
  for (const y of [1.2, .66]) { box(.1, .11, .04, -.98, y, .59, iron, machine, .008); rivet(-.98, y, .612); }
  // Souvenir ticket slot: an iron housing with a glowing lip and its label.
  box(.62, .1, .06, -.62, 1.66, .59, iron, machine, .01); box(.48, .026, .02, -.62, 1.66, .625, basic('#080304'), machine, 0); box(.48, .008, .02, -.62, 1.646, .626, lava, machine, 0);
  const tk = canvas(256, 64), tg = tk.getContext('2d'); tg.fillStyle = '#17100f'; tg.fillRect(0, 0, 256, 64); rr(tg, 3, 3, 250, 58, 6, null, 'rgba(255,138,61,.5)', 2); spaced(tg, 'TICKET', 128, 33, 30, 8, EMBER); plane(tk, .3, .075, -.62, 1.575, .567);

  /* ---------- deck: a stone slab with the buttons ---------- */
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, rockDark, deck, .02); box(2.26, .5, .02, 0, 0, .09, std('#160f10', .2, .7), deck, 0);
  box(2.34, .045, .17, 0, .29, 0, iron, deck, 0); box(2.34, .045, .17, 0, -.29, 0, iron, deck, 0);
  box(2.2, .01, .02, 0, .262, .092, lava, deck, 0); box(2.2, .01, .02, 0, -.262, .092, lava, deck, 0);
  function label(t, w, h, size, ink, bg, edge) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); if (edge) { rr(g, 8, 8, w - 16, h - 16, 14, null, edge, 6); } g.save(); g.shadowColor = ink; g.shadowBlur = 14; text(g, t, w / 2, h / 2 + 3, size, ink, '900', SANS); g.restore(); text(g, t, w / 2, h / 2 + 3, size, ink, '900', SANS); return c; }
  function button(title, x, w, action) {
    const base = box(w, .22, .07, x, -.02, .13, iron, deck, .025), top = box(w - .03, .2, .065, x, -.02, .18, std('#2a1612', .25, .5), deck, .025);
    const face = plane(label(title, 400, 160, title.length > 6 ? 46 : 58, EMBER, '#2a1410', 'rgba(255,138,61,.6)'), w - .06, .17, x, -.02, .216, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('LEDGER', -.86, .34, 'pays'); button('−SATS', -.48, .32, 'betDown'); button('+SATS', -.13, .32, 'betUp'); button('AUTO-MINT', .24, .36, 'auto');
  { const cap = canvas(1024, 64), cg = cap.getContext('2d'); const items = [['PAYS', -.86], ['BET −', -.48], ['BET +', -.13], ['AUTO', .24], ['SPIN', .8]]; items.forEach(([t, x]) => spaced(cg, t, 512 + x * (1024 / 2.2), 32, 26, 5, '#b4724a')); plane(cap, 2.2, .1, 0, -.2, .102, deck, true); }
  // ETCH: the big round spin button. Its cap is spinPhysical; the casino presses it in along z.
  const ring = cyl(.25, .25, .07, .8, -.02, .13, iron, deck, 36, 'z'); ring.userData.action = 'spin';
  const rim = cyl(.222, .222, .075, .8, -.02, .135, lava, deck, 36, 'z'); rim.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .8, -.02, .19, std(ACC, .3, .35), deck, 36, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  const capFace = canvas(256, 256), cf = capFace.getContext('2d'); { const gr = cf.createRadialGradient(128, 118, 8, 128, 128, 126); gr.addColorStop(0, '#ffc060'); gr.addColorStop(.55, '#ff6a1c'); gr.addColorStop(1, '#c0361a'); cf.fillStyle = gr; cf.beginPath(); cf.arc(128, 128, 126, 0, 7); cf.fill(); cf.lineWidth = 8; cf.strokeStyle = 'rgba(40,10,6,.55)'; cf.beginPath(); cf.arc(128, 128, 116, 0, 7); cf.stroke(); }
  text(cf, 'ETCH', 128, 134, 62, '#2a0a05', '900', SANS);
  const capLabel = plane(capFace, .4, .4, 0, 0, .036, cap, true); capLabel.userData.action = 'spin';

  /* ---------- upper body: the screen housing and the carved stone tablet ---------- */
  box(2.3, 2.16, 1.0, 0, 2.95, -.05, rock, machine, .02);
  plane(crackCanvas(368, 346, 41, 8, { width: 4.4, scale: 1.4 }), 2.3, 2.16, 0, 2.95, -.555, machine, true, Math.PI);
  columns(-1, 1.9, 4.02, -.05, 5, .105, .2); columns(1, 1.9, 4.02, -.05, 5, .105, .2);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cornerBands(sx * 1.15, sz > 0 ? .45 : -.55, 1.88, 4.02, [2.02, 2.46, 2.9, 3.34, 3.78, 3.96]);
  for (const sx of [-1, 1]) for (const y of [1.93, 3.99]) box(.07, .08, 1.04, sx * 1.205, y, -.05, iron, machine, .008);
  // The tablet: stepped slabs round the screen, a carved rune border, a glowing inner edge and iron corner clamps.
  box(2.26, 1.72, .06, 0, 2.95, .465, rock, machine, .02); box(2.12, 1.5, .05, 0, 2.95, .49, rockDark, machine, .015); box(2.02, 1.4, .03, 0, 2.95, .505, basic('#050203'), machine, 0);
  { const tb = canvas(678, 516), g = tb.getContext('2d'); g.lineCap = 'round';
    rr(g, 6, 6, 666, 504, 8, null, 'rgba(0,0,0,.85)', 5); rr(g, 12, 12, 654, 492, 6, null, 'rgba(255,138,61,.4)', 1.6);
    for (let i = 0; i < 18; i++) { glowRune(g, RUNE_KEYS[(i * 5 + 2) % RUNE_KEYS.length], 70 + i * 32.5, 17, 18, 2.2); glowRune(g, RUNE_KEYS[(i * 7 + 4) % RUNE_KEYS.length], 70 + i * 32.5, 499, 18, 2.2); }
    plane(tb, 2.26, 1.72, 0, 2.95, .4975, machine, true); }
  { const t2 = canvas(636, 450), g = t2.getContext('2d'); rr(g, 8, 8, 620, 434, 5, null, 'rgba(0,0,0,.9)', 6); g.save(); g.shadowColor = '#ff6a1c'; g.shadowBlur = 12; rr(g, 20, 20, 596, 410, 3, null, '#ff7a2a', 3.6); g.restore(); rr(g, 20, 20, 596, 410, 3, null, '#ffc060', 1.2);
    plane(t2, 2.12, 1.5, 0, 2.95, .5165, machine, true); }
  for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { box(.28, .26, .03, sx * 1.02, 2.95 + sy * .74, .5, iron, machine, .01); box(.11, .1, .02, sx * 1.02, 2.95 + sy * .74, .52, ironDark, machine, .008); rivet(sx * 1.1, 2.95 + sy * .82, .52); rivet(sx * .94, 2.95 + sy * .66, .52); }
  const shot = (opts && opts.screenImage) || (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 700, 480, ['#1d1214', '#100a0b', '#1a0e0d']); g.fillRect(0, 0, 700, 480); g.shadowColor = ACC; g.shadowBlur = 24; text(g, 'RUNE PIT', 350, 210, 82, '#ff9a4a', '900', SERIF); g.shadowBlur = 0; spaced(g, 'BITCOIN RUNES  ·  VOLCANIC FORGE REELS', 350, 282, 17, 4, '#c98a60'); spaced(g, 'PULL THE HAMMER', 350, 336, 14, 5, '#8a5a40'); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .5215); screenMesh.userData.role = 'screenMesh';

  /* ---------- marquee: RUNE PIT in molten letters, then the block plate ---------- */
  box(2.5, .74, 1.08, 0, 4.42, -.05, rock, machine, .02); box(2.54, .06, 1.12, 0, 4.07, -.05, iron, machine, .008); box(2.54, .06, 1.12, 0, 4.77, -.05, iron, machine, .008);
  for (const s of [-1, 1]) { plane(crackCanvas(240, 163, 61 + s, 4, { scale: .9, width: 3.4 }), 1.08, .74, s * 1.255, 4.42, -.05, machine, true, s * Math.PI / 2); }
  plane(crackCanvas(550, 163, 67, 5, { scale: .9, width: 3.4 }), 2.5, .74, 0, 4.42, -.595, machine, true, Math.PI);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cornerBands(sx * 1.25, sz > 0 ? .49 : -.59, 4.06, 4.78, [4.14, 4.7], machine, .05);
  const mq = canvas(1400, 360), mg = mq.getContext('2d'); mg.drawImage(basaltCanvas(512), 0, 0, 1400, 360); mg.fillStyle = 'rgba(8,3,4,.72)'; mg.fillRect(0, 0, 1400, 360);
  { const cr = crackCanvas(1400, 360, 83, 6, { scale: 1.6, width: 4 }); mg.globalAlpha = .55; mg.drawImage(cr, 0, 0); mg.globalAlpha = 1; }
  { const v = mg.createRadialGradient(700, 170, 40, 700, 180, 700); v.addColorStop(0, 'rgba(255,90,20,.22)'); v.addColorStop(1, 'rgba(0,0,0,.4)'); mg.fillStyle = v; mg.fillRect(0, 0, 1400, 360); }
  { const letters = [...'RUNE PIT'], size = 196; mg.font = `900 ${size}px ${SERIF}`; mg.textBaseline = 'middle'; mg.textAlign = 'left'; const gap = 14, ws = letters.map(ch => mg.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (letters.length - 1); let cx = 700 - total / 2; const cy = 176;
    const molten = lin(mg, 0, cy - 100, 0, cy + 100, ['#fff4b8', '#ffc060', '#ff7a2a', '#d64545']);
    mg.save(); mg.lineJoin = 'round'; letters.forEach((ch, i) => { mg.shadowColor = 'rgba(255,90,20,.95)'; mg.shadowBlur = 48; mg.fillStyle = '#ff6a1c'; mg.fillText(ch, cx, cy); cx += ws[i] + gap; }); cx = 700 - total / 2; letters.forEach((ch, i) => { mg.shadowBlur = 0; mg.lineWidth = 12; mg.strokeStyle = '#1a0605'; mg.strokeText(ch, cx, cy); mg.fillStyle = molten; mg.fillText(ch, cx, cy); mg.lineWidth = 2.5; mg.strokeStyle = 'rgba(255,240,180,.85)'; mg.strokeText(ch, cx, cy - 1); cx += ws[i] + gap; }); mg.restore(); }
  spaced(mg, 'BITCOIN RUNES  ·  FROM BLOCK 840,000', 700, 304, 27, 9, '#e0925a'); spaced(mg, 'PARALLAX CASINO', 1290, 336, 15, 4, '#9a6b4c');
  plane(mq, 2.3, .59, 0, 4.43, .495);
  for (let i = 0; i < 26; i++) { const t = i / 25; sphere(.024, -1.18 + t * 2.36, 4.745, .5, i % 2 ? bulbOn : lava); sphere(.024, -1.18 + t * 2.36, 4.115, .5, i % 2 ? lava : bulbOn); }
  for (let i = 1; i < 7; i++) { sphere(.024, -1.2, 4.115 + i * .09, .5, i % 2 ? lava : bulbOn); sphere(.024, 1.2, 4.115 + i * .09, .5, i % 2 ? bulbOn : lava); }
  // Block plate under the screen: a six-slot counter reading 840000.
  const tick = canvas(1024, 160), kg = tick.getContext('2d'); kg.fillStyle = lin(kg, 0, 0, 0, 160, ['#4a4346', '#2a2527', '#3a3436']); kg.fillRect(0, 0, 1024, 160); rr(kg, 8, 8, 1008, 144, 18, null, '#0c0708', 8); rr(kg, 16, 16, 992, 128, 12, null, 'rgba(255,138,61,.4)', 2);
  spaced(kg, 'GENESIS BLOCK', 250, 82, 44, 7, '#ffb070', '900');
  [...'840000'].forEach((ch, i) => { const x = 500 + i * 80; rr(kg, x, 24, 66, 112, 10, '#0b0506', 'rgba(255,138,61,.55)', 3); kg.save(); kg.shadowColor = '#ff6a1c'; kg.shadowBlur = 16; text(kg, ch, x + 33, 82, 84, i < 2 ? '#ffd88a' : '#ff8a3d', '900', SANS); kg.restore(); });
  spaced(kg, 'APR 2024', 950, 138, 16, 4, '#a8704a', '700', SANS);
  box(1.42, .2, .05, 0, 3.92, .475, iron, machine, .02); plane(tick, 1.36, .17, 0, 3.92, .502);

  /* ---------- topper (core): a turning ring of dark stone, first rune names carved round it, lit from inside ---------- */
  const RING_R = .68, RING_H = .7, RING_Y = 5.5;
  cyl(.27, .36, .4, 0, 4.98, -.05, rockFlat, machine, 6); cyl(.3, .3, .05, 0, 5.18, -.05, iron, machine, 6); box(.32, .06, .02, 0, 4.99, .3, lava, machine, 0);
  const core = new THREE.Group(); core.position.set(0, RING_Y, -.05); core.userData.role = 'core'; machine.add(core);
  const rowA = ['UNCOMMON•GOODS', 'DECENTRALIZED', 'MEME•ECONOMICS', 'DOG•GO•TO•THE•MOON'], rowB = ['Z•Z•Z•Z•Z•FEHU•Z•Z•Z•Z•Z', 'RSIC•GENESIS•RUNE', 'SATOSHI•NAKAMOTO'];
  const RW = 2048, RH = 336, rowsY = [104, 232], tsize = 92;
  function ringRows(g, mode) {
    rowsY.forEach((cy, ri) => {
      const items = ri ? rowB : rowA; g.font = `800 ${tsize}px ${SERIF}`; const nat = items.map(s => g.measureText(s).width), sepW = 78, avail = RW - sepW * items.length, sx = avail / nat.reduce((a, b) => a + b, 0); let x = sepW / 2;
      items.forEach((s, i) => {
        g.save(); g.translate(x, cy); g.scale(sx, 1); g.font = `800 ${tsize}px ${SERIF}`; g.textBaseline = 'middle'; g.textAlign = 'left';
        if (mode === 'cutX') { g.fillStyle = 'rgba(0,0,0,.95)'; g.shadowColor = '#000'; g.shadowBlur = 6; g.fillText(s, 2, 3); g.shadowBlur = 0; g.lineWidth = 7; g.strokeStyle = 'rgba(0,0,0,.9)'; g.strokeText(s, 0, 0); }
        else { g.lineJoin = 'round'; g.lineWidth = 9; g.strokeStyle = 'rgba(5,2,3,.88)'; g.strokeText(s, 0, 0); g.shadowColor = 'rgba(255,100,24,.9)'; g.shadowBlur = 20; g.fillStyle = '#ff6a1c'; g.fillText(s, 0, 0); g.shadowBlur = 0; g.fillStyle = lin(g, 0, -46, 0, 46, ['#fff0a8', '#ffb050', '#ff7a2a']); g.fillText(s, 0, 0); }
        g.restore(); x += nat[i] * sx + sepW;
        glowRune(g, RUNE_KEYS[(ri * 5 + i * 3) % RUNE_KEYS.length], x - sepW / 2, cy, 54, 4.6);
      });
    });
  }
  const ringGlow = canvas(RW, RH), rg1 = ringGlow.getContext('2d'); ringRows(rg1, 'glow');
  const glowTex = new THREE.CanvasTexture(ringGlow); glowTex.colorSpace = THREE.SRGBColorSpace; glowTex.webp = .85;
  const ringMat = std('#9a929e', .1, .88, { map: basaltTex, emissive: '#160804', emissiveIntensity: 1 });
  const wallGeo = new THREE.CylinderGeometry(RING_R, RING_R, RING_H, 96, 1, true); { const uv = wallGeo.getAttribute('uv'); for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 6.4, uv.getY(i) * RING_H); } const wall = new THREE.Mesh(wallGeo, ringMat); core.add(wall);
  const carved = new THREE.Mesh(new THREE.CylinderGeometry(RING_R + .005, RING_R + .005, RING_H, 96, 1, true), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, alphaTest: .02 })); core.add(carved);
  const inner = canvas(8, 128), ig = inner.getContext('2d'); ig.fillStyle = lin(ig, 0, 0, 0, 128, ['#ffd27a', '#ff8a3d', '#d8401a', '#7a1c0c']); ig.fillRect(0, 0, 8, 128);
  const innerTex = new THREE.CanvasTexture(inner); innerTex.colorSpace = THREE.SRGBColorSpace;
  const innerWall = new THREE.Mesh(new THREE.CylinderGeometry(RING_R - .1, RING_R - .1, RING_H - .04, 64, 1, true), new THREE.MeshBasicMaterial({ map: innerTex, side: 1 })); core.add(innerWall);
  { const col = cyl(.07, .1, RING_H - .1, 0, 0, 0, lavaHot, core, 16); cyl(.17, .17, RING_H - .16, 0, 0, 0, lava, core, 16); }
  for (const sy of [-1, 1]) {
    const shape = new THREE.Shape(); shape.absarc(0, 0, RING_R + .035, 0, Math.PI * 2, false); const hole = new THREE.Shape(); hole.absarc(0, 0, RING_R - .14, 0, Math.PI * 2, true); shape.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(shape, { depth: .06, bevelEnabled: false, curveSegments: 48 }); g.rotateX(-Math.PI / 2);
    const rimMesh = new THREE.Mesh(g, iron); rimMesh.position.set(0, sy * (RING_H / 2) - (sy > 0 ? 0 : .06) + (sy > 0 ? .0 : 0), 0); core.add(rimMesh);
    const lip = new THREE.Mesh(cached(`tor${sy}`, () => new THREE.TorusGeometry(RING_R - .14, .012, 6, 64).rotateX(Math.PI / 2)), lava); lip.position.set(0, sy > 0 ? RING_H / 2 + .06 : -RING_H / 2 - .06, 0); core.add(lip);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const st = cyl(.022, .026, .02, Math.sin(a) * (RING_R + .036), sy * (RING_H / 2) + (sy > 0 ? .03 : -.03), Math.cos(a) * (RING_R + .036), ironLight, core, 8); }
  }

  /* ---------- lever: an iron forge hammer on a pivot, striking an anvil on a basalt block ---------- */
  const PIV = { x: 1.34, y: 1.3, z: -.1 }, L = .82, HALF = .24, REST = .28, PULL = 1.02;
  box(.09, .54, .36, 1.2, PIV.y, PIV.z, iron, machine, .015); box(.05, .62, .06, 1.2, PIV.y, PIV.z - .22, iron, machine, .01);
  cyl(.1, .1, .14, 1.29, PIV.y, PIV.z, ironDark, machine, 6, 'x'); cyl(.045, .045, .34, 1.35, PIV.y, PIV.z, steel, machine, 16, 'x'); cyl(.075, .075, .03, 1.5, PIV.y, PIV.z, ironLight, machine, 6, 'x');
  const lever = new THREE.Group(); lever.position.set(PIV.x, PIV.y, PIV.z); lever.rotation.x = REST; lever.userData.role = 'lever'; machine.add(lever);
  const shaft = cyl(.032, .042, L + .12, 0, (L - .12) / 2, 0, wood, lever, 14);
  const head = box(.27, .25, HALF * 2, 0, L, 0, ironDark, lever, .02);
  const faceHot = box(.17, .14, .012, 0, L, HALF + .005, basic('#d8421a'), lever, 0), faceHot2 = box(.1, .1, .012, 0, L, -HALF - .085, lavaDeep, lever, 0);
  const peen = cyl(.045, .095, .17, 0, L, -HALF - .045, ironDark, lever, 8, 'z');
  const bandA = box(.3, .29, .05, 0, L, .12, iron, lever, .01), bandB = box(.3, .29, .05, 0, L, -.12, iron, lever, .01);
  const collar = cyl(.065, .065, .1, 0, L - .19, 0, iron, lever, 14), pommel = sphere(.062, 0, -.14, 0, iron, lever), grip = cyl(.05, .05, .24, 0, .2, 0, std('#1c1210', .05, .8), lever, 14);
  for (const y of [.12, .2, .28]) cyl(.053, .053, .02, 0, y, 0, ironLight, lever, 14);
  [shaft, head, faceHot, faceHot2, peen, bandA, bandB, collar, pommel, grip].forEach(m => { m.userData.action = 'spin'; });
  // Where the hammer face meets the anvil at the end of the pull (REST + PULL): the anvil's strike point.
  const th = REST + PULL, strike = { y: PIV.y + L * Math.cos(th) - (HALF + .012) * Math.sin(th), z: PIV.z + L * Math.sin(th) + (HALF + .012) * Math.cos(th) };
  // The anvil: one mesh, a side profile extruded across its width; its origin is the centre of the face (the strike point).
  const prof = [[-.3, 0], [.2, 0], [.34, -.025], [.52, -.07], [.55, -.1], [.34, -.125], [.18, -.145], [.14, -.2], [.14, -.3], [.24, -.34], [.24, -.4], [-.26, -.4], [-.26, -.34], [-.16, -.3], [-.16, -.2], [-.2, -.145], [-.3, -.12]];
  const ash = new THREE.Shape(); prof.forEach(([u, v], i) => i ? ash.lineTo(u, v) : ash.moveTo(u, v)); ash.closePath();
  const ag = new THREE.ExtrudeGeometry(ash, { depth: .3, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 1, curveSegments: 1 }); ag.translate(0, 0, -.15); ag.rotateY(-Math.PI / 2);
  const anvil = new THREE.Mesh(ag, std('#4a4649', .9, .35)); anvil.position.set(PIV.x, strike.y - .004, strike.z); anvil.userData.role = 'anvil'; machine.add(anvil);
  const sparkAnchor = new THREE.Group(); sparkAnchor.position.set(0, .012, 0); sparkAnchor.userData.role = 'sparkAnchor'; anvil.add(sparkAnchor);
  const hot = box(.2, .006, .3, 0, .002, 0, basic('#7a2a12'), anvil, 0); // a faint heat patch on the face where the hammer lands
  { const stumpTop = strike.y - .004 - .4, sy0 = stumpTop / 2; cyl(.215, .235, stumpTop, PIV.x, sy0, strike.z - .03, rockFlat3, machine, 6, 'hex'); box(.5, .05, .5, PIV.x, stumpTop - .025, strike.z - .03, iron, machine, .01); box(.48, .05, .48, PIV.x, .06, strike.z - .03, iron, machine, .01); }

  /* ---------- rear ---------- */
  const rear = canvas(1024, 160), rg = rear.getContext('2d'); rg.fillStyle = '#17100f'; rg.fillRect(0, 0, 1024, 160); rr(rg, 6, 6, 1012, 148, 12, null, 'rgba(255,138,61,.4)', 3); spaced(rg, 'RUNE PIT  /  RP-001  /  SINCE BLOCK 840,000', 512, 82, 28, 6, '#c08a64');
  const back = plane(rear, 1.9, .3, 0, 3.4, -.57); back.rotation.y = Math.PI;
  return exportPacked(machine);
};

// Export in the same format as the existing packs: shared geometry/material/texture tables and a node tree.
function exportPacked(root) {
  const geometries = [], materials = [], textures = [], gi = new Map(), mi = new Map(), ti = new Map();
  const rp = (v, k) => Math.round(v * k) / k;
  const texIndex = t => { if (!t) return null; if (ti.has(t)) return ti.get(t); const img = t.image; const url = img.toDataURL ? (t.jpeg ? img.toDataURL('image/jpeg', t.jpeg) : t.webp ? img.toDataURL('image/webp', t.webp) : img.toDataURL('image/png')) : null; if (!/^data:image\/(jpeg|webp|png)/.test(url)) throw Error('texture encode failed'); textures.push({ image: url, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); ti.set(t, textures.length - 1); return textures.length - 1; };
  const matIndex = m => { if (mi.has(m)) return mi.get(m); const basic = m.isMeshBasicMaterial; materials.push({ type: basic ? 'basic' : 'standard', color: m.color.getHex(), roughness: basic ? .4 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texIndex(m.map), emissive: m.emissive ? m.emissive.getHex() : 0, emissiveIntensity: m.emissiveIntensity ?? 1 }); mi.set(m, materials.length - 1); return materials.length - 1; };
  const geoIndex = g => { if (gi.has(g)) return gi.get(g); const attributes = {}; for (const k of ['position', 'normal', 'uv']) { const a = g.getAttribute(k); if (a) attributes[k] = { size: a.itemSize, array: Array.from(a.array, v => rp(v, k === 'position' ? 1e4 : 1e3)) }; } geometries.push({ attributes, index: g.index ? Array.from(g.index.array) : null, groups: g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex ?? 0 })) }); gi.set(g, geometries.length - 1); return geometries.length - 1; };
  const node = o => { const n = { p: o.position.toArray().map(v => rp(v, 1e5)), q: o.quaternion.toArray().map(v => rp(v, 1e5)), s: o.scale.toArray().map(v => rp(v, 1e5)), visible: o.visible, role: o.userData.role || '', children: [] }; if (o.userData.action) n.action = o.userData.action; if (o.isMesh) { n.g = geoIndex(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(matIndex) : matIndex(o.material); } n.children = o.children.map(node); return n; };
  root.updateMatrixWorld(true);
  const out = { root: node(root), geometries, materials, textures };
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9], v = new THREE.Vector3();
  root.traverse(o => { if (!o.isMesh) return; const a = o.geometry.getAttribute('position'); for (let i = 0; i < a.count; i++) { v.fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld); const p = [v.x, v.y, v.z]; for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); } } });
  return { json: JSON.stringify(out), stats: { geometries: geometries.length, materials: materials.length, textures: textures.length, size: hi.map((h, k) => +(h - lo[k]).toFixed(3)), min: lo.map(x => +x.toFixed(3)), max: hi.map(x => +x.toFixed(3)), texKB: textures.map(t => Math.round(t.image.length / 1024)) } };
}
