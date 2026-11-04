
/* ---------- Scene overlays and the screen compositor ---------- */
const scanLayer = (() => { const c = canvas(1400, 960), g = c.getContext('2d'); const v = g.createRadialGradient(700, 480, 380, 700, 480, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960);
  g.fillStyle = 'rgba(0,0,0,.05)'; for (let y = 0; y < 960; y += 3) g.fillRect(0, y, 1400, 1); return c; })();
function wrap(g, s, x, y, maxW, lh, size, color, align = 'center', font = SANS) { const ls = wrapLines(g, s, maxW, size, font, '400'); ls.forEach((l, i) => text(g, l, x, y + i * lh, size, color, font, align, '400')); return y + (ls.length - 1) * lh; }
function drawWipe(now, t0, closing) { // a steel roller shutter rolls down (out) or up (in)
  const d = reduced() ? 120 : STAGE_MS.outro, u = clamp01((now - t0) / d), k = closing ? easeIO(u) : 1 - easeIO(u); if (k <= 0) return;
  const h = 960 * k; for (let y = 0; y < h; y += 24) { sg.fillStyle = (y / 24) % 2 ? '#2b2e33' : '#33373d'; sg.fillRect(0, y, 1400, 24); sg.fillStyle = '#00000066'; sg.fillRect(0, y + 21, 1400, 3); sg.fillStyle = '#ffffff12'; sg.fillRect(0, y, 1400, 1); }
  hazard(sg, 0, Math.max(0, h - 22), 1400, 22);
}
function panel(g, x, y, w, h) { g.save(); g.shadowColor = '#000'; g.shadowBlur = 40; round(g, x, y, w, h, 8, '#14161a'); g.restore(); brushed(g, x + 4, y + 4, w - 8, h - 8, '#1d2025', 13); round(g, x, y, w, h, 8, null, AMBER3, 3); hazard(g, x + 4, y + 4, w - 8, 12, .9); [[x + 18, y + 30], [x + w - 18, y + 30], [x + 18, y + h - 18], [x + w - 18, y + h - 18]].forEach(([a, b]) => rivet(g, a, b, 5)); }
function drawTriggerOverlay(now) {
  const p = pres, t = now - p.t0, T = TITLES[p.bonus], sym = { free: 'scatter', vault: 'vault', chain: 'chain' }[p.bonus], u = ease(t / 600), R = reduced();
  sg.fillStyle = `rgba(4,5,6,${.62 * u})`; sg.fillRect(RX, RY, RW, RH);
  if (sym) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (state.grid[c][r] === sym) {
    const pulse = R ? 1 : 1 + .1 * Math.sin(t / 100), s = 176 * (1 + .24 * u) * pulse, cx = RX + (c + .5) * CW, cy = RY + (r + .5) * RHT - 14 * u;
    sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 40 * u; sg.globalAlpha = .9; round(sg, cx - s / 2 - 6, cy - s / 2 - 6, s + 12, s + 12, 12, null, '#fff', 4); sg.globalAlpha = 1; sg.drawImage(tileFor(sym, faces[c][r]), cx - s / 2, cy - s / 2, s, s); sg.restore();
  }
  if (p.bonus === 'jackpot') for (let c = 0; c < 5; c++) { const cx = RX + (c + .5) * CW, cy = RY + 1.5 * RHT; sg.save(); sg.shadowColor = AMBER; sg.shadowBlur = 36 * u; round(sg, cx - 100, cy - 100, 200, 200, 12, null, AMBER2, 5); sg.restore(); }
  // the title plate: a stencilled steel sign sliding in on its rail
  const slide = R ? 1 : ease((t - 250) / 500), x = 700 + (1 - slide) * 1500, y0 = 320, h = 210;
  sg.save(); sg.translate(x - 700, 0); panel(sg, 160, y0, 1080, h);
  text(sg, `FEATURE ${T.no}`, 700, y0 + 40, 17, AMBER, MONO, 'center', '700');
  const typed = R ? T.t.length : Math.min(T.t.length, Math.floor((t - 250) / 55)); glowText(sg, T.t.slice(0, Math.max(0, typed)), 700, y0 + 108, T.t.length > 14 ? 82 : 98, '#fff6d0', LED);
  text(sg, T.sub, 700, y0 + 172, 26, AMBER2, COND, 'center', '800');
  if (t > 900) rubberStamp(sg, 'MINED', 1120, y0 + 50, 24, AMBER, .14, clamp01((t - 900) / 200)); sg.restore();
}
function introIcon(p) { return p.bonus === 'free' ? null : p.bonus === 'vault' ? tileFor('vault', 0) : p.bonus === 'chain' ? tileFor('chain', 0) : p.bonus === 'jackpot' ? tileFor('bitcoin', 0) : p.bonus === 'halvingday' ? tileFor('artifact', 0) : p.bonus === 'epoch' ? tileFor('chain', 0) : null; }
function drawIntroCard(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), w = 960, x = 220, y = 280 + (1 - u) * 60;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, w, 400);
  const icon = introIcon(p), tx = x + 600;
  if (p.bonus === 'free') { // the coin splits in two as the cycle begins
    const k = reduced() ? 1 : ease((t - 300) / 900); [-1, 1].forEach(sx => { sg.save(); sg.beginPath(); sg.rect(sx < 0 ? x : x + 160, y + 40, 160, 320); sg.clip(); sg.translate(sx * 26 * k, 0); sg.rotate(sx * .12 * k); coinFace(sg, x + 160, y + 200, 120, 0, { label: false }); sg.restore(); });
    if (k > .5) { text(sg, '50 → 25', x + 160, y + 350, 26, AMBER2, COND, 'center', '800'); } }
  else if (icon) sg.drawImage(icon, x + 40, y + 80, 240, 240);
  else if (p.bonus === 'gamble') { sg.save(); sg.translate(x + 160, y + 200); gambleFace(sg, 110, Math.sin(now / 600) > 0 ? 'double' : 'halve'); sg.restore(); }
  fitText(sg, T.t, tx, y + 74, T.t.length > 14 ? 54 : 64, 580, '#fff6d0', COND, 'center', '800'); text(sg, T.sub, tx, y + 122, 20, AMBER, MONO, 'center', '700');
  wrap(sg, T.rules, tx, y + 170, 580, 30, 21, '#d6d9de');
  if (p.bonus === 'gamble') { text(sg, `${fmt(p.stake)} LAYR ON THE FLIP`, tx, y + 268, 24, AMBER2, COND, 'center', '800'); button(sg, 'yes', '×2 DOUBLE', x + 330, y + 300, 200, 64, () => gambleCall('even')); button(sg, 'no', '½ HALVE', x + 545, y + 300, 200, 64, () => gambleCall('odd'), { col: '#b9c0c9', col2: '#f2f4f7', col3: '#5f6873' }); button(sg, 'keep', 'KEEP WIN', x + 760, y + 300, 170, 64, keepGamble, { ghost: true, size: 22 }); }
  else if (p.bonus === 'jackpot') text(sg, `${fmt(p.amount)} LAYR`, tx, y + 320, 48, AMBER2, COND, 'center', '800');
  else button(sg, 'start', T.start, tx - 210, y + 300, 420, 66, presStart, { pulse: true, size: 28 });
  sg.restore();
}
function drawSummary(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), cu = reduced() ? 1 : ease((t - 300) / 1800), x = 290, y = 170 + (1 - u) * 50;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, 820, 600);
  const head = p.bonus === 'gamble' ? (p.result ? (p.result.win ? 'DOUBLED' : 'NOT THIS TIME') : 'KEPT') : p.bonus === 'jackpot' ? '21 MILLION PAID' : p.bonus === 'halvingday' ? 'THE SUBSIDY HALVED' : p.bonus === 'epoch' ? 'SNAPSHOT TAKEN' : `${T.t} · COMPLETE`;
  fitText(sg, head, 700, y + 70, 44, 740, '#fff6d0', COND, 'center', '800');
  if (p.bonus === 'halvingday' || p.bonus === 'epoch') { text(sg, p.bonus === 'epoch' ? (p.twins ? `${fmt(r2(p.pot / p.twins))}` : '—') : '1.5625', 700, y + 176, 96, AMBER2, COND, 'center', '800'); text(sg, p.bonus === 'epoch' ? 'LAYR PER TWIN · DISPLAY ONLY' : 'BTC PER BLOCK FROM BLOCK 1,050,000', 700, y + 250, 19, SMOKE, MONO, 'center', '700'); }
  else { flapCells(sg, fmt(Math.round((p.total || 0) * cu)), 700, y + 176, 92, { w: .58, col: AMBER2 }); text(sg, 'LAYR ADDED TO YOUR BALANCE', 700, y + 250, 19, SMOKE, MONO, 'center', '700'); }
  (p.lines || []).forEach((s, i) => fitText(sg, s, 700, y + 312 + i * 40, 22, 740, '#d6d9de', SANS, 'center', '400'));
  button(sg, 'collect', p.bonus === 'gamble' || p.bonus === 'epoch' || p.bonus === 'halvingday' ? 'CONTINUE' : 'COLLECT', 500, y + 470, 400, 80, presCollect, { pulse: true, size: 32 });
  sg.restore();
}
const MSG = () => {
  const w = lastResult && !spinning && !feature() && !pres ? lastResult.wins[highlightIndex(performance.now())] : null;
  if (spinning) return state.free ? 'HALVING CYCLE · ALL WINS 2×' : 'MINING…';
  if (w) { let extra = ''; const H = REC.halvings[HALV_IDX[w.symbol]]; if (H) extra = `  ·  ${amt(H.from)} → ${amt(H.to)} BTC`; else if (w.symbol === 'artifact' && Number.isFinite(blocksLeft())) extra = `  ·  ${fmt(blocksLeft())} BLOCKS TO GO`; else if (w.symbol === 'bitcoin') extra = '  ·  THE CAP'; return `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${extra}`; }
  return state.free ? `${state.free} FREE SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'EVERY 210,000 BLOCKS THE SUBSIDY HALVES. MINE.';
};
function drawScreen(now) {
  hits.length = 0; const f = feature(), p = pres, st = p && p.stage, bet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const cycle = !!(p && p.bonus === 'free' && st !== 'trigger');
  if (p && st !== 'trigger' && p.bonus === 'jackpot') { if (st === 'intro') { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); sg.fillStyle = 'rgba(4,5,6,.72)'; sg.fillRect(0, 0, 1400, 960); } else drawJackpot(now); }
  else if (p && p.bonus === 'gamble') drawGamble(now);
  else if (p && p.bonus === 'halvingday') { if (st === 'play' || st === 'summary') drawHalvingDay(now); else darkRoom(sg, .7); }
  else if (p && p.bonus === 'epoch') { if (st === 'play' || st === 'summary') drawEpoch(now); else darkRoom(sg, .7); }
  else if (p && p.bonus === 'vault' && st !== 'trigger') drawCoinbase(f || p.snapF, now);
  else if (p && p.bonus === 'chain' && st !== 'trigger') drawHashrate(f || p.snapF, now);
  else if (cycle) { drawCycleBackdrop(now); if (st === 'play') drawReels(now, true); else { sg.fillStyle = 'rgba(30,24,0,.35)'; sg.fillRect(RX, RY, RW, RH); } }
  else { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); }
  const showHud = !(p && (p.bonus === 'jackpot' && (st === 'play' || st === 'summary'))) && !(p && (p.bonus === 'gamble' || p.bonus === 'halvingday' || p.bonus === 'epoch' || (p.bonus === 'chain' || p.bonus === 'vault') && st !== 'trigger'));
  if (showHud) drawHud(now, bet, cycle);
  if (cycle && st === 'play') { drawCycleSplit(now); if (p.retrig && now - p.retrig.t0 < 1800) { const k = ease((now - p.retrig.t0) / 400); sg.save(); sg.globalAlpha = 1 - clamp01((now - p.retrig.t0 - 1300) / 500); rubberStamp(sg, `+${p.retrig.add} SPINS`, 700, 200 + 60 * k, 48, AMBER, -.06, .95); sg.restore(); } }
  if (p) {
    if (st === 'trigger') drawTriggerOverlay(now); else if (st === 'intro') drawIntroCard(now); else if (st === 'summary') drawSummary(now);
    if (st === 'intro' || st === 'play') { if (p.bonus !== 'jackpot' && !(p.bonus === 'gamble' && st === 'intro')) button(sg, 'skip', 'SKIP', 1180, 812, 170, 40, skipPres, { ghost: true, size: 20 }); }
    if (st === 'play' && p.bonus === 'chain') { const done = E.featureDone(f || p.snapF), busyNow = hashBusy(now); button(sg, 'respin', done ? 'ALL MINED' : busyNow ? 'MINING…' : 'RESPIN', 500, 818, 400, 58, featureAction, { pulse: !done && !busyNow, ghost: done || busyNow, col: GREEN, col2: GREEN2, col3: '#1d6b3f', size: 28 }); }
    if (st === 'play' && p.bonus === 'free' && state.free > 0 && !spinning) button(sg, 'spinnow', 'SPIN NOW', 560, 812, 280, 40, presAction, { ghost: true, size: 20 });
    if (st === 'play' && p.bonus === 'vault') text(sg, `OPEN ${3 - (f || p.snapF).picks.length} MORE`, 700, 812, 28, AMBER2, COND, 'center', '800');
    else if (st === 'play' && (p.bonus === 'chain' || p.bonus === 'epoch' || p.bonus === 'halvingday')) {} else if (!(p.bonus === 'gamble' || p.bonus === 'jackpot' || p.bonus === 'epoch' || p.bonus === 'halvingday' || (p.bonus === 'free' && st === 'play' && state.free > 0 && !spinning))) fitText(sg, MSG(), 700, 820, 24, 1100, AMBER2, COND, 'center', '800');
    if (st === 'outro') drawWipe(now, p.t0, true); else if (st === 'intro' && now - p.t0 < 700 && !reduced()) drawWipe(now, p.t0, false);
  } else fitText(sg, MSG(), 700, 820, 26, 1300, AMBER2, COND, 'center', '800');
  if (lab.on) { sg.save(); hazard(sg, 0, 0, 1400, 24); round(sg, 330, 2, 740, 20, 3, INK); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL${lab.item ? ' · ' + lab.item.toUpperCase() : ''}${lab.runAll ? ` · RUN ALL ${lab.runAll.i + 1}/${lab.runAll.items.length}` : ''}`, 700, 13, 13, AMBER, MONO, 'center', '700'); sg.restore(); }
  // the breaker's brown-out: while it is open the screen sags to dark, then flickers back as the power returns (not in turbo)
  const brk = breakerAt(now); if (brk.power < 1 && !state.turbo) { sg.fillStyle = `rgba(0,0,0,${.6 * (1 - brk.power)})`; sg.fillRect(0, 0, 1400, 960); if (brk.off && brk.power < .2) { sg.fillStyle = 'rgba(255,240,200,.07)'; sg.fillRect(0, 478, 1400, 4); } }
  sg.drawImage(scanLayer, 0, 0);
  rev++; screenDirty = false; fsBlit();
}
function screenTap(x, y) {
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); return; } }
  if (pres && pres.stage === 'trigger') toStage('intro');
}
function particles(n = 35) { if (reduced()) return; for (let i = 0; i < n; i++) { const el = document.createElement('i'); el.className = 'coin inf'; el.textContent = ['₿', '½', '■'][i % 3]; el.style.left = `${15 + Math.random() * 70}%`; el.style.top = '-25px'; el.style.animationDelay = `${Math.random() * .8}s`; el.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(el); setTimeout(() => el.remove(), 4000); } }
