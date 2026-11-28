import { synthOversampling } from "./capabilities.js";
import { replayChasedAutomation } from "./automation-replay.js";
import { scheduleDspBoundary } from "../plugin-automation.js";
import { seededRandom, seedNumber } from "./resources.js";
import { scheduleGlide } from "../voicing.js";
import { modActive, modOutput, attachModulation } from "../modulation.js";
import { preparedSynthVoice, prepareSynthVoice, renderSynthVoice } from "./render-pool.js";
// A voice owns every node it creates, including modulators and scheduled sources.
// Open native gates use Infinity as a *declaration*, never as a Web Audio timestamp:
// the managed context omits those note-off events until release() is called.
// Rendered modal/FM voices use a crossfaded sustain region, not a longer note timer.
const SOURCE_FACTORIES = new Set(["createOscillator", "createBufferSource", "createConstantSource"]);
const PARAM_METHODS = ["setValueAtTime", "linearRampToValueAtTime", "exponentialRampToValueAtTime", "setTargetAtTime", "setValueCurveAtTime", "cancelScheduledValues", "cancelAndHoldAtTime"];
const PARAMS = ["gain", "frequency", "detune", "playbackRate", "pan", "Q", "delayTime", "offset"];
const RENDERED = new Set(["fm4", "kiln", "anneal", "palinode"]);

function sustainBuffer(ctx, original, gate) {
  const sr = original.sampleRate;
  const end = Math.min(original.length - 2, Math.floor((gate - 0.08) * sr));
  const span = Math.min(Math.floor(sr * 0.75), Math.floor(end / 2));
  const fade = Math.min(Math.floor(sr * 0.035), Math.floor(span / 4));
  const start = end - span;
  if (start < 1 || fade < 2) return null;
  let power = 0;
  const b = ctx.createBuffer(original.numberOfChannels, end, sr);
  for (let ch = 0; ch < b.numberOfChannels; ch++) {
    const a = original.getChannelData(ch), out = b.getChannelData(ch);
    out.set(a.subarray(0, end));
    for (let j = start; j < end; j++) power += a[j] * a[j];
    for (let j = 0; j < fade; j++) {
      const x = j / (fade - 1);
      out[end - fade + j] = a[end - fade + j] * (1 - x) + a[start + j] * x;
    }
  }
  if (power / (span * b.numberOfChannels) < 1e-10) return null;
  // AudioBufferSourceNode.buffer can only be assigned once. These voice-local buffers
  // are copies of the render cache, so prepare their splice in place before start().
  for (let ch = 0; ch < b.numberOfChannels; ch++) original.getChannelData(ch).set(b.getChannelData(ch));
  return { start: (start + fade) / sr, end: end / sr };
}

// What the modulation kit can move on a built voice: the host targets, every
// pitched source, and each live control. A control bound to a filter's cutoff is
// moved through that filter's detune, so the swing is in octaves, not hertz.
function modTargets(synth, nodes, bindings, pitchTargets, host = new Map()) {
  const targets = new Map(host);
  if (pitchTargets.length) targets.set("@pitch", pitchTargets.map((param) => ({ param, depth: 1200 })));
  const filters = [...nodes].filter((n) => n && n.frequency && n.detune && n.Q && typeof n.getFrequencyResponse === "function");
  for (const [key, list] of bindings) {
    const def = (Array.isArray(synth.params) ? synth.params : []).find((p) => p.key === key), out = [];
    for (const { target, map } of list) {
      if (!target || typeof target === "function" || typeof target.setValueAtTime !== "function") continue;
      const filter = filters.find((n) => n.frequency === target);
      if (filter) { out.push({ param: filter.detune, depth: 4800 }); continue; }
      if (!def || !Number.isFinite(def.min) || !Number.isFinite(def.max)) continue;
      const depth = (map(def.max) - map(def.min)) / 2;
      if (Number.isFinite(depth) && depth) out.push({ param: target, depth });
    }
    if (out.length) targets.set(key, out);
  }
  return targets;
}

