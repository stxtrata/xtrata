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
import { matchesFilter } from '../../packages/ui/app.js';

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

// ---------------------------------------------------------------------------
// Filtering. Every one of these reads a field the row already carries, so none
// of it touches the chain - which is the point, and is asserted in
// tests/e2e/request-budget.test.ts rather than hoped for here.
// ---------------------------------------------------------------------------

const filters = (doc: Document): HTMLButtonElement[] =>
  [...doc.querySelectorAll('#explore-filters button')] as HTMLButtonElement[];
const filterNamed = (doc: Document, label: string): HTMLButtonElement | undefined =>
  filters(doc).find((b) => b.textContent === label);
const shownIds = (doc: Document): string[] =>
  [...doc.querySelectorAll('#explore-rows tr')].map(
    (tr) => tr.querySelector('td')?.textContent ?? ''
  );

describe('filtering the game list', () => {
  it('offers the filters, and starts on All', async () => {
    const doc = await explore(ALICE);
    expect(filters(doc).length, 'no filters were rendered').toBeGreaterThan(3);
    expect(filterNamed(doc, 'All')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('narrows to the game waiting on you', async () => {
    const doc = await explore(ALICE);
    expect(shownIds(doc).length, 'both games should be listed to start with').toBe(2);

    filterNamed(doc, 'Your move')!.click();
    // Game 1 is White to move and White is Alice. Game 2 is Black's, and Black
    // is anyone-but-Alice.
    expect(shownIds(doc)).toEqual(['1']);
    expect(filterNamed(doc, 'Your move')!.getAttribute('aria-pressed')).toBe('true');
    expect(filterNamed(doc, 'All')!.getAttribute('aria-pressed')).toBe('false');
  });

  it('goes back to everything, and says so again', async () => {
    // Switching back must restore the ordinary count line. Written only under
    // the filter branch, this would leave the narrowed sentence behind and the
    // list would look permanently short.
    const doc = await explore(ALICE);
    filterNamed(doc, 'Your move')!.click();
    expect(doc.getElementById('explore-count')!.textContent).toContain('of 2 shown');

    filterNamed(doc, 'All')!.click();
    expect(shownIds(doc).length).toBe(2);
    expect(doc.getElementById('explore-count')!.textContent).toContain('on this contract');
  });

  it('says a filter is hiding things rather than showing a short list', async () => {
    const doc = await explore(ALICE);
    filterNamed(doc, 'Finished')!.click();
    // Neither game is over.
    expect(shownIds(doc)).toEqual([]);
    expect(
      doc.getElementById('explore-count')!.textContent,
      'an empty list with no explanation reads as the games having gone'
    ).toMatch(/no games match/i);
  });

  it('does not offer a filter about "you" when nobody is connected', async () => {
    // Absent, not empty. There is no you to answer for, and a filter that
    // returned nothing would read as "you have no games" to somebody who simply
    // has not connected a wallet.
    const doc = await explore(null);
    expect(filterNamed(doc, 'Your move'), 'a filter about you with no you').toBeUndefined();
    expect(filterNamed(doc, 'Yours')).toBeUndefined();
    expect(filterNamed(doc, 'Open seat'), 'the filters that need no wallet should stay')
      .toBeDefined();
  });
});

describe('the filter rule itself', () => {
  // Tested directly as a pure function, because every case below is a claim
  // about MEANING - what somebody is asking when they press a button - and
  // those are worth pinning without a DOM in the way.
  const row = (over: Partial<Parameters<typeof matchesFilter>[0]> = {}) =>
    ({
      id: 1,
      ranked: false,
      entries: 0,
      white: null,
      black: null,
      confirmed: true,
      state: 'live',
      mine: null,
      seat: null,
      over: false,
      ...over
    }) as Parameters<typeof matchesFilter>[0];

  it('admits everything under All', () => {
    expect(matchesFilter(row(), 'all')).toBe(true);
    expect(matchesFilter(row({ over: true, ranked: true }), 'all')).toBe(true);
  });

  it('separates "yours" from "your move"', () => {
    // A game you are in but are not holding up is still yours. Conflating the
    // two would make "Yours" useless the moment you had replied.
    expect(matchesFilter(row({ mine: 'waiting' }), 'mine')).toBe(true);
    expect(matchesFilter(row({ mine: 'waiting' }), 'your-move')).toBe(false);
    expect(matchesFilter(row({ mine: 'your-move' }), 'mine')).toBe(true);
    expect(matchesFilter(row({ mine: 'your-move' }), 'your-move')).toBe(true);
  });

  it('treats live and finished as opposites, from the field and not the wording', () => {
    expect(matchesFilter(row({ over: false }), 'live')).toBe(true);
    expect(matchesFilter(row({ over: false }), 'over')).toBe(false);
    expect(matchesFilter(row({ over: true }), 'over')).toBe(true);
    expect(matchesFilter(row({ over: true }), 'live')).toBe(false);
  });

  it('never claims a game is yours when nobody is connected', () => {
    expect(matchesFilter(row({ mine: null }), 'mine')).toBe(false);
    expect(matchesFilter(row({ mine: null }), 'your-move')).toBe(false);
  });
});
