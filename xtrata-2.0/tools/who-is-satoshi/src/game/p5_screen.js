
/* ---------- The cabinet screen: a case file open on a detective's desk, drawn in 1400x960 units ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
let rev = 0; const hits = [];
const reduced = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
const baseLayer = canvas(1400, 960), RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const clamp01 = x => Math.max(0, Math.min(1, x)), ease = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
// Venetian-blind light falling across the room.
function blinds(g, w, h, a = .05, angle = -.42) { g.save(); g.translate(w * .55, -h * .2); g.rotate(angle); for (let k = 0; k < 11; k++) { g.fillStyle = `rgba(255,236,190,${a})`; g.fillRect(-w, k * 64, w * 2.4, 30); } g.restore(); }
function desk(g) { g.fillStyle = lin(g, 0, 0, 0, 960, ['#17110b', '#0d0a07', '#1d140c']); g.fillRect(0, 0, 1400, 960); g.save(); g.globalAlpha = .07; for (let y = 0; y < 960; y += 9) { g.fillStyle = y % 18 ? '#6b4a2a' : '#3a2614'; g.fillRect(0, y, 1400, 4); } g.restore(); }
(function drawBase() { const g = baseLayer.getContext('2d'); desk(g); blinds(g, 1400, 960, .045);
  // the open folder behind the reels
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 30; round(g, RX - 26, RY - 30, RW + 52, RH + 56, 10, lin(g, 0, RY - 30, 0, RY + RH, ['#cdb177', '#b8995e'])); g.restore();
  round(g, RX - 26, RY - 54, 260, 30, [10, 10, 0, 0], '#c4a66b'); text(g, 'CASE No. 2008-10-31', RX + 104, RY - 38, 15, '#3d2d12', TYPE, 'center', '700');
  round(g, RX - 12, RY - 12, RW + 24, RH + 24, 6, '#1a140d', '#5a4422', 2);
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#2a2016', '#1d160f', '#2a2016']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  // a paper clip on the folder edge
  g.save(); g.strokeStyle = '#c9ccd2'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(1290, RY - 40); g.lineTo(1290, RY + 40); g.arc(1302, RY + 40, 12, Math.PI, 0, true); g.lineTo(1314, RY - 30); g.arc(1306, RY - 30, 8, 0, Math.PI, true); g.lineTo(1298, RY + 30); g.stroke(); g.restore();
  g.fillStyle = '#ffffff10'; g.fillRect(45, 880, 1310, 1); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
function glowText(g, s, x, y, size, color, glow = color, weight = '700', align = 'center', font = SERIF) { g.save(); g.shadowColor = glow; g.shadowBlur = size * .35; text(g, s, x, y, size, color, font, align, weight); g.restore(); }
function button(g, id, label, x, y, w, h, fn, opts = {}) { const t = performance.now(), pulse = opts.pulse ? .5 + .5 * Math.sin(t / 240) : 0, col = opts.col || BRASS;
  g.save(); g.shadowColor = col; g.shadowBlur = 10 + pulse * 18; round(g, x, y, w, h, 10, opts.ghost ? '#1a140dee' : lin(g, x, y, x, y + h, [opts.col2 || BRASS2, col, BRASS3]), col, 3); g.restore();
  text(g, label, x + w / 2, y + h / 2 + 1, opts.size || 26, opts.ghost ? (opts.col2 || BRASS2) : INK, TYPE, 'center', '700'); hits.push({ id, x, y, w, h, fn }); }
const capsuleRect = i => { const gap = 22, w = (RW - 2 * gap) / 3, h = (RH - 2 * gap) / 3; return [RX + (i % 3) * (w + gap), RY + Math.floor(i / 3) * (h + gap), w, h]; };
const cellX = c => RX + c * CW + (CW - 176) / 2;
function highlightIndex(now) { return !spinning && !feature() && !pres && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
function drawReels(now, forum) {
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (forum) { sg.fillStyle = c % 2 ? '#e9e4d6' : '#f1ede2'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; sg.drawImage(tileFor(s, f), cellX(c), RY + RH - (i + 1) * RHT + offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), cellX(c), RY + r * RHT + 7, 176, 176);
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = BRASS; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 10, null, BRASS2, 5); sg.restore(); }
  }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 10, null, w.symbol === 'cherry' ? RED2 : BRASS2, 4);
    // the red string of the cork board, pinned across the winning line
    sg.save(); sg.shadowColor = RED2; sg.shadowBlur = 12; sg.lineWidth = 4; sg.strokeStyle = '#d8392ed0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.shadowBlur = 0;
    line.forEach((r, c) => { if (c < w.count) { sg.fillStyle = '#e8463a'; sg.beginPath(); sg.arc(RX + (c + .5) * CW, RY + (r + .5) * RHT, 8, 0, 7); sg.fill(); sg.fillStyle = '#ffd0c8'; sg.beginPath(); sg.arc(RX + (c + .5) * CW - 2, RY + (r + .5) * RHT - 2, 3, 0, 7); sg.fill(); } }); sg.restore(); }
  else if (state.showLines && !spinning) { sg.strokeStyle = '#e0b04a55'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* ---------- HUD: the case header, the Satoshi's Key jackpot meter and Satoshi's Gift ---------- */
