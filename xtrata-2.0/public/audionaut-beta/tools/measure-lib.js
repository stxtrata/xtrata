// tools/measure-lib.js — browser-side offline measurement for Audionaut synth voices.
// Loaded by tools/measure.mjs inside headless Chromium (OfflineAudioContext). Not used by the DAW.
//
// measureNote(def, P, note, opts) renders ONE note offline and reports level, finiteness,
// node/source counts, whether every source got a stop() time and an onended cleanup, render
// cost, and a pitch estimate. The ctx handed to voice() is a Proxy that records every node the
// voice creates, so leaks and missing stops show up without changing the synth.

const SR = 44100;

export function instrumentCtx(ctx) {
  const rec = { nodes: 0, sources: [], kinds: {} };
  const SRC = new Set(["createOscillator", "createBufferSource", "createConstantSource"]);
  const proxy = new Proxy(ctx, {
    get(t, prop) {
      const v = Reflect.get(t, prop, t);
      if (typeof v !== "function") return v;
      if (typeof prop === "string" && prop.startsWith("create") && prop !== "createBuffer" && prop !== "createPeriodicWave") {
        return (...a) => {
          const n = v.apply(t, a);
          rec.nodes++;
          rec.kinds[prop] = (rec.kinds[prop] || 0) + 1;
          if (SRC.has(prop)) {
            const s = { node: n, stopAt: null, started: false, kind: prop };
            const st = n.start.bind(n), sp = n.stop.bind(n);
            n.start = (...x) => { s.started = true; return st(...x); };
            n.stop = (w = 0, ...x) => { s.stopAt = w; return sp(w, ...x); };
            rec.sources.push(s);
          }
          return n;
        };
      }
      return v.bind(t);
    },
  });
  return { proxy, rec };
}

// autocorrelation pitch estimate over [a, b) seconds of a mono buffer
export function pitchOf(x, a = 0.15, b = 0.55, fmin = 25, fmax = 4200) {
  const i0 = Math.floor(a * SR), n = Math.min(4096, Math.floor((b - a) * SR));
  if (i0 + n * 2 > x.length) return 0;
  let e = 0;
  for (let i = 0; i < n; i++) e += x[i0 + i] * x[i0 + i];
  if (e < 1e-7) return 0;
  const lmin = Math.floor(SR / fmax), lmax = Math.min(n - 1, Math.floor(SR / fmin));
  const r = new Float32Array(lmax + 2);
  for (let l = lmin; l <= lmax; l++) {
    let s = 0, e2 = 0;
    for (let i = 0; i < n; i++) { s += x[i0 + i] * x[i0 + i + l]; e2 += x[i0 + i + l] * x[i0 + i + l]; }
    r[l] = s / Math.sqrt(e * e2 + 1e-12);
  }
  let best = 0;
  for (let l = lmin; l <= lmax; l++) if (r[l] > best) best = r[l];
  // first lag whose correlation is within 7% of the best avoids octave-down errors
  for (let l = lmin + 1; l < lmax; l++) {
    if (r[l] >= best * 0.93 && r[l] >= r[l - 1] && r[l] >= r[l + 1]) {
      const y0 = r[l - 1], y1 = r[l], y2 = r[l + 1];
      const d = (y0 - y2) / (2 * (y0 - 2 * y1 + y2) || 1);
      return { f: SR / (l + d), conf: y1 };
    }
  }
  return 0;
}

export async function measureNote(def, P, { pitch = 57, vel = 1, dur = 1.5 } = {}, { len = 4, ch = 2 } = {}) {
  const ctx = new OfflineAudioContext(ch, Math.ceil(SR * len), SR);
  const bus = ctx.createGain();
  bus.connect(ctx.destination);
  const { proxy, rec } = instrumentCtx(ctx);
  const t0 = performance.now();
  let err = null;
  try {
    def.voice(proxy, bus, { pitch, vel, time: 0, dur }, P);
  } catch (e) {
    err = String(e && e.message || e);
  }
  const ms = performance.now() - t0;
  const buf = await ctx.startRendering();
  const L = buf.getChannelData(0), R = buf.numberOfChannels > 1 ? buf.getChannelData(1) : L;
  const mono = new Float32Array(L.length);
  let s = 0, peak = 0, bad = 0;
  for (let i = 0; i < L.length; i++) {
    const a = L[i], b = R[i];
    if (!Number.isFinite(a) || !Number.isFinite(b)) { bad++; continue; }
    mono[i] = (a + b) / 2;
    s += (a * a + b * b) / 2;
    const m = Math.max(Math.abs(a), Math.abs(b));
    if (m > peak) peak = m;
  }
  // tail: RMS of the last 100 ms (should be ~0 when the note ends inside the render)
  let ts = 0;
  const tn = Math.floor(SR * 0.1);
  for (let i = L.length - tn; i < L.length; i++) ts += mono[i] * mono[i];
  // click check: biggest single-sample jump in the first 3 ms (onset) relative to peak
  let onsetJump = 0;
  for (let i = 1; i < Math.min(L.length, SR * 0.003); i++) onsetJump = Math.max(onsetJump, Math.abs(mono[i] - mono[i - 1]));
  const stops = rec.sources.map((x) => x.stopAt);
  // a one-shot (non-looping) buffer source ends by itself at the end of its buffer
  const selfEnding = (x) => x.kind === "createBufferSource" && !x.node.loop && x.node.buffer;
  const unstopped = rec.sources.filter((x) => x.started && !selfEnding(x) && (x.stopAt == null || !Number.isFinite(x.stopAt))).length;
  const maxStop = stops.length ? Math.max(...stops.filter((v) => v != null)) : 0;
  const ended = rec.sources.some((x) => typeof x.node.onended === "function");
  return {
    err, ms: +ms.toFixed(2), rms: Math.sqrt(s / L.length), peak, nonFinite: bad,
    tailRms: Math.sqrt(ts / tn), onsetJump, nodes: rec.nodes, sources: rec.sources.length,
    unstopped, maxStop, hasOnended: ended, mono,
  };
}

export const defaultsOf = (def) => Object.fromEntries(def.params.map((p) => [p.key, p.def]));

// test pitch per synth: drums use a snare (D2 = 38) and the kick; everything else A3
export const testPitch = (id) => (id === "kit" ? 38 : 57);
