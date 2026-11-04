/* ---------- The cabinet screen ---------- */
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 1400, 960, ['#1d1566', '#0f0a33', '#17105a']); g.fillRect(0, 0, 1400, 960);
  g.strokeStyle = '#f3ead60a'; g.lineWidth = 2; for (let y = 8; y < 960; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); }
  round(g, RX - 9, RY - 9, RW + 18, RH + 18, 18, '#0a0722', '#8d83ff', 3);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#120d3d', '#1d1664', '#120d3d']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#f3ead61a'; g.fillRect(45, 880, 1310, 1);
  text(g, '3 GENESIS = MAINNET LAUNCH   ·   3 BOOMBOX = STACKING BOOMBOX   ·   5 ANCHOR = PROOF OF TRANSFER', 700, 852, 19, '#a79ee8'); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#08051fcc'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#08051fcc');
const STARS = Array.from({ length: 110 }, (_, i) => ({ x: (i * 977) % 1400, y: (i * 613) % 190 + (i % 3 ? 0 : 0), r: 1 + (i % 4) * .6, p: i * 1.7 }));
let countdownUntil = 0, countdownStart = 0;
function highlightIndex(now) { return !spinning && !feature() && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function drawReels(now) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = '#f0b429'; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, '#f6c453', 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, '#f6c453', 4); sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#f6c453c0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#b9adff66'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
// Proof of Transfer: every locked cell is a real Bitcoin block height chained to the Stacks block it anchored, with its value.
const hashFor = (f, i) => { const id = String(f.roundId || 'g3nesis'); let h = 2166136261; for (const ch of id + i) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0).toString(16).padStart(8, '0'); };
const anchorFor = (f, i) => { const N = Math.max(1, Math.min(BLOCKS.length, 120)); if (!BLOCKS.length) return { h: i + 1, bh: 666053 + i, hx: '0x' }; const base = parseInt(hashFor(f, 'a'), 16); return BLOCKS[1 + (base + i * 7) % (N - 1 || 1)]; };
function drawFinalize(f, now) {
  const fr = f.frames[f.index], fresh = now - chainFlash < 900 ? fr.added : [];
  fr.cells.forEach((v, i) => { const x = RX + (i % 5) * CW + 8, y = RY + Math.floor(i / 5) * RHT + 8, w = CW - 19, h = RHT - 16;
    if (v) { const b = anchorFor(f, i); sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = fresh.includes(i) ? 30 : 10; round(sg, x, y, w, h, 14, fresh.includes(i) ? '#4a3bdb' : '#2a1f7a', fresh.includes(i) ? '#f6c453' : '#b9adff', fresh.includes(i) ? 5 : 3); sg.restore();
      text(sg, `BTC ${b.bh.toLocaleString('en-GB')}`, x + w / 2, y + 28, 21, '#f3ead6', 'Courier New', 'center', '700'); text(sg, `STX #${b.h}`, x + w / 2, y + 54, 17, '#b9adff', 'Courier New', 'center', '700'); text(sg, `${v}×`, x + w / 2, y + 96, 44, '#ffffff', 'Arial'); text(sg, fmt(v * f.bet), x + w / 2, y + 134, 20, '#f6c453'); }
    else { round(sg, x, y, w, h, 14, '#0a0722', '#3a2f8f', 2); text(sg, 'UNANCHORED', x + w / 2, y + h / 2, 15, '#5a4fb5'); } });
}
let capsuleFaces = [];
function drawBind(f) {
  const done = f.picks.length === 3;
  if (capsuleFaces.length !== 9) capsuleFaces = Array.from({ length: 9 }, () => ({ s: 'vault', f: pickFace('vault') }));
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i);
    if (picked) { round(sg, x, y, w, h, 14, '#2a1f7a', '#f6c453', 4); sg.drawImage(tileFor(capsuleFaces[i].s, capsuleFaces[i].f), x + 8, y + 8, h - 16, h - 16); text(sg, `${f.awards[i]}×`, x + h + (w - h) / 2, y + h / 2 - 18, 52, '#ffffff', 'Arial'); text(sg, `${fmt(f.awards[i] * f.bet)} LAYR`, x + h + (w - h) / 2, y + h / 2 + 32, 19, '#f6c453'); }
    else if (done) { round(sg, x, y, w, h, 14, '#0a0722', '#3a2f8f', 2); text(sg, `${f.awards[i]}×`, x + w / 2, y + h / 2, 34, '#5a4fb5'); }
    else { round(sg, x, y, w, h, 14, lin(sg, x, y, x, y + h, ['#2f2391', '#120d3d']), '#8d83ff', 3); sg.drawImage(tileFor(capsuleFaces[i].s, capsuleFaces[i].f), x + 10, y + 10, h - 20, h - 20); text(sg, `BOOMBOX ${i + 1}`, x + h + (w - h) / 2, y + h / 2 - 14, 23, '#f3ead6'); text(sg, 'STACKING REWARD · SEALED', x + h + (w - h) / 2, y + h / 2 + 20, 13, '#a79ee8'); } }
}
function potLine() { const t = twinCount(); const per = t.n ? state.holder.pot / t.n : null; return { t, per }; }
function drawScreen(now) {
  sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, launching = state.free || state.freeActive;
  if (launching) { sg.save(); for (const s of STARS) { sg.globalAlpha = .35 + .65 * Math.abs(Math.sin(now / 600 + s.p)); sg.fillStyle = '#fff4d8'; sg.beginPath(); sg.arc(s.x, s.y, s.r, 0, 7); sg.fill(); } sg.restore(); }
  text(sg, 'GENESIS 21', 190, 70, 38, '#fff4d8', 'Arial', 'center', '900'); text(sg, launching ? `${state.free} LAUNCH SPINS · 2×` : 'JAN 2021  ·  20 LINES', 190, 112, 17, launching ? '#f6c453' : '#a79ee8');
  text(sg, 'JACKPOT: NUMBER ONE', 700, 40, 22, '#f6c453', 'Arial', 'center', '800');
  text(sg, fmt(E.meter(state, shownBet)), 700, 106, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 160, 17, '#a79ee8');
  const { t, per } = potLine();
  round(sg, 1045, 22, 310, 138, 14, '#ffffff0d', '#8d83ff55', 2); text(sg, 'HOLDER POT', 1200, 46, 17, '#b9adff', 'Arial', 'center', '800'); text(sg, fmt(state.holder.pot), 1200, 88, 40, '#f6c453', 'Arial', 'center', '700');
  text(sg, `${state.holder.label}  ·  ${per != null ? `~${fmt(per)} PER TWIN${t.stale ? ' (STALE)' : ''}` : 'TWINS: UNKNOWN'}`, 1200, 122, 14, '#cfc8ff'); text(sg, state.holder.last ? `LAST ${state.holder.last.label}: ${state.holder.last.perTwin == null ? 'UNKNOWN' : fmt(state.holder.last.perTwin)} PER TWIN` : 'FIRST PERIOD · POT FILLING', 1200, 144, 12, '#a79ee8');
  let msg, msgColor = '#f3ead6';
  if (now < countdownUntil) { sg.save(); sg.fillStyle = '#08051fd8'; sg.fillRect(RX, RY, RW, RH); const k = Math.max(0, Math.ceil((countdownUntil - now) / 800)); const label = k >= 3 ? 'T-3' : k === 2 ? 'T-2' : k === 1 ? 'T-1' : 'LIFTOFF'; const p = ((countdownUntil - now) % 800) / 800; sg.globalAlpha = .4 + .6 * p; text(sg, label, 700, RY + RH / 2 - 10, 190 + (1 - p) * 30, '#f6c453', 'Arial', 'center', '900'); sg.globalAlpha = 1; text(sg, 'MAINNET LAUNCH', 700, RY + RH / 2 + 120, 34, '#fff4d8', 'Arial', 'center', '800'); sg.restore(); msg = 'MAINNET LAUNCH · ALL WINS 2×'; }
  else if (f && !spinning && f.type === 'chain') { drawFinalize(f, now); const fr = f.frames[f.index], k = fr.cells.filter(Boolean).length; msg = E.featureDone(f) ? `ANCHORED  ·  ${k}/15 BLOCKS  ·  ${fmt(f.sum * f.bet)}${f.full ? '  ·  ALL 15: JACKPOT: NUMBER ONE!' : ''}` : `PROOF OF TRANSFER  ·  ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT  ·  ${k}/15 ANCHORED`; }
  else if (f && !spinning && f.type === 'vault') { drawBind(f); const total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; msg = f.picks.length === 3 ? `STACKING BOOMBOX  ·  ${fmt(total)} LAYR` : `STACKING BOOMBOX  ·  OPEN ${3 - f.picks.length} MORE  ·  ${fmt(total)}`; }
  else { const w = drawReels(now); const wt = w ? cameoFor(w) : null;
    msg = spinning ? 'MINTING…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${wt ? (wt.twinned ? `  ·  #${wt.tokenId} · XTRATA #${wt.xtrataId}` : `  ·  #${wt.tokenId} · NOT YET FOREVER`) : ''}` : state.free ? `${state.free} LAUNCH SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'WHERE BITCOIN NFTs ON STACKS BEGAN.'; if (state.free && !spinning) msgColor = '#f6c453'; }
  text(sg, msg, 700, 812, 26, msgColor);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#fff4d8', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 920, 26, '#fff4d8'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, '#f6c453', 'Arial', 'right');
  screenTexture.needsUpdate = true; screenDirty = false; invalidate();
}
// The piece of art shown on the first matching cell of a winning line (the cameo).
function cameoFor(w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = state.grid[c][line[c]], it = faceItem(s, faces[c][line[c]]); if (it && it.tokenId != null && !it.data && (s === w.symbol || s === 'wild')) return it; } return null; }
function screenTap(x, y) { const f = feature(); if (!f || spinning) return; if (f.type === 'vault') { for (let i = 0; i < 9; i++) { const [rx, ry, w, h] = capsuleRect(i); if (x >= rx && x <= rx + w && y >= ry && y <= ry + h) return pickBind(i); } } else featureAction(); }
function particles(n = 35) { if (state.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'coin inf'; p.textContent = '■'; p.style.left = `${15 + Math.random() * 70}%`; p.style.top = '-25px'; p.style.animationDelay = `${Math.random() * .8}s`; p.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(p); setTimeout(() => p.remove(), 4000); } }
