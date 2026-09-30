/*
 * Xtrata Arcade — music engine (leaf module, loads after arcade-kit)
 *
 * One small sequencer + synth that every cartridge can drive its own way.
 *
 *   XA.music.play(song, { fade, intensity, keepFilter })  start or crossfade to a song
 *   XA.music.stop(fade) / pause() / resume()
 *   XA.music.setIntensity(0..1)         layers fade in/out by `track.layer`
 *   XA.music.setTempo(bpm, rampSecs)    live tempo (ramped)
 *   XA.music.setKey(midi) / transpose(n) / setScale(name)
 *   XA.music.setFilter(hz, secs)        master low-pass (underwater, slow-mo…)
 *   XA.music.setTrack(name, on)         force a track on/off
 *   XA.music.note(inst, degree, opts)   play a note in key, optionally quantized
 *   XA.music.stinger(seq, opts)         a quantized phrase (level clear etc.)
 *   XA.music.tapeStop(secs)             slow-down + pitch-drop, then stop
 *   XA.music.duck(amount, secs)
 *   XA.music.pulse() / beatPhase()      0..1 for visuals synced to the beat
 *   XA.music.onStep(fn)                 callback per scheduled 16th step
 *
 * Songs are data: { bpm, key, scale, chords:[degrees per bar], tracks:[…] }.
 * A track plays a string pattern (one token per step) or a function that
 * returns notes, so games can generate lines from their own state.
 *
 * Pattern tokens: drums  'x' hit, 'X' accent, '.' rest
 *                 melody scale degrees (…-1 0 1 2…), '.' rest, '-' hold,
 *                 optional octave marks: '7' is the next octave; '^'/'_' shift ±1 oct
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before arcade-music');
  if (XA.music) return;

  var SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10], lydian: [0, 2, 4, 6, 7, 9, 11], mixolydian: [0, 2, 4, 5, 7, 9, 10],
    harmonic: [0, 2, 3, 5, 7, 8, 11], pentatonic: [0, 2, 4, 7, 9], minorPent: [0, 3, 5, 7, 10],
    whole: [0, 2, 4, 6, 8, 10]
  };
  var LOOKAHEAD = 0.14, TICK_MS = 25;

  var ctx = null, out = null, filter = null, musicGain = null, noiseBuf = null;
  var decks = [];            // playing songs; the last one is "current"
  var timer = null, paused = false, pauseAt = 0;
  var detune = 0, detuneTo = 0, detuneFrom = 0, detuneT0 = 0, detuneT1 = 0;
  var stepListeners = [];
  var beatTimes = [];
  var volume = 0.9;
  var lastIntensity = 0;

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function now() { return ctx ? ctx.currentTime : 0; }

  function ensure() {
    if (ctx) return ctx;
    ctx = XA.audio.context();
    if (!ctx) return null;
    out = XA.audio.bus();
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 18000; filter.Q.value = 0.7;
    musicGain = ctx.createGain();
    musicGain.gain.value = volume;
    musicGain.connect(filter); filter.connect(out);
    var len = ctx.sampleRate;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  /* ------------------------------------------------------ instruments
     Each voice: (dest, t, freq, dur, vel, p) → schedules nodes on `dest`. */
  function env(g, t, a, peak, dur, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.setValueAtTime(Math.max(0.0002, peak), t + Math.max(a, dur));
    g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a, dur) + rel);
    return t + Math.max(a, dur) + rel + 0.02;
  }
  function osc(type, f, t, end, dest, det) {
    var o = ctx.createOscillator();
    o.type = type; o.frequency.setValueAtTime(f, t);
    o.detune.setValueAtTime((det || 0) + detuneAt(t), t);
    if (detuneT1 > t) o.detune.linearRampToValueAtTime((det || 0) + detuneTo, detuneT1);
    o.connect(dest); o.start(t); o.stop(end);
    return o;
  }
  function noiseSrc(t, end, dest) {
    var s = ctx.createBufferSource();
    s.buffer = noiseBuf; s.loop = true;
    s.connect(dest); s.start(t, Math.random() * 0.5); s.stop(end);
    return s;
  }
  function detuneAt(t) {
    if (t >= detuneT1) return detuneTo;
    if (t <= detuneT0) return detuneFrom;
    return detuneFrom + (detuneTo - detuneFrom) * (t - detuneT0) / (detuneT1 - detuneT0);
  }
  var INST = {
    kick: function (dest, t, f, dur, vel) {
      var g = ctx.createGain(); g.connect(dest);
      var end = env(g, t, 0.002, 0.9 * vel, 0.02, 0.28);
      var o = osc('sine', 150, t, end, g);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    },
    snare: function (dest, t, f, dur, vel) {
      var g = ctx.createGain(); g.connect(dest);
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.8; bp.connect(g);
      var end = env(g, t, 0.002, 0.55 * vel, 0.02, 0.16);
      noiseSrc(t, end, bp);
      var g2 = ctx.createGain(); g2.connect(dest);
      var e2 = env(g2, t, 0.002, 0.3 * vel, 0.01, 0.08);
      osc('triangle', 185, t, e2, g2);
    },
    clap: function (dest, t, f, dur, vel) {
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = 1.2; bp.connect(dest);
      for (var i = 0; i < 3; i++) {
        var g = ctx.createGain(); g.connect(bp);
        var tt = t + i * 0.012;
        noiseSrc(tt, env(g, tt, 0.001, 0.5 * vel, 0.005, i === 2 ? 0.14 : 0.02), g);
      }
    },
    hat: function (dest, t, f, dur, vel, p) {
      var g = ctx.createGain(); g.connect(dest);
      var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7200; hp.connect(g);
      noiseSrc(t, env(g, t, 0.001, 0.22 * vel, 0.005, p && p.open ? 0.22 : 0.045), hp);
    },
    shaker: function (dest, t, f, dur, vel) {
      var g = ctx.createGain(); g.connect(dest);
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 2; bp.connect(g);
      noiseSrc(t, env(g, t, 0.015, 0.12 * vel, 0.01, 0.06), bp);
    },
    bass: function (dest, t, f, dur, vel, p) {
      var g = ctx.createGain(); g.connect(dest);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = (p && p.q) || 6; lp.connect(g);
      var cut = (p && p.cutoff) || 900;
      lp.frequency.setValueAtTime(cut * (0.6 + vel), t);
      lp.frequency.exponentialRampToValueAtTime(Math.max(90, cut * 0.18), t + Math.min(0.3, dur + 0.05));
      var end = env(g, t, 0.004, 0.5 * vel, dur, 0.08);
      osc('sawtooth', f, t, end, lp);
      osc('square', f / 2, t, end, lp, 4);
    },
    sub: function (dest, t, f, dur, vel) {
      var g = ctx.createGain(); g.connect(dest);
      osc('sine', f, t, env(g, t, 0.01, 0.6 * vel, dur, 0.15), g);
    },
    lead: function (dest, t, f, dur, vel, p) {
      var g = ctx.createGain(); g.connect(dest);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = (p && p.cutoff) || 3200; lp.connect(g);
      var end = env(g, t, 0.01, 0.22 * vel, dur, 0.12);
      var o = osc((p && p.wave) || 'square', f, t, end, lp);
      osc('sawtooth', f, t, end, lp, 9);
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 5.5; lg.gain.value = f * 0.006;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(t + 0.12); lfo.stop(end);
    },
    pluck: function (dest, t, f, dur, vel, p) {
      var g = ctx.createGain(); g.connect(dest);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.connect(g);
      lp.frequency.setValueAtTime((p && p.cutoff) || 5000, t);
      lp.frequency.exponentialRampToValueAtTime(400, t + 0.25);
      var end = env(g, t, 0.002, 0.3 * vel, 0.02, (p && p.decay) || 0.28);
      osc((p && p.wave) || 'triangle', f, t, end, lp);
      osc('square', f * 2, t, end, lp, -6);
    },
    marimba: function (dest, t, f, dur, vel) {
      var g = ctx.createGain(); g.connect(dest);
      var end = env(g, t, 0.002, 0.38 * vel, 0.01, 0.4);
      osc('sine', f, t, end, g);
      var g2 = ctx.createGain(); g2.connect(dest);
      osc('sine', f * 4, t, env(g2, t, 0.001, 0.1 * vel, 0.005, 0.07), g2);
    },
    bell: function (dest, t, f, dur, vel) {
      [[1, 0.28, 1.6], [2.76, 0.1, 0.9], [5.4, 0.05, 0.5]].forEach(function (h) {
        var g = ctx.createGain(); g.connect(dest);
        osc('sine', f * h[0], t, env(g, t, 0.002, h[1] * vel, 0.01, h[2]), g);
      });
    },
    pad: function (dest, t, f, dur, vel, p) {
      var g = ctx.createGain(); g.connect(dest);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = (p && p.cutoff) || 1100; lp.connect(g);
      var end = env(g, t, (p && p.attack) || 0.45, 0.12 * vel, dur, (p && p.release) || 0.9);
      osc('sawtooth', f, t, end, lp, -8);
      osc('sawtooth', f, t, end, lp, 8);
      osc('triangle', f / 2, t, end, lp);
    },
    arp: function (dest, t, f, dur, vel, p) {
      var g = ctx.createGain(); g.connect(dest);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = (p && p.cutoff) || 2600; lp.Q.value = 4; lp.connect(g);
      osc('square', f, t, env(g, t, 0.002, 0.16 * vel, 0.03, 0.12), lp);
    },
    riser: function (dest, t, f, dur, vel) {
      var g = ctx.createGain(); g.connect(dest);
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3; bp.connect(g);
      bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(6000, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25 * vel, t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
      noiseSrc(t, t + dur + 0.1, bp);
    }
  };

  /* ------------------------------------------------------ pitch helpers */
  function degToMidi(deg, key, scaleName, oct) {
    var sc = SCALES[scaleName] || SCALES.minor;
    var n = sc.length;
    var o = Math.floor(deg / n);
    var i = ((deg % n) + n) % n;
    return key + 12 * (oct || 0) + 12 * o + sc[i];
  }
  function parsePattern(str) {
    return String(str).trim().split(/\s+/).map(function (tok) {
      if (tok === '.' || tok === '-') return tok;
      if (tok === 'x' || tok === 'X') return tok;
      var octShift = 0;
      while (tok[0] === '^') { octShift++; tok = tok.slice(1); }
      while (tok[0] === '_') { octShift--; tok = tok.slice(1); }
      var n = parseInt(tok, 10);
      return isNaN(n) ? '.' : { deg: n, oct: octShift };
    });
  }
  // Drum strings may be written without spaces ("x...x...").
  function tokens(track) {
    if (track._tokens) return track._tokens;
    var p = track.pattern;
    if (typeof p === 'string' && !/\s/.test(p.trim())) p = p.split('').join(' ');
    track._tokens = parsePattern(p);
    return track._tokens;
  }

  /* ------------------------------------------------------------- decks */
  function makeDeck(song) {
    var bus = ctx.createGain();
    bus.gain.value = 0.0001;
    bus.connect(musicGain);
    var d = {
      song: song, bus: bus, step: 0, nextTime: now() + 0.06,
      bpm: song.bpm || 120, bpmFrom: song.bpm || 120, bpmTo: song.bpm || 120, rampT0: 0, rampT1: 0,
      key: song.key != null ? song.key : 57, scale: song.scale || 'minor',
      intensity: 0, forced: {}, tracks: [], rng: XA.util.rng(song.seed || 7),
      state: {}, dead: false
    };
    song.tracks.forEach(function (tr) {
      var g = ctx.createGain();
      g.gain.value = 0.0001;
      g.connect(bus);
      d.tracks.push({ def: tr, gain: g, on: false, holdUntil: 0 });
    });
    return d;
  }
  function deckBpmAt(d, t) {
    if (t >= d.rampT1) return d.bpmTo;
    if (t <= d.rampT0) return d.bpmFrom;
    return d.bpmFrom + (d.bpmTo - d.bpmFrom) * (t - d.rampT0) / (d.rampT1 - d.rampT0);
  }
  function refreshTracks(d, t, ramp) {
    d.tracks.forEach(function (tr) {
      var def = tr.def;
      var want = d.forced[def.name] != null ? d.forced[def.name] : d.intensity >= (def.layer || 0) && (def.maxLayer == null || d.intensity < def.maxLayer);
      if (want === tr.on) return;
      tr.on = want;
      var g = tr.gain.gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(Math.max(0.0001, g.value), t);
      g.exponentialRampToValueAtTime(want ? (def.gain == null ? 0.6 : def.gain) : 0.0001, t + (ramp == null ? 0.6 : ramp));
    });
  }
  function chordAt(d, bar) {
    var ch = d.song.chords;
    if (!ch || !ch.length) return 0;
    var per = d.song.barsPerChord || 1;
    return ch[Math.floor(bar / per) % ch.length];
  }

  function scheduleStep(d, t) {
    var song = d.song, spb = song.stepsPerBar || 16;
    var step = d.step, bar = Math.floor(step / spb), inBar = step % spb;
    var chord = chordAt(d, bar);
    var secPerStep = 60 / deckBpmAt(d, t) / 4;
    var info = { step: step, bar: bar, stepInBar: inBar, beat: Math.floor(inBar / 4), chord: chord, time: t,
      intensity: d.intensity, rng: d.rng, state: d.state, key: d.key, scale: d.scale, secPerStep: secPerStep };
    d.tracks.forEach(function (tr) {
      var def = tr.def;
      if (!tr.on && !(def.always)) return;
      var rate = def.rate || 1;
      if (step % rate) return;
      var notes = null;
      if (typeof def.fn === 'function') {
        notes = def.fn(info);
      } else if (def.pattern) {
        var tk = tokens(def);
        var idx = Math.floor(step / rate) % tk.length;
        var tok = tk[idx];
        if (tok === '.' || tok === '-') return;
        if (tok === 'x' || tok === 'X') notes = { drum: true, vel: tok === 'X' ? 1 : 0.7 };
        else {
          // hold length: count following '-'
          var len = 1;
          while (tk[(idx + len) % tk.length] === '-' && len < tk.length) len++;
          notes = { deg: tok.deg, oct: tok.oct, steps: len * rate };
        }
      }
      if (!notes) return;
      (Array.isArray(notes) ? notes : [notes]).forEach(function (n) {
        if (n == null) return;
        if (typeof n === 'number') n = { deg: n };
        var vel = (n.vel == null ? 0.8 : n.vel) * (def.vel == null ? 1 : def.vel);
        var dur = (n.steps || def.steps || rate) * secPerStep * (def.legato || 0.9);
        var voice = INST[n.inst || def.inst];
        if (!voice) return;
        var freq = 0;
        if (!n.drum && n.deg != null) {
          var deg = n.deg + (def.chord ? chord : 0);
          freq = mtof(degToMidi(deg, d.key, d.scale, (def.octave || 0) + (n.oct || 0)));
        }
        var swing = song.swing && inBar % 2 ? song.swing * secPerStep : 0;
        try { voice(tr.gain, t + swing, freq, dur, vel, def.params); } catch (e) { /* never break the loop */ }
      });
    });
    if (inBar % 4 === 0 && d === current()) { beatTimes.push(t); if (beatTimes.length > 8) beatTimes.shift(); }
    if (d === current()) stepListeners.forEach(function (fn) { try { fn(info); } catch (e) {} });
    d.nextTime += secPerStep;
    d.step++;
  }

  function current() { for (var i = decks.length - 1; i >= 0; i--) if (!decks[i].dead) return decks[i]; return null; }

  function tick() {
    if (!ctx || paused) return;
    var horizon = ctx.currentTime + LOOKAHEAD;
    decks.forEach(function (d) {
      if (d.nextTime < ctx.currentTime - 0.2) d.nextTime = ctx.currentTime + 0.02; // tab was asleep
      while (d.nextTime < horizon) scheduleStep(d, d.nextTime);
    });
    decks = decks.filter(function (d) { return !(d.dead && d.deadAt < ctx.currentTime); });
    if (!decks.length) { clearInterval(timer); timer = null; }
  }
  function startTimer() { if (!timer) timer = setInterval(tick, TICK_MS); }

  function fadeDeck(d, secs) {
    var t = now();
    d.dead = true;
    d.deadAt = t + secs + 0.1;
    d.bus.gain.cancelScheduledValues(t);
    d.bus.gain.setValueAtTime(Math.max(0.0001, d.bus.gain.value), t);
    d.bus.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.02, secs));
  }

  /* --------------------------------------------------------- public API */
  var api = {
    SCALES: SCALES,
    instruments: INST,
    // Spatial decks for the 3D hall: the same sequencer and instruments, but each deck
    // plays into its own node (a cabinet's speaker) and is not part of play()/stop().
    ensure: function () { return !!ensure(); },
    makeRoomDeck: function (song, dest) {
      if (!ensure()) return null;
      var d = makeDeck(song);
      d.bus.disconnect(); d.bus.connect(dest); d.bus.gain.value = 1;
      d.intensity = 1; d.room = true; d.nextTime = now() + 0.05;
      refreshTracks(d, now(), 0.05);
      return d;
    },
    runRoomDeck: function (d, horizon) {
      if (!ctx || !d) return;
      if (d.nextTime < ctx.currentTime - 0.2) d.nextTime = ctx.currentTime + 0.02;
      var n = 0; while (d.nextTime < horizon && n++ < 64) scheduleStep(d, d.nextTime);
    },
    killRoomDeck: function (d) { try { d.bus.disconnect(); } catch (e) {} },
    play: function (song, opts) {
      if (!ensure()) return;
      opts = opts || {};
      var fade = opts.fade == null ? 0.8 : opts.fade;
      var t = now();
      var prev = current();
      if (prev) fadeDeck(prev, fade);
      detune = detuneTo = detuneFrom = 0; detuneT0 = detuneT1 = 0;
      if (!opts.keepFilter) {
        filter.frequency.cancelScheduledValues(t);
        filter.frequency.setValueAtTime(opts.filter || song.filter || 18000, t);
      }
      var d = makeDeck(song);
      d.intensity = lastIntensity = opts.intensity == null ? 0 : opts.intensity;
      if (prev && opts.keepStep) { d.step = prev.step; d.nextTime = prev.nextTime; }
      decks.push(d);
      refreshTracks(d, t, 0.05);
      d.bus.gain.setValueAtTime(0.0001, t);
      d.bus.gain.exponentialRampToValueAtTime(song.gain || 0.8, t + Math.max(0.05, fade));
      paused = false;
      musicGain.gain.cancelScheduledValues(t);
      musicGain.gain.setValueAtTime(volume, t);
      startTimer();
      return d;
    },
    stop: function (fade) {
      if (!ctx) return;
      decks.forEach(function (d) { if (!d.dead) fadeDeck(d, fade == null ? 0.5 : fade); });
    },
    isPlaying: function () { return !!current(); },
    pause: function () {
      if (!ctx || paused || !current()) return;
      paused = true; pauseAt = ctx.currentTime;
      musicGain.gain.cancelScheduledValues(pauseAt);
      musicGain.gain.setValueAtTime(musicGain.gain.value, pauseAt);
      musicGain.gain.linearRampToValueAtTime(0.0001, pauseAt + 0.15);
    },
    resume: function () {
      if (!ctx || !paused) return;
      paused = false;
      var t = ctx.currentTime;
      decks.forEach(function (d) { d.nextTime = t + 0.05; });
      musicGain.gain.cancelScheduledValues(t);
      musicGain.gain.setValueAtTime(0.0001, t);
      musicGain.gain.linearRampToValueAtTime(volume, t + 0.3);
      startTimer();
    },
    setIntensity: function (v) {
      lastIntensity = Math.max(0, Math.min(1, v));
      var d = current();
      if (!d || !ctx) return;
      if (Math.abs(d.intensity - lastIntensity) < 1e-3) return;
      d.intensity = lastIntensity;
      refreshTracks(d, now());
    },
    intensity: function () { return lastIntensity; },
    setTrack: function (name, on) {
      var d = current();
      if (!d) return;
      if (on == null) delete d.forced[name]; else d.forced[name] = !!on;
      d.tracks.forEach(function (tr) { if (tr.def.name === name) tr.on = null; }); // force a re-evaluation
      refreshTracks(d, now(), 0.25);
    },
    setTempo: function (bpm, ramp) {
      var d = current();
      if (!d || !ctx) return;
      var t = now();
      d.bpmFrom = deckBpmAt(d, t);
      d.bpmTo = Math.max(20, Math.min(320, bpm));
      d.rampT0 = t; d.rampT1 = t + (ramp || 0.001);
    },
    tempo: function () { var d = current(); return d ? deckBpmAt(d, now()) : 0; },
    setKey: function (midi) { var d = current(); if (d) d.key = midi; },
    transpose: function (semis) { var d = current(); if (d) d.key += semis; },
    setScale: function (name) { var d = current(); if (d && SCALES[name]) d.scale = name; },
    setFilter: function (hz, secs) {
      if (!ensure()) return;
      var t = now();
      filter.frequency.cancelScheduledValues(t);
      filter.frequency.setValueAtTime(Math.max(60, filter.frequency.value), t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(60, Math.min(20000, hz)), t + (secs || 0.3));
    },
    duck: function (amount, secs) {
      if (!ensure()) return;
      var t = now(), lo = Math.max(0.0001, volume * (1 - amount));
      musicGain.gain.cancelScheduledValues(t);
      musicGain.gain.setValueAtTime(Math.max(0.0001, musicGain.gain.value), t);
      musicGain.gain.exponentialRampToValueAtTime(lo, t + 0.04);
      musicGain.gain.exponentialRampToValueAtTime(volume, t + (secs || 0.5));
    },
    // Pitch/tempo slump like a tape machine losing power, then silence.
    tapeStop: function (secs) {
      var d = current();
      if (!d || !ctx) return;
      secs = secs || 1.2;
      var t = now();
      api.setTempo(d.bpm * 0.25, secs);
      detuneFrom = detuneAt(t); detuneTo = -1500; detuneT0 = t; detuneT1 = t + secs;
      api.setFilter(300, secs);
      fadeDeck(d, secs * 1.1);
    },
    // Quantization helper: next step/beat/bar boundary on the audio clock.
    nextGrid: function (q) {
      var d = current();
      if (!ctx) return 0;
      if (!d || !q) return ctx.currentTime + 0.01;
      var spb = d.song.stepsPerBar || 16;
      var n = q === 'bar' ? spb : q === 'beat' ? 4 : q === '8' ? 2 : 1;
      var sps = 60 / deckBpmAt(d, d.nextTime) / 4;
      var ahead = (n - (d.step % n)) % n;
      var t = d.nextTime + ahead * sps;
      while (t < ctx.currentTime + 0.005) t += n * sps;
      return t;
    },
    // Play one note in the current key/scale (chord-relative when opts.chord).
    note: function (inst, deg, opts) {
      if (!ensure()) return;
      opts = opts || {};
      var d = current();
      var key = d ? d.key : 57, scale = d ? d.scale : 'minor';
      var chord = opts.chord && d ? chordAt(d, Math.floor(d.step / (d.song.stepsPerBar || 16))) : 0;
      var t = opts.at || api.nextGrid(opts.quantize);
      var voice = INST[inst];
      if (!voice) return;
      var freq = mtof(degToMidi(deg + chord, key, scale, opts.octave || 0));
      var g = ctx.createGain();
      g.gain.value = opts.gain == null ? 0.7 : opts.gain;
      g.connect(musicGain);
      voice(g, t, freq, opts.dur || 0.15, opts.vel == null ? 0.9 : opts.vel, opts.params);
      return t;
    },
    // A short phrase: [{ deg, at: stepOffset, steps, inst }] quantized as a unit.
    stinger: function (seq, opts) {
      if (!ensure()) return;
      opts = opts || {};
      var d = current();
      var t0 = api.nextGrid(opts.quantize || 'beat');
      var sps = d ? 60 / deckBpmAt(d, t0) / 4 : 0.12;
      seq.forEach(function (n) {
        api.note(n.inst || opts.inst || 'lead', n.deg, { at: t0 + (n.at || 0) * sps, dur: (n.steps || 1) * sps * 0.9,
          octave: n.oct || opts.octave || 0, vel: n.vel, gain: opts.gain, params: opts.params });
      });
    },
    onStep: function (fn) { stepListeners.push(fn); return function () { stepListeners = stepListeners.filter(function (f) { return f !== fn; }); }; },
    clearListeners: function () { stepListeners = []; },
    // 1 on the beat, decaying towards 0 before the next one (for visuals).
    pulse: function (sharpness) {
      if (!ctx || !beatTimes.length) return 0;
      var t = ctx.currentTime, last = null;
      for (var i = beatTimes.length - 1; i >= 0; i--) if (beatTimes[i] <= t) { last = beatTimes[i]; break; }
      if (last == null) return 0;
      return Math.exp(-(t - last) * (sharpness || 7));
    },
    beatPhase: function () {
      var d = current();
      if (!ctx || !d || !beatTimes.length) return 0;
      var spb = 60 / deckBpmAt(d, ctx.currentTime);
      var last = beatTimes.filter(function (b) { return b <= ctx.currentTime; }).pop();
      return last == null ? 0 : Math.min(1, (ctx.currentTime - last) / spb);
    },
    degToMidi: degToMidi,
    mtof: mtof
  };
  XA.music = api;
})(window);
