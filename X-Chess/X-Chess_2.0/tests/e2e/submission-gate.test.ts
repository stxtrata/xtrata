// The board must not charge somebody for a move every reader will skip.
//
// The reported bug: a wallet holding White, on a game where it was Black to
// move, could select a black piece and open a wallet to pay for it. The board
// even PRINTED "a submission from the wrong side is stored, charged, and
// skipped by every reader" while doing it - the prose knew and the squares did
// not, because they were computed separately.
//
// THE HALF OF THIS FILE THAT MATTERS MOST IS THE SECOND HALF. Blocking a legal
// submission is worse than allowing a doomed one: the contract has no turn gate
// and no expiry, so a board's refusal is the only thing that can ever trap a
// player in a game they cannot move in, and there is no way for them to tell
// the board it is wrong. Every test under "must not block" is a case that looks
// doomed and is not.

import { describe, expect, it } from 'vitest';
import { judgeEvent, judgeMove } from '../../packages/ui/eligibility.js';
import type { Ctx } from '../../packages/ui/eligibility.js';
import { replay } from '../../packages/replay/replay.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { EVENT_STRINGS } from '../../packages/replay/events.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const CAROL = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

/** A replay state from a rule set and a list of (sender, submission) pairs. */
function game(
  rules: Partial<typeof DEFAULT_RULES>,
  rows: [string | null, string][] = []
) {
  return replay(
    rows.map(([sender, mv], seq) => ({ seq, mv, sender, height: 100 + seq })),
    { rules: normaliseRules({ ...DEFAULT_RULES, ...rules }) }
  );
}

function ctx(state: ReturnType<typeof game>, address: string | null, confirmed = true): Ctx {
  return { state, rulesConfirmed: confirmed, address, mempoolHasOffer: false };
}

describe('a move from the wrong side', () => {
  const duel = { white: ALICE, black: BOB };

  it('is REFUSED when the rules are confirmed', () => {
    // The reported bug, exactly: ALICE holds White, it is Black to move.
    const state = game(duel, [[ALICE, 'e2e4']]);
    expect(state.turn).toBe('black');

    const verdict = judgeMove(ctx(state, ALICE));
    expect(verdict.tier).not.toBe('yes');
    expect(verdict.reason).toBe('wrong-player');
    expect(verdict.say).toContain('black is');
    expect(verdict.say).toContain('stored, charged, and skipped');
  });

  it('agrees with replay, because it asks replay the same question', () => {
    // Not a parallel implementation. The board calls checkSender, which is the
    // function replay calls, with the arguments replay passes. The two cannot
    // disagree because there is only one of them.
    const state = game(duel, [[ALICE, 'e2e4']]);
    expect(judgeMove(ctx(state, ALICE)).reason).toBe('wrong-player');

    const after = game(duel, [
      [ALICE, 'e2e4'],
      [ALICE, 'e7e5']
    ]);
    expect(after.rejected.at(-1)?.reason).toBe('wrong-player');
  });

  it('lets the side to move play', () => {
    const state = game(duel, [[ALICE, 'e2e4']]);
    const verdict = judgeMove(ctx(state, BOB));
    expect(verdict.tier).toBe('yes');
    expect(verdict.say).toContain('you hold that side');
  });

  it('names the allow list, the cooldown and the no-consecutive rule too', () => {
    // All four live in checkSender, all four cost a fee, and the board had none
    // of them. Getting them for free is the reward for calling the referee
    // rather than reimplementing one of its rules.
    expect(judgeMove(ctx(game({ ...duel, allow: [BOB, CAROL] }), ALICE)).reason).toBe(
      'not-allowed'
    );
    expect(
      judgeMove(
        ctx(
          game({ white: 'anyone', black: 'anyone', noConsecutive: true }, [[ALICE, 'e2e4']]),
          ALICE
        )
      ).reason
    ).toBe('consecutive');
    expect(
      judgeMove(
        ctx(game({ white: 'anyone', black: 'anyone', cooldown: 3 }, [[ALICE, 'e2e4']]), ALICE)
      ).reason
    ).toBe('cooldown');
  });
});

