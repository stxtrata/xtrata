// Paging the game list, and the three ways it could quietly lie.
//
// The window was always an id RANGE rather than a query, so showing an older
// page is the same twenty-five reads at a different offset — the cheap part.
// What needed deciding is everything around it, because each one is a way for
// the list to stop meaning what it says:
//
//   * a timer that pulls a reader back to the newest while they are reading it;
//   * "your games from further back", whose condition is "older than this page
//     starts" and is therefore true for most of the contract on page four;
//   * a count line that still says "newest 25 shown" on page four.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const RULES = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB });

const tick = (ms = 60): Promise<void> => new Promise((done) => setTimeout(done, ms));

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

/** Sixty games, which is more than two pages of twenty-five. */
async function board(): Promise<ChessApp> {
  const chain = new MockChain({ balances: { [ALICE]: 1_000_000_000n, [BOB]: 1_000_000_000n } });
  chain.as(ALICE);
  for (let i = 0; i < 60; i++) await chain.openGame(rulesHash(RULES), false);

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain: chain as never,
    document: dom.window.document,
    connect: async () => ({ address: ALICE }),
    disconnect: async () => {}
  });
  app.show('explore');
  await tick(400);
  return app;
}

const inner = (app: ChessApp) =>
  app as unknown as {
    exploreTop: number | null;
    exploreTotal: number;
    exploreRows: Array<{ id: number }>;
    yoursOutside: number[];
    exploreIsStale(): boolean;
    pageExplore(d: -1 | 1): Promise<void>;
  };

const countLine = (): string =>
  dom.window.document.getElementById('explore-count')?.textContent ?? '';
const button = (id: string): HTMLButtonElement =>
  dom.window.document.getElementById(id) as HTMLButtonElement;

describe('paging the game list', () => {
  it('starts on the newest page with Newer disabled', async () => {
    const app = await board();
    expect(inner(app).exploreTop, 'newest is null, never a number').toBe(null);
    expect(button('explore-newer').disabled).toBe(true);
    expect(button('explore-older').disabled).toBe(false);
    expect(countLine()).toContain('newest 25 shown');
  });

  it('shows the previous stretch of ids, and says which', async () => {
    const app = await board();
    await inner(app).pageExplore(-1);
    await tick(400);

    const ids = inner(app).exploreRows.map((r) => r.id);
    expect(Math.max(...ids)).toBe(35);
    expect(Math.min(...ids)).toBe(11);
    expect(countLine()).toContain('showing 11');
    expect(countLine()).not.toContain('newest 25 shown');
  });

  it('pauses the refresh timer while paged away', async () => {
    // The one that would be worst in use: a reader on page three looking at a
    // game, and the list replacing itself with the newest every thirty seconds.
    const app = await board();
    expect(inner(app).exploreIsStale()).toBe(false);

    await inner(app).pageExplore(-1);
    await tick(400);
    // Force the clock past the staleness bound.
    (app as unknown as { exploreBuiltAt: number }).exploreBuiltAt = 0;
    expect(inner(app).exploreIsStale(), 'a paged list must not auto-reload').toBe(false);
    expect(countLine()).toContain('Updates are paused');
  });

  it('returns to the newest as null rather than as a number', async () => {
    // So the newest page keeps meaning "newest" while games are being opened.
    const app = await board();
    await inner(app).pageExplore(-1);
    await tick(400);
    await inner(app).pageExplore(1);
    await tick(400);

    expect(inner(app).exploreTop).toBe(null);
    expect(button('explore-newer').disabled).toBe(true);
    expect(inner(app).exploreIsStale.call(app)).toBe(false);
  });

  it('stops at the oldest rather than running off the end', async () => {
    const app = await board();
    for (let i = 0; i < 6; i++) {
      await inner(app).pageExplore(-1);
      await tick(300);
    }
    const ids = inner(app).exploreRows.map((r) => r.id);
    expect(Math.min(...ids)).toBe(1);
    expect(button('explore-older').disabled).toBe(true);
  });

  it('does not append your older games to a page that is not the newest', async () => {
    // The condition is "older than this page starts", which on page one means
    // "fell off the end" and on page three means most of the contract.
    const app = await board();
    (app as unknown as { address: string }).address = ALICE;
    (app as unknown as { yours: { remember(a: string, id: number): void } }).yours?.remember(ALICE, 3);

    await inner(app).pageExplore(-1);
    await tick(400);
    expect(inner(app).yoursOutside, 'a paged reader asked for one stretch of ids').toEqual([]);
  });
});
