// UCI move strings, in and out.
//
// UCI rather than algebraic, because algebraic needs disambiguation logic
// (`Nbd2`) to even parse, and the string that goes on chain has to be readable
// by anything. UCI is unambiguous, parses with a small lookup, and still reads
// in a block explorer.
//
// Nothing here throws. Every string it sees came off a public log.

import { BISHOP, KNIGHT, PROMOTION, QUEEN, ROOK, SYMBOLS, algebraic, parseSquare } from './board.js';
import type { Move, PieceType } from './board.js';

export interface ParsedUci {
  from: number;
  to: number;
  promotion: PieceType | 0;
}

/** The promotion letters, in the order UCI writes them. */
const PROMOTION_LETTERS = 'nbrq';
const PROMOTION_TYPES: PieceType[] = [KNIGHT, BISHOP, ROOK, QUEEN];

/**
 * Parse a UCI move, or null.
 *
 * Lenient about case and surrounding whitespace, because people type these into
 * wallets by hand. Strict about everything else, because the format is permanent
 * and a string that parses two ways is a string two readers can disagree about.
 */
export function parseUci(text: unknown): ParsedUci | null {
  if (typeof text !== 'string') return null;
  const t = text.trim().toLowerCase();
  if (t.length !== 4 && t.length !== 5) return null;
  const from = parseSquare(t.slice(0, 2));
  const to = parseSquare(t.slice(2, 4));
  if (from < 0 || to < 0) return null;
  let promotion: PieceType | 0 = 0;
  if (t.length === 5) {
    const index = PROMOTION_LETTERS.indexOf(t[4]);
    if (index < 0) return null;
    promotion = PROMOTION_TYPES[index];
  }
  return { from, to, promotion };
}

export function toUci(move: Move): string {
  return (
    algebraic(move.from) +
    algebraic(move.to) +
    (move.flags & PROMOTION ? SYMBOLS[move.promotion as PieceType] : '')
  );
}
