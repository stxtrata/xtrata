import { describe, it, expect } from 'vitest';
import { buildPlan, flatFeeSchedule, type FeeSchedule } from '../src/planner.js';
import { syntheticManifest } from './fixtures.js';

const fees: FeeSchedule = flatFeeSchedule({
  beginFee: 1000n,
  perChunkFee: 10n,
  sealBaseFee: 2000n,
  mintPrice: 0n
});

const singleTxItems = (n: number) => Array.from({ length: n }, () => ({ chunks: 1 }));
const stagedItems = (n: number, chunks = 33) => Array.from({ length: n }, () => ({ chunks }));

/** Expected tx count for n staged items of c chunks (no relationships). */
const stagedTxCount = (n: number, c: number) =>
  n /* begins */ + n * Math.ceil(c / 32) /* chunk batches */ + Math.ceil(n / 50); /* seal batches */

describe('planner — collection size matrix (single-tx items)', () => {
  for (const n of [1, 30, 31, 32, 33, 50, 51, 100, 500, 1000]) {
    it(`${n} single-tx items → exactly ${n} txs`, () => {
      const plan = buildPlan(syntheticManifest(singleTxItems(n)), fees);
      expect(plan.totalTxs).toBe(n);
      expect(plan.steps.every((s) => s.kind === 'mint-single-tx')).toBe(true);
      expect(plan.items).toHaveLength(n);
      expect(plan.items.every((i) => i.txCount === 1)).toBe(true);
    });
  }
});

describe('planner — collection size matrix (staged 33-chunk items)', () => {
  for (const n of [1, 30, 31, 32, 33, 50, 51, 100, 500, 1000]) {
    it(`${n} staged items → ${stagedTxCount(n, 33)} txs with ${Math.ceil(n / 50)} seal batches`, () => {
      const plan = buildPlan(syntheticManifest(stagedItems(n)), fees);
      expect(plan.totalTxs).toBe(stagedTxCount(n, 33));
      const sealBatches = plan.steps.filter((s) => s.kind === 'seal-batch');
      expect(sealBatches).toHaveLength(Math.ceil(n / 50));
      // Coalescing bound: every batch ≤ 50 items, all full except possibly the last.
      sealBatches.forEach((batch, i) => {
        if (i < sealBatches.length - 1) expect(batch.itemIndexes).toHaveLength(50);
        else expect(batch.itemIndexes.length).toBeLessThanOrEqual(50);
      });
      // Every item sealed exactly once.
      const sealed = sealBatches.flatMap((b) => b.itemIndexes).sort((a, b) => a - b);
      expect(sealed).toEqual(Array.from({ length: n }, (_, i) => i));
    });
  }
});

describe('planner — 32/33 chunk boundary', () => {
  it('32 chunks is a single tx; 33 chunks becomes begin + 2 batches + seal', () => {
    const plan = buildPlan(syntheticManifest([{ chunks: 32 }, { chunks: 33 }]), fees);
    const kinds = plan.steps.map((s) => s.kind);
    expect(kinds).toEqual(['mint-single-tx', 'mint-begin', 'chunk-batch', 'chunk-batch', 'seal-batch']);
    const batches = plan.steps.filter((s) => s.kind === 'chunk-batch');
    expect(batches.map((b) => b.chunkRange)).toEqual([
      { start: 0, end: 32 },
      { start: 32, end: 33 }
    ]);
    expect(plan.items[0]!.txCount).toBe(1);
    expect(plan.items[1]!.txCount).toBe(4);
  });

  it('64 vs 65 chunks: 2 vs 3 chunk batches', () => {
    const plan = buildPlan(syntheticManifest([{ chunks: 64 }, { chunks: 65 }]), fees);
    expect(plan.items[0]!.chunkBatchCount).toBe(2);
    expect(plan.items[1]!.chunkBatchCount).toBe(3);
  });
});

