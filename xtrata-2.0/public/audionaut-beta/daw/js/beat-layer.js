// A layer owns only the untouched sound and pattern it installed in one sequence.
import { canonicalJSON, sha256Text } from './clip-contract.js';
import { makeChannel, MAX_CHANNELS } from './state.js';
import { MODEL_LIMITS } from './project-model.js';

export function layerStamp(channel, steps, clip) {
  const { beatLayer, ...settings } = channel;
  return sha256Text(canonicalJSON([settings, steps, clip || null]));
}

// Include references in takes, automation, sampler zones, effect slots and future
// project extensions. A reference we don't recognise should protect the track.
function collectIds(value, ids, found) {
  if (typeof value === 'string') {
    if (ids.has(value)) found.add(value);
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (ids.has(key)) found.add(key);
      collectIds(child, ids, found);
    }
  }
}

export function planBeatLayer(project, sequence, count) {
  const clips = project.timeline.clips,
    ownClips = new Map();
  const ids = new Set(project.channels.map((c) => c.id)),
    used = new Set();
  for (const c of project.channels) {
    const marker = c.beatLayer;
    if (marker?.sequenceId !== sequence.id || !marker.clipId) continue;
    const clip = clips.find(
      (x) =>
        x.id === marker.clipId &&
        x.type === 'pattern' &&
        x.trackId === c.id &&
        x.sequenceId === sequence.id
    );
    if (clip) ownClips.set(c.id, clip);
  }
  const { channels, sequences, timeline, ...rest } = project;
  collectIds(rest, ids, used);
  for (const { id, beatLayer, ...settings } of channels) collectIds(settings, ids, used);
  const { clips: allClips, ...timelineSettings } = timeline;
  collectIds(timelineSettings, ids, used);
  for (const clip of allClips) {
    if (ownClips.get(clip.trackId) === clip) continue;
    collectIds(clip, ids, used);
  }
  const reusable = [],
    empty = [];
  channels.forEach((c, i) => {
    if (used.has(c.id) || sequences.some((s) => s !== sequence && s.steps[i]?.some(Boolean)))
      return;
    const row = sequence.steps[i],
      clip = ownClips.get(c.id);
    if (c.beatLayer?.sequenceId === sequence.id && c.beatLayer.stamp === layerStamp(c, row, clip)) {
      reusable.push(i);
      return;
    }
    if (c.beatLayer || row?.some(Boolean) || c.source) return;
    // Only untouched factory slots qualify. An empty but configured strip is user work.
    const base = makeChannel(i);
    Object.assign(base, { id: c.id, midiInput: { portId: '*', channel: 'all' }, takes: [] });
    for (const [key, val] of Object.entries({
      wordSelection: null,
      clipSnapshot: null,
      soundMetadata: null,
      sampleMidi: null,
      gateSteps: 0
    }))
      if (key in c) base[key] = val;
    if (canonicalJSON(c) === canonicalJSON(base)) empty.push(i);
  });
  const targets = [...reusable, ...empty].slice(0, count);
  const additional = count - targets.length;
  if (channels.length + additional > MAX_CHANNELS)
    throw new Error(
      'There are too few free sample channels for this beat. Choose a smaller beat or free unused channels.'
    );
  for (let i = 0; i < additional; i++) targets.push(channels.length + i);
  const retired = reusable.slice(count);
  const removedClipIds = new Set(
    reusable.map((i) => ownClips.get(channels[i].id)?.id).filter(Boolean)
  );
  if (timeline.enabled && clips.length - removedClipIds.size + count > MODEL_LIMITS.clips)
    throw new Error('There are too few free Timeline clip slots for this beat.');
  return { targets, retired, removedClipIds };
}
