// Versioned, portable patches. A factory preset's identity does not depend on its
// menu position. User banks are isolated from both earlier workstation editions.
import { SYNTH_BANK, synthDefaults } from "./synths.js";
export const PRESET_VERSION = 2;
const STORAGE_KEY = "audionaut.beta.presets.v1";
const MAX_PRESETS = 1000;
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0).toString(36); };
export function migrateSynthPatch(synthId, raw = {}, { version = 1 } = {}) {
  const synth = SYNTH_BANK[synthId];
  if (!synth) throw new Error(`Unknown instrument: ${synthId}`);
  if (version > PRESET_VERSION) throw new Error("This preset needs a newer workstation.");
  const params = synthDefaults(synthId);
  for (const p of synth.params || []) {
    const value = raw?.[p.key];
    if (p.options) { const options = p.options.map((o) => Array.isArray(o) ? o[0] : o); if (options.includes(value)) params[p.key] = value; }
    else if (value != null && value !== "" && Number.isFinite(+value)) params[p.key] = Math.max(p.min, Math.min(p.max, +value));
  }
  return { version: PRESET_VERSION, synthId, params };
}
export function factoryPresets(synthId) {
  return (SYNTH_BANK[synthId]?.presets || []).map((p) => ({ ...migrateSynthPatch(synthId, p.params), id: `factory:${synthId}:${hash(p.name + JSON.stringify(p.params))}`, name: p.name, category: p.cat || "Factory", factory: true }));
}
function cleanPreset(raw) {
  if (!raw || typeof raw.name !== "string" || !raw.name.trim()) throw new Error("A preset needs a name.");
  const patch = migrateSynthPatch(raw.synthId, raw.params, { version: raw.version || 1 });
  const name = raw.name.trim().slice(0, 100);
  const id = typeof raw.id === "string" && /^user:[\w:-]{1,120}$/.test(raw.id) ? raw.id : `user:${patch.synthId}:${hash(name + JSON.stringify(patch.params))}`;
  return { ...patch, id, name, category: typeof raw.category === "string" ? raw.category.slice(0, 80) : "User", updatedAt: Number(raw.updatedAt) || Date.now() };
}
export function listUserPresets(synthId) {
  let rows = [];
  try { rows = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) || "[]"); } catch { /* unavailable or old corrupt storage */ }
  if (!Array.isArray(rows)) return [];
  return rows.slice(0, MAX_PRESETS).flatMap((row) => { try { const p = cleanPreset(row); return !synthId || p.synthId === synthId ? [p] : []; } catch { return []; } });
}
function write(rows) {
  if (rows.length > MAX_PRESETS) throw new Error(`A bank can contain at most ${MAX_PRESETS} presets.`);
  if (!globalThis.localStorage) throw new Error("Preset storage is unavailable. Export a bank to keep your sounds.");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  globalThis.dispatchEvent?.(new CustomEvent("audionaut-presets-changed"));
}
export function saveUserPreset(synthId, { name, params, id, category } = {}) {
  const p = cleanPreset({ synthId, name, params, id, category, version: PRESET_VERSION, updatedAt: Date.now() });
  const rows = listUserPresets().filter((row) => row.id !== p.id); rows.push(p); write(rows); return p;
}
export function deleteUserPreset(id) { write(listUserPresets().filter((p) => p.id !== id)); }
export function exportPresetBank(synthId) { return JSON.stringify({ format: "audionaut-preset-bank", version: PRESET_VERSION, presets: listUserPresets(synthId) }, null, 2); }
export function importPresetBank(text, { replace = false } = {}) {
  if (typeof text !== "string" || text.length > 5 * 1024 * 1024) throw new Error("Preset bank is too large.");
  const data = JSON.parse(text);
  if (data.format !== "audionaut-preset-bank" || !Array.isArray(data.presets) || data.version > PRESET_VERSION) throw new Error("Unsupported preset bank.");
  if (data.presets.length > MAX_PRESETS) throw new Error("Too many presets in this bank.");
  const incoming = data.presets.map(cleanPreset); // validate the entire bank before writing
  const all = new Map((replace ? [] : listUserPresets()).map((p) => [p.id, p]));
  for (const p of incoming) all.set(p.id, p);
  write([...all.values()]); return incoming;
}
