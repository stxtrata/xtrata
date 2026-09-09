// The chess engine's public surface.
//
// This file knows nothing about Stacks, wallets, Xtrata, rankings, sponsorship
// or the DOM, and it must stay that way. It is the referee: the contract stores
// strings, and this decides what those strings mean.
//
// Correctness is established by perft, in tests/perft. Move generation must not
// change without those staying green.

import {
  BISHOP,
  CAPTURE,
  EMPTY,
  KING,
  KNIGHT,
  KSIDE_CASTLE,
  PAWN,
  PROMOTION,
  QSIDE_CASTLE,
  SYMBOLS,
  WHITE,
  algebraic,
  offBoard,
  pieceColor,
  pieceType,
  squareShade
} from './board.js';
import type { Color, Move, PieceType, PositionState } from './board.js';
import { START_FEN, formatFen, parseFen, positionKey } from './fen.js';
import { attacked, inCheck, legalMoves, makeMove, pseudoMoves, unmakeMove } from './moves.js';
import type { Undo } from './moves.js';
import { parseUci, toUci } from './uci.js';

export { START_FEN } from './fen.js';
export * from './board.js';
export { parseUci, toUci } from './uci.js';
export type { ParsedUci } from './uci.js';

export type Result = '1-0' | '0-1' | '1/2-1/2';

export type Termination =
  | 'checkmate'
  | 'stalemate'
  | 'repetition'
  | 'fifty-move'
  | 'insufficient-material';

export interface Outcome {
  result: Result;
  termination: Termination;
  winner: 'white' | 'black' | null;
}

/** A move that was actually played, with everything a reader needs about it. */
export interface PlayedMove extends Move {
  san: string;
  uci: string;
}

export interface RenderSquare {
  square: string;
  index: number;
  piece: { type: PieceType; color: Color } | null;
}

/**
 * A chess position with the history needed to answer "has this repeated".
 *
 * Mutable, because legality filtering and perft make and unmake millions of
 * moves and allocating a position per node would dominate the cost. The
 * functional wrappers at the bottom of this file exist for callers that want
 * value semantics and are not in a hot loop.
 */
export class Position {
  state: PositionState;
  /** Undo records for `applyMove`, deepest last. */
  private stack: Undo[] = [];
  private sanHistory: string[] = [];
  /** One key per position seen, including the starting one. */
  private keyHistory: string[];

  constructor(fen: string = START_FEN) {
    const parsed = parseFen(fen);
    if (!parsed) throw new Error(`bad FEN: ${fen}`);
    this.state = parsed;
    this.keyHistory = [positionKey(this.state)];
  }

  /** Null rather than a throw, for callers holding untrusted input. */
  static tryFrom(fen: string): Position | null {
    return parseFen(fen) ? new Position(fen) : null;
  }

  get turn(): Color {
    return this.state.turn;
  }

  get board(): Uint8Array {
    return this.state.board;
  }

  get halfmove(): number {
    return this.state.halfmove;
  }

  get fullmove(): number {
    return this.state.fullmove;
  }

  fen(): string {
    return formatFen(this.state);
  }

  key(): string {
    return positionKey(this.state);
  }

