/**
 * Artists release their own music, and listeners keep the releases they add (docs/music/ARTIST-RELEASES.md,
 * stage 1; server: functions/lib/radio-releases.ts).
 *
 *  - Artist: with a Stacks wallet connected that holds songs, "Release music": tap songs in the order they should
 *    play, name it, choose a cover, sign once. The result is a link. No money is involved.
 *  - Listener: a `?release=<id>` link shows the release with "Add to my player". An added album stays added, on any
 *    device, until the listener hides or removes it. It has no plays of its own: it plays with the player's plays.
 *
 * This module holds no money logic. The shelf is the server's, private to the player: every read and change is
 * signed by the player's own key in the wallet box (`signShelf`); what is kept on this device is only a copy for
 * showing the albums before the player is unlocked.
 */
import { copyButton } from './feedback';
import { isPlayerId, listedTracks, playerHash, validatePlayer, type PlayerView } from '../lib/listening-wallet/gift-players';
import { parseStx, priceData, releaseData, stxText, validPrice, type OrderView, type PriceRequest, type ShelfAction } from '../lib/music-releases/release';
import type { Audition } from './audition';

export interface ReleaseView extends PlayerView { artist: string; added: number; /** microSTX; "0" or absent is free */ price?: string; sold?: number }
/** An order being paid, as kept on this device until the album arrives. */
type MyOrder = OrderView & { txid?: string };
export interface ShelfItem extends ReleaseView { hidden: boolean }
export interface ReleasesDeps {
  json(url: string, init?: RequestInit): Promise<any>;
  /** The connected Stacks wallet, if any. */
  main(): string | undefined;
  /** SIP-018 signature from the connected wallet (one popup). */
  sign(main: string, data: ReturnType<typeof releaseData> | ReturnType<typeof priceData>): Promise<string>;
  /** STX transfer from the connected wallet (one popup); resolves with the txid. Used to pay an artist for an album. */
  pay(main: string, recipient: string, amount: bigint, memo: string): Promise<string>;
  /** The form for funding copies of a release with plays included (gifts.ts), when that is open. */
  copies?(main: string, release: { id: string; title: string }): HTMLElement[];
  /** The open player signs a shelf request in the wallet box (no panel). Rejects when the player is locked. */
  signShelf(action: ShelfAction, release?: string): Promise<{ request: unknown; signature: string }>;
  /** The player itself (the passkey's own wallet), and whether it is unlocked now. */
  player(): { address?: string; unlocked: boolean };
  /** Start playing this album in the player (with the player's own plays). */
  open(album: PlayerView): void;
  who(address?: string): string;
  /**
   * Small artwork. `song`: a song's own image, '' when it has none, null when not looked at yet (`ask` starts
   * looking, one song at a time in the background). `cover`: an album cover inscription's image, '' until known.
   */
  art: { song(id: number, ask: boolean): string | null; cover(id: number | null | undefined): string };
  /** Hear one of your own songs before releasing it. Nothing is paid or counted. */
  audition: Audition;
  changed(): void;
  store: { get(key: string): string | null; set(key: string, value: string | null): void };
  now(): number;
}

const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
const post = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const songsLine = (p: PlayerView) => { const n = listedTracks(p).length; return `${n} ${n === 1 ? 'song' : 'songs'}`; };
/** A small square: the image, or what stands in for it (a number, a disc) over the album's cover when there is one. */
function square(url: string, blank: string, under = '', cls = '') {
  const s = el('span', '', 'ppp-rel-art' + (url ? '' : ' is-blank') + (cls ? ' ' + cls : ''));
  const src = url || under;
  if (src) { const img = document.createElement('img'); img.src = src; img.alt = ''; img.decoding = 'async'; s.append(img); }
  if (!url) s.append(el('span', blank));
  return s;
}
const isView = (v: any): v is ReleaseView => !!v && isPlayerId(v.id) && typeof v.title === 'string' && Array.isArray(v.tracks) && v.tracks.length > 0 && typeof v.artist === 'string';

