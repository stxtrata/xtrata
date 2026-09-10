// Protocol versions, kept apart on purpose.
//
// There is no global "v2". A UI release must not be able to redefine what an
// old game meant, a new rating algorithm must not reinterpret ratings that were
// already published under the old one, and a future variant must not disturb
// standard chess. So each protocol carries its own version and moves on its own
// schedule.
//
// The rule for all of them: once a game has committed to a version, that
// version's definition is frozen for good. A change is a NEW version with a new
// identifier, plus an adapter that keeps reading the old one. Never an edit.

/** How a rule set is serialised and hashed. Committed on chain per game. */
export const RULES_PROTOCOL = 'rules-v1';

/** How a log becomes a position and a result. Committed on chain per game. */
export const REPLAY_PROTOCOL = 'replay-v1';

/**
 * The same, plus seats that are claimed by playing them.
 *
 * `first-mover` is a side nobody holds until somebody moves it, after which
 * only they may. That is a new answer to "who may submit", so it is a new
 * REPLAY protocol and not an edit to the old one — a board that has never heard
 * of the keyword would read the same log as a different game, and under v1 it
 * would be reading it wrong.
 *
 * A game only commits to this if it USES the keyword. Everything else stays on
 * v1, so every board that exists today goes on reading every game it can read
 * today. A board that meets a v2 game and does not implement it says
 * "unsupported protocol" and declines to derive anything, which is already what
 * replay does with a protocol it does not know.
 */
export const REPLAY_PROTOCOL_V2 = 'replay-v2';

/** Every replay protocol this build implements. */
export const REPLAY_PROTOCOLS: readonly string[] = [REPLAY_PROTOCOL, REPLAY_PROTOCOL_V2];

/** Which non-move strings mean something, and what. Committed per game. */
export const EVENTS_PROTOCOL = 'events-v1';

/**
 * No control strings mean anything.
 *
 * What every game opened before events-v1 existed was played under, whether or
 * not anybody wrote it down. In such a game `resgn` was a submission that
 * replay skipped as malformed, and it must STAY one: reinterpreting it as a
 * resignation would end a game that its players went on to finish, and would
 * change a result that is already part of the record.
 *
 * Named rather than left implicit, so a legacy adapter states what it is doing
 * instead of relying on a default.
 */
export const EVENTS_NONE = 'events-none';

/** What makes a game eligible to affect ratings. */
export const RANKED_PROTOCOL = 'ranked-v1';

/** How ratings are computed from eligible games. */
export const RATING_PROTOCOL = 'elo-v1';

/**
 * The core contract's storage and function shape.
 *
 * Distinct from the contract's deployed name: two deployments (a canary and a
 * production one) share this format version, and a reader that understands the
 * format can read both.
 */
export const CORE_FORMAT = 'xchess-core-v1';

/**
 * Everything a game commits to, so that a reader arriving with only the chain
 * and the published protocol definitions can replay it exactly.
 *
 * This is the answer to §79: the game does not depend on the reader knowing
 * which version was current. It says so itself.
 */
export const PROTOCOL_COMMITMENT = {
  rules: RULES_PROTOCOL,
  replay: REPLAY_PROTOCOL,
  events: EVENTS_PROTOCOL
} as const;

export type ProtocolCommitment = typeof PROTOCOL_COMMITMENT;
