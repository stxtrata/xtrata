// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Album First: a listener with an album sees a player (cover, artist, songs, plays left) and none of the wallet,
 * price or "pay" wording. Everything else stays in the panel underneath and opens as a sheet. The controller and
 * the radio are faked; the view must only call the actions the panel already has.
 */
const h = vi.hoisted(() => ({ snap: {} as any, changed: () => {}, calls: [] as [string, unknown[]][], route: null as null | ((url: string, init?: any) => Response | undefined), radio: null as any, idle: false }));
vi.mock('../controller', () => ({
  TOP_UP_PLAYS: [100, 250, 500],
  createPppController: (deps: any) => {
    h.changed = deps.changed;
    const record = (name: string) => (...a: unknown[]) => { h.calls.push([name, a]); return Promise.resolve(); };
    return new Proxy({ snapshot: () => h.snap, refresh: async () => {} }, { get: (t: any, k: string) => t[k] ?? record(k) });
  }
}));
vi.mock('../../lib/wallet/passkey/bridge/client', () => ({ WalletBridgeClient: class {} }));
vi.mock('../../lib/wallet/session', () => ({ createWalletSessionStore: () => ({ load: () => ({ isConnected: false }) }) }));
vi.mock('../../lib/wallet/structured-sign', () => ({ requestStructuredSignature: async () => 'ab'.repeat(65) }));
vi.mock('../../lib/wallet/connect', () => ({ showStxTransfer: vi.fn() }));
vi.mock('../../radio-test-wallet/chain', () => ({ account: vi.fn(), api: vi.fn(), balance: vi.fn(), broadcast: vi.fn(), owner: vi.fn(), transaction: vi.fn(), validateSaved: vi.fn(), verify: vi.fn() }));
vi.mock('../../lib/wallet/installed', () => ({ hasInstalledStacksWallet: () => false }));
vi.mock('../../lib/bns/primary', () => ({ resolvePrimaryBnsName: async () => null }));

const ROOT = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';
const PLAYER = { id: '0123456789abcdef', title: '2007 EP', subtitle: 'melophonic', cover: null, paidOnly: true,
  tracks: [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 319, title: 'Russian Rampage', artist: 'melophonic' }, { id: 3567, title: 'SuperUser', artist: 'melophonic' }, { id: 139, title: 'Subterranean', artist: 'melophonic', hidden: true }] };
const base = {
  step: 'ready', busy: null, message: '', error: '', notice: '', main: undefined, listening: 'SPALBUM2', root: ROOT, slot: 2, linked: undefined, balance: 100_000n,
  balanceState: 'ok', playsLeft: 277, allowance: 900_000n, session: { playsLeft: 277 }, payingOn: true, entries: [], depositPending: false, linkedListening: [], armed: false,
  stuck: 0, queued: 0, solo: true, returnTo: undefined, returnToKind: 'funder', others: [], createdHere: false, walletCannotAlbums: false,
  gate: { enabled: true, here: true, radioUrl: null, walletOrigin: 'https://w.test', limits: { playFee: '300' }, gifts: { enabled: true, turnstileSiteKey: null, admin: false } },
  gift: { player: PLAYER, from: null, source: 'batch', amount: '108000' }, giftPlays: 277, playCost: 350n, giftStop: null, returnPlan: { state: 'none' },
  likeFunds: { address: ROOT, balance: 300_000n, low: false, album: true, pending: false }, albumLock: { locked: true, known: true }
};

