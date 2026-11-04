
/* ---------- Bonus presentation: every bonus runs trigger → intro → play → summary → outro. The engine deals first; scenes only reveal. ---------- */
const TITLES = {
  free: { no: '01', t: 'JUNGLE DRUMS', sub: 'FREE SPINS · ALL WINS 2×', start: 'BEAT THE DRUMS', rules: 'Bitcoin Monkeys logos wake the drums: 8 free spins, every win pays 2×. More logos add 4 spins, up to 24.', col: TORCH },
  vault: { no: '02', t: 'MONKEY STORE', sub: 'PICK BONUS', start: 'ENTER THE STORE', rules: 'Nine crates sit on the temple stair. Open three: a Serum or a Mutant Monkey waits in each, with a prize from 1× to 15× your bet.', col: GOLD2 },
  chain: { no: '03', t: 'FOREVER VINES', sub: 'HOLD & RESPIN', start: 'GROW THE VINES', rules: 'Forever Monkeys light up on the vines and stay lit. 3 respins, reset by every new monkey. Light all 15 for the jackpot.', col: MOSS },
  jackpot: { no: '04', t: 'BLOCK REWARD', sub: 'PROGRESSIVE JACKPOT', start: 'CONTINUE', rules: 'Five gold-frame Bitcoin Monkeys on the centre row crack open the block. The jackpot meter for your bet level pays out in full.', col: GOLD2 },
  gamble: { no: '05', t: 'LEFT VINE OR RIGHT VINE', sub: 'DOUBLE OR NOTHING', start: 'SWING', rules: 'Call the vine the monkey lands on: left or right. Right doubles your win, wrong loses it. An even bet.', col: GOLD3 }
};
const STAGE_MS = { trigger: 2600, outro: 650 };
const spinInputBusy = () => spinning;
const modalOpen = () => $('modal').open;
let nextFaces = null, freeTimer = 0, gambleTimer = 0;
function btnHtml(id, label, cls = 'bar-cta') { return `<button class="${cls}" id="${id}">${label}</button>`; }
function startPres(bonus, extra = {}) {
  clearTimeout(freeTimer); const parent = pres && pres.bonus === 'free' && bonus !== 'free' ? pres : null, now = performance.now();
  pres = Object.assign({ bonus, stage: 'trigger', t0: now, parent, faces: {}, reveal: {}, spins: 0, best: 0 }, extra);
  if (pres.resume) { pres.stage = 'intro'; }
  else if (bonus === 'jackpot') startCrash(reduced() ? 900 : 2500);
  sound(bonus === 'jackpot' ? 'jackpot' : 'bonus'); status(`${TITLES[bonus].t} · ${TITLES[bonus].sub}`); renderBar(); update();
}
function toStage(st) {
  if (!pres) return; const now = performance.now(); pres.stage = st; pres.t0 = now;
  if (st === 'summary') buildSummary();
  if (st === 'play' && pres.bonus === 'free') scheduleFreeNext(reduced() ? 300 : 900);
  if (st === 'play' && pres.bonus === 'jackpot') { sound('big'); particles(110); }
  renderBar(); update();
}
function buildSummary() {
  const p = pres, f = feature(); if (f) p.snapF = JSON.parse(JSON.stringify(f));
  if (p.bonus === 'free') { const r = E.endFree(state); if (r) { p.total = r.total; p.count = r.count; } else { p.total = state.freeTotal; p.count = state.freeCount; } save(); p.lines = [`${p.count} free spins played`, `Best single spin ${fmt(p.best || 0)}`, `${p.inside ? `Bonus awards inside: ${fmt(p.inside)}` : 'All wins paid at 2×'}`]; sound('win'); particles(40); }
  else if (p.bonus === 'vault') { const F = p.snapF; p.total = F.picks.reduce((a, i) => a + F.awards[i], 0) * F.bet; p.lines = [`${F.picks.length} crates opened`, `Best prize ${Math.max(...F.picks.map(i => F.awards[i]))}× your bet`, `Prizes: ${F.picks.map(i => F.awards[i] + '×').join(' + ')}`]; sound(p.total >= F.bet * 20 ? 'big' : 'win'); particles(p.total >= F.bet * 20 ? 70 : 30); }
  else if (p.bonus === 'chain') { const F = p.snapF, fr = F.frames[F.index], n = fr.cells.filter(Boolean).length; p.total = F.sum * F.bet; p.lines = [`${n} of 15 vines lit`, `${F.index} respin${F.index === 1 ? '' : 's'} played`, F.full ? 'EVERY VINE IS LIT: jackpot to follow' : `Monkeys worth ${F.sum}× your bet`]; sound(F.full ? 'big' : 'win'); particles(F.full ? 100 : 40); }
  else if (p.bonus === 'jackpot') { p.total = p.amount; p.lines = [`Bet level ${fmt(p.bet)}`, 'Meter reset to its seed', 'Paid into your LAYR balance']; sound('big'); particles(110); }
  else if (p.bonus === 'gamble') { const r = p.result; p.total = r ? r.amount : 0; sound(r && r.win ? 'win' : 'lose'); if (r && r.win) particles(35); p.lines = r ? [`The monkey landed on the ${r.parity === 'odd' ? 'RIGHT' : 'LEFT'} VINE`, r.win ? `You called it: ${fmt(r.stake)} doubled` : `Not this time: ${fmt(r.stake)} lost`, 'Your other LAYR are untouched'] : ['You kept your win']; }
}
function leave(after) { if (!pres) return; pres.stage = 'outro'; pres.t0 = performance.now(); pres.after = after; renderBar(); update(); }
function finishOutro() {
  const p = pres, fn = p.after; pres = p.parent || null; if (pres) { pres.stage = 'play'; pres.t0 = performance.now(); }
  hideBar(); update(); if (fn) fn(); resumeFlow();
}
function resumeFlow() {
  update(); renderBar();
  if (pres && pres.bonus === 'free') { if (feature()) { startPres(feature().type); return; } if (state.free > 0) scheduleFreeNext(reduced() ? 300 : 1000); else toStage('summary'); return; }
  if (pres) return;
  if (feature()) { startPres(feature().type); return; }
  if (state.free > 0) { startPres('free'); return; }
  if (state.freeActive) { startPres('free', { resume: true }); toStage('summary'); return; }
  scheduleAuto();
}
function presTick(now) {
  if (!pres) return; const t = now - pres.t0, R = reduced(), p = pres; screenDirty = true;
  if (p.stage === 'trigger' && t > (R ? 1000 : p.bonus === 'gamble' ? 1500 : STAGE_MS.trigger)) toStage('intro');
  else if (p.stage === 'intro' && p.bonus === 'jackpot' && t > (R ? 800 : 1800)) toStage('play');
  else if (p.stage === 'play' && p.bonus === 'jackpot' && t > (R ? 1400 : 4300)) toStage('summary');
  else if (p.stage === 'play' && p.bonus === 'gamble' && t > (R ? 700 : 2100)) toStage('summary');
  else if (p.stage === 'play' && p.doneAt && now > p.doneAt + (R ? 300 : 1100)) toStage('summary');
  else if (p.stage === 'outro' && t > (R ? 120 : STAGE_MS.outro)) finishOutro();
}
function presAction() {
  const p = pres; if (!p || spinning || locked()) return;
  if (p.stage === 'trigger') { toStage('intro'); return; }
  if (p.stage === 'intro') { presStart(); return; }
  if (p.stage === 'play') { if (p.bonus === 'chain') featureAction(); else if (p.bonus === 'free') { clearTimeout(freeTimer); if (state.free > 0 && !spinning) spin(); } else if (p.bonus === 'vault') toast('Tap a crate to open it.'); return; }
  if (p.stage === 'summary') presCollect();
}
function presStart() {
  const p = pres; if (!p || p.stage !== 'intro') return;
  if (p.bonus === 'gamble') { keepGamble(); return; }
  sound('click'); toStage('play');
}
function presCollect() {
  const p = pres; if (!p || p.stage !== 'summary') return; sound('click');
  if (p.bonus === 'vault' || p.bonus === 'chain') {
    const f0 = feature(), c = E.collect(state); if (!c) return; save(); lastResult = null; winUntil = performance.now() + 4000;
    if (c.jackpotWin) { pres = Object.assign(p, {}); const par = p.parent; pres = null; startPres('jackpot', { amount: c.jackpotWin, bet: f0 ? f0.bet : state.bet, parent: par }); return; }
    status(`${TITLES[p.bonus].t} · ${fmt(c.amount)} LAYR COLLECTED`); if (p.parent) p.parent.inside = (p.parent.inside || 0) + c.amount;
    leave(); return;
  }
  if (p.bonus === 'free') { status(`JUNGLE DRUMS · ${fmt(p.total)} LAYR COLLECTED`); leave(); return; }
  leave(() => { lastResult = null; });
}
// Skip: the same total, without the show. Remaining free spins are dealt by the engine at once; remaining booths open at random.
function resolveFeaturesInstant(p) {
  let g = 0;
  while (feature() && g++ < 300) {
    const f = feature();
    if (f.type === 'vault') { const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); while (feature().picks.length < 3 && open.length) E.pick(state, open.splice(Math.floor(Math.random() * open.length), 1)[0]); }
    else { while (!E.featureDone(feature()) && g++ < 300) E.respin(state); }
    const c = E.collect(state); if (c) p.inside = (p.inside || 0) + c.amount;
  }
}
function skipPres() {
  const p = pres; if (!p || spinning || locked() || p.stage === 'summary' || p.stage === 'outro') return; clearTimeout(freeTimer);
  if (p.bonus === 'free') {
    let guard = 0; while (state.free > 0 && guard++ < 80) { try { E.start(state); } catch (e) { break; } const r = E.settle(state); p.spins++; p.best = Math.max(p.best || 0, r.total); resolveFeaturesInstant(p); }
    resolveFeaturesInstant(p); lastResult = null; save(); toStage('summary'); return;
  }
  if (p.bonus === 'vault') { const f = feature(); const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); while (feature().picks.length < 3 && open.length) { const i = open.splice(Math.floor(Math.random() * open.length), 1)[0]; E.pick(state, i); p.reveal[i] = performance.now() - 5000; } save(); toStage('summary'); return; }
  if (p.bonus === 'chain') { let g = 0; while (!E.featureDone(feature()) && g++ < 100) E.respin(state); save(); toStage('summary'); return; }
  if (p.bonus === 'gamble') { if (p.stage === 'intro' || p.stage === 'trigger') { keepGamble(); return; } toStage('summary'); return; }
  toStage('summary');
}
function scheduleFreeNext(ms = 1000) {
  clearTimeout(freeTimer); freeTimer = setTimeout(() => { if (!pres || pres.bonus !== 'free' || pres.stage !== 'play' || state.free <= 0 || feature()) return; if (spinning || modalOpen() || document.hidden) { scheduleFreeNext(600); return; } spin(); }, state.turbo ? Math.min(ms, 380) : ms);
}
/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinClick() {
  if (spinInputBusy()) return; audioInit(); if (modalOpen() || locked()) return;
    if (pres) { presAction(); return; }
  if (feature()) { startPres(feature().type); return; }
  if (!state.free && state.balance < state.bet) { openAccount(); return; }
  spin();
}
function scheduleStop(a, c) {
  if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); const delay = Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency()); a.nodes = sound('stop', c, delay) || null;
  if (nextFaces && nextFaces[c] && nextFaces[c].some((f, r) => { const it = faceItem(a.finalSyms[r], f); return it && it.forever; })) setTimeout(() => sound('drop'), delay * 1000);
}
function spin() {
  if (spinning || modalOpen() || locked()) return;
  if (feature()) { startPres(feature().type); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])), wasFree = state.free > 0, betNow = wasFree ? state.freeBet : state.bet; let p;
  try { if (!spinForced && lab.on && labState.plan && labState.plan.retrig && pres && pres.bonus === 'free' && pres.stage === 'play') { labState.plan.retrig = false; spinForced = craftRng('free', labState.plan.seed + 17, {}); } const fr = spinForced || (lab.on && labState.stream) || null; spinForced = null; p = fr ? E.start(state, fr) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message)) openAccount(); return; }
  if (!wasFree) state.pot = r2(state.pot + betNow * POT_RATE); // Holder Pot: 1% of every paid bet, from the house edge
  leverStart = performance.now(); spinning = true; lastResult = null; save(); sound('spin'); capsuleFaces = [];
  status(p.free ? 'DRUM SPIN · ALL WINS 2×' : 'SWINGING…');
  // The result is already fixed; now pick which monkeys will show in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || reduced(), antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; // Tile i is drawn i rows up from the bottom, so the sequence runs bottom to top: the three old rows and the three landing rows are listed bottom row first (reversed), and the strip is read backwards so the reel scrolls down through it. This keeps the landing picture identical to the settled grid (no flip when the reel stops).
