import { sha256 } from '@noble/hashes/sha256';
import { EMPTY_HASH } from './mint.js';
import { SdkValidationError } from './errors.js';
import type { UploadState } from './types.js';

/**
 * Upload integrity safeguards.
 *
 * Background — why this module exists
 * -----------------------------------
 * `xtrata-v3-2-3` does NOT hash the whole file. It keeps a *chained* running
 * hash in on-chain `UploadState`:
 *
 *     running-hash := 0x00…00            (32 zero bytes, set by begin-inscription)
 *     for each chunk, in order:
 *       running-hash := sha256(running-hash || chunk)   (folded at on-chain current-index)
 *
 * The caller never tells the contract which index a batch belongs to — the
 * contract appends at its own `current-index`. The accumulated hash is only
 * checked at seal time: first `current-index == total-chunks`
 * (ERR-INVALID-BATCH u102), then `running-hash == expected-hash`
 * (ERR-HASH-MISMATCH u103).
 *
 * Consequences this module defends against:
 *
 *  1. Stop / restart corruption. If an upload is stopped after k chunks and a
 *     *new* attempt re-feeds chunks from the start of the local array, the
 *     contract folds those early chunks at indices k, k+1, … — shifting and/or
 *     duplicating content. `current-index` still climbs to `total-chunks`, so
 *     the failure only surfaces at seal as u103. A count-based resume
 *     ("k chunks done, send the rest") cannot detect this because k is right;
 *     it is the *bytes already folded* that are wrong. The only reliable check
 *     is to compare the on-chain `running-hash` against the locally recomputed
 *     chained hash of the first `current-index` local chunks.
 *
 *  2. Non-idempotent retries. Re-broadcasting an add-chunk-batch after a
 *     wallet/network error — when the first broadcast actually landed — folds
 *     the same bytes twice. Always re-read on-chain `current-index` and only
 *     submit the batch whose start == current-index; skip batches already past.
 *
 *  3. Blind sealing. Broadcasting seal without first confirming the on-chain
 *     running-hash equals the expected hash wastes a fee and surfaces u103 the
 *     hard way. Verify locally first.
 *
 * Note on parents / dependencies: relationships are passed only at seal time
 * and never feed the running hash, so they cannot cause u103. They are still a
 * footgun across restarts (a resumed attempt with different parents seals
 * something other than intended, or fails ERR-DEPENDENCY-MISSING u111), so
 * `compareUploadSettings` surfaces that drift as a warning.
 */

const HASH_LENGTH = 32;

/** Constant-shape byte comparison. */
export const bytesEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
};

/** Lowercase hex (no `0x` prefix) for logging/diagnostics. */
export const toHex = (bytes: Uint8Array): string => {
  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
};

const concatBytes = (left: Uint8Array, right: Uint8Array): Uint8Array => {
  const combined = new Uint8Array(left.length + right.length);
  combined.set(left, 0);
  combined.set(right, left.length);
  return combined;
};

const toNumber = (value: number | bigint): number =>
  typeof value === 'bigint' ? Number(value) : value;

/**
 * The contract's running hash after the first `count` chunks have been folded,
 * in order. `runningHashAfter(chunks, chunks.length)` equals
 * `computeExpectedHash(chunks)`; `runningHashAfter(chunks, 0)` is the 32-byte
 * zero seed.
 */
export const runningHashAfter = (
  chunks: Uint8Array[],
  count: number
): Uint8Array => {
  if (!Number.isInteger(count) || count < 0 || count > chunks.length) {
    throw new SdkValidationError(
      'INVALID_PREFIX_COUNT',
      `count must be an integer in [0, ${chunks.length}], received ${count}.`
    );
  }
  let runningHash = EMPTY_HASH;
  for (let i = 0; i < count; i += 1) {
    runningHash = new Uint8Array(sha256(concatBytes(runningHash, chunks[i])));
  }
  return runningHash;
};

export type ResumeStatus =
  | 'fresh'
  | 'resume'
  | 'complete'
  | 'shape-mismatch'
  | 'corrupt';

