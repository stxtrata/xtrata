// Chain-shape audit for the plugin tidy-up (stage 1). Walks every shipped starter plus the
// Beats presets and reports how each channel / synth chain is shaped, so a data migration
// knows every case it must handle. Usage: node tools/chain-shapes.mjs [--json]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DAW = path.resolve(here, "../daw");
const plugins = await import(path.join(DAW, "js/plugins.js"));
const { PLUGIN_TYPES, normalizeOwner } = plugins;

const isSend = (s) => PLUGIN_TYPES[s.type]?.kind === "send" || s.type === "delaySend" || s.type === "reverbSend";

// Classify one owner AFTER normalizeOwner (so legacy fx objects are already slots).
export function shapeOf(owner) {
  const ins = owner.inserts || [];
  const fx = owner.fx || [];
  const chain = [...ins, ...fx];
  const sendIdx = chain.map((s, i) => (isSend(s) ? i : -1)).filter((i) => i >= 0);
  const firstSend = sendIdx.length ? sendIdx[0] : chain.length;
  const flags = [];
  if (!chain.length) return { chain, flags: ["empty"] };
  if (ins.length && fx.length) flags.push("both-chains");
  if (sendIdx.length && chain.slice(firstSend).some((s) => !isSend(s))) flags.push("mid-chain-send");
  if (ins.some(isSend)) flags.push("send-in-inserts");
  if (fx.some((s) => !isSend(s) && PLUGIN_TYPES[s.type]?.kind === "insert")) flags.push("insert-type-in-fx");
  if (ins.some((s) => PLUGIN_TYPES[s.type]?.kind === "fx")) flags.push("fx-type-in-inserts");
  const types = sendIdx.map((i) => chain[i].type);
  if (new Set(types).size !== types.length) flags.push("duplicate-send");
  if (chain.some((s) => !PLUGIN_TYPES[s.type])) flags.push("unknown-type");
  if (chain.some((s) => s.enabled === false)) flags.push("has-bypassed");
  if (sendIdx.length) flags.push(flags.includes("mid-chain-send") ? "sends" : "trailing-sends");
  if (!flags.length) flags.push("plain");
  return { chain, flags };
}

function owners(project) {
  const out = [];
  (project.channels || []).forEach((c, i) => out.push([`ch${i}`, c]));
  (project.instruments || project.synths || []).forEach((c, i) => out.push([`inst${i}`, c]));
  return out;
}

export function auditProject(label, project) {
  const rows = [];
  for (const [where, owner] of owners(project)) {
    // legacy fx objects get the same conversion the loader applies
    const copy = JSON.parse(JSON.stringify(owner));
    const legacy = !!copy.fx && !Array.isArray(copy.fx);
    normalizeOwner(copy);
    const { flags } = shapeOf(copy);
    rows.push({ label, where, legacy, flags });
  }
  return rows;
}

function readStarters() {
  const dir = path.join(DAW, "data/starters");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "index.json");
  const out = files.map((f) => [f, JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))]);
  out.push(["starter-session.json", JSON.parse(fs.readFileSync(path.join(DAW, "data/starter-session.json"), "utf8"))]);
  return out;
}

// Beats presets define channel FX in the old object form; wrap them in a fake project.
async function readBeats() {
  const out = [];
  for (const [file, key] of [
    ["js/l1-beats.js", "L1_BEAT_PRESETS"],
    ["js/legacy-beats.js", "LEGACY_BEAT_PRESETS"],
    ["js/original-beats.js", "ORIGINAL_BEAT_PRESETS"],
    ["js/combined-beats.js", "COMBINED_BEAT_PRESETS"],
    ["js/tonal-beats.js", "TONAL_BEAT_PRESETS"],
  ]) {
    let list;
    try {
      list = (await import(path.join(DAW, file)))[key];
    } catch {
      continue;
    }
    for (const preset of list || []) {
      const chans = (preset.channels || preset.tracks || preset.parts || []).map((d) => ({ inserts: [], fx: d.fx ? { ...d.fx } : {} }));
      if (chans.length) out.push([`${key}:${preset.id || preset.name}`, { channels: chans }]);
    }
  }
  return out;
}

async function main() {
  const rows = [];
  for (const [label, proj] of readStarters()) rows.push(...auditProject(label, proj));
  const beats = await readBeats();
  for (const [label, proj] of beats) rows.push(...auditProject(label, proj));
  const tally = {};
  for (const r of rows) for (const f of r.flags) tally[f] = (tally[f] || 0) + 1;
  if (process.argv.includes("--json")) console.log(JSON.stringify({ rows, tally }, null, 1));
  else {
    console.log(`owners scanned: ${rows.length} (${beats.length} Beats presets)`);
    console.log("legacy fx objects:", rows.filter((r) => r.legacy).length);
    for (const [k, v] of Object.entries(tally).sort()) console.log(` ${k.padEnd(20)} ${v}`);
    const odd = rows.filter((r) => r.flags.some((f) => ["mid-chain-send", "send-in-inserts", "duplicate-send", "unknown-type", "insert-type-in-fx", "fx-type-in-inserts"].includes(f)));
    console.log("odd shapes:", odd.length);
    for (const r of odd.slice(0, 40)) console.log("  ", r.label, r.where, r.flags.join(","));
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
