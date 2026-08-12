// Drawing a board, and clicking a move onto it.
//
// Knows about squares and pieces and nothing else. It is handed a position and
// a set of legal moves; it does not decide legality, does not know what a
// contract is, and does not know that some submissions get skipped.
//
// Glyphs rather than images. An inscription cannot fetch anything, and a sprite
// sheet would cost more permanent bytes than the whole application. WHICH
// glyphs, and how they are sized, is the interesting part - see pieces.ts, and
// the two problems it exists to solve.

import { KING, WHITE, algebraic, parseSquare } from '../chess/board.js';
import { GLYPH, KEY_BY_TYPE, pieceKeyName } from './pieces.js';
import type { Color, PieceType } from '../chess/board.js';
import type { Position } from '../chess/engine.js';

export function pieceName(type: PieceType, color: Color): string {
  const key = KEY_BY_TYPE[type];
  return `${color === WHITE ? 'white' : 'black'} ${key ? pieceKeyName(key) : 'piece'}`;
}

export function pieceGlyph(type: PieceType): string {
  const key = KEY_BY_TYPE[type];
  return key ? GLYPH[key] : '';
}

/**
 * One piece, as an element.
 *
 * The SAME glyph for both colours - colour is what tells them apart, not the
 * codepoint - plus a class carrying that piece's share of the square. Both
 * halves matter: the shared glyph is what stops the two sides disagreeing about
 * size, and the class is what stops a pawn out-measuring a bishop.
 */
export function pieceNode(type: PieceType, color: Color, extra = ''): HTMLElement | null {
  const key = KEY_BY_TYPE[type];
  if (!key) return null;
  const node = document.createElement('span');
  node.className =
    `pc pc--${color === WHITE ? 'white' : 'black'} pc--${key}` + (extra ? ` ${extra}` : '');
  node.textContent = GLYPH[key];
  node.setAttribute('aria-hidden', 'true');
  return node;
}

export interface BoardView {
  position: Position;
  /** UCI strings the board should treat as playable. */
  legalMoves: readonly string[];
  /** Draw from Black's point of view. */
  flipped: boolean;
  /** Origin square currently selected, as a UCI square name, or null. */
  selected: string | null;
  /** Highlight the last accepted move. */
  lastMove: { from: string; to: string } | null;
  /** True when the viewer cannot submit, so squares should not invite a click. */
  readOnly: boolean;
  /**
   * Moves that are broadcast but not in a block.
   *
   * Drawn as a ghost at the destination. This is what stops both players
   * staring at an unchanged board between clicking and confirming, and it is
   * read from the mempool, so the OPPONENT sees it too - not just whoever sent
   * it.
   */
  pending?: readonly PendingMove[];
  /**
   * The move whose wallet dialog is open right now, as "e2e4", or null.
   *
   * Drawn differently from a broadcast one, because they are different: one is
   * a thing that has been sent and one is a thing that has not. A board that
   * showed them identically would be telling somebody their move was on its way
   * while a wallet was still sitting there waiting to be clicked.
   */
  signing?: string | null;
}

export interface PendingMove {
  from: string;
  to: string;
  /** Whose it is, for labelling. */
  sender: string | null;
}

export interface BoardHandlers {
  /** A square was activated. The app decides what that means. */
  onSquare(square: string): void;
}

const FILES = 'abcdefgh';

/**
 * Which squares a click on `from` could reach.
 *
 * Derived from the legal move list rather than recomputed, so the board and the
 * referee cannot disagree about what is playable.
 */
export function destinationsFrom(legalMoves: readonly string[], from: string): Set<string> {
  const out = new Set<string>();
  for (const uci of legalMoves) {
    if (uci.slice(0, 2) === from) out.add(uci.slice(2, 4));
  }
  return out;
}

/**
 * The promotion choices for a from/to pair, or an empty array.
 *
 * A promotion must name its piece, so a board that submitted `e7e8` would have
 * its submission skipped by replay. The app has to ask.
 */
export function promotionChoices(legalMoves: readonly string[], from: string, to: string): string[] {
  return legalMoves
    .filter((uci) => uci.length === 5 && uci.slice(0, 2) === from && uci.slice(2, 4) === to)
    .map((uci) => uci[4]);
}

/**
 * Render into an element.
 *
 * Everything is rebuilt each time. A board is 64 nodes; the complexity of
 * diffing it would buy nothing and would be somewhere for a stale square to
 * hide.
 */