export interface ResumeDecision {
  /**
   * - `fresh`          — no on-chain session; begin-inscription and upload from 0.
   * - `resume`         — on-chain prefix matches local file; continue from `resumeFromIndex`.
   * - `complete`       — every chunk is present and the hash matches; go straight to seal.
   * - `shape-mismatch` — on-chain session is for a different file/chunking; do not resume against this file.
   * - `corrupt`        — on-chain bytes diverge from this file's first `current-index` chunks; the session
   *                      cannot be salvaged (start over: abandon-upload + purge, then a fresh begin-inscription).
   */
  status: ResumeStatus;
  /** Local chunk index to resume uploading from (only meaningful for `resume`). */
  resumeFromIndex: number;
  /** Whether broadcasting more add-chunk-batch / seal calls is safe. */
  safe: boolean;
  /** Human-readable explanation, suitable for surfacing in UI. */
  reason: string;
  detail?: {
    onChainCurrentIndex?: number;
    onChainTotalChunks?: number;
    localChunkCount?: number;
    onChainRunningHash?: string;
    expectedPrefixHash?: string;
  };
}

export interface EvaluateResumeParams {
  /** Result of `client.getUploadState(expectedHash, owner)` (null if none). */
  uploadState: UploadState | null;
  /** The local file split into 16 KiB chunks, in order (e.g. `chunkBytes(fileBytes)`). */
  localChunks: Uint8Array[];
  /** `computeExpectedHash(localChunks)` — the hash the seal will check against. */
  expectedHash: Uint8Array;
  /** Optional cross-checks against the on-chain session shape. */
  totalSize?: number | bigint;
  mimeType?: string;
}

/**
 * Decide whether an existing on-chain upload can be safely resumed for the
 * currently selected file. This is the primary defense against the stop/start
 * corruption: it compares the on-chain `running-hash` to the locally recomputed
 * chained hash of the first `current-index` chunks, so a shifted/duplicated
 * upload is caught *before* any further chunk or seal is broadcast — instead of
 * surfacing as ERR-HASH-MISMATCH at seal.
 */
export const evaluateResume = (params: EvaluateResumeParams): ResumeDecision => {
  const { uploadState, localChunks, expectedHash } = params;

  if (expectedHash.length !== HASH_LENGTH) {
    throw new SdkValidationError(
      'INVALID_EXPECTED_HASH',
      `expectedHash must be ${HASH_LENGTH} bytes, received ${expectedHash.length}.`
    );
  }

  const localChunkCount = localChunks.length;

  if (!uploadState) {
    return {
      status: 'fresh',
      resumeFromIndex: 0,
      safe: true,
      reason: 'No on-chain upload found. Begin a fresh inscription and upload from chunk 0.',
      detail: { localChunkCount }
    };
  }

  const onChainTotalChunks = toNumber(uploadState.totalChunks);
  const onChainCurrentIndex = toNumber(uploadState.currentIndex);

  const detail = {
    onChainCurrentIndex,
    onChainTotalChunks,
    localChunkCount,
    onChainRunningHash: toHex(uploadState.runningHash)
  };

  // Shape checks — catches "I restarted with a different file/settings".
  if (onChainTotalChunks !== localChunkCount) {
    return {
      status: 'shape-mismatch',
      resumeFromIndex: 0,
      safe: false,
      reason:
        `On-chain upload expects ${onChainTotalChunks} chunks but the selected file has ` +
        `${localChunkCount}. This session belongs to a different file — re-select the original ` +
        `file, or start over.`,
      detail
    };
  }
  if (params.totalSize !== undefined && toNumber(params.totalSize) !== toNumber(uploadState.totalSize)) {
    return {
      status: 'shape-mismatch',
      resumeFromIndex: 0,
      safe: false,
      reason:
        `On-chain total size (${uploadState.totalSize.toString()}) does not match the selected file ` +
        `(${toNumber(params.totalSize)}). Re-select the original file, or start over.`,
      detail
    };
  }
  if (params.mimeType !== undefined && params.mimeType !== uploadState.mimeType) {
    return {
      status: 'shape-mismatch',
      resumeFromIndex: 0,
      safe: false,
      reason:
        `On-chain MIME type (${uploadState.mimeType}) does not match the selected file ` +
        `(${params.mimeType}). Re-select the original file, or start over.`,
      detail
    };
  }

  // current-index can never legally exceed total-chunks; if it does the session is unusable.
  if (onChainCurrentIndex > onChainTotalChunks || onChainCurrentIndex < 0) {
    return {
      status: 'corrupt',
      resumeFromIndex: 0,
      safe: false,
      reason:
        `On-chain current-index (${onChainCurrentIndex}) is out of range for ${onChainTotalChunks} ` +
        `chunks. Start over: abandon-upload, purge the chunks, then begin a fresh inscription.`,
      detail
    };
  }

  // THE key check: does the on-chain accumulated hash match the chained hash of
  // *our* first current-index chunks? If not, earlier bytes were folded in the
  // wrong order or twice (classic stop/restart). No amount of further uploading
  // can fix a chained hash — it must be restarted.
  const expectedPrefix = runningHashAfter(localChunks, onChainCurrentIndex);
  const prefixDetail = { ...detail, expectedPrefixHash: toHex(expectedPrefix) };

  if (!bytesEqual(expectedPrefix, uploadState.runningHash)) {
    return {
      status: 'corrupt',
      resumeFromIndex: 0,
      safe: false,
      reason:
        `On-chain running hash diverges from this file at the first ${onChainCurrentIndex} chunk(s). ` +
        `The session was corrupted (most often by stopping and starting a new upload, which re-folds ` +
        `early chunks at later indices). A chained hash cannot be repaired — start over: abandon-upload, ` +
        `purge the chunks, then begin a fresh inscription.`,
      detail: prefixDetail
    };
  }

  if (onChainCurrentIndex === onChainTotalChunks) {
    // All chunks present and the prefix-over-all equals expectedHash by construction.
    return {
      status: 'complete',
      resumeFromIndex: onChainCurrentIndex,
      safe: true,
      reason: 'All chunks are uploaded and the on-chain hash matches. Proceed to seal.',
      detail: prefixDetail
    };
  }

  return {
    status: 'resume',
    resumeFromIndex: onChainCurrentIndex,
    safe: true,
    reason: `Verified ${onChainCurrentIndex}/${onChainTotalChunks} chunks match. Safe to resume from chunk ${onChainCurrentIndex}.`,
    detail: prefixDetail
  };
};

