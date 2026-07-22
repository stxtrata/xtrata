// engine.js — Web Audio playback engine with sample-accurate lookahead scheduling.

import { store, NUM_CHANNELS, NUM_STEPS, NUM_INSTRUMENTS, stepVal, stepObj } from './state.js';
import { SYNTH_BANK, synthDefaults } from './synths.js';
import { PLUGIN_TYPES, pluginDefaults } from './plugins.js';

const LOOKAHEAD_MS = 25;      // scheduler tick
const SCHEDULE_AHEAD = 0.12;  // seconds scheduled in advance

class Engine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.channelGains = [];
    this.buffers = new Array(NUM_CHANNELS).fill(null);          // decoded AudioBuffers
    this.reverseBuffers = new Array(NUM_CHANNELS).fill(null);   // lazily built
    this.isPlaying = false;
    this.currentStep = 0;
    this.playingSequence = 0;
    this.nextStepTime = 0;
    this.timer = null;
    this.onStep = null;   // UI callback (step, sequence, time)
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = store.project.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      // --- master FX buses ---
      // Delay bus: dotted-8th echo, BPM-synced, with filtered feedback.
      this.delayNode = this.ctx.createDelay(2);
      this.delayNode.delayTime.value = this._delayTime();
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.35;
      const delayTone = this.ctx.createBiquadFilter();
      delayTone.type = 'lowpass'; delayTone.frequency.value = 4000;
      this.delayNode.connect(delayTone).connect(this.delayFeedback).connect(this.delayNode);
      this.delayNode.connect(this.masterGain);
      // Reverb bus: generated noise impulse (fully on-board, no external files).
      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this._makeImpulse(2.2, 3);
      this.reverbNode.connect(this.masterGain);

      // --- per-channel chains: gain → filter → drive → master (+ delay/reverb sends) ---
      this.channelFilters = [];
      this.channelShapers = [];
      this.channelDelaySends = [];
      this.channelReverbSends = [];
      this.ensureChannelChains();

      // --- instrument (synth) channels ---
      this.instrumentGains = [];
      for (let i = 0; i < NUM_INSTRUMENTS; i++) {
        const g = this.ctx.createGain();
        g.gain.value = store.instrument(i).volume;
        g.connect(this.masterGain);
        this.instrumentGains.push(g);
      }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.ensureChannelChains();
    return this.ctx;
  }

  // Grow per-channel audio chains to match the (dynamic) channel count.
  ensureChannelChains() {
    if (!this.ctx) return;
    for (let i = this.channelGains.length; i < store.numChannels; i++) {
      const g = this.ctx.createGain();
      g.gain.value = store.channel(i).volume;
      const f = this.ctx.createBiquadFilter();
      const ws = this.ctx.createWaveShaper();
      const dSend = this.ctx.createGain(); dSend.gain.value = 0;
      const rSend = this.ctx.createGain(); rSend.gain.value = 0;
      g.connect(f).connect(ws);
      const insertOut = this.ctx.createGain();
      ws.connect(insertOut); // default: empty chain (rebuilt by rebuildInserts)
      insertOut.connect(this.masterGain);
      insertOut.connect(dSend).connect(this.delayNode);
      insertOut.connect(rSend).connect(this.reverbNode);
      (this.insertOuts ||= []).push(insertOut);
      (this.insertChains ||= []).push([]);
      this.channelGains.push(g);
      this.channelFilters.push(f);
      this.channelShapers.push(ws);
      this.channelDelaySends.push(dSend);
      this.channelReverbSends.push(rSend);
      this.applyFx(i);
      this.rebuildInserts(i);
    }
  }

  // (Re)build the insert plugin chain for a channel from store state.
  rebuildInserts(ch) {
    if (!this.ctx || !this.insertOuts?.[ch]) return;
    const ws = this.channelShapers[ch];
    const out = this.insertOuts[ch];
    // tear down old chain
    try { ws.disconnect(); } catch { /* noop */ }
    for (const inst of this.insertChains[ch] || []) {
      try { inst.nodes.output.disconnect(); } catch { /* noop */ }
      try { inst.nodes.lfo?.stop(); } catch { /* noop */ }
    }
    this.insertChains[ch] = [];
    const defs = (store.channel(ch).inserts || []).filter(i => i && i.enabled && PLUGIN_TYPES[i.type]);
    let node = ws;
    for (const def of defs) {
      const type = PLUGIN_TYPES[def.type];
      const nodes = type.create(this.ctx);
      type.apply(this.ctx, nodes, { ...pluginDefaults(def.type), ...(def.params || {}) });
      node.connect(nodes.input);
      node = nodes.output;
      this.insertChains[ch].push({ def, type, nodes });
    }
    node.connect(out);
    this._ensureGateLoop();
  }

  // Live-update params of insert `slot` on channel without rebuilding the graph.
  updateInsertParams(ch, slot) {
    const chain = this.insertChains?.[ch];
    const def = store.channel(ch).inserts?.[slot];
    if (!chain || !def) return;
    const inst = chain.find(c => c.def === def);
    if (inst) inst.type.apply(this.ctx, inst.nodes, { ...pluginDefaults(def.type), ...(def.params || {}) });
  }

  // Service loop for control-rate plugins (noise gate level detection).
  _ensureGateLoop() {
    const hasGate = (this.insertChains || []).some(chain => chain.some(c => c.type.service));
    if (hasGate && !this._gateTimer) {
      this._gateTimer = setInterval(() => {
        for (const chain of this.insertChains || []) {
          for (const c of chain) c.type.service?.(this.ctx, c.nodes);
        }
      }, 30);
    } else if (!hasGate && this._gateTimer) {
      clearInterval(this._gateTimer);
      this._gateTimer = null;
    }
  }

  _delayTime() {
    return (60 / (store.project.bpm || 120)) * 0.75; // dotted 8th
  }

  syncDelayToBpm() {
    if (this.delayNode) this.delayNode.delayTime.setTargetAtTime(this._delayTime(), this.ctx.currentTime, 0.05);
  }

  _makeImpulse(duration, decayPow) {
    const len = Math.ceil(this.ctx.sampleRate * duration);
    const buf = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decayPow);
      }
    }
    return buf;
  }

  _driveCurve(amount) {
    const curve = new Float32Array(257);
    const k = 1 + amount * 12;
    for (let i = 0; i < 257; i++) {
      const x = i / 128 - 1;
      curve[i] = amount > 0 ? Math.tanh(x * k) / Math.tanh(k) : x;
    }
    return curve;
  }

  // Apply a channel's fx settings ({filter, cutoff, drive, delay, reverb}) to its nodes.
  applyFx(ch) {
    if (!this.ctx || !this.channelFilters[ch]) return;
    const fx = store.channel(ch).fx || {};
    const f = this.channelFilters[ch];
    if (fx.filter === 'lp') { f.type = 'lowpass'; f.frequency.value = fx.cutoff || 8000; f.Q.value = 0.9; }
    else if (fx.filter === 'hp') { f.type = 'highpass'; f.frequency.value = fx.cutoff || 200; f.Q.value = 0.9; }
    else { f.type = 'lowpass'; f.frequency.value = 20000; f.Q.value = 0.0001; } // bypass
    this.channelShapers[ch].curve = this._driveCurve(fx.drive || 0);
    this.channelDelaySends[ch].gain.value = fx.delay || 0;
    this.channelReverbSends[ch].gain.value = fx.reverb || 0;
  }

  setBuffer(ch, buffer) {
    this.buffers[ch] = buffer;
    this.reverseBuffers[ch] = null;
  }

  getReverseBuffer(ch) {
    if (!this.reverseBuffers[ch] && this.buffers[ch]) {
      const src = this.buffers[ch];
      const rev = this.ctx.createBuffer(src.numberOfChannels, src.length, src.sampleRate);
      for (let c = 0; c < src.numberOfChannels; c++) {
        const from = src.getChannelData(c);
        const to = rev.getChannelData(c);
        for (let i = 0, n = src.length; i < n; i++) to[i] = from[n - 1 - i];
      }
      this.reverseBuffers[ch] = rev;
    }
    return this.reverseBuffers[ch];
  }

  setChannelVolume(ch, v) {
    if (this.channelGains[ch]) this.channelGains[ch].gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
  }

  setInstrumentVolume(i, v) {
    if (this.instrumentGains?.[i]) this.instrumentGains[i].gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
  }

  // Play a synth note. time=0 → now (preview). durSteps converted by caller to seconds.
  triggerNote(i, pitch, vel = 1, time = 0, durSec = 0.3) {
    this.ensureContext();
    const inst = store.instrument(i);
    const synth = SYNTH_BANK[inst.synthId];
    if (!synth) return;
    const params = { ...synthDefaults(inst.synthId), ...(inst.params || {}) };
    try {
      synth.voice(this.ctx, this.instrumentGains[i], { pitch, vel, time: time || this.ctx.currentTime, dur: durSec }, params);
    } catch (e) { console.warn('voice error', e); }
  }

  setMasterVolume(v) {
    if (this.masterGain) this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
  }

  stepDuration() {
    return 60 / store.project.bpm / 4; // 16th notes
  }

  play() {
    this.ensureContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.playingSequence = store.project.currentSequence;
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this._tick();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timer);
  }

  stop() {
    this.pause();
    this.currentStep = 0;
    if (this.onStep) this.onStep(-1, this.playingSequence);
  }

  _tick() {
    while (this.nextStepTime < this.ctx.currentTime + SCHEDULE_AHEAD) {
      this._scheduleStep(this.currentStep, this.nextStepTime);
      this._advance();
    }
    this.timer = setTimeout(() => this.isPlaying && this._tick(), LOOKAHEAD_MS);
  }

  _advance() {
    const dur = this.stepDuration();
    const swing = store.project.swing / 100; // 0..0.6
    // swing: odd 16ths delayed by fraction of a step
    this.nextStepTime += dur + (this.currentStep % 2 === 0 ? dur * swing : -dur * swing);
    this.currentStep++;
    if (this.currentStep >= NUM_STEPS) {
      this.currentStep = 0;
      if (store.project.continuous) {
        // advance to next non-empty sequence, wrapping to 0
        const seqs = store.project.sequences;
        let next = this.playingSequence + 1;
        if (next >= seqs.length || this._isEmpty(seqs[next])) next = 0;
        this.playingSequence = next;
        store.selectSequence(next);
      }
    }
  }

  _isEmpty(seq) {
    return seq.steps.every(row => row.every(v => v === 0))
      && (seq.notes || []).every(list => list.length === 0);
  }

  _scheduleStep(step, time) {
    const seq = store.project.sequences[this.playingSequence];
    const anySolo = store.project.channels.some(c => c.solo);
    for (let ch = 0; ch < store.numChannels; ch++) {
      const raw = seq.steps[ch]?.[step];
      const v = stepVal(raw);
      if (!v) continue;
      const c = store.channel(ch);
      if (c.mute || (anySolo && !c.solo)) continue;
      this.trigger(ch, time, v === 2 ? 1.25 : 1, stepObj(raw));
    }
    // instrument notes starting on this step
    const anyInstSolo = store.project.instruments.some(s2 => s2.solo);
    const stepDur = this.stepDuration();
    for (let i = 0; i < NUM_INSTRUMENTS; i++) {
      const inst = store.instrument(i);
      if (inst.mute || (anyInstSolo && !inst.solo)) continue;
      for (const n of (seq.notes?.[i] || [])) {
        if (n.step === step) this.triggerNote(i, n.pitch, n.vel, time, n.dur * stepDur);
      }
    }
    if (this.onStep) {
      const delay = Math.max(0, (time - this.ctx.currentTime) * 1000);
      setTimeout(() => this.isPlaying && this.onStep(step, this.playingSequence), delay);
    }
  }

  // Trigger a channel's sample at `time`. `over` = per-step overrides
  // ({rev, trimStart, trimEnd, pitch}) that take precedence over channel settings.
  trigger(ch, time = 0, velocity = 1, over = null) {
    this.ensureContext();
    const c = store.channel(ch);
    const rev = over?.rev ?? c.reverse;
    const pitch = over?.pitch ?? c.pitch;
    const trimStart = over?.trimStart ?? c.trimStart;
    const trimEnd = over?.trimEnd ?? c.trimEnd;
    const buffer = rev ? this.getReverseBuffer(ch) : this.buffers[ch];
    if (!buffer) return;
    const t = time || this.ctx.currentTime;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = pitch;

    let start = trimStart * buffer.duration;
    const dur = Math.max(0.001, (trimEnd - trimStart) * buffer.duration);
    if (rev) start = (1 - trimEnd) * buffer.duration;

    const vg = this.ctx.createGain();
    vg.gain.value = velocity;
    src.connect(vg).connect(this.channelGains[ch]);

    // Cut/crossfade the previous voice on this channel:
    // - per-step xfade (ms) always crossfades, regardless of global choke
    // - otherwise global choke mode cuts with the project fade time
    const xfadeMs = over?.xfade;
    const cutFadeSec = xfadeMs != null && xfadeMs > 0
      ? xfadeMs / 1000
      : (store.project.choke ? Math.max(0.002, (store.project.fadeMs ?? 15) / 1000) : null);
    if (cutFadeSec != null && this._lastVoice?.[ch]) {
      const prev = this._lastVoice[ch];
      try {
        prev.gain.gain.setValueAtTime(prev.gain.gain.value, t);
        prev.gain.gain.linearRampToValueAtTime(0, t + cutFadeSec);
        prev.src.stop(t + cutFadeSec + 0.01);
      } catch { /* already ended */ }
      // fade the new voice IN over the same span for a smooth crossfade
      if (xfadeMs != null && xfadeMs > 0) {
        vg.gain.setValueAtTime(0.0001, t);
        vg.gain.linearRampToValueAtTime(velocity, t + cutFadeSec);
      }
    }
    (this._lastVoice ||= {})[ch] = { src, gain: vg };

    src.start(t, start, dur / pitch);
  }

  // Play a raw AudioBuffer through the master bus (library audition). Returns a stop fn.
  playBuffer(buffer) {
    this.ensureContext();
    if (this._previewSrc) { try { this._previewSrc.stop(); } catch { /* already stopped */ } }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.masterGain);
    src.start();
    this._previewSrc = src;
    return () => { try { src.stop(); } catch { /* noop */ } };
  }

  stopPreview() {
    if (this._previewSrc) { try { this._previewSrc.stop(); } catch { /* noop */ } this._previewSrc = null; }
  }

  // Audition an arbitrary trim range (used by trim modal)
  audition(ch, startFrac, endFrac) {
    this.ensureContext();
    const buffer = this.buffers[ch];
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = store.channel(ch).pitch;
    src.connect(this.channelGains[ch]);
    const start = startFrac * buffer.duration;
    const dur = Math.max(0.001, (endFrac - startFrac) * buffer.duration);
    src.start(this.ctx.currentTime, start, dur);
  }
}

export const engine = new Engine();
