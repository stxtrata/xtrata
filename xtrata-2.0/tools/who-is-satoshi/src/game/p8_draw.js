
/* ---------- Scene overlays and the screen compositor ---------- */
const filmLayer = (() => { const c = canvas(1400, 960), g = c.getContext('2d'); const v = g.createRadialGradient(700, 480, 360, 700, 480, 880); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960);
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = 'rgba(255,240,210,.035)'; for (let i = 0; i < 2600; i++) g.fillRect(r() * 1400, r() * 960, 1.2, 1.2); return c; })();
function wrap(g, s, x, y, maxW, lh, size, color, align = 'center', font = SERIF) { const ls = wrapLines(g, s, maxW, size, font, '400'); ls.forEach((l, i) => text(g, l, x, y + i * lh, size, color, font, align, '400')); return y + (ls.length - 1) * lh; }
function drawWipe(now, t0, closing) { // venetian blinds close (out) or open (in)
  const d = reduced() ? 120 : STAGE_MS.outro, u = clamp01((now - t0) / d), k = closing ? u : 1 - u; if (k <= 0) return;
  const n = 16, h = 960 / n; for (let i = 0; i < n; i++) { const hh = h * clamp01(k * 1.3 - (i % 4) * .05); sg.fillStyle = i % 2 ? '#15100a' : '#1d160d'; sg.fillRect(0, i * h, 1400, hh); sg.fillStyle = '#e0b04a22'; sg.fillRect(0, i * h + hh - 2, 1400, 2); }
}
function drawTriggerOverlay(now) {
  const p = pres, t = now - p.t0, T = TITLES[p.bonus], sym = { free: 'scatter', vault: 'vault', chain: 'chain' }[p.bonus], u = ease(t / 600), R = reduced();
  sg.fillStyle = `rgba(6,4,2,${.62 * u})`; sg.fillRect(RX, RY, RW, RH);
  if (sym) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (state.grid[c][r] === sym) {
    const pulse = R ? 1 : 1 + .1 * Math.sin(t / 100), s = 176 * (1 + .24 * u) * pulse, cx = RX + (c + .5) * CW, cy = RY + (r + .5) * RHT - 14 * u;
    sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 40 * u; sg.globalAlpha = .9; round(sg, cx - s / 2 - 6, cy - s / 2 - 6, s + 12, s + 12, 14, null, '#fff', 4); sg.globalAlpha = 1; sg.drawImage(tileFor(sym, faces[c][r]), cx - s / 2, cy - s / 2, s, s); sg.restore();
  }
  if (p.bonus === 'jackpot') for (let c = 0; c < 5; c++) { const cx = RX + (c + .5) * CW, cy = RY + 1.5 * RHT; sg.save(); sg.shadowColor = BRASS; sg.shadowBlur = 36 * u; round(sg, cx - 100, cy - 100, 200, 200, 14, null, BRASS2, 5); sg.restore(); }
  // the title card: a typed label slid onto a case file
  const slide = R ? 1 : ease((t - 250) / 500), x = 700 + (1 - slide) * 1500, y0 = 320, h = 200;
  sg.save(); sg.translate(x - 700, 0); sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 30; round(sg, 170, y0, 1060, h, 8, lin(sg, 0, y0, 0, y0 + h, ['#e9d7a6', '#c9ac6e'])); sg.restore();
  round(sg, 190, y0 - 26, 230, 30, [8, 8, 0, 0], '#d9c08a'); text(sg, `FEATURE ${T.no}`, 305, y0 - 10, 15, '#3d2d12', TYPE);
  const typed = R ? T.t.length : Math.min(T.t.length, Math.floor((t - 250) / 55)); text(sg, T.t.slice(0, Math.max(0, typed)), 700, y0 + 82, T.t.length > 14 ? 74 : 92, INK, TYPE, 'center', '700');
  text(sg, T.sub, 700, y0 + 152, 28, '#5a4422', TYPE, 'center', '700');
  if (t > 900) rubberStamp(sg, 'OPENED', 1110, y0 + 40, 22, RED, .2, clamp01((t - 900) / 200)); sg.restore();
}
function drawIntroCard(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), w = 940, x = 230, y = 290 + (1 - u) * 60;
  sg.save(); sg.globalAlpha = u; sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 40; round(sg, x, y, w, 380, 10, lin(sg, 0, y, 0, y + 380, ['#f3e8cc', '#ddc896'])); sg.restore(); round(sg, x + 10, y + 10, w - 20, 360, 6, null, '#8a6a34', 2);
  const icon = p.bonus === 'free' ? tileFor('scatter', 0) : p.bonus === 'vault' ? tileFor('vault', 0) : p.bonus === 'chain' ? tileFor('chain', 0) : p.bonus === 'jackpot' || p.bonus === 'gift' ? tileFor('bitcoin', 0) : null;
  if (icon) sg.drawImage(icon, x + 34, y + 70, 220, 220);
  const tx = icon ? x + 590 : x + w / 2; fitText(sg, T.t, tx, y + 74, T.t.length > 14 ? 52 : 62, 600, INK, TYPE, 'center', '700'); text(sg, T.sub, tx, y + 122, 20, RED, TYPE, 'center', '700');
  wrap(sg, T.rules, tx, y + 172, icon ? 600 : 800, 32, 23, '#3d2d12');
  if (p.bonus === 'gamble') { text(sg, `${fmt(p.stake)} LAYR ON THE COIN`, tx, y + 262, 24, INK, TYPE, 'center', '700'); button(sg, 'yes', '₿ SATOSHI', x + 60, y + 296, 280, 60, () => gambleCall('even')); button(sg, 'no', 'FAKE · NOT', x + 360, y + 296, 280, 60, () => gambleCall('odd'), { col: RED, col2: RED2 }); button(sg, 'keep', 'KEEP WIN', x + 660, y + 296, 240, 60, keepGamble, { ghost: true, size: 22, col2: '#5a4422' }); }
  else if (p.bonus === 'jackpot') text(sg, `${fmt(p.amount)} LAYR`, tx, y + 320, 44, RED, TYPE, 'center', '700');
  else button(sg, 'start', T.start, tx - 200, y + 290, 400, 64, presStart, { pulse: true, size: 24 });
  sg.restore();
}
function drawSummary(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), cu = reduced() ? 1 : ease((t - 300) / 1800), x = 290, y = 180 + (1 - u) * 50;
  sg.save(); sg.globalAlpha = u; sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 40; round(sg, x, y, 820, 580, 10, lin(sg, 0, y, 0, y + 580, ['#f3e8cc', '#ddc896'])); sg.restore(); round(sg, x + 10, y + 10, 800, 560, 6, null, '#8a6a34', 2);
  const head = p.bonus === 'gamble' ? (p.result ? (p.result.win ? 'DOUBLED' : 'NOT THIS TIME') : 'KEPT') : p.bonus === 'jackpot' ? "SATOSHI'S KEY PAID" : p.bonus === 'gift' ? 'THE DRAW IS CHECKABLE' : `${T.t} · CASE CLOSED`;
  fitText(sg, head, 700, y + 64, 40, 740, INK, TYPE, 'center', '700');
  text(sg, p.bonus === 'gift' ? `TWIN #${fmt(p.index + 1)}` : fmt((p.total || 0) * cu), 700, y + 170, p.bonus === 'gift' ? 84 : 104, RED, TYPE, 'center', '700'); text(sg, p.bonus === 'gift' ? 'LAYR ADDED: NONE (A DISPLAY OF THE DRAW)' : 'LAYR ADDED TO YOUR BALANCE', 700, y + 244, 19, '#5a4422', TYPE, 'center', '700');
  (p.lines || []).forEach((s, i) => fitText(sg, s, 700, y + 306 + i * 40, 22, 740, '#3d2d12', SERIF, 'center', 'italic 400'));
  if (p.bonus === 'vault') rubberStamp(sg, 'STILL ANONYMOUS', 1000, y + 120, 18, RED, .18, .85);
  button(sg, 'collect', p.bonus === 'gamble' || p.bonus === 'gift' ? 'CONTINUE' : 'COLLECT', 500, y + 452, 400, 80, presCollect, { pulse: true, size: 30 });
  sg.restore();
}
// Satoshi's Gift draw (Lab event): hash → number → twin index, typed out.
function drawGift(now) {
  const p = pres, t = now - p.t0, R = reduced(); desk(sg); lampPool(sg, 700, 460, 640, .18);
  glowText(sg, "SATOSHI'S GIFT", 700, 90, 64, BRASS2, BRASS); text(sg, 'ONE TWIN · THE WHOLE POT · CHOSEN BY THE SNAPSHOT BLOCK', 700, 146, 18, SMOKE, TYPE);
  const h = p.hash, n = R ? h.length : Math.min(h.length, Math.floor(t / 22)); round(sg, 120, 220, 1160, 120, 8, '#120d08', BRASS3, 2); text(sg, 'SNAPSHOT BLOCK HASH', 700, 246, 15, SMOKE, TYPE);
  text(sg, h.slice(0, Math.min(n, 32)), 700, 282, 26, BRASS2, TYPE); if (n > 32) text(sg, h.slice(32, n), 700, 316, 26, BRASS2, TYPE);
  if (t > (R ? 0 : 1500)) { text(sg, `HASH mod ${fmt(p.pool)} TWINS`, 700, 420, 30, PAPER, TYPE); glowText(sg, `= TWIN #${fmt(p.index + 1)}`, 700, 490, 64, '#fff6dc', BRASS, '700', 'center', TYPE); text(sg, p.sample ? 'Sample hash: the genesis block. The real draw uses the snapshot block of the period.' : '', 700, 560, 17, SMOKE, SERIF, 'center', 'italic 400'); }
}
const MSG = () => {
  const w = lastResult && !spinning && !feature() && !pres ? lastResult.wins[highlightIndex(performance.now())] : null;
  if (spinning) return state.free ? 'THE FORUM · ALL WINS 2×' : 'INVESTIGATING…';
  if (w) { const line = E.lines[w.line], s0 = state.grid[0][line[0]], it = faceItem(s0, faces[0][line[0]]); let extra = ''; if (w.symbol === 'cherry') extra = '  ·  FAKE: NOT SATOSHI'; else if (it && it.post) extra = `  ·  POSTED ${it.post.date.toUpperCase()}`; return `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${extra}`; }
  return state.free ? `${state.free} FORUM SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'THE EVIDENCE IS REAL. THE IDENTITY IS NOT KNOWN. INVESTIGATE.';
};
function drawScreen(now) {
  hits.length = 0; const f = feature(), p = pres, st = p && p.stage, bet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const forum = !!(p && p.bonus === 'free' && st !== 'trigger');
  if (p && st !== 'trigger' && p.bonus === 'jackpot') { if (st === 'intro') { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); sg.fillStyle = 'rgba(6,4,2,.72)'; sg.fillRect(0, 0, 1400, 960); } else drawKeyJackpot(now); }
  else if (p && p.bonus === 'gamble') drawGamble(now);
  else if (p && p.bonus === 'gift') { if (st === 'play' || st === 'summary') drawGift(now); else { desk(sg); lampPool(sg, 700, 460, 640, .18); } }
  else if (p && p.bonus === 'vault' && st !== 'trigger') drawUnmask(f || p.snapF, now);
  else if (p && p.bonus === 'chain' && st !== 'trigger') drawPatoshi(f || p.snapF, now);
  else if (forum) { drawForumBackdrop(now); if (st === 'play') drawReels(now, true); else { sg.fillStyle = 'rgba(30,40,55,.25)'; sg.fillRect(RX, RY, RW, RH); } }
  else { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); }
  const showHud = !(p && (p.bonus === 'jackpot' && (st === 'play' || st === 'summary'))) && !(p && (p.bonus === 'gamble' || p.bonus === 'gift' || (p.bonus === 'chain' || p.bonus === 'vault') && st !== 'trigger'));
  if (showHud) drawHud(now, bet, forum);
  if (p && p.bonus === 'free' && st === 'play') { if (p.retrig && now - p.retrig.t0 < 1800) { const k = ease((now - p.retrig.t0) / 400); sg.save(); sg.globalAlpha = 1 - clamp01((now - p.retrig.t0 - 1300) / 500); rubberStamp(sg, `+${p.retrig.add} SPINS`, 700, 120 + 60 * k, 48, RED, -.1, .95); sg.restore(); } }
  if (p) {
    if (st === 'trigger') drawTriggerOverlay(now); else if (st === 'intro') drawIntroCard(now); else if (st === 'summary') drawSummary(now);
    if (st === 'intro' || st === 'play') { if (p.bonus !== 'jackpot' && !(p.bonus === 'gamble' && st === 'intro')) button(sg, 'skip', 'SKIP', 1180, 822, 170, 44, skipPres, { ghost: true, size: 20 }); }
    if (st === 'play' && p.bonus === 'chain') { const done = E.featureDone(f || p.snapF); const busy = chainBusy(now); button(sg, 'respin', done ? 'ALL FOUND' : busy ? 'SEARCHING…' : 'RESPIN', 500, 822, 400, 54, featureAction, { pulse: !done && !busy, ghost: done || busy, col: GREEN, col2: GREEN2, size: 26 }); }
    if (st === 'play' && p.bonus === 'free' && state.free > 0 && !spinning) button(sg, 'spinnow', 'SPIN NOW', 560, 822, 280, 46, presAction, { ghost: true, size: 20, col: '#46607f', col2: '#2b3d55' });
    if (st === 'play' && p.bonus === 'vault') text(sg, `OPEN ${3 - (f || p.snapF).picks.length} MORE`, 700, 812, 28, BRASS2, TYPE);
    else if (st === 'play' && (p.bonus === 'chain' || p.bonus === 'gift')) {} else if (!(p.bonus === 'gamble' || p.bonus === 'jackpot' || (p.bonus === 'free' && st === 'play' && state.free > 0 && !spinning))) text(sg, MSG(), 700, 812, 24, forum ? '#2b3d55' : BRASS2, TYPE);
    if (st === 'outro') drawWipe(now, p.t0, true); else if (st === 'intro' && now - p.t0 < 650 && !reduced()) drawWipe(now, p.t0, false);
  } else fitText(sg, MSG(), 700, 812, 24, 1300, state.free ? '#cfe0f5' : BRASS2, TYPE);
  drawFake(now);
  if (lab.on) { sg.save(); sg.fillStyle = '#e0b04a'; sg.fillRect(0, 0, 1400, 24); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL${lab.item ? ' · ' + lab.item.toUpperCase() : ''}${lab.runAll ? ` · RUN ALL ${lab.runAll.i + 1}/${lab.runAll.items.length}` : ''}`, 700, 13, 14, '#1a1205', TYPE, 'center', '700'); sg.restore(); }
  sg.drawImage(filmLayer, 0, 0);
  rev++; screenDirty = false; fsBlit();
}
function screenTap(x, y) {
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); return; } }
  if (pres && pres.stage === 'trigger') toStage('intro');
}
function particles(n = 35) { if (reduced()) return; for (let i = 0; i < n; i++) { const el = document.createElement('i'); el.className = 'coin inf'; el.textContent = ['₿', '✉', '✦'][i % 3]; el.style.left = `${15 + Math.random() * 70}%`; el.style.top = '-25px'; el.style.animationDelay = `${Math.random() * .8}s`; el.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(el); setTimeout(() => el.remove(), 4000); } }
