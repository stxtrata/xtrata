// The board must move on the click, not on the signature.
//
// The bug: `submit()` awaited the wallet before redrawing anything, so between
// choosing a destination and a wallet dialog appearing the board did not change
// at all. From the player's side that is seconds of a board that looks like it
// did not hear the click - and then, if they cancelled, seconds more of
// wondering whether it had gone anyway.
//
// These tests hold the wallet open on purpose. That is the moment that was
// broken, and it is the only moment worth testing here.

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

/** A chain whose `submit` never settles, so the wallet stays open. */
function heldChain(): { chain: MockChain; release: (ok: boolean) => void } {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  let settle: ((ok: boolean) => void) | null = null;

  const original = chain.submit.bind(chain);
  chain.submit = (async (game: number, value: string) => {
    await new Promise<void>((done, fail) => {
      settle = (ok: boolean) => (ok ? done() : fail(new Error('User rejected the request')));
    });
    return original(game, value);
  }) as typeof chain.submit;

  return {
    chain,
    release: (ok: boolean) => settle?.(ok)
  };
}

async function boardWithGame(chain: MockChain): Promise<ChessApp> {
  chain.as(ALICE);
  await chain.openGame(rulesHash(RULES), false);
  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId },
    connect: async () => ({ address: ALICE })
  });
  // Connect, so the board is allowed to submit at all.
  (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
  await tick(30);
  await app.load(1);
  await tick(30);
  return app;
}

const tick = (ms = 10): Promise<void> => new Promise((done) => setTimeout(done, ms));

const square = (name: string): HTMLButtonElement =>
  dom.window.document.querySelector(`[data-square='${name}']`) as HTMLButtonElement;

const ghosts = (): string[] =>
  [...dom.window.document.querySelectorAll('.sq--pending')].map(
    (n) => (n as HTMLElement).dataset.square ?? ''
  );

describe('choosing a move', () => {
  it('highlights the piece as soon as it is picked up', async () => {
    const { chain } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();

    expect(square('e2').classList.contains('sq--selected')).toBe(true);
    // And its destinations are offered.
    expect(square('e4').classList.contains('sq--target')).toBe(true);
    app.stopPolling();
  });

  it('draws the move BEFORE the wallet settles', async () => {
    // The whole bug, in one assertion. The wallet is still open here.
    const { chain, release } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();
    square('e4').click();
    await tick();

    expect(ghosts(), 'no ghost while the wallet is open').toContain('e4');
    expect(square('e4').classList.contains('sq--signing')).toBe(true);
    expect(square('e2').classList.contains('sq--signing')).toBe(true);
    expect(dom.window.document.querySelectorAll('.pc--ghost').length).toBe(1);

    release(true);
    await tick(30);
    app.stopPolling();
  });

  it('says the wallet is what is being waited on', async () => {
    const { chain, release } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();
    square('e4').click();
    await tick();

    const hint = dom.window.document.getElementById('move-hint')!.textContent ?? '';
    expect(hint).toContain('waiting for your wallet');
    expect(hint, 'must not claim it was sent').toContain('Nothing has been sent');

    release(true);
    await tick(30);
    app.stopPolling();
  });

  it('says it is broadcast once it is signed', async () => {
    const { chain, release } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();
    square('e4').click();
    await tick();
    release(true);
    await tick(40);

    // The mock lands it immediately, so by now it is a real move rather than a
    // ghost. Either way the board must not still be saying "waiting".
    const hint = dom.window.document.getElementById('move-hint')!.textContent ?? '';
    expect(hint).not.toContain('waiting for your wallet');
    app.stopPolling();
  });

  it('TAKES THE GHOST BACK when the wallet is cancelled', async () => {
    // A ghost left behind after a cancellation is the board asserting something
    // that is not going to happen, which is worse than showing nothing.
    const { chain, release } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();
    square('e4').click();
    await tick();
    expect(ghosts()).toContain('e4');

    release(false);
    await tick(40);

    expect(ghosts(), 'the ghost survived a cancellation').not.toContain('e4');
    expect(dom.window.document.querySelectorAll('.pc--ghost').length).toBe(0);
    app.stopPolling();
  });

  it('lets the move be made again after a cancellation', async () => {
    const { chain, release } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();
    square('e4').click();
    await tick();
    release(false);
    await tick(40);

    // Not stuck: the squares are live again.
    expect(square('e2').disabled).toBe(false);
    square('e2').click();
    await tick();
    expect(square('e2').classList.contains('sq--selected')).toBe(true);
    app.stopPolling();
  });
});

