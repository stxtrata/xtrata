import { sustainDuration, sampleLoop } from "./onboard-library.js";
// engine.js — Web Audio playback engine with sample-accurate lookahead scheduling.

import {
  store,
  NUM_CHANNELS,
  NUM_STEPS,
  NUM_INSTRUMENTS,
  stepVal,
  stepObj,
  stepOff,
} from "./state.js";
import { SYNTH_BANK, synthDefaults } from "./synths.js";
import { PLUGIN_TYPES, pluginDefaults, normalizeOwner, returnsOf, BEAT_DIVS } from "./plugins.js";

const LOOKAHEAD_MS = 25; // scheduler tick
const SCHEDULE_AHEAD = 0.12; // seconds scheduled in advance

class Engine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.channelGains = [];
    this.buffers = new Array(NUM_CHANNELS).fill(null); // decoded AudioBuffers
    this.reverseBuffers = new Array(NUM_CHANNELS).fill(null); // lazily built
    this.isPlaying = false;
    this.currentStep = 0;
    this.playingSequence = 0;
    this.nextStepTime = 0;
    this.timer = null;
    this.onStep = null; // UI callback (step, sequence, time)
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = store.project.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      // --- master FX buses (settings live in project.returns, see applyReturns) ---
      // Delay bus: BPM-synced echo, two lines (L and R) so the feedback can ping-pong.
      // Ping-pong 0 leaves line R silent and line L exactly the original single echo
      // (filtered feedback, centre output); at 1 the echoes alternate hard left and right.
      this.delayNode = this.ctx.createDelay(10); // line L: the bus the sends feed
      this.delayR = this.ctx.createDelay(10);
      const dfx = (this.delayFx = {});
      dfx.toneL = this.ctx.createBiquadFilter();
      dfx.toneR = this.ctx.createBiquadFilter();
      dfx.toneL.type = dfx.toneR.type = "lowpass";
      dfx.selfL = this.ctx.createGain();
      dfx.selfR = this.ctx.createGain();
      dfx.crossLR = this.ctx.createGain();
      dfx.crossRL = this.ctx.createGain();
      this.delayNode.connect(dfx.toneL);
      this.delayR.connect(dfx.toneR);
      dfx.toneL.connect(dfx.selfL).connect(this.delayNode);
      dfx.toneR.connect(dfx.selfR).connect(this.delayR);
      dfx.toneL.connect(dfx.crossLR).connect(this.delayR);
      dfx.toneR.connect(dfx.crossRL).connect(this.delayNode);
      dfx.ret = this.ctx.createGain(); // return level into the master
      dfx.centerL = this.ctx.createGain(); // (1 - spread): the stereo-preserving original path
      dfx.centerR = this.ctx.createGain();
      dfx.hardL = this.ctx.createGain(); // spread: collapsed to one side
      dfx.hardR = this.ctx.createGain();
      const pan = this.ctx.createChannelMerger(2);
      this.delayNode.connect(dfx.centerL).connect(dfx.ret);
      this.delayR.connect(dfx.centerR).connect(dfx.ret);
      this.delayNode.connect(dfx.hardL).connect(pan, 0, 0);
      this.delayR.connect(dfx.hardR).connect(pan, 0, 1);
      pan.connect(dfx.ret);
      dfx.ret.connect(this.masterGain);
      // Reverb bus: generated noise impulse (fully on-board, no external files). The impulse
      // is rebuilt when decay, shape, damping or width change; two convolvers crossfade so a
      // new tail never clicks in.
      this.reverbNode = this.ctx.createGain(); // the bus the sends feed
      const rfx = (this.reverbFx = {});
      rfx.pre = this.ctx.createDelay(0.5);
      rfx.ret = this.ctx.createGain();
      rfx.convs = [0, 1].map(() => {
        const conv = this.ctx.createConvolver();
        const gain = this.ctx.createGain();
        gain.gain.value = 0;
        this.reverbNode.connect(rfx.pre);
        rfx.pre.connect(conv);
        conv.connect(gain).connect(rfx.ret);
        return { conv, gain };
      });
      rfx.active = 0;
      rfx.sig = "";
      rfx.ret.connect(this.masterGain);
      this.applyReturns(true);
      if (!this._returnsHooked) {
        this._returnsHooked = true;
        store.on("load", () => this.ctx && this.applyReturns());
      }

      // --- per-channel chains: fader gain → inserts → FX → master ---
      // Both chains are lists of plugins from plugins.js. Delay/reverb are "send"
      // plugins inside the FX chain that tap into the shared buses above.
      this.chains = new Map(); // "c3" | "i0" → { input, out, slots: Map(id → instance), sig }
      this.ensureChannelChains();

      // --- instrument (synth) channels: exactly the same chain as sample channels ---
      this.instrumentGains = [];
      for (let i = 0; i < NUM_INSTRUMENTS; i++) {
        const g = this.ctx.createGain();
        g.gain.value = store.instrument(i).volume;
        this.instrumentGains.push(g);
        this._makeChain(`i${i}`, g);
        this.syncChain(i, true);
      }
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.ensureChannelChains();
    return this.ctx;
  }

  // Grow per-channel audio chains to match the (dynamic) channel count.
  ensureChannelChains() {
    if (!this.ctx) return;
    for (let i = this.channelGains.length; i < store.numChannels; i++) {
      const g = this.ctx.createGain();
      g.gain.value = store.channel(i).volume;
      this.channelGains.push(g);
      this._makeChain(`c${i}`, g);
      this.syncChain(i);
    }
  }

  _makeChain(key, input) {
    const out = this.ctx.createGain();
    out.connect(this.masterGain);
    input.connect(out); // empty chain until syncChain wires plugins in
    this.chains.set(key, { input, out, slots: new Map(), sig: "" });
  }

  // One plugin instance wrapped in a bypass switch:
  //   inp → feed → plugin → wet → out
  //   inp → dry ─────────────────→ out
  // Bypass fades wet/feed down and dry up, so toggling never rebuilds anything and
  // a bypassed send stops feeding its bus.
  _makeInstance(def) {
    const ctx = this.ctx;
    const type = PLUGIN_TYPES[def.type];
    const nodes = type.create(ctx, {
      delayBus: this.delayNode,
      reverbBus: this.reverbNode,
    });
    const inp = ctx.createGain();
    const feed = ctx.createGain();
    const wet = ctx.createGain();
    const dry = ctx.createGain();
    const out = ctx.createGain();
    inp.connect(feed).connect(nodes.input);
    nodes.output.connect(wet).connect(out);
    inp.connect(dry).connect(out);
    const on = def.enabled !== false;
    feed.gain.value = wet.gain.value = on ? 1 : 0;
    dry.gain.value = on ? 0 : 1;
    return { def, typeId: def.type, type, nodes, inp, feed, wet, dry, out, on, pkey: "" };
  }

  _applyParams(it, def) {
    const P = { ...pluginDefaults(def.type), ...(def.params || {}) };
    const key = JSON.stringify(P);
    if (key === it.pkey) return; // unchanged — skip (curves are costly to rebuild)
    it.pkey = key;
    it.type.apply(this.ctx, it.nodes, P);
  }

  _setBypass(it, on) {
    if (it.on === on) return;
    it.on = on;
    const t = this.ctx.currentTime;
    it.feed.gain.setTargetAtTime(on ? 1 : 0, t, 0.008);
    it.wet.gain.setTargetAtTime(on ? 1 : 0, t, 0.008);
    it.dry.gain.setTargetAtTime(on ? 0 : 1, t, 0.008);
  }

  _disposeInstance(it) {
    try {
      it.type.dispose?.(it.nodes);
    } catch {
      /* noop */
    }
    const seen = new Set();
    const walk = (v) => {
      if (!v || typeof v !== "object" || seen.has(v)) return;
      seen.add(v);
      if (Array.isArray(v)) return v.forEach(walk);
      if (v instanceof AudioNode) {
        if (typeof v.stop === "function")
          try {
            v.stop();
          } catch {
            /* already stopped */
          }
        try {
          v.disconnect();
        } catch {
          /* noop */
        }
      }
    };
    Object.values(it.nodes).forEach(walk);
    [it.inp, it.feed, it.wet, it.dry, it.out].forEach(walk);
  }

  // Bring a channel's (or synth's, inst = true) audio chain in line with its
  // store state: inserts then FX. Plugins are kept by slot id, so a reorder only
  // rewires, a bypass only crossfades, and a param change only re-applies params.
  syncChain(idx, inst = false) {
    if (!this.ctx) return;
    const chain = this.chains?.get((inst ? "i" : "c") + idx);
    const owner = inst ? store.instrument(idx) : store.channel(idx);
    if (!chain || !owner) return;
    normalizeOwner(owner);
    const defs = [...owner.inserts, ...owner.fx].filter(
      (d) => PLUGIN_TYPES[d.type],
    );
    const sig = defs.map((d) => `${d.id}:${d.type}`).join("|");
    if (sig !== chain.sig) {
      const next = new Map();
      for (const d of defs) {
        let it = chain.slots.get(d.id);
        if (it && it.typeId !== d.type) {
          this._disposeInstance(it);
          it = null;
        }
        next.set(d.id, it || this._makeInstance(d));
      }
      for (const [id, it] of chain.slots)
        if (next.get(id) !== it) this._disposeInstance(it);
      try {
        chain.input.disconnect();
      } catch {
        /* noop */
      }
      for (const it of next.values())
        try {
          it.out.disconnect();
        } catch {
          /* noop */
        }
      let node = chain.input;
      for (const it of next.values()) {
        node.connect(it.inp);
        node = it.out;
      }
      node.connect(chain.out);
      for (const it of next.values()) if (it.taps) it.out.connect(it.taps.outAn); // face meters survive a reorder
      chain.slots = next;
      chain.sig = sig;
      this._ensureGateLoop();
    }
    for (const d of defs) {
      const it = chain.slots.get(d.id);
      it.def = d;
      this._applyParams(it, d);
      this._setBypass(it, d.enabled !== false);
    }
  }

  // Live param/bypass update for one slot (called while a slider moves).
  updateSlot(idx, inst, id) {
    const chain = this.chains?.get((inst ? "i" : "c") + idx);
    const owner = inst ? store.instrument(idx) : store.channel(idx);
    const it = chain?.slots.get(id);
    const def = [...(owner?.inserts || []), ...(owner?.fx || [])].find(
      (d) => d?.id === id,
    );
    if (!it || !def) return this.syncChain(idx, inst);
    it.def = def;
    this._applyParams(it, def);
    this._setBypass(it, def.enabled !== false);
  }

  // Live plugin instance for a slot (nodes, meters) — used by plugin faces.
  slotInstance(idx, inst, id) {
    return this.chains?.get((inst ? "i" : "c") + idx)?.slots.get(id) || null;
  }
  // Input/output analysers on a slot, created on first ask (side branches, never in the path).
  slotTaps(idx, inst, id) {
    const it = this.slotInstance(idx, inst, id);
    if (!it) return null;
    if (!it.taps) {
      const mk = () => {
        const a = this.ctx.createAnalyser();
        a.fftSize = 4096;
        a.smoothingTimeConstant = 0.7;
        a.minDecibels = -100;
        a.maxDecibels = -10;
        return a;
      };
      it.taps = { inAn: mk(), outAn: mk() };
      it.inp.connect(it.taps.inAn);
      it.out.connect(it.taps.outAn);
    }
    return it.taps;
  }
  releaseSlotTaps(idx, inst, id) {
    const it = this.slotInstance(idx, inst, id);
    if (!it?.taps) return;
    for (const a of [it.taps.inAn, it.taps.outAn])
      try {
        a.disconnect();
      } catch {
        /* noop */
      }
    try {
      it.inp.disconnect(it.taps.inAn);
      it.out.disconnect(it.taps.outAn);
    } catch {
      /* noop */
    }
    it.taps = null;
  }

  // Older call sites: both now mean "sync this owner's whole chain".
  rebuildInserts(ch, inst = false) {
    this.syncChain(ch, inst);
  }
  applyFx(ch, inst = false) {
    this.syncChain(ch, inst);
  }

  // Service loop for control-rate plugins (noise gate level detection).
  _ensureGateLoop() {
    const live = () => {
      const out = [];
      for (const chain of this.chains?.values() || [])
        for (const it of chain.slots.values()) if (it.type.service) out.push(it);
      return out;
    };
    const hasGate = live().length > 0;
    if (hasGate && !this._gateTimer) {
      this._gateTimer = setInterval(() => {
        for (const it of live())
          if (it.on) it.type.service(this.ctx, it.nodes);
      }, 30);
    } else if (!hasGate && this._gateTimer) {
      clearInterval(this._gateTimer);
      this._gateTimer = null;
    }
  }

  _delayTime() {
    const div = BEAT_DIVS.find(([v]) => v === returnsOf(store.project).delay.time) || BEAT_DIVS[2];
    return Math.min(9.9, (60 / (store.project.bpm || 120)) * div[1]); // default: dotted 8th
  }

  syncDelayToBpm() {
    if (this.delayNode) this.applyReturns();
  }

  // Pushes project.returns onto the shared delay and reverb. Cheap to call often (slider
  // drags, undo, load, tempo change); the reverb impulse is only rebuilt when it must be.
  applyReturns(first = false) {
    if (!this.ctx || !this.delayFx) return;
    const R = returnsOf(store.project);
    const now = this.ctx.currentTime;
    const t = first ? 0 : 0.05;
    const set = (param, v) => (first ? (param.value = v) : param.setTargetAtTime(v, now, t || 0.01));
    const d = R.delay;
    const dfx = this.delayFx;
    const time = this._delayTime();
    set(this.delayNode.delayTime, time);
    set(this.delayR.delayTime, time);
    set(dfx.toneL.frequency, d.tone);
    set(dfx.toneR.frequency, d.tone);
    const fb = d.feedback;
    set(dfx.selfL.gain, fb * (1 - d.spread));
    set(dfx.selfR.gain, fb * (1 - d.spread));
    set(dfx.crossLR.gain, fb * d.spread);
    set(dfx.crossRL.gain, fb * d.spread);
    set(dfx.centerL.gain, 1 - d.spread);
    set(dfx.centerR.gain, 1 - d.spread);
    set(dfx.hardL.gain, d.spread);
    set(dfx.hardR.gain, d.spread);
    set(dfx.ret.gain, d.ret);
    const r = R.reverb;
    const rfx = this.reverbFx;
    set(rfx.pre.delayTime, r.predelay / 1000);
    set(rfx.ret.gain, r.ret);
    this._scheduleImpulse(first);
  }

  // The impulse depends on decay/shape/damp/width only; rebuilt (debounced) when they change.
  _scheduleImpulse(now = false) {
    const r = returnsOf(store.project).reverb;
    const sig = [r.decay, r.shape, r.damp, r.width].join("|");
    const rfx = this.reverbFx;
    if (sig === rfx.sig) return;
    clearTimeout(rfx.timer);
    const go = () => {
      rfx.sig = sig;
      const next = rfx.active ^ 1;
      const buf = this._makeReverbImpulse(r);
      const a = rfx.convs[rfx.active];
      const b = rfx.convs[next];
      b.conv.buffer = buf;
      const t = this.ctx.currentTime;
      if (now) {
        a.gain.gain.value = 0;
        b.gain.gain.value = 1;
      } else {
        b.gain.gain.setTargetAtTime(1, t, 0.03);
        a.gain.gain.setTargetAtTime(0, t, 0.03);
      }
      rfx.active = next;
    };
    if (now) go();
    else rfx.timer = setTimeout(go, 140);
  }

  // Fixed noise bed (so dragging a knob changes the tail's shape, not its random grain),
  // shaped by decay and slope, optionally darkened and narrowed. With the defaults this is the
  // original impulse: raw noise under a (1 - t)^3 fade over 2.2 s.
  _makeReverbImpulse({ decay, shape, damp, width }) {
    const sr = this.ctx.sampleRate;
    const max = Math.ceil(sr * 8);
    if (!this._noise || this._noise[0].length !== max) {
      this._noise = [0, 1].map(() => Float32Array.from({ length: max }, () => Math.random() * 2 - 1));
    }
    const len = Math.ceil(sr * decay);
    const buf = this.ctx.createBuffer(2, len, sr);
    const L = this._noise[0];
    const Rn = this._noise[1];
    const dark = damp < 19999;
    for (let c = 0; c < 2; c++) {
      const out = buf.getChannelData(c);
      const own = c ? Rn : L;
      let y = 0;
      for (let i = 0; i < len; i++) {
        const x = own[i] * (c ? width : 1) + (c ? L[i] * (1 - width) : 0);
        let v = x;
        if (dark) {
          // one-pole low-pass whose cutoff falls as the tail ages (air absorbs highs first)
          const fc = damp * (1 - 0.75 * (i / len));
          y += (1 - Math.exp((-2 * Math.PI * fc) / sr)) * (x - y);
          v = y;
        }
        out[i] = v * Math.pow(1 - i / len, shape);
      }
    }
    return buf;
  }

  // Analyser on a return's output for faces (created on first ask, a side branch).
  busTap(ns) {
    if (!this.ctx || !this.delayFx) return null;
    this._busTaps = this._busTaps || {};
    if (!this._busTaps[ns]) {
      const a = this.ctx.createAnalyser();
      a.fftSize = 2048;
      a.smoothingTimeConstant = 0.6;
      (ns === "delay" ? this.delayFx.ret : this.reverbFx.ret).connect(a);
      this._busTaps[ns] = a;
    }
    return this._busTaps[ns];
  }

  setBuffer(ch, buffer) {
    this.buffers[ch] = buffer;
    this.reverseBuffers[ch] = null;
  }

  silenceChannel(ch) {
    for (const voice of this._voices?.get(ch) || []) {
      try {
        voice.src.stop();
      } catch {}
      voice.gain.disconnect();
    }
    this._voices?.delete(ch);
    if (this._lastVoice) this._lastVoice[ch] = null;
  }

  getReverseBuffer(ch) {
    if (!this.reverseBuffers[ch] && this.buffers[ch]) {
      const src = this.buffers[ch];
      const rev = this.ctx.createBuffer(
        src.numberOfChannels,
        src.length,
        src.sampleRate,
      );
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
    if (this.channelGains[ch])
      this.channelGains[ch].gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
  }

  // Solo is global: if ANY sample channel or synth is soloed, only soloed ones
  // (of either kind) are audible. Mute always wins.
  anySolo() {
    return (
      store.project.channels.some((c) => c.solo) ||
      store.project.instruments.some((s) => s.solo)
    );
  }
  channelAudible(ch) {
    const c = store.channel(ch);
    return !c.mute && (!this.anySolo() || !!c.solo);
  }
  instrumentAudible(i) {
    const s = store.instrument(i);
    return !s.mute && (!this.anySolo() || !!s.solo);
  }

  // Re-apply mute/solo to everything already sounding (call after a solo/mute change).
  applySolo({ cut = false } = {}) {
    if (!this.ctx) return;
    for (let i = 0; i < NUM_INSTRUMENTS; i++)
      this.setInstrumentVolume(i, store.instrument(i).volume);
    if (cut)
      for (let ch = 0; ch < store.numChannels; ch++)
        if (!this.channelAudible(ch)) this.silenceChannel(ch);
  }

  setInstrumentVolume(i, v) {
    if (this.instrumentGains?.[i])
      this.instrumentGains[i].gain.setTargetAtTime(
        this.instrumentAudible(i) ? v : 0,
        this.ctx.currentTime,
        0.01,
      );
  }

  // Play a synth note. time=0 → now (preview). durSteps converted by caller to seconds.
  triggerNote(i, pitch, vel = 1, time = 0, durSec = 0.3) {
    this.ensureContext();
    const inst = store.instrument(i);
    const synth = SYNTH_BANK[inst.synthId];
    if (!synth) return;
    const params = { ...synthDefaults(inst.synthId), ...(inst.params || {}) };
    const when = time || this.ctx.currentTime;
    try {
      synth.voice(
        this.ctx,
        this.instrumentGains[i],
        { pitch, vel, time: when, dur: durSec },
        params,
      );
    } catch (e) {
      console.warn("voice error", e);
    }
    // light the key from the note's start until its end (also covers playback)
    const wait = Math.max(0, (when - this.ctx.currentTime) * 1000);
    setTimeout(() => emitNoteVisual(i, pitch, true), wait);
    setTimeout(
      () => emitNoteVisual(i, pitch, false),
      wait + Math.max(90, durSec * 1000),
    );
  }

  // ---- live (held) notes: on-screen keys, computer keys and MIDI all come through here.
  // Voices are one-shot, so a held note is played with a long gate (the synth's `live.hold`,
  // default 8 s) into a per-note gate gain. Key-up fades that gate over the patch's release
  // and stops every source the voice created, so the voice's own onended cleanup runs.
  // Synths may declare `live: { oneShot, gate, hold, release(P) }`: oneShot voices (drums,
  // mallets, plucks) ignore key-up and ring out over `gate` seconds.
  _liveProxy() {
    const ctx = this.ctx;
    if (this._lp?.ctx === ctx) return this._lp;
    const rec = { ctx, list: null, fns: new Map() };
    const SRC = new Set(["createOscillator", "createBufferSource", "createConstantSource"]);
    rec.proxy = new Proxy(ctx, {
      get(t, prop) {
        const v = Reflect.get(t, prop, t);
        if (typeof v !== "function") return v;
        let f = rec.fns.get(prop);
        if (!f) {
          f = SRC.has(prop)
            ? (...a) => {
                const n = v.apply(t, a);
                if (rec.list) {
                  const s = { node: n, stopAt: null };
                  const stop = n.stop.bind(n);
                  n.stop = (w = 0, ...x) => {
                    s.stopAt = w;
                    return stop(w, ...x);
                  };
                  rec.list.push(s);
                }
                return n;
              }
            : v.bind(t);
          rec.fns.set(prop, f);
        }
        return f;
      },
    });
    this._lp = rec;
    return rec;
  }

  startNote(i, pitch, vel = 1) {
    this.ensureContext();
    const inst = store.instrument(i);
    const synth = SYNTH_BANK[inst?.synthId];
    if (!synth || !this.instrumentGains?.[i]) return 0;
    const P = { ...synthDefaults(inst.synthId), ...(inst.params || {}) };
    const lv = synth.live || {};
    const oneShot = !!lv.oneShot;
    const hold = oneShot ? lv.gate ?? 0.6 : lv.hold ?? 8;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const gate = ctx.createGain();
    gate.connect(this.instrumentGains[i]);
    const lp = this._liveProxy();
    const sources = [];
    lp.list = sources;
    try {
      synth.voice(lp.proxy, gate, { pitch, vel, time: t, dur: hold }, P);
    } catch (e) {
      console.warn("voice error", e);
    } finally {
      lp.list = null;
    }
    let rel = typeof lv.release === "function" ? lv.release(P) : P.release ?? P.rel ?? 0.25;
    rel = Math.min(3, Math.max(0.03, Number.isFinite(+rel) ? +rel : 0.25));
    const id = (this._liveSeq = (this._liveSeq || 0) + 1);
    const n = { id, i, pitch, t, gate, sources, oneShot, rel, timer: 0 };
    (this._live ||= new Map()).set(id, n);
    // the gate node is dropped once every source has ended (or the latest stop time passes)
    const ends = () =>
      Math.max(
        t + hold + rel,
        ...sources.map((s) =>
          s.stopAt != null ? s.stopAt : s.node.buffer && !s.node.loop ? t + s.node.buffer.duration : t + hold + rel,
        ),
      );
    n.dropAt = ends;
    n.timer = setTimeout(() => gate.disconnect(), Math.min(60, ends() - t + 0.5) * 1000);
    emitNoteVisual(i, pitch, true);
    return id;
  }

  releaseNote(id) {
    const n = this._live?.get(id);
    if (!n) return;
    this._live.delete(id);
    emitNoteVisual(n.i, n.pitch, false);
    if (n.oneShot || !this.ctx) return; // rings out; the gate is dropped by its timer
    const now = this.ctx.currentTime;
    const at = Math.max(now, n.t + 0.06); // a tap still sounds like a short note
    const end = at + n.rel;
    const g = n.gate.gain;
    g.cancelScheduledValues(at);
    g.setValueAtTime(1, at);
    g.exponentialRampToValueAtTime(0.0001, end);
    for (const s of n.sources) {
      if (s.stopAt != null && s.stopAt <= end + 0.02) continue;
      try {
        s.node.stop(end + 0.02);
      } catch {
        /* already finished */
      }
    }
    clearTimeout(n.timer);
    n.timer = setTimeout(() => n.gate.disconnect(), (end - now + 0.3) * 1000);
  }

  releaseAll(i = null) {
    for (const n of [...(this._live?.values() || [])]) if (i == null || n.i === i) this.releaseNote(n.id);
  }

  liveCount() {
    return this._live?.size || 0;
  }

  setMasterVolume(v) {
    if (this.masterGain)
      this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
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
    for (const ch of this._voices?.keys() || []) this.silenceChannel(ch);
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
    this.nextStepTime +=
      dur + (this.currentStep % 2 === 0 ? dur * swing : -dur * swing);
    this.currentStep++;
    if (this.currentStep >= NUM_STEPS) {
      this.currentStep = 0;
      if (store.project.continuous) {
        // advance to next non-empty sequence, wrapping to 0
        const seqs = store.project.sequences;
        let next = this.playingSequence + 1;
        if (
          next >= seqs.length ||
          (!store.project.playEmptySequences && this._isEmpty(seqs[next]))
        )
          next = 0;
        this.playingSequence = next;
        store.selectSequence(next);
      }
    }
  }

  _isEmpty(seq) {
    return (
      seq.steps.every((row) => row.every((v) => v === 0)) &&
      (seq.notes || []).every((list) => list.length === 0)
    );
  }

  // After undo/redo the sequence list can shrink under a running transport.
  clampPlayingSequence() {
    const last = store.project.sequences.length - 1;
    if (this.playingSequence > last) this.playingSequence = Math.max(0, last);
  }

  _scheduleStep(step, time) {
    const seq = store.project.sequences[this.playingSequence];
    const stepDur = this.stepDuration();
    // A step's offset spans the real gap to the next step (swing included), so a
    // late hit can never overtake the next step's trigger.
    const swing = store.project.swing / 100;
    const gap = stepDur + (step % 2 === 0 ? stepDur * swing : -stepDur * swing);
    for (let ch = 0; ch < store.numChannels; ch++) {
      const raw = seq.steps[ch]?.[step];
      const v = stepVal(raw);
      if (!v) continue;
      const c = store.channel(ch);
      if (!this.channelAudible(ch)) continue;
      this.trigger(
        ch,
        time + stepOff(raw) * gap,
        v === 2 ? 1.25 : 1,
        stepObj(raw),
      );
    }
    // instrument notes starting on this step
    for (let i = 0; i < NUM_INSTRUMENTS; i++) {
      if (!this.instrumentAudible(i)) continue;
      for (const n of seq.notes?.[i] || []) {
        if (n.step === step)
          this.triggerNote(i, n.pitch, n.vel, time, n.dur * stepDur);
      }
    }
    if (this.onStep) {
      const delay = Math.max(0, (time - this.ctx.currentTime) * 1000);
      setTimeout(
        () => this.isPlaying && this.onStep(step, this.playingSequence),
        delay,
      );
    }
  }

  // Trigger a channel's sample at `time`. `over` = per-step overrides
  // ({rev, trimStart, trimEnd, pitch}) that take precedence over channel settings.
  trigger(ch, time = 0, velocity = 1, over = null) {
    this.ensureContext();
    const c = store.channel(ch);
    const rev = over?.rev ?? c.reverse;
    const rawPitch = over?.pitch ?? c.pitch;
    const pitch = Number.isFinite(rawPitch)
      ? Math.max(0.1, Math.min(store.project.songOrigin ? 100 : 4, rawPitch))
      : 1;
    const rawStart = over?.trimStart ?? c.trimStart,
      rawEnd = over?.trimEnd ?? c.trimEnd;
    const trimStart = Number.isFinite(rawStart)
      ? Math.max(
          0,
          Math.min(1 - (c.clipSnapshot ? Number.EPSILON : 1e-7), rawStart),
        )
      : 0;
    const trimEnd = Number.isFinite(rawEnd)
      ? Math.max(
          trimStart + (c.clipSnapshot ? Number.EPSILON : 1e-7),
          Math.min(1, rawEnd),
        )
      : 1;
    const buffer = rev ? this.getReverseBuffer(ch) : this.buffers[ch];
    if (!buffer) return;
    const t = time || this.ctx.currentTime;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = pitch;

    let start = trimStart * buffer.duration;
    const dur = c.clipSnapshot
      ? (trimEnd - trimStart) * buffer.duration
      : Math.max(0.001, (trimEnd - trimStart) * buffer.duration);
    if (rev) start = (1 - trimEnd) * buffer.duration;

    const vg = this.ctx.createGain();
    vg.gain.value = velocity;
    src.connect(vg).connect(this.channelGains[ch]);

    // Cut/crossfade the previous voice on this channel:
    // - per-step xfade (ms) always crossfades, regardless of global choke
    // - otherwise global choke mode cuts with the project fade time
    const xfadeMs = over?.xfade;
    const cutFadeSec =
      xfadeMs != null && xfadeMs > 0
        ? xfadeMs / 1000
        : store.project.choke
          ? Math.max(0.002, (store.project.fadeMs ?? 15) / 1000)
          : null;
    const sustain = sustainDuration(c, over, buffer, store.project.bpm);
    if (sustain) {
      src.loop = true;
      src.loopStart = sampleLoop(c).start;
      src.loopEnd = sampleLoop(c).end;
    }
    const audibleDuration = sustain ?? dur / pitch,
      edgeFade = Math.min(0.005, audibleDuration / 3);
    let fadeIn = edgeFade;
    if (cutFadeSec != null && this._lastVoice?.[ch]) {
      const prev = this._lastVoice[ch];
      try {
        if (prev.gain.gain.cancelAndHoldAtTime)
          prev.gain.gain.cancelAndHoldAtTime(t);
        else {
          prev.gain.gain.cancelScheduledValues(t);
          prev.gain.gain.setValueAtTime(prev.gain.gain.value, t);
        }
        prev.gain.gain.linearRampToValueAtTime(0, t + cutFadeSec);
        prev.src.stop(t + cutFadeSec + 0.01);
      } catch {
        /* already ended */
      }
      // fade the new voice IN over the same span for a smooth crossfade
      if (xfadeMs != null && xfadeMs > 0) {
        fadeIn = Math.min(cutFadeSec, audibleDuration / 3);
      }
    }
    (this._lastVoice ||= {})[ch] = { src, gain: vg };
    vg.gain.setValueAtTime(0, t);
    vg.gain.linearRampToValueAtTime(velocity, t + fadeIn);
    vg.gain.setValueAtTime(velocity, t + audibleDuration - edgeFade);
    vg.gain.linearRampToValueAtTime(0, t + audibleDuration);

    const voices = (this._voices ||= new Map()).get(ch) || new Set();
    this._voices.set(ch, voices);
    const voice = { src, gain: vg };
    voices.add(voice);
    src.onended = () => {
      voices.delete(voice);
      src.disconnect();
      vg.disconnect();
    };
    // Web Audio duration is measured in source seconds, before playback rate.
    if (sustain) {
      src.start(t, start);
      src.stop(t + audibleDuration);
    } else src.start(t, start, dur);
  }

  // Play a raw AudioBuffer through the master bus (library audition). Returns a stop fn.
  playBuffer(
    buffer,
    start = 0,
    end = buffer.duration,
    onEnded = null,
    options = {},
  ) {
    this.stopPreview();
    this.ensureContext();
    if (this._previewSrc) {
      try {
        this._previewSrc.stop();
      } catch {
        /* already stopped */
      }
    }
    const src = this.ctx.createBufferSource();
    const rate = options.rate ?? 1;
    if (options.reverse) {
      const reversed = this.ctx.createBuffer(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate,
      );
      for (let c = 0; c < buffer.numberOfChannels; c++)
        reversed.copyToChannel(buffer.getChannelData(c).slice().reverse(), c);
      src.buffer = reversed;
    } else src.buffer = buffer;
    src.playbackRate.value = rate;
    if (options.loop) {
      src.loop = true;
      src.loopStart = options.loop.start;
      src.loopEnd = options.loop.end;
    }
    const gain = this.ctx.createGain();
    src.connect(gain).connect(this.masterGain);
    const t = this.ctx.currentTime,
      duration = options.gateSeconds ?? (end - start) / rate,
      level = options.level ?? 0.9,
      fade = Math.min(0.005, duration / 3);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(level, t + fade);
    gain.gain.setValueAtTime(level, t + duration - fade);
    gain.gain.linearRampToValueAtTime(0, t + duration);
    if (options.loop) {
      src.start(t, start);
      src.stop(t + duration);
    } else
      src.start(
        t,
        options.reverse ? buffer.duration - end : start,
        end - start,
      );
    src.onended = () => {
      src.disconnect();
      gain.disconnect();
      if (this._previewSrc === src) this._previewSrc = null;
      onEnded?.();
    };
    this._previewSrc = src;
    return () => {
      try {
        src.stop();
      } catch {
        /* noop */
      }
    };
  }

  stopPreview() {
    if (!this._catalogueStarting) this.stopCataloguePreview?.();
    if (!this._playlistStarting) this.stopPlaylistPreview?.();
    this.stopSongPreview?.();
    if (this._previewSrc) {
      try {
        this._previewSrc.stop();
      } catch {
        /* noop */
      }
      this._previewSrc = null;
    }
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

// Keyboard visuals: the piano roll and the jiMS10 panel light keys from these
// events, so sequencer playback, typed keys, MIDI and mouse all show the same way.
export function emitNoteVisual(i, pitch, on) {
  if (typeof document === "undefined") return;
  document.dispatchEvent(
    new CustomEvent("synth-note", { detail: { i, pitch, on } }),
  );
}

export const engine = new Engine();
