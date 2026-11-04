/* Xtrata Originals cabinet, built with THREE and exported in the casino's packed-model format
   ({root, geometries, materials, textures}). Run by build-cabinet.mjs in a headless browser.
   Look: matte black with fine blue and orange edge lines like the strokes of the Xtrata mark, real inscription numbers
   etched along the sides, two rows of framed Audionauts on each flank, a thin black bezel with layered glass steps,
   a turning topper of three stacked light bands (white, blue, orange) drawn from the brand mark, a matte black arm
   with an orange knob, and a lower door reading XTRATA ORIGINALS · BORN ON CHAIN with the Xtrata mark (XLOGO vector code). */
window.buildCabinet = async function buildCabinet(opts) {
  const BLUE = '#4675b6', BLUE2 = '#6593cf', OR = '#e28c3b', OR2 = '#f2aa5a', WHITE = '#e2e3e1';
  const loadImg = src => new Promise(res => { if (!src) return res(null); const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const IDS = (opts && opts.ids) || [0, 14, 172, 3060, 3074, 3082], PORTRAITS = (await Promise.all(((opts && opts.portraits) || []).map(loadImg))).filter(Boolean), WORDMARK = await loadImg(opts && opts.wordmark);
  const machine = new THREE.Group(); machine.name = 'Xtrata Originals';
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const text = (g, s, x, y, size, color, weight = '800', font = 'Arial', align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '700', font = 'Arial') => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const matte = std('#121418', .15, .92), matteDeep = std('#0a0b0e', .2, .88), satin = std('#1b1e24', .4, .55), rubber = std('#060708', .05, .85), steel = std('#8f96a0', .85, .32);
  const blueLine = new THREE.MeshBasicMaterial({ color: BLUE2 }), orLine = new THREE.MeshBasicMaterial({ color: OR }), whiteLine = new THREE.MeshBasicMaterial({ color: WHITE });
  const knob = std(OR, .25, .38), knobRing = std('#c9762c', .6, .3);
  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const s = new THREE.Shape(), a = -w / 2, b = -h / 2, R = Math.min(r, w / 3, h / 3, d / 2.1); s.moveTo(a + R, b); s.lineTo(a + w - R, b); s.quadraticCurveTo(a + w, b, a + w, b + R); s.lineTo(a + w, b + h - R); s.quadraticCurveTo(a + w, b + h, a + w - R, b + h); s.lineTo(a + R, b + h); s.quadraticCurveTo(a, b + h, a, b + h - R); s.lineTo(a, b + R); s.quadraticCurveTo(a, b, a + R, b); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 4 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates crest and lever).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine) { const m3 = new THREE.Mesh(cached(`s${r}`, () => new THREE.SphereGeometry(r, 20, 14)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  const texCache = new Map();
  function plane(c, w, h, x, y, z, parent = machine, transparent = false, ry = 0) { const t = texCache.get(c) || new THREE.CanvasTexture(c); texCache.set(c, t); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.MeshBasicMaterial({ map: t, transparent, alphaTest: transparent ? .02 : 0, side: transparent ? THREE.DoubleSide : THREE.FrontSide }); const geo = new THREE.PlaneGeometry(w, h); if (ry) geo.rotateY(ry); const p = new THREE.Mesh(geo, m); p.position.set(x, y, z); parent.add(p); return p; }
  // Fine edge lines like the logo's strokes: blue on the verticals, orange on the horizontals, white at the very top.
  const edge = (w, h, d, x, y, z, m) => { const e = box(w, h, d, x, y, z, m, machine, 0); e.userData.role = 'edgeGlow'; return e; };

  // Plinth and lower body.
  box(2.62, .22, 1.42, 0, .11, 0, matteDeep); edge(2.64, .018, .018, 0, .225, .715, orLine);
  box(2.3, 1.62, 1.12, 0, 1.06, 0, matte);
  for (const sx of [-1, 1]) { edge(.016, 1.6, .016, sx * 1.152, 1.06, .562, blueLine); edge(.016, 1.6, .016, sx * 1.152, 1.06, -.562, blueLine); }
  edge(2.3, .016, .016, 0, 1.865, .562, orLine); edge(2.3, .016, .016, 0, .262, .562, orLine);
  // Lower door: XTRATA ORIGINALS · BORN ON CHAIN, with the Xtrata mark drawn by the XLOGO vector code (no image).
  const door = canvas(1100, 640), dg = door.getContext('2d');
  dg.fillStyle = lin(dg, 0, 0, 0, 640, ['#15181d', '#0c0e11']); dg.fillRect(0, 0, 1100, 640);
  for (let k = 0; k < 6; k++) { dg.fillStyle = [BLUE, OR, WHITE][k % 3] + '1c'; dg.fillRect(0, 540 + k * 14, 1100, 3); }
  rr(dg, 24, 24, 1052, 592, 22, null, BLUE + 'aa', 4); rr(dg, 40, 40, 1020, 560, 16, null, OR + '66', 2);
  xtrataLogo(dg, 550, 225, 300);
  spaced(dg, 'XTRATA ORIGINALS', 550, 428, 64, 10, WHITE, '900'); spaced(dg, 'BORN ON CHAIN', 550, 498, 30, 16, OR2, '800');
  plane(door, 1.72, 1.0, 0, 1.0, .566);
  // Souvenir ticket slot, labelled with the ParallaX Casino wordmark (small, as the bible allows).
  box(.62, .1, .06, -.62, 1.66, .59, satin, machine, .01); box(.48, .022, .02, -.62, 1.66, .625, rubber, machine, 0);
  const tk = canvas(512, 96), tg = tk.getContext('2d'); tg.fillStyle = '#0c0e11'; tg.fillRect(0, 0, 512, 96); if (WORDMARK) { const k = 70 / WORDMARK.naturalHeight; tg.drawImage(WORDMARK, 18, 13, WORDMARK.naturalWidth * k, 70); } spaced(tg, 'TICKET', 430, 50, 26, 5, OR2); plane(tk, .44, .083, -.62, 1.555, .567);
  // Deck with the buttons: GALLERY, −LAYR, +LAYR, AUTO-LAYER, and the big round INSCRIBE.
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, matteDeep, deck); box(2.26, .5, .02, 0, 0, .09, rubber, deck, 0);
  const dl1 = box(2.32, .014, .17, 0, .285, 0, orLine, deck, 0), dl2 = box(2.32, .014, .17, 0, -.285, 0, blueLine, deck, 0); dl1.userData.role = dl2.userData.role = 'edgeGlow';
  function label(t, sub, w, h, size, ink, bg) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); text(g, t, w / 2, h / 2 - 12, size, ink, '900'); text(g, sub, w / 2, h / 2 + 34, 22, ink + 'aa', '700'); return c; }
  function button(title, sub, x, w, color, ink, action) {
    const base = box(w, .22, .07, x, -.02, .13, satin, deck, .025), top = box(w - .025, .2, .065, x, -.02, .18, std(color, .2, .45), deck, .025);
    const face = plane(label(title, sub, 400, 160, title.length > 8 ? 40 : 50, ink, color), w - .05, .17, x, -.02, .216, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('GALLERY', 'pays', -.86, .34, '#1d2533', '#d6e2f2', 'pays'); button('−LAYR', 'bet down', -.48, .32, '#1d2533', '#d6e2f2', 'betDown'); button('+LAYR', 'bet up', -.13, .32, '#1d2533', '#d6e2f2', 'betUp'); button('AUTO-LAYER', 'auto', .24, .36, BLUE, '#ffffff', 'auto');
  const ring = cyl(.24, .24, .07, .8, -.02, .13, satin, deck, 40, 'z'); ring.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .8, -.02, .19, std(OR, .25, .35), deck, 40, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  const capFace = canvas(256, 256), cf = capFace.getContext('2d'); cf.fillStyle = lin(cf, 0, 0, 0, 256, [OR2, OR]); cf.beginPath(); cf.arc(128, 128, 126, 0, 7); cf.fill(); cf.lineWidth = 6; cf.strokeStyle = '#ffffff55'; cf.beginPath(); cf.arc(128, 128, 112, 0, 7); cf.stroke(); text(cf, 'INSCRIBE', 128, 128, 38, '#1b0d02', '900');
  const capLabel = plane(capFace, .4, .4, 0, 0, .036, cap, true); capLabel.userData.action = 'spin';
  // Upper body: the screen housing, a thin black bezel stepped three times like layered glass.
  box(2.3, 2.16, 1.0, 0, 2.95, -.05, matte);
  for (const sx of [-1, 1]) { edge(.016, 2.14, .016, sx * 1.152, 2.95, .452, blueLine); edge(.016, 2.14, .016, sx * 1.152, 2.95, -.552, blueLine); }
  edge(2.3, .016, .016, 0, 4.03, .452, whiteLine); edge(2.3, .016, .016, 0, 1.885, .452, orLine);
  box(2.12, 1.52, .05, 0, 2.95, .45, matteDeep, machine, .02);
  const glassA = std('#1a2a44', .3, .1, { transparent: true, opacity: .55 }), glassB = std('#3a2412', .3, .1, { transparent: true, opacity: .45 });
  for (const [w, h, z, m] of [[2.09, 1.49, .472, glassA], [2.06, 1.46, .484, glassB], [2.03, 1.43, .496, matteDeep]]) { const t = .025; box(w, t, .012, 0, 2.95 + h / 2 - t / 2, z, m, machine, 0); box(w, t, .012, 0, 2.95 - h / 2 + t / 2, z, m, machine, 0); box(t, h, .012, -w / 2 + t / 2, 2.95, z, m, machine, 0); box(t, h, .012, w / 2 - t / 2, 2.95, z, m, machine, 0); }
  const shot = (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 700, 480, ['#0b0e14', '#05070b', '#0c0f16']); g.fillRect(0, 0, 700, 480); xtrataLogo(g, 350, 190, 200); spaced(g, 'XTRATA ORIGINALS', 350, 330, 30, 6, WHITE, '900'); spaced(g, 'BORN ON CHAIN · WALK UP AND PLAY', 350, 372, 14, 4, OR2); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .5); screenMesh.userData.role = 'screenMesh';
  // Flanks: real inscription numbers etched along the sides, and two rows of framed Audionauts on each side.
  const etch = canvas(256, 550), eg = etch.getContext('2d'); eg.fillStyle = '#121418'; eg.fillRect(0, 0, 256, 550); eg.font = '700 13px Courier New'; eg.textAlign = 'left';
  for (let r = 0, k = 0; r < 34; r++) for (let c = 0; c < 3; c++, k++) { eg.fillStyle = k % 7 === 0 ? '#4675b688' : k % 11 === 0 ? '#e28c3b77' : '#ffffff1c'; eg.fillText('#' + IDS[k % IDS.length], 8 + c * 84, 15 + r * 16); }
  const capC = canvas(256, 48), cg = capC.getContext('2d'); cg.fillStyle = '#0b0f16'; cg.fillRect(0, 0, 256, 48); spaced(cg, 'AUDIONAUT', 128, 25, 22, 4, '#a9c6ee');
  for (const side of [-1, 1]) {
    plane(etch, 1.0, 2.14, side * 1.151, 2.95, -.05, machine, false, side * Math.PI / 2); plane(etch, 1.1, 1.6, side * 1.151, 1.06, 0, machine, false, side * Math.PI / 2);
    for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++) {
      const i = (side < 0 ? 0 : 6) + row * 3 + col, z = .28 - col * .3, y = 3.42 - row * .5, x = side * 1.17;
      box(.03, .4, .3, x, y, z, satin, machine, .008); const fr = box(.02, .37, .27, x + side * .015, y, z, blueLine, machine, 0); fr.userData.role = 'edgeGlow';
      const img = PORTRAITS[i % Math.max(1, PORTRAITS.length)], pc = canvas(160, 160), pg = pc.getContext('2d'); pg.fillStyle = '#080d10'; pg.fillRect(0, 0, 160, 160); if (img) pg.drawImage(img, 0, 0, 160, 160);
      const p = plane(pc, .25, .25, x + side * .032, y + .02, z, machine, false, side * Math.PI / 2); p.userData.role = 'portrait';
       plane(capC, .25, .047, x + side * .032, y - .145, z, machine, false, side * Math.PI / 2);
    }
  }
  // Marquee.
  box(2.5, .7, 1.08, 0, 4.4, -.05, matteDeep); edge(2.52, .016, .016, 0, 4.06, .495, orLine); edge(2.52, .016, .016, 0, 4.75, .495, whiteLine);
  const mq = canvas(1400, 380), mg = mq.getContext('2d'); mg.fillStyle = '#0a0b0e'; mg.fillRect(0, 0, 1400, 380);
  for (let k = 0; k < 3; k++) { mg.fillStyle = [WHITE, BLUE2, OR][k]; mg.fillRect(200, 268 + k * 12, 1000, 5); }
  mg.save(); mg.shadowColor = BLUE2; mg.shadowBlur = 30; spaced(mg, 'XTRATA', 700, 110, 108, 30, '#ffffff', '900'); mg.restore(); spaced(mg, 'ORIGINALS', 700, 210, 66, 26, OR2, '800');
  if (WORDMARK) { const k = 44 / WORDMARK.naturalHeight; mg.drawImage(WORDMARK, 700 - WORDMARK.naturalWidth * k / 2, 322, WORDMARK.naturalWidth * k, 44); }
  plane(mq, 2.3, .62, 0, 4.41, .495);
  // Topper (crest): the Xtrata mark as three stacked light bands, white, blue and orange, turning slowly.
  cyl(.04, .06, .3, 0, 4.9, -.05, steel); cyl(.2, .26, .07, 0, 4.78, -.05, satin);
  const crest = new THREE.Group(); crest.position.set(0, 5.62, -.05); crest.userData.role = 'crest'; machine.add(crest);
  const bandTex = band => { const c = canvas(1024, 1024), g = c.getContext('2d'), s = 1024 / 851, path = (pts, closed) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (closed) g.closePath(); };
    const grads = { blue: ['#6593cf', '#4675b6', '#315c95', 240, 640], orange: ['#f2aa5a', '#e28c3b', '#c9762c', 495, 790], white: ['#ffffff', '#e2e3e1', '#b9bbb8', 64, 392] }[band];
    g.scale(s, s); g.lineJoin = 'miter'; g.miterLimit = 6; const gr = g.createLinearGradient(0, grads[3], 0, grads[4]); gr.addColorStop(0, grads[0]); gr.addColorStop(.5, grads[1]); gr.addColorStop(1, grads[2]);
    g.shadowColor = grads[0]; g.shadowBlur = 18; g.lineWidth = 15; g.strokeStyle = gr; XLOGO[band].forEach(p => { path(p, true); g.stroke(); }); if (band === 'white') XLOGO.whiteOpen.forEach(p => { path(p); g.stroke(); });
    g.shadowBlur = 0; g.lineWidth = 2.5; g.strokeStyle = '#ffffff66'; XLOGO[band].forEach(p => { path(p, true); g.stroke(); }); return c; };
  [['orange', -.07], ['blue', 0], ['white', .07]].forEach(([b, z]) => { const p = plane(bandTex(b), 1.25, 1.25, 0, 0, z, crest, true); p.material.depthWrite = false; });
  const ringM = std('#1b1e24', .7, .35); const halo = new THREE.Mesh(new THREE.TorusGeometry(.7, .018, 8, 64), ringM); crest.add(halo);
  // Arm (lever): matte black with an orange knob, pulled forward about its axle.
  cyl(.1, .1, .22, 1.24, 2.45, .08, satin, machine, 24, 'x'); box(.1, .5, .3, 1.2, 2.45, .08, matteDeep, machine, .02); edge(.016, .5, .016, 1.252, 2.45, .232, orLine);
  const lever = new THREE.Group(); lever.position.set(1.36, 2.45, .08); lever.userData.role = 'lever'; machine.add(lever);
  const shaft = cyl(.03, .036, 1.0, 0, .5, 0, std('#0d0e11', .25, .8), lever, 16); const collar = cyl(.045, .045, .05, 0, .98, 0, knobRing, lever, 18); const ball = sphere(.1, 0, 1.08, 0, knob, lever);
  [shaft, collar, ball].forEach(m => { m.userData.action = 'spin'; });
  // Rear.
  const rear = canvas(1024, 160), rg = rear.getContext('2d'); rg.fillStyle = '#0c0e11'; rg.fillRect(0, 0, 1024, 160); spaced(rg, 'XTRATA ORIGINALS  /  XO-014  /  BORN ON CHAIN', 512, 82, 26, 6, '#8f9bb0');
  plane(rear, 1.9, .3, 0, 3.4, -.552, machine, false, Math.PI);
  return exportPacked(machine);
};

