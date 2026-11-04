/* ---------- HUD and the scene backdrops (Jungle Drums, Monkey Store, Forever Vines, Block Reward, Left Vine or Right Vine) ---------- */
function perTwinText() { const sh = potShare(); return sh !== null ? `≈ ${fmt(sh)} LAYR PER TWIN` : (sources.helper === 'none' ? 'NO TWINS COUNTED YET' : sources.helper === 'live' ? 'TWINS: ' + (Number.isFinite(sources.twins) ? sources.twins : '?') : 'TWINS UNKNOWN'); }
function drawHud(now, bet, jack, mini) {
  if (mini) { text(sg, 'BLOCK REWARD', 1230, 40, 13, GOLD2); text(sg, fmt(E.meter(state, bet)), 1230, 66, 28, '#fff', 'Arial', 'center', '300'); text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#f4ecd0', 'Arial', 'left'); text(sg, `BET  ${fmt(bet)}`, 700, 920, 26, '#f4ecd0'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, GOLD2, 'Arial', 'right'); return; }
  if (jack) { neon(sg, 'JUNGLE DRUMS', 150, 72, 26, GOLD2); text(sg, `${state.free} SPINS LEFT · ALL WINS 2×`, 150, 108, 15, TORCH); }
  else { text(sg, '20 LINES', 125, 82, 30, '#f4ecd0'); text(sg, 'BITCOIN MONKEYS', 125, 122, 16, '#8fb59c'); }
  text(sg, 'BLOCK REWARD JACKPOT', 700, 40, 24, GOLD2); text(sg, fmt(E.meter(state, bet)), 700, 106, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(bet)} BET LEVEL`, 700, 160, 17, '#8fb59c');
  text(sg, 'HOLDER POT', 1275, 50, 15, '#8fb59c'); neon(sg, fmt(state.pot), 1275, 86, 34, '#fff', GOLD, '700'); text(sg, perTwinText(), 1275, 118, 13, GOLD3);
  text(sg, state.lastPot ? `LAST WEEK: ${state.lastPot.twins ? fmt(state.lastPot.pot / state.lastPot.twins) : '—'} PER TWIN` : `WEEK ${state.potKey || weekKey()}`, 1275, 140, 12, '#8fb59c');
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#f4ecd0', 'Arial', 'left'); text(sg, `BET  ${fmt(bet)}`, 700, 920, 26, '#f4ecd0'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, GOLD2, 'Arial', 'right');
}
// ---- Monkey Store: nine crates on a temple stair ----
function drawStoreBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#04120a', '#0e2a19', '#071a10']); g.fillRect(0, 0, 1400, 960);
  stoneBlocks(g, 0, 0, 1400, 190, 8); g.fillStyle = '#000a'; g.fillRect(0, 0, 1400, 190);
  for (let k = 0; k < 4; k++) { const y = 190 + k * 150; g.fillStyle = lin(g, 0, y, 0, y + 150, ['#2f4036', '#18241d']); g.fillRect(40 + k * 22, y, 1320 - k * 44, 150); g.fillStyle = '#6f8a74'; g.fillRect(40 + k * 22, y, 1320 - k * 44, 4); }
  vines(g, now, 0, 1400, 190, 18, 21, '#25552f'); fireflies(g, now, 14, 3);
  drawTorch(g, 40, 120, now, 1); drawTorch(g, 1360, 120, now, 4);
  text(g, 'MONKEY STORE', 700, 70, 54, GOLD2, 'Arial', 'center', '900'); text(g, 'SERUMS FOR BANANA · OPEN THREE CRATES', 700, 124, 20, '#9db8a4', 'Arial', 'center', '700');
  const img = LOGOS.store; if (img && img.complete && img.naturalWidth) g.drawImage(img, 56, 40, 108, 67.5);
  g.fillStyle = '#0006'; g.fillRect(0, 800, 1400, 160);
}
function crateFace(i, f) { const m = f.awards[i], slot = m >= 8 ? 'block' : m >= 3 ? 'chip' : 'lemon'; pres.faces = pres.faces || {}; if (!pres.faces[i]) pres.faces[i] = { s: slot, f: pickFace(slot) }; return pres.faces[i]; }
function drawStore(f, now) {
  drawStoreBackdrop(now);
  const done = f.picks.length === 3;
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), open = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (reduced() ? 1 : 900) : (picked ? 1 : -1);
    if (open >= 0 || (done && !picked)) {
      const face = crateFace(i, f), k = picked ? ease(open) : 1;
      round(sg, x, y, w, h, 14, picked ? '#1f2a14' : '#0a120c', picked ? GOLD2 : '#33453a', picked ? 4 : 2);
      sg.save(); sg.globalAlpha = picked ? 1 : .35; sg.beginPath(); sg.roundRect(x + 4, y + 4, w - 8, h - 8, 12); sg.clip();
      const pw = h - 16, px = x + 8 + (1 - k) * -40; sg.drawImage(tileFor(face.s, face.f), px, y + 8, pw, pw);
      if (picked) { const val = Math.round(f.awards[i] * k); neon(sg, `${val}×`, x + h + (w - h) / 2, y + h / 2 - 18, 52, '#fff', GOLD, '900'); text(sg, `${fmt(f.awards[i] * f.bet * k)} LAYR`, x + h + (w - h) / 2, y + h / 2 + 32, 19, GOLD3); if (open < .2) { sg.fillStyle = `rgba(255,243,196,${.7 * (1 - open / .2)})`; sg.fillRect(x, y, w, h); } }
      else text(sg, `${f.awards[i]}×`, x + h + (w - h) / 2, y + h / 2, 38, '#556b5c'); sg.restore();
      if (picked && open < 1 && !reduced()) { const lift = (1 - ease(open)) * 0; sg.save(); sg.translate(0, -lift); const half = (w / 2) * (1 - ease(open)); sg.fillStyle = '#6b4a28'; sg.fillRect(x + 4, y + 4, half, h - 8); sg.fillRect(x + w - 4 - half, y + 4, half, h - 8); sg.restore(); }
    } else {
      const hv = pres.stage === 'play' ? .5 + .5 * Math.sin(now / 500 + i) : 0;
      sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 8 + hv * 12; round(sg, x, y, w, h, 10, lin(sg, x, y, x, y + h, ['#8a6236', '#4a3118']), '#d9a300', 3); sg.restore();
      sg.fillStyle = '#00000030'; for (let k = 1; k < 5; k++) sg.fillRect(x + 8, y + k * h / 5, w - 16, 3); sg.fillStyle = '#2a1c0e'; sg.fillRect(x + 22, y + 10, 12, h - 20); sg.fillRect(x + w - 34, y + 10, 12, h - 20);
      sg.strokeStyle = '#c9a063'; sg.lineWidth = 4; sg.beginPath(); sg.moveTo(x + 10, y + h / 2 - 22); sg.lineTo(x + w - 10, y + h / 2 + 22); sg.moveTo(x + w - 10, y + h / 2 - 22); sg.lineTo(x + 10, y + h / 2 + 22); sg.stroke();
      round(sg, x + w / 2 - 60, y + h / 2 - 34, 120, 68, 10, '#1a1209e8', GOLD2, 2); text(sg, 'CRATE', x + w / 2, y + h / 2 - 14, 17, GOLD2, 'Arial', 'center', '800'); text(sg, String(i + 1), x + w / 2, y + h / 2 + 14, 32, '#fff', 'Arial', 'center', '900');
      if (pres.stage === 'play') hits.push({ id: 'crate' + i, x, y, w, h, fn: () => pickBind(i) });
    }
  }
}
// ---- Forever Vines: fifteen alcoves; each lock lights a twinned monkey on the vines with its Xtrata ID and value ----
function vineItem(f, i) { const arr = pools.chain.length ? pools.chain : null; let h = 2166136261; for (const ch of String(f.roundId || 'f0rever') + i) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return arr ? arr[(h >>> 0) % arr.length].item : (items.length ? items[(h >>> 0) % items.length] : null); }
function drawVinesBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#020a06', '#0a2216', '#0c2c1a', '#03100a']); g.fillRect(0, 0, 1400, 960);
  g.save(); g.fillStyle = '#0a2a1c'; for (let k = 0; k < 9; k++) { const x = k * 175 - 20, h = 360 + (k * 61 % 120); g.fillRect(x, 0, 38, h); g.beginPath(); g.ellipse(x + 19, h, 70, 24, 0, 0, 7); g.fill(); } g.restore();
  // the lit waterfall running down the right side
  g.save(); const wx = 1300; g.fillStyle = lin(g, 0, 0, 0, 960, ['#9ff0dc66', '#6fe3c8aa', '#6fe3c855']); g.fillRect(wx, 0, 60, 800); g.globalAlpha = .5; g.fillStyle = '#fff'; for (let k = 0; k < 16; k++) { const yy = ((k * 71 + now / 4) % 800); g.fillRect(wx + 6 + (k * 13) % 44, yy, 3, 24 + (k % 3) * 10); } g.restore();
  vines(g, now, 0, 1400, 300, 22, 17, '#2e7a3c'); fireflies(g, now, 30, 8);
  g.fillStyle = lin(g, 0, 800, 0, 960, ['#14301f', '#07140d']); g.fillRect(0, 790, 1400, 170);
  neon(g, 'FOREVER VINES', 700, 60, 36, MOSS, '#2e7a3c', '900');
}
function drawVines(f, now) {
  drawVinesBackdrop(now);
  const fr = f.frames[f.index], fresh = now - chainFlash < 900 ? fr.added : [];
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16, lit = !!v, isNew = fresh.includes(i), age = isNew ? (now - chainFlash) / 900 : 1;
    sg.save(); if (lit) { sg.shadowColor = MOSS; sg.shadowBlur = isNew ? 34 : 14; } round(sg, x, y, w, h, 12, lit ? '#0e2418' : '#06120b', lit ? GOLD2 : '#22392b', lit ? 4 : 2); sg.restore();
    // vine wrapped across the top of the alcove; it blooms when lit
    sg.save(); sg.strokeStyle = lit ? '#58b868' : '#1f3a28'; sg.lineWidth = 5; sg.beginPath(); sg.moveTo(x + 4, y + 14); sg.bezierCurveTo(x + w * .3, y - 6, x + w * .6, y + 30, x + w - 4, y + 12); sg.stroke(); sg.fillStyle = lit ? '#7ad68a' : '#274533'; for (let s = 0; s < 6; s++) { sg.beginPath(); sg.ellipse(x + 14 + s * (w - 28) / 5, y + 14 + (s % 2 ? 6 : -2), 6, 3.5, s % 2 ? .6 : -.5, 0, 7); sg.fill(); } sg.restore();
    if (lit) {
      const it = vineItem(f, i); sg.save(); sg.beginPath(); sg.roundRect(x + 6, y + 30, w - 12, h - 36, 8); sg.clip(); sg.fillStyle = '#0b1a11'; sg.fillRect(x + 6, y + 30, w - 12, h - 36);
      if (it) sg.drawImage(it.tile || monkeyTile(it), x + 10, y + 34, h - 44, h - 44);
      const tx = x + 10 + (h - 44) + (w - 12 - (h - 44) - 4) / 2;
      neon(sg, it ? (it.forever ? `XTRATA #${it.xtrataId}` : `MONKEY #${it.id}`) : 'MONKEY', tx, y + 52, 13, '#fff3c4', GOLD, '800'); neon(sg, `${v}×`, tx, y + 86, 38, '#fff', GOLD, '900'); text(sg, fmt(v * f.bet), tx, y + 118, 14, GOLD3);
      if (isNew) { sg.fillStyle = `rgba(255,243,196,${.85 * (1 - age)})`; sg.fillRect(x, y, w, h); }
      sg.restore();
      if (isNew && !reduced()) { const k = 1 + .5 * (1 - ease(age * 2)); sg.save(); sg.translate(x + w / 2, y + h / 2); sg.scale(k, k); sg.globalAlpha = 1 - age; sg.strokeStyle = GOLD2; sg.lineWidth = 4; sg.strokeRect(-w / 2, -h / 2, w, h); sg.restore(); }
    } else { text(sg, 'DARK', x + w / 2, y + h / 2 + 12, 17, '#2e4a39', 'Arial', 'center', '700'); sg.fillStyle = '#0007'; sg.fillRect(x + w / 2 - 14, y + h - 40, 28, 34); }
  });
}
// ---- Block Reward: the stone block cracks open and spills gold ----
function startCrash(dur = 3000) {
  const W = screen.width, H = screen.height, snap = canvas(W, H); snap.getContext('2d').drawImage(screen, 0, 0);
  const cols = 10, rows = 7, tri = []; let s = 1; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x0 = c * 140, y0 = r * (960 / rows), x1 = x0 + 140, y1 = y0 + 960 / rows; for (const pts of [[[x0, y0], [x1, y0], [x0, y1]], [[x1, y0], [x1, y1], [x0, y1]]]) { const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3, ang = Math.atan2(cy - 480, cx - 700) + (rnd() - .5) * .8, sp = 260 + rnd() * 560; tri.push({ pts, cx, cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 120, rot: (rnd() - .5) * 5, delay: rnd() * .1 }); } }
  crash = { start: performance.now(), dur, snap, tri, W, H };
  sound('jackpot');
}
function applyCrash(now) {
  if (!crash) return; const t = (now - crash.start) / crash.dur; if (t >= 1) { crash = null; return; }
  const k = t < .12 ? 0 : t < .5 ? ease((t - .12) / .38) : t < .62 ? 1 : 1 - easeIO((t - .62) / .38), rx = crash.W / 1400, ry = crash.H / 960;
  sg.save(); const gr = sg.createRadialGradient(700, 480, 20, 700, 480, 820); gr.addColorStop(0, '#fff6c8'); gr.addColorStop(.25, '#ffc83d'); gr.addColorStop(.7, '#7a4a05'); gr.addColorStop(1, '#1a0f02'); sg.fillStyle = gr; sg.fillRect(0, 0, 1400, 960);
  if (!reduced()) { sg.translate(700, 480); for (let i = 0; i < 18; i++) { sg.rotate(Math.PI / 9); sg.fillStyle = i % 2 ? 'rgba(255,255,255,.14)' : 'rgba(255,200,61,.1)'; sg.beginPath(); sg.moveTo(0, 0); sg.lineTo(900, -50); sg.lineTo(900, 50); sg.closePath(); sg.fill(); } sg.setTransform(2, 0, 0, 2, 0, 0); }
  if (t < .12) { sg.drawImage(crash.snap, (Math.random() - .5) * 14 * (t / .12), 0, 1400, 960); sg.strokeStyle = `rgba(255,243,196,${t / .12})`; sg.lineWidth = 3; sg.beginPath(); sg.moveTo(700, 480); for (let i = 0; i < 9; i++) sg.lineTo(700 + (Math.random() - .5) * 700 * (t / .12), 480 + (Math.random() - .5) * 500 * (t / .12)); sg.stroke(); }
  else { for (const s of crash.tri) { const q = clamp01(k - s.delay), dx = s.vx * q, dy = s.vy * q + 500 * q * q * (k > .98 ? 0 : 1) * .5; sg.save(); sg.beginPath(); sg.moveTo(s.pts[0][0] + dx, s.pts[0][1] + dy); sg.lineTo(s.pts[1][0] + dx, s.pts[1][1] + dy); sg.lineTo(s.pts[2][0] + dx, s.pts[2][1] + dy); sg.closePath();
      sg.translate(s.cx + dx, s.cy + dy); sg.rotate(s.rot * q); sg.translate(-s.cx - dx, -s.cy - dy); sg.clip(); sg.globalAlpha = 1 - .4 * q; sg.drawImage(crash.snap, 0, 0, crash.W, crash.H, dx, dy, 1400, 960); sg.restore();
      sg.save(); sg.strokeStyle = `rgba(255,233,166,${.85 * q})`; sg.lineWidth = 1.5; sg.beginPath(); sg.moveTo(s.pts[0][0] + dx, s.pts[0][1] + dy); sg.lineTo(s.pts[1][0] + dx, s.pts[1][1] + dy); sg.lineTo(s.pts[2][0] + dx, s.pts[2][1] + dy); sg.closePath(); sg.stroke(); sg.restore(); } }
  sg.restore();
}
// ---- Left Vine or Right Vine: a gilded monkey swings from the canopy and lands on one vine ----
function drawGamble(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#03100a', '#0d2a1a', '#03100a']); g.fillRect(0, 0, 1400, 960);
  g.save(); const gr = g.createRadialGradient(700, 420, 20, 700, 420, 460); gr.addColorStop(0, 'rgba(217,163,0,.28)'); gr.addColorStop(1, 'rgba(217,163,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 960); g.restore();
  vines(g, now, 0, 1400, 240, 14, 5, '#1f4a2a'); fireflies(g, now, 18, 2);
  const p = pres, t = now - p.t0, R = reduced(), L = 560, px = 700, py = -60;
  const fin = p.result && p.result.parity === 'odd' ? 1 : -1; // Left Vine = even, Right Vine = odd
  let sx = 0;
  if (p.stage === 'play') { const u = clamp01(t / (R ? 600 : 1800)); sx = R ? (u > .5 ? fin : 0) * 340 : (fin * 340 * easeIO(u)) + (1 - u) * Math.sin(u * 22) * 300 * (1 - u); }
  else if (p.stage === 'summary') sx = fin * 340; else sx = Math.sin(now / 650) * 190;
  const x = px + sx, y = py + Math.sqrt(L * L - sx * sx);
  // the two vines the call is about
  for (const [vx, lab, side] of [[360, 'LEFT VINE', -1], [1040, 'RIGHT VINE', 1]]) { const won = p.stage === 'summary' && p.result && p.result.win && fin === side, lost = p.stage === 'summary' && p.result && !p.result.win && fin !== side;
    g.save(); g.strokeStyle = won ? GOLD2 : '#2f6b3a'; g.lineWidth = 9; g.shadowColor = won ? GOLD : 'transparent'; g.shadowBlur = won ? 24 : 0; g.beginPath(); g.moveTo(vx, 0); g.bezierCurveTo(vx - 24, 260, vx + 24, 520, vx, 760); g.stroke(); g.shadowBlur = 0; g.fillStyle = '#3f8a4a'; for (let k = 1; k < 7; k++) { g.beginPath(); g.ellipse(vx + (k % 2 ? 14 : -14), k * 108, 12, 6, k % 2 ? .6 : -.6, 0, 7); g.fill(); }
    round(g, vx - 130, 760, 260, 54, 12, '#1d2a22', won ? GOLD2 : '#33453a', 3); text(g, lab, vx, 787, 24, won ? GOLD2 : '#9db8a4', 'Arial', 'center', '900'); g.restore(); }
  g.save(); g.strokeStyle = '#6b4a28'; g.lineWidth = 7; g.beginPath(); g.moveTo(px, py); g.lineTo(x, y - 90); g.stroke(); g.restore();
  const ps = pools.bitcoin.length ? pools.bitcoin : pools.artifact.length ? pools.artifact : null, it = ps ? ps[Math.floor(now / 2400) % ps.length] : null;
  g.save(); g.shadowColor = GOLD; g.shadowBlur = 30; round(g, x - 100, y - 100, 200, 200, 22, '#1a1209', GOLD2, 6); g.shadowBlur = 0; if (it) g.drawImage(it.tile, x - 92, y - 92, 184, 184); else g.drawImage(placeholders.bitcoin, x - 92, y - 92, 184, 184); g.restore();
}
