
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'no-store' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
async function getText(url) { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw Error(`HTTP ${r.status}`); return (await r.text()).trim(); }
const SUB = { MINE: 'spin the reels', 'MINING…': 'reels are spinning', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'mine the next round', SPIN: 'next free spin', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'MINING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : p.bonus === 'jackpot' ? '…' : 'START';
    if (st === 'summary') return p.bonus === 'gamble' || p.bonus === 'epoch' || p.bonus === 'halvingday' ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : 'RESPIN';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'SPIN' : '…';
    return '…';
  }
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'MINE';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'HALVING CYCLE WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} FREE SPINS · 2×` : (lab.on ? 'LAB LAYR' : 'LAYR');
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot); $('leftSide').textContent = Number.isFinite(blocksLeft()) ? fmt(blocksLeft()) : '—';
  $('gamble').hidden = $('gYes').hidden = $('gNo').hidden = $('collect').hidden = !canGamble;
  $('labBtn').hidden = !(LAB_ALLOWED || lab.on); $('testBtn').hidden = !TESTBUILD;
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || (label.startsWith('OPEN') ? 'open a sealed block' : 'press space'); $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 9);
  $('spin').disabled = sessionLock && !lab.on || !LAYR.ready() && !lab.on || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || (sessionLock && !lab.on);
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || (sessionLock && !lab.on);
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-MINE'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  const vol = $('vol'); if (vol && document.activeElement !== vol) vol.value = state.volume;
  document.body.classList.toggle('lab-on', lab.on);
  screenDirty = true;
}

