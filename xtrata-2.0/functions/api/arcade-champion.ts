import {handleChampion} from '../lib/arcade-champion';

// GET /api/arcade-champion: the Astro Blaster 3 all-time #1, for the homepage hero.
export async function onRequest(context: {env: Record<string, unknown>}) {
  return handleChampion(context.env);
}