describe('a game that is over, or that cannot be played', () => {
  it('refuses a move after the result', () => {
    // Fool's mate.
    const state = game({ white: ALICE, black: BOB }, [
      [ALICE, 'f2f3'],
      [BOB, 'e7e5'],
      [ALICE, 'g2g4'],
      [BOB, 'd8h4']
    ]);
    expect(state.status).toBe('over');
    expect(judgeMove(ctx(state, ALICE)).tier).toBe('no');
  });

  it('refuses everything on a game whose protocol this board cannot read', () => {
    const state = game({ white: ALICE, black: BOB, replayProtocol: 'replay-v9' });
    expect(state.fault).toBe('unsupported-protocol');
    expect(judgeMove(ctx(state, ALICE)).tier).toBe('no');
  });
});

// ---------------------------------------------------------------------------
// The half that matters more.
// ---------------------------------------------------------------------------

describe('what the gate MUST NOT block', () => {
  it('an open board, where anyone may play either colour', () => {
    // The shape the reported bug sits next to, and the one it is easiest to
    // confuse with. White and Black are both "anyone", so moving a black piece
    // with a wallet that "feels like White" is perfectly legal. A gate keyed on
    // your wallet's colour makes every open board unplayable.
    const state = game({ white: 'anyone', black: 'anyone' }, [[ALICE, 'e2e4']]);
    expect(state.turn).toBe('black');
    expect(judgeMove(ctx(state, ALICE)).tier).toBe('yes');
    expect(judgeMove(ctx(state, CAROL)).tier).toBe('yes');
  });

  it('anyone-else, which excludes only the named opposite side', () => {
    const state = game({ white: 'anyone-else', black: BOB });
    expect(judgeMove(ctx(state, CAROL)).tier).toBe('yes');
    expect(judgeMove(ctx(state, ALICE)).tier).toBe('yes');
    // BOB holds Black, so BOB may not also play White here.
    expect(judgeMove(ctx(state, BOB)).reason).toBe('wrong-player');
  });

  it('anyone-else on BOTH sides, which excludes nobody at all', () => {
    const state = game({ white: 'anyone-else', black: 'anyone-else' });
    expect(judgeMove(ctx(state, ALICE)).tier).toBe('yes');
  });

  it('a self-game, where one principal holds both sides', () => {
    // A gate built from sideOf instead of checkSender blocks this permanently:
    // sideOf returns 'white' unconditionally for a self-game, so it would call
    // every black move wrong-player. checkSender gets it right.
    const state = game({ white: ALICE, black: ALICE }, [[ALICE, 'e2e4']]);
    expect(state.turn).toBe('black');
    expect(judgeMove(ctx(state, ALICE)).tier).toBe('yes');
  });

  it('ANYTHING at all when the rules could not be confirmed', () => {
    // The board is refereeing nothing here: its rules, and therefore its
    // position, may both differ from the game's. It may say so; it may not
    // enforce. Every verdict softens to a warning, which leaves the squares
    // live.
    const state = game({ white: ALICE, black: BOB }, [[ALICE, 'e2e4']]);
    const verdict = judgeMove(ctx(state, ALICE, false));
    expect(verdict.reason).toBe('wrong-player');
    expect(verdict.tier, 'an unconfirmed board must never LOCK').toBe('warn');
  });

  it('a wrong-side move, softly - because the wallet may sign as somebody else', () => {
    // The board is told an address at connect time. The wallet chooses
    // tx-sender when it signs, and the request carries no sender field, so a
    // switched account is invisible here. Every address-derived refusal is
    // therefore a warning with a way past it, never a lock.
    const state = game({ white: ALICE, black: BOB }, [[ALICE, 'e2e4']]);
    expect(judgeMove(ctx(state, ALICE)).tier).toBe('warn');
  });
});

