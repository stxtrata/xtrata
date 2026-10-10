// basic-panels.js — front panels, factory presets and live displays for the five original
// "basic" synths that used to open with no panel: Acidals 303, Stacker, SubZero, FMonad, Chip-8.
//
// Their sound engines are unchanged and live in ../synths.js (params, voice, lines). This module
// only adds what the synth dock needs to show them like the other synths: a `ui` spec (knobs,
// faders, radio buttons — the same spec format synth-panel.js builds jiMS10 and the glass synths
// from), live displays tied to the controls, and a set of presets.
// synths.js merges PANELS into SYNTH_BANK. Everything a control writes is an existing param key,
// so saved projects and the MIDI-roll sliders are unaffected.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const TAU = Math.PI * 2;

// ---- live displays ---------------------------------------------------------------------------
// Drawn by synth-panel.js (drawViz) with its helpers passed in as `kit`; each reads the live params.
const dbOf = (x) => 20 * Math.log10(Math.max(x, 1e-6));
function frame(cv, kit) {
  const [c, W, H, dpr] = kit.sizeCanvas(cv);
  const t = kit.themeOf();
  kit.lcdBackdrop(c, W, H, t);
  return { c, W, H, t, dpr, px: (n) => n * dpr };
}
const label = (g, text, x, y, align = "left") => {
  g.c.fillStyle = `${g.t.lcd}aa`;
  g.c.font = `600 ${Math.round(g.px(8.5))}px "IBM Plex Mono", monospace`;
  g.c.textAlign = align;
  g.c.fillText(text, x, y);
};
// the ADSR shape a synth's voice really uses: numbers are fixed in the voice, strings name a param
function envShape(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const e = synth.ui.env;
  const v = (k, d) => (typeof k === "number" ? k : (P[k] ?? d));
  const A = Math.max(0.002, v(e.a, 0.01)), D = v(e.d, 0.1), S = v(e.s, 0.8), R = v(e.r, 0.2);
  const hold = Math.max(0.15, (A + D + R) * 0.25);
  const total = A + D + hold + R;
  const x = (tt) => 8 + (tt / total) * (g.W - 16);
  const y = (a) => g.H - 10 - a * (g.H - 24);
  const pts = [[0, 0], [A, 1], [A + D, S], [A + D + hold, S], [total, 0]];
  g.c.beginPath();
  pts.forEach(([tt, a], i) => (i ? g.c.lineTo(x(tt), y(a)) : g.c.moveTo(x(tt), y(a))));
  g.c.lineTo(x(total), y(0));
  g.c.fillStyle = `${g.t.accent}29`;
  g.c.fill();
  g.c.beginPath();
  pts.forEach(([tt, a], i) => (i ? g.c.lineTo(x(tt), y(a)) : g.c.moveTo(x(tt), y(a))));
  g.c.strokeStyle = g.t.lcd;
  g.c.lineWidth = g.px(1.6);
  g.c.stroke();
  label(g, "ENV", 6, g.px(11));
}

