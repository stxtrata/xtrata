// synth-panel.js — hardware-style front panels for the character synths
// (jiMS10, Coinbase, Gm, Taproot). Each synth in synths.js carries a `ui` spec
// (sections of knobs / faders / buttons / XY pads / live displays + a colour theme);
// this module turns the spec into a panel. Controls write the same
// `instrument.params` object the MIDI-roll slider grid uses, so both views stay in
// sync and everything saves with the project. While a panel is open you can play it:
// on-screen keys, computer keys (A–L, Z/X octave) and Web MIDI notes; MIDI CC knobs
// can be controlled and learned (per synth).
// The panel lives in the bottom dock (#synth-dock): open on first visit, one tab per synth,
// collapsible. While it is expanded and no modal is open, A–L play it straight away.

import { store } from "./state.js";
import { engine } from "./engine.js";
import { addMidiListener, ensureMidi, setMidiEnabled, isMidiOn, midiStatus, setMidiTarget } from "./midi-input.js";
import { SYNTH_BANK, synthDefaults } from "./synths.js";
import { Kit } from "./synth-faces/index.js";
import { makeFloatable } from "./float-window.js";
import { attachKeyboard, noteOn, noteOff, allOff, getOctave, setOctave, TYPED_VEL } from "./live-keys.js";
import { voxFormants, fmRoles, FM_MOD, FM_CARRIERS, FM_ALGOS, VOWEL_NAMES } from "./synths-voices.js";

const $ = (s) => document.querySelector(s);
const NOTE_LEN = 0.45; // seconds — preset / RANDOM audition length
const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14 };
const BLACK = new Set([1, 3, 6, 8, 10]);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const hz = (v) => (v >= 1000 ? `${(v / 1000).toFixed(2)}k` : `${Math.round(v)}`);
const FMT = {
  ms: (v) => (v >= 1 ? `${v.toFixed(2)}s` : `${Math.round(v * 1000)}ms`),
  pct: (v) => `${Math.round(v * 100)}%`,
  hz,
  num1: (v) => v.toFixed(1),
  num2: (v) => v.toFixed(2),
  int: (v) => `${Math.round(v)}`,
  cents: (v) => `${v > 0 ? "+" : ""}${Math.round(v)}c`,
  ratio: (v) => `×${v}`,
  db: (v) => `+${v.toFixed(1)}dB`,
  vowel: (v) => {
    const i = Math.min(3, Math.floor(v));
    const t = v - i;
    return t < 0.08 ? VOWEL_NAMES[i] : t > 0.92 ? VOWEL_NAMES[i + 1] : `${VOWEL_NAMES[i]}→${VOWEL_NAMES[i + 1]}`;
  },
};

let inst = 0;
let root = null;
let synthId = null;
let spec = null; // current synth's ui spec
let schema = {};
let ctrls = {}; // key -> control item (for formats, curves, random)
let widgets = {}; // key -> { set(v) }
let vizzes = []; // [{ canvas, draw }]
let baseOctave = getOctave(); // mirrors live-keys.js (shared with every on-screen keyboard)
let learn = false;
let learnTarget = null;
let ccMap = {};
let selfWrite = false;
let faceH = null; // mounted custom front panel ({P, refit, dispose}) when the synth has one
const disposeFace = () => {
  if (faceH) faceH.dispose();
  faceH = null;
};
const lit = new Map(); // pitch -> count of sources currently sounding it
let kbHandle = null; // classic-panel keyboard (live-keys attachKeyboard)

// ------------------------------------------------------------ MIDI CC map (per synth)
const ccKey = () => `audionaut.cc.${synthId}`;
function loadCcMap() {
  const base = { ...(spec.cc || {}) };
  try {
    const raw = localStorage.getItem(ccKey());
    if (raw) return { ...base, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable — defaults only */
  }
  return base;
}
function saveCcMap() {
  try {
    localStorage.setItem(ccKey(), JSON.stringify(ccMap));
  } catch {
    /* ignore */
  }
}

// ------------------------------------------------------------ param plumbing
function current() {
  return { ...synthDefaults(synthId), ...(store.instrument(inst).params || {}) };
}
function writeParams(obj) {
  selfWrite = true;
  store.setInstrumentProp(inst, "params", { ...current(), ...obj });
  selfWrite = false;
  const ps = $("#sfp-preset");
  if (ps) ps.value = "";
  drawViz();
}
const writeParam = (key, v) => writeParams({ [key]: v });
const toNorm = (p, v, curve) =>
  curve === "log" ? Math.log(v / p.min) / Math.log(p.max / p.min) : (v - p.min) / (p.max - p.min);
const fromNorm = (p, n, curve) => {
  n = clamp(n, 0, 1);
  let v = curve === "log" ? p.min * Math.pow(p.max / p.min, n) : p.min + n * (p.max - p.min);
  v = Math.round(v / p.step) * p.step;
  return +clamp(v, p.min, p.max).toFixed(4);
};

// ------------------------------------------------------------ knob + fader
function wire(elm, key, cfg, { vertical }) {
  const p = schema[key];
  const set = (v, silent) => {
    v = clamp(v, p.min, p.max);
    elm.setAttribute("aria-valuenow", v);
    elm.setAttribute("aria-valuetext", cfg.fmt(v));
    elm._paint(toNorm(p, v, cfg.curve), v);
    if (!silent) writeParam(key, v);
  };
  let startY = 0;
  let startN = 0;
  let dragging = false;
  const trackRect = () => elm.querySelector(".fader-track").getBoundingClientRect();
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
      const r = trackRect(); // faders jump to the pointer, then drag
      startN = clamp(1 - (e.clientY - r.top) / r.height, 0, 1);
      set(fromNorm(p, startN, cfg.curve));
    } else startN = toNorm(p, current()[key], cfg.curve);
  });
  elm.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (vertical) {
      const r = trackRect();
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
      set(fromNorm(p, n + (e.deltaY < 0 ? 1 : -1) * (e.shiftKey ? 0.004 : 0.02), cfg.curve));
    },
    { passive: false },
  );
  elm.addEventListener("keydown", (e) => {
    const dir = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
    if (e.key === "Home") return (e.preventDefault(), set(p.min));
    if (e.key === "End") return (e.preventDefault(), set(p.max));
    if (e.key === "Enter") {
      e.preventDefault();
      return play(48 + (baseOctave - 3) * 12);
    }
    if (!dir) return;
    e.preventDefault();
    e.stopPropagation();
    const n = toNorm(p, current()[key], cfg.curve);
    set(fromNorm(p, n + dir * (e.shiftKey ? 0.1 : 0.02), cfg.curve));
  });
  widgets[key] = { set: (v) => set(v, true) };
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
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

