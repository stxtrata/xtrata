// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createReleases, type ReleasesDeps } from '../releases';

const ARTIST = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const ME = 'SP1SY289GQAHCH7JZ1MSS5VMPNPH8GEK2DPRKKJ6N';
const REL = '0123456789abcdef';
const view = (over: object = {}) => ({ id: REL, title: 'Reload', subtitle: 'melophonic', tracks: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 319, title: 'Russian Rampage', artist: 'melophonic' }], cover: null, paidOnly: true, artist: ARTIST, added: 3, createdAt: 1, ...over });
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };

function setup(opts: { enabled?: boolean; url?: string; main?: string; player?: { address?: string; unlocked: boolean }; shelf?: any[]; songs?: any } = {}) {
  window.history.replaceState(null, '', opts.url ?? '/radio');
  const store = new Map<string, string>();
  const world = { shelf: opts.shelf ?? [] as any[], player: opts.player ?? { address: ME, unlocked: true }, main: opts.main, posts: [] as [string, any][], signed: [] as [string, string | undefined][], opened: [] as string[], changes: 0, failShelf: false };
  const deps: ReleasesDeps = {
    json: vi.fn(async (url: string, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      if (init?.method === 'POST') world.posts.push([url, body]);
      if (url === '/radio/release/config') return { enabled: opts.enabled ?? true };
      if (url.startsWith('/radio/release/view')) return view();
      if (url.startsWith('/radio/release/songs')) { if (opts.songs instanceof Error) throw opts.songs; return opts.songs ?? { songs: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 319, title: 'Russian Rampage', artist: 'melophonic' }], more: false }; }
      if (url.startsWith('/radio/release/by')) return { releases: world.posts.some(([u]) => u === '/radio/release/create') ? [view({ added: 0 })] : [] };
      if (url === '/radio/release/create') return { id: REL, title: body.definition.title, tracks: body.definition.tracks.length, existing: false };
      if (url === '/radio/release/shelf') {
        if (world.failShelf) throw new Error('Releases are unavailable right now.');
        const { action, release } = body.request;
        if (action === 'add' && !world.shelf.some((a) => a.id === release)) world.shelf.unshift({ ...view(), hidden: false });
        if (action === 'hide' || action === 'show') world.shelf = world.shelf.map((a) => (a.id === release ? { ...a, hidden: action === 'hide' } : a));
        if (action === 'remove') world.shelf = world.shelf.filter((a) => a.id !== release);
        return { albums: world.shelf };
      }
      throw new Error('unexpected ' + url);
    }),
    main: () => world.main,
    sign: vi.fn(async () => 'ab'.repeat(65)),
    signShelf: vi.fn(async (action, release) => { if (!world.player.unlocked) throw new Error('Unlock your player first.'); world.signed.push([action, release]); return { request: { action, release: release ?? '', player: ME, issued: 1 }, signature: 'cd'.repeat(65) }; }),
    player: () => world.player,
    open: (a) => { world.opened.push(a.id); },
    who: (a) => (a === ARTIST ? 'jim.btc' : String(a).slice(0, 6)),
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
beforeEach(() => { window.history.replaceState(null, '', '/radio'); });

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
