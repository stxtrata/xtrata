// plugin-faces/runtime.js — hosts the full-size plugin faces inside the DAW's chain panel.
//
// A face module calls `Kit.register(typeId, { fonts, w, h, presets, faces:[face] })`.
// `Kit.mount(host, typeId, link)` renders the face bound to ONE slot of a chain through `link`:
//   link.getParams() -> real param object      link.setParams(obj) -> write + apply (undoable)
//   link.getEnabled()/setEnabled(b)            link.onChange(fn) -> unsubscribe (external edits)
//   link.inst() -> live engine instance {nodes}   link.taps() -> {inAn,outAn} analysers
// Face-native values: knobs are real units, selects are an INDEX into the option list.
import { PLUGIN_TYPES } from "../plugins.js";

const REG = {};
const fontsDone = new Set();
function addFonts(q) {
  if (!q || fontsDone.has(q)) return;
  fontsDone.add(q);
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?" + q + "&display=swap";
  document.head.appendChild(l);
}
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const BYPASS = { id: '__bypass', key: '__bypass', label: 'Effect', fullLabel: 'Effect', type: 'toggle', min: 0, max: 1, def: 1 };

/* ------------------------------------------------------------------ params */
const DB_KEYS = /^(out|input|ceiling|threshold|range|hysteresis|tilt|mid2?|low|high|lowBoost|lowAtten|highBoost|highAtten|drive)$/;
function inferUnit(rp) {
  const k = rp.key;
  if (rp.log && rp.min >= 15 && rp.max >= 200) return 'Hz';
  if (DB_KEYS.test(k) && !(k === 'drive' && rp.max <= 1)) return 'dB';
  if (k === 'knee' && rp.max > 1) return 'dB';
  return '';
}
function decimalsOf(step) {
  if (!step) return null;
  const s = String(step); const i = s.indexOf('.');
  if (s.indexOf('e-') >= 0) return parseInt(s.split('e-')[1], 10);
  return i < 0 ? 0 : s.length - i - 1;
}
function trimZ(s) { return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }
function autoFmt(p, v) {
  const u = p.unit || '';
  const st = decimalsOf(p.step);
  const range = Math.abs(p.max - p.min);
  const dec = st != null ? Math.min(st, 3) : (range < 2 ? 2 : range < 20 ? 1 : 0);
  const sign = p.min < 0 && v > 0 ? '+' : '';
  if (/^db$/i.test(u)) return sign + v.toFixed(Math.min(dec, 1)) + ' dB';
  if (u === 's') return v < 0.0095 ? (v * 1000).toFixed(1) + ' ms' : v < 1 ? Math.round(v * 1000) + ' ms' : trimZ(v.toFixed(2)) + ' s';
  if (u === 'ms') return trimZ(v.toFixed(v < 10 ? 1 : 0)) + ' ms';
  if (/^khz$/i.test(u)) return trimZ(v.toFixed(2)) + ' kHz';
  if (/^hz$/i.test(u)) return v >= 1000 ? trimZ((v / 1000).toFixed(v >= 10000 ? 1 : 2)) + ' kHz' : (v < 100 ? trimZ(v.toFixed(1)) : Math.round(v)) + ' Hz';
  if (u === '%') return sign + Math.round(v) + '%';
  if (u) return sign + trimZ(v.toFixed(dec)) + ' ' + u;
  if (p.key === 'ratio') return trimZ(v.toFixed(1)) + ':1';
  if (p.min === 0 && p.max === 1) return Math.round(v * 100) + '%';
  return sign + v.toFixed(dec);
}
function fmtVal(p, v) {
  if (p.type === 'select') {
    if (p.fmt) { try { return String(p.fmt(v, p.optValues[v])); } catch (e) { /* fall through */ } }
    return p.options[v];
  }
  if (p.id === '__bypass') return v ? 'On' : 'Bypass';
  if (p.type === 'toggle') return v ? 'On' : 'Off';
  if (p.fmt) { try { return String(p.fmt(v)); } catch (e) { console.warn('fmt failed for ' + p.id, e); } }
  return autoFmt(p, v);
}
function toNorm(p, v) {
  if (p.type === 'select') return p.options.length > 1 ? v / (p.options.length - 1) : 0;
  if (p.type === 'toggle') return v ? 1 : 0;
  if (p.log && p.min > 0) return clamp(Math.log(v / p.min) / Math.log(p.max / p.min), 0, 1);
  return clamp((v - p.min) / (p.max - p.min || 1), 0, 1);
}
function fromNorm(p, n) {
  n = clamp(n, 0, 1);
  if (p.type === 'select') return Math.round(n * (p.options.length - 1));
  if (p.type === 'toggle') return n >= 0.5 ? 1 : 0;
  let v = p.log && p.min > 0 ? p.min * Math.pow(p.max / p.min, n) : p.min + n * (p.max - p.min);
  return snap(p, v);
}
function snap(p, v) {
  if (p.step) {
    v = Math.round((v - p.min) / p.step) * p.step + p.min;
    const d = decimalsOf(p.step); if (d != null) v = +v.toFixed(Math.min(d, 6));
  }
  return clamp(v, p.min, p.max);
}
function pdef(def, id) { return id === '__bypass' ? BYPASS : def.params.find(p => p.id === id); }

