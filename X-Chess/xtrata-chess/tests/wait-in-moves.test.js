// The wait between a player's own moves, counted in moves.
//
// It used to be counted in blocks, which sounds like a waiting time and is not
// one: a Stacks block is seconds, so a wait of six was about a minute and
// stopped nobody. Moves are the unit that means something in a game — "wait for
// three other people to play" holds however fast or slow the chain runs.

import { describe, expect, it } from 'vitest';
import { REJECTED_BY_RULE, checkSender, describeRules, normaliseRules } from '../src/rules.js';

const A = 'SP1AAA';
const B = 'SP1BBB';
const C = 'SP1CCC';

// Heights deliberately far apart, to prove the answer no longer depends on them.
const history = (...senders) =>
  senders.map((sender, i) => ({ sender, height: 1000 + i * 500 }));

const ask = (rules, sender, past, height = 99_999) =>
  checkSender({ white: 'anyone', black: 'anyone', ...rules }, {
    sender,
    turn: 'white',
    height,
    history: past
  });

describe('waiting a number of moves', () => {
  it('lets anyone move whenever, at zero', () => {
    expect(ask({ cooldown: 0 }, A, history(A))).toBe(null);
    expect(ask({ cooldown: 0 }, A, history(A, B, A))).toBe(null);
  });

  it('turns away a player whose own move was too recent', () => {
    expect(ask({ cooldown: 2 }, A, history(A, B))).toBe(REJECTED_BY_RULE.COOLDOWN);
    expect(ask({ cooldown: 3 }, A, history(A, B, C))).toBe(REJECTED_BY_RULE.COOLDOWN);
  });

  it('lets them back in once enough moves have gone by', () => {
    expect(ask({ cooldown: 2 }, A, history(A, B, C))).toBe(null);
    expect(ask({ cooldown: 3 }, A, history(A, B, C, B))).toBe(null);
  });

  it('never blocks a player who has not moved yet', () => {
    expect(ask({ cooldown: 5 }, A, [])).toBe(null);
    expect(ask({ cooldown: 5 }, C, history(A, B))).toBe(null);
  });

  // The whole point of the change. Two games with identical move lists must be
  // judged identically, whether they took an hour or a year.
  it('gives the same answer however far apart the blocks are', () => {
    const close = [{ sender: A, height: 100 }, { sender: B, height: 101 }];
    const distant = [{ sender: A, height: 100 }, { sender: B, height: 900_000 }];
    expect(ask({ cooldown: 2 }, A, close, 102)).toBe(REJECTED_BY_RULE.COOLDOWN);
    expect(ask({ cooldown: 2 }, A, distant, 1_000_000)).toBe(REJECTED_BY_RULE.COOLDOWN);
  });

  it('only counts against the player it belongs to', () => {
    // A is waiting; B is free to move.
    expect(ask({ cooldown: 3 }, A, history(A, B))).toBe(REJECTED_BY_RULE.COOLDOWN);
    expect(ask({ cooldown: 3 }, B, history(B, A))).toBe(REJECTED_BY_RULE.COOLDOWN);
    expect(ask({ cooldown: 3 }, C, history(A, B))).toBe(null);
  });
});

describe('the wait and "nobody twice in a row"', () => {
  // They are separate settings and both are applied. Worth pinning, because a
  // wait of 1 now means exactly what the checkbox means, and somebody reading
  // the panel should be able to trust that.
  it('a wait of one is the same rule as the checkbox', () => {
    const past = history(A);
    expect(ask({ cooldown: 1 }, A, past)).toBe(REJECTED_BY_RULE.COOLDOWN);
    expect(ask({ noConsecutive: true }, A, past)).toBe(REJECTED_BY_RULE.CONSECUTIVE);

    // And both let the same move through.
    expect(ask({ cooldown: 1 }, A, history(A, B))).toBe(null);
    expect(ask({ noConsecutive: true }, A, history(A, B))).toBe(null);
  });

  it('both apply when both are set, and the stricter one decides', () => {
    // The checkbox alone would allow this; the wait of three does not.
    expect(ask({ cooldown: 3, noConsecutive: true }, A, history(A, B))).toBe(
      REJECTED_BY_RULE.COOLDOWN
    );
  });

  it('setting one does not imply the other', () => {
    const rules = normaliseRules({ cooldown: 4 });
    expect(rules.noConsecutive).toBe(false);
    expect(normaliseRules({ noConsecutive: true }).cooldown).toBe(0);
  });
});

describe('how it reads', () => {
  it('says moves, not blocks', () => {
    const text = describeRules({ cooldown: 3 });
    expect(text).toContain('waits for 3 other moves');
    expect(text).not.toContain('block');
  });

  // Saying "waits for 1 other move" beside a checkbox that says the same thing
  // in plainer words would read as two different rules.
  it('a wait of one is described as the rule it is', () => {
    expect(describeRules({ cooldown: 1 })).toContain('nobody can move twice in a row');
  });
});

describe('a wait nobody could ever satisfy', () => {
  // The case that bites, and the reason this is refused rather than warned
  // about: A moves, B moves, and now A is one move short and so is B. Nobody
  // can ever move again, the rules are already hashed on chain, and the game is
  // a brick. There is no fixing it afterwards.
  it('locks a two-player game solid, which is why it is refused', async () => {
    const { readyToOpen } = await import('../src/rules.js');
    const both = { white: A, black: B, cooldown: 2 };

    // The rule really would deadlock: after two moves, neither can play, each
    // asked on the turn that is actually theirs.
    const past = history(A, B);
    expect(checkSender(both, { sender: A, turn: 'white', height: 9, history: past }))
      .toBe(REJECTED_BY_RULE.COOLDOWN);
    expect(checkSender(both, { sender: B, turn: 'black', height: 9, history: past }))
      .toBe(REJECTED_BY_RULE.COOLDOWN);

    // So it never gets as far as a wallet.
    const check = readyToOpen(both);
    expect(check.ready).toBe(false);
    expect(check.problems.some((p) => p.field === 'cooldown')).toBe(true);
    expect(check.problems.find((p) => p.field === 'cooldown').message)
      .toMatch(/needs 3 different people/);
  });

  it('allows the largest wait that still leaves somebody able to move', async () => {
    const { readyToOpen } = await import('../src/rules.js');
    expect(readyToOpen({ white: A, black: B, cooldown: 1 }).ready).toBe(true);
    expect(readyToOpen({ white: A, black: B, cooldown: 2 }).ready).toBe(false);
  });

  it('does not object when a side is open, since there is no limit to count', async () => {
    const { readyToOpen } = await import('../src/rules.js');
    expect(readyToOpen({ white: A, black: 'anyone-else', cooldown: 9 }).ready).toBe(true);
    expect(readyToOpen({ white: 'anyone', black: 'anyone', cooldown: 9 }).ready).toBe(true);
  });

  it('counts an allow list as the number of people it names', async () => {
    const { readyToOpen } = await import('../src/rules.js');
    const three = { white: 'anyone', black: 'anyone', allow: [A, B, C] };
    expect(readyToOpen({ ...three, cooldown: 2 }).ready).toBe(true);
    expect(readyToOpen({ ...three, cooldown: 3 }).ready).toBe(false);
  });
});
