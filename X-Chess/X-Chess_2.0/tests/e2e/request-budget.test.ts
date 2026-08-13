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
  // SUPERSEDED, and the replacement is stronger.
  //
  // These two cases used to encode a careful rule: read the sponsorship before
  // signing, and REFUSE to submit if the read failed, because a failed read
  // produced a rebate of zero, no condition covering the contract's payout, and
  // a transaction that aborts after the contract has already succeeded.
  //
  // The rule was right about the danger and wrong about the fix, because the
  // board cannot know which account the wallet will sign with - so even a read
  // that SUCCEEDS describes the wrong player whenever the signer differs. The
  // guard now declares the protocol's own ceiling, which is always sufficient
  // and never wrong, whoever signs.
  //
  // So a sponsorship that cannot be read is no longer a reason to refuse: it no
  // longer has any bearing on whether the transaction can land. That removes a
  // failure mode rather than adding one, and it is worth asserting.
  it('submits even when the sponsorship cannot be read, because it no longer matters', async () => {
    const { chain } = counted();
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

    expect(
      after.length,
      'a move was blocked by a read the guard no longer depends on'
    ).toBe(before.length + 1);
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

describe('opening a game by number', () => {
  // Reading a game is several round trips. Before this, the button went back
  // to looking untouched, the board still showed the PREVIOUS game, and the
  // natural response was to click again - which starts the whole thing twice.
  it('acknowledges the click before anything is awaited', async () => {
    const { chain } = counted();
    const app = await watching(chain, ALICE);
    const doc = dom.window.document;

    // A chain that never answers, so the moment being tested is held open.
    chain.getGame = (() => new Promise(() => {})) as typeof chain.getGame;

    (doc.getElementById('join-game') as HTMLInputElement).value = '1';
    (doc.getElementById('load-game') as HTMLButtonElement).click();
    await tick(20);

    const button = doc.getElementById('load-game') as HTMLButtonElement;
    expect(button.disabled, 'a second click could start it twice').toBe(true);
    expect(button.textContent).toContain('Finding');
    expect(doc.getElementById('chain-notice')!.textContent).toContain('Looking for game 1');
    expect(doc.getElementById('board')!.classList.contains('board--loading')).toBe(true);
    app.stopPolling();
  });

  it('gives the button back when the read finishes', async () => {
    const { chain } = counted();
    const app = await watching(chain, ALICE);
    const doc = dom.window.document;

    (doc.getElementById('join-game') as HTMLInputElement).value = '1';
    (doc.getElementById('load-game') as HTMLButtonElement).click();
    await tick(60);

    const button = doc.getElementById('load-game') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.textContent).not.toContain('Finding');
    expect(doc.getElementById('board')!.classList.contains('board--loading')).toBe(false);
    app.stopPolling();
  });

  it('gives it back even when the game does not exist', async () => {
    // The failure path is exactly when somebody is most likely to click again.
    const { chain } = counted();
    const app = await watching(chain, ALICE);
    const doc = dom.window.document;

    (doc.getElementById('join-game') as HTMLInputElement).value = '999';
    (doc.getElementById('load-game') as HTMLButtonElement).click();
    await tick(60);

    const button = doc.getElementById('load-game') as HTMLButtonElement;
    expect(button.disabled, 'a failed read left the button dead').toBe(false);
    expect(doc.getElementById('chain-notice')!.textContent).toContain('999');
    app.stopPolling();
  });
});

describe('the sound panel', () => {
  it('shows one row until the detail is asked for', async () => {
    // Fourteen per-voice switches on screen at all times made a setting most
    // people touch once look like a mixing desk.
    const { chain } = counted();
    const app = await watching(chain, ALICE);
    const doc = dom.window.document;

    const detail = doc.getElementById('sound-detail')!;
    const more = doc.getElementById('sound-more') as HTMLButtonElement;
    expect(detail.classList.contains('hide')).toBe(true);
    expect(doc.getElementById('sound-master')).toBeTruthy();
    expect(doc.getElementById('sound-volume')).toBeTruthy();

    more.click();
    expect(detail.classList.contains('hide')).toBe(false);
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(more.textContent).toBe('Less');

    more.click();
    expect(detail.classList.contains('hide')).toBe(true);
    expect(more.getAttribute('aria-expanded')).toBe('false');
    app.stopPolling();
  });
});

describe('a sponsored game with nobody to sponsor', () => {
  // A sponsorship PUSHES gas to a named wallet in the opening transaction.
  // There is no anonymous version, and the reason is the reason sponsorship
  // exists: a wallet holding nothing cannot send a transaction, so it could
  // never claim a pot later either. Somebody has to say where the gas goes.
  //
  // Before this the board took the request all the way to the wallet and failed
  // with "not a Stacks address" from the codec, several layers down.
  async function openWith(kind: string, white: string, black: string) {
    const { chain } = counted();
    const app = await watching(chain, ALICE);
    const doc = dom.window.document;
    (doc.getElementById('game-kind') as HTMLSelectElement).value = kind;
    (doc.getElementById('rules-white') as HTMLInputElement).value = white;
    (doc.getElementById('rules-black') as HTMLInputElement).value = black;
    (doc.getElementById('rules-white') as HTMLInputElement).dispatchEvent(
      new dom.window.Event('input', { bubbles: true })
    );
    await tick(20);
    const before = await chain.getGameCount();
    (doc.getElementById('open-game') as HTMLButtonElement).click();
    await tick(60);
    return { app, chain, before, notice: doc.getElementById('chain-notice')!.textContent ?? '' };
  }

  it('is refused before the wallet opens, and says why', async () => {
    const { app, chain, before, notice } = await openWith('sponsor-both', 'anyone', 'anyone');
    expect(await chain.getGameCount(), 'nothing should have been opened').toBe(before);
    expect(notice).toMatch(/not a named wallet/i);
    expect(notice, 'must explain, not just refuse').toMatch(/could not claim it later/i);
    app.stopPolling();
  });

  it('names which side is the problem', async () => {
    const { app, notice } = await openWith('sponsor-opponent', ALICE, 'anyone');
    expect(notice).toContain('Black');
    expect(notice).not.toContain('White and Black');
    app.stopPolling();
  });

  it('still opens a sponsored game when both sides are named', async () => {
    const { app, chain, before } = await openWith('sponsor-both', ALICE, BOB);
    expect(await chain.getGameCount()).toBe(before + 1);
    app.stopPolling();
  });

  it('still opens a STANDARD game for anyone, which needs no address', async () => {
    const { app, chain, before } = await openWith('standard', 'anyone', 'anyone');
    expect(await chain.getGameCount()).toBe(before + 1);
    app.stopPolling();
  });
});

// ---------------------------------------------------------------------------
// The first paint, which is what a shared link pays for.
// ---------------------------------------------------------------------------

describe('opening a link to one game', () => {
  it('does not also read the whole game list', async () => {
    // checkContract used to fire loadExplore unconditionally at boot, so
    // following a shared link - the entire onboarding path - paid for a list
    // nobody had asked for, alongside the board's own read. loadExplore reads
    // AND replays every listed game; its own comment says that spend is why it
    // never runs on a poll.
    const { chain, reads } = counted();
    chain.as(ALICE);
    for (let n = 0; n < 6; n++) await chain.openGame(rulesHash(RULES), false);
    await chain.submit(1, 'e2e4');

    reads.length = 0;
    // Booted at a link to ONE game, which is what a spectator follows.
    const linked = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
      url: 'https://example.test/xchess.html?game=1'
    });
    (globalThis as unknown as Record<string, unknown>).document = linked.window.document;
    mountShell(linked.window.document);
    new ChessApp({
      chain,
      document: linked.window.document,
      build: { network: 'devnet', contract: chain.contractId }
    });
    await tick(80);

    const listReads = reads.filter((r) => r === 'getGame').length;
    expect(
      listReads,
      `opening one game read ${listReads} games: ${reads.join(', ')}`
    ).toBeLessThanOrEqual(2);
  });
});
