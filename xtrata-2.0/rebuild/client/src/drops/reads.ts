import { Cl, type ClarityValue } from '@stacks/transactions';
import { XtrataClientError } from '../errors.js';
import { parseContractId } from '../network.js';
import type { ReadOnlyTransport } from '../collection/reads.js';
import {
  expectBool,
  expectBufferHex,
  expectList,
  expectOk,
  expectOptional,
  expectPrincipal,
  expectTuple,
  expectUInt
} from '../protocol/codecs.js';
import { DROP_STATUS, type DropStatus } from './client.js';

/**
 * Typed read-only client for the xtrata-drops-v3 singleton over the same
 * pluggable ReadOnlyTransport the collection reads use.
 */

const tupleField = (tuple: Record<string, ClarityValue>, key: string): ClarityValue => {
  const value = tuple[key];
  if (value === undefined) {
    throw new XtrataClientError('internal', `tuple missing field '${key}'`);
  }
  return value;
};

// --- typed row decoders (shapes from xtrata-drops-v3.clar) ---

export interface DropRow {
  creator: string;
  collection: string;
  mode: number;
  status: number;
  statusName: DropStatus;
  startBlock: number;
  endBlock: number;
  totalLimit: number;
  perWalletLimit: number;
  eligibility: number;
  feeBudgetTotal: bigint;
  feeBudgetRemaining: bigint;
  feesSettled: number;
  inventoryCount: number;
  rangesTotal: number;
  rangeCount: number;
  explicitCount: number;
  escrowedCount: number;
  claimedCount: number;
  reservedCount: number;
  freeCount: number;
  cursor: number;
  createdAt: number;
  endedAt: number | null;
}

export const decodeDrop = (cv: ClarityValue): DropRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  const endedAt = expectOptional(tupleField(t, 'ended-at'));
  const status = Number(expectUInt(tupleField(t, 'status')));
  const statusName = DROP_STATUS[status];
  if (statusName === undefined) {
    throw new XtrataClientError('internal', `unknown drop status u${status}`);
  }
  return {
    creator: expectPrincipal(tupleField(t, 'creator')),
    collection: expectPrincipal(tupleField(t, 'collection')),
    mode: Number(expectUInt(tupleField(t, 'mode'))),
    status,
    statusName,
    startBlock: Number(expectUInt(tupleField(t, 'start-block'))),
    endBlock: Number(expectUInt(tupleField(t, 'end-block'))),
    totalLimit: Number(expectUInt(tupleField(t, 'total-limit'))),
    perWalletLimit: Number(expectUInt(tupleField(t, 'per-wallet-limit'))),
    eligibility: Number(expectUInt(tupleField(t, 'eligibility'))),
    feeBudgetTotal: expectUInt(tupleField(t, 'fee-budget-total')),
    feeBudgetRemaining: expectUInt(tupleField(t, 'fee-budget-remaining')),
    feesSettled: Number(expectUInt(tupleField(t, 'fees-settled'))),
    inventoryCount: Number(expectUInt(tupleField(t, 'inventory-count'))),
    rangesTotal: Number(expectUInt(tupleField(t, 'ranges-total'))),
    rangeCount: Number(expectUInt(tupleField(t, 'range-count'))),
    explicitCount: Number(expectUInt(tupleField(t, 'explicit-count'))),
    escrowedCount: Number(expectUInt(tupleField(t, 'escrowed-count'))),
    claimedCount: Number(expectUInt(tupleField(t, 'claimed-count'))),
    reservedCount: Number(expectUInt(tupleField(t, 'reserved-count'))),
    freeCount: Number(expectUInt(tupleField(t, 'free-count'))),
    cursor: Number(expectUInt(tupleField(t, 'cursor'))),
    createdAt: Number(expectUInt(tupleField(t, 'created-at'))),
    endedAt: endedAt !== null ? Number(expectUInt(endedAt)) : null
  };
};

export interface DropRangeRow {
  start: number;
  end: number;
  cumBefore: number;
}

