
/* ---------- Scenes: Reward Slots, Fast Blocks, Bitcoin Finality, Stack or Unstack, and two Lab events (Cycle Snapshot, Cycle Turnover) ---------- */
function darkRoom(g, a = .5) { g.drawImage(baseLayer, 0, 0); g.fillStyle = `rgba(4,4,8,${a})`; g.fillRect(0, 0, 1400, 960); }
function bloom(g, cx, cy, r, a = .22, col = '85,70,255') { const gr = g.createRadialGradient(cx, cy, 10, cx, cy, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(.6, `rgba(${col},${a * .35})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2); }
// ---- Reward Slots: nine sealed reward envelopes; each opened shows a real stacking cycle (STX stacked, signers) and a prize ----
function cycleFor(f, i) { const C = REC.cycles || []; if (!C.length) return null; const perm = permFor(f.roundId || 'rs', C.length); return C[perm[i % C.length]]; }
function envelope(g, x, y, w, h, open = 0, glow = 0, n = 0) {
  g.save(); g.shadowColor = glow ? ORANGE : '#000'; g.shadowBlur = 8 + glow * 20; g.shadowOffsetY = glow ? 0 : 5; round(g, x, y, w, h, 10, lin(g, x, y, x, y + h, ['#f3efff', '#e2dcf6'])); g.restore();
  // the folds: two lower flaps meeting in the middle
  g.fillStyle = '#d6cfee'; g.beginPath(); g.moveTo(x + 6, y + h - 4); g.lineTo(x + w / 2, y + h * .48); g.lineTo(x + w - 6, y + h - 4); g.closePath(); g.fill();
  g.strokeStyle = '#bdb3e0'; g.lineWidth = 1.5; g.stroke();
  // the top flap: closed it points down; opening, it folds up and over (scaled through zero)
  const k = Math.cos(Math.PI * clamp01(open)), fy = y + 4, tip = y + h * .58;
  g.save(); g.fillStyle = k >= 0 ? '#e9e3fb' : '#cfc6ec'; g.beginPath(); g.moveTo(x + 4, fy); g.lineTo(x + w / 2, fy + (tip - fy) * k); g.lineTo(x + w - 4, fy); g.closePath(); g.fill(); g.strokeStyle = '#bdb3e0'; g.stroke(); g.restore();
  if (open < .5) { const sx = x + w / 2, sy = y + (tip - y) * k - 2, r = Math.min(w, h) * .17; g.save(); g.shadowColor = ORANGE; g.shadowBlur = 8 + glow * 14; g.fillStyle = lin(g, sx - r, sy - r, sx + r, sy + r, [ORANGE2, ORANGE, ORANGE3]); g.beginPath(); for (let a = 0; a < 18; a++) { const rr = r * (a % 2 ? .9 : 1), ang = a / 18 * Math.PI * 2; g.lineTo(sx + Math.cos(ang) * rr, sy + Math.sin(ang) * rr); } g.closePath(); g.fill(); g.restore(); btcLogo(g, sx, sy, r * 1.25); }
  if (n) { round(g, x + 14, y + h - 36, 46, 26, 13, '#2a1f8c'); text(g, `#${n}`, x + 37, y + h - 23, 15, '#fff', SANS, 'center', '800'); }
}
function cycleCard(g, x, y, w, h, c, alpha = 1) {
  g.save(); g.globalAlpha = alpha; glassPanel(g, x, y, w, h, 12, PURPLE2, 2, lin(g, x, y, x, y + h, ['#1d1850', '#0b0920']));
  if (c) { text(g, 'STACKING CYCLE', x + 16, y + 22, 12, MUTED, MONO, 'left', '700'); text(g, String(c.cycle), x + 16, y + 62, 46, '#fff', COND, 'left', '800');
    text(g, `${mstx(c.stackedUstx)} STX STACKED`, x + 16, y + 104, 15, ORANGE2, SANS, 'left', '800'); text(g, `${c.signers} SIGNERS · FROM STACKS #${fmt(c.startBlock)}`, x + 16, y + h - 18, 11, TXT, MONO, 'left', '700'); stackBars(g, x + w * .43, y + 52, 60, 4, PURPLE2, ORANGE, 8, 5); }
  g.restore();
}
function drawRewards(f, now) {
  const g = sg; darkRoom(g, .55); bloom(g, 700, 470, 760, .16);
  const done = f.picks.length === 3; gradText(g, 'REWARD SLOTS', 700, 78, 58); text(g, done ? 'THREE ENVELOPES OPENED · EACH HELD A REAL STACKING CYCLE' : `OPEN ${3 - f.picks.length} OF NINE SEALED REWARD ENVELOPES`, 700, 134, 20, TXT, MONO, 'center', '700'); text(g, `LAYR ${fmt(state.balance)}  ·  STX BET ${fmt(f.bet)}`, 700, 168, 15, MUTED, MONO, 'center', '700');
  const doneT = done ? Math.max(0, ...f.picks.map(i => (pres.reveal && pres.reveal[i]) || 0)) + 1300 : 0, rest = [...Array(9).keys()].filter(i => !f.picks.includes(i));
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), open = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (reduced() ? 1 : 1300) : (picked ? 1 : -1), c = cycleFor(f, i);
    const ra = done && !picked ? (reduced() ? 1 : clamp01((now - doneT - rest.indexOf(i) * 140) / 450)) : 0;
    if (open >= 0 || ra > 0) {
      const k = picked ? ease(open * 1.3) : 1, cw = w - 190, slide = picked ? (1 - ease(clamp01(open * 1.6 - .35))) * (h * .7) : 0;
      if (picked) { envelope(g, x, y, w, h, Math.min(1, open * 2.2), 0); g.save(); g.beginPath(); g.rect(x, y - 30, w, h + 30); g.clip(); cycleCard(g, x + 12, y + 12 + slide, cw, h - 24, c, clamp01(open * 3)); g.restore(); }
      else { g.save(); g.globalAlpha = .3 + .25 * ra; envelope(g, x, y, w, h, 1, 0); cycleCard(g, x + 12, y + 12, cw, h - 24, c, .8); g.restore(); }
      const tx = x + w - 92;
      if (picked) { const val = Math.round(f.awards[i] * k); round(g, x + w - 172, y + 16, 160, h - 32, 14, '#07070b', ORANGE, 2); glowText(g, `${val}×`, tx, y + h / 2 - 16, 50, '#fff', ORANGE, '800', 'center', COND); text(g, `${fmt(f.awards[i] * f.bet * k)} LAYR`, tx, y + h / 2 + 26, 17, ORANGE2, SANS, 'center', '800');
        if (open < .14) { g.fillStyle = `rgba(255,236,226,${.7 * (1 - open / .14)})`; g.fillRect(x, y, w, h); } }
      else { g.save(); g.globalAlpha = .3 + .5 * ra; round(g, x + w - 172, y + 16, 160, h - 32, 14, '#07070b', '#3a3a52', 1.5); text(g, `${f.awards[i]}×`, tx, y + h / 2, 34, '#8b89a8', COND, 'center', '800'); g.restore(); }
    } else {
      const hv = pres.stage === 'play' ? .5 + .5 * Math.sin(now / 520 + i) : 0;
      envelope(g, x + (w - 300) / 2, y + 6, 300, h - 12, 0, hv, i + 1);
      if (pres.stage === 'play' && !done) hits.push({ id: 'env' + i, x, y, w, h, fn: () => pickBind(i) });
    }
  }
}
// ---- Fast Blocks: each lock is a real recent Stacks block, stacked on a Bitcoin block at the bottom of the screen ----
let blockPerm = { id: null, n: 0, perm: [] };
function blockFor(f, i) { const arr = pools.chain, id = f.roundId || 'fast'; if (blockPerm.id !== id || blockPerm.n !== arr.length) blockPerm = { id, n: arr.length, perm: permFor(id + 'blocks', arr.length) }; return arr[blockPerm.perm[i % arr.length]]; }
function lockOrder(f) { const order = []; f.frames.slice(0, f.index + 1).forEach((fr, k) => { const add = k === 0 ? fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0) : fr.added; add.forEach(i => { if (!order.includes(i)) order.push(i); }); }); return order; }
const cellRect = i => [RX + (i % 5) * CW + 8, RY + Math.floor(i / 5) * RHT + 8, CW - 19, RHT - 16];
const anchorBlock = () => (chain.burnRecent && chain.burnRecent[0]) || (REC.burn || [])[0] || { height: burnNow(), hash: '' };
function drawFastBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#0b0a1c', '#07070b', '#120a08']); g.fillRect(0, 0, 1400, 960);
  g.save(); g.globalAlpha = .07; g.strokeStyle = PURPLE2; for (let x = 0; x <= 1400; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 960); g.stroke(); } g.restore();
  // the Bitcoin block every Stacks block here settles on: a wide orange slab along the bottom, with its real height and hash
  const b = anchorBlock(), ph = reduced() ? 0 : now / 1400;
  g.save(); g.shadowColor = BTC; g.shadowBlur = 24; round(g, 40, 784, 1320, 26, 8, lin(g, 0, 784, 0, 810, ['#ffb35c', BTC, '#a85d00'])); g.restore();
  text(g, `ANCHORED TO BITCOIN BLOCK #${fmt(b.height)} · ${short(b.hash || '')}`, 700, 798, 13, INK, MONO, 'center', '800');
  g.save(); g.globalAlpha = .18 + .06 * Math.sin(ph); g.strokeStyle = BTC; g.setLineDash([3, 7]); for (let c = 0; c < 5; c++) { const x = RX + (c + .5) * CW; g.beginPath(); g.moveTo(x, RY + RH - 4); g.lineTo(x, 784); g.stroke(); } g.restore();
}
/* Fast Blocks respins are animated: every empty slot streams real blocks and stops in turn, left to right. The engine has
   already dealt the respin (E.respin) before any of this is drawn, so the show can never change it; pres.fast only says when
   each slot stops, and which of them land a block. Intro: the trigger's blocks stack up one by one. */
