import { describe, expect, it } from 'vitest';
import { Cl, type ClarityValue } from '@stacks/transactions';
import { DropsReads, decodeDrop } from '../src/drops/reads.js';
import type { ReadOnlyTransport } from '../src/collection/reads.js';
import { XtrataClientError } from '../src/errors.js';
import { loadContractSource, parseFunctions } from './util/contract-source.js';

const OWNER = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const DROPS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3';
const COLLECTION = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-v3';

const dropsFns = parseFunctions(loadContractSource('xtrata-drops-v3.clar'));

type Scripted = ClarityValue | ((args: ClarityValue[]) => ClarityValue);

/** Fake transport with drift check against the drops .clar. */
const makeFake = (responses: Record<string, Scripted>): ReadOnlyTransport =>
  async (contractId, fn, args) => {
    expect(contractId).toBe(DROPS);
    const sig = dropsFns.get(fn);
    if (sig === undefined || sig.kind !== 'read-only') {
      throw new Error(`fake transport: ${fn} is not a read-only on the drops contract`);
    }
    if (args.length !== sig.argCount) {
      throw new Error(`fake transport: arity mismatch for ${fn}: ${args.length} != ${sig.argCount}`);
    }
    const response = responses[fn];
    if (response === undefined) throw new Error(`fake transport: no scripted response for ${fn}`);
    return typeof response === 'function' ? response(args) : response;
  };

const makeReads = (responses: Record<string, Scripted>): DropsReads =>
  new DropsReads({ dropsContractId: DROPS, transport: makeFake(responses) });

const dropTuple = (overrides: Record<string, ClarityValue> = {}): ClarityValue =>
  Cl.some(
    Cl.tuple({
      creator: Cl.principal(OWNER),
      collection: Cl.principal(COLLECTION),
      mode: Cl.uint(3),
      status: Cl.uint(1),
      'start-block': Cl.uint(10),
      'end-block': Cl.uint(0),
      'total-limit': Cl.uint(0),
      'per-wallet-limit': Cl.uint(2),
      eligibility: Cl.uint(1),
      'fee-budget-total': Cl.uint(1_000_000),
      'fee-budget-remaining': Cl.uint(400_000),
      'fees-settled': Cl.uint(3),
      'inventory-count': Cl.uint(12),
      'ranges-total': Cl.uint(10),
      'range-count': Cl.uint(2),
      'explicit-count': Cl.uint(2),
      'escrowed-count': Cl.uint(8),
      'claimed-count': Cl.uint(4),
      'reserved-count': Cl.uint(1),
      'free-count': Cl.uint(0),
      cursor: Cl.uint(5),
      'created-at': Cl.uint(100),
      'ended-at': Cl.none(),
      ...overrides
    })
  );

describe('drops codecs', () => {
  it('decodeDrop round-trips the full tuple, including status name + ended-at', () => {
    const drop = decodeDrop(dropTuple({ status: Cl.uint(3), 'ended-at': Cl.some(Cl.uint(900)) }))!;
    expect(drop).toMatchObject({
      creator: OWNER,
      collection: COLLECTION,
      mode: 3,
      status: 3,
      statusName: 'ended',
      startBlock: 10,
      endBlock: 0,
      totalLimit: 0,
      perWalletLimit: 2,
      eligibility: 1,
      feeBudgetTotal: 1_000_000n,
      feeBudgetRemaining: 400_000n,
      feesSettled: 3,
      inventoryCount: 12,
      rangesTotal: 10,
      rangeCount: 2,
      explicitCount: 2,
      escrowedCount: 8,
      claimedCount: 4,
      reservedCount: 1,
      freeCount: 0,
      cursor: 5,
      createdAt: 100,
      endedAt: 900
    });
    expect(decodeDrop(Cl.none())).toBeNull();
    expect(decodeDrop(dropTuple())!.endedAt).toBeNull();
  });

  it('rejects unknown status codes', () => {
    expect(() => decodeDrop(dropTuple({ status: Cl.uint(9) }))).toThrow(/unknown drop status/);
  });
});

