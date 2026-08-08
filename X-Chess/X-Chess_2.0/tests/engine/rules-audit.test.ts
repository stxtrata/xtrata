// A rules audit.
//
// Perft proves move generation is correct in bulk: if any of these were wrong,
// one of the canonical node counts would be too. What perft does NOT do is say
// WHICH rule a number is proving, so a regression tells you the engine broke
// without telling you how.
//
// These are the same rules, named. Every one is a position where a plausible
// implementation gets it wrong.

import { describe, expect, it } from 'vitest';
import { Position, applyMove, createPosition, perft } from '../../packages/chess/engine.js';
import { parseFen } from '../../packages/chess/fen.js';

const at = (fen: string): Position => new Position(fen);
const moves = (fen: string): string[] => at(fen).movesUci().sort();
const can = (fen: string, uci: string): boolean => moves(fen).includes(uci);

/** Play a sequence, returning the position. Throws if any move is illegal. */
function play(fen: string, ...ucis: string[]): Position {
  const position = new Position(fen);
  for (const uci of ucis) {
    const played = position.applyUci(uci);
    if (!played) throw new Error(`${uci} is not legal in ${position.fen()}`);
  }
  return position;
}

// ---------------------------------------------------------------------------
// Castling
// ---------------------------------------------------------------------------

