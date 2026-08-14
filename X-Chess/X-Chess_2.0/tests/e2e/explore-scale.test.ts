// What the game list costs, and what it will cost later.
//
// Not a pass/fail suite in the usual sense - it is a MEASUREMENT with a ceiling
// around it, so that "the explorer got slower" is something the repository
// notices rather than something a person eventually complains about.
//
// The numbers below are reads against the chain, which is the unit that
// matters: every one is a round trip, they are rate limited per IP, and the
// wallet spends from the same allowance.

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
const OPEN = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: 'anyone-else' });

const tick = (ms = 60): Promise<void> => new Promise((done) => setTimeout(done, ms));

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

/** A few real moves, so entries exist and replay has something to do. */
const OPENING = ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'd2d3', 'f8c5'];

/**
 * A contract with `games` games on it, each carrying a short opening.
 *
 * Every read is recorded by name, and CONCURRENCY is sampled: the highest
 * number of reads in flight at once. Sequential work shows 1 there however many
 * reads it makes, which is the difference between a list that takes a second
 * and one that takes eight.
 */
async function contractWith(games: number) {
  const chain = new MockChain({ balances: { [ALICE]: 10_000_000_000n, [BOB]: 10_000_000_000n } });
  chain.as(ALICE);
  for (let n = 0; n < games; n++) {
    await chain.openGame(rulesHash(OPEN), false);
    for (const move of OPENING) await chain.submit(n + 1, move);
  }

  const reads: string[] = [];
  let live = 0;
  let peak = 0;
  // ONLY the leaf reads. getAllEntries wraps getPage, so counting it too would
  // report a concurrency of two for work that is strictly one-at-a-time - a
  // measurement that passes for the wrong reason, which is the failure mode this
  // whole file exists to avoid.
  for (const name of ['getGame', 'getPage', 'getGameCount'] as const) {
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

async function openExplore(chain: MockChain): Promise<void> {
  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId }
  });
  await tick();
  (dom.window.document.getElementById('tab-explore') as HTMLButtonElement).click();
  await tick(400);
  void app;
}

describe('what the game list costs', () => {
  it('spends about two reads a game, and says so out loud', async () => {
    const { chain, reads } = await contractWith(25);
    reads.length = 0;
    await openExplore(chain);

    // One getGameCount, then per game one getGame and one page of entries.
    // The ceiling is the thing to defend: past it, a cold open is slower than
    // anybody will wait for.
    // eslint-disable-next-line no-console
    console.log(`      25 games -> ${reads.length} reads`);
    expect(reads.length, `reads: ${reads.length}`).toBeLessThanOrEqual(60);
  });

  it('does not grow with the size of the contract, only with the window', async () => {
    // The window is what makes this bounded. A contract with four times the
    // games must cost the same to open, or the board stops working at scale
    // rather than getting slower.
    const small = await contractWith(25);
    small.reads.length = 0;
    await openExplore(small.chain);
    const at25 = small.reads.length;

    resetForTests();
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.test/'
    });
    (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

    const big = await contractWith(100);
    big.reads.length = 0;
    await openExplore(big.chain);

    // eslint-disable-next-line no-console
    console.log(`      25 games -> ${at25} reads, 100 games -> ${big.reads.length} reads`);
    expect(big.reads.length, 'the cost grew with the contract, not the window').toBe(at25);
  });

  it('reads the window concurrently, because latency is the cost and not bandwidth', async () => {
    // Fifty round trips one after another is eight seconds at a realistic
    // hundred and fifty milliseconds each. The same fifty, three at a time, is
    // under three. Nothing about the reads changes - only whether they wait for
    // each other.
    const { chain, peak } = await contractWith(25);
    await openExplore(chain);

    // eslint-disable-next-line no-console
    console.log(`      peak reads in flight: ${peak()}`);
    expect(peak(), 'the list is read one game at a time').toBeGreaterThan(1);
  });

  it('does not read the whole window at once either', async () => {
    // The other half of the same decision. Twenty-five simultaneous requests
    // from one address is how the board starves its own wallet, which is worse
    // than a slow list: the player cannot move at all.
    const { chain, peak } = await contractWith(25);
    await openExplore(chain);
    expect(peak(), 'the list burst the whole window at the chain').toBeLessThanOrEqual(4);
  });

  it('keeps the newest game first, which concurrency is free to have broken', async () => {
    // Reads now finish out of order. The sort that follows is STABLE and relies
    // on the input being newest-first, so an ordering that depended on the loop
    // would have silently become arbitrary.
    const { chain } = await contractWith(6);
    await openExplore(chain);
    const ids = [...dom.window.document.querySelectorAll('#explore-rows tr')].map(
      (tr) => tr.querySelector('td')?.textContent
    );
    expect(ids).toEqual(['6', '5', '4', '3', '2', '1']);
  });
});

// ---------------------------------------------------------------------------
// The second visit.
//
// The entry cache only pays if it removes ROUND TRIPS, and there is a trap in
// that: a game shorter than one page costs exactly one read whether it is
// cached or not, because a page is fifty entries. So "resume from the first
// uncached entry" — which is what the cache used to do, badly — saves nothing at
// all for an ordinary game.
//
// What saves it is knowing the log is already whole. The caller has just read
// the game row, so it knows `next-seq`; if the cache holds that many entries
// there is nothing to ask for.
// ---------------------------------------------------------------------------

describe('what the game list costs the second time', () => {
  it('skips the entries for every game that has not moved', async () => {
    const { chain, reads } = await contractWith(25);
    const store = new MemoryStore();
    const cached = new CachingReader(chain, store) as unknown as MockChain;

    reads.length = 0;
    await openExplore(cached);
    const cold = reads.length;

    resetForTests();
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.test/'
    });
    (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

    reads.length = 0;
    await openExplore(cached);
    const warm = reads.length;

    // eslint-disable-next-line no-console
    console.log(`      cold ${cold} reads -> warm ${warm} reads`);
    // One count, then one game row each. The entries are already known.
    expect(warm, 'the second visit cost the same as the first').toBeLessThan(cold);
    expect(warm).toBe(26);
  });

  it('reads the new entries, and only those, when a game has moved', async () => {
    const { chain, reads } = await contractWith(3);
    const store = new MemoryStore();
    const cached = new CachingReader(chain, store) as unknown as MockChain;
    await openExplore(cached);

    chain.as(BOB);
    await chain.submit(3, 'g8f6');

    resetForTests();
    dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.test/'
    });
    (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

    reads.length = 0;
    await openExplore(cached);

    // Three game rows and the count, plus ONE page for the game that grew.
    const pages = reads.filter((name) => name === 'getPage').length;
    // eslint-disable-next-line no-console
    console.log(`      one game moved -> ${pages} entry page(s) read`);
    expect(pages, 'a game that did not move was read again').toBe(1);
  });

  it('never serves a game more entries than the chain says exist', async () => {
    // The failure this cache could cause is the only one that matters: showing
    // a log that is not the chain's. Asserted directly rather than trusted.
    const { chain } = await contractWith(2);
    const cached = new CachingReader(chain, new MemoryStore());
    const first = await cached.getAllEntries(1);
    const row = await chain.getGame(1);
    expect(first.length).toBe(row!.nextSeq);
    expect(first.map((entry) => entry.seq)).toEqual(first.map((_entry, at) => at));

    const again = await cached.getAllEntries(1, row!.nextSeq);
    expect(again.map((entry) => entry.value)).toEqual(first.map((entry) => entry.value));
  });
});
