import { createHash } from 'node:crypto';
import { tx, type Tx } from '@stacks/clarinet-sdk';
import { Cl, ClarityType, cvToValue } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

/**
 * Collection-size matrix (08-TEST-PLAN.md §"Collection-size matrix"):
 * plans of 1, 30, 31, 50, 51 and 100 items actually inscribed and indexed into
 * ONE collection on simnet through the mock core.
 *
 * Every size asserts the §3.2 invariants that only show up at scale:
 *   - every item indexed and indexes dense over [0, n)
 *   - ordering is deterministic and set at RESERVATION time, so it is
 *     independent of which transaction batch (or block) sealed each item —
 *     proved by sealing in reverse order, spread over differently sized blocks
 *   - seal-batch coalescing at the 50/51 boundary (one batch of 50; 51 must
 *     split 50 + 1, and a single 51-item batch is not even constructible)
 *   - exact supply exhaustion at n (the n+1-th reservation fails)
 *   - finalize succeeds (reserved == 0, free == 0, minted == max-supply)
 *
 * Runtime is kept sane with tiny chunks: the protocol shape (chunk counts,
 * batch bounds, hash chain) is what matters, not the payload size.
 */

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const w1 = accounts.get('wallet_1')!;
const w2 = accounts.get('wallet_2')!;

const coll = `${deployer}.xtrata-collection-v3`;
const corePrincipal = Cl.contractPrincipal(deployer, 'mock-xtrata-core');
const mime = 'text/plain';

const ERR = { MAX_SUPPLY: 104, INVALID_BATCH: 107 };
const MODE_FIXED = 1;

/** Chunk batch bound of the v3.2.3 core, and the seal-batch bound. */
const MAX_CHUNK_BATCH = 32;
const MAX_SEAL_BATCH = 50;

// --- helpers (same conventions as xtrata-collection-v3.test.ts) ---

function makeChunks(seed: number, n: number): Uint8Array[] {
  return Array.from({ length: n }, (_, i) =>
    Uint8Array.from([seed & 0xff, (seed >> 8) & 0xff, i & 0xff, 7])
  );
}

// Real core hash chain: H0 = 32 zero bytes, H(i+1) = sha256(H(i) || chunk_i)
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

function info(): any {
  return cvToValue(read(coll, 'get-collection-info')).value;
}

function num(field: string): number {
  return Number(info()[field].value);
}

/** Mine a list of txs as ONE block; every result must be ok. */
function mineAllOk(txs: Tx[], label: string): any[] {
  if (txs.length === 0) return [];
  const results = simnet.mineBlock(txs);
  results.forEach((r, i) => {
    expect(r.result.type, `${label}[${i}] expected ok, got ${JSON.stringify(cvToValue(r.result))}`)
      .toBe(ClarityType.ResponseOk);
  });
  return results.map((r) => (r.result as any).value);
}

function chunkGroups<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

// --- item plan ---

interface PlannedItem {
  index: number;
  chunks: Uint8Array[];
  hash: Uint8Array;
  staged: boolean;
}

/**
 * Staged items come first (they hold the reservation-ordered indexes), then
 * single-tx items. Items 0 and 1 sit on the 32/33-chunk boundary: 32 chunks is
 * exactly one `mint-add-chunk-batch`, 33 chunks forces a second one.
 */
function planItems(n: number): PlannedItem[] {
  const stagedCount = Math.min(n, MAX_SEAL_BATCH + 1); // 51 → exercises the 50/51 split
  return Array.from({ length: n }, (_, index) => {
    const staged = index < stagedCount;
    const chunkCount = staged && index === 0 ? MAX_CHUNK_BATCH : staged && index === 1 ? MAX_CHUNK_BATCH + 1 : 1;
    const chunks = makeChunks(1000 + index, chunkCount);
    return { index, chunks, hash: finalHash(chunks), staged };
  });
}

