/* ---------- Bonus Lab: select any bonus round or special event, choose the bet, run it through the full presentation on a separate lab balance ---------- */
const LAB_ITEMS = [
  ['free', 'Session Mode', '3 work-space-stations · 8 steps'], ['free-retrigger', 'Session Mode + retrigger', 'stations land again on step 2'],
  ['vault', 'The Chorus', '3 cicada calls · open three'], ['chain', 'Layers', '5 layers · normal respins'], ['chain-full', 'Layers · full tower', 'every cell locks · The X follows'],
  ['jackpot', 'The X', '5 Xtrata marks on the centre row'], ['gamble-win', 'Bitcoin or Stacks · win', 'a win, then the coin lands your way'], ['gamble-lose', 'Bitcoin or Stacks · loss', 'a win, then the coin goes against you'],
  ['scatter3', 'Scatter pay ×3', '3 stations · 2× bet + Session Mode'], ['scatter4', 'Scatter pay ×4', '4 stations · 5× bet + Session Mode'], ['scatter5', 'Scatter pay ×5', '5 stations · 10× bet + Session Mode'],
  ['cameo', 'Audionaut cameo', 'an Audionaut on a winning line'], ['callisto', 'CALLISTO ×5', 'five wilds on the centre line']];
function mulberry32(a) { return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const scatterN = g => g.flat().filter(x => x === 'scatter').length;
// Choose reel stops that land the wanted symbols. Nothing in the engine is edited, duplicated or bypassed: the stops go in through start(state, rng).
function findStops(kind, r, bet) {
  const pick = n => Math.floor(r() * n), W = BF.windowAt;
  const at = (want, row) => E.strips.map((s, c) => { const o = s.map((x, i) => i).filter(i => W(c, i)[row] === want); return o[pick(o.length)]; });
  if (kind === 'jackpot') return at('bitcoin', 1);
  if (kind === 'callisto') return at('wild', 1);
  for (let k = 0; k < 600000; k++) {
    const stops = E.strips.map(s => pick(s.length)), grid = stops.map((s, c) => W(c, s)), ev = BF.evaluate(grid, bet, 1), t = ev.triggers, plain = !t.free && !t.vault && !t.chain && !ev.jackpot;
    const ok = kind === 'free' || kind === 'free-retrigger' || kind === 'scatter3' ? t.free && scatterN(grid) === 3 && !t.vault && !t.chain && !ev.jackpot
      : kind === 'scatter4' ? scatterN(grid) === 4 && !t.vault && !t.chain && !ev.jackpot : kind === 'scatter5' ? scatterN(grid) === 5 && !t.vault && !t.chain && !ev.jackpot
      : kind === 'vault' ? t.vault && !t.free && !t.chain && !ev.jackpot : kind === 'chain' || kind === 'chain-full' ? t.chain && !t.free && !t.vault && !ev.jackpot
      : kind === 'gamble-win' || kind === 'gamble-lose' || kind === 'win' ? plain && ev.total > 0
      : kind === 'cameo' ? plain && ev.wins.some(w => E.lines[w.line].slice(0, w.count).some((row, c) => grid[c][row] === 'artifact' || grid[c][row] === 'wild')) : false;
    if (ok) return stops;
  }
  return null;
}
// The scripted rng: the first five draws are the chosen stops; every other draw (prizes, lock values, the round id) comes from the seeded generator.
// For a full tower, each empty cell's 1-in-25 lock draw returns 0, so every cell locks on the first respin.
function scriptedRng(stops, r, full) { let i = 0; return n => { if (i < 5) return stops[i++]; if (full && n === E.CHAIN_ODDS) return 0; return Math.floor(r() * n); }; }
function craft(kind, seed, bet) { const r = mulberry32(seed >>> 0), stops = findStops(kind, r, bet); return stops ? scriptedRng(stops, r, kind === 'chain-full') : null; }
function enterLab() {
  if (!LAB_ALLOWED) return false; if (lab.on) return true;
  if (spinning || pres || feature() || state.free > 0) { toast('Finish the current round first, then open the Bonus Lab.'); return false; }
  stopAuto(); lab.real = state; lab.holders = { minted: sources.minted, mintRead: sources.mintRead };
  const s = BF.fresh(); s.balance = 10000; for (const k of ['muted', 'volume', 'ambient', 'turbo', 'reduced', 'showLines']) s[k] = state[k];
  lab.on = true; state = s; E = BF; ensureExtras(); refaceIdle(); screenDirty = true; update(); status('BONUS LAB · PRACTICE PLAY'); return true;
}
function exitLab() {
  if (!lab.on) return true;
  if (spinning || pres || feature() || state.free > 0) { toast('Finish or skip the round first, then leave the lab.'); return false; }
  stopAuto(); closeModal(); lab.runAll = null; lab.freePlan = null; lab.gambleForce = null; lab.pendingGamble = null;
  sources.minted = lab.holders.minted; sources.mintRead = lab.holders.mintRead; liveLabel();
  state = lab.real; E = E0; lab.on = false; lab.real = null; lastResult = null; refaceIdle();
  ensureExtras(); screenDirty = true; update(); status('BACK TO YOUR REAL GAME'); toast('Left the Bonus Lab. Your real game is exactly as you left it.');
  return true;
}
function openLab() {
  if (!LAB_ALLOWED) return; if (!lab.on && !enterLab()) return; const L = lab.last;
  showModal('lab', 'Bonus Lab.', `<p class="fine">Practice LAYR only: your real balance, saved game, jackpot meters, Holder Pot and RTP statistics are not touched, and every round here is marked LAB in History. Each item deals a real round through the real engine (reel stops chosen to land it), then plays the full scene: trigger, intro, play, summary.</p>
  <div class="lab-list" role="radiogroup" aria-label="Bonus round">${LAB_ITEMS.map(([k, t, sub], i) => `<label class="lab-item"><input type="radio" name="labItem" value="${k}" ${(L ? L.kind === k : i === 0) ? 'checked' : ''}><span><b>${t}</b><small>${sub}</small></span></label>`).join('')}</div>
  <div class="lab-opts"><label>Bet<select id="labBet">${bets.map(b => `<option value="${b}" ${b === (L ? L.bet : state.bet) ? 'selected' : ''}>${b} LAYR</option>`).join('')}</select></label>
  <label><input type="radio" name="labMode" value="seeded" ${!L || L.mode === 'seeded' ? 'checked' : ''}> Seeded</label><input id="labSeed" type="number" min="1" step="1" value="${L ? L.seed : 2114}" aria-label="Seed">
  <label><input type="radio" name="labMode" value="random" ${L && L.mode === 'random' ? 'checked' : ''}> Random</label></div>
  <div class="lab-actions"><button class="cta" id="labRun">Run</button><button class="outline" id="labReplay" ${L ? '' : 'disabled'}>Replay last${L ? ` (${esc(L.kind)} · seed ${L.seed})` : ''}</button><button class="outline" id="labAll">Run all (${LAB_ITEMS.length})</button><button class="outline" id="labReset">Reset lab balance</button><button class="outline" id="labHist">Lab history</button><button class="outline" id="labLeave">Leave the lab</button></div>
  <p class="fine">Lab balance: ${fmt(state.balance)} practice LAYR. Keys: L opens this menu, S skips a scene.</p>`, 'BONUS LAB');
  $('labRun').onclick = () => { const kind = (document.querySelector('input[name=labItem]:checked') || {}).value, bet = Number($('labBet').value), mode = (document.querySelector('input[name=labMode]:checked') || {}).value, seed = mode === 'random' ? BF.randomInt(2 ** 31) : Math.max(1, Number($('labSeed').value) || 1); closeModal(); labRun(kind, bet, seed, mode); };
  $('labReplay').onclick = () => { if (!lab.last) return; closeModal(); const l = lab.last; labRun(l.kind, l.bet, l.seed, l.mode); };
  $('labAll').onclick = () => { const bet = Number($('labBet').value); closeModal(); lab.runAll = { queue: LAB_ITEMS.map(x => x[0]), bet, seed: Math.max(1, Number($('labSeed').value) || 1), done: [] }; labNext(true); };
  $('labReset').onclick = () => { if (busy()) return; state.balance = 10000; state.jackpots = BF.fresh().jackpots; state.pot = 0; update(); toast('Lab balance reset to 10,000 practice LAYR.'); openLab(); };
  $('labHist').onclick = openHistory; $('labLeave').onclick = () => { closeModal(); exitLab(); };
}
function labRun(kind, bet, seed, mode = 'seeded') {
  if (!lab.on && !enterLab()) return 'locked'; if (busy()) { toast('Finish the current round first.'); return 'busy'; }
  if (!LAB_ITEMS.some(x => x[0] === kind)) return 'unknown';
  if (state.balance < bet) state.balance = 10000;
  state.bet = bet; state.gamble = 0; lab.last = { kind, bet, seed, mode }; lab.freePlan = kind === 'free-retrigger' ? [null, 'scatter3'] : null;
  lab.gambleForce = kind === 'gamble-win' ? 'win' : kind === 'gamble-lose' ? 'lose' : null; lab.pendingGamble = lab.gambleForce ? kind : null;
  const rng = craft(kind, seed, bet); if (!rng) { toast(`Could not find stops for ${kind}.`); return 'no-stops'; }
  spinForced = rng; status(`BONUS LAB · ${kind.toUpperCase()} · SEED ${seed}`); update(); spin(); return 'ok';
}
// Free-spin steps inside a lab run can be scripted too (the retrigger item lands three stations on step 2).
function labFreeRng() { if (!lab.on || state.free <= 0 || !lab.freePlan || !lab.freePlan.length) return null; const k = lab.freePlan.shift(); return k ? craft(k, (lab.last ? lab.last.seed : 1) + 7, state.freeBet) : null; }
function labNext(first) {
  const ra = lab.runAll; if (!ra || !lab.on || busy() || (first !== true && ra.wait)) return;
  if (!ra.queue.length) { lab.runAll = null; status('BONUS LAB · RUN ALL COMPLETE'); toast(`Run all complete: ${ra.done.length} items played.`); return; }
  ra.wait = true; setTimeout(() => { ra.wait = false; if (lab.runAll !== ra || busy()) return; const k = ra.queue.shift(); ra.done.push(k); labRun(k, ra.bet, ra.seed + ra.done.length); }, first === true ? 200 : 900);
}
// Run all drives each scene the way a player would: start, open three cicadas, respin, call the coin, collect.
function labTick(now) {
  const p = pres; if (!lab.on || !lab.runAll || !p || spinning) return; const t = now - p.t0; if (p.labAt && now < p.labAt) return;
  if (p.stage === 'intro' && t > 1200) { p.labAt = now + 900; if (p.bonus === 'gamble') gambleCall(lab.runAll.done.length % 2 ? 'odd' : 'even'); else if (p.bonus !== 'jackpot') presStart(); return; }
  if (p.stage === 'play' && p.bonus === 'vault') { const f = feature(); if (f && f.picks.length < 3 && t > 900) { p.labAt = now + 1300; const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); pickBind(open[Math.floor(Math.random() * open.length)]); } return; }
  if (p.stage === 'play' && p.bonus === 'chain') { const f = feature(); if (f && !E.featureDone(f) && t > 700) { p.labAt = now + 800; featureAction(); } }
}
/* ---------- Test hooks (standalone test page only) ---------- */
function openTest() {
  if (!TESTBUILD) return; const B = (k, t, sub) => `<button data-t="${k}"><b>${t}</b><br><small>${sub}</small></button>`;
  showModal('test', 'Test panel.', `<p class="fine">Standalone test build only. The holder read switch shows how the cabinet reads when the Audionaut count is unknown, live or complete. Nothing on this machine needs twinning, so it never shows NOT YET FOREVER and never runs dark.</p><div class="test-grid">${B('twins:none', 'Holders: unknown', 'the count read fails')}${B('twins:some', 'Holders: minted so far', 'the bundled mint count')}${B('twins:all', 'Holders: all 111', 'every Audionaut minted')}${B('reduced', 'Reduced motion', state.reduced ? 'on: turn off' : 'off: turn on')}${B('reset', 'Reset balance', 'back to the play balance')}${B('lab', 'Bonus Lab', 'every bonus, any bet')}${B('state', 'Show state', 'engine and presentation')}</div><div class="test-sim"><input id="simN" type="number" value="1000000" min="1000" step="1000" aria-label="Spins to simulate"><button class="cta" id="simRun">Run RTP sim</button></div><pre id="testOut">Ready.</pre>`, 'TEST');
  const out = s => { const el = $('testOut'); if (el) el.textContent = typeof s === 'string' ? s : JSON.stringify(s, null, 1); };
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { const k = b.dataset.t;
    if (k.startsWith('twins:')) out(TEST.setTwins(k.slice(6))); else if (k === 'reduced') { TEST.setReduced(!state.reduced); out('Reduced motion ' + (state.reduced ? 'on' : 'off')); } else if (k === 'state') out(TEST.state());
    else if (k === 'reset') { if (lab.on) state.balance = 10000; else { try { if (window.parent.XO_RESET) window.parent.XO_RESET(); } catch (e) {} } update(); out('Balance reset.'); } else if (k === 'lab') { closeModal(); openLab(); } });
  $('simRun').onclick = async () => { const n = Math.max(1000, Number($('simN').value) || 1e6), t = performance.now(); out(`Running ${fmt(n)} spins…`); const r = await TEST.sim(n, 1, (d, tot, rtp) => out(`${fmt(d)} / ${fmt(tot)} spins · running RTP ${(rtp * 100).toFixed(3)}%`)); out(`${fmt(r.spins)} spins · RTP ${(r.rtp * 100).toFixed(3)}% (design 94.38%) · ${((performance.now() - t) / 1000).toFixed(1)}s`); };
}
const TEST = {
  force(kind, seed = Date.now() & 0x7fffffff) { if (spinning || pres || feature() || state.free > 0) return 'busy'; if (sessionLock && !lab.on) return 'locked'; if (state.balance < state.bet) return 'broke'; const rng = craft(kind, seed, state.bet); if (!rng) return 'no-stops'; spinForced = rng; spin(); return 'ok'; },
  setTwins(mode) { if (mode === 'none') { sources.minted = null; sources.mintRead = 'unknown'; } else { sources.minted = mode === 'all' ? 111 : ART.audionauts.length; sources.mintRead = 'live'; } liveLabel(); screenDirty = true; return { mode, minted: sources.minted, read: sources.mintRead, perAudionaut: potShare() }; },
  setReduced(on) { state.reduced = !!on; save(); update(); },
  state: () => JSON.parse(JSON.stringify({ reduced: !!state.reduced, lab: lab.on, pres: pres && { bonus: pres.bonus, stage: pres.stage }, spinning, pot: state.pot, balance: state.balance, free: state.free, feature: feature() && feature().type, gamble: state.gamble, minted: sources.minted, read: sources.mintRead, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])) })),
  sim(n, seed = 1, progress) { return new Promise(res => { const rng = (() => { const r = mulberry32(seed); return m => Math.floor(r() * m); })(); const s = BF.fresh(); s.balance = 1e12; s.bet = 100; let wag = 0, paid = 0, done = 0; const step = () => { const stop = Math.min(n, done + 20000); for (; done < stop; done++) { const free = s.free > 0, b = free ? s.freeBet : s.bet; BF.start(s, rng); if (!free) wag += b; BF.settle(s); let g = 0; while (BF.feature(s) && g++ < 400) { const f = BF.feature(s); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) BF.pick(s, i); } else { while (!BF.featureDone(f)) BF.respin(s); } BF.collect(s); } if (s.freeActive && !s.free) BF.endFree(s); s.balance = Math.min(s.balance, 1e12); s.gamble = 0; s.history.length = 0; } paid = s.paidOut; if (progress) progress(done, n, paid / wag); if (done < n) setTimeout(step, 0); else res({ spins: n, wagered: wag, paidOut: paid, rtp: paid / wag }); }; step(); }); }
};
/* ---------- The room's interfaces, unchanged: the shared LAYR account and the canvas-and-controls API (the host owns all 3D rendering and cameras) ---------- */
let pxSessionOwned = false, pxSessionEpoch = 0, pxSessionPending = null;
function pxReleaseLease() { pxSessionEpoch++; pxSessionOwned = false; sessionLock = true; }
async function pxClaimSession() {
  if (pxSessionOwned && LAYR.ready()) return true;
  if (pxSessionPending) return pxSessionPending;
  const epoch = pxSessionEpoch;
  pxSessionPending = (async () => {
    if (!await LAYR.acquire() || epoch !== pxSessionEpoch) { sessionLock = true; update(); status(LAYR.error() || 'LAYR connection was cancelled.'); return false; }
    sessionLock = false; state = LAYR.openGame(GAME_ID, E); resume(); pxSessionOwned = true; return true;
  })().finally(() => { pxSessionPending = null; });
  return pxSessionPending;
}
const pxSourceElements = new Map(), pxSourceTokens = new WeakMap(); let pxToken = 0;
function pxPort(element) { if (!element) return ''; for (const n of [element, ...element.querySelectorAll('*')]) { if (!pxSourceTokens.has(n)) { const id = String(++pxToken); pxSourceTokens.set(n, id); pxSourceElements.set(id, n); } n.setAttribute('data-px-source', pxSourceTokens.get(n)); } return element.outerHTML; }
function pxControl(action) {
  const clicks = { sound: 'sound', turbo: 'turbo', max: 'maxBet', gamble: 'gamble' };
  if (action === 'spin') spinClick(); else if (action === 'betDown') changeBet(-1); else if (action === 'betUp') changeBet(1); else if (action === 'auto') autoClick();
  else if (action === 'pays') openRules(); else if (action === 'fair') openFair(); else if (action === 'fullscreen') fsToggle();
  else if (action === 'settings') openSettings(); else if (action === 'history') openHistory(); else if (action === 'account') openAccount(); else if (action === 'lab') openLab(); else if (action === 'pot') openPot(); else if (action === 'work') openWork();
  else if (clicks[action]) document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE = {
  screen, revision: () => rev,
  refreshAccount() { screenDirty = true; update(); drawScreen(performance.now()); },
  mechanics() { return { lever: leverStart > 0 ? { id: leverStart, elapsed: Math.max(0, performance.now() - leverStart), duration: 900, angle: 1.02 } : null, spinZ: null, armZ: null, bonus: pres ? { kind: pres.bonus, stage: pres.stage } : null, dark: false, jackpot: !!(pres && pres.bonus === 'jackpot'), win: performance.now() < winUntil }; },
  async activate() { const epoch = pxSessionEpoch, ready = await pxClaimSession(); if (epoch !== pxSessionEpoch) throw new Error('Connection was cancelled. Reconnect to play.'); if (!ready) throw new Error(LAYR.error() || 'The LAYR account is unavailable. Close the other casino tab, then reconnect.'); pxEngineActive = true; animate.last = performance.now(); screenDirty = true; update(); drawScreen(performance.now()); },
  deactivate() { if (spinning || pres) return false; if (lab.on && !exitLab()) return false; stopAuto(); if (fs.active) fsExit(); if (pxEngineActive) save(); pxEngineActive = false; if (ac) ac.suspend().catch(() => {}); pxReleaseLease(); return true; },
  action(name) { if (pxEngineActive) pxControl(name); },
  stopAuto() { stopAuto(); },
  tap(x, y) { screenTap(x, y); },
  key(code, key) { document.body.dispatchEvent(new KeyboardEvent('keydown', { code, key, bubbles: true })); },
  closeModal() { closeModal(); },
  click(token) { const el = pxSourceElements.get(token); if (el) el.click(); },
  input(token, value, checked, event) { const el = pxSourceElements.get(token); if (!el) return; if ('value' in el) el.value = value; if ('checked' in el) el.checked = checked; el.dispatchEvent(new Event(event, { bubbles: true })); },
  // Fullscreen belongs to the game: the room's own Full screen button should call fullscreen.toggle() for this machine.
  fullscreen: { enter: fsEnter, exit: fsExit, toggle: fsToggle, active: () => fs.active, addBarButton(label, sub, fn) { const b = document.createElement('button'); b.className = 'deck'; b.innerHTML = `<b>${esc(label)}</b><i>${esc(sub)}</i>`; b.onclick = fn; $('extra').appendChild(b); fsLayout(); return b; } },
  lab: LAB_ALLOWED ? { open: openLab, run: (k, bet = 100, seed = 1, mode = 'seeded') => labRun(k, bet, seed, mode), runAll: (bet = 100, seed = 1) => { if (!lab.on && !enterLab()) return false; lab.runAll = { queue: LAB_ITEMS.map(x => x[0]), bet, seed, done: [] }; labNext(true); return true; }, exit: exitLab, items: () => LAB_ITEMS.map(x => x[0]), active: () => lab.on, runAllActive: () => !!lab.runAll } : undefined,
  test: TESTBUILD ? TEST : undefined,
  ui() { const modal = $('modal'), bar = $('featureBar'), bet = state.free ? state.freeBet : state.bet, g = $('gamble'); return { balance: state.balance, lab: lab.on, bet, win: state.lastWin, spins: state.spins, spinning, button: $('spinText')?.textContent || 'INSCRIBE', spinDisabled: $('spin').disabled, betDownDisabled: $('minus')?.disabled, betUpDisabled: $('plus')?.disabled, gamble: g && !g.hidden ? g.textContent : '', status: $('status')?.textContent || '', turbo: !!state.turbo, auto: autoLeft > 0, muted: !!state.muted, modal: modal?.open ? pxPort(modal) : '', feature: bar && !bar.hidden ? pxPort(bar) : '' }; }
};
window.XtrataOriginals = Object.freeze({ version: '1.0.0', machine: GAME_ID, holderLayerStubs: HolderLayerStubs, sources: () => ({ ...sources }), pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])), scene: () => pres && { kind: pres.bonus, stage: pres.stage }, screen: () => screen,
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock, lab: lab.on, pres: pres && { bonus: pres.bonus, stage: pres.stage } })), rules: { lines: E0.lines, pays: E0.pays, strips: E0.stripCodes }, soundLog: () => soundLog.map(e => ({ ...e })),
  test: TESTBUILD ? { primary: () => spinClick(), skip: () => skipPres(), pick: i => pickBind(i), respin: () => featureAction(), gamble: c => gambleCall(c), lab: (k, bet, seed) => labRun(k, bet, seed), labOpen: openLab, labExit: exitLab, labReset: () => { if (!lab.on || busy()) return false; state.balance = 10000; state.jackpots = BF.fresh().jackpots; state.pot = 0; update(); return true; }, runAll: () => window.PX_CASINO_ENGINE.lab.runAll() } : undefined });
})();
