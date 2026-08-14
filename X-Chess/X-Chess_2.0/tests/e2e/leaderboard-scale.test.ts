// What the leaderboard costs, and what it will cost later.
//
// It is the only walk in this board with NO WINDOW on it. The explorer reads the
// newest twenty-five and costs the same on a contract with a hundred games as on
// one with twenty-five; the leaderboard reads every ranked game there has ever
// been, and it does so every time somebody opens the tab.
//
// That is not a thing that gets slowly worse. Three sequential round trips per
// ranked game is about forty-five seconds at a hundred games, and it grows for
// the life of the contract.
//
// Two of the three reads are avoidable and one is not, which is what the numbers
// below pin down:
//
//   getRankedGame   a position in an append-only index    cacheable forever
//   getAllEntries   immutable once written                cacheable forever
//   getGame         next-seq grows every submission       NEVER cacheable
//
// And the rating itself is never cached. Every one is recomputed from the log on
// every visit, because recomputing is the proof - the cache removes the
// fetching, never the deriving.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { CachingReader, MemoryStore } from '../../packages/storage/verified-cache.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';

const tick = (ms = 60): Promise<void> => new Promise((done) => setTimeout(done, ms));

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

/** Fool's mate, so every game reaches a real result rather than an asserted one. */
const MATE: [string, string][] = [
  ['f2f3', ALICE],
  ['e7e5', BOB],
  ['g2g4', ALICE],
  ['d8h4', BOB]
];

async function contractWith(rankedGames: number) {
  const chain = new MockChain({
    balances: { [ALICE]: 100_000_000_000n, [BOB]: 100_000_000_000n }
  });
  const rules = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB, ranked: true });
  for (let n = 0; n < rankedGames; n++) {
    chain.as(ALICE);
    await chain.openGame(rulesHash(rules), true);
    for (const [move, who] of MATE) {
      chain.as(who);
      await chain.submit(n + 1, move);
    }
  }

  const reads: string[] = [];
  let live = 0;
  let peak = 0;
  for (const name of ['getGame', 'getPage', 'getRankedGame', 'getRankedCount'] as const) {
    const original = (chain[name] as (...a: unknown[]) => Promise<unknown>).bind(chain);
    (chain as unknown as Record<string, unknown>)[name] = async (...args: unknown[]) => {
      reads.push(name);
      live++;
      peak = Math.max(peak, live);
      try {
        return await original(...args);
      } finally {
        live--;
      }
    };
  }
  return { chain, reads, peak: () => peak };
}

async function openLeaderboard(chain: MockChain): Promise<Document> {
  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId }
  });
  await tick();
  (dom.window.document.getElementById('tab-leaderboard') as HTMLButtonElement).click();
  await tick(400);
  void app;
  return dom.window.document;
}

describe('what the leaderboard costs', () => {
  it('reads it three at a time rather than one after another', async () => {
    const { chain, peak } = await contractWith(9);
    await openLeaderboard(chain);
    // eslint-disable-next-line no-console
    console.log(`      peak reads in flight: ${peak()}`);
    expect(peak(), 'the ranked walk is still strictly sequential').toBeGreaterThan(1);
    expect(peak(), 'it burst the whole contract at the chain').toBeLessThanOrEqual(4);
  });

  it('still produces the table, which concurrency is free to have broken', async () => {
    const doc = await openLeaderboard((await contractWith(6)).chain);
    const rows = doc.querySelectorAll('#leaderboard-rows tr');
    expect(rows.length, 'no ratings were produced at all').toBeGreaterThan(0);
    expect(doc.getElementById('leaderboard-note')!.textContent).toContain('verified ranked game');
  });

  it('costs one read a game on a second visit, not three', async () => {
    // The whole point. A ranked game that has finished cannot change its result,
    // and its entries cannot change at all - so what is left to ask about is
    // whether the log grew, which is one game row.
    const { chain, reads } = await contractWith(9);
    const cached = new CachingReader(chain, new MemoryStore()) as unknown as MockChain;

    reads.length = 0;
    await openLeaderboard(cached);
    const cold = reads.length;

    resetForTests();
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.test/'
    });
    (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

    reads.length = 0;
    await openLeaderboard(cached);
    const warm = reads.length;

    // eslint-disable-next-line no-console
    console.log(`      9 ranked games: cold ${cold} reads -> warm ${warm}`);
    expect(warm, 'the second visit cost as much as the first').toBeLessThan(cold);
    // One getRankedCount, then one getGame each. Nothing else can have changed.
    expect(warm).toBe(10);
  });

  it('recomputes every rating even when nothing was fetched', async () => {
    // The cache must never shortcut the deriving. A leaderboard served from a
    // remembered TABLE would be trusting a number instead of re-deriving it,
    // which is the one thing this architecture exists to avoid.
    const { chain } = await contractWith(4);
    const cached = new CachingReader(chain, new MemoryStore()) as unknown as MockChain;
    await openLeaderboard(cached);

    resetForTests();
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.test/'
    });
    (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

    const doc = await openLeaderboard(cached);
    expect(
      doc.getElementById('leaderboard-note')!.textContent,
      'the warm visit produced no ratings, so it served something remembered'
    ).toContain('4 verified ranked games');
  });

  it('grows with the ranked games, which is the thing still to decide', async () => {
    // NOT A PASS SO MUCH AS A MEASUREMENT. Caching and concurrency make this
    // affordable; they do not make it bounded. Windowing it would bound it and
    // would also change every rating on the page, because Elo is path
    // dependent - so that is a decision about what the leaderboard MEANS and is
    // recorded in ops/UPGRADES.md proposal 34 rather than taken here.
    const small = await contractWith(4);
    small.reads.length = 0;
    await openLeaderboard(small.chain);
    const atFour = small.reads.length;

    resetForTests();
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.test/'
    });
    (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

    const big = await contractWith(12);
    big.reads.length = 0;
    await openLeaderboard(big.chain);

    // eslint-disable-next-line no-console
    console.log(`      4 ranked -> ${atFour} reads, 12 ranked -> ${big.reads.length} reads`);
    expect(big.reads.length, 'it stopped growing, which means a window arrived').toBeGreaterThan(
      atFour
    );
  });
});
