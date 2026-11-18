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

export function createVoice(ctx, destination, synth, synthId, note, params, onEnded) {
  const nodes = new Set(), sources = [], pitchTargets = [];
  const held = !!note.held && !synth.live?.oneShot;
  const sampled = held && (RENDERED.has(synthId) || (synthId === "texture" && params.model === "cloud"));
  // This is an analysis/render window; the resulting source loops until key-up.
  const renderSpan = Math.min(6, Math.max(4, (params.attack || 0) + 1.5));
  const gate = ctx.createGain();
  gate.connect(destination);
  nodes.add(gate);
  let ended = false, constructed = false, pending = 0, releaseAt = null, bend = null;
  const finish = () => {
    if (ended || !constructed || pending) return;
    ended = true;
    if (bend) { try { bend.stop(); } catch {} }
    for (const n of nodes) { try { n.disconnect(); } catch {} }
    nodes.clear();
    onEnded?.();
  };
  function guardParam(p) {
    if (!held || !p || typeof p.setValueAtTime !== "function") return;
    for (const name of PARAM_METHODS) {
      if (typeof p[name] !== "function") continue;
      const original = p[name].bind(p);
      p[name] = (...args) => {
        const ti = name.startsWith("cancel") ? 0 : 1;
        if (!Number.isFinite(args[ti]) || (name === "setValueCurveAtTime" && !Number.isFinite(args[2]))) return p;
        return original(...args);
      };
    }
  }
  const context = new Proxy(ctx, {
    get(target, property) {
      const value = Reflect.get(target, property, target);
      if (typeof value !== "function") return value;
      if (!String(property).startsWith("create")) return value.bind(target);
      return (...args) => {
        const n = value.apply(target, args);
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
            return start(...a);
          };
          n.stop = (at = 0) => {
            if (held && (!Number.isFinite(at) || (sampled && at >= note.time + renderSpan))) return;
            record.stopAt = at;
            return record.stop(at);
          };
          n.addEventListener("ended", () => {
            if (record.ended) return;
            record.ended = true; pending--; finish();
          }, { once: true });
        }
        return n;
      };
    },
  });
  try {
    const dur = sampled ? renderSpan : held ? Infinity : note.dur;
    synth.voice(context, gate, { ...note, dur, held: held && !sampled }, params);
    // An additive cents signal preserves the synth's own pitch envelopes and vibrato.
    for (const s of sources) {
      const frequency = s.frequency ?? s.node.frequency?.value ?? 0;
      if (s.node.detune && (frequency >= 20 || s.pitched || (!s.node.loop && !!s.node.buffer))) pitchTargets.push(s.node.detune);
    }
  } catch (error) {
    for (const s of sources) { try { s.stop(ctx.currentTime); } catch {} }
    for (const n of nodes) { try { n.disconnect(); } catch {} }
    throw error;
  }
  constructed = true;
  const voice = {
    gate, sources, nodes,
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
    release(at = ctx.currentTime, seconds = 0.25, immediate = false) {
      const t = Math.max(ctx.currentTime, at);
      if (ended || (releaseAt != null && releaseAt <= t && !immediate)) return;
      releaseAt = t;
      if (synth.live?.oneShot && !immediate) return;
      const end = t + (immediate ? 0.005 : Math.max(0.01, seconds));
      gate.gain.cancelScheduledValues(t);
      gate.gain.setValueAtTime(Math.max(0.0001, gate.gain.value), t);
      gate.gain.exponentialRampToValueAtTime(0.0001, end);
      for (const s of sources) {
        if (s.ended || (s.stopAt != null && s.stopAt <= end)) continue;
        try { s.stop(end + 0.002); s.stopAt = end + 0.002; } catch {}
      }
      if (bend) { try { bend.stop(end + 0.003); } catch {} }
    },
    stop(at = ctx.currentTime) { this.release(at, 0, true); },
  };
  // Silent patches can construct no sources. Defer completion until the engine has the handle.
  if (!pending) queueMicrotask(finish);
  return voice;
}
