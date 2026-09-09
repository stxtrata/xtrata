// packages/chess/board.ts
var WHITE = 0;
var BLACK = 1;
var EMPTY = 0;
var PAWN = 1;
var KNIGHT = 2;
var BISHOP = 3;
var ROOK = 4;
var QUEEN = 5;
var KING = 6;
var NORMAL = 1;
var CAPTURE = 2;
var BIG_PAWN = 4;
var EP_CAPTURE = 8;
var PROMOTION = 16;
var KSIDE_CASTLE = 32;
var QSIDE_CASTLE = 64;
var CASTLE_WK = 1;
var CASTLE_WQ = 2;
var CASTLE_BK = 4;
var CASTLE_BQ = 8;
var SYMBOLS = ["", "p", "n", "b", "r", "q", "k"];
var KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33];
var BISHOP_OFFSETS = [-17, -15, 15, 17];
var ROOK_OFFSETS = [-16, -1, 1, 16];
var KING_OFFSETS = [-17, -16, -15, -1, 1, 15, 16, 17];
var OFFSETS = {
  [KNIGHT]: KNIGHT_OFFSETS,
  [BISHOP]: BISHOP_OFFSETS,
  [ROOK]: ROOK_OFFSETS,
  [QUEEN]: KING_OFFSETS,
  [KING]: KING_OFFSETS
};
var SLIDING = {
  [BISHOP]: true,
  [ROOK]: true,
  [QUEEN]: true
};
var CASTLE_MASK = (() => {
  const mask = new Uint8Array(128).fill(15);
  mask[112] &= ~CASTLE_WQ;
  mask[116] &= ~(CASTLE_WK | CASTLE_WQ);
  mask[119] &= ~CASTLE_WK;
  mask[0] &= ~CASTLE_BQ;
  mask[4] &= ~(CASTLE_BK | CASTLE_BQ);
  mask[7] &= ~CASTLE_BK;
  return mask;
})();
function makePiece(type, color) {
  return type | color << 3;
}
function pieceType(p) {
  return p & 7;
}
function pieceColor(p) {
  return p >> 3 & 1;
}
function offBoard(sq) {
  return (sq & 136) !== 0;
}
function algebraic(sq) {
  return "abcdefgh"[sq & 15] + String(8 - (sq >> 4));
}
function parseSquare(text) {
  if (typeof text !== "string" || text.length !== 2) return -1;
  const file = text.charCodeAt(0) - 97;
  const rank = 8 - (text.charCodeAt(1) - 48);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return -1;
  return rank * 16 + file;
}
function squareShade(sq) {
  return ((sq >> 4) + (sq & 15)) % 2;
}

