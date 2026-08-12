// A link somebody sends their opponent has to open the game.
//
// `copyLink` always BUILT the link and nothing ever read the game back out, so
// following one landed you on the create-a-game form. The rules travelled
// correctly and the game number did not, which is the one path a new player
// takes and the one nobody had walked end to end.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { linkForGame } from '../../packages/protocol/known-rules.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const RULES = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB });

const tick = (ms = 40): Promise<void> => new Promise((done) => setTimeout(done, ms));

beforeEach(() => resetForTests());

/** Boot a board at a given address, with two games already on chain. */
async function boardAt(url: string): Promise<{ dom: JSDOM; app: ChessApp }> {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  chain.as(ALICE);
  await chain.openGame(rulesHash(RULES), false);
  await chain.openGame(rulesHash(RULES), false);
  await chain.submit(2, 'e2e4');

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId }
  });
  await tick(60);
  return { dom, app };
}

// The URL a spectator is actually given.
//
// Tested on 2026-08-12 against the live board and it did NOT work: the page
// landed on Play and the Game tab said "no game loaded". The cause was not a
// defect in this code. Inscription 2988 was built on 2026-08-09 from a tree that
// had no `openFromLink` at all - the function arrived the next day in bf8e8b01 -
// so the live board has never been able to read `?game=`.
//
// Which makes this the one shape nothing covered: every other fixture in this
// file is a plain `https://example.test/xchess.html`, and the address a real
// visitor is on is `xtrata.xyz/i/<id>?game=<n>`. The Xtrata handler forwards the
// whole query string (`functions/inscription/handler.ts:60`), so the board does
// see it - and nothing asserted that it acts on it.
describe('the address a spectator is actually given', () => {
  it('opens the game from an /i/<id>?game=<n> link', async () => {
    const { dom } = await boardAt('https://xtrata.xyz/i/2988?game=2');
    expect(dom.window.document.getElementById('game-label')!.textContent).toContain('Game 2');
  });

  it('opens it from the runtime address the query is rewritten to', async () => {
    // What the board is really loaded at once the runtime has it, carrying the
    // parameters the site needs alongside the one we added.
    const { dom } = await boardAt(
      'https://xtrata.xyz/runtime/?contractId=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary' +
        '&tokenId=2988&network=mainnet&game=2'
    );
    expect(dom.window.document.getElementById('game-label')!.textContent).toContain('Game 2');
  });

  it('ignores a game number that is not one, rather than showing an error', async () => {
    const { dom } = await boardAt('https://xtrata.xyz/i/2988?game=not-a-number');
    expect(dom.window.document.getElementById('game-label')!.textContent).not.toContain('Game');
  });
});

describe('following a shared link', () => {
  it('opens the game rather than the create form', async () => {
    const { dom, app } = await boardAt('https://example.test/xchess.html?game=2');
    expect(dom.window.document.getElementById('game-label')!.textContent).toContain('Game 2');
    // And it is the GAME tab that is showing, not Play.
    expect(dom.window.document.getElementById('view-game')!.classList.contains('hide')).toBe(false);
    app.stopPolling();
  });

  it('reads the whole link copyLink actually produces', async () => {
    // Not a hand-written query. The real thing, rules payload and all.
    const link = linkForGame('https://example.test/xchess.html', 2, RULES);
    expect(link).toContain('game=2');
    const { dom, app } = await boardAt(link);
    expect(dom.window.document.getElementById('game-label')!.textContent).toContain('Game 2');
    app.stopPolling();
  });

  it('works from the fragment too', async () => {
    // The Xtrata runtime serves an inscription from a path that already carries
    // a query, so the game may arrive after the hash instead.
    const { dom, app } = await boardAt('https://example.test/i/9002#game=1');
    expect(dom.window.document.getElementById('game-label')!.textContent).toContain('Game 1');
    app.stopPolling();
  });

  it('lands on the create form when there is no game in the link', async () => {
    const { dom, app } = await boardAt('https://example.test/xchess.html');
    expect(dom.window.document.getElementById('view-play')!.classList.contains('hide')).toBe(false);
    app.stopPolling();
  });

  it('ignores a nonsense game number instead of shouting about it', async () => {
    // Somebody's typo, or a truncated link. The create form is a reasonable
    // place to land and an error banner would only be noise.
    for (const bad of ['0', '-3', 'abc', '1.5']) {
      const { dom, app } = await boardAt(`https://example.test/xchess.html?game=${bad}`);
      expect(dom.window.document.getElementById('view-play')!.classList.contains('hide')).toBe(
        false
      );
      app.stopPolling();
    }
  });
});