// low-pass response on a log frequency axis; Web Audio's biquad Q is in dB, so `reso` is the peak height
function filterCurve(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const F0 = 40, F1 = 14000;
  const X = (f) => 6 + (Math.log(f / F0) / Math.log(F1 / F0)) * (g.W - 12);
  const Y = (db) => g.H - 8 - clamp((db + 30) / 54, 0, 1) * (g.H - 22);
  const Q = Math.pow(10, (P.reso ?? 1) / 20);
  const resp = (f, fc) => {
    const r = f / fc;
    return dbOf(1 / Math.sqrt((1 - r * r) ** 2 + (r / Q) ** 2));
  };
  const curve = (fc, stroke, fill) => {
    g.c.beginPath();
    for (let px = 0; px <= g.W - 12; px += 2) {
      const f = F0 * Math.pow(F1 / F0, px / (g.W - 12));
      px ? g.c.lineTo(6 + px, Y(resp(f, fc))) : g.c.moveTo(6 + px, Y(resp(f, fc)));
    }
    g.c.strokeStyle = stroke;
    g.c.lineWidth = g.px(1.6);
    g.c.stroke();
    if (fill) {
      g.c.lineTo(g.W - 6, g.H);
      g.c.lineTo(6, g.H);
      g.c.closePath();
      g.c.fillStyle = fill;
      g.c.fill();
    }
  };
  const fc = P.cutoff;
  if (P.envMod) curve(clamp(fc + P.envMod * 1.6, 60, 14000), `${g.t.accent}77`, null); // where the accent sweep opens to
  curve(fc, g.t.lcd, `${g.t.accent}30`);
  g.c.strokeStyle = `${g.t.accent}66`;
  g.c.setLineDash([g.px(3), g.px(4)]);
  g.c.beginPath();
  g.c.moveTo(X(fc), 4);
  g.c.lineTo(X(fc), g.H - 8);
  g.c.stroke();
  g.c.setLineDash([]);
  [100, 1000, 10000].forEach((f) => label(g, f >= 1000 ? `${f / 1000}k` : `${f}`, X(f), g.H - g.px(1.5), "center"));
  label(g, `${hz(fc)}Hz`, X(fc) + g.px(4), g.px(11));
}
const hz = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`);

function stackSpread(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const n = Math.max(1, Math.round(P.voices));
  const span = 40 * (7 - 1) / 2; // widest possible spread, in cents
  const X = (cents) => g.W / 2 + (cents / (span + 8)) * (g.W / 2 - 10);
  g.c.strokeStyle = `${g.t.accent}33`;
  g.c.beginPath();
  g.c.moveTo(g.W / 2, 4);
  g.c.lineTo(g.W / 2, g.H - 12);
  g.c.stroke();
  for (let v = 0; v < n; v++) {
    const cents = (v - (n - 1) / 2) * P.detune;
    const x = X(cents);
    const h = (g.H - 24) * (1 - Math.abs(cents) / (span * 2.4));
    g.c.fillStyle = g.t.accent;
    g.c.globalAlpha = 0.45;
    g.c.fillRect(x - g.px(5), g.H - 12 - h, g.px(10), h);
    g.c.globalAlpha = 1;
    g.c.fillStyle = g.t.lcd;
    g.c.fillRect(x - g.px(1.2), g.H - 12 - h, g.px(2.4), h);
  }
  label(g, `${n} × SAW`, 6, g.px(11));
  label(g, n > 1 ? `±${Math.round(((n - 1) / 2) * P.detune)}c` : "MONO", g.W - 6, g.px(11), "right");
  label(g, "−", 6, g.H - g.px(1.5));
  label(g, "+", g.W - 6, g.H - g.px(1.5), "right");
}

function driveCurve(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const k = 1 + P.drive * 8;
  const X = (x) => 8 + ((x + 1) / 2) * (g.W - 16);
  const Y = (y) => g.H - 8 - ((y + 1) / 2) * (g.H - 16);
  g.c.strokeStyle = `${g.t.accent}44`;
  g.c.setLineDash([g.px(3), g.px(4)]);
  g.c.beginPath();
  g.c.moveTo(X(-1), Y(-1));
  g.c.lineTo(X(1), Y(1));
  g.c.stroke();
  g.c.setLineDash([]);
  g.c.beginPath();
  for (let i = 0; i <= 64; i++) {
    const x = i / 32 - 1;
    const y = P.drive > 0 ? Math.tanh(x * k) / Math.tanh(k) : x;
    i ? g.c.lineTo(X(x), Y(y)) : g.c.moveTo(X(x), Y(y));
  }
  g.c.strokeStyle = g.t.lcd;
  g.c.lineWidth = g.px(1.8);
  g.c.stroke();
  label(g, "DRIVE CURVE", 6, g.px(11));
}

function pitchSnap(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const T = 0.16, dur = Math.max(0.005, P.glideUp);
  const X = (t) => 8 + (t / T) * (g.W - 16);
  const Y = (r) => g.H - 10 - ((Math.log(r) / Math.log(1.6)) * (g.H - 28)) ;
  g.c.beginPath();
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * T;
    const r = t >= dur ? 1 : 1.6 * Math.pow(1 / 1.6, t / dur); // exponential ramp, as in the voice
    i ? g.c.lineTo(X(t), Y(r)) : g.c.moveTo(X(t), Y(r));
  }
  g.c.strokeStyle = g.t.lcd;
  g.c.lineWidth = g.px(1.8);
  g.c.stroke();
  g.c.lineTo(X(T), g.H);
  g.c.lineTo(X(0), g.H);
  g.c.closePath();
  g.c.fillStyle = `${g.t.accent}26`;
  g.c.fill();
  label(g, "PITCH SNAP", 6, g.px(11));
  label(g, `${Math.round(dur * 1000)}ms`, g.W - 6, g.px(11), "right");
}

// Bessel J_n(beta) by series — the amplitude of the n-th sideband of a sine FM pair
function besselJ(n, b) {
  n = Math.abs(n);
  let term = Math.pow(b / 2, n) / [...Array(n)].reduce((a, _, i) => a * (i + 1), 1);
  let sum = term;
  for (let m = 1; m < 40; m++) {
    term *= -((b / 2) ** 2) / (m * (m + n));
    sum += term;
  }
  return sum;
}
function fmSpectrum(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const beta = clamp(P.index / (110 * P.ratio), 0, 12); // index measured at A2
  const reach = Math.max(4, Math.min(6, Math.ceil(beta) + 3));
  const step = (g.W / 2 - 14) / Math.max(reach, 4);
  const sp = Math.min(step, (g.W / 2 - 14) / (reach * 1)) ;
  g.c.strokeStyle = `${g.t.accent}33`;
  g.c.beginPath();
  g.c.moveTo(6, g.H - 12);
  g.c.lineTo(g.W - 6, g.H - 12);
  g.c.stroke();
  for (let n = -reach; n <= reach; n++) {
    const a = Math.abs(besselJ(n, beta));
    const x = g.W / 2 + n * sp;
    const h = Math.min(1, a) * (g.H - 26);
    g.c.fillStyle = n === 0 ? g.t.lcd : g.t.accent;
    g.c.globalAlpha = n === 0 ? 1 : 0.85;
    g.c.fillRect(x - g.px(2.2), g.H - 12 - h, g.px(4.4), Math.max(g.px(1), h));
  }
  g.c.globalAlpha = 1;
  label(g, `SIDEBANDS · ×${P.ratio} · β ${beta.toFixed(1)}`, 6, g.px(11));
}

function modEnv(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const T = 2.2;
  const X = (t) => 8 + (t / T) * (g.W - 16);
  g.c.beginPath();
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * T;
    const l = t >= P.modDecay ? 0 : Math.pow(0.01 / Math.max(P.index, 1), t / P.modDecay);
    const y = g.H - 10 - clamp(P.index / 1000, 0.05, 1) * l * (g.H - 26);
    i ? g.c.lineTo(X(t), y) : g.c.moveTo(X(t), y);
  }
  g.c.strokeStyle = g.t.lcd;
  g.c.lineWidth = g.px(1.8);
  g.c.stroke();
  g.c.lineTo(X(T), g.H);
  g.c.lineTo(X(0), g.H);
  g.c.closePath();
  g.c.fillStyle = `${g.t.accent}26`;
  g.c.fill();
  label(g, "BRIGHTNESS", 6, g.px(11));
  label(g, `${P.modDecay >= 1 ? P.modDecay.toFixed(1) + "s" : Math.round(P.modDecay * 1000) + "ms"}`, g.W - 6, g.px(11), "right");
}

function vibrato(cv, P, synth, kit) {
  const g = frame(cv, kit);
  const cycles = 0.6 + (P.vibRate / 12) * 5;
  const amp = (P.vibDepth / 50) * (g.H / 2 - 12);
  const step = Math.max(2, Math.round(g.px(3))); // chunky, like the chip it imitates
  g.c.strokeStyle = `${g.t.accent}44`;
  g.c.beginPath();
  g.c.moveTo(0, g.H / 2);
  g.c.lineTo(g.W, g.H / 2);
  g.c.stroke();
  g.c.fillStyle = g.t.lcd;
  for (let px = 0; px < g.W; px += step) {
    const y = g.H / 2 - Math.sin((px / g.W) * cycles * TAU) * amp;
    g.c.fillRect(px, Math.round(y / step) * step, step - 1, step - 1);
  }
  label(g, `${P.vibRate.toFixed(1)}Hz`, 6, g.px(11));
  label(g, `±${Math.round(P.vibDepth)}c`, g.W - 6, g.px(11), "right");
}

// ---- panel layout helpers ------------------------------------------------------------------
const knob = (key, label, fmt, extra = {}) => ({ type: "knob", key, label, fmt, ...extra });
const fader = (key, label, fmt, extra = {}) => ({ type: "fader", key, label, fmt, ...extra });
const row = (...items) => ({ type: "row", items });
const SVG = {
  saw: '<path d="M3 18 L12 6 V18 L21 6" fill="none" stroke="currentColor" stroke-width="2"/>',
  sqr: '<path d="M3 18 V6 H12 V18 H21 V6" fill="none" stroke="currentColor" stroke-width="2"/>',
  sin: '<path d="M3 12 C6 2 9 2 12 12 S18 22 21 12" fill="none" stroke="currentColor" stroke-width="2"/>',
  tri: '<path d="M3 18 L8 6 L16 18 L21 6" fill="none" stroke="currentColor" stroke-width="2"/>',
};

// ---- the five panels -------------------------------------------------------------------------
// `viz` — the live displays a panel uses; `ui.env` — the envelope its voice really has (a number
// is fixed inside the voice, a string names the param that sets it).
const vizItem = (id, cls = "") => ({ type: "viz", id, cls });
const PANELS = {
  acidals: {
    viz: { filter: filterCurve, env: envShape },
    presets: [
      { name: "Classic 303", params: { wave: "sawtooth", cutoff: 500, reso: 18, envMod: 1800, decay: 0.25 } },
      { name: "Squelchy", params: { wave: "sawtooth", cutoff: 300, reso: 26, envMod: 3000, decay: 0.18 } },
      { name: "Square Bleep", params: { wave: "square", cutoff: 700, reso: 12, envMod: 1200, decay: 0.2 } },
      { name: "Dub Acid", params: { wave: "sawtooth", cutoff: 200, reso: 22, envMod: 2400, decay: 0.5 } },
      { name: "Fat Roll", params: { wave: "sawtooth", cutoff: 900, reso: 8, envMod: 800, decay: 0.12 } },
      { name: "Screamer", params: { wave: "sawtooth", cutoff: 1400, reso: 29, envMod: 3800, decay: 0.3 } },
    ],
    ui: {
      theme: { accent: "#feca57", lcd: "#ffe08a", lcdBg: "#1a1405", edge: "#4a3d1c", bg: "#1c1710" },
      logo: ["", "ACIDALS"],
      sub: "BASS LINE · 303",
      env: { a: 0.003, d: "decay", s: 0.25, r: 0.08 },
      cc: { 74: "cutoff", 71: "reso", 12: "envMod", 75: "decay" },
      sections: [
        {
          title: "OSCILLATOR",
          cls: "bp-narrow",
          items: [
            {
              type: "radio",
              key: "wave",
              cls: "wave-btns",
              options: [
                ["sawtooth", "SAW", SVG.saw],
                ["square", "SQR", SVG.sqr],
              ],
            },
          ],
        },
        {
          title: "FILTER",
          items: [
            vizItem("filter"),
            row(
              knob("cutoff", "CUTOFF", "hz", { curve: "log", big: true }),
              knob("reso", "RESO", "num1", { big: true }),
              knob("envMod", "ENV MOD", "hz", { big: true }),
            ),
          ],
        },
        { title: "ACCENT DECAY", items: [vizItem("env"), row(fader("decay", "DECAY", "ms"))] },
      ],
    },
  },

  stacker: {
    viz: { spread: stackSpread, filter: filterCurve, env: envShape },
    presets: [
      { name: "Rave Stab", params: { voices: 7, detune: 22, cutoff: 6500, attack: 0.005, release: 0.25 } },
      { name: "Trance Pad", params: { voices: 5, detune: 14, cutoff: 4500, attack: 0.4, release: 1.8 } },
      { name: "Hoover Dark", params: { voices: 7, detune: 38, cutoff: 1800, attack: 0.05, release: 0.9 } },
      { name: "Supersoft", params: { voices: 3, detune: 8, cutoff: 2500, attack: 0.6, release: 2.5 } },
      { name: "Anthem Lead", params: { voices: 7, detune: 18, cutoff: 9000, attack: 0.01, release: 0.5 } },
      { name: "Mono Saw", params: { voices: 1, detune: 0, cutoff: 3000, attack: 0.01, release: 0.2 } },
    ],
    ui: {
      theme: { accent: "#c084fc", lcd: "#e4c6ff", lcdBg: "#150d1f", edge: "#3f2d57", bg: "#1b1326" },
      logo: ["", "STACKER"],
      sub: "SUPERSAW STACK",
      env: { a: "attack", d: 0.2, s: 0.8, r: "release" },
      cc: { 74: "cutoff", 71: "detune", 73: "attack", 72: "release" },
      sections: [
        {
          title: "STACK",
          items: [vizItem("spread"), row(knob("voices", "VOICES", "int", { big: true }), knob("detune", "DETUNE", "cents", { big: true }))],
        },
        { title: "FILTER", items: [vizItem("filter"), row(knob("cutoff", "CUTOFF", "hz", { curve: "log", big: true }))] },
        {
          title: "ENVELOPE",
          items: [vizItem("env"), row(fader("attack", "ATTACK", "ms"), fader("release", "RELEASE", "ms"))],
        },
      ],
    },
  },

  subzero: {
    viz: { drive: driveCurve, snap: pitchSnap, env: envShape },
    presets: [
      { name: "808 Classic", params: { wave: "sine", drive: 0.25, glideUp: 0.04, release: 0.4 } },
      { name: "Heavy Drive", params: { wave: "sine", drive: 0.8, glideUp: 0.06, release: 0.5 } },
      { name: "Pure Sub", params: { wave: "sine", drive: 0, glideUp: 0.005, release: 0.6 } },
      { name: "Tri Growl", params: { wave: "triangle", drive: 0.55, glideUp: 0.03, release: 0.35 } },
      { name: "Long 808", params: { wave: "sine", drive: 0.35, glideUp: 0.05, release: 1.6 } },
      { name: "Clicky Kick Bass", params: { wave: "triangle", drive: 0.2, glideUp: 0.12, release: 0.15 } },
    ],
    ui: {
      theme: { accent: "#54a0ff", lcd: "#b5d6ff", lcdBg: "#07111f", edge: "#25405f", bg: "#0d1724" },
      logo: ["", "SUBZERO"],
      sub: "SUB BASS · 808",
      env: { a: 0.004, d: 0.1, s: 0.9, r: "release" },
      cc: { 74: "drive", 75: "glideUp", 72: "release" },
      sections: [
        {
          title: "OSCILLATOR",
          cls: "bp-narrow",
          items: [
            {
              type: "radio",
              key: "wave",
              cls: "wave-btns",
              options: [
                ["sine", "SINE", SVG.sin],
                ["triangle", "TRI", SVG.tri],
              ],
            },
          ],
        },
        {
          title: "TONE",
          items: [
            row(vizItem("drive"), knob("drive", "DRIVE", "pct", { big: true })),
            row(vizItem("snap"), knob("glideUp", "PITCH SNAP", "ms", { big: true })),
          ],
        },
        { title: "ENVELOPE", items: [vizItem("env"), row(fader("release", "RELEASE", "ms"))] },
      ],
    },
  },

  fmonad: {
    viz: { spectrum: fmSpectrum, modenv: modEnv, env: envShape },
    presets: [
      { name: "Glass Bell", params: { ratio: 3.5, index: 600, modDecay: 1.2, attack: 0.002, release: 2 } },
      { name: "Electric Piano", params: { ratio: 1, index: 250, modDecay: 0.6, attack: 0.002, release: 0.8 } },
      { name: "Metal Pluck", params: { ratio: 5, index: 800, modDecay: 0.15, attack: 0.002, release: 0.5 } },
      { name: "Soft Bell", params: { ratio: 2, index: 150, modDecay: 0.8, attack: 0.005, release: 1.6 } },
      { name: "Clav", params: { ratio: 3, index: 400, modDecay: 0.1, attack: 0.002, release: 0.25 } },
      { name: "Hollow Pad", params: { ratio: 1.5, index: 350, modDecay: 1.6, attack: 0.25, release: 1.8 } },
    ],
    ui: {
      theme: { accent: "#22d3ee", lcd: "#a8f0fb", lcdBg: "#06171b", edge: "#1f4a54", bg: "#0b1a1f" },
      logo: ["", "FMONAD"],
      sub: "2-OPERATOR FM",
      env: { a: "attack", d: 0.1, s: 0.5, r: "release" },
      cc: { 74: "index", 71: "ratio", 75: "modDecay", 72: "release" },
      sections: [
        {
          title: "OPERATORS",
          items: [vizItem("spectrum"), row(knob("ratio", "RATIO", "ratio", { big: true }), knob("index", "INDEX", "int", { big: true }))],
        },
        { title: "BRIGHTNESS DECAY", items: [vizItem("modenv"), row(knob("modDecay", "MOD DECAY", "ms", { big: true }))] },
        {
          title: "AMP ENVELOPE",
          items: [vizItem("env"), row(fader("attack", "ATTACK", "ms"), fader("release", "RELEASE", "ms"))],
        },
      ],
    },
  },

  chip8: {
    viz: { vibrato, env: envShape },
    presets: [
      { name: "Hero Lead", params: { width: 0.25, vibRate: 5, vibDepth: 12, decay: 0.3 } },
      { name: "Hollow", params: { width: 0.5, vibRate: 0, vibDepth: 0, decay: 0.5 } },
      { name: "Wobble", params: { width: 0.15, vibRate: 8, vibDepth: 35, decay: 0.4 } },
      { name: "Pluck Arp", params: { width: 0.3, vibRate: 0, vibDepth: 0, decay: 0.08 } },
      { name: "Coin", params: { width: 0.4, vibRate: 11, vibDepth: 5, decay: 0.12 } },
      { name: "Siren", params: { width: 0.2, vibRate: 6, vibDepth: 50, decay: 0.8 } },
    ],
    ui: {
      theme: { accent: "#fb7185", lcd: "#fecdd3", lcdBg: "#1f0b10", edge: "#5a2530", bg: "#22121a" },
      logo: ["", "CHIP-8"],
      sub: "PWM CHIPTUNE",
      env: { a: 0.002, d: "decay", s: 0.4, r: 0.08 },
      cc: { 74: "width", 76: "vibRate", 77: "vibDepth", 75: "decay" },
      sections: [
        { title: "PULSE", cls: "bp-narrow", items: [row(knob("width", "WIDTH", "pct", { big: true }))] },
        {
          title: "VIBRATO",
          items: [vizItem("vibrato"), row(knob("vibRate", "RATE", "num1", { big: true }), knob("vibDepth", "DEPTH", "cents", { big: true }))],
        },
        { title: "ENVELOPE", items: [vizItem("env"), row(fader("decay", "DECAY", "ms"))] },
      ],
    },
  },
};

export const BASIC_PANELS = PANELS;
