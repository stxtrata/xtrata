import { describe, expect, it } from 'vitest';
import { CollectionExecutor } from '../src/engine/executor.js';
import { CollectionTxBuilder } from '../src/collection/client.js';
import { buildPlan, flatFeeSchedule, type TransactionPlan } from '../src/planner.js';
import { exportManifest, importManifest, type Manifest } from '../src/manifest.js';
import { MAX_CHUNK_BATCH, MAX_SEAL_BATCH } from '../src/hash.js';
import { XtrataClientError } from '../src/errors.js';
import { FakeChain, makeFixture, manifestOfFixtures, type Fixture } from './util/fake-chain.js';

/**
 * Planner + executor integration at the 500 / 1000 collection sizes
 * (08-TEST-PLAN.md §"Collection-size matrix": "500 and 1000 run at planner +
 * reconciliation level (batch counts, cost totals, resume correctness)").
 *
 * Covered here:
 *   - exact transaction counts and cost totals for each shape at both sizes;
 *   - resume correctness after an interruption at a RANDOM step of the plan
 *     (seeded, several different steps), asserting the resumed run never
 *     re-mints anything;
 *   - manifest export → import → resume on a "new device" (a brand-new
 *     executor with zero local progress state), asserting ZERO duplicate mint
 *     actions — the chain reconciliation is the only thing carrying state.
 */

const SENDER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const COLLECTION = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-v3';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const CONTRACTS = { core: CORE, collection: COLLECTION };

const BEGIN_FEE = 1000n;
const PER_CHUNK_FEE = 10n;
const SEAL_BASE_FEE = 2000n;
const MINT_PRICE = 500n;

const fees = flatFeeSchedule({
  beginFee: BEGIN_FEE,
  perChunkFee: PER_CHUNK_FEE,
  sealBaseFee: SEAL_BASE_FEE,
  mintPrice: MINT_PRICE
});

const builder = new CollectionTxBuilder({
  collectionContractId: COLLECTION,
  coreContractId: CORE,
  network: 'mainnet',
  sender: SENDER,
  fees
});

/** Deterministic 32-bit LCG so "random step" choices are reproducible. */
const rng = (seed: number) => {
  let state = seed >>> 0 || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
};

const makeExecutor = (chain: FakeChain, fixtures: Fixture[]) => {
  const byIndex = new Map(fixtures.map((f) => [f.item.index, f.chunks]));
  return new CollectionExecutor(
    {
      observer: chain,
      submit: chain.submit,
      waitConfirm: chain.waitConfirm,
      chunksFor: async (item) => byIndex.get(item.index)!
    },
    { owner: SENDER, builder, concurrency: 1, now: () => new Date('2026-07-24T00:00:00Z') }
  );
};

/**
 * Collection shapes at scale. `chunksFor(i)` mixes single-tx and staged items
 * around the 32/33-chunk boundary so both plan branches are represented.
 */
const buildCollection = (n: number, chunksFor: (i: number) => number): {
  fixtures: Fixture[];
  manifest: Manifest;
  plan: TransactionPlan;
} => {
  const fixtures = Array.from({ length: n }, (_, i) => makeFixture(i, chunksFor(i), i + 1));
  const manifest = manifestOfFixtures(fixtures, CONTRACTS);
  return { fixtures, manifest, plan: buildPlan(manifest, fees) };
};

/** Per-item fee is identical for both modes: begin + chunks + seal + price. */
const expectedFee = (chunkCounts: number[]): bigint =>
  chunkCounts.reduce(
    (sum, c) => sum + BEGIN_FEE + PER_CHUNK_FEE * BigInt(c) + SEAL_BASE_FEE + MINT_PRICE,
    0n
  );

const expectedTxCount = (chunkCounts: number[]): number => {
  let single = 0;
  let staged = 0;
  let batches = 0;
  for (const c of chunkCounts) {
    if (c <= MAX_SINGLE) single += 1;
    else {
      staged += 1;
      batches += Math.ceil(c / MAX_CHUNK_BATCH);
    }
  }
  return single + staged + batches + Math.ceil(staged / MAX_SEAL_BATCH);
};
const MAX_SINGLE = 32;

