// Whether this board should let a submission reach a wallet.
//
// A submission that breaks a rule is still stored on chain and still costs its
// sender a network fee. It is simply skipped by every reader. So a board that
// offers a move it knows will be skipped is charging somebody for nothing, and
// the board already SAID so - it printed "a submission from the wrong side is
// stored, charged, and skipped by every reader" and then opened the wallet
// anyway.
//
// THE ASYMMETRY THAT SHAPES EVERYTHING HERE. There are two ways to be wrong:
//
//   * Allow something replay rejects. Costs one network fee, and the board
//     already discloses that this can happen.
//   * BLOCK something replay would accept. Costs the move. The contract has no
//     turn gate, no state gate and no expiry (`submit` takes a game and a
//     string), so a board's refusal is the ONLY thing that can ever trap a
//     player in a game they cannot move in - and there is no way for them to
//     tell the board it is wrong.
//
// The second is far worse, so refusals come in two strengths rather than one:
//
//   yes   nothing objects
//   warn  this MIGHT be doomed, say why, and let it through on a second click
//   no    provably doomed given what the board has been told
//
// A hard `no` requires ONE thing the board does not always have: rules it has
// confirmed against the on-chain commitment. Without them it is refereeing a
// guess, and a guess may speak but may not lock a control - which is what
// `firm` is for, and the only reason `warn` still exists at the move level.
//
// It used to require a second thing, and dropping that is the substance of this
// file's history. The board cannot know which account will sign - the wallet
// chooses `tx-sender` and the request deliberately carries no sender field - so
// every address-derived refusal was a `warn` with a "send it anyway" button
// behind it. That reasoning has an unstated premise: that the two ways of being
// wrong cost about the same. They do not. Being wrong about the account costs a
// reconnect, which is free, instant, and undoable. Acting on the button costs a
// transaction that is stored forever, charged for, and skipped by every reader.
// So the address-derived cases are firm too, and the sentence that used to sit
// next to the button now sits next to a locked board and says to reconnect.
//
// What is left as a genuine `warn` is the case where the board is not wrong and
// not right but EARLY: a draw offer in the mempool that may or may not land
// first. Nothing there is provable yet, so nothing there is refused.
//
// Everything here calls checkSender() and sideOf() rather than reimplementing
// them. That is the point. The board and its referee disagreeing about the
// rules is the bug; a second implementation is how it happened.

import { ANYONE, ANYONE_ELSE, checkSender } from '../protocol/rules.js';
import type { Rules } from '../protocol/rules.js';
import { EVENT_STRINGS, parseEvent, sideOf } from '../replay/events.js';
import type { EventKind } from '../replay/events.js';
import type { ReplayState } from '../replay/replay.js';

export type Tier = 'yes' | 'warn' | 'no';

export interface Verdict {
  tier: Tier;
  /** Machine name, matching replay's own reason where one applies. */
  reason: string | null;
  /** The one sentence the player sees. Nothing re-derives it. */
  say: string;
}

export interface Ctx {
  state: ReplayState;
  /**
   * Whether the rules this board is refereeing hash to what the game committed.
   *
   * When false the board is, in its own words, refereeing nothing: its position
   * and its rules may both differ from the game's. It may still WARN, because a
   * guess is worth saying out loud, but it may not refuse - it would be
   * enforcing rules nobody agreed to.
   */
  rulesConfirmed: boolean;
  /** The connected account. NOT necessarily the account that will sign. */
  address: string | null;
  /** True when a draw offer is broadcast but not yet in a block. */
  mempoolHasOffer?: boolean;
}

const owned = (side: string): boolean => side !== ANYONE && side !== ANYONE_ELSE;

const warn = (reason: string, say: string): Verdict => ({ tier: 'warn', reason, say });

/**
 * A refusal, downgraded to a warning when the rules are not confirmed.
 *
 * The board may only enforce rules the game agreed to. Everything else is an
 * opinion, and an opinion gets to speak but not to lock a control.
 */
const firm = (rulesConfirmed: boolean, reason: string, say: string): Verdict =>
  rulesConfirmed ? { tier: 'no', reason, say } : { tier: 'warn', reason, say };

const CHARGED = 'It would be stored, charged, and skipped by every reader.';

