// Recovering a game's rules from nothing but the chain.
//
// The bug this closes: the board could only referee a game whose rules somebody
// had already typed into the create form. A visitor arriving at a game had the
// log and the commitment and no way to use either, so every game read as
// "cannot confirm what rules this game committed to" and the board refereed
// nothing - including for the person who had just created it.

import { describe, expect, it } from 'vitest';
import { recoverRules } from '../../packages/protocol/recover.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { START_FEN } from '../../packages/chess/fen.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const CAROL = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const ANYONE_ELSE_VALUE = 'anyone-else';

const commit = (over: Partial<typeof DEFAULT_RULES>): string =>
  rulesHash(normaliseRules({ ...DEFAULT_RULES, ...over }));

describe('recovering rules', () => {
  it('recovers a two-player game from its creator and its senders', () => {
    // Exactly the shape the gates canary creates: white is the creator, black
    // is the sponsored opponent.
    const rules = { white: ALICE, black: BOB };
    const found = recoverRules({
      rulesHash: commit(rules),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.white).toBe(ALICE);
    expect(found.rules.black).toBe(BOB);
  });

  it('recovers it before anybody has moved at all', () => {
    // A freshly opened game has no senders. The creator alone has to be enough,
    // or a game is unreadable until its first move.
    const found = recoverRules({
      rulesHash: commit({ white: ALICE, black: ANYONE_ELSE_VALUE }),
      openedBy: ALICE,
      ranked: false,
      senders: []
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.black).toBe(ANYONE_ELSE_VALUE);
  });

  it('recovers the open board', () => {
    const found = recoverRules({
      rulesHash: commit({}),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB, CAROL]
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.white).toBe('anyone');
    expect(found.rules.black).toBe('anyone');
  });

  it('gets the colours the right way round', () => {
    // White and black are not interchangeable, and a board that swapped them
    // would reject every legal move as wrong-turn.
    const found = recoverRules({
      rulesHash: commit({ white: BOB, black: ALICE }),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.white).toBe(BOB);
    expect(found.rules.black).toBe(ALICE);
  });

  it('recovers a ranked game, and knows it is ranked', () => {
    const found = recoverRules({
      rulesHash: commit({ white: ALICE, black: BOB, ranked: true }),
      openedBy: ALICE,
      ranked: true,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.ranked).toBe(true);
  });

  it('trusts the hash over the ranked flag', () => {
    // The flag is a discovery hint. A game whose flag says ranked but whose
    // committed rules say otherwise must be read as its rules say.
    const found = recoverRules({
      rulesHash: commit({ white: ALICE, black: BOB, ranked: false }),
      openedBy: ALICE,
      ranked: true,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.ranked).toBe(false);
  });

  it('recovers one-against-the-world', () => {
    const found = recoverRules({
      rulesHash: commit({ white: ALICE, black: 'anyone-else' }),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB, CAROL]
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.black).toBe('anyone-else');
  });
});

describe('what it refuses to guess', () => {
  it('confirms nothing when the game committed to nothing', () => {
    // A board that refereed such a game would be enforcing rules the game never
    // agreed to, and would skip submissions every other reader accepts.
    const found = recoverRules({
      rulesHash: null,
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(false);
    expect(found.tried).toBe(0);
  });

  it('confirms nothing for rules outside what this board can create', () => {
    // A cooldown is not in the search space. The honest answer is "cannot
    // confirm", not a wrong position drawn confidently.
    const found = recoverRules({
      rulesHash: commit({ white: ALICE, black: BOB, cooldown: 3 }),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(false);
  });

  it('confirms nothing for a set-up starting position', () => {
    const found = recoverRules({
      rulesHash: commit({ white: ALICE, black: BOB, startFen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1' }),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(false);
  });

  it('confirms nothing when a player is not in the log or the creator', () => {
    // It can only try people the chain names. Somebody who was named as a side
    // and never moved, on a game opened by a third party, is unreachable.
    const found = recoverRules({
      rulesHash: commit({ white: BOB, black: CAROL }),
      openedBy: ALICE,
      ranked: false,
      senders: []
    });
    expect(found.confirmed).toBe(false);
  });

  it('never returns rules it could not confirm', () => {
    const found = recoverRules({
      rulesHash: 'ab'.repeat(32),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.confirmed).toBe(false);
    // Falls back to the defaults, which the caller must treat as "refereeing
    // nothing" rather than as the game's rules.
    expect(found.rules).toEqual(DEFAULT_RULES);
  });
});

describe('the search stays small', () => {
  it('tries a handful of candidates for an ordinary game', () => {
    // A search a visitor could notice would be worse than not knowing.
    const found = recoverRules({
      rulesHash: 'ab'.repeat(32),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.tried).toBeLessThan(100);
  });

  it('stays bounded even with several participants', () => {
    const found = recoverRules({
      rulesHash: 'ab'.repeat(32),
      openedBy: ALICE,
      ranked: true,
      senders: [BOB, CAROL, 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ']
    });
    expect(found.tried).toBeLessThan(200);
  });

  it('finds the open board almost immediately', () => {
    const found = recoverRules({
      rulesHash: commit({}),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB, CAROL]
    });
    expect(found.tried).toBe(1);
  });

  it('is deterministic: the same inputs give the same rules', () => {
    const input = {
      rulesHash: commit({ white: ALICE, black: BOB }),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB, CAROL]
    };
    const a = recoverRules(input);
    const b = recoverRules({ ...input, senders: [CAROL, BOB] });
    expect(a.rules).toEqual(b.rules);
    expect(a.confirmed && b.confirmed).toBe(true);
  });

  it('starts from the standard position, always', () => {
    const found = recoverRules({
      rulesHash: commit({ white: ALICE, black: BOB }),
      openedBy: ALICE,
      ranked: false,
      senders: [BOB]
    });
    expect(found.rules.startFen).toBe(START_FEN);
  });
});
