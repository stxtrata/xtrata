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
 * The people who could plausibly be named in a two-player game's rules.
 *
 * The creator, and anybody who has submitted. That is a small set - two for an
 * ordinary game - and it is drawn entirely from the chain.
 */
function participants(input: RecoveryInput): string[] {
  const out = new Set<string>();
  const add = (who: string | null | undefined): void => {
    const value = String(who ?? '').trim().toUpperCase();
    if (value) out.add(value);
  };
  add(input.openedBy);
  for (const sender of input.senders) add(sender);
  return [...out].sort();
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
  const viewer = String(input.viewer ?? '').toUpperCase();
  if (viewer && !people.includes(viewer)) people.push(viewer);
  // `anyone` and `anyone-else` are values a side can hold, so they belong in the
  // search alongside the named principals.
  const sides = [...people, ANYONE, ANYONE_ELSE];

  // The ranked flag is a hint and the hash is the truth, so both are tried -
  // a game whose flag disagrees with its rules is exactly what the hint pattern
  // is designed to survive.
  const rankedOptions = input.ranked ? [true, false] : [false, true];

  const check = (candidate: Rules): Recovery | null => {
    tried++;
    return rulesMatchCommitment(candidate, committed)
      ? { rules: candidate, confirmed: true, tried }
      : null;
  };

  for (const ranked of rankedOptions) {
    // The open board first: it is the commonest rule set and the cheapest test.
    const open = normaliseRules({ ...DEFAULT_RULES, ranked });
    const hit = check(open);
    if (hit) return hit;

    for (const white of sides) {
      for (const black of sides) {
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
