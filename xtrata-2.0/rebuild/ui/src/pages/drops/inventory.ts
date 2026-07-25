import {
  MAX_ESCROW_BATCH,
  MAX_INVENTORY_ITEMS,
  MAX_RANGES,
  MAX_RANGE_WIDTH,
  planEscrowTxs,
  planInventoryTxs,
  selectionCount,
  splitRanges,
  XtrataClientError,
  type DropsTxBuilder,
  type DropsTxDescriptor,
  type InventoryRange,
  type InventorySelection
} from '@xtrata/collections-client';

/**
 * UI-side inventory helpers layered on the client's selection primitives.
 *
 * The client coalesces unassigned indexes into the *minimal* range/explicit
 * split, which is the right answer for transaction count — but a collection
 * inscribed across many batches with scattered assignments can still coalesce
 * into more than the contract's 25 range segments per drop, at which point
 * `planInventoryTxs` refuses the plan. Rather than dead-end there, the builder
 * demotes the least valuable ranges to explicit indexes (which are only
 * bounded per transaction, at 50, not per drop) and re-plans. The result is
 * always a legal plan for any selection the chain can actually express.
 */

export interface InventoryPlanSummary {
  /** Items in the selection. */
  itemCount: number;
  rangeSegments: number;
  explicitItems: number;
  /** One tx per range segment. */
  rangeTxs: number;
  /** ceil(explicit / 50). */
  explicitTxs: number;
  inventoryTxs: number;
  /** ceil(items / 25). */
  escrowTxs: number;
  /** Everything the creator must broadcast: inventory + escrow + activate. */
  totalTxs: number;
  /** True when the selection exceeds the contract's 25-range cap as-is. */
  exceedsRangeCap: boolean;
}

const ceilDiv = (value: number, divisor: number): number =>
  value <= 0 ? 0 : Math.ceil(value / divisor);

/**
 * Bounded transaction counts for a selection — no builder, no wallet.
 *
 * A range wider than MAX_RANGE_WIDTH is several calls, each consuming one of
 * the drop's MAX_RANGES slots, so both the tx count and the cap check are
 * computed over split segments rather than logical ranges.
 */
export const summarizeInventoryPlan = (selection: InventorySelection): InventoryPlanSummary => {
  const itemCount = selectionCount(selection);
  const segments = splitRanges(selection.ranges);
  const rangeTxs = segments.length;
  const explicitTxs = ceilDiv(selection.explicit.length, MAX_INVENTORY_ITEMS);
  const escrowTxs = ceilDiv(itemCount, MAX_ESCROW_BATCH);
  const inventoryTxs = rangeTxs + explicitTxs;
  return {
    itemCount,
    rangeSegments: segments.length,
    explicitItems: selection.explicit.length,
    rangeTxs,
    explicitTxs,
    inventoryTxs,
    escrowTxs,
    // +1 for activate-drop; create-drop is counted separately by the caller.
    totalTxs: inventoryTxs + escrowTxs + 1,
    exceedsRangeCap: segments.length > MAX_RANGES
  };
};

const sortRanges = (ranges: InventoryRange[]): InventoryRange[] =>
  [...ranges].sort((a, b) => a.start - b.start);

/**
 * Make any selection legal under the contract's `MAX-RANGES` cap by keeping
 * the ranges that cover the most items per range slot and demoting the rest to
 * explicit indexes.
 *
 * The budget is measured in SLOTS, not logical ranges: a range wider than
 * MAX_RANGE_WIDTH is split across several calls and consumes one slot each.
 * A range's value is therefore items-per-slot — min(length, MAX_RANGE_WIDTH) —
 * so keeping the widest ranges preserves the most items for the fewest slots
 * and pushes the fewest items into explicit batches.
 */
export const fitToRangeCap = (
  selection: InventorySelection,
  maxRanges: number = MAX_RANGES
): InventorySelection => {
  if (maxRanges < 0) {
    throw new XtrataClientError('plan-invalid', `range cap must be non-negative, received ${maxRanges}`);
  }
  if (splitRanges(selection.ranges).length <= maxRanges) return selection;

  const slotsFor = (r: InventoryRange): number => Math.ceil((r.end - r.start) / MAX_RANGE_WIDTH);
  const valueFor = (r: InventoryRange): number => Math.min(r.end - r.start, MAX_RANGE_WIDTH);
  const byValue = [...selection.ranges].sort((a, b) => valueFor(b) - valueFor(a) || a.start - b.start);

  const kept: InventoryRange[] = [];
  const demoted: InventoryRange[] = [];
  let slotsUsed = 0;
  for (const range of byValue) {
    const slots = slotsFor(range);
    if (slotsUsed + slots <= maxRanges) {
      kept.push(range);
      slotsUsed += slots;
    } else {
      demoted.push(range);
    }
  }
  const explicit = [...selection.explicit];
  for (const range of demoted) {
    for (let index = range.start; index < range.end; index += 1) explicit.push(index);
  }
  explicit.sort((a, b) => a - b);
  return { ranges: sortRanges(kept), explicit };
};

