import { compilePlaybackPlan } from './playback-plan.js';
import { beatToSeconds, secondsToBeat, unswingStep } from './timeline.js';
import { legacySamplePlayback } from './legacy-bridge/playback.js';
import { sustainDuration, sampleLoop } from './onboard-library.js';

export function sampleWindow(project, track, over, buffer) {
  const reverse = over?.rev ?? track.reverse,
    rate = over?.pitch ?? track.pitch ?? 1,
    start = over?.trimStart ?? track.trimStart ?? 0,
    end = over?.trimEnd ?? track.trimEnd ?? 1;
  const historical = legacySamplePlayback(project, track, over, buffer?.duration || 0);
  const sustain = buffer ? sustainDuration(track, over, buffer, project.bpm) : null;
  const duration =
    sustain ??
    historical?.audibleDuration ??
    (buffer ? Math.max(0, (end - start) * buffer.duration) / rate : 0);
  return {
    reverse,
    rate,
    start,
    end,
    duration,
    offset: historical?.offset ?? (reverse ? 1 - end : start) * (buffer?.duration || 0),
    loop: sustain != null ? sampleLoop(track) : null
  };
}
export function waveformIndex(window, buffer, seconds) {
  let frame = (window.offset + seconds * window.rate) * buffer.sampleRate;
  if (window.loop) {
    const a = window.loop.start * buffer.sampleRate,
      b = window.loop.end * buffer.sampleRate;
    if (b > a && frame >= b) frame = a + ((frame - b) % (b - a));
  }
  return window.reverse ? buffer.length - 1 - frame : frame;
}
// A projection, not a conversion: viewing never enables/rebuilds stored clips.
export function songRegions(project, buffers = [], { patterns = false } = {}) {
  const arranged = project.timeline.enabled && !patterns;
  const length = arranged
    ? Math.max(
        project.timeline.lengthBeats,
        ...project.timeline.clips.map((c) => c.start + c.duration)
      )
    : Math.max(16, project.sequences.length * 16);
  const source = patterns
    ? { ...project, timeline: { ...project.timeline, enabled: false } }
    : project;
  const plan = compilePlaybackPlan(source, { range: { start: 0, end: length }, buffers });
  const regions = plan.events
    .filter((e) => e.type === 'sample' || e.type === 'note')
    .map((event) => {
      const clip = arranged
        ? project.timeline.clips.find(
            (c) => c.id === event.clipId || event.id.startsWith(c.id + ':')
          )
        : null;
      const track = [...project.channels, ...project.instruments].find(
        (t) => t.id === event.trackId
      );
      const sourceIndex = event.clip
        ? project.channels.findIndex((c) => c.id === event.sourceTrackId)
        : event.index;
      const buffer = event.type === 'sample' ? buffers[sourceIndex] : null;
      const window =
        event.type === 'sample'
          ? event.clip
            ? {
                offset: event.sourceOffsetSeconds || 0,
                rate: event.playbackRate || 1,
                reverse: false,
                duration: buffer
                  ? Math.max(
                      0,
                      Math.min(
                        event.duration,
                        (buffer.duration - (event.sourceOffsetSeconds || 0)) /
                          (event.playbackRate || 1)
                      )
                    )
                  : event.duration
              }
            : sampleWindow(project, track, event.over, buffer)
          : null;
      const start = event.beat,
        end = window
          ? secondsToBeat(project, beatToSeconds(project, start) + window.duration)
          : event.endBeat;
      return {
        ...event,
        start,
        end,
        naturalEnd: end,
        window,
        buffer,
        track,
        sourceClip: clip,
        sequenceId: project.sequences[event.sequenceIndex]?.id,
        missing: event.type === 'sample' && !buffer
      };
    });
  // Choke/crossfade follows the next trigger even across sequence boundaries.
  const previous = new Map();
  for (const r of regions) {
    if (r.type !== 'sample' || r.clip) continue;
    const old = previous.get(r.trackId),
      fade =
        r.over?.xfade > 0
          ? r.over.xfade / 1000
          : project.choke
            ? Math.max(0.002, (project.fadeMs ?? 15) / 1000)
            : null;
    if (old) old.next = r;
    if (old && fade != null && old.end > r.start) {
      old.end = Math.min(old.end, secondsToBeat(project, beatToSeconds(project, r.start) + fade));
      old.cut = true;
    }
    previous.set(r.trackId, r);
  }
  const byTrack = new Map();
  for (const r of regions) {
    if (!byTrack.has(r.trackId)) byTrack.set(r.trackId, []);
    byTrack.get(r.trackId).push(r);
  }
  return {
    length,
    regions,
    byTrack,
    end: regions.reduce((end, r) => Math.max(end, r.end), length)
  };
}
function rawPosition(project, region, beat) {
  const clip = region.sourceClip;
  return unswingStep(
    (beat - (clip?.start ?? region.sequenceIndex * 16) + (clip?.offset || 0)) * 4,
    project.swing
  );
}
export function regionSource(project, region) {
  if (region.clip) return { clip: project.timeline.clips.find((c) => c.id === region.clipId) };
  const clip =
    region.sourceClip && project.timeline.clips.find((c) => c.id === region.sourceClip.id);
  const sequence = project.sequences.find((s) => s.id === region.sequenceId);
  if (region.type === 'sample')
    return {
      sequence,
      row: sequence?.steps[region.index],
      value: sequence?.steps[region.index]?.[region.step],
      clip
    };
  const notes = clip?.type === 'midi' ? clip.notes : sequence?.notes[region.index];
  return { sequence, notes, note: notes?.find((n) => n.id === region.noteId), clip };
}
export function editSongRegion(project, region, patch, options = {}) {
  for (const key of ['start', 'end'])
    if (
      patch[key] != null &&
      (!Number.isFinite(patch[key]) || patch[key] < 0 || patch[key] > 16384)
    )
      throw Error('Choose a position within the song limit.');
  if (patch.end != null && patch.end <= (patch.start ?? region.start))
    throw Error('A region must have a positive length.');
  const source = regionSource(project, region);
  if (options.sourceValue !== undefined) source.value = options.sourceValue;
  if (region.clip) {
    if (!source.clip) throw Error('This clip no longer exists.');
    if (patch.remove) {
      project.timeline.clips = project.timeline.clips.filter((c) => c.id !== source.clip.id);
      return;
    }
    const next = { ...source.clip };
    if (patch.trimLeft)
      next.sourceOffsetSeconds =
        (next.sourceOffsetSeconds || 0) +
        (beatToSeconds(project, patch.start) - beatToSeconds(project, next.start)) *
          (next.playbackRate || 1);
    if (patch.start != null) next.start = patch.start;
    if (patch.end != null) {
      // Tail length is seconds, while clip duration is beats (including tempo changes).
      const bodyEnd = secondsToBeat(
        project,
        beatToSeconds(project, patch.end) - (next.tailSeconds || 0)
      );
      if (bodyEnd <= next.start) throw Error('Keep enough room for this clip’s effect tail.');
      next.duration = bodyEnd - next.start;
    }
    if (next.sourceOffsetSeconds < 0 || next.start + next.duration > 16384)
      throw Error('This trim exceeds the source or song boundary.');
    Object.assign(source.clip, next);
    project.timeline.lengthBeats = Math.max(
      project.timeline.lengthBeats,
      next.start + next.duration
    );
    return;
  }
  if (region.type === 'sample') {
    if (!source.row || !source.value) throw Error('This region no longer exists.');
    if (patch.remove) {
      if (!options.sourceRemoved) source.row[region.step] = 0;
      return;
    }
    let value = typeof source.value === 'object' ? { ...source.value } : { v: source.value },
      row = source.row,
      step = region.step;
    if (patch.start != null) {
      let local = rawPosition(project, region, patch.start);
      if (!source.clip) {
        const targetIndex = Math.floor(patch.start / 16),
          target = project.sequences[targetIndex];
        if (!target) throw Error('Move inside the existing song.');
        row = target.steps[region.index];
        local = unswingStep((patch.start - targetIndex * 16) * 4, project.swing);
      }
      if (local < 0 || local >= 64) throw Error('Move inside the referenced pattern.');
      step = Math.min(63, Math.floor(local + 1e-7));
      if (row[step] && (row !== source.row || step !== region.step))
        throw Error('A region already starts at that step.');
      value.off = Math.min(0.999, Math.max(0, local - step));
    }
    if (patch.reverse != null) value.rev = patch.reverse;
    for (const key of ['trimStart', 'trimEnd', 'xfade'])
      if (patch[key] != null) {
        if (!Number.isFinite(patch[key]) || patch[key] < 0 || (key !== 'xfade' && patch[key] > 1))
          throw Error('Invalid region adjustment.');
        value[key] = patch[key];
      }
    if (patch.end != null) {
      if (!region.buffer) throw Error('Load the sound before trimming it.');
      const seconds =
          beatToSeconds(project, patch.end) - beatToSeconds(project, patch.start ?? region.start),
        w = region.window;
      if (w.loop) throw Error('Edit this sustained sound’s gate in Patterns.');
      const profile = legacySamplePlayback(project, region.track, value, region.buffer.duration),
        fraction =
          (Math.max(0, seconds) * w.rate * (profile?.profile.divideSourceDuration ? w.rate : 1)) /
          region.buffer.duration;
      const consumed = patch.trimLeft
        ? ((beatToSeconds(project, patch.start) - beatToSeconds(project, region.start)) * w.rate) /
          region.buffer.duration
        : 0;
      if (w.reverse) {
        const end = Math.min(1, Math.max(0, w.end - consumed));
        value.trimEnd = end;
        value.trimStart = Math.max(0, end - fraction);
      } else {
        const start = Math.min(1, Math.max(0, w.start + consumed));
        value.trimStart = start;
        value.trimEnd = Math.min(1, start + fraction);
      }
    }
    if (!options.sourceRemoved) source.row[region.step] = 0;
    row[step] = value;
    const sequence = project.sequences.find((s) => s.steps[region.index] === row);
    return { ...region, sequenceId: sequence.id, step };
  }
  if (!source.note) throw Error('This note no longer exists.');
  if (source.note.tieId)
    throw Error('Edit this linked note in the piano roll to preserve its continuation.');
  if (patch.remove) {
    source.notes.splice(source.notes.indexOf(source.note), 1);
    return;
  }
  let local = patch.start == null ? source.note.step : rawPosition(project, region, patch.start),
    notes = source.notes;
  if (patch.start != null && !source.clip) {
    const index = Math.floor(patch.start / 16),
      sequence = project.sequences[index];
    if (!sequence) throw Error('Move inside the existing song.');
    notes = sequence.notes[region.index];
    local = unswingStep((patch.start - index * 16) * 4, project.swing);
  }
  if (
    local < 0 ||
    local >=
      (source.clip?.type === 'midi' ? (source.clip.duration + (source.clip.offset || 0)) * 4 : 64)
  )
    throw Error('Move inside the referenced pattern.');
  const note = { ...source.note, step: local, rawStep: local };
  if (patch.end != null) {
    note.dur = Math.max(
      0.0625,
      rawPosition(project, region, patch.end) -
        rawPosition(project, region, patch.start ?? region.start)
    );
    note.rawDur = note.dur;
  }
  if (local + note.dur > 64 && !source.clip)
    throw Error('Keep this note within its pattern, or edit its continuation in the piano roll.');
  source.notes.splice(source.notes.indexOf(source.note), 1);
  notes.push(note);
  const sequence = project.sequences.find((s) => s.notes[region.index] === notes);
  return { ...region, sequenceId: sequence?.id ?? region.sequenceId };
}

