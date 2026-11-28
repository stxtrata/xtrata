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
import { createVoice } from "./synths/voice-lifecycle.js";
import { PLUGIN_TYPES, pluginDefaults, normalizeOwner, returnsOf, BEAT_DIVS, calibratePluginLatency } from "./plugins.js";
import { compilePlaybackPlan } from './playback-plan.js';
import { legacyPlaybackProfile, legacySamplePlayback } from './legacy-bridge/playback.js';
import { beatToSeconds, secondsToBeat, swingStep, unswingStep, seededRandom, hashSeed, meterAt } from './timeline.js';
import { trackAddress } from './project-model.js';
import { syncMixer as applyMixer, disposeMixer, validateRouting } from './mixer-runtime.js';
import { createSamplerVoice } from './sampler-voice.js';
import { voiceBudget, voiceCost, pickVictim } from './voice-budget.js';
import { normalizeVoicing } from './voicing.js';
import { normalizeMod, modActive } from './modulation.js';
import { oscEngineEnabled, prepareOscEngine } from './synths/unison-worklet.js';
import {isProInstrument,createProInstrumentVoice} from './pro-instruments.js';
import { scheduleDspBoundary } from './plugin-automation.js';
import { automationValueAt, voiceAutomation } from './automation-runtime.js';
import { assertOfflineRenderSupported } from './audio-render-support.js';

const LOOKAHEAD_MS = 25; // scheduler tick
const SCHEDULE_AHEAD = 0.12; // seconds scheduled in advance
// Exact pattern edges can appear a few floating-point ulps before the beat
// after converting through seconds. Do not create a phantom previous note.
const snapPatternBoundary = beat => {
  const boundary = Math.round(beat / 16) * 16;
  return Math.abs(beat - boundary) < 1e-9 ? boundary : beat;
};

// Strip sends are addressed like slots, as "send:delay" / "send:reverb".
const sendBusId = (id) => (typeof id === "string" && id.startsWith("send:") ? id.slice(5) : null);

export class Engine {
  constructor({ store: projectStore = store, contextFactory = null, offline = false, seed = projectStore.project.renderSeed || projectStore.project.projectId } = {}) {
    if(offline)assertOfflineRenderSupported();
    this.store = projectStore;
    this.contextFactory = contextFactory;
    this.offline = offline;
    this.seed = seed; this.random = seededRandom(seed);
    this.currentBeat = 0; this._pausedBeat = null; this._planDirty = true; this._transportRuns = [];
    this._transportPreparing = false; this._noteRecordStart = null;
    this.schedulerStats = { lateTicks: 0, skippedEvents: 0, maxLatenessMs: 0 };
    if (!offline) this.store.on('dirty', ({ event, payload } = {}) => {
      this._planDirty = true;
      if (this.ctx && (['channel','instrument','channels','instruments','load'].includes(event)||event==='project'&&['buses','master','mixerVersion','masterVolume'].includes(payload?.prop))) {
        this.ensureChannelChains(); this.ensureInstrumentChains(); this.syncMixer();
        if(event==='instrument' && payload?.prop==='params')for(const n of this._synthVoices.values())if(n.i===payload.i)n.voice.setParameters?.(this.store.instrument(n.i).params||{},this.ctx.currentTime);
      }
    });
    this._synthVoices = new Map();
    this._live = new Map();
    this._voiceSeq = 0;
    this._visualCounts = new Map();
    this._transportTimers = new Set();
    this._transportGeneration = 0;
    this._timeline = [];
    this._elapsedSteps = 0;
    this.maxSynthVoices = 64;
    this.maxInstrumentVoices = 16;
    // Live playback only: a smaller, load-aware budget on touch devices (voice-budget.js).
    this.voiceBudget = voiceBudget();
    this.voiceStats = { stolen: 0, peakSources: 0, sources: 0 };
    this._voiceCost = new Map();
    this._mono = new Map(); // instrument index -> mono/legato state (voicing.js)
    this._monoIds = new Map(); // held note id -> instrument index
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
    if(this.offline||typeof this.ctx?.startRendering==='function')assertOfflineRenderSupported();
    if (!this.ctx) {
      const context = this.contextFactory ? this.contextFactory() : new (window.AudioContext || window.webkitAudioContext)({latencyHint:'interactive'});
      if(typeof context.startRendering==='function')assertOfflineRenderSupported();
      this.ctx=context;
      if (oscEngineEnabled()) void prepareOscEngine(context); // experiment: synths fall back to native oscillators until it loads
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.store.project.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this._createReturns();
      if (!this._returnsHooked) {
        this._returnsHooked = true;
        if (!this.offline) this.store.on("load", ({ restore } = {}) => {
          if (!restore) this.resetProjectAudio();
          else { this.ensureChannelChains(); this.ensureInstrumentChains(); this.applyReturns(); }
        });
      }

      // --- per-channel chains: fader gain → inserts → FX → master ---
      // Both chains are lists of plugins from plugins.js. Delay/reverb are "send"
      // plugins inside the FX chain that tap into the shared buses above.
      this.chains = new Map(); // "c3" | "i0" → { input, out, slots: Map(id → instance), sig }
      this.ensureChannelChains();

      this.instrumentGains = [];
      this.ensureInstrumentChains();
      this.syncMixer();
    }
    if (!this.offline && this.ctx.state === "suspended") this.ctx.resume();
    this.ensureChannelChains();
    this.ensureInstrumentChains();
    return this.ctx;
  }

  _createReturns() {
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
    const pan = (dfx.pan = this.ctx.createChannelMerger(2));
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
  }

  // Reconcile both growth and shrinkage: removed strips must release plugin graphs,
  // analyser taps, sample buffers and voices before their indexes can be reused.
  ensureChannelChains() {
    if (!this.ctx || !this.chains) return;
    while (this.channelGains.length > this.store.numChannels) {
      const i = this.channelGains.length - 1;
      this.silenceChannel(i);
      this._disposeChain(`c${i}`);
      this.channelGains.pop();
    }
    this.buffers.length = this.reverseBuffers.length = this.store.numChannels;
    for (let i = this.channelGains.length; i < this.store.numChannels; i++) {
      const g = this.ctx.createGain();
      g.gain.value = this.store.channel(i).volume;
      this.channelGains.push(g);
      this._makeChain(`c${i}`, g);
      this.syncChain(i);
    }
  }

  ensureInstrumentChains() {
    if (!this.ctx || !this.chains) return;
    const count = this.store.project.instruments.length;
    while (this.instrumentGains.length > count) {
      const i = this.instrumentGains.length - 1;
      this.releaseAll(i, { immediate: true });
      this._disposeChain(`i${i}`);
      this.instrumentGains.pop();
    }
    for (let i = this.instrumentGains.length; i < count; i++) {
      const g = this.ctx.createGain();
      g.gain.value = this.instrumentAudible(i) ? this.store.instrument(i).volume : 0;
      this.instrumentGains.push(g);
      this._makeChain(`i${i}`, g);
      this.syncChain(i, true);
    }
  }

  _disposeChain(key) {
    const chain = this.chains?.get(key);
    if (!chain) return;
    for (const it of chain.slots.values()) {
      for (const n of Object.values(it.taps || {})) { try { n.disconnect(); } catch {} }
      this._disposeInstance(it);
    }
    for (const send of Object.values(chain.sendFx || {})) {
      for (const n of Object.values(send.inst.taps || {})) { try { n.disconnect(); } catch {} }
      send.amt.disconnect(); send.en.disconnect();
    }
    chain.input.disconnect(); chain.preDelay?.disconnect();chain.out.disconnect();
    this.chains.delete(key);
    this._ensureGateLoop();
  }

  _flushEffects() {
    if (!this.ctx) return;
    disposeMixer(this);
    for (const key of [...this.chains.keys()]) this._disposeChain(key);
    clearTimeout(this.reverbFx?.timer);
    if (this.reverbFx) {
      this.reverbFx.disposed = true;
      for (const timer of this.reverbFx.automationTimers || []) clearTimeout(timer);
    }
    const seen = new Set();
    const disconnect = value => {
      if (!value || typeof value !== "object" || seen.has(value)) return;
      seen.add(value);
      if (typeof value.disconnect === "function") { try { value.disconnect(); } catch {} }
      else for (const item of Object.values(value)) disconnect(item);
    };
    for (const node of [this.delayNode, this.delayR, this.reverbNode, this.delayFx, this.reverbFx, this._busTaps]) disconnect(node);
    this._busTaps = {};
    this.channelGains = []; this.instrumentGains = [];
    this._createReturns();
    this.ensureChannelChains(); this.ensureInstrumentChains();
    this.syncMixer();
  }

  resetProjectAudio() {
    if (!this.ctx) return;
    this.pause();
    this._flushEffects();
    this.buffers = new Array(this.store.numChannels).fill(null);
    this.reverseBuffers = new Array(this.store.numChannels).fill(null);
    this.setMasterVolume(this.store.project.masterVolume);
  }