function cfgOf(item) {
  return { ...item, fmt: FMT[item.fmt] || FMT.num2 };
}

function makeKnob(item) {
  const cfg = cfgOf(item);
  const p = schema[item.key];
  const wrap = el("div", `knob-wrap${item.big ? " big" : ""}`);
  const k = el("div", "knob");
  k.tabIndex = 0;
  k.setAttribute("role", "slider");
  k.setAttribute("aria-label", p.label);
  k.setAttribute("aria-valuemin", p.min);
  k.setAttribute("aria-valuemax", p.max);
  k.dataset.key = item.key;
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
  const read = el("div", "knob-read");
  k._paint = (n, v) => {
    const ang = ARC.start + n * ARC.sweep;
    ptr.setAttribute("transform", `rotate(${ang} 32 32)`);
    const from = item.center ? ARC.start + 0.5 * ARC.sweep : ARC.start;
    const a0 = Math.min(from, ang);
    const a1 = Math.max(from, ang);
    fill.setAttribute("d", a1 - a0 < 0.5 ? "" : arcPath(32, 32, 27, a0, a1));
    read.textContent = cfg.fmt(v);
  };
  wrap.append(k, el("div", "knob-label", item.label), read);
  wire(k, item.key, cfg, { vertical: false });
  return wrap;
}

function makeFader(item) {
  const cfg = cfgOf(item);
  const p = schema[item.key];
  const wrap = el("div", "fader-wrap");
  const f = el("div", "fader", `<div class="fader-track"><div class="fader-fill"></div><div class="fader-thumb"></div></div>`);
  f.tabIndex = 0;
  f.setAttribute("role", "slider");
  f.setAttribute("aria-orientation", "vertical");
  f.setAttribute("aria-label", p.label);
  f.setAttribute("aria-valuemin", p.min);
  f.setAttribute("aria-valuemax", p.max);
  f.dataset.key = item.key;
  f.title = `${p.label} — drag · wheel · Shift = fine · double-click = reset`;
  const fill = f.querySelector(".fader-fill");
  const thumb = f.querySelector(".fader-thumb");
  const read = el("div", "knob-read");
  f._paint = (n, v) => {
    fill.style.height = `${n * 100}%`;
    thumb.style.bottom = `${n * 100}%`;
    read.textContent = cfg.fmt(v);
  };
  wrap.append(f, el("div", "knob-label", item.label), read);
  wire(f, item.key, cfg, { vertical: true });
  return wrap;
}

// ------------------------------------------------------------ radio buttons + XY pad
function makeRadio(item) {
  const wrap = el("div", `sfp-radio ${item.cls || ""}`);
  wrap.setAttribute("role", "radiogroup");
  const btns = item.options.map(([val, label, svg, viewBox]) => {
    const b = el("button", "sfp-opt");
    b.type = "button";
    b.setAttribute("role", "radio");
    b.title = `${schema[item.key].label}: ${label}`;
    b.innerHTML = `<i class="led"></i>${svg ? `<svg viewBox="${viewBox || "0 0 24 24"}">${svg}</svg>` : ""}<span>${label}</span>`;
    b.addEventListener("click", () => {
      if (learn) return setStatus("Buttons can't be MIDI-learned — pick a knob or fader.");
      writeParam(item.key, val);
      paint(val);
    });
    wrap.appendChild(b);
    return [val, b];
  });
  const numeric = typeof item.options[0][0] === "number";
  const paint = (v) =>
    btns.forEach(([val, b]) => {
      const on = numeric ? Math.round(v) === val && Math.abs(v - val) < 0.5 : v === val;
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", on);
    });
  widgets[item.key] = { set: paint };
  return wrap;
}

