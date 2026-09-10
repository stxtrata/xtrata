// The guesses worth testing when a game's rules must be recovered.
//
// ONE IMPLEMENTATION, because there are now two callers and they must agree.
// The board builds these for the Leaderboard, Explore and the Game tab; the
// checkpoint builder must build the SAME ones, because a checkpoint that counts
// fewer games than the board would is a document telling a board to skip games
// it could have counted — and a checkpoint is believed rather than replayed, so
// nothing downstream would notice.
//
// That is not hypothetical. The builder passed no candidates at all and counted
// 33 of 128 ranked games where the board counts 114. Inscribing it would have
// dropped about eighty games of rating history permanently.
//
// NOTHING HERE IS TRUSTED. Every entry is a guess and the committed rules hash
// is the judge, so a wrong guess costs one hash and confirms nothing.

import { DEFAULT_RULES, normaliseRules, type Rules } from './rules.js';
import type { Tournament } from './tournament.js';

/**
 * Above this many entrants the pair space is dropped entirely rather than
 * truncated, because a truncated pair list makes recovery depend on map
 * iteration order — two readers would disagree about whether a game can be
 * confirmed, which is the one property this must not have.
 */
export const MAX_PAIRED_ENTRANTS = 12;

/**
 * How many pair candidates a caller may spend of recovery's 512.
 *
 * Candidates supplied here are checked BEFORE recover's own search and spend
 * the same budget, so an unbounded pair space silently starves the fallback
 * that finds games no manifest names — and a starved search returns
 * unconfirmed, which reads exactly like a game that cannot be recovered at all.
 */
export const MAX_PAIR_CANDIDATES = 254;

/** What a manifest claims about one game. */
export interface PairingClaim {
  white: string;
  black: string;
  cooldown: number;
}

/** Everything read from manifests that a candidate list is built out of. */
export interface Learned {
  /** game id -> the two addresses a manifest says played it. */
  pairings: Map<number, PairingClaim>;
  /** Entrant addresses, upper-cased, across every manifest read. */
  entrants: Set<string>;
  /** Every cooldown any manifest declares. Always contains 0. */
  cooldowns: Set<number>;
}

/** An empty set of learnings, ready to be filled by `learnFrom`. */
export function nothingLearned(): Learned {
  return { pairings: new Map(), entrants: new Set(), cooldowns: new Set([0]) };
}

/**
 * Record what one tournament manifest says, for later candidate building.
 *
 * Addresses are upper-cased on the way in because identity is the address and
 * two manifests may spell one differently; names are deliberately NOT recorded
 * here, since only the board displays them.
 */
export function learnFrom(tournament: Tournament, into: Learned): void {
  const addressOfName = new Map(tournament.entrants.map((e) => [e.name, e.address]));
  into.cooldowns.add(tournament.cooldown ?? 0);
  for (const entrant of tournament.entrants) {
    into.entrants.add(entrant.address.toUpperCase());
  }
  for (const game of tournament.games) {
    const white = addressOfName.get(game.white);
    const black = addressOfName.get(game.black);
    if (white && black) {
      into.pairings.set(game.id, { white, black, cooldown: tournament.cooldown ?? 0 });
    }
  }
}

/**
 * The guesses worth testing for one game, in the order worth testing them.
 *
 * A MANIFEST SUPPLIES THE CANDIDATE RECOVERY CANNOT GUESS. `recoverRules`
 * searches the opener and whoever has submitted, which fails whenever neither
 * is a player or the log is short.
 *
 * AND THE ENTRANTS, FOR THE GAMES NO MANIFEST NAMES. Games played before there
 * was a manifest have no exact pairing, and what they have in common is a
 * player who never submitted — a forfeit, an abort — so the absent side is
 * missing from recovery's search entirely. Trying every ordered pair of known
 * entrants offers that side back. All local hashing, no reads.
 *
 * `extra` is for a caller that has its own remembered answer for this hash;
 * the board passes `knownRules(row.rulesHash)` and the checkpoint builder,
 * which has no local storage to remember anything in, passes nothing.
 */
export function candidatesFor(
  game: { id: number; rulesHash?: string | null },
  learned: Learned,
  extra: Rules | null = null
): Rules[] {
  const claimed = learned.pairings.get(game.id);
  const fromManifest = claimed
    ? normaliseRules({
        ...DEFAULT_RULES,
        white: claimed.white,
        black: claimed.black,
        ranked: true,
        cooldown: claimed.cooldown
      })
    : null;

  const pairs: Rules[] = [];
  const entrants = [...learned.entrants];
  if (entrants.length <= MAX_PAIRED_ENTRANTS) {
    // THIS GAME'S OWN COOLDOWN FIRST, then the others. If the budget runs out
    // it should run out on the least likely guesses, not on the one the
    // manifest actually declared for the tournament this game is in.
    const ordered = [...new Set([claimed?.cooldown ?? 0, ...learned.cooldowns])];
    outer: for (const cooldown of ordered) {
      for (const white of entrants) {
        for (const black of entrants) {
          if (white === black) continue;
          if (pairs.length >= MAX_PAIR_CANDIDATES) break outer;
          pairs.push(normaliseRules({ ...DEFAULT_RULES, white, black, ranked: true, cooldown }));
        }
      }
    }
  }

  return [fromManifest, ...pairs, extra].filter((r): r is Rules => r !== null);
}