interface BuildResult {
  items: PlannedItem[];
  sealBatchSizes: number[];
}

function buildCollection(n: number): BuildResult {
  unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(MODE_FIXED), Cl.uint(n)], deployer));
  unwrapOk(call(coll, 'set-mint-price', [Cl.uint(0)], deployer));
  unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], deployer));

  const items = planItems(n);
  const staged = items.filter((i) => i.staged);
  const single = items.filter((i) => !i.staged);

  // 1. Reserve every staged item, in index order, spread over blocks of 7.
  //    mint-begin is reserve-or-resume, so this pins index == reservation order.
  for (const group of chunkGroups(staged, 7)) {
    mineAllOk(
      group.map((item) =>
        tx.callPublicFn(coll, 'mint-begin', [
          corePrincipal,
          Cl.buffer(item.hash),
          Cl.stringAscii(mime),
          Cl.uint(totalSize(item.chunks)),
          Cl.uint(item.chunks.length)
        ], w1)
      ),
      'mint-begin'
    );
  }
  // Indexes are handed out at reservation time, densely, in call order.
  staged.forEach((item) => {
    const session = cvToValue(read(coll, 'get-session', [Cl.principal(w1), Cl.buffer(item.hash)]));
    expect(Number(session.value.index.value), `session index for item ${item.index}`).toBe(item.index);
  });

  // 2. Upload chunks. Batches are bounded at 32; the 33-chunk item needs two.
  const uploadTxs: Tx[] = [];
  for (const item of staged) {
    for (let start = 0; start < item.chunks.length; start += MAX_CHUNK_BATCH) {
      const batch = item.chunks.slice(start, start + MAX_CHUNK_BATCH);
      uploadTxs.push(
        tx.callPublicFn(coll, 'mint-add-chunk-batch', [
          corePrincipal,
          Cl.buffer(item.hash),
          Cl.list(batch.map((c) => Cl.buffer(c)))
        ], w1)
      );
    }
  }
  for (const group of chunkGroups(uploadTxs, 5)) mineAllOk(group, 'mint-add-chunk-batch');

  // 3. Seal in REVERSE index order, coalesced at the 50-item bound. Sealing
  //    order and block grouping must not influence the collection index.
  const sealOrder = [...staged].reverse();
  const sealGroups = chunkGroups(sealOrder, MAX_SEAL_BATCH);
  const sealBatchSizes: number[] = [];
  for (const group of sealGroups) {
    const res = unwrapOk(call(coll, 'mint-seal-batch', [
      corePrincipal,
      Cl.list(group.map((item) =>
        Cl.tuple({ hash: Cl.buffer(item.hash), 'token-uri': Cl.stringAscii('ipfs://matrix') })
      ))
    ], w1));
    const val = cvToValue(res);
    expect(Number(val.count.value)).toBe(group.length);
    sealBatchSizes.push(group.length);
  }

  // 4. Remaining items via the single-tx path, in blocks of 10 (a different
  //    batching rhythm again).
  for (const group of chunkGroups(single, 10)) {
    mineAllOk(
      group.map((item) =>
        tx.callPublicFn(coll, 'mint-small-single-tx', [
          corePrincipal,
          Cl.buffer(item.hash),
          Cl.stringAscii(mime),
          Cl.uint(totalSize(item.chunks)),
          Cl.list(item.chunks.map((c) => Cl.buffer(c))),
          Cl.stringAscii('ipfs://matrix')
        ], w1)
      ),
      'mint-small-single-tx'
    );
  }

  return { items, sealBatchSizes };
}

// --- the matrix ---