function makeXY(item) {
  const { x, y } = item;
  const px = schema[x.key];
  const py = schema[y.key];
  const cx = cfgOf(x);
  const cy = cfgOf(y);
  const wrap = el("div", `sfp-xy-wrap ${item.cls || ""}`);
  const pad = el("div", "sfp-xy", `<div class="xy-grid"></div><div class="xy-puck"></div>`);
  pad.tabIndex = 0;
  pad.setAttribute("role", "application");
  pad.setAttribute("aria-label", `${px.label} / ${py.label} pad`);
  pad.title = `${x.label} (left–right) · ${y.label} (up–down) — drag · arrows · double-click = reset`;
  if (item.ticks) {
    const t = el("div", "xy-ticks");
    item.ticks.forEach((label) => t.appendChild(el("span", "", label)));
    pad.appendChild(t);
  }
  const puck = pad.querySelector(".xy-puck");
  const read = el("div", "xy-read");
  const paint = () => {
    const P = current();
    const nx = toNorm(px, P[x.key], cx.curve);
    const ny = toNorm(py, P[y.key], cy.curve);
    puck.style.left = `${clamp(nx, 0, 1) * 100}%`;
    puck.style.top = `${(1 - clamp(ny, 0, 1)) * 100}%`;
    read.textContent = `${x.label} ${cx.fmt(P[x.key])}  ·  ${y.label} ${cy.fmt(P[y.key])}`;
  };
  const setFrom = (e) => {
    const r = pad.getBoundingClientRect();
    writeParams({
      [x.key]: fromNorm(px, (e.clientX - r.left) / r.width, cx.curve),
      [y.key]: fromNorm(py, 1 - (e.clientY - r.top) / r.height, cy.curve),
    });
    paint();
  };
  let dragging = false;
  pad.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    pad.focus();
    if (learn) return armLearn(x.key, pad);
    dragging = true;
    pad.setPointerCapture(e.pointerId);
    pad.classList.add("drag");
    setFrom(e);
    play(48 + (baseOctave - 3) * 12); // hear what you're moving
  });
  pad.addEventListener("pointermove", (e) => dragging && setFrom(e));
  const end = () => {
    dragging = false;
    pad.classList.remove("drag");
  };
  pad.addEventListener("pointerup", end);
  pad.addEventListener("pointercancel", end);
  pad.addEventListener("dblclick", () => {
    writeParams({ [x.key]: px.def, [y.key]: py.def });
    paint();
  });
  pad.addEventListener("keydown", (e) => {
    const dx = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    const dy = { ArrowUp: 1, ArrowDown: -1 }[e.key];
    if (!dx && !dy) return;
    e.preventDefault();
    e.stopPropagation();
    const P = current();
    const step = e.shiftKey ? 0.1 : 0.02;
    writeParams({
      [x.key]: fromNorm(px, toNorm(px, P[x.key], cx.curve) + (dx || 0) * step, cx.curve),
      [y.key]: fromNorm(py, toNorm(py, P[y.key], cy.curve) + (dy || 0) * step, cy.curve),
    });
    paint();
  });
  widgets[x.key] = { set: paint };
  widgets[y.key] = { set: paint };
  wrap.append(pad, read);
  return wrap;
}

// ------------------------------------------------------------ live displays
function themeOf() {
  return spec.theme;
}
function sizeCanvas(cv) {
  // draw at device resolution but keep CSS size from layout
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(40, Math.round((r.width || cv.clientWidth || 200) * dpr));
  const h = Math.max(30, Math.round((r.height || cv.clientHeight || 70) * dpr));
  if (cv.width !== w || cv.height !== h) {
    cv.width = w;
    cv.height = h;
  }
  return [cv.getContext("2d"), w, h, dpr];
}
function lcdBackdrop(c, w, h, t) {
  c.clearRect(0, 0, w, h);
  c.fillStyle = t.lcdBg;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = `${t.accent}22`;
  c.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    c.beginPath();
    c.moveTo(0, (h * i) / 4);
    c.lineTo(w, (h * i) / 4);
    c.stroke();
  }
}

