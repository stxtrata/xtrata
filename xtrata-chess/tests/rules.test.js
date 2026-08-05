// Child boards set their own rules, and the contract never learns any of them.
//
// Two properties carry the whole scheme. Every rule must be a pure function of
// the log, so that any reader reaches the same verdict from the same chain
// data. And the hash must be stable, because it is written on chain when the
// game opens and has to stay reproducible for as long as the game is readable.

import { describe, expect, it } from 'vitest';
import {
  ANYONE,
  DEFAULT_RULES,
  REJECTED_BY_RULE,
  canonicalRules,
  describeRules,
  isOpenBoard,
  normaliseRules,
  rulesHash,
  rulesMatchCommitment
} from '../src/rules.js';
import { replay, REJECTED } from '../src/replay.js';
import { START_FEN } from '../src/engine.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const MALLORY = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const duel = { ...DEFAULT_RULES, white: ALICE, black: BOB };

describe('the hash', () => {
  it('is stable across equivalent descriptions', () => {
    const a = rulesHash({ white: ALICE, black: BOB });
    const b = rulesHash({ black: BOB, white: ALICE, version: 1 });
    const c = rulesHash({ white: alice_lower(), black: BOB, cooldown: 0, allow: [] });
    expect(b).toBe(a);
    expect(c).toBe(a);
  });

  it('changes when any rule changes', () => {
    const base = rulesHash(duel);
    expect(rulesHash({ ...duel, cooldown: 1 })).not.toBe(base);
    expect(rulesHash({ ...duel, noConsecutive: true })).not.toBe(base);
    expect(rulesHash({ ...duel, white: BOB, black: ALICE })).not.toBe(base);
    expect(rulesHash({ ...duel, allow: [ALICE] })).not.toBe(base);
    expect(rulesHash({ ...duel, startFen: '8/8/4k3/8/8/4K3/8/8 w - - 0 1' })).not.toBe(base);
  });

  it('is 32 bytes of hex, which is what the contract stores', () => {
    expect(rulesHash(duel)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('ignores fields it does not know about', () => {
    expect(rulesHash({ ...duel, sneaky: 'value' })).toBe(rulesHash(duel));
  });

  // The canonical form is written into the chain via its hash, so its shape is
  // as permanent as anything in the contract.
  it('serialises to a fixed order that must never change', () => {
    expect(canonicalRules(duel)).toBe(
      JSON.stringify([1, ALICE, BOB, [], 0, false, START_FEN])
    );
  });

  it('sorts the allowlist so order of entry cannot change the hash', () => {
    expect(rulesHash({ allow: [BOB, ALICE] })).toBe(rulesHash({ allow: [ALICE, BOB] }));
  });
});

describe('matching the chain commitment', () => {
  it('treats a game with no commitment as the open board', () => {
    expect(rulesMatchCommitment(DEFAULT_RULES, null)).toBe(true);
    expect(rulesMatchCommitment(duel, null)).toBe(false);
  });

  it('accepts only the rule set that hashes to the commitment', () => {
    const committed = rulesHash(duel);
    expect(rulesMatchCommitment(duel, committed)).toBe(true);
    expect(rulesMatchCommitment(duel, `0x${committed}`)).toBe(true);
    expect(rulesMatchCommitment({ ...duel, cooldown: 5 }, committed)).toBe(false);
    expect(rulesMatchCommitment(DEFAULT_RULES, committed)).toBe(false);
  });

  it('is what stops two boards claiming the same game', () => {
    // A second board invents different rules for a game already committed.
    const honest = duel;
    const impostor = { ...DEFAULT_RULES, white: MALLORY, black: MALLORY };
    const committed = rulesHash(honest);

    expect(rulesMatchCommitment(honest, committed)).toBe(true);
    expect(rulesMatchCommitment(impostor, committed)).toBe(false);
  });
});

describe('binding colours to addresses', () => {
  it('lets the named players move and nobody else', () => {
    const state = replay(
      [
        { mv: 'e2e4', sender: ALICE },
        { mv: 'e7e5', sender: BOB },
        { mv: 'g1f3', sender: MALLORY },
        { mv: 'g1f3', sender: ALICE }
      ],
      { rules: duel }
    );

    expect(state.accepted.map((e) => e.san)).toEqual(['e4', 'e5', 'Nf3']);
    expect(state.rejected).toHaveLength(1);
    expect(state.rejected[0].reason).toBe(REJECTED_BY_RULE.WRONG_PLAYER);
    expect(state.rejected[0].sender).toBe(MALLORY);
  });

  it('stops a player moving for their opponent', () => {
    const state = replay(
      [
        { mv: 'e2e4', sender: ALICE },
        { mv: 'e7e5', sender: ALICE }
      ],
      { rules: duel }
    );
    expect(state.accepted).toHaveLength(1);
    expect(state.rejected[0].reason).toBe(REJECTED_BY_RULE.WRONG_PLAYER);
  });

  it('can bind one side and leave the other open', () => {
    const state = replay(
      [
        { mv: 'e2e4', sender: ALICE },
        { mv: 'e7e5', sender: MALLORY }
      ],
      { rules: { ...DEFAULT_RULES, white: ALICE } }
    );
    expect(state.accepted).toHaveLength(2);
  });
});

describe('the allowlist', () => {
  it('excludes everyone not on it, whichever side they play', () => {
    const rules = { ...DEFAULT_RULES, allow: [ALICE, BOB] };
    const state = replay(
      [
        { mv: 'e2e4', sender: ALICE },
        { mv: 'e7e5', sender: MALLORY },
        { mv: 'e7e5', sender: BOB }
      ],
      { rules }
    );
    expect(state.accepted).toHaveLength(2);
    expect(state.rejected[0].reason).toBe(REJECTED_BY_RULE.NOT_ALLOWED);
  });
});

describe('pacing rules', () => {
  it('refuses two moves in a row from one address', () => {
    const rules = { ...DEFAULT_RULES, noConsecutive: true };
    const state = replay(
      [
        { mv: 'e2e4', sender: ALICE },
        { mv: 'e7e5', sender: ALICE },
        { mv: 'e7e5', sender: BOB }
      ],
      { rules }
    );
    expect(state.accepted.map((e) => e.san)).toEqual(['e4', 'e5']);
    expect(state.rejected[0].reason).toBe(REJECTED_BY_RULE.CONSECUTIVE);
  });

  it('makes an address wait between its own moves', () => {
    const rules = { ...DEFAULT_RULES, cooldown: 10 };
    const state = replay(
      [
        { mv: 'e2e4', sender: ALICE, height: 100 },
        { mv: 'e7e5', sender: BOB, height: 101 },
        { mv: 'g1f3', sender: ALICE, height: 104 }, // too soon for Alice
        { mv: 'g1f3', sender: ALICE, height: 115 } // far enough
      ],
      { rules }
    );

    expect(state.accepted.map((e) => e.san)).toEqual(['e4', 'e5', 'Nf3']);
    expect(state.rejected).toHaveLength(1);
    expect(state.rejected[0].reason).toBe(REJECTED_BY_RULE.COOLDOWN);
  });

  it('measures the cooldown from that sender only', () => {
    const rules = { ...DEFAULT_RULES, cooldown: 10 };
    const state = replay(
      [
        { mv: 'e2e4', sender: ALICE, height: 100 },
        { mv: 'e7e5', sender: BOB, height: 101 } // Bob has never moved, so no wait
      ],
      { rules }
    );
    expect(state.accepted).toHaveLength(2);
  });
});

describe('a custom starting position', () => {
  it('is where the game begins', () => {
    const rules = { ...DEFAULT_RULES, startFen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1' };
    const state = replay([{ mv: 'e2e4', sender: ALICE }], { rules });
    expect(state.accepted).toHaveLength(1);
    expect(state.fen.startsWith('4k3/8/8/8/4P3/8/8/4K3')).toBe(true);
  });
});

describe('determinism under rules', () => {
  const rules = { ...DEFAULT_RULES, white: ALICE, black: BOB, cooldown: 3, noConsecutive: true };
  const log = [
    { mv: 'e2e4', sender: ALICE, height: 10 },
    { mv: 'e7e5', sender: MALLORY, height: 11 },
    { mv: 'e7e5', sender: BOB, height: 11 },
    { mv: 'g1f3', sender: ALICE, height: 12 },
    { mv: 'g1f3', sender: ALICE, height: 20 },
    { mv: 'junk!', sender: BOB, height: 21 },
    { mv: 'b8c6', sender: BOB, height: 22 }
  ];

  it('gives the same verdict on every entry, every time', () => {
    const first = replay(log, { rules });
    const second = replay(log, { rules });
    expect(second.log.map((e) => [e.seq, e.status, e.reason])).toEqual(
      first.log.map((e) => [e.seq, e.status, e.reason])
    );
  });

  // Note that rules can change who is allowed to move without changing the
  // resulting position at all, when the same moves get through from different
  // senders. To show divergence you need a log where an excluded sender would
  // otherwise have moved the game somewhere else.
  it('reads the same log differently under different rules, which is the point', () => {
    const divergent = [
      { mv: 'e2e4', sender: ALICE, height: 10 },
      // Open board: Black's move, played by a stranger. Duel: not their game.
      { mv: 'd7d5', sender: MALLORY, height: 11 },
      // Open board: White to move, so this lands. Duel: still Black to move.
      { mv: 'g1f3', sender: ALICE, height: 12 }
    ];

    const open = replay(divergent);
    const duelled = replay(divergent, { rules: duel });

    expect(open.accepted.map((e) => e.san)).toEqual(['e4', 'd5', 'Nf3']);
    expect(duelled.accepted.map((e) => e.san)).toEqual(['e4']);
    expect(open.fen).not.toBe(duelled.fen);
  });

  it('carries the rules it applied on the result', () => {
    expect(replay(log, { rules }).rules).toEqual(normaliseRules(rules));
    expect(replay(log).rules).toEqual(normaliseRules(DEFAULT_RULES));
  });

  it('still never throws, whatever the rules', () => {
    expect(() =>
      replay([{ mv: null, sender: null, height: null }, 'nonsense'], {
        rules: { white: null, allow: 'not an array', cooldown: 'soon' }
      })
    ).not.toThrow();
  });
});

describe('descriptions', () => {
  it('says what the open board is', () => {
    expect(describeRules(DEFAULT_RULES)).toBe('Anyone may move either side');
    expect(isOpenBoard(DEFAULT_RULES)).toBe(true);
    expect(isOpenBoard(duel)).toBe(false);
  });

  it('names the players and the pacing', () => {
    const text = describeRules({ ...duel, cooldown: 6, noConsecutive: true });
    expect(text).toContain(`White is ${ALICE}`);
    expect(text).toContain(`Black is ${BOB}`);
    expect(text).toContain('6 blocks');
  });
});

describe('normalising', () => {
  it('defaults everything that is missing', () => {
    expect(normaliseRules({})).toEqual(DEFAULT_RULES);
    expect(normaliseRules()).toEqual(DEFAULT_RULES);
    expect(normaliseRules(null)).toEqual(DEFAULT_RULES);
  });

  it('treats blank and "anyone" alike', () => {
    expect(normaliseRules({ white: '' }).white).toBe(ANYONE);
    expect(normaliseRules({ white: '  ' }).white).toBe(ANYONE);
    expect(normaliseRules({ white: 'ANYONE' }).white).toBe(ANYONE);
  });

  it('refuses a negative or fractional cooldown', () => {
    expect(normaliseRules({ cooldown: -5 }).cooldown).toBe(0);
    expect(normaliseRules({ cooldown: 2.7 }).cooldown).toBe(2);
    expect(normaliseRules({ cooldown: 'lots' }).cooldown).toBe(0);
  });
});

function alice_lower() {
  return ALICE.toLowerCase();
}
