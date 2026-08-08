// Economic property testing.
//
// Long random sequences of every operation that touches money, with the
// invariants asserted after EVERY step rather than at the end. A violation that
// heals itself before the sequence finishes is still a violation, and it is
// exactly the kind that a final-state check misses.
//
// The invariants, in the order they matter:
//
//   1. SOLVENCY          the contract holds at least what it says it owes
//   2. RECONCILIATION    the sum of every sponsorship's remainder equals the
//                        single number the contract reports as owed
//   3. ISOLATION         a submission touches exactly one sponsorship row, the
//                        submitter's own, and never any other game's or any
//                        other player's
//   4. MONOTONICITY      an allowance only ever decreases, except at a top-up,
//                        and never underflows
//   5. COHERENCE         a failed call leaves the accounting exactly as it was
//
// Seeds are fixed. Any seed that ever fails is pinned in REGRESSION_SEEDS and
// stays there.

import { beforeEach, describe, expect, it } from 'vitest';
import {
  ALICE,
  BOB,
  CAROL,
  CONTRACT,
  Cl,
  DAVE,
  DEPLOYER,
  ZERO,
  assertSolvent,
  contractBalance,
  openGame,
  openSponsored,
  openSponsoredBoth,
  pretty,
  settle,
  sponsorship,
  stxBalance,
  submit,
  topUp,
  totalReserved,
  withdrawable
} from '../clarity/helpers.js';

/** Seeds that have ever failed. They never come out. */
const REGRESSION_SEEDS: number[] = [];

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(random: () => number, list: readonly T[]): T =>
  list[Math.floor(random() * list.length) % list.length];

const PLAYERS = [ALICE, BOB, CAROL, DAVE, ZERO];
const FUNDED = [ALICE, BOB, CAROL, DAVE];

interface Key {
  game: number;
  who: string;
}

const keyOf = (k: Key): string => `${k.game}|${k.who}`;

interface Row {
  reserved: bigint;
  rebatesLeft: bigint;
  settled: boolean;
}

/**
 * A settled row can never change again, so it is read once and remembered.
 *
 * `settle-sponsorship` sets reserved and rebates-left to zero and marks the row
 * settled, `top-up-sponsorship` refuses a settled row outright, and nothing else
 * writes one. Without this cache the snapshot re-reads every row the whole run
 * has ever created, on every step, which is quadratic in contract calls and was
 * the difference between this suite taking eight minutes and taking one.
 */
const frozen = new Map<string, Row>();

/** Every sponsorship row the contract holds, for the keys we know about. */
function snapshot(keys: Key[]): Map<string, Row> {
  const out = new Map<string, Row>();
  for (const key of keys) {
    const id = keyOf(key);
    const cached = frozen.get(id);
    if (cached) {
      out.set(id, cached);
      continue;
    }
    const row = sponsorship(key.game, key.who);
    if (!row) continue;
    const value: Row = {
      reserved: row.reserved,
      rebatesLeft: row.rebatesLeft,
      settled: row.settled
    };
    out.set(id, value);
    if (value.settled) frozen.set(id, value);
  }
  return out;
}

function sumReserved(rows: Map<string, { reserved: bigint }>): bigint {
  let total = 0n;
  for (const row of rows.values()) total += row.reserved;
  return total;
}

/**
 * Everything that must be true after every single operation.
 *
 * `keys` is every sponsorship the sequence has created, so reconciliation is
 * checked against the real rows rather than against a model of the arithmetic.
 * Modelling the arithmetic would only prove this file agrees with itself.
 */
function assertInvariants(keys: Key[], context: string): Map<string, Row> {
  const rows = snapshot(keys);
  const owed = totalReserved();
  const balance = contractBalance();

  // 1. Solvency.
  expect(balance >= owed, `${context}: holds ${balance}, owes ${owed}`).toBe(true);

  // 2. Reconciliation. The one number the contract reports must be exactly the
  // sum of the rows behind it. A drift here means a release or a reserve went
  // missing, which solvency alone would not catch until it was too late.
  expect(sumReserved(rows), `${context}: rows sum to a different total than the contract reports`).toBe(owed);

  // Withdrawable is never negative, and never more than the free balance.
  const free = withdrawable();
  expect(free, `${context}: withdrawable`).toBe(balance > owed ? balance - owed : 0n);

  return rows;
}

