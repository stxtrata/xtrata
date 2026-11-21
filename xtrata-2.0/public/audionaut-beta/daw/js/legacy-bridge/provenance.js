// Inert import evidence only: this module has no project, state or audio dependencies.
import { validateDocumentTree, fail } from './read-document.js';
import { LEGACY_PROFILES } from './profiles.js';
import { getVerifiedLegacyRepair } from './repair-registry.js';
export function validateLegacyImport(value) {
  if (value == null) return null;
  validateDocumentTree(value, { depth: 16, nodes: 200000 });
  if (
    value.version !== 1 ||
    typeof value.profileId !== 'string' ||
    !LEGACY_PROFILES[value.profileId] ||
    typeof value.sourceHash !== 'string' ||
    !/^[a-f\d]{64}$/.test(value.sourceHash) ||
    !['json', 'gzip'].includes(value.container)
  )
    fail('INVALID_PROVENANCE', 'Invalid legacy import provenance.');
  const allowed = new Set([
    'version',
    'format',
    'profileId',
    'sourceHash',
    'container',
    'sourceBytes',
    'expandedBytes',
    'repairs',
    'inertEvents',
    'duplicateEvents',
    'warnings',
    'metadata',
    'unsupportedFields'
  ]);
  if (Object.keys(value).some((k) => !allowed.has(k)))
    fail('INVALID_PROVENANCE', 'Unexpected legacy provenance field.');
  if (JSON.stringify(value).length > 2 * 1024 * 1024)
    fail('PROVENANCE_LIMIT', 'Legacy provenance exceeds 2 MiB.');
  if (
    !Number.isSafeInteger(value.sourceBytes) ||
    value.sourceBytes < 0 ||
    value.sourceBytes > 8 * 1024 * 1024 ||
    !Number.isSafeInteger(value.expandedBytes) ||
    value.expandedBytes < 0 ||
    value.expandedBytes > 16 * 1024 * 1024
  )
    fail('INVALID_PROVENANCE', 'Invalid legacy input sizes.');
  for (const name of ['inertEvents', 'duplicateEvents']) {
    if (!Array.isArray(value[name]) || value[name].length > 65536)
      fail('PROVENANCE_LIMIT', 'Too many retained legacy events.');
    for (const e of value[name])
      if (
        !e ||
        typeof e.sequence !== 'string' ||
        !/^((Sequence|s)\d+)$/.test(e.sequence) ||
        Number(e.sequence.replace(/\D/g, '')) >= 64 ||
        !Number.isInteger(e.channel) ||
        e.channel < 0 ||
        e.channel >= 64 ||
        !Number.isInteger(e.index) ||
        e.index < 0 ||
        e.index > 64 ||
        typeof e.reverse !== 'boolean' ||
        Object.keys(e).some(
          (k) => !['sequence', 'channel', 'index', 'reverse', 'reason'].includes(k)
        ) ||
        !['outside-profile-range', 'duplicate', 'conflicting-direction'].includes(e.reason)
      )
        fail('INVALID_PROVENANCE', 'Invalid retained legacy event.');
  }
  if (
    !Array.isArray(value.repairs) ||
    value.repairs.length > 16 ||
    !Array.isArray(value.warnings) ||
    value.warnings.length > 512 ||
    !Array.isArray(value.unsupportedFields) ||
    value.unsupportedFields.length > 512
  )
    fail('INVALID_PROVENANCE', 'Invalid legacy report arrays.');
  if (!value.metadata || typeof value.metadata !== 'object' || Array.isArray(value.metadata))
    fail('INVALID_PROVENANCE', 'Invalid retained metadata.');
  const fields = new Set([
    'sequenceKeys',
    'currentSequence',
    'channelGroups',
    'channelSettings',
    'globalPlaybackSpeed',
    'trimSettings',
    'channelVolume',
    'channelPlaybackSpeed',
    'projectBPM'
  ]);
  if (Object.keys(value.metadata).some((k) => !fields.has(k)))
    fail('INVALID_PROVENANCE', 'Unexpected retained metadata.');
  const plain = (x) => x && typeof x === 'object' && !Array.isArray(x),
    finite = (x) => typeof x === 'number' && Number.isFinite(x),
    text = (x, max) => typeof x === 'string' && x.length <= max;
  if (!text(value.format, 64)) fail('INVALID_PROVENANCE', 'Invalid legacy format label.');
  for (const name of [
    'sequenceKeys',
    'channelGroups',
    'trimSettings',
    'channelVolume',
    'channelPlaybackSpeed'
  ])
    if (
      value.metadata[name] !== undefined &&
      (!Array.isArray(value.metadata[name]) || value.metadata[name].length > 64)
    )
      fail('INVALID_PROVENANCE', 'Invalid bounded metadata array.');
  if (value.metadata.sequenceKeys?.some((x) => !text(x, 32) || !/^(Sequence|s)\d+$/.test(x)))
    fail('INVALID_PROVENANCE', 'Invalid retained sequence keys.');
  if (value.metadata.channelGroups?.some((x) => !text(x, 128)))
    fail('INVALID_PROVENANCE', 'Invalid retained channel groups.');
  for (const key of ['channelVolume', 'channelPlaybackSpeed'])
    if (value.metadata[key]?.some((x) => !finite(x)))
      fail('INVALID_PROVENANCE', 'Invalid retained channel setting.');
  if (
    value.metadata.currentSequence !== undefined &&
    (!Number.isInteger(value.metadata.currentSequence) ||
      value.metadata.currentSequence < 0 ||
      value.metadata.currentSequence > 64)
  )
    fail('INVALID_PROVENANCE', 'Invalid retained sequence selection.');
  if (value.metadata.globalPlaybackSpeed !== undefined && value.metadata.globalPlaybackSpeed !== 1)
    fail('INVALID_PROVENANCE', 'Unsupported retained global speed.');
  if (
    value.metadata.projectBPM !== undefined &&
    !(
      finite(value.metadata.projectBPM) ||
      (text(value.metadata.projectBPM, 32) &&
        /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.metadata.projectBPM.trim()))
    )
  )
    fail('INVALID_PROVENANCE', 'Invalid retained tempo.');
  for (const trim of value.metadata.trimSettings || [])
    if (
      !plain(trim) ||
      Object.entries(trim).some(
        ([k, v]) =>
          ![
            'start',
            'end',
            'startSliderValue',
            'endSliderValue',
            'totalSampleDuration',
            'steps',
            'length'
          ].includes(k) || !finite(v)
      )
    )
      fail('INVALID_PROVENANCE', 'Unsupported retained trim metadata.');
  if (value.metadata.channelSettings !== undefined) {
    const settings = value.metadata.channelSettings;
    if (!plain(settings) || Object.keys(settings).length > 64)
      fail('INVALID_PROVENANCE', 'Invalid retained channel settings.');
    for (const [key, row] of Object.entries(settings))
      if (
        !/^(?:ch\d+|\d+|[A-Z])$/.test(key) ||
        !plain(row) ||
        Object.entries(row).some(([k, v]) => !['volume', 'pitch'].includes(k) || v !== 1)
      )
        fail('INVALID_PROVENANCE', 'Unsupported retained channel setting.');
  }
  for (const warning of value.warnings)
    if (
      !plain(warning) ||
      Object.keys(warning).some((k) => !['code', 'message', 'path', 'severity'].includes(k)) ||
      !text(warning.code, 80) ||
      !text(warning.message, 2048) ||
      !text(warning.path, 512) ||
      !['info', 'warning'].includes(warning.severity)
    )
      fail('INVALID_PROVENANCE', 'Invalid retained import warning.');
  if (value.unsupportedFields.some((x) => !text(x, 512)))
    fail('INVALID_PROVENANCE', 'Invalid unsupported-field path.');
  const canonical = (x) =>
    x === undefined
      ? 'undefined'
      : x && typeof x === 'object'
        ? Array.isArray(x)
          ? '[' + x.map(canonical).join(',') + ']'
          : '{' +
            Object.keys(x)
              .sort()
              .map((k) => JSON.stringify(k) + ':' + canonical(x[k]))
              .join(',') +
            '}'
        : JSON.stringify(x);
  for (const repair of value.repairs) {
    if (!plain(repair)) fail('INVALID_PROVENANCE', 'Invalid repair provenance.');
    const expected = getVerifiedLegacyRepair(repair.originalSha256),
      keys = new Set([...Object.keys(expected || {}), 'format', 'changedFields', 'restoredEvents']);
    if (
      !expected ||
      repair.originalSha256 !== value.sourceHash ||
      repair.format !== 'audionaut-legacy-repair/1' ||
      Object.keys(repair).some((k) => !keys.has(k)) ||
      Object.entries(expected).some(([k, v]) => canonical(repair[k]) !== canonical(v))
    )
      fail('INVALID_PROVENANCE', 'Repair provenance does not match the verified registry.');
    if (
      !Array.isArray(repair.changedFields) ||
      repair.changedFields.length > 4096 ||
      repair.changedFields.some((x) => !text(x, 256) || !/^\/(?:[A-Za-z0-9_-]+\/?)+$/.test(x)) ||
      !Array.isArray(repair.restoredEvents) ||
      repair.restoredEvents.length > 1
    )
      fail('INVALID_PROVENANCE', 'Invalid repair changes.');
    for (const event of repair.restoredEvents)
      if (
        !plain(event) ||
        Object.keys(event).some(
          (k) => !['path', 'index', 'reverse', 'siblingSha256', 'note'].includes(k)
        ) ||
        !text(event.path, 256) ||
        event.index !== 42 ||
        event.reverse !== false ||
        !/^[a-f0-9]{64}$/.test(event.siblingSha256) ||
        !text(event.note, 512)
      )
        fail('INVALID_PROVENANCE', 'Invalid repaired event.');
  }
  return structuredClone(value);
}
