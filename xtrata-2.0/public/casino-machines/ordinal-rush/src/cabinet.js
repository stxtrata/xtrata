/* Ordinal Rush cabinet, built with THREE and exported in the casino's packed-model format
   ({root, geometries, materials, textures}). Run by build-cabinet.mjs in a headless browser.
   Look: a Victorian assay office in matte charcoal with orange enamel trim and rivets, a brass-bezelled screen,
   an orange neon marquee with chasing bulbs and a brass BLOCK HEIGHT ticker, side panels with a 3 × 7 grid of
   small lit squares, a pickaxe-handle lever with an orange leather grip, and a turning ₿ coin on top whose rim
   carries real inscription numbers. Nothing here imitates another project's art or logo. */
window.buildCabinet = function buildCabinet(opts) {
  const ACC = '#f7931a', NUMS = (opts && opts.numbers) || [0, 83522, 53105612, 63140674, 19114952, 89945, 53785860, 56246171];
  const machine = new THREE.Group(); machine.name = 'Ordinal Rush';
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const text = (g, s, x, y, size, color, weight = '800', font = 'Georgia, serif', align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '700', font = 'Arial') => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const charcoal = std('#2a2a2d', .25, .86), charcoalDark = std('#1b1b1e', .3, .8), enamel = std(ACC, .15, .38), brass = std('#c79a4a', .9, .28), brassDark = std('#8a6328', .85, .35);
  const steel = std('#9aa0a6', .9, .3), rubber = std('#0b0b0c', .05, .8), wood = std('#6b4524', .05, .7), leather = std('#e07c12', .1, .55), glassDark = std('#0d0e10', .6, .12);
  const lit = new THREE.MeshBasicMaterial({ color: '#ffb347' }), dim = new THREE.MeshBasicMaterial({ color: '#4a2a0c' }), bulb = new THREE.MeshBasicMaterial({ color: '#fff0c8' });
  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const s = new THREE.Shape(), a = -w / 2, b = -h / 2, R = Math.min(r, w / 3, h / 3, d / 2.1); s.moveTo(a + R, b); s.lineTo(a + w - R, b); s.quadraticCurveTo(a + w, b, a + w, b + R); s.lineTo(a + w, b + h - R); s.quadraticCurveTo(a + w, b + h, a + w - R, b + h); s.lineTo(a + R, b + h); s.quadraticCurveTo(a, b + h, a, b + h - R); s.lineTo(a, b + R); s.quadraticCurveTo(a, b, a + R, b); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 4 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates crest and lever).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine) { const m3 = new THREE.Mesh(cached(`s${r}`, () => new THREE.SphereGeometry(r, 14, 10)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function plane(c, w, h, x, y, z, parent = machine, transparent = false) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.MeshBasicMaterial({ map: t, transparent, alphaTest: transparent ? .02 : 0 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); parent.add(p); return p; }
  const rivet = (x, y, z, parent = machine) => cyl(.022, .026, .02, x, y, z, brass, parent, 10, 'z');

  // Plinth and lower body.
  box(2.62, .22, 1.42, 0, .11, 0, charcoalDark); box(2.64, .035, 1.44, 0, .235, 0, enamel, machine, 0);
  box(2.3, 1.62, 1.12, 0, 1.06, 0, charcoal);
  // Orange enamel trim and rivets around the lower door.
  for (const [w, h, x, y] of [[2.32, .05, 0, 1.86], [2.32, .05, 0, .27], [.05, 1.6, -1.155, 1.06], [.05, 1.6, 1.155, 1.06]]) box(w, h, .05, x, y, .565, enamel, machine, 0);
  for (let i = 0; i < 9; i++) { rivet(-1.0 + i * .25, 1.80, .585); rivet(-1.0 + i * .25, .33, .585); }
  // Lower door: enamel plate with the promise and the Xtrata mark (drawn with the XLOGO vector code, no image).
  const door = canvas(1100, 640), dg = door.getContext('2d');
  dg.fillStyle = lin(dg, 0, 0, 0, 640, ['#f3e4c4', '#e9d3a6']); dg.fillRect(0, 0, 1100, 640);
  rr(dg, 22, 22, 1056, 596, 26, null, ACC, 18); rr(dg, 52, 52, 996, 536, 16, null, '#7a3e06', 4);
  for (const [x, y] of [[40, 40], [1060, 40], [40, 600], [1060, 600]]) { dg.fillStyle = '#9c6a1f'; dg.beginPath(); dg.arc(x, y, 12, 0, 7); dg.fill(); }
  xtrataLogo(dg, 550, 220, 250);
  text(dg, 'EVERY SAT HAS A NUMBER', 550, 430, 64, '#3a1f05', '700', 'Georgia, serif');
  spaced(dg, 'ORDINAL RUSH  ·  ASSAY OFFICE  ·  PARALLAX CASINO', 550, 512, 22, 4, '#7a3e06');
  plane(door, 1.72, 1.0, 0, 1.0, .566);
  // Souvenir ticket slot with its label.
  box(.62, .1, .06, -.62, 1.62, .59, brass, machine, .01); box(.48, .022, .02, -.62, 1.62, .625, rubber, machine, 0);
  const tk = canvas(256, 64), tg = tk.getContext('2d'); tg.fillStyle = '#1b1b1e'; tg.fillRect(0, 0, 256, 64); spaced(tg, 'TICKET', 128, 33, 30, 6, '#ffc56b'); plane(tk, .3, .075, -.62, 1.52, .567);
  // Deck with the buttons.
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, charcoalDark, deck); box(2.26, .5, .02, 0, 0, .09, rubber, deck, 0);
  box(2.32, .03, .17, 0, .29, 0, enamel, deck, 0); box(2.32, .03, .17, 0, -.29, 0, enamel, deck, 0);
  function label(t, w, h, size, ink, bg) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); text(g, t, w / 2, h / 2 + 2, size, ink, '900', 'Arial'); return c; }
  function button(title, x, w, color, ink, action) {
    const base = box(w, .22, .07, x, -.02, .13, brass, deck, .025), top = box(w - .025, .2, .065, x, -.02, .18, std(color, .25, .35), deck, .025);
    const face = plane(label(title, 400, 160, title.length > 6 ? 44 : 54, ink, color), w - .05, .17, x, -.02, .216, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('RARITY', -.86, .34, '#e8d9c2', '#1a0d00', 'pays'); button('−SATS', -.48, .32, '#e8d9c2', '#1a0d00', 'betDown'); button('+SATS', -.13, .32, '#e8d9c2', '#1a0d00', 'betUp'); button('AUTO-MINE', .24, .36, '#ffc56b', '#1a0d00', 'auto');
  // INSCRIBE: the big round orange spin button. Its cap is spinPhysical; the casino presses it in along z.
  const ring = cyl(.24, .24, .07, .8, -.02, .13, brass, deck, 36, 'z'); ring.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .8, -.02, .19, std(ACC, .3, .3), deck, 36, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  const capFace = canvas(256, 256), cf = capFace.getContext('2d'); cf.fillStyle = ACC; cf.beginPath(); cf.arc(128, 128, 126, 0, 7); cf.fill(); text(cf, 'INSCRIBE', 128, 132, 40, '#1a0d00', '900', 'Arial');
  const capLabel = plane(capFace, .4, .4, 0, 0, .036, cap, true); capLabel.userData.action = 'spin';
  // Upper body: the screen housing with a brass bezel.
  box(2.3, 2.16, 1.0, 0, 2.95, -.05, charcoal);
  for (const [w, h, x, y] of [[2.32, .05, 0, 4.02], [.05, 2.14, -1.155, 2.95], [.05, 2.14, 1.155, 2.95]]) box(w, h, .05, x, y, .465, enamel, machine, 0);
  for (let i = 0; i < 8; i++) { rivet(-1.155, 2.05 + i * .26, .5); rivet(1.155, 2.05 + i * .26, .5); }
  box(2.16, 1.58, .08, 0, 2.95, .44, brass, machine, .03); box(2.08, 1.5, .06, 0, 2.95, .47, brassDark, machine, .02); box(2.02, 1.42, .04, 0, 2.95, .49, rubber, machine, .01);
  const shot = (opts && opts.screenImage) || (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 700, 480, ['#1d2023', '#121416', '#1a1c1f']); g.fillRect(0, 0, 700, 480); g.shadowColor = ACC; g.shadowBlur = 20; text(g, 'ORDINAL RUSH', 350, 210, 62, '#ffc56b', '900', 'Arial'); g.shadowBlur = 0; spaced(g, 'EVERY SAT HAS A NUMBER', 350, 272, 18, 5, '#c9a46a'); spaced(g, 'WALK UP AND PLAY', 350, 330, 14, 4, '#8a6e45'); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .512); screenMesh.userData.role = 'screenMesh';
  // Side panels: a 3 × 7 grid of small lit squares on each flank (the live last-21-blocks row is on the screen).
  for (const side of [-1, 1]) {
    const x = side * 1.158, plate = box(.04, 1.5, .62, x, 2.95, -.05, charcoalDark, machine, 0);
    for (let row = 0; row < 7; row++) for (let col = 0; col < 3; col++) { const on = (row * 3 + col) % 4 !== 3; const sq = box(.012, .13, .13, x + side * .025, 2.45 + row * .17, -.25 + col * .2, on ? lit : dim, machine, 0); }
    box(.03, 1.56, .03, x + side * .02, 2.95, .27, enamel, machine, 0); box(.03, 1.56, .03, x + side * .02, 2.95, -.37, enamel, machine, 0);
  }
  // Marquee: ORDINAL RUSH in orange neon with chasing bulbs, then the brass BLOCK HEIGHT ticker.
  box(2.5, .74, 1.08, 0, 4.42, -.05, charcoalDark); box(2.52, .04, 1.1, 0, 4.06, -.05, enamel, machine, 0); box(2.52, .04, 1.1, 0, 4.78, -.05, enamel, machine, 0);
  const mq = canvas(1400, 360), mg = mq.getContext('2d'); mg.fillStyle = '#121214'; mg.fillRect(0, 0, 1400, 360);
  mg.save(); mg.shadowColor = ACC; mg.shadowBlur = 40; mg.lineWidth = 6; mg.strokeStyle = '#ffd18a'; mg.font = '900 150px Georgia, serif'; mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.fillStyle = ACC; mg.fillText('ORDINAL RUSH', 700, 190); mg.shadowBlur = 0; mg.strokeText('ORDINAL RUSH', 700, 190); mg.restore();
  plane(mq, 2.3, .59, 0, 4.43, .495);
  for (let i = 0; i < 26; i++) { const t = i / 25; sphere(.025, -1.18 + t * 2.36, 4.74, .5, bulb); sphere(.025, -1.18 + t * 2.36, 4.11, .5, i % 2 ? bulb : lit); }
  for (let i = 1; i < 7; i++) { sphere(.025, -1.2, 4.11 + i * .09, .5, bulb); sphere(.025, 1.2, 4.11 + i * .09, .5, bulb); }
  const tick = canvas(1024, 160), kg = tick.getContext('2d'); kg.fillStyle = lin(kg, 0, 0, 0, 160, ['#e6bd6b', '#a77a2e', '#d9ab57']); kg.fillRect(0, 0, 1024, 160); rr(kg, 8, 8, 1008, 144, 18, null, '#5e3f12', 6);
  spaced(kg, 'BLOCK HEIGHT', 250, 82, 46, 8, '#3a2207', '900');
  for (let i = 0; i < 6; i++) { rr(kg, 500 + i * 80, 24, 66, 112, 10, '#151006', '#5e3f12', 4); kg.fillStyle = '#2a1c0b'; kg.fillRect(500 + i * 80 + 4, 76, 58, 8); }
  text(kg, '▸ LIVE ON SCREEN', 940, 140, 18, '#3a2207', '700', 'Arial', 'right');
  box(1.42, .24, .05, 0, 3.86, .47, brassDark, machine, .02); plane(tick, 1.36, .21, 0, 3.86, .497);
  // Topper (crest): a turning orange coin with ₿ on each face and a ring of real inscription numbers round its rim.
  cyl(.04, .07, .3, 0, 4.92, -.05, steel); cyl(.18, .24, .08, 0, 4.82, -.05, brass);
  const crest = new THREE.Group(); crest.position.set(0, 5.5, -.05); crest.userData.role = 'crest'; machine.add(crest);
  const face = canvas(512, 512), fg = face.getContext('2d');
  fg.translate(256, 256); fg.rotate(-Math.PI / 2); fg.translate(-256, -256); // the cylinder cap's UVs run sideways
  fg.fillStyle = lin(fg, 0, 0, 512, 512, ['#ffd18a', ACC, '#a8550a']); fg.beginPath(); fg.arc(256, 256, 254, 0, 7); fg.fill();
  fg.lineWidth = 10; fg.strokeStyle = '#7a3e06'; fg.beginPath(); fg.arc(256, 256, 238, 0, 7); fg.stroke(); fg.beginPath(); fg.arc(256, 256, 172, 0, 7); fg.stroke();
  const ringText = NUMS.map(n => `#${Number(n).toLocaleString('en-GB')}`).join('  ·  ') + '  ·  ';
  fg.save(); fg.translate(256, 256); fg.font = '700 26px Arial'; fg.fillStyle = '#3a1f05'; fg.textAlign = 'center'; fg.textBaseline = 'middle'; const step = (Math.PI * 2) / ringText.length; [...ringText].forEach((ch, i) => { fg.save(); fg.rotate(i * step); fg.fillText(ch, 0, -205); fg.restore(); }); fg.restore();
  text(fg, '₿', 256, 270, 250, '#3a1f05', '900', 'Arial');
  const faceTex = new THREE.CanvasTexture(face); faceTex.colorSpace = THREE.SRGBColorSpace;
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, metalness: .55, roughness: .35 }), rimMat = std('#d9770f', .85, .3);
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(.56, .56, .1, 64).rotateX(Math.PI / 2), [rimMat, faceMat, faceMat]); crest.add(coin);
  // The coin's caps face +z and −z after the bake; flip the back cap's UVs so ₿ reads correctly from behind.
  { const uv = coin.geometry.getAttribute('uv'), pos = coin.geometry.getAttribute('position'); for (let i = 0; i < uv.count; i++) if (pos.getZ(i) < -.049) uv.setX(i, 1 - uv.getX(i)); uv.needsUpdate = true; }
  const coinRing = new THREE.Mesh(new THREE.TorusGeometry(.56, .025, 8, 64), brass); crest.add(coinRing);
  // Lever: a pickaxe-handle arm with an orange leather grip and a small steel pick head, pulled forward about its axle.
  cyl(.1, .1, .22, 1.24, 2.45, .08, brass, machine, 24, 'x'); box(.1, .5, .3, 1.2, 2.45, .08, charcoalDark, machine, .02);
  const lever = new THREE.Group(); lever.position.set(1.36, 2.45, .08); lever.userData.role = 'lever'; machine.add(lever);
  const shaft = cyl(.032, .04, 1.0, 0, .5, 0, wood, lever, 14); const grip = cyl(.05, .05, .32, 0, .86, 0, leather, lever, 18);
  const head = box(.07, .06, .44, 0, 1.06, .02, steel, lever, .01); const tip = cyl(.0, .035, .12, 0, 1.06, .29, steel, lever, 10, 'z');
  [shaft, grip, head, tip].forEach(m => { m.userData.action = 'spin'; });
  for (let i = 0; i < 3; i++) cyl(.052, .052, .02, 0, .74 + i * .12, 0, enamel, lever, 18).userData.action = 'spin'; // the whole arm is clickable
  // Rear: a plain charcoal back with the machine's name.
  const rear = canvas(1024, 160), rg = rear.getContext('2d'); rg.fillStyle = '#1b1b1e'; rg.fillRect(0, 0, 1024, 160); spaced(rg, 'ORDINAL RUSH  /  OR-001  /  EVERY SAT HAS A NUMBER', 512, 82, 26, 6, '#a8977f');
  const back = plane(rear, 1.9, .3, 0, 3.4, -.56); back.rotation.y = Math.PI;
  return exportPacked(machine);
};