/* ---------- Procedural audio: the rig's fan hum, relay clicks on reel stops, the breaker's clunk, split-flap clatter ---------- */
let ac = null, master = null, ambNodes = [], ambTimer = 0;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1, vib = 0) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); if (vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 5.5; lg.gain.value = f * vib; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + d + .05); } o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800, lp = 0, sweep = 0) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); let last = f; if (lp) { const l = ac.createBiquadFilter(); l.type = 'lowpass'; l.frequency.setValueAtTime(lp, t); if (sweep) l.frequency.exponentialRampToValueAtTime(Math.max(60, lp * sweep), t + d); f.connect(l); last = l; } last.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const relay = (delay = 0, k = 0) => { noise(.012, .35, delay, 2500, 12000); tone(1800 + k * 90, .02, 'square', .03, delay); tone(110, .05, 'sine', .12, delay + .004); }; // a relay contact closing
const flap = (delay = 0) => { noise(.018, .16, delay, 1200, 7000); tone(2600, .012, 'square', .012, delay); }; // one split-flap leaf
// An industrial minor pentatonic in A, for the stings.
const PENT = [110, 130.81, 146.83, 164.81, 196, 220, 261.63, 293.66, 329.63, 392];
function synth(f, d, v, delay) { tone(f, d, 'sawtooth', v * .5, delay, 1); tone(f * 1.005, d, 'square', v * .3, delay); tone(f / 2, d, 'triangle', v * .6, delay); }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { noise(.08, .5, 0, 80, 900); tone(55, .25, 'sine', .35); /* the breaker clunks down */
    if (!reduced()) { const o = BRK.off / 1000, n = BRK.on / 1000; noise(.09, .22, o, 3000, 14000); noise(.05, .16, o + .04, 5000, 16000); tone(3200, .04, 'square', .02, o + .01); /* the contacts open with an arc */
      tone(120, .22, 'sawtooth', .035, o, .35); /* the rig's hum dies */ relay(n, 1); tone(50, .18, 'sine', .3, n); /* it closes again */ tone(70, .5, 'sawtooth', .03, n + .03, 2.4); /* and the power whines back up */ }
    noise(1.3, .06, .06, 200, 1800, 2.6); tone(98, 1.2, 'sawtooth', .03, .08, 1.8); /* the fans spin up */ }
  if (kind === 'stop') return [noise(.012, .32, at, 2500, 12000), tone(1700 + i * 140, .02, 'square', .03, at), tone(96 + i * 6, .07, 'sine', .14, at + .004)].filter(Boolean);
  if (kind === 'win') { [0, 2, 4].forEach((k, j) => synth(PENT[k + 5], .3, .06, j * .08)); tone(PENT[9] * 2, .5, 'sine', .03, .26); }
  if (kind === 'big') { PENT.slice(3).forEach((n, j) => synth(n, .5, .05, j * .06)); tone(55, 1.2, 'sawtooth', .07, 0, 1, .02); tone(880, 1.0, 'sine', .04, .4, 1, .01); }
  if (kind === 'bonus') { [0, 0, 4, 4, 5, 7].forEach((k, j) => synth(PENT[k], .22, .07, j * .13)); noise(.6, .04, .1, 300, 3000, 3); for (let k = 0; k < 6; k++) relay(.9 + k * .05, k); }
  if (kind === 'antic') { tone(55, 1.6, 'sawtooth', .06, 0, 2, .02); noise(1.6, .03, 0, 400, 1200, 4); }
  if (kind === 'lock') { relay(i * .08, i); tone(55, .2, 'sine', .3, i * .08); noise(.08, .25, i * .08, 120, 900); /* a block lands: thump */ synth(PENT[5 + (i % 5)], .18, .05, i * .08 + .05); }
  if (kind === 'stamp') { noise(.07, .3, 0, 150, 1200); tone(50, .2, 'sine', .3); }
  if (kind === 'respin') { for (let k = 0; k < 3; k++) relay(k * .06, k); noise(.5, .03, 0, 300, 2400, 2); }
  if (kind === 'pick') { noise(.25, .1, 0, 600, 5000, .4); /* the seal cracks */ relay(.1); synth(PENT[5 + (i % 5)], .4, .05, .2); }
  if (kind === 'click') relay();
  if (kind === 'lose') { tone(146.83, .5, 'sawtooth', .06, 0, .5); tone(73.4, .7, 'triangle', .1, .15, .6); }
  if (kind === 'split') { noise(.3, .25, 0, 1500, 9000, .3); tone(1320, .4, 'sine', .06, 0, .5); tone(660, .5, 'sine', .06, .05, .5); } // a coin cracks in two
  if (kind === 'flaps') { const n = i || 24; for (let k = 0; k < n; k++) flap(k * .028 + Math.random() * .01); }
  if (kind === 'swap') { noise(.25, .05, 0, 4000); tone(880, .3, 'sine', .07, 0, 1.4); }
  if (kind === 'jackpot') { for (let k = 0; k < 60; k++) flap(k * .03); [0, 2, 4, 5, 7, 9, 7, 5, 4, 5, 7, 9].forEach((k, j) => synth(PENT[k], .3, .07, 1.2 + j * .16)); tone(55, 3, 'sawtooth', .06, 1.2, 1, .02); tone(1046.5, 2.2, 'sine', .04, 2.4, 1, .015); }
  return [];
}
// Ambience (Settings): the rig's fans: a low hum with the slow beat of the blades, and an amber LED tick each block interval.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; clearInterval(ambTimer); if (!state.ambient || state.muted || !ac) return;
  try { const n = ac.sampleRate * 2, b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); let last = 0; for (let k = 0; k < n; k++) { last = .98 * last + .02 * (Math.random() * 2 - 1); a[k] = last * 3; }
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(); s.buffer = b; s.loop = true; f.type = 'lowpass'; f.frequency.value = 420; g.gain.value = .05; lfo.frequency.value = 7.5; lg.gain.value = .018; lfo.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(master); s.start(); lfo.start();
    const hum = ac.createOscillator(), hg = ac.createGain(); hum.frequency.value = 100; hum.type = 'sine'; hg.gain.value = .012; hum.connect(hg); hg.connect(master); hum.start(); ambNodes.push(s, lfo, hum); } catch (e) {}
  ambTimer = setInterval(() => { if (ac && !state.muted && state.ambient) relay(0, 2); }, 6000);
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
