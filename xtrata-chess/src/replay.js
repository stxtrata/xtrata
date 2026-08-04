// Replay turns a log of submissions into a position.
//
// This is the whole consensus mechanism. Walk the log in sequence order, apply
// every submission that is legal in the position reached so far, and skip
// every submission that is not. The result is a pure function of the log, so
// two readers with the same log always agree.
//
// Nothing here throws. The input is arbitrary strings written by anyone, and
// a malformed submission is an ordinary outcome rather than an error.

import { Chess, START_FEN, parseUci, pieceColor } from './engine.js';

export const REJECTED = {
  MALFORMED: 'malformed',
  EMPTY_SQUARE: 'empty-square',
  WRONG_TURN: 'wrong-turn',
  ILLEGAL: 'illegal',
  GAME_OVER: 'game-over'
};

// Why a submission failed. The categories below are refinements of "illegal"
// kept apart only so the board can say something useful about each skipped
// entry. Every one of them is derived from the position, so they stay
// deterministic.
function classify(chess, uci) {
  const parsed = parseUci(uci);
  if (!parsed) return REJECTED.MALFORMED;

  const piece = chess.board[parsed.from];
  if (piece === 0) return REJECTED.EMPTY_SQUARE;
  if (pieceColor(piece) !== chess.turn) return REJECTED.WRONG_TURN;
  return REJECTED.ILLEGAL;
}

/**
 * @param {Array<{mv: string, sender?: string, seq?: number, height?: number}>|string[]} submissions
 * @param {{startFen?: string}} [options]
 */
export function replay(submissions, options = {}) {
  const startFen = options.startFen || START_FEN;
  const chess = new Chess(startFen);

  const log = [];
  const accepted = [];
  const rejected = [];

  submissions.forEach((raw, index) => {
    const entry =
      typeof raw === 'string' ? { mv: raw } : raw && typeof raw === 'object' ? raw : { mv: '' };
    const seq = entry.seq ?? index;
    const uci = typeof entry.mv === 'string' ? entry.mv : '';
    const sender = entry.sender ?? null;
    const height = entry.height ?? null;

    const base = { seq, uci, sender, height };

    if (chess.isGameOver()) {
      const record = { ...base, status: 'rejected', reason: REJECTED.GAME_OVER };
      log.push(record);
      rejected.push(record);
      return;
    }

    const move = chess.moveUci(uci);

    if (!move) {
      const record = { ...base, status: 'rejected', reason: classify(chess, uci) };
      log.push(record);
      rejected.push(record);
      return;
    }

    const record = {
      ...base,
      status: 'accepted',
      reason: null,
      san: move.san,
      uci: move.uci,
      ply: accepted.length + 1,
      color: accepted.length % 2 === 0 ? 'white' : 'black'
    };
    log.push(record);
    accepted.push(record);
  });

  const outcome = chess.outcome();

  return {
    chess,
    fen: chess.fen(),
    startFen,
    turn: chess.turn === 0 ? 'white' : 'black',
    inCheck: chess.inCheck(),
    legalMoves: chess.movesUci(),
    outcome,
    isGameOver: chess.isGameOver(),
    accepted,
    rejected,
    log,
    pgnMoveText: chess.pgnMoveText()
  };
}

// A PGN for a finished (or in progress) game. This is what a sealed game
// carries, alongside the raw log it was derived from.
export function toPgn(state, headers = {}) {
  const tags = {
    Event: 'Xtrata Open Board',
    Site: 'chain',
    Date: '????.??.??',
    Round: '-',
    White: 'anyone',
    Black: 'anyone',
    Result: state.outcome ? state.outcome.result : '*',
    ...headers
  };

  const lines = Object.entries(tags).map(([key, value]) => `[${key} "${value}"]`);
  lines.push('');
  lines.push(`${state.pgnMoveText} ${tags.Result}`.trim());
  return lines.join('\n');
}
