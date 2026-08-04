// Board rendering and click-to-move.
//
// This layer knows nothing about chains. It is handed a replay state and a
// callback, it draws the position, and when someone completes a move it hands
// back a UCI string. Whether that string goes to a mock chain or a wallet is
// somebody else's problem.

import { algebraic, parseSquare, pieceColor, pieceType, PAWN, QUEEN, ROOK, BISHOP, KNIGHT } from './engine.js';

// Filled glyphs for both sides, coloured by CSS. Mixing the outline and filled
// Unicode sets looks wrong at small sizes because the two have different weights.
const GLYPH = {
  [PAWN]: '♟',
  [KNIGHT]: '♞',
  [BISHOP]: '♝',
  [ROOK]: '♜',
  [QUEEN]: '♛',
  6: '♚'
};

const PROMOTION_CHOICES = [
  { piece: QUEEN, letter: 'q' },
  { piece: ROOK, letter: 'r' },
  { piece: BISHOP, letter: 'b' },
  { piece: KNIGHT, letter: 'n' }
];

export class BoardView {
  /**
   * @param {HTMLElement} root
   * @param {(uci: string) => void} onMove
   */
  constructor(root, onMove) {
    this.root = root;
    this.onMove = onMove;
    this.selected = null;
    this.flipped = false;
    this.interactive = true;
    this.pendingPromotion = null;
    this.state = null;

    this.root.classList.add('board');
    this.root.addEventListener('click', (event) => this._onClick(event));
  }

  setFlipped(flipped) {
    this.flipped = flipped;
    this.render(this.state);
  }

  setInteractive(interactive) {
    this.interactive = interactive;
    this.render(this.state);
  }

  _legalFrom(square) {
    if (!this.state) return [];
    const from = parseSquare(square);
    return this.state.legalMoves.filter((uci) => parseSquare(uci.slice(0, 2)) === from);
  }

  _onClick(event) {
    if (!this.interactive || !this.state) return;

    const promotionButton = event.target.closest('[data-promotion]');
    if (promotionButton) {
      const { from, to } = this.pendingPromotion;
      this.pendingPromotion = null;
      this.selected = null;
      this.onMove(from + to + promotionButton.dataset.promotion);
      this.render(this.state);
      return;
    }

    const cell = event.target.closest('[data-square]');
    if (!cell) return;
    const square = cell.dataset.square;

    if (this.pendingPromotion) {
      this.pendingPromotion = null;
      this.selected = null;
      this.render(this.state);
      return;
    }

    if (this.selected) {
      const candidates = this._legalFrom(this.selected).filter(
        (uci) => uci.slice(2, 4) === square
      );

      if (candidates.length > 1) {
        // Only promotions produce several moves between the same two squares.
        this.pendingPromotion = { from: this.selected, to: square };
        this.render(this.state);
        return;
      }

      if (candidates.length === 1) {
        const uci = candidates[0];
        this.selected = null;
        this.onMove(uci);
        this.render(this.state);
        return;
      }
    }

    // Selecting, or re-selecting a different piece.
    this.selected = this._legalFrom(square).length ? square : null;
    this.render(this.state);
  }

  render(state) {
    this.state = state;
    if (!state) {
      this.root.innerHTML = '';
      return;
    }

    const board = state.chess.board;
    const lastAccepted = state.accepted[state.accepted.length - 1];
    const lastFrom = lastAccepted ? lastAccepted.uci.slice(0, 2) : null;
    const lastTo = lastAccepted ? lastAccepted.uci.slice(2, 4) : null;

    const targets = new Set(
      this.selected ? this._legalFrom(this.selected).map((uci) => uci.slice(2, 4)) : []
    );

    const ranks = this.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const files = this.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

    let checkSquare = null;
    if (state.inCheck) {
      checkSquare = algebraic(state.chess.kings[state.chess.turn]);
    }

    const cells = [];
    for (const rank of ranks) {
      for (const file of files) {
        const index = rank * 16 + file;
        const square = algebraic(index);
        const piece = board[index];

        const classes = ['sq', (rank + file) % 2 === 0 ? 'light' : 'dark'];
        if (square === this.selected) classes.push('selected');
        if (square === lastFrom || square === lastTo) classes.push('last');
        if (square === checkSquare) classes.push('check');
        if (targets.has(square)) classes.push(piece ? 'capture' : 'target');

        const glyph = piece
          ? `<span class="piece ${pieceColor(piece) === 0 ? 'white' : 'black'}">${GLYPH[pieceType(piece)]}</span>`
          : '';

        const coord =
          file === files[0] ? `<span class="coord rank">${8 - rank}</span>` : '';
        const fileCoord =
          rank === ranks[7] ? `<span class="coord file">${'abcdefgh'[file]}</span>` : '';

        cells.push(
          `<div class="${classes.join(' ')}" data-square="${square}">${glyph}${coord}${fileCoord}</div>`
        );
      }
    }

    let overlay = '';
    if (this.pendingPromotion) {
      const color = state.chess.turn === 0 ? 'white' : 'black';
      const buttons = PROMOTION_CHOICES.map(
        (choice) =>
          `<button data-promotion="${choice.letter}" title="${choice.letter.toUpperCase()}">` +
          `<span class="piece ${color}">${GLYPH[choice.piece]}</span></button>`
      ).join('');
      overlay = `<div class="promotion"><div class="promotion-inner"><p>Promote to</p><div class="promotion-choices">${buttons}</div></div></div>`;
    }

    this.root.innerHTML = `<div class="grid">${cells.join('')}</div>${overlay}`;
  }
}

export function statusText(state) {
  if (!state) return '';
  if (state.outcome) {
    const { result, reason, winner } = state.outcome;
    const label = reason.replace(/-/g, ' ');
    return winner ? `${result} — ${winner} wins by ${label}` : `${result} — draw by ${label}`;
  }
  const side = state.turn === 'white' ? 'White' : 'Black';
  return state.inCheck ? `${side} to move, in check` : `${side} to move`;
}

export function shortSender(sender) {
  if (!sender) return '';
  if (sender.length <= 12) return sender;
  return `${sender.slice(0, 5)}…${sender.slice(-4)}`;
}

// A BNS name when the sender owns one, the shortened principal otherwise.
// `names` is a lookup that may not have answered yet, so this has to read well
// in both states.
export function displaySender(sender, names) {
  if (!sender) return { label: '', title: '', named: false };
  const name = names?.get?.(sender);
  if (name) return { label: name, title: `${name} · ${sender}`, named: true };
  return { label: shortSender(sender), title: sender, named: false };
}
