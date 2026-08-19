// Two ways the board took a click and did nothing anybody could see.
//
// Both came from one game. Game 8's Black player reported the board as broken —
// "tried to move and did not make any move" — and the chain showed two separate
// causes, neither of which the board had ever explained.
//
// The position below is the real one, replayed from game 8's own accepted
// moves. It is worth the forty-three lines: a made-up check would have four
// legal answers by luck, and this one has five because a real game arrived
// there.

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

/** Game 8's forty-three accepted moves, White first. Ends on Qg3+. */
const GAME_8 = [
  'e2e4', 'd7d6', 'd1f3', 'g8f6', 'f1c4', 'c8g4', 'f3b3', 'e7e6', 'b3b7', 'b8d7',
  'g1e2', 'd7c5', 'c4b5', 'f6d7', 'b7c6', 'f8e7', 'e1g1', 'e8g8', 'd2d4', 'g4e2',
  'b5e2', 'c5e4', 'c6e4', 'd6d5', 'e4g4', 'c7c5', 'c1h6', 'e7f6', 'd4c5', 'd7e5',
  'g4g3', 'd8e7', 'c5c6', 'e5c6', 'e2d3', 'f6d4', 'h6g7', 'd4g7', 'g3h3', 'f7f5',
  'h3e3', 'g7b2', 'e3g3'
];

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

async function atGame8(): Promise<{ chain: MockChain; game: number }> {
  const chain = new MockChain({ balances: { [WHITE]: 100_000_000n, [BLACK]: 100_000_000n } });
  chain.as(WHITE);
  await chain.openGame(rulesHash(RULES), true);
  const game = await chain.getGameCount();
  for (let i = 0; i < GAME_8.length; i++) {
    chain.as(i % 2 === 0 ? WHITE : BLACK);
    await chain.submit(game, GAME_8[i]);
    chain.mine(1);
  }
  return { chain, game };
}

const app = (chain: MockChain, viewer: string): ChessApp => {
  mountShell(dom.window.document);
  const made = new ChessApp({
    chain: chain as never,
    document: dom.window.document,
    connect: async () => ({ address: viewer }),
    disconnect: async () => {}
  });
  (made as unknown as { address: string }).address = viewer;
  return made;
};

const notice = (): string => dom.window.document.getElementById('chain-notice')?.textContent ?? '';

describe('picking up a piece that cannot move', () => {
  it('says which squares can answer a check', async () => {
    // The forty-hour bug. Black is in check with five legal moves out of a
    // normal thirty, so almost every piece is inert - and clicking an inert one
    // selected it, silently, forever.
    const { chain, game } = await atGame8();
    const board = app(chain, BLACK);
    await board.load(game);

    const state = (board as unknown as { state: { inCheck: boolean; legalMoves: string[] } }).state;
    expect(state.inCheck, 'the position under test').toBe(true);
    expect(state.legalMoves.length).toBe(5);

    // a7 is a black pawn with nowhere to go while the king is in check.
    (board as unknown as { onSquare(s: string): void }).onSquare('a7');

    expect(notice()).toContain('in check');
    // The useful half: where a move IS available.
    for (const square of ['b2', 'e7', 'g8']) expect(notice()).toContain(square);
  });

  it('stays quiet when the piece has somewhere to go', async () => {
    const { chain, game } = await atGame8();
    const board = app(chain, BLACK);
    await board.load(game);
    (board as unknown as { onSquare(s: string): void }).onSquare('g8');
    expect(notice()).not.toContain('in check');
  });

  it('stays quiet when it is not your move', async () => {
    // Somebody looking at a board they are not playing on is browsing, and a
    // warning on every click would be noise.
    const { chain, game } = await atGame8();
    const board = app(chain, WHITE);
    await board.load(game);
    (board as unknown as { onSquare(s: string): void }).onSquare('a2');
    expect(notice()).not.toContain('in check');
  });
});

describe('a second submission while the first is still in the mempool', () => {
  it('warns rather than sending it', async () => {
    // Game 8 seq 29 and 30: the same move twice, two blocks apart, because at
    // 0.0004 STX the first sat in the mempool longer than the player believed a
    // click could take. The second was charged and skipped.
    const { chain, game } = await atGame8();
    const board = app(chain, BLACK);
    await board.load(game);

    (board as unknown as { pending: unknown[] }).pending = [
      { txid: '0xabc', sender: BLACK, value: 'e7g7', receivedAt: null, fee: null, nonce: null }
    ];

    let sent = 0;
    const real = chain.submit.bind(chain);
    chain.submit = (async (...args: Parameters<typeof real>) => {
      sent++;
      return real(...args);
    }) as typeof chain.submit;

    await (board as unknown as { submit(v: string): Promise<void> }).submit('e7g7');

    expect(sent, 'nothing may be signed while one is in flight').toBe(0);
    const why = dom.window.document.getElementById('send-anyway-why')?.textContent ?? '';
    expect(why).toContain('not yet in a block');
    expect(why).toContain('Send it anyway?');
  });

  it('lets it through when the pending move is somebody else’s', async () => {
    const { chain, game } = await atGame8();
    const board = app(chain, BLACK);
    await board.load(game);
    (board as unknown as { pending: unknown[] }).pending = [
      { txid: '0xabc', sender: WHITE, value: 'g3g7', receivedAt: null, fee: null, nonce: null }
    ];

    await (board as unknown as { submit(v: string): Promise<void> }).submit('e7g7');
    const why = dom.window.document.getElementById('send-anyway-why')?.textContent ?? '';
    expect(why).not.toContain('not yet in a block');
  });
});
