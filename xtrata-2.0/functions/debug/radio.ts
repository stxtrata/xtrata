import { queryAll, type Env } from '../lib/db';
import { configuredDebugKey, hasDebugAccess } from '../lib/debug-auth';
import { IDLE_MS, RULE_VERSION } from '../../src/lib/radio/play-rules';
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' } });
export async function onRequest({ request, env }: { request: Request; env: Env & { DEBUG_VIEW_KEY?: string } }) {
  const key = configuredDebugKey(env);
  if (!key) return reply({ error: 'Dashboard not configured' },503);
  if (!hasDebugAccess(request,key)) return reply({ error: 'Dashboard sign-in required' },401);
  if (request.method !== 'GET') return reply({ error: 'GET required' },405);
  const range = new URL(request.url).searchParams.get('range') || '24h';
  const now = Date.now(); let since: number;
  if (range === 'today') {
    // London civil midnight, including GMT/BST changes. No fixed-offset assumption.
    const date = new Intl.DateTimeFormat('en-CA',{ timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit' }).format(now);
    const midnight = Date.parse(date+'T00:00:00Z');
    const hour = Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',hourCycle:'h23'}).format(midnight));
    since = midnight-hour*3600000;
  } else {
    const hours = { '24h':24,'7d':168,'30d':720 }[range];
    if (!hours) return reply({ error: 'Choose 24h, today, 7d or 30d' },400);
    since = now-hours*3600000;
  }
  try {
    const tracks = await queryAll(env, `SELECT contract, token_id, source, rule_version,
      SUM(created_at>=? AND seconds>=2) AS starts,
      SUM(created_at>=? AND seconds>=2 AND qualified_at IS NULL AND (closed=1 OR updated_at<?)) AS partials,
      SUM(created_at>=? AND seconds>=2 AND qualified_at IS NULL AND closed=0 AND updated_at>=?) AS in_progress,
      COALESCE(SUM(qualified_at>=?),0) AS qualified_plays,
      COALESCE(SUM(completed_at>=?),0) AS completions,
      COUNT(DISTINCT CASE WHEN qualified_at>=? THEN browser_hash END) AS unique_browsers,
      SUM(CASE WHEN created_at>=? THEN seconds ELSE 0 END) AS session_listening_seconds
      FROM radio_plays WHERE created_at>=? OR qualified_at>=? OR completed_at>=?
      GROUP BY contract,token_id,source,rule_version ORDER BY qualified_plays DESC,starts DESC LIMIT 1000`,
      [since,since,now-IDLE_MS,since,now-IDLE_MS,since,since,since,since,since,since,since]);
    const daily = await queryAll(env, `SELECT strftime('%Y-%m-%d',qualified_at/1000,'unixepoch') AS day_utc,
      COUNT(*) AS qualified_plays, COUNT(DISTINCT browser_hash) AS unique_browsers
      FROM radio_plays WHERE qualified_at>=? GROUP BY day_utc ORDER BY day_utc`,[since]);
    return reply({ ruleVersion:RULE_VERSION,range,since,until:now,identity:'pseudonymous browser, not verified person',
      notice:'Client-reported analytics, not votes. Partial listens are closed/idle sessions. Listening seconds are attributed to session start; daily chart uses UTC qualification dates. Unique browsers are per track and source; do not sum them across rows.',
      tracks:tracks.results,daily:daily.results });
  } catch { return reply({ error:'Apply migration 011_radio_plays.sql to enable reporting.' },503); }
}
