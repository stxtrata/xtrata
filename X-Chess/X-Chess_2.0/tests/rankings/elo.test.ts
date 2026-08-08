// Elo v1, and the determinism it has to have.
//
// There is no leaderboard server, so a rating that differed between two readers
// would simply be wrong for everybody. The properties below are what make that
// impossible, and they matter more than any particular number.

import { describe, expect, it } from 'vitest';
import {
  INITIAL_RATING,
  K_FACTOR,
  canonicalOrder,
  computeRatings,
  delta,
  expectedScoreMilli,
  leaderboard,
  outcomeFor,
  roundHalfUp
} from '../../packages/ratings/elo-v1.js';
import type { RatedGame } from '../../packages/ratings/elo-v1.js';

const A = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const B = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const C = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';

const game = (over: Partial<RatedGame> & Pick<RatedGame, 'game'>): RatedGame => ({
  white: A,
  black: B,
  result: '1-0',
  terminalHeight: 1000 + over.game,
  ...over
});

describe('the formula', () => {
  it('gives equal players an even expectation', () => {
    expect(expectedScoreMilli(1200, 1200)).toBe(500);
  });

  it('is symmetric: the two expectations sum to one', () => {
    for (const [a, b] of [
      [1200, 1200],
      [1500, 1200],
      [900, 2400],
      [1000, 1001],
      [2000, 1000]
    ]) {
      expect(expectedScoreMilli(a, b) + expectedScoreMilli(b, a), `${a} vs ${b}`).toBe(1000);
    }
  });

  it('moves a winner up and a loser down by the same amount when equal', () => {
    expect(delta(1200, 1200, 'win')).toBe(16);
    expect(delta(1200, 1200, 'loss')).toBe(-16);
    expect(delta(1200, 1200, 'draw')).toBe(0);
  });

  it('rewards beating a stronger player more', () => {
    expect(delta(1200, 1600, 'win')).toBeGreaterThan(delta(1200, 1000, 'win'));
  });

  it('never moves a rating by more than K', () => {
    for (let mine = 600; mine <= 2600; mine += 50) {
      for (let theirs = 600; theirs <= 2600; theirs += 50) {
        for (const outcome of ['win', 'draw', 'loss'] as const) {
          expect(Math.abs(delta(mine, theirs, outcome))).toBeLessThanOrEqual(K_FACTOR);
        }
      }
    }
  });

  it('rounds halves away from zero, which is not what Math.round does', () => {
    // JavaScript's Math.round sends -0.5 to -0, which is half UP rather than
    // half away from zero. An implementation in another language using its own
    // "round" would disagree on exactly the values where it matters.
    expect(roundHalfUp(0.5)).toBe(1);
    expect(roundHalfUp(-0.5)).toBe(-1);
    expect(Math.round(-0.5)).toBe(-0);
    expect(roundHalfUp(1.5)).toBe(2);
    expect(roundHalfUp(-1.5)).toBe(-2);
    expect(roundHalfUp(2.4)).toBe(2);
  });

  it('can never land on a rounding boundary, by construction', () => {
    // The one place a fraction becomes an integer is `delta`. If a computation
    // ever landed on exactly .5, two implementations whose `pow` differs in the
    // last bit could round it differently and diverge forever after.
    //
    // It cannot happen, and the reason is arithmetic rather than luck. The
    // expected score is rounded to a whole thousandth BEFORE this, so
    //
    //     raw = 32 * d / 1000 = 4d / 125,   d an integer in [-1000, 1000]
    //
    // and 125 is odd. For raw to be a half-integer we would need 8d = 125(2k+1),
    // with an even left side and an odd right side. So the fractional part is
    // always a multiple of 1/125, and the closest it can come to .5 is 1/250.
    //
    // That is 0.004, against the roughly 1e-13 a last-ulp difference in `pow`
    // could contribute. Eleven orders of magnitude of margin. This walks the
    // range to confirm the reasoning rather than trusting it.
    let worst = 1;
    for (let mine = 100; mine <= 3000; mine += 10) {
      for (let theirs = 100; theirs <= 3000; theirs += 10) {
        for (const scored of [1000, 500, 0]) {
          const expected = expectedScoreMilli(mine, theirs);
          const raw = (K_FACTOR * (scored - expected)) / 1000;
          // Distance from the nearest half-integer boundary.
          worst = Math.min(worst, Math.abs((Math.abs(raw) % 1) - 0.5));
        }
      }
    }
    expect(worst).toBeGreaterThanOrEqual(1 / 250 - 1e-12);
  });
});

