// One synth replacement operation shared by the track picker and piano roll.
// Patches belong to the instrument slot and survive switching away and back.
import { store } from "./state.js";
import { SYNTH_BANK } from "./synths.js";
import { engine } from "./engine.js";

export function changeSynth(i, id) {
  const instrument = store.instrument(i);
  const next = SYNTH_BANK[id];
  if (!instrument || !next || instrument.synthId === id) return false;
  const oldName = SYNTH_BANK[instrument.synthId]?.name;
  const patches = { ...(instrument.patches || {}) };
  patches[instrument.synthId] = structuredClone(instrument.params || null);
  engine.releaseAll(i);
  // Publish a complete state before notifying subscribers; no panel can observe
  // the new synth paired with the previous synth's parameter schema.
  instrument.patches = patches;
  instrument.params = structuredClone(patches[id] || null);
  instrument.synthId = id;
  if (!instrument.name || instrument.name === oldName) instrument.name = next.name;
  store.emit("instrument", { i, prop: "synthId", value: id });
  document.dispatchEvent(new CustomEvent("instrument-renamed", { detail: i }));
  return true;
}
