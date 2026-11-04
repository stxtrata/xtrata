/* ---------- The cabinet screen: matte black, faint strata, a thin layered-glass sheen; drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
function strata(g, y0, y1, a = 1) { const cols = [BLUE, OR, WHITE]; for (let y = y0, k = 0; y < y1; y += 14, k++) { g.fillStyle = cols[k % 3] + (a > .5 ? '22' : '12'); g.fillRect(0, y, 1400, k % 3 === 2 ? 1 : 2); } }
(function drawBase() { const g = baseLayer.getContext('2d'); g.fillStyle = lin(g, 0, 0, 1400, 960, ['#0b0e14', '#05070b', '#0c0f16']); g.fillRect(0, 0, 1400, 960);
  strata(g, 8, 190, 1); strata(g, 790, 960, 0);
  // inscription numbers etched along the edges, the real ones the layers carry
  g.save(); g.font = '600 11px Courier New'; g.fillStyle = '#4675b62a'; const ids = (ART.layers || []).map(l => '#' + l.id); for (let y = 210, k = 0; y < 780; y += 26, k++) { g.textAlign = 'left'; g.fillText(ids[k % (ids.length || 1)] || '', 6, y); g.textAlign = 'right'; g.fillText(ids[(k + 7) % (ids.length || 1)] || '', 1394, y); } g.restore();
  round(g, RX - 9, RY - 9, RW + 18, RH + 18, 16, '#030406', BLUE, 3); g.strokeStyle = OR + '90'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(RX - 15, RY - 15, RW + 30, RH + 30, 19); g.stroke();
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#07090e', '#0e131c', '#07090e']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  g.fillStyle = '#ffffff12'; g.fillRect(45, 880, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000b'); shadeGrad.addColorStop(.15, '#0000'); shadeGrad.addColorStop(.82, '#0000'); shadeGrad.addColorStop(1, '#000b');
function neon(g, s, x, y, size, color, glow = color, weight = '900', align = 'center') { g.save(); g.shadowColor = glow; g.shadowBlur = size * .45; text(g, s, x, y, size, color, 'Arial', align, weight); g.restore(); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse && !reduced() ? .5 + .5 * Math.sin(t / 220) : 0, col = opts.col || BLUE;
  g.save(); g.shadowColor = col; g.shadowBlur = 14 + pulse * 22; round(g, x, y, w, h, 12, opts.ghost ? '#0b0f16' : lin(g, x, y, x, y + h, [opts.col2 || BLUE2, col]), col, 3); g.restore();
  fitText(g, label, x + w / 2, y + h / 2 + 1, opts.size || 28, w - 20, opts.ghost ? (opts.col2 || BLUE3) : (opts.ink || '#04070d'), 'Arial', 'center', '900'); hits.push({ id, x, y, w, h, fn }); }
const cellX = c => RX + c * CW + (CW - 176) / 2;
function highlightIndex(now) { return !spinning && !feature() && !pres && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
function drawReels(now, session) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = OR; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 12, null, OR2, 5); sg.restore(); }
  }
  if (session) { const s = sessionStep(); sg.save(); sg.globalCompositeOperation = 'lighter'; sg.fillStyle = `rgba(63,224,207,${spinning ? .05 : .09})`; sg.fillRect(RX + (s % 5) * CW, RY, CW - 3, RH); sg.restore(); }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 12, null, OR2, 4); sg.save(); sg.shadowColor = OR; sg.shadowBlur = 14; sg.lineWidth = 4; sg.strokeStyle = '#f2aa5ac0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#6593cf55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* ---------- HUD ---------- */
