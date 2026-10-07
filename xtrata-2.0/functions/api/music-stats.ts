import {handleMusicStats, type StatsEnv} from '../lib/music-stats';

// GET /api/music-stats: public totals for the homepage banner and hero.
export async function onRequest({request, env, waitUntil}: {request: Request; env: StatsEnv; waitUntil?: (promise: Promise<unknown>) => void}) {
  return handleMusicStats(request, env, fetch, Date.now(), waitUntil);
}