export function createReleases(deps: ReleasesDeps) {
  let enabled: boolean | null = null; // null: not known yet
  let ways = { copies: false, sales: false }; // which ways of distributing a release are open
  let asked = false;
  let working = '';
  let note = '';

  // ---------------------------------------------------------------- a release link
  const fromUrl = (() => { try { const id = new URLSearchParams(location.search).get('release'); return isPlayerId(id) ? id : null; } catch { return null; } })();
  let incoming: { id: string; view?: ReleaseView; error?: string; dismissed?: boolean } | null = fromUrl ? { id: fromUrl } : null;

  // ---------------------------------------------------------------- the shelf
  const shelfKey = (player: string) => 'xtrata.radio.releases.shelf.v1:' + player;
  let shelf: { for: string; albums: ShelfItem[]; fresh: boolean } | null = null;
  let shelfBusy = false;
  let shelfTriedAt = -Infinity;
  const keep = (player: string, albums: unknown, fresh: boolean) => {
    const list = Array.isArray(albums) ? albums.filter(isView).map((a) => ({ ...a, hidden: !!(a as ShelfItem).hidden })) : [];
    shelf = { for: player, albums: list, fresh };
    if (fresh) deps.store.set(shelfKey(player), JSON.stringify(list));
  };
  const kept = (player: string) => { try { keep(player, JSON.parse(deps.store.get(shelfKey(player)) || '[]'), false); } catch { keep(player, [], false); } };
  const shelfNow = (): ShelfItem[] => { const p = deps.player().address; return p && shelf?.for === p ? shelf.albums : []; };

  async function act(action: ShelfAction, release = '') {
    const p = deps.player();
    if (!p.address || !p.unlocked) { note = 'Unlock your player first.'; deps.changed(); return false; }
    if (shelfBusy) return false;
    shelfBusy = true; note = ''; deps.changed();
    try {
      const signed = await deps.signShelf(action, release);
      const r = await deps.json('/radio/release/shelf', post(signed));
      keep(p.address, r?.albums, true);
      if (isOrder(r?.pay)) setOrder(p.address, r.pay); // a priced album: not added, an order to pay its artist instead
      else if (action === 'add') setOrder(p.address, null, release);
      return true;
    } catch (e) {
      if (action !== 'list') note = (e as Error).message || 'That did not work. Try again.';
      return false;
    } finally { shelfBusy = false; deps.changed(); }
  }

  // ---------------------------------------------------------------- buying a priced release
  // The listener pays the ARTIST directly (one transfer whose memo names the order); the server only reads the chain
  // and, once the payment has confirmed, puts the album in the player. Orders are kept on this device until then.
  const ordersKey = (player: string) => 'xtrata.radio.releases.orders.v1:' + player;
  const isOrder = (o: any): o is OrderView => !!o && /^[0-9a-f]{16}$/.test(o.order) && isPlayerId(o.release) && typeof o.to === 'string' && /^\d{1,12}$/.test(o.amount) && typeof o.memo === 'string';
  const orders = (player?: string): Record<string, MyOrder> => {
    if (!player) return {};
    try { const v = JSON.parse(deps.store.get(ordersKey(player)) || '{}'); return v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, o]) => isOrder(o))) as Record<string, MyOrder> : {}; } catch { return {}; }
  };
  function setOrder(player: string, o: MyOrder | null, release = o?.release ?? '') {
    const all = orders(player);
    if (o) all[o.release] = { ...all[o.release]?.order === o.order ? all[o.release] : {}, ...o };
    else delete all[release];
    deps.store.set(ordersKey(player), Object.keys(all).length ? JSON.stringify(all) : null);
  }
  const checking = new Set<string>();
  const checkedAt = new Map<string, number>();
  /** Looks for an order's payment. Paid: the album is in the player, so the shelf is read again. */
  async function check(player: string, o: MyOrder, asked = false) {
    if (checking.has(o.order)) return;
    checking.add(o.order); checkedAt.set(o.order, deps.now());
    if (asked) { note = ''; deps.changed(); }
    try {
      const r = await deps.json('/radio/release/paid', post({ order: o.order, ...(o.txid ? { txid: o.txid } : {}) }));
      if (r?.status === 'paid') {
        setOrder(player, null, o.release);
        if (incoming?.view?.id === o.release) incoming.view = { ...incoming.view, added: incoming.view.added + 1 };
        note = '';
        checking.delete(o.order);
        if (shelf?.for === player) shelf.fresh = false;
        if (deps.player().unlocked) await act('list'); // locked: read on the next unlock
      } else {
        if (isOrder(r)) setOrder(player, { ...o, ...r });
        if (asked && r?.status === 'pending') note = 'No payment found yet. If you have just paid, give it a minute and check again.';
      }
    } catch (e) {
      // A payment that failed or does not match is forgotten here so it can be made again; anything else is tried again.
      if (/did not go through|does not pay this order/.test((e as Error).message || '')) setOrder(player, { ...o, txid: undefined, status: 'pending' });
      if (asked || o.txid) note = (e as Error).message || 'The payment could not be checked right now. Nothing is lost.';
    } finally { checking.delete(o.order); deps.changed(); }
  }
  async function payOrder(main: string, player: string, o: MyOrder) {
    if (working) return;
    working = 'Approve the payment in your wallet…'; note = ''; deps.changed();
    try {
      const txid = await deps.pay(main, o.to, BigInt(o.amount), o.memo);
      const sent: MyOrder = { ...o, txid: txid || undefined, status: 'confirming' };
      setOrder(player, sent);
      working = '';
      void check(player, sent);
    } catch (e) { note = /cancel/i.test((e as Error).message || '') ? 'Payment cancelled. Nothing was sent.' : ((e as Error).message || 'Not paid. Nothing was sent.'); }
    finally { working = ''; deps.changed(); }
  }
  async function buy(v: ReleaseView) {
    const p = deps.player();
    if (!(await act('add', v.id)) || !p.address) return;
    const o = orders(p.address)[v.id], main = deps.main();
    if (o && main) await payOrder(main, p.address, o);
  }

  /** Called on every render: learns whether releases are open, reads the release in the link, and the player's shelf. */
  function sync() {
    if (!asked) {
      asked = true;
      deps.json('/radio/release/config').then((r) => { enabled = r?.enabled === true; ways = { copies: enabled && r?.copies === true, sales: enabled && r?.sales === true }; }, () => { enabled = false; asked = false; }).finally(deps.changed);
    }
    if (!enabled) return;
    if (incoming && !incoming.view && !incoming.error) {
      const mine = incoming;
      mine.error = '';
      deps.json('/radio/release/view?id=' + mine.id).then((v) => { if (isView(v)) { mine.view = v; delete mine.error; } else mine.error = 'This release could not be read.'; },
        (e) => { mine.error = (e as Error).message || 'This release could not be opened right now.'; }).finally(deps.changed);
    }
    const p = deps.player();
    if (!p.address) return;
    if (shelf?.for !== p.address) kept(p.address);
    // The server's copy, once per unlock (and again a minute after a failed try). Signed in the box, no panel.
    if (p.unlocked && !shelf?.fresh && !shelfBusy && deps.now() - shelfTriedAt > 60_000) { shelfTriedAt = deps.now(); void act('list'); }
    // A payment on its way is looked for again every 20 seconds until it confirms.
    for (const o of Object.values(orders(p.address))) {
      if ((o.txid || o.status === 'confirming') && !checking.has(o.order) && deps.now() - (checkedAt.get(o.order) ?? -Infinity) > 20_000) {
        const player = p.address;
        void check(player, o).then(() => { setTimeout(() => deps.changed(), 20_500); });
      }
    }
  }

  /** The albums this player has added and not hidden, to show with the albums a player comes loaded with. */
  const albums = (): PlayerView[] => (enabled ? shelfNow().filter((a) => !a.hidden) : []);

  /** The songs in play order, each with its own artwork, or its number over the album's cover when it has none. */
  function songList(songs: { id: number; title: string }[], cover: string) {
    const ol = el('ol', '', 'ppp-rel-songs');
    songs.forEach((t, n) => {
      const li = el('li');
      li.append(square(deps.art.song(t.id, true) || '', String(n + 1), cover), el('span', t.title));
      ol.append(li);
    });
    return ol;
  }

  /** The release a link points at: what it is, and one button. Empty when there is none, or it was put away. */
  function banner(): HTMLElement[] {
    if (!enabled || !incoming || incoming.dismissed) return [];
    if (!incoming.view) return incoming.error ? [el('p', `♫ ${incoming.error}`, 'ppp-warn')] : [el('p', '♫ Opening this release…', 'ppp-mute')];
    const v = incoming.view;
    const box = el('div', '', 'ppp-release-in');
    const head = el('p', '', 'ppp-release-in__h');
    const price = BigInt(/^\d{1,12}$/.test(v.price ?? '') ? v.price! : '0');
    head.append(el('b', v.title), el('span', `${v.subtitle || deps.who(v.artist)} · ${songsLine(v)}${price > 0n ? ` · ${stxText(price)} STX` : ''}`));
    const tracks = listedTracks(v);
    const cover = deps.art.cover(v.cover) || (v.cover ? '' : tracks[0] ? deps.art.song(tracks[0].id, true) || '' : '');
    const top = el('div', '', 'ppp-rel-top');
    top.append(square(cover, '💿', '', 'is-cover'), head);
    box.append(top, songList(tracks.map((t) => ({ id: t.id, title: t.title || `#${t.id}` })), deps.art.cover(v.cover)));
    box.append(el('p', `Released by ${deps.who(v.artist)}. ${v.added === 1 ? '1 player has' : `${v.added.toLocaleString()} players have`} added it.`, 'ppp-mute'));
    const p = deps.player();
    const have = shelfNow().find((a) => a.id === v.id);
    const row = el('div', '', 'ppp-award__row');
    if (have) {
      box.append(el('p', 'In your player ✓ It stays there until you hide or remove it.', 'ppp-ok'));
      row.append(button('Play it', () => deps.open(v), 'primary'));
    } else if (!p.address) box.append(el('p', 'Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.', 'ppp-mute'));
    else if (!p.unlocked) box.append(el('p', 'Unlock your player to add this album to it.', 'ppp-mute'));
    else if (price > 0n) {
      const o = orders(p.address)[v.id], main = deps.main();
      const cost = `${stxText(o?.amount ?? price)} STX`;
      if (o?.txid || o?.status === 'confirming') {
        box.append(el('p', `Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.`, 'ppp-ok'));
        const again = button('Check now', () => void check(p.address!, o, true)); again.disabled = checking.has(o.order);
        row.append(again);
      } else {
        box.append(el('p', `This album costs ${cost}. You pay ${deps.who(v.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, 'ppp-mute'));
        if (!ways.sales && !o) box.append(el('p', 'Buying is paused right now.', 'ppp-warn'));
        else if (!o) { const b = button(`Buy · ${cost}`, () => void buy(v), 'primary'); b.disabled = shelfBusy || !!working; row.append(b); }
        else {
          if (main) { const b = button(`Pay ${cost} from my wallet`, () => void payOrder(main, p.address!, o), 'primary'); b.disabled = !!working; row.append(b); }
          else box.append(el('p', 'Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:', 'ppp-mute'));
          const how = el('div', '', 'ppp-rel-pay');
          const line = (label: string, value: string, key: string) => { const l = el('p'); l.append(el('span', label), el('code', value), copyButton(`order-${key}:${o.order}`, 'Copy', () => value, 'tiny', deps.changed)); return l; };
          how.append(line('Send', stxText(o.amount) + ' STX', 'amount'), line('To', o.to, 'to'), line('Memo', o.memo, 'memo'));
          box.append(how, el('p', 'The memo is what ties the payment to your player. Without it the album cannot be added.', 'ppp-mute'));
          const paid = button('I have paid: check', () => void check(p.address!, o, true)); paid.disabled = checking.has(o.order);
          row.append(paid);
        }
      }
    } else {
      box.append(el('p', 'Add it and it stays in your player. It plays with your own plays, and every play pays the artist.', 'ppp-mute'));
      const add = button('Add to my player', () => { void act('add', v.id).then((ok) => { if (ok && incoming?.view) incoming.view = { ...incoming.view, added: incoming.view.added + 1 }; }); }, 'primary');
      add.disabled = shelfBusy;
      row.append(add);
    }
    row.append(button('Not now', () => { if (incoming) incoming.dismissed = true; deps.changed(); }, 'quiet'));
    box.append(row);
    if (working) box.append(el('p', working, 'ppp-cyan'));
    if (note) box.append(el('p', note, 'ppp-warn'));
    return [box];
  }

  /** Hide, show and remove, for the albums this player has added. Null when it has none. */
  let manageOpen = false;
  function manage(): HTMLElement | null {
    const list = enabled ? shelfNow() : [];
    if (!list.length) return null;
    const d = el('details', '', 'ppp-release-manage') as HTMLDetailsElement;
    d.open = manageOpen;
    d.ontoggle = () => { manageOpen = d.open; };
    const hidden = list.filter((a) => a.hidden).length;
    d.append(el('summary', `Albums I added (${list.length}${hidden ? `, ${hidden} hidden` : ''})`));
    const unlocked = deps.player().unlocked;
    if (!unlocked) d.append(el('p', 'Unlock your player to hide or remove an album.', 'ppp-mute'));
    for (const a of list) {
      const li = el('div', '', 'ppp-release-row' + (a.hidden ? ' is-hidden' : ''));
      const t = el('span', '', 'ppp-release-row__t');
      t.append(el('b', a.title), el('span', `${a.subtitle || deps.who(a.artist)}${a.hidden ? ' · hidden' : ''}`));
      const hide = button(a.hidden ? 'Show' : 'Hide', () => void act(a.hidden ? 'show' : 'hide', a.id), 'tiny');
      const remove = button('Remove', () => void act('remove', a.id), 'tiny');
      hide.disabled = remove.disabled = !unlocked || shelfBusy;
      li.append(t, hide, remove);
      d.append(li);
    }
    d.append(el('p', 'Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.', 'ppp-mute'));
    if (note && !incoming) d.append(el('p', note, 'ppp-warn'));
    return d;
  }

  // ---------------------------------------------------------------- the artist
  type Song = { id: number; title: string; artist: string };
  let mine: { for: string; songs?: Song[]; more?: boolean; error?: string; loading?: boolean } | null = null;
  let picked: number[] = [];
  let made: { for: string; list: ReleaseView[]; at: number } | null = null;
  const titleIn = el('input') as HTMLInputElement; titleIn.maxLength = 60; titleIn.placeholder = 'Title of the single, EP or album'; titleIn.setAttribute('aria-label', 'Release title');
  const byIn = el('input') as HTMLInputElement; byIn.maxLength = 80; byIn.placeholder = 'Artist name shown under the title'; byIn.setAttribute('aria-label', 'Artist name');
  const coverIn = el('input') as HTMLInputElement; coverIn.inputMode = 'numeric'; coverIn.placeholder = 'Cover: an inscription number (optional; the first song’s artwork if left empty)'; coverIn.setAttribute('aria-label', 'Cover inscription number');
  const priceIn = el('input') as HTMLInputElement; priceIn.inputMode = 'decimal'; priceIn.placeholder = 'Price in STX, e.g. 2 (0 makes it free)'; priceIn.setAttribute('aria-label', 'Price in STX');
  /** The release whose price or copies form is open in "Your releases". */
  let opened: { id: string; what: 'price' | 'copies' } | null = null;
  const toggle = (id: string, what: 'price' | 'copies', price = '') => { opened = opened?.id === id && opened.what === what ? null : { id, what }; if (opened?.what === 'price') priceIn.value = price; note = ''; deps.changed(); };
  async function setPrice(main: string, r: ReleaseView) {
    if (working) return;
    const price = parseStx(priceIn.value);
    if (price === null || !validPrice(price)) { note = 'A price is 0 (free), or 0.1 to 1,000 STX.'; deps.changed(); return; }
    working = 'Sign in your wallet (nothing is spent)…'; note = ''; deps.changed();
    try {
      const request: PriceRequest = { artist: main, release: r.id, price: price.toString(), issued: deps.now() };
      const signature = await deps.sign(main, priceData(request));
      working = 'Saving the price…'; deps.changed();
      await deps.json('/radio/release/price', post({ request, signature }));
      note = price > 0n ? `Price set ✓ “${r.title}” now costs ${stxText(price)} STX, paid straight to this wallet.` : `“${r.title}” is free again ✓`;
      opened = null;
      loadMade(main, true);
    } catch (e) { note = (e as Error).message || 'The price was not changed.'; }
    finally { working = ''; deps.changed(); }
  }
  const linkOf = (id: string) => `${location.origin}${location.pathname}?release=${id}`;

  function loadSongs(main: string) {
    mine = { for: main, loading: true }; picked = []; deps.changed();
    deps.json('/radio/release/songs?wallet=' + encodeURIComponent(main)).then(
      (r) => { const songs = Array.isArray(r?.songs) ? r.songs.filter((x: any) => Number.isSafeInteger(x?.id) && typeof x.title === 'string') : null; mine = songs ? { for: main, songs, more: !!r.more } : { for: main, error: 'Your songs could not be read right now.' }; },
      (e) => { mine = { for: main, error: (e as Error).message || 'Your songs could not be read right now.' }; }).finally(deps.changed);
  }
  function loadMade(main: string, force = false) {
    if (!force && made?.for === main && deps.now() - made.at < 60_000) return;
    made = { for: main, list: made?.for === main ? made.list : [], at: deps.now() };
    deps.json('/radio/release/by?artist=' + encodeURIComponent(main)).then((r) => { if (Array.isArray(r?.releases)) made = { for: main, list: r.releases.filter(isView), at: deps.now() }; }, () => { /* tried again later */ }).finally(deps.changed);
  }
  async function release(main: string) {
    if (working) return;
    working = 'Checking your release…'; note = ''; deps.changed();
    try {
      const cover = coverIn.value.trim().replace(/^#/, '');
      const definition = validatePlayer({ title: titleIn.value.trim(), subtitle: byIn.value.trim(), tracks: [...picked], cover: cover ? Number(cover) : null });
      working = 'Sign in your wallet (nothing is spent)…'; deps.changed();
      const request = { artist: main, hash: playerHash(definition), issued: deps.now() };
      const signature = await deps.sign(main, releaseData(request));
      working = 'Releasing…'; deps.changed();
      const r = await deps.json('/radio/release/create', post({ definition, request, signature }));
      note = `${r.existing ? 'Already released' : 'Released'} ✓ “${r.title}”. Its link is below.`;
      picked = []; titleIn.value = ''; coverIn.value = ''; deps.audition.stop();
      loadMade(main, true);
    } catch (e) { note = (e as Error).message || 'Not released.'; }
    finally { working = ''; deps.changed(); }
  }

  /** Stop a song that is being listened to, after the current drawing is done (stopping redraws). */
  const later = () => { queueMicrotask(() => deps.audition.stop()); };
  /** The release as listeners will see it: cover, title, and each song with its artwork or its placeholder. */
  const heard = new Set<number>();
  function preview(songs: Song[]) {
    const chosen = picked.map((id) => songs.find((s) => s.id === id)).filter((s): s is Song => !!s);
    const raw = coverIn.value.trim().replace(/^#/, '');
    const coverId = /^\d{1,9}$/.test(raw) ? Number(raw) : null;
    const coverUrl = deps.art.cover(coverId);
    const first = chosen[0] ? deps.art.song(chosen[0].id, true) : null;
    const box = el('div', '', 'ppp-release-preview');
    box.append(el('p', 'How it will look', 'ppp-featured__h'));
    const head = el('p', '', 'ppp-release-in__h');
    const t = el('b', titleIn.value.trim() || 'Untitled');
    const by = el('span', `${byIn.value.trim() || deps.who(deps.main())} · ${chosen.length} ${chosen.length === 1 ? 'song' : 'songs'}`);
    head.append(t, by);
    const top = el('div', '', 'ppp-rel-top');
    top.append(square(coverId ? coverUrl : first || '', '💿', '', 'is-cover'), head);
    box.append(top, songList(chosen.map((s) => ({ id: s.id, title: s.title })), coverUrl));
    const missing = chosen.filter((s) => deps.art.song(s.id, true) === null).length;
    const lines: string[] = [];
    if (coverId && !coverUrl) lines.push(`Looking for an image in #${coverId}… If none appears, that inscription is not a picture.`);
    if (missing) lines.push(`Finding artwork for ${missing} ${missing === 1 ? 'song' : 'songs'}…`);
    if (!missing && chosen.some((s) => deps.art.song(s.id, false) === '')) lines.push(`A numbered square is a song with no artwork of its own${coverUrl ? ': it shows the cover, dimmed' : ''}.`);
    for (const l of lines) box.append(el('p', l, 'ppp-mute'));
    // Typing redraws these two lines only (the whole section is not rebuilt on every key).
    titleIn.oninput = () => { t.textContent = titleIn.value.trim() || 'Untitled'; };
    byIn.oninput = () => { by.textContent = `${byIn.value.trim() || deps.who(deps.main())} · ${chosen.length} ${chosen.length === 1 ? 'song' : 'songs'}`; };
    coverIn.onchange = () => deps.changed();
    return box;
  }

  /** The "Release music" section. Null unless releases are open and a Stacks wallet is connected. */
  function fold(): HTMLElement[] | null {
    const main = deps.main();
    if (!enabled || !main) { if (mine) { mine = null; picked = []; later(); } return null; }
    const parts: HTMLElement[] = [el('p', 'Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.', 'ppp-mute')];
    if (mine && mine.for !== main) { mine = null; picked = []; heard.clear(); later(); }
    if (!mine) parts.push(button('Show the songs in my wallet', () => loadSongs(main), 'primary'));
    else if (mine.loading) parts.push(el('p', 'Reading your wallet…', 'ppp-cyan'));
    else if (mine.error) parts.push(el('p', mine.error, 'ppp-warn'), button('Try again', () => loadSongs(main)));
    else if (!mine.songs!.length) parts.push(el('p', 'No songs found in this wallet. A release is made by the wallet that holds its song masters.', 'ppp-mute'));
    else {
      parts.push(el('p', 'Tap your songs in the order they should play. Tap one again to take it out.', 'ppp-cyan'));
      const list = el('div', '', 'ppp-release-songs');
      for (const s of mine.songs!) {
        const at = picked.indexOf(s.id);
        const row = el('div', '', 'ppp-release-song' + (at >= 0 ? ' is-on' : ''));
        const hear = deps.audition.state(s.id);
        if (hear !== 'idle') heard.add(s.id);
        const play = button(hear === 'playing' ? '❚❚' : hear === 'loading' ? '…' : '▶', () => deps.audition.toggle(s.id), 'ppp-release-hear' + (hear === 'playing' ? ' is-on' : ''));
        play.setAttribute('aria-label', hear === 'playing' ? `Stop ${s.title}` : `Listen to ${s.title}`);
        play.title = hear === 'error' ? 'This song could not be played just now' : hear === 'playing' ? 'Stop' : 'Listen (free: it is your own song)';
        // Artwork is looked up for the songs you pick or listen to (a song is a big file); others show it if already known.
        const art = deps.art.song(s.id, at >= 0 || heard.has(s.id));
        const pick = button('', () => { picked = at >= 0 ? picked.filter((x) => x !== s.id) : [...picked, s.id]; deps.changed(); }, 'ppp-release-pick');
        pick.setAttribute('aria-pressed', String(at >= 0));
        pick.append(el('i', at >= 0 ? String(at + 1) : '+'), el('b', s.title), el('span', hear === 'error' ? 'could not play' : `${s.artist ? s.artist + ' · ' : ''}#${s.id}`, hear === 'error' ? 'ppp-warn' : ''));
        row.append(play, square(art || '', art === '' ? '♪' : '', ''), pick);
        list.append(row);
      }
      parts.push(list);
      if (mine.more) parts.push(el('p', 'This wallet holds a lot: only the first few hundred inscriptions were looked through.', 'ppp-mute'));
      if (!byIn.value && picked.length) byIn.value = mine.songs!.find((s) => s.id === picked[0])?.artist || '';
      const kind = picked.length === 0 ? 'release' : picked.length === 1 ? 'single' : picked.length <= 6 ? 'EP' : 'album';
      const go = button(picked.length ? `Sign and release this ${kind} · ${picked.length} ${picked.length === 1 ? 'song' : 'songs'}` : 'Pick at least one song', () => void release(main), 'primary');
      go.disabled = !picked.length || !!working;
      parts.push(titleIn, byIn, coverIn);
      if (picked.length) parts.push(preview(mine.songs!));
      parts.push(go);
    }
    if (working) parts.push(el('p', working, 'ppp-cyan'));
    if (note && !incoming) parts.push(el('p', note, /✓/.test(note) ? 'ppp-ok' : 'ppp-warn'));
    loadMade(main);
    if (made?.for === main && made.list.length) {
      parts.push(el('p', 'Your releases', 'ppp-featured__h'));
      for (const r of made.list) {
        const row = el('div', '', 'ppp-release-row');
        const t = el('span', '', 'ppp-release-row__t');
        const price = BigInt(/^\d{1,12}$/.test(r.price ?? '') ? r.price! : '0');
        const money = price > 0n ? ` · ${stxText(price)} STX · ${(r.sold ?? 0).toLocaleString()} sold` : ways.sales ? ' · free' : '';
        t.append(el('b', r.title), el('span', `${songsLine(r)} · added by ${r.added.toLocaleString()} ${r.added === 1 ? 'player' : 'players'}${money}`));
        row.append(t, copyButton('release-link:' + r.id, 'Copy link', () => linkOf(r.id), 'tiny', deps.changed));
        if (ways.sales) { const b = button('Price', () => toggle(r.id, 'price', price > 0n ? stxText(price) : ''), 'tiny'); b.setAttribute('aria-expanded', String(opened?.id === r.id && opened.what === 'price')); row.append(b); }
        if (ways.copies && deps.copies) { const b = button('Send copies', () => toggle(r.id, 'copies'), 'tiny'); b.setAttribute('aria-expanded', String(opened?.id === r.id && opened.what === 'copies')); row.append(b); }
        parts.push(row);
        if (opened?.id !== r.id) continue;
        const box = el('div', '', 'ppp-release-way');
        if (opened.what === 'price' && ways.sales) {
          const go = button('Sign this price', () => void setPrice(main, r), 'primary'); go.disabled = !!working;
          box.append(
            el('p', 'Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.', 'ppp-mute'),
            priceIn, go);
        } else if (opened.what === 'copies' && ways.copies && deps.copies) box.append(...deps.copies(main, { id: r.id, title: r.title }));
        if (box.childNodes.length) parts.push(box);
      }
    }
    return parts;
  }

  /** True while a release card, or the artist's picker, is on screen: found artwork should be drawn. */
  const wantsArt = () => enabled === true && ((!!incoming?.view && !incoming.dismissed) || (!!mine?.songs && !!deps.main()));
  return { sync, albums, banner, manage, fold, wantsArt, enabled: () => enabled === true };
}
