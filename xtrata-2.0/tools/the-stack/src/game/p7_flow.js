
/* ---------- Bonus presentation: every bonus runs trigger → intro → play → summary → outro. The engine deals first; scenes only reveal. ---------- */
const TITLES = {
  free: { no: '01', t: 'STACKING SEASON', sub: 'FREE SPINS · ALL WINS 2×', start: 'START THE SEASON', rules: 'Three or more stacking cycles start 8 free spins. Every win pays 2×, and a cycle ring fills round the screen edge as the spins run. More cycles add 4 spins, up to 24.', col: ORANGE },
  vault: { no: '02', t: 'REWARD SLOTS', sub: 'PICK BONUS', start: 'OPEN THE SLOTS', rules: 'Open three of nine sealed reward envelopes. Each holds a real stacking cycle and a prize from 1× to 15× your bet.', col: '#3fa98a' },
  chain: { no: '03', t: 'FAST BLOCKS', sub: 'HOLD & RESPIN', start: 'START PRODUCING', rules: 'Real recent Stacks blocks lock in place, each settled on a Bitcoin block. 3 respins, reset by every new block. Stack all 15 for the jackpot.', col: PURPLE2 },
  jackpot: { no: '04', t: 'BITCOIN FINALITY', sub: 'PROGRESSIVE JACKPOT', start: 'CONTINUE', rules: 'Five ₿ on the centre row. The meter for your bet level pays out in full.', col: BTC },
  gamble: { no: '05', t: 'STACK OR UNSTACK', sub: 'DOUBLE OR NOTHING', start: 'FLIP', rules: 'Call the flip: ▲ STACK or ▼ UNSTACK. Call it right and your win doubles; call it wrong and you lose that win. An even bet.', col: PURPLE2 },
  turnover: { no: '06', t: 'CYCLE TURNOVER', sub: 'LAB · A REHEARSAL', start: 'RUN THE PREPARE PHASE', rules: 'A rehearsal of the cycle’s end: the last blocks of the prepare phase count down, the ring completes and the next stacking cycle begins. Nothing is paid.', col: ORANGE },
  snapshot: { no: '07', t: 'CYCLE SNAPSHOT', sub: 'LAB · THE FLOOR POT', start: 'TAKE THE SNAPSHOT', rules: 'At the end of every stacking cycle (2,100 Bitcoin blocks) the Floor Pot is shared equally per twin across every live Forever Twins collection. Display only.', col: PURPLE2 }
};
const STAGE_MS = { trigger: 2600, outro: 700 };
const spinInputBusy = () => spinning;
const modalOpen = () => $('modal').open;
let nextFaces = null, freeTimer = 0, hdTimer = 0; // hdTimer runs the Cycle Turnover countdown
function btnHtml(id, label, cls = 'bar-cta') { return `<button class="${cls}" id="${id}">${label}</button>`; }
function startPres(bonus, extra = {}) {
  clearTimeout(freeTimer); const parent = pres && pres.bonus === 'free' && bonus !== 'free' ? pres : null, now = performance.now();
  pres = Object.assign({ bonus, stage: 'trigger', t0: now, parent, faces: {}, reveal: {}, spins: 0, best: 0 }, extra);
  if (pres.resume) pres.stage = 'intro';
  sound(bonus === 'jackpot' ? 'jackpot' : 'bonus'); ledPulse = now; status(`${TITLES[bonus].t} · ${TITLES[bonus].sub}`); renderBar(); update();
}
function toStage(st) {
  if (!pres) return; const now = performance.now(); pres.stage = st; pres.t0 = now;
  if (st === 'summary') buildSummary();
  if (st === 'play' && pres.bonus === 'free') { scheduleFreeNext(reduced() ? 300 : 900); }
  if (st === 'play' && pres.bonus === 'chain') { const f = feature(); if (f && f.index === 0) startFastAnim([], 3, f.frames[0], true); } // the trigger's blocks stack up one by one
  if (st === 'intro' && pres.bonus === 'free') { sound('ring'); }
  if (st === 'play' && pres.bonus === 'jackpot') { particles(110); sound('ticks', 40); }
  if (st === 'play' && pres.bonus === 'snapshot') sound('ticks', 14);
  if (st === 'play' && pres.bonus === 'turnover') runTurnover();
  renderBar(); update();
}
function runTurnover() { clearTimeout(hdTimer); turnover = { n: 3, at: performance.now() }; sound('ticks', 6); const step = () => { if (!turnover) return; if (turnover.n > 0) { turnover.n--; turnover.at = performance.now(); sound('ticks', turnover.n ? 6 : 20); if (!turnover.n) { setTimeout(() => sound('bonus'), 300); particles(40); } else hdTimer = setTimeout(step, reduced() ? 300 : 1100); } }; hdTimer = setTimeout(step, reduced() ? 300 : 1100); }
function buildSummary() {
  const p = pres, f = feature(); if (f) p.snapF = JSON.parse(JSON.stringify(f));
  if (p.bonus === 'free') { const r = E.endFree(state); if (r) { p.total = r.total; p.count = r.count; } else { p.total = state.freeTotal; p.count = state.freeCount; } save(); p.lines = [`${p.count} free spins played · the cycle ring closed`, `Best single spin ${fmt(p.best || 0)}`, `${p.inside ? `Bonus awards inside: ${fmt(p.inside)}` : 'All wins paid at 2×'}`]; sound('win'); particles(40); }
  else if (p.bonus === 'vault') { const F = p.snapF; p.total = F.picks.reduce((a, i) => a + F.awards[i], 0) * F.bet; const hs = F.picks.map(i => cycleFor(F, i)).filter(Boolean).map(c => 'cycle ' + c.cycle); p.lines = [`${F.picks.length} reward envelopes opened · ${hs.join(', ')}`, `Best prize ${Math.max(...F.picks.map(i => F.awards[i]))}× your bet`, `Prizes: ${F.picks.map(i => F.awards[i] + '×').join(' + ')}`]; sound(p.total >= F.bet * 20 ? 'big' : 'win'); particles(p.total >= F.bet * 20 ? 70 : 30); }
  else if (p.bonus === 'chain') { const F = p.snapF, fr = F.frames[F.index], n = fr.cells.filter(Boolean).length; p.total = F.sum * F.bet; p.lines = [`${n} of 15 Stacks blocks stacked on Bitcoin`, `${F.index} respin${F.index === 1 ? '' : 's'} played`, F.full ? 'ALL 15 STACKED: BITCOIN FINALITY FOLLOWS' : `Blocks worth ${F.sum}× your bet`]; sound(F.full ? 'big' : 'win'); particles(F.full ? 100 : 40); }
  else if (p.bonus === 'jackpot') { p.total = p.amount; p.lines = [`Bet level ${fmt(p.bet)}`, 'Meter reset to its seed', 'Paid into your LAYR balance']; sound('big'); particles(110); }
  else if (p.bonus === 'gamble') { const r = p.result; p.total = r ? r.amount : 0; sound(r && r.win ? 'win' : 'lose'); if (r && r.win) particles(35); p.lines = r ? [`The token landed on ${r.parity === 'odd' ? '▼ UNSTACK' : '▲ STACK'}`, r.win ? `You called it: ${fmt(r.stake)} doubled` : `Not this time: ${fmt(r.stake)} lost`, 'Your other LAYR are untouched'] : ['You kept your win']; }
  else if (p.bonus === 'turnover') { p.total = 0; clearTimeout(hdTimer); turnover = null; p.lines = [`The real one: cycle ${p.cycle} ends at Bitcoin block ${fmt(cycleEnd(p.cycle))}${Number.isFinite(cycleLeft()) ? ', ' + fmt(cycleLeft()) + ' blocks from now' : ''}`, `Cycle ${p.cycle + 1} then runs 2,100 Bitcoin blocks`, 'A rehearsal: no LAYR changed hands']; sound('win'); }
  else if (p.bonus === 'snapshot') { p.total = 0; p.lines = [`Snapshot at Bitcoin block ${fmt(p.block)} (end of cycle ${p.cycle})`, p.twins ? `${fmt(p.pot)} LAYR ÷ ${fmt(p.twins)} twins = ${fmt(r2(p.pot / p.twins))} each` : 'Twin count unknown: no share is shown', 'Display only: payouts need the snapshot service (v2)']; sound('win'); }
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
  if (lab.on && state.gamble > 0 && lab.gambleWant) { startPres('gamble', { stake: state.gamble }); return; }
  scheduleAuto(); labIdle();
}
function presTick(now) {
  if (!pres) return; const t = now - pres.t0, R = reduced(), p = pres; screenDirty = true;
  if (p.stage === 'trigger' && t > (R ? 1000 : p.bonus === 'gamble' ? 1500 : STAGE_MS.trigger)) toStage('intro');
  else if (p.stage === 'intro' && p.bonus === 'jackpot' && t > (R ? 800 : 1800)) toStage('play');
  else if (p.stage === 'play' && p.bonus === 'jackpot' && t > (R ? 1400 : 4800)) toStage('summary');
  else if (p.stage === 'play' && p.bonus === 'gamble' && t > (R ? 700 : 2100)) toStage('summary');
  else if (p.stage === 'play' && p.bonus === 'snapshot' && t > (R ? 900 : 3400)) toStage('summary');
  else if (p.stage === 'play' && p.bonus === 'turnover' && turnover && turnover.n === 0 && now - turnover.at > (R ? 600 : 2800)) toStage('summary');
  else if (p.stage === 'play' && p.doneAt && now > p.doneAt + (R ? 300 : 1100)) toStage('summary');
  else if (p.stage === 'outro' && t > (R ? 120 : STAGE_MS.outro)) finishOutro();
  else if (lab.on && lab.autoplay) labAutoStep(p, t);
}
function presAction() {
  const p = pres; if (!p || spinning || locked()) return;
  if (p.stage === 'trigger') { toStage('intro'); return; }
  if (p.stage === 'intro') { presStart(); return; }
  if (p.stage === 'play') { if (p.bonus === 'chain') featureAction(); else if (p.bonus === 'free') { clearTimeout(freeTimer); if (state.free > 0 && !spinning) spin(); } else if (p.bonus === 'vault') toast('Tap a reward envelope to open it.'); return; }
  if (p.stage === 'summary') presCollect();
}
function presStart() {
  const p = pres; if (!p || p.stage !== 'intro') return;
  if (p.bonus === 'gamble') { keepGamble(); return; }
  if (p.bonus === 'jackpot') return;
  sound('click'); toStage('play');
}
function presCollect() {
  const p = pres; if (!p || p.stage !== 'summary') return; sound('click');
  if (p.bonus === 'vault' || p.bonus === 'chain') {
    const f0 = feature(), c = E.collect(state); if (!c) return; save(); lastResult = null; winUntil = performance.now() + 4000; ledPulse = performance.now();
    if (c.jackpotWin) { const par = p.parent; pres = null; startPres('jackpot', { amount: c.jackpotWin, bet: f0 ? f0.bet : state.bet, parent: par }); return; }
    status(`${TITLES[p.bonus].t} · ${fmt(c.amount)} LAYR COLLECTED`); if (p.parent) p.parent.inside = (p.parent.inside || 0) + c.amount;
    leave(); return;
  }
  if (p.bonus === 'free') { status(`STACKING SEASON · ${fmt(p.total)} LAYR COLLECTED`); leave(); return; }
  leave(() => { lastResult = null; });
}
// Skip: the same total, without the show. Remaining free spins are dealt by the engine at once; remaining envelopes open at random.
function resolveFeaturesInstant(p) {
  let g = 0;
  while (feature() && g++ < 300) {
    const f = feature();
    if (f.type === 'vault') { const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); while (feature().picks.length < 3 && open.length) E.pick(state, open.splice(Math.floor(Math.random() * open.length), 1)[0]); }
    else { while (!E.featureDone(feature()) && g++ < 300) E.respin(state); }
    const c = E.collect(state); if (c) { p.inside = (p.inside || 0) + c.amount; if (c.jackpotWin) p.jackpotInside = (p.jackpotInside || 0) + c.jackpotWin; }
  }
}
function skipPres() {
  const p = pres; if (!p || spinning || locked() || p.stage === 'summary' || p.stage === 'outro') return; clearTimeout(freeTimer);
  if (p.bonus === 'free') {
    let guard = 0; while (state.free > 0 && guard++ < 80) { try { lab.on && lab.queue.length ? E.start(state, craftRng(lab.queue.shift())) : E.start(state); } catch (e) { break; } const r = E.settle(state); if (lab.on && state.history[0]) state.history[0].lab = true; p.spins++; p.best = Math.max(p.best || 0, r.total); resolveFeaturesInstant(p); }
    resolveFeaturesInstant(p); lastResult = null; save(); toStage('summary'); return;
  }
  if (p.bonus === 'vault') { const f = feature(); const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); while (feature().picks.length < 3 && open.length) { const i = open.splice(Math.floor(Math.random() * open.length), 1)[0]; E.pick(state, i); p.reveal[i] = performance.now() - 5000; } save(); toStage('summary'); return; }
  if (p.bonus === 'chain') { let g = 0; while (!E.featureDone(feature()) && g++ < 100) E.respin(state); p.fast = null; save(); toStage('summary'); return; }
  if (p.bonus === 'gamble') { if (p.stage === 'intro' || p.stage === 'trigger') { keepGamble(); return; } toStage('summary'); return; }
  if (p.bonus === 'turnover') { clearTimeout(hdTimer); turnover = { n: 0, at: performance.now() - 5000 }; }
  toStage('summary');
}
function scheduleFreeNext(ms = 1000) {
  clearTimeout(freeTimer); freeTimer = setTimeout(() => { if (!pres || pres.bonus !== 'free' || pres.stage !== 'play' || state.free <= 0 || feature()) return; if (spinning || modalOpen() || document.hidden) { scheduleFreeNext(600); return; } spin(); }, state.turbo ? Math.min(ms, 380) : ms);
}
/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4 || g.slice(0, 3).every(col => col[1] === 'bitcoin'); }
function spinClick() {
  if (spinInputBusy()) return; audioInit(); if (modalOpen() || locked()) return;
  if (pres) { presAction(); return; }
  if (feature()) { startPres(feature().type); return; }
  if (!state.free && state.balance < state.bet) { if (lab.on) { state.balance = 10000; update(); } else { openAccount(); return; } }
  spin();
}
function scheduleStop(a, c) {
  if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); const delay = Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency()); a.nodes = sound('stop', c, delay) || null;
}
/* The lever: matte black with an orange knob. Every pull swings it down and back (the room's lever pull: 900 ms, sin(u·π)).
   Display only: the spin is already dealt. mechanics() reports power 1 (this machine has no breaker) for hosts that read it. */
