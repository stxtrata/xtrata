const SUB = { INSCRIBE: 'spin the reels', 'INSCRIBING…': 'reels are spinning', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'stack a layer', STEP: 'play the next step', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'INSCRIBING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : 'START';
    if (st === 'summary') return p.bonus === 'gamble' ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : 'RESPIN';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'STEP' : '…';
    return '…';
  }
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'INSCRIBE';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet); $('balLabel').textContent = lab.on ? 'LAB BALANCE' : 'LAYR BALANCE';
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'SESSION WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} STEPS · 2×` : 'LAYR';
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot);
  $('gamble').hidden = $('gBtc').hidden = $('gStx').hidden = $('collect').hidden = !canGamble; $('testBtn').hidden = !TESTBUILD; $('labBtn').hidden = !LAB_ALLOWED;
  $('labBtn').setAttribute('aria-pressed', String(lab.on)); $('labBtn').lastChild.textContent = lab.on ? 'leave the lab' : 'test bonuses';
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || (label.startsWith('OPEN') ? 'tap a cicada' : 'press space'); $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 8); $('spin').classList.toggle('waiting', !!pres && !spinning && label !== '…');
  $('spin').disabled = sessionLock && !lab.on || !LAYR.ready() && !lab.on || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || (sessionLock && !lab.on);
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-LAYER'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  if (document.activeElement !== $('vol')) $('vol').value = state.volume;
  screenDirty = true;
}

