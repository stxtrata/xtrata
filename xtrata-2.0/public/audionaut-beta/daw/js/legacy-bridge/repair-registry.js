import { TRUTH_PATTERN_JSON } from './repair-pattern-data.js';
import { TRUTH_SOURCE_JSON, BUTTERFLY_SOURCE_JSON } from './repair-source-data.js';
import { VERIFIED_SOURCE_TAILS } from './repair-padding-data.js';
import { decodeDocumentBytes } from './read-document.js';

// Repairs are tied to the original file bytes, never its title, filename or a
// caller-supplied hash. Only this small, reviewed registry can select a repair.
const COMMIT = '194e4be90ec11431b0b9596df6dd9a3dfc2afd44';
const REPOSITORY = 'https://github.com/blockchainbrighton/audionals';
const ROOT = 'Audional_Playback_Engine/newAudionalPlayer2.0/basedSongs/testSongFiles/';
const MAX_BYTES = 64 * 1024 * 1024;
const encoder = new TextEncoder();
const COMPANIONS = {
  patterns: {
    json: TRUTH_PATTERN_JSON,
    sha256: '0d619e072a8085a107dbb1e74b2a112d2c1fe39f29eed84f92d8b8317147d07f',
    sourceSha256: '0d619e072a8085a107dbb1e74b2a112d2c1fe39f29eed84f92d8b8317147d07f',
    path: ROOT + 'jsonAnalysisAndSerialization/serializedFiles/TRUTH_AUDX_17_patterns.json',
    extraction: 'Exact UTF-8 companion file; 166 numbered step arrays.'
  },
  truthSources: {
    json: TRUTH_SOURCE_JSON,
    sha256: '831b30c7104047a05633521546209bb37b51b05df8d2d1bede444881c1863880',
    sourceSha256: '1d5fb72a52dafbce35f910989c4bc0eba55579e3e4fec2a1006975e0a59448df',
    path: ROOT + 'TRUTH_AUDX_17.json',
    extraction:
      'Only channelURLs and projectChannelNames, in that order, serialized as compact UTF-8 JSON.'
  },
  butterflySources: {
    json: BUTTERFLY_SOURCE_JSON,
    sha256: '0abe7317fdcbcda17503eac326a49ddcb7e605f206e7894e8a760a0cf49d7187',
    sourceSha256: '76e303aff00a411bf5193fb1cba52039524b527d59e97bd8bb7292c428d5019e',
    path: ROOT + 'butterflyEffect.json',
    extraction:
      'Only channelURLs and projectChannelNames, in that order, serialized as compact UTF-8 JSON.'
  }
};
const ENTRIES = [
  {
    id: 'truth-pattern-companion-v1',
    kind: 'pattern-companion',
    inputSha256: '5df1ed5bf8b48d5102e892f0ac7cb4feb36c12c03b3ceec78369e18749caf21a',
    inputBytes: 9316,
    companion: 'patterns',
    compact: true,
    resultSha256: '272ea813fb880d7580ed130349ef59e813a789b7b797929b5685fd2ae32422f9'
  },
  {
    id: 'truth-discarded-pattern-zero-v1',
    kind: 'pattern-companion-and-event-repair',
    inputSha256: '0bfb3c3a8e4a00eaf4bdc8f890ffaeedbbc8f6090cdb2cf7d463de84159addf2',
    inputBytes: 22513,
    companion: 'patterns',
    restoreZero: true,
    resultSha256: '0d06fe6486655b8bb63f990e4f65f04b89d6e57013745d2a02548c0f1c5e87de'
  },
  {
    id: 'truth-numeric-source-map-v1',
    kind: 'source-map-repair',
    inputSha256: '00f6b7b2d414753441af1019ac74af8fed9be0bb0602f51ef326f8df2990019d',
    inputBytes: 108610,
    companion: 'truthSources',
    resultSha256: '0d06fe6486655b8bb63f990e4f65f04b89d6e57013745d2a02548c0f1c5e87de'
  },
  {
    id: 'truth-letter-source-map-v1',
    kind: 'source-map-repair',
    inputSha256: 'a900c83afc8da1e38696f82ec6a51a0dd71e9bfe21e91fe7ba46e40e911a7af6',
    inputBytes: 22987,
    companion: 'truthSources',
    compact: true,
    resultSha256: '72baa4bda8c7462f700cdb8a5b17fcc5ec9747a044aea3ec227d004e8960758a'
  },
  {
    id: 'butterfly-numeric-source-map-v1',
    kind: 'source-map-repair',
    inputSha256: 'c9e46449fde1c12045ac1e0ad2daebba1d31391c735489b4e36b961f366df613',
    inputBytes: 23922,
    companion: 'butterflySources',
    resultSha256: '5b1b3060c2dfba8f711dd2deb242c810f66cc9aee68d1ea439df049395604b37'
  }
];
for (const row of VERIFIED_SOURCE_TAILS) {
  const proof = JSON.parse(row.companionJson);
  COMPANIONS[row.id] = {
    json: row.companionJson,
    sha256: row.companionSha256,
    suppliedProvenance: {
      kind: 'verified-supplied-sibling',
      sourceSha256: row.sourceSha256,
      originalSourceArraySha256: proof.originalSourceArraySha256,
      donorSourceArraySha256: proof.donorSourceArraySha256,
      originalSourceCount: proof.originalSourceCount,
      channelCount: proof.channelCount,
      extraction:
        'Verified positional source-array prefix and empty tail. Only missing trailing empty slots are appended; original source strings and all musical values remain unchanged.'
    }
  };
  ENTRIES.push({
    id: row.id,
    kind: row.kind,
    inputSha256: row.inputSha256,
    inputBytes: row.inputBytes,
    compact: true,
    companion: row.id,
    resultSha256: row.resultSha256
  });
}
const BY_HASH = new Map(ENTRIES.map((entry) => [entry.inputSha256, entry]));

