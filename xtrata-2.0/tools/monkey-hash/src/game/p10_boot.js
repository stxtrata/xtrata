
/* ---------- Fullscreen: the game screen fills the view; every control except the lever sits on the bottom bar ---------- */
const view = $('view'), vg = view.getContext('2d'), fs = { active: false, api: false, saved: null, saved2: null };
function fsBlit() { if (!fs.active && window.parent !== window) return; vg.drawImage(screen, 0, 0, 1400, 960); }
const fsHostDoc = () => { try { return window.parent.document; } catch (e) { return document; } };
function fsEnter() {
  if (fs.active) return true; const fe = window.frameElement, doc = fsHostDoc();
  if (fe) { fs.saved = fe.getAttribute('style'); fs.saved2 = [fe.getAttribute('aria-hidden'), fe.getAttribute('tabindex')]; const set = (k, v) => fe.style.setProperty(k, v, 'important'); [['position', 'fixed'], ['left', '0'], ['top', '0'], ['right', '0'], ['bottom', '0'], ['width', '100vw'], ['height', '100%'], ['max-width', 'none'], ['max-height', 'none'], ['display', 'block'], ['visibility', 'visible'], ['opacity', '1'], ['pointer-events', 'auto'], ['z-index', '2147483000'], ['border', '0'], ['transform', 'none'], ['background', '#04120a']].forEach(([k, v]) => set(k, v)); fe.removeAttribute('aria-hidden'); fe.setAttribute('tabindex', '0'); }
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
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('fair').onclick = openFair; $('history').onclick = openHistory; $('settings').onclick = openSettings; $('fsExit').onclick = fsExit; $('monkeys').onclick = openMonkeys; $('pot').onclick = openPot;
$('fsBtn').onclick = fsToggle; $('collect').onclick = () => { if (!state.gamble || busy() || locked()) return; state.gamble = 0; save(); toast('Win kept in your balance.'); sound('click'); update(); }; $('testBtn').onclick = openTest; $('labBtn').onclick = enterLab;
$('gLeft').onclick = () => gambleCall('even'); $('gRight').onclick = () => gambleCall('odd');
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); ambient(); save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || modalOpen()) return; if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && pres && pres.bonus === 'vault') pickBind(Number(e.key) - 1); else if (e.key.toLowerCase() === 'm') $('sound').click(); else if (e.key.toLowerCase() === 'f') fsToggle(); else if (e.key.toLowerCase() === 'l' && (TESTBUILD || LABFLAG || lab.on)) enterLab(); else if (e.key === 'Escape') { if (autoLeft) { stopAuto(); status('AUTO-SWING OFF'); } } });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted) ac.resume().catch(() => {}); });
/* ---------- Frame loop (idle frames capped near 30 fps) ---------- */
let lastHl = -1, lastPoolSize = 0;
function animate(now) {
  if (!pxEngineActive) { requestAnimationFrame(animate); return; }
  requestAnimationFrame(animate); animate.last = now;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  presTick(now); labTick(now);
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || crash || now < winUntil) screenDirty = true;
  const ps = pools.wild.length + pools.chain.length + items.length; if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  const animated = spinning || crash || pres || now < winUntil;
  if (spinning ? now - lastDraw > 16 : (screenDirty && now - lastDraw >= (animated ? 30 : 0)) || (animated && now - lastDraw >= 33)) { drawScreen(now); lastDraw = now; }
}
/* ---------- Boot ---------- */
function resume() {
  if (lab.on) { lab.on = false; E = E0; lab.real = null; lab.twins = null; }
  state = LAYR.openGame(GAME_ID, E); ensureExtras();
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startPres(feature().type, { resume: true }); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { startPres('free', { resume: true }); status(`${state.free} SAVED DRUM SPINS · ALL WINS 2×`); }
  else if (state.freeActive) { startPres('free', { resume: true }); toStage('summary'); }
}
update(); liveLabel(); drawScreen(0);
loadBundled().then(() => loadTwins()).catch(() => { sources.done = true; if (sources.helper === 'pending') sources.helper = 'unknown'; liveLabel(); });
let started = false;
function go() { if (started) return; started = true; requestAnimationFrame(() => { requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading') && $('loading').remove(), 550); }); }
go(); fsLayout();
/* ---------- Test hooks and the Bonus Lab. Every forced round goes through the engine's own start(state, rng): the rng is only a script of reel stops (and, for hold & respin, locks). ---------- */
function mulberry32(a) { return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hashSeed = v => { const s = String(v == null ? '' : v).trim(); if (/^\d+$/.test(s)) return Number(s) >>> 0; let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
// What each lab item needs from the reels. 'conds' tests an evaluated grid; 'scat' asks for an exact scatter count; 'script' tweaks later engine draws.
const LAB_ITEMS = [
  { id: 'free', group: 'Jungle Drums', t: 'Jungle Drums', sub: 'three logos, free spins at 2×', kind: 'free', stages: true },
  { id: 'retrig', group: 'Jungle Drums', t: 'Drums retrigger', sub: 'more logos inside the free spins', kind: 'free', retrig: true, stages: true },
  { id: 'vault', group: 'Monkey Store', t: 'Monkey Store', sub: 'nine crates, open three', kind: 'vault', stages: true },
  { id: 'chain', group: 'Forever Vines', t: 'Forever Vines', sub: 'hold and respin', kind: 'chain', stages: true },
  { id: 'chainFull', group: 'Forever Vines', t: 'Vines: full grid', sub: 'all 15 lit, wins the Block Reward', kind: 'chain', lockAll: true, stages: true },
  { id: 'jackpot', group: 'Block Reward', t: 'Block Reward', sub: 'five gold frames on the centre row', kind: 'jackpot', stages: true },
  { id: 'gambleWin', group: 'Left Vine or Right Vine', t: 'Gamble: win', sub: 'a win, then call it right', kind: 'gamble', outcome: 'win', stages: true },
  { id: 'gambleLoss', group: 'Left Vine or Right Vine', t: 'Gamble: loss', sub: 'a win, then call it wrong', kind: 'gamble', outcome: 'loss', stages: true },
  { id: 'scatter3', group: 'Scatter pays', t: 'Scatters ×3', sub: 'pays 2× bet, starts the drums', kind: 'scatter', n: 3, stages: true },
  { id: 'scatter4', group: 'Scatter pays', t: 'Scatters ×4', sub: 'pays 5× bet, starts the drums', kind: 'scatter', n: 4, stages: true },
  { id: 'scatter5', group: 'Scatter pays', t: 'Scatters ×5', sub: 'pays 10× bet, starts the drums', kind: 'scatter', n: 5, stages: true },
  { id: 'wild', group: 'Monkey Hash events', t: 'Idol Monkey wild', sub: 'a line win carried by the wild', kind: 'wild' },
  { id: 'cameo', group: 'Monkey Hash events', t: 'Twin cameo', sub: 'twins: all, a twin on a winning line', kind: 'cameo', twins: 'all' },
  { id: 'nyf', group: 'Monkey Hash events', t: 'NOT YET FOREVER', sub: 'twins: none, a monkey on a winning line', kind: 'cameo', twins: 'none' },
  { id: 'potroll', group: 'Monkey Hash events', t: 'Holder Pot new week', sub: 'weekly pot rolls over, share per twin', kind: 'potroll' }
];
function craftRng(kind, seed, item = {}) { // returns an rng for BF.start; null when no reels found
  const r = mulberry32(seed >>> 0), pick = n => Math.floor(r() * n), tail = n => pick(n);
  const over = item.lockAll ? (n => n === BF.CHAIN_ODDS ? 0 : undefined) : null;
  const strips = E.strips, L = strips.length, win = (c, s) => BF.windowAt(c, s);
  const idx = (c, test) => strips[c].map((x, i) => i).filter(i => test(win(c, i)));
  const seq = stops => { let i = 0; return n => i < stops.length ? stops[i++] : (over && over(n) !== undefined ? over(n) : tail(n)); };
  if (kind === 'jackpot') { const st = strips.map((s, c) => { const o = idx(c, w => w[1] === 'bitcoin'); return o[pick(o.length)]; }); return st.every(x => x !== undefined) ? seq(st) : null; }
  for (let k = 0; k < 600000; k++) {
    let stops;
    if (kind === 'scatter') { const cols = [0, 1, 2, 3, 4].sort(() => r() - .5).slice(0, item.n); stops = strips.map((s, c) => { const o = idx(c, w => (w.filter(x => x === 'scatter').length) === (cols.includes(c) ? 1 : 0)); return o[pick(o.length)]; }); }
    else stops = strips.map(s => pick(s.length));
    const grid = stops.map((s, c) => win(c, s)), ev = BF.evaluate(grid, state.bet, 1), t = ev.triggers, none = !t.free && !t.vault && !t.chain;
    const monkeyLine = ev.wins.some(w => w.symbol === 'artifact' || w.symbol === 'bitcoin');
    const wildLine = ev.wins.some(w => { const line = BF.lines[w.line]; for (let c = 0; c < w.count; c++) if (grid[c][line[c]] === 'wild') return true; return false; });
    const ok = kind === 'free' ? t.free && !t.vault && !t.chain && !ev.jackpot && ev.scatters === 3 : kind === 'vault' ? t.vault && !t.free && !t.chain && !ev.jackpot : kind === 'chain' ? t.chain && !t.free && !t.vault && !ev.jackpot : kind === 'gamble' ? (none && ev.total > 0 && !ev.jackpot) : kind === 'scatter' ? ev.scatters === item.n && !t.vault && !t.chain && !ev.jackpot : kind === 'wild' ? none && !ev.jackpot && wildLine : kind === 'cameo' ? none && !ev.jackpot && monkeyLine : kind === 'win' ? ev.total > 0 : false;
    if (ok) return seq(stops);
  }
  return null;
}
const labStream = seed => { const r = mulberry32((seed ^ 0x9e3779b9) >>> 0); return n => Math.floor(r() * n); };
const labState = { sel: 'free', mode: 'seeded', seed: '2500', bet: 100, last: null, queue: null, auto: false, plan: null, stream: null, at: 0 };
function labRun(id, opts = {}) {
  const item = LAB_ITEMS.find(x => x.id === id); if (!item) return 'unknown';
  if (!lab.on && !enterLabQuiet()) return 'blocked';
  if (spinning || pres || feature() || state.free > 0) { toast('Finish or skip the current round first.'); return 'busy'; }
  const bet = bets.includes(Number(opts.bet)) ? Number(opts.bet) : labState.bet, mode = opts.mode || labState.mode;
  let seed = mode === 'random' && opts.seed == null ? (Math.random() * 4294967296) >>> 0 : hashSeed(opts.seed != null ? opts.seed : labState.seed);
  state.bet = bet; state.gamble = 0; if (state.balance < bet * 40) state.balance = 100000; state.freeBet = state.freeBet || bet;
  labState.last = { id, bet, seed, mode }; labState.bet = bet; labState.seed = String(seed); labState.stream = labStream(seed); labState.plan = { id, item, gamble: item.kind === 'gamble', outcome: item.outcome, retrig: !!item.retrig, seed };
  if (item.twins) TEST.setTwins(item.twins);
  status(`BONUS LAB · ${item.t.toUpperCase()} · SEED ${seed}`);
  if (item.kind === 'potroll') { state.potKey = '1999-W01'; state.pot = Math.round(bet * 123.45 * 100) / 100; if (!Number.isFinite(sources.twins) || sources.helper !== 'live') { sources.helper = 'live'; sources.twins = 37; } ensureExtras(); update(); screenDirty = true; sound('win'); openPot(); return 'ok'; }
  const rng = craftRng(item.kind, seed, item); if (!rng) { toast('The lab could not find reels for that item. Try another seed.'); return 'no-seed'; }
  spinForced = rng; spin(); return 'ok';
}
function labRunAll() { if (!lab.on && !enterLabQuiet()) return; labState.queue = LAB_ITEMS.map(x => x.id); labState.auto = true; closeModal(); toast('Run all: every Bonus Lab item in turn.'); }
function labStop() { labState.queue = null; labState.auto = false; }
function labTick(now) {
  if (!lab.on) { if (labState.auto) labStop(); return; }
  const p = labState.plan;
  if (p && p.gamble && !pres && !spinning && !feature() && state.gamble > 0 && !state.free) { p.ready = p.ready || now; if (now - p.ready > 1300) { p.gamble = false; p.started = true; openGamble(); } }
  if (!labState.auto) return;
  if (!pres && !spinning && !feature() && !state.free && !modalOpen() && !(p && p.gamble) && now - labState.at > 900) { if (labState.queue && labState.queue.length) { labState.at = now; labRun(labState.queue.shift(), { seed: labState.seed, bet: labState.bet, mode: 'seeded' }); } else { labStop(); toast('Run all finished.'); } return; }
  if (modalOpen() && labState.queue && !spinning && !pres) { if (now - labState.at > 2200) { closeModal(); } return; }
  if (!pres || spinning) return; const t = now - pres.t0;
  if (pres.stage === 'intro' && t > 1400) { if (pres.bonus === 'gamble') gambleCall(p && p.outcome === 'loss' ? 'odd' : 'even'); else presStart(); }
  else if (pres.stage === 'summary' && t > 1900) presCollect();
  else if (pres.stage === 'play' && pres.bonus === 'vault' && now - (pres.autoAt || 0) > 800) { pres.autoAt = now; const f = feature(); if (f) { const open = [...Array(9).keys()].filter(i => !f.picks.includes(i)); if (open.length) pickBind(open[Math.floor(Math.random() * open.length)]); } }
  else if (pres.stage === 'play' && pres.bonus === 'chain' && now - (pres.autoAt || 0) > 1100) { pres.autoAt = now; featureAction(); }
}
function openTest() {
  const B = (k, t, sub) => `<button data-t="${k}"><b>${t}</b><br><small>${sub}</small></button>`;
  showModal('test', 'Test tools.', `<p class="fine">Play-money test build. The Bonus Lab runs any bonus on a separate practice balance; these tools change what the reels show, or check the return.</p><div class="test-grid">${B('lab', 'Bonus Lab', 'run any bonus on demand')}${B('twins:none', 'Twins: none', 'every monkey NOT YET FOREVER')}${B('twins:some', 'Twins: some', 'a third are forever')}${B('twins:all', 'Twins: all', 'every monkey forever')}${B('reduced', 'Reduced motion', 'toggle')}${B('reset', 'Reset balance', 'back to the play balance')}${B('sim', 'RTP simulation', '200,000 spins, seeded')}</div><p id="simOut" class="fine" aria-live="polite"></p>`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = async () => {
    const k = b.dataset.t;
    if (k.startsWith('twins:')) { TEST.setTwins(k.slice(6)); toast(`Twins set: ${k.slice(6)}`); closeModal(); return; }
    if (k === 'lab') { closeModal(); enterLab(); return; }
    if (k === 'reduced') { TEST.setReduced(!state.reduced); toast(state.reduced ? 'Reduced motion on.' : 'Reduced motion off.'); return; }
    if (k === 'reset') { if (lab.on) { state.balance = 100000; state.bet = 100; } else { try { if (window.parent.MH_RESET) window.parent.MH_RESET(); } catch (e) {} state.balance = Math.max(state.balance, 10000); } save(); update(); toast('Balance reset.'); closeModal(); return; }
    if (k === 'sim') { $('simOut').textContent = 'Running…'; const r = await TEST.sim(200000, 7, (d, n, v) => { $('simOut').textContent = `${fmt(d)} of ${fmt(n)} spins · RTP so far ${(v * 100).toFixed(2)}%`; }); $('simOut').textContent = `${fmt(r.spins)} spins · RTP ${(r.rtp * 100).toFixed(2)}% (design 94.38%). The full 5,000,000-spin check runs in rtp-sim.mjs.`; }
  });
}
/* ---------- Bonus Lab: a menu of every bonus and event, on its own LAB balance ---------- */
function labMenu() {
  const groups = [...new Set(LAB_ITEMS.map(i => i.group))];
  const html = groups.map(g => `<h3>${esc(g)}</h3><div class="test-grid">${LAB_ITEMS.filter(i => i.group === g).map(i => `<button data-lab="${i.id}" class="${labState.sel === i.id ? 'sel' : ''}" aria-pressed="${labState.sel === i.id}"><b>${esc(i.t)}</b><br><small>${esc(i.sub)}</small></button>`).join('')}</div>`).join('');
  showModal('lab', 'Bonus Lab.', `<p class="fine">Practice play on a separate LAB balance. Your real LAYR, saved game, jackpot meters and Holder Pot are not touched, and rounds are marked LAB in History. Each run deals a real round through the real engine with scripted reel stops, then plays the full presentation.</p>
  <div class="lab-cfg"><label>Bet level <select id="labBet">${bets.map(b => `<option value="${b}" ${b === labState.bet ? 'selected' : ''}>${b}</option>`).join('')}</select></label><label><input type="radio" name="labMode" value="seeded" ${labState.mode === 'seeded' ? 'checked' : ''}> Seeded</label><label><input type="radio" name="labMode" value="random" ${labState.mode === 'random' ? 'checked' : ''}> Random</label><label>Seed <input id="labSeed" type="text" inputmode="numeric" value="${esc(labState.seed)}" size="12"></label></div>
  ${html}<div class="lab-run"><button class="cta" id="labRun">Run: ${esc(LAB_ITEMS.find(i => i.id === labState.sel).t)}</button><button class="outline" id="labReplay" ${labState.last ? '' : 'disabled'}>Replay last</button><button class="outline" id="labAll">Run all</button><button class="outline" id="labLeave">Leave the lab</button></div><p class="fine" id="labNote">${labState.last ? `Last: ${esc(LAB_ITEMS.find(i => i.id === labState.last.id).t)} · bet ${labState.last.bet} · seed ${labState.last.seed}` : 'Pick an item, then Run.'}</p>`, 'BONUS LAB');
  const read = () => { labState.bet = Number($('labBet').value); labState.mode = document.querySelector('[name=labMode]:checked').value; labState.seed = $('labSeed').value || '1'; };
  document.querySelectorAll('[data-lab]').forEach(b => b.onclick = () => { read(); labState.sel = b.dataset.lab; labMenu(); });
  $('labRun').onclick = () => { read(); closeModal(); labRun(labState.sel, { bet: labState.bet, seed: labState.mode === 'random' ? undefined : labState.seed, mode: labState.mode }); };
  $('labReplay').onclick = () => { if (!labState.last) return; closeModal(); const l = labState.last; labRun(l.id, { bet: l.bet, seed: l.seed, mode: 'seeded' }); };
  $('labAll').onclick = () => { read(); labRunAll(); };
  $('labLeave').onclick = () => { closeModal(); exitLab(); };
}
function enterLabQuiet() {
  if (lab.on) return true;
  if (sessionLock || !LAYR.ready()) { toast('Connect your LAYR account first, then open the Bonus Lab.'); return false; }
  if (spinning || pres || feature() || state.free > 0) { toast('Finish the current round first, then open the Bonus Lab.'); return false; }
  stopAuto(); closeModal();
  lab.real = state; lab.twins = { helper: sources.helper, twins: sources.twins, flags: items.map(i => [i.forever, i.xtrataId]) };
  const s = BF.fresh(); s.balance = 100000; s.powered = true;
  for (const k of ['muted', 'volume', 'ambient', 'turbo', 'reduced', 'showLines']) s[k] = state[k];
  lab.on = true; state = s; E = BF; ensureExtras();
  screenDirty = true; update(); status('BONUS LAB · PRACTICE PLAY'); return true;
}
function enterLab() { if (lab.on) { labMenu(); return true; } if (!enterLabQuiet()) return false; toast('Bonus Lab: practice LAYR only. Your real balance and game are untouched.'); labMenu(); return true; }
function exitLab() {
  if (!lab.on) return true;
  if (spinning || pres || feature() || state.free > 0) { toast('Finish or skip the round first, then leave the lab.'); return false; }
  labStop(); stopAuto(); closeModal();
  const t = lab.twins; items.forEach((it, k) => { if (t.flags[k]) { it.forever = t.flags[k][0]; it.xtrataId = t.flags[k][1]; } }); sources.helper = t.helper; sources.twins = t.twins;
  rebuildPools(); refaceIdle(); liveLabel();
  state = lab.real; E = E0; lab.on = false; lab.real = null; lab.twins = null; lastResult = null; labState.plan = null;
  ensureExtras(); screenDirty = true; update(); status('BACK TO YOUR REAL GAME'); toast('Left the Bonus Lab. Your real game is exactly as you left it.');
  return true;
}
const TEST = {
  force(kind) { const m = { free: 'free', vault: 'vault', chain: 'chain', jackpot: 'jackpot', gamble: 'gambleWin', win: 'wild' }[kind] || kind; return labRun(m); },
  setTwins(mode) { const n = items.length; items.forEach((it, k) => { it.forever = mode === 'all' || (mode === 'some' && k % 3 === 0); it.xtrataId = it.forever ? String(90000 + it.id) : null; }); if (mode === 'none') { sources.helper = 'none'; sources.twins = 0; } else { sources.helper = 'live'; sources.twins = mode === 'all' ? 120 : 37; } rebuildPools(); refaceIdle(); liveLabel(); screenDirty = true; return { mode, forever: items.filter(i => i.forever).length, of: n, helper: sources.helper, twins: sources.twins }; },
  setReduced(on) { state.reduced = !!on; save(); update(); },
  lab: { items: () => LAB_ITEMS.map(i => ({ id: i.id, group: i.group, t: i.t, stages: !!i.stages })), enter: () => enterLabQuiet(), run: (id, o) => labRun(id, o), runAll: labRunAll, replay: () => { const l = labState.last; return l ? labRun(l.id, { bet: l.bet, seed: l.seed, mode: 'seeded' }) : 'none'; }, last: () => labState.last && { ...labState.last }, exit: exitLab, on: () => lab.on, assist: () => { labState.auto = true; labState.queue = null; }, menu: () => { enterLab(); } },
  state: () => JSON.parse(JSON.stringify({ reduced: !!state.reduced, pres: pres && { bonus: pres.bonus, stage: pres.stage }, spinning, lab: lab.on, pot: state.pot, balance: state.balance, free: state.free, feature: feature() && feature().type, gamble: state.gamble, helper: sources.helper, twins: sources.twins, tags: state.history.slice(0, 3).map(h => h.kind || 'Spin') })),
  skip() { skipPres(); }, advance() { presAction(); },
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
  else if (action === 'settings') openSettings(); else if (action === 'history') openHistory(); else if (action === 'account') openAccount();
  else if (clicks[action]) document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE = {
  screen, revision: () => rev,
  refreshAccount() { screenDirty = true; update(); drawScreen(performance.now()); },
  mechanics() { return { lever: leverStart > 0 ? { id: leverStart, elapsed: Math.max(0, performance.now() - leverStart), duration: 900, angle: 1.02 } : null, spinZ: null, armZ: null, bonus: pres ? { kind: pres.bonus, stage: pres.stage } : null, dark: false }; },
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
  ui() { const modal = $('modal'), bar = $('featureBar'), bet = state.free ? state.freeBet : state.bet, g = $('gamble'); return { balance: state.balance, bet, win: state.lastWin, spins: state.spins, spinning, button: $('spinText')?.textContent || 'SWING', spinDisabled: $('spin').disabled, betDownDisabled: $('minus')?.disabled, betUpDisabled: $('plus')?.disabled, gamble: g && !g.hidden ? g.textContent : '', status: $('status')?.textContent || '', turbo: !!state.turbo, auto: autoLeft > 0, muted: !!state.muted, modal: modal?.open ? pxPort(modal) : '', feature: bar && !bar.hidden ? pxPort(bar) : '' }; }
};
window.MonkeyHash = Object.freeze({ version: '1.0.0', holderLayerStubs: HolderLayerStubs, machine: 'monkey-hash', sources: () => ({ ...sources }), pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])), snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock, pres: pres && { bonus: pres.bonus, stage: pres.stage } })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes }, soundLog: () => soundLog.map(e => ({ ...e })) });
})();