const VIZ = {
  adsr(cv, P) {
    const [c, W, H] = sizeCanvas(cv);
    const t = themeOf();
    lcdBackdrop(c, W, H, t);
    const m = spec.adsr;
    const A = P[m.a] ?? 0.01;
    const D = m.d ? P[m.d] : 0.05;
    const S = m.s ? P[m.s] : 1;
    const R = P[m.r] ?? 0.2;
    const hold = 0.35;
    const total = A + D + hold + R;
    const x = (tt) => 6 + (tt / total) * (W - 12);
    const y = (a) => H - 6 - a * (H - 14);
    const pts = [[0, 0], [A, 1], [A + D, S], [A + D + hold, S], [total, 0]];
    c.beginPath();
    pts.forEach(([tt, a], i) => (i ? c.lineTo(x(tt), y(a)) : c.moveTo(x(tt), y(a))));
    c.lineTo(x(total), y(0));
    c.closePath();
    c.fillStyle = `${t.accent}29`;
    c.fill();
    c.beginPath();
    pts.forEach(([tt, a], i) => (i ? c.lineTo(x(tt), y(a)) : c.moveTo(x(tt), y(a))));
    c.strokeStyle = t.lcd;
    c.lineWidth = 2;
    c.stroke();
  },
  scope(cv, P, synth) {
    const [c, W, H] = sizeCanvas(cv);
    const t = themeOf();
    lcdBackdrop(c, W, H, t);
    if (!synth.scope) return;
    const d = synth.scope(P);
    const cols = W - 8;
    const per = d.length / cols;
    c.fillStyle = `${t.accent}55`;
    c.strokeStyle = t.lcd;
    c.lineWidth = Math.max(1, W / 400);
    c.beginPath();
    for (let px = 0; px < cols; px++) {
      let lo = 1;
      let hi = -1;
      const a = Math.floor(px * per);
      const b = Math.min(d.length, Math.floor((px + 1) * per) + 1);
      for (let i = a; i < b; i++) {
        lo = Math.min(lo, d[i]);
        hi = Math.max(hi, d[i]);
      }
      const y1 = H / 2 - hi * (H / 2 - 4) * 1.4;
      const y2 = H / 2 - lo * (H / 2 - 4) * 1.4;
      c.moveTo(4 + px, y1);
      c.lineTo(4 + px, Math.max(y2, y1 + 1));
    }
    c.stroke();
  },
  fmroute(cv, P) {
    const [c, W, H] = sizeCanvas(cv);
    const t = themeOf();
    lcdBackdrop(c, W, H, t);
    const algo = Math.max(0, FM_ALGOS.indexOf(P.algo));
    const POS = [
      [[0.86, 0.5], [0.62, 0.5], [0.38, 0.5], [0.14, 0.5]], // stack
      [[0.25, 0.74], [0.25, 0.26], [0.7, 0.74], [0.7, 0.26]], // twin
      [[0.5, 0.76], [0.2, 0.24], [0.5, 0.24], [0.8, 0.24]], // fork
      [[0.14, 0.5], [0.38, 0.5], [0.62, 0.5], [0.86, 0.5]], // organ
    ][algo];
    const bw = Math.min(W * 0.14, H * 0.34);
    const pos = POS.map(([px, py]) => [px * W, py * H]);
    c.lineWidth = Math.max(1.5, W / 260);
    // modulation arrows
    c.strokeStyle = t.lcd;
    FM_MOD[algo].forEach((srcs, k) =>
      srcs.forEach((j) => {
        const [x1, y1] = pos[j];
        const [x2, y2] = pos[k];
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const sx = x1 + Math.cos(ang) * bw * 0.62;
        const sy = y1 + Math.sin(ang) * bw * 0.62;
        const ex = x2 - Math.cos(ang) * bw * 0.62;
        const ey = y2 - Math.sin(ang) * bw * 0.62;
        c.beginPath();
        c.moveTo(sx, sy);
        c.lineTo(ex, ey);
        const ah = bw * 0.2;
        c.lineTo(ex - Math.cos(ang - 0.45) * ah, ey - Math.sin(ang - 0.45) * ah);
        c.moveTo(ex, ey);
        c.lineTo(ex - Math.cos(ang + 0.45) * ah, ey - Math.sin(ang + 0.45) * ah);
        c.stroke();
      }),
    );
    // boxes: carriers filled + output tick, modulators outlined; brightness = level
    const lv = [P.l1, P.l2, P.l3, P.l4];
    pos.forEach(([x, y], k) => {
      const car = FM_CARRIERS[algo].includes(k);
      c.globalAlpha = 0.35 + 0.65 * lv[k];
      c.fillStyle = car ? t.accent : "transparent";
      c.strokeStyle = t.accent;
      c.beginPath();
      c.roundRect(x - bw / 2, y - bw / 2, bw, bw, 4);
      if (car) c.fill();
      c.stroke();
      c.globalAlpha = 1;
      c.fillStyle = car ? t.lcdBg : t.lcd;
      c.font = `700 ${Math.round(bw * 0.5)}px "IBM Plex Mono", monospace`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(String(k + 1), x, y + 1);
      if (car) {
        c.strokeStyle = t.lcd;
        c.beginPath();
        if (algo === 1 || algo === 2) {
          c.moveTo(x, y + bw / 2);
          c.lineTo(x, y + bw / 2 + bw * 0.45);
        } else {
          c.moveTo(x, y + bw / 2);
          c.lineTo(x, y + bw / 2 + bw * 0.45);
        }
        c.stroke();
      }
    });
    c.fillStyle = `${t.lcd}aa`;
    c.font = `600 ${Math.round(H * 0.11)}px "IBM Plex Mono", monospace`;
    c.textAlign = "right";
    c.textBaseline = "bottom";
    c.fillText("▼ OUT = filled", W - 6, H - 3);
  },
  formants(cv, P) {
    const [c, W, H] = sizeCanvas(cv);
    const t = themeOf();
    lcdBackdrop(c, W, H, t);
    const f0 = 90;
    const f1 = 5000;
    const X = (f) => 6 + (Math.log(f / f0) / Math.log(f1 / f0)) * (W - 12);
    const resp = (fm, fr) => {
      const r = fr / fm.f - fm.f / fr;
      return (fm.g * 1) / Math.sqrt(1 + fm.q * fm.q * r * r * 0.25);
    };
    const curve = (formants, stroke, fill) => {
      c.beginPath();
      for (let px = 0; px <= W - 12; px += 2) {
        const fr = f0 * Math.pow(f1 / f0, px / (W - 12));
        let v = 0;
        formants.forEach((fm) => (v += resp(fm, fr)));
        const y = H - 8 - Math.min(1.25, v) * (H - 18) * 0.8;
        px ? c.lineTo(6 + px, y) : c.moveTo(6 + px, y);
      }
      c.strokeStyle = stroke;
      c.lineWidth = Math.max(1.5, W / 280);
      c.stroke();
      if (fill) {
        c.lineTo(W - 6, H - 8);
        c.lineTo(6, H - 8);
        c.closePath();
        c.fillStyle = fill;
        c.fill();
      }
    };
    const from = voxFormants(P, P.vowel);
    if (P.morph > 0.005) curve(voxFormants(P, P.vowelTo), `${spec.theme.lcd}66`, null);
    curve(from, t.lcd, `${t.accent}30`);
    c.strokeStyle = `${t.accent}77`;
    c.setLineDash([3, 4]);
    c.lineWidth = 1;
    from.forEach((fm, k) => {
      c.beginPath();
      c.moveTo(X(fm.f), 4);
      c.lineTo(X(fm.f), H - 8);
      c.stroke();
      c.fillStyle = t.lcd;
      c.font = `600 ${Math.round(H * 0.11)}px "IBM Plex Mono", monospace`;
      c.textAlign = "center";
      c.fillText(`F${k + 1}`, X(fm.f), 14);
    });
    c.setLineDash([]);
  },
};

const VIZKIT = { sizeCanvas, themeOf, lcdBackdrop };
function drawViz() {
  const P = current();
  const synth = SYNTH_BANK[synthId];
  // a synth may bring its own displays (`synth.viz`, e.g. synths/basic-panels.js); they get the drawing helpers
  vizzes.forEach(({ canvas, id }) => (synth.viz?.[id] || VIZ[id])?.(canvas, P, synth, VIZKIT));
}

// ------------------------------------------------------------ build
function buildItem(item, into) {
  switch (item.type) {
    case "knob":
      ctrls[item.key] = item;
      return into.appendChild(makeKnob(item));
    case "fader":
      ctrls[item.key] = item;
      return into.appendChild(makeFader(item));
    case "radio":
      ctrls[item.key] = item;
      return into.appendChild(makeRadio(item));
    case "xy":
      ctrls[item.x.key] = { ...item.x, type: "knob" };
      ctrls[item.y.key] = { ...item.y, type: "knob" };
      return into.appendChild(makeXY(item));
    case "viz": {
      const cv = el("canvas", `sfp-viz ${item.cls || ""}`);
      vizzes.push({ canvas: cv, id: item.id });
      return into.appendChild(cv);
    }
    case "row": {
      const row = el("div", "sfp-row");
      item.items.forEach((it) => buildItem(it, row));
      return into.appendChild(row);
    }
  }
}