function failure(code, message) {
  const error = new Error(message);
  error.name = 'LegacyRepairError';
  error.code = 'AUDIONAUT_LEGACY_REPAIR_' + code;
  return error;
}
function copyBytes(value) {
  let bytes;
  if (value instanceof ArrayBuffer) bytes = new Uint8Array(value);
  else if (ArrayBuffer.isView(value))
    bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  else
    throw failure(
      'INVALID_BYTES',
      'Original file bytes are required to verify a historical repair.'
    );
  if (bytes.byteLength > MAX_BYTES)
    throw failure('LIMIT', 'Historical repair input exceeds the 64 MiB verification limit.');
  return bytes.slice();
}
async function digest(bytes) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (value) =>
    value.toString(16).padStart(2, '0')
  ).join('');
}
// Copy data before the first await, and reject accessors/non-JSON values rather
// than invoke toJSON or preserve mutable references across hash verification.
function snapshot(value) {
  let nodes = 0;
  function visit(item, depth) {
    if (++nodes > 1000000 || depth > 64)
      throw failure('LIMIT', 'Historical repair document exceeds its structural limits.');
    if (item === null || typeof item === 'string' || typeof item === 'boolean') return item;
    if (typeof item === 'number' && Number.isFinite(item)) return item;
    if (
      !item ||
      typeof item !== 'object' ||
      ![Object.prototype, Array.prototype, null].includes(Object.getPrototypeOf(item))
    )
      throw failure('INVALID_DOCUMENT', 'Historical repairs require plain JSON data.');
    const array = Array.isArray(item),
      result = array ? [] : {};
    if (
      array &&
      (Object.keys(item).length !== item.length ||
        Object.keys(item).some((key) => !/^(0|[1-9]\d*)$/.test(key) || Number(key) >= item.length))
    )
      throw failure('INVALID_DOCUMENT', 'Historical repairs require dense JSON arrays.');
    for (const key of Object.keys(item)) {
      if (key === '__proto__' || key === 'prototype' || key === 'constructor')
        throw failure('INVALID_DOCUMENT', 'Unsafe historical document key.');
      const descriptor = Object.getOwnPropertyDescriptor(item, key);
      if (!descriptor || !Object.hasOwn(descriptor, 'value'))
        throw failure('INVALID_DOCUMENT', 'Historical repairs cannot read accessor properties.');
      result[key] = visit(descriptor.value, depth + 1);
    }
    if (array && result.length !== item.length)
      throw failure('INVALID_DOCUMENT', 'Historical repairs cannot read sparse arrays.');
    return result;
  }
  return visit(value, 0);
}
function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object')
    return (
      '{' +
      Object.keys(value)
        .sort()
        .map((key) => JSON.stringify(key) + ':' + canonical(value[key]))
        .join(',') +
      '}'
    );
  return JSON.stringify(value);
}
function provenance(companion) {
  if (companion.suppliedProvenance) return { ...companion.suppliedProvenance };
  return {
    repository: REPOSITORY,
    commit: COMMIT,
    path: companion.path,
    sourceSha256: companion.sourceSha256,
    extraction: companion.extraction
  };
}
function metadata(entry) {
  const companion = COMPANIONS[entry.companion];
  return {
    id: entry.id,
    kind: entry.kind,
    originalSha256: entry.inputSha256,
    originalBytes: entry.inputBytes,
    companionSha256: companion.sha256,
    companionBytes: encoder.encode(companion.json).byteLength,
    resultSha256: entry.resultSha256,
    resultHashEncoding: 'canonical-json-sort-keys/1',
    provenance: provenance(companion)
  };
}

