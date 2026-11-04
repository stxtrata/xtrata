/* ---------- Bonus scenes: trigger, intro, play, summary (drawn on the screen canvas, so they show in every view) ----------
   The engine has already dealt every result before a scene starts; scenes only reveal it. Skip jumps to the summary with the same total. */
const RM = () => !!state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const ease = u => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);
const countTo = (to, t0, now, dur = 1500) => RM() ? to : Math.round(to * ease((now - t0) / dur));
let TEST_SLOW = 1;   // test build only: stretches every scene timer so slow software renderers can be screenshotted
const dly = ms => TEST_SLOW > 1 ? ms * TEST_SLOW : RM() ? Math.round(ms * .45) : ms;
let SC = null;           // the scene on screen: { kind, stage, t0, dur, data, btns, onDone }
const pickAnim = {}, lockAnim = {};
function sting(kind) {
  if (kind === 'trigger') { [523, 659, 784, 1047, 1319].forEach((f, k) => tone(f, .16, 'square', .07, k * .09)); tone(262, .6, 'triangle', .1, 0); }
  else if (kind === 'intro') { [392, 523, 659].forEach((f, k) => tone(f, .14, 'triangle', .08, k * .1)); }
  else if (kind === 'stamp') { tone(110, .16, 'square', .12, 0, .5); tone(1760, .05, 'square', .05, .02); }
  else if (kind === 'reveal') { [659, 880, 1175].forEach((f, k) => tone(f, .1, 'triangle', .08, k * .06)); }
  else if (kind === 'jackpot') { [523, 659, 784, 1047, 784, 1047, 1319, 1568, 2093].forEach((f, k) => tone(f, .24, 'square', .07, k * .16)); [262, 330, 392, 523].forEach((f, k) => tone(f, .9, 'triangle', .09, k * .5)); }
  else if (kind === 'flip') { tone(880, .05, 'square', .05, 0, 1.6); tone(1320, .08, 'triangle', .06, .05); }
  else if (kind === 'sum') { [523, 659, 784, 1047].forEach((f, k) => tone(f, .18, 'triangle', .08, k * .08)); }
}
function trigCells(syms) { const out = []; for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (syms.includes(state.grid[c][r])) out.push([c, r]); return out; }
function sceneSet(kind, stage, data = {}, dur = 0, onDone = null) {
  SC = { kind, stage, t0: performance.now(), dur: dur ? dly(dur) : 0, data, btns: [], onDone, sk: false }; screenDirty = true; sceneBar(); sting(stage === 'trigger' ? 'trigger' : stage === 'outro' ? 'sum' : 'intro');
}
function sceneEnd() { SC = null; sceneBar(); screenDirty = true; update(); }
function sceneNext() { const f = SC && SC.onDone; if (f) { SC.onDone = null; f(); } }
function sceneBar() {
  if (!SC) { if (!feature()) hideBar(); return; }
  const lbl = { free: 'MAINNET LAUNCH', vault: 'STACKING BOOMBOX', chain: 'PROOF OF TRANSFER', jackpot: 'JACKPOT: NUMBER ONE', gamble: 'ODD BLOCK / EVEN BLOCK' }[SC.kind];
  SC.dom = SC.stage !== 'trigger' && SC.stage !== 'play' || SC.kind === 'gamble' && SC.stage === 'intro';
  if (!SC.dom) { if (!feature()) hideBar(); return; }
  setBar(SC.stage.toUpperCase(), lbl, SC.data.rule || '', '<span id="scBtns"></span>');
  SC.domSpec = true;
}
function sbtn(x, y, w, h, label, fn, primary = true) {
  SC.btns.push({ x, y, w, h, label, fn, primary });
  sg.save(); sg.shadowColor = primary ? '#f0b429' : '#8d83ff'; sg.shadowBlur = primary ? 22 : 8; round(sg, x, y, w, h, 18, primary ? lin(sg, x, y, x, y + h, ['#ffd978', '#f0b429']) : '#2a1f7a', primary ? '#fff4d8' : '#8d83ff', 3); sg.restore();
  text(sg, label, x + w / 2, y + h / 2 + 1, Math.min(34, h * .42), primary ? '#2a1a00' : '#f3ead6', 'Arial', 'center', '900');
}
function sceneTap(x, y) { if (!SC) return false; for (const b of SC.btns) if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.fn(); return true; } return !!SC && SC.stage !== 'play'; }
function sceneSkip() {
  if (!SC || SC.skipping) return false;
  if (SC.stage === 'trigger') { sceneNext(); return true; }
  if (SC.kind === 'free' && SC.stage === 'play') { skipFree(); return true; }
  if ((SC.kind === 'vault' || SC.kind === 'chain') && SC.stage === 'play') { skipFeature(); return true; }
  if (SC.kind === 'jackpot' && SC.stage !== 'outro') { SC.data.toOutro && (SC.onDone = null, SC.data.toOutro()); return true; }
  return false;
}
/* primary action waiting right now (fullscreen bar and feature bar use it) */
function pendingAction() {
  if (SC) { const b = SC.btns.find(k => k.primary); return b ? { label: b.label, fn: b.fn } : null; }
  const f = feature(); if (f && !spinning) { if (f.type === 'chain') return { label: E.featureDone(f) ? 'COLLECT' : 'RESPIN', fn: featureAction }; if (E.featureDone(f)) return { label: 'COLLECT', fn: featureAction }; const i = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(k => !f.picks.includes(k)); return { label: 'OPEN BOOMBOX', fn: () => pickBind(i) }; }
  return null;
}

