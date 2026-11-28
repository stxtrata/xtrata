// unison-worklet.js — EXPERIMENT: one AudioWorklet node that plays a whole
// unison stack, in place of an oscillator, gain and panner per unison voice.
//
// Off by default. Turn it on with ?osc=worklet in the address, or
// localStorage "audionaut:osc-engine" = "worklet", or the button in
// Diagnostics. When it is off, or the processor has not loaded for a context,
// synths build their native oscillators exactly as before.
//
// Only MAVREKT uses it so far. Differences from the native stack, by design:
//   - each unison voice starts at its own (seeded) phase, as hardware supersaws
//     do; native oscillators all start in phase;
//   - edges are band-limited with PolyBLEP, which is cheaper than the browser's
//     wavetables but lets through a little more aliasing on very high notes.
//
// Lifetime: the caller drives the "gate" parameter from a ConstantSource that
// the voice lifecycle starts and stops like any other source, so note timing,
// release and rebuilds need no special handling. Pitch bend, glide and the
// modulation kit reach it through the "detune" parameter.

const KEY = "audionaut:osc-engine";
let override = null;
export function oscEngineEnabled() {
  if (override != null) return override;
  try {
    if (typeof location !== "undefined" && new URLSearchParams(location.search).get("osc") === "worklet") return true;
    return typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "worklet";
  } catch { return false; }
}
export function setOscEngine(on, { persist = false } = {}) {
  override = !!on;
  if (persist) { try { if (on) localStorage.setItem(KEY, "worklet"); else localStorage.removeItem(KEY); } catch { /* storage unavailable */ } }
}

function processorMain() {
  const WAVES = { saw: 0, square: 1, triangle: 2, pulse: 3 };
  class AnUnison extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        { name: "gate", defaultValue: 0, minValue: 0, maxValue: 1, automationRate: "a-rate" },
        { name: "frequency", defaultValue: 440, minValue: 0, maxValue: 24000, automationRate: "k-rate" },
        { name: "detune", defaultValue: 0, minValue: -9600, maxValue: 9600, automationRate: "a-rate" },
        { name: "spread", defaultValue: 10, minValue: 0, maxValue: 200, automationRate: "k-rate" },
        { name: "width", defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: "k-rate" },
      ];
    }
    constructor(options) {
      super();
      const o = options.processorOptions || {};
      const n = this.n = Math.max(1, Math.min(16, Math.round(o.voices) || 1));
      this.wave = WAVES[o.wave] ?? 0;
      this.offsets = new Float32Array(n); this.phase = new Float32Array(n); this.ratio = new Float32Array(n);
      this.gl = new Float32Array(n); this.gr = new Float32Array(n);
      let seed = (o.seed >>> 0) || 1;
      for (let v = 0; v < n; v++) {
        this.offsets[v] = n === 1 ? 0 : (v / (n - 1)) * 2 - 1;
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        this.phase[v] = n === 1 ? 0 : seed / 4294967296;
      }
      // Level-matched to the browser's own oscillators, measured per shape (saw, square, triangle, pulse).
      this.norm = [0.8, 0.77, 0.86, 0.556][this.wave] / Math.sqrt(n);
      this.started = false;
      this.mul = new Float32Array(128);
    }
    process(_inputs, outputs, p) {
      const out = outputs[0], L = out[0], R = out[1] || out[0], frames = L.length, gate = p.gate;
      // Where the gate is open in this block.
      let from = 0, to = frames;
      if (gate.length === 1) { if (gate[0] <= 0) to = 0; }
      else { while (from < frames && gate[from] <= 0) from++; to = from; while (to < frames && gate[to] > 0) to++; }
      if (to <= from) return !this.started; // silent: keep waiting before the note, finish after it
      this.started = true;
      const sr = sampleRate, f = Math.min(sr * 0.45, p.frequency[0]), spread = p.spread[0], width = p.width[0], n = this.n, wave = this.wave, norm = this.norm;
      const detune = p.detune, moving = detune.length > 1, mul = this.mul;
      if (moving) for (let i = from; i < to; i++) mul[i] = Math.pow(2, detune[i] / 1200);
      const fixed = moving ? 1 : Math.pow(2, detune[0] / 1200);
      for (let v = 0; v < n; v++) {
        const pan = (this.offsets[v] * width + 1) * Math.PI / 4, gl = Math.cos(pan) * norm, gr = Math.sin(pan) * norm;
        const base = f * Math.pow(2, this.offsets[v] * spread / 1200) / sr;
        let ph = this.phase[v];
        for (let i = from; i < to; i++) {
          const dt = Math.min(0.45, base * (moving ? mul[i] : fixed));
          let s;
          if (wave === 2) s = 1 - 4 * Math.abs(ph - 0.5);
          else if (wave === 0) {
            s = 2 * ph - 1;
            if (ph < dt) { const t = ph / dt; s -= t + t - t * t - 1; } else if (ph > 1 - dt) { const t = (ph - 1) / dt; s -= t * t + t + t + 1; }
          } else {
            const w = wave === 1 ? 0.5 : 0.25;
            s = (ph < w ? 1 : -1) - (2 * w - 1);
            if (ph < dt) { const t = ph / dt; s += t + t - t * t - 1; } else if (ph > 1 - dt) { const t = (ph - 1) / dt; s += t * t + t + t + 1; }
            let q = ph - w; if (q < 0) q += 1;
            if (q < dt) { const t = q / dt; s -= t + t - t * t - 1; } else if (q > 1 - dt) { const t = (q - 1) / dt; s -= t * t + t + t + 1; }
          }
          L[i] += s * gl; if (R !== L) R[i] += s * gr;
          ph += dt; if (ph >= 1) ph -= 1;
        }
        this.phase[v] = ph;
      }
      return true;
    }
  }
  registerProcessor("an-unison", AnUnison);
}

