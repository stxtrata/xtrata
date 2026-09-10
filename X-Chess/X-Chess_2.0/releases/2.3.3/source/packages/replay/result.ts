// What a finished game says, and why it finished.
//
// Two vocabularies, kept apart. `Result` is the score, and there are exactly
// four possibilities including "not yet". `Termination` is the reason, and it is
// the thing that gets richer over time — an X Chess game can end in ways FIDE
// has no word for, and a future protocol may add more.
//
// A reader that understands `Result` and not a new `Termination` still knows who
// won. That is the point of splitting them.

export type Result = '1-0' | '0-1' | '1/2-1/2' | null;

export type Termination =
  // Decided on the board.
  | 'checkmate'
  | 'stalemate'
  | 'repetition'
  | 'fifty-move'
  | 'insufficient-material'
  // Decided by the players, through the control events in events-v1.
  | 'resignation'
  | 'agreement'
  | null;

/** Every reason a submission can fail to count. Frozen; see REPLAY-V1.md. */
export const REJECTED = {
  /** Neither a legal UCI move string nor a known control string. */
  MALFORMED: 'malformed',
  /** A well-formed move whose origin square is empty. */
  EMPTY_SQUARE: 'empty-square',
  /** A well-formed move for a piece belonging to the side not to move. */
  WRONG_TURN: 'wrong-turn',
  /** A well-formed move that is simply not legal here. */
  ILLEGAL: 'illegal',
  /** Anything at all after the game has ended. */
  GAME_OVER: 'game-over',

  // Refused by the rule set rather than by the position.
  NOT_ALLOWED: 'not-allowed',
  WRONG_PLAYER: 'wrong-player',
  CONSECUTIVE: 'consecutive',
  COOLDOWN: 'cooldown',

  // Refused by the control-event protocol.
  /** A control event from somebody who holds neither side. */
  NOT_A_PLAYER: 'not-a-player',
  /** A draw offer while another offer is still standing. */
  OFFER_PENDING: 'offer-pending',
  /** A draw acceptance with no offer from the other side to accept. */
  NO_OFFER: 'no-offer',

  /** The rule set's starting position is not a position. Nothing can count. */
  BAD_START_POSITION: 'bad-start-position',

  /**
   * This game commits to a protocol this reader does not implement.
   *
   * Not the same as "invalid". The game is fine; THIS reader cannot say what it
   * means, and guessing would produce a position no other reader agrees with.
   */
  UNSUPPORTED_PROTOCOL: 'unsupported-protocol'
} as const;

export type RejectionReason = (typeof REJECTED)[keyof typeof REJECTED];
