import { MAX_CHUNK_BATCH } from './hash.js';
import type { ManifestItem } from './manifest.js';

/**
 * Pure resume/reconcile decision logic: chain observations in, next actions
 * out. No I/O, no local-state trust — every resume starts here with fresh
 * chain reads. Decisions are deterministic and idempotent: the same inputs
 * always produce the same decision, and an item whose content hash is already
 * indexed can never receive a mint-producing action.
 *
 * Generalization of upload-guard.ts's evaluateResume/planChunkBatch to
 * collection plans (session + collection index + drop states).
 */

export interface ChainObservation {
  /** Collection `Sessions {owner, hash}` row exists. */
  sessionExists: boolean;
  /** Pre-assigned collection index from the session, when present. */
  sessionIndex?: number;
  /** Session past its reservation-expiry window (computed by the reader). */
  sessionExpired?: boolean;
  /** Core `UploadState` for {owner, contentHash}, when an upload was begun. */
  uploadState?: {
    currentIndex: number;
    totalChunks: number;
    runningHashHex: string;
  };
  /** Core token id when the inscription is already sealed. */
  sealedTokenId?: number;
  /** Collection `Items` row (item fully indexed) — block height or truthy marker. */
  itemIndexedAt?: number;
  /** Collection `HashIndex` hit: this content hash is already indexed at this index. */
  hashIndexedAt?: number;
}

export type ResumeAction =
  | 'skip' // already done on-chain — no further txs for this item
  | 'proceed' // continue the plan from `fromStep`
  | 'reconcile-mismatch' // on-chain hash chain disagrees with local bytes
  | 'expired-restart'; // reservation expired — release + restart from scratch

export type ResumeStep =
  | 'reserve'
  | 'begin'
  | 'upload' // continue chunk batches from `resumeFromChunk`
  | 'seal'
  | 'await-index'; // sealed on core; wait/trigger collection indexing

export interface ItemResumeDecision {
  index: number;
  action: ResumeAction;
  /** Where the executor resumes (only for action 'proceed'). */
  fromStep?: ResumeStep;
  /** First local chunk index still to upload (only for fromStep 'upload'). */
  resumeFromChunk?: number;
  /** Chunk batches remaining, at the 32-chunk batch bound. */
  remainingBatches?: number;
  /** Whether broadcasting further txs for this item is safe right now. */
  safe: boolean;
  reason: string;
}

export interface DecideResumeParams {
  item: ManifestItem;
  observation: ChainObservation;
  /**
   * Local chain running hash after k chunks, lowercase hex — recomputed from
   * the actual file bytes (`runningHashAfter`), never from cached state.
   */
  localRunningHashAt: (k: number) => string;
}

