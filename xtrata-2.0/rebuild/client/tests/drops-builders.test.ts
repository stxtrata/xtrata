import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';
import {
  DropsTxBuilder,
  DROPS_ERROR_CODES,
  MIN_FEE_BUDGET,
  REFUND_DELAY,
  CLAIM_RESERVATION_EXPIRY,
  MAX_RANGES,
  MAX_ESCROW_BATCH,
  type DropsTxDescriptor
} from '../src/drops/client.js';
import { XtrataClientError } from '../src/errors.js';
import { loadContractSource, parseErrorCodes, parseFunctions } from './util/contract-source.js';

const SENDER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const DROPS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3';
const COLLECTION = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-v3';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const NFT_ASSET = `${CORE}::xtrata-inscription`;

const source = loadContractSource('xtrata-drops-v3.clar');
const contractFns = parseFunctions(source);

const builder = new DropsTxBuilder({
  dropsContractId: DROPS,
  collectionContractId: COLLECTION,
  nftContractId: CORE,
  network: 'mainnet',
  sender: SENDER
});

const assertAgainstContract = (tx: DropsTxDescriptor): void => {
  const fn = contractFns.get(tx.functionName);
  expect(fn, `function ${tx.functionName} not found in contract`).toBeDefined();
  expect(fn!.kind).toBe('public');
  expect(tx.functionArgs.length, `arity mismatch for ${tx.functionName}`).toBe(fn!.argCount);
  expect(tx.contractAddress).toBe('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
  expect(tx.contractName).toBe('xtrata-drops-v3');
  expect(tx.postConditionMode).toBe('deny');
  expect(tx.network).toBe('mainnet');
};

const senderStxCap = (tx: DropsTxDescriptor): bigint => {
  const pc = tx.postConditions[0]!;
  expect(pc.type).toBe('stx-postcondition');
  if (pc.type !== 'stx-postcondition') throw new Error('unreachable');
  expect(pc.condition).toBe('lte');
  expect(pc.address).toBe(SENDER);
  return BigInt(pc.amount);
};

describe('DropsTxBuilder — contract drift', () => {
  it('constants match the .clar source', () => {
    expect(source).toContain(`(define-constant MIN-FEE-BUDGET u${MIN_FEE_BUDGET})`);
    expect(source).toContain(`(define-constant REFUND-DELAY u${REFUND_DELAY})`);
    expect(source).toContain(`(define-constant RESERVATION-EXPIRY u${CLAIM_RESERVATION_EXPIRY})`);
    expect(source).toContain(`(define-constant MAX-RANGES u${MAX_RANGES})`);
    expect(source).toContain(`(define-constant MAX-ESCROW-BATCH u${MAX_ESCROW_BATCH})`);
  });

  it('error table mirrors the contract (u200–u231, names included in messages)', () => {
    const contractErrors = parseErrorCodes(source);
    expect(contractErrors.size).toBe(32);
    for (const [code, name] of contractErrors) {
      expect(code).toBeGreaterThanOrEqual(200);
      expect(code).toBeLessThanOrEqual(231);
      const message = DROPS_ERROR_CODES[code];
      expect(message, `no client message for u${code} ${name}`).toBeDefined();
      expect(message!.startsWith(name), `u${code}: '${message}' does not start with ${name}`).toBe(true);
    }
    expect(Object.keys(DROPS_ERROR_CODES)).toHaveLength(contractErrors.size);
  });

  it('every public contract function has a builder (coverage)', () => {
    const txs: DropsTxDescriptor[] = [
      builder.createDrop({
        mode: 'sponsored', eligibility: 'public',
        startBlock: 0, endBlock: 0, totalLimit: 0, perWalletLimit: 1
      }),
      builder.addInventoryRange(0, 0, 10),
      builder.addInventoryItems(0, [3, 5]),
      builder.escrowBatch(0, [{ index: 0, tokenId: 7 }]),
      builder.fundBudget(0, 1n),
      builder.activateDrop(0),
      builder.pauseDrop(0),
      builder.resumeDrop(0),
      builder.endDrop(0),
      builder.cancelDrop(0, 0n),
      builder.recoverBatch(0, [1], [9]),
      builder.claim(0),
      builder.claimSigned(0, 100, 'ab'.repeat(65)),
      builder.reserveClaim(0),
      builder.releaseExpiredClaim(0, SENDER),
      builder.setAllowlistEntry(0, SENDER, 2),
      builder.setAllowlistBatch(0, [{ wallet: SENDER, allowance: 1 }]),
      builder.claimFee(0, 1n),
      builder.settleRefund(0, 0n),
      builder.setSponsor(SENDER),
      builder.setAttestorPubkeyHash('aa'.repeat(20)),
      builder.setAttestorPubkeyHash(null),
      builder.setClaimFeeCap(1n),
      builder.setPaused(true),
      builder.initiateOwnershipTransfer(SENDER),
      builder.cancelOwnershipTransfer(),
      builder.acceptOwnership()
    ];
    const covered = new Set(txs.map((tx) => tx.functionName));
    for (const tx of txs) assertAgainstContract(tx);
    for (const [name, fn] of contractFns) {
      if (fn.kind !== 'public') continue;
      expect(covered.has(name), `public function ${name} has no builder coverage`).toBe(true);
    }
  });
});

describe('DropsTxBuilder — post-conditions', () => {
  it('fund-budget caps sender STX at the exact amount', () => {
    const tx = builder.fundBudget(4, 123_456n);
    expect(tx.postConditions).toHaveLength(1);
    expect(senderStxCap(tx)).toBe(123_456n);
    expect(tx.functionArgs).toEqual([Cl.uint(4), Cl.uint(123_456n)]);
  });

  it('escrow-batch: zero STX + one NFT send condition per escrowed token', () => {
    const tx = builder.escrowBatch(2, [
      { index: 10, tokenId: 100 },
      { index: 11, tokenId: 101 }
    ]);
    expect(senderStxCap(tx)).toBe(0n);
    const nftPcs = tx.postConditions.slice(1);
    expect(nftPcs).toHaveLength(2);
    for (const [i, pc] of nftPcs.entries()) {
      expect(pc.type).toBe('nft-postcondition');
      if (pc.type !== 'nft-postcondition') throw new Error('unreachable');
      expect(pc.address).toBe(SENDER);
      expect(pc.condition).toBe('sent');
      expect(pc.asset).toBe(NFT_ASSET);
      expect(pc.assetId).toEqual(Cl.uint(100 + i));
    }
  });

  it('claim: zero STX from claimer + inbound NFT allowance descriptor', () => {
    const tx = builder.claim(1);
    expect(tx.postConditions).toHaveLength(1);
    expect(senderStxCap(tx)).toBe(0n);
    expect(tx.expectedInbound).toEqual([{ assetId: NFT_ASSET, count: 1 }]);
  });

  it('claim with a known token id pins a contract-outbound NFT condition', () => {
    const tx = builder.claim(1, { expectedTokenId: 42 });
    expect(tx.postConditions).toHaveLength(2);
    const pc = tx.postConditions[1]!;
    expect(pc.type).toBe('nft-postcondition');
    if (pc.type !== 'nft-postcondition') throw new Error('unreachable');
    expect(pc.address).toBe(DROPS);
    expect(pc.assetId).toEqual(Cl.uint(42));
    expect(tx.expectedInbound).toEqual([{ assetId: NFT_ASSET, count: 1, tokenId: 42 }]);
  });

  it('claim-signed carries the 65-byte signature and the same claim conditions', () => {
    const sig = '11'.repeat(65);
    const tx = builder.claimSigned(3, 500, sig, { expectedTokenId: 7 });
    expect(tx.functionArgs[0]).toEqual(Cl.uint(3));
    expect(tx.functionArgs[1]).toEqual(Cl.uint(500));
    expect(tx.functionArgs[2]).toEqual(Cl.bufferFromHex(sig));
    expect(senderStxCap(tx)).toBe(0n);
    expect(tx.postConditions).toHaveLength(2);
    expect(tx.expectedInbound?.[0]?.tokenId).toBe(7);
  });

  it('claim-fee / settle-refund / cancel-drop cap the contract-outbound STX', () => {
    for (const [tx, cap] of [
      [builder.claimFee(0, 2_000n), 2_000n],
      [builder.settleRefund(0, 9_999n), 9_999n],
      [builder.cancelDrop(0, 55n), 55n]
    ] as const) {
      expect(senderStxCap(tx)).toBe(0n);
      const pc = tx.postConditions[1]!;
      expect(pc.type).toBe('stx-postcondition');
      if (pc.type !== 'stx-postcondition') throw new Error('unreachable');
      expect(pc.address).toBe(DROPS);
      expect(pc.condition).toBe('lte');
      expect(BigInt(pc.amount)).toBe(cap);
    }
  });

  it('recover-batch: contract-outbound NFT condition per escrowed token id', () => {
    const tx = builder.recoverBatch(5, [1, 2, 3], [20, 30]);
    expect(senderStxCap(tx)).toBe(0n);
    const nftPcs = tx.postConditions.slice(1);
    expect(nftPcs).toHaveLength(2);
    for (const pc of nftPcs) {
      expect(pc.type).toBe('nft-postcondition');
      if (pc.type !== 'nft-postcondition') throw new Error('unreachable');
      expect(pc.address).toBe(DROPS);
      expect(pc.asset).toBe(NFT_ASSET);
    }
  });

  it('admin + lifecycle builders spend nothing', () => {
    for (const tx of [
      builder.createDrop({ mode: 'zero-price', eligibility: 'allowlist', startBlock: 1, endBlock: 2, totalLimit: 3, perWalletLimit: 4 }),
      builder.addInventoryRange(0, 0, 1),
      builder.addInventoryItems(0, [1]),
      builder.activateDrop(0),
      builder.pauseDrop(0),
      builder.resumeDrop(0),
      builder.endDrop(0),
      builder.reserveClaim(0),
      builder.releaseExpiredClaim(0, SENDER),
      builder.setAllowlistEntry(0, SENDER, 1),
      builder.setAllowlistBatch(0, [{ wallet: SENDER, allowance: 1 }]),
      builder.setSponsor(SENDER),
      builder.setAttestorPubkeyHash(null),
      builder.setClaimFeeCap(0n),
      builder.setPaused(false),
      builder.initiateOwnershipTransfer(SENDER),
      builder.cancelOwnershipTransfer(),
      builder.acceptOwnership()
    ]) {
      expect(tx.postConditions).toHaveLength(1);
      expect(senderStxCap(tx)).toBe(0n);
    }
  });
});

describe('DropsTxBuilder — encoding + validation', () => {
  it('create-drop maps mode/eligibility names onto the contract constants', () => {
    const tx = builder.createDrop({
      mode: 'sponsored', eligibility: 'signed',
      startBlock: 10, endBlock: 20, totalLimit: 5, perWalletLimit: 1
    });
    expect(tx.functionArgs[0]).toEqual(
      Cl.contractPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', 'xtrata-collection-v3')
    );
    expect(tx.functionArgs.slice(1)).toEqual([
      Cl.uint(3), Cl.uint(3), Cl.uint(10), Cl.uint(20), Cl.uint(5), Cl.uint(1)
    ]);
  });

  it('escrow-batch encodes {index, token-id} tuples', () => {
    const tx = builder.escrowBatch(1, [{ index: 4, tokenId: 44 }]);
    expect(tx.functionArgs[1]).toEqual(
      Cl.list([Cl.tuple({ index: Cl.uint(4), 'token-id': Cl.uint(44) })])
    );
  });

  it('rejects invalid payloads', () => {
    expect(() => builder.createDrop({ mode: 'sponsored', eligibility: 'public', startBlock: 5, endBlock: 4, totalLimit: 0, perWalletLimit: 0 })).toThrow(XtrataClientError);
    expect(() => builder.addInventoryRange(0, 5, 5)).toThrow(/must be </);
    expect(() => builder.addInventoryItems(0, [])).toThrow(XtrataClientError);
    expect(() => builder.addInventoryItems(0, Array.from({ length: 51 }, (_, i) => i))).toThrow(XtrataClientError);
    expect(() => builder.escrowBatch(0, [])).toThrow(XtrataClientError);
    expect(() => builder.escrowBatch(0, Array.from({ length: 26 }, (_, i) => ({ index: i, tokenId: i })))).toThrow(XtrataClientError);
    expect(() => builder.fundBudget(0, 0n)).toThrow(XtrataClientError);
    expect(() => builder.recoverBatch(0, [], [])).toThrow(XtrataClientError);
    expect(() => builder.recoverBatch(0, [1], [2, 3])).toThrow(XtrataClientError);
    expect(() => builder.claimSigned(0, 1, 'ab'.repeat(64))).toThrow(/65 bytes/);
    expect(() => builder.setAttestorPubkeyHash('aa'.repeat(19))).toThrow(/20 bytes/);
    expect(() => builder.setAllowlistBatch(0, [])).toThrow(XtrataClientError);
    expect(() => builder.claimFee(0, 0n)).toThrow(XtrataClientError);
  });

  it('rejects wrong-network configuration up front', () => {
    expect(
      () =>
        new DropsTxBuilder({
          dropsContractId: DROPS,
          collectionContractId: COLLECTION,
          nftContractId: CORE,
          network: 'testnet',
          sender: SENDER
        })
    ).toThrow(/wrong network/);
  });
});
