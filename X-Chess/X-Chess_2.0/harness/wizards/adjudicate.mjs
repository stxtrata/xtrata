// Ending a game that has stopped being a game.
//
// THE ARBITER, NOT A PLAYER. Nothing here is offered to a character and nothing
// here is in anybody's prompt, which is deliberate and is the whole design.
//
// The obvious alternative — tell each character it may resign — is worse in two
// ways that are hard to undo. Models resign unreliably in both directions: they
// fold in equal positions and grind on in dead ones, and that noise would land
// straight in the rankings. Worse, it is exploitable. Entries are inscribed and
// public, so an entrant who writes "never resign" farms half a point off every
// opponent that does, and within a round the tournament stops measuring chess
// and starts measuring resignation policy.
//
// So the harness adjudicates, on a number it already computes, identically for
// everybody. A character's style decides its moves; it does not get to decide
// when a decided game ends.
//
// WHAT IT COST TO LEARN THIS. Round 2, game 18: Oblique reached plus five at
// MOVE 25 and was still shuffling at move 113. Two hundred and twenty-five
// submissions, 0.675 STX of miner fees, and about 0.53 of that spent after the
// result stopped being in doubt.

import { materialBalance } from './chooser.mjs';

/**
 * How far ahead counts as decided.
 *
 * Five is a rook, or a piece and two pawns. Below that a position can still be
 * lost by the side that is ahead, and adjudicating it would be taking a result
 * off somebody who might have earned it back.
 */
export const DECISIVE_GAP = 5;

/**
 * How long it has to stay that way first.
 *
 * A gap can be decisive for one move and gone the next, so the trigger is not
 * the lead now, it is a lead that has HELD. Thirty moves is long enough that a
 * player who is genuinely converting has converted, and short enough that a
 * decided game does not run for another hundred.
 *
 * MEASURED AS "STILL DECISIVE", NOT "UNCHANGED", and the first version got this
 * wrong. It asked for the gap to hold one exact value, which sounds like the
 * same thing and is not: in a real endgame pawns get pushed, promoted and
 * taken, so the number wobbles between +5 and +9 constantly. Replayed against
 * the two games that motivated the rule, that version NEVER FIRED ONCE — not on
 * game 18, which had been decided since move 25 and ran to 115.
 *
 * Counted in moves rather than plies because that is how every other drawing
 * rule in chess reads, and being out by a factor of two here would call games
 * at fifteen.
 */
export const STATIC_MOVES = 30;

/**
 * Should this game be called, and against whom.
 *
 * Takes the position after every accepted move, because the question is not
 * "what is the position now" but "how long has it been like this".
 *
 * @param {string[]} fens one FEN per accepted move, in order
 * @returns {{ call: boolean, loser: 'white'|'black'|null, gap: number, staticFor: number }}
 */
export function adjudicate(fens, { gap: minGap = DECISIVE_GAP, staticMoves = STATIC_MOVES } = {}) {
  const idle = { call: false, loser: null, gap: 0, staticFor: 0 };
  if (!Array.isArray(fens) || fens.length === 0) return idle;

  const gapAt = (fen) => {
    const { white, black } = materialBalance(fen);
    return white - black;
  };

  const now = gapAt(fens[fens.length - 1]);
  if (Math.abs(now) < minGap) return { ...idle, gap: now };

  // How far back the lead has been decisive AND on the same side. Walking
  // backwards rather than tracking forwards keeps this a pure function of the
  // log, so a resumed run reaches the same verdict as the one it replaced.
  const ahead = now > 0 ? 1 : -1;
  let plies = 0;
  for (let at = fens.length - 2; at >= 0; at--) {
    const then = gapAt(fens[at]);
    if (Math.abs(then) < minGap || Math.sign(then) !== ahead) break;
    plies++;
  }

  const staticFor = Math.floor(plies / 2);
  return {
    call: staticFor >= staticMoves,
    // The gap is white-minus-black, so a positive gap means BLACK is losing.
    loser: staticFor >= staticMoves ? (now > 0 ? 'black' : 'white') : null,
    gap: now,
    staticFor
  };
}

/**
 * The sentence that goes in the log and in the console.
 *
 * Says the rule, not just the outcome. A result nobody can account for is worse
 * than a longer game, and this one is a decision the harness made rather than
 * something either player did.
 */
export function adjudicationReason({ gap, staticFor }) {
  const lead = Math.abs(gap);
  const side = gap > 0 ? 'White' : 'Black';
  return (
    `${side} has been at least ${DECISIVE_GAP} ahead for ${staticFor} moves, and is ${lead} ahead now. ` +
    `Adjudicated by the tournament: a decided game that has stopped progressing is called, ` +
    `so the result is the one the position already had.`
  );
}