// The targets a synth offers, found by building one silent voice.
export function probeModTargets(synth, synthId, params) {
  try {
    const ctx = new OfflineAudioContext(2, 128, 44100);
    const voice = createNativeVoice(ctx, ctx.destination, synth, synthId, { pitch: 60, vel: .8, time: 0, dur: .05, bpm: 120 }, params, () => {}, { seed: 1, probe: true });
    return voice.modTargetKeys || [];
  } catch { return []; }
}

function createNativeVoice(ctx, destination, synth, synthId, note, params, onEnded, options = {}) {
  const nodes = new Set(), sources = [], pitchTargets = [];
  const bindings = new Map(), replayers = [];
  const held = !!note.held && !synth.live?.oneShot;
  const sampled = held && (RENDERED.has(synthId) || (synthId === "texture" && params.model === "cloud"));
  // This is an analysis/render window; the resulting source loops until key-up.
  const renderSpan = Math.min(6, Math.max(4, (params.attack || 0) + 1.5));
  const gate = ctx.createGain();
  const mod = modActive(options.mod) ? options.mod : null, stage = mod ? modOutput(ctx, mod, destination) : null;
  let modulation = null;
  gate.connect(stage ? stage.input : destination);
  if (stage) for (const n of stage.nodes) nodes.add(n);
  if (note.offset > 0 && note.resumeAt != null) { gate.gain.setValueAtTime(.0001,note.resumeAt); gate.gain.linearRampToValueAtTime(1,note.resumeAt+.005); }
  nodes.add(gate);
  let ended = false, constructed = false, pending = 0, releaseAt = null, bend = null, glide = null;
  const finish = () => {
    if (ended || !constructed || pending) return;
    ended = true;
    if (bend) { try { bend.stop(); } catch {} }
    if (glide) { try { glide.stop(); } catch {} }
    modulation?.dispose();
    for (const n of nodes) { try { n.disconnect(); } catch {} }
    nodes.clear();
    onEnded?.();
  };
  function guardParam(p) {
    if ((!held && note.time >= 0) || !p || typeof p.setValueAtTime !== "function") return;
    const events = [], methods = {};
    for (const name of PARAM_METHODS) {
      if (typeof p[name] !== "function") continue;
      const original = p[name].bind(p); methods[name] = original;
      p[name] = (...args) => {
        const ti = name.startsWith("cancel") ? 0 : 1;
        if (!Number.isFinite(args[ti]) || (name === "setValueCurveAtTime" && !Number.isFinite(args[2]))) return p;
        if (note.time < 0) { events.push({name,args}); return p; }
        return original(...args);
      };
    }
    if (note.time < 0) replayers.push(() => replayChasedAutomation(p, events, methods));
  }
  // Explicit resource factory for legacy graph definitions. The stable resourceContext
  // is deliberately distinct from this disposable voice host. All native graph factories
  // enter through this owner; no project or engine state is visible to an instrument.
  const context = { resourceContext: ctx.resourceContext || ctx, seed: seedNumber(options.seed), random: seededRandom(options.seed) };
  context.bindParam = (key, target, map = (v) => v) => {
    const list = bindings.get(key) || []; list.push({ target, map }); bindings.set(key, list);
  };
  // Explicit pitch ownership also covers sub-20 Hz fundamentals. Legacy voices
  // retain the heuristic that keeps slow modulation oscillators out of bends.
  context.markPitched = node => {
    const source = sources.find(record => record.node === node);
    if (source) source.pitched = true;
  };
  const names = new Set();
  for (let prototype = ctx; prototype; prototype = Object.getPrototypeOf(prototype)) for (const key of Object.getOwnPropertyNames(prototype)) names.add(key);
  for (const property of names) {
    if (property in context || property === "constructor") continue;
    let value;
    try { value = ctx[property]; } catch { continue; }
    if (typeof value !== "function") { Object.defineProperty(context, property, { get: () => ctx[property] }); continue; }
    if (!String(property).startsWith("create")) { context[property] = value.bind(ctx); continue; }
    context[property] = (...args) => {
        const n = value.apply(ctx, args);
        if (!n || typeof n.connect !== "function") return n;
        nodes.add(n);
        for (const key of PARAMS) guardParam(n[key]);
        if (SOURCE_FACTORIES.has(property)) {
          const record = { node: n, stopAt: null, startAt: null, ended: false, pitched: false, stop: n.stop.bind(n) };
          sources.push(record);
          pending++;
          if (n.frequency) {
            const setFrequency = n.frequency.setValueAtTime.bind(n.frequency);
            n.frequency.setValueAtTime = (value, at) => {
              if (at <= note.time + 0.001 && Number.isFinite(value)) record.frequency = value;
              return setFrequency(value, at);
            };
          }
          const start = n.start.bind(n);
          n.start = (...a) => {
            // A note-off click (organ key contact) belongs to release, not note-on.
            // Never submit an open-ended timestamp to the native API.
            if (a.length && !Number.isFinite(a[0])) {
              record.ended = true; pending--; n.disconnect(); return;
            }
            record.startAt = a[0] ?? 0;
            if (sampled && n.buffer && !n.loop) {
              const region = sustainBuffer(ctx, n.buffer, renderSpan);
              if (region) {
                n.loop = true;
                n.loopStart = region.start; n.loopEnd = region.end;
                record.pitched = true;
                // Ignore a finite source duration when the held render is looped.
                a = a.slice(0, 2);
              }
            }
            if (note.resumeAt != null && n.buffer && note.resumeAt > record.startAt) {
              const age = Math.max(0, note.resumeAt - record.startAt) + (a[1] || 0);
              if (!n.loop && age >= n.buffer.duration) { record.ended = true; pending--; n.disconnect(); return; }
              const offset = n.loop ? (n.loopStart || 0) + (age % Math.max(.001, (n.loopEnd || n.buffer.duration) - (n.loopStart || 0))) : Math.min(age, Math.max(0, n.buffer.duration - 1 / n.buffer.sampleRate));
              a = [note.resumeAt, offset];
            }
            if (note.resumeAt != null && record.startAt < note.resumeAt) a[0] = note.resumeAt;
            return start(...a);
          };
          n.stop = (at = 0) => {
            if (record.ended) return;
            if (held && (!Number.isFinite(at) || (sampled && at >= note.time + renderSpan))) return;
            record.stopAt = at;
            return record.stop(Math.max(0, at));
          };
          n.addEventListener("ended", () => {
            if (record.ended) return;
            record.ended = true; pending--; finish();
          }, { once: true });
        }
        return n;
    };
  }
  try {
    const dur = sampled ? renderSpan : held ? Infinity : note.dur;
    const prepared = options.prepared || preparedSynthVoice(synthId, { ...note, dur }, params, ctx.sampleRate, options.seed) || renderSynthVoice(synthId, { ...note, dur }, params, ctx.sampleRate, options.seed);
    if (prepared) {
      for (const layer of prepared) {
        const buffer = context.createBuffer(layer.channels.length, layer.channels[0].length, layer.sampleRate);
        layer.channels.forEach((channel, index) => buffer.copyToChannel(channel, index));
        const source = context.createBufferSource(); source.buffer = buffer; source.connect(gate); source.start(note.time);
      }
    } else synth.voice(context, gate, { ...note, dur, held: held && !sampled }, params);
    for (const replay of replayers) replay();
    // An additive cents signal preserves the synth's own pitch envelopes and vibrato.
    for (const s of sources) {
      const frequency = s.frequency ?? s.node.frequency?.value ?? 0;
      if (s.node.detune && (frequency >= 20 || s.pitched || (!s.node.loop && !!s.node.buffer))) pitchTargets.push(s.node.detune);
    }
    if (mod) modulation = attachModulation(ctx, mod, { note, startAt: note.resumeAt ?? note.time, age: note.resumeAt != null ? note.resumeAt - note.time : 0, targets: modTargets(synth, nodes, bindings, pitchTargets, stage.targets) });
  } catch (error) {
    for (const s of sources) { try { s.stop(ctx.currentTime); } catch {} }
    for (const n of nodes) { try { n.disconnect(); } catch {} }
    throw error;
  }
  constructed = true;
  const voice = {
    gate, sources, nodes,
    bindings,
    get modTargetKeys() { return [...modTargets(synth, nodes, bindings, pitchTargets).keys()].filter((key) => !key.startsWith('@')); },
    tailSeconds: Number.isFinite(note.dur) ? Math.max(0, ...sources.map(s => (s.stopAt ?? (s.startAt + (s.node.buffer?.duration || 0))) - note.time - note.dur)) : Math.max(0, params.release ?? params.rel ?? .25),
    setParameters(patch, at = ctx.currentTime, automation = {}) {
      if (Object.keys(patch).some((key) => !bindings.has(key))) return false;
      for (const [key, value] of Object.entries(patch)) for (const { target, map } of bindings.get(key)) {
        if (typeof target === "function") target(value, at);
        else {
          const start = Math.max(ctx.currentTime, automation.startTime ?? at);
          if (automation.curve === "linear" && start < at) {
            if (target.cancelAndHoldAtTime) target.cancelAndHoldAtTime(start); else target.cancelScheduledValues(start);
            if (automation.fromValues?.[key] != null) target.setValueAtTime(map(automation.fromValues[key]),start);
            target.linearRampToValueAtTime(map(value),at);
          } else { if (target.cancelAndHoldAtTime) target.cancelAndHoldAtTime(at); else target.cancelScheduledValues(at); target.setTargetAtTime(map(value), at, 0.008); }
        }
      }
      return true;
    },
    get ended() { return ended; },
    get released() { return releaseAt != null; },
    setBend(semitones, at = ctx.currentTime) {
      if (ended || !pitchTargets.length) return;
      if (!bend) {
        bend = ctx.createConstantSource(); nodes.add(bend);
        bend.offset.value = 0;
        for (const p of pitchTargets) bend.connect(p);
        bend.start();
      }
      bend.offset.setTargetAtTime(Math.max(-48, Math.min(48, +semitones || 0)) * 100, at, 0.003);
    },
    // A second cents signal beside the bend, so a slide and the wheel add up.
    setGlide(semitones, at = ctx.currentTime, seconds = 0, from = null) {
      if (ended || !pitchTargets.length) return;
      if (!glide) {
        glide = ctx.createConstantSource(); nodes.add(glide);
        glide.offset.value = 0;
        for (const p of pitchTargets) glide.connect(p);
        glide.start();
      }
      scheduleGlide(glide.offset, ctx, 0, semitones, at, seconds, from);
    },
    release(at = ctx.currentTime, seconds = 0.25, immediate = false) {
      const t = Math.max(ctx.currentTime, at);
      if (ended || (releaseAt != null && releaseAt <= t && !immediate)) return;
      releaseAt = t;
      if (synth.live?.oneShot && !immediate) return;
      const end = t + (immediate ? 0.005 : Math.max(0.01, seconds));
      gate.gain.cancelScheduledValues(t);
      gate.gain.setValueAtTime(Math.max(0.0001, gate.gain.value), t);
      gate.gain.exponentialRampToValueAtTime(0.0001, end);
      gate.gain.setValueAtTime(0, end + .001);
      for (const s of sources) {
        if (s.ended || (s.stopAt != null && s.stopAt <= end)) continue;
        try { s.stop(end + 0.002); s.stopAt = end + 0.002; } catch {}
      }
      if (bend) { try { bend.stop(end + 0.003); } catch {} }
      if (glide) { try { glide.stop(end + 0.003); } catch {} }
      modulation?.stop(end + 0.003);
    },
    stop(at = ctx.currentTime) { this.release(at, 0, true); },
  };
  // Silent patches can construct no sources. Defer completion until the engine has the handle.
  if (!pending) queueMicrotask(finish);
  return voice;
}

