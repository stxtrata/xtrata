import {
  readDocument,
  validateDocumentTree,
  checkAbort,
  fail,
  DOCUMENT_LIMITS,
  LegacyImportError
} from './read-document.js';
import { detectFormat } from './detect-format.js';
import { adaptLegacyDocument, normalizeCompanion } from './adapters/index.js';
import { selectLegacyProfile, BRIDGE_VERSION } from './profiles.js';
import { normalizeSong, issue } from './normalize-song.js';
import { legacySongToProject, validateLegacyImport } from './to-project.js';
import { applyVerifiedLegacyRepair } from './repair-registry.js';
import { sha256Sync } from './hash-sync.js';
import { songToProject } from '../song-format.js';
import { normalizeProjectModel } from '../project-model.js';
export {
  readDocument,
  DOCUMENT_LIMITS,
  DOCUMENT_HARD_LIMITS,
  LegacyImportError
} from './read-document.js';
export { detectFormat } from './detect-format.js';
export {
  adaptLegacyDocument,
  decodeCompactDocument,
  expandLegacySteps,
  normalizeCompanion
} from './adapters/index.js';
export { LEGACY_PROFILES, getLegacyProfile, BRIDGE_VERSION } from './profiles.js';
export { normalizeSong, legacySampleReference } from './normalize-song.js';
export { legacySongToProject, validateLegacyImport } from './to-project.js';
function stage(envelope, options, repair = null, companion = null) {
  const { document, sourceHash, container, byteLength, expandedBytes } = envelope,
    detection = detectFormat(document),
    report = {
      version: BRIDGE_VERSION,
      format: detection.format,
      sourceHash,
      container,
      issues: [],
      repairs: repair ? [repair] : [],
      stats: null,
      canImport: false
    };
  const result = {
    kind: detection.kind,
    document,
    project: null,
    report,
    requiresProfileChoice: false,
    profileChoices: [],
    sourceHash,
    container,
    byteLength,
    expandedBytes,
    filename: envelope.filename || ''
  };
  if (detection.kind === 'native') {
    report.canImport = true;
    return result;
  }
  if (byteLength > DOCUMENT_LIMITS.inputBytes || expandedBytes > DOCUMENT_LIMITS.expandedBytes)
    fail(
      'LEGACY_DOCUMENT_TOO_LARGE',
      'Legacy songs are limited to 8 MiB input and 16 MiB expanded JSON. Native projects retain their separate limits.'
    );
  if (detection.kind === 'unknown') {
    issue(
      report,
      'UNKNOWN_FORMAT',
      'This JSON is not a supported Audional or AudioNaut project.',
      '',
      'error'
    );
    return result;
  }
  const selection = selectLegacyProfile(detection, { ...options, sourceHash });
  result.requiresProfileChoice = selection.requiresProfileChoice;
  result.profileChoices = selection.profileChoices;
  report.knownHash = selection.knownHash;
  report.profileId = selection.profile?.id || null;
  report.profileSelection = selection.profileSelection;
  if (detection.mixedDenseSparse) {
    issue(
      report,
      'MIXED_STEP_ENCODING',
      'The project mixes positional boolean and sparse rows; choose a consistent encoding before import.',
      '',
      'error'
    );
    return result;
  }
  try {
    if (detection.kind === 'og') {
      // Retain the established OG landmark decoder and audio behavior. Historical
      // editor/standalone audio rules are not inferred for this distinct wrapper.
      const project = songToProject(document, options.provenance || {});
      project.format = 'audionaut-workstation/3';
      project.legacyImport = validateLegacyImport({
        version: 1,
        format: detection.format,
        profileId: 'audionals-og-v1',
        sourceHash,
        container,
        sourceBytes: byteLength,
        expandedBytes,
        repairs: report.repairs,
        inertEvents: [],
        duplicateEvents: [],
        warnings: [],
        metadata: {},
        unsupportedFields: []
      });
      result.project = normalizeProjectModel(project);
      report.canImport = true;
      report.stats = {
        channels: project.channels.length,
        sequences: project.sequences.length,
        playableEvents: project.sequences.reduce(
          (n, s) => n + s.steps.reduce((m, r) => m + r.filter(Boolean).length, 0),
          0
        )
      };
      return result;
    }
    const adapted = adaptLegacyDocument(document, { companion });
    report.stats = {
      encodedEvents: adapted.expandedEvents,
      sourceSequences: adapted.sequences.length
    };
    const song = normalizeSong(adapted, selection.profile, { report });
    result.normalized = song;
    report.stats = song.stats;
    if (report.issues.some((x) => x.severity === 'error')) return result;
    result.project = legacySongToProject(song, {
      ...envelope,
      format: detection.format,
      repairs: report.repairs,
      report
    });
    report.canImport = true;
    return result;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    if (!(error instanceof LegacyImportError)) throw error;
    issue(report, error.code, error.message, error.path, 'error');
    return result;
  }
}
export async function prepareLegacyImport(input, options = {}) {
  const envelope = await readDocument(input, options);
  checkAbort(options.signal);
  if (detectFormat(envelope.document).kind === 'native') return stage(envelope, options);
  if (
    envelope.byteLength > DOCUMENT_LIMITS.inputBytes ||
    envelope.expandedBytes > DOCUMENT_LIMITS.expandedBytes
  )
    fail(
      'LEGACY_DOCUMENT_TOO_LARGE',
      'Legacy songs are limited to 8 MiB input and 16 MiB expanded JSON.'
    );
  const repaired = await applyVerifiedLegacyRepair({
    bytes: envelope.bytes,
    document: envelope.document,
    sha256: envelope.sourceHash
  });
  checkAbort(options.signal);
  let companion = null,
    companionHash = null;
  if (options.companion != null) {
    const data = await readDocument(options.companion, { signal: options.signal });
    companion = normalizeCompanion(data.document);
    companionHash = data.sourceHash;
  }
  const result = stage(
    { ...envelope, document: repaired.document },
    options,
    repaired.repair,
    companion
  );
  result.document = envelope.document; // Original for preview/download, never embedded in the project.
  if (companionHash) {
    result.report.companionHash = companionHash;
    if (result.project)
      result.project.legacyImport.warnings.push({
        code: 'EXPLICIT_COMPANION',
        severity: 'info',
        path: '',
        message: `Pattern dictionary SHA-256 ${companionHash} was explicitly supplied.`
      });
  }
  checkAbort(options.signal);
  return result;
}
export function prepareLegacyDocumentSync(document, options = {}) {
  validateDocumentTree(document);
  const bytes = new TextEncoder().encode(JSON.stringify(document));
  if (bytes.length > DOCUMENT_LIMITS.inputBytes)
    fail('LEGACY_DOCUMENT_TOO_LARGE', 'Use the asynchronous importer for large native projects.');
  const sourceHash = sha256Sync(bytes);
  return stage(
    {
      document: structuredClone(document),
      sourceHash,
      container: 'json',
      byteLength: bytes.length,
      expandedBytes: bytes.length
    },
    options,
    null,
    options.companion ? normalizeCompanion(options.companion) : null
  );
}
