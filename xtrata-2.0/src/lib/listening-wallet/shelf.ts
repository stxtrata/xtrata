/**
 * "My albums": the albums a listener holds in their numbered wallets. A listener may hold hundreds, so everything
 * here is plain data in, plain data out: search, sort, pin and recent, with no limit on how many albums there are.
 */
import type { PlayerView } from './gift-players';

export interface ShelfItem {
  slot: number;
  address: string;
  /** `sending`: the gift is on its way to that wallet; `arrived`: it has landed. */
  state: 'sending' | 'arrived';
  amount: string;
  label: string;
  from: string | null;
  source: string;
  player: PlayerView | null;
}

export type ShelfSort = 'recent' | 'newest' | 'oldest' | 'title';
export const SHELF_SORTS: { value: ShelfSort; label: string }[] = [
  { value: 'recent', label: 'Recently played' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' }
];

export interface ShelfView {
  query: string;
  sort: ShelfSort;
  pinnedOnly: boolean;
  pins: ReadonlySet<number>;
  /** slot -> time it was last opened (ms) */
  recents: Readonly<Record<number, number>>;
}

/** Parse what the server sent: a malformed row is dropped, never trusted. */
export function shelfItems(rows: unknown): ShelfItem[] {
  if (!Array.isArray(rows)) return [];
  const out: ShelfItem[] = [];
  for (const r of rows) {
    if (!r || !Number.isSafeInteger(r.slot) || r.slot < 1 || typeof r.address !== 'string') continue;
    const p = r.player;
    const player = p && typeof p.id === 'string' && typeof p.title === 'string' && Array.isArray(p.tracks) ? (p as PlayerView) : null;
    if (!player) continue; // a shelf holds albums; a wallet with no album on it is not one
    out.push({
      slot: r.slot, address: r.address, state: r.state === 'arrived' ? 'arrived' : 'sending', amount: String(r.amount ?? '0'),
      label: typeof r.label === 'string' ? r.label : '', from: typeof r.from === 'string' ? r.from : null, source: String(r.source ?? ''), player
    });
  }
  return out;
}

const haystack = (a: ShelfItem) =>
  [a.player?.title, a.player?.subtitle, a.label, `#${a.slot}`, ...(a.player?.tracks ?? []).flatMap((t) => [t.title, t.artist])]
    .filter(Boolean).join(' ').toLowerCase();

/** Pinned albums first, then the chosen order. Every word typed must appear somewhere in the album. */
export function visibleAlbums(items: readonly ShelfItem[], v: ShelfView): ShelfItem[] {
  const words = v.query.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = items.filter((a) => (!v.pinnedOnly || v.pins.has(a.slot)) && (() => { const h = haystack(a); return words.every((w) => h.includes(w)); })());
  const order: Record<ShelfSort, (a: ShelfItem, b: ShelfItem) => number> = {
    recent: (a, b) => (v.recents[b.slot] ?? 0) - (v.recents[a.slot] ?? 0) || b.slot - a.slot,
    newest: (a, b) => b.slot - a.slot,
    oldest: (a, b) => a.slot - b.slot,
    title: (a, b) => (a.player?.title ?? '').localeCompare(b.player?.title ?? '') || a.slot - b.slot
  };
  return hit.sort((a, b) => Number(v.pins.has(b.slot)) - Number(v.pins.has(a.slot)) || order[v.sort](a, b));
}

/** Keep only the newest `max` recents so the stored map stays small however many albums there are. */
export function trimRecents(r: Record<number, number>, max = 100): Record<number, number> {
  const keep = Object.entries(r).sort((a, b) => b[1] - a[1]).slice(0, max);
  return Object.fromEntries(keep.map(([k, t]) => [Number(k), t]));
}
