// Watching a finished game play itself.
//
// The position at any ply is REPLAYED rather than stored. There is no per-ply
// position in the log and there should not be: deriving it means a replayed
// board is produced by exactly the code that produces the live one, so the two
// cannot drift into disagreeing about the same game.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';

const WHITE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BLACK = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const RULES = normaliseRules({ ...DEFAULT_RULES, white: WHITE, black: BLACK });
const MATE = ['f2f3', 'e7e5', 'g2g4', 'd8h4'];

const OPENING = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

/** A finished game, and one still being played. */
async function board(finish: boolean): Promise<ChessApp> {
  const chain = new MockChain({ balances: { [WHITE]: 100_000_000n, [BLACK]: 100_000_000n } });
  chain.as(WHITE);
  await chain.openGame(rulesHash(RULES), false);
  const game = await chain.getGameCount();
  const played = finish ? MATE : MATE.slice(0, 2);
  for (let i = 0; i < played.length; i++) {
    chain.as(i % 2 === 0 ? WHITE : BLACK);
    await chain.submit(game, played[i]);
    // Ten blocks between moves, so a gap is a hundred seconds.
    chain.mine(10);
  }

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain: chain as never,
    document: dom.window.document,
    connect: async () => ({ address: WHITE }),
    disconnect: async () => {}
  });
  await app.load(game);
  return app;
}

const inner = (app: ChessApp) =>
  app as unknown as {
    replayPly: number | null;
    replayTimer: unknown;
    canReplay(): boolean;
    replayLength(): number;
    replayGo(ply: number): void;
    replaySpans(): number[];
    stateAt(ply: number): { fen: string } | null;
  };

const panel = (): HTMLElement => dom.window.document.getElementById('replay')!;

describe('replaying a finished game', () => {
  it('is offered for a game that is over', async () => {
    const app = await board(true);
    expect(inner(app).canReplay()).toBe(true);
    expect(panel().classList.contains('hide')).toBe(false);
  });

  it('is not offered for a game still being played', async () => {
    // A live board must show the position as it stands. One that could be
    // scrubbed backwards while a move lands is a board showing one thing and
    // claiming another, and the claim is the whole product.
    const app = await board(false);
    expect(inner(app).canReplay()).toBe(false);
    expect(panel().classList.contains('hide')).toBe(true);
  });

  it('gives the opening position at ply zero', async () => {
    const app = await board(true);
    expect(inner(app).stateAt(0)!.fen.split(' ')[0]).toBe(OPENING);
  });

  it('walks forward one move at a time', async () => {
    const app = await board(true);
    const seen = [0, 1, 2, 3, 4].map((ply) => inner(app).stateAt(ply)!.fen.split(' ')[0]);
    expect(new Set(seen).size, 'every ply is a different position').toBe(5);
    expect(seen[0]).toBe(OPENING);
  });

  it('ends on the same position the live board shows', async () => {
    // The whole safety of deriving rather than storing: the last ply and the
    // live state are produced by the same code from the same log.
    const app = await board(true);
    const total = inner(app).replayLength();
    const live = (app as unknown as { state: { fen: string } }).state;
    expect(inner(app).stateAt(total)!.fen).toBe(live.fen);
  });

  it('stops at either end rather than wrapping', async () => {
    const app = await board(true);
    inner(app).replayGo(-5);
    expect(inner(app).replayPly).toBe(0);
    inner(app).replayGo(999);
    expect(inner(app).replayPly).toBe(inner(app).replayLength());
  });

  it('reads the real gaps off the block heights', async () => {
    // Ten blocks between moves at ten seconds a block.
    const app = await board(true);
    const spans = inner(app).replaySpans();
    expect(spans.length).toBe(inner(app).replayLength() - 1);
    for (const gap of spans) expect(gap).toBe(100);
  });

  it('a replayed board cannot be played on', async () => {
    const app = await board(true);
    inner(app).replayGo(1);
    (app as unknown as { drawGame(): void }).drawGame();
    const live = dom.window.document.querySelectorAll('#board [data-square]:not([disabled])');
    expect(live.length, 'a picture of the past must not accept a move').toBe(0);
  });
});