describe('collection-size matrix end to end on simnet', () => {
  for (const n of [1, 30, 31, 50, 51, 100]) {
    it(`${n} items: dense indexes, batch-independent ordering, exhaustion, finalize`, () => {
      const { items, sealBatchSizes } = buildCollection(n);

      // --- every item indexed, indexes dense over [0, n) ---
      expect(num('minted-count')).toBe(n);
      expect(num('reserved-count')).toBe(0);
      expect(num('free-count')).toBe(0);
      expect(num('next-index')).toBe(n);

      const tokenIds: number[] = [];
      for (const item of items) {
        const row = cvToValue(read(coll, 'get-item', [Cl.uint(item.index)]));
        expect(row, `index ${item.index} must be minted`).not.toBeNull();
        // Ordering: index i holds the item RESERVED i-th, not the one sealed i-th.
        expect(row.value['content-hash'].value).toBe('0x' + Buffer.from(item.hash).toString('hex'));
        tokenIds.push(Number(row.value['token-id'].value));
      }
      // Dense with no holes and no index beyond the range.
      expect(read(coll, 'get-item', [Cl.uint(n)]).type).toBe(ClarityType.OptionalNone);
      // One core token per item, all distinct.
      expect(new Set(tokenIds).size).toBe(n);

      // HashIndex agrees with Items for every item (collection-level dedupe map).
      for (const item of items) {
        const hi = cvToValue(read(coll, 'get-hash-index', [Cl.buffer(item.hash)]));
        expect(Number(hi.value.index.value)).toBe(item.index);
      }

      // --- ordering is independent of the sealing batch ---
      const staged = items.filter((i) => i.staged);
      if (staged.length > 1) {
        // Staged items were sealed newest-index-first, so their core token ids
        // run opposite to their collection indexes: proof the index came from
        // the reservation, not from the seal tx.
        const stagedTokens = staged.map((i) => tokenIds[i.index]!);
        expect(stagedTokens[0]!).toBeGreaterThan(stagedTokens[stagedTokens.length - 1]!);
      }

      // --- seal-batch coalescing at the 50/51 boundary ---
      expect(sealBatchSizes.every((size) => size <= MAX_SEAL_BATCH)).toBe(true);
      expect(sealBatchSizes.reduce((a, b) => a + b, 0)).toBe(staged.length);
      if (staged.length === 50) expect(sealBatchSizes).toEqual([50]);
      if (staged.length === 51) expect(sealBatchSizes).toEqual([50, 1]);

      // --- exact supply exhaustion at n ---
      const extra = makeChunks(90_000 + n, 1);
      expect(call(coll, 'reserve', [Cl.buffer(finalHash(extra)), Cl.none()], w2))
        .toBeErr(Cl.uint(ERR.MAX_SUPPLY));

      // --- finalize ---
      unwrapOk(call(coll, 'finalize', [], deployer));
      expect(info().finalized.value).toBe(true);
    });
  }
});

describe('seal-batch bound at the 50/51 boundary', () => {
  it('a 51-item seal batch cannot even be constructed; 50 + 1 does the job', () => {
    unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(MODE_FIXED), Cl.uint(51)], deployer));
    unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], deployer));

    const items = Array.from({ length: 51 }, (_, i) => {
      const chunks = makeChunks(2000 + i, 1);
      return { chunks, hash: finalHash(chunks) };
    });
    for (const group of chunkGroups(items, 10)) {
      mineAllOk(
        group.flatMap((item) => [
          tx.callPublicFn(coll, 'mint-begin', [
            corePrincipal, Cl.buffer(item.hash), Cl.stringAscii(mime),
            Cl.uint(totalSize(item.chunks)), Cl.uint(item.chunks.length)
          ], w1),
          tx.callPublicFn(coll, 'mint-add-chunk-batch', [
            corePrincipal, Cl.buffer(item.hash),
            Cl.list(item.chunks.map((c) => Cl.buffer(c)))
          ], w1)
        ]),
        'stage'
      );
    }

    const entries = items.map((item) =>
      Cl.tuple({ hash: Cl.buffer(item.hash), 'token-uri': Cl.stringAscii('ipfs://x') })
    );
    // 51 exceeds the (list 50 ...) type — rejected before any state changes.
    let failed = false;
    try {
      const res = call(coll, 'mint-seal-batch', [corePrincipal, Cl.list(entries)], w1);
      failed = res.type === ClarityType.ResponseErr;
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
    expect(num('minted-count')).toBe(0);

    // The planner's answer: 50 + 1.
    expect(BigInt(cvToValue(unwrapOk(
      call(coll, 'mint-seal-batch', [corePrincipal, Cl.list(entries.slice(0, 50))], w1)
    )).count.value)).toBe(50n);
    expect(BigInt(cvToValue(unwrapOk(
      call(coll, 'mint-seal-batch', [corePrincipal, Cl.list(entries.slice(50))], w1)
    )).count.value)).toBe(1n);
    expect(num('minted-count')).toBe(51);
    unwrapOk(call(coll, 'finalize', [], deployer));
  });
});

