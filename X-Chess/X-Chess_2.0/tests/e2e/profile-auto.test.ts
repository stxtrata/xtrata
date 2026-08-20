// A wallet that connects should not have to press two buttons to be recognised.
//
// The Profile tab read nothing on its own. Connecting resolved a BNS name and
// stopped there, so the panel sat empty and the picture canvas said "no
// picture" — for an address whose picture was inscribed and showing beside
// every other name on the board.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';

const XTRATA = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

/** A board whose picture resolver answers, counting what it was asked. */
function board(): { app: ChessApp; asked: { resolve: number; forget: number } } {
  mountShell(dom.window.document);
  const app = new ChessApp({
    chain: new MockChain({ balances: {} }) as never,
    document: dom.window.document,
    connect: async () => ({ address: XTRATA }),
    disconnect: async () => {}
  });
  const asked = { resolve: 0, forget: 0 };
  (app as unknown as { pictures: unknown }).pictures = {
    known: () => ({ image: 2986, manifest: 3026 }),
    async resolve() {
      asked.resolve++;
      return { image: 2986, manifest: 3026 };
    },
    forget() {
      asked.forget++;
    }
  };
  (app as unknown as { players: unknown }).players = {
    peek: () => null,
    async resolve() {
      return null;
    },
    manifestFor: () => null,
    forget() {
      asked.forget++;
    }
  };
  (app as unknown as { address: string }).address = XTRATA;
  return { app, asked };
}

const canvas = (): HTMLElement => dom.window.document.getElementById('pfp-canvas')!;
// OUTSIDE the canvas, which is a fixed 96px box: the caption went in it and was
// crammed into a column beside the image, reading as a rendering fault.
const said = (): string => dom.window.document.getElementById('pfp-said')?.textContent ?? '';

describe('the profile after a wallet connects', () => {
  it('shows the picture the address actually has', async () => {
    const { app } = board();
    await (app as unknown as { loadProfileFromChain(): Promise<void> }).loadProfileFromChain();

    const img = canvas().querySelector('img');
    expect(img, 'the canvas said "no picture" for an inscribed one').not.toBe(null);
    expect(img!.getAttribute('src')).toContain('2986');
    expect(said()).toContain('3026');
  });

  it('says the picture is inscribed rather than merely chosen', () => {
    // The two look identical and mean opposite things. A reader who assumes
    // the wrong one thinks they have finished.
    const { app } = board();
    (app as unknown as { drawPicture(): void }).drawPicture();
    expect(said()).toContain('set by your manifest');
  });

  it('says a local choice is NOT inscribed yet', () => {
    const { app } = board();
    (app as unknown as { pictureChoice: number }).pictureChoice = 3002;
    (app as unknown as { drawPicture(): void }).drawPicture();
    expect(said()).toContain('NOT inscribed yet');
  });

  it('does not forget what it knows when it looks automatically', async () => {
    // Forgetting is for the moment after inscribing, where the remembered
    // answer is the one somebody just paid to change. This runs on every
    // connect and every visit to the tab, and re-reading a wallet's holdings
    // each time is the cost the cache was built to avoid.
    const { app, asked } = board();
    await (app as unknown as { loadProfileFromChain(): Promise<void> }).loadProfileFromChain();
    expect(asked.forget).toBe(0);
    expect(asked.resolve).toBe(1);
  });

  it('drops the answer when the wallet changed while it was reading', async () => {
    const { app } = board();
    const slow = app as unknown as {
      pictures: { resolve(): Promise<unknown> };
      address: string | null;
      loadProfileFromChain(): Promise<void>;
    };
    slow.pictures.resolve = async () => {
      slow.address = null;
      return { image: 2986, manifest: 3026 };
    };
    await slow.loadProfileFromChain();
    // Nothing thrown, and nothing drawn about somebody who is no longer here.
    expect(slow.address).toBe(null);
  });
});