  _makeChain(key, input) {
    const out = this.ctx.createGain();
    const preDelay=this.ctx.createDelay(10);
    out.connect(this.masterGain);
    input.connect(preDelay).connect(out); // stable input preserves analyser taps while inserts change
    // The strip's delay and reverb sends tap the chain output (after the last plugin):
    //   out → amount → on/off → shared bus      (levels come from owner.sends, see syncChain)
    // "inst" is a stand-in for the plugin instance a slot would have, so faces can meter it.
    const sendFx = {};
    // Shared returns enter the master. Even a zero-gain send back into those
    // returns forms a graph cycle; Firefox then adds a 128-frame cycle delay.
    // The master therefore has no strip sends to its own return inputs.
    for (const [bus, node] of key === 'master' ? [] : [
      ["delay", this.delayNode],
      ["reverb", this.reverbNode],
    ]) {
      const amt = this.ctx.createGain();
      const en = this.ctx.createGain();
      amt.gain.value = 0;
      en.gain.value = 1;
      out.connect(amt).connect(en).connect(node);
      sendFx[bus] = { amt, en, on: true, inst: { inp: out, out, nodes: null, taps: null } };
    }
    this.chains.set(key, { input, preDelay, out, slots: new Map(), sig: "", sendFx });
  }

  // Bring a strip's two send values in line with owner.sends. Amount moves at once (as the
  // old send plugin's did); on/off crossfades so a bypass never clicks. A strip that was just
  // (re)loaded, meaning a different owner object than last time, jumps straight to its state,
  // so opening a song never fades its sends in.
  _applySends(chain, owner) {
    const fresh = chain.owner !== owner;
    chain.owner = owner;
    for (const bus of ["delay", "reverb"]) {
      const f = chain.sendFx[bus];
      if (!f) continue;
      const rec = owner.sends?.[bus];
      const on = !!rec && rec.enabled !== false;
      const amount = rec ? rec.amount : 0;
      if (f.amount !== amount) {
        f.amt.gain.value = amount;
        f.amount = amount;
      }
      if (f.on !== on) {
        f.on = on;
        if (f.init && !fresh) f.en.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.008);
        else f.en.gain.value = on ? 1 : 0;
      }
      if (!f.init) {
        f.en.gain.value = on ? 1 : 0;
        f.init = true;
      }
    }
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
      irSource: def.irSource,
      resolveImpulseResponse: source => {const a=trackAddress(this.store.project,source?.sourceTrackId);return a?.kind==='sample'?this.buffers[a.index]:null;},
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
    // Tempo-synced plugins (ELEMENTS · MERCURY) read the project tempo at apply time.
    if (it.type.tempoSync) P.bpm = this.store.project.bpm || 120;
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
    const key = typeof idx === 'string' ? idx : (inst ? 'i' : 'c') + idx;
    const chain = this.chains?.get(key);
    const owner = key === 'master' ? this.store.project.master : /^i\d+$/.test(key) ? this.store.instrument(+key.slice(1)) : /^c\d+$/.test(key) ? this.store.channel(+key.slice(1)) : this.store.project.buses?.find(b=>b.id===key);
    if (!chain || !owner) return;
    normalizeOwner(owner, this.store.project.timeline.automation, key === 'master' ? 'master' : owner.id);
    const defs = [...owner.inserts, ...owner.fx].filter(
      (d) => PLUGIN_TYPES[d.type],
    );
    const resourceKey = d => {const a=d.irSource&&trackAddress(this.store.project,d.irSource.sourceTrackId);return JSON.stringify(d.irSource ? [d.irSource,a?.index??-1,!!this.buffers[a?.index],this._bufferRevisions?.get(d.irSource.sourceTrackId)||0] : null);};
    const sig = defs.map((d) => `${d.id}:${d.type}:${resourceKey(d)}`).join("|");
    if (sig !== chain.sig) {
      const next = new Map();
      for (const d of defs) {
        let it = chain.slots.get(d.id);
        if (it && it.typeId !== d.type) it=null;
        if(it && it.resourceKey!==resourceKey(d)){
          if(it.nodes.updateImpulseResponse){
            it.nodes.updateImpulseResponse(d.irSource,source=>{const a=trackAddress(this.store.project,source?.sourceTrackId);return a?.kind==='sample'?this.buffers[a.index]:null;}).catch(error=>{
              if(!this.offline&&typeof document!=='undefined')document.dispatchEvent(new CustomEvent('audio-error',{detail:{message:error.message}}));
            });
          }else it=null;
        }
        it ||= this._makeInstance(d);it.resourceKey=resourceKey(d);
        next.set(d.id, it);
      }
      for (const [id, it] of chain.slots)
        if (next.get(id) !== it) this._disposeInstance(it);
      try {
        chain.preDelay.disconnect();
      } catch {
        /* noop */
      }
      for (const it of next.values())
        try {
          it.out.disconnect();
        } catch {
          /* noop */
        }
      let node = chain.preDelay;
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
    this._applySends(chain, owner);
  }

  // Live param/bypass update for one slot (called while a slider moves).
  updateSlot(idx, inst, id) {
    const chain = this.chains?.get((inst ? "i" : "c") + idx);
    const owner = inst ? this.store.instrument(idx) : this.store.channel(idx);
    if (chain && owner && sendBusId(id)) return this._applySends(chain, owner);
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
    const chain = this.chains?.get((inst ? "i" : "c") + idx);
    const bus = sendBusId(id);
    if (bus) return chain?.sendFx[bus]?.inst || null; // a strip send ("send:delay")
    return chain?.slots.get(id) || null;
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
    if (this.offline) return;
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
    const div = BEAT_DIVS.find(([v]) => v === returnsOf(this.store.project).delay.time) || BEAT_DIVS[2];
    return Math.min(9.9, (60 / (this.store.project.bpm || 120)) * div[1]); // default: dotted 8th
  }

  syncDelayToBpm() {
    if (this.delayNode) this.applyReturns();
    for (const chain of this.chains?.values() || []) for (const it of chain.slots?.values() || []) if (it.type?.tempoSync && it.def) this._applyParams(it, it.def);
  }

