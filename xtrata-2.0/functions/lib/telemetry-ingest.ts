/**
 * Pure helpers for the /log telemetry ingest endpoint (functions/log.ts).
 * Kept separate from the route so they are unit-testable without a live D1
 * binding (tests: functions/lib/__tests__/telemetry-ingest.test.ts).
 */
export const MAX_EVENTS = 50;
export const MAX_STR = 2000;
export const MAX_BODY_BYTES = 128_000;

export const clamp = (value: unknown, max = MAX_STR): string | null =>
  typeof value === 'string' && value.length > 0 ? value.slice(0, max) : null;

export const num = (value: unknown, fallback: number | null = null): number | null => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// Defence in depth: never persist seed phrases, signatures / serialized txs, or
// explicit secret-y key/value pairs, even if a caller somehow includes them.
const SECRET_PATTERNS: Array<[RegExp, string]> = [
  [/\b([a-z]+\s){11,23}[a-z]+\b/gi, '<redacted-phrase>'],
  [/\bS[PT][0-9A-Z]{20,}(?:\.[a-zA-Z0-9_-]+)?\b/g, '<redacted-address>'],
  [/\b(?:xprv|tprv)[1-9A-HJ-NP-Za-km-z]{80,}\b/g, '<redacted-private-key>'],
  [/\b[5KL][1-9A-HJ-NP-Za-km-z]{50,51}\b/g, '<redacted-private-key>'],
  [/\b[0-9a-fA-F]{64,}\b/g, '<redacted-hex>'],
  [/(private|secret|seed|mnemonic|signature|priv[_-]?key)\S*\s*[:=]\s*\S+/gi, '<redacted-secret>']
];
export const scrub = (value: string | null): string | null =>
  value == null
    ? null
    : SECRET_PATTERNS.reduce((acc, [re, rep]) => acc.replace(re, rep), value).slice(0, MAX_STR);

export async function hashWallet(
  address: string | null,
  salt: string | undefined
): Promise<string | null> {
  if (!address || !salt) return null;
  const bytes = new TextEncoder().encode(`${salt}${address.toUpperCase()}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Coarse, non-identifying user-agent classification.
export function parseUa(ua: string): { browser: string; os: string; device: string } {
  const browser = /Edg\//.test(ua)
    ? 'edge'
    : /OPR\//.test(ua)
      ? 'opera'
      : /Firefox\//.test(ua)
        ? 'firefox'
        : /Chrome\//.test(ua)
          ? 'chrome'
          : /Safari\//.test(ua)
            ? 'safari'
            : 'other';
  const os = /Windows/.test(ua)
    ? 'windows'
    : /Android/.test(ua)
      ? 'android'
      : /(iPhone|iPad|iPod)/.test(ua)
        ? 'ios'
        : /Mac OS X/.test(ua)
          ? 'macos'
          : /Linux/.test(ua)
            ? 'linux'
            : 'other';
  const device = /Mobi|Android|iPhone|iPod/.test(ua)
    ? 'mobile'
    : /iPad|Tablet/.test(ua)
      ? 'tablet'
      : 'desktop';
  return { browser, os, device };
}

// Same-origin abuse gate. Fail-open on missing headers (proxies strip them);
// block only explicit cross-site posts.
export function isCrossSite(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site');
  if (site === 'cross-site') return true;
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).host !== new URL(request.url).host;
    } catch {
      return true;
    }
  }
  return false;
}

export function safeJson(value: unknown): string | null {
  if (value == null) return null;
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export function isValidEvent(ev: unknown): ev is Record<string, unknown> {
  const record = ev as Record<string, unknown> | null;
  return (
    !!record &&
    typeof record.flow === 'string' &&
    record.flow.length > 0 &&
    typeof record.sessionId === 'string' &&
    record.sessionId.length > 0 &&
    typeof record.outcome === 'string' &&
    ['start', 'success', 'error', 'abandon', 'info'].includes(record.outcome)
  );
}

export const EVENT_INSERT_SQL = `INSERT OR IGNORE INTO telemetry_events
  (event_id, ts, received_at, session_id, journey_id, attempt, flow, step, outcome, severity,
   target, duration_ms, error_code, error_fingerprint, error_message, error_stack,
   app_version, route, wallet_hash, wallet_prefix, wallet_kind, network,
   ua_browser, ua_os, device, country, context_json)
 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

export const RETENTION_PURGE_SQL = `DELETE FROM telemetry_events
 WHERE (severity IN ('debug','info') AND received_at < ?)
    OR received_at < ?`;

export interface IngestContext {
  now: number;
  browser: string;
  os: string;
  device: string;
  country: string | null;
  walletHash: string | null;
  eventId: string;
}

export function eventBinds(ev: Record<string, unknown>, ctx: IngestContext): unknown[] {
  return [
    ctx.eventId,
    num(ev.ts, ctx.now),
    ctx.now,
    scrub(clamp(ev.sessionId, 60)),
    scrub(clamp(ev.journeyId, 60)),
    num(ev.attempt, 1),
    scrub(clamp(ev.flow, 40)),
    scrub(clamp(ev.step, 40)),
    scrub(clamp(ev.outcome, 20)),
    scrub(clamp(ev.severity, 10)) ?? 'info',
    scrub(clamp(ev.target, 200)),
    num(ev.durationMs),
    scrub(clamp(ev.errorCode, 60)),
    clamp(ev.errorFingerprint, 32),
    scrub(clamp(ev.errorMessage)),
    scrub(clamp(ev.errorStack, 4000)),
    scrub(clamp(ev.appVersion, 40)),
    scrub(clamp(ev.route, 200)),
    ctx.walletHash,
    null,
    scrub(clamp(ev.walletKind, 20)),
    scrub(clamp(ev.network, 20)),
    ctx.browser,
    ctx.os,
    ctx.device,
    ctx.country,
    scrub(clamp(safeJson(ev.context), 4000))
  ];
}