// packages/chess/moves.ts
function attacked(state, square, by) {
  const b = state.board;
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
function inCheck(state) {
  return attacked(state, state.kings[state.turn], state.turn ^ 1);
}
function pushPawnMoves(state, list, from, to, flags, captured) {
  const promoRank = state.turn === WHITE ? 0 : 7;
  if (to >> 4 === promoRank) {
    for (const promotion of [QUEEN, ROOK, BISHOP, KNIGHT]) {
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
function pseudoMoves(state, only = -1) {
  const moves = [];
  const us = state.turn;
  const them = us ^ 1;
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
      if (from !== homeSquare) continue;
      const kingSide = us === WHITE ? CASTLE_WK : CASTLE_BK;
      const queenSide = us === WHITE ? CASTLE_WQ : CASTLE_BQ;
      const rookHere = (sq) => {
        const p = b[sq];
        return p !== EMPTY && pieceColor(p) === us && pieceType(p) === ROOK;
      };
      if (state.castling & kingSide) {
        const to = from + 2;
        if (rookHere(from + 3) && b[from + 1] === EMPTY && b[to] === EMPTY && !attacked(state, from, them) && !attacked(state, from + 1, them) && !attacked(state, to, them)) {
          moves.push({ from, to, piece, captured: EMPTY, promotion: 0, flags: KSIDE_CASTLE });
        }
      }
      if (state.castling & queenSide) {
        const to = from - 2;
        if (rookHere(from - 4) && b[from - 1] === EMPTY && b[to] === EMPTY && b[from - 3] === EMPTY && !attacked(state, from, them) && !attacked(state, from - 1, them) && !attacked(state, to, them)) {
          moves.push({ from, to, piece, captured: EMPTY, promotion: 0, flags: QSIDE_CASTLE });
        }
      }
    }
  }
  return moves;
}
function makeMove(state, m) {
  const us = state.turn;
  const b = state.board;
  const undo = {
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
    b[m.to] = makePiece(m.promotion, us);
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
  state.turn = us ^ 1;
  return undo;
}
function unmakeMove(state, undo) {
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
function legalMoves(state, only = -1) {
  const us = state.turn;
  const them = us ^ 1;
  const out = [];
  for (const m of pseudoMoves(state, only)) {
    const undo = makeMove(state, m);
    if (!attacked(state, state.kings[us], them)) out.push(m);
    unmakeMove(state, undo);
  }
  return out;
}

// packages/chess/fen.ts
var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
function parseFen(fen) {
  if (typeof fen !== "string") return null;
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 4) return null;
  const rows = parts[0].split("/");
  if (rows.length !== 8) return null;
  const board = new Uint8Array(128);
  const kings = [-1, -1];
  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    for (const ch of rows[rank]) {
      if (ch >= "1" && ch <= "8") {
        file += Number(ch);
        continue;
      }
      const type = SYMBOLS.indexOf(ch.toLowerCase());
      if (type <= 0) return null;
      if (file > 7) return null;
      const color = ch === ch.toUpperCase() ? WHITE : BLACK;
      const sq = rank * 16 + file;
      board[sq] = makePiece(type, color);
      if (type === KING) {
        if (kings[color] !== -1) return null;
        kings[color] = sq;
      }
      file++;
    }
    if (file !== 8) return null;
  }
  if (kings[WHITE] === -1 || kings[BLACK] === -1) return null;
  const turn = parts[1] === "b" ? BLACK : WHITE;
  let castling = 0;
  if (parts[2].includes("K")) castling |= CASTLE_WK;
  if (parts[2].includes("Q")) castling |= CASTLE_WQ;
  if (parts[2].includes("k")) castling |= CASTLE_BK;
  if (parts[2].includes("q")) castling |= CASTLE_BQ;
  const ep = parts[3] === "-" ? -1 : parseSquare(parts[3]);
  if (parts[3] !== "-" && ep < 0) return null;
  const halfmove = parts.length > 4 ? Number(parts[4]) || 0 : 0;
  const fullmove = parts.length > 5 ? Number(parts[5]) || 1 : 1;
  if (!Number.isFinite(halfmove) || halfmove < 0) return null;
  if (!Number.isFinite(fullmove) || fullmove < 1) return null;
  const state = { board, kings, turn, castling, ep, halfmove, fullmove };
  const waiting = turn ^ 1;
  if (attacked(state, kings[waiting], turn)) return null;
  return state;
}
function fenBoard(state) {
  let out = "";
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
    if (rank < 7) out += "/";
  }
  return out;
}
function castlingString(state) {
  let out = "";
  if (state.castling & CASTLE_WK) out += "K";
  if (state.castling & CASTLE_WQ) out += "Q";
  if (state.castling & CASTLE_BK) out += "k";
  if (state.castling & CASTLE_BQ) out += "q";
  return out || "-";
}
function epString(state) {
  if (state.ep === -1) return "-";
  const offsets = state.turn === WHITE ? [-17, -15] : [17, 15];
  for (const d of offsets) {
    const from = state.ep - d;
    if (offBoard(from)) continue;
    const p = state.board[from];
    if (p !== EMPTY && pieceColor(p) === state.turn && pieceType(p) === PAWN) {
      return algebraic(state.ep);
    }
  }
  return "-";
}
function formatFen(state) {
  return [
    fenBoard(state),
    state.turn === WHITE ? "w" : "b",
    castlingString(state),
    epString(state),
    state.halfmove,
    state.fullmove
  ].join(" ");
}
function positionKey(state) {
  return `${fenBoard(state)} ${state.turn === WHITE ? "w" : "b"} ${castlingString(state)} ${epString(state)}`;
}

// packages/chess/uci.ts
var PROMOTION_LETTERS = "nbrq";
var PROMOTION_TYPES = [KNIGHT, BISHOP, ROOK, QUEEN];
function parseUci(text) {
  if (typeof text !== "string") return null;
  const t = text.trim().toLowerCase();
  if (t.length !== 4 && t.length !== 5) return null;
  const from = parseSquare(t.slice(0, 2));
  const to = parseSquare(t.slice(2, 4));
  if (from < 0 || to < 0) return null;
  let promotion = 0;
  if (t.length === 5) {
    const index = PROMOTION_LETTERS.indexOf(t[4]);
    if (index < 0) return null;
    promotion = PROMOTION_TYPES[index];
  }
  return { from, to, promotion };
}
function toUci(move) {
  return algebraic(move.from) + algebraic(move.to) + (move.flags & PROMOTION ? SYMBOLS[move.promotion] : "");
}

// packages/chess/engine.ts
var Position = class _Position {
  state;
  /** Undo records for `applyMove`, deepest last. */
  stack = [];
  sanHistory = [];
  /** One key per position seen, including the starting one. */
  keyHistory;
  constructor(fen = START_FEN) {
    const parsed = parseFen(fen);
    if (!parsed) throw new Error(`bad FEN: ${fen}`);
    this.state = parsed;
    this.keyHistory = [positionKey(this.state)];
  }
  /** Null rather than a throw, for callers holding untrusted input. */
  static tryFrom(fen) {
    return parseFen(fen) ? new _Position(fen) : null;
  }
  get turn() {
    return this.state.turn;
  }
  get board() {
    return this.state.board;
  }
  get halfmove() {
    return this.state.halfmove;
  }
  get fullmove() {
    return this.state.fullmove;
  }
  fen() {
    return formatFen(this.state);
  }
  key() {
    return positionKey(this.state);
  }
  /** Squares a8..h1 in reading order, which is how a board is drawn. */
  squares() {
    const out = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const sq = rank * 16 + file;
        const p = this.state.board[sq];
        out.push(
          p === EMPTY ? { square: algebraic(sq), index: sq, piece: null } : {
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
  moves(only = -1) {
    return legalMoves(this.state, only);
  }
  movesUci() {
    return this.moves().map(toUci);
  }
  attacked(square, by) {
    return attacked(this.state, square, by);
  }
  inCheck() {
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
  applyUci(uci) {
    if (this.isGameOver()) return null;
    const parsed = parseUci(uci);
    if (!parsed) return null;
    const legal = this.moves();
    const match = legal.find((m) => {
      if (m.from !== parsed.from || m.to !== parsed.to) return false;
      if (m.flags & PROMOTION) return m.promotion === parsed.promotion;
      return parsed.promotion === 0;
    });
    if (!match) return null;
    let san = this.san(match, legal);
    this.stack.push(makeMove(this.state, match));
    this.keyHistory.push(positionKey(this.state));
    if (this.inCheck()) san += this.moves().length === 0 ? "#" : "+";
    this.sanHistory.push(san);
    return { ...match, san, uci: toUci(match) };
  }
  undo() {
    const undo = this.stack.pop();
    if (!undo) return null;
    this.keyHistory.pop();
    this.sanHistory.pop();
    return unmakeMove(this.state, undo);
  }
  /** Standard algebraic notation, for the PGN a sealed game carries. */
  san(move, legalBefore) {
    if (move.flags & KSIDE_CASTLE) return "O-O";
    if (move.flags & QSIDE_CASTLE) return "O-O-O";
    const type = pieceType(move.piece);
    let san = "";
    if (type !== PAWN) {
      san += SYMBOLS[type].toUpperCase();
      const rivals = legalBefore.filter(
        (o) => o.from !== move.from && o.to === move.to && pieceType(o.piece) === type
      );
      if (rivals.length) {
        const sameFile = rivals.some((o) => (o.from & 15) === (move.from & 15));
        const sameRank = rivals.some((o) => o.from >> 4 === move.from >> 4);
        if (!sameFile) san += "abcdefgh"[move.from & 15];
        else if (!sameRank) san += String(8 - (move.from >> 4));
        else san += algebraic(move.from);
      }
    }
    if (move.flags & CAPTURE) {
      if (type === PAWN) san += "abcdefgh"[move.from & 15];
      san += "x";
    }
    san += algebraic(move.to);
    if (move.flags & PROMOTION) san += `=${SYMBOLS[move.promotion].toUpperCase()}`;
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
  isCheckmate() {
    return this.inCheck() && this.moves().length === 0;
  }
  isStalemate() {
    return !this.inCheck() && this.moves().length === 0;
  }
  isFiftyMoveDraw() {
    return this.state.halfmove >= 100;
  }
  isRepetition() {
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
  isInsufficientMaterial() {
    const bishopShades = [];
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
  isDraw() {
    return this.isStalemate() || this.isFiftyMoveDraw() || this.isRepetition() || this.isInsufficientMaterial();
  }
  isGameOver() {
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
  outcome() {
    if (this.isCheckmate()) {
      return {
        result: this.state.turn === WHITE ? "0-1" : "1-0",
        termination: "checkmate",
        winner: this.state.turn === WHITE ? "black" : "white"
      };
    }
    if (this.isStalemate()) {
      return { result: "1/2-1/2", termination: "stalemate", winner: null };
    }
    if (this.isInsufficientMaterial()) {
      return { result: "1/2-1/2", termination: "insufficient-material", winner: null };
    }
    if (this.isRepetition()) {
      return { result: "1/2-1/2", termination: "repetition", winner: null };
    }
    if (this.isFiftyMoveDraw()) {
      return { result: "1/2-1/2", termination: "fifty-move", winner: null };
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
    return parts.join(" ");
  }
};

// packages/protocol/sha256.ts
var K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var rotr = (x, n) => x >>> n | x << 32 - n;
function sha256(input) {
  const h = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  const bitLength = input.length * 8;
  const padded = new Uint8Array(input.length + 9 + 63 >> 6 << 6);
  padded.set(input);
  padded[input.length] = 128;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 4294967296), false);
  view.setUint32(padded.length - 4, bitLength >>> 0, false);
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ w[i - 15] >>> 3;
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ w[i - 2] >>> 10;
      w[i] = w[i - 16] + s0 + w[i - 7] + s1 >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = e & f ^ ~e & g;
      const temp1 = hh + S1 + ch + K[i] + w[i] >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = a & b ^ a & c ^ b & c;
      const temp2 = S0 + maj >>> 0;
      hh = g;
      g = f;
      f = e;
      e = d + temp1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 >>> 0;
    }
    h[0] = h[0] + a >>> 0;
    h[1] = h[1] + b >>> 0;
    h[2] = h[2] + c >>> 0;
    h[3] = h[3] + d >>> 0;
    h[4] = h[4] + e >>> 0;
    h[5] = h[5] + f >>> 0;
    h[6] = h[6] + g >>> 0;
    h[7] = h[7] + hh >>> 0;
  }
  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) outView.setUint32(i * 4, h[i], false);
  return out;
}
function bytesToHex(bytes) {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}
function hexToBytes(hex) {
  const clean = String(hex).replace(/^0x/i, "");
  if (clean.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean)) {
    throw new Error(`not hex: ${hex}`);
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function sha256Hex(input) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  return bytesToHex(sha256(bytes));
}

// packages/chain/clarity.ts
var C32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
var CV = {
  INT: 0,
  UINT: 1,
  BUFFER: 2,
  TRUE: 3,
  FALSE: 4,
  PRINCIPAL_STANDARD: 5,
  PRINCIPAL_CONTRACT: 6,
  RESPONSE_OK: 7,
  RESPONSE_ERR: 8,
  NONE: 9,
  SOME: 10,
  LIST: 11,
  TUPLE: 12,
  STRING_ASCII: 13,
  STRING_UTF8: 14
};
function c32encode(bytes) {
  let value = 0n;
  for (const byte of bytes) value = value << 8n | BigInt(byte);
  let out = "";
  while (value > 0n) {
    out = C32[Number(value & 31n)] + out;
    value >>= 5n;
  }
  let leadingZeros = 0;
  for (const byte of bytes) {
    if (byte !== 0) break;
    leadingZeros++;
  }
  return "0".repeat(leadingZeros) + out;
}
function c32decode(text) {
  let value = 0n;
  for (const ch of text) {
    const index = C32.indexOf(ch.toUpperCase());
    if (index < 0) throw new Error(`bad c32 character: ${ch}`);
    value = value * 32n + BigInt(index);
  }
  const bytes = [];
  while (value > 0n) {
    bytes.unshift(Number(value & 0xffn));
    value >>= 8n;
  }
  while (bytes.length < 24) bytes.unshift(0);
  return new Uint8Array(bytes);
}
function parseAddress(address) {
  const text = String(address || "").trim().toUpperCase();
  if (!text.startsWith("S") || text.length < 20) throw new Error("not a Stacks address");
  const version = C32.indexOf(text[1]);
  if (version < 0) throw new Error("bad address version");
  const body = c32decode(text.slice(2));
  const hash160 = body.slice(0, 20);
  const checksum = body.slice(20);
  const payload = new Uint8Array(21);
  payload[0] = version;
  payload.set(hash160, 1);
  const expected = sha256(sha256(payload)).slice(0, 4);
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== expected[i]) throw new Error("address checksum does not match");
  }
  return { version, hash160 };
}
function c32address(version, hash160) {
  const payload = new Uint8Array(1 + hash160.length);
  payload[0] = version;
  payload.set(hash160, 1);
  const checksum = sha256(sha256(payload)).slice(0, 4);
  const body = new Uint8Array(hash160.length + 4);
  body.set(hash160);
  body.set(checksum, hash160.length);
  return `S${C32[version]}${c32encode(body)}`;
}
var hexValue = (bytes) => `0x${bytesToHex(bytes)}`;
function serializeUint(value) {
  const out = new Uint8Array(17);
  out[0] = CV.UINT;
  let n = BigInt(value);
  if (n < 0n) throw new Error("a uint cannot be negative");
  for (let i = 16; i >= 1; i--) {
    out[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return hexValue(out);
}
function serializeBool(value) {
  return `0x${(value ? CV.TRUE : CV.FALSE).toString(16).padStart(2, "0")}`;
}
function serializeBuffer(value) {
  const body = typeof value === "string" ? hexToBytes(value) : value;
  const out = new Uint8Array(5 + body.length);
  out[0] = CV.BUFFER;
  new DataView(out.buffer).setUint32(1, body.length);
  out.set(body, 5);
  return hexValue(out);
}
function serializeNone() {
  return `0x${CV.NONE.toString(16).padStart(2, "0")}`;
}
function serializeSome(innerHex) {
  return `0x${CV.SOME.toString(16).padStart(2, "0")}${String(innerHex).replace(/^0x/, "")}`;
}
function serializeStringAscii(value) {
  const body = new TextEncoder().encode(value);
  for (const byte of body) {
    if (byte > 127) throw new Error("string-ascii cannot hold a non-ASCII character");
  }
  const out = new Uint8Array(5 + body.length);
  out[0] = CV.STRING_ASCII;
  new DataView(out.buffer).setUint32(1, body.length);
  out.set(body, 5);
  return hexValue(out);
}
function serializePrincipal(address) {
  const { version, hash160 } = parseAddress(address);
  const out = new Uint8Array(22);
  out[0] = CV.PRINCIPAL_STANDARD;
  out[1] = version;
  out.set(hash160, 2);
  return hexValue(out);
}
function readValue(bytes, cursor, view) {
  const type = bytes[cursor.offset];
  cursor.offset += 1;
  switch (type) {
    case CV.INT:
    case CV.UINT: {
      let value = 0n;
      for (let i = 0; i < 16; i++) value = value << 8n | BigInt(bytes[cursor.offset + i]);
      cursor.offset += 16;
      if (type === CV.INT && value >= 1n << 127n) value -= 1n << 128n;
      return value;
    }
    case CV.BUFFER: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out = bytes.slice(cursor.offset, cursor.offset + length);
      cursor.offset += length;
      return out;
    }
    case CV.TRUE:
      return true;
    case CV.FALSE:
      return false;
    case CV.PRINCIPAL_STANDARD: {
      const version = bytes[cursor.offset];
      const hash2 = bytes.slice(cursor.offset + 1, cursor.offset + 21);
      cursor.offset += 21;
      return c32address(version, hash2);
    }
    case CV.PRINCIPAL_CONTRACT: {
      const version = bytes[cursor.offset];
      const hash2 = bytes.slice(cursor.offset + 1, cursor.offset + 21);
      cursor.offset += 21;
      const nameLength = bytes[cursor.offset];
      cursor.offset += 1;
      const name = new TextDecoder().decode(bytes.slice(cursor.offset, cursor.offset + nameLength));
      cursor.offset += nameLength;
      return `${c32address(version, hash2)}.${name}`;
    }
    case CV.RESPONSE_OK:
      return { ok: true, value: readValue(bytes, cursor, view) };
    case CV.RESPONSE_ERR:
      return { ok: false, value: readValue(bytes, cursor, view) };
    case CV.NONE:
      return null;
    case CV.SOME:
      return readValue(bytes, cursor, view);
    case CV.LIST: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out = [];
      for (let i = 0; i < length; i++) out.push(readValue(bytes, cursor, view));
      return out;
    }
    case CV.TUPLE: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const out = {};
      for (let i = 0; i < length; i++) {
        const nameLength = bytes[cursor.offset];
        cursor.offset += 1;
        const name = new TextDecoder().decode(
          bytes.slice(cursor.offset, cursor.offset + nameLength)
        );
        cursor.offset += nameLength;
        out[name] = readValue(bytes, cursor, view);
      }
      return out;
    }
    case CV.STRING_ASCII:
    case CV.STRING_UTF8: {
      const length = view.getUint32(cursor.offset);
      cursor.offset += 4;
      const text = new TextDecoder().decode(bytes.slice(cursor.offset, cursor.offset + length));
      cursor.offset += length;
      return text;
    }
    default:
      throw new Error(`unsupported Clarity type 0x${(type ?? 0).toString(16)}`);
  }
}
function deserialize(hex) {
  const bytes = hexToBytes(hex);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return readValue(bytes, { offset: 0 }, view);
}

// packages/peer/crypto.ts
function check(ok, message) {
  if (!ok) throw Error(message);
}
var integer = (n, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(n) && Number(n) >= min && Number(n) <= max;
function canonical(value, depth = 0) {
  check(depth <= 24, "Message nesting is too deep");
  if (Array.isArray(value)) return "[" + value.map((v) => canonical(v, depth + 1)).join(",") + "]";
  if (value && typeof value === "object") {
    check(Object.getPrototypeOf(value) === Object.prototype, "Expected plain record");
    const r = value;
    return "{" + Object.keys(r).sort().map((k) => JSON.stringify(k) + ":" + canonical(r[k], depth + 1)).join(",") + "}";
  }
  check(value === null || ["string", "number", "boolean"].includes(typeof value), "Unsupported value");
  if (typeof value === "number") check(integer(value), "Expected nonnegative integer");
  return JSON.stringify(value);
}
var hash = (v) => sha256Hex(canonical(v));
var same = (a, b, why = "Record mismatch") => check(canonical(a) === canonical(b), why);
var raw = (hex) => new Uint8Array(hexToBytes(hex));
var encode = (v) => new TextEncoder().encode(canonical(v));
var pubValid = (key) => typeof key === "string" && /^04[0-9a-f]{128}$/.test(key);
var randomHex = (length = 32) => bytesToHex(crypto.getRandomValues(new Uint8Array(length)));
async function generateKey() {
  check(globalThis.crypto?.subtle, "Peer play needs browser cryptography. Use HTTPS or a trusted local file.");
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  return { public: bytesToHex(new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey))), secret: pair.privateKey };
}
async function sign(payload, key) {
  return { payload, signature: bytesToHex(new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, encode(payload)))) };
}
var publicKeys = /* @__PURE__ */ new Map();
async function publicKey(pub) {
  check(pubValid(pub), "Invalid player key encoding");
  const cached = publicKeys.get(pub);
  if (cached) return cached;
  const key = await crypto.subtle.importKey("raw", raw(pub), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  if (publicKeys.size >= 64) publicKeys.delete(publicKeys.keys().next().value);
  publicKeys.set(pub, key);
  return key;
}
async function verify(signed, pub) {
  check(pubValid(pub) && signed && typeof signed.signature === "string" && /^[0-9a-f]{128}$/.test(signed.signature), "Invalid signature encoding");
  same(Object.keys(signed).sort(), ["payload", "signature"], "Unknown signature fields");
  const key = await publicKey(pub);
  check(await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, key, raw(signed.signature), encode(signed.payload)), "Signature verification failed");
}
function parseBounded(text, max = 2e6) {
  check(new TextEncoder().encode(text).length <= max, "Message is too large");
  let depth = 0, quoted = false, escape = false;
  for (const c of text) {
    if (quoted) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === "[" || c === "{") check(++depth <= 24, "Message nesting is too deep");
    else if (c === "]" || c === "}") depth--;
  }
  return JSON.parse(text);
}

