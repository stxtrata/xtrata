// Replay is the consensus interpreter.
//
// Walk the log in sequence order. Apply every submission that counts, skip every
// submission that does not, and record why for each. The result is a pure
// function of the log, so two readers with the same bytes always agree, and
// nobody has to be trusted about the position.
//
// Two properties hold, and everything above depends on them:
//
//   TOTAL        it never throws, for any input at all. The input is arbitrary
//                strings written by anyone, by construction, so a malformed
//                submission is an ordinary outcome and not an error.
//   DETERMINISTIC the same log and the same rules give the same output, every
//                time, in every implementation of this spec.
//
// The corollary the UI has to state plainly: a submission that does not count
// was still stored and still charged. It simply does not count.

import { Position } from '../chess/engine.js';
import type { Outcome, PieceType } from '../chess/engine.js';
import { WHITE, pieceType } from '../chess/board.js';
import { parseUci } from '../chess/uci.js';
import { DEFAULT_RULES, checkSender, normaliseRules } from '../protocol/rules.js';
import type { Rules } from '../protocol/rules.js';
import { EVENTS_NONE, EVENTS_PROTOCOL, REPLAY_PROTOCOL } from '../protocol/versions.js';
import { parseEvent, sideOf } from './events.js';
import type { EventKind } from './events.js';
import { REJECTED } from './result.js';
import type { RejectionReason, Result, Termination } from './result.js';

/** One row of the log, as the chain hands it over. */
export interface Submission {
  mv: string;
  sender?: string | null;
  seq?: number;
  height?: number | null;
}

interface BaseRecord {
  seq: number;
  /** Exactly what was submitted, before any interpretation. */
  raw: string;
  sender: string | null;
  height: number | null;
}

export interface AcceptedMove extends BaseRecord {
  status: 'accepted';
  kind: 'move';
  reason: null;
  uci: string;
  san: string;
  piece: PieceType;
  captured: PieceType | 0;
  promotion: PieceType | 0;
  /** 1-based index among accepted moves. Not the same as `seq`. */
  ply: number;
  color: 'white' | 'black';
}

export interface AcceptedEvent extends BaseRecord {
  status: 'accepted';
  kind: 'event';
  reason: null;
  event: EventKind;
  color: 'white' | 'black';
}

export type AcceptedRecord = AcceptedMove | AcceptedEvent;

export interface RejectedRecord extends BaseRecord {
  status: 'rejected';
  kind: 'move' | 'event' | 'unknown';
  reason: RejectionReason;
}

export type LogRecord = AcceptedRecord | RejectedRecord;

export interface ReplayState {
  /** The position the log arrives at. */
  position: Position;
  /** The rules it was replayed under, normalised. */
  rules: Rules;
  fen: string;
  startFen: string;
  turn: 'white' | 'black';
  inCheck: boolean;
  legalMoves: string[];

  status: 'live' | 'over';
  /**
   * Set when this reader cannot interpret the game at all.
   *
   * A game committed to a protocol this build does not implement is not
   * invalid; it is simply not something this build may guess about. Saying so is
   * the only honest answer, and it is what stops a future protocol quietly
   * producing a different position here than in the reader that understands it.
   */
  fault: 'unsupported-protocol' | 'bad-start-position' | null;
  result: Result;
  termination: Termination;
  /** The `seq` of the submission that ended the game, or null. */
  terminalSequence: number | null;

  accepted: AcceptedRecord[];
  rejected: RejectedRecord[];
  /** Every submission in order, accepted and rejected alike. */
  log: LogRecord[];
  lastAccepted: AcceptedRecord | null;

  /** The full move number of the position reached. */
  moveNumber: number;
  /** A draw offer standing when the log ran out, or null. */
  pendingOffer: 'white' | 'black' | null;

  pgnMoveText: string;
}

export interface ReplayOptions {
  rules?: Partial<Rules>;
  /** Overrides the rule set's start position. For callers that only want one. */
  startFen?: string;
}

/**
 * Why a well-formed-looking move failed, refined for the reader.
 *
 * Every category is derived from the position, so it stays deterministic. The
 * refinements exist only so the board can say something useful about a skipped
 * entry; nothing downstream branches on them.
 */
function classifyMove(position: Position, uci: string): RejectionReason {
  const parsed = parseUci(uci);
  if (!parsed) return REJECTED.MALFORMED;

  const piece = position.board[parsed.from];
  if (piece === 0) return REJECTED.EMPTY_SQUARE;
  if (((piece >> 3) & 1) !== position.turn) return REJECTED.WRONG_TURN;
  return REJECTED.ILLEGAL;
}