  // Pushes project.returns onto the shared delay and reverb. Cheap to call often (slider
  // drags, undo, load, tempo change); the reverb impulse is only rebuilt when it must be.
  applyReturns(first = false) {
    if (!this.ctx || !this.delayFx) return;
    const R = returnsOf(this.store.project);
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
  _scheduleImpulse(now = false, r = returnsOf(this.store.project).reverb) {
    now = now || this.offline;
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
      this._noise = [0, 1].map(() => Float32Array.from({ length: max }, () => this.random() * 2 - 1));
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
    const id=this.store.channel(ch)?.id;if(id){this._bufferRevisions ||= new Map();this._bufferRevisions.set(id,(this._bufferRevisions.get(id)||0)+1);}
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
    const owner=this.store.channel(ch),strip=this._mixer?.strips.get(owner?.id),post=this.store.project.mixerVersion>=2;
    const param=post&&strip?strip.fader.gain:this.channelGains[ch]?.gain;
    if(param){const value=this.channelAudible(ch)?v*(post?1:Math.pow(10,(owner.inputTrimDb||0)/20)):0;this.offline?param.value=value:param.setTargetAtTime(value,this.ctx.currentTime,.008);}
  }

  // Solo is global: if ANY sample channel or synth is soloed, only soloed ones
  // (of either kind) are audible. Mute always wins.
  anySolo() {
    return (
      this.store.project.channels.some((c) => c.solo) ||
      this.store.project.instruments.some((s) => s.solo)
    );
  }
  channelAudible(ch) {
    const c = this.store.channel(ch);
    return !c.mute && (!this.anySolo() || !!c.solo);
  }
  instrumentAudible(i) {
    const s = this.store.instrument(i);
    return !s.mute && (!this.anySolo() || !!s.solo);
  }

  // Re-apply mute/solo to everything already sounding (call after a solo/mute change).
  applySolo({ cut = false } = {}) {
    if (!this.ctx) return;
    for (let i = 0; i < this.store.project.instruments.length; i++)
      this.setInstrumentVolume(i, this.store.instrument(i).volume);
    for(let ch=0;ch<this.store.numChannels;ch++)this.setChannelVolume(ch,this.store.channel(ch).volume);
    if (cut)
      for (let ch = 0; ch < this.store.numChannels; ch++)
        if (!this.channelAudible(ch)) this.silenceChannel(ch);
  }

  setInstrumentVolume(i, v) {
    const owner=this.store.instrument(i),strip=this._mixer?.strips.get(owner?.id),post=this.store.project.mixerVersion>=2;
    const param=post&&strip?strip.fader.gain:this.instrumentGains?.[i]?.gain;
    if(param){const value=this.instrumentAudible(i)?v*(post?1:Math.pow(10,(owner.inputTrimDb||0)/20)):0;this.offline?param.value=value:param.setTargetAtTime(value,this.ctx.currentTime,.008);}
  }

  syncMixer() { try { applyMixer(this); } catch(error) { this.routingError=error.message; console.warn(error.message); } }
  validateRouting() { return validateRouting(this.store.project); }

  // Sequenced and live notes use the same ownership ledger. The synth still receives its
  // original finite gate for transport playback, so existing arrangements keep their sound.
  triggerNote(i, pitch, vel = 1, time = 0, durSec = 0.3) {
    return this._startVoice(i, pitch, vel, { time, duration: durSec, source: "transport", held: false });
  }

  _voiceVisual(n, on) {
    if (this.offline || n.visual === on) return;
    n.visual = on;
    const key = `${n.i}:${n.pitch}`;
    const before = this._visualCounts.get(key) || 0;
    const after = Math.max(0, before + (on ? 1 : -1));
    if (after) this._visualCounts.set(key, after); else this._visualCounts.delete(key);
    if (!!before !== !!after) emitNoteVisual(n.i, n.pitch, after > 0);
  }

  _voiceEnded(n) {
    if (!n || n.ended) return;
    n.ended = true;
    for (const timer of n.timers) clearTimeout(timer);
    this._voiceVisual(n, false);
    this._live.delete(n.id);
    this._synthVoices.delete(n.id);
    const mono = this._mono.get(n.i); if (mono?.current === n) mono.current = null;
    if (!this.offline && typeof document !== "undefined") document.dispatchEvent(new CustomEvent("synth-voice-ended", { detail: { id: n.id, i: n.i, pitch: n.pitch, source: n.source } }));
  }

  // ---- mono and legato (voicing.js). Poly instruments go straight to _spawnVoice.
  _monoState(i) {
    let s = this._mono.get(i);
    if (!s) this._mono.set(i, s = { stack: [], current: null, sounding: null, seq: null });
    return s;
  }
  _monoClear(i = null, { all = false } = {}) {
    for (const [index, s] of this._mono) if (i == null || index === i) {
      for (const entry of s.stack) { this._monoIds.delete(entry.id); if (entry.alias) this._voiceVisual(entry.alias, false); }
      s.stack = [];
      if (all) { s.current = null; s.sounding = null; s.seq = null; }
    }
  }
  _monoCut(n, time) {
    if (!n || n.ended || n.stopping) return;
    n.stopping = true; n.voice.stop(time); this._live.delete(n.id); this._voiceVisual(n, false);
  }
  _startVoice(i, pitch, vel, options) {
    const voicing = normalizeVoicing(this.store.instrument(i)?.voicing);
    if (voicing.mode === "poly") return this._spawnVoice(i, pitch, vel, options);
    this.ensureContext();
    const time = Math.max(this.ctx.currentTime, Number.isFinite(options.time) ? options.time : this.ctx.currentTime);
    const s = this._monoState(i);
    if (Number.isFinite(options.duration)) {
      // Sequenced and arpeggiated notes have a fixed length, so each one restarts
      // the sound. Mono always slides; legato slides only into an overlapping note.
      const prior = s.seq;
      let from = null;
      if (prior && prior.time <= time) {
        const overlap = prior.end > time + 1e-4;
        if (prior.n && !prior.n.ended && !prior.n.stopping) {
          prior.n.voice.stop(time);
          prior.n.endTime = Math.min(prior.n.endTime ?? Infinity, time + .01);
          if (!this.offline) { const off = () => this._voiceVisual(prior.n, false); if (time <= this.ctx.currentTime) off(); else prior.n.timers.push(setTimeout(off, (time - this.ctx.currentTime) * 1000)); }
        }
        if (voicing.glide > 0 && prior.pitch !== pitch && (voicing.mode === "mono" || overlap)) from = prior.pitch - pitch;
      }
      const id = this._spawnVoice(i, pitch, vel, options), n = this._synthVoices.get(id);
      if (n) {
        if (from != null) n.voice.setGlide?.(0, time, voicing.glide, from);
        s.seq = { pitch, time, end: time + options.duration, n };
      }
      return id;
    }
    const current = s.current && !s.current.ended && !s.current.stopping && s.stack.length ? s.current : null;
    if (!current) this._monoClear(i);
    if (current && voicing.mode === "legato" && current.voice.setGlide) {
      const id = ++this._voiceSeq, alias = { id, i, pitch, visual: false, ended: false, timers: [] };
      s.stack.push({ id, pitch, vel, alias }); this._monoIds.set(id, i);
      current.voice.setGlide(pitch - current.pitch, time, voicing.glide);
      s.sounding = pitch;
      this._voiceVisual(alias, true);
      return id;
    }
    const from = voicing.glide > 0 && s.sounding != null && s.sounding !== pitch && (voicing.mode === "mono" || current) ? s.sounding - pitch : null;
    this._monoCut(current, time);
    const id = this._spawnVoice(i, pitch, vel, options), n = this._synthVoices.get(id);
    if (!n) return 0;
    if (from != null) n.voice.setGlide?.(0, time, voicing.glide, from);
    s.current = n; s.sounding = pitch; s.stack.push({ id, pitch, vel }); this._monoIds.set(id, i);
    return id;
  }
  _monoRelease(i, id, atTime) {
    this._monoIds.delete(id);
    const s = this._mono.get(i), k = s ? s.stack.findIndex(entry => entry.id === id) : -1;
    if (k < 0) return this._releaseVoice(id, atTime);
    const [entry] = s.stack.splice(k, 1), wasTop = k === s.stack.length;
    if (entry.alias) this._voiceVisual(entry.alias, false);
    const current = s.current, alive = current && !current.ended && !current.stopping;
    if (!s.stack.length) { if (alive) this._releaseVoice(current.id, atTime); return; }
    if (current && entry.id === current.id) this._voiceVisual(current, false);
    if (!wasTop) return;
    // The newest key came up while older keys are still down: go back to the last of them.
    const top = s.stack[s.stack.length - 1], voicing = normalizeVoicing(this.store.instrument(i)?.voicing), time = Math.max(this.ctx.currentTime, atTime);
    if (alive && voicing.mode === "legato" && current.voice.setGlide) {
      current.voice.setGlide(top.pitch - current.pitch, time, voicing.glide); s.sounding = top.pitch;
      return;
    }
    this._monoCut(current, time);
    const next = this._synthVoices.get(this._spawnVoice(i, top.pitch, top.vel, { held: true, time, source: current?.source }));
    if (!next) return;
    if (voicing.glide > 0 && s.sounding != null && s.sounding !== top.pitch) next.voice.setGlide?.(0, time, voicing.glide, s.sounding - top.pitch);
    s.current = next; s.sounding = top.pitch;
  }

  _spawnVoice(i, pitch, vel, options) {
    this.ensureContext();
    const instrument = this.store.instrument(i);
    const synth = SYNTH_BANK[instrument?.synthId];
    if (!synth || !this.instrumentGains?.[i]) return 0;
    const time = Math.max(this.ctx.currentTime, Number.isFinite(options.time) ? options.time : this.ctx.currentTime);
    const active = () => [...this._synthVoices.values()].filter(n => !n.stopping && n.time <= time && (n.endTime ?? Infinity) > time);
    const cut = victim => {
      victim.stopping = true;
      victim.voice.stop(time);
      this._live.delete(victim.id);
      this._voiceVisual(victim, false);
    };
    if (this.offline) {
      while (active().length >= this.maxSynthVoices || active().filter(n => n.i === i).length >= this.maxInstrumentVoices) {
        const voices = active();
        const victim = voices.find(n => n.i === i && n.voice.released) || voices.find(n => n.i === i) || voices[0];
        if (!victim) break;
        cut(victim);
      }
    } else {
      const budget = this.voiceBudget, notes = Math.min(this.maxSynthVoices, budget.notes), perInstrument = Math.min(this.maxInstrumentVoices, budget.perInstrument);
      const estimate = this._voiceCost.get(i) || 4;
      for (;;) {
        const voices = active(), mine = voices.filter(n => n.i === i).length;
        const used = voices.reduce((sum, n) => sum + (n.cost || 1), 0);
        const global = voices.length >= notes || used + estimate > budget.sources;
        if (!global && mine < perInstrument) break;
        const victim = pickVictim(voices, i, { own: !global });
        if (!victim) break;
        cut(victim);
        this.voiceStats.stolen++;
      }
    }
    const automation=options.automation||[];
    const P = { ...synthDefaults(instrument.synthId), ...(instrument.params || {}) };
    for(const point of automation)if(point.atStart&&point.target.kind==='synthParam')P[point.target.param]=point.value;
    const duration = Number.isFinite(options.duration) ? Math.max(0.001, options.duration) : null;
    const held = !!options.held;
    const live = synth.live || {};
    let release = typeof live.release === "function" ? live.release(P) : P.release ?? P.rel ?? 0.25;
    release = Math.max(0.01, Math.min(12, Number.isFinite(+release) ? +release : 0.25));
    const n = { id: ++this._voiceSeq, i, pitch, time, endTime: duration == null ? Infinity : time+duration+release, source: options.source || "live", release, timers: [], visual: false, ended: false, stopping: false };
    try {
      const note={ pitch, vel, time, dur: duration ?? live.gate ?? 0.6, held: held && duration == null, offset:options.chaseOffsetSeconds || 0, bpm: this.store.project.bpm || 120 };
      // Modulation kit (modulation.js). `beat` lets a bar-locked LFO start in step with the song.
      const mod = instrument.mod && modActive(instrument.mod) ? normalizeMod(instrument.mod) : null;
      if (mod) { const position = Number.isFinite(options.beat) ? null : this.getMusicalPosition(time); note.beat = Number.isFinite(options.beat) ? options.beat : position?.playing ? position.beat : null; }
      n.voice = isProInstrument(instrument.synthId)
        ? createProInstrumentVoice(this.ctx,this.instrumentGains[i],instrument,note,P,()=>this._voiceEnded(n),{seed:options.seed ?? hashSeed(`${this.seed}:${n.id}:${pitch}`),offline:this.offline,mod,bufferForSource:entry=>{const a=trackAddress(this.store.project,entry.sourceTrackId);return a?.kind==='sample'?this.buffers[a.index]:null;}})
        : instrument.sampler?.enabled
        ? createSamplerVoice(this.ctx,this.instrumentGains[i],instrument.sampler,note,id=>{const a=trackAddress(this.store.project,id);return a?.kind==='sample'?this.buffers[a.index]:null;},()=>this._voiceEnded(n))
        : createVoice(this.ctx, this.instrumentGains[i], synth, instrument.synthId,note,P,()=>this._voiceEnded(n),{seed:options.seed ?? hashSeed(`${this.seed}:${n.id}:${pitch}`),prepared:options.prepared,mod});
    } catch (error) {
      if(this.offline)throw error;
      this.lastVoiceError=error.message;
      if(typeof document!=='undefined')document.dispatchEvent(new CustomEvent('audio-error',{detail:{message:error.message}}));
      console.warn("voice error", error);
      return 0;
    }
    if(Number.isFinite(n.voice.endTime))n.endTime=n.voice.endTime;
    n.cost = voiceCost(n.voice);
    this._voiceCost.set(i, n.cost);
    this._synthVoices.set(n.id, n);
    if (!this.offline) {
      let sources = 0;
      for (const v of this._synthVoices.values()) if (!v.stopping) sources += v.cost || 1;
      this.voiceStats.sources = sources;
      if (sources > this.voiceStats.peakSources) this.voiceStats.peakSources = sources;
    }
    if (held) this._live.set(n.id, n);
    if (options.bend) n.voice.setBend(options.bend, time);
    for(const point of automation){if(this._automationOverrides?.has(JSON.stringify(point.target)))continue;const end=time+point.relativeEnd,start=time+point.relativeStart;if(point.target.kind==='bend'){if(point.curve==='linear')n.voice.setBend(point.fromValue,start);n.voice.setBend(point.value,end);}else n.voice.setParameters?.({[point.target.param]:point.value},end,{curve:point.curve,startTime:start,fromValues:{[point.target.param]:point.fromValue}});}
    if (!this.offline) {
      const later = (at, fn) => {
        if (at <= this.ctx.currentTime) fn();
        else n.timers.push(setTimeout(fn, (at - this.ctx.currentTime) * 1000));
      };
      later(time, () => { if (!n.ended && !n.stopping) this._voiceVisual(n, true); });
      if (duration != null) later(time + duration, () => this._voiceVisual(n, false));
    }
    return n.id;
  }

  startNote(i, pitch, vel = 1, options = {}) {
    return this._startVoice(i, pitch, vel, { ...options, held: true });
  }

  releaseNote(id, atTime = this.ctx?.currentTime || 0) {
    const mono = this._monoIds.get(id);
    return mono == null ? this._releaseVoice(id, atTime) : this._monoRelease(mono, id, atTime);
  }

  _releaseVoice(id, atTime = this.ctx?.currentTime || 0) {
    const n = this._synthVoices.get(id);
    if (!n) return;
    this._live.delete(id);
    if (atTime < n.time) {
      n.stopping = true;
      for (const timer of n.timers) clearTimeout(timer);
      n.voice.stop(atTime);
      this._voiceVisual(n, false);
      return;
    }
    n.voice.release(atTime, n.release);
    n.endTime=Number.isFinite(n.voice.endTime)?n.voice.endTime:atTime+n.release;
    const off = () => this._voiceVisual(n, false);
    if (atTime <= this.ctx.currentTime || this.offline) off();
    else n.timers.push(setTimeout(off, (atTime - this.ctx.currentTime) * 1000));
  }

  setNotePitchBend(id, semitones, atTime=this.ctx?.currentTime) { const mono=this._monoIds.get(id); (mono==null?this._synthVoices.get(id):this._mono.get(mono)?.current)?.voice.setBend(semitones,atTime); }

  releaseAll(i = null, { immediate = false } = {}) {
    this._monoClear(i, { all: immediate });
    const voices = immediate ? this._synthVoices : this._live;
    for (const n of [...voices.values()]) if (i == null || n.i === i) {
      if (immediate) {
        n.stopping = true;
        n.voice.stop();
        this._live.delete(n.id);
        for (const timer of n.timers) clearTimeout(timer);
        this._voiceVisual(n, false);
      } else this.releaseNote(n.id);
    }
  }

  liveCount() { return this._live.size; }

  async effectsReady() {
    const pending = [];
    for (const chain of this.chains?.values() || [])
      for (const it of chain.slots.values()) if (it.on && it.nodes.ready) pending.push(it.nodes.ready);
    const results = await Promise.all(pending);
    this.assertEffectsHealthy();
    return results;
  }

  assertEffectsHealthy() {
    for (const chain of this.chains?.values() || [])
      for (const it of chain.slots.values())
        if (it.on && it.nodes.processorError)
          throw new Error(`${PLUGIN_TYPES[it.typeId]?.name || 'Audio effect'} stopped processing: ${it.nodes.processorError}`);
  }

  setMasterVolume(v) {
    if (this.masterGain) {
      if (this.offline) this.masterGain.gain.value = v;
      else this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.01);
    }
  }

