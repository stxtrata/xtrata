// The canonical rules encoding, pinned.
//
// These bytes are a permanent protocol artefact. Any change to them breaks
// every game already committed on chain, because a rule set that no longer
// hashes to what the game stored can never be confirmed again and the board
// would referee nothing forever after.
//
// So this suite is deliberately unforgiving. If it fails, the encoding changed,
// and the encoding is not allowed to change.

import { describe, expect, it } from 'vitest';
import {
  CanonicalError,
  canonicalRules,
  rulesHash,
  rulesMatchCommitment
} from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules, readyToOpen } from '../../packages/protocol/rules.js';
import type { Rules } from '../../packages/protocol/rules.js';
import golden from './golden-rules-v1.json' with { type: 'json' };
import { VECTORS } from './vectors.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BOB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

describe('golden vectors', () => {
  it('covers every vector, with none dropped', () => {
    expect(golden).toHaveLength(VECTORS.length);
    expect(golden.map((g) => g.name)).toEqual(VECTORS.map((v) => v.name));
  });

  for (const entry of golden) {
    it(`${entry.name} still hashes to ${entry.sha256.slice(0, 12)}…`, () => {
      const rules = entry.rules as Rules;
      expect(canonicalRules(rules)).toBe(entry.canonical);
      expect(rulesHash(rules)).toBe(entry.sha256);
    });
  }

  it('gives every distinct rule set a distinct hash', () => {
    // Two vectors are the same allow list in a different order and must collide;
    // everything else must not.
    const byCanonical = new Map<string, string[]>();
    for (const entry of golden) {
      const list = byCanonical.get(entry.canonical) ?? [];
      list.push(entry.name);
      byCanonical.set(entry.canonical, list);
    }
    const collisions = [...byCanonical.values()].filter((names) => names.length > 1);
    expect(collisions).toEqual([
      ['allow list of three, given out of order', 'allow list of three, given in order']
    ]);
  });
});

describe('encoding shape', () => {
  it('is ten newline-separated fields, in the documented order', () => {
    const lines = canonicalRules(DEFAULT_RULES).split('\n');
    expect(lines).toHaveLength(10);
    expect(lines[0]).toBe('rules-v1');
    expect(lines[1]).toBe('replay-v1');
    expect(lines[2]).toBe('events-v1');
    expect(lines[3]).toBe('anyone');
    expect(lines[4]).toBe('anyone');
    expect(lines[5]).toBe('');
    expect(lines[6]).toBe('0');
    expect(lines[7]).toBe('0');
    expect(lines[8]).toBe('0');
  });

  it('names its own protocol first, so a reader knows what it is holding', () => {
    expect(canonicalRules(DEFAULT_RULES).startsWith('rules-v1\n')).toBe(true);
  });

  it('does not depend on the order the object keys were written in', () => {
    const a: Rules = {
      replayProtocol: 'replay-v1',
      eventsProtocol: 'events-v1',
      white: ALICE,
      black: BOB,
      allow: [],
      cooldown: 0,
      noConsecutive: false,
      ranked: true,
      startFen: DEFAULT_RULES.startFen
    };
    // Same values, declared in a different order.
    const b: Rules = {
      startFen: DEFAULT_RULES.startFen,
      ranked: true,
      noConsecutive: false,
      cooldown: 0,
      allow: [],
      black: BOB,
      white: ALICE,
      eventsProtocol: 'events-v1',
      replayProtocol: 'replay-v1'
    };
    expect(rulesHash(a)).toBe(rulesHash(b));
  });

  it('sorts and dedupes the allow list rather than trusting it', () => {
    const unsorted = { ...DEFAULT_RULES, allow: [BOB, ALICE] };
    const sorted = { ...DEFAULT_RULES, allow: [ALICE, BOB] };
    expect(rulesHash(unsorted)).toBe(rulesHash(sorted));
  });

  it('is emitted as ASCII, so encoding cannot vary between readers', () => {
    for (const vector of VECTORS) {
      const bytes = new TextEncoder().encode(canonicalRules(vector.rules));
      expect(bytes.every((b) => b < 0x80), vector.name).toBe(true);
    }
  });

  it('produces no field containing the separator', () => {
    for (const vector of VECTORS) {
      const lines = canonicalRules(vector.rules).split('\n');
      expect(lines).toHaveLength(10);
      // The allow field joins with commas, so nothing else may contain one.
      for (const [index, line] of lines.entries()) {
        if (index === 5) continue;
        expect(line.includes(','), `field ${index} of ${vector.name}`).toBe(false);
      }
    }
  });
});

