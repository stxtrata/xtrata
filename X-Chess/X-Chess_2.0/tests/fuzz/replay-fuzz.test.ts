// Replay under hostile input.
//
// The log is arbitrary strings written by anyone, by construction: the contract
// filters on length and nothing else, so any four or five characters can and
// eventually will be in a game. Two properties have to hold over all of it.
//
//   TOTAL          replay never throws, for any input at all
//   DETERMINISTIC  the same log and rules give the same answer, every time
//
// Seeds are fixed and printed on failure, so a failure is reproducible rather
// than a story about something that happened once. Any seed that ever fails
// gets pinned in REGRESSION_SEEDS below and stays there.

import { describe, expect, it } from 'vitest';
import { replay } from '../../packages/replay/replay.js';
import type { ReplayState, Submission } from '../../packages/replay/replay.js';
import { ALL_EVENT_STRINGS, EVENT_STRINGS } from '../../packages/replay/events.js';
import { DEFAULT_RULES } from '../../packages/protocol/rules.js';
import type { Rules } from '../../packages/protocol/rules.js';
import { Position } from '../../packages/chess/engine.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BOB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const MALLORY = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const SENDERS: (string | null)[] = [ALICE, BOB, MALLORY, null, '', 'not-a-principal'];

/** Seeds that have ever failed. They never come out. */
const REGRESSION_SEEDS: number[] = [];

/** mulberry32 — small, fast, and identical on every machine. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(random: () => number, list: readonly T[]): T =>
  list[Math.floor(random() * list.length) % list.length];

const FILES = 'abcdefgh';
const RANKS = '12345678';
const PROMOTIONS = 'nbrq';
const ASCII = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

/**
 * One submission string, drawn from the shapes a log actually contains.
 *
 * Weighted towards the plausible: a fuzzer that only ever produced line noise
 * would never get deep enough into a game to exercise the interesting rejection
 * paths, because every entry would fail at the first hurdle.
 */
function someMove(random: () => number, position: Position | null): string {
  const roll = random();

  // A legal move for the position reached so far, so games actually progress.
  if (roll < 0.45 && position) {
    const legal = position.movesUci();
    if (legal.length) return pick(random, legal);
  }
  // A well-formed but probably illegal move.
  if (roll < 0.65) {
    return (
      pick(random, [...FILES]) + pick(random, [...RANKS]) +
      pick(random, [...FILES]) + pick(random, [...RANKS]) +
      (random() < 0.2 ? pick(random, [...PROMOTIONS]) : '')
    );
  }
  // A control event.
  if (roll < 0.78) return pick(random, ALL_EVENT_STRINGS);
  // A near miss at a control event: wrong case, wrong punctuation.
  if (roll < 0.84) {
    return pick(random, ['RESGN', 'Resgn', 'draw.', 'draw ', 'draw', 'resig', 'DRAW!']);
  }
  // An impossible promotion, which is well formed and must never be accepted.
  if (roll < 0.88) {
    return pick(random, ['e2e4q', 'a1a2k', 'e7e8p', 'h1h2q', 'e7e8x']);
  }
  // Length-legal line noise: exactly what the contract lets through.
  const length = random() < 0.5 ? 4 : 5;
  let out = '';
  for (let i = 0; i < length; i++) out += pick(random, [...ASCII]);
  return out;
}

function someRules(random: () => number): Rules {
  return {
    ...DEFAULT_RULES,
    white: pick(random, [ALICE, BOB, 'anyone', 'anyone-else']),
    black: pick(random, [BOB, ALICE, 'anyone', 'anyone-else']),
    allow: random() < 0.15 ? [ALICE, BOB] : [],
    cooldown: random() < 0.2 ? Math.floor(random() * 3) : 0,
    noConsecutive: random() < 0.15,
    ranked: random() < 0.3
  };
}

function someLog(random: () => number, rules: Rules, length: number): Submission[] {
  // Tracked alongside so the generator can offer genuinely legal moves. It is
  // only a generator aid — replay is given the strings and nothing else.
  const shadow = Position.tryFrom(rules.startFen);
  const out: Submission[] = [];
  for (let seq = 0; seq < length; seq++) {
    const mv = someMove(random, shadow && !shadow.isGameOver() ? shadow : null);
    if (shadow && !shadow.isGameOver()) shadow.applyUci(mv);
    out.push({
      mv,
      sender: pick(random, SENDERS),
      seq,
      height: 1000 + seq
    });
  }
  return out;
}

