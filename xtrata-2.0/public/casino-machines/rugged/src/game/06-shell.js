
/* ---------- Fullscreen: the screen fills the view, every control except the lever on a bar along the bottom ---------- */
// The game owns this layout, so it is the same in the casino and on the test page. A host that shows this frame
// (the casino, the test page) registers itself with PX_CASINO_ENGINE.fullscreenHost(fn): requests then go to the host,
// which makes the frame visible and calls the browser Fullscreen API with its own user gesture. Without a host the game
// asks for fullscreen itself and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari).
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'WEAVE', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['odd', 'PULL', 'call pull', 'fb gold'], ['even', 'HOLD', 'call hold', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'PULL OR HOLD?', 'gamble win', 'fb gold'],
  ['betDown', '−KNOTS', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+KNOTS', 'bet up', 'fb'], ['max', 'MAX KNOTS', 'max bet', 'fb'], ['auto', 'AUTO-WEAVE', 'auto', 'fb'],
  ['pays', 'CATALOGUE', 'pays', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'HISTORY', 'rounds', 'fb'], ['pot', 'RESCUE POT', 'holder pot', 'fb'],
  ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), odd: () => callGamble('odd'), even: () => callGamble('even'), keep: () => keepWin(), gamble: () => openGamble(), betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), pot: () => openHolders(), lab: () => enterLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 6).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(6).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free;
  q('primary').querySelector('b').textContent = spinning ? 'WEAVING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('odd', gambleIntro); show('even', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0);
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance);
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-WEAVE';
  q('turbo').setAttribute('aria-pressed', String(!!state.turbo)); q('sound').querySelector('b').textContent = state.muted ? 'SOUND OFF' : 'SOUND'; q('volume').querySelector('input').value = state.volume; show('test', TEST_OK); show('lab', LAB_OK); if (LAB_OK) q('lab').querySelector('b').textContent = lab.on ? 'LAB ●' : 'LAB';
}
function fitFs() { if (!fsOn) return; const st = $('fsStage'), w = st.clientWidth - 16, h = st.clientHeight - 16, k = Math.max(.1, Math.min(w / 1400, h / 960)); screen.style.width = `${Math.floor(1400 * k)}px`; screen.style.height = `${Math.floor(960 * k)}px`; }
// Show or hide the fullscreen layout. Hosts call this through PX_CASINO_ENGINE.fullscreen(on) once they have made the frame visible.
function setFullscreenLayout(on) { fsOn = !!on; $('fs').hidden = !fsOn; document.body.classList.toggle('fs-on', fsOn);
  if (fsOn) { $('fsStage').appendChild(screen); fitFs(); updateFsBar(); } else if (screen.parentNode) screen.remove(); screenDirty = true; return fsOn; }
async function requestFullscreen(on) { if (fsHost) { fsHost(!!on); return; }
  if (on) { setFullscreenLayout(true); fsSelf = true; try { if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) { /* the fixed full-viewport layer stays as the fallback */ } }
  else { fsSelf = false; try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) {} setFullscreenLayout(false); } }
document.addEventListener('fullscreenchange', () => { if (fsSelf && !document.fullscreenElement) { fsSelf = false; setFullscreenLayout(false); } fitFs(); });
addEventListener('resize', fitFs);

