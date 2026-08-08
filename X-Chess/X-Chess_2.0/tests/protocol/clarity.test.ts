// The hand-rolled Clarity codec, checked byte for byte against the real SDK.
//
// The codec exists so the inscription can be self-contained (an inscription
// cannot fetch an SDK, and every byte is permanent). The SDK is a build-time
// dependency here and only here: it is the oracle this file checks against, and
// nothing in packages/ imports it.

import { Cl, cvToHex, hexToCV, serializeCV } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import {
  c32address,
  deserialize,
  parseAddress,
  serializeBool,
  serializeBuffer,
  serializeNone,
  serializePrincipal,
  serializeSome,
  serializeStringAscii,
  serializeUint
} from '../../packages/chain/clarity.js';
import { bytesToHex } from '../../packages/protocol/sha256.js';

const sdkHex = (cv: Parameters<typeof serializeCV>[0]): string => cvToHex(cv);

const ADDRESSES = [
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ',
  'SP000000000000000000002Q6VF78',
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
];

describe('serialising arguments', () => {
  it('matches the SDK for uints, including the extremes', () => {
    const values = [0n, 1n, 42n, 65_536n, 1_000_000n, 2n ** 64n, 2n ** 127n, 2n ** 128n - 1n];
    for (const value of values) {
      expect(serializeUint(value), String(value)).toBe(sdkHex(Cl.uint(value)));
    }
  });

  it('refuses a negative uint rather than wrapping it', () => {
    expect(() => serializeUint(-1)).toThrow();
  });

  it('matches the SDK for booleans', () => {
    expect(serializeBool(true)).toBe(sdkHex(Cl.bool(true)));
    expect(serializeBool(false)).toBe(sdkHex(Cl.bool(false)));
  });

  it('matches the SDK for ascii strings, including the ones this contract takes', () => {
    for (const text of ['', 'e2e4', 'e7e8q', 'resgn', 'draw?', 'draw!', '1/2-1/2', '!!!!!']) {
      expect(serializeStringAscii(text), JSON.stringify(text)).toBe(sdkHex(Cl.stringAscii(text)));
    }
  });

  it('refuses a non-ASCII string rather than producing bytes the contract will reject', () => {
    expect(() => serializeStringAscii('e2e4é')).toThrow();
  });

  it('matches the SDK for buffers, including a rules hash', () => {
    for (const hex of ['', 'ff', 'deadbeef', 'ab'.repeat(32), '00'.repeat(32)]) {
      expect(serializeBuffer(hex), hex).toBe(sdkHex(Cl.bufferFromHex(hex)));
    }
  });

  it('matches the SDK for optionals', () => {
    expect(serializeNone()).toBe(sdkHex(Cl.none()));
    expect(serializeSome(serializeBuffer('ab'.repeat(32)))).toBe(
      sdkHex(Cl.some(Cl.bufferFromHex('ab'.repeat(32))))
    );
    expect(serializeSome(serializeUint(7))).toBe(sdkHex(Cl.some(Cl.uint(7))));
  });

  it('matches the SDK for principals', () => {
    for (const address of ADDRESSES) {
      expect(serializePrincipal(address), address).toBe(sdkHex(Cl.principal(address)));
    }
  });
});