export const decodeDropRange = (cv: ClarityValue): DropRangeRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  return {
    start: Number(expectUInt(tupleField(t, 'start'))),
    end: Number(expectUInt(tupleField(t, 'end'))),
    cumBefore: Number(expectUInt(tupleField(t, 'cum-before')))
  };
};

export interface ClaimRow {
  index: number;
  claimer: string;
  claimedAt: number;
}

export const decodeClaim = (cv: ClarityValue): ClaimRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  return {
    index: Number(expectUInt(tupleField(t, 'index'))),
    claimer: expectPrincipal(tupleField(t, 'claimer')),
    claimedAt: Number(expectUInt(tupleField(t, 'claimed-at')))
  };
};

export interface ClaimReservationRow {
  index: number;
  reservedAt: number;
}

export const decodeClaimReservation = (cv: ClarityValue): ClaimReservationRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  return {
    index: Number(expectUInt(tupleField(t, 'index'))),
    reservedAt: Number(expectUInt(tupleField(t, 'reserved-at')))
  };
};

export interface DropSummary {
  dropId: number;
  drop: DropRow;
  remaining: number;
  fullyEscrowed: boolean;
}

export interface DropsReadsConfig {
  dropsContractId: string;
  transport: ReadOnlyTransport;
}

export class DropsReads {
  constructor(private readonly config: DropsReadsConfig) {
    parseContractId(config.dropsContractId);
  }

  private call(fn: string, args: ClarityValue[]): Promise<ClarityValue> {
    return this.config.transport(this.config.dropsContractId, fn, args);
  }

  // --- read-onlys ---

  async getDrop(dropId: number): Promise<DropRow | null> {
    return decodeDrop(await this.call('get-drop', [Cl.uint(dropId)]));
  }

  async getNextDropId(): Promise<number> {
    return Number(expectUInt(expectOk(await this.call('get-next-drop-id', []))));
  }

  async getOwner(): Promise<string> {
    return expectPrincipal(expectOk(await this.call('get-owner', [])));
  }

  async getPendingOwner(): Promise<string | null> {
    const inner = expectOptional(expectOk(await this.call('get-pending-owner', [])));
    return inner !== null ? expectPrincipal(inner) : null;
  }

  async getSponsor(): Promise<string> {
    return expectPrincipal(expectOk(await this.call('get-sponsor', [])));
  }

  async getAttestorPubkeyHash(): Promise<string | null> {
    const inner = expectOptional(expectOk(await this.call('get-attestor-pubkey-hash', [])));
    return inner !== null ? expectBufferHex(inner) : null;
  }

  async getClaimFeeCap(): Promise<bigint> {
    return expectUInt(expectOk(await this.call('get-claim-fee-cap', [])));
  }

  async getMinFeeBudget(): Promise<bigint> {
    return expectUInt(expectOk(await this.call('get-min-fee-budget', [])));
  }

  async getRefundDelay(): Promise<number> {
    return Number(expectUInt(expectOk(await this.call('get-refund-delay', []))));
  }

  async getReservationExpiry(): Promise<number> {
    return Number(expectUInt(expectOk(await this.call('get-reservation-expiry', []))));
  }

  async isPaused(): Promise<boolean> {
    return expectBool(expectOk(await this.call('is-paused', [])));
  }

  async getNftContract(): Promise<string> {
    return expectPrincipal(expectOk(await this.call('get-nft-contract', [])));
  }

  async getInventorySlot(dropId: number, slot: number): Promise<number | null> {
    const inner = expectOptional(
      expectOk(await this.call('get-inventory-slot', [Cl.uint(dropId), Cl.uint(slot)]))
    );
    return inner !== null ? Number(expectUInt(inner)) : null;
  }

  async getDropRange(dropId: number, seq: number): Promise<DropRangeRow | null> {
    return decodeDropRange(await this.call('get-drop-range', [Cl.uint(dropId), Cl.uint(seq)]));
  }

  async getClaim(dropId: number, seq: number): Promise<ClaimRow | null> {
    return decodeClaim(await this.call('get-claim', [Cl.uint(dropId), Cl.uint(seq)]));
  }

