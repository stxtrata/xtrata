// harness/peer/verify.ts
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";

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

// packages/chain/clarity.ts
var C32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
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

// packages/peer/protocol.ts
var PROTOCOL = "xchess-peer-v1";
var ENGINE = "xchess-engine-v1:2ce32043537e211ff09dec435ae8c9eec89d21e6e71a082fc4ed0a929668bd33";
var RULES = "xchess-automatic-draw-v1";
var MAX_MOVES = 2048;
var MAX_BRANCHES = 8;
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
var lineHash = (line) => hash([line.moves.map((m) => hash(m.payload)), line.resignations.map((r) => hash(r.payload)).sort()]);
function divergent(a, b) {
  return a.moves.slice(0, Math.min(a.moves.length, b.moves.length)).some((m, i) => hash(m.payload) !== hash(b.moves[i].payload));
}
async function verifyArchive(a, opening) {
  check(a?.format === "xchess-peer-archive-v1", "Unsupported archive format");
  same(Object.keys(a).sort(), ["format", "opening", "line", "branches", "final"].sort(), "Unknown archive fields");
  if (opening) same(a.opening, opening, "Opening differs from chain record");
  const r = await replay({ opening: a.opening, line: a.line, branches: a.branches });
  same(a.final, r.summary, "Claimed result or final position does not match signed evidence");
  return r;
}

// harness/peer/verify.ts
if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, "crypto", { value: webcrypto });
try {
  if (!process.argv[2]) throw Error("Usage: node verify-peer.mjs public-game.json");
  const text = readFileSync(process.argv[2], "utf8"), a = parseBounded(text), r = await verifyArchive(a);
  console.log(JSON.stringify({ fileSha256: sha256Hex(text), ...r.summary, opening: a.opening.kind === "demo" ? "Local demo; no verified Stacks identities" : "Signatures and replay valid; on-chain opening has not been checked", guarantee: "Authenticates this signed line; does not establish absence of other branches" }, null, 2));
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exitCode = 1;
}
