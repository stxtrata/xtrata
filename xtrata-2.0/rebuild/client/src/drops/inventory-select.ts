import { XtrataClientError } from '../errors.js';
import type { CollectionInfo, ScanEntry } from '../protocol/codecs.js';
import {
  DROP_MODES,
  MAX_ESCROW_BATCH,
  MAX_INVENTORY_ITEMS,
  MAX_RANGES,
  MAX_RANGE_WIDTH,
  MIN_FEE_BUDGET,
  type DropMode,
  type DropsTxBuilder,
  type DropsTxDescriptor
} from './client.js';

/**
 * One-action inventory selection helpers for the Drop Builder UI: turn a
 * high-level selection ("whole collection", "these ids", "everything not yet
 * in a drop") into a minimal, contract-bounded transaction plan.
 */

export interface InventoryRange {
  /** Inclusive start index. */
  start: number;
  /** Exclusive end index. */
  end: number;
}

export interface InventorySelection {
  ranges: InventoryRange[];
  explicit: number[];
}

export const selectionCount = (selection: InventorySelection): number =>
  selection.ranges.reduce((sum, r) => sum + (r.end - r.start), 0) + selection.explicit.length;

/** Whole collection: range [0, minted). */
export const selectWholeCollection = (info: Pick<CollectionInfo, 'mintedCount'>): InventorySelection => {
  if (info.mintedCount <= 0) {
    throw new XtrataClientError('plan-invalid', 'collection has no minted items to select');
  }
  return { ranges: [{ start: 0, end: info.mintedCount }], explicit: [] };
};

export const selectRange = (start: number, end: number): InventorySelection => {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0) {
    throw new XtrataClientError('plan-invalid', `range bounds must be non-negative integers: [${start}, ${end})`);
  }
  if (start >= end) {
    throw new XtrataClientError('plan-invalid', `range start ${start} must be < end ${end}`);
  }
  return { ranges: [{ start, end }], explicit: [] };
};

export const selectExplicit = (indexes: number[]): InventorySelection => {
  if (indexes.length === 0) {
    throw new XtrataClientError('plan-invalid', 'explicit selection must contain at least one index');
  }
  const seen = new Set<number>();
  for (const index of indexes) {
    if (!Number.isInteger(index) || index < 0) {
      throw new XtrataClientError('plan-invalid', `invalid item index: ${index}`);
    }
    if (seen.has(index)) {
      throw new XtrataClientError('plan-invalid', `duplicate item index: ${index}`);
    }
    seen.add(index);
  }
  return { ranges: [], explicit: [...indexes] };
};

/**
 * Split ranges to the collection's per-call width bound. A whole-collection
 * selection of 100 items is one logical range but two transactions.
 */
export const splitRanges = (ranges: InventoryRange[]): InventoryRange[] => {
  const out: InventoryRange[] = [];
  for (const range of ranges) {
    for (let start = range.start; start < range.end; start += MAX_RANGE_WIDTH) {
      out.push({ start, end: Math.min(start + MAX_RANGE_WIDTH, range.end) });
    }
  }
  return out;
};

/** Transactions a selection costs: split range calls + chunked explicit batches. */
export const inventoryTxCount = (selection: InventorySelection): number =>
  splitRanges(selection.ranges).length + Math.ceil(selection.explicit.length / MAX_INVENTORY_ITEMS);

/** Coalesce sorted unassigned indexes: runs of >= 2 become ranges, singletons explicit. */
export const coalesceIndexes = (sortedIndexes: number[]): InventorySelection => {
  const ranges: InventoryRange[] = [];
  const explicit: number[] = [];
  let runStart = -1;
  let runEnd = -1; // exclusive
  const flush = (): void => {
    if (runStart < 0) return;
    if (runEnd - runStart >= 2) ranges.push({ start: runStart, end: runEnd });
    else explicit.push(runStart);
  };
  for (const index of sortedIndexes) {
    if (index === runEnd) {
      runEnd += 1;
    } else {
      flush();
      runStart = index;
      runEnd = index + 1;
    }
  }
  flush();
  return { ranges, explicit };
};

export interface UnassignedScanReads {
  getCollectionInfo(): Promise<Pick<CollectionInfo, 'nextIndex'>>;
  getUnassignedScan(start: number): Promise<ScanEntry[]>;
}

/**
 * Everything minted but not yet assigned to a drop: walks get-unassigned-scan
 * pages (50 per call) over [0, next-index) and emits a minimal range/explicit
 * split (consecutive unassigned indexes coalesced into ranges).
 */
