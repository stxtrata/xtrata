import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOMEPAGE_STRIP_SLIDES, HOMEPAGE_WALL_ROTATION, HOMEPAGE_MUSIC, validateHomepageContent } from '../homepage-content.js';
import { pickWall } from '../wall-rotation.js';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const SONGS = HOMEPAGE_MUSIC.fallback.map(({ id, title, artist }) => ({ id, title, artist }));
const CELLS: Record<string, number> = { big: 4, wide: 2, tall: 2 };

describe('NFT Check promotion', () => {
  it('has a slide in the rolling strip that opens the checker', () => {
    const slide = HOMEPAGE_STRIP_SLIDES.find((s) => s.id === 'nft-check');
    expect(slide?.href).toBe('/nftcheck/');
    expect(slide?.cta).toBeTruthy();
    expect(validateHomepageContent()).toEqual([]);
  });

  it('has a wall tile with optimised artwork that opens the checker', () => {
    const entry = HOMEPAGE_WALL_ROTATION.pool.find(({ tile }) => tile.id === 'nft-check');
    expect(entry?.tile.href).toBe('/nftcheck/');
    expect(entry?.tile.image).toBe('/home/wall/nft-check.webp');
    const file = new URL('../../../public/home/wall/nft-check.webp', import.meta.url);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeLessThan(150 * 1024);
  });

  it('keeps the wall full with the tile in the pool', () => {
    let seen = 0;
    for (let i = 1; i <= 400; i += 1) {
      let seed = i;
      const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const { order } = pickWall({ rotation: HOMEPAGE_WALL_ROTATION, songs: SONGS, rng });
      const ids = order.map((t: { id: string }) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(order.reduce((s: number, t: { size?: string }) => s + (CELLS[t.size ?? ''] ?? 1), 0)).toBe(16);
      if (ids.includes('nft-check')) seen += 1;
    }
    expect(seen).toBeGreaterThan(0);
  });
});

describe('NFT Check page header', () => {
  const page = read('../../../public/nftcheck/index.html');
  it('freezes a centred header with the logo, title and headline', () => {
    expect(page).toMatch(/header\.top\{position:sticky;top:0/);
    expect(page).toContain('class="brand__eyebrow"');
    expect(page).toContain('Xtrata NFT Preservation Checker');
    expect(page).toContain('<h1 class="brand__head">Where does your NFT');
    expect(page.match(/<h1/g)?.length).toBe(1);
  });
  it('keeps the elements the lookup script depends on', () => {
    ['id="q"', 'id="go"', 'id="find"', 'id="out"', 'id="mode-find"', 'id="mode-search"', 'id="caveats"'].forEach((hook) => expect(page).toContain(hook));
  });
});
