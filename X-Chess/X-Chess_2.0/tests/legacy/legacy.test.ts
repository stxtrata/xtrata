// Legacy games must stay exactly what they were.
//
// Three X Chess contracts are already deployed and immutable, holding games
// that were played under a protocol in which no string meant anything but a
// move. Those games are finished. The people who played them are not available
// to be asked whether a later reading is acceptable.
//
// So the test here is not "can we read them" - it is "does the new protocol
// leave them alone".

import { describe, expect, it } from 'vitest';
import { replay } from '../../packages/replay/replay.js';
import { REJECTED } from '../../packages/replay/result.js';
import { EVENT_STRINGS } from '../../packages/replay/events.js';
import { LEGACY_CONTRACTS, LEGACY_DEPLOYER, legacyRules } from '../../packages/chain/legacy.js';
import { DEFAULT_RULES } from '../../packages/protocol/rules.js';
import { EVENTS_NONE, EVENTS_PROTOCOL } from '../../packages/protocol/versions.js';
import { rulesHash } from '../../packages/protocol/canonical.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BOB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

const log = (...entries: [string, string][]) =>
  entries.map(([mv, sender], seq) => ({ mv, sender, seq, height: 900_000 + seq }));

/**
 * A golden legacy game.
 *
 * Deliberately contains `resgn` in the MIDDLE, sent by a bound player. Under
 * events-v1 that ends the game at once and White loses. Under the protocol this
 * game was actually played under, it is four characters of nonsense that replay
 * skips, and the game carries on to a genuine checkmate.
 *
 * The two readings give different winners, which is exactly why this matters.
 */
const SCHOLARS_WITH_NOISE = log(
  ['e2e4', ALICE],
  ['e7e5', BOB],
  ['resgn', ALICE],
  ['f1c4', ALICE],
  ['b8c6', BOB],
  ['d1h5', ALICE],
  ['g8f6', BOB],
  ['h5f7', ALICE]
);

describe('a legacy game is replayed under the protocol it was played under', () => {
  const legacy = legacyRules({ white: ALICE, black: BOB });

  it('treats a control string as the nonsense it was at the time', () => {
    const state = replay(SCHOLARS_WITH_NOISE, { rules: legacy });
    const noise = state.log.find((r) => r.raw === EVENT_STRINGS.RESIGN)!;
    expect(noise.status).toBe('rejected');
    expect((noise as { reason: string }).reason).toBe(REJECTED.MALFORMED);
  });

  it('reaches the result the game actually had', () => {
    const state = replay(SCHOLARS_WITH_NOISE, { rules: legacy });
    expect(state.result).toBe('1-0');
    expect(state.termination).toBe('checkmate');
    expect(state.accepted).toHaveLength(7);
  });

  it('would reach a DIFFERENT result under events-v1, which is the whole point', () => {
    // Same bytes, same players, opposite winner. If replay ignored the
    // committed events protocol, every legacy game containing one of these five
    // character sequences would silently change hands.
    const modern = { ...legacy, eventsProtocol: EVENTS_PROTOCOL };
    const state = replay(SCHOLARS_WITH_NOISE, { rules: modern });
    expect(state.result).toBe('0-1');
    expect(state.termination).toBe('resignation');
    expect(state.terminalSequence).toBe(2);
  });

  it('gives every entry after the third one a chance, rather than ending early', () => {
    const legacyState = replay(SCHOLARS_WITH_NOISE, { rules: legacy });
    const modernState = replay(SCHOLARS_WITH_NOISE, {
      rules: { ...legacy, eventsProtocol: EVENTS_PROTOCOL }
    });
    // Under events-v1 everything after the resignation is rejected as game-over.
    expect(modernState.rejected.filter((r) => r.reason === REJECTED.GAME_OVER)).toHaveLength(5);
    expect(legacyState.rejected.filter((r) => r.reason === REJECTED.GAME_OVER)).toHaveLength(0);
  });

  it('leaves the draw strings inert too', () => {
    const state = replay(
      log(['e2e4', ALICE], [EVENT_STRINGS.DRAW_OFFER, ALICE], [EVENT_STRINGS.DRAW_ACCEPT, BOB], ['e7e5', BOB]),
      { rules: legacy }
    );
    expect(state.result).toBeNull();
    expect(state.pendingOffer).toBeNull();
    expect(state.accepted).toHaveLength(2);
  });
});

describe('a protocol this build does not implement', () => {
  it('is refused rather than guessed at', () => {
    // Not "invalid". The game is fine; THIS build cannot say what it means, and
    // guessing would produce a position no other reader agrees with.
    const state = replay(log(['e2e4', ALICE]), {
      rules: { ...DEFAULT_RULES, eventsProtocol: 'events-v9' }
    });
    expect(state.fault).toBe('unsupported-protocol');
    expect(state.rejected[0].reason).toBe(REJECTED.UNSUPPORTED_PROTOCOL);
    expect(state.result).toBeNull();
  });

  it('is refused for an unknown replay protocol as well', () => {
    const state = replay(log(['e2e4', ALICE]), {
      rules: { ...DEFAULT_RULES, replayProtocol: 'replay-v7' }
    });
    expect(state.fault).toBe('unsupported-protocol');
  });

  it('accepts the two protocols this build does implement', () => {
    for (const events of [EVENTS_PROTOCOL, EVENTS_NONE]) {
      const state = replay(log(['e2e4', ALICE]), {
        rules: { ...DEFAULT_RULES, eventsProtocol: events }
      });
      expect(state.fault, events).toBeNull();
      expect(state.accepted, events).toHaveLength(1);
    }
  });
});

describe('legacy rules commit to something different', () => {
  it('hash differently from the same rules under events-v1', () => {
    // The commitment carries the events protocol, so a legacy game and a modern
    // game with otherwise identical rules are distinguishable on chain.
    const legacy = legacyRules({ white: ALICE, black: BOB });
    const modern = { ...legacy, eventsProtocol: EVENTS_PROTOCOL };
    expect(rulesHash(legacy)).not.toBe(rulesHash(modern));
  });

  it('are never ranked', () => {
    // Their participants never agreed to ranked play, and assigning
    // consequences to people who did not consent is not something a later
    // version gets to do.
    expect(legacyRules().ranked).toBe(false);
    expect(legacyRules({ ranked: true } as never).ranked).toBe(true);
    // ...but the adapter's own default, which is what a legacy reader uses,
    // never sets it.
    expect(legacyRules().eventsProtocol).toBe(EVENTS_NONE);
  });
});

describe('the legacy contracts are labelled, not hidden', () => {
  it('names all three, newest first', () => {
    expect(LEGACY_CONTRACTS.map((c) => c.name)).toEqual([
      'xtrata-chess-log-v3',
      'xtrata-chess-log-v2',
      'xtrata-chess-log-v1'
    ]);
    for (const contract of LEGACY_CONTRACTS) {
      expect(contract.label).toMatch(/^Legacy X Chess v[123]$/);
    }
  });

  it('keeps the deployer they are actually at', () => {
    expect(LEGACY_DEPLOYER).toBe('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
  });
});
