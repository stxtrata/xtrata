import { GiftError, hiroGiftChain, sweepGifts, type GiftDeps } from '../../lib/radio-gifts';
import { checkSongsNow } from '../../lib/radio-metadata';
import { giveawayAdmin, giveawayAuthorised, giveawayView, type GiveawayEnv } from '../../lib/radio-giveaway';

/**
 * The free-album giveaway (functions/lib/radio-giveaway.ts, page: public/giveaway.html):
 *   GET  /radio/giveaway          what the public sees: the one link on show (if any) and the counts. Never the list.
 *   POST /radio/giveaway/admin    the operator: {action: status | add | pause | resume | gap | skip | now, …};
 *                                 needs `Authorization: Bearer <RADIO_GIVEAWAY_SECRET>` (anything else: 404)
 * Reading it also nudges the gift sweep along (a claimed link only counts once its funds have arrived).
 */
type Ctx = { request: Request; env: GiveawayEnv; params?: { path?: string[] }; waitUntil?: (p: Promise<unknown>) => void };
const reply = (body: unknown, status = 200, extra: Record<string, string> = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra }
});
/** Seconds the edge may reuse one answer: a crowd on the page costs one database read every few seconds, not one each. */
const EDGE_TTL_S = 3;

export async function onRequest(context: Ctx) {
  const { request, env } = context;
  const action = (context.params?.path ?? []).join('/');
  try {
    if (action === 'admin') {
      if (request.method !== 'POST' || !giveawayAuthorised(env, request.headers.get('authorization'))) return reply({ error: 'Not found' }, 404);
      const text = await request.text();
      if (text.length > 200_000) return reply({ error: 'Too large' }, 413);
      let body: any;
      try { body = JSON.parse(text || '{}'); } catch { return reply({ error: 'Invalid JSON' }, 400); }
      return reply(await giveawayAdmin(env, body ?? {}, Date.now()));
    }
    if (action !== '') return reply({ error: 'Not found' }, 404);
    if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
    if (env.RADIO_GIFT_ENABLED !== '1') return reply({ error: 'The giveaway is not running.' }, 404);
    const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
    const key = new Request(new URL('/radio/giveaway?edge=1', request.url).toString());
    const hit = await cache?.match(key).catch(() => undefined);
    if (hit) return hit;
    const out = reply(await giveawayView(env, Date.now()), 200, { 'cache-control': `public, max-age=0, s-maxage=${EDGE_TTL_S}` });
    if (cache) context.waitUntil?.(cache.put(key, out.clone()).catch(() => undefined));
    const deps: GiftDeps = { chain: hiroGiftChain(env), now: Date.now(), checkSongs: (ids) => checkSongsNow(env, ids) };
    context.waitUntil?.(sweepGifts(env, deps).catch(() => undefined));
    return out;
  } catch (error) {
    if (error instanceof GiftError) return reply({ error: error.message }, error.status);
    console.warn('[radio:giveaway]', { action, reason: String((error as Error)?.message || error).slice(0, 120) });
    return reply({ error: 'The giveaway is unavailable right now.' }, 500);
  }
}
