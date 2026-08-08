// The hand-rolled SHA-256, checked against Node's own.
//
// This function is load-bearing for every rule commitment on chain. A hash that
// is subtly wrong on some input length would produce games whose rules could
// never be confirmed, permanently, and the bug would not show up until somebody
// happened to commit that shape of rule set.

import { createHash, randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { bytesToHex, hexToBytes, sha256, sha256Hex } from '../../packages/protocol/sha256.js';

const nodeHash = (bytes: Uint8Array): string =>
  createHash('sha256').update(Buffer.from(bytes)).digest('hex');

describe('sha256', () => {
  it('matches the published vectors', () => {
    expect(sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    expect(sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')).toBe(
      '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'
    );
  });

  // Every length across the padding boundaries. A block is 64 bytes and the
  // length field takes the last 8, so 55/56 and 119/120 are where a padding bug
  // lives. Walking 0..200 covers all of them and then some.
  it('agrees with node at every length up to 200', () => {
    for (let length = 0; length <= 200; length++) {
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) bytes[i] = (i * 37 + 11) & 0xff;
      expect(bytesToHex(sha256(bytes)), `length ${length}`).toBe(nodeHash(bytes));
    }
  });

  it('agrees with node over 2000 random inputs', () => {
    for (let i = 0; i < 2000; i++) {
      const bytes = new Uint8Array(randomBytes(1 + (i % 300)));
      expect(bytesToHex(sha256(bytes))).toBe(nodeHash(bytes));
    }
  });

  it('agrees with node on a multi-block input', () => {
    const bytes = new Uint8Array(randomBytes(100_000));
    expect(bytesToHex(sha256(bytes))).toBe(nodeHash(bytes));
  });

  it('round-trips hex', () => {
    const bytes = new Uint8Array(randomBytes(64));
    expect(hexToBytes(bytesToHex(bytes))).toEqual(bytes);
    expect(hexToBytes('0xdeadBEEF')).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
    expect(() => hexToBytes('xyz')).toThrow();
    expect(() => hexToBytes('abc')).toThrow();
  });
});
