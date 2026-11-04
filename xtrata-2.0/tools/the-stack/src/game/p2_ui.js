
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'no-store' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
async function getText(url) { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw Error(`HTTP ${r.status}`); return (await r.text()).trim(); }
const SUB = { STACK: 'spin the reels', 'STACKING…': 'reels are spinning', 'GET LAYR': 'open your account', SKIP: 'skip the show', START: 'begin the bonus', COLLECT: 'bank your win', 'KEEP WIN': 'keep your win', CONTINUE: 'carry on', RESPIN: 'produce the next blocks', SPIN: 'next free spin', '…': 'please wait' };
const INFO_BONUS = b => b === 'gamble' || b === 'snapshot' || b === 'turnover';
function spinLabel(f, broke) {
  if (spinning) return 'STACKING…';
  if (pres) {
    const p = pres, st = p.stage, ff = f || p.snapF;
    if (st === 'trigger') return 'SKIP';
    if (st === 'intro') return p.bonus === 'gamble' ? 'KEEP WIN' : p.bonus === 'jackpot' ? '…' : 'START';
    if (st === 'summary') return INFO_BONUS(p.bonus) ? 'CONTINUE' : 'COLLECT';
    if (st === 'outro') return '…';
    if (p.bonus === 'chain') return ff && E.featureDone(ff) ? '…' : 'RESPIN';
    if (p.bonus === 'vault') return ff ? `OPEN ${Math.max(0, 3 - ff.picks.length)}` : '…';
    if (p.bonus === 'free') return state.free ? 'SPIN' : '…';
    return '…';
  }
  if (f) return E.featureDone(f) ? 'COLLECT' : f.type === 'chain' ? 'RESPIN' : `OPEN ${3 - f.picks.length}`;
  return broke ? 'GET LAYR' : 'STACK';
}
function update() {
  ensureExtras();
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  const broke = !spinning && !state.free && !f && state.balance < state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin);
  $('winLabel').textContent = showFree ? 'STACKING SEASON WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} FREE SPINS · 2×` : (lab.on ? 'LAB LAYR' : 'LAYR');
  $('spins').textContent = fmt(state.spins); $('wagered').textContent = fmt(state.wagered); $('paidOut').textContent = fmt(state.paidOut);
  $('meterSide').textContent = fmt(E.meter(state, shownBet)); $('potSide').textContent = fmt(state.pot); $('leftSide').textContent = Number.isFinite(cycleLeft()) ? fmt(cycleLeft()) : '—';
  $('gamble').hidden = $('gYes').hidden = $('gNo').hidden = $('collect').hidden = !canGamble;
  $('labBtn').hidden = !(LAB_ALLOWED || lab.on); $('testBtn').hidden = !TESTBUILD;
  const label = spinLabel(f, broke);
  $('spinText').textContent = label; $('spinSub').textContent = SUB[label] || (label.startsWith('OPEN') ? 'open a reward envelope' : 'press space'); $('spin').classList.toggle('spinning', spinning); $('spin').classList.toggle('small', label.length > 9);
  $('spin').disabled = sessionLock && !lab.on || !LAYR.ready() && !lab.on || spinInputBusy(); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || (sessionLock && !lab.on);
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || (sessionLock && !lab.on);
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').firstChild.textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-STACK'; $('auto').lastChild.textContent = autoLeft ? 'tap to stop' : 'auto-spin';
  $('sound').lastChild.textContent = state.muted ? 'sound is off' : 'sound is on'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  const vol = $('vol'); if (vol && document.activeElement !== vol) vol.value = state.volume;
  document.body.classList.toggle('lab-on', lab.on);
  screenDirty = true;
}

/* ---------- Procedural audio: clean electronic. Glassy plucks on reel stops, soft pads for the bonuses, and a quiet chime for
   every real new Stacks block that arrives while the player is at the machine. ---------- */