/* ---------- Test hooks: only on a local development host, or when a standalone test page declares itself ---------- */
// The casino never sets PX_STANDALONE_TEST, so on the public casino Rugged.test is null.
// Forced reel stops. Each is a real engine round; only the stop positions are chosen. Verified against the engine (see tools/check-lab-plans.cjs).
const S = { win: [15, 8, 23, 30, 4], s3: [9, 9, 9, 0, 0], s4: [9, 9, 9, 9, 0], s5: [9, 9, 9, 9, 9], vault: [20, 20, 20, 20, 20], chain: [0, 0, 0, 0, 0], jackpot: [8, 3, 14, 0, 15], cameo: [7, 23, 29, 24, 18] };
const TEST_STOPS = { free: S.s3, vault: S.vault, chain: S.chain, jackpot: S.jackpot, win: S.win };
const LINKED_TEST = { none: 0, some: 120, all: 400 };
function engineSource() { const s = [...document.scripts].find(x => x.text.includes('Block Fortune v2 engine')); return s ? s.text : ''; }
// Seeded RTP simulation of this exact engine, in a worker so the machine stays responsive.
function simulate(spins = 1e6, seed = 20261101, onProgress) { return new Promise((resolve, reject) => {
  const src = `${engineSource()}\nlet x=BigInt(${Number(seed) >>> 0})&0xffffffffffffffffn;function next(){x=(x+0x9e3779b97f4a7c15n)&0xffffffffffffffffn;let z=x;z=((z^(z>>30n))*0xbf58476d1ce4e5b9n)&0xffffffffffffffffn;z=((z^(z>>27n))*0x94d049bb133111ebn)&0xffffffffffffffffn;return Number((z^(z>>31n))>>11n)/2**53;}
const rng=n=>Math.floor(next()*n),N=${Math.floor(spins)},st=BF.fresh();st.balance=1e15;st.bet=100;let paid=0,fr=0,va=0,ch=0,jk=0;
while(paid<N){const free=st.free>0;if(!free)paid++;BF.start(st,rng);const r=BF.settle(st);if(r.jackpotWin)jk++;if(r.triggers.free&&!free)fr++;while(BF.feature(st)){const f=BF.feature(st);if(f.type==='vault'){if(!f.free)va++;[0,1,2,3,4,5,6,7,8].sort(()=>next()-.5).slice(0,3).forEach(i=>BF.pick(st,i));}else{if(!f.free)ch++;while(BF.respin(st));}if(BF.collect(st).jackpotWin)jk++;}if(!st.free&&st.freeActive)BF.endFree(st);st.history.length=0;if(paid%250000===0&&!free)postMessage({progress:paid/N});}
postMessage({done:true,spins:N,seed:${Number(seed) >>> 0},rtp:100*st.paidOut/st.wagered,freeEvery:N/fr,pickEvery:N/va,holdEvery:N/ch,jackpots:jk});`;
  const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' })), w = new Worker(url);
  w.onmessage = e => { if (e.data.done) { w.terminate(); URL.revokeObjectURL(url); resolve(e.data); } else if (onProgress) onProgress(e.data.progress); };
  w.onerror = e => { w.terminate(); reject(Error(e.message || 'simulation failed')); }; }); }

/* ---------- Bonus Lab: every bonus on demand, without touching anything real ----------
   The Lab swaps in the raw Block Fortune engine and a fresh state of its own, so the LAYR account, the saved game, the jackpot meters,
   the Rescue Pot and the RTP statistics are never read or written (save(), locked() and holderAdd() all step aside while lab.on).
   Each item hands the engine's own start(state, rng) a scripted generator: the reel stops (and, for the full rug, the locks) are
   set, every other draw comes from a seeded generator, so a seed replays the same round exactly. Nothing in the engine is replaced. */
const LAB_ITEMS = [
  { id: 'free', label: '404', sub: '3 broken frames · 8 free spins at 2×', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'retrigger', label: '404 with a retrigger', sub: '404, then 3 broken frames on the first free spin: +4 spins', kind: 'free', plan: [{ stops: S.s3 }, { stops: S.s3 }] },
  { id: 'pick', label: 'Unroll', sub: '3 rolled rugs · unroll three of nine', kind: 'vault', plan: [{ stops: S.vault }] },
  { id: 'hold', label: 'Fully Woven', sub: '9 knots · hold and respin on the loom', kind: 'chain', plan: [{ stops: S.chain }] },
  { id: 'fullgrid', label: 'Fully Woven: the whole rug', sub: 'Every band ties: the Magic Carpet Ride jackpot', kind: 'chain', also: 'jackpot', plan: [{ stops: S.chain, lockAll: true }] },
  { id: 'centre', label: 'Magic Carpet Ride', sub: 'Five Flying Carpets on the centre row', kind: 'jackpot', plan: [{ stops: S.jackpot }] },
  { id: 'gamble-win', label: 'Pull or Hold: win', sub: 'A plain win, then a correct call', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'win' },
  { id: 'gamble-loss', label: 'Pull or Hold: loss', sub: 'A plain win, then a wrong call (RUGGED!)', kind: 'gamble', plan: [{ stops: S.win }], gamble: 'loss' },
  { id: 'scatter3', label: '3 broken frames', sub: 'Pays 2× bet and starts the 404', kind: 'free', plan: [{ stops: S.s3 }] },
  { id: 'scatter4', label: '4 broken frames', sub: 'Pays 5× bet and starts the 404', kind: 'free', plan: [{ stops: S.s4 }] },
  { id: 'scatter5', label: '5 broken frames', sub: 'Pays 10× bet and starts the 404', kind: 'free', plan: [{ stops: S.s5 }] },
  { id: 'cameo', label: 'Rescued cameo', sub: 'A plain line win: the twin on the line is named and recorded for the royalty', kind: 'win', plan: [{ stops: S.cameo }] }
];
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
Object.assign(lab, { mode: 'seeded', rand: mulberry(lab.seed), seen: [], results: null, running: null, gambleWant: null, seedShown: null, autopilot: false, bet: 100 });
// The engine's own start(state, rng) gets this: the plan's stops (and locks) first, then the seeded stream (or crypto in random play).
function labRng() {
  const plan = lab.script.shift() || null; let k = 0, scripted = !!plan;
  return n => {
    if (plan) { if (n === 32 && plan.stops && k < 5) return plan.stops[k++]; if (plan.lockAll && n === 25) return 0; }
    return scripted || lab.mode === 'seeded' ? Math.floor(lab.rand() * n) : BF.randomInt(n);
  };
}
// Pull or Hold in the Lab: the first draw is the parity, so a win or a loss can be set after the player has called.
function labGambleRng(choice) { let first = true; return n => { if (first && n === 2) { first = false; const odd = lab.gambleWant === 'loss' ? choice !== 'odd' : choice === 'odd'; return odd ? 1 : 0; } return Math.floor(lab.rand() * n); }; }
function labSeen(kind, stage) { if (lab.on) lab.seen.push(`${kind}:${stage}`); }
function labClean() { if (spinning) return false; scene = null; sceneQueue = []; airdrop = null; hideBar(); jackpotMusic(false); stopAuto(); clearTimeout(scheduleFree.t);
  state.features = []; state.pending = null; state.free = 0; state.freeActive = false; state.freeAwarded = 0; state.freeTotal = 0; state.freeCount = 0; state.gamble = 0; lastResult = null; return true; }
