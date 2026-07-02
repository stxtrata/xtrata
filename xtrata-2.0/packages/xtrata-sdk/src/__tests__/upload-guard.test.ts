import { describe, expect, it } from 'vitest';
import { computeExpectedHash } from '../mint';
import type { UploadState } from '../types';
import {
  assertSealable,
  bytesEqual,
  compareUploadSettings,
  evaluateResume,
  planChunkBatch,
  runningHashAfter,
  toHex
} from '../upload-guard';

const chunk = (byte: number, length = 8): Uint8Array =>
  new Uint8Array(length).fill(byte);

const makeChunks = (bytes: number[]): Uint8Array[] => bytes.map((b) => chunk(b));

const makeState = (
  chunks: Uint8Array[],
  currentIndex: number,
  overrides: Partial<UploadState> = {}
): UploadState => ({
  mimeType: 'image/png',
  totalSize: BigInt(chunks.reduce((sum, c) => sum + c.length, 0)),
  totalChunks: BigInt(chunks.length),
  currentIndex: BigInt(currentIndex),
  runningHash: runningHashAfter(chunks, currentIndex),
  ...overrides
});

describe('runningHashAfter', () => {
  it('matches computeExpectedHash over the full chunk list', () => {
    const chunks = makeChunks([1, 2, 3, 4]);
    expect(toHex(runningHashAfter(chunks, chunks.length))).toBe(
      toHex(computeExpectedHash(chunks))
    );
  });

  it('returns the 32 zero-byte seed for count 0', () => {
    expect(toHex(runningHashAfter(makeChunks([9, 9]), 0))).toBe('00'.repeat(32));
  });

  it('rejects out-of-range counts', () => {
    expect(() => runningHashAfter(makeChunks([1, 2]), 3)).toThrow(/count must be/);
    expect(() => runningHashAfter(makeChunks([1, 2]), -1)).toThrow(/count must be/);
  });
});

describe('evaluateResume', () => {
  const chunks = makeChunks([10, 20, 30, 40, 50]);
  const expectedHash = computeExpectedHash(chunks);

  it('returns fresh when there is no on-chain state', () => {
    const decision = evaluateResume({ uploadState: null, localChunks: chunks, expectedHash });
    expect(decision.status).toBe('fresh');
    expect(decision.safe).toBe(true);
    expect(decision.resumeFromIndex).toBe(0);
  });

  it('allows resume when the on-chain prefix matches the local file', () => {
    const decision = evaluateResume({
      uploadState: makeState(chunks, 2),
      localChunks: chunks,
      expectedHash
    });
    expect(decision.status).toBe('resume');
    expect(decision.safe).toBe(true);
    expect(decision.resumeFromIndex).toBe(2);
  });

  it('reports complete when all chunks are present and the hash matches', () => {
    const decision = evaluateResume({
      uploadState: makeState(chunks, chunks.length),
      localChunks: chunks,
      expectedHash
    });
    expect(decision.status).toBe('complete');
    expect(decision.safe).toBe(true);
  });

  it('flags a shape mismatch when chunk counts differ (different file)', () => {
    const otherFile = makeChunks([10, 20, 30]); // 3 chunks
    const decision = evaluateResume({
      uploadState: makeState(chunks, 1), // on-chain expects 5
      localChunks: otherFile,
      expectedHash: computeExpectedHash(otherFile)
    });
    expect(decision.status).toBe('shape-mismatch');
    expect(decision.safe).toBe(false);
  });

  it('flags a shape mismatch when totalSize/mimeType cross-checks differ', () => {
    const state = makeState(chunks, 2);
    expect(
      evaluateResume({ uploadState: state, localChunks: chunks, expectedHash, totalSize: 999 }).status
    ).toBe('shape-mismatch');
    expect(
      evaluateResume({ uploadState: state, localChunks: chunks, expectedHash, mimeType: 'video/mp4' }).status
    ).toBe('shape-mismatch');
  });

  it('detects the stop/restart corruption: on-chain bytes diverge from the local prefix', () => {
    // Simulate a restart that folded chunk[0] again at index 2 instead of chunk[2]:
    // on-chain folded [10, 20, 10] while the real file is [10, 20, 30, 40, 50].
    const corruptedOrder = makeChunks([10, 20, 10]);
    const poisonedHash = runningHashAfter(corruptedOrder, 3);
    const state = makeState(chunks, 3, { runningHash: poisonedHash });

    const decision = evaluateResume({ uploadState: state, localChunks: chunks, expectedHash });
    expect(decision.status).toBe('corrupt');
    expect(decision.safe).toBe(false);
    expect(decision.reason).toMatch(/diverges|corrupted/i);
  });

  it('flags an out-of-range current-index as corrupt', () => {
    const state = makeState(chunks, chunks.length, {
      currentIndex: BigInt(chunks.length + 1)
    });
    const decision = evaluateResume({ uploadState: state, localChunks: chunks, expectedHash });
    expect(decision.status).toBe('corrupt');
  });

  it('rejects a malformed expected hash', () => {
    expect(() =>
      evaluateResume({ uploadState: null, localChunks: chunks, expectedHash: new Uint8Array(16) })
    ).toThrow(/expectedHash must be/);
  });
});