function deriveParams(id, def) {
  const T = PLUGIN_TYPES[id];
  if (!T) { console.error('Kit.register(' + id + '): no such plugin type in PLUGIN_TYPES'); return []; }
  const labels = def.labels || {}, fmts = def.fmts || {};
  return (T.params || []).map(rp => {
    const raw = rp.label || rp.key;
    const m = /\s*\(([^)]*)\)\s*$/.exec(raw);
    const label = labels[rp.key] || (m ? raw.replace(m[0], '') : raw);
    const base = { id: rp.key, key: rp.key, label, fullLabel: raw, fmt: fmts[rp.key] };
    if (rp.options) {
      const optValues = rp.options.map(o => Array.isArray(o) ? o[0] : o);
      const options = rp.options.map(o => String(Array.isArray(o) ? o[1] : o));
      let di = optValues.findIndex(v => String(v) === String(rp.def)); if (di < 0) di = 0;
      return Object.assign(base, { type: 'select', options, optValues, def: di });
    }
    return Object.assign(base, {
      type: 'knob', min: rp.min, max: rp.max, step: rp.step, def: rp.def,
      log: !!rp.log && rp.min > 0, unit: m ? m[1].trim() : inferUnit(rp),
    });
  });
}

/* real value (as stored in a preset / sent to the plugin) <-> face-native value */
function toNative(p, real) {
  if (p.type === 'select') { const i = p.optValues.findIndex(v => String(v) === String(real)); return i; }
  return clamp(+real, p.min, p.max);
}
function toReal(p, native) { return p.type === 'select' ? p.optValues[native] : native; }

const BUF = { in: null, out: null };
const FBUF = { in: null, out: null };

function validatePresets(id, def) {
  const clean = [];
  (def.presets || []).forEach((pr) => {
    if (!pr || typeof pr.name !== "string") return;
    const vals = {};
    Object.keys(pr.values || {}).forEach((k) => {
      const p = def.params.find((q) => q.id === k);
      const v = pr.values[k];
      if (!p) return;
      if (p.type === "select") { if (toNative(p, v) >= 0) vals[k] = v; }
      else if (typeof v === "number" && isFinite(v)) vals[k] = clamp(v, p.min, p.max);
    });
    clean.push({ name: pr.name, values: vals });
  });
  def.presets = clean;
}

