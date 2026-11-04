/* Rugged cabinet, built with THREE and exported in the casino's packed-model format ({root, geometries, materials, textures}).
   Run by tools/build-cabinet.mjs in a headless browser.
   Look: a bazaar rug stall in terracotta, brass and dark wood. The screen hangs as a tapestry from a brass rod, tasselled along its
   foot. Rolled rugs are stacked down both sides and woven rugs hang on the flanks; every rug is a real twinned Bitcoin Bird, woven
   (each pixel a knot) by the same canvas effect the game uses, never redrawn. The topper (crest) is a small flying carpet woven from a
   real bird, rippling. The lever is a long brass loom beater. The lower door reads "NOTHING ON-CHAIN GETS RUGGED" with the Xtrata
   mark drawn with the XLOGO vector code. Nothing here draws or imitates any project's art or logo. */
window.buildCabinet = async function buildCabinet(opts) {
  const ACC = '#b5532c', WOOL = '#f1e4c6', BRASS = '#d9a441', BRASS_HI = '#f6dc94', WOOD = '#22130b', MADDER = '#7c1d14', INDIGO = '#1f2a4a';
  const BIRDS = (opts && opts.birds) || [], SAVED = (opts && opts.saved) || 0, RISK = (opts && opts.risk) || 0;
  const imgs = await Promise.all(BIRDS.map(b => new Promise(res => { const i = new Image(); i.onload = () => res({ id: b.tokenId, img: i }); i.onerror = () => res(null); i.src = b.src; }))).then(l => l.filter(Boolean));
  const machine = new THREE.Group(); machine.name = 'Rugged';
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const text = (g, s, x, y, size, color, weight = '800', font = 'Georgia, serif', align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '700', font = 'Arial') => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const terra = std(ACC, .05, .78), terraDark = std('#8a3a1c', .05, .8), wood = std('#3a2010', .05, .72), woodDark = std(WOOD, .05, .75), brass = std(BRASS, .88, .28), brassDark = std('#8a5a14', .85, .36), wool = std(WOOL, 0, .9), madder = std(MADDER, .02, .85), rubber = std('#120a06', .05, .8);
  const bulb = new THREE.MeshBasicMaterial({ color: '#fff1c8' }), lit = new THREE.MeshBasicMaterial({ color: '#f2c14e' });
  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const s = new THREE.Shape(), a = -w / 2, b = -h / 2, R = Math.min(r, w / 3, h / 3, d / 2.1); s.moveTo(a + R, b); s.lineTo(a + w - R, b); s.quadraticCurveTo(a + w, b, a + w, b + R); s.lineTo(a + w, b + h - R); s.quadraticCurveTo(a + w, b + h, a + w - R, b + h); s.lineTo(a + R, b + h); s.quadraticCurveTo(a, b + h, a, b + h - R); s.lineTo(a, b + R); s.quadraticCurveTo(a, b, a + R, b); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 4 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates crest and lever).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine) { const m3 = new THREE.Mesh(cached(`s${r}`, () => new THREE.SphereGeometry(r, 14, 10)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  const texOf = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  function plane(c, w, h, x, y, z, parent = machine, transparent = false, side = 0) { const m = new THREE.MeshBasicMaterial({ map: texOf(c), transparent, alphaTest: transparent ? .02 : 0, side }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); parent.add(p); return p; }
  const stud = (x, y, z, parent = machine) => cyl(.022, .026, .02, x, y, z, brass, parent, 10, 'z');

  // ---- The weave (the same effect as the game): the bird's central 64×64 pixels as knots, a dyed border, pile texture, fringe. ----
  function rug(bird, k, o = {}) {
    const ext = o.ext ?? 7, land = !!o.land, B = 3, fw = 64 + (land ? 2 * ext : 0), fh = 64 + (land ? 0 : 2 * ext), cols = fw + 2 * B, rows = fh + 2 * B, fl = o.fringe ?? k * 6;
    const W = cols * k + (land ? 2 * fl : 0), H = rows * k + (land ? 0 : 2 * fl), c = canvas(W, H), g = c.getContext('2d'), ox = land ? fl : 0, oy = land ? 0 : fl;
    g.imageSmoothingEnabled = false; g.fillStyle = o.dark || WOOD; g.fillRect(ox, oy, cols * k, rows * k); g.fillStyle = o.dye || ACC; g.fillRect(ox + k, oy + k, (cols - 2) * k, (rows - 2) * k);
    g.fillStyle = WOOL; for (let x = 1; x < cols - 1; x += 4) { g.fillRect(ox + x * k, oy + k, k, k); g.fillRect(ox + x * k, oy + (rows - 2) * k, k, k); } for (let y = 1; y < rows - 1; y += 4) { g.fillRect(ox + k, oy + y * k, k, k); g.fillRect(ox + (cols - 2) * k, oy + y * k, k, k); }
    g.fillRect(ox + (B - 1) * k, oy + (B - 1) * k, (fw + 2) * k, (fh + 2) * k);
    const fx = ox + B * k, fy = oy + B * k, img = bird && bird.img;
    if (img) { if (land) { g.drawImage(img, 18, 18, 1, 64, fx, fy, ext * k, 64 * k); g.drawImage(img, 81, 18, 1, 64, fx + (ext + 64) * k, fy, ext * k, 64 * k); g.drawImage(img, 18, 18, 64, 64, fx + ext * k, fy, 64 * k, 64 * k); } else { g.drawImage(img, 18, 18, 64, 1, fx, fy, 64 * k, ext * k); g.drawImage(img, 18, 81, 64, 1, fx, fy + (ext + 64) * k, 64 * k, ext * k); g.drawImage(img, 18, 18, 64, 64, fx, fy + ext * k, 64 * k, 64 * k); } }
    // Pile: lit at the top of each knot, shaded at its base.
    for (let y = 0; y < rows; y++) { g.fillStyle = '#ffffff1c'; g.fillRect(ox, oy + y * k, cols * k, Math.max(1, k * .3)); g.fillStyle = '#00000038'; g.fillRect(ox, oy + y * k + k * .75, cols * k, Math.max(1, k * .25)); }
    for (let x = 0; x < cols; x++) { g.fillStyle = '#0000001c'; g.fillRect(ox + x * k, oy, Math.max(1, k * .12), rows * k); }
    g.strokeStyle = o.fringeColor || WOOL; g.lineWidth = Math.max(1, k * .5); const n = land ? rows : cols;
    for (let i = 1; i < n - 1; i += 2) { const j = (i * 7) % 5 - 2; g.beginPath(); if (land) { const yy = oy + i * k + k / 2; g.moveTo(ox, yy); g.lineTo(ox - fl + 2, yy + j); g.moveTo(ox + cols * k, yy); g.lineTo(ox + cols * k + fl - 2, yy - j); } else { const xx = ox + i * k + k / 2; g.moveTo(xx, oy); g.lineTo(xx + j, oy - fl + 2); g.moveTo(xx, oy + rows * k); g.lineTo(xx - j, oy + rows * k + fl - 2); } g.stroke(); }
    return c;
  }
  const bird = i => imgs.length ? imgs[i % imgs.length] : null;
  const DYES = ['#c8322a', '#e09a2d', '#2b8a7e', '#4f6bd8', ACC];

  // ---- Plinth and lower body: a terracotta stall front on a dark wood base, brass edging and studs. ----
  box(2.62, .22, 1.42, 0, .11, 0, woodDark); box(2.64, .035, 1.44, 0, .235, 0, brass, machine, 0);
  box(2.3, 1.62, 1.12, 0, 1.06, 0, terra);
  for (const [w, h, x, y] of [[2.32, .05, 0, 1.86], [2.32, .05, 0, .27], [.05, 1.6, -1.155, 1.06], [.05, 1.6, 1.155, 1.06]]) box(w, h, .05, x, y, .565, brass, machine, 0);
  for (let i = 0; i < 9; i++) { stud(-1.0 + i * .25, 1.80, .585); stud(-1.0 + i * .25, .33, .585); }
  // Lower door: a wool plate with a kilim border, the Xtrata mark (XLOGO vector code, no image) and the promise.
  const door = canvas(1100, 640), dg = door.getContext('2d');
  dg.fillStyle = lin(dg, 0, 0, 0, 640, ['#f4e8cc', '#e4d2aa']); dg.fillRect(0, 0, 1100, 640);
  for (let i = 0; i < 1100 / 10; i++) for (let j = 0; j < 3; j++) { const pal = [MADDER, INDIGO, BRASS, ACC]; dg.fillStyle = pal[(j + Math.abs(i % 12 - 6)) % 4]; dg.fillRect(i * 10, j * 10, 10, 10); dg.fillRect(i * 10, 610 - j * 10, 10, 10); }
  for (let i = 0; i < 640 / 10; i++) for (let j = 0; j < 3; j++) { const pal = [MADDER, INDIGO, BRASS, ACC]; dg.fillStyle = pal[(j + Math.abs(i % 12 - 6)) % 4]; dg.fillRect(j * 10, i * 10, 10, 10); dg.fillRect(1070 - j * 10, i * 10, 10, 10); }
  rr(dg, 48, 48, 1004, 544, 16, null, '#8a5a14', 5);
  xtrataLogo(dg, 550, 200, 230);
  text(dg, 'NOTHING ON-CHAIN', 550, 380, 76, MADDER, '900', 'Georgia, serif');
  text(dg, 'GETS RUGGED', 550, 462, 76, MADDER, '900', 'Georgia, serif');
  spaced(dg, 'RUGGED  ·  RESCUED STACKS ART  ·  PARALLAX CASINO', 550, 545, 22, 4, '#6b3a1a');
  plane(door, 1.72, 1.0, 0, 1.0, .566);
  // Souvenir ticket slot with its label.
  box(.62, .1, .06, -.62, 1.62, .59, brass, machine, .01); box(.48, .022, .02, -.62, 1.62, .625, rubber, machine, 0);
  const tk = canvas(256, 64), tg = tk.getContext('2d'); tg.fillStyle = WOOD; tg.fillRect(0, 0, 256, 64); spaced(tg, 'TICKET', 128, 33, 30, 6, BRASS_HI); plane(tk, .3, .075, -.62, 1.52, .567);

  // ---- Deck: dark wood, the loom's controls. ----
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, wood, deck); box(2.26, .5, .02, 0, 0, .09, rubber, deck, 0);
  box(2.32, .03, .17, 0, .29, 0, brass, deck, 0); box(2.32, .03, .17, 0, -.29, 0, brass, deck, 0);
  function label(t, w, h, size, ink, bg) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = '#00000018'; for (let y = 0; y < h; y += 8) g.fillRect(0, y, w, 3); text(g, t, w / 2, h / 2 + 2, size, ink, '900', 'Arial'); return c; }
  function button(title, x, w, color, ink, action) {
    const base = box(w, .22, .07, x, -.02, .13, brass, deck, .025), top = box(w - .025, .2, .065, x, -.02, .18, std(color, .15, .5), deck, .025);
    const face = plane(label(title, 400, 160, title.length > 9 ? 40 : title.length > 6 ? 48 : 56, ink, color), w - .05, .17, x, -.02, .216, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('CATALOGUE', -.86, .38, WOOL, MADDER, 'pays'); button('−KNOTS', -.45, .36, WOOL, MADDER, 'betDown'); button('+KNOTS', -.06, .36, WOOL, MADDER, 'betUp'); button('AUTO-WEAVE', .36, .42, '#e0b25a', '#2a1404', 'auto');
  // WEAVE: the big round spin button, a brass ring and a terracotta cap. Its cap is spinPhysical; the casino presses it in along z.
  const ring = cyl(.24, .24, .07, .93, -.02, .13, brass, deck, 36, 'z'); ring.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .93, -.02, .19, std(ACC, .2, .45), deck, 36, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  const capFace = canvas(256, 256), cf = capFace.getContext('2d'); cf.fillStyle = ACC; cf.beginPath(); cf.arc(128, 128, 126, 0, 7); cf.fill(); cf.strokeStyle = BRASS_HI; cf.lineWidth = 8; cf.beginPath(); cf.arc(128, 128, 108, 0, 7); cf.stroke(); text(cf, 'WEAVE', 128, 132, 52, WOOL, '900', 'Arial');
  const capLabel = plane(capFace, .4, .4, 0, 0, .036, cap, true); capLabel.userData.action = 'spin';

  // ---- Upper body: the stall's back wall in dark wood, the screen hung as a tapestry. ----
  box(2.3, 2.16, 1.0, 0, 2.95, -.05, wood);
  for (const [w, h, x, y] of [[2.32, .05, 0, 4.02], [.05, 2.14, -1.155, 2.95], [.05, 2.14, 1.155, 2.95]]) box(w, h, .05, x, y, .465, brass, machine, 0);
  // The tapestry's woven surround (a kilim band) behind the screen.
  const sur = canvas(1100, 760), sgc = sur.getContext('2d'); sgc.fillStyle = MADDER; sgc.fillRect(0, 0, 1100, 760);
  for (let i = 0; i < 110; i++) for (let j = 0; j < 5; j++) { const pal = [WOOD, WOOL, INDIGO, BRASS, MADDER]; const c = pal[(j + Math.abs(i % 12 - 6)) % 5]; sgc.fillStyle = c; sgc.fillRect(i * 10, j * 10, 10, 10); sgc.fillRect(i * 10, 710 - j * 10, 10, 10); }
  for (let i = 0; i < 76; i++) for (let j = 0; j < 5; j++) { const pal = [WOOD, WOOL, INDIGO, BRASS, MADDER]; sgc.fillStyle = pal[(j + Math.abs(i % 12 - 6)) % 5]; sgc.fillRect(j * 10, i * 10, 10, 10); sgc.fillRect(1050 - j * 10, i * 10, 10, 10); }
  box(2.16, 1.56, .04, 0, 2.95, .45, woodDark, machine, .01); plane(sur, 2.12, 1.5, 0, 2.95, .474);
  const shot = (opts && opts.screenImage) || (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, 480, ['#5e1610', '#7c1d14', '#4e120c']); g.fillRect(0, 0, 700, 480); g.shadowColor = BRASS; g.shadowBlur = 20; text(g, 'RUGGED', 350, 210, 96, WOOL, '900', 'Georgia, serif'); g.shadowBlur = 0; spaced(g, 'RESCUED STACKS ART, WOVEN BACK', 350, 290, 18, 4, BRASS_HI); spaced(g, 'WALK UP AND WEAVE', 350, 340, 14, 4, '#e8cfa6'); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .49); screenMesh.userData.role = 'screenMesh';
  // The brass rod it hangs from, with ball finials and rings, and tassels along the foot of the tapestry.
  cyl(.03, .03, 2.34, 0, 3.73, .5, brass, machine, 16, 'x'); sphere(.055, -1.2, 3.73, .5, brass); sphere(.055, 1.2, 3.73, .5, brass);
  const ringGeo = new THREE.TorusGeometry(.04, .009, 6, 16); for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(ringGeo, brass); r.position.set(-1 + i * .25, 3.71, .5); machine.add(r); }
  const tasselCone = cached('tassel', () => new THREE.CylinderGeometry(.004, .026, .1, 8)); for (let i = 0; i < 17; i++) { const x = -1.04 + i * .13; cyl(.004, .004, .05, x, 2.18, .48, brassDark, machine, 6); const t = new THREE.Mesh(tasselCone, wool); t.position.set(x, 2.13, .48); machine.add(t); sphere(.016, x, 2.17, .48, i % 2 ? brass : madder); }

  // ---- Side dressing: woven rugs hung on both flanks (real twins), each on a little brass rod. ----
  // Named sideRug so a host can swap in newly loaded rugs (the test page does).
  for (const side of [-1, 1]) {
    const x = side * 1.17;
    for (let k = 0; k < 2; k++) { const b = bird((side < 0 ? 0 : 5) + k), r = rug(b, 6, { dye: DYES[(k + (side > 0 ? 2 : 0)) % 5], ext: 8 }); const h = .72, w = h * r.width / r.height, z = -.05 + (k ? -.24 : .24) * side * 0, y = 3.36 - k * .86;
      const p = plane(r, w, h, x + side * .012, y, -.05, machine, true, THREE.DoubleSide); p.rotation.y = side * Math.PI / 2; p.userData.role = 'sideRug';
      cyl(.012, .012, w + .08, x + side * .02, y + h / 2 - .02, -.05, brass, machine, 10, 'z'); }
  }
  // ---- Rolled rugs stacked down both sides of the stall front: real twins, rolled and tied. ----
  function rollTex(b, dye) { const r = rug(b, 4, { land: true, dye, ext: 10, fringe: 0 }); return texOf(r); }
  const endCap = (() => { const c = canvas(128, 128), g = c.getContext('2d'); g.fillStyle = '#3a1d10'; g.fillRect(0, 0, 128, 128); g.lineWidth = 5; for (let r = 60; r > 4; r -= 7) { g.strokeStyle = (r / 7) % 2 < 1 ? WOOL : ACC; g.beginPath(); g.arc(64, 64, r, 0, 7); g.stroke(); } return texOf(c); })();
  const capMat = new THREE.MeshStandardMaterial({ map: endCap, roughness: .9, metalness: 0 });
  let rollIndex = 0;
  for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
    const b = bird(10 + rollIndex), dye = DYES[rollIndex % 5]; rollIndex++;
    const r = .11, len = 1.08 - (i % 2) * .08, x = side * (1.27 + (i % 2) * .02), y = .35 + r + i * (2 * r - .01);
    const geo = new THREE.CylinderGeometry(r, r, len, 24, 1); geo.rotateX(Math.PI / 2);
    const side_ = new THREE.MeshStandardMaterial({ map: rollTex(b, dye), roughness: .92, metalness: 0 });
    const m = new THREE.Mesh(geo, [side_, capMat, capMat]); m.position.set(x, y, 0); machine.add(m);
    for (const tz of [-.28, .28]) cyl(r + .006, r + .006, .035, x, y, tz, brass, machine, 20, 'z'); // the ties
  }

  // ---- Marquee: RUGGED in brass and terracotta with chasing bulbs, then the rescue plate. ----
  box(2.5, .74, 1.08, 0, 4.42, -.05, woodDark); box(2.52, .04, 1.1, 0, 4.06, -.05, brass, machine, 0); box(2.52, .04, 1.1, 0, 4.78, -.05, brass, machine, 0);
  const mq = canvas(1400, 360), mg = mq.getContext('2d'); mg.fillStyle = '#1d0f08'; mg.fillRect(0, 0, 1400, 360);
  for (let i = 0; i < 140; i++) for (let j = 0; j < 2; j++) { const pal = [MADDER, WOOL, INDIGO, BRASS]; mg.fillStyle = pal[(j + Math.abs(i % 12 - 6)) % 4]; mg.fillRect(i * 10, j * 10, 10, 10); mg.fillRect(i * 10, 340 - j * 10, 10, 10); }
  mg.save(); mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.font = '900 210px Georgia, serif'; mg.shadowColor = ACC; mg.shadowBlur = 50; mg.fillStyle = lin(mg, 0, 80, 0, 280, [BRASS_HI, BRASS, '#a86a1c']); mg.fillText('RUGGED', 700, 186); mg.shadowBlur = 0; mg.lineWidth = 5; mg.strokeStyle = '#4a1a0c'; mg.strokeText('RUGGED', 700, 186); mg.restore();
  plane(mq, 2.3, .59, 0, 4.43, .495);
  for (let i = 0; i < 26; i++) { const t = i / 25; sphere(.025, -1.18 + t * 2.36, 4.74, .5, bulb); sphere(.025, -1.18 + t * 2.36, 4.11, .5, i % 2 ? bulb : lit); }
  for (let i = 1; i < 7; i++) { sphere(.025, -1.2, 4.11 + i * .09, .5, bulb); sphere(.025, 1.2, 4.11 + i * .09, .5, bulb); }
  const plate = canvas(1024, 160), pg = plate.getContext('2d'); pg.fillStyle = lin(pg, 0, 0, 0, 160, ['#f4e8cc', '#dcc89c', '#ecdcb8']); pg.fillRect(0, 0, 1024, 160); rr(pg, 8, 8, 1008, 144, 18, null, '#8a5a14', 6);
  spaced(pg, 'THE RESCUE', 200, 82, 38, 6, MADDER, '900');
  for (const [i, s] of [`ART SAVED ${SAVED.toLocaleString('en-GB')}`, `STILL AT RISK ${RISK.toLocaleString('en-GB')}`].entries()) { rr(pg, 400 + i * 304, 26, 290, 108, 10, WOOD, '#8a5a14', 4); text(pg, s, 545 + i * 304, 80, 30, BRASS_HI, '900', 'Arial'); }
  box(1.42, .24, .05, 0, 3.92, .47, woodDark, machine, .02); plane(plate, 1.36, .21, 0, 3.92, .497);

  // ---- Topper (crest): a small flying carpet woven from a real bird, rippled, gold-fringed, turning on its stand. ----
  cyl(.03, .05, .34, 0, 4.95, -.05, brassDark); cyl(.18, .24, .08, 0, 4.82, -.05, brass);
  const crest = new THREE.Group(); crest.position.set(0, 5.42, -.05); crest.userData.role = 'crest'; machine.add(crest);
  const hero = imgs.find(b => b.id === 0) || bird(0), carpet = rug(hero, 6, { land: true, dye: '#b8860b', dark: '#3a2306', ext: 10, fringeColor: BRASS_HI });
  const cgeo = new THREE.PlaneGeometry(1.25, 1.25 * carpet.height / carpet.width, 24, 6); const pos = cgeo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, .045 * Math.sin(x * 7.5) + .02 * Math.sin(y * 9)); } cgeo.rotateX(-Math.PI / 2 + .78); cgeo.computeVertexNormals();
  const cmat = new THREE.MeshStandardMaterial({ map: texOf(carpet), side: THREE.DoubleSide, roughness: .85, metalness: 0, transparent: true, alphaTest: .05 });
  const carpetMesh = new THREE.Mesh(cgeo, cmat); carpetMesh.position.y = .08; crest.add(carpetMesh);
  for (const sx of [-.64, .64]) for (const sz of [-.18, .18]) { const t = new THREE.Mesh(tasselCone, brass); t.position.set(sx, .02, sz * .9); crest.add(t); } // corner tassels

  // ---- Lever: a long brass loom beater. A brass sword rising to a wooden beam with a reed of fine brass dents beneath it. ----
  cyl(.1, .1, .22, 1.24, 2.45, .08, brass, machine, 24, 'x'); box(.1, .5, .3, 1.2, 2.45, .08, woodDark, machine, .02);
  const lever = new THREE.Group(); lever.position.set(1.36, 2.45, .08); lever.userData.role = 'lever'; machine.add(lever);
  const parts = [cyl(.03, .036, 1.12, 0, .56, 0, brass, lever, 14)];
  parts.push(cyl(.05, .05, .32, 0, .62, 0, std(ACC, .05, .7), lever, 16)); // the terracotta grip, cord-wrapped
  for (let i = 0; i < 6; i++) parts.push(cyl(.054, .054, .014, 0, .48 + i * .056, 0, wool, lever, 16));
  parts.push(box(.08, .07, .52, 0, 1.14, 0, wood, lever, .015)); // the beam (the beater's upper bar)
  parts.push(box(.06, .028, .52, 0, .99, 0, wood, lever, .008));
  for (let i = 0; i < 15; i++) parts.push(box(.012, .13, .012, 0, 1.06, -.235 + i * .0335, brass, lever, 0)); // the reed's dents
  parts.push(sphere(.04, 0, 1.14, .29, brass, lever), sphere(.04, 0, 1.14, -.29, brass, lever));
  parts.forEach(m => { m.userData.action = 'spin'; }); // the whole arm is clickable

  // ---- Rear: plain wood with the machine's name. ----
  const rear = canvas(1024, 160), rg = rear.getContext('2d'); rg.fillStyle = WOOD; rg.fillRect(0, 0, 1024, 160); spaced(rg, 'RUGGED  /  RUG-018  /  NOTHING ON-CHAIN GETS RUGGED', 512, 82, 24, 5, '#c9a77a');
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
