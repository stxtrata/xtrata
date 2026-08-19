// A tournament that has loaded should stay loaded, and a move should cost one
// game rather than ninety.
//
// Two faults, one after the other. The poll compared a signature of the
// unfinished games against the last one, and the last one was CLEARED at the
// end of every successful load — anything differs from nothing, so the first
// poll always found a change and reloaded everything, which cleared it again.
// Ninety pairings re-checked and ninety games re-replayed every thirty
// seconds, whether or not a move had been played.
//
// With that fixed it was stable until a round ended, and then did the same
// full reload to record five results — because a string comparison says
// something changed and cannot say what. The rows that identify the games are
// read by the poll itself.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { scoreTournament } from '../../packages/ui/tournaments.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import type { Tournament } from '../../packages/protocol/tournament.js';

const WHITE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BLACK = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';

/** A localStorage that behaves, so the facts cache is real in this test. */
function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v)
  } as Storage;
}

beforeEach(() => {
  resetForTests();
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
  (globalThis as unknown as Record<string, unknown>).localStorage = fakeStorage();
  mountShell(dom.window.document);
});

const MATE = ['f2f3', 'e7e5', 'g2g4', 'd8h4'];

const TOURNAMENT = {
  name: 'Exhibition', format: 'round robin', contract: 'SP000000000000000000002Q6VF78.xchess',
  entrants: [
    { name: 'Wilma', address: WHITE },
    { name: 'Barney', address: BLACK }
  ],
  games: [
    { id: 1, white: 'Wilma', black: 'Barney', round: 1 },
    { id: 2, white: 'Barney', black: 'Wilma', round: 1 },
    { id: 3, white: 'Wilma', black: 'Barney', round: 2 }
  ]
} as Tournament;

const view = () =>
  ({ ok: true, problems: [], tournamentId: 1, lineage: [], tournament: TOURNAMENT,
     provenance: null, says: '', honoured: true, table: [], rounds: [], scored: false,
     revision: null }) as never;

/**
 * Counts what the chain was asked, so "cost" is measured and not asserted.
 *
 * `longer` is a game that has since gained a submission — which is the only
 * reason a poll would name it, and the thing that makes its cached facts stale.
 */
function chain(longer: number | null = null) {
  const counts = { rows: 0, entries: 0 };
  const lengthOf = (id: number): number => (id === longer ? MATE.length + 2 : MATE.length);
  return {
    counts,
    deps: {
      chain: {
        contractId: 'SP000000000000000000002Q6VF78.xchess',
        async getGame(id: number) {
          counts.rows++;
          return { id, nextSeq: lengthOf(id), openedAt: 100, openedBy: WHITE,
                   ranked: true, rulesHash: `0xhash${id}` };
        },
        async getAllEntries(id: number) {
          counts.entries++;
          // The extra two are submissions replay skips: the game is already
          // over, which is exactly what a finishing round looks like.
          const moves = id === longer ? [...MATE, 'a1a1', 'h8h8'] : MATE;
          return moves.map((mv, seq) => ({
            seq, value: mv, sender: seq % 2 === 0 ? WHITE : BLACK, height: 200 + seq
          }));
        }
      },
      reader: { async mintedAt() { return 90; } },
      compiledAcceptedBefore: 0
    } as never
  };
}

describe('rescoring after a game moves', () => {
  it('reads every game the first time', async () => {
    const a = chain();
    await scoreTournament(view(), a.deps);
    expect(a.counts.entries, 'three games, three replays').toBe(3);
    expect(a.counts.rows).toBe(3);
  });

  it('re-derives only the game that moved', async () => {
    // The whole point. A round ending used to cost the entire tournament.
    await scoreTournament(view(), chain().deps);

    const b = chain(2);
    await scoreTournament(view(), b.deps, { only: new Set([2]) });

    expect(b.counts.entries, 'one game replayed, not three').toBe(1);
    expect(b.counts.rows, 'and no rows: the poll has already read them').toBe(1);
  });

  it('still produces the whole table, not just the game that moved', async () => {
    await scoreTournament(view(), chain().deps);
    const after = await scoreTournament(view(), chain(2).deps, { only: new Set([2]) });

    const games = after.rounds.flatMap((r) => r.games);
    expect(games.map((g) => g.id).sort(), 'every game is still on screen').toEqual([1, 2, 3]);

    // The one that moved carries its NEW count, and the ones that did not
    // carry the count they were remembered with. A rescore that dropped either
    // would look like a working table and be a partial one.
    expect(games.find((g) => g.id === 2)?.submissions).toBe(MATE.length + 2);
    expect(games.find((g) => g.id === 1)?.submissions).toBe(MATE.length);
    expect(games.find((g) => g.id === 3)?.submissions).toBe(MATE.length);
  });

  it('falls back to reading a game it remembers nothing about', async () => {
    // A gap in the cache must never become a gap in the table.
    const cold = chain(2);
    await scoreTournament(view(), cold.deps, { only: new Set([2]) });
    expect(cold.counts.entries, 'nothing remembered, so everything is read').toBe(3);
  });

  it('carries submissions through, which is what the poll compares', async () => {
    // Not `moves`. They differ for any game with a skipped submission, and
    // mixing them made a signature that could not equal itself.
    const scored = await scoreTournament(view(), chain().deps);
    for (const game of scored.rounds.flatMap((r) => r.games)) {
      expect(game.submissions).toBe(MATE.length);
    }
  });
});
