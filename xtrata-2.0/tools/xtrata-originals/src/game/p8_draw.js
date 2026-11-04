/* ---------- Scene overlays and the screen compositor ---------- */
const glassLayer = (() => { const c = canvas(1400, 960), g = c.getContext('2d'); // a faint layered-glass effect: three offset sheens and a soft vignette
  for (const [x, a] of [[-200, .035], [260, .025], [820, .03]]) { const gr = g.createLinearGradient(x, 0, x + 520, 960); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, `rgba(200,220,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 1400, 960); }
  const v = g.createRadialGradient(700, 480, 420, 700, 480, 880); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960);
  g.fillStyle = 'rgba(70,117,182,.16)'; g.fillRect(0, 0, 1400, 2); g.fillStyle = 'rgba(226,140,59,.14)'; g.fillRect(0, 958, 1400, 2); return c; })();
function wrap(g, s, x, y, maxW, lh, size, color, align = 'center') { g.font = `400 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { text(g, line, x, yy, size, color, 'Arial', align, '400'); line = w; yy += lh; } else line = t; } if (line) text(g, line, x, yy, size, color, 'Arial', align, '400'); return yy; }
function drawWipe(now, t0, closing) { // strata bars that retract (in) or stack up to fill the screen (out)
  const d = reduced() ? 120 : STAGE_MS.outro, u = clamp01((now - t0) / d), k = closing ? u : 1 - u; if (k <= 0) return;
  const n = 12, h = 960 / n; for (let i = 0; i < n; i++) { const kk = clamp01(k * 1.5 - ((n - 1 - i) % 6) * .08), w = 1400 * kk; sg.fillStyle = i % 3 === 0 ? BLUE : i % 3 === 1 ? OR : '#07090d'; sg.fillRect(i % 2 ? 1400 - w : 0, i * h, w, h + 1); }
}
function triggerIcon(bonus) { return bonus === 'free' ? fixed.scatter : bonus === 'vault' ? (pools.vault[0] ? pools.vault[0].tile : placeholders.vault) : bonus === 'chain' ? (pools.chain[0] ? pools.chain[0].tile : placeholders.chain) : bonus === 'jackpot' ? fixed.bitcoin : null; }
function drawTriggerOverlay(now) {
  const p = pres, t = now - p.t0, T = TITLES[p.bonus], sym = { free: 'scatter', vault: 'vault', chain: 'chain' }[p.bonus], u = ease(t / 600), R = reduced();
  sg.fillStyle = `rgba(3,4,8,${.6 * u})`; sg.fillRect(RX, RY, RW, RH);
  if (sym) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (state.grid[c][r] === sym) { // the triggering symbols pulse and lift out of the reels
    const pulse = R ? 1 : 1 + .1 * Math.sin(t / 100), s = 176 * (1 + .24 * u) * pulse, cx = RX + (c + .5) * CW, cy = RY + (r + .5) * RHT - 14 * u;
    sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 40 * u; sg.globalAlpha = .9; round(sg, cx - s / 2 - 6, cy - s / 2 - 6, s + 12, s + 12, 18, null, '#fff', 4); sg.globalAlpha = 1; sg.drawImage(tileFor(sym, faces[c][r]), cx - s / 2, cy - s / 2, s, s); sg.restore();
  }
  if (p.bonus === 'jackpot') for (let c = 0; c < 5; c++) { const cx = RX + (c + .5) * CW, cy = RY + 1.5 * RHT; sg.save(); sg.shadowColor = OR2; sg.shadowBlur = 36 * u; round(sg, cx - 100, cy - 100, 200, 200, 18, null, '#ffd9a8', 5); sg.restore(); }
  const slide = R ? 1 : ease((t - 250) / 500), x = 700 + (1 - slide) * 1500, y0 = 330, h = 190;
  sg.save(); sg.globalAlpha = .95; sg.fillStyle = 'rgba(4,6,10,.94)'; sg.fillRect(0, y0, 1400, h); sg.restore(); sg.fillStyle = BLUE; sg.fillRect(0, y0, 1400, 4); sg.fillStyle = OR; sg.fillRect(0, y0 + h - 4, 1400, 4);
  sg.save(); sg.beginPath(); sg.rect(0, y0, 1400, h); sg.clip(); for (let k = 0; k < 8; k++) { sg.fillStyle = [BLUE, OR, WHITE][k % 3] + '14'; sg.fillRect(0, y0 + 12 + k * 22 + (R ? 0 : (t / 30) % 22), 1400, 2); } sg.restore();
  sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 30; fitText(sg, T.t, x, y0 + 82, 100, 1240, '#fff', 'Arial', 'center', '900'); sg.restore();
  text(sg, T.sub, x, y0 + 150, 30, T.col, 'Arial', 'center', '700');
}
function drawIntroCard(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), w = 900, x = 250, y = 300 + (1 - u) * 60, icon = triggerIcon(p.bonus);
  sg.save(); sg.globalAlpha = u; round(sg, x, y, w, 360, 22, 'rgba(5,7,11,.96)', T.col, 3);
  if (icon) sg.drawImage(icon, x + 36, y + 52, 190, 190); else if (p.bonus === 'gamble') drawCoin(sg, x + 131, y + 147, 86, R0(now));
  const tx = x + 560; sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 24; fitText(sg, T.t, tx, y + 74, 60, 600, '#fff', 'Arial', 'center', '900'); sg.restore(); text(sg, T.sub, tx, y + 124, 20, T.col, 'Arial', 'center', '700');
  wrap(sg, T.rules, tx, y + 176, 560, 34, 23, '#d5dbe6');
  if (p.bonus === 'gamble') { text(sg, `${fmt(p.stake)} LAYR ON THE COIN`, tx, y + 252, 24, '#fff', 'Arial', 'center', '700'); button(sg, 'btc', '₿ BITCOIN', x + 70, y + 290, 260, 56, () => gambleCall('even'), { col: '#f7931a', col2: '#ffc46b' }); button(sg, 'stx', 'STACKS', x + 350, y + 290, 260, 56, () => gambleCall('odd'), { col: '#5546ff', col2: '#8b7dff', ink: '#fff' }); button(sg, 'keep', 'KEEP WIN', x + 630, y + 290, 230, 56, keepGamble, { ghost: true, size: 22 }); }
  else if (p.bonus === 'jackpot') text(sg, `${fmt(p.amount)} LAYR`, tx, y + 314, 44, OR2, 'Arial', 'center', '900');
  else button(sg, 'start', T.start, x + w / 2 - 190, y + 276, 380, 66, presStart, { pulse: true, col: T.col, col2: '#ffffff', size: 26 });
  sg.restore();
}
const R0 = now => reduced() ? 0 : Math.sin(now / 700) * .6;
function drawSummary(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), cu = reduced() ? 1 : ease((t - 300) / 1800), x = 300, y = 190 + (1 - u) * 50;
  sg.save(); sg.globalAlpha = u; round(sg, x, y, 800, 560, 22, 'rgba(5,7,11,.97)', T.col, 3); sg.fillStyle = BLUE; sg.fillRect(x + 40, y + 2, 720, 3); sg.fillStyle = OR; sg.fillRect(x + 40, y + 555, 720, 3);
  fitText(sg, p.bonus === 'gamble' ? (p.result ? (p.result.win ? 'DOUBLED' : 'NOT THIS TIME') : 'KEPT') : p.bonus === 'jackpot' ? 'THE X IS PAID' : `${T.t} COMPLETE`, 700, y + 60, 40, 720, T.col, 'Arial', 'center', '900');
  neon(sg, fmt((p.total || 0) * cu), 700, y + 170, 108, '#fff', T.col, '900'); text(sg, lab.on ? 'ADDED TO THE LAB BALANCE' : 'LAYR ADDED TO YOUR BALANCE', 700, y + 244, 20, BLUE3, 'Arial', 'center', '700');
  (p.lines || []).forEach((s, i) => text(sg, s, 700, y + 306 + i * 40, 24, '#d5dbe6', 'Arial', 'center', '400'));
  button(sg, 'collect', p.bonus === 'gamble' ? 'CONTINUE' : 'COLLECT', 500, y + 440, 400, 80, presCollect, { pulse: true, col: T.col, col2: '#ffffff', size: 32 });
  sg.restore();
}
const MSG = () => {
  const w = lastResult && !spinning && !feature() && !pres ? lastResult.wins[highlightIndex(performance.now())] : null;
  if (spinning) return state.free ? 'SESSION STEP · ALL WINS 2×' : 'INSCRIBING…';
  if (w) { const it = cameoOf(w); return `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${it ? `  ·  AUDIONAUT ${pad3(it.edition)} ${String(it.name || '').toUpperCase()} · XTRATA #${it.tokenId}` : ''}`; }
  return state.free ? `${state.free} SESSION STEPS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'BORN ON CHAIN. INSCRIBE TO PLAY.';
};
function drawScreen(now) {
  hits.length = 0; const f = feature(), p = pres, st = p && p.stage, bet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const session = !!(p && p.bonus === 'free' && st !== 'trigger');
  if (p && st !== 'trigger' && p.bonus === 'jackpot') { if (st === 'intro') { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); sg.fillStyle = 'rgba(3,4,8,.7)'; sg.fillRect(0, 0, 1400, 960); } else drawJackpotPlay(now); }
  else if (p && p.bonus === 'gamble') drawGamble(now);
  else if (p && p.bonus === 'vault' && st !== 'trigger') drawChorus(f || p.snapF, now);
  else if (p && p.bonus === 'chain' && st !== 'trigger') drawLayers(f || p.snapF, now);
  else if (session) { drawSessionBackdrop(now); if (st === 'play') drawReels(now, true); else { drawReels(now, false); sg.fillStyle = 'rgba(3,6,6,.5)'; sg.fillRect(RX, RY, RW, RH); } }
  else { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); }
  const showHud = !(p && p.bonus === 'jackpot' && (st === 'play' || st === 'summary')) && !(p && (p.bonus === 'gamble' || ((p.bonus === 'vault' || p.bonus === 'chain') && st !== 'trigger')));
  if (session) { drawSequencer(now); text(sg, 'AUDIONAUTS HOLDER POT', 1268, 48, 14, BLUE3); neon(sg, fmt(state.pot), 1268, 84, 34, '#fff', BLUE, '700'); text(sg, perHolderText(), 1268, 116, 13, OR2); text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, WHITE, 'Arial', 'left'); text(sg, `BET  ${fmt(bet)}`, 700, 920, 26, WHITE); text(sg, `SESSION  ${fmt(state.freeTotal)}`, 1332, 920, 26, TEAL, 'Arial', 'right'); }
  else if (showHud) drawHud(now, bet);
  if (p && p.bonus === 'free' && st === 'play' && p.retrig && now - p.retrig.t0 < 1800) { const k = ease((now - p.retrig.t0) / 400); sg.save(); sg.globalAlpha = 1 - clamp01((now - p.retrig.t0 - 1300) / 500); neon(sg, `+${p.retrig.add} STEPS`, 700, 300 + 40 * k, 80, '#fff', TEAL, '900'); sg.restore(); }
  if (p) {
    if (st === 'trigger') drawTriggerOverlay(now); else if (st === 'intro') drawIntroCard(now); else if (st === 'summary') drawSummary(now);
    if ((st === 'intro' && p.bonus !== 'gamble' && p.bonus !== 'jackpot') || (st === 'play' && p.bonus !== 'jackpot')) button(sg, 'skip', 'SKIP', p.bonus === 'chain' ? 40 : 1180, p.bonus === 'chain' ? 868 : 822, 170, 44, skipPres, { ghost: true, size: 20 });
    if (st === 'play' && p.bonus === 'chain') { const done = E.featureDone(f || p.snapF); button(sg, 'respin', done ? 'STACKED' : 'RESPIN', 260, 806, 400, 54, featureAction, { pulse: !done, ghost: done, col: BLUE2, col2: BLUE3, size: 26 }); }
    if (st === 'play' && p.bonus === 'free' && state.free > 0 && !spinning) button(sg, 'spinnow', 'NEXT STEP', 560, 822, 280, 46, presAction, { ghost: true, col: TEAL, col2: TEAL, size: 20 });
    if (st === 'play' && p.bonus === 'vault') text(sg, `OPEN ${3 - (f || p.snapF).picks.length} MORE`, 700, 840, 26, '#d8f5a8');
    else if ((st === 'play' || st === 'intro') && (p.bonus === 'chain' || p.bonus === 'gamble' || p.bonus === 'jackpot')) {} else if (!(p.bonus === 'free' && st === 'play' && state.free > 0 && !spinning) && st !== 'summary') text(sg, MSG(), 700, 812, 24, OR2);
    if (st === 'outro') drawWipe(now, p.t0, true); else if (st === 'intro' && now - p.t0 < 650 && !reduced()) drawWipe(now, p.t0, false);
  } else fitText(sg, MSG(), 700, 812, 24, 1300, state.free ? TEAL : OR2);
  if (lab.on) { sg.save(); sg.fillStyle = OR2; sg.fillRect(0, 0, 1400, 24); text(sg, 'BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL · YOUR REAL GAME IS UNTOUCHED', 700, 13, 14, '#1b0d02', 'Arial', 'center', '900'); sg.restore(); }
  sg.drawImage(glassLayer, 0, 0);
  rev++; screenDirty = false; fsBlit();
}
function screenTap(x, y) {
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); return; } }
  if (pres && pres.stage === 'trigger') toStage('intro');
}
function particles(n = 35) { if (reduced()) return; for (let i = 0; i < n; i++) { const el = document.createElement('i'); el.className = 'coin inf'; el.textContent = ['✕', '◆', '▬'][i % 3]; el.style.color = [WHITE, BLUE2, OR2][i % 3]; el.style.left = `${15 + Math.random() * 70}%`; el.style.top = '-25px'; el.style.animationDelay = `${Math.random() * .8}s`; el.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(el); setTimeout(() => el.remove(), 4000); } }
