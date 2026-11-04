
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
const SUB = { INVESTIGATE: 'spin the reels', 'INVESTIGATING…': 'reels are spinning', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', 'OPEN THE FILE': 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'respin the blocks', SPIN: 'next free spin', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'INVESTIGATING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : p.bonus === 'jackpot' ? '…' : 'START';
    if (st === 'summary') return p.bonus === 'gamble' ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : chainBusy() ? 'SEARCHING…' : 'RESPIN';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'SPIN' : '…';
    return '…';
  }
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'INVESTIGATE';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'FORUM WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} FORUM SPINS · 2×` : (lab.on ? 'LAB LAYR' : 'LAYR');
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot);
  $('gamble').hidden = $('gYes').hidden = $('gNo').hidden = $('collect').hidden = !canGamble;
  $('labBtn').hidden = !(LAB_ALLOWED || lab.on); $('testBtn').hidden = !TESTBUILD;
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || (label.startsWith('OPEN') ? 'open an envelope' : 'press space'); $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 9);
  $('spin').disabled = sessionLock && !lab.on || !LAYR.ready() && !lab.on || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || (sessionLock && !lab.on);
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || (sessionLock && !lab.on);
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-SLEUTH'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  const vol = $('vol'); if (vol && document.activeElement !== vol) vol.value = state.volume;
  document.body.classList.toggle('lab-on', lab.on);
  screenDirty = true;
}

/* ---------- Procedural audio: noir jazz (walking bass, brushes, minor-ninth piano), typewriter keys on spins, a sad trombone for the Forgery ---------- */
let ac = null, master = null, ambNodes = [], ambTimer = 0;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1, vib = 0) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); if (vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 5.5; lg.gain.value = f * vib; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + d + .05); } o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800, lp = 0) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); let last = f; if (lp) { const l = ac.createBiquadFilter(); l.type = 'lowpass'; l.frequency.value = lp; f.connect(l); last = l; } last.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
const key = (k, delay = 0) => { noise(.035, .22, delay, 1800, 9000); tone(170 + k * 13, .03, 'square', .025, delay); }; // a typewriter key strike
// Cm9 voicing and a walking bass in C minor.
const CHORD = [130.81, 155.56, 196, 233.08, 293.66], BASS = [65.41, 73.42, 77.78, 87.31, 98, 87.31, 77.78, 73.42];
function piano(f, d, v, delay) { tone(f, d, 'triangle', v, delay); tone(f * 2, d * .6, 'sine', v * .25, delay + .003); }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { for (let k = 0; k < 7; k++) key(k, k * .045 + Math.random() * .02); tone(1760, .5, 'sine', .04, .36); /* the carriage bell */ noise(.18, .05, .38, 3000, 7000); }
  if (kind === 'stop') return [tone(98 + i * 11, .16, 'triangle', .22, at), noise(.04, .18, at, 1500, 8000), tone(2100 + i * 120, .05, 'square', .015, at + .005)].filter(Boolean);
  if (kind === 'win') { [0, 2, 4].forEach((k, j) => piano(CHORD[k] * 2, .55, .07, j * .09)); tone(CHORD[4] * 4, .5, 'sine', .03, .3); }
  if (kind === 'big') { CHORD.forEach((n, j) => piano(n * 2, 1.1, .07, j * .06)); BASS.slice(0, 4).forEach((n, j) => tone(n, .3, 'triangle', .22, .2 + j * .22)); tone(CHORD[4] * 4, 1.2, 'sine', .04, .5, 1, .01); }
  if (kind === 'bonus') { BASS.forEach((n, j) => tone(n, .26, 'triangle', .2, j * .16)); CHORD.forEach((n, j) => piano(n * 2, .9, .05, .64 + j * .05)); noise(.5, .02, .2, 6000); }
  if (kind === 'antic') { tone(98, 1.6, 'triangle', .1, 0, 1, .02); tone(196, 1.6, 'sine', .04, .1, 1.06); }
  if (kind === 'lock') { tone(196 + i * 22, .2, 'square', .05, i * .08); noise(.06, .2, i * .08, 300, 2000); /* stamp thump */ tone(60, .18, 'sine', .3, i * .08); }
  if (kind === 'stamp') { noise(.08, .3, 0, 200, 1500); tone(55, .22, 'sine', .35); }
  if (kind === 'respin') { for (let k = 0; k < 3; k++) key(k, k * .05); }
  if (kind === 'scan') { const d = Math.max(.3, i); noise(d, .03, 0, 900, 4200); tone(140, d, 'sawtooth', .018, 0, 1.6); for (let k = 0; k * .085 < d - .1; k++) { const t = k * .085 + Math.random() * .02; noise(.025, .06, t, 1800, 9000); tone(170 + (k % 5) * 13, .025, 'square', .012, t); } }
  if (kind === 'pick') { noise(.35, .06, 0, 2500, 9000); /* paper tearing */ piano(CHORD[(i % 5)] * 2, .5, .06, .15); }
  if (kind === 'click') key(3);
  if (kind === 'lose') { tone(146.83, .5, 'triangle', .1, 0, .7); tone(138.59, .6, 'triangle', .08, .2, .7); }
  if (kind === 'trombone') { [[233.08, .32], [220, .32], [207.65, .32], [196, 1.1]].forEach(([f, d], j) => { tone(f, d, 'sawtooth', .09, j * .36, j === 3 ? .97 : 1, j === 3 ? .025 : .006); tone(f * .5, d, 'triangle', .05, j * .36); }); }
  if (kind === 'swap') { noise(.25, .05, 0, 4000); tone(880, .3, 'sine', .07, 0, 1.4); }
  if (kind === 'jackpot') { BASS.concat(BASS).forEach((n, j) => tone(n, .22, 'triangle', .22, j * .14)); for (let j = 0; j < 4; j++) CHORD.forEach((n, k) => piano(n * 2 * (j % 2 ? 1.122 : 1), .8, .05, j * .56 + k * .03)); tone(1046.5, 2.2, 'sine', .04, 1.2, 1, .015); }
  if (kind === 'unsigned') { tone(110, .9, 'sawtooth', .06, 0, .5); noise(.2, .1, .1, 200, 1200); }
  return [];
}
// Ambience (Settings): a quiet brushed-snare and walking-bass loop, the office after hours.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; clearInterval(ambTimer); if (!state.ambient || state.muted || !ac) return;
  let step = 0; const bar = () => { if (!ac || state.muted || !state.ambient) return; for (let k = 0; k < 4; k++) { tone(BASS[(step * 4 + k) % 8], .4, 'triangle', .06, k * .5); noise(.18, .012, k * .5 + .25, 4000); } if (step % 2 === 0) CHORD.forEach((n, j) => piano(n * 2, 1.6, .012, .02 * j)); step++; };
  bar(); ambTimer = setInterval(bar, 2000);
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
