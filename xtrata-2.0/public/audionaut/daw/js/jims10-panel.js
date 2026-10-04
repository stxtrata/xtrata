// jims10-panel.js — hardware-style front panel for the jiMS10 mono synth.
// Rotary pots + vertical faders drive the same `instrument.params` object the
// MIDI-roll slider grid uses, so both views stay in sync and everything saves with
// the project. While the panel is open you can also play it: on-screen keys,
// computer keys (A–L, Z/X octave) and Web MIDI notes; MIDI CC knobs can be
// controlled/learned too.

import { store } from "./state.js";
import { engine, emitNoteVisual } from "./engine.js";
import { SYNTH_BANK, synthDefaults } from "./synths.js";

const $ = (s) => document.querySelector(s);
const SYNTH_ID = "jims10";
const NOTE_LEN = 0.45; // seconds — voices are one-shot, so notes get a fixed gate
const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14 };
const BLACK = new Set([1, 3, 6, 8, 10]);
const DEFAULT_CC = { 74: "cutoff", 71: "reso", 73: "attack", 72: "release", 75: "decay", 76: "sub", 77: "fenv", 7: "level" };
const WAVES = [
  ["sawtooth", "SAW", "M2 18 L12 6 L12 18 L22 6 L22 18"],
  ["square", "SQR", "M2 18 L2 6 L12 6 L12 18 L22 18 L22 6"],
  ["triangle", "TRI", "M2 18 L8 6 L16 18 L22 8"],
];

