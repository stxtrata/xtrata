// A deterministic chess engine, small enough to inscribe.
//
// WHY THIS EXISTS, measured rather than assumed. Six games and about 2 STX went
// into finding out that a language model cannot play chess from a legal move
// list. Three interventions were tried and measured; none of them worked:
//
//   more thinking effort                 29% of moves hang a piece -> 29%
//   competence instructions in the prompt        21% -> 21%
//   a king-mobility hint in an endgame    no mate in 50 plies, queen v bare king
//
// One thing did work, and only as far as it searched:
//
//   a one-ply computed annotation                29% -> 8%
//
// A one-ply test cannot form a plan, because a plan IS a search. So the answer
// is not more prompting, it is the search — chess has been solved well enough
// for this since the 1990s, and a few hundred lines of alpha-beta plays an
// endgame better than any amount of instruction.
//
// WHAT THIS CHANGES ABOUT THE TOURNAMENT. It stops measuring "can a model play
// chess" — it cannot, and that is not an interesting question — and starts
// measuring what a personality does when it CAN. A character is handed ranked
// moves with real evaluations and picks by style, which is what a playing style
// actually is: a preference among reasonable moves. When every move reads
// "nothing hangs", no style can express itself at all.
//
// DETERMINISTIC, and that word is load-bearing. Same position, same depth, same
// answer, on any machine, forever. No randomness, no clock, no time-based
// cutoff, no transposition table carried between calls. That is what makes it
// worth inscribing: an entrant can fetch the code by hash and verify that every
// player in the tournament was handed the same analysis.

import {
  BISHOP, BLACK, KING, KNIGHT, PAWN, QUEEN, ROOK, WHITE,
  pieceColor, pieceType
} from './board.js';
import { inCheck, legalMoves, makeMove, unmakeMove } from './moves.js';
import { toUci } from './uci.js';
import type { Color, Move, PositionState } from './board.js';

/** Centipawns. The classic values; nothing here is trying to be novel. */
const VALUE = [0, 100, 320, 330, 500, 900, 0];

/**
 * Where each piece would rather stand, in centipawns, from White's side.
 *
 * Index 0 is a8, so the tables read like a printed board. Black uses the same
 * numbers through `index ^ 56`, which mirrors the rank and leaves the file
 * alone — the position is symmetric, and two copies of every table would be a
 * kilobyte of inscription buying nothing.
 *
 * These are the standard simplified tables. They exist so the engine has an
 * opinion in a quiet position, where material alone says every move is equal.
 */
const PST: Record<number, number[]> = {
  [PAWN]: [
      0,  0,  0,  0,  0,  0,  0,  0,
     50, 50, 50, 50, 50, 50, 50, 50,
     10, 10, 20, 30, 30, 20, 10, 10,
      5,  5, 10, 25, 25, 10,  5,  5,
      0,  0,  0, 20, 20,  0,  0,  0,
      5, -5,-10,  0,  0,-10, -5,  5,
      5, 10, 10,-20,-20, 10, 10,  5,
      0,  0,  0,  0,  0,  0,  0,  0],
  [KNIGHT]: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50],
  [BISHOP]: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20],
  [ROOK]: [
      0,  0,  0,  0,  0,  0,  0,  0,
      5, 10, 10, 10, 10, 10, 10,  5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
     -5,  0,  0,  0,  0,  0,  0, -5,
      0,  0,  0,  5,  5,  0,  0,  0],
  [QUEEN]: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20],
  [KING]: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20]
};

/**
 * How far each square is from the middle, doubled.
 *
 * THE MATING TERM, and the reason game 18 could not end. With a bare king the
 * material is settled and every legal move scores the same, so the search has
 * nothing to prefer and shuffles. Mate needs the enemy king driven to an edge,
 * which is a plan across many moves and cannot be seen at any practical depth.
 *
 * Written into the evaluation instead, it becomes something depth 3 can act on:
 * a corner scores worse for the defender than the middle, so every move that
 * shrinks the king's world looks better than one that does not.
 */
const FROM_CENTRE = [
  6, 5, 4, 3, 3, 4, 5, 6,
  5, 4, 3, 2, 2, 3, 4, 5,
  4, 3, 2, 1, 1, 2, 3, 4,
  3, 2, 1, 0, 0, 1, 2, 3,
  3, 2, 1, 0, 0, 1, 2, 3,
  4, 3, 2, 1, 1, 2, 3, 4,
  5, 4, 3, 2, 2, 3, 4, 5,
  6, 5, 4, 3, 3, 4, 5, 6
];

/** Bigger than any material score, so a mate always outranks winning a queen. */
const MATE = 100_000;

/** 0x88 square to a 0..63 index where 0 is a8, which is how the tables read. */
const idx64 = (sq: number): number => (sq >> 4) * 8 + (sq & 7);

/**
 * What the position is worth to the side to move, in centipawns.
 *
 * Negamax convention: always from the mover's point of view, so the search
 * itself never has to think about colour.
 */
