// Continuing from somebody else's walk, and what has to be true first.

import { describe, expect, it } from 'vitest';
import { CHECKPOINT_HEADER, parseCheckpoint, usable } from '../../packages/protocol/checkpoint.js';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary';
const A = 'SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB';
const B = 'SP290YBDWN08X61HRZ3GAEA0YES001DJ6YX51HYKN';

const doc = (over: Record<string, unknown> = {}): string =>
  `${CHECKPOINT_HEADER}\n${JSON.stringify({
    contract: CONTRACT,
    rankedIndex: 2,
    block: 8_795_901,
    table: [{ who: A, rating: 1290, games: 2, won: 2, drawn: 0, lost: 0 }],
    games: [
      { id: 13, white: A, black: B, result: '1-0' },
      { id: 14, white: B, black: A, result: '0-1' }
    ],
    ...over
  })}`;

describe('reading a rating checkpoint', () => {
  it('reads one that is well formed', () => {
    const parsed = parseCheckpoint(doc());
    expect(parsed.ok, parsed.problems.join('; ')).toBe(true);
    expect(parsed.checkpoint!.rankedIndex).toBe(2);
  });

  it('refuses anything that is not one', () => {
    expect(parseCheckpoint('X-CHESS-TOURNAMENT/1\n{}').ok).toBe(false);
    expect(parseCheckpoint(`${CHECKPOINT_HEADER}\nnot json`).ok).toBe(false);
  });

  it('refuses a table that does not follow from the list', () => {
    // The one arithmetic claim checkable for free: a checkpoint saying it
    // consumed forty games while listing thirty is either truncated or
    // describing a walk it did not do. Either way the table cannot follow.
    const parsed = parseCheckpoint(doc({ rankedIndex: 40 }));
    expect(parsed.ok).toBe(false);
    expect(parsed.problems.join(' ')).toContain('lists 2');
  });

  it('refuses a result chess does not have', () => {
    const parsed = parseCheckpoint(
      doc({ games: [{ id: 13, white: A, black: B, result: 'white won' }], rankedIndex: 1 })
    );
    expect(parsed.ok).toBe(false);
  });

  it('will not be used for a different contract', () => {
    const it = parseCheckpoint(doc()).checkpoint!;
    expect(usable(it, 'SP000000000000000000002Q6VF78.other-chess', 10).ok).toBe(false);
  });

  it('will not be used when it is ahead of the chain', () => {
    // A checkpoint claiming more ranked games than exist would have the board
    // start its walk past games that are really there, and those games would
    // never be counted by anybody.
    const it = parseCheckpoint(doc()).checkpoint!;
    expect(usable(it, CONTRACT, 1).ok).toBe(false);
    expect(usable(it, CONTRACT, 2).ok).toBe(true);
    expect(usable(it, CONTRACT, 38).ok).toBe(true);
  });

  it('carries a note for whoever writes the next one', () => {
    const parsed = parseCheckpoint(doc({ note: 'chain the next one to this id' }));
    expect(parsed.checkpoint!.note).toContain('chain the next');
  });
});
