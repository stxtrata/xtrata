import { describe, expect, it } from 'vitest';
import { shelfItems, trimRecents, visibleAlbums, type ShelfItem } from '../shelf';

const album = (slot: number, title: string, artist = 'X', songs = 2): ShelfItem => ({
  slot, address: 'SP' + slot, state: 'arrived', amount: '100000', label: '', from: null, source: 'campaign',
  player: { id: String(slot).padStart(16, '0'), title, subtitle: artist, tracks: Array.from({ length: songs }, (_, i) => ({ id: slot * 10 + i, title: `${title} ${i + 1}`, artist })), cover: null, paidOnly: true }
});
const view = (over: object = {}) => ({ query: '', sort: 'newest' as const, pinnedOnly: false, pins: new Set<number>(), recents: {}, ...over });
const slots = (l: ShelfItem[]) => l.map((a) => a.slot);

describe('shelf', () => {
  const items = [album(1, 'Proof of Sound', 'Ada'), album(2, 'Night Drive', 'Bo'), album(3, 'Zero Hour', 'Ada'), album(4, 'Alpha', 'Cy')];

  it('sorts newest, oldest and by title, and keeps pins first', () => {
    expect(slots(visibleAlbums(items, view()))).toEqual([4, 3, 2, 1]);
    expect(slots(visibleAlbums(items, view({ sort: 'oldest' })))).toEqual([1, 2, 3, 4]);
    expect(slots(visibleAlbums(items, view({ sort: 'title' })))).toEqual([4, 2, 1, 3]);
    expect(slots(visibleAlbums(items, view({ pins: new Set([1, 3]) })))).toEqual([3, 1, 4, 2]);
    expect(slots(visibleAlbums(items, view({ pins: new Set([1, 3]), pinnedOnly: true })))).toEqual([3, 1]);
  });

  it('orders recently played first, then the rest newest first', () => {
    expect(slots(visibleAlbums(items, view({ sort: 'recent', recents: { 2: 50, 1: 90 } })))).toEqual([1, 2, 4, 3]);
  });

  it('searches title, artist, song titles and #number, every word must match', () => {
    expect(slots(visibleAlbums(items, view({ query: 'ada' })))).toEqual([3, 1]);
    expect(slots(visibleAlbums(items, view({ query: 'ada zero' })))).toEqual([3]);
    expect(slots(visibleAlbums(items, view({ query: 'night drive 2' })))).toEqual([2]); // a song title
    expect(slots(visibleAlbums(items, view({ query: '#3' })))).toEqual([3]);
    expect(visibleAlbums(items, view({ query: 'nothing like this' }))).toEqual([]);
  });

  it('holds hundreds of albums', () => {
    const many = Array.from({ length: 600 }, (_, i) => album(i + 1, `Album ${i + 1}`));
    expect(visibleAlbums(many, view()).length).toBe(600);
    expect(slots(visibleAlbums(many, view({ query: 'album 599' })))).toEqual([599]);
  });

  it('drops rows the server sent wrong, and wallets with no album', () => {
    const good = album(5, 'Ok');
    const rows = [good, { slot: 0, address: 'SPx', player: good.player }, { slot: 6, address: 7, player: good.player }, { slot: 7, address: 'SPy', player: null }, null, 'x'];
    expect(slots(shelfItems(rows))).toEqual([5]);
    expect(shelfItems('nope')).toEqual([]);
  });

  it('keeps only the newest recents', () => {
    const r = Object.fromEntries(Array.from({ length: 150 }, (_, i) => [i + 1, i + 1]));
    const t = trimRecents(r, 100);
    expect(Object.keys(t).length).toBe(100);
    expect(t[150]).toBe(150);
    expect(t[1]).toBeUndefined();
  });
});