export function renderBoard(root: HTMLElement, view: BoardView, handlers: BoardHandlers): void {
  const squares = view.position.squares();
  const destinations = view.selected
    ? destinationsFrom(view.legalMoves, view.selected)
    : new Set<string>();

  // A source square is one some legal move starts from. Anything else is inert,
  // so a tap on it does not select a piece that cannot move.
  const sources = new Set(view.legalMoves.map((uci) => uci.slice(0, 2)));

  // Where a ghost should appear, and which square the piece is leaving.
  //
  // The origin is drawn EMPTY rather than faded. A pending move is a claim
  // about where a piece is going, and showing the piece in both places at once
  // reads as two pieces - the eye counts material before it reads opacity.
  const ghostTo = new Map<string, { type: PieceType; color: Color }>();
  const ghostFrom = new Set<string>();
  for (const move of view.pending ?? []) {
    ghostFrom.add(move.from);
    const piece = squares.find((cell) => cell.square === move.from)?.piece;
    if (piece) ghostTo.set(move.to, { type: piece.type, color: piece.color });
  }

  // The king that is currently in check, if any.
  //
  // Only the side to move can be in check - a position where the waiting side
  // is in check is not a position, and `parseFen` refuses to build one.
  let checkedKing: string | null = null;
  if (view.position.inCheck()) {
    const turn = view.position.turn;
    checkedKing =
      squares.find((cell) => cell.piece?.type === KING && cell.piece.color === turn)?.square ?? null;
  }

  root.replaceChildren();
  root.setAttribute('role', 'grid');
  root.setAttribute('aria-label', 'chess board');
  root.classList.toggle('board--flipped', view.flipped);

  const ordered = view.flipped ? [...squares].reverse() : squares;

  for (const cell of ordered) {
    const file = FILES.indexOf(cell.square[0]);
    const rank = Number(cell.square[1]);
    // a1 IS DARK. That is the anchor, and it is the whole rule.
    //
    // `file` is 0-indexed and `rank` is the literal digit, so a1 is (0 + 1) and
    // the parity that makes it dark is ODD. This read `=== 0` until 2026-08-12,
    // which inverted all sixty-four squares: a1 came out light, h1 came out dark
    // against "light square on your right", and the queens appeared to be off
    // their own colour, which is how the first testers found it.
    //
    // The pieces were never wrong - perft covers 590 million positions - so
    // nothing but the paint was affected. Do not "tidy" this to `=== 0`; the
    // colour of a1 is asserted in tests/ui/board-colour.test.ts.
    const dark = (file + rank) % 2 === 1;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `sq ${dark ? 'sq--dark' : 'sq--light'}`;
    button.dataset.square = cell.square;
    button.setAttribute('role', 'gridcell');

    if (view.selected === cell.square) button.classList.add('sq--selected');
    if (destinations.has(cell.square)) {
      button.classList.add(cell.piece ? 'sq--capture' : 'sq--target');
    }
    if (view.lastMove && (view.lastMove.from === cell.square || view.lastMove.to === cell.square)) {
      button.classList.add('sq--last');
    }

    // The accessible name carries what a tooltip would have said. `title` does
    // not exist on touch, which is exactly where an explanation is most needed.
    const description = cell.piece
      ? `${cell.square}, ${pieceName(cell.piece.type, cell.piece.color)}${
          checkedKing === cell.square ? ', in check' : ''
        }`
      : cell.square;
    button.setAttribute('aria-label', description);

    if (checkedKing === cell.square) button.classList.add('sq--check');

    // The square a pending move is leaving is marked but drawn empty, so the
    // board reads as "the piece went there" and not "there are two of them".
    const leaving = ghostFrom.has(cell.square);
    if (leaving) button.classList.add('sq--vacated');
    if (view.signing && view.signing.slice(0, 2) === cell.square) {
      button.classList.add('sq--signing');
    }

    if (cell.piece && !leaving) {
      const node = pieceNode(cell.piece.type, cell.piece.color);
      if (node) button.appendChild(node);
    }

    const ghost = ghostTo.get(cell.square);
    if (ghost) {
      // Hollow, not faded. A translucent piece reads as a dim piece; an outline
      // reads as a piece that is not there yet, which is what it is.
      const signing = Boolean(view.signing && view.signing.slice(2, 4) === cell.square);
      const node = pieceNode(
        ghost.type,
        ghost.color,
        `pc--ghost ${signing ? 'pc--signing' : 'pc--sent'}`
      );
      if (node) button.appendChild(node);
      button.classList.add('sq--pending');
      if (signing) {
        button.classList.add('sq--signing');
      }
      // Said in the accessible name too. A ghost is invisible to a screen
      // reader, and "a move is on its way here" is exactly the kind of thing a
      // tooltip cannot carry.
      button.setAttribute('aria-label', `${description}, a move here is pending`);
    }

    const playable =
      !view.readOnly && (sources.has(cell.square) || destinations.has(cell.square));
    button.disabled = !playable;
    if (playable) button.classList.add('sq--playable');

    button.addEventListener('click', () => handlers.onSquare(cell.square));
    root.appendChild(button);
  }
}

/** True when a square name is one of the sixty-four. */
export function isSquare(value: string): boolean {
  return parseSquare(value) >= 0;
}

export { algebraic };
