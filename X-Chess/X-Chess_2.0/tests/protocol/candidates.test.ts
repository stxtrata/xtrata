// The guesses two different programs must agree on.
//
// The board built these and the checkpoint builder did not — it passed
// `candidates: []` — so the builder counted 33 of 128 ranked games where the
// board counts 114. A checkpoint written from that would have told a board to
// skip games it could have counted, permanently, in a document that is
// believed rather than replayed.
//
// One implementation now. These tests are about the properties that make it
// safe to share: the same inputs give the same guesses, in the same order,
// bounded the same way.

import { describe, expect, it } from 'vitest';
import {
  candidatesFor, learnFrom, MAX_PAIR_CANDIDATES, MAX_PAIRED_ENTRANTS, nothingLearned
} from '../../packages/protocol/candidates.js';
import type { Tournament } from '../../packages/protocol/tournament.js';

const A = 'SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB';
const B = 'SP290YBDWN08X61HRZ3GAEA0YES001DJ6YX51HYKN';
const C = 'SP1T7TGSAFZA0JMYZP4C65QS1BYRQ03DS9E9YYHRX';

const tournament = (over: Partial<Tournament> = {}): Tournament =>
  ({
    name: 'Exhibition', format: 'round robin',
    contract: 'SP000000000000000000002Q6VF78.xchess',
    entrants: [{ name: 'Gambit', address: A }, { name: 'Ledger', address: B }],
    games: [{ id: 7, white: 'Gambit', black: 'Ledger', round: 1 }],
    ...over
  }) as Tournament;

describe('learning what a manifest says', () => {
  it('records the pairing by game id, as addresses', () => {
    const learned = nothingLearned();
    learnFrom(tournament({ cooldown: 1 } as Partial<Tournament>), learned);
    expect(learned.pairings.get(7)).toEqual({ white: A, black: B, cooldown: 1 });
  });

  it('records entrants upper-cased, because identity is the address', () => {
    const learned = nothingLearned();
    learnFrom(tournament({ entrants: [{ name: 'Gambit', address: A.toLowerCase() }] } as never), learned);
    expect(learned.entrants.has(A)).toBe(true);
  });

  it('always knows about cooldown zero, and learns the rest', () => {
    const learned = nothingLearned();
    expect(learned.cooldowns.has(0)).toBe(true);
    learnFrom(tournament({ cooldown: 1 } as Partial<Tournament>), learned);
    expect([...learned.cooldowns].sort()).toEqual([0, 1]);
  });

  it('accumulates across manifests, which is the point of reading them all', () => {
    // Exhibition One declares no cooldown and Three declares 1. Reading only
    // the first left `cooldowns` at {0}, and Three's games hashed to nothing.
    const learned = nothingLearned();
    learnFrom(tournament({ cooldown: 0 } as Partial<Tournament>), learned);
    learnFrom(tournament({
      cooldown: 1,
      entrants: [{ name: 'Plumb', address: C }, { name: 'Ledger', address: B }],
      games: [{ id: 90, white: 'Plumb', black: 'Ledger', round: 1 }]
    } as never), learned);
    expect(learned.cooldowns.has(1)).toBe(true);
    expect(learned.entrants.size).toBe(3);
    expect(learned.pairings.size).toBe(2);
  });

  it('ignores a game naming somebody who is not an entrant', () => {
    const learned = nothingLearned();
    learnFrom(tournament({ games: [{ id: 7, white: 'Gambit', black: 'Nobody', round: 1 }] } as never), learned);
    expect(learned.pairings.size, 'a pairing with no address is not a pairing').toBe(0);
  });
});

describe('the guesses offered for one game', () => {
  it('offers the manifest pairing first, ahead of the pair space', () => {
    // Order is not cosmetic: candidates are checked before recovery's own
    // search and spend the same budget, so the likeliest goes first.
    const learned = nothingLearned();
    learnFrom(tournament({ cooldown: 1 } as Partial<Tournament>), learned);
    const offered = candidatesFor({ id: 7, rulesHash: '0xabc' }, learned);
    expect(offered[0].white).toBe(A);
    expect(offered[0].black).toBe(B);
    expect(offered[0].cooldown).toBe(1);
  });

  it('offers entrant pairs for a game no manifest names', () => {
    // Round one predates the manifest, and its absent side never submitted —
    // so recovery cannot reach it and only a pair offer can.
    const learned = nothingLearned();
    learnFrom(tournament(), learned);
    const offered = candidatesFor({ id: 999, rulesHash: '0xabc' }, learned);
    expect(offered.length, 'no pairing, but the entrants are known').toBeGreaterThan(0);
    expect(offered.some((r) => r.white === A && r.black === B)).toBe(true);
    expect(offered.some((r) => r.white === B && r.black === A), 'both orders').toBe(true);
  });

  it("puts the game's own declared cooldown before the others", () => {
    const learned = nothingLearned();
    learnFrom(tournament({ cooldown: 1 } as Partial<Tournament>), learned);
    learned.cooldowns.add(5);
    const pairs = candidatesFor({ id: 7, rulesHash: '0xabc' }, learned).slice(1);
    expect(pairs[0].cooldown, 'if the budget runs out it must not run out on this one').toBe(1);
  });

  it('drops the pair space entirely past the entrant cap, never truncates it', () => {
    // A TRUNCATED list would depend on set iteration order, so two readers
    // could disagree about whether a game is confirmable. That is the one
    // property this must not have.
    const learned = nothingLearned();
    for (let i = 0; i < MAX_PAIRED_ENTRANTS + 1; i++) {
      learned.entrants.add(`SP${String(i).padStart(38, '0')}`);
    }
    expect(candidatesFor({ id: 999, rulesHash: '0xabc' }, learned)).toEqual([]);
  });

  it('never spends more than its share of recovery budget', () => {
    const learned = nothingLearned();
    for (let i = 0; i < MAX_PAIRED_ENTRANTS; i++) {
      learned.entrants.add(`SP${String(i).padStart(38, '0')}`);
    }
    for (const cooldown of [0, 1, 2, 3, 4]) learned.cooldowns.add(cooldown);
    expect(candidatesFor({ id: 999, rulesHash: '0xabc' }, learned).length)
      .toBeLessThanOrEqual(MAX_PAIR_CANDIDATES + 1);
  });

  it('appends the caller’s own remembered answer last', () => {
    // The board passes `knownRules(hash)` here; the checkpoint builder has no
    // storage to remember anything in and passes nothing.
    const learned = nothingLearned();
    learnFrom(tournament(), learned);
    const extra = { white: C, black: C, ranked: true, cooldown: 9 } as never;
    const withExtra = candidatesFor({ id: 7, rulesHash: '0xabc' }, learned, extra);
    const without = candidatesFor({ id: 7, rulesHash: '0xabc' }, learned, null);
    expect(withExtra.length).toBe(without.length + 1);
    expect(withExtra[withExtra.length - 1]).toBe(extra);
  });

  it('gives the same answer twice, which is what sharing it requires', () => {
    const learned = nothingLearned();
    learnFrom(tournament({ cooldown: 1 } as Partial<Tournament>), learned);
    const once = candidatesFor({ id: 7, rulesHash: '0xabc' }, learned);
    const twice = candidatesFor({ id: 7, rulesHash: '0xabc' }, learned);
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
  });
});
