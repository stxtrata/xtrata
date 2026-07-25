import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { createHash } from 'node:crypto';
import {
  CHUNK_SIZE,
  MAX_SINGLE_TX_BYTES,
  chunkBytes,
  chunkCount,
  computeChainHash,
  chainHashOfBytes,
  runningHashAfter,
  plainSha256,
  bytesToHex,
  hexToBytes,
  bytesEqual,
  EMPTY_HASH
} from '../src/hash.js';

/** Naive reference implementation using node:crypto with explicit concat. */
const referenceChainHash = (bytes: Uint8Array, chunkSize: number): Uint8Array => {
  let running = Buffer.alloc(32);
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = Buffer.from(bytes.slice(offset, offset + chunkSize));
    running = createHash('sha256').update(Buffer.concat([running, chunk])).digest();
  }
  return new Uint8Array(running);
};

describe('chunkBytes', () => {
  it('returns zero-copy views over the source buffer', () => {
    const data = new Uint8Array(CHUNK_SIZE + 100).fill(7);
    const chunks = chunkBytes(data);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]!.buffer).toBe(data.buffer);
    expect(chunks[0]!.length).toBe(CHUNK_SIZE);
    expect(chunks[1]!.length).toBe(100);
  });

  it('empty input yields no chunks', () => {
    expect(chunkBytes(new Uint8Array(0))).toHaveLength(0);
    expect(chunkCount(0)).toBe(0);
  });

  it('rejects non-positive chunk size', () => {
    expect(() => chunkBytes(new Uint8Array(1), 0)).toThrow();
    expect(() => chunkBytes(new Uint8Array(1), -5)).toThrow();
  });

  it('chunkCount boundaries at 32 chunks / 512 KiB', () => {
    expect(chunkCount(MAX_SINGLE_TX_BYTES)).toBe(32);
    expect(chunkCount(MAX_SINGLE_TX_BYTES + 1)).toBe(33);
    expect(chunkCount(CHUNK_SIZE)).toBe(1);
    expect(chunkCount(CHUNK_SIZE + 1)).toBe(2);
  });
});

describe('chain hash vs reference implementation', () => {
  it('property: matches naive node:crypto reference for random bytes and chunk sizes', () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 0, maxLength: 8192 }),
        fc.integer({ min: 1, max: 1024 }),
        (bytes, chunkSize) => {
          const ours = chainHashOfBytes(bytes, chunkSize);
          const ref = referenceChainHash(bytes, chunkSize);
          expect(bytesToHex(ours)).toBe(bytesToHex(ref));
        }
      ),
      { numRuns: 200 }
    );
  });

  it('property: chunk order matters (chained, not commutative)', () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 2, maxLength: 64 }),
        fc.uint8Array({ minLength: 2, maxLength: 64 }),
        (a, b) => {
          fc.pre(bytesToHex(a) !== bytesToHex(b));
          const ab = computeChainHash([a, b]);
          const ba = computeChainHash([b, a]);
          expect(bytesToHex(ab)).not.toBe(bytesToHex(ba));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: different chunkings of the same bytes give different hashes (chunking is part of identity)', () => {
    const bytes = new Uint8Array(100).map((_, i) => i);
    const h50 = chainHashOfBytes(bytes, 50);
    const h25 = chainHashOfBytes(bytes, 25);
    expect(bytesToHex(h50)).not.toBe(bytesToHex(h25));
  });

  it('empty chunk list hashes to the zero seed', () => {
    expect(bytesToHex(computeChainHash([]))).toBe(bytesToHex(EMPTY_HASH));
  });
});

describe('runningHashAfter', () => {
  const chunks = chunkBytes(new Uint8Array(CHUNK_SIZE * 3 + 5).map((_, i) => i % 251));

  it('k=0 is the zero seed; k=n equals the final chain hash', () => {
    expect(bytesToHex(runningHashAfter(chunks, 0))).toBe(bytesToHex(EMPTY_HASH));
    expect(bytesToHex(runningHashAfter(chunks, chunks.length))).toBe(
      bytesToHex(computeChainHash(chunks))
    );
  });

  it('property: prefix hash matches chain hash of the prefix', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: chunks.length }), (k) => {
        expect(bytesToHex(runningHashAfter(chunks, k))).toBe(
          bytesToHex(computeChainHash(chunks.slice(0, k)))
        );
      })
    );
  });

  it('rejects out-of-range counts', () => {
    expect(() => runningHashAfter(chunks, -1)).toThrow();
    expect(() => runningHashAfter(chunks, chunks.length + 1)).toThrow();
    expect(() => runningHashAfter(chunks, 1.5)).toThrow();
  });
});

describe('plainSha256', () => {
  it('matches node:crypto sha256', () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 4096 }), (bytes) => {
        const ref = createHash('sha256').update(Buffer.from(bytes)).digest('hex');
        expect(bytesToHex(plainSha256(bytes))).toBe(ref);
      }),
      { numRuns: 100 }
    );
  });
});

describe('hex utils', () => {
  it('round-trips', () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 128 }), (bytes) => {
        expect(hexToBytes(bytesToHex(bytes))).toEqual(bytes);
      })
    );
  });

  it('accepts 0x prefix, rejects bad hex', () => {
    expect(hexToBytes('0xff00')).toEqual(new Uint8Array([255, 0]));
    expect(() => hexToBytes('xyz')).toThrow();
    expect(() => hexToBytes('abc')).toThrow(); // odd length
  });

  it('bytesEqual', () => {
    expect(bytesEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
    expect(bytesEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
    expect(bytesEqual(new Uint8Array([1]), new Uint8Array([1, 2]))).toBe(false);
  });
});