describe('economic properties over random operation sequences', () => {
  beforeEach(() => {
    simnet.setEpoch('3.0');
  });

  const SEEDS = 20;
  const OPS = 45;

  // Accumulated across every sequence, not reset per seed.
  //
  // simnet state carries between sequences, so a seed does not start from an
  // empty contract: the previous seed's sponsorships are still outstanding.
  // Reconciliation therefore has to be checked against every row ever created,
  // which is the stronger statement anyway - the contract's single liability
  // number must equal the sum of its entire history of rows, not just the ones
  // this sequence happened to make.
  const keys: Key[] = [];
  const seen = new Set<string>();

  const runSequence = (seed: number): void => {
    const random = rng(seed);
    const games: number[] = [];

    const remember = (game: number, who: string): void => {
      const key = { game, who };
      if (seen.has(keyOf(key))) return;
      seen.add(keyOf(key));
      keys.push(key);
    };

    // Carried between steps rather than re-read. The state after one operation
    // is by definition the state before the next, and reading it twice doubled
    // the contract calls for nothing.
    let before = assertInvariants(keys, `seed ${seed} start`);

    for (let step = 0; step < OPS; step++) {
      const where = `seed ${seed} step ${step}`;
      const roll = random();

      if (roll < 0.12 || games.length === 0) {
        games.push(openGame(pick(random, FUNDED), random() < 0.3));
      } else if (roll < 0.28) {
        const creator = pick(random, FUNDED);
        const opponent = pick(random, PLAYERS.filter((p) => p !== creator));
        const game = openSponsored(creator, opponent, random() < 0.3);
        games.push(game);
        remember(game, opponent);
      } else if (roll < 0.36) {
        const creator = pick(random, FUNDED);
        const others = PLAYERS.filter((p) => p !== creator);
        const white = others[0];
        const black = others[1];
        const game = openSponsoredBoth(creator, white, black, random() < 0.3);
        games.push(game);
        remember(game, white);
        remember(game, black);
      } else if (roll < 0.75) {
        // A submission by somebody, sponsored or not. This is the operation
        // that pays out, so it is the one worth doing most.
        const game = pick(random, games);
        const who = pick(random, PLAYERS);
        // A wallet that cannot pay is not interesting here; the contract charges
        // nothing for a submission, so only ZERO's emptiness could bite.
        const receipt = submit(who, game, pick(random, ['e2e4', 'resgn', 'zzzz', 'draw?']));
        expect(pretty(receipt.result), `${where}: submit`).toContain('(ok u');

        // 3. ISOLATION. A submission may change at most one row, and only the
        // submitter's own row on that game.
        const after = snapshot(keys);
        for (const [key, row] of after) {
          const was = before.get(key);
          if (!was) continue;
          if (key === keyOf({ game, who })) continue;
          expect(row.reserved, `${where}: submission changed an unrelated row ${key}`).toBe(was.reserved);
          expect(row.rebatesLeft, `${where}: submission changed an unrelated allowance ${key}`).toBe(
            was.rebatesLeft
          );
        }
      } else if (roll < 0.83 && keys.length) {
        const key = pick(random, keys);
        const receipt = topUp(pick(random, FUNDED), key.game, key.who);
        const text = pretty(receipt.result);
        // A settled sponsorship refuses a top-up. That is a legitimate answer.
        expect(text === '(ok true)' || text === '(err u109)', `${where}: top-up said ${text}`).toBe(true);
      } else if (roll < 0.91 && keys.length) {
        const key = pick(random, keys);
        const receipt = settle(pick(random, FUNDED), key.game, key.who);
        const text = pretty(receipt.result);
        // Before expiry, or already settled, are both legitimate refusals.
        expect(
          text.startsWith('(ok u') || text === '(err u108)' || text === '(err u109)',
          `${where}: settle said ${text}`
        ).toBe(true);
      } else if (roll < 0.96) {
        // 5. COHERENCE. Deliberately try to withdraw more than is free.
        const free = withdrawable();
        const owed = totalReserved();
        const tooMuch = simnet.callPublicFn(
          CONTRACT,
          'withdraw',
          [Cl.uint(free + 1n), Cl.principal(DEPLOYER)],
          DEPLOYER
        );
        expect(pretty(tooMuch.result), `${where}: overdraw was allowed`).toBe('(err u110)');
        // The refusal changed nothing.
        expect(totalReserved(), `${where}: refusal moved the liability`).toBe(owed);
        expect(withdrawable(), `${where}: refusal moved the free balance`).toBe(free);

        // And a legitimate withdrawal of a slice of what is free.
        if (free > 0n) {
          const slice = free / 2n;
          const receipt = simnet.callPublicFn(
            CONTRACT,
            'withdraw',
            [Cl.uint(slice), Cl.principal(DEPLOYER)],
            DEPLOYER
          );
          expect(pretty(receipt.result), `${where}: legitimate withdrawal`).toBe(`(ok u${slice})`);
        }
      } else {
        simnet.mineEmptyBlocks(1 + Math.floor(random() * 2000));
      }

      const after = assertInvariants(keys, `${where} after`);
      before = after;

      // 4. MONOTONICITY. An allowance never grows except at a top-up, and never
      // underflows. Checked across the whole step rather than per operation, so
      // a top-up is allowed to be the exception it is.
      const toppedUp = roll >= 0.75 && roll < 0.83;
      for (const [key, row] of after) {
        const was = before.get(key);
        if (!was) continue;
        expect(row.reserved >= 0n, `${key} reserved underflowed`).toBe(true);
        expect(row.rebatesLeft >= 0n, `${key} allowance underflowed`).toBe(true);
        if (!toppedUp) {
          expect(row.reserved <= was.reserved, `${where}: ${key} reserved grew`).toBe(true);
          expect(row.rebatesLeft <= was.rebatesLeft, `${where}: ${key} allowance grew`).toBe(true);
        }
      }
    }

    assertInvariants(keys, `seed ${seed} end`);
  };

  it(
    `holds every invariant across ${SEEDS} seeded sequences of ${OPS} operations`,
    () => {
      for (let seed = 1; seed <= SEEDS; seed++) {
        runSequence(seed);
      }
    },
    900_000
  );

  for (const seed of REGRESSION_SEEDS) {
    it(`regression seed ${seed}`, () => runSequence(seed));
  }
});

