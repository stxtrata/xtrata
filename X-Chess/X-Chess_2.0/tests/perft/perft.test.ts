// Perft is the only way to know a move generator is correct rather than nearly
// correct: count the leaves of the legal move tree to a given depth and compare
// against known values.
//
// Three kinds of check live here, and they are complementary:
//
//   1. Canonical fixtures. The six standard positions, chosen between them to
//      exercise castling through check, en passant edge cases, pins,
//      promotions and discovered check. These are the hard gate.
//   2. Fixture-free structural checks. Mirroring a position (flip the ranks and
//      swap the colours) must not change its node count, and the fast
//      pseudo-legal path must agree with the slow fully-legal one. These catch
//      a whole class of bug without depending on anybody's memory of a number.
//   3. Extra published positions, mostly castling-rights edge cases that the
//      canonical six touch only lightly.
//
// Nothing in this repo may change move generation without all of it staying
// green.

import { describe, expect, it } from 'vitest';
import { Position, perft } from '../../packages/chess/engine.js';
import { START_FEN, formatFen, parseFen } from '../../packages/chess/fen.js';
import { legalMoves } from '../../packages/chess/moves.js';
import { toUci } from '../../packages/chess/uci.js';

interface Fixture {
  name: string;
  fen: string;
  counts: number[];
}

// Depth 4 and 5 on the wider positions take long enough to be annoying in a
// normal run. PERFT_DEEP=1 turns the full set on, and the release gate sets it.
const DEEP = process.env.PERFT_DEEP === '1';
const HEAVY_ABOVE = 250_000;

const CANONICAL: Fixture[] = [
  {
    name: 'startpos',
    fen: START_FEN,
    counts: [20, 400, 8902, 197281, 4865609, 119060324]
  },
  {
    name: 'kiwipete',
    fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
    counts: [48, 2039, 97862, 4085603, 193690690]
  },
  {
    name: 'position 3 — rook endgame, en passant',
    fen: '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
    counts: [14, 191, 2812, 43238, 674624, 11030083]
  },
  {
    name: 'position 4 — promotions and pins',
    fen: 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',
    counts: [6, 264, 9467, 422333, 15833292]
  },
  {
    name: 'position 5',
    fen: 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8',
    counts: [44, 1486, 62379, 2103487, 89941194]
  },
  {
    name: 'position 6',
    fen: 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10',
    counts: [46, 2079, 89890, 3894594, 164075551]
  }
];

// Castling-rights edge cases from the published perft suite. The canonical six
// cover castling through check but barely touch a lone king and rook, which is
// where a wrong castle mask shows up first.
const CASTLING: Fixture[] = [
  { name: 'white kingside only', fen: '4k3/8/8/8/8/8/8/4K2R w K - 0 1', counts: [15, 66, 1197, 7059] },
  { name: 'white queenside only', fen: '4k3/8/8/8/8/8/8/R3K3 w Q - 0 1', counts: [16, 71, 1287, 7626] },
  { name: 'black kingside only', fen: '4k2r/8/8/8/8/8/8/4K3 w k - 0 1', counts: [5, 75, 459, 8290] },
  { name: 'black queenside only', fen: 'r3k3/8/8/8/8/8/8/4K3 w q - 0 1', counts: [5, 80, 493, 8897] },
  {
    name: 'all four rights',
    fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    counts: [26, 568, 13744, 314346]
  }
];

/**
 * Mirror a position: flip it top to bottom and swap the colours.
 *
 * The resulting position is a different one, but it has exactly the same shape,
 * so its node count at every depth must match. This catches any asymmetry
 * between White and Black — a wrong pawn direction, a castle mask applied to one
 * colour only, an en passant offset with a sign error — and it needs no
 * published number to compare against.
 */
