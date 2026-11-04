/* Rare Pepe Directory cabinet, built with THREE and exported in the casino's packed-model format
   ({root, geometries, materials, textures}). Run by tools/build-cabinet.mjs in a headless browser.
   Look: a collectors' card-shop counter in Pepe green and cream. The screen is a binder page held by three silver rings,
   and a glass display case of real card names (colour-edged by series group) runs down each flank. A green neon marquee
   with chasing bulbs sits above a plate reading the size of the Directory, and a holographic Series 1 card turns on top.
   The lever is a booster-pack crimper: a steel shaft, a green rubber grip and serrated jaws. The lower door carries
   "RARE PEPES · ON BITCOIN SINCE 2016" and the Xtrata mark, drawn with the XLOGO vector code. Nothing here draws or
   imitates the Pepe character, any card's artwork or another project's logo: cards show only their type-set asset name. */
window.buildCabinet = function buildCabinet(opts) {
  const ACC = '#3fb950', CREAM = '#f4ecd2', GOLD = '#f2c14e', INK = '#04140a';
  const NAMES = (opts && opts.names) || ['RAREPEPE', 'PEPENACHO', 'PEPEDOLLAR', 'WAGMIPEPE', 'PEPEONABTC', 'BASEDPEPE', 'PEPEWIFI', 'RAREDANK', 'PEPEJACK', 'KINGPEPE', 'PEPEBALL', 'PEPEGOLD', 'PEPETRADE', 'PEPEHODL', 'PEPEWAVE', 'PEPECARD', 'SATOSHIPEPE', 'PEPEHAT'];
  const TOTAL = (opts && opts.total) || 1774;
  const machine = new THREE.Group(); machine.name = 'Rare Pepe Directory';
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const text = (g, s, x, y, size, color, weight = '800', font = 'Georgia, serif', align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '700', font = 'Arial') => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const felt = std('#143a22', .1, .9), feltDark = std('#0c2415', .15, .85), enamel = std(ACC, .15, .38), cream = std(CREAM, .05, .7), silver = std('#c9cfc7', .9, .26), silverDark = std('#7f877f', .85, .34), goldM = std('#d4aa4a', .9, .28);
  const steel = std('#aab0b4', .9, .3), rubber = std('#0b0e0c', .05, .8), wood = std('#7a4f2a', .05, .7), grip = std('#2f9e44', .1, .6), glassDark = std('#0d1210', .6, .12);
  const lit = new THREE.MeshBasicMaterial({ color: '#8be28f' }), dim = new THREE.MeshBasicMaterial({ color: '#12301b' }), bulb = new THREE.MeshBasicMaterial({ color: '#f4ecd2' });
  const glass = new THREE.MeshStandardMaterial({ color: '#bfe9c8', metalness: .1, roughness: .05, transparent: true, opacity: .16, depthWrite: false });
  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const s = new THREE.Shape(), a = -w / 2, b = -h / 2, R = Math.min(r, w / 3, h / 3, d / 2.1); s.moveTo(a + R, b); s.lineTo(a + w - R, b); s.quadraticCurveTo(a + w, b, a + w, b + R); s.lineTo(a + w, b + h - R); s.quadraticCurveTo(a + w, b + h, a + w - R, b + h); s.lineTo(a + R, b + h); s.quadraticCurveTo(a, b + h, a, b + h - R); s.lineTo(a, b + R); s.quadraticCurveTo(a, b, a + R, b); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 4 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates crest and lever).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine) { const m3 = new THREE.Mesh(cached(`s${r}`, () => new THREE.SphereGeometry(r, 14, 10)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function plane(c, w, h, x, y, z, parent = machine, transparent = false) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.MeshBasicMaterial({ map: t, transparent, alphaTest: transparent ? .02 : 0 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); parent.add(p); return p; }
  const rivet = (x, y, z, parent = machine) => cyl(.022, .026, .02, x, y, z, silver, parent, 10, 'z');

  // Counter plinth (a wooden shop counter with a cream top edge) and the lower body in green felt-board.
  box(2.62, .22, 1.42, 0, .11, 0, wood); box(2.64, .035, 1.44, 0, .235, 0, cream, machine, 0);
  box(2.3, 1.62, 1.12, 0, 1.06, 0, felt);
  // Cream trim and rivets around the lower door.
  for (const [w, h, x, y] of [[2.32, .05, 0, 1.86], [2.32, .05, 0, .27], [.05, 1.6, -1.155, 1.06], [.05, 1.6, 1.155, 1.06]]) box(w, h, .05, x, y, .565, cream, machine, 0);
  for (let i = 0; i < 9; i++) { rivet(-1.0 + i * .25, 1.80, .585); rivet(-1.0 + i * .25, .33, .585); }
  // Lower door: cream card-stock plate with the promise and the Xtrata mark (drawn with the XLOGO vector code, no image).
  const door = canvas(1100, 640), dg = door.getContext('2d');
  dg.fillStyle = lin(dg, 0, 0, 0, 640, ['#f6efd6', '#e6dbb4']); dg.fillRect(0, 0, 1100, 640);
  rr(dg, 22, 22, 1056, 596, 26, null, ACC, 18); rr(dg, 52, 52, 996, 536, 16, null, '#0f5a28', 4);
  for (const [x, y] of [[40, 40], [1060, 40], [40, 600], [1060, 600]]) { dg.fillStyle = '#9aa39a'; dg.beginPath(); dg.arc(x, y, 12, 0, 7); dg.fill(); }
  xtrataLogo(dg, 550, 205, 230);
  text(dg, 'RARE PEPES', 550, 392, 92, '#0f3d1f', '900', 'Georgia, serif');
  text(dg, 'ON BITCOIN SINCE 2016', 550, 470, 50, '#1f6a34', '800', 'Georgia, serif');
  spaced(dg, 'RARE PEPE DIRECTORY  ·  PARALLAX CASINO', 550, 538, 22, 4, '#0f5a28');
  plane(door, 1.72, 1.0, 0, 1.0, .566);
  // Souvenir ticket slot with its label.
  box(.62, .1, .06, -.62, 1.62, .59, silver, machine, .01); box(.48, .022, .02, -.62, 1.62, .625, rubber, machine, 0);
  const tk = canvas(256, 64), tg = tk.getContext('2d'); tg.fillStyle = '#0c2415'; tg.fillRect(0, 0, 256, 64); spaced(tg, 'TICKET', 128, 33, 30, 6, '#8be28f'); plane(tk, .3, .075, -.62, 1.52, .567);
  // Deck with the buttons.
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  box(2.32, .56, .16, 0, 0, 0, feltDark, deck); box(2.26, .5, .02, 0, 0, .09, rubber, deck, 0);
  box(2.32, .03, .17, 0, .29, 0, cream, deck, 0); box(2.32, .03, .17, 0, -.29, 0, cream, deck, 0);
  function label(t, w, h, size, ink, bg) { const c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); text(g, t, w / 2, h / 2 + 2, size, ink, '900', 'Arial'); return c; }
  function button(title, x, w, color, ink, action) {
    const base = box(w, .22, .07, x, -.02, .13, silver, deck, .025), top = box(w - .025, .2, .065, x, -.02, .18, std(color, .25, .35), deck, .025);
    const face = plane(label(title, 400, 160, title.length > 8 ? 40 : title.length > 6 ? 46 : 54, ink, color), w - .05, .17, x, -.02, .216, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('DIRECTORY', -.86, .36, '#f4ecd2', INK, 'pays'); button('−PEPECASH', -.45, .38, '#f4ecd2', INK, 'betDown'); button('+PEPECASH', -.04, .38, '#f4ecd2', INK, 'betUp'); button('AUTO-TRADE', .37, .4, '#8be28f', INK, 'auto');
  // TRADE: the big round green spin button. Its cap is spinPhysical; the casino presses it in along z.
  const ring = cyl(.24, .24, .07, .93, -.02, .13, silver, deck, 36, 'z'); ring.userData.action = 'spin';
  const cap = cyl(.205, .205, .07, .93, -.02, .19, std(ACC, .3, .3), deck, 36, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  const capFace = canvas(256, 256), cf = capFace.getContext('2d'); cf.fillStyle = ACC; cf.beginPath(); cf.arc(128, 128, 126, 0, 7); cf.fill(); text(cf, 'TRADE', 128, 132, 54, INK, '900', 'Arial');
  const capLabel = plane(capFace, .4, .4, 0, 0, .036, cap, true); capLabel.userData.action = 'spin';
  // Upper body: the screen housing. The screen is a binder page: green leather, a cream page edge and three silver rings.
  box(2.3, 2.16, 1.0, 0, 2.95, -.05, felt);
  for (const [w, h, x, y] of [[2.32, .05, 0, 4.02], [.05, 2.14, -1.155, 2.95], [.05, 2.14, 1.155, 2.95]]) box(w, h, .05, x, y, .465, cream, machine, 0);
  for (let i = 0; i < 8; i++) { rivet(-1.155, 2.05 + i * .26, .5); rivet(1.155, 2.05 + i * .26, .5); }
  box(2.16, 1.58, .08, 0, 2.95, .44, feltDark, machine, .03); box(2.08, 1.5, .06, 0, 2.95, .47, cream, machine, .02); box(2.02, 1.42, .04, 0, 2.95, .49, rubber, machine, .01);
  const ringGeo = new THREE.TorusGeometry(.075, .017, 8, 28).rotateY(Math.PI / 2);
  for (const y of [2.42, 2.95, 3.48]) { const r = new THREE.Mesh(ringGeo, silver); r.position.set(-1.1, y, .47); machine.add(r); cyl(.03, .03, .1, -1.1, y, .44, silverDark, machine, 12, 'x'); }
  const shot = (opts && opts.screenImage) || (() => { const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 700, 480, ['#0f2d1a', '#0a1d11', '#0e2817']); g.fillRect(0, 0, 700, 480); g.shadowColor = ACC; g.shadowBlur = 20; text(g, 'RARE PEPE', 350, 190, 62, CREAM, '900', 'Arial'); text(g, 'DIRECTORY', 350, 250, 62, '#8be28f', '900', 'Arial'); g.shadowBlur = 0; spaced(g, 'ON BITCOIN SINCE 2016', 350, 312, 18, 5, '#9bd4a2'); spaced(g, 'WALK UP AND PLAY', 350, 360, 14, 4, '#6f9a77'); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .512); screenMesh.userData.role = 'screenMesh';
  // Side display cases: a glass-fronted case of cards on each flank. Each card is edged in its series group's colour and shows only
  // its type-set asset name (gold: Series 1, red: 2–12, green: 13–25, blue: 26–36, purple: Fake Rares).
  const EDGES = [GOLD, '#ff5a5f', '#3fb950', '#4c9bff', '#b07cff'];
  function caseTexture(offset) {
    const c = canvas(512, 1240), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, 1240, ['#0b2415', '#123a21', '#0b2415']); g.fillRect(0, 0, 512, 1240);
    for (let row = 0; row < 6; row++) {
      g.fillStyle = '#d6cba2'; g.fillRect(8, 8 + (row + 1) * 205, 496, 6); // the shelf
      for (let col = 0; col < 3; col++) {
        const k = row * 3 + col + offset, edge = EDGES[(row + col * 2 + offset) % 5], x = 22 + col * 160, y = 26 + row * 205, w = 128, h = 168, name = NAMES[k % NAMES.length];
        g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(((k * 7) % 5 - 2) * .018); g.translate(-w / 2, -h / 2);
        g.shadowColor = '#000a'; g.shadowBlur = 10; rr(g, 0, 0, w, h, 8, '#0a140c'); g.shadowBlur = 0; rr(g, 0, 0, w, h, 8, null, edge, 7);
        rr(g, 9, 9, w - 18, 20, 4, '#10301a'); text(g, edge === GOLD ? 'SERIES 1' : edge === '#b07cff' ? 'FAKE RARE' : `SERIES ${2 + (k * 5) % 35}`, w / 2, 20, 11, '#dff7df', '900', 'Arial');
        rr(g, 9, 34, w - 18, h - 76, 4, lin(g, 0, 34, w, h, ['#0d2a15', '#1f6a34', '#0d2a15']));
        const nm = name.length > 9 ? [name.slice(0, Math.ceil(name.length / 2)), name.slice(Math.ceil(name.length / 2))] : [name]; nm.forEach((s, i) => text(g, s, w / 2, 34 + (h - 76) / 2 + (i - (nm.length - 1) / 2) * 20, nm.length > 1 ? 17 : 21, '#dff7df', '900', 'Courier New'));
        rr(g, 9, h - 36, w - 18, 26, 4, '#10301a'); text(g, 'COUNTERPARTY', w / 2, h - 23, 11, '#8be28f', '800', 'Arial');
        g.restore();
      }
    }
    return c;
  }
  function glassSheen() { const c = canvas(256, 620), g = c.getContext('2d'); g.clearRect(0, 0, 256, 620); g.fillStyle = lin(g, 0, 0, 256, 620, ['#ffffff00', '#ffffff2e', '#ffffff00', '#ffffff14', '#ffffff00']); g.fillRect(0, 0, 256, 620); return c; }
  for (const side of [-1, 1]) {
    const x = side * 1.17;
    box(.04, 1.5, .64, x, 2.95, -.05, feltDark, machine, 0);
    const pic = plane(caseTexture(side < 0 ? 0 : 9), .6, 1.452, x + side * .021, 2.95, -.05); pic.rotation.y = side * Math.PI / 2;
    const sheen = plane(glassSheen(), .6, 1.452, x + side * .036, 2.95, -.05, machine, true); sheen.rotation.y = side * Math.PI / 2;
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(.62, 1.5), glass); pane.position.set(x + side * .041, 2.95, -.05); pane.rotation.y = side * Math.PI / 2; machine.add(pane);
    for (const [w, h, d, y, z] of [[.06, .045, .68, 3.72, -.05], [.06, .045, .68, 2.18, -.05], [.06, 1.58, .04, 2.95, .29], [.06, 1.58, .04, 2.95, -.39]]) box(w, h, d, x + side * .035, y, z, silver, machine, .01);
    box(.07, .06, .1, x + side * .04, 2.95, .32, silverDark, machine, .01); // the case's little latch
  }
  // Marquee: RARE PEPE DIRECTORY in green neon with chasing bulbs, then the plate that says how big the Directory is.
  box(2.5, .74, 1.08, 0, 4.42, -.05, feltDark); box(2.52, .04, 1.1, 0, 4.06, -.05, cream, machine, 0); box(2.52, .04, 1.1, 0, 4.78, -.05, cream, machine, 0);
  const mq = canvas(1400, 360), mg = mq.getContext('2d'); mg.fillStyle = '#07140b'; mg.fillRect(0, 0, 1400, 360);
  mg.save(); mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.font = '900 128px Georgia, serif';
  for (const [s, y] of [['RARE PEPE', 118], ['DIRECTORY', 252]]) { mg.shadowColor = ACC; mg.shadowBlur = 42; mg.fillStyle = ACC; mg.fillText(s, 700, y); mg.shadowBlur = 0; mg.lineWidth = 5; mg.strokeStyle = '#dff7df'; mg.strokeText(s, 700, y); }
  mg.restore(); plane(mq, 2.3, .59, 0, 4.43, .495);
  for (let i = 0; i < 26; i++) { const t = i / 25; sphere(.025, -1.18 + t * 2.36, 4.74, .5, bulb); sphere(.025, -1.18 + t * 2.36, 4.11, .5, i % 2 ? bulb : lit); }
  for (let i = 1; i < 7; i++) { sphere(.025, -1.2, 4.11 + i * .09, .5, bulb); sphere(.025, 1.2, 4.11 + i * .09, .5, bulb); }
  const tick = canvas(1024, 160), kg = tick.getContext('2d'); kg.fillStyle = lin(kg, 0, 0, 0, 160, ['#f6efd6', '#d8ccA0', '#ece3c0']); kg.fillRect(0, 0, 1024, 160); rr(kg, 8, 8, 1008, 144, 18, null, '#0f5a28', 6);
  spaced(kg, 'THE DIRECTORY', 232, 82, 40, 7, '#0f3d1f', '900');
  for (const [i, s] of ['36 SERIES', `${TOTAL.toLocaleString('en-GB')} CARDS`, 'SINCE 2016'].entries()) { rr(kg, 470 + i * 182, 26, 170, 108, 10, '#0c2415', '#1f6a34', 4); text(kg, s, 555 + i * 182, 80, s.length > 9 ? 24 : 28, '#dff7df', '900', 'Arial'); }
  box(1.42, .24, .05, 0, 3.86, .47, feltDark, machine, .02); plane(tick, 1.36, .21, 0, 3.86, .497);
  // Topper (crest): a holographic Series 1 card turning on a stand. Gold-foil edge, a rainbow sheen, and only type-set text.
  cyl(.04, .07, .3, 0, 4.92, -.05, steel); cyl(.18, .24, .08, 0, 4.82, -.05, silver);
  const crest = new THREE.Group(); crest.position.set(0, 5.5, -.05); crest.userData.role = 'crest'; machine.add(crest);
  const cardTex = (() => {
    const c = canvas(512, 720), g = c.getContext('2d');
    g.fillStyle = lin(g, 0, 0, 512, 720, ['#fff3c2', '#f2c14e', '#a87411', '#ffe9a0', '#d19b1f']); rr(g, 0, 0, 512, 720, 36, g.fillStyle);
    const holo = lin(g, 0, 0, 512, 720, ['#ff6ad500', '#ff6ad566', '#6af0ff66', '#7dff8a66', '#ffe96a66', '#ff6ad500']); g.fillStyle = holo; rr(g, 0, 0, 512, 720, 36, holo);
    for (let i = 0; i < 70; i++) { const px = (i * 97) % 512, py = (i * 211) % 720; g.fillStyle = '#ffffffaa'; g.beginPath(); g.arc(px, py, 1.5 + (i % 3), 0, 7); g.fill(); }
    rr(g, 26, 26, 460, 668, 20, null, '#7a5a10', 6);
    rr(g, 48, 48, 416, 62, 12, '#2a2108'); text(g, 'SERIES 1 · CARD 1', 256, 80, 38, '#ffe9a0', '900', 'Arial');
    rr(g, 48, 130, 416, 430, 14, lin(g, 48, 130, 464, 560, ['#0d2a15', '#1f6a34', '#0d2a15']));
    for (let r = 0; r < 14; r++) for (let q = 0; q < 14; q++) if ((r + q) % 2) { g.fillStyle = '#8be28f18'; g.fillRect(48 + q * 29.7, 130 + r * 30.7, 29.7, 30.7); }
    g.shadowColor = '#000'; g.shadowBlur = 12; text(g, NAMES[0], 256, 330, NAMES[0].length > 8 ? 58 : 76, '#f4ecd2', '900', 'Courier New'); g.shadowBlur = 0;
    spaced(g, 'RARE PEPE DIRECTORY', 256, 420, 22, 3, '#bfe9c0', '900'); spaced(g, 'COUNTERPARTY', 256, 458, 18, 4, '#7fcf8a', '800');
    rr(g, 48, 580, 416, 82, 12, '#2a2108'); text(g, 'ON BITCOIN SINCE 2016', 256, 621, 30, '#ffe9a0', '900', 'Arial');
    return c;
  })();
  const cardTexture = new THREE.CanvasTexture(cardTex); cardTexture.colorSpace = THREE.SRGBColorSpace;
  const cardFace = new THREE.MeshStandardMaterial({ map: cardTexture, metalness: .55, roughness: .3 });
  crest.add(new THREE.Mesh(new THREE.BoxGeometry(.64, .9, .036), std('#d9ad2e', .85, .3)));
  const front = new THREE.Mesh(new THREE.PlaneGeometry(.62, .88), cardFace); front.position.z = .0185; crest.add(front);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(.62, .88), cardFace); back.position.z = -.0185; back.rotation.y = Math.PI; crest.add(back);
  // Lever: a booster-pack crimper. A steel shaft, a green rubber grip with cream rings, and serrated crimping jaws on top.
  cyl(.1, .1, .22, 1.24, 2.45, .08, silver, machine, 24, 'x'); box(.1, .5, .3, 1.2, 2.45, .08, feltDark, machine, .02);
  const lever = new THREE.Group(); lever.position.set(1.36, 2.45, .08); lever.userData.role = 'lever'; machine.add(lever);
  const shaft = cyl(.032, .04, 1.0, 0, .5, 0, steel, lever, 14), gripM = cyl(.056, .056, .4, 0, .78, 0, grip, lever, 18);
  const jawLow = box(.34, .05, .13, 0, 1.0, 0, steel, lever, .012), jawHigh = box(.34, .05, .13, 0, 1.075, 0, steel, lever, .012), pivot = cyl(.034, .034, .38, 0, 1.04, -.06, silverDark, lever, 14, 'x');
  const parts = [shaft, gripM, jawLow, jawHigh, pivot];
  for (let i = 0; i < 9; i++) parts.push(box(.016, .03, .13, -.14 + i * .035, 1.036, 0, silverDark, lever, 0)); // the serrated crimp teeth
  for (let i = 0; i < 3; i++) parts.push(cyl(.06, .06, .022, 0, .66 + i * .12, 0, cream, lever, 18));
  parts.forEach(m => { m.userData.action = 'spin'; }); // the whole arm is clickable
  // Rear: a plain green back with the machine's name.
  const rear = canvas(1024, 160), rg = rear.getContext('2d'); rg.fillStyle = '#0c2415'; rg.fillRect(0, 0, 1024, 160); spaced(rg, 'RARE PEPE DIRECTORY  /  RPD-001  /  ON BITCOIN SINCE 2016', 512, 82, 25, 5, '#9bb8a1');
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
