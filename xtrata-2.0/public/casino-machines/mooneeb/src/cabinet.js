/* Mooneeb cabinet, built with THREE r128 (the room's version) and exported to the packed model format.
   Named parts the room expects: screenMesh, crest (turns on its own clock), spinPhysical, lever, and deck buttons
   with actions spin, betUp, betDown, auto, pays. Extra roles rung0–rung4 let a host light the neon word ladder. */
function buildMooneebCabinet(THREE, opts = {}) {
  const machine = new THREE.Group(); machine.name = 'Mooneeb cabinet';
  const C = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const tex = (c, opaque = true) => { const t = new THREE.CanvasTexture(c); t.userData = { opaque }; t.anisotropy = 8; return t; };
  const std = (color, metal = .2, rough = .45, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough, ...extra });
  const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
  const PURPLE = std('#3b1d8f', .35, .32), DEEP = std('#1a0b3a', .3, .4), CHROME = std('#e4ddf2', .95, .14), GOLD = std('#ffc83d', .85, .22), CREAM = std('#f4ead2', .05, .6), INKM = std('#120726', .2, .5), GLOW = basic('#c084fc'), GLOW_GOLD = basic('#ffd76a');
  const geos = new Map(); const cached = (k, f) => { if (!geos.has(k)) geos.set(k, f()); return geos.get(k); };
  function rrShape(w, h, r) { const s = new THREE.Shape(), a = -w / 2, b = -h / 2; s.moveTo(a + r, b); s.lineTo(a + w - r, b); s.quadraticCurveTo(a + w, b, a + w, b + r); s.lineTo(a + w, b + h - r); s.quadraticCurveTo(a + w, b + h, a + w - r, b + h); s.lineTo(a + r, b + h); s.quadraticCurveTo(a, b + h, a, b + h - r); s.lineTo(a, b + r); s.quadraticCurveTo(a, b, a + r, b); return s; }
  function box(w, h, d, x, y, z, m, parent = machine, r = .03) { const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const R = Math.min(r, w / 3, h / 3, d / 2.1); const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * R, h - 2 * R, Math.max(.001, R * .6)), { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 6 }); g.translate(0, 0, -d / 2 + R); return g; }); const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 40) { const mesh = new THREE.Mesh(cached(`c${r1}|${r2}|${h}|${seg}`, () => new THREE.CylinderGeometry(r1, r2, h, seg)), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  function sphere(r, x, y, z, m, parent = machine, seg = 32) { const mesh = new THREE.Mesh(cached(`s${r}|${seg}`, () => new THREE.SphereGeometry(r, seg, Math.round(seg * .7))), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  function plane(c, w, h, x, y, z, parent = machine, transparent = false, side = THREE.FrontSide) { const m = new THREE.MeshBasicMaterial({ map: tex(c, !transparent), transparent, alphaTest: transparent ? .02 : 0, side, depthWrite: !transparent }); const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const txt = (g, s, x, y, size, color, weight = '900', font = 'Arial') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const neon = (g, s, x, y, size, color, glow) => { g.save(); g.shadowColor = glow || color; g.shadowBlur = size * .45; txt(g, s, x, y, size, color); g.shadowBlur = size * .2; txt(g, s, x, y, size, '#ffffff'); g.restore(); };
  const stars = (g, w, h, n, seed = 7) => { let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, r = rnd() * 2.2 + .4; g.globalAlpha = .4 + rnd() * .6; g.fillStyle = rnd() < .2 ? '#ffe9a8' : '#ffffff'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } g.globalAlpha = 1; };
  // Cow print: cream with irregular black patches, original.
  function cowPrint(w, h, seed) { const c = C(w, h), g = c.getContext('2d'); g.fillStyle = '#f6eedb'; g.fillRect(0, 0, w, h); let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = '#1d1530';
    for (let i = 0; i < 16; i++) { const cx = rnd() * w, cy = rnd() * h, R = 40 + rnd() * 90; g.beginPath(); for (let k = 0; k <= 14; k++) { const a = k / 14 * Math.PI * 2, rr2 = R * (.65 + rnd() * .5); const x = cx + Math.cos(a) * rr2, y = cy + Math.sin(a) * rr2 * 1.2; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); g.fill(); }
    g.globalAlpha = .08; g.fillStyle = '#000'; for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 2); g.globalAlpha = 1; return c; }
  function moonTex() { const c = C(1024, 512), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#fff6d2'); gr.addColorStop(.5, '#ffe7a0'); gr.addColorStop(1, '#f2c45a'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512); let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 46; i++) { const x = rnd() * 1024, y = 60 + rnd() * 392, r = 10 + rnd() * 46; g.fillStyle = '#e9b845'; g.beginPath(); g.ellipse(x, y, r, r * .8, 0, 0, 7); g.fill(); g.fillStyle = '#d6a033'; g.beginPath(); g.ellipse(x + r * .15, y + r * .12, r * .7, r * .55, 0, 0, 7); g.fill(); } return c; }

  /* ----- Plinth, body and trims ----- */
  box(2.56, .22, 1.48, 0, .11, 0, DEEP); box(2.5, .03, 1.42, 0, .235, 0, GLOW, machine, 0);
  box(2.1, 1.56, 1.06, 0, 1.0, 0, PURPLE); box(2.1, 2.32, .98, 0, 2.95, -.04, PURPLE); box(2.16, .07, 1.12, 0, 1.79, .01, CHROME);
  for (const sx of [-1, 1]) { box(.035, 2.2, .035, sx * 1.04, 2.95, .45, GLOW, machine, 0); box(.035, 1.4, .035, sx * 1.04, 1.02, .53, GLOW, machine, 0); }
  // Cow-print side panels with the neon word ladder: M at the bottom, climbing to MOONEEB at the top.
  const rungs = [];
  for (const side of [-1, 1]) {
    box(.07, 3.92, 1.12, side * 1.07, 2.17, -.02, DEEP, machine, .025);
    const cp = cowPrint(512, 1792, side > 0 ? 977 : 4242), pg = cp.getContext('2d'); rr(pg, 10, 10, 492, 1772, 40, null, '#3b1d8f', 20);
    const pnl = plane(cp, 1.02, 3.8, side * 1.108, 2.17, -.02); pnl.rotation.y = side * Math.PI / 2;
    ['M', 'MOO', 'MOON', 'MOONEY', 'MOONEEB'].forEach((w, i) => {
      const cw = 150 + w.length * 70, c = C(cw, 150), g = c.getContext('2d'); rr(g, 8, 8, cw - 16, 134, 60, '#14072bdd', i === 4 ? '#ffd76a' : '#c084fc', 8); neon(g, w, cw / 2, 78, 74, i === 4 ? '#ffe9a8' : '#efe0ff', i === 4 ? '#ffd76a' : '#c084fc');
      const h = .21, m = plane(c, h * cw / 150, h, side * 1.116, .95 + i * .7, -.02, machine, true); m.rotation.y = side * Math.PI / 2; m.material.color.set('#8a73b8'); m.userData.role = 'rung' + i; rungs.push(m);
    });
  }
  /* ----- Starry night strip and marquee ----- */
  box(2.32, .46, 1.18, 0, 4.33, -.04, DEEP); for (const y of [4.1, 4.57]) { box(2.36, .035, .035, 0, y, .57, GLOW_GOLD, machine, 0); for (const sx of [-1, 1]) box(.035, .035, 1.2, sx * 1.17, y, -.04, GLOW_GOLD, machine, 0); }
  { const c = C(2048, 400), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 400); gr.addColorStop(0, '#0b0330'); gr.addColorStop(1, '#2a1166'); g.fillStyle = gr; g.fillRect(0, 0, 2048, 400); stars(g, 2048, 400, 260, 3); g.fillStyle = '#fff3c0'; g.beginPath(); g.arc(1850, 120, 60, 0, 7); g.fill(); g.fillStyle = '#e9b845'; for (const [x, y, r] of [[1830, 100, 12], [1872, 140, 16], [1840, 150, 7]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.save(); g.font = '900 200px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#c084fc'; g.shadowBlur = 50; g.fillStyle = '#e9d5ff'; g.fillText('MOONEEB', 1024, 210); g.shadowBlur = 14; g.fillStyle = '#ffffff'; g.fillText('MOONEEB', 1024, 210); g.restore();
    txt(g, 'M · MOO · MOON · MOONEY · MOONEEB', 1024, 355, 34, '#ffd76a', '800'); plane(c, 2.26, .44, 0, 4.33, .558); }
  for (const side of [-1, 1]) { const c = C(512, 200), g = c.getContext('2d'); g.fillStyle = '#120540'; g.fillRect(0, 0, 512, 200); stars(g, 512, 200, 60, side > 0 ? 9 : 21); const p = plane(c, 1.16, .44, side * 1.165, 4.33, -.04); p.rotation.y = side * Math.PI / 2; }
  /* ----- Topper: a slowly turning full moon with a cow silhouette leaping over it ----- */
  cyl(.05, .08, .36, 0, 4.72, -.04, CHROME);
  const crest = new THREE.Group(); crest.position.set(0, 5.22, -.04); crest.userData.role = 'crest'; machine.add(crest);
  const moonMat = std('#ffffff', 0, .85, { map: tex(moonTex()), emissive: '#5a4a20', emissiveIntensity: .35 }); sphere(.42, 0, 0, 0, moonMat, crest, 48);
  { const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .014, 8, 96), GLOW_GOLD); ring.rotation.x = Math.PI / 2.3; crest.add(ring); sphere(.04, .6, 0, 0, GLOW_GOLD, crest, 12); }
  { const c = C(1024, 640), g = c.getContext('2d'); g.translate(512, 330); g.fillStyle = '#1a0838'; g.strokeStyle = '#efe0ff'; g.lineWidth = 10; g.lineJoin = 'round';
    // An original cow silhouette mid-leap: body, head, horns, legs stretched fore and aft, tail.
    g.beginPath(); g.ellipse(-20, -160, 190, 92, -.18, 0, 7); g.moveTo(150, -230); g.ellipse(200, -248, 78, 58, -.35, 0, 7); g.fill(); g.stroke();
    for (const [x1, y1, x2, y2] of [[-150, -130, -290, -40], [-110, -100, -220, -10], [90, -170, 260, -110], [60, -130, 230, -60], [-200, -175, -300, -250]]) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineWidth = 34; g.strokeStyle = '#efe0ff'; g.stroke(); g.lineWidth = 22; g.strokeStyle = '#1a0838'; g.stroke(); }
    g.lineWidth = 10; g.strokeStyle = '#efe0ff'; g.beginPath(); g.moveTo(210, -300); g.lineTo(196, -350); g.lineTo(234, -306); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(-20, -160, 190, 92, -.18, 0, 7); g.fillStyle = '#1a0838'; g.fill();
    g.fillStyle = '#efe0ff'; for (const [x, y, r] of [[-60, -190, 34], [40, -140, 26], [-130, -150, 22]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    const cow = plane(c, 1.6, 1.0, 0, .42, .02, crest, true, THREE.DoubleSide); cow.material.depthWrite = false; }
  /* ----- Screen: framed as a rocket porthole with rivets ----- */
  const SY = 2.94, SZ = .455;
  { const outer = rrShape(2.2, 1.58, .26), hole = rrShape(1.98, 1.36, .12); outer.holes.push(hole); const g = new THREE.ExtrudeGeometry(outer, { depth: .05, bevelEnabled: true, bevelSegments: 4, bevelSize: .02, bevelThickness: .025, curveSegments: 18 }); const frame = new THREE.Mesh(g, CHROME); frame.position.set(0, SY, SZ - .02); machine.add(frame); }
  box(2.32, 1.7, .04, 0, SY, SZ - .04, DEEP, machine, .02);
  for (let k = 0; k < 28; k++) { const t = k / 28 * Math.PI * 2, x = Math.cos(t) * 1.06, y = Math.sin(t) * .74, kx = Math.sign(x) * Math.min(Math.abs(x), 1.0), ky = Math.sign(y) * Math.min(Math.abs(y), .69); sphere(.022, kx * 1.035, SY + ky * 1.035, SZ + .06, GOLD, machine, 10); }
  const sc = C(1400, 960), sgc = sc.getContext('2d'); sgc.fillStyle = '#0b0418'; sgc.fillRect(0, 0, 1400, 960);
  const screenMat = new THREE.MeshBasicMaterial({ map: tex(sc), color: '#ffffff' }); const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.36), screenMat); screenMesh.position.set(0, SY, SZ); screenMesh.userData.role = 'screenMesh'; machine.add(screenMesh);
  if (opts.screenImage) { sgc.drawImage(opts.screenImage, 0, 0, 1400, 960); screenMat.map.needsUpdate = true; }
  /* ----- Deck and buttons ----- */
  const deck = new THREE.Group(); deck.position.set(0, 1.82, .62); deck.rotation.x = -.72; machine.add(deck);
  box(2.12, .56, .16, 0, 0, 0, DEEP, deck); box(2.06, .5, .02, 0, 0, .09, INKM, deck, 0);
  function label(main, sub, w, h, fg, bg) { const c = C(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); txt(g, main, w / 2, h * (sub ? .42 : .5), h * (sub ? .4 : .5), fg); if (sub) txt(g, sub, w / 2, h * .8, h * .16, fg, '700'); return c; }
  function pill(main, sub, x, w, color, ink, action) { const base = box(w, .24, .07, x, -.02, .13, CHROME, deck, .03); const top = box(w - .03, .21, .065, x, -.02, .175, std(color, .3, .3), deck, .03); const face = plane(label(main, sub, 512, 220, ink, color), w - .06, .18, x, -.02, .2105, deck); [base, top, face].forEach(m => { m.userData.action = action; }); return top; }
  pill('MOONMAP', 'PAYS', -.8, .34, '#e9d5ff', '#2a1150', 'pays'); pill('−MOO', 'BET −', -.44, .32, '#e9d5ff', '#2a1150', 'betDown'); pill('+MOO', 'BET +', -.1, .32, '#e9d5ff', '#2a1150', 'betUp'); pill('AUTO-MOO', 'AUTO', .26, .34, '#c084fc', '#1a0838', 'auto');
  { const ring = cyl(.24, .24, .06, .74, -.02, .12, CHROME, deck, 48); ring.rotation.x = Math.PI / 2; ring.userData.action = 'spin';
    const c = C(512, 512), g = c.getContext('2d'); const gr = g.createRadialGradient(220, 200, 20, 256, 256, 260); gr.addColorStop(0, '#fff3b0'); gr.addColorStop(.6, '#ffc83d'); gr.addColorStop(1, '#e09a1a'); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); txt(g, 'MOO', 256, 236, 150, '#2a1150'); txt(g, 'SPIN', 256, 350, 52, '#5a3a12', '800');
    const capMat = new THREE.MeshStandardMaterial({ map: tex(c), metalness: .3, roughness: .3 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .07, 48), [GOLD, capMat, GOLD]); top.rotation.x = Math.PI / 2; top.position.set(.74, -.02, .18); top.userData.role = 'spinPhysical'; top.userData.action = 'spin'; deck.add(top); }
  /* ----- Lever: a chrome rocket-throttle with a moon-shaped knob ----- */
  { const hub = cyl(.15, .15, .22, 1.2, 2.32, .12, CHROME); hub.rotation.z = Math.PI / 2; box(.12, .5, .4, 1.13, 2.32, .12, DEEP, machine, .03);
    const lever = new THREE.Group(); lever.position.set(1.33, 2.32, .12); lever.userData.role = 'lever'; machine.add(lever);
    const parts = [cyl(.035, .045, 1.0, 0, .5, 0, CHROME, lever), cyl(.06, .06, .3, 0, .78, 0, std('#7b5cff', .3, .35), lever), cyl(.07, .05, .06, 0, .62, 0, CHROME, lever)];
    const fin = box(.02, .22, .14, 0, .5, -.09, std('#ff5c8a', .3, .4), lever, .01); parts.push(fin);
    const knob = sphere(.15, 0, 1.06, 0, moonMat, lever, 32); parts.push(knob); parts.forEach(m => m.userData.action = 'spin'); }
  /* ----- Lower door: the ladder and the Xtrata mark; coin and souvenir ticket slots ----- */
  { const c = C(1024, 660), g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 660); gr.addColorStop(0, '#2a1166'); gr.addColorStop(1, '#14072b'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 660); stars(g, 1024, 660, 90, 5);
    rr(g, 20, 20, 984, 620, 40, null, '#c084fc', 6); rr(g, 34, 34, 956, 592, 32, null, '#ffd76a66', 2);
    if (opts.xtrataLogo) opts.xtrataLogo(g, 512, 230, 300);
    g.save(); g.shadowColor = '#c084fc'; g.shadowBlur = 24; txt(g, 'M · MOO · MOON · MOONEY · MOONEEB', 512, 450, 46, '#f4e9ff', '900'); g.restore();
    txt(g, 'CLIMB THE WORD LADDER', 512, 520, 26, '#ffd76a', '800'); txt(g, 'POWERED BY THE XTRATA PROTOCOL', 512, 572, 20, '#b7a6d6', '700');
    plane(c, 1.8, 1.16, 0, .98, .535); }
  box(.42, .12, .07, -.55, .36, .53, CHROME); box(.3, .03, .02, -.55, .36, .57, INKM, machine, 0);
  box(.5, .12, .07, .52, .36, .53, CHROME); box(.4, .022, .02, .52, .36, .57, INKM, machine, 0);
  { const c = C(512, 230), g = c.getContext('2d'); g.fillStyle = '#f2e8cf'; g.fillRect(0, 0, 512, 230); g.strokeStyle = '#2a1150'; g.setLineDash([8, 6]); g.lineWidth = 3; g.strokeRect(10, 10, 492, 210); g.setLineDash([]);
    if (opts.wordmark) { const im = opts.wordmark, k = 300 / im.width; g.drawImage(im, 256 - 150, 18, 300, im.height * k); }
    txt(g, 'MOONEEB · SOUVENIR', 256, 150, 34, '#2a1150'); txt(g, 'ONE SEAT ON THE NEXT MOONSHOT', 256, 190, 20, '#5a3a12', '800');
    const tk = plane(c, .36, .16, .52, .3, .6, machine); tk.rotation.x = -1.2; }
  /* ----- Back ----- */
  { const c = C(1024, 200), g = c.getContext('2d'); g.fillStyle = '#14072b'; g.fillRect(0, 0, 1024, 200); txt(g, 'M O O N E E B', 512, 80, 64, '#c084fc'); txt(g, 'PARALLAX CASINO · STACKS PURPLE EDITION · XTRATA', 512, 150, 24, '#8a73b8', '700'); const p = plane(c, 1.9, .37, 0, 3.4, -.535); p.rotation.y = Math.PI; }
  machine.updateMatrixWorld(true);
  return { machine, crest, screenMesh, rungs };
}