function enterLab() {
  if (!LAB_OK) return false;
  if (lab.on) { openLab(); return true; }
  if (sessionLock || !LAYR.ready()) { toast('Connect your LAYR account first, then open the Bonus Lab.'); return false; }
  if (spinning || scene || feature() || state.free > 0) { toast('Finish the current round first, then open the Bonus Lab.'); return false; }
  stopAuto(); closeModal();
  lab.real = state; const s = BF.fresh(); s.balance = lab.bank; for (const k of ['muted', 'volume', 'turbo', 'reduced', 'showLines']) s[k] = state[k];
  lab.on = true; state = s; E = BF; lab.rand = mulberry(lab.seed); lab.results = null; lab.seen = []; lab.last = null; lab.seedShown = null;
  refaceIdle(); screenDirty = true; update(); status('BONUS LAB · PRACTICE PLAY'); toast('Bonus Lab: practice LAYR only. Your real balance and game are untouched.');
  openLab(); return true;
}
function exitLab() {
  if (!lab.on) return true;
  if (spinning) { toast('Wait for the reels to stop, then leave the Bonus Lab.'); return false; }
  stopAP(); labClean(); closeModal();
  state = lab.real; E = E0; lab.on = false; lab.real = null; lab.seedShown = null; lab.script = []; lastResult = null;
  refaceIdle(); screenDirty = true; update(); status('BACK TO YOUR REAL GAME'); toast('Left the Bonus Lab. Your real game is exactly as you left it.');
  return true;
}
function runLabItem(item, opts = {}) {
  if (!lab.on) return 'not-in-lab'; if (spinning) return 'busy'; labClean(); closeModal();
  const seed = opts.seed != null ? opts.seed >>> 0 : lab.mode === 'random' ? (Math.random() * 4294967296) >>> 0 : lab.seed >>> 0;
  lab.rand = mulberry(seed); lab.seedShown = seed; lab.last = { id: item.id, seed }; lab.seen = []; lab.running = item.id; lab.gambleWant = item.gamble || null;
  lab.script = item.plan.map(p => ({ ...p })); state.jackpots = BF.fresh().jackpots; state.bet = lab.bet; state.freeBet = lab.bet; if (state.balance < 5000) state.balance = lab.bank;
  lab.startBalance = state.balance; screenDirty = true; spin(); return 'ok';
}
const labItem = id => LAB_ITEMS.find(i => i.id === id);
function labReplay() { if (!lab.last) { toast('Nothing to replay yet: run an item first.'); return 'none'; } return runLabItem(labItem(lab.last.id), { seed: lab.last.seed }); }
// Autopilot: drives the scenes like a player would. Run all uses it with turbo on and skips the free-spin animation.
const AP = { on: false, timer: 0, fast: false, queue: [], item: null, deadline: 0, results: [], restoreTurbo: null };
function stopAP() { clearInterval(AP.timer); AP.timer = 0; AP.on = false; AP.queue = []; AP.item = null; if (AP.restoreTurbo !== null) { state.turbo = AP.restoreTurbo; AP.restoreTurbo = null; } }
function apStart(fast) { AP.on = true; AP.fast = fast; clearInterval(AP.timer); AP.timer = setInterval(apStep, 140); }
function apFinish(ok, why) {
  const it = AP.item; if (!it) return; const stages = [...new Set(lab.seen)], need = [it.kind, it.also].filter(k => k && k !== 'win');
  const complete = need.every(k => ['trigger', 'intro', 'outro'].every(s => stages.includes(`${k}:${s}`))) && (it.kind !== 'win' || (state.history[0] && (state.history[0].cameos || []).length > 0));
  const rec = { id: it.id, label: it.label, seed: lab.seedShown, ok: ok && complete, why: ok && complete ? '' : (why || 'missing stages'), net: Math.round((state.balance - lab.startBalance) * 100) / 100, stages, cameos: (state.history[0] && state.history[0].cameos) || [] };
  AP.results.push(rec); lab.results = AP.results.slice(); AP.item = null; state.gamble = 0;
  if (AP.queue.length) { setTimeout(() => { if (!AP.on) return; const next = AP.queue.shift(); AP.item = next; AP.deadline = performance.now() + 90000; runLabItem(next); }, 350); return; }
  const all = AP.results.slice(); stopAP(); update(); status(`LAB · RAN ${all.length} ITEMS`); openLab();
}
function apStep() {
  if (!lab.on || !AP.on) { stopAP(); return; } if (!AP.item) return; if (performance.now() > AP.deadline) { apFinish(false, 'timed out'); return; }
  if (spinning || $('modal').open || sceneDue || performance.now() - spinEndAt < 400) return;
  if (scene) { const { kind, stage } = scene;
    if (stage === 'trigger') return;
    if (stage === 'intro') { if (kind === 'gamble') callGamble('odd'); else primaryAction(); return; }
    if (stage === 'play') {
      if (kind === 'vault') { const f = feature(); if (f && !E.featureDone(f)) { const i = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(j => !f.picks.includes(j)); pickVault(i); } else if (f) collectScene(); return; }
      if (kind === 'chain') { featureAction(); return; }
      if (kind === 'jackpot') { if (AP.fast || performance.now() - scene.t0 > 4600 * speed()) setStage('outro'); return; }
      if (kind === 'gamble') { if (scene.data.landed) setStage('outro'); return; }
      return; }
    if (stage === 'outro') { if (performance.now() - scene.t0 > 1500 * speed()) nextScene(); return; }
    return; }
  if (sceneQueue.length || feature()) { nextScene(); return; }
  if (state.freeActive && !state.free) { airdropOutro(); return; }
  if (state.free > 0) { if (AP.fast) { skipScene(); } else if (!spinning) spin(); return; }
  if (state.gamble > 0 && AP.item.gamble) { openGamble(); return; }
  apFinish(true);
}
function labRunAll() {
  if (!lab.on) return 'not-in-lab'; if (spinning) return 'busy'; stopAP(); closeModal();
  AP.results = []; lab.results = null; AP.restoreTurbo = !!state.turbo; state.turbo = true; AP.queue = LAB_ITEMS.slice(); AP.item = AP.queue.shift(); AP.deadline = performance.now() + 90000; apStart(true); runLabItem(AP.item); return 'ok';
}
function labRunOne(item, opts = {}) { const r = runLabItem(item, opts); if (r === 'ok' && (lab.autopilot || opts.autopilot)) { stopAP(); AP.results = []; AP.item = item; AP.deadline = performance.now() + 120000; apStart(false); } return r; }
function openLab() {
  if (!LAB_OK) return;
  const rows = (lab.results || []).map(r => `<tr><td>${esc(r.label)}</td><td>${r.ok ? '<b class="lab-ok">PASS</b>' : `<b class="lab-bad">${esc(r.why)}</b>`}</td><td>${fmt(r.net)}</td><td>${r.seed}</td></tr>`).join('');
  showModal('lab', 'Bonus Lab.', `<p class="lab-note">Practice play: your own LAYR, saved game, jackpot meters, Rescue Pot and RTP statistics are not touched, and nothing here is saved. Each item deals a real round through the real engine with its own scripted reel stops, then plays the scene. The Lab has its own practice balance and the screen says so.</p>
  <div class="lab-ctl"><label class="setting">Seeded (the same seed always replays the same round)<input type="radio" name="labMode" value="seeded" ${lab.mode === 'seeded' ? 'checked' : ''}></label><label class="setting">Random (a new seed each run, shown on the screen)<input type="radio" name="labMode" value="random" ${lab.mode === 'random' ? 'checked' : ''}></label><label class="setting">Seed<input type="number" id="labSeed" min="0" max="4294967295" value="${lab.seed}"></label><label class="setting">Bet level<select id="labBet">${bets.map(b => `<option value="${b}" ${b === lab.bet ? 'selected' : ''}>${b} LAYR</option>`).join('')}</select></label><label class="setting">Autopilot (play the scenes for me)<input type="checkbox" id="labAuto" ${lab.autopilot ? 'checked' : ''}></label></div>
  <div class="test-grid">${LAB_ITEMS.map(i => `<button class="cta" data-lab="${i.id}"><b>${esc(i.label)}</b><br><small>${esc(i.sub)}</small></button>`).join('')}</div>
  <div class="lab-row"><button class="outline" id="labReplay" ${lab.last ? '' : 'disabled'}>Replay last${lab.last ? ` (${esc(labItem(lab.last.id).label)}, seed ${lab.last.seed})` : ''}</button><button class="outline" id="labAll">Run all ${LAB_ITEMS.length}</button><button class="outline" id="labReset">Reset practice balance (${fmt(lab.bank)})</button><button class="outline" id="labLeave">Leave the Lab</button></div>
  ${rows ? `<h3>LAST RUN</h3><table class="paytable"><thead><tr><th>ITEM</th><th>RESULT</th><th>NET · LAB LAYR</th><th>SEED</th></tr></thead><tbody>${rows}</tbody></table>` : ''}`, 'BONUS LAB');
  document.querySelectorAll('[name=labMode]').forEach(r => r.onchange = () => { lab.mode = r.value; });
  $('labSeed').onchange = e => { const v = Number(e.target.value); if (Number.isFinite(v) && v >= 0) lab.seed = Math.floor(v) >>> 0; lab.rand = mulberry(lab.seed); };
  $('labBet').onchange = e => { const v = Number(e.target.value); if (bets.includes(v)) lab.bet = v; };
  $('labAuto').onchange = e => { lab.autopilot = e.target.checked; };
  document.querySelectorAll('[data-lab]').forEach(b => b.onclick = () => labRunOne(labItem(b.dataset.lab)));
  $('labReplay').onclick = () => labReplay(); $('labAll').onclick = () => labRunAll(); $('labLeave').onclick = () => { closeModal(); exitLab(); };
  $('labReset').onclick = () => { if (spinning) return; labClean(); state.balance = lab.bank; state.jackpots = BF.fresh().jackpots; state.bet = lab.bet; update(); toast(`Practice balance reset to ${fmt(lab.bank)}.`); };
}
const labApi = LAB_OK ? Object.freeze({
  items: () => LAB_ITEMS.map(i => ({ id: i.id, label: i.label, kind: i.kind })), on: () => lab.on, enter: () => enterLab(), exit: () => exitLab(),
  run: (id, o = {}) => { const it = labItem(id); if (!it) throw Error('Unknown Lab item: ' + id); if (o.bet && bets.includes(o.bet)) lab.bet = o.bet; return labRunOne(it, o); },
  replay: () => labReplay(), runAll: () => labRunAll(), abort: () => { stopAP(); return labClean(); }, results: () => (lab.results || []).map(r => ({ ...r })), last: () => lab.last && { ...lab.last }, running: () => AP.on,
  setMode: (mode, seed) => { lab.mode = mode === 'random' ? 'random' : 'seeded'; if (seed != null) { lab.seed = seed >>> 0; lab.rand = mulberry(lab.seed); } return { mode: lab.mode, seed: lab.seed }; },
  setBet: b => { if (bets.includes(b)) lab.bet = b; return lab.bet; },
  state: () => lab.on ? { balance: state.balance, spins: state.spins, wagered: state.wagered, paidOut: state.paidOut, seed: lab.seedShown, seen: [...lab.seen], history: state.history.slice(0, 3).map(h => ({ win: h.win, cameos: h.cameos || [] })) } : null,
  open: () => openLab(), plans: () => LAB_ITEMS.map(i => ({ id: i.id, plan: i.plan.map(p => ({ ...p })), gamble: i.gamble || null }))
}) : null;
const testApi = TEST_OK ? Object.freeze({
  kinds: Object.keys(TEST_STOPS),
  force(kind) { if (!TEST_STOPS[kind]) throw Error('Unknown test feature: ' + kind); testStops = TEST_STOPS[kind].slice(); return true; },
  // Force, then spin straight away (the gamble needs a paid win first, so 'gamble' forces a plain win and opens the call).
  play(kind) { if (lab.on || scene || spinning || feature() || state.free) return false; if (kind === 'gamble') { testStops = TEST_STOPS.win.slice(); spin(); const t = setInterval(() => { if (!spinning) { clearInterval(t); if (state.gamble) openGamble(); } }, 100); return true; } this.force(kind); spin(); return true; },
  twins(mode) { if (!['default', 'none', 'some', 'all'].includes(mode)) throw Error('default, none, some or all'); twinMode = mode; retileAll(); update(); const l = birdList(); return { mode, forever: l.filter(foreverFor).length, of: l.length }; },
  linkedHolders(mode) { if (!(mode in LINKED_TEST)) throw Error('none, some or all'); Object.assign(linkedTest, { on: true, value: LINKED_TEST[mode] }); screenDirty = true; update(); return { ...linkedTest }; },
  setReduced(on) { state.reduced = !!on; save(); update(); return state.reduced; }, setTurbo(on) { state.turbo = !!on; save(); update(); return state.turbo; },
  simulate, scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, skip: () => skipScene(), primary: () => primaryAction(), fullscreen: on => requestFullscreen(on), lab: labApi
}) : null;
function openTestPanel() { if (!TEST_OK) return; showModal('test', 'Test panel.', `<p class="fine">Test build only. Forced spins use real engine rounds with fixed reel stops; nothing here exists on the public casino.</p>
  <h3>TRIGGER</h3><div class="ab" style="flex-wrap:wrap"><button class="cta" data-t="free">404</button><button class="cta" data-t="vault">Unroll</button><button class="cta" data-t="chain">Fully Woven</button><button class="cta" data-t="jackpot">Magic Carpet Ride</button><button class="cta" data-t="gamble">Pull or Hold</button></div>
  <h3>TWINS (NOT YET FOREVER LOOK)</h3><div class="ab"><button class="outline" data-w="default">As loaded</button><button class="outline" data-w="none">None</button><button class="outline" data-w="some">Some</button><button class="outline" data-w="all">All</button></div><p class="fine">Switches how many rescued rugs show as forevered. The rest are greyed with NOT YET FOREVER.</p>
  <h3>TWIN COUNT (RESCUE POT SHARE)</h3><div class="ab"><button class="outline" data-h="none">0</button><button class="outline" data-h="some">120</button><button class="outline" data-h="all">400</button></div>
  <h3>MOTION</h3><label class="setting">Reduced motion<input type="checkbox" id="tReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Turbo<input type="checkbox" id="tTurbo" ${state.turbo ? 'checked' : ''}></label>
  <h3>RTP SIMULATION</h3><div class="ab"><button class="outline" data-sim="200000">200k spins</button><button class="outline" data-sim="1000000">1M</button><button class="outline" data-sim="5000000">5M</button></div><p id="tSim" class="fine">Exact model: 94.380%.</p>${LAB_OK ? '<h3>BONUS LAB</h3><button class="outline" id="tLab">Open the Bonus Lab</button>' : ''}`, 'TEST');
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { closeModal(); testApi.play(b.dataset.t); });
  document.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { testApi.twins(b.dataset.w); toast(`Twins: ${b.dataset.w}.`); });
  document.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { testApi.linkedHolders(b.dataset.h); toast(`Twin count (test): ${LINKED_TEST[b.dataset.h]}.`); });
  $('tReduced').onchange = e => testApi.setReduced(e.target.checked); $('tTurbo').onchange = e => testApi.setTurbo(e.target.checked); if ($('tLab')) $('tLab').onclick = () => { closeModal(); enterLab(); };
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const el = $('tSim'); el.textContent = 'Running…'; try { const r = await simulate(Number(b.dataset.sim), 20261101, p => { el.textContent = `Running… ${Math.round(p * 100)}%`; }); el.textContent = `${fmt(r.spins)} spins (seed ${r.seed}): RTP ${r.rtp.toFixed(2)}% · 404 1 in ${r.freeEvery.toFixed(0)} · Unroll 1 in ${r.pickEvery.toFixed(0)} · Fully Woven 1 in ${r.holdEvery.toFixed(0)} · ${r.jackpots} jackpots. Exact: 94.380%.`; } catch (e) { el.textContent = e.message; } }); }


