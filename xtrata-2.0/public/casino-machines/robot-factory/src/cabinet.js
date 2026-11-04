/* Robot Factory cabinet, built with THREE and exported in the casino's packed-model format
   ({root, geometries, materials, textures}). Run by tools/build-cabinet.mjs in a headless browser.
   Look: a factory-floor assembly station in safety yellow and Megapont purple. The screen sits in a bolted steel frame with a
   hazard-striped hood; a robot arm (armPivot) reaches over the marquee and a big cog (crest) turns on top. A conveyor belt carrying
   plain numbered ape-bot tokens runs down each flank. The deck carries PRESS, +VOLTS, -VOLTS, AUTO-BUILD and BLUEPRINT, and the
   lever is a hydraulic press handle with a red ball grip. The lower door is a riveted plate reading "MEGAPONT ROBOT FACTORY · EST. 2021"
   with the Xtrata mark drawn from the XLOGO vector code. Names are type-set text only: nothing here draws an ape, a robot, a mascot or
   another project's logo. */
window.buildCabinet = function buildCabinet(opts) {
  const PUR = '#7048e8', YEL = '#ffc910', INK = '#14121f', AMB = '#ffb020', CREAM = '#f4efe0';
  const machine = new THREE.Group(); machine.name = 'Robot Factory';
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const text = (g, s, x, y, size, color, weight = '900', font = 'Arial', align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '800', font = 'Arial') => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const yellow = std(YEL, .2, .42), purple = std(PUR, .25, .4), purpleDk = std('#3a2478', .3, .5), ink = std(INK, .3, .6), steel = std('#aeb3ba', .9, .3), steelDk = std('#6d727b', .85, .38), rubber = std('#0b0b10', .05, .8), red = std('#e03131', .2, .35), brass = std('#c9a227', .85, .3), cream = std(CREAM, .05, .7);
  const lit = new THREE.MeshBasicMaterial({ color: AMB }), dim = new THREE.MeshBasicMaterial({ color: '#4a3410' }), bulb = new THREE.MeshBasicMaterial({ color: '#fff0c4' });
  const glass = new THREE.MeshStandardMaterial({ color: '#cdbfff', metalness: .1, roughness: .05, transparent: true, opacity: .14, depthWrite: false });
  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const s = new THREE.Shape(), a = -w / 2, b = -h / 2, R = Math.min(r, w / 3, h / 3, d / 2.1); s.moveTo(a + R, b); s.lineTo(a + w - R, b); s.quadraticCurveTo(a + w, b, a + w, b + R); s.lineTo(a + w, b + h - R); s.quadraticCurveTo(a + w, b + h, a + w - R, b + h); s.lineTo(a + R, b + h); s.quadraticCurveTo(a, b + h, a, b + h - R); s.lineTo(a, b + R); s.quadraticCurveTo(a, b, a + R, b); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 4 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates crest, lever and armPivot).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine) { const m3 = new THREE.Mesh(cached(`s${r}`, () => new THREE.SphereGeometry(r, 16, 12)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function plane(c, w, h, x, y, z, parent = machine, transparent = false) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.MeshBasicMaterial({ map: t, transparent, alphaTest: transparent ? .02 : 0 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); parent.add(p); return p; }
  const bolt = (x, y, z, parent = machine) => cyl(.024, .028, .022, x, y, z, steel, parent, 6, 'z'); // hex-ish bolt head
  // Hazard stripes: yellow and black diagonals, as a texture so panels stay cheap.
  function hazard(w, h, size = 36, a = YEL, b = '#15131c') { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = a; g.fillRect(0, 0, w, h); g.fillStyle = b; for (let x = -h; x < w + h; x += size * 2) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + size, h); g.lineTo(x + size + h, 0); g.lineTo(x + h, 0); g.closePath(); g.fill(); } return c; }
  const stripe = (w, h, x, y, z, parent = machine, size = 30) => plane(hazard(Math.round(w * 400), Math.round(h * 400), size), w, h, x, y, z, parent);

  // Plinth: a steel floor plate with a hazard-striped kick plate, then the lower body in safety yellow with purple side armour.
  box(2.64, .2, 1.44, 0, .1, 0, steelDk); stripe(2.5, .13, 0, .1, .725); box(2.66, .03, 1.46, 0, .215, 0, steel, machine, 0);
  box(2.3, 1.62, 1.12, 0, 1.06, 0, yellow);
  for (const side of [-1, 1]) { box(.07, 1.58, 1.08, side * 1.185, 1.06, 0, purple); for (let i = 0; i < 6; i++) bolt(side * 1.225, .5 + i * .24, .45, machine); }
  for (const [w, h, x, y] of [[2.32, .06, 0, 1.87], [2.32, .06, 0, .27]]) box(w, h, .05, x, y, .565, ink, machine, 0);
  for (let i = 0; i < 9; i++) { bolt(-1.0 + i * .25, 1.80, .59); bolt(-1.0 + i * .25, .34, .59); }
  // Lower door: a riveted steel plate, plus the Xtrata mark (drawn with the XLOGO vector code, no image).
  const door = canvas(1100, 640), dg = door.getContext('2d');
  dg.fillStyle = lin(dg, 0, 0, 0, 640, ['#c3c8cf', '#9ca2ab', '#b4b9c1']); dg.fillRect(0, 0, 1100, 640);
  for (let k = 0; k < 900; k++) { dg.fillStyle = k % 2 ? '#ffffff0b' : '#00000010'; dg.fillRect((k * 197) % 1100, (k * 89) % 640, 3, 1); }
  rr(dg, 22, 22, 1056, 596, 22, null, '#15131c', 12); rr(dg, 50, 50, 1000, 540, 12, null, PUR, 6);
  for (let x = 44; x < 1060; x += 48) for (const y of [36, 604]) { dg.fillStyle = '#6d727b'; dg.beginPath(); dg.arc(x, y, 7, 0, 7); dg.fill(); }
  xtrataLogo(dg, 550, 190, 210);
  text(dg, 'MEGAPONT', 550, 335, 84, '#15131c', '900'); text(dg, 'ROBOT FACTORY', 550, 418, 84, PUR, '900');
  dg.fillStyle = YEL; dg.fillRect(180, 470, 740, 10); spaced(dg, 'MEGAPONT ROBOT FACTORY  ·  EST. 2021', 550, 524, 30, 5, '#15131c', '900'); spaced(dg, 'PARALLAX CASINO  ·  XTRATA', 550, 566, 18, 4, '#3a2478');
  plane(door, 1.72, 1.0, 0, 1.0, .566);
  // Souvenir ticket slot with its label.
  box(.62, .1, .06, -.62, 1.64, .59, steel, machine, .01); box(.48, .022, .02, -.62, 1.64, .625, rubber, machine, 0);
  const tk = canvas(256, 64), tg = tk.getContext('2d'); tg.fillStyle = INK; tg.fillRect(0, 0, 256, 64); spaced(tg, 'TICKET', 128, 33, 30, 6, AMB); plane(tk, .3, .075, -.62, 1.55, .567);

  // Deck with the buttons: PRESS (spin), +VOLTS / -VOLTS (bet), AUTO-BUILD (auto), BLUEPRINT (pays).
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, ink, deck); box(2.26, .5, .02, 0, 0, .09, rubber, deck, 0);
  box(2.32, .03, .17, 0, .29, 0, yellow, deck, 0); box(2.32, .03, .17, 0, -.29, 0, yellow, deck, 0);
  function label(t, w, h, size, fg, bg) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); text(g, t, w / 2, h / 2 + 2, size, fg, '900', 'Arial'); return c; }
  function button(title, x, w, color, fg, action) {
    const base = box(w, .22, .07, x, -.02, .13, steel, deck, .025), top = box(w - .025, .2, .065, x, -.02, .18, std(color, .25, .35), deck, .025);
    const face = plane(label(title, 400, 160, title.length > 8 ? 42 : title.length > 6 ? 48 : 56, fg, color), w - .05, .17, x, -.02, .216, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('BLUEPRINT', -.86, .38, YEL, INK, 'pays'); button('−VOLTS', -.45, .38, '#e8e1ff', INK, 'betDown'); button('+VOLTS', -.04, .38, '#e8e1ff', INK, 'betUp'); button('AUTO-BUILD', .37, .4, PUR, '#ffffff', 'auto');
  // PRESS: the big round spin button. Its cap is spinPhysical; the casino presses it in along z.
  const ring = cyl(.24, .24, .07, .93, -.02, .13, steel, deck, 36, 'z'); ring.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .93, -.02, .19, std('#e03131', .3, .3), deck, 36, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  const capFace = canvas(256, 256), cf = capFace.getContext('2d'); cf.fillStyle = '#e03131'; cf.beginPath(); cf.arc(128, 128, 126, 0, 7); cf.fill(); cf.strokeStyle = YEL; cf.lineWidth = 10; cf.setLineDash([22, 14]); cf.beginPath(); cf.arc(128, 128, 108, 0, 7); cf.stroke(); text(cf, 'PRESS', 128, 132, 58, '#ffffff', '900', 'Arial');
  const capLabel = plane(capFace, .4, .4, 0, 0, .036, cap, true); capLabel.userData.action = 'spin';

  // Upper body: the screen housing in Megapont purple, a bolted yellow frame and a hazard-striped hood.
  box(2.3, 2.16, 1.0, 0, 2.95, -.05, purpleDk);
  for (const [w, h, x, y] of [[2.32, .06, 0, 4.03], [.06, 2.14, -1.16, 2.95], [.06, 2.14, 1.16, 2.95]]) box(w, h, .05, x, y, .465, yellow, machine, 0);
  for (let i = 0; i < 8; i++) { bolt(-1.16, 2.05 + i * .26, .5); bolt(1.16, 2.05 + i * .26, .5); }
  box(2.16, 1.58, .08, 0, 2.95, .44, ink, machine, .03); box(2.08, 1.5, .06, 0, 2.95, .47, steel, machine, .02); box(2.02, 1.42, .04, 0, 2.95, .49, rubber, machine, .01);
  for (const [x, y] of [[-1.03, 2.22], [1.03, 2.22], [-1.03, 3.68], [1.03, 3.68]]) bolt(x, y, .5);
  const shot = (opts && opts.screenImage) || (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 700, 480, ['#1b1233', '#14102a', '#1e1438']); g.fillRect(0, 0, 700, 480); g.shadowColor = PUR; g.shadowBlur = 24; text(g, 'ROBOT', 350, 190, 70, YEL, '900'); text(g, 'FACTORY', 350, 256, 70, '#ffffff', '900'); g.shadowBlur = 0; spaced(g, 'MEGAPONT · ON STACKS', 350, 318, 18, 5, '#b9a6ff'); spaced(g, 'PRESS TO BUILD', 350, 364, 14, 4, '#8a7ac8'); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .512); screenMesh.userData.role = 'screenMesh';
  // Pressure gauge on the frame, beside the screen (a fixed dial; the live gauge is drawn on the screen itself).
  const gc = canvas(256, 256), gg = gc.getContext('2d'); gg.fillStyle = '#f4efe0'; gg.beginPath(); gg.arc(128, 128, 120, 0, 7); gg.fill(); gg.lineWidth = 8; gg.strokeStyle = '#15131c'; gg.stroke();
  for (let k = 0; k <= 10; k++) { const a = Math.PI * (.8 + 1.4 * k / 10); gg.strokeStyle = k > 7 ? '#e03131' : '#15131c'; gg.lineWidth = k % 5 ? 3 : 6; gg.beginPath(); gg.moveTo(128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92); gg.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); gg.stroke(); }
  gg.strokeStyle = '#e03131'; gg.lineWidth = 7; gg.beginPath(); gg.moveTo(128, 128); gg.lineTo(128 + Math.cos(Math.PI * 1.45) * 88, 128 + Math.sin(Math.PI * 1.45) * 88); gg.stroke(); text(gg, 'PSI', 128, 178, 26, '#15131c', '900');
  cyl(.14, .14, .05, 1.16, 3.82, .5, steel, machine, 28, 'z'); plane(gc, .22, .22, 1.16, 3.82, .528, machine, true);
  // Side conveyors: a belt behind glass down each flank, carrying plain numbered ape-bot tokens in the four tier colours.
  const TOK = ['#8b5cf6', '#4c9bff', '#ff5a5f', '#ffc910'];
  function conveyor(offset) {
    const c = canvas(512, 1240), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, 1240, ['#15131c', '#241d3a', '#15131c']); g.fillRect(0, 0, 512, 1240);
    g.fillStyle = '#0b0b10'; g.fillRect(70, 0, 372, 1240); for (let y = 0; y < 1240; y += 46) { g.fillStyle = '#23202e'; g.fillRect(70, y, 372, 6); }
    g.fillStyle = hazardPattern(g); g.fillRect(0, 0, 70, 1240); g.fillRect(442, 0, 70, 1240);
    for (let row = 0; row < 6; row++) {
      const k = row + offset, y = 116 + row * 202, col = TOK[k % 4];
      g.save(); g.translate(256, y); g.shadowColor = '#000a'; g.shadowBlur = 12;
      g.beginPath(); for (let t = 0; t < 14; t++) { const a = t / 14 * Math.PI * 2, r = t % 2 ? 92 : 104; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fillStyle = col; g.fill(); g.shadowBlur = 0;
      g.lineWidth = 7; g.strokeStyle = '#15131c'; g.stroke(); g.beginPath(); g.arc(0, 0, 66, 0, 7); g.fillStyle = '#15131c'; g.fill(); g.lineWidth = 5; g.strokeStyle = col; g.stroke();
      g.beginPath(); for (let t = 0; t < 6; t++) { const a = t / 6 * Math.PI * 2; g.lineTo(Math.cos(a) * 30, Math.sin(a) * 30); } g.closePath(); g.fillStyle = '#d9dde3'; g.fill();
      text(g, String(11 + ((k * 7) % 88)).padStart(2, '0'), 0, 0, 30, '#15131c', '900'); g.restore();
    }
    return c;
  }
  function hazardPattern(g) { return g.createPattern(hazard(70, 70, 17), 'repeat'); }
  function sheen() { const c = canvas(256, 620), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 256, 620, ['#ffffff00', '#ffffff2e', '#ffffff00', '#ffffff14', '#ffffff00']); g.fillRect(0, 0, 256, 620); return c; }
  for (const side of [-1, 1]) {
    const x = side * 1.17;
    box(.04, 1.5, .64, x, 2.95, -.05, ink, machine, 0);
    const pic = plane(conveyor(side < 0 ? 0 : 3), .6, 1.452, x + side * .021, 2.95, -.05); pic.rotation.y = side * Math.PI / 2;
    const sh = plane(sheen(), .6, 1.452, x + side * .036, 2.95, -.05, machine, true); sh.rotation.y = side * Math.PI / 2;
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(.62, 1.5), glass); pane.position.set(x + side * .041, 2.95, -.05); pane.rotation.y = side * Math.PI / 2; machine.add(pane);
    for (const [w, h, d, y, z] of [[.06, .045, .68, 3.72, -.05], [.06, .045, .68, 2.18, -.05], [.06, 1.58, .04, 2.95, .29], [.06, 1.58, .04, 2.95, -.39]]) box(w, h, d, x + side * .035, y, z, steel, machine, .01);
    for (const [y, r] of [[3.66, .05], [2.24, .05]]) cyl(r, r, .6, x + side * .05, y, -.05, steelDk, machine, 14, 'z');
  }
  // Marquee: ROBOT FACTORY in amber neon with chasing bulbs, then the plate that says how big the Factory is.
  box(2.5, .74, 1.08, 0, 4.42, -.05, ink); stripe(2.52, .05, 0, 4.06, .5, machine, 18); stripe(2.52, .05, 0, 4.78, .5, machine, 18);
  const mq = canvas(1400, 360), mg = mq.getContext('2d'); mg.fillStyle = '#0e0b1a'; mg.fillRect(0, 0, 1400, 360);
  mg.save(); mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.font = '900 142px Arial';
  for (const [s, y, col] of [['ROBOT', 112, AMB], ['FACTORY', 250, YEL]]) { mg.shadowColor = col; mg.shadowBlur = 40; mg.fillStyle = col; mg.fillText(s, 700, y); mg.shadowBlur = 0; mg.lineWidth = 5; mg.strokeStyle = '#fff6d6'; mg.strokeText(s, 700, y); }
  mg.restore(); plane(mq, 2.3, .59, 0, 4.43, .495);
  for (let i = 0; i < 26; i++) { const t = i / 25; sphere(.025, -1.18 + t * 2.36, 4.74, .5, bulb); sphere(.025, -1.18 + t * 2.36, 4.11, .5, i % 2 ? bulb : lit); }
  const plate = canvas(1024, 160), kg = plate.getContext('2d'); kg.fillStyle = lin(kg, 0, 0, 0, 160, ['#c3c8cf', '#9ca2ab', '#b4b9c1']); kg.fillRect(0, 0, 1024, 160); rr(kg, 8, 8, 1008, 144, 14, null, '#15131c', 6);
  for (const x of [28, 996]) for (const y of [28, 132]) { kg.fillStyle = '#6d727b'; kg.beginPath(); kg.arc(x, y, 8, 0, 7); kg.fill(); }
  spaced(kg, 'MEGAPONT ROBOT FACTORY', 512, 62, 46, 5, '#15131c', '900'); spaced(kg, 'EST. 2021  ·  STACKS  ·  XTRATA', 512, 114, 26, 6, PUR, '900');
  box(1.5, .24, .05, 0, 3.86, .47, ink, machine, .02); plane(plate, 1.44, .225, 0, 3.86, .497);
  // Topper (crest): a big cog turning on a stand, with a brass hub.
  cyl(.045, .075, .3, 0, 4.92, -.05, steel); cyl(.18, .26, .08, 0, 4.82, -.05, steelDk);
  const crest = new THREE.Group(); crest.position.set(0, 5.45, -.05); crest.userData.role = 'crest'; machine.add(crest);
  const cogShape = new THREE.Shape(); { const N = 14, R1 = .43, R2 = .52; for (let t = 0; t < N * 4; t++) { const a = t / (N * 4) * Math.PI * 2, tooth = (t % 4 === 1 || t % 4 === 2), r = tooth ? R2 : R1; t ? cogShape.lineTo(Math.cos(a) * r, Math.sin(a) * r) : cogShape.moveTo(r, 0); } cogShape.closePath(); }
  const cogGeo = new THREE.ExtrudeGeometry(cogShape, { depth: .06, bevelEnabled: true, bevelSegments: 1, bevelSize: .012, bevelThickness: .012, steps: 1, curveSegments: 4 }); cogGeo.translate(0, 0, -.03);
  crest.add(new THREE.Mesh(cogGeo, std(YEL, .7, .32)));
  const cogFace = canvas(512, 512), cgf = cogFace.getContext('2d'); cgf.clearRect(0, 0, 512, 512); cgf.fillStyle = PUR; cgf.beginPath(); cgf.arc(256, 256, 190, 0, 7); cgf.fill(); cgf.lineWidth = 14; cgf.strokeStyle = '#15131c'; cgf.stroke();
  for (let t = 0; t < 6; t++) { const a = t / 6 * Math.PI * 2; cgf.fillStyle = '#15131c'; cgf.beginPath(); cgf.arc(256 + Math.cos(a) * 120, 256 + Math.sin(a) * 120, 26, 0, 7); cgf.fill(); }
  cgf.fillStyle = YEL; cgf.beginPath(); cgf.arc(256, 256, 60, 0, 7); cgf.fill(); text(cgf, 'RF', 256, 260, 56, '#15131c', '900');
  for (const z of [.0425, -.0425]) { const f = plane(cogFace, .72, .72, 0, 0, z, crest, true); if (z < 0) f.rotation.y = Math.PI; }
  // Robot arm (armPivot): a hinged industrial arm over the left of the marquee. The room swings it around z; it rests upright.
  const armBase = cyl(.12, .15, .1, -.9, 4.84, -.05, steelDk, machine, 20); armBase.name = 'armBase';
  const arm = new THREE.Group(); arm.position.set(-.9, 4.9, -.05); arm.userData.role = 'armPivot'; machine.add(arm);
  sphere(.085, 0, 0, 0, brass, arm); box(.1, .5, .1, 0, .28, 0, yellow, arm, .02); cyl(.06, .06, .14, 0, .55, 0, steel, arm, 14, 'z');
  const fore = new THREE.Group(); fore.position.set(0, .55, 0); fore.rotation.z = -.95; arm.add(fore);
  box(.085, .42, .085, 0, .21, 0, purple, fore, .015); sphere(.06, 0, .43, 0, brass, fore);
  for (const s of [-1, 1]) { const f = box(.025, .17, .05, s * .04, .53, 0, steel, fore, .006); f.rotation.z = s * -.18; }
  // Lever: a hydraulic press handle with a red ball grip. A steel piston housing, a chrome rod and a heavy red ball.
  cyl(.1, .1, .22, 1.24, 2.45, .08, steel, machine, 24, 'x'); box(.1, .5, .3, 1.2, 2.45, .08, ink, machine, .02);
  const lever = new THREE.Group(); lever.position.set(1.36, 2.45, .08); lever.userData.role = 'lever'; machine.add(lever);
  const rod = cyl(.034, .042, .95, 0, .48, 0, steel, lever, 14), sleeve = cyl(.065, .065, .38, 0, .22, 0, steelDk, lever, 18), ballG = sphere(.115, 0, 1.02, 0, red, lever), collar = cyl(.075, .075, .05, 0, .98, 0, brass, lever, 18);
  const hoseA = cyl(.016, .016, .28, .075, .35, 0, rubber, lever, 8), stripeA = cyl(.068, .068, .03, 0, .4, 0, yellow, lever, 18), stripeB = cyl(.068, .068, .03, 0, .3, 0, yellow, lever, 18);
  [rod, sleeve, ballG, collar, hoseA, stripeA, stripeB].forEach(m => { m.userData.action = 'spin'; }); // the whole handle is clickable
  // Rear: a plain panel with the machine's name.
  const rear = canvas(1024, 160), rg = rear.getContext('2d'); rg.fillStyle = INK; rg.fillRect(0, 0, 1024, 160); spaced(rg, 'ROBOT FACTORY  /  RF-006  /  MEGAPONT ON STACKS', 512, 82, 25, 5, '#b9a6ff');
  const rearPlane = plane(rear, 1.9, .3, 0, 3.4, -.56); rearPlane.rotation.y = Math.PI;
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