/**
 * The full creator-side plan for one selection: inventory transactions from
 * the client's planner (after fitting the range cap), then the escrow batches
 * that pair each index with its minted token id.
 */
export interface CreatorInventoryPlan {
  selection: InventorySelection;
  summary: InventoryPlanSummary;
  inventoryTxs: DropsTxDescriptor[];
  /** Present only once token ids have been resolved from the collection. */
  escrowTxs: DropsTxDescriptor[] | null;
}

export const planCreatorInventory = (params: {
  builder: DropsTxBuilder;
  dropId: number;
  selection: InventorySelection;
  /** index → token id, from CollectionReads.getItems. */
  tokenIdByIndex?: Map<number, number>;
}): CreatorInventoryPlan => {
  const selection = fitToRangeCap(params.selection);
  const inventoryTxs = planInventoryTxs(params.builder, params.dropId, selection);

  let escrowTxs: DropsTxDescriptor[] | null = null;
  if (params.tokenIdByIndex) {
    const indexes = expandSelection(selection);
    const missing = indexes.filter((index) => !params.tokenIdByIndex!.has(index));
    if (missing.length > 0) {
      throw new XtrataClientError(
        'plan-invalid',
        `cannot plan escrow: ${missing.length} selected item(s) have no minted token id (first: ${missing[0]})`
      );
    }
    escrowTxs = planEscrowTxs(
      params.builder,
      params.dropId,
      indexes,
      indexes.map((index) => params.tokenIdByIndex!.get(index)!)
    );
  }

  return { selection, summary: summarizeInventoryPlan(selection), inventoryTxs, escrowTxs };
};

/** Ranges expanded in slot order, then explicit slots — the contract's order. */
export const expandSelection = (selection: InventorySelection): number[] => {
  const indexes: number[] = [];
  for (const range of selection.ranges) {
    for (let index = range.start; index < range.end; index += 1) indexes.push(index);
  }
  return indexes.concat(selection.explicit);
};

/** Human description of a selection, e.g. "0–49, 60–72, 81, 94" (capped). */
export const describeSelection = (selection: InventorySelection, maxParts = 8): string => {
  const parts = [
    ...selection.ranges.map((range) =>
      range.end - range.start === 1 ? String(range.start) : `${range.start}–${range.end - 1}`
    ),
    ...selection.explicit.map(String)
  ];
  if (parts.length === 0) return 'nothing selected';
  if (parts.length <= maxParts) return parts.join(', ');
  return `${parts.slice(0, maxParts).join(', ')} … (+${parts.length - maxParts} more)`;
};

/**
 * Recovery plan: ceil(n / 25) `recover-batch` transactions over the indexes
 * that are still recoverable, each carrying contract-outbound NFT
 * post-conditions for the subset that is actually still escrowed.
 */
export const planRecoveryTxs = (params: {
  builder: DropsTxBuilder;
  dropId: number;
  /** Unclaimed inventory indexes, in any order. */
  indexes: number[];
  /** index → escrowed token id, for the indexes still holding escrow. */
  escrowedTokenIdByIndex: Map<number, number>;
}): DropsTxDescriptor[] => {
  if (params.indexes.length === 0) {
    throw new XtrataClientError('plan-invalid', 'nothing to recover');
  }
  const txs: DropsTxDescriptor[] = [];
  for (let i = 0; i < params.indexes.length; i += MAX_ESCROW_BATCH) {
    const batch = params.indexes.slice(i, i + MAX_ESCROW_BATCH);
    const tokenIds = batch
      .map((index) => params.escrowedTokenIdByIndex.get(index))
      .filter((tokenId): tokenId is number => tokenId !== undefined);
    txs.push(params.builder.recoverBatch(params.dropId, batch, tokenIds));
  }
  return txs;
};

export const recoveryTxCount = (itemCount: number): number => ceilDiv(itemCount, MAX_ESCROW_BATCH);
