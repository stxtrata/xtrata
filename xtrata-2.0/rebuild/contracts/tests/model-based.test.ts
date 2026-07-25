import { createHash } from 'node:crypto';
import { Cl, ClarityType, cvToValue } from '@stacks/transactions';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

/**
 * Model/property tests (08-TEST-PLAN.md §"Model-based tests").
 *
 * fast-check generates random interleavings of the protocol's operations over
 * 2–4 actor wallets; after EVERY operation — successful or rejected — the full
 * invariant set from 01-ARCHITECTURE §3.2 / §4.2 is machine-checked against
 * chain state:
 *
 *   1. minted + reserved <= max-supply (never oversubscribed)
 *   2. minted indexes ∪ session indexes ∪ free-list == [0, next-index),
 *      pairwise disjoint, no duplicates
 *   3. an index is assigned to at most one drop, only when minted
 *   4. claimed + reserved <= inventory-count; no index claimed twice
 *   5. budget-remaining is never negative and never exceeds the funded total
 *   6. no strandable funds: for every drop
 *         fee-budget-remaining == funded - settled - refunded
 *      and the contract's STX balance == Σ fee-budget-remaining
 *   7. escrow bookkeeping: escrowed-count == escrow rows == NFTs actually held
 *
 * Sequences are drawn with a FIXED seed and each one runs in its own `it`, so
 * every sequence starts from a pristine simnet (the clarinet vitest
 * environment resets between tests) and any failure names the exact sequence.
 */

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const sponsorWallet = accounts.get('wallet_5')!;
const ACTORS = [
  accounts.get('wallet_1')!,
  accounts.get('wallet_2')!,
  accounts.get('wallet_3')!,
  accounts.get('wallet_4')!
];
/** Drop creator + escrow owner. Actor 0 so it also mints in the model. */
const CREATOR = ACTORS[0]!;

const core = `${deployer}.mock-xtrata-core`;
const coll = `${deployer}.xtrata-collection-v3`;
const drops = `${deployer}.xtrata-drops-v3`;
const corePrincipal = Cl.contractPrincipal(deployer, 'mock-xtrata-core');
const collPrincipal = Cl.contractPrincipal(deployer, 'xtrata-collection-v3');
const dropsPrincipal = `${deployer}.xtrata-drops-v3`;
const mime = 'text/plain';

const CONTENT_COUNT = 10;
const MAX_ASSIGN_BATCH = 50;
const MAX_ESCROW_BATCH = 25;
const MAX_RECOVER_BATCH = 25;

// --- primitives -------------------------------------------------------------

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

function call(contract: string, fn: string, args: any[], sender: string) {
  return simnet.callPublicFn(contract, fn, args, sender).result;
}

function isOk(result: any): boolean {
  return result.type === ClarityType.ResponseOk;
}

function errCode(result: any): number | null {
  return result.type === ClarityType.ResponseErr ? Number(result.value.value) : null;
}

/**
 * Anti-vacuity instrumentation: a property suite whose sequences never reach
 * an interesting state proves nothing. Successful operations are counted here
 * and asserted at the end of the file.
 */
const COVERAGE: Record<string, number> = {};
const hit = (name: string): void => { COVERAGE[name] = (COVERAGE[name] ?? 0) + 1; };
function record(name: string, result: any): any {
  if (isOk(result)) hit(name);
  return result;
}

function unwrapOk(result: any) {
  expect(result.type, `expected ok, got ${JSON.stringify(cvToValue(result))}`).toBe(ClarityType.ResponseOk);
  return result.value;
}

function uintVar(contract: string, name: string): number {
  return Number((simnet.getDataVar(contract, name) as any).value);
}

/**
 * Direct map read. clarinet-sdk THROWS ("value not found") for a missing key
 * rather than returning `none`, so absence is normalised to null here.
 */
function mapEntry(contract: string, map: string, key: any): any | null {
  let cv: any;
  try {
    cv = simnet.getMapEntry(contract, map, key);
  } catch {
    return null;
  }
  if (cv === undefined || cv === null) return null;
  if (cv.type === ClarityType.OptionalNone) return null;
  return cv.type === ClarityType.OptionalSome ? cv.value : cv;
}

function stx(address: string): bigint {
  return simnet.getAssetsMap().get('STX')!.get(address) ?? 0n;
}

const contents = Array.from({ length: CONTENT_COUNT }, (_, i) => {
  const chunks = makeChunks(7000 + i, 1);
  return { chunks, hash: finalHash(chunks) };
});

// --- generated program ------------------------------------------------------

interface Config {
  maxSupply: number;
  mode: number;
  totalLimit: number;
  perWalletLimit: number;
  expiryBlocks: number;
}

