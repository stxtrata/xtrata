
/* ---------- Scenes: Unmask Satoshi, The Patoshi Pattern, Satoshi's Key, Satoshi or Not?, and the Forgery's FAKE stamp ---------- */
// ---- Unmask Satoshi: nine sealed envelopes under the green banker's lamp ----
function lampPool(g, cx, cy, r, a = .22) { const gr = g.createRadialGradient(cx, cy, 10, cx, cy, r); gr.addColorStop(0, `rgba(170,230,170,${a})`); gr.addColorStop(.6, `rgba(90,160,110,${a * .45})`); gr.addColorStop(1, 'rgba(40,80,50,0)'); g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2); }
function drawDeskBackdrop(now, lampY = 120) {
  const g = sg; desk(g); g.save(); g.globalAlpha = .9; lampPool(g, 700, 470, 760, .2); g.restore(); blinds(g, 1400, 960, .03);
  // the lamp itself: a green glass shade across the top of the screen
  g.save(); g.fillStyle = lin(g, 0, 0, 0, lampY - 60, ['#123a22', '#2e7a4a']); g.beginPath(); g.moveTo(480, 0); g.lineTo(920, 0); g.lineTo(980, lampY - 70); g.lineTo(420, lampY - 70); g.closePath(); g.fill(); g.fillStyle = '#e8f8d877'; g.fillRect(430, lampY - 74, 540, 5); g.restore();
}
function evidenceSlot(m) { return m >= 15 ? 'wild' : m >= 10 ? 'artifact' : m >= 5 ? 'block' : m >= 3 ? 'chip' : 'lemon'; }
function drawUnmask(f, now) {
  drawDeskBackdrop(now);
  const done = f.picks.length === 3; glowText(sg, 'UNMASK SATOSHI', 700, 96, 54, '#f3ffe8', GREEN2, '700', 'center', TYPE); text(sg, done ? 'THREE OPENED · STILL ANONYMOUS' : `OPEN ${3 - f.picks.length} OF NINE ENVELOPES`, 700, 150, 20, '#cfe8c8', TYPE); text(sg, `LAYR ${fmt(state.balance)}  ·  BET ${fmt(f.bet)}`, 700, 182, 15, SMOKE, TYPE);
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), open = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (reduced() ? 1 : 1100) : (picked ? 1 : -1);
    if (open >= 0 || (done && !picked)) {
      const slot = evidenceSlot(f.awards[i]), k = picked ? ease(open * 1.4) : 1, card = tileFor(slot, i % pools[slot].length);
      sg.save(); sg.globalAlpha = picked ? 1 : .38;
      envelopeShape(sg, x + 6, y + 30, h - 20, h - 38, picked ? clamp01(open * 2.2) : 1, false);
      const cs = h - 30, cy = y + 34 - (picked ? k * 26 : 0); if (picked || done) sg.drawImage(card, x + 6 + (h - 20 - cs) / 2, cy, cs, cs);
      const tx = x + h + (w - h) / 2;
      if (picked) { const val = Math.round(f.awards[i] * k); glowText(sg, `${val}×`, tx, y + h / 2 - 26, 50, '#fff6dc', BRASS, '700', 'center', TYPE); text(sg, `${fmt(f.awards[i] * f.bet * k)} LAYR`, tx, y + h / 2 + 14, 18, BRASS2, TYPE);
        if (open > .55) rubberStamp(sg, 'STILL ANONYMOUS', tx, y + h - 26, 15, RED2, -.08, clamp01((open - .55) * 4) * .95);
        if (open < .18) { sg.fillStyle = `rgba(255,248,220,${.6 * (1 - open / .18)})`; sg.fillRect(x, y, w, h); } }
      else text(sg, `${f.awards[i]}×`, tx, y + h / 2, 34, '#8a7a5a', TYPE);
      sg.restore();
    } else {
      const hv = pres.stage === 'play' ? .5 + .5 * Math.sin(now / 520 + i) : 0;
      sg.save(); sg.shadowColor = GREEN2; sg.shadowBlur = 4 + hv * 16; envelopeShape(sg, x + 6, y + 8, w - 12, h - 16, 0, false); sg.restore();
      round(sg, x + 22, y + 18, 62, 36, 5, '#efe4c8'); text(sg, `No.${i + 1}`, x + 53, y + 37, 17, INK, TYPE);
      text(sg, 'EVIDENCE · SEALED', x + w / 2 + 80, y + h - 30, 15, '#3b2710', TYPE, 'center', '700');
      if (pres.stage === 'play') hits.push({ id: 'env' + i, x, y, w, h, fn: () => pickBind(i) });
    }
  }
}
// ---- The Patoshi Pattern: real early blocks lock into a ledger; the screen tallies the coins in the pattern ----
function patoshiFor(f, i) { const arr = pools.chain; let h = 2166136261; for (const ch of String(f.roundId || 'patoshi') + i) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return arr[(h >>> 0) % arr.length]; }
function drawPatoshiBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#0d140f', '#0a0f0b', '#121a14']); g.fillRect(0, 0, 1400, 960);
  g.save(); g.globalAlpha = .06; g.fillStyle = GREEN2; for (let y = 0; y < 960; y += 4) g.fillRect(0, y, 1400, 1.2); g.restore();
  // a faint scatter of the Patoshi blocks: height (x) against extranonce slope, purely decorative
  g.save(); g.fillStyle = '#9fd8a822'; for (let k = 0; k < 220; k++) { const x = (k * 37) % 1400, y = 200 + ((k * 53) % 560); g.fillRect(x, y - (x % 140) * .6, 2, 2); } g.restore();
}
// ---- Respin animation. The engine has already fixed and saved the respin; this only shows it: every unlocked cell spins
// through Patoshi blocks and stops column by column, left to right, and a found block lands with a bounce and LOCKED. ----
let chainSpin = null; const chainLand = {};
const chainBusy = (now = performance.now()) => !!(chainSpin && now < chainSpin.t0 + chainSpin.end);
let unknownCard = null;
function unknownTile() {
  if (unknownCard) return unknownCard; const c = canvas(240, 240), g = c.getContext('2d');
  round(g, 14, 8, 212, 212, 6, '#1a2a1e', '#3f8a5c', 3); for (let y = 8; y < 220; y += 28) { g.fillStyle = '#20352688'; g.fillRect(14, y, 212, 14); }
  text(g, '?', 120, 112, 120, '#5f9d72', TYPE, 'center', '700'); text(g, 'SEARCHING', 120, 196, 15, '#5f9d72', TYPE, 'center', '700');
  return (unknownCard = c);
}
function startChainSpin(prevCells, prevLeft, fr, entry = false) {
  const now = performance.now(), quick = !!state.turbo, stops = {}; let end = 0;
  prevCells.forEach((v, i) => { if (v) return; const c = i % 5, r = Math.floor(i / 5); const t = (quick ? 260 : (entry ? 700 : 560)) + c * (quick ? 70 : 130) + r * (quick ? 22 : 48); stops[i] = t; end = Math.max(end, t); });
  for (const k in chainLand) delete chainLand[k];
  if (reduced() || !Object.keys(stops).length) { (fr.added || []).forEach(i => chainLand[i] = now); chainSpin = null; chainFlash = now; return 0; }
  const added = (fr.added || []).slice(), firstLand = added.length ? Math.min(...added.map(i => stops[i])) : end;
  chainSpin = { t0: now, stops, end: end + 260, added, leftDuring: entry ? fr.left : Math.max(0, prevLeft - 1), refillAt: added.length ? firstLand : -1, entry };
  added.forEach(i => chainLand[i] = now + stops[i]);
  // sound: a teleprinter whirr for the search, one stop per column, a stamp for each block found
  sound('scan', (end + 100) / 1000);
  for (let c = 0; c < 5; c++) { const ts = Object.keys(stops).filter(i => i % 5 === c).map(i => stops[i]); if (ts.length) sound('stop', c, Math.max(...ts) / 1000); }
  const spin = chainSpin; added.forEach((i, k) => setTimeout(() => { if (chainSpin === spin) sound('lock', 0); }, stops[i]));
  setTimeout(() => { if (chainSpin === spin) { update(); renderBar(); screenDirty = true; } }, end + 300); // the RESPIN button comes back
  chainFlash = now + end; return end + 260;
}
function spinCell(i, x, y, w, h, el, stop, now) {
  const ts = h - 8, v = 2.4, D = 300, arr = pools.chain, u = clamp01((el - (stop - D)) / D);
  let off = el < stop - D ? v * el : v * (stop - D) + v * D * (u - u * u / 2); off += i * 61;
  const speed = el < stop - D ? v : v * (1 - u);
  round(sg, x, y, w, h, 8, '#0f1812', '#3f8a5c', 2);
  sg.save(); sg.beginPath(); sg.rect(x + 2, y + 2, ts, ts); sg.clip();
  const first = Math.floor(off / ts), frac = off - first * ts;
  for (let j = -1; j < 2; j++) { const idx = first + j, ty = y + 2 + j * ts - frac + ts, t = (idx % 3 + 3) % 3 === 2 ? unknownTile() : arr[((idx * 2654435761 + i * 40503) >>> 0) % arr.length].tile;
    if (speed > .9) { sg.globalAlpha = .35; sg.drawImage(t, x + 2, ty - speed * 14, ts, ts); sg.globalAlpha = .65; } else sg.globalAlpha = 1;
    sg.drawImage(t, x + 2, ty - ts, ts, ts); }
  sg.globalAlpha = 1; const gr = sg.createLinearGradient(0, y, 0, y + ts); gr.addColorStop(0, '#000a'); gr.addColorStop(.22, '#0000'); gr.addColorStop(.78, '#0000'); gr.addColorStop(1, '#000a'); sg.fillStyle = gr; sg.fillRect(x + 2, y + 2, ts, ts);
  sg.restore();
  const tx = x + ts + (w - ts) / 2, fl = .45 + .35 * Math.sin(now / 70 + i);
  sg.save(); sg.globalAlpha = fl; text(sg, '· · ·', tx, y + h / 2 - 4, 30, '#9fd8a8', TYPE); sg.restore();
}
function drawPatoshi(f, now) {
  drawPatoshiBackdrop(now);
  const fr = f.frames[f.index], P = REC.patoshi, cs = chainSpin && now < chainSpin.t0 + chainSpin.end ? chainSpin : null, el = cs ? now - cs.t0 : 0;
  const spinningCell = i => cs && cs.stops[i] !== undefined && el < cs.stops[i];
  const n = fr.cells.filter((v, i) => v && !spinningCell(i)).length;
  // tally across the top
  spaced(sg, 'THE PATOSHI PATTERN', 700, 40, 26, 4, GREEN2, '700', TYPE);
  text(sg, `${n} OF 15 BLOCKS FOUND  ·  ${fmt(n * 50)} BTC IN THESE COINBASES`, 700, 80, 20, '#d9f2d9', TYPE);
  const tot = P.btc || 1097652; text(sg, `≈ ${fmt(Math.round(tot))} BTC MINED IN THE PATTERN · ALMOST ALL OF IT HAS NEVER MOVED`, 700, 112, 15, '#8fbf98', TYPE);
  // the two people the Patoshi data comes from, in the top corners: who found the pattern, who curated the dataset
  [['lerner-a', 30], ['lopp-a', 1220]].forEach(([k, x]) => { const im = printOf(k); if (!im) return; sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 16; round(sg, x - 4, 30, 158, 158, 8, '#0c0a08', '#3f8a5c', 2); sg.restore(); sg.save(); sg.beginPath(); sg.roundRect(x, 34, 150, 150, 6); sg.clip(); sg.drawImage(im, x, 34, 150, 150); sg.restore(); });
  const refilled = cs && cs.refillAt >= 0 && el >= cs.refillAt, left = cs && !refilled ? cs.leftDuring : fr.left, refillAge = chainSpin && chainSpin.refillAt >= 0 ? now - (chainSpin.t0 + chainSpin.refillAt) : 1e9;
  round(sg, 520, 134, 360, 50, 8, '#132018', cs ? GREEN2 : '#3f8a5c', 2); text(sg, cs ? 'SEARCHING THE CHAIN' : `RESPINS LEFT`, 620, 159, 15, cs ? '#d9f2d9' : '#8fbf98', TYPE);
  for (let k = 0; k < 3; k++) { const on = k < left, cur = !cs && on && k === left - 1, pulse = cur && !reduced() ? .5 + .5 * Math.sin(now / 260) : 0, pop = refillAge >= 0 && refillAge < 600 && !reduced() ? 1 + .45 * (1 - refillAge / 600) * Math.sin(refillAge / 600 * Math.PI) : 1;
    sg.save(); if (on) { sg.shadowColor = GREEN2; sg.shadowBlur = 6 + pulse * 14 + (pop > 1 ? 18 : 0); } sg.fillStyle = on ? GREEN2 : '#24352a'; sg.beginPath(); sg.arc(760 + k * 34, 159, 11 * pop, 0, 7); sg.fill(); sg.restore(); }
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16;
    if (spinningCell(i)) { spinCell(i, x, y, w, h, el, cs.stops[i], now); return; }
    const lit = !!v, landT = chainLand[i], isNew = landT !== undefined && now >= landT && now - landT < 900, age = isNew ? (now - landT) / 900 : 1;
    const settle = cs && cs.stops[i] !== undefined ? el - cs.stops[i] : 1e9, bounce = settle >= 0 && settle < 260 && !reduced() ? Math.sin(settle / 260 * Math.PI) * 12 * (1 - settle / 260) : 0;
    if (bounce) { sg.save(); sg.translate(0, -bounce); }
    if (lit) { const e = patoshiFor(f, i), ts = h - 8; sg.save(); if (isNew && !reduced()) { const k = 1 + .35 * (1 - ease(age * 1.6)); sg.translate(x + w / 2, y + h / 2); sg.scale(k, k); sg.translate(-x - w / 2, -y - h / 2); }
      else if (!cs && !reduced()) { sg.shadowColor = GREEN2; sg.shadowBlur = 4 + 4 * (.5 + .5 * Math.sin(now / 700 + i * .9)); }
      round(sg, x, y, w, h, 8, '#132018', isNew ? GREEN2 : '#3f8a5c', isNew ? 4 : 2); sg.drawImage(e.tile, x + 2, y + 2, ts, ts); const tx = x + ts + (w - ts) / 2;
      glowText(sg, `${v}×`, tx, y + h / 2 - 10, 34, '#fff', GREEN, '700', 'center', TYPE); text(sg, fmt(v * f.bet), tx, y + h / 2 + 24, 13, '#9fd8a8', TYPE);
      if (isNew) { sg.fillStyle = `rgba(220,255,220,${.7 * (1 - age)})`; sg.fillRect(x, y, w, h); }
      sg.restore(); if (isNew) rubberStamp(sg, 'LOCKED', x + ts * .5, y + h * .5, 16, GREEN2, -.2, 1 - age * .4);
    } else { round(sg, x, y, w, h, 8, '#0f1812', '#24352a', 2);
      // between respins the empty cells stay awake: a faint scan line runs down each one and the label breathes
      if (!cs && !reduced()) { const ph = ((now / 1800 + i * .137) % 1), sy = y + 6 + ph * (h - 12); sg.save(); sg.beginPath(); sg.rect(x, y, w, h); sg.clip(); const g2 = sg.createLinearGradient(0, sy - 18, 0, sy + 2); g2.addColorStop(0, '#5fd08a00'); g2.addColorStop(1, '#5fd08a2e'); sg.fillStyle = g2; sg.fillRect(x + 4, sy - 18, w - 8, 20); sg.fillStyle = '#7fe0a055'; sg.fillRect(x + 4, sy, w - 8, 1.5); sg.restore(); }
      const br = cs || reduced() ? 1 : .75 + .25 * Math.sin(now / 900 + i);
      sg.save(); sg.globalAlpha = br; text(sg, 'BLOCK ?', x + w / 2, y + h / 2 - 8, 20, '#3a5442', TYPE); text(sg, 'not yet found', x + w / 2, y + h / 2 + 20, 13, '#2e4636', TYPE, 'center', '400'); sg.restore();
      if (settle >= 0 && settle < 300 && !reduced()) { sg.fillStyle = `rgba(160,220,170,${.18 * (1 - settle / 300)})`; sg.fillRect(x, y, w, h); } }
    if (bounce) sg.restore();
  });
}
// ---- Satoshi's Key (jackpot): the key turns in the lock; "SIGNED…?" types out, then, as ever, "NO SIGNATURE" ----
function drawKeyJackpot(now) {
  const p = pres, t = now - p.t0, R = reduced(), k = ease(t / (R ? 1200 : 3800));
  sg.fillStyle = lin(sg, 0, 0, 0, 960, ['#0b0805', '#2a1d0c', '#0b0805']); sg.fillRect(0, 0, 1400, 960);
  if (!R) { sg.save(); sg.translate(700, 430); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12 + t / 3000; sg.fillStyle = i % 2 ? 'rgba(224,176,74,.10)' : 'rgba(255,240,200,.05)'; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 1100, a, a + Math.PI / 24); sg.closePath(); sg.fill(); } sg.restore(); }
  // keyhole plate
  sg.save(); sg.shadowColor = BRASS; sg.shadowBlur = 30; sg.fillStyle = lin(sg, 560, 260, 840, 620, [BRASS2, BRASS, BRASS3]); sg.beginPath(); sg.ellipse(700, 330, 120, 150, 0, 0, 7); sg.fill(); sg.restore();
  sg.fillStyle = '#0b0805'; sg.beginPath(); sg.arc(700, 300, 26, 0, 7); sg.moveTo(686, 310); sg.lineTo(714, 310); sg.lineTo(722, 380); sg.lineTo(678, 380); sg.fill();
  const turn = R ? 0 : Math.min(1, t / 1600) * Math.PI / 2; sg.save(); sg.translate(700, 330); sg.rotate(-Math.PI / 2 + turn * 0); sg.restore();
  sg.save(); sg.translate(820, 200); sg.rotate(-.5 + turn * .5); keyShape(sg, 0, 0, 1.4); sg.restore();
  const msg = 'SIGNED…?', typed = R ? msg.length : Math.min(msg.length, Math.floor(t / 160));
  text(sg, msg.slice(0, typed), 700, 540, 64, '#fff3d0', TYPE);
  if (t > (R ? 400 : 1700)) rubberStamp(sg, 'NO SIGNATURE', 700, 548, 58, RED2, -.12, clamp01((t - (R ? 400 : 1700)) / 300));
  glowText(sg, "SATOSHI'S KEY", 700, 112, 74, BRASS2, BRASS);
  glowText(sg, fmt(p.amount * k), 700, 690, 100, '#fff', BRASS, '700', 'center', TYPE); text(sg, `LAYR · ${fmt(p.bet)} BET LEVEL · THE KEY STILL HAS NO OWNER`, 700, 770, 22, BRASS2, TYPE);
}
// ---- Satoshi or Not? A coin with ₿ on one side and a FAKE stamp on the other ----
function drawCoin(g, cx, cy, r, angle) {
  const k = Math.cos(angle), side = k >= 0 ? 'btc' : 'fake', w = Math.max(.04, Math.abs(k));
  g.save(); g.translate(cx, cy); g.scale(w, 1); g.shadowColor = side === 'btc' ? BRASS : RED; g.shadowBlur = 30;
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = side === 'btc' ? lin(g, 0, -r, 0, r, [BRASS2, BRASS, BRASS3]) : lin(g, 0, -r, 0, r, ['#f1e6c8', '#cbb88f']); g.fill(); g.shadowBlur = 0; g.lineWidth = 8; g.strokeStyle = side === 'btc' ? '#fff0c0' : '#7a5d2e'; g.stroke();
  g.beginPath(); g.arc(0, 0, r - 14, 0, 7); g.lineWidth = 2; g.stroke();
  if (side === 'btc') { btcGlyph(g, 0, 8, r * 1.15, '#3a2808'); }
  else rubberStamp(g, 'FAKE', 0, 0, r * .42, RED, -.25, .95);
  g.restore();
}
function drawGamble(now) {
  const g = sg; desk(g); lampPool(g, 700, 420, 520, .24); blinds(g, 1400, 960, .035);
  const p = pres, t = now - p.t0; let angle = 0, ly = 420;
  const fin = p.result && p.result.parity === 'odd' ? Math.PI : 0;
  if (p.stage === 'play') { const u = clamp01(t / (reduced() ? 600 : 1800)); angle = (reduced() ? 0 : Math.PI * 2 * 6 * easeIO(u)) + (reduced() ? (u > .5 ? fin : 0) : fin * easeIO(u)); ly = 420 - Math.sin(u * Math.PI) * (reduced() ? 0 : 190); }
  else if (p.stage === 'summary') angle = fin; else angle = Math.sin(now / 700) * .5;
  drawCoin(g, 700, ly, 150, angle);
  text(g, 'SATOSHI OR NOT?', 700, 90, 54, BRASS2, SERIF, 'center', '700');
}
// ---- The Forgery: three or more land with a comic FAKE stamp and a sad trombone ----
function forgeryOnLine(r) { return r && r.wins.some(w => w.symbol === 'cherry'); }
function drawFake(now) {
  if (!fake) return; const t = now - fake.t0, d = reduced() ? 1200 : 2400; if (t > d) { fake = null; return; }
  const k = t < 220 ? 2.6 - 1.6 * ease(t / 220) : 1, a = t > d - 500 ? (d - t) / 500 : 1;
  sg.save(); sg.globalAlpha = a; sg.translate(700, 490); sg.scale(k, k); rubberStamp(sg, 'FAKE', 0, 0, 120, RED2, -.18, .92, 'NOT SATOSHI'); sg.restore();
}
