// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createReleases, type ReleasesDeps } from '../releases';

const ARTIST = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const ME = 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N';
const REL = '0123456789abcdef';
const view = (over: object = {}) => ({ id: REL, title: 'Reload', subtitle: 'melophonic', tracks: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 319, title: 'Russian Rampage', artist: 'melophonic' }], cover: null, paidOnly: true, artist: ARTIST, added: 3, createdAt: 1, ...over });
let priceAtStart = '0';
const ORDER = { order: 'aaaaaaaaaaaaaaaa', release: REL, to: ARTIST, amount: '2000000', memo: 'buy aaaaaaaaaaaaaaaa', status: 'pending' };
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };

function setup(opts: { made?: boolean; enabled?: boolean; sales?: boolean; copies?: boolean; price?: string; url?: string; main?: string; player?: { address?: string; unlocked: boolean }; shelf?: any[]; songs?: any } = {}) {
  window.history.replaceState(null, '', opts.url ?? '/radio');
  const store = new Map<string, string>();
  if (opts.price) priceAtStart = opts.price;
  const world = { shelf: opts.shelf ?? [] as any[], player: opts.player ?? { address: ME, unlocked: true }, main: opts.main, posts: [] as [string, any][], signed: [] as [string, string | undefined][], opened: [] as string[], changes: 0, failShelf: false, art: new Map<number, string>(), artAsked: new Set<number>(), artSettled: false, covers: new Map<number, string>(), hearing: null as null | { id: number; state: 'loading' | 'playing' | 'error' }, toggled: [] as number[], stops: 0, price: priceAtStart, sold: 0, order: null as null | { status: string; txid?: string }, paid: [] as [string, bigint, string][], payFails: '', chain: 'none' as 'none' | 'pending' | 'success' | 'bad' };
  const deps: ReleasesDeps = {
    json: vi.fn(async (url: string, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      if (init?.method === 'POST') world.posts.push([url, body]);
      if (url === '/radio/release/config') return { enabled: opts.enabled ?? true, sales: opts.sales ?? false, copies: opts.copies ?? false };
      if (url.startsWith('/radio/release/view')) return view({ price: world.price, sold: world.sold });
      if (url === '/radio/release/price') { world.price = body.request.price; return view({ price: world.price }); }
      if (url === '/radio/release/paid') {
        if (world.chain === 'bad') throw new Error('That payment did not go through. Nothing was taken; try again.');
        if (world.chain === 'success') { world.order = { status: 'paid' }; world.shelf.unshift({ ...view({ price: world.price }), hidden: false }); world.sold++; }
        else if (world.chain === 'pending' && body.txid) world.order = { status: 'confirming' };
        return { ...ORDER, status: world.order?.status ?? 'pending' };
      }
      if (url.startsWith('/radio/release/songs')) { if (opts.songs instanceof Error) throw opts.songs; return opts.songs ?? { songs: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 319, title: 'Russian Rampage', artist: 'melophonic' }], more: false }; }
      if (url.startsWith('/radio/release/by')) return { releases: opts.made || world.posts.some(([u]) => u === '/radio/release/create') ? [view({ added: 0, price: world.price, sold: world.sold })] : [] };
      if (url === '/radio/release/create') return { id: REL, title: body.definition.title, tracks: body.definition.tracks.length, existing: false };
      if (url === '/radio/release/shelf') {
        if (world.failShelf) throw new Error('Releases are unavailable right now.');
        const { action, release } = body.request;
        if (action === 'add' && world.price !== '0' && world.order?.status !== 'paid') { world.order ??= { status: 'pending' }; return { albums: world.shelf, pay: { ...ORDER, amount: world.price, status: world.order.status } }; }
        if (action === 'add' && !world.shelf.some((a) => a.id === release)) world.shelf.unshift({ ...view(), hidden: false });
        if (action === 'hide' || action === 'show') world.shelf = world.shelf.map((a) => (a.id === release ? { ...a, hidden: action === 'hide' } : a));
        if (action === 'remove') world.shelf = world.shelf.filter((a) => a.id !== release);
        return { albums: world.shelf };
      }
      throw new Error('unexpected ' + url);
    }),
    main: () => world.main,
    sign: vi.fn(async () => 'ab'.repeat(65)),
    pay: vi.fn(async (_main: string, to: string, amount: bigint, memo: string) => { if (world.payFails) throw new Error(world.payFails); world.paid.push([to, amount, memo]); return '0x' + 'e'.repeat(64); }),
    copies: (_main, release) => { const p = document.createElement('p'); p.textContent = 'COPIES FORM ' + release.id; return [p]; },
    signShelf: vi.fn(async (action, release) => { if (!world.player.unlocked) throw new Error('Unlock your player first.'); world.signed.push([action, release]); return { request: { action, release: release ?? '', player: ME, issued: 1 }, signature: 'cd'.repeat(65) }; }),
    player: () => world.player,
    open: (a) => { world.opened.push(a.id); },
    who: (a) => (a === ARTIST ? 'jim.btc' : String(a).slice(0, 6)),
    art: { song: (id, ask) => { if (ask) world.artAsked.add(id); return world.art.has(id) ? world.art.get(id)! : world.artAsked.has(id) && world.artSettled ? '' : null; }, cover: (id) => (id ? world.covers.get(id) ?? '' : '') },
    audition: { state: (id) => (world.hearing?.id === id ? world.hearing.state : 'idle'), toggle: (id) => { world.hearing = world.hearing?.id === id ? null : { id, state: 'playing' }; world.toggled.push(id); deps.changed(); }, stop: () => { world.stops++; world.hearing = null; } },
    changed: () => { world.changes++; },
    store: { get: (k) => store.get(k) ?? null, set: (k, v) => { if (v === null) store.delete(k); else store.set(k, v); } },
    now: () => Date.now()
  };
  const r = createReleases(deps);
  const ready = async () => { r.sync(); await flush(); r.sync(); await flush(); r.sync(); await flush(); };
  const text = (els: (HTMLElement | null)[] | null) => (els ?? []).map((e) => e?.textContent ?? '').join(' ').replace(/\s+/g, ' ');
  const press = (els: (HTMLElement | null)[] | null, label: RegExp) => {
    const b = (els ?? []).flatMap((e) => (e ? [...(e.matches('button') ? [e] : []), ...e.querySelectorAll('button')] : [])).find((x) => label.test(x.textContent || '')) as HTMLButtonElement | undefined;
    if (!b) throw new Error('no button ' + label); b.click();
  };
  return { r, deps, world, store, ready, text, press };
}
beforeEach(() => { window.history.replaceState(null, '', '/radio'); priceAtStart = '0'; });