// packages/peer/protocol.ts
var PROTOCOL = "xchess-peer-v1";
var ENGINE = "xchess-engine-v1:2ce32043537e211ff09dec435ae8c9eec89d21e6e71a082fc4ed0a929668bd33";
var RULES = "xchess-automatic-draw-v1";
var MAX_MOVES = 2048;
var MAX_BRANCHES = 8;
var MAX_BYTES = 2e6;
function descriptor(baseMs = 0, incrementMs = 0) {
  return { protocol: PROTOCOL, engine: ENGINE, rules: RULES, algorithm: "P256-SHA256-raw-v1", nonce: randomHex(), initialFen: START_FEN, clock: { baseMs, incrementMs } };
}
function checkDescriptor(d) {
  check(d && d.protocol === PROTOCOL && d.engine === ENGINE && d.rules === RULES && d.algorithm === "P256-SHA256-raw-v1", "Unsupported peer protocol, engine or rules");
  check(/^[0-9a-f]{64}$/.test(d.nonce) && d.initialFen.length <= 100 && Position.tryFrom(d.initialFen), "Invalid initial position or match nonce");
  check(d.clock && integer(d.clock.baseMs, 0, 864e5) && integer(d.clock.incrementMs, 0, 6e4) && (d.clock.baseMs > 0 || d.clock.incrementMs === 0), "Invalid advisory clock");
  same(d, { protocol: PROTOCOL, engine: ENGINE, rules: RULES, algorithm: "P256-SHA256-raw-v1", nonce: d.nonce, initialFen: d.initialFen, clock: { baseMs: d.clock.baseMs, incrementMs: d.clock.incrementMs } }, "Unknown descriptor fields");
}
function checkOpening(o) {
  check(o && (o.kind === "chain" || o.kind === "demo"), "Invalid opening");
  checkDescriptor(o.descriptor);
  check(integer(o.game, 1), "Invalid game number");
  for (const side of ["white", "black"]) {
    const p = o[side];
    check(p && typeof p.address === "string" && pubValid(p.key), "Invalid player key");
    same(p, { address: p.address, key: p.key }, "Unknown player fields");
    if (o.kind === "chain") parseAddress(p.address);
  }
  check(o.white.key !== o.black.key && o.white.address !== o.black.address, "Players must be distinct");
  if (o.kind === "chain") {
    check(["mainnet", "testnet", "devnet"].includes(o.network), "Invalid chain network");
    const [address, name, ...rest] = o.registry.split(".");
    parseAddress(address);
    check(!rest.length && /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(name), "Invalid registry contract");
    for (const address2 of [o.white.address, o.black.address, o.registry.split(".")[0]]) check(o.network === "mainnet" ? address2.startsWith("SP") : address2.startsWith("ST"), "Address and network mismatch");
  } else same([o.network, o.registry, o.game, o.white.address, o.black.address], ["local", "local-demo", 1, "Demo white", "Demo black"], "Invalid local demo identity");
  same(Object.keys(o).sort(), ["kind", "network", "registry", "game", "descriptor", "white", "black"].sort(), "Unknown opening fields");
}
var genesis = (o) => hash([PROTOCOL + "/genesis", hash(o), o.descriptor.initialFen]);
var actorTurn = (p) => p.turn === WHITE ? "white" : "black";
var emptyGame = (opening) => ({ opening, line: { moves: [], resignations: [] }, branches: [] });
async function replayLine(o, line) {
  checkOpening(o);
  await Promise.all([publicKey(o.white.key), publicKey(o.black.key)]);
  check(line && Array.isArray(line.moves) && line.moves.length <= MAX_MOVES && Array.isArray(line.resignations) && line.resignations.length <= 8, "Invalid or excessive game events");
  same(Object.keys(line).sort(), ["moves", "resignations"], "Unknown line fields");
  const match = hash(o), position = new Position(o.descriptor.initialFen), roots = [genesis(o)], fens = [position.fen()];
  const outcomes = [position.outcome()];
  for (let i = 0; i < line.moves.length; i++) {
    const event = line.moves[i], p = event?.payload;
    check(p && p.kind === "move" && (p.actor === "white" || p.actor === "black"), "Invalid move event");
    check(actorTurn(position) === p.actor, "Wrong player to move");
    await verify(event, o[p.actor].key);
    check(typeof p.value === "string" && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(p.value) && position.applyUci(p.value), "Illegal move");
    same(p, { protocol: PROTOCOL, match, sequence: i + 1, previousHash: roots[i], actor: p.actor, kind: "move", value: p.value, resultingPositionHash: hash(position.fen()) }, "Move history commitment mismatch");
    roots.push(hash(p));
    fens.push(position.fen());
    outcomes.push(position.outcome());
  }
  const seen = /* @__PURE__ */ new Set();
  for (const signed of line.resignations) {
    const r = signed?.payload;
    check(r && (r.actor === "white" || r.actor === "black") && integer(r.atSequence, 0, line.moves.length), "Invalid resignation");
    await verify(signed, o[r.actor].key);
    same(r, { protocol: PROTOCOL, match, actor: r.actor, kind: "resignation", atSequence: r.atSequence, atHash: roots[r.atSequence], resultingPositionHash: hash(fens[r.atSequence]) }, "Resignation commitment mismatch");
    check(!outcomes[r.atSequence], "Resignation follows a terminal board");
    check(!seen.has(hash(r)), "Duplicate resignation");
    seen.add(hash(r));
  }
  let result = position.outcome()?.result ?? "*", termination = position.outcome()?.termination ?? null;
  let status = result === "*" ? "unfinished" : "finished";
  if (line.resignations.length) {
    if (line.resignations.length > 1 || line.resignations[0].payload.atSequence !== line.moves.length) {
      status = "disputed";
      result = "*";
      termination = "concurrent-resignation-evidence";
    } else {
      result = line.resignations[0].payload.actor === "white" ? "0-1" : "1-0";
      termination = "resignation";
      status = "finished";
    }
  }
  return { position, roots, fens, summary: { status, root: roots.at(-1), fen: position.fen(), result, termination } };
}
async function replay(game) {
  check(game && Array.isArray(game.branches) && game.branches.length <= MAX_BRANCHES, "Too many conflicting branches");
  same(Object.keys(game).sort(), ["opening", "line", "branches"].sort(), "Unknown game fields");
  check(game.line && [game.line, ...game.branches].reduce((n, l) => n + (Array.isArray(l?.moves) ? l.moves.length : MAX_MOVES + 1), 0) <= MAX_MOVES, "Too many moves across the supplied branches");
  const main = await replayLine(game.opening, game.line);
  const seen = /* @__PURE__ */ new Set([lineHash(game.line)]);
  for (const branch of game.branches) {
    await replayLine(game.opening, branch);
    check(!seen.has(lineHash(branch)) && divergent(game.line, branch), "Invalid duplicate or compatible branch");
    seen.add(lineHash(branch));
  }
  if (game.branches.length) main.summary = { ...main.summary, status: "disputed", result: "*", termination: "conflicting-signed-branches" };
  return main;
}
async function makeMove2(game, actor, value) {
  const r = await replay(game);
  check(r.summary.status === "unfinished", "This game is finished or disputed");
  check(game.line.moves.length < MAX_MOVES, "Move limit reached; save the unfinished game");
  check(actorTurn(r.position) === actor && r.position.applyUci(value), "Illegal move or wrong turn");
  return { protocol: PROTOCOL, match: hash(game.opening), sequence: game.line.moves.length + 1, previousHash: r.summary.root, actor, kind: "move", value, resultingPositionHash: hash(r.position.fen()) };
}
async function makeResignation(game, actor) {
  const r = await replay(game);
  check(r.summary.status === "unfinished", "This game is finished or disputed");
  return { protocol: PROTOCOL, match: hash(game.opening), actor, kind: "resignation", atSequence: game.line.moves.length, atHash: r.summary.root, resultingPositionHash: hash(r.position.fen()) };
}
var lineHash = (line) => hash([line.moves.map((m) => hash(m.payload)), line.resignations.map((r) => hash(r.payload)).sort()]);
function divergent(a, b) {
  return a.moves.slice(0, Math.min(a.moves.length, b.moves.length)).some((m, i) => hash(m.payload) !== hash(b.moves[i].payload));
}
async function merge(a, b) {
  same(a.opening, b.opening, "Message belongs to another game");
  await replay(a);
  await replay(b);
  const result = structuredClone(a);
  for (const incoming of [b.line, ...b.branches]) {
    if (divergent(result.line, incoming)) {
      if (!result.branches.some((l) => lineHash(l) === lineHash(incoming))) result.branches.push(structuredClone(incoming));
    } else {
      const resignations = [...result.line.resignations, ...incoming.resignations];
      const unique = new Map(resignations.map((r) => [hash(r.payload), r]));
      if (incoming.moves.length > result.line.moves.length) result.line.moves = structuredClone(incoming.moves);
      result.line.resignations = [...unique.values()];
    }
  }
  await replay(result);
  return result;
}
async function archive(game) {
  const r = await replay(game);
  return { ...structuredClone(game), format: "xchess-peer-archive-v1", final: r.summary };
}
async function verifyArchive(a, opening) {
  check(a?.format === "xchess-peer-archive-v1", "Unsupported archive format");
  same(Object.keys(a).sort(), ["format", "opening", "line", "branches", "final"].sort(), "Unknown archive fields");
  if (opening) same(a.opening, opening, "Opening differs from chain record");
  const r = await replay({ opening: a.opening, line: a.line, branches: a.branches });
  same(a.final, r.summary, "Claimed result or final position does not match signed evidence");
  return r;
}
async function inviteDemo(d, key) {
  checkDescriptor(d);
  return sign({ format: "xchess-peer-demo-invite-v1", descriptor: d, whiteKey: key.public }, key.secret);
}
async function verifyDemoInvite(invite) {
  check(invite?.payload?.format === "xchess-peer-demo-invite-v1", "Invalid demo invitation");
  checkDescriptor(invite.payload.descriptor);
  same(Object.keys(invite.payload).sort(), ["format", "descriptor", "whiteKey"].sort(), "Unknown invitation fields");
  await verify(invite, invite.payload.whiteKey);
}
async function demoOpening(join) {
  check(join?.payload?.format === "xchess-peer-demo-join-v1", "Invalid demo response");
  same(Object.keys(join.payload).sort(), ["format", "invite", "blackKey"].sort(), "Unknown demo response fields");
  await verifyDemoInvite(join.payload.invite);
  await verify(join, join.payload.blackKey);
  const o = {
    kind: "demo",
    network: "local",
    registry: "local-demo",
    game: 1,
    descriptor: join.payload.invite.payload.descriptor,
    white: { address: "Demo white", key: join.payload.invite.payload.whiteKey },
    black: { address: "Demo black", key: join.payload.blackKey }
  };
  checkOpening(o);
  return o;
}

