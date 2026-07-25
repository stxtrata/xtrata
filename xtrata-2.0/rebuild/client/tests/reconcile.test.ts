import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { bytesToHex, chunkBytes, runningHashAfter, CHUNK_SIZE } from '../src/hash.js';
import {
  decideResume,
  decideResumeAll,
  planChunkBatch,
  type ChainObservation
} from '../src/reconcile.js';
import { ingestFiles } from '../src/ingest.js';
import { baseOptions, bytesOf } from './fixtures.js';

// A real staged item (33 chunks) with true hashes.
const stagedBytes = bytesOf(11, 33 * CHUNK_SIZE);
const stagedChunks = chunkBytes(stagedBytes);
const singleBytes = bytesOf(12, CHUNK_SIZE * 2);
const { manifest } = ingestFiles(
  [
    { name: 'staged.bin', bytes: stagedBytes, mimeType: 'application/octet-stream' },
    { name: 'single.bin', bytes: singleBytes, mimeType: 'application/octet-stream' }
  ],
  baseOptions
);
const stagedItem = manifest.items[0]!;
const singleItem = manifest.items[1]!;
const hashAt = (k: number) => bytesToHex(runningHashAfter(stagedChunks, k));
const singleHashAt = (k: number) => bytesToHex(runningHashAfter(chunkBytes(singleBytes), k));

const decide = (observation: ChainObservation, item = stagedItem, localRunningHashAt = hashAt) =>
  decideResume({ item, observation, localRunningHashAt });

describe('decideResume — interruption decision table', () => {
  it('nothing on chain → proceed from begin (staged) / reserve (single-tx)', () => {
    expect(decide({ sessionExists: false })).toMatchObject({
      action: 'proceed',
      fromStep: 'begin',
      safe: true
    });
    expect(decide({ sessionExists: false }, singleItem, singleHashAt)).toMatchObject({
      action: 'proceed',
      fromStep: 'reserve'
    });
  });

  it('reserved but not begun → proceed from begin / seal(single-tx)', () => {
    expect(decide({ sessionExists: true, sessionIndex: 3 })).toMatchObject({
      action: 'proceed',
      fromStep: 'begin'
    });
    expect(decide({ sessionExists: true }, singleItem, singleHashAt)).toMatchObject({
      action: 'proceed',
      fromStep: 'seal'
    });
  });

  it('k of n batches uploaded with matching prefix → resume upload from k', () => {
    const decision = decide({
      sessionExists: true,
      uploadState: { currentIndex: 32, totalChunks: 33, runningHashHex: hashAt(32) }
    });
    expect(decision).toMatchObject({
      action: 'proceed',
      fromStep: 'upload',
      resumeFromChunk: 32,
      remainingBatches: 1,
      safe: true
    });
  });

  it('mid-batch interruption at arbitrary k → correct remaining batch count', () => {
    const decision = decide({
      sessionExists: true,
      uploadState: { currentIndex: 5, totalChunks: 33, runningHashHex: hashAt(5) }
    });
    expect(decision.resumeFromChunk).toBe(5);
    expect(decision.remainingBatches).toBe(1); // 28 remaining ≤ 32
  });

  it('staged (all chunks uploaded, hash verified) → proceed to seal', () => {
    expect(
      decide({
        sessionExists: true,
        uploadState: { currentIndex: 33, totalChunks: 33, runningHashHex: hashAt(33) }
      })
    ).toMatchObject({ action: 'proceed', fromStep: 'seal', safe: true });
  });

  it('seal-submitted, confirmed on core but unseen locally → proceed await-index (no re-seal)', () => {
    const decision = decide({
      sessionExists: true,
      sealedTokenId: 42,
      uploadState: { currentIndex: 33, totalChunks: 33, runningHashHex: hashAt(33) }
    });
    expect(decision).toMatchObject({ action: 'proceed', fromStep: 'await-index' });
  });

  it('broadcast-succeeded-unseen-locally / already indexed → skip (never duplicate-mint)', () => {
    expect(decide({ sessionExists: true, itemIndexedAt: 1000 })).toMatchObject({ action: 'skip' });
    expect(decide({ sessionExists: false, hashIndexedAt: 4 })).toMatchObject({ action: 'skip' });
    // Even with a live upload state, indexed wins.
    expect(
      decide({
        sessionExists: true,
        itemIndexedAt: 1,
        uploadState: { currentIndex: 3, totalChunks: 33, runningHashHex: 'ff'.repeat(32) }
      })
    ).toMatchObject({ action: 'skip', safe: true });
  });

  it('expired reservation → expired-restart', () => {
    expect(
      decide({
        sessionExists: true,
        sessionExpired: true,
        uploadState: { currentIndex: 10, totalChunks: 33, runningHashHex: hashAt(10) }
      })
    ).toMatchObject({ action: 'expired-restart', safe: true });
  });

  it('on-chain running hash diverges (stop/restart double-fold) → reconcile-mismatch, unsafe', () => {
    const decision = decide({
      sessionExists: true,
      uploadState: { currentIndex: 10, totalChunks: 33, runningHashHex: hashAt(9) }
    });
    expect(decision).toMatchObject({ action: 'reconcile-mismatch', safe: false });
    expect(decision.reason).toMatch(/diverges/);
  });

  it('shape mismatch (session for a different file) → reconcile-mismatch', () => {
    expect(
      decide({
        sessionExists: true,
        uploadState: { currentIndex: 10, totalChunks: 40, runningHashHex: hashAt(10) }
      })
    ).toMatchObject({ action: 'reconcile-mismatch', safe: false });
  });

  it('corrupt current-index out of range → reconcile-mismatch', () => {
    expect(
      decide({
        sessionExists: true,
        uploadState: { currentIndex: 34, totalChunks: 33, runningHashHex: hashAt(33) }
      })
    ).toMatchObject({ action: 'reconcile-mismatch', safe: false });
  });

  it('hash comparison is case-insensitive', () => {
    expect(
      decide({
        sessionExists: true,
        uploadState: { currentIndex: 4, totalChunks: 33, runningHashHex: hashAt(4).toUpperCase() }
      })
    ).toMatchObject({ action: 'proceed', fromStep: 'upload' });
  });
});

