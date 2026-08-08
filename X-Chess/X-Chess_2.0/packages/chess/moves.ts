// Move generation, attack detection, and the make/unmake pair.
//
// This is the hot path: legality filtering makes and unmakes every pseudo-legal
// move, and perft does it millions of times. So these functions do the minimum —
// no SAN, no repetition bookkeeping, no allocation beyond the move list. The
// bookkeeping lives in engine.ts, on the slower public path.

import {
  BIG_PAWN,
  BISHOP,
  BISHOP_OFFSETS,
  BLACK,
  CAPTURE,
  CASTLE_BK,
  CASTLE_BQ,
  CASTLE_MASK,
  CASTLE_WK,
  CASTLE_WQ,
  EMPTY,
  EP_CAPTURE,
  KING,
  KING_OFFSETS,
  KNIGHT,
  KNIGHT_OFFSETS,
  KSIDE_CASTLE,
  NORMAL,
  OFFSETS,
  PAWN,
  PROMOTION,
  QSIDE_CASTLE,
  QUEEN,
  ROOK,
  ROOK_OFFSETS,
  SLIDING,
  WHITE,
  makePiece,
  offBoard,
  pieceColor,
  pieceType
} from './board.js';
import type { Color, Move, PieceType, PositionState } from './board.js';

/** What `unmakeMove` needs to put the position back exactly as it was. */
export interface Undo {
  move: Move;
  turn: Color;
  castling: number;
  ep: number;
  halfmove: number;
  fullmove: number;
  whiteKing: number;
  blackKing: number;
}

/** Is `square` attacked by any piece of colour `by`? */
export function attacked(state: PositionState, square: number, by: Color): boolean {
  const b = state.board;

  // A pawn of colour `by` attacking `square` sits behind it, so the offsets are
  // the reverse of that colour's own capture directions.
  const pawnOffsets = by === WHITE ? [15, 17] : [-15, -17];
  for (const d of pawnOffsets) {
    const s = square + d;
    if (offBoard(s)) continue;
    const p = b[s];
    if (p !== EMPTY && pieceColor(p) === by && pieceType(p) === PAWN) return true;
  }

  for (const d of KNIGHT_OFFSETS) {
    const s = square + d;
    if (offBoard(s)) continue;
    const p = b[s];
    if (p !== EMPTY && pieceColor(p) === by && pieceType(p) === KNIGHT) return true;
  }

  for (const d of KING_OFFSETS) {
    const s = square + d;
    if (offBoard(s)) continue;
    const p = b[s];
    if (p !== EMPTY && pieceColor(p) === by && pieceType(p) === KING) return true;
  }

  for (const d of BISHOP_OFFSETS) {
    let s = square + d;
    while (!offBoard(s)) {
      const p = b[s];
      if (p !== EMPTY) {
        if (pieceColor(p) === by) {
          const t = pieceType(p);
          if (t === BISHOP || t === QUEEN) return true;
        }
        break;
      }
      s += d;
    }
  }

  for (const d of ROOK_OFFSETS) {
    let s = square + d;
    while (!offBoard(s)) {
      const p = b[s];
      if (p !== EMPTY) {
        if (pieceColor(p) === by) {
          const t = pieceType(p);
          if (t === ROOK || t === QUEEN) return true;
        }
        break;
      }
      s += d;
    }
  }

  return false;
}

export function inCheck(state: PositionState): boolean {
  return attacked(state, state.kings[state.turn], (state.turn ^ 1) as Color);
}

function pushPawnMoves(
  state: PositionState,
  list: Move[],
  from: number,
  to: number,
  flags: number,
  captured: number
): void {
  const promoRank = state.turn === WHITE ? 0 : 7;
  if (to >> 4 === promoRank) {
    // Queen first, so that a caller taking the first match of a from/to pair
    // without a promotion letter gets the sane one. Replay never does this —
    // it requires the letter — but the bots and the UI do.
    for (const promotion of [QUEEN, ROOK, BISHOP, KNIGHT] as PieceType[]) {
      list.push({
        from,
        to,
        piece: state.board[from],
        captured,
        promotion,
        flags: flags | PROMOTION
      });
    }
    return;
  }
  list.push({ from, to, piece: state.board[from], captured, promotion: 0, flags });
}

/**
 * Moves that are shaped correctly but may leave the mover's own king attacked.
 *
 * `only` restricts generation to one origin square, which is what the UI uses to
 * highlight the destinations for a piece without generating the whole tree.
 */
