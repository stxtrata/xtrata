// Elo v1.
//
// The exact formula matters less than the fact that two independent
// implementations, given the same chain history, produce IDENTICAL numbers.
// There is no leaderboard server to be the tie-breaker, so a rating that
// differed between readers would simply be wrong for everybody.
//
// Three things make that hold, and all three are protocol rather than taste:
//
//   ORDER      games are applied in one canonical order, defined below.
//   INTEGERS   ratings are whole numbers, so nothing accumulates a fractional
//              drift that two implementations could round differently.
//   ROUNDING   the one place a fraction becomes an integer is specified
//              exactly, including its behaviour at .5.
//
// Frozen in RATING-V1.md. A change is elo-v2 with its own identifier, and this
// one keeps working, because a rating already published under it must stay
// reproducible forever.

import { RATING_PROTOCOL } from '../protocol/versions.js';
import type { Result } from '../replay/result.js';

export const RATING = RATING_PROTOCOL;

export const INITIAL_RATING = 1200;
export const K_FACTOR = 32;
/** Below this many rated games a rating is shown as provisional. */
export const PROVISIONAL_GAMES = 10;

export interface RatedGame {
  game: number;
  white: string;
  black: string;
  result: Exclude<Result, null>;
  /** The height of the block holding the submission that ended the game. */
  terminalHeight: number;
}

export interface PlayerRating {
  principal: string;
  rating: number;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  whiteGames: number;
  blackGames: number;
  peak: number;
  provisional: boolean;
  /** Rating after each rated game, oldest first. Starts with INITIAL_RATING. */
  history: number[];
  /** Current run of wins (positive), losses (negative), or 0. */
  streak: number;
}

/**
 * The canonical order.
 *
 * Terminal block height first, because that is when the game actually ended,
 * then game id to break a tie. Both are on chain and neither can be disputed.
 *
 * A tie is not rare: two games can finish in the same block. Without the second
 * key the order would depend on whatever order a reader happened to fetch them
 * in, and two readers would compute different ratings from the same history.
 */
export function canonicalOrder(games: readonly RatedGame[]): RatedGame[] {
  return [...games].sort((a, b) => {
    if (a.terminalHeight !== b.terminalHeight) return a.terminalHeight - b.terminalHeight;
    return a.game - b.game;
  });
}

/**
 * The expected score for a player rated `mine` against one rated `theirs`.
 *
 * Returned scaled by 1000 as an integer, so that everything downstream is
 * integer arithmetic.
 *
 * The rating difference is clamped to +/-800. Beyond that the expected score is
 * within a thousandth of 0 or 1 and the clamp changes no outcome, but it does
 * bound the input to `pow` to a range where the result is nowhere near a
 * rounding boundary. See `roundHalfUp` for why that matters.
 */
export function expectedScoreMilli(mine: number, theirs: number): number {
  const diff = Math.max(-800, Math.min(800, theirs - mine));
  const expected = 1 / (1 + Math.pow(10, diff / 400));
  return roundHalfUp(expected * 1000);
}

/**
 * Round to the nearest integer, halves away from zero.
 *
 * Specified rather than left to a language's default because the defaults
 * differ: JavaScript's `Math.round` sends -0.5 to -0, which is half UP, not half
 * away from zero. An implementation in another language using its own "round"
 * would disagree on exactly the values where it matters.
 */
export function roundHalfUp(value: number): number {
  return value < 0 ? -Math.round(-value) : Math.round(value);
}

const SCORE_MILLI: Record<'win' | 'draw' | 'loss', number> = {
  win: 1000,
  draw: 500,
  loss: 0
};

export type Outcome = 'win' | 'draw' | 'loss';

export function outcomeFor(result: Exclude<Result, null>, side: 'white' | 'black'): Outcome {
  if (result === '1/2-1/2') return 'draw';
  const whiteWon = result === '1-0';
  return whiteWon === (side === 'white') ? 'win' : 'loss';
}

