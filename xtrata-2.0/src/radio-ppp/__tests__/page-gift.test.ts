// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The panel for a gifted wallet, with the controller faked: it speaks in plays, hands the album to the radio,
 * tells the radio when to stop, and shows the split before a return.
 */
const h = vi.hoisted(() => ({ snap: {} as any, changed: () => {}, returnFunds: null as any, topUp: vi.fn(), topUpAlbum: vi.fn(), openAlbum: vi.fn(), bind: vi.fn(), arriving: vi.fn(), route: null as null | ((url: string, init?: any) => Response | undefined), radio: null as any, session: { isConnected: false } as any, signed: [] as any[] }));
vi.mock('../controller', () => ({
  TOP_UP_PLAYS: [100, 250, 500],
  createPppController: (deps: any) => {
    h.changed = deps.changed;
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

async function open(over: object = {}) {
  vi.resetModules();
  document.body.innerHTML = `<section id="ppp" hidden><div class="ppp-head"><h3><span class="ppp-badge"></span></h3><span class="ppp-state"></span></div><ol class="ppp-steps"></ol><p class="ppp-stage"></p>
    <div class="ppp-switch" hidden></div><div class="ppp-key"></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-shelf" hidden><summary></summary><div class="ppp-shelf-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details></section>`;
  h.radio = { setGiftPlayer: vi.fn(), setGiftStop: vi.fn(), setGiftWait: vi.fn(), subscribe: vi.fn(), refreshLikes: vi.fn() };
  (window as any).XtrataRadio = h.radio;
  h.snap = { ...base, ...over };
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: any) => h.route?.(String(url), init) ?? new Response(String(url).endsWith('/radio/gift/player') ? JSON.stringify({ id: 'fedcba9876543210', title: 'Proof of Sound', tracks: 2, existing: false }) : '{}')));
  await import('../page');
  h.changed();
  return document.getElementById('ppp')!;
}
const text = (root: Element) => root.textContent ?? '';
beforeEach(() => { vi.unstubAllGlobals(); delete (window as any).XtrataRadio; h.session = { isConnected: false }; h.signed = []; });

describe('Gift Edition panel', () => {
  it('names the player, counts plays (not STX) and hands the album to the radio', async () => {
    const root = await open();
    expect(text(root.querySelector('.ppp-key')!)).toContain('Album · Proof of Sound');
    expect(text(root.querySelector('.ppp-key')!)).toContain('277 plays left');
    expect(text(root.querySelector('.ppp-key')!)).not.toMatch(/STX/);
    expect(h.radio.setGiftPlayer).toHaveBeenCalledWith({ id: PLAYER.id, title: 'Proof of Sound', subtitle: 'Someone', tracks: [11, 12], hidden: null, cover: null });
    h.changed(); h.changed();
    expect(h.radio.setGiftPlayer).toHaveBeenCalledTimes(1); // the same album is not pushed again
  });

  it('tells the radio to stop when the plays are gone, with a quiet pointer to Xverse and Leather', async () => {
    const root = await open({ step: 'fund', balance: 3_000n, giftPlays: 0, giftStop: { reason: 'out', text: 'OUT OF PLAYS — ADD MORE TO KEEP LISTENING' } });
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('OUT OF PLAYS — ADD MORE TO KEEP LISTENING');
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('no plays left');
    expect(text(key)).toContain('Out of plays');
    expect([...key.querySelectorAll('a')].map((a) => a.textContent)).toEqual(expect.arrayContaining(['Xverse', 'Leather']));
    h.snap = { ...h.snap, step: 'ready', giftPlays: 40, giftStop: null };
    h.changed();
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith(null);
  });

  it('an ordinary wallet leaves the radio alone', async () => {
    await open({ gift: null, giftStop: null, giftPlays: 0 });
    expect(h.radio.setGiftPlayer).not.toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
    expect(h.radio.setGiftStop).not.toHaveBeenCalledWith(expect.any(String));
  });

  it('shows the split of a return before anything is sent, and the button confirms it', async () => {
    h.returnFunds = vi.fn();
    const root = await open({ returnPlan: { state: 'ready', kept: 0, excess: null, steps: [{ to: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', kind: 'deposit', send: '197000' }, { to: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', kind: 'gift', send: '297000' }] } });
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('each to whoever it came from');
    expect(text(key)).toContain('0.197000 STX · what was added to it');
    expect(text(key)).toContain('0.297000 STX · the unused gift');
    [...key.querySelectorAll('button')].find((b) => /Confirm part 1 of 2/.test(b.textContent ?? ''))!.click();
    expect(h.returnFunds).toHaveBeenCalledWith('all');
  });

  it('the admin makes a player with a signature over its hash, then offers it for a campaign', async () => {
    const ADMIN = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
    h.session = { isConnected: true, network: 'mainnet', address: ADMIN };
    const root = await open({ gift: null, giftStop: null, giftPlays: 0, main: ADMIN, gate: { ...base.gate, gifts: { ...base.gate.gifts, admin: true } } });
    const fold = root.querySelector('.ppp-gift-body')!;
    const title = fold.querySelector('input[aria-label="Player title"]') as HTMLInputElement;
    const tracks = fold.querySelector('textarea[aria-label="Songs"]') as HTMLTextAreaElement;
    title.value = 'Proof of Sound'; tracks.value = '11, 12';
    [...fold.querySelectorAll('button')].find((b) => /Sign and make player/.test(b.textContent ?? ''))!.click();
    await vi.waitFor(() => expect((fetch as any).mock.calls.some((c: any[]) => String(c[0]).endsWith('/radio/gift/player'))).toBe(true));
    const post = (fetch as any).mock.calls.find((c: any[]) => String(c[0]).endsWith('/radio/gift/player'));
    const body = JSON.parse(post[1].body);
    expect(body.definition).toEqual({ title: 'Proof of Sound', subtitle: '', tracks: [11, 12], cover: null });
    expect(body.request).toMatchObject({ admin: ADMIN, hash: expect.stringMatching(/^[0-9a-f]{64}$/) });
    expect(h.signed).toHaveLength(1);
    await vi.waitFor(() => expect(JSON.parse(localStorage.getItem('xtrata.radio.gift.players.v1:' + ADMIN) || '[]')[0]).toMatchObject({ id: 'fedcba9876543210', tracks: 2 }));
  });

  it('refuses a bad song list before anything is signed', async () => {
    const ADMIN = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
    h.session = { isConnected: true, network: 'mainnet', address: ADMIN };
    const root = await open({ gift: null, giftStop: null, giftPlays: 0, main: ADMIN, gate: { ...base.gate, gifts: { ...base.gate.gifts, admin: true } } });
    const fold = root.querySelector('.ppp-gift-body')!;
    (fold.querySelector('input[aria-label="Player title"]') as HTMLInputElement).value = 'Dupes';
    (fold.querySelector('textarea[aria-label="Songs"]') as HTMLTextAreaElement).value = '11, 11';
    [...fold.querySelectorAll('button')].find((b) => /Sign and make player/.test(b.textContent ?? ''))!.click();
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-gift-body')!)).toContain('appears twice'));
    expect(h.signed).toHaveLength(0);
  });
});

describe('main listener wallet out of funds (an album wallet is open)', () => {
  const ROOT = 'SP3X2F7FQH7GQS0YRBWH0H5W6RM2PB1B0WPD1XA2V';
  const low = { address: ROOT, balance: 0n, low: true, album: true, pending: false, main: undefined as string | undefined };
  const album = { gift: null, giftStop: null, giftPlays: 0 };

  it('warns loudly with the address and a copy button, and no pay button without a main wallet', async () => {
    const root = await open({ ...album, likeFunds: low });
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('YOUR MAIN LISTENER WALLET IS OUT OF FUNDS');
    expect(text(key)).toContain(ROOT);
    expect(key.querySelector('.ppp-lowbox')).not.toBeNull();
    expect([...key.querySelectorAll('button')].map((b) => b.textContent)).toEqual(['Copy address']);
  });

  it('offers a one-tap top-up from the connected main wallet', async () => {
    const root = await open({ ...album, solo: false, main: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', likeFunds: { ...low, main: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP' } });
    const pay = [...root.querySelectorAll('.ppp-key button')].find((b) => /Pay 1.000000 STX from my wallet/.test(b.textContent ?? '')) as HTMLButtonElement;
    expect([...root.querySelectorAll('.ppp-key button')].map((b) => b.textContent)).toContain('Pay 1.000000 STX from my wallet');
    expect(pay).toBeTruthy();
    pay.click();
    expect(h.topUp).toHaveBeenCalledTimes(1);
  });

  it('goes quiet once the top-up is on its way, and shows nothing while funds are fine or no album is open', async () => {
    const root = await open({ ...album, likeFunds: { ...low, low: false, pending: true, txid: '0x' + 'd'.repeat(64) } });
    const key = root.querySelector('.ppp-key')!;
    expect(text(key)).toContain('on its way');
    expect(text(key)).not.toContain('OUT OF FUNDS');
    h.snap = { ...h.snap, likeFunds: { ...low, low: false, balance: 500_000n } }; h.changed();
    expect(key.querySelector('.ppp-lowbox')).toBeNull();
    h.snap = { ...h.snap, likeFunds: { ...low, album: false } }; h.changed();
    expect(key.querySelector('.ppp-lowbox')).toBeNull();
  });
});

