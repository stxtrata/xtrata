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
import { DEFAULT_RULES, normaliseRules, readyToOpen } from '../../packages/protocol/rules.js';
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
      participant: false,
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
    expect(matchesFilter(row({ participant: true, mine: 'waiting' }), 'mine')).toBe(true);
    expect(matchesFilter(row({ participant: true, mine: 'waiting' }), 'your-move')).toBe(false);
    expect(matchesFilter(row({ participant: true, mine: 'your-move' }), 'mine')).toBe(true);
    expect(matchesFilter(row({ participant: true, mine: 'your-move' }), 'your-move')).toBe(true);
  });

  it('keeps a game you finished, which has no turn left to hold', () => {
    // `mine` is null for a game that is over - there is nobody to be waiting
    // for. Reading "Yours" off it therefore dropped every game you had played
    // to a result, which is the half of somebody's history they are proudest
    // of.
    expect(matchesFilter(row({ participant: true, mine: null, over: true }), 'mine')).toBe(true);
  });

  it('does not hand you a game merely because its rules would admit you', () => {
    // An open board admits anybody. If that counted as ownership, every viewer
    // would find every unclaimed game under "Yours" and the filter would mean
    // nothing at all.
    expect(matchesFilter(row({ participant: false, seat: 'open' }), 'mine')).toBe(false);
  });

  it('treats live and finished as opposites, from the field and not the wording', () => {
    expect(matchesFilter(row({ over: false }), 'live')).toBe(true);
    expect(matchesFilter(row({ over: false }), 'over')).toBe(false);
    expect(matchesFilter(row({ over: true }), 'over')).toBe(true);
    expect(matchesFilter(row({ over: true }), 'live')).toBe(false);
  });

  it('never claims a game is yours when nobody is connected', () => {
    expect(matchesFilter(row({ participant: false, mine: null }), 'mine')).toBe(false);
    expect(matchesFilter(row({ participant: false, mine: null }), 'your-move')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Search. The one part of the game list that can spend a chain read, so it
// spends exactly one, and never walks.
// ---------------------------------------------------------------------------

const search = (doc: Document, text: string): void => {
  (doc.getElementById('explore-search') as HTMLInputElement).value = text;
  (doc.getElementById('explore-find') as HTMLButtonElement).click();
};
const found = (doc: Document): string => doc.getElementById('explore-found')!.textContent ?? '';

describe('finding a game by number', () => {
  it('says a game already on screen is already on screen, and reads nothing', async () => {
    const doc = await explore(ALICE);
    search(doc, '2');
    await tick(60);
    expect(found(doc)).toContain('in the list below');
    expect(shownIds(doc), 'the list was replaced instead of pointed at').toContain('2');
  });

  it('says plainly when there is no such game', async () => {
    const doc = await explore(ALICE);
    search(doc, '99');
    await tick(80);
    expect(found(doc)).toMatch(/no game 99/i);
  });

  it('refuses to pretend it can search by player', async () => {
    // The chain has no index of who has played what. Answering "no results" to
    // a name would be a lie about the player rather than about the search.
    const doc = await explore(ALICE);
    search(doc, 'alice.btc');
    await tick(60);
    expect(found(doc)).toMatch(/game number/i);
    expect(found(doc)).toMatch(/not possible/i);
  });

  it('puts the list back when the box is cleared', async () => {
    const doc = await explore(ALICE);
    search(doc, '99');
    await tick(80);
    search(doc, '');
    await tick(60);
    expect(found(doc)).toBe('');
    expect(shownIds(doc).length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Connecting while the list is already on screen.
//
// Reported 2026-08-13: "I have many live games for xtrata.btc but when I go to
// the Yours tab it lists none of them."
//
// Every answer this list gives about ownership depends on who is asking, so a
// list built before connecting was built for NOBODY - every row carries
// `mine: null`, and the games the viewer is actually in are advertised to them
// as an open seat.
//
// Connecting marked the list stale, which is enough for somebody who then
// switches tabs, and does nothing at all for somebody already looking at it.
// Redrawing the filters is not the same as rebuilding the rows: the Yours button
// appears, correctly, and then matches nothing.
// ---------------------------------------------------------------------------

async function exploreThenConnect(as: string): Promise<Document> {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  chain.as(ALICE);
  await chain.openGame(rulesHash(OPEN), false);
  await chain.openGame(rulesHash(OPEN), false);
  await chain.submit(2, 'e2e4');

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId },
    connect: async () => ({ address: as })
  });
  await tick();

  // Look FIRST, connect second. That is the order the report came from.
  (dom.window.document.getElementById('tab-explore') as HTMLButtonElement).click();
  await tick(120);
  (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
  await tick(150);
  void app;
  return dom.window.document;
}

describe('connecting with the game list already open', () => {
  it('finds the games you are in', async () => {
    const doc = await exploreThenConnect(ALICE);
    const yours = filterNamed(doc, 'Yours');
    expect(yours, 'the Yours filter was never offered').toBeDefined();

    yours!.click();
    // Game 1 is Alice's move. Game 2 she has already moved in and is waiting.
    // Both are hers, and neither depends on it being her turn.
    expect(shownIds(doc), 'connecting did not rebuild the list').toEqual(['1', '2']);
  });

  it('stops offering your own game as an open seat', async () => {
    // The same stale row, seen from the other side: with nobody connected the
    // seat badge is right, and the moment somebody connects who is IN that game
    // it is a lie told to the one person it cannot be true for.
    const doc = await exploreThenConnect(ALICE);
    expect(rowFor(doc, 2)!.textContent).not.toContain('Open seat');
  });

  it('answers for nobody again on disconnect', async () => {
    const doc = await exploreThenConnect(ALICE);
    (doc.getElementById('disconnect') as HTMLButtonElement).click();
    await tick(150);
    expect(doc.getElementById('explore-rows')!.textContent).not.toContain('Your move');
    expect(filterNamed(doc, 'Yours'), 'a filter that cannot work is still offered').toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// The BNS name is not the identity, and must never become it.
//
// Suspected 2026-08-13, on good evidence: the list says "xtrata.btc v
// anyone-else", so it looks as though the row is matched by NAME and the name
// simply is not being tied back to the connected address.
//
// It is not. `readyToOpen` refuses to open a game while a side is a `.btc` name
// (`packages/protocol/rules.ts:249`) — a name has to become an address before it
// is hashed, because replay compares principals and a sealed board has no
// network to look anything up with. So the rules hold an ADDRESS, and the name
// on screen is a reverse lookup done for display only.
//
// That is worth an assertion rather than an explanation, because the day a name
// does reach the rules is the day this becomes true, and it would present
// exactly like the bug it was mistaken for.
// ---------------------------------------------------------------------------

describe('a name on screen and an address in the rules', () => {
  it('refuses to open a game whose player is still a name', () => {
    const named = normaliseRules({ ...DEFAULT_RULES, white: 'xtrata.btc', black: BOB });
    const check = readyToOpen(named);
    expect(check.ready, 'a .btc name reached the rules hash').toBe(false);
    // Reported in whatever case normalisation left it in - `side()` upper-cases
    // anything that is not one of the keywords, and BNS lookup lowercases again
    // before asking. The case is not the assertion; being reported is.
    expect(
      check.unresolved.map((name) => name.toLowerCase()),
      'the name was not reported as needing a lookup'
    ).toContain('xtrata.btc');
  });

  it('matches a game by address even when the row displays a name', async () => {
    // The row is built from ALICE's address; whether a resolver later relabels
    // it "xtrata.btc" is presentation and cannot change who is in the game.
    const doc = await exploreThenConnect(ALICE);
    filterNamed(doc, 'Yours')!.click();
    expect(shownIds(doc)).toEqual(['1', '2']);
  });

  it('keeps the two apart in the rules themselves', () => {
    // Upper-cased as a principal, and a name is left alone to fail loudly
    // rather than be silently corrected into something unplayable.
    expect(normaliseRules({ ...DEFAULT_RULES, white: ALICE.toLowerCase() }).white).toBe(ALICE);
    expect(normaliseRules({ ...DEFAULT_RULES, white: 'xtrata.btc' }).white).toBe('XTRATA.BTC');
  });
});

// ---------------------------------------------------------------------------
// Sponsored.
//
// Asked for 2026-08-13: a filter for games somebody is paying the moves for.
//
// It is the ONE filter whose answer is not already on the row, and it cannot be:
// `get-sponsorship` takes `(game uint, who principal)`, so it answers about one
// player you can already name. There is no function listing a game's
// sponsorships and no event index to walk. That has two consequences, and both
// are asserted here rather than described in a comment nobody reads:
//
//   * it costs chain reads, so it is spent by the person who asks for it and
//     never on building the list;
//   * a game open to "anyone" names nobody to ask about, so it is UNKNOWN and
//     must be reported as unknown rather than counted as unsponsored.
// ---------------------------------------------------------------------------

async function exploreSponsored(): Promise<{ doc: Document; asked: string[] }> {
  const chain = new MockChain({ balances: { [ALICE]: 1_000_000_000n, [BOB]: 1_000_000_000n } });
  chain.as(ALICE);
  // Alice-versus-anyone-else throughout, because that is the only shape a third
  // party can RECOVER - and an unrecovered game names nobody, so there would be
  // nobody to ask about and the test would pass for the wrong reason.
  //
  // 1: Alice's moves are paid for.
  await chain.openSponsoredBoth(rulesHash(OPEN), false, ALICE, BOB);
  // 2: same rules, nobody paying.
  await chain.openGame(rulesHash(OPEN), false);
  // 3: open to anyone, so there is no principal to ask about at all.
  await chain.openGame(rulesHash(normaliseRules({ ...DEFAULT_RULES })), false);

  // Counted the way the request-budget suite counts, because the assertion that
  // matters here is a number of reads and not a rendering.
  const asked: string[] = [];
  const original = chain.getSponsorship.bind(chain);
  (chain as unknown as Record<string, unknown>).getSponsorship = (game: number, who: string) => {
    asked.push(`${game}|${who}`);
    return original(game, who);
  };

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId },
    connect: async () => ({ address: ALICE })
  });
  await tick();
  (dom.window.document.getElementById('tab-explore') as HTMLButtonElement).click();
  await tick(150);
  void app;
  return { doc: dom.window.document, asked };
}

describe('the sponsored filter', () => {
  it('is offered without a wallet, because it is not about you', async () => {
    const doc = await explore(null);
    expect(filterNamed(doc, 'Sponsored'), 'the filter is missing').toBeDefined();
  });

  it('costs nothing until somebody presses it', async () => {
    const { doc, asked } = await exploreSponsored();
    filterNamed(doc, 'Live')!.click();
    filterNamed(doc, 'Ranked')!.click();
    filterNamed(doc, 'All')!.click();
    await tick(80);
    expect(asked, 'an ordinary filter spent a chain read').toEqual([]);
  });

  it('finds the game whose moves are being paid for', async () => {
    const { doc } = await exploreSponsored();
    filterNamed(doc, 'Sponsored')!.click();
    await tick(200);
    expect(shownIds(doc)).toEqual(['1']);
  });

  it('says what it could not ask, rather than calling it unsponsored', async () => {
    // Game 3 is open to anyone. There is no principal to ask about, so the only
    // honest answer is that it was not asked.
    const { doc } = await exploreSponsored();
    filterNamed(doc, 'Sponsored')!.click();
    await tick(200);
    expect(doc.getElementById('explore-count')!.textContent).toContain('could not be asked');
  });

  it('asks once, however many times it is pressed', async () => {
    const { doc, asked } = await exploreSponsored();
    filterNamed(doc, 'Sponsored')!.click();
    await tick(200);
    const spent = asked.length;
    expect(spent, 'it never asked the chain at all').toBeGreaterThan(0);

    filterNamed(doc, 'All')!.click();
    filterNamed(doc, 'Sponsored')!.click();
    await tick(200);
    expect(asked.length, 'it asked the same question twice').toBe(spent);
  });

  it('asks only about the sides a game actually names', async () => {
    const { doc, asked } = await exploreSponsored();
    filterNamed(doc, 'Sponsored')!.click();
    await tick(200);
    // Games 1 and 2 name one principal each and a keyword. Game 3 names nobody,
    // so it is never asked about - which is the bound, and the reason the cost
    // is predictable.
    expect(asked.length, `asked: ${asked.join(', ')}`).toBeLessThanOrEqual(2);
    expect(asked.some((entry) => entry.startsWith('3|')), 'it asked about an open board').toBe(
      false
    );
  });
});

// ---------------------------------------------------------------------------
// A finished game should not read like a live one.
//
// "1-0 checkmate" sat in the same weight and colour as "white to move", so a
// game that had been over for days looked like one waiting for somebody. Three
// signals rather than one, because any single one can be missed: the score as a
// badge, the winner BY NAME, and the row itself marked.
// ---------------------------------------------------------------------------

async function exploreFinished(): Promise<Document> {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  chain.as(ALICE);
  await chain.openGame(rulesHash(OPEN), false);
  // Fool's mate, so the game is genuinely over by replay and not by assertion.
  const mate: [string, string][] = [
    ['f2f3', ALICE],
    ['e7e5', BOB],
    ['g2g4', ALICE],
    ['d8h4', BOB]
  ];
  for (const [move, who] of mate) {
    chain.as(who);
    await chain.submit(1, move);
  }

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId }
  });
  await tick();
  (dom.window.document.getElementById('tab-explore') as HTMLButtonElement).click();
  await tick(150);
  void app;
  return dom.window.document;
}

describe('a game that is over', () => {
  it('shows the score as a badge rather than as a sentence', async () => {
    const doc = await exploreFinished();
    const badge = rowFor(doc, 1)!.querySelector('.badge--over');
    expect(badge, 'a finished game has no result badge').not.toBeNull();
    expect(badge!.textContent, 'black won, so the score reads from white').toBe('0–1');
  });

  it('says who won, in the name the reader knows', async () => {
    // "0-1 checkmate" is notation. A person wants to know who won.
    const doc = await exploreFinished();
    const row = rowFor(doc, 1)!;
    expect(row.textContent).toContain('won by checkmate');
  });

  it('marks the row itself, so it is obvious without reading the words', async () => {
    const doc = await exploreFinished();
    expect(rowFor(doc, 1)!.classList.contains('over')).toBe(true);
  });

  it('offers to review it rather than to open it', async () => {
    // Open promises something to do. There is nothing to do here.
    const doc = await exploreFinished();
    const button = rowFor(doc, 1)!.querySelector('button');
    expect(button!.textContent).toBe('Review');
  });

  it('leaves a live game exactly as it was', async () => {
    const doc = await explore(null);
    const row = rowFor(doc, 2)!;
    expect(row.classList.contains('over')).toBe(false);
    expect(row.querySelector('.badge--over')).toBeNull();
    expect(row.querySelector('button')!.textContent).toBe('Open');
  });
});
