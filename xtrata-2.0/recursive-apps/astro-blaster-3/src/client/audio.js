// ---------------------------------------------------------------------------
// Audio: every sound is synthesised live (no files). Procedural synthwave
// per sector with a lookahead scheduler.
// ---------------------------------------------------------------------------

var SFX = (function () {
  var ac = null, master, sfxBus, musBus, noiseBuf, comp;
  var vol = { sfx: 0.7, music: 0.55 };
  var music = { on: false, sector: 0, boss: false, title: true, step: 0, nextT: 0, timer: null, intensity: 0 };
  var lastPlay = {};

  function ensure() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return true; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ac = new AC(); } catch (e) { return false; }
    comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    master = ac.createGain(); master.gain.value = 0.9;
    sfxBus = ac.createGain(); musBus = ac.createGain();
    sfxBus.gain.value = vol.sfx; musBus.gain.value = vol.music * 0.5;
    sfxBus.connect(comp); musBus.connect(comp); comp.connect(master); master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 1, ac.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }

  function setVolume(kind, v) {
    vol[kind] = v;
    if (!ac) return;
    if (kind === 'sfx') sfxBus.gain.value = v; else musBus.gain.value = v * 0.5;
  }

  function throttle(name, ms) {
    var now = performance.now();
    if (lastPlay[name] && now - lastPlay[name] < ms) return false;
    lastPlay[name] = now; return true;
  }

  function tone(type, f0, f1, dur, gain, bus, t0, filt) {
    var t = t0 || ac.currentTime;
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var node = o;
    if (filt) { var f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filt; o.connect(f); node = f; }
    node.connect(g); g.connect(bus || sfxBus);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dur, gain, type, freq, bus, t0, q) {
    var t = t0 || ac.currentTime;
    var s = ac.createBufferSource(); s.buffer = noiseBuf;
    var f = ac.createBiquadFilter(); f.type = type || 'lowpass'; f.frequency.value = freq || 2000; if (q) f.Q.value = q;
    var g = ac.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus || sfxBus);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  function play(name, arg) {
    if (!ac || vol.sfx <= 0) return;
    switch (name) {
      case 'kill': if (throttle('kill', 35)) { noise(0.18, 0.28, 'lowpass', 1400); tone('square', 220, 60, 0.14, 0.08, null, 0, 1200); } break;
      case 'killBig': noise(0.5, 0.45, 'lowpass', 900); tone('sawtooth', 120, 30, 0.45, 0.18, null, 0, 600); break;
      case 'hit': if (throttle('hit', 45)) tone('square', 900, 700, 0.03, 0.025); break;
      case 'block': if (throttle('block', 60)) tone('triangle', 1800, 1400, 0.05, 0.05); break;
      case 'graze': if (throttle('graze', 30)) tone('sine', 2600, 3200, 0.04, 0.035); break;
      case 'scrap': if (throttle('scrap', 40)) tone('triangle', 1300 + Math.random() * 200, 1900, 0.07, 0.04); break;
      case 'playerHit': noise(0.6, 0.5, 'lowpass', 2500); tone('sawtooth', 400, 50, 0.6, 0.25, null, 0, 2000); break;
      case 'shieldBreak': tone('triangle', 1400, 300, 0.35, 0.18); noise(0.3, 0.2, 'highpass', 3000); break;
      case 'bomb': noise(1.2, 0.6, 'lowpass', 600); tone('sine', 90, 30, 1.0, 0.5); tone('sawtooth', 800, 100, 0.6, 0.08, null, 0, 3000); break;
      case 'bossWarn':
        for (var i = 0; i < 4; i++) { var t = ac.currentTime + i * 0.38; tone('square', 520, 520, 0.16, 0.08, null, t, 2000); tone('square', 390, 390, 0.16, 0.08, null, t + 0.19, 2000); }
        break;
      case 'beamWarn': if (throttle('beamWarn', 200)) tone('sine', 300, 1200, 0.7, 0.06); break;
      case 'beamFire': if (throttle('beamFire', 150)) { noise(0.5, 0.25, 'bandpass', 1200, null, 0, 3); tone('sawtooth', 110, 90, 0.5, 0.1, null, 0, 900); } break;
      case 'lightning': noise(0.6, 0.5, 'highpass', 900); tone('square', 80, 40, 0.3, 0.2, null, 0, 400); break;
      case 'laneWarn': tone('sine', 1600, 1600, 0.05, 0.03); break;
      case 'mine': if (throttle('mine', 80)) tone('sine', 700, 1100, 0.08, 0.04); break;
      case 'snipe': tone('sawtooth', 1800, 600, 0.12, 0.06, null, 0, 5000); break;
      case 'ui': tone('triangle', 880, 1320, 0.06, 0.07); break;
      case 'uiBack': tone('triangle', 660, 440, 0.06, 0.06); break;
      case 'card': tone('triangle', 660, 660, 0.08, 0.08); tone('triangle', 990, 990, 0.12, 0.07, null, ac.currentTime + 0.07); tone('triangle', 1320, 1320, 0.2, 0.07, null, ac.currentTime + 0.14); break;
      case 'buy': tone('square', 1046, 1046, 0.07, 0.05, null, 0, 3000); tone('square', 1568, 1568, 0.12, 0.05, null, ac.currentTime + 0.06, 3000); break;
      case 'deny': tone('square', 200, 160, 0.15, 0.06, null, 0, 1200); break;
      case 'waveClear': [523, 659, 784, 1046].forEach(function (f, k) { tone('triangle', f, f, 0.2, 0.06, null, ac.currentTime + k * 0.07); }); break;
      case 'bossDead': noise(1.6, 0.6, 'lowpass', 700); tone('sine', 70, 25, 1.5, 0.5); [392, 523, 659, 784, 1046].forEach(function (f, k) { tone('square', f, f, 0.25, 0.05, null, ac.currentTime + 0.5 + k * 0.1, 2400); }); break;
      case 'gameOver': [392, 330, 262, 196].forEach(function (f, k) { tone('triangle', f, f * 0.98, 0.4, 0.1, null, ac.currentTime + k * 0.22); }); break;
      case 'bombGained': tone('triangle', 784, 1568, 0.25, 0.06); break;
      case 'chainLost': tone('sine', 600, 200, 0.25, 0.05); break;
      case 'launch': tone('sawtooth', 200, 500, 0.15, 0.04, null, 0, 1500); break;
    }
  }

  // ------------------------------------------------------------ music
  // Each sector: root (MIDI), chord progression (scale degrees in a minor key), tempo
  var SONGS = [
    { root: 45, bpm: 118, prog: [0, 5, 3, 4] },   // A minor
    { root: 40, bpm: 124, prog: [0, 3, 5, 4] },   // E minor
    { root: 50, bpm: 112, prog: [0, 6, 5, 4] },   // D minor
    { root: 43, bpm: 126, prog: [0, 5, 6, 4] },   // G minor
    { root: 47, bpm: 132, prog: [0, 4, 3, 6] },   // B minor
    { root: 41, bpm: 138, prog: [0, 1, 5, 4] }    // F minor
  ];
  var MINOR = [0, 2, 3, 5, 7, 8, 10];
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function chordNotes(root, deg) {
    return [0, 2, 4].map(function (k) { var d = deg + k; return root + MINOR[d % 7] + 12 * Math.floor(d / 7); });
  }

  function schedule() {
    if (!music.on || !ac) return;
    var song = music.title ? { root: 45, bpm: 96, prog: [0, 5, 3, 4] } : SONGS[music.sector % SONGS.length];
    var bpm = song.bpm + (music.boss ? 8 : 0);
    var sixteenth = 60 / bpm / 4;
    while (music.nextT < ac.currentTime + 0.12) {
      var s = music.step, t = music.nextT;
      var bar = Math.floor(s / 16), beat = s % 16;
      var chord = chordNotes(song.root, song.prog[bar % song.prog.length]);
      var intense = music.boss ? 2 : (music.title ? 0 : 1);
      // kick
      if (beat % 4 === 0 && intense > 0) { tone('sine', 150, 42, 0.22, 0.55, musBus, t); }
      if (music.title && beat === 0) tone('sine', 120, 40, 0.3, 0.3, musBus, t);
      // snare
      if (intense >= 1 && (beat === 4 || beat === 12)) noise(0.14, intense > 1 ? 0.28 : 0.18, 'bandpass', 1800, musBus, t, 0.8);
      // hats
      if (intense > 0 && beat % 2 === 1) noise(0.04, 0.08, 'highpass', 7000, musBus, t);
      if (intense > 1 && beat % 2 === 0) noise(0.02, 0.05, 'highpass', 9000, musBus, t);
      // bass: 8ths
      if (beat % 2 === 0) {
        var bn = chord[0] - 12 + (beat % 8 === 6 ? 12 : 0);
        tone('sawtooth', mtof(bn), mtof(bn), sixteenth * 1.8, 0.16, musBus, t, 500 + intense * 250);
      }
      // arp
      if (!music.title || beat % 2 === 0) {
        var arpN = chord[(beat + (bar % 2)) % 3] + 12 + (beat >= 8 && intense > 1 ? 12 : 0);
        tone('square', mtof(arpN), mtof(arpN), sixteenth * 0.9, music.title ? 0.035 : 0.045, musBus, t, 1600 + intense * 800);
      }
      // pad on bar start
      if (beat === 0) chord.forEach(function (n) { tone('triangle', mtof(n), mtof(n), sixteenth * 15, 0.035, musBus, t, 1200); });
      music.step++;
      music.nextT += sixteenth;
    }
  }

  function startMusic(opts) {
    if (!ensure()) return;
    music.sector = opts.sector || 0; music.boss = !!opts.boss; music.title = !!opts.title;
    if (!music.on) { music.on = true; music.nextT = ac.currentTime + 0.1; music.step = 0; music.timer = setInterval(schedule, 40); }
  }
  function stopMusic() { music.on = false; if (music.timer) clearInterval(music.timer); music.timer = null; }
  function setMusic(opts) {
    if (opts.sector != null) music.sector = opts.sector;
    if (opts.boss != null) music.boss = opts.boss;
    if (opts.title != null) music.title = opts.title;
  }
  function suspend(v) { if (ac) { if (v) ac.suspend(); else ac.resume(); } }

  return { ensure: ensure, play: play, startMusic: startMusic, stopMusic: stopMusic, setMusic: setMusic, setVolume: setVolume, vol: vol, suspend: suspend };
})();
