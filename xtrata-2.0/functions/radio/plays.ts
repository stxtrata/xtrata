import { queryAll, run, type Env } from '../lib/db';
import { classify, coverage, mergeSpans, RULE_VERSION, IDLE_MS, type Span } from '../../src/lib/radio/play-rules';
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
export const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
type Row = { session_id: string; browser_hash: string; contract: string; token_id: number; source: string; duration: number; sequence: number; seconds: number; spans: string; created_at: number; updated_at: number; closed: number };
export async function onRequest({ request, env }: { request: Request; env: Env & { RADIO_COUNTER_ENABLED?: string; TELEMETRY_SALT?: string } }) {
  if (env.RADIO_COUNTER_ENABLED !== '1' || !env.TELEMETRY_SALT) return reply({ enabled: false }, 503);
  if (request.method !== 'POST') return reply({ error: 'POST required' }, 405);
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Same origin required' }, 403);
  try {
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'JSON required' }, 415);
    // Bound streamed bodies too, not just a caller-supplied Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: 'Body required' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const r = await reader.read(); if (r.done) break; size += r.value.length; if (size > 16000) { await reader.cancel(); return reply({ error: 'Too large' }, 413); } chunks.push(r.value); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let b;
    try { b = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply({ error: 'Invalid JSON' },400); }
    if (!b || !UUID.test(b.sessionId) || !UUID.test(b.browserId) || !/^S[PM][0-9A-Z]+\.[a-z0-9-]+$/.test(b.contract) || !Number.isSafeInteger(b.tokenId) || b.tokenId < 1 || b.tokenId > 10_000_000 || !['radio','embed'].includes(b.source) || b.ruleVersion !== RULE_VERSION || !Number.isSafeInteger(b.sequence) || b.sequence < 0 || b.sequence > 100000 || !Number.isFinite(b.duration) || b.duration <= 0 || b.duration > 86400 || !Number.isFinite(b.seconds) || b.seconds < 0 || b.seconds > 86400 || typeof b.closed !== 'boolean' || !Array.isArray(b.spans) || b.spans.length > 256) return reply({ error: 'Invalid observation' }, 400);
    for (const span of b.spans) if (!Array.isArray(span) || span.length !== 2 || !span.every(Number.isFinite) || span[0] < 0 || span[1] <= span[0] || span[1] > b.duration + 0.01) return reply({ error: 'Invalid coverage' }, 400);
    const spans: Span[] = mergeSpans(b.spans);
    if (coverage(spans) > b.seconds * 4 + 0.5) return reply({ error: 'Impossible coverage' }, 400);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(env.TELEMETRY_SALT + ':' + b.browserId));
    const browser = [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2, '0')).join('');
    const now = Date.now();
    const result = await queryAll(env, 'SELECT * FROM radio_plays WHERE session_id=?', [b.sessionId]);
    const old = (result.results as Row[])[0];
    if (!old) {
      if (b.sequence !== 0 || b.seconds !== 0 || spans.length || b.closed) return reply({ error: 'Start session first' }, 409);
      await run(env, `INSERT OR IGNORE INTO radio_plays
        (session_id,browser_hash,contract,token_id,source,rule_version,duration,sequence,created_at,updated_at)
        SELECT ?,?,?,?,?,?,?,0,?,? WHERE
        (SELECT COUNT(*) FROM radio_plays WHERE browser_hash=? AND created_at>?) < 120`,
        [b.sessionId,browser,b.contract,b.tokenId,b.source,RULE_VERSION,b.duration,now,now,browser,now-3600000]);
      const inserted = await queryAll(env, 'SELECT browser_hash FROM radio_plays WHERE session_id=?', [b.sessionId]);
      await run(env, 'DELETE FROM radio_plays WHERE session_id IN (SELECT session_id FROM radio_plays WHERE created_at<? ORDER BY created_at LIMIT 500)', [now-90*86400000]);
      if (!inserted.results?.length) return reply({ error: 'Session rate limit' }, 429);
      if ((inserted.results[0] as { browser_hash: string }).browser_hash !== browser) return reply({ error: 'Session conflict' }, 409);
    } else {
      if (old.browser_hash !== browser || old.contract !== b.contract || old.token_id !== b.tokenId || old.source !== b.source || old.duration !== b.duration) return reply({ error: 'Session identity changed' }, 409);
      if (b.sequence <= old.sequence) return reply({ ok: true, duplicate: true });
      if (old.closed || now-old.updated_at > IDLE_MS) return reply({ error: 'Session closed or expired' }, 410);
      if (b.seconds < old.seconds || b.seconds-old.seconds > (now-old.updated_at)/1000 + 2 || b.seconds > (now-old.created_at)/1000 + 2) return reply({ error: 'Impossible listening time' }, 400);
      if (b.seconds > old.seconds && now-old.updated_at < 750) return reply({ error: 'Heartbeat rate limit' },429);
      const oldSpans: Span[] = JSON.parse(old.spans);
      if (coverage(spans)-coverage(oldSpans) > (b.seconds-old.seconds)*4 + 0.01) return reply({ error: 'Coverage grew without listening' },400);
      if (coverage(mergeSpans([...spans,...oldSpans])) > coverage(spans)+0.01) return reply({ error: 'Coverage cannot decrease' }, 400);
      const c = classify(b.seconds,b.duration,spans);
      // Optimistic concurrency and overlap exclusion are inside the same SQL write.
      // No two simultaneous updates can both credit the same browser's listening interval.
      await run(env, `UPDATE radio_plays SET sequence=?,seconds=?,spans=?,updated_at=?,closed=?,
        qualified_at=CASE WHEN qualified_at IS NULL AND ? THEN ? ELSE qualified_at END,
        completed_at=CASE WHEN completed_at IS NULL AND ? THEN ? ELSE completed_at END
        WHERE session_id=? AND sequence=? AND NOT EXISTS
        (SELECT 1 FROM radio_plays other WHERE other.browser_hash=? AND other.session_id<>?
          AND other.seconds>0 AND other.updated_at>?)`,
        [b.sequence,b.seconds,JSON.stringify(spans),now,b.closed?1:0,c.qualified?1:0,now,c.completed?1:0,now,b.sessionId,old.sequence,browser,b.sessionId,now-Math.max(0,b.seconds-old.seconds)*1000]);
      const saved = await queryAll(env, 'SELECT sequence FROM radio_plays WHERE session_id=?', [b.sessionId]);
      if (Number((saved.results?.[0] as { sequence: number } | undefined)?.sequence) !== b.sequence) return reply({ error: 'Concurrent playback or update; retry' }, 409);
    }
    return reply({ ok: true, ruleVersion: RULE_VERSION });
  } catch { return reply({ error: 'Counter temporarily unavailable or invalid request' }, 503); }
}
