/**
 * "My albums" on the radio page: every album in the listener's numbered wallets (server: GET /radio/gift/shelf).
 * Search, sort, pin and recent all work on the device, over as many albums as the listener holds. Choosing one opens its
 * wallet; the radio then plays that album as the current looping playlist. Pins and recents are public, per-device
 * conveniences kept in local storage.
 */
import { SHELF_SORTS, shelfItems, trimRecents, visibleAlbums, type ShelfItem, type ShelfSort } from '../lib/listening-wallet/shelf';
import type { Snapshot } from './controller';

export interface ShelfDeps {
  json(url: string): Promise<any>;
  /** Open the album's wallet (0 = back to the listener's own). */
  open(slot: number): void;
  store: { get(key: string): string | null; set(key: string, value: string | null): void };
  now(): number;
  changed(): void;
}

const PAGE = 12;
const MAX_ALBUMS = 5000;
const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };

export function createShelf(deps: ShelfDeps) {
  let root: string | undefined;
  let items: ShelfItem[] = [];
  let total = 0;
  let loading = false;
  let failed = false;
  let loadedAt = -Infinity;
  let query = '';
  let sort: ShelfSort = 'recent';
  let pinnedOnly = false;
  let shown = PAGE;
  const body = el('div', '', 'ppp-shelf-box');

  const pinsKey = (r: string) => 'xtrata.radio.shelf.pins.v1:' + r;
  const recentKey = (r: string) => 'xtrata.radio.shelf.recent.v1:' + r;
  const readJson = <T,>(k: string, fallback: T): T => { try { const v = JSON.parse(deps.store.get(k) || 'null'); return v ?? fallback; } catch { return fallback; } };
  const pins = (r: string) => new Set<number>((readJson<unknown[]>(pinsKey(r), [])).filter((n): n is number => Number.isSafeInteger(n)));
  const recents = (r: string): Record<number, number> => { const v = readJson<Record<string, unknown>>(recentKey(r), {}); const o: Record<number, number> = {}; for (const [k, t] of Object.entries(v)) if (Number.isSafeInteger(Number(k)) && typeof t === 'number') o[Number(k)] = t; return o; };

  /** Reads the whole shelf, a page at a time (the server hands out at most 100). A failed read keeps what was shown. */
  async function load(r: string) {
    if (loading) return;
    loading = true; failed = false;
    try {
      const all: ShelfItem[] = [];
      let after = 0, count = 0;
      for (let guard = 0; guard < MAX_ALBUMS / 100 + 1; guard++) {
        const page = await deps.json(`/radio/gift/shelf?root=${encodeURIComponent(r)}&after=${after}&limit=100`);
        all.push(...shelfItems(page?.shelf));
        count = Number(page?.total) || all.length;
        if (!page?.next || !Number.isSafeInteger(page.next)) break;
        after = page.next;
      }
      if (r === root) { items = all; total = count; loadedAt = deps.now(); }
    } catch { failed = true; }
    finally { loading = false; deps.changed(); }
  }

  /** Read again soon (a new album was just claimed). */
  const invalidate = () => { loadedAt = -Infinity; };

  // Built once, so typing in the search box keeps its focus while the list below it is redrawn.
  const search = el('input') as HTMLInputElement;
  search.type = 'search'; search.placeholder = 'Search title, artist or #'; search.setAttribute('aria-label', 'Search your albums');
  search.oninput = () => { query = search.value; shown = PAGE; deps.changed(); };
  const order = el('select') as HTMLSelectElement;
  order.setAttribute('aria-label', 'Sort albums');
  for (const o of SHELF_SORTS) { const op = document.createElement('option'); op.value = o.value; op.textContent = o.label; order.append(op); }
  order.onchange = () => { sort = order.value as ShelfSort; shown = PAGE; deps.changed(); };
  const pinOnly = button('', () => { pinnedOnly = !pinnedOnly; shown = PAGE; deps.changed(); }, 'tiny');
  const tools = el('div', '', 'ppp-shelf-tools');
  tools.append(search, order, pinOnly);
  const below = el('div');
  const message = el('div');

  function render(s: Snapshot): HTMLElement | null {
    const r = s.step === 'off' || s.step === 'elsewhere' ? undefined : s.root;
    if (r !== root) { root = r; items = []; total = 0; loadedAt = -Infinity; shown = PAGE; }
    if (!r || s.walletCannotAlbums) return null;
    if (!loading && deps.now() - loadedAt > 5 * 60_000) void load(r);
    if (!items.length) {
      // Nothing to show until the first album: stay out of the way (but say so if it could not be read).
      if (!failed) return null;
      message.replaceChildren(el('p', 'Could not read your albums right now. They are safe in your wallet.', 'ppp-warn'), button('Try again', () => { loadedAt = -Infinity; deps.changed(); }, 'quiet'));
      body.replaceChildren(message);
      return body;
    }
    const pinSet = pins(r), recent = recents(r);
    const list = visibleAlbums(items, { query, sort, pinnedOnly, pins: pinSet, recents: recent });
    if (search.value !== query) search.value = query;
    order.value = sort;
    pinOnly.textContent = pinnedOnly ? '★ Pinned only' : '☆ Pinned only';
    pinOnly.setAttribute('aria-pressed', String(pinnedOnly));

    const parts: HTMLElement[] = [];
    if (s.slot > 0) parts.push(button('← Back to my own wallet', () => deps.open(0), 'quiet'));
    if (!list.length) parts.push(el('p', 'No album matches that.', 'ppp-mute'));
    else {
      const ol = el('ul', '', 'ppp-shelf-list');
      for (const a of list.slice(0, shown)) {
        const li = el('li', '', a.slot === s.slot ? 'now' : '');
        const pinned = pinSet.has(a.slot);
        const pin = button(pinned ? '★' : '☆', () => {
          const next = new Set(pinSet);
          if (pinned) next.delete(a.slot); else next.add(a.slot);
          deps.store.set(pinsKey(r), JSON.stringify([...next]));
          deps.changed();
        }, 'tiny');
        pin.setAttribute('aria-label', pinned ? `Unpin ${a.player!.title}` : `Pin ${a.player!.title}`);
        const sub = [a.player!.subtitle, `${a.player!.tracks.length} ${a.player!.tracks.length === 1 ? 'song' : 'songs'}`, a.state === 'sending' ? 'arriving…' : ''].filter(Boolean).join(' · ');
        const playing = a.slot === s.slot;
        const pick = button(playing ? 'Playing' : 'Play', () => {
          deps.store.set(recentKey(r), JSON.stringify(trimRecents({ ...recent, [a.slot]: deps.now() })));
          deps.open(a.slot);
        }, playing ? 'tiny' : 'tiny primary');
        pick.disabled = playing;
        li.append(pin, el('span', a.player!.title, 't'), el('span', ' ' + sub, 'ppp-mute'), pick);
        ol.append(li);
      }
      parts.push(ol);
      if (list.length > shown) parts.push(button(`Show more (${list.length - shown} left)`, () => { shown += PAGE; deps.changed(); }, 'quiet'));
    }
    if (failed) parts.push(el('p', 'Could not refresh your albums just now. This is the last list read.', 'ppp-mute'));
    below.replaceChildren(...parts);
    if (body.firstChild !== tools) body.replaceChildren(tools, below);
    return body;
  }

  /** The number of albums held, for the fold's title. */
  const count = () => total || items.length;
  return { render, invalidate, count };
}