// --- plan level -------------------------------------------------------------

describe('planner at 500 / 1000 items: exact tx counts and cost totals', () => {
  for (const n of [500, 1000]) {
    it(`${n} single-tx items → ${n} txs, exact fee total`, () => {
      const counts = Array.from({ length: n }, () => 1);
      const { plan } = buildCollection(n, () => 1);
      expect(plan.totalTxs).toBe(n);
      expect(plan.steps.every((s) => s.kind === 'mint-single-tx')).toBe(true);
      expect(plan.totalEstimatedFeeMicroStx).toBe(expectedFee(counts));
      expect(plan.totalMintPriceMicroStx).toBe(MINT_PRICE * BigInt(n));
      // Per-item summaries must add up to the plan total, with no item lost.
      expect(plan.items.reduce((sum, i) => sum + i.estimatedFeeMicroStx, 0n))
        .toBe(plan.totalEstimatedFeeMicroStx);
      expect(plan.items).toHaveLength(n);
    });

    it(`${n} staged 33-chunk items → ${n} begins + ${2 * n} chunk batches + ${Math.ceil(n / 50)} seal batches`, () => {
      const counts = Array.from({ length: n }, () => 33);
      const { plan } = buildCollection(n, () => 33);
      expect(plan.totalTxs).toBe(expectedTxCount(counts));
      expect(plan.steps.filter((s) => s.kind === 'mint-begin')).toHaveLength(n);
      expect(plan.steps.filter((s) => s.kind === 'chunk-batch')).toHaveLength(2 * n);
      const sealBatches = plan.steps.filter((s) => s.kind === 'seal-batch');
      expect(sealBatches).toHaveLength(Math.ceil(n / MAX_SEAL_BATCH));
      // Every item sealed exactly once, batches bounded at 50.
      const sealed = sealBatches.flatMap((b) => b.itemIndexes).sort((a, b) => a - b);
      expect(sealed).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(Math.max(...sealBatches.map((b) => b.itemIndexes.length))).toBeLessThanOrEqual(MAX_SEAL_BATCH);
      expect(plan.totalEstimatedFeeMicroStx).toBe(expectedFee(counts));
    });

    it(`${n} mixed items (single-tx + staged across the 32/33 boundary) → exact totals`, () => {
      const shape = (i: number) => [1, 32, 33, 64, 65][i % 5]!;
      const counts = Array.from({ length: n }, (_, i) => shape(i));
      const { plan } = buildCollection(n, shape);
      expect(plan.totalTxs).toBe(expectedTxCount(counts));
      expect(plan.totalEstimatedFeeMicroStx).toBe(expectedFee(counts));
      expect(plan.totalMintPriceMicroStx).toBe(MINT_PRICE * BigInt(n));
      // Deterministic: the same manifest always yields the identical plan.
      const { manifest } = buildCollection(n, shape);
      expect(buildPlan(manifest, fees)).toEqual(plan);
    });
  }
});

// --- execution + resume -----------------------------------------------------