// Export in the same format as the existing packs: shared geometry/material/texture tables and a node tree.
function exportPacked(root) {
  const geometries = [], materials = [], textures = [], gi = new Map(), mi = new Map(), ti = new Map();
  const r5 = v => Math.round(v * 1e5) / 1e5;
  const texIndex = t => { if (!t) return null; if (ti.has(t)) return ti.get(t); const img = t.image; const url = img.toDataURL ? img.toDataURL('image/png') : null; textures.push({ image: url, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); ti.set(t, textures.length - 1); return textures.length - 1; };
  const matIndex = m => { if (mi.has(m)) return mi.get(m); const basic = m.isMeshBasicMaterial; materials.push({ type: basic ? 'basic' : 'standard', color: m.color.getHex(), roughness: basic ? .4 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texIndex(m.map), emissive: m.emissive ? m.emissive.getHex() : 0, emissiveIntensity: m.emissiveIntensity ?? 1 }); mi.set(m, materials.length - 1); return materials.length - 1; };
  const geoIndex = g => { if (gi.has(g)) return gi.get(g); const attributes = {}; for (const k of ['position', 'normal', 'uv']) { const a = g.getAttribute(k); if (a) attributes[k] = { size: a.itemSize, array: Array.from(a.array, r5) }; } geometries.push({ attributes, index: g.index ? Array.from(g.index.array) : null, groups: g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex ?? 0 })) }); gi.set(g, geometries.length - 1); return geometries.length - 1; };
  const node = o => { const n = { p: o.position.toArray().map(r5), q: o.quaternion.toArray().map(r5), s: o.scale.toArray().map(r5), visible: o.visible, role: o.userData.role || '', children: [] }; if (o.userData.action) n.action = o.userData.action; if (o.isMesh) { n.g = geoIndex(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(matIndex) : matIndex(o.material); } n.children = o.children.map(node); return n; };
  root.updateMatrixWorld(true);
  const out = { root: node(root), geometries, materials, textures };
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9], v = new THREE.Vector3();
  root.traverse(o => { if (!o.isMesh) return; const a = o.geometry.getAttribute('position'); for (let i = 0; i < a.count; i++) { v.fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld); const p = [v.x, v.y, v.z]; for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); } } });
  return { json: JSON.stringify(out), stats: { geometries: geometries.length, materials: materials.length, textures: textures.length, size: hi.map((h, k) => +(h - lo[k]).toFixed(3)), min: lo.map(x => +x.toFixed(3)) } };
}