function giftOddsText() { if (!Number.isFinite(sources.twins)) return sources.registry === 'pending' ? 'COUNTING TWINS…' : 'TWINS UNKNOWN'; if (!sources.twins) return 'NO TWINS COUNTED'; return `1 TWIN WINS IT ALL · 1 IN ${fmt(sources.twins)}`; }
function drawHud(now, bet, forum) {
  if (forum) {
    text(sg, 'THE FORUM', 150, 74, 32, '#2b3d55', SERIF, 'center', '700'); text(sg, `${state.free} SPINS LEFT`, 150, 112, 16, '#2b3d55', TYPE); text(sg, 'ALL WINS 2×', 150, 136, 16, RED, TYPE);
    text(sg, "KEY JACKPOT", 1250, 70, 14, '#2b3d55', TYPE); text(sg, fmt(E.meter(state, bet)), 1250, 104, 30, INK, TYPE); text(sg, `GIFT POT ${fmt(state.pot)}`, 1250, 140, 13, '#5a6f88', TYPE);
    text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#2b3d55', TYPE, 'left'); text(sg, `CLUES  ${fmt(bet)}`, 700, 920, 26, '#2b3d55', TYPE); text(sg, `FORUM WIN  ${fmt(state.freeTotal)}`, 1332, 920, 26, RED, TYPE, 'right');
    return;
  }
  text(sg, 'WHO IS', 150, 62, 22, SMOKE, SERIF, 'center', 'italic 700'); glowText(sg, 'SATOSHI?', 150, 102, 38, BRASS2, BRASS); text(sg, '20 LINES · CASE OPEN', 150, 142, 14, SMOKE, TYPE);
  // the brass plaque
  round(sg, 470, 24, 460, 152, 10, lin(sg, 0, 24, 0, 176, ['#2a2015', '#17110a']), BRASS, 3); round(sg, 478, 32, 444, 136, 6, null, '#e0b04a55', 1.5);
  spaced(sg, "SATOSHI'S KEY JACKPOT", 700, 52, 17, 3, BRASS2, '700', TYPE); glowText(sg, fmt(E.meter(state, bet)), 700, 106, 58, '#fff6dc', BRASS, '700', 'center', TYPE); text(sg, `LAYR · ${fmt(bet)} BET LEVEL`, 700, 150, 15, SMOKE, TYPE);
  text(sg, "SATOSHI'S GIFT", 1250, 46, 15, BRASS2, TYPE); glowText(sg, fmt(state.pot), 1250, 84, 32, '#fff', BRASS, '700', 'center', TYPE); text(sg, giftOddsText(), 1250, 116, 12, '#d8c49b', TYPE);
  text(sg, state.lastPot ? `LAST WEEK'S GIFT: ${fmt(state.lastPot.pot)} LAYR` : `WEEK ${state.potKey || weekKey()} · ONE WINNER`, 1250, 140, 11, SMOKE, TYPE);
  text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, PAPER, TYPE, 'left'); text(sg, `CLUES  ${fmt(bet)}`, 700, 920, 26, PAPER, TYPE); text(sg, `WIN  ${fmt(state.lastWin)}`, 1332, 920, 26, BRASS2, TYPE, 'right');
}
/* ---------- The Forum (free spins): the screen becomes an old forum thread; each spin adds a real dated post ---------- */
function drawForumBackdrop(now) {
  const g = sg; g.fillStyle = lin(g, 0, 0, 0, 960, ['#d6dde6', '#c4ccd6']); g.fillRect(0, 0, 1400, 960);
  g.fillStyle = lin(g, 0, 0, 0, 40, ['#4a6585', '#2b3d55']); g.fillRect(0, 0, 1400, 40); text(g, 'Forum  ›  Economics  ›  Re: Who is Satoshi?', 30, 21, 16, '#e7eef7', TYPE, 'left', '700'); text(g, 'Page 1 of 1', 1370, 21, 14, '#c9d6e6', TYPE, 'right', '400');
  // the thread: the latest posts slide in, newest at the top
  const th = (pres && pres.thread) || []; const show = th.slice(-2).reverse();
  show.forEach((p, k) => { const age = now - p.t, slide = reduced() ? 1 : ease(age / 600), y = 50 + k * 72 - (1 - slide) * 40; g.save(); g.globalAlpha = k ? .6 : slide;
    round(g, 300, y, 800, 64, 4, '#f6f3ea', '#8ea2bb', 1.5); round(g, 300, y, 150, 64, [4, 0, 0, 4], '#e1e7ef'); text(g, 'satoshi', 375, y + 22, 15, '#2b3d55', TYPE, 'center', '700'); text(g, p.post.date, 375, y + 44, 12, '#5a6f88', TYPE, 'center', '400');
    const ls = wrapLines(g, p.post.text, 620, 15, SERIF, 'italic 400'); ls.slice(0, 2).forEach((l, i) => text(g, l, 470, y + (ls.length > 1 ? 22 + i * 20 : 32), 15, '#1f2a36', SERIF, 'left', 'italic 400')); text(g, p.post.where, 1088, y + 54, 10, '#7c8ea5', TYPE, 'right', '400'); g.restore(); });
  if (!show.length) text(g, 'Posts appear here as you spin.', 700, 120, 18, '#5a6f88', SERIF, 'center', 'italic 400');
  text(g, `POSTS IN THE THREAD: ${th.length}`, 1250, 176, 13, '#2b3d55', TYPE, 'center', '700');
  round(g, RX - 10, RY - 10, RW + 20, RH + 20, 6, '#f6f3ea', '#6d84a1', 2);
}
