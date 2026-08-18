// Adopting a game you opened, when opening one does not mean you may play it.
//
// The launch track opens a standard game and then submits a move to it, and it
// adopts a game from a previous run rather than paying the fee twice. It chose
// that game with `openedBy === signer`, which is a different question from the
// one that matters.
//
// On this contract those two questions have different answers, and there is a
// real game proving it. The deployer opened game 9; game 9's rules hash is
// byte-identical to game 8's, and game 8 is played by two entirely different
// wallets. So the track adopted a game its signer could not move in, and the
// step meant to prove "one click, one entry" would have fired a move into
// somebody else's game — confirmed and charged, then skipped by replay for
// landing on an empty square. Exactly what game 12 has five copies of.
//
// The identity of a game is its RULES HASH. Matching it means the rules are the
// ones this step creates, which name this signer as white.

import { describe, expect, it } from 'vitest';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';

const SIGNER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const OTHER = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';

/** The rules the launch track's `standard` step opens with. */
const trackRules = (signer: string) =>
  normaliseRules({ ...DEFAULT_RULES, white: signer, black: 'anyone-else' });

/** What the fixed step asks of a candidate row. */
const adopts = (signer: string, committed: string | null): boolean =>
  String(committed ?? '').toLowerCase() === rulesHash(trackRules(signer)).toLowerCase();

describe('which game the launch track may adopt', () => {
  it('adopts one opened with exactly these rules', () => {
    const committed = rulesHash(trackRules(SIGNER));
    expect(adopts(SIGNER, committed)).toBe(true);
  });

  it('refuses a game whose rules name somebody else', () => {
    // Game 9's shape: opened by the signer, rules belonging to two other people.
    const someoneElses = rulesHash(
      normaliseRules({ ...DEFAULT_RULES, white: OTHER, black: SIGNER })
    );
    expect(adopts(SIGNER, someoneElses)).toBe(false);
  });

  it('refuses a game that committed to no rules at all', () => {
    // Nothing pins what it was, so nothing can say the signer may move in it.
    expect(adopts(SIGNER, null)).toBe(false);
  });

  it('is a different question from who opened it', () => {
    // The point, stated as an assertion. Two games can share an opener and not
    // share a single player, which is what made the old test wrong.
    const mine = rulesHash(trackRules(SIGNER));
    const theirs = rulesHash(normaliseRules({ ...DEFAULT_RULES, white: OTHER, black: 'anyone-else' }));
    expect(mine).not.toEqual(theirs);
    expect(adopts(SIGNER, theirs)).toBe(false);
  });

  it('does not adopt a game opened for a different signer', () => {
    expect(adopts(SIGNER, rulesHash(trackRules(OTHER)))).toBe(false);
  });
});