// Host preset menu: every factory preset, grouped by its `cat` (presets without one share a
// "Presets" group). Option values are indices into synth.presets, so order never matters to saves.
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function presetMenu(synth) {
  const list = synth.presets || [];
  if (!list.length) return "";
  const groups = new Map();
  list.forEach((p, i) => {
    const c = p.cat || "Presets";
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c).push(`<option value="${i}">${esc(p.name)}</option>`);
  });
  const body =
    groups.size > 1
      ? [...groups].map(([c, o]) => `<optgroup label="${esc(c)} (${o.length})">${o.join("")}</optgroup>`).join("")
      : [...groups.values()][0].join("");
  return `<select id="sfp-preset" class="sfp-preset" title="Factory sounds (${list.length})" aria-label="Preset"><option value="">— ${list.length} presets —</option>${body}</select>`;
}

// Custom front panel (synth-faces/<id>.js): the face draws every control itself and talks to the
// store through the face runtime, so this shell only supplies the slim toolbar.
function buildFace(id) {
  const synth = SYNTH_BANK[id];
  const accent = synth.ui?.theme?.accent || synth.color || "#2edb84";
  root.className = `sfp sfp-face sfp-${id}`;
  root.style.setProperty("--sfp-accent", accent);
  root.setAttribute("aria-label", `${synth.name} synth panel`);
  root.innerHTML = `
    <div class="sfp-head sfp-face-bar">
      <div class="sfp-sub"><b>${synth.name}</b><span id="sfp-inst"></span></div>
      ${presetMenu(synth)}
      <div class="sfp-oct"><button id="sfp-oct-dn" class="sfp-btn" title="Octave down (Z)">−</button><span id="sfp-oct-lbl"></span><button id="sfp-oct-up" class="sfp-btn" title="Octave up (X)">+</button></div>
      <div class="sfp-head-btns">
        <button id="sfp-midi" class="sfp-btn" title="Play with a MIDI keyboard / controller while the synth dock is open"><i class="led"></i>MIDI IN</button>
        <button id="sfp-fx" class="sfp-btn" title="Filter / drive / delay / reverb for this synth">FX</button>
        <button id="sfp-ins" class="sfp-btn" title="Insert plugins: EQ, compressor, chorus, phaser…">INSERTS</button>
        <button id="sfp-rand" class="sfp-btn" title="Randomise the sound">RANDOM</button>
        <button id="sfp-init" class="sfp-btn" title="Reset every control to its default">INIT</button>
        <button id="sfp-close" class="sfp-btn primary" title="Collapse the synth dock">HIDE</button>
      </div>
    </div>
    <div class="sfp-face-host"></div>
    <div id="sfp-status" class="sfp-status"></div>`;
  faceH = Kit.mount(root.querySelector(".sfp-face-host"), id, inst);
  // keep the host menu on whatever preset the face shows (face buttons, prev/next, auto-pick)
  faceH?.P.onPreset((i) => {
    const ps = $("#sfp-preset");
    if (ps) ps.value = i >= 0 ? String(i) : "";
  });
  wireHeader();
}

function build(id) {
  kbHandle?.release();
  kbHandle = null;
  disposeFace();
  synthId = id;
  const synth = SYNTH_BANK[id];
  spec = synth.ui;
  schema = Object.fromEntries(synth.params.map((p) => [p.key, p]));
  ctrls = {};
  widgets = {};
  vizzes = [];
  ccMap = loadCcMap();
  if (Kit.has(id)) return buildFace(id);
  const t = spec.theme;
  root.className = `sfp sfp-${id}`;
  root.style.setProperty("--sfp-accent", t.accent);
  root.style.setProperty("--sfp-lcd", t.lcd);
  root.style.setProperty("--sfp-lcd-bg", t.lcdBg);
  root.style.setProperty("--sfp-edge", t.edge);
  root.style.setProperty("--sfp-bg", t.bg);
  root.setAttribute("aria-label", `${synth.name} synth panel`);
  const bar = spec.adsr ? "adsr" : spec.scopeLabel ? "scope" : "";
  root.innerHTML = `
    <div class="sfp-head">
      <div class="sfp-logo">${spec.logo[0]}<b>${spec.logo[1]}</b></div>
      <div class="sfp-sub">${spec.sub}<span id="sfp-inst"></span></div>
      ${presetMenu(synth)}
      <div class="sfp-head-btns">
        <button id="sfp-midi" class="sfp-btn" title="Play with a MIDI keyboard / controller while the synth dock is open"><i class="led"></i>MIDI IN</button>
        <button id="sfp-learn" class="sfp-btn" title="MIDI learn: click a control, then move a knob/fader on your controller"><i class="led"></i>LEARN</button>
        <button id="sfp-fx" class="sfp-btn" title="Filter / drive / delay / reverb for this synth">FX</button>
        <button id="sfp-ins" class="sfp-btn" title="Insert plugins: EQ, compressor, chorus, phaser…">INSERTS</button>
        <button id="sfp-rand" class="sfp-btn" title="Randomise the sound">RANDOM</button>
        <button id="sfp-init" class="sfp-btn" title="Reset every control to its default">INIT</button>
        <button id="sfp-close" class="sfp-btn primary" title="Collapse the synth dock">HIDE</button>
      </div>
    </div>
    <div class="sfp-body"></div>
    <div class="sfp-keys-bar">
      <div class="sfp-oct"><button id="sfp-oct-dn" class="sfp-btn" title="Octave down (Z)">−</button><span id="sfp-oct-lbl"></span><button id="sfp-oct-up" class="sfp-btn" title="Octave up (X)">+</button></div>
      <div id="sfp-keys" class="sfp-keys" aria-label="Test keyboard"></div>
      ${bar ? `<div class="sfp-scope"><span>${bar === "adsr" ? "AMP ENV" : spec.scopeLabel}</span><canvas id="sfp-scope-cv" aria-label="${bar === "adsr" ? "Envelope shape" : "Waveform"}"></canvas></div>` : ""}
    </div>
    <div id="sfp-status" class="sfp-status"></div>`;

  const body = root.querySelector(".sfp-body");
  spec.sections.forEach((sec) => {
    const s = el("section", `sfp-sec ${sec.cls || ""}`);
    if (sec.op) s.dataset.op = sec.op;
    s.appendChild(el("h3", "", `${sec.title}<span class="sfp-tag"></span>`));
    const inner = el("div", "sfp-sec-body");
    sec.items.forEach((it) => buildItem(it, inner));
    s.appendChild(inner);
    body.appendChild(s);
  });
  const sc = $("#sfp-scope-cv");
  if (sc) vizzes.push({ canvas: sc, id: bar });

  buildKeys();
  wireHeader();
}

