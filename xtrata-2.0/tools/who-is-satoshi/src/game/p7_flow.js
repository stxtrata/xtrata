
/* ---------- Bonus presentation: every bonus runs trigger → intro → play → summary → outro. The engine deals first; scenes only reveal. ---------- */
const TITLES = {
  free: { no: '01', t: 'THE FORUM', sub: 'FREE SPINS · ALL WINS 2×', start: 'OPEN THE THREAD', rules: 'Three or more forum posts open the thread: 8 free spins, every win pays 2×. Each spin adds a real dated Satoshi post. More posts add 4 spins, up to 24.', col: '#8fb3dc' },
  vault: { no: '02', t: 'UNMASK SATOSHI', sub: 'PICK BONUS', start: 'BREAK THE SEALS', rules: "Open three. Each envelope holds a candidate's published work and a prize from 1× to 15× your bet.", col: BRASS },
  chain: { no: '03', t: 'THE PATOSHI PATTERN', sub: 'HOLD & RESPIN', start: 'TRACE THE BLOCKS', rules: 'Real early blocks lock in place. 3 respins, reset by every new block. Find all 15 for the jackpot.', col: GREEN2 },
  jackpot: { no: '04', t: "SATOSHI'S KEY", sub: 'PROGRESSIVE JACKPOT', start: 'CONTINUE', rules: 'Five keys on the centre row. The meter for your bet level pays out in full.', col: BRASS2 },
  gamble: { no: '05', t: 'SATOSHI OR NOT?', sub: 'DOUBLE OR NOTHING', start: 'FLIP', rules: 'Call the coin: ₿ (Satoshi) or the FAKE stamp (Not). Right doubles your win, wrong loses it. An even bet.', col: RED2 },
  gift: { no: '06', t: "SATOSHI'S GIFT", sub: 'THE WEEKLY DRAW', start: 'RUN THE DRAW', rules: "The week's whole pot goes to one twin from every live Forever Twins collection, picked by the snapshot block's hash. Anyone can check it.", col: BRASS }
};
const STAGE_MS = { trigger: 2600, outro: 650 };
const spinInputBusy = () => spinning;
const modalOpen = () => $('modal').open;
let nextFaces = null, freeTimer = 0;
function btnHtml(id, label, cls = 'bar-cta') { return `<button class="${cls}" id="${id}">${label}</button>`; }
function startPres(bonus, extra = {}) {
  clearTimeout(freeTimer); const parent = pres && pres.bonus === 'free' && bonus !== 'free' ? pres : null, now = performance.now();
  fake = null; pres = Object.assign({ bonus, stage: 'trigger', t0: now, parent, faces: {}, reveal: {}, spins: 0, best: 0, thread: [] }, extra);
  if (pres.resume) pres.stage = 'intro';
  sound(bonus === 'jackpot' ? 'jackpot' : 'bonus'); status(`${TITLES[bonus].t} · ${TITLES[bonus].sub}`); renderBar(); update();
}
function toStage(st) {
  if (!pres) return; const now = performance.now(); pres.stage = st; pres.t0 = now;
  if (st === 'summary') buildSummary();
  if (st === 'play' && pres.bonus === 'free') scheduleFreeNext(reduced() ? 300 : 900);
  // entering The Patoshi Pattern: all fifteen cells search once and the trigger blocks land (display only; nothing is drawn by the engine here)
  if (st === 'play' && pres.bonus === 'chain') { const f = feature(); if (f && f.type === 'chain' && f.index === 0) { const fr = f.frames[0]; startChainSpin(Array(15).fill(0), fr.left, { added: fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0), left: fr.left }, true); } }
  if (st !== 'play') chainSpin = null;
  if (st === 'play' && pres.bonus === 'jackpot') { particles(110); }
  if (st === 'play' && pres.bonus === 'gift') sound('swap');
  renderBar(); update();
}
function buildSummary() {
  const p = pres, f = feature(); if (f) p.snapF = JSON.parse(JSON.stringify(f));
  if (p.bonus === 'free') { const r = E.endFree(state); if (r) { p.total = r.total; p.count = r.count; } else { p.total = state.freeTotal; p.count = state.freeCount; } save(); p.lines = [`${p.count} free spins played · ${p.thread.length} posts in the thread`, `Best single spin ${fmt(p.best || 0)}`, `${p.inside ? `Bonus awards inside: ${fmt(p.inside)}` : 'All wins paid at 2×'}`]; sound('win'); particles(40); }
  else if (p.bonus === 'vault') { const F = p.snapF; p.total = F.picks.reduce((a, i) => a + F.awards[i], 0) * F.bet; p.lines = [`${F.picks.length} envelopes opened · still anonymous`, `Best prize ${Math.max(...F.picks.map(i => F.awards[i]))}× your bet`, `Prizes: ${F.picks.map(i => F.awards[i] + '×').join(' + ')}`]; sound(p.total >= F.bet * 20 ? 'big' : 'win'); particles(p.total >= F.bet * 20 ? 70 : 30); }
  else if (p.bonus === 'chain') { const F = p.snapF, fr = F.frames[F.index], n = fr.cells.filter(Boolean).length; p.total = F.sum * F.bet; p.lines = [`${n} of 15 Patoshi blocks found`, `${F.index} respin${F.index === 1 ? '' : 's'} played`, F.full ? 'EVERY BLOCK FOUND: the key jackpot follows' : `Blocks worth ${F.sum}× your bet`]; sound(F.full ? 'big' : 'win'); particles(F.full ? 100 : 40); }
  else if (p.bonus === 'jackpot') { p.total = p.amount; p.lines = [`Bet level ${fmt(p.bet)}`, 'Meter reset to its seed', 'Signed? No signature. Paid into your LAYR balance']; sound('big'); particles(110); }
  else if (p.bonus === 'gamble') { const r = p.result; p.total = r ? r.amount : 0; sound(r && r.win ? 'win' : 'lose'); if (r && r.win) particles(35); p.lines = r ? [`The coin landed on ${r.parity === 'odd' ? 'FAKE (NOT)' : '₿ (SATOSHI)'}`, r.win ? `You called it: ${fmt(r.stake)} doubled` : `Not this time: ${fmt(r.stake)} lost`, 'Your other LAYR are untouched'] : ['You kept your win']; }
  else if (p.bonus === 'gift') { p.total = 0; p.lines = [`Snapshot hash ends …${p.hash.slice(-8)}`, `${fmt(p.pool)} twins in the draw → twin #${fmt(p.index + 1)}`, 'Display only: payouts need the snapshot service (v2)']; sound('win'); }
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
  else if (p.stage === 'play' && p.bonus === 'jackpot' && t > (R ? 1400 : 4300)) toStage('summary');
  else if (p.stage === 'play' && p.bonus === 'gamble' && t > (R ? 700 : 2100)) toStage('summary');
  else if (p.stage === 'play' && p.bonus === 'gift' && t > (R ? 900 : 3200)) toStage('summary');
  else if (p.stage === 'play' && p.doneAt && now > p.doneAt + (R ? 300 : 1100)) toStage('summary');
  else if (p.stage === 'outro' && t > (R ? 120 : STAGE_MS.outro)) finishOutro();
  else if (lab.on && lab.autoplay) labAutoStep(p, t);
}
function presAction() {
  const p = pres; if (!p || spinning || locked()) return;
  if (p.stage === 'trigger') { toStage('intro'); return; }
  if (p.stage === 'intro') { presStart(); return; }
  if (p.stage === 'play') { if (p.bonus === 'chain') featureAction(); else if (p.bonus === 'free') { clearTimeout(freeTimer); if (state.free > 0 && !spinning) spin(); } else if (p.bonus === 'vault') toast('Tap an envelope to open it.'); return; }
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
    const f0 = feature(), c = E.collect(state); if (!c) return; save(); lastResult = null; winUntil = performance.now() + 4000; stringGlow = performance.now();
    if (c.jackpotWin) { const par = p.parent; pres = null; startPres('jackpot', { amount: c.jackpotWin, bet: f0 ? f0.bet : state.bet, parent: par }); return; }
    status(`${TITLES[p.bonus].t} · ${fmt(c.amount)} LAYR COLLECTED`); if (p.parent) p.parent.inside = (p.parent.inside || 0) + c.amount;
    leave(); return;
  }
  if (p.bonus === 'free') { status(`THE FORUM · ${fmt(p.total)} LAYR COLLECTED`); leave(); return; }
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
    let guard = 0; while (state.free > 0 && guard++ < 80) { try { lab.on && lab.queue.length ? E.start(state, craftRng(lab.queue.shift())) : E.start(state); } catch (e) { break; } const r = E.settle(state); if (lab.on && state.history[0]) state.history[0].lab = true; p.spins++; p.best = Math.max(p.best || 0, r.total); addPost(p); resolveFeaturesInstant(p); }
    resolveFeaturesInstant(p); lastResult = null; save(); toStage('summary'); return;
  }
  if (p.bonus === 'vault') { const f = feature(); const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); while (feature().picks.length < 3 && open.length) { const i = open.splice(Math.floor(Math.random() * open.length), 1)[0]; E.pick(state, i); p.reveal[i] = performance.now() - 5000; } save(); toStage('summary'); return; }
  if (p.bonus === 'chain') { chainSpin = null; let g = 0; while (!E.featureDone(feature()) && g++ < 100) E.respin(state); save(); toStage('summary'); return; }
  if (p.bonus === 'gamble') { if (p.stage === 'intro' || p.stage === 'trigger') { keepGamble(); return; } toStage('summary'); return; }
  toStage('summary');
}
function scheduleFreeNext(ms = 1000) {
  clearTimeout(freeTimer); freeTimer = setTimeout(() => { if (!pres || pres.bonus !== 'free' || pres.stage !== 'play' || state.free <= 0 || feature()) return; if (spinning || modalOpen() || document.hidden) { scheduleFreeNext(600); return; } spin(); }, state.turbo ? Math.min(ms, 380) : ms);
}
// Each free spin adds a real dated post to the thread (chosen after the result, so it never matters to the maths).
function addPost(p) { const posts = REC.posts || []; if (!posts.length) return; const used = new Set(p.thread.map(x => x.post.text)), left = posts.filter(x => !used.has(x.text)), post = (left.length ? left : posts)[Math.floor(Math.random() * (left.length || posts.length))]; p.thread.push({ post, t: performance.now() }); }
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
function spin() {
  if (spinning || modalOpen() || locked()) return;
  if (feature()) { startPres(feature().type); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])), wasFree = state.free > 0, betNow = wasFree ? state.freeBet : state.bet; let p;
  if (!spinForced && lab.on && lab.queue.length) spinForced = craftRng(lab.queue.shift());
  try { const fr = spinForced; spinForced = null; p = fr ? E.start(state, fr) : E.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message) && !lab.on) openAccount(); return; }
  if (!wasFree) state.pot = r2(state.pot + betNow * POT_RATE); // Holder Pot: 1% of every paid bet, from the house edge
  leverStart = performance.now(); spinning = true; lastResult = null; save(); sound('spin');
  status(p.free ? 'THE FORUM · ALL WINS 2×' : 'INVESTIGATING…');
  // The result is already fixed and saved; now pick which record shows in each cell.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), quick = state.turbo || reduced(), antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (quick ? 350 : 900) : 0; const land = (quick ? 380 + c * 90 : 1450 + c * 280) + extra, bounce = quick ? 110 : 210; const travel = Math.max(6, Math.round(land * (quick ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, finalSyms: p.grid[c], travel, start: now + c * (quick ? 18 : 65), land, bounce, duration: land + bounce, kick: quick ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, quick ? 450 : 1900);
  update();
}
// Cameo records: this machine shows no NFTs on its reels, so line wins carry no twin cameo (kept for the shared history format).
function recordCameos() { return []; }
function finishSpin() {
  spinning = false; lastResult = E.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null; const r = lastResult, bet = r.round.bet;
  if (lab.on && state.history[0]) { state.history[0].lab = true; state.history[0].kind = 'LAB · ' + state.history[0].kind; }
  recordCameos(r); save(); update();
  if (pres && pres.bonus === 'free') { pres.spins++; pres.best = Math.max(pres.best || 0, r.total); addPost(pres); }
  if (r.total) { sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = performance.now() + 4000; stringGlow = performance.now(); if (r.total >= bet * 5 && !r.jackpotWin) particles(r.total >= bet * 25 ? 70 : 35); }
  if (forgeryOnLine(r)) { fake = { t0: performance.now() + 150 }; setTimeout(() => sound('trombone'), 120); setTimeout(() => sound('stamp'), 150); }
  let msg = r.total ? `${r.jackpotWin ? "SATOSHI'S KEY · " : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · THE FORUM' : ''}` : (r.round.free ? 'FORUM SPIN COMPLETE' : 'NO LEADS THIS TIME · INVESTIGATE AGAIN');
  if (state.gamble) msg += ' · SATOSHI OR NOT?';
  status(msg);
  if (r.jackpotWin) { stopAuto(); startPres('jackpot', { amount: r.jackpotWin, bet }); return; }
  afterSpin(r);
}
function afterSpin(r) {
  if (feature()) { stopAuto(); startPres(feature().type); return; }
  if (r.triggers.free) { stopAuto(); if (r.freeAward) { if (pres && pres.bonus === 'free') { pres.retrig = { t0: performance.now(), add: r.freeAward }; sound('bonus'); scheduleFreeNext(1500); } else startPres('free'); } else { toast('The Forum cap reached: 24 spins awarded this feature.'); if (pres && pres.bonus === 'free') scheduleFreeNext(900); } return; }
  if (pres && pres.bonus === 'free') { if (state.free > 0) scheduleFreeNext(reduced() ? 300 : 1000); else toStage('summary'); return; }
  if (state.freeActive && !state.free) { stopAuto(); startPres('free', { resume: true }); toStage('summary'); return; }
  if (lab.on && state.gamble > 0 && lab.gambleWant) { setTimeout(() => { if (!pres && state.gamble) startPres('gamble', { stake: state.gamble }); }, 900); return; }
  scheduleAuto(); labIdle();
}
function changeBet(dir, max = false) { if (busy() || locked()) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !modalOpen() && !document.hidden && !pres) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || modalOpen() || feature() || pres) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('Auto-sleuth stopped: insufficient LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() {
  if (autoLeft) { stopAuto(); status('AUTO-SLEUTH OFF'); return; } if (spinning || feature() || pres || locked()) { toast('Finish this spin or bonus first.'); return; }
  showModal('auto', 'Put a sleuth on it.', `<p>Auto-sleuth investigates at your current bet. It stops when any bonus triggers, LAYR run low, you open a panel or leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.free ? state.freeBet : state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-SLEUTH again at any time to stop.</p>`, 'AUTO-SLEUTH');
  document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); });
}
/* ---------- Bonus controls (the DOM port the casino shows, and the fullscreen bar mirrors) ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
function renderBar() {
  if (!pres) { hideBar(); screenDirty = true; return; }
  const p = pres, T = TITLES[p.bonus], st = p.stage, f = feature() || p.snapF; let info = T.rules, html = '';
  if (st === 'trigger') { info = T.sub; html = btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
  else if (st === 'intro') { html = p.bonus === 'gamble' ? btnHtml('fbYes', '₿ SATOSHI') + btnHtml('fbNo', 'FAKE · NOT') + btnHtml('fbKeep', 'Keep my win', 'bar-cta ghost') : p.bonus === 'jackpot' ? '' : btnHtml('fbGo', T.start) + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
  else if (st === 'play') {
    if (p.bonus === 'free') { info = `${state.free} spins left · all wins 2× · total ${fmt(state.freeTotal)}`; html = btnHtml('fbGo', state.free ? 'Spin now' : '…') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else if (p.bonus === 'vault') { const n = 3 - f.picks.length; info = n ? `Open ${n} more envelope${n === 1 ? '' : 's'} · tap the screen or a number` : 'All three opened'; html = Array.from({ length: 9 }, (_, i) => `<button class="pick capsule${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || !n ? 'disabled' : ''} aria-label="Envelope ${i + 1}${f.picks.includes(i) ? `, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else if (p.bonus === 'chain') { const fr = f.frames[f.index], k = fr.cells.filter(Boolean).length, done = E.featureDone(f); info = done ? `${k}/15 blocks · ${fmt(f.sum * f.bet)} LAYR` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${k}/15 blocks · ${fmt(f.sum * f.bet)} so far`; html = btnHtml('fbGo', done ? '…' : 'Respin') + btnHtml('fbSkip', 'Skip', 'bar-cta ghost'); }
    else html = btnHtml('fbSkip', 'Skip', 'bar-cta ghost');
  } else if (st === 'summary') { info = p.total !== undefined ? `${fmt(p.total)} LAYR` : ''; html = btnHtml('fbGo', p.bonus === 'gamble' || p.bonus === 'gift' ? 'Continue' : 'Collect ↗'); }
  setBar(`FEATURE ${T.no}`, T.t, info, html); screenDirty = true;
  const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
  on('fbGo', presAction); on('fbSkip', skipPres); on('fbYes', () => gambleCall('even')); on('fbNo', () => gambleCall('odd')); on('fbKeep', keepGamble);
  document.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => pickBind(Number(b.dataset.pick)));
}
function featureAction() {
  const f = feature(); if (!f || spinning || locked()) return; if (!pres) { startPres(f.type); return; } if (pres.stage !== 'play') { presAction(); return; }
  if (E.featureDone(f)) { toStage('summary'); return; }
  if (f.type === 'chain') { if (chainBusy()) return; const prev = f.frames[f.index], prevCells = prev.cells.slice(), prevLeft = prev.left; const fr = E.respin(state); save();
    const ms = startChainSpin(prevCells, prevLeft, fr); if (!ms) { if (fr.added.length) fr.added.forEach((_, k) => sound('lock', k)); else sound('respin'); }
    if (E.featureDone(feature())) pres.doneAt = performance.now() + ms + 700; renderBar(); update(); }
  else toast('Tap an envelope to open it.');
}
function pickBind(i) {
  if (locked() || !pres || pres.bonus !== 'vault' || pres.stage !== 'play') return; const r = E.pick(state, i); if (!r) return; save(); pres.reveal[i] = performance.now(); sound('pick', i); setTimeout(() => sound('stamp'), reduced() ? 0 : 650);
  if (E.featureDone(feature())) pres.doneAt = performance.now() + 1100; renderBar(); update();
}
/* ---------- Satoshi or Not? ---------- */
function openGamble() { if (locked()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } if (!state.gamble || busy()) return; startPres('gamble', { stake: state.gamble }); }
function gambleCall(choice) {
  if (!pres) { if (!state.gamble || busy() || locked()) return; startPres('gamble', { stake: state.gamble }); }
  const p = pres; if (!p || p.bonus !== 'gamble' || p.result || locked()) return;
  const r = lab.on && lab.gambleWant ? E.gamble(state, choice, gambleRng(choice)) : E.gamble(state, choice); if (!r) { leave(); return; } save(); p.result = r; p.choice = choice; sound('swap'); toStage('play'); status('SATOSHI OR NOT? · THE COIN IS IN THE AIR'); update();
}
function keepGamble() { if (!pres || pres.bonus !== 'gamble') return; state.gamble = 0; save(); toast('Win kept in your balance.'); leave(); }
