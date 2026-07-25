import { createHash } from 'node:crypto';
import { tx, type Tx } from '@stacks/clarinet-sdk';
import { Cl, ClarityType, cvToValue } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

/**
 * The complete brief workflow in one test (08-TEST-PLAN.md §"Integration
 * scenarios"):
 *
 *   creator inscribes 100 items across several tx batches
 *     → ONE dense, ordered collection
 *     → whole-collection drop selection
 *     → escrow in ceil(100/25) = 4 batches
 *     → activate
 *     → concurrent claims incl. a same-block race for the last claimable item
 *     → claim reservation expiry + permissionless release
 *     → creator ends the drop, recovers leftovers (NFTs back, assignments
 *       cleared, budget refunded)
 *     → collection finalize
 *
 * plus the two duplication guards: an assigned/claimed item can never be added
 * to another drop, and no item can be claimed twice.
 */

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const creator = accounts.get('wallet_1')!;
const sponsor = accounts.get('wallet_5')!;
const claimers = [
  accounts.get('wallet_2')!,
  accounts.get('wallet_3')!,
  accounts.get('wallet_4')!,
  accounts.get('wallet_6')!,
  accounts.get('wallet_7')!,
  accounts.get('wallet_8')!
];

const core = `${deployer}.mock-xtrata-core`;
const coll = `${deployer}.xtrata-collection-v3`;
const drops = `${deployer}.xtrata-drops-v3`;
const corePrincipal = Cl.contractPrincipal(deployer, 'mock-xtrata-core');
const collPrincipal = Cl.contractPrincipal(deployer, 'xtrata-collection-v3');
const dropsContractPrincipal = `${deployer}.xtrata-drops-v3`;
const mime = 'text/plain';

const COLLECTION_SIZE = 100;
const TOTAL_LIMIT = 12;

const COLL_ERR = { MAX_SUPPLY: 104, INVALID_BATCH: 107, ALREADY_ASSIGNED: 122 };
const ERR = {
  NOT_AUTHORIZED: 200, INVALID_STATUS: 203, NOT_ACTIVE: 211,
  SOLD_OUT: 214, ALREADY_CLAIMED: 220, RESERVATION_NOT_EXPIRED: 222
};
const MODE_SPONSORED = 3;
const STATUS = { ACTIVE: 1, ENDED: 3 };
const MIN_FEE_BUDGET = 50_000n;
const REFUND_DELAY = 144;
const RESERVATION_EXPIRY = 144;
const MAX_ESCROW_BATCH = 25;
const MAX_ASSIGN_RANGE = 50; // collection bound on assign-range-to-drop

// --- helpers ---

function makeChunks(seed: number, n: number): Uint8Array[] {
  return Array.from({ length: n }, (_, i) =>
    Uint8Array.from([seed & 0xff, (seed >> 8) & 0xff, i & 0xff, 7])
  );
}

function finalHash(chunks: Uint8Array[]): Uint8Array {
  let running = Buffer.alloc(32, 0);
  for (const chunk of chunks) {
    running = createHash('sha256').update(Buffer.concat([running, Buffer.from(chunk)])).digest();
  }
  return Uint8Array.from(running);
}

function totalSize(chunks: Uint8Array[]): number {
  return chunks.reduce((s, c) => s + c.length, 0);
}

function call(contract: string, fn: string, args: any[], sender: string) {
  return simnet.callPublicFn(contract, fn, args, sender).result;
}

function read(contract: string, fn: string, args: any[] = []) {
  return simnet.callReadOnlyFn(contract, fn, args, deployer).result;
}

function unwrapOk(result: any) {
  expect(result.type, `expected ok, got ${JSON.stringify(cvToValue(result))}`).toBe(ClarityType.ResponseOk);
  return result.value;
}

function stx(address: string): bigint {
  return simnet.getAssetsMap().get('STX')!.get(address) ?? 0n;
}

function info(): any {
  return cvToValue(read(coll, 'get-collection-info')).value;
}

function getDrop(dropId: bigint): any {
  return cvToValue(read(drops, 'get-drop', [Cl.uint(dropId)])).value;
}

function dropNum(dropId: bigint, field: string): bigint {
  return BigInt(getDrop(dropId)[field].value);
}

function nftOwner(tokenId: bigint): string | null {
  const inner = unwrapOk(read(core, 'get-owner', [Cl.uint(tokenId)]));
  if (inner.type === ClarityType.OptionalNone) return null;
  return cvToValue(inner.value);
}