describe('releases on the radio page', () => {
  it('shows nothing at all while releases are switched off', async () => {
    const s = setup({ enabled: false, url: '/radio?release=' + REL, main: ARTIST });
    await s.ready();
    expect(s.r.banner()).toEqual([]);
    expect(s.r.fold()).toBeNull();
    expect(s.r.albums()).toEqual([]);
    expect(s.r.manage()).toBeNull();
    expect(s.world.signed).toEqual([]);
  });

  it('a release link shows the release; adding it signs in the box, and it is then in the player', async () => {
    const s = setup({ url: '/radio?release=' + REL });
    await s.ready();
    expect(s.world.signed).toEqual([['list', '']]);                 // the shelf was read once on unlock
    expect(s.text(s.r.banner())).toContain('Reload');
    expect(s.text(s.r.banner())).toContain('Released by jim.btc. 3 players have added it.');
    s.press(s.r.banner(), /Add to my player/);
    await flush();
    expect(s.world.signed.at(-1)).toEqual(['add', REL]);
    expect(s.r.albums().map((a) => a.id)).toEqual([REL]);
    expect(s.text(s.r.banner())).toContain('In your player ✓');
    expect(s.text(s.r.banner())).toContain('4 players have added it.');
    s.press(s.r.banner(), /Play it/);
    expect(s.world.opened).toEqual([REL]);
    s.press(s.r.banner(), /Not now/);
    expect(s.r.banner()).toEqual([]);
  });

  it('says what is needed when there is no player yet, or it is locked, and signs nothing', async () => {
    const none = setup({ url: '/radio?release=' + REL, player: { unlocked: false } });
    await none.ready();
    expect(none.text(none.r.banner())).toContain('Make your player first');
    const locked = setup({ url: '/radio?release=' + REL, player: { address: ME, unlocked: false } });
    await locked.ready();
    expect(locked.text(locked.r.banner())).toContain('Unlock your player to add this album');
    expect([...none.world.signed, ...locked.world.signed]).toEqual([]);
  });

  it('an added album stays: it shows from this device’s copy while locked, and the server’s copy wins once unlocked', async () => {
    const s = setup({ shelf: [{ ...view(), hidden: false }] });
    await s.ready();
    expect(s.r.albums()).toHaveLength(1);
    // The next visit, still locked: the album is already listed.
    const later = setup({ player: { address: ME, unlocked: false } });
    for (const [k, v] of s.store) later.store.set(k, v);
    await later.ready();
    expect(later.r.albums().map((a) => a.title)).toEqual(['Reload']);
    expect(later.world.signed).toEqual([]);
    // Removed on another device meanwhile: unlocking here shows the truth.
    later.world.player = { address: ME, unlocked: true }; later.world.shelf = [];
    await later.ready();
    expect(later.r.albums()).toEqual([]);
  });

  it('hide keeps an album out of sight, show brings it back, remove takes it off', async () => {
    const s = setup({ shelf: [{ ...view(), hidden: false }] });
    await s.ready();
    expect(s.text([s.r.manage()])).toContain('Albums I added (1)');
    s.press([s.r.manage()], /^Hide$/); await flush();
    expect(s.r.albums()).toEqual([]);
    expect(s.text([s.r.manage()])).toContain('Albums I added (1, 1 hidden)');
    s.press([s.r.manage()], /^Show$/); await flush();
    expect(s.r.albums()).toHaveLength(1);
    s.press([s.r.manage()], /^Remove$/); await flush();
    expect(s.r.manage()).toBeNull();
    expect(s.world.signed.map(([a]) => a)).toEqual(['list', 'hide', 'show', 'remove']);
  });

  it('a change that fails says so and changes nothing here', async () => {
    const s = setup({ url: '/radio?release=' + REL });
    await s.ready();
    s.world.failShelf = true;
    s.press(s.r.banner(), /Add to my player/); await flush();
    expect(s.r.albums()).toEqual([]);
    expect(s.text(s.r.banner())).toContain('Releases are unavailable right now.');
  });

  it('an artist picks songs in order, signs once, and gets a link; nothing is offered without a connected wallet', async () => {
    expect((await (async () => { const n = setup(); await n.ready(); return n.r.fold(); })())).toBeNull();
    const s = setup({ main: ARTIST });
    await s.ready();
    s.press(s.r.fold(), /Show the songs in my wallet/); await flush();
    expect(s.text(s.r.fold())).toContain('Tap your songs in the order they should play.');
    s.press(s.r.fold(), /Russian Rampage/);
    s.press(s.r.fold(), /Entertainment/);
    const parts = s.r.fold()!;
    expect(s.text(parts)).toContain('Sign and release this EP · 2 songs');
    (parts.find((e) => e.getAttribute('aria-label') === 'Release title') as HTMLInputElement).value = 'Reload';
    s.press(parts, /Sign and release/); await flush(); await flush();
    const created = s.world.posts.find(([u]) => u === '/radio/release/create')![1];
    expect(created.definition).toEqual({ title: 'Reload', subtitle: 'melophonic', tracks: [319, 315], cover: null });   // the order tapped
    expect(created.request).toMatchObject({ artist: ARTIST });
    expect(created.signature).toBe('ab'.repeat(65));
    await flush();
    expect(s.text(s.r.fold())).toContain('Released ✓ “Reload”');
    expect(s.text(s.r.fold())).toContain('Your releases');
    expect(s.text(s.r.fold())).toContain('added by 0 players');
  });

  it('songs that cannot be read are an error to retry, never "you have no songs"', async () => {
    const s = setup({ main: ARTIST, songs: new Error('Could not read what this wallet holds right now. Try again shortly.') });
    await s.ready();
    s.press(s.r.fold(), /Show the songs/); await flush();
    expect(s.text(s.r.fold())).toContain('Could not read what this wallet holds right now.');
    expect(s.text(s.r.fold())).not.toContain('No songs found');
  });
});

