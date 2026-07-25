import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';
import {
  COLLECTION_ERROR_CODES,
  collectionChainError,
  decodeCollectionInfo,
  decodeHashIndex,
  decodeItem,
  decodeSession,
  decodeUnassignedScan,
  decodeUploadState,
  decodeOptionalUint,
  decodeOkUint,
  encodeChunkList,
  encodeHash,
  encodeSealBatchItems,
  encodeUintList,
  expectOk
} from '../src/protocol/codecs.js';
import { XtrataClientError } from '../src/errors.js';
import { loadContractSource, parseErrorCodes } from './util/contract-source.js';

const HASH = 'ab'.repeat(32);
const OWNER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';

describe('encoders', () => {
  it('encodes a 32-byte hash and rejects wrong lengths', () => {
    expect(encodeHash(HASH)).toEqual(Cl.buffer(new Uint8Array(32).fill(0xab)));
    expect(() => encodeHash('abcd')).toThrow(XtrataClientError);
  });

  it('bounds chunk lists to 1..32 chunks of <= 16384 bytes', () => {
    expect(encodeChunkList([new Uint8Array([1])]).value).toHaveLength(1);
    expect(() => encodeChunkList([])).toThrow(/1\.\.32/);
    expect(() => encodeChunkList(Array.from({ length: 33 }, () => new Uint8Array([1])))).toThrow();
    expect(() => encodeChunkList([new Uint8Array(16385)])).toThrow(/invalid size/);
  });

  it('bounds uint lists and seal batches', () => {
    expect(encodeUintList([1, 2, 3]).value).toHaveLength(3);
    expect(() => encodeUintList(Array.from({ length: 51 }, (_, i) => i))).toThrow();
    expect(() => encodeSealBatchItems([])).toThrow(/1\.\.50/);
    const batch = encodeSealBatchItems([{ contentHashHex: HASH, tokenUri: 'ipfs://x' }]);
    expect(batch.value[0]!.value['token-uri']).toEqual(Cl.stringAscii('ipfs://x'));
  });
});

