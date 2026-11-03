// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { initXtrataRadio } from '../radio';
vi.mock('../../lib/radio/play-counter', () => ({ attachPlayCounter: () => ({ setTrack: vi.fn(), select: vi.fn() }) }));

/**
 * The radio plays when the listener presses play, keeps playing in a background tab, and once
 * stopped stays stopped until play is pressed again: no "tap anywhere", no watchdog, no retune.
 */
const song = '<title>Kept song</title><source src="data:audio/mpeg;base64,YQ==">';
let play: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  document.body.replaceChildren(); localStorage.clear(); sessionStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo) => String(input).startsWith('/runtime/content')
    ? new Response(song, { headers: { 'content-type': 'text/html' } })
    : new Response(JSON.stringify({ tracks: [] }))));
  play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const saved = (extra: object) => localStorage.setItem('xtrata.radio.v1', JSON.stringify({ on: true, tokenId: '7777', position: 15, ...extra }));
const clickPage = () => document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));

it('a session left paused comes back paused, cued, and a click elsewhere does not start it', async () => {
  saved({ paused: true });
  const api = initXtrataRadio({ tokenIds: ['7777'], resumePlayback: true })!;
  await vi.waitFor(() => expect(api.getState().nowPlaying).toMatchObject({ tokenId: '7777', title: 'Kept song' }));
  expect(play).not.toHaveBeenCalled();
  clickPage(); document.body.click();
  expect(play).not.toHaveBeenCalled();
  api.playPause(); // the play button
  expect(play).toHaveBeenCalledTimes(1);
});

it('when the browser blocks autoplay it waits for the play button, not any tap', async () => {
  saved({});
  play.mockRejectedValueOnce(new DOMException('blocked', 'NotAllowedError'));
  const api = initXtrataRadio({ tokenIds: ['7777'], resumePlayback: true })!;
  await vi.waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  await Promise.resolve();
  clickPage(); document.body.click();
  expect(play).toHaveBeenCalledTimes(1);
  api.playPause();
  expect(play).toHaveBeenCalledTimes(2);
});

it('a pause from outside the radio (media keys, headphones) is kept, and saved for the next page', async () => {
  saved({});
  const api = initXtrataRadio({ tokenIds: ['7777'], resumePlayback: true })!;
  await vi.waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  // The engine's element is not in the DOM: it is the receiver of the play() call.
  const element = play.mock.instances[play.mock.instances.length - 1] as unknown as HTMLMediaElement;
  Object.defineProperty(element, 'paused', { configurable: true, get: () => true });
  element.dispatchEvent(new Event('pause'));
  expect(JSON.parse(localStorage.getItem('xtrata.radio.v1')!)).toMatchObject({ on: true, paused: true });
});

