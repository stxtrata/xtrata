import { normalizeOwner } from "./plugins.js";
import { layerStamp, planBeatLayer } from "./beat-layer.js";
import { beginTransaction, endTransaction } from "./history.js";
import { newId } from "./project-model.js";
import { store } from "./state.js";
import { engine } from "./engine.js";
import { fetchAndDecode, assignDecodedSample } from "./loader.js";
import { expandPattern } from "./beats.js";
import { onboardVariant } from "./onboard-library.js";
import { SOUND_BY_KEY } from "./onboard-catalog.js";
import { ALL_SYNTH_DRUMS } from "./synthdrums.js";
import { packSoundRow } from "./pack-library.js";

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
  { signal, onProgress = () => {}, decode = fetchAndDecode } = {}
) {
  cancelled(signal);
  if (
    !['original', 'l1', 'combined', 'tonal', 'analog'].includes(preset.collection || 'original') ||
    !preset.channels.length ||
    preset.channels.length > 16
  )
    throw new Error('Choose a beat preset.');
  const sources = new Map();
  for (const channel of preset.channels) {
    const source = channel.source;
    const ordinal = source.type === 'ordinal' && /^[a-f0-9]{64}i\d+$/i.test(source.value);
    const builtIn =
      preset.collection !== 'l1' &&
      source.type === 'synth' &&
      !!(ALL_SYNTH_DRUMS[source.value] || SOUND_BY_KEY[source.value]);
    // Analog Kit beats use sample-pack recordings only (the Analog Kit, plus the Electronic Kit's
    // 808 sub kicks for the few beats that carry a bass hit); no other collection may use packs.
    const pack =
      preset.collection === 'analog' &&
      source.type === 'pack' &&
      (() => {
        try {
          packSoundRow(source.value);
          return true;
        } catch {
          return false;
        }
      })();
    if (preset.collection === 'analog' ? !pack : !ordinal && !builtIn)
      throw new Error(
        preset.collection === 'analog'
          ? 'Analog Kit beats must use sounds from the installed sample packs.'
          : 'Beat sources must be Bitcoin inscriptions or supported built-in sounds; L1-only kits require inscriptions throughout.'
      );
    sources.set(sourceKey(source), source);
  }
  if (
    preset.collection === 'combined' &&
    (!preset.channels.some((c) => c.source.type === 'ordinal') ||
      !preset.channels.some((c) => c.source.type === 'synth'))
  )
    throw new Error('Combined beats need both L1 percussion and built-in sounds.');
  const pending = [...sources.values()],
    results = new Map();
  const batch = new AbortController();
  const abortBatch = () => batch.abort();
  signal?.addEventListener('abort', abortBatch, { once: true });
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
    await Promise.all(Array.from({ length: Math.min(2, pending.length) }, worker));
  } catch (error) {
    batch.abort();
    throw error;
  } finally {
    signal?.removeEventListener('abort', abortBatch);
  }
  cancelled(signal);
  return preset.channels.map((def) => {
    const result = results.get(sourceKey(def.source)),
      duration = result.audioBuffer.duration;
    if (!Number.isFinite(duration) || duration <= 0)
      throw new Error(`${def.source.label}: empty audio.`);
    let [start, end] = def.trimSeconds || [0, duration];
    if (def.kind === 'loop') {
      end = (def.loopBeats * 60) / def.sourceBpm;
      if (duration + 0.005 < end)
        throw new Error(`${def.source.label}: the recording is shorter than its loop section.`);
    }
    end = Math.min(duration, end);
    if (start < 0 || end <= start) throw new Error(`${def.source.label}: invalid sample section.`);
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
              sampleMidi: result.soundMetadata.rootMidi + offset
            })
          };
        }
    if (def.gateSteps || def.xfade)
      for (let i = 0; i < steps.length; i++)
        if (steps[i])
          steps[i] = {
            ...(typeof steps[i] === 'object' ? steps[i] : { v: steps[i] }),
            ...(def.gateSteps && { gateSteps: def.gateSteps }),
            ...(def.xfade && { xfade: def.xfade })
          };
    return {
      def,
      result,
      steps,
      trimStart: start / duration,
      trimEnd: end / duration
    };
  });
}

export async function loadBeatPreset(preset, options = {}) {
  const collection = preset.collection || 'original';
  const project = store.project,
    sequence = options.sequence || store.seq;
  if (!project.sequences.includes(sequence))
    throw new Error('Reopen Beats to select a destination.');
  const prepared = await prepareBeatPreset(preset, options);
  cancelled(options.signal);
  if (store.project !== project || !project.sequences.includes(sequence))
    throw new Error('The destination song changed. Reopen Beats and try again.');
  // Plan against current edits after all asynchronous work has finished.
  const { targets, retired, removedClipIds } = planBeatLayer(project, sequence, prepared.length);
  const timeline = project.timeline,
    sequenceIndex = project.sequences.indexOf(sequence);
  beginTransaction();
  try {
    timeline.clips = timeline.clips.filter((c) => !removedClipIds.has(c.id));
    for (const i of retired) {
      sequence.steps[i].fill(0);
      const c = store.channel(i);
      c.beatLayer = { sequenceId: sequence.id, stamp: layerStamp(c, sequence.steps[i]) };
    }
    while (store.numChannels <= Math.max(...targets)) store.addChannel();
    engine.ensureChannelChains?.();
    prepared.forEach(({ def, result, steps, trimStart, trimEnd }, index) => {
      const i = targets[index];
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
        sends: {},
        fx: { ...def.fx } // preset FX are written in the old object form…
      });
      normalizeOwner(store.channel(i)); // …and become plugin chain slots here
      sequence.steps[i] = steps;
      let clip;
      if (timeline.enabled) {
        clip = {
          id: newId('clip'),
          type: 'pattern',
          trackId: store.channel(i).id,
          sequenceId: sequence.id,
          start: sequenceIndex * 16,
          duration: 16,
          offset: 0,
          gain: 1
        };
        timeline.clips.push(clip);
        timeline.lengthBeats = Math.max(timeline.lengthBeats, clip.start + clip.duration);
      }
      const c = store.channel(i);
      c.midiInput ||= { portId: '*', channel: 'all' };
      c.takes ||= [];
      c.beatLayer = {
        sequenceId: sequence.id,
        clipId: clip?.id,
        stamp: layerStamp(c, steps, clip)
      };
      engine.rebuildInserts?.(i);
      store.emit('channel', { ch: i });
    });
    project.lastBeat = {
      id: preset.id || `original-${preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: preset.name,
      collection
    };
    if (timeline.enabled) store.emit('timeline');
    store.emit('sequence', project.currentSequence);
  } finally {
    endTransaction();
  }
  return prepared;
}

export function prepareL1Beat(preset, options) {
  if (preset.collection !== 'l1') return Promise.reject(new Error('Choose an L1 beat preset.'));
  return prepareBeatPreset(preset, options);
}
export function loadL1Beat(preset, options) {
  if (preset.collection !== 'l1') return Promise.reject(new Error('Choose an L1 beat preset.'));
  return loadBeatPreset(preset, options);
}