// Stable source identities deduplicate linked appearances of the same pattern.
export function regionKey(r) {
  if (r.clip) return `clip:${r.clipId}`;
  if (r.type === 'sample') return `step:${r.sequenceId}:${r.index}:${r.step}`;
  return `note:${r.sourceClip?.type === 'midi' ? r.sourceClip.id : r.sequenceId}:${r.index}:${r.noteId}`;
}
export function sampleDestination(project, region, beat) {
  const index = region.sourceClip
    ? project.sequences.findIndex((s) => s.id === region.sequenceId)
    : Math.floor(beat / 16);
  const local = region.sourceClip
    ? rawPosition(project, region, beat)
    : unswingStep((beat - index * 16) * 4, project.swing);
  if (!project.sequences[index] || local < 0 || local >= 64) return null;
  return {
    sequence: project.sequences[index],
    step: Math.min(63, Math.floor(local + 1e-7)),
    local
  };
}
export function batchEditSongRegions(project, edits) {
  const next = structuredClone(project),
    unique = [...new Map(edits.map((e) => [regionKey(e.region), e])).values()],
    values = new Map(),
    keys = [];
  // Vacate every moving source before writing destinations: selected neighbours
  // can move together without overwriting each other or failing halfway through.
  for (const { region: r, patch } of unique)
    if (r.type === 'sample' && !r.clip && (patch.start != null || patch.remove)) {
      const source = regionSource(next, r);
      values.set(regionKey(r), source.value);
      if (source.row) source.row[r.step] = 0;
    }
  for (const { region: r, patch } of unique) {
    const removed = values.has(regionKey(r));
    const result = editSongRegion(next, r, patch, {
      sourceRemoved: removed,
      sourceValue: values.get(regionKey(r))
    });
    if (!patch.remove) keys.push(regionKey(result || r));
    if (r.clip && patch.remove)
      for (const owner of [...next.channels, ...next.instruments]) {
        for (const take of owner.takes || [])
          if (take.clipIds) take.clipIds = take.clipIds.filter((id) => id !== r.clipId);
        if (owner.freezeState?.clipId === r.clipId) {
          owner.mute = owner.freezeState.wasMuted;
          owner.freezeState = null;
        }
      }
  }
  return { project: next, keys };
}
