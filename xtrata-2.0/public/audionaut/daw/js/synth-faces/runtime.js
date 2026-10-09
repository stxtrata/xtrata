// synth-faces/runtime.js — hosts the full-size synth faces inside the DAW.
//
// Each face module registers itself with `Kit.register(synthId, { params, faces, ... })`
// and builds its UI with the helpers on `P` (bind / sub / keyboard / scope ...). Unlike the
// design-audition page this version is wired to the real thing:
//   - values live in `store.instrument(i).params` (same object the MIDI-roll sliders use),
//   - notes go through the shared live path (live-keys.js → engine.startNote), so the synth you hear is the synth in the bank,
//   - note lights follow every note on that instrument (sequencer, roll, MIDI, mouse).
// Faces use face-native values: knobs are real numbers in the synth's own units, selects are
// the index into the synth's option list (converted to the option value on write).

import { store } from "../state.js";
import { engine } from "../engine.js";
import { SYNTH_BANK, synthDefaults } from "../synths.js";
import { attachKeyboard, noteOn, noteOff, allOff, keyOffset } from "../live-keys.js";

const REG = {};
const fontsDone = new Set();
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const AUDITION = 0.45; // seconds a preset / pad audition is held
let curInst = null;
let faceSeq = 0;
const taps = new Map();

function addFonts(q) {
  if (!q || fontsDone.has(q)) return;
  fontsDone.add(q);
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?" + q + "&display=swap";
  document.head.appendChild(l);
}

const pdef = (def, id) => def.params.find((p) => p.id === id);
function toNorm(p, v) {
  if (p.type === "select") return p.options.length > 1 ? v / (p.options.length - 1) : 0;
  if (p.type === "toggle") return v ? 1 : 0;
  if (p.log && p.min > 0) return Math.log(v / p.min) / Math.log(p.max / p.min);
  return (v - p.min) / (p.max - p.min || 1);
}
function fromNorm(p, n) {
  n = clamp(n, 0, 1);
  if (p.type === "select") return Math.round(n * (p.options.length - 1));
  if (p.type === "toggle") return n >= 0.5 ? 1 : 0;
  let v = p.log && p.min > 0 ? p.min * Math.pow(p.max / p.min, n) : p.min + n * (p.max - p.min);
  if (p.step) v = Math.round((v - p.min) / p.step) * p.step + p.min;
  return clamp(+v.toFixed(5), p.min, p.max);
}
function fmtVal(p, v) {
  if (p.fmt) return p.fmt(v);
  if (p.type === "select") return p.options[v];
  if (p.type === "toggle") return v ? "On" : "Off";
  const r = Math.abs(p.max - p.min);
  const d = p.step && p.step >= 1 ? 0 : r < 2 ? 2 : r < 20 ? 1 : 0;
  return v.toFixed(d) + (p.unit || "");
}

// ---- real <-> face value conversion
const realOpts = (rp) => (rp.options || []).map((o) => (Array.isArray(o) ? o[0] : o));
function toFace(fp, rp, rv) {
  if (fp.type === "select") {
    const i = realOpts(rp).indexOf(rv);
    return i < 0 ? fp.def : i;
  }
  return typeof rv === "number" ? rv : fp.def;
}
function toReal(fp, rp, v) {
  if (fp.type === "select") {
    const o = realOpts(rp)[v];
    return o === undefined ? rp.def : o;
  }
  return v;
}

function analyserFor(inst) {
  const ctx = engine.ctx;
  const g = engine.instrumentGains?.[inst];
  if (!ctx || !g) return null;
  let a = taps.get(inst);
  if (!a || a.context !== ctx) {
    a = ctx.createAnalyser();
    a.fftSize = 2048;
    g.connect(a); // dead-end tap: only measures, never changes the sound
    taps.set(inst, a);
  }
  return a;
}

