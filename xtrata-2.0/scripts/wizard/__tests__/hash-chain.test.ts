import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { CHUNK_SIZE, chunkBytes, finalHash, toHex } from '../inscribe.mjs';

/**
 * Independent reference implementation of the core hash chain, written from the
 * contract's description rather than from inscribe.mjs, using node:crypto
 * instead of @noble/hashes. If the two ever disagree, a mint aborts on-chain
 * and burns the miner fee, so this is the test that matters most.
 *
 *   H0 = 32 zero bytes
 *   Hi = sha256(H(i-1) || chunk_i)
 */
const referenceFinalHash = (bytes: Uint8Array): Buffer => {
  let running = Buffer.alloc(32, 0);
  if (bytes.length === 0) return createHash('sha256').update(running).digest();
  for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
    const chunk = Buffer.from(bytes.subarray(offset, offset + CHUNK_SIZE));
    running = createHash('sha256').update(Buffer.concat([running, chunk])).digest();
  }
  return running;
};

/** Deterministic filler so the fixtures are reproducible. */
const fill = (length: number): Uint8Array => {
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) out[i] = (i * 31 + 7) % 256;
  return out;
};

const sizes: Array<[string, number]> = [
  ['empty', 0],
  ['one byte', 1],
  ['a short entry', 2_212],
  ['one byte under a chunk', CHUNK_SIZE - 1],
  ['exactly one chunk', CHUNK_SIZE],
  ['one byte over a chunk', CHUNK_SIZE + 1],
  ['exactly two chunks', CHUNK_SIZE * 2],
  ['two chunks and a remainder', CHUNK_SIZE * 2 + 999],
  ['exactly three chunks', CHUNK_SIZE * 3]
];

describe('core final hash chain', () => {
  for (const [label, size] of sizes) {
    it(`matches the node:crypto reference for ${label} (${size} bytes)`, () => {
      const bytes = fill(size);
      expect(toHex(finalHash(bytes))).toBe(`0x${referenceFinalHash(bytes).toString('hex')}`);
    });
  }

  it('folds exactly once per chunk', () => {
    expect(chunkBytes(fill(0))).toHaveLength(1);
    expect(chunkBytes(fill(1))).toHaveLength(1);
    expect(chunkBytes(fill(CHUNK_SIZE))).toHaveLength(1);
    expect(chunkBytes(fill(CHUNK_SIZE + 1))).toHaveLength(2);
    expect(chunkBytes(fill(CHUNK_SIZE * 3))).toHaveLength(3);
  });

  it('is sensitive to a single flipped bit', () => {
    const bytes = fill(2_212);
    const mutated = Uint8Array.from(bytes);
    mutated[1_000] ^= 0x01;
    expect(toHex(finalHash(bytes))).not.toBe(toHex(finalHash(mutated)));
  });

  it('is order sensitive across chunk boundaries', () => {
    const first = fill(CHUNK_SIZE);
    const second = fill(CHUNK_SIZE).map((byte) => byte ^ 0xff);
    const forwards = new Uint8Array([...first, ...second]);
    const backwards = new Uint8Array([...second, ...first]);
    expect(toHex(finalHash(forwards))).not.toBe(toHex(finalHash(backwards)));
  });

  it('agrees with the reference on a real composed entry', async () => {
    const { composeEntry } = await import('../compose.mjs');
    const body = composeEntry({
      persona: 'builder',
      threadId: 't-hash-0001',
      position: 3,
      subject: 'chunk-size',
      parentIds: ['77'],
      answering: [{ id: '77', wizard: 'Wizard-2, the Skeptic', quote: 'a quoted fragment' }],
      blockHeight: 8_668_831,
      feeMicroStx: 11_000
    });
    const bytes = new Uint8Array(Buffer.from(body, 'utf8'));
    expect(toHex(finalHash(bytes))).toBe(`0x${referenceFinalHash(bytes).toString('hex')}`);
  });
});
