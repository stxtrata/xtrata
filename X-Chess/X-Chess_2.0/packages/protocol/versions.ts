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
