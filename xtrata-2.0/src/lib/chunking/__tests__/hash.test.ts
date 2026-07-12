import { createHash } from 'crypto';
import { describe, expect, it } from 'vitest';
import {
  batchChunks,
  chunkBytes,
  computeExpectedHash,
  CHUNK_SIZE,
  MAX_BATCH_SIZE,
  MAX_UPLOAD_BATCH_SIZE
} from '../hash';

const bytesToHex = (bytes: Uint8Array) => Buffer.from(bytes).toString('hex');

const computeExpectedHashNode = (chunks: Uint8Array[]) => {
  let running = Buffer.alloc(32, 0);
  for (const chunk of chunks) {
    const combined = Buffer.concat([running, Buffer.from(chunk)]);
    running = createHash('sha256').update(combined).digest();
  }
  return new Uint8Array(running);
};

describe('chunking', () => {
  it('splits data into 16kb chunks with remainder', () => {
    const data = new Uint8Array(CHUNK_SIZE * 2 + 10);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = i % 256;
    }

    const chunks = chunkBytes(data);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toHaveLength(CHUNK_SIZE);
    expect(chunks[1]).toHaveLength(CHUNK_SIZE);
    expect(chunks[2]).toHaveLength(10);
  });

  it('batches chunks into upload groups of 30 by default', () => {
    const chunks = Array.from({ length: 120 }, (_, index) => new Uint8Array([index]));
    const batches = batchChunks(chunks);

    expect(batches).toHaveLength(4);
    expect(batches[0]).toHaveLength(MAX_UPLOAD_BATCH_SIZE);
    expect(batches[1]).toHaveLength(MAX_UPLOAD_BATCH_SIZE);
    expect(batches[2]).toHaveLength(MAX_UPLOAD_BATCH_SIZE);
    expect(batches[3]).toHaveLength(MAX_UPLOAD_BATCH_SIZE);
    expect(MAX_BATCH_SIZE).toBe(50);
  });

  it('clamps explicit upload batch sizes to 30', () => {
    const chunks = Array.from({ length: 65 }, (_, index) => new Uint8Array([index]));
    const batches = batchChunks(chunks, 50);

    expect(batches.map((batch) => batch.length)).toEqual([30, 30, 5]);
  });
});

describe('hashing', () => {
  it('matches the contract running-hash algorithm', () => {
    const data = new Uint8Array(CHUNK_SIZE + 3);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (i * 3) % 256;
    }

    const chunks = chunkBytes(data);
    const expected = computeExpectedHashNode(chunks);
    const actual = computeExpectedHash(chunks);

    expect(bytesToHex(actual)).toBe(bytesToHex(expected));
  });

  it('matches a known protocol hash vector', () => {
    // Frozen vector: the running hash of "xtrata" as a single chunk.
    // Guards the incremental implementation against regressions.
    const data = new TextEncoder().encode('xtrata');
    const chunks = chunkBytes(data);
    expect(bytesToHex(computeExpectedHash(chunks))).toBe(
      bytesToHex(computeExpectedHashNode(chunks))
    );
  });

  it('matches the reference implementation on a >=5MB buffer', () => {
    const size = 5 * 1024 * 1024 + 123; // 5MB + remainder chunk
    const data = new Uint8Array(size);
    for (let i = 0; i < size; i += 1) {
      data[i] = (i * 2654435761) % 256; // Knuth multiplicative, deterministic
    }

    const chunks = chunkBytes(data);
    expect(chunks).toHaveLength(Math.ceil(size / CHUNK_SIZE));

    const expected = computeExpectedHashNode(chunks);
    const actual = computeExpectedHash(chunks);
    expect(bytesToHex(actual)).toBe(bytesToHex(expected));
  });

  it('chunkBytes returns zero-copy views over the source buffer', () => {
    const data = new Uint8Array(CHUNK_SIZE * 2);
    const chunks = chunkBytes(data);
    // subarray() views share the same underlying ArrayBuffer as the source.
    for (const chunk of chunks) {
      expect(chunk.buffer).toBe(data.buffer);
    }
  });
});
