import { describe, expect, it } from 'vitest';
import {
  coalesceIndexes,
  MAX_ESCROW_BATCH,
  MAX_RANGES,
  selectAllUnassigned,
  selectionCount,
  XtrataClientError,
  DropsTxBuilder,
  type InventorySelection,
  type ScanEntry
} from '@xtrata/collections-client';
import {
  describeSelection,
  expandSelection,
  fitToRangeCap,
  planCreatorInventory,
  planRecoveryTxs,
  recoveryTxCount,
  summarizeInventoryPlan
} from './inventory';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DROPS = `${DEPLOYER}.xtrata-drops-v3`;
const CORE = `${DEPLOYER}.xtrata-v3-2-3`;
const COLLECTION = `${DEPLOYER}.my-collection`;
const SENDER = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const builder = (): DropsTxBuilder =>
  new DropsTxBuilder({
    dropsContractId: DROPS,
    collectionContractId: COLLECTION,
    nftContractId: CORE,
    network: 'mainnet',
    sender: SENDER
  });

/**
 * A collection inscribed across several transaction batches, with an arbitrary
 * set of items already assigned to other drops. `get-unassigned-scan` answers
 * 50 entries per page exactly as the contract does — which is the thing the
 * one-action selection has to walk.
 */
const fakeCollection = (params: {
  nextIndex: number;
  assigned?: Iterable<number>;
  unminted?: Iterable<number>;
}) => {
  const assigned = new Set(params.assigned ?? []);
  const unminted = new Set(params.unminted ?? []);
  const pages: number[] = [];
  return {
    pages,
    getCollectionInfo: async () => ({ nextIndex: params.nextIndex }),
    getUnassignedScan: async (start: number): Promise<ScanEntry[]> => {
      pages.push(start);
      const entries: ScanEntry[] = [];
      for (let index = start; index < Math.min(start + 50, params.nextIndex); index += 1) {
        entries.push({
          index,
          minted: !unminted.has(index),
          assigned: assigned.has(index)
        });
      }
      return entries;
    }
  };
};

