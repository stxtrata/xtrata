/**
 * hiro-fetch.mjs — a fetch port that survives the rate limiter.
 *
 * WHY THIS EXISTS.
 *
 * The pipeline's gates read the chain back hard: verifying 24 plates is 48
 * read-only calls in a burst, and the first real plates run hit HTTP 429 on
 * call ~40. Every read after that failed, the gate reported `unavailable`, and
 * the pipeline halted with 24 perfectly good inscriptions on chain and nothing
 * wrong with any of them.
 *
 * That halt was correct -- an unread inscription is not a verified one, and
 * building on it would be the exact mistake the gates exist to prevent. But
 * halting a permanent, half-built graph because an API said "slow down" is a
 * bad trade when the fix is to slow down.
 *
 * So: attach the API key when one is configured, and back off and retry when
 * the answer is 429. Both are I/O concerns and neither belongs in the gate.
 *
 * THE KEY IS NEVER LOGGED.
 *
 * It is read from the environment, put straight into a header, and never
 * returned, printed or stored on the returned object. `describe()` says only
 * whether a key is present and how many are configured.
 */

/**
 * Statuses worth trying again.
 *
 * 429 is the rate limiter. The 5xx entries are the gateway having a moment;
 * they are transient by definition and a read is idempotent, so a retry costs
 * nothing but time. **4xx other than 429 is not here on purpose** -- a 400 or a
 * 404 is an answer, and retrying an answer is how a bug becomes a hang.
 */
const RETRYABLE = new Set([429, 502, 503, 504]);

/** Repo convention, from functions/lib/hiro-keys.ts. Both headers, same value. */
const KEY_HEADERS = ['x-hiro-api-key', 'x-api-key'];

const nonEmpty = (value) => (typeof value === 'string' && value.trim().length > 0 ? value.trim() : null);

const splitList = (value) => {
  const normalized = nonEmpty(value);
  return normalized ? normalized.split(/[\s,]+/).filter((entry) => entry.length > 0) : [];
};

/**
 * Every configured key, in the order the rest of the repo resolves them.
 *
 * Numbered keys first, then the plural, then the singular, then the Vite one.
 * Deduplicated, because the same key listed twice would make a rotation that
 * does not rotate.
 */
export function hiroApiKeys(env = {}) {
  const keys = [];
  const add = (values) => {
    for (const value of values) if (!keys.includes(value)) keys.push(value);
  };
  add(
    Object.entries(env)
      .map(([name, value]) => {
        const match = /^HIRO_API_KEY_(\d+)$/.exec(name);
        return match && nonEmpty(value) ? { index: Number(match[1]), value: nonEmpty(value) } : null;
      })
      .filter(Boolean)
      .sort((left, right) => left.index - right.index)
      .map((entry) => entry.value)
  );
  add(splitList(env.HIRO_API_KEYS));
  add(splitList(env.HIRO_API_KEY));
  add(splitList(env.VITE_HIRO_API_KEY));
  return keys;
}

/**
 * How long to wait before trying again.
 *
 * `Retry-After` is the server telling you the answer, so it wins outright when
 * present and sane. Otherwise exponential from `baseMs` with full jitter --
 * jitter because three wizards' worth of reads retrying in lockstep would
 * arrive together and be rate-limited together, which is a thundering herd of
 * three but a herd nonetheless.
 *
 * `random` is injected so a test can make this deterministic.
 */
export function backoffMs({ attempt, response = null, baseMs = 1_000, capMs = 30_000, random = Math.random }) {
  const header = response?.headers?.get?.('retry-after');
  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1_000, capMs);
    const at = Date.parse(header);
    if (Number.isFinite(at)) return Math.min(Math.max(0, at - Date.now()), capMs);
  }
  const ceiling = Math.min(baseMs * 2 ** attempt, capMs);
  return Math.floor(ceiling * random());
}

/**
 * A fetch that attaches the key, throttles, and retries a rate limit.
 *
 * `minIntervalMs` spaces requests even when nothing has failed yet. It is the
 * cheaper half of the fix: a burst that never trips the limiter needs no
 * backoff at all, and 120ms between reads costs about six seconds across a
 * whole 48-call gate.
 *
 * Returns the response, retryable or not, once attempts are exhausted. It does
 * not throw on a 429 -- the caller's own error handling already turns an
 * unreadable response into an `unavailable` result, and swapping that for an
 * exception would lose the distinction between "could not read" and "read
 * something wrong" that the gates depend on.
 */
export function makeHiroFetch({
  env = {},
  fetchImpl = globalThis.fetch,
  maxAttempts = 6,
  baseMs = 1_000,
  capMs = 30_000,
  minIntervalMs = 120,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now = () => Date.now(),
  random = Math.random,
  onRetry = () => {}
} = {}) {
  const keys = hiroApiKeys(env);
  let keyAt = 0;
  let nextAllowedAt = 0;
  const stats = { calls: 0, retries: 0, rateLimited: 0 };

  const fetchWithKey = async (url, init) => {
    if (keys.length === 0) return fetchImpl(url, init);
    const headers = new Headers(init?.headers ?? {});
    // Rotate on each attempt, so a second key (when configured) carries the
    // retry rather than the retry hammering the key that was just refused.
    const key = keys[keyAt % keys.length];
    for (const name of KEY_HEADERS) headers.set(name, key);
    return fetchImpl(url, { ...init, headers });
  };

  const throttle = async () => {
    if (minIntervalMs <= 0) return;
    const wait = nextAllowedAt - now();
    if (wait > 0) await sleep(wait);
    nextAllowedAt = now() + minIntervalMs;
  };

  return async function hiroFetch(url, init) {
    let response = null;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await throttle();
      stats.calls += 1;
      response = await fetchWithKey(url, init);
      if (!RETRYABLE.has(response.status)) return response;

      if (response.status === 429) stats.rateLimited += 1;
      if (attempt === maxAttempts - 1) break;

      const wait = backoffMs({ attempt, response, baseMs, capMs, random });
      stats.retries += 1;
      keyAt += 1;
      onRetry({ status: response.status, attempt: attempt + 1, waitMs: wait, url: String(url) });
      await sleep(wait);
      // Push the throttle window out too, so the next call does not fire the
      // instant the backoff ends and immediately trip the limiter again.
      nextAllowedAt = now() + minIntervalMs;
    }
    return response;
  };
}

/** What is configured, without ever revealing it. */
export function describeHiroKeys(env = {}) {
  const count = hiroApiKeys(env).length;
  return count === 0
    ? 'no Hiro API key configured; reads run at the anonymous rate limit'
    : `${count} Hiro API key${count === 1 ? '' : 's'} configured`;
}