type Op =
  | { k: 'reserve'; a: number; c: number }
  | { k: 'upload-batch'; a: number; c: number }
  | { k: 'seal'; a: number; c: number }
  | { k: 'single-mint'; a: number; c: number }
  | { k: 'cancel-reservation'; a: number; c: number }
  | { k: 'advance-blocks'; n: number }
  | { k: 'release-expired'; a: number; owner: number; c: number }
  | { k: 'pause'; v: boolean }
  | { k: 'new-drop' }
  | { k: 'assign-to-drop'; d: number }
  | { k: 'escrow'; d: number }
  | { k: 'activate'; d: number }
  | { k: 'fund-budget'; d: number; amount: number }
  | { k: 'claim'; d: number; a: number }
  | { k: 'claim-reserve'; d: number; a: number }
  | { k: 'release-expired-claim'; d: number; a: number; target: number }
  | { k: 'claim-fee'; d: number; amount: number }
  | { k: 'cancel-drop'; d: number }
  | { k: 'end-drop'; d: number }
  | { k: 'settle-refund'; d: number }
  | { k: 'unassign'; d: number };

// Biased toward actor 0 (the drop creator): a creator who never owns items
// could never escrow one, and the drop half of the model would stay vacuous.
const actorArb = fc.constantFrom(0, 0, 0, 0, 0, 1, 2, 3);
const contentArb = fc.integer({ min: 0, max: CONTENT_COUNT - 1 });

// Even selectors steer at the drop under construction (see dropOf); the odd
// ones scatter, which is what produces the wrong-drop rejection paths.
const dropArb = fc.constantFrom(0, 0, 0, 1, 2, 3);

type OpKind = Op['k'];

const OP_ARBS: Record<OpKind, fc.Arbitrary<any>> = {
  'reserve': fc.record({ k: fc.constant('reserve'), a: actorArb, c: contentArb }),
  'upload-batch': fc.record({ k: fc.constant('upload-batch'), a: actorArb, c: contentArb }),
  'seal': fc.record({ k: fc.constant('seal'), a: actorArb, c: contentArb }),
  'single-mint': fc.record({ k: fc.constant('single-mint'), a: actorArb, c: contentArb }),
  'cancel-reservation': fc.record({ k: fc.constant('cancel-reservation'), a: actorArb, c: contentArb }),
  // 145 blocks is past both expiry windows (collection reservation, claim
  // reservation), so expiry paths are actually reachable.
  'advance-blocks': fc.record({ k: fc.constant('advance-blocks'), n: fc.constantFrom(1, 3, 145, 145) }),
  'release-expired': fc.record({ k: fc.constant('release-expired'), a: actorArb, owner: actorArb, c: contentArb }),
  'pause': fc.record({ k: fc.constant('pause'), v: fc.boolean() }),
  'new-drop': fc.record({ k: fc.constant('new-drop') }),
  'assign-to-drop': fc.record({ k: fc.constant('assign-to-drop'), d: dropArb }),
  'escrow': fc.record({ k: fc.constant('escrow'), d: dropArb }),
  'activate': fc.record({ k: fc.constant('activate'), d: dropArb }),
  'fund-budget': fc.record({ k: fc.constant('fund-budget'), d: dropArb, amount: fc.constantFrom(50_000, 300_000, 1_000_000) }),
  'claim': fc.record({ k: fc.constant('claim'), d: dropArb, a: actorArb }),
  'claim-reserve': fc.record({ k: fc.constant('claim-reserve'), d: dropArb, a: actorArb }),
  'release-expired-claim': fc.record({ k: fc.constant('release-expired-claim'), d: dropArb, a: actorArb, target: actorArb }),
  'claim-fee': fc.record({ k: fc.constant('claim-fee'), d: dropArb, amount: fc.constantFrom(1, 25_000, 2_000_000) }),
  'cancel-drop': fc.record({ k: fc.constant('cancel-drop'), d: dropArb }),
  'end-drop': fc.record({ k: fc.constant('end-drop'), d: dropArb }),
  'settle-refund': fc.record({ k: fc.constant('settle-refund'), d: dropArb }),
  'unassign': fc.record({ k: fc.constant('unassign'), d: dropArb })
};

/**
 * Purely uniform op sampling almost never reaches a claimable drop: it takes
 * mint → assign → escrow → fund → activate in that order first. So the
 * distribution is biased by position in the sequence (inscribe / build /
 * distribute), while EVERY op kind keeps a non-zero weight in EVERY phase —
 * that is where the out-of-order rejection paths come from, and the invariants
 * are checked after rejected operations too.
 */
type Weights = Partial<Record<OpKind, number>>;

const PHASE_INSCRIBE: Weights = {
  'reserve': 8, 'upload-batch': 8, 'seal': 8, 'single-mint': 8, 'cancel-reservation': 3,
  'advance-blocks': 2, 'release-expired': 2, 'pause': 1, 'new-drop': 1,
  'assign-to-drop': 2, 'escrow': 2, 'activate': 1, 'fund-budget': 2, 'claim': 1,
  'claim-reserve': 1, 'release-expired-claim': 1, 'claim-fee': 1, 'cancel-drop': 1,
  'end-drop': 1, 'settle-refund': 1, 'unassign': 1
};
const PHASE_BUILD: Weights = {
  'reserve': 1, 'upload-batch': 2, 'seal': 2, 'single-mint': 2, 'cancel-reservation': 1,
  'advance-blocks': 1, 'release-expired': 1, 'pause': 1, 'new-drop': 1,
  'assign-to-drop': 6, 'escrow': 14, 'activate': 9, 'fund-budget': 8, 'claim': 2,
  'claim-reserve': 1, 'release-expired-claim': 1, 'claim-fee': 1, 'cancel-drop': 1,
  'end-drop': 1, 'settle-refund': 1, 'unassign': 1
};
const PHASE_DISTRIBUTE: Weights = {
  'reserve': 1, 'upload-batch': 1, 'seal': 1, 'single-mint': 1, 'cancel-reservation': 1,
  'advance-blocks': 7, 'release-expired': 1, 'pause': 1, 'new-drop': 1,
  'assign-to-drop': 2, 'escrow': 3, 'activate': 3, 'fund-budget': 3, 'claim': 7,
  'claim-reserve': 8, 'release-expired-claim': 8, 'claim-fee': 7, 'cancel-drop': 1,
  'end-drop': 3, 'settle-refund': 3, 'unassign': 6
};

