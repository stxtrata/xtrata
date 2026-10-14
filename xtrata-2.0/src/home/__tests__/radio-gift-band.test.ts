// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { initXtrataRadio } from '../radio';
vi.mock('../../lib/radio/play-counter', () => ({ attachPlayCounter: () => ({ setTrack: vi.fn(), select: vi.fn() }) }));

/**
 * A gift player is a band of its own: the album in order, looping, and when its paid plays are
 * used up nothing starts and nothing advances (no free mode).
 */
const asked: string[] = [];
beforeEach(() => {
  document.body.replaceChildren(); localStorage.clear(); sessionStorage.clear(); asked.length = 0;
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo) => {
    const url = String(input);
    const m = url.match(/runtime\/content\?.*tokenId=(\d+)/);
    if (m) { asked.push(m[1]); return new Response(`<title>Song ${m[1]}</title><source src="data:audio/mpeg;base64,YQ==">`, { headers: { 'content-type': 'text/html' } }); }
    return new Response(JSON.stringify({ tracks: [] }));
  }));
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const album = { id: 'abc', title: 'Proof of Sound', subtitle: 'Someone', tracks: [11, 12, 13] };

it('loading a player makes it the active band and the album plays in order, then loops', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  expect(api.getState().band).toBe('gift');
  api.switchOn();
  await vi.waitFor(() => expect(asked.length).toBeGreaterThan(0));
  expect(asked[0]).toBe('11');
  api.next(); await vi.waitFor(() => expect(asked.includes('12')).toBe(true));
  api.next(); await vi.waitFor(() => expect(asked.includes('13')).toBe(true));
  api.next(); await vi.waitFor(() => expect(asked.filter((id) => id === '11').length).toBeGreaterThan(1));
  expect(asked.filter((id) => !['11', '12', '13'].includes(id))).toEqual([]);
});

it('once the plays are used up nothing starts or advances, until the stop is lifted', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.setGiftStop('GIFT PLAYS FINISHED — ADD PLAYS TO CONTINUE');
  api.switchOn();
  api.next();
  api.playPause();
  await new Promise((r) => setTimeout(r, 30));
  expect(asked).toEqual([]);
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  api.setGiftStop(null);
  api.next();
  await vi.waitFor(() => expect(asked.length).toBeGreaterThan(0));
});

it('removing the player returns to FM', () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.setGiftPlayer(null);
  expect(api.getState().band).toBe('fm');
});