export const decideResume = (params: DecideResumeParams): ItemResumeDecision => {
  const { item, observation } = params;
  const base = { index: item.index };

  // 1. Terminal success wins over everything — duplicate-mint safety. This
  // covers broadcast-succeeded-but-unseen-locally: the chain says done, so the
  // retry is a no-op skip regardless of local snapshots.
  if (observation.itemIndexedAt !== undefined || observation.hashIndexedAt !== undefined) {
    return {
      ...base,
      action: 'skip',
      safe: true,
      reason: 'Item content hash is already indexed in the collection. Nothing to do.'
    };
  }

  // 2. Sealed on core but not yet indexed in the collection.
  if (observation.sealedTokenId !== undefined) {
    return {
      ...base,
      action: 'proceed',
      fromStep: 'await-index',
      safe: true,
      reason: `Core token ${observation.sealedTokenId} is sealed; awaiting collection indexing.`
    };
  }

  // 3. Expired reservation: restart cleanly (release-expired-reservation is
  // permissionless; the index returns to the free-list).
  if (observation.sessionExpired === true) {
    return {
      ...base,
      action: 'expired-restart',
      safe: true,
      reason: 'Reservation expired. Release it and restart this item from scratch.'
    };
  }

  // 4. No session at all: nothing landed — start from the top of the item plan.
  if (!observation.sessionExists) {
    return {
      ...base,
      action: 'proceed',
      fromStep: item.mode === 'single-tx' ? 'reserve' : 'begin',
      safe: true,
      reason: 'No on-chain session found. Start this item from the beginning.'
    };
  }

  // 5. Session exists, upload not begun on core yet.
  const upload = observation.uploadState;
  if (upload === undefined) {
    return {
      ...base,
      action: 'proceed',
      fromStep: item.mode === 'single-tx' ? 'seal' : 'begin',
      safe: true,
      reason:
        item.mode === 'single-tx'
          ? 'Reservation exists; complete with the single-tx mint.'
          : 'Reservation exists but core upload has not begun. Begin the inscription.'
    };
  }

  // 6. Shape check: the on-chain session must be for this exact file.
  if (upload.totalChunks !== item.chunkCount) {
    return {
      ...base,
      action: 'reconcile-mismatch',
      safe: false,
      reason:
        `On-chain upload expects ${upload.totalChunks} chunks but item ${item.index} has ` +
        `${item.chunkCount}. The session belongs to different content — abort this item and restart.`
    };
  }
  if (
    !Number.isInteger(upload.currentIndex) ||
    upload.currentIndex < 0 ||
    upload.currentIndex > upload.totalChunks
  ) {
    return {
      ...base,
      action: 'reconcile-mismatch',
      safe: false,
      reason: `On-chain current-index ${upload.currentIndex} is out of range for ${upload.totalChunks} chunks.`
    };
  }

  // 7. THE key check: on-chain running hash vs locally recomputed prefix hash.
  // A chained hash cannot be repaired — divergence means restart the session.
  const expectedPrefix = params.localRunningHashAt(upload.currentIndex);
  if (expectedPrefix.toLowerCase() !== upload.runningHashHex.toLowerCase()) {
    return {
      ...base,
      action: 'reconcile-mismatch',
      safe: false,
      reason:
        `On-chain running hash diverges from the local file at chunk ${upload.currentIndex} ` +
        `(classic stop/restart double-fold). Recompute confirmed the mismatch — abandon the ` +
        `upload and restart this item.`
    };
  }

  // 8. Fully uploaded and verified → seal.
  if (upload.currentIndex === upload.totalChunks) {
    return {
      ...base,
      action: 'proceed',
      fromStep: 'seal',
      safe: true,
      reason: 'All chunks uploaded and on-chain hash verified. Proceed to seal.'
    };
  }

  // 9. Verified prefix → continue uploading from current-index.
  const remaining = upload.totalChunks - upload.currentIndex;
  return {
    ...base,
    action: 'proceed',
    fromStep: 'upload',
    resumeFromChunk: upload.currentIndex,
    remainingBatches: Math.ceil(remaining / MAX_CHUNK_BATCH),
    safe: true,
    reason: `Verified ${upload.currentIndex}/${upload.totalChunks} chunks. Resume uploading from chunk ${upload.currentIndex}.`
  };
};

export type BatchAction = 'submit' | 'skip' | 'reconcile';

export interface BatchDecision {
  action: BatchAction;
  reason: string;
}

/**
 * Idempotency guard for (re)submitting one chunk batch. Call immediately
 * before every broadcast — including retries — after re-reading on-chain
 * current-index. Re-broadcasting a landed batch double-folds the hash chain.
 */
export const planChunkBatch = (params: {
  onChainCurrentIndex: number;
  batchStartIndex: number;
  batchLength: number;
}): BatchDecision => {
  const { onChainCurrentIndex: current, batchStartIndex, batchLength } = params;
  if (batchLength <= 0 || batchLength > MAX_CHUNK_BATCH) {
    return { action: 'reconcile', reason: `Batch length ${batchLength} out of bounds (1..${MAX_CHUNK_BATCH}).` };
  }
  if (batchStartIndex === current) {
    return { action: 'submit', reason: `Batch starts at current-index ${current}; safe to submit.` };
  }
  if (batchStartIndex + batchLength <= current) {
    return {
      action: 'skip',
      reason: `Batch [${batchStartIndex}, ${batchStartIndex + batchLength}) already landed (current-index ${current}).`
    };
  }
  if (batchStartIndex > current) {
    return {
      action: 'reconcile',
      reason: `Gap: batch starts at ${batchStartIndex} but current-index is ${current}.`
    };
  }
  return {
    action: 'reconcile',
    reason: `Partial overlap: batch [${batchStartIndex}, ${batchStartIndex + batchLength}) straddles current-index ${current}.`
  };
};

/** Decide resume for every item in a manifest (same order as items). */
export const decideResumeAll = (
  items: readonly ManifestItem[],
  observe: (item: ManifestItem) => ChainObservation,
  localRunningHashAt: (item: ManifestItem, k: number) => string
): ItemResumeDecision[] =>
  items.map((item) =>
    decideResume({
      item,
      observation: observe(item),
      localRunningHashAt: (k) => localRunningHashAt(item, k)
    })
  );