/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => {if(spinInputBusy())return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on: quicker reels and bonus scenes.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('history').onclick = openHistory; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('colsInfo').onclick = openCollections; $('holdersInfo').onclick = openHolders; $('fullscreenBtn').onclick = () => requestFullscreen(!fsOn);
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); if (master) master.gain.value = state.muted ? 0 : state.volume; save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
addEventListener('keydown', e => { if (e.repeat || e.target.matches('input,textarea,select') || $('modal').open) { if (e.key === 'Escape' && $('modal').open) { e.preventDefault(); closeModal(); } return; }
  const k = (e.key || '').toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); spinClick(); } else if (/^[1-9]$/.test(e.key) && feature()?.type === 'vault') pickVault(Number(e.key) - 1);
  else if (k === 'm') $('sound').click(); else if (k === 'f') requestFullscreen(!fsOn); else if (k === 's' && canSkip()) skipScene();
  else if (k === 'p' && scene?.kind === 'gamble') callGamble('odd'); else if (k === 'h' && scene?.kind === 'gamble') callGamble('even');
  else if (k === 'l' && LAB_OK) { if (lab.on) openLab(); else enterLab(); }
  else if (e.key === 'Escape') { if (fsOn && !document.fullscreenElement) requestFullscreen(false); else if (autoLeft) { stopAuto(); status('AUTO-WEAVE STOPPED'); } } updateFsBar(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted && pxEngineActive) ac.resume().catch(() => {}); });

