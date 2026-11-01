
/* ---------- Scene overlays and the screen compositor ---------- */
const crtLayer = (() => { const c = canvas(1400, 960), g = c.getContext('2d'); g.fillStyle = 'rgba(0,0,0,.14)'; for (let y = 0; y < 960; y += 4) g.fillRect(0, y, 1400, 1.4);
  const v = g.createRadialGradient(700, 480, 380, 700, 480, 860); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960);
  g.fillStyle = 'rgba(255,45,149,.10)'; g.fillRect(0, 0, 3, 960); g.fillStyle = 'rgba(34,211,238,.10)'; g.fillRect(1397, 0, 3, 960); g.fillStyle = 'rgba(255,45,149,.06)'; g.fillRect(0, 0, 1400, 2); return c; })();
function wrap(g, s, x, y, maxW, lh, size, color, align = 'center') { g.font = `400 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { text(g, line, x, yy, size, color, 'Arial', align, '400'); line = w; yy += lh; } else line = t; } if (line) text(g, line, x, yy, size, color, 'Arial', align, '400'); return yy; }
function drawWipe(now, t0, closing) { // vertical glitch bars that retract (in) or fill the screen (out)
  const d = reduced() ? 120 : STAGE_MS.outro, u = clamp01((now - t0) / d), k = closing ? u : 1 - u; if (k <= 0) return;
  const n = 14, w = 1400 / n; for (let i = 0; i < n; i++) { const kk = clamp01(k * 1.5 - (i % 5) * .08), h = 960 * kk; sg.fillStyle = i % 3 === 0 ? MAG : i % 3 === 1 ? '#22d3ee' : '#08020f'; sg.fillRect(i * w, 0, w + 1, h); }
}
function drawTriggerOverlay(now) {
  const p = pres, t = now - p.t0, T = TITLES[p.bonus], sym = { free: 'scatter', vault: 'vault', chain: 'chain' }[p.bonus], u = ease(t / 600), R = reduced();
  sg.fillStyle = `rgba(4,1,10,${.6 * u})`; sg.fillRect(RX, RY, RW, RH);
  if (sym) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (state.grid[c][r] === sym) {
    const pulse = R ? 1 : 1 + .1 * Math.sin(t / 100), s = 176 * (1 + .24 * u) * pulse, cx = RX + (c + .5) * CW, cy = RY + (r + .5) * RHT - 14 * u;
    sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 40 * u; sg.globalAlpha = .9; round(sg, cx - s / 2 - 6, cy - s / 2 - 6, s + 12, s + 12, 18, null, '#fff', 4); sg.globalAlpha = 1; sg.drawImage(tileFor(sym, faces[c][r]), cx - s / 2, cy - s / 2, s, s); sg.restore();
  }
  if (p.bonus === 'jackpot') for (let c = 0; c < 5; c++) { const cx = RX + (c + .5) * CW, cy = RY + 1.5 * RHT; sg.save(); sg.shadowColor = '#ffc83d'; sg.shadowBlur = 36 * u; round(sg, cx - 100, cy - 100, 200, 200, 18, null, '#ffe28a', 5); sg.restore(); }
  const slide = R ? 1 : ease((t - 250) / 500), x = 700 + (1 - slide) * 1500, y0 = 330, h = 190;
  sg.save(); sg.globalAlpha = .94; sg.fillStyle = 'rgba(8,2,18,.92)'; sg.fillRect(0, y0, 1400, h); sg.restore(); sg.fillStyle = T.col; sg.fillRect(0, y0, 1400, 4); sg.fillRect(0, y0 + h - 4, 1400, 4);
  sg.save(); sg.beginPath(); sg.rect(0, y0, 1400, h); sg.clip(); sg.fillStyle = '#ffffff0a'; for (let xx = -200 + (t / 6) % 120; xx < 1500; xx += 120) { sg.save(); sg.translate(xx, y0); sg.rotate(-.5); sg.fillRect(0, 0, 40, 400); sg.restore(); } sg.restore();
  sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 30; glitchText(sg, T.t, x, y0 + 80, T.t.length > 12 ? 84 : 104, now, '#fff', 1); sg.restore();
  text(sg, T.sub, x, y0 + 150, 30, T.col, 'Arial', 'center', '700');
}
function drawIntroCard(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), w = 900, x = 250, y = 300 + (1 - u) * 60;
  sg.save(); sg.globalAlpha = u; sg.fillStyle = 'rgba(6,2,14,.95)'; round(sg, x, y, w, 360, 22, 'rgba(6,2,14,.95)', T.col, 3); sg.shadowColor = T.col; sg.shadowBlur = 40;
  const icon = p.bonus === 'free' ? fixed.scatter : p.bonus === 'vault' ? fixed.vault : p.bonus === 'chain' ? (pools.chain[0] ? pools.chain[0].tile : placeholders.chain) : p.bonus === 'jackpot' ? (pools.bitcoin[0] ? pools.bitcoin[0].tile : placeholders.bitcoin) : null; sg.shadowBlur = 0;
  if (icon) sg.drawImage(icon, x + 36, y + 52, 190, 190);
  const tx = icon ? x + 560 : x + w / 2; neon(sg, T.t, tx, y + 74, T.t.length > 12 ? 52 : 64, '#fff', T.col, '900'); text(sg, T.sub, tx, y + 124, 20, T.col, 'Arial', 'center', '700');
  wrap(sg, T.rules, tx, y + 176, icon ? 560 : 780, 34, 24, '#e9d3e1');
  if (p.bonus === 'gamble') { text(sg, `${fmt(p.stake)} LAYR ON THE COIN`, tx, y + 252, 26, '#fff', 'Arial', 'center', '700'); button(sg, 'heads', 'HEADS', x + 90, y + 290, 250, 56, () => gambleCall('even'), { col: '#ffc83d', col2: '#ffe28a' }); button(sg, 'hacks', 'HACKS', x + 360, y + 290, 250, 56, () => gambleCall('odd')); button(sg, 'keep', 'KEEP WIN', x + 630, y + 290, 230, 56, keepGamble, { ghost: true, size: 22 }); }
  else if (p.bonus === 'jackpot') text(sg, `${fmt(p.amount)} LAYR`, tx, y + 314, 44, '#ffe28a', 'Arial', 'center', '900');
  else button(sg, 'start', T.start, x + w / 2 - 190, y + 276, 380, 66, presStart, { pulse: true, col: T.col, size: 26 });
  sg.restore();
}
function drawSummary(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), cu = reduced() ? 1 : ease((t - 300) / 1800), x = 300, y = 190 + (1 - u) * 50;
  sg.save(); sg.globalAlpha = u; round(sg, x, y, 800, 560, 22, 'rgba(6,2,14,.97)', T.col, 3);
  text(sg, p.bonus === 'gamble' ? (p.result ? (p.result.win ? 'DOUBLED' : 'NOT THIS TIME') : 'KEPT') : p.bonus === 'jackpot' ? 'TOTAL CRASH PAID' : `${T.t} COMPLETE`, 700, y + 60, p.bonus === 'jackpot' ? 48 : 40, T.col, 'Arial', 'center', '900');
  neon(sg, fmt((p.total || 0) * cu), 700, y + 170, 108, '#fff', T.col, '900'); text(sg, 'LAYR ADDED TO YOUR BALANCE', 700, y + 244, 20, MAG3, 'Arial', 'center', '700');
  (p.lines || []).forEach((s, i) => text(sg, s, 700, y + 306 + i * 40, 24, '#e9d3e1', 'Arial', 'center', '400'));
  button(sg, 'collect', p.bonus === 'gamble' ? 'CONTINUE' : 'COLLECT', 500, y + 440, 400, 80, presCollect, { pulse: true, col: T.col, size: 32 });
  sg.restore();
}
function drawJackpotPlay(now) {
  const p = pres, t = now - p.t0, R = reduced(), k = ease(t / (R ? 1200 : 3600));
  sg.fillStyle = lin(sg, 0, 0, 0, 960, ['#12020c', '#3a0a1a', '#12020c']); sg.fillRect(0, 0, 1400, 960);
  sg.save(); sg.translate(700, 480); if (!R) for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12 + t / 2400; sg.rotate(Math.PI / 12 * 0); sg.fillStyle = i % 2 ? 'rgba(255,200,61,.12)' : 'rgba(255,62,165,.12)'; sg.beginPath(); sg.moveTo(0, 0); sg.arc(0, 0, 1000, a, a + Math.PI / 24); sg.closePath(); sg.fill(); } sg.restore();
  const legends = pools.bitcoin; if (legends.length && !R) for (let i = 0; i < 12; i++) { const ph = (t / 1600 + i / 12) % 1, x = 90 + (i * 131) % 1220, y = -150 + ph * 1200, s = 110 + (i % 3) * 20; sg.save(); sg.globalAlpha = .9; sg.translate(x, y); sg.rotate(Math.sin(ph * 6 + i) * .4); sg.drawImage(legends[i % legends.length].tile, -s / 2, -s / 2, s, s); sg.restore(); }
  neon(sg, 'TOTAL CRASH', 700, 250, 128, '#ffe28a', '#ffc83d', '900'); text(sg, 'PROGRESSIVE JACKPOT', 700, 340, 30, MAG2, 'Arial', 'center', '700');
  neon(sg, fmt(p.amount * k), 700, 520, 130, '#fff', '#ffc83d', '900'); text(sg, `LAYR · ${fmt(p.bet)} BET LEVEL`, 700, 610, 26, '#ffe28a', 'Arial', 'center', '700');
}
const MSG = () => {
  const w = lastResult && !spinning && !feature() && !pres ? lastResult.wins[highlightIndex(performance.now())] : null;
  if (spinning) return state.free ? 'JACKED IN SPIN · ALL WINS 2×' : 'JACKING IN…';
  if (w) { let wt = null; const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = state.grid[c][line[c]], it = FACE(s) ? faceItem(s, faces[c][line[c]]) : null; if (it) { wt = it; break; } } return `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${wt ? `  ·  PUNK #${wt.id}${wt.forever ? ` · XTRATA #${wt.xtrataId}` : ' · NOT YET FOREVER'}` : ''}`; }
  return state.free ? `${state.free} JACKED IN SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'REAL CRASH PUNKS. ON STACKS. JACK IN.';
};
function drawScreen(now) {
  hits.length = 0; const f = feature(), p = pres, st = p && p.stage, bet = f ? f.bet : state.free ? state.freeBet : state.bet;
  if (crash && !p) crash = null;
  const jackBg = p && p.bonus === 'free' && st !== 'trigger' && st !== 'summary' ? true : p && p.bonus === 'free' && st === 'summary';
  if (p && st !== 'trigger' && p.bonus === 'jackpot') { if (st === 'intro') { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); sg.fillStyle = 'rgba(4,1,10,.7)'; sg.fillRect(0, 0, 1400, 960); } else drawJackpotPlay(now); }
  else if (p && p.bonus === 'gamble') drawGamble(now);
  else if (p && p.bonus === 'vault' && st !== 'trigger') drawClub(f || p.snapF, now);
  else if (p && p.bonus === 'chain' && st !== 'trigger') drawStreet(f || p.snapF, now);
  else if (jackBg) { drawJackBackdrop(now); drawColumns(true, now); if (st === 'play') drawReels(now, true); else { sg.fillStyle = 'rgba(4,1,10,.45)'; sg.fillRect(RX, RY, RW, RH); } }
  else { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); }
  const showHud = !(p && p.bonus === 'jackpot' && (st === 'play' || st === 'summary')) && !(p && p.bonus === 'gamble');
  if (showHud) drawHud(now, bet, !!(p && p.bonus === 'free' && st !== 'trigger'));
  if (p && p.bonus === 'free' && st === 'play') { text(sg, `TOTAL ${fmt(state.freeTotal)}`, 125, 146, 20, MAG2, 'Arial', 'left'); if (p.retrig && now - p.retrig.t0 < 1800) { const k = ease((now - p.retrig.t0) / 400); sg.save(); sg.globalAlpha = 1 - clamp01((now - p.retrig.t0 - 1300) / 500); neon(sg, `+${p.retrig.add} SPINS`, 700, 120 + 60 * k, 70, '#fff', MAG, '900'); sg.restore(); } }
  if (p) {
    if (st === 'trigger') drawTriggerOverlay(now); else if (st === 'intro') drawIntroCard(now); else if (st === 'summary') drawSummary(now);
    if (p.bonus === 'gamble' && st === 'play' && !reduced()) {}
    if (st === 'intro' || st === 'play') { if (p.bonus !== 'gamble' && p.bonus !== 'jackpot') button(sg, 'skip', 'SKIP', 1180, 822, 170, 44, skipPres, { ghost: true, size: 20 }); else if (p.bonus === 'gamble' && st === 'play') button(sg, 'skip', 'SKIP', 1180, 822, 170, 44, skipPres, { ghost: true, size: 20 }); }
    if (st === 'play' && p.bonus === 'chain') { const done = E.featureDone(f || p.snapF); button(sg, 'respin', done ? 'LOCKED IN' : 'RESPIN', 500, 822, 400, 54, featureAction, { pulse: !done, ghost: done, col: CY, col2: '#9bf0ff', size: 26 }); }
    if (st === 'play' && p.bonus === 'free' && state.free > 0 && !spinning) button(sg, 'spinnow', 'SPIN NOW', 560, 822, 280, 46, presAction, { ghost: true, size: 20 });
    if (st === 'play' && p.bonus === 'vault') text(sg, `OPEN ${3 - (f || p.snapF).picks.length} MORE`, 700, 812, 28, '#ffd23f');
    else if (st === 'play' && p.bonus === 'chain') {} else if (!(p.bonus === 'gamble' || (p.bonus === 'free' && st === 'play' && state.free > 0 && !spinning))) text(sg, MSG(), 700, 812, 26, MAG2);
    if (st === 'outro') drawWipe(now, p.t0, true); else if ((st === 'intro' || st === 'play') && now - p.t0 < 650 && !reduced() && p.stage === 'intro') drawWipe(now, p.t0, false);
  } else { text(sg, MSG(), 700, 812, 26, state.free ? CY : MAG2); }
  if (dark() && !p) drawStandby(now);
  sg.drawImage(crtLayer, 0, 0);
  applyCrash(now);
  rev++; screenDirty = false; fsBlit();
}
function screenTap(x, y) {
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); return; } }
  const f = feature(); if (pres && pres.stage === 'trigger') toStage('intro');
}
function particles(n = 35) { if (reduced()) return; for (let i = 0; i < n; i++) { const el = document.createElement('i'); el.className = 'coin inf'; el.textContent = ['₿', '◆', '✦'][i % 3]; el.style.left = `${15 + Math.random() * 70}%`; el.style.top = '-25px'; el.style.animationDelay = `${Math.random() * .8}s`; el.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(el); setTimeout(() => el.remove(), 4000); } }