// Export in the same format as the existing packs: shared geometry/material/texture tables and a node tree.
function exportPacked(root) {
  const geometries = [], materials = [], textures = [], gi = new Map(), mi = new Map(), ti = new Map();
  const r5 = v => Math.round(v * 1e5) / 1e5;
  const texIndex = (t, alpha) => { if (!t) return null; if (ti.has(t)) return ti.get(t); const img = t.image; const url = img.toDataURL ? (alpha ? img.toDataURL('image/png') : img.toDataURL('image/webp', .9)) : null; /* opaque textures as WebP to keep the pack small */ textures.push({ image: url, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); ti.set(t, textures.length - 1); return textures.length - 1; };
  const matIndex = m => { if (mi.has(m)) return mi.get(m); const basic = m.isMeshBasicMaterial; materials.push({ type: basic ? 'basic' : 'standard', color: m.color.getHex(), roughness: basic ? .4 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texIndex(m.map, m.transparent), emissive: m.emissive ? m.emissive.getHex() : 0, emissiveIntensity: m.emissiveIntensity ?? 1 }); mi.set(m, materials.length - 1); return materials.length - 1; };
  const geoIndex = g => { if (gi.has(g)) return gi.get(g); const attributes = {}; for (const k of ['position', 'normal', 'uv']) { const a = g.getAttribute(k); if (a) attributes[k] = { size: a.itemSize, array: Array.from(a.array, r5) }; } geometries.push({ attributes, index: g.index ? Array.from(g.index.array) : null, groups: g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex ?? 0 })) }); gi.set(g, geometries.length - 1); return geometries.length - 1; };
  const node = o => { const n = { p: o.position.toArray().map(r5), q: o.quaternion.toArray().map(r5), s: o.scale.toArray().map(r5), visible: o.visible, role: o.userData.role || '', children: [] }; if (o.userData.action) n.action = o.userData.action; if (o.isMesh) { n.g = geoIndex(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(matIndex) : matIndex(o.material); } n.children = o.children.map(node); return n; };
  root.updateMatrixWorld(true);
  const out = { root: node(root), geometries, materials, textures };
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9], v = new THREE.Vector3();
  root.traverse(o => { if (!o.isMesh) return; const a = o.geometry.getAttribute('position'); for (let i = 0; i < a.count; i++) { v.fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld); const p = [v.x, v.y, v.z]; for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); } } });
  return { json: JSON.stringify(out), stats: { geometries: geometries.length, materials: materials.length, textures: textures.length, size: hi.map((h, k) => +(h - lo[k]).toFixed(3)), min: lo.map(x => +x.toFixed(3)) } };
}
