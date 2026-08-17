// X-CHESS-SKILL/1  chess-engine
//
// Deterministic: same position, same depth, same answer, on any machine,
// forever. No randomness, no clock, no state between calls. That is what makes
// it inscribable — an X Chess entrant can fetch this by hash and verify every
// player was handed the same analysis.
//
// rankMoves(state, depth) returns EVERY legal move scored in centipawns from
// the mover's view, best first, with mateIn where one exists. Never a
// recommendation: a character reads the list and picks by style.
//
// A language model cannot play chess from a list of legal moves, and no prompt
// makes it — effort, instructions and hints each measured zero over six
// on-chain games. This halved the blunder rate, 24% to 12%.
//
// Needs a legal-move generator with make/unmake: the X Chess board engine, or
// any 0x88 one of the same shape.

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

// packages/chess/uci.ts
function toUci(move) {
  return algebraic(move.from) + algebraic(move.to) + (move.flags & PROMOTION ? SYMBOLS[move.promotion] : "");
}

// packages/chess/search.ts
var VALUE = [0, 100, 320, 330, 500, 900, 0];
var PST = {
  [PAWN]: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    50,
    50,
    50,
    50,
    50,
    50,
    50,
    50,
    10,
    10,
    20,
    30,
    30,
    20,
    10,
    10,
    5,
    5,
    10,
    25,
    25,
    10,
    5,
    5,
    0,
    0,
    0,
    20,
    20,
    0,
    0,
    0,
    5,
    -5,
    -10,
    0,
    0,
    -10,
    -5,
    5,
    5,
    10,
    10,
    -20,
    -20,
    10,
    10,
    5,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  [KNIGHT]: [
    -50,
    -40,
    -30,
    -30,
    -30,
    -30,
    -40,
    -50,
    -40,
    -20,
    0,
    0,
    0,
    0,
    -20,
    -40,
    -30,
    0,
    10,
    15,
    15,
    10,
    0,
    -30,
    -30,
    5,
    15,
    20,
    20,
    15,
    5,
    -30,
    -30,
    0,
    15,
    20,
    20,
    15,
    0,
    -30,
    -30,
    5,
    10,
    15,
    15,
    10,
    5,
    -30,
    -40,
    -20,
    0,
    5,
    5,
    0,
    -20,
    -40,
    -50,
    -40,
    -30,
    -30,
    -30,
    -30,
    -40,
    -50
  ],
  [BISHOP]: [
    -20,
    -10,
    -10,
    -10,
    -10,
    -10,
    -10,
    -20,
    -10,
    0,
    0,
    0,
    0,
    0,
    0,
    -10,
    -10,
    0,
    5,
    10,
    10,
    5,
    0,
    -10,
    -10,
    5,
    5,
    10,
    10,
    5,
    5,
    -10,
    -10,
    0,
    10,
    10,
    10,
    10,
    0,
    -10,
    -10,
    10,
    10,
    10,
    10,
    10,
    10,
    -10,
    -10,
    5,
    0,
    0,
    0,
    0,
    5,
    -10,
    -20,
    -10,
    -10,
    -10,
    -10,
    -10,
    -10,
    -20
  ],
  [ROOK]: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    5,
    10,
    10,
    10,
    10,
    10,
    10,
    5,
    -5,
    0,
    0,
    0,
    0,
    0,
    0,
    -5,
    -5,
    0,
    0,
    0,
    0,
    0,
    0,
    -5,
    -5,
    0,
    0,
    0,
    0,
    0,
    0,
    -5,
    -5,
    0,
    0,
    0,
    0,
    0,
    0,
    -5,
    -5,
    0,
    0,
    0,
    0,
    0,
    0,
    -5,
    0,
    0,
    0,
    5,
    5,
    0,
    0,
    0
  ],
  [QUEEN]: [
    -20,
    -10,
    -10,
    -5,
    -5,
    -10,
    -10,
    -20,
    -10,
    0,
    0,
    0,
    0,
    0,
    0,
    -10,
    -10,
    0,
    5,
    5,
    5,
    5,
    0,
    -10,
    -5,
    0,
    5,
    5,
    5,
    5,
    0,
    -5,
    0,
    0,
    5,
    5,
    5,
    5,
    0,
    -5,
    -10,
    5,
    5,
    5,
    5,
    5,
    0,
    -10,
    -10,
    0,
    5,
    0,
    0,
    0,
    0,
    -10,
    -20,
    -10,
    -10,
    -5,
    -5,
    -10,
    -10,
    -20
  ],
  [KING]: [
    -30,
    -40,
    -40,
    -50,
    -50,
    -40,
    -40,
    -30,
    -30,
    -40,
    -40,
    -50,
    -50,
    -40,
    -40,
    -30,
    -30,
    -40,
    -40,
    -50,
    -50,
    -40,
    -40,
    -30,
    -30,
    -40,
    -40,
    -50,
    -50,
    -40,
    -40,
    -30,
    -20,
    -30,
    -30,
    -40,
    -40,
    -30,
    -30,
    -20,
    -10,
    -20,
    -20,
    -20,
    -20,
    -20,
    -20,
    -10,
    20,
    20,
    0,
    0,
    0,
    0,
    20,
    20,
    20,
    30,
    10,
    0,
    0,
    10,
    30,
    20
  ]
};
var FROM_CENTRE = [
  6,
  5,
  4,
  3,
  3,
  4,
  5,
  6,
  5,
  4,
  3,
  2,
  2,
  3,
  4,
  5,
  4,
  3,
  2,
  1,
  1,
  2,
  3,
  4,
  3,
  2,
  1,
  0,
  0,
  1,
  2,
  3,
  3,
  2,
  1,
  0,
  0,
  1,
  2,
  3,
  4,
  3,
  2,
  1,
  1,
  2,
  3,
  4,
  5,
  4,
  3,
  2,
  2,
  3,
  4,
  5,
  6,
  5,
  4,
  3,
  3,
  4,
  5,
  6
];
var MATE = 1e5;
var idx64 = (sq) => (sq >> 4) * 8 + (sq & 7);
function evaluate(state) {
  const material = [0, 0];
  const kings = [-1, -1];
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 136) {
      sq += 7;
      continue;
    }
    const piece = state.board[sq];
    if (!piece) continue;
    const type = pieceType(piece);
    const colour = pieceColor(piece);
    if (type === KING) kings[colour] = sq;
    else material[colour] += VALUE[type];
  }
  const mating = material[WHITE] === 0 || material[BLACK] === 0;
  let score = 0;
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 136) {
      sq += 7;
      continue;
    }
    const piece = state.board[sq];
    if (!piece) continue;
    const type = pieceType(piece);
    const colour = pieceColor(piece);
    if (type === KING && mating) continue;
    const at = colour === WHITE ? idx64(sq) : idx64(sq) ^ 56;
    const worth = VALUE[type] + (PST[type]?.[at] ?? 0);
    score += colour === WHITE ? worth : -worth;
  }
  for (const side of [WHITE, BLACK]) {
    const other = side === WHITE ? BLACK : WHITE;
    if (material[other] === 0 && material[side] >= 500 && kings[other] >= 0 && kings[side] >= 0) {
      const cornered = FROM_CENTRE[idx64(kings[other])] * 12;
      const gap = Math.abs((kings[side] >> 4) - (kings[other] >> 4)) + Math.abs((kings[side] & 7) - (kings[other] & 7));
      const drive = cornered + (14 - gap) * 6;
      score += side === WHITE ? drive : -drive;
    }
  }
  return state.turn === WHITE ? score : -score;
}
function ordered(moves) {
  return moves.map((move, at) => ({ move, at, gain: move.captured ? VALUE[pieceType(move.captured)] * 16 - VALUE[pieceType(move.piece)] : 0 })).sort((a, b) => b.gain - a.gain || a.at - b.at).map((row) => row.move);
}
function negamax(state, depth, alpha, beta, ply) {
  const moves = legalMoves(state);
  if (moves.length === 0) {
    return inCheck(state) ? -MATE + ply : 0;
  }
  if (depth <= 0) return evaluate(state);
  let best = -Infinity;
  for (const move of ordered(moves)) {
    const undo = makeMove(state, move);
    const score = -negamax(state, depth - 1, -beta, -alpha, ply + 1);
    unmakeMove(state, undo);
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
function rankMoves(state, depth = 3) {
  const scored = legalMoves(state).map((move, at) => {
    const undo = makeMove(state, move);
    const score = -negamax(state, depth - 1, -Infinity, Infinity, 1);
    unmakeMove(state, undo);
    const distance = MATE - Math.abs(score);
    return {
      uci: toUci(move),
      score,
      // Only report a mate that is actually within reach of this search; a
      // score near MATE from a deep line is a real mate, anything else is not.
      mateIn: Math.abs(score) > MATE - 1e3 ? Math.ceil(distance / 2) * Math.sign(score) : null,
      at
    };
  });
  return scored.sort((a, b) => b.score - a.score || a.at - b.at).map(({ uci, score, mateIn }) => ({ uci, score, mateIn }));
}
export {
  evaluate,
  rankMoves
};