function buildKeys() {
  const keys = $("#sfp-keys");
  let white = 0;
  for (let i = 0; i < 25; i++) {
    const k = el("button", `sfp-key${BLACK.has(i % 12) ? " blk" : ""}`);
    k.dataset.i = i;
    k.tabIndex = -1;
    if (BLACK.has(i % 12)) k.style.left = `calc(${white} * var(--wk) - var(--wk) * .3)`;
    else {
      k.style.left = `calc(${white} * var(--wk))`;
      white++;
    }
    keys.appendChild(k);
  }
  kbHandle = attachKeyboard(keys, {
    inst: () => inst,
    keyAt: (n) => {
      const k = n.closest?.(".sfp-key");
      return k && keys.contains(k) ? { midi: baseOctave * 12 + 12 + +k.dataset.i, el: k } : null;
    },
  });
}

function wireHeader() {
  $("#sfp-close").addEventListener("click", closeSynthPanel);
  $("#sfp-init").addEventListener("click", () => {
    store.setInstrumentProp(inst, "params", null);
    syncAll();
    setStatus(`Reset to the default ${SYNTH_BANK[synthId].name} patch.`);
  });
  $("#sfp-rand").addEventListener("click", randomise);
  $("#sfp-midi").addEventListener("click", () => setMidiEnabled(!isMidiOn()));
  $("#sfp-fx").addEventListener("click", () =>
    document.dispatchEvent(new CustomEvent("open-inst-fx", { detail: inst })),
  );
  $("#sfp-ins").addEventListener("click", () =>
    document.dispatchEvent(new CustomEvent("open-inst-inserts", { detail: inst })),
  );
  $("#sfp-preset")?.addEventListener("change", (e) => {
    const preset = SYNTH_BANK[synthId].presets?.[+e.target.value];
    if (!preset) return;
    if (faceH) {
      faceH.P.loadPreset(+e.target.value, { force: true }); // face UI follows; auditions the sound
      return setStatus(`Preset: ${preset.name}`);
    }
    selfWrite = true;
    store.setInstrumentProp(inst, "params", { ...synthDefaults(synthId), ...preset.params });
    selfWrite = false;
    syncAll();
    $("#sfp-preset").value = e.target.value;
    play(48 + (baseOctave - 3) * 12);
    setStatus(`Preset: ${preset.name}`);
  });
  $("#sfp-learn")?.addEventListener("click", () => {
    learn = !learn;
    learnTarget = null;
    $("#sfp-learn").classList.toggle("on", learn);
    root.classList.toggle("learning", learn);
    setStatus(
      learn
        ? "LEARN: click a knob, fader or pad, then move a control on your MIDI device to bind it."
        : "Learn mode off.",
    );
    if (learn && !isMidiOn()) ensureMidi({ force: true });
  });
  $("#sfp-oct-dn").addEventListener("click", () => shiftOctave(-1));
  $("#sfp-oct-up").addEventListener("click", () => shiftOctave(1));
}

function afterSync(P) {
  // Coinbase: tag each operator as carrier (heard) or modulator for the chosen algorithm
  if (synthId === "fm4") {
    const roles = fmRoles(P.algo);
    root.querySelectorAll(".fm-op").forEach((s) => {
      const role = roles[+s.dataset.op - 1];
      s.classList.toggle("is-carrier", role === "carrier");
      s.classList.toggle("is-mod", role !== "carrier");
      s.querySelector(".sfp-tag").textContent = role === "carrier" ? "CARRIER" : "MODULATOR";
    });
  }
}

function syncAll() {
  const P = current();
  Object.entries(widgets).forEach(([k, w]) => w.set(P[k]));
  afterSync(P);
  drawViz();
  $("#sfp-oct-lbl").textContent = `C${baseOctave}`;
  $("#sfp-inst").textContent = ` · ${store.instrument(inst).name}`;
}

function randomise() {
  if (faceH) {
    faceH.P.randomise();
    play(48 + (baseOctave - 3) * 12);
    return setStatus("Randomised — tweak to taste (INIT resets).");
  }
  const P = current();
  for (const [key, item] of Object.entries(ctrls)) {
    if (item.rand === false) continue;
    if (item.type === "radio") {
      P[key] = item.options[Math.floor(Math.random() * item.options.length)][0];
      continue;
    }
    const p = schema[key];
    const [lo, hi] = item.rand || [0.12, 0.88];
    P[key] = fromNorm(p, lo + Math.random() * (hi - lo), item.curve);
  }
  selfWrite = true;
  store.setInstrumentProp(inst, "params", P);
  selfWrite = false;
  syncAll();
  play(48 + (baseOctave - 3) * 12);
  setStatus("Randomised — tweak to taste (INIT resets).");
}