function perHolderText() { const sh = potShare(); return sh !== null ? `≈ ${fmt(sh)} LAYR PER AUDIONAUT` : sources.mintRead === 'unknown' ? 'AUDIONAUTS: UNKNOWN' : 'COUNTING AUDIONAUTS…'; }
function drawHud(now, bet) {
  text(sg, '20 LINES', 125, 78, 30, WHITE); spaced(sg, 'XTRATA ORIGINALS', 125, 118, 13, 3, BLUE3, '700'); text(sg, 'BORN ON CHAIN', 125, 142, 12, OR2);
  spaced(sg, 'THE X · JACKPOT', 700, 38, 20, 5, OR2, '800'); text(sg, fmt(E.meter(state, bet)), 700, 104, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(bet)} BET LEVEL`, 700, 158, 16, MUTE);
  text(sg, 'AUDIONAUTS HOLDER POT', 1268, 48, 14, BLUE3); neon(sg, fmt(state.pot), 1268, 84, 34, '#fff', BLUE, '700'); text(sg, perHolderText(), 1268, 116, 13, OR2);
  text(sg, state.lastPot ? `LAST WEEK: ${state.lastPot.holders ? fmt(state.lastPot.pot / state.lastPot.holders) : '—'} PER AUDIONAUT` : `WEEK ${state.potKey || weekKey()}`, 1268, 140, 12, MUTE);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, WHITE, 'Arial', 'left'); text(sg, `BET  ${fmt(bet)}`, 700, 920, 26, WHITE); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, OR2, 'Arial', 'right');
}
/* ---------- Session Mode: the screen becomes a step sequencer; each free spin plays one step of the beat ---------- */
const TEAL = '#3fe0cf';
function sessionStep() { return pres && pres.bonus === 'free' ? (pres.step || 0) : 0; }
function drawSessionBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#0d1719', '#0a1113', '#070b0c']); g.fillRect(0, 0, 1400, 960);
  g.fillStyle = 'rgba(63,224,207,.035)'; for (let x = 0; x < 1400; x += 24) g.fillRect(x, 0, 1, 960); for (let y = 0; y < 960; y += 24) g.fillRect(0, y, 1400, 1);
  round(g, RX - 9, RY - 9, RW + 18, RH + 18, 16, '#050909', OR, 3);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#071010', '#0c1918', '#071010']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
}
function drawSequencer(now) {
  const g = sg, x0 = 318, y0 = 22, cw = 50, rh = 31, step = sessionStep(), cur = (step + 15) % 16, flash = pres && pres.stepAt ? clamp01(1 - (now - pres.stepAt) / 380) : 0;
  if (LOGOS.lockup) { const k = 170 / LOGOS.lockup.naturalWidth; g.drawImage(LOGOS.lockup, 40, 18, 170, LOGOS.lockup.naturalHeight * k); }
  text(g, 'SESSION MODE', 125, 104, 26, OR2, 'Arial', 'center', '900'); text(g, `${state.free} STEP${state.free === 1 ? '' : 'S'} LEFT · ALL WINS 2×`, 125, 136, 14, TEAL); text(g, `TOTAL ${fmt(state.freeTotal)}`, 125, 166, 18, WHITE);
  LANES.forEach((lane, li) => { const y = y0 + li * rh; text(g, lane.toUpperCase(), x0 - 12, y + rh / 2, 12, MUTE, 'Arial', 'right', '700');
    for (let s = 0; s < 16; s++) { const x = x0 + s * cw, on = BEAT[lane][s], played = s < (step > 16 ? 16 : step) || step > 16, isCur = s === cur && step > 0;
      const fill = on ? (isCur ? `rgba(255,178,60,${.65 + .35 * flash})` : played ? 'rgba(63,224,207,.55)' : 'rgba(63,224,207,.16)') : (isCur ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.035)');
      round(g, x + 3, y + 3, cw - 6, rh - 6, 5, fill, s % 4 === 0 ? '#3fe0cf40' : null, 1); } });
  const px = x0 + (cur + .5) * cw; if (step > 0) { g.save(); g.shadowColor = OR2; g.shadowBlur = 12; g.fillStyle = OR2; g.fillRect(px - 2, y0 - 6, 4, LANES.length * rh + 12); g.restore(); }
  for (let s = 0; s < 16; s += 4) text(g, String(s + 1), x0 + (s + .5) * cw, y0 + LANES.length * rh + 12, 11, '#5f7a7a');
  text(g, 'AUDIONAUT ANALOG KIT · CC0', x0 + 8 * cw, y0 + LANES.length * rh + 12, 11, '#5f7a7a', 'Arial', 'center', '700');
}