const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] + n + 2 - i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] - 1 + L * 8) % L]; const sequence = [...prev[c].slice().reverse(), ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]).reverse(), [after, pickFace(after)]]; return { sequence, finalSyms: p.grid[c], travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
function recordCameos(r) { // Cameo: a monkey on a winning line is recorded for the future royalty (stub: no payout in v1).
  const out = [];
  for (const w of r.wins) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = state.grid[c][line[c]], it = FACE(s) ? faceItem(s, faces[c][line[c]]) : null; if (it) { out.push({ tokenId: it.id, collection: 'bitcoin-monkeys', lineWin: w.amount, forever: !!it.forever, xtrataId: it.xtrataId || null }); break; } } }
  if (out.length && state.history[0]) state.history[0].cameos = out; // TODO(holder-layer v2): royalty = 1% of lineWin to the holder of tokenId, from a server-side snapshot.
  return out;
}
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null; const r = lastResult, bet = r.round.bet;
  recordCameos(r); if (lab.on && state.history[0]) state.history[0].kind = 'LAB'; save(); update();
  if (pres && pres.bonus === 'free') { pres.spins++; pres.best = Math.max(pres.best || 0, r.total); }
  if (r.total) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; if (r.total >= bet * 5 && !r.jackpotWin) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'BLOCK REWARD · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · JUNGLE DRUMS' : ''}` : (r.round.free ? 'DRUM SPIN COMPLETE' : 'NO WIN THIS TIME · SWING AGAIN');
  if (state.gamble) msg += ' · LEFT VINE OR RIGHT VINE?';
  status(msg);
  if (r.jackpotWin) { stopAuto(); startPres('jackpot', { amount: r.jackpotWin, bet }); return; }
  afterSpin(r);
}
function afterSpin(r) {
  if (feature()) { stopAuto(); startPres(feature().type); return; }
  if (r.triggers.free) { stopAuto(); if (r.freeAward) { if (pres && pres.bonus === 'free') { pres.retrig = { t0: performance.now(), add: r.freeAward }; sound('bonus'); scheduleFreeNext(1500); } else startPres('free'); } else { toast('Jungle Drums cap reached: 24 spins awarded this feature.'); if (pres && pres.bonus === 'free') scheduleFreeNext(900); } return; }
  if (pres && pres.bonus === 'free') { if (state.free > 0) scheduleFreeNext(reduced() ? 300 : 1000); else toStage('summary'); return; }
  if (state.freeActive && !state.free) { stopAuto(); startPres('free', { resume: true }); toStage('summary'); return; }
  scheduleAuto();
}
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !modalOpen() && !document.hidden && !pres) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || modalOpen() || feature() || pres) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-swing stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() {
  if (autoLeft) { stopAuto(); status('AUTO-SWING OFF'); return; } if (spinning || feature() || pres || locked()) { toast('Finish this spin or bonus first.'); return; }
  showModal('auto', 'Let the monkey swing.', `<p>Auto-swing spins at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-SWING again at any time to stop.</p>`);
  document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); });
}
/* ---------- Bonus controls (the DOM port the casino shows, and the fullscreen bar mirrors) ---------- */
let capsuleFaces = [];
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
function renderBar() {
  if (!pres) { hideBar(); screenDirty = true; return; }
  const p = pres, T = TITLES[p.bonus], st = p.stage, f = feature() || p.snapF; let info = T.rules, html = '';
  if (st === 'trigger') { info = T.sub; html = btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
  else if (st === 'intro') { html = p.bonus === 'gamble' ? btnHtml('fbHeads', 'LEFT VINE') + btnHtml('fbHacks', 'RIGHT VINE') + btnHtml('fbKeep', 'Keep my win', 'bar-cta ghost') : btnHtml('fbGo', T.start) + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
  else if (st === 'play') {
    if (p.bonus === 'free') { info = `${state.free} spins left · all wins 2× · total ${fmt(state.freeTotal)}`; html = btnHtml('fbGo', state.free ? 'Spin now' : '…') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else if (p.bonus === 'vault') { const n = 3 - f.picks.length; info = n ? `Open ${n} more crate${n === 1 ? '' : 's'} · tap the screen or a number` : 'All three opened'; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || !n ? 'disabled' : ''} aria-label="Crate ${i + 1}${f.picks.includes(i) ? `, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else if (p.bonus === 'chain') { const fr = f.frames[f.index], k = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${k}/15 lit · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${k}/15 lit · ${fmt(f.sum * f.bet)} so far`; html = btnHtml('fbGo', done ? '…' : 'Respin') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else html = btnHtml('fbSkip', 'Skip', 'bar-cta ghost');
  } else if (st === 'summary') { info = p.total !== undefined ? `${fmt(p.total)} LAYR` : ''; html = btnHtml('fbGo', p.bonus === 'gamble' ? 'Continue' : 'Collect ↗'); }
  setBar(`FEATURE ${T.no}`, T.t, info, html); screenDirty = true;
  const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
  on('fbGo', presAction); on('fbSkip', skipPres); on('fbHeads', () => gambleCall('even')); on('fbHacks', () => gambleCall('odd')); on('fbKeep', keepGamble);
  document.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => pickBind(Number(b.dataset.pick)));
}
function featureAction() {
  const f = feature(); if (!f || spinning || locked()) return; if (!pres) { startPres(f.type); return; } if (pres.stage !== 'play') { presAction(); return; }
  if (E.featureDone(f)) { toStage('summary'); return; }
  if (f.type === 'chain') { const fr = E.respin(state); save(); chainFlash = performance.now(); if (fr.added.length) fr.added.forEach((_, k) => sound('lock', k)); else sound('respin'); if (E.featureDone(feature())) pres.doneAt = performance.now() + 700; renderBar(); update(); }
  else toast('Tap a crate to open it.');
}
function pickBind(i) {
  if (locked() || !pres || pres.bonus !== 'vault' || pres.stage !== 'play') return; const r = E.pick(state, i); if (!r) return; save(); pres.reveal[i] = performance.now(); sound('pick', i);
  if (E.featureDone(feature())) pres.doneAt = performance.now() + 900; renderBar(); update();
}
/* ---------- Left Vine or Right Vine ---------- */
function openGamble() { if (locked()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } if (!state.gamble || busy()) return; startPres('gamble', { stake: state.gamble }); }
function gambleCall(choice) {
  if (!pres) { if (!state.gamble || busy() || locked()) return; startPres('gamble', { stake: state.gamble }); }
  const p = pres; if (!p || p.bonus !== 'gamble' || p.result || locked()) return;
  const gp = lab.on && labState.plan && labState.plan.outcome ? labState.plan.outcome : null, grng = gp ? (n => ((choice === 'odd') === (gp === 'win') ? 1 : 0)) : undefined; const r = grng ? E.gamble(state, choice, grng) : E.gamble(state, choice); if (!r) { leave(); return; } save(); p.result = r; p.choice = choice; sound('swap'); toStage('play'); status('LEFT VINE OR RIGHT VINE · THE MONKEY IS SWINGING'); update();
}
function keepGamble() { if (!pres || pres.bonus !== 'gamble') return; state.gamble = 0; save(); toast('Win kept in your balance.'); leave(); }
