
/* ---------- Scenes: The Guest List, X Marks the Spot, Number One, Lights Up or Lights Down, and one Lab event (Last Orders) ---------- */
function darkRoom(g, a = .5) { g.drawImage(baseLayer, 0, 0); g.fillStyle = `rgba(4,5,6,${a})`; g.fillRect(0, 0, 1400, 960); }
function floodlight(g, cx, cy, r, a = .22, col = '230,255,0') { const gr = g.createRadialGradient(cx, cy, 10, cx, cy, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(.6, `rgba(${col},${a * .35})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2); }
// ---- The Guest List: nine names on a clipboard, all blacked out; open three. Each opens a VIP booth with one of Chemical X's works on its wall and a prize ----
const GUESTS = ['MR. 4AM +2', 'STROBE SUE', 'THE PROMOTER', 'NIGHT BUS NINA', 'DJ HALF-PAST', 'TWO-TONE TOM', 'LASER LEON', 'VINYL VI', 'THE MASKED GUEST'];
function guestFor(f, i) { const perm = permFor((f.roundId || 'gl') + 'guests', GUESTS.length); return GUESTS[perm[i % GUESTS.length]]; }
function boothFor(f, i) { const pool = pools.artifact, perm = permFor((f.roundId || 'gl') + 'booth', pool.length); return pool[perm[i % pool.length]]; }
function curtain(g, x, y, w, h, open = 0) { // a red velvet curtain in two halves that slide apart as the booth opens
  const half = w / 2, sh = ease(open) * half; [[x - sh, 1], [x + half + sh, 1]].forEach(([px], k) => { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); const gr = g.createLinearGradient(px, 0, px + half, 0); gr.addColorStop(0, '#5b0f19'); gr.addColorStop(.5, '#8f1a2a'); gr.addColorStop(1, '#4b0c15'); g.fillStyle = gr; g.fillRect(px, y, half, h); g.fillStyle = '#00000030'; for (let q = 0; q < half; q += 11) g.fillRect(px + q, y, 3, h); g.restore(); });
  g.fillStyle = '#d9b36a'; g.fillRect(x - 2, y - 4, w + 4, 6);
}
function drawGuestList(f, now) {
  const g = sg; darkRoom(g, .64); floodlight(g, 700, 470, 760, .12);
  const done = f.picks.length === 3; glowText(g, 'THE GUEST LIST', 700, 78, 58, ACID, ACID);
  text(g, done ? 'THREE NAMES OPENED · THE DOORMAN WAVES YOU THROUGH' : `BLACKED OUT: OPEN ${3 - f.picks.length} OF NINE NAMES`, 700, 130, 20, '#f2efe6', MONO, 'center', '700'); text(g, `LAYR ${fmt(state.balance)}  ·  BPM ${fmt(f.bet)}`, 700, 164, 15, SMOKE, MONO, 'center', '700');
  // the clipboard
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 30; round(g, RX - 16, RY - 14, RW + 32, RH + 28, 10, '#3a2a1a'); g.restore(); brushed(g, RX - 12, RY - 10, RW + 24, RH + 20, '#4a3722', 17);
  round(g, 622, RY - 34, 156, 44, 6, lin(g, 0, RY - 34, 0, RY + 10, ['#c9ced4', '#7d848c']), '#222', 2); rivet(g, 650, RY - 12, 5); rivet(g, 750, RY - 12, 5);
  const doneT = done ? Math.max(0, ...f.picks.map(i => (pres.reveal && pres.reveal[i]) || 0)) + 1300 : 0, rest = [...Array(9).keys()].filter(i => !f.picks.includes(i));
  for (let i = 0; i < 9; i++) {
    const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), open = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (reduced() ? 1 : 1300) : (picked ? 1 : -1), gst = guestFor(f, i), booth = boothFor(f, i);
    const ra = done && !picked ? (reduced() ? 1 : clamp01((now - doneT - rest.indexOf(i) * 140) / 450)) : 0, k = picked ? ease(open * 1.25) : ra > 0 ? ease(ra) * .6 : 0;
    g.save(); g.globalAlpha = picked || ra === 0 ? 1 : 1 - .45 * ra;
    round(g, x, y, w, h, 6, '#efe9d6', picked ? ACID3 : '#9b9784', picked ? 3 : 1.5);
    g.strokeStyle = '#b3ad98'; g.lineWidth = 1; for (let ln = 0; ln < 5; ln++) { g.beginPath(); g.moveTo(x + 176, y + 42 + ln * 26); g.lineTo(x + w - 12, y + 42 + ln * 26); g.stroke(); }
    // the booth: a work on the wall, hidden by a velvet curtain until the name is opened
    g.save(); g.beginPath(); g.rect(x + 10, y + 12, 154, h - 24); g.clip(); round(g, x + 10, y + 12, 154, h - 24, 3, '#0b0c0e'); g.drawImage(booth.tile, x + 10 - 6, y + 12 - 8, 166, 166); curtain(g, x + 10, y + 12, 154, h - 24, k); g.restore();
    round(g, x + 10, y + 12, 154, h - 24, 3, null, '#222', 2); if (k < .15) text(g, 'VIP', x + 87, y + h / 2, 34, '#d9b36a', COND, 'center', '800');
    // the name, under a marker bar that wipes away
    g.save(); g.font = `italic 700 ${24}px ${SANS}`; g.fillStyle = '#16181b'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(gst, x + 184, y + 28, w - 200); g.restore();
    const bw = (w - 200) * (1 - clamp01(k * 1.8)); if (bw > 1) { g.fillStyle = '#0b0c0e'; g.fillRect(x + 180, y + 14, bw + 8, 30); g.fillStyle = '#0b0c0e'; for (let q = 0; q < 4; q++) g.fillRect(x + 180 + q * 3, y + 14 + q * 8 - 2, bw + 6 - q * 2, 6); }
    text(g, `VIP BOOTH ${i + 1}`, x + 184, y + 62, 14, '#5b5848', MONO, 'left', '700');
    const tx = x + 184;
    if (picked || ra > 0) { const val = picked ? Math.round(f.awards[i] * Math.min(1, k)) : f.awards[i]; round(g, tx - 4, y + h - 74, w - tx + x - 8, 60, 6, '#0b0c0e', picked ? ACID : '#555', 2); glowText(g, `${val}×`, tx + 62, y + h - 44, 44, picked ? '#fff' : '#8a8577', ACID, '800', 'center', COND); fitText(g, picked ? `${fmt(f.awards[i] * f.bet * Math.min(1, k))} LAYR` : 'NOT OPENED', tx + 118, y + h - 44, 18, w - 322, picked ? ACID2 : '#8a8577', COND, 'left', '800');
      if (picked && open < .14) { g.fillStyle = `rgba(255,255,220,${.7 * (1 - open / .14)})`; g.fillRect(x, y, w, h); } }
    else { const hv = pres.stage === 'play' && !done ? .5 + .5 * Math.sin(now / 520 + i) : 0; round(g, tx - 4, y + h - 74, w - tx + x - 8, 60, 6, '#e1dcc6', '#9b9784', 1.5); text(g, `#${i + 1}`, tx + 20, y + h - 44, 22, '#8a8577', COND, 'center', '800'); text(g, 'TAP TO OPEN', tx + 130, y + h - 44, 18, '#5b5848', COND, 'center', '800'); if (hv) { g.strokeStyle = `rgba(230,255,0,${.7 * hv})`; g.lineWidth = 4; g.strokeRect(x + 2, y + 2, w - 4, h - 4); } }
    g.restore();
    if (!picked && pres.stage === 'play' && !done) hits.push({ id: 'gst' + i, x, y, w, h, fn: () => pickBind(i) });
  }
}
// ---- X Marks the Spot: a night map of London. Each lock sprays an X on a new spot with its value; mark all 15 for the jackpot ----
const cellRect = i => [RX + (i % 5) * CW + 8, RY + Math.floor(i / 5) * RHT + 8, CW - 19, RHT - 16];
function lockOrder(f) { const order = []; f.frames.slice(0, f.index + 1).forEach((fr, k) => { const add = k === 0 ? fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0) : fr.added; add.forEach(i => { if (!order.includes(i)) order.push(i); }); }); return order; }
function drawMapBackdrop(now) {
  const g = sg; nightMap(g, 0, 0, 1400, 960, 9); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, 1400, 960);
  const ph = reduced() ? 0 : now / 900; g.save(); g.strokeStyle = '#ff2e8822'; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); for (let x = 0; x <= 1400; x += 12) { const y = 620 + k * 90 - 40 * Math.sin(x / 190 + ph * .5 + k) - 20 * Math.sin(x / 61 + 1 + ph); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } g.restore();
}
/* The respins are animated: every empty spot is a little searching scanner that settles in turn, left to right. The engine has already
   dealt the respin (E.respin) before any of this is drawn, so the show can never change it; pres.anim only says when each spot settles and which land. */
