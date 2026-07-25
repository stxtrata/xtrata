import { MAX_CHUNK_BATCH, MAX_SEAL_BATCH } from './hash.js';
import type { Manifest, ManifestItem } from './manifest.js';
import { XtrataClientError } from './errors.js';

/**
 * Turn a manifest into an ordered, bounded transaction plan.
 *
 * Per item:
 *  - single-tx mode  → one `mint-single-tx` step (reserve+upload+seal in one tx)
 *  - staged mode     → `mint-begin` + ceil(chunks/32) `chunk-batch` steps, then a seal
 *
 * Seal coalescing: staged items with no per-item relationships (dependencies /
 * parents) are grouped up to 50 per `seal-batch` tx, in index order. Items with
 * relationships seal individually (`seal-recursive`) because
 * seal-with-relationships is per-session.
 */

export type PlanStepKind =
  | 'mint-single-tx'
  | 'mint-begin'
  | 'chunk-batch'
  | 'seal'
  | 'seal-batch';

export interface PlanStep {
  kind: PlanStepKind;
  /** Manifest item indexes this tx covers (1 for all kinds except seal-batch). */
  itemIndexes: number[];
  /** For chunk-batch: [start, end) chunk indexes within the item. */
  chunkRange?: { start: number; end: number };
  estimatedFeeMicroStx: bigint;
}

/**
 * Fee schedule, all in microSTX. Functions so callers can model the core's
 * granular fee units (quote-inscription-fee) without this package depending on
 * chain reads.
 */
export interface FeeSchedule {
  beginFee: bigint;
  chunkBatchFee: (chunkCount: number) => bigint;
  sealFee: (chunkCount: number) => bigint;
  singleTxFee: (chunkCount: number) => bigint;
  /** Collection mint price paid at seal (0 for creator-phase). */
  mintPrice: bigint;
}

export interface ItemPlanSummary {
  index: number;
  mode: ManifestItem['mode'];
  txCount: number;
  chunkBatchCount: number;
  sealedInBatch: boolean;
  estimatedFeeMicroStx: bigint;
}

export interface TransactionPlan {
  steps: PlanStep[];
  items: ItemPlanSummary[];
  totalTxs: number;
  totalEstimatedFeeMicroStx: bigint;
  totalMintPriceMicroStx: bigint;
}

export const buildPlan = (manifest: Manifest, fees: FeeSchedule): TransactionPlan => {
  const steps: PlanStep[] = [];
  const items: ItemPlanSummary[] = [];
  const sealQueue: ManifestItem[] = [];
  let totalMintPrice = 0n;

  const flushSealQueue = (): void => {
    while (sealQueue.length > 0) {
      const group = sealQueue.splice(0, MAX_SEAL_BATCH);
      const fee = group.reduce((sum, item) => sum + fees.sealFee(item.chunkCount) + fees.mintPrice, 0n);
      steps.push({
        kind: 'seal-batch',
        itemIndexes: group.map((item) => item.index),
        estimatedFeeMicroStx: fee
      });
      for (const item of group) {
        const summary = items[item.index];
        if (!summary) throw new XtrataClientError('plan-invalid', `no summary for item ${item.index}`);
        summary.sealedInBatch = true;
        summary.estimatedFeeMicroStx += fees.sealFee(item.chunkCount) + fees.mintPrice;
      }
    }
  };

  for (const item of manifest.items) {
    totalMintPrice += fees.mintPrice;

    if (item.mode === 'single-tx') {
      const fee = fees.singleTxFee(item.chunkCount) + fees.mintPrice;
      steps.push({ kind: 'mint-single-tx', itemIndexes: [item.index], estimatedFeeMicroStx: fee });
      items[item.index] = {
        index: item.index,
        mode: item.mode,
        txCount: 1,
        chunkBatchCount: 0,
        sealedInBatch: false,
        estimatedFeeMicroStx: fee
      };
      continue;
    }

    // Staged item.
    const batchCount = Math.ceil(item.chunkCount / MAX_CHUNK_BATCH);
    let itemFee = fees.beginFee;
    steps.push({ kind: 'mint-begin', itemIndexes: [item.index], estimatedFeeMicroStx: fees.beginFee });
    for (let b = 0; b < batchCount; b += 1) {
      const start = b * MAX_CHUNK_BATCH;
      const end = Math.min(start + MAX_CHUNK_BATCH, item.chunkCount);
      const fee = fees.chunkBatchFee(end - start);
      itemFee += fee;
      steps.push({
        kind: 'chunk-batch',
        itemIndexes: [item.index],
        chunkRange: { start, end },
        estimatedFeeMicroStx: fee
      });
    }

    const hasRelationships =
      (item.dependencies?.length ?? 0) > 0 || (item.parents?.length ?? 0) > 0;

    items[item.index] = {
      index: item.index,
      mode: item.mode,
      txCount: 1 + batchCount + 1, // begin + batches + its seal tx (shared or not)
      chunkBatchCount: batchCount,
      sealedInBatch: !hasRelationships,
      estimatedFeeMicroStx: itemFee
    };

    if (hasRelationships) {
      const sealFee = fees.sealFee(item.chunkCount) + fees.mintPrice;
      steps.push({ kind: 'seal', itemIndexes: [item.index], estimatedFeeMicroStx: sealFee });
      items[item.index]!.estimatedFeeMicroStx += sealFee;
      items[item.index]!.sealedInBatch = false;
    } else {
      sealQueue.push(item);
    }
  }

  flushSealQueue();

  const totalEstimatedFeeMicroStx = steps.reduce((sum, step) => sum + step.estimatedFeeMicroStx, 0n);

  return {
    steps,
    items: manifest.items.map((item) => {
      const summary = items[item.index];
      if (!summary) throw new XtrataClientError('plan-invalid', `no summary for item ${item.index}`);
      return summary;
    }),
    totalTxs: steps.length,
    totalEstimatedFeeMicroStx,
    totalMintPriceMicroStx: totalMintPrice
  };
};

/** Convenience: flat fee schedule (every op costs its base fee). */
export const flatFeeSchedule = (params: {
  beginFee: bigint;
  perChunkFee: bigint;
  sealBaseFee: bigint;
  mintPrice?: bigint;
}): FeeSchedule => ({
  beginFee: params.beginFee,
  chunkBatchFee: (n) => params.perChunkFee * BigInt(n),
  sealFee: () => params.sealBaseFee,
  singleTxFee: (n) => params.beginFee + params.perChunkFee * BigInt(n) + params.sealBaseFee,
  mintPrice: params.mintPrice ?? 0n
});
