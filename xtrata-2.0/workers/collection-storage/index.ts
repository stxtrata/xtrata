import { runStorageSweep } from '../../functions/lib/collection-storage/runner';
import { cleanupAccess } from '../../functions/lib/collection-storage/auth';
import type { Env } from '../../functions/lib/db';
export default {
  async scheduled(_event: unknown, env: Env, context: { waitUntil(promise: Promise<unknown>): void }) {
    context.waitUntil(runStorageSweep(env).then(result => {
      if ('scanned' in result && result.scanned.some(item => item && 'error' in item))
        throw new Error('Storage discovery failed for one or more objects. Inspect the authenticated sweep result and storage bindings.');
    }));
  },
  async fetch(request: Request, env: Env) {
    if (request.method !== 'POST' || !cleanupAccess(request, env, true)) return new Response('Unauthorized', { status: 401 });
    try { return Response.json(await runStorageSweep(env), { headers: { 'Cache-Control': 'no-store' } }); }
    catch { return Response.json({ error: 'Sweep failed. Staging/recovery copies remain protected; inspect the review queue.' }, { status: 503 }); }
  }
};