let ac = null, master = null, ambNodes = [], ambTimer = 0;
const soundLog = [];
function audioInit() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); } catch (e) { ac = null; return; } ambient(); } if (ac.state === 'suspended') ac.resume().catch(() => {}); master.gain.value = state.muted ? 0 : state.volume; }
function tone(f, d = .12, type = 'sine', v = .15, delay = 0, slide = 1, vib = 0) { if (!ac || state.muted) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay; o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d); if (vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 5.5; lg.gain.value = f * vib; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + d + .05); } o.connect(g); g.connect(master); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); return o; }
function noise(d = .3, v = .12, delay = 0, hp = 800, lp = 0, sweep = 0) { if (!ac || state.muted) return; const n = Math.max(1, Math.floor(ac.sampleRate * d)), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime + delay; s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; s.connect(f); let last = f; if (lp) { const l = ac.createBiquadFilter(); l.type = 'lowpass'; l.frequency.setValueAtTime(lp, t); if (sweep) l.frequency.exponentialRampToValueAtTime(Math.max(60, lp * sweep), t + d); f.connect(l); last = l; } last.connect(g); g.connect(master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.start(t); return s; }
const audioLatency = () => ac ? (ac.outputLatency || ac.baseLatency || 0) : 0;
// A major-pentatonic in E, bright and clean.
const PENT = [164.81, 185, 207.65, 246.94, 277.18, 329.63, 369.99, 415.3, 493.88, 554.37, 659.25];
const pluck = (f, v = .06, delay = 0, d = .35) => { tone(f, d, 'triangle', v, delay); tone(f * 2, d * .6, 'sine', v * .35, delay); tone(f * 3.01, d * .25, 'sine', v * .12, delay); };
const blip = (delay = 0, k = 0) => { tone(1320 + k * 110, .035, 'sine', .05, delay); tone(2640 + k * 220, .02, 'sine', .015, delay); };
const pad = (f, d = 1.2, v = .035, delay = 0) => { tone(f, d, 'sawtooth', v * .25, delay); tone(f * 1.004, d, 'sine', v, delay); tone(f * 1.5, d, 'sine', v * .5, delay + .02); };
function chime(i = 0, delay = 0) { const f = PENT[6 + (i % 4)]; tone(f, 1.1, 'sine', .035, delay); tone(f * 2, .7, 'sine', .012, delay + .005); tone(f * 3, .4, 'sine', .006, delay + .01); }
function sound(kind, i = 0, at = 0) {
  if (kind === 'stop') soundLog.push({ kind, reel: i, t: performance.now() + at * 1000 + audioLatency() * 1000 });
  audioInit(); if (!ac) return [];
  if (kind === 'spin') { noise(.06, .18, 0, 2000, 9000); tone(110, .3, 'sine', .14, 0, 1.6); tone(220, .9, 'sawtooth', .015, .04, 2.2); noise(1.1, .03, .05, 400, 4000, 2.2); /* the lever: a soft whoosh and a rising sweep */ }
  if (kind === 'stop') return [noise(.01, .18, at, 3000, 14000), tone(PENT[5 + i] * 2, .05, 'sine', .04, at), tone(PENT[i] , .09, 'triangle', .08, at + .003)].filter(Boolean);
  if (kind === 'win') { [0, 2, 4].forEach((k, j) => pluck(PENT[k + 5], .06, j * .08)); tone(PENT[10], .5, 'sine', .025, .26); }
  if (kind === 'big') { PENT.slice(3).forEach((n, j) => pluck(n, .05, j * .06, .5)); pad(PENT[0], 1.6, .05); tone(PENT[10] * 2, 1.0, 'sine', .02, .4, 1, .01); }
  if (kind === 'bonus') { [0, 2, 4, 5, 7, 9].forEach((k, j) => pluck(PENT[k], .07, j * .11, .45)); pad(PENT[0] / 2, 1.8, .05, .1); noise(.7, .025, .1, 2000, 9000, .4); }
  if (kind === 'antic') { tone(82.4, 1.6, 'sawtooth', .03, 0, 2); pad(164.81, 1.6, .03); }
  if (kind === 'lock') { tone(98, .18, 'sine', .22, i * .08); noise(.05, .12, i * .08, 300, 2400); pluck(PENT[5 + (i % 5)], .05, i * .08 + .04); /* a block lands: a soft thud and a note */ }
  if (kind === 'stamp') { tone(130.8, .16, 'sine', .2); noise(.04, .12, 0, 600, 4000); }
  if (kind === 'respin') { for (let k = 0; k < 4; k++) blip(k * .05, k); noise(.5, .02, 0, 1200, 6000, 2); }
  if (kind === 'pick') { noise(.22, .07, 0, 2500, 10000, .4); /* the envelope's flap */ pluck(PENT[5 + (i % 5)], .06, .16, .5); }
  if (kind === 'click') blip();
  if (kind === 'lose') { tone(246.94, .5, 'triangle', .07, 0, .6); tone(123.47, .7, 'sine', .08, .15, .7); }
  if (kind === 'ring') { pluck(PENT[8], .05); pluck(PENT[10], .04, .07); } // the cycle ring steps on
  if (kind === 'ticks') { const n = i || 16; for (let k = 0; k < n; k++) blip(k * .03, k % 5); }
  if (kind === 'swap') { noise(.2, .04, 0, 4000); tone(880, .3, 'sine', .06, 0, 1.4); }
  if (kind === 'block') chime(i, at); // a real new Stacks block
  if (kind === 'jackpot') { for (let k = 0; k < 24; k++) blip(k * .045, k % 5); [0, 2, 4, 5, 7, 9, 10, 9, 7, 5, 7, 10].forEach((k, j) => pluck(PENT[k], .07, 1.1 + j * .15, .5)); pad(PENT[0] / 2, 3.2, .07, 1.1); tone(PENT[10] * 2, 2.2, 'sine', .03, 2.4, 1, .015); }
  return [];
}
// Ambience (Settings): a low, slowly breathing pad.
function ambient() {
  ambNodes.forEach(x => { try { x.stop(); } catch (e) {} }); ambNodes = []; clearInterval(ambTimer); if (!state.ambient || state.muted || !ac) return;
  try { [82.41, 123.47, 164.81].forEach((f, k) => { const o = ac.createOscillator(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.value = .006; l.frequency.value = .07 + k * .03; lg.gain.value = .004; l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(master); o.start(); l.start(); ambNodes.push(o, l); }); } catch (e) {}
}
const unlockAudio = () => { audioInit(); ['pointerdown', 'keydown'].forEach(ev => removeEventListener(ev, unlockAudio, true)); };
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlockAudio, true));
