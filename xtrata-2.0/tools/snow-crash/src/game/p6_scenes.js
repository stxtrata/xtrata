
/* ---------- HUD, standby screen and the scene backdrops (Jacked In, The #1 Club, Forever Street, Total Crash, Heads or Hacks) ---------- */
function perTwinText() { const sh = potShare(); return sh !== null ? `≈ ${fmt(sh)} LAYR PER TWIN` : (sources.helper === 'none' ? 'NO TWINS COUNTED YET' : sources.helper === 'live' ? 'TWINS: ' + (Number.isFinite(sources.twins) ? sources.twins : '?') : 'TWINS UNKNOWN'); }
function drawHud(now, bet, jack) {
  if (jack) { neon(sg, 'JACKED IN', 125, 72, 34, MAG2); text(sg, `${state.free} SPINS LEFT · ALL WINS 2×`, 125, 116, 16, CY); }
  else { text(sg, '20 LINES', 125, 82, 30, '#fde8f5'); text(sg, 'CRASH PUNKS', 125, 122, 16, '#a58db5'); }
  text(sg, 'TOTAL CRASH JACKPOT', 700, 40, 24, MAG2); text(sg, fmt(E.meter(state, bet)), 700, 106, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(bet)} BET LEVEL`, 700, 160, 17, '#a58db5');
  text(sg, 'HOLDER POT', 1275, 50, 15, '#a58db5'); neon(sg, fmt(state.pot), 1275, 86, 34, '#fff', MAG, '700'); text(sg, perTwinText(), 1275, 118, 13, MAG3);
  text(sg, state.lastPot ? `LAST WEEK: ${state.lastPot.twins ? fmt(state.lastPot.pot / state.lastPot.twins) : '—'} PER TWIN` : `WEEK ${state.potKey || weekKey()}`, 1275, 140, 12, '#a58db5');
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#fde8f5', 'Arial', 'left'); text(sg, `BET  ${fmt(bet)}`, 700, 920, 26, '#fde8f5'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, MAG2, 'Arial', 'right');
}
function drawStandby(now) {
  sg.save(); sg.fillStyle = 'rgba(4,1,10,.88)'; sg.fillRect(0, 0, 1400, 960);
  sg.fillStyle = 'rgba(255,62,165,.05)'; for (let y = 0; y < 960; y += 6) sg.fillRect(0, y, 1400, 2);
  const flick = Math.sin(now / 90) > .93 ? .35 : 1; sg.globalAlpha = flick; neon(sg, 'SNOW CRASH', 700, 300, 92, MAG, MAG); sg.globalAlpha = 1;
  const [a, b] = standbyLines(); text(sg, a, 700, 430, 40, '#fde8f5', 'Arial', 'center', '700');
  const n = Number.isFinite(sources.twins) ? Math.min(THRESHOLD, sources.twins) : 0;
  round(sg, 360, 480, 680, 26, 13, '#150a26', '#7d3a62', 2); if (n) round(sg, 362, 482, 676 * n / THRESHOLD, 22, 11, lin(sg, 362, 0, 1038, 0, [MAG, CY]));
  text(sg, b, 700, 540, 26, MAG2);
  text(sg, 'Crash Punks has no Forever Twins helper yet. Every punk below is shown NOT YET FOREVER.', 700, 590, 17, '#a58db5', 'Arial', 'center', '400');
  hits.length = 0; button(sg, 'power', 'POWER UP · TESTNET', 500, 650, 400, 76, powerUp, { pulse: true, size: 28 });
  text(sg, 'Testnet build: runs before the 100-twin switch-on. Switch off again in Settings.', 700, 770, 15, '#7e6a8c', 'Arial', 'center', '400');
  sg.restore();
}
// ---- The #1 Club: nine VIP booths in a velvet lounge ----
function drawClubBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#16041a', '#2b0a2a', '#10030f']); g.fillRect(0, 0, 1400, 960);
  for (const sx of [0, 1]) { for (let k = 0; k < 14; k++) { const x = sx ? 1400 - 27 * (k + 1) : 27 * k, sway = Math.sin(now / 1400 + k * .6) * 3; g.fillStyle = k % 2 ? '#3a0a2e' : '#561042'; g.fillRect(x + sway * .2, 0, 28, 960); } }
  g.save(); for (const cx of [330, 700, 1070]) { const gr = g.createLinearGradient(cx, 0, cx, 800); gr.addColorStop(0, 'rgba(255,200,240,.22)'); gr.addColorStop(1, 'rgba(255,62,165,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(cx - 14, 0); g.lineTo(cx + 14, 0); g.lineTo(cx + 190, 800); g.lineTo(cx - 190, 800); g.fill(); } g.restore();
  const img = LOGOS.numberOne; if (img && img.complete && img.naturalWidth) g.drawImage(img, 56, 132, 108, 67.5);
  g.fillStyle = '#0006'; g.fillRect(0, 800, 1400, 160);
}
function boothFace(i, f) { const m = f.awards[i], slot = m >= 15 ? 'bitcoin' : m >= 10 ? 'artifact' : m >= 8 ? 'block' : m >= 5 ? 'chip' : m >= 3 ? 'lemon' : 'cherry'; pres.faces = pres.faces || {}; if (!pres.faces[i]) pres.faces[i] = { s: slot, f: pickFace(slot) }; return pres.faces[i]; }
function drawClub(f, now) {
  drawClubBackdrop(now);
  const done = f.picks.length === 3;
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), open = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (reduced() ? 1 : 900) : (picked ? 1 : -1);
    if (open >= 0 || (done && !picked)) {
      const face = boothFace(i, f), k = picked ? ease(open) : 1;
      round(sg, x, y, w, h, 14, picked ? '#2a0820' : '#0a0410', picked ? MAG2 : '#3a1a38', picked ? 4 : 2);
      sg.save(); sg.globalAlpha = picked ? 1 : .35; sg.beginPath(); sg.roundRect(x + 4, y + 4, w - 8, h - 8, 12); sg.clip();
      const pw = h - 16, px = x + 8 + (1 - k) * -40; sg.drawImage(tileFor(face.s, face.f), px, y + 8, pw, pw);
      if (picked) { const val = Math.round(f.awards[i] * k); neon(sg, `${val}×`, x + h + (w - h) / 2, y + h / 2 - 18, 52, '#fff', MAG, '900'); text(sg, `${fmt(f.awards[i] * f.bet * k)} LAYR`, x + h + (w - h) / 2, y + h / 2 + 32, 19, MAG3); if (open < .2) { sg.fillStyle = `rgba(255,255,255,${.7 * (1 - open / .2)})`; sg.fillRect(x, y, w, h); } }
      else text(sg, `${f.awards[i]}×`, x + h + (w - h) / 2, y + h / 2, 38, '#6a4a64'); sg.restore();
      if (picked && open < 1 && !reduced()) { const half = (w / 2) * (1 - ease(open)); sg.fillStyle = '#561042'; sg.fillRect(x + 4, y + 4, half, h - 8); sg.fillRect(x + w - 4 - half, y + 4, half, h - 8); }
    } else {
      const hv = pres.stage === 'play' ? .5 + .5 * Math.sin(now / 500 + i) : 0;
      sg.save(); sg.shadowColor = MAG; sg.shadowBlur = 8 + hv * 12; round(sg, x, y, w, h, 14, lin(sg, x, y, x, y + h, ['#6a1450', '#2a0820']), MAG, 3); sg.restore();
      sg.fillStyle = '#ffffff10'; for (let k = 1; k < 12; k++) sg.fillRect(x + k * w / 12, y + 6, 2, h - 12);
      neon(sg, 'VIP', x + 70, y + 40, 28, '#ffd9ee', MAG); text(sg, String(i + 1), x + 70, y + h / 2 + 22, 66, '#fff', 'Arial', 'center', '900');
      sg.strokeStyle = '#d9ba80'; sg.lineWidth = 3; sg.beginPath(); sg.moveTo(x + 150, y + h - 34); sg.quadraticCurveTo(x + w / 2 + 70, y + h + 4, x + w - 40, y + h - 34); sg.stroke();
      text(sg, 'BOOTH', x + w / 2 + 70, y + h / 2 - 12, 22, '#ffb6dc', 'Arial', 'center', '700'); text(sg, 'TAP TO OPEN', x + w / 2 + 70, y + h / 2 + 22, 15, '#c9a0b8', 'Arial', 'center', '400');
      if (pres.stage === 'play') hits.push({ id: 'booth' + i, x, y, w, h, fn: () => pickBind(i) });
    }
  }
}
// ---- Forever Street: fifteen shopfronts, rain, neon ----
function streetItem(f, i) { const arr = pools.chain.length ? pools.chain : null; let h = 2166136261; for (const ch of String(f.roundId || 'f0rever') + i) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return arr ? arr[(h >>> 0) % arr.length].item : (items.length ? items[(h >>> 0) % items.length] : null); }
function drawStreetBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#05020c', '#170a2c', '#1d0a30', '#07030f']); g.fillRect(0, 0, 1400, 960);
  g.fillStyle = '#0a0518'; let x = 0, k = 0; while (x < 1400) { const w = 60 + (k * 53 % 70), h = 90 + (k * 97 % 130); g.fillRect(x, 200 - h, w, h + 10); g.fillStyle = (k % 3 ? '#ffd23f33' : '#39d8ff33'); for (let wy = 200 - h + 10; wy < 190; wy += 22) for (let wx = x + 8; wx < x + w - 10; wx += 16) if (((wx * wy + k) % 7) < 3) g.fillRect(wx, wy, 6, 9); g.fillStyle = '#0a0518'; x += w + 6; k++; }
  g.fillStyle = lin(g, 0, 800, 0, 960, ['#1a0b2e', '#0a0414']); g.fillRect(0, 790, 1400, 170);
  g.save(); g.globalAlpha = .18; g.fillStyle = MAG; for (let i = 0; i < 6; i++) g.fillRect(100 + i * 230, 800, 120, 5); g.restore();
  const o = (now / 20) % 38; g.save(); g.strokeStyle = 'rgba(200,180,255,.25)'; g.lineWidth = 1.2; g.beginPath(); for (let xx = 0; xx < 1400; xx += 21) { const yy = ((xx * 7.3) % 960 + o * 9) % 960; g.moveTo(xx, yy); g.lineTo(xx - 6, yy + 34); } g.stroke(); g.restore();
  neon(g, 'OPEN 24H', 1230, 190, 22, CY, CY, '800'); neon(g, 'PIZZA', 160, 190, 24, '#ffd23f', '#ff9a00', '800'); neon(g, 'JACK IN', 700, 188, 22, MAG2, MAG, '800');
}
function drawStreet(f, now) {
  drawStreetBackdrop(now);
  const fr = f.frames[f.index], fresh = now - chainFlash < 900 ? fr.added : [];
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16, lit = !!v, isNew = fresh.includes(i), age = isNew ? (now - chainFlash) / 900 : 1;
    sg.save(); if (lit) { sg.shadowColor = MAG; sg.shadowBlur = isNew ? 34 : 14; } round(sg, x, y, w, h, 12, lit ? '#1a0a2c' : '#0b0614', lit ? MAG2 : '#2c1a3e', lit ? 4 : 2); sg.restore();
    const stripes = 8, sw = w / stripes; for (let s = 0; s < stripes; s++) { sg.fillStyle = lit ? (s % 2 ? MAG : '#ffe6f5') : (s % 2 ? '#2a1238' : '#1a0c26'); sg.fillRect(x + 3 + s * (w - 6) / stripes, y + 3, (w - 6) / stripes + .5, 22); }
    if (lit) {
      const it = streetItem(f, i); sg.save(); sg.beginPath(); sg.roundRect(x + 6, y + 30, w - 12, h - 36, 8); sg.clip(); sg.fillStyle = '#2a1030'; sg.fillRect(x + 6, y + 30, w - 12, h - 36);
      if (it) sg.drawImage(it.tile || punkTile(it), x + 10, y + 34, h - 44, h - 44);
      const tx = x + 10 + (h - 44) + (w - 12 - (h - 44) - 4) / 2;
      neon(sg, it ? (it.forever ? `XTRATA #${it.xtrataId}` : `PUNK #${it.id}`) : 'PUNK', tx, y + 52, 13, '#ffd9ee', MAG, '800'); neon(sg, `${v}×`, tx, y + 86, 38, '#fff', MAG, '900'); text(sg, fmt(v * f.bet), tx, y + 118, 14, MAG3);
      if (isNew) { sg.fillStyle = `rgba(255,255,255,${.85 * (1 - age)})`; sg.fillRect(x, y, w, h); }
      sg.restore();
      if (isNew && !reduced()) { const k = 1 + .5 * (1 - ease(age * 2)); sg.save(); sg.translate(x + w / 2, y + h / 2); sg.scale(k, k); sg.globalAlpha = 1 - age; sg.strokeStyle = MAG2; sg.lineWidth = 4; sg.strokeRect(-w / 2, -h / 2, w, h); sg.restore(); }
    } else { text(sg, 'CLOSED', x + w / 2, y + h / 2 + 12, 17, '#3a2848', 'Arial', 'center', '700'); sg.fillStyle = '#0006'; sg.fillRect(x + w / 2 - 14, y + h - 40, 28, 34); }
  });
}
// ---- Total Crash: the screen shatters into shards and re-forms ----
function startCrash(dur = 3000) {
  const W = screen.width, H = screen.height, snap = canvas(W, H); snap.getContext('2d').drawImage(screen, 0, 0);
  const cols = 10, rows = 7, tri = []; let s = 1; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x0 = c * 140, y0 = r * (960 / rows), x1 = x0 + 140, y1 = y0 + 960 / rows; for (const pts of [[[x0, y0], [x1, y0], [x0, y1]], [[x1, y0], [x1, y1], [x0, y1]]]) { const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3, ang = Math.atan2(cy - 480, cx - 700) + (rnd() - .5) * .8, sp = 260 + rnd() * 560; tri.push({ pts, cx, cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 120, rot: (rnd() - .5) * 5, delay: rnd() * .1 }); } }
  crash = { start: performance.now(), dur, snap, tri, W, H };
  sound('crash');
}
function applyCrash(now) {
  if (!crash) return; const t = (now - crash.start) / crash.dur; if (t >= 1) { crash = null; return; }
  const k = t < .12 ? 0 : t < .5 ? ease((t - .12) / .38) : t < .62 ? 1 : 1 - easeIO((t - .62) / .38), rx = crash.W / 1400, ry = crash.H / 960;
  sg.save(); sg.fillStyle = '#04010a'; sg.fillRect(0, 0, 1400, 960);
  if (t < .12) { sg.drawImage(crash.snap, (Math.random() - .5) * 14 * (t / .12), 0, 1400, 960); }
  else { sg.fillStyle = `rgba(255,62,165,${.12 * (1 - k)})`; sg.fillRect(0, 0, 1400, 960);
    for (const s of crash.tri) { const q = clamp01(k - s.delay), dx = s.vx * q, dy = s.vy * q + 500 * q * q * (k > .98 ? 0 : 1) * .5; sg.save(); sg.beginPath(); sg.moveTo(s.pts[0][0] + dx, s.pts[0][1] + dy); sg.lineTo(s.pts[1][0] + dx, s.pts[1][1] + dy); sg.lineTo(s.pts[2][0] + dx, s.pts[2][1] + dy); sg.closePath();
      sg.translate(s.cx + dx, s.cy + dy); sg.rotate(s.rot * q); sg.translate(-s.cx - dx, -s.cy - dy); sg.clip(); sg.globalAlpha = 1 - .4 * q; sg.drawImage(crash.snap, 0, 0, crash.W, crash.H, dx, dy, 1400, 960); sg.restore();
      sg.save(); sg.strokeStyle = `rgba(255,150,210,${.8 * q})`; sg.lineWidth = 1.5; sg.beginPath(); sg.moveTo(s.pts[0][0] + dx, s.pts[0][1] + dy); sg.lineTo(s.pts[1][0] + dx, s.pts[1][1] + dy); sg.lineTo(s.pts[2][0] + dx, s.pts[2][1] + dy); sg.closePath(); sg.stroke(); sg.restore(); } }
  sg.restore();
}
// ---- Heads or Hacks: a coin with a Crash Punk on one side and a glitch on the other ----
function drawCoin(g, cx, cy, r, angle, now) {
  const k = Math.cos(angle), side = k >= 0 ? 'heads' : 'hacks', w = Math.max(.04, Math.abs(k));
  g.save(); g.translate(cx, cy); g.scale(w, 1); g.shadowColor = side === 'heads' ? '#ffc83d' : MAG; g.shadowBlur = 30;
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = side === 'heads' ? lin(g, 0, -r, 0, r, ['#ffe8a0', '#c9971a']) : '#0b0414'; g.fill(); g.shadowBlur = 0; g.lineWidth = 8; g.strokeStyle = side === 'heads' ? '#fff3c4' : MAG; g.stroke();
  g.beginPath(); g.arc(0, 0, r - 16, 0, 7); g.clip();
  if (side === 'heads') { const ps = pools.bitcoin.length ? pools.bitcoin : items, it = ps.length ? ps[(Math.floor(now / 2000)) % ps.length] : null; if (it) g.drawImage(it.tile, -r + 12, -r + 12, (r - 12) * 2, (r - 12) * 2); else text(g, 'PUNK', 0, 0, 60, '#5a3a00'); }
  else { g.fillStyle = '#07020f'; g.fillRect(-r, -r, r * 2, r * 2); for (let i = 0; i < 16; i++) { const yy = -r + ((i * 53 + now / 3) % (r * 2)), hh = 6 + (i * 7) % 20; g.fillStyle = i % 2 ? '#ff2d95cc' : '#22d3eecc'; g.fillRect(-r + (i * 37) % 60, yy, r * 2 - (i * 37) % 90, hh); } g.globalCompositeOperation = 'difference'; text(g, 'HACK', 0, 0, r * .62, '#fff', 'Arial', 'center', '900'); g.globalCompositeOperation = 'source-over'; neon(g, '0xF4Z', 0, r * .55, r * .22, CY, CY, '700'); }
  g.restore();
}
function drawGamble(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#06020e', '#1c0a2e', '#06020e']); g.fillRect(0, 0, 1400, 960);
  g.save(); const gr = g.createRadialGradient(700, 420, 20, 700, 420, 420); gr.addColorStop(0, 'rgba(255,62,165,.35)'); gr.addColorStop(1, 'rgba(255,62,165,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 960); g.restore();
  const p = pres, t = now - p.t0; let angle = 0, ly = 420;
  const fin = p.result && p.result.parity === 'odd' ? Math.PI : 0;
  if (p.stage === 'play') { const u = clamp01(t / (reduced() ? 600 : 1800)); angle = (reduced() ? 0 : Math.PI * 2 * 6 * easeIO(u)) + (reduced() ? (u > .5 ? fin : 0) : fin * easeIO(u)); ly = 420 - Math.sin(u * Math.PI) * (reduced() ? 0 : 190); }
  else if (p.stage === 'summary') angle = p.result && p.result.parity === 'odd' ? Math.PI : 0; else angle = Math.sin(now / 700) * .5;
  drawCoin(g, 700, ly, 150, angle, now);
}