// packages/chain/read-transport.ts
var ReadQueue = class {
  constructor(width = 3, spacingMs = 0) {
    this.width = width;
    this.spacingMs = spacingMs;
  }
  active = 0;
  pending = [];
  nextStart = 0;
  timer = null;
  run(priority, work) {
    return new Promise((resolve, reject) => {
      this.pending.push({ priority, at: Date.now(), run: () => {
        this.active++;
        work().then(resolve, reject).finally(() => {
          this.active--;
          this.drain();
        });
      } });
      this.drain();
    });
  }
  drain() {
    const weight = { high: 0, auto: 1, low: 2 };
    this.pending.sort((a, b) => (Date.now() - a.at > 5e3 ? -1 : weight[a.priority]) - (Date.now() - b.at > 5e3 ? -1 : weight[b.priority]));
    while (this.active < this.width && this.pending.length) {
      const wait = this.nextStart - Date.now();
      if (wait > 0) {
        if (!this.timer) this.timer = setTimeout(() => {
          this.timer = null;
          this.drain();
        }, wait);
        return;
      }
      this.nextStart = Date.now() + (typeof this.spacingMs === "function" ? this.spacingMs() : this.spacingMs);
      this.pending.shift().run();
    }
  }
};
var cancelledRead = () => new DOMException("The read was cancelled", "AbortError");
async function fetchRead(fetcher, url, init, timeoutMs) {
  if (init?.signal?.aborted) throw cancelledRead();
  const controller = new AbortController();
  let timer;
  let abort = () => {
  };
  const failure = new Promise((_, reject) => {
    abort = () => {
      controller.abort();
      reject(cancelledRead());
    };
    init?.signal?.addEventListener("abort", abort, { once: true });
    timer = setTimeout(() => {
      controller.abort();
      reject(Object.assign(new Error("Chain read deadline exceeded"), { code: "READ_TIMEOUT" }));
    }, timeoutMs);
  });
  try {
    return await Promise.race([failure, (async () => {
      const response = await fetcher(url, { ...init, signal: controller.signal });
      if (typeof response.arrayBuffer !== "function") return response;
      const body = await response.arrayBuffer();
      return new Response(
        [101, 204, 205, 304].includes(response.status) ? null : body,
        { status: response.status, statusText: response.statusText, headers: response.headers }
      );
    })()]);
  } finally {
    clearTimeout(timer);
    init?.signal?.removeEventListener("abort", abort);
  }
}
function retryAfterMs(value, now) {
  if (!value?.trim()) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1e3;
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - now) : null;
}

// packages/chain/endpoint.ts
var PUBLIC_API = {
  // More than one, deliberately. Naming a single commercial host would make
  // that host a permanent dependency of a permanent artefact.
  //
  // Be clear about what this list does and does not buy, because it is easy to
  // read it as more than it is. Measured on 2026-08-08:
  //
  //   * stacks-node-api.mainnet.stacks.co, the entry that used to be second
  //     here, IS DEAD. It does not connect at all. The list had one live host
  //     and looked like it had two.
  //   * api.mainnet.hiro.so, stacks-node-api.stacks.co and api.hiro.so all
  //     answer - and all SHARE ONE RATE-LIMIT BUCKET. Spending the allowance on
  //     one spends it on all three; they 429 together.
  //
  // So this list is insurance against a host being DOWN, and it is no help
  // whatever against a rate limit. The only defence against a rate limit is to
  // ask for less: see POLL_MS and the budget back-off in the application.
  //
  // WHY THE FIRST ENTRY IS SPELLED IN TWO PIECES.
  //
  // The Xtrata runtime rewrites `https://api.<network>.hiro.so` to its own proxy
  // in any text/html it serves. That is reasonable for a URL the page will
  // fetch, and it is a blind find-and-replace, so it also rewrote THIS TABLE -
  // the fallback list whose entire purpose is to survive one host going away.
  //
  // The effect under the runtime was that the served bytes no longer contained
  // the primary public host at all, and since endpointsFor unshifts the proxy on
  // top, entries 0 and 1 both pointed at the proxy and failed together. A list
  // of three had quietly become a list of two, one of which was a duplicate.
  //
  // Splitting the literal defeats the pattern without changing the value. It
  // must stay a `join` and not a `+`: esbuild folds string concatenation back
  // into a single literal, which the rewrite would match again. There is a test
  // over the BUILT file that fails exactly when the minifier changes its mind.
  //
  // This does not cost the operator the rate-limit protection it was added for:
  // underXtrataRuntime() puts the proxy first on its own evidence - the injected
  // script tags - and never depended on the rewritten string.
  mainnet: [
    ["https://api", "mainnet.hiro.so"].join("."),
    "https://stacks-node-api.stacks.co",
    "https://api.hiro.so"
  ],
  testnet: [
    ["https://api", "testnet.hiro.so"].join("."),
    "https://stacks-node-api.testnet.stacks.co"
  ],
  // Empty on purpose, and not an oversight.
  //
  // There is no well-known devnet host: a devnet is somebody's own machine.
  // Writing a default here would put a development address into a permanent
  // artefact, which the serverlessness audit rightly refuses, and it would be a
  // fiction anyway. A devnet user passes an override, which they have to do to
  // reach their own node regardless.
  devnet: []
};
var PROXY_PATH = {
  mainnet: "/hiro/mainnet",
  testnet: "/hiro/testnet",
  devnet: "/hiro/devnet"
};
function underXtrataRuntime(doc) {
  const target = doc ?? globalThis.document;
  if (!target?.querySelectorAll) return false;
  const base = target.querySelector?.("base");
  if (base && String(base.getAttribute("href") ?? "").trim().toLowerCase() === "null") return true;
  for (const script of target.querySelectorAll("script[src]")) {
    const src = String(script.getAttribute("src") || "");
    if (/(^|\/)runtime\/(wallet-shim|url-support|module-bootstrap)\.js/.test(src)) return true;
  }
  return false;
}
var trim = (base) => base.replace(/\/+$/, "");
function endpointsFor(options = {}) {
  const network = options.network ?? "mainnet";
  const override = options.override ?? globalThis.__XCHESS_API__ ?? null;
  if (override) return [trim(String(override))];
  const bases = [];
  if (underXtrataRuntime(options.document)) bases.push(PROXY_PATH[network]);
  bases.push(...PUBLIC_API[network].map(trim));
  return bases;
}
var BUDGET_HEADERS = ["x-ratelimit-remaining-minute", "ratelimit-remaining"];
var BUDGET_NEARLY_GONE = 4;
var COOLDOWN_MS = 12e3;
function makeEndpoint(options = {}) {
  const doFetch = options.fetch ?? globalThis.fetch?.bind(globalThis);
  const bases = endpointsFor(options);
  const now = options.now ?? (() => Date.now());
  let index = 0;
  let remaining = null;
  let coolUntil = 0;
  const queue = new ReadQueue(3, () => options.minIntervalMs ?? (options.fetch ? 0 : bases[index]?.startsWith("/hiro/") ? 250 : 1500));
  const inFlight = /* @__PURE__ */ new Map();
  let preferredAt = 0;
  const PREFER_MS = 6e4;
  const SWEEPS = 3;
  const RETRY_MS = 600;
  const pause = (ms) => new Promise((done) => {
    setTimeout(done, ms);
  });
  const unavailable = (response) => !response || response.status >= 500 || response.status === 429;
  const rateLimitedByHeader = (response) => {
    if (response.headers?.get?.("retry-after") != null) return true;
    for (const header of BUDGET_HEADERS) {
      const raw2 = response.headers?.get?.(header);
      if (raw2 != null && Number(raw2) === 0) return true;
    }
    return false;
  };
  const noteBudget = (response) => {
    for (const header of BUDGET_HEADERS) {
      const raw2 = response.headers?.get?.(header);
      if (raw2 == null) continue;
      const value = Number(raw2);
      if (Number.isFinite(value)) {
        remaining = value;
        return;
      }
    }
  };
  return {
    get base() {
      return bases[index];
    },
    get all() {
      return bases;
    },
    get remaining() {
      return remaining;
    },
    /**
     * One read, across every base, retried.
     *
     * A SWEEP OF THREE HOSTS THAT SHARE ONE RATE-LIMIT BUCKET IS NOT THREE
     * CHANCES. It is one, tried three ways - the comment on `PUBLIC_API` says so
     * - and this used to sweep once and give up. So a single bad moment produced
     * "Could not reach any Stacks endpoint" on a page that was working a second
     * earlier and would work a second later. Reported from a local board while
     * something else on the same address was reading hard.
     *
     * Sweeping again after a pause is the whole fix. The budget refills on a
     * clock, so the second sweep is not the same attempt repeated - it is an
     * attempt under different conditions, which is the only kind worth making.
     *
     * ONLY READS COME THROUGH HERE. A wallet broadcasts through its own
     * provider, so nothing in this retry can resend a transaction.
     */
    async request(path, init, priority = "auto") {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "GET" && !(method === "POST" && path.startsWith("/v2/contracts/call-read/"))) {
        throw new Error("Endpoint accepts chain reads only");
      }
      const headers = init?.headers;
      const pairs = !headers ? [] : Array.isArray(headers) ? headers : typeof headers.entries === "function" ? [...headers.entries()] : Object.entries(headers);
      const key = JSON.stringify([path, method, init?.body ?? null, pairs.map(([k, v]) => [k.toLowerCase(), v]).sort(), init?.credentials ?? "same-origin", init?.cache ?? "default"]);
      const shared = init?.signal ? void 0 : inFlight.get(key);
      const pending = shared ?? queue.run(priority, () => request(path, init));
      if (!shared && !init?.signal) {
        inFlight.set(key, pending);
        void pending.finally(() => {
          if (inFlight.get(key) === pending) inFlight.delete(key);
        }).catch(() => {
        });
      }
      const response = await pending;
      return typeof response.clone === "function" ? response.clone() : response;
    }
  };
  async function request(path, init) {
    if (init?.signal?.aborted) throw cancelledRead();
    if (now() < coolUntil) {
      const error = new Error(
        "this page is rate limited and is waiting rather than asking again. The chain is fine; it will resume on its own in a few seconds."
      );
      error.code = "RATE_LIMITED";
      throw error;
    }
    let lastFailure = null;
    for (let sweep = 1; sweep <= SWEEPS; sweep++) {
      try {
        return await sweepBases(path, init);
      } catch (error) {
        lastFailure = error;
        const code = error.code;
        if (code !== "CHAIN_UNAVAILABLE") throw error;
        if (sweep === SWEEPS) break;
        await pause(RETRY_MS * sweep);
      }
    }
    throw lastFailure;
  }
  async function sweepBases(path, init) {
    {
      if (bases.length === 0) {
        const error2 = new Error(
          "no endpoint configured for this network. Pass an override, or set __XCHESS_API__."
        );
        error2.code = "NO_ENDPOINT";
        throw error2;
      }
      let lastError = null;
      let limited = false;
      let retryMs = COOLDOWN_MS;
      if (index !== 0 && now() - preferredAt >= PREFER_MS) index = 0;
      const started = index;
      for (let n = 0; n < bases.length; n++) {
        const attempt = (started + n) % bases.length;
        const base = bases[attempt];
        try {
          const response = await fetchRead(doFetch, `${base}${path}`, init, options.timeoutMs ?? 15e3);
          noteBudget(response);
          if (!unavailable(response)) {
            if (attempt !== started) {
              options.onFallback?.(bases[started], base);
              index = attempt;
              preferredAt = now();
            }
            return response;
          }
          if (response.status === 429 || rateLimitedByHeader(response)) {
            limited = true;
            retryMs = Math.max(retryMs, retryAfterMs(response.headers?.get?.("retry-after"), now()) ?? 0);
          }
          lastError = new Error(`${base} answered ${response.status}`);
        } catch (error2) {
          if (init?.signal?.aborted || error2?.name === "AbortError") throw cancelledRead();
          lastError = error2;
        }
      }
      index = (started + 1) % bases.length;
      if (!limited && typeof remaining === "number" && remaining <= BUDGET_NEARLY_GONE) {
        limited = true;
      }
      if (limited) {
        coolUntil = Math.max(coolUntil, now() + retryMs);
        const error2 = new Error(
          `every endpoint is rate limiting this address (tried ${bases.length}). The chain is fine. This page has asked too many times in the last minute.`
        );
        error2.code = "RATE_LIMITED";
        throw error2;
      }
      const error = new Error(
        `no Stacks endpoint answered (tried ${bases.length}): ${String(
          lastError?.message ?? lastError
        )}`
      );
      error.code = "CHAIN_UNAVAILABLE";
      throw error;
    }
  }
}