function fastBusy(now = performance.now()) { return !!(pres && pres.fast && now < pres.fast.end); }
function startFastAnim(prev, prevLeft, fr, intro = false) {
  const now = performance.now(), R = reduced(), q = state.turbo, base = R ? 140 : q ? 380 : 760, step = R ? 0 : q ? 45 : 95;
  const spin = intro ? [] : prev.map((v, i) => v ? -1 : i).filter(i => i >= 0), stopAt = {}, landAt = {};
  spin.forEach(i => { stopAt[i] = now + base + (i % 5) * step + Math.floor(i / 5) * step * .35; });
  if (intro) fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0).forEach((i, k) => { landAt[i] = now + (R ? 0 : 350 + k * 200); });
  else fr.added.forEach(i => { landAt[i] = stopAt[i]; });
  const times = [...Object.values(stopAt), ...Object.values(landAt)], end = (times.length ? Math.max(...times) : now) + (R ? 0 : 160);
  pres.fast = { t0: now, prev, prevLeft, spin, stopAt, landAt, end, intro };
  chainFlash = now; ledPulse = now;
  if (!intro) sound('respin');
  const cols = {}; spin.forEach(i => { if (!(i in landAt)) cols[i % 5] = Math.max(cols[i % 5] || 0, stopAt[i]); });
  Object.entries(cols).forEach(([c, t]) => setTimeout(() => { if (pres && pres.fast) blip(0, Number(c)); }, t - now));
  Object.entries(landAt).sort((a, b) => a[1] - b[1]).forEach(([i, t], k) => setTimeout(() => { if (pres && pres.fast) { sound('lock', 0); ledPulse = performance.now(); } }, Math.max(0, t - now)));
  setTimeout(() => { if (pres && pres.bonus === 'chain') { renderBar(); update(); } }, Math.max(0, end - now) + 20);
}
const hexAt = (n, len = 8) => { let h = (Math.imul(n | 0, 2654435761) ^ (n >>> 7)) >>> 0, s = ''; while (s.length < len) { s += (h & 15).toString(16); h = (h >>> 4) || Math.imul(h ^ 0x9e3779b9, 16777619) >>> 0 || 1; } return s.slice(0, len); };
function drawSpinCell(i, now, stopAt) {
  const [x, y, w, h] = cellRect(i), R = reduced(), arr = pools.chain, ts = h - 8, left = stopAt - now;
  round(sg, x, y, w, h, 14, '#0c0a20', PURPLE, 2);
  sg.save(); sg.beginPath(); sg.roundRect(x + 2, y + 2, w - 4, h - 4, 12); sg.clip();
  if (!R && arr.length) { const speed = left < 220 ? .7 + 1.1 * left / 220 : 1.8, pos = now * speed + i * 53, off = pos % h, base = Math.floor(pos / h);
    sg.globalAlpha = .4; for (let k = -1; k <= 0; k++) { const e = arr[(base - k + i * 7) % arr.length]; sg.drawImage(e.tile, x + (w - ts) / 2, y + 4 + off + k * h, ts, ts); }
    sg.globalAlpha = 1; const gr = sg.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgba(12,10,32,.9)'); gr.addColorStop(.3, 'rgba(12,10,32,.25)'); gr.addColorStop(.7, 'rgba(12,10,32,.25)'); gr.addColorStop(1, 'rgba(12,10,32,.9)'); sg.fillStyle = gr; sg.fillRect(x, y, w, h); }
  sg.restore();
  const pulse = R ? 1 : .6 + .4 * Math.sin(now / 70 + i);
  round(sg, x + w / 2 - 86, y + h / 2 - 34, 172, 66, 14, 'rgba(8,6,24,.85)', PURPLE, 1.5);
  sg.save(); sg.globalAlpha = pulse; text(sg, 'PRODUCING', x + w / 2, y + h / 2 - 10, 20, PURPLE2, SANS, 'center', '800'); sg.restore();
  text(sg, '0x' + hexAt(Math.floor(now / 45) * 31 + i), x + w / 2, y + h / 2 + 18, 14, TXT, MONO, 'center', '700');
}
function drawFastBlocks(f, now) {
  drawFastBackdrop(now);
  const R = reduced(), fr = f.frames[f.index], A = pres && pres.fast && now < pres.fast.end + 1200 ? pres.fast : null;
  const landed = i => !!fr.cells[i] && !(A && A.landAt[i] != null && now < A.landAt[i]);
  const spinningAt = i => !!(A && A.stopAt[i] != null && now < A.stopAt[i]);
  const ageOf = i => A && A.landAt[i] != null ? (now - A.landAt[i]) / 900 : 9;
  const vis = fr.cells.map((v, i) => landed(i) ? v : 0), n = vis.filter(Boolean).length;
  gradText(sg, 'FAST BLOCKS', 700, 46, 42);
  text(sg, `${n} OF 15 BLOCKS STACKED  ·  ${fmt(vis.reduce((a, v) => a + (v || 0), 0))}× YOUR BET`, 700, 92, 20, TXT, MONO, 'center', '700');
  text(sg, 'EVERY NEW BLOCK RESETS THE RESPINS · STACK ALL 15 FOR BITCOIN FINALITY', 700, 120, 13, MUTED, MONO, 'center', '700');
  let left = fr.left, fading = -1, relit = 0;
  if (A && !A.intro && now < A.end) { const firstLand = Math.min(...Object.values(A.landAt), Infinity); if (now < firstLand) { left = Math.max(0, A.prevLeft - 1); fading = left; } else relit = now - firstLand; }
  else if (A && !A.intro && A.spin.length && Object.keys(A.landAt).length) relit = now - Math.min(...Object.values(A.landAt));
  round(sg, 520, 140, 360, 50, 25, '#0c0a20', PURPLE, 2); text(sg, 'RESPINS LEFT', 618, 165, 16, PURPLE2, SANS, 'center', '800');
  for (let k = 0; k < 3; k++) { let on = k < left ? 1 : 0; if (k === fading && !R) on = Math.max(0, 1 - (now - A.t0) / 320); const flash = relit > 0 && relit < 700 && !R ? 1 + .5 * (1 - relit / 700) : 1;
    sg.save(); sg.shadowColor = on ? ORANGE : '#000'; sg.shadowBlur = on ? 12 * flash : 0; sg.fillStyle = on ? ORANGE : '#251f3a'; sg.globalAlpha = on ? Math.max(.25, on) : 1; round(sg, 744 + k * 40 - 15 * (on ? Math.min(1.2, flash) : 1), 158, 30 * (on ? Math.min(1.2, flash) : 1), 14, 7, sg.fillStyle); sg.restore(); }
  fr.cells.forEach((v, i) => { if (landed(i) || spinningAt(i)) return;
    const [x, y, w, h] = cellRect(i); round(sg, x, y, w, h, 14, '#0a0918', '#221d3e', 2); sg.save(); sg.setLineDash([6, 6]); sg.strokeStyle = '#3a3264'; sg.beginPath(); sg.roundRect(x + 10, y + 10, w - 20, h - 20, 10); sg.stroke(); sg.restore();
    const missed = A && A.stopAt[i] != null && now - A.stopAt[i] < 520 && !R;
    if (missed) { const a = 1 - (now - A.stopAt[i]) / 520; sg.save(); sg.globalAlpha = a; round(sg, x, y, w, h, 14, null, '#7a3b4f', 3); sg.restore(); text(sg, 'NO BLOCK', x + w / 2, y + h / 2 - 8, 20, `rgba(255,150,170,${.35 + .65 * a})`, SANS, 'center', '800'); }
    else text(sg, 'WAITING…', x + w / 2, y + h / 2 - 8, 18, '#3a3264', SANS, 'center', '800');
    text(sg, '1 IN 25 PER RESPIN', x + w / 2, y + h / 2 + 18, 11, '#2e2850', MONO, 'center', '700'); });
  fr.cells.forEach((v, i) => { if (spinningAt(i)) drawSpinCell(i, now, A.stopAt[i]); });
  const order = lockOrder(f).filter(landed);
  fr.cells.forEach((v, i) => { if (!landed(i)) return; const [x, y, w, h] = cellRect(i), age = ageOf(i), isNew = age < 1, e = blockFor(f, i), ts = h - 8, k0 = order.indexOf(i);
    sg.save(); if (isNew && !R) { const drop = (1 - ease(age * 1.8)) * -80; sg.translate(0, drop); }
    round(sg, x, y, w, h, 14, '#0e0b26', isNew ? ORANGE : PURPLE, isNew ? 4 : 2); sg.drawImage(e.tile, x + 2, y + 2, ts, ts); const tx = x + ts + (w - ts) / 2;
    glowText(sg, `${v}×`, tx, y + h / 2 - 12, 34, '#fff', ORANGE, '800', 'center', COND); text(sg, fmt(v * f.bet), tx, y + h / 2 + 18, 13, ORANGE2, MONO, 'center', '700'); text(sg, `#${k0 + 1}`, tx, y + h / 2 + 38, 10, MUTED, MONO, 'center', '700');
    if (isNew) { sg.fillStyle = `rgba(255,220,200,${.5 * (1 - age)})`; sg.fillRect(x, y, w, h); }
    else if (!R) { const glint = (now / 2600 + k0 * .13) % 1; if (glint < .12) { sg.fillStyle = `rgba(200,190,255,${.12 * Math.sin(glint / .12 * Math.PI)})`; sg.fillRect(x, y, w, h); } }
    sg.restore(); if (isNew) rubberStamp(sg, 'STACKED', x + ts * .5, y + h * .5, 18, ORANGE2, -.12, 1 - age * .4); });
}
// ---- Bitcoin Finality (jackpot): Stacks blocks fall and settle on a Bitcoin block, then the meter counts up ----
function drawJackpot(now) {
  const p = pres, t = now - p.t0, R = reduced(), k = ease((t - (R ? 200 : 1600)) / (R ? 800 : 2400));
  sg.fillStyle = lin(sg, 0, 0, 0, 960, ['#050508', '#1c0f04', '#050508']); sg.fillRect(0, 0, 1400, 960);
  if (!R) { sg.save(); sg.translate(700, 330); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12 + t / 3200; sg.fillStyle = i % 2 ? 'rgba(247,147,26,.08)' : 'rgba(143,132,255,.05)'; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 1100, a, a + Math.PI / 24); sg.closePath(); sg.fill(); } sg.restore(); }
  btcLogo(sg, 700, 190, R ? 180 : 150 + 30 * ease(t / 900));
  gradText(sg, 'BITCOIN FINALITY', 700, 330, 84, ['#ffcf8f', BTC, ORANGE]);
  // the stack: eight Stacks blocks fall in turn onto a Bitcoin block
  btcSlab(sg, 700, 520, 300, 48);
  for (let i = 0; i < 8; i++) { const ti = R ? 1 : ease((t - 300 - i * 180) / 380), yEnd = 488 - i * 22, y = -60 + (yEnd + 60) * ti; if (ti > 0) stxSlab(sg, 700, y, 240 - i * 10, 14); }
  text(sg, 'SETTLED ON BITCOIN · FINAL', 700, 616, 20, '#ffcf8f', MONO, 'center', '700');
  if (t > (R ? 100 : 1500)) digitCells(sg, fmt(Math.round(p.amount * k)), 700, 712, 100, { w: .58, col: '#fff', edge: BTC + '88' });
  text(sg, `LAYR · ${fmt(p.bet)} BET LEVEL · THE METER RESETS TO ITS SEED`, 700, 800, 20, ORANGE2, SANS, 'center', '800');
  if (!R) { sg.save(); for (let i = 0; i < 22; i++) { const ph = (t / 1000 + i * .37) % 3, x = (i * 173) % 1400, y = -40 + ph * 360; if (i % 2) btcLogo(sg, x, y, 30 + (i % 3) * 8); else stxSlab(sg, x, y, 34, 6); } sg.restore(); }
}
// ---- Stack or Unstack: a token with a STACK face (purple, bars rising) and an UNSTACK face (orange, bars falling) ----
function gambleFace(g, r, side) {
  const st = side === 'stack';
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = st ? lin(g, 0, -r, 0, r, [PURPLE2, PURPLE, PURPLE3]) : lin(g, 0, -r, 0, r, [ORANGE2, ORANGE, ORANGE3]); g.fill(); g.lineWidth = 8; g.strokeStyle = st ? '#c9c2ff' : '#ffd3be'; g.stroke();
  g.beginPath(); g.arc(0, 0, r - 16, 0, 7); g.lineWidth = 2; g.strokeStyle = '#ffffff55'; g.stroke();
  for (let k = 0; k < 4; k++) { const w = r * (st ? .9 - k * .16 : .42 + k * .16), y = (st ? r * .08 - k * r * .2 : -r * .52 + k * r * .2); round(g, -w / 2, y, w, r * .12, r * .06, '#ffffffdd'); }
  text(g, st ? '▲ STACK' : '▼ UNSTACK', 0, r * .6, r * .17, '#fff', SANS, 'center', '800');
}
function drawToken(g, cx, cy, r, angle) {
  const k = Math.cos(angle), side = k >= 0 ? 'stack' : 'unstack', w = Math.max(.04, Math.abs(k));
  g.save(); g.translate(cx, cy); g.scale(w, 1); g.shadowColor = side === 'stack' ? PURPLE : ORANGE; g.shadowBlur = 30; gambleFace(g, r, side); g.restore();
}
function drawGamble(now) {
  const g = sg; darkRoom(g, .55); bloom(g, 700, 430, 560, .2);
  const p = pres, t = now - p.t0; let angle = 0, ly = 430;
  const fin = p.result && p.result.parity === 'odd' ? Math.PI : 0; // odd lands UNSTACK, even lands STACK
  if (p.stage === 'play') { const u = clamp01(t / (reduced() ? 600 : 1800)); angle = (reduced() ? 0 : Math.PI * 2 * 6 * easeIO(u)) + (reduced() ? (u > .5 ? fin : 0) : fin * easeIO(u)); ly = 430 - Math.sin(u * Math.PI) * (reduced() ? 0 : 190); }
  else if (p.stage === 'summary') angle = fin; else angle = Math.sin(now / 700) * .5;
  drawToken(g, 700, ly, 150, angle);
  gradText(g, 'STACK OR UNSTACK', 700, 90, 60);
  if (p.stage === 'play' || p.stage === 'summary') text(g, `YOU CALLED ${p.choice === 'odd' ? '▼ UNSTACK' : '▲ STACK'}`, 700, 650, 26, TXT, SANS, 'center', '800');
}
// ---- Cycle Snapshot (Lab event): the cycle ends and the Floor Pot is divided per twin ----
function drawSnapshot(now) {
  const p = pres, t = now - p.t0, R = reduced(), g = sg; darkRoom(g, .7);
  gradText(g, 'CYCLE SNAPSHOT', 700, 80, 60); text(g, 'AT THE END OF EVERY STACKING CYCLE THE FLOOR POT IS SHARED PER TWIN', 700, 128, 15, MUTED, MONO, 'center', '700');
  glassPanel(g, 140, 170, 1120, 120, 18, PURPLE + '99'); text(g, `CYCLE ${p.cycle} ENDS AT BITCOIN BLOCK`, 700, 196, 15, MUTED, MONO, 'center', '700'); digitCells(g, fmt(p.block), 700, 248, 64, { w: .6, col: '#fff', scramble: true, roll: i => R ? 1 : (t - i * 90) / 400 });
  if (t > (R ? 0 : 1300)) {
    const cu = R ? 1 : ease((t - 1300) / 1100);
    text(g, `FLOOR POT ${fmt(Math.round(p.pot * cu))} LAYR  ÷  ${p.twins ? fmt(p.twins) + ' TWINS' : 'TWINS UNKNOWN'}`, 700, 360, 32, TXT, SANS, 'center', '800');
    glowText(g, p.twins ? `= ${fmt(cu < 1 ? r2(p.pot / p.twins * cu) : r2(p.pot / p.twins))} LAYR PER TWIN` : 'NO SHARE WITHOUT A TWIN COUNT', 700, 430, 58, '#fff', PURPLE, '800');
    text(g, 'Display only: the snapshot service and claims come in the holder layer v2.', 700, 500, 18, MUTED, SANS, 'center', 'italic 400');
  }
}
// ---- Cycle Turnover (Lab event): the prepare phase runs out, the ring completes and the next cycle begins ----
function drawTurnover(now) {
  const p = pres, R = reduced(), g = sg; darkRoom(g, .7); bloom(g, 700, 420, 640, .18);
  const to = turnover || { n: 0, at: p.t0 - 5000 }, n = to.n, c0 = p.cycle;
  gradText(g, 'CYCLE TURNOVER', 700, 80, 62); text(g, 'A REHEARSAL OF THE CYCLE’S END · NO LAYR CHANGES HANDS', 700, 126, 16, MUTED, MONO, 'center', '700');
  const k = n ? 0 : (R ? 1 : ease((now - to.at) / 1200));
  ring(g, 700, 420, 190, 26, n ? .985 + (3 - n) * .005 : 1, PURPLE, ORANGE);
  if (n) { text(g, 'PREPARE PHASE', 700, 352, 20, ORANGE2, MONO, 'center', '700'); digitCells(g, String(n), 700, 420, 110, { w: .62, col: '#fff', scramble: true, roll: () => R ? 1 : (now - to.at) / 380 }); text(g, `BITCOIN BLOCK${n === 1 ? '' : 'S'} LEFT IN CYCLE ${c0}`, 700, 500, 18, TXT, MONO, 'center', '700'); }
  else { g.save(); g.globalAlpha = 1 - k; text(g, String(c0), 700, 420, 120, '#fff', COND, 'center', '800'); g.restore(); g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 40); glowText(g, String(c0 + 1), 700, 420, 130, '#fff', ORANGE, '800', 'center', COND); g.restore();
    if (k > .4) { text(g, 'REWARD PHASE BEGINS', 700, 520, 26, ORANGE2, SANS, 'center', '800'); text(g, `CYCLE ${c0 + 1} · 2,100 BITCOIN BLOCKS · A NEW FLOOR POT STARTS`, 700, 556, 16, TXT, MONO, 'center', '700'); } }

}