const loads = new WeakMap(), ready = new WeakSet();
// Resolves true once the processor is registered for this context. Never throws.
export async function prepareOscEngine(ctx) {
  try {
    if (!ctx || !ctx.audioWorklet || typeof AudioWorkletNode === "undefined" || typeof Blob === "undefined") return false;
    let load = loads.get(ctx);
    if (!load) {
      load = (async () => {
        const url = URL.createObjectURL(new Blob([`(${processorMain.toString()})();`], { type: "text/javascript" }));
        try { await ctx.audioWorklet.addModule(url); ready.add(ctx); return true; } catch { return false; } finally { URL.revokeObjectURL(url); }
      })();
      loads.set(ctx, load);
    }
    return await load;
  } catch { return false; }
}
export const oscEngineReady = (ctx) => oscEngineEnabled() && ready.has(ctx);

// Build one unison stack as a worklet. `ctx` is the voice's context wrapper.
// Returns false (and builds nothing) when the engine is off or not loaded.
export function unisonPart(ctx, { play, frequency, wave, voices, detune, width, into, index = 0 }) {
  const real = ctx.resourceContext || ctx;
  if (!oscEngineReady(real) || typeof ctx.adoptNode !== "function") return false;
  let node;
  try {
    node = new AudioWorkletNode(real, "an-unison", {
      numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2],
      processorOptions: { voices, wave, seed: ((ctx.seed >>> 0) ^ Math.imul(index + 1, 0x9e3779b1)) >>> 0 },
      parameterData: { frequency: Math.min(real.sampleRate * 0.45, frequency), spread: detune, width },
    });
  } catch { return false; }
  ctx.adoptNode(node, { pitch: node.parameters.get("detune") });
  const life = ctx.createConstantSource();
  life.offset.value = 1;
  life.connect(node.parameters.get("gate"));
  node.connect(into);
  play(life);
  return true;
}
