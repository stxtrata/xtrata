// What has to be true before a game's rules can be committed to the chain.
//
// Opening a game writes a hash of the rules. After that they are fixed: no
// edit, no migration, no way to reach whoever joined. So the bar is not "will
// this parse" but "is every choice here deliberate, and can it still be
// satisfied tomorrow".

import { describe, expect, it } from 'vitest';
import {
  ANYONE,
  looksLikeName,
  looksLikePrincipal,
  normaliseRules,
  readyToOpen,
  rulesHash
} from '../src/rules.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF';

const draft = (over = {}) => ({ white: ANYONE, black: ANYONE, cooldown: 0, ...over });

describe('telling a principal from a name', () => {
  it('knows an address', () => {
    expect(looksLikePrincipal(ALICE)).toBe(true);
    expect(looksLikePrincipal('sp3jnsexazp4bdshv0dn3m8r3p0my0eebqqzx743x')).toBe(true);
    expect(looksLikePrincipal('jim.btc')).toBe(false);
    expect(looksLikePrincipal('')).toBe(false);
  });

  it('knows a name', () => {
    expect(looksLikeName('jim.btc')).toBe(true);
    expect(looksLikeName('XTRATA.BTC')).toBe(true);
    expect(looksLikeName('no-dot')).toBe(false);
    expect(looksLikeName(ALICE)).toBe(false);
  });
});

describe('what stops a game being opened', () => {
  it('a blank side, because blank quietly means anyone', () => {
    const check = readyToOpen(draft({ white: '' }));
    expect(check.ready).toBe(false);
    expect(check.problems[0].field).toBe('white');
    expect(check.problems[0].message).toMatch(/not set/);
  });

  // The reason blank is refused rather than defaulted: normaliseRules turns it
  // into the most permissive rule there is, and does so silently.
  it('and blank really would have meant anyone', () => {
    expect(normaliseRules({ white: '' }).white).toBe(ANYONE);
    expect(normaliseRules({ white: '   ' }).white).toBe(ANYONE);
  });

  it('a typo, which would lock that side out for good', () => {
    const check = readyToOpen(draft({ black: 'SP3JN-oops' }));
    expect(check.ready).toBe(false);
    expect(check.problems[0].message).toMatch(/neither a Stacks address nor a \.btc name/);
  });

  // The one that matters most. Replay compares principals, and a sealed board
  // has no network, so a name left unresolved is a side nobody can ever play.
  it('a name that has not been looked up yet', () => {
    const check = readyToOpen(draft({ white: 'jim.btc' }));
    expect(check.ready).toBe(false);
    expect(check.unresolved).toEqual(['jim.btc']);
  });

  it('and it reports every name still to resolve, not just the first', () => {
    const check = readyToOpen(draft({ white: 'jim.btc', black: 'xtrata.btc' }));
    expect(check.unresolved).toEqual(['jim.btc', 'xtrata.btc']);
  });

  it('a cooldown that is not a whole number of blocks', () => {
    for (const cooldown of ['soon', -1, 2.5]) {
      expect(readyToOpen(draft({ cooldown })).ready).toBe(false);
    }
  });

  it('an empty draft fails on both sides at once', () => {
    const check = readyToOpen({});
    expect(check.ready).toBe(false);
    expect(check.problems.map((p) => p.field)).toEqual(['white', 'black']);
  });
});

describe('what is allowed through', () => {
  it('anyone, spelled out', () => {
    expect(readyToOpen(draft()).ready).toBe(true);
    expect(readyToOpen(draft({ white: 'ANYONE', black: ' anyone ' })).ready).toBe(true);
  });

  it('two addresses', () => {
    expect(readyToOpen(draft({ white: ALICE, black: BOB })).ready).toBe(true);
  });

  it('one side named, the other open', () => {
    expect(readyToOpen(draft({ white: ALICE })).ready).toBe(true);
  });

  it('a cooldown in blocks', () => {
    expect(readyToOpen(draft({ cooldown: 6 })).ready).toBe(true);
    expect(readyToOpen(draft({ cooldown: '0' })).ready).toBe(true);
  });
});

describe('resolving a name changes the commitment', () => {
  // Why the lookup has to happen before the hash rather than after: the hash of
  // a name and the hash of the address it points at are different, and only one
  // of them can ever be satisfied by a transaction sender.
  it('a name and its address do not hash alike', () => {
    const asName = rulesHash({ white: 'jim.btc', black: ANYONE });
    const asAddress = rulesHash({ white: ALICE, black: ANYONE });
    expect(asName).not.toBe(asAddress);
  });

  it('and the name form is one no sender could ever match', () => {
    // normaliseRules uppercases, so a name becomes JIM.BTC: not a principal,
    // and nothing a transaction can be sent from.
    const stored = normaliseRules({ white: 'jim.btc' }).white;
    expect(stored).toBe('JIM.BTC');
    expect(looksLikePrincipal(stored)).toBe(false);
  });
});
