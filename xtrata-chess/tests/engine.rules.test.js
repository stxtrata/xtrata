// Named rule cases.
//
// Perft already proves move generation in aggregate, but it proves it as one
// number. These spell out the rules the board has to get right in public, so a
// regression says which rule broke rather than that a count moved.

import { describe, expect, it } from 'vitest';
import { Chess, START_FEN, parseUci } from '../src/engine.js';

function play(moves, fen = START_FEN) {
  const chess = new Chess(fen);
  for (const move of moves) {
    const applied = chess.moveUci(move);
    if (!applied) throw new Error(`${move} was rejected in ${chess.fen()}`);
  }
  return chess;
}

describe('castling', () => {
  const OPEN = '4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1';

  it('offers both sides when the rights and the squares are clear', () => {
    const chess = new Chess(OPEN);
    expect(chess.movesUci()).toContain('e1g1');
    expect(chess.movesUci()).toContain('e1c1');
  });

  it('moves the rook too', () => {
    const kingside = play(['e1g1'], OPEN);
    expect(kingside.fenBoard()).toBe('4k3/8/8/8/8/8/8/R4RK1');

    const queenside = play(['e1c1'], OPEN);
    expect(queenside.fenBoard()).toBe('4k3/8/8/8/8/8/8/2KR3R');
  });

  it('refuses to pass the king through an attacked square', () => {
    // A black rook on f2 covers f1, which the king would cross going kingside.
    const chess = new Chess('4k3/8/8/8/8/8/5r2/R3K2R w KQ - 0 1');
    expect(chess.movesUci()).not.toContain('e1g1');
    expect(chess.movesUci()).toContain('e1c1');
  });

  it('refuses to castle out of check', () => {
    const chess = new Chess('4k3/8/8/8/8/8/4r3/R3K2R w KQ - 0 1');
    expect(chess.movesUci()).not.toContain('e1g1');
    expect(chess.movesUci()).not.toContain('e1c1');
  });

  it('allows queenside when only the b-file square is attacked', () => {
    // b1 must be empty but need not be safe, because the king never stands there.
    const chess = new Chess('4k3/8/8/8/8/8/1r6/R3K2R w KQ - 0 1');
    expect(chess.movesUci()).toContain('e1c1');
  });

  it('refuses when a piece stands in the way', () => {
    const chess = new Chess('4k3/8/8/8/8/8/8/R3KB1R w KQ - 0 1');
    expect(chess.movesUci()).not.toContain('e1g1');
    expect(chess.movesUci()).toContain('e1c1');
  });

  it('loses the right permanently once the king moves', () => {
    const chess = play(['e1f1', 'e8d8', 'f1e1', 'd8e8'], OPEN);
    expect(chess.movesUci()).not.toContain('e1g1');
    expect(chess.movesUci()).not.toContain('e1c1');
  });

  it('loses one side of the right when that rook moves', () => {
    const chess = play(['h1g1', 'e8d8', 'g1h1', 'd8e8'], OPEN);
    expect(chess.movesUci()).not.toContain('e1g1');
    expect(chess.movesUci()).toContain('e1c1');
  });

  it('loses the right when the rook is captured on its home square', () => {
    // Taken by a bishop down the long diagonal, so that Black is left free to
    // move rather than in check.
    const chess = play(['h1a8'], 'r3k2r/8/8/8/8/8/8/4K2B w kq - 0 1');
    expect(chess.movesUci()).not.toContain('e8c8');
    expect(chess.movesUci()).toContain('e8g8');
  });
});

describe('en passant', () => {
  it('is available only on the move straight after the double push', () => {
    const chess = play(['e2e4', 'a7a6', 'e4e5', 'd7d5']);
    expect(chess.movesUci()).toContain('e5d6');

    chess.moveUci('a2a3');
    chess.moveUci('a6a5');
    expect(chess.movesUci()).not.toContain('e5d6');
  });

  it('removes the pawn that ran past', () => {
    const chess = play(['e2e4', 'a7a6', 'e4e5', 'd7d5', 'e5d6']);
    expect(chess.fenBoard()).toBe('rnbqkbnr/1pp1pppp/p2P4/8/8/8/PPPP1PPP/RNBQKBNR');
  });

  it('is illegal when the capture would expose the king along the rank', () => {
    // Black king a4, white pawn d4, black pawn e4, white queen h4. Taking en
    // passant removes both pawns from the fourth rank at once and hangs the king.
    const chess = new Chess('8/8/8/8/k2Pp2Q/8/8/3K4 b - d3 0 1');
    expect(chess.movesUci()).not.toContain('e4d3');
    expect(chess.movesUci()).toContain('e4e3');
  });
});

describe('promotion', () => {
  const FEN = '8/4P3/8/8/8/8/8/k3K3 w - - 0 1';

  it('offers all four pieces and nothing else', () => {
    const chess = new Chess(FEN);
    const promotions = chess.movesUci().filter((uci) => uci.startsWith('e7e8'));
    expect(promotions.sort()).toEqual(['e7e8b', 'e7e8n', 'e7e8q', 'e7e8r']);
  });

  it('requires the piece to be named', () => {
    const chess = new Chess(FEN);
    expect(chess.moveUci('e7e8')).toBe(null);
  });

  it('refuses a promotion letter on a move that is not one', () => {
    const chess = new Chess(START_FEN);
    expect(chess.moveUci('e2e4q')).toBe(null);
  });

  it('places the named piece, including underpromotion', () => {
    expect(play(['e7e8q'], FEN).fenBoard()).toBe('4Q3/8/8/8/8/8/8/k3K3');
    expect(play(['e7e8n'], FEN).fenBoard()).toBe('4N3/8/8/8/8/8/8/k3K3');
  });

  it('writes SAN with the equals sign', () => {
    expect(play(['e7e8q'], FEN).history()).toEqual(['e8=Q']);
  });
});

