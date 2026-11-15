import { GiftError, hiroGiftChain, type GiftDeps } from '../../lib/radio-gifts';
import { checkSongsNow } from '../../lib/radio-metadata';
import { createRelease, hiroHeld, orderPaid, orderStatus, releasesBy, releasesConfig, releasesEnabled, releaseView, setPrice, shelfAct, songsHeld, type ReleaseEnv } from '../../lib/radio-releases';

/**
 * Artists release their own music (functions/lib/radio-releases.ts, docs/music/ARTIST-RELEASES.md). Off unless
 * RADIO_RELEASES_ENABLED=1.
 *   GET  /radio/release/config          on or off, and which ways of distributing a release are open (copies, sales)
 *   GET  /radio/release/order?id=       an order: where to pay, how much, the memo, and whether it is paid
 *   POST /radio/release/price           {request, signature}: the artist signs a price for their release (0 = free)
 *   POST /radio/release/paid            {order, txid?}: look for an order's payment on chain; once confirmed the album is the player's
 *   GET  /radio/release/view?id=        one release: its songs, its artist, how many players have added it
 *   GET  /radio/release/by?artist=      an artist's releases
 *   GET  /radio/release/songs?wallet=   the ready songs a wallet holds (for the release picker)
 *   POST /radio/release/create          {definition, request, signature}: signed by the wallet that holds every song
 *   POST /radio/release/shelf           {request, signature}: signed by the player; add, hide, show, remove or list. Answers with the shelf
 * No money moves here: a sale is one transfer from the buyer straight to the artist, which this only reads from the chain.
 * Copies with plays included are funded through the gift batches (functions/radio/gift, RADIO_RELEASE_COPIES_ENABLED=1).
 */
type Ctx = { request: Request; env: ReleaseEnv; params?: { path?: string[] } };
const reply = (body: unknown, status = 200, extra: Record<string, string> = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra }
});

export async function onRequest({ request, env, params }: Ctx) {
  const action = (params?.path ?? []).join('/');
  const url = new URL(request.url);
  try {
    if (action === 'config') return request.method === 'GET' ? reply(releasesConfig(env, request), 200, { 'cache-control': 'public, max-age=0, s-maxage=30' }) : reply({ error: 'GET required' }, 405);
    if (!releasesEnabled(env)) return reply({ error: 'Releases are not open yet.' }, 404);
    if (['view', 'by', 'songs', 'order'].includes(action)) {
      if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
      if (action === 'view') return reply(await releaseView(env, url.searchParams.get('id')), 200, { 'cache-control': 'public, max-age=0, s-maxage=15' });
      if (action === 'order') return reply(await orderStatus(env, url.searchParams.get('id')));
      if (action === 'by') return reply(await releasesBy(env, url.searchParams.get('artist')));
      return reply(await songsHeld(env, url.searchParams.get('wallet'), hiroHeld(env)));
    }
    if (['create', 'shelf', 'price', 'paid'].includes(action)) {
      if (request.method !== 'POST') return reply({ error: 'POST required' }, 405);
      const origin = request.headers.get('origin');
      if (!origin || origin !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Same origin required' }, 403);
      const text = await request.text();
      if (text.length > 20_000) return reply({ error: 'Too large' }, 413);
      let body: any;
      try { body = JSON.parse(text || '{}'); } catch { return reply({ error: 'Invalid JSON' }, 400); }
      if (action === 'shelf') return reply(await shelfAct(env, body ?? {}, Date.now()));
      if (action === 'price') return reply(await setPrice(env, body ?? {}, Date.now()));
      if (action === 'paid') return reply(await orderPaid(env, body ?? {}, hiroGiftChain(env), Date.now()));
      const deps: GiftDeps = { chain: hiroGiftChain(env), now: Date.now(), checkSongs: (ids) => checkSongsNow(env, ids) };
      return reply(await createRelease(env, body ?? {}, deps));
    }
    return reply({ error: 'Not found' }, 404);
  } catch (error) {
    if (error instanceof GiftError) return reply({ error: error.message }, error.status);
    console.warn('[radio:release]', { action, reason: String((error as Error)?.message || error).slice(0, 120) });
    return reply({ error: 'Releases are unavailable right now.' }, 500);
  }
}