// packages/wallet/postconditions.ts
var REBATE_CEILING = 100000n;

// packages/chain/client.ts
var PAGE_SIZE = 50;
var READ_SENDER = "SP000000000000000000002Q6VF78";
var num = (value) => Number(value);
var big = (value) => BigInt(value);
function toGame(id, row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  const r = row;
  const hash2 = r["rules-hash"];
  return {
    id,
    openedBy: String(r["opened-by"]),
    openedAt: num(r["opened-at"]),
    nextSeq: num(r["next-seq"]),
    rulesHash: hash2 instanceof Uint8Array ? bytesToHex(hash2) : null,
    ranked: r.ranked === true
  };
}
function toEntry(seq, row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  const r = row;
  return {
    seq,
    value: String(r.value),
    sender: String(r.sender),
    height: num(r.height)
  };
}
var LiveChain = class {
  contractAddress;
  contractName;
  network;
  endpoint;
  signer;
  /**
   * Read once and remembered, because a player's session does not change them.
   *
   * "Does not change" is a statement about the READER, not the contract. Both
   * are owner-mutable at any height, so a page that sets one and then reads it
   * back gets the number it already had - which is exactly what the gates page
   * did: it sent a correct `set-sponsorship`, the chain accepted it, and the
   * differ built to verify the change reported the pre-change price and failed.
   *
   * So anything that writes them clears them, and a reader that must not be
   * wrong calls `refreshPrices` first. See `configured` in apps/canary/main.ts.
   */
  openFee;
  price;
  /**
   * Forget both cached prices, so the next read comes from the chain.
   *
   * Cheap and worth calling before any decision that turns on the CURRENT
   * value rather than a session-stable one - verifying a change, or quoting a
   * price for a transaction somebody is about to sign.
   */
  refreshPrices() {
    this.openFee = void 0;
    this.price = void 0;
  }
  constructor(options) {
    if (!options.contractAddress) throw new Error("contractAddress is required");
    if (!options.contractName) throw new Error("contractName is required");
    this.contractAddress = options.contractAddress;
    this.contractName = options.contractName;
    this.network = options.network ?? "mainnet";
    this.endpoint = makeEndpoint(options);
    this.signer = options.signer ?? null;
  }
  get contractId() {
    return `${this.contractAddress}.${this.contractName}`;
  }
  get apiBase() {
    return this.endpoint.base;
  }
  /**
   * The endpoint this chain is using.
   *
   * Exposed so that the name resolver and the block-time resolver talk to the
   * same node, with the same fallback behaviour, rather than each opening their
   * own idea of where the chain is.
   */
  get reader() {
    return this.endpoint;
  }
  activeGame = null;
  prioritizeGame(game) {
    this.activeGame = serializeUint(game);
  }
  async callReadOnly(functionName, args = []) {
    const path = `/v2/contracts/call-read/${this.contractAddress}/${this.contractName}/${functionName}`;
    const response = await this.endpoint.request(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: READ_SENDER, arguments: args })
    }, args[0] === this.activeGame && /^get-(game|entry|page|sponsorship|result-hint)$/.test(functionName) ? "high" : "low");
    if (!response.ok) {
      const error = new Error(`${functionName}: HTTP ${response.status}`);
      error.code = "CHAIN_REFUSED";
      error.status = response.status;
      throw error;
    }
    const body = await response.json();
    if (!body.okay || typeof body.result !== "string") {
      throw new Error(`${functionName}: ${body.cause ?? "read failed"}`);
    }
    return deserialize(body.result);
  }
  async getFormatVersion() {
    return num(await this.callReadOnly("get-format-version"));
  }
  async getGameCount() {
    return num(await this.callReadOnly("get-game-count"));
  }
  async getGame(game) {
    return toGame(game, await this.callReadOnly("get-game", [serializeUint(game)]));
  }
  async getEntry(game, seq) {
    return toEntry(seq, await this.callReadOnly("get-entry", [serializeUint(game), serializeUint(seq)]));
  }
  async getPage(game, start) {
    const page = await this.callReadOnly("get-page", [
      serializeUint(game),
      serializeUint(start)
    ]);
    return page.map((row, index) => toEntry(start + index, row));
  }
  async getAllEntries(game) {
    const out = [];
    let start = 0;
    for (; ; ) {
      const page = await this.getPage(game, start);
      const found = page.filter((entry) => entry !== null);
      out.push(...found);
      if (found.length < PAGE_SIZE) break;
      start += PAGE_SIZE;
    }
    return out;
  }
  async getOpenFee() {
    if (this.openFee === void 0) this.openFee = big(await this.callReadOnly("get-open-fee"));
    return this.openFee;
  }
  async getSponsorPrice() {
    if (!this.price) {
      const row = await this.callReadOnly("get-sponsor-price");
      this.price = {
        bootstrap: big(row.bootstrap),
        liability: big(row.liability),
        margin: big(row.margin),
        total: big(row.total)
      };
    }
    return this.price;
  }
  async getSponsorship(game, who) {
    const row = await this.callReadOnly("get-sponsorship", [
      serializeUint(game),
      serializePrincipal(who)
    ]);
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const r = row;
    return {
      rebatesLeft: big(r["rebates-left"]),
      rebate: big(r.rebate),
      reserved: big(r.reserved),
      expiry: num(r.expiry),
      settled: r.settled === true,
      fundedBy: String(r["funded-by"])
    };
  }
  async getRankedCount() {
    return num(await this.callReadOnly("get-ranked-count"));
  }
  async getRankedGame(index) {
    const value = await this.callReadOnly("get-ranked-game", [serializeUint(index)]);
    return value === null ? null : num(value);
  }
  async getResultHint(game) {
    const row = await this.callReadOnly("get-result-hint", [serializeUint(game)]);
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const r = row;
    return {
      result: String(r.result),
      terminalSeq: num(r["terminal-seq"]),
      claimant: String(r.claimant),
      height: num(r.height)
    };
  }
  async getTotalReserved() {
    return big(await this.callReadOnly("get-total-reserved"));
  }
  /**
   * Submissions in the mempool for this game.
   *
   * Arguments come back as hex, which the local codec decodes, so a pending
   * move is read exactly the same way as one that has landed.
   *
   * Never throws. The mempool is a convenience: a board that broke because a
   * node would not answer this would be worse than one showing nothing pending.
   *
   * It returns `null` rather than `[]` when it could not ask, and the difference
   * is the whole point. All three mainnet hosts share one rate-limit bucket and
   * 429 together, so "no answer" is an ordinary event on a busy board - and
   * reporting it as an empty mempool made a pending move VANISH from a game that
   * was showing it a moment earlier. An empty list is a fact about the chain. A
   * failed read is a fact about us.
   */
  async getPending(game) {
    try {
      const response = await this.endpoint.request(
        `/extended/v1/address/${this.contractId}/mempool?limit=50`
      );
      if (!response.ok) return null;
      const body = await response.json();
      const out = [];
      for (const raw2 of body.results ?? []) {
        const tx = raw2;
        const call = tx.contract_call;
        if (tx.tx_type !== "contract_call" || !call) continue;
        if (call.contract_id !== this.contractId) continue;
        if (call.function_name !== "submit") continue;
        const args = call.function_args ?? [];
        if (args.length < 2) continue;
        try {
          if (Number(deserialize(String(args[0].hex))) !== Number(game)) continue;
          out.push({
            txid: String(tx.tx_id ?? ""),
            sender: String(tx.sender_address ?? ""),
            value: String(deserialize(String(args[1].hex))),
            receivedAt: tx.receipt_time ? tx.receipt_time * 1e3 : null,
            fee: Number(tx.fee_rate) || null,
            // Zero is a real nonce, so this cannot use `|| null`.
            nonce: Number.isFinite(Number(tx.nonce)) ? Number(tx.nonce) : null
          });
        } catch {
        }
      }
      return out.sort((a, b) => (a.receivedAt ?? 0) - (b.receivedAt ?? 0));
    } catch {
      return null;
    }
  }
  async isSolvent() {
    return await this.callReadOnly("is-solvent") === true;
  }
  /**
   * What the owner may take without touching a reserve.
   *
   * Asked of the CONTRACT rather than worked out here from the balance and the
   * reserve. The subtraction looks obvious and would be a second implementation
   * of the solvency rule, which is exactly the kind of copy that drifts - and
   * this is the one number where drifting means paying a sponsorship out from
   * under somebody who has already bought it.
   */
  async getWithdrawable() {
    return big(await this.callReadOnly("get-withdrawable"));
  }
  /**
   * The Stacks chain tip.
   *
   * Read from the node rather than from a contract, because it is the one thing
   * here that is about the CHAIN rather than about this application. An expiry
   * is a block number and means nothing without it.
   */
  async getHeight() {
    const response = await this.endpoint.request("/v2/info");
    if (!response.ok) throw new Error(`could not read the chain tip: ${response.status}`);
    const body = await response.json();
    return Number(body.stacks_tip_height ?? 0);
  }
  // ---- writes ----------------------------------------------------------
  async sign(call) {
    if (!this.signer) {
      const error = new Error("this board is reading only: connect a wallet to play");
      error.code = "NO_SIGNER";
      throw error;
    }
    return this.signer(call);
  }
  rulesArg(rulesHash2) {
    return rulesHash2 ? serializeSome(serializeBuffer(rulesHash2)) : serializeNone();
  }
  async openGame(rulesHash2, ranked) {
    return this.sign({
      functionName: "open-game",
      functionArgs: [this.rulesArg(rulesHash2), serializeBool(ranked)],
      sends: await this.getOpenFee(),
      // The contract pays nobody on a standard open.
      contractSends: 0n
    });
  }
  async openSponsoredGame(rulesHash2, ranked, opponent) {
    const [fee, price] = await Promise.all([this.getOpenFee(), this.getSponsorPrice()]);
    return this.sign({
      functionName: "open-sponsored-game",
      functionArgs: [this.rulesArg(rulesHash2), serializeBool(ranked), serializePrincipal(opponent)],
      sends: fee + price.total,
      // The bootstrap goes OUT of the contract, to the opponent, in this same
      // transaction. Leaving this at zero is what aborted the first real
      // sponsored open on mainnet.
      contractSends: price.bootstrap
    });
  }
  async openSponsoredBoth(rulesHash2, ranked, white, black) {
    const [fee, price] = await Promise.all([this.getOpenFee(), this.getSponsorPrice()]);
    return this.sign({
      functionName: "open-sponsored-both",
      functionArgs: [
        this.rulesArg(rulesHash2),
        serializeBool(ranked),
        serializePrincipal(white),
        serializePrincipal(black)
      ],
      sends: fee + price.total * 2n,
      // Two bootstraps, to two different people.
      contractSends: price.bootstrap * 2n
    });
  }
  /**
   * Submit a string.
   *
   * `receives` is what makes this different from every call the legacy board
   * made. Under a deny-mode post condition EVERY transfer must be covered,
   * including one the CONTRACT makes, so a sponsored player's rebate needs a
   * condition of its own or the transaction aborts. See the wallet layer.
   */
  async submit(game, value, { expectRebate } = {}) {
    return this.sign({
      functionName: "submit",
      functionArgs: [serializeUint(game), serializeStringAscii(value)],
      sends: 0n,
      // NOTHING, unless somebody is actually being paid.
      //
      // A move costs a network fee and not one microSTX more; the contract
      // charges nothing for it. But a post condition covering the rebate made
      // the wallet say "the contract will transfer less than or equal to 0.1
      // STX" on every single move, and a player reading that reasonably fears a
      // charge. It is a ceiling on money moving TOWARDS them and can never take
      // anything from them - and being right about that is no use if the
      // sentence in front of the person says otherwise.
      //
      // Sound because the contract says so: maybe-rebate matches on a
      // Sponsorships entry for (game, sender) and pays nothing at all without
      // one (clar:490). No row, no transfer, so nothing to cover. With zero
      // conditions in deny mode the transaction asserts that NO money moves,
      // which is both the truth and the strongest thing it could say.
      //
      // THE COST, which is real and has been paid before. The board knows the
      // sponsorship of the account named at CONNECT time and cannot know which
      // account the wallet will sign with. If the signer turns out to be
      // sponsored while the board believed otherwise, maybe-rebate pays them,
      // the transfer is uncovered, and the transaction is discarded after the
      // contract has done the work - the player pays the fee and the move does
      // not count. That is ADR-0008's shape and it cost 0.1 STX on mainnet.
      //
      // So the ceiling is still sent whenever a rebate is POSSIBLE, and the
      // hint is only ever a way to say "this one certainly is not". Absent, it
      // means unknown, and unknown keeps the ceiling.
      contractSends: expectRebate === false ? 0n : REBATE_CEILING
    });
  }
  async topUpSponsorship(game, who) {
    const price = await this.getSponsorPrice();
    return this.sign({
      functionName: "top-up-sponsorship",
      functionArgs: [serializeUint(game), serializePrincipal(who)],
      sends: price.liability + price.margin,
      // A top-up does not repay the bootstrap; the wallet already has it.
      contractSends: 0n
    });
  }
  async settleSponsorship(game, who) {
    return this.sign({
      functionName: "settle-sponsorship",
      functionArgs: [serializeUint(game), serializePrincipal(who)],
      sends: 0n,
      // Settlement moves no money at all: it releases a reservation.
      contractSends: 0n
    });
  }
  // ---- owner ------------------------------------------------------------
  //
  // Used by the gates canary and by nothing else in the application. A board a
  // player opens has no reason to be able to call these.
  async setSponsorship(bootstrap, rebate, count, margin) {
    this.refreshPrices();
    return this.sign({
      functionName: "set-sponsorship",
      functionArgs: [
        serializeUint(bootstrap),
        serializeUint(rebate),
        serializeUint(count),
        serializeUint(margin)
      ],
      sends: 0n,
      contractSends: 0n
    });
  }
  async setOpenFee(amount) {
    this.refreshPrices();
    return this.sign({
      functionName: "set-open-fee",
      functionArgs: [serializeUint(amount)],
      sends: 0n,
      contractSends: 0n
    });
  }
  /**
   * Withdraw from the treasury.
   *
   * The contract is the one sending, and possibly to somebody other than the
   * caller. Without a condition covering it, a deny-mode withdrawal aborts on
   * its own transfer.
   */
  async withdraw(amount, to) {
    return this.sign({
      functionName: "withdraw",
      functionArgs: [serializeUint(amount), serializePrincipal(to)],
      sends: 0n,
      contractSends: amount
    });
  }
  async claimResult(game, result, terminalSeq) {
    return this.sign({
      functionName: "claim-result",
      functionArgs: [
        serializeUint(game),
        serializeStringAscii(result),
        serializeUint(terminalSeq)
      ],
      sends: 0n,
      contractSends: 0n
    });
  }
};

