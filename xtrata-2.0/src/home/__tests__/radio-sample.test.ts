// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { initXtrataRadio } from '../radio';
vi.mock('../../lib/radio/play-counter', () => ({ attachPlayCounter: () => ({ setTrack: vi.fn(), select: vi.fn() }) }));

/**
 * Samples: while a player cannot pay, the pay-per-play page plays the opening of every song and moves on. The
 * opening is 30 seconds, or half of a song shorter than a minute, which is where a paid play would begin: so a
 * sample is never a play. No jumping within a song, and a song already past its opening is left to finish.
 */
let audio: HTMLAudioElement | null = null;
beforeEach(() => {
  document.body.replaceChildren(); localStorage.clear(); sessionStorage.clear(); audio = null;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo) => {
    const m = String(input).match(/runtime\/content\?.*tokenId=(\d+)/);
    if (m) return new Response(`<title>Song ${m[1]}</title><source src="data:audio/mpeg;base64,YQ==">`, { headers: { 'content-type': 'text/html' } });
    return new Response(JSON.stringify({ tracks: [] }));
  }));
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLAudioElement) { audio = this; return Promise.resolve(); });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const album = { id: 'abc', title: 'Proof of Sound', subtitle: 'Someone', tracks: [11, 12, 13] };
/** Put the playing song at `at` seconds of `length`, and let the radio notice. */
const at = (seconds: number, length: number) => {
  const el = audio!;
  Object.defineProperty(el, 'currentTime', { configurable: true, writable: true, value: seconds });
  Object.defineProperty(el, 'duration', { configurable: true, value: length });
  Object.defineProperty(el, 'paused', { configurable: true, value: false });
  el.dispatchEvent(new Event('timeupdate'));
};
const start = async (options = {}) => {
  const api = initXtrataRadio({ tokenIds: ['7777'], ...options })!;
  const now = () => String(api.getState().nowPlaying?.tokenId ?? '');
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => { expect(now()).toBe('11'); expect(audio).toBeTruthy(); });
  return { api, now };
};

it('plays the first 30 seconds of a song, then the next song, and says a sample ended', async () => {
  const { api, now } = await start({ initialSample: true });
  const ended: number[] = [];
  window.addEventListener('xtrata:radio-sample-ended', (e) => ended.push((e as CustomEvent).detail.song));
  expect(api.getState().sample).toBe(true);
  at(12, 200);
  expect(now()).toBe('11'); expect(ended).toEqual([]);
  at(29.8, 200);
  expect(ended).toEqual([11]);
  await vi.waitFor(() => expect(now()).toBe('12'));
  at(29.8, 200);
  await vi.waitFor(() => expect(now()).toBe('13'));
  expect(ended).toEqual([11, 12]);
});

it('a song shorter than a minute samples for half its length', async () => {
  const { now } = await start({ initialSample: true });
  at(15, 40);
  expect(now()).toBe('11');
  at(19.8, 40);
  await vi.waitFor(() => expect(now()).toBe('12'));
});

it('no jumping within a sampled song', async () => {
  const { api } = await start({ initialSample: true });
  at(5, 200);
  expect(api.seek(120)).toBe(false);
  expect(audio!.currentTime).toBe(5);
  api.setSample(false);
  expect(api.seek(120)).toBe(true);
});

it('whole songs when samples are off, and a song already past its opening is left to finish', async () => {
  const { api, now } = await start();
  expect(api.getState().sample).toBe(false);
  at(95, 200);
  expect(now()).toBe('11');                 // a paid song plays on
  api.setSample(true);                      // the plays ran out during it
  expect(api.getState().sample).toBe(false); // this song was already a play: it finishes
  at(140, 200);
  expect(now()).toBe('11');
  api.next();
  await vi.waitFor(() => expect(now()).toBe('12'));
  expect(api.getState().sample).toBe(true);  // the next one is a sample
  at(29.8, 200);
  await vi.waitFor(() => expect(now()).toBe('13'));
});

it('plays arriving mid-sample: the song carries on to its end', async () => {
  const { api, now } = await start({ initialSample: true });
  at(10, 200);
  api.setSample(false);
  at(45, 200);
  expect(now()).toBe('11');
});
