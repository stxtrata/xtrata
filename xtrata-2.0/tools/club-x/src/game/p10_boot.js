
/* ---------- Fullscreen: the game screen fills the view; every control except the lever sits on the bottom bar ---------- */
const view = $('view'), vg = view.getContext('2d'), fs = { active: false, api: false, saved: null, saved2: null };
function fsBlit() { if (!fs.active && window.parent !== window) return; vg.drawImage(screen, 0, 0, 1400, 960); }
const fsHostDoc = () => { try { return window.parent.document; } catch (e) { return document; } };
function fsEnter() {
  if (fs.active) return true; const fe = window.frameElement;
  if (fe) { fs.saved = fe.getAttribute('style'); fs.saved2 = [fe.getAttribute('aria-hidden'), fe.getAttribute('tabindex')]; const set = (k, v) => fe.style.setProperty(k, v, 'important'); [['position', 'fixed'], ['left', '0'], ['top', '0'], ['right', '0'], ['bottom', '0'], ['width', '100vw'], ['height', '100%'], ['max-width', 'none'], ['max-height', 'none'], ['display', 'block'], ['visibility', 'visible'], ['opacity', '1'], ['pointer-events', 'auto'], ['z-index', '2147483000'], ['border', '0'], ['transform', 'none'], ['background', '#0b0c0e']].forEach(([k, v]) => set(k, v)); fe.removeAttribute('aria-hidden'); fe.setAttribute('tabindex', '0'); }
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
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('fair').onclick = openFair; $('history').onclick = openHistory; $('settings').onclick = openSettings; $('fsExit').onclick = fsExit; $('records').onclick = openRecords; $('pot').onclick = openPot;
$('fsBtn').onclick = fsToggle; $('collect').onclick = () => { if (!state.gamble || busy() || locked()) return; state.gamble = 0; save(); toast('Win kept in your balance.'); sound('click'); update(); }; $('testBtn').onclick = openTest; $('labBtn').onclick = () => enterLab();
$('gYes').onclick = () => gambleCall('even'); $('gNo').onclick = () => gambleCall('odd');
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); ambient(); save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
$('vol').oninput = e => { state.volume = Number(e.target.value); if (state.muted && state.volume > 0) state.muted = false; audioInit(); save(); update(); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select')) return; if (e.key === 'Escape') { if (modalOpen()) return; if (autoLeft) { stopAuto(); status('AUTO-DJ OFF'); } return; } if (modalOpen()) return; if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && pres && pres.bonus === 'vault') pickBind(Number(e.key) - 1); else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') fsToggle(); else if (e.key.toLowerCase() === 'l' && (LAB_ALLOWED || lab.on)) enterLab(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else { if (ac && !state.muted) ac.resume().catch(() => {}); } });
/* ---------- Frame loop (idle frames capped near 30 fps) ---------- */
let lastHl = -1, lastTopper = 0, drawCost = 8;
function animate(now) {
  if (!pxEngineActive) { requestAnimationFrame(animate); return; }
  requestAnimationFrame(animate); animate.last = now;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  presTick(now);
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || now < winUntil) screenDirty = true;
  const animated = spinning || pres || now < winUntil, ticker = !reduced(); // the block ticker scrolls at a gentle 20 fps when idle
  // Adaptive pacing: never spend more than about half the time drawing, so a slow device (or a software renderer) still
  // answers taps, timers and the host between frames. On a GPU-backed canvas a frame costs a few ms and this changes nothing.
  const slack = drawCost * 1.2;
  if (spinning ? now - lastDraw > Math.max(16, slack) : (screenDirty && now - lastDraw >= Math.max(animated ? 30 : 0, slack)) || (animated && now - lastDraw >= Math.max(33, slack)) || (ticker && now - lastDraw >= Math.max(50, slack * 1.5))) { const a = performance.now(); drawScreen(now); drawCost = drawCost * .8 + (performance.now() - a) * .2; lastDraw = performance.now(); }
  else if (topperBusy(now) ? now - lastTopper > Math.max(33, slack) : now - lastTopper > 1000) { drawTopper(now); lastTopper = now; }
}
/* ---------- Boot ---------- */
function resume() {
  if (lab.on) { lab.on = false; E = E0; lab.real = null; }
  state = LAYR.openGame(GAME_ID, E); ensureExtras(); refaceIdle();
  // A spin whose result was committed before a reload is settled exactly once: never rerolled, never paid twice.
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startPres(feature().type, { resume: true }); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { startPres('free', { resume: true }); status(`${state.free} SAVED FREE SPINS · ALL WINS 2×`); }
  else if (state.freeActive) { startPres('free', { resume: true }); toStage('summary'); }
}
update(); liveLabel(); drawScreen(0); drawTopper(0);
loadPool().catch(() => { sources.done = true; if (sources.registry === 'pending') sources.registry = 'unreachable'; liveLabel(); });
let started = false;
function go() { if (started) return; started = true; requestAnimationFrame(() => { requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading') && $('loading').remove(), 550); }); }
go(); fsLayout();

/* ---------- Bonus Lab: select any bonus round or special event, choose the bet, and run it through the full presentation ---------- */
function mulberry32(a) { return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const LAB_ITEMS = [
  ['free', 'Peak Time', 'free spins: three Midnight doors'], ['free_re', 'Peak Time + retrigger', 'a second trigger inside: +4 spins'],
  ['vault', 'The Guest List', 'pick bonus: three wristbands, open three names'], ['chain', 'X Marks the Spot', 'hold and respin: five tags on the map'],
  ['chain_full', 'X Marks the Spot: full map', 'all 15 spots, then Number One'], ['jackpot', 'Number One jackpot', 'five This Is Number One pieces on the centre row'],
  ['gamble_win', 'Lights Up or Down \u00b7 win', 'a paid win, then the switch lands for you'], ['gamble_lose', 'Lights Up or Down \u00b7 loss', 'a paid win, then the switch lands against you'],
  ['scatter3', 'Scatter pay \u00b7 3 doors', '2\u00d7 total bet, then Peak Time'], ['scatter4', 'Scatter pay \u00b7 4 doors', '5\u00d7 total bet, then Peak Time'], ['scatter5', 'Scatter pay \u00b7 5 doors', '10\u00d7 total bet, then Peak Time'],
  ['potclose', 'Last Orders', 'the week closes: 10% to the cause, the rest per twin']
];
const labRand = () => (lab.seedRng || Math.random)();
const stopsWhere = (c, pred) => E.strips[c].map((_, i) => i).filter(i => pred(BF.windowAt(c, i)));
function shuffled(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(labRand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// Choose reel stops that land the wanted symbols, then hand the engine a scripted rng: those stops first, every other draw from the
// Lab's seeded generator. The engine itself is never edited, duplicated or bypassed.
function craftStops(kind) {
  const pickA = a => a[Math.floor(labRand() * a.length)], has = (w, s) => w.includes(s), bet = state.free ? state.freeBet : state.bet;
  const sc = kind.startsWith('scatter') ? Number(kind.slice(7)) : (kind === 'free' ? 3 : 0);
  for (let k = 0; k < 6000; k++) {
    let stops;
    if (kind === 'jackpot') stops = [0, 1, 2, 3, 4].map(c => pickA(stopsWhere(c, w => w[1] === 'bitcoin')));
    else if (sc) { const reels = shuffled([0, 1, 2, 3, 4]).slice(0, sc); stops = [0, 1, 2, 3, 4].map(c => pickA(stopsWhere(c, w => reels.includes(c) === has(w, 'scatter')))); }
    else if (kind === 'vault') { const reels = shuffled([0, 1, 2, 3, 4]).slice(0, 3); stops = [0, 1, 2, 3, 4].map(c => pickA(stopsWhere(c, w => reels.includes(c) === has(w, 'vault')))); }
    else if (kind === 'chain' || kind === 'chain_full') stops = [0, 1, 2, 3, 4].map(c => pickA(stopsWhere(c, w => has(w, 'chain'))));
    else stops = E.strips.map(s => Math.floor(labRand() * s.length));
    const grid = stops.map((s, c) => BF.windowAt(c, s)), ev = BF.evaluate(grid, bet, 1), t = ev.triggers, none = !t.free && !t.vault && !t.chain && !ev.jackpot;
    const ok = sc ? t.free && ev.scatters === sc && !t.vault && !t.chain && !ev.jackpot : kind === 'vault' ? t.vault && !t.free && !t.chain && !ev.jackpot : (kind === 'chain' || kind === 'chain_full') ? t.chain && !t.free && !t.vault && !ev.jackpot : kind === 'jackpot' ? ev.jackpot && !t.free && !t.vault && !t.chain : kind === 'gamble' || kind === 'win' ? none && ev.total > 0 : false;
    if (ok) return stops;
  }
  return null;
}
function craftRng(kind) {
  const stops = craftStops(kind); if (!stops) return null; let i = 0; const full = kind === 'chain_full';
  return n => { if (i < 5) return stops[i++]; if (full && n === E.CHAIN_ODDS) return labRand() < .45 ? 0 : 1 + Math.floor(labRand() * (n - 1)); return Math.floor(labRand() * n); };
}
// The coin's parity is scripted so the flip lands the way the Lab item asks; everything else is the engine's own gamble.
function gambleRng(choice) { let first = true; const odd = lab.gambleWant === 'win' ? choice === 'odd' : choice !== 'odd'; return n => { if (first && n === 2) { first = false; return odd ? 1 : 0; } return Math.floor(labRand() * n); }; }
function enterLab() {
  if (!(LAB_ALLOWED || lab.on)) return false;
  if (lab.on) { openLab(); return true; }
  if (spinning || pres || feature() || state.free > 0) { toast('Finish the current round first, then open the Bonus Lab.'); return false; }
  stopAuto(); closeModal();
  lab.real = state; const s = BF.fresh(); s.balance = 10000; s.bet = state.bet;
  for (const k of ['muted', 'volume', 'ambient', 'turbo', 'reduced', 'showLines']) s[k] = state[k];
  lab.on = true; state = s; E = BF; ensureExtras(); refaceIdle(); lastResult = null;
  screenDirty = true; update(); status('BONUS LAB · PRACTICE PLAY'); toast('Bonus Lab: practice LAYR only. Your real balance, meters and pot are untouched.');
  openLab(); return true;
}
function exitLab() {
  if (!lab.on) return true;
  if (spinning || pres || feature() || state.free > 0) { toast('Finish or skip the round first, then leave the Lab.'); return false; }
  stopAuto(); closeModal(); lab.runAll = null; lab.autoplay = false; lab.queue = []; lab.gambleWant = null; lab.item = null;
  state = lab.real; E = E0; lab.on = false; lab.real = null; lastResult = null; refaceIdle();
  ensureExtras(); screenDirty = true; update(); status('BACK TO YOUR REAL RIG'); toast('Left the Bonus Lab. Your real game is exactly as you left it.');
  return true;
}
function openLab() {
  const last = lab.last, seedNow = last ? last.seed : 1021;
  const list = LAB_ITEMS.map(([k, t, sub]) => `<label class="lab-item"><input type="radio" name="labItem" value="${k}" ${(last ? last.item : 'free') === k ? 'checked' : ''}><span><b>${esc(t)}</b><small>${esc(sub)}</small></span></label>`).join('');
  showModal('lab', 'Bonus Lab.', `<p class="fine">Practice LAYR (${fmt(state.balance)}). Each run deals a real round through the engine's own start(), with reel stops chosen to land the item, then plays the full presentation. Nothing touches your LAYR account, the jackpot meters, the Holder Pot or the RTP statistics; rounds are marked LAB in History.</p>
  <div class="lab-list">${list}</div>
  <div class="lab-row"><label>Bet <select id="labBet">${bets.map(b => `<option value="${b}" ${b === state.bet ? 'selected' : ''}>${b} LAYR</option>`).join('')}</select></label>
  <label>Mode <select id="labMode"><option value="seeded" ${!last || last.mode === 'seeded' ? 'selected' : ''}>Seeded</option><option value="random" ${last && last.mode === 'random' ? 'selected' : ''}>Random</option></select></label>
  <label>Seed <input id="labSeed" type="number" value="${seedNow}" min="1" step="1"></label><label class="chk"><input type="checkbox" id="labAuto" ${lab.autoplayPref ? 'checked' : ''}> Auto-advance</label></div>
  <button class="cta" id="labRun">Run</button><button class="outline" id="labReplay" ${last ? '' : 'disabled'}>Replay last${last ? ` (${esc(last.item)} · seed ${last.seed})` : ''}</button><button class="outline" id="labAll">Run all</button><button class="outline" id="labHistory">Lab history</button><button class="outline" id="labLeave">Leave the Lab</button>`, 'BONUS LAB');
  const read = () => { const mode = $('labMode').value, seed = mode === 'seeded' ? Math.max(1, Number($('labSeed').value) || 1) : (Math.random() * 2 ** 31) >>> 0; lab.autoplayPref = $('labAuto').checked; return { item: (document.querySelector('input[name=labItem]:checked') || {}).value || 'free', bet: Number($('labBet').value), mode, seed, auto: lab.autoplayPref }; };
  $('labRun').onclick = () => { const o = read(); closeModal(); labRun(o); };
  $('labReplay').onclick = () => { if (!lab.last) return; closeModal(); labRun({ ...lab.last }); };
  $('labAll').onclick = () => { const o = read(); closeModal(); lab.runAll = { items: LAB_ITEMS.map(x => x[0]), i: 0, bet: o.bet, seed: o.seed, mode: o.mode }; labRun({ item: lab.runAll.items[0], bet: o.bet, mode: o.mode, seed: o.seed, auto: true }); };
  $('labHistory').onclick = openHistory; $('labLeave').onclick = () => { closeModal(); exitLab(); };
}
function labRun(o) {
  if (!lab.on && !enterLab()) return 'no-lab';
  if (spinning || pres || feature() || state.free > 0) { toast('The Lab is busy: finish or skip the current round.'); return 'busy'; }
  lab.last = { item: o.item, bet: o.bet, mode: o.mode, seed: o.seed, auto: !!o.auto }; lab.item = (LAB_ITEMS.find(x => x[0] === o.item) || [0, o.item])[1];
  lab.seedRng = mulberry32(o.seed >>> 0); lab.autoplay = !!o.auto; lab.queue = []; lab.gambleWant = null;
  if (bets.includes(o.bet)) state.bet = o.bet; if (state.balance < state.bet * 2) state.balance = 10000; update();
  const k = o.item;
  if (k === 'potclose') { const tw = Number.isFinite(sources.twins) && sources.twins > 0 ? sources.twins : null, pot = state.pot > 0 ? state.pot : r2(state.bet * 120 * POT_RATE); startPres('potclose', { key: periodKey(), pot, twins: tw }); return 'ok'; }
  if (k === 'free') lab.queue = ['free']; else if (k === 'free_re') lab.queue = ['free', 'free']; else if (k === 'gamble_win' || k === 'gamble_lose') { lab.queue = ['gamble']; lab.gambleWant = k === 'gamble_win' ? 'win' : 'lose'; } else lab.queue = [k];
  if (!craftStops(lab.queue[0])) { toast('Could not find reel stops for that item.'); lab.queue = []; return 'no-stops'; }
  status(`BONUS LAB · ${lab.item.toUpperCase()} · SEED ${o.seed}`); spin(); return 'ok';
}
// Auto-advance (Run all, or the Auto-advance box): presses the buttons a player would press, on a timer.
function labAutoStep(p, t) {
  if (p.stage === 'intro' && t > 1000) { if (p.bonus === 'gamble') gambleCall('even'); else if (p.bonus !== 'jackpot') presStart(); }
  else if (p.stage === 'play' && p.bonus === 'vault') { const f = feature(); if (f && f.picks.length < 3 && t > 1000 * (f.picks.length + 1)) { const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); pickBind(open[Math.floor(Math.random() * open.length)]); } }
  else if (p.stage === 'play' && p.bonus === 'chain') { const f = feature(); if (f && !E.featureDone(f) && !tagBusy() && performance.now() - Math.max(p.lastAuto || 0, p.anim ? p.anim.end : 0) > 450) { p.lastAuto = performance.now(); featureAction(); } }
  else if (p.stage === 'summary' && t > 1800) presCollect();
}
function labIdle() {
  if (!lab.on || spinning || pres || feature() || state.free > 0) return;
  if (state.gamble > 0 && lab.gambleWant) return;
  lab.gambleWant = null; lab.queue = [];
  const ra = lab.runAll;
  if (ra) { ra.i++; if (ra.i < ra.items.length) { setTimeout(() => { if (lab.runAll === ra && !pres && !spinning) labRun({ item: ra.items[ra.i], bet: ra.bet, mode: ra.mode, seed: ra.seed + ra.i, auto: true }); }, 900); } else { lab.runAll = null; lab.autoplay = false; lab.item = null; toast(`Run all complete: ${ra.items.length} items played.`); status('BONUS LAB · RUN ALL COMPLETE'); } }
  else { lab.autoplay = false; }
}
/* ---------- Test panel (standalone test page only) ---------- */
function openTest() {
  if (!TESTBUILD) return;
  const B = (k, t, sub) => `<button data-t="${k}"><b>${t}</b><br><small>${sub}</small></button>`;
  showModal('test', 'Test tools.', `<p class="fine">Play-money test page only. Bonuses run in the Bonus Lab on its own practice balance.</p><div class="test-grid">${B('lab', 'Bonus Lab', 'pick any bonus')}${B('twins:none', 'Twins: none', 'every work NOT YET FOREVER')}${B('twins:some', 'Twins: some', 'half the works forevered')}${B('twins:all', 'Twins: all', 'every work forevered, full colour')}${B('twins:live', 'Twins: live', 'back to the live register')}${B('week:close', 'Week: close now', 'run Last Orders on the pot')}${B('reduced', 'Reduced motion', 'toggle')}${B('reset', 'Reset balance', 'back to the play balance')}${B('sim', 'RTP sim', '1,000,000 seeded spins')}</div><pre id="testOut" class="hash">Ready.</pre>`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = async () => {
    const k = b.dataset.t, out = s => { const el = $('testOut'); if (el) el.textContent = typeof s === 'string' ? s : JSON.stringify(s); };
    if (k === 'lab') { closeModal(); enterLab(); return; }
    if (k.startsWith('twins:')) { out(TEST.setTwins(k.slice(6))); return; }
    if (k === 'week:close') { closeModal(); TEST.lab('potclose'); return; }
    if (k === 'reduced') { TEST.setReduced(!state.reduced); out('Reduced motion ' + (state.reduced ? 'on' : 'off')); return; }
    if (k === 'reset') { try { if (window.parent.CLUBX_RESET) window.parent.CLUBX_RESET(); } catch (e) {} out('Balance reset: reload the page to reconnect.'); return; }
    if (k === 'sim') { out('Running…'); const r = await TEST.sim(1e6, 1, (d, n, rtp) => out(`${fmt(d)} / ${fmt(n)} · ${(rtp * 100).toFixed(3)}%`)); out(`${fmt(r.spins)} spins · RTP ${(r.rtp * 100).toFixed(3)}% (design 94.38%)`); }
  });
}
const TEST = {
  // the cells each reel comes to rest on (top row first, read from its own animation) and the settled grid, to check they agree
  reels: () => ({ spinning, landed: spinning && animations.every(a => performance.now() - a.start >= a.land + a.bounce * .98), resting: animations.length ? animations.map(a => [a.travel + 2, a.travel + 1, a.travel].map(i => a.sequence[i])) : null, grid: state.grid.map((col, c) => col.map((s, r) => [s, faces[c][r]])) }),
  lab: (item, opts = {}) => { if (!lab.on && !enterLab()) return 'no-lab'; closeModal(); return labRun({ item, bet: opts.bet || state.bet, mode: 'seeded', seed: opts.seed || 1021, auto: !!opts.auto }); },
  labItems: () => LAB_ITEMS.map(x => [x[0], x[1]]),
  enterLab, exitLab, runAll(bet = 100, seed = 7) { if (!lab.on) enterLab(); closeModal(); lab.runAll = { items: LAB_ITEMS.map(x => x[0]), i: 0, bet, seed, mode: 'seeded' }; return labRun({ item: lab.runAll.items[0], bet, mode: 'seeded', seed, auto: true }); },
  setTwins(mode) {
    if (mode === 'live') { sources.test = null; sources.registry = 'pending'; loadPool(); return { mode }; }
    const T = { none: [0, 0, 0], some: [5, 12, 0], all: [9, 50, 1] }[mode] || [];
    const names = ['BrandX', 'XLove', 'This Is Number One'];
    sources.test = mode; sources.registry = 'live'; sources.noHelper = false; sources.collections = names.map((n, i) => ({ name: n + ' (test)', twins: T[i] })); sources.unknown = 0; sources.twins = T.reduce((a, b) => a + b, 0); refreshArtTiles(); liveLabel(); screenDirty = true; return { mode, twins: sources.twins };
  },
  setReduced(on) { state.reduced = !!on; save(); update(); },
  tiles: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(e => e.tile.toDataURL())])),
  mockTile: async (label, url, bg = '#0b0c0e') => { const im = await loadImage(url), t = tile(label, '#ffffff', '', g => { g.fillStyle = bg; g.fillRect(12, 44, 216, 182); const iw = im.naturalWidth, ih = im.naturalHeight, k = Math.min(216 / iw, 182 / ih); g.drawImage(im, 12 + (216 - iw * k) / 2, 44 + (182 - ih * k) / 2, iw * k, ih * k); }, 7); return t.toDataURL(); },
  render(dt = 1500) { screenDirty = true; drawScreen(pres ? pres.t0 + dt : performance.now()); return !!pres; },
  step() { if (pres) labAutoStep(pres, 999999); return pres ? pres.bonus + ':' + pres.stage : null; },
  state: () => JSON.parse(JSON.stringify({ reduced: !!state.reduced, lab: lab.on, labItem: lab.item, runAll: lab.runAll && lab.runAll.i, pres: pres && { bonus: pres.bonus, stage: pres.stage }, spinning, grid: state.grid, queue: lab.queue.slice(), spinForcedSet: !!spinForced, pot: state.pot, potKey: state.potKey, balance: state.balance, free: state.free, feature: feature() && feature().type, gamble: state.gamble, twins: sources.twins, art: { loaded: art.loaded, failed: art.failed, tokens: art.tokens.length }, week: periodKey(), history: state.history.slice(0, 3).map(h => ({ kind: h.kind, lab: !!h.lab, win: h.win, feat: h.feature })), nfeat: state.features.length })),
  sim(n, seed = 1, progress) { return new Promise(res => { const rng = (() => { const r = mulberry32(seed); return m => Math.floor(r() * m); })(); const s = BF.fresh(); s.balance = 1e12; s.bet = 100; let wag = 0, paid = 0, done = 0; const step = () => { const stop = Math.min(n, done + 20000); for (; done < stop; done++) { const free = s.free > 0, b = free ? s.freeBet : s.bet; BF.start(s, rng); if (!free) wag += b; BF.settle(s); let g = 0; while (BF.feature(s) && g++ < 400) { const f = BF.feature(s); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) BF.pick(s, i); } else { while (!BF.featureDone(f)) BF.respin(s); } BF.collect(s); } if (s.freeActive && !s.free) BF.endFree(s); s.balance = Math.min(s.balance, 1e12); s.gamble = 0; } paid = s.paidOut; if (progress) progress(done, n, paid / wag); if (done < n) setTimeout(step, 0); else res({ spins: n, wagered: wag, paidOut: paid, rtp: paid / wag }); }; step(); }); }
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
  else if (action === 'settings') openSettings(); else if (action === 'history') openHistory(); else if (action === 'account') openAccount(); else if (action === 'lab') enterLab(); else if (action === 'records') openRecords(); else if (action === 'pot') openPot();
  else if (clicks[action]) document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE = {
  screen, revision: () => rev,
  // The topper marquee (the Holder Pot on split flaps, the week and last week's pay per twin): a second live canvas the host may map onto
  // the cabinet part named flapBoard. The room can ignore it; the baked marquee then reads "CLUB X · DOORS AT MIDNIGHT · FOLLOW THE X".
  topper, topperRevision: () => topperRev,
  refreshAccount() { screenDirty = true; update(); drawScreen(performance.now()); },
  mechanics() { const now = performance.now(); return { lever: leverStart > 0 ? { id: leverStart, elapsed: Math.max(0, now - leverStart), duration: 900, angle: 1.02 } : null, spinZ: null, armZ: null, bonus: pres ? { kind: pres.bonus, stage: pres.stage } : null, dark: false, win: now < winUntil, leds: spinning ? .6 + .4 * Math.abs(Math.sin(now / 90)) : Math.max(0, 1 - (now - ledPulse) / 1500), jackpot: !!(pres && pres.bonus === 'jackpot'), lab: lab.on, week: periodKey(), pot: state.pot }; },
  async activate() { const epoch = pxSessionEpoch, ready = await pxClaimSession(); if (epoch !== pxSessionEpoch) throw new Error('Connection was cancelled. Reconnect to play.'); if (!ready) throw new Error(LAYR.error() || 'The LAYR account is unavailable. Close the other casino tab, then reconnect.'); pxEngineActive = true; animate.last = performance.now(); startLive(); screenDirty = true; update(); drawScreen(performance.now()); },
  deactivate() { if (spinning || pres) return false; if (lab.on && !exitLab()) return false; stopAuto(); if (fs.active) fsExit(); if (pxEngineActive) save(); pxEngineActive = false; clearInterval(liveTimer); if (ac) ac.suspend().catch(() => {}); pxReleaseLease(); return true; },
  action(name) { if (pxEngineActive) pxControl(name); },
  stopAuto() { stopAuto(); },
  tap(x, y) { screenTap(x, y); },
  key(code, key) { document.body.dispatchEvent(new KeyboardEvent('keydown', { code, key, bubbles: true })); },
  closeModal() { closeModal(); },
  click(token) { const el = pxSourceElements.get(token); if (el) el.click(); },
  input(token, value, checked, event) { const el = pxSourceElements.get(token); if (!el) return; if ('value' in el) el.value = value; if ('checked' in el) el.checked = checked; el.dispatchEvent(new Event(event, { bubbles: true })); },
  // Fullscreen belongs to the game: the room's own Full screen button should call fullscreen.toggle() for this machine.
  fullscreen: { enter: fsEnter, exit: fsExit, toggle: fsToggle, active: () => fs.active, addBarButton(label, sub, fn) { const b = document.createElement('button'); b.className = 'deck'; b.innerHTML = `<b>${esc(label)}</b><i>${esc(sub)}</i>`; b.onclick = fn; $('extra').appendChild(b); fsLayout(); return b; } },
  test: TESTBUILD ? TEST : undefined,
  ui() { const modal = $('modal'), bar = $('featureBar'), bet = state.free ? state.freeBet : state.bet, g = $('gamble'); return { balance: state.balance, bet, win: state.lastWin, spins: state.spins, spinning, lab: lab.on, button: $('spinText')?.textContent || 'DROP', spinDisabled: $('spin').disabled, betDownDisabled: $('minus')?.disabled, betUpDisabled: $('plus')?.disabled, gamble: g && !g.hidden ? g.textContent : '', status: $('status')?.textContent || '', turbo: !!state.turbo, auto: autoLeft > 0, muted: !!state.muted, modal: modal?.open ? pxPort(modal) : '', feature: bar && !bar.hidden ? pxPort(bar) : '' }; }
};
window.ClubX = Object.freeze({ version: '1.0.0', holderLayerStubs: HolderLayerStubs, machine: GAME_ID, sources: () => ({ ...sources, forever: [...sources.forever] }), art: () => art.tokens.map(t => ({ key: t.key, state: t.state, name: artName(t), forever: isForever(t) })), pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])), snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock, lab: lab.on, pres: pres && { bonus: pres.bonus, stage: pres.stage } })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes }, soundLog: () => soundLog.map(e => ({ ...e })) });
})();
