import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOMEPAGE_MUSIC, HOMEPAGE_WALL_ROTATION as ROTATION } from '../homepage-content.js';
import { pickSwap, pickWall, weightedPick } from '../wall-rotation.js';

const homepageSource = readFileSync(new URL('../homepage.js', import.meta.url), 'utf8');

// Small seeded random source so every run of these tests sees the same "random" loads.
const seeded = (seed: number) => (): number => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const SONGS = HOMEPAGE_MUSIC.fallback.map(({ id, title, artist }) => ({ id, title, artist }));
const CELLS: Record<string, number> = { big: 4, wide: 2, tall: 2 };
const cellsOf = (tiles: Array<{ size?: string }>) => tiles.reduce((sum, tile) => sum + (CELLS[tile.size ?? ''] ?? 1), 0);

describe('homepage wall rotation', () => {
  it('weights a pick and ignores items with no weight', () => {
    const rng = seeded(1);
    const picks = Array.from({ length: 400 }, () => weightedPick([{ id: 'a', w: 0 }, { id: 'b', w: 3 }, { id: 'c', w: 1 }], (x: { w: number }) => x.w, rng)?.id);
    expect(picks).not.toContain('a');
    expect(picks.filter((id) => id === 'b').length).toBeGreaterThan(picks.filter((id) => id === 'c').length);
    expect(weightedPick([], () => 1, rng)).toBeNull();
  });

  it('always keeps the arcade in exactly one big slot and fills the grid exactly', () => {
    const rng = seeded(7);
    const sides = new Set<string>();
    for (let i = 0; i < 600; i += 1) {
      const { slots, order } = pickWall({ rotation: ROTATION, songs: SONGS, rng });
      const bigs = order.filter((tile: { size: string }) => tile.size === 'big');
      expect(bigs).toHaveLength(2);
      expect(bigs.map((tile: { id: string }) => tile.id)).toContain(ROTATION.pinned.id);
      sides.add(slots['big-a'].id === ROTATION.pinned.id ? 'a' : 'b');
      expect(cellsOf(order)).toBe(16);
      expect(order).toHaveLength(7);
      const ids = order.map((tile: { id: string }) => tile.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(slots.chess.id).toBe('chess');
    }
    // The arcade really does move between the two big slots.
    expect(sides).toEqual(new Set(['a', 'b']));
  });

  it('gives every other tile a turn at the big slot, and always shows the campaign', () => {
    const rng = seeded(11);
    const seenBig = new Set<string>();
    for (let i = 0; i < 1500; i += 1) {
      const { slots, order } = pickWall({ rotation: ROTATION, songs: SONGS, rng });
      const other = ['big-a', 'big-b'].map((name) => slots[name]).find((tile) => tile.id !== ROTATION.pinned.id);
      seenBig.add(other.id);
      for (const id of ROTATION.campaign) {
        expect(order.map((tile: { id: string }) => tile.id)).toContain(id);
      }
    }
    const bigPool = ROTATION.pool.filter((entry: { weights: { big?: number } }) => (entry.weights.big ?? 0) > 0).map((entry: { tile: { id: string } }) => entry.tile.id);
    expect([...seenBig].sort()).toEqual([...bigPool].sort());
  });

  it('does not repeat what the last visit showed when there is something else', () => {
    const rng = seeded(21);
    for (let i = 0; i < 300; i += 1) {
      const { slots } = pickWall({ rotation: ROTATION, songs: SONGS, rng, recent: { big: 'astro-blaster', songs: [3062, 3061, 3058] } });
      const other = ['big-a', 'big-b'].map((name) => slots[name]).find((tile) => tile.id !== ROTATION.pinned.id);
      expect(other.id).not.toBe('astro-blaster');
      const songIds = [slots['song-1'].tokenId, slots['song-2'].tokenId];
      expect(songIds[0]).not.toBe(songIds[1]);
      expect(songIds).not.toContain(3062);
    }
  });

  it('swaps one tile at a time without losing the arcade, chess, or the campaign', () => {
    const rng = seeded(33);
    const { slots } = pickWall({ rotation: ROTATION, songs: SONGS, rng });
    let last: string | null = null;
    const touched = new Set<string>();
    const seenTiles = new Set<string>(Object.values(slots).map((tile: { id: string }) => tile.id));
    for (let i = 0; i < 2000; i += 1) {
      const swap = pickSwap({ rotation: ROTATION, slots, songs: SONGS, rng, lastSlot: last, blocked: ['song-2'] });
      if (!swap) continue;
      expect(swap.slot).not.toBe(last);
      expect(swap.slot).not.toBe('song-2');
      expect(swap.slot).not.toBe('chess');
      slots[swap.slot] = swap.tile;
      last = swap.slot;
      touched.add(swap.slot);
      seenTiles.add(swap.tile.id);
      const ids = Object.values(slots).map((tile: { id: string }) => tile.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain(ROTATION.pinned.id);
      expect(ids).toContain('chess');
      for (const id of ROTATION.campaign) expect(ids).toContain(id);
      expect(cellsOf(Object.values(slots))).toBe(16);
    }
    // Songs and at least a few of the picture slots change over time. (A slot holding the only
    // campaign tile is deliberately left alone, so which slots move depends on the draw.)
    expect(touched.has('song-1')).toBe(true);
    expect(touched.size).toBeGreaterThanOrEqual(3);
    expect(seenTiles.size).toBeGreaterThan(Object.keys(slots).length);
  });

  it('is wired into the page with the safeguards a moving hero needs', () => {
    expect(homepageSource).toContain("from './wall-rotation.js'");
    expect(homepageSource).toContain('prefers-reduced-motion');
    expect(homepageSource).toContain('document.hidden');
    expect(homepageSource).toContain("matches(':hover')");
    expect(homepageSource).toContain('window.clearTimeout(wallTimer)');
    expect(ROTATION.intervalMs[0]).toBeGreaterThanOrEqual(5000);
  });
});
