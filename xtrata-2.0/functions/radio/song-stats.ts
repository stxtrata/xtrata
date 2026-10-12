import { queryAll, type Env } from '../lib/db';
import { chainConfig, chainStates } from '../lib/radio-chain-likes';

/**
 * GET /radio/song-stats?id=N — one song's on-chain counters for the radio's display:
 *   likes  the likes contract's current total for the song (read from the chain)
 *   plays  paid plays: pay-per-play receipts on the paid-plays contract, as copied into D1 by the
 *          music stats sync (functions/lib/music-stats.ts), so it can trail the chain by a minute.
 * Each is null when it could not be read: a failed read is never reported as zero.
 */
const RADIO_CORE_INDEX = 3;

type Deps = { chainConfig: typeof chainConfig; chainStates: typeof chainStates };

export async function songStats(env: Env, id: number, deps: Deps = { chainConfig, chainStates }) {
  const [likes, plays] = await Promise.all([
    (async () => {
      try {
        const config = await deps.chainConfig(env);
        if (!config.enabled) return null;
        const [row] = await deps.chainStates(config.contract, [id], undefined, env);
        return Number(row.total);
      } catch { return null; }
    })(),
    (async () => {
      try {
        const r = await queryAll(env, 'SELECT COUNT(*) AS plays FROM music_paid_plays WHERE core=? AND song_id=?', [RADIO_CORE_INDEX, id]);
        const n = Number((r.results?.[0] as { plays?: unknown } | undefined)?.plays);
        return Number.isSafeInteger(n) ? n : null;
      } catch { return null; }
    })()
  ]);
  return { id, likes, plays };
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const reply = (body: unknown, status = 200, cache = 'no-store') =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': cache, 'x-content-type-options': 'nosniff' } });
  if (request.method !== 'GET') return reply({ error: 'GET required' }, 405);
  const raw = new URL(request.url).searchParams.get('id') ?? '';
  const id = /^\d{1,8}$/.test(raw) ? Number(raw) : NaN;
  if (!Number.isSafeInteger(id) || id < 1) return reply({ error: 'Invalid song id' }, 400);
  const stats = await songStats(env, id);
  // Short cache: the display re-asks on every song change and after a like confirms.
  return reply(stats, 200, stats.likes === null || stats.plays === null ? 'no-store' : 'public, max-age=15');
}
