// Replay is the consensus mechanism, so these are the tests that matter most.
//
// The properties being defended: replay is total (never throws on any input),
// deterministic (same log, same position, always), and order-sensitive in
// exactly one way (the sequence counter).

import { describe, expect, it } from 'vitest';
import { replay, toPgn, REJECTED } from '../src/replay.js';
import { Chess, START_FEN } from '../src/engine.js';
import { runSimulation } from '../src/simulation.js';

describe('accepting and skipping', () => {
  it('plays a legal sequence', () => {
    const state = replay(['e2e4', 'e7e5', 'g1f3']);
    expect(state.accepted).toHaveLength(3);
    expect(state.rejected).toHaveLength(0);
    expect(state.accepted.map((entry) => entry.san)).toEqual(['e4', 'e5', 'Nf3']);
  });

  it('skips an illegal move and carries on from the position before it', () => {
    const state = replay(['e2e4', 'e2e4', 'e7e5']);
    expect(state.accepted.map((entry) => entry.san)).toEqual(['e4', 'e5']);
    expect(state.rejected).toHaveLength(1);
    expect(state.rejected[0].reason).toBe(REJECTED.EMPTY_SQUARE);
  });

  it('enforces turn order without being told to', () => {
    // A move for Black at the start is simply not legal for the side to move.
    const state = replay(['e7e5']);
    expect(state.accepted).toHaveLength(0);
    expect(state.rejected[0].reason).toBe(REJECTED.WRONG_TURN);
    expect(state.fen).toBe(START_FEN);
  });

  it('categorises every way a submission can fail', () => {
    const state = replay([
      'e2e4', // fine
      'hello', // malformed
      'a5a6', // nothing on a5
      'e7e5', // Black's move, but it is White's turn again after the skips
      'e1e3' // shaped correctly, not legal
    ]);

    const reasons = state.log.map((entry) => entry.reason);
    expect(reasons).toEqual([
      null,
      REJECTED.MALFORMED,
      REJECTED.EMPTY_SQUARE,
      null,
      REJECTED.ILLEGAL
    ]);
  });

  it('rejects everything once the game is over', () => {
    const foolsMate = ['f2f3', 'e7e5', 'g2g4', 'd8h4'];
    const state = replay([...foolsMate, 'e2e4', 'b1c3']);

    expect(state.isGameOver).toBe(true);
    expect(state.outcome.reason).toBe('checkmate');
    expect(state.rejected).toHaveLength(2);
    expect(state.rejected.every((entry) => entry.reason === REJECTED.GAME_OVER)).toBe(true);
  });
});

describe('totality', () => {
  // The log holds whatever anyone chose to pay to write. Replay has to survive
  // all of it without throwing, because a throw is a board that will not load.
  const NASTY = [
    '',
    ' ',
    'null',
    'undefined',
    '0000',
    'e2e4e2e4',
    '<script>',
    '../../etc',
    'É2É4',
    '♞x♟',
    'a'.repeat(500),
    'e9e9',
    'i2i4',
    '11 22'
  ];

  it('never throws, whatever is in the log', () => {
    expect(() => replay(NASTY)).not.toThrow();
    const state = replay(NASTY);
    expect(state.accepted).toHaveLength(0);
    expect(state.rejected).toHaveLength(NASTY.length);
    expect(state.fen).toBe(START_FEN);
  });

  it('survives entries that are not strings at all', () => {
    const state = replay([null, undefined, 42, {}, [], { mv: null }, { mv: 7 }]);
    expect(state.rejected).toHaveLength(7);
    expect(state.fen).toBe(START_FEN);
  });

  it('accepts a legal move sitting in the middle of the noise', () => {
    const state = replay([...NASTY.slice(0, 5), 'e2e4', ...NASTY.slice(5)]);
    expect(state.accepted).toHaveLength(1);
    expect(state.accepted[0].san).toBe('e4');
  });

  // A deliberate decision, not an accident of parsing. People type these into
  // wallets by hand, and a stray space or capital should not cost someone a fee.
  // The permanent format is UCI; the reader is lenient about how it arrives.
  it('tolerates surrounding whitespace and any case', () => {
    for (const variant of ['e2e4', 'E2E4', ' e2e4', 'e2e4 ', ' e2e4 ', 'e2e4\n']) {
      const state = replay([variant]);
      expect(state.accepted, `${JSON.stringify(variant)} should be accepted`).toHaveLength(1);
      expect(state.accepted[0].san).toBe('e4');
    }
  });

  it('still refuses a move that is only the right length after padding', () => {
    // "e2e" with a space is four characters but not a move.
    expect(replay(['e2e ']).accepted).toHaveLength(0);
    expect(replay([' e2 ']).accepted).toHaveLength(0);
  });
});