describe('what somebody else watching sees', () => {
  it('draws a ghost for a move in the mempool that is not theirs', async () => {
    // Read from the mempool, so it is whoever is watching - not just the sender.
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    chain.pending = [
      { txid: '0xabc', sender: BOB, value: 'e7e5', receivedAt: Date.now(), fee: 3000 }
    ];

    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId }
    });
    await app.load(1);
    await tick(30);

    expect(ghosts()).toContain('e5');
    expect(dom.window.document.getElementById('status')!.textContent).toContain(
      'broadcast, not yet in a block'
    );
    app.stopPolling();
  });

  it('ignores a pending submission that is not a move', async () => {
    // A pending `resgn` has no square to draw at, and inventing one would show
    // something that is not going to happen.
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    chain.pending = [
      { txid: '0xabc', sender: BOB, value: 'resgn', receivedAt: Date.now(), fee: 3000 }
    ];

    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId }
    });
    await app.load(1);
    await tick(30);

    expect(dom.window.document.querySelectorAll('.pc--ghost').length).toBe(0);
    // But it is still listed, because it is still a real submission.
    expect(dom.window.document.getElementById('moves')!.textContent).toContain('resgn');
    app.stopPolling();
  });
});

describe('what a pending move does to the square it left', () => {
  it('EMPTIES the origin rather than fading it', async () => {
    // Two glyphs of the same piece on the board at once reads as two pieces.
    // The eye counts material long before it reads opacity.
    const { chain, release } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();
    square('e4').click();
    await tick();

    expect(square('e2').querySelectorAll('.pc').length, 'e2 still has a piece on it').toBe(0);
    expect(square('e2').classList.contains('sq--vacated')).toBe(true);
    expect(square('e4').querySelectorAll('.pc--ghost').length).toBe(1);

    // Seven SOLID white pawns and one hollow one. The piece that is leaving is
    // drawn once, at its destination, as a shape that is not there yet.
    const pawns = [...dom.window.document.querySelectorAll('.pc--white.pc--p')];
    expect(pawns.filter((n) => !n.classList.contains('pc--ghost')).length).toBe(7);
    expect(pawns.filter((n) => n.classList.contains('pc--ghost')).length).toBe(1);

    release(true);
    await tick(30);
    app.stopPolling();
  });

  it('puts the piece back when the wallet is cancelled', async () => {
    const { chain, release } = heldChain();
    const app = await boardWithGame(chain);

    square('e2').click();
    await tick();
    square('e4').click();
    await tick();
    release(false);
    await tick(40);

    expect(square('e2').querySelectorAll('.pc').length).toBe(1);
    expect(square('e2').classList.contains('sq--vacated')).toBe(false);
    app.stopPolling();
  });
});

describe('being in check', () => {
  // 1.e4 e5 2.Bc4 Nc6 3.Qh5 g6 4.Qxe5+ - check, and NOT mate. Verified:
  // r1bqkbnr/pppp1p1p/2n3p1/4Q3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4.
  //
  // The obvious line here is Scholar's mate, and it is the wrong fixture: the
  // last move is checkmate, so the status line reads "White wins" and there is
  // no live check to assert on.
  const CHECK_LINE = ['e2e4', 'e7e5', 'f1c4', 'b8c6', 'd1h5', 'g7g6', 'h5e5'];

  async function gameInCheck(): Promise<ChessApp> {
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    for (const [i, uci] of CHECK_LINE.entries()) {
      chain.as(i % 2 === 0 ? ALICE : BOB);
      await chain.submit(1, uci);
    }
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId }
    });
    await app.load(1);
    await tick(30);
    return app;
  }

  it('marks the king that is in check', async () => {
    const app = await gameInCheck();
    expect(square('e8').classList.contains('sq--check')).toBe(true);
    // And only that one.
    expect(dom.window.document.querySelectorAll('.sq--check').length).toBe(1);
    app.stopPolling();
  });

  it('says so in the status line, first and loudly', async () => {
    const app = await gameInCheck();
    const status = dom.window.document.getElementById('status')!;
    expect(status.textContent).toContain('IN CHECK');
    expect(status.className, 'a grey note is not enough for check').toContain('warn');
    app.stopPolling();
  });

  it('says so to a screen reader too', async () => {
    const app = await gameInCheck();
    expect(square('e8').getAttribute('aria-label')).toContain('in check');
    app.stopPolling();
  });

  it('leaves every king unmarked when nobody is in check', async () => {
    const { chain } = heldChain();
    const app = await boardWithGame(chain);
    expect(dom.window.document.querySelectorAll('.sq--check').length).toBe(0);
    app.stopPolling();
  });
});

