// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The panel for a gifted wallet, with the controller faked: it speaks in plays, hands the album to the radio,
 * tells the radio when to stop, and shows the split before a return.
 */
const h = vi.hoisted(() => ({ snap: {} as any, changed: () => {}, returnFunds: null as any, topUp: vi.fn(), openAlbum: vi.fn(), bind: vi.fn(), arriving: vi.fn(), route: null as null | ((url: string, init?: any) => Response | undefined), radio: null as any, session: { isConnected: false } as any, signed: [] as any[] }));
vi.mock('../controller', () => ({
  createPppController: (deps: any) => {
    h.changed = deps.changed;
    return new Proxy({ snapshot: () => h.snap, refresh: async () => {}, returnFunds: (m: string) => h.returnFunds(m), topUpLikes: () => h.topUp(), openAlbum: (n: number) => h.openAlbum(n), bindAlbum: (n: number) => h.bind(n), albumArriving: (...a: unknown[]) => h.arriving(...a), onListened: async () => {}, giftSent: () => {} }, {
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
  gift: { player: PLAYER, from: null, source: 'campaign', amount: '100000' }, giftPlays: 277, giftStop: null, returnPlan: { state: 'none' }
};

async function open(over: object = {}) {
  vi.resetModules();
  document.body.innerHTML = `<section id="ppp" hidden><div class="ppp-head"><h3><span class="ppp-badge"></span></h3><span class="ppp-state"></span></div><ol class="ppp-steps"></ol><p class="ppp-stage"></p>
    <div class="ppp-switch" hidden></div><div class="ppp-key"></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-shelf" hidden><summary></summary><div class="ppp-shelf-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details></section>`;
  h.radio = { setGiftPlayer: vi.fn(), setGiftStop: vi.fn(), subscribe: vi.fn(), refreshLikes: vi.fn() };
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
    expect(h.radio.setGiftPlayer).toHaveBeenCalledWith({ id: PLAYER.id, title: 'Proof of Sound', subtitle: 'Someone', tracks: [11, 12] });
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
    const tabs = [...sw.querySelectorAll('button')];
    expect(tabs.map((t) => t.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
    expect(text(tabs[0])).toContain('My player');
    expect(text(tabs[0])).toContain('0.1993 STX');
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
    const tabs = [...sw.querySelectorAll('button')];
    expect(tabs.map((t) => t.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
    expect(text(tabs[1])).toContain('Zero Hour');
    (tabs[1] as HTMLButtonElement).click();
    expect(h.openAlbum).toHaveBeenCalledWith(3);
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