// packages/peer/registry.ts
var num2 = (v) => {
  const n = Number(v);
  check(integer(n), "Invalid chain number");
  return n;
};
var buf = (v) => {
  check(v instanceof Uint8Array, "Invalid chain buffer");
  return v;
};
function decodeInvitation(game, raw2) {
  check(raw2 && typeof raw2 === "object" && !Array.isArray(raw2), "Peer game not found");
  const r = raw2;
  check(typeof r.creator === "string" && typeof r.opponent === "string" && typeof r["creator-white"] === "boolean", "Invalid registry identity");
  const text = new TextDecoder("utf-8", { fatal: true }).decode(buf(r.descriptor)), descriptor2 = parseBounded(text, 1024);
  checkDescriptor(descriptor2);
  check(canonical(descriptor2) === text && hash(descriptor2) === bytesToHex(buf(r["descriptor-hash"])), "Descriptor commitment mismatch");
  return { game, creator: r.creator, opponent: r.opponent, creatorWhite: r["creator-white"], creatorKey: bytesToHex(buf(r["creator-key"])), opponentKey: r["opponent-key"] === null ? null : bytesToHex(buf(r["opponent-key"])), descriptor: descriptor2, descriptorHash: hash(descriptor2), openedHeight: num2(r["opened-height"]), joinedHeight: num2(r["joined-height"]) };
}
function openingFrom(registry, network, row) {
  check(row.opponentKey && row.joinedHeight > 0, "The invited opponent has not joined yet");
  const creator = { address: row.creator, key: row.creatorKey }, opponent = { address: row.opponent, key: row.opponentKey };
  const opening = { kind: "chain", registry, network, game: row.game, descriptor: row.descriptor, white: row.creatorWhite ? creator : opponent, black: row.creatorWhite ? opponent : creator };
  checkOpening(opening);
  return opening;
}
function createArgs(opponent, white, key, descriptor2) {
  checkDescriptor(descriptor2);
  const bytes = encode(descriptor2);
  check(bytes.length <= 1024, "Opening settings are too large");
  return [serializePrincipal(opponent), serializeBool(white), serializeBuffer(key), serializeBuffer(bytes)];
}
var joinArgs = (row, key) => [serializeUint(row.game), serializeBuffer(row.descriptorHash), serializeBuffer(key)];
var PeerRegistry = class {
  constructor(registry, network, api) {
    this.registry = registry;
    this.network = network;
    const [contractAddress, contractName, ...extra] = registry.split(".");
    serializePrincipal(contractAddress);
    check(!extra.length && /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(contractName), "Enter a deployed peer registry contract");
    this.chain = new LiveChain({ contractAddress, contractName, network, override: api });
  }
  chain;
  async game(id) {
    check(integer(id, 1), "Invalid game number");
    check(await this.chain.callReadOnly("get-peer-format") === 1n, "Unsupported peer registry");
    return decodeInvitation(id, await this.chain.callReadOnly("get-peer-game", [serializeUint(id)]));
  }
  async confirmed(id) {
    const row = await this.game(id), opening = openingFrom(this.registry, this.network, row);
    const res = await this.chain.reader.request("/v2/info");
    check(res.ok, "Unable to check confirmations");
    const tip = await res.json();
    check(integer(tip.stacks_tip_height) && tip.stacks_tip_height >= row.joinedHeight + 2, "Waiting for two additional registry confirmations");
    return opening;
  }
  async resolve(text) {
    if (/^[1-9][0-9]{0,14}$/.test(text)) return Number(text);
    check(/^(0x)?[0-9a-fA-F]{64}$/.test(text), "Enter a peer game number or setup transaction ID");
    const response = await this.chain.reader.request("/extended/v1/tx/" + (text.startsWith("0x") ? text : "0x" + text));
    check(response.ok, "Transaction is not available yet; do not resubmit automatically");
    const tx = await response.json();
    check(tx.tx_status === "success", `Setup transaction is ${tx.tx_status}; check your wallet before retrying`);
    check(tx.contract_call?.contract_id === this.registry && ["create-peer-game", "join-peer-game"].includes(tx.contract_call.function_name), "This is not a setup transaction for this registry");
    const result = deserialize(tx.tx_result?.hex ?? "");
    check(result.ok && typeof result.value === "bigint", "Invalid setup result");
    return num2(result.value);
  }
};

