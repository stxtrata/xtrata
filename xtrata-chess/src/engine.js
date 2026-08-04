// A complete, dependency-free chess engine.
//
// This is the referee. The contract stores strings; this file decides what
// those strings mean. Everything downstream (replay, the board, the bots, the
// sealed game) reads the rules from here and nowhere else.
//
// Board representation is 0x88: a 128 entry array where the low nibble is the
// file and the high nibble is the rank, so a square is off the board exactly
// when (sq & 0x88) is non-zero. Index 0 is a8 and index 119 is h1, which means
// White moves toward lower indices.
//
// Correctness is verified by perft in tests/engine.perft.test.js against the
// six standard positions. Do not change move generation without re-running it.

export const WHITE = 0;
export const BLACK = 1;

export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

const EMPTY = 0;

// Flags on a generated move.
const NORMAL = 1;
const CAPTURE = 2;
const BIG_PAWN = 4;
const EP_CAPTURE = 8;
const PROMOTION = 16;
const KSIDE_CASTLE = 32;
const QSIDE_CASTLE = 64;

export const FLAGS = {
  NORMAL,
  CAPTURE,
  BIG_PAWN,
  EP_CAPTURE,
  PROMOTION,
  KSIDE_CASTLE,
  QSIDE_CASTLE
};

const CASTLE_WK = 1;
const CASTLE_WQ = 2;
const CASTLE_BK = 4;
const CASTLE_BQ = 8;

const SYMBOLS = ['', 'p', 'n', 'b', 'r', 'q', 'k'];

const KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33];
const BISHOP_OFFSETS = [-17, -15, 15, 17];
const ROOK_OFFSETS = [-16, -1, 1, 16];
const KING_OFFSETS = [-17, -16, -15, -1, 1, 15, 16, 17];

const OFFSETS = {
  [KNIGHT]: KNIGHT_OFFSETS,
  [BISHOP]: BISHOP_OFFSETS,
  [ROOK]: ROOK_OFFSETS,
  [QUEEN]: KING_OFFSETS,
  [KING]: KING_OFFSETS
};

const SLIDING = { [BISHOP]: true, [ROOK]: true, [QUEEN]: true };

// Moving from or to one of these squares clears the matching castling right.
const CASTLE_MASK = new Uint8Array(128).fill(0xf);
CASTLE_MASK[112] &= ~CASTLE_WQ; // a1
CASTLE_MASK[116] &= ~(CASTLE_WK | CASTLE_WQ); // e1
CASTLE_MASK[119] &= ~CASTLE_WK; // h1
CASTLE_MASK[0] &= ~CASTLE_BQ; // a8
CASTLE_MASK[4] &= ~(CASTLE_BK | CASTLE_BQ); // e8
CASTLE_MASK[7] &= ~CASTLE_BK; // h8

export const START_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function makePiece(type, color) {
  return type | (color << 3);
}

export function pieceType(p) {
  return p & 7;
}

export function pieceColor(p) {
  return (p >> 3) & 1;
}

export function algebraic(sq) {
  return 'abcdefgh'[sq & 15] + (8 - (sq >> 4));
}

export function parseSquare(text) {
  if (typeof text !== 'string' || text.length !== 2) return -1;
  const file = text.charCodeAt(0) - 97;
  const rank = 8 - (text.charCodeAt(1) - 48);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return -1;
  return rank * 16 + file;
}

// Parse a UCI move string. Deliberately lenient about case, because humans
// type these into wallets by hand, and strict about everything else, because
// the format is permanent.
export function parseUci(text) {
  if (typeof text !== 'string') return null;
  const t = text.trim().toLowerCase();
  if (t.length !== 4 && t.length !== 5) return null;
  const from = parseSquare(t.slice(0, 2));
  const to = parseSquare(t.slice(2, 4));
  if (from < 0 || to < 0) return null;
  let promotion = 0;
  if (t.length === 5) {
    const index = 'nbrq'.indexOf(t[4]);
    if (index < 0) return null;
    promotion = [KNIGHT, BISHOP, ROOK, QUEEN][index];
  }
  return { from, to, promotion };
}