function mirrorFen(fen: string): string {
  const [board, turn, castling, ep, halfmove, fullmove] = fen.trim().split(/\s+/);

  const ranks = board.split('/').reverse();
  const flipped = ranks
    .map((rank) =>
      [...rank]
        .map((ch) => (/[a-z]/.test(ch) ? ch.toUpperCase() : /[A-Z]/.test(ch) ? ch.toLowerCase() : ch))
        .join('')
    )
    .join('/');

  const swapRights = [...castling]
    .map((ch) => (/[a-z]/.test(ch) ? ch.toUpperCase() : /[A-Z]/.test(ch) ? ch.toLowerCase() : ch))
    .sort((a, b) => 'KQkq'.indexOf(a) - 'KQkq'.indexOf(b))
    .join('');

  const swapEp = ep === '-' ? '-' : `${ep[0]}${9 - Number(ep[1])}`;

  return [
    flipped,
    turn === 'w' ? 'b' : 'w',
    swapRights || '-',
    swapEp,
    halfmove ?? '0',
    fullmove ?? '1'
  ].join(' ');
}

/** Perft down the slow, fully-legal path, as an independent second opinion. */
function perftLegal(position: Position, depth: number): number {
  if (depth === 0) return 1;
  const moves = legalMoves(position.state);
  if (depth === 1) return moves.length;
  let nodes = 0;
  for (const m of moves) {
    const next = new Position(position.fen());
    next.applyUci(toUci(m));
    nodes += perftLegal(next, depth - 1);
  }
  return nodes;
}

function runFixtures(group: string, fixtures: Fixture[]): void {
  describe(group, () => {
    for (const position of fixtures) {
      describe(position.name, () => {
        for (let depth = 1; depth <= position.counts.length; depth++) {
          const expected = position.counts[depth - 1];
          const heavy = expected > HEAVY_ABOVE;
          const runner = heavy && !DEEP ? it.skip : it;
          runner(
            `depth ${depth} has ${expected.toLocaleString()} nodes`,
            () => {
              expect(perft(new Position(position.fen), depth)).toBe(expected);
            },
            600_000
          );
        }
      });
    }
  });
}

runFixtures('canonical positions', CANONICAL);
runFixtures('castling-rights positions', CASTLING);

describe('structural checks', () => {
  it('leaves the position untouched after a full walk', () => {
    const position = new Position(START_FEN);
    const before = position.fen();
    perft(position, 3);
    expect(position.fen()).toBe(before);
  });

  // A mirrored position must count identically. No fixture involved: the two
  // numbers come from the engine and have to agree with each other.
  for (const fixture of [...CANONICAL, ...CASTLING]) {
    it(`${fixture.name} mirrors to the same node count`, () => {
      const mirrored = mirrorFen(fixture.fen);
      expect(parseFen(mirrored), `mirror produced an unparseable FEN: ${mirrored}`).not.toBeNull();
      const depth = 3;
      expect(perft(new Position(mirrored), depth)).toBe(perft(new Position(fixture.fen), depth));
    });
  }

  // The fast path filters pseudo-legal moves by making them; the slow path
  // rebuilds a position per node and goes through applyUci, which is what replay
  // actually uses. If those two ever disagree, replay and perft are refereeing
  // different games.
  for (const fixture of [...CANONICAL, ...CASTLING]) {
    it(`${fixture.name} agrees between the fast and slow paths`, () => {
      const depth = 3;
      expect(perftLegal(new Position(fixture.fen), depth)).toBe(
        perft(new Position(fixture.fen), depth)
      );
    });
  }

  it('round-trips every fixture FEN through parse and format', () => {
    for (const fixture of [...CANONICAL, ...CASTLING]) {
      const parsed = parseFen(fixture.fen);
      expect(parsed, fixture.fen).not.toBeNull();
      // Formatting suppresses an en passant square nobody can capture onto, so
      // the board, turn and castling fields are what must survive intact.
      const out = formatFen(parsed!).split(/\s+/);
      const back = fixture.fen.split(/\s+/);
      expect(out.slice(0, 3).join(' ')).toBe(back.slice(0, 3).join(' '));
    }
  });
});
