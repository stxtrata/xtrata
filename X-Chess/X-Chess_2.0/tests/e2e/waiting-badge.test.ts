// The count of games waiting on you, and when it is allowed to be wrong.
//
// It began as a filter over the Explore list, which meant it only existed once
// that tab had been opened — a notification you had to go looking for. Worse,
// once it existed it was a snapshot: making the last move of a game left it
// reading one, because nothing rebuilt the list until you went back and asked.
//
// So the number lives in its own set now, with one writer, and these are the
// two things that must hold: it goes UP without the tab, and it comes DOWN when
// the game ends.

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

/** A localStorage that behaves, for an environment that has none. */
function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v)
  } as Storage;
}

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
  (globalThis as unknown as Record<string, unknown>).localStorage = fakeStorage();
});

/** A game Alice wins, played out to checkmate. Fool's mate, from black's side. */
async function seedFinished(): Promise<{ chain: MockChain; game: number }> {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  chain.as(ALICE);
  await chain.openGame(rulesHash(RULES), false);
  const game = await chain.getGameCount();
  const script: [string, string][] = [
    [ALICE, 'f2f3'],
    [BOB, 'e7e5'],
    [ALICE, 'g2g4'],
    [BOB, 'd8h4'] // mate
  ];
  for (const [who, mv] of script) {
    chain.as(who);
    await chain.submit(game, mv);
    chain.mine(1);
  }
  return { chain, game };
}

const badge = (): HTMLElement => dom.window.document.getElementById('explore-waiting')!;

describe('the count of games waiting on you', () => {
  it('clears itself when the game ends, without the list being rebuilt', async () => {
    // The complaint exactly: the last move is made, the game is over, and the
    // number still says one until something goes and looks at the list again.
    const { chain, game } = await seedFinished();
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain: chain as never,
      document: dom.window.document,
      connect: async () => ({ address: BOB }),
      disconnect: async () => {}
    });

    (app as unknown as { address: string }).address = BOB;
    const waiting = (app as unknown as { waitingOn: Set<number> }).waitingOn;
    waiting.add(game);
    (app as unknown as { drawWaiting(): void }).drawWaiting();
    expect(badge().textContent, 'the stale count').toBe('1');

    await app.load(game);
    (app as unknown as { noteOpenGame(): void }).noteOpenGame();

    expect(waiting.has(game), 'a finished game is not waiting on anybody').toBe(false);
    expect(badge().textContent).toBe('');
    expect(badge().classList.contains('hide')).toBe(true);
    // Never rebuilt, which is the point: the poll had already read this game.
    expect((app as unknown as { exploreRows: unknown[] }).exploreRows.length).toBe(0);
  });

  it('remembers the game is over so it is never read again', async () => {
    // What makes the background check affordable for somebody with a history.
    const { chain, game } = await seedFinished();
    // YourGames is only built when the chain has an endpoint to ask, which a
    // mock does not. It never reaches the network in this test — `finished` is
    // pure local storage — but the resolver has to exist to be asked.
    (chain as unknown as { reader: unknown }).reader = {
      request: async () => ({ ok: false, status: 503, json: async () => ({}) })
    };
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain: chain as never,
      document: dom.window.document,
      connect: async () => ({ address: BOB }),
      disconnect: async () => {}
    });
    (app as unknown as { address: string }).address = BOB;

    await app.load(game);
    (app as unknown as { noteOpenGame(): void }).noteOpenGame();

    const yours = (app as unknown as { yours: { finished(a: string): Set<number>; live(a: string): number[] } }).yours;
    expect(yours.finished(BOB).has(game)).toBe(true);
    expect(yours.live(BOB)).not.toContain(game);
  });

  it('counts a game it is your move in, from the open game alone', async () => {
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    const game = await chain.getGameCount();
    chain.as(ALICE);
    await chain.submit(game, 'e2e4');
    chain.mine(1);

    mountShell(dom.window.document);
    const app = new ChessApp({
      chain: chain as never,
      document: dom.window.document,
      connect: async () => ({ address: BOB }),
      disconnect: async () => {}
    });
    (app as unknown as { address: string }).address = BOB;

    await app.load(game);
    (app as unknown as { noteOpenGame(): void }).noteOpenGame();

    // White has moved, so it is black's turn and black is the connected wallet.
    expect((app as unknown as { waitingOn: Set<number> }).waitingOn.has(game)).toBe(true);
    expect(badge().textContent).toBe('1');
  });

  it('does not carry one wallet’s count over to the next', async () => {
    const { chain, game } = await seedFinished();
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain: chain as never,
      document: dom.window.document,
      connect: async () => ({ address: BOB }),
      disconnect: async () => {}
    });
    (app as unknown as { address: string }).address = BOB;
    (app as unknown as { waitingOn: Set<number> }).waitingOn.add(game);

    (app as unknown as { address: string | null }).address = null;
    (app as unknown as { viewerChanged(): void }).viewerChanged();

    expect((app as unknown as { waitingOn: Set<number> }).waitingOn.size).toBe(0);
    expect(badge().textContent).toBe('');
  });
});