// ------------------------------------------------------------ playing
function play(pitch, vel = 1) {
  engine.ensureContext();
  engine.triggerNote(inst, pitch, vel, 0, NOTE_LEN);
}
// Light every key that is sounding: held (typed / mouse / MIDI) or playing back.
function paintKeys() {
  const keys = $("#sfp-keys")?.children;
  if (!keys) return;
  const lo = baseOctave * 12 + 12;
  for (let i = 0; i < keys.length; i++) keys[i].classList.toggle("on", lit.has(lo + i));
  let below = false;
  let above = false;
  for (const p of lit.keys()) {
    if (p < lo) below = true;
    else if (p >= lo + keys.length) above = true;
  }
  $("#sfp-oct-dn")?.classList.toggle("lit", below);
  $("#sfp-oct-up")?.classList.toggle("lit", above);
}
function setLit(pitch, on) {
  const c = (lit.get(pitch) || 0) + (on ? 1 : -1);
  if (c > 0) lit.set(pitch, c);
  else lit.delete(pitch);
  paintKeys();
}
function shiftOctave(d) {
  baseOctave = setOctave(baseOctave + d);
  $("#sfp-oct-lbl").textContent = `C${baseOctave}`;
  paintKeys();
}
function setStatus(msg) {
  const s = $("#sfp-status");
  if (s) s.textContent = msg;
}
const dockOpen = () => document.body.classList.contains("synth-dock-open");
const modalOpen = () => !!document.querySelector(".modal:not(.hidden)");
// the dock is expanded and showing a synth panel
const isOpen = () => !!root && dockOpen() && root.dataset.built === "1";
// computer keys and MIDI belong to the dock only while no modal (roll, loader…) is on top
const keysLive = () => isOpen() && !modalOpen();

function onKey(e) {
  if (!keysLive()) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.matches?.("input, textarea, select, [contenteditable]")) return;
  const k = e.key.toLowerCase();
  if (k === "z" || k === "x") {
    e.stopImmediatePropagation();
    return e.repeat ? 0 : shiftOctave(k === "z" ? -1 : 1);
  }
  if (k in KEYMAP) {
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.repeat) return;
    noteOn(`key:${k}`, inst, baseOctave * 12 + 12 + KEYMAP[k], TYPED_VEL); // held until key-up
  }
}
function onKeyUp(e) {
  noteOff(`key:${e.key.toLowerCase()}`);
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
    if (!keysLive()) return;
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
    const v = fromNorm(p, d2 / 127, ctrls[key]?.curve);
    writeParam(key, v);
    widgets[key]?.set(v);
  } else if (type === 0x90 && d2 > 0) {
    // the roll has its own MIDI handler — keysLive() is false while it (or any modal) is open
    if (!keysLive()) return;
    noteOn(`midi:${status & 15}:${d1}`, inst, d1, d2 / 127); // held until note-off
  } else if (type === 0x80 || (type === 0x90 && d2 === 0)) {
    noteOff(`midi:${status & 15}:${d1}`);
  }
}
function paintMidi() {
  if (!isOpen()) return;
  const { on, names, error } = midiStatus();
  $("#sfp-midi")?.classList.toggle("on", on);
  if (error) return setStatus(error);
  const ccs = Object.entries(ccMap)
    .map(([cc, k]) => `${cc}=${schema[k]?.label || k}`)
    .join(", ");
  setStatus(
    !on
      ? "MIDI input off — click MIDI IN to turn it on."
      : names.length
        ? `MIDI in: ${names.join(", ")} — play notes. Mapped CCs: ${ccs || "none"} (LEARN to remap).`
        : "MIDI is on, but no controller was found — plug one in and it connects automatically.",
  );
}

// ------------------------------------------------------------ dock: open / close / tabs
const DOCK_KEY = "audionaut.dock"; // { open, tall, inst } — per-browser conveniences
const dockPref = () => {
  try {
    return JSON.parse(localStorage.getItem(DOCK_KEY) || "{}") || {};
  } catch {
    return {};
  }
};
const saveDockPref = (patch) => {
  try {
    localStorage.setItem(DOCK_KEY, JSON.stringify({ ...dockPref(), ...patch }));
  } catch {
    /* storage unavailable — the dock just starts open next time */
  }
};
const dockEl = () => $("#synth-dock");

// The dock can float: the same element, taken out of the layout as a movable, resizable window
// (float-window.js). Position and size are remembered; the toggle (▾) still collapses it to its bar.
let fw = null;
const refitFace = () =>
  requestAnimationFrame(() => {
    faceH?.refit();
    if (isOpen()) drawViz();
  });
function setFloating(on, { save = true } = {}) {
  if (!fw || fw.floating === on) return;
  if (on) fw.float();
  else fw.dock();
  const b = $("#synth-dock-float");
  b.setAttribute("aria-pressed", String(on));
  b.title = on ? "Dock the synth panel back to the bottom" : "Float the synth panel as a window you can move and resize";
  if (save) saveDockPref({ floating: on });
  refitFace();
}

function paintTabs() {
  const tabs = $("#synth-dock-tabs");
  if (!tabs) return;
  tabs.innerHTML = "";
  store.project.instruments.forEach((ins, i) => {
    const synth = SYNTH_BANK[ins.synthId];
    const b = el("button", `synth-dock-tab${i === inst ? " on" : ""}`);
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(i === inst));
    b.style.setProperty("--tab-color", synth?.color || "#2edb84");
    b.appendChild(el("i"));
    b.appendChild(document.createTextNode(ins.name));
    b.title = `${ins.name} — ${synth?.name || ins.synthId}`;
    b.addEventListener("click", () => openSynthPanel(i));
    tabs.appendChild(b);
  });
}

