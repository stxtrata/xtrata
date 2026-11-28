// mod-panel.js — the editor for the modulation kit (modulation.js): two LFOs
// and four routing slots for the instrument chosen in "Play instrument".
import { store } from "./state.js";
import { SYNTH_BANK, synthDefaults } from "./synths.js";
import { isProInstrument } from "./pro-instruments.js";
import { probeModTargets } from "./synths/voice-lifecycle.js";
import { normalizeMod, modActive, MOD_SHAPES, MOD_DIVS, MOD_SOURCES, MOD_HOST_TARGETS, MOD_MIN_HZ, MOD_MAX_HZ } from "./modulation.js";

const SHAPE_NAMES = { sine: "Sine", triangle: "Triangle", saw: "Saw down", ramp: "Ramp up", square: "Square", random: "Random steps" };
const SOURCE_NAMES = { lfo1: "LFO 1", lfo2: "LFO 2", velocity: "Velocity", key: "Key position" };
const probed = new Map();

// Targets the chosen instrument can be modulated on: [key, label] pairs.
export function modTargetsFor(i) {
  const instrument = store.instrument(i), id = instrument?.synthId, synth = SYNTH_BANK[id];
  if (!instrument || !synth) return [];
  if (instrument.sampler?.enabled || (isProInstrument(id) && id !== "valorium")) return [];
  let keys;
  if (id === "valorium") keys = ["cutoff", "level"];
  else { if (!probed.has(id)) probed.set(id, probeModTargets(synth, id, synthDefaults(id))); keys = probed.get(id); }
  const label = (key) => (Array.isArray(synth.params) ? synth.params : []).find((p) => p.key === key)?.label || key;
  return [...Object.entries(MOD_HOST_TARGETS), ...keys.map((key) => [key, label(key)])];
}

const STYLE = `
#mod-dialog{position:fixed;inset:auto 12px 12px auto;margin:0;z-index:60;width:min(430px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:var(--panel,#121820);color:var(--text,#d7e0ea);border:1px solid var(--border,#26303d);border-radius:10px;padding:12px;font:12px/1.4 var(--font-mono,monospace);box-shadow:0 12px 40px #000a}
#mod-dialog h2{font:600 13px var(--font-display,sans-serif);margin:0;letter-spacing:.06em}
#mod-dialog h3{font-size:11px;margin:12px 0 6px;color:var(--accent,#2edb84);text-transform:uppercase;letter-spacing:.08em}
#mod-dialog header{display:flex;align-items:center;justify-content:space-between;gap:8px}
#mod-dialog .mod-row{display:grid;gap:6px;align-items:center;margin-bottom:6px}
#mod-dialog .mod-lfo{grid-template-columns:48px 1fr 1fr 1fr}
#mod-dialog .mod-slot{grid-template-columns:1fr 1.3fr 1fr 44px}
#mod-dialog select,#mod-dialog input[type=range]{width:100%;min-width:0;min-height:30px}
#mod-dialog select{background:var(--panel-2,#1a222d);color:inherit;border:1px solid var(--border,#26303d);border-radius:6px;padding:2px 4px;font:inherit}
#mod-dialog output{text-align:right;color:var(--dim,#7b8794)}
#mod-dialog p{margin:8px 0 0;color:var(--dim,#7b8794)}
#mod-dialog button{min-height:30px}
@media (max-width:520px){#mod-dialog .mod-lfo{grid-template-columns:1fr 1fr}#mod-dialog .mod-slot{grid-template-columns:1fr 1fr}}
`;
const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };
const select = (options, value, label) => { const s = el("select", { ariaLabel: label }); for (const [v, text] of options) s.append(new Option(text, v)); s.value = value; return s; };