/* ---------- Frame loop: the screen only; idle frames capped near 30 fps ---------- */
let lastHl = -1, lastPoolSize = 0, lastTick = 0;
const perf = { frames: 0, drawn: 0 };
function animate(now){if(!pxEngineActive){requestAnimationFrame(animate);return;}
  requestAnimationFrame(animate); perf.frames++;
  if (spinning) spinPhysical.position.z = SPIN_Z - (1 + Math.sin(now / 170)) * .006; else spinPhysical.position.z = SPIN_Z;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  if (now - chainFlash < 1000 || scene) screenDirty = true; // scenes animate continuously
  if (state.freeActive && motionOK()) screenDirty = true; // the dead page flickers and rugs weave in
  if (state.freeActive && !spinning && !scene && now - lastTick > 2400) { lastTick = now; if (state.free) sound('tick'); }
  const ps = Object.values(pools).reduce((a, p) => a + p.length, 0); if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  if (spinning ? now - lastDraw > 16 : (screenDirty && now - lastDraw > 32)) { drawScreen(now); lastDraw = now; perf.drawn++; if (fsOn && perf.drawn % 10 === 0) updateFsBar(); }
}

/* ---------- Boot ---------- */
function resume() {
  if (lab.on) { labClean(); lab.on = false; E = E0; lab.real = null; }
  state=LAYR.openGame(GAME_ID,E); holderState();
  if (state.pending) { lastResult = E.settle(state); recordCameos(lastResult); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { startScene(feature().type, {}, 'intro'); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { renderBar(); status(`${state.free} SAVED 404 SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(airdropOutro, 800);
}
update(); drawScreen(0);
// Bundled art decodes at once; live top-ups start only after the frame has loaded and a player connects, so a slow
// network can never hold up the cabinet becoming ready.
let liveStarted = false; const startLive = () => { if (liveStarted) return; liveStarted = true; loadLive().catch(() => { sources.done = true; }); };
loadBundled().then(() => { refaceIdle(); screenDirty = true; }).catch(() => {});
requestAnimationFrame(animate); window.__bfReady = true; $('loading').style.opacity = 0; setTimeout(() => $('loading')?.remove(), 550);
window.Rugged = Object.freeze({ version: '1.0.0', machine: GAME_ID,
  sources: () => ({ ...sources, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])), twins: { ...twinCount }, ledger: rescueLedger() }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, id: t.id, number: t.num, bundled: !!(t.bird && t.bird.bundled) }))])),
  faces: () => faces.map(c => c.slice()), holder: () => JSON.parse(JSON.stringify(holderState())), scene: () => scene ? { kind: scene.kind, stage: scene.stage } : null, fullscreen: () => fsOn,
  soundLog: () => soundLog.map(e => ({ ...e })), perf: () => ({ ...perf }), screen: () => screen, deadLink: () => ({ ...DEAD }),
  // A freshly woven hanging rug (a random loaded twin), for a host to show on the cabinet's sideRug parts. Cosmetic only.
  rugCanvas: () => { const l = birdList(); if (!l.length) return null; const b = l[Math.floor(Math.random() * l.length)], dye = ['#c8322a', '#e09a2d', '#2b8a7e', '#4f6bd8', ACCENT][Math.floor(Math.random() * 5)], body = rugBody(b.img, 6, { dye, ext: 8, grey: !foreverFor(b) }), c = canvas(body.w, body.h + 72); drawRug(c.getContext('2d'), body, 0, 36, { wave: 0, fringe: 30, seed: b.id }); return c; },
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, sessionLock })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes },
  test: testApi, lab: labApi });
// Cached cabinets borrow the room's LAYR account; they never own a second wallet.
let pxSessionOwned=false,pxSessionEpoch=0,pxSessionPending=null;
function pxReleaseLease(){pxSessionEpoch++;pxSessionOwned=false;sessionLock=true;}
async function pxClaimSession(){
  if(pxSessionOwned&&LAYR.ready())return true;
  if(pxSessionPending)return pxSessionPending;
  const epoch=pxSessionEpoch;
  pxSessionPending=(async()=>{
    if(!await LAYR.acquire()||epoch!==pxSessionEpoch){sessionLock=true;update();status(LAYR.error()||'LAYR connection was cancelled.');return false;}
    sessionLock=false;state=LAYR.openGame(GAME_ID,E);resume();pxSessionOwned=true;return true;
  })().finally(()=>{pxSessionPending=null;});
  return pxSessionPending;
}

// A canvas-and-controls API. The casino owns all visible 3D rendering and cameras.
const pxSourceElements=new Map(),pxSourceTokens=new WeakMap();let pxToken=0;
function pxPort(element){if(!element)return '';for(const n of [element,...element.querySelectorAll('*')]){if(!pxSourceTokens.has(n)){const id=String(++pxToken);pxSourceTokens.set(n,id);pxSourceElements.set(id,n);}n.setAttribute('data-px-source',pxSourceTokens.get(n));}return element.outerHTML;}
function pxControl(action){
  const clicks={sound:'sound',turbo:'turbo',max:'maxBet'};
  if(action==='spin')spinClick();else if(action==='betDown')changeBet(-1);else if(action==='betUp')changeBet(1);else if(action==='auto')autoClick();
  else if(action==='pays')openRules();else if(action==='fair')openFair();else if(action==='gamble')openGamble();else if(action==='skip')skipScene();else if(action==='fullscreen')requestFullscreen(!fsOn);
  else if(action==='settings')openSettings();else if(action==='history')openHistory();else if(action==='account')openAccount();else if(action==='pot')openHolders();else if(action==='lab'&&LAB_OK)enterLab();
  else if(clicks[action])document.getElementById(clicks[action])?.click();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenTexture.version,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // show: the scene on screen now, so a host can light the cabinet (topper speed, floor glow) and fly the carpet during the jackpot.
  mechanics(){return {lever:typeof lever!=='undefined'&&typeof leverStart!=='undefined'&&leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:typeof spinPhysical!=='undefined'?spinPhysical.position.z:null,armZ:null,show:scene?{kind:scene.kind,stage:scene.stage}:state.freeActive?{kind:'free',stage:'play'}:null};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;screenDirty=true;update();drawScreen(performance.now());setTimeout(startLive,0);if(state.free&&!scene&&!feature())scheduleFree();},
  deactivate(){if(spinning)return false;if(lab.on&&!exitLab())return false;stopAuto();clearTimeout(scheduleFree.t);jackpotMusic(false);if(pxEngineActive)save();pxEngineActive=false;if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name){if(pxEngineActive)pxControl(name);},
  stopAuto(){stopAuto();},
  tap(x,y){screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  // Fullscreen hand-over: the host shows this frame full-viewport (and in browser fullscreen), then calls fullscreen(true).
  fullscreen(on){return setFullscreenLayout(on);},
  fullscreenHost(fn){fsHost=typeof fn==='function'?fn:null;},
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'WEAVE',spinDisabled:$('spin').disabled,betDownDisabled:$('minus')?.disabled,betUpDisabled:$('plus')?.disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,scene:scene?{kind:scene.kind,stage:scene.stage}:null,modal:modal?.open?pxPort(modal):'',feature:bar&&!bar.hidden?pxPort(bar):''};}
};
})();