describe('hearing and seeing a release before it is made', () => {
  const rows = (parts: HTMLElement[] | null) => [...(parts ?? []).flatMap((p) => [...p.querySelectorAll('.ppp-release-song')])] as HTMLElement[];
  const open = async () => { const s = setup({ main: ARTIST }); await s.ready(); s.press(s.r.fold(), /Show the songs/); await flush(); return s; };

  it('every song has a listen button that never picks the song, and a pick button that never plays it', async () => {
    const s = await open();
    let r = rows(s.r.fold());
    expect(r).toHaveLength(2);
    (r[0].querySelector('.ppp-release-hear') as HTMLButtonElement).click();
    expect(s.world.toggled).toEqual([315]);
    r = rows(s.r.fold());
    expect(r[0].classList.contains('is-on')).toBe(false);                       // listening is not choosing
    expect(r[0].querySelector('.ppp-release-hear')!.getAttribute('aria-label')).toBe('Stop Entertainment');
    expect(r[1].querySelector('.ppp-release-hear')!.getAttribute('aria-label')).toBe('Listen to Russian Rampage');
    (r[1].querySelector('.ppp-release-pick') as HTMLButtonElement).click();
    expect(s.world.toggled).toEqual([315]);                                     // choosing is not listening
    expect(rows(s.r.fold())[1].classList.contains('is-on')).toBe(true);
    expect(s.world.posts.filter(([u]) => u !== '/radio/release/shelf')).toHaveLength(0); // nothing released, nothing paid
  });

  it('says so on the row when a song cannot be played', async () => {
    const s = await open();
    s.world.hearing = { id: 319, state: 'error' };
    expect(rows(s.r.fold())[1].textContent).toContain('could not play');
  });

  it('only looks up artwork for songs that are picked or listened to', async () => {
    const s = await open();
    s.r.fold();
    expect([...s.world.artAsked]).toEqual([]);
    (rows(s.r.fold())[1].querySelector('.ppp-release-pick') as HTMLButtonElement).click();
    s.r.fold();
    expect([...s.world.artAsked]).toEqual([319]);
  });

  it('previews the release as listeners will see it: cover, title, and each song with its artwork or its number', async () => {
    const s = await open();
    s.world.art.set(315, 'data:image/jpeg;base64,AAAA');
    for (const r of rows(s.r.fold())) { (r.querySelector('.ppp-release-pick') as HTMLButtonElement).click(); s.r.fold(); }
    let parts = s.r.fold()!;
    let pre = parts.find((p) => p.classList.contains('ppp-release-preview'))!;
    expect(pre.textContent).toContain('Untitled');
    expect(pre.textContent).toContain('Finding artwork for 1 song');
    // no cover given: the first song's artwork is the cover
    expect(pre.querySelector('.is-cover img')!.getAttribute('src')).toBe('data:image/jpeg;base64,AAAA');
    s.world.artSettled = true;                                                 // 319 turns out to have no artwork
    (parts.find((p) => p.matches('input[aria-label="Cover inscription number"]')) as HTMLInputElement).value = '77';
    s.world.covers.set(77, '/inscription/77');
    parts = s.r.fold()!;
    pre = parts.find((p) => p.classList.contains('ppp-release-preview'))!;
    expect(pre.querySelector('.is-cover img')!.getAttribute('src')).toBe('/inscription/77');
    const songs = [...pre.querySelectorAll('.ppp-rel-songs li')];
    expect(songs.map((li) => li.textContent)).toEqual(['Entertainment', '2Russian Rampage']);
    expect(songs[0].querySelector('.ppp-rel-art')!.classList.contains('is-blank')).toBe(false);
    expect(songs[1].querySelector('.ppp-rel-art')!.classList.contains('is-blank')).toBe(true);
    expect(songs[1].querySelector('img')!.getAttribute('src')).toBe('/inscription/77'); // the cover, dimmed, behind its number
    expect(pre.textContent).toContain('no artwork of its own');
    // typing the title updates the preview without rebuilding the section
    const title = parts.find((p) => p.matches('input[aria-label="Release title"]')) as HTMLInputElement;
    const before = s.world.changes;
    title.value = 'Reload'; title.dispatchEvent(new Event('input'));
    expect(pre.textContent).toContain('Reload');
    expect(s.world.changes).toBe(before);
  });

  it('there is no preview before a song is picked', async () => {
    const s = await open();
    expect(s.r.fold()!.some((p) => p.classList.contains('ppp-release-preview'))).toBe(false);
  });

  it('a release link shows its cover and its songs with their artwork', async () => {
    const s = setup({ url: '/radio?release=' + REL });
    s.world.art.set(315, 'data:image/jpeg;base64,BBBB');
    await s.ready();
    const card = s.r.banner()[0];
    expect(card.querySelector('.is-cover img')!.getAttribute('src')).toBe('data:image/jpeg;base64,BBBB');
    expect([...card.querySelectorAll('.ppp-rel-songs li')].map((li) => li.textContent)).toEqual(['Entertainment', '2Russian Rampage']);
    expect(card.querySelector('.ppp-release-hear')).toBeNull();                  // listeners hear songs by playing them
  });
});

