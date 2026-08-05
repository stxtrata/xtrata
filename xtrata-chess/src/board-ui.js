// Board rendering and click-to-move.
//
// This layer knows nothing about chains. It is handed a replay state and a
// callback, and when someone completes a move it hands back a UCI string.
// Whether that string goes to a mock chain or a wallet is somebody else's
// problem.
//
// Clicking a destination *stages* a move rather than sending it. On a live board
// every submission costs a fee and opens a wallet, so a stray click should never
// be a transaction. The staged move goes into the input where it can be read,
// edited, or abandoned before anything is signed.

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
    // A move chosen on the board but not yet submitted.
    this.staged = null;
    // A move submitted and waiting for the chain to catch up.
    this.pending = null;
    this.hovered = null;

    this.root.classList.add('board');
    this.root.addEventListener('click', (event) => this._onClick(event));

    // Hovering a piece shows where it could go, before committing to selecting
    // it. On a board where the next click matters, looking should be free.
    this.root.addEventListener('mouseover', (event) => {
      const cell = event.target.closest('[data-square]');
      const square = cell ? cell.dataset.square : null;
      if (square === this.hovered) return;
      this.hovered = square;
      if (!this.selected) this.render(this.state);
    });
    this.root.addEventListener('mouseleave', () => {
      if (this.hovered === null) return;
      this.hovered = null;
      if (!this.selected) this.render(this.state);
    });
  }

  setFlipped(flipped) {
    this.flipped = flipped;
    this.render(this.state);
  }

  setInteractive(interactive) {
    this.interactive = interactive;
    this.render(this.state);
  }

  setStaged(uci) {
    this.staged = uci && uci.length >= 4 ? uci : null;
    this.selected = null;
    this.render(this.state);
  }

  // A move that has been sent but is not in the log yet. Shown ghosted so the
  // board does not appear frozen during the half minute a block takes.
  setPending(uci) {
    this.pending = uci && uci.length >= 4 ? uci : null;
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
      const uci = from + to + promotionButton.dataset.promotion;
      this.pendingPromotion = null;
      this.selected = null;
      this.staged = uci;
      this.onMove(uci);
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
        this.staged = uci;
        // Staged, not sent. The caller decides what to do with it.
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

    // Selecting wins over hovering, so the board does not flicker while the
    // pointer crosses other pieces mid-decision.
    const showFrom = this.selected || (this.interactive ? this.hovered : null);
    const targets = new Set(
      showFrom ? this._legalFrom(showFrom).map((uci) => uci.slice(2, 4)) : []
    );
    const previewing = !this.selected && targets.size > 0;

    const stagedFrom = this.staged ? this.staged.slice(0, 2) : null;
    const stagedTo = this.staged ? this.staged.slice(2, 4) : null;
    const pendingFrom = this.pending ? this.pending.slice(0, 2) : null;
    const pendingTo = this.pending ? this.pending.slice(2, 4) : null;

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
        if (square === showFrom && previewing) classes.push('preview-from');
        if (square === lastFrom || square === lastTo) classes.push('last');
        if (square === checkSquare) classes.push('check');
        if (square === stagedFrom || square === stagedTo) classes.push('staged');
        if (square === pendingFrom || square === pendingTo) classes.push('pending');
        if (targets.has(square)) {
          classes.push(piece ? 'capture' : 'target');
          if (previewing) classes.push('preview');
        }

        let glyph = piece
          ? `<span class="piece ${pieceColor(piece) === 0 ? 'white' : 'black'}">${GLYPH[pieceType(piece)]}</span>`
          : '';

        // Show where the piece is going, so a staged or in-flight move reads as
        // a move rather than two unrelated highlighted squares.
        const ghostFrom = square === stagedTo ? stagedFrom : square === pendingTo ? pendingFrom : null;
        if (!piece && ghostFrom) {
          const source = board[parseSquare(ghostFrom)];
          if (source) {
            glyph =
              `<span class="piece ghost ${pieceColor(source) === 0 ? 'white' : 'black'}">` +
              `${GLYPH[pieceType(source)]}</span>`;
          }
        }

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
