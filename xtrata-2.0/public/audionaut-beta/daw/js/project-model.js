// V3 project identity and musical model. Legacy pattern arrays remain editable views.
export const MODEL_LIMITS = Object.freeze({ channels: 64, instruments: 32, buses: 32, clips: 10000 });
export const newId = (kind = 'item') => `${kind}-${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`;
const finite = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback;
export function normalizeProjectModel(project) {
  project.schemaVersion = 3;
  project.renderSeed ||= project.projectId || 'audionaut';
  project.channels ||= []; project.instruments ||= []; project.sequences ||= [];
  for (const [kind, owners] of [['sample', project.channels], ['instrument', project.instruments]]) {
    for (const owner of owners) {
      owner.id ||= newId(kind); owner.kind = kind;
      owner.pan = Math.max(-1, Math.min(1, finite(owner.pan, 0)));
      owner.inputTrimDb = Math.max(-60, Math.min(24, finite(owner.inputTrimDb, 0)));
      owner.output ||= 'master'; owner.auxSends ||= [];
      owner.armed = owner.armed === true; owner.monitor = owner.monitor !== false;
      owner.midiInput ||= { portId: '*', channel: 'all' };
      owner.takes ||= [];
    }
  }
  for (const sequence of project.sequences) {
    sequence.id ||= newId('pattern');
    sequence.notes ||= [];
    while (sequence.notes.length < project.instruments.length) sequence.notes.push([]);
    for (const notes of sequence.notes) for (const note of notes) {
      note.id ||= newId('note');
      if (!Number.isFinite(note.rawStep)) note.rawStep = note.step;
      if (!Number.isFinite(note.rawDur)) note.rawDur = note.dur;
      note.expression ||= [];
    }
  }
  project.buses ||= [];
  for (const bus of project.buses) {
    bus.id ||= newId('bus'); bus.kind ||= 'bus'; bus.output ||= 'master';
    bus.volume ??= 1; bus.pan ??= 0; bus.inserts ||= []; bus.fx ||= []; bus.auxSends ||= [];
  }
  project.master = { inserts: [], fx: [], pan: 0, mono: false, ...(project.master || {}) };
  project.mixerVersion ??= 1; // V2's fader-before-inserts order is preserved on migration.
  const timeline = project.timeline ||= {};
  timeline.enabled = timeline.enabled === true;
  timeline.lengthBeats = Math.max(.25, finite(timeline.lengthBeats, Math.max(16, project.sequences.length * 16)));
  timeline.tempo ||= [{ beat: 0, bpm: project.bpm || 120 }];
  if(!timeline.enabled&&timeline.tempo.length===1&&timeline.tempo[0].beat===0)timeline.tempo[0].bpm=project.bpm||120;
  timeline.meter ||= [{ beat: 0, numerator: 4, denominator: 4 }];
  timeline.markers ||= []; timeline.clips ||= []; timeline.automation ||= [];
  timeline.loop = { enabled: false, start: 0, end: timeline.lengthBeats, ...(timeline.loop || {}) };
  timeline.punch = { enabled: false, start: 0, end: timeline.lengthBeats, ...(timeline.punch || {}) };
  for (const clip of timeline.clips) { clip.id ||= newId('clip'); clip.offset ??= 0; clip.gain ??= 1; }
  project.recording = { quantize: .25, strength: 1, countIn: 0, metronome: false, mode: 'overdub', latencyMs: 0, ...(project.recording || {}) };
  return project;
}
export function projectTracks(project) { return [...project.channels, ...project.instruments]; }
export function trackAddress(project, id) {
  let index = project.channels.findIndex(t => t.id === id);
  if (index >= 0) return { kind: 'sample', index, track: project.channels[index] };
  index = project.instruments.findIndex(t => t.id === id);
  return index >= 0 ? { kind: 'instrument', index, track: project.instruments[index] } : null;
}
export function patternClips(project) {
  return project.sequences.flatMap((sequence, index) => projectTracks(project).map(track => ({
    id: newId('clip'), type: 'pattern', trackId: track.id, sequenceId: sequence.id,
    start: index * 16, duration: 16, offset: 0, gain: 1,
  })));
}
