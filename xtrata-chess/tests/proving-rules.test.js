// Recovering a game's rules from the hash it committed to.
//
// The chain stores a hash and never the rules, so a hash cannot be turned back
// into them. But it can confirm them: if a candidate rule set hashes to what a
// game committed, that is not a guess — no other rule set could produce it.
//
// Without this the board says "rules unknown" for game #2 while the rules that
// open it sit in the panel on the same screen, and referees nothing.

import { describe, expect, it } from 'vitest';
import { isOpenBoard, normaliseRules, rulesHash, rulesMatchCommitment } from '../src/rules.js';

// The method under test, lifted out of the class so it can be driven without a
// DOM. The assertion at the bottom keeps it honest.
function adoptMatchingDraft(board) {
  if (!board.committedHash || board.isChild) return;
  const draft = board.draftRules();
  if (isOpenBoard(draft) || !rulesMatchCommitment(draft, board.committedHash)) return;
  board.gameRules = draft;
  board.rulesSource = 'panel';
}

// Exactly what game #2 on v3 committed to.
const GAME_2 = { white: 'anyone', black: 'anyone', cooldown: 0, noConsecutive: true };
const GAME_2_HASH = '46c9f06dfdc945033a112c4fb31be236d05cdb24fa1f8b13cd290e104f96c6ac';

const board = (over = {}) => ({
  committedHash: GAME_2_HASH,
  isChild: false,
  gameRules: null,
  rulesSource: null,
  draftRules: () => normaliseRules(GAME_2),
  ...over
});

describe('the hash game #2 actually committed', () => {
  it('is what these rules produce', () => {
    expect(rulesHash(GAME_2)).toBe(GAME_2_HASH);
  });
});

describe('proving a game’s rules from the panel', () => {
  it('adopts them when they hash to the commitment', () => {
    const b = board();
    adoptMatchingDraft(b);
    expect(b.gameRules).toEqual(normaliseRules(GAME_2));
    expect(b.rulesSource).toBe('panel');
  });

  it('refuses rules that hash to anything else', () => {
    const b = board({ draftRules: () => normaliseRules({ white: 'anyone', black: 'anyone', cooldown: 3 }) });
    adoptMatchingDraft(b);
    expect(b.gameRules).toBe(null);
  });

  // A game with no commitment is the open board; there is nothing to prove and
  // nothing to enforce, and matching "no rules" against it would be circular.
  it('does nothing for a game that committed to nothing', () => {
    const b = board({ committedHash: null });
    adoptMatchingDraft(b);
    expect(b.gameRules).toBe(null);
  });

  it('does not adopt the plain open-board rules', () => {
    const open = { white: 'anyone', black: 'anyone', cooldown: 0, noConsecutive: false };
    const b = board({
      committedHash: rulesHash(open),
      draftRules: () => normaliseRules(open)
    });
    adoptMatchingDraft(b);
    expect(b.gameRules).toBe(null);
  });

  // A generated board carries its own rules and checks them itself; it must
  // never take rules from a panel it does not show.
  it('never applies to a generated board', () => {
    const b = board({ isChild: true });
    adoptMatchingDraft(b);
    expect(b.gameRules).toBe(null);
  });
});

describe('the copy in this file matches the board', () => {
  it('guards the same four things', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const src = readFileSync(resolve(import.meta.dirname, '..', 'src', 'app.js'), 'utf8');
    const method = src.slice(
      src.indexOf('_adoptMatchingDraft() {'),
      src.indexOf('// Does the chain agree that this is the referee')
    );
    expect(method).toBeTruthy();
    expect(method).toContain('this.committedHash');
    expect(method).toContain('this.isChild');
    expect(method).toContain('isOpenBoard(draft)');
    expect(method).toContain('rulesMatchCommitment(draft, this.committedHash)');
  });
});