describe('canonical order', () => {
  it('orders by terminal height, then game id', () => {
    const games = [
      game({ game: 5, terminalHeight: 100 }),
      game({ game: 2, terminalHeight: 100 }),
      game({ game: 9, terminalHeight: 50 })
    ];
    expect(canonicalOrder(games).map((g) => g.game)).toEqual([9, 2, 5]);
  });

  it('breaks a same-block tie the same way every time', () => {
    // Two games CAN finish in the same block. Without the second key the order
    // would depend on the order a reader happened to fetch them in.
    const games = [
      game({ game: 3, terminalHeight: 77 }),
      game({ game: 1, terminalHeight: 77 }),
      game({ game: 2, terminalHeight: 77 })
    ];
    expect(canonicalOrder(games).map((g) => g.game)).toEqual([1, 2, 3]);
  });

  it('does not modify the input', () => {
    const games = [game({ game: 2 }), game({ game: 1 })];
    canonicalOrder(games);
    expect(games.map((g) => g.game)).toEqual([2, 1]);
  });
});

describe('determinism', () => {
  const corpus: RatedGame[] = [
    game({ game: 1, white: A, black: B, result: '1-0', terminalHeight: 10 }),
    game({ game: 2, white: B, black: C, result: '0-1', terminalHeight: 20 }),
    game({ game: 3, white: C, black: A, result: '1/2-1/2', terminalHeight: 20 }),
    game({ game: 4, white: A, black: C, result: '1-0', terminalHeight: 35 }),
    game({ game: 5, white: B, black: A, result: '1-0', terminalHeight: 35 }),
    game({ game: 6, white: C, black: B, result: '1/2-1/2', terminalHeight: 40 })
  ];

  const snapshot = (games: RatedGame[]): string => {
    const table = computeRatings(games);
    return leaderboard(table)
      .map((row) => `${row.rank}:${row.principal}:${row.rating}:${row.games}:${row.peak}:${row.streak}`)
      .join('|');
  };

  it('gives the same table whatever order the games arrive in', () => {
    // A reader fetching games concurrently gets them in an arbitrary order.
    const expected = snapshot(corpus);
    for (const seed of [1, 2, 3, 4, 5]) {
      const shuffled = [...corpus];
      // A fixed, seeded shuffle, so a failure is reproducible.
      let state = seed;
      for (let i = shuffled.length - 1; i > 0; i--) {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        const j = state % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      expect(snapshot(shuffled), `seed ${seed}`).toBe(expected);
    }
  });

  it('gives the same table when run twice', () => {
    expect(snapshot(corpus)).toBe(snapshot(corpus));
  });

  it('keeps every rating a whole number, so nothing drifts', () => {
    const table = computeRatings(corpus);
    for (const player of table.players.values()) {
      expect(Number.isInteger(player.rating), player.principal).toBe(true);
      for (const value of player.history) expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('computes both players\' changes from the ratings before the game', () => {
    // Applying White's change first and then computing Black's against the new
    // number would make the outcome depend on which player was processed first.
    const table = computeRatings([game({ game: 1, white: A, black: B, result: '1-0' })]);
    const white = table.players.get(A)!;
    const black = table.players.get(B)!;
    expect(white.rating - INITIAL_RATING).toBe(-(black.rating - INITIAL_RATING));
  });
});

describe('a player\'s record', () => {
  it('counts colours, results, peak and streak', () => {
    const table = computeRatings([
      game({ game: 1, white: A, black: B, result: '1-0', terminalHeight: 1 }),
      game({ game: 2, white: B, black: A, result: '0-1', terminalHeight: 2 }),
      game({ game: 3, white: A, black: B, result: '1/2-1/2', terminalHeight: 3 }),
      game({ game: 4, white: A, black: B, result: '0-1', terminalHeight: 4 })
    ]);
    const a = table.players.get(A)!;
    expect(a.games).toBe(4);
    expect(a.wins).toBe(2);
    expect(a.draws).toBe(1);
    expect(a.losses).toBe(1);
    expect(a.whiteGames).toBe(3);
    expect(a.blackGames).toBe(1);
    expect(a.streak).toBe(-1);
    expect(a.peak).toBeGreaterThanOrEqual(a.rating);
    // One entry for the starting rating, plus one per game.
    expect(a.history).toHaveLength(5);
    expect(a.history[0]).toBe(INITIAL_RATING);
  });

  it('is provisional until enough games have been played', () => {
    const games: RatedGame[] = [];
    for (let i = 1; i <= 12; i++) {
      games.push(game({ game: i, white: A, black: B, result: '1/2-1/2', terminalHeight: i }));
    }
    const early = computeRatings(games.slice(0, 9)).players.get(A)!;
    const later = computeRatings(games).players.get(A)!;
    expect(early.provisional).toBe(true);
    expect(later.provisional).toBe(false);
  });

  it('starts everybody at the same place', () => {
    const table = computeRatings([]);
    expect(table.players.size).toBe(0);
    const one = computeRatings([game({ game: 1, result: '1/2-1/2' })]);
    expect(one.players.get(A)!.rating).toBe(INITIAL_RATING);
  });
});

describe('the leaderboard', () => {
  it('orders by rating, then games, then principal', () => {
    // The last key is what makes it total. Two players on identical numbers
    // must still come out in the same order for every reader.
    const table = computeRatings([
      game({ game: 1, white: A, black: B, result: '1/2-1/2', terminalHeight: 1 }),
      game({ game: 2, white: C, black: A, result: '1/2-1/2', terminalHeight: 2 })
    ]);
    const rows = leaderboard(table);
    expect(rows.map((r) => r.rating)).toEqual([...rows.map((r) => r.rating)].sort((a, b) => b - a));
    const tied = rows.filter((r) => r.rating === rows[0].rating);
    if (tied.length > 1) {
      const byGames = [...tied].sort((a, b) =>
        a.games !== b.games ? b.games - a.games : a.principal < b.principal ? -1 : 1
      );
      expect(tied.map((r) => r.principal)).toEqual(byGames.map((r) => r.principal));
    }
  });

  it('can leave provisional players out', () => {
    const table = computeRatings([game({ game: 1, result: '1-0' })]);
    expect(leaderboard(table, { includeProvisional: false })).toHaveLength(0);
    expect(leaderboard(table).length).toBeGreaterThan(0);
  });

  it('numbers ranks from one with no gaps', () => {
    const table = computeRatings([
      game({ game: 1, white: A, black: B, result: '1-0', terminalHeight: 1 }),
      game({ game: 2, white: B, black: C, result: '1-0', terminalHeight: 2 })
    ]);
    expect(leaderboard(table).map((r) => r.rank)).toEqual([1, 2, 3]);
  });
});

describe('reading a result', () => {
  it('turns a score into an outcome for each side', () => {
    expect(outcomeFor('1-0', 'white')).toBe('win');
    expect(outcomeFor('1-0', 'black')).toBe('loss');
    expect(outcomeFor('0-1', 'white')).toBe('loss');
    expect(outcomeFor('0-1', 'black')).toBe('win');
    expect(outcomeFor('1/2-1/2', 'white')).toBe('draw');
    expect(outcomeFor('1/2-1/2', 'black')).toBe('draw');
  });
});
