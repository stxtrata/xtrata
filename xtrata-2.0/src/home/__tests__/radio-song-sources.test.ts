// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { initXtrataRadio } from '../radio';
import { served, webm, withHiddenTrack } from '../../lib/radio/__tests__/song-fixtures';
vi.mock('../../lib/radio/play-counter', () => ({ attachPlayCounter: () => ({ setTrack: vi.fn(), select: vi.fn() }) }));

/**
 * Songs that live elsewhere (src/lib/radio/song-sources.mjs) play on the radio, and an album's hidden track only
 * plays after a silence when the album ran start to finish with nothing skipped.
 */
const html = (body: string) => ({ type: 'text/html', bytes: new TextEncoder().encode(body) });
const FILES: Record<string, { type: string; bytes: Uint8Array }> = {
  11: html('<title>One</title><source src="data:audio/mpeg;base64,YQ==">'),
  12: html('<title>Two</title><source src="data:audio/mpeg;base64,Yg==">'),
  319: html('<title>Russian Rampage</title><audio><source src="https://xtrata.xyz/inscription/8" type="audio/webm"></audio>'),
  8: { type: 'video/webm', bytes: webm('A_OPUS') },
  139: { type: 'video/webm', bytes: withHiddenTrack(webm('V_VP9'), webm('A_OPUS')) },
  50: { type: 'video/webm', bytes: webm('V_VP9', 'A_OPUS') }
};
const asked: string[] = [];
let el: HTMLMediaElement | null = null;
beforeEach(() => {
  document.body.replaceChildren(); localStorage.clear(); sessionStorage.clear(); asked.length = 0; el = null;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo, init?: RequestInit) => {
    const url = String(input);
    const m = url.match(/runtime\/content\?.*tokenId=(\d+)/);
    if (!m) return new Response(JSON.stringify({ tracks: [] }));
    const file = FILES[m[1]];
    if (!file) return new Response('{}', { status: 404, headers: { 'content-type': 'application/json' } });
    const range = (init?.headers as Record<string, string> | undefined)?.Range ?? null;
    if (!range) asked.push(m[1]);
    return served(file.bytes, file.type, range);
  }));
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) { el = this; return Promise.resolve(); });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const now = (api: ReturnType<typeof initXtrataRadio>) => String(api!.getState().nowPlaying?.tokenId ?? '');
const settle = () => new Promise((r) => setTimeout(r, 80));
/** The song on air finishes by itself. */
const finish = async () => { await settle(); el!.dispatchEvent(new Event('ended')); };

it('a player that links its audio from another inscription plays that audio (#319 → #8, minted as video/webm)', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer({ id: 'ep', title: 'EP', subtitle: '', tracks: [319] });
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('319'), { timeout: 5000 });
  expect(api.getState().nowPlaying?.title).toBe('Russian Rampage');
  expect(el!.src).toMatch(/^blob:/); // typed as audio, whatever the file was minted as
});

it('a hidden track plays after the silence when the album ran from its first song to its last', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'], hiddenTrackSilenceMs: 30 })!;
  api.setGiftPlayer({ id: 'ep', title: 'EP', subtitle: '', tracks: [11, 12], hidden: 139 });
  expect(api.getState().gift?.tracks).toBe(2); // not listed
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'), { timeout: 5000 });
  await finish();
  await vi.waitFor(() => expect(now(api)).toBe('12'), { timeout: 5000 });
  await finish();
  await new Promise((r) => setTimeout(r, 10));
  expect(now(api)).toBe('12'); // the silence first
  await vi.waitFor(() => expect(now(api)).toBe('139'), { timeout: 5000 });
  expect(el!.src).toMatch(/^blob:/); // the hidden file, cut out of the video
  await finish();
  await vi.waitFor(() => expect(now(api)).toBe('11'), { timeout: 5000 }); // then round again
});

it('skipping a song means no hidden track: the album simply goes round', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'], hiddenTrackSilenceMs: 10 })!;
  api.setGiftPlayer({ id: 'ep', title: 'EP', subtitle: '', tracks: [11, 12], hidden: 139 });
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'), { timeout: 5000 });
  await settle();
  api.next();
  await vi.waitFor(() => expect(now(api)).toBe('12'), { timeout: 5000 });
  await finish();
  await vi.waitFor(() => expect(now(api)).toBe('11'), { timeout: 5000 });
  await new Promise((r) => setTimeout(r, 60));
  expect(asked).not.toContain('139');
});

it('pressing play during the silence ends the wait', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'], hiddenTrackSilenceMs: 120 })!;
  api.setGiftPlayer({ id: 'ep', title: 'EP', subtitle: '', tracks: [11], hidden: 139 });
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'), { timeout: 5000 });
  await finish();
  el!.dispatchEvent(new Event('play'));
  await new Promise((r) => setTimeout(r, 200));
  expect(asked).not.toContain('139');
});

it('a film (video with picture and sound) is still not a song', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer({ id: 'ep', title: 'EP', subtitle: '', tracks: [11, 50] });
  api.switchOn();
  await vi.waitFor(() => expect(now(api)).toBe('11'), { timeout: 5000 });
  await finish();
  await vi.waitFor(() => expect(JSON.parse(localStorage.getItem('xtrata.radio.duds.v3') || '[]')).toContain('50'), { timeout: 5000 });
  expect(now(api)).not.toBe('50');
});
