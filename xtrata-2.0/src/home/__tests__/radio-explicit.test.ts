// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { initXtrataRadio } from '../radio';
import { EXPLICIT_SONGS, isExplicitSong } from '../../lib/radio/artist-credits.mjs';
vi.mock('../../lib/radio/play-counter', () => ({ attachPlayCounter: () => ({ setTrack: vi.fn(), select: vi.fn() }) }));

/**
 * A song marked explicit is never chosen by the radio itself. It plays only when the listener asks for that song and
 * has accepted the warning on this device.
 */
const asked: string[] = [];
beforeEach(() => {
  document.body.replaceChildren(); localStorage.clear(); sessionStorage.clear(); asked.length = 0;
  delete (window as any).XtrataRadioExplicitHandler;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo) => {
    const m = String(input).match(/runtime\/content\?.*tokenId=(\d+)/);
    if (m) { asked.push(m[1]); return new Response(`<title>Song ${m[1]}</title><source src="data:audio/mpeg;base64,YQ==">`, { headers: { 'content-type': 'text/html' } }); }
    return new Response(JSON.stringify({ tracks: [] }));
  }));
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const album = { id: 'abc', title: 'An album', subtitle: 'Someone', tracks: [11, 12, 13] };
const now = (api: any) => String(api.getState().nowPlaying?.tokenId ?? '');

it('Xtrata’s own list marks #3590, and the engine knows it without being told', () => {
  expect(EXPLICIT_SONGS).toContain(3590);
  expect(isExplicitSong('3590')).toBe(true);
  expect(isExplicitSong(3591)).toBe(false);
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  expect(api.isExplicit(3590)).toBe(true);
  expect(api.isExplicit(11)).toBe(false);
});

it('an album run skips a song its creator marked explicit', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setExplicit([12]);
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'));
  api.next();
  await vi.waitFor(() => expect(now(api)).toBe('13')); // 12 is passed over
  api.next();
  await vi.waitFor(() => expect(now(api)).toBe('11'));
  expect(asked).not.toContain('12');
});

it('asking for it shows the warning first; nothing plays until it is accepted, and the choice is remembered', async () => {
  const warned: string[] = [];
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  (window as any).XtrataRadioExplicitHandler = (d: { id: string }) => warned.push(d.id);
  api.setExplicit([12]);
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'));
  api.playToken(12);
  expect(warned).toEqual(['12']);
  expect(now(api)).toBe('11'); // still the song that was on
  expect(asked).not.toContain('12');
  // The listener accepts: the page calls allowExplicit, then asks again.
  api.allowExplicit(true);
  api.playToken(12);
  await vi.waitFor(() => expect(now(api)).toBe('12'));
  expect(warned).toEqual(['12']); // not asked twice
  expect(localStorage.getItem('xtrata.radio.explicit.ok.v1')).toBe('1');
});

it('once accepted, the album plays it in its place; with no page to ask, it is simply not played', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setExplicit([12]);
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'));
  api.playToken(12); // no handler on this page
  expect(now(api)).toBe('11');
  expect(asked).not.toContain('12');
  api.allowExplicit(true);
  api.next();
  await vi.waitFor(() => expect(now(api)).toBe('12'));
});

it('a song already cued is dropped when it turns out to be explicit', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'));
  await vi.waitFor(() => expect(asked).toContain('12')); // 12 was preloaded to follow 11
  api.setExplicit([12]); // the full list arrives after it was cued
  api.next();
  await vi.waitFor(() => expect(now(api)).toBe('13'));
});