/**
 * cvToValue on a list yields cvToJSON entries; an `(optional tuple)` element is
 * wrapped one level deeper than a bare tuple. Normalise both shapes.
 */
function tupleOf(entry: any): any {
  return entry.value?.value ?? entry.value;
}

function groups<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function mineAllOk(txs: Tx[], label: string): void {
  if (txs.length === 0) return;
  simnet.mineBlock(txs).forEach((r, i) => {
    expect(r.result.type, `${label}[${i}]: ${JSON.stringify(cvToValue(r.result))}`)
      .toBe(ClarityType.ResponseOk);
  });
}

interface Item {
  index: number;
  chunks: Uint8Array[];
  hash: Uint8Array;
  staged: boolean;
  tokenId?: bigint;
}

describe('end-to-end: 100-item collection → whole-collection sponsored drop → claims → recovery → finalize', () => {
  it('runs the full brief workflow', () => {
    // ================= 1. inscribe 100 items across several tx batches ======
    unwrapOk(call(coll, 'set-collection-metadata', [
      Cl.stringAscii('Century'), Cl.stringAscii('CENT'),
      Cl.stringAscii('100-item end-to-end collection'),
      Cl.stringAscii('ipfs://artwork'), Cl.stringAscii('ipfs://base/')
    ], deployer));
    unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(1), Cl.uint(COLLECTION_SIZE)], deployer));
    unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], deployer));
    unwrapOk(call(coll, 'set-drops-authority',
      [Cl.some(Cl.contractPrincipal(deployer, 'xtrata-drops-v3'))], deployer));

    // Items 0..19 go through the staged path (one of them multi-batch at the
    // 32/33 boundary); 20..99 through the single-tx path. Batches are mined in
    // differently sized blocks so ordering cannot depend on grouping.
    const items: Item[] = Array.from({ length: COLLECTION_SIZE }, (_, index) => {
      const staged = index < 20;
      const chunkCount = index === 0 ? 33 : index === 1 ? 32 : 1;
      const chunks = makeChunks(5000 + index, chunkCount);
      return { index, chunks, hash: finalHash(chunks), staged };
    });
    const staged = items.filter((i) => i.staged);

    for (const group of groups(staged, 6)) {
      mineAllOk(group.map((item) => tx.callPublicFn(coll, 'mint-begin', [
        corePrincipal, Cl.buffer(item.hash), Cl.stringAscii(mime),
        Cl.uint(totalSize(item.chunks)), Cl.uint(item.chunks.length)
      ], creator)), 'mint-begin');
    }
    const uploads: Tx[] = [];
    for (const item of staged) {
      for (let s = 0; s < item.chunks.length; s += 32) {
        uploads.push(tx.callPublicFn(coll, 'mint-add-chunk-batch', [
          corePrincipal, Cl.buffer(item.hash),
          Cl.list(item.chunks.slice(s, s + 32).map((c) => Cl.buffer(c)))
        ], creator));
      }
    }
    for (const group of groups(uploads, 7)) mineAllOk(group, 'chunks');

    // Seal all 20 staged items in ONE seal batch, in reverse order.
    unwrapOk(call(coll, 'mint-seal-batch', [
      corePrincipal,
      Cl.list([...staged].reverse().map((item) =>
        Cl.tuple({ hash: Cl.buffer(item.hash), 'token-uri': Cl.stringAscii('ipfs://e2e') })))
    ], creator));

    for (const group of groups(items.filter((i) => !i.staged), 10)) {
      mineAllOk(group.map((item) => tx.callPublicFn(coll, 'mint-small-single-tx', [
        corePrincipal, Cl.buffer(item.hash), Cl.stringAscii(mime),
        Cl.uint(totalSize(item.chunks)),
        Cl.list(item.chunks.map((c) => Cl.buffer(c))),
        Cl.stringAscii('ipfs://e2e')
      ], creator)), 'single-tx');
    }

    // ================= 2. ONE ordered, dense collection ======================
    expect(Number(info()['minted-count'].value)).toBe(COLLECTION_SIZE);
    expect(Number(info()['reserved-count'].value)).toBe(0);
    expect(Number(info()['free-count'].value)).toBe(0);
    expect(Number(info()['next-index'].value)).toBe(COLLECTION_SIZE);
    for (const item of items) {
      const row = cvToValue(read(coll, 'get-item', [Cl.uint(item.index)]));
      expect(row, `index ${item.index}`).not.toBeNull();
      expect(row.value['content-hash'].value).toBe('0x' + Buffer.from(item.hash).toString('hex'));
      expect(row.value['owner-at-mint'].value).toBe(creator);
      item.tokenId = BigInt(row.value['token-id'].value);
    }
    expect(new Set(items.map((i) => i.tokenId)).size).toBe(COLLECTION_SIZE);
    // Supply exactly exhausted.
    expect(call(coll, 'reserve', [Cl.buffer(finalHash(makeChunks(1, 1))), Cl.none()], creator))
      .toBeErr(Cl.uint(COLL_ERR.MAX_SUPPLY));

    // ================= 3. whole-collection drop selection ===================
    const dropId = unwrapOk(call(drops, 'create-drop', [
      collPrincipal, Cl.uint(MODE_SPONSORED), Cl.uint(1),
      Cl.uint(0), Cl.uint(0), Cl.uint(TOTAL_LIMIT), Cl.uint(0)
    ], creator)).value as bigint;

    // DOCUMENTED DEVIATION from 01-ARCHITECTURE §5 ("add-inventory-range(0,
    // minted-count) — 1 tx"): the collection bounds assign-range-to-drop at 50
    // indexes per call, so "the whole collection" for n > 50 is ceil(n/50)
    // range calls (still one *selection*, bounded per tx). The 100-wide range
    // is rejected up front rather than partially applied.
    expect(call(drops, 'add-inventory-range',
      [collPrincipal, Cl.uint(dropId), Cl.uint(0), Cl.uint(COLLECTION_SIZE)], creator))
      .toBeErr(Cl.uint(COLL_ERR.INVALID_BATCH));
    expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(0)]))).toBeNull();
    expect(dropNum(dropId, 'inventory-count')).toBe(0n);

    for (let start = 0; start < COLLECTION_SIZE; start += MAX_ASSIGN_RANGE) {
      const end = Math.min(start + MAX_ASSIGN_RANGE, COLLECTION_SIZE);
      expect(call(drops, 'add-inventory-range',
        [collPrincipal, Cl.uint(dropId), Cl.uint(start), Cl.uint(end)], creator))
        .toBeOk(Cl.uint(end - start));
    }
    expect(dropNum(dropId, 'inventory-count')).toBe(BigInt(COLLECTION_SIZE));
    expect(dropNum(dropId, 'range-count')).toBe(2n);

    // Every collection index is assigned to exactly this drop, and the scan
    // agrees across both pages.
    for (let page = 0; page < COLLECTION_SIZE; page += 50) {
      const scan = cvToValue(unwrapOk(read(coll, 'get-unassigned-scan', [Cl.uint(page)])));
      expect(scan.length).toBe(50);
      for (const entry of scan) {
        expect(entry.value.minted.value).toBe(true);
        expect(entry.value.assigned.value).toBe(true);
      }
    }
    const a0 = cvToValue(read(coll, 'get-assignment', [Cl.uint(0)]));
    expect(a0.value['drop-contract'].value).toBe(dropsContractPrincipal);
    expect(BigInt(a0.value['drop-id'].value)).toBe(dropId);

    // Inventory cannot be duplicated: not into another drop, not into itself.
    const rival = unwrapOk(call(drops, 'create-drop', [
      collPrincipal, Cl.uint(1), Cl.uint(1), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0)
    ], creator)).value as bigint;
    expect(call(drops, 'add-inventory-items',
      [collPrincipal, Cl.uint(rival), Cl.list([Cl.uint(7)])], creator))
      .toBeErr(Cl.uint(COLL_ERR.ALREADY_ASSIGNED));
    expect(call(drops, 'add-inventory-range',
      [collPrincipal, Cl.uint(dropId), Cl.uint(0), Cl.uint(10)], creator))
      .toBeErr(Cl.uint(COLL_ERR.ALREADY_ASSIGNED));

    // ================= 4. escrow in ceil(100/25) = 4 batches =================
    const escrowBatches = groups(items, MAX_ESCROW_BATCH);
    expect(escrowBatches).toHaveLength(Math.ceil(COLLECTION_SIZE / MAX_ESCROW_BATCH));
    expect(escrowBatches).toHaveLength(4);
    for (const batch of escrowBatches) {
      expect(call(drops, 'escrow-batch', [
        Cl.uint(dropId),
        Cl.list(batch.map((item) =>
          Cl.tuple({ index: Cl.uint(item.index), 'token-id': Cl.uint(item.tokenId!) })))
      ], creator)).toBeOk(Cl.uint(batch.length));
    }
    expect(dropNum(dropId, 'escrowed-count')).toBe(BigInt(COLLECTION_SIZE));
    expect(nftOwner(items[0]!.tokenId!)).toBe(dropsContractPrincipal);

    // ================= 5. fund + activate ===================================
    const budget = MIN_FEE_BUDGET * BigInt(TOTAL_LIMIT);
    unwrapOk(call(drops, 'fund-budget', [Cl.uint(dropId), Cl.uint(budget)], creator));
    unwrapOk(call(drops, 'activate-drop', [Cl.uint(dropId)], creator));
    expect(dropNum(dropId, 'status')).toBe(BigInt(STATUS.ACTIVE));
    unwrapOk(call(drops, 'set-sponsor', [Cl.principal(sponsor)], deployer));
    // Escrowed budget is fully accounted for by the contract's STX balance.
    expect(stx(dropsContractPrincipal)).toBe(budget);

    // ================= 6. claim reservation expiry + release ================
    expect(call(drops, 'reserve-claim', [Cl.uint(dropId)], claimers[0]!)).toBeOk(Cl.uint(0));
    expect(dropNum(dropId, 'reserved-count')).toBe(1n);
    expect(call(drops, 'release-expired-claim', [Cl.uint(dropId), Cl.principal(claimers[0]!)], claimers[1]!))
      .toBeErr(Cl.uint(ERR.RESERVATION_NOT_EXPIRED));
    simnet.mineEmptyBlocks(RESERVATION_EXPIRY);
    expect(call(drops, 'release-expired-claim', [Cl.uint(dropId), Cl.principal(claimers[0]!)], claimers[1]!))
      .toBeOk(Cl.uint(0));
    expect(dropNum(dropId, 'reserved-count')).toBe(0n);
    expect(dropNum(dropId, 'free-count')).toBe(1n);

    // ================= 7. concurrent claims =================================
    // The released index 0 is handed out first (free-list before cursor).
    unwrapOk(call(drops, 'claim', [Cl.uint(dropId)], claimers[1]!));
    expect(nftOwner(items[0]!.tokenId!)).toBe(claimers[1]!);

    // Claim concurrently, several wallets per block, up to one short of the
    // total limit.
    const claimedBy = new Map<number, string>();
    claimedBy.set(0, claimers[1]!);
    let claimed = 1;
    while (claimed < TOTAL_LIMIT - 1) {
      const batch: Tx[] = [];
      for (let i = 0; i < 3 && claimed + batch.length < TOTAL_LIMIT - 1; i += 1) {
        batch.push(tx.callPublicFn(drops, 'claim', [Cl.uint(dropId)],
          claimers[(claimed + i) % claimers.length]!));
      }
      mineAllOk(batch, 'claim');
      claimed += batch.length;
    }
    expect(dropNum(dropId, 'claimed-count')).toBe(BigInt(TOTAL_LIMIT - 1));

    // Race for the last claimable item: two wallets claim in the SAME block.
    const raceA = claimers[0]!;
    const raceB = claimers[3]!;
    const race = simnet.mineBlock([
      tx.callPublicFn(drops, 'claim', [Cl.uint(dropId)], raceA),
      tx.callPublicFn(drops, 'claim', [Cl.uint(dropId)], raceB)
    ]);
    const okCount = race.filter((r) => r.result.type === ClarityType.ResponseOk).length;
    expect(okCount).toBe(1);
    expect(race.find((r) => r.result.type === ClarityType.ResponseErr)!.result)
      .toBeErr(Cl.uint(ERR.SOLD_OUT));
    expect(dropNum(dropId, 'claimed-count')).toBe(BigInt(TOTAL_LIMIT));
    // Total limit is hard: nobody else gets in.
    expect(call(drops, 'claim', [Cl.uint(dropId)], claimers[4]!)).toBeErr(Cl.uint(ERR.SOLD_OUT));

    // No item claimed twice: every claim row has a distinct index, and each is
    // flagged exactly once.
    const claimedIndexes: number[] = [];
    for (let start = 0; start < TOTAL_LIMIT; start += 50) {
      const scan = cvToValue(unwrapOk(read(drops, 'get-claims-scan', [Cl.uint(dropId), Cl.uint(start)])));
      for (const entry of scan) claimedIndexes.push(Number(tupleOf(entry).index.value));
    }
    expect(claimedIndexes).toHaveLength(TOTAL_LIMIT);
    expect(new Set(claimedIndexes).size).toBe(TOTAL_LIMIT);
    for (const index of claimedIndexes) {
      expect(read(drops, 'is-item-claimed', [Cl.uint(dropId), Cl.uint(index)])).toBeOk(Cl.bool(true));
      // The NFT left escrow and is no longer held by the contract.
      expect(nftOwner(items[index]!.tokenId!)).not.toBe(dropsContractPrincipal);
    }
    expect(dropNum(dropId, 'escrowed-count')).toBe(BigInt(COLLECTION_SIZE - TOTAL_LIMIT));

    // ================= 8. sponsor settlement ================================
    for (let i = 0; i < TOTAL_LIMIT; i += 1) {
      unwrapOk(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(20_000)], sponsor));
    }
    const settled = 20_000n * BigInt(TOTAL_LIMIT);
    expect(dropNum(dropId, 'fee-budget-remaining')).toBe(budget - settled);
    // No strandable funds: contract balance == recoverable == escrowed - settled.
    expect(stx(dropsContractPrincipal)).toBe(budget - settled);

    // ================= 9. end + recover leftovers ===========================
    unwrapOk(call(drops, 'end-drop', [Cl.uint(dropId)], creator));
    expect(dropNum(dropId, 'status')).toBe(BigInt(STATUS.ENDED));
    expect(call(drops, 'claim', [Cl.uint(dropId)], claimers[2]!)).toBeErr(Cl.uint(ERR.NOT_ACTIVE));

    const claimedSet = new Set(claimedIndexes);
    const leftovers = items.map((i) => i.index).filter((i) => !claimedSet.has(i));
    expect(leftovers).toHaveLength(COLLECTION_SIZE - TOTAL_LIMIT);
    // A batch containing a claimed index is refused atomically.
    expect(call(drops, 'recover-batch', [
      collPrincipal, Cl.uint(dropId),
      Cl.list([Cl.uint(leftovers[0]!), Cl.uint(claimedIndexes[0]!)])
    ], creator)).toBeErr(Cl.uint(ERR.ALREADY_CLAIMED));
    // ...and recovery is creator-only.
    expect(call(drops, 'recover-batch', [
      collPrincipal, Cl.uint(dropId), Cl.list([Cl.uint(leftovers[0]!)])
    ], claimers[0]!)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));

    for (const batch of groups(leftovers, MAX_ESCROW_BATCH)) {
      expect(call(drops, 'recover-batch', [
        collPrincipal, Cl.uint(dropId), Cl.list(batch.map((i) => Cl.uint(i)))
      ], creator)).toBeOk(Cl.uint(batch.length));
    }
    expect(dropNum(dropId, 'escrowed-count')).toBe(0n);
    for (const index of leftovers) {
      expect(nftOwner(items[index]!.tokenId!)).toBe(creator);
      expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(index)]))).toBeNull();
    }
    // Claimed items keep their assignment (they are gone for good).
    for (const index of claimedIndexes) {
      expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(index)]))).not.toBeNull();
    }
    // Recovered indexes are re-selectable; claimed ones never are.
    expect(call(drops, 'add-inventory-items', [
      collPrincipal, Cl.uint(rival), Cl.list(leftovers.slice(0, 5).map((i) => Cl.uint(i)))
    ], creator)).toBeOk(Cl.uint(5));
    expect(call(drops, 'add-inventory-items', [
      collPrincipal, Cl.uint(rival), Cl.list([Cl.uint(claimedIndexes[0]!)])
    ], creator)).toBeErr(Cl.uint(COLL_ERR.ALREADY_ASSIGNED));

    // ================= 10. budget refund ====================================
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], creator)).toBeErr(Cl.uint(226));
    simnet.mineEmptyBlocks(REFUND_DELAY);
    const before = stx(creator);
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], creator))
      .toBeOk(Cl.uint(budget - settled));
    expect(stx(creator) - before).toBe(budget - settled);
    expect(dropNum(dropId, 'fee-budget-remaining')).toBe(0n);
    // Everything the drop escrowed for THIS drop is back out; nothing stranded.
    expect(stx(dropsContractPrincipal)).toBe(0n);

    // ================= 11. collection finalize ==============================
    unwrapOk(call(coll, 'finalize', [], deployer));
    expect(info().finalized.value).toBe(true);
    // Assignments and drops keep working post-finalize.
    expect(dropNum(rival, 'inventory-count')).toBe(5n);
  });
});