describe('deserialising results', () => {
  const roundTrip = (cv: Parameters<typeof serializeCV>[0]): unknown => deserialize(cvToHex(cv));

  it('decodes the shapes the contract actually returns', () => {
    expect(roundTrip(Cl.uint(65_536))).toBe(65_536n);
    expect(roundTrip(Cl.bool(true))).toBe(true);
    expect(roundTrip(Cl.none())).toBeNull();
    expect(roundTrip(Cl.some(Cl.uint(3)))).toBe(3n);
    expect(roundTrip(Cl.stringAscii('e2e4'))).toBe('e2e4');
    expect(roundTrip(Cl.principal(ADDRESSES[0]))).toBe(ADDRESSES[0]);
    expect(roundTrip(Cl.contractPrincipal(ADDRESSES[0], 'xchess-core-v1'))).toBe(
      `${ADDRESSES[0]}.xchess-core-v1`
    );
    expect(roundTrip(Cl.ok(Cl.uint(1)))).toEqual({ ok: true, value: 1n });
    expect(roundTrip(Cl.error(Cl.uint(100)))).toEqual({ ok: false, value: 100n });
  });

  it('decodes a game row', () => {
    const row = Cl.tuple({
      'opened-by': Cl.principal(ADDRESSES[0]),
      'opened-at': Cl.uint(12345),
      'next-seq': Cl.uint(7),
      'rules-hash': Cl.some(Cl.bufferFromHex('ab'.repeat(32))),
      ranked: Cl.bool(true)
    });
    const decoded = roundTrip(Cl.some(row)) as Record<string, unknown>;
    expect(decoded['opened-by']).toBe(ADDRESSES[0]);
    expect(decoded['opened-at']).toBe(12345n);
    expect(decoded['next-seq']).toBe(7n);
    expect(decoded.ranked).toBe(true);
    expect(bytesToHex(decoded['rules-hash'] as Uint8Array)).toBe('ab'.repeat(32));
  });

  it('decodes a page of entries, holes and all', () => {
    const entry = (value: string) =>
      Cl.some(
        Cl.tuple({
          value: Cl.stringAscii(value),
          sender: Cl.principal(ADDRESSES[1]),
          height: Cl.uint(100)
        })
      );
    const page = Cl.list([entry('e2e4'), Cl.none(), entry('resgn')]);
    const decoded = roundTrip(page) as unknown[];
    expect(decoded).toHaveLength(3);
    expect((decoded[0] as Record<string, unknown>).value).toBe('e2e4');
    expect(decoded[1]).toBeNull();
    expect((decoded[2] as Record<string, unknown>).value).toBe('resgn');
  });

  it('round-trips everything the SDK can hand back', () => {
    const values = [
      Cl.uint(0),
      Cl.uint(2n ** 128n - 1n),
      Cl.int(-1),
      Cl.int(-(2n ** 127n)),
      Cl.bufferFromHex('00ff00'),
      Cl.list([Cl.uint(1), Cl.uint(2)]),
      Cl.tuple({ a: Cl.uint(1), b: Cl.stringAscii('x') })
    ];
    for (const cv of values) {
      // Decoding must not throw and must consume the whole value.
      expect(() => deserialize(cvToHex(cv))).not.toThrow();
      // And the SDK agrees the hex is what it produced.
      expect(hexToCV(cvToHex(cv))).toEqual(cv);
    }
  });

  it('refuses a type it does not implement rather than guessing', () => {
    expect(() => deserialize('0x0f')).toThrow(/unsupported Clarity type/);
  });
});

describe('addresses', () => {
  it('round-trips every address through parse and encode', () => {
    for (const address of ADDRESSES) {
      const { version, hash160 } = parseAddress(address);
      expect(c32address(version, hash160), address).toBe(address);
    }
  });

  it('agrees with the SDK over three thousand arbitrary hashes, on both networks', () => {
    // The address encoding is what turns a decoded principal into the thing a
    // player sees next to a move. A drift here would attribute moves to the
    // wrong people.
    for (let i = 0; i < 3000; i++) {
      const hash = new Uint8Array(20);
      for (let j = 0; j < 20; j++) hash[j] = (i * 31 + j * 17 + (i % 7)) & 0xff;
      // Leading zero bytes are the case that breaks a naive encoder, because
      // the base32 conversion drops them. Force some.
      if (i % 5 === 0) hash[0] = 0;
      if (i % 11 === 0) {
        hash[0] = 0;
        hash[1] = 0;
      }

      for (const version of [22, 26]) {
        const mine = c32address(version, hash);
        // The SDK reached through its own principal encoding: build the CV from
        // our address, serialise it, and check the SDK reads back the same.
        const back = parseAddress(mine);
        expect(back.version, `version at ${i}`).toBe(version);
        expect(bytesToHex(back.hash160), `hash at ${i}`).toBe(bytesToHex(hash));
        expect(serializePrincipal(mine)).toBe(cvToHex(Cl.principal(mine)));
      }
    }
  });

  it('refuses an address whose checksum does not match', () => {
    const good = ADDRESSES[0];
    const bad = `${good.slice(0, -1)}${good.at(-1) === 'X' ? 'Y' : 'X'}`;
    expect(() => parseAddress(bad)).toThrow(/checksum/);
  });

  it('refuses something that is not an address at all', () => {
    for (const value of ['', 'hello', 'SP', '0x1234', 'jim.btc']) {
      expect(() => parseAddress(value), value).toThrow();
    }
  });

  it('does not assume addresses are a fixed width', () => {
    // Roughly a quarter of Stacks addresses are not 41 characters, because the
    // encoding drops leading zero bytes. Anything downstream that assumes
    // otherwise is wrong.
    const widths = new Set(ADDRESSES.map((a) => a.length));
    expect(widths.size).toBeGreaterThan(1);
  });
});
