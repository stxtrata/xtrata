// Generating a child board.
//
// A child is meant to be tiny and self-describing: it says which game it
// renders, under what rules, and which engine it depends on. If it ever grows
// into a copy of the board, generating a game stops being a casual act.

import { describe, expect, it } from 'vitest';
import { childPage, engineIdFromLocation } from '../src/child.js';
import { DEFAULT_RULES, normaliseRules, rulesHash } from '../src/rules.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const CONTRACT = `${ALICE}.xtrata-chess-log-v1`;

const duel = { ...DEFAULT_RULES, white: ALICE, black: BOB };

function build(overrides = {}) {
  return childPage({
    contract: CONTRACT,
    network: 'mainnet',
    game: 7,
    rules: duel,
    engine: 2801,
    ...overrides
  });
}

describe('the child page', () => {
  it('is small enough that a game costs almost nothing to inscribe', () => {
    // The whole argument for splitting the engine out. If this ever creeps into
    // kilobytes, the split has stopped paying for itself.
    expect(build().length).toBeLessThan(1200);
  });

  it('depends on the engine rather than carrying one', () => {
    const page = build();
    expect(page).toContain('<script src="/i/2801"></script>');
    expect(page).not.toContain('class Chess');
    expect(page).not.toContain('function perft');
  });

  it('names the game, the contract and the network', () => {
    const config = JSON.parse(build().match(/__XTRATA_CHESS_CHILD__ = ([\s\S]*?);\n<\/script>/)[1]);
    expect(config).toMatchObject({
      contract: CONTRACT,
      network: 'mainnet',
      game: 7,
      engine: 2801
    });
  });

  it('carries the rules and their hash, and they agree', () => {
    const config = JSON.parse(build().match(/__XTRATA_CHESS_CHILD__ = ([\s\S]*?);\n<\/script>/)[1]);
    expect(config.rules).toEqual(normaliseRules(duel));
    expect(config.rulesHash).toBe(rulesHash(duel));
  });

  it('writes the hash where a human will see it', () => {
    // Someone opening this in an explorer should be able to check the claim
    // against the chain without running anything.
    expect(build()).toContain(rulesHash(duel));
    expect(build()).toContain('is not the referee for this game');
  });

  it('normalises the rules it was handed, so the hash is not order-dependent', () => {
    const one = build({ rules: { white: ALICE, black: BOB } });
    const other = build({ rules: { black: BOB, white: ALICE, cooldown: 0 } });
    expect(other).toBe(one);
  });

  it('escapes a hostile title rather than letting it write markup', () => {
    const page = build({ title: '</script><img src=x onerror=alert(1)>' });
    expect(page).not.toContain('<img src=x');
    expect(page).toContain('&lt;/script&gt;');
  });

  it('is valid on its own: doctype, config, one script dependency', () => {
    const page = build();
    expect(page.startsWith('<!doctype html>')).toBe(true);
    expect((page.match(/<script/g) || []).length).toBe(2);
    expect((page.match(/src="\/i\//g) || []).length).toBe(1);
  });
});

describe('finding the engine it is running from', () => {
  function fakeDoc(srcs) {
    return {
      querySelectorAll: () => srcs.map((src) => ({ getAttribute: () => src }))
    };
  }

  it('reads the id out of the script that loaded it', () => {
    expect(engineIdFromLocation(fakeDoc(['/i/2801']))).toBe(2801);
    expect(engineIdFromLocation(fakeDoc(['/content/x.js', '/i/447']))).toBe(447);
  });

  it('returns null when running somewhere without inscriptions', () => {
    expect(engineIdFromLocation(fakeDoc(['./src/boot.js']))).toBe(null);
    expect(engineIdFromLocation(fakeDoc([]))).toBe(null);
    expect(engineIdFromLocation(null)).toBe(null);
  });

  it('falls back to what a child page declares, so a child can spawn one', () => {
    globalThis.__XTRATA_CHESS_CHILD__ = { engine: 1234 };
    try {
      expect(engineIdFromLocation(fakeDoc([]))).toBe(1234);
    } finally {
      delete globalThis.__XTRATA_CHESS_CHILD__;
    }
  });
});