function makeP(typeId, def, root, link) {
  const T = PLUGIN_TYPES[typeId];
  const subs = {};
  const all = new Set();
  const disposers = [];
  const presetSubs = new Set();
  let vals = {};
  let presetIdx = -1;
  const readAll = () => {
    const real = link.getParams();
    def.params.forEach((p) => {
      const n = toNative(p, real[p.id]);
      vals[p.id] = n < 0 || (p.type !== "select" && !isFinite(n)) ? p.def : n;
    });
  };
  readAll();
  const getv = (id) => (id === "__bypass" ? (link.getEnabled() ? 1 : 0) : vals[id]);
  const fire = (id) => {
    const p = pdef(def, id);
    const v = getv(id);
    const n = toNorm(p, v);
    if (subs[id]) subs[id].forEach((f) => f(v, n));
    all.forEach((f) => f(id, v, n));
  };
  const fireAll = () => { def.params.forEach((p) => fire(p.id)); fire("__bypass"); };
  const taps = () => link.taps();
  const timeData = (tap) => {
    tap = tap === "in" ? "in" : "out";
    const t = taps();
    const an = t && (tap === "in" ? t.inAn : t.outAn);
    if (!an) return null;
    if (!BUF[tap] || BUF[tap].length !== an.fftSize) BUF[tap] = new Float32Array(an.fftSize);
    an.getFloatTimeDomainData(BUF[tap]);
    return BUF[tap];
  };
  const cache = { in: {}, out: {} };
  const peakOf = (tap) => {
    tap = tap === "in" ? "in" : "out";
    const c = cache[tap];
    const now = performance.now();
    if (c.t != null && now - c.t < 6) return c.v;
    const b = timeData(tap);
    let m = 0;
    if (b) { const n = Math.min(1024, b.length); for (let i = b.length - n; i < b.length; i++) { const a = Math.abs(b[i]); if (a > m) m = a; } }
    c.t = now; c.v = m;
    return m;
  };
  const bandDb = (tap, n, fMin, fMax) => {
    tap = tap === "in" ? "in" : "out";
    const out = new Float32Array(n).fill(-100);
    const t = taps();
    const an = t && (tap === "in" ? t.inAn : t.outAn);
    if (!an) return out;
    if (!FBUF[tap] || FBUF[tap].length !== an.frequencyBinCount) FBUF[tap] = new Float32Array(an.frequencyBinCount);
    const c = cache[tap], now = performance.now();
    if (c.ft == null || now - c.ft >= 6) { an.getFloatFrequencyData(FBUF[tap]); c.ft = now; }
    const f = FBUF[tap];
    const nyq = an.context.sampleRate / 2, bins = f.length;
    for (let i = 0; i < n; i++) {
      const f0 = fMin * Math.pow(fMax / fMin, i / n), f1 = fMin * Math.pow(fMax / fMin, (i + 1) / n);
      let a = Math.floor((f0 / nyq) * bins), b = Math.max(a + 1, Math.ceil((f1 / nyq) * bins));
      a = clamp(a, 0, bins - 1); b = clamp(b, a + 1, bins);
      let m = -200;
      for (let k = a; k < b; k++) if (f[k] > m) m = f[k];
      out[i] = Math.max(-100, m);
    }
    return out;
  };
  const mountedAt = performance.now();
  const P = {
    inst: typeId, type: T, params: def.params, presets: def.presets || [], root,
    def: (id) => pdef(def, id),
    get: (id) => getv(id),
    norm: (id) => toNorm(pdef(def, id), getv(id)),
    fmt: (id) => fmtVal(pdef(def, id), getv(id)),
    real: (id) => toReal(pdef(def, id), getv(id)),
    set(id, v) {
      const p = pdef(def, id);
      if (!p) return;
      if (id === "__bypass") { link.setEnabled(!!v); fire("__bypass"); return; }
      v = p.type === "select" ? clamp(Math.round(v), 0, p.options.length - 1) : p.type === "toggle" ? (v ? 1 : 0) : snap(p, v);
      if (vals[id] === v) return;
      vals[id] = v;
      link.setParams({ [id]: toReal(p, v) });
      fire(id);
    },
    setNorm(id, n) { P.set(id, fromNorm(pdef(def, id), n)); },
    sub(id, fn) { (subs[id] = subs[id] || new Set()).add(fn); fn(getv(id), P.norm(id)); const u = () => subs[id].delete(fn); disposers.push(u); return u; },
    subAll(fn) { all.add(fn); const u = () => all.delete(fn); disposers.push(u); def.params.forEach((p) => fn(p.id, getv(p.id), P.norm(p.id))); return u; },
    text(el, id) { P.sub(id, () => { el.textContent = P.fmt(id); }); },
    loadPreset(i) {
      // faces call loadPreset(0) on mount when no preset is active; never let that overwrite the user's sound
      if (performance.now() - mountedAt < 300) return;
      const pr = (def.presets || [])[i];
      if (!pr) return;
      const o = {};
      def.params.forEach((p) => {
        const nv = pr.values && pr.values[p.id] !== undefined ? toNative(p, pr.values[p.id]) : p.def;
        vals[p.id] = nv;
        o[p.id] = toReal(p, nv);
      });
      presetIdx = i;
      link.setParams(o);
      def.params.forEach((p) => fire(p.id));
      presetSubs.forEach((f) => f(i, pr.name));
    },
    resetAll() {
      const o = {};
      def.params.forEach((p) => { vals[p.id] = p.def; o[p.id] = toReal(p, p.def); });
      presetIdx = -1;
      link.setParams(o);
      fireAll();
    },
    onPreset(fn) {
      presetSubs.add(fn);
      const u = () => presetSubs.delete(fn);
      disposers.push(u);
      fn(presetIdx, presetIdx < 0 ? "" : (def.presets[presetIdx] || {}).name || "");
      return u;
    },
    bind(el, id, o) {
      o = o || {};
      const p = pdef(def, id);
      if (!p) { console.warn("no param", id); return; }
      el.setAttribute("data-bind", id); el.tabIndex = 0;
      el.setAttribute("role", p.type === "toggle" ? "switch" : "slider");
      el.setAttribute("aria-label", p.label || id);
      const upd = (v, n) => {
        el.style.setProperty("--v", n); el.dataset.n = n.toFixed(4);
        if (p.type === "select") el.dataset.index = v;
        if (p.type === "toggle") { el.classList.toggle("on", !!v); el.setAttribute("aria-checked", !!v); }
        el.setAttribute("aria-valuenow", String(v)); el.setAttribute("aria-valuetext", fmtVal(p, v));
      };
      P.sub(id, upd);
      let sy = 0, sx = 0, sn = 0, moved = false, drag = false;
      const absSet = (e) => {
        const r = el.getBoundingClientRect(); const ax = o.axis || "y";
        const n = ax === "x" ? (e.clientX - r.left) / r.width : 1 - (e.clientY - r.top) / r.height;
        P.setNorm(id, o.invert ? 1 - n : n);
      };
      el.addEventListener("pointerdown", (e) => {
        if (e.button) return;
        try { el.setPointerCapture(e.pointerId); } catch (x) { /* synthetic */ }
        drag = true; moved = false; sy = e.clientY; sx = e.clientX; sn = P.norm(id);
        if (o.abs && p.type !== "toggle" && p.type !== "select") absSet(e);
        el.classList.add("drag"); e.preventDefault(); el.focus({ preventScroll: true });
      });
      el.addEventListener("pointermove", (e) => {
        if (!drag) return;
        if (p.type === "toggle" || p.type === "select") { moved = moved || Math.abs(e.clientY - sy) > 4; return; }
        if (o.abs) { absSet(e); return; }
        const rng = o.range || 170, ax = o.axis || "y";
        let d = ax === "x" ? (e.clientX - sx) / rng : (sy - e.clientY) / rng;
        if (o.invert) d = -d;
        if (e.shiftKey) d *= 0.2;
        moved = true; P.setNorm(id, sn + d);
      });
      const end = (e) => {
        if (!drag) return;
        drag = false; el.classList.remove("drag");
        if (p.type === "toggle" && !moved) P.set(id, getv(id) ? 0 : 1);
        if (p.type === "select" && !moved) { const n = p.options.length; P.set(id, (getv(id) + (e.shiftKey ? n - 1 : 1)) % n); }
      };
      el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
      el.addEventListener("dblclick", () => { if (p.type !== "toggle") P.set(id, p.def); });
      el.addEventListener("wheel", (e) => {
        e.preventDefault();
        if (p.type === "select") { const n = p.options.length; P.set(id, clamp(getv(id) + (e.deltaY > 0 ? 1 : -1), 0, n - 1)); return; }
        if (p.type === "toggle") return;
        P.setNorm(id, P.norm(id) - e.deltaY * 0.0012);
      }, { passive: false });
      el.addEventListener("keydown", (e) => {
        const k = e.key; let dn = 0;
        if (k === "ArrowUp" || k === "ArrowRight") dn = 1; else if (k === "ArrowDown" || k === "ArrowLeft") dn = -1;
        if (!dn) { if (k === " " && p.type === "toggle") { e.preventDefault(); P.set(id, getv(id) ? 0 : 1); } return; }
        e.preventDefault();
        if (p.type === "select") P.set(id, getv(id) + dn); else P.setNorm(id, P.norm(id) + dn * 0.03);
      });
      return el;
    },
    bindXY(el, idX, idY) {
      el.tabIndex = 0; el.setAttribute("data-bind", idX + "," + idY);
      P.sub(idX, (v, n) => el.style.setProperty("--x", n)); P.sub(idY, (v, n) => el.style.setProperty("--y", n));
      let drag = false;
      const set = (e) => { const r = el.getBoundingClientRect(); P.setNorm(idX, (e.clientX - r.left) / r.width); P.setNorm(idY, 1 - (e.clientY - r.top) / r.height); };
      el.addEventListener("pointerdown", (e) => { try { el.setPointerCapture(e.pointerId); } catch (x) { /* synthetic */ } drag = true; el.classList.add("drag"); set(e); e.preventDefault(); });
      el.addEventListener("pointermove", (e) => { if (drag) set(e); });
      const end = () => { drag = false; el.classList.remove("drag"); };
      el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
      el.addEventListener("dblclick", () => { P.set(idX, pdef(def, idX).def); P.set(idY, pdef(def, idY).def); });
      return el;
    },
    bypass: {
      get: () => link.getEnabled(), set: (b) => { link.setEnabled(!!b); fire("__bypass"); }, toggle: () => { link.setEnabled(!link.getEnabled()); fire("__bypass"); },
      sub(fn) { const f = () => fn(link.getEnabled()); fn(link.getEnabled()); (subs.__bypass = subs.__bypass || new Set()).add(f); const u = () => subs.__bypass.delete(f); disposers.push(u); return u; },
    },
    engaged: () => link.getEnabled(),
    meter() {
      const o = {};
      const it = link.inst();
      if (T && typeof T.meter === "function" && it && it.nodes) {
        try { Object.assign(o, T.meter(it.nodes) || {}); } catch (e) { /* ignore */ }
      }
      if (o.inPeak == null) o.inPeak = peakOf("in");
      if (o.outPeak == null) o.outPeak = peakOf("out");
      return o;
    },
    hasResponse: !!(T && typeof T.response === "function"),
    response(freqs) {
      const it = link.inst();
      if (!T || typeof T.response !== "function" || !it || !it.nodes) return null;
      const f = freqs instanceof Float32Array ? freqs : Float32Array.from(freqs);
      try { return T.response(it.nodes, f); } catch (e) { return null; }
    },
    toDb: (x) => 20 * Math.log10(Math.max(1e-6, x)),
    timeData: (tap) => timeData(tap),
    freqData: (tap, n, fMin, fMax) => bandDb(tap, n || 64, fMin || 30, fMax || 18000),
    level: (tap) => clamp(peakOf(tap), 0, 1),
    sampleRate: () => { const t = taps(); return t ? t.inAn.context.sampleRate : 48000; },
    raf(fn) { let id = 0, dead = false; const loop = (t) => { if (dead) return; try { fn(t); } catch (e) { /* keep drawing */ } id = requestAnimationFrame(loop); }; id = requestAnimationFrame(loop); disposers.push(() => { dead = true; cancelAnimationFrame(id); }); },
    scope(cv, o) {
      o = o || {};
      const c = cv.getContext("2d"); const tap = o.tap === "in" ? "in" : "out";
      P.raf(() => {
        const W = cv.width, H = cv.height; c.clearRect(0, 0, W, H);
        if (o.bg) { c.fillStyle = o.bg; c.fillRect(0, 0, W, H); }
        if (o.grid) { c.strokeStyle = o.grid; c.lineWidth = 1; c.beginPath(); for (let i = 1; i < 8; i++) { c.moveTo((W * i) / 8, 0); c.lineTo((W * i) / 8, H); } for (let j = 1; j < 4; j++) { c.moveTo(0, (H * j) / 4); c.lineTo(W, (H * j) / 4); } c.stroke(); }
        c.lineWidth = o.width || 2; c.strokeStyle = o.color || "#fff"; if (o.glow) { c.shadowColor = o.color || "#fff"; c.shadowBlur = o.glow; }
        c.beginPath();
        const b = timeData(tap);
        if (b) {
          const n = o.samples || 1024, len = b.length; let s = len - n;
          for (let i = len - n - 1536; i < len - n; i++) { if (i > 0 && b[i - 1] < 0 && b[i] >= 0) { s = i; break; } }
          const g = o.gain || 1.6;
          for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * W, y = H / 2 - clamp(b[s + i] * g, -1, 1) * H * 0.48; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        } else { c.moveTo(0, H / 2); c.lineTo(W, H / 2); }
        c.stroke(); c.shadowBlur = 0;
      });
    },
    spectrum(cv, o) {
      o = o || {};
      const c = cv.getContext("2d"); const nb = o.bars || 48; const tap = o.tap === "in" ? "in" : "out";
      const lo = o.floor == null ? -80 : o.floor, hi = o.ceil == null ? -10 : o.ceil;
      P.raf(() => {
        const W = cv.width, H = cv.height; c.clearRect(0, 0, W, H);
        if (o.bg) { c.fillStyle = o.bg; c.fillRect(0, 0, W, H); }
        const d = bandDb(tap, nb, o.fMin || 30, o.fMax || 18000);
        const bw = W / nb, gap = o.gap == null ? 2 : o.gap;
        for (let i = 0; i < nb; i++) {
          const h = clamp((d[i] - lo) / (hi - lo), 0, 1) * H;
          c.fillStyle = o.color2 && i % 2 ? o.color2 : o.color || "#fff";
          c.fillRect(i * bw + gap / 2, H - h, Math.max(1, bw - gap), h);
        }
      });
    },
    noteOn() {}, noteOff() {}, onNote() { return () => {}; }, keyboard(el) { if (el) el.textContent = ""; },
    dispose() { disposers.forEach((f) => f()); disposers.length = 0; all.clear(); Object.keys(subs).forEach((k) => subs[k].clear()); presetSubs.clear(); },
  };
  // edits made elsewhere (chain sliders, undo, project load) reach the face
  disposers.push(link.onChange(() => { readAll(); fireAll(); }));
  return P;
}

