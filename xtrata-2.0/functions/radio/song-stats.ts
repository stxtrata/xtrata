import type { Env } from '../lib/db';
import { likesFor, paidPlaysFor, songCounts } from '../lib/onchain-counts';

/**
 * GET /radio/song-stats?id=N — one song's on-chain likes and paid plays for the radio's display.
 * Same source as the catalogue and every other page (functions/lib/onchain-counts.ts), so the
 * numbers always agree. The paid-play index is brought up to date first (at most one chain check
 * every 20 s), so a play shows up here as soon as it has confirmed.
 * Each is null when it could not be read: a failed read is never reported as zero.
 */
type Counts = typeof songCounts;

export async function songStats(env: Env, id: number, counts: Counts = songCounts) {
  const c = await counts(env, [id], { wait: true });
  return { id, likes: likesFor(c, id), plays: paidPlaysFor(c, id) };
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