  stepDuration() {
    return 60 / this.store.project.bpm / 4; // 16th notes
  }

  _eventAutomation(event) {
    if(this.store.project.automationMode==='write')return [];
    const project=this.store.project,start=secondsToBeat(project,beatToSeconds(project,event.beat)+(event.rangeChaseSeconds||0));
    return voiceAutomation(project,event.trackId,start,event.endBeat).map(p=>({...p,atStart:p.beat===start,relativeStart:beatToSeconds(project,p.beat)-beatToSeconds(project,start),relativeEnd:beatToSeconds(project,p.endBeat)-beatToSeconds(project,start)}));
  }
  _prepareRequest(event) {
    const owner=this.store.instrument(event.index);if(!owner||owner.sampler?.enabled||!['fm4','kiln','anneal','palinode','lantern'].includes(owner.synthId))return null;
    const params={...synthDefaults(owner.synthId),...owner.params};
    for(const point of this._eventAutomation(event))if(point.atStart&&point.target.kind==='synthParam')params[point.target.param]=point.value;
    return {event,synthId:owner.synthId,note:{pitch:event.pitch,vel:event.velocity,time:event.time,dur:event.duration+(event.chaseOffsetSeconds||0),held:false},params,sampleRate:this.ctx.sampleRate,seed:event.seed};
  }
  async _preparePlaybackSupport() {
    this.ensureContext(); await calibratePluginLatency(this.ctx.sampleRate);this.syncMixer();await this.effectsReady();
    const pool=await import('./synths/render-pool.js');this._prefetchSynthVoices=pool.prefetchSynthVoices;
    return pool;
  }
  async preparePlan(plan, { all = this.offline, signal, onProgress } = {}) {
    const pool=await this._preparePlaybackSupport();
    const notes=plan.events.filter(e=>e.type==='note'&&(all||e.time<2));
    if(!all&&pool.prefetchSynthVoices){await pool.prefetchSynthVoices(notes.map(e=>this._prepareRequest(e)).filter(Boolean),{signal,onPrepared:(r,layers)=>{r.event.prepared=layers;}});return;}
    let preparedBytes=0;
    for(let offset=0;offset<notes.length;offset+=4){if(signal?.aborted)throw new DOMException('Preparation cancelled.','AbortError');await Promise.all(notes.slice(offset,offset+4).map(async e=>{const request=this._prepareRequest(e);if(!request)return;e.prepared=await pool.prepareSynthVoice(request.synthId,request.note,request.params,request.sampleRate,{seed:request.seed,signal});preparedBytes+=(e.prepared||[]).reduce((sum,l)=>sum+l.channels.reduce((n,c)=>n+c.byteLength,0),0);if(preparedBytes>192*1024*1024)throw new Error('Prepared synth audio exceeds 192 MB. Export a shorter range or freeze dense tracks.');}));onProgress?.(Math.min(1,(offset+4)/notes.length));}
  }
  _prefetchUpcoming(now) {
    if(this.offline||!this._prefetchSynthVoices||this._prefetchPending)return;
    const windows=[{plan:this._plan,origin:this._planOrigin,cursor:this._planCursor}],requests=[];
    const nextOrigin=this._planOrigin+this._plan.duration;
    if(this._loopRange&&nextOrigin<now+2){this._nextLoopPlan||=compilePlaybackPlan(this.store.project,{range:this._loopRange,seed:this.seed,buffers:this.buffers});windows.push({plan:this._nextLoopPlan,origin:nextOrigin,cursor:0});}
    for(const window of windows)for(let i=window.cursor;i<window.plan.events.length;i++){const e=window.plan.events[i];if(e.time+window.origin>now+2)break;if(e.type!=='note'||e.preparing||e.time+window.origin<now)continue;const request=this._prepareRequest(e);if(request){requests.push({...request,plan:window.plan,origin:window.origin});if(requests.length>=32)break;}}
    if(!requests.some(r=>!r.event.prepared))return;for(const r of requests)r.event.preparing=true;
    const controller=this._prefetchAbort=new AbortController();
    this._prefetchPending=this._prefetchSynthVoices(requests,{signal:controller.signal,onPrepared:(r,layers)=>{if((r.plan===this._plan||r.plan===this._nextLoopPlan)&&r.event.time+r.origin>this.ctx.currentTime)r.event.prepared=layers;}}).then(report=>{if(report.errors.length)this.schedulerStats.preparationError=report.errors[0].message;}).catch(error=>{if(error.name!=='AbortError')this.schedulerStats.preparationError=error.message;}).finally(()=>{for(const r of requests)delete r.event.preparing;this._prefetchPending=null;});
  }

