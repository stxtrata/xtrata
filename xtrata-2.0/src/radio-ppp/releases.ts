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
import { releaseData, type ShelfAction } from '../lib/music-releases/release';

export interface ReleaseView extends PlayerView { artist: string; added: number }
export interface ShelfItem extends ReleaseView { hidden: boolean }
export interface ReleasesDeps {
  json(url: string, init?: RequestInit): Promise<any>;
  /** The connected Stacks wallet, if any. */
  main(): string | undefined;
  /** SIP-018 signature from the connected wallet (one popup). */
  sign(main: string, data: ReturnType<typeof releaseData>): Promise<string>;
  /** The open player signs a shelf request in the wallet box (no panel). Rejects when the player is locked. */
  signShelf(action: ShelfAction, release?: string): Promise<{ request: unknown; signature: string }>;
  /** The player itself (the passkey's own wallet), and whether it is unlocked now. */
  player(): { address?: string; unlocked: boolean };
  /** Start playing this album in the player (with the player's own plays). */
  open(album: PlayerView): void;
  who(address?: string): string;
  changed(): void;
  store: { get(key: string): string | null; set(key: string, value: string | null): void };
  now(): number;
}

const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
const post = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const songsLine = (p: PlayerView) => { const n = listedTracks(p).length; return `${n} ${n === 1 ? 'song' : 'songs'}`; };
const isView = (v: any): v is ReleaseView => !!v && isPlayerId(v.id) && typeof v.title === 'string' && Array.isArray(v.tracks) && v.tracks.length > 0 && typeof v.artist === 'string';