describe('control events are judged separately, and turn is not an input', () => {
  const duel = { white: ALICE, black: BOB };

  it('lets a player resign on the OPPONENT s turn', () => {
    // Which is when people resign. Replay applies no turn check to an event at
    // all; a board that keyed Resign off the move verdict would refuse exactly
    // the case that matters.
    const state = game(duel, [[ALICE, 'e2e4']]);
    expect(state.turn).toBe('black');
    expect(judgeEvent(ctx(state, ALICE), EVENT_STRINGS.RESIGN).tier).toBe('yes');
  });

  it('lets a player resign under a cooldown they have not served', () => {
    // Applying the cooldown to a concession would make a game unfinishable.
    const state = game({ white: ALICE, black: BOB, cooldown: 3 }, [[ALICE, 'e2e4']]);
    expect(judgeMove(ctx(state, ALICE)).reason).toBe('wrong-player');
    expect(judgeEvent(ctx(state, ALICE), EVENT_STRINGS.RESIGN).tier).toBe('yes');
  });

  it('never LOCKS resign for want of a connected wallet', () => {
    // A control event moves no money, so a wallet can sign one without this
    // board having been told which account it is.
    const state = game(duel);
    expect(judgeEvent(ctx(state, null), EVENT_STRINGS.RESIGN).tier).not.toBe('no');
  });

  it('never LOCKS resign on an unconfirmed game', () => {
    // The worst possible false refusal. On an unconfirmed game the board falls
    // back to an open board, on which nobody owns the game and nobody can
    // resign - so a hard gate here would disable Resign on every unconfirmed
    // game permanently, trapping the player.
    const state = game({ white: 'anyone', black: 'anyone' });
    const verdict = judgeEvent(ctx(state, ALICE, false), EVENT_STRINGS.RESIGN);
    expect(verdict.tier).toBe('warn');
  });

  it('refuses a resignation on a genuinely ownerless game, when confirmed', () => {
    // Address-independent: true of every principal alive, so no override could
    // help and saying so plainly is the honest answer.
    const state = game({ white: 'anyone', black: 'anyone' });
    const verdict = judgeEvent(ctx(state, ALICE, true), EVENT_STRINGS.RESIGN);
    expect(verdict.tier).toBe('no');
    expect(verdict.say).toContain('nobody owns it');
  });

  it('refuses a second draw offer while one stands', () => {
    const state = game(duel, [[ALICE, EVENT_STRINGS.DRAW_OFFER]]);
    expect(state.pendingOffer).toBe('white');
    expect(judgeEvent(ctx(state, BOB), EVENT_STRINGS.DRAW_OFFER).reason).toBe('offer-pending');
  });

  it('refuses accepting nothing, and refuses accepting your OWN offer softly', () => {
    expect(judgeEvent(ctx(game(duel), ALICE), EVENT_STRINGS.DRAW_ACCEPT).tier).toBe('no');

    const standing = game(duel, [[ALICE, EVENT_STRINGS.DRAW_OFFER]]);
    const own = judgeEvent(ctx(standing, ALICE), EVENT_STRINGS.DRAW_ACCEPT);
    expect(own.reason).toBe('no-offer');
    expect(own.tier, 'address-derived, so a warning').toBe('warn');

    expect(judgeEvent(ctx(standing, BOB), EVENT_STRINGS.DRAW_ACCEPT).tier).toBe('yes');
  });

  it('lets an acceptance through when the offer is only in the MEMPOOL', () => {
    // The mempool may loosen a verdict and never create one. Refusing here
    // would block a submission that lands right behind the offer.
    const state = game(duel);
    const verdict = judgeEvent(
      { ...ctx(state, BOB), mempoolHasOffer: true },
      EVENT_STRINGS.DRAW_ACCEPT
    );
    expect(verdict.tier).toBe('warn');
    expect(verdict.say).toContain('not yet in a block');
  });

  it('refuses a control event on a game that did not agree to events', () => {
    const state = game({ white: ALICE, black: BOB, eventsProtocol: 'events-none' });
    expect(judgeEvent(ctx(state, ALICE), EVENT_STRINGS.RESIGN).tier).toBe('no');
  });
});

// ---------------------------------------------------------------------------
// The lock, and the way out of it.
// ---------------------------------------------------------------------------

describe('the override', () => {
  // The board locks the squares on a confirmed wrong-side verdict, which is
  // what the reported bug asked for. That lock is only safe because it comes
  // with a way past it, on screen, always. The board cannot know which account
  // the wallet will sign with - the request carries no sender field - so it
  // will sometimes be wrong, and being wrong must cost a click rather than a
  // game.
  it('is a documented property of the design, not an accident', () => {
    // Held at the DOM level in tests/e2e/pending-move.test.ts. Stated here so
    // the reasoning sits beside the verdict function it protects.
    const state = game({ white: ALICE, black: BOB }, [[ALICE, 'e2e4']]);
    const verdict = judgeMove(ctx(state, ALICE));
    expect(verdict.tier, 'the verdict itself must stay soft').toBe('warn');
  });
});