/**
 * May this board submit a move right now?
 *
 * Called with no move string for the board-wide answer, which is what decides
 * whether squares are clickable. Nothing in `Rules` can permit one square and
 * forbid another - every field is about WHO and WHEN, never which - so the
 * answer is the same on all sixty-four.
 */
export function judgeMove(ctx: Ctx): Verdict {
  const { state, rulesConfirmed, address } = ctx;
  const rules: Rules = state.rules;

  if (state.fault) {
    return firm(
      rulesConfirmed,
      state.fault,
      state.fault === 'unsupported-protocol'
        ? 'This game committed to a protocol this board does not implement, so it can referee nothing. Nothing sent from here would count.'
        : 'This game committed to a start position that is not a position, so it can never be played. Nothing sent from here would count.'
    );
  }

  if (state.status !== 'live') {
    return firm(
      rulesConfirmed,
      'game-over',
      `This game is over. A submission now is still stored and still charged, and it counts for nothing.`
    );
  }

  if (!address) {
    // Not a refusal. A board with no wallet connected cannot say whose turn it
    // is relative to anybody, and connecting is the next step regardless.
    return { tier: 'yes', reason: null, say: 'Connect a wallet to play. Reading and replaying need nothing.' };
  }

  // The rules half, asked of the referee rather than re-derived.
  //
  // `history` is the ACCEPTED moves, which is what replay passes - rejected
  // submissions and control events are not moves and do not pace them.
  const broken = checkSender(rules, {
    sender: address,
    turn: state.turn,
    history: state.accepted.filter((row) => row.kind === 'move')
  });

  if (!broken) {
    return {
      tier: 'yes',
      reason: null,
      say: `Your move. It is ${state.turn} to move and you hold that side.`
    };
  }

  // These are address-derived, and the board cannot know which account the
  // wallet will actually sign with - so for a long time every one of them was a
  // warning with a "send it anyway" button behind it, on the reasoning that
  // locking the squares against an account somebody was about to switch away
  // from would refuse a move that is perfectly legal.
  //
  // THE ASYMMETRY IS THE OTHER WAY ROUND, and that is why they are firm now.
  //
  // Being wrong in one direction costs a click: the player reconnects with the
  // account they meant, which is free and instant. Being wrong in the other
  // costs a real transaction that is stored forever, charged for, and skipped by
  // every reader - and the board says so IN THE SAME BREATH as offering the
  // button. "It would be stored, charged, and skipped" is not a warning if there
  // is a control next to it that does exactly that.
  //
  // So when the rules are CONFIRMED these lock the board and say what to do
  // instead. When they are not, `firm` downgrades them to a warning by itself,
  // because a board that cannot referee a game has no business refusing moves in
  // it - which is the case the override was really built for.
  const bound = state.turn === 'white' ? rules.white : rules.black;
  const RECONNECT = 'If your wallet is set to a different account, reconnect with that one.';

  if (broken === 'not-allowed') {
    return firm(
      rulesConfirmed,
      broken,
      `This game is restricted to a named list, and ${address} is not on it. ${CHARGED} ${RECONNECT}`
    );
  }
  if (broken === 'consecutive') {
    return firm(
      rulesConfirmed,
      broken,
      `This game does not allow the same player to move twice running, and the last move was yours. ${CHARGED}`
    );
  }
  if (broken === 'cooldown') {
    return firm(
      rulesConfirmed,
      broken,
      `This game makes you wait ${rules.cooldown} move${rules.cooldown === 1 ? '' : 's'} between your own, and you have not waited that long. ${CHARGED}`
    );
  }

  // wrong-player: the wallet holds one colour and the other is to move.
  return firm(
    rulesConfirmed,
    broken,
    `It is ${state.turn} to move, and ${state.turn} is ${bound}. You are connected as ${address}. ${CHARGED} ${RECONNECT}`
  );
}

/**
 * May this board submit this control event right now?
 *
 * A SEPARATE predicate, and it must never share the move verdict. Replay
 * applies no turn check to events at all, and neither the cooldown nor the
 * no-consecutive rule reaches them - deliberately, because a player who could
 * be prevented from conceding would be stuck in a game with no way out.
 *
 * Resigning on the opponent's turn is not an edge case. It is when people
 * resign.
 */