describe('determinism', () => {
  it('gives the same result every time for the same log', () => {
    const log = ['e2e4', 'zzzz', 'e7e5', 'g1f3', 'hello', 'b8c6'];
    const first = replay(log);
    const second = replay(log);
    expect(second.fen).toBe(first.fen);
    expect(second.log).toEqual(first.log);
  });

  it('depends on order, so a reordered log is a different game', () => {
    const forwards = replay(['e2e4', 'e7e5']);
    const backwards = replay(['e7e5', 'e2e4']);
    expect(forwards.accepted).toHaveLength(2);
    // Reversed, Black's move is skipped and White's is played.
    expect(backwards.accepted).toHaveLength(1);
    expect(backwards.fen).not.toBe(forwards.fen);
  });

  it('matches playing the moves forward one at a time', () => {
    const log = ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6'];
    const forward = new Chess(START_FEN);
    for (const move of log) forward.moveUci(move);
    expect(replay(log).fen).toBe(forward.fen());
  });

  it('is unaffected by which addresses sent which moves', () => {
    const moves = ['e2e4', 'e7e5', 'g1f3'];
    const bySame = replay(moves.map((mv) => ({ mv, sender: 'SP111' })));
    const byDifferent = replay(
      moves.map((mv, index) => ({ mv, sender: `SP${index}` }))
    );
    expect(byDifferent.fen).toBe(bySame.fen);
  });
});

describe('log shape', () => {
  it('keeps sequence numbers, senders, and heights on every entry', () => {
    const state = replay([
      { mv: 'e2e4', sender: 'SP1', seq: 0, height: 900 },
      { mv: 'junk!', sender: 'SP2', seq: 1, height: 901 }
    ]);

    expect(state.log[0]).toMatchObject({ seq: 0, sender: 'SP1', height: 900, status: 'accepted' });
    expect(state.log[1]).toMatchObject({ seq: 1, sender: 'SP2', height: 901, status: 'rejected' });
  });

  it('numbers plies over accepted moves only', () => {
    const state = replay(['e2e4', 'nope!', 'e7e5']);
    expect(state.accepted.map((entry) => entry.ply)).toEqual([1, 2]);
    expect(state.accepted.map((entry) => entry.color)).toEqual(['white', 'black']);
  });
});

describe('PGN', () => {
  it('writes a header and the moves', () => {
    const state = replay(['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    const pgn = toPgn(state, { Round: '1' });
    expect(pgn).toContain('[Result "0-1"]');
    expect(pgn).toContain('1. f3 e5 2. g4 Qh4#');
  });

  it('marks a game still in progress', () => {
    expect(toPgn(replay(['e2e4']))).toContain('[Result "*"]');
  });
});

describe('against simulated games', () => {
  // Full games, generated rather than hand-written, replayed from scratch and
  // compared with the position they were played into.
  it('agrees with forward play across many seeds', async () => {
    for (let seed = 1; seed <= 12; seed++) {
      const result = await runSimulation({ seed, griefRate: 0.3 });
      expect(result.deterministic).toBe(true);

      const log = await result.chain.getAllMoves(result.game);
      expect(replay(log).fen).toBe(result.fen);
      // Replaying twice changes nothing.
      expect(replay(log).fen).toBe(replay(log).fen);
    }
  });
});