async function open(over: object = {}, { page = true }: { page?: boolean } = {}) {
  vi.resetModules();
  if (page) localStorage.setItem('xtrata.radio.albumpage', '1'); // the separate album page is an option, off by default
  document.body.innerHTML = `<header class="topbar"></header><main><section class="album" id="album" hidden></section><section class="albumlist" id="albumList" hidden></section><section class="rx"></section>
    <aside class="side"><div class="sheet-bar"><b id="sheetTitle"></b><button id="sheetClose">×</button></div><div class="sheet-extra" id="sheetExtra"></div>
    <section id="ppp" hidden><div class="ppp-head"><h3><span class="ppp-badge"></span></h3><span class="ppp-state"></span></div><ol class="ppp-steps"></ol><p class="ppp-stage"></p>
    <div class="ppp-switch" hidden></div><div class="ppp-key"></div><p class="ppp-frame-label"></p><div class="ppp-frame"></div><div class="ppp-actions"></div><p class="ppp-msg"></p><p class="ppp-err"></p>
    <details class="ppp-recent"><ol class="ppp-recent-list"></ol><details class="ppp-history"></details></details><details class="ppp-wallets"><dl class="ppp-facts"></dl><div class="ppp-actions ppp-actions2"></div></details>
    <details class="ppp-more"><div class="ppp-body"></div></details><details class="ppp-shelf" hidden><summary></summary><div class="ppp-shelf-body"></div></details><details class="ppp-gifts"><div class="ppp-gift-body"></div></details></section></aside></main>`;
  h.radio = { setGiftPlayer: vi.fn(), setGiftStop: vi.fn(), setGiftLock: vi.fn(), subscribe: vi.fn(), refreshLikes: vi.fn(), forgetWallets: vi.fn(), getState: () => h.idle ? ({ playing: false, nowPlaying: null, heart: { liked: false } }) : ({ playing: true, nowPlaying: { tokenId: 319, title: 'Russian Rampage', artist: 'melophonic' }, heart: { liked: false } }),
    getPosition: () => h.idle ? ({ current: 0, duration: 0 }) : ({ current: 32, duration: 318 }), playToken: vi.fn(), playPause: vi.fn(), next: vi.fn(), prev: vi.fn(), toggleLike: vi.fn() };
  (window as any).XtrataRadio = h.radio;
  h.snap = { ...base, ...over };
  h.calls = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: any) => h.route?.(String(url), init) ?? new Response('{}')));
  await import('../page');
  h.changed();
  return document.getElementById(page ? 'album' : 'albumList')!;
}
const text = (n: Element) => n.textContent ?? '';
const called = (name: string) => h.calls.filter(([n]) => n === name).map(([, a]) => a);
const buttonNamed = (root: Element, name: RegExp) => [...root.querySelectorAll('button')].find((b) => name.test(b.getAttribute('aria-label') || '') || name.test(b.textContent || '')) as HTMLButtonElement;

beforeEach(() => {
  vi.unstubAllGlobals(); localStorage.clear(); h.route = null; h.idle = false;
  delete document.documentElement.dataset.view; delete document.documentElement.dataset.sheet; delete document.documentElement.dataset.asking; delete document.documentElement.dataset.albumlist;
});

