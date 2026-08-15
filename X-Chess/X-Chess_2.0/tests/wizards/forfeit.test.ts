// Conceding on chain, and the failures that must never be mistaken for it.
//
// A resignation is permanent and it ends somebody's game. So the interesting
// tests here are not that a forfeit resigns — it is that a rate limit, a dead
// API, a failed broadcast and a crashed harness DO NOT. Those are the
// tournament's problems, fixed by running it again; a resignation would turn a
// transient outage into a lost game nobody can appeal.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chooseMove } from '../../harness/wizards/chooser.mjs';
import { PERSONALITIES } from '../../harness/wizards/personalities.mjs';
import { replay } from '../../packages/replay/replay.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { EVENT_STRINGS } from '../../packages/replay/events.js';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const read = (path: string): string => readFileSync(resolve(ROOT, path), 'utf8');

const WHITE = 'SP17DPNVMJY3MT3T6D7R27C986B9GCCPMZ92T7VYT';
const BLACK = 'SP26686EDREHNRBNW6WZA491PKFAFT8HSXP269W7S';
const RULES = normaliseRules({ ...DEFAULT_RULES, white: WHITE, black: BLACK, ranked: true });
const GAMBIT = PERSONALITIES[0];

function start() {
  const state = replay([], { rules: RULES });
  return { fen: state.fen, legalMoves: state.legalMoves, turn: state.turn, history: [] };
}

describe('what counts as a forfeit', () => {
  it('marks the one failure that should end the game', async () => {
    // Three illegal answers. Running it again produces the same answer, which
    // is exactly what makes it the character's problem rather than the run's.
    const error = await chooseMove({
      character: GAMBIT,
      position: start(),
      ask: async () => 'Qh5 is winning'
    }).catch((e) => e);

    expect(error.forfeit, 'a real forfeit is not marked as one').toBe(true);
    expect(error.character).toBe(GAMBIT.name);
  });

  it('does not mark a model outage, which running again would fix', async () => {
    // The distinction the whole feature rests on. An API failure propagates
    // untouched — no `forfeit` flag, so the runner rethrows and the position
    // survives for the next attempt.
    const error = await chooseMove({
      character: GAMBIT,
      position: start(),
      ask: async () => {
        throw new Error('the model answered 429: rate limited');
      }
    }).catch((e) => e);

    expect(error.forfeit, 'a rate limit was dressed up as a forfeit').toBeUndefined();
    expect(error.message).toMatch(/429/);
  });

  it('does not mark a position with no moves in it', async () => {
    // Checkmate and stalemate are results replay already derives. Resigning
    // into one would add a second, contradictory ending to a finished game.
    const error = await chooseMove({
      character: GAMBIT,
      position: { fen: '8/8/8/8/8/8/8/8 w - - 0 1', legalMoves: [], turn: 'white', history: [] },
      ask: async () => 'e2e4'
    }).catch((e) => e);

    expect(error.forfeit).toBeUndefined();
    expect(error.message).toMatch(/nothing for/);
  });

  it('is detected by a flag, not by reading the message', async () => {
    // A string match would silently become a resignation the day somebody
    // rewords the error. The runner must key on the flag.
    const source = read('harness/wizards/run-tournament.mjs');
    expect(source, 'the runner string-matches its way into a resignation').not.toMatch(
      /includes\(['"]did not give a legal move/
    );
    expect(source).toContain('error?.forfeit');
  });
});

describe('the resignation itself', () => {
  const source = read('harness/wizards/run-tournament.mjs');

  it('needs no new permission, because it is a submit', () => {
    // Worth asserting rather than assuming: `resgn` rides the function the
    // fleet could already call, on the contract it could already call. If this
    // ever needs a new entry in ALLOWED_FUNCTIONS, the boundary widened and
    // somebody should have to notice.
    expect(source).toMatch(/functionName: 'submit'[\s\S]{0,200}resgn/);
    const core = read('harness/wizards/wizards-core.mjs');
    expect(core).not.toContain("'resgn'");
  });

  it('refuses on a game that never agreed to resignations', () => {
    // There, `resgn` is read as a move, and as a move it is malformed —
    // stored, charged, and skipped. Sending one is the precise waste the
    // board's gate was rebuilt to stop people doing by hand.
    expect(source).toContain("rules.eventsProtocol !== 'events-v1'");
  });

  it('can be turned off without touching the code', () => {
    expect(source).toContain('--no-resign');
  });

  it('says so in the dry run, because it ends a game', () => {
    expect(source).toMatch(/forfeits/);
    expect(source).toMatch(/RESIGNS on chain \(permanent\)/);
  });
});

describe('what the chain makes of it', () => {
  it('ends the game with the other side winning', () => {
    // Derived, not asserted: replay reads the resignation and produces a
    // result the leaderboard can count and any reader can recompute.
    const log = [
      { mv: 'e2e4', sender: WHITE, seq: 0 },
      { mv: 'e7e5', sender: BLACK, seq: 1 },
      { mv: EVENT_STRINGS.RESIGN, sender: BLACK, seq: 2 }
    ];
    const state = replay(log, { rules: RULES });

    expect(state.status).toBe('over');
    expect(state.result, 'black resigned, so white wins').toBe('1-0');
    expect(state.termination).toMatch(/resign/i);
  });

  it('counts a resignation on the resigner’s own turn', () => {
    // A character forfeits when it cannot move, which is by definition its
    // turn. Replay applies no turn check to control events, so this works —
    // but it is the case that matters and it is worth pinning.
    const log = [
      { mv: 'e2e4', sender: WHITE, seq: 0 },
      { mv: EVENT_STRINGS.RESIGN, sender: BLACK, seq: 1 }
    ];
    const state = replay(log, { rules: RULES });
    expect(state.result).toBe('1-0');
  });
});
