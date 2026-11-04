
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'no-store' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
const SUB = { DROP: 'drop the needle', 'DROPPING…': 'reels are spinning', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'spray the next spot', SPIN: 'next free spin', '…': 'please wait' };
function spinLabel(f, broke) {
  if (spinning) return 'DROPPING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : p.bonus === 'jackpot' ? '…' : 'START';
    if (st === 'summary') return p.bonus === 'gamble' || p.bonus === 'snapshot' ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : 'RESPIN';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'SPIN' : '…';
    return '…';
  }
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'DROP';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'PEAK TIME WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} FREE SPINS · 2×` : (lab.on ? 'LAB LAYR' : 'LAYR');
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot); $('leftSide').textContent = fmt(state.cause || 0);
  $('gamble').hidden = $('gYes').hidden = $('gNo').hidden = $('collect').hidden = !canGamble;
  $('labBtn').hidden = !(LAB_ALLOWED || lab.on); $('testBtn').hidden = !TESTBUILD;
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || (label.startsWith('OPEN') ? 'open a name on the list' : 'press space'); $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 9);
  $('spin').disabled = sessionLock && !lab.on || !LAYR.ready() && !lab.on || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || (sessionLock && !lab.on);
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || (sessionLock && !lab.on);
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-DJ'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  const vol = $('vol'); if (vol && document.activeElement !== vol) vol.value = state.volume;
  document.body.classList.toggle('lab-on', lab.on);
  screenDirty = true;
}

/* ---------- Procedural audio: original acid house. Squelching 303-style basslines, four-to-the-floor kicks, claps and hats,
   a whistle on big wins, and a crowd that roars when the doors open. All synthesised here; nothing is sampled. ---------- */