// packages/chain/xtrata.ts
var XTRATA = {
  mainnet: { address: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", name: "xtrata-v3-2-3" },
  testnet: { address: "ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", name: "xtrata-v3-2-3" }
};
var ASSET_NAME = "xtrata-inscription";
var MAX_CHUNKS = 4;
var READ_SENDER2 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X";
var XtrataReader = class {
  endpoint;
  contract;
  maxChunks;
  // An inscription is immutable and sealed, so anything read from one is true
  // forever. Caching it is not an optimisation with a staleness risk attached,
  // which is unusual enough here to be worth saying.
  texts = /* @__PURE__ */ new Map();
  metas = /* @__PURE__ */ new Map();
  heights = /* @__PURE__ */ new Map();
  constructor(options = {}) {
    const network = options.network ?? "mainnet";
    this.endpoint = options.endpoint ?? makeEndpoint(options);
    this.contract = XTRATA[network] ?? XTRATA.mainnet;
    this.maxChunks = options.maxChunks ?? MAX_CHUNKS;
  }
  async read(fn, args = []) {
    const path = `/v2/contracts/call-read/${this.contract.address}/${this.contract.name}/${fn}`;
    const response = await this.endpoint.request(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: READ_SENDER2, arguments: args })
    });
    if (!response.ok) return null;
    const body = await response.json();
    if (!body.okay || typeof body.result !== "string") return null;
    return deserialize(body.result);
  }
  /**
   * The whole inscription, as text.
   *
   * Chunks are fetched one at a time rather than through `get-chunk-batch`.
   * That is slower and it is what the endpoint's rate limiting is shaped for:
   * a batch is one request that either works or 429s as a unit, and for a
   * document of one to four chunks the saving is a round trip nobody notices.
   */
  async text(id) {
    const cached = this.texts.get(id);
    if (cached !== void 0) return cached;
    const count = unwrap(await this.read("get-inscription-chunks", [serializeUint(id)]));
    const total = typeof count === "bigint" ? Number(count) : null;
    if (total === null || total < 1) return this.remember(id, null);
    if (total > this.maxChunks) return this.remember(id, null);
    const parts = [];
    for (let index = 0; index < total; index++) {
      const chunk = unwrap(await this.read("get-chunk", [serializeUint(id), serializeUint(index)]));
      if (!(chunk instanceof Uint8Array)) return this.remember(id, null);
      parts.push(chunk);
    }
    let size = 0;
    for (const part of parts) size += part.length;
    const joined = new Uint8Array(size);
    let at = 0;
    for (const part of parts) {
      joined.set(part, at);
      at += part.length;
    }
    return this.remember(id, new TextDecoder().decode(joined));
  }
  remember(id, text) {
    this.texts.set(id, text);
    return text;
  }
  /** Inscription ids this one declares. Empty when it declares none, never null. */
  async dependencies(id) {
    const value = unwrap(await this.read("get-dependencies", [serializeUint(id)]));
    if (!Array.isArray(value)) return [];
    return value.filter((v) => typeof v === "bigint").map(Number);
  }
  /**
   * Everything the contract keeps about an inscription, in one read.
   *
   * WHY THIS IS ONE CALL AND NOT FOUR. `get-inscription-meta` returns creator,
   * owner, mime type, size, chunk count and sealed together. A picture needs
   * three of those to be judged — is it an image, does that wallet hold it, how
   * big is it — and asking separately would be three round trips for facts the
   * contract hands over at once.
   *
   * It is also what makes a holdings scan affordable. Finding a manifest used to
   * mean reading the full TEXT of every candidate, which is one chunk read for a
   * manifest and twenty-eight for a 443 KB image. This says what a candidate IS
   * before any of it is fetched.
   *
   * Null means "could not tell", never an absence — the distinction `PlayerNames`
   * learned the hard way, where a failed read that reports nothing found is
   * indistinguishable from a real nothing and gets remembered as one.
   */
  async meta(id) {
    const cached = this.metas.get(id);
    if (cached !== void 0) return cached;
    const value = unwrap(await this.read("get-inscription-meta", [serializeUint(id)]));
    if (!value || typeof value !== "object" || Array.isArray(value) || value instanceof Uint8Array) {
      return null;
    }
    const row = value;
    const str = (key) => typeof row[key] === "string" ? row[key] : null;
    const num3 = (key) => typeof row[key] === "bigint" ? Number(row[key]) : null;
    const meta = {
      creator: str("creator"),
      // Read once and cached with the rest, so it answers "who held it when
      // this was first seen" and NOT "who holds it now". Anything that needs
      // the second question must call `owner`, which is why that exists.
      owner: str("owner"),
      mime: str("mime-type"),
      size: num3("total-size"),
      chunks: num3("total-chunks"),
      sealed: row.sealed === true
    };
    if (meta.creator === null && meta.mime === null) return null;
    this.metas.set(id, meta);
    return meta;
  }
  /**
   * Who holds it NOW, deliberately uncached.
   *
   * ATTESTATION IS PERMANENT AND HOLDING IS NOT. A manifest signed by the key it
   * names says what it said for ever, and the NFT it points at can be sold the
   * next day. So a board that shows a picture on the strength of somebody
   * holding it has to ask again rather than remember — the alternative is
   * repeating an unchecked claim about the one part of the screen a person
   * chose about themselves.
   *
   * Split from `meta` for that reason alone: everything there is fixed at mint,
   * and this is not.
   */
  async owner(id) {
    const value = unwrap(await this.read("get-owner", [serializeUint(id)]));
    return typeof value === "string" ? value : null;
  }
  /** Who made it. Same creator across a revision chain is the ownership proof. */
  async creator(id) {
    const value = unwrap(await this.read("get-inscription-creator", [serializeUint(id)]));
    return typeof value === "string" ? value : null;
  }
  /**
   * The block an inscription was minted in, or null.
   *
   * THE ONE THING XTRATA DOES NOT KEEP, so this is the Stacks API and not the
   * contract. Three hops, and each is needed:
   *
   *   1. the NFT mint event for this token id
   *   2. that event's tx_id — `block_height` is NOT populated on the event
   *   3. the transaction, which does carry the height
   *
   * Null means "could not tell", never "recent". `provenance()` treats null as
   * unchecked and says so rather than guessing, because guessing here would
   * present a retrospective claim as a commitment.
   */
  async mintedAt(id) {
    const cached = this.heights.get(id);
    if (cached !== void 0) return cached;
    const asset = `${this.contract.address}.${this.contract.name}::${ASSET_NAME}`;
    const value = serializeUint(id);
    const history = await this.endpoint.request(
      `/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(asset)}&value=${value}&limit=1`
    );
    if (!history.ok) return this.rememberHeight(id, null);
    const events = await history.json();
    const txid = events.results?.[0]?.tx_id;
    if (typeof txid !== "string") return this.rememberHeight(id, null);
    const tx = await this.endpoint.request(`/extended/v1/tx/${txid}`);
    if (!tx.ok) return this.rememberHeight(id, null);
    const row = await tx.json();
    if (row.tx_status !== "success" || typeof row.block_height !== "number") {
      return this.rememberHeight(id, null);
    }
    return this.rememberHeight(id, row.block_height);
  }
  rememberHeight(id, height) {
    this.heights.set(id, height);
    return height;
  }
};
function unwrap(value) {
  let at = value;
  for (let step = 0; step < 4 && at !== null; step++) {
    if (typeof at === "object" && !Array.isArray(at) && !(at instanceof Uint8Array)) {
      const record = at;
      if ("okay" in record && record.okay === false) return null;
      if ("value" in record) {
        at = record.value ?? null;
        continue;
      }
    }
    return at;
  }
  return at;
}

// packages/protocol/versions.ts
var RULES_PROTOCOL = "rules-v1";
var REPLAY_PROTOCOL = "replay-v1";
var REPLAY_PROTOCOL_V2 = "replay-v2";
var REPLAY_PROTOCOLS = [REPLAY_PROTOCOL, REPLAY_PROTOCOL_V2];
var EVENTS_PROTOCOL = "events-v1";
var EVENTS_NONE = "events-none";

// packages/protocol/canonical.ts
var PRINCIPAL_PATTERN = /^S[0-9A-HJKMNP-TV-Z]{5,}$/;
var ANYONE = "anyone";
var ANYONE_ELSE = "anyone-else";
var FIRST_MOVER = "first-mover";
var FEN_PATTERN = /^[a-zA-Z0-9/ -]+$/;
var PROTOCOL_PATTERN = /^[a-z0-9-]+$/;
var CanonicalError = class extends Error {
  field;
  constructor(field, message) {
    super(`${field}: ${message}`);
    this.field = field;
    this.name = "CanonicalError";
  }
};
function checkSide(field, value) {
  if (value === ANYONE || value === ANYONE_ELSE || value === FIRST_MOVER) return value;
  if (PRINCIPAL_PATTERN.test(value)) return value;
  throw new CanonicalError(
    field,
    `"${value}" is not a Stacks principal, nor "${ANYONE}", "${ANYONE_ELSE}" or "${FIRST_MOVER}". A BNS name must be resolved to an address before it is hashed.`
  );
}
function checkProtocol(field, value) {
  if (!PROTOCOL_PATTERN.test(value)) {
    throw new CanonicalError(field, `"${value}" is not a protocol identifier`);
  }
  return value;
}
function checkCount(field, value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new CanonicalError(field, `${value} is not a whole number of moves`);
  }
  return String(value);
}
var flag = (value) => value ? "1" : "0";
function canonicalRules(rules) {
  const fields = [
    RULES_PROTOCOL,
    checkProtocol("replayProtocol", rules.replayProtocol ?? REPLAY_PROTOCOL),
    checkProtocol("eventsProtocol", rules.eventsProtocol ?? EVENTS_PROTOCOL),
    checkSide("white", rules.white),
    checkSide("black", rules.black)
  ];
  const allow = [...rules.allow];
  for (const entry of allow) {
    if (!PRINCIPAL_PATTERN.test(entry)) {
      throw new CanonicalError("allow", `"${entry}" is not a Stacks principal`);
    }
  }
  const sorted = [...new Set(allow)].sort();
  if (sorted.length !== allow.length) {
    throw new CanonicalError("allow", "contains a duplicate");
  }
  fields.push(sorted.join(","));
  fields.push(checkCount("cooldown", rules.cooldown));
  fields.push(flag(rules.noConsecutive));
  fields.push(flag(rules.ranked));
  if (!FEN_PATTERN.test(rules.startFen)) {
    throw new CanonicalError("startFen", "contains a character that is not part of FEN");
  }
  fields.push(rules.startFen);
  return fields.join("\n");
}
function canonicalBytes(rules) {
  return new TextEncoder().encode(canonicalRules(rules));
}
function rulesHash(rules) {
  return bytesToHex(sha256(canonicalBytes(rules)));
}

// packages/protocol/rules.ts
var DEFAULT_RULES = {
  replayProtocol: REPLAY_PROTOCOL,
  eventsProtocol: EVENTS_PROTOCOL,
  white: ANYONE,
  black: ANYONE,
  allow: [],
  cooldown: 0,
  noConsecutive: false,
  ranked: false,
  startFen: START_FEN
};
var REJECTED_BY_RULE = {
  NOT_ALLOWED: "not-allowed",
  WRONG_PLAYER: "wrong-player",
  CONSECUTIVE: "consecutive",
  COOLDOWN: "cooldown"
};
function normaliseRules(input) {
  const source = input && typeof input === "object" ? input : {};
  const side = (value) => {
    if (typeof value !== "string") return ANYONE;
    const trimmed = value.trim();
    if (trimmed === "") return ANYONE;
    const lowered = trimmed.toLowerCase();
    if (lowered === ANYONE) return ANYONE;
    if (lowered === ANYONE_ELSE) return ANYONE_ELSE;
    if (lowered === FIRST_MOVER) return FIRST_MOVER;
    return trimmed.toUpperCase();
  };
  const allow = Array.isArray(source.allow) ? [...new Set(source.allow.map((v) => String(v).trim().toUpperCase()).filter(Boolean))].sort() : [];
  const rawCooldown = Number(source.cooldown);
  const cooldown = Number.isFinite(rawCooldown) ? Math.max(0, Math.floor(rawCooldown)) : 0;
  const text = (value, fallback) => typeof value === "string" && value.trim() ? value.trim() : fallback;
  const white = side(source.white);
  const black = side(source.black);
  return {
    // DERIVED FROM THE SIDES, not taken from the source.
    //
    // A game that uses `first-mover` is played under replay-v2 whatever it was
    // handed, because the keyword IS the difference between the two protocols.
    // Letting a caller pass v1 alongside it would produce a rule set that hashes
    // to a commitment no board could honour: v1 boards would read the keyword as
    // a principal nobody holds and skip every move.
    replayProtocol: white === FIRST_MOVER || black === FIRST_MOVER ? REPLAY_PROTOCOL_V2 : text(source.replayProtocol, REPLAY_PROTOCOL),
    eventsProtocol: text(source.eventsProtocol, EVENTS_PROTOCOL),
    white,
    black,
    allow,
    cooldown,
    noConsecutive: source.noConsecutive === true,
    ranked: source.ranked === true,
    startFen: text(source.startFen, START_FEN)
  };
}
function claimedBy(colour, history) {
  for (const entry of history) {
    if (entry.color !== colour) continue;
    const who = String(entry.sender ?? "").trim().toUpperCase();
    if (who) return who;
  }
  return null;
}
function holderOf(side, colour, history) {
  if (side === FIRST_MOVER) return claimedBy(colour, history);
  if (side === ANYONE || side === ANYONE_ELSE) return null;
  return side;
}
function checkSender(rules, ctx) {
  const from = String(ctx.sender ?? "").toUpperCase();
  if (rules.allow.length && !rules.allow.includes(from)) {
    return REJECTED_BY_RULE.NOT_ALLOWED;
  }
  const other = ctx.turn === "white" ? "black" : "white";
  const bound = ctx.turn === "white" ? rules.white : rules.black;
  const opposite = ctx.turn === "white" ? rules.black : rules.white;
  if (bound === FIRST_MOVER) {
    const holder = claimedBy(ctx.turn, ctx.history);
    if (holder) {
      if (from !== holder) return REJECTED_BY_RULE.WRONG_PLAYER;
    } else {
      const rival = holderOf(opposite, other, ctx.history);
      if (rival && from === rival) return REJECTED_BY_RULE.WRONG_PLAYER;
    }
  } else if (bound === ANYONE_ELSE) {
    const rival = holderOf(opposite, other, ctx.history);
    if (rival && from === rival) return REJECTED_BY_RULE.WRONG_PLAYER;
  } else if (bound !== ANYONE && from !== bound) {
    return REJECTED_BY_RULE.WRONG_PLAYER;
  }
  if (rules.noConsecutive && ctx.history.length) {
    const last = ctx.history[ctx.history.length - 1];
    if (last.sender && last.sender === ctx.sender) return REJECTED_BY_RULE.CONSECUTIVE;
  }
  if (rules.cooldown > 0) {
    for (let i = ctx.history.length - 1; i >= 0; i--) {
      if (ctx.history[i].sender !== ctx.sender) continue;
      const movesSince = ctx.history.length - 1 - i;
      if (movesSince < rules.cooldown) return REJECTED_BY_RULE.COOLDOWN;
      break;
    }
  }
  return null;
}

