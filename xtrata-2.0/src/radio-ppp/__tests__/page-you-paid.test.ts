// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The new look's You screen: "Who you have paid", a receipt on every confirmed play.
 * This runs the real panel code (page.ts) with the controller faked, against the markup the radio page gives it.
 */
const h = vi.hoisted(() => ({ snap: {} as any, changed: () => {}, returnFunds: null as any, topUp: vi.fn(), topUpAlbum: vi.fn(), openAlbum: vi.fn(), bind: vi.fn(), arriving: vi.fn(), route: null as null | ((url: string, init?: any) => Response | undefined), radio: null as any, session: { isConnected: false } as any, signed: [] as any[] }));
vi.mock('../controller', () => ({
  TOP_UP_PLAYS: [100, 250, 500], ARRIVAL_GRACE_MS: 60_000, OUT_OF_LIKES: 'Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.',
  createPppController: (deps: any) => {
    h.changed = deps.changed; (h as any).deps = deps;
    return new Proxy({ snapshot: () => h.snap, refresh: async () => {}, returnFunds: (m: string) => h.returnFunds(m), topUpLikes: () => h.topUp(), topUpAlbum: (a: bigint) => h.topUpAlbum(a), openAlbum: (n: number) => h.openAlbum(n), bindAlbum: (n: number) => h.bind(n), albumArriving: (...a: unknown[]) => h.arriving(...a), onListened: async () => {}, giftSent: () => {} }, {
      get: (t: any, k) => t[k] ?? (async () => {})
    });
  }
}));
vi.mock('../../lib/wallet/passkey/bridge/client', () => ({ WalletBridgeClient: class {} }));
vi.mock('../../lib/wallet/session', () => ({ createWalletSessionStore: () => ({ load: () => h.session }) }));
vi.mock('../../lib/wallet/structured-sign', () => ({ requestStructuredSignature: async (d: any) => { h.signed.push(d); return 'ab'.repeat(65); } }));
vi.mock('../../lib/wallet/connect', () => ({ showStxTransfer: vi.fn() }));
vi.mock('../../radio-test-wallet/chain', () => ({ account: vi.fn(), api: vi.fn(), balance: vi.fn(), broadcast: vi.fn(), owner: vi.fn(), transaction: vi.fn(), validateSaved: vi.fn(), verify: vi.fn() }));
vi.mock('../../lib/wallet/installed', () => ({ hasInstalledStacksWallet: () => false }));
vi.mock('../../lib/bns/primary', () => ({ resolvePrimaryBnsName: async () => null }));

const PLAYER = { id: '0123456789abcdef', title: 'Proof of Sound', subtitle: 'Someone', tracks: [{ id: 11, title: 'One', artist: 'X' }, { id: 12, title: 'Two', artist: 'X' }], cover: null, paidOnly: true };
const base = {
  step: 'ready', busy: null, message: '', error: '', main: undefined, listening: 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV', linked: undefined, balance: 100_000n,
  balanceState: 'ok', playsLeft: 277, allowance: 900_000n, session: { playsLeft: 277, plays: 0, spent: 0n, budgetLeft: 900_000n, expires: 0 }, payingOn: true, entries: [],
  depositPending: false, walletOutdated: false, linkedListening: [], serverLinked: false, armed: false, stuck: 0, queued: 0, solo: true, returnTo: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', returnToKind: 'funder',
  funderState: 'found', funderMultiple: false, walletCannotSolo: false, walletCannotMulti: false, others: [], createdHere: true,
  gate: { enabled: true, allowed: false, here: true, radioUrl: null, walletOrigin: 'https://w.test', canary: false, passkeyOnly: true, limits: { playFee: '300', returnFee: '3000', maxSessionPlays: 3000, sessionHours: 168 }, gifts: { enabled: true, treasury: null, turnstileSiteKey: null, admin: false, fee: '3000' } },
  gift: { player: PLAYER, from: null, source: 'campaign', amount: '100000' }, giftPlays: 277, playCost: 350n, giftStop: null, returnPlan: { state: 'none' }
};

async function open(over: object = {}, skin = true, view = '') {
  vi.resetModules();
  const root = document.documentElement;
  for (const a of ['data-skin', 'data-view']) root.removeAttribute(a);
  if (skin) root.setAttribute('data-skin', '1');
  if (view) root.setAttribute('data-view', view);
  document.body.innerHTML = `<section id="ppp" hidden><div class="ppp-head"><h3><span class="ppp-badge"></span></h3><span class="ppp-state"></span></div><ol class="ppp-steps"></ol><p class="ppp-stage"></p>
    <div class="ppp-switch" hidden></div><div class="ppp-key"></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p><div class="ppp-paid" hidden></div>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-shelf" hidden><summary></summary><div class="ppp-shelf-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details><details class="ppp-fold ppp-release" hidden><summary></summary><div class="ppp-release-body"></div></details></section>`;
  document.body.insertAdjacentHTML('beforeend', '<section id="shelfBox"></section><details id="findBox"><div id="findBody"></div></details>');
  // The radio's own hooks (public/radio.html): the ON AIR lamp and the note under the receiver.
  document.body.insertAdjacentHTML('beforeend', '<div id="onair" hidden><b>ON AIR</b><span class="onair-sub"></span></div><div class="nudge" id="pppNudge" hidden><span class="nudge-txt"><b class="nudge-t"></b><span class="nudge-s"></span></span><button type="button">Start</button></div>');
  h.radio = { setGiftPlayer: vi.fn(), setGiftStop: vi.fn(), setSample: vi.fn(), setGiftWait: vi.fn(), subscribe: vi.fn(), refreshLikes: vi.fn() };
  (window as any).XtrataRadio = h.radio;
  h.snap = { ...base, ...over };
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: any) => h.route?.(String(url), init) ?? new Response(String(url).endsWith('/radio/gift/player') ? JSON.stringify({ id: 'fedcba9876543210', title: 'Proof of Sound', tracks: 2, existing: false }) : '{}')));
  await import('../page');
  h.changed();
  return document.getElementById('ppp')!;
}
const text = (root: Element) => root.textContent ?? '';
beforeEach(() => { vi.unstubAllGlobals(); delete (window as any).XtrataRadio; h.session = { isConnected: false }; h.signed = []; });


