import { store } from "./state.js";
import { engine } from "./engine.js";
import { fetchAndDecode, assignDecodedSample } from "./loader.js";
import { expandPattern } from "./beats.js";
import { onboardVariant } from "./onboard-library.js";
import { SOUND_BY_KEY } from "./onboard-catalog.js";
import { SYNTH_KIT } from "./synthdrums.js";

const sourceKey = (source) =>
  source.type === "synth" && SOUND_BY_KEY[source.value]
    ? `onboard:${onboardVariant(source).id}`
    : `${source.type}:${source.value}`;
const cancelled = (signal) => {
  if (signal?.aborted)
    throw new DOMException("Beat loading cancelled.", "AbortError");
};

// Prepare everything before changing a session: an unavailable inscription leaves it intact.
export async function prepareBeatPreset(
  preset,
  { signal, onProgress = () => {}, decode = fetchAndDecode } = {},
) {
  cancelled(signal);
  if (
    !["original", "l1", "combined", "tonal"].includes(
      preset.collection || "original",
    ) ||
    !preset.channels.length ||
    preset.channels.length > 16
  )
    throw new Error("Choose a beat preset.");
  const sources = new Map();
  for (const channel of preset.channels) {
    const source = channel.source;
    const ordinal =
      source.type === "ordinal" && /^[a-f0-9]{64}i\d+$/i.test(source.value);
    const builtIn =
      preset.collection !== "l1" &&
      source.type === "synth" &&
      !!(SYNTH_KIT[source.value] || SOUND_BY_KEY[source.value]);
    if (!ordinal && !builtIn)
      throw new Error(
        "Beat sources must be Bitcoin inscriptions or supported built-in sounds; L1-only kits require inscriptions throughout.",
      );
    sources.set(sourceKey(source), source);
  }
  if (
    preset.collection === "combined" &&
    (!preset.channels.some((c) => c.source.type === "ordinal") ||
      !preset.channels.some((c) => c.source.type === "synth"))
  )
    throw new Error(
      "Combined beats need both L1 percussion and built-in sounds.",
    );
  const pending = [...sources.values()],
    results = new Map();
  const batch = new AbortController();
  const abortBatch = () => batch.abort();
  signal?.addEventListener("abort", abortBatch, { once: true });
  let next = 0;
  const worker = async () => {
    while (next < pending.length) {
      cancelled(batch.signal);
      const source = pending[next++];
      const result = await decode(source, { signal: batch.signal });
      cancelled(batch.signal);
      results.set(sourceKey(source), result);
      onProgress(results.size, pending.length, source.label);
    }
  };
  try {
    await Promise.all(
      Array.from({ length: Math.min(2, pending.length) }, worker),
    );
  } catch (error) {
    batch.abort();
    throw error;
  } finally {
    signal?.removeEventListener("abort", abortBatch);
  }
  cancelled(signal);
  return preset.channels.map((def) => {
    const result = results.get(sourceKey(def.source)),
      duration = result.audioBuffer.duration;
    if (!Number.isFinite(duration) || duration <= 0)
      throw new Error(`${def.source.label}: empty audio.`);
    let [start, end] = def.trimSeconds || [0, duration];
    if (def.kind === "loop") {
      end = (def.loopBeats * 60) / def.sourceBpm;
      if (duration + 0.005 < end)
        throw new Error(
          `${def.source.label}: the recording is shorter than its loop section.`,
        );
    }
    end = Math.min(duration, end);
    if (start < 0 || end <= start)
      throw new Error(`${def.source.label}: invalid sample section.`);
    const steps = expandPattern(def.pattern);
    let note = 0;
    if (def.notes)
      for (let i = 0; i < steps.length; i++)
        if (steps[i]) {
          const offset = def.notes[note++ % def.notes.length];
          steps[i] = {
            v: steps[i],
            pitch: (def.pitch ?? 1) * Math.pow(2, offset / 12),
            ...(result.soundMetadata?.rootMidi != null && {
              sampleMidi: result.soundMetadata.rootMidi + offset,
            }),
          };
        }
    if (def.gateSteps || def.xfade)
      for (let i = 0; i < steps.length; i++)
        if (steps[i])
          steps[i] = {
            ...(typeof steps[i] === "object" ? steps[i] : { v: steps[i] }),
            ...(def.gateSteps && { gateSteps: def.gateSteps }),
            ...(def.xfade && { xfade: def.xfade }),
          };
    return {
      def,
      result,
      steps,
      trimStart: start / duration,
      trimEnd: end / duration,
    };
  });
}

