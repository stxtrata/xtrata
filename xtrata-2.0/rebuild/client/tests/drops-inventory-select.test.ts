import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';
import { DropsTxBuilder, MIN_FEE_BUDGET } from '../src/drops/client.js';
import {
  coalesceIndexes,
  planEscrowTxs,
  planInventoryTxs,
  selectAllUnassigned,
  selectExplicit,
  selectRange,
  selectWholeCollection,
  selectionCount,
  sponsorExposure,
  type UnassignedScanReads
} from '../src/drops/inventory-select.js';
import type { ScanEntry } from '../src/protocol/codecs.js';
import { XtrataClientError } from '../src/errors.js';
import { loadContractSource } from './util/contract-source.js';

const SENDER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const builder = new DropsTxBuilder({
  dropsContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3',
  collectionContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-v3',
  nftContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  network: 'mainnet',
  sender: SENDER
});

/** Fake paginated scan over a fixed assignment map (page size 50, like the contract). */
const fakeScanReads = (nextIndex: number, assigned: Set<number>, unminted = new Set<number>()): UnassignedScanReads => ({
  getCollectionInfo: async () => ({ nextIndex }),
  getUnassignedScan: async (start: number): Promise<ScanEntry[]> => {
    const out: ScanEntry[] = [];
    for (let i = start; i < Math.min(start + 50, nextIndex); i += 1) {
      out.push({ index: i, minted: !unminted.has(i), assigned: assigned.has(i) });
    }
    return out;
  }
});

describe('selection constructors', () => {
  it('selectWholeCollection covers [0, minted)', () => {
    expect(selectWholeCollection({ mintedCount: 120 })).toEqual({
      ranges: [{ start: 0, end: 120 }],
      explicit: []
    });
    expect(() => selectWholeCollection({ mintedCount: 0 })).toThrow(XtrataClientError);
  });

  it('selectRange validates bounds', () => {
    expect(selectRange(5, 9)).toEqual({ ranges: [{ start: 5, end: 9 }], explicit: [] });
    expect(() => selectRange(9, 9)).toThrow(XtrataClientError);
    expect(() => selectRange(-1, 3)).toThrow(XtrataClientError);
  });

  it('selectExplicit rejects duplicates and junk', () => {
    expect(selectExplicit([7, 3, 11])).toEqual({ ranges: [], explicit: [7, 3, 11] });
    expect(() => selectExplicit([])).toThrow(XtrataClientError);
    expect(() => selectExplicit([1, 1])).toThrow(/duplicate/);
    expect(() => selectExplicit([1.5])).toThrow(XtrataClientError);
  });
});

describe('selectAllUnassigned — fragmented assignment map', () => {
  it('coalesces consecutive unassigned runs into ranges, singletons into explicit', async () => {
    // 100 minted items; scattered assigned ones fragment the space:
    // assigned: 10..19, 40, 42, 44, 97..99  -> unassigned runs:
    //   [0,10) range, [20,40) range, {41}, {43}, [45,97) range
    const assigned = new Set<number>([...Array.from({ length: 10 }, (_, i) => 10 + i), 40, 42, 44, 97, 98, 99]);
    const selection = await selectAllUnassigned(fakeScanReads(100, assigned));
    expect(selection.ranges).toEqual([
      { start: 0, end: 10 },
      { start: 20, end: 40 },
      { start: 45, end: 97 }
    ]);
    expect(selection.explicit).toEqual([41, 43]);
    expect(selectionCount(selection)).toBe(100 - assigned.size);
  });

  it('skips unminted (reserved-gap) indexes and spans page boundaries', async () => {
    // Run 30..70 crosses the 50-boundary; 49 unminted splits it.
    const assigned = new Set<number>(Array.from({ length: 120 }, (_, i) => i).filter((i) => i < 30 || i >= 70));
    const selection = await selectAllUnassigned(fakeScanReads(120, assigned, new Set([49])));
    expect(selection.ranges).toEqual([
      { start: 30, end: 49 },
      { start: 50, end: 70 }
    ]);
    expect(selection.explicit).toEqual([]);
  });

  it('throws when nothing is selectable', async () => {
    await expect(selectAllUnassigned(fakeScanReads(3, new Set([0, 1, 2])))).rejects.toThrow(
      /no unassigned/
    );
  });

  it('coalesceIndexes handles leading/trailing singletons', () => {
    expect(coalesceIndexes([0, 2, 3, 4, 9])).toEqual({
      ranges: [{ start: 2, end: 5 }],
      explicit: [0, 9]
    });
  });
});

