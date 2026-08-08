// Automated play: whole games, start to finish, with a griefer in the mix.
//
// This is the test that would have caught the design being wrong rather than
// the code being wrong. It asserts that an unthrottled board still converges on
// real chess, that junk costs its sender and changes nothing, and that the
// terminal conditions are actually reachable rather than theoretical.

import { describe, expect, it } from 'vitest';
import { runSimulation } from '../src/simulation.js';
import { MockChain } from '../src/mock-chain.js';
import { replay } from '../src/replay.js';
import { MAX_SEQ, ERR } from '../src/protocol.js';

describe('a single game', () => {
  it('reaches a real result', async () => {
    const result = await runSimulation({ seed: 1 });
    expect(result.outcome).not.toBe(null);
    expect(result.deterministic).toBe(true);
    expect(result.accepted).toBeGreaterThan(4);
  });

  it('is reproducible from its seed', async () => {
    const first = await runSimulation({ seed: 99 });
    const second = await runSimulation({ seed: 99 });
    expect(second.fen).toBe(first.fen);
    expect(second.pgn).toBe(first.pgn);
    expect(second.submissions).toBe(first.submissions);
  });

  it('produces a different game from a different seed', async () => {
    const a = await runSimulation({ seed: 1 });
    const b = await runSimulation({ seed: 2 });
    expect(b.pgn).not.toBe(a.pgn);
  });
});

describe('many games', () => {
  // Twenty seeds, played through. Slower than the rest of the suite but this is
  // the only place the whole stack runs end to end.
  const SEEDS = Array.from({ length: 20 }, (_, index) => index + 1);

  it('always finishes, always deterministically, never illegally', async () => {
    const outcomes = [];

    for (const seed of SEEDS) {
      const result = await runSimulation({ seed, griefRate: 0.3 });

      expect(result.deterministic).toBe(true);
      expect(result.hitLimit).toBe(false);
      expect(result.outcome).not.toBe(null);

      // Every accepted move was legal when it was played, by construction:
      // replaying the accepted moves alone must give the same position.
      const cleanLog = result.state.accepted.map((entry) => entry.uci);
      expect(replay(cleanLog).fen).toBe(result.fen);

      outcomes.push(result.outcome.reason);
    }

    // Not a single terminal condition, but several, across the set.
    expect(new Set(outcomes).size).toBeGreaterThan(1);
    expect(outcomes).toContain('checkmate');
  }, 180_000);
});

describe('the griefer', () => {
  it('costs its sender and moves nothing', async () => {
    const quiet = await runSimulation({ seed: 5, griefRate: 0 });
    const loud = await runSimulation({ seed: 5, griefRate: 0.5 });

    // Junk does not stop the game reaching a result.
    expect(loud.outcome).not.toBe(null);
    // And it shows up as paid-for traffic that changed nothing.
    expect(loud.filtered + loud.rejected).toBeGreaterThan(quiet.filtered + quiet.rejected);
    expect(loud.submissions).toBeGreaterThan(loud.accepted);
  });

  it('cannot corrupt the position', async () => {
    const result = await runSimulation({ seed: 11, griefRate: 0.6 });
    const acceptedOnly = result.state.accepted.map((entry) => entry.uci);
    // Strip every rejected entry from the log and the game is unchanged.
    expect(replay(acceptedOnly).fen).toBe(result.fen);
  });

  it('leaves its attempts on the record', async () => {
    const result = await runSimulation({ seed: 3, griefRate: 0.5 });
    expect(result.state.rejected.length).toBeGreaterThan(0);
    for (const entry of result.state.rejected) {
      expect(entry.status).toBe('rejected');
      expect(entry.reason).toBeTruthy();
      expect(typeof entry.seq).toBe('number');
    }
  });
});

describe('bot pairings', () => {
  it('runs random against random without breaking', async () => {
    const result = await runSimulation({
      seed: 7,
      white: 'random',
      black: 'random',
      griefRate: 0.2,
      maxSubmissions: 2000
    });
    expect(result.deterministic).toBe(true);
    expect(result.outcome).not.toBe(null);
  }, 120_000);

  it('runs mixed pairings', async () => {
    const result = await runSimulation({ seed: 4, white: 'greedy', black: 'random' });
    expect(result.deterministic).toBe(true);
  });
});

describe('the mock chain', () => {
  it('numbers games from one', () => {
    const chain = new MockChain();
    expect(chain.openGame().value).toBe(1);
    expect(chain.openGame().value).toBe(2);
    expect(chain.getGameCount()).toBe(2);
  });

  it('rejects writes to a game that does not exist', () => {
    const chain = new MockChain();
    expect(chain.submitMove(1, 'e2e4')).toEqual({ ok: false, error: ERR.NO_GAME });
  });

  it('applies the length filter and nothing else', () => {
    const chain = new MockChain();
    const game = chain.openGame().value;
    expect(chain.submitMove(game, 'e2e').ok).toBe(false);
    expect(chain.submitMove(game, '').ok).toBe(false);
    expect(chain.submitMove(game, 'e2e4qq').ok).toBe(false);
    // Correct length, complete nonsense, stored anyway.
    expect(chain.submitMove(game, 'zzzz').ok).toBe(true);
  });

  it('stops at the log ceiling', () => {
    const chain = new MockChain();
    const game = chain.openGame().value;
    for (let i = 0; i < MAX_SEQ; i++) chain.submitMove(game, 'e2e4');
    expect(chain.submitMove(game, 'e2e4')).toEqual({ ok: false, error: ERR.LOG_FULL });
  });

  it('pages through a long log', async () => {
    const chain = new MockChain();
    const game = chain.openGame().value;
    for (let i = 0; i < 120; i++) chain.submitMove(game, 'e2e4');

    const all = await chain.getAllMoves(game);
    expect(all).toHaveLength(120);
    expect(all.map((entry) => entry.seq)).toEqual(
      Array.from({ length: 120 }, (_, index) => index)
    );
  });
});