function tagBusy(now = performance.now()) { return !!(pres && pres.anim && now < pres.anim.end); }
function startTagAnim(prev, prevLeft, fr, intro = false) {
  const now = performance.now(), R = reduced(), q = state.turbo, base = R ? 140 : q ? 380 : 760, step = R ? 0 : q ? 45 : 95;
  const spin = intro ? [] : prev.map((v, i) => v ? -1 : i).filter(i => i >= 0), stopAt = {}, landAt = {};
  spin.forEach(i => { stopAt[i] = now + base + (i % 5) * step + Math.floor(i / 5) * step * .35; });
  if (intro) fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0).forEach((i, k) => { landAt[i] = now + (R ? 0 : 350 + k * 200); });
  else fr.added.forEach(i => { landAt[i] = stopAt[i]; });
  const times = [...Object.values(stopAt), ...Object.values(landAt)], end = (times.length ? Math.max(...times) : now) + (R ? 0 : 160);
  pres.anim = { t0: now, prev, prevLeft, spin, stopAt, landAt, end, intro };
  chainFlash = now; ledPulse = now;
  if (!intro) sound('respin');
  const cols = {}; spin.forEach(i => { if (!(i in landAt)) cols[i % 5] = Math.max(cols[i % 5] || 0, stopAt[i]); });
  Object.values(cols).forEach(t => setTimeout(() => { if (pres && pres.anim) sound('click'); }, t - now));
  Object.entries(landAt).sort((a, b) => a[1] - b[1]).forEach(([i, t], k) => setTimeout(() => { if (pres && pres.anim) { sound('lock', k); ledPulse = performance.now(); } }, Math.max(0, t - now)));
  setTimeout(() => { if (pres && pres.bonus === 'chain') { renderBar(); update(); } }, Math.max(0, end - now) + 20);
}
function drawSearchCell(i, now, stopAt) {
  const [x, y, w, h] = cellRect(i), R = reduced(), left = stopAt - now, cx = x + w / 2, cy = y + h / 2 - 8;
  round(sg, x, y, w, h, 8, 'rgba(6,10,20,.8)', '#2a5d95', 2); const pulse = R ? 1 : .6 + .4 * Math.sin(now / 70 + i), r = 34 + (R ? 0 : (now / 25 + i * 9) % 22);
  sg.save(); sg.globalAlpha = (R ? .5 : 1 - (r - 34) / 22) * .8; sg.strokeStyle = PINK; sg.lineWidth = 3; sg.beginPath(); sg.arc(cx, cy, r, 0, 7); sg.stroke(); sg.restore();
  sg.save(); sg.translate(cx, cy); sg.rotate(R ? 0 : now / (left < 220 ? 200 : 90) + i); sg.globalAlpha = pulse; drawChalkXSimple(sg, 0, 0, 14, PINK2); sg.restore();
  text(sg, 'SEARCHING', cx, y + h - 34, 15, PINK2, COND, 'center', '800'); text(sg, SPOTS[i], cx, y + h - 16, 11, '#7fa3cf', MONO, 'center', '700');
}
function drawTags(f, now) {
  drawMapBackdrop(now);
  const R = reduced(), fr = f.frames[f.index], A = pres && pres.anim && now < pres.anim.end + 1200 ? pres.anim : null;
  const landed = i => !!fr.cells[i] && !(A && A.landAt[i] != null && now < A.landAt[i]), spinningAt = i => !!(A && A.stopAt[i] != null && now < A.stopAt[i]), ageOf = i => A && A.landAt[i] != null ? (now - A.landAt[i]) / 900 : 9;
  const vis = fr.cells.map((v, i) => landed(i) ? v : 0), n = vis.filter(Boolean).length;
  spaced(sg, 'X MARKS THE SPOT', 700, 46, 40, 8, PINK2, '800');
  text(sg, `${n} OF 15 SPOTS TAGGED  ·  ${fmt(vis.reduce((a, v) => a + (v || 0), 0))}× YOUR BET ON THE MAP`, 700, 92, 20, '#f2efe6', MONO, 'center', '700');
  text(sg, 'EVERY NEW TAG RESETS THE SPRAYS · TAG ALL 15 FOR THE NUMBER ONE JACKPOT', 700, 120, 13, '#8fb3df', MONO, 'center', '700');
  // sprays left: three cans; the one being used goes quiet as the spots start searching, and all three refill when a new tag lands
  let left = fr.left, fading = -1, relit = 0;
  if (A && !A.intro && now < A.end) { const firstLand = Math.min(...Object.values(A.landAt), Infinity); if (now < firstLand) { left = Math.max(0, A.prevLeft - 1); fading = left; } else relit = now - firstLand; }
  else if (A && !A.intro && A.spin.length && Object.keys(A.landAt).length) relit = now - Math.min(...Object.values(A.landAt));
  round(sg, 520, 140, 360, 50, 6, 'rgba(6,10,20,.85)', PINK, 2); text(sg, 'SPRAYS LEFT', 610, 165, 16, PINK2, COND, 'center', '800');
  for (let k = 0; k < 3; k++) { let on = k < left ? 1 : 0; if (k === fading && !R) on = Math.max(0, 1 - (now - A.t0) / 320); const flash = relit > 0 && relit < 700 && !R ? 1 + .5 * (1 - relit / 700) : 1, cx = 740 + k * 44;
    sg.save(); sg.shadowColor = on ? PINK : '#000'; sg.shadowBlur = on ? 12 * flash : 0; sg.globalAlpha = on ? Math.max(.3, on) : 1; round(sg, cx - 10, 150, 20, 32, 4, on ? PINK : '#2a2f3a'); round(sg, cx - 6, 142, 12, 10, 2, on ? '#ffffffcc' : '#3b4047'); sg.restore(); }
  // empty spots: still dark on the map
  fr.cells.forEach((v, i) => { if (landed(i) || spinningAt(i)) return; const [x, y, w, h] = cellRect(i); round(sg, x, y, w, h, 8, 'rgba(6,10,20,.55)', '#1b2c4a', 2); sg.save(); sg.setLineDash([6, 6]); sg.strokeStyle = '#2d4a78'; sg.strokeRect(x + 10, y + 10, w - 20, h - 20); sg.restore();
    const missed = A && A.stopAt[i] != null && now - A.stopAt[i] < 520 && !R;
    if (missed) { const a = 1 - (now - A.stopAt[i]) / 520; sg.save(); sg.globalAlpha = a; round(sg, x, y, w, h, 8, null, '#ff6a5e', 3); sg.restore(); text(sg, 'MISSED', x + w / 2, y + h / 2 - 8, 20, `rgba(255,150,120,${.35 + .65 * a})`, COND, 'center', '800'); }
    else text(sg, SPOTS[i], x + w / 2, y + h / 2 - 8, 17, '#35568a', COND, 'center', '800');
    text(sg, '1 IN 25 PER SPRAY', x + w / 2, y + h / 2 + 18, 11, '#2a4570', MONO, 'center', '700'); });
  fr.cells.forEach((v, i) => { if (spinningAt(i)) drawSearchCell(i, now, A.stopAt[i]); });
  // the route: a night bus line joining the spots in the order they were tagged
  const order = lockOrder(f).filter(landed), pts = order.map(i => { const [x, y, w, h] = cellRect(i); return [x + w / 2, y + h / 2 - 10]; });
  sg.save(); sg.lineCap = 'round'; for (let k = 1; k < pts.length; k++) { const age = ageOf(order[k]), isNew = age < 1, u = isNew && !R ? ease(age * 1.5) : 1, [x0, y0] = pts[k - 1], [x1, y1] = pts[k], xe = x0 + (x1 - x0) * u, ye = y0 + (y1 - y0) * u;
    sg.strokeStyle = '#0008'; sg.lineWidth = 10; sg.beginPath(); sg.moveTo(x0, y0); sg.lineTo(xe, ye); sg.stroke(); sg.strokeStyle = isNew ? ACID : '#8fb3df'; sg.lineWidth = 4; sg.setLineDash([14, 9]); sg.lineDashOffset = R ? 0 : -now / 40; sg.beginPath(); sg.moveTo(x0, y0); sg.lineTo(xe, ye); sg.stroke(); sg.setLineDash([]); }
  sg.restore();
  fr.cells.forEach((v, i) => { if (!landed(i)) return; const [x, y, w, h] = cellRect(i), age = ageOf(i), isNew = age < 1, k0 = order.indexOf(i), cx = x + w / 2, cy = y + h / 2 - 10;
    sg.save(); round(sg, x, y, w, h, 8, 'rgba(6,10,20,.7)', isNew ? PINK2 : '#8a2a5a', isNew ? 4 : 2);
    sprayX(sg, cx - 52, cy, 30, PINK, R ? 1 : ease(age * 1.6), i * 7 + 3);
    glowText(sg, `${v}×`, cx + 36, cy - 12, 38, '#fff', PINK, '800', 'center', COND); text(sg, fmt(v * f.bet), cx + 36, cy + 20, 14, PINK2, MONO, 'center', '700');
    text(sg, `${SPOTS[i]} · TAG ${k0 + 1}`, cx, y + h - 14, 11, '#a9c3e6', MONO, 'center', '700');
    if (isNew) { sg.fillStyle = `rgba(255,200,230,${.55 * (1 - age)})`; sg.fillRect(x, y, w, h); } else if (!R) { const glint = (now / 2600 + k0 * .13) % 1; if (glint < .12) { sg.fillStyle = `rgba(255,200,230,${.12 * Math.sin(glint / .12 * Math.PI)})`; sg.fillRect(x, y, w, h); } }
    sg.restore(); if (isNew) rubberStamp(sg, 'TAGGED', cx - 52, cy + 6, 16, ACID, -.14, 1 - age * .4); });
}
// ---- Number One (jackpot): the warehouse lights go to full, the mirror X spins fast, the crowd roars, the meter counts up ----
let mirrorX = null;
function mirrorXSprite() {
  if (mirrorX) return mirrorX; const c = canvas(520, 520), g = c.getContext('2d'), r = rnd(31); g.translate(260, 260); g.beginPath();
  const a = 40, b = 230; g.moveTo(-b, -b + a); g.lineTo(-b + a, -b); g.lineTo(0, -a * 1.4); g.lineTo(b - a, -b); g.lineTo(b, -b + a); g.lineTo(a * 1.4, 0); g.lineTo(b, b - a); g.lineTo(b - a, b); g.lineTo(0, a * 1.4); g.lineTo(-b + a, b); g.lineTo(-b, b - a); g.lineTo(-a * 1.4, 0); g.closePath(); g.save(); g.clip();
  for (let y = -260; y < 260; y += 20) for (let x = -260; x < 260; x += 20) { const v = 70 + r() * 185; g.fillStyle = `rgb(${v},${v},${Math.min(255, v + 12)})`; g.fillRect(x, y, 19, 19); g.fillStyle = `rgba(255,255,255,${r() * .25})`; g.fillRect(x, y, 19, 5); }
  g.restore(); g.strokeStyle = '#fff'; g.lineWidth = 5; g.stroke(); return mirrorX = c;
}
function drawJackpot(now) {
  const p = pres, t = now - p.t0, R = reduced(), k = ease((t - (R ? 200 : 1600)) / (R ? 800 : 2400)), strobe = !R && Math.floor(t / 180) % 2;
  sg.fillStyle = lin(sg, 0, 0, 0, 960, strobe ? ['#1a1c05', '#2b3000', '#10120a'] : ['#050505', '#16190a', '#050505']); sg.fillRect(0, 0, 1400, 960);
  drawLasers(sg, now, .55);
  if (!R) { sg.save(); sg.translate(700, 330); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12 + t / 2600; sg.fillStyle = i % 2 ? 'rgba(230,255,0,.10)' : 'rgba(255,250,220,.05)'; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 1100, a, a + Math.PI / 24); sg.closePath(); sg.fill(); } sg.restore(); }
  sg.save(); sg.translate(700, 330); sg.rotate(R ? 0 : t / 340); sg.globalAlpha = .34; sg.shadowColor = ACID; sg.shadowBlur = 40; sg.drawImage(mirrorXSprite(), -300, -300, 600, 600); sg.restore();
  drawCrowd(sg, now, 800, 2);
  glowText(sg, 'NUMBER ONE', 700, 100, 112, ACID, ACID);
  round(sg, 160, 170, 1080, 270, 10, '#000d', ACID3, 4); spaced(sg, 'THE JACKPOT', 700, 198, 20, 10, ACID, '800');
  if (t > (R ? 100 : 1500)) flapCells(sg, fmt(Math.round(p.amount * k)), 700, 310, 120, { w: .58, col: '#fff' });
  text(sg, `LAYR · ${fmt(p.bet)} BPM LEVEL · THE METER RESETS TO ITS SEED`, 700, 416, 20, ACID2, COND, 'center', '800');
  // five Number One pieces on the centre row
  for (let c = 0; c < 5; c++) { const it = pools.bitcoin[c % pools.bitcoin.length], s = 150, x = 700 + (c - 2) * 172 - s / 2, y = 480 + (R ? 0 : Math.sin(t / 260 + c) * 6); sg.save(); sg.shadowColor = ACID; sg.shadowBlur = 24; sg.drawImage(it.tile, x - 12, y - 10, s * 1.1, s * 1.1); sg.restore(); }
  if (!R) { sg.save(); for (let i = 0; i < 26; i++) { const ph = (t / 1000 + i * .37) % 3, x = (i * 173) % 1400, y = -40 + ph * 360; drawChalkXSimple(sg, x, y, 8 + (i % 3) * 3, i % 2 ? ACID : PINK); } sg.restore(); }
}
// ---- Lights Up or Lights Down: a big wall switch. Call where the lever lands: UP floods the room with light, DOWN is a blackout. ----
function drawSwitch(g, cx, cy, angle) { // angle: -1 = DOWN, 1 = UP, 0 = middle
  g.save(); g.translate(cx, cy); g.shadowColor = '#000'; g.shadowBlur = 24; round(g, -90, -170, 180, 340, 12, lin(g, 0, -170, 0, 170, ['#3a3f44', '#1c1f22'])); g.restore();
  g.save(); g.translate(cx, cy); [[-70, -150], [70, -150], [-70, 150], [70, 150]].forEach(([x, y]) => rivet(g, x, y, 6)); round(g, -26, -130, 52, 260, 26, '#08090b', '#555', 2);
  text(g, 'UP', 0, -150, 22, ACID, COND, 'center', '800'); text(g, 'DOWN', 0, 156, 22, '#7d858d', COND, 'center', '800');
  g.save(); g.rotate(-angle * 0.0); const ly = -angle * 78; g.shadowColor = ACID; g.shadowBlur = angle > 0 ? 24 : 0; round(g, -30, ly - 40, 60, 80, 14, angle > 0 ? lin(g, 0, ly - 40, 0, ly + 40, [ACID2, ACID, ACID3]) : lin(g, 0, ly - 40, 0, ly + 40, ['#555a60', '#2c3034', '#16181b']), '#000', 3); g.shadowBlur = 0; g.fillStyle = '#ffffff30'; g.fillRect(-18, ly - 28, 36, 5); g.restore(); g.restore();
}
function drawGamble(now) {
  const g = sg, p = pres, t = now - p.t0, R = reduced(); const up = p.result && p.result.parity === 'even';
  // the room: lit (UP), dark (DOWN) or flickering while the lever is in the air
  let lit = .5; if (p.stage === 'play') { const u = clamp01(t / (R ? 600 : 1800)); lit = u >= 1 ? (up ? 1 : 0) : R ? (u > .5 ? (up ? 1 : 0) : .5) : (Math.sin(u * 60) > 0 ? .9 : .1) * (1 - u) + (up ? 1 : 0) * u; } else if (p.stage === 'summary') lit = up ? 1 : 0; else lit = R ? .5 : .35 + .15 * Math.sin(now / 300);
  g.fillStyle = lin(g, 0, 0, 0, 960, lit > .6 ? ['#d9d6b8', '#a39f82'] : ['#06070a', '#0c0e12']); g.fillRect(0, 0, 1400, 960);
  if (lit > .6) { floodlight(g, 700, 80, 900, .35 * lit, '255,255,230'); for (let k = 0; k < 7; k++) { g.fillStyle = '#fffbe0'; g.beginPath(); g.ellipse(120 + k * 193, 40, 46, 10, 0, 0, 7); g.fill(); } } else { drawLasers(g, now, .3 + .25 * (1 - lit)); }
  g.save(); g.globalAlpha = lit > .6 ? .7 : 1; drawCrowd(g, now, 800, lit > .6 ? 2 : 1); g.restore();
  if (lit > .6) { g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, 0, 1400, 960); }
  let angle = 0; if (p.stage === 'play') { const u = clamp01(t / (R ? 600 : 1800)); angle = R ? (u > .5 ? (up ? 1 : -1) : 0) : (Math.sin(u * 14) * (1 - u) + (up ? 1 : -1) * easeIO(u)); angle = Math.max(-1, Math.min(1, angle)); } else if (p.stage === 'summary') angle = up ? 1 : -1; else angle = R ? 0 : Math.sin(now / 500) * .35;
  drawSwitch(g, 700, 480, angle);
  glowText(g, 'LIGHTS UP OR LIGHTS DOWN', 700, 90, 56, lit > .6 ? INK : ACID, lit > .6 ? '#fff' : ACID);
  if (p.stage === 'play' || p.stage === 'summary') text(g, `YOU CALLED LIGHTS ${p.choice === 'even' ? 'UP' : 'DOWN'}`, 700, 760, 26, lit > .6 ? INK : '#f2efe6', COND, 'center', '800');
  if (p.stage === 'summary' && p.result) glowText(g, `LIGHTS ${up ? 'UP' : 'DOWN'}`, 700, 160, 70, lit > .6 ? INK : '#fff', up ? '#fff' : LASER);
}
// ---- Last Orders (Lab event): the week closes, 10% goes to Chemical X's cause, and the rest is divided per twin ----
function drawPotClose(now) {
  const p = pres, t = now - p.t0, R = reduced(), g = sg; darkRoom(g, .72);
  glowText(g, 'LAST ORDERS', 700, 80, 64, ACID, ACID); text(g, 'THE WEEK CLOSES MONDAY 00:00 UTC · THE HOLDER POT IS DIVIDED · DISPLAY ONLY IN THIS VERSION', 700, 126, 14, SMOKE, MONO, 'center', '700');
  round(g, 140, 160, 1120, 110, 8, '#000', '#3b4047', 2); text(g, `WEEK ${p.key}`, 700, 184, 16, SMOKE, MONO, 'center', '700'); const cu = R ? 1 : ease((t - 600) / 1100); flapCells(g, fmt(Math.round(p.pot * cu)), 700, 234, 60, { w: .6, col: '#fff', scramble: true, flip: i => R ? 1 : (t - i * 90) / 400 });
  if (t > (R ? 0 : 1500)) {
    const u = R ? 1 : ease((t - 1500) / 1200), cause = r2(p.pot * CAUSE_RATE), share = r2(p.pot - cause);
    round(g, 140, 320, 540, 250, 10, '#101214', PINK, 3); text(g, `${CAUSE_RATE * 100}% · CHEMICAL X'S CAUSE`, 410, 352, 22, PINK2, COND, 'center', '800'); glowText(g, fmt(r2(cause * u)), 410, 432, 74, '#fff', PINK); text(g, 'LAYR SET ASIDE FOR THE CAUSE HE CHOOSES', 410, 496, 14, SMOKE, MONO, 'center', '700'); text(g, "This Is Number One's founding rule: at least 10% to causes the artist picks.", 410, 534, 12, '#8d8b80', SANS, 'center', 'italic 400');
    round(g, 720, 320, 540, 250, 10, '#101214', ACID, 3); text(g, `${100 - CAUSE_RATE * 100}% · SHARED PER TWIN`, 990, 352, 22, ACID2, COND, 'center', '800');
    if (p.twins) { glowText(g, fmt(r2(share / p.twins * u)), 990, 432, 74, '#fff', ACID); text(g, `LAYR PER TWIN · ${fmt(share)} ÷ ${fmt(p.twins)} TWINS`, 990, 496, 14, SMOKE, MONO, 'center', '700'); }
    else { glowText(g, 'WAITING', 990, 432, 64, '#fff', ACID); text(g, `${fmt(share)} LAYR HELD · NO FOREVER TWINS TO SHARE IT YET`, 990, 496, 14, SMOKE, MONO, 'center', '700'); }
    text(g, 'Snapshots and claims need a server or contract and are not connected in this version.', 700, 620, 16, SMOKE, SANS, 'center', 'italic 400');
  }
}