/**
 * The rating change for one player in one game.
 *
 * All integer arithmetic after the expected score, which is why that is scaled
 * to a thousandth rather than left as a float: `K * (S - E)` on floats would
 * carry a fractional part into every subsequent game, and two implementations
 * accumulating it in a different order would drift apart.
 */
export function delta(mine: number, theirs: number, outcome: Outcome): number {
  const scored = SCORE_MILLI[outcome];
  const expected = expectedScoreMilli(mine, theirs);
  return roundHalfUp((K_FACTOR * (scored - expected)) / 1000);
}

function blank(principal: string): PlayerRating {
  return {
    principal,
    rating: INITIAL_RATING,
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    whiteGames: 0,
    blackGames: 0,
    peak: INITIAL_RATING,
    provisional: true,
    history: [INITIAL_RATING],
    streak: 0
  };
}

function apply(player: PlayerRating, change: number, outcome: Outcome, side: 'white' | 'black'): void {
  player.rating += change;
  player.games += 1;
  if (side === 'white') player.whiteGames += 1;
  else player.blackGames += 1;

  if (outcome === 'win') {
    player.wins += 1;
    player.streak = player.streak > 0 ? player.streak + 1 : 1;
  } else if (outcome === 'loss') {
    player.losses += 1;
    player.streak = player.streak < 0 ? player.streak - 1 : -1;
  } else {
    player.draws += 1;
    player.streak = 0;
  }

  player.peak = Math.max(player.peak, player.rating);
  player.provisional = player.games < PROVISIONAL_GAMES;
  player.history.push(player.rating);
}

export interface RatingTable {
  players: Map<string, PlayerRating>;
  /** Games actually applied, in the order they were applied. */
  applied: RatedGame[];
}

/**
 * Ratings for every player, from a set of eligible games.
 *
 * Pure and total: the same games in any input order give the same table,
 * because the first thing it does is impose the canonical order.
 */
export function computeRatings(games: readonly RatedGame[]): RatingTable {
  const players = new Map<string, PlayerRating>();
  const ordered = canonicalOrder(games);

  const get = (principal: string): PlayerRating => {
    const key = principal.toUpperCase();
    let existing = players.get(key);
    if (!existing) {
      existing = blank(key);
      players.set(key, existing);
    }
    return existing;
  };

  for (const game of ordered) {
    const white = get(game.white);
    const black = get(game.black);

    const whiteOutcome = outcomeFor(game.result, 'white');
    const blackOutcome = outcomeFor(game.result, 'black');

    // Both deltas are computed from the ratings BEFORE this game. Applying
    // White's change first and then computing Black's against the new number
    // would make the result depend on which player was processed first.
    const whiteDelta = delta(white.rating, black.rating, whiteOutcome);
    const blackDelta = delta(black.rating, white.rating, blackOutcome);

    apply(white, whiteDelta, whiteOutcome, 'white');
    apply(black, blackDelta, blackOutcome, 'black');
  }

  return { players, applied: ordered };
}

export interface LeaderboardRow extends PlayerRating {
  rank: number;
}

/**
 * The leaderboard, ordered deterministically.
 *
 * Rating first, then games played, then the principal itself. The last key is
 * what makes it total: two players on identical numbers must still come out in
 * the same order for every reader, and the principal is the only thing left
 * that is guaranteed unique.
 */
export function leaderboard(
  table: RatingTable,
  { includeProvisional = true }: { includeProvisional?: boolean } = {}
): LeaderboardRow[] {
  const rows = [...table.players.values()].filter(
    (player) => includeProvisional || !player.provisional
  );

  rows.sort((a, b) => {
    if (a.rating !== b.rating) return b.rating - a.rating;
    if (a.games !== b.games) return b.games - a.games;
    return a.principal < b.principal ? -1 : a.principal > b.principal ? 1 : 0;
  });

  return rows.map((player, index) => ({ ...player, rank: index + 1 }));
}