describe('an open album is a player', () => {
  it('shows the songs and plays left, with no wallet, price or pay wording', async () => {
    const album = await open();
    expect(document.documentElement.dataset.view).toBe('album');
    expect(album.hidden).toBe(false);
    expect(text(album)).toContain('2007 EP');
    expect([...album.querySelectorAll('.al-tt')].map(text)).toEqual(['Entertainment', 'Russian Rampage', 'SuperUser']); // the hidden track is not listed
    expect(text(album.querySelector('.al-chip')!)).toBe('277 plays left');
    expect(text(album.querySelector('.al-song')!)).toBe('Russian Rampage');
    expect(album.querySelector('.al-track.is-on .al-tt')!.textContent).toBe('Russian Rampage');
    expect(text(album)).not.toMatch(/STX|\bpay|wallet|passkey/i);
  });

  it('its controls are the radio\'s own: a song from the list, play, skip, like', async () => {
    const album = await open();
    buttonNamed(album, /Play SuperUser/).click();
    expect(h.radio.playToken).toHaveBeenCalledWith(3567);
    (album.querySelector('.al-play') as HTMLButtonElement).click();
    expect(h.radio.playPause).toHaveBeenCalled();
    buttonNamed(album, /Next song/).click();
    expect(h.radio.next).toHaveBeenCalled();
    buttonNamed(album, /Like this song/).click();
    expect(h.radio.toggleLike).toHaveBeenCalled();
  });

  it('out of plays: one button adds plays from My player, counted in plays', async () => {
    const album = await open({ giftPlays: 0, balance: 3_000n, step: 'fund' });
    expect(text(album)).toContain("You've played this album out");
    expect(text(album.querySelector('.al-chip')!)).toBe('No plays left');
    const add = buttonNamed(album, /Add 250 plays/);
    expect(add.disabled).toBe(false);
    add.click();
    expect(called('topUpAlbum')).toEqual([[250]]);
    expect((album.querySelector('.al-play') as HTMLButtonElement).disabled).toBe(true);
  });

  it('plays on their way are said as plays, never as a failure', async () => {
    const album = await open({ giftPlays: 0, balance: 0n, step: 'fund', depositPending: true });
    expect(text(album.querySelector('.al-chip')!)).toBe('Plays on their way…');
    expect(text(album)).not.toContain("played this album out");
  });

  it('shows the album cover until a song with its own artwork plays, then that artwork', async () => {
    const withCover = { ...PLAYER, cover: 777 };
    const album = await open({ gift: { player: withCover, from: null, source: 'batch', amount: '108000' } });
    const push = (np: object | null) => {
      const state = { playing: !!np, nowPlaying: np, heart: { liked: false }, albumCover: { url: '/inscription/777', tokenId: 777 } };
      h.radio.getState = () => state; // the radio's resolved album cover is read from here
      for (const [listener] of h.radio.subscribe.mock.calls) listener(state); // the page's title watcher and the album view both listen
    };
    const shown = () => album.querySelector('.al-cover img')!.getAttribute('src');
    push(null);
    expect(shown()).toBe('/inscription/777'); // nothing playing: the album cover
    push({ tokenId: 319, title: 'Russian Rampage', artist: 'melophonic', cover: 'data:image/png;base64,U09ORw==' });
    expect(shown()).toBe('data:image/png;base64,U09ORw=='); // that song's own artwork
    push({ tokenId: 3567, title: 'SuperUser', artist: 'melophonic', cover: '' });
    expect(shown()).toBe('/inscription/777'); // a song with none: the album cover again
  });

  describe('the cover tile and the song thumbnails', () => {
    const withCover = { ...PLAYER, cover: 777 };
    const ART = 'data:image/png;base64,U09ORw==';
    const drive = (album: Element, position = { current: 32, duration: 318 }) => (np: object | null, playing = !!np) => {
      const state = { playing, nowPlaying: np, heart: { liked: false }, albumCover: { url: '/inscription/777', tokenId: 777 } };
      h.radio.getState = () => state;
      h.radio.getPosition = () => position;
      for (const [listener] of h.radio.subscribe.mock.calls) listener(state);
      return album.querySelector('.al-cover')!;
    };
    const opened = () => open({ gift: { player: withCover, from: null, source: 'batch', amount: '108000' } });
    const song = { tokenId: 319, title: 'Russian Rampage', artist: 'melophonic', cover: ART };

    it('keeps the song artwork and title when paused, and only dims it and says so', async () => {
      const album = await opened();
      const set = drive(album);
      let tile = set(song, true);
      expect(tile.classList.contains('is-paused')).toBe(false);
      expect(tile.querySelector('.al-paused')).toBeNull();
      tile = set(song, false);
      expect(tile.classList.contains('is-paused')).toBe(true);
      expect(text(tile.querySelector('.al-paused')!)).toBe('Paused');
      expect(tile.querySelector('img')!.getAttribute('src')).toBe(ART); // still this song's artwork
      expect(text(album.querySelector('.al-song')!)).toBe('Russian Rampage');
      expect(album.querySelector('.al-track.is-on .al-tt')!.textContent).toBe('Russian Rampage');
    });

    it('shows the album cover, not "Paused", for a song that is only waiting to be played', async () => {
      h.idle = true; // the radio has not played anything yet
      const album = await opened();
      const tile = drive(album, { current: 0, duration: 0 })(song, false); // cued: nothing has played yet
      expect(tile.querySelector('img')!.getAttribute('src')).toBe('/inscription/777');
      expect(tile.querySelector('.al-paused')).toBeNull();
      expect(tile.tagName).toBe('DIV'); // nothing to flip to yet
    });

    it('a tap flips the tile between the song artwork and the album cover; the next song starts on its artwork', async () => {
      const album = await opened();
      const set = drive(album);
      let tile = set(song, true);
      expect(tile.tagName).toBe('BUTTON');
      (tile as HTMLButtonElement).click();
      tile = album.querySelector('.al-cover')!;
      expect(tile.querySelector('img')!.getAttribute('src')).toBe('/inscription/777');
      expect(tile.getAttribute('aria-label')).toMatch(/song’s artwork/);
      set(song, true); // a repaint (the radio ticks) keeps the choice
      expect(album.querySelector('.al-cover img')!.getAttribute('src')).toBe('/inscription/777');
      (album.querySelector('.al-cover') as HTMLButtonElement).click();
      expect(album.querySelector('.al-cover img')!.getAttribute('src')).toBe(ART);
      (album.querySelector('.al-cover') as HTMLButtonElement).click(); // flipped to the album again...
      tile = set({ ...song, tokenId: 315, title: 'Entertainment', cover: 'data:image/png;base64,RU5U' }, true); // ...then another song
      expect(tile.querySelector('img')!.getAttribute('src')).toBe('data:image/png;base64,RU5U');
    });

    it('a song with no artwork of its own is not flippable and keeps the album cover', async () => {
      const album = await opened();
      const tile = drive(album)({ ...song, cover: '' }, true);
      expect(tile.tagName).toBe('DIV');
      expect(tile.querySelector('img')!.getAttribute('src')).toBe('/inscription/777');
    });

    it('lists a small thumbnail beside each song, found lazily one song at a time; songs without art show their number', async () => {
      const seen: string[] = [];
      const page = (html: string[]) => {
        const enc = new TextEncoder();
        return new Response(new ReadableStream({ start(c) { html.forEach((s) => c.enqueue(enc.encode(s))); c.close(); } }), { headers: { 'content-type': 'text/html' } });
      };
      h.route = (url) => {
        if (url === '/inscription/315') { seen.push(url); return page(['<html><audio src="data:audio/mpeg;base64,', 'A'.repeat(5000), '"></audio><im', 'g class="c" src="data:image/png;base64,RU5U">']); }
        if (url === '/inscription/3567') { seen.push(url); return page(['<html><audio src="data:audio/mpeg;base64,AAAA"></audio></html>']); }
        return undefined;
      };
      const album = await opened();
      const rows = () => [...album.querySelectorAll('.al-track')];
      expect(rows().map((r) => r.querySelector('.al-th')!.classList.contains('is-blank'))).toEqual([true, true, true]); // nothing known yet
      await vi.waitFor(() => expect(rows()[0].querySelector('.al-th')!.classList.contains('is-blank')).toBe(false), { timeout: 4000 });
      expect(rows()[0].querySelector('.al-th img')!.getAttribute('src')).toBe('data:image/png;base64,RU5U'); // the tag split across pieces was still found
      await vi.waitFor(() => expect(localStorage.getItem('xtrata:al-thumb:v1:3567')).toBe('-'), { timeout: 4000 });
      expect(text(rows()[2].querySelector('.al-n')!)).toBe('3'); // no art: its number
      expect([...new Set(seen)].sort()).toEqual(['/inscription/315', '/inscription/3567']); // the playing song (319) was never fetched
    });
  });

  it('while plays arrive the controls rest (greyed out) and a calm countdown says to wait', async () => {
    const album = await open({ giftPlays: 0, balance: 0n, step: 'fund', depositPending: true, arrival: { since: Date.now() - 20_000, graceMs: 60_000 } });
    expect([...album.querySelectorAll<HTMLButtonElement>('.al-play, .al-icon--big, .al-track')].every((b) => b.disabled)).toBe(true);
    expect(album.querySelector('.al-ctl')!.classList.contains('is-off')).toBe(true);
    const bar = album.querySelector('.ppp-wait')!;
    expect(text(bar)).toMatch(/Your plays are arriving.*usually about a minute · (39|40|41)s/);
    expect(album.querySelector('.ppp-bad')).toBeNull();
    expect(text(album)).not.toMatch(/No plays left|played this album out|artists unpaid/);
  });

  it('once the plays land the controls wake up and the countdown goes', async () => {
    const album = await open();
    expect([...album.querySelectorAll<HTMLButtonElement>('.al-play, .al-track')].some((b) => b.disabled)).toBe(false);
    expect(album.querySelector('.ppp-wait')).toBeNull();
  });

  it('a top-up on its way while plays remain does not lock the player', async () => {
    const album = await open({ depositPending: true, arrival: { since: Date.now(), graceMs: 60_000 } });
    expect((album.querySelector('.al-play') as HTMLButtonElement).disabled).toBe(false);
  });

  it('More holds everything else: add plays, My music, the radio, sending music, this device', async () => {
    const album = await open();
    buttonNamed(album, /^More/).click();
    expect(document.documentElement.dataset.sheet).toBe('more');
    const sheet = album.querySelector('.al-sheet')!;
    expect([...sheet.querySelectorAll('.al-topup')].map(text)).toEqual(['+100', '+250', '+500']);
    expect(text(sheet)).toContain('Moved from My player · 831 plays there.');
    buttonNamed(sheet, /This device/).click();
    expect(document.documentElement.dataset.sheet).toBe('device');
    expect((document.querySelector('.ppp-wallets') as HTMLDetailsElement).open).toBe(true);
    expect(text(document.getElementById('sheetTitle')!)).toBe('This device');
    (document.getElementById('sheetClose') as HTMLButtonElement).click();
    expect(document.documentElement.dataset.sheet).toBeUndefined();
    buttonNamed(album, /^More/).click();
    buttonNamed(album.querySelector('.al-sheet')!, /Xtrata Radio/).click();
    expect(called('openAlbum')).toEqual([[0]]);
  });

  it('My music opens the albums with the radio above them', async () => {
    const album = await open();
    buttonNamed(album, /My music/).click();
    expect(document.documentElement.dataset.sheet).toBe('music');
    expect(text(document.getElementById('sheetExtra')!)).toContain('Xtrata Radio');
  });
});