const weightedOps = (weights: Weights): fc.Arbitrary<Op> =>
  fc.oneof(
    ...(Object.entries(weights) as Array<[OpKind, number]>).map(([kind, weight]) => ({
      weight,
      arbitrary: OP_ARBS[kind]
    }))
  ) as fc.Arbitrary<Op>;

/**
 * A purely random program reaches an activated, claimable drop only ~a quarter
 * of the time, which would leave the §4.2 invariants mostly unexercised. So a
 * minimal lifecycle BACKBONE (two creator mints, then assign → escrow → fund →
 * activate) is spliced into each phase at RANDOMLY chosen positions: relative
 * order is guaranteed, but any number of random operations — including
 * cancellations, pauses and expiries that invalidate the backbone — may land
 * between them. Everything else stays random, and invariants are still checked
 * after every operation, backbone or not.
 */
const spliceBackbone = (ops: Op[], anchors: number[], backbone: Op[]): Op[] => {
  const positions = anchors.map((n) => n % (ops.length + 1)).sort((a, b) => a - b);
  const out: Op[] = [];
  let next = 0;
  for (let i = 0; i <= ops.length; i += 1) {
    while (next < positions.length && positions[next] === i) {
      out.push(backbone[next]!);
      next += 1;
    }
    if (i < ops.length) out.push(ops[i]!);
  }
  return out;
};

const MINT_BACKBONE: Op[] = [
  { k: 'single-mint', a: 0, c: 0 },
  { k: 'single-mint', a: 0, c: 3 }
];
const BUILD_BACKBONE: Op[] = [
  { k: 'assign-to-drop', d: 0 },
  { k: 'escrow', d: 0 },
  { k: 'fund-budget', d: 0, amount: 1_000_000 },
  { k: 'activate', d: 0 }
];

const programArb = fc.record({
  config: fc.record({
    maxSupply: fc.constantFrom(4, 6, 8),
    mode: fc.constantFrom(1, 2, 3),
    totalLimit: fc.constantFrom(0, 2),
    perWalletLimit: fc.constantFrom(0, 1, 2),
    expiryBlocks: fc.constantFrom(2, 5)
  }),
  inscribe: fc.array(weightedOps(PHASE_INSCRIBE), { minLength: 10, maxLength: 16 }),
  build: fc.array(weightedOps(PHASE_BUILD), { minLength: 9, maxLength: 14 }),
  distribute: fc.array(weightedOps(PHASE_DISTRIBUTE), { minLength: 14, maxLength: 22 }),
  mintAnchors: fc.array(fc.nat({ max: 1000 }), { minLength: 2, maxLength: 2 }),
  buildAnchors: fc.array(fc.nat({ max: 1000 }), { minLength: 4, maxLength: 4 })
});

// --- shadow model -----------------------------------------------------------

interface DropShadow {
  id: bigint;
  funded: bigint;
  settled: bigint;
  refunded: bigint;
}

interface Ctx {
  config: Config;
  /** (actor, content) pairs ever touched — the session candidate set. */
  candidates: Set<string>;
  dropIds: bigint[];
  dropShadow: Map<string, DropShadow>;
  /** collection index -> drop id it is assigned to (mirror of Assignments). */
  assigned: Map<number, bigint>;
  /** drop id -> set of escrowed indexes. */
  escrowed: Map<string, Set<number>>;
  /** drop id -> every index ever added to its inventory (inventory is append-only). */
  inventory: Map<string, Set<number>>;
}

const key = (a: number, c: number) => `${a}:${c}`;

function setup(config: Config): Ctx {
  unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(1), Cl.uint(config.maxSupply)], deployer));
  unwrapOk(call(coll, 'set-mint-price', [Cl.uint(0)], deployer));
  unwrapOk(call(coll, 'set-reservation-expiry-blocks', [Cl.uint(config.expiryBlocks)], deployer));
  unwrapOk(call(coll, 'set-drops-authority',
    [Cl.some(Cl.contractPrincipal(deployer, 'xtrata-drops-v3'))], deployer));
  unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], deployer));
  unwrapOk(call(drops, 'set-sponsor', [Cl.principal(sponsorWallet)], deployer));
  const ctx: Ctx = {
    config,
    candidates: new Set(),
    dropIds: [],
    dropShadow: new Map(),
    assigned: new Map(),
    escrowed: new Map(),
    inventory: new Map()
  };
  // Every sequence starts with one draft drop, so drop-side operations are
  // reachable from op 0 instead of waiting on a random `new-drop`.
  apply(ctx, { k: 'new-drop' });
  return ctx;
}

