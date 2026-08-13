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

// ---------------------------------------------------------------------------
// The bound, and why it exists.
//
// Anybody may submit to any game: the contract filters on length and forms no
// opinion. So the sender list is chosen by whoever wants to fill it, and this
// search is QUADRATIC in its size. Measured before the cap, on a laptop:
//
//     100 distinct senders     21,218 candidates      188 ms
//   1,000 distinct senders  2,012,018 candidates   14,388 ms
//
// synchronously, on the main thread, and several times worse on a phone. That
// was not one slow game: recovery runs for every game in the explorer and every
// ranked game on the leaderboard, so ONE ranked game stuffed with junk froze the
// leaderboard for every visitor - permanently, in an artefact that cannot be
// patched.
// ---------------------------------------------------------------------------

describe('the bound on the search', () => {
  const C32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const junk = (i: number): string => {
    let text = '';
    let n = i;
    for (let at = 0; at < 39; at++) {
      text += C32[n % 32];
      n = Math.floor(n / 32) + at;
    }
    return `SP${text}`;
  };

  it('still recovers a real game buried under a thousand junk senders', () => {
    // The two real players submit FIRST, which is why the window is taken from
    // the start of the log rather than from a sorted set: an attacker choosing
    // addresses chooses where in the alphabet they land, and sorting hands them
    // the truncation.
    const rules = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB });
    const senders = [ALICE, BOB, ...Array.from({ length: 1000 }, (_, i) => junk(i))];

    const found = recoverRules({
      rulesHash: rulesHash(rules),
      openedBy: ALICE,
      ranked: false,
      senders
    });

    expect(found.confirmed, 'a real game became unrecoverable').toBe(true);
    expect(found.rules.white).toBe(ALICE);
    expect(found.rules.black).toBe(BOB);
  });

  it('does the work in constant time however much junk is added', () => {
    const senders = (n: number): string[] => [
      ALICE,
      BOB,
      ...Array.from({ length: n }, (_, i) => junk(i))
    ];
    const cost = (n: number): number =>
      recoverRules({
        rulesHash: '00'.repeat(32),
        openedBy: ALICE,
        ranked: true,
        senders: senders(n)
      }).tried;

    // Unbounded, these would be 21,218 and 2,012,018.
    expect(cost(100)).toBe(cost(1000));
    expect(cost(1000)).toBeLessThan(600);
  });

  it('finishes fast enough that a poisoned game cannot freeze a leaderboard', () => {
    // A timing assertion, kept deliberately. Only a clock can catch this
    // returning: every other property here would still hold at fourteen
    // seconds a game.
    const senders = [ALICE, BOB, ...Array.from({ length: 2000 }, (_, i) => junk(i))];
    const started = Date.now();
    recoverRules({ rulesHash: '00'.repeat(32), openedBy: ALICE, ranked: true, senders });
    expect(Date.now() - started, 'the search got slow again').toBeLessThan(200);
  });

  it('never truncates the viewer out of the search', () => {
    // Recovery has always been reader-dependent in one documented way: a board
    // can confirm a game naming the person looking at it where a stranger's
    // board cannot. Squeezing the viewer out with the cap would turn that
    // widening into a divergence between two honest readers.
    const rules = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB });
    const senders = Array.from({ length: 50 }, (_, i) => junk(i));

    const stranger = recoverRules({
      rulesHash: rulesHash(rules),
      openedBy: ALICE,
      ranked: false,
      senders
    });
    expect(stranger.confirmed, 'a stranger should not be able to confirm this').toBe(false);

    const bob = recoverRules({
      rulesHash: rulesHash(rules),
      openedBy: ALICE,
      ranked: false,
      senders,
      viewer: BOB
    });
    expect(bob.confirmed, 'the viewer was squeezed out by the cap').toBe(true);
  });

  it('keeps trying an offered rule set even when the search is exhausted', () => {
    // A remembered rule set or one carried in a shared link is already
    // hash-checked and is what rescues a freshly-opened game. It must sit
    // outside the cap, and be tried first.
    const rules = normaliseRules({
      ...DEFAULT_RULES,
      white: ALICE,
      black: BOB,
      cooldown: 3
    });
    const found = recoverRules({
      rulesHash: rulesHash(rules),
      openedBy: ALICE,
      ranked: false,
      senders: Array.from({ length: 500 }, (_, i) => junk(i)),
      candidates: [rules]
    });
    expect(found.confirmed, 'an offered rule set was lost behind the cap').toBe(true);
    expect(found.tried, 'the offered candidate was not tried first').toBe(1);
  });
});