export function toUci(move) {
  return (
    algebraic(move.from) +
    algebraic(move.to) +
    (move.flags & PROMOTION ? SYMBOLS[move.promotion] : '')
  );
}

export class Chess {
  constructor(fen = START_FEN) {
    this.load(fen);
  }

  load(fen) {
    const parts = String(fen).trim().split(/\s+/);
    if (parts.length < 4) throw new Error(`bad FEN: ${fen}`);

    this.board = new Uint8Array(128);
    this.kings = [-1, -1];

    const rows = parts[0].split('/');
    if (rows.length !== 8) throw new Error(`bad FEN board: ${fen}`);

    for (let rank = 0; rank < 8; rank++) {
      let file = 0;
      for (const ch of rows[rank]) {
        if (ch >= '1' && ch <= '8') {
          file += Number(ch);
          continue;
        }
        const type = SYMBOLS.indexOf(ch.toLowerCase());
        if (type <= 0) throw new Error(`bad FEN piece: ${ch}`);
        const color = ch === ch.toUpperCase() ? WHITE : BLACK;
        const sq = rank * 16 + file;
        this.board[sq] = makePiece(type, color);
        if (type === KING) this.kings[color] = sq;
        file++;
      }
    }

    this.turn = parts[1] === 'b' ? BLACK : WHITE;

    this.castling = 0;
    if (parts[2].includes('K')) this.castling |= CASTLE_WK;
    if (parts[2].includes('Q')) this.castling |= CASTLE_WQ;
    if (parts[2].includes('k')) this.castling |= CASTLE_BK;
    if (parts[2].includes('q')) this.castling |= CASTLE_BQ;

    this.ep = parts[3] === '-' ? -1 : parseSquare(parts[3]);
    this.halfmove = parts.length > 4 ? Number(parts[4]) || 0 : 0;
    this.fullmove = parts.length > 5 ? Number(parts[5]) || 1 : 1;

    this.stack = [];
    this.sanHistory = [];
    this.keyHistory = [this.positionKey()];
  }

  // ------------------------------------------------------------------
  // Position description
  // ------------------------------------------------------------------

