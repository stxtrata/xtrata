// Ranked Standard v1: what makes a game count towards a rating.
//
// Not every X Chess game should move a number that other people's ratings are
// computed against. An experimental game, a game from a set-up position, a game
// on the open board where anyone may play either colour - all perfectly good
// games, and all unrated.
//
// The bar is deliberately strict and deliberately checkable by anybody holding
// only the chain and this document. Nothing here trusts a flag; every condition
// is either committed in the rules hash or visible in the log.

import { rulesMatchCommitment } from '../protocol/canonical.js';
import { ANYONE, ANYONE_ELSE } from '../protocol/rules.js';
import type { Rules } from '../protocol/rules.js';
import { PRINCIPAL_PATTERN } from '../protocol/canonical.js';
import { START_FEN } from '../chess/fen.js';
import { EVENTS_PROTOCOL, RANKED_PROTOCOL, REPLAY_PROTOCOL } from '../protocol/versions.js';
import type { ReplayState } from '../replay/replay.js';
import type { GameRow } from '../chain/client.js';

export const RANKED = RANKED_PROTOCOL;

export type IneligibleReason =
  | 'no-rules-commitment'
  | 'rules-do-not-match-commitment'
  | 'rules-not-ranked'
  | 'unsupported-replay-protocol'
  | 'unsupported-events-protocol'
  | 'side-not-a-principal'
  | 'same-player-both-sides'
  | 'not-the-standard-position'
  | 'has-an-allow-list'
  | 'no-result'
  | 'a-player-never-moved';

export interface Eligibility {
  eligible: boolean;
  reasons: IneligibleReason[];
  white: string | null;
  black: string | null;
}

const named = (side: string): boolean =>
  side !== ANYONE && side !== ANYONE_ELSE && PRINCIPAL_PATTERN.test(side);

/**
 * Is this game eligible under Ranked Standard v1?
 *
 * @param game   the row the chain holds
 * @param rules  the rule set a caller proposes for it
 * @param state  the result of replaying the log under those rules
 *
 * The rules are not trusted: they are confirmed against the commitment the game
 * made on chain. If they do not hash to it, no other rule set could have
 * produced that hash, so proposing the wrong ones proves nothing and the game
 * is not eligible.
 */
export function checkEligibility(
  game: Pick<GameRow, 'rulesHash'>,
  rules: Rules,
  state: ReplayState
): Eligibility {
  const reasons: IneligibleReason[] = [];

  // 1. The commitment. Without one, a game could be claimed to have had any
  // rules at all after the fact.
  if (!game.rulesHash) {
    reasons.push('no-rules-commitment');
  } else if (!rulesMatchCommitment(rules, game.rulesHash)) {
    reasons.push('rules-do-not-match-commitment');
  }

  // 2. Ranked status is inside the hashed rules, not a flag beside them. That
  // is what makes it something both players signed up to rather than something
  // retrofitted onto a game that was not offered as one.
  if (!rules.ranked) reasons.push('rules-not-ranked');

  // 3. The protocols this reader actually implements. A game committed to a
  // future replay protocol is not ineligible forever - it is simply not
  // something THIS version can verify, and it says so rather than guessing.
  if (rules.replayProtocol !== REPLAY_PROTOCOL) reasons.push('unsupported-replay-protocol');
  if (rules.eventsProtocol !== EVENTS_PROTOCOL) reasons.push('unsupported-events-protocol');

  // 4. Two specific, different people.
  if (!named(rules.white) || !named(rules.black)) {
    reasons.push('side-not-a-principal');
  } else if (rules.white === rules.black) {
    reasons.push('same-player-both-sides');
  }

  // 5. Standard chess from the standard position, decided by the two named
  // players and nobody else.
  if (rules.startFen !== START_FEN) reasons.push('not-the-standard-position');
  if (rules.allow.length > 0) reasons.push('has-an-allow-list');

  // Deliberately NOT checked: cooldown and noConsecutive. With two named
  // players who can only move on their own turn, neither can change a single
  // thing about the game - a player physically cannot move twice in a row. They
  // are no-ops here, and refusing them would be a rule with no purpose.

  // 6. A result that replay actually reached. A game still in progress is not
  // ineligible, it is unfinished, and it will become eligible when it ends.
  if (state.result === null) reasons.push('no-result');

  // 7. Both players actually took part.
  //
  // The opponent never signs the game into existence - the creator does. What
  // the opponent DOES do, if they play, is send a transaction to a game whose
  // rules publicly commit to being ranked, which is an on-chain act anybody can
  // verify. That is the acceptance.
  //
  // Without this, a creator could name a strong player, resign immediately, and
  // hand them a rated win they never played.
  const movers = new Set(
    state.accepted.filter((entry) => entry.sender).map((entry) => String(entry.sender).toUpperCase())
  );
  if (named(rules.white) && named(rules.black)) {
    if (!movers.has(rules.white) || !movers.has(rules.black)) {
      reasons.push('a-player-never-moved');
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    white: named(rules.white) ? rules.white : null,
    black: named(rules.black) ? rules.black : null
  };
}

/** A human sentence for each reason, for the UI to show beside a game. */
export function describeIneligibility(reason: IneligibleReason): string {
  switch (reason) {
    case 'no-rules-commitment':
      return 'this game committed to no rules, so nothing pins what it was';
    case 'rules-do-not-match-commitment':
      return 'the rules offered do not hash to what this game committed to';
    case 'rules-not-ranked':
      return 'this game was not opened as a ranked game';
    case 'unsupported-replay-protocol':
      return 'this game uses a replay protocol this board does not implement';
    case 'unsupported-events-protocol':
      return 'this game uses an events protocol this board does not implement';
    case 'side-not-a-principal':
      return 'a ranked game names both players by address';
    case 'same-player-both-sides':
      return 'both sides are the same player';
    case 'not-the-standard-position':
      return 'a ranked game starts from the standard position';
    case 'has-an-allow-list':
      return 'a ranked game is decided by its two named players alone';
    case 'no-result':
      return 'this game has not finished';
    case 'a-player-never-moved':
      return 'one of the players never made a move';
    default:
      return 'this game is not eligible';
  }
}
