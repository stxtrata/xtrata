// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The new look's Browse: "My albums" is a tab of Browse, an album picked there opens and the page goes to Listen.
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
    <div class="ppp-switch" hidden></div><div class="ppp-key"></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-shelf" hidden><summary></summary><div class="ppp-shelf-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details><details class="ppp-fold ppp-release" hidden><summary></summary><div class="ppp-release-body"></div></details></section>`;
  document.body.insertAdjacentHTML('beforeend', '<button id="ppp-top" hidden></button><button class="who" id="playerId" type="button" hidden><span class="who-t"></span></button>');
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

const ROOT = 'SP3X2F7FQH7GQS0YRBWH0H5W6RM2PB1B0WPD1XA2V';
const mk = (slot: number, title: string) => ({ slot, address: 'SPALBUM' + slot, state: 'arrived', amount: '100000', label: '', from: null, source: 'campaign', player: { ...PLAYER, id: String(slot).padStart(16, '0'), title, subtitle: 'Ada' } });
const shelf = [mk(1, 'Proof of Sound'), mk(2, 'Night Drive'), mk(3, 'Zero Hour')];
const own = { step: 'ready', root: ROOT, slot: 0, walletCannotAlbums: false, gift: null, giftStop: null, giftPlays: 0, albumLock: null, error: '' };
const route = () => { h.route = (url) => (url.includes('/radio/gift/shelf') ? new Response(JSON.stringify({ total: 3, next: null, shelf })) : url.includes('/radio/counts') ? new Response(JSON.stringify({ tracks: [{ id: 11, title: 'One', artist: 'X' }] })) : undefined); };
const heard = () => {
  const seen: { type: string; detail?: any }[] = [];
  for (const type of ['xtrata:radio-albums', 'xtrata:radio-listen', 'xtrata:radio-panel', 'xtrata:radio-browse']) window.addEventListener(type, (e) => seen.push({ type, detail: (e as CustomEvent).detail }));
  return seen;
};
const start = async (over: object = {}, skin = true, view = '') => {
  localStorage.clear(); h.openAlbum.mockReset(); route();
  const seen = heard();
  await open({ ...own, ...over }, skin, view);
  return seen;
};
const rows = () => [...document.querySelectorAll('#shelfBox .ppp-shelf-list li')];

describe('Browse: My albums', () => {
  it('draws the albums in the Browse tab, not in the panel, and tells the page there are albums', async () => {
    const seen = await start();
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    expect(document.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(true);
    expect(document.querySelector('.ppp-shelf-body')!.children.length).toBe(0);
    // First "none yet" (the list is still loading), then "has albums"; after that it stays quiet on every redraw.
    expect(seen.filter((e) => e.type === 'xtrata:radio-albums').map((e) => e.detail.has)).toEqual([false, true]);
    h.changed(); h.changed();
    expect(seen.filter((e) => e.type === 'xtrata:radio-albums')).toHaveLength(2);
  });

  it('tapping an album opens it and goes to Listen', async () => {
    const seen = await start();
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    h.openAlbum.mockImplementation(async (n: number) => { h.snap = { ...h.snap, slot: n }; });
    (rows().find((r) => r.textContent!.includes('Night Drive'))!.querySelector('button.ppp-pick') as HTMLButtonElement).click();
    await vi.waitFor(() => expect(seen.some((e) => e.type === 'xtrata:radio-listen')).toBe(true));
    expect(h.openAlbum).toHaveBeenCalledWith(2);
    expect(seen.some((e) => e.type === 'xtrata:radio-panel')).toBe(false);
  });

  it('if the album could not be opened (the player is locked), it goes to You, where the reason and the unlock are', async () => {
    const seen = await start();
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    h.openAlbum.mockImplementation(async () => { h.snap = { ...h.snap, error: 'Unlock the listening wallet first.' }; });
    (rows()[0].querySelector('button.ppp-pick') as HTMLButtonElement).click();
    await vi.waitFor(() => expect(seen.some((e) => e.type === 'xtrata:radio-panel')).toBe(true));
    expect(seen.some((e) => e.type === 'xtrata:radio-listen')).toBe(false);
  });

  it('"My player" at the top goes back to the listener\'s own player, then to Listen', async () => {
    const seen = await start({ slot: 2 });
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    h.openAlbum.mockImplementation(async (n: number) => { h.snap = { ...h.snap, slot: n }; });
    const back = [...document.querySelectorAll('#shelfBox button')].find((b) => /My player/.test(b.textContent ?? ''))! as HTMLButtonElement;
    back.click();
    await vi.waitFor(() => expect(seen.some((e) => e.type === 'xtrata:radio-listen')).toBe(true));
    expect(h.openAlbum).toHaveBeenCalledWith(0);
  });

  it('every album can be opened by touch and by screen reader: the whole card is one named button', async () => {
    await start({ slot: 2 });
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    expect(rows().map((r) => r.querySelector('button.ppp-pick')!.getAttribute('aria-label'))).toEqual(['Open Zero Hour', 'Night Drive, playing now', 'Open Proof of Sound']);
  });

  it('with an album open, the Search tab says so and offers the way back', async () => {
    await start({ slot: 2, albumLock: { locked: true } });
    const find = document.getElementById('findBox') as HTMLDetailsElement;
    find.open = true; find.dispatchEvent(new Event('toggle'));
    const back = await vi.waitFor(() => { const b = document.querySelector('#findBody .find-back') as HTMLButtonElement | null; expect(b).not.toBeNull(); return b!; });
    expect(document.getElementById('findBody')!.textContent).toContain('An album is open');
    h.openAlbum.mockImplementation(async (n: number) => { h.snap = { ...h.snap, slot: n, albumLock: null }; });
    back.click();
    expect(h.openAlbum).toHaveBeenCalledWith(0);
  });

  it('"View all albums" on You goes to Browse > My albums', async () => {
    const seen = await start({ slot: 2 });
    await vi.waitFor(() => expect(rows()).toHaveLength(3));
    h.changed();
    const all = [...document.querySelectorAll('.ppp-switch button')].find((b) => /View all albums/.test(b.textContent ?? '')) as HTMLButtonElement;
    all.click();
    expect(seen.filter((e) => e.type === 'xtrata:radio-browse')).toEqual([{ type: 'xtrata:radio-browse', detail: { tab: 'albums' } }]);
    expect(document.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(true);
  });

  it('the classic look and the album page keep the albums in the panel, as before', async () => {
    for (const [skin, view] of [[false, ''], [true, 'album']] as const) {
      const seen = await start({}, skin, view);
      await vi.waitFor(() => expect(document.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(false));
      expect(document.querySelectorAll('.ppp-shelf-body .ppp-shelf-list li')).toHaveLength(3);
      expect(document.getElementById('shelfBox')!.children.length).toBe(0);
      expect(seen.some((e) => e.type === 'xtrata:radio-albums')).toBe(false);
      h.openAlbum.mockImplementation(async (n: number) => { h.snap = { ...h.snap, slot: n }; });
      (document.querySelector('.ppp-shelf-list li button.ppp-pick') as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 20));
      expect(seen.some((e) => e.type === 'xtrata:radio-listen' || e.type === 'xtrata:radio-panel')).toBe(false);
    }
  });
});

describe('the player address at the top of every screen', () => {
  it('shows the player\'s own address shortened, and a tap copies the whole of it', async () => {
    const copied: string[] = [];
    const clip = vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue({ writeText: async (t: string) => { copied.push(t); } } as any);
    await start();
    const chip = document.getElementById('playerId') as HTMLButtonElement;
    expect(chip.hidden).toBe(false);
    expect(chip.textContent).toBe(`${ROOT.slice(0, 6)}…${ROOT.slice(-4)}`);
    expect(chip.getAttribute('aria-label')).toContain(ROOT);
    chip.click();
    await vi.waitFor(() => expect(copied).toEqual([ROOT]));
    await vi.waitFor(() => expect(chip.textContent).toBe('Copied ✓'));
    clip.mockRestore();
  });

  it('stays the player\'s own address while an album\'s wallet is open', async () => {
    await start({ slot: 2, listening: 'SPALBUM2' });
    expect((document.getElementById('playerId') as HTMLButtonElement).dataset.address).toBe(ROOT);
  });

  it('is hidden on the free radio, where there is no player to show', async () => {
    await start({ step: 'elsewhere' });
    expect((document.getElementById('playerId') as HTMLButtonElement).hidden).toBe(true);
  });

  it('the plays count drops "left" on a narrow screen without losing the number', async () => {
    await start({ step: 'ready', session: { playsLeft: 277, plays: 0, spent: 0n, budgetLeft: 900_000n, expires: 0 }, playsLeft: 277, payingOn: true, giftStop: null });
    const top = document.getElementById('ppp-top')!;
    expect(top.textContent).toBe('277 plays left');
    expect(top.querySelector('.ppp-top-left')!.textContent).toBe(' left');
  });
});