const TX = (n: number) => '0x' + String(n).padStart(64, '0');
const play = (n: number, over: object = {}) => ({ id: 'p' + n, kind: 'play', song: 300 + n, status: 'confirmed', created: Date.now() - n * 60_000, amount: '50', recipient: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', txid: TX(n), ...over });
const route = () => { h.route = (url) => (url.includes('/radio/counts') ? new Response(JSON.stringify({ tracks: Array.from({ length: 12 }, (_, i) => ({ id: 300 + i, title: 'Song ' + i, artist: i % 2 ? 'Bo' : 'Ada' })) })) : undefined); };
const start = async (entries: unknown[], skin = true, view = '') => { localStorage.clear(); route(); return open({ step: 'ready', entries }, skin, view); };
const box = () => document.querySelector('.ppp-paid') as HTMLElement;
const rows = () => [...box().querySelectorAll('.ppp-paid__row')];

describe('You: who you have paid', () => {
  it('lists recent plays, newest first, with the song, the artist, when, and a Receipt link to the public record', async () => {
    await start([play(1), play(2), play(3)]);
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    expect(box().hidden).toBe(false);
    expect(box().querySelector('h4')!.textContent).toBe('Who you have paid');
    await vi.waitFor(() => expect(rows()[0].querySelector('b')!.textContent).toBe('Song 1')); // names come from the catalogue
    expect(rows()[0].querySelector('.ppp-paid__t span')!.textContent).toBe('Bo · 1 min ago');
    expect(rows().map((r) => r.querySelector('b')!.textContent)).toEqual(['Song 1', 'Song 2', 'Song 3']);
    const receipt = rows()[1].querySelector('a.ppp-paid__r') as HTMLAnchorElement;
    expect(receipt.textContent).toBe('Receipt');
    expect(receipt.getAttribute('aria-label')).toBe('Receipt for Song 2');
    expect(receipt.href).toBe(`https://explorer.hiro.so/txid/${TX(2)}?chain=mainnet`);
    expect(receipt.target).toBe('_blank');
    expect(receipt.rel).toContain('noopener');
  });

  it('a play still being confirmed says so, with no receipt yet; a failed play is not listed', async () => {
    await start([play(1, { status: 'pending' }), play(2, { status: 'failed' }), play(3, { status: 'unknown' }), play(4)]);
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    expect(rows().map((r) => r.querySelector('.ppp-paid__r')!.textContent)).toEqual(['Paying…', 'Checking…', 'Receipt']);
    expect(rows().filter((r) => r.querySelector('a')).length).toBe(1);
  });

  it('shows six, then more on request, never more than twenty', async () => {
    await start(Array.from({ length: 30 }, (_, i) => play(i + 1)));
    await vi.waitFor(() => expect(rows()).toHaveLength(6));
    const more = box().querySelector('.ppp-paid__more') as HTMLButtonElement;
    expect(more.textContent).toBe('Show more (14)');
    more.click();
    expect(rows()).toHaveLength(20);
    expect((box().querySelector('.ppp-paid__more') as HTMLButtonElement).textContent).toBe('Show fewer');
    (box().querySelector('.ppp-paid__more') as HTMLButtonElement).click();
    expect(rows()).toHaveLength(6);
  });

  it('speaks to a newcomer: no wallet, STX or chain words, and no amounts', async () => {
    await start([play(1), play(2)]);
    await vi.waitFor(() => expect(rows()).toHaveLength(2));
    expect(box().textContent).not.toMatch(/stx|wallet|passkey|on-chain|blockchain|crypto|nft|stacks|inscription|\d+ ?µ/i);
    expect(box().textContent).toContain('Every play pays the artist, and anyone can check it.');
  });

  it('is hidden with no plays yet, in the classic look and on the album page', async () => {
    await start([]);
    expect(box().hidden).toBe(true);
    await start([play(1)], false);
    expect(box().hidden).toBe(true);
    expect(box().children.length).toBe(0);
    await start([play(1)], true, 'album');
    expect(box().hidden).toBe(true);
  });

  it('does not list likes or returns', async () => {
    await start([{ id: 'l1', kind: 'like', song: 301, status: 'confirmed', created: Date.now(), amount: '0', recipient: '', liked: true, txid: TX(9) }, { id: 'r1', kind: 'return', song: 0, status: 'confirmed', created: Date.now(), amount: '5000', recipient: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', txid: TX(8) }]);
    expect(box().hidden).toBe(true);
  });
});
