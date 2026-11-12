import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  BITCOIN_MONKEYS_ANNOUNCEMENT,
  BITCOIN_MONKEYS_END,
  BITCOIN_MONKEYS_FEATURE,
  BITCOIN_MONKEYS_START,
  monkeysActive,
  monkeysFeature,
  msUntilMonkeysBoundary,
  previewMonkeys,
  validateMonkeysFeature
} from '../bitcoin-monkeys-feature.js';
import { HOMEPAGE_MUSIC, HOMEPAGE_WALL_ROTATION as ROTATION } from '../homepage-content.js';
import { todayEntry } from '../today-on-xtrata.js';
import { TODAY_SCHEDULE } from '../today-schedule.js';
import { pickSwap, pickWall } from '../wall-rotation.js';

const seeded = (seed: number) => (): number => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const SONGS = HOMEPAGE_MUSIC.fallback.map(({ id, title, artist }) => ({ id, title, artist }));
const CELLS: Record<string, number> = { big: 4, wide: 2, tall: 2 };
const cellsOf = (tiles: Array<{ size?: string }>) => tiles.reduce((sum, tile) => sum + (CELLS[tile.size ?? ''] ?? 1), 0);
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('Bitcoin Monkeys announcement window', () => {
  it('is sound and lasts exactly seven days', () => {
    expect(validateMonkeysFeature()).toEqual([]);
    expect(Date.parse(BITCOIN_MONKEYS_END) - Date.parse(BITCOIN_MONKEYS_START)).toBe(7 * 86400000);
  });

  it('opens at the start instant and closes at the end instant, for every visitor', () => {
    const start = Date.parse(BITCOIN_MONKEYS_START);
    const end = Date.parse(BITCOIN_MONKEYS_END);
    expect(monkeysActive(start - 1)).toBe(false);
    expect(monkeysActive(start)).toBe(true);
    expect(monkeysActive(end - 1)).toBe(true);
    expect(monkeysActive(end)).toBe(false);
    expect(monkeysFeature(start + 1000)?.id).toBe('bitcoin-monkeys-forever');
    expect(monkeysFeature(end + 1000)).toBeNull();
    expect(monkeysActive(Number.NaN)).toBe(false);
  });

  it('says how long until the window opens or closes, and nothing after it has closed', () => {
    const start = Date.parse(BITCOIN_MONKEYS_START);
    const end = Date.parse(BITCOIN_MONKEYS_END);
    expect(msUntilMonkeysBoundary(start - 5000)).toBe(5000);
    expect(msUntilMonkeysBoundary(end - 2000)).toBe(2000);
    expect(msUntilMonkeysBoundary(end + 1)).toBeNull();
  });

  it('previews with ?monkeys=1 only', () => {
    expect(previewMonkeys('?monkeys=1')).toBe(true);
    expect(previewMonkeys('?monkeys=0')).toBe(false);
    expect(previewMonkeys('')).toBe(false);
  });

  it('says the collection is coming on-chain, and links the announcement', () => {
    expect(BITCOIN_MONKEYS_FEATURE.statement).toBe('Bitcoin Monkeys are bringing their entire OG collection on-chain with Forever Twins on Xtrata.');
    expect(BITCOIN_MONKEYS_FEATURE.cta.href).toBe('https://x.com/BTCMonkeys/status/2120035589747581199');
    expect(BITCOIN_MONKEYS_ANNOUNCEMENT).toBe(BITCOIN_MONKEYS_FEATURE.cta.href);
    expect(BITCOIN_MONKEYS_FEATURE.cta.label).toBe('Read the announcement ↗');
    expect(`${BITCOIN_MONKEYS_FEATURE.statement} ${BITCOIN_MONKEYS_FEATURE.kicker}`).not.toMatch(/\b(is now|are now|has been|have been|completed|migrated)\b/i);
  });

  it('ships an optimised poster', () => {
    const file = new URL('../../../public/home/wall/bitcoin-monkeys-forever.webp', import.meta.url);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeLessThan(200 * 1024);
    expect(BITCOIN_MONKEYS_FEATURE.image).toBe('/home/wall/bitcoin-monkeys-forever.webp');
  });
});

describe('the announcement on the wall', () => {
  const feature = { ...BITCOIN_MONKEYS_FEATURE };

  it('holds the first big slot on every load, with the arcade in the other, and fills the grid', () => {
    for (let seed = 1; seed <= 500; seed += 1) {
      const { slots, order } = pickWall({ rotation: ROTATION, songs: SONGS, rng: seeded(seed), daily: feature });
      expect(slots['big-a'].id).toBe(feature.id);
      expect(order[0].id).toBe(feature.id);
      expect(slots['big-b'].id).toBe('xtrata-arcade');
      expect(cellsOf(order)).toBe(16);
      const ids = order.map((tile: { id: string }) => tile.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).not.toContain('forever-twins');
    }
  });

  it('is never swapped away while the wall rotates', () => {
    const { slots } = pickWall({ rotation: ROTATION, songs: SONGS, rng: seeded(9), daily: feature });
    for (let i = 0; i < 400; i += 1) {
      const swap = pickSwap({ rotation: ROTATION, slots, songs: SONGS, lastSlot: null, blocked: [], rng: seeded(i + 1) });
      if (!swap) continue;
      expect(swap.slot).not.toBe('big-a');
      expect(swap.tile.id).not.toBe('forever-twins');
    }
    expect(slots['big-a'].id).toBe(feature.id);
  });

  it('is replaced by the daily feature once the week is over', () => {
    const end = Date.parse(BITCOIN_MONKEYS_END);
    expect(monkeysFeature(end - 1)).not.toBeNull();
    expect(monkeysFeature(end)).toBeNull();
    const after = Date.parse('2026-11-20T12:00:00Z');
    const entry = todayEntry(after);
    expect(entry?.id).toBe(TODAY_SCHEDULE.find((day) => day.day === 12)?.id);
    const { slots } = pickWall({ rotation: ROTATION, songs: SONGS, rng: seeded(3), daily: { ...entry, kind: 'daily' } });
    expect(slots['big-a'].id).toBe(entry?.id);
  });
});

describe('homepage wiring and copy', () => {
  const home = read('../homepage.js');
  it('picks the campaign ahead of the daily card, draws the poster, and redraws when the week opens or closes', () => {
    expect(home).toContain('monkeysFeature(now)');
    expect(home).toContain("item.variant === 'poster'");
    expect(home).toContain('buildPosterTile');
    expect(home).toContain('msUntilMonkeysBoundary');
    expect(home).toContain('previewMonkeys');
  });

  it('no longer claims every tile is an inscription', () => {
    expect(read('../../../index.html')).not.toContain('Every tile is a real inscription');
    expect(read('../main.js')).not.toContain('Every tile is a real inscription');
    expect(read('../../../index.html')).toContain('Every one is on-chain or on its way.');
    expect(read('../main.js')).toContain('Every one is on-chain or on its way.');
  });

  it('draws the announcement with the full poster, a visible statement and an external link', () => {
    const card = read('../today-card.js');
    expect(card).toContain('buildPosterTile');
    expect(card).toContain('item.statement');
    expect(card).toContain('{ newTab: true }');
    const css = read('../styles/home.css');
    expect(css).toContain('object-fit: contain');
    expect(css).toContain('.home-tile--poster');
  });
});