export const Kit = {
  register(id, def) {
    def = def || {};
    def.params = deriveParams(id, def);
    def.faces = (def.faces || []).filter(Boolean);
    validatePresets(id, def);
    REG[id] = def;
    addFonts(def.fonts);
    return def;
  },
  has: (id) => !!REG[id] && !!REG[id].faces.length,
  size(id) {
    const d = REG[id];
    return d && d.faces[0] ? { w: d.faces[0].w || d.w || 960, h: d.faces[0].h || d.h || 560 } : null;
  },
  // Renders the registered face for `typeId` into `host`, bound to a chain slot through `link`.
  mount(host, typeId, link, opts) {
    host.textContent = "";
    const def = REG[typeId];
    if (!def || !def.faces[0]) return null;
    const face = def.faces[0];
    const w = face.w || def.w || 960, h = face.h || def.h || 560;
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:relative;overflow:hidden;margin:0 auto;";
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
    const P = makeP(typeId, def, root, link);
    const maxH = () => Math.max(240, window.innerHeight * ((opts && opts.heightFrac) || 0.96) - ((opts && opts.chrome) || 100));
    const fit = () => {
      const s = Math.min(host.clientWidth / w, maxH() / h, 1.5) || 1;
      stage.style.transform = `scale(${s})`;
      wrap.style.height = h * s + "px";
      wrap.style.width = w * s + "px";
    };
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    window.addEventListener("resize", fit);
    fit();
    try { face.build(root, P); }
    catch (e) { console.error(e); root.innerHTML = '<pre style="color:#f66;padding:20px;white-space:pre-wrap">' + String((e && e.stack) || e) + "</pre>"; }
    return { P, refit: fit, dispose() { ro.disconnect(); window.removeEventListener("resize", fit); P.dispose(); host.textContent = ""; } };
  },
};