export function pseudoMoves(state: PositionState, only = -1): Move[] {
  const moves: Move[] = [];
  const us = state.turn;
  const them = (us ^ 1) as Color;
  const b = state.board;
  const startRank = us === WHITE ? 6 : 1;
  const push = us === WHITE ? -16 : 16;
  const captures = us === WHITE ? [-17, -15] : [17, 15];
  const homeSquare = us === WHITE ? 116 : 4;

  for (let from = 0; from < 128; from++) {
    if (offBoard(from)) {
      from += 7;
      continue;
    }
    if (only >= 0 && from !== only) continue;

    const piece = b[from];
    if (piece === EMPTY || pieceColor(piece) !== us) continue;

    const type = pieceType(piece);

    if (type === PAWN) {
      const one = from + push;
      if (!offBoard(one) && b[one] === EMPTY) {
        pushPawnMoves(state, moves, from, one, NORMAL, EMPTY);
        const two = from + 2 * push;
        if (from >> 4 === startRank && b[two] === EMPTY) {
          moves.push({ from, to: two, piece, captured: EMPTY, promotion: 0, flags: BIG_PAWN });
        }
      }
      for (const d of captures) {
        const to = from + d;
        if (offBoard(to)) continue;
        const target = b[to];
        if (target !== EMPTY) {
          if (pieceColor(target) === them) {
            pushPawnMoves(state, moves, from, to, CAPTURE, target);
          }
        } else if (to === state.ep) {
          moves.push({
            from,
            to,
            piece,
            captured: makePiece(PAWN, them),
            promotion: 0,
            flags: CAPTURE | EP_CAPTURE
          });
        }
      }
      continue;
    }

    const sliding = SLIDING[type] === true;
    for (const d of OFFSETS[type]) {
      let to = from + d;
      while (!offBoard(to)) {
        const target = b[to];
        if (target === EMPTY) {
          moves.push({ from, to, piece, captured: EMPTY, promotion: 0, flags: NORMAL });
        } else {
          if (pieceColor(target) === them) {
            moves.push({ from, to, piece, captured: target, promotion: 0, flags: CAPTURE });
          }
          break;
        }
        if (!sliding) break;
        to += d;
      }
    }

    if (type === KING) {
      // Castling rights in a position reached by play always imply the king is
      // home and the rook is present, because CASTLE_MASK clears the right the
      // moment either leaves. A hand-written FEN carries no such guarantee, and
      // a start position arrives here from a rule set somebody committed to the
      // chain. Without these two guards a FEN claiming a right it has not earned
      // generates a castle that teleports the king and erases a square, which
      // would be a position no other reader could reproduce.
      if (from !== homeSquare) continue;

      const kingSide = us === WHITE ? CASTLE_WK : CASTLE_BK;
      const queenSide = us === WHITE ? CASTLE_WQ : CASTLE_BQ;

      const rookHere = (sq: number): boolean => {
        const p = b[sq];
        return p !== EMPTY && pieceColor(p) === us && pieceType(p) === ROOK;
      };

      if (state.castling & kingSide) {
        const to = from + 2;
        if (
          rookHere(from + 3) &&
          b[from + 1] === EMPTY &&
          b[to] === EMPTY &&
          !attacked(state, from, them) &&
          !attacked(state, from + 1, them) &&
          !attacked(state, to, them)
        ) {
          moves.push({ from, to, piece, captured: EMPTY, promotion: 0, flags: KSIDE_CASTLE });
        }
      }

      if (state.castling & queenSide) {
        const to = from - 2;
        if (
          rookHere(from - 4) &&
          b[from - 1] === EMPTY &&
          b[to] === EMPTY &&
          b[from - 3] === EMPTY &&
          !attacked(state, from, them) &&
          !attacked(state, from - 1, them) &&
          !attacked(state, to, them)
        ) {
          moves.push({ from, to, piece, captured: EMPTY, promotion: 0, flags: QSIDE_CASTLE });
        }
      }
    }
  }

  return moves;
}

export function makeMove(state: PositionState, m: Move): Undo {
  const us = state.turn;
  const b = state.board;

  const undo: Undo = {
    move: m,
    turn: state.turn,
    castling: state.castling,
    ep: state.ep,
    halfmove: state.halfmove,
    fullmove: state.fullmove,
    whiteKing: state.kings[0],
    blackKing: state.kings[1]
  };

  b[m.to] = b[m.from];
  b[m.from] = EMPTY;

  if (m.flags & EP_CAPTURE) {
    b[m.to + (us === WHITE ? 16 : -16)] = EMPTY;
  }

  if (m.flags & PROMOTION) {
    b[m.to] = makePiece(m.promotion as PieceType, us);
  }

  if (pieceType(b[m.to]) === KING) {
    state.kings[us] = m.to;
    if (m.flags & KSIDE_CASTLE) {
      b[m.to - 1] = b[m.to + 1];
      b[m.to + 1] = EMPTY;
    } else if (m.flags & QSIDE_CASTLE) {
      b[m.to + 1] = b[m.to - 2];
      b[m.to - 2] = EMPTY;
    }
  }

  state.castling &= CASTLE_MASK[m.from] & CASTLE_MASK[m.to];
  state.ep = m.flags & BIG_PAWN ? m.from + (us === WHITE ? -16 : 16) : -1;

  if (pieceType(m.piece) === PAWN || m.flags & CAPTURE) state.halfmove = 0;
  else state.halfmove++;

  if (us === BLACK) state.fullmove++;
  state.turn = (us ^ 1) as Color;

  return undo;
}

export function unmakeMove(state: PositionState, undo: Undo): Move {
  const m = undo.move;
  state.turn = undo.turn;
  state.castling = undo.castling;
  state.ep = undo.ep;
  state.halfmove = undo.halfmove;
  state.fullmove = undo.fullmove;
  state.kings[0] = undo.whiteKing;
  state.kings[1] = undo.blackKing;

  const b = state.board;
  const us = state.turn;

  b[m.from] = m.piece;
  b[m.to] = EMPTY;

  if (m.flags & EP_CAPTURE) {
    b[m.to + (us === WHITE ? 16 : -16)] = makePiece(PAWN, (us ^ 1) as Color);
  } else if (m.flags & CAPTURE) {
    b[m.to] = m.captured;
  }

  if (m.flags & KSIDE_CASTLE) {
    b[m.to + 1] = b[m.to - 1];
    b[m.to - 1] = EMPTY;
  } else if (m.flags & QSIDE_CASTLE) {
    b[m.to - 2] = b[m.to + 1];
    b[m.to + 1] = EMPTY;
  }

  return m;
}

/** Pseudo-legal moves that do not leave their own king attacked. */
export function legalMoves(state: PositionState, only = -1): Move[] {
  const us = state.turn;
  const them = (us ^ 1) as Color;
  const out: Move[] = [];
  for (const m of pseudoMoves(state, only)) {
    const undo = makeMove(state, m);
    if (!attacked(state, state.kings[us], them)) out.push(m);
    unmakeMove(state, undo);
  }
  return out;
}