describe('DropsReads — scalar read-onlys', () => {
  it('decodes vars, constants and optionals', async () => {
    const reads = makeReads({
      'get-next-drop-id': Cl.ok(Cl.uint(7)),
      'get-owner': Cl.ok(Cl.principal(OWNER)),
      'get-pending-owner': Cl.ok(Cl.none()),
      'get-sponsor': Cl.ok(Cl.principal(OWNER)),
      'get-attestor-pubkey-hash': Cl.ok(Cl.some(Cl.bufferFromHex('ab'.repeat(20)))),
      'get-claim-fee-cap': Cl.ok(Cl.uint(2_000_000)),
      'get-min-fee-budget': Cl.ok(Cl.uint(50_000)),
      'get-refund-delay': Cl.ok(Cl.uint(144)),
      'get-reservation-expiry': Cl.ok(Cl.uint(144)),
      'is-paused': Cl.ok(Cl.bool(false)),
      'get-nft-contract': Cl.ok(Cl.principal(COLLECTION)),
      'get-wallet-claims': Cl.ok(Cl.uint(2)),
      'get-remaining': Cl.ok(Cl.uint(9)),
      'is-item-claimed': Cl.ok(Cl.bool(true)),
      'get-escrowed-token': Cl.some(Cl.uint(77)),
      'get-allowlist-entry': Cl.none(),
      'get-claim-reservation': Cl.some(Cl.tuple({ index: Cl.uint(3), 'reserved-at': Cl.uint(50) })),
      'get-claim': Cl.some(
        Cl.tuple({ index: Cl.uint(1), claimer: Cl.principal(OWNER), 'claimed-at': Cl.uint(60) })
      ),
      'get-drop-range': Cl.some(
        Cl.tuple({ start: Cl.uint(0), end: Cl.uint(5), 'cum-before': Cl.uint(0) })
      )
    });
    expect(await reads.getNextDropId()).toBe(7);
    expect(await reads.getOwner()).toBe(OWNER);
    expect(await reads.getPendingOwner()).toBeNull();
    expect(await reads.getSponsor()).toBe(OWNER);
    expect(await reads.getAttestorPubkeyHash()).toBe('ab'.repeat(20));
    expect(await reads.getClaimFeeCap()).toBe(2_000_000n);
    expect(await reads.getMinFeeBudget()).toBe(50_000n);
    expect(await reads.getRefundDelay()).toBe(144);
    expect(await reads.getReservationExpiry()).toBe(144);
    expect(await reads.isPaused()).toBe(false);
    expect(await reads.getNftContract()).toBe(COLLECTION);
    expect(await reads.getWalletClaims(0, OWNER)).toBe(2);
    expect(await reads.getRemaining(0)).toBe(9);
    expect(await reads.isItemClaimed(0, 1)).toBe(true);
    expect(await reads.getEscrowedToken(0, 1)).toBe(77);
    expect(await reads.getAllowlistEntry(0, OWNER)).toBeNull();
    expect(await reads.getClaimReservation(0, OWNER)).toEqual({ index: 3, reservedAt: 50 });
    expect(await reads.getClaim(0, 0)).toEqual({ index: 1, claimer: OWNER, claimedAt: 60 });
    expect(await reads.getDropRange(0, 0)).toEqual({ start: 0, end: 5, cumBefore: 0 });
  });

  it('maps drops (err uNNN) responses onto the u200 error table', async () => {
    const reads = makeReads({ 'get-remaining': Cl.error(Cl.uint(201)) });
    await expect(reads.getRemaining(9)).rejects.toThrow(/u201 ERR-NOT-FOUND/);
  });
});

describe('DropsReads — resolveInventory', () => {
  it('expands range segments in order, then explicit slots', async () => {
    // ranges: [0,5) and [20,25) (rangesTotal 10), explicit slots -> 42, 99.
    const ranges = [
      Cl.some(Cl.tuple({ start: Cl.uint(0), end: Cl.uint(5), 'cum-before': Cl.uint(0) })),
      Cl.some(Cl.tuple({ start: Cl.uint(20), end: Cl.uint(25), 'cum-before': Cl.uint(5) }))
    ];
    const explicitBySlot: Record<number, number> = { 10: 42, 11: 99 };
    const reads = makeReads({
      'get-drop': dropTuple(),
      'get-drop-range': (args) => ranges[Number((args[1] as { value: bigint }).value)] ?? Cl.none(),
      'get-inventory-slot': (args) => {
        const slot = Number((args[1] as { value: bigint }).value);
        const index = explicitBySlot[slot];
        return Cl.ok(index !== undefined ? Cl.some(Cl.uint(index)) : Cl.none());
      }
    });
    expect(await reads.resolveInventory(0)).toEqual([0, 1, 2, 3, 4, 20, 21, 22, 23, 24, 42, 99]);
  });

  it('fails loudly on missing ranges or slots, and on unknown drops', async () => {
    const missing = makeReads({ 'get-drop': dropTuple(), 'get-drop-range': Cl.none() });
    await expect(missing.resolveInventory(0)).rejects.toThrow(/missing range seq 0/);
    const unknown = makeReads({ 'get-drop': Cl.none() });
    await expect(unknown.resolveInventory(3)).rejects.toThrow(XtrataClientError);
  });
});

describe('DropsReads — composites', () => {
  it('getDropSummary combines the drop row with remaining + escrow status', async () => {
    const reads = makeReads({
      'get-drop': dropTuple(),
      'get-remaining': Cl.ok(Cl.uint(7))
    });
    const summary = await reads.getDropSummary(2);
    expect(summary.dropId).toBe(2);
    expect(summary.remaining).toBe(7);
    // escrowed 8 + claimed 4 >= inventory 12 -> fully escrowed
    expect(summary.fullyEscrowed).toBe(true);
    expect(summary.drop.statusName).toBe('active');
  });

  it('getAllClaims walks get-claims-scan pages', async () => {
    const claim = (index: number): ClarityValue =>
      Cl.some(Cl.tuple({ index: Cl.uint(index), claimer: Cl.principal(OWNER), 'claimed-at': Cl.uint(1) }));
    const reads = makeReads({
      'get-drop': dropTuple({ 'claimed-count': Cl.uint(60) }),
      'get-claims-scan': (args) => {
        const start = Number((args[1] as { value: bigint }).value);
        const count = start === 0 ? 50 : 10;
        return Cl.ok(Cl.list(Array.from({ length: count }, (_, i) => claim(start + i))));
      }
    });
    const claims = await reads.getAllClaims(0);
    expect(claims).toHaveLength(60);
    expect(claims[59]!.index).toBe(59);
  });
});
