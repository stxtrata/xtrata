// References: audionals bfb597a6100da17af4069043819ef543757a8242,
// New_Audional_Sequencer_v2/audioUtils.js381–459 (editor);
// 194e4be90ec11431b0b9596df6dd9a3dfc2afd44,
// Audional_Playback_Engine/newAudionalPlayer2.0/basedSongs/commonUtils.js1–40.
// Playback semantics are explicit, versioned musical data. Keep source references
// and import evidence elsewhere: this object accepts no opaque metadata.
export const LEGACY_PLAYBACK_IDS = Object.freeze([
  'audionals-editor-v1',
  'audionals-standalone-v1'
]);
const PROFILES = Object.freeze({
  'audionals-editor-v1': Object.freeze({
    id: 'audionals-editor-v1',
    divideSourceDuration: false,
    schedulingFadeSeconds: 0
  }),
  'audionals-standalone-v1': Object.freeze({
    id: 'audionals-standalone-v1',
    divideSourceDuration: true,
    schedulingFadeSeconds: 0.01
  })
});
export function normalizeLegacyPlayback(value) {
  if (value == null) return undefined;
  if (
    typeof value !== 'object' ||
    Array.isArray(value) ||
    value.version !== 1 ||
    !Object.hasOwn(PROFILES, value.id) ||
    Object.keys(value).some((key) => key !== 'version' && key !== 'id')
  ) {
    throw new Error(
      'Unsupported historical playback profile. Choose a supported import profile before playback.'
    );
  }
  return { version: 1, id: value.id };
}
export function legacyPlaybackProfile(project) {
  const value = normalizeLegacyPlayback(project?.legacyPlayback);
  return value ? PROFILES[value.id] : null;
}

// AudioBufferSource.start duration is SOURCE seconds. The standalone player
// divided those by rate as well as setting playbackRate: audible duration is
// therefore trim/rate², bounded by the end of the decoded (possibly reversed)
// buffer. Preserve that historical behavior, including rate<1 beyond trimEnd.
// A printed/native timeline clip has already rendered these semantics once.
export function legacySamplePlayback(
  project,
  track,
  over,
  bufferDuration,
  { chaseSeconds = 0 } = {}
) {
  const profile = legacyPlaybackProfile(project);
  if (!profile || track?.clipSnapshot) return null;
  const finite = (value, fallback) => (Number.isFinite(value) ? value : fallback);
  const rate = Math.max(0.1, Math.min(100, finite(over?.pitch ?? track.pitch, 1)));
  const trimStart = Math.max(0, Math.min(1, finite(over?.trimStart ?? track.trimStart, 0)));
  const trimEnd = Math.max(trimStart, Math.min(1, finite(over?.trimEnd ?? track.trimEnd, 1)));
  const reverse = over?.rev ?? track.reverse;
  const duration = Math.max(0, finite(bufferDuration, 0));
  const offset = (reverse ? 1 - trimEnd : trimStart) * duration;
  const requested = ((trimEnd - trimStart) * duration) / (profile.divideSourceDuration ? rate : 1);
  const totalSourceDuration = Math.min(requested, duration - offset);
  const consumed = Math.max(0, finite(chaseSeconds, 0)) * rate;
  const sourceDuration = Math.max(0, totalSourceDuration - consumed);
  return {
    profile,
    rate,
    reverse: !!reverse,
    offset: offset + Math.min(consumed, totalSourceDuration),
    sourceDuration,
    audibleDuration: sourceDuration / rate
  };
}
