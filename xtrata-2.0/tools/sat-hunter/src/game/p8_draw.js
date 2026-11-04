
/* ---------- Scene overlays and the screen compositor ---------- */
// The sheet of specimen glass over the whole screen: a soft vignette and one faint diagonal glare.
const scanLayer = (() => { const c = canvas(1400, 960), g = c.getContext('2d'); const v = g.createRadialGradient(700, 480, 380, 700, 480, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(0, 0, 1400, 960);
  const gl = g.createLinearGradient(0, 0, 1400, 960); gl.addColorStop(0, 'rgba(190,230,255,0)'); gl.addColorStop(.22, 'rgba(190,230,255,.045)'); gl.addColorStop(.3, 'rgba(190,230,255,0)'); gl.addColorStop(.62, 'rgba(190,230,255,0)'); gl.addColorStop(.68, 'rgba(190,230,255,.03)'); gl.addColorStop(.74, 'rgba(190,230,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, 1400, 960); return c; })();
const HB = { col: BRASS, col2: BRASS2, col3: BRASS3 }, SMOKE_ = '#a9b3bb';
function wrap(g, s, x, y, maxW, lh, size, color, align = 'center', font = SANS) { const ls = wrapLines(g, s, maxW, size, font, '400'); ls.forEach((l, i) => text(g, l, x, y + i * lh, size, color, font, align, '400')); return y + (ls.length - 1) * lh; }
// The wipe between stages: an oak shutter with a brass lip slides down (out) or up (in).
function drawWipe(now, t0, closing) {
  const d = reduced() ? 120 : STAGE_MS.outro, u = clamp01((now - t0) / d), k = closing ? easeIO(u) : 1 - easeIO(u); if (k <= 0) return;
  const h = 960 * k; sg.save(); sg.beginPath(); sg.rect(0, 0, 1400, h); sg.clip();
  sg.drawImage(hnTile('wipe', 1400, 960, c => { hnOak(c, 0, 0, 1400, 960, 8, .05); for (let x = 0; x < 1400; x += 140) { c.fillStyle = 'rgba(0,0,0,.42)'; c.fillRect(x, 0, 3, 960); c.fillStyle = 'rgba(255,200,140,.07)'; c.fillRect(x + 3, 0, 1, 960); } }), 0, 0); sg.restore();
  const ly = Math.max(0, h - 26); hnBrass(sg, 0, ly, 1400, 26, 0, 1); for (let x = 40; x < 1400; x += 160) hnScrew(sg, x, ly + 13, 4, x / 40);
}
// An oak panel with a glass inset and a brass frame, screwed at the corners.
function panel(g, x, y, w, h) {
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 40; round(g, x, y, w, h, 8, '#0c0f12'); g.restore();
  g.save(); g.beginPath(); g.roundRect(x + 4, y + 4, w - 8, h - 8, 6); g.clip(); hnOakImg(g, x + 4, y + 4, w - 8, h - 8, 13, .12); g.restore();
  round(g, x + 16, y + 16, w - 32, h - 32, 4, 'rgba(4,11,17,.68)', BRASS4, 1.5); hnGlass(g, x + 16, y + 16, w - 32, h - 32, .8);
  round(g, x, y, w, h, 8, null, BRASS, 4); round(g, x + 4, y + 4, w - 8, h - 8, 6, null, BRASS4, 1.5);
  [[x + 14, y + 14], [x + w - 14, y + 14], [x + 14, y + h - 14], [x + w - 14, y + h - 14]].forEach(([a, b], i) => hnScrew(g, a, b, 5, i * 1.1));
}
function drawTriggerOverlay(now) {
  const p = pres, t = now - p.t0, T = TITLES[p.bonus], sym = { free: 'scatter', vault: 'vault', chain: 'chain' }[p.bonus], u = ease(t / 600), R = reduced();
  sg.fillStyle = `rgba(3,6,10,${.66 * u})`; sg.fillRect(RX, RY, RW, RH);
  if (sym) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (state.grid[c][r] === sym) {
    const pulse = R ? 1 : 1 + .1 * Math.sin(t / 100), s = 176 * (1 + .24 * u) * pulse, cx = RX + (c + .5) * CW, cy = RY + (r + .5) * RHT - 14 * u;
    sg.save(); sg.shadowColor = T.col; sg.shadowBlur = 40 * u; sg.globalAlpha = .9; round(sg, cx - s / 2 - 6, cy - s / 2 - 6, s + 12, s + 12, 12, null, '#fff', 4); sg.globalAlpha = 1; sg.drawImage(tileFor(sym, faces[c][r]), cx - s / 2, cy - s / 2, s, s); sg.restore();
  }
  if (p.bonus === 'jackpot') for (let c = 0; c < 5; c++) { const cx = RX + (c + .5) * CW, cy = RY + 1.5 * RHT; sg.save(); sg.shadowColor = ACCENT2; sg.shadowBlur = 36 * u; round(sg, cx - 100, cy - 100, 200, 200, 12, null, ACCENT2, 5); sg.restore(); }
  // the title plate: a brass plate engraved with the bonus name, sliding in along the bench
  const slide = R ? 1 : ease((t - 250) / 500), x = 700 + (1 - slide) * 1500, y0 = 320, h = 210;
  sg.save(); sg.translate(x - 700, 0); panel(sg, 160, y0, 1080, h);
  text(sg, `FEATURE ${T.no}`, 700, y0 + 40, 17, BRASS2, MONO, 'center', '700');
  const typed = R ? T.t.length : Math.min(T.t.length, Math.floor((t - 250) / 55)); glowText(sg, T.t.slice(0, Math.max(0, typed)), 700, y0 + 108, T.t.length > 14 ? 78 : 98, PAPER, ACCENT);
  text(sg, T.sub, 700, y0 + 172, 26, ACCENT2, COND, 'center', '800');
  if (t > 900) rubberStamp(sg, 'FOUND', 1120, y0 + 50, 24, ACCENT2, .14, clamp01((t - 900) / 200)); sg.restore();
}
// The little brass clock face for the Period snapshot: seven days round the dial, a hand sweeping.
function hnDial(g, cx, cy, r, now) {
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 16; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = lin(g, cx - r, cy - r, cx + r, cy + r, [BRASS2, BRASS, BRASS3]); g.fill(); g.restore();
  g.beginPath(); g.arc(cx, cy, r * .86, 0, 7); g.fillStyle = PAPER; g.fill(); g.strokeStyle = BRASS4; g.lineWidth = 2; g.stroke();
  ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 7; g.strokeStyle = BRASS4; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * .66, cy + Math.sin(a) * r * .66); g.lineTo(cx + Math.cos(a) * r * .8, cy + Math.sin(a) * r * .8); g.stroke(); text(g, d, cx + Math.cos(a) * r * .5, cy + Math.sin(a) * r * .5, r * .2, INK, SERIF, 'center', '700'); });
  const a = reduced() ? -Math.PI / 2 : -Math.PI / 2 + (now / 4000 % 1) * Math.PI * 2; g.strokeStyle = RED; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * r * .72, cy + Math.sin(a) * r * .72); g.stroke(); g.fillStyle = BRASS4; g.beginPath(); g.arc(cx, cy, 6, 0, 7); g.fill();
  text(g, 'UTC', cx, cy + r * .22, r * .13, BRASS4, MONO, 'center', '700');
}
// The art on the left of the intro card, one per bonus. Which record shows is chosen once per bonus with Math.random (art only).
function introArt(p, cx, cy, now) {
  const g = sg, R = reduced(), bob = R ? 0 : Math.sin(now / 700) * 4;
  if (p.bonus === 'free') { const rec = p.art || (p.art = symbolRecord('scatter')); hnLoupe(g, cx, cy + bob - 20, 100, 2.35, (gg, x, y, rr) => { if (rec) hnDrawCoin(gg, x, y, rr * .84, rec, { slot: 'scatter', glow: 0 }); }); }
  else if (p.bonus === 'vault') { [-1, 0, 1].forEach(k => { g.save(); g.translate(cx + k * 84, cy + 10 + (k ? 8 : -6) + bob * (k ? -.5 : .5)); g.rotate(k * .11); hnTube(g, -42, -112, 84, 224, { liquid: .45, grain: { t: now / 500 + k, a: 1 }, glow: k ? 0 : .3, label: String(k + 2) }); g.restore(); }); }
  else if (p.bonus === 'chain') { const H = (HN.hunts || [])[2] || null; g.save(); g.beginPath(); g.rect(cx - 130, cy - 26, 260, 52); g.clip(); g.fillStyle = 'rgba(2,10,16,.85)'; g.fillRect(cx - 130, cy - 26, 260, 52); hnRibbon(g, now, cx - 130, cx + 130, cy, 1, 'rgba(111,211,255,.6)', 1, H); g.restore(); round(g, cx - 130, cy - 26, 260, 52, 4, null, BRASS, 3);
    const lx = R ? cx : cx + Math.sin(now / 900) * 60; hnLoupe(g, lx, cy, 64, 2.35, (gg, x, y, rr) => { gg.fillStyle = 'rgba(0,12,22,.95)'; gg.fillRect(x - rr, y - rr, rr * 2, rr * 2); gg.translate(x, y); gg.scale(2, 2); gg.translate(-x, -y); hnRibbon(gg, now, x - rr, x + rr, y, 1, '#fff', 1, H); }); }
  else if (p.bonus === 'jackpot') hnCoin(g, cx, cy + bob, 108, HN.mythic, { key: 'mythic', now, glow: 34, nocache: true });
  else if (p.bonus === 'gamble') { g.save(); g.translate(cx - 62, cy); g.rotate(-.1); gambleFace(g, 72, 'odd'); g.restore(); g.save(); g.translate(cx + 68, cy + 20); g.rotate(.1); gambleFace(g, 72, 'even'); g.restore(); }
  else if (p.bonus === 'halvingday') { const rec = p.rare || (p.rare = hnRareSat()); hnLoupe(g, cx, cy + bob - 20, 100, 2.35, (gg, x, y, rr) => { if (rec) hnDrawCoin(gg, x, y, rr * .84, rec, { slot: 'wild', glow: 0 }); }); }
  else if (p.bonus === 'epoch') hnDial(g, cx, cy + bob, 108, now);
}
function drawIntroCard(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), w = 960, x = 220, y = 280 + (1 - u) * 60;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, w, 400);
  const tx = x + 600; introArt(p, x + 165, y + 200, now);
  fitText(sg, T.t, tx, y + 74, T.t.length > 14 ? 54 : 64, 580, PAPER, COND, 'center', '800'); text(sg, T.sub, tx, y + 122, 20, BRASS2, MONO, 'center', '700');
  wrap(sg, T.rules, tx, y + 170, 580, 30, 21, '#e6dcc4');
  if (p.bonus === 'gamble') { text(sg, `${fmt(p.stake)} LAYR ON THE CALL`, tx, y + 268, 24, BRASS2, COND, 'center', '800'); button(sg, 'no', 'ODD SAT', x + 330, y + 300, 200, 64, () => gambleCall('odd'), { col: ACCENT, col2: ACCENT2, col3: ACCENT3 }); button(sg, 'yes', 'EVEN SAT', x + 545, y + 300, 200, 64, () => gambleCall('even'), HB); button(sg, 'keep', 'KEEP WIN', x + 760, y + 300, 170, 64, keepGamble, { ...HB, ghost: true, size: 22 }); }
  else if (p.bonus === 'jackpot') text(sg, `${fmt(p.amount)} LAYR`, tx, y + 320, 48, BRASS2, COND, 'center', '800');
  else button(sg, 'start', T.start, tx - 210, y + 300, 420, 66, presStart, { ...HB, pulse: true, size: 28 });
  sg.restore();
}
function drawSummary(now) {
  const p = pres, T = TITLES[p.bonus], t = now - p.t0, u = reduced() ? 1 : ease(t / 500), cu = reduced() ? 1 : ease((t - 300) / 1800), x = 290, y = 170 + (1 - u) * 50;
  sg.save(); sg.globalAlpha = u; panel(sg, x, y, 820, 600);
  const head = p.bonus === 'gamble' ? (p.result ? (p.result.win ? 'DOUBLED' : 'NOT THIS TIME') : 'KEPT') : p.bonus === 'jackpot' ? 'MYTHIC JACKPOT PAID' : p.bonus === 'halvingday' ? 'RARE SAT FOUND' : p.bonus === 'epoch' ? 'PERIOD CLOSED' : `${T.t} · COMPLETE`;
  fitText(sg, head, 700, y + 70, 44, 740, PAPER, COND, 'center', '800');
  if (p.bonus === 'halvingday' || p.bonus === 'epoch') {
    const rr = p.rare, w = Number.isFinite(p.wallets) ? p.wallets : Number.isFinite(p.twins) ? p.twins : null, pot = Number.isFinite(p.pot) ? p.pot : 0;
    if (p.bonus === 'halvingday') { fitText(sg, rr ? hnSat(rr) : '—', 700, y + 176, 74, 740, BRASS2, COND, 'center', '800'); text(sg, rr ? `SAT · BLOCK ${hnGroup(rr.block)} · ${hnTagName(rr, hnKey(rr, 'wild'))} · DISPLAY ONLY` : 'DISPLAY ONLY', 700, y + 250, 19, SMOKE_, MONO, 'center', '700'); }
    else { fitText(sg, w > 0 ? fmt(r2(pot / w)) : 'UNKNOWN', 700, y + 176, 88, 740, BRASS2, COND, 'center', '800'); text(sg, w > 0 ? 'LAYR PER WALLET · DISPLAY ONLY' : 'SHARE PER WALLET · WALLET LINKING: NOT LIVE YET', 700, y + 250, 19, SMOKE_, MONO, 'center', '700'); }
  } else { flapCells(sg, fmt(Math.round((p.total || 0) * cu)), 700, y + 176, 92, { w: .58, col: BRASS2 }); text(sg, 'LAYR ADDED TO YOUR BALANCE', 700, y + 250, 19, SMOKE_, MONO, 'center', '700'); }
  (p.lines || []).forEach((s, i) => fitText(sg, s, 700, y + 312 + i * 40, 22, 740, '#e6dcc4', SANS, 'center', '400'));
  button(sg, 'collect', p.bonus === 'gamble' || p.bonus === 'epoch' || p.bonus === 'halvingday' ? 'CONTINUE' : 'COLLECT', 500, y + 470, 400, 80, presCollect, { ...HB, pulse: true, size: 32 });
  sg.restore();
}
const MSG = () => {
  const w = lastResult && !spinning && !feature() && !pres ? lastResult.wins[highlightIndex(performance.now())] : null;
  if (spinning) return state.free ? "SATOSHI'S STASH · ALL WINS 2×" : 'HUNTING…';
  if (w) return `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${w.symbol === 'wild' ? '  ·  RARE SAT: WILD' : ''}`;
  return state.free ? `${state.free} FREE SPINS  ·  ALL WINS 2×` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'EVERY SAT HAS A STORY. HUNT.';
};
function drawScreen(now) {
  hits.length = 0; const f = feature(), p = pres, st = p && p.stage, bet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const stash = !!(p && p.bonus === 'free' && st !== 'trigger');
  if (p && st !== 'trigger' && p.bonus === 'jackpot') { if (st === 'intro') { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); sg.fillStyle = 'rgba(3,6,10,.74)'; sg.fillRect(0, 0, 1400, 960); } else drawJackpot(now); }
  else if (p && p.bonus === 'gamble') drawGamble(now);
  else if (p && p.bonus === 'halvingday') { if (st === 'play' || st === 'summary') drawHalvingDay(now); else darkRoom(sg, .7); }
  else if (p && p.bonus === 'epoch') { if (st === 'play' || st === 'summary') drawEpoch(now); else darkRoom(sg, .7); }
  else if (p && p.bonus === 'vault' && st !== 'trigger') drawCoinbase(f || p.snapF, now);
  else if (p && p.bonus === 'chain' && st !== 'trigger') drawHashrate(f || p.snapF, now);
  else if (stash) { drawCycleBackdrop(now); if (st === 'play') drawReels(now, true); else { sg.fillStyle = 'rgba(2,8,14,.4)'; sg.fillRect(RX, RY, RW, RH); } }
  else { sg.drawImage(baseLayer, 0, 0); drawReels(now, false); }
  const showHud = !(p && (p.bonus === 'jackpot' && (st === 'play' || st === 'summary'))) && !(p && (p.bonus === 'gamble' || p.bonus === 'halvingday' || p.bonus === 'epoch' || (p.bonus === 'chain' || p.bonus === 'vault') && st !== 'trigger'));
  if (showHud) drawHud(now, bet, stash);
  if (stash && st === 'play') { drawCycleSplit(now); if (p.retrig && now - p.retrig.t0 < 1800) { const k = ease((now - p.retrig.t0) / 400); sg.save(); sg.globalAlpha = 1 - clamp01((now - p.retrig.t0 - 1300) / 500); rubberStamp(sg, `+${p.retrig.add} SPINS`, 700, 200 + 60 * k, 48, BRASS2, -.06, .95); sg.restore(); } }
  if (p) {
    if (st === 'trigger') drawTriggerOverlay(now); else if (st === 'intro') drawIntroCard(now); else if (st === 'summary') drawSummary(now);
    if (st === 'intro' || st === 'play') { if (p.bonus !== 'jackpot' && !(p.bonus === 'gamble' && st === 'intro')) button(sg, 'skip', 'SKIP', 1180, 812, 170, 40, skipPres, { ...HB, ghost: true, size: 20 }); }
    if (st === 'play' && p.bonus === 'chain') { const done = E.featureDone(f || p.snapF), busyNow = hashBusy(now); button(sg, 'respin', done ? 'ALL FOUND' : busyNow ? 'HUNTING…' : 'RESPIN', 500, 818, 400, 58, featureAction, { pulse: !done && !busyNow, ghost: done || busyNow, col: ACCENT, col2: ACCENT2, col3: ACCENT3, size: 28 }); }
    if (st === 'play' && p.bonus === 'free' && state.free > 0 && !spinning) button(sg, 'spinnow', 'HUNT NOW', 560, 812, 280, 40, presAction, { ...HB, ghost: true, size: 20 });
    if (st === 'play' && p.bonus === 'vault') text(sg, `OPEN ${3 - (f || p.snapF).picks.length} MORE`, 700, 826, 26, BRASS2, COND, 'center', '800');
    else if (st === 'play' && (p.bonus === 'chain' || p.bonus === 'epoch' || p.bonus === 'halvingday')) {} else if (!(p.bonus === 'gamble' || p.bonus === 'jackpot' || p.bonus === 'epoch' || p.bonus === 'halvingday' || (p.bonus === 'free' && st === 'play' && state.free > 0 && !spinning))) fitText(sg, MSG(), 700, 820, 24, 1100, BRASS2, COND, 'center', '800');
    if (st === 'outro') drawWipe(now, p.t0, true); else if (st === 'intro' && now - p.t0 < 700 && !reduced()) drawWipe(now, p.t0, false);
  } else fitText(sg, MSG(), 700, 820, 26, 1300, BRASS2, COND, 'center', '800');
  if (lab.on) { sg.save(); hnBrass(sg, 0, 0, 1400, 24, 0, 1); round(sg, 330, 2, 740, 20, 3, INK); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL${lab.item ? ' · ' + lab.item.toUpperCase() : ''}${lab.runAll ? ` · RUN ALL ${lab.runAll.i + 1}/${lab.runAll.items.length}` : ''}`, 700, 13, 13, BRASS2, MONO, 'center', '700'); sg.restore(); }
  sg.drawImage(scanLayer, 0, 0);
  rev++; screenDirty = false; fsBlit();
}
function screenTap(x, y) {
  for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); return; } }
  if (pres && pres.stage === 'trigger') toStage('intro');
}
function particles(n = 35) { if (reduced()) return; for (let i = 0; i < n; i++) { const el = document.createElement('i'); el.className = 'coin inf'; el.textContent = ['✦', '◆', '●'][i % 3]; el.style.left = `${15 + Math.random() * 70}%`; el.style.top = '-25px'; el.style.animationDelay = `${Math.random() * .8}s`; el.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(el); setTimeout(() => el.remove(), 4000); } }