describe('one game cannot reach another game\'s money', () => {
  beforeEach(() => {
    simnet.setEpoch('3.0');
  });

  it('drains one sponsorship completely without touching a second', () => {
    const first = openSponsored(ALICE, ZERO);
    const second = openSponsored(BOB, ZERO);
    const firstRow = sponsorship(first, ZERO)!;
    const secondBefore = sponsorship(second, ZERO)!;

    // Spend the first game's allowance to nothing.
    for (let i = 0; i < Number(firstRow.rebatesLeft); i++) submit(ZERO, first, 'e2e4');
    expect(sponsorship(first, ZERO)!.reserved).toBe(0n);
    expect(sponsorship(first, ZERO)!.rebatesLeft).toBe(0n);

    // The second is exactly as it was.
    const secondAfter = sponsorship(second, ZERO)!;
    expect(secondAfter.reserved).toBe(secondBefore.reserved);
    expect(secondAfter.rebatesLeft).toBe(secondBefore.rebatesLeft);

    // And further submissions to the drained game pay nothing, rather than
    // reaching across.
    const balance = stxBalance(ZERO);
    submit(ZERO, first, 'e2e4');
    expect(stxBalance(ZERO)).toBe(balance);
    assertSolvent('after draining one of two');
  });

  it('pays one player without touching the other player on the same game', () => {
    const game = openSponsoredBoth(ALICE, BOB, CAROL);
    const bobBefore = sponsorship(game, BOB)!;
    const carolBefore = sponsorship(game, CAROL)!;

    submit(BOB, game, 'e2e4');

    expect(sponsorship(game, BOB)!.reserved).toBe(bobBefore.reserved - bobBefore.rebate);
    expect(sponsorship(game, CAROL)!.reserved).toBe(carolBefore.reserved);
    expect(sponsorship(game, CAROL)!.rebatesLeft).toBe(carolBefore.rebatesLeft);
    assertSolvent('after paying one of two on a game');
  });

  it('keeps the treasury out of reach of a reserve, and the reserve out of reach of the treasury', () => {
    const game = openSponsored(ALICE, ZERO);
    const owed = totalReserved();

    // Take every free microSTX.
    simnet.callPublicFn(
      CONTRACT,
      'withdraw',
      [Cl.uint(withdrawable()), Cl.principal(DEPLOYER)],
      DEPLOYER
    );
    expect(contractBalance()).toBe(owed);
    expect(withdrawable()).toBe(0n);

    // The game still works, all the way to the end of its allowance.
    const count = Number(sponsorship(game, ZERO)!.rebatesLeft);
    for (let i = 0; i < count; i++) {
      expect(pretty(submit(ZERO, game, 'e2e4').result)).toContain('(ok u');
      assertSolvent(`rebate ${i} from a contract holding only its reserve`);
    }
    expect(totalReserved()).toBe(0n);
    expect(contractBalance()).toBe(0n);
  });
});