/**
 * Even selectors target the newest drop (so a drop can actually be built up:
 * assign → escrow → activate → claim); odd selectors scatter, which is where
 * the wrong-drop/wrong-status rejection paths come from.
 */
/** Newest ACTIVE drop (even selectors); else dropOf. Used by the claim ops. */
function activeDropOf(ctx: Ctx, d: number): bigint | null {
  if (d % 2 === 0) {
    for (let i = ctx.dropIds.length - 1; i >= 0; i -= 1) {
      if (dropStatus(ctx.dropIds[i]!) === 1) return ctx.dropIds[i]!;
    }
  }
  return dropOf(ctx, d);
}

/** Newest ended/cancelled drop that still holds assignments; else dropOf. */
function closedDropOf(ctx: Ctx, d: number): bigint | null {
  for (let i = ctx.dropIds.length - 1; i >= 0; i -= 1) {
    const id = ctx.dropIds[i]!;
    const status = dropStatus(id);
    if (status !== 3 && status !== 4) continue;
    if ([...ctx.assigned.values()].some((v) => v === id)) return id;
  }
  return dropOf(ctx, d);
}

function dropStatus(dropId: bigint): number | null {
  const row = mapEntry(drops, 'Drops', Cl.tuple({ 'drop-id': Cl.uint(dropId) }));
  return row === null ? null : Number(cvToValue(row).status.value);
}

function dropOf(ctx: Ctx, d: number): bigint | null {
  if (ctx.dropIds.length === 0) return null;
  if (d % 2 === 0) {
    // The newest drop that can still be worked on (draft/active/paused),
    // preferring one that already holds inventory — otherwise a freshly
    // created empty drop would permanently steal the build target, and a
    // cancellation earlier in the sequence would dead-end the run.
    const workable: bigint[] = [];
    for (let i = ctx.dropIds.length - 1; i >= 0; i -= 1) {
      const status = dropStatus(ctx.dropIds[i]!);
      if (status === 0 || status === 1 || status === 2) workable.push(ctx.dropIds[i]!);
    }
    const stocked = workable.find((id) => inventorySet(ctx, id).size > 0);
    if (stocked !== undefined) return stocked;
    if (workable.length > 0) return workable[0]!;
  }
  return ctx.dropIds[d % ctx.dropIds.length]!;
}

function shadow(ctx: Ctx, id: bigint): DropShadow {
  return ctx.dropShadow.get(id.toString())!;
}

function escrowSet(ctx: Ctx, id: bigint): Set<number> {
  let s = ctx.escrowed.get(id.toString());
  if (s === undefined) { s = new Set(); ctx.escrowed.set(id.toString(), s); }
  return s;
}

function inventorySet(ctx: Ctx, id: bigint): Set<number> {
  let s = ctx.inventory.get(id.toString());
  if (s === undefined) { s = new Set(); ctx.inventory.set(id.toString(), s); }
  return s;
}

function tokenIdOf(index: number): bigint | null {
  const row = mapEntry(coll, 'Items', Cl.tuple({ index: Cl.uint(index) }));
  return row === null ? null : BigInt(cvToValue(row)['token-id'].value);
}

function nftOwnerOf(tokenId: bigint): string | null {
  const owner = mapEntry(core, 'Owners', Cl.uint(tokenId));
  return owner === null ? null : cvToValue(owner);
}

/**
 * First content id at or after `start` that is neither indexed nor reserved.
 * `reserve` deliberately keeps raw random ids (so duplicate-hash rejection is
 * exercised); `single-mint` uses this so sequences actually build inventory.
 */
function pickFreeContent(ctx: Ctx, start: number): number {
  const open = new Set(liveSessions(ctx).map((s) => s.c));
  for (let step = 0; step < CONTENT_COUNT; step += 1) {
    const c = (start + step) % CONTENT_COUNT;
    if (open.has(c)) continue;
    if (mapEntry(coll, 'HashIndex', Cl.tuple({ hash: Cl.buffer(contents[c]!.hash) })) !== null) continue;
    return c;
  }
  return start;
}

/** Core upload progress for a session, or null when begin has not run. */
function uploadState(a: number, c: number): { current: number; total: number } | null {
  const row = mapEntry(core, 'UploadState', Cl.tuple({
    owner: Cl.principal(ACTORS[a]!),
    hash: Cl.buffer(contents[c]!.hash)
  }));
  if (row === null) return null;
  const v = cvToValue(row);
  return { current: Number(v['current-index'].value), total: Number(v['total-chunks'].value) };
}

/** Every (actor, content) pair that currently has an open collection session. */
function liveSessions(ctx: Ctx): Array<{ a: number; c: number }> {
  const out: Array<{ a: number; c: number }> = [];
  for (const candidate of ctx.candidates) {
    const [a, c] = candidate.split(':').map(Number);
    const row = mapEntry(coll, 'Sessions', Cl.tuple({
      owner: Cl.principal(ACTORS[a!]!),
      hash: Cl.buffer(contents[c!]!.hash)
    }));
    if (row !== null) out.push({ a: a!, c: c! });
  }
  return out.sort((x, y) => (x.a - y.a) || (x.c - y.c));
}