// Control layout. `curve:"log"` makes the knob feel musical across 100 Hz–10 kHz.
const KNOBS = {
  sub: { label: "SUB", fmt: (v) => `${Math.round(v * 100)}%` },
  tune: { label: "TUNE", fmt: (v) => `${v > 0 ? "+" : ""}${Math.round(v)}c`, center: true },
  cutoff: { label: "CUTOFF", curve: "log", fmt: (v) => (v >= 1000 ? `${(v / 1000).toFixed(2)}k` : `${Math.round(v)}`) , big: true },
  reso: { label: "RESO", fmt: (v) => v.toFixed(1), big: true },
  fenv: { label: "EG INT", fmt: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`) },
  fdecay: { label: "EG DEC", fmt: (v) => `${Math.round(v * 1000)}ms` },
};
const FADERS = {
  attack: { label: "A", name: "Attack", fmt: (v) => `${Math.round(v * 1000)}ms` },
  decay: { label: "D", name: "Decay", fmt: (v) => `${Math.round(v * 1000)}ms` },
  sustain: { label: "S", name: "Sustain", fmt: (v) => `${Math.round(v * 100)}%` },
  release: { label: "R", name: "Release", fmt: (v) => `${Math.round(v * 1000)}ms` },
  level: { label: "LEVEL", name: "Output level", fmt: (v) => `${Math.round(v * 100)}%`, wide: true },
};

let inst = 0;
let root = null;
let schema = {};
const widgets = {}; // key -> { set(v) }
let baseOctave = 3;
let learn = false;
let learnTarget = null;
let ccMap = loadCcMap();
let midiAccess = null;
let selfWrite = false;
const lit = new Map(); // pitch -> count of sources currently sounding it
const heldTyped = new Map(); // typed key -> pitch

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function loadCcMap() {
  try {
    const raw = localStorage.getItem("audionaut.jims10.cc");
    if (raw) return { ...DEFAULT_CC, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable — defaults only */
  }
  return { ...DEFAULT_CC };
}
function saveCcMap() {
  try {
    localStorage.setItem("audionaut.jims10.cc", JSON.stringify(ccMap));
  } catch {
    /* ignore */
  }
}

// ------------------------------------------------------------ param plumbing
function current() {
  return { ...synthDefaults(SYNTH_ID), ...(store.instrument(inst).params || {}) };
}
function writeParam(key, v) {
  selfWrite = true;
  store.setInstrumentProp(inst, "params", { ...current(), [key]: v });
  selfWrite = false;
}
const toNorm = (p, v, curve) => {
  if (curve === "log") return Math.log(v / p.min) / Math.log(p.max / p.min);
  return (v - p.min) / (p.max - p.min);
};
const fromNorm = (p, n, curve) => {
  n = clamp(n, 0, 1);
  let v = curve === "log" ? p.min * Math.pow(p.max / p.min, n) : p.min + n * (p.max - p.min);
  v = Math.round(v / p.step) * p.step;
  return +clamp(v, p.min, p.max).toFixed(4);
};

// A shared interaction layer for knobs + faders: drag, wheel, keys, dblclick reset.
function wire(elm, key, cfg, { vertical }) {
  const p = schema[key];
  const view = (v) => {
    const n = toNorm(p, v, cfg.curve);
    elm.setAttribute("aria-valuenow", v);
    elm.setAttribute("aria-valuetext", cfg.fmt(v));
    return n;
  };
  const set = (v, silent) => {
    v = clamp(v, p.min, p.max);
    const n = view(v);
    elm._paint(n, v);
    if (!silent) {
      writeParam(key, v);
      drawEnv();
    }
  };
  let startY = 0, startN = 0, dragging = false;
  elm.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    elm.focus();
    if (learn) return armLearn(key, elm);
    dragging = true;
    elm.setPointerCapture(e.pointerId);
    elm.classList.add("drag");
    startY = e.clientY;
    if (vertical) {
      // faders jump to the pointer, then drag
      const r = elm.querySelector(".fader-track").getBoundingClientRect();
      startN = clamp(1 - (e.clientY - r.top) / r.height, 0, 1);
      set(fromNorm(p, startN, cfg.curve));
    } else startN = toNorm(p, current()[key], cfg.curve);
  });
  elm.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (vertical) {
      const r = elm.querySelector(".fader-track").getBoundingClientRect();
      set(fromNorm(p, 1 - (e.clientY - r.top) / r.height, cfg.curve));
    } else {
      const span = e.shiftKey ? 640 : 160; // px for a full sweep (Shift = fine)
      set(fromNorm(p, startN + (startY - e.clientY) / span, cfg.curve));
    }
  });
  const end = () => {
    dragging = false;
    elm.classList.remove("drag");
  };
  elm.addEventListener("pointerup", end);
  elm.addEventListener("pointercancel", end);
  elm.addEventListener("dblclick", () => set(p.def));
  elm.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const n = toNorm(p, current()[key], cfg.curve);
      const step = e.shiftKey ? 0.004 : 0.02;
      set(fromNorm(p, n + (e.deltaY < 0 ? step : -step), cfg.curve));
    },
    { passive: false },
  );
  elm.addEventListener("keydown", (e) => {
    const dir = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
    if (e.key === "Home") return (e.preventDefault(), set(p.min));
    if (e.key === "End") return (e.preventDefault(), set(p.max));
    if (e.key === "Enter") {
      // audition with the current sound
      e.preventDefault();
      return play(48 + (baseOctave - 3) * 12);
    }
    if (!dir) return;
    e.preventDefault();
    e.stopPropagation();
    const n = toNorm(p, current()[key], cfg.curve);
    set(fromNorm(p, n + dir * (e.shiftKey ? 0.1 : 0.02), cfg.curve));
  });
  widgets[key] = { set: (v) => set(v, true), el: elm, cfg };
  return set;
}

const ARC = { start: 135, sweep: 270 };
const polar = (cx, cy, r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
const arcPath = (cx, cy, r, a0, a1) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

function makeKnob(key) {
  const cfg = KNOBS[key];
  const p = schema[key];
  const wrap = document.createElement("div");
  wrap.className = `knob-wrap${cfg.big ? " big" : ""}`;
  const k = document.createElement("div");
  k.className = "knob";
  k.tabIndex = 0;
  k.setAttribute("role", "slider");
  k.setAttribute("aria-label", p.label);
  k.setAttribute("aria-valuemin", p.min);
  k.setAttribute("aria-valuemax", p.max);
  k.dataset.key = key;
  k.title = `${p.label} — drag up/down · wheel · Shift = fine · double-click = reset`;
  k.innerHTML = `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path class="k-track" d="${arcPath(32, 32, 27, ARC.start, ARC.start + ARC.sweep)}"/>
      <path class="k-fill" d=""/>
      <circle class="k-cap" cx="32" cy="32" r="19"/>
      <line class="k-ptr" x1="32" y1="32" x2="32" y2="17"/>
    </svg>`;
  const fill = k.querySelector(".k-fill");
  const ptr = k.querySelector(".k-ptr");
  const read = document.createElement("div");
  read.className = "knob-read";
  k._paint = (n, v) => {
    const ang = ARC.start + n * ARC.sweep;
    ptr.setAttribute("transform", `rotate(${ang} 32 32)`);
    const from = cfg.center ? ARC.start + 0.5 * ARC.sweep : ARC.start;
    const a0 = Math.min(from, ang), a1 = Math.max(from, ang);
    fill.setAttribute("d", a1 - a0 < 0.5 ? "" : arcPath(32, 32, 27, a0, a1));
    read.textContent = cfg.fmt(v);
  };
  const lab = document.createElement("div");
  lab.className = "knob-label";
  lab.textContent = cfg.label;
  wrap.append(k, lab, read);
  wire(k, key, cfg, { vertical: false });
  return wrap;
}

function makeFader(key) {
  const cfg = FADERS[key];
  const p = schema[key];
  const wrap = document.createElement("div");
  wrap.className = `fader-wrap${cfg.wide ? " wide" : ""}`;
  const f = document.createElement("div");
  f.className = "fader";
  f.tabIndex = 0;
  f.setAttribute("role", "slider");
  f.setAttribute("aria-orientation", "vertical");
  f.setAttribute("aria-label", p.label);
  f.setAttribute("aria-valuemin", p.min);
  f.setAttribute("aria-valuemax", p.max);
  f.dataset.key = key;
  f.title = `${cfg.name} — drag · wheel · Shift = fine · double-click = reset`;
  f.innerHTML = `<div class="fader-track"><div class="fader-fill"></div><div class="fader-thumb"></div></div>`;
  const fill = f.querySelector(".fader-fill");
  const thumb = f.querySelector(".fader-thumb");
  const read = document.createElement("div");
  read.className = "knob-read";
  f._paint = (n, v) => {
    fill.style.height = `${n * 100}%`;
    thumb.style.bottom = `${n * 100}%`;
    read.textContent = cfg.fmt(v);
  };
  const lab = document.createElement("div");
  lab.className = "knob-label";
  lab.textContent = cfg.label;
  wrap.append(f, lab, read);
  wire(f, key, cfg, { vertical: true });
  return wrap;
}

// ------------------------------------------------------------ envelope scope
function drawEnv() {
  const cv = $("#js-env");
  if (!cv) return;
  const c = cv.getContext("2d");
  const W = cv.width, H = cv.height;
  const P = current();
  c.clearRect(0, 0, W, H);
  c.fillStyle = "#06130c";
  c.fillRect(0, 0, W, H);
  c.strokeStyle = "rgba(67,255,164,.12)";
  c.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    c.beginPath();
    c.moveTo(0, (H * i) / 4);
    c.lineTo(W, (H * i) / 4);
    c.stroke();
  }
  const hold = 0.35; // gate-held time shown between decay and release
  const total = P.attack + P.decay + hold + P.release;
  const x = (t) => 6 + (t / total) * (W - 12);
  const y = (a) => H - 6 - a * (H - 14);
  const pts = [
    [0, 0],
    [P.attack, 1],
    [P.attack + P.decay, P.sustain],
    [P.attack + P.decay + hold, P.sustain],
    [total, 0],
  ];
  c.beginPath();
  pts.forEach(([t, a], i) => (i ? c.lineTo(x(t), y(a)) : c.moveTo(x(t), y(a))));
  c.lineTo(x(total), y(0));
  c.closePath();
  c.fillStyle = "rgba(46,219,132,.16)";
  c.fill();
  c.beginPath();
  pts.forEach(([t, a], i) => (i ? c.lineTo(x(t), y(a)) : c.moveTo(x(t), y(a))));
  c.strokeStyle = "#43ffa4";
  c.lineWidth = 2;
  c.stroke();
}

// ------------------------------------------------------------ build panel
function build() {
  const synth = SYNTH_BANK[SYNTH_ID];
  schema = Object.fromEntries(synth.params.map((p) => [p.key, p]));
  root.innerHTML = `
    <div class="js-head">
      <div class="js-logo">ji<b>MS10</b></div>
      <div class="js-sub">MONOPHONIC SYNTHESIZER<span id="js-inst"></span></div>
      <div class="js-head-btns">
        <button id="js-midi" class="js-btn" title="Play with a MIDI keyboard / controller while this panel is open"><i class="led"></i>MIDI IN</button>
        <button id="js-learn" class="js-btn" title="MIDI learn: click a control, then move a knob/fader on your controller"><i class="led"></i>LEARN</button>
        <button id="js-fx" class="js-btn" title="Filter / drive / delay / reverb for this synth">FX</button>
        <button id="js-ins" class="js-btn" title="Insert plugins: EQ, compressor, chorus, phaser…">INSERTS</button>
        <button id="js-rand" class="js-btn" title="Randomise the sound">RANDOM</button>
        <button id="js-init" class="js-btn" title="Reset every control to its default">INIT</button>
        <button id="js-close" class="js-btn primary">DONE</button>
      </div>
    </div>
    <div class="js-body">
      <section class="js-sec js-osc"><h3>OSCILLATOR</h3>
        <div class="js-waves" role="radiogroup" aria-label="Waveform"></div>
        <div class="js-row" id="js-osc-knobs"></div>
      </section>
      <section class="js-sec js-filter"><h3>FILTER</h3>
        <div class="js-row" id="js-filter-knobs"></div>
      </section>
      <section class="js-sec js-env"><h3>AMP ENVELOPE</h3>
        <div class="js-row" id="js-env-faders"></div>
      </section>
      <section class="js-sec js-out"><h3>OUTPUT</h3>
        <div class="js-row" id="js-out-faders"></div>
      </section>
    </div>
    <div class="js-keys-bar">
      <div class="js-oct"><button id="js-oct-dn" class="js-btn" title="Octave down (Z)">−</button><span id="js-oct-lbl"></span><button id="js-oct-up" class="js-btn" title="Octave up (X)">+</button></div>
      <div id="js-keys" class="js-keys" aria-label="Test keyboard"></div>
      <div class="js-scope"><span>AMP ENV</span><canvas id="js-env" width="320" height="74" aria-label="Envelope shape"></canvas></div>
    </div>
    <div id="js-status" class="js-status"></div>`;

  const waves = root.querySelector(".js-waves");
  WAVES.forEach(([id, lab, path]) => {
    const b = document.createElement("button");
    b.className = "js-wave";
    b.dataset.wave = id;
    b.setAttribute("role", "radio");
    b.title = `${id} wave`;
    b.innerHTML = `<i class="led"></i><svg viewBox="0 0 24 24"><path d="${path}"/></svg><span>${lab}</span>`;
    b.addEventListener("click", () => {
      if (learn) return setStatus("Waveform can't be MIDI-learned — pick a knob or fader.");
      writeParam("wave", id);
      paintWave();
    });
    waves.appendChild(b);
  });

  ["sub", "tune"].forEach((k) => $("#js-osc-knobs").appendChild(makeKnob(k)));
  ["cutoff", "reso", "fenv", "fdecay"].forEach((k) => $("#js-filter-knobs").appendChild(makeKnob(k)));
  ["attack", "decay", "sustain", "release"].forEach((k) => $("#js-env-faders").appendChild(makeFader(k)));
  $("#js-out-faders").appendChild(makeFader("level"));

  const keys = $("#js-keys");
  for (let i = 0; i < 25; i++) {
    const k = document.createElement("button");
    k.className = `js-key${BLACK.has(i % 12) ? " blk" : ""}`;
    k.dataset.i = i;
    k.tabIndex = -1;
    let down = null;
    k.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      down = baseOctave * 12 + 12 + i;
      play(down, 1);
      emitNoteVisual(inst, down, true); // lit while the mouse is held
    });
    const up = () => {
      if (down == null) return;
      emitNoteVisual(inst, down, false);
      down = null;
    };
    k.addEventListener("pointerup", up);
    k.addEventListener("pointerleave", up);
    k.addEventListener("pointercancel", up);
    keys.appendChild(k);
  }
  // black keys sit between whites: lay out with grid-style offsets
  layoutKeys();

  $("#js-close").addEventListener("click", closeSynthPanel);
  $("#js-init").addEventListener("click", () => {
    store.setInstrumentProp(inst, "params", null);
    syncAll();
    setStatus("Reset to the default jiMS10 patch.");
  });
  $("#js-rand").addEventListener("click", randomise);
  $("#js-midi").addEventListener("click", toggleMidi);
  $("#js-fx").addEventListener("click", () =>
    document.dispatchEvent(new CustomEvent("open-inst-fx", { detail: inst })),
  );
  $("#js-ins").addEventListener("click", () =>
    document.dispatchEvent(new CustomEvent("open-inst-inserts", { detail: inst })),
  );
  $("#js-learn").addEventListener("click", () => {
    learn = !learn;
    learnTarget = null;
    $("#js-learn").classList.toggle("on", learn);
    root.classList.toggle("learning", learn);
    setStatus(
      learn
        ? "LEARN: click a knob or fader, then move a control on your MIDI device to bind it."
        : "Learn mode off.",
    );
    if (learn && !midiAccess) toggleMidi();
  });
  $("#js-oct-dn").addEventListener("click", () => shiftOctave(-1));
  $("#js-oct-up").addEventListener("click", () => shiftOctave(1));
}

function layoutKeys() {
  const keys = [...$("#js-keys").children];
  let white = 0;
  keys.forEach((k, i) => {
    if (BLACK.has(i % 12)) k.style.left = `calc(${white} * var(--wk) - var(--wk) * .3)`;
    else {
      k.style.left = `calc(${white} * var(--wk))`;
      white++;
    }
  });
  $("#js-keys").style.setProperty("--whites", white);
}

function paintWave() {
  const w = current().wave;
  root.querySelectorAll(".js-wave").forEach((b) => {
    const on = b.dataset.wave === w;
    b.classList.toggle("on", on);
    b.setAttribute("aria-checked", on);
  });
}

function syncAll() {
  const P = current();
  Object.entries(widgets).forEach(([k, w]) => w.set(P[k]));
  paintWave();
  drawEnv();
  $("#js-oct-lbl").textContent = `C${baseOctave}`;
  $("#js-inst").textContent = ` · ${store.instrument(inst).name}`;
}

function randomise() {
  const P = current();
  const r = (k, lo = 0, hi = 1, curve) => {
    const p = schema[k];
    return fromNorm(p, lo + Math.random() * (hi - lo), curve);
  };
  P.wave = WAVES[Math.floor(Math.random() * 3)][0];
  P.cutoff = r("cutoff", 0.15, 0.85, "log");
  P.reso = r("reso", 0, 0.6);
  P.sub = r("sub", 0, 0.8);
  P.fenv = Math.random() < 0.5 ? 0 : r("fenv", 0.1, 0.7);
  P.fdecay = r("fdecay", 0.05, 0.5);
  P.attack = r("attack", 0, 0.12);
  P.decay = r("decay", 0.03, 0.35);
  P.sustain = r("sustain", 0.2, 1);
  P.release = r("release", 0.03, 0.4);
  selfWrite = true;
  store.setInstrumentProp(inst, "params", P);
  selfWrite = false;
  syncAll();
  play(48 + (baseOctave - 3) * 12);
  setStatus("Randomised — tweak to taste (Undo isn't tracked for panel moves; INIT resets).");
}

// ------------------------------------------------------------ playing
function play(pitch, vel = 1) {
  engine.ensureContext();
  engine.triggerNote(inst, pitch, vel, 0, NOTE_LEN);
}
// Light every key that is sounding: held (typed / mouse / MIDI) or playing back.
function paintKeys() {
  const keys = $("#js-keys")?.children;
  if (!keys) return;
  const lo = baseOctave * 12 + 12;
  for (let i = 0; i < keys.length; i++) keys[i].classList.toggle("on", lit.has(lo + i));
  // a lit note outside the visible range lights the octave arrows instead
  let below = false, above = false;
  for (const p of lit.keys()) {
    if (p < lo) below = true;
    else if (p >= lo + keys.length) above = true;
  }
  $("#js-oct-dn")?.classList.toggle("lit", below);
  $("#js-oct-up")?.classList.toggle("lit", above);
}
function setLit(pitch, on) {
  const c = (lit.get(pitch) || 0) + (on ? 1 : -1);
  if (c > 0) lit.set(pitch, c);
  else lit.delete(pitch);
  paintKeys();
}
function shiftOctave(d) {
  baseOctave = clamp(baseOctave + d, 0, 6);
  $("#js-oct-lbl").textContent = `C${baseOctave}`;
  paintKeys();
}
function setStatus(msg) {
  const s = $("#js-status");
  if (s) s.textContent = msg;
}
const isOpen = () => root && !root.closest(".modal").classList.contains("hidden");

function onKey(e) {
  if (!isOpen()) return;
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopImmediatePropagation();
    return closeSynthPanel();
  }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.matches?.("input, textarea, select")) return;
  const k = e.key.toLowerCase();
  if (k === "z" || k === "x") {
    e.stopImmediatePropagation();
    return e.repeat ? 0 : shiftOctave(k === "z" ? -1 : 1);
  }
  if (k in KEYMAP) {
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.repeat) return;
    const pitch = baseOctave * 12 + 12 + KEYMAP[k];
    play(pitch, 1);
    heldTyped.set(k, pitch);
    emitNoteVisual(inst, pitch, true); // held until key-up
  }
}
function onKeyUp(e) {
  const k = e.key.toLowerCase();
  if (!heldTyped.has(k)) return;
  emitNoteVisual(inst, heldTyped.get(k), false);
  heldTyped.delete(k);
}

// ------------------------------------------------------------ MIDI
function armLearn(key, elm) {
  root.querySelectorAll(".armed").forEach((n) => n.classList.remove("armed"));
  learnTarget = key;
  elm.classList.add("armed");
  setStatus(`Move a control on your MIDI device to bind it to ${schema[key].label}…`);
}
function onMidi({ data }) {
  const [status, d1, d2 = 0] = data;
  const type = status & 0xf0;
  if (type === 0xb0) {
    if (!isOpen()) return;
    if (learn && learnTarget) {
      for (const cc of Object.keys(ccMap)) if (ccMap[cc] === learnTarget) delete ccMap[cc];
      ccMap[d1] = learnTarget;
      saveCcMap();
      setStatus(`CC ${d1} → ${schema[learnTarget].label}`);
      root.querySelector(".armed")?.classList.remove("armed");
      learnTarget = null;
      return;
    }
    const key = ccMap[d1];
    const p = key && schema[key];
    if (!p) return;
    const cfg = KNOBS[key] || FADERS[key];
    const v = fromNorm(p, d2 / 127, cfg.curve);
    widgets[key]?.set(v);
    writeParam(key, v);
    drawEnv();
  } else if (type === 0x90 && d2 > 0) {
    if (!isOpen()) return;
    // the roll has its own MIDI handler — don't double-trigger when it's also visible
    if (!$("#modal-roll").classList.contains("hidden")) return;
    play(d1, d2 / 127);
    emitNoteVisual(inst, d1, true); // held until note-off
  } else if (type === 0x80 || (type === 0x90 && d2 === 0)) {
    if (isOpen() && $("#modal-roll").classList.contains("hidden"))
      emitNoteVisual(inst, d1, false);
  }
}
async function toggleMidi() {
  const b = $("#js-midi");
  if (midiAccess) {
    for (const input of midiAccess.inputs.values()) input.onmidimessage = null;
    midiAccess.onstatechange = null;
    midiAccess = null;
    b.classList.remove("on");
    return setStatus("MIDI input off.");
  }
  try {
    if (!navigator.requestMIDIAccess) throw new Error("MIDI input isn't available in this browser.");
    midiAccess = await navigator.requestMIDIAccess({ sysex: false });
    const connect = () => {
      const names = [];
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = onMidi;
        names.push(input.name);
      }
      setStatus(
        names.length
          ? `MIDI in: ${names.join(", ")} — play notes; CC 74/71/73/72/75/76/77/7 are mapped (LEARN to remap).`
          : "MIDI enabled, but no input device found — plug in a controller.",
      );
    };
    midiAccess.onstatechange = connect;
    connect();
    b.classList.add("on");
  } catch (e) {
    midiAccess = null;
    b.classList.remove("on");
    setStatus(e.message);
  }
}

// ------------------------------------------------------------ open / close
export function openSynthPanel(i) {
  const instr = store.instrument(i);
  if (instr.synthId !== SYNTH_ID) return;
  inst = i;
  engine.ensureContext();
  lit.clear();
  syncAll();
  paintKeys();
  root.closest(".modal").classList.remove("hidden");
  root.querySelector(".fader, .knob")?.focus({ preventScroll: true });
  setStatus(
    "Drag pots up/down · wheel · Shift = fine · double-click = reset · play: A–L keys, on-screen keys or MIDI.",
  );
}
export function closeSynthPanel() {
  root.closest(".modal").classList.add("hidden");
  learn = false;
  learnTarget = null;
  $("#js-learn")?.classList.remove("on");
  root.classList.remove("learning");
}

export function initSynthPanel() {
  root = $("#jims10-panel");
  if (!root) return;
  build();
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("keyup", onKeyUp, true);
  window.addEventListener("blur", () => {
    for (const p of heldTyped.values()) emitNoteVisual(inst, p, false);
    heldTyped.clear();
  });
  // everything that sounds on this synth (sequencer, roll, MIDI, mouse) lights the keys
  document.addEventListener("synth-note", (e) => {
    if (e.detail.i === inst) setLit(e.detail.pitch, e.detail.on);
  });
  $("#modal-synth").addEventListener("pointerdown", (e) => {
    if (e.target.id === "modal-synth") closeSynthPanel();
  });
  document.addEventListener("open-synth-panel", (e) => openSynthPanel(e.detail));
  // keep the panel in step with edits made elsewhere (MIDI-roll sliders, undo, load)
  store.on("instrument", ({ i, prop }) => {
    if (!selfWrite && isOpen() && i === inst && prop === "params") syncAll();
  });
  store.on("load", () => isOpen() && closeSynthPanel());
}
