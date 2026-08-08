// Players for simulation mode.
//
// Everything here is seeded, so a simulation is reproducible from its seed. A
// failing automated game can be replayed exactly by rerunning with the seed it
// reports.
//
// The griefer matters as much as the players do. Version 1 of the board is
// wide open, so the log will hold junk, moves for the wrong side, and moves
// sent after the game has already ended. The simulation is only honest if it
// produces that traffic too.

import { Chess, pieceType, algebraic, toUci, PAWN, KNIGHT, BISHOP, ROOK, QUEEN } from './engine.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VALUE = {
  [PAWN]: 100,
  [KNIGHT]: 320,
  [BISHOP]: 330,
  [ROOK]: 500,
  [QUEEN]: 900
};

function pick(list, random) {
  return list[Math.floor(random() * list.length)];
}

// Uniform over legal moves. Produces long, shapeless games that tend to end by
// the fifty move rule or insufficient material, which is useful coverage of the
// draw paths.
export function randomBot(chess, random) {
  const moves = chess.moves();
  if (!moves.length) return null;
  return toUci(pick(moves, random));
}

// Takes mate when it is there, then material, then checks. Not strong, but it
// captures and finishes games, which exercises checkmate, promotion, and the
// game-over path.
export function greedyBot(chess, random) {
  const moves = chess.moves();
  if (!moves.length) return null;

  let best = null;
  let bestScore = -Infinity;

  for (const move of moves) {
    let score = random() * 10;

    if (move.captured) score += VALUE[pieceType(move.captured)] || 0;
    if (move.promotion) score += (VALUE[move.promotion] || 0) - VALUE[PAWN];

    chess._make(move);
    const replies = chess.moves();
    const givesCheck = chess.inCheck();
    if (givesCheck && replies.length === 0) score += 1e6;
    else if (givesCheck) score += 40;
    // Do not hang the piece we just moved for nothing.
    if (replies.some((r) => r.to === move.to && r.captured)) {
      score -= (VALUE[pieceType(move.piece)] || 0) * 0.9;
    }
    chess._unmake();

    const file = move.to & 15;
    const rank = move.to >> 4;
    score += 6 - (Math.abs(file - 3.5) + Math.abs(rank - 3.5));

    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }

  return toUci(best);
}

const JUNK = ['', 'x', 'hello', 'e2e', 'z9z9', 'e2e4q', 'O-O', '0000', '  ', 'e2-e4'];

// Submits things the board will skip. Every one of these costs the sender a
// transaction and changes nothing, which is the whole economic argument for
// leaving version 1 unthrottled.
export function grieferBot(chess, random) {
  const roll = random();

  // Malformed: the contract's length filter catches some of it, replay catches
  // the rest.
  if (roll < 0.35) return pick(JUNK, random);

  // A legal move for the side that is not to move.
  if (roll < 0.7) {
    const mirror = new Chess(chess.fen());
    const parts = mirror.fen().split(' ');
    parts[1] = parts[1] === 'w' ? 'b' : 'w';
    parts[3] = '-';
    try {
      mirror.load(parts.join(' '));
    } catch {
      return pick(JUNK, random);
    }
    const moves = mirror.moves();
    if (moves.length) return toUci(pick(moves, random));
    return pick(JUNK, random);
  }

  // Well formed, correctly shaped, and simply not legal here.
  const from = Math.floor(random() * 64);
  const to = Math.floor(random() * 64);
  const sq = (i) => algebraic((i >> 3) * 16 + (i & 7));
  return sq(from) + sq(to);
}

export const BOTS = {
  random: randomBot,
  greedy: greedyBot,
  griefer: grieferBot
};
