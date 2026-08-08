// A game names two players and the chain never learns their names.
//
// `get-game` returns the opener, the height, `ranked`, and a 32-byte hash. The
// players are in the rule set that hash commits to, and nowhere else. So a
// freshly-opened game naming two people has nothing on chain to recover them
// from - the search builds candidates out of the opener plus everyone who has
// submitted, and nobody has submitted.
//
// The board therefore displayed a named game as "anyone can play either
// colour", to the very person who had just typed two addresses into it. Twice,
// on two different games, because explaining the cause is not fixing it.

import { beforeEach, describe, expect, it } from 'vitest';
import {
  decode,
  encode,
  knownRules,
  linkForGame,
  rememberRules,
  rulesFromLink
} from '../../packages/protocol/known-rules.js';
import { recoverRules } from '../../packages/protocol/recover.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const CAROL = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

const NAMED = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB, ranked: true });

/** A localStorage that behaves, for a test environment that has none. */
function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v)
  } as Storage;
}

beforeEach(() => {
  (globalThis as unknown as Record<string, unknown>).localStorage = fakeStorage();
});

describe('the search, and why it needs help', () => {
  it('CANNOT recover a named game before anybody has moved', () => {
    // The bug, stated as the fact underneath it. Game 5 on the canary contract:
    // opened by a third address, zero submissions, two named players. Eighteen
    // candidates tried and none matched.
    const found = recoverRules({
      rulesHash: rulesHash(NAMED),
      openedBy: CAROL,
      ranked: true,
      senders: []
    });
    expect(found.confirmed).toBe(false);
    expect(found.rules.white).toBe('anyone');
  });

  it('recovers it once one of the named players has submitted', () => {
    const found = recoverRules({
      rulesHash: rulesHash(NAMED),
      openedBy: CAROL,
      ranked: true,
      senders: [ALICE, BOB]
    });
    expect(found.confirmed).toBe(true);
  });
});

describe('what this browser remembers', () => {
  it('recovers a named game with no moves at all', () => {
    rememberRules(NAMED);
    const found = recoverRules({
      rulesHash: rulesHash(NAMED),
      openedBy: CAROL,
      ranked: true,
      senders: [],
      candidates: [knownRules(rulesHash(NAMED))!].filter(Boolean)
    });
    expect(found.confirmed).toBe(true);
    expect(found.rules.white).toBe(ALICE);
    expect(found.rules.black).toBe(BOB);
  });

  it('returns nothing for a game it never saw', () => {
    rememberRules(NAMED);
    const other = normaliseRules({ ...DEFAULT_RULES, white: CAROL, black: BOB });
    expect(knownRules(rulesHash(other))).toBe(null);
  });

  it('DISCARDS a remembered rule set that no longer hashes to the commitment', () => {
    // Ordinary browser storage: another page on the same origin can write to
    // it, and so can anybody with a console open. Trusting it would let a
    // board referee rules the game never agreed to, which is the one thing
    // this application must never do.
    rememberRules(NAMED);
    const key = `xchess:rules:${rulesHash(NAMED)}`;
    localStorage.setItem(key, JSON.stringify({ ...NAMED, white: CAROL }));
    expect(knownRules(rulesHash(NAMED))).toBe(null);
  });

  it('survives storage that is missing or throws', () => {
    (globalThis as unknown as Record<string, unknown>).localStorage = undefined;
    expect(() => rememberRules(NAMED)).not.toThrow();
    expect(knownRules(rulesHash(NAMED))).toBe(null);

    (globalThis as unknown as Record<string, unknown>).localStorage = {
      getItem() {
        throw new Error('denied');
      },
      setItem() {
        throw new Error('denied');
      },
      removeItem() {
        throw new Error('denied');
      }
    };
    expect(() => rememberRules(NAMED)).not.toThrow();
    expect(knownRules(rulesHash(NAMED))).toBe(null);
  });
});

describe('the link an opponent is sent', () => {
  it('carries rules their board can confirm', () => {
    const link = linkForGame('https://x.test/xchess.html', 6, NAMED);
    expect(link).toContain('game=6');
    expect(rulesFromLink(link, rulesHash(NAMED))).toEqual(NAMED);
  });

  it('is REFUSED when it does not match what the game committed', () => {
    // The whole safety of putting rules in a URL. Anybody can edit one.
    const doctored = normaliseRules({ ...DEFAULT_RULES, white: CAROL, black: CAROL });
    const link = linkForGame('https://x.test/xchess.html', 6, doctored);
    expect(rulesFromLink(link, rulesHash(NAMED))).toBe(null);
  });

  it('ignores a link with no rules, and one that is nonsense', () => {
    expect(rulesFromLink('https://x.test/xchess.html?game=6', rulesHash(NAMED))).toBe(null);
    expect(rulesFromLink('https://x.test/x.html?rules=!!!!', rulesHash(NAMED))).toBe(null);
    expect(rulesFromLink('not a url at all', rulesHash(NAMED))).toBe(null);
  });

  it('reads rules from the fragment as well as the query', () => {
    // A fragment never reaches a server, which is a reasonable thing for
    // somebody to prefer even though there is no server here to reach.
    const encoded = encode(JSON.stringify(NAMED));
    expect(rulesFromLink(`https://x.test/x.html#rules=${encoded}`, rulesHash(NAMED))).toEqual(
      NAMED
    );
  });

  it('round-trips text through the url-safe alphabet', () => {
    for (const text of ['', 'a', 'ab', 'abc', 'abcd', JSON.stringify(NAMED), '\\u2713 \\u00e9']) {
      expect(decode(encode(text))).toBe(text);
    }
    expect(encode(JSON.stringify(NAMED))).not.toMatch(/[+/=]/);
  });
});