function isClaimed(dropId: bigint, index: number): boolean {
  return mapEntry(drops, 'ItemClaimed',
    Cl.tuple({ 'drop-id': Cl.uint(dropId), index: Cl.uint(index) })) !== null;
}

// --- operation application --------------------------------------------------

function apply(ctx: Ctx, op: Op): void {
  switch (op.k) {
    case 'reserve': {
      ctx.candidates.add(key(op.a, op.c));
      const res = record('reserve', call(coll, 'reserve',
        [Cl.buffer(contents[op.c]!.hash), Cl.none()], ACTORS[op.a]!));
      if (errCode(res) === 104) hit('supply-exhausted');
      return;
    }
    case 'upload-batch': {
      // Prefer an existing reservation so uploads actually progress; fall back
      // to a fresh (actor, content) pair when there is nothing open.
      const live = liveSessions(ctx);
      // Prefer a session whose upload is not finished yet.
      const pending = live.filter((s) => {
        const u = uploadState(s.a, s.c);
        return u === null || u.current < u.total;
      });
      const pool = pending.length > 0 ? pending : live;
      const target = pool.length > 0 ? pool[op.a % pool.length]! : { a: op.a, c: op.c };
      ctx.candidates.add(key(target.a, target.c));
      const content = contents[target.c]!;
      const begun = call(coll, 'mint-begin', [
        corePrincipal, Cl.buffer(content.hash), Cl.stringAscii(mime),
        Cl.uint(content.chunks.length * 4), Cl.uint(content.chunks.length)
      ], ACTORS[target.a]!);
      if (isOk(begun)) {
        record('upload-batch', call(coll, 'mint-add-chunk-batch', [
          corePrincipal, Cl.buffer(content.hash),
          Cl.list(content.chunks.map((c) => Cl.buffer(c)))
        ], ACTORS[target.a]!));
      }
      return;
    }
    case 'seal': {
      const live = liveSessions(ctx);
      // Prefer a fully-uploaded session; an unfinished one exercises the
      // seal-before-upload-complete rejection.
      const ready = live.filter((s) => {
        const u = uploadState(s.a, s.c);
        return u !== null && u.current === u.total;
      });
      const pool = ready.length > 0 ? ready : live;
      const target = pool.length > 0 ? pool[op.a % pool.length]! : { a: op.a, c: op.c };
      record('seal', call(coll, 'mint-seal',
        [corePrincipal, Cl.buffer(contents[target.c]!.hash), Cl.stringAscii('ipfs://model')],
        ACTORS[target.a]!));
      return;
    }
    case 'single-mint': {
      const c = pickFreeContent(ctx, op.c);
      ctx.candidates.add(key(op.a, c));
      const content = contents[c]!;
      const res = record('single-mint', call(coll, 'mint-small-single-tx', [
        corePrincipal, Cl.buffer(content.hash), Cl.stringAscii(mime),
        Cl.uint(content.chunks.length * 4),
        Cl.list(content.chunks.map((c) => Cl.buffer(c))),
        Cl.stringAscii('ipfs://model')
      ], ACTORS[op.a]!));
      if (errCode(res) === 104) hit('supply-exhausted');
      return;
    }
    case 'cancel-reservation': {
      // Self-service: only the session owner can cancel, so aim at one of the
      // owner's own open sessions when there is one.
      const live = liveSessions(ctx);
      const own = live.filter((x) => x.a === op.a);
      const target = own.length > 0 ? own[op.c % own.length]! : { a: op.a, c: op.c };
      record('cancel-reservation',
        call(coll, 'cancel-reservation', [Cl.buffer(contents[target.c]!.hash)], ACTORS[target.a]!));
      return;
    }
    case 'advance-blocks': {
      simnet.mineEmptyBlocks(op.n);
      return;
    }
    case 'release-expired': {
      // Permissionless: anyone may release. Aim at a session that actually
      // exists (that is what a watcher would do); whether it has expired yet
      // is up to how many blocks the sequence advanced.
      const live = liveSessions(ctx);
      const target = live.length > 0 ? live[op.owner % live.length]! : { a: op.owner, c: op.c };
      record('release-expired', call(coll, 'release-expired-reservation',
        [Cl.principal(ACTORS[target.a]!), Cl.buffer(contents[target.c]!.hash)], ACTORS[op.a]!));
      return;
    }
    case 'pause': {
      call(coll, 'set-paused', [Cl.bool(op.v)], deployer);
      return;
    }
    case 'new-drop': {
      if (ctx.dropIds.length >= 3) return;
      const res = call(drops, 'create-drop', [
        collPrincipal, Cl.uint(ctx.config.mode), Cl.uint(1), Cl.uint(0), Cl.uint(0),
        Cl.uint(ctx.config.totalLimit), Cl.uint(ctx.config.perWalletLimit)
      ], CREATOR);
      if (isOk(res)) {
        hit('new-drop');
        const id = (res as any).value.value as bigint;
        ctx.dropIds.push(id);
        ctx.dropShadow.set(id.toString(), { id, funded: 0n, settled: 0n, refunded: 0n });
      }
      return;
    }
    case 'assign-to-drop': {
      const id = dropOf(ctx, op.d);
      if (id === null) return;
      const nextIndex = uintVar(coll, 'next-index');
      const candidates: number[] = [];
      for (let i = 0; i < nextIndex && candidates.length < MAX_ASSIGN_BATCH; i += 1) {
        if (ctx.assigned.has(i)) continue;
        const tokenId = tokenIdOf(i);
        // A drop can only ever be escrowed from items its creator still holds.
        if (tokenId !== null && nftOwnerOf(tokenId) === CREATOR) candidates.push(i);
      }
      if (candidates.length === 0) return;
      const res = record('assign-to-drop', call(drops, 'add-inventory-items',
        [collPrincipal, Cl.uint(id), Cl.list(candidates.map((i) => Cl.uint(i)))], CREATOR));
      if (isOk(res)) {
        const inv = inventorySet(ctx, id);
        for (const i of candidates) { ctx.assigned.set(i, id); inv.add(i); }
      }
      return;
    }
    case 'escrow': {
      const id = dropOf(ctx, op.d);
      if (id === null) return;
      const held = escrowSet(ctx, id);
      const entries: Array<{ index: number; tokenId: bigint }> = [];
      for (const [index, dropId] of ctx.assigned) {
        if (dropId !== id || held.has(index) || entries.length >= MAX_ESCROW_BATCH) continue;
        const tokenId = tokenIdOf(index);
        // Only the drop creator's own NFTs can be escrowed by the creator.
        if (tokenId !== null && nftOwnerOf(tokenId) === CREATOR) entries.push({ index, tokenId });
      }
      if (entries.length === 0) return;
      const res = record('escrow', call(drops, 'escrow-batch', [
        Cl.uint(id),
        Cl.list(entries.map((e) => Cl.tuple({ index: Cl.uint(e.index), 'token-id': Cl.uint(e.tokenId) })))
      ], CREATOR));
      if (isOk(res)) for (const e of entries) held.add(e.index);
      return;
    }
    case 'activate': {
      const id = dropOf(ctx, op.d);
      if (id === null) return;
      record('activate', call(drops, 'activate-drop', [Cl.uint(id)], CREATOR));
      return;
    }
    case 'fund-budget': {
      const id = dropOf(ctx, op.d);
      if (id === null) return;
      const res = record('fund-budget',
        call(drops, 'fund-budget', [Cl.uint(id), Cl.uint(op.amount)], CREATOR));
      if (isOk(res)) shadow(ctx, id).funded += BigInt(op.amount);
      return;
    }
    case 'claim': {
      const id = activeDropOf(ctx, op.d);
      if (id === null) return;
      const res = record('claim', call(drops, 'claim', [Cl.uint(id)], ACTORS[op.a]!));
      if (errCode(res) === 214) hit('drop-sold-out');
      return;
    }
    case 'claim-reserve': {
      const id = activeDropOf(ctx, op.d);
      if (id === null) return;
      record('claim-reserve', call(drops, 'reserve-claim', [Cl.uint(id)], ACTORS[op.a]!));
      return;
    }
    case 'release-expired-claim': {
      const id = activeDropOf(ctx, op.d);
      if (id === null) return;
      // Anyone may release; prefer a claimer that actually holds a reservation
      // (that is what a relayer watching the chain would do).
      const holders = ACTORS.filter((_, i) => mapEntry(drops, 'ClaimReservations',
        Cl.tuple({ 'drop-id': Cl.uint(id), claimer: Cl.principal(ACTORS[i]!) })) !== null);
      const target = holders.length > 0 ? holders[op.target % holders.length]! : ACTORS[op.target]!;
      record('release-expired-claim', call(drops, 'release-expired-claim',
        [Cl.uint(id), Cl.principal(target)], ACTORS[op.a]!));
      return;
    }
    case 'claim-fee': {
      const id = activeDropOf(ctx, op.d);
      if (id === null) return;
      const res = record('claim-fee',
        call(drops, 'claim-fee', [Cl.uint(id), Cl.uint(op.amount)], sponsorWallet));
      if (isOk(res)) shadow(ctx, id).settled += BigInt(op.amount);
      return;
    }
    case 'cancel-drop': {
      const id = dropOf(ctx, op.d);
      if (id === null) return;
      const res = record('cancel-drop', call(drops, 'cancel-drop', [Cl.uint(id)], CREATOR));
      if (isOk(res)) shadow(ctx, id).refunded += BigInt(((res as any).value.value as bigint));
      return;
    }
    case 'end-drop': {
      const id = dropOf(ctx, op.d);
      if (id === null) return;
      record('end-drop', call(drops, 'end-drop', [Cl.uint(id)], CREATOR));
      return;
    }
    case 'settle-refund': {
      const id = dropOf(ctx, op.d);
      if (id === null) return;
      const res = record('settle-refund', call(drops, 'settle-refund', [Cl.uint(id)], CREATOR));
      if (isOk(res)) shadow(ctx, id).refunded += BigInt(((res as any).value.value as bigint));
      return;
    }
    case 'unassign': {
      // Recovery is the only unassign path: it returns escrowed NFTs and
      // clears the collection assignments for an ended/cancelled drop, so it
      // targets a closed drop when there is one.
      const id = closedDropOf(ctx, op.d);
      if (id === null) return;
      const indexes: number[] = [];
      for (const [index, dropId] of ctx.assigned) {
        if (dropId === id && !isClaimed(id, index) && indexes.length < MAX_RECOVER_BATCH) {
          indexes.push(index);
        }
      }
      if (indexes.length === 0) return;
      const res = record('unassign', call(drops, 'recover-batch',
        [collPrincipal, Cl.uint(id), Cl.list(indexes.map((i) => Cl.uint(i)))], CREATOR));
      if (isOk(res)) {
        const held = escrowSet(ctx, id);
        for (const i of indexes) { ctx.assigned.delete(i); held.delete(i); }
      }
      return;
    }
  }
}