  async getWalletClaims(dropId: number, wallet: string): Promise<number> {
    return Number(
      expectUInt(expectOk(await this.call('get-wallet-claims', [Cl.uint(dropId), Cl.principal(wallet)])))
    );
  }

  async getClaimReservation(dropId: number, claimer: string): Promise<ClaimReservationRow | null> {
    return decodeClaimReservation(
      await this.call('get-claim-reservation', [Cl.uint(dropId), Cl.principal(claimer)])
    );
  }

  async getAllowlistEntry(dropId: number, wallet: string): Promise<number | null> {
    const inner = expectOptional(
      await this.call('get-allowlist-entry', [Cl.uint(dropId), Cl.principal(wallet)])
    );
    return inner !== null ? Number(expectUInt(inner)) : null;
  }

  async getEscrowedToken(dropId: number, index: number): Promise<number | null> {
    const inner = expectOptional(
      await this.call('get-escrowed-token', [Cl.uint(dropId), Cl.uint(index)])
    );
    return inner !== null ? Number(expectUInt(inner)) : null;
  }

  async isItemClaimed(dropId: number, index: number): Promise<boolean> {
    return expectBool(expectOk(await this.call('is-item-claimed', [Cl.uint(dropId), Cl.uint(index)])));
  }

  async getRemaining(dropId: number): Promise<number> {
    return Number(expectUInt(expectOk(await this.call('get-remaining', [Cl.uint(dropId)]))));
  }

  /** One page (up to 50 entries starting at `start`) of the claim index. */
  async getClaimsScan(dropId: number, start: number): Promise<(ClaimRow | null)[]> {
    const cv = expectOk(await this.call('get-claims-scan', [Cl.uint(dropId), Cl.uint(start)]));
    return expectList(cv).map((entry) => decodeClaim(entry));
  }

  /** All confirmed claims, walking get-claims-scan pages. */
  async getAllClaims(dropId: number): Promise<ClaimRow[]> {
    const drop = await this.requireDrop(dropId);
    const out: ClaimRow[] = [];
    for (let start = 0; start < drop.claimedCount; start += 50) {
      for (const claim of await this.getClaimsScan(dropId, start)) {
        if (claim !== null) out.push(claim);
      }
    }
    return out;
  }

  // --- composites ---

  private async requireDrop(dropId: number): Promise<DropRow> {
    const drop = await this.getDrop(dropId);
    if (drop === null) {
      throw new XtrataClientError('plan-invalid', `drop ${dropId} does not exist`);
    }
    return drop;
  }

  /**
   * The full ordered inventory index list for a drop: range segments expanded
   * in slot order, then the explicit slots resolved via get-inventory-slot
   * (paginated one slot per call — bounded by inventory-count).
   */
  async resolveInventory(dropId: number): Promise<number[]> {
    const drop = await this.requireDrop(dropId);
    const indexes: number[] = [];
    for (let seq = 0; seq < drop.rangeCount; seq += 1) {
      const range = await this.getDropRange(dropId, seq);
      if (range === null) {
        throw new XtrataClientError('internal', `drop ${dropId} missing range seq ${seq}`);
      }
      for (let i = range.start; i < range.end; i += 1) indexes.push(i);
    }
    if (indexes.length !== drop.rangesTotal) {
      throw new XtrataClientError(
        'internal',
        `drop ${dropId} range expansion mismatch: ${indexes.length} != ${drop.rangesTotal}`
      );
    }
    for (let slot = drop.rangesTotal; slot < drop.inventoryCount; slot += 1) {
      const index = await this.getInventorySlot(dropId, slot);
      if (index === null) {
        throw new XtrataClientError('internal', `drop ${dropId} missing explicit slot ${slot}`);
      }
      indexes.push(index);
    }
    return indexes;
  }

  async getDropSummary(dropId: number): Promise<DropSummary> {
    const [drop, remaining] = await Promise.all([this.requireDrop(dropId), this.getRemaining(dropId)]);
    return {
      dropId,
      drop,
      remaining,
      fullyEscrowed: drop.escrowedCount + drop.claimedCount >= drop.inventoryCount
    };
  }
}
