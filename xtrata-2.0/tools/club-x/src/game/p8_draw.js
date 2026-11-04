
/* ---------- Scene overlays and the screen compositor ---------- */
const scanLayer = (() => { const c = canvas(1400, 960), g = c.getContext('2d'); const v = g.createRadialGradient(700, 480, 380, 700, 480, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960);
  g.fillStyle = 'rgba(0,0,0,.05)'; for (let y = 0; y < 960; y += 3) g.fillRect(0, y, 1400, 1); return c; })();
function wrap(g, s, x, y, maxW, lh, size, color, align = 'center', font = SANS) { const ls = wrapLines(g, s, maxW, size, font, '400'); ls.forEach((l, i) => text(g, l, x, y + i * lh, size, color, font, align, '400')); return y + (ls.length - 1) * lh; }
function drawWipe(now, t0, closing) { // a steel roller shutter rolls down (out) or up (in)
  const d = reduced() ? 120 : STAGE_MS.outro, u = clamp01((now - t0) / d), k = closing ? easeIO(u) : 1 - easeIO(u); if (k <= 0) return;
  const h = 960 * k; for (let y = 0; y < h; y += 24) { sg.fillStyle = (y / 24) % 2 ? '#2b2e33' : '#33373d'; sg.fillRect(0, y, 1400, 24); sg.fillStyle = '#00000066'; sg.fillRect(0, y + 21, 1400, 3); sg.fillStyle = '#ffffff12'; sg.fillRect(0, y, 1400, 1); }
  hazard(sg, 0, Math.max(0, h - 22), 1400, 22);
}
function panel(g, x, y, w, h) { g.save(); g.shadowColor = '#000'; g.shadowBlur = 40; round(g, x, y, w, h, 8, '#14161a'); g.restore(); brushed(g, x + 4, y + 4, w - 8, h - 8, '#1d2025', 13); round(g, x, y, w, h, 8, null, ACID3, 3); hazard(g, x + 4, y + 4, w - 8, 12, .9); [[x + 18, y + 30], [x + w - 18, y + 30], [x + 18, y + h - 18], [x + w - 18, y + h - 18]].forEach(([a, b]) => rivet(g, a, b, 5)); }
function drawTriggerOverlay(now) {
  const p = pres, t = now - p.t0, T = TITLES[p.bonus], sym = { free: 'scatter', vault: 'vault', chain: 'chain' }[p.bonus], u = ease(t / 600), R = reduced();
  sg.fillStyle = `rgba(4,5,6,${.62 * u})`; sg.fillRect(RX, RY, RW, RH);
  if (sym) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (state.grid[c][r] === sym) {
    const pulse = R ? 1 : 1 + .1 * Math.sin(t / 100), s = 176 * (1 + .24 * u) * pulse, cx = RX + (c + .5) * CW, cy = RY + (r + .5) * RHT - 14 * u;
    sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 40 * u; sg.globalAlpha = .9; round(sg, cx - s / 2 - 6, cy - s / 2 - 6, s + 12, s + 12, 12, null, '#fff', 4); sg.globalAlpha = 1; sg.drawImage(tileFor(sym, faces[c][r]), cx - s / 2, cy - s / 2, s, s); sg.restore();
  }
  if (p.bonus === 'jackpot') for (let c = 0; c < 5; c++) { const cx = RX + (c + .5) * CW, cy = RY + 1.5 * RHT; sg.save(); sg.shadowColor = ACID; sg.shadowBlur = 36 * u; round(sg, cx - 100, cy - 100, 200, 200, 12, null, ACID2, 5); sg.restore(); }
  // the title plate: a stencilled steel sign sliding in on its rail
  const slide = R ? 1 : ease((t - 250) / 500), x = 700 + (1 - slide) * 1500, y0 = 320, h = 210;
  sg.save(); sg.translate(x - 700, 0); panel(sg, 160, y0, 1080, h);
  text(sg, `FEATURE ${T.no}`, 700, y0 + 40, 17, ACID, MONO, 'center', '700');
  const typed = R ? T.t.length : Math.min(T.t.length, Math.floor((t - 250) / 55)); glowText(sg, T.t.slice(0, Math.max(0, typed)), 700, y0 + 108, T.t.length > 18 ? 74 : T.t.length > 14 ? 82 : 98, '#fff', ACID);
  text(sg, T.sub, 700, y0 + 172, 26, ACID2, COND, 'center', '800');
  if (t > 900) rubberStamp(sg, 'X FOUND', 1110, y0 + 52, 24, PINK, .14, clamp01((t - 900) / 200)); sg.restore();
}
function introIcon(p) { return p.bonus === 'free' ? tileFor('scatter', 0) : p.bonus === 'vault' ? tileFor('vault', 0) : p.bonus === 'chain' ? tileFor('chain', 0) : p.bonus === 'jackpot' ? tileFor('bitcoin', 0) : p.bonus === 'potclose' ? tileFor('artifact', 0) : null; }
function drawIntroCard(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), w = 960, x = 220, y = 280 + (1 - u) * 60;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, w, 400);
  const icon = introIcon(p), tx = x + 600;
  if (p.bonus === 'gamble') { sg.save(); sg.translate(x + 160, y + 205); sg.scale(.58, .58); drawSwitch(sg, 0, 0, reduced() ? 0 : Math.sin(now / 500) * .5); sg.restore(); }
  else if (icon) { const k = p.bonus === 'free' && !reduced() ? 1 + .05 * Math.sin(now / 130) : 1; sg.save(); sg.translate(x + 160, y + 200); sg.scale(k, k); sg.drawImage(icon, -120, -120, 240, 240); sg.restore(); }
  fitText(sg, T.t, tx, y + 74, T.t.length > 14 ? 50 : 64, 580, '#fff', COND, 'center', '800'); text(sg, T.sub, tx, y + 122, 20, ACID, MONO, 'center', '700');
  wrap(sg, T.rules, tx, y + 170, 580, 30, 20, '#d6d9de');
  if (p.bonus === 'gamble') { text(sg, `${fmt(p.stake)} LAYR ON THE SWITCH`, tx, y + 268, 24, ACID2, COND, 'center', '800'); button(sg, 'yes', 'LIGHTS UP', x + 330, y + 300, 200, 64, () => gambleCall('even')); button(sg, 'no', 'LIGHTS DOWN', x + 545, y + 300, 200, 64, () => gambleCall('odd'), { col: '#b9c0c9', col2: '#f2f4f7', col3: '#5f6873' }); button(sg, 'keep', 'KEEP WIN', x + 760, y + 300, 170, 64, keepGamble, { ghost: true, size: 22 }); }
  else if (p.bonus === 'jackpot') text(sg, `${fmt(p.amount)} LAYR`, tx, y + 320, 48, ACID2, COND, 'center', '800');
  else button(sg, 'start', T.start, tx - 210, y + 300, 420, 66, presStart, { pulse: true, size: 28 });
  sg.restore();
}
function drawSummary(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), cu = reduced() ? 1 : ease((t - 300) / 1800), x = 290, y = 170 + (1 - u) * 50;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, 820, 600);
  const head = p.bonus === 'gamble' ? (p.result ? (p.result.win ? 'DOUBLED' : 'NOT THIS TIME') : 'KEPT') : p.bonus === 'jackpot' ? 'NUMBER ONE PAID' : p.bonus === 'potclose' ? 'THE WEEK IS CLOSED' : `${T.t} · COMPLETE`;
  fitText(sg, head, 700, y + 70, 44, 740, '#fff', COND, 'center', '800');
  if (p.bonus === 'potclose') { const cause = r2(p.pot * CAUSE_RATE), share = r2(p.pot - cause); text(sg, p.twins ? fmt(r2(share / p.twins)) : fmt(cause), 700, y + 176, 96, ACID2, COND, 'center', '800'); text(sg, p.twins ? 'LAYR PER TWIN · DISPLAY ONLY' : 'LAYR FOR THE CAUSE · DISPLAY ONLY', 700, y + 250, 19, SMOKE, MONO, 'center', '700'); }
  else { flapCells(sg, fmt(Math.round((p.total || 0) * cu)), 700, y + 176, 92, { w: .58, col: ACID2 }); text(sg, 'LAYR ADDED TO YOUR BALANCE', 700, y + 250, 19, SMOKE, MONO, 'center', '700'); }
  (p.lines || []).forEach((s, i) => fitText(sg, s, 700, y + 312 + i * 40, 22, 740, '#d6d9de', SANS, 'center', '400'));
  button(sg, 'collect', p.bonus === 'gamble' || p.bonus === 'potclose' ? 'CONTINUE' : 'COLLECT', 500, y + 470, 400, 80, presCollect, { pulse: true, size: 32 });
  sg.restore();
}
const MSG = () => {
  const w = lastResult && !spinning && !feature() && !pres ? lastResult.wins[highlightIndex(performance.now())] : null;
  if (spinning) return state.free ? 'PEAK TIME · ALL WINS 2×' : 'THE DOORS ARE OPENING…';
  if (w) { let extra = ''; if (w.symbol === 'artifact' || w.symbol === 'bitcoin') { const it = faceItem(w.symbol, faces[0][E.lines[w.line][0]]), tok = it && it.tok; if (tok) extra = `  ·  ${artName(tok).toUpperCase()} #${tok.id}  ·  ${isForever(tok) ? '∞ XTRATA ' + (xidOf(tok) || 'TWIN') : 'NOT YET FOREVER'}`; } return `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${extra}`; }
  return state.free ? `${state.free} FREE SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'DOORS AT MIDNIGHT. FOLLOW THE X.';
};
function drawScreen(now) {
  hits.length = 0; const f = feature(), p = pres, st = p && p.stage, bet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const peak = !!(p && p.bonus === 'free' && st !== 'trigger');
  if (p && st !== 'trigger' && p.bonus === 'jackpot') { if (st === 'intro') { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); sg.fillStyle = 'rgba(4,5,6,.72)'; sg.fillRect(0, 0, 1400, 960); } else drawJackpot(now); }
  else if (p && p.bonus === 'gamble') drawGamble(now);
  else if (p && p.bonus === 'potclose') { if (st === 'play' || st === 'summary') drawPotClose(now); else darkRoom(sg, .7); }
  else if (p && p.bonus === 'vault' && st !== 'trigger') drawGuestList(f || p.snapF, now);
  else if (p && p.bonus === 'chain' && st !== 'trigger') drawTags(f || p.snapF, now);
  else if (peak) { drawPeakBackdrop(now); if (st === 'play') drawReels(now, true); else { sg.fillStyle = 'rgba(8,12,4,.4)'; sg.fillRect(RX, RY, RW, RH); } }
  else { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); }
  const showHud = !(p && (p.bonus === 'jackpot' && (st === 'play' || st === 'summary'))) && !(p && (p.bonus === 'gamble' || p.bonus === 'potclose' || (p.bonus === 'chain' || p.bonus === 'vault') && st !== 'trigger'));
  if (showHud) drawHud(now, bet, peak);
  if (peak && st === 'play') { if (p.retrig && now - p.retrig.t0 < 1800) { const k = ease((now - p.retrig.t0) / 400); sg.save(); sg.globalAlpha = 1 - clamp01((now - p.retrig.t0 - 1300) / 500); rubberStamp(sg, `+${p.retrig.add} SPINS`, 700, 200 + 60 * k, 48, ACID, -.06, .95); sg.restore(); } }
  if (p) {
    if (st === 'trigger') drawTriggerOverlay(now); else if (st === 'intro') drawIntroCard(now); else if (st === 'summary') drawSummary(now);
    if (st === 'intro' || st === 'play') { if (p.bonus !== 'jackpot' && !(p.bonus === 'gamble' && st === 'intro')) button(sg, 'skip', 'SKIP', 1180, 812, 170, 40, skipPres, { ghost: true, size: 20 }); }
    if (st === 'play' && p.bonus === 'chain') { const done = E.featureDone(f || p.snapF), busyNow = tagBusy(now); button(sg, 'respin', done ? ((f || p.snapF).full ? 'ALL TAGGED' : 'OUT OF SPRAYS') : busyNow ? 'SPRAYING…' : 'SPRAY', 500, 818, 400, 58, featureAction, { pulse: !done && !busyNow, ghost: done || busyNow, col: PINK, col2: PINK2, col3: '#a01d5a', size: 28 }); }
    if (st === 'play' && p.bonus === 'free' && state.free > 0 && !spinning) button(sg, 'spinnow', 'SPIN NOW', 560, 812, 280, 40, presAction, { ghost: true, size: 20 });
    if (st === 'play' && p.bonus === 'vault') text(sg, `OPEN ${3 - (f || p.snapF).picks.length} MORE`, 700, 812, 28, ACID2, COND, 'center', '800');
    else if (st === 'play' && (p.bonus === 'chain' || p.bonus === 'potclose')) {} else if (!(p.bonus === 'gamble' || p.bonus === 'jackpot' || p.bonus === 'potclose' || (p.bonus === 'free' && st === 'play' && state.free > 0 && !spinning))) fitText(sg, MSG(), 700, 820, 24, 1100, ACID2, COND, 'center', '800');
    if (st === 'outro') drawWipe(now, p.t0, true); else if (st === 'intro' && now - p.t0 < 700 && !reduced()) drawWipe(now, p.t0, false);
  } else fitText(sg, MSG(), 700, 820, 26, 1300, ACID2, COND, 'center', '800');
  if (lab.on) { sg.save(); hazard(sg, 0, 0, 1400, 24); round(sg, 330, 2, 740, 20, 3, INK); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL${lab.item ? ' · ' + lab.item.toUpperCase() : ''}${lab.runAll ? ` · RUN ALL ${lab.runAll.i + 1}/${lab.runAll.items.length}` : ''}`, 700, 13, 13, ACID, MONO, 'center', '700'); sg.restore(); }
  sg.drawImage(scanLayer, 0, 0);
  rev++; screenDirty = false; fsBlit();
}
function screenTap(x, y) {
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); return; } }
  if (pres && pres.stage === 'trigger') toStage('intro');
}
function particles(n = 35) { if (reduced()) return; for (let i = 0; i < n; i++) { const el = document.createElement('i'); el.className = 'coin inf'; el.textContent = ['✕', 'X', '■'][i % 3]; el.style.left = `${15 + Math.random() * 70}%`; el.style.top = '-25px'; el.style.animationDelay = `${Math.random() * .8}s`; el.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(el); setTimeout(() => el.remove(), 4000); } }