function hideDockPanel() {
  kbHandle?.release();
  kbHandle = null;
  allOff("key:");
  disposeFace();
  learn = false;
  learnTarget = null;
  root.dataset.built = "0";
  root.innerHTML = "";
}

// Build the face for the selected instrument into the dock.
function showDockInstrument() {
  if (!root) return;
  hideDockPanel();
  paintTabs();
  setMidiTarget(inst);
  const ins = store.instrument(inst);
  const id = ins.synthId;
  if (!SYNTH_BANK[id]?.ui) {
    root.className = "sfp sfp-empty";
    root.textContent = `${ins.name} has no front panel yet — open its MIDI roll (♪) to edit it.`;
    return;
  }
  lit.clear();
  build(id);
  root.dataset.built = "1";
  syncAll();
  paintKeys();
  requestAnimationFrame(() => {
    faceH?.refit();
    drawViz();
  });
  $("#sfp-midi")?.classList.toggle("on", isMidiOn());
  if (isMidiOn() || midiStatus().error) paintMidi();
}

function setDockOpen(on, { save = true } = {}) {
  const dock = dockEl();
  if (!dock) return;
  document.body.classList.toggle("synth-dock-open", on);
  dock.classList.toggle("collapsed", !on);
  const t = $("#synth-dock-toggle");
  t.setAttribute("aria-expanded", String(on));
  t.textContent = on ? "▾" : "▴";
  t.title = on ? "Hide the synth panel" : "Show the synth panel";
  if (save) saveDockPref({ open: on });
  if (on) showDockInstrument();
  else {
    hideDockPanel();
    paintTabs();
  }
}

// Select a synth and make sure the dock is showing it (🎛 buttons, tabs, the roll's panel button).
export function openSynthPanel(i) {
  if (!root || !store.instrument(i)) return;
  // a visible roll owns the computer keys, so hand over to the dock
  $("#modal-roll")?.classList.add("hidden");
  inst = i;
  saveDockPref({ inst: i, open: true });
  ensureMidi();
  engine.ensureContext();
  if (dockOpen()) showDockInstrument();
  else setDockOpen(true, { save: false });
  setStatus(
    "Drag pots up/down · wheel · Shift = fine · double-click = reset · play: A–L keys, on-screen keys or MIDI.",
  );
}
export function closeSynthPanel() {
  setDockOpen(false);
}

export function initSynthPanel() {
  root = $("#synth-front");
  if (!root) return;
  const pref = dockPref();
  inst = Number.isInteger(pref.inst) && store.instrument(pref.inst) ? pref.inst : 0;
  dockEl().classList.toggle("tall", pref.tall !== false); // the larger view unless the user chose the short one
  $("#synth-dock-toggle").addEventListener("click", () => setDockOpen(!dockOpen()));
  fw = makeFloatable(dockEl(), {
    handle: dockEl().querySelector(".synth-dock-bar"),
    key: "synth-dock",
    minW: 560,
    minH: 300,
    onChange: (final) => (final ? refitFace() : faceH?.refit()),
  });
  $("#synth-dock-float").addEventListener("click", () => setFloating(!fw.floating));
  // double-click the title bar's empty part (or its grip) to dock / float
  dockEl().querySelector(".synth-dock-bar").addEventListener("dblclick", (e) => {
    if (!e.target.closest("button, [role=tab]")) setFloating(!fw.floating);
  });
  if (pref.floating && window.innerWidth > 760) setFloating(true, { save: false });
  $("#synth-dock-size").addEventListener("click", () => {
    const tall = dockEl().classList.toggle("tall");
    saveDockPref({ tall });
    requestAnimationFrame(() => {
      faceH?.refit();
      drawViz();
    });
  });
  addMidiListener(onMidi);
  document.addEventListener("midi-status", paintMidi);
  window.addEventListener("keydown", onKey, true);
  window.addEventListener("keyup", onKeyUp, true);
  // blur / tab switch release every held note (live-keys.js)
  document.addEventListener("live-octave", (e) => {
    baseOctave = e.detail;
    if (isOpen()) {
      $("#sfp-oct-lbl").textContent = `C${baseOctave}`;
      paintKeys();
    }
  });
  window.addEventListener("resize", () => isOpen() && drawViz());
  // everything that sounds on this synth (sequencer, roll, MIDI, mouse) lights the keys
  document.addEventListener("synth-note", (e) => {
    if (e.detail.i === inst) setLit(e.detail.pitch, e.detail.on);
  });
  document.addEventListener("open-synth-panel", (e) => openSynthPanel(e.detail));
  // keep the panel in step with edits made elsewhere (MIDI-roll sliders, undo, load)
  store.on("instrument", ({ i, prop }) => {
    if (!selfWrite && isOpen() && i === inst && prop === "params") syncAll();
  });
  // a new project, a loaded file or undo/redo: keep the dock on the same synth, rebuilt from the new state
  store.on("load", () => {
    if (!store.instrument(inst)) inst = 0;
    if (dockOpen()) showDockInstrument();
    else paintTabs();
  });
  // names and synth swaps show on the tabs (and the face follows a swapped synth)
  store.on("instrument", ({ i, prop }) => {
    if (prop === "name") paintTabs();
    if (prop === "synthId") {
      paintTabs();
      if (i === inst && dockOpen()) showDockInstrument();
    }
  });
  document.addEventListener("instrument-renamed", paintTabs);
  let mutedAt = 0;
  document.addEventListener("synth-muted", (e) => {
    const now = Date.now();
    if (now - mutedAt < 4000) return; // one hint, not one per key
    mutedAt = now;
    const ins = store.instrument(e.detail.i);
    if (ins) setStatus(`${ins.name} is muted — click M on its row to hear it.`);
  });
  setDockOpen(pref.open !== false, { save: false }); // first visit: open on the first synth
}
