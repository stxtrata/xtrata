/**
 * Casino round log ingest — Cloudflare Pages Function.  POST /casino/log
 *
 * The ParallaX Casino pages (/casino and /casino-b) send batches of what just happened: spins, bonus payouts, gambles,
 * LAYR purchases and bankroll moves. Each valid event becomes one append-only row in D1 `casino_events`
 * (functions/migrations/033_casino_events.sql). Plain-language guide: docs/plans/CASINO-ROUND-LOG.md.
 *
 * This is a CLIENT-REPORTED log for statistics. It is not proof: a modified browser can send false numbers. The planned
 * proof is on-chain settlement (docs/plans/CASINO-ONCHAIN-LAYR-PLAN.md).
 *
 * Like the telemetry endpoint it follows (functions/log.ts), it answers 204 to everything it does not reject for the
 * method, and NEVER surfaces a failure: the casino must carry on if the table has not been created yet, D1 is down, or a
 * request is malformed. Nothing about the sender is stored beyond the event itself (no IP, no user agent).
 *
 * Abuse gate (defence in depth):
 *   1. Same-origin check (isCrossSite) — drops obvious cross-site posts.
 *   2. Body, event-count and field clamps (casino-ingest.ts); duplicates are ignored (UNIQUE pid, sid, seq).
 *   3. A Cloudflare rate-limiting rule on POST /casino/log (dashboard: Security -> WAF -> Rate limiting rules).
 *   4. Kill switch: set CASINO_LOG_DISABLED to "1" (Pages variable) and the endpoint answers 204 and writes nothing.
 */
import { jsonResponse } from '../lib/utils';
import { runBatch, type Env as DbEnv } from '../lib/db';
import { isCrossSite } from '../lib/telemetry-ingest';
import { CASINO_INSERT_SQL, MAX_BODY_BYTES, prepareIngest } from '../lib/casino-ingest';

type Env = DbEnv & { CASINO_LOG_DISABLED?: string };

const noContent = () => new Response(null, { status: 204 });

export const onRequest: PagesFunction = async ({ request, env, waitUntil }) => {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }
  const e = env as Env;
  if (e.CASINO_LOG_DISABLED === '1') return noContent();
  if (isCrossSite(request)) return noContent();
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return noContent();

  let payload: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return noContent();
    payload = JSON.parse(text);
  } catch {
    return noContent();
  }

  const prepared = prepareIngest(payload, Date.now());
  if (!prepared) return noContent();

  const write = runBatch(
    e,
    prepared.rows.map((binds) => ({ sql: CASINO_INSERT_SQL, binds }))
  ).catch((err: unknown) => {
    // Table not created yet, D1 trouble, anything: the visitor never hears about it.
    console.warn('casino log write failed', err instanceof Error ? err.message : err);
  });
  if (typeof waitUntil === 'function') waitUntil(write);
  else await write;
  return noContent();
};
