// The board ships a hand-rolled Clarity codec so the inscription stays
// self-contained. That is only safe if it agrees with the real thing, so every
// case here is checked against @stacks/transactions, which is a dev dependency
// and never reaches the inscription.

import { describe, expect, it } from 'vitest';
import {
  Cl,
  serializeCV,
  getAddressFromPrivateKey,
  addressFromVersionHash,
  addressToString,
  validateStacksAddress
} from '@stacks/transactions';
import {
  c32address,
  deserialize,
  hexToBytes,
  serializeStringAscii,
  serializeUint,
  serializeBuffer,
  serializeNone,
  serializeSome,
  sha256
} from '../src/clarity.js';

function hex(cv) {
  const out = serializeCV(cv);
  return typeof out === 'string' ? `0x${out.replace(/^0x/, '')}` : `0x${Buffer.from(out).toString('hex')}`;
}

describe('sha256', () => {
  it('matches known digests', () => {
    const digest = (text) =>
      Buffer.from(sha256(new TextEncoder().encode(text))).toString('hex');

    expect(digest('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    expect(digest('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    // Longer than one block, to exercise the padding path.
    expect(digest('a'.repeat(1000))).toBe(
      '41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3'
    );
  });
});

describe('serialising', () => {
  it('encodes uints the same way as @stacks/transactions', () => {
    for (const value of [0, 1, 42, 255, 256, 65535, 4096, 2 ** 40, Number.MAX_SAFE_INTEGER]) {
      expect(serializeUint(value)).toBe(hex(Cl.uint(value)));
    }
  });

  it('encodes ascii strings the same way', () => {
    for (const value of ['', 'e2e4', 'e7e8q', 'xtrata-chess-log-v1']) {
      expect(serializeStringAscii(value)).toBe(hex(Cl.stringAscii(value)));
    }
  });
});

describe('deserialising', () => {
  it('round-trips the shapes the contract returns', () => {
    expect(deserialize(hex(Cl.uint(7)))).toBe(7n);
    expect(deserialize(hex(Cl.bool(true)))).toBe(true);
    expect(deserialize(hex(Cl.none()))).toBe(null);
    expect(deserialize(hex(Cl.some(Cl.uint(3))))).toBe(3n);
    expect(deserialize(hex(Cl.stringAscii('e2e4')))).toBe('e2e4');
    expect(deserialize(hex(Cl.ok(Cl.uint(1))))).toEqual({ ok: true, value: 1n });
    expect(deserialize(hex(Cl.error(Cl.uint(100))))).toEqual({ ok: false, value: 100n });
    expect(deserialize(hex(Cl.list([Cl.uint(1), Cl.uint(2)])))).toEqual([1n, 2n]);
  });

  it('decodes a move entry tuple', () => {
    const address = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    const cv = Cl.tuple({
      mv: Cl.stringAscii('e7e8q'),
      sender: Cl.principal(address),
      height: Cl.uint(912_345)
    });
    expect(deserialize(hex(cv))).toEqual({
      mv: 'e7e8q',
      sender: address,
      height: 912_345n
    });
  });

  it('decodes a page: a list of optional tuples with trailing nones', () => {
    const entry = (mv) =>
      Cl.some(
        Cl.tuple({
          mv: Cl.stringAscii(mv),
          sender: Cl.principal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'),
          height: Cl.uint(1)
        })
      );
    const page = Cl.list([entry('e2e4'), entry('e7e5'), Cl.none(), Cl.none()]);
    const decoded = deserialize(hex(page));

    expect(decoded).toHaveLength(4);
    expect(decoded[0].mv).toBe('e2e4');
    expect(decoded[1].mv).toBe('e7e5');
    expect(decoded[2]).toBe(null);
    expect(decoded[3]).toBe(null);
  });
});

describe('c32address', () => {
  // deserialize() builds the address string with our own c32address, so a
  // round trip through a principal the library encoded proves the encoder,
  // not just the reader.
  it('reproduces addresses derived by @stacks/transactions', () => {
    for (let i = 1; i <= 24; i++) {
      const privateKey =
        Buffer.from(sha256(new TextEncoder().encode(`seed-${i}`))).toString('hex') + '01';

      for (const network of ['mainnet', 'testnet']) {
        const expected = getAddressFromPrivateKey(privateKey, network);
        expect(deserialize(hex(Cl.principal(expected)))).toBe(expected);
      }
    }
  });

  it('encodes version and hash directly', () => {
    // A hash of all zeroes exercises the leading-zero padding rule.
    const zeros = new Uint8Array(20);
    const address = c32address(22, zeros);
    expect(address.startsWith('SP')).toBe(true);
    expect(deserialize(hex(Cl.principal(address)))).toBe(address);
  });

  // Encoding arbitrary hashes is a stricter test than decoding principals the
  // library built, because it reaches cases real key derivation rarely hits.
  it('matches the canonical encoder over many hashes and both networks', () => {
    let notFortyOne = 0;

    for (let i = 0; i < 750; i++) {
      const digest = sha256(new TextEncoder().encode(`probe/${i}`)).slice(0, 20);
      const asHex = Buffer.from(digest).toString('hex');

      for (const version of [22, 26]) {
        const mine = c32address(version, digest);
        expect(mine).toBe(addressToString(addressFromVersionHash(version, asHex)));
        expect(validateStacksAddress(mine)).toBe(true);
      }

      if (c32address(22, digest).length !== 41) notFortyOne++;
    }

    // Stacks addresses are not a fixed width: a body with small leading bits
    // encodes to fewer base32 digits. Anything that assumes 41 characters is
    // wrong about roughly a quarter of all addresses.
    expect(notFortyOne).toBeGreaterThan(0);
  });
});

describe('serialising the rules commitment', () => {
  const HASH = 'a'.repeat(64);

  it('encodes buffers, none and some the same way as @stacks/transactions', () => {
    expect(serializeBuffer(HASH)).toBe(hex(Cl.buffer(Buffer.from(HASH, 'hex'))));
    expect(serializeNone()).toBe(hex(Cl.none()));
    expect(serializeSome(serializeBuffer(HASH))).toBe(
      hex(Cl.some(Cl.buffer(Buffer.from(HASH, 'hex'))))
    );
  });

  it('round-trips an optional buffer', () => {
    expect(deserialize(serializeNone())).toBe(null);
    expect(bytesToHexHelper(deserialize(serializeSome(serializeBuffer(HASH))))).toBe(HASH);
  });
});

function bytesToHexHelper(bytes) {
  return Buffer.from(bytes).toString('hex');
}