export const selectAllUnassigned = async (reads: UnassignedScanReads): Promise<InventorySelection> => {
  const { nextIndex } = await reads.getCollectionInfo();
  const unassigned: number[] = [];
  for (let start = 0; start < nextIndex; start += 50) {
    const page = await reads.getUnassignedScan(start);
    if (page.length === 0) break;
    for (const entry of page) {
      if (entry.minted && !entry.assigned) unassigned.push(entry.index);
    }
  }
  if (unassigned.length === 0) {
    throw new XtrataClientError('plan-invalid', 'no unassigned minted items to select');
  }
  unassigned.sort((a, b) => a - b);
  return coalesceIndexes(unassigned);
};

/**
 * Ordered add-inventory transaction plan for a selection: one
 * add-inventory-range tx per range segment, explicit indexes chunked at the
 * contract's 50-item batch bound. Enforces the contract's 25-range cap.
 */
export const planInventoryTxs = (
  builder: DropsTxBuilder,
  dropId: number,
  selection: InventorySelection
): DropsTxDescriptor[] => {
  if (selectionCount(selection) === 0) {
    throw new XtrataClientError('plan-invalid', 'selection is empty');
  }
  // A range wider than the collection's per-call bound must be split, and each
  // resulting call consumes one of the drop's MAX_RANGES slots — so the cap is
  // checked against the split segments, not the logical ranges.
  const segments = splitRanges(selection.ranges);
  if (segments.length > MAX_RANGES) {
    throw new XtrataClientError(
      'plan-invalid',
      `selection needs ${segments.length} range segments (${MAX_RANGE_WIDTH} indexes each); the contract allows ${MAX_RANGES} per drop`
    );
  }
  const txs: DropsTxDescriptor[] = segments.map((range) =>
    builder.addInventoryRange(dropId, range.start, range.end)
  );
  for (let i = 0; i < selection.explicit.length; i += MAX_INVENTORY_ITEMS) {
    txs.push(builder.addInventoryItems(dropId, selection.explicit.slice(i, i + MAX_INVENTORY_ITEMS)));
  }
  return txs;
};

/**
 * ceil(n / 25) escrow-batch descriptors pairing each inventory index with its
 * minted token id (`indexes[i]` escrows `tokenIds[i]`).
 */
export const planEscrowTxs = (
  builder: DropsTxBuilder,
  dropId: number,
  indexes: number[],
  tokenIds: number[]
): DropsTxDescriptor[] => {
  if (indexes.length === 0) {
    throw new XtrataClientError('plan-invalid', 'escrow plan requires at least one item');
  }
  if (indexes.length !== tokenIds.length) {
    throw new XtrataClientError(
      'plan-invalid',
      `escrow plan mismatch: ${indexes.length} indexes vs ${tokenIds.length} token ids`
    );
  }
  const entries = indexes.map((index, i) => ({ index, tokenId: tokenIds[i]! }));
  const txs: DropsTxDescriptor[] = [];
  for (let i = 0; i < entries.length; i += MAX_ESCROW_BATCH) {
    txs.push(builder.escrowBatch(dropId, entries.slice(i, i + MAX_ESCROW_BATCH)));
  }
  return txs;
};

export interface SponsorExposureParams {
  mode: DropMode;
  inventoryCount: number;
  /** create-drop total-limit (0 = uncapped). */
  totalLimit?: number;
  /** Per-claim settlement cap (contract claim-fee-cap), for the worst case. */
  claimFeeCap?: bigint;
}

export interface SponsorExposure {
  /** Number of claims the budget must cover: min(inventory, total-limit>0). */
  claimable: number;
  /** Activation gate: MIN-FEE-BUDGET x claimable (0 for unsponsored modes). */
  minimumBudget: bigint;
  /** Worst-case settlement outflow: claim-fee-cap x claimable (if cap given). */
  worstCaseSettlement?: bigint;
}

/**
 * Sponsor exposure calculator mirroring the contract's activation gate:
 * sponsored drops must hold >= MIN-FEE-BUDGET x effective-limit, where
 * effective-limit = total-limit when 0 < total-limit < inventory, else
 * inventory. Modes 1 and 2 require no budget.
 */
export const sponsorExposure = (params: SponsorExposureParams): SponsorExposure => {
  if (!Number.isInteger(params.inventoryCount) || params.inventoryCount < 0) {
    throw new XtrataClientError('plan-invalid', `invalid inventory count: ${params.inventoryCount}`);
  }
  const totalLimit = params.totalLimit ?? 0;
  const claimable =
    totalLimit > 0 && totalLimit < params.inventoryCount ? totalLimit : params.inventoryCount;
  const sponsored = DROP_MODES[params.mode] === DROP_MODES.sponsored;
  return {
    claimable,
    minimumBudget: sponsored ? MIN_FEE_BUDGET * BigInt(claimable) : 0n,
    ...(sponsored && params.claimFeeCap !== undefined
      ? { worstCaseSettlement: params.claimFeeCap * BigInt(claimable) }
      : {})
  };
};
