// A face beside a name, and the three ways decoration could cost more than
// it is worth.
//
// The plan for this said the risk is not the picture but the lookup around it:
// it is easy to make a list noticeably slower in exchange for a twenty-two
// pixel square. So what these hold is the cost, not the pixels.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

function board(): ChessApp {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  mountShell(dom.window.document);
  return new ChessApp({
    chain: chain as never,
    document: dom.window.document,
    connect: async () => ({ address: ALICE }),
    disconnect: async () => {}
  });
}

/** A resolver that has already answered, so `faceFor` never starts a lookup. */
function withPictures(app: ChessApp, known: Record<string, number | null>): void {
  (app as unknown as { pictures: unknown }).pictures = {
    known: (address: string) => {
      const image = known[String(address).toUpperCase()];
      return image ? { image, manifest: 9000 } : null;
    },
    resolveAll: async () => false
  };
}

const face = (app: ChessApp, who: string): HTMLElement | null =>
  (app as unknown as { faceFor(a: string): HTMLElement | null }).faceFor(who);

describe('a face beside a name', () => {
  it('points at the inscription and never holds the bytes', () => {
    // The whole cost argument. A picture may be 443 KB and this square is
    // twenty-two pixels; pulling it through the board's request budget to
    // shrink it would spend the allowance the wallet needs on decoration.
    const app = board();
    withPictures(app, { [ALICE]: 3002 });

    const img = face(app, ALICE) as HTMLImageElement;
    expect(img).not.toBe(null);
    expect(img.tagName).toBe('IMG');
    expect(img.getAttribute('src')).toContain('3002');
    expect(img.loading, 'off-screen rows must not decode').toBe('lazy');
  });

  it('shows nothing for somebody who has not chosen one', () => {
    const app = board();
    withPictures(app, { [ALICE]: 3002 });
    expect(face(app, BOB)).toBe(null);
  });

  it('never starts a lookup of its own', async () => {
    // `faceFor` runs inside every row build. If it could resolve, a list would
    // fire one lookup per row and the paging would multiply it.
    const app = board();
    let asked = 0;
    (app as unknown as { pictures: unknown }).pictures = {
      known: () => undefined,
      resolveAll: async () => {
        asked++;
        return false;
      },
      resolve: async () => {
        asked++;
        return null;
      }
    };
    expect(face(app, ALICE)).toBe(null);
    expect(asked, 'drawing a row must not ask the chain anything').toBe(0);
  });

  it('is marked decorative, because the name is right beside it', () => {
    const app = board();
    withPictures(app, { [ALICE]: 3002 });
    const img = face(app, ALICE)!;
    expect(img.getAttribute('aria-hidden')).toBe('true');
    expect(img.getAttribute('alt')).toBe('');
  });

  it('says which inscription it is and which manifest chose it', () => {
    // A picture is a claim like any other here, and the reader can check it.
    const app = board();
    withPictures(app, { [ALICE]: 3002 });
    expect(face(app, ALICE)!.title).toContain('3002');
    expect(face(app, ALICE)!.title).toContain('9000');
  });
});