describe('executor at 500 / 1000 items: full run mints every item exactly once', () => {
  it('500 mixed items execute to `indexed` with one mint per item', async () => {
    const shape = (i: number) => [1, 33, 5, 40, 2][i % 5]!;
    const { fixtures, manifest, plan } = buildCollection(500, shape);
    const chain = new FakeChain();
    const result = await makeExecutor(chain, fixtures).run(manifest, plan);

    expect(result.paused).toBe(false);
    expect(result.report.totals.succeeded).toBe(500);
    expect(result.report.totals.failed).toBe(0);
    expect(result.progress.every((p) => p.state === 'indexed')).toBe(true);
    expect(chain.nextTokenId).toBe(500);
    expect([...chain.mintsByHash.values()].every((c) => c === 1)).toBe(true);
    // Staged items (33 and 40 chunks) coalesce into ceil(200/50) = 4 seal batches.
    expect(chain.submitted.filter((s) => s.functionName === 'mint-seal-batch')).toHaveLength(4);
    expect(chain.submitted.filter((s) => s.functionName === 'mint-begin')).toHaveLength(200);
  });

  it('1000 single-tx items execute to `indexed` with one mint per item', async () => {
    const { fixtures, manifest, plan } = buildCollection(1000, () => 1);
    const chain = new FakeChain();
    const result = await makeExecutor(chain, fixtures).run(manifest, plan);

    expect(result.paused).toBe(false);
    expect(result.report.totals.succeeded).toBe(1000);
    expect(chain.nextTokenId).toBe(1000);
    expect(chain.mintsByHash.size).toBe(1000);
    expect([...chain.mintsByHash.values()].every((c) => c === 1)).toBe(true);
    expect(chain.submitted).toHaveLength(1000); // exactly the planned tx count
  });
});

describe('resume correctness after an interruption at a random step', () => {
  /**
   * Wallet rejection at a randomly chosen submit index pauses the run; a
   * second run must reconcile against the chain and finish WITHOUT re-minting
   * anything. Several seeded step choices cover interruptions in the middle of
   * an upload, between items, and during the seal phase.
   */
  const shape = (i: number) => [1, 33, 40, 2][i % 4]!;

  // `same`  — resume with the same executor (local progress + chain reconcile).
  // `fresh` — resume with a brand-new executor (chain reconcile ONLY), which is
  //           the harder case and the one a crashed tab actually hits.
  const cases: Array<[number, number[], 'same' | 'fresh']> = [
    [500, [11, 97, 3407, 5], 'same'],
    [500, [11, 3407], 'fresh'],
    [1000, [42], 'fresh']
  ];
  for (const [size, seeds, resumeWith] of cases) {
    for (const seed of seeds) {
      it(`${size} items, interrupted at a step chosen with seed ${seed}, resumed with a ${resumeWith} executor`, async () => {
        const { fixtures, manifest, plan } = buildCollection(size, size === 1000 ? () => 1 : shape);

        // Total submits of an uninterrupted run, so the random step is in range.
        const probe = new FakeChain();
        await makeExecutor(probe, fixtures).run(manifest, plan);
        const totalSubmits = probe.submitCount;
        expect(totalSubmits).toBeGreaterThan(0);

        const step = 1 + Math.floor(rng(seed)() * (totalSubmits - 1));
        const chain = new FakeChain({
          failAtSubmit: { at: step, error: new XtrataClientError('wallet-rejected', 'user cancelled') }
        });
        const executor = makeExecutor(chain, fixtures);

        const first = await executor.run(manifest, plan);
        expect(first.paused, `step ${step} of ${totalSubmits} should pause the run`).toBe(true);
        expect(first.pauseReason).toContain('user cancelled');
        // A pause is not a failure: nothing is marked failed.
        expect(first.progress.some((p) => p.state === 'failed')).toBe(false);
        const mintedAtPause = chain.nextTokenId;
        expect(mintedAtPause).toBeLessThan(size);

        // Reconcile-before-resume must not re-submit anything that landed.
        chain.options = {};
        const resumer = resumeWith === 'same' ? executor : makeExecutor(chain, fixtures);
        const second = await resumer.run(manifest, plan);
        expect(second.paused).toBe(false);
        expect(second.progress.every((p) => p.state === 'indexed')).toBe(true);
        expect(chain.nextTokenId).toBe(size);
        expect([...chain.mintsByHash.values()].every((c) => c === 1)).toBe(true);
        // The interrupted tx is retried once; nothing else is duplicated.
        expect(chain.submitted.length).toBeLessThanOrEqual(totalSubmits);
      });
    }
  }
});

