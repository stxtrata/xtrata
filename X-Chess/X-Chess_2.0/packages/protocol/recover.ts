// Recovering a game's rules from its commitment.
//
// A hash cannot be turned back into rules. It can only CONFIRM them: if a
// proposed rule set hashes to what the game committed, no other rule set could
// have produced it, and that is proof.
//
// RULES-V1 section 5 states the consequence plainly: for simple rule sets this
// is a short search, so a game's rules are not private. They were never meant
// to be. This file is that search.
//
// Why it has to exist: without it a board can only referee a game whose rules
// somebody has already typed in, which is fine for the person who created the
// game and useless for everybody else. A visitor arriving at a game has the
// log, the commitment, and nothing else - and that is enough.

import { rulesMatchCommitment } from './canonical.js';
import { ANYONE, ANYONE_ELSE, DEFAULT_RULES, normaliseRules } from './rules.js';
import type { Rules } from './rules.js';
import { START_FEN } from '../chess/fen.js';

export interface RecoveryInput {
  /** What the game committed, lower-case hex or null. */
  rulesHash: string | null;
  /** Who opened it. Almost always one of the players. */
  openedBy: string;
  /** The `ranked` flag on the game row. A hint; the hash decides. */
  ranked: boolean;
  /** Every sender in the log, in any order. */
  senders: readonly string[];
  /**
   * Whoever is looking, if a wallet is connected.
   *
   * A player watching their own game is the missing participant. The chain
   * names only the opener, so a game between A and B opened by B leaves A
   * undiscoverable until A moves - and A is precisely the person most likely to
   * have the board open, waiting to move. Adding the viewer costs one more
   * candidate pair and makes a freshly-opened game readable by both players
   * rather than neither.
   *
   * It cannot make anything wrong: every candidate is still hashed against the
   * commitment, so a viewer who is not a player simply produces candidates that
   * do not match.
   */
  viewer?: string | null;
  /**
   * Rule sets to try BEFORE searching, from outside the chain.
   *
   * The board that opened a game knows its rules exactly, and a link can carry
   * them to the opponent. Neither is trusted: each is hashed against the
   * commitment like any other candidate, and a mismatch is simply not used.
   *
   * This is what makes a freshly-opened named game display correctly. The
   * search cannot find it - with an empty log the only participant it knows is
   * the opener, so a game naming two other people has no candidate to build -
   * and it stays that way until somebody moves.
   */
  candidates?: readonly Rules[];
}

export interface Recovery {
  rules: Rules;
  /** True only when the rules hash to the commitment. */
  confirmed: boolean;
  /** How many candidates were tried. For saying so on screen. */
  tried: number;
}

/**
 * How many distinct senders past the opener are worth considering.
 *
 * A rule set this application can create names at most two people, and the
 * opener is one candidate already, so six is generous by any honest measure.
 *
 * It is a BOUND ON AN ATTACK, not a tuning parameter. Anybody may submit to any
 * game - the contract filters on length and forms no opinion - so the sender
 * list is chosen by whoever wants to fill it, and the search below is quadratic
 * in its size. Measured on this machine: 100 distinct senders is 21,218
 * candidates and 188ms; 1,000 is 2,012,018 and FOURTEEN SECONDS, synchronously,
 * on the main thread. A phone is several times worse.
 *
 * That mattered far more than one game, because recovery runs for every game in
 * the explorer and every ranked game on the leaderboard. One ranked game stuffed
 * with junk froze the leaderboard for every visitor, permanently, in an artefact
 * that cannot be patched.
 */
const MAX_SENDERS = 6;

/**
 * A hard stop on the whole search, whatever the side list turns out to be.
 *
 * The belt to MAX_SENDERS' braces: a bound that holds even if somebody later
 * widens the side list without re-deriving the arithmetic.
 */
const MAX_CANDIDATES = 512;

