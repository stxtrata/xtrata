import { queryAll } from '../lib/db';
import type { RuntimeEnv } from '../runtime/lib';

// /index/playable?contract=<addr.name> — the radio's station list, in ONE D1 query.
//
// SONGS ONLY: returns sealed tokens whose mime is audio/* (mp3, opus, weba…)
// plus text/html (candidate players; the client's probe remains the
// gatekeeper). video/* is deliberately excluded — "film audio" was the main
// source of silent/dud tunes. Community-reported duds (radio_verdicts, fed by
// POST /index/verdict) are subtracted server-side, so every listener benefits
// from every other listener's failed tune attempts.
//
// Freshness model: the index is populated incrementally from the core's
// APPEND-ONLY minted-id list by the existing /index/<contract> lazy sync, i.e.
// it only ever has to look from the last-synced id forward for new mints. This
// endpoint only READS D1, then nudges that sync in the background, so a freshly
// inscribed song shows up here within a request cycle — no full rescans, ever.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS, ...extra }
  });

type PlayableRow = { token_id: number; mime: string | null; total_size: number | null };

export const onRequest = async (context: {
  request: Request;
  env: RuntimeEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
}) => {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET') return json({ error: 'GET only.' }, 405);

  const url = new URL(request.url);
  const contractId = (url.searchParams.get('contract') || '').trim();
  if (!/^S[PM][0-9A-Z]+\.[a-z0-9-]+$/.test(contractId)) return json({ error: 'Invalid contract id.' }, 400);

  // Edge cache: one entry per contract; 60 s fresh + SWR keeps the station list
  // effectively instant while new mints flow in via the background sync nudge.
  const cacheKey = new Request(url.origin + '/index/playable?contract=' + encodeURIComponent(contractId), { method: 'GET' });
  const edgeCache = (globalThis as { caches?: { default?: Cache } }).caches?.default ?? null;
  if (edgeCache) {
    const hit = await edgeCache.match(cacheKey);
    if (hit) return hit;
  }

  try {
    const rows = await queryAll(
      env,
      `SELECT token_id, mime, total_size FROM inscription_index
        WHERE contract = ? AND sealed = 1
          AND (mime LIKE 'audio/%' OR mime LIKE 'text/html%')
        ORDER BY token_id ASC`,
      [contractId]
    );
    // Community dud memory — tolerate the table not existing yet (pre-migration).
    let dudSet = new Set<number>();
    try {
      const dudRows = await queryAll(env, 'SELECT token_id FROM radio_verdicts WHERE contract = ? AND verdict = ?', [contractId, 'dud']);
      dudSet = new Set(((dudRows.results ?? []) as Array<{ token_id: number }>).map((r) => r.token_id));
    } catch { /* migration 008 not applied yet */ }
    const stateRes = await queryAll(
      env,
      'SELECT minted_count, synced_count, updated_at FROM inscription_index_state WHERE contract = ?',
      [contractId]
    );
    const state = (stateRes.results ?? [])[0] as { minted_count?: number; synced_count?: number; updated_at?: number } | undefined;

    const audio: number[] = [];
    const html: number[] = [];
    for (const r of (rows.results ?? []) as PlayableRow[]) {
      if (dudSet.has(r.token_id)) continue;
      const mime = (r.mime || '').toLowerCase();
      if (mime.startsWith('audio/')) audio.push(r.token_id);
      else html.push(r.token_id);
    }

    // Nudge the incremental sync (append-only: it resumes from synced_count) so
    // the NEXT read of this list already includes anything minted since.
    const nudge = fetch(url.origin + '/index/' + contractId + '?from=1&limit=1').then(
      (r) => r.body?.cancel(),
      () => undefined
    );
    if (context.waitUntil) context.waitUntil(nudge);

    const body = json(
      {
        contract: contractId,
        audio,                       // audio/* only — songs and weba film-audio, playable as-is
        html,                        // text/html — candidate players (client probes)
        duds: [...dudSet],           // community-reported unplayables (client pre-seeds its cache)
        mintedCount: state?.minted_count ?? 0,
        syncedCount: state?.synced_count ?? 0,
        updatedAt: state?.updated_at ?? null
      },
      200,
      { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' }
    );
    if (edgeCache) { try { await edgeCache.put(cacheKey, body.clone()); } catch { /* best-effort */ } }
    return body;
  } catch (error) {
    return json({ error: String(error instanceof Error ? error.message : error) }, 500);
  }
};