describe('selectAllUnassigned — one action over a fragmented, multi-batch collection', () => {
  it('walks every scan page and coalesces consecutive runs into minimal ranges', async () => {
    // 100 items inscribed in four batches; assignments scattered across all of
    // them, including runs and singletons and a hole at the very end.
    const reads = fakeCollection({ nextIndex: 100, assigned: [3, 4, 5, 27, 60, 61, 62, 63, 99] });

    const selection = await selectAllUnassigned(reads);

    // Two pages of 50 — bounded by next-index, not by how many transactions
    // inscribed the collection.
    expect(reads.pages).toEqual([0, 50]);

    expect(selection.ranges).toEqual([
      { start: 0, end: 3 },
      { start: 6, end: 27 },
      { start: 28, end: 60 },
      { start: 64, end: 99 }
    ]);
    expect(selection.explicit).toEqual([]);
    expect(selectionCount(selection)).toBe(91);

    // The selection is exactly "everything minted and not assigned".
    const expected = Array.from({ length: 100 }, (_, i) => i).filter(
      (i) => ![3, 4, 5, 27, 60, 61, 62, 63, 99].includes(i)
    );
    expect(expandSelection(selection)).toEqual(expected);
  });

  it('emits singletons as explicit indexes, not one-item ranges', async () => {
    // Alternating assignment: every unassigned index is isolated.
    const assigned = Array.from({ length: 20 }, (_, i) => i).filter((i) => i % 2 === 0);
    const reads = fakeCollection({ nextIndex: 20, assigned });

    const selection = await selectAllUnassigned(reads);

    expect(selection.ranges).toEqual([]);
    expect(selection.explicit).toEqual([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  });

  it('skips indexes that were never minted', async () => {
    const reads = fakeCollection({ nextIndex: 10, unminted: [4, 5], assigned: [0] });
    const selection = await selectAllUnassigned(reads);
    expect(expandSelection(selection)).toEqual([1, 2, 3, 6, 7, 8, 9]);
  });

  it('refuses when nothing is available rather than planning an empty drop', async () => {
    const reads = fakeCollection({ nextIndex: 5, assigned: [0, 1, 2, 3, 4] });
    await expect(selectAllUnassigned(reads)).rejects.toThrow(XtrataClientError);
  });

  it('handles a 500-item collection across ten scan pages', async () => {
    const reads = fakeCollection({ nextIndex: 500, assigned: [250] });
    const selection = await selectAllUnassigned(reads);
    expect(reads.pages).toEqual([0, 50, 100, 150, 200, 250, 300, 350, 400, 450]);
    expect(selectionCount(selection)).toBe(499);
    expect(selection.ranges).toEqual([
      { start: 0, end: 250 },
      { start: 251, end: 500 }
    ]);
  });
});

describe('transaction plans are bounded by the contract', () => {
  it('counts one inventory tx per range and one per 50 explicit items', () => {
    const selection = coalesceIndexes([
      ...Array.from({ length: 30 }, (_, i) => i), // one range
      ...Array.from({ length: 120 }, (_, i) => 40 + i * 2) // 120 singletons
    ]);
    const summary = summarizeInventoryPlan(selection);

    expect(summary.rangeSegments).toBe(1);
    expect(summary.explicitItems).toBe(120);
    expect(summary.rangeTxs).toBe(1);
    expect(summary.explicitTxs).toBe(3); // ceil(120 / 50)
    expect(summary.inventoryTxs).toBe(4);
    expect(summary.escrowTxs).toBe(Math.ceil(150 / MAX_ESCROW_BATCH));
    expect(summary.itemCount).toBe(150);
  });

  it('produces descriptors matching the summary for a fragmented selection', async () => {
    const reads = fakeCollection({ nextIndex: 100, assigned: [10, 20, 30, 40, 50] });
    const selection = await selectAllUnassigned(reads);

    const plan = planCreatorInventory({ builder: builder(), dropId: 7, selection });

    expect(plan.inventoryTxs).toHaveLength(plan.summary.inventoryTxs);
    expect(plan.inventoryTxs.every((tx) => tx.contractName === 'xtrata-drops-v3')).toBe(true);
    expect(plan.inventoryTxs.map((tx) => tx.functionName)).toEqual(
      Array.from({ length: plan.summary.rangeTxs }, () => 'add-inventory-range')
    );
    // Every descriptor is deny-mode with a zero-spend cap on the creator.
    expect(plan.inventoryTxs.every((tx) => tx.postConditionMode === 'deny')).toBe(true);
    expect(plan.escrowTxs).toBeNull();
  });

  it('plans ceil(n / 25) escrow transactions once token ids are known', async () => {
    const reads = fakeCollection({ nextIndex: 60 });
    const selection = await selectAllUnassigned(reads);
    const tokenIdByIndex = new Map(
      expandSelection(selection).map((index) => [index, 1_000 + index])
    );

    const plan = planCreatorInventory({ builder: builder(), dropId: 3, selection, tokenIdByIndex });

    expect(plan.escrowTxs).not.toBeNull();
    expect(plan.escrowTxs).toHaveLength(Math.ceil(60 / MAX_ESCROW_BATCH)); // 3
    expect(plan.escrowTxs!.every((tx) => tx.functionName === 'escrow-batch')).toBe(true);
    // Each escrow tx carries the sender NFT conditions for its batch plus the
    // zero-STX cap.
    expect(plan.escrowTxs![0]!.postConditions).toHaveLength(MAX_ESCROW_BATCH + 1);
    expect(plan.escrowTxs![2]!.postConditions).toHaveLength(10 + 1);
  });

  it('refuses to plan escrow for an item that was never minted', () => {
    const selection: InventorySelection = { ranges: [{ start: 0, end: 4 }], explicit: [] };
    const tokenIdByIndex = new Map([
      [0, 1],
      [1, 2],
      [3, 4]
    ]);
    expect(() => planCreatorInventory({ builder: builder(), dropId: 1, selection, tokenIdByIndex })).toThrow(
      /no minted token id/
    );
  });
});

describe('fitToRangeCap — a heavily fragmented collection still gets a legal plan', () => {
  it('leaves a selection inside the cap untouched', () => {
    const selection = coalesceIndexes([0, 1, 2, 10, 11, 12]);
    expect(fitToRangeCap(selection)).toBe(selection);
  });

  it('counts SLOTS not logical ranges: wide ranges are split and consume several', () => {
    // 10 logical ranges of 200 = 40 slots at 50 indexes each, over the 25 cap,
    // even though 10 < MAX_RANGES. Counting logical ranges would wrongly pass
    // this through and produce transactions the collection rejects.
    const ranges = Array.from({ length: 10 }, (_, i) => ({ start: i * 300, end: i * 300 + 200 }));
    const raw = { ranges, explicit: [] };
    expect(raw.ranges.length).toBeLessThan(MAX_RANGES);
    expect(summarizeInventoryPlan(raw).exceedsRangeCap).toBe(true);

    const fitted = fitToRangeCap(raw);
    const summary = summarizeInventoryPlan(fitted);
    expect(summary.rangeSegments).toBeLessThanOrEqual(MAX_RANGES);
    expect(summary.exceedsRangeCap).toBe(false);
    expect(selectionCount(fitted)).toBe(selectionCount(raw)); // no items lost
  });

  it('a whole-collection selection of 100 items is 2 range txs, not 1', () => {
    const summary = summarizeInventoryPlan({ ranges: [{ start: 0, end: 100 }], explicit: [] });
    expect(summary.rangeTxs).toBe(2);
    expect(summary.rangeSegments).toBe(2);
    expect(summary.exceedsRangeCap).toBe(false);
  });

  it('demotes the shortest runs to explicit indexes when there are too many ranges', async () => {
    // 30 runs of 2, separated by assigned items → 30 range segments, 5 over.
    const assigned: number[] = [];
    for (let run = 0; run < 30; run += 1) assigned.push(run * 3 + 2);
    const reads = fakeCollection({ nextIndex: 90, assigned });
    const raw = await selectAllUnassigned(reads);
    expect(raw.ranges).toHaveLength(30);
    expect(raw.ranges.length).toBeGreaterThan(MAX_RANGES);

    const fitted = fitToRangeCap(raw);

    expect(fitted.ranges).toHaveLength(MAX_RANGES);
    // Same items, redistributed: 5 demoted runs × 2 items = 10 explicit.
    expect(selectionCount(fitted)).toBe(selectionCount(raw));
    expect(fitted.explicit).toHaveLength(10);
    expect(new Set(expandSelection(fitted))).toEqual(new Set(expandSelection(raw)));
    // Ranges stay sorted so the on-chain slot order is predictable.
    expect(fitted.ranges.map((range) => range.start)).toEqual(
      [...fitted.ranges.map((range) => range.start)].sort((a, b) => a - b)
    );
  });

  it('keeps the LONGEST ranges, because a range costs one tx whatever its length', () => {
    const selection: InventorySelection = {
      ranges: [
        { start: 0, end: 2 }, // 2 items
        { start: 10, end: 60 }, // 50 items
        { start: 100, end: 103 } // 3 items
      ],
      explicit: []
    };
    const fitted = fitToRangeCap(selection, 1);
    expect(fitted.ranges).toEqual([{ start: 10, end: 60 }]);
    expect(fitted.explicit).toEqual([0, 1, 100, 101, 102]);
  });

  it('planCreatorInventory applies the cap so planning never dead-ends', async () => {
    const assigned: number[] = [];
    for (let run = 0; run < 40; run += 1) assigned.push(run * 3 + 2);
    const reads = fakeCollection({ nextIndex: 120, assigned });
    const raw = await selectAllUnassigned(reads);

    const plan = planCreatorInventory({ builder: builder(), dropId: 1, selection: raw });

    expect(plan.summary.rangeSegments).toBe(MAX_RANGES);
    expect(plan.summary.exceedsRangeCap).toBe(false);
    expect(plan.inventoryTxs).toHaveLength(plan.summary.rangeTxs + plan.summary.explicitTxs);
    expect(selectionCount(plan.selection)).toBe(selectionCount(raw));
  });
});

describe('recovery planning at the 25 boundary', () => {
  const escrowed = (indexes: number[]): Map<number, number> =>
    new Map(indexes.map((index) => [index, 5_000 + index]));

  it.each([
    [1, 1],
    [24, 1],
    [25, 1],
    [26, 2],
    [50, 2],
    [51, 3]
  ])('recovers %i items in %i transaction(s)', (items, expectedTxs) => {
    const indexes = Array.from({ length: items }, (_, i) => i);
    expect(recoveryTxCount(items)).toBe(expectedTxs);
    const txs = planRecoveryTxs({
      builder: builder(),
      dropId: 2,
      indexes,
      escrowedTokenIdByIndex: escrowed(indexes)
    });
    expect(txs).toHaveLength(expectedTxs);
    expect(txs.every((tx) => tx.functionName === 'recover-batch')).toBe(true);
  });

  it('splits exactly at 25 and carries NFT post-conditions only for escrowed items', () => {
    const indexes = Array.from({ length: 30 }, (_, i) => i);
    // Five of the thirty were assigned but never escrowed — they recover
    // nothing, so they must not produce an NFT post-condition.
    const partial = escrowed(indexes.filter((index) => index >= 5));

    const txs = planRecoveryTxs({
      builder: builder(),
      dropId: 2,
      indexes,
      escrowedTokenIdByIndex: partial
    });

    expect(txs).toHaveLength(2);
    // First batch: 25 indexes, 20 escrowed → 20 NFT conditions + the STX cap.
    expect(txs[0]!.postConditions).toHaveLength(20 + 1);
    // Second batch: 5 indexes, all escrowed.
    expect(txs[1]!.postConditions).toHaveLength(5 + 1);
  });

  it('refuses an empty recovery instead of broadcasting a no-op', () => {
    expect(() =>
      planRecoveryTxs({ builder: builder(), dropId: 2, indexes: [], escrowedTokenIdByIndex: new Map() })
    ).toThrow(XtrataClientError);
  });
});

describe('describeSelection', () => {
  it('renders ranges and singletons the way the contract stores them', () => {
    expect(describeSelection({ ranges: [{ start: 0, end: 50 }], explicit: [80, 91] })).toBe('0–49, 80, 91');
  });

  it('truncates long selections rather than filling the screen', () => {
    const selection = { ranges: [], explicit: Array.from({ length: 30 }, (_, i) => i) };
    expect(describeSelection(selection)).toBe('0, 1, 2, 3, 4, 5, 6, 7 … (+22 more)');
  });
});
