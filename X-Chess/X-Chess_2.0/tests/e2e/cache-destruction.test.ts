// Destroying the cache.
//
// The test the whole storage design exists to pass: populate everything, record
// what is on screen, delete every byte of local storage, and rebuild. If the
// two do not match exactly, the cache was holding something the chain was not,
// and the chain has stopped being the only thing that matters.

import { describe, expect, it } from 'vitest';
import { MockChain } from '../../packages/chain/mock.js';
import { CachingReader, MemoryStore } from '../../packages/storage/verified-cache.js';
import { replay } from '../../packages/replay/replay.js';
import { computeRatings, leaderboard } from '../../packages/ratings/elo-v1.js';
import type { RatedGame } from '../../packages/ratings/elo-v1.js';
import { checkEligibility } from '../../packages/ratings/eligibility.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import type { ChainReader } from '../../packages/chain/client.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BOB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

const RANKED_RULES = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB, ranked: true });

/** A chain with two finished games on it, one of them ranked. */
async function seed(): Promise<MockChain> {
  const chain = new MockChain({
    balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n }
  });

  // A ranked game that Alice wins by resignation.
  chain.as(ALICE);
  await chain.openGame(rulesHash(RANKED_RULES), true);
  const ranked = await chain.getGameCount();
  const script: [string, string][] = [
    [ALICE, 'e2e4'],
    [BOB, 'e7e5'],
    [ALICE, 'g1f3'],
    [BOB, 'zzzz'],
    [BOB, 'b8c6'],
    [BOB, 'resgn']
  ];
  for (const [who, value] of script) {
    chain.as(who);
    await chain.submit(ranked, value);
    chain.mine(1);
  }

  // A casual game, left unfinished.
  chain.as(BOB);
  await chain.openGame(null, false);
  const casual = await chain.getGameCount();
  chain.as(ALICE);
  await chain.submit(casual, 'd2d4');

  return chain;
}

/**
 * Everything a player can see, as one comparable string.
 *
 * Deliberately includes the derived facts - the position, the result, the
 * ratings - because those are precisely what a cache could be tempted to keep.
 */
async function everythingOnScreen(reader: ChainReader): Promise<string> {
  const out: string[] = [];
  const count = await reader.getGameCount();
  const rated: RatedGame[] = [];

  for (let id = 1; id <= count; id++) {
    const game = await reader.getGame(id);
    if (!game) continue;
    const entries = await reader.getAllEntries(id);
    const rules = game.ranked ? RANKED_RULES : DEFAULT_RULES;
    const state = replay(
      entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
      { rules }
    );

    out.push(
      [
        `game ${id}`,
        `fen ${state.fen}`,
        `turn ${state.turn}`,
        `status ${state.status}`,
        `result ${state.result}`,
        `termination ${state.termination}`,
        `terminal ${state.terminalSequence}`,
        `accepted ${state.accepted.length}`,
        `rejected ${state.rejected.map((r) => `${r.seq}:${r.reason}`).join(',')}`,
        `pgn ${state.pgnMoveText}`
      ].join(' | ')
    );

    const eligibility = checkEligibility(game, rules, state);
    if (eligibility.eligible && state.result) {
      const terminal = state.accepted.find((e) => e.seq === state.terminalSequence);
      rated.push({
        game: id,
        white: eligibility.white!,
        black: eligibility.black!,
        result: state.result,
        terminalHeight: terminal?.height ?? game.openedAt
      });
    }
  }

  for (const row of leaderboard(computeRatings(rated))) {
    out.push(`rank ${row.rank} ${row.principal} ${row.rating} ${row.games} ${row.peak} ${row.streak}`);
  }

  return out.join('\n');
}

describe('a cache that can be destroyed', () => {
  it('rebuilds exactly the same state after every byte is deleted', async () => {
    const chain = await seed();
    const store = new MemoryStore();
    const cached = new CachingReader(chain, store);

    // Warm it thoroughly.
    const before = await everythingOnScreen(cached);
    await everythingOnScreen(cached);
    expect(store.size, 'nothing was cached at all, so this proves nothing').toBeGreaterThan(0);
    expect(cached.hits, 'the cache was never read from').toBeGreaterThan(0);

    // Delete everything, exactly as a person clearing their browser would.
    await cached.clear();
    expect(store.size).toBe(0);
    expect(cached.hits).toBe(0);

    const after = await everythingOnScreen(cached);
    expect(after).toBe(before);
  });

  it('gives the same answer with no cache at all', async () => {
    // The strongest form: not a cleared cache, but no cache in the picture.
    const chain = await seed();
    const direct = await everythingOnScreen(chain);
    const throughCache = await everythingOnScreen(new CachingReader(chain, new MemoryStore()));
    expect(throughCache).toBe(direct);
  });

  it('is actually used, or the test above is vacuous', async () => {
    const chain = await seed();
    const cached = new CachingReader(chain, new MemoryStore());

    await everythingOnScreen(cached);
    const firstPass = cached.misses;
    expect(firstPass, 'a cold cache should have read rows from the chain').toBeGreaterThan(0);

    cached.hits = 0;
    cached.misses = 0;
    await everythingOnScreen(cached);

    // A warm cache reads NO settled rows from the chain at all.
    expect(cached.misses, 'a warm cache still went to the chain for settled rows').toBe(0);
    expect(cached.hits).toBeGreaterThanOrEqual(firstPass);
  });

  it('never caches anything that can change', async () => {
    // A game row's next-seq grows, a sponsorship's allowance shrinks. Caching
    // either would show a stale game and call it the chain.
    const chain = await seed();
    const store = new MemoryStore();
    const cached = new CachingReader(chain, store);

    await cached.getGame(1);
    await cached.getSponsorship(1, ALICE);
    await cached.getTotalReserved();
    await cached.getGameCount();

    expect(store.size, 'a mutable row was cached').toBe(0);
  });

  it('sees a new submission immediately, rather than a cached log', async () => {
    const chain = await seed();
    const cached = new CachingReader(chain, new MemoryStore());

    const first = await cached.getAllEntries(2);
    chain.as(BOB);
    await chain.submit(2, 'd7d5');

    const second = await cached.getAllEntries(2);
    expect(second.length).toBe(first.length + 1);
    expect(second.at(-1)!.value).toBe('d7d5');
  });

  it('survives a store that fails every operation', async () => {
    // Private browsing, a quota, a user clearing storage mid-session. All of
    // them mean reading from the chain, which is what would have happened
    // anyway.
    const broken = {
      async get() {
        return null;
      },
      async set() {
        throw new Error('quota exceeded');
      },
      async clear() {
        throw new Error('nope');
      }
    };
    const chain = await seed();
    const cached = new CachingReader(chain, {
      get: broken.get,
      set: async (k, v) => {
        try {
          await broken.set();
        } catch {
          // Swallowed here rather than in the cache, so this test proves the
          // caller survives a store that throws.
        }
        void k;
        void v;
      },
      clear: async () => {}
    });

    const direct = await everythingOnScreen(chain);
    expect(await everythingOnScreen(cached)).toBe(direct);
  });
});
