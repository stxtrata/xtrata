// Perft is the standard correctness measure for a chess move generator: count
// the leaves of the legal move tree to a given depth and compare against known
// values. The six positions below are the canonical set, chosen between them to
// exercise castling through check, en passant edge cases, pins, promotions, and
// discovered check.
//
// If the engine's move generation is wrong in any way that matters, one of
// these numbers will be wrong. Nothing else in this repo is allowed to change
// move generation without these staying green.

import { describe, expect, it } from 'vitest';
import { Chess, perft, START_FEN } from '../src/engine.js';

const POSITIONS = [
  {
    name: 'startpos',
    fen: START_FEN,
    counts: [20, 400, 8902, 197281, 4865609]
  },
  {
    name: 'kiwipete',
    fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
    counts: [48, 2039, 97862, 4085603]
  },
  {
    name: 'position 3 (rook endgame, en passant)',
    fen: '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
    counts: [14, 191, 2812, 43238, 674624]
  },
  {
    name: 'position 4 (promotions, pins)',
    fen: 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',
    counts: [6, 264, 9467, 422333]
  },
  {
    name: 'position 5',
    fen: 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8',
    counts: [44, 1486, 62379, 2103487]
  },
  {
    name: 'position 6',
    fen: 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10',
    counts: [46, 2079, 89890, 3894594]
  }
];

// Depth 4 and 5 on the wider positions take long enough to be annoying in a
// normal run. PERFT_DEEP=1 turns the full set on.
const DEEP = process.env.PERFT_DEEP === '1';

describe('perft', () => {
  for (const position of POSITIONS) {
    describe(position.name, () => {
      for (let depth = 1; depth <= position.counts.length; depth++) {
        const expected = position.counts[depth - 1];
        const heavy = expected > 250_000;
        const runner = heavy && !DEEP ? it.skip : it;
        runner(
          `depth ${depth} has ${expected.toLocaleString()} nodes`,
          () => {
            const chess = new Chess(position.fen);
            expect(perft(chess, depth)).toBe(expected);
          },
          120_000
        );
      }
    });
  }

  it('leaves the position untouched after a full walk', () => {
    const chess = new Chess(START_FEN);
    const before = chess.fen();
    perft(chess, 3);
    expect(chess.fen()).toBe(before);
    expect(chess.stack).toHaveLength(0);
  });
});
