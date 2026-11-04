/* Degen City cabinet (ParallaX Casino machine 9), built with THREE and exported in the casino's packed-model format
   ({root, geometries, materials, textures}). Run by tools/build-cabinet-node.mjs (plain Node + @napi-rs/canvas).
   Look: two cities on one machine. The cabinet is split down the middle by a chrome seam: Miami orange (#e8590c) on the
   left, NYC blue (#1f5fe0) on the right. Every coloured part (body, trim, bezel, deck, door, marquee, side panels) is split
   the same way. On top a two-sided coin turns: a Miami sunset on +z, a New York night skyline on -z. The marquee carries
   DEGEN CITY in neon (DEGEN orange, CITY blue) over a static LEADERBOARD bar (MIAMI | NEW YORK) whose live race is drawn on
   the game screen. The lever is a chrome arm with a grip that fades from orange to blue. The Xtrata mark on the lower door
   is drawn with the XLOGO vector code (never redrawn or recoloured). All art is original and generic: sunset, palms,
   sea, towers, brick, windows, fire-escape lines. No real logo, no NFT character, no brand text.
   Part names/roles follow the siblings: screenMesh, crest (turning topper), spinPhysical, lever, and deck actions
   spin/betUp/betDown/auto/pays. */
window.buildCabinet = function buildCabinet(opts) {
  const ORG = '#e8590c', BLU = '#1f5fe0';
  const PAL = {
    L: { acc: ORG, tube: '#ff8a2a', glow: '#ff5a00', core: '#fff1da', dark: '#1d0a03', mid: '#7a2d06', text: '#ffb066', soft: '#ff7a1e' },
    R: { acc: BLU, tube: '#4b8dff', glow: '#1f5fe0', core: '#eaf3ff', dark: '#050b22', mid: '#123c9a', text: '#9cc2ff', soft: '#3d7cf0' }
  };
  const machine = new THREE.Group(); machine.name = 'Degen City';
  let seedN = 9; const rnd = () => { seedN |= 0; seedN = seedN + 0x6D2B79F5 | 0; let t = Math.imul(seedN ^ seedN >>> 15, 1 | seedN); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(Array.isArray(c) ? c[0] : i / (stops.length - 1), Array.isArray(c) ? c[1] : c)); return gr; };
  const SANS = '"DejaVu Sans Condensed", "DejaVu Sans", Arial, sans-serif', WIDE = '"DejaVu Sans", Arial, sans-serif';
  const text = (g, s, x, y, size, color, weight = '800', font = SANS, align = 'center') => { g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
  const spaced = (g, s, x, y, size, gap, color, weight = '700', font = SANS) => { g.font = `${weight} ${size}px ${font}`; const ws = [...s].map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; g.fillStyle = color; g.textAlign = 'left'; g.textBaseline = 'middle'; [...s].forEach((ch, i) => { g.fillText(ch, cx, y); cx += ws[i] + gap; }); return total; };
  const rr = (g, x, y, w, h, r, fill, stroke, lw) => { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.lineWidth = lw || 2; g.strokeStyle = stroke; g.stroke(); } };
  const fit = (g, s, x, y, maxW, size, color, weight = '800', font = SANS, align = 'center') => { g.font = `${weight} ${size}px ${font}`; const w = g.measureText(s).width; if (w > maxW) size = Math.floor(size * maxW / w); text(g, s, x, y, size, color, weight, font, align); return size; };
  const glowText = (g, s, x, y, size, color, glow, blur = 16, weight = '900', font = SANS, align = 'center') => { g.save(); g.shadowColor = glow; g.shadowBlur = blur; text(g, s, x, y, size, color, weight, font, align); g.shadowBlur = 0; text(g, s, x, y, size, color, weight, font, align); g.restore(); };
  const std = (color, metal, rough, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, metalness: metal, roughness: rough }, extra));
  const basic = (color, extra = {}) => new THREE.MeshBasicMaterial(Object.assign({ color }, extra));
  // Letters spread along an arc (coin rims). mid = angle of the text centre (-PI/2 top, PI/2 bottom).
  function arcText(g, s, cx, cy, r, mid, size, color, weight = '900', gap = 0, bottom = false) {
    g.save(); g.font = `${weight} ${size}px ${WIDE}`; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
    const ws = [...s].map(ch => g.measureText(ch).width + gap), total = ws.reduce((a, b) => a + b, 0); let a = 0;
    [...s].forEach((ch, i) => { const off = (a + ws[i] / 2 - total / 2) / r, ang = bottom ? mid - off : mid + off; g.save(); g.translate(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r); g.rotate(bottom ? ang - Math.PI / 2 : ang + Math.PI / 2); g.fillText(ch, 0, 0); g.restore(); a += ws[i]; });
    g.restore();
  }
  // A neon tube along a polyline: coloured glow, tube, white-hot core.
  function neonLine(g, pts, side, lw = 6, close = false) {
    const p = PAL[side]; const path = () => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); };
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; g.shadowColor = p.glow; g.shadowBlur = lw * 3.2; g.strokeStyle = p.tube; g.lineWidth = lw; path(); g.stroke(); g.shadowBlur = 0; g.strokeStyle = p.core; g.lineWidth = Math.max(1, lw * .34); path(); g.stroke(); g.restore();
  }

  /* ---------- materials ---------- */
  // One shared lacquer map: near-white with a fine metal flake, multiplied by the half's colour.
  function flakeCanvas(size) {
    const c = canvas(size, size), g = c.getContext('2d'); g.fillStyle = '#f0f0f0'; g.fillRect(0, 0, size, size); // flat base: the map tiles, so no gradient
    const img = g.getImageData(0, 0, size, size), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 12 + (rnd() < .004 ? 14 : 0); d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(img, 0, 0); return c;
  }
  const flakeTex = new THREE.CanvasTexture(flakeCanvas(256)); flakeTex.colorSpace = THREE.SRGBColorSpace; flakeTex.wrapS = flakeTex.wrapT = THREE.RepeatWrapping; flakeTex.jpeg = .82;
  const pair = (mk) => [mk('L'), mk('R')];
  const BODY = pair(s => std(PAL[s].acc, .3, .34, { map: flakeTex })), PANEL = pair(s => std(s === 'L' ? '#a8420a' : '#1743a8', .3, .42, { map: flakeTex })), DEEP = pair(s => std(s === 'L' ? '#5c2204' : '#0c2468', .3, .5, { map: flakeTex }));
  const TRIM = pair(s => std(s === 'L' ? '#ff8a3a' : '#5b95ff', .55, .26)), NEON = pair(s => basic(s === 'L' ? '#ffa04a' : '#69a8ff')), NEONDIM = pair(s => basic(s === 'L' ? '#8a3a10' : '#183c8a'));
  const BULB = pair(s => [basic(s === 'L' ? '#ffe0a0' : '#e4f0ff'), basic(s === 'L' ? '#ff8a2a' : '#5b9bff'), basic(s === 'L' ? '#5a2208' : '#12307a')]);
  const chrome = std('#dde1e6', .95, .16), chromeDark = std('#8f969f', .9, .3), chromeWarm = std('#c9c2bb', .9, .22), darkStd = std('#12151c', .3, .6), dark = basic('#05070c'), rubber = std('#0b0c10', .05, .8);
  const geos = new Map(); const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k); };
  function box(w, h, d, x, y, z, m, parent = machine, r = .02) {
    const geo = cached(`b${w}|${h}|${d}|${r}`, () => { if (!r) return new THREE.BoxGeometry(w, h, d); const R = Math.min(r, w / 3, h / 3, d / 2.1), s = new THREE.Shape(), a = -w / 2 + R, b = -h / 2 + R, W = w - 2 * R, H = h - 2 * R; s.moveTo(a, b); s.lineTo(a + W, b); s.lineTo(a + W, b + H); s.lineTo(a, b + H); s.closePath(); const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * R, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: R, bevelThickness: R, curveSegments: 1 }); g.translate(0, 0, -d / 2 + R); return g; });
    const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3;
  }
  // A box cut at the seam: the part left of x=0 takes pair[0], the part right of x=0 takes pair[1].
  function sbox(w, h, d, x, y, z, pr, parent = machine, r = .02) {
    const x0 = x - w / 2, x1 = x + w / 2;
    if (x1 <= 1e-6) return [box(w, h, d, x, y, z, pr[0], parent, r)]; if (x0 >= -1e-6) return [box(w, h, d, x, y, z, pr[1], parent, r)];
    return [box(-x0, h, d, x0 / 2, y, z, pr[0], parent, r), box(x1, h, d, x1 / 2, y, z, pr[1], parent, r)];
  }
  // Cylinders are baked to their final axis so node rotations stay at identity (the room only rotates crest and lever).
  function cyl(r1, r2, h, x, y, z, m, parent = machine, seg = 28, axis = 'y') { const geo = cached(`c${r1}|${r2}|${h}|${seg}|${axis}`, () => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); if (axis === 'z') g.rotateX(Math.PI / 2); if (axis === 'x') g.rotateZ(Math.PI / 2); return g; }); const m3 = new THREE.Mesh(geo, m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function sphere(r, x, y, z, m, parent = machine, ws = 10, hs = 8) { const m3 = new THREE.Mesh(cached(`s${r}|${ws}`, () => new THREE.SphereGeometry(r, ws, hs)), m); m3.position.set(x, y, z); parent.add(m3); return m3; }
  function plane(c, w, h, x, y, z, parent = machine, transparent = false, ry = 0, q) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (!transparent) t.jpeg = q || .86; else t.webp = .8; const m = new THREE.MeshBasicMaterial({ map: t, transparent, alphaTest: transparent ? .02 : 0 }); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); if (ry) p.rotation.y = ry; parent.add(p); return p; }
  const rivet = (x, y, z, parent = machine, axis = 'z') => cyl(.02, .024, .018, x, y, z, chrome, parent, 10, axis);
  // Half ring (two coloured halves, left = Miami, right = NYC) as torus arcs, in the XY or XZ plane.
  function halfRing(R, tube, pr, x, y, z, parent = machine, plane2 = 'xy', seg = 40) {
    return [0, 1].map(i => { const geo = cached(`hr${R}|${tube}|${plane2}|${i}`, () => { const g = new THREE.TorusGeometry(R, tube, 8, seg, Math.PI); g.rotateZ(i ? -Math.PI / 2 : Math.PI / 2); if (plane2 === 'xz') g.rotateX(Math.PI / 2); return g; }); const m3 = new THREE.Mesh(geo, pr[i]); m3.position.set(x, y, z); parent.add(m3); return m3; });
  }

  /* ---------- drawing parts ---------- */
  // Palm tree silhouette: tapering curved trunk, ringed, with drooping fronds that have leaflets.
  function palm(g, x, base, h, lean, sc, col) {
    const cx = x + lean, cy = base - h; g.save(); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round';
    const w0 = 11 * sc, w1 = 5 * sc, bx = x + lean * .15, by = base - h * .55;
    g.beginPath(); g.moveTo(x - w0, base); g.quadraticCurveTo(bx - w0 * .7, by, cx - w1, cy); g.lineTo(cx + w1, cy); g.quadraticCurveTo(bx + w0 * .7, by, x + w0, base); g.closePath(); g.fill();
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI * (.04 + .92 * i / (n - 1)) - (rnd() - .5) * .12, len = sc * (96 + rnd() * 46), droop = .5 + .5 * Math.abs(Math.cos(a)) + rnd() * .15, dx = Math.cos(a), dy = Math.sin(a);
      g.lineWidth = 3.4 * sc; g.beginPath(); g.moveTo(cx, cy); const pts = [];
      for (let k = 0; k <= 16; k++) { const t = k / 16, px = cx + dx * len * t, py = cy + dy * len * t + droop * len * t * t; pts.push([px, py, t]); g.lineTo(px, py); } g.stroke();
      for (let k = 2; k < pts.length; k++) {
        const [px, py, t] = pts[k], [qx, qy] = pts[k - 1], tx = px - qx, ty = py - qy, tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl, L = sc * 34 * (1 - t * .6);
        for (const s of [-1, 1]) { g.lineWidth = 2.4 * sc * (1 - t * .4); g.beginPath(); g.moveTo(px, py); g.lineTo(px + (nx * s * .75 + tx / tl * .55) * L, py + (ny * s * .75 + ty / tl * .55) * L + L * .45); g.stroke(); }
      }
    }
    g.beginPath(); g.arc(cx, cy + 2 * sc, 7 * sc, 0, 7); g.fill(); g.restore();
  }
  // Generic skyline: stepped towers, spires, a domed cap and a water tank, with lit windows.
  function skyline(g, x0, x1, base, hmin, hmax, body, winCol, litP, kinds = true) {
    let x = x0; while (x < x1) {
      const w = 26 + rnd() * 44, h = hmin + rnd() * (hmax - hmin), k = rnd(); g.fillStyle = body;
      if (kinds && k < .18) { g.fillRect(x, base - h, w, h); g.fillRect(x + w * .14, base - h - h * .18, w * .72, h * .18 + 1); g.fillRect(x + w * .3, base - h - h * .3, w * .4, h * .13 + 1); g.fillRect(x + w * .46, base - h - h * .52, 3, h * .24); }
      else if (kinds && k < .3) { g.fillRect(x, base - h, w, h); g.beginPath(); g.moveTo(x, base - h); g.lineTo(x + w / 2, base - h - w * .45); g.lineTo(x + w, base - h); g.fill(); }
      else if (kinds && k < .38) { g.fillRect(x, base - h, w, h); g.beginPath(); g.arc(x + w / 2, base - h, w / 2, Math.PI, 0); g.fill(); }
      else if (kinds && k < .46) { g.fillRect(x, base - h, w, h); g.fillRect(x + w * .2, base - h - 10, w * .6, 10); g.fillRect(x + w * .3, base - h - 24, w * .4, 14); g.fillRect(x + w * .38, base - h - 30, 3, 8); }
      else g.fillRect(x, base - h, w, h);
      const cols = Math.max(1, Math.floor((w - 8) / 9)), rows = Math.floor((h - 10) / 12);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (rnd() < litP) { g.fillStyle = winCol[Math.floor(rnd() * winCol.length)]; g.fillRect(x + 5 + c * 9, base - h + 8 + r * 12, 4, 6); }
      x += w + (rnd() < .5 ? 0 : 3 + rnd() * 6);
    }
  }
  // Brick wall + lit window grid with a fire-escape: the NYC side panel. (Abstract shapes only.)
  function nycPanel(w, h, tall) {
    const c = canvas(w, h), g = c.getContext('2d'); seedN = tall ? 301 : 302;
    g.fillStyle = lin(g, 0, 0, 0, h, ['#050b1f', '#0a1c52', '#10337f', '#1f5fe0']); g.fillRect(0, 0, w, h);
    // brick courses
    const bw = 34, bh = 15; for (let r = 0; r * bh < h; r++) for (let q = -1; q * bw < w; q++) { const x = q * bw + (r % 2 ? bw / 2 : 0), y = r * bh, lum = rnd(); g.fillStyle = `rgba(${6 + lum * 14},${14 + lum * 26},${60 + lum * 60},.5)`; g.fillRect(x + 1.5, y + 1.5, bw - 3, bh - 3); }
    g.strokeStyle = 'rgba(2,6,24,.55)'; g.lineWidth = 2; for (let r = 0; r * bh < h; r++) { g.beginPath(); g.moveTo(0, r * bh); g.lineTo(w, r * bh); g.stroke(); }
    // windows: columns of tall panes, some lit
    const ww = 46, wh = 70, cols = 4, gx = (w - 72 - cols * ww) / (cols - 1), rows = Math.floor((h - 150) / (wh + 38));
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const x = 36 + q * (ww + gx), y = 78 + r * (wh + 38), lit = rnd() < .5, warm = rnd() < .25;
      g.fillStyle = '#030716'; g.fillRect(x - 6, y - 6, ww + 12, wh + 12);
      const gr = lin(g, 0, y, 0, y + wh, lit ? (warm ? ['#fff0c2', '#ffc875'] : ['#e8f2ff', '#8fbaff']) : ['#0a1b4a', '#061030']);
      g.fillStyle = gr; g.fillRect(x, y, ww, wh); g.fillStyle = 'rgba(2,6,24,.9)'; g.fillRect(x + ww / 2 - 1.5, y, 3, wh); g.fillRect(x, y + wh * .45, ww, 3);
      g.fillStyle = 'rgba(160,200,255,.55)'; g.fillRect(x - 8, y + wh + 6, ww + 16, 5);
      if (lit) { g.save(); g.shadowColor = warm ? '#ffc875' : '#8fbaff'; g.shadowBlur = 18; g.strokeStyle = 'rgba(255,255,255,.0)'; g.strokeRect(x, y, ww, wh); g.restore(); }
    }
    // fire escape: platforms, rails, zig-zag stairs and a drop ladder, in dark iron with a blue edge light
    const ix = w * .52, iw = w - ix - 22; const iron = '#02050f', edge = 'rgba(110,170,255,.55)';
    const platforms = []; for (let y = 140; y < h - 90; y += tall ? 250 : 220) platforms.push(y);
    const stroke = (col, lw, f) => { g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'butt'; f(); };
    stroke(iron, 9, () => { platforms.forEach(py => { g.beginPath(); g.moveTo(ix, py); g.lineTo(ix + iw, py); g.stroke(); }); });
    stroke(iron, 4, () => { platforms.forEach(py => { for (let x = ix; x <= ix + iw + .1; x += 16) { g.beginPath(); g.moveTo(x, py - 46); g.lineTo(x, py); g.stroke(); } g.beginPath(); g.moveTo(ix, py - 46); g.lineTo(ix + iw, py - 46); g.stroke(); }); });
    platforms.forEach((py, i) => { if (i === platforms.length - 1) return; const ny = platforms[i + 1], dir = i % 2 ? 1 : -1, sx = dir > 0 ? ix + 8 : ix + iw - 8, ex = dir > 0 ? ix + iw - 8 : ix + 8; stroke(iron, 7, () => { g.beginPath(); g.moveTo(sx, py); g.lineTo(ex, ny); g.stroke(); }); stroke(iron, 3, () => { for (let k = 1; k < 9; k++) { const t = k / 9; g.beginPath(); g.moveTo(sx + (ex - sx) * t, py + (ny - py) * t); g.lineTo(sx + (ex - sx) * t, py + (ny - py) * t - 40 + 40 * t * 0); g.stroke(); } }); });
    const ly = platforms[platforms.length - 1]; stroke(iron, 5, () => { for (const lx of [ix + iw - 36, ix + iw - 12]) { g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx, h - 30); g.stroke(); } for (let y = ly + 12; y < h - 30; y += 16) { g.beginPath(); g.moveTo(ix + iw - 36, y); g.lineTo(ix + iw - 12, y); g.stroke(); } });
    stroke(edge, 1.5, () => { platforms.forEach(py => { g.beginPath(); g.moveTo(ix, py - 4); g.lineTo(ix + iw, py - 4); g.stroke(); }); });
    // roof line / water tank on the tall panel
    if (tall) { g.fillStyle = '#02050f'; g.fillRect(w * .18, 34, w * .34, 8); g.beginPath(); g.moveTo(w * .22, 34); g.lineTo(w * .22, 8); g.moveTo(w * .48, 34); g.lineTo(w * .48, 8); g.lineWidth = 5; g.strokeStyle = '#02050f'; g.stroke(); g.fillRect(w * .2, -4, w * .3, 24); g.beginPath(); g.moveTo(w * .2, -4); g.lineTo(w * .35, -34); g.lineTo(w * .5, -4); g.fill(); }
    // blue neon frame strips
    const m = 14; neonLine(g, [[m, m], [w - m, m], [w - m, h - m], [m, h - m]], 'R', 7, true); neonLine(g, [[m + 22, h * .5 - 2], [w - m - 22, h * .5 - 2]], 'R', 5);
    g.fillStyle = lin(g, 0, 0, 0, h, ['rgba(0,0,0,.35)', 'rgba(0,0,0,0)', 'rgba(0,0,0,.25)']); g.fillRect(0, 0, w, h);
    return c;
  }
  // Miami street: a sunset glow behind art-deco stripes, palm-frond cut-outs and orange neon strips.
  function miamiPanel(w, h, tall) {
    const c = canvas(w, h), g = c.getContext('2d'); seedN = tall ? 401 : 402;
    g.fillStyle = lin(g, 0, 0, 0, h, [[0, '#1c0820'], [.3, '#6b1630'], [.62, '#e8590c'], [1, '#ffb347']]); g.fillRect(0, 0, w, h);
    // sun with retro cut-lines
    const sy = h * (tall ? .6 : .52), sr = w * .34; { const t = canvas(w, h), tg = t.getContext('2d'); tg.fillStyle = lin(tg, 0, sy - sr, 0, sy + sr, ['#fff3b0', '#ffc03a', '#ff6a2a', '#ff3f7a']); tg.beginPath(); tg.arc(w / 2, sy, sr, 0, 7); tg.fill(); tg.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 7; i++) { const y = sy + sr * (.1 + i * .13), th = 3 + i * 2.4; tg.fillRect(0, y, w, th); } g.drawImage(t, 0, 0); }
    // art-deco stripe bands (cream, pink, teal) with rounded ends
    const deco = (y, th) => { [['#ffe6bd', 0], ['#ff5fa2', 1.7], ['#2fd4c0', 3.4]].forEach(([col, k]) => { rr(g, 12, y + k * th, w - 24, th, th / 2, col); }); };
    deco(h * .045, 7); deco(h - h * .135, 8);
    // orange neon strips: frame + two rails
    const m = 14; neonLine(g, [[m, m], [w - m, m], [w - m, h - m], [m, h - m]], 'L', 7, true); neonLine(g, [[m + 20, h * .2], [w - m - 20, h * .2]], 'L', 5); neonLine(g, [[m + 20, h * .76], [w - m - 20, h * .76]], 'L', 5);
    // sea strip glints on the lower panel
    if (!tall) { for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(255,236,170,${.2 + rnd() * .3})`; const y = h * .62 + i * 8, ww = 30 + rnd() * 80; g.fillRect(w / 2 - ww / 2 + (rnd() - .5) * 20, y, ww, 2.5); } }
    // palm cut-outs (dark metal silhouettes against the glow)
    const col = '#12040f'; if (tall) { palm(g, w * .3, h + 10, h * .72, 38, 1.15, col); palm(g, w * .82, h + 10, h * .34, -26, .72, col); } else { palm(g, w * .18, h + 6, h * .55, 30, .86, col); palm(g, w * .84, h + 6, h * .4, -26, .7, col); }
    g.fillStyle = lin(g, 0, 0, 0, h, ['rgba(0,0,0,.3)', 'rgba(0,0,0,0)', 'rgba(0,0,0,.18)']); g.fillRect(0, 0, w, h);
    return c;
  }

  /* ---------- the coin faces (drawn upright; rotated into the cylinder cap's UV frame by coinFace) ---------- */
  function coinFace(draw, S) {
    const c = canvas(S, S), g = c.getContext('2d'); g.fillStyle = '#222'; g.fillRect(0, 0, S, S);
    g.save(); g.translate(S / 2, S / 2); g.rotate(-Math.PI / 2); g.translate(-S / 2, -S / 2); // cap UVs: canvas left = world up, canvas top = world right
    g.save(); g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 7); g.clip(); draw(g, S); g.restore(); g.restore(); return c;
  }
  function miamiCoin(g, S) {
    seedN = 77; const hz = S * .6;
    g.fillStyle = lin(g, 0, 0, 0, hz, [[0, '#17093f'], [.3, '#5a1a72'], [.58, '#c42f6c'], [.82, '#ff6a2a'], [1, '#ffb347']]); g.fillRect(0, 0, S, S);
    // sun with retro cuts
    { const t = canvas(S, S), tg = t.getContext('2d'), sy = hz - S * .02, sr = S * .24; tg.fillStyle = lin(tg, 0, sy - sr, 0, sy + sr, ['#fff6bd', '#ffd04a', '#ff8a2e', '#ff4d7e']); tg.beginPath(); tg.arc(S / 2, sy, sr, 0, 7); tg.fill(); tg.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 7; i++) tg.fillRect(0, sy + sr * (.05 + i * .13), S, 2.5 + i * 2.2); g.drawImage(t, 0, 0); }
    // streak clouds
    for (let i = 0; i < 6; i++) { const y = S * (.18 + i * .07), x = rnd() * S * .6 + S * .1, w = S * (.22 + rnd() * .3); g.fillStyle = `rgba(${i < 3 ? '255,120,150' : '255,170,90'},${.18 + rnd() * .18})`; g.beginPath(); g.ellipse(x + w / 2, y, w / 2, 4 + rnd() * 3, 0, 0, 7); g.fill(); }
    // sea
    g.fillStyle = lin(g, 0, hz, 0, S, ['#3a1255', '#1b1c5c', '#0a1840', '#07102e']); g.fillRect(0, hz, S, S - hz);
    for (let i = 0; i < 22; i++) { const t = i / 21, y = hz + 4 + t * (S - hz) * .9, w = S * (.06 + t * .26) * (.6 + rnd() * .6); g.fillStyle = `rgba(255,${200 - t * 90},${100 - t * 50},${.65 - t * .35})`; g.fillRect(S / 2 - w / 2 + (rnd() - .5) * S * .04, y, w, 2 + t * 4); }
    for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(255,170,200,${.12 + rnd() * .2})`; g.fillRect(rnd() * S, hz + 8 + rnd() * (S - hz), 14 + rnd() * 50, 2); }
    // palms + dunes
    const col = '#0a0418'; palm(g, S * .17, S * .96, S * .52, S * .08, 1.35, col); palm(g, S * .86, S * .98, S * .4, -S * .07, 1.1, col); palm(g, S * .3, S * 1.0, S * .26, S * .03, .8, col);
    g.fillStyle = col; g.beginPath(); g.moveTo(0, S * .93); g.quadraticCurveTo(S * .22, S * .86, S * .42, S * .98); g.lineTo(S * .42, S); g.lineTo(0, S); g.fill(); g.beginPath(); g.moveTo(S, S * .94); g.quadraticCurveTo(S * .78, S * .88, S * .6, S * 1.0); g.lineTo(S, S); g.fill();
    // ring + arc text
    g.lineWidth = 4; g.strokeStyle = 'rgba(255,225,170,.85)'; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 16, 0, 7); g.stroke(); g.lineWidth = 1.5; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 26, 0, 7); g.stroke();
    g.save(); g.shadowColor = '#ff5a00'; g.shadowBlur = 12; arcText(g, 'MIAMI', S / 2, S / 2, S / 2 - 56, -Math.PI / 2, S * .062, '#fff1d0', '900', S * .02); g.restore();
    g.fillStyle = 'rgba(255,225,170,.9)'; for (const a of [-Math.PI / 2 - .56, -Math.PI / 2 + .56]) { g.beginPath(); g.arc(S / 2 + Math.cos(a) * (S / 2 - 56), S / 2 + Math.sin(a) * (S / 2 - 56), 4, 0, 7); g.fill(); }
  }
  function nycCoin(g, S) {
    seedN = 88; const hz = S * .66;
    g.fillStyle = lin(g, 0, 0, 0, hz, [[0, '#040918'], [.45, '#0a1c52'], [.8, '#1c4aa8'], [1, '#4c8ae8']]); g.fillRect(0, 0, S, S);
    for (let i = 0; i < 90; i++) { const a = .3 + rnd() * .7; g.fillStyle = `rgba(220,235,255,${a * .8})`; g.beginPath(); g.arc(rnd() * S, rnd() * S * .5, .8 + rnd() * 1.6, 0, 7); g.fill(); }
    // moon with soft halo
    { const mx = S * .72, my = S * .26, mr = S * .075; const gl = g.createRadialGradient(mx, my, mr * .6, mx, my, mr * 4); gl.addColorStop(0, 'rgba(190,215,255,.45)'); gl.addColorStop(1, 'rgba(190,215,255,0)'); g.fillStyle = gl; g.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8); g.fillStyle = '#e8f1ff'; g.beginPath(); g.arc(mx, my, mr, 0, 7); g.fill(); g.fillStyle = 'rgba(150,180,230,.5)'; for (const [dx, dy, r] of [[-.3, -.2, .22], [.25, .15, .17], [-.1, .35, .12]]) { g.beginPath(); g.arc(mx + dx * mr, my + dy * mr, r * mr, 0, 7); g.fill(); } }
    // two skyline layers: far haze, near dark with lit windows; one stepped tower with a spire as the centrepiece
    skyline(g, -10, S + 10, hz, S * .06, S * .24, '#143070', ['#7fa6ff', '#cfe0ff'], .08, false);
    skyline(g, -20, S + 20, hz + 2, S * .09, S * .36, '#060e2a', ['#ffe9ae', '#cfe0ff', '#ffc875', '#8fbaff'], .42);
    { const tx = S * .38, tw = S * .11, th = S * .38, base = hz + 2; g.fillStyle = '#040a20'; g.fillRect(tx, base - th, tw, th); g.fillRect(tx + tw * .12, base - th - S * .06, tw * .76, S * .06 + 1); g.fillRect(tx + tw * .26, base - th - S * .11, tw * .48, S * .05 + 1); g.fillRect(tx + tw * .38, base - th - S * .17, tw * .24, S * .06 + 1); g.fillRect(tx + tw * .48, base - th - S * .27, 3, S * .1);
      for (let r = 0; r < 28; r++) for (let q = 0; q < 6; q++) if (rnd() < .5) { g.fillStyle = rnd() < .7 ? '#ffe9ae' : '#cfe0ff'; g.fillRect(tx + 4 + q * (tw - 8) / 6, base - th + 6 + r * 11, 4, 6); }
      g.save(); g.shadowColor = '#ff4040'; g.shadowBlur = 12; g.fillStyle = '#ff6060'; g.beginPath(); g.arc(tx + tw * .5 + 1.5, base - th - S * .27, 3.5, 0, 7); g.fill(); g.restore(); }
    // water with lit reflections
    g.fillStyle = lin(g, 0, hz, 0, S, ['#0b1a4a', '#060f30', '#040a22']); g.fillRect(0, hz, S, S - hz);
    for (let i = 0; i < 70; i++) { const x = rnd() * S, y = hz + 6 + rnd() * (S - hz) * .8, l = 8 + rnd() * 26; g.fillStyle = `rgba(${rnd() < .5 ? '255,226,160' : '150,190,255'},${.18 + rnd() * .3})`; g.fillRect(x, y, 2 + rnd() * 2, l * .5); }
    for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(180,210,255,${.1 + rnd() * .12})`; g.fillRect(rnd() * S, hz + 10 + rnd() * (S - hz) * .85, 20 + rnd() * 60, 2); }
    g.fillStyle = '#02050f'; g.beginPath(); g.moveTo(0, S * .96); g.lineTo(S * .3, S * .92); g.lineTo(S * .7, S * .97); g.lineTo(S, S * .93); g.lineTo(S, S); g.lineTo(0, S); g.fill();
    g.lineWidth = 4; g.strokeStyle = 'rgba(190,215,255,.85)'; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 16, 0, 7); g.stroke(); g.lineWidth = 1.5; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 26, 0, 7); g.stroke();
    g.save(); g.shadowColor = '#4b8dff'; g.shadowBlur = 12; arcText(g, 'NEW YORK', S / 2, S / 2, S / 2 - 56, -Math.PI / 2, S * .06, '#eaf3ff', '900', S * .014); g.restore();
    g.fillStyle = 'rgba(190,215,255,.9)'; for (const a of [-Math.PI / 2 - .74, -Math.PI / 2 + .74]) { g.beginPath(); g.arc(S / 2 + Math.cos(a) * (S / 2 - 56), S / 2 + Math.sin(a) * (S / 2 - 56), 4, 0, 7); g.fill(); }
  }

  /* ---------- plinth: a deep lacquer foot with a split neon kick strip ---------- */
  sbox(2.62, .2, 1.42, 0, .145, 0, DEEP, machine, .03); box(2.64, .03, 1.44, 0, .26, 0, chromeDark, machine, 0);
  sbox(2.5, .016, .012, 0, .1, .717, NEON, machine, 0); sbox(2.5, .016, .012, 0, .1, -.717, NEON, machine, 0);
  for (const sx of [-1, 1]) box(.012, .016, 1.3, sx * 1.317, .1, 0, NEON[sx < 0 ? 0 : 1], machine, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { box(.12, .05, .12, sx * 1.27, .04, sz * .67, chromeDark, machine, .01); }

  /* ---------- lower body: split lacquer, trim posts, neon edge lines, the door and the ticket slot ---------- */
  sbox(2.3, 1.62, 1.12, 0, 1.06, 0, BODY, machine, .02);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const k = sx < 0 ? 0 : 1; box(.1, 1.62, .1, sx * 1.15, 1.06, sz * .56, TRIM[k], machine, .015);
    box(.014, 1.34, .012, sx * 1.085, 1.06, sz * .568, NEON[k], machine, 0);
    for (const y of [.32, 1.8]) box(.13, .05, .13, sx * 1.15, y, sz * .56, chrome, machine, .01);
  }
  sbox(2.34, .08, .06, 0, 1.84, .575, TRIM, machine, .008); sbox(2.34, .08, .06, 0, .3, .575, TRIM, machine, .008);
  sbox(2.1, .014, .02, 0, 1.78, .578, NEON, machine, 0); sbox(2.1, .014, .02, 0, .36, .578, NEON, machine, 0);
  for (let k = 0; k < 5; k++) for (const sx of [-1, 1]) { rivet(sx * (.2 + k * .22), 1.84, .608); rivet(sx * (.2 + k * .22), .3, .608); }
  // Lower door plate: split halves, the promise in two city colours, a chrome medallion with the Xtrata mark (XLOGO vector code, never redrawn).
  const door = canvas(1150, 640), dg = door.getContext('2d');
  for (const s of [0, 1]) {
    const p = PAL[s ? 'R' : 'L'], x0 = s ? 575 : 0; dg.save(); dg.beginPath(); dg.rect(x0, 0, 575, 640); dg.clip();
    dg.fillStyle = lin(dg, 0, 0, 0, 640, [p.dark, s ? '#08163f' : '#3a1404', p.dark]); dg.fillRect(x0, 0, 575, 640);
    dg.lineWidth = 2; for (let i = 0; i < 15; i++) { // Miami: sunburst rays from the foot of the plate; NYC: a skyline of tall slabs
      if (!s) { const a = Math.PI + (i + .5) / 15 * Math.PI; dg.strokeStyle = `rgba(255,140,40,${.07 + (i % 2) * .05})`; dg.beginPath(); dg.moveTo(575, 640); dg.lineTo(575 + Math.cos(a) * 900, 640 + Math.sin(a) * 900); dg.stroke(); }
    }
    if (s) { seedN = 55; let x = 575; while (x < 1150) { const w = 24 + rnd() * 34, h = 90 + rnd() * 190; dg.fillStyle = `rgba(60,110,255,${.09 + rnd() * .07})`; dg.fillRect(x, 640 - h, w, h); x += w + 4; } }
    dg.restore();
  }
  rr(dg, 26, 26, 1098, 588, 16, null, '#0a0d14', 14); rr(dg, 36, 36, 1078, 568, 11, null, '#c6ccd4', 3); rr(dg, 62, 62, 1026, 516, 8, null, 'rgba(255,255,255,.14)', 2);
  dg.fillStyle = lin(dg, 0, 40, 0, 600, ['#e6eaee', '#8b929b', '#e6eaee']); dg.fillRect(571, 40, 8, 560); // painted chrome seam
  // medallion for the Xtrata mark
  dg.save(); dg.shadowColor = '#000'; dg.shadowBlur = 24; dg.fillStyle = lin(dg, 0, 80, 0, 360, ['#f4f6f8', '#7e858e', '#e9edf1']); dg.beginPath(); dg.arc(575, 218, 150, 0, 7); dg.fill(); dg.restore();
  dg.fillStyle = '#0a0d17'; dg.beginPath(); dg.arc(575, 218, 132, 0, 7); dg.fill(); dg.lineWidth = 3; dg.strokeStyle = 'rgba(255,255,255,.25)'; dg.beginPath(); dg.arc(575, 218, 126, 0, 7); dg.stroke();
  dg.save(); dg.shadowColor = '#000'; dg.shadowBlur = 16; xtrataLogo(dg, 575, 218, 218); dg.restore();
  for (const [a, k] of [[Math.PI, 'L'], [0, 'R']]) { dg.fillStyle = PAL[k].tube; for (let i = 0; i < 3; i++) { dg.beginPath(); dg.arc(575 + Math.cos(a) * (190 + i * 26), 218, 6 - i, 0, 7); dg.fill(); } }
  { // MIAMI DEGENS · NYC DEGENS on one line, split at the seam; FOREVER ON STACKS beneath
    dg.font = `900 76px ${SANS}`; const half = Math.min(dg.measureText('MIAMI DEGENS').width, dg.measureText('NYC DEGENS').width), maxW = 470, sz = Math.min(76, Math.floor(76 * maxW / Math.max(dg.measureText('MIAMI DEGENS').width, dg.measureText('NYC DEGENS').width)));
    glowText(dg, 'MIAMI DEGENS', 540, 448, sz, '#ffd2a0', PAL.L.glow, 20, '900', SANS, 'right'); glowText(dg, 'NYC DEGENS', 610, 448, sz, '#d6e6ff', PAL.R.glow, 20, '900', SANS, 'left');
    dg.fillStyle = '#fff'; dg.beginPath(); dg.arc(575, 448, 7, 0, 7); dg.fill();
    rr(dg, 250, 494, 650, 62, 31, '#0a0d17', 'rgba(255,255,255,.55)', 2.5); spaced(dg, 'FOREVER ON STACKS', 575, 525, 36, 10, '#f1f3f6', '900');
    spaced(dg, 'PARALLAX CASINO', 575, 596, 15, 6, 'rgba(255,255,255,.55)', '700');
  }
  plane(door, 1.72, .96, 0, .93, .572, machine, false, 0, .88);
  box(1.86, .07, .05, 0, 1.43, .585, chrome, machine, .008); box(1.86, .07, .05, 0, .43, .585, chrome, machine, .008); box(.07, 1.07, .05, -.895, .93, .585, chrome, machine, .008); box(.07, 1.07, .05, .895, .93, .585, chrome, machine, .008);
  for (const [x, y] of [[-.895, 1.43], [.895, 1.43], [-.895, .43], [.895, .43]]) rivet(x, y, .615);
  box(.05, .125, .04, 0, .3325, .59, chrome, machine, .006); box(.05, .375, .04, 0, 1.6525, .59, chrome, machine, .006); // seam, below and above the door
  // Souvenir ticket slot: chrome housing, dark mouth with a neon lip on the Miami side, label below.
  box(.62, .1, .06, -.62, 1.66, .59, chrome, machine, .01); box(.48, .026, .02, -.62, 1.66, .625, dark, machine, 0); box(.48, .008, .02, -.62, 1.646, .626, NEON[0], machine, 0);
  { const tk = canvas(256, 64), tg = tk.getContext('2d'); tg.fillStyle = '#130a05'; tg.fillRect(0, 0, 256, 64); rr(tg, 3, 3, 250, 58, 6, null, 'rgba(255,138,42,.6)', 2); spaced(tg, 'TICKET', 128, 33, 30, 8, PAL.L.text, '800'); plane(tk, .3, .075, -.62, 1.575, .567); }
  // Flank panels (street art, original abstract shapes): Miami left, NYC right.
  function flank(side, tex, w, h, y, zc, q) {
    const x = side * 1.1525; plane(tex, w, h, x, y, zc, machine, false, side * Math.PI / 2, q); const fx = side * 1.158;
    for (const sy of [-1, 1]) box(.02, .035, w + .05, fx, y + sy * (h / 2 + .0175), zc, chrome, machine, .006);
    for (const sz of [-1, 1]) box(.02, h, .035, fx, y, zc + sz * (w / 2 + .0175), chrome, machine, .006);
  }
  flank(-1, miamiPanel(576, 806, false), .96, 1.344, 1.06, 0, .85); flank(1, nycPanel(576, 806, false), .96, 1.344, 1.06, 0, .85);

  /* ---------- deck: a tilted slab, split, with DRIVE in the middle ---------- */
  const deck = new THREE.Group(); deck.position.set(0, 1.92, .66); deck.rotation.x = -.72; machine.add(deck);
  sbox(2.32, .56, .16, 0, 0, 0, PANEL, deck, .02); box(2.26, .5, .02, 0, 0, .09, darkStd, deck, 0);
  sbox(2.34, .045, .17, 0, .29, 0, TRIM, deck, 0); sbox(2.34, .045, .17, 0, -.29, 0, TRIM, deck, 0);
  sbox(2.2, .01, .02, 0, .262, .092, NEON, deck, 0); sbox(2.2, .01, .02, 0, -.262, .092, NEON, deck, 0);
  box(.03, .4, .045, 0, .05, .1, chrome, deck, 0); box(.04, .56, .18, 0, 0, 0, chrome, deck, 0);
  function label(t, side, w, h, size) {
    const p = PAL[side], c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, h, [p.mid, p.dark]); g.fillRect(0, 0, w, h); rr(g, 8, 8, w - 16, h - 16, 14, null, p.tube, 5);
    g.save(); g.shadowColor = p.glow; g.shadowBlur = 14; fit(g, t, w / 2, h / 2 + 3, w - 56, size, p.core, '900', SANS); g.restore(); fit(g, t, w / 2, h / 2 + 3, w - 56, size, p.core, '900', SANS); return c;
  }
  function button(title, x, w, action) {
    const side = x < 0 ? 'L' : 'R', k = x < 0 ? 0 : 1;
    const base = box(w, .22, .07, x, -.02, .13, chromeDark, deck, .025), top = box(w - .03, .2, .065, x, -.02, .18, std(PAL[side].acc, .3, .4), deck, .025);
    const face = plane(label(title, side, 400, 160, 56), w - .06, .17, x, -.02, .216, deck);
    [base, top, face].forEach(m => { m.userData.action = action; }); return top;
  }
  button('RATES', -.95, .34, 'pays'); button('−STAKE', -.57, .32, 'betDown'); button('+STAKE', .57, .32, 'betUp'); button('AUTO-PILOT', .95, .34, 'auto');
  { const cap = canvas(1024, 64), cg = cap.getContext('2d'); const items = [['PAYS', -.95, 'L'], ['BET −', -.57, 'L'], ['SPIN', 0, 'W'], ['BET +', .57, 'R'], ['AUTO', .95, 'R']]; items.forEach(([t, x, k]) => spaced(cg, t, 512 + x * (1024 / 2.2), 32, 26, 5, k === 'W' ? '#e8ecf1' : PAL[k].text, '800')); plane(cap, 2.2, .1, 0, -.225, .102, deck, true); }
  // DRIVE: the big round spin button. Its cap is spinPhysical; the casino presses it in along z.
  const DY = .03, ring = cyl(.225, .225, .07, 0, DY, .13, chromeDark, deck, 40, 'z'); ring.userData.action = 'spin';
  halfRing(.205, .012, NEON, 0, DY, .168, deck, 'xy', 40).forEach(m => { m.userData.action = 'spin'; });
  const cap = cyl(.18, .18, .07, 0, DY, .19, std('#c9ced6', .55, .3), deck, 40, 'z'); cap.userData.action = 'spin'; cap.userData.role = 'spinPhysical';
  const capFace = canvas(256, 256), cf = capFace.getContext('2d'); {
    cf.save(); cf.beginPath(); cf.arc(128, 128, 126, 0, 7); cf.clip();
    cf.fillStyle = lin(cf, 0, 0, 0, 256, ['#ffb347', '#ff6a1e', '#c24200']); cf.fillRect(0, 0, 128, 256); cf.fillStyle = lin(cf, 0, 0, 0, 256, ['#7db0ff', '#2f78ff', '#123c9a']); cf.fillRect(128, 0, 128, 256);
    cf.fillStyle = 'rgba(255,255,255,.18)'; cf.beginPath(); cf.ellipse(128, 60, 100, 52, 0, 0, 7); cf.fill(); cf.restore();
    cf.fillStyle = lin(cf, 0, 0, 0, 256, ['#ffffff', '#9aa2ab', '#ffffff']); cf.fillRect(125, 4, 6, 248); cf.lineWidth = 8; cf.strokeStyle = 'rgba(10,12,20,.55)'; cf.beginPath(); cf.arc(128, 128, 116, 0, 7); cf.stroke();
    cf.save(); cf.shadowColor = '#000'; cf.shadowBlur = 8; cf.shadowOffsetY = 3; text(cf, 'DRIVE', 128, 130, 52, '#ffffff', '900', SANS); cf.restore();
  }
  const capLabel = plane(capFace, .36, .36, 0, 0, .036, cap, true); capLabel.userData.action = 'spin';

  /* ---------- upper body: split lacquer, a stepped bezel (orange left, blue right) round the screen ---------- */
  sbox(2.3, 2.16, 1.0, 0, 2.95, -.05, BODY, machine, .02);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const k = sx < 0 ? 0 : 1, zc = sz > 0 ? .45 : -.55; box(.1, 2.16, .1, sx * 1.15, 2.95, zc, TRIM[k], machine, .015);
    box(.014, 1.8, .012, sx * 1.085, 2.95, zc + sz * .008, NEON[k], machine, 0);
    for (const y of [1.9, 4.0]) box(.13, .05, .13, sx * 1.15, y, zc, chrome, machine, .01);
  }
  flank(-1, miamiPanel(504, 1008, true), .84, 1.68, 2.97, -.05, .85); flank(1, nycPanel(504, 1008, true), .84, 1.68, 2.97, -.05, .85);
  sbox(2.2, 1.84, .05, 0, 2.95, .455, PANEL, machine, .01);
  sbox(2.26, .15, .06, 0, 2.95 + .785, .465, TRIM, machine, .01); sbox(2.26, .15, .06, 0, 2.95 - .785, .465, TRIM, machine, .01);
  for (const sx of [-1, 1]) box(.11, 1.42, .06, sx * 1.075, 2.95, .465, TRIM[sx < 0 ? 0 : 1], machine, .01);
  box(2.02, 1.4, .03, 0, 2.95, .505, dark, machine, 0);
  box(2.08, .03, .04, 0, 2.95 + .695, .51, chrome, machine, .004); box(2.08, .03, .04, 0, 2.95 - .695, .51, chrome, machine, .004);
  for (const sx of [-1, 1]) box(.03, 1.42, .04, sx * 1.005, 2.95, .51, chrome, machine, .004);
  for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { rivet(sx * 1.075, 2.95 + sy * .78, .5); rivet(sx * 1.075, 2.95 + sy * .66, .5); }
  // (no chrome seam over the bezel: nothing sits in front of the screen)
  sbox(2.0, .014, .012, 0, 3.92, .5, NEON, machine, 0); sbox(2.0, .014, .012, 0, 2.0, .5, NEON, machine, 0);
  const shot = (opts && opts.screenImage) || (() => { // idle screen: the two cities and a start line (the game draws the live race)
    const c = canvas(700, 480), g = c.getContext('2d'); g.fillStyle = '#05070f'; g.fillRect(0, 0, 350, 480); g.fillStyle = lin(g, 0, 0, 350, 0, ['#2a1004', '#0a0502']); g.fillRect(0, 0, 350, 480); g.fillStyle = lin(g, 350, 0, 700, 0, ['#050a22', '#0a1a4e']); g.fillRect(350, 0, 350, 480);
    g.save(); g.shadowColor = PAL.L.glow; g.shadowBlur = 24; text(g, 'DEGEN', 335, 205, 82, '#ff9a4a', '900', SANS, 'right'); g.shadowColor = PAL.R.glow; text(g, 'CITY', 365, 205, 82, '#7fb0ff', '900', SANS, 'left'); g.restore();
    spaced(g, 'MIAMI  VS  NEW YORK', 350, 282, 18, 6, '#c8c0b8'); spaced(g, 'DRIVE TO START', 350, 336, 14, 5, '#8a8f9c'); g.fillStyle = '#d6dae0'; g.fillRect(348, 0, 4, 480); return c; })();
  const screenMesh = plane(shot, 1.98, 1.36, 0, 2.95, .5215); screenMesh.userData.role = 'screenMesh';

  /* ---------- marquee: DEGEN CITY in neon over the LEADERBOARD bar ---------- */
  sbox(2.5, .74, 1.08, 0, 4.42, -.05, BODY, machine, .02);
  sbox(2.54, .06, 1.12, 0, 4.07, -.05, TRIM, machine, .008); sbox(2.54, .06, 1.12, 0, 4.77, -.05, TRIM, machine, .008);
  box(2.56, .014, 1.14, 0, 4.108, -.05, chrome, machine, 0); box(2.56, .014, 1.14, 0, 4.732, -.05, chrome, machine, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { box(.08, .74, .08, sx * 1.25, 4.42, sz > 0 ? .49 : -.59, TRIM[sx < 0 ? 0 : 1], machine, .012); }
  // Marquee art, designed on a 1400 x 360 grid (drawn 1.28x).
  const MQ = (() => {
    const c = canvas(1792, 460), g = c.getContext('2d'); g.scale(1.28, 1.28); seedN = 123;
    for (const s of [0, 1]) { const p = PAL[s ? 'R' : 'L']; g.save(); g.beginPath(); g.rect(s * 700, 0, 700, 360); g.clip(); g.fillStyle = lin(g, 0, 0, 0, 360, [s ? '#060c26' : '#220d03', p.dark, s ? '#0a1640' : '#3a1606']); g.fillRect(s * 700, 0, 700, 360);
      if (!s) { for (let i = 0; i < 18; i++) { const a = Math.PI + (i + .5) / 18 * Math.PI; g.strokeStyle = `rgba(255,140,40,${.05 + (i % 2) * .04})`; g.lineWidth = 3; g.beginPath(); g.moveTo(700, 380); g.lineTo(700 + Math.cos(a) * 900, 380 + Math.sin(a) * 900); g.stroke(); } }
      else { let x = 700; while (x < 1400) { const w = 22 + rnd() * 40, h = 40 + rnd() * 120; g.fillStyle = `rgba(60,110,255,${.07 + rnd() * .06})`; g.fillRect(x, 220 - h, w, h); x += w + 3; } }
      g.restore(); }
    // pinstripes top and bottom
    for (const [y, lw] of [[10, 5], [350, 5]]) { neonLine(g, [[24, y], [690, y]], 'L', lw); neonLine(g, [[710, y], [1376, y]], 'R', lw); }
    // DEGEN | CITY, neon tubes, justified so both words are the same width
    g.font = `900 100px ${SANS}`; const w100 = [...'DEGEN'].reduce((a, ch) => a + g.measureText(ch).width, 0) / 100, size = Math.floor(580 / (w100 + .16 * 4)), cy = 112; g.font = `900 ${size}px ${SANS}`; g.textBaseline = 'middle'; g.textAlign = 'left';
    const wd = [...'DEGEN'].map(ch => g.measureText(ch).width), wc = [...'CITY'].map(ch => g.measureText(ch).width), gD = Math.round(size * .16), WD = wd.reduce((a, b) => a + b, 0) + gD * 4, gC = (WD - wc.reduce((a, b) => a + b, 0)) / 3;
    const letter = (ch, x, side) => { const p = PAL[side]; g.save(); g.font = `900 ${size}px ${SANS}`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      g.shadowColor = p.glow; g.shadowBlur = 46; g.strokeStyle = p.glow; g.lineWidth = 17; g.strokeText(ch, x, cy); g.shadowBlur = 0; g.fillStyle = side === 'L' ? '#1c0802' : '#030820'; g.fillText(ch, x, cy);
      g.shadowColor = p.glow; g.shadowBlur = 12; g.strokeStyle = p.tube; g.lineWidth = 9; g.strokeText(ch, x, cy); g.shadowBlur = 0; g.strokeStyle = p.core; g.lineWidth = 3; g.strokeText(ch, x, cy); g.restore(); };
    let x = 664 - WD; [...'DEGEN'].forEach((ch, i) => { letter(ch, x, 'L'); x += wd[i] + gD; }); x = 736; [...'CITY'].forEach((ch, i) => { letter(ch, x, 'R'); x += wc[i] + gC; });
    // leaderboard bar: a split track with finish blocks, tick marks and the two city names
    const bx = 90, bw = 1220, by = 226, bh = 76;
    g.save(); g.shadowColor = '#000'; g.shadowBlur = 14; rr(g, bx, by, bw, bh, 16, '#0b0d12', '#c6ccd4', 3); g.restore();
    for (const s of [0, 1]) { const p = PAL[s ? 'R' : 'L']; g.save(); g.beginPath(); g.roundRect(bx + 8, by + 8, bw - 16, bh - 16, 10); g.clip(); g.fillStyle = lin(g, 0, by, 0, by + bh, s ? ['#1a46b8', '#0b2672', '#071a52'] : ['#d4560e', '#8a3208', '#5a2005']); g.fillRect(s ? 700 : bx, by, s ? bx + bw - 700 : 700 - bx, bh);
      g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(s ? 700 : bx, by + 8, 700, 10);
      for (let i = 1; i <= 24; i++) { const tx = 700 + (s ? 1 : -1) * i * 24.2, long = i % 5 === 0; g.fillStyle = long ? '#fff' : p.core; g.globalAlpha = long ? .95 : .6; g.fillRect(tx - 1, by + 10, 2, long ? 17 : 10); g.fillRect(tx - 1, by + bh - 10 - (long ? 17 : 10), 2, long ? 17 : 10); }
      g.globalAlpha = 1; g.restore(); }
    for (const [fx, d] of [[bx + 10, 1], [bx + bw - 26, 1]]) for (let r = 0; r < 5; r++) for (let q = 0; q < 2; q++) { g.fillStyle = (r + q) % 2 ? '#10131a' : '#f2f4f7'; g.fillRect(fx + q * 8, by + 12 + r * 10.4, 8, 10.4); }
    g.save(); g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 6; text(g, 'MIAMI', 150, by + bh / 2 + 2, 34, '#fff3e0', '900', SANS, 'left'); text(g, 'NEW YORK', 1250, by + bh / 2 + 2, 34, '#eaf2ff', '900', SANS, 'right'); g.restore();
    g.fillStyle = lin(g, 0, by, 0, by + bh, ['#ffffff', '#8c939c', '#ffffff']); g.fillRect(696, by - 4, 8, bh + 8); g.beginPath(); g.moveTo(700, by - 12); g.lineTo(712, by - 2); g.lineTo(688, by - 2); g.closePath(); g.fillStyle = '#e6eaee'; g.fill();
    // the tiny house line at the foot, far smaller than the name
    spaced(g, 'PARALLAX CASINO', 700, 334, 15, 6, '#b8a894', '700'); g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(470, 334, 110, 1.5); g.fillRect(820, 334, 110, 1.5);
    return c; })();
  plane(MQ, 2.3, .59, 0, 4.43, .495, machine, false, 0, .9);
  // (no chrome seam over the marquee screen)
  for (let i = 0; i < 26; i++) { const t = i / 25, x = -1.18 + t * 2.36, k = x < 0 ? 0 : 1, ph = k ? 25 - i : i; sphere(.024, x, 4.745, .5, BULB[k][ph % 3], machine); sphere(.024, x, 4.115, .5, BULB[k][(ph + 1) % 3], machine); }
  for (let i = 1; i < 7; i++) { sphere(.024, -1.2, 4.115 + i * .09, .5, BULB[0][i % 3], machine); sphere(.024, 1.2, 4.115 + i * .09, .5, BULB[1][(7 - i) % 3], machine); }
  // marquee sides and back
  function stripes(w, h, side, tall) { const p = PAL[side], c = canvas(w, h), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, h, [p.dark, side === 'L' ? '#3a1606' : '#0a1640', p.dark]); g.fillRect(0, 0, w, h); const n = 4; for (let i = 0; i < n; i++) { const y = h * (.18 + i * .2); neonLine(g, [[24, y], [w - 24, y]], side, i % 2 ? 4 : 7); }
    g.save(); g.fillStyle = p.tube; for (let i = 0; i < 12; i++) { g.globalAlpha = .25 + (i % 3) * .2; g.fillRect(24 + i * (w - 48) / 12, h - 20, (w - 48) / 12 - 6, 6); } g.restore(); return c; }
  for (const sx of [-1, 1]) plane(stripes(432, 240, sx < 0 ? 'L' : 'R'), 1.08, .6, sx * 1.2525, 4.42, -.05, machine, false, sx * Math.PI / 2, .8);
  { // marquee back: seen from behind, the NYC half is on the viewer's left (texture left = world +x)
    const c = canvas(1280, 256), g = c.getContext('2d'); for (const s of [0, 1]) { const p = PAL[s ? 'L' : 'R']; g.fillStyle = lin(g, 0, 0, 0, 256, [p.dark, s ? '#3a1606' : '#0a1640']); g.fillRect(s * 640, 0, 640, 256); }
    neonLine(g, [[30, 40], [620, 40]], 'R', 6); neonLine(g, [[660, 40], [1250, 40]], 'L', 6); neonLine(g, [[30, 216], [620, 216]], 'R', 6); neonLine(g, [[660, 216], [1250, 216]], 'L', 6);
    g.save(); g.shadowColor = '#8fb0ff'; g.shadowBlur = 20; text(g, 'DEGEN CITY', 640, 128, 100, '#f1f4f8', '900', SANS); g.restore();
    plane(c, 2.4, .48, 0, 4.42, -.597, machine, false, Math.PI, .8); }
  // lower back: a split service panel (NYC colours on the viewer's left from behind), vents, a chrome lock
  { const c = canvas(1066, 640), g = c.getContext('2d'); for (const s of [0, 1]) { const p = PAL[s ? 'L' : 'R']; g.fillStyle = lin(g, 0, 0, 0, 640, [p.dark, s ? '#2a1004' : '#08123a', p.dark]); g.fillRect(s * 533, 0, 533, 640);
      for (let k = 0; k < 9; k++) { const y = 70 + k * 44; rr(g, s ? 600 : 70, y, 396, 20, 10, '#05070c'); g.save(); g.shadowColor = p.glow; g.shadowBlur = 10; rr(g, (s ? 600 : 70) + 6, y + 7, 384, 6, 3, k % 3 === 0 ? p.tube : p.mid); g.restore(); } }
    g.fillStyle = lin(g, 0, 0, 0, 640, ['#e6eaee', '#8b929b', '#e6eaee']); g.fillRect(529, 0, 8, 640);
    g.save(); g.shadowColor = '#000'; g.shadowBlur = 16; g.fillStyle = lin(g, 0, 250, 0, 390, ['#f4f6f8', '#7e858e']); g.beginPath(); g.arc(533, 320, 62, 0, 7); g.fill(); g.restore(); g.fillStyle = '#0a0d17'; g.beginPath(); g.arc(533, 320, 14, 0, 7); g.fill(); g.fillRect(528, 320, 10, 30);
    spaced(g, 'SERVICE', 533, 420, 24, 10, '#d6dae0', '800'); spaced(g, 'DEGEN CITY', 533, 458, 16, 7, 'rgba(255,255,255,.5)', '700');
    plane(c, 1.5, .9, 0, .95, -.565, machine, false, Math.PI, .85);
    box(1.62, .06, .03, 0, 1.43, -.58, chrome, machine, .006); box(1.62, .06, .03, 0, .47, -.58, chrome, machine, .006); box(.06, .96, .03, -.78, .95, -.58, chrome, machine, .006); box(.06, .96, .03, .78, .95, -.58, chrome, machine, .006); }
  for (const [y0, y1] of [[.27, .47], [1.43, 1.85], [1.87, 3.2], [3.6, 4.03]]) box(.05, y1 - y0, .04, 0, (y0 + y1) / 2, y0 < 1.86 ? -.585 : -.57, chrome, machine, .006); // rear seam, in gaps round the rear plate
  box(.04, .565, .04, 0, 4.5075, -.6, chrome, machine, .006);

  /* ---------- topper (crest): the two-sided coin. +z face = MIAMI sunset, -z face = NEW YORK night skyline ---------- */
  cyl(.27, .31, .06, 0, 4.83, -.05, chromeDark, machine, 40); cyl(.2, .27, .03, 0, 4.875, -.05, chrome, machine, 40);
  halfRing(.318, .014, NEON, 0, 4.815, -.05, machine, 'xz', 36);
  cyl(.055, .09, .13, 0, 4.935, -.05, chrome, machine, 24); cyl(.115, .07, .05, 0, 4.995, -.05, chromeDark, machine, 24);
  const crest = new THREE.Group(); crest.position.set(0, 5.5, -.05); crest.userData.role = 'crest'; machine.add(crest);
  const CR = .47, CT = .07;
  const faceL = basic('#ffffff'), faceR = basic('#ffffff'); // lit art: basic materials so both faces read in a dim room
  { const tM = new THREE.CanvasTexture(coinFace(miamiCoin, 768)), tN = new THREE.CanvasTexture(coinFace(nycCoin, 768)); [tM, tN].forEach(t => { t.colorSpace = THREE.SRGBColorSpace; t.jpeg = .88; }); faceL.map = tM; faceR.map = tN; }
  // The disc: a cylinder whose axis is z. Material groups: side, cap at +z (Miami), cap at -z (NYC).
  const coinGeo = new THREE.CylinderGeometry(CR, CR, CT, 72, 1, false); coinGeo.rotateX(Math.PI / 2);
  const coin = new THREE.Mesh(coinGeo, [chromeWarm, faceL, faceR]); crest.add(coin);
  cyl(.515, .515, .06, 0, 0, 0, chromeWarm, crest, 72, 'z');
  { const rimGeo = new THREE.TorusGeometry(.5, .042, 12, 96); const rim = new THREE.Mesh(rimGeo, chrome); crest.add(rim); }
  for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2, n = box(.014, .01, .074, Math.cos(a) * .538, Math.sin(a) * .538, 0, chromeDark, crest, 0); n.rotation.z = a; }
  for (const sz of [-1, 1]) halfRing(.455, .008, NEON, 0, 0, sz * (CT / 2 + .0035), crest, 'xy', 48);
  cyl(.04, .04, .16, 0, -.54, 0, chromeDark, crest, 12); // little foot tab under the rim, rests in the cup

  /* ---------- lever: chrome arm, grip fading from Miami orange (bottom) to NYC blue (top) ---------- */
  const PIV = { x: 1.36, y: 2.45, z: .08 }, REST = -.1;
  box(.07, .62, .4, 1.185, PIV.y, PIV.z, TRIM[1], machine, .015); box(.03, .5, .3, 1.225, PIV.y, PIV.z, chromeDark, machine, .01);
  cyl(.1, .1, .16, 1.27, PIV.y, PIV.z, chrome, machine, 28, 'x'); cyl(.045, .045, .34, 1.37, PIV.y, PIV.z, chromeDark, machine, 16, 'x'); cyl(.075, .075, .03, 1.52, PIV.y, PIV.z, chrome, machine, 24, 'x');
  for (const dz of [-.15, .15]) for (const dy of [-.2, .2]) rivet(1.222, PIV.y + dy, PIV.z + dz, machine, 'x');
  const lever = new THREE.Group(); lever.position.set(PIV.x, PIV.y, PIV.z); lever.rotation.x = REST; lever.userData.role = 'lever'; machine.add(lever);
  const gripTex = (() => { const c = canvas(64, 256), g = c.getContext('2d'); g.fillStyle = lin(g, 0, 0, 0, 256, [[0, '#2f78ff'], [.25, '#5a6cf2'], [.5, '#a455c8'], [.72, '#ff5f6a'], [1, '#ff7a1a']]); g.fillRect(0, 0, 64, 256);
    for (let y = 6; y < 256; y += 10) { g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(0, y, 64, 2.5); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, y + 3, 64, 1.5); }
    g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(12, 0, 8, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.jpeg = .9; return t; })();
  const gripMat = std('#ffffff', .1, .45, { map: gripTex });
  const shaft = cyl(.03, .038, 1.0, 0, .5, 0, chrome, lever, 16), grip = cyl(.058, .058, .46, 0, .69, 0, [gripMat, chrome, chrome], lever, 28);
  const ringLo = cyl(.066, .066, .022, 0, .455, 0, chrome, lever, 24), ringHi = cyl(.066, .066, .022, 0, .925, 0, chrome, lever, 24), knob = sphere(.09, 0, 1.01, 0, chrome, lever, 28, 18), boot = cyl(.07, .052, .12, 0, .06, 0, chromeDark, lever, 20), ball = sphere(.062, 0, 0, 0, chrome, lever, 20, 14);
  [shaft, grip, ringLo, ringHi, knob, boot, ball].forEach(m => { m.userData.action = 'spin'; }); // the whole arm is clickable; children[1] is the grip

  /* ---------- rear label ---------- */
  { // rear label: NYC half on the viewer's left from behind
    const c = canvas(1024, 160), g = c.getContext('2d'); for (const s of [0, 1]) { g.fillStyle = PAL[s ? 'L' : 'R'].dark; g.fillRect(s * 512, 0, 512, 160); } rr(g, 6, 6, 1012, 148, 12, null, 'rgba(200,205,212,.5)', 3);
    spaced(g, 'DEGEN CITY  /  DC-009', 512, 36, 26, 7, '#e8ecf1', '800'); spaced(g, 'NEW YORK', 256, 88, 28, 10, PAL.R.text, '800'); spaced(g, 'MIAMI', 768, 88, 28, 10, PAL.L.text, '800'); spaced(g, 'FOREVER ON STACKS', 512, 130, 18, 8, 'rgba(255,255,255,.7)', '700');
    const back = plane(c, 1.9, .3, 0, 3.4, -.57); back.rotation.y = Math.PI; }
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
