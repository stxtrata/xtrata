import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOMEPAGE_MUSIC, HOMEPAGE_WALL_ROTATION as ROTATION } from '../homepage-content.js';
import { championCopy, fetchChampion, fetchClockOffset, msUntilNextUkMidnight, previewDay, todayDayNumber, todayEntry, validateTodaySchedule } from '../today-on-xtrata.js';
import { TODAY_DAYS, TODAY_LAUNCH_DATE, TODAY_SCHEDULE } from '../today-schedule.js';
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

describe('Today on Xtrata schedule', () => {
  it('is sound and launches on a Monday', () => {
    expect(validateTodaySchedule()).toEqual([]);
    expect(new Date(`${TODAY_LAUNCH_DATE}T12:00:00Z`).getUTCDay()).toBe(1);
    expect(TODAY_SCHEDULE).toHaveLength(TODAY_DAYS);
  });

  it('runs 14 UK days, with normal rotation before and after', () => {
    expect(todayDayNumber(Date.parse('2026-11-08T23:59:59Z'))).toBeNull();
    expect(todayDayNumber(Date.parse('2026-11-09T00:00:00Z'))).toBe(1);
    expect(todayDayNumber(Date.parse('2026-11-22T23:59:59Z'))).toBe(14);
    expect(todayDayNumber(Date.parse('2026-11-23T00:00:00Z'))).toBeNull();
    expect(todayEntry(Date.parse('2026-11-23T12:00:00Z'))).toBeNull();
  });

  it('follows UK midnight, not the visitor timezone, in GMT and BST', () => {
    // GMT (November): midnight UK = 00:00Z
    expect(todayDayNumber(Date.parse('2026-11-10T00:00:00Z'))).toBe(2);
    expect(todayDayNumber(Date.parse('2026-11-09T23:59:59Z'))).toBe(1);
    // BST (June): midnight UK = 23:00Z the day before
    const opts = { launchDate: '2026-06-01', days: 14 };
    expect(todayDayNumber(Date.parse('2026-05-31T22:59:59Z'), opts)).toBeNull();
    expect(todayDayNumber(Date.parse('2026-05-31T23:00:00Z'), opts)).toBe(1);
    expect(msUntilNextUkMidnight(Date.parse('2026-11-09T23:00:00Z'))).toBe(3600000);
    expect(msUntilNextUkMidnight(Date.parse('2026-06-01T22:00:00Z'))).toBe(3600000);
  });

  it('previews a day with ?today=N only for valid days', () => {
    expect(previewDay('?today=5')).toBe(5);
    expect(previewDay('?today=15')).toBeNull();
    expect(previewDay('?today=x')).toBeNull();
    expect(previewDay('')).toBeNull();
  });

  it('uses the live champion on Day 14 and the fallback otherwise', async () => {
    const ok = async () => ({ ok: true, json: async () => ({ version: 1, name: 'Tille', score: 1868182 }) });
    expect(await fetchChampion(ok as never)).toEqual({ name: 'Tille', score: 1868182 });
    expect(championCopy({ name: 'Tille', score: 1868182 }, 'x')).toContain('1,868,182');
    const down = async () => { throw new Error('offline'); };
    expect(await fetchChampion(down as never)).toBeNull();
    const bad = async () => ({ ok: true, json: async () => ({ version: 1, empty: true }) });
    expect(await fetchChampion(bad as never)).toBeNull();
    expect(championCopy(null, 'fallback')).toBe('fallback');
  });

  it('reads the server clock from the Date header, and ignores bad or missing ones', async () => {
    const ahead = async () => ({ headers: { get: () => new Date(Date.now() + 5 * 3600000).toUTCString() } });
    const off = await fetchClockOffset(ahead as never);
    expect(Math.abs(off - 5 * 3600000)).toBeLessThan(2000);
    expect(await fetchClockOffset((async () => ({ headers: { get: () => null } })) as never)).toBe(0);
    expect(await fetchClockOffset((async () => ({ headers: { get: () => new Date(Date.now() + 30 * 86400000).toUTCString() } })) as never)).toBe(0);
    expect(await fetchClockOffset((async () => { throw new Error('offline'); }) as never)).toBe(0);
  });

  it('has a primary action with a real destination on every day', () => {
    TODAY_SCHEDULE.forEach((entry) => {
      const a = entry.action as { type: string; href?: string; tokenId?: number };
      expect(a.type === 'song' ? Number.isInteger(a.tokenId) : /^(\/|https:\/\/)/.test(a.href || '')).toBe(true);
    });
  });
});

describe('wall rotation with a daily feature', () => {
  it('holds big-a for the day, keeps the arcade in big-b and fills the grid, on every day', () => {
    TODAY_SCHEDULE.forEach((entry) => {
      for (let seed = 1; seed <= 120; seed += 1) {
        const rng = seeded(seed * 31 + entry.day);
        const daily = { ...entry, kind: 'daily' };
        const { slots, order } = pickWall({ rotation: ROTATION, songs: SONGS, rng, daily });
        expect(slots['big-a'].id).toBe(entry.id);
        expect(order[0].id).toBe(entry.id);
        expect(cellsOf(order)).toBe(16);
        const ids = order.map((t: { id: string }) => t.id);
        expect(new Set(ids).size).toBe(ids.length);
        (entry.avoid || []).forEach((id: string) => expect(ids).not.toContain(id));
        order.filter((t: { kind: string }) => t.kind === 'song').forEach((t: { tokenId: number }) => expect((entry.avoidSongs || []) as number[]).not.toContain(t.tokenId));
      }
    });
  });

  it('never swaps the daily tile away, nor brings back an avoided feature', () => {
    const entry = TODAY_SCHEDULE[2];
    const rng = seeded(5);
    const { slots } = pickWall({ rotation: ROTATION, songs: SONGS, rng, daily: { ...entry, kind: 'daily' } });
    for (let i = 0; i < 300; i += 1) {
      const swap = pickSwap({ rotation: ROTATION, slots, songs: SONGS, lastSlot: null, blocked: [], rng });
      if (!swap) continue;
      expect(swap.slot).not.toBe('big-a');
      (entry.avoid || []).forEach((id: string) => expect(swap.tile.id).not.toBe(id));
    }
  });

  it('is the same wall as before when no daily is given', () => {
    const { order } = pickWall({ rotation: ROTATION, songs: SONGS, rng: seeded(3) });
    expect(cellsOf(order)).toBe(16);
    expect(order.some((t: { kind: string }) => t.kind === 'daily')).toBe(false);
  });
});

describe('homepage wiring', () => {
  const src = readFileSync(new URL('../homepage.js', import.meta.url), 'utf8');
  it('passes the day to the wall, redraws at UK midnight and keeps daily out of the recent list', () => {
    expect(src).toContain('todayEntry(nowMs()');
    expect(src).toContain('fetchClockOffset');
    expect(src).toContain('msUntilNextUkMidnight');
    expect(src).toContain("tile.kind !== 'daily'");
  });
});

describe('casino beta bar', () => {
  const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
  it('links to the slot hall beta, above the music supporters bar', () => {
    expect(html).toContain('id="betaBar" class="home-supbar home-supbar--beta home-only" href="/casino/"');
    expect(html.indexOf('id="betaBar"')).toBeGreaterThan(-1);
    expect(html.indexOf('id="betaBar"')).toBeLessThan(html.indexOf('id="musicBanner"'));
  });
});