// Stable public voice protocol. Parameter edits use explicitly bound controls when
// available; topology/model changes rebuild at the original envelope age and crossfade.
// This keeps held sound responsive without a key retrigger or a discontinuous splice.
export function createVoice(ctx, destination, synth, synthId, note, params, onEnded, options = {}) {
  if (note.offset > 0) note = {...note, time:note.time-note.offset, resumeAt:note.time, dur:Number.isFinite(note.dur)?note.dur+note.offset:note.dur};
  let current, ended = false, released = false, bend = 0, releaseAt = null, releaseSeconds = params.release ?? params.rel ?? .25;
  let state = { ...params }, generation = 0, slide = null;
  // Where the slide has got to, so a rebuilt voice carries on from the same pitch.
  const slideAt = (t) => !slide ? 0 : t >= slide.at + slide.seconds ? slide.to : t <= slide.at ? slide.from : slide.from + (slide.to - slide.from) * (t - slide.at) / slide.seconds;
  const children = new Set();
  const finish = (child) => { children.delete(child); if (!children.size && !ended) { ended = true; onEnded?.(); } };
  const build = (patch, resumeAt) => {
    let child;
    child = createNativeVoice(ctx, destination, synth, synthId, { ...note, ...(resumeAt == null ? {} : { resumeAt }) }, patch, () => finish(child), {...options, prepared: resumeAt == null ? options.prepared : undefined});
    children.add(child); if (bend) child.setBend(bend, resumeAt ?? note.time);
    if (slide) { const t = resumeAt ?? note.time; child.setGlide(slide.to, t, Math.max(0, slide.at + slide.seconds - t), slideAt(t)); }
    return child;
  };
  current = build(state);
  const voice = {
    get gate() { return current.gate; }, get sources() { return [...children].flatMap((child) => child.sources); }, get nodes() { return current.nodes; },
    get ended() { return ended; }, get released() { return released; }, get disposed() { return ended || (releaseAt != null && ctx.currentTime >= releaseAt); }, ready: Promise.resolve(true), latencySeconds: (options.latencySamples ?? (synthOversampling(synthId,params) === 2 ? 128 : 0)) / ctx.sampleRate,
    get tailSeconds() { return Math.max(current.tailSeconds || 0, +releaseSeconds || 0); },
    setBend(semitones, at = ctx.currentTime) { bend = semitones; for (const child of children) child.setBend(semitones, at); },
    setGlide(semitones, at = ctx.currentTime, seconds = 0, from = null) {
      const t = Math.max(ctx.currentTime, at);
      slide = { from: from ?? slideAt(t), to: semitones, at: t, seconds: Math.max(0, seconds) };
      for (const child of children) child.setGlide(semitones, t, seconds, from);
    },
    release(at = ctx.currentTime, seconds = releaseSeconds, immediate = false) { released = true; releaseAt = at; releaseSeconds = seconds; generation++; for (const child of children) child.release(at, seconds, immediate); },
    stop(at = ctx.currentTime) { this.release(at, 0, true); },
    async setParameters(patch, at = ctx.currentTime, automation = {}) {
      if (ended || (releaseAt != null && at >= releaseAt)) return false;
      if (at > ctx.currentTime + .002 && Object.keys(patch || {}).some(key => !current.bindings.has(key))) {
        scheduleDspBoundary(ctx, voice, at, () => voice.setParameters(patch, ctx.currentTime));
        return true;
      }
      const changed = Object.fromEntries(Object.entries(patch || {}).filter(([key, value]) => state[key] !== value || automation.curve === "linear" && automation.fromValues?.[key] !== value));
      if (!Object.keys(changed).length) return true;
      state = { ...state, ...changed }; releaseSeconds = state.release ?? state.rel ?? releaseSeconds;
      if (current.setParameters(changed, at, automation)) return true;
      const version = ++generation, next = { ...state };
      const dur = note.held && !synth.live?.oneShot ? Math.min(6, Math.max(4, (next.attack || 0) + 1.5)) : note.dur;
      try { await prepareSynthVoice(synthId, { ...note, dur }, next, ctx.sampleRate, options); } catch { /* synchronous constructor remains the compatibility fallback */ }
      if (version !== generation || ended || (releaseAt != null && ctx.currentTime >= releaseAt)) return false;
      const time = Math.max(ctx.currentTime, at), previous = current;
      current = build(next, time);
      current.gate.gain.cancelScheduledValues(time); current.gate.gain.setValueAtTime(.0001, time); current.gate.gain.linearRampToValueAtTime(1, time + .02);
      previous.release(time, .02, !!synth.live?.oneShot);
      if (releaseAt != null) current.release(releaseAt, releaseSeconds);
      return true;
    },
  };
  return voice;
}
