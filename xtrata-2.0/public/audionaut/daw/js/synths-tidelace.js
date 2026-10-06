// synths-tidelace.js — TIDELACE · harmonic current synthesizer (Audionaut synth-bank module)
// Ported from the standalone tidelace.html. Six sine "threads" at material-dependent ratios
// (copper = near-harmonic, glass = bell ratios, reed = odd harmonics), each with its own
// near-unison FM partner (ratio 1.003 + tension) that makes the shimmering current, slow
// drift detune, and a stereo weave of two auto-panning LFOs. Web Audio node graph per note.
//
// What the standalone page did live and what became of it:
//   Held-note live sculpting (field drag, knob moves) -> per-note: the held note UNFURLS - upper
//     threads enter one after another, the FM "tension" tightens and the horizon opens, over a time
//     derived from the gate length (long holds = slow loom, staccato = already woven).
//   Velocity -> loudness plus brightness (Touch): harder = more bloom, more FM, wider horizon.
//   Convolver "Space" (1.8 s procedural IR per note) -> replaced by a cheap per-note stereo haze
//     (two feedback delays panned L/R); the host's per-channel reverb does the real room.
//   Page master/analyser -> dropped; a soft-clip is baked in. Drift/pan LFOs are per-note.

const tlClamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const tlFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const TL_MATERIALS = {
  copper: [1, 2, 3, 4, 5, 7],
  glass: [1, 2.01, 2.76, 4.07, 5.43, 8.21],
  reed: [1, 3, 5, 7, 9, 11],
};
const TL_OUT = 0.26; // overall voice gain (tuned so defaults land at rms ~0.075)

let TL_CURVE = null; // constant soft-clip table, never mutated
function tlCurve() {
  if (TL_CURVE) return TL_CURVE;
  const n = 2049;
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    c[i] = (0.95 * Math.tanh(1.5 * x)) / Math.tanh(1.5);
  }
  TL_CURVE = c;
  return c;
}

const R = (key, label, min, max, step, def) => ({ key, label, type: "range", min, max, step, def });
const TL_PARAMS = [
  { key: "material", label: "Material", type: "select", def: "copper", options: ["copper", "glass", "reed"] },
  R("bloom", "Bloom", 0, 1, 0.01, 0.58),
  R("tension", "Tension", 0, 1, 0.01, 0.22),
  R("drift", "Drift", 0, 35, 0.5, 9),
  R("tide", "Tide", 0.03, 2, 0.01, 0.23),
  R("weave", "Weave", 0, 1, 0.01, 0.5),
  R("unfurl", "Unfurl", 0, 1, 0.01, 0.35),
  R("touch", "Touch", 0, 1, 0.01, 0.5),
  R("horizon", "Horizon", 160, 12000, 10, 4400),
  R("attack", "Attack", 0.005, 2, 0.005, 0.13),
  R("sustain", "Sustain", 0.1, 1, 0.01, 0.76),
  R("release", "Release", 0.03, 4, 0.01, 1.25),
  R("space", "Space", 0, 1, 0.01, 0.38),
  R("level", "Output Level", 0, 1, 0.01, 0.7),
];

function tlParams(P) {
  const out = {};
  for (const d of TL_PARAMS) {
    const v = P?.[d.key];
    if (d.type === "select") out[d.key] = d.options.includes(v) ? v : d.def;
    else out[d.key] = Number.isFinite(v) ? tlClamp(v, d.min, d.max) : d.def;
  }
  return out;
}

// steady-state picture of the A3 threads for the panel scope
function tlScope(P) {
  const p = tlParams(P);
  const sr = 16000, n = 2400, f0 = 220;
  const ratios = TL_MATERIALS[p.material];
  const out = new Float32Array(n);
  for (let i = 0; i < 6; i++) {
    const ratio = ratios[i] * (1 + p.tension * (i === 0 ? 0 : Math.sin(i * 1.71) * 0.095));
    const f = f0 * ratio;
    if (f > sr * 0.45) continue;
    const g = i === 0 ? 0.8 : (Math.pow(p.bloom, 1 + i * 0.27) * 0.55) / Math.pow(i + 1, 0.72);
    const fmf = f * (1.003 + p.tension * 0.28);
    const beta = (f * (0.002 + p.tension * 0.13) * (i / 6)) / fmf;
    const w = (2 * Math.PI * f) / sr, wm = (2 * Math.PI * fmf) / sr;
    for (let s = 0; s < n; s++) out[s] += g * Math.sin(w * s + beta * Math.sin(wm * s));
  }
  let pk = 1e-6;
  for (let s = 0; s < n; s++) pk = Math.max(pk, Math.abs(out[s]));
  for (let s = 0; s < n; s++) out[s] = (out[s] / pk) * 0.8;
  return out;
}