describe('buying a priced release', () => {
  const LINK = { url: '/radio?release=' + REL, sales: true, price: '2000000' };

  it('shows the price and who is paid, and never offers a free add', async () => {
    const s = setup(LINK); await s.ready();
    const t = s.text(s.r.banner());
    expect(t).toContain('2 STX');
    expect(t).toMatch(/You pay jim\.btc directly: Xtrata takes nothing, never holds the money and cannot refund it/);
    expect(t).toContain('Buy · 2 STX');
    expect(t).not.toContain('Add to my player');
  });

  it('with a wallet connected: Buy opens the order and asks the wallet for exactly that payment; the album arrives when it confirms', async () => {
    const s = setup({ ...LINK, main: ME }); await s.ready();
    s.world.chain = 'pending';
    s.press(s.r.banner(), /Buy · 2 STX/); await flush(); await flush();
    expect(s.world.paid).toEqual([[ARTIST, 2_000_000n, 'buy aaaaaaaaaaaaaaaa']]);
    expect(s.text(s.r.banner())).toMatch(/Payment sent ✓ Waiting for it to confirm/);
    expect(s.r.albums()).toHaveLength(0);                                       // not in the player until the chain says so
    s.world.chain = 'success';
    s.press(s.r.banner(), /Check now/); await flush(); await flush();
    expect(s.text(s.r.banner())).toContain('In your player ✓');
    expect(s.r.albums().map((a) => a.id)).toEqual([REL]);
    expect(s.world.paid).toHaveLength(1);                                       // paid once
  });

  it('a cancelled payment sends nothing and can be made again; the order is kept', async () => {
    const s = setup({ ...LINK, main: ME }); await s.ready();
    s.world.payFails = 'User cancelled';
    s.press(s.r.banner(), /Buy · 2 STX/); await flush(); await flush();
    expect(s.text(s.r.banner())).toContain('Payment cancelled. Nothing was sent.');
    expect(s.world.paid).toHaveLength(0);
    s.world.payFails = '';
    s.press(s.r.banner(), /Pay 2 STX from my wallet/); await flush();
    expect(s.world.paid).toHaveLength(1);
  });

  it('without a wallet connected: shows the amount, the address and the memo to pay from any wallet, and a check button', async () => {
    const s = setup(LINK); await s.ready();
    s.press(s.r.banner(), /Buy · 2 STX/); await flush(); await flush();
    const t = s.text(s.r.banner());
    expect(t).toContain(ARTIST);
    expect(t).toContain('buy aaaaaaaaaaaaaaaa');
    expect(t).toMatch(/The memo is what ties the payment to your player/);
    expect(s.world.paid).toHaveLength(0);
    s.press(s.r.banner(), /I have paid: check/); await flush(); await flush();
    expect(s.text(s.r.banner())).toContain('No payment found yet');
    s.world.chain = 'success';
    s.press(s.r.banner(), /I have paid: check/); await flush(); await flush();
    expect(s.text(s.r.banner())).toContain('In your player ✓');
  });

  it('an order survives a reload, and a payment that failed is offered again', async () => {
    const s = setup({ ...LINK, main: ME }); await s.ready();
    s.world.chain = 'pending';
    s.press(s.r.banner(), /Buy · 2 STX/); await flush(); await flush();
    const kept = JSON.parse(s.store.get('xtrata.radio.releases.orders.v1:' + ME)!);
    expect(kept[REL]).toMatchObject({ order: 'aaaaaaaaaaaaaaaa', txid: '0x' + 'e'.repeat(64) });
    s.world.chain = 'bad';
    s.press(s.r.banner(), /Check now/); await flush(); await flush();
    const t = s.text(s.r.banner());
    expect(t).toContain('That payment did not go through');
    expect(t).toContain('Pay 2 STX from my wallet');
  });

  it('says buying is paused when sales are off, and offers nothing to pay', async () => {
    const s = setup({ ...LINK, sales: false }); await s.ready();
    const t = s.text(s.r.banner());
    expect(t).toContain('Buying is paused right now.');
    expect(t).not.toContain('Buy ·');
  });
});