  playFromEditor(options = {}) {
    const fromBeat = this._pausedBeat == null ? this.editorTransport?.startBeat() : undefined;
    return this.play({ fromBeat, ...options });
  }

  // A note-triggered take starts on this musical clock before its first note is
  // written. Keep the timestamp of that input (including fast taps and chords).
  recordingInputTime(time) {
    const start = this._noteRecordStart;
    return this.isPlaying && start && time >= start.input && time < start.clock ? start.clock : time;
  }

  async play({ fromBeat, firstNoteTime } = {}) {
    this.ensureContext();
    if (this.isPlaying) return;
    const project=this.store.project,timeline=project.timeline,legacy=legacyPlaybackProfile(project);
    const noteTriggered = !this.offline && Number.isFinite(firstNoteTime);
    this.isPlaying = true;
    this._transportPreparing = true;
    this._noteRecordStart = null;
    const generation=++this._transportGeneration;
    const sequenceStart=project.currentSequence*16;
    const songEnd=compilePlaybackPlan(project,{buffers:this.buffers}).endBeat;
    // Mobile can audition a range without changing the saved song or the published player.
    const loop=(typeof AUDIONAUT_STANDALONE === 'undefined' && this.editorTransport?.loop(songEnd)) || (timeline?.enabled?timeline.loop:legacy?{enabled:false}:{enabled:true,start:project.continuous?0:sequenceStart,end:project.continuous?songEnd:sequenceStart+16});
    const start=fromBeat??this._pausedBeat??(timeline?.enabled?(loop?.enabled?loop.start:this.currentBeat||0):sequenceStart);
    this._loopRange=loop?.enabled?{start:loop.start,end:loop.end}:null;
    this._playRange={start,end:loop?.enabled?loop.end:timeline?.enabled?Math.max(timeline.lengthBeats,...timeline.clips.map(c=>c.start+c.duration)):legacy?songEnd:project.sequences.length*16};
    if(this._playRange.start>=this._playRange.end)this._playRange.start=this._loopRange?.start||0;
    this._nextLoopPlan=null;this._lastTickTime=null;this._plan=compilePlaybackPlan(project,{range:this._playRange,seed:this.seed,buffers:this.buffers});
    // Explicit Play retains full preparation and count-in. Waiting for a first
    // note must not defer the recorder behind asynchronous instrument prefetch.
    if(!noteTriggered)try{await this.preparePlan(this._plan);}catch(error){if(generation===this._transportGeneration){this.isPlaying=false;this._transportPreparing=false;}throw error;}
    if(generation!==this._transportGeneration||!this.isPlaying)return;
    const meter=meterAt(project,start),countBeats=!noteTriggered&&this._pausedBeat==null?(project.recording?.countIn||0)*meter.numerator*4/meter.denominator:0;
    const countSeconds=countBeats*60/(project.bpm||120);
    this._pausedBeat=null;this.currentBeat=this._playRange.start;
    this._planOrigin=noteTriggered?Math.max(this.ctx.currentTime+.01,firstNoteTime):this.ctx.currentTime+.05+countSeconds;this._planCursor=0;this._planDirty=false;this._scheduledEvents=new Map();
    if(noteTriggered)this._noteRecordStart={input:firstNoteTime,clock:this._planOrigin};
    this._transportRuns=[{clock:this._planOrigin,startBeat:this._playRange.start,endBeat:this._playRange.end,project:structuredClone({bpm:project.bpm,swing:project.swing,timeline:{enabled:timeline?.enabled,tempo:timeline?.tempo}})}];
    for(let n=0;n<countBeats;n++)this._click(this.ctx.currentTime+.05+n*60/project.bpm,n%(meter.numerator*4/meter.denominator)===0);
    this._timeline = [];
    this.playingSequence=Math.floor(this.currentBeat/16);this.currentStep=Math.floor(this.currentBeat*4)%64;
    this._transportStart = this._planOrigin;
    this._transportEnd = Infinity;
    this._transportPreparing = false;
    this._tick();
    if(typeof document!=='undefined')(typeof AUDIONAUT_STANDALONE !== 'undefined' ? document : this.editorTransport?.events ?? document).dispatchEvent(new CustomEvent('transport',{detail:{playing:true,beat:this.currentBeat}}));
    if(noteTriggered)void this._preparePlaybackSupport().catch(error=>{
      if(generation===this._transportGeneration&&this.isPlaying&&typeof document!=='undefined')document.dispatchEvent(new CustomEvent('audio-error',{detail:{message:error.message}}));
    });
  }

  pause() {
    // Notify recorders while their final audio-clock position is still available.
    this._transportEnd = this.ctx?.currentTime || 0;
    if(this.isPlaying)this._pausedBeat=this.getMusicalPosition(this._transportEnd).beat;
    this.currentBeat=this._pausedBeat??this.currentBeat;
    if (!this.offline && typeof document !== "undefined") (typeof AUDIONAUT_STANDALONE !== 'undefined' ? document : this.editorTransport?.events ?? document).dispatchEvent(new CustomEvent("transport-stop", { detail: { time: this._transportEnd } }));
    this.isPlaying = false;
    this._transportPreparing = false;
    this._noteRecordStart = null;
    this._transportGeneration++;this._prefetchAbort?.abort();
    clearTimeout(this.timer);
    for (const timer of this._transportTimers) clearTimeout(timer);
    this._transportTimers.clear();
    for (const ch of this._voices?.keys() || []) this.silenceChannel(ch);
    this.releaseAll(null, { immediate: true });
    for(const node of this._clicks||[]){try{node.stop();}catch{}}this._clicks?.clear();this._automationOverrides?.clear();
    if(typeof document!=='undefined')(typeof AUDIONAUT_STANDALONE !== 'undefined' ? document : this.editorTransport?.events ?? document).dispatchEvent(new CustomEvent('transport',{detail:{playing:false,beat:this.currentBeat}}));
  }

  _finishTransport() {
    // The musical cursor stops at the song end; finite sources and effect releases
    // already scheduled on the audio clock retain their natural tails.
    this._transportEnd=this._planOrigin+this._plan.duration;this.currentBeat=this._plan.endBeat;
    for(const s of this._mono.values())s.seq=null;
    if(!this.offline&&typeof document!=='undefined')(typeof AUDIONAUT_STANDALONE !== 'undefined' ? document : this.editorTransport?.events ?? document).dispatchEvent(new CustomEvent('transport-stop',{detail:{time:this._transportEnd}}));
    this.isPlaying=false;this._transportPreparing=false;this._noteRecordStart=null;this._pausedBeat=null;this._transportGeneration++;this._prefetchAbort?.abort();clearTimeout(this.timer);this._automationOverrides?.clear();
    for(const timer of this._transportTimers)clearTimeout(timer);this._transportTimers.clear();
    if(typeof document!=='undefined')(typeof AUDIONAUT_STANDALONE !== 'undefined' ? document : this.editorTransport?.events ?? document).dispatchEvent(new CustomEvent('transport',{detail:{playing:false,beat:this.currentBeat}}));
  }

  stop() {
    this.pause();
    this.currentStep = 0;
    this._pausedBeat=null;this.currentBeat=0;
    if (this.onStep) this.onStep(-1, this.playingSequence);
  }

  panic() {
    this.stop();
    this.stopPreview();
    this._flushEffects();
  }

  seekBeat(beat) { const playing=this.isPlaying;if(playing)this.pause();this.currentBeat=this._pausedBeat=Math.max(0,Number(beat)||0);if(playing)return this.play({fromBeat:this.currentBeat});this.onStep?.(Math.floor(this.currentBeat*4)%64,Math.floor(this.currentBeat/16)); }
  getMusicalPosition(atTime=this.ctx?.currentTime||0) {
    const time=Math.min(atTime,this._transportEnd??Infinity),run=this._transportRuns.filter(r=>r.clock<=time).at(-1)||this._transportRuns[0];
    if(!run||!this.isPlaying||this._transportPreparing)return {beat:this._pausedBeat??this.currentBeat,time,playing:false};
    const cycle=beatToSeconds(run.project,run.endBeat)-beatToSeconds(run.project,run.startBeat),elapsed=Math.max(0,time-run.clock),local=run.repeats>1?elapsed-Math.min(run.repeats-1,Math.floor(elapsed/cycle))*cycle:elapsed;
    const seconds=beatToSeconds(run.project,run.startBeat)+local;
    return {beat:Math.min(run.endBeat,secondsToBeat(run.project,seconds)),time,playing:time>=this._transportStart};
  }

