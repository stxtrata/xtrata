
/* ---------- Scenes: Coinbase Messages, Hashrate, 21 Million, Halve or Double, and two Lab events (Halving Day, Epoch snapshot) ---------- */
function darkRoom(g, a = .5) { g.drawImage(baseLayer, 0, 0); g.fillStyle = `rgba(4,5,6,${a})`; g.fillRect(0, 0, 1400, 960); }
function floodlight(g, cx, cy, r, a = .22, col = '255,210,63') { const gr = g.createRadialGradient(cx, cy, 10, cx, cy, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(.6, `rgba(${col},${a * .35})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2); }
// ---- Coinbase Messages: nine sealed blocks; each opened reveals a real coinbase message, its height and a prize ----
function messageFor(f, i) { const M = REC.messages || []; if (!M.length) return null; const perm = permFor(f.roundId || 'cb', M.length); return M[perm[i % M.length]]; }
function drawCoinbase(f, now) {
  const g = sg; darkRoom(g, .62); floodlight(g, 700, 470, 760, .14);
  const done = f.picks.length === 3; glowText(g, 'COINBASE MESSAGES', 700, 78, 58, AMBER2, LED); text(g, done ? 'THREE BLOCKS OPENED · THE MESSAGES ARE ON THE CHAIN FOR GOOD' : `OPEN ${3 - f.picks.length} OF NINE SEALED BLOCKS`, 700, 134, 20, '#fff6d0', MONO, 'center', '700'); text(g, `LAYR ${fmt(state.balance)}  ·  HASH ${fmt(f.bet)}`, 700, 168, 15, SMOKE, MONO, 'center', '700');
  // once all three are open, the other six seals crack one after another to show what was left behind
  const doneT = done ? Math.max(0, ...f.picks.map(i => (pres.reveal && pres.reveal[i]) || 0)) + 1300 : 0, rest = [...Array(9).keys()].filter(i => !f.picks.includes(i));
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), open = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (reduced() ? 1 : 1300) : (picked ? 1 : -1), m = messageFor(f, i);
    const ra = done && !picked ? (reduced() ? 1 : clamp01((now - doneT - rest.indexOf(i) * 140) / 450)) : 0;
    if (open >= 0 || ra > 0) {
      const k = picked ? ease(open * 1.3) : 1;
      g.save(); g.globalAlpha = picked ? 1 : .36 * ra;
      if (!picked && ra < 1) { const sh = ease(ra) * w / 2; g.save(); g.globalAlpha = 1 - ra * .7; g.beginPath(); g.rect(x, y, w, h); g.clip(); sealedBlock(g, x - sh, y, w / 2, h, 1); sealedBlock(g, x + w / 2 + sh, y, w / 2, h, 1); g.restore(); }
      // the seal splits: two halves of the block slide apart to show the coinbase script
      round(g, x, y, w, h, 8, '#06120c', picked ? AMBER : '#2c3036', picked ? 3 : 1.5);
      if (picked && k < 1) { const sh = (1 - k) * w / 2; g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); sealedBlock(g, x - (w / 2 - sh), y, w / 2, h, 1); sealedBlock(g, x + w - sh, y, w / 2, h, 1); g.restore(); }
      if (m) { const typed = picked ? Math.floor(m.text.length * clamp01(open * 1.6 - .25)) : m.text.length, t = m.text.slice(0, typed), size = m.text.length > 60 ? 13 : 16, ls = wrapLines(g, '“' + t + (typed < m.text.length ? '▌' : '”'), w - 200, size, MONO, '700');
        text(g, `BLOCK #${fmt(m.height)} · ${m.when.toUpperCase()}`, x + 14, y + 22, 13, AMBER2, MONO, 'left', '700'); ls.slice(0, 5).forEach((l, n) => text(g, l, x + 14, y + 48 + n * (size + 4), size, '#c9f5d9', MONO, 'left', '700')); text(g, `${m.pool.toUpperCase()} · ${m.why.toUpperCase()}`, x + 14, y + h - 16, 10, '#7fc79c', MONO, 'left', '700'); }
      const tx = x + w - 92;
      if (picked) { const val = Math.round(f.awards[i] * k); round(g, x + w - 172, y + 20, 160, h - 40, 6, '#000', AMBER3, 2); glowText(g, `${val}×`, tx, y + h / 2 - 16, 50, '#fff6d0', AMBER, '800', 'center', COND); text(g, `${fmt(f.awards[i] * f.bet * k)} LAYR`, tx, y + h / 2 + 26, 17, AMBER2, COND, 'center', '800');
        if (open < .14) { g.fillStyle = `rgba(255,240,190,${.7 * (1 - open / .14)})`; g.fillRect(x, y, w, h); } }
      else text(g, `${f.awards[i]}×`, tx, y + h / 2, 34, '#8a8577', COND, 'center', '800');
      g.restore();
    } else {
      const hv = pres.stage === 'play' ? .5 + .5 * Math.sin(now / 520 + i) : 0;
      sealedBlock(g, x, y, w, h, 0, hv);
      round(g, x + 22, y + 16, 76, 32, 4, '#0b0c0e', AMBER3, 1.5); text(g, `#${i + 1}`, x + 60, y + 33, 18, AMBER2, COND, 'center', '800');
      text(g, 'SEALED · COINBASE', x + w - 24, y + h - 20, 13, '#cfd5dc', MONO, 'right', '700');
      if (pres.stage === 'play' && !done) hits.push({ id: 'blk' + i, x, y, w, h, fn: () => pickBind(i) });
    }
  }
}
// ---- Hashrate: each lock adds a real mined block to a chain growing across the screen, with its pool and value ----
// each slot shows a different real block (a fixed shuffle per round; art only, never the outcome)
let blockPerm = { id: null, n: 0, perm: [] };
function blockFor(f, i) { const arr = pools.chain, id = f.roundId || 'hash'; if (blockPerm.id !== id || blockPerm.n !== arr.length) blockPerm = { id, n: arr.length, perm: permFor(id + 'blocks', arr.length) }; return arr[blockPerm.perm[i % arr.length]]; }
function lockOrder(f) { const order = []; f.frames.slice(0, f.index + 1).forEach((fr, k) => { const add = k === 0 ? fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0) : fr.added; add.forEach(i => { if (!order.includes(i)) order.push(i); }); }); return order; }
const cellRect = i => [RX + (i % 5) * CW + 8, RY + Math.floor(i / 5) * RHT + 8, CW - 19, RHT - 16];
function drawHashBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#0b0f0c', '#080a09', '#0e130f']); g.fillRect(0, 0, 1400, 960);
  g.save(); g.globalAlpha = .06; g.fillStyle = GREEN2; for (let y = 0; y < 960; y += 4) g.fillRect(0, y, 1400, 1.2); g.restore();
  // a hashrate trace behind the grid (decorative), drifting slowly so the rig never looks frozen
  const ph = reduced() ? 0 : now / 900; g.save(); g.strokeStyle = '#46c37b33'; g.lineWidth = 2; g.beginPath(); for (let x = 0; x <= 1400; x += 10) { const y = 520 - 120 * Math.sin(x / 210 + ph * .5) - 60 * Math.sin(x / 57 + 1 + ph * 1.3) - x * .12; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
}
/* Hashrate respins are animated: every empty slot spins as a little reel of mined blocks and stops in turn, left to right.
   The engine has already dealt the respin (E.respin) before any of this is drawn, so the show can never change it;
   pres.hash only says when each slot stops, and which of them land a block. Intro: the trigger's blocks link up one by one. */