export type BatchAction = 'submit' | 'skip' | 'reconcile';

export interface BatchPlan {
  action: BatchAction;
  reason: string;
}

/**
 * Idempotency guard for (re)submitting a single add-chunk-batch. Call this
 * immediately before every broadcast — including retries — after re-reading the
 * on-chain `current-index`.
 *
 * - `submit`    — the batch starts exactly at current-index; broadcast it.
 * - `skip`      — the batch already landed on a previous attempt; do NOT
 *                 re-broadcast (re-broadcasting double-folds and corrupts the hash).
 * - `reconcile` — there is a gap or partial overlap; an earlier batch is missing
 *                 or state is ambiguous. Re-read state / rebuild the plan rather
 *                 than blindly submitting.
 */
export const planChunkBatch = (params: {
  onChainCurrentIndex: number | bigint;
  batchStartIndex: number;
  batchLength: number;
}): BatchPlan => {
  const current = toNumber(params.onChainCurrentIndex);
  const { batchStartIndex, batchLength } = params;

  if (batchLength <= 0) {
    return { action: 'reconcile', reason: 'Empty batch; nothing to submit.' };
  }
  if (batchStartIndex === current) {
    return { action: 'submit', reason: `Batch starts at current-index ${current}; safe to submit.` };
  }
  if (batchStartIndex + batchLength <= current) {
    return {
      action: 'skip',
      reason: `Batch [${batchStartIndex}, ${batchStartIndex + batchLength}) already landed (current-index ${current}). Skipping to avoid double-folding.`
    };
  }
  if (batchStartIndex > current) {
    return {
      action: 'reconcile',
      reason: `Gap: batch starts at ${batchStartIndex} but current-index is ${current}. An earlier batch has not landed yet.`
    };
  }
  return {
    action: 'reconcile',
    reason: `Partial overlap: batch [${batchStartIndex}, ${batchStartIndex + batchLength}) straddles current-index ${current}. Re-read state and rebuild the batch.`
  };
};

export interface AssertSealableParams {
  uploadState: UploadState | null;
  expectedHash: Uint8Array;
  /** Optional: assert the on-chain chunk total matches the local file. */
  localChunkCount?: number;
}

