import { readCreatorSession } from './creator-auth';
import type { Env } from './db';
import { jsonResponse } from './utils';
import { royaltyCollections, ROYALTIES_ROOT } from '../../src/music-artist/routes';
import { handleRoyalties, type RoyaltyDependencies } from '../api/audionaut-royalties';

const PRIVATE = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };
/** Identity grants entry to the portal; each ledger checks its own payee rules. */
export async function handleArtistSources(request: Request, env: Env,
  view: 'overview' | 'collections' | 'plays', session = readCreatorSession) {
  const reply = (body: unknown, status = 200) => jsonResponse(body, status, PRIVATE);
  if (request.method !== 'GET') return reply({ error: 'Method not allowed.' }, 405);
  const auth = await session(request, env);
  if (!auth.ok) return reply({ error: 'Sign-in is temporarily unavailable.' }, 503);
  if (!auth.session) return reply({ error: 'Sign in to the artist portal.' }, 401);
  if (view === 'plays') return reply({ available: false, message: 'Artist pay-per-play reporting is being prepared.' });
  // Discovery only. Financial data is read through each collection's verifier.
  return reply({ collections: royaltyCollections, ...(view === 'overview' ? {
    plays: { available: false, path: ROYALTIES_ROOT + 'plays/' }
  } : {}) });
}

export function handleArtistCollection(request: Request, env: Env, id: string,
  deps?: RoyaltyDependencies) {
  const collection = royaltyCollections.find(collection => collection.id === id);
  if (!collection) return jsonResponse({ error: 'Unknown royalty collection.' }, 404, PRIVATE);
  // Register a separate verifier when adding a collection with a different rule.
  const verifiers: Record<string, typeof handleRoyalties> = { 'audionauts-1-0': handleRoyalties };
  const verify = verifiers[id];
  if (!verify) return jsonResponse({ error: 'This collection’s royalty verifier is not available yet.' }, 503, PRIVATE);
  return verify(request, env, deps);
}