describe('ordering survives interleaved wallets and cancelled reservations', () => {
  it('two wallets interleave reservations; a cancelled index is recycled and the collection still finalizes dense', () => {
    unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(MODE_FIXED), Cl.uint(6)], deployer));
    unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], deployer));

    const items = Array.from({ length: 6 }, (_, i) => {
      const chunks = makeChunks(3000 + i, 1);
      return { chunks, hash: finalHash(chunks), owner: i % 2 === 0 ? w1 : w2 };
    });

    // Interleaved reservations in one block: index == order within the block.
    mineAllOk(
      items.map((item) => tx.callPublicFn(coll, 'reserve', [Cl.buffer(item.hash), Cl.none()], item.owner)),
      'reserve'
    );
    items.forEach((item, i) => {
      const session = cvToValue(read(coll, 'get-session', [Cl.principal(item.owner), Cl.buffer(item.hash)]));
      expect(Number(session.value.index.value)).toBe(i);
    });

    // Cancel index 2; the freed index is recycled by the next reservation.
    unwrapOk(call(coll, 'cancel-reservation', [Cl.buffer(items[2]!.hash)], items[2]!.owner));
    expect(read(coll, 'get-free-count')).toBeOk(Cl.uint(1));
    const replacementChunks = makeChunks(4000, 1);
    const replacementHash = finalHash(replacementChunks);
    expect(call(coll, 'reserve', [Cl.buffer(replacementHash), Cl.none()], w2)).toBeOk(Cl.uint(2));
    expect(read(coll, 'get-free-count')).toBeOk(Cl.uint(0));

    // Mint everything; the replacement occupies index 2.
    const finalItems = items.map((item, i) =>
      i === 2 ? { chunks: replacementChunks, hash: replacementHash, owner: w2 } : item
    );
    for (const item of finalItems) {
      unwrapOk(call(coll, 'mint-begin', [
        corePrincipal, Cl.buffer(item.hash), Cl.stringAscii(mime),
        Cl.uint(totalSize(item.chunks)), Cl.uint(item.chunks.length)
      ], item.owner));
      unwrapOk(call(coll, 'mint-add-chunk-batch', [
        corePrincipal, Cl.buffer(item.hash), Cl.list(item.chunks.map((c) => Cl.buffer(c)))
      ], item.owner));
      unwrapOk(call(coll, 'mint-seal', [
        corePrincipal, Cl.buffer(item.hash), Cl.stringAscii('ipfs://x')
      ], item.owner));
    }

    expect(num('minted-count')).toBe(6);
    expect(num('free-count')).toBe(0);
    finalItems.forEach((item, i) => {
      const row = cvToValue(read(coll, 'get-item', [Cl.uint(i)]));
      expect(row.value['content-hash'].value).toBe('0x' + Buffer.from(item.hash).toString('hex'));
      expect(row.value['owner-at-mint'].value).toBe(item.owner);
    });
    unwrapOk(call(coll, 'finalize', [], deployer));
  });
});