  getTransportPosition(atTime = this.ctx?.currentTime || 0) {
    if(this._plan){const p=this.getMusicalPosition(atTime),beat=snapPatternBoundary(p.beat),sequenceIndex=Math.floor(beat/16),step=unswingStep((beat-sequenceIndex*16)*4,this.store.project.swing);return {...p,beat,sequenceIndex,step,elapsedSteps:beat*4};}
    const time = Math.min(atTime, this._transportEnd ?? Infinity);
    if (this.isPlaying && this.ctx) this._catchUp(Math.min(time, this.ctx.currentTime));
    const spans = this._timeline;
    let span = spans[0];
    for (let j = spans.length - 1; j >= 0; j--) if (spans[j].time <= time) { span = spans[j]; break; }
    if (!span) return { sequenceIndex: this.playingSequence, step: 0, elapsedSteps: 0, time, playing: this.isPlaying };
    const fraction = Math.max(0, Math.min(1, (time - span.time) / (span.end - span.time)));
    return { sequenceIndex: span.sequenceIndex, step: span.step + fraction, elapsedSteps: span.elapsedSteps + fraction, time, playing: this.isPlaying };
  }

  getTransportSegments(startTime, endTime = this.ctx?.currentTime || 0) {
    if(this._plan){
      const result=[],end=Math.min(endTime,this._transportEnd??Infinity);
      for(let i=0;i<this._transportRuns.length;i++){
        const run=this._transportRuns[i],cycle=beatToSeconds(run.project,run.endBeat)-beatToSeconds(run.project,run.startBeat),repeats=run.repeats||1;
        const first=Math.max(0,Math.floor((startTime-run.clock)/cycle)),last=Math.min(repeats-1,Math.floor((end-run.clock)/cycle));
        for(let repeat=first;repeat<=last;repeat++){
          const clock=run.clock+repeat*cycle,runEnd=Math.min(this._transportRuns[i+1]?.clock??Infinity,clock+cycle),from=Math.max(startTime,clock),to=Math.min(end,runEnd);if(to<=from)continue;
          const originSeconds=beatToSeconds(run.project,run.startBeat);
          let beat=snapPatternBoundary(secondsToBeat(run.project,originSeconds+(from-clock))),lastBeat=snapPatternBoundary(secondsToBeat(run.project,originSeconds+(to-clock)));
          while(beat<lastBeat-1e-9){const sequenceIndex=Math.floor(beat/16),boundary=Math.min(lastBeat,(sequenceIndex+1)*16);result.push({sequenceIndex,startStep:unswingStep((beat-sequenceIndex*16)*4,run.project.swing),endStep:unswingStep((boundary-sequenceIndex*16)*4,run.project.swing),startTime:clock+beatToSeconds(run.project,beat)-beatToSeconds(run.project,run.startBeat),endTime:clock+beatToSeconds(run.project,boundary)-beatToSeconds(run.project,run.startBeat)});beat=boundary;}
        }
      }return result;
    }
    const out = [];
    const end = Math.min(endTime, this._transportEnd ?? Infinity);
    if (this.isPlaying && this.ctx) this._catchUp(Math.min(end, this.ctx.currentTime));
    for (const span of this._timeline) {
      const from = Math.max(startTime, span.time), to = Math.min(end, span.end);
      if (to <= from) continue;
      const startStep = span.step + (from - span.time) / (span.end - span.time);
      const endStep = span.step + (to - span.time) / (span.end - span.time);
      const previous = out[out.length - 1];
      if (previous && previous.sequenceIndex === span.sequenceIndex && Math.abs(previous.endStep - startStep) < 1e-6)
        previous.endStep = endStep;
      else out.push({ sequenceIndex: span.sequenceIndex, startStep, endStep });
    }
    return out;
  }

  _tick() {
    if (!this.isPlaying) return;
    if(this._plan){this._tickPlan();return;}
    const now = this.ctx.currentTime;
    // Missed audio cannot be recovered. Advance the musical cursor without firing a burst
    // of old notes; the next event is scheduled on the first future step boundary.
    this._catchUp(now - 0.005);
    while (this.nextStepTime < now + SCHEDULE_AHEAD) {
      this._recordSpan();
      this._scheduleStep(this.currentStep, this.nextStepTime);
      this._advance();
    }
    if (!this.offline) this.timer = setTimeout(() => this.isPlaying && this._tick(), LOOKAHEAD_MS);
  }

  _appendTransportRun(clock,startBeat,endBeat,repeats=1) {
    const project=this.store.project,snapshot={bpm:project.bpm,swing:project.swing,timeline:{enabled:project.timeline.enabled,tempo:project.timeline.tempo}},previous=this._transportRuns.at(-1);
    const cycle=beatToSeconds(snapshot,endBeat)-beatToSeconds(snapshot,startBeat);
    if(previous&&previous.startBeat===startBeat&&previous.endBeat===endBeat&&JSON.stringify(previous.project)===JSON.stringify(snapshot)&&Math.abs(previous.clock+cycle*(previous.repeats||1)-clock)<1e-6)previous.repeats=(previous.repeats||1)+repeats;
    else this._transportRuns.push({clock,startBeat,endBeat,repeats,project:structuredClone(snapshot)});
  }
  _tickPlan() {
    const now=this.ctx.currentTime;
    if(this._lastTickTime!=null&&now-this._lastTickTime>.1){this.schedulerStats.lateTicks++;this.schedulerStats.maxLatenessMs=Math.max(this.schedulerStats.maxLatenessMs,(now-this._lastTickTime)*1000);}this._lastTickTime=now;
    if(this._planDirty){
      const previous=this._transportRuns.at(-1)?.project,project=this.store.project;
      const clockChanged=previous&&(previous.bpm!==project.bpm||previous.swing!==project.swing||JSON.stringify(previous.timeline)!==JSON.stringify({enabled:project.timeline.enabled,tempo:project.timeline.tempo}));
      const beat=clockChanged?this.getMusicalPosition(now).beat:null;
      for(const n of this._synthVoices.values())if(n.source==='transport'&&(clockChanged||n.time>now+.005))n.voice.stop(now);
      for(const voices of this._voices?.values()||[])for(const v of voices)if(clockChanged||v.time>now+.005){try{v.src.stop(now);}catch{}}
      for(const [key,time] of this._scheduledEvents)if(clockChanged||time>now+.005)this._scheduledEvents.delete(key);
      if(clockChanged){this._playRange={start:Math.min(beat,this._playRange.end-.001),end:this._playRange.end};this._planOrigin=now;this._appendTransportRun(now,this._playRange.start,this._playRange.end);}
      this._prefetchAbort?.abort();this._nextLoopPlan=null;this._plan=compilePlaybackPlan(project,{range:this._playRange,seed:this.seed,buffers:this.buffers});this._planCursor=0;this._planDirty=false;
    }
    // Skip whole missed cycles arithmetically. Keep compact clock history so a held
    // recording still receives the correct loop continuations after a stalled UI.
    if(this._loopRange&&now>=this._planOrigin+this._plan.duration){
      const firstClock=this._planOrigin+this._plan.duration,next=this._nextLoopPlan||compilePlaybackPlan(this.store.project,{range:this._loopRange,seed:this.seed,buffers:this.buffers}),cycles=Math.floor((now-firstClock)/next.duration);
      this.schedulerStats.skippedEvents+=this._plan.events.length-this._planCursor+cycles*next.events.length;
      this._appendTransportRun(firstClock,next.startBeat,next.endBeat,cycles+1);this._playRange={...this._loopRange};this._plan=next;this._nextLoopPlan=null;this._planOrigin=firstClock+cycles*next.duration;this._planCursor=0;this._scheduledEvents.clear();
    }
    if (typeof AUDIONAUT_STANDALONE === 'undefined') this.editorTransport?.applyPendingRange?.(now);
    for(let cycles=0;cycles<128;cycles++){
      while(this._planCursor<this._plan.events.length){const event=this._plan.events[this._planCursor],time=this._planOrigin+event.time;if(time>=now+SCHEDULE_AHEAD)break;this._planCursor++;const key=`${event.id}:${event.time}`;if(this._scheduledEvents.has(key))continue;
        if(time<now-.01){this.schedulerStats.skippedEvents++;this.schedulerStats.maxLatenessMs=Math.max(this.schedulerStats.maxLatenessMs,(now-time)*1000);delete event.prepared;continue;}
        this.scheduleEvent({...event,time});delete event.prepared;this._scheduledEvents.set(key,time);
      }
      if(this._loopRange&&now+SCHEDULE_AHEAD>=this._planOrigin+this._plan.duration){const nextClock=this._planOrigin+this._plan.duration;this._playRange={...this._loopRange};this._plan=this._nextLoopPlan||compilePlaybackPlan(this.store.project,{range:this._playRange,seed:this.seed,buffers:this.buffers});this._nextLoopPlan=null;this._planOrigin=nextClock;this._planCursor=0;this._scheduledEvents.clear();this._appendTransportRun(nextClock,this._playRange.start,this._playRange.end);continue;}
      if(!this._loopRange&&now>=this._planOrigin+this._plan.duration){this._finishTransport();return;}break;
    }
    this._prefetchUpcoming(now);this.currentBeat=this.getMusicalPosition(now).beat;
    this.timer=setTimeout(()=>this.isPlaying&&this._tick(),LOOKAHEAD_MS);
  }

