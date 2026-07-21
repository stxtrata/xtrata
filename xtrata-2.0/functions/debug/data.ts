/**
 * Read model for the /debug dashboard. GET /debug/data?range=24h|7d|30d
 *
 * Returns pre-aggregated JSON (KPIs, top unique issues, recovery rate, failure
 * funnels, a daily trend, and the latest crash-outs) computed from D1. Read-only.
 *
 * Access is fail-closed. DEBUG_VIEW_KEY must be configured and a matching
 * x-debug-key header or HttpOnly dashboard cookie is required.
 */
import { jsonResponse } from '../lib/utils';
import { queryAll, type Env as DbEnv } from '../lib/db';
import { configuredDebugKey, hasDebugAccess } from '../lib/debug-auth';

type Env = DbEnv & { DEBUG_VIEW_KEY?: string };

const RANGES: Record<string, number> = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 };

function rows<T = Record<string, unknown>>(res: unknown): T[] {
  return ((res as { results?: T[] } | null)?.results ?? []) as T[];
}
const int = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const onRequest: PagesFunction = async ({ request, env }) => {
  const e = env as Env;
  const url = new URL(request.url);

  const debugKey = configuredDebugKey(e);
  if (!debugKey) {
    return jsonResponse({ ready: false, secured: true, misconfigured: true }, 503, {
      'Cache-Control': 'private, no-store'
    });
  }
  if (!hasDebugAccess(request, debugKey)) {
    return jsonResponse({ ready: false, secured: true, unauthorized: true }, 401, {
      'Cache-Control': 'private, no-store'
    });
  }

  const rangeKey = RANGES[url.searchParams.get('range') ?? '7d']
    ? (url.searchParams.get('range') ?? '7d')
    : '7d';
  const hours = RANGES[rangeKey];
  const since = Date.now() - hours * 3_600_000;

  try {
    const [totals, kpiErr, recovery, topIssues, byFlow, funnelRows, trend, recent] =
      await Promise.all([
        queryAll(
          e,
          `SELECT COUNT(*) AS events, SUM(outcome='error') AS errors,
                COUNT(DISTINCT session_id) AS sessions,
                COUNT(DISTINCT CASE WHEN outcome='error' THEN wallet_hash END) AS wallets_affected
         FROM telemetry_events WHERE received_at > ?`,
          [since]
        ),
        queryAll(
          e,
          `SELECT COUNT(DISTINCT error_fingerprint) AS distinct_issues,
                COUNT(DISTINCT session_id) AS sessions_hit
         FROM telemetry_events WHERE received_at > ? AND outcome='error'`,
          [since]
        ),
        queryAll(
          e,
          `WITH j AS (
           SELECT journey_id,
                  MAX(CASE WHEN outcome='error' THEN ts END) AS last_error,
                  MAX(CASE WHEN outcome='success' THEN ts END) AS last_success
           FROM telemetry_events
           WHERE journey_id IS NOT NULL AND received_at > ?
           GROUP BY journey_id)
         SELECT SUM(last_error IS NOT NULL) AS errored,
                SUM(last_error IS NOT NULL AND last_success > last_error) AS recovered
         FROM j`,
          [since]
        ),
        queryAll(
          e,
          `SELECT error_fingerprint AS fingerprint, flow, step, error_code AS errorCode,
                MIN(error_message) AS sample, COUNT(*) AS occurrences,
                COUNT(DISTINCT session_id) AS sessions,
                COUNT(DISTINCT wallet_hash) AS wallets, MAX(received_at) AS lastSeen
         FROM telemetry_events
         WHERE outcome='error' AND received_at > ?
         GROUP BY error_fingerprint ORDER BY occurrences DESC LIMIT 25`,
          [since]
        ),
        queryAll(
          e,
          `SELECT flow, SUM(outcome='error') AS errors, COUNT(*) AS events
         FROM telemetry_events WHERE received_at > ?
         GROUP BY flow ORDER BY errors DESC`,
          [since]
        ),
        queryAll(
          e,
          `SELECT flow, step,
                SUM(outcome='start') AS started, SUM(outcome='success') AS succeeded,
                SUM(outcome='error') AS errored, SUM(outcome='abandon') AS abandoned
         FROM telemetry_events
         WHERE received_at > ? AND step IS NOT NULL
         GROUP BY flow, step ORDER BY flow, started DESC`,
          [since]
        ),
        queryAll(
          e,
          `SELECT date(received_at/1000,'unixepoch') AS day,
                SUM(outcome='error') AS errors, COUNT(*) AS events
         FROM telemetry_events WHERE received_at > ?
         GROUP BY day ORDER BY day`,
          [since]
        ),
        queryAll(
          e,
          `SELECT received_at AS ts, flow, step, error_code AS errorCode, error_message AS sample,
                wallet_kind AS walletKind, country, device, ua_browser AS browser
         FROM telemetry_events WHERE outcome='error' AND received_at > ?
         ORDER BY received_at DESC LIMIT 20`,
          [since]
        )
      ]);

    const t = rows(totals)[0] ?? {};
    const k = rows(kpiErr)[0] ?? {};
    const r = rows(recovery)[0] ?? {};
    const errored = int(r.errored);
    const recovered = int(r.recovered);

    const funnelMap: Record<string, unknown[]> = {};
    for (const row of rows<{ flow: string }>(funnelRows)) {
      (funnelMap[row.flow] ??= []).push(row);
    }
    const funnels = Object.keys(funnelMap).map((flow) => ({ flow, steps: funnelMap[flow] }));

    return jsonResponse(
      {
        ready: true,
        secured: true,
        generatedAt: Date.now(),
        range: rangeKey,
        rangeHours: hours,
        kpis: {
          crashOuts: int(t.errors),
          totalEvents: int(t.events),
          distinctIssues: int(k.distinct_issues),
          sessionsAffected: int(k.sessions_hit),
          sessionsTotal: int(t.sessions),
          walletsAffected: int(t.wallets_affected),
          erroredJourneys: errored,
          recoveredJourneys: recovered,
          gaveUpJourneys: Math.max(0, errored - recovered),
          recoveryPct: errored ? Math.round((recovered / errored) * 100) : null
        },
        topIssues: rows(topIssues),
        byFlow: rows(byFlow),
        funnels,
        trend: rows(trend),
        recentErrors: rows(recent)
      },
      200,
      { 'Cache-Control': 'private, no-store' }
    );
  } catch (err) {
    return jsonResponse(
      {
        ready: false,
        secured: true,
        reason: err instanceof Error ? err.message : 'query failed',
        hint: 'Apply functions/migrations/009_telemetry.sql to the xtrata-manage D1 database.'
      },
      200
    );
  }
};