/* The deck's push buttons: every press (a click on the cabinet, the bar, a key, or the game itself pressing STACK on auto)
   stamps a time, and mechanics() reports how far down each cap is: buttons {spin, betUp, betDown, auto, pays} 0–1 and,
   for the room's spinPhysical, spinZ (the STACK cap's local z: 0 at rest, −0.04 fully in). */
const pressedAt = { spin: 0, betUp: 0, betDown: 0, auto: 0, pays: 0 };
function pressBtn(name) { if (name in pressedAt) { pressedAt[name] = performance.now(); screenDirty = true; } }
function pressDepth(t) { if (!(t >= 0) || t > 270) return 0; if (t < 55) return t / 55; if (t < 110) return 1; const u = (t - 110) / 160; return 1 - u * u * (3 - 2 * u); }
let btnFreeze = null; // test page only: hold the buttons at one moment of a press (TEST.buttons({spin: ms…}))
function spin() {
  if (spinning || modalOpen() || locked()) return;
  if (feature()) { startPres(feature().type); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])), wasFree = state.free > 0, betNow = wasFree ? state.freeBet : state.bet; let p;
  if (!spinForced && lab.on && lab.queue.length) spinForced = craftRng(lab.queue.shift());
  try { const fr = spinForced; spinForced = null; p = fr ? E.start(state, fr) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message) && !lab.on) openAccount(); return; }
  if (!wasFree) state.pot = r2(state.pot + betNow * POT_RATE); // Floor Pot: 1% of every paid bet, from the house edge
  leverStart = performance.now(); ledPulse = leverStart; pressBtn('spin'); spinning = true; lastResult = null; save(); sound('spin');
  status(p.free ? 'STACKING SEASON · ALL WINS 2×' : 'STACKING…');
  // The result is already fixed and saved; now pick which logo variant or block shows in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || reduced(), antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] + 2 + n - i) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] - 1 + L) % L];
    // The reel runs downwards and drawReels lays sequence[i] out from the bottom of the window upwards, so each window is
    // listed bottom row first: the old window, then the strip below the new one, then the new window, then the cell above it.
    // (Listing a window top row first showed it upside down while the reel landed, then flipped it when the spin settled.)
    const sequence = [...[...prev[c]].reverse(), ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]).reverse(), [after, pickFace(after)]]; return { sequence, finalSyms: p.grid[c], travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
// Cameo records: this machine shows logos and chain records, not NFTs, so line wins carry no twin cameo (kept for the shared history format).
function recordCameos() { return []; }
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null; const r = lastResult, bet = r.round.bet;
  if (lab.on && state.history[0]) { state.history[0].lab = true; state.history[0].kind = 'LAB · ' + state.history[0].kind; }
  recordCameos(r); save(); update();
  if (pres && pres.bonus === 'free') { pres.spins++; pres.best = Math.max(pres.best || 0, r.total); }
  if (r.total) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; ledPulse = performance.now(); if (r.total >= bet * 5 && !r.jackpotWin) particles(r.total >= bet * 25 ? 70 : 35); }
  let msg = r.total ? `${r.jackpotWin ? 'BITCOIN FINALITY · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · STACKING SEASON' : ''}` : (r.round.free ? 'FREE SPIN COMPLETE' : 'NOT THIS BLOCK · STACK AGAIN');
  if (state.gamble) msg += ' · STACK OR UNSTACK?';
  status(msg);
  if (r.jackpotWin) { stopAuto(); startPres('jackpot', { amount: r.jackpotWin, bet }); return; }
  afterSpin(r);
}
function afterSpin(r) {
  if (feature()) { stopAuto(); startPres(feature().type); return; }
  if (r.triggers.free) { stopAuto(); if (r.freeAward) { if (pres && pres.bonus === 'free') { pres.retrig = { t0: performance.now(), add: r.freeAward }; sound('bonus'); scheduleFreeNext(1500); } else startPres('free'); } else { toast('Stacking Season cap reached: 24 spins awarded this feature.'); if (pres && pres.bonus === 'free') scheduleFreeNext(900); } return; }
  if (pres && pres.bonus === 'free') { if (state.free > 0) scheduleFreeNext(reduced() ? 300 : 1000); else toStage('summary'); return; }
  if (state.freeActive && !state.free) { stopAuto(); startPres('free', { resume: true }); toStage('summary'); return; }
  if (lab.on && state.gamble > 0 && lab.gambleWant) { setTimeout(() => { if (!pres && state.gamble) startPres('gamble', { stake: state.gamble }); }, 900); return; }
  scheduleAuto(); labIdle();
}
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !modalOpen() && !document.hidden && !pres) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || modalOpen() || feature() || pres) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-stack stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() {
  if (autoLeft) { stopAuto(); status('AUTO-STACK OFF'); return; } if (spinning || feature() || pres || locked()) { toast('Finish this spin or bonus first.'); return; }
  showModal('auto', 'Auto-stack.', `<p>Auto-stack spins at your current STX bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>STX BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-STACK again at any time to stop.</p>`, 'AUTO-STACK');
  document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); });
}
/* ---------- Bonus controls (the DOM port the casino shows, and the fullscreen bar mirrors) ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
function renderBar() {
  if (!pres) { hideBar(); screenDirty = true; return; }
  const p = pres, T = TITLES[p.bonus], st = p.stage, f = feature() || p.snapF; let info = T.rules, html = '';
  if (st === 'trigger') { info = T.sub; html = btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
  else if (st === 'intro') { html = p.bonus === 'gamble' ? btnHtml('fbYes', '▲ STACK') + btnHtml('fbNo', '▼ UNSTACK') + btnHtml('fbKeep', 'Keep my win', 'bar-cta ghost') : p.bonus === 'jackpot' ? '' : btnHtml('fbGo', T.start) + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
  else if (st === 'play') {
    if (p.bonus === 'free') { info = `${state.free} spins left · all wins 2× · total ${fmt(state.freeTotal)}`; html = btnHtml('fbGo', state.free ? 'Spin now' : '…') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else if (p.bonus === 'vault') { const n = 3 - f.picks.length; info = n ? `Open ${n} more reward envelope${n === 1 ? '' : 's'} · tap the screen or a number` : 'All three opened'; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || !n ? 'disabled' : ''} aria-label="Reward envelope ${i + 1}${f.picks.includes(i) ? `, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else if (p.bonus === 'chain') { const fr = f.frames[f.index], k = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${k}/15 blocks · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${k}/15 blocks · ${fmt(f.sum * f.bet)} so far`; html = btnHtml('fbGo', done ? '…' : fastBusy() ? 'Producing…' : 'Respin') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else html = btnHtml('fbSkip', 'Skip', 'bar-cta ghost');
  } else if (st === 'summary') { info = p.total !== undefined ? `${fmt(p.total)} LAYR` : ''; html = btnHtml('fbGo', INFO_BONUS(p.bonus) ? 'Continue' : 'Collect ↗'); }
  setBar(`FEATURE ${T.no}`, T.t, info, html); screenDirty = true;
  const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
  on('fbGo', presAction); on('fbSkip', skipPres); on('fbYes', () => gambleCall('even')); on('fbNo', () => gambleCall('odd')); on('fbKeep', keepGamble);
  document.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => pickBind(Number(b.dataset.pick)));
}
function featureAction() {
  const f = feature(); if (!f || spinning || locked()) return; if (!pres) { startPres(f.type); return; } if (pres.stage !== 'play') { presAction(); return; }
  if (E.featureDone(f)) { toStage('summary'); return; }
  if (f.type === 'chain') { if (fastBusy()) return; const before = f.frames[f.index], prev = before.cells.slice(), prevLeft = before.left; const fr = E.respin(state); save(); startFastAnim(prev, prevLeft, fr); if (E.featureDone(feature())) pres.doneAt = pres.fast.end + 700; renderBar(); update(); }
  else toast('Tap a reward envelope to open it.');
}
function pickBind(i) {
  if (locked() || !pres || pres.bonus !== 'vault' || pres.stage !== 'play') return; const r = E.pick(state, i); if (!r) return; save(); pres.reveal[i] = performance.now(); sound('pick', i); setTimeout(() => sound('stamp'), reduced() ? 0 : 650);
  if (E.featureDone(feature())) pres.doneAt = performance.now() + 1600; renderBar(); update();
}
/* ---------- Stack or Unstack ---------- */
function openGamble() { if (locked()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } if (!state.gamble || busy()) return; startPres('gamble', { stake: state.gamble }); }
// The engine's gamble takes a parity call: 'even' is the ▲ STACK face, 'odd' the ▼ UNSTACK face.
function gambleCall(choice) {
  if (!pres) { if (!state.gamble || busy() || locked()) return; startPres('gamble', { stake: state.gamble }); }
  const p = pres; if (!p || p.bonus !== 'gamble' || p.result || locked()) return;
  const r = lab.on && lab.gambleWant ? E.gamble(state, choice, gambleRng(choice)) : E.gamble(state, choice); if (!r) { leave(); return; } save(); p.result = r; p.choice = choice; sound('swap'); toStage('play'); status('STACK OR UNSTACK · THE TOKEN IS IN THE AIR'); update();
}
function keepGamble() { if (!pres || pres.bonus !== 'gamble') return; state.gamble = 0; save(); toast('Win kept in your balance.'); leave(); }
