const SUB = { SWING: 'spin the reels', 'SWINGING…': 'reels are spinning', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', 'GROW VINES': 'respin the vines', SPIN: 'spin now', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'SWINGING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : 'START';
    if (st === 'summary') return p.bonus === 'gamble' ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : 'GROW VINES';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'SPIN' : '…';
    return '…';
  }
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'GROW VINES' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'SWING';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'DRUMS WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} DRUM SPINS · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot);
  $('gamble').hidden = $('gLeft').hidden = $('gRight').hidden = $('collect').hidden = !canGamble; $('testBtn').hidden = !(TESTBUILD || lab.on); $('labBtn').hidden = !(TESTBUILD || lab.on || LABFLAG);
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || 'press space'; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 7);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-SWING'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  screenDirty = true;
}
// The lab is always on the test page; in the casino it opens only with a developer flag (?lab=1 on testnet).
const LABFLAG = (() => { try { const q = new URLSearchParams((window.parent !== window ? window.parent : window).location.search); return q.get('lab') === '1' && !/mainnet/i.test(q.get('network') || ''); } catch (e) { return false; } })();

/* ---------- Procedural audio: jungle ambience, marimba wins, hand-drum beat, a deep drum on the jackpot ---------- */
let ac = null, master = null, ambNodes = [], drumTimer = 0;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
// A marimba bar: a sine plus a quick tuned overtone, with a woody knock. Pentatonic scale in C.
const PENT = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 784, 880, 1046.5];
function mar(f, delay = 0, v = .13, len = .55) { tone(f, len, 'sine', v, delay); tone(f * 4, .12, 'sine', v * .22, delay); noise(.03, v * .18, delay, 2500); }
function drum(delay = 0, v = .3, f = 95, len = .32) { tone(f, len, 'sine', v, delay, .45); tone(f * 2.1, .1, 'triangle', v * .25, delay, .6); noise(.05, v * .3, delay, 500); }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { drum(0, .16, 110); drum(.12, .1, 150); noise(.35, .025, 0, 2500); }
  if (kind === 'stop') return [tone(130, .14, 'triangle', .22, at, .6), noise(.04, .035, at, 2000)].filter(Boolean); // a plain wooden thud, the same on every reel: no pitched notes
  if (kind === 'drop') { drum(0, .26, 70, .7); [0, 3, 5, 7].forEach((s, k) => mar(PENT[s + 2], .08 + k * .06, .09)); }
  if (kind === 'win') mar(PENT[4], 0, .1, .4); // one soft note; the five-note run is kept for big wins
  if (kind === 'big') { [0, 2, 4, 5, 7, 8, 9, 10].forEach((s, k) => mar(PENT[s], k * .075, .13)); drum(.1, .3, 80, .6); drum(.5, .3, 80, .6); }
  if (kind === 'bonus') { for (let k = 0; k < 6; k++) drum(k * .13, .22, 100 + (k % 2) * 25); [0, 2, 4, 7].forEach((s, k) => mar(PENT[s + 2], .5 + k * .1, .12)); noise(.7, .03, .4, 5000); }
  if (kind === 'antic') { for (let k = 0; k < 8; k++) drum(k * .2, .1 + k * .014, 105); }
  if (kind === 'lock') { mar(PENT[(3 + i) % PENT.length] * 2, i * .08, .11, .4); noise(.05, .04, i * .08, 3000); }
  if (kind === 'respin') drum(0, .16, 120);
  if (kind === 'pick') { mar(PENT[(2 + i) % PENT.length] * 2, 0, .12, .45); noise(.07, .05, 0, 800); }
  if (kind === 'click') tone(660, .05, 'triangle', .05);
  if (kind === 'lose') { tone(190, .45, 'sine', .1, 0, .5); drum(.05, .12, 70); }
  if (kind === 'swap') { tone(500, .3, 'triangle', .08, 0, 1.8); tone(300, .35, 'triangle', .08, .1, .7); noise(.3, .03, .1, 4000); }
  if (kind === 'power') { drum(0, .2, 90); [0, 2, 4].forEach((s, k) => mar(PENT[s + 3], .2 + k * .1, .1)); }
  if (kind === 'jackpot') { drum(0, .5, 55, 1.4); drum(.45, .5, 55, 1.4); drum(.9, .5, 60, 1.2); [0, 2, 4, 5, 7, 8, 9, 10, 9, 10].forEach((s, k) => mar(PENT[s], 1.3 + k * .09, .13, .8)); noise(1.2, .08, 0, 250); }
  return [];
}
// Jungle ambience: a low drone, a leaf-rustle bed (filtered noise) and now and then a tree-frog chirp.
function ambient() {
  clearInterval(drumTimer); ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; if (!state.ambient || state.muted || !ac) return;
  [55, 82.41, 110].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = i * 4; g.gain.value = .009 / (i + 1); o.connect(g); g.connect(master); o.start(); ambNodes.push(o); });
  try { const n = ac.sampleRate * 2, b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), hp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; s.loop = true; hp.type = 'highpass'; hp.frequency.value = 900; lp.type = 'lowpass'; lp.frequency.value = 4200; g.gain.value = .013; s.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master); s.start(); ambNodes.push(s); } catch (e) {}
  drumTimer = setInterval(() => { if (!ac || state.muted || document.hidden) return; const f = 2200 + Math.random() * 900; for (let k = 0; k < 3; k++) tone(f, .05, 'sine', .012, k * .07); }, 5200);
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