describe('an artist’s ways to distribute a release', () => {
  const rowButtons = (parts: HTMLElement[] | null) => (parts ?? []).filter((p) => p.classList.contains('ppp-release-row')).flatMap((p) => [...p.querySelectorAll('button')].map((b) => b.textContent));

  it('offers only what is open: link always; price with sales; copies with copies', async () => {
    const none = setup({ main: ARTIST, made: true }); await none.ready(); none.r.fold(); await flush();
    expect(rowButtons(none.r.fold())).toEqual(['Copy link']);
    const all = setup({ main: ARTIST, made: true, sales: true, copies: true }); await all.ready(); all.r.fold(); await flush();
    expect(rowButtons(all.r.fold())).toEqual(['Copy link', 'Price', 'Send copies']);
  });

  it('sets a price with one signature, and shows it with the number sold', async () => {
    const s = setup({ main: ARTIST, made: true, sales: true }); await s.ready(); s.r.fold(); await flush();
    s.press(s.r.fold(), /^Price$/);
    let parts = s.r.fold()!;
    expect(s.text(parts)).toMatch(/straight to this wallet\. Xtrata takes nothing, never holds the money and cannot refund a sale/);
    const input = parts.flatMap((p) => [...p.querySelectorAll('input')]).find((i) => i.getAttribute('aria-label') === 'Price in STX')!;
    input.value = 'lots';
    s.press(parts, /Sign this price/); await flush();
    expect(s.text(s.r.fold())).toContain('A price is 0 (free), or 0.1 to 1,000 STX.');
    expect(s.deps.sign).not.toHaveBeenCalled();
    input.value = '2.5';
    s.press(s.r.fold(), /Sign this price/); await flush(); await flush();
    const sent = s.world.posts.find(([u]) => u === '/radio/release/price')![1];
    expect(sent.request).toMatchObject({ artist: ARTIST, release: REL, price: '2500000' });
    s.r.fold(); await flush();
    expect(s.text(s.r.fold())).toMatch(/2\.5 STX · 0 sold/);
  });

  it('opens the copies form for that release', async () => {
    const s = setup({ main: ARTIST, made: true, copies: true }); await s.ready(); s.r.fold(); await flush();
    s.press(s.r.fold(), /Send copies/);
    expect(s.text(s.r.fold())).toContain('COPIES FORM ' + REL);
    s.press(s.r.fold(), /Send copies/);
    expect(s.text(s.r.fold())).not.toContain('COPIES FORM');
  });
});
