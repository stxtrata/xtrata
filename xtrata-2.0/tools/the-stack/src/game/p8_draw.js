
/* ---------- Scene overlays and the screen compositor ---------- */
const scanLayer = (() => { const c = canvas(1400, 960), g = c.getContext('2d'); const v = g.createRadialGradient(700, 480, 380, 700, 480, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960); return c; })();
function wrap(g, s, x, y, maxW, lh, size, color, align = 'center', font = SANS) { const ls = wrapLines(g, s, maxW, size, font, '400'); ls.forEach((l, i) => text(g, l, x, y + i * lh, size, color, font, align, '400')); return y + (ls.length - 1) * lh; }
function drawWipe(now, t0, closing) { // glass slabs slide in from alternate sides and stack up (out), or slide away (in)
  const d = reduced() ? 120 : STAGE_MS.outro, u = clamp01((now - t0) / d), n = 12, bh = 960 / n;
  for (let i = 0; i < n; i++) { const k0 = closing ? easeIO(clamp01(u * 1.6 - (n - 1 - i) / n * .6)) : 1 - easeIO(clamp01(u * 1.6 - i / n * .6)); if (k0 <= 0) continue; const y = i * bh, dir = i % 2 ? 1 : -1, x = dir * (1 - k0) * 1400;
    sg.fillStyle = lin(sg, 0, y, 0, y + bh, i / n < .55 ? ['#1d1850', '#120e36'] : ['#3a1a10', '#22100a']); sg.fillRect(x, y, 1400, bh - 2); sg.fillStyle = i / n < .55 ? PURPLE2 : ORANGE; sg.fillRect(x, y + bh - 3, 1400, 2); }
}
function panel(g, x, y, w, h) { g.save(); g.shadowColor = PURPLE; g.shadowBlur = 40; round(g, x, y, w, h, 22, '#0b0b14'); g.restore(); glassPanel(g, x, y, w, h, 22, PURPLE2, 2.5); g.fillStyle = lin(g, x, 0, x + w, 0, [PURPLE2, VIOLET, ORANGE]); g.beginPath(); g.roundRect(x + 24, y, w - 48, 5, 3); g.fill(); }
function drawTriggerOverlay(now) {
  const p = pres, t = now - p.t0, T = TITLES[p.bonus], sym = { free: 'scatter', vault: 'vault', chain: 'chain' }[p.bonus], u = ease(t / 600), R = reduced();
  sg.fillStyle = `rgba(4,4,8,${.62 * u})`; sg.fillRect(RX, RY, RW, RH);
  if (sym) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (state.grid[c][r] === sym) {
    const pulse = R ? 1 : 1 + .1 * Math.sin(t / 100), s = 176 * (1 + .24 * u) * pulse, cx = RX + (c + .5) * CW, cy = RY + (r + .5) * RHT - 14 * u;
    sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 40 * u; sg.globalAlpha = .9; round(sg, cx - s / 2 - 6, cy - s / 2 - 6, s + 12, s + 12, 22, null, '#fff', 4); sg.globalAlpha = 1; sg.drawImage(tileFor(sym, faces[c][r]), cx - s / 2, cy - s / 2, s, s); sg.restore();
  }
  if (p.bonus === 'jackpot') for (let c = 0; c < 5; c++) { const cx = RX + (c + .5) * CW, cy = RY + 1.5 * RHT; sg.save(); sg.shadowColor = BTC; sg.shadowBlur = 36 * u; round(sg, cx - 100, cy - 100, 200, 200, 22, null, '#ffcf8f', 5); sg.restore(); }
  // the title card: a glass slab sliding in
  const slide = R ? 1 : ease((t - 250) / 500), x = 700 + (1 - slide) * 1500, y0 = 320, h = 210;
  sg.save(); sg.translate(x - 700, 0); panel(sg, 160, y0, 1080, h);
  text(sg, `FEATURE ${T.no}`, 700, y0 + 40, 17, PURPLE2, MONO, 'center', '700');
  const typed = R ? T.t.length : Math.min(T.t.length, Math.floor((t - 250) / 55)); gradText(sg, T.t.slice(0, Math.max(0, typed)), 700, y0 + 108, T.t.length > 14 ? 80 : 96);
  text(sg, T.sub, 700, y0 + 172, 26, ORANGE2, SANS, 'center', '800');
  if (t > 900) rubberStamp(sg, 'STACKED', 1120, y0 + 50, 24, ORANGE, .14, clamp01((t - 900) / 200)); sg.restore();
}
function introIcon(p) { return p.bonus === 'free' ? tileFor('scatter', 0) : p.bonus === 'vault' ? tileFor('vault', 1) : p.bonus === 'chain' ? tileFor('chain', 0) : p.bonus === 'jackpot' ? tileFor('bitcoin', 0) : p.bonus === 'turnover' ? tileFor('scatter', 0) : p.bonus === 'snapshot' ? tileFor('wild', 0) : null; }
function drawIntroCard(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), w = 960, x = 220, y = 280 + (1 - u) * 60;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, w, 400);
  const icon = introIcon(p), tx = x + 600;
  if (p.bonus === 'free') { // the cycle ring draws itself round the stacking-cycle card as the season begins
    sg.drawImage(icon, x + 50, y + 90, 220, 220); const k = reduced() ? 1 : ease((t - 200) / 1100); sg.save(); sg.lineWidth = 6; sg.lineCap = 'round'; sg.strokeStyle = ORANGE; sg.shadowColor = ORANGE; sg.shadowBlur = 16; sg.beginPath(); sg.arc(x + 160, y + 200, 136, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); sg.stroke(); sg.restore(); text(sg, '8 SPINS · 2×', x + 160, y + 362, 22, ORANGE2, SANS, 'center', '800'); }
  else if (p.bonus === 'gamble') { sg.save(); sg.translate(x + 160, y + 200); gambleFace(sg, 110, Math.sin(now / 600) > 0 ? 'stack' : 'unstack'); sg.restore(); }
  else if (icon) sg.drawImage(icon, x + 40, y + 80, 240, 240);
  fitText(sg, T.t, tx, y + 74, T.t.length > 14 ? 52 : 62, 580, '#fff', SANS, 'center', '800'); text(sg, T.sub, tx, y + 122, 20, ORANGE2, MONO, 'center', '700');
  wrap(sg, T.rules, tx, y + 170, 580, 30, 21, TXT);
  if (p.bonus === 'gamble') { text(sg, `${fmt(p.stake)} LAYR ON THE FLIP`, tx, y + 268, 24, ORANGE2, SANS, 'center', '800'); button(sg, 'yes', '▲ STACK', x + 330, y + 300, 200, 64, () => gambleCall('even'), { col: PURPLE, col2: PURPLE2, col3: PURPLE3, ink: '#fff' }); button(sg, 'no', '▼ UNSTACK', x + 545, y + 300, 200, 64, () => gambleCall('odd')); button(sg, 'keep', 'KEEP WIN', x + 760, y + 300, 170, 64, keepGamble, { ghost: true, size: 22 }); }
  else if (p.bonus === 'jackpot') text(sg, `${fmt(p.amount)} LAYR`, tx, y + 320, 48, '#ffcf8f', SANS, 'center', '800');
  else button(sg, 'start', T.start, tx - 210, y + 300, 420, 66, presStart, { pulse: true, size: 26 });
  sg.restore();
}
function drawSummary(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), cu = reduced() ? 1 : ease((t - 300) / 1800), x = 290, y = 170 + (1 - u) * 50;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, 820, 600);
  const head = p.bonus === 'gamble' ? (p.result ? (p.result.win ? 'DOUBLED' : 'NOT THIS TIME') : 'KEPT') : p.bonus === 'jackpot' ? 'BITCOIN FINALITY PAID' : p.bonus === 'turnover' ? `CYCLE ${p.cycle + 1} BEGINS` : p.bonus === 'snapshot' ? 'SNAPSHOT TAKEN' : `${T.t} · COMPLETE`;
  fitText(sg, head, 700, y + 70, 44, 740, '#fff', SANS, 'center', '800');
  if (p.bonus === 'turnover' || p.bonus === 'snapshot') { text(sg, p.bonus === 'snapshot' ? (p.twins ? `${fmt(r2(p.pot / p.twins))}` : '—') : '2,100', 700, y + 176, 96, ORANGE2, COND, 'center', '800'); text(sg, p.bonus === 'snapshot' ? 'LAYR PER TWIN · DISPLAY ONLY' : 'BITCOIN BLOCKS IN THE NEW CYCLE', 700, y + 250, 19, MUTED, MONO, 'center', '700'); }
  else { digitCells(sg, fmt(Math.round((p.total || 0) * cu)), 700, y + 176, 92, { w: .58, col: '#fff', edge: ORANGE + '88' }); text(sg, 'LAYR ADDED TO YOUR BALANCE', 700, y + 250, 19, MUTED, MONO, 'center', '700'); }
  (p.lines || []).forEach((s, i) => fitText(sg, s, 700, y + 312 + i * 40, 22, 740, TXT, SANS, 'center', '400'));
  button(sg, 'collect', INFO_BONUS(p.bonus) ? 'CONTINUE' : 'COLLECT', 500, y + 470, 400, 80, presCollect, { pulse: true, size: 32 });
  sg.restore();
}
const MSG = () => {
  const w = lastResult && !spinning && !feature() && !pres ? lastResult.wins[highlightIndex(performance.now())] : null;
  if (spinning) return state.free ? 'STACKING SEASON · ALL WINS 2×' : 'STACKING…';
  if (w) { let extra = ''; if (WHAT[w.symbol]) extra = `  ·  ${WHAT[w.symbol]}`; else if (w.symbol === 'bitcoin') extra = '  ·  SECURED BY BITCOIN'; return `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${extra}`; }
  return state.free ? `${state.free} FREE SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'STACKS: FAST BLOCKS, SECURED BY BITCOIN. STACK.';
};
function drawScreen(now) {
  hits.length = 0; const f = feature(), p = pres, st = p && p.stage, bet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const season = !!(p && p.bonus === 'free' && st !== 'trigger');
  if (p && st !== 'trigger' && p.bonus === 'jackpot') { if (st === 'intro') { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); sg.fillStyle = 'rgba(4,4,8,.72)'; sg.fillRect(0, 0, 1400, 960); } else drawJackpot(now); }
  else if (p && p.bonus === 'gamble') drawGamble(now);
  else if (p && p.bonus === 'turnover') { if (st === 'play' || st === 'summary') drawTurnover(now); else darkRoom(sg, .7); }
  else if (p && p.bonus === 'snapshot') { if (st === 'play' || st === 'summary') drawSnapshot(now); else darkRoom(sg, .7); }
  else if (p && p.bonus === 'vault' && st !== 'trigger') drawRewards(f || p.snapF, now);
  else if (p && p.bonus === 'chain' && st !== 'trigger') drawFastBlocks(f || p.snapF, now);
  else if (season) { drawSeasonBackdrop(now); if (st === 'play') drawReels(now, true); else { sg.fillStyle = 'rgba(40,30,120,.3)'; sg.fillRect(RX, RY, RW, RH); } }
  else { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); }
  const showHud = !(p && (p.bonus === 'jackpot' && (st === 'play' || st === 'summary'))) && !(p && (INFO_BONUS(p.bonus) || (p.bonus === 'chain' || p.bonus === 'vault') && st !== 'trigger'));
  if (showHud) drawHud(now, bet, season);
  if (season) { drawSeasonRing(now); if (st === 'play' && p.retrig && now - p.retrig.t0 < 1800) { const k = ease((now - p.retrig.t0) / 400); sg.save(); sg.globalAlpha = 1 - clamp01((now - p.retrig.t0 - 1300) / 500); rubberStamp(sg, `+${p.retrig.add} SPINS`, 700, 200 + 60 * k, 48, ORANGE, -.06, .95); sg.restore(); } }
  if (p) {
    if (st === 'trigger') drawTriggerOverlay(now); else if (st === 'intro') drawIntroCard(now); else if (st === 'summary') drawSummary(now);
    if (st === 'intro' || st === 'play') { if (p.bonus !== 'jackpot' && !(p.bonus === 'gamble' && st === 'intro')) button(sg, 'skip', 'SKIP', 1180, 812, 170, 40, skipPres, { ghost: true, size: 20 }); }
    if (st === 'play' && p.bonus === 'chain') { const done = E.featureDone(f || p.snapF), busyNow = fastBusy(now); button(sg, 'respin', done ? 'ALL STACKED' : busyNow ? 'PRODUCING…' : 'RESPIN', 500, 818, 400, 58, featureAction, { pulse: !done && !busyNow, ghost: done || busyNow, col: PURPLE, col2: PURPLE2, col3: PURPLE3, ink: '#fff', size: 28 }); }
    if (st === 'play' && p.bonus === 'free' && state.free > 0 && !spinning) button(sg, 'spinnow', 'SPIN NOW', 560, 812, 280, 40, presAction, { ghost: true, size: 20 });
    if (st === 'play' && p.bonus === 'vault') text(sg, `OPEN ${3 - (f || p.snapF).picks.length} MORE`, 700, 812, 28, ORANGE2, SANS, 'center', '800');
    else if (st === 'play' && (p.bonus === 'chain' || INFO_BONUS(p.bonus))) {} else if (!(p.bonus === 'gamble' || p.bonus === 'jackpot' || INFO_BONUS(p.bonus) || (p.bonus === 'free' && st === 'play' && state.free > 0 && !spinning))) fitText(sg, MSG(), 700, 820, 24, 1100, ORANGE2, SANS, 'center', '800');
    if (st === 'outro') drawWipe(now, p.t0, true); else if (st === 'intro' && now - p.t0 < 700 && !reduced()) drawWipe(now, p.t0, false);
  } else fitText(sg, MSG(), 700, 820, 26, 1300, ORANGE2, SANS, 'center', '800');
  if (lab.on) { sg.save(); sg.fillStyle = lin(sg, 0, 0, 1400, 0, [PURPLE, ORANGE]); sg.fillRect(0, 0, 1400, 24); round(sg, 330, 2, 740, 20, 10, INK); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL${lab.item ? ' · ' + lab.item.toUpperCase() : ''}${lab.runAll ? ` · RUN ALL ${lab.runAll.i + 1}/${lab.runAll.items.length}` : ''}`, 700, 13, 13, ORANGE2, MONO, 'center', '700'); sg.restore(); }
  sg.drawImage(scanLayer, 0, 0);
  rev++; screenDirty = false; fsBlit();
}
function screenTap(x, y) {
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); return; } }
  if (pres && pres.stage === 'trigger') toStage('intro');
}
function particles(n = 35) { if (reduced()) return; for (let i = 0; i < n; i++) { const el = document.createElement('i'); el.className = 'coin inf'; el.textContent = ['₿', '▰', '◆'][i % 3]; el.style.left = `${15 + Math.random() * 70}%`; el.style.top = '-25px'; el.style.animationDelay = `${Math.random() * .8}s`; el.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(el); setTimeout(() => el.remove(), 4000); } }
