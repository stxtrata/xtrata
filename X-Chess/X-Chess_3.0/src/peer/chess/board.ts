// 0x88 board primitives.
//
// A 128-entry array where the low nibble is the file and the high nibble is the
// rank, so a square is off the board exactly when `sq & 0x88` is non-zero.
// Index 0 is a8 and index 119 is h1, which means White moves toward lower
// indices.
//
// This file knows nothing but geometry and pieces. No rules, no FEN, no chain,
// no DOM. Everything above it is built from these.

export const WHITE = 0;
export const BLACK = 1;

export type Color = typeof WHITE | typeof BLACK;

export const EMPTY = 0;
export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

export type PieceType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** A piece is its type in the low three bits and its colour in bit 3. */
export type Piece = number;

// Flags on a generated move. A move may carry several.
export const NORMAL = 1;
export const CAPTURE = 2;
export const BIG_PAWN = 4;
export const EP_CAPTURE = 8;
export const PROMOTION = 16;
export const KSIDE_CASTLE = 32;
export const QSIDE_CASTLE = 64;

export const FLAGS = {
  NORMAL,
  CAPTURE,
  BIG_PAWN,
  EP_CAPTURE,
  PROMOTION,
  KSIDE_CASTLE,
  QSIDE_CASTLE
} as const;

export const CASTLE_WK = 1;
export const CASTLE_WQ = 2;
export const CASTLE_BK = 4;
export const CASTLE_BQ = 8;

/** Index by piece type. Index 0 is the empty square and has no letter. */
export const SYMBOLS = ['', 'p', 'n', 'b', 'r', 'q', 'k'] as const;

export const KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33];
export const BISHOP_OFFSETS = [-17, -15, 15, 17];
export const ROOK_OFFSETS = [-16, -1, 1, 16];
export const KING_OFFSETS = [-17, -16, -15, -1, 1, 15, 16, 17];

export const OFFSETS: Record<number, number[]> = {
  [KNIGHT]: KNIGHT_OFFSETS,
  [BISHOP]: BISHOP_OFFSETS,
  [ROOK]: ROOK_OFFSETS,
  [QUEEN]: KING_OFFSETS,
  [KING]: KING_OFFSETS
};

export const SLIDING: Record<number, boolean> = {
  [BISHOP]: true,
  [ROOK]: true,
  [QUEEN]: true
};

// Moving from or to one of these squares clears the matching castling right.
// Applied as `castling &= MASK[from] & MASK[to]`, which handles both the king
// or rook leaving and the rook being captured on its home square, without
// either case needing to be spelled out.
export const CASTLE_MASK: Uint8Array = (() => {
  const mask = new Uint8Array(128).fill(0xf);
  mask[112] &= ~CASTLE_WQ; // a1
  mask[116] &= ~(CASTLE_WK | CASTLE_WQ); // e1
  mask[119] &= ~CASTLE_WK; // h1
  mask[0] &= ~CASTLE_BQ; // a8
  mask[4] &= ~(CASTLE_BK | CASTLE_BQ); // e8
  mask[7] &= ~CASTLE_BK; // h8
  return mask;
})();

export function makePiece(type: PieceType, color: Color): Piece {
  return type | (color << 3);
}

export function pieceType(p: Piece): PieceType {
  return (p & 7) as PieceType;
}

export function pieceColor(p: Piece): Color {
  return ((p >> 3) & 1) as Color;
}

export function offBoard(sq: number): boolean {
  return (sq & 0x88) !== 0;
}

export function algebraic(sq: number): string {
  return 'abcdefgh'[sq & 15] + String(8 - (sq >> 4));
}

/** -1 for anything that is not a square name. Never throws. */
export function parseSquare(text: string): number {
  if (typeof text !== 'string' || text.length !== 2) return -1;
  const file = text.charCodeAt(0) - 97;
  const rank = 8 - (text.charCodeAt(1) - 48);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return -1;
  return rank * 16 + file;
}

/** Light or dark, as 0 or 1. Used only by the insufficient-material test. */
export function squareShade(sq: number): number {
  return ((sq >> 4) + (sq & 15)) % 2;
}

export interface Move {
  from: number;
  to: number;
  piece: Piece;
  captured: Piece;
  promotion: PieceType | 0;
  flags: number;
}

/** Everything that defines a position, and nothing that defines a game. */
export interface PositionState {
  board: Uint8Array;
  kings: [number, number];
  turn: Color;
  castling: number;
  ep: number;
  halfmove: number;
  fullmove: number;
}
