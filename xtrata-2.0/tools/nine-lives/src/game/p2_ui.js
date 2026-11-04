const SUB = { 'POUNCE': 'spin the reels', 'POUNCING…': 'reels are spinning', 'POWER UP': 'wake the cats (test)', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'respin the rooftops', SPIN: 'spin now', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'POUNCING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : 'START';
    if (st === 'summary') return p.bonus === 'gamble' ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : 'RESPIN';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'SPIN' : '…';
    return '…';
  }
  if (dark() && !f && !state.free) return 'POWER UP';
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'POUNCE';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'NIGHT PROWL WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} NIGHT PROWL · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot);
  $('gamble').hidden = $('gHeads').hidden = $('gTails').hidden = $('collect').hidden = !canGamble; $('testBtn').hidden = !(TESTBUILD || lab.on);
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || 'press space'; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 7);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-PROWL'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  screenDirty = true;
}

/* ---------- Procedural audio: a soft brushed-drum jazz trio under the reels, a purr on small wins, a big-band sting on the jackpot ---------- */
let ac = null, master = null, ambNodes = [];
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
// A purr: a low, soft saw wobbling at about 24 Hz, fading in and out. Used for every small win.
function purr(d = 1.2, v = .05, delay = 0) { if (!ac || state.muted) return; const t = ac.currentTime + delay, o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), g = ac.createGain(), lp = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = 62; lfo.frequency.value = 24; lg.gain.value = .5; lp.type = 'lowpass'; lp.frequency.value = 420; g.gain.value = 0; lfo.connect(lg); lg.connect(g.gain); o.connect(lp); lp.connect(g); g.connect(master); const env = ac.createGain(); env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(v * 2, t + .25); env.gain.linearRampToValueAtTime(0, t + d); g.disconnect(); g.connect(env); env.connect(master); o.start(t); lfo.start(t); o.stop(t + d + .05); lfo.stop(t + d + .05); }
// A brass hit: two detuned saws through a low-pass that opens and closes, like a horn section stab.
function horn(m, d = .5, v = .05, delay = 0) { if (!ac || state.muted) return; const t = ac.currentTime + delay, g = ac.createGain(), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.setValueAtTime(500, t); lp.frequency.linearRampToValueAtTime(2600, t + .08); lp.frequency.exponentialRampToValueAtTime(700, t + d); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + d); lp.connect(g); g.connect(master); for (const dt of [-7, 7]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + d + .05); } }
// A soft electric-piano note: a sine with a quiet octave and a fast bell decay.
function keys(m, d = .9, v = .045, delay = 0) { tone(mtof(m), d, 'sine', v, delay); tone(mtof(m) * 2, d * .5, 'sine', v * .35, delay); tone(mtof(m) * 4.01, .12, 'sine', v * .12, delay); }
const JAZZ = [[59, 62, 65, 69, 47], [64, 68, 62, 67, 52], [57, 60, 64, 67, 45], [57, 60, 64, 67, 45]]; // Bm7b5 · E7 · Am7 · Am7: [three chord tones, a colour tone, the bass root]
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { noise(.5, .035, 0, 4000); tone(98, .5, 'triangle', .05, 0, 2.2); tone(147, .5, 'sine', .03, .05, 2.2); }
  if (kind === 'stop') return [tone(90 + i * 12, .14, 'triangle', .26, at), tone(900 + i * 150, .05, 'sine', .03, at), noise(.07, .03, at, 5000) && null].filter(Boolean);
  if (kind === 'drop') { tone(110, .9, 'triangle', .2, 0, .4); tone(55, 1, 'sine', .3, 0, .6); noise(.2, .05, 0, 500); }
  if (kind === 'win') { purr(1.1, .05); [69, 72, 76].forEach((m, k) => keys(m, .7, .04, .1 + k * .09)); }
  if (kind === 'big') { purr(1.6, .06); [60, 64, 67, 72, 76, 79].forEach((m, k) => keys(m, .9, .05, k * .08)); horn(55, .6, .04, .35); horn(62, .6, .035, .35); }
  if (kind === 'bonus') { [57, 60, 64, 67, 69, 72].forEach((m, k) => keys(m, .8, .05, k * .1)); [45, 52].forEach(m => horn(m, .9, .035, .5)); noise(.7, .02, .4, 6000); }
  if (kind === 'antic') { tone(147, 1.6, 'triangle', .035, 0, 2.5); noise(1.4, .018, 0, 7000); }
  if (kind === 'lock') { keys(76 + i, .5, .05, i * .08); tone(mtof(64 + i) , .2, 'sine', .04, i * .08); }
  if (kind === 'respin') tone(392, .25, 'triangle', .14, 0, .75);
  if (kind === 'pick') { keys(72 + i * 2, .5, .05); noise(.06, .03, 0, 5000); }
  if (kind === 'click') tone(1000, .04, 'sine', .04);
  if (kind === 'lose') tone(165, .45, 'triangle', .08, 0, .6);
  if (kind === 'swap') { tone(520, .25, 'sine', .1, 0, 1.5); tone(780, .25, 'sine', .1, .12, .7); }
  if (kind === 'power') { purr(1.4, .06); [45, 52, 57, 60, 64].forEach((m, k) => keys(m + 12, .9, .045, .35 + k * .13)); }
  if (kind === 'crash') { noise(.4, .22, 0, 1500); noise(.4, .2, .15, 1500); noise(.4, .2, .3, 1500); tone(60, 1.4, 'triangle', .25, .4, .35); [57, 60, 64, 67, 71, 76].forEach((m, k) => { horn(m, 1.1, .05, 1.1 + k * .03); horn(m - 12, 1.1, .035, 1.1 + k * .03); }); [69, 72, 76, 81, 84].forEach((m, k) => keys(m, 1, .05, 1.5 + k * .09)); }
  return [];
}
// The bed: a quiet swung trio, one bar at a time. Brushes on the ride, a walking upright bass, and a few comping chords. Reduced-motion players still get it: the audio is theirs to mute.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; if (!state.ambient || state.muted || !ac) return;
  let bar = 0; const BPM = 78, beat = 60 / BPM, quiet = () => state.muted || !state.ambient;
  const playBar = () => { if (quiet() || !ac) return; const c = JAZZ[bar % 4], t0 = .05;
    for (let b = 0; b < 4; b++) { const walk = [c[4], c[4] + 7, c[4] + 3 + (bar % 2) * 2, c[4] + 12][b]; tone(mtof(walk), beat * .9, 'triangle', .05, t0 + b * beat); } // walking bass
    for (let b = 0; b < 8; b++) { const sw = (b % 2 ? .66 : 0) * beat; noise(.09, b % 2 ? .006 : .011, t0 + Math.floor(b / 2) * beat + sw, 7000); } // swung brushes on the ride
    noise(.14, .01, t0 + beat, 3000); noise(.14, .01, t0 + 3 * beat, 3000); // snare brush sweep on 2 and 4
    if (bar % 2 === 0) { keys(c[0], 1.4, .02, t0 + beat * .66); keys(c[1], 1.4, .02, t0 + beat * .66); keys(c[2], 1.4, .02, t0 + beat * .66); }
    bar++; };
  playBar(); const id = setInterval(playBar, beat * 4000); ambNodes.push({ stop() { clearInterval(id); } });
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