/** Everything about a result that two runs must agree on. */
function summarise(state: ReplayState): string {
  return JSON.stringify({
    fen: state.fen,
    turn: state.turn,
    inCheck: state.inCheck,
    status: state.status,
    result: state.result,
    termination: state.termination,
    terminalSequence: state.terminalSequence,
    moveNumber: state.moveNumber,
    pendingOffer: state.pendingOffer,
    legalMoves: state.legalMoves,
    pgn: state.pgnMoveText,
    log: state.log.map((r) => [r.seq, r.status, r.kind, 'reason' in r ? r.reason : null, r.raw])
  });
}

describe('totality', () => {
  it('never throws on generated logs', () => {
    for (let seed = 1; seed <= 3000; seed++) {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, Math.floor(random() * 40));
      expect(() => replay(entries, { rules }), `seed ${seed}`).not.toThrow();
    }
  });

  it('never throws on input that is not a log at all', () => {
    const junk: unknown[] = [
      null, undefined, 0, 1, '', 'e2e4', {}, { length: 3 }, [[]], [null], [undefined],
      [{}], [{ mv: null }], [{ mv: 42 }], [{ mv: {} }], [{ mv: [] }],
      [{ mv: 'e2e4', sender: 42 }], [{ mv: 'e2e4', seq: 'first' }],
      [{ mv: 'e2e4', height: 'later' }], [{ mv: 'e2e4', seq: Number.NaN }],
      [{ mv: 'e2e4', seq: -1 }], [{ mv: 'e2e4', seq: Number.MAX_SAFE_INTEGER }],
      ['e2e4'], [Symbol.iterator], [() => 'e2e4'],
      new Array(50).fill({ mv: 'e2e4', sender: ALICE })
    ];
    for (const [index, value] of junk.entries()) {
      // Labelled by index rather than by value: describing the input can itself
      // throw (String(Symbol) does), and a test helper that throws while
      // reporting a passing case is a false failure.
      expect(() => replay(value), `junk[${index}]`).not.toThrow();
    }
  });

  it('never throws on hostile rule sets', () => {
    const hostile: unknown[] = [
      { startFen: '' },
      { startFen: 'not a fen' },
      { startFen: '8/8/8/8/8/8/8/8 w - - 0 1' },
      { startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'.repeat(3) },
      { startFen: 'kkkkkkkk/8/8/8/8/8/8/KKKKKKKK w - - 0 1' },
      { cooldown: -5 },
      { cooldown: Number.NaN },
      { cooldown: 1e9 },
      { allow: [null, undefined, 42] },
      { white: null, black: undefined }
    ];
    for (const rules of hostile) {
      expect(() =>
        replay([{ mv: 'e2e4', sender: ALICE }, { mv: 'e7e5', sender: BOB }], { rules: rules as Partial<Rules> })
      ).not.toThrow();
    }
  });

  it('never throws on a log at the contract ceiling', () => {
    // MAX-SEQ is 65,536. A game that reaches it must still replay.
    const random = rng(9999);
    const rules = { ...DEFAULT_RULES };
    const entries = someLog(random, rules, 65_536);
    expect(() => replay(entries, { rules })).not.toThrow();
  }, 300_000);
});

describe('determinism', () => {
  it('gives the same answer twice for the same bytes', () => {
    for (let seed = 1; seed <= 1500; seed++) {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, Math.floor(random() * 40));
      const first = summarise(replay(entries, { rules }));
      const second = summarise(replay(structuredClone(entries), { rules: { ...rules } }));
      expect(second, `seed ${seed}`).toBe(first);
    }
  });

  it('does not depend on seq being contiguous or starting at zero', () => {
    // seq orders; it is not an index. A reader that used the array position
    // would disagree with one that used the field.
    const entries: Submission[] = [
      { mv: 'e2e4', sender: ALICE, seq: 100, height: 1 },
      { mv: 'e7e5', sender: BOB, seq: 205, height: 2 },
      { mv: 'g1f3', sender: ALICE, seq: 999, height: 3 }
    ];
    const state = replay(entries, { rules: { white: ALICE, black: BOB } });
    expect(state.accepted.map((a) => a.seq)).toEqual([100, 205, 999]);
    expect(state.accepted).toHaveLength(3);
  });
});