/**
 * @param submissions the log, in sequence order. Entries may be junk.
 * @param options the rule set the game committed to.
 */
export function replay(submissions: unknown, options: ReplayOptions = {}): ReplayState {
  const rules = normaliseRules({ ...DEFAULT_RULES, ...(options.rules ?? {}) });
  const startFen = options.startFen || rules.startFen;

  const rows: Submission[] = Array.isArray(submissions) ? (submissions as Submission[]) : [];

  const log: LogRecord[] = [];
  const accepted: AcceptedRecord[] = [];
  const rejected: RejectedRecord[] = [];

  // Which control strings mean anything here.
  //
  // This is committed per game, and honouring it is what keeps old games old.
  // A legacy game was played under a protocol where `resgn` was a submission
  // replay skipped as malformed; applying events-v1 to it would end a game its
  // players went on to finish and change a result that is already part of the
  // record.
  const eventsActive = rules.eventsProtocol === EVENTS_PROTOCOL;
  const eventsKnown = eventsActive || rules.eventsProtocol === EVENTS_NONE;

  // A protocol this build does not implement is not something to guess at.
  if (rules.replayProtocol !== REPLAY_PROTOCOL || !eventsKnown) {
    rows.forEach((raw, index) => {
      const record = buildRejected(raw, index, 'unknown', REJECTED.UNSUPPORTED_PROTOCOL);
      log.push(record);
      rejected.push(record);
    });
    const empty = new Position();
    return {
      position: empty,
      rules,
      fen: empty.fen(),
      startFen,
      turn: 'white',
      inCheck: false,
      legalMoves: [],
      status: 'over',
      fault: 'unsupported-protocol',
      result: null,
      termination: null,
      terminalSequence: null,
      accepted,
      rejected,
      log,
      lastAccepted: null,
      moveNumber: 1,
      pendingOffer: null,
      pgnMoveText: ''
    };
  }

  // A start position that is not a position cannot produce one. Rather than
  // throwing — replay is total — every entry is recorded as rejected for that
  // reason, which is both deterministic and honest about what happened.
  const position = Position.tryFrom(startFen);
  if (!position) {
    rows.forEach((raw, index) => {
      const record = buildRejected(raw, index, 'unknown', REJECTED.BAD_START_POSITION);
      log.push(record);
      rejected.push(record);
    });
    const empty = new Position();
    return {
      position: empty,
      rules,
      fen: empty.fen(),
      startFen,
      turn: 'white',
      inCheck: false,
      legalMoves: [],
      status: 'over',
      fault: 'bad-start-position',
      result: null,
      termination: null,
      terminalSequence: null,
      accepted,
      rejected,
      log,
      lastAccepted: null,
      moveNumber: 1,
      pendingOffer: null,
      pgnMoveText: ''
    };
  }

  // Terminal state, once reached, is final. Nothing after it counts.
  let result: Result = null;
  let termination: Termination = null;
  let terminalSequence: number | null = null;
  let pendingOffer: 'white' | 'black' | null = null;

  // A rule set may name a start position that is already finished — king and
  // knight against a lone king is dead the moment it is set up. Then the game
  // was over before anybody submitted anything, and `terminalSequence` stays
  // null because no entry ended it. Without this the log would report itself as
  // live and label every submission "illegal", which is true of each one
  // individually and wrong about the game.
  const opening = position.outcome();
  if (opening) {
    result = opening.result;
    termination = opening.termination;
  }

  /** Accepted moves only — cooldown and no-consecutive are about moves. */
  const moveHistory: AcceptedMove[] = [];

  const finish = (r: Result, t: Termination, seq: number): void => {
    result = r;
    termination = t;
    terminalSequence = seq;
  };

  for (let index = 0; index < rows.length; index++) {
    const raw = rows[index];
    const entry = raw && typeof raw === 'object' ? raw : ({} as Submission);
    const seq = Number.isFinite(Number(entry.seq)) ? Number(entry.seq) : index;
    const text = typeof entry.mv === 'string' ? entry.mv : '';
    const sender = typeof entry.sender === 'string' ? entry.sender : null;
    const height = Number.isFinite(Number(entry.height)) ? Number(entry.height) : null;

    const base: BaseRecord = { seq, raw: text, sender, height };

    const reject = (kind: 'move' | 'event' | 'unknown', reason: RejectionReason): void => {
      const record: RejectedRecord = { ...base, status: 'rejected', kind, reason };
      log.push(record);
      rejected.push(record);
    };

    // The game is over. Everything after is permanently visible and counts for
    // nothing — which is exactly what the invariant promises.
    if (result !== null) {
      reject(eventsActive && parseEvent(text) ? 'event' : 'move', REJECTED.GAME_OVER);
      continue;
    }

    const event = eventsActive ? parseEvent(text) : null;

    // ---- control events ------------------------------------------------

    if (event) {
      // The allow list says who may take part at all, so it governs a
      // resignation as much as a move.
      const from = String(sender ?? '').toUpperCase();
      if (rules.allow.length && !rules.allow.includes(from)) {
        reject('event', REJECTED.NOT_ALLOWED);
        continue;
      }

      // Cooldown and no-consecutive deliberately do NOT apply here. They pace
      // the moves in a game; applying them to a resignation would mean a player
      // could be prevented from conceding, which is not a rule anybody agreed
      // to and would make a game unfinishable.
      const side = sideOf(rules, sender);
      if (!side) {
        reject('event', REJECTED.NOT_A_PLAYER);
        continue;
      }

      const accept = (): void => {
        const record: AcceptedEvent = {
          ...base,
          status: 'accepted',
          kind: 'event',
          reason: null,
          event,
          color: side
        };
        log.push(record);
        accepted.push(record);
      };

      if (event === 'resign') {
        accept();
        finish(side === 'white' ? '0-1' : '1-0', 'resignation', seq);
        continue;
      }

      if (event === 'draw-offer') {
        // At most one offer stands at a time. A second one, from either side,
        // is refused rather than replacing it: two live offers would make
        // "which one did this accept" a question the log cannot answer.
        if (pendingOffer !== null) {
          reject('event', REJECTED.OFFER_PENDING);
          continue;
        }
        accept();
        pendingOffer = side;
        continue;
      }

      // draw-accept. Only the side the offer was made TO can take it, and
      // accepting your own offer is not agreement.
      if (pendingOffer === null || pendingOffer === side) {
        reject('event', REJECTED.NO_OFFER);
        continue;
      }
      accept();
      finish('1/2-1/2', 'agreement', seq);
      continue;
    }

    // ---- moves ---------------------------------------------------------

    // Who may move is settled before whether the move is legal. The order is
    // fixed rather than incidental: it decides which reason a submission that
    // breaks both gets labelled with, and that label is part of the record.
    const broken = checkSender(rules, {
      sender,
      turn: position.turn === WHITE ? 'white' : 'black',
      history: moveHistory
    });
    if (broken) {
      reject('move', broken);
      continue;
    }

    const played = position.applyUci(text);
    if (!played) {
      reject('move', classifyMove(position, text));
      continue;
    }

    const record: AcceptedMove = {
      ...base,
      status: 'accepted',
      kind: 'move',
      reason: null,
      uci: played.uci,
      san: played.san,
      // Carried because the engine knows it for free at the moment it makes the
      // move. Working it out later would mean replaying the position again.
      piece: pieceType(played.piece),
      captured: played.captured ? pieceType(played.captured) : 0,
      promotion: played.promotion || 0,
      ply: moveHistory.length + 1,
      color: moveHistory.length % 2 === 0 ? 'white' : 'black'
    };
    log.push(record);
    accepted.push(record);
    moveHistory.push(record);

    // A move answers a standing offer by ignoring it. This is the FIDE reading —
    // an offer lapses when the opponent moves — expressed as a rule that needs
    // no clock: any accepted move clears it.
    pendingOffer = null;

    const outcome: Outcome | null = position.outcome();
    if (outcome) finish(outcome.result, outcome.termination, seq);
  }

  const lastAccepted = accepted.length ? accepted[accepted.length - 1] : null;

  return {
    position,
    rules,
    fen: position.fen(),
    startFen,
    turn: position.turn === WHITE ? 'white' : 'black',
    inCheck: position.inCheck(),
    // A finished game has no moves to offer, whatever the board says.
    legalMoves: result === null ? position.movesUci() : [],
    status: result === null ? 'live' : 'over',
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

function buildRejected(
  raw: unknown,
  index: number,
  kind: 'move' | 'event' | 'unknown',
  reason: RejectionReason
): RejectedRecord {
  const entry = raw && typeof raw === 'object' ? (raw as Submission) : ({} as Submission);
  return {
    seq: Number.isFinite(Number(entry.seq)) ? Number(entry.seq) : index,
    raw: typeof entry.mv === 'string' ? entry.mv : '',
    sender: typeof entry.sender === 'string' ? entry.sender : null,
    height: Number.isFinite(Number(entry.height)) ? Number(entry.height) : null,
    status: 'rejected',
    kind,
    reason
  };
}