  fenBoard() {
    let out = '';
    for (let rank = 0; rank < 8; rank++) {
      let run = 0;
      for (let file = 0; file < 8; file++) {
        const p = this.board[rank * 16 + file];
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

  castlingString() {
    let out = '';
    if (this.castling & CASTLE_WK) out += 'K';
    if (this.castling & CASTLE_WQ) out += 'Q';
    if (this.castling & CASTLE_BK) out += 'k';
    if (this.castling & CASTLE_BQ) out += 'q';
    return out || '-';
  }

  // The en passant square is only reported when the side to move actually has
  // a pawn placed to capture onto it. This matters for repetition: two
  // positions that differ only by an en passant square nobody can use are the
  // same position under FIDE rules.
  epString() {
    if (this.ep === -1) return '-';
    const offsets = this.turn === WHITE ? [-17, -15] : [17, 15];
    for (const d of offsets) {
      const from = this.ep - d;
      if (from & 0x88) continue;
      const p = this.board[from];
      if (p !== EMPTY && pieceColor(p) === this.turn && pieceType(p) === PAWN) {
        return algebraic(this.ep);
      }
    }
    return '-';
  }

  fen() {
    return [
      this.fenBoard(),
      this.turn === WHITE ? 'w' : 'b',
      this.castlingString(),
      this.epString(),
      this.halfmove,
      this.fullmove
    ].join(' ');
  }

  positionKey() {
    return `${this.fenBoard()} ${this.turn === WHITE ? 'w' : 'b'} ${this.castlingString()} ${this.epString()}`;
  }

  // Squares a8..h1 in reading order, for rendering.
  squares() {
    const out = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const sq = rank * 16 + file;
        const p = this.board[sq];
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
  // Attack detection
  // ------------------------------------------------------------------

  attacked(square, by) {
    const b = this.board;

    // A pawn of colour `by` attacking `square` sits behind it, so the offsets
    // are the reverse of that colour's capture directions.
    const pawnOffsets = by === WHITE ? [15, 17] : [-15, -17];
    for (const d of pawnOffsets) {
      const s = square + d;
      if (s & 0x88) continue;
      const p = b[s];
      if (p !== EMPTY && pieceColor(p) === by && pieceType(p) === PAWN) return true;
    }

    for (const d of KNIGHT_OFFSETS) {
      const s = square + d;
      if (s & 0x88) continue;
      const p = b[s];
      if (p !== EMPTY && pieceColor(p) === by && pieceType(p) === KNIGHT) return true;
    }

    for (const d of KING_OFFSETS) {
      const s = square + d;
      if (s & 0x88) continue;
      const p = b[s];
      if (p !== EMPTY && pieceColor(p) === by && pieceType(p) === KING) return true;
    }

    for (const d of BISHOP_OFFSETS) {
      let s = square + d;
      while (!(s & 0x88)) {
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
      while (!(s & 0x88)) {
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

  inCheck() {
    return this.attacked(this.kings[this.turn], this.turn ^ 1);
  }

  // ------------------------------------------------------------------
  // Move generation
  // ------------------------------------------------------------------

  _pushPawnMoves(list, from, to, flags, captured) {
    const us = this.turn;
    const promoRank = us === WHITE ? 0 : 7;
    if (to >> 4 === promoRank) {
      for (const promotion of [QUEEN, ROOK, BISHOP, KNIGHT]) {
        list.push({
          from,
          to,
          piece: this.board[from],
          captured,
          promotion,
          flags: flags | PROMOTION
        });
      }
      return;
    }
    list.push({ from, to, piece: this.board[from], captured, promotion: 0, flags });
  }

  // Pseudo-legal moves: shaped correctly, but may leave the king in check.
  _pseudoMoves(only = -1) {
    const moves = [];
    const us = this.turn;
    const them = us ^ 1;
    const b = this.board;
    const startRank = us === WHITE ? 6 : 1;
    const push = us === WHITE ? -16 : 16;
    const captures = us === WHITE ? [-17, -15] : [17, 15];

    for (let from = 0; from < 128; from++) {
      if (from & 0x88) {
        from += 7;
        continue;
      }
      if (only >= 0 && from !== only) continue;

      const piece = b[from];
      if (piece === EMPTY || pieceColor(piece) !== us) continue;

      const type = pieceType(piece);

      if (type === PAWN) {
        const one = from + push;
        if (!(one & 0x88) && b[one] === EMPTY) {
          this._pushPawnMoves(moves, from, one, NORMAL, EMPTY);
          const two = from + 2 * push;
          if (from >> 4 === startRank && b[two] === EMPTY) {
            moves.push({
              from,
              to: two,
              piece,
              captured: EMPTY,
              promotion: 0,
              flags: BIG_PAWN
            });
          }
        }
        for (const d of captures) {
          const to = from + d;
          if (to & 0x88) continue;
          const target = b[to];
          if (target !== EMPTY) {
            if (pieceColor(target) === them) {
              this._pushPawnMoves(moves, from, to, CAPTURE, target);
            }
          } else if (to === this.ep) {
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
        while (!(to & 0x88)) {
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
        const kingSide = us === WHITE ? CASTLE_WK : CASTLE_BK;
        const queenSide = us === WHITE ? CASTLE_WQ : CASTLE_BQ;

        if (this.castling & kingSide) {
          const to = from + 2;
          if (
            b[from + 1] === EMPTY &&
            b[to] === EMPTY &&
            !this.attacked(from, them) &&
            !this.attacked(from + 1, them) &&
            !this.attacked(to, them)
          ) {
            moves.push({
              from,
              to,
              piece,
              captured: EMPTY,
              promotion: 0,
              flags: KSIDE_CASTLE
            });
          }
        }

        if (this.castling & queenSide) {
          const to = from - 2;
          if (
            b[from - 1] === EMPTY &&
            b[to] === EMPTY &&
            b[from - 3] === EMPTY &&
            !this.attacked(from, them) &&
            !this.attacked(from - 1, them) &&
            !this.attacked(to, them)
          ) {
            moves.push({
              from,
              to,
              piece,
              captured: EMPTY,
              promotion: 0,
              flags: QSIDE_CASTLE
            });
          }
        }
      }
    }

    return moves;
  }

  // Legal moves. A move is legal when it does not leave its own king attacked.
  moves(only = -1) {
    const us = this.turn;
    const them = us ^ 1;
    const legal = [];
    for (const m of this._pseudoMoves(only)) {
      this._make(m);
      if (!this.attacked(this.kings[us], them)) legal.push(m);
      this._unmake();
    }
    return legal;
  }

  movesUci() {
    return this.moves().map(toUci);
  }

  // ------------------------------------------------------------------
  // Make and unmake
  //
  // These are the hot path for legality filtering and perft, so they do the
  // minimum: no SAN, no repetition bookkeeping. The public move() wraps them.
  // ------------------------------------------------------------------

  _make(m) {
    const us = this.turn;
    const b = this.board;

    this.stack.push({
      move: m,
      turn: this.turn,
      castling: this.castling,
      ep: this.ep,
      halfmove: this.halfmove,
      fullmove: this.fullmove,
      whiteKing: this.kings[0],
      blackKing: this.kings[1]
    });

    b[m.to] = b[m.from];
    b[m.from] = EMPTY;

    if (m.flags & EP_CAPTURE) {
      b[m.to + (us === WHITE ? 16 : -16)] = EMPTY;
    }

    if (m.flags & PROMOTION) {
      b[m.to] = makePiece(m.promotion, us);
    }

    if (pieceType(b[m.to]) === KING) {
      this.kings[us] = m.to;
      if (m.flags & KSIDE_CASTLE) {
        b[m.to - 1] = b[m.to + 1];
        b[m.to + 1] = EMPTY;
      } else if (m.flags & QSIDE_CASTLE) {
        b[m.to + 1] = b[m.to - 2];
        b[m.to - 2] = EMPTY;
      }
    }

    this.castling &= CASTLE_MASK[m.from] & CASTLE_MASK[m.to];
    this.ep = m.flags & BIG_PAWN ? m.from + (us === WHITE ? -16 : 16) : -1;

    if (pieceType(m.piece) === PAWN || m.flags & CAPTURE) this.halfmove = 0;
    else this.halfmove++;

    if (us === BLACK) this.fullmove++;
    this.turn = us ^ 1;
  }

  _unmake() {
    const prior = this.stack.pop();
    if (!prior) return null;

    const m = prior.move;
    this.turn = prior.turn;
    this.castling = prior.castling;
    this.ep = prior.ep;
    this.halfmove = prior.halfmove;
    this.fullmove = prior.fullmove;
    this.kings[0] = prior.whiteKing;
    this.kings[1] = prior.blackKing;

    const b = this.board;
    const us = this.turn;

    b[m.from] = m.piece;
    b[m.to] = EMPTY;

    if (m.flags & EP_CAPTURE) {
      b[m.to + (us === WHITE ? 16 : -16)] = makePiece(PAWN, us ^ 1);
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

  // ------------------------------------------------------------------
  // Standard algebraic notation, for the PGN a sealed game carries
  // ------------------------------------------------------------------

  _san(move, legalBefore) {
    if (move.flags & KSIDE_CASTLE) return 'O-O';
    if (move.flags & QSIDE_CASTLE) return 'O-O-O';

    const type = pieceType(move.piece);
    let san = '';

    if (type !== PAWN) {
      san += SYMBOLS[type].toUpperCase();
      const rivals = legalBefore.filter(
        (o) =>
          o.from !== move.from &&
          o.to === move.to &&
          pieceType(o.piece) === type
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

    if (move.flags & PROMOTION) san += `=${SYMBOLS[move.promotion].toUpperCase()}`;

    return san;
  }

  // ------------------------------------------------------------------
  // Public play
  // ------------------------------------------------------------------

  // Apply a UCI move if it is legal in the current position. Returns the move
  // (with SAN attached) or null. Never throws, because it is fed arbitrary
  // strings straight off the chain.
  moveUci(uci) {
    if (this.isGameOver()) return null;

    const parsed = parseUci(uci);
    if (!parsed) return null;

    const legal = this.moves();
    const match = legal.find((m) => {
      if (m.from !== parsed.from || m.to !== parsed.to) return false;
      // A promotion must name its piece, and a non-promotion must not.
      if (m.flags & PROMOTION) return m.promotion === parsed.promotion;
      return parsed.promotion === 0;
    });
    if (!match) return null;

    let san = this._san(match, legal);
    this._make(match);
    this.keyHistory.push(this.positionKey());

    if (this.inCheck()) san += this.moves().length === 0 ? '#' : '+';
    this.sanHistory.push(san);

    return { ...match, san, uci: toUci(match) };
  }

  undo() {
    if (!this.stack.length) return null;
    this.keyHistory.pop();
    this.sanHistory.pop();
    return this._unmake();
  }

  // ------------------------------------------------------------------
  // Terminal conditions
  // ------------------------------------------------------------------

  isCheckmate() {
    return this.inCheck() && this.moves().length === 0;
  }

  isStalemate() {
    return !this.inCheck() && this.moves().length === 0;
  }

  isFiftyMoveDraw() {
    return this.halfmove >= 100;
  }

  isThreefoldRepetition() {
    const key = this.keyHistory[this.keyHistory.length - 1];
    let count = 0;
    for (const k of this.keyHistory) {
      if (k === key) count++;
      if (count >= 3) return true;
    }
    return false;
  }

  // King versus king, king and minor versus king, and king and bishop versus
  // king and bishop on the same colour. Two knights against a lone king is not
  // included, because mate is reachable there with cooperation.
  isInsufficientMaterial() {
    const bishops = [];
    let knights = 0;
    let others = 0;

    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) {
        sq += 7;
        continue;
      }
      const p = this.board[sq];
      if (p === EMPTY) continue;
      const type = pieceType(p);
      if (type === KING) continue;
      if (type === BISHOP) bishops.push(((sq >> 4) + (sq & 15)) % 2);
      else if (type === KNIGHT) knights++;
      else others++;
    }

    if (others > 0) return false;
    if (knights === 0 && bishops.length === 0) return true;
    if (knights === 1 && bishops.length === 0) return true;
    if (knights === 0 && bishops.length === 1) return true;
    if (knights === 0 && bishops.length === 2 && bishops[0] === bishops[1]) return true;
    return false;
  }

  isDraw() {
    return (
      this.isStalemate() ||
      this.isFiftyMoveDraw() ||
      this.isThreefoldRepetition() ||
      this.isInsufficientMaterial()
    );
  }

  isGameOver() {
    return this.moves().length === 0 || this.isDraw();
  }

  // A short machine-readable reason, or null while the game is live.
  outcome() {
    if (this.isCheckmate()) {
      return {
        result: this.turn === WHITE ? '0-1' : '1-0',
        reason: 'checkmate',
        winner: this.turn === WHITE ? 'black' : 'white'
      };
    }
    if (this.isStalemate()) return { result: '1/2-1/2', reason: 'stalemate', winner: null };
    if (this.isInsufficientMaterial()) {
      return { result: '1/2-1/2', reason: 'insufficient-material', winner: null };
    }
    if (this.isThreefoldRepetition()) {
      return { result: '1/2-1/2', reason: 'threefold-repetition', winner: null };
    }
    if (this.isFiftyMoveDraw()) {
      return { result: '1/2-1/2', reason: 'fifty-move-rule', winner: null };
    }
    return null;
  }

  history() {
    return this.sanHistory.slice();
  }

  pgnMoveText() {
    const parts = [];
    for (let i = 0; i < this.sanHistory.length; i += 2) {
      const number = i / 2 + 1;
      const white = this.sanHistory[i];
      const black = this.sanHistory[i + 1];
      parts.push(black ? `${number}. ${white} ${black}` : `${number}. ${white}`);
    }
    return parts.join(' ');
  }
}

// Node counts of the legal move tree, the standard correctness measure for a
// move generator. Uses the cheap make/unmake path.
export function perft(chess, depth) {
  if (depth === 0) return 1;
  const us = chess.turn;
  const them = us ^ 1;
  let nodes = 0;
  for (const m of chess._pseudoMoves()) {
    chess._make(m);
    if (!chess.attacked(chess.kings[us], them)) {
      nodes += depth === 1 ? 1 : perft(chess, depth - 1);
    }
    chess._unmake();
  }
  return nodes;
}