// packages/replay/events.ts
var EVENT_STRINGS = {
  /** The sender resigns. The other side wins. */
  RESIGN: "resgn",
  /** The sender offers a draw. */
  DRAW_OFFER: "draw?",
  /** The sender accepts the offer standing against them. */
  DRAW_ACCEPT: "draw!"
};
var BY_STRING = {
  [EVENT_STRINGS.RESIGN]: "resign",
  [EVENT_STRINGS.DRAW_OFFER]: "draw-offer",
  [EVENT_STRINGS.DRAW_ACCEPT]: "draw-accept"
};
var ALL_EVENT_STRINGS = Object.values(EVENT_STRINGS);
function parseEvent(mv) {
  if (typeof mv !== "string") return null;
  return BY_STRING[mv] ?? null;
}
function sideOf(rules, sender) {
  const from = String(sender ?? "").toUpperCase();
  if (!from) return null;
  if (rules.white === from) return "white";
  if (rules.black === from) return "black";
  return null;
}

// packages/replay/result.ts
var REJECTED = {
  /** Neither a legal UCI move string nor a known control string. */
  MALFORMED: "malformed",
  /** A well-formed move whose origin square is empty. */
  EMPTY_SQUARE: "empty-square",
  /** A well-formed move for a piece belonging to the side not to move. */
  WRONG_TURN: "wrong-turn",
  /** A well-formed move that is simply not legal here. */
  ILLEGAL: "illegal",
  /** Anything at all after the game has ended. */
  GAME_OVER: "game-over",
  // Refused by the rule set rather than by the position.
  NOT_ALLOWED: "not-allowed",
  WRONG_PLAYER: "wrong-player",
  CONSECUTIVE: "consecutive",
  COOLDOWN: "cooldown",
  // Refused by the control-event protocol.
  /** A control event from somebody who holds neither side. */
  NOT_A_PLAYER: "not-a-player",
  /** A draw offer while another offer is still standing. */
  OFFER_PENDING: "offer-pending",
  /** A draw acceptance with no offer from the other side to accept. */
  NO_OFFER: "no-offer",
  /** The rule set's starting position is not a position. Nothing can count. */
  BAD_START_POSITION: "bad-start-position",
  /**
   * This game commits to a protocol this reader does not implement.
   *
   * Not the same as "invalid". The game is fine; THIS reader cannot say what it
   * means, and guessing would produce a position no other reader agrees with.
   */
  UNSUPPORTED_PROTOCOL: "unsupported-protocol"
};

// packages/replay/replay.ts
function classifyMove(position, uci) {
  const parsed = parseUci(uci);
  if (!parsed) return REJECTED.MALFORMED;
  const piece = position.board[parsed.from];
  if (piece === 0) return REJECTED.EMPTY_SQUARE;
  if ((piece >> 3 & 1) !== position.turn) return REJECTED.WRONG_TURN;
  return REJECTED.ILLEGAL;
}
function replay2(submissions, options = {}) {
  const rules = normaliseRules({ ...DEFAULT_RULES, ...options.rules ?? {} });
  const startFen = options.startFen || rules.startFen;
  const rows = Array.isArray(submissions) ? submissions : [];
  const log = [];
  const accepted = [];
  const rejected = [];
  const eventsActive = rules.eventsProtocol === EVENTS_PROTOCOL;
  const eventsKnown = eventsActive || rules.eventsProtocol === EVENTS_NONE;
  if (!REPLAY_PROTOCOLS.includes(rules.replayProtocol) || !eventsKnown) {
    rows.forEach((raw2, index) => {
      const record = buildRejected(raw2, index, "unknown", REJECTED.UNSUPPORTED_PROTOCOL);
      log.push(record);
      rejected.push(record);
    });
    const empty = new Position();
    return {
      position: empty,
      rules,
      fen: empty.fen(),
      startFen,
      turn: "white",
      inCheck: false,
      legalMoves: [],
      status: "over",
      fault: "unsupported-protocol",
      result: null,
      termination: null,
      terminalSequence: null,
      accepted,
      rejected,
      log,
      lastAccepted: null,
      moveNumber: 1,
      pendingOffer: null,
      pgnMoveText: ""
    };
  }
  const position = Position.tryFrom(startFen);
  if (!position) {
    rows.forEach((raw2, index) => {
      const record = buildRejected(raw2, index, "unknown", REJECTED.BAD_START_POSITION);
      log.push(record);
      rejected.push(record);
    });
    const empty = new Position();
    return {
      position: empty,
      rules,
      fen: empty.fen(),
      startFen,
      turn: "white",
      inCheck: false,
      legalMoves: [],
      status: "over",
      fault: "bad-start-position",
      result: null,
      termination: null,
      terminalSequence: null,
      accepted,
      rejected,
      log,
      lastAccepted: null,
      moveNumber: 1,
      pendingOffer: null,
      pgnMoveText: ""
    };
  }
  let result = null;
  let termination = null;
  let terminalSequence = null;
  let pendingOffer = null;
  const opening = position.outcome();
  if (opening) {
    result = opening.result;
    termination = opening.termination;
  }
  const moveHistory = [];
  const finish = (r, t, seq) => {
    result = r;
    termination = t;
    terminalSequence = seq;
  };
  for (let index = 0; index < rows.length; index++) {
    const raw2 = rows[index];
    const entry = raw2 && typeof raw2 === "object" ? raw2 : {};
    const seq = Number.isFinite(Number(entry.seq)) ? Number(entry.seq) : index;
    const text = typeof entry.mv === "string" ? entry.mv : "";
    const sender = typeof entry.sender === "string" ? entry.sender : null;
    const height = Number.isFinite(Number(entry.height)) ? Number(entry.height) : null;
    const base = { seq, raw: text, sender, height };
    const reject = (kind, reason) => {
      const record2 = { ...base, status: "rejected", kind, reason };
      log.push(record2);
      rejected.push(record2);
    };
    if (result !== null) {
      reject(eventsActive && parseEvent(text) ? "event" : "move", REJECTED.GAME_OVER);
      continue;
    }
    const event = eventsActive ? parseEvent(text) : null;
    if (event) {
      const from = String(sender ?? "").toUpperCase();
      if (rules.allow.length && !rules.allow.includes(from)) {
        reject("event", REJECTED.NOT_ALLOWED);
        continue;
      }
      const side = sideOf(rules, sender);
      if (!side) {
        reject("event", REJECTED.NOT_A_PLAYER);
        continue;
      }
      const accept = () => {
        const record2 = {
          ...base,
          status: "accepted",
          kind: "event",
          reason: null,
          event,
          color: side
        };
        log.push(record2);
        accepted.push(record2);
      };
      if (event === "resign") {
        accept();
        finish(side === "white" ? "0-1" : "1-0", "resignation", seq);
        continue;
      }
      if (event === "draw-offer") {
        if (pendingOffer !== null) {
          reject("event", REJECTED.OFFER_PENDING);
          continue;
        }
        accept();
        pendingOffer = side;
        continue;
      }
      if (pendingOffer === null || pendingOffer === side) {
        reject("event", REJECTED.NO_OFFER);
        continue;
      }
      accept();
      finish("1/2-1/2", "agreement", seq);
      continue;
    }
    const broken = checkSender(rules, {
      sender,
      turn: position.turn === WHITE ? "white" : "black",
      history: moveHistory
    });
    if (broken) {
      reject("move", broken);
      continue;
    }
    const played = position.applyUci(text);
    if (!played) {
      reject("move", classifyMove(position, text));
      continue;
    }
    const record = {
      ...base,
      status: "accepted",
      kind: "move",
      reason: null,
      uci: played.uci,
      san: played.san,
      // Carried because the engine knows it for free at the moment it makes the
      // move. Working it out later would mean replaying the position again.
      piece: pieceType(played.piece),
      captured: played.captured ? pieceType(played.captured) : 0,
      promotion: played.promotion || 0,
      ply: moveHistory.length + 1,
      color: moveHistory.length % 2 === 0 ? "white" : "black"
    };
    log.push(record);
    accepted.push(record);
    moveHistory.push(record);
    pendingOffer = null;
    const outcome = position.outcome();
    if (outcome) finish(outcome.result, outcome.termination, seq);
  }
  const lastAccepted = accepted.length ? accepted[accepted.length - 1] : null;
  return {
    position,
    rules,
    fen: position.fen(),
    startFen,
    turn: position.turn === WHITE ? "white" : "black",
    inCheck: position.inCheck(),
    // A finished game has no moves to offer, whatever the board says.
    legalMoves: result === null ? position.movesUci() : [],
    status: result === null ? "live" : "over",
    fault: null,
    result,
    termination,
    terminalSequence,
    accepted,
    rejected,
    log,
    lastAccepted,
    moveNumber: position.fullmove,
    pendingOffer,
    pgnMoveText: position.pgnMoveText()
  };
}
function buildRejected(raw2, index, kind, reason) {
  const entry = raw2 && typeof raw2 === "object" ? raw2 : {};
  return {
    seq: Number.isFinite(Number(entry.seq)) ? Number(entry.seq) : index,
    raw: typeof entry.mv === "string" ? entry.mv : "",
    sender: typeof entry.sender === "string" ? entry.sender : null,
    height: Number.isFinite(Number(entry.height)) ? Number(entry.height) : null,
    status: "rejected",
    kind,
    reason
  };
}
export {
  DEFAULT_RULES,
  ENGINE,
  LiveChain,
  MAX_BRANCHES,
  MAX_BYTES,
  MAX_CHUNKS,
  MAX_MOVES,
  PROTOCOL,
  PeerRegistry,
  RULES,
  XTRATA,
  XtrataReader,
  actorTurn,
  archive,
  canonical,
  check,
  checkDescriptor,
  checkOpening,
  createArgs,
  deserialize as decode,
  decodeInvitation,
  demoOpening,
  descriptor,
  divergent,
  emptyGame,
  encode,
  generateKey,
  genesis,
  hash,
  integer,
  inviteDemo,
  joinArgs,
  lineHash,
  makeMove2 as makeMove,
  makeResignation,
  merge,
  normaliseRules,
  openingFrom,
  parseBounded,
  pubValid,
  publicKey,
  randomHex,
  raw,
  replay,
  replay2 as replayLegacy,
  replayLine,
  rulesHash,
  same,
  sign,
  verify,
  verifyArchive,
  verifyDemoInvite
};
