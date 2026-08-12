// Backing out of a promotion.
//
// When a pawn reaches the last rank the board has to ask which piece it becomes,
// because `e7e8` on its own is a submission replay skips. It asked, and then it
// never took the question away again: the panel was shown in one place and
// hidden in exactly one other, inside the per-piece click handler.
//
// Two failures came out of that, and the first one costs money.
//
//   * A player who changed their mind and picked up a different piece left the
//     picker open, still holding the OLD from and to. Choosing Queen then
//     submitted and PAID FOR a move they had abandoned. Clicking the promoting
//     pawn again - the obvious way to put it down - was the same trap.
//   * A poll landing the opponent's move cleared the pending promotion without
//     hiding anything, leaving a panel on screen whose every button silently
//     returned early.
//
// There was no Cancel and no Escape, so backing out meant either clicking a
// piece you did not want or clicking a button that did nothing, with no way to
// tell which one you were getting. Nothing tested this screen at all.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { linkForGame } from '../../packages/protocol/known-rules.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';

// White to move with a pawn on e7 and nothing in its way, so e7e8 is a real
// promotion with all four choices. The white king is on e1 and Black's on h8,
// which keeps every one of them legal.
const PROMOTION_FEN = '7k/4P3/8/8/8/8/8/4K3 w - - 0 1';
const RULES = normaliseRules({
  ...DEFAULT_RULES,
  white: ALICE,
  black: BOB,
  startFen: PROMOTION_FEN
});

const tick = (ms = 30): Promise<void> => new Promise((done) => setTimeout(done, ms));

let dom: JSDOM;

beforeEach(() => resetForTests());

/**
 * A board on a game whose rules start from a promotion.
 *
 * Booted at a SHARED LINK carrying the rules, because a game with a custom start
 * position cannot be recovered from the chain alone - recovery searches named
 * sides and open boards from the standard position, and nothing else. That is
 * the same route a real player with such a game arrives by, and without
 * confirmed rules the board correctly referees nothing and every square stays
 * dead.
 */
async function board(): Promise<{ app: ChessApp; chain: MockChain; doc: Document }> {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  chain.as(ALICE);
  await chain.openGame(rulesHash(RULES), false);

  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: linkForGame('https://example.test/xchess.html', 1, RULES)
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;

  mountShell(dom.window.document);
  const app = new ChessApp({
    chain,
    document: dom.window.document,
    build: { network: 'devnet', contract: chain.contractId },
    connect: async () => ({ address: ALICE })
  });

  // Let the link-driven load finish BEFORE connecting. Every wired click is
  // dropped while the app is busy, and a board opened from a link is busy from
  // the moment it is constructed - so connecting too early silently does
  // nothing and every square stays dead.
  await tick(60);
  (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
  await tick(60);
  return { app, chain, doc: dom.window.document };
}

const square = (doc: Document, name: string): HTMLButtonElement =>
  doc.querySelector(`[data-square="${name}"]`) as HTMLButtonElement;
const picker = (doc: Document): HTMLElement => doc.getElementById('promotion') as HTMLElement;
const open = (doc: Document): boolean => !picker(doc).classList.contains('hide');
const choice = (doc: Document, label: string): HTMLButtonElement | undefined =>
  [...picker(doc).querySelectorAll('button')].find((b) => b.textContent === label) as
    | HTMLButtonElement
    | undefined;

/** Pick up the e7 pawn and choose e8, which opens the picker. */
async function offerPromotion(doc: Document): Promise<void> {
  square(doc, 'e7').click();
  await tick();
  square(doc, 'e8').click();
  await tick();
}

describe('the promotion picker', () => {
  it('opens when a pawn reaches the last rank, and names the move it is about', async () => {
    const { doc } = await board();
    await offerPromotion(doc);

    expect(open(doc), 'the picker did not open on a promoting move').toBe(true);
    // A panel that says which move it is about is a panel you can tell is
    // stale. This one could previously outlive its own move in silence.
    expect(picker(doc).textContent).toContain('e7');
    expect(picker(doc).textContent).toContain('e8');
    for (const piece of ['Queen', 'Rook', 'Bishop', 'Knight']) {
      expect(choice(doc, piece), `no ${piece} to choose`).toBeDefined();
    }
  });

  it('submits the piece that was chosen', async () => {
    const { doc, chain } = await board();
    await offerPromotion(doc);
    choice(doc, 'Knight')!.click();
    await tick(60);

    const entries = await chain.getAllEntries(1);
    expect(entries.map((e) => e.value)).toEqual(['e7e8n']);
    expect(open(doc), 'the picker stayed open after choosing').toBe(false);
  });

  // THE ONE THAT COSTS MONEY. Change your mind, pick up something else, and the
  // picker used to still be holding the abandoned move.
  it('does not fire a stale move after the player picks up another piece', async () => {
    const { doc, chain } = await board();
    await offerPromotion(doc);

    // Change of mind: pick up the king instead.
    square(doc, 'e1').click();
    await tick();

    expect(open(doc), 'the picker survived the player choosing another piece').toBe(false);

    // And if the node were somehow still live, Queen must not submit anything.
    const queen = choice(doc, 'Queen');
    queen?.click();
    await tick(60);
    expect(
      (await chain.getAllEntries(1)).length,
      'a move was submitted, and paid for, that the player had abandoned'
    ).toBe(0);
  });

  it('does not fire a stale move when the pawn is put back down', async () => {
    // Clicking the promoting pawn again is the obvious undo gesture, and it
    // used to leave a live picker behind.
    const { doc, chain } = await board();
    await offerPromotion(doc);

    square(doc, 'e7').click();
    await tick();

    expect(open(doc)).toBe(false);
    choice(doc, 'Queen')?.click();
    await tick(60);
    expect((await chain.getAllEntries(1)).length).toBe(0);
  });

  it('closes rather than going dead when a move lands while it is open', async () => {
    const { doc, app, chain } = await board();
    await offerPromotion(doc);
    expect(open(doc)).toBe(true);

    // Somebody else's submission arrives on the next read.
    chain.as(BOB);
    await chain.submit(1, 'h8g8');
    await app.load(1);
    await tick();

    expect(open(doc), 'the picker stayed on screen with every button dead').toBe(false);
  });

  it('has a Cancel that puts the board back', async () => {
    const { doc, chain } = await board();
    await offerPromotion(doc);

    choice(doc, 'Cancel')!.click();
    await tick();

    expect(open(doc)).toBe(false);
    expect((await chain.getAllEntries(1)).length, 'Cancel submitted something').toBe(0);
    // The board is playable again: the pawn can be picked up a second time.
    await offerPromotion(doc);
    expect(open(doc)).toBe(true);
  });

  it('closes on Escape, and Escape keeps working after other keys', async () => {
    const { doc, chain } = await board();
    await offerPromotion(doc);

    // A stray keystroke first. An `{ once: true }` listener would be consumed
    // by this and Escape would then do nothing.
    doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'a' }));
    await tick();
    expect(open(doc), 'an unrelated key closed the picker').toBe(true);

    doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
    await tick();
    expect(open(doc), 'Escape did not close the picker').toBe(false);
    expect((await chain.getAllEntries(1)).length).toBe(0);
  });

  it('is announced as a group, since it takes the board over', async () => {
    const { doc } = await board();
    await offerPromotion(doc);
    expect(picker(doc).getAttribute('role')).toBe('group');
    expect(picker(doc).getAttribute('aria-label')).toContain('promotion');
  });
});