describe('planInventoryTxs / planEscrowTxs — tx bounding', () => {
  it('splits wide ranges at the 50-index call bound + explicit chunks of 50', () => {
    const explicit = Array.from({ length: 120 }, (_, i) => i * 3 + 1000);
    const txs = planInventoryTxs(builder, 6, {
      ranges: [
        { start: 0, end: 500 },
        { start: 600, end: 610 }
      ],
      explicit
    });
    // The collection's assign-range-to-drop caps a call at 50 indexes, so
    // [0,500) is 10 transactions, not 1.
    expect(txs).toHaveLength(10 + 1 + 3); // split ranges + narrow range + ceil(120/50)
    expect(txs[0]!.functionName).toBe('add-inventory-range');
    expect(txs[0]!.functionArgs.slice(1)).toEqual([Cl.uint(6), Cl.uint(0), Cl.uint(50)]);
    expect(txs[9]!.functionArgs.slice(1)).toEqual([Cl.uint(6), Cl.uint(450), Cl.uint(500)]);
    expect(txs[10]!.functionArgs.slice(1)).toEqual([Cl.uint(6), Cl.uint(600), Cl.uint(610)]);
    const itemTxs = txs.slice(11);
    expect(itemTxs.map((tx) => tx.functionName)).toEqual([
      'add-inventory-items', 'add-inventory-items', 'add-inventory-items'
    ]);
    const sizes = itemTxs.map((tx) => (tx.functionArgs[2] as { value: unknown[] }).value.length);
    expect(sizes).toEqual([50, 50, 20]);
  });

  it('whole-collection selection of 100 items plans two legal range calls', () => {
    // The brief's flagship case. Before range splitting this produced a single
    // add-inventory-range(0,100) that the collection rejects with u107.
    const txs = planInventoryTxs(builder, 7, selectWholeCollection({ mintedCount: 100 }));
    expect(txs).toHaveLength(2);
    expect(txs.map((tx) => tx.functionArgs.slice(2))).toEqual([
      [Cl.uint(0), Cl.uint(50)],
      [Cl.uint(50), Cl.uint(100)]
    ]);
  });

  it('rejects a selection whose split segments exceed the 25-range slot cap', () => {
    // 25 slots x 50 indexes = 1250 items is the range-based ceiling.
    expect(() => planInventoryTxs(builder, 8, selectWholeCollection({ mintedCount: 1250 }))).not.toThrow();
    expect(() => planInventoryTxs(builder, 8, selectWholeCollection({ mintedCount: 1251 }))).toThrow(
      /26 range segments/
    );
  });

  it('the builder itself refuses an over-wide range', () => {
    expect(() => builder.addInventoryRange(9, 0, 51)).toThrow(/spans 51 indexes/);
    expect(() => builder.addInventoryRange(9, 0, 50)).not.toThrow();
  });

  it('enforces the contract 25-range cap and rejects empty selections', () => {
    const tooMany = Array.from({ length: 26 }, (_, i) => ({ start: i * 10, end: i * 10 + 2 }));
    expect(() => planInventoryTxs(builder, 0, { ranges: tooMany, explicit: [] })).toThrow(/25/);
    expect(() => planInventoryTxs(builder, 0, { ranges: [], explicit: [] })).toThrow(XtrataClientError);
  });

  it('planEscrowTxs emits ceil(n/25) escrow-batch descriptors with paired token ids', () => {
    const indexes = Array.from({ length: 60 }, (_, i) => i);
    const tokenIds = indexes.map((i) => i + 500);
    const txs = planEscrowTxs(builder, 2, indexes, tokenIds);
    expect(txs).toHaveLength(3); // ceil(60/25)
    const sizes = txs.map((tx) => (tx.functionArgs[1] as { value: unknown[] }).value.length);
    expect(sizes).toEqual([25, 25, 10]);
    // each batch carries one NFT post-condition per escrowed token (+ zero-STX cap)
    expect(txs.map((tx) => tx.postConditions.length)).toEqual([26, 26, 11]);
    expect(() => planEscrowTxs(builder, 2, [1, 2], [9])).toThrow(/mismatch/);
    expect(() => planEscrowTxs(builder, 2, [], [])).toThrow(XtrataClientError);
  });
});

describe('sponsorExposure', () => {
  it('MIN_FEE_BUDGET matches the contract constant', () => {
    const m = /\(define-constant MIN-FEE-BUDGET u(\d+)\)/.exec(loadContractSource('xtrata-drops-v3.clar'));
    expect(m).not.toBeNull();
    expect(BigInt(m![1]!)).toBe(MIN_FEE_BUDGET);
  });

  it('mirrors the activation gate: MIN-FEE-BUDGET x effective-limit', () => {
    // total-limit 0 (uncapped) -> full inventory
    expect(sponsorExposure({ mode: 'sponsored', inventoryCount: 100 })).toEqual({
      claimable: 100,
      minimumBudget: MIN_FEE_BUDGET * 100n
    });
    // total-limit below inventory caps the exposure
    expect(sponsorExposure({ mode: 'sponsored', inventoryCount: 100, totalLimit: 40 }).minimumBudget).toBe(
      MIN_FEE_BUDGET * 40n
    );
    // total-limit above inventory is ignored (contract effective-limit)
    expect(sponsorExposure({ mode: 'sponsored', inventoryCount: 100, totalLimit: 400 }).minimumBudget).toBe(
      MIN_FEE_BUDGET * 100n
    );
  });

  it('unsponsored modes need no budget; claim-fee-cap gives the worst case', () => {
    expect(sponsorExposure({ mode: 'pre-inscribed', inventoryCount: 50 }).minimumBudget).toBe(0n);
    expect(sponsorExposure({ mode: 'zero-price', inventoryCount: 50 }).minimumBudget).toBe(0n);
    const exposure = sponsorExposure({
      mode: 'sponsored',
      inventoryCount: 30,
      totalLimit: 10,
      claimFeeCap: 2_000_000n
    });
    expect(exposure.worstCaseSettlement).toBe(20_000_000n);
    expect(exposure.minimumBudget).toBe(MIN_FEE_BUDGET * 10n);
  });
});