// --- invariants -------------------------------------------------------------

function checkInvariants(ctx: Ctx, label: string): void {
  const minted = uintVar(coll, 'minted-count');
  const reserved = uintVar(coll, 'reserved-count');
  const nextIndex = uintVar(coll, 'next-index');
  const freeCount = uintVar(coll, 'free-count');
  const maxSupply = uintVar(coll, 'max-supply');

  // §3.2/1 — never oversubscribed.
  expect(minted + reserved, `${label}: minted+reserved <= max-supply`).toBeLessThanOrEqual(maxSupply);

  // §3.2/3 — index accounting. Free-list slots are dense in [0, free-count).
  const free: number[] = [];
  for (let slot = 0; slot < freeCount; slot += 1) {
    const entry = mapEntry(coll, 'FreeIndexes', Cl.tuple({ slot: Cl.uint(slot) }));
    expect(entry, `${label}: free-list slot ${slot} missing`).not.toBeNull();
    free.push(Number(cvToValue(entry)));
  }
  expect(new Set(free).size, `${label}: duplicate index in the free-list`).toBe(free.length);

  const mintedIndexes: number[] = [];
  for (let i = 0; i < nextIndex; i += 1) {
    if (mapEntry(coll, 'Items', Cl.tuple({ index: Cl.uint(i) })) !== null) mintedIndexes.push(i);
  }
  expect(mintedIndexes.length, `${label}: Items rows must equal minted-count`).toBe(minted);

  const sessionIndexes: number[] = [];
  for (const candidate of ctx.candidates) {
    const [a, c] = candidate.split(':').map(Number);
    const row = mapEntry(coll, 'Sessions', Cl.tuple({
      owner: Cl.principal(ACTORS[a!]!),
      hash: Cl.buffer(contents[c!]!.hash)
    }));
    if (row !== null) sessionIndexes.push(Number(cvToValue(row).index.value));
  }
  expect(sessionIndexes.length, `${label}: Sessions rows must equal reserved-count`).toBe(reserved);

  const union = [...mintedIndexes, ...sessionIndexes, ...free].sort((x, y) => x - y);
  expect(union, `${label}: minted ∪ sessions ∪ free-list must be exactly [0, next-index)`)
    .toEqual(Array.from({ length: nextIndex }, (_, i) => i));

  // §3.2/4 — an index belongs to at most one drop, and only when minted.
  for (let i = 0; i < nextIndex; i += 1) {
    const row = mapEntry(coll, 'Assignments', Cl.tuple({ index: Cl.uint(i) }));
    if (row === null) {
      expect(ctx.assigned.has(i), `${label}: index ${i} assigned in the model but not on chain`).toBe(false);
      continue;
    }
    const value = cvToValue(row);
    expect(mintedIndexes, `${label}: index ${i} assigned but not minted`).toContain(i);
    expect(value['drop-contract'].value, `${label}: assignment must be owned by the drops contract`)
      .toBe(dropsPrincipal);
    expect(BigInt(value['drop-id'].value), `${label}: index ${i} assigned to an unexpected drop`)
      .toBe(ctx.assigned.get(i));
  }

  // --- drops ---
  let totalRemaining = 0n;
  for (const dropId of ctx.dropIds) {
    const row = mapEntry(drops, 'Drops', Cl.tuple({ 'drop-id': Cl.uint(dropId) }));
    expect(row, `${label}: drop ${dropId} row missing`).not.toBeNull();
    const d = cvToValue(row);
    const n = (field: string) => BigInt(d[field].value);
    const inventory = n('inventory-count');
    const claimed = n('claimed-count');
    const reservedClaims = n('reserved-count');
    const escrowedCount = n('escrowed-count');
    const budgetTotal = n('fee-budget-total');
    const budgetRemaining = n('fee-budget-remaining');
    const sh = shadow(ctx, dropId);

    // §4.2/2 — capacity is never oversubscribed.
    expect(claimed + reservedClaims, `${label}: drop ${dropId} claimed+reserved <= inventory`)
      .toBeLessThanOrEqual(inventory);
    // Inventory is append-only and mirrors what was assigned through this drop.
    const inv = inventorySet(ctx, dropId);
    expect(inventory, `${label}: drop ${dropId} inventory-count must match items ever assigned to it`)
      .toBe(BigInt(inv.size));
    // §4.2/1 — every currently assigned index belongs to this drop's inventory.
    for (const [index, owner] of ctx.assigned) {
      if (owner === dropId) {
        expect(inv.has(index), `${label}: index ${index} assigned to drop ${dropId} but not in its inventory`)
          .toBe(true);
      }
    }

    // §4.2/2 — no index claimed twice.
    const claimedIndexes: number[] = [];
    for (let seq = 0n; seq < claimed; seq += 1n) {
      const claim = mapEntry(drops, 'Claims', Cl.tuple({ 'drop-id': Cl.uint(dropId), seq: Cl.uint(seq) }));
      expect(claim, `${label}: drop ${dropId} claim ${seq} row missing`).not.toBeNull();
      const index = Number(cvToValue(claim).index.value);
      expect(isClaimed(dropId, index), `${label}: claim ${seq} not flagged in ItemClaimed`).toBe(true);
      expect(inv.has(index), `${label}: drop ${dropId} claimed index ${index} outside its inventory`).toBe(true);
      claimedIndexes.push(index);
    }
    expect(new Set(claimedIndexes).size, `${label}: drop ${dropId} claimed an index twice`)
      .toBe(claimedIndexes.length);

    // §4.2/4 + 5 — budget bounds and no strandable funds.
    expect(budgetRemaining, `${label}: drop ${dropId} remaining <= total`).toBeLessThanOrEqual(budgetTotal);
    expect(budgetTotal, `${label}: drop ${dropId} funded total`).toBe(sh.funded);
    expect(budgetRemaining, `${label}: drop ${dropId} recoverable == escrowed - settled - refunded`)
      .toBe(sh.funded - sh.settled - sh.refunded);
    totalRemaining += budgetRemaining;

    // escrow bookkeeping: rows == counter == NFTs actually held.
    const held = escrowSet(ctx, dropId);
    let rows = 0n;
    for (const index of held) {
      const token = mapEntry(drops, 'EscrowedTokens',
        Cl.tuple({ 'drop-id': Cl.uint(dropId), index: Cl.uint(index) }));
      if (token === null) continue; // claimed or recovered out
      rows += 1n;
      expect(nftOwnerOf(BigInt(cvToValue(token))), `${label}: escrowed token not held by the contract`)
        .toBe(dropsPrincipal);
    }
    expect(rows, `${label}: drop ${dropId} escrowed-count must equal live escrow rows`).toBe(escrowedCount);
  }

  // §4.2/4 — every microSTX in the contract is attributable and recoverable.
  expect(stx(dropsPrincipal), `${label}: contract STX balance == Σ fee-budget-remaining`)
    .toBe(totalRemaining);
}

