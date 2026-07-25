/**
 * Per-item lifecycle state machine.
 *
 * prepared → reserved → begun → partially-uploaded(k) → staged →
 * seal-submitted → confirmed → indexed → (failed | expired),
 * plus post-mint drop states: indexed → assigned → claimed.
 *
 * single-tx items skip the upload phases: prepared → reserved →
 * seal-submitted (the single tx) → confirmed → indexed. `reserved` is optional
 * for mint-begin flows that reserve-and-begin in one tx (prepared → begun).
 */

export type ItemState =
  | 'prepared'
  | 'reserved'
  | 'begun'
  | 'partially-uploaded'
  | 'staged'
  | 'seal-submitted'
  | 'confirmed'
  | 'indexed'
  | 'assigned'
  | 'claimed'
  | 'failed'
  | 'expired';

export const ITEM_STATES: readonly ItemState[] = [
  'prepared',
  'reserved',
  'begun',
  'partially-uploaded',
  'staged',
  'seal-submitted',
  'confirmed',
  'indexed',
  'assigned',
  'claimed',
  'failed',
  'expired'
];

/** Terminal-failure states an in-flight item may drop into. */
const FAILABLE: readonly ItemState[] = [
  'prepared',
  'reserved',
  'begun',
  'partially-uploaded',
  'staged',
  'seal-submitted'
];

/** States holding an on-chain reservation that can expire. */
const EXPIRABLE: readonly ItemState[] = ['reserved', 'begun', 'partially-uploaded', 'staged'];

/** Legal transition table. `partially-uploaded` self-loops as k advances. */
export const LEGAL_TRANSITIONS: Readonly<Record<ItemState, readonly ItemState[]>> = {
  prepared: ['reserved', 'begun', 'seal-submitted', 'failed'],
  reserved: ['begun', 'seal-submitted', 'failed', 'expired'],
  begun: ['partially-uploaded', 'staged', 'failed', 'expired'],
  'partially-uploaded': ['partially-uploaded', 'staged', 'failed', 'expired'],
  staged: ['seal-submitted', 'failed', 'expired'],
  'seal-submitted': ['confirmed', 'failed'],
  confirmed: ['indexed'],
  indexed: ['assigned'],
  assigned: ['claimed'],
  claimed: [],
  failed: [],
  expired: ['prepared'] // an expired item may restart from scratch
};

export interface ItemProgress {
  index: number;
  state: ItemState;
  /** Chunks confirmed on-chain (meaningful in partially-uploaded / staged). */
  uploadedChunks: number;
  totalChunks: number;
  tokenId?: number;
  txids: string[];
  feePaidMicroStx: bigint;
  error?: string;
  updatedAt: string;
}

export const canTransition = (from: ItemState, to: ItemState): boolean =>
  LEGAL_TRANSITIONS[from].includes(to);

export interface TransitionOptions {
  uploadedChunks?: number;
  tokenId?: number;
  txid?: string;
  feePaidMicroStx?: bigint;
  error?: string;
  now?: () => Date;
}

/** Guarded transition; throws on an illegal edge. Returns a new snapshot. */
export const transition = (item: ItemProgress, to: ItemState, options: TransitionOptions = {}): ItemProgress => {
  if (!canTransition(item.state, to)) {
    throw new Error(`illegal transition for item ${item.index}: ${item.state} → ${to}`);
  }
  if (to === 'partially-uploaded') {
    const k = options.uploadedChunks;
    if (k === undefined || !Number.isInteger(k) || k <= 0 || k >= item.totalChunks) {
      throw new Error(
        `partially-uploaded requires uploadedChunks in (0, ${item.totalChunks}), received ${String(k)}`
      );
    }
    if (item.state === 'partially-uploaded' && k < item.uploadedChunks) {
      throw new Error(`uploadedChunks may not regress: ${item.uploadedChunks} → ${k}`);
    }
  }
  if (to === 'expired' && !EXPIRABLE.includes(item.state)) {
    throw new Error(`state ${item.state} cannot expire`);
  }
  if (to === 'failed' && !FAILABLE.includes(item.state)) {
    throw new Error(`state ${item.state} cannot fail`);
  }
  const next: ItemProgress = {
    ...item,
    state: to,
    updatedAt: (options.now ?? (() => new Date()))().toISOString(),
    txids: options.txid !== undefined ? [...item.txids, options.txid] : item.txids,
    feePaidMicroStx: item.feePaidMicroStx + (options.feePaidMicroStx ?? 0n),
    uploadedChunks:
      to === 'staged'
        ? item.totalChunks
        : options.uploadedChunks !== undefined
          ? options.uploadedChunks
          : to === 'prepared'
            ? 0
            : item.uploadedChunks
  };
  if (options.tokenId !== undefined) next.tokenId = options.tokenId;
  if (options.error !== undefined) next.error = options.error;
  if (to === 'prepared') delete next.error;
  return next;
};

export const initialProgress = (index: number, totalChunks: number, now: () => Date = () => new Date()): ItemProgress => ({
  index,
  state: 'prepared',
  uploadedChunks: 0,
  totalChunks,
  txids: [],
  feePaidMicroStx: 0n,
  updatedAt: now().toISOString()
});

export interface ProgressRollup {
  total: number;
  byState: Partial<Record<ItemState, number>>;
  done: number; // indexed | assigned | claimed
  inFlight: number;
  failed: number;
  expired: number;
  totalFeePaidMicroStx: bigint;
  uploadedChunks: number;
  totalChunks: number;
}

export const rollup = (items: readonly ItemProgress[]): ProgressRollup => {
  const byState: Partial<Record<ItemState, number>> = {};
  let done = 0;
  let failed = 0;
  let expired = 0;
  let fee = 0n;
  let uploaded = 0;
  let totalChunks = 0;
  for (const item of items) {
    byState[item.state] = (byState[item.state] ?? 0) + 1;
    if (item.state === 'indexed' || item.state === 'assigned' || item.state === 'claimed') done += 1;
    if (item.state === 'failed') failed += 1;
    if (item.state === 'expired') expired += 1;
    fee += item.feePaidMicroStx;
    uploaded += item.uploadedChunks;
    totalChunks += item.totalChunks;
  }
  return {
    total: items.length,
    byState,
    done,
    inFlight: items.length - done - failed - expired,
    failed,
    expired,
    totalFeePaidMicroStx: fee,
    uploadedChunks: uploaded,
    totalChunks
  };
};