describe('terminal positions', () => {
  it('sees fool’s mate', () => {
    const chess = play(['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    expect(chess.isCheckmate()).toBe(true);
    expect(chess.outcome()).toEqual({
      result: '0-1',
      reason: 'checkmate',
      winner: 'black'
    });
    expect(chess.history()).toEqual(['f3', 'e5', 'g4', 'Qh4#']);
  });

  it('sees stalemate', () => {
    const chess = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    expect(chess.inCheck()).toBe(false);
    expect(chess.moves()).toHaveLength(0);
    expect(chess.outcome()).toEqual({
      result: '1/2-1/2',
      reason: 'stalemate',
      winner: null
    });
  });

  it('sees the fifty move rule', () => {
    const chess = new Chess('4k3/8/8/8/8/8/8/4K2R w K - 99 100');
    expect(chess.isFiftyMoveDraw()).toBe(false);
    chess.moveUci('h1h2');
    expect(chess.isFiftyMoveDraw()).toBe(true);
    expect(chess.outcome().reason).toBe('fifty-move-rule');
  });

  it('resets the fifty move counter on a pawn move or a capture', () => {
    const chess = new Chess('4k3/7p/8/8/8/8/7P/4K2R w K - 40 60');
    chess.moveUci('h2h4');
    expect(chess.halfmove).toBe(0);
  });

  it('sees threefold repetition', () => {
    const shuffle = ['g1f3', 'g8f6', 'f3g1', 'f6g8'];
    const chess = play([...shuffle, ...shuffle]);
    expect(chess.isThreefoldRepetition()).toBe(true);
    expect(chess.outcome().reason).toBe('threefold-repetition');
  });

  it('does not call two occurrences a repetition', () => {
    const chess = play(['g1f3', 'g8f6', 'f3g1', 'f6g8']);
    expect(chess.isThreefoldRepetition()).toBe(false);
  });

  it('treats positions differing only by an unusable en passant square as equal', () => {
    // The repetition key drops the en passant square when no pawn can take it,
    // which is what makes this the same position rather than a new one.
    const chess = new Chess(START_FEN);
    const key = chess.positionKey();
    chess.moveUci('e2e4');
    expect(chess.positionKey()).not.toBe(key);
    expect(chess.epString()).toBe('-');
  });

  describe('insufficient material', () => {
    const cases = [
      ['king against king', '8/8/4k3/8/8/4K3/8/8 w - - 0 1', true],
      ['king and bishop', '8/8/4k3/8/8/4KB2/8/8 w - - 0 1', true],
      ['king and knight', '8/8/4k3/8/8/4KN2/8/8 w - - 0 1', true],
      // c6 and f3 are both light squares; c6 and c3 are not.
      ['bishops on the same colour', 'k7/8/2b5/8/8/5B2/8/4K3 w - - 0 1', true],
      ['bishops on opposite colours', 'k7/8/2b5/8/8/2B5/8/4K3 w - - 0 1', false],
      ['two knights', '8/8/4k3/8/8/3NKN2/8/8 w - - 0 1', false],
      ['a lone pawn', '8/8/4k3/8/8/4KP2/8/8 w - - 0 1', false],
      ['a rook', '8/8/4k3/8/8/4KR2/8/8 w - - 0 1', false]
    ];

    for (const [name, fen, expected] of cases) {
      it(name, () => {
        expect(new Chess(fen).isInsufficientMaterial()).toBe(expected);
      });
    }
  });
});

describe('standard algebraic notation', () => {
  it('disambiguates by file', () => {
    const chess = new Chess('4k3/8/8/8/8/5N2/8/1N2K3 w - - 0 1');
    chess.moveUci('b1d2');
    expect(chess.history()).toEqual(['Nbd2']);
  });

  it('disambiguates by rank when the file is shared', () => {
    const chess = new Chess('4k3/8/8/1N6/8/8/8/1N2K3 w - - 0 1');
    chess.moveUci('b1c3');
    expect(chess.history()).toEqual(['N1c3']);
  });

  it('writes castling, captures, and check', () => {
    const chess = play(['e2e4', 'd7d5', 'e4d5', 'd8d5', 'g1f3', 'd5e4', 'f1e2', 'e4g4']);
    expect(chess.history()).toEqual(['e4', 'd5', 'exd5', 'Qxd5', 'Nf3', 'Qe4+', 'Be2', 'Qg4']);
  });

  it('writes both castles', () => {
    const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    chess.moveUci('e1g1');
    chess.moveUci('e8c8');
    expect(chess.history()).toEqual(['O-O', 'O-O-O']);
  });
});

describe('UCI parsing', () => {
  it('accepts four and five character moves in any case', () => {
    expect(parseUci('e2e4')).toMatchObject({ promotion: 0 });
    expect(parseUci('E2E4')).toMatchObject({ promotion: 0 });
    expect(parseUci('e7e8Q')).toMatchObject({ promotion: 5 });
  });

  it('rejects everything else', () => {
    for (const bad of ['', 'e2e', 'e2e4e4', 'z9z9', 'e2e4k', 'hello', null, undefined, 42]) {
      expect(parseUci(bad)).toBe(null);
    }
  });
});

describe('FEN', () => {
  it('round-trips the starting position', () => {
    expect(new Chess(START_FEN).fen()).toBe(START_FEN);
  });

  it('tracks move numbers and side to move', () => {
    const chess = play(['e2e4', 'e7e5', 'g1f3']);
    expect(chess.fen()).toBe(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2'
    );
  });
});
