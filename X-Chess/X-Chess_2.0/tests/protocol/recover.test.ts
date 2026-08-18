// The candidate budget, which two files spend and neither owns.
//
// `recoverRules` checks whatever a caller supplies BEFORE running its own
// search, and both come out of the same MAX_CANDIDATES. That was harmless
// while callers passed a handful. It stopped being harmless when the board
// began offering every entrant pair at every cooldown it had seen: twelve
// entrants is 132 ordered pairs, so three cooldowns is 396 and recovery's own
// ~200-candidate search gets 114 of them.
//
// AND THE FAILURE IS SILENT. A truncated search returns unconfirmed, which is
// exactly what a genuinely unrecoverable game returns. Nothing would have said
// the board had eaten the budget; games would simply have stopped verifying.
//
// The comment in recover.ts calls this arithmetic CONSENSUS-VISIBLE, because
// two boards that disagree about the search disagree about whether a game can
// be confirmed at all. So it is asserted here rather than described in two
// places and believed in neither.

import { describe, expect, it } from 'vitest';
import { MAX_CANDIDATES } from '../../packages/protocol/recover.js';
import { MAX_PAIR_CANDIDATES } from '../../packages/ui/app.js';

/** What recover's own search wants, per its comment: 10 sides squared, both ranked flags. */
const RECOVERS_OWN_SEARCH = 200;
/** The manifest's exact candidate, and the known-rules fallback. */
const ALWAYS_OFFERED = 2;

describe('the shared candidate budget', () => {
  it('leaves recovery room for its whole search', () => {
    expect(MAX_PAIR_CANDIDATES + RECOVERS_OWN_SEARCH + ALWAYS_OFFERED)
      .toBeLessThanOrEqual(MAX_CANDIDATES);
  });

  it('is the reason the pair space is bounded rather than merely large', () => {
    // Twelve entrants at three cooldowns, which is what the board would offer
    // unbounded once a third tournament declares a third cooldown.
    const unbounded = 12 * 11 * 3;
    expect(unbounded + RECOVERS_OWN_SEARCH).toBeGreaterThan(MAX_CANDIDATES);
    expect(MAX_PAIR_CANDIDATES).toBeLessThan(unbounded);
  });
});