describe('what it refuses', () => {
  const bad = (rules: Partial<Rules>, field: string): void => {
    let thrown: unknown = null;
    try {
      canonicalRules({ ...DEFAULT_RULES, ...rules } as Rules);
    } catch (error) {
      thrown = error;
    }
    expect(thrown, `expected ${field} to be refused`).toBeInstanceOf(CanonicalError);
    expect((thrown as CanonicalError).field).toBe(field);
  };

  it('refuses a BNS name where a principal belongs', () => {
    // The trap this exists for: a name that reaches the hash is a side nobody
    // can ever play, permanently, because replay compares principals.
    bad({ white: 'jim.btc' }, 'white');
    bad({ black: 'jim.btc' }, 'black');
  });

  it('refuses a non-ASCII side', () => {
    bad({ white: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJЗ' }, 'white');
  });

  it('refuses a side containing a newline or a comma', () => {
    bad({ white: `${ALICE}\nanyone` }, 'white');
    bad({ white: `${ALICE},${BOB}` }, 'white');
  });

  it('refuses letters c32 does not use', () => {
    // I, L, O and U are excluded from Crockford base32 precisely because they
    // are confusable, so an address containing one is a typo, not an address.
    bad({ white: 'SPIIIIIIII' }, 'white');
    bad({ white: 'SPOOOOOOOO' }, 'white');
  });

  it('refuses a non-integer or negative cooldown', () => {
    bad({ cooldown: 1.5 }, 'cooldown');
    bad({ cooldown: -1 }, 'cooldown');
    bad({ cooldown: Number.NaN }, 'cooldown');
    bad({ cooldown: Number.POSITIVE_INFINITY }, 'cooldown');
  });

  it('refuses a start position with characters FEN does not have', () => {
    bad({ startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\n' }, 'startFen');
    bad({ startFen: 'rnbqkbnr♟/8 w - - 0 1' }, 'startFen');
  });

  it('refuses a duplicate in the allow list rather than silently collapsing it', () => {
    bad({ allow: [ALICE, ALICE] }, 'allow');
  });

  it('refuses a non-principal in the allow list', () => {
    bad({ allow: ['anyone'] }, 'allow');
  });
});

describe('commitment matching', () => {
  it('confirms rules that hash to the commitment', () => {
    const rules = { ...DEFAULT_RULES, white: ALICE, black: BOB, ranked: true };
    expect(rulesMatchCommitment(rules, rulesHash(rules))).toBe(true);
    expect(rulesMatchCommitment(rules, `0x${rulesHash(rules)}`)).toBe(true);
    expect(rulesMatchCommitment(rules, rulesHash(rules).toUpperCase())).toBe(true);
  });

  it('refuses rules that do not, including a single flipped flag', () => {
    const rules = { ...DEFAULT_RULES, white: ALICE, black: BOB, ranked: true };
    const committed = rulesHash(rules);
    expect(rulesMatchCommitment({ ...rules, ranked: false }, committed)).toBe(false);
    expect(rulesMatchCommitment({ ...rules, white: BOB, black: ALICE }, committed)).toBe(false);
  });

  it('treats a missing commitment as no match, never as a free pass', () => {
    // A board that refereed a game which committed to nothing would be enforcing
    // rules the game never agreed to, and would skip moves every other reader
    // accepts.
    expect(rulesMatchCommitment(DEFAULT_RULES, null)).toBe(false);
    expect(rulesMatchCommitment(DEFAULT_RULES, '')).toBe(false);
  });

  it('returns false rather than throwing on rules that cannot be encoded', () => {
    expect(rulesMatchCommitment({ ...DEFAULT_RULES, white: 'jim.btc' }, 'ab'.repeat(32))).toBe(false);
  });
});

describe('normalisation', () => {
  it('never throws, whatever it is given', () => {
    const junk: unknown[] = [
      null,
      undefined,
      0,
      'nonsense',
      [],
      { white: 42 },
      { allow: 'not-an-array' },
      { cooldown: 'soon' },
      { startFen: 12 },
      { white: { toString: () => 'boom' } }
    ];
    for (const value of junk) {
      expect(() => normaliseRules(value)).not.toThrow();
    }
  });

  it('is idempotent, so hashing a normalised set is stable', () => {
    for (const vector of VECTORS) {
      const once = normaliseRules(vector.rules);
      const twice = normaliseRules(once);
      expect(canonicalRules(twice)).toBe(canonicalRules(once));
    }
  });

  it('upper-cases a principal, because the hash compares bytes', () => {
    expect(normaliseRules({ white: ALICE.toLowerCase() }).white).toBe(ALICE);
  });
});

describe('readiness to open', () => {
  it('refuses a wait no set of players could ever satisfy', () => {
    const check = readyToOpen({ white: ALICE, black: BOB, cooldown: 2 });
    expect(check.ready).toBe(false);
    expect(check.problems.some((p) => p.field === 'cooldown')).toBe(true);
  });

  it('allows a wait of one between two players, which is no-consecutive', () => {
    expect(readyToOpen({ white: ALICE, black: BOB, cooldown: 1 }).ready).toBe(true);
  });

  it('asks for a name to be resolved rather than hashing it', () => {
    const check = readyToOpen({ white: 'jim.btc', black: BOB });
    expect(check.ready).toBe(false);
    expect(check.unresolved).toEqual(['jim.btc']);
  });

  it('refuses a blank side rather than defaulting it to anyone', () => {
    expect(readyToOpen({ white: '', black: BOB }).ready).toBe(false);
  });

  it('requires a ranked game to name two different players', () => {
    expect(readyToOpen({ white: ALICE, black: BOB, ranked: true }).ready).toBe(true);
    expect(readyToOpen({ white: ALICE, black: ALICE, ranked: true }).ready).toBe(false);
    expect(readyToOpen({ white: ALICE, black: 'anyone', ranked: true }).ready).toBe(false);
    expect(readyToOpen({ white: ALICE, black: 'anyone-else', ranked: true }).ready).toBe(false);
  });

  it('requires a ranked game to start from the standard position', () => {
    expect(
      readyToOpen({ white: ALICE, black: BOB, ranked: true, startFen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1' })
        .ready
    ).toBe(false);
  });
});