/**
 * Pre-seal guard. Throws `SdkValidationError` unless the on-chain session is
 * fully uploaded AND its running hash equals `expectedHash`. Call this before
 * broadcasting any seal variant so a divergence is caught locally instead of
 * burning a fee on a u103.
 */
export const assertSealable = (params: AssertSealableParams): void => {
  const { uploadState, expectedHash, localChunkCount } = params;

  if (expectedHash.length !== HASH_LENGTH) {
    throw new SdkValidationError(
      'INVALID_EXPECTED_HASH',
      `expectedHash must be ${HASH_LENGTH} bytes, received ${expectedHash.length}.`
    );
  }
  if (!uploadState) {
    throw new SdkValidationError(
      'SEAL_NO_UPLOAD_STATE',
      'No on-chain upload state found for this hash and owner; nothing to seal.'
    );
  }

  const total = toNumber(uploadState.totalChunks);
  const current = toNumber(uploadState.currentIndex);

  if (localChunkCount !== undefined && total !== localChunkCount) {
    throw new SdkValidationError(
      'SEAL_SHAPE_MISMATCH',
      `On-chain upload expects ${total} chunks but the selected file has ${localChunkCount}.`
    );
  }
  if (current !== total) {
    throw new SdkValidationError(
      'SEAL_INCOMPLETE',
      `Upload is incomplete: ${current}/${total} chunks present. Finish uploading before sealing (would fail ERR-INVALID-BATCH u102).`
    );
  }
  if (!bytesEqual(uploadState.runningHash, expectedHash)) {
    throw new SdkValidationError(
      'SEAL_HASH_MISMATCH',
      `On-chain running hash ${toHex(uploadState.runningHash)} does not equal expected hash ${toHex(expectedHash)}. ` +
        `Sealing now would fail ERR-HASH-MISMATCH (u103). The session is corrupted — start over.`
    );
  }
};

export interface UploadSettingsSnapshot {
  tokenUri?: string | null;
  mimeType?: string;
  totalChunks?: number;
  /** Dependency / parent token ids, as strings, in any order. */
  dependencyIds?: string[];
  parentIds?: string[];
}

export interface SettingsDrift {
  changed: boolean;
  fields: string[];
  /** Per-field before/after for anything that drifted. */
  diffs: Record<string, { previous: unknown; current: unknown }>;
}

const sameIdSet = (a: string[] = [], b: string[] = []): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  const setB = new Set(b);
  return a.every((id) => setB.has(id));
};

/**
 * Compares the settings of a saved attempt against the current attempt and
 * reports drift. Relationships (dependencies/parents) and token-uri do not
 * affect the running hash, so they cannot cause u103 — but changing them across
 * a stop/restart silently changes what gets minted (or fails seal with
 * ERR-DEPENDENCY-MISSING u111). Surface this as a confirmation prompt before
 * resuming a session whose settings have changed.
 */
export const compareUploadSettings = (
  previous: UploadSettingsSnapshot,
  current: UploadSettingsSnapshot
): SettingsDrift => {
  const diffs: Record<string, { previous: unknown; current: unknown }> = {};

  const compareScalar = (key: keyof UploadSettingsSnapshot) => {
    if (previous[key] !== undefined && current[key] !== undefined && previous[key] !== current[key]) {
      diffs[key] = { previous: previous[key], current: current[key] };
    }
  };

  compareScalar('tokenUri');
  compareScalar('mimeType');
  compareScalar('totalChunks');

  if (
    (previous.dependencyIds !== undefined || current.dependencyIds !== undefined) &&
    !sameIdSet(previous.dependencyIds, current.dependencyIds)
  ) {
    diffs.dependencyIds = {
      previous: previous.dependencyIds ?? [],
      current: current.dependencyIds ?? []
    };
  }
  if (
    (previous.parentIds !== undefined || current.parentIds !== undefined) &&
    !sameIdSet(previous.parentIds, current.parentIds)
  ) {
    diffs.parentIds = {
      previous: previous.parentIds ?? [],
      current: current.parentIds ?? []
    };
  }

  const fields = Object.keys(diffs);
  return { changed: fields.length > 0, fields, diffs };
};
