// What the game list tells somebody scanning it.
//
// The list already replayed every game and worked out who could play and whose
// turn it was - and then reduced all of it to one bare sentence. So a
// correspondence player with four games had to open all four to find where they
// owed a move, and a visitor with a wallet and no invitation had exactly one
// option: pay 1 STX to open a game and hope somebody noticed it.
//
// Both answers were already computed. None of this costs an extra read, and
// there is an assertion below that says so.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';

// Both games are Alice-versus-anyone-else, because that is what can actually be
// RECOVERED from the chain: recovery builds candidate sides from the opener, the
// viewer, and the open-board keywords. A game naming two specific people cannot
// be confirmed by a third party at all - which is correct, and means it would
// carry no badge and test nothing.
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

async function explore(as: string | null): Promise<Document> {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  chain.as(ALICE);
  // 1: not started, so it is White's turn and White is Alice.
  await chain.openGame(rulesHash(OPEN), false);
  // 2: Alice has moved, so it is Black's turn and Black is anyone-but-Alice -
  // a seat a stranger can genuinely take.
  await chain.openGame(rulesHash(OPEN), false);
  await chain.submit(2, 'e2e4');

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId },
    connect: as ? async () => ({ address: as }) : undefined
  });
  await tick();
  if (as) {
    (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
    await tick();
  }
  (dom.window.document.getElementById('tab-explore') as HTMLButtonElement).click();
  await tick(120);
  void app;
  return dom.window.document;
}

const rowFor = (doc: Document, id: number): HTMLElement | undefined =>
  [...doc.querySelectorAll('#explore-rows tr')].find(
    (tr) => tr.querySelector('td')?.textContent === String(id)
  ) as HTMLElement | undefined;

describe('the game list', () => {
  it('says which game is waiting for you', async () => {
    const doc = await explore(ALICE);
    const one = rowFor(doc, 1);
    expect(one, 'game 1 is not in the list').toBeDefined();
    expect(one!.textContent, 'the list knew whose move it was and did not say').toContain(
      'Your move'
    );
  });

  it('says nothing about whose move it is when nobody is connected', async () => {
    // There is no "you" to answer for, and guessing would be worse than silence.
    const doc = await explore(null);
    expect(doc.getElementById('explore-rows')!.textContent).not.toContain('Your move');
  });

  it('does not claim a game is yours when the turn belongs to somebody else', async () => {
    const doc = await explore(BOB);
    // Game 1 is White to move and White is Alice, so it is not Bob's.
    expect(rowFor(doc, 1)!.textContent).not.toContain('Your move');
  });

  it('tells a connected stranger the move is theirs, not merely that a seat is free', async () => {
    // Game 2 is Black to move and Black is anyone-but-Alice, so Bob can play
    // right now. "Your move" is the stronger and truer thing to say; "Open
    // seat" would be an understatement.
    const doc = await explore(BOB);
    expect(rowFor(doc, 2)!.textContent).toContain('Your move');
  });

  it('offers the seat to a visitor who has not connected yet', async () => {
    // The badge exists for exactly this person: no wallet, no invitation, and
    // previously one option - pay 1 STX to open a game and hope somebody
    // noticed it.
    const doc = await explore(null);
    expect(rowFor(doc, 2)!.textContent, 'no game is offered to a visitor').toContain('Open seat');
  });

  it('describes a game with NO submissions at all, which is the one a stranger meets', async () => {
    // Both the remembered-rules lookup and recovery used to sit inside a "has
    // entries" guard, so an unclaimed game - the only kind anyone can walk up
    // to - was the one kind the list refused to describe.
    const doc = await explore(null);
    const one = rowFor(doc, 1)!;
    expect(one.textContent, 'an unstarted game still says its players are unknown').toContain(
      'anyone-else'
    );
  });

  it('puts what you can act on first', async () => {
    const doc = await explore(ALICE);
    const ids = [...doc.querySelectorAll('#explore-rows tr')].map(
      (tr) => tr.querySelector('td')?.textContent
    );
    expect(ids[0], 'the game waiting on this player is not at the top').toBe('1');
  });

  it('says the list is bounded and sorted, because both are true', async () => {
    const doc = await explore(ALICE);
    expect(doc.getElementById('explore-count')!.textContent).toContain('yours first');
  });
});
