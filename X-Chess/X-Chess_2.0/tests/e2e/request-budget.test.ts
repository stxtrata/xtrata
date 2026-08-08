// What a minute of watching a game costs, in requests.
//
// This is a budget test, and the budget is real: the public Stacks hosts allow
// an anonymous caller about fifty requests a minute, they share one bucket, and
// the WALLET spends from the same allowance. Every request this board makes is
// one the player might need to send a move.
//
// The board used to spend three per poll - the log, the mempool, and the
// sponsorship - which is thirty-six a minute before the wallet asks for
// anything. A move then failed to broadcast, and the wallet's explanation
// ("unable to parse node response") named nothing that would help.

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

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

const tick = (ms = 10): Promise<void> => new Promise((done) => setTimeout(done, ms));

/** A mock chain that counts every read, the way an endpoint would. */
function counted(remaining: number | null = null) {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  const reads: string[] = [];
  for (const name of [
    'getGame',
    'getPage',
    'getAllEntries',
    'getPending',
    'getSponsorship',
    'getSponsorPrice',
    'getOpenFee'
  ] as const) {
    const original = (chain[name] as (...a: unknown[]) => unknown).bind(chain);
    (chain as unknown as Record<string, unknown>)[name] = (...args: unknown[]) => {
      // getAllEntries is one page for any game this size, so count it as one.
      if (name !== 'getPage') reads.push(name);
      return original(...args);
    };
  }
  // Stand in for the endpoint the live client exposes.
  (chain as unknown as Record<string, unknown>).reader = { remaining };
  return { chain, reads };
}

async function watching(chain: MockChain, as: string = ALICE): Promise<ChessApp> {
  chain.as(ALICE);
  await chain.openGame(rulesHash(RULES), false);
  chain.as(as);
  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId },
    connect: async () => ({ address: as })
  });
  (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
  await tick(30);
  await app.load(1);
  await tick(30);
  return app;
}

type Pollable = { refreshQuietly(): Promise<void>; drawGame(): void; nextPollMs(): number };

describe('the request budget', () => {
  it('spends at most two reads per poll', async () => {
    const { chain, reads } = counted();
    const app = await watching(chain);
    reads.length = 0;

    const inner = app as unknown as Pollable;
    await inner.refreshQuietly();
    inner.drawGame();
    await tick(20);

    expect(reads.length, `one poll made: ${reads.join(', ')}`).toBeLessThanOrEqual(2);
    // Twelve polls a minute at the five second interval, leaving most of a
    // fifty-request allowance for the wallet.
    expect(reads.length * 12).toBeLessThanOrEqual(24);
    app.stopPolling();
  });

  it('does NOT re-read the sponsorship on every draw', async () => {
    // It changes only when this board submits something. Reading it twelve
    // times a minute was a third of the entire allowance spent on a row that
    // had not moved.
    const { chain, reads } = counted();
    const app = await watching(chain);
    const inner = app as unknown as Pollable;

    reads.length = 0;
    for (let i = 0; i < 5; i++) {
      inner.drawGame();
      await tick(20);
    }

    expect(reads.filter((r) => r === 'getSponsorship').length).toBe(0);
    app.stopPolling();
  });

  it('reads it again after a submission, which is what spends one', async () => {
    const { chain, reads } = counted();
    const app = await watching(chain);
    const inner = app as unknown as Pollable;

    inner.drawGame();
    await tick(20);
    reads.length = 0;

    await (app as unknown as { submit(v: string): Promise<void> }).submit('e2e4');
    await tick(40);
    inner.drawGame();
    await tick(20);

    expect(reads.filter((r) => r === 'getSponsorship').length).toBeGreaterThan(0);
    app.stopPolling();
  });
});

describe('yielding to the wallet', () => {
  it('slows right down when the allowance is nearly gone', async () => {
    // What is left belongs to the wallet. A broadcast is not one request: it
    // reads a nonce, estimates a fee, and posts, and it may retry.
    const { chain } = counted(5);
    const app = await watching(chain);
    expect((app as unknown as Pollable).nextPollMs()).toBeGreaterThanOrEqual(30_000);
    app.stopPolling();
  });

  it('NEVER stops reading altogether', async () => {
    // A board that stops is a board that needs a manual Refresh, which is
    // exactly the complaint this pacing exists to remove. However starved it
    // gets, it keeps looking.
    const { chain } = counted(0);
    const app = await watching(chain);
    const ms = (app as unknown as Pollable).nextPollMs();
    expect(Number.isFinite(ms)).toBe(true);
    expect(ms).toBeLessThanOrEqual(60_000);
    app.stopPolling();
  });

  it('slows down by degrees rather than falling off a cliff', async () => {
    const healthy = await watching(counted(45).chain);
    const fast = (healthy as unknown as Pollable).nextPollMs();
    healthy.stopPolling();

    const squeezed = await watching(counted(20).chain);
    const slow = (squeezed as unknown as Pollable).nextPollMs();
    squeezed.stopPolling();

    expect(slow).toBeGreaterThan(fast);
  });
});