export function evaluate(state: PositionState): number {
  // Material and kings first, because whether this is an endgame decides which
  // king table applies, and that has to be known before anything is scored.
  const material = [0, 0];
  const kings: [number, number] = [-1, -1];
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    const piece = state.board[sq];
    if (!piece) continue;
    const type = pieceType(piece);
    const colour = pieceColor(piece);
    if (type === KING) kings[colour] = sq;
    else material[colour] += VALUE[type];
  }

  // A BARE KING CHANGES WHERE A KING WANTS TO BE, and missing that made the
  // endgame term useless. The king table below rewards a castled corner: h1
  // scores +20 and e4 scores -40, so driving the enemy king into a corner
  // HELPED it by sixty centipawns and cancelled the drive term almost exactly.
  // Measured before the fix: cornering White scored 954 for Black against 966
  // for leaving it in the middle — the engine preferred not to make progress.
  const mating = material[WHITE] === 0 || material[BLACK] === 0;

  let score = 0;
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    const piece = state.board[sq];
    if (!piece) continue;
    const type = pieceType(piece);
    const colour = pieceColor(piece);
    // In a mating endgame the king's placement is handled entirely by the drive
    // term, which knows what it is trying to do. Two opinions about kings would
    // just be the louder one winning.
    if (type === KING && mating) continue;
    const at = colour === WHITE ? idx64(sq) : idx64(sq) ^ 56;
    const worth = VALUE[type] + (PST[type]?.[at] ?? 0);
    score += colour === WHITE ? worth : -worth;
  }

  for (const side of [WHITE, BLACK] as Color[]) {
    const other = (side === WHITE ? BLACK : WHITE) as Color;
    if (material[other] === 0 && material[side] >= 500 && kings[other] >= 0 && kings[side] >= 0) {
      // Push the defender to an edge, and bring our own king up: without the
      // second half the defender simply walks away from a lone queen forever.
      const cornered = FROM_CENTRE[idx64(kings[other])] * 12;
      const gap =
        Math.abs((kings[side] >> 4) - (kings[other] >> 4)) +
        Math.abs((kings[side] & 7) - (kings[other] & 7));
      const drive = cornered + (14 - gap) * 6;
      score += side === WHITE ? drive : -drive;
    }
  }

  return state.turn === WHITE ? score : -score;
}

/**
 * Captures first, and biggest capture by smallest attacker first.
 *
 * Pure speed, no strength: alpha-beta prunes far more when it sees good moves
 * early. The ordering is a total order with no ties left to chance, because a
 * deterministic engine cannot afford a sort that depends on anything else.
 */
function ordered(moves: Move[]): Move[] {
  return moves
    .map((move, at) => ({ move, at, gain: move.captured ? VALUE[pieceType(move.captured)] * 16 - VALUE[pieceType(move.piece)] : 0 }))
    .sort((a, b) => b.gain - a.gain || a.at - b.at)
    .map((row) => row.move);
}

/**
 * Negamax with alpha-beta.
 *
 * `ply` is how deep we already are, and it exists so a mate found sooner scores
 * better than the same mate found later. Without it the engine happily delays
 * mate forever, which is precisely the behaviour this whole file is here to
 * fix: it would find the win and never take it.
 */
function negamax(state: PositionState, depth: number, alpha: number, beta: number, ply: number): number {
  const moves = legalMoves(state);

  if (moves.length === 0) {
    // Mate is scored from the loser's side, so a shallower mate is worse for
    // them and the winner therefore prefers it.
    return inCheck(state) ? -MATE + ply : 0;
  }
  if (depth <= 0) return evaluate(state);

  let best = -Infinity;
  for (const move of ordered(moves)) {
    const undo = makeMove(state, move);
    const score = -negamax(state, depth - 1, -beta, -alpha, ply + 1);
    unmakeMove(state, undo);

    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

export interface RankedMove {
  uci: string;
  /** Centipawns from the mover's point of view. Higher is better for them. */
  score: number;
  /** Moves until mate, positive when the mover delivers it, else null. */
  mateIn: number | null;
}

/**
 * Every legal move, scored and sorted best first.
 *
 * The whole public surface. It returns the FULL list rather than one best move,
 * because the tournament is about which move a character picks and not about
 * which move is strongest — a list with only the best move in it is an engine
 * playing, and nobody wants to watch that.
 *
 * `depth` is plies searched after the move. Three is enough to see a hanging
 * piece, a two-move tactic and a mate in two; each further ply costs roughly
 * five times as long.
 */
export function rankMoves(state: PositionState, depth = 3): RankedMove[] {
  const scored = legalMoves(state).map((move, at) => {
    const undo = makeMove(state, move);
    const score = -negamax(state, depth - 1, -Infinity, Infinity, 1);
    unmakeMove(state, undo);

    const distance = MATE - Math.abs(score);
    return {
      uci: toUci(move),
      score,
      // Only report a mate that is actually within reach of this search; a
      // score near MATE from a deep line is a real mate, anything else is not.
      mateIn: Math.abs(score) > MATE - 1000 ? Math.ceil(distance / 2) * Math.sign(score) : null,
      at
    };
  });

  // Best first, and ties broken by generation order rather than left to the
  // sort. Two engines disagreeing about equal moves would break the promise
  // that the same position gives the same answer.
  return scored
    .sort((a, b) => b.score - a.score || a.at - b.at)
    .map(({ uci, score, mateIn }) => ({ uci, score, mateIn }));
}
