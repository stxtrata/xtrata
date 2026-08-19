// A tournament somebody already scored should not be scored from scratch again.
//
// The complaint: returning to a tournament took as long as the first visit.
// The manifest was cached and nothing derived from it was, so every visit read
// every game row, paged every entry, and replayed every game — for a twenty-one
// game exhibition that is the row reads plus sixty-odd page reads plus
// twenty-one replays, for an answer that had not changed and could not.
//
// What these hold is the shape of the fix rather than its speed: a hit must be
// CHECKED against the chain and not merely found, and anything the chain
// disagrees with must lose.

import { beforeEach, describe, expect, it } from 'vitest';
import { scoreTournament } from '../../packages/ui/tournaments.js';
import type { Tournament } from '../../packages/protocol/tournament.js';

const WHITE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BLACK = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';

/** A localStorage that behaves, for an environment that has none. */
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
  (globalThis as unknown as Record<string, unknown>).localStorage = fakeStorage();
});

const TOURNAMENT = (cooldown?: number): Tournament =>
  ({
    name: 'Exhibition',
    format: 'round robin',
    contract: 'SP000000000000000000002Q6VF78.xchess',
    ...(cooldown === undefined ? {} : { cooldown }),
    entrants: [
      { name: 'Wilma', address: WHITE },
      { name: 'Barney', address: BLACK }
    ],
    games: [{ id: 1, white: 'Wilma', black: 'Barney', round: 1 }]
  }) as Tournament;

/** Fool's mate: four accepted moves, Black wins, and the game is over. */
const MATE = ['f2f3', 'e7e5', 'g2g4', 'd8h4'];

function deps(moves: string[] = MATE) {
  const counts = { rows: 0, entries: 0 };
  const chain = {
    contractId: 'SP000000000000000000002Q6VF78.xchess',
    async getGame() {
      counts.rows++;
      return { id: 1, nextSeq: moves.length, openedAt: 100, openedBy: WHITE, ranked: true, rulesHash: '0xabc' };
    },
    async getAllEntries() {
      counts.entries++;
      return moves.map((mv, seq) => ({
        seq,
        value: mv,
        sender: seq % 2 === 0 ? WHITE : BLACK,
        height: 200 + seq
      }));
    }
  };
  const reader = { async mintedAt() { return 90; } };
  return {
    counts,
    deps: { chain, reader, compiledAcceptedBefore: 0 } as never
  };
}

const view = (t: Tournament) =>
  ({ ok: true, problems: [], tournamentId: 1, lineage: [], tournament: t, provenance: null,
     says: '', honoured: true, table: [], rounds: [], scored: false }) as never;

describe('scoring a tournament twice', () => {
  it('does not page the entries again when nothing moved', async () => {
    const a = deps();
    const first = await scoreTournament(view(TOURNAMENT()), a.deps);
    expect(a.counts.entries, 'the first visit must do the work').toBe(1);
    expect(first.rounds[0].games[0].result).toBe('0-1');

    const b = deps();
    const second = await scoreTournament(view(TOURNAMENT()), b.deps);
    expect(b.counts.entries, 'the second visit must not').toBe(0);
    // The row is STILL read. That is what makes the cache safe rather than fast.
    expect(b.counts.rows).toBe(1);
    expect(second.rounds[0].games[0].result).toBe('0-1');
    expect(second.table).toEqual(first.table);
  });

  it('reads again when the game has moved on', async () => {
    const a = deps(MATE.slice(0, 2));
    await scoreTournament(view(TOURNAMENT()), a.deps);

    const b = deps(MATE);
    await scoreTournament(view(TOURNAMENT()), b.deps);
    expect(b.counts.entries, 'a longer log is a different log').toBe(1);
  });

  it('reads again when the tournament declares different rules', async () => {
    // A replay is only reusable under the rules it ran with. Results would not
    // move for a cooldown - it cannot reject anything in a two-player game -
    // but reusing across rule sets would make this correct by coincidence.
    const a = deps();
    await scoreTournament(view(TOURNAMENT()), a.deps);

    const b = deps();
    await scoreTournament(view(TOURNAMENT(1)), b.deps);
    expect(b.counts.entries).toBe(1);
  });

  it('never remembers a read that came back short', async () => {
    // A rate limit wearing a game's clothes. `getAllEntries` pages, and a page
    // that does not arrive returns what it has - caching that would make the
    // outage permanent and turn it into a result.
    const short = deps();
    short.deps.chain.getAllEntries = async () => {
      short.counts.entries++;
      return [{ seq: 0, value: 'f2f3', sender: WHITE, height: 200 }];
    };
    await scoreTournament(view(TOURNAMENT()), short.deps);

    const after = deps();
    await scoreTournament(view(TOURNAMENT()), after.deps);
    expect(after.counts.entries, 'a partial read must not be reused').toBe(1);
  });
});