describe('decideResume — idempotency', () => {
  it('property: same observation → identical decision (pure function)', () => {
    const observationArb: fc.Arbitrary<ChainObservation> = fc.record(
      {
        sessionExists: fc.boolean(),
        sessionExpired: fc.boolean(),
        uploadState: fc.record({
          currentIndex: fc.integer({ min: 0, max: 33 }),
          totalChunks: fc.constantFrom(33, 40),
          runningHashHex: fc.integer({ min: 0, max: 33 }).map(hashAt)
        }),
        sealedTokenId: fc.nat(1000),
        itemIndexedAt: fc.nat(10_000),
        hashIndexedAt: fc.nat(100)
      },
      { requiredKeys: ['sessionExists'] }
    );
    fc.assert(
      fc.property(observationArb, (observation) => {
        const a = decide(observation);
        const b = decide(observation);
        expect(a).toEqual(b);
        // Duplicate-mint safety: indexed content never yields a mint action.
        if (observation.itemIndexedAt !== undefined || observation.hashIndexedAt !== undefined) {
          expect(a.action).toBe('skip');
        }
      }),
      { numRuns: 300 }
    );
  });
});

describe('decideResumeAll', () => {
  it('maps every manifest item through its own observation', () => {
    const decisions = decideResumeAll(
      manifest.items,
      (item) => (item.index === 0 ? { sessionExists: false } : { sessionExists: false, hashIndexedAt: 1 }),
      (item, k) => (item.index === 0 ? hashAt(k) : singleHashAt(k))
    );
    expect(decisions).toHaveLength(2);
    expect(decisions[0]!).toMatchObject({ index: 0, action: 'proceed' });
    expect(decisions[1]!).toMatchObject({ index: 1, action: 'skip' });
  });
});

describe('planChunkBatch — retry idempotency guard', () => {
  it('submit when batch starts exactly at current-index', () => {
    expect(planChunkBatch({ onChainCurrentIndex: 32, batchStartIndex: 32, batchLength: 1 }).action).toBe('submit');
    expect(planChunkBatch({ onChainCurrentIndex: 0, batchStartIndex: 0, batchLength: 32 }).action).toBe('submit');
  });

  it('skip when the batch already landed (retry after unseen success must no-op)', () => {
    expect(planChunkBatch({ onChainCurrentIndex: 32, batchStartIndex: 0, batchLength: 32 }).action).toBe('skip');
    expect(planChunkBatch({ onChainCurrentIndex: 64, batchStartIndex: 32, batchLength: 32 }).action).toBe('skip');
  });

  it('reconcile on gap, partial overlap, and invalid shapes', () => {
    expect(planChunkBatch({ onChainCurrentIndex: 0, batchStartIndex: 32, batchLength: 32 }).action).toBe('reconcile');
    expect(planChunkBatch({ onChainCurrentIndex: 16, batchStartIndex: 0, batchLength: 32 }).action).toBe('reconcile');
    expect(planChunkBatch({ onChainCurrentIndex: 0, batchStartIndex: 0, batchLength: 0 }).action).toBe('reconcile');
    expect(planChunkBatch({ onChainCurrentIndex: 0, batchStartIndex: 0, batchLength: 33 }).action).toBe('reconcile');
  });

  it('property: decisions are pure and total over the input space', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 200 }),
        fc.integer({ min: 0, max: 200 }),
        fc.integer({ min: 1, max: 32 }),
        (current, start, length) => {
          const a = planChunkBatch({ onChainCurrentIndex: current, batchStartIndex: start, batchLength: length });
          const b = planChunkBatch({ onChainCurrentIndex: current, batchStartIndex: start, batchLength: length });
          expect(a).toEqual(b);
          expect(['submit', 'skip', 'reconcile']).toContain(a.action);
          // submit only when perfectly aligned
          if (a.action === 'submit') expect(start).toBe(current);
          // skip only when fully behind current-index
          if (a.action === 'skip') expect(start + length).toBeLessThanOrEqual(current);
        }
      ),
      { numRuns: 500 }
    );
  });
});
