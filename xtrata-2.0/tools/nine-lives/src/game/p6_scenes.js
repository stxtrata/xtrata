
/* ---------- HUD, standby screen and the scene backdrops (Night Prowl, If It Fits, Rooftops, Ninth Life, Heads or Tails) ---------- */
function perTwinText() { const sh = potShare(); return sh !== null ? `≈ ${fmt(sh)} LAYR PER TWIN` : (sources.helper === 'none' ? 'NO TWINS COUNTED YET' : sources.helper === 'live' ? 'TWINS: ' + (Number.isFinite(sources.twins) ? sources.twins : '?') : 'TWINS UNKNOWN'); }
function drawHud(now, bet, jack) {
  if (jack) { neon(sg, 'NIGHT PROWL', 135, 72, 27, MAG2); text(sg, `${state.free} SPINS LEFT · ALL WINS 2×`, 135, 112, 14, CY); }
  else { text(sg, '20 LINES', 125, 82, 30, '#e8fdfb'); text(sg, 'LEO CATS', 125, 122, 16, '#8f99b3'); }
  text(sg, 'NINTH LIFE JACKPOT', 700, 40, 24, MAG2); text(sg, fmt(E.meter(state, bet)), 700, 106, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(bet)} BET LEVEL`, 700, 160, 17, '#8f99b3');
  text(sg, 'HOLDER POT', 1275, 50, 15, '#8f99b3'); neon(sg, fmt(state.pot), 1275, 86, 34, '#ffffff', MAG, '700'); text(sg, perTwinText(), 1275, 118, 13, MAG3);
  text(sg, state.lastPot ? `LAST WEEK: ${state.lastPot.twins ? fmt(state.lastPot.pot / state.lastPot.twins) : '—'} PER TWIN` : `WEEK ${state.potKey || weekKey()}`, 1275, 140, 12, '#8f99b3');
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#e8fdfb', 'Arial', 'left'); text(sg, `BET  ${fmt(bet)}`, 700, 920, 26, '#e8fdfb'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, MAG2, 'Arial', 'right');
}
function drawStandby(now) {
  sg.save(); sg.fillStyle = 'rgba(2,5,14,.975)'; sg.fillRect(0, 0, 1400, 960);
  starfield(sg, 1400, 520, 80, 61, .7); const R = reduced();
  // a sleeping cat curled on a rooftop under the moon; its breathing is the only movement
  sg.fillStyle = '#c8f5f01c'; sg.beginPath(); sg.arc(1150, 190, 80, 0, 7); sg.fill(); sg.fillStyle = '#f6e7b0'; sg.beginPath(); sg.arc(1150, 190, 52, 0, 7); sg.fill();
  sg.fillStyle = '#050a18'; sg.beginPath(); sg.moveTo(0, 960); sg.lineTo(0, 800); sg.lineTo(240, 800); sg.lineTo(330, 760); sg.lineTo(420, 800); sg.lineTo(1400, 800); sg.lineTo(1400, 960); sg.fill();
  const br = R ? 0 : Math.sin(now / 900) * 3; sg.save(); sg.translate(1000, 796); sg.scale(1, 1 + br / 90); sg.fillStyle = '#0a1226'; sg.beginPath(); sg.ellipse(0, -30, 90, 38, 0, Math.PI, 0); sg.fill(); sg.beginPath(); sg.arc(-84, -34, 30, 0, 7); sg.fill(); sg.beginPath(); sg.moveTo(-104, -54); sg.lineTo(-100, -80); sg.lineTo(-82, -60); sg.fill(); sg.beginPath(); sg.moveTo(-76, -58); sg.lineTo(-62, -80); sg.lineTo(-62, -52); sg.fill(); sg.strokeStyle = '#0a1226'; sg.lineWidth = 12; sg.lineCap = 'round'; sg.beginPath(); sg.moveTo(86, -20); sg.quadraticCurveTo(130, -10, 112, 18); sg.stroke(); sg.restore();
  if (!R) { const z = (now / 1600) % 1; text(sg, 'z', 930 - z * 20, 700 - z * 60, 22 + z * 14, `rgba(143,199,255,${1 - z})`, 'Arial', 'center', '700'); }
  const flick = !R && Math.sin(now / 90) > .96 ? .5 : 1; sg.globalAlpha = flick; neon(sg, 'NINE LIVES', 700, 260, 100, MAG2, MAG); sg.globalAlpha = 1;
  const [a, b] = standbyLines(); text(sg, a, 700, 380, 38, '#e8fdfb', 'Arial', 'center', '700');
  const tc = twinCount(), n = Number.isFinite(tc) ? Math.min(THRESHOLD, tc) : 0;
  round(sg, 360, 430, 680, 26, 13, '#0b1225', '#3a7d76', 2); if (n) round(sg, 362, 432, 676 * n / THRESHOLD, 22, 11, lin(sg, 362, 0, 1038, 0, [MAG, MAG3]));
  text(sg, b, 700, 490, 26, MAG2);
  text(sg, 'Every LEO Cat gets a Forever Twin on Xtrata. The reels light up once enough cats have one.', 700, 540, 17, '#8f99b3', 'Arial', 'center', '400');
  hits.length = 0; button(sg, 'power', 'WAKE THE CATS · TESTNET', 470, 590, 460, 76, powerUp, { pulse: true, size: 26 });
  text(sg, `Testnet build: runs before the ${THRESHOLD}-twin switch-on. Switch off again in Settings.`, 700, 700, 15, '#6c748a', 'Arial', 'center', '400');
  sg.restore();
}
// ---- If It Fits: nine cardboard boxes on a living-room floor. Open three; a twin cat pops out of each ----
function drawClubBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#0a1530', '#10234a', '#0a1530']); g.fillRect(0, 0, 1400, 960);
  g.fillStyle = '#0d1b3a'; g.fillRect(0, 0, 1400, 150); g.fillStyle = '#081126'; for (let x = 0; x < 1400; x += 56) g.fillRect(x, 0, 2, 150); // wallpaper stripes
  g.fillStyle = '#1b1208'; g.fillRect(0, 150, 1400, 14); // skirting
  g.fillStyle = lin(g, 0, 164, 0, 960, ['#3a2813', '#24180b']); g.fillRect(0, 164, 1400, 796); g.strokeStyle = '#00000044'; g.lineWidth = 2; for (let y = 200; y < 960; y += 52) { g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); } // floorboards
  g.save(); const gl = g.createRadialGradient(1230, 70, 10, 1230, 70, 520); gl.addColorStop(0, 'rgba(246,231,176,.28)'); gl.addColorStop(1, 'rgba(246,231,176,0)'); g.fillStyle = gl; g.fillRect(0, 0, 1400, 960); g.restore(); // moonlight from the window
  const img = LOGOS.foreverTwin; if (img && img.complete && img.naturalWidth) g.drawImage(img, 56, 40, 108, 68);
}
function boothFace(i, f) { const m = f.awards[i], slot = m >= 15 ? 'bitcoin' : m >= 10 ? 'artifact' : m >= 8 ? 'block' : m >= 5 ? 'chip' : m >= 3 ? 'lemon' : 'cherry'; pres.faces = pres.faces || {}; if (!pres.faces[i]) pres.faces[i] = { s: slot, f: pickFace(slot) }; return pres.faces[i]; }
// One cardboard box. open: 0 shut .. 1 flaps wide; the prize and the cat rise from inside it.
function drawBox(x, y, w, h, open, picked, num, now, cat, prize, layr, dim) {
  const g = sg, body = picked ? '#c68b4a' : '#a8733a', dark = picked ? '#8e5f2c' : '#7b5226', tape = '#e8d3a0';
  g.save(); if (dim) g.globalAlpha = .45;
  const bt = y + 44; // box top edge
  if (picked && open > 0) { // inside of the box, then the cat popping up over the front
    g.fillStyle = '#3a2410'; g.fillRect(x + 10, bt - 6, w - 20, 30);
    g.save(); g.beginPath(); g.rect(x + 8, y - 90, w - 16, bt - y + 90 + 4); g.clip(); const rise = ease(clamp01(open * 1.15)), cs = h - 20, cy = bt + 20 - rise * (cs * .95);
    if (cat) g.drawImage(cat, x + w / 2 - cs / 2, cy, cs, cs); g.restore(); }
  g.fillStyle = body; g.fillRect(x, bt, w, y + h - bt); g.fillStyle = dark; g.fillRect(x, bt, w, 8); g.fillRect(x + w - 10, bt, 10, y + h - bt);
  g.fillStyle = tape; g.fillRect(x + w / 2 - 16, bt - 30 * (1 - ease(clamp01(open))), 32, y + h - bt + 30 * (1 - ease(clamp01(open))));
  if (!picked || open < 1) { g.fillStyle = '#00000033'; g.font = '700 22px Arial'; }
  // flaps: closed they lie flat across the top (seen from the front as a band); open they swing outward and stand up either side of the rim
  const fl = ease(clamp01(open)), L = (a, b) => a + (b - a) * fl;
  for (const side of [-1, 1]) { const hx = side < 0 ? x : x + w, ix = side < 0 ? x + w / 2 : x + w / 2; // hinge x, inner x
    const out = side * 30, P = [[hx, bt], [L(ix, hx + out), L(bt, bt - 8)], [L(ix, hx + out * 1.1), L(bt - 30, bt - 72)], [hx, bt - 30]];
    g.fillStyle = picked ? '#d9a05a' : '#b98246'; g.beginPath(); P.forEach(([px, py], k) => k ? g.lineTo(px, py) : g.moveTo(px, py)); g.closePath(); g.fill(); g.strokeStyle = '#00000044'; g.lineWidth = 2; g.stroke(); }
  g.fillStyle = '#00000018'; g.fillRect(x, y + h - 26, w, 26); g.fillStyle = '#00000022'; g.fillRect(x + 14, bt + 20, w - 28, 2); // base shading and a cardboard seam
  if (open <= .02) { text(g, String(num), x + w / 2 + 52, bt + (y + h - bt) / 2 + 22, 54, '#fff6df', 'Arial', 'center', '900'); text(g, 'IF IT FITS', x + w / 2 - 70, bt + 28, 14, '#5a3a14', 'Arial', 'center', '800'); if (!picked && !dim && !reduced()) { // two eyes watching from the gap
      const bl = (Math.floor(now / 3200 + num) % 7) === 0 ? 1 : 6; g.fillStyle = '#ffe9a8'; g.fillRect(x + w / 2 - 34, bt - 3, 10, bl); g.fillRect(x + w / 2 + 24, bt - 3, 10, bl); } }
  if (prize !== null) { const px = x + w / 2; neon(g, `${prize}×`, px, y + h + 28, 38, '#ffffff', MAG, '900'); text(g, layr, px, y + h + 62, 16, MAG3); }
  g.restore();
}
function drawClub(f, now) {
  drawClubBackdrop(now);
  const done = f.picks.length === 3;
  for (let i = 0; i < 9; i++) { const c = i % 3, r = Math.floor(i / 3), x = 170 + c * 380, y = 212 + r * 190, w = 300, h = 135, picked = f.picks.includes(i);
    const o = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (reduced() ? 1 : 900) : (picked ? 1 : -1), open = picked ? clamp01(o) : (done && !picked ? 0 : 0);
    const face = boothFace(i, f), k = picked && o >= 0 ? ease(clamp01(o)) : 1;
    if (picked && o >= 0) { drawBox(x, y, w, h, o, true, i + 1, now, tileFor(face.s, face.f), Math.round(f.awards[i] * k), `${fmt(f.awards[i] * f.bet * k)} LAYR`, false);
      if (o < .2) { sg.fillStyle = `rgba(255,255,255,${.5 * (1 - o / .2)})`; sg.fillRect(x - 10, y - 90, w + 20, h + 90); } }
    else if (done && !picked) { drawBox(x, y, w, h, 0, false, i + 1, now, null, null, '', true); text(sg, `${f.awards[i]}×`, x + w / 2, y + h + 28, 28, '#7f93b8', 'Arial', 'center', '800'); }
    else { const hv = pres.stage === 'play' ? .5 + .5 * Math.sin(now / 500 + i) : 0; sg.save(); if (hv) { sg.shadowColor = MAG; sg.shadowBlur = 6 + hv * 14; } drawBox(x, y, w, h, 0, false, i + 1, now, null, null, '', false); sg.restore();
      if (pres.stage === 'play') { text(sg, 'TAP TO OPEN', x + w / 2, y + h + 26, 15, '#a6f3ec', 'Arial', 'center', '700'); hits.push({ id: 'booth' + i, x, y: y - 40, w, h: h + 40, fn: () => pickBind(i) }); } }
  }
}
// ---- Rooftops: fifteen windows on three rows of rooftops; every lit one holds a cat ----
function streetItem(f, i) { const arr = pools.chain.length ? pools.chain : null; let h = 2166136261; for (const ch of String(f.roundId || 'f0rever') + i) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return arr ? arr[(h >>> 0) % arr.length].item : (items.length ? items[(h >>> 0) % items.length] : null); }
let roofSky = null;
function drawStreetBackdrop(now) {
  const g = sg; if (!roofSky) { roofSky = canvas(1400, 960); const q = roofSky.getContext('2d'); q.fillStyle = lin(q, 0, 0, 0, 960, ['#050b22', '#0e1f48', '#13294f', '#050a18']); q.fillRect(0, 0, 1400, 960); starfield(q, 1400, 700, 140, 91, .8); }
  g.drawImage(roofSky, 0, 0);
  if (!reduced()) { const T = now / 1000; for (let i = 0; i < 3; i++) { const u = (T * .05 + i * .33) % 1; paw(g, -40 + u * 1480, 940 - (i % 2) * 14, 1, Math.PI / 2, '#a6f3ec', .25 * Math.sin(u * Math.PI)); } }
}
// A rooftop for one row: a ridge, tiles and a chimney behind the windows.
function drawRoofRow(r) { const g = sg, y = RY + r * RHT; g.save(); g.fillStyle = '#14254a'; g.strokeStyle = '#12b5a6aa'; g.lineWidth = 3; g.beginPath(); g.moveTo(RX - 8, y + 12); g.lineTo(RX + RW / 2, y - 14); g.lineTo(RX + RW + 8, y + 12); g.lineTo(RX + RW + 8, y + RHT - 4); g.lineTo(RX - 8, y + RHT - 4); g.closePath(); g.fill(); g.beginPath(); g.moveTo(RX - 8, y + 12); g.lineTo(RX + RW / 2, y - 14); g.lineTo(RX + RW + 8, y + 12); g.stroke(); g.fillStyle = '#ffffff0a'; for (let k = 0; k < 24; k++) g.fillRect(RX + k * 56, y + 14, 2, RHT - 20); g.fillStyle = '#0a1226'; g.fillRect(RX + 70 + r * 160, y - 30, 30, 34); g.restore(); }
function drawStreet(f, now) {
  drawStreetBackdrop(now);
  const fr = f.frames[f.index], fresh = now - chainFlash < 900 ? fr.added : [];
  for (let r = 0; r < 3; r++) drawRoofRow(r);
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 10, y = RY + Math.floor(i / 5) * RHT + 14, w = CW - 23, h = RHT - 24, lit = !!v, isNew = fresh.includes(i), age = isNew ? (now - chainFlash) / 900 : 1;
    sg.save(); if (lit) { sg.shadowColor = '#ffd27a'; sg.shadowBlur = isNew ? 36 : 16; } round(sg, x, y, w, h, 10, lit ? '#221a10' : '#060a16', lit ? '#ffd98a' : '#1c2742', lit ? 4 : 3); sg.restore();
    if (lit) {
      const it = streetItem(f, i); sg.save(); sg.beginPath(); sg.roundRect(x + 5, y + 5, w - 10, h - 10, 6); sg.clip(); sg.fillStyle = lin(sg, x, y, x, y + h, ['#ffe9b0', '#ffc86a']); sg.fillRect(x, y, w, h);
      const ps = h - 16; if (it) sg.drawImage(it.tile || catTile(it), x + 8, y + 8, ps, ps);
      const tx = x + 8 + ps + (w - 16 - ps) / 2;
      neon(sg, it ? (it.forever ? `XTRATA #${it.xtrataId}` : `CAT #${it.id}`) : 'CAT', tx, y + 32, 12, '#3b2a10', '#ffffff00', '800'); neon(sg, `${v}×`, tx, y + 72, 38, '#ffffff', '#5a3a00', '900'); text(sg, fmt(v * f.bet), tx, y + 104, 14, '#3b2a10', 'Arial', 'center', '700');
      sg.fillStyle = '#3a2a1099'; sg.fillRect(x + 4, y + h / 2 - 1, w - 8, 3); sg.fillRect(x + w / 2 + ps / 2 + 4, y + 4, 3, h - 8); // window frame bars
      if (isNew) { sg.fillStyle = `rgba(255,255,255,${.85 * (1 - age)})`; sg.fillRect(x, y, w, h); }
      sg.restore();
      if (isNew && !reduced()) { const k = 1 + .5 * (1 - ease(age * 2)); sg.save(); sg.translate(x + w / 2, y + h / 2); sg.scale(k, k); sg.globalAlpha = 1 - age; sg.strokeStyle = '#ffd98a'; sg.lineWidth = 4; sg.strokeRect(-w / 2, -h / 2, w, h); sg.restore(); }
    } else { sg.fillStyle = '#0a1226'; sg.fillRect(x + 6, y + 6, w - 12, h - 12); sg.fillStyle = '#ffffff08'; sg.fillRect(x + 6, y + 6, w - 12, 16); text(sg, 'DARK', x + w / 2, y + h / 2 + 10, 17, '#2b3a5c', 'Arial', 'center', '700'); }
    sg.fillStyle = '#1a2440'; sg.fillRect(x - 4, y + h, w + 8, 8); // sill
  });
}
// ---- Ninth Life: three claw slashes rake across the screen, which splits along them, falls away and re-forms ----
const CLAWS = [[[150, 40], [520, 920]], [[380, 20], [770, 940]], [[610, 10], [1010, 930]]];
function startCrash(dur = 3000) {
  const W = screen.width, H = screen.height, snap = canvas(W, H); snap.getContext('2d').drawImage(screen, 0, 0);
  const cols = 10, rows = 7, tri = []; let s = 1; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x0 = c * 140, y0 = r * (960 / rows), x1 = x0 + 140, y1 = y0 + 960 / rows; for (const pts of [[[x0, y0], [x1, y0], [x0, y1]], [[x1, y0], [x1, y1], [x0, y1]]]) { const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3, ang = Math.atan2(cy - 480, cx - 700) + (rnd() - .5) * .8, sp = 260 + rnd() * 560; tri.push({ pts, cx, cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 120, rot: (rnd() - .5) * 5, delay: rnd() * .1 }); } }
  crash = { start: performance.now(), dur, snap, tri, W, H };
  sound('crash');
}
function drawClaws(g, u, a = 1) { // u 0..1: the three slashes are drawn one after another, each a tapered gold stroke with a white-hot core
  g.save(); g.lineCap = 'round';
  CLAWS.forEach(([p0, p1], k) => { const t = clamp01(u * 3 - k * .7); if (t <= 0) return; const x = p0[0] + (p1[0] - p0[0]) * t, y = p0[1] + (p1[1] - p0[1]) * t;
    g.shadowColor = '#ffc83d'; g.shadowBlur = 26; g.globalAlpha = a; g.strokeStyle = '#ffc83d'; g.lineWidth = 16 * (1 - .35 * t); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(x, y); g.stroke();
    g.shadowBlur = 0; g.strokeStyle = '#fffbe6'; g.lineWidth = 5; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(x, y); g.stroke(); });
  g.restore();
}
function applyCrash(now) {
  if (!crash) return; const t = (now - crash.start) / crash.dur; if (t >= 1) { crash = null; return; }
  const R = reduced(), k = t < .3 ? 0 : t < .62 ? ease((t - .3) / .32) : t < .72 ? 1 : 1 - easeIO((t - .72) / .28), rx = crash.W / 1400, ry = crash.H / 960;
  sg.save(); sg.fillStyle = '#02050c'; sg.fillRect(0, 0, 1400, 960);
  if (t < .3) { const sh = R ? 0 : 10 * clamp01((t - .1) / .2); sg.drawImage(crash.snap, (Math.random() - .5) * sh, (Math.random() - .5) * sh, 1400, 960); drawClaws(sg, t / .2); if (t > .22) { sg.fillStyle = `rgba(255,251,230,${.45 * (1 - (t - .22) / .08)})`; sg.fillRect(0, 0, 1400, 960); } }
  else { sg.fillStyle = `rgba(255,200,61,${.1 * (1 - k)})`; sg.fillRect(0, 0, 1400, 960);
    for (const s of crash.tri) { const q = clamp01(k - s.delay), dx = s.vx * q, dy = s.vy * q + 500 * q * q * (k > .98 ? 0 : 1) * .5; sg.save(); sg.beginPath(); sg.moveTo(s.pts[0][0] + dx, s.pts[0][1] + dy); sg.lineTo(s.pts[1][0] + dx, s.pts[1][1] + dy); sg.lineTo(s.pts[2][0] + dx, s.pts[2][1] + dy); sg.closePath();
      sg.translate(s.cx + dx, s.cy + dy); sg.rotate(s.rot * q); sg.translate(-s.cx - dx, -s.cy - dy); sg.clip(); sg.globalAlpha = 1 - .4 * q; sg.drawImage(crash.snap, 0, 0, crash.W, crash.H, dx, dy, 1400, 960); sg.restore();
      sg.save(); sg.strokeStyle = `rgba(255,214,120,${.8 * q})`; sg.lineWidth = 1.5; sg.beginPath(); sg.moveTo(s.pts[0][0] + dx, s.pts[0][1] + dy); sg.lineTo(s.pts[1][0] + dx, s.pts[1][1] + dy); sg.lineTo(s.pts[2][0] + dx, s.pts[2][1] + dy); sg.closePath(); sg.stroke(); sg.restore(); }
    drawClaws(sg, 1, 1 - k); }
  sg.restore();
}
// ---- Heads or Tails: a gold coin with a LEO Cat's head on one side and its tail on the other ----
function drawTail(g, r) { // a curled cat tail rising from a rooftop line, drawn in the coin's own colours
  g.save(); g.fillStyle = '#0b1736'; g.fillRect(-r, -r, r * 2, r * 2); starfield(g, r * 2, r * 2, 0, 1); g.fillStyle = '#f6e7b0'; g.beginPath(); g.arc(r * .36, -r * .38, r * .24, 0, 7); g.fill();
  g.fillStyle = '#050a18'; g.fillRect(-r, r * .52, r * 2, r); g.fillRect(-r * .5, r * .4, r * .22, r * .2); // roof and chimney
  g.strokeStyle = '#050a18'; g.lineCap = 'round'; g.lineWidth = r * .15; g.beginPath(); g.moveTo(-r * .1, r * .55); g.bezierCurveTo(-r * .1, r * .1, r * .45, r * .25, r * .3, -r * .15); g.bezierCurveTo(r * .2, -r * .38, -r * .05, -r * .3, .02 * r, -r * .08); g.stroke();
  g.strokeStyle = '#12b5a6'; g.lineWidth = r * .035; g.stroke(); g.restore();
}
function drawCoin(g, cx, cy, r, angle, now) {
  const k = Math.cos(angle), side = k >= 0 ? 'heads' : 'tails', w = Math.max(.04, Math.abs(k));
  g.save(); g.translate(cx, cy); g.scale(w, 1); g.shadowColor = side === 'heads' ? '#ffc83d' : MAG; g.shadowBlur = 30;
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = side === 'heads' ? lin(g, 0, -r, 0, r, ['#ffe8a0', '#c9971a']) : lin(g, 0, -r, 0, r, ['#8fe9df', '#0b6f66']); g.fill(); g.shadowBlur = 0; g.lineWidth = 8; g.strokeStyle = side === 'heads' ? '#fff3c4' : '#a6f3ec'; g.stroke();
  g.beginPath(); g.arc(0, 0, r - 16, 0, 7); g.clip();
  if (side === 'heads') { const ps = pools.bitcoin.length ? pools.bitcoin : items, it = ps.length ? ps[(Math.floor(now / 2000)) % ps.length] : null; if (it) g.drawImage(it.tile, -r + 12, -r + 12, (r - 12) * 2, (r - 12) * 2); else text(g, 'CAT', 0, 0, 60, '#5a3a00'); }
  else { drawTail(g, r - 16); text(g, 'TAILS', 0, r * .78, r * .2, '#e8fdfb', 'Arial', 'center', '900'); }
  g.restore();
}
function drawGamble(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#050b22', '#10234a', '#050b22']); g.fillRect(0, 0, 1400, 960); starfield(g, 1400, 960, 120, 17, .7);
  g.save(); const gr = g.createRadialGradient(700, 300, 20, 700, 300, 420); gr.addColorStop(0, 'rgba(255,200,61,.28)'); gr.addColorStop(1, 'rgba(255,200,61,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 960); g.restore();
  const p = pres, t = now - p.t0; let angle = 0, ly = 300;
  const fin = p.result && p.result.parity === 'odd' ? Math.PI : 0;
  if (p.stage === 'play') { const u = clamp01(t / (reduced() ? 600 : 1800)); angle = (reduced() ? 0 : Math.PI * 2 * 6 * easeIO(u)) + (reduced() ? (u > .5 ? fin : 0) : fin * easeIO(u)); ly = 300 - Math.sin(u * Math.PI) * (reduced() ? 0 : 120); }
  else if (p.stage === 'summary') angle = p.result && p.result.parity === 'odd' ? Math.PI : 0; else angle = Math.sin(now / 700) * .5;
  drawCoin(g, 700, ly, 140, angle, now);
}