describe('an album arriving by link', () => {
  const linkWith = (status = 'live') => {
    localStorage.setItem('xtrata.radio.gift.incoming.v1', JSON.stringify({ code: 'ABCDEFGHJKMNPQRSTVWXYZ', at: Date.now() }));
    h.route = (url) => (url.endsWith('/radio/gift/status') ? new Response(JSON.stringify({ status, amount: '108000', source: 'batch', from: null, label: '', expires: 0, player: PLAYER })) : undefined);
  };

  it('a new listener sees the album and one button; the button starts the existing setup', async () => {
    linkWith();
    const album = await open({ step: 'intro', listening: undefined, root: undefined, slot: 0, gift: null, balance: undefined, giftPlays: 0 });
    await vi.waitFor(() => expect(text(album)).toContain('sent you an album'));
    expect(text(album)).toContain('Entertainment · Russian Rampage · SuperUser');
    expect(text(album.querySelector('.al-chip')!)).toBe('3 songs · 300 plays');
    expect(text(album)).not.toMatch(/STX|\bpay|wallet/i);
    expect(text(document.querySelector('.ppp-key')!)).not.toContain('sent you'); // said once, in the album view
    buttonNamed(album, /Open album/).click();
    expect(called('create')).toHaveLength(1);
    buttonNamed(album, /used Xtrata Music here before/).click();
    expect(called('unlock')).toEqual([[true]]);
  });

  it('an already-linked, empty wallet claiming an album reads as waiting, never as out of plays', async () => {
    linkWith();
    h.route = (url) => (url.endsWith('/radio/gift/status') ? new Response(JSON.stringify({ status: 'live', amount: '108000', source: 'batch', from: null, label: '', expires: 0, player: PLAYER })) : url.includes('/radio/gift/slots') ? new Response(JSON.stringify({ next: 1 })) : undefined);
    const album = await open({ step: 'fund', slot: 0, gift: null, balance: 0n, giftPlays: 0, linked: 'SP1FVCANW8KX51C70JJAFTES86SR48CPP6F2ANQKP', createdHere: false,
      entries: [{ kind: 'play', status: 'confirmed', amount: '350', created: Date.now(), song: 7, txid: '0x1' }] });
    await vi.waitFor(() => expect(text(album)).toMatch(/Still sending your gift|Sending your album/));
    expect(text(album)).not.toMatch(/No plays left|played this album out|Out of funds|Add funds|artists unpaid/);
    expect(album.querySelector('.ppp-bad')).toBeNull();
  });

  it('while the wallet box asks for a tap, the view points to it and the box opens as a sheet', async () => {
    linkWith();
    const album = await open({ step: 'intro', listening: undefined, root: undefined, slot: 0, gift: null, balance: undefined, giftPlays: 0, armed: true, busy: 'Confirm in the listening wallet…' });
    await vi.waitFor(() => expect(text(album)).toContain('Continue in the box below.'));
    expect(document.documentElement.dataset.asking).toBe('1');
    expect(buttonNamed(album, /Open album/)).toBeUndefined();
  });

  it('a used link is not an album to open: the ordinary panel says so', async () => {
    linkWith('claimed');
    await open({ step: 'intro', listening: undefined, root: undefined, slot: 0, gift: null, balance: undefined, giftPlays: 0 });
    await vi.waitFor(() => expect(text(document.querySelector('.ppp-key')!)).toContain('already been used'));
    expect(document.documentElement.dataset.view).toBeUndefined();
  });
});