// --- the property -----------------------------------------------------------

const SEQUENCES = fc.sample(programArb, { numRuns: 60, seed: 20260724 });

describe('model-based: random operation interleavings preserve every invariant', () => {
  SEQUENCES.forEach((program, seqIndex) => {
    const ops: Op[] = [
      ...spliceBackbone(program.inscribe as Op[], program.mintAnchors, MINT_BACKBONE),
      ...spliceBackbone(program.build as Op[], program.buildAnchors, BUILD_BACKBONE),
      ...(program.distribute as Op[])
    ];
    it(`sequence ${seqIndex} (${ops.length} ops, supply ${program.config.maxSupply}, mode ${program.config.mode})`, () => {
      const ctx = setup(program.config as Config);
      checkInvariants(ctx, `seq ${seqIndex} @ setup`);
      ops.forEach((op, i) => {
        apply(ctx, op);
        checkInvariants(ctx, `seq ${seqIndex} @ op ${i} (${JSON.stringify(op)})`);
      });
    });
  });
});

/**
 * Guard against a silently vacuous property suite: if a future change to the
 * generator, the weights or the contracts stops the sequences from reaching
 * these states, the invariants above would still all "pass" while proving
 * nothing. Thresholds are set well below what the fixed seed currently
 * produces, so they fail on a real regression rather than on noise.
 */
describe('model coverage', () => {
  it('the generated sequences actually reach every interesting protocol state', () => {
    const required: Array<[string, number]> = [
      // collection
      ['reserve', 30], ['upload-batch', 40], ['seal', 20], ['single-mint', 100],
      ['cancel-reservation', 8], ['release-expired', 6], ['supply-exhausted', 30],
      // drops: build
      ['new-drop', 40], ['assign-to-drop', 30], ['escrow', 25], ['fund-budget', 80],
      ['activate', 20],
      // drops: distribute + settle + recover
      ['claim', 15], ['claim-reserve', 10], ['release-expired-claim', 1],
      ['drop-sold-out', 2], ['claim-fee', 4], ['end-drop', 8], ['cancel-drop', 15],
      ['settle-refund', 2], ['unassign', 8]
    ];
    const shortfall = required
      .filter(([name, min]) => (COVERAGE[name] ?? 0) < min)
      .map(([name, min]) => `${name}: ${COVERAGE[name] ?? 0} < ${min}`);
    expect(shortfall, `model coverage regressed: ${JSON.stringify(COVERAGE)}`).toEqual([]);
  });
});
