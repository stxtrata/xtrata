/* Proof of Free — Living Synth v5 · universal engine core.
 * One engine, 1,024 instruments. Requires ProofOfFreeGenome and
 * ProofOfFreePerformance (concatenated ahead of this file in the artifact).
 *
 * v5:
 *  - Higher-quality voice: dual osc + sub, waveshaper drive, resonant filter,
 *    LFO, tempo-synced feedback delay, a shared convolver reverb bus, stereo
 *    pan, soft-clip master limiter, and a per-voice analyser for visuals.
 *  - Square Kaoss-pad instrument with high-resolution themed animation
 *    (glyph 0/ZERO/PROOF/FREE/…, spectral bars from the FFT, oscilloscope
 *    from the time-domain buffer, orbiting particles).
 *  - A data-driven living-mosaic renderer: one shared canvas, a pre-rendered
 *    glyph atlas, a lightweight animated draw per tile, zero audio graphs
 *    while dormant; tiles promote to preview/instrument on demand.
 */
(() => {
  "use strict";
  const G = globalThis.ProofOfFreeGenome;
  const P = globalThis.ProofOfFreePerformance;
  const PROTOCOL = "proof-of-free/engine-api-v5";

  const TICK_SECONDS = 60 / (G.MUSIC.bpm * G.MUSIC.ppq);
  const BAR_SECONDS = G.TICKS_PER_BAR * TICK_SECONDS;
  let maxActive = 8;                       // default 8 voices, 16 toggleable
  let transportOrigin = null;              // shared musical zero → every tile aligns to it
  const active = [];
  function enforceVoiceCap() { while (active.length >= maxActive) active.shift().silence(); }
  const clamp01 = v => Math.min(1, Math.max(0, Number(v) || 0));

  /* ---------- mosaic legibility tuning ----------
   * How loud a DORMANT tile is allowed to be. The base colours reproduce the
   * Xtrata mark exactly, so everything here trades "alive" against "the mark
   * reads". Live tiles are unaffected: they always draw at full strength, which
   * is what makes playing a tile the reward. Values are read every frame, so a
   * tuner page can drive them live; the numbers baked here are the defaults
   * that ship. */
  const TUNING = {
      idleDriftAmp: 0.3,
      idleSatDrop: 0.31,
      idlePulseLight: 0.5,
      idleMotifAlpha: 0.67,
      idleMotifVibrancy: 0.32,
      idleDrumAlpha: 0.61,
      idleDrumPulse: 0.07,
      idleDrumRing: 0.2,
      motifsOff: false
    };


  /* ---------- shared audio graph ---------- */
  let ctx = null, master = null, reverbBus = null, noiseBuffer = null;
  function lcg(seed) { let s = seed >>> 0; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
  function buildReverbImpulse(context) {
    const rate = context.sampleRate, len = (rate * 2.6) | 0;
    const buf = context.createBuffer(2, len, rate), rnd = lcg(0x9e3779b9);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (rnd() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }
  function buildNoiseBuffer(context) {
    const len = context.sampleRate, buf = context.createBuffer(1, len, context.sampleRate), rnd = lcg(0x1234abcd), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = rnd() * 2 - 1;
    return buf;
  }
  async function audio() {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain(); master.gain.value = 0.9;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -6; limiter.knee.value = 24; limiter.ratio.value = 12;
      limiter.attack.value = 0.003; limiter.release.value = 0.2;
      const conv = ctx.createConvolver(); conv.buffer = buildReverbImpulse(ctx);
      const revGain = ctx.createGain(); revGain.gain.value = 0.9;
      conv.connect(revGain).connect(master);
      reverbBus = conv;
      noiseBuffer = buildNoiseBuffer(ctx);
      master.connect(limiter).connect(ctx.destination);
    }
    if (ctx.state === "suspended") await ctx.resume();
    if (transportOrigin === null) transportOrigin = ctx.currentTime + 0.08;   // musical zero
    return ctx;
  }

  /* ---------- drum synthesis (one-shot nodes per hit) ----------
   * Seven types with per-genome tone params and live x/y/pressure
   * modulation (X → tone/pitch · Y → decay/FX · pressure → drive),
   * mirroring the reference collection builder. */
  class DrumVoice {
    constructor(context, genome, dest) {
      this.context = context;
      this.genome = genome;
      const out = dest || master;
      this.spec = genome.drum || { type: "perc", pitch: 90, decay: 0.2, tone: 0.5, snap: 0.5, metal: 0.5, gain: 0.8 };
      this.gain = context.createGain();
      this.gain.gain.value = this.spec.gain * 0.9;
      this.pan = context.createStereoPanner();
      this.pan.pan.value = genome.mosaic ? genome.mosaic.gridX / 32 - 0.5 : 0;
      this.send = context.createGain(); this.send.gain.value = 0.12 + (genome.effects?.reverb ?? 0.2) * 0.2;
      this.analyser = context.createAnalyser();
      this.analyser.fftSize = 512; this.analyser.smoothingTimeConstant = 0.7;
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      this.wave = new Uint8Array(this.analyser.fftSize);
      this.gain.connect(this.pan).connect(out);
      this.gain.connect(this.send).connect(reverbBus);
      this.gain.connect(this.analyser);
    }
    level() { this.analyser.getByteFrequencyData(this.freq); let s = 0; for (let i = 0; i < 24; i++) s += this.freq[i]; return s / (24 * 255); }
    noise(t, duration) { const s = this.context.createBufferSource(); s.buffer = noiseBuffer; s.start(t); s.stop(t + duration); return s; }
    /* mods: {x, y, pressure, pitch} — all optional. */
    hit(type, velocity, when, mods = {}) {
      const t = when ?? this.context.currentTime, v = Math.max(0.05, Math.min(1, velocity));
      const D = this.spec, x = mods.x ?? 0.5, y = mods.y ?? 0.5, pitchOffset = mods.pitch || 0;
      const decayMod = 0.4 + y * 1.2; // Y stretches/shortens decay
      type = type || D.type;
      if (type === "kick") {
        const o = this.context.createOscillator(), g = this.context.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime((D.pitch + 70 + pitchOffset * 5) * (0.7 + x * 0.8), t);
        o.frequency.exponentialRampToValueAtTime(Math.max(28, 35 + D.pitch * 0.18), t + 0.035 + D.tone * 0.055);
        g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + (0.16 + D.decay * 0.7) * decayMod);
        o.connect(g).connect(this.gain); o.start(t); o.stop(t + 0.9);
      } else if (type === "snare" || type === "clap") {
        const bursts = type === "clap" ? 3 : 1;
        for (let k = 0; k < bursts; k++) {
          const ct = t + k * 0.012;
          const n = this.noise(ct, 0.55), bp = this.context.createBiquadFilter(), ng = this.context.createGain();
          bp.type = "bandpass"; bp.frequency.value = 900 + x * 3300; bp.Q.value = 0.7 + D.snap * 1.4;
          ng.gain.setValueAtTime(v * (type === "clap" ? 0.5 : 0.8), ct);
          ng.gain.exponentialRampToValueAtTime(0.001, ct + (0.09 + D.decay * 0.35) * decayMod);
          n.connect(bp).connect(ng).connect(this.gain);
        }
        if (type === "snare") {
          const o = this.context.createOscillator(), g = this.context.createGain();
          o.type = "triangle"; o.frequency.setValueAtTime(150 + pitchOffset * 12, t);
          g.gain.setValueAtTime(v * 0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          o.connect(g).connect(this.gain); o.start(t); o.stop(t + 0.14);
        }
      } else if (type === "closedHat" || type === "openHat" || type === "hat") {
        const open = type === "openHat";
        const n = this.noise(t, 0.9), hp = this.context.createBiquadFilter(), ng = this.context.createGain();
        hp.type = "highpass"; hp.frequency.value = 4500 + x * 6500;
        ng.gain.setValueAtTime(v * 0.5, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.28 + D.decay * 0.65 : 0.025 + D.decay * 0.09) * decayMod);
        n.connect(hp).connect(ng).connect(this.gain);
      } else if (type === "tom") {
        const o = this.context.createOscillator(), g = this.context.createGain();
        o.type = "sine";
        const f = (75 + D.pitch * 0.9 + pitchOffset * 18) * (0.75 + x * 0.65);
        o.frequency.setValueAtTime(f * 1.35, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.04);
        g.gain.setValueAtTime(v * 0.8, t); g.gain.exponentialRampToValueAtTime(0.001, t + (0.18 + D.decay * 0.65) * decayMod);
        o.connect(g).connect(this.gain); o.start(t); o.stop(t + 0.85);
      } else { // perc
        const n = this.noise(t, 0.35), bp = this.context.createBiquadFilter(), ng = this.context.createGain();
        bp.type = "bandpass"; bp.frequency.value = 300 + x * 7000; bp.Q.value = 1 + D.metal * 10;
        ng.gain.setValueAtTime(v * 0.5, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + (0.035 + D.decay * 0.28) * decayMod);
        n.connect(bp).connect(ng).connect(this.gain);
      }
    }
    dispose() { try { this.gain.disconnect(); this.pan.disconnect(); this.send.disconnect(); } catch { /* noop */ } }
  }

  /* Fraction of a drum edition's pad occupied by the on-NFT step sequencer. */
  const DRUM_GRID_FRAC = 0.34;

  function makeDriveCurve(amount) {
    const k = amount * 80, curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = (i / 512) - 1; curve[i] = amount <= 0 ? x : ((1 + k) * x) / (1 + k * Math.abs(x)); }
    return curve;
  }

  /* ---------- pluggable oscillator cores ----------
   * Each core generates the raw tone and connects into `output` (the drive
   * stage). The shared filter/envelope/effects tail is identical across
   * architectures, so distinct cores still sit together in the mix. */
  function buildCore(context, genome, output) {
    const s = genome.synth || { arch: "dualosc" };
    const g = genome.oscillator;
    const oscs = [];                       // started/stopped together
    const gain = v => { const n = context.createGain(); n.gain.value = v; return n; };
    const mkOsc = type => { const o = context.createOscillator(); if (type) o.type = type; oscs.push(o); return o; };
    const detuneParams = [];
    let setFreq = () => {}, excite = null;

    if (s.arch === "supersaw" || s.arch === "reese") {
      const n = s.arch === "reese" ? 3 : Math.max(3, s.voices | 0);
      const spread = s.detuneSpread * (s.arch === "reese" ? 1.6 : 1);
      const mix = gain(0.85 / n); mix.connect(output);
      const list = [];
      for (let i = 0; i < n; i++) { const o = mkOsc("sawtooth"); o.detune.value = (n === 1 ? 0 : (i / (n - 1) - 0.5) * 2 * spread); o.connect(mix); list.push(o); detuneParams.push(o.detune); }
      if (s.arch === "reese") { const sub = mkOsc("sine"); const sg = gain(0.5); sub.connect(sg).connect(output); list.subOsc = sub; }
      setFreq = (hz, t, gl) => { list.forEach(o => o.frequency.setTargetAtTime(hz, t, gl)); if (list.subOsc) list.subOsc.frequency.setTargetAtTime(hz / 2, t, gl); };
    } else if (s.arch === "fm") {
      const car = mkOsc("sine"), mod = mkOsc("sine"), modGain = gain(0);
      mod.connect(modGain).connect(car.frequency); car.connect(gain(0.9)).connect(output); detuneParams.push(car.detune);
      setFreq = (hz, t, gl) => { car.frequency.setTargetAtTime(hz, t, gl); mod.frequency.setTargetAtTime(hz * s.fmRatio, t, gl); modGain.gain.setTargetAtTime(hz * s.fmIndex, t, gl); };
    } else if (s.arch === "pwm") {
      const o1 = mkOsc("sawtooth"), o2 = mkOsc("sawtooth"), dl = context.createDelay(0.02);
      const lfo = mkOsc("sine"); lfo.frequency.value = 0.15 + s.pwmDepth * 0.9; const lfoG = gain(0.0015 * s.pwmDepth);
      o1.connect(gain(0.85)).connect(output); o2.connect(gain(-0.85)).connect(dl).connect(output);
      lfo.connect(lfoG).connect(dl.delayTime); detuneParams.push(o1.detune, o2.detune);
      setFreq = (hz, t, gl) => { o1.frequency.setTargetAtTime(hz, t, gl); o2.frequency.setTargetAtTime(hz, t, gl); dl.delayTime.setTargetAtTime(Math.min(0.019, (0.5 / hz) * s.pwmDepth), t, gl); };
    } else if (s.arch === "ring") {
      const oa = mkOsc(g.typeA || "sine"), ob = mkOsc("sine"), rg = gain(0);
      ob.connect(rg.gain); oa.connect(rg).connect(gain(0.95)).connect(output); detuneParams.push(oa.detune);
      setFreq = (hz, t, gl) => { oa.frequency.setTargetAtTime(hz, t, gl); ob.frequency.setTargetAtTime(hz * s.ringRatio, t, gl); };
    } else if (s.arch === "pluck") {
      // Plucked-string character via a per-note filter zap + noise click,
      // robust (no feedback-cycle latency issues), distinctly percussive.
      const o1 = mkOsc("triangle"), o2 = mkOsc("sawtooth"); o2.detune.value = 8;
      const bright = context.createBiquadFilter(); bright.type = "lowpass"; bright.Q.value = 2; bright.frequency.value = 6000;
      const m = gain(0.6); o1.connect(m); o2.connect(m); m.connect(bright).connect(output);
      detuneParams.push(o1.detune, o2.detune);
      setFreq = (hz, t, gl) => { o1.frequency.setTargetAtTime(hz, t, gl); o2.frequency.setTargetAtTime(hz, t, gl); };
      excite = when => {
        bright.frequency.cancelScheduledValues(when);
        bright.frequency.setValueAtTime(9500, when);
        bright.frequency.exponentialRampToValueAtTime(800, when + 0.14);
        const src = context.createBufferSource(); src.buffer = noiseBuffer;
        const eg = gain(0), hp = context.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2200;
        eg.gain.setValueAtTime(0.5, when); eg.gain.exponentialRampToValueAtTime(0.001, when + 0.03);
        src.connect(hp).connect(eg).connect(output); src.start(when); src.stop(when + 0.04);
      };
    } else if (s.arch === "wavetable") {
      const n = 16, real = new Float32Array(n), imag = new Float32Array(n), rnd = G.splitmix32(s.waveSeed);
      for (let i = 1; i < n; i++) imag[i] = (rnd() * 2 - 1) * Math.pow(1 - i / n, 1.4);
      const wave = context.createPeriodicWave(real, imag);
      const o1 = mkOsc(), o2 = mkOsc(); o1.setPeriodicWave(wave); o2.setPeriodicWave(wave); o2.detune.value = g.detune;
      o1.connect(gain(0.5)).connect(output); o2.connect(gain(0.5)).connect(output); detuneParams.push(o1.detune, o2.detune);
      setFreq = (hz, t, gl) => { o1.frequency.setTargetAtTime(hz, t, gl); o2.frequency.setTargetAtTime(hz, t, gl); };
    } else { // dualosc (classic)
      const oa = mkOsc(g.typeA), ob = mkOsc(g.typeB), sub = mkOsc("sine");
      ob.detune.value = g.detune;
      const ma = gain((1 - g.mix) * 0.9), mb = gain(g.mix * 0.9), sg = gain(g.sub);
      oa.connect(ma).connect(output); ob.connect(mb).connect(output); sub.connect(sg).connect(output); detuneParams.push(oa.detune, ob.detune);
      setFreq = (hz, t, gl) => { oa.frequency.setTargetAtTime(hz, t, gl); ob.frequency.setTargetAtTime(hz, t, gl); sub.frequency.setTargetAtTime(hz / 2, t, gl); };
    }
    return {
      setFreq, excite, detuneParams,
      start(t) { oscs.forEach(o => { try { o.start(t); } catch { /* started */ } }); },
      stop(t) { oscs.forEach(o => { try { o.stop(t); } catch { /* stopped */ } }); }
    };
  }

  class Voice {
    constructor(context, genome, dest) {
      this.context = context; this.genome = genome;
      const out = dest || master;
      const g = genome;
      this.shaper = context.createWaveShaper();
      this.filter = context.createBiquadFilter();
      this.env = context.createGain();
      this.panner = context.createStereoPanner();
      this.out = context.createGain();
      this.delay = context.createDelay(2);
      this.feedback = context.createGain();
      this.delayWet = context.createGain();
      this.reverbSend = context.createGain();
      this.lfo = context.createOscillator();
      this.lfoGain = context.createGain();
      this.analyser = context.createAnalyser();
      this.analyser.fftSize = 512; this.analyser.smoothingTimeConstant = 0.75;
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      this.wave = new Uint8Array(this.analyser.fftSize);

      this.baseDrive = g.effects.distortion;
      this.shaper.curve = makeDriveCurve(this.baseDrive);
      this.filter.type = g.filter.type;
      this.filter.frequency.value = g.filter.cutoff;
      this.filter.Q.value = g.filter.resonance;
      this.env.gain.value = 0;
      this.panner.pan.value = g.effects.pan;
      this.out.gain.value = 0.24;
      this.delay.delayTime.value = g.effects.delaySteps * G.TICKS_PER_STEP * TICK_SECONDS;
      this.feedback.gain.value = g.effects.feedback;
      this.delayWet.gain.value = g.effects.delayWet;
      this.reverbSend.gain.value = g.effects.reverb * 0.6;

      this.core = buildCore(context, genome, this.shaper);
      this.shaper.connect(this.filter).connect(this.env).connect(this.panner).connect(this.out);
      this.out.connect(this.analyser);
      this.out.connect(out);
      this.out.connect(this.delay).connect(this.delayWet).connect(out);
      this.delay.connect(this.feedback).connect(this.delay);
      this.out.connect(this.reverbSend).connect(reverbBus);

      // LFO modulation
      const lfoTarget = g.lfo.target;
      this.lfo.frequency.value = g.lfo.rate;
      this.lfoGain.gain.value = lfoTarget === "cutoff" ? g.filter.cutoff * g.lfo.depth
        : lfoTarget === "pitch" ? g.lfo.depth * 30 : g.lfo.depth * 0.12;
      this.lfo.connect(this.lfoGain);
      if (lfoTarget === "cutoff") this.lfoGain.connect(this.filter.frequency);
      else if (lfoTarget === "amp") this.lfoGain.connect(this.out.gain);
      else this.core.detuneParams.forEach(p => this.lfoGain.connect(p));

      this.core.start(context.currentTime); this.lfo.start();
    }
    setPitch(midi, when, glide = 0.012) {
      const hz = G.midiToHz(midi), t = when ?? this.context.currentTime;
      this.core.setFreq(hz, t, glide);
    }
    noteOn(midi, velocity, when) {
      const e = this.genome.envelope, t = when ?? this.context.currentTime;
      this.setPitch(midi, t, 0.001);
      this.core.excite?.(t);
      const peak = 0.05 + 0.26 * clamp01(velocity);
      this.env.gain.cancelScheduledValues(t);
      this.env.gain.setTargetAtTime(peak, t, Math.max(0.003, e.attack / 3));
      this.env.gain.setTargetAtTime(peak * e.sustain, t + e.attack, Math.max(0.01, e.decay / 3));
    }
    noteOff(when) {
      const t = when ?? this.context.currentTime;
      this.env.gain.cancelScheduledValues(t);
      this.env.gain.setTargetAtTime(0, t, Math.max(0.02, this.genome.envelope.release / 3));
    }
    setCutoffNorm(y, t) { this.filter.frequency.setTargetAtTime(160 + (y * y) * 11500, t, 0.02); }
    setDrive(pressure) { this.shaper.curve = makeDriveCurve(Math.min(1, this.baseDrive + pressure * 0.5)); }
    level() { this.analyser.getByteFrequencyData(this.freq); let s = 0; for (let i = 0; i < 24; i++) s += this.freq[i]; return s / (24 * 255); }
    dispose() { try { this.core.stop(this.context.currentTime); this.lfo.stop(); } catch { /* stopped */ } this.out.disconnect(); }
  }

  /* ---------- glyph atlas for the mosaic ---------- */
  let atlas = null;
  function buildAtlas() {
    if (atlas) return atlas;
    const cell = 64, cols = 4, rows = Math.ceil(G.WORDS.length / cols);
    const cvs = (typeof OffscreenCanvas !== "undefined") ? new OffscreenCanvas(cell * cols, cell * rows) : Object.assign(document.createElement("canvas"), { width: cell * cols, height: cell * rows });
    const c = cvs.getContext("2d");
    c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "#fff";
    const map = {};
    G.WORDS.forEach((w, i) => {
      const cx = (i % cols) * cell + cell / 2, cy = ((i / cols) | 0) * cell + cell / 2;
      const fs = w.length <= 1 ? 44 : Math.max(11, Math.floor(58 / w.length));
      c.font = `700 ${fs}px ui-monospace, Menlo, monospace`;
      c.fillText(w, cx, cy);
      map[w] = { sx: (i % cols) * cell, sy: ((i / cols) | 0) * cell, cell };
    });
    atlas = { canvas: cvs, map };
    return atlas;
  }

  /* ---------- living mosaic renderer (data-driven, shared canvas) ---------- */
  function createMosaic(canvas, opts = {}) {
    const N = G.GRID;
    const genomes = [];
    for (let e = 1; e <= G.COLLECTION_SIZE; e++) genomes.push(G.deriveGenome(e));
    const a = buildAtlas();
    const c = canvas.getContext("2d");
    let raf = 0, t0 = null, live = new Set(), draining = new Set(), running = true, lastDraw = 0;
    let mutedSet = new Set(), soloActive = false, soloedSet = new Set(), groupOf = new Map(), groupColors = {}, volumes = new Map();
    let getInstrument = opts.getInstrument || null;
    let selection = Math.min(G.COLLECTION_SIZE, Math.max(1, opts.initialSelection || 1));
    let minted = null;                 // null = show all (no on-chain gating); else a Set of minted editions
    const mintedAt = new Map();        // edition → reveal timestamp, for the bloom-in
    const MIN_FRAME_MS = 32; // ~30fps is plenty for 1,024 dormant tiles
    /* Base HSL comes straight from the brand genome (fixed hue per family). */
    for (const g of genomes) g.mosaic._hsl = { h: g.mosaic.hue, s: g.mosaic.sat, l: g.mosaic.light };

    function resize() {
      const ratio = Math.min(2, devicePixelRatio || 1);
      const box = canvas.getBoundingClientRect();
      canvas.width = Math.max(N, Math.round(box.width * ratio));
      canvas.height = canvas.width;
      c.setTransform(ratio, 0, 0, ratio, 0, 0);
      c._cssW = canvas.width / ratio;
    }
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

    function frame(now) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - lastDraw < MIN_FRAME_MS) return;
      lastDraw = now;
      t0 ??= now; const time = (now - t0) / 1000;
      const W = c._cssW, T = W / N;
      c.fillStyle = "#050507"; c.fillRect(0, 0, W, W);
      if (T < 1.5) return;   // canvas not laid out yet — avoid sub-pixel/negative radii
      for (const g of genomes) {
        const m = g.mosaic, an = g.animation, dr = an.drift;
        const px = m.gridX * T, py = m.gridY * T, s = Math.max(1, T - 1);
        if (minted && !minted.has(g.edition)) {           // not yet inscribed on-chain → dark slot
          c.globalAlpha = 1; c.fillStyle = "#070709"; c.fillRect(px, py, s, s);
          c.strokeStyle = "#13161d"; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1);
          continue;
        }
        const isLive = live.has(g.edition), isDraining = draining.has(g.edition);
        const pulse = 0.5 + 0.5 * Math.sin(time * an.speed + (an.seed & 255) / 40);
        /* Living colour: FIXED brand hue, fading between the colour and black
         * or white (per-tile). Vibrant tiles swing further/faster. */
        const ph = time * dr.rate * 6.283 + (an.seed % 628) / 100;
        const tt = 0.5 + 0.5 * Math.sin(ph);
        const baseL = m.light, floorL = m.family === "black" ? 2 : 6;
        // Idle tiles hold their brand colour so the Xtrata logo reads solidly;
        // live/draining tiles still swing the full amount.
        const amp = m.fadeAmp * (isLive || isDraining ? 1 : TUNING.idleDriftAmp);
        let light = m.fade === "white" ? baseL + (96 - baseL) * tt * amp
                                       : baseL - (baseL - floorL) * tt * amp;
        light = Math.max(2, Math.min(97, light + (isLive || isDraining ? 8 : 0)
          + pulse * (isLive || isDraining ? 3 : TUNING.idlePulseLight) * dr.vibrancy));
        const sat = Math.max(0, m.sat * (1 - (isLive || isDraining ? 0.32 : TUNING.idleSatDrop) * tt * amp));
        const isDrumTile = m.role === "drum";
        c.globalAlpha = 1;
        c.fillStyle = `hsl(${m.hue} ${sat.toFixed(1)}% ${light.toFixed(1)}%)`;
        c.fillRect(px, py, s, s);
        const isMuted = mutedSet.has(g.edition);
        const isSoloed = soloedSet.has(g.edition);
        const dimmed = soloActive && (isLive || isDraining) && !isSoloed; // muted-by-solo
        const inst = (isLive || isDraining) && getInstrument ? getInstrument(g.edition) : null;
        const motifsAllowed = !TUNING.motifsOff || isLive || isDraining;
        if (isDrumTile) { if (motifsAllowed) drawDrumGlyph(c, g, px, py, s, time, pulse, isLive || isDraining, inst); }
        else if (motifsAllowed && !(m.family === "black" && m.brightness < 0.09 && !isLive && !isDraining && dr.vibrancy < 0.32)) {
          drawTileMotif(c, an, m, px, py, s, time,
            isLive || isDraining ? 1 : TUNING.idleMotifAlpha + dr.vibrancy * TUNING.idleMotifVibrancy, inst);
        }
        // MYTHIC: a shimmering gold inner ring — the collection's rares
        if (m.mythic) {
          c.strokeStyle = "#ffd24a"; c.lineWidth = 1.4;
          c.globalAlpha = 0.4 + 0.4 * Math.sin(time * 2.2 + (an.seed % 100) / 10);
          c.strokeRect(px + 1.5, py + 1.5, Math.max(1, s - 3), Math.max(1, s - 3));
          c.globalAlpha = 1;
        }
        // dim tiles silenced by an active solo, or explicitly muted
        if ((dimmed || isMuted) && (isLive || isDraining)) {
          c.globalAlpha = 0.55; c.fillStyle = "#05050a"; c.fillRect(px, py, s, s); c.globalAlpha = 1;
        }
        // group membership badge (corner triangle in the group colour)
        if (groupOf.has(g.edition)) {
          const gc = groupColors[groupOf.get(g.edition)] || "#fff";
          c.fillStyle = gc; c.globalAlpha = 0.95;
          c.beginPath(); c.moveTo(px + s, py); c.lineTo(px + s - s * 0.34, py); c.lineTo(px + s, py + s * 0.34); c.closePath(); c.fill();
          c.globalAlpha = 1;
        }
        // state borders: green = live · orange = finishing loop · dashed = muted
        if (isLive || isDraining) {
          c.strokeStyle = isDraining ? "#ff9d3c" : isSoloed ? "#8affd0" : "#3ad29f";
          c.lineWidth = isSoloed ? 2.6 : 1.8;
          c.globalAlpha = (isMuted || dimmed) ? 0.5 : 0.95;
          if (isMuted) c.setLineDash([3, 3]);
          c.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1);
          c.setLineDash([]); c.globalAlpha = 1;
          // per-tile volume: a level bar up the left inner edge (click-drag)
          const vol = volumes.has(g.edition) ? volumes.get(g.edition) : 1;
          if (vol < 0.999) {
            c.fillStyle = "#0a0a0f"; c.globalAlpha = 0.55; c.fillRect(px + 1.5, py + 1.5, 3, s - 3);
            c.fillStyle = isSoloed ? "#8affd0" : "#3ad29f"; c.globalAlpha = 0.95;
            c.fillRect(px + 1.5, py + s - 1.5 - (s - 3) * vol, 3, (s - 3) * vol);
            c.globalAlpha = 1;
          }
        }
        // freshly-inscribed bloom: a bright ring + flash that fades over ~1.6s
        const revAt = mintedAt.get(g.edition);
        if (revAt != null) {
          const age = (now - revAt) / 1000;
          if (age >= 1.6) mintedAt.delete(g.edition);
          else {
            const k = 1 - age / 1.6;
            c.globalAlpha = 0.28 * k; c.fillStyle = "#eafff5"; c.fillRect(px, py, s, s);
            c.globalAlpha = 0.9 * k; c.strokeStyle = "#eafff5"; c.lineWidth = 1 + 2.4 * k;
            c.strokeRect(px + 1, py + 1, Math.max(1, s - 2), Math.max(1, s - 2));
            c.globalAlpha = 1;
          }
        }
      }
      // selection cursor (arrow-key / step controls)
      const sg = genomes[selection - 1].mosaic, sx = sg.gridX * T, sy = sg.gridY * T;
      const blink = 0.55 + 0.45 * Math.sin(time * 6);
      c.strokeStyle = "#eafff5"; c.lineWidth = 2.4; c.globalAlpha = blink;
      c.strokeRect(sx - 1.5, sy - 1.5, T + 2, T + 2);
      c.globalAlpha = blink * 0.7; c.strokeStyle = "#3ad29f"; c.lineWidth = 1;
      c.strokeRect(sx + 1.5, sy + 1.5, T - 4, T - 4);
      c.globalAlpha = 1;
    }
    /* Drum NFTs: glyph letter; live tiles pulse with their real output level
     * and show a step ticker along the bottom edge. */
    const DRUM_GLYPH = { kick: "K", snare: "S", closedHat: "H", openHat: "O", tom: "T", clap: "C", perc: "P" };
    /* The drum LETTER is the animation: it pulses to a beat clock, wobbles,
     * and (when live) is ringed by orbiting 0s. */
    function drawDrumGlyph(c, g, px, py, s, time, pulse, isActive, inst) {
      const an = g.animation, accent = g.mosaic.accent;
      const lvl = inst?.drumVoice ? inst.drumVoice.level() : 0;
      const cx = px + s / 2, cy = py + s / 2;
      const beat = time * (G.MUSIC.bpm / 60) * 2 + (an.seed % 1000) / 1000;
      const kick = Math.pow(1 - (beat % 1), 2.4);       // spike on each half-beat, decays
      // beat ring behind the letter (a 0 that expands & fades)
      c.strokeStyle = accent; c.lineWidth = Math.max(1, s * 0.04);
      c.globalAlpha = (isActive ? 0.55 : TUNING.idleDrumRing) * (1 - kick * 0.7);
      c.beginPath(); c.arc(cx, cy, s * (0.16 + (1 - kick) * 0.24), 0, 7); c.stroke();
      // orbiting 0s (live only, keeps dormant cheap)
      if (isActive) {
        c.font = `${Math.max(6, s * 0.2)}px ui-monospace, monospace`; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillStyle = accent;
        for (let i = 0; i < 3; i++) {
          const ang = time * an.speed * 0.9 + i * 2.094 + (an.seed % 628) / 100;
          c.globalAlpha = 0.85 * (0.5 + 0.5 * Math.sin(ang * 1.3));
          c.fillText("0", cx + Math.cos(ang) * s * 0.34, cy + Math.sin(ang) * s * 0.34);
        }
      }
      // the letter itself: pulse + wobble (letter IS the motion)
      c.save(); c.translate(cx, cy);
      c.rotate(Math.sin(time * an.speed * 0.7 + an.seed) * 0.13 + kick * 0.05);
      const sc = 1 + kick * (0.22 + lvl * 0.6) + (isActive ? lvl * 0.2 : 0);
      c.scale(sc, sc);
      c.globalAlpha = isActive ? 0.85 + 0.15 * lvl : TUNING.idleDrumAlpha + TUNING.idleDrumPulse * pulse;
      c.fillStyle = isActive ? accent : "#5c6b68";
      c.font = `bold ${Math.max(7, s * 0.46)}px ui-monospace, monospace`;
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(DRUM_GLYPH[g.drum.type] || "P", 0, 0);
      c.restore();
      if (isActive) { // step ticker
        const steps = 8, w = s / steps, cur = ((time * (G.MUSIC.bpm / 60) * 4) | 0) % steps;
        c.fillStyle = accent; c.globalAlpha = 0.9; c.fillRect(px + cur * w, py + s - 2.5, w - 1, 2);
      }
      c.globalAlpha = 1;
    }
    function shade(hex, b) {
      const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, gg = (n >> 8) & 255, bl = n & 255;
      const f = Math.max(0.15, Math.min(1.35, b + 0.35));
      r = Math.min(255, r * f) | 0; gg = Math.min(255, gg * f) | 0; bl = Math.min(255, bl * f) | 0;
      return `rgb(${r},${gg},${bl})`;
    }
    function drawTileMotif(c, an, m, px, py, s, time, alpha, inst) {
      const cx = px + s / 2, cy = py + s / 2;
      const voice = inst?.voice || inst?.drumVoice || null;
      const R = v => Math.max(0.5, v);           // never a negative radius
      c.globalAlpha = alpha;
      if (an.kind === "glyph") {
        const sp = a.map[an.word] || a.map["0"];
        const breathe = 0.86 + 0.14 * Math.sin(time * an.speed * 1.2 + an.seed);
        const sz = R(s * 0.68 * breathe);
        c.save(); c.translate(cx, cy); c.rotate(Math.sin(time * an.speed * 0.4 + an.seed) * 0.06);
        c.globalAlpha = alpha * (0.55 + 0.45 * Math.abs(Math.sin(time * an.speed * 0.8 + an.seed)));
        c.drawImage(a.canvas, sp.sx, sp.sy, sp.cell, sp.cell, -sz / 2, -sz / 2, sz, sz);
        c.restore();
      } else if (an.kind === "pulse0") {
        // a breathing "0": ring scaling to a beat + counter inner ring
        const beat = 0.5 + 0.5 * Math.sin(time * an.speed * 1.7 + an.seed);
        c.strokeStyle = m.accent; c.lineWidth = R(s * (0.055 + 0.05 * beat));
        c.globalAlpha = alpha * (0.6 + 0.4 * beat);
        c.beginPath(); c.arc(cx, cy, R(s * (0.15 + 0.15 * beat)), 0, 7); c.stroke();
        c.globalAlpha = alpha * 0.45; c.lineWidth = 1;
        c.beginPath(); c.arc(cx, cy, R(s * 0.30 * (1 - beat * 0.4)), 0, 7); c.stroke();
      } else if (an.kind === "radiate") {
        // 0-rings radiating outward like sonar
        c.strokeStyle = m.accent; c.lineWidth = 1.4;
        for (let i = 0; i < 3; i++) {
          const ph = (time * an.speed * 0.4 + i / 3) % 1;
          c.globalAlpha = alpha * (1 - ph) * 0.8;
          c.beginPath(); c.arc(cx, cy, R(s * 0.05 + ph * s * 0.42), 0, 7); c.stroke();
        }
      } else if (an.kind === "binary") {
        // columns of 0/1 raining — proof of free, reduced to bits
        c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = m.accent;
        const fs = Math.max(6, s * 0.2); c.font = `${fs}px ui-monospace, monospace`;
        for (let cI = 0; cI < 2; cI++) {
          const x = px + s * (0.33 + cI * 0.34), off = (time * an.speed * (0.5 + cI * 0.25)) % 1;
          for (let rI = 0; rI < 4; rI++) {
            const p = (rI / 4 + off) % 1, yy = py + s * p;
            const bit = ((an.seed >> ((rI + cI * 4) % 28)) & 1) ^ ((Math.floor(time * (2 + cI)) + rI) & 1);
            c.globalAlpha = alpha * (0.25 + 0.65 * Math.sin(p * Math.PI));
            c.fillText(bit ? "1" : "0", x, yy);
          }
        }
      } else if (an.kind === "bars") {
        c.fillStyle = m.accent;
        if (voice) { // live: the real spectrum
          voice.analyser.getByteFrequencyData(voice.freq);
          const n = 5, bw = s / (n * 1.5);
          for (let i = 0; i < n; i++) {
            const h = s * 0.15 + (voice.freq[i * 6] / 255) * s * 0.7;
            c.fillRect(px + s * 0.1 + i * bw * 1.5, py + s - h - s * 0.1, bw, h);
          }
        } else {
          const n = 4, bw = s / (n * 1.6);
          for (let i = 0; i < n; i++) {
            const h = s * (0.2 + 0.6 * Math.abs(Math.sin(time * an.speed + i * 0.7 + an.seed)));
            c.fillRect(px + s * 0.14 + i * bw * 1.5, py + s - h - s * 0.12, bw, h);
          }
        }
      } else if (an.kind === "scope") {
        c.strokeStyle = m.accent; c.lineWidth = 1.4; c.beginPath();
        if (voice) { // live: the literal output waveform
          voice.analyser.getByteTimeDomainData(voice.wave);
          const n = voice.wave.length;
          for (let i = 0; i <= 12; i++) {
            const xx = px + s * (0.08 + 0.84 * i / 12);
            const yy = py + s * (voice.wave[((i / 12) * (n - 1)) | 0] / 255);
            i ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
          }
        } else {
          for (let i = 0; i <= 10; i++) {
            const xx = px + s * (0.1 + 0.8 * i / 10);
            const yy = cy + Math.sin(time * an.speed * 2 + i * 0.9 + an.seed) * s * 0.22;
            i ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
          }
        }
        c.stroke();
      } else if (an.kind === "zeroRing") {
        /* A spinning, breaking "0" — proof of free: the zero never closes. */
        const r = R(s * (0.24 + 0.06 * Math.sin(time * an.speed + an.seed)));
        const spin = time * an.speed * 1.4 + an.seed;
        const gap = 0.9 + 0.7 * Math.sin(time * an.speed * 0.6);
        c.strokeStyle = m.accent; c.lineWidth = Math.max(1.2, s * 0.07);
        c.beginPath(); c.arc(cx, cy, r, spin + gap, spin + 6.283); c.stroke();
        c.globalAlpha = alpha * 0.5;
        c.beginPath(); c.arc(cx, cy, R(r * 0.55), -spin, -spin + 4.6); c.stroke();
        const echo = (time * an.speed * 0.5) % 1;       // outward echo ring
        c.globalAlpha = alpha * (1 - echo) * 0.4;
        c.beginPath(); c.arc(cx, cy, R(r + echo * s * 0.24), 0, 7); c.stroke();
      } else if (an.kind === "rain") {
        /* Zeros falling through — everything returns to nothing. */
        c.fillStyle = m.accent; c.textAlign = "center"; c.textBaseline = "middle";
        for (let i = 0; i < 3; i++) {
          const ph = (time * an.speed * 0.35 + i * 0.37 + ((an.seed >> (i * 5)) & 31) / 31) % 1;
          const xx = px + s * (0.2 + 0.3 * i), yy = py + s * ph;
          c.globalAlpha = alpha * Math.sin(ph * Math.PI) * 0.9;
          c.font = `${Math.max(6, s * (0.2 + 0.1 * i))}px ui-monospace`;
          c.fillText("0", xx, yy);
        }
      } else if (an.kind === "void") {
        /* The void: a collapsing disc of nothing with a glowing rim. */
        const r = R(s * (0.12 + 0.16 * Math.abs(Math.sin(time * an.speed * 0.5 + an.seed))));
        c.fillStyle = "#000"; c.globalAlpha = alpha * 0.85;
        c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill();
        c.strokeStyle = m.accent; c.lineWidth = 1.2; c.globalAlpha = alpha * (0.4 + 0.4 * Math.sin(time * an.speed + an.seed));
        c.beginPath(); c.arc(cx, cy, R(r + 1.5), 0, 7); c.stroke();
      } else { // orbit — dots circling a faint 0
        c.strokeStyle = m.accent; c.globalAlpha = alpha * 0.4; c.lineWidth = 1.4;
        c.beginPath(); c.arc(cx, cy, R(s * 0.14), 0, 7); c.stroke();
        c.fillStyle = m.accent;
        for (let i = 0; i < 3; i++) {
          const ang = time * an.speed * (i % 2 ? -1 : 1) + an.seed + i * 2.094;
          const rad = R(s * (0.24 + (i % 2) * 0.06));
          c.globalAlpha = alpha * (0.6 + 0.4 * Math.sin(ang));
          c.beginPath(); c.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, R(s * 0.055), 0, 7); c.fill();
        }
      }
      c.globalAlpha = 1;
    }

    const editionAt = ev => {
      const box = canvas.getBoundingClientRect();
      const gx = Math.min(N - 1, Math.max(0, ((ev.clientX - box.left) / box.width * N) | 0));
      const gy = Math.min(N - 1, Math.max(0, ((ev.clientY - box.top) / box.height * N) | 0));
      return gy * N + gx + 1;
    };
    if (opts.onHover) canvas.addEventListener("pointermove", ev => opts.onHover(genomes[editionAt(ev) - 1], ev));
    if (opts.onSelect) canvas.addEventListener("click", ev => { setSelection(editionAt(ev)); opts.onSelect(editionAt(ev)); });
    if (opts.onOpen) canvas.addEventListener("dblclick", ev => { setSelection(editionAt(ev)); opts.onOpen(editionAt(ev)); });

    function setSelection(edition, announce = true) {
      selection = Math.min(G.COLLECTION_SIZE, Math.max(1, edition | 0));
      if (announce) opts.onSelectionChange?.(genomes[selection - 1]);
      return selection;
    }
    function step(dx, dy) {
      const g = genomes[selection - 1].mosaic;
      const gx = Math.min(N - 1, Math.max(0, g.gridX + dx));
      const gy = Math.min(N - 1, Math.max(0, g.gridY + dy));
      return setSelection(gy * N + gx + 1);
    }
    const keyHandler = ev => {
      const k = ev.key;
      if (k === "ArrowLeft") step(-1, 0);
      else if (k === "ArrowRight") step(1, 0);
      else if (k === "ArrowUp") step(0, -1);
      else if (k === "ArrowDown") step(0, 1);
      else if (k === "Enter") opts.onOpen?.(selection);
      else if (k === " ") opts.onSelect?.(selection);
      else return;
      ev.preventDefault();
    };
    if (opts.keyboard !== false) addEventListener("keydown", keyHandler);

    raf = requestAnimationFrame(frame);
    return {
      genomes,
      setLive(liveEditions, drainingEditions) { live = new Set(liveEditions || []); draining = new Set(drainingEditions || []); },
      setOverlays(o = {}) {   // partial merge — only provided fields change
        if ("muted" in o) mutedSet = new Set(o.muted || []);
        if ("soloActive" in o) soloActive = !!o.soloActive;
        if ("soloed" in o) soloedSet = new Set(o.soloed || []);
        if ("groupOf" in o) groupOf = o.groupOf instanceof Map ? o.groupOf : new Map(Object.entries(o.groupOf || {}).map(([k, v]) => [+k, v]));
        if ("groupColors" in o) groupColors = o.groupColors || {};
        if ("volumes" in o) volumes = o.volumes instanceof Map ? o.volumes : new Map(Object.entries(o.volumes).map(([k, v]) => [+k, v]));
      },
      setInstrumentLookup(fn) { getInstrument = fn; },
      /* On-chain gating: pass a list/Set of minted editions to show only those
       * (unminted → dark slots); pass null to show all. Newly-added editions
       * bloom in. */
      setMinted(ids) {
        if (ids == null) { minted = null; mintedAt.clear(); return; }
        const next = ids instanceof Set ? ids : new Set(ids);
        const stamp = (typeof performance !== "undefined" ? performance.now() : 0);
        if (minted) for (const ed of next) if (!minted.has(ed)) mintedAt.set(ed, stamp);
        minted = next;
      },
      mintedCount: () => (minted ? minted.size : G.COLLECTION_SIZE),
      isMintGated: () => minted != null,
      getSelection: () => selection,
      selectedGenome: () => genomes[selection - 1],
      select: edition => setSelection(edition),
      step,                                   // step(dx,dy) → arrow controls
      openSelected() { opts.onOpen?.(selection); },
      previewSelected() { opts.onSelect?.(selection); },
      stop() { running = false; cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("keydown", keyHandler); },
      editionAt
    };
  }

  /* ---------- instrument (square pad + rich animation) ---------- */
  class Instrument {
    constructor(container, options) {
      const opts = options || {};
      this.edition = opts.edition;
      this.engineId = opts.engineId ?? 0;
      this.mode = opts.mode || "instrument";
      this.genome = G.deriveGenome(this.edition);
      this.genomeHash = G.genomeHash(this.genome);
      this.isDrum = this.genome.mosaic.role === "drum";
      this.melody = this.isDrum ? [] : G.deriveMelody(this.genome);
      this.genesisPattern = this.isDrum ? G.deriveDrumPattern(this.genome) : null;
      this.pattern = this.genesisPattern ? this.genesisPattern.map(s => s && { ...s }) : null;
      this.loopTicks = this.genome.melody.length * G.TICKS_PER_STEP;
      this.container = container;
      this.voice = null; this.drumVoice = null; this.timers = []; this.schedulerTimer = null;
      this.recording = null; this.recordingTimer = null; this.performance = null; this.pointerDown = false;
      this.randomiseCount = 0; this.lastPadHitMs = 0;
      this.toneShape = { x: 0.5, y: 0.5 };            // persistent drum tone (saved in children)
      this.toneShapeDirty = false;
      this.state = "idle";                             // idle | live | draining
      this.muted = false; this.volume = 1; this.bus = null;
      this.drainTimer = null;
      this.loopStartTime = 0; this.loopSeconds = 0;
      this.onStateChange = opts.onStateChange || null;
      this.pointer = { x: 0.5, y: 0.5, active: false };
      this.renderShell();
      if (this.mode === "instrument") this.bindPad();
      this.animate = this.animate.bind(this);
      this.raf = requestAnimationFrame(this.animate);
    }
    ensureBus(context) {
      if (!this.bus) {
        this.bus = context.createGain();
        this.bus.gain.value = this.muted ? 0.0001 : this.volume;
        this.bus.connect(master);
      }
      return this.bus;
    }
    applyBusGain() { if (this.bus) this.bus.gain.setTargetAtTime(this.muted ? 0.0001 : this.volume, this.bus.context.currentTime, 0.012); }
    /* Per-tile live volume (click-drag on the mosaic). */
    setVolume(v) { this.volume = Math.max(0, Math.min(1, v)); this.applyBusGain(); this.onStateChange?.(this, this.state); return this.volume; }
    async ensureVoice() {
      const context = await audio();
      if (!this.voice) {
        enforceVoiceCap();
        this.voice = new Voice(context, this.genome, this.ensureBus(context));
        active.push(this);
      }
      return this.voice;
    }
    async ensureDrums() {
      const context = await audio();
      if (!this.drumVoice) this.drumVoice = new DrumVoice(context, this.genome, this.ensureBus(context));
      return this.drumVoice;
    }
    /* Mute/unmute WITHOUT stopping the transport — the loop keeps running
     * silently, so unmuting drops back in on the beat (phase-locked). */
    setMuted(on) {
      this.muted = !!on;
      this.applyBusGain();
      this.onStateChange?.(this, this.state);
      return this.muted;
    }
    /* Instant off — no loop-out. */
    kill() { this.silence(); }
    buildLoopEvents() {
      if (this.isDrum) {
        return (this.pattern || []).flatMap((s, i) => s
          ? [{ tick: i * G.TICKS_PER_STEP, kind: "drum", hit: { velocity: s.vel ?? 0.7, prob: s.prob ?? 1, pitch: s.pitch || 0, accent: !!s.accent } }]
          : []);
      }
      return this.melody.map(n => ({ tick: n.tick, kind: "note", note: n }));
    }
    /* ---------- drum pattern editing (beat re-authoring) ---------- */
    setPattern(pattern) {
      if (!this.isDrum) throw new Error("Only drum editions carry a step pattern.");
      this.pattern = P.validatePattern(pattern, this.genome.loopBars * G.STEPS_PER_BAR);
      if (this.playing) this.loopEvents = this.buildLoopEvents();
      return this.pattern;
    }
    restorePattern() {
      if (!this.isDrum) return null;
      this.pattern = this.genesisPattern.map(s => s && { ...s });
      if (this.playing) this.loopEvents = this.buildLoopEvents();
      return this.pattern;
    }
    randomisePattern() {
      if (!this.isDrum) return null;
      this.randomiseCount++;
      const rand = G.splitmix32((this.genome.melody.patternSeed ^ Math.imul(this.randomiseCount, 0x9e3779b9)) >>> 0);
      const steps = this.genome.loopBars * G.STEPS_PER_BAR;
      const density = 0.2 + rand() * 0.35;
      const pattern = Array.from({ length: steps }, (_, i) => {
        const strong = i % 4 === 0;
        return rand() < density + (strong ? 0.25 : 0)
          ? { vel: Math.round((0.35 + rand() * 0.6) * 1000) / 1000, prob: Math.round((0.7 + rand() * 0.3) * 1000) / 1000, pitch: ((rand() * 5) | 0) - 2, accent: rand() > 0.8 }
          : null;
      });
      if (!pattern.some(Boolean)) pattern[0] = { vel: 0.8, prob: 1, pitch: 0, accent: false };
      return this.setPattern(pattern);
    }
    setState(s) { if (this.state !== s) { this.state = s; this.onStateChange?.(this, s); } }
    silence() {
      clearTimeout(this.drainTimer); this.drainTimer = null;
      this.stopTransport();
      if (this.voice) { this.voice.noteOff(); const v = this.voice; setTimeout(() => v.dispose(), 800); this.voice = null; }
      if (this.drumVoice) { const d = this.drumVoice; setTimeout(() => d.dispose(), 800); this.drumVoice = null; }
      if (this.bus) { const bus = this.bus; setTimeout(() => { try { bus.disconnect(); } catch { /* noop */ } }, 900); this.bus = null; }
      const i = active.indexOf(this); if (i >= 0) active.splice(i, 1);
      this.setState("idle");
      this.setStatus("idle");
    }
    /* Stop musically: keep playing to the end of the current loop (orange /
     * "draining" state), then fall silent. */
    stopAtLoopEnd() {
      if (this.state !== "live" || !this.playing) { this.silence(); return 0; }
      const context = this.voice?.context || this.drumVoice?.context;
      if (!context || !this.loopSeconds) { this.silence(); return 0; }
      const elapsed = context.currentTime - this.loopStartTime;
      const phase = ((elapsed % this.loopSeconds) + this.loopSeconds) % this.loopSeconds;
      const remaining = Math.max(0.02, this.loopSeconds - phase);
      this.setState("draining");
      this.setStatus("finishing loop…");
      clearTimeout(this.drainTimer);
      this.drainTimer = setTimeout(() => this.silence(), remaining * 1000 + 60);
      return remaining;
    }
    destroy() {
      cancelAnimationFrame(this.raf);
      this.ro?.disconnect(); this.ro = null;
      clearTimeout(this.recordingTimer); this.recordingTimer = null;
      this.silence();
      this.container.replaceChildren();
    }

    stopTransport() { this.timers.forEach(clearTimeout); this.timers = []; if (this.schedulerTimer) { clearInterval(this.schedulerTimer); this.schedulerTimer = null; } if (this.voice) this.voice.noteOff(); this.playing = null; }

    async playMelody(opts = {}) {
      const context = await audio();
      if (this.isDrum) await this.ensureDrums(); else await this.ensureVoice();
      if (!active.includes(this)) { enforceVoiceCap(); active.push(this); }
      this.stopTransport(); this.playing = "melody";
      const kit = this.isDrum ? ` · ${this.genome.drum.type}` : "";
      this.setStatus(`genesis loop · ${this.genome.loopBars} bar${this.genome.loopBars > 1 ? "s" : ""}${kit}`);
      const loopSeconds = this.loopTicks * TICK_SECONDS;
      this.loopEvents = this.buildLoopEvents();
      /* GLOBAL TRANSPORT SYNC: align this loop's origin to the shared musical
       * zero (transportOrigin) so every tile — whenever it starts — locks to
       * the same bar/beat grid. Loop lengths are whole bars, so 1/2/4-bar
       * tiles always share downbeats. The tile phase-jumps in on the grid. */
      const now = context.currentTime;
      let loopStart = transportOrigin + Math.floor((now + 0.06 - transportOrigin) / loopSeconds) * loopSeconds;
      let index = 0; const horizon = 0.15;
      this.loopStartTime = loopStart; this.loopSeconds = loopSeconds;
      this.setState("live");
      const probRand = G.splitmix32(this.genome.melody.patternSeed ^ 0xbea7);
      this.schedulerTimer = setInterval(() => {
        if (!this.loopEvents.length) return;
        const t = context.currentTime;
        while (true) {
          if (index >= this.loopEvents.length) { index = 0; loopStart += loopSeconds; }
          const ev = this.loopEvents[index], when = loopStart + ev.tick * TICK_SECONDS;
          if (when > t + horizon) break;
          if (when >= t - 0.03) {                       // skip events already elapsed (grid phase-in)
            if (ev.kind === "note") {
              if (this.toneShapeDirty && !this.isDrum) this.voice?.setCutoffNorm(this.toneShape.y, when); // persisted kaos tone biases the loop
              this.voice?.noteOn(ev.note.midi, ev.note.velocity, when);
              this.voice?.noteOff(when + ev.note.gateSteps * G.TICKS_PER_STEP * TICK_SECONDS * 0.9);
            } else if ((ev.hit.prob ?? 1) >= 1 || probRand() < ev.hit.prob) {
              this.drumVoice?.hit(null, ev.hit.velocity * (ev.hit.accent ? 1.15 : 1), when,
                { pitch: ev.hit.pitch, x: this.toneShape.x, y: this.toneShape.y });
            }
          }
          index++;
        }
      }, 25);
    }

    async gesture(point) {
      const type = ["down", "move", "up"].includes(point?.type) ? point.type : "move";
      const x = clamp01(point?.x), y = clamp01(point?.y), pressure = clamp01(point?.pressure ?? 0.65);
      if (this.recording) { this.recording.events.push({ tick: this.nowTick(), type, x, y, pressure }); if (this.recording.events.length >= P.MAX_EVENTS) this.stopRecording(); }
      this.pointer = { x, y, active: type !== "up" };
      if (this.isDrum) {
        /* The pad IS the drum machine. Bottom strip = step sequencer
         * (tap toggles a hit, shift-tap accents — you SEE and EDIT the
         * timing). Everything above = chaos zone: X → tone/pitch,
         * Y → decay/FX, pressure → velocity; the last position persists
         * as the edition's tone shape and is saved into children. */
        if (type === "up") return;
        const gridTopNorm = 1 - DRUM_GRID_FRAC;
        if (y >= gridTopNorm && this.mode === "instrument") {
          if (type !== "down") return;                       // no drag-toggling
          const steps = this.pattern.length, cols = 16, rows = steps / 16;
          const col = Math.min(cols - 1, ((x * cols) | 0));
          const row = Math.min(rows - 1, (((y - gridTopNorm) / DRUM_GRID_FRAC) * rows) | 0);
          const i = row * cols + col;
          const p = this.pattern.map(s => s && { ...s });
          if (point.shiftKey) { if (p[i]) p[i].accent = !p[i].accent; else p[i] = { vel: 0.9, prob: 1, pitch: 0, accent: true }; }
          else p[i] = p[i] ? null : { vel: 0.72, prob: 1, pitch: 0, accent: false };
          this.setPattern(p);
          this.onPatternEdit?.(this.pattern);
          const drums = await this.ensureDrums();            // audible feedback
          if (p[i]) drums.hit(null, p[i].vel, drums.context.currentTime + 0.005, { pitch: p[i].pitch, x: this.toneShape.x, y: this.toneShape.y });
          return;
        }
        const now = performance.now();
        if (type === "move" && now - this.lastPadHitMs < 85) return;
        this.lastPadHitMs = now;
        const chaosY = clamp01(y / gridTopNorm);             // normalise chaos zone
        this.toneShape = { x, y: 1 - chaosY };               // persist the shaping
        this.toneShapeDirty = true;
        const drums = await this.ensureDrums();
        if (!active.includes(this)) { enforceVoiceCap(); active.push(this); }
        drums.hit(null, 0.35 + pressure * 0.6, drums.context.currentTime + 0.005, { x, y: 1 - chaosY });
        return;
      }
      if (type === "up") { this.voice?.noteOff(); return; }
      const voice = await this.ensureVoice(), t = voice.context.currentTime;
      const midi = G.quantiseX(this.genome, x, 2);
      if (type === "down") voice.noteOn(midi, 0.4 + pressure * 0.6, t); else voice.setPitch(midi, t);
      voice.setCutoffNorm(1 - y, t); voice.setDrive(pressure);
      // The kaos position persists (Y → tone brightness) so it survives into the
      // looping default and is carried back to the mosaic tile.
      this.toneShape = { x, y: 1 - y }; this.toneShapeDirty = true;
    }

    /* ---------- MIDI / computer-keyboard note input (mono, scale-locked) ---------- */
    snapToScale(midiNote) {
      const { scale, rootMidi } = G.MUSIC;
      const pc = ((midiNote - rootMidi) % 12 + 12) % 12;
      let best = scale[0], bd = 99;
      for (const d of scale) { const diff = Math.min((pc - d + 12) % 12, (d - pc + 12) % 12); if (diff < bd) { bd = diff; best = d; } }
      return rootMidi + best + Math.round((midiNote - (rootMidi + best)) / 12) * 12;
    }
    /* Map a snapped MIDI note back to the pad x that reproduces it, so MIDI /
     * keyboard notes record & replay through the same gesture format. */
    midiToX(midi) {
      const span = G.MUSIC.scale.length * 2;
      for (let d = 0; d < span; d++) if (G.quantiseX(this.genome, (d + 0.5) / span, 2) === midi) return (d + 0.5) / span;
      return 0.5;
    }
    async playMidiNote(midiNote, velocity = 0.8) {
      if (this.isDrum) {
        const d = await this.ensureDrums();
        if (!active.includes(this)) { enforceVoiceCap(); active.push(this); }
        const x = this.toneShape.x, y = this.toneShape.y;
        if (this.recording) this.recording.events.push({ tick: this.nowTick(), type: "down", x, y: 1 - y, pressure: velocity });
        d.hit(null, velocity, d.context.currentTime + 0.002, { pitch: Math.max(-12, Math.min(12, midiNote - 60)), x, y });
        return;
      }
      const v = await this.ensureVoice();
      const snapped = this.snapToScale(midiNote);
      const held = (this.heldNotes ||= new Set());
      const x = this.midiToX(snapped);
      this.pointer = { x, y: 0.5, active: true };
      if (this.recording) this.recording.events.push({ tick: this.nowTick(), type: held.size ? "move" : "down", x, y: 0.5, pressure: velocity });
      held.add(midiNote);
      v.noteOn(snapped, velocity, v.context.currentTime);
      this.setStatus(`note ${snapped}`);
    }
    releaseMidiNote(midiNote) {
      if (this.isDrum) return;
      this.heldNotes?.delete(midiNote);
      if (!this.heldNotes || this.heldNotes.size === 0) {
        this.voice?.noteOff(); this.pointer.active = false;
        if (this.recording) this.recording.events.push({ tick: this.nowTick(), type: "up" });
      }
    }

    nowTick() { return Math.round((performance.now() - this.recordStartMs) / 1000 / TICK_SECONDS); }
    startRecording() {
      // The default stops the moment recording begins so the take is clean;
      // drum editions keep their beat looping under the tone gestures.
      if (!this.isDrum) { this.stopTransport(); this.setState("idle"); }
      this.recordStartMs = performance.now(); this.recording = { events: [] }; this.setStatus("recording");
      clearTimeout(this.recordingTimer);
      this.recordingTimer = setTimeout(() => this.stopRecording(), P.MAX_DURATION_TICKS * TICK_SECONDS * 1000);
    }
    patternDiffersFromGenesis() {
      if (!this.isDrum) return false;
      return JSON.stringify(this.pattern) !== JSON.stringify(this.genesisPattern);
    }
    stopRecording() {
      if (!this.recording) return null;
      clearTimeout(this.recordingTimer); this.recordingTimer = null;
      const events = this.recording.events.slice(0, P.MAX_EVENTS); this.recording = null;
      const editedPattern = this.patternDiffersFromGenesis() ? this.pattern : null;
      if (events.length === 0 && !editedPattern) { this.setStatus("idle"); return null; }
      if (events.length && events[events.length - 1].type !== "up") {
        const up = { tick: Math.min(this.nowTick(), P.MAX_DURATION_TICKS), type: "up" };
        if (events.length === P.MAX_EVENTS) events[events.length - 1] = up; else events.push(up);
      }
      const loop = this.loopTicks;
      const lastTick = events.length ? events[events.length - 1].tick : loop;
      const durationTicks = Math.min(P.MAX_DURATION_TICKS, Math.max(loop, Math.ceil(lastTick / loop) * loop));
      const opts = {};
      if (editedPattern) { opts.pattern = editedPattern; opts.loopBars = this.genome.loopBars; }
      if (this.isDrum && this.toneShapeDirty) opts.tone = this.toneShape;
      this.performance = P.validate(P.create(
        { edition: this.edition, genomeHash: this.genomeHash, engineVersion: this.genome.engineVersion, bpm: G.MUSIC.bpm },
        events, durationTicks,
        Object.keys(opts).length ? opts : undefined
      ));
      this.setStatus(`captured ${events.length} events${editedPattern ? " + pattern" : ""}${opts.tone ? " + tone" : ""}`);
      return this.performance;
    }
    /* Beat/tone-only child: inscribe the edited pattern + tone, no gestures. */
    capturePattern() {
      if (!this.isDrum) throw new Error("Only drum editions carry a step pattern.");
      if (!this.patternDiffersFromGenesis() && !this.toneShapeDirty) throw new Error("Pattern and tone match genesis — edit them first.");
      this.performance = P.validate(P.create(
        { edition: this.edition, genomeHash: this.genomeHash, engineVersion: this.genome.engineVersion, bpm: G.MUSIC.bpm },
        [], this.loopTicks,
        { pattern: this.pattern, loopBars: this.genome.loopBars, ...(this.toneShapeDirty ? { tone: this.toneShape } : {}) }
      ));
      this.setStatus("pattern captured");
      return this.performance;
    }
    clearPerformance() { this.performance = null; }
    loadPerformance(json) {
      this.performance = P.validate(typeof json === "string" ? JSON.parse(json) : json, {
        edition: this.edition, genomeHash: this.genomeHash, engineVersion: this.genome.engineVersion,
        patternLength: this.isDrum ? this.genome.loopBars * G.STEPS_PER_BAR : null
      });
      return this.performance;
    }
    exportPerformance() { if (!this.performance) throw new Error("No performance captured yet."); return JSON.stringify(this.performance); }
    async playPerformance(perf) {
      const target = perf ? this.loadPerformance(perf) : this.performance;
      if (!target) throw new Error("No performance to play.");
      if (this.isDrum && target.pattern) this.setPattern(target.pattern);      // child changes the beat
      if (this.isDrum && target.tone) { this.toneShape = { ...target.tone }; this.toneShapeDirty = true; } // …and the tone
      if (this.isDrum) { await this.ensureDrums(); await this.playMelody(); }  // pattern loops under the gestures
      else await this.ensureVoice();
      if (!this.isDrum) { this.stopTransport(); this.setState("live"); this.loopStartTime = (this.voice?.context.currentTime ?? 0); this.loopSeconds = target.durationTicks * TICK_SECONDS; }
      this.playing = "performance"; this.setStatus("replaying performance");
      const loopMs = target.durationTicks * TICK_SECONDS * 1000;
      const schedule = () => { for (const e of target.events) this.timers.push(setTimeout(() => { void this.gesture(e); }, e.tick * TICK_SECONDS * 1000)); this.timers.push(setTimeout(schedule, loopMs)); };
      if (target.events.length) schedule();
    }

    renderShell() {
      const g = this.genome, m = g.mosaic, compact = this.mode === "preview";
      this.container.innerHTML = `
        <div class="pof-instrument" data-protocol="${PROTOCOL}" data-edition="${this.edition}" data-family="${m.family}"
             style="height:100%;display:grid;grid-template-rows:${compact ? "1fr" : "auto 1fr auto"};gap:10px;color:#fff;font-family:ui-monospace,monospace">
          ${compact ? "" : `
          <header style="display:flex;justify-content:space-between;align-items:end">
            <div><small style="opacity:.6;letter-spacing:.08em">PROOF OF FREE · LIVING SYNTH v5</small>
              <h1 style="font-size:clamp(16px,3vw,26px);margin:2px 0 0">Edition ${String(this.edition).padStart(4, "0")}</h1></div>
            <small style="opacity:.6;text-align:right">ENGINE #${this.engineId} · v${g.engineVersion}<br>${this.genomeHash}</small>
          </header>`}
          <div class="pof-pad" role="application" aria-label="Chaos pad, edition ${this.edition}"
            style="position:relative;width:100%;aspect-ratio:1/1;max-height:${compact ? "100%" : "min(58vh,520px)"};margin:0 auto;overflow:hidden;border:1px solid ${m.accent}99;border-radius:14px;touch-action:none;cursor:crosshair;background:#060608">
            <canvas style="position:absolute;inset:0;width:100%;height:100%"></canvas>
          </div>
          ${compact ? "" : `
          <footer style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:11px;opacity:.75">
            <span>${m.family.toUpperCase()} · ${this.isDrum ? `DRUM · ${g.drum.type.toUpperCase()}` : m.role.toUpperCase()} · ${g.loopBars}-BAR</span>
            <span>${this.isDrum ? `X TONE/PITCH · Y DECAY · PRESSURE DRIVE` : `${g.oscillator.typeA.toUpperCase()}+${g.oscillator.typeB.toUpperCase()} · ROOT ${g.rootNote}`} · ${G.MUSIC.root} DORIAN ${G.MUSIC.bpm}BPM</span>
            <span class="pof-status">idle</span>
          </footer>`}
        </div>`;
      this.pad = this.container.querySelector(".pof-pad");
      this.canvas = this.container.querySelector("canvas");
      this.c = this.canvas.getContext("2d");
      this.statusEl = this.container.querySelector(".pof-status");
      this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this.canvas); this.resize();
      buildAtlas();
    }
    resize() {
      const ratio = Math.min(2, devicePixelRatio || 1), box = this.canvas.getBoundingClientRect();
      this.canvas.width = Math.max(1, Math.round(box.width * ratio));
      this.canvas.height = Math.max(1, Math.round(box.height * ratio));
      this.c.setTransform(ratio, 0, 0, ratio, 0, 0);
      this._w = this.canvas.width / ratio; this._h = this.canvas.height / ratio;
    }
    setStatus(t) { if (this.statusEl) this.statusEl.textContent = t; }

    animate(now) {
      this.raf = requestAnimationFrame(this.animate);
      const c = this.c, W = this._w, H = this._h; if (!W) return;
      const g = this.genome, m = g.mosaic, an = g.animation, time = now / 1000;
      const v = this.voice, lvl = v ? v.level() : 0;
      // background wash
      const grd = c.createRadialGradient(W * (0.3 + m.gridX / 64), H * 0.4, 8, W / 2, H / 2, W * 0.8);
      grd.addColorStop(0, mix(m.color, "#000000", 0.35 - lvl * 0.2));
      grd.addColorStop(1, "#050507");
      c.fillStyle = grd; c.fillRect(0, 0, W, H);
      // trails
      c.fillStyle = "rgba(5,5,7,0.18)"; c.fillRect(0, 0, W, H);

      if (this.isDrum) {
        this.drawDrumMachine(c, W, H, m, time);
      } else if (v && (this.playing || this.pointer.active)) {
        if (an.kind === "bars" || m.role === "bass" || m.role === "pad") this.drawSpectrum(c, W, H, v, m);
        else if (an.kind === "scope" || m.role === "lead") this.drawScope(c, W, H, v, m);
        else this.drawGlyphLive(c, W, H, m, an, time, lvl);
      } else {
        this.drawIdle(c, W, H, m, an, time);
      }
      // pointer cursor
      if (this.pointer.active) {
        c.strokeStyle = m.accent; c.lineWidth = 2; c.globalAlpha = 0.8;
        c.beginPath(); c.arc(this.pointer.x * W, this.pointer.y * H, 12 + lvl * 30, 0, 7); c.stroke();
        c.globalAlpha = 1;
      }
    }
    /* Drum NFT pad: the pattern IS the interface. The bottom strip is the
     * live step sequencer (tap = toggle, shift-tap = accent), the zone above
     * is the tone chaos pad with a marker at the persistent tone shape. */
    drawDrumMachine(c, W, H, m, time) {
      const pattern = this.pattern || [], steps = pattern.length || 16;
      const cols = 16, rows = Math.max(1, steps / 16);
      const gridTop = H * (1 - DRUM_GRID_FRAC), gridH = H * DRUM_GRID_FRAC;
      const cw = W / cols, rh = gridH / rows;
      const d = this.drumVoice, lvl = d ? d.level() : 0;
      // chaos zone: big glyph reacting to the real output level
      c.globalAlpha = 0.1 + lvl * 0.45; c.fillStyle = m.accent;
      c.font = `bold ${gridTop * 0.72}px ui-monospace, monospace`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText({ kick: "K", snare: "S", closedHat: "H", openHat: "O", tom: "T", clap: "C", perc: "P" }[this.genome.drum.type] || "P", W / 2, gridTop * 0.5);
      // real waveform across the chaos zone
      if (d && (this.playing || this.pointer.active)) {
        d.analyser.getByteTimeDomainData(d.wave);
        c.strokeStyle = m.accent; c.lineWidth = 1.6; c.globalAlpha = 0.8; c.beginPath();
        for (let i = 0; i < d.wave.length; i += 4) { const px = i / d.wave.length * W, py = (d.wave[i] / 255) * gridTop; i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
      }
      // persistent tone marker
      c.globalAlpha = 0.9; c.strokeStyle = "#fff"; c.lineWidth = 1.5;
      const tx = this.toneShape.x * W, ty = (1 - this.toneShape.y) * gridTop;
      c.beginPath(); c.arc(tx, ty, 8, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(tx - 13, ty); c.lineTo(tx + 13, ty); c.moveTo(tx, ty - 13); c.lineTo(tx, ty + 13); c.stroke();
      // divider + hint
      c.globalAlpha = 0.5; c.strokeStyle = "rgba(255,255,255,0.25)"; c.lineWidth = 1;
      c.beginPath(); c.moveTo(0, gridTop); c.lineTo(W, gridTop); c.stroke();
      c.globalAlpha = 0.45; c.fillStyle = "#fff"; c.font = "9px ui-monospace, monospace"; c.textAlign = "left"; c.textBaseline = "bottom";
      c.fillText("TONE PAD — X pitch · Y decay", 8, gridTop - 6);
      // step grid (playhead synced to the actual transport clock)
      let playStep = -1;
      const context = d?.context;
      if (this.playing && context && this.loopSeconds) {
        const pos = ((context.currentTime - this.loopStartTime) % this.loopSeconds + this.loopSeconds) % this.loopSeconds;
        playStep = Math.min(steps - 1, (pos / this.loopSeconds * steps) | 0);
      }
      c.textAlign = "center"; c.textBaseline = "middle";
      for (let i = 0; i < steps; i++) {
        const cx = (i % cols) * cw, cy = gridTop + ((i / cols) | 0) * rh;
        const s = pattern[i];
        c.fillStyle = s ? (s.accent ? m.accent : mix(m.color, m.accent, 0.55)) : "rgba(255,255,255,0.05)";
        c.globalAlpha = s ? 0.45 + (s.vel ?? 0.7) * 0.55 : 1;
        c.fillRect(cx + 1.5, cy + 1.5, cw - 3, rh - 3);
        if (i % 4 === 0 && !s) { c.globalAlpha = 0.25; c.fillStyle = "#fff"; c.font = `${Math.max(7, rh * 0.28)}px ui-monospace`; c.fillText(String(i % 16 + 1), cx + cw / 2, cy + rh / 2); }
        if (i === playStep) { c.globalAlpha = 0.95; c.strokeStyle = i === playStep && s ? "#fff" : "rgba(255,255,255,0.7)"; c.lineWidth = 2; c.strokeRect(cx + 1.5, cy + 1.5, cw - 3, rh - 3); }
      }
      c.globalAlpha = 1;
    }
    drawSpectrum(c, W, H, v, m) {
      v.analyser.getByteFrequencyData(v.freq); const n = 40, bw = W / n;
      for (let i = 0; i < n; i++) {
        const val = v.freq[i] / 255, h = val * H * 0.9;
        c.fillStyle = mix(m.color, m.accent, val);
        c.fillRect(i * bw, H - h, bw - 1, h);
      }
    }
    drawScope(c, W, H, v, m) {
      v.analyser.getByteTimeDomainData(v.wave); c.strokeStyle = m.accent; c.lineWidth = 2; c.beginPath();
      for (let i = 0; i < v.wave.length; i += 2) { const x = i / v.wave.length * W, y = (v.wave[i] / 255) * H; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke();
    }
    drawGlyphLive(c, W, H, m, an, time, lvl) {
      const a = buildAtlas(), sp = a.map[an.word] || a.map["0"], word = an.word || "0";
      c.save(); c.translate(W / 2, H / 2);
      const scale = 0.6 + lvl * 0.5 + 0.05 * Math.sin(time * 3);
      c.globalAlpha = 0.9;
      if (word === "0") {
        c.rotate(time * 0.4);
        c.strokeStyle = m.accent; c.lineWidth = 4 + lvl * 10;
        c.beginPath(); c.arc(0, 0, Math.min(W, H) * 0.28 * (0.8 + lvl), 0, 7); c.stroke();
        c.setLineDash([6, 10]); c.globalAlpha = 0.5;
        c.beginPath(); c.arc(0, 0, Math.min(W, H) * 0.36, time, time + 5.6); c.stroke(); c.setLineDash([]);
      } else {
        const sz = Math.min(W, H) * 0.7 * scale;
        c.globalAlpha = 0.85; c.drawImage(a.canvas, sp.sx, sp.sy, sp.cell, sp.cell, -sz / 2, -sz / 2, sz, sz);
        c.globalAlpha = 0.25; c.fillStyle = m.accent; c.fillRect(-W / 2, (Math.sin(time * 2) * 0.4) * H, W, 2);
      }
      c.restore();
    }
    drawIdle(c, W, H, m, an, time) {
      const a = buildAtlas();
      if (an.kind === "glyph") {
        const sp = a.map[an.word] || a.map["0"], sz = Math.min(W, H) * 0.62;
        c.globalAlpha = 0.35 + 0.3 * Math.abs(Math.sin(time * an.speed));
        c.drawImage(a.canvas, sp.sx, sp.sy, sp.cell, sp.cell, (W - sz) / 2, (H - sz) / 2, sz, sz);
        c.globalAlpha = 1;
      } else if (an.kind === "bars") {
        const n = 12, bw = W / n; c.fillStyle = m.accent; c.globalAlpha = 0.7;
        for (let i = 0; i < n; i++) { const h = H * (0.15 + 0.5 * Math.abs(Math.sin(time * an.speed + i * 0.5))); c.fillRect(i * bw + 2, H - h, bw - 4, h); }
        c.globalAlpha = 1;
      } else if (an.kind === "scope") {
        c.strokeStyle = m.accent; c.lineWidth = 2; c.globalAlpha = 0.7; c.beginPath();
        for (let i = 0; i <= 48; i++) { const x = i / 48 * W, y = H / 2 + Math.sin(time * an.speed * 2 + i * 0.3) * H * 0.24; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke(); c.globalAlpha = 1;
      } else {
        c.fillStyle = m.accent;
        for (let i = 0; i < 5; i++) { const ang = time * an.speed * (1 + i * 0.2) + i, r = Math.min(W, H) * (0.1 + i * 0.06); c.globalAlpha = 0.7 - i * 0.1; c.beginPath(); c.arc(W / 2 + Math.cos(ang) * r, H / 2 + Math.sin(ang) * r, 4, 0, 7); c.fill(); }
        c.globalAlpha = 1;
      }
    }

    bindPad() {
      const pointOf = (e, type) => { const b = this.pad.getBoundingClientRect(); return { type, x: clamp01((e.clientX - b.left) / b.width), y: clamp01((e.clientY - b.top) / b.height), pressure: clamp01(e.pressure || 0.65), shiftKey: !!e.shiftKey }; };
      this.pad.addEventListener("pointerdown", e => { this.pointerDown = true; this.pad.setPointerCapture?.(e.pointerId); void this.gesture(pointOf(e, "down")); });
      this.pad.addEventListener("pointermove", e => { if (this.pointerDown) void this.gesture(pointOf(e, "move")); });
      const up = e => { if (!this.pointerDown) return; this.pointerDown = false; void this.gesture(pointOf(e, "up")); };
      this.pad.addEventListener("pointerup", up); this.pad.addEventListener("pointercancel", up);
    }
  }

  function mix(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(((pa >> 16 & 255) * (1 - t) + (pb >> 16 & 255) * t));
    const g = Math.round(((pa >> 8 & 255) * (1 - t) + (pb >> 8 & 255) * t));
    const bl = Math.round(((pa & 255) * (1 - t) + (pb & 255) * t));
    return `rgb(${r},${g},${bl})`;
  }

  const api = Object.freeze({
    protocol: PROTOCOL, engineVersion: G.ENGINE_VERSION, music: G.MUSIC, genome: G, performance: P,
    tuning: TUNING,        // mosaic legibility knobs, read live every frame (see apps/tuner)
    mount(container, options) { return new Instrument(container, options); },
    createMosaic, buildAtlas,
    activeCount() { return active.length; },
    setMaxActive(n) { maxActive = n === 16 ? 16 : 8; enforceVoiceCap(); return maxActive; },
    getMaxActive() { return maxActive; },
    async ensureAudio() { return audio(); },
    now(lead = 0) { return (ctx ? ctx.currentTime : 0) + lead; },   // shared clock for phase-locked launches
    tickSeconds: TICK_SECONDS,                                       // one transport tick, in seconds
    /* Current position on the shared transport, in ticks from musical zero.
     * Session recordings timestamp live-set events against this clock. */
    transportTick() { return (ctx && transportOrigin !== null) ? Math.max(0, Math.round((ctx.currentTime - transportOrigin) / TICK_SECONDS)) : 0; },
    stopAll() { [...active].forEach(i => i.silence()); },           // instant kill-all
    drainAll() { [...active].forEach(i => i.stopAtLoopEnd()); }     // finish-loops stop-all
  });
  globalThis.ProofOfFree = api;

  /* Recursive-inscription auto-boot. */
  const seedNode = document.getElementById("pof-seed");
  if (seedNode) {
    const seed = JSON.parse(seedNode.textContent || "{}");
    const genome = G.deriveGenome(seed.edition);
    if (seed.protocol !== "proof-of-free/seed" || seed.version !== 5 || !Number.isSafeInteger(seed.engineId) || seed.engineId < 0 || seed.engineVersion !== G.ENGINE_VERSION || seed.genomeHash !== G.genomeHash(genome)) {
      throw new Error("Invalid Proof of Free v5 seed");
    }
    document.documentElement.style.cssText = "height:100%;background:#050507";
    document.body.style.cssText = "height:100%;margin:0;padding:14px;box-sizing:border-box;overflow:hidden;background:#050507";
    const rootEl = document.createElement("div"); rootEl.style.height = "100%"; document.body.appendChild(rootEl);
    const instrument = api.mount(rootEl, { edition: seed.edition, engineId: seed.engineId });
    dispatchEvent(new CustomEvent("proof-of-free:ready", { detail: { protocol: PROTOCOL, edition: seed.edition, engineId: seed.engineId, genomeHash: instrument.genomeHash } }));
  }
})();