  /** Squares a8..h1 in reading order, which is how a board is drawn. */
  squares(): RenderSquare[] {
    const out: RenderSquare[] = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const sq = rank * 16 + file;
        const p = this.state.board[sq];
        out.push(
          p === EMPTY
            ? { square: algebraic(sq), index: sq, piece: null }
            : {
                square: algebraic(sq),
                index: sq,
                piece: { type: pieceType(p), color: pieceColor(p) }
              }
        );
      }
    }
    return out;
  }

  // ------------------------------------------------------------------
  // Generation
  // ------------------------------------------------------------------

  moves(only = -1): Move[] {
    return legalMoves(this.state, only);
  }

  movesUci(): string[] {
    return this.moves().map(toUci);
  }

  attacked(square: number, by: Color): boolean {
    return attacked(this.state, square, by);
  }

  inCheck(): boolean {
    return inCheck(this.state);
  }

  // ------------------------------------------------------------------
  // Play
  // ------------------------------------------------------------------

  /**
   * Apply a UCI move if it is legal here. Returns the move, or null.
   *
   * Never throws: it is fed arbitrary strings straight off a public log, where
   * a malformed submission is an ordinary outcome rather than an error.
   */
  applyUci(uci: unknown): PlayedMove | null {
    if (this.isGameOver()) return null;

    const parsed = parseUci(uci);
    if (!parsed) return null;

    const legal = this.moves();
    const match = legal.find((m) => {
      if (m.from !== parsed.from || m.to !== parsed.to) return false;
      // A promotion must name its piece and a non-promotion must not. Accepting
      // `e7e8` for a promotion would mean two different strings producing the
      // same move, and the log would no longer say exactly what was played.
      if (m.flags & PROMOTION) return m.promotion === parsed.promotion;
      return parsed.promotion === 0;
    });
    if (!match) return null;

    let san = this.san(match, legal);
    this.stack.push(makeMove(this.state, match));
    this.keyHistory.push(positionKey(this.state));

    if (this.inCheck()) san += this.moves().length === 0 ? '#' : '+';
    this.sanHistory.push(san);

    return { ...match, san, uci: toUci(match) };
  }

  undo(): Move | null {
    const undo = this.stack.pop();
    if (!undo) return null;
    this.keyHistory.pop();
    this.sanHistory.pop();
    return unmakeMove(this.state, undo);
  }

  /** Standard algebraic notation, for the PGN a sealed game carries. */
  private san(move: Move, legalBefore: Move[]): string {
    if (move.flags & KSIDE_CASTLE) return 'O-O';
    if (move.flags & QSIDE_CASTLE) return 'O-O-O';

    const type = pieceType(move.piece);
    let san = '';

    if (type !== PAWN) {
      san += SYMBOLS[type].toUpperCase();
      const rivals = legalBefore.filter(
        (o) => o.from !== move.from && o.to === move.to && pieceType(o.piece) === type
      );
      if (rivals.length) {
        const sameFile = rivals.some((o) => (o.from & 15) === (move.from & 15));
        const sameRank = rivals.some((o) => o.from >> 4 === move.from >> 4);
        if (!sameFile) san += 'abcdefgh'[move.from & 15];
        else if (!sameRank) san += String(8 - (move.from >> 4));
        else san += algebraic(move.from);
      }
    }

    if (move.flags & CAPTURE) {
      if (type === PAWN) san += 'abcdefgh'[move.from & 15];
      san += 'x';
    }

    san += algebraic(move.to);

    if (move.flags & PROMOTION) san += `=${SYMBOLS[move.promotion as PieceType].toUpperCase()}`;

    return san;
  }

  // ------------------------------------------------------------------
  // Terminal conditions
  //
  // Repetition and the fifty-move rule are AUTOMATIC here, not claimable.
  //
  // Under FIDE both are claims a player makes, and only fivefold repetition and
  // the seventy-five-move rule end a game without one. A claim needs a claimant,
  // a moment, and an arbiter — none of which exist in a log that anyone may
  // append to and everyone replays independently. Making them automatic keeps
  // the result a pure function of the log. This is a protocol choice, frozen in
  // REPLAY-V1.md, not an approximation of FIDE.
  // ------------------------------------------------------------------

  isCheckmate(): boolean {
    return this.inCheck() && this.moves().length === 0;
  }

  isStalemate(): boolean {
    return !this.inCheck() && this.moves().length === 0;
  }

  isFiftyMoveDraw(): boolean {
    return this.state.halfmove >= 100;
  }

  isRepetition(): boolean {
    const key = this.keyHistory[this.keyHistory.length - 1];
    let count = 0;
    for (const k of this.keyHistory) {
      if (k === key) count++;
      if (count >= 3) return true;
    }
    return false;
  }

  /**
   * King versus king, king and one minor versus king, and bishops that all
   * stand on one colour of square.
   *
   * Two knights against a lone king is deliberately excluded: mate is reachable
   * there with cooperation, so the game is not dead.
   */
  isInsufficientMaterial(): boolean {
    const bishopShades: number[] = [];
    let knights = 0;
    let others = 0;

    for (let sq = 0; sq < 128; sq++) {
      if (offBoard(sq)) {
        sq += 7;
        continue;
      }
      const p = this.state.board[sq];
      if (p === EMPTY) continue;
      const type = pieceType(p);
      if (type === KING) continue;
      if (type === BISHOP) bishopShades.push(squareShade(sq));
      else if (type === KNIGHT) knights++;
      else others++;
    }

    if (others > 0) return false;
    if (knights === 0 && bishopShades.length === 0) return true;
    if (knights === 1 && bishopShades.length === 0) return true;
    if (knights === 0 && bishopShades.length === 1) return true;
    if (knights === 0 && bishopShades.length === 2 && bishopShades[0] === bishopShades[1]) {
      return true;
    }
    return false;
  }

  isDraw(): boolean {
    return (
      this.isStalemate() ||
      this.isFiftyMoveDraw() ||
      this.isRepetition() ||
      this.isInsufficientMaterial()
    );
  }

  isGameOver(): boolean {
    return this.moves().length === 0 || this.isDraw();
  }

  /**
   * The result and why, or null while the game is live.
   *
   * The order is fixed and is part of the protocol: a position can satisfy more
   * than one of these at once (mate on the hundredth halfmove, say), and which
   * termination gets recorded must not depend on how the checks happen to be
   * written. Checkmate first, because it ends the game regardless of any
   * counter; then stalemate; then the material and counter draws.
   */
  outcome(): Outcome | null {
    if (this.isCheckmate()) {
      return {
        result: this.state.turn === WHITE ? '0-1' : '1-0',
        termination: 'checkmate',
        winner: this.state.turn === WHITE ? 'black' : 'white'
      };
    }
    if (this.isStalemate()) {
      return { result: '1/2-1/2', termination: 'stalemate', winner: null };
    }
    if (this.isInsufficientMaterial()) {
      return { result: '1/2-1/2', termination: 'insufficient-material', winner: null };
    }
    if (this.isRepetition()) {
      return { result: '1/2-1/2', termination: 'repetition', winner: null };
    }
    if (this.isFiftyMoveDraw()) {
      return { result: '1/2-1/2', termination: 'fifty-move', winner: null };
    }
    return null;
  }

  history(): string[] {
    return this.sanHistory.slice();
  }

  pgnMoveText(): string {
    const parts: string[] = [];
    for (let i = 0; i < this.sanHistory.length; i += 2) {
      const number = i / 2 + 1;
      const white = this.sanHistory[i];
      const black = this.sanHistory[i + 1];
      parts.push(black ? `${number}. ${white} ${black}` : `${number}. ${white}`);
    }
    return parts.join(' ');
  }
}