function makeP(synthId, inst, def, root) {
  const synth = SYNTH_BANK[synthId];
  const rdef = Object.fromEntries(synth.params.map((p) => [p.key, p]));
  const disposers = [];
  const subs = {};
  const all = new Set();
  const noteSubs = new Set();
  const presetSubs = new Set();
  const born = performance.now();
  const src = `face${++faceSeq}`; // prefix for this face's held notes (pads, bars, auditions)
  const kbs = [];
  let last = {};
  const readReal = () => ({ ...synthDefaults(synthId), ...(store.instrument(inst).params || {}) });
  const readFace = () => {
    const r = readReal(), out = {};
    def.params.forEach((fp) => (out[fp.id] = toFace(fp, rdef[fp.id], r[fp.id])));
    return out;
  };
  last = readFace();
  const fire = (id) => {
    const p = pdef(def, id), v = last[id], n = toNorm(p, v);
    if (subs[id]) subs[id].forEach((f) => f(v, n));
    all.forEach((f) => f(id, v, n));
  };
  // anything that edits the instrument's params (roll sliders, MIDI CC, undo, presets, INIT)
  const refresh = () => {
    const now = readFace();
    def.params.forEach((fp) => {
      if (now[fp.id] !== last[fp.id]) {
        last[fp.id] = now[fp.id];
        fire(fp.id);
      }
    });
  };
  disposers.push(
    store.on("instrument", ({ i, prop }) => {
      if (i === inst && prop === "params") refresh();
    }),
  );
  const onNoteEvt = (e) => {
    if (e.detail.i !== inst) return;
    const ev = { type: e.detail.on ? "on" : "off", midi: e.detail.pitch, vel: 0.8 };
    noteSubs.forEach((f) => f(ev));
  };
  document.addEventListener("synth-note", onNoteEvt);
  disposers.push(() => document.removeEventListener("synth-note", onNoteEvt));

  const presetList = () =>
    (synth.presets || []).map((pr) => {
      const r = { ...synthDefaults(synthId), ...(pr.params || {}) }, values = {};
      def.params.forEach((fp) => (values[fp.id] = toFace(fp, rdef[fp.id], r[fp.id])));
      return { name: pr.name, cat: pr.cat, values };
    });
  const presets = presetList();
  const matchPreset = () => {
    const r = readReal();
    return (synth.presets || []).findIndex((pr) => {
      const t = { ...synthDefaults(synthId), ...(pr.params || {}) };
      return Object.keys(rdef).every((k) => t[k] === r[k]);
    });
  };
  let presetIdx = matchPreset();

  const P = {
    inst: synthId, params: def.params, presets, root, baseNote: 60,
    def: (id) => pdef(def, id),
    get: (id) => last[id],
    norm: (id) => toNorm(pdef(def, id), last[id]),
    fmt: (id) => fmtVal(pdef(def, id), last[id]),
    set(id, v) {
      const fp = pdef(def, id);
      if (!fp) return;
      v = fp.type === "select" ? clamp(Math.round(v), 0, fp.options.length - 1) : fp.type === "toggle" ? (v ? 1 : 0) : clamp(v, fp.min, fp.max);
      if (last[id] === v) return;
      presetIdx = -1;
      store.setInstrumentProp(inst, "params", { ...readReal(), [id]: toReal(fp, rdef[id], v) });
    },
    setNorm(id, n) { P.set(id, fromNorm(pdef(def, id), n)); },
    sub(id, fn) {
      (subs[id] = subs[id] || new Set()).add(fn);
      fn(last[id], P.norm(id));
      const u = () => subs[id].delete(fn);
      disposers.push(u);
      return u;
    },
    subAll(fn) {
      all.add(fn);
      const u = () => all.delete(fn);
      disposers.push(u);
      def.params.forEach((p) => fn(p.id, last[p.id], P.norm(p.id)));
      return u;
    },
    text(el, id) { P.sub(id, () => { el.textContent = P.fmt(id); }); },
    loadPreset(i, o) {
      if (!(o && o.force) && performance.now() - born < 300) return; // faces auto-pick preset 0 at build time; never overwrite the user's patch
      const pr = (synth.presets || [])[i];
      if (!pr) return;
      presetIdx = i;
      store.setInstrumentProp(inst, "params", { ...synthDefaults(synthId), ...(pr.params || {}) });
      presetSubs.forEach((f) => f(i, pr.name));
      P.noteOn(60, 0.8);
      setTimeout(() => P.noteOff(60), AUDITION * 1000);
    },
    onPreset(fn) {
      presetSubs.add(fn);
      const u = () => presetSubs.delete(fn);
      disposers.push(u);
      fn(presetIdx, presetIdx >= 0 ? presets[presetIdx].name : "");
      return u;
    },
    bind(el, id, o) {
      o = o || {};
      const p = pdef(def, id);
      if (!p) { console.warn("no param", id); return; }
      el.setAttribute("data-bind", id);
      el.tabIndex = 0;
      el.setAttribute("role", p.type === "toggle" ? "switch" : "slider");
      el.setAttribute("aria-label", p.label || id);
      const upd = (v, n) => {
        el.style.setProperty("--v", n);
        el.dataset.n = n.toFixed(4);
        if (p.type === "select") el.dataset.index = v;
        if (p.type === "toggle") { el.classList.toggle("on", !!v); el.setAttribute("aria-checked", !!v); }
        el.setAttribute("aria-valuenow", String(v));
        el.setAttribute("aria-valuetext", fmtVal(p, v));
      };
      P.sub(id, upd);
      let sy = 0, sx = 0, sn = 0, moved = false, drag = false;
      const absSet = (e) => {
        const r = el.getBoundingClientRect(), ax = o.axis || "y";
        const n = ax === "x" ? (e.clientX - r.left) / r.width : 1 - (e.clientY - r.top) / r.height;
        P.setNorm(id, o.invert ? 1 - n : n);
      };
      el.addEventListener("pointerdown", (e) => {
        if (e.button) return;
        el.setPointerCapture(e.pointerId);
        drag = true; moved = false; sy = e.clientY; sx = e.clientX; sn = P.norm(id);
        if (o.abs && p.type !== "toggle" && p.type !== "select") absSet(e);
        el.classList.add("drag");
        e.preventDefault();
        el.focus({ preventScroll: true });
      });
      el.addEventListener("pointermove", (e) => {
        if (!drag) return;
        if (p.type === "toggle" || p.type === "select") { moved = moved || Math.abs(e.clientY - sy) > 4; return; }
        if (o.abs) { absSet(e); return; }
        const rng = o.range || 170, ax = o.axis || "y";
        let d = ax === "x" ? (e.clientX - sx) / rng : (sy - e.clientY) / rng;
        if (o.invert) d = -d;
        if (e.shiftKey) d *= 0.2;
        moved = true;
        P.setNorm(id, sn + d);
      });
      const end = (e) => {
        if (!drag) return;
        drag = false;
        el.classList.remove("drag");
        if (p.type === "toggle" && !moved) P.set(id, last[id] ? 0 : 1);
        if (p.type === "select" && !moved) { const n = p.options.length; P.set(id, (last[id] + (e.shiftKey ? n - 1 : 1)) % n); }
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
      el.addEventListener("dblclick", () => P.set(id, p.def));
      el.addEventListener("wheel", (e) => {
        e.preventDefault();
        if (p.type === "select") { P.set(id, clamp(last[id] + (e.deltaY > 0 ? 1 : -1), 0, p.options.length - 1)); return; }
        if (p.type === "toggle") return;
        P.setNorm(id, P.norm(id) - e.deltaY * 0.0012);
      }, { passive: false });
      el.addEventListener("keydown", (e) => {
        const k = e.key; let dn = 0;
        if (k === "ArrowUp" || k === "ArrowRight") dn = 1; else if (k === "ArrowDown" || k === "ArrowLeft") dn = -1;
        if (!dn) { if (k === " " && p.type === "toggle") { e.preventDefault(); P.set(id, last[id] ? 0 : 1); } return; }
        e.preventDefault();
        if (p.type === "select") P.set(id, last[id] + dn); else P.setNorm(id, P.norm(id) + dn * 0.03);
      });
      return el;
    },
    bindXY(el, idX, idY) {
      el.tabIndex = 0;
      el.setAttribute("data-bind", idX + "," + idY);
      P.sub(idX, (v, n) => el.style.setProperty("--x", n));
      P.sub(idY, (v, n) => el.style.setProperty("--y", n));
      let drag = false;
      const set = (e) => {
        const r = el.getBoundingClientRect();
        P.setNorm(idX, (e.clientX - r.left) / r.width);
        P.setNorm(idY, 1 - (e.clientY - r.top) / r.height);
      };
      el.addEventListener("pointerdown", (e) => { el.setPointerCapture(e.pointerId); drag = true; el.classList.add("drag"); set(e); e.preventDefault(); });
      el.addEventListener("pointermove", (e) => { if (drag) set(e); });
      const end = () => { drag = false; el.classList.remove("drag"); };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
      el.addEventListener("dblclick", () => { P.set(idX, pdef(def, idX).def); P.set(idY, pdef(def, idY).def); });
      return el;
    },
    // notes go to the shared live-note path (held until noteOff); lights come back through synth-note
    noteOn(m, v) { noteOn(`${src}:${m}`, inst, m, v || 0.8); },
    noteOff(m) { if (m == null) allOff(`${src}:`); else noteOff(`${src}:${m}`); },
    onNote(fn) { noteSubs.add(fn); const u = () => noteSubs.delete(fn); disposers.push(u); return u; },
    // On-screen keyboard: glissando, multi-touch, held notes, shared octave shift (live-keys.js).
    keyboard(el, o) {
      o = o || {};
      const from = o.from == null ? 48 : o.from, oct = o.octaves || 3;
      const whites = [0, 2, 4, 5, 7, 9, 11], blackAt = { 0: 1, 2: 3, 5: 6, 7: 8, 9: 10 };
      el.innerHTML = "<style>.kb{position:relative;display:flex;width:100%;height:100%;user-select:none;-webkit-user-select:none;touch-action:none;-webkit-touch-callout:none}.kb-w{flex:1;position:relative;background:#f4f4f4;border:1px solid #444;border-top:0;border-radius:0 0 4px 4px;transition:background-color 60ms}.kb-w.on{background:#bbb;transition:none}.kb-b{position:absolute;top:0;height:62%;width:var(--bw,3.4%);background:#1a1a1a;border-radius:0 0 3px 3px;z-index:2;transition:background-color 60ms}.kb-b.on{background:#555;transition:none}</style>";
      const kb = document.createElement("div");
      kb.className = "kb";
      el.appendChild(kb);
      const total = oct * 7;
      let wi = 0;
      const mk = (cls, base) => { const d = document.createElement("div"); d.className = cls; d.dataset.base = base; return d; };
      for (let k = 0; k < oct; k++) whites.forEach((semi) => {
        const m = from + 12 * k + semi;
        kb.appendChild(mk("kb-w", m));
        if (blackAt[semi] != null) {
          const b = mk("kb-b", m + 1);
          b.style.left = ((wi + 1) / total) * 100 + "%";
          b.style.marginLeft = "calc(var(--bw,3.4%) / -2)";
          kb.appendChild(b);
        }
        wi++;
      });
      kb.appendChild(mk("kb-w", from + 12 * oct));
      kb.style.setProperty("--bw", (100 / (total + 1)) * 0.62 + "%");
      const keys = [...kb.children].filter((n) => n.dataset.base);
      const lit = new Map(); // midi -> number of notes sounding it
      const paint = () => keys.forEach((n) => n.classList.toggle("on", (lit.get(+n.dataset.midi) || 0) > 0));
      const renumber = () => {
        const off = keyOffset();
        keys.forEach((n) => { n.dataset.midi = +n.dataset.base + off; });
        paint();
      };
      renumber();
      const h = attachKeyboard(kb, {
        inst: () => inst,
        keyAt: (n) => { const k = n.closest && n.closest("[data-midi]"); return k && kb.contains(k) ? { midi: +k.dataset.midi, el: k } : null; },
      });
      kbs.push(h);
      const onOct = () => renumber();
      document.addEventListener("live-octave", onOct);
      disposers.push(() => document.removeEventListener("live-octave", onOct));
      P.onNote((ev) => {
        const c = (lit.get(ev.midi) || 0) + (ev.type === "on" ? 1 : -1);
        if (c > 0) lit.set(ev.midi, c); else lit.delete(ev.midi);
        const n = kb.querySelector('[data-midi="' + ev.midi + '"]');
        if (n) n.classList.toggle("on", c > 0);
      });
      return kb;
    },
    // Any fixed layout of [data-midi] elements (mallet bars, pads) played like a keyboard.
    surface(el, o) {
      o = o || {};
      const h = attachKeyboard(el, {
        inst: () => inst,
        velAt: o.velAt,
        keyAt: (n) => { const k = n.closest && n.closest("[data-midi]"); return k && el.contains(k) ? { midi: +k.dataset.midi, el: k } : null; },
      });
      kbs.push(h);
      el.dataset.fixedKeys = "1"; // fixed layout: does not follow the octave shift
      const lit = new Map();
      P.onNote((ev) => {
        const c = (lit.get(ev.midi) || 0) + (ev.type === "on" ? 1 : -1);
        if (c > 0) lit.set(ev.midi, c); else lit.delete(ev.midi);
        el.querySelectorAll('[data-midi="' + ev.midi + '"]').forEach((n) => n.classList.toggle("on", c > 0));
      });
      return h;
    },
    raf(fn) {
      let id = 0, dead = false;
      const loop = (t) => { if (dead) return; try { fn(t); } catch (e) { console.warn(e); } id = requestAnimationFrame(loop); };
      id = requestAnimationFrame(loop);
      disposers.push(() => { dead = true; cancelAnimationFrame(id); });
    },
    scope(cv, o) {
      o = o || {};
      const c = cv.getContext("2d"), buf = new Float32Array(1024);
      P.raf(() => {
        const W = cv.width, H = cv.height, analyser = analyserFor(inst);
        c.clearRect(0, 0, W, H);
        if (o.bg) { c.fillStyle = o.bg; c.fillRect(0, 0, W, H); }
        if (o.grid) { c.strokeStyle = o.grid; c.lineWidth = 1; c.beginPath(); for (let i = 1; i < 8; i++) { c.moveTo((W * i) / 8, 0); c.lineTo((W * i) / 8, H); } for (let j = 1; j < 4; j++) { c.moveTo(0, (H * j) / 4); c.lineTo(W, (H * j) / 4); } c.stroke(); }
        c.lineWidth = o.width || 2; c.strokeStyle = o.color || "#fff";
        if (o.glow) { c.shadowColor = o.color || "#fff"; c.shadowBlur = o.glow; }
        c.beginPath();
        if (analyser) {
          analyser.getFloatTimeDomainData(buf);
          let s = 0;
          for (let i = 1; i < 512 && !(buf[i - 1] < 0 && buf[i] >= 0); i++) s = i;
          s = s >= 511 ? 0 : s;
          for (let i = 0; i < 512; i++) { const x = (i / 511) * W, y = H / 2 - buf[s + i] * H * 0.45 * (o.gain || 2.2); i ? c.lineTo(x, y) : c.moveTo(x, y); }
        } else { c.moveTo(0, H / 2); c.lineTo(W, H / 2); }
        c.stroke();
        c.shadowBlur = 0;
      });
    },
    spectrum(cv, o) {
      o = o || {};
      const c = cv.getContext("2d"), buf = new Uint8Array(1024), nb = o.bars || 32;
      P.raf(() => {
        const W = cv.width, H = cv.height, analyser = analyserFor(inst);
        c.clearRect(0, 0, W, H);
        if (o.bg) { c.fillStyle = o.bg; c.fillRect(0, 0, W, H); }
        if (analyser) analyser.getByteFrequencyData(buf); else buf.fill(0);
        const bw = W / nb, gap = o.gap == null ? 2 : o.gap;
        for (let i = 0; i < nb; i++) {
          const a = Math.floor(Math.pow(i / nb, 2) * 300), b = Math.max(a + 1, Math.floor(Math.pow((i + 1) / nb, 2) * 300));
          let m = 0;
          for (let k = a; k < b; k++) m = Math.max(m, buf[k]);
          const h = (m / 255) * H;
          c.fillStyle = o.color2 && i % 2 ? o.color2 : o.color || "#fff";
          c.fillRect(i * bw + gap / 2, H - h, bw - gap, h);
        }
      });
    },
    level() {
      const a = analyserFor(inst);
      if (!a) return 0;
      const b = new Uint8Array(256);
      a.getByteTimeDomainData(b);
      let m = 0;
      for (let i = 0; i < 256; i++) m = Math.max(m, Math.abs(b[i] - 128));
      return m / 128;
    },
    randomise() {
      const r = readReal();
      def.params.forEach((fp) => {
        if (fp.type === "select") return;
        r[fp.id] = toReal(fp, rdef[fp.id], fromNorm(fp, 0.12 + Math.random() * 0.76));
      });
      store.setInstrumentProp(inst, "params", r);
    },
    dispose() {
      kbs.forEach((k) => k.release());
      allOff(`${src}:`);
      disposers.forEach((f) => f());
      disposers.length = 0;
      all.clear();
      Object.keys(subs).forEach((k) => subs[k].clear());
      noteSubs.clear();
      presetSubs.clear();
    },
  };
  return P;
}

export const Kit = {
  audio: { analyser: () => (curInst == null ? null : analyserFor(curInst)) },
  register(id, def) {
    def.params.forEach((p) => {
      p.type = p.type || (p.options ? "select" : "knob");
      if (p.def == null) p.def = p.type === "knob" ? p.min + (p.max - p.min) * 0.5 : 0;
    });
    REG[id] = def;
    addFonts(def.fonts);
  },
  has: (id) => !!REG[id],
  size(id) {
    const d = REG[id];
    return d ? { w: d.faces[0].w || d.w || 960, h: d.faces[0].h || d.h || 560 } : null;
  },
  // Renders the registered face for `synthId` into `host`, bound to instrument slot `inst`.
  mount(host, synthId, inst) {
    host.textContent = "";
    const def = REG[synthId];
    if (!def) return null;
    const face = def.faces[0];
    const w = face.w || def.w || 960, h = face.h || def.h || 560;
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:relative;overflow:hidden;width:100%;";
    const stage = document.createElement("div");
    stage.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;transform-origin:0 0;`;
    wrap.appendChild(stage);
    host.appendChild(wrap);
    const sh = stage.attachShadow({ mode: "open" });
    const base = document.createElement("style");
    base.textContent = "*{box-sizing:border-box}button,input,select{font:inherit}[data-bind]{touch-action:none;user-select:none;-webkit-user-select:none;cursor:ns-resize;outline:none}[data-bind]:focus-visible{outline:2px solid #fff8;outline-offset:2px}:host{all:initial}";
    const root = document.createElement("div");
    root.style.cssText = `position:relative;width:${w}px;height:${h}px;overflow:hidden;`;
    sh.appendChild(base);
    sh.appendChild(root);
    curInst = inst;
    const P = makeP(synthId, inst, def, root);
    const fit = () => {
      const maxH = Math.max(240, window.innerHeight * 0.96 - 92);
      const s = Math.min(host.clientWidth / w, maxH / h, 1.4) || 1;
      stage.style.transform = `scale(${s})`;
      wrap.style.height = h * s + "px";
    };
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    window.addEventListener("resize", fit);
    fit();
    try {
      face.build(root, P);
    } catch (e) {
      console.error(e);
      root.innerHTML = '<pre style="color:#f66;padding:20px;white-space:pre-wrap">' + String((e && e.stack) || e) + "</pre>";
    }
    return {
      P,
      refit: fit,
      dispose() {
        ro.disconnect();
        window.removeEventListener("resize", fit);
        P.dispose();
        host.textContent = "";
        if (curInst === inst) curInst = null;
      },
    };
  },
};