  scheduleEvent(event) {
    const address=trackAddress(this.store.project,event.trackId),time=event.time;
    if(event.type==='note'&&address?.kind==='instrument'&&this.instrumentAudible(address.index)){
      const automation=this._eventAutomation(event);
      const id=this._startVoice(address.index,event.pitch,event.velocity,{time,duration:event.duration,beat:event.beat,source:'transport',held:false,seed:event.seed,chaseOffsetSeconds:event.chaseOffsetSeconds,prepared:event.prepared,automation});
      for(const p of event.expression||[])if(p.type==='bend')this.setNotePitchBend(id,p.value,Math.max(time,time+beatToSeconds(this.store.project,event.beat+(p.offset||0))-beatToSeconds(this.store.project,event.beat)-(event.rangeChaseSeconds||0)));
      return id;
    }
    if(event.type==='sample'&&address?.kind==='sample'&&this.channelAudible(address.index)){
      if(event.clip)return this._triggerClip(address.index,event);
      if(legacyPlaybackProfile(this.store.project)&&!address.track.clipSnapshot)return this.trigger(address.index,time,event.velocity,event.over,{chaseSeconds:event.chaseOffsetSeconds||0});
      let over=event.over;if(event.chaseOffsetSeconds>0){const c=address.track,b=this.buffers[address.index];if(!b)return;const pitch=over?.pitch??c.pitch??1,reverse=over?.rev??c.reverse,delta=event.chaseOffsetSeconds*pitch/b.duration;over={...over,...(reverse?{trimEnd:(over?.trimEnd??c.trimEnd)-delta}:{trimStart:(over?.trimStart??c.trimStart)+delta})};}
      return this.trigger(address.index,time,event.velocity,over);
    }
    if(event.type==='automation')return this.scheduleAutomation(event);
    if(event.type==='metronome')return this._click(time,event.accent);
    if(event.type==='step'&&!this.offline){const generation=this._transportGeneration;const timer=setTimeout(()=>{this._transportTimers.delete(timer);if(!this.isPlaying||generation!==this._transportGeneration)return;this.currentStep=event.step;this.playingSequence=event.sequenceIndex;if((typeof AUDIONAUT_STANDALONE !== 'undefined' || !this.editorTransport) && !this.store.project.timeline.enabled&&this.store.project.currentSequence!==event.sequenceIndex){this._selectingSequence=true;try{this.store.selectSequence(event.sequenceIndex);}finally{this._selectingSequence=false;}}this.onStep?.(event.step,event.sequenceIndex,time);},Math.max(0,(time-this.ctx.currentTime)*1000));this._transportTimers.add(timer);}
  }
  _click(time,accent=false){if(this.offline)return;const osc=this.ctx.createOscillator(),g=this.ctx.createGain();(this._clicks||=new Set()).add(osc);osc.frequency.value=accent?1500:1000;g.gain.setValueAtTime(.12,time);g.gain.exponentialRampToValueAtTime(.0001,time+.04);osc.connect(g).connect(this.masterGain);osc.start(time);osc.stop(time+.045);osc.onended=()=>{this._clicks.delete(osc);osc.disconnect();g.disconnect();};}
  _automateReturn(bus, key, event) {
    const {curve, value, time, duration = 0, fromValue = value} = event;
    const end = time + duration;
    const set = (param, map = v => v) => {
      if (curve === 'linear') {
        param.setValueAtTime(map(fromValue, event.beat), time);
        param.linearRampToValueAtTime(map(value, event.endBeat), end);
      } else param.setValueAtTime(map(value, event.beat), time);
    };
    const settings = returnsOf(this.store.project)[bus];
    if (key === 'ret') return set((bus === 'delay' ? this.delayFx : this.reverbFx).ret.gain);
    if (bus === 'reverb') {
      if (key === 'predelay') return set(this.reverbFx.pre.delayTime, v => v / 1000);
      const fx = this.reverbFx;
      scheduleDspBoundary(this.ctx, fx, end, () => {
        fx.shapeAutomation = {...fx.shapeAutomation, [key]:value};
        this._scheduleImpulse(false, {...settings, ...fx.shapeAutomation});
      });
      return;
    }
    const fx = this.delayFx;
    if (key === 'tone') { set(fx.toneL.frequency); set(fx.toneR.frequency); return; }
    if (key === 'time') {
      const seconds = () => Math.min(9.9, 60 / (this.store.project.bpm || 120) * BEAT_DIVS[value][1]);
      set(this.delayNode.delayTime, seconds); set(this.delayR.delayTime, seconds); return;
    }
    const other = key === 'spread' ? 'feedback' : 'spread';
    const lane = this.store.project.timeline.automation.find(l => l.enabled !== false && l.target.trackId === 'master' &&
      l.target.slotId === 'return:delay' && l.target.param === other);
    const companion = beat => (lane && automationValueAt(lane, beat)) ?? settings[other];
    const same = (v, beat) => key === 'spread' ? companion(beat) * (1 - v) : v * (1 - companion(beat));
    const cross = (v, beat) => v * companion(beat);
    set(fx.selfL.gain, same); set(fx.selfR.gain, same);
    set(fx.crossLR.gain, cross); set(fx.crossRL.gain, cross);
    if (key === 'spread') {
      set(fx.centerL.gain, v => 1 - v); set(fx.centerR.gain, v => 1 - v);
      set(fx.hardL.gain); set(fx.hardR.gain);
    }
  }