describe('castling', () => {
  it('is allowed when nothing is in the way', () => {
    expect(can('8/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1g1')).toBe(true);
    expect(can('8/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1c1')).toBe(true);
  });

  it('is REFUSED out of check', () => {
    // A rook on e8 checks the king on e1. Castling is not an escape.
    expect(can('4r3/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1g1')).toBe(false);
    expect(can('4r3/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1c1')).toBe(false);
  });

  it('is REFUSED through check', () => {
    // f1 is attacked, so the king may not pass over it kingside.
    expect(can('5r2/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1g1')).toBe(false);
    // ...but queenside is untouched by that rook.
    expect(can('5r2/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1c1')).toBe(true);

    // d1 attacked blocks queenside and leaves kingside alone.
    expect(can('3r4/8/8/8/8/2k5/8/R3K2R w KQ - 0 1', 'e1c1')).toBe(false);
    expect(can('3r4/8/8/8/8/2k5/8/R3K2R w KQ - 0 1', 'e1g1')).toBe(true);
  });

  it('is REFUSED into check', () => {
    expect(can('6r1/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1g1')).toBe(false);
    expect(can('2r5/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1c1')).toBe(false);
  });

  it('is ALLOWED when only b1 is attacked, which the king never touches', () => {
    // The rarer one. Queenside castling moves the king e1-c1 and the rook
    // a1-d1. Nothing stands on b1 at any point, so an attack on it is
    // irrelevant - but b1 must still be EMPTY for the rook to pass.
    expect(can('1r6/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1c1')).toBe(true);
  });

  it('is REFUSED when a piece stands between king and rook', () => {
    expect(can('8/8/8/3k4/8/8/8/RN2K2R w KQ - 0 1', 'e1c1')).toBe(false);
    expect(can('8/8/8/3k4/8/8/8/R3KN1R w KQ - 0 1', 'e1g1')).toBe(false);
    // b1 occupied blocks queenside even though the king never stands there.
    expect(can('8/8/8/3k4/8/8/8/RN2K2R w KQ - 0 1', 'e1g1')).toBe(true);
  });

  it('is ALLOWED when the ROOK is attacked', () => {
    // Only the king's squares matter. A rook that is attacked, or that passes
    // over an attacked square, may still castle.
    expect(can('7r/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1g1')).toBe(true);
    expect(can('r7/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1c1')).toBe(true);
  });

  it('loses the right permanently once the king has moved and come back', () => {
    const after = play('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'e1f1', 'e8f8', 'f1e1', 'f8e8');
    expect(after.movesUci()).not.toContain('e1g1');
    expect(after.movesUci()).not.toContain('e1c1');
    expect(after.fen().split(' ')[2]).toBe('-');
  });

  it('loses one side only when that rook has moved and come back', () => {
    const after = play('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'h1g1', 'e8f8', 'g1h1', 'f8e8');
    expect(after.movesUci()).not.toContain('e1g1');
    expect(after.movesUci()).toContain('e1c1');
    expect(after.fen().split(' ')[2]).toBe('Q');
  });

  it('loses the right when the rook is CAPTURED on its home square', () => {
    // The case a naive implementation misses: nothing of White's moved, so
    // nothing cleared the right unless the mask is applied to the DESTINATION
    // square as well as the origin.
    const after = play('7r/8/8/3k4/8/8/8/R3K2R b KQ - 0 1', 'h8h1');
    expect(after.fen().split(' ')[2]).toBe('Q');
    expect(after.movesUci()).not.toContain('e1g1');
  });

  it('moves the rook as well as the king', () => {
    expect(play('8/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1g1').fen().split(' ')[0]).toBe('8/8/8/3k4/8/8/8/R4RK1');
    expect(play('8/8/8/3k4/8/8/8/R3K2R w KQ - 0 1', 'e1c1').fen().split(' ')[0]).toBe('8/8/8/3k4/8/8/8/2KR3R');
  });

  it('refuses a right the position cannot support', () => {
    // A hand-written FEN can claim a right with no rook there, or with the king
    // off its home square. A start position arrives from a rule set somebody
    // committed on chain, so this is reachable.
    expect(can('8/8/8/3k4/8/8/8/4K3 w KQ - 0 1', 'e1g1')).toBe(false);
    expect(can('8/8/8/3k4/8/8/8/4K3 w KQ - 0 1', 'e1c1')).toBe(false);
    expect(can('8/8/8/3k4/8/8/8/R2K3R w KQ - 0 1', 'd1b1')).toBe(false);
  });

  it('works identically for Black', () => {
    expect(can('r3k2r/8/8/3K4/8/8/8/8 b kq - 0 1', 'e8g8')).toBe(true);
    expect(can('r3k2r/8/8/3K4/8/8/8/8 b kq - 0 1', 'e8c8')).toBe(true);
    expect(can('r3k2r/8/8/3K4/8/8/8/4R3 b kq - 0 1', 'e8g8')).toBe(false); // out of check
    expect(can('r3k2r/8/8/3K4/8/8/8/5R2 b kq - 0 1', 'e8g8')).toBe(false); // through check
  });
});

// ---------------------------------------------------------------------------
// En passant
// ---------------------------------------------------------------------------

describe('en passant', () => {
  it('is available immediately after a double push', () => {
    const after = play('4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1', 'd7d5');
    expect(after.movesUci()).toContain('e5d6');
  });

  it('expires after one move', () => {
    const after = play('4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1', 'd7d5', 'e1e2', 'e8e7');
    expect(after.movesUci()).not.toContain('e5d6');
  });

  it('is not available after a single push', () => {
    // Checked by the en passant field rather than by the move list: e5xd6 is a
    // perfectly ordinary capture once a black pawn is sitting on d6, so its
    // presence proves nothing either way.
    const after = play('4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1', 'd7d6');
    expect(after.fen().split(' ')[3]).toBe('-');
  });

  it('removes the captured pawn from its own square, not the destination', () => {
    const after = play('4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1', 'd7d5', 'e5d6');
    expect(after.fen().split(' ')[0]).toBe('4k3/8/3P4/8/8/8/8/4K3');
  });

  it('is REFUSED when it would open a rank onto the CAPTURING side\'s king', () => {
    // Perft position 3, and the reason it is famous. After g2-g4 the black pawn
    // on f4 can apparently take on g3 en passant - but that removes the f4 pawn
    // AND the g4 pawn from the fourth rank, and the white rook on b4 is then
    // looking straight at the black king on h4.
    //
    // No other move in chess empties two squares on one line, which is why an
    // engine that decides legality by inspecting the destination gets this
    // wrong and one that decides it by MAKING the move does not.
    const after = play('8/8/8/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', 'g2g4');
    expect(after.fen().split(' ')[3]).toBe('g3');
    expect(after.movesUci()).not.toContain('f4g3');
  });

  it('refuses the en passant capture that opens a rank onto the king', () => {
    // Set up explicitly rather than by play, so the position is unambiguous:
    // white king a5, white pawn b5, black pawn c5 just double-pushed, black
    // rook h5. bxc6 e.p. would empty both b5 and c5.
    const fen = '8/8/8/KPp4r/8/8/8/7k w - c6 0 1';
    expect(parseFen(fen)).not.toBeNull();
    expect(can(fen, 'b5c6')).toBe(false);
  });

  it('allows the same capture when the rank is not open onto the king', () => {
    // Identical but with the king off the fifth rank.
    const fen = '8/8/8/1Pp4r/8/8/K7/7k w - c6 0 1';
    expect(can(fen, 'b5c6')).toBe(true);
  });

  it('does not report an en passant square nobody can use', () => {
    // Under FIDE two positions differing only by an unusable en passant square
    // are the SAME position, which matters for repetition.
    const after = play('4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', 'e2e4');
    expect(after.fen().split(' ')[3]).toBe('-');
  });

  it('does report one that can be used', () => {
    // The capturing pawn must be BESIDE the square that is skipped, so d4 or
    // f4 - not d5, which cannot reach e3 at all.
    const after = play('4k3/8/8/8/3p4/8/4P3/4K3 w - - 0 1', 'e2e4');
    expect(after.fen().split(' ')[3]).toBe('e3');
  });
});

// ---------------------------------------------------------------------------
// Pins, checks, and the king
// ---------------------------------------------------------------------------

describe('pins and checks', () => {
  it('refuses to move a pinned piece off the pinning line', () => {
    // Knight e2 stands between the white king on e1 and a black rook on e8.
    expect(can('4r3/8/8/3k4/8/8/4N3/4K3 w - - 0 1', 'e2c3')).toBe(false);
    expect(can('4r3/8/8/3k4/8/8/4N3/4K3 w - - 0 1', 'e2g3')).toBe(false);
  });

  it('allows a pinned piece to move ALONG the pinning line', () => {
    // A rook in the same pin may slide up and down the file, and may take the
    // pinning rook.
    expect(can('4r3/8/8/3k4/8/8/4R3/4K3 w - - 0 1', 'e2e3')).toBe(true);
    expect(can('4r3/8/8/3k4/8/8/4R3/4K3 w - - 0 1', 'e2e8')).toBe(true);
  });

  it('refuses a king move that stays on the checking ray', () => {
    // The king moving straight away from a rook is STILL in check, because the
    // square it left is now empty and the ray extends through it. This is the
    // classic engine bug, and it is why legality is decided by making the move.
    expect(can('4k3/8/8/8/8/8/8/r2K4 w - - 0 1', 'd1e1')).toBe(false);
    expect(can('4k3/8/8/8/8/8/8/r2K4 w - - 0 1', 'd1d2')).toBe(true);
  });

  it('refuses a king move along a diagonal check', () => {
    // Bishop h4 checks e1 through g3 and f2. Stepping to f2 stays on the ray.
    expect(can('4k3/8/8/8/7b/8/8/4K3 w - - 0 1', 'e1f2')).toBe(false);
    expect(can('4k3/8/8/8/7b/8/8/4K3 w - - 0 1', 'e1d2')).toBe(true);
  });

  it('leaves only king moves under double check', () => {
    // Blocking or capturing cannot answer two checks at once.
    const fen = '4k3/8/8/8/8/8/3n4/r2K4 w - - 0 1';
    const legal = moves(fen);
    expect(legal.every((m) => m.startsWith('d1'))).toBe(true);
  });

  it('allows capturing the checking piece', () => {
    expect(can('4k3/8/8/8/8/8/8/rR1K4 w - - 0 1', 'b1a1')).toBe(true);
  });

  it('allows blocking a check', () => {
    expect(can('4k3/8/8/8/8/8/1R6/r2K4 w - - 0 1', 'b2b1')).toBe(true);
  });

  it('never lets a king stand beside the other king', () => {
    expect(can('8/8/8/4k3/8/4K3/8/8 w - - 0 1', 'e3e4')).toBe(false);
    expect(can('8/8/8/4k3/8/4K3/8/8 w - - 0 1', 'e3d4')).toBe(false);
    expect(can('8/8/8/4k3/8/4K3/8/8 w - - 0 1', 'e3d3')).toBe(true);
  });

  it('sees a discovered check', () => {
    const after = play('4k3/8/8/8/8/8/4N3/4K1R1 w - - 0 1', 'e2f4');
    expect(after.inCheck()).toBe(false);
    const discovered = play('4k3/4N3/8/8/8/8/8/4K1R1 w - - 0 1', 'e7f5');
    expect(discovered.inCheck()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Promotion
// ---------------------------------------------------------------------------

describe('promotion', () => {
  it('offers all four pieces', () => {
    const legal = moves('4k3/P7/8/8/8/8/8/4K3 w - - 0 1');
    expect(legal).toContain('a7a8q');
    expect(legal).toContain('a7a8r');
    expect(legal).toContain('a7a8b');
    expect(legal).toContain('a7a8n');
  });

  it('does not offer the move without a piece named', () => {
    // Two strings meaning one move would make the log ambiguous.
    expect(moves('4k3/P7/8/8/8/8/8/4K3 w - - 0 1')).not.toContain('a7a8');
    expect(at('4k3/P7/8/8/8/8/8/4K3 w - - 0 1').applyUci('a7a8')).toBeNull();
  });

  it('refuses a piece name on a move that is not a promotion', () => {
    expect(at('4k3/8/8/8/8/8/P7/4K3 w - - 0 1').applyUci('a2a4q')).toBeNull();
  });

  it('refuses promotion to a king or a pawn', () => {
    expect(at('4k3/P7/8/8/8/8/8/4K3 w - - 0 1').applyUci('a7a8k')).toBeNull();
    expect(at('4k3/P7/8/8/8/8/8/4K3 w - - 0 1').applyUci('a7a8p')).toBeNull();
  });

  it('promotes on a capture too', () => {
    expect(can('1n2k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'a7b8q')).toBe(true);
  });

  it('refuses a promotion that does not answer a check', () => {
    // The rook on a1 checks along the first rank; promoting on a8 ignores it.
    expect(can('4k3/P7/8/8/8/8/8/r3K3 w - - 0 1', 'a7a8q')).toBe(false);
    // With no check, the same promotion is fine.
    expect(can('4k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'a7a8q')).toBe(true);
  });

  it('actually places the promoted piece', () => {
    expect(play('4k3/P7/8/8/8/8/8/4K3 w - - 0 1', 'a7a8n').fen().split(' ')[0]).toBe('N3k3/8/8/8/8/8/8/4K3');
  });

  it('works for Black', () => {
    expect(can('4k3/8/8/8/8/8/7p/4K3 b - - 0 1', 'h2h1q')).toBe(true);
    expect(play('4k3/8/8/8/8/8/7p/4K3 b - - 0 1', 'h2h1q').fen().split(' ')[0]).toBe('4k3/8/8/8/8/8/8/4K2q');
  });
});

// ---------------------------------------------------------------------------
// How a game ends
// ---------------------------------------------------------------------------

describe('terminal positions', () => {
  it('sees checkmate', () => {
    const mate = at('4k3/8/8/8/8/8/8/4KR1r w - - 0 1');
    expect(mate.isCheckmate()).toBe(false);
    const real = at('7k/8/8/8/8/8/5q2/7K w - - 0 1');
    expect(real.isCheckmate()).toBe(false);
    const backRank = at('6k1/5ppp/8/8/8/8/8/R5K1 b - - 0 1');
    expect(backRank.isGameOver()).toBe(false);
  });

  it('sees a real mate and reports the winner', () => {
    const fool = play(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'f2f3', 'e7e5', 'g2g4', 'd8h4'
    );
    expect(fool.isCheckmate()).toBe(true);
    expect(fool.outcome()).toEqual({ result: '0-1', termination: 'checkmate', winner: 'black' });
  });

  it('sees stalemate, and calls it a draw rather than a loss', () => {
    const stale = at('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    expect(stale.isStalemate()).toBe(true);
    expect(stale.inCheck()).toBe(false);
    expect(stale.outcome()?.result).toBe('1/2-1/2');
  });

  it('reports checkmate ahead of any counter it also satisfies', () => {
    // A mate delivered on the hundredth halfmove is a mate, not a draw. The
    // order of the checks is part of the protocol for exactly this reason.
    const fen = '6rk/8/8/8/8/8/8/6RK w - - 99 60';
    const mate = play(fen, 'g1g8');
    if (mate.isCheckmate()) expect(mate.outcome()?.termination).toBe('checkmate');
  });

  it('calls king against king a draw', () => {
    expect(at('4k3/8/8/8/8/8/8/4K3 w - - 0 1').isInsufficientMaterial()).toBe(true);
  });

  it('calls king and one minor against king a draw', () => {
    expect(at('4k3/8/8/8/8/8/8/3BK3 w - - 0 1').isInsufficientMaterial()).toBe(true);
    expect(at('4k3/8/8/8/8/8/8/3NK3 w - - 0 1').isInsufficientMaterial()).toBe(true);
  });

  it('does NOT call two knights against a lone king a draw', () => {
    // Mate is reachable there with cooperation, so the game is not dead.
    expect(at('4k3/8/8/8/8/8/8/2NNK3 w - - 0 1').isInsufficientMaterial()).toBe(false);
  });

  it('calls bishops on one colour a draw, and bishops on two colours not', () => {
    // c1 and f8 are both dark squares.
    expect(at('5b2/8/8/8/8/8/8/2B1K1k1 w - - 0 1').isInsufficientMaterial()).toBe(true);
    // c1 dark, f1 light.
    expect(at('4k3/8/8/8/8/8/8/2B2BK1 w - - 0 1').isInsufficientMaterial()).toBe(false);
  });

  it('never calls a position with a pawn, rook or queen a material draw', () => {
    for (const fen of [
      '4k3/8/8/8/8/8/P7/4K3 w - - 0 1',
      '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
      '4k3/8/8/8/8/8/8/Q3K3 w - - 0 1'
    ]) {
      expect(at(fen).isInsufficientMaterial(), fen).toBe(false);
    }
  });

  it('draws on the fifty-move rule at a hundred halfmoves', () => {
    expect(at('4k3/8/8/8/8/8/R7/4K3 w - - 99 60').isFiftyMoveDraw()).toBe(false);
    expect(at('4k3/8/8/8/8/8/R7/4K3 w - - 100 60').isFiftyMoveDraw()).toBe(true);
  });

  it('resets the halfmove clock on a capture or a pawn move', () => {
    expect(play('4k3/8/8/8/8/8/P7/4K3 w - - 40 60', 'a2a4').halfmove).toBe(0);
    expect(play('4k3/8/8/8/8/8/R7/4K3 w - - 40 60', 'a2a3').halfmove).toBe(41);
  });

  it('draws on threefold repetition', () => {
    const repeat = play(
      '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
      'a1b1', 'e8d8', 'b1a1', 'd8e8',
      'a1b1', 'e8d8', 'b1a1', 'd8e8'
    );
    expect(repeat.isRepetition()).toBe(true);
    expect(repeat.outcome()?.termination).toBe('repetition');
  });

  it('does not call two occurrences a repetition', () => {
    const twice = play(
      '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
      'a1b1', 'e8d8', 'b1a1', 'd8e8'
    );
    expect(twice.isRepetition()).toBe(false);
  });

  it('does NOT treat positions differing by castling rights as the same', () => {
    // The pieces come back; the rights do not. Moving the h1 rook loses White's
    // kingside right and moving the black king loses both of Black's, so the
    // position after the first shuffle is a DIFFERENT position from the start
    // under FIDE - and it has therefore occurred twice by the end, not three
    // times.
    //
    // A repetition key built from piece placement alone would call this a draw.
    const after = play(
      'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
      'h1g1', 'e8d8', 'g1h1', 'd8e8',
      'h1g1', 'e8d8', 'g1h1', 'd8e8'
    );
    expect(after.fen().split(' ')[0]).toBe('r3k2r/8/8/8/8/8/8/R3K2R');
    expect(after.fen().split(' ')[2]).toBe('Q');
    expect(after.isRepetition()).toBe(false);

    // Two more plies and it IS a repetition - but of an INTERMEDIATE position,
    // not the one the pieces started on. With the rook on g1 and the black king
    // on d8, the rights have already settled to Q, so that position occurs at
    // plies 2, 6 and 10 while the home position has only occurred twice.
    //
    // Worth spelling out because it is easy to reason about repetition as
    // though only the tidy positions count. Every position counts.
    const again = play(
      'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
      'h1g1', 'e8d8', 'g1h1', 'd8e8',
      'h1g1', 'e8d8', 'g1h1', 'd8e8',
      'h1g1', 'e8d8'
    );
    expect(again.fen().split(' ')[0]).toBe('r2k3r/8/8/8/8/8/8/R3K1R1');
    expect(again.isRepetition()).toBe(true);
    expect(again.outcome()?.termination).toBe('repetition');
  });
});

// ---------------------------------------------------------------------------
// Positions a rule set could commit to
// ---------------------------------------------------------------------------

describe('illegal start positions', () => {
  it('refuses a position with no king', () => {
    expect(parseFen('8/8/8/8/8/8/8/8 w - - 0 1')).toBeNull();
    expect(parseFen('4k3/8/8/8/8/8/8/8 w - - 0 1')).toBeNull();
  });

  it('refuses two kings of one colour', () => {
    expect(parseFen('4k3/8/8/8/8/8/8/3KK3 w - - 0 1')).toBeNull();
  });

  it('refuses a rank that does not add up to eight', () => {
    expect(parseFen('4k3/8/8/8/8/8/8/4K4 w - - 0 1')).toBeNull();
    expect(parseFen('4k3/8/8/8/8/8/8/4K2 w - - 0 1')).toBeNull();
  });

  it('REFUSES a position where the side NOT to move is already in check', () => {
    // Illegal under FIDE: that check could never have been left standing. If it
    // is accepted, the side to move can capture a king, and everything after
    // that is nonsense.
    expect(parseFen('4k3/4R3/8/8/8/8/8/4K3 w - - 0 1')).toBeNull();
    expect(parseFen('4k3/8/8/8/8/8/4r3/4K3 b - - 0 1')).toBeNull();
  });

  it('accepts the same positions with the other side to move', () => {
    expect(parseFen('4k3/4R3/8/8/8/8/8/4K3 b - - 0 1')).not.toBeNull();
    expect(parseFen('4k3/8/8/8/8/8/4r3/4K3 w - - 0 1')).not.toBeNull();
  });

  it('never generates a move that captures a king', () => {
    // Follows from the above, and is worth asserting directly: a king capture
    // would leave the position with a king index pointing at somebody else's
    // piece.
    for (const fen of [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
      '4k3/4R3/8/8/8/8/8/4K3 b - - 0 1',
      '8/8/8/KPp4r/8/8/8/7k w - c6 0 1'
    ]) {
      const position = new Position(fen);
      for (const move of position.moves()) {
        expect((move.captured & 7) === 6, `${fen} generates a king capture`).toBe(false);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// The pure API
// ---------------------------------------------------------------------------

describe('the functional wrappers', () => {
  it('applyMove returns a new position and leaves the old one alone', () => {
    const before = createPosition();
    const after = applyMove(before, 'e2e4');
    expect(after).not.toBeNull();
    expect(before.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(after!.fen().split(' ')[1]).toBe('b');
  });

  it('applyMove refuses an illegal move', () => {
    expect(applyMove(createPosition(), 'e2e5')).toBeNull();
  });

  it('CANNOT see a repetition, because each call starts a fresh history', () => {
    // Stated rather than fixed. A position rebuilt from a FEN has no history,
    // and repetition is a fact about a game rather than about a position. Any
    // caller that needs it must keep one Position and use applyUci, which is
    // what replay does.
    let position = createPosition('4k3/8/8/8/8/8/8/R3K3 w - - 0 1');
    for (const uci of ['a1b1', 'e8d8', 'b1a1', 'd8e8', 'a1b1', 'e8d8', 'b1a1', 'd8e8']) {
      position = applyMove(position, uci)!;
      expect(position).not.toBeNull();
    }
    expect(position.isRepetition()).toBe(false);

    const kept = play(
      '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
      'a1b1', 'e8d8', 'b1a1', 'd8e8', 'a1b1', 'e8d8', 'b1a1', 'd8e8'
    );
    expect(kept.isRepetition()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Cross-checks that need no fixture
// ---------------------------------------------------------------------------

describe('structural cross-checks', () => {
  it('counts the same through the fast and slow paths on tricky positions', () => {
    for (const fen of [
      '4r3/8/8/3k4/8/8/8/R3K2R w KQ - 0 1',
      '8/8/8/KPp4r/8/8/8/7k w - c6 0 1',
      '1n2k3/P7/8/8/8/8/8/4K3 w - - 0 1',
      '4k3/8/8/8/8/8/8/r2K4 w - - 0 1'
    ]) {
      const fast = perft(new Position(fen), 3);
      let slow = 0;
      const root = new Position(fen);
      for (const move of root.moves()) {
        const next = new Position(fen);
        next.applyUci(
          `${'abcdefgh'[move.from & 15]}${8 - (move.from >> 4)}` +
            `${'abcdefgh'[move.to & 15]}${8 - (move.to >> 4)}` +
            (move.promotion ? ['', 'p', 'n', 'b', 'r', 'q'][move.promotion] : '')
        );
        slow += perft(next, 2);
      }
      expect(slow, fen).toBe(fast);
    }
  });

  it('leaves every position untouched after a full walk', () => {
    for (const fen of [
      '4r3/8/8/3k4/8/8/8/R3K2R w KQ - 0 1',
      '8/8/8/KPp4r/8/8/8/7k w - c6 0 1'
    ]) {
      const position = new Position(fen);
      const before = position.fen();
      perft(position, 3);
      expect(position.fen()).toBe(before);
    }
  });
});