describe('THE REPORTED BUG: a move for the wrong colour', () => {
  // "my wallet is named as white the board is allowing me to select a black
  // piece and opens the wallet to let me pay - we need to protect against this
  // as we know the move will be rejected."
  //
  // Driven through the DOM rather than the verdict function, because the whole
  // failure was that the verdict and the squares were computed separately.

  async function whiteWallet_blackToMove(): Promise<{ app: ChessApp; chain: MockChain }> {
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    // BOTH players must appear in the log before the rules can be confirmed.
    // recoverRules searches candidates built from the opener plus the observed
    // senders, so a game where the opponent has not moved yet cannot be
    // confirmed at all - and an unconfirmed board is not allowed to lock
    // anything. That is not a limitation to work around here, it is the safety
    // property: this test would pass against a board that refused everything.
    chain.as(ALICE);
    await chain.submit(1, 'e2e4');
    chain.as(BOB);
    await chain.submit(1, 'e7e5');
    chain.as(ALICE);
    await chain.submit(1, 'g1f3'); // Black to move again, both players known
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId },
      connect: async () => ({ address: ALICE })
    });
    (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
    await tick(30);
    await app.load(1);
    await tick(30);
    return { app, chain };
  }

  it('does not let a black piece be picked up by the white wallet', async () => {
    const { app } = await whiteWallet_blackToMove();
    expect(square('d7').disabled, 'a black pawn was clickable on White’s board').toBe(true);
    app.stopPolling();
  });

  it('does not reach the chain even if the square is clicked anyway', async () => {
    const { app, chain } = await whiteWallet_blackToMove();
    const before = (await chain.getAllEntries(1)).length;

    square('d7').click();
    await tick();
    square('d5').click();
    await tick(40);

    expect((await chain.getAllEntries(1)).length, 'a doomed move was submitted').toBe(before);
    expect(ghosts(), 'and no ghost was drawn for it').not.toContain('d5');
    app.stopPolling();
  });

  it('says why, in the same words replay would use', async () => {
    const { app } = await whiteWallet_blackToMove();
    const hint = dom.window.document.getElementById('move-hint')!.textContent ?? '';
    expect(hint).toContain('black to move');
    expect(hint).toContain('stored, charged, and skipped');
    app.stopPolling();
  });

  it('still lets the BLACK wallet move', async () => {
    // The other half. A gate that stopped the wrong player and also stopped the
    // right one would have made the game unplayable.
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    chain.as(ALICE);
    await chain.submit(1, 'e2e4');
    chain.as(BOB);
    await chain.submit(1, 'e7e5');
    chain.as(ALICE);
    await chain.submit(1, 'g1f3');
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId },
      connect: async () => ({ address: BOB })
    });
    (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
    await tick(30);
    await app.load(1);
    await tick(30);

    expect(square('d7').disabled).toBe(false);
    const before = (await chain.getAllEntries(1)).length;
    square('d7').click();
    await tick();
    square('d5').click();
    await tick(40);
    expect((await chain.getAllEntries(1)).length).toBe(before + 1);
    app.stopPolling();
  });
});

