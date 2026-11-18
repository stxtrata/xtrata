// Offline mix export uses the same engine and effects as playback, with its own
// immutable project view and audio context. Editing/playing the DAW is unaffected.
import { Engine } from "./engine.js";
import { NUM_STEPS } from "./state.js";
import { encodeWav } from "./audio-utils.js";

export function mixDuration(project, { scope = "song", tail = 4 } = {}) {
  const bpm = Math.max(20, Math.min(420, Number(project.bpm) || 120));
  const count = scope === "sequence" ? 1 : project.sequences.length;
  return count * NUM_STEPS * 15 / bpm + Math.max(0, Math.min(12, Number(tail) || 0));
}

export async function renderMix(project, buffers, { scope = "song", tail = 4, sampleRate = 44100, signal } = {}) {
  if (signal?.aborted) throw new DOMException("Export cancelled.", "AbortError");
  const snapshot = structuredClone(project);
  const duration = mixDuration(snapshot, { scope, tail });
  const length = Math.ceil((duration + 0.01) * sampleRate);
  if (length * 8 > 256 * 1024 * 1024)
    throw new Error("This mix is too long to render at once. Choose the current sequence instead.");
  const missing = snapshot.channels.flatMap((c, i) => c.source && !buffers[i] ? [i + 1] : []);
  if (missing.length) throw new Error(`Load the audio for channels ${missing.join(", ")} before exporting.`);
  const AudioContextClass = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!AudioContextClass) throw new Error("Offline audio export is not supported in this browser.");
  const context = new AudioContextClass(2, length, sampleRate);
  const projectStore = {
    project: snapshot,
    get numChannels() { return snapshot.channels.length; },
    channel: i => snapshot.channels[i],
    instrument: i => snapshot.instruments[i],
    on: () => () => {},
    selectSequence: i => { snapshot.currentSequence = i; },
  };
  const renderer = new Engine({ store: projectStore, contextFactory: () => context, offline: true });
  renderer.ensureContext();
  buffers.forEach((buffer, i) => renderer.setBuffer(i, buffer));
  renderer.setMasterVolume(snapshot.masterVolume);
  snapshot.channels.forEach((c, i) => renderer.setChannelVolume(i, c.volume));
  renderer.applySolo();
  // Worklet-backed effects must be ready before scheduling the offline graph.
  const pending = [];
  for (const chain of renderer.chains.values())
    for (const slot of chain.slots.values()) if (slot.nodes.ready) pending.push(
      Promise.resolve(slot.nodes.ready).then(ready => {
        if (ready === false && slot.def?.enabled !== false)
          throw new Error(`The ${slot.type.name || slot.typeId} effect cannot render in this browser. Disable it or use a browser with offline AudioWorklet support.`);
      }),
    );
  await Promise.all(pending);
  if (signal?.aborted) throw new DOMException("Export cancelled.", "AbortError");
  const first = scope === "sequence" ? snapshot.currentSequence : 0;
  const last = scope === "sequence" ? first + 1 : snapshot.sequences.length;
  const stepDuration = renderer.stepDuration();
  const swing = Math.max(0, Math.min(0.6, snapshot.swing / 100 || 0));
  for (let sequence = first; sequence < last; sequence++) {
    renderer.playingSequence = sequence;
    for (let step = 0; step < NUM_STEPS; step++) {
      const absolute = (sequence - first) * NUM_STEPS + step;
      renderer._scheduleStep(step, 0.01 + (absolute + (step % 2 ? swing : 0)) * stepDuration);
    }
  }
  const audio = await context.startRendering();
  if (signal?.aborted) throw new DOMException("Export cancelled.", "AbortError");
  return encodeWav(audio);
}
