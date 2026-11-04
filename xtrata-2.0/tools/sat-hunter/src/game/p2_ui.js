
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SUB = { HUNT: 'spin the reels', 'HUNTING…': 'reels are spinning', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'scan the next round', SPIN: 'next free spin', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'HUNTING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : p.bonus === 'jackpot' ? '…' : 'START';
    if (st === 'summary') return p.bonus === 'gamble' || ['epoch', 'period', 'snapshot', 'halvingday', 'rare', 'rarefind'].includes(p.bonus) ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : 'RESPIN';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'SPIN' : '…';
    return '…';
  }
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'HUNT';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, setT = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  setT('balance', fmt(state.balance)); setT('bet', fmt(shownBet));
  const showFree = state.freeActive && state.freeCount > 0;
  setT('lastWin', fmt(showFree ? state.freeTotal : state.lastWin));
  setT('winLabel', showFree ? "SATOSHI'S STASH WIN" : 'LAST WIN');
  setT('freeCount', state.free ? `${state.free} FREE SPINS · 2×` : (lab.on ? 'LAB LAYR' : 'LAYR'));
  setT('spins', fmt(state.spins)); setT('wagered', fmt(state.wagered)); setT('paidOut', fmt(state.paidOut));
  setT('meterSide', fmt(E.meter(state, shownBet))); setT('potSide', fmt(state.pot)); setT('leftSide', periodText());
  $('gamble').hidden = $('gYes').hidden = $('gNo').hidden = $('collect').hidden = !canGamble;
  $('labBtn').hidden = !(LAB_ALLOWED || lab.on); $('testBtn').hidden = !TESTBUILD;
  const label = spinLabel(f, broke);
  setT('spinText', label); setT('spinSub', SUB[label] || (label.startsWith('OPEN') ? 'open a sealed tube' : 'press space')); $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 9);
  $('spin').disabled = sessionLock && !lab.on || !LAYR.ready() && !lab.on || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || (sessionLock && !lab.on);
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || (sessionLock && !lab.on);
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-HUNT'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  const vol = $('vol'); if (vol && document.activeElement !== vol) vol.value = state.volume;
  document.body.classList.toggle('lab-on', lab.on);
  screenDirty = true;
}

/* ---------- Procedural audio: fine brass chimes on reel stops, a magnifier zoom on every rare find, glass clinks when a tube unseals,
   a stamp thud on locks, a choir on the Mythic, and the hum of the assay lab ---------- */
