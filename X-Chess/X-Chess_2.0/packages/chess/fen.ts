// FEN in and FEN out.
//
// `parseFen` returns null rather than throwing, because a FEN can arrive from a
// rule set that someone committed to the chain, and replay is a total function.
// The throwing wrapper lives in engine.ts, where the input is our own.

import {
  BLACK,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  KING,
  PAWN,
  SYMBOLS,
  WHITE,
  algebraic,
  makePiece,
  offBoard,
  parseSquare,
  pieceColor,
  pieceType
} from './board.js';
import type { Color, PieceType, PositionState } from './board.js';
import { attacked } from './moves.js';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * A position, or null if the text does not describe one.
 *
 * Validation is deliberately structural rather than exhaustive: the board must
 * have eight ranks that each fill exactly eight files, the piece letters must be
 * real, and each side must have exactly one king. A position that is structurally
 * sound but unreachable in a real game (say, pawns on the first rank) is
 * accepted, because the engine can still play it deterministically and refusing
 * it would be a rule nobody agreed to.
 *
 * One king each is not optional. Everything downstream - check detection, move
 * legality, `kings[]` - assumes both are on the board.
 *
 * A position where the side NOT to move is already in check is also refused.
 * That is illegal under FIDE: the check could never have been left standing, so
 * no legal game reaches it. Accepting one has consequences that are not
 * cosmetic - see the note on the check itself, below.
 */
export function parseFen(fen: string): PositionState | null {
  if (typeof fen !== 'string') return null;
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 4) return null;

  const rows = parts[0].split('/');
  if (rows.length !== 8) return null;

  const board = new Uint8Array(128);
  const kings: [number, number] = [-1, -1];

  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    for (const ch of rows[rank]) {
      if (ch >= '1' && ch <= '8') {
        file += Number(ch);
        continue;
      }
      const type = SYMBOLS.indexOf(ch.toLowerCase() as (typeof SYMBOLS)[number]);
      if (type <= 0) return null;
      if (file > 7) return null;
      const color: Color = ch === ch.toUpperCase() ? WHITE : BLACK;
      const sq = rank * 16 + file;
      board[sq] = makePiece(type as PieceType, color);
      if (type === KING) {
        // A second king of the same colour would leave `kings` pointing at one
        // of them arbitrarily, and every legality check downstream would then be
        // asking about the wrong piece.
        if (kings[color] !== -1) return null;
        kings[color] = sq;
      }
      file++;
    }
    if (file !== 8) return null;
  }

  if (kings[WHITE] === -1 || kings[BLACK] === -1) return null;

  const turn: Color = parts[1] === 'b' ? BLACK : WHITE;

  let castling = 0;
  if (parts[2].includes('K')) castling |= CASTLE_WK;
  if (parts[2].includes('Q')) castling |= CASTLE_WQ;
  if (parts[2].includes('k')) castling |= CASTLE_BK;
  if (parts[2].includes('q')) castling |= CASTLE_BQ;

  const ep = parts[3] === '-' ? -1 : parseSquare(parts[3]);
  if (parts[3] !== '-' && ep < 0) return null;

  const halfmove = parts.length > 4 ? Number(parts[4]) || 0 : 0;
  const fullmove = parts.length > 5 ? Number(parts[5]) || 1 : 1;
  if (!Number.isFinite(halfmove) || halfmove < 0) return null;
  if (!Number.isFinite(fullmove) || fullmove < 1) return null;

  const state: PositionState = { board, kings, turn, castling, ep, halfmove, fullmove };

  /**
   * The side NOT to move must not be in check.
   *
   * This is not pedantry about FIDE. Left in, the side to move can CAPTURE THE
   * OTHER KING, because a king is an ordinary target for move generation and
   * nothing else refuses it. The position that results has no king of that
   * colour, `kings[]` points at a square holding somebody else's piece, and the
   * engine goes on to report the game as a STALEMATE - a draw - because the
   * side with no king has no legal moves.
   *
   * A start position arrives from a rule set somebody committed on chain and
   * cannot edit, so this is reachable rather than theoretical. Refusing it here
   * makes it a rule set replay reports as unusable, which is the honest answer,
   * instead of a game that ends in a draw by regicide.
   */
  const waiting = (turn ^ 1) as Color;
  if (attacked(state, kings[waiting], turn)) return null;

  return state;
}

export function fenBoard(state: PositionState): string {
  let out = '';
  for (let rank = 0; rank < 8; rank++) {
    let run = 0;
    for (let file = 0; file < 8; file++) {
      const p = state.board[rank * 16 + file];
      if (p === EMPTY) {
        run++;
        continue;
      }
      if (run) {
        out += run;
        run = 0;
      }
      const letter = SYMBOLS[pieceType(p)];
      out += pieceColor(p) === WHITE ? letter.toUpperCase() : letter;
    }
    if (run) out += run;
    if (rank < 7) out += '/';
  }
  return out;
}

export function castlingString(state: PositionState): string {
  let out = '';
  if (state.castling & CASTLE_WK) out += 'K';
  if (state.castling & CASTLE_WQ) out += 'Q';
  if (state.castling & CASTLE_BK) out += 'k';
  if (state.castling & CASTLE_BQ) out += 'q';
  return out || '-';
}

/**
 * The en passant square, reported only when the side to move actually has a pawn
 * placed to capture onto it.
 *
 * This matters for repetition. Under FIDE rules two positions that differ only
 * by an en passant square nobody can use are the same position, so a key built
 * from a FEN that always printed the square would fail to see a repetition that
 * has genuinely occurred.
 */
export function epString(state: PositionState): string {
  if (state.ep === -1) return '-';
  const offsets = state.turn === WHITE ? [-17, -15] : [17, 15];
  for (const d of offsets) {
    const from = state.ep - d;
    if (offBoard(from)) continue;
    const p = state.board[from];
    if (p !== EMPTY && pieceColor(p) === state.turn && pieceType(p) === PAWN) {
      return algebraic(state.ep);
    }
  }
  return '-';
}

export function formatFen(state: PositionState): string {
  return [
    fenBoard(state),
    state.turn === WHITE ? 'w' : 'b',
    castlingString(state),
    epString(state),
    state.halfmove,
    state.fullmove
  ].join(' ');
}

/**
 * The repetition key: everything FIDE counts as "the same position", and
 * nothing it does not. Move counters are deliberately absent.
 */
export function positionKey(state: PositionState): string {
  return `${fenBoard(state)} ${state.turn === WHITE ? 'w' : 'b'} ${castlingString(state)} ${epString(state)}`;
}
