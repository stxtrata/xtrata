// A tournament that has loaded should stay loaded.
//
// The poll asks every thirty seconds whether an unfinished game has moved, by
// building a signature of their submission counts and comparing it to the last
// one. The last one was CLEARED at the end of every successful load — and
// anything differs from nothing, so the first poll always found a change and
// reloaded the whole tournament, which cleared it again.
//
// Ninety pairings re-checked and ninety games re-replayed every thirty
// seconds, for as long as the tab was open, whether or not a move had been
// played anywhere.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

function board(): ChessApp {
  mountShell(dom.window.document);
  return new ChessApp({
    chain: new MockChain({ balances: {} }) as never,
    document: dom.window.document,
    connect: async () => ({ address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X' }),
    disconnect: async () => {}
  });
}

/** A loaded view: two games still playing, one finished. */
const view = (submissions: [number, number]) =>
  ({
    ok: true, problems: [], tournamentId: 3016, lineage: [3016],
    tournament: { name: 'Three', format: 'rr', contract: 'x', entrants: [], games: [] },
    provenance: null, says: '', honoured: true, table: [], scored: true, revision: null,
    rounds: [
      {
        number: 1,
        games: [
          { id: 54, result: null, submissions: submissions[0] },
          { id: 55, result: null, submissions: submissions[1] },
          { id: 53, result: '1-0', submissions: 19 }
        ]
      }
    ]
  }) as never;

const signature = (app: ChessApp, v: unknown): string =>
  (app as unknown as { tournamentSignature(v: unknown): string }).tournamentSignature(v);

describe('the signature a tournament poll compares', () => {
  it('is taken from the games that are still playing', () => {
    // Finished games cannot move, so watching them is noise that can only
    // produce a false difference.
    expect(signature(board(), view([0, 0]))).toBe('54:0,55:0');
  });

  it('is stable when nothing has moved', () => {
    const app = board();
    expect(signature(app, view([0, 0]))).toBe(signature(app, view([0, 0])));
  });

  it('changes when a game gains a submission', () => {
    const app = board();
    expect(signature(app, view([0, 0]))).not.toBe(signature(app, view([1, 0])));
  });

  it('is not empty for a loaded tournament', () => {
    // The whole bug in one assertion. An empty baseline differs from every
    // real signature, so the next poll always reloaded.
    expect(signature(board(), view([0, 0]))).not.toBe('');
  });

  it('counts SUBMISSIONS, not the moves replay accepted', () => {
    // They differ for any game with a skipped submission. Mixing them made a
    // signature that could not equal itself, so one failed read meant a
    // reload on every poll from then on.
    const app = board();
    const mixed = {
      ...(view([0, 0]) as unknown as { rounds: Array<{ games: Array<Record<string, unknown>> }> })
    };
    mixed.rounds[0].games[0] = { id: 54, result: null, submissions: 7, moves: 5 };
    expect(signature(app, mixed as never)).toContain('54:7');
    expect(signature(app, mixed as never)).not.toContain('54:5');
  });

  it('says so rather than guessing when a count is unknown', () => {
    const app = board();
    const missing = {
      ...(view([0, 0]) as unknown as { rounds: Array<{ games: Array<Record<string, unknown>> }> })
    };
    missing.rounds[0].games[0] = { id: 54, result: null };
    // Not zero. "I could not tell" and "nobody has moved" are different, and
    // collapsing them is what turns an unreadable row into a permanent reload.
    expect(signature(app, missing as never)).toContain('54:?');
  });
});