describe('planChunkBatch (idempotent retry guard)', () => {
  it('submits the batch that starts exactly at current-index', () => {
    expect(planChunkBatch({ onChainCurrentIndex: 30, batchStartIndex: 30, batchLength: 30 }).action).toBe(
      'submit'
    );
  });

  it('skips a batch that already landed (prevents double-fold on retry)', () => {
    // First broadcast landed (current-index advanced to 30); a retry must not resubmit [0,30).
    expect(planChunkBatch({ onChainCurrentIndex: 30, batchStartIndex: 0, batchLength: 30 }).action).toBe(
      'skip'
    );
  });

  it('reconciles when there is a gap before the batch', () => {
    expect(planChunkBatch({ onChainCurrentIndex: 10, batchStartIndex: 30, batchLength: 30 }).action).toBe(
      'reconcile'
    );
  });

  it('reconciles a partial overlap straddling current-index', () => {
    expect(planChunkBatch({ onChainCurrentIndex: 15, batchStartIndex: 0, batchLength: 30 }).action).toBe(
      'reconcile'
    );
  });

  it('accepts bigint current-index', () => {
    expect(planChunkBatch({ onChainCurrentIndex: 60n, batchStartIndex: 60, batchLength: 5 }).action).toBe(
      'submit'
    );
  });
});

describe('assertSealable (pre-seal guard)', () => {
  const chunks = makeChunks([1, 2, 3]);
  const expectedHash = computeExpectedHash(chunks);

  it('passes when fully uploaded and the hash matches', () => {
    expect(() =>
      assertSealable({
        uploadState: makeState(chunks, chunks.length),
        expectedHash,
        localChunkCount: chunks.length
      })
    ).not.toThrow();
  });

  it('throws when there is no upload state', () => {
    expect(() => assertSealable({ uploadState: null, expectedHash })).toThrow(/no on-chain upload state/i);
  });

  it('throws SEAL_INCOMPLETE when chunks are missing (would be u102)', () => {
    expect(() => assertSealable({ uploadState: makeState(chunks, 1), expectedHash })).toThrow(
      /incomplete/i
    );
  });

  it('throws SEAL_HASH_MISMATCH when the running hash diverges (would be u103)', () => {
    const poisoned = makeState(chunks, chunks.length, {
      runningHash: runningHashAfter(makeChunks([1, 2, 9]), 3)
    });
    expect(() => assertSealable({ uploadState: poisoned, expectedHash })).toThrow(/u103/i);
  });

  it('throws SEAL_SHAPE_MISMATCH when local chunk count disagrees', () => {
    expect(() =>
      assertSealable({ uploadState: makeState(chunks, chunks.length), expectedHash, localChunkCount: 4 })
    ).toThrow(/chunks but the selected file/i);
  });
});

describe('compareUploadSettings (relationship/settings drift warning)', () => {
  it('detects no drift for identical settings', () => {
    const drift = compareUploadSettings(
      { tokenUri: 'a', parentIds: ['1', '2'], dependencyIds: ['7'] },
      { tokenUri: 'a', parentIds: ['2', '1'], dependencyIds: ['7'] }
    );
    expect(drift.changed).toBe(false);
    expect(drift.fields).toEqual([]);
  });

  it('flags dropped parents across a restart (the reported scenario)', () => {
    const drift = compareUploadSettings(
      { parentIds: ['100', '101'] },
      { parentIds: [] }
    );
    expect(drift.changed).toBe(true);
    expect(drift.fields).toContain('parentIds');
  });

  it('flags token-uri and dependency changes', () => {
    const drift = compareUploadSettings(
      { tokenUri: 'old', dependencyIds: ['1'] },
      { tokenUri: 'new', dependencyIds: ['1', '2'] }
    );
    expect(drift.fields).toEqual(expect.arrayContaining(['tokenUri', 'dependencyIds']));
  });
});

describe('bytesEqual', () => {
  it('compares content and length', () => {
    expect(bytesEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(bytesEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
    expect(bytesEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
  });
});
