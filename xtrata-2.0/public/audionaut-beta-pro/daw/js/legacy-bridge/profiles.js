import { fail } from './read-document.js';
import { KNOWN_LEGACY_HASHES } from './known-hashes.js';
export const BRIDGE_VERSION = 1;
export const LEGACY_PROFILES = Object.freeze({
  'audionals-editor-v1': Object.freeze({
    id: 'audionals-editor-v1',
    label: 'Audional editor',
    description:
      'Saved steps 1–64 play in positions 0–63. Sequence numbers retain gaps; source trims use their normal duration.',
    stepBase: 1,
    sequences: 'numbered',
    audioProfile: 'audionals-editor-v1',
    dense: false
  }),
  'audionals-standalone-v1': Object.freeze({
    id: 'audionals-standalone-v1',
    label: 'Historical standalone player',
    description:
      'Saved steps 0–63 play directly; 64 remains inactive. Stored sequence order is packed. Historical rate/duration behavior is retained.',
    stepBase: 0,
    sequences: 'stored',
    audioProfile: 'audionals-standalone-v1',
    dense: false
  }),
  'audionals-dense-v1': Object.freeze({
    id: 'audionals-dense-v1',
    label: 'Early Audional boolean grid',
    description: 'Each true cell keeps its zero-based array position; sequence-number gaps remain.',
    stepBase: 0,
    sequences: 'numbered',
    audioProfile: 'audionals-editor-v1',
    dense: true
  }),
  'audionals-og-v1': Object.freeze({
    id: 'audionals-og-v1',
    label: 'OG instruction song',
    description:
      'One-based repeating triggers, absolute mute toggles and an explicit song endpoint.',
    stepBase: 1,
    sequences: 'og',
    audioProfile: 'audionals-editor-v1',
    dense: false
  })
});
export function getLegacyProfile(id) {
  const profile = LEGACY_PROFILES[id];
  if (!profile) fail('UNKNOWN_PROFILE', 'Choose a supported historical playback profile.');
  return profile;
}
export function selectLegacyProfile(detection, { profileId, sourceHash, provenance = {} } = {}) {
  const known = KNOWN_LEGACY_HASHES[sourceHash] || null;
  const implicit =
    detection.kind === 'og'
      ? 'audionals-og-v1'
      : detection.dense || detection.format === 'dense-audional'
        ? 'audionals-dense-v1'
        : known?.profileId;
  const chosen = profileId || provenance.profileId || implicit;
  const choices =
    detection.kind === 'og'
      ? [LEGACY_PROFILES['audionals-og-v1']]
      : detection.dense || detection.format === 'dense-audional'
        ? [LEGACY_PROFILES['audionals-dense-v1']]
        : [LEGACY_PROFILES['audionals-editor-v1'], LEGACY_PROFILES['audionals-standalone-v1']];
  if (chosen && !choices.some((p) => p.id === chosen))
    fail('PROFILE_MISMATCH', 'That playback profile does not match the document encoding.');
  return {
    profile: chosen ? getLegacyProfile(chosen) : null,
    requiresProfileChoice: !chosen,
    profileChoices: choices.map(({ id, label, description }) => ({ id, label, description })),
    knownHash: known
  };
}