function hashBusy(now = performance.now()) { return !!(pres && pres.hash && now < pres.hash.end); }
function startHashAnim(prev, prevLeft, fr, intro = false) {
  const now = performance.now(), R = reduced(), q = state.turbo, base = R ? 140 : q ? 380 : 760, step = R ? 0 : q ? 45 : 95;
  const spin = intro ? [] : prev.map((v, i) => v ? -1 : i).filter(i => i >= 0), stopAt = {}, landAt = {};
  spin.forEach(i => { stopAt[i] = now + base + (i % 5) * step + Math.floor(i / 5) * step * .35; });
  if (intro) fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0).forEach((i, k) => { landAt[i] = now + (R ? 0 : 350 + k * 200); });
  else fr.added.forEach(i => { landAt[i] = stopAt[i]; });
  const times = [...Object.values(stopAt), ...Object.values(landAt)], end = (times.length ? Math.max(...times) : now) + (R ? 0 : 160);
  pres.hash = { t0: now, prev, prevLeft, spin, stopAt, landAt, end, intro };
  chainFlash = now; ledPulse = now;
  // sound: the relays chatter while the slots spin, each column clicks as it stops, and every landed block thumps
  if (!intro) sound('respin');
  const cols = {}; spin.forEach(i => { if (!(i in landAt)) cols[i % 5] = Math.max(cols[i % 5] || 0, stopAt[i]); });
  Object.entries(cols).forEach(([c, t]) => setTimeout(() => { if (pres && pres.hash) relay(0, Number(c)); }, t - now));
  Object.entries(landAt).sort((a, b) => a[1] - b[1]).forEach(([i, t], k) => setTimeout(() => { if (pres && pres.hash) { sound('lock', 0); ledPulse = performance.now(); } }, Math.max(0, t - now)));
  setTimeout(() => { if (pres && pres.bonus === 'chain') { renderBar(); update(); } }, Math.max(0, end - now) + 20);
}
const hexAt = (n, len = 8) => { let h = (Math.imul(n | 0, 2654435761) ^ (n >>> 7)) >>> 0, s = ''; while (s.length < len) { s += (h & 15).toString(16); h = (h >>> 4) || Math.imul(h ^ 0x9e3779b9, 16777619) >>> 0 || 1; } return s.slice(0, len); };
function drawSpinCell(i, now, stopAt) {
  const [x, y, w, h] = cellRect(i), R = reduced(), arr = pools.chain, ts = h - 8, left = stopAt - now;
  round(sg, x, y, w, h, 8, '#07100b', '#2f7a4f', 2);
  sg.save(); sg.beginPath(); sg.rect(x + 2, y + 2, w - 4, h - 4); sg.clip();
  if (!R && arr.length) { // a reel of mined blocks streaming down behind the glass, slowing a little just before it stops
    const speed = left < 220 ? .7 + 1.1 * left / 220 : 1.8, pos = now * speed + i * 53, off = pos % h, base = Math.floor(pos / h);
    sg.globalAlpha = .4; for (let k = -1; k <= 0; k++) { const e = arr[(base - k + i * 7) % arr.length]; sg.drawImage(e.tile, x + (w - ts) / 2, y + 4 + off + k * h, ts, ts); }
    sg.globalAlpha = 1; const gr = sg.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgba(7,16,11,.9)'); gr.addColorStop(.3, 'rgba(7,16,11,.25)'); gr.addColorStop(.7, 'rgba(7,16,11,.25)'); gr.addColorStop(1, 'rgba(7,16,11,.9)'); sg.fillStyle = gr; sg.fillRect(x, y, w, h);
  }
  sg.restore();
  const pulse = R ? 1 : .6 + .4 * Math.sin(now / 70 + i);
  round(sg, x + w / 2 - 86, y + h / 2 - 34, 172, 66, 6, 'rgba(4,10,7,.82)', '#2f7a4f', 1.5); // a readout plate over the streaming blocks
  sg.save(); sg.globalAlpha = pulse; text(sg, 'HASHING', x + w / 2, y + h / 2 - 10, 22, GREEN2, COND, 'center', '800'); sg.restore();
  text(sg, '0000' + hexAt(Math.floor(now / 45) * 31 + i), x + w / 2, y + h / 2 + 18, 14, '#9cf0bd', MONO, 'center', '700');
}
function drawHashrate(f, now) {
  drawHashBackdrop(now);
  const R = reduced(), fr = f.frames[f.index], A = pres && pres.hash && now < pres.hash.end + 1200 ? pres.hash : null;
  // what each slot shows right now: a block that has landed, a slot still spinning, or an empty slot
  const landed = i => !!fr.cells[i] && !(A && A.landAt[i] != null && now < A.landAt[i]);
  const spinningAt = i => !!(A && A.stopAt[i] != null && now < A.stopAt[i]);
  const ageOf = i => A && A.landAt[i] != null ? (now - A.landAt[i]) / 900 : 9;
  const vis = fr.cells.map((v, i) => landed(i) ? v : 0), n = vis.filter(Boolean).length;
  spaced(sg, 'HASHRATE', 700, 46, 40, 8, GREEN2, '800');
  text(sg, `${n} OF 15 BLOCKS MINED  ·  ${fmt(vis.reduce((a, v) => a + (v || 0), 0))}× YOUR BET IN THE CHAIN`, 700, 92, 20, '#d9f2e3', MONO, 'center', '700');
  text(sg, 'EVERY NEW BLOCK RESETS THE RESPINS · MINE ALL 15 FOR THE 21 MILLION JACKPOT', 700, 120, 13, '#7fc79c', MONO, 'center', '700');
  // respin lights: the respin being played goes out as the slots start, and all three relight the moment a new block lands
  let left = fr.left, fading = -1, relit = 0;
  if (A && !A.intro && now < A.end) { const firstLand = Math.min(...Object.values(A.landAt), Infinity); if (now < firstLand) { left = Math.max(0, A.prevLeft - 1); fading = left; } else relit = now - firstLand; }
  else if (A && !A.intro && A.spin.length && Object.keys(A.landAt).length) relit = now - Math.min(...Object.values(A.landAt));
  round(sg, 520, 140, 360, 50, 6, '#0b130e', GREEN, 2); text(sg, 'RESPINS LEFT', 618, 165, 16, '#9cf0bd', COND, 'center', '800');
  for (let k = 0; k < 3; k++) { let on = k < left ? 1 : 0; if (k === fading && !R) on = Math.max(0, 1 - (now - A.t0) / 320); const flash = relit > 0 && relit < 700 && !R ? 1 + .5 * (1 - relit / 700) : 1;
    sg.save(); sg.shadowColor = on ? GREEN2 : '#000'; sg.shadowBlur = on ? 12 * flash : 0; sg.fillStyle = on ? GREEN2 : '#1f2d24'; sg.globalAlpha = on ? Math.max(.25, on) : 1; sg.beginPath(); sg.arc(760 + k * 34, 165, 11 * (on ? Math.min(1.25, flash) : 1), 0, 7); sg.fill(); sg.restore(); }
  // empty slots: still mining, a nonce ticking over; a slot that has just stopped empty says so briefly
  fr.cells.forEach((v, i) => { if (landed(i) || spinningAt(i)) return;
    const [x, y, w, h] = cellRect(i); round(sg, x, y, w, h, 8, '#0a100c', '#1f3527', 2); sg.save(); sg.setLineDash([6, 6]); sg.strokeStyle = '#2f5a40'; sg.strokeRect(x + 10, y + 10, w - 20, h - 20); sg.restore();
    const missed = A && A.stopAt[i] != null && now - A.stopAt[i] < 520 && !R;
    if (missed) { const a = 1 - (now - A.stopAt[i]) / 520; sg.save(); sg.globalAlpha = a; round(sg, x, y, w, h, 8, null, '#7a3b2f', 3); sg.restore(); text(sg, 'NO BLOCK', x + w / 2, y + h / 2 - 8, 20, `rgba(255,150,120,${.35 + .65 * a})`, COND, 'center', '800'); }
    else text(sg, 'MINING…', x + w / 2, y + h / 2 - 8, 18, '#2f5a40', COND, 'center', '800');
    text(sg, '1 IN 25 PER RESPIN', x + w / 2, y + h / 2 + 18, 11, '#24432f', MONO, 'center', '700');
    text(sg, `NONCE ${hexAt(R ? i : Math.floor(now / 140) + i * 977)}`, x + w / 2, y + h - 22, 10, '#2c5a3e', MONO, 'center', '700'); });
  // slots still spinning
  fr.cells.forEach((v, i) => { if (spinningAt(i)) drawSpinCell(i, now, A.stopAt[i]); });
  // the chain: links from block to block in the order they were mined, the newest drawn as it lands
  const order = lockOrder(f).filter(landed), pts = order.map(i => { const [x, y, w, h] = cellRect(i); return [x + w / 2, y + h / 2]; });
  sg.save(); sg.lineCap = 'round'; for (let k = 1; k < pts.length; k++) { const age = ageOf(order[k]), isNew = age < 1, u = isNew && !R ? ease(age * 1.5) : 1, [x0, y0] = pts[k - 1], [x1, y1] = pts[k], xe = x0 + (x1 - x0) * u, ye = y0 + (y1 - y0) * u;
    sg.strokeStyle = '#0008'; sg.lineWidth = 14; sg.beginPath(); sg.moveTo(x0, y0); sg.lineTo(xe, ye); sg.stroke(); sg.strokeStyle = isNew ? GREEN2 : '#5f8f72'; sg.lineWidth = 6; sg.setLineDash([16, 8]); sg.lineDashOffset = R ? 0 : -now / 40; sg.beginPath(); sg.moveTo(x0, y0); sg.lineTo(xe, ye); sg.stroke(); sg.setLineDash([]); }
  sg.restore();
  fr.cells.forEach((v, i) => { if (!landed(i)) return; const [x, y, w, h] = cellRect(i), age = ageOf(i), isNew = age < 1, e = blockFor(f, i), ts = h - 8, k0 = order.indexOf(i);
    sg.save(); if (isNew && !R) { const k = 1 + .3 * (1 - ease(age * 1.6)); sg.translate(x + w / 2, y + h / 2); sg.scale(k, k); sg.translate(-x - w / 2, -y - h / 2); }
    round(sg, x, y, w, h, 8, '#0b130e', isNew ? GREEN2 : '#2f7a4f', isNew ? 4 : 2); sg.drawImage(e.tile, x + 2, y + 2, ts, ts); const tx = x + ts + (w - ts) / 2;
    glowText(sg, `${v}×`, tx, y + h / 2 - 12, 34, '#fff', GREEN, '800', 'center', COND); text(sg, fmt(v * f.bet), tx, y + h / 2 + 18, 13, '#9cf0bd', MONO, 'center', '700'); text(sg, `LINK ${k0 + 1}`, tx, y + h / 2 + 38, 10, '#5f8f72', MONO, 'center', '700');
    if (isNew) { sg.fillStyle = `rgba(200,255,220,${.6 * (1 - age)})`; sg.fillRect(x, y, w, h); }
    else if (!R) { const glint = (now / 2600 + k0 * .13) % 1; if (glint < .12) { sg.fillStyle = `rgba(200,255,220,${.12 * Math.sin(glint / .12 * Math.PI)})`; sg.fillRect(x, y, w, h); } } // a slow glint runs along the chain
    sg.restore(); if (isNew) rubberStamp(sg, 'MINED', x + ts * .5, y + h * .5, 18, GREEN2, -.12, 1 - age * .4); });
}
// ---- 21 Million (jackpot): every split-flap digit flips at once, then the meter counts up ----
function drawJackpot(now) {
  const p = pres, t = now - p.t0, R = reduced(), k = ease((t - (R ? 200 : 1600)) / (R ? 800 : 2400));
  sg.fillStyle = lin(sg, 0, 0, 0, 960, ['#050505', '#1a1505', '#050505']); sg.fillRect(0, 0, 1400, 960);
  if (!R) { sg.save(); sg.translate(700, 380); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12 + t / 3200; sg.fillStyle = i % 2 ? 'rgba(255,210,63,.09)' : 'rgba(255,250,220,.04)'; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 1100, a, a + Math.PI / 24); sg.closePath(); sg.fill(); } sg.restore(); }
  glowText(sg, '21 MILLION', 700, 96, 92, AMBER2, LED);
  // the board: 21,000,000 on flaps, cascading left to right until it settles
  round(sg, 120, 170, 1160, 250, 10, '#000', AMBER3, 4); spaced(sg, 'THE SUPPLY CAP', 700, 196, 20, 8, AMBER, '800');
  flapCells(sg, '21,000,000', 700, 300, 150, { w: .52, col: AMBER2, scramble: true, flip: i => R ? 1 : (t - 300 - i * 140) / 520 });
  text(sg, 'NEVER MORE · NOT ONE SATOSHI MORE', 700, 400, 20, '#fff6d0', MONO, 'center', '700');
  // the meter, counting up
  text(sg, 'JACKPOT PAID', 700, 486, 24, SMOKE, COND, 'center', '800');
  if (t > (R ? 100 : 1500)) flapCells(sg, fmt(Math.round(p.amount * k)), 700, 576, 110, { w: .58, col: '#fff' });
  text(sg, `LAYR · ${fmt(p.bet)} BET LEVEL · THE METER RESETS TO ITS SEED`, 700, 680, 22, AMBER2, COND, 'center', '800');
  if (!R) { sg.save(); for (let i = 0; i < 26; i++) { const ph = (t / 1000 + i * .37) % 3, x = (i * 173) % 1400, y = -40 + ph * 360; coinFace(sg, x, y, 18 + (i % 3) * 6, i % 5, { label: false, glow: 8 }); } sg.restore(); }
}
// ---- Halve or Double: a coin with a ½ face (HALVE) and a ×2 face (DOUBLE); call it right to double the win ----
function gambleFace(g, r, side) {
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = side === 'double' ? lin(g, 0, -r, 0, r, [AMBER2, AMBER, AMBER3]) : lin(g, 0, -r, 0, r, ['#f2f4f7', '#b9c0c9', '#5f6873']); g.fill(); g.lineWidth = 8; g.strokeStyle = side === 'double' ? '#fff4c8' : '#e9edf2'; g.stroke();
  g.beginPath(); g.arc(0, 0, r - 16, 0, 7); g.lineWidth = 2; g.strokeStyle = side === 'double' ? '#6b5308' : '#3b4047'; g.stroke();
  text(g, side === 'double' ? '×2' : '½', 0, 4, r * .86, INK, COND, 'center', '800'); text(g, side === 'double' ? 'DOUBLE' : 'HALVE', 0, r * .62, r * .16, INK, COND, 'center', '800');
}
function drawCoin(g, cx, cy, r, angle) {
  const k = Math.cos(angle), side = k >= 0 ? 'double' : 'halve', w = Math.max(.04, Math.abs(k));
  g.save(); g.translate(cx, cy); g.scale(w, 1); g.shadowColor = side === 'double' ? AMBER : '#cfd5dc'; g.shadowBlur = 30; gambleFace(g, r, side); g.restore();
}
function drawGamble(now) {
  const g = sg; darkRoom(g, .55); floodlight(g, 700, 430, 560, .22);
  const p = pres, t = now - p.t0; let angle = 0, ly = 430;
  const fin = p.result && p.result.parity === 'odd' ? Math.PI : 0; // odd lands ½ (HALVE), even lands ×2 (DOUBLE)
  if (p.stage === 'play') { const u = clamp01(t / (reduced() ? 600 : 1800)); angle = (reduced() ? 0 : Math.PI * 2 * 6 * easeIO(u)) + (reduced() ? (u > .5 ? fin : 0) : fin * easeIO(u)); ly = 430 - Math.sin(u * Math.PI) * (reduced() ? 0 : 190); }
  else if (p.stage === 'summary') angle = fin; else angle = Math.sin(now / 700) * .5;
  drawCoin(g, 700, ly, 150, angle);
  glowText(g, 'HALVE OR DOUBLE', 700, 90, 60, AMBER2, LED);
  if (p.stage === 'play' || p.stage === 'summary') text(g, `YOU CALLED ${p.choice === 'odd' ? '½ HALVE' : '×2 DOUBLE'}`, 700, 650, 26, '#fff6d0', COND, 'center', '800');
}
// ---- Halving Day (Lab event): the flap board counts down its last blocks, the subsidy halves, the coin splits ----
function drawHalvingDay(now) {
  const p = pres, t = now - p.t0, R = reduced(), g = sg; darkRoom(g, .7); floodlight(g, 700, 360, 700, .16);
  const hd = halvingDay || { n: 0, at: p.t0 - 5000 }, n = hd.n; /* after the summary clears halvingDay, draw the finished state */ glowText(g, 'HALVING DAY', 700, 80, 64, AMBER2, LED); text(g, 'A REHEARSAL OF THE NEXT HALVING · NO LAYR CHANGES HANDS', 700, 128, 16, SMOKE, MONO, 'center', '700');
  round(g, 220, 170, 960, 220, 10, '#000', AMBER3, 4); spaced(g, 'BLOCKS TO THE HALVING', 700, 196, 20, 6, AMBER, '800');
  flapCells(g, `000,00${n}`, 700, 296, 130, { w: .6, col: '#fff6d0', scramble: true, flip: i => R ? 1 : (now - hd.at - i * 50) / 380 });
  if (n === 0) { const k = R ? 1 : ease((now - hd.at - 400) / 1200); [-1, 1].forEach(sx => { g.save(); g.beginPath(); g.rect(sx < 0 ? 0 : 700, 380, 700, 560); g.clip(); g.translate(sx * 150 * k, 0); g.rotate(sx * .2 * k); coinFace(g, 700, 620, 150, 4, { label: false }); g.restore(); });
    if (k > .4) { glowText(g, '3.125 → 1.5625 BTC', 700, 620, 64, '#fff', AMBER, '800'); text(g, `BLOCK ${fmt(REC.next.height || 1050000)} · THE FIFTH HALVING`, 700, 690, 22, AMBER2, COND, 'center', '800'); } }
  else coinFace(g, 700, 620, 150, 4);
}
// ---- Epoch snapshot (Lab event): the difficulty adjustment closes the Epoch Pot and divides it per twin ----
function drawEpoch(now) {
  const p = pres, t = now - p.t0, R = reduced(), g = sg; darkRoom(g, .7);
  glowText(g, 'EPOCH SNAPSHOT', 700, 80, 60, AMBER2, LED); text(g, 'EVERY 2,016 BLOCKS THE DIFFICULTY ADJUSTS · THE EPOCH POT IS SHARED PER TWIN', 700, 128, 15, SMOKE, MONO, 'center', '700');
  round(g, 140, 170, 1120, 120, 8, '#000', '#3b4047', 2); text(g, 'SNAPSHOT BLOCK', 700, 196, 15, SMOKE, MONO, 'center', '700'); flapCells(g, fmt(p.block), 700, 248, 64, { w: .6, col: '#fff6d0', scramble: true, flip: i => R ? 1 : (t - i * 90) / 400 });
  if (t > (R ? 0 : 1300)) {
    const cu = R ? 1 : ease((t - 1300) / 1100); // the pot and the share count up as the snapshot is divided
    text(g, `EPOCH POT ${fmt(Math.round(p.pot * cu))} LAYR  ÷  ${p.twins ? fmt(p.twins) + ' TWINS' : 'TWINS UNKNOWN'}`, 700, 360, 32, PAPER, COND, 'center', '800');
    glowText(g, p.twins ? `= ${fmt(cu < 1 ? r2(p.pot / p.twins * cu) : r2(p.pot / p.twins))} LAYR PER TWIN` : 'NO SHARE WITHOUT A TWIN COUNT', 700, 430, 58, '#fff6d0', AMBER, '800');
    text(g, 'Display only: the snapshot service and claims come in the holder layer v2.', 700, 500, 18, SMOKE, SANS, 'center', 'italic 400');
  }
}
