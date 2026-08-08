// Simulated identities, and the playback a finished game offers instead of
// further moves.
//
// The property that matters for playback: every position it shows is a position
// the board genuinely passed through, because each frame is the same replay
// applied to a prefix of the same log. Nothing is recorded and nothing is
// interpolated.

import { describe, expect, it } from 'vitest';
import { validateStacksAddress } from '@stacks/transactions';
import { SimIdentities } from '../src/sim-identities.js';
import { runSimulation } from '../src/simulation.js';
import { replay } from '../src/replay.js';
import { displaySender } from '../src/board-ui.js';
import { looksLikePrincipal } from '../src/bns.js';

describe('simulated identities', () => {
  const identities = new SimIdentities(1);
  const everyone = [identities.you, identities.white, identities.black, ...identities.griefers];

  it('are real, valid Stacks principals', () => {
    for (const address of everyone) {
      expect(validateStacksAddress(address), address).toBe(true);
      expect(looksLikePrincipal(address), address).toBe(true);
      expect(address.startsWith('SP')).toBe(true);
    }
  });

  it('are all distinct', () => {
    expect(new Set(everyone).size).toBe(everyone.length);
  });

  it('are deterministic per seed, and different across seeds', () => {
    expect(new SimIdentities(1).white).toBe(identities.white);
    expect(new SimIdentities(2).white).not.toBe(identities.white);
  });

  // The point of using real identities in simulation is that both display
  // states get exercised, so a name column can actually be checked there.
  it('include both named and unnamed senders', () => {
    const named = everyone.filter((address) => identities.get(address));
    expect(named.length).toBeGreaterThan(0);
    expect(named.length).toBeLessThan(everyone.length);
  });

  it('render as names where they have one and shortened principals otherwise', () => {
    const withName = everyone.find((address) => identities.get(address));
    const without = everyone.find((address) => !identities.get(address));

    expect(displaySender(withName, identities)).toMatchObject({ named: true });
    expect(displaySender(withName, identities).label).toMatch(/\.btc$/);

    const plain = displaySender(without, identities);
    expect(plain.named).toBe(false);
    expect(plain.label).toContain('…');
    expect(plain.title).toBe(without);
  });

  it('gives a stable griefer for a given roll', () => {
    expect(identities.griefer(0.5)).toBe(identities.griefer(0.5));
    expect(identities.griefers).toContain(identities.griefer(0.99));
    expect(identities.griefers).toContain(identities.griefer(0));
  });

  it('reaches the board through a simulated game', async () => {
    const result = await runSimulation({ seed: 3, griefRate: 0.4 });
    const senders = new Set(result.state.log.map((entry) => entry.sender));

    expect(senders.size).toBeGreaterThan(1);
    for (const sender of senders) {
      expect(validateStacksAddress(sender), sender).toBe(true);
    }
  });
});

describe('playback over the log', () => {
  // The board derives each frame with replay(log.slice(0, n)). These assert the
  // properties the UI relies on, without needing a DOM.
  const frame = (moves, n) => replay(moves.slice(0, n));

  it('shows only positions the game actually passed through', async () => {
    const result = await runSimulation({ seed: 8, griefRate: 0.35 });
    const moves = await result.chain.getAllMoves(result.game);

    // Walk every frame and check it against playing the accepted moves forward.
    const reached = new Set();
    for (let n = 0; n <= moves.length; n++) reached.add(frame(moves, n).fen);

    const forward = replay([]);
    let running = [];
    expect(reached.has(forward.fen)).toBe(true);
    for (const entry of result.state.accepted) {
      running = [...running, entry.uci];
      expect(reached.has(replay(running).fen)).toBe(true);
    }
  });

  it('starts at the opening position and ends at the final one', async () => {
    const result = await runSimulation({ seed: 2 });
    const moves = await result.chain.getAllMoves(result.game);

    expect(frame(moves, 0).fen).toBe(replay([]).fen);
    expect(frame(moves, moves.length).fen).toBe(result.fen);
  });

  it('never advances the board on a skipped submission', async () => {
    const result = await runSimulation({ seed: 6, griefRate: 0.5 });
    const moves = await result.chain.getAllMoves(result.game);

    for (let n = 1; n <= moves.length; n++) {
      const before = frame(moves, n - 1);
      const after = frame(moves, n);
      const entry = result.state.log[n - 1];

      if (entry.status === 'rejected') {
        expect(after.fen, `submission ${n} was skipped`).toBe(before.fen);
      } else {
        expect(after.fen).not.toBe(before.fen);
        expect(after.accepted.length).toBe(before.accepted.length + 1);
      }
    }
  });

  it('is stable, so scrubbing back and forth shows the same thing', async () => {
    const result = await runSimulation({ seed: 4 });
    const moves = await result.chain.getAllMoves(result.game);

    for (const n of [0, 3, 11, 4, 11, 0, 3]) {
      expect(frame(moves, n).fen).toBe(frame(moves, n).fen);
    }
    expect(frame(moves, 5).fen).toBe(frame(moves, 5).fen);
  });

  it('leaves a finished game finished at every frame past the end', async () => {
    const result = await runSimulation({ seed: 1 });
    const moves = await result.chain.getAllMoves(result.game);

    const final = frame(moves, moves.length);
    expect(final.isGameOver).toBe(true);
    // Anything appended after the fact is refused rather than played.
    const extended = replay([...moves, { mv: 'e2e4', sender: 'SP' }]);
    expect(extended.fen).toBe(final.fen);
    expect(extended.rejected.length).toBe(final.rejected.length + 1);
  });
});
