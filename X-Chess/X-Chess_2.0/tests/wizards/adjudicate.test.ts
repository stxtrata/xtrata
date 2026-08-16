// When the tournament ends a game the players will not.
//
// The rule exists because of one game. Round 2, game 18: Oblique reached plus
// five at MOVE 25 and was still shuffling at move 113 — 225 submissions, 0.675
// STX of miner fees, roughly 0.53 of it spent after the result stopped being in
// doubt. The board showed a queen against a knight for eighty-eight moves.
//
// It is an ARBITER and not an option offered to a player, and these tests hold
// that line as much as they hold the arithmetic. See adjudicate.mjs for why:
// entries are public, so "never resign" would be a free half point against
// everybody who does, and the tournament would start measuring that instead of
// chess.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DECISIVE_GAP,
  STATIC_MOVES,
  adjudicate,
  adjudicationReason
} from '../../harness/wizards/adjudicate.mjs';
import { HOUSE_RULES, PERSONALITIES } from '../../harness/wizards/personalities.mjs';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));

/** `n` positions all holding the same material, as FENs. */
const held = (fen: string, n: number): string[] => Array.from({ length: n }, () => fen);

// White a rook up: black is missing its queenside rook.
const WHITE_UP = 'rnbqkbn1/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1';
// Black a rook up, the mirror of it.
const BLACK_UP = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR w Kkq - 0 1';
const LEVEL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

describe('calling a game that has stopped being one', () => {
  it('says nothing while the material is level, however long it goes on', () => {
    const verdict = adjudicate(held(LEVEL, 400));
    expect(verdict.call).toBe(false);
    expect(verdict.gap).toBe(0);
  });

  it('restarts the count when the lead is given back', () => {
    // Decisive, then level, then decisive again: the clock runs from the point
    // the lead was RE-established, not from the first time it existed.
    const wobbled = [...held(WHITE_UP, 100), ...held(LEVEL, 1), ...held(WHITE_UP, 10)];
    expect(adjudicate(wobbled).call).toBe(false);
    // Ten positions since the lead came back, and the walk starts one behind
    // the current one: nine plies, four whole moves.
    expect(adjudicate(wobbled).staticFor).toBe(4);
  });

  it('counts a lead that WOBBLES but stays decisive, which is what real endgames do', () => {
    // The first version of this rule asked for one unchanged number, and in an
    // endgame the number never is: pawns get pushed, promoted and taken. Against
    // the two real games that motivated the rule, that version never fired once.
    const ROOK_AND_PAWN = '1nbqkbn1/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1';
    const wobbling: string[] = [];
    for (let n = 0; n < 40; n++) wobbling.push(n % 3 === 0 ? ROOK_AND_PAWN : WHITE_UP, WHITE_UP);
    const verdict = adjudicate(wobbling);
    expect(verdict.call, 'a lead that held for forty moves was not called').toBe(true);
    expect(verdict.loser).toBe('black');
  });

  it('does not count a lead that changed hands', () => {
    // Same size of gap, other player. Continuity of WHO is winning is the point.
    const flipped = [...held(BLACK_UP, 100), ...held(WHITE_UP, 10)];
    expect(adjudicate(flipped).call).toBe(false);
  });

  it('calls it once a decisive lead has stood still long enough', () => {
    const verdict = adjudicate(held(WHITE_UP, STATIC_MOVES * 2 + 1));
    expect(verdict.call).toBe(true);
    expect(verdict.loser).toBe('black');
    expect(verdict.staticFor).toBeGreaterThanOrEqual(STATIC_MOVES);
  });

  it('names the right loser when it is the other way round', () => {
    const verdict = adjudicate(held(BLACK_UP, STATIC_MOVES * 2 + 1));
    expect(verdict.call).toBe(true);
    expect(verdict.loser).toBe('white');
  });

  it('waits the full thirty moves and not one fewer', () => {
    // Counted in moves, not plies, because that is how every other drawing rule
    // in chess reads. Off by a factor of two here would end games at fifteen.
    // The fixtures are all one side decisively ahead throughout.
    const justShort = adjudicate(held(WHITE_UP, STATIC_MOVES * 2 - 2));
    expect(justShort.call, `called after ${justShort.staticFor} moves`).toBe(false);
    expect(adjudicate(held(WHITE_UP, STATIC_MOVES * 2 + 2)).call).toBe(true);
  });

  it('does not call a lead below the threshold, however static', () => {
    // Black missing one bishop: white is up three. Below five the side that is
    // ahead can still lose, and taking that result off them would be the
    // arbiter overreaching on a game still worth watching.
    const aBishopUp = 'rnbqk1nr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const verdict = adjudicate(held(aBishopUp, 400));
    expect(verdict.gap, 'the fixture is not the lead this test means').toBe(3);
    expect(verdict.gap).toBeLessThan(DECISIVE_GAP);
    expect(verdict.call, 'a three point lead was adjudicated').toBe(false);
  });

  it('is a pure function of the log, so a resumed run agrees with the one it replaced', () => {
    const fens = held(WHITE_UP, STATIC_MOVES * 2 + 5);
    expect(adjudicate(fens)).toEqual(adjudicate([...fens]));
  });

  it('handles an empty or missing log without deciding anything', () => {
    expect(adjudicate([]).call).toBe(false);
    expect(adjudicate(null as never).call).toBe(false);
  });

  it('explains itself, because nobody played this result', () => {
    const why = adjudicationReason({ gap: 9, staticFor: 40 });
    expect(why).toContain('White');
    expect(why).toContain('40 moves');
    expect(why, 'a result nobody can account for is worse than a long game').toContain(
      'Adjudicated by the tournament'
    );
  });
});

describe('the arbiter is not a player', () => {
  it('is never offered to a character', () => {
    // Models resign unreliably in both directions, and entries are inscribed
    // and public — so "never resign" would be a free half point against every
    // opponent that does, and the field would converge on it within a round.
    expect(HOUSE_RULES.toLowerCase()).not.toContain('resign');
    for (const character of PERSONALITIES) {
      expect(character.prompt.toLowerCase(), `${character.name} was told about resigning`).not.toContain(
        'resign'
      );
    }
  });

  it('is NOT wired into the runner, and the reason is written down', () => {
    // The sustained-lead rule below was replayed against the games that
    // motivated it and got game 18 backwards: it would have called 1-0 to White
    // at move 55, and White was losing by move 68, having been +21 at move 40.
    // Judging a lead that HELD assumes players who do not throw away +21. This
    // field does.
    //
    // The module stays, because the arithmetic and the arbiter-not-a-player
    // boundary are both worth keeping. What it must not do is decide a real
    // tournament game until the rule is one the evidence supports.
    const runner = readFileSync(resolve(ROOT, 'harness/wizards/run-tournament.mjs'), 'utf8');
    expect(runner, 'an unsafe rule was connected to a live game').not.toMatch(
      /if \(verdict\.call\)/
    );
    expect(runner, 'the reason it is disconnected must survive the next edit').toContain(
      'ADJUDICATION IS NOT WIRED IN'
    );
  });
});