/* Export a THREE group to the packed format the room reads: nodes {p,q,s,visible,role,children,g,m,action},
   de-duplicated geometries, materials and textures (data URLs). */
function packCabinet(THREE, root) {
  const geos = [], gIdx = new Map(), mats = [], mIdx = new Map(), texs = [], tIdx = new Map();
  const R = v => Math.round(v * 1e5) / 1e5;
  const colorInt = c => c ? c.getHex() : 0;
  function texture(t) { if (!t) return null; if (tIdx.has(t.uuid)) return tIdx.get(t.uuid); const img = t.image, opaque = t.userData && t.userData.opaque; const data = img.toDataURL ? img.toDataURL(opaque ? 'image/jpeg' : 'image/png', .9) : img.src; texs.push({ image: data, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); tIdx.set(t.uuid, texs.length - 1); return texs.length - 1; }
  function material(m) { if (mIdx.has(m.uuid)) return mIdx.get(m.uuid); const basic = m.isMeshBasicMaterial; mats.push({ type: basic ? 'basic' : 'standard', color: colorInt(m.color), roughness: basic ? 1 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texture(m.map), emissive: basic ? 0 : colorInt(m.emissive), emissiveIntensity: basic ? 1 : m.emissiveIntensity }); mIdx.set(m.uuid, mats.length - 1); return mats.length - 1; }
  function geometry(g) { if (gIdx.has(g.uuid)) return gIdx.get(g.uuid); const out = { attributes: {} }; for (const k of ['position', 'normal', 'uv']) { const a = g.attributes[k]; if (a) out.attributes[k] = { size: a.itemSize, array: Array.from(a.array, R) }; } if (g.index) out.index = Array.from(g.index.array); if (g.groups && g.groups.length) out.groups = g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex })); geos.push(out); gIdx.set(g.uuid, geos.length - 1); return geos.length - 1; }
  function node(o) { const n = { p: o.position.toArray().map(R), q: o.quaternion.toArray().map(R), s: o.scale.toArray().map(R), visible: o.visible, role: (o.userData && o.userData.role) || '', children: [] }; if (o.isMesh) { n.g = geometry(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(material) : material(o.material); } if (o.userData && typeof o.userData.action === 'string') n.action = o.userData.action; o.children.forEach(c => n.children.push(node(c))); return n; }
  return { root: node(root), geometries: geos, materials: mats, textures: texs };
}