describe('coming back to an album', () => {
  it('a locked page opens on the album this device had open, and goes straight back into it once unlocked', async () => {
    await open(); // an open album is remembered on this device
    expect(JSON.parse(localStorage.getItem('xtrata.radio.album.last.v1')!)).toMatchObject({ root: ROOT, slot: 2, player: { id: PLAYER.id } });
    const album = await open({ step: 'locked', listening: undefined, root: undefined, slot: 0, gift: null, balance: undefined, giftPlays: 0 });
    expect(text(album)).toContain('2007 EP');
    buttonNamed(album, /Continue listening/).click();
    expect(called('unlock')).toEqual([[]]);
    h.snap = { ...h.snap, step: 'ready', root: ROOT, slot: 0, listening: 'SPROOT', balance: 0n };
    h.changed();
    expect(called('openAlbum')).toEqual([[2]]);
  });

  it('another passkey opens its own player, not this album', async () => {
    await open();
    const album = await open({ step: 'locked', listening: undefined, root: undefined, slot: 0, gift: null, balance: undefined, giftPlays: 0 });
    buttonNamed(album, /Continue listening/).click();
    h.snap = { ...h.snap, step: 'ready', root: 'SPSOMEONEELSE', slot: 0, listening: 'SPSOMEONEELSE', balance: 0n };
    h.changed();
    expect(called('openAlbum')).toEqual([]);
  });

  it('with no album the page is the ordinary radio', async () => {
    const album = await open({ slot: 0, gift: null, giftPlays: 0 });
    expect(document.documentElement.dataset.view).toBeUndefined();
    expect(album.hidden).toBe(true);
  });
});

