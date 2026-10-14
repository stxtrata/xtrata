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

it('a locked album is the only band until it is unlocked', () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.setBand('fm');
  expect(api.getState().band).toBe('fm');
  api.setGiftLock(true);
  expect(api.getState().band).toBe('gift'); // pulled back to the album
  api.setBand('liked'); api.setBand('chain'); api.setBand('fm');
  expect(api.getState().band).toBe('gift');
  api.cycleBand();
  expect(api.getState().band).toBe('gift');
  api.setGiftLock(false);
  api.setBand('liked');
  expect(api.getState().band).toBe('liked');
});

const ALBUM = ['11', '12', '13'];
const startOnFm = async () => {
  const api = initXtrataRadio({ tokenIds: ['7771', '7772', '7773', '7774'] })!;
  api.switchOn();
  await vi.waitFor(() => expect(asked.length).toBeGreaterThan(0), { timeout: 5000 });
  asked.length = 0;
  return api;
};

it('loading an album while another song is on air moves to the album\'s first song', async () => {
  const api = await startOnFm();
  api.setGiftPlayer(album);
  await vi.waitFor(() => expect(String(api.getState().nowPlaying?.tokenId)).toBe('11'), { timeout: 5000 });
});

it('a locked album refuses every other way of starting a song: the tuner, lists, previous and stale cues', async () => {
  const api = await startOnFm();
  api.next(); await vi.waitFor(() => expect(asked.length).toBeGreaterThan(0), { timeout: 5000 }); // FM history and cues exist
  api.setGiftPlayer(album);
  api.setGiftLock(true);
  expect(api.getState().giftLocked).toBe(true);
  await vi.waitFor(() => expect(asked.includes('11')).toBe(true), { timeout: 5000 });
  asked.length = 0;
  api.playToken('7773'); // the tuning strip, a list row, a relative tile
  api.prev(); api.prev();
  for (let i = 0; i < 6; i++) { api.next(); await new Promise((r) => setTimeout(r, 15)); }
  await new Promise((r) => setTimeout(r, 120));
  expect(asked.filter((id) => !ALBUM.includes(id))).toEqual([]);
  expect(asked.length).toBeGreaterThan(0);
});

it('once unlocked, the tuner and lists work again', async () => {
  const api = await startOnFm();
  api.setGiftPlayer(album);
  api.setGiftLock(true);
  api.playToken('7773');
  await new Promise((r) => setTimeout(r, 60));
  expect(asked.includes('7773')).toBe(false);
  api.setGiftLock(false);
  api.playToken('7773');
  await vi.waitFor(() => expect(asked.includes('7773')).toBe(true), { timeout: 5000 });
}, 30000);

it('pressing play on a paused foreign song starts the album instead of resuming that song', async () => {
  const api = await startOnFm();
  api.playPause(); // pause
  api.setGiftPlayer(album);
  api.setGiftLock(true);
  asked.length = 0;
  api.playPause();
  await vi.waitFor(() => expect(String(api.getState().nowPlaying?.tokenId)).toBe('11'), { timeout: 5000 });
});

it('a freshly opened album starts at its first song even if later songs aired before', async () => {
  localStorage.setItem('xtrata.radio.played.v1', JSON.stringify(['11']));
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.playPause();
  await vi.waitFor(() => expect(asked[0]).toBe('11'), { timeout: 5000 });
  await vi.waitFor(() => expect(String(api.getState().nowPlaying?.tokenId)).toBe('11'), { timeout: 5000 });
});

it('a refreshed page does not resume the previous album song: it waits on the first song', async () => {
  localStorage.setItem('xtrata.radio.v1', JSON.stringify({ on: true, tokenId: '13', position: 42, paused: true }));
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  await vi.waitFor(() => expect(String(api.getState().nowPlaying?.tokenId)).toBe('11'), { timeout: 5000 });
  api.playPause();
  await vi.waitFor(() => expect(asked.includes('11')).toBe(true), { timeout: 5000 });
  await new Promise((r) => setTimeout(r, 60));
  expect(String(api.getState().nowPlaying?.tokenId)).toBe('11');
});

it('the same album re-announced mid-listen does not restart it', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => expect(String(api.getState().nowPlaying?.tokenId)).toBe('11'), { timeout: 5000 });
  api.setGiftPlayer({ ...album });
  api.next(); await vi.waitFor(() => expect(String(api.getState().nowPlaying?.tokenId)).toBe('12'), { timeout: 5000 });
  api.setGiftPlayer({ ...album });
  await new Promise((r) => setTimeout(r, 80));
  expect(String(api.getState().nowPlaying?.tokenId)).toBe('12');
}, 30000);

const second = { id: 'other', title: 'Other', subtitle: '', tracks: [21, 22] };
const nowId = (api: any) => String(api.getState().nowPlaying?.tokenId);

it('switching wallets inside one session resumes each wallet where it was, cued at its position', async () => {
  let position = 0;
  const seeks: number[] = [];
  vi.spyOn(HTMLMediaElement.prototype, 'readyState', 'get').mockReturnValue(1); // metadata is there, so the seek is immediate
  vi.spyOn(HTMLMediaElement.prototype, 'currentTime', 'get').mockImplementation(() => position);
  vi.spyOn(HTMLMediaElement.prototype, 'currentTime', 'set').mockImplementation((v: number) => { seeks.push(v); });
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => expect(nowId(api)).toBe('11'), { timeout: 5000 });
  api.next(); await vi.waitFor(() => expect(nowId(api)).toBe('12'), { timeout: 5000 });
  position = 42;
  api.setGiftPlayer(second);
  await vi.waitFor(() => expect(nowId(api)).toBe('21'), { timeout: 5000 });
  position = 0; seeks.length = 0;
  api.setGiftPlayer(album); // back: song 12 at 42s, not song 11
  await vi.waitFor(() => expect(nowId(api)).toBe('12'), { timeout: 5000 });
  await vi.waitFor(() => expect(seeks).toContain(42), { timeout: 5000 });
  await new Promise((r) => setTimeout(r, 60));
  expect(nowId(api)).toBe('12');
}, 30000);

it('the first wallet comes back as it was after visiting an album', async () => {
  const api = await startOnFm();
  await vi.waitFor(() => expect(nowId(api)).not.toBe('undefined'), { timeout: 5000 });
  const before = nowId(api);
  api.setGiftPlayer(album);
  await vi.waitFor(() => expect(nowId(api)).toBe('11'), { timeout: 5000 });
  api.setGiftPlayer(null);
  await vi.waitFor(() => expect(nowId(api)).toBe(before), { timeout: 5000 });
}, 30000);

it('locking forgets every wallet: the album starts clean at its first song', async () => {
  const api = initXtrataRadio({ tokenIds: ['7777'] })!;
  api.setGiftPlayer(album);
  api.switchOn();
  await vi.waitFor(() => expect(nowId(api)).toBe('11'), { timeout: 5000 });
  api.next(); await vi.waitFor(() => expect(nowId(api)).toBe('12'), { timeout: 5000 });
  api.setGiftPlayer(second);
  await vi.waitFor(() => expect(nowId(api)).toBe('21'), { timeout: 5000 });
  api.forgetWallets();
  api.setGiftPlayer(album);
  await vi.waitFor(() => expect(nowId(api)).toBe('11'), { timeout: 5000 });
}, 30000);
