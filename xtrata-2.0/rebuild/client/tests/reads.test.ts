import { describe, expect, it } from 'vitest';
import { Cl, type ClarityValue } from '@stacks/transactions';
import { CollectionReads, type ReadOnlyTransport } from '../src/collection/reads.js';
import { loadContractSource, parseFunctions } from './util/contract-source.js';

const OWNER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const COLLECTION = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-v3';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const HASH = 'ee'.repeat(32);

const collectionFns = parseFunctions(loadContractSource('xtrata-collection-v3.clar'));
const coreFns = parseFunctions(loadContractSource('mock-xtrata-core.clar'));

interface Call {
  contractId: string;
  fn: string;
  args: ClarityValue[];
}

const infoTuple = (overrides: Record<string, ClarityValue> = {}): ClarityValue =>
  Cl.ok(
    Cl.tuple({
      name: Cl.stringAscii(''),
      symbol: Cl.stringAscii(''),
      description: Cl.stringAscii(''),
      'artwork-uri': Cl.stringAscii(''),
      'base-uri': Cl.stringAscii(''),
      owner: Cl.principal(OWNER),
      'operator-admin': Cl.principal(OWNER),
      'finance-admin': Cl.principal(OWNER),
      'supply-mode': Cl.uint(2),
      'max-supply': Cl.uint(0),
      'minted-count': Cl.uint(0),
      'reserved-count': Cl.uint(0),
      'next-index': Cl.uint(0),
      'free-count': Cl.uint(0),
      'mint-price': Cl.uint(0),
      'active-phase-id': Cl.uint(0),
      'reservation-expiry-blocks': Cl.uint(100),
      paused: Cl.bool(false),
      finalized: Cl.bool(false),
      'drops-authority': Cl.none(),
      'core-contract': Cl.contractPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', 'xtrata-v3-2-3'),
      ...overrides
    })
  );

/** Fake transport: scripted responses keyed by function name + drift check. */
const makeFake = (
  responses: Record<string, ClarityValue>
): { transport: ReadOnlyTransport; calls: Call[] } => {
  const calls: Call[] = [];
  const transport: ReadOnlyTransport = async (contractId, fn, args) => {
    calls.push({ contractId, fn, args });
    const fns = contractId === CORE ? coreFns : collectionFns;
    const sig = fns.get(fn);
    if (sig === undefined || sig.kind !== 'read-only') {
      throw new Error(`fake transport: ${fn} is not a read-only on ${contractId}`);
    }
    if (args.length !== sig.argCount) {
      throw new Error(`fake transport: arity mismatch for ${fn}: ${args.length} != ${sig.argCount}`);
    }
    const response = responses[fn];
    if (response === undefined) throw new Error(`fake transport: no scripted response for ${fn}`);
    return response;
  };
  return { transport, calls };
};

const makeReads = (responses: Record<string, ClarityValue>, height = 0) => {
  const fake = makeFake(responses);
  const reads = new CollectionReads({
    collectionContractId: COLLECTION,
    coreContractId: CORE,
    transport: fake.transport,
    getBlockHeight: async () => height
  });
  return { reads, calls: fake.calls };
};