/* ---- shared drawing ---- */
function sceneBackdrop(now, kind) {
  const t = now / 1000, g = sg; g.save();
  g.fillStyle = lin(g, 0, 0, 0, 960, kind === 'jackpot' ? ['#2a1a00', '#4b1f9e', '#12093a'] : kind === 'free' ? ['#02010c', '#150f55', '#2a1f8f'] : kind === 'chain' ? ['#050a22', '#0e1a5a', '#1d1566'] : kind === 'gamble' ? ['#0a0722', '#1d1566', '#0a0722'] : ['#0d0a33', '#2a1f7a', '#0d0a33']); g.fillRect(0, 0, 1400, 960);
  if (kind === 'free' || kind === 'jackpot') for (const s of STARS) { g.globalAlpha = RM() ? .6 : .3 + .7 * Math.abs(Math.sin(t * 1.4 + s.p)); g.fillStyle = '#fff4d8'; g.beginPath(); g.arc(s.x, (s.y * 4.3 + (RM() ? 0 : t * 22 * s.r)) % 960, s.r, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  if (kind === 'jackpot') { g.translate(700, 430); for (let k = 0; k < 18; k++) { g.rotate(Math.PI / 9); g.fillStyle = k % 2 ? '#f6c45322' : '#fff4d814'; g.beginPath(); g.moveTo(0, 0); g.lineTo(900, -70 - (RM() ? 0 : 20 * Math.sin(t + k))); g.lineTo(900, 70); g.fill(); } }
  if (kind === 'free') { g.fillStyle = lin(g, 0, 640, 0, 960, ['#8d83ff00', '#8d83ff55']); g.fillRect(0, 640, 1400, 320); g.strokeStyle = '#b9adff55'; g.lineWidth = 2; for (let k = 0; k < 12; k++) { const y = 700 + Math.pow(((k + (RM() ? 0 : t * .8)) % 12) / 12, 2) * 260; g.beginPath(); g.moveTo(0, y); g.lineTo(1400, y); g.stroke(); } for (let k = -8; k <= 8; k++) { g.beginPath(); g.moveTo(700 + k * 30, 640); g.lineTo(700 + k * 190, 960); g.stroke(); } }
  if (kind === 'chain') { g.strokeStyle = '#f6c45344'; g.lineWidth = 3; for (let k = 0; k < 9; k++) { const x = ((k * 190 + (RM() ? 0 : t * 40)) % 1520) - 60; g.beginPath(); g.roundRect(x, 120 + (k % 3) * 300, 130, 60, 30); g.stroke(); g.beginPath(); g.roundRect(x + 100, 150 + (k % 3) * 300, 130, 60, 30); g.stroke(); } }
  g.restore();
}
function sceneFooter() { text(sg, `LAYR  ${fmt(state.balance)}`, 68, 920, 26, '#fff4d8', 'Arial', 'left'); text(sg, `BET  ${fmt(state.free || state.freeActive ? state.freeBet : state.bet)}`, 700, 920, 26, '#fff4d8'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, '#f6c453', 'Arial', 'right'); }
function banner(title, sub, u) {
  const k = RM() ? 1 : ease(u * 3), w = 1020, h = 190, x = 700 - w / 2 + (1 - k) * -1500, y = RY + RH / 2 - h / 2;
  sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = 40; round(sg, x, y, w, h, 26, lin(sg, x, y, x, y + h, ['#4636e0ee', '#1d1566ee']), '#f6c453', 6); sg.restore();
  text(sg, title, x + w / 2, y + 82, title.length > 14 ? 70 : 84, '#fff4d8', 'Arial', 'center', '900'); text(sg, sub, x + w / 2, y + 150, 26, '#f6c453', 'Arial', 'center', '800');
}
function drawTrigger(now) {
  const u = (now - SC.t0) / SC.dur, d = SC.data, pulse = RM() ? 1 : 1 + .08 * Math.sin(now / 90);
  sg.save(); sg.fillStyle = '#05031acc'; sg.fillRect(RX, RY, RW, RH); sg.restore();
  for (const [c, r] of d.cells) { const lift = RM() ? 1.12 : 1 + .2 * ease(u * 2), s = 176 * lift * pulse, x = cellX(c) + 88 - s / 2, y = RY + r * RHT + 7 + 88 - s / 2;
    sg.save(); sg.shadowColor = '#f6c453'; sg.shadowBlur = 40; sg.globalAlpha = 1; sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), x, y, s, s); sg.restore(); round(sg, x - 4, y - 4, s + 8, s + 8, 16, null, '#f6c453', 5); }
  if (!RM() && u < .5) { sg.save(); sg.globalAlpha = .5 * (1 - u * 2); sg.fillStyle = '#fff4d8'; sg.fillRect(0, 0, 1400, 960); sg.restore(); }
  banner(d.title, d.sub, u);
}
function drawIntro(now, kind, title, rule, startLabel, art) {
  sceneBackdrop(now, kind); const u = (now - SC.t0) / 900, k = ease(u);
  text(sg, title, 700, 120 + (1 - k) * -40, 76, '#fff4d8', 'Arial', 'center', '900'); sg.save(); sg.globalAlpha = k; sg.fillStyle = '#f6c453'; sg.fillRect(500, 160, 400, 4); sg.restore();
  sg.save(); sg.globalAlpha = k; art(now, k); sg.restore();
  text(sg, rule, 700, 700, 28, '#f3ead6', 'Arial', 'center', '700');
  sbtn(500, 740, 400, 84, startLabel, () => SC.data.start(), true);
  sbtn(1180, 740, 170, 84, 'SKIP', () => SC.data.start(), false);
  sceneFooter();
}
let crownIdx = -1; const crownFace = () => { if (crownIdx < 0 || !pools.bitcoin[crownIdx] || !pools.bitcoin[crownIdx].power) crownIdx = pickFace('bitcoin', true); return crownIdx; };
function drawSummary(now, kind, title, total, lines, art) {
  sceneBackdrop(now, kind === 'jackpot' ? 'jackpot' : kind); const t0 = SC.t0;
  text(sg, title, 700, 110, 70, '#fff4d8', 'Arial', 'center', '900');
  art && art(now);
  const n = countTo(total, t0 + 300, now); sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = 36; text(sg, fmt(n), 700, 560, 130, '#f6c453', 'Arial', 'center', '900'); sg.restore(); text(sg, SC.data.credited === false ? 'COLLECT TO ADD IT TO YOUR BALANCE' : (kind === 'jackpot' ? 'LAYR JACKPOT PAID' : 'LAYR ADDED TO YOUR BALANCE'), 700, 630, 24, '#cfc8ff', 'Arial', 'center', '700');
  lines.forEach((l, i) => text(sg, l, 700, 690 + i * 34, 24, '#f3ead6', 'Arial', 'center', '700'));
  sbtn(500, 770, 400, 84, SC.data.btn || 'COLLECT ›', () => SC.data.done(), true); sceneFooter();
}
function blockArt(now, size, y) { const b = BLOCKS[0] || { h: 1, hx: '0x6b2c809627f2fd19', bh: 666053, t: '2021-01-14T17:28:24Z' }; const tile = dataTile('scatter', b); const s = size * (RM() ? 1 : 1 + .03 * Math.sin(now / 400)); sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = 40; sg.drawImage(tile, 700 - s / 2, y - s / 2, s, s); sg.restore(); }

