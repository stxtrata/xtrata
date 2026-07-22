/**
 * Telemetry ingest — Cloudflare Pages Function.  POST /log
 *
 * Receives batched, beacon-delivered events from the client SDK
 * (src/lib/telemetry). Writes one append-only row per event into D1
 * `telemetry_events`, plus a dedup upsert into `telemetry_issues` for errors.
 * Returns 204 fast and NEVER surfaces a failure to the client — telemetry must
 * be invisible to the person using the site.
 *
 * Privacy: raw wallet addresses, signatures, keys and seed material never land
 * here. `wallet_hash` = sha256(TELEMETRY_SALT || address), salt is a Pages
 * secret (wrangler pages secret put TELEMETRY_SALT — set for Production AND
 * Preview), so stored hashes are non-reversible and not brute-forceable.
 *
 * Abuse gate (defence in depth):
 *   1. Same-origin check (isCrossSite) — drops obvious cross-site posts.
 *   2. Per-request event + per-field size clamps (telemetry-ingest.ts).
 *   3. A Cloudflare rate-limiting rule on POST /log (dashboard: Security -> WAF
 *      -> Rate limiting rules; e.g. 60 requests / 10s / IP). See the PLAN doc.
 */
import { jsonResponse } from './lib/utils';
import { run, type Env as DbEnv } from './lib/db';
import {
  EVENT_INSERT_SQL,
  MAX_BODY_BYTES,
  MAX_EVENTS,
  RETENTION_PURGE_SQL,
  clamp,
  eventBinds,
  hashWallet,
  isCrossSite,
  isValidEvent,
  parseUa,
  scrub
} from './lib/telemetry-ingest';

type Env = DbEnv & { TELEMETRY_SALT?: string };

export const onRequest: PagesFunction = async ({ request, env }) => {
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);
  if (isCrossSite(request)) return new Response(null, { status: 204 });
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 204 });
  }

  const e = env as Env;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(null, { status: 204 });
  }

  const rawEvents = (payload as { events?: unknown } | null)?.events;
  const events = Array.isArray(rawEvents) ? rawEvents.slice(0, MAX_EVENTS) : [];
  if (events.length === 0) return new Response(null, { status: 204 });

  const now = Date.now();
  const cf = (request as unknown as { cf?: { country?: string } }).cf;
  const country = clamp(cf?.country, 4);
  const { browser, os, device } = parseUa(request.headers.get('user-agent') ?? '');

  const writes: Array<Promise<unknown>> = [];
  for (const raw of events) {
    if (!isValidEvent(raw)) continue;
    const ev = raw;
    const walletHash = await hashWallet(clamp(ev.walletAddress), e.TELEMETRY_SALT);
    const eventId = scrub(clamp(ev.eventId, 60)) ?? crypto.randomUUID();
    const ctx = { now, browser, os, device, country, walletHash, eventId };

    writes.push(run(e, EVENT_INSERT_SQL, eventBinds(ev, ctx)));
  }
  if (writes.length === 0) return new Response(null, { status: 204 });

  try {
    await Promise.all(writes);
    const infoCutoff = now - 90 * 24 * 60 * 60 * 1000;
    const absoluteCutoff = now - 180 * 24 * 60 * 60 * 1000;
    await run(e, RETENTION_PURGE_SQL, [infoCutoff, absoluteCutoff]);
  } catch {
    // Never fail the client on telemetry.
  }
  return new Response(null, { status: 204 });
};