describe('CollectionReads', () => {
  it('typed getters decode scripted responses (and pass drift check)', async () => {
    const { reads } = makeReads({
      'get-collection-info': infoTuple({ 'minted-count': Cl.uint(3) }),
      'get-session': Cl.none(),
      'get-item': Cl.none(),
      'get-items': Cl.ok(Cl.list([Cl.none()])),
      'get-hash-index': Cl.some(Cl.tuple({ index: Cl.uint(5) })),
      'get-assignment': Cl.none(),
      'get-unassigned-scan': Cl.ok(Cl.list([])),
      'get-phase': Cl.none(),
      'get-phase-stats': Cl.ok(Cl.tuple({ minted: Cl.uint(1), reserved: Cl.uint(2) })),
      'get-wallet-stats': Cl.ok(Cl.tuple({ minted: Cl.uint(0), reserved: Cl.uint(0) })),
      'get-phase-wallet-stats': Cl.ok(Cl.tuple({ minted: Cl.uint(0), reserved: Cl.uint(0) })),
      'get-free-count': Cl.ok(Cl.uint(4)),
      'get-default-dependencies': Cl.ok(Cl.list([Cl.uint(107)])),
      'get-registered-token-uri': Cl.some(Cl.tuple({ 'token-uri': Cl.stringAscii('u') })),
      'get-upload-state': Cl.none(),
      'get-id-by-hash': Cl.some(Cl.uint(42))
    });
    expect((await reads.getCollectionInfo()).mintedCount).toBe(3);
    expect(await reads.getSession(OWNER, HASH)).toBeNull();
    expect(await reads.getItem(0)).toBeNull();
    expect(await reads.getItems([0])).toEqual([null]);
    expect(await reads.getHashIndex(HASH)).toBe(5);
    expect(await reads.getAssignment(0)).toBeNull();
    expect(await reads.getUnassignedScan(0)).toEqual([]);
    expect(await reads.getPhase(1)).toBeNull();
    expect(await reads.getPhaseStats(1)).toEqual({ minted: 1, reserved: 2 });
    expect(await reads.getWalletStats(OWNER)).toEqual({ minted: 0, reserved: 0 });
    expect(await reads.getPhaseWalletStats(1, OWNER)).toEqual({ minted: 0, reserved: 0 });
    expect(await reads.getFreeCount()).toBe(4);
    expect(await reads.getDefaultDependencies()).toEqual([107]);
    expect(await reads.getRegisteredTokenUri(HASH)).toBe('u');
    expect(await reads.getUploadState(OWNER, HASH)).toBeNull();
    expect(await reads.getCoreIdByHash(HASH)).toBe(42);
  });

  it('observeItem: fresh item — nothing on chain', async () => {
    const { reads } = makeReads({
      'get-collection-info': infoTuple(),
      'get-session': Cl.none(),
      'get-hash-index': Cl.none(),
      'get-upload-state': Cl.none(),
      'get-id-by-hash': Cl.none()
    });
    expect(await reads.observeItem(OWNER, HASH)).toEqual({ sessionExists: false });
  });

  it('observeItem: own reservation is not reported as terminal hashIndexedAt', async () => {
    const session = Cl.some(
      Cl.tuple({
        index: Cl.uint(3),
        'phase-id': Cl.uint(0),
        price: Cl.uint(0),
        'created-at': Cl.uint(10),
        'item-uri': Cl.none()
      })
    );
    const { reads } = makeReads(
      {
        'get-collection-info': infoTuple(),
        'get-session': session,
        'get-hash-index': Cl.some(Cl.tuple({ index: Cl.uint(3) })),
        'get-item': Cl.none(), // reserved, not yet minted
        'get-upload-state': Cl.none(),
        'get-id-by-hash': Cl.none()
      },
      50 // height 50 < createdAt 10 + expiry 100
    );
    const obs = await reads.observeItem(OWNER, HASH);
    expect(obs.sessionExists).toBe(true);
    expect(obs.sessionIndex).toBe(3);
    expect(obs.sessionExpired).toBe(false);
    expect(obs.hashIndexedAt).toBeUndefined();
    expect(obs.itemIndexedAt).toBeUndefined();
  });

  it('observeItem: expired session + upload state assembly', async () => {
    const session = Cl.some(
      Cl.tuple({
        index: Cl.uint(3),
        'phase-id': Cl.uint(0),
        price: Cl.uint(0),
        'created-at': Cl.uint(10),
        'item-uri': Cl.none()
      })
    );
    const { reads } = makeReads(
      {
        'get-collection-info': infoTuple(),
        'get-session': session,
        'get-hash-index': Cl.some(Cl.tuple({ index: Cl.uint(3) })),
        'get-item': Cl.none(),
        'get-upload-state': Cl.some(
          Cl.tuple({
            'mime-type': Cl.stringAscii('a/b'),
            'total-size': Cl.uint(10),
            'total-chunks': Cl.uint(4),
            'current-index': Cl.uint(2),
            'running-hash': Cl.bufferFromHex('ff'.repeat(32))
          })
        ),
        'get-id-by-hash': Cl.none()
      },
      200 // 200 >= 10 + 100 → expired
    );
    const obs = await reads.observeItem(OWNER, HASH);
    expect(obs.sessionExpired).toBe(true);
    expect(obs.uploadState).toEqual({ currentIndex: 2, totalChunks: 4, runningHashHex: 'ff'.repeat(32) });
  });

  it('observeItem: minted item is terminal (itemIndexedAt + hashIndexedAt + sealedTokenId)', async () => {
    const { reads } = makeReads({
      'get-collection-info': infoTuple(),
      'get-session': Cl.none(),
      'get-hash-index': Cl.some(Cl.tuple({ index: Cl.uint(7) })),
      'get-item': Cl.some(
        Cl.tuple({
          'token-id': Cl.uint(9),
          'owner-at-mint': Cl.principal(OWNER),
          'phase-id': Cl.uint(0),
          'minted-at': Cl.uint(123),
          'content-hash': Cl.bufferFromHex(HASH)
        })
      ),
      'get-upload-state': Cl.none(),
      'get-id-by-hash': Cl.some(Cl.uint(9))
    });
    const obs = await reads.observeItem(OWNER, HASH);
    expect(obs.hashIndexedAt).toBe(7);
    expect(obs.itemIndexedAt).toBe(123);
    expect(obs.sealedTokenId).toBe(9);
  });
});