export function createReleases(deps: ReleasesDeps) {
  let enabled: boolean | null = null; // null: not known yet
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
      return true;
    } catch (e) {
      if (action !== 'list') note = (e as Error).message || 'That did not work. Try again.';
      return false;
    } finally { shelfBusy = false; deps.changed(); }
  }

  /** Called on every render: learns whether releases are open, reads the release in the link, and the player's shelf. */
  function sync() {
    if (!asked) {
      asked = true;
      deps.json('/radio/release/config').then((r) => { enabled = r?.enabled === true; }, () => { enabled = false; asked = false; }).finally(deps.changed);
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
  }

  /** The albums this player has added and not hidden, to show with the albums a player comes loaded with. */
  const albums = (): PlayerView[] => (enabled ? shelfNow().filter((a) => !a.hidden) : []);

  /** The release a link points at: what it is, and one button. Empty when there is none, or it was put away. */
  function banner(): HTMLElement[] {
    if (!enabled || !incoming || incoming.dismissed) return [];
    if (!incoming.view) return incoming.error ? [el('p', `♫ ${incoming.error}`, 'ppp-warn')] : [el('p', '♫ Opening this release…', 'ppp-mute')];
    const v = incoming.view;
    const box = el('div', '', 'ppp-release-in');
    const head = el('p', '', 'ppp-release-in__h');
    head.append(el('b', v.title), el('span', `${v.subtitle || deps.who(v.artist)} · ${songsLine(v)}`));
    box.append(head);
    box.append(el('p', `Released by ${deps.who(v.artist)}. ${v.added === 1 ? '1 player has' : `${v.added.toLocaleString()} players have`} added it.`, 'ppp-mute'));
    const p = deps.player();
    const have = shelfNow().find((a) => a.id === v.id);
    const row = el('div', '', 'ppp-award__row');
    if (have) {
      box.append(el('p', 'In your player ✓ It stays there until you hide or remove it.', 'ppp-ok'));
      row.append(button('Play it', () => deps.open(v), 'primary'));
    } else if (!p.address) box.append(el('p', 'Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.', 'ppp-mute'));
    else if (!p.unlocked) box.append(el('p', 'Unlock your player to add this album to it.', 'ppp-mute'));
    else {
      box.append(el('p', 'Add it and it stays in your player. It plays with your own plays, and every play pays the artist.', 'ppp-mute'));
      const add = button('Add to my player', () => { void act('add', v.id).then((ok) => { if (ok && incoming?.view) incoming.view = { ...incoming.view, added: incoming.view.added + 1 }; }); }, 'primary');
      add.disabled = shelfBusy;
      row.append(add);
    }
    row.append(button('Not now', () => { if (incoming) incoming.dismissed = true; deps.changed(); }, 'quiet'));
    box.append(row);
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
      picked = []; titleIn.value = ''; coverIn.value = '';
      loadMade(main, true);
    } catch (e) { note = (e as Error).message || 'Not released.'; }
    finally { working = ''; deps.changed(); }
  }

  /** The "Release music" section. Null unless releases are open and a Stacks wallet is connected. */
  function fold(): HTMLElement[] | null {
    const main = deps.main();
    if (!enabled || !main) return null;
    const parts: HTMLElement[] = [el('p', 'Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.', 'ppp-mute')];
    if (mine?.for !== main) { mine = null; picked = []; }
    if (!mine) parts.push(button('Show the songs in my wallet', () => loadSongs(main), 'primary'));
    else if (mine.loading) parts.push(el('p', 'Reading your wallet…', 'ppp-cyan'));
    else if (mine.error) parts.push(el('p', mine.error, 'ppp-warn'), button('Try again', () => loadSongs(main)));
    else if (!mine.songs!.length) parts.push(el('p', 'No songs found in this wallet. A release is made by the wallet that holds its song masters.', 'ppp-mute'));
    else {
      parts.push(el('p', 'Tap your songs in the order they should play. Tap one again to take it out.', 'ppp-cyan'));
      const list = el('div', '', 'ppp-release-songs');
      for (const s of mine.songs!) {
        const at = picked.indexOf(s.id);
        const b = button('', () => { picked = at >= 0 ? picked.filter((x) => x !== s.id) : [...picked, s.id]; deps.changed(); }, 'ppp-release-song' + (at >= 0 ? ' is-on' : ''));
        b.setAttribute('aria-pressed', String(at >= 0));
        b.append(el('i', at >= 0 ? String(at + 1) : '+'), el('b', s.title), el('span', `${s.artist ? s.artist + ' · ' : ''}#${s.id}`));
        list.append(b);
      }
      parts.push(list);
      if (mine.more) parts.push(el('p', 'This wallet holds a lot: only the first few hundred inscriptions were looked through.', 'ppp-mute'));
      if (!byIn.value && picked.length) byIn.value = mine.songs!.find((s) => s.id === picked[0])?.artist || '';
      const kind = picked.length === 0 ? 'release' : picked.length === 1 ? 'single' : picked.length <= 6 ? 'EP' : 'album';
      const go = button(picked.length ? `Sign and release this ${kind} · ${picked.length} ${picked.length === 1 ? 'song' : 'songs'}` : 'Pick at least one song', () => void release(main), 'primary');
      go.disabled = !picked.length || !!working;
      parts.push(titleIn, byIn, coverIn, go);
    }
    if (working) parts.push(el('p', working, 'ppp-cyan'));
    if (note && !incoming) parts.push(el('p', note, /✓/.test(note) ? 'ppp-ok' : 'ppp-warn'));
    loadMade(main);
    if (made?.for === main && made.list.length) {
      parts.push(el('p', 'Your releases', 'ppp-featured__h'));
      for (const r of made.list) {
        const row = el('div', '', 'ppp-release-row');
        const t = el('span', '', 'ppp-release-row__t');
        t.append(el('b', r.title), el('span', `${songsLine(r)} · added by ${r.added.toLocaleString()} ${r.added === 1 ? 'player' : 'players'}`));
        row.append(t, copyButton('release-link:' + r.id, 'Copy link', () => linkOf(r.id), 'tiny', deps.changed));
        parts.push(row);
      }
    }
    return parts;
  }

  return { sync, albums, banner, manage, fold, enabled: () => enabled === true };
}
