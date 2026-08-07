// One named player against everyone else.
//
// Naming White and leaving Black open is not this game: it lets the named
// player answer their own moves. ANYONE_ELSE is the missing half, and it is a
// distinguished value rather than a new field so that the hashed shape of a
// rule set never changes. Games already committed must keep hashing to the same
// bytes forever.

import { describe, expect, it } from 'vitest';
import {
  ANYONE,
  ANYONE_ELSE,
  REJECTED_BY_RULE,
  canonicalRules,
  checkSender,
  describeRules,
  normaliseRules,
  readyToOpen,
  rulesHash
} from '../src/rules.js';
import { JIM, KNOWN_GAMES, knownGame } from '../src/known-games.js';

const WORLD = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const STALE_JIM = 'SP162D87CY84QVVCMJKNKGHC7GGXFGA0TAR9D0XJW';
const OTHER = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF';

const GAME = { white: JIM, black: ANYONE_ELSE };
const ask = (sender, turn, rules = GAME) =>
  checkSender(rules, { sender, turn, height: 100, history: [] });

describe('jim.btc plays white, everyone else plays black', () => {
  it('lets the named player move white', () => {
    expect(ask(JIM, 'white')).toBe(null);
  });

  it('stops anyone else moving white', () => {
    expect(ask(WORLD, 'white')).toBe(REJECTED_BY_RULE.WRONG_PLAYER);
    expect(ask(OTHER, 'white')).toBe(REJECTED_BY_RULE.WRONG_PLAYER);
  });

  it('lets anyone else move black', () => {
    expect(ask(WORLD, 'black')).toBe(null);
    expect(ask(OTHER, 'black')).toBe(null);
  });

  // The point of the whole thing.
  it('stops the named player answering themselves as black', () => {
    expect(ask(JIM, 'black')).toBe(REJECTED_BY_RULE.WRONG_PLAYER);
  });

  it('is not case sensitive about the sender', () => {
    expect(ask(JIM.toLowerCase(), 'black')).toBe(REJECTED_BY_RULE.WRONG_PLAYER);
    expect(ask(JIM.toLowerCase(), 'white')).toBe(null);
  });
});

describe('anyone-else with nobody to exclude', () => {
  // Not a special case being swallowed: if the other side is open, there is no
  // particular person to keep out, and saying so plainly beats inventing one.
  it('behaves as anyone when the other side is open', () => {
    const rules = { white: ANYONE, black: ANYONE_ELSE };
    expect(checkSender(rules, { sender: JIM, turn: 'black', history: [] })).toBe(null);
    expect(checkSender(rules, { sender: WORLD, turn: 'black', history: [] })).toBe(null);
  });

  it('and when both sides say it', () => {
    const rules = { white: ANYONE_ELSE, black: ANYONE_ELSE };
    for (const turn of ['white', 'black']) {
      expect(checkSender(rules, { sender: JIM, turn, history: [] })).toBe(null);
    }
  });
});

describe('it still composes with the other rules', () => {
  it('an allow list still applies', () => {
    const rules = { white: JIM, black: ANYONE_ELSE, allow: [WORLD] };
    expect(checkSender(rules, { sender: OTHER, turn: 'black', history: [] }))
      .toBe(REJECTED_BY_RULE.NOT_ALLOWED);
    expect(checkSender(rules, { sender: WORLD, turn: 'black', history: [] })).toBe(null);
  });

  it('no-two-in-a-row still applies', () => {
    const rules = { white: JIM, black: ANYONE_ELSE, noConsecutive: true };
    const history = [{ sender: WORLD, height: 10 }];
    expect(checkSender(rules, { sender: WORLD, turn: 'black', history }))
      .toBe(REJECTED_BY_RULE.CONSECUTIVE);
  });
});

describe('the shape that gets hashed', () => {
  // If this changes, every game already committed becomes unreadable by the
  // board that is supposed to referee it.
  it('has not gained a field', () => {
    const parsed = JSON.parse(canonicalRules(GAME));
    expect(parsed).toHaveLength(7);
    expect(parsed[0]).toBe(1);
  });

  it('carries the exclusion in the side it belongs to', () => {
    const parsed = JSON.parse(canonicalRules(GAME));
    expect(parsed[1]).toBe(JIM);
    expect(parsed[2]).toBe(ANYONE_ELSE);
  });

  it('hashes differently from leaving black open', () => {
    expect(rulesHash({ white: JIM, black: ANYONE_ELSE }))
      .not.toBe(rulesHash({ white: JIM, black: ANYONE }));
  });

  it('normalises the same however it is typed', () => {
    for (const spelling of ['anyone-else', 'ANYONE-ELSE', ' Anyone-Else ']) {
      expect(normaliseRules({ black: spelling }).black).toBe(ANYONE_ELSE);
    }
  });
});

describe('opening a game with it', () => {
  it('is accepted as a decided side', () => {
    expect(readyToOpen({ white: JIM, black: ANYONE_ELSE, cooldown: 0 }).ready).toBe(true);
  });

  it('is not confused with a blank one', () => {
    expect(readyToOpen({ white: JIM, black: '', cooldown: 0 }).ready).toBe(false);
  });
});

describe('what it reads as', () => {
  it('says who is excluded rather than just "anyone"', () => {
    expect(describeRules(GAME)).toBe(
      `White can only be played by ${JIM} · Black can be played by anyone except ${JIM}`
    );
  });
});

describe('the game the board carries', () => {
  it('is game 1 on v3, and nothing else', () => {
    expect(Object.keys(KNOWN_GAMES)).toEqual([
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v3#1'
    ]);
  });

  it('is found by contract and number together', () => {
    const contract = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v3';
    expect(knownGame(contract, 1)).not.toBe(null);
    expect(knownGame(contract, '1')).not.toBe(null);

    // Game 1 exists on every version and they are different games.
    expect(knownGame('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v2', 1)).toBe(null);
    expect(knownGame(contract, 2)).toBe(null);
    expect(knownGame(null, 1)).toBe(null);
    expect(knownGame(contract, null)).toBe(null);
  });

  it('stores an address, never a name', () => {
    // A name in a rule set is a side nobody can play: replay compares
    // principals, and a sealed board has no network to resolve one.
    expect(JIM).toMatch(/^SP[0-9A-HJKMNP-TV-Z]+$/);
    for (const entry of Object.values(KNOWN_GAMES)) {
      for (const side of [entry.rules.white, entry.rules.black]) {
        expect(side === ANYONE || side === ANYONE_ELSE || /^SP/.test(side)).toBe(true);
      }
    }
  });

  // The legacy /v1/names/ endpoint still answers this name with an address that
  // has not held it since it moved to BNS-V2. It got as far as a committed rule
  // set once; it must not again.
  it('is not the address the legacy BNS index reports', () => {
    expect(JIM).toBe('SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7');
    expect(JIM).not.toBe(STALE_JIM);
  });

  it('is the one-against-the-world setup', () => {
    const contract = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v3';
    const { rules } = knownGame(contract, 1);
    expect(rules.white).toBe(JIM);
    expect(rules.black).toBe(ANYONE_ELSE);
  });
});
