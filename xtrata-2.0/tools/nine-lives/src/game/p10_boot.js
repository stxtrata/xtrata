
/* ---------- Fullscreen: the game screen fills the view; every control except the lever sits on the bottom bar ---------- */
const view = $('view'), vg = view.getContext('2d'), fs = { active: false, api: false, saved: null, saved2: null };
function fsBlit() { if (!fs.active && window.parent !== window) return; vg.drawImage(screen, 0, 0, 1400, 960); }
const fsHostDoc = () => { try { return window.parent.document; } catch (e) { return document; } };
function fsEnter() {
  if (fs.active) return true; const fe = window.frameElement, doc = fsHostDoc();
  if (fe) { fs.saved = fe.getAttribute('style'); fs.saved2 = [fe.getAttribute('aria-hidden'), fe.getAttribute('tabindex')]; const set = (k, v) => fe.style.setProperty(k, v, 'important'); [['position', 'fixed'], ['left', '0'], ['top', '0'], ['right', '0'], ['bottom', '0'], ['width', '100vw'], ['height', '100%'], ['max-width', 'none'], ['max-height', 'none'], ['display', 'block'], ['visibility', 'visible'], ['opacity', '1'], ['pointer-events', 'auto'], ['z-index', '2147483000'], ['border', '0'], ['transform', 'none'], ['background', '#03050a']].forEach(([k, v]) => set(k, v)); fe.removeAttribute('aria-hidden'); fe.setAttribute('tabindex', '0'); }
  fs.active = true; document.body.classList.add('fs-on'); fs.api = false;
  const el = fe || document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (req) { try { const pr = req.call(el); fs.api = true; if (pr && pr.catch) pr.catch(() => { fs.api = false; }); } catch (e) { fs.api = false; } }
  try { (fe || window).focus(); } catch (e) {} fsLayout(); screenDirty = true; update(); return true;
}
function fsCleanup() {
  if (!fs.active) return; fs.active = false; const fe = window.frameElement; document.body.classList.remove('fs-on');
  if (fe) { if (fs.saved === null) fe.removeAttribute('style'); else fe.setAttribute('style', fs.saved); if (fs.saved2[0] === null) fe.removeAttribute('aria-hidden'); else fe.setAttribute('aria-hidden', fs.saved2[0]); if (fs.saved2[1] === null) fe.removeAttribute('tabindex'); else fe.setAttribute('tabindex', fs.saved2[1]); }
  if (modalOpen()) closeModal(); screenDirty = true;
}
function fsExit() { if (!fs.active) return; const d = fsHostDoc(); try { if ((d.fullscreenElement || d.webkitFullscreenElement) && fs.api) { const ex = d.exitFullscreen || d.webkitExitFullscreen; ex && ex.call(d); } } catch (e) {} fsCleanup(); }
const fsToggle = () => fs.active ? fsExit() : fsEnter();
function fsChange() { const d = fsHostDoc(); if (fs.active && fs.api && !(d.fullscreenElement || d.webkitFullscreenElement) && !document.fullscreenElement) fsCleanup(); }
[fsHostDoc(), document].forEach(d => { try { d.addEventListener('fullscreenchange', fsChange); d.addEventListener('webkitfullscreenchange', fsChange); } catch (e) {} });
function fsLayout() { const bar = $('fsbar'); document.documentElement.style.setProperty('--barh', Math.ceil(bar.getBoundingClientRect().height) + 'px'); }
addEventListener('resize', () => { fsLayout(); screenDirty = true; });
function viewPoint(ev) { const r = view.getBoundingClientRect(), k = Math.min(r.width / 1400, r.height / 960), ox = (r.width - 1400 * k) / 2, oy = (r.height - 960 * k) / 2; return [(ev.clientX - r.left - ox) / k, (ev.clientY - r.top - oy) / k]; }
view.addEventListener('pointerdown', ev => { if (modalOpen()) return; const [x, y] = viewPoint(ev); if (x < 0 || y < 0 || x > 1400 || y > 960) return; ev.preventDefault(); screenTap(x, y); });
/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => { if (spinInputBusy()) return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo reels on.' : 'Normal reel speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('fair').onclick = openFair; $('history').onclick = openHistory; $('settings').onclick = openSettings; $('fsExit').onclick = fsExit; $('cats').onclick = openCats; $('pot').onclick = openPot;
$('fsBtn').onclick = fsToggle; $('collect').onclick = () => { if (!state.gamble || busy() || locked()) return; state.gamble = 0; save(); toast('Win kept in your balance.'); sound('click'); update(); }; $('testBtn').onclick = openTest;
$('gHeads').onclick = () => gambleCall('even'); $('gTails').onclick = () => gambleCall('odd');
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); ambient(); save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || modalOpen()) return; if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && pres && pres.bonus === 'vault') pickBind(Number(e.key) - 1); else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') fsToggle(); else if (e.key.toLowerCase() === 'l') enterLab(); else if (e.key === 'Escape') { if (autoLeft) { stopAuto(); status('AUTO-PROWL OFF'); } } });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted) ac.resume().catch(() => {}); });
/* ---------- Frame loop (idle frames capped near 30 fps) ---------- */
let lastHl = -1, lastPoolSize = 0;
function animate(now) {
  if (!pxEngineActive) { requestAnimationFrame(animate); return; }
  requestAnimationFrame(animate); animate.last = now;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  presTick(now);
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || crash || now < winUntil) screenDirty = true;
  const ps = pools.wild.length + pools.chain.length + items.length; if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  const animated = spinning || crash || pres || (dark() && !pres) || now < winUntil;
  if (spinning ? now - lastDraw > 16 : (screenDirty && now - lastDraw >= (animated ? 30 : 0)) || (animated && now - lastDraw >= 33)) { drawScreen(now); lastDraw = now; }
}
/* ---------- Boot ---------- */
function resume() {
  if (lab.on) { lab.on = false; E = E0; lab.real = null; lab.twins = null; }
  state = LAYR.openGame(GAME_ID, E); ensureExtras();
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startPres(feature().type, { resume: true }); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { startPres('free', { resume: true }); status(`${state.free} SAVED PROWL SPINS · ALL WINS 2×`); }
  else if (state.freeActive) { startPres('free', { resume: true }); toStage('summary'); }
}
update(); liveLabel(); drawScreen(0);
loadBundled().then(() => loadTwins()).catch(() => { sources.done = true; if (sources.helper === 'pending') sources.helper = 'unknown'; liveLabel(); });
let started = false;
function go() { if (started) return; started = true; requestAnimationFrame(() => { requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading') && $('loading').remove(), 550); }); }
go(); fsLayout();
/* ---------- Test hooks (play-money build): force each bonus through the real engine path, change the twins state, run an RTP simulation ---------- */
function mulberry32(a) { return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function craftRng(kind) { // pick reel stops that produce the outcome; every other draw (prizes, locks) stays random
  const r = mulberry32(Date.now() & 0xffffffff), pick = n => Math.floor(r() * n);
  for (let k = 0; k < 400000; k++) {
    const stops = E.strips.map(s => pick(s.length)), grid = stops.map((s, c) => BF.windowAt(c, s));
    if (kind === 'jackpot') { const st = E.strips.map((s, c) => { const o = s.map((x, i) => i).filter(i => BF.windowAt(c, i)[1] === 'bitcoin'); return o[pick(o.length)]; }); if (st.every(x => x !== undefined)) return seq(st); continue; }
    const ev = BF.evaluate(grid, state.bet, 1), t = ev.triggers;
    const ok = kind === 'free' ? t.free && !t.vault && !t.chain && !ev.jackpot : kind === 'vault' ? t.vault && !t.free && !t.chain : kind === 'chain' ? t.chain && !t.free && !t.vault && !ev.jackpot : kind === 'gamble' ? (!t.free && !t.vault && !t.chain && ev.total > 0 && !ev.jackpot) : kind === 'win' ? ev.total > 0 : false;
    if (ok) return seq(stops);
  }
  return null;
}
function seq(stops) { let i = 0; return n => i < stops.length ? stops[i++] : BF.randomInt(n); }
function openTest() {
  const B = (k, t, sub) => `<button data-t="${k}"><b>${t}</b><br><small>${sub}</small></button>`;
  showModal('test', lab.on ? 'Bonus lab.' : 'Test tools.', `<p class="fine">${lab.on ? 'Practice play: your own LAYR, saved game, jackpot meters and Holder Pot are not touched, and nothing here is saved. Each button deals a real round through the real engine, then plays the scene.' : 'Play-money test build only. Each button deals a real round through the real engine, then plays the scene.'}</p><div class="test-grid">${B('free', 'Night Prowl', 'three Fak.fun logos')}${B('vault', 'If It Fits', 'three Forever Twin logos')}${B('chain', 'Rooftops', 'five lit windows')}${B('jackpot', 'Ninth Life', 'five gold-frame cats')}${B('gamble', 'Heads or Tails', 'a win, then press GAMBLE')}${B('win', 'Any win', 'a plain line win')}${B('twins:none', 'Twins: none', 'every cat NOT YET FOREVER')}${B('twins:some', 'Twins: some', 'a third are forever')}${B('twins:all', 'Twins: all', 'every cat forever')}${B('power', 'Power up', 'switch the cabinet on')}${B('reduced', 'Reduced motion', 'toggle')}${B('reset', 'Reset balance', 'back to the play balance')}${lab.on ? B('leave', 'Leave the lab', 'back to your real game') : ''}</div>`, lab.on ? 'BONUS LAB' : 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => {
    const k = b.dataset.t; let r = '';
    if (k.startsWith('twins:')) { r = JSON.stringify(TEST.setTwins(k.slice(6))); toast(`Twins set: ${k.slice(6)}`); closeModal(); return; }
    if (k === 'power') { TEST.setPower(true); toast('Cabinet powered on.'); closeModal(); return; }
    if (k === 'reduced') { TEST.setReduced(!state.reduced); toast(state.reduced ? 'Reduced motion on.' : 'Reduced motion off.'); return; }
    if (k === 'leave') { closeModal(); exitLab(); return; }
    if (k === 'reset') { if (lab.on) { state.balance = 10000; state.bet = 100; } else { try { if (window.parent.NL_RESET) window.parent.NL_RESET(); } catch (e) {} state.balance = Math.max(state.balance, 10000); } save(); update(); toast(lab.on ? 'Practice balance reset to 10,000.' : 'Balance topped up.'); closeModal(); return; }
    closeModal(); r = TEST.force(k); if (r !== 'ok') toast(`Could not start: ${r}`);
  });
}

/* ---------- Bonus lab: test every bonus on the live cabinet without touching anything real ---------- */
function enterLab() {
  if (lab.on) { openTest(); return true; }
  if (sessionLock || !LAYR.ready()) { toast('Connect your LAYR account first, then open the Bonus lab.'); return false; }
  if (spinning || pres || feature() || state.free > 0) { toast('Finish the current round first, then open the Bonus lab.'); return false; }
  stopAuto(); closeModal();
  lab.real = state; lab.twins = { helper: sources.helper, twins: sources.twins, flags: items.map(i => [i.forever, i.xtrataId]) };
  const s = BF.fresh(); s.balance = 10000; s.powered = true;
  for (const k of ['muted', 'volume', 'ambient', 'turbo', 'reduced', 'showLines']) s[k] = state[k];
  lab.on = true; state = s; E = BF; ensureExtras();
  screenDirty = true; update(); status('BONUS LAB · PRACTICE PLAY'); toast('Bonus lab: practice LAYR only. Your real balance and game are untouched.');
  openTest(); return true;
}
function exitLab() {
  if (!lab.on) return true;
  if (spinning || pres || feature() || state.free > 0) { toast('Finish or skip the round first, then leave the lab.'); return false; }
  stopAuto(); closeModal();
  const t = lab.twins; items.forEach((it, k) => { if (t.flags[k]) { it.forever = t.flags[k][0]; it.xtrataId = t.flags[k][1]; } }); sources.helper = t.helper; sources.twins = t.twins;
  rebuildPools(); refaceIdle(); liveLabel();
  state = lab.real; E = E0; lab.on = false; lab.real = null; lab.twins = null; lastResult = null;
  ensureExtras(); screenDirty = true; update(); status('BACK TO YOUR REAL GAME'); toast('Left the Bonus lab. Your real game is exactly as you left it.');
  return true;
}
const TEST = {
  force(kind) { if (spinning || pres || feature() || state.free > 0) return 'busy'; if (sessionLock && !lab.on) return 'locked'; if (dark()) state.powered = true; if (state.balance < state.bet) { toast('Reset the test balance first.'); return 'broke'; } const rng = craftRng(kind); if (!rng) return 'no-seed'; spinForced = rng; spin(); return 'ok'; },
  setTwins(mode) { const n = items.length; items.forEach((it, k) => { it.forever = mode === 'all' || (mode === 'some' && k % 3 === 0); it.xtrataId = it.forever ? String(90000 + it.id) : null; }); if (mode === 'none') { sources.helper = 'none'; sources.twins = 0; } else { sources.helper = 'live'; sources.twins = mode === 'all' ? 120 : 37; } rebuildPools(); refaceIdle(); liveLabel(); screenDirty = true; return { mode, forever: items.filter(i => i.forever).length, of: n, helper: sources.helper, twins: sources.twins }; },
  setPower(on) { state.powered = !!on; save(); update(); },
  setReduced(on) { state.reduced = !!on; save(); update(); },
  state: () => JSON.parse(JSON.stringify({ reduced: !!state.reduced, pres: pres && { bonus: pres.bonus, stage: pres.stage }, spinning, dark: dark(), pot: state.pot, balance: state.balance, free: state.free, feature: feature() && feature().type, gamble: state.gamble, helper: sources.helper, twins: sources.twins })),
  sim(n, seed = 1, progress) { return new Promise(res => { const rng = (() => { const r = mulberry32(seed); return m => Math.floor(r() * m); })(); const s = BF.fresh(); s.balance = 1e12; s.bet = 100; let wag = 0, paid = 0, done = 0; const step = () => { const stop = Math.min(n, done + 20000); for (; done < stop; done++) { const free = s.free > 0, b = free ? s.freeBet : s.bet; BF.start(s, rng); if (!free) wag += b; const bal = s.balance; BF.settle(s); let g = 0; while (BF.feature(s) && g++ < 400) { const f = BF.feature(s); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) BF.pick(s, i); } else { while (!BF.featureDone(f)) BF.respin(s); } BF.collect(s); } if (s.freeActive && !s.free) BF.endFree(s); s.balance = Math.min(s.balance, 1e12); s.gamble = 0; } paid = s.paidOut; if (progress) progress(done, n, paid / wag); if (done < n) setTimeout(step, 0); else res({ spins: n, wagered: wag, paidOut: paid, rtp: paid / wag }); }; step(); }); }
};
// Cached cabinets borrow the room's LAYR account; they never own a second wallet.
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
// A canvas-and-controls API. The casino owns all visible 3D rendering and cameras.
const pxSourceElements = new Map(), pxSourceTokens = new WeakMap(); let pxToken = 0;
function pxPort(element) { if (!element) return ''; for (const n of [element, ...element.querySelectorAll('*')]) { if (!pxSourceTokens.has(n)) { const id = String(++pxToken); pxSourceTokens.set(n, id); pxSourceElements.set(id, n); } n.setAttribute('data-px-source', pxSourceTokens.get(n)); } return element.outerHTML; }
function pxControl(action) {
  const clicks = { sound: 'sound', turbo: 'turbo', max: 'maxBet', gamble: 'gamble' };
  if (action === 'spin') spinClick(); else if (action === 'betDown') changeBet(-1); else if (action === 'betUp') changeBet(1); else if (action === 'auto') autoClick();
  else if (action === 'pays') openRules(); else if (action === 'fair') openFair(); else if (action === 'fullscreen') fsToggle();
  else if (action === 'settings') openSettings(); else if (action === 'history') openHistory(); else if (action === 'account') openAccount();
  else if (clicks[action]) document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE = {
  screen, revision: () => rev,
  refreshAccount() { screenDirty = true; update(); drawScreen(performance.now()); },
  mechanics() { return { lever: leverStart > 0 ? { id: leverStart, elapsed: Math.max(0, performance.now() - leverStart), duration: 900, angle: 1.02 } : null, spinZ: null, armZ: null, bonus: pres ? { kind: pres.bonus, stage: pres.stage } : null, dark: dark() }; },
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
  fullscreen: { enter: fsEnter, exit: fsExit, toggle: fsToggle, active: () => fs.active, addBarButton(label, sub, fn) { const b = document.createElement('button'); b.className = 'fb'; b.innerHTML = `<b>${esc(label)}</b><i>${esc(sub)}</i>`; b.onclick = fn; $('extra').appendChild(b); fsLayout(); return b; } },
  test: TESTBUILD ? TEST : undefined,
  ui() { const modal = $('modal'), bar = $('featureBar'), bet = state.free ? state.freeBet : state.bet, g = $('gamble'); return { balance: state.balance, bet, win: state.lastWin, spins: state.spins, spinning, button: $('spinText')?.textContent || 'POUNCE', spinDisabled: $('spin').disabled, betDownDisabled: $('minus')?.disabled, betUpDisabled: $('plus')?.disabled, gamble: g && !g.hidden ? g.textContent : '', status: $('status')?.textContent || '', turbo: !!state.turbo, auto: autoLeft > 0, muted: !!state.muted, modal: modal?.open ? pxPort(modal) : '', feature: bar && !bar.hidden ? pxPort(bar) : '' }; }
};
window.NineLives = Object.freeze({ version: '1.0.0', holderLayerStubs: HolderLayerStubs, machine: 'nine-lives', sources: () => ({ ...sources }), pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])), snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock, pres: pres && { bonus: pres.bonus, stage: pres.stage } })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes }, soundLog: () => soundLog.map(e => ({ ...e })) });
})();