export function judgeEvent(ctx: Ctx, value: string): Verdict {
  const { state, rulesConfirmed, address, mempoolHasOffer } = ctx;
  const rules: Rules = state.rules;
  const kind = parseEvent(value);

  if (!kind) {
    return firm(rulesConfirmed, 'malformed', `${value} is not a control event.`);
  }

  // A game that did not agree to events-v1 reads these bytes as a MOVE, and as
  // a move "resgn" is malformed. A guaranteed wasted fee.
  if (rules.eventsProtocol !== 'events-v1') {
    return firm(
      rulesConfirmed,
      'events-none',
      `This game did not agree to resignations or draw offers, so this board cannot send one. ${CHARGED}`
    );
  }

  if (state.fault || state.status !== 'live') {
    return firm(rulesConfirmed, 'game-over', 'This game is over.');
  }

  // Nobody owns an open board, so nobody can end one by agreement. That is
  // address-INDEPENDENT - it is true of every principal alive - which is the
  // rare case where a refusal can be proved without knowing the signer.
  if (!owned(rules.white) && !owned(rules.black)) {
    return firm(
      rulesConfirmed,
      'not-a-player',
      'Both sides of this game are open, so nobody owns it and nobody can resign or agree a draw. ' +
        'It ends by checkmate, stalemate, or a draw the position forces.'
    );
  }

  const side = sideOf(rules, address);

  if (kind === 'draw-offer' && state.pendingOffer !== null) {
    return firm(
      rulesConfirmed,
      'offer-pending',
      `${state.pendingOffer} has already offered a draw, and a second offer is refused rather than replacing it. ` +
        'Accept it, or play a move to let it lapse.'
    );
  }

  if (kind === 'draw-accept' && state.pendingOffer === null) {
    // The mempool may only LOOSEN a verdict, never create one. If an offer is
    // broadcast and not yet in a block, refusing this would block a submission
    // that lands right behind it.
    if (mempoolHasOffer) {
      return warn(
        'no-offer',
        'A draw offer is broadcast but not yet in a block. If it lands first this counts; if it does not, ' +
          'this is stored, charged, and skipped.'
      );
    }
    return firm(rulesConfirmed, 'no-offer', 'There is no draw offer to accept.');
  }

  // Everything from here reads `address`. That used to make it a warning; see
  // the header for why it no longer does. Both of these are rejections replay
  // performs by name - `sideOf` is the same function on both sides of the
  // question - so the board is not guessing, it is reading ahead.
  if (side === null) {
    // No wallet connected is not the same as a wallet that holds neither side,
    // and only the second is evidence of anything. A board that locked Resign
    // before connect would be refusing on the strength of having asked nobody -
    // and connecting is the next step regardless, exactly as in `judgeMove`.
    if (!address) {
      return warn(
        'not-a-player',
        'No wallet is connected, so this board cannot tell whether you hold a side here.'
      );
    }
    return firm(
      rulesConfirmed,
      'not-a-player',
      `Resigning and agreeing a draw belong to the two players, and ${address} holds neither side here. ` +
        `${CHARGED} If your wallet is set to a different account, reconnect with that one.`
    );
  }

  if (kind === 'draw-accept' && state.pendingOffer === side) {
    return firm(
      rulesConfirmed,
      'no-offer',
      'That offer is yours. Accepting your own offer is not agreement, and replay skips it. ' +
        'It ends when the other side accepts, or lapses when either of you plays a move.'
    );
  }

  return { tier: 'yes', reason: null, say: sayFor(kind, side) };
}

function sayFor(kind: EventKind, side: 'white' | 'black'): string {
  if (kind === 'resign') return `Resigning as ${side}. The other side wins.`;
  if (kind === 'draw-offer') return `Offering a draw as ${side}.`;
  return `Accepting the draw as ${side}.`;
}

/** Which verdict function a submission belongs to. */
export function judge(ctx: Ctx, value: string | null): Verdict {
  if (value !== null && parseEvent(value)) return judgeEvent(ctx, value);
  return judgeMove(ctx);
}

export { EVENT_STRINGS };