export function getVerifiedLegacyRepair(originalSha256) {
  const entry = BY_HASH.get(originalSha256);
  return entry ? metadata(entry) : null;
}
export function listVerifiedLegacyRepairs() {
  return ENTRIES.map(metadata);
}

// This also allows an explicitly supplied companion to be checked before use.
// The extraction hash is distinct from the historical full-source file hash.
export async function verifyRepairCompanion(originalSha256, bytes) {
  const entry = BY_HASH.get(originalSha256);
  if (!entry)
    throw failure('UNKNOWN_INPUT', 'No built-in companion is verified for this original file.');
  const companion = COMPANIONS[entry.companion];
  const copied = bytes === undefined ? encoder.encode(companion.json) : copyBytes(bytes);
  if ((await digest(copied)) !== companion.sha256)
    throw failure(
      'COMPANION_MISMATCH',
      'The historical companion bytes do not match the verified SHA-256.'
    );
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(copied));
}

/** Run before contextual numeric-key decoding. Unknown hashes receive no repair.
 * sha256 is an optional assertion, never the authority for repair selection.
 * companionBytes, when supplied, must match the built-in companion exactly.
 */
export async function applyVerifiedLegacyRepair({ bytes, document, sha256, companionBytes } = {}) {
  const copied = copyBytes(bytes),
    input = snapshot(document);
  const explicitCompanion = companionBytes === undefined ? undefined : copyBytes(companionBytes);
  const actualHash = await digest(copied);
  if (sha256 !== undefined && sha256 !== actualHash)
    throw failure('HASH_MISMATCH', 'The supplied original-file hash does not match its bytes.');
  const entry = BY_HASH.get(actualHash);
  if (!entry) return { document: input, repair: null };
  const original = (await decodeDocumentBytes(copied)).document;
  if (copied.byteLength !== entry.inputBytes || canonical(original) !== canonical(input))
    throw failure(
      'INPUT_MISMATCH',
      'The historical document changed after its original file was read; no repair was applied.'
    );
  const data = await verifyRepairCompanion(actualHash, explicitCompanion);
  const changedFields = [],
    restoredEvents = [];
  if (entry.kind === 'source-tail-padding') {
    const sources = input['4'];
    if (
      !Array.isArray(sources) ||
      sources.length !== data.originalSourceCount ||
      data.channelCount !== 64 ||
      (await digest(encoder.encode(JSON.stringify(sources)))) !== data.originalSourceArraySha256
    )
      throw failure('INPUT_MISMATCH', 'The verified source-tail repair precondition failed.');
    while (sources.length < data.channelCount) sources.push('');
    changedFields.push('/4');
  } else if (entry.companion === 'patterns') {
    const sequenceKey = entry.compact ? '14' : 'projectSequences',
      stepKey = entry.compact ? '15' : 'steps';
    for (const [sequence, channels] of Object.entries(input[sequenceKey])) {
      for (const [channel, row] of Object.entries(channels)) {
        if (typeof row[stepKey] !== 'number') continue;
        const id = row[stepKey];
        if (!Number.isSafeInteger(id) || !Object.hasOwn(data, id) || !Array.isArray(data[id]))
          throw failure(
            'PATTERN_MISSING',
            'The verified companion does not contain a referenced pattern.'
          );
        row[stepKey] = snapshot(data[id]);
        changedFields.push('/' + [sequenceKey, sequence, channel, stepKey].join('/'));
      }
    }
    if (entry.restoreZero) {
      if (Object.hasOwn(input.projectSequences.Sequence0, 'ch0'))
        throw failure('INPUT_MISMATCH', 'The verified missing-pattern repair precondition failed.');
      input.projectSequences.Sequence0.ch0 = { steps: snapshot(data['0']) };
      changedFields.push('/projectSequences/Sequence0/ch0');
      restoredEvents.push({
        path: '/projectSequences/Sequence0/ch0/steps',
        index: 42,
        reverse: false,
        siblingSha256: '5df1ed5bf8b48d5102e892f0ac7cb4feb36c12c03b3ceec78369e18749caf21a',
        note: 'Restored from the verified sibling; this event is absent from the input itself.'
      });
    }
  } else {
    const urls = entry.compact ? '4' : 'channelURLs',
      names = entry.compact ? '8' : 'projectChannelNames';
    input[urls] = snapshot(data.channelURLs);
    input[names] = snapshot(data.projectChannelNames);
    changedFields.push('/' + urls, '/' + names);
  }
  const resultHash = await digest(encoder.encode(canonical(input)));
  if (resultHash !== entry.resultSha256)
    throw failure(
      'RESULT_MISMATCH',
      'The historical repair result does not match its reviewed result hash.'
    );
  return {
    document: input,
    repair: {
      format: 'audionaut-legacy-repair/1',
      ...metadata(entry),
      changedFields,
      restoredEvents
    }
  };
}