export const TIDELACE_SYNTHS = {
  tidelace: {
    name: "TIDELACE",
    tagline: "Six harmonic threads woven through a breathing stereo field",
    color: "#efa47a",
    params: TL_PARAMS,

    voice(ctx, dest, note, P) {
      const p = tlParams(P);
      const sr = ctx.sampleRate;
      const t = Number.isFinite(note.time) ? note.time : 0;
      const vel = tlClamp(Number.isFinite(note.vel) ? note.vel : 1, 0, 1.5);
      if (vel < 0.002 || p.level <= 0) return;
      const pitch = tlClamp(Number.isFinite(note.pitch) ? note.pitch : 60, 0, 127);
      const f0 = tlFreq(pitch);
      const d = Math.max(0.02, Number.isFinite(note.dur) ? note.dur : 0.5);
      const off = t + d;
      const Rl = p.release;
      const hard = tlClamp(1 + p.touch * 1.2 * (Math.min(vel, 1.4) - 1), 0.35, 1.5);
      const bloomEff = tlClamp(p.bloom + (hard - 1) * 0.35, 0, 1);
      // unfurl time scales with the gate: a long hold weaves in slowly, a short one is nearly woven
      const U = tlClamp(0.3 + d * 0.9, 0.3, 5);
      const un = p.unfurl;

      const nodes = [];
      const mk = (n) => (nodes.push(n), n);
      const filter = mk(ctx.createBiquadFilter());
      const env = mk(ctx.createGain());
      const out = mk(ctx.createGain());
      const clip = mk(ctx.createWaveShaper());
      clip.curve = tlCurve();
      filter.type = "lowpass";
      filter.Q.value = 0.55;
      filter.connect(env);
      env.connect(out);
      out.connect(clip);
      clip.connect(dest);
      out.gain.value = p.level * TL_OUT;

      // envelope: attack to peak, ease to sustain (tc 0.18 s), release from wherever it is at note-off
      const dryK = 1 - p.space * 0.28;
      const peak = Math.min(vel, 1.5) * dryK;
      const sus = peak * p.sustain;
      const tA = Math.min(t + p.attack, off);
      const vA = peak * ((tA - t) / p.attack);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(vA, tA);
      let vOff = vA;
      if (off > t + p.attack) {
        env.gain.setTargetAtTime(sus, t + p.attack, 0.18);
        vOff = sus + (peak - sus) * Math.exp(-(off - t - p.attack) / 0.18);
        env.gain.setValueAtTime(vOff, off);
      }
      env.gain.linearRampToValueAtTime(0, off + Rl);

      // horizon (low-pass): hard strikes are brighter; the held note opens over the unfurl time
      const fc = Math.min(p.horizon * (0.5 + 0.5 * Math.min(hard, 1.4)), sr * 0.44, 16000);
      const fcLow = Math.max(120, fc * (1 - un * 0.45));
      filter.frequency.setValueAtTime(fcLow, t);
      if (un > 0.01) filter.frequency.setTargetAtTime(fc, t + 0.02, U / 3);
      else filter.frequency.setValueAtTime(fc, t);

      // Space: per-note stereo haze (two panned feedback delays) fed from the enveloped signal
      const hasHaze = p.space > 0.02;
      const FB = 0.38;
      const hazeTap = [0.083, 0.131];
      if (hasHaze) {
        hazeTap.forEach((time, k) => {
          const dl = mk(ctx.createDelay(0.5));
          const fb = mk(ctx.createGain());
          const wet = mk(ctx.createGain());
          const pan = mk(ctx.createStereoPanner());
          dl.delayTime.value = time;
          fb.gain.value = FB;
          wet.gain.value = (p.space * 0.65 * 0.55) / dryK;
          pan.pan.value = k ? 0.85 : -0.85;
          env.connect(dl);
          dl.connect(fb);
          fb.connect(dl);
          dl.connect(wet);
          wet.connect(pan);
          pan.connect(out);
        });
      }

      // the weave: two LFOs at related rates; odd threads ride A (+), even threads ride B (-)
      const lfoA = mk(ctx.createOscillator());
      const lfoB = mk(ctx.createOscillator());
      lfoA.frequency.value = p.tide;
      lfoB.frequency.value = p.tide * 1.29;
      const panDepth = p.weave * 0.4;
      const panA = mk(ctx.createGain());
      const panB = mk(ctx.createGain());
      panA.gain.value = panDepth;
      panB.gain.value = -panDepth;
      lfoA.connect(panA);
      lfoB.connect(panB);
      const sources = [lfoA, lfoB];

      const ratios = TL_MATERIALS[p.material];
      const spreadK = 0.4 + p.weave * 1.2;
      for (let i = 0; i < 6; i++) {
        const ratio = ratios[i] * (1 + p.tension * (i === 0 ? 0 : Math.sin(i * 1.71) * 0.095));
        const freq = Math.min(f0 * ratio, sr * 0.38);
        const audible = f0 * ratio < sr * 0.38;
        const o = mk(ctx.createOscillator());
        const g = mk(ctx.createGain());
        o.type = "sine";
        sources.push(o);
        o.frequency.value = freq;
        const gRest = !audible ? 0 : i === 0 ? 0.8 : (Math.pow(bloomEff, 1 + i * 0.27) * 0.55) / Math.pow(i + 1, 0.72);
        o.connect(g);
        if (i === 0) {
          g.gain.value = gRest;
          g.connect(filter);
          continue;
        }
        // thread i enters in order across the unfurl time (never fully silent: floor of 15%)
        const gLow = gRest * (1 - un * 0.85);
        const s = t + (i / 5) * U * 0.5;
        g.gain.setValueAtTime(gLow, t);
        if (un > 0.01 && gRest > 0) {
          g.gain.setValueAtTime(gLow, s);
          g.gain.linearRampToValueAtTime(gRest, s + U * 0.5);
        } else g.gain.setValueAtTime(gRest, t);

        // FM partner a hair off the carrier: this is the shimmering current. Tension tightens with the hold.
        const fm = mk(ctx.createOscillator());
        const fmGain = mk(ctx.createGain());
        fm.type = "sine";
        sources.push(fm);
        fm.frequency.value = Math.min(freq * (1.003 + p.tension * 0.28), sr * 0.4);
        const fmRest = Math.min(freq * (0.002 + p.tension * 0.13) * (i / 6) * hard, sr * 0.02);
        fmGain.gain.setValueAtTime(fmRest * (1 - un * 0.7), t);
        if (un > 0.01) fmGain.gain.linearRampToValueAtTime(fmRest, t + U);
        fm.connect(fmGain);
        fmGain.connect(o.frequency);

        // static spread + drift detune (cents) + LFO wander
        const sign = i % 2 ? 1 : -1;
        o.detune.value = sign * p.drift * (i / 6);
        const driftGain = mk(ctx.createGain());
        driftGain.gain.value = p.drift * (0.15 + i * 0.09);
        (i % 2 ? lfoA : lfoB).connect(driftGain);
        driftGain.connect(o.detune);

        const pan = mk(ctx.createStereoPanner());
        pan.pan.value = tlClamp(sign * (0.2 + i * 0.08) * spreadK, -1, 1);
        (i % 2 ? panA : panB).connect(pan.pan);
        g.connect(pan);
        pan.connect(filter);
      }

      const stopAt = off + Rl + (hasHaze ? hazeTap[1] * (Math.log(0.001) / Math.log(FB)) + 0.05 : 0.03);
      for (const s of sources) {
        s.start(t);
        s.stop(stopAt);
      }
      lfoA.onended = () => nodes.forEach((n) => { try { n.disconnect(); } catch { /* gone */ } });
    },

    lines: [
      { name: "Estuary", dsl: "0:A3:5:98 6:E4:4:74 12:B4:7:62 20:C4:5:91 26:G4:4:70 32:F3:6:97 38:C4:4:79 44:E4:7:66 52:G3:5:90 58:D4:4:72" },
      { name: "Glass Orchard", dsl: "0:A4:2:94 4:E5:2:67 8:B4:3:82 14:C5:2:75 20:E4:4:91 28:G4:3:69 32:F4:2:96 36:C5:2:71 40:E5:3:78 46:A4:3:84 52:G4:4:88 60:D5:3:64" },
      { name: "Slow Water", dsl: "0:A3:24:80 0:C4:24:67 0:E4:24:63 32:F3:24:77 32:A3:24:65 32:C4:24:62" },
      { name: "Reed Circuit", dsl: "0:A2:2:100 2:A3:1:60 3:E3:1:70 4:A2:2:96 6:C3:1:66 7:E3:1:72 8:F2:2:100 10:F3:1:60 11:C3:1:70 12:F2:2:96 14:G2:1:66 15:A2:1:76 16:A2:2:100 18:A3:1:60 19:E3:1:70 20:A2:2:96 22:C3:1:66 23:E3:1:72 24:D3:2:100 26:D3:1:60 27:A2:1:70 28:G2:2:96 30:B2:2:78" },
    ],

    presets: [
      { name: "Copper Estuary", params: {} },
      { name: "Glass Orchard", params: { material: "glass", bloom: 0.79, tension: 0.18, drift: 4, tide: 0.41, horizon: 8900, attack: 0.01, release: 2.1, space: 0.6, unfurl: 0.1 } },
      { name: "Deep Loom", params: { material: "reed", bloom: 0.35, tension: 0.48, drift: 17, tide: 0.09, horizon: 1250, attack: 1.1, release: 2.8, space: 0.52, unfurl: 0.9, weave: 0.7 } },
      { name: "Tidal Wire", params: { material: "copper", bloom: 0.85, tension: 0.72, drift: 13, tide: 0.83, horizon: 7200, attack: 0.025, release: 0.55, space: 0.23, unfurl: 0.5, touch: 0.8 } },
      { name: "Salt Lantern", params: { material: "glass", bloom: 0.4, tension: 0.07, drift: 6, tide: 0.17, horizon: 2900, attack: 0.42, release: 3.1, space: 0.76, unfurl: 0.6, weave: 0.4 } },
      { name: "Reed Circuit", params: { material: "reed", bloom: 0.68, tension: 0.27, drift: 3, tide: 1.3, horizon: 5100, attack: 0.025, release: 0.25, space: 0.12, unfurl: 0, weave: 0.8, sustain: 0.6 } },
      { name: "Weaver's Dawn", params: { material: "copper", bloom: 0.5, tension: 0.35, drift: 22, tide: 0.12, horizon: 3400, attack: 0.8, release: 3.4, space: 0.55, unfurl: 1, weave: 1, sustain: 0.9 } },
    ],

    ui: {
      theme: { accent: "#efa47a", lcd: "#8de0c8", lcdBg: "#092223", edge: "#24403e", bg: "#102a2a" },
      logo: ["TIDE", "LACE"],
      sub: "HARMONIC CURRENT SYNTH",
      cc: { 74: "horizon", 71: "tension", 1: "bloom", 73: "attack", 72: "release", 75: "unfurl", 76: "weave", 7: "level" },
      sections: [
        {
          title: "HARMONIC MATERIAL",
          items: [
            {
              type: "radio",
              key: "material",
              options: [
                ["copper", "COPPER", '<path d="M2 12Q7 2 12 12T22 12"/>', "0 0 24 24"],
                ["glass", "GLASS", '<path d="M3 18L9 5L15 18L21 5"/>', "0 0 24 24"],
                ["reed", "REED", '<path d="M2 18V6H7V18H12V6H17V18H22"/>', "0 0 24 24"],
              ],
            },
            { type: "viz", id: "scope" },
          ],
        },
        {
          title: "HARMONIC FIELD",
          items: [
            { type: "xy", x: { key: "tension", label: "TENSION", fmt: "pct" }, y: { key: "bloom", label: "BLOOM", fmt: "pct" }, ticks: ["SLACK", "TAUT"] },
            { type: "row", items: [{ type: "knob", key: "drift", label: "DRIFT", fmt: "cents" }, { type: "knob", key: "tide", label: "TIDE", fmt: "hz" }, { type: "knob", key: "weave", label: "WEAVE", fmt: "pct" }] },
          ],
        },
        {
          title: "THE HOLD",
          items: [{ type: "row", items: [{ type: "knob", key: "unfurl", label: "UNFURL", fmt: "pct" }, { type: "knob", key: "touch", label: "TOUCH", fmt: "pct" }, { type: "knob", key: "space", label: "SPACE", fmt: "pct" }] }],
        },
        {
          title: "SHORE",
          items: [
            { type: "knob", key: "horizon", label: "HORIZON", curve: "log", fmt: "hz" },
            { type: "row", items: [{ type: "fader", key: "attack", label: "ATTACK", fmt: "ms" }, { type: "fader", key: "sustain", label: "SUSTAIN", fmt: "pct" }, { type: "fader", key: "release", label: "RELEASE", fmt: "ms" }] },
          ],
        },
        { title: "OUTPUT", items: [{ type: "fader", key: "level", label: "LEVEL", fmt: "pct", rand: false }] },
      ],
      scopeLabel: "CURRENT",
    },

    scope: tlScope,
  },
};
