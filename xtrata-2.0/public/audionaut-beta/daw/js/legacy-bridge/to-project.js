import { makeProject, makeChannel, makeSequence } from '../state.js';
import { normalizeProjectModel } from '../project-model.js';
import { BRIDGE_VERSION } from './profiles.js';
import { validateLegacyImport } from './provenance.js';
export { validateLegacyImport } from './provenance.js';
export function legacySongToProject(
  song,
  {
    sourceHash,
    container = 'json',
    byteLength = 0,
    expandedBytes = 0,
    format = 'sparse-audx',
    repairs = [],
    report = { issues: [] }
  } = {}
) {
  const project = makeProject(),
    key = sourceHash.slice(0, 20);
  project.projectId = `legacy-${sourceHash}`;
  project.renderSeed = project.projectId;
  project.projectName = song.title;
  project.artistName = song.artist;
  project.bpm = song.bpm;
  project.masterVolume = 1;
  project.mixerVersion = 1;
  project.continuous = false;
  project.playEmptySequences = true;
  project.choke = false;
  project.currentSequence = 0;
  project.channels = song.channels.map((c) => ({
    ...makeChannel(c.index),
    ...c,
    id: `legacy-${key}-c${c.index}`,
    name: c.name.slice(0, 64),
    sampleName: c.name
  }));
  project.instruments = [];
  project.sequences = Array.from({ length: song.sequenceCount }, (_, i) => ({
    ...makeSequence(song.channels.length, 0),
    id: `legacy-${key}-s${i}`
  }));
  for (const e of song.events)
    project.sequences[e.sequence].steps[e.channel][e.step] = e.reverse ? { v: 1, rev: true } : 1;
  project.songEndStep = song.sequenceCount * 64;
  project.timeline = {
    enabled: false,
    lengthBeats: song.sequenceCount * 16,
    loop: { enabled: false, start: 0, end: song.sequenceCount * 16 }
  };
  project.legacyPlayback = { version: 1, id: song.audioProfile };
  project.legacyImport = validateLegacyImport({
    version: BRIDGE_VERSION,
    format,
    profileId: song.profileId,
    sourceHash,
    container,
    sourceBytes: byteLength,
    expandedBytes,
    repairs: structuredClone(repairs),
    inertEvents: song.inertEvents,
    duplicateEvents: song.duplicateEvents,
    warnings: report.issues.filter((x) => x.severity !== 'error'),
    metadata: song.metadata,
    unsupportedFields: song.unsupportedFields
  });
  project.format = 'audionaut-workstation/3';
  return normalizeProjectModel(project);
}