export function initModPanel({ getTarget, button }) {
  if (!document.getElementById("mod-style")) document.head.append(el("style", { id: "mod-style", textContent: STYLE }));
  const dialog = el("dialog", { id: "mod-dialog" });
  dialog.setAttribute("aria-label", "Modulation");
  document.body.append(dialog);
  const read = () => normalizeMod(store.instrument(getTarget())?.mod);
  const write = (change) => { const mod = read(); change(mod); store.setInstrumentProp(getTarget(), "mod", mod); };
  const badge = () => { const on = modActive(store.instrument(getTarget())?.mod); button.textContent = on ? "Modulation ●" : "Modulation"; button.setAttribute("aria-pressed", String(dialog.open)); };
  function paint() {
    badge();
    if (!dialog.open) return;
    const i = getTarget(), instrument = store.instrument(i), mod = read(), targets = modTargetsFor(i);
    const close = el("button", { type: "button", textContent: "Close" }); close.addEventListener("click", () => { dialog.close(); badge(); });
    dialog.replaceChildren(el("header", {}, el("h2", { textContent: `Modulation · ${instrument?.name || ""}` }), close));
    if (!targets.length) { dialog.append(el("p", { textContent: "Modulation is not available for this instrument yet. It works on the synths and on VALORIUM." })); return; }
    dialog.append(el("h3", { textContent: "LFOs" }));
    mod.lfos.forEach((l, k) => {
      const shape = select(MOD_SHAPES.map((s) => [s, SHAPE_NAMES[s]]), l.shape, `LFO ${k + 1} shape`);
      const rateOptions = [...Object.keys(MOD_DIVS).map((d) => [`div:${d}`, d]), ["hz", "Free (Hz)"]];
      const rate = select(rateOptions, l.sync ? `div:${l.div}` : "hz", `LFO ${k + 1} rate`);
      const hz = el("input", { type: "range", min: Math.log(MOD_MIN_HZ), max: Math.log(MOD_MAX_HZ), step: 0.01, value: Math.log(l.hz), ariaLabel: `LFO ${k + 1} speed` });
      const lock = select([["note", "Each note"], ["bar", "Song bar"]], l.lock, `LFO ${k + 1} starts on`);
      const third = l.sync ? lock : el("label", {}, hz, el("output", { textContent: `${l.hz.toFixed(l.hz < 10 ? 2 : 1)} Hz` }));
      shape.addEventListener("change", () => write((m) => { m.lfos[k].shape = shape.value; }));
      rate.addEventListener("change", () => write((m) => { if (rate.value === "hz") m.lfos[k].sync = false; else { m.lfos[k].sync = true; m.lfos[k].div = rate.value.slice(4); } }));
      hz.addEventListener("change", () => write((m) => { m.lfos[k].hz = Math.exp(+hz.value); }));
      hz.addEventListener("input", () => { third.querySelector("output").textContent = `${Math.exp(+hz.value).toFixed(Math.exp(+hz.value) < 10 ? 2 : 1)} Hz`; });
      lock.addEventListener("change", () => write((m) => { m.lfos[k].lock = lock.value; }));
      dialog.append(el("div", { className: "mod-row mod-lfo" }, el("strong", { textContent: `LFO ${k + 1}` }), shape, rate, third));
    });
    dialog.append(el("h3", { textContent: "Routing" }));
    mod.slots.forEach((s, k) => {
      const source = select(MOD_SOURCES.map((v) => [v, SOURCE_NAMES[v]]), s.source, `Slot ${k + 1} source`);
      const known = targets.some(([key]) => key === s.target);
      const target = select([["", "— off —"], ...targets, ...(s.target && !known ? [[s.target, `${s.target} (not on this synth)`]] : [])], s.target, `Slot ${k + 1} target`);
      const amount = el("input", { type: "range", min: -1, max: 1, step: 0.01, value: s.amount, ariaLabel: `Slot ${k + 1} amount` });
      const shown = el("output", { textContent: `${Math.round(s.amount * 100)}%` });
      source.addEventListener("change", () => write((m) => { m.slots[k].source = source.value; }));
      target.addEventListener("change", () => write((m) => { m.slots[k].target = target.value; if (target.value && !m.slots[k].amount) m.slots[k].amount = 0.25; }));
      amount.addEventListener("input", () => { shown.textContent = `${Math.round(+amount.value * 100)}%`; });
      amount.addEventListener("change", () => write((m) => { m.slots[k].amount = +amount.value; }));
      dialog.append(el("div", { className: "mod-row mod-slot" }, source, target, amount, shown));
    });
    dialog.append(el("p", { textContent: "Changes apply to the next note you play. Bar lock needs a tempo rate and the song playing." }));
  }
  button.addEventListener("click", () => { if (dialog.open) dialog.close(); else dialog.show(); paint(); });
  document.addEventListener("instrument-target", paint);
  store.on("instrument", ({ i, prop } = {}) => { if (i === getTarget() && (prop === "mod" || prop === "synthId" || prop === "name")) paint(); });
  store.on("load", paint);
  badge();
  return { paint, dialog };
}
