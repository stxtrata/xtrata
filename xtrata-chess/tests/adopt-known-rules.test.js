// Whether the board is the referee for the game it is looking at.
//
// The contract stores a hash of a game's rules, never the rules. So a board
// carrying a local copy could enforce rules the game never agreed to, which is
// worse than enforcing none: every reader would disagree about which moves
// counted, and the log would no longer be the shared record it exists to be.
//
// Every branch that is not an exact match has to end with the board refereeing
// nothing. This runs only once game 1 exists on chain, so it cannot be checked
// by opening the page today — hence these.

import { describe, expect, it, vi } from 'vitest';
import { normaliseRules, rulesHash } from '../src/rules.js';
import { knownGame } from '../src/known-games.js';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v3';
const KNOWN = knownGame(CONTRACT, 1);
const RIGHT_HASH = rulesHash(KNOWN.rules);

// The method under test, lifted out of the class so it can be driven without a
// DOM. Kept in step with src/app.js by the assertion at the bottom.
async function adopt(board) {
  const known = knownGame(board.chain?.contractId, board.game);
  if (!known) {
    board.gameRules = null;
    return;
  }
  let entry = null;
  try {
    entry = board.chain.getGame ? await board.chain.getGame(board.game) : null;
  } catch {
    board.gameRules = null;
    return;
  }
  board.committedHash = entry?.rulesHash ?? null;
  const rules = normaliseRules(known.rules);
  if (!board.committedHash) {
    board.notices.push('no commitment');
    board.gameRules = null;
    return;
  }
  if (rulesHash(rules) !== String(board.committedHash).replace(/^0x/, '').toLowerCase()) {
    board.notices.push('different rules');
    board.gameRules = null;
    return;
  }
  board.gameRules = rules;
}

const boardFor = (game, getGame) => ({
  game,
  gameRules: 'untouched',
  committedHash: undefined,
  notices: [],
  chain: { contractId: CONTRACT, getGame }
});

describe('the game this board referees', () => {
  it('adopts the rules when the chain committed to exactly them', async () => {
    const board = boardFor(1, async () => ({ rulesHash: RIGHT_HASH }));
    await adopt(board);
    expect(board.gameRules).toEqual(normaliseRules(KNOWN.rules));
    expect(board.notices).toEqual([]);
  });

  it('accepts the commitment however it is written', async () => {
    const board = boardFor(1, async () => ({ rulesHash: `0x${RIGHT_HASH.toUpperCase()}` }));
    await adopt(board);
    expect(board.gameRules).not.toBe(null);
  });
});

describe('every way it refuses to referee', () => {
  it('a game it has no rules for', async () => {
    const board = boardFor(2, async () => ({ rulesHash: RIGHT_HASH }));
    await adopt(board);
    expect(board.gameRules).toBe(null);
  });

  // The dangerous one. A game opened with different rules must not be judged
  // by these, or this board would skip moves every other reader accepts.
  it('a game that committed to different rules', async () => {
    const board = boardFor(1, async () => ({ rulesHash: 'ab'.repeat(32) }));
    await adopt(board);
    expect(board.gameRules).toBe(null);
    expect(board.notices).toContain('different rules');
  });

  it('a game opened with no commitment at all', async () => {
    const board = boardFor(1, async () => ({ rulesHash: null }));
    await adopt(board);
    expect(board.gameRules).toBe(null);
    expect(board.notices).toContain('no commitment');
  });

  // A failed read is not a game without rules. Refereeing nothing is the safe
  // direction; guessing is not.
  it('a read that failed', async () => {
    const board = boardFor(1, vi.fn(async () => { throw new Error('offline'); }));
    await adopt(board);
    expect(board.gameRules).toBe(null);
  });

  it('a game that does not exist', async () => {
    const board = boardFor(1, async () => null);
    await adopt(board);
    expect(board.gameRules).toBe(null);
  });
});

describe('the copy in this file matches the board', () => {
  // A test that drifts from what it claims to test is worse than no test, and
  // this one is a hand copy. Pin the shape it depends on.
  it('still guards every branch the board guards', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const source = readFileSync(
      resolve(import.meta.dirname, '..', 'src', 'app.js'),
      'utf8'
    );
    const method = source.slice(
      source.indexOf('async _adoptKnownRules()'),
      source.indexOf('// Does the chain agree that this is the referee')
    );

    expect(method).toBeTruthy();
    // Four ways out, all of them setting gameRules to null.
    expect(method.match(/this\.gameRules = null/g) || []).toHaveLength(4);
    expect(method).toMatch(/rulesMatchCommitment/);
    expect(method).toMatch(/catch/);
  });
});
