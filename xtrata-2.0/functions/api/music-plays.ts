import {freshenPaidPlayIndex, paidPlaysPage, type StatsEnv} from '../lib/music-stats';

/**
 * GET /api/music-plays?offset=0&limit=500 — paid plays, newest first, from the paid-play index
 * (the same source as /api/music-stats and the song counts). Music Heroes and the lounge history
 * read this instead of each browser paging the contract log from Hiro.
 * `total` is null while the index is still catching up with the chain.
 */
export async function onRequest(context: {request: Request; env: StatsEnv; waitUntil?: (promise: Promise<unknown>) => void}) {
  const reply = (body: unknown, status = 200, cache = 'no-store') => new Response(JSON.stringify(body), {
    status, headers: {'content-type': 'application/json', 'cache-control': cache, 'x-content-type-options': 'nosniff'}
  });
  if (context.request.method !== 'GET') return reply({error: 'GET required'}, 405);
  if (!context.env.DB) return reply({error: 'Music statistics are not available on this deployment yet.'}, 503);
  const params = new URL(context.request.url).searchParams;
  const offset = Number(params.get('offset') ?? 0), limit = Number(params.get('limit') ?? 50);
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10_000_000 || !Number.isSafeInteger(limit) || limit < 1 || limit > 500)
    return reply({error: 'Invalid page'}, 400);
  const waitUntil = context.waitUntil ? (promise: Promise<unknown>) => context.waitUntil!(promise) : undefined;
  try {
    await freshenPaidPlayIndex(context.env, {waitUntil}).catch(() => undefined);
    return reply(await paidPlaysPage(context.env, offset, limit), 200, 'public, max-age=10');
  } catch {
    return reply({error: 'Music statistics are not activated yet. The operator must apply migration 022.'}, 503);
  }
}