export async function loadBeatPreset(preset, options = {}) {
  const collection = preset.collection || "original";
  // Automatic chain advancement changes only the selected sequence; edits still invalidate a load.
  const projectSnapshot = (p) => JSON.stringify({ ...p, currentSequence: 0 });
  const project = store.project,
    initialSequence = store.seq,
    snapshot = projectSnapshot(project);
  const prepared = await prepareBeatPreset(preset, options);
  cancelled(options.signal);
  if (
    store.project !== project ||
    (store.seq !== initialSequence &&
      !(
        engine.isPlaying && engine.playingSequence === project.currentSequence
      )) ||
    projectSnapshot(project) !== snapshot
  )
    throw new DOMException(
      "The session changed while loading. Load the beat again when ready.",
      "AbortError",
    );
  engine.stopPreview();
  if (!engine.isPlaying) engine.stop();
  const sequence = store.seq;
  while (store.numChannels < prepared.length) store.addChannel();
  engine.ensureChannelChains?.();
  // Keep other tracks editable, but mute them so playback uses only the chosen kit.
  for (let i = 0; i < store.numChannels && collection !== "original"; i++) {
    const channel = store.channel(i);
    channel.mute = i >= prepared.length;
    channel.solo = false;
    if (channel.mute) engine.silenceChannel(i);
  }
  for (
    let i = 0;
    i < project.instruments.length && collection !== "original";
    i++
  ) {
    project.instruments[i].mute = true;
    project.instruments[i].solo = false;
    store.emit("instrument", { i });
  }
  if (collection === "original")
    for (
      let i = prepared.length;
      i < (project.lastPresetChannels || 0) && i < store.numChannels;
      i++
    ) {
      sequence.steps[i].fill(0);
      engine.silenceChannel(i);
    }
  prepared.forEach(({ def, result, steps, trimStart, trimEnd }, i) => {
    assignDecodedSample(i, def.source, result);
    Object.assign(store.channel(i), {
      name: (def.name || def.source.label).slice(0, 24),
      sampleName: def.source.label,
      volume: def.volume ?? 0.7,
      pitch: def.pitch ?? 1,
      reverse: !!def.reverse,
      mute: false,
      solo: false,
      trimStart,
      trimEnd,
      inserts: [],
      fx: {
        filter: "off",
        cutoff: 8000,
        drive: 0,
        delay: 0,
        reverb: 0,
        ...def.fx,
      },
    });
    sequence.steps[i] = steps;
    engine.rebuildInserts?.(i);
    store.emit("channel", { ch: i });
  });
  store.setProjectProp("bpm", preset.bpm);
  store.setProjectProp("swing", preset.swing || 0);
  project.lastPresetChannels = prepared.length;
  project.lastBeat = {
    id:
      preset.id ||
      `original-${preset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: preset.name,
    collection,
  };
  // A beat pattern is edited and played as a standalone sequence, including in a song import.
  project.continuous = false;
  if (engine.isPlaying) engine.playingSequence = project.currentSequence;
  engine.syncDelayToBpm();
  store.emit("sequence", project.currentSequence);
  return prepared;
}

export function prepareL1Beat(preset, options) {
  if (preset.collection !== "l1")
    return Promise.reject(new Error("Choose an L1 beat preset."));
  return prepareBeatPreset(preset, options);
}
export function loadL1Beat(preset, options) {
  if (preset.collection !== "l1")
    return Promise.reject(new Error("Choose an L1 beat preset."));
  return loadBeatPreset(preset, options);
}