describe('manifest export → import → resume on a new device', () => {
  it('500 items: a fresh executor with no local state finishes the run with zero duplicate mints', async () => {
    const shape = (i: number) => [1, 33, 3, 40][i % 4]!;
    const { fixtures, manifest, plan } = buildCollection(500, shape);

    // --- device A: starts the run, then the wallet is rejected mid-plan ---
    const totalProbe = new FakeChain();
    await makeExecutor(totalProbe, fixtures).run(manifest, plan);
    const step = 1 + Math.floor(rng(20260724)() * (totalProbe.submitCount - 1));

    const chain = new FakeChain({
      failAtSubmit: { at: step, error: new XtrataClientError('wallet-rejected', 'user cancelled') }
    });
    const deviceA = await makeExecutor(chain, fixtures).run(manifest, plan);
    expect(deviceA.paused).toBe(true);
    const mintedOnA = chain.nextTokenId;
    expect(mintedOnA).toBeGreaterThan(0);
    expect(mintedOnA).toBeLessThan(500);
    // Exactly what device A got onto the chain before it stopped.
    const indexedAtPause = new Set(
      [...chain.state.entries()].filter(([, v]) => v.indexedAt !== undefined).map(([k]) => k)
    );
    expect(indexedAtPause.size).toBe(mintedOnA);

    // --- the only thing that crosses to device B is the manifest file ---
    const exported = exportManifest(manifest);
    const imported = importManifest(exported);
    expect(imported.checksum).toBe(manifest.checksum);
    expect(imported.items).toHaveLength(500);
    // A tampered manifest never gets this far.
    expect(() => importManifest(exported.replace('"item-3.bin"', '"item-3-tampered.bin"')))
      .toThrowError(/checksum/i);

    // --- device B: brand-new plan + brand-new executor, no progress state ---
    chain.options = {};
    const submittedBefore = chain.submitted.length;
    const planB = buildPlan(imported, fees);
    expect(planB).toEqual(plan); // the manifest alone reproduces the plan

    const deviceB = await makeExecutor(chain, fixtures).run(imported, planB);
    expect(deviceB.paused).toBe(false);
    expect(deviceB.progress.every((p) => p.state === 'indexed')).toBe(true);

    // ZERO duplicate mint actions: every content hash minted exactly once,
    // and device B issued no mint tx for anything device A already landed.
    expect(chain.nextTokenId).toBe(500);
    expect(chain.mintsByHash.size).toBe(500);
    expect([...chain.mintsByHash.values()].every((count) => count === 1)).toBe(true);
    // Device B issued NO transaction at all for any item device A had already
    // indexed — the chain reconciliation, not a local snapshot, decided that.
    const deviceBSubmits = chain.submitted.slice(submittedBefore);
    expect(deviceBSubmits.filter((s) => s.hash !== undefined && indexedAtPause.has(s.hash)))
      .toEqual([]);
    expect(deviceBSubmits.length).toBeGreaterThan(0); // it really did finish the job
  });

  it('a resume that finds everything already indexed is a pure no-op', async () => {
    const { fixtures, manifest, plan } = buildCollection(120, (i) => (i % 3 === 0 ? 33 : 1));
    const chain = new FakeChain();
    await makeExecutor(chain, fixtures).run(manifest, plan);
    expect(chain.nextTokenId).toBe(120);
    const submittedAfterFirstRun = chain.submitted.length;

    // "New device": re-import the manifest, fresh executor, same chain.
    const imported = importManifest(exportManifest(manifest));
    const result = await makeExecutor(chain, fixtures).run(imported, buildPlan(imported, fees));

    expect(result.paused).toBe(false);
    expect(result.progress.every((p) => p.state === 'indexed')).toBe(true);
    expect(chain.submitted).toHaveLength(submittedAfterFirstRun); // not one extra tx
    expect(chain.nextTokenId).toBe(120);
    expect([...chain.mintsByHash.values()].every((c) => c === 1)).toBe(true);
    // Token ids survive the round trip into the report.
    expect(result.report.items.every((i) => i.tokenId !== undefined)).toBe(true);
  });
});