/* ---------- Sound: Audionaut Analog Kit hits, cicada calls sung from their own seeds, synth swells. All bundled; nothing loads at play time. ---------- */
let ac = null, master = null, ambNodes = [];
const soundLog = [], BUF = {}; let buffersLoading = null;
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } loadBuffers(); ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function loadBuffers() {
  if (buffersLoading || !ac) return buffersLoading; const A = window.XO_ART || {}, jobs = [];
  const dec = (key, uri) => jobs.push(fetch(uri).then(r => r.arrayBuffer()).then(b => new Promise((res, rej) => ac.decodeAudioData(b, res, rej))).then(b => { BUF[key] = b; }).catch(() => {}));
  for (const [k, v] of Object.entries(A.kit || {})) dec('kit:' + k, v.uri);
  (A.calls || []).forEach(c => dec('call:' + c.seed, c.uri));
  return (buffersLoading = Promise.all(jobs));
}
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); f.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
// Play a bundled buffer: a kit hit, or a slice of a cicada's seed-encoded call.
function playBuf(key, { at = 0, gain = .5, rate = 1, offset = 0, dur = null, fade = .03 } = {}) {
  if (!ac || state.muted || !BUF[key]) return null; const s = ac.createBufferSource(), g = ac.createGain(), t = ac.currentTime + at; s.buffer = BUF[key]; s.playbackRate.value = rate; s.connect(g); g.connect(master);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + .006); if (dur) { g.gain.setValueAtTime(gain, t + Math.max(.01, dur - fade)); g.gain.linearRampToValueAtTime(0, t + dur); }
  s.start(t, offset, dur ? dur + .02 : undefined); return s;
}
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const ARP = [196, 233.08, 293.66, 349.23, 392, 466.16, 587.33, 698.46]; // G minor: the Audionaut's dusk palette
const callKeys = () => Object.keys(BUF).filter(k => k.startsWith('call:'));
// Session Mode's beat: 16 steps on four lanes, built from the Analog Kit hits (CC0, Audionaut sample library).
const BEAT = { kick: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,1,0,0], snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1], hat: [1,1,0,1, 1,0,1,1, 1,1,0,1, 1,0,1,1], open: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0], rim: [0,0,0,1, 0,0,0,0, 0,1,0,0, 0,0,1,0] };
const LANES = ['kick', 'snare', 'hat', 'open', 'rim'];
function stepSound(step, at = 0) { const s = step % 16; LANES.forEach((k, i) => { if (BEAT[k][s]) playBuf('kit:' + k, { at, gain: [.9, .7, .35, .32, .45][i] }); }); tone(ARP[[0, 2, 4, 2, 5, 4, 2, 1][s % 8]] / 2, .22, 'sawtooth', .025, at); }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { tone(98, .5, 'sawtooth', .04, 0, 2); tone(147, .5, 'triangle', .03, .05, 2); playBuf('kit:hat', { gain: .25 }); }
  if (kind === 'stop') { // a click, a rim hit and a short slice of a real cicada call: each reel lands with a chirp
    const keys = callKeys(), k = keys.length ? keys[(i * 3 + Math.floor(Math.random() * keys.length)) % keys.length] : null, out = [tone(70 + i * 12, .12, 'triangle', .2, at), tone(2400 + i * 160, .04, 'square', .012, at)].filter(Boolean);
    const r = playBuf('kit:rim', { at, gain: .18, rate: 1 + i * .04 }); if (r) out.push(r);
    if (k) { const c = playBuf(k, { at, gain: .3, offset: .9 + Math.random() * 4.2, dur: .2, rate: 1 + (i - 2) * .03 }); if (c) out.push(c); }
    return out;
  }
  if (kind === 'drop') { playBuf('kit:kick', { gain: .7 }); tone(110, .5, 'sine', .14, 0, .5); }
  if (kind === 'win') { playBuf('kit:kick', { gain: .7 }); playBuf('kit:snare', { at: .16, gain: .5 }); ARP.slice(0, 5).forEach((n, k) => tone(n * 2, .28, 'triangle', .05, k * .07)); }
  if (kind === 'big') { [0, .15, .3, .45].forEach((t, k) => { playBuf('kit:kick', { at: t, gain: .8 }); if (k % 2) playBuf('kit:snare', { at: t, gain: .55 }); playBuf('kit:hat', { at: t + .075, gain: .25 }); }); ARP.forEach((n, k) => { tone(n * 2, .42, 'sawtooth', .04, k * .07); tone(n, .5, 'triangle', .05, k * .07); }); }
  if (kind === 'bonus') { playBuf('kit:open', { gain: .4 }); [0, 2, 4, 6, 7].forEach((s, k) => { tone(ARP[s] * 2, .55, 'sawtooth', .045, k * .1); tone(ARP[s] * 2.004, .55, 'square', .016, k * .1); }); playBuf('kit:kick', { at: .5, gain: .8 }); }
  if (kind === 'antic') { tone(196, 1.6, 'sawtooth', .025, 0, 2); const k = callKeys()[0]; if (k) playBuf(k, { gain: .18, offset: 2, dur: 1.4 }); }
  if (kind === 'lock') { playBuf('kit:rim', { at: i * .08, gain: .5 }); tone(587 + i * 70, .3, 'triangle', .06, i * .08); tone(1174 + i * 140, .2, 'sine', .03, i * .08 + .02); }
  if (kind === 'respin') { playBuf('kit:hat', { gain: .3 }); tone(392, .25, 'triangle', .12, 0, .7); }
  if (kind === 'pick') { playBuf('kit:open', { gain: .25 }); tone(784 + i * 40, .3, 'triangle', .05); }
  if (kind === 'click') tone(1046, .04, 'square', .025);
  if (kind === 'lose') { tone(196, .45, 'sawtooth', .06, 0, .5); playBuf('kit:kick', { gain: .4, rate: .8 }); }
  if (kind === 'swap') { tone(587, .25, 'sine', .1, 0, 1.6); tone(932, .25, 'sine', .1, .12, .6); playBuf('kit:hat', { at: .1, gain: .3 }); }
  if (kind === 'swell') { // The X: a layered synth swell (three detuned stacks under a sweeping filter) over the kit
    const t = ac.currentTime, f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'lowpass'; f.frequency.setValueAtTime(220, t); f.frequency.exponentialRampToValueAtTime(5200, t + 3.2); f.Q.value = 6; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + 2.6); g.gain.exponentialRampToValueAtTime(.0001, t + 6.2); f.connect(g); g.connect(master);
    [[98, 0], [146.83, 7], [196, -5], [293.66, 4], [392, -9]].forEach(([fr, dt]) => { for (const d of [-8, 0, 8]) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fr; o.detune.value = dt + d; o.connect(f); o.start(t); o.stop(t + 6.3); } });
    [2.6, 2.9, 3.2, 3.5, 3.6, 3.8].forEach((x, k) => playBuf(k % 2 ? 'kit:snare' : 'kit:kick', { at: x, gain: .8 })); playBuf('kit:open', { at: 3.8, gain: .5 });
  }
  return [];
}
// A pad under the cabinet, plus a faint bed of cicada calls (real seeds, very quiet) when ambience is on.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; if (!state.ambient || state.muted || !ac) return;
  [49, 73.42, 98, 146.83].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = i * 3; g.gain.value = .01 / (i + 1); o.connect(g); g.connect(master); o.start(); ambNodes.push(o); });
  (buffersLoading || Promise.resolve()).then(() => { const k = callKeys()[1]; if (!k || !state.ambient || state.muted) return; const s = playBuf(k, { gain: .025 }); if (s) { s.loop = true; ambNodes.push(s); } });
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
