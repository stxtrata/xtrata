import {handleMusicStats, type StatsEnv} from '../lib/music-stats';

// GET /api/music-stats: public totals for the homepage banner and hero.
// env carries the whole Pages environment (D1 binding and any HIRO_API_KEY* secrets).
export async function onRequest(context: {request: Request; env: StatsEnv; waitUntil?: (promise: Promise<unknown>) => void}) {
  // Call waitUntil through the context: detached from it the runtime refuses ("Illegal invocation").
  const waitUntil = context.waitUntil ? (promise: Promise<unknown>) => context.waitUntil!(promise) : undefined;
  return handleMusicStats(context.request, context.env, fetch, Date.now(), waitUntil);
}