let ac = null, master = null, ambNodes = [], ambTimer = 0;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1, vib = 0) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), t + d); if (vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 6; lg.gain.value = f * vib; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + d + .05); } o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800, lp = 0, sweep = 0) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); let last = f; if (lp) { const l = ac.createBiquadFilter(); l.type = 'lowpass'; l.frequency.setValueAtTime(lp, t); if (sweep) l.frequency.exponentialRampToValueAtTime(Math.max(60, lp * sweep), t + d); f.connect(l); last = l; } last.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
// The kit.
const kick = (delay = 0, v = .5) => { tone(160, .13, 'sine', v, delay, .28); tone(52, .22, 'sine', v * .7, delay + .01); noise(.012, v * .35, delay, 1800, 9000); };
const hat = (delay = 0, open = false) => noise(open ? .16 : .035, open ? .09 : .12, delay, 7000, 15000);
const clap = (delay = 0, v = .2) => { [0, .012, .026].forEach(o => noise(.03, v, delay + o, 1100, 4200)); noise(.14, v * .5, delay + .03, 900, 3000, .4); };
// The 303: a sawtooth through a resonant low-pass whose cutoff snaps open and closes again.
function acid(f, d = .18, delay = 0, v = .13, accent = false) {
  if (!ac || state.muted) return; const t = ac.currentTime + delay, o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t); fl.type = 'lowpass'; fl.Q.value = accent ? 16 : 11; fl.frequency.setValueAtTime(accent ? 3200 : 1800, t); fl.frequency.exponentialRampToValueAtTime(220, t + d);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * (accent ? 1.3 : 1), t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(fl); fl.connect(g); g.connect(master); o.start(t); o.stop(t + d + .05);
}
function whistle(delay = 0, f = 2250) { tone(f, .09, 'sine', .07, delay, 1.04, .012); tone(f, .09, 'sine', .07, delay + .13, 1.04, .012); tone(f, .5, 'sine', .08, delay + .26, 1.12, .016); }   // peep, peep, peeeep
function crowd(d = 1.4, v = .13, delay = 0) { if (!ac || state.muted) return; for (let k = 0; k < 3; k++) { const n = noise(d, v, delay, 300 + k * 260, 2200 + k * 700, .55); } }
function siren(d = 1.6, delay = 0, v = .05) { tone(520, d, 'sawtooth', v, delay, 2.2, .06); tone(1040, d, 'square', v * .4, delay, 2.2, .06); }
// A minor pentatonic, low to high: the bass line and the stings are written in it.
const PENT = [55, 65.41, 73.42, 82.41, 98, 110, 130.81, 146.83, 164.81, 196, 220, 261.63, 293.66, 329.63, 392];
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { crowd(1.5, .1); noise(1.3, .05, .05, 400, 2600, 3); kick(0, .55); kick(.25, .4); [0, 3, 2, 5, 3, 7].forEach((k, j) => acid(PENT[k + 3], .14, .05 + j * .12, .08, j % 3 === 0)); }   // the doors open
  if (kind === 'stop') return [hat(at + 0, i % 2 === 1), tone(120 + i * 14, .08, 'sine', .14, at), noise(.01, .22, at, 2500, 12000)].filter(Boolean);
  if (kind === 'win') { [0, 2, 4, 2].forEach((k, j) => acid(PENT[k + 5], .16, j * .09, .09, j === 3)); kick(0, .3); clap(.18, .12); }
  if (kind === 'big') { whistle(0); [0, 2, 4, 5, 7, 9, 7, 5].forEach((k, j) => acid(PENT[k + 3], .16, .1 + j * .09, .1, j % 2 === 0)); for (let b = 0; b < 4; b++) kick(.1 + b * .24, .45); clap(.34, .2); clap(.82, .2); crowd(1.6, .09, .2); }
  if (kind === 'bonus') { siren(1.2); for (let b = 0; b < 8; b++) { kick(b * .15, .4); hat(b * .15 + .07); } [0, 0, 3, 5, 7, 5, 3, 0].forEach((k, j) => acid(PENT[k + 3], .13, .1 + j * .13, .09, j % 4 === 0)); noise(1, .05, .2, 300, 3000, 3); }
  if (kind === 'antic') { noise(1.7, .05, 0, 300, 1400, 5); tone(110, 1.6, 'sawtooth', .05, 0, 4, .02); for (let b = 0; b < 8; b++) hat(b * .2, b === 7); }
  if (kind === 'lock') { noise(.34, .13, i * .08, 3500, 11000, .5); /* the spray hiss */ kick(i * .08, .3); acid(PENT[5 + (i % 5)], .16, i * .08 + .04, .09, true); }
  if (kind === 'spray') { noise(.5, .1, 0, 3000, 10000, .5); }
  if (kind === 'stamp') { clap(0, .22); tone(70, .2, 'sine', .3); }
  if (kind === 'respin') { for (let k = 0; k < 4; k++) hat(k * .07, k === 3); noise(.5, .03, 0, 400, 2800, 2); }
  if (kind === 'pick') { clap(0, .16); acid(PENT[7 + (i % 6)], .22, .06, .1, true); noise(.25, .06, 0, 1200, 6000, .4); }
  if (kind === 'click') { hat(0); tone(180, .05, 'sine', .1); }
  if (kind === 'lose') { acid(PENT[7], .4, 0, .08); acid(PENT[4], .6, .18, .08); tone(55, .8, 'sine', .15, .2); }
  if (kind === 'beat') { for (let b = 0; b < 4; b++) { kick(b * .125, b === 0 ? .55 : .4); hat(b * .125 + .06); } clap(.25, .15); acid(PENT[3 + (i % 3)], .12, .12, .08); }   // one bar of Peak Time, locked to a spin
  if (kind === 'flaps') { for (let k = 0; k < Math.min(24, i || 8); k++) noise(.012, .12, k * .035, 2500, 9000); }
  if (kind === 'roar') { crowd(1.8, .16); clap(0, .18); clap(.3, .18); }
  if (kind === 'swap') { tone(95, .18, 'square', .1); noise(.05, .3, 0, 600, 3000); tone(60, .3, 'sine', .25, .02); }   // a big wall switch thunking over
  if (kind === 'lightsup') { crowd(1.4, .14); whistle(.1); [0, 4, 7, 9].forEach((k, j) => acid(PENT[k + 4], .14, j * .08, .09, true)); }
  if (kind === 'lightsdown') { tone(240, .9, 'sawtooth', .07, 0, .25); acid(PENT[5], .8, .05, .1); noise(.7, .05, 0, 200, 900, .3); }
  if (kind === 'jackpot') { siren(2.4, 0, .06); crowd(3.4, .16, .2); for (let b = 0; b < 16; b++) { kick(1.1 + b * .24, .5); hat(1.1 + b * .24 + .12, b % 4 === 3); } [0, 2, 4, 5, 7, 9, 7, 5, 4, 5, 7, 9].forEach((k, j) => acid(PENT[k + 4], .18, 1.2 + j * .18, .1, j % 3 === 0)); whistle(1.4); whistle(2.9, 2600); }
  return [];
}
// Ambience (Settings): a muffled kick through a wall, as if the party were next door, and a low hum of the room.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; clearInterval(ambTimer); if (!state.ambient || state.muted || !ac) return;
  try { const hum = ac.createOscillator(), hg = ac.createGain(); hum.frequency.value = 50; hum.type = 'sine'; hg.gain.value = .02; hum.connect(hg); hg.connect(master); hum.start(); ambNodes.push(hum); } catch (e) {}
  ambTimer = setInterval(() => { if (ac && !state.muted && state.ambient) { tone(80, .2, 'sine', .07); tone(48, .26, 'sine', .08, .01); } }, 480);
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
