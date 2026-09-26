import { jsonResponse } from '../../lib/utils';
import { cleanupAccess } from '../../lib/collection-storage/auth';
import { approveJob, getJob, quarantineJob, retainJob, scanObject, type Job } from '../../lib/collection-storage/cleanup';
import { rows, storageEnabled } from '../../lib/collection-storage/common';
import { scanCollection } from '../../lib/collection-storage/runner';

export const onRequest: PagesFunction = async ({ request, env, params }) => {
  const headers = { 'Cache-Control': 'private, no-store' };
  // Storage operations token only. A browser session is deliberately NOT enough:
  // inscribed HTML viewed on this origin could otherwise ride an admin's cookie.
  if (!cleanupAccess(request, env)) return jsonResponse({ error: 'Storage operations access required.' }, 401, headers);
  if (!storageEnabled(env)) return jsonResponse({ error: 'Verified storage is not enabled. Apply migration 010 and configure the storage worker.' }, 503, headers);
  const collectionId = String(params.collectionId ?? '');
  if (!collectionId) return jsonResponse({ error: 'Collection id required.' }, 400, headers);
  try {
    if (request.method === 'GET') {
      const cursor = new URL(request.url).searchParams.get('cursor') ?? '';
      const jobs = await rows<Job>(env, 'SELECT * FROM collection_cleanup_jobs WHERE collection_id=? AND job_id>? ORDER BY job_id LIMIT 51', [collectionId, cursor]);
      const page = jobs.slice(0, 50);
      return jsonResponse({ mode: env.COLLECTION_CLEANUP_MODE ?? 'report-only', jobs: page,
        nextCursor: jobs.length > 50 ? page[49].job_id : null }, 200, headers);
    }
    if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, headers);
    const payload = await request.json() as { action?: string; key?: string; jobId?: string; revision?: number; note?: string };
    if (payload.action === 'scan') return jsonResponse(await scanCollection(env, collectionId), 200, headers);
    if (payload.action === 'flag' && typeof payload.key === 'string') return jsonResponse(await scanObject(env, collectionId, payload.key), 200, headers);
    const job = payload.jobId ? await getJob(env, payload.jobId) : null;
    if (!job || job.collection_id !== collectionId) return jsonResponse({ error: 'Cleanup item not found.' }, 404, headers);
    if (!Number.isSafeInteger(payload.revision) || payload.revision !== job.revision) throw new Error('Queue changed. Refresh before acting.');
    const note = String(payload.note ?? '').trim();
    if (!note) throw new Error('A review note is required.');
    if (payload.action === 'retain') return jsonResponse(await retainJob(env, job.job_id, job.revision, note), 200, headers);
    if (payload.action === 'approve') return jsonResponse(await approveJob(env, job.job_id, job.revision, note), 200, headers);
    if (payload.action === 'quarantine') return jsonResponse(await quarantineJob(env, job.job_id), 200, headers);
    return jsonResponse({ error: 'Unsupported action.' }, 400, headers);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Cleanup failed; copies retained.' }, 409, headers);
  }
};