describe('spending the budget where it buys something', () => {
  it('reads FAST while a move is in flight', async () => {
    // The gap that had somebody pressing Refresh to make their own move
    // appear. This is the one moment a player is watching the board.
    const { chain } = counted();
    const app = await watching(chain);
    chain.pending = [
      { txid: '0xabc', sender: ALICE, value: 'e2e4', receivedAt: 0, fee: 3000 }
    ];
    await (app as unknown as Pollable).refreshQuietly();
    expect((app as unknown as Pollable).nextPollMs()).toBeLessThanOrEqual(2_500);
    app.stopPolling();
  });

  it('reads SLOWLY when it is your own move and nothing can change', async () => {
    // Waiting on yourself, the position cannot move. Only an event can change
    // this board, and an event is rare - so the requests are better spent
    // elsewhere.
    const { chain } = counted();
    const app = await watching(chain, ALICE);
    chain.as(ALICE);
    await chain.submit(1, 'e2e4');
    // Now it is Black's move and this board holds White: nothing can change.
    await (app as unknown as Pollable).refreshQuietly();
    expect((app as unknown as Pollable).nextPollMs()).toBeGreaterThanOrEqual(15_000);
    app.stopPolling();
  });

  it('reads at the normal rate while waiting on the opponent', async () => {
    // Both players must appear in the log first. Without that the rules cannot
    // be confirmed, the board falls back to an OPEN game where anyone may move
    // either colour, and "waiting on the opponent" is not a state it is in.
    const { chain } = counted();
    const app = await watching(chain, BOB);
    for (const [i, uci] of ['e2e4', 'e7e5', 'g1f3', 'b8c6'].entries()) {
      chain.as(i % 2 === 0 ? ALICE : BOB);
      await chain.submit(1, uci);
    }
    await app.load(1);
    await tick(30);

    const ms = (app as unknown as Pollable).nextPollMs();
    expect(ms).toBeGreaterThan(2_500);
    expect(ms).toBeLessThanOrEqual(5_000);
    app.stopPolling();
  });
});

describe('a sponsorship that cannot be read', () => {
  it('REFUSES to submit rather than sending a transaction that must abort', async () => {
    // The old behaviour was `.catch(() => null)`, so a failed read meant a
    // rebate of zero, which means no post condition covering what the contract
    // pays out. Under deny mode an uncovered transfer aborts the transaction -
    // after the player has paid its network fee for nothing.
    //
    // Failing here, before the wallet opens, costs nothing at all.
    const { chain } = counted();
    // Installed BEFORE the game is watched, so nothing is cached. A read that
    // succeeded once and said "no sponsorship" is a known zero, not a guess -
    // that case is the next test.
    chain.getSponsorship = (async () => {
      const error: Error & { code?: string } = new Error('rate limited');
      error.code = 'RATE_LIMITED';
      throw error;
    }) as typeof chain.getSponsorship;
    const app = await watching(chain);

    const before = await chain.getAllEntries(1);
    await (app as unknown as { submit(v: string): Promise<void> }).submit('e2e4');
    await tick(40);
    const after = await chain.getAllEntries(1);

    expect(after.length, 'nothing may be submitted on a guess').toBe(before.length);
    const notice = dom.window.document.getElementById('chain-notice')!.textContent ?? '';
    expect(notice).toMatch(/rate limit/i);
    expect(notice, 'must not blame the chain').not.toMatch(/chain is unavailable/i);
    app.stopPolling();
  });

  it('DOES submit when the read succeeded and said there is no sponsorship', async () => {
    // The distinction that makes the rule above safe. A rebate of zero that was
    // read is a fact: the contract will pay nothing, so no condition is needed
    // and the transaction is sound. Only an UNKNOWN rebate is dangerous.
    const { chain } = counted();
    const app = await watching(chain);

    const before = await chain.getAllEntries(1);
    await (app as unknown as { submit(v: string): Promise<void> }).submit('e2e4');
    await tick(40);
    const after = await chain.getAllEntries(1);

    expect(after.length).toBe(before.length + 1);
    app.stopPolling();
  });
});

describe('naming the players', () => {
  // The Players panel showed two raw addresses on a game nobody had played
  // yet, because names were only ever looked up for senders in the LOG - and
  // an unplayed game has none. The two people most in need of a readable name
  // are the two at the top of the screen.
  it('asks for the names of the players, not only of whoever has moved', async () => {
    const { chain } = counted();
    const asked: string[] = [];
    const app = await watching(chain, ALICE);
    // Both players must appear before the rules confirm; until they do the
    // board is refereeing an open game and there are no names to ask about.
    for (const [i, uci] of ['e2e4', 'e7e5'].entries()) {
      chain.as(i % 2 === 0 ? ALICE : BOB);
      await chain.submit(1, uci);
    }
    await app.load(1);
    await tick(30);

    const names = (app as unknown as { names: { resolveAll(p: readonly string[]): Promise<boolean> } })
      .names;
    if (names) {
      names.resolveAll = async (principals: readonly string[]) => {
        asked.push(...principals);
        return false;
      };
    }
    await (app as unknown as { resolveLabels(): Promise<void> }).resolveLabels();

    expect(asked, 'white was never looked up').toContain(ALICE);
    expect(asked, 'black was never looked up').toContain(BOB);
    app.stopPolling();
  });
});
