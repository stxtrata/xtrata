import { expect, it, vi } from 'vitest';
import { handleArtistSources, handleArtistCollection } from '../music-artist';
import { royaltyCollections, XTRATA_ROYALTY_ADMIN } from '../../../src/music-artist/routes';
import { sessionCookie } from '../creator-auth';
import { onRequest as studioSession } from '../../manage/session';
import { onRequest as artistSession } from '../../api/music/artist/session';
const request = (path = '') => new Request('https://xtrata.xyz/api/music/artist/royalties' + path);
it.each(['off','log','enforce'])('requires a signed session for every artist source in mode %s', async mode => {
  const session = vi.fn(async () => ({ ok: true, session: null }));
  for (const view of ['overview','collections','plays'] as const) {
    const response = await handleArtistSources(request(), { CREATOR_AUTH_MODE: mode }, view, session);
    expect(response.status).toBe(401); expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(await response.json()).not.toHaveProperty('collections');
  }
});
it('discovers registered collections without inventing pay-per-play totals', async () => {
  const session = vi.fn(async () => ({ ok: true, session: { address: XTRATA_ROYALTY_ADMIN, admin: true, expiresAt: Date.now()+60000 } }));
  const body = await (await handleArtistSources(request(),{},'overview',session)).json();
  expect(body.collections).toEqual(royaltyCollections); expect(body.plays.available).toBe(false);
  const plays = await (await handleArtistSources(request(),{},'plays',session)).json();
  expect(plays.available).toBe(false); expect(plays).not.toHaveProperty('total');
});
it('rejects unknown collections and preserves the Audionaut signed-out gate', async () => {
  expect((await handleArtistCollection(request('/collections/unknown'),{},'unknown')).status).toBe(404);
  expect((await handleArtistCollection(request('/collections/audionauts-1-0'),{},'audionauts-1-0')).status).toBe(401);
  expect((await handleArtistSources(new Request(request().url,{method:'POST'}),{},'overview')).status).toBe(405);
});
it('reuses the exact challenge handler and the cookie across old and new URLs', () => {
  expect(artistSession).toBe(studioSession);
  expect(sessionCookie('test',request())).toContain('Path=/; HttpOnly; SameSite=Strict');
});