describe('a board locked against the wrong account', () => {
  // ALICE is White. Three moves in it is Black's turn, so every square on this
  // board is a move ALICE cannot make: replay would store it, charge her, and
  // skip it.
  //
  // There used to be a "Let me try anyway" panel here, on the reasoning that
  // the board cannot know which account the wallet will sign with and must
  // never trap a player. It is gone. The trap it guarded against has a cheaper
  // exit - reconnect with the account you meant - and the button it offered
  // instead spent real money on a submission the board had, in the sentence
  // directly above it, just finished calling doomed.
  //
  // These tests exist to keep it gone.
  async function locked(): Promise<ChessApp> {
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    chain.as(ALICE);
    await chain.submit(1, 'e2e4');
    chain.as(BOB);
    await chain.submit(1, 'e7e5');
    chain.as(ALICE);
    await chain.submit(1, 'g1f3');
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId },
      connect: async () => ({ address: ALICE })
    });
    (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
    await tick(30);
    await app.load(1);
    await tick(30);
    return app;
  }

  it('says whose turn it is, which account is connected, and what to do', async () => {
    // A locked board with no explanation IS the trap the override guarded
    // against. What replaces the button is the sentence: the fix has to be on
    // screen, or the lock is just a dead board.
    const app = await locked();
    const said = dom.window.document.getElementById('move-hint')!.textContent ?? '';

    expect(said, 'does not say whose turn it is').toContain('black to move');
    expect(said, 'does not name the connected account').toContain(ALICE);
    expect(said, 'does not say how to fix it').toContain('reconnect');
    app.stopPolling();
  });

  it('offers nothing that would spend money on the doomed move', async () => {
    const app = await locked();
    const doc = dom.window.document;

    expect(square('d7').disabled, 'a black piece was clickable').toBe(true);
    expect(doc.getElementById('override'), 'the override panel came back').toBe(null);
    expect(doc.getElementById('override-yes'), 'the override button came back').toBe(null);
    expect(
      doc.getElementById('send-anyway')!.classList.contains('hide'),
      'send-anyway offered on a proven-doomed board'
    ).toBe(true);
    app.stopPolling();
  });

  it('cannot be talked past by anything left on the page', async () => {
    // The panel was deleted rather than hidden, and the difference matters: a
    // hidden control that still works is not hidden. Nothing on this page - no
    // stale node, no leftover handler - can put a black piece back in reach.
    const app = await locked();
    const doc = dom.window.document;

    let clicked = 0;
    for (const button of Array.from(doc.querySelectorAll('button'))) {
      const id = button.id;
      // Not these two: one navigates away from the game entirely and the other
      // turns the board round, and neither claims to unlock anything.
      if (id === 'load-game' || id === 'flip') continue;
      button.click();
      clicked++;
    }
    await tick(40);

    // Or the loop above proves nothing. A selector that stops matching is how a
    // test like this quietly becomes a pass with no work in it.
    expect(clicked, 'nothing was clicked').toBeGreaterThan(10);

    expect(square('d7').disabled, `a button unlocked the board`).toBe(true);
    app.stopPolling();
  });
});

describe('a castle in the mempool', () => {
  // One submission, two pieces. A castle is written as a king move of two
  // files - e1g1 - and the rook is implied by the rules rather than named, so a
  // board that drew only what the submission says leaves the rook on its corner
  // while the king slides past it.
  async function readyToCastle(as: string): Promise<ChessApp> {
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    // 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 — White may now castle kingside.
    const line = ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5'];
    for (const [i, uci] of line.entries()) {
      chain.as(i % 2 === 0 ? ALICE : BOB);
      await chain.submit(1, uci);
    }
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId },
      connect: async () => ({ address: as })
    });
    (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
    await tick(30);
    return app;
  }

  it('ghosts the ROOK as well as the king', async () => {
    const app = await readyToCastle(BOB);
    const chain = (app as unknown as { chain: MockChain }).chain;
    chain.pending = [
      { txid: '0xabc', sender: ALICE, value: 'e1g1', receivedAt: Date.now(), fee: 3000 }
    ];
    await app.load(1);
    await tick(30);

    expect(ghosts(), 'the king').toContain('g1');
    expect(ghosts(), 'the rook, which the submission never names').toContain('f1');
    expect(square('e1').querySelectorAll('.pc').length, 'e1 emptied').toBe(0);
    expect(square('h1').querySelectorAll('.pc').length, 'h1 emptied').toBe(0);
    app.stopPolling();
  });

  it('does the same queenside, on the other rank', async () => {
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    // Black clears its queenside: 1.e4 d5 2.d4 Nc6 3.Nc3 Bf5 4.Nf3 Qd7 5.Bd2 e6
    const line = ['e2e4', 'd7d5', 'd2d4', 'b8c6', 'b1c3', 'c8f5', 'g1f3', 'd8d7', 'c1d2', 'e7e6'];
    for (const [i, uci] of line.entries()) {
      chain.as(i % 2 === 0 ? ALICE : BOB);
      await chain.submit(1, uci);
    }
    chain.pending = [
      { txid: '0xabc', sender: BOB, value: 'e8c8', receivedAt: Date.now(), fee: 3000 }
    ];
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId }
    });
    await app.load(1);
    await tick(30);

    expect(ghosts()).toContain('c8');
    expect(ghosts()).toContain('d8');
    app.stopPolling();
  });

  it('does NOT invent a rook for an ordinary two-square king move', async () => {
    // There is no such move, but the detection is geometric, so it is worth
    // pinning that it only fires on a king standing where a king can castle.
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    chain.pending = [
      { txid: '0xabc', sender: ALICE, value: 'e2e4', receivedAt: Date.now(), fee: 3000 }
    ];
    mountShell(dom.window.document);
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      build: { network: 'devnet', contract: chain.contractId }
    });
    await app.load(1);
    await tick(30);

    expect(dom.window.document.querySelectorAll('.pc--ghost').length).toBe(1);
    app.stopPolling();
  });
});
