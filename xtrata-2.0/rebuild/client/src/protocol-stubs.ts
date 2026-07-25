/**
 * INTERFACE STUBS ONLY — no implementation, no @stacks/* imports.
 *
 * These are the contract-client surfaces the next stage (`protocol/`,
 * `collection/`, `drops/` with @stacks/transactions v7) will implement. The
 * engine and reconcile logic in this package depend only on these shapes.
 */

import type { ChainObservation } from './reconcile.js';

export type TxId = string;

export interface BroadcastResult {
  txid: TxId;
}

export interface TxStatus {
  txid: TxId;
  status: 'pending' | 'success' | 'abort_by_response' | 'abort_by_post_condition' | 'dropped';
  /** Contract error code (uNNN) when aborted by response. */
  chainErrorCode?: number;
  blockHeight?: number;
}

/** Read-side observations reconcile needs, per item content hash. */
export interface ChainObserver {
  /** One consolidated observation for {owner, contentHashHex}. */
  observeItem(owner: string, contentHashHex: string): Promise<ChainObservation>;
  getTxStatus(txid: TxId): Promise<TxStatus>;
  getBlockHeight(): Promise<number>;
}

/** Typed client for one deployed xtrata-collection-v3 instance. */
export interface CollectionClient {
  readonly contractId: string;

  // Reads
  getSession(owner: string, contentHashHex: string): Promise<{
    index: number;
    phaseId: number;
    price: bigint;
    createdAt: number;
    itemUri?: string;
  } | null>;
  getItem(index: number): Promise<{
    tokenId: number;
    ownerAtMint: string;
    phaseId: number;
    mintedAt: number;
    contentHashHex: string;
  } | null>;
  getHashIndex(contentHashHex: string): Promise<number | null>;
  getCounts(): Promise<{ minted: number; reserved: number; nextIndex: number; freeCount: number }>;
  getUnassignedScan(start: number, count: number): Promise<number[]>;

  // Tx builders + broadcast (wallet- or key-signed downstream)
  reserve(params: { contentHashHex: string; itemUri?: string }): Promise<BroadcastResult>;
  mintBegin(params: {
    contentHashHex: string;
    totalChunks: number;
    totalSize: number;
    mimeType: string;
    itemUri?: string;
  }): Promise<BroadcastResult>;
  mintAddChunkBatch(params: { contentHashHex: string; chunks: Uint8Array[] }): Promise<BroadcastResult>;
  mintSeal(params: {
    contentHashHex: string;
    dependencies?: number[];
    parents?: number[];
  }): Promise<BroadcastResult>;
  mintSealBatch(params: { contentHashHexes: string[] }): Promise<BroadcastResult>;
  mintSmallSingleTx(params: {
    contentHashHex: string;
    chunks: Uint8Array[];
    mimeType: string;
    itemUri?: string;
    dependencies?: number[];
    parents?: number[];
  }): Promise<BroadcastResult>;
  cancelReservation(contentHashHex: string): Promise<BroadcastResult>;
  releaseExpiredReservation(owner: string, contentHashHex: string): Promise<BroadcastResult>;
}

/**
 * Drops: the interface stub that used to live here is REPLACED by the real
 * implementation in src/drops/ —
 *   - DropsTxBuilder (src/drops/client.ts): pure TxDescriptor builders for
 *     every public entrypoint, deny-mode post-conditions;
 *   - DropsReads (src/drops/reads.ts): typed read-onlys, resolveInventory,
 *     getDropSummary;
 *   - src/drops/attestation.ts: signed-eligibility attestation helpers;
 *   - src/drops/inventory-select.ts: Drop Builder selection/planning helpers.
 * Error codes u200–u231 are mapped in protocol/codecs.ts (DROPS_ERROR_CODES).
 * (Exported from the package root via src/index.ts.)
 */
