// The deterministic engine.
//
// Two properties carry everything, and they are different in kind.
//
// STRENGTH is why it exists: six games and about 2 STX established that a
// language model cannot play chess from a legal move list, and that no amount
// of prompting changes it. Four interventions were measured — more effort,
// competence instructions, a king-mobility hint, and a one-ply annotation — and
// only the last did anything, because only the last was a computation.
//
// DETERMINISM is why it can be inscribed. Same position, same depth, same
// answer, on any machine, forever. Without that an entrant cannot verify that
// every player was handed the same analysis, and the tournament is asking to be
// trusted rather than checked.

import { describe, expect, it } from 'vitest';
import { Position } from '../../packages/chess/engine.js';
import { evaluate, rankMoves } from '../../packages/chess/search.js';

const at = (fen: string): Position => new Position(fen);
const best = (fen: string, depth = 3): string => rankMoves(at(fen).state, depth)[0].uci;

describe('it finds the move', () => {
  it('takes a mate in one', () => {
    // Annotated "— nothing hangs" by the one-ply test this replaces, which is
    // true and is the least useful true thing available.
    const ranked = rankMoves(at('6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1').state, 3);
    expect(ranked[0].uci).toBe('e1e8');
    expect(ranked[0].mateIn).toBe(1);
  });

  it('prefers a faster mate to a slower one', () => {
    // Without the ply term in the score, a mate in two ranks equal to a mate in
    // one and the engine cheerfully postpones the win forever — precisely the
    // behaviour this file exists to end. Searched deep enough to see both.
    const ranked = rankMoves(at('6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1').state, 4);
    const mates = ranked.filter((r) => r.mateIn && r.mateIn > 0);
    expect(mates.length, 'no mate found at all').toBeGreaterThan(0);
    expect(mates[0].mateIn, 'a slower mate outranked a faster one').toBe(
      Math.min(...mates.map((m) => m.mateIn as number))
    );
  });

  it('takes a free queen', () => {
    // Black queen on g3, White pawn on h2, nothing defending her.
    expect(best('4k3/8/8/8/8/6q1/7P/4K3 w - - 0 1')).toBe('h2g3');
  });
});

describe('it can actually mate, which is the whole point', () => {
  it('mates from the ending that ran a hundred moves without one', () => {
    // Game 18. Oblique had a queen against a bare king from move 68 and was
    // still shuffling at move 168, when the game was conceded by hand at a cost
    // of 1.008 STX. This is that exact position.
    const board = at('8/8/8/3p4/5K2/2k5/8/q7 b - - 22 169');
    let plies = 0;
    for (; plies < 60 && !board.isCheckmate(); plies++) {
      if (board.isStalemate() || board.isFiftyMoveDraw()) break;
      const ranked = rankMoves(board.state, 3);
      board.applyUci(ranked[0].uci);
    }
    expect(board.isCheckmate(), `no mate in ${plies} plies`).toBe(true);
    expect(plies).toBeLessThan(20);
  });

  it('knows a cornered king is worse for its owner', () => {
    // The bug this test is named after: the king piece-square table rewards a
    // castled corner, so h1 scored +20 and e4 scored -40 — driving the enemy
    // king into a corner HELPED it by sixty centipawns and cancelled the whole
    // endgame term. The engine preferred not to make progress.
    const centre = evaluate(at('8/8/8/q7/4K3/2k5/8/8 b - - 0 1').state);
    const corner = evaluate(at('8/8/8/q7/8/2k5/8/7K b - - 0 1').state);
    expect(corner, 'cornering the enemy king must score better').toBeGreaterThan(centre);
  });

  it('does not walk into stalemate when it is winning', () => {
    // Throwing away a won game is worse than any blunder the one-ply test was
    // built to catch, and a lone queen stalemates by accident constantly.
    const board = at('7k/8/8/8/8/8/5Q2/6K1 w - - 0 1');
    for (let n = 0; n < 40 && !board.isCheckmate(); n++) {
      if (board.isStalemate()) break;
      board.applyUci(rankMoves(board.state, 3)[0].uci);
    }
    expect(board.isStalemate(), 'stalemated a position it was winning').toBe(false);
  });
});

describe('it is deterministic, which is what makes it inscribable', () => {
  const FEN = '8/8/8/3p4/5K2/2k5/8/q7 b - - 22 169';
  const fingerprint = (ranked: ReturnType<typeof rankMoves>): string =>
    ranked.map((r) => `${r.uci}:${r.score}`).join(',');

  it('gives the same answer to the same question', () => {
    expect(fingerprint(rankMoves(at(FEN).state, 3))).toBe(fingerprint(rankMoves(at(FEN).state, 3)));
  });

  it('leaves the position exactly as it found it', () => {
    // Searching is thousands of make/unmake pairs. One that does not restore
    // cleanly would corrupt the live game, not just the analysis.
    const board = at(FEN);
    const before = board.fen();
    rankMoves(board.state, 3);
    expect(board.fen()).toBe(before);
    rankMoves(board.state, 3);
    expect(board.fen()).toBe(before);
  });

  it('gives the same answer whether or not the state has been searched before', () => {
    const board = at(FEN);
    const first = fingerprint(rankMoves(board.state, 3));
    rankMoves(board.state, 4);
    expect(fingerprint(rankMoves(board.state, 3))).toBe(first);
  });

  it('breaks ties by generation order rather than leaving them to the sort', () => {
    // Equal moves are common and an unstable sort would make two machines
    // disagree about them, which breaks the only promise that matters here.
    const ranked = rankMoves(at('8/8/8/8/8/4k3/8/4K2R w K - 0 1').state, 2);
    const scores = ranked.map((r) => r.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

describe('it ranks everything, because the character does the choosing', () => {
  it('returns every legal move, not a recommendation', () => {
    // A list with only the best move in it is an engine playing, and nobody
    // entered a tournament to watch that. The order informs; it does not decide.
    const board = at('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(rankMoves(board.state, 2).length).toBe(board.movesUci().length);
  });

  it('keeps a bad move on the list, priced', () => {
    // A character told to sacrifice must still be able to. What changes is that
    // it can now see what the sacrifice costs.
    const ranked = rankMoves(at('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').state, 2);
    expect(ranked[ranked.length - 1].score).toBeLessThan(ranked[0].score);
  });
});
