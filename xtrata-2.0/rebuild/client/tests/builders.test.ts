import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';
import { CollectionTxBuilder, type TxDescriptor } from '../src/collection/client.js';
import { flatFeeSchedule } from '../src/planner.js';
import { XtrataClientError } from '../src/errors.js';
import { loadContractSource, parseFunctions } from './util/contract-source.js';

const SENDER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const COLLECTION = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-v3';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const HASH = 'cd'.repeat(32);

const fees = flatFeeSchedule({
  beginFee: 1000n,
  perChunkFee: 10n,
  sealBaseFee: 500n,
  mintPrice: 250_000n
});

const builder = new CollectionTxBuilder({
  collectionContractId: COLLECTION,
  coreContractId: CORE,
  network: 'mainnet',
  sender: SENDER,
  fees
});

const contractFns = parseFunctions(loadContractSource('xtrata-collection-v3.clar'));

/** The descriptor must target a real public function with the right arity. */
const assertAgainstContract = (tx: TxDescriptor): void => {
  const fn = contractFns.get(tx.functionName);
  expect(fn, `function ${tx.functionName} not found in contract`).toBeDefined();
  expect(fn!.kind).toBe('public');
  expect(tx.functionArgs.length, `arity mismatch for ${tx.functionName}`).toBe(fn!.argCount);
  expect(tx.contractAddress).toBe('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
  expect(tx.contractName).toBe('xtrata-collection-v3');
  expect(tx.postConditionMode).toBe('deny');
  expect(tx.network).toBe('mainnet');
};

const stxCap = (tx: TxDescriptor): bigint => {
  expect(tx.postConditions).toHaveLength(1);
  const pc = tx.postConditions[0]!;
  expect(pc.type).toBe('stx-postcondition');
  expect(pc.condition).toBe('lte');
  expect(pc.address).toBe(SENDER);
  return BigInt(pc.amount);
};

describe('CollectionTxBuilder — lifecycle', () => {
  it('reserve', () => {
    const tx = builder.reserve({ contentHashHex: HASH, itemUri: 'ipfs://x' });
    assertAgainstContract(tx);
    expect(tx.functionArgs[0]).toEqual(Cl.bufferFromHex(HASH));
    expect(tx.functionArgs[1]).toEqual(Cl.some(Cl.stringAscii('ipfs://x')));
    expect(stxCap(tx)).toBe(0n); // no payment at reserve — payment is at seal
    const noUri = builder.reserve({ contentHashHex: HASH });
    expect(noUri.functionArgs[1]).toEqual(Cl.none());
  });

  it('mint-begin caps spend at the core begin fee and passes the pinned core trait', () => {
    const tx = builder.mintBegin({
      contentHashHex: HASH,
      mimeType: 'image/png',
      totalSize: 100_000,
      totalChunks: 7
    });
    assertAgainstContract(tx);
    expect(tx.functionArgs[0]).toEqual(
      Cl.contractPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', 'xtrata-v3-2-3')
    );
    expect(tx.functionArgs[2]).toEqual(Cl.stringAscii('image/png'));
    expect(tx.functionArgs[3]).toEqual(Cl.uint(100_000));
    expect(tx.functionArgs[4]).toEqual(Cl.uint(7));
    expect(stxCap(tx)).toBe(1000n);
  });

  it('mint-add-chunk-batch encodes the chunk list', () => {
    const chunks = [new Uint8Array([1, 2]), new Uint8Array([3])];
    const tx = builder.mintAddChunkBatch({ contentHashHex: HASH, chunks });
    assertAgainstContract(tx);
    expect(tx.functionArgs[2]).toEqual(Cl.list([Cl.buffer(chunks[0]!), Cl.buffer(chunks[1]!)]));
    expect(stxCap(tx)).toBe(20n); // 2 chunks * 10
  });

  it('mint-seal caps spend at seal fee + mint price', () => {
    const tx = builder.mintSeal({ contentHashHex: HASH, tokenUri: 'ipfs://t', chunkCount: 4 });
    assertAgainstContract(tx);
    expect(tx.functionArgs[2]).toEqual(Cl.stringAscii('ipfs://t'));
    expect(stxCap(tx)).toBe(500n + 250_000n);
  });

  it('mint-seal-batch sums the per-item caps', () => {
    const tx = builder.mintSealBatch({
      items: [
        { contentHashHex: 'aa'.repeat(32), tokenUri: 'a', chunkCount: 1 },
        { contentHashHex: 'bb'.repeat(32), chunkCount: 2 }
      ]
    });
    assertAgainstContract(tx);
    expect(stxCap(tx)).toBe(2n * (500n + 250_000n));
    const items = (tx.functionArgs[1] as { value: { value: Record<string, unknown> }[] }).value;
    expect(items).toHaveLength(2);
  });

  it('mint-small-single-tx picks the recursive variant only with dependencies', () => {
    const chunks = [new Uint8Array([9])];
    const plain = builder.mintSmallSingleTx({
      contentHashHex: HASH,
      mimeType: 'text/plain',
      totalSize: 1,
      chunks
    });
    assertAgainstContract(plain);
    expect(plain.functionName).toBe('mint-small-single-tx');
    expect(stxCap(plain)).toBe(1000n + 10n + 500n + 250_000n);

    const recursive = builder.mintSmallSingleTx({
      contentHashHex: HASH,
      mimeType: 'text/plain',
      totalSize: 1,
      chunks,
      dependencies: [107]
    });
    assertAgainstContract(recursive);
    expect(recursive.functionName).toBe('mint-small-single-tx-recursive');
    expect(recursive.functionArgs[6]).toEqual(Cl.list([Cl.uint(107)]));
  });

  it('cancel / release-expired / release-reservation / close-supply / finalize', () => {
    for (const tx of [
      builder.cancelReservation(HASH),
      builder.releaseExpiredReservation(SENDER, HASH),
      builder.releaseReservation(SENDER, HASH),
      builder.closeSupply(),
      builder.finalize()
    ]) {
      assertAgainstContract(tx);
      expect(stxCap(tx)).toBe(0n);
    }
  });
});

describe('CollectionTxBuilder — admin entrypoints', () => {
  it('every admin builder targets a real contract function with matching arity', () => {
    const txs: TxDescriptor[] = [
      builder.setOperatorAdmin(SENDER),
      builder.setFinanceAdmin(SENDER),
      builder.initiateOwnershipTransfer(SENDER),
      builder.cancelOwnershipTransfer(),
      builder.acceptOwnership(),
      builder.setCollectionMetadata({ name: 'n', symbol: 's', description: 'd', artworkUri: 'a', baseUri: 'b' }),
      builder.setReservationExpiryBlocks(144),
      builder.setDefaultTokenUri('u'),
      builder.setDefaultDependencies([1, 2]),
      builder.setRegisteredTokenUri(HASH, 'u'),
      builder.clearRegisteredTokenUri(HASH),
      builder.setRegisteredTokenUriBatch([{ contentHashHex: HASH, tokenUri: 'u' }]),
      builder.setSupplyMode(1, 100),
      builder.setPhase({
        phaseId: 1, enabled: true, startBlock: 0, endBlock: 0,
        mintPrice: 1n, maxPerWallet: 2, maxSupply: 10, allowlistMode: 1
      }),
      builder.clearPhase(1),
      builder.setActivePhase(1),
      builder.setAllowlistEnabled(true),
      builder.setMaxPerWallet(3),
      builder.setAllowlist(SENDER, 2),
      builder.clearAllowlist(SENDER),
      builder.setAllowlistBatch([{ owner: SENDER, allowance: 1 }]),
      builder.setPhaseAllowlist(1, SENDER, 2),
      builder.clearPhaseAllowlist(1, SENDER),
      builder.setPhaseAllowlistBatch(1, [{ owner: SENDER, allowance: 1 }]),
      builder.setMintPrice(9n),
      builder.setRecipients(SENDER, SENDER, SENDER),
      builder.setSplits(100, 200, 300),
      builder.setPaused(false),
      builder.setDropsAuthority(SENDER),
      builder.setDropsAuthority(null)
    ];
    for (const tx of txs) {
      assertAgainstContract(tx);
      expect(stxCap(tx)).toBe(0n);
    }
  });

  it('leaves no public mint/reserve/admin contract function without a builder', () => {
    const covered = new Set([
      'reserve', 'cancel-reservation', 'release-expired-reservation', 'release-reservation',
      'mint-begin', 'mint-add-chunk-batch', 'mint-seal', 'mint-seal-batch',
      'mint-small-single-tx', 'mint-small-single-tx-recursive',
      'set-operator-admin', 'set-finance-admin', 'initiate-contract-ownership-transfer',
      'cancel-contract-ownership-transfer', 'accept-contract-ownership',
      'set-collection-metadata', 'set-reservation-expiry-blocks', 'set-default-token-uri',
      'set-default-dependencies', 'set-registered-token-uri', 'clear-registered-token-uri',
      'set-registered-token-uri-batch', 'set-supply-mode', 'close-supply',
      'set-phase', 'clear-phase', 'set-active-phase', 'set-allowlist-enabled',
      'set-max-per-wallet', 'set-allowlist', 'clear-allowlist', 'set-allowlist-batch',
      'set-phase-allowlist', 'clear-phase-allowlist', 'set-phase-allowlist-batch',
      'set-mint-price', 'set-recipients', 'set-splits', 'set-paused',
      'set-drops-authority', 'finalize'
    ]);
    for (const [name, fn] of contractFns) {
      if (fn.kind !== 'public') continue;
      // Drops-authority entrypoints (assign-*/unassign-*) are called by the
      // drops contract via contract-caller, not by this client.
      if (name.startsWith('assign-') || name.startsWith('unassign-')) continue;
      expect(covered.has(name), `public function ${name} has no builder coverage`).toBe(true);
    }
  });
});

describe('CollectionTxBuilder — validation', () => {
  it('rejects wrong-network configuration up front', () => {
    expect(
      () =>
        new CollectionTxBuilder({
          collectionContractId: COLLECTION,
          coreContractId: CORE,
          network: 'testnet',
          sender: SENDER,
          fees
        })
    ).toThrow(/wrong network/);
  });

  it('rejects invalid payloads', () => {
    expect(() => builder.mintBegin({ contentHashHex: HASH, mimeType: 'x', totalSize: 1, totalChunks: 0 })).toThrow(XtrataClientError);
    expect(() => builder.mintAddChunkBatch({ contentHashHex: HASH, chunks: [] })).toThrow(XtrataClientError);
    expect(() => builder.mintSealBatch({ items: [] })).toThrow(XtrataClientError);
    expect(() =>
      builder.mintSmallSingleTx({
        contentHashHex: HASH,
        mimeType: 'x',
        totalSize: 20_000,
        chunks: [new Uint8Array(1)]
      })
    ).toThrow(/totalSize/);
    expect(() => builder.setRegisteredTokenUriBatch([])).toThrow(XtrataClientError);
  });
});
