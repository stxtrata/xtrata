// Every wizard game plan, replayed by the board's own engine.
//
// A plan is a list of moves somebody typed from a book or from memory, and a
// mistranscribed one is not a broken test - it is a broken test that costs an
// open fee and a dozen miner fees to discover, on mainnet, having told you the
// fleet works. So the claims in `games.mjs` are asserted here rather than
// believed: the terminal status, the result, and how many submissions replay
// accepted and threw away.
//
// The engine is the one the board runs. If these two ever disagreed the plans
// would be right about a chess game nobody plays.

import { describe, expect, it } from 'vitest';
import { GAME_PLANS, DEFAULT_PLAN, PLAN_NAMES, planNamed } from '../../harness/wizards/games.mjs';
import { replay } from '../../packages/replay/replay.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';

const WHITE = 'SP17DPNVMJY3MT3T6D7R27C986B9GCCPMZ92T7VYT';
const BLACK = 'SP26686EDREHNRBNW6WZA491PKFAFT8HSXP269W7S';

const RULES = normaliseRules({ ...DEFAULT_RULES, white: WHITE, black: BLACK, ranked: true });

/** As the chain would store it: sender and value, in order. */
function submissions(moves: { by: string; move: string }[]) {
  return moves.map((row, seq) => ({
    seq,
    mv: row.move,
    sender: row.by === 'wizard-1' ? WHITE : BLACK,
    height: 100 + seq
  }));
}

describe('the games the wizards know', () => {
  it('has more than the one it started with', () => {
    // The whole point of the file. Fool's mate contains no capture, no castle,
    // no en passant, no promotion, no control event and no rejected submission,
    // so a fleet that only played it could run green through all of them.
    expect(PLAN_NAMES.length).toBeGreaterThan(5);
    expect(PLAN_NAMES).toContain(DEFAULT_PLAN);
  });

  for (const name of Object.keys(GAME_PLANS)) {
    const plan = GAME_PLANS[name as keyof typeof GAME_PLANS];

    it(`${name}: replays to what it claims`, () => {
      const state = replay(submissions(plan.moves), { rules: RULES });

      // Reported together, because a plan that is wrong is usually wrong in a
      // way that shows up first as an unexpected rejection - and a bare status
      // mismatch sends you looking at the wrong end of the move list.
      const rejected = state.rejected.map((row) => `${row.raw} (${row.reason})`);
      expect(rejected, `${name} has submissions replay threw away`).toHaveLength(
        plan.expect.rejected
      );
      expect(state.accepted, `${name} accepted count`).toHaveLength(plan.expect.accepted);
      expect(state.status, `${name} status`).toBe(plan.expect.status);
      expect(state.result ?? null, `${name} result`).toBe(plan.expect.result);
    });
  }

  it('refuses a name it does not have, rather than playing something else', () => {
    // A run that silently fell back to the default would spend real money
    // proving something nobody asked about.
    expect(() => planNamed('kasparov-topalov')).toThrow(/no game plan called/);
    expect(planNamed(undefined).name).toBe(DEFAULT_PLAN);
  });

  it('says what each plan is the only one to exercise', () => {
    for (const [name, plan] of Object.entries(GAME_PLANS)) {
      expect(plan.proves, `${name} does not say what it is for`).toBeTruthy();
    }
  });
});