describe('My albums (the shelf)', () => {
  const ROOT = 'SP3X2F7FQH7GQS0YRBWH0H5W6RM2PB1B0WPD1XA2V';
  const mk = (slot: number, title: string, subtitle = 'Ada') => ({ slot, address: 'SPALBUM' + slot, state: 'arrived', amount: '100000', label: '', from: null, source: 'campaign', player: { ...PLAYER, id: String(slot).padStart(16, '0'), title, subtitle } });
  const shelf = [mk(1, 'Proof of Sound'), mk(2, 'Night Drive', 'Bo'), mk(3, 'Zero Hour')];
  const own = { step: 'ready', root: ROOT, slot: 0, walletCannotAlbums: false, gift: null, giftStop: null, giftPlays: 0, albumLock: null };
  const start = async (over: object = {}) => {
    localStorage.clear();
    h.openAlbum.mockClear();
    h.route = (url) => (url.includes('/radio/gift/shelf') ? new Response(JSON.stringify({ total: 3, next: null, shelf })) : undefined);
    const root = await open({ ...own, ...over });
    await vi.waitFor(() => expect(root.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(false));
    return root.querySelector('.ppp-shelf')!;
  };

  it('lists every album with a count, searches them, and plays the one tapped', async () => {
    const fold = await start();
    expect(text(fold.querySelector('summary')!)).toBe('♪ My albums (3)');
    expect([...fold.querySelectorAll('.ppp-shelf-list li .t')].map((x) => x.textContent)).toEqual(['Zero Hour', 'Night Drive', 'Proof of Sound']);
    const search = fold.querySelector('input[type=search]') as HTMLInputElement;
    search.value = 'night'; search.dispatchEvent(new Event('input'));
    const rows = [...fold.querySelectorAll('.ppp-shelf-list li')];
    expect(rows).toHaveLength(1);
    expect(text(rows[0])).toContain('Night Drive');
    [...rows[0].querySelectorAll('button')].find((b) => b.textContent === 'Play')!.click();
    expect(h.openAlbum).toHaveBeenCalledWith(2);
  });

  it('pins an album (kept on this device) and moves it to the top', async () => {
    const fold = await start();
    const row = () => [...fold.querySelectorAll('.ppp-shelf-list li')];
    const zero = row().find((r) => text(r).includes('Zero Hour'))!;
    (zero.querySelector('button[aria-label="Pin Zero Hour"]') as HTMLButtonElement).click();
    expect(JSON.parse(localStorage.getItem('xtrata.radio.shelf.pins.v1:' + ROOT)!)).toEqual([3]);
    expect(text(row()[0])).toContain('Zero Hour');
  });

  it('marks the open album, and offers the way back to the listener\'s own wallet', async () => {
    const fold = await start({ slot: 2 });
    const rows = [...fold.querySelectorAll('.ppp-shelf-list li')];
    expect(text(rows.find((r) => r.classList.contains('now'))!)).toContain('Night Drive');
    const back = [...fold.querySelectorAll('button')].find((b) => /My player/.test(b.textContent ?? '') && /←/.test(b.textContent ?? ''))!;
    (back as HTMLButtonElement).click();
    expect(h.openAlbum).toHaveBeenCalledWith(0);
  });

  it('an empty first wallet stops the radio too: paid-only, no free mode', async () => {
    await start({ giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } });
    expect(h.radio.setGiftStop).toHaveBeenLastCalledWith('EMPTY — ADD STX TO PLAY');
  });

  it('shows two places: My player and the open album, and each tab opens its wallet', async () => {
    await start({ slot: 2, balance: 107_300n, gift: { player: { ...PLAYER, title: 'Night Drive' }, from: null, source: 'campaign', amount: '100000' }, likeFunds: { address: ROOT, balance: 199_250n, low: false, album: true, pending: false } });
    const sw = document.querySelector('.ppp-switch')!;
    expect(sw.hasAttribute('hidden')).toBe(false);
    const tabs = [...sw.querySelectorAll('button.ppp-tab')];
    expect(tabs.map((t) => t.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
    expect(text(tabs[0])).toContain('My player');
    expect(text(tabs[0])).toContain('560 plays'); // (0.19925 STX − the reserve) at 350 µSTX a play
    expect(text(tabs[1])).toContain('Night Drive');
    h.openAlbum.mockClear();
    (tabs[0] as HTMLButtonElement).click();
    expect(h.openAlbum).toHaveBeenCalledWith(0);
  });

  it('on My player the second tab is the album played last on this device (many albums never crowd it)', async () => {
    localStorage.clear();
    localStorage.setItem('xtrata.radio.shelf.recent.v1:' + ROOT, JSON.stringify({ 3: 5000 }));
    h.openAlbum.mockClear();
    h.route = (url) => (url.includes('/radio/gift/shelf') ? new Response(JSON.stringify({ total: 3, next: null, shelf })) : undefined);
    const root = await open({ ...own });
    await vi.waitFor(() => expect(root.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(false));
    h.changed();
    const sw = document.querySelector('.ppp-switch')!;
    const tabs = [...sw.querySelectorAll('button.ppp-tab')];
    expect(tabs.map((t) => t.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
    expect(text(tabs[1])).toContain('Zero Hour');
    (tabs[1] as HTMLButtonElement).click();
    expect(h.openAlbum).toHaveBeenCalledWith(3);
  });

  it('"View all albums" opens the My albums fold', async () => {
    localStorage.clear();
    h.route = (url) => (url.includes('/radio/gift/shelf') ? new Response(JSON.stringify({ total: 3, next: null, shelf })) : undefined);
    const root = await open({ ...own });
    await vi.waitFor(() => expect(root.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(false));
    h.changed();
    const link = document.querySelector('.ppp-switch .ppp-all-albums') as HTMLButtonElement;
    expect(text(link)).toBe('View all albums (3)');
    expect((root.querySelector('.ppp-shelf') as HTMLDetailsElement).open).toBe(false);
    link.click();
    expect((root.querySelector('.ppp-shelf') as HTMLDetailsElement).open).toBe(true);
  });

  it('a new album wallet on a device that has already played is not "setup": no steps, no SETUP badge', async () => {
    localStorage.clear();
    const first = { slot: 2, step: 'ready', balance: 107_300n, entries: [], gift: { player: PLAYER, from: null, source: 'campaign', amount: '100000' } };
    h.route = (url) => (url.includes('/radio/gift/shelf') ? new Response(JSON.stringify({ total: 1, next: null, shelf: [shelf[0]] })) : undefined);
    await open({ ...own, ...first, likeFunds: { address: ROOT, balance: 0n, low: false, album: true, pending: false } });
    expect(document.querySelector('.ppp-steps')!.hasAttribute('hidden')).toBe(false); // a brand-new listener with one album: the steps help
    await start({ ...first, likeFunds: { address: ROOT, balance: 199_250n, low: false, album: true, pending: false } });
    expect(document.querySelector('.ppp-steps')!.hasAttribute('hidden')).toBe(true); // My player has plays: this is not first-time setup
    expect(document.querySelector('.ppp-badge')!.hasAttribute('hidden')).toBe(true);
    expect(text(document.querySelector('.ppp-stage')!)).not.toContain('Step 4 of 4');
  });

  it('an album running low offers to add plays from My player, greyed out when My player cannot cover it', async () => {
    const root = await start({ slot: 2, giftPlays: 10, balance: 12_000n, gift: { player: PLAYER, from: null, source: 'campaign', amount: '100000' }, likeFunds: { address: ROOT, balance: 300_000n, low: false, album: true, pending: false } });
    const row = document.querySelector('.ppp-key .ppp-topup')!;
    const buttons = [...row.querySelectorAll('button')] as HTMLButtonElement[];
    expect(buttons.map((b) => b.textContent)).toEqual(['+100', '+250', '+500']); // plays, never STX
    expect(buttons.map((b) => b.disabled)).toEqual([false, false, false]);
    h.topUpAlbum.mockClear();
    buttons[1].click();
    expect(h.topUpAlbum).toHaveBeenCalledWith(250);
    // My player holds 0.06 STX: about 145 plays, so only +100 fits
    h.snap = { ...h.snap, likeFunds: { ...h.snap.likeFunds, balance: 60_000n } };
    h.changed();
    const again = [...document.querySelector('.ppp-key .ppp-topup')!.querySelectorAll('button')] as HTMLButtonElement[];
    expect(again.map((b) => b.disabled)).toEqual([false, true, true]);
    expect(root).toBeTruthy();
  });

  it('there is no switcher when the listener has no albums', async () => {
    localStorage.clear();
    h.route = (url) => (url.includes('/radio/gift/shelf') ? new Response(JSON.stringify({ total: 0, next: null, shelf: [] })) : undefined);
    await open({ ...own });
    await new Promise((r) => setTimeout(r, 20));
    expect(document.querySelector('.ppp-switch')!.hasAttribute('hidden')).toBe(true);
  });

  it('stays out of the way with no albums, or when the wallet box cannot hold them', async () => {
    localStorage.clear();
    h.route = (url) => (url.includes('/radio/gift/shelf') ? new Response(JSON.stringify({ total: 0, next: null, shelf: [] })) : undefined);
    const root = await open({ ...own });
    await new Promise((r) => setTimeout(r, 20));
    expect(root.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(true);
    const root2 = await open({ ...own, walletCannotAlbums: true });
    expect(root2.querySelector('.ppp-shelf')!.hasAttribute('hidden')).toBe(true);
  });
});

describe('claiming an album into its own numbered wallet', () => {
  const ROOT = 'SP3X2F7FQH7GQS0YRBWH0H5W6RM2PB1B0WPD1XA2V';
  const CODE = 'ABCDEFGHJKMNPQRSTVWXYZ';
  const view = { status: 'live', amount: '100000', source: 'campaign', from: null, label: '', expires: 0, player: PLAYER };
  const binding = (slot: number) => ({ root: ROOT, slot, address: 'SPALBUM' + slot, issued: 1, rootSignature: 'r', slotSignature: 's' });
  const posts: any[] = [];
  const route = (claims: Response[]) => (url: string, init?: any) => {
    if (url.endsWith('/radio/gift/status')) return new Response(JSON.stringify(view));
    if (url.includes('/radio/gift/slots')) return new Response(JSON.stringify({ next: 4 }));
    if (url.endsWith('/radio/gift/claim')) { posts.push(JSON.parse(init.body)); return claims.shift(); }
    return undefined;
  };
  const go = async () => {
    const root = await open({ step: 'ready', root: ROOT, slot: 0, walletCannotAlbums: false, gift: null, giftStop: null, giftPlays: 0, solo: false, balance: 100_000n });
    await vi.waitFor(() => expect(h.arriving).toHaveBeenCalled());
    return root;
  };
  beforeEach(() => {
    posts.length = 0; h.arriving = vi.fn(async () => {}); h.bind = vi.fn(async (n: number) => binding(n));
    localStorage.clear();
    localStorage.setItem('xtrata.radio.gift.incoming.v1', JSON.stringify({ code: CODE, at: Date.now() }));
  });

  it('proves the next free number is the listener\'s and sends the gift there, whatever the open wallet holds', async () => {
    h.route = route([new Response(JSON.stringify({ txid: '0x' + 'e'.repeat(64), amount: '100000' }))]);
    await go();
    expect(h.bind).toHaveBeenCalledWith(4);
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({ code: CODE, wallet: 'SPALBUM4', binding: binding(4) });
    expect(h.arriving).toHaveBeenCalledWith(4, 'SPALBUM4', '0x' + 'e'.repeat(64), 100_000n);
    expect(localStorage.getItem('xtrata.radio.gift.incoming.v1')).toBeNull();
  });

  it('tries the next number, with a fresh proof, when another claim just took that one', async () => {
    h.route = route([
      new Response(JSON.stringify({ error: 'That wallet number was just taken by another gift. Trying the next one…' }), { status: 409 }),
      new Response(JSON.stringify({ txid: '0x' + 'e'.repeat(64), amount: '100000' }))
    ]);
    await go();
    expect(h.bind.mock.calls.map((c: unknown[]) => c[0])).toEqual([4, 5]);
    expect(posts.map((p) => p.wallet)).toEqual(['SPALBUM4', 'SPALBUM5']);
    expect(h.arriving).toHaveBeenCalledWith(5, 'SPALBUM5', '0x' + 'e'.repeat(64), 100_000n);
  });
});

describe('a starter gift never looks failed while it is on its way', () => {
  const CODE = 'ABCDEFGHJKMNPQRSTVWXYZ';
  const view = { status: 'live', amount: '100000', source: 'campaign', from: null, label: '', expires: 0, player: null };
  const posts: any[] = [];
  const route = (claim: () => Response) => (url: string, init?: any) => {
    if (url.endsWith('/radio/gift/status')) return new Response(JSON.stringify(view));
    if (url.endsWith('/radio/gift/claim')) { posts.push(JSON.parse(init.body)); return claim(); }
    return undefined;
  };
  // A brand-new passkey-only wallet, empty, nothing paid yet: exactly where a gift lands.
  const empty = { step: 'fund', balance: 0n, balanceState: 'empty', playsLeft: 0, session: null, payingOn: true, gift: null, giftStop: null, giftPlays: 0, returnTo: undefined, funderState: 'none', createdHere: true };
  beforeEach(() => {
    posts.length = 0;
    localStorage.clear();
    localStorage.setItem('xtrata.radio.gift.incoming.v1', JSON.stringify({ code: CODE, at: Date.now() }));
    delete document.documentElement.dataset.ppp;
  });

  it('a slow or failing send is an amber "still sending", with no red, no "add funds" and no "artists unpaid"', async () => {
    h.route = route(() => new Response(JSON.stringify({ error: 'Broadcast failed: ConflictingNonceInMempool' }), { status: 500 }));
    const root = await open(empty);
    await vi.waitFor(() => expect(posts).toHaveLength(1));
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-key')!)).toContain('Still sending your gift'));
    const key = root.querySelector('.ppp-key')!;
    expect([...key.querySelectorAll('p')].find((p) => /Still sending/.test(p.textContent ?? ''))!.className).toContain('ppp-warn');
    expect(root.querySelector('.ppp-bad')).toBeNull();
    expect(text(root)).not.toMatch(/Add funds|Add plays|ConflictingNonce|Copy my address/);
    expect(text(root.querySelector('.ppp-err')!)).toBe('');
    expect(document.documentElement.dataset.ppp).toBeUndefined();
    expect(text(root.querySelector('.ppp-stage')!)).toMatch(/on their way/);
  });

  it('a real stop (too many gifts on one connection) is said plainly, and the wallet is an ordinary empty one again', async () => {
    h.route = route(() => new Response(JSON.stringify({ error: 'A lot of gifts have been opened on this connection today.' }), { status: 429 }));
    const root = await open(empty);
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-key')!)).toContain('on this connection today'));
    expect(root.querySelector('.ppp-key .ppp-bad')!.textContent).toMatch(/on this connection today/);
    expect(text(root.querySelector('.ppp-key')!)).toContain('Add plays');
  });
});

describe('prefunded batches (admin): the creator pays for every copy up front', () => {
  const ADMIN = 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP';
  const TREASURY = 'SP2TREASURYTREASURYTREASURYTREASURYAAA';
  const ID = '0123456789abcdef';
  const CODES = ['A'.repeat(22), 'B'.repeat(22)];
  const live = { id: ID, status: 'live', count: 2, amount: '108000', label: 'Launch', player: null, deposit: '222000', memo: 'batch ' + ID, expires: 1, copies: { waiting: 2, claiming: 0, claimed: 0, refunding: 0, refunded: 0 } };
  let calls: { url: string; body: any }[] = [];
  const admin = (over: object = {}) => open({ gift: null, giftStop: null, giftPlays: 0, main: ADMIN, gate: { ...base.gate, gifts: { ...base.gate.gifts, admin: true, treasury: TREASURY } }, ...over });
  const field = (root: Element, sel: string) => root.querySelector('.ppp-gift-body')!.querySelector(sel) as HTMLInputElement & HTMLSelectElement;
  const click = (root: Element, label: RegExp) => [...root.querySelector('.ppp-gift-body')!.querySelectorAll('button')].find((b) => label.test(b.textContent ?? ''))!.click();
  const served = (over: Record<string, () => Response> = {}) => {
    calls = [];
    h.route = (url, init) => {
      calls.push({ url, body: init?.body ? JSON.parse(init.body) : null });
      const path = url.replace(/\?.*/, '');
      if (over[path]) return over[path]();
      if (path.endsWith('/radio/gift/batch/confirm')) return new Response(JSON.stringify(live));
      if (path.endsWith('/radio/gift/batch')) return init?.method === 'POST'
        ? new Response(JSON.stringify({ id: ID, codes: CODES, count: 2, amount: '108000', depositTo: TREASURY, deposit: '222000', memo: 'batch ' + ID, links: [] }))
        : new Response(JSON.stringify(live));
      return undefined;
    };
  };
  const payWith = async (impl: (o: any) => void) => { const m = await import('../../lib/wallet/connect'); (m.showStxTransfer as any).mockReset(); (m.showStxTransfer as any).mockImplementation(impl); return m.showStxTransfer as any; };
  beforeEach(() => { localStorage.clear(); h.session = { isConnected: true, network: 'mainnet', address: ADMIN }; });

  it('only a gift admin sees it', async () => {
    h.session = { isConnected: true, network: 'mainnet', address: ADMIN };
    const root = await open({ gift: null, giftStop: null, giftPlays: 0, main: ADMIN });
    expect(text(root.querySelector('.ppp-gift-body')!)).not.toMatch(/Prefunded batch/);
    const a = await admin();
    expect(text(a.querySelector('.ppp-gift-body')!)).toContain('Prefunded batch (admin)');
  });

  it('the "send music to a friend" gift is gone for everyone: no section for a listener, albums only for an admin', async () => {
    const root = await open({ gift: null, giftStop: null, giftPlays: 0, main: ADMIN });
    expect((root.querySelector('.ppp-gifts') as HTMLElement).hidden).toBe(true);
    expect(text(root.querySelector('.ppp-gift-body')!)).not.toMatch(/Give someone|Gift amount|Send a gift/i);
    const a = await admin();
    const body = a.querySelector('.ppp-gift-body')!;
    expect((a.querySelector('.ppp-gifts') as HTMLElement).hidden).toBe(false);
    expect(body.querySelector('input[type="range"]')).toBeNull(); // no friend-gift amount slider
    expect(text(body)).not.toMatch(/Give someone|send a gift/i);
    expect(text(body)).toContain('Gift players (admin)');
  });

  it('has no campaign box any more: batches are the only way to make links', async () => {
    served();
    const root = await admin();
    const body = text(root.querySelector('.ppp-gift-body')!);
    expect(body).not.toMatch(/Campaign links|paid from the gift treasury|Sign and make links/);
    expect(body).toContain('Prefunded batch (admin)');
    expect(body).toContain('Sign and make player');
  });

  it('shows the whole bill before anything is signed: plays, reserve, likes float, sending fee, total', async () => {
    served();
    const root = await admin();
    field(root, 'input[aria-label="Copies"]').value = '100'; field(root, 'input[aria-label="Copies"]').dispatchEvent(new Event('input'));
    expect(text(root.querySelector('.ppp-gift-body')!)).toMatch(/Each copy: 300 paid plays .*0\.003 kept.*= 0\.111 STX\. 100 copies = 11\.1 STX, paid now in one payment/);
    expect(text(root.querySelector('.ppp-gift-body')!)).toContain('come back to you');
    expect(h.signed).toHaveLength(0);
    expect(calls.filter((c) => /batch/.test(c.url) && c.body)).toHaveLength(0);
  });

  it('signs one request, makes the links, saves them on this device, then asks for ONE payment with the batch memo', async () => {
    served();
    const pay = await payWith((o) => o.onFinish({ txId: '0x' + 'd'.repeat(64) }));
    const root = await admin();
    field(root, 'input[aria-label="Copies"]').value = '2'; field(root, 'input[aria-label="Batch label"]').value = 'Launch';
    click(root, /Sign, pay and make links/);
    await vi.waitFor(() => expect(calls.some((c) => c.url.endsWith('/radio/gift/batch/confirm'))).toBe(true));
    expect(h.signed).toHaveLength(1);
    expect(h.signed[0].message.data.purpose.data).toMatch(/prefunded/);
    const made = calls.find((c) => c.url.endsWith('/radio/gift/batch') && c.body)!;
    expect(made.body.request).toMatchObject({ creator: ADMIN, count: 2, amount: '108000', label: 'Launch' });
    expect(made.body.request.player).toBeUndefined();
    expect(made.body.signature).toBe('ab'.repeat(65));
    expect(pay).toHaveBeenCalledTimes(1);
    expect(pay.mock.calls[0][0]).toMatchObject({ recipient: TREASURY, amount: '222000', memo: 'batch ' + ID, stxAddress: ADMIN });
    expect(calls.find((c) => c.url.endsWith('/radio/gift/batch/confirm'))!.body).toEqual({ id: ID, txid: '0x' + 'd'.repeat(64) });
    const saved = JSON.parse(localStorage.getItem('xtrata.radio.gift.batches.v1:' + ADMIN)!);
    expect(saved[0]).toMatchObject({ id: ID, codes: CODES, txid: '0x' + 'd'.repeat(64) });
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-gift-body')!)).toContain('0 of 2 claimed'));
    const body = root.querySelector('.ppp-gift-body')!;
    expect([...body.querySelectorAll('button')].map((b) => b.textContent)).toEqual(expect.arrayContaining(['Copy all links', 'Copy as CSV']));
    expect(text(body)).not.toContain('A'.repeat(22)); // the codes are never printed, only copied
  });

  it('an album batch carries the album id and the likes float', async () => {
    served();
    await payWith((o) => o.onFinish({ txId: '0x' + 'd'.repeat(64) }));
    localStorage.setItem('xtrata.radio.gift.players.v1:' + ADMIN, JSON.stringify([{ id: 'fedcba9876543210', title: 'Proof of Sound', tracks: 2 }]));
    const root = await admin();
    h.changed();
    field(root, 'select[aria-label="Batch album"]').value = 'fedcba9876543210'; field(root, 'select[aria-label="Batch album"]').dispatchEvent(new Event('change'));
    field(root, 'input[aria-label="Copies"]').value = '2';
    expect(text(root.querySelector('.ppp-gift-body')!)).toContain('for the album’s likes');
    click(root, /Sign, pay and make links/);
    await vi.waitFor(() => expect(calls.some((c) => c.url.endsWith('/radio/gift/batch') && c.body)).toBe(true));
    expect(calls.find((c) => c.url.endsWith('/radio/gift/batch') && c.body)!.body.request).toMatchObject({ player: 'fedcba9876543210', amount: '123000', count: 2 });
  });

  it('a cancelled payment keeps the links and offers Pay now, which pays the same batch', async () => {
    served();
    let first = true;
    const pay = await payWith((o) => { if (first) { first = false; o.onCancel(); } else o.onFinish({ txId: '0x' + 'c'.repeat(64) }); });
    const root = await admin();
    field(root, 'input[aria-label="Copies"]').value = '2';
    click(root, /Sign, pay and make links/);
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-gift-body')!)).toContain('Payment cancelled. Your links are saved'));
    expect(JSON.parse(localStorage.getItem('xtrata.radio.gift.batches.v1:' + ADMIN)!)[0]).toMatchObject({ id: ID, codes: CODES });
    expect(JSON.parse(localStorage.getItem('xtrata.radio.gift.batches.v1:' + ADMIN)!)[0].txid).toBeUndefined();
    expect(h.signed).toHaveLength(1);
    click(root, /Pay now/);
    await vi.waitFor(() => expect(pay).toHaveBeenCalledTimes(2));
    expect(pay.mock.calls[1][0]).toMatchObject({ recipient: TREASURY, amount: '222000', memo: 'batch ' + ID });
    expect(h.signed).toHaveLength(1); // no second signature, no second batch
    await vi.waitFor(() => expect(JSON.parse(localStorage.getItem('xtrata.radio.gift.batches.v1:' + ADMIN)!)[0].txid).toBe('0x' + 'c'.repeat(64)));
  });

  it('a refusal from the server is shown, nothing is paid and nothing is saved', async () => {
    served({ '/radio/gift/batch': () => new Response(JSON.stringify({ error: 'Several batches are still waiting for their payment. Pay or wait for them first.' }), { status: 429 }) });
    const pay = await payWith((o) => o.onFinish({ txId: '0x1' }));
    const root = await admin();
    click(root, /Sign, pay and make links/);
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-gift-body')!)).toContain('still waiting for their payment'));
    expect(pay).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem('xtrata.radio.gift.batches.v1:' + ADMIN) || '[]')).toEqual([]);
  });

  it('refuses a bad number of copies before anything is signed', async () => {
    served();
    const root = await admin();
    field(root, 'input[aria-label="Copies"]').value = '101';
    click(root, /Sign, pay and make links/);
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-gift-body')!)).toContain('Make 1 to 100 copies at a time.'));
    expect(h.signed).toHaveLength(0);
  });

  it('lists a batch made on another device without its links', async () => {
    served({ '/radio/gift/batches': () => new Response(JSON.stringify({ batches: [{ ...live, label: 'Elsewhere' }] })) });
    const root = await admin();
    await vi.waitFor(() => expect(text(root.querySelector('.ppp-gift-body')!)).toContain('links were made on another device'));
    expect(text(root.querySelector('.ppp-gift-body')!)).toContain('Elsewhere');
  });
});

describe('waiting for plays to arrive', () => {
  const arriving = { step: 'fund', balance: 0n, balanceState: 'empty', playsLeft: 0, session: null, giftPlays: 0, depositPending: true, giftStop: { reason: 'arriving', text: 'YOUR PLAYS ARE ARRIVING' } };
  beforeEach(() => { delete document.documentElement.dataset.ppp; localStorage.clear(); });

  it('shows a calm countdown bar, no red, and no "artists unpaid", for the first minute', async () => {
    const root = await open({ ...arriving, gift: null, arrival: { since: Date.now() - 12_000, graceMs: 60_000 } });
    const bar = root.querySelector('.ppp-wait')!;
    expect(bar).not.toBeNull();
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(text(bar)).toMatch(/Your plays are arriving.*usually about a minute · (4[6-9]|48)s/);
    expect(bar.classList.contains('is-long')).toBe(false);
    expect(root.querySelector('.ppp-bad')).toBeNull();
    expect(text(root)).not.toMatch(/artists unpaid|Add funds|Out of plays|Out of funds/);
    expect(document.documentElement.dataset.ppp).toBeUndefined(); // the radio is not dressed as "not paying"
  });

  it('past the first minute it keeps moving and stays calm: it never turns into an error', async () => {
    const root = await open({ ...arriving, gift: null, arrival: { since: Date.now() - 95_000, graceMs: 60_000 } });
    const bar = root.querySelector('.ppp-wait')!;
    expect(bar.classList.contains('is-long')).toBe(true);
    expect(text(bar)).toMatch(/Still arriving.*starts by itself/);
    expect(root.querySelector('.ppp-bad')).toBeNull();
  });

  it('tells the radio to grey its controls while plays arrive, and to wake them once they have', async () => {
    await open({ ...arriving, gift: null, arrival: { since: Date.now(), graceMs: 60_000 } });
    expect(h.radio.setGiftWait).toHaveBeenLastCalledWith(true);
    h.snap = { ...base, step: 'ready', depositPending: false, arrival: null, giftStop: null };
    h.changed();
    expect(h.radio.setGiftWait).toHaveBeenLastCalledWith(false);
  });

  it('no bar when nothing is expected: a genuinely empty wallet still says so', async () => {
    const root = await open({ step: 'fund', balance: 0n, balanceState: 'empty', playsLeft: 0, session: null, giftPlays: 0, gift: null, arrival: null, giftStop: { reason: 'out', text: 'EMPTY — ADD STX TO PLAY' } });
    expect(root.querySelector('.ppp-wait')).toBeNull();
  });
});