/**
 * The people who could plausibly be named in a two-player game's rules.
 *
 * The creator, and the first few distinct senders IN SEQUENCE ORDER. Order is
 * load-bearing now and was not before: this took every sender and sorted them
 * alphabetically, which is exactly the wrong end to truncate, because an
 * attacker choosing addresses chooses where in the alphabet they land. The real
 * players submit first, so the first entries in the log are the ones worth
 * keeping.
 *
 * `senders` is fed from getAllEntries in every caller, which is sequence order.
 * That is now part of the contract of this function rather than an incidental
 * property, and it is CONSENSUS-VISIBLE: two boards disagreeing about the kept
 * window would disagree about whether a game can be confirmed, and therefore
 * about whether it is rated.
 */
function participants(input: RecoveryInput): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (who: string | null | undefined): boolean => {
    const value = String(who ?? '').trim().toUpperCase();
    if (!value || seen.has(value)) return false;
    seen.add(value);
    out.push(value);
    return true;
  };

  // The opener first, and never counted against the sender budget: they are
  // named by the game itself rather than by anybody who chose to submit.
  add(input.openedBy);

  let kept = 0;
  for (const sender of input.senders) {
    if (kept >= MAX_SENDERS) break;
    if (add(sender)) kept++;
  }
  return out;
}

/**
 * Try the rule sets a game plausibly committed to, and return the one that
 * hashes to its commitment.
 *
 * The search is deliberately narrow. It covers what this application can
 * CREATE - two named sides, or an open board, from the standard position - and
 * nothing else. A game opened by some other tool with a cooldown, an allow list
 * or a set-up position will not be recovered, and the honest answer there is
 * "this board cannot confirm these rules" rather than a wrong position drawn
 * confidently.
 *
 * Widening it is not free: every extra dimension multiplies the space, and a
 * search that took a visible amount of time would be worse than not knowing.
 */
export function recoverRules(input: RecoveryInput): Recovery {
  const committed = input.rulesHash;
  let tried = 0;

  // No commitment means no rules can ever be confirmed. A board that refereed
  // such a game would be enforcing rules the game never agreed to.
  if (!committed) {
    return { rules: { ...DEFAULT_RULES }, confirmed: false, tried };
  }

  // Offered rule sets first. Same test as everything else: does it hash to
  // what the game committed?
  for (const candidate of input.candidates ?? []) {
    tried++;
    const rules = normaliseRules(candidate);
    if (rulesMatchCommitment(rules, committed)) {
      return { rules, confirmed: true, tried };
    }
  }

  const people = participants(input);
  // The viewer is added AFTER the cap, never squeezed out by it. Recovery has
  // always been reader-dependent in this one way - a board can confirm a game
  // naming the person looking at it, where a stranger's board cannot - and
  // truncating them out would turn that documented widening into a divergence.
  const viewer = String(input.viewer ?? '').toUpperCase();
  if (viewer && !people.includes(viewer)) people.push(viewer);
  // `anyone` and `anyone-else` are values a side can hold, so they belong in the
  // search alongside the named principals.
  const sides = [...people, ANYONE, ANYONE_ELSE];

  // The ranked flag is a hint and the hash is the truth, so both are tried -
  // a game whose flag disagrees with its rules is exactly what the hint pattern
  // is designed to survive.
  const rankedOptions = input.ranked ? [true, false] : [false, true];

  // Set once the hard stop is hit, so the loops below unwind rather than
  // continuing to count.
  let exhausted = false;
  const check = (candidate: Rules): Recovery | null => {
    if (tried >= MAX_CANDIDATES) {
      exhausted = true;
      return null;
    }
    tried++;
    return rulesMatchCommitment(candidate, committed)
      ? { rules: candidate, confirmed: true, tried }
      : null;
  };

  for (const ranked of rankedOptions) {
    if (exhausted) break;
    // The open board first: it is the commonest rule set and the cheapest test.
    const open = normaliseRules({ ...DEFAULT_RULES, ranked });
    const hit = check(open);
    if (hit) return hit;

    for (const white of sides) {
      if (exhausted) break;
      for (const black of sides) {
        if (exhausted) break;
        if (white === ANYONE && black === ANYONE) continue; // already tried
        const candidate = normaliseRules({
          ...DEFAULT_RULES,
          white,
          black,
          ranked,
          startFen: START_FEN
        });
        const found = check(candidate);
        if (found) return found;
      }
    }
  }

  return { rules: { ...DEFAULT_RULES }, confirmed: false, tried };
}
