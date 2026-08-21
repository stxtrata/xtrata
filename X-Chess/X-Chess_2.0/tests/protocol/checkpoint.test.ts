// Continuing from somebody else's walk, and what has to be true first.

import { describe, expect, it } from 'vitest';
import {
  buildCheckpoint, CHECKPOINT_HEADER, parseCheckpoint, usable
} from '../../packages/protocol/checkpoint.js';

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

  it('accepts a walk that consumed more indices than it could count', () => {
    // THE HONEST CASE, and it was refused until 2026-08-20. A ranked index
    // holds games no rating can count — still being played, ineligible, or
    // with a player nothing on chain can identify — so a walk over forty
    // indices listing two games is what an honest forty-game walk looks like.
    //
    // Demanding equality here refused every truthful checkpoint and left
    // exactly one document that would pass: the walk that renumbers
    // `rankedIndex` down to the games it counted. That one is accepted and
    // wrong, which is why this is an inequality now.
    const parsed = parseCheckpoint(doc({ rankedIndex: 40 }));
    expect(parsed.ok, parsed.problems.join('; ')).toBe(true);
    expect(parsed.checkpoint!.rankedIndex, 'a reader resumes after all forty').toBe(40);
  });

  it('refuses a list longer than the walk that made it', () => {
    // Still impossible in the other direction: two indices cannot yield three
    // games, so the document is describing a walk it did not do.
    const parsed = parseCheckpoint(doc({ rankedIndex: 1 }));
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

describe('writing down how far the walk got', () => {
  const GAMES = [
    { id: 13, white: A, black: B, result: '1-0' as const },
    { id: 14, white: B, black: A, result: '0-1' as const }
  ];
  const TABLE = [{ who: A, rating: 1290, games: 2, won: 2, drawn: 0, lost: 0 }];

  it('records the indices consumed, not the games counted', () => {
    // THE BUG THIS FILE EXISTS TO PREVENT, and it was in the writer.
    //
    // `rankedIndex` was inferred from `games.length`, so a walk over 128 ranked
    // indices that could count 117 of them wrote down 117 — and a reader
    // resumes AT `rankedIndex`. Indices 117 to 127 were therefore inside the
    // checkpoint's own table and replayed again by the reader, and every
    // countable game among them counted twice. Well formed, reproducible, and
    // wrong: the combination no shape check catches.
    const text = buildCheckpoint({
      contract: CONTRACT, block: 8_795_901, rankedIndex: 40, games: GAMES, table: TABLE
    });
    const parsed = parseCheckpoint(text);
    expect(parsed.ok, parsed.problems.join('; ')).toBe(true);
    expect(parsed.checkpoint!.rankedIndex, 'it renumbered itself down to the games it counted').toBe(40);
    expect(parsed.checkpoint!.games.length).toBe(2);
  });

  it('refuses to claim fewer indices than the games it lists', () => {
    // The direction that would resume in the middle of the walk. Refused at
    // the point of writing, where it can still be fixed, rather than at the
    // point of reading, where the document is already on chain.
    expect(() =>
      buildCheckpoint({
        contract: CONTRACT, block: 8_795_901, rankedIndex: 1, games: GAMES, table: TABLE
      })
    ).toThrow(/rankedIndex/);
  });

  it('still writes the same bytes twice, which is the whole point', () => {
    const once = buildCheckpoint({
      contract: CONTRACT, block: 8_795_901, rankedIndex: 40, games: GAMES, table: TABLE
    });
    const twice = buildCheckpoint({
      contract: CONTRACT, block: 8_795_901, rankedIndex: 40, games: [...GAMES], table: [...TABLE]
    });
    expect(once).toBe(twice);
  });
});
