const SUB = { 'JACK IN': 'spin the reels', 'JACKING IN…': 'reels are spinning', 'POWER UP': 'switch on (test)', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'respin the street', SPIN: 'spin now', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'JACKING IN…';
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
  return broke ? 'GET LAYR' : 'JACK IN';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'JACKED IN WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} JACKED IN · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot);
  $('gamble').hidden = $('gHeads').hidden = $('gHacks').hidden = $('collect').hidden = !canGamble; $('testBtn').hidden = !(TESTBUILD || lab.on);
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || 'press space'; $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 7);
  $('spin').disabled = sessionLock || !LAYR.ready() || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || sessionLock;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTOPILOT'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  screenDirty = true;
}

/* ---------- Procedural audio: synthwave arpeggios, a rain bed, a bass drop when a forever punk lands ---------- */
let ac = null, master = null, ambNodes = [];
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const ARP = [220, 261.63, 329.63, 440, 523.25, 659.25, 880, 1046.5];
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { tone(110, .6, 'sawtooth', .05, 0, 3); tone(165, .6, 'sawtooth', .03, .04, 3); noise(.4, .03, 0, 3000); }
  if (kind === 'stop') return [tone(80 + i * 14, .14, 'triangle', .26, at), tone(1100 + i * 170, .06, 'square', .025, at), tone(2200 + i * 260, .1, 'sine', .02, at + .01)].filter(Boolean);
  if (kind === 'drop') { tone(150, .8, 'sawtooth', .16, 0, .22); tone(52, .9, 'sine', .34, 0, .6); noise(.25, .06, 0, 400); }
  if (kind === 'win') ARP.slice(0, 6).forEach((n, k) => { tone(n, .32, 'sawtooth', .05, k * .075); tone(n * 2, .22, 'square', .018, k * .075 + .01); });
  if (kind === 'big') { ARP.forEach((n, k) => { tone(n, .42, 'sawtooth', .055, k * .07); tone(n / 2, .5, 'triangle', .07, k * .07); }); tone(55, 1, 'sine', .3, .1, .7); }
  if (kind === 'bonus') { [0, 2, 4, 5, 6, 7].forEach((s, k) => { tone(ARP[s], .5, 'sawtooth', .06, k * .1); tone(ARP[s] * 1.005, .5, 'square', .02, k * .1); }); noise(.8, .03, .4, 5000); }
  if (kind === 'antic') tone(180, 1.6, 'sawtooth', .03, 0, 3);
  if (kind === 'lock') { tone(880 + i * 90, .28, 'square', .05, i * .08); tone(440 + i * 45, .25, 'sawtooth', .04, i * .08); noise(.1, .03, i * .08, 6000); }
  if (kind === 'respin') tone(420, .25, 'triangle', .16, 0, .7);
  if (kind === 'pick') { tone(659 + i * 55, .3, 'square', .05); tone(1318 + i * 110, .2, 'sine', .04, .02); noise(.08, .03, 0, 5000); }
  if (kind === 'click') tone(880, .05, 'square', .035);
  if (kind === 'lose') tone(150, .4, 'sawtooth', .07, 0, .5);
  if (kind === 'swap') { tone(600, .25, 'sine', .1, 0, 1.6); tone(960, .25, 'sine', .1, .12, .6); noise(.3, .03, .1, 7000); }
  if (kind === 'power') { tone(55, 1.2, 'sawtooth', .1, 0, 4); [0, 3, 5, 7].forEach((s, k) => tone(ARP[s], .6, 'sawtooth', .05, .4 + k * .12)); noise(.6, .04, .2, 4000); }
  if (kind === 'crash') { noise(1.2, .2, 0, 300); tone(70, 1.4, 'sawtooth', .22, 0, .3); [0, 1, 2, 3, 4, 5].forEach(k => tone(ARP[7 - k], .35, 'square', .05, 1.5 + k * .08)); }
  return [];
}
// A rain bed (filtered noise) under a low A-minor pad.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; if (!state.ambient || state.muted || !ac) return;
  [55, 82.41, 110, 164.81].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = i * 3; g.gain.value = .011 / (i + 1); o.connect(g); g.connect(master); o.start(); ambNodes.push(o); });
  try { const n = ac.sampleRate * 2, b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), hp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; s.loop = true; hp.type = 'highpass'; hp.frequency.value = 1500; lp.type = 'lowpass'; lp.frequency.value = 7500; g.gain.value = .016; s.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master); s.start(); ambNodes.push(s); } catch (e) {}
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