let ac = null, master = null, ambNodes = [], ambTimer = 0;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1, vib = 0) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); if (vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 5.5; lg.gain.value = f * vib; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + d + .05); } o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800, lp = 0, sweep = 0) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); let last = f; if (lp) { const l = ac.createBiquadFilter(); l.type = 'lowpass'; l.frequency.setValueAtTime(lp, t); if (sweep) l.frequency.exponentialRampToValueAtTime(Math.max(60, lp * sweep), t + d); f.connect(l); last = l; } last.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const relay = (delay = 0, k = 0) => { noise(.01, .22, delay, 3000, 12000); tone(2300 + k * 80, .02, 'triangle', .03, delay); tone(190, .04, 'sine', .09, delay + .003); }; // a brass latch closing
const flap = (delay = 0) => { noise(.014, .1, delay, 2200, 8000); tone(1900, .01, 'square', .01, delay); }; // one tick of the clockwork
// A bright major pentatonic for the bells.
const PENT = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880];
function bell(f, d, v, delay) { tone(f, d * 1.8, 'sine', v * .6, delay); tone(f * 2.756, d * .6, 'sine', v * .22, delay); tone(f * 5.4, d * .3, 'sine', v * .08, delay); }
function synth(f, d, v, delay) { bell(f, d, v, delay); }
// A choir voice: four detuned saw tones through three formant filters (a vowel), swelling and fading.
function choir(f, d = 2.4, v = .1, delay = 0, vowel = 0) {
  if (!ac || state.muted) return; const F = [[800, 1150, 2900], [400, 800, 2600], [650, 1080, 2650], [330, 2000, 2800]][vowel % 4], t = ac.currentTime + delay, out = ac.createGain();
  out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(v * 2.2, t + d * .35); out.gain.linearRampToValueAtTime(v * 1.7, t + d * .7); out.gain.exponentialRampToValueAtTime(.0001, t + d); out.connect(master);
  const bands = F.map((fr, i) => { const b = ac.createBiquadFilter(), gg = ac.createGain(); b.type = 'bandpass'; b.frequency.value = fr; b.Q.value = 7 + i * 4; gg.gain.value = [1, .55, .28][i]; b.connect(gg); gg.connect(out); return b; });
  [-9, -3, 4, 11].forEach((cents, i) => { const o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = f * Math.pow(2, cents / 1200); lfo.frequency.value = 4.6 + i * .43; lg.gain.value = f * .005; lfo.connect(lg); lg.connect(o.frequency); bands.forEach(b => o.connect(b)); o.start(t); lfo.start(t); o.stop(t + d + .05); lfo.stop(t + d + .05); });
}
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { noise(.06, .4, 0, 80, 700); tone(70, .22, 'sine', .3); /* the rocker drops and the gears whirr */ noise(.9, .05, .05, 300, 2200, 2.2); tone(180, .9, 'triangle', .02, .06, 1.6); }
  if (kind === 'stop') { const f = [1046.5, 1174.66, 1318.51, 1567.98, 1760][i % 5]; return [noise(.012, .2, at, 3000, 12000), tone(f, .45, 'sine', .07, at), tone(f * 2.01, .22, 'triangle', .018, at), tone(88 + i * 5, .06, 'sine', .08, at + .003)].filter(Boolean); }
  if (kind === 'win') { [0, 2, 4].forEach((k, j) => bell(PENT[k + 3], .5, .09, j * .09)); tone(PENT[9] * 2, .6, 'sine', .025, .3); }
  if (kind === 'big') { PENT.slice(2).forEach((n, j) => bell(n, .7, .08, j * .07)); bell(130.81, 1.6, .12, 0); noise(.9, .03, .1, 3000, 9000, .5); }
  if (kind === 'bonus') { [0, 2, 4, 5, 7, 9].forEach((k, j) => bell(PENT[k], .5, .09, j * .12)); noise(.6, .035, .1, 2000, 9000, 2); sound('zoom', 0, .85); }
  if (kind === 'antic') { tone(440, 1.6, 'sine', .04, 0, 2.2, .01); noise(1.6, .025, 0, 1500, 3500, 3); }
  if (kind === 'lock') { noise(.07, .3, i * .08, 100, 900); tone(60, .2, 'sine', .32, i * .08); bell(PENT[3 + (i % 6)], .35, .07, i * .08 + .04); } // a brass stamp lands
  if (kind === 'stamp') { noise(.07, .32, 0, 120, 1100); tone(52, .22, 'sine', .34); tone(1500, .05, 'triangle', .03, .01); }
  if (kind === 'respin') { for (let k = 0; k < 4; k++) tone(900 + k * 220, .05, 'sine', .05, k * .05); noise(.4, .025, 0, 600, 2400, 3); }
  if (kind === 'pick') { noise(.1, .18, 0, 300, 1500, .5); /* the cork lifts */ tone(260, .12, 'sine', .12, 0, .6); sound('clink', 0, .06); bell(PENT[5 + (i % 5)], .5, .05, .22); }
  if (kind === 'clink') { [2093, 2637, 3136].forEach((f, j) => tone(f, .5, 'sine', .05, at + j * .04)); noise(.02, .12, at, 4000, 12000); }
  if (kind === 'click') relay();
  if (kind === 'lose') { tone(196, .4, 'triangle', .07, 0, .6); tone(98, .6, 'sine', .1, .12, .6); }
  if (kind === 'split') { tone(1568, .4, 'sine', .05, 0, 1.5); bell(PENT[7], .5, .07, .06); sound('zoom', 0, .02); } // a sat of the Stash lights up
  if (kind === 'zoom') { noise(.3, .1, at, 200, 600, 8); tone(500, .28, 'sine', .04, at, 3); relay(at + .27); } // the magnifier
  if (kind === 'flaps') { const n = i || 24; for (let k = 0; k < n; k++) flap(k * .028 + Math.random() * .01); }
  if (kind === 'swap') { noise(.25, .05, 0, 4000); tone(880, .3, 'sine', .07, 0, 1.4); }
  if (kind === 'choir') { [220, 329.63, 440, 554.37].forEach((f, j) => choir(f, 3.2, .06, j * .25, j)); }
  if (kind === 'jackpot') { sound('zoom', 0, 0); for (let k = 0; k < 40; k++) flap(k * .03); [220, 329.63, 440, 554.37, 659.25, 880].forEach((f, j) => choir(f, 4.2, .055, 1.0 + j * .3, j)); [0, 2, 4, 5, 7, 9, 7, 5, 4, 5, 7, 9].forEach((k, j) => bell(PENT[k] * 2, .5, .06, 1.4 + j * .16)); tone(55, 3, 'sine', .08, 1.2, 1, .01); }
  return [];
}
// Ambience (Settings): the assay lab's hum: the low note of the lamps, a soft draught, and a brass clock ticking now and then.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; clearInterval(ambTimer); if (!state.ambient || state.muted || !ac) return;
  try { const n = ac.sampleRate * 2, b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); let last = 0; for (let k = 0; k < n; k++) { last = .985 * last + .015 * (Math.random() * 2 - 1); a[k] = last * 3; }
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(); s.buffer = b; s.loop = true; f.type = 'lowpass'; f.frequency.value = 300; g.gain.value = .035; lfo.frequency.value = .18; lg.gain.value = .012; lfo.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(master); s.start(); lfo.start();
    const hum = ac.createOscillator(), hg = ac.createGain(), hum2 = ac.createOscillator(), hg2 = ac.createGain(); hum.frequency.value = 60; hum.type = 'sine'; hg.gain.value = .014; hum.connect(hg); hg.connect(master); hum.start(); hum2.frequency.value = 120; hum2.type = 'sine'; hg2.gain.value = .006; hum2.connect(hg2); hg2.connect(master); hum2.start(); ambNodes.push(s, lfo, hum, hum2); } catch (e) {}
  let beat = 0; ambTimer = setInterval(() => { if (ac && !state.muted && state.ambient) { tone(beat++ % 2 ? 1568 : 1319, .05, 'sine', .01); noise(.01, .04, 0, 3000, 9000); } }, 2500);
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
