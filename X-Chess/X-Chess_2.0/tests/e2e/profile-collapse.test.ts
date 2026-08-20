// A finished profile should not sit on top of the form that made it.
//
// The tab is an address box, a picture picker and a manifest builder, and all
// three are steps somebody has already completed once their picture and name
// are on chain. Left up, the profile card reads as a heading above a form —
// which is what it looked like: name, face and about line, then two full
// sections asking for a picture and a name that were already there.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';

const WHO = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

let dom: JSDOM;

beforeEach(() => {
  resetForTests();
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
});

/** A board holding whichever of the two things the test is about. */
function board({ picture, name }: { picture: boolean; name: boolean }): ChessApp {
  mountShell(dom.window.document);
  const app = new ChessApp({
    chain: new MockChain({ balances: {} }) as never,
    document: dom.window.document,
    connect: async () => ({ address: WHO }),
    disconnect: async () => {}
  });
  (app as unknown as { pictures: unknown }).pictures = {
    known: () => (picture ? { image: 2986, manifest: 3026 } : null),
    async resolve() {
      return picture ? { image: 2986, manifest: 3026 } : null;
    },
    manifestFor: () => (picture ? 3026 : null),
    forget() {}
  };
  (app as unknown as { players: unknown }).players = {
    peek: () => (name ? { name: 'xtrata.btc' } : null),
    async resolve() {
      return name ? { name: 'xtrata.btc', about: 'Puts permanent things on Stacks.' } : null;
    },
    aboutFor: () => (name ? 'Puts permanent things on Stacks.' : null),
    manifestFor: () => (name ? 3027 : null),
    forget() {}
  };
  (app as unknown as { address: string }).address = WHO;
  return app;
}

const id = (name: string): HTMLElement => dom.window.document.getElementById(name)!;
const hidden = (name: string): boolean => id(name).classList.contains('hide');
const check = (app: ChessApp): Promise<void> =>
  (app as unknown as { checkOnChain(): Promise<void> }).checkOnChain();

describe('a profile that has been found', () => {
  it('collapses the tooling that made it', async () => {
    const app = board({ picture: true, name: true });
    expect(hidden('profile-tools'), 'nothing is hidden before it is read').toBe(false);

    await check(app);
    expect(hidden('profile-tools'), 'the form is still the page').toBe(true);
    expect(hidden('profile-edit-row'), 'and nothing brings it back').toBe(false);
  });

  it('leaves the picker up when there is no picture yet', async () => {
    // The half-finished case is the one that NEEDS the form. Collapsing on a
    // name alone would hide the picture picker from the person who still has
    // to use it.
    const app = board({ picture: false, name: true });
    await check(app);
    expect(hidden('profile-tools')).toBe(false);
    expect(hidden('profile-edit-row')).toBe(true);
  });

  it('leaves it up when there is no name yet', async () => {
    const app = board({ picture: true, name: false });
    await check(app);
    expect(hidden('profile-tools')).toBe(false);
    expect(hidden('profile-edit-row')).toBe(true);
  });

  it('brings the tooling back when asked', async () => {
    // Changing a picture and looking at another address are things people do.
    const app = board({ picture: true, name: true });
    await check(app);
    expect(hidden('profile-tools')).toBe(true);

    id('profile-edit').dispatchEvent(new dom.window.Event('click'));
    expect(hidden('profile-tools'), 'Edit profile did nothing').toBe(false);
    expect(hidden('profile-edit-row'), 'and the button that opened it is still there').toBe(true);
  });

  it('still shows the card it collapsed around', async () => {
    // The collapse must not take the profile with it.
    const app = board({ picture: true, name: true });
    await check(app);
    const rows = id('onchain-rows');
    expect(rows.querySelector('.pcard'), 'no card').toBeTruthy();
    expect(rows.querySelector('.pcard__from'), 'no provenance row').toBeTruthy();
  });
});