/* ---- the scene painter (called at the end of drawScreen) ---- */
function drawScene(now) {
  if (!SC) return; SC.btns = []; const d = SC.data;
  if (SC.dur && now - SC.t0 > SC.dur) { sceneNext(); if (!SC) return; }
  if (SC.stage === 'trigger') { drawTrigger(now); return; }
  if (SC.kind === 'free' && SC.stage === 'intro') drawIntro(now, 'free', 'MAINNET LAUNCH', `${d.spins} launch spins. Every win pays 2×. More Genesis blocks add 4.`, 'LAUNCH ▲', (n, k) => { blockArt(n, 300, 430); text(sg, `GENESIS BLOCK · STACKS #1 · ${BLOCKS[0] ? dateOf(BLOCKS[0].t) : '14 JAN 2021'}`, 700, 625, 22, '#b9adff', 'Arial', 'center', '700'); });
  else if (SC.kind === 'vault' && SC.stage === 'intro') drawIntro(now, 'vault', 'STACKING BOOMBOX', 'Open three. Each holds a prize.', 'OPEN ▲', (n, k) => { for (let i = 0; i < 9; i++) { const cx = 330 + (i % 3) * 370 - (1 - k) * 600 * (i % 2 ? -1 : 1), cy = 260 + Math.floor(i / 3) * 140, bob = RM() ? 0 : Math.sin(n / 300 + i) * 6; round(sg, cx - 150, cy - 55 + bob, 300, 110, 16, '#1d1566', '#8d83ff', 3); sg.drawImage(tileFor('vault', capsuleFaces[i] ? capsuleFaces[i].f : pickFace('vault')), cx - 140, cy - 48 + bob, 96, 96); text(sg, `BOOMBOX ${i + 1}`, cx + 40, cy - 6 + bob, 24, '#f3ead6'); text(sg, 'SEALED', cx + 40, cy + 26 + bob, 15, '#a79ee8'); } });
  else if (SC.kind === 'chain' && SC.stage === 'intro') drawIntro(now, 'chain', 'PROOF OF TRANSFER', 'Anchored blocks lock. Respin to anchor more. Fill all 15 for Number One.', 'RESPIN ▲', (n, k) => { for (let i = 0; i < 5; i++) { const b = BLOCKS[(i * 9 + 3) % Math.max(1, BLOCKS.length)] || { h: i + 1, bh: 666053 + i }, x = 140 + i * 250, y = 320 + (RM() ? 0 : Math.sin(n / 500 + i) * 8); if (i) { sg.strokeStyle = '#f6c453'; sg.lineWidth = 6; sg.beginPath(); sg.moveTo(x - 80, y + 90); sg.lineTo(x, y + 90); sg.stroke(); } round(sg, x, y, 210, 190, 16, '#2a1f7a', '#f6c453', 4); text(sg, `BTC ${b.bh.toLocaleString('en-GB')}`, x + 105, y + 52, 22, '#f3ead6', 'Courier New'); text(sg, `STX #${b.h}`, x + 105, y + 88, 19, '#b9adff', 'Courier New'); text(sg, [1, 2, 3, 5, 10][i] + '×', x + 105, y + 148, 52, '#fff'); } });
  else if (SC.kind === 'free' && SC.stage === 'outro') drawSummary(now, 'free', 'LAUNCHED', d.total, [`${d.count} LAUNCH SPINS PLAYED`, `${(d.total / Math.max(1, d.bet)).toFixed(1)}× YOUR BET`], (n) => blockArt(n, 190, 300));
  else if (SC.kind === 'vault' && SC.stage === 'outro') drawSummary(now, 'vault', 'BOOMBOXES OPENED', d.total, [`${d.picks.length} OF 9 OPENED · ${d.picks.map(m => m + '×').join('  ·  ')}`], (n) => { d.picks.forEach((m, i) => { const u = ease(((now - SC.t0) - i * 350) / 500), x = 330 + i * 370; if (u <= 0) return; round(sg, x - 150, 210, 300, 190 * u, 18, '#2a1f7a', '#f6c453', 5); if (u > .6) { sg.drawImage(tileFor('vault', capsuleFaces[i] ? capsuleFaces[i].f : pickFace('vault')), x - 60, 220, 120, 120); text(sg, m + '×', x, 375, 44, '#fff'); } }); });
  else if (SC.kind === 'chain' && SC.stage === 'outro') drawSummary(now, 'chain', d.full ? 'ALL 15 ANCHORED' : 'TRANSFER PROVEN', d.total, [`${d.cells.filter(Boolean).length} OF 15 BLOCKS ANCHORED`, d.full ? 'JACKPOT: NUMBER ONE INCLUDED' : ''], (n) => { d.cells.forEach((v, i) => { const x = 330 + (i % 5) * 150, y = 190 + Math.floor(i / 5) * 62, u = ease(((now - SC.t0) - i * 90) / 300); if (!v) { round(sg, x, y, 138, 54, 10, '#0a0722', '#3a2f8f', 2); return; } const s = RM() ? 1 : 1 + (1 - u) * .8; sg.save(); sg.translate(x + 69, y + 27); sg.scale(s, s); sg.globalAlpha = u; round(sg, -69, -27, 138, 54, 10, '#2a1f7a', '#f6c453', 3); text(sg, v + '×', 0, 2, 28, '#fff'); sg.restore(); }); });
  else if (SC.kind === 'jackpot') drawJackpot(now);
  else if (SC.kind === 'gamble') drawGamble(now);
}
/* ---- flows ---- */
function flowFree(retrigger) {
  const spins = state.free, cells = trigCells(['scatter']), n = cells.length;
  const play = () => { sceneEnd(); hideBar(); startLaunch(retrigger); };
  if (retrigger) { sceneSet('free', 'trigger', { cells, title: '+4 LAUNCH SPINS', sub: `${n} GENESIS BLOCKS · ${spins} LEFT` }, 1700, play); return; }
  sceneSet('free', 'trigger', { cells, title: 'MAINNET LAUNCH', sub: `${n} GENESIS BLOCKS · ${spins} FREE SPINS · ALL WINS 2×` }, 2600, () => sceneSet('free', 'intro', { spins, rule: `${spins} launch spins, all wins 2×`, start: play }));
}
function flowFeature() {
  const f = feature(); if (!f) return; const kind = f.type, cells = trigCells([kind]);
  const title = kind === 'chain' ? 'PROOF OF TRANSFER' : 'STACKING BOOMBOX', sub = kind === 'chain' ? `${cells.length} BITCOIN ANCHORS · HOLD AND RESPIN` : `${cells.length} BOOMBOXES · OPEN THREE`;
  const begin = () => { sceneEnd(); renderBar(); update(); };
  sceneSet(kind, 'trigger', { cells, title, sub }, 2600, () => sceneSet(kind, 'intro', { rule: kind === 'chain' ? 'Respin to anchor more blocks' : 'Open three Boomboxes', start: begin }));
}
function outroFeature(f) {
  const c = f.type, total = c === 'vault' ? f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet : f.sum * f.bet + (f.full ? 0 : 0);
  const fr = f.frames ? f.frames[f.index] : null;
  sceneSet(c, 'outro', { total, picks: f.picks ? f.picks.map(i => f.awards[i]) : [], cells: fr ? fr.cells.slice() : [], full: !!f.full, credited: false, rule: `${fmt(total)} LAYR`, done: () => { sceneEnd(); collectFeature(); } });
  hideBar(); sceneBar();
}
function skipFeature() { let f = feature(), guard = 0; while (f && !E.featureDone(f) && guard++ < 60) { if (f.type === 'vault') { const i = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(k => !f.picks.includes(k)); E.pick(state, i); } else E.respin(state); f = feature(); } save(); update(); if (f) outroFeature(f); }
function skipFree() {
  const before = state.freeTotal; let guard = 0;
  while ((state.free > 0 || feature()) && guard++ < 400) { const f = feature(); if (f) { let g2 = 0; while (!E.featureDone(feature()) && g2++ < 60) { const ff = feature(); if (ff.type === 'vault') E.pick(state, [0, 1, 2, 3, 4, 5, 6, 7, 8].find(k => !ff.picks.includes(k))); else E.respin(state); } E.collect(state); continue; } try { E.start(state); E.settle(state); } catch (e) { break; } }
  save(); lastResult = null; sceneEnd(); showFreeSummary();
}
function flowJackpot(amount, next) {
  const cells = trigCells(['bitcoin']).filter(([c, r]) => r === 1), meter = amount;
  const finish = () => { sceneEnd(); next && next(); };
  const outro = () => sceneSet('jackpot', 'outro', { total: amount, rule: `${fmt(amount)} LAYR`, btn: 'COLLECT ›', done: finish });
  const play = () => { sceneSet('jackpot', 'play', { amount, rule: '', toOutro: outro }, 5200, outro); particles(90); sting('jackpot'); };
  const intro = () => sceneSet('jackpot', 'intro', { amount, rule: 'Five This Is #1 on the centre line. Claim the top prize.', start: play, toOutro: outro }, 0);
  sceneSet('jackpot', 'trigger', { cells: cells.length ? cells : trigCells(['bitcoin']), title: 'JACKPOT: NUMBER ONE', sub: 'FIVE THIS IS #1 ON THE CENTRE LINE', toOutro: outro }, 2400, intro);
  sting('jackpot');
}
function drawJackpot(now) {
  const d = SC.data, u = (now - SC.t0);
  if (SC.stage === 'intro') { sceneBackdrop(now, 'jackpot'); if (t1LogoReady) sg.drawImage(t1Logo, 600, 250, 200, 125); text(sg, 'NUMBER ONE', 700, 480, 150 * ease(u / 900), '#f6c453', 'Arial', 'center', '900'); text(sg, d.rule, 700, 600, 28, '#fff4d8', 'Arial', 'center', '700'); sbtn(500, 740, 400, 84, 'CLAIM ▲', () => d.start(), true); sbtn(1180, 740, 170, 84, 'SKIP', () => d.toOutro(), false); return; }
  if (SC.stage === 'play') {
    sceneBackdrop(now, 'jackpot'); const k = ease(u / 1400), crown = tileFor('bitcoin', crownFace()), s = 300 * (RM() ? 1 : .8 + .2 * k + .02 * Math.sin(now / 160));
    sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = 70; sg.drawImage(crown, 700 - s / 2, 250 - s / 2 + 20, s, s); sg.restore();
    text(sg, 'JACKPOT: NUMBER ONE', 700, 74, 66, '#fff4d8', 'Arial', 'center', '900'); const n = countTo(d.amount, SC.t0 + 600, now, 3600); sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = 44; text(sg, fmt(n), 700, 590, 150, '#f6c453', 'Arial', 'center', '900'); sg.restore(); text(sg, 'LAYR PROGRESSIVE', 700, 660, 26, '#cfc8ff', 'Arial', 'center', '800');
    if (!RM() && Math.random() < .25) particles(6); sbtn(1180, 740, 170, 84, 'SKIP', () => d.toOutro(), false); sceneFooter(); return; }
  drawSummary(now, 'jackpot', 'JACKPOT: NUMBER ONE', d.total, ['THE TOP PRIZE OF THE MACHINE, PAID IN FULL', 'ANY LINE WINS ARE PAID ON TOP'], (n) => { const s = 240; sg.save(); sg.shadowColor = '#f0b429'; sg.shadowBlur = 50; sg.drawImage(tileFor('bitcoin', crownFace()), 700 - s / 2, 330 - s / 2 + 10, s, s); sg.restore(); });
}
/* ---- gamble: Odd Block / Even Block ---- */
function flowGamble(pre) {
  if (locked()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } if (!state.gamble || busy()) return;
  const stake = state.gamble; stopAuto();
  const call = c => {
    const r = E.gamble(state, c); if (!r) { sceneEnd(); return; } save(); update(); sting('flip');
    const blk = pickBlock(r.parity);
    sceneSet('gamble', 'play', { stake, call: c, r, blk, rule: '' }, 3200, () => sceneSet('gamble', 'outro', { stake, call: c, r, blk, rule: r.win ? `Doubled: ${fmt(r.amount)} LAYR` : 'Not this time', done: () => { sceneEnd(); if (r.win) particles(30); } }));
    setTimeout(() => sound(r.win ? 'win' : 'lose'), RM() ? 400 : 2200);
  };
  const keep = () => { state.gamble = 0; save(); sceneEnd(); toast('Win kept in your balance.'); };
  if (pre) return call(pre);
  sceneSet('gamble', 'trigger', { cells: [], title: 'DOUBLE OR NOTHING', sub: `${fmt(stake)} LAYR RIDES ON ONE REAL BLOCK` }, 1400, () => sceneSet('gamble', 'intro', { stake, rule: `${fmt(stake)} LAYR on the parity of one real block`, call, keep }));
}
function drawGamble(now) {
  sceneBackdrop(now, 'gamble'); const d = SC.data, u = now - SC.t0;
  text(sg, 'ODD BLOCK / EVEN BLOCK', 700, 100, 64, '#fff4d8', 'Arial', 'center', '900'); text(sg, `${fmt(d.stake)} LAYR ON THE LINE`, 700, 160, 28, '#f6c453', 'Arial', 'center', '800');
  const card = (x, y, w, h, face, flip) => { const sx = Math.abs(Math.cos(flip * Math.PI)); sg.save(); sg.translate(x + w / 2, y + h / 2); sg.scale(Math.max(.02, sx), 1); round(sg, -w / 2, -h / 2, w, h, 22, face ? '#f3ead6' : lin(sg, 0, -h / 2, 0, h / 2, ['#4636e0', '#1d1566']), '#f6c453', 6); if (face) face(w, h); else { text(sg, '?', 0, 10, 160, '#f6c453', 'Arial', 'center', '900'); text(sg, 'SEALED STACKS BLOCK', 0, h / 2 - 34, 20, '#cfc8ff', 'Arial', 'center', '700'); } sg.restore(); };
  if (SC.stage === 'intro') { card(500, 210, 400, 330, null, 0); text(sg, d.rule, 700, 600, 26, '#f3ead6', 'Arial', 'center', '700'); sbtn(250, 640, 400, 96, 'ODD BLOCK', () => d.call('odd'), true); sbtn(750, 640, 400, 96, 'EVEN BLOCK', () => d.call('even'), true); sbtn(500, 770, 400, 70, 'KEEP MY WIN', d.keep, false); sceneFooter(); return; }
  const flip = RM() ? 1 : Math.min(1, Math.max(0, (u - (SC.stage === 'play' ? 1400 : 0)) / 700)) * (SC.stage === 'outro' ? 0 : 1) + (SC.stage === 'outro' ? 1 : 0);
  const spinPhase = SC.stage === 'play' && u < 1400; const b = d.blk, par = d.r.parity;
  const face = (w, h) => { text(sg, 'STACKS BLOCK', 0, -h / 2 + 50, 24, '#5546ff', 'Arial', 'center', '800'); text(sg, b ? `#${b.h}` : d.r.hash.slice(-6), 0, 20, b ? 120 : 70, '#2a1f7a', 'Arial', 'center', '900'); text(sg, par.toUpperCase(), 0, h / 2 - 50, 44, d.r.win ? '#0a7f3c' : '#b3261e', 'Arial', 'center', '900'); if (b) text(sg, `BTC ${b.bh.toLocaleString('en-GB')} · ${dateOf(b.t)}`, 0, h / 2 - 16, 18, '#7a6e57', 'Arial', 'center', '700'); };
  const fl = spinPhase ? (RM() ? 0 : (u / 140) % 2) : (SC.stage === 'play' ? Math.min(1, (u - 1400) / 700) : 1);
  card(500, 210, 400, 330, (!spinPhase && fl >= .5) || SC.stage === 'outro' ? face : null, spinPhase ? fl : Math.min(1, fl) * (SC.stage === 'play' ? 1 : 1) % 1 || (SC.stage === 'outro' ? 0 : fl));
  if (SC.stage === 'outro') { text(sg, d.r.win ? 'DOUBLED' : 'NOT THIS TIME', 700, 610, 72, d.r.win ? '#f6c453' : '#cfc8ff', 'Arial', 'center', '900'); text(sg, `${b ? `BLOCK ${b.h} IS ${par.toUpperCase()}` : `HASH ENDS ${par.toUpperCase()}`} · YOU CALLED ${d.call.toUpperCase()}`, 700, 662, 24, '#f3ead6', 'Arial', 'center', '700'); text(sg, d.r.win ? `+${fmt(d.r.amount)} LAYR` : `${fmt(d.stake)} LAYR LOST`, 700, 718, 34, d.r.win ? '#f6c453' : '#a79ee8', 'Arial', 'center', '800'); sbtn(500, 770, 400, 84, 'CONTINUE', () => d.done(), true); }
  sceneFooter();
}
/* the same buttons, mirrored into the feature bar so the room (and the fullscreen bar) can drive them */
function mirrorBar() {
  if (!SC || !SC.dom || !SC.btns.length) return; const key = SC.stage + SC.btns.map(b => b.label).join(); if (SC.domKey === key) return; SC.domKey = key;
  const host = $('scBtns'); if (!host) return; host.innerHTML = ''; SC.btns.forEach(b => { const e = document.createElement('button'); e.className = b.primary ? 'bar-cta' : 'outline'; e.textContent = b.label; e.onclick = () => b.fn(); host.appendChild(e); });
}
/* Skip during play: free spins, picks and respins jump to the summary with the same total */
let PLAYSKIP = null;
function drawPlaySkip() {
  PLAYSKIP = null; if (SC || spinning) return; const f = feature(), free = (state.free > 0 || state.freeActive) && !f;
  if (!(free && state.free > 0) && !(f && !E.featureDone(f))) return;
  const b = { x: 1190, y: 790, w: 160, h: 52, fn: () => (f ? skipFeature() : skipFree()) }; PLAYSKIP = b;
  round(sg, b.x, b.y, b.w, b.h, 14, '#2a1f7acc', '#8d83ff', 3); text(sg, 'SKIP ▸▸', b.x + b.w / 2, b.y + b.h / 2 + 1, 22, '#f3ead6', 'Arial', 'center', '900');
}
function playSkipTap(x, y) { const b = PLAYSKIP; if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.fn(); return true; } return false; }
/* ---- play-stage effects used by the existing feature views ---- */
function fxReveal(x, y, w, h, i, now) { const t0 = pickAnim[i]; if (!t0) return; const u = (now - t0) / 700; if (u > 1 || RM()) return; sg.save(); sg.globalAlpha = 1 - u; sg.strokeStyle = '#f6c453'; sg.lineWidth = 8 * (1 - u); const g = u * 60; sg.strokeRect(x - g, y - g / 2, w + 2 * g, h + g); sg.fillStyle = '#fff4d8'; sg.globalAlpha = .6 * (1 - u * 2 > 0 ? 1 - u * 2 : 0); sg.fillRect(x, y, w, h); sg.restore(); screenDirty = true; }
function fxStamp(x, y, w, h, i, now) { const t0 = lockAnim[i]; if (!t0) return; const u = (now - t0) / 650; if (u > 1 || RM()) return; sg.save(); sg.globalAlpha = 1 - u; sg.strokeStyle = '#fff4d8'; sg.lineWidth = 6; const g = 70 * (1 - ease(u * 1.6)); sg.strokeRect(x - g, y - g, w + 2 * g, h + 2 * g); sg.restore(); screenDirty = true; }