describe('an album opens inside the normal player (the separate page is off)', () => {
  const html = document.documentElement;

  it('keeps the page ordinary: no album page, the song list stands in for Your Station', async () => {
    const list = await open({}, { page: false });
    expect(html.dataset.view).toBeUndefined(); // the radio and the panel stay on screen
    expect(document.getElementById('album')!.hidden).toBe(true);
    expect(list.hidden).toBe(false);
    expect(html.dataset.albumlist).toBe('1'); // CSS hides #likesBox while this is set
    expect([...list.querySelectorAll('.al-tt')].map(text)).toEqual(['Entertainment', 'Russian Rampage', 'SuperUser']); // the hidden track is not listed
    expect(list.querySelectorAll('.al-th').length).toBe(3);
    expect(text(list.querySelector('.al-listhead')!)).toContain('2007 EP');
    expect(text(list.querySelector('.al-chip')!)).toBe('277 plays left');
    expect(list.querySelector('.al-cover, .al-play, .al-more')).toBeNull(); // the radio beside it has the cover and the controls
    expect(list.querySelector('.al-track.is-on .al-tt')!.textContent).toBe('Russian Rampage');
  });

  it('a song in the list plays through the radio', async () => {
    const list = await open({}, { page: false });
    buttonNamed(list, /Play SuperUser/).click();
    expect(h.radio.playToken).toHaveBeenCalledWith(3567);
  });

  it('the list rests while plays are on their way and shows the album’s plays left', async () => {
    const list = await open({ giftPlays: 0, balance: 0n, step: 'fund', depositPending: true }, { page: false });
    expect(text(list.querySelector('.al-chip')!)).toBe('Plays on their way…');
    expect([...list.querySelectorAll<HTMLButtonElement>('.al-track')].every((b) => b.disabled)).toBe(true);
  });

  it('with no album open the list goes away and Your Station is back', async () => {
    const list = await open({}, { page: false });
    expect(html.dataset.albumlist).toBe('1');
    h.snap = { ...h.snap, slot: 0, gift: null, giftPlays: 0 };
    h.changed();
    expect(list.hidden).toBe(true);
    expect(html.dataset.albumlist).toBeUndefined();
  });

  it('a gift link shows its ordinary banner (not the album page) when the page is off', async () => {
    const list = await open({ slot: 0, gift: null, giftPlays: 0, step: 'intro' }, { page: false });
    expect(html.dataset.view).toBeUndefined();
    expect(list.hidden).toBe(true);
  });
});