describe('decoders (round-trip)', () => {
  it('decodes a Sessions row', () => {
    const cv = Cl.some(
      Cl.tuple({
        index: Cl.uint(7),
        'phase-id': Cl.uint(2),
        price: Cl.uint(5000n),
        'created-at': Cl.uint(1234),
        'item-uri': Cl.some(Cl.stringAscii('ipfs://item'))
      })
    );
    expect(decodeSession(cv)).toEqual({
      index: 7,
      phaseId: 2,
      price: 5000n,
      createdAt: 1234,
      itemUri: 'ipfs://item'
    });
    expect(decodeSession(Cl.none())).toBeNull();
  });

  it('decodes an Items row', () => {
    const cv = Cl.some(
      Cl.tuple({
        'token-id': Cl.uint(42),
        'owner-at-mint': Cl.principal(OWNER),
        'phase-id': Cl.uint(0),
        'minted-at': Cl.uint(999),
        'content-hash': encodeHash(HASH)
      })
    );
    expect(decodeItem(cv)).toEqual({
      tokenId: 42,
      ownerAtMint: OWNER,
      phaseId: 0,
      mintedAt: 999,
      contentHashHex: HASH
    });
  });

  it('decodes HashIndex / optional uint / ok uint', () => {
    expect(decodeHashIndex(Cl.some(Cl.tuple({ index: Cl.uint(3) })))).toBe(3);
    expect(decodeHashIndex(Cl.none())).toBeNull();
    expect(decodeOptionalUint(Cl.some(Cl.uint(9)))).toBe(9);
    expect(decodeOkUint(Cl.ok(Cl.uint(17n)))).toBe(17n);
  });

  it('decodes get-collection-info with every field', () => {
    const cv = Cl.ok(
      Cl.tuple({
        name: Cl.stringAscii('My Coll'),
        symbol: Cl.stringAscii('MC'),
        description: Cl.stringAscii('desc'),
        'artwork-uri': Cl.stringAscii('a'),
        'base-uri': Cl.stringAscii('b'),
        owner: Cl.principal(OWNER),
        'operator-admin': Cl.principal(OWNER),
        'finance-admin': Cl.principal(OWNER),
        'supply-mode': Cl.uint(2),
        'max-supply': Cl.uint(0),
        'minted-count': Cl.uint(5),
        'reserved-count': Cl.uint(1),
        'next-index': Cl.uint(6),
        'free-count': Cl.uint(0),
        'mint-price': Cl.uint(1000n),
        'active-phase-id': Cl.uint(0),
        'reservation-expiry-blocks': Cl.uint(1440),
        paused: Cl.bool(true),
        finalized: Cl.bool(false),
        'drops-authority': Cl.none(),
        'core-contract': Cl.contractPrincipal(OWNER, 'core')
      })
    );
    const info = decodeCollectionInfo(cv);
    expect(info.mintedCount).toBe(5);
    expect(info.mintPrice).toBe(1000n);
    expect(info.reservationExpiryBlocks).toBe(1440);
    expect(info.paused).toBe(true);
    expect(info.dropsAuthority).toBeNull();
    expect(info.coreContract).toBe(`${OWNER}.core`);
  });

  it('decodes get-unassigned-scan entries', () => {
    const cv = Cl.ok(
      Cl.list([
        Cl.tuple({ index: Cl.uint(0), minted: Cl.bool(true), assigned: Cl.bool(false) }),
        Cl.tuple({ index: Cl.uint(1), minted: Cl.bool(false), assigned: Cl.bool(false) })
      ])
    );
    expect(decodeUnassignedScan(cv)).toEqual([
      { index: 0, minted: true, assigned: false },
      { index: 1, minted: false, assigned: false }
    ]);
  });

  it('decodes core upload state', () => {
    const cv = Cl.some(
      Cl.tuple({
        'mime-type': Cl.stringAscii('image/png'),
        'total-size': Cl.uint(100),
        'total-chunks': Cl.uint(4),
        'current-index': Cl.uint(2),
        'running-hash': encodeHash(HASH)
      })
    );
    expect(decodeUploadState(cv)).toEqual({
      mimeType: 'image/png',
      totalSize: 100,
      totalChunks: 4,
      currentIndex: 2,
      runningHashHex: HASH
    });
  });

  it('throws normalized internal errors on wrong shapes', () => {
    expect(() => decodeSession(Cl.uint(1))).toThrow(XtrataClientError);
    try {
      decodeItem(Cl.some(Cl.tuple({ nope: Cl.uint(1) })));
      expect.unreachable();
    } catch (e) {
      expect((e as XtrataClientError).code).toBe('internal');
    }
  });
});

describe('error-code mapping', () => {
  it('maps (err uNNN) responses onto chain-rejected with the header message', () => {
    try {
      expectOk(Cl.error(Cl.uint(105)));
      expect.unreachable();
    } catch (e) {
      const err = e as XtrataClientError;
      expect(err.code).toBe('chain-rejected');
      expect(err.chainErrorCode).toBe(105);
      expect(err.message).toContain('ERR-DUPLICATE-HASH');
      expect(err.retryable).toBe(false);
    }
  });

  it('covers every error constant in the deployed contract (drift guard)', () => {
    const fromContract = parseErrorCodes(loadContractSource('xtrata-collection-v3.clar'));
    expect(fromContract.size).toBe(26); // u100..u125
    for (const [code, name] of fromContract) {
      const message = COLLECTION_ERROR_CODES[code];
      expect(message, `missing mapping for u${code}`).toBeDefined();
      expect(message).toContain(name);
      expect(collectionChainError(code).message).toContain(name);
    }
    // No stale extras on the client side.
    for (const code of Object.keys(COLLECTION_ERROR_CODES).map(Number)) {
      expect(fromContract.has(code), `stale client mapping u${code}`).toBe(true);
    }
  });
});