describe('invariants that must hold for every generated log', () => {
  it('never accepts anything after the game is over', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, Math.floor(random() * 60));
      const state = replay(entries, { rules });
      if (state.terminalSequence === null) continue;
      const after = state.accepted.filter((a) => a.seq > state.terminalSequence!);
      expect(after, `seed ${seed}`).toHaveLength(0);
    }
  });

  it('reaches the same position with the rejected entries removed', () => {
    // The load-bearing property: a rejected entry is permanently visible and
    // changes nothing.
    for (let seed = 1; seed <= 2000; seed++) {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, Math.floor(random() * 40));
      const full = replay(entries, { rules });
      const cleaned = replay(
        full.accepted.map((a) => ({ mv: a.raw, sender: a.sender, height: a.height })),
        { rules }
      );
      expect(cleaned.fen, `seed ${seed}`).toBe(full.fen);
      expect(cleaned.result, `seed ${seed}`).toBe(full.result);
      expect(cleaned.termination, `seed ${seed}`).toBe(full.termination);
    }
  });

  it('accounts for every submission exactly once', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, Math.floor(random() * 40));
      const state = replay(entries, { rules });
      expect(state.log, `seed ${seed}`).toHaveLength(entries.length);
      expect(state.accepted.length + state.rejected.length).toBe(entries.length);
      expect(state.log.map((r) => r.seq)).toEqual(entries.map((e) => e.seq));
    }
  });

  it('gives a live game legal moves and a finished one none', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, Math.floor(random() * 60));
      const state = replay(entries, { rules });
      if (state.status === 'over') {
        expect(state.legalMoves, `seed ${seed}`).toEqual([]);
        expect(state.result, `seed ${seed}`).not.toBeNull();
      } else {
        expect(state.result, `seed ${seed}`).toBeNull();
        expect(state.termination, `seed ${seed}`).toBeNull();
      }
    }
  });

  it('only ever ends a game on an accepted entry, or before it started', () => {
    for (let seed = 1; seed <= 2000; seed++) {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, Math.floor(random() * 60));
      const state = replay(entries, { rules });
      if (state.terminalSequence === null) continue;
      const ender = state.accepted.find((a) => a.seq === state.terminalSequence);
      expect(ender, `seed ${seed}`).toBeDefined();
    }
  });

  for (const seed of REGRESSION_SEEDS) {
    it(`regression seed ${seed}`, () => {
      const random = rng(seed);
      const rules = someRules(random);
      const entries = someLog(random, rules, 40);
      expect(() => replay(entries, { rules })).not.toThrow();
    });
  }
});

describe('control strings cannot collide with moves', () => {
  it('is never parseable as a move', () => {
    // If a control string were also a legal move somewhere, one submission
    // would mean two things and no reader could tell which.
    for (const value of ALL_EVENT_STRINGS) {
      const state = replay([{ mv: value, sender: ALICE }], {
        rules: { white: 'anyone', black: 'anyone' }
      });
      // On an open board nobody holds a side, so a control event is refused —
      // but it must be refused as a control event, never played as a move.
      expect(state.accepted.filter((a) => a.kind === 'move')).toHaveLength(0);
    }
  });

  it('passes the contract length filter, which is what makes it work at all', () => {
    for (const value of ALL_EVENT_STRINGS) {
      expect(value.length === 4 || value.length === 5, value).toBe(true);
    }
  });

  it('has no duplicate spellings', () => {
    expect(new Set(ALL_EVENT_STRINGS).size).toBe(ALL_EVENT_STRINGS.length);
  });

  it('reserves exactly the three strings the spec names', () => {
    expect([...ALL_EVENT_STRINGS].sort()).toEqual(
      [EVENT_STRINGS.RESIGN, EVENT_STRINGS.DRAW_OFFER, EVENT_STRINGS.DRAW_ACCEPT].sort()
    );
  });
});