// ------------------------------------------------------------------
// The pure surface named in the brief.
//
// Thin wrappers over the class. They exist so a caller that wants value
// semantics does not have to know about the mutable hot path, and so the engine
// can be described without reference to an object's lifetime.
// ------------------------------------------------------------------

export function createPosition(fen: string = START_FEN): Position {
  return new Position(fen);
}

export function generateMoves(position: Position): Move[] {
  return position.moves();
}

/** Returns a new position; the one passed in is not touched. */
export function applyMove(position: Position, uci: string): Position | null {
  const next = new Position(position.fen());
  return next.applyUci(uci) ? next : null;
}

export function status(position: Position): {
  turn: 'white' | 'black';
  inCheck: boolean;
  isGameOver: boolean;
  outcome: Outcome | null;
} {
  return {
    turn: position.turn === WHITE ? 'white' : 'black',
    inCheck: position.inCheck(),
    isGameOver: position.isGameOver(),
    outcome: position.outcome()
  };
}

/**
 * Node counts of the legal move tree — the standard correctness measure for a
 * move generator. Uses the cheap make/unmake path and never builds a SAN.
 */
export function perft(position: Position, depth: number): number {
  if (depth === 0) return 1;
  const state = position.state;
  const us = state.turn;
  const them = (us ^ 1) as Color;
  let nodes = 0;
  for (const m of pseudoMoves(state)) {
    const undo = makeMove(state, m);
    if (!attacked(state, state.kings[us], them)) {
      nodes += depth === 1 ? 1 : perft(position, depth - 1);
    }
    unmakeMove(state, undo);
  }
  return nodes;
}

export type { Move, PositionState } from './board.js';
export type { Undo } from './moves.js';