describe('planner — 50/51 seal coalescing boundary', () => {
  it('50 staged items → 1 seal batch; 51 → 2 (50 + 1)', () => {
    const plan50 = buildPlan(syntheticManifest(stagedItems(50)), fees);
    const plan51 = buildPlan(syntheticManifest(stagedItems(51)), fees);
    expect(plan50.steps.filter((s) => s.kind === 'seal-batch')).toHaveLength(1);
    const batches51 = plan51.steps.filter((s) => s.kind === 'seal-batch');
    expect(batches51).toHaveLength(2);
    expect(batches51[0]!.itemIndexes).toHaveLength(50);
    expect(batches51[1]!.itemIndexes).toHaveLength(1);
  });
});

describe('planner — relationships force individual seals', () => {
  it('items with dependencies/parents get their own seal step, others coalesce', () => {
    const plan = buildPlan(
      syntheticManifest([
        { chunks: 33 },
        { chunks: 33, dependencies: [107] },
        { chunks: 33 },
        { chunks: 33, parents: [3] }
      ]),
      fees
    );
    const seals = plan.steps.filter((s) => s.kind === 'seal');
    const sealBatches = plan.steps.filter((s) => s.kind === 'seal-batch');
    expect(seals.map((s) => s.itemIndexes)).toEqual([[1], [3]]);
    expect(sealBatches).toHaveLength(1);
    expect(sealBatches[0]!.itemIndexes.sort((a, b) => a - b)).toEqual([0, 2]);
    expect(plan.items[1]!.sealedInBatch).toBe(false);
    expect(plan.items[0]!.sealedInBatch).toBe(true);
  });
});

describe('planner — mixed collections and cost totals', () => {
  it('mixed single-tx + staged: exact tx count and fee sum', () => {
    // 3 single-tx (1, 32, 5 chunks) + 2 staged (33, 100 chunks)
    const plan = buildPlan(
      syntheticManifest([{ chunks: 1 }, { chunks: 33 }, { chunks: 32 }, { chunks: 100 }, { chunks: 5 }]),
      fees
    );
    // 3 single + 2 begins + (2 + 4) chunk batches + 1 seal batch
    expect(plan.totalTxs).toBe(3 + 2 + 2 + 4 + 1);
    const stepSum = plan.steps.reduce((sum, s) => sum + s.estimatedFeeMicroStx, 0n);
    expect(plan.totalEstimatedFeeMicroStx).toBe(stepSum);
    const itemSum = plan.items.reduce((sum, i) => sum + i.estimatedFeeMicroStx, 0n);
    expect(itemSum).toBe(stepSum);
  });

  it('fee math: flat schedule produces the exact expected totals', () => {
    // One staged 33-chunk item: begin 1000 + 32*10 + 1*10 + seal 2000 = 3330
    const plan = buildPlan(syntheticManifest([{ chunks: 33 }]), fees);
    expect(plan.totalEstimatedFeeMicroStx).toBe(1000n + 320n + 10n + 2000n);
    // One single-tx 32-chunk item: 1000 + 320 + 2000 = 3320
    const single = buildPlan(syntheticManifest([{ chunks: 32 }]), fees);
    expect(single.totalEstimatedFeeMicroStx).toBe(3320n);
  });

  it('mint price is added per item and totalled', () => {
    const priced = flatFeeSchedule({ beginFee: 0n, perChunkFee: 0n, sealBaseFee: 0n, mintPrice: 500n });
    const plan = buildPlan(syntheticManifest([{ chunks: 1 }, { chunks: 33 }]), priced);
    expect(plan.totalMintPriceMicroStx).toBe(1000n);
    expect(plan.totalEstimatedFeeMicroStx).toBe(1000n);
  });

  it('plan is deterministic: same manifest → identical plan', () => {
    const manifest = syntheticManifest(stagedItems(7, 40));
    expect(buildPlan(manifest, fees)).toEqual(buildPlan(manifest, fees));
  });

  it('empty manifest → empty plan', () => {
    const plan = buildPlan(syntheticManifest([]), fees);
    expect(plan.totalTxs).toBe(0);
    expect(plan.steps).toEqual([]);
    expect(plan.totalEstimatedFeeMicroStx).toBe(0n);
  });
});