  scheduleAutomation(event){
    if(this._automationOverrides?.has(JSON.stringify(event.target))||this.store.project.automationMode==='write')return;
    const {target,value,curve}=event,time=event.time+(curve==='linear'?(event.duration||0):0),owner=this.store.project.channels.concat(this.store.project.instruments,this.store.project.buses||[]).find(t=>t.id===target.trackId),address=trackAddress(this.store.project,target.trackId),strip=target.trackId==='master'?{chain:this.chains.get('master'),pan:this._mixer.master.pan,fader:this.masterGain}:this._mixer?.strips.get(target.trackId);
    const apply=param=>{if(!param)return;if(curve==='linear'){if(event.duration)param.setValueAtTime(event.fromValue??param.value,event.time);else param.setValueAtTime(param.value,this.ctx.currentTime);param.linearRampToValueAtTime(value,time);}else param.setValueAtTime(value,time);};
    if(target.kind==='volume')return apply(target.trackId==='master'?this.masterGain.gain:this.store.project.mixerVersion>=2?strip?.fader.gain:strip?.chain.input.gain);
    if(target.kind==='pan')return apply(strip?.pan.pan);
    if(target.kind==='bend'&&address?.kind==='instrument'){for(const n of this._synthVoices.values())if(n.i===address.index)this.setNotePitchBend(n.id,value,time);return;}
    if(target.kind==='synthParam'&&address?.kind==='instrument'){for(const n of this._synthVoices.values())if(n.i===address.index)n.voice.setParameters?.({[target.param]:value},time,{curve,startTime:event.time,fromValues:{[target.param]:event.fromValue}});return;}
    if(target.kind==='effectParam'){
      const bus = sendBusId(target.slotId);
      if (bus && target.param === 'amount') return apply(strip?.chain.sendFx[bus]?.amt.gain);
      if (target.trackId === 'master' && ['return:delay','return:reverb'].includes(target.slotId))
        return this._automateReturn(target.slotId.slice(7), target.param, event);
      const it = strip?.chain.slots.get(target.slotId);
      if (!it) return;
      if (it.type.shared && !it.type.params.some(p => p.key === target.param))
        return this._automateReturn(it.type.shared, target.param, event);
      const schema = it.type.params.find(p => p.key === target.param);
      if (!schema) return;
      if (schema.options) {
        const option = schema.options[value];
        if (option) it.type.automate(this.ctx, it.nodes, target.param, option[0], time, 'step');
        return;
      }
      const param = it.nodes[target.param];
      if (param && typeof param.setValueAtTime === 'function') return apply(param);
      if (curve === 'linear' && event.duration && Number.isFinite(event.fromValue))
        it.type.automate?.(this.ctx,it.nodes,target.param,event.fromValue,event.time,'step');
      it.type.automate?.(this.ctx,it.nodes,target.param,value,time,curve);
    }
  }
  beginAutomationGesture(target){(this._automationOverrides||=new Set()).add(JSON.stringify(target));const strip=target.trackId==='master'?{pan:this._mixer?.master.pan,fader:this.masterGain,chain:this.chains?.get('master')}:this._mixer?.strips.get(target.trackId),param=target.kind==='pan'?strip?.pan.pan:target.kind==='volume'?(target.trackId==='master'||this.store.project.mixerVersion>=2?strip?.fader.gain:strip?.chain.input.gain):null;param?.cancelAndHoldAtTime?.(this.ctx?.currentTime||0);}
  endAutomationGesture(target){if(this.store.project.automationMode!=='latch')this._automationOverrides?.delete(JSON.stringify(target));}
  _triggerClip(ch,event){
    const source=trackAddress(this.store.project,event.sourceTrackId),buffer=source&&this.buffers[source.index];if(!buffer)return;
    const src=this.ctx.createBufferSource(),gain=this.ctx.createGain(),time=event.time,rate=event.playbackRate||1;
    const offset=(event.sourceOffsetSeconds||0)+(event.chaseOffsetSeconds||0)*rate,duration=Math.min(event.duration,(buffer.duration-offset)/rate);if(duration<=0)return;
    src.buffer=buffer;src.playbackRate.value=rate;src.connect(gain).connect(this.channelGains[ch]);
    const fadeIn=Math.min(duration/2,Math.max(0,beatToSeconds(this.store.project,event.beat+(event.fadeIn||0))-beatToSeconds(this.store.project,event.beat))),fadeOut=Math.min(duration/2,Math.max(0,beatToSeconds(this.store.project,event.endBeat)-beatToSeconds(this.store.project,event.endBeat-(event.fadeOut||0))));
    gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(event.velocity,time+fadeIn);gain.gain.setValueAtTime(event.velocity,time+duration-fadeOut);gain.gain.linearRampToValueAtTime(0,time+duration);
    const voice={src,gain,time};const voices=(this._voices||=new Map()).get(ch)||new Set();this._voices.set(ch,voices);voices.add(voice);src.onended=()=>{voices.delete(voice);src.disconnect();gain.disconnect();};src.start(time,offset,duration*rate);return voice;
  }
  dispose(){
    this.isPlaying=false;this._transportGeneration++;this._prefetchAbort?.abort();clearTimeout(this.timer);clearTimeout(this._gateTimer);clearTimeout(this.reverbFx?.timer);
    for(const timer of this._transportTimers)clearTimeout(timer);this._transportTimers.clear();
    this.releaseAll(null,{immediate:true});for(const ch of this._voices?.keys()||[])this.silenceChannel(ch);this.stopPreview();disposeMixer(this);
    for(const key of [...this.chains?.keys()||[]])this._disposeChain(key);
    const seen=new Set(),disconnect=value=>{if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);if(typeof value.disconnect==='function'){try{value.disconnect();}catch{}}else for(const v of Object.values(value))disconnect(v);};
    for(const node of [this.delayNode,this.delayR,this.reverbNode,this.delayFx,this.reverbFx,this.masterGain])disconnect(node);
  }

  _catchUp(time) {
    while (this.nextStepTime < time) { this._recordSpan(); this._advance(); }
  }

  _recordSpan() {
    this._timeline.push({ time: this.nextStepTime, end: this.nextStepTime + this._stepGap(this.currentStep),
      sequenceIndex: this.playingSequence, step: this.currentStep, elapsedSteps: this._elapsedSteps });
    if (this._timeline.length > 4096) this._timeline.splice(0, this._timeline.length - 4096);
  }

  _stepGap(step) {
    const dur = this.stepDuration();
    const swing = this.store.project.swing / 100;
    return dur + (step % 2 === 0 ? dur * swing : -dur * swing);
  }

  _advance() {
    this.nextStepTime += this._stepGap(this.currentStep);
    this.currentStep++;
    this._elapsedSteps++;
    if (this.currentStep >= NUM_STEPS) {
      this.currentStep = 0;
      if (this.store.project.continuous) {
        const seqs = this.store.project.sequences;
        let next = this.playingSequence + 1;
        if (next >= seqs.length || (!this.store.project.playEmptySequences && this._isEmpty(seqs[next]))) next = 0;
        this.playingSequence = next;
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
    const last = this.store.project.sequences.length - 1;
    if (this.playingSequence > last) this.playingSequence = Math.max(0, last);
  }

  _scheduleStep(step, time) {
    const seq = this.store.project.sequences[this.playingSequence];
    if (!seq) return;
    const stepDur = this.stepDuration();
    // A step's offset spans the real gap to the next step (swing included), so a
    // late hit can never overtake the next step's trigger.
    const swing = this.store.project.swing / 100;
    const gap = stepDur + (step % 2 === 0 ? stepDur * swing : -stepDur * swing);
    for (let ch = 0; ch < this.store.numChannels; ch++) {
      const raw = seq.steps[ch]?.[step];
      const v = stepVal(raw);
      if (!v) continue;
      const c = this.store.channel(ch);
      if (!this.channelAudible(ch)) continue;
      this.trigger(
        ch,
        time + stepOff(raw) * gap,
        v === 2 ? 1.25 : 1,
        stepObj(raw),
      );
    }
    // instrument notes starting on this step
    for (let i = 0; i < this.store.project.instruments.length; i++) {
      if (!this.instrumentAudible(i)) continue;
      for (const n of seq.notes?.[i] || []) {
        if (n.step === step)
          this.triggerNote(i, n.pitch, n.vel, time, n.dur * stepDur);
      }
    }
    if (!this.offline) {
      const sequenceIndex = this.playingSequence;
      const generation = this._transportGeneration;
      const delay = Math.max(0, (time - this.ctx.currentTime) * 1000);
      const timer = setTimeout(() => {
        this._transportTimers.delete(timer);
        if (!this.isPlaying || generation !== this._transportGeneration) return;
        if (this.store.project.currentSequence !== sequenceIndex) {
          this._selectingSequence = true;
          try { this.store.selectSequence(sequenceIndex); } finally { this._selectingSequence = false; }
        }
        this.onStep?.(step, sequenceIndex, time);
      }, delay);
      this._transportTimers.add(timer);
    }
  }

  // Trigger a channel's sample at `time`. `over` = per-step overrides
  // ({rev, trimStart, trimEnd, pitch}) that take precedence over channel settings.
  trigger(ch, time = 0, velocity = 1, over = null, { chaseSeconds = 0 } = {}) {
    this.ensureContext();
    const c = this.store.channel(ch);
    const historical = legacySamplePlayback(this.store.project,c,over,this.buffers[ch]?.duration||0,{chaseSeconds});
    if(historical&&historical.sourceDuration<=0)return;
    const rev = over?.rev ?? c.reverse;
    const rawPitch = over?.pitch ?? c.pitch;
    const pitch = Number.isFinite(rawPitch)
      ? Math.max(0.1, Math.min(historical || this.store.project.songOrigin ? 100 : 4, rawPitch))
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
    // Preserve each player's parameter API too: the native .value path can
    // differ by one sample from an explicit time-zero event at non-unity rates.
    if(historical&&!historical.profile.divideSourceDuration)src.playbackRate.setValueAtTime(pitch,this.ctx.currentTime);
    else src.playbackRate.value = pitch;

    let start = trimStart * buffer.duration;
    let dur = c.clipSnapshot
      ? (trimEnd - trimStart) * buffer.duration
      : Math.max(0.001, (trimEnd - trimStart) * buffer.duration);
    if (rev) start = (1 - trimEnd) * buffer.duration;
    if(historical){start=historical.offset;dur=historical.sourceDuration;}

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
        : this.store.project.choke
          ? Math.max(0.002, (this.store.project.fadeMs ?? 15) / 1000)
          : null;
    const sustain = sustainDuration(c, over, buffer, this.store.project.bpm);
    if (sustain) {
      src.loop = true;
      src.loopStart = sampleLoop(c).start;
      src.loopEnd = sampleLoop(c).end;
    }
    const audibleDuration = sustain ?? dur / pitch,
      edgeFade = historical ? 0 : Math.min(0.005, audibleDuration / 3);
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
    if(historical&&!fadeIn){
      // Standalone scheduled its 10ms fade at the scheduling clock, not note-on.
      // With normal lookahead it completes before the source starts. The editor
      // used a plain channel gain. Neither player faded sample endings.
      const fade=historical.profile.schedulingFadeSeconds;
      vg.gain.setValueAtTime(fade?0:velocity,this.ctx.currentTime);
      if(fade)vg.gain.linearRampToValueAtTime(velocity,this.ctx.currentTime+fade);
    }else{
      vg.gain.setValueAtTime(0, t);
      vg.gain.linearRampToValueAtTime(velocity, t + fadeIn);
      vg.gain.setValueAtTime(velocity, t + audibleDuration - edgeFade);
      vg.gain.linearRampToValueAtTime(0, t + audibleDuration);
    }

    const voices = (this._voices ||= new Map()).get(ch) || new Set();
    this._voices.set(ch, voices);
    const voice = { src, gain: vg, time:t, endTime:t+audibleDuration };
    const active=[...voices].filter(v=>v.time<=t&&v.endTime>t);
    if (!historical && active.length >= 32) {
      const oldest = active[0];
      try { oldest.src.stop(t); } catch {}
      oldest.endTime=t;
    }
    voices.add(voice);
    src.onended = () => {
      voices.delete(voice);
      if (!voices.size) this._voices.delete(ch);
      if (this._lastVoice?.[ch]?.src === src) this._lastVoice[ch] = null;
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
    src.playbackRate.value = this.store.channel(ch).pitch;
    const gain = this.ctx.createGain();
    src.connect(gain).connect(this.channelGains[ch]);
    const voices = (this._voices ||= new Map()).get(ch) || new Set();
    this._voices.set(ch, voices);
    if (voices.size >= 32) {
      const oldest = voices.values().next().value;
      try { oldest.src.stop(); } catch {}
      oldest.gain.disconnect(); voices.delete(oldest);
    }
    const voice = { src, gain };
    voices.add(voice);
    src.onended = () => {
      voices.delete(voice);
      if (!voices.size) this._voices.delete(ch);
      src.disconnect(); gain.disconnect();
    };
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
