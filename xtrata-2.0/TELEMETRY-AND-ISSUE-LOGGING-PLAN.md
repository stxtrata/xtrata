# Xtrata — Backend Issue & Journey Logging

**A design for capturing every user "crash-out," the path that led to it, whether they retried, whether they eventually succeeded, and what was learned — all filterable and sortable so you can optimise iteratively on real data.**

Status: **Phase 0–2 + the `/debug` dashboard are BUILT** in `xtrata-2.0. The four hot flows (`wallet_connect`, `drop_claim`, `market_buy`, `mint`) are instrumented; only the issue-triage write controls remain. Target repo: `xtrata-2.0`.

> **What's live in the repo now:** the D1 migration (`009_telemetry.sql`), the ingest endpoint (`POST /log`) with wallet hashing + free-form-field scrubbing + a same-origin gate, the dependency-free client SDK (`src/lib/telemetry/`) wired into `main.tsx` (global error net + `TelemetryBoundary`), and the plain-language health dashboard at **`/debug`** with its JSON read endpoint. To go live: apply the migration, set strong `TELEMETRY_SALT` and `DEBUG_VIEW_KEY` secrets, add the edge rate-limit rule, and deploy. See §13 + Appendix B for the exact file list and secrets.

---

## 0. Defaults I assumed (change any of these and I'll re-cut)

You skipped the setup questions, so I picked sensible defaults and designed around them. All four are cheap to change:

| Decision | Default chosen | Why | Cost to change |
|---|---|---|---|
| Where data lives | **Cloudflare D1** (your existing `DB`) | No new vendor, stays on Cloudflare, fully SQL-filterable, joins to your collection tables. Your `functions/lib/db.ts` helpers already do exactly this. | Add an Analytics-Engine sink later for high-volume sampled metrics — the client/ingest contract doesn't change. |
| Wallet addresses | **Salted server-side hash only** | Correlate retries and count distinct wallets without persisting a raw or partial address. | Drop the wallet field entirely for anonymous-only telemetry. |
| How you read it | **Both** — saved SQL + a light `/manage` telemetry page | SQL for ad-hoc digging today; dashboard for at-a-glance triage. | Ship SQL first, dashboard is additive. |
| Deliverable | **This design doc with paste-ready code**, repo untouched | "Consider how we can add…" is a design ask; I didn't want to mutate the repo before you've seen the shape. | Say the word and I wire it into `xtrata-2.0` as a reviewable diff. |

Nothing below logs seed phrases, private keys, signatures, or raw addresses. That's a hard rule baked into the ingest scrubber (§6).

---

## 1. What you asked for → how this delivers it

You wrote: *"log all the various issues people have… filtered and sorted so we can identify all unique issues and the paths that lead to them and hopefully solutions. We need to know every time someone crashes out and why, did they try again, did they eventually succeed, what was learned."*

Every one of those maps to a concrete mechanism:

- **"Every time someone crashes out and why"** → a global safety net (`window.onerror`, unhandled promise rejections, a React `ErrorBoundary`) plus explicit `error` events at each step of your risky flows. Each carries a stable `error_code` and a scrubbed message. (§5, §7)
- **"The paths that lead to them"** → every event shares a `session_id`, and every multi-step goal shares a `journey_id`. The ordered events on a journey *are* the path. Errors also carry a short **breadcrumb trail** of the last N actions, so you see the road to the crash without logging every click. (§3, §5)
- **"Identify all unique issues"** → an **error fingerprint**: a hash of `flow + step + error_code + normalised message`. This collapses "nonce mismatch expected 41 got 39" and "...expected 12 got 10" into *one* issue with a count. This is the single most important idea in the design. (§4)
- **"Did they try again / did they eventually succeed"** → each journey has ordered `attempt` numbers and an `outcome`. One SQL query answers "of journeys that hit an error, what % eventually reached `success`, and in how many attempts." (§8, query 3)
- **"What was learned / solutions"** → a `telemetry_issues` rollup table you *annotate*: status (open/investigating/resolved), owner, notes, and `resolved_in_release`. Fixes are tagged to a release so you can prove the issue rate dropped afterward. (§3, §8 query 6, §10)
- **"Filtered and sorted"** → it's SQL over indexed columns. Filter by flow, wallet kind, country, route, collection, version; sort by count, recency, severity. (§8)
- **"Optimise iteratively on real data"** → the weekly loop in §10: triage top issues → fix → tag release → watch the fingerprint's trend go to zero.

---

## 2. Architecture at a glance

```
 Browser (React)                         Cloudflare Pages Function            D1 (existing `DB`)
┌───────────────────────────┐           ┌───────────────────────────┐       ┌────────────────────┐
│ telemetry client          │  POST     │ functions/log.ts          │       │ telemetry_events   │
│  • session_id + journey    │  /log     │  • validate + size-clamp  │ INSERT│  (the event spine) │
│  • attempt tracking        │ (beacon,  │  • scrub PII / secrets    │──────▶│                    │
│  • breadcrumb ring buffer  │  batched) │  • hash wallet (+salt)    │       │ telemetry_issues   │
│  • global error handlers   │──────────▶│  • derive geo/ua/ver      │ UPSERT│  (dedup rollup +   │
│  • ErrorBoundary           │           │  • insert event           │──────▶│   your annotations)│
│  • flush on hide/timer     │           │  • batch write            │       └────────────────────┘
└───────────────────────────┘           └───────────────────────────┘                │
                                          functions/debug/data.ts        ◀───────────┘
                                                    │  (read-only JSON, required key)
                                                    ▼
                                    /debug → plain-language dashboard (KPIs, issues, funnels, trend)
```

Design principles, chosen to fit how xtrata already works:

1. **One append-only event stream, not a dozen bespoke log calls.** Every meaningful thing is a row in `telemetry_events`. Everything else (issues list, funnels, retry rates) is a *query* over that stream. Simpler to reason about, impossible to get out of sync.
2. **Zero new runtime dependencies on the client.** `crypto.randomUUID()`, `navigator.sendBeacon`, and `fetch(..., {keepalive:true})` are enough. Your `package.json` is deliberately lean; this keeps it that way.
3. **Reuse the existing seams.** `functions/lib/db.ts` (`run`/`queryAll`), `functions/lib/utils.ts` (`jsonResponse`), the `functions/migrations/00N_*.sql` numbering, the `[[path]].ts` handler style, the `/manage` allowlist gate — all reused, nothing reinvented.
4. **Fail open, never block the user.** Telemetry that throws, times out, or is blocked by an ad-blocker must be invisible to the person minting. Every capture path is wrapped and swallowed.

---

## 3. Data model (D1)

Two tables. The first is the spine; the second is a convenience rollup for the "unique issues" list and for *your notes on each issue*.

### 3.1 `telemetry_events` — the spine

Migration `functions/migrations/009_telemetry.sql`, written in your existing commented style with INTEGER epoch-ms timestamps (matching `008_radio_verdicts.sql`):

```sql
-- Append-only user-journey + issue event stream. One row per meaningful thing
-- that happens to a person using the site — especially failures. Everything
-- else the ops dashboard shows (unique issues, failure funnels, retry->success
-- rates) is a QUERY over this table, so there is exactly one source of truth.
--
-- Privacy: no raw wallet addresses, signatures, keys or seed material ever land
-- here. `wallet_hash` is sha256(TELEMETRY_SALT || address) computed server-side
-- (see functions/log.ts); the salt is a Pages secret, so rows are not reversible
-- and not brute-forceable offline. No raw or partial address is persisted.
CREATE TABLE IF NOT EXISTS telemetry_events (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id        TEXT    NOT NULL,            -- client uuid; dedup on retry-resend
  ts              INTEGER NOT NULL,            -- client event time (epoch ms)
  received_at     INTEGER NOT NULL,            -- server ingest time (epoch ms)

  -- WHO / WHERE (coarse, non-identifying)
  session_id      TEXT    NOT NULL,            -- one browser session
  journey_id      TEXT,                        -- one goal attempt-chain (buy X, mint Y)
  attempt         INTEGER NOT NULL DEFAULT 1,  -- 1,2,3… within a journey

  -- WHAT
  flow            TEXT    NOT NULL,            -- wallet_connect|mint|drop_claim|market_buy|collection_publish|app
  step            TEXT,                        -- sign|broadcast|poll_confirm|upload|reserve…
  outcome         TEXT    NOT NULL,            -- start|success|error|abandon|info
  severity        TEXT    NOT NULL DEFAULT 'info', -- debug|info|warn|error|fatal
  target          TEXT,                        -- object of the action: collectionId|listingId|contract
  duration_ms     INTEGER,                     -- time in this step before the outcome

  -- WHY (failures)
  error_code      TEXT,                        -- stable code we assign: WALLET_REJECTED, INSUFFICIENT_FEE…
  error_fingerprint TEXT,                      -- hash(flow|step|error_code|normalised msg) => the UNIQUE ISSUE key
  error_message   TEXT,                        -- scrubbed + truncated
  error_stack     TEXT,                        -- scrubbed + truncated (uncaught only)

  -- CONTEXT for slicing
  app_version     TEXT,                        -- release/build tag => iteration tracking
  route           TEXT,                        -- window.location.pathname
  wallet_hash     TEXT,                        -- salted hash (nullable)
  wallet_prefix   TEXT,                        -- reserved; ingest always writes NULL
  wallet_kind     TEXT,                        -- leather|xverse|asigna|…
  network         TEXT,                        -- mainnet|testnet
  ua_browser      TEXT,                        -- parsed server-side, coarse
  ua_os           TEXT,
  device          TEXT,                        -- desktop|mobile|tablet
  country         TEXT,                        -- request.cf.country
  context_json    TEXT                         -- small JSON: extra fields + breadcrumbs
);

CREATE INDEX IF NOT EXISTS idx_tel_fingerprint ON telemetry_events (error_fingerprint);
CREATE INDEX IF NOT EXISTS idx_tel_flow_outcome ON telemetry_events (flow, outcome);
CREATE INDEX IF NOT EXISTS idx_tel_session     ON telemetry_events (session_id);
CREATE INDEX IF NOT EXISTS idx_tel_journey     ON telemetry_events (journey_id);
CREATE INDEX IF NOT EXISTS idx_tel_received    ON telemetry_events (received_at);
CREATE INDEX IF NOT EXISTS idx_tel_version     ON telemetry_events (app_version);
CREATE INDEX IF NOT EXISTS idx_tel_target      ON telemetry_events (target);
CREATE UNIQUE INDEX IF NOT EXISTS uq_tel_event_id ON telemetry_events (event_id);
```

Why these columns earn their place:

- `journey_id` + `attempt` are what make "did they retry / eventually succeed" answerable. A journey is minted client-side when the user starts a goal (clicks Buy / Claim / Mint) and reused across retries of that same goal.
- `target` lets you ask "which collection fails most" or "which listing strands buyers" — high-value for a marketplace.
- `error_fingerprint` is the dedup key for unique issues (§4).
- `app_version` is the axis for "did the fix work."
- `context_json` is a small escape hatch (extra fields + breadcrumbs). Kept as TEXT, size-clamped at ingest; not indexed. Don't dump large objects here.

### 3.2 `telemetry_issues` — dedup rollup + your annotations

You *could* derive the unique-issue list purely by `GROUP BY error_fingerprint`. The rollup exists for two reasons: (a) a fast, cheap "top issues" read for the dashboard without scanning the whole event table, and (b) somewhere durable to record *what was learned* — status, owner, notes, and the release that fixed it.

```sql
-- One row per UNIQUE issue (error_fingerprint). The ingest endpoint upserts the
-- machine-maintained columns (counts, first/last seen, a sample). Humans own the
-- triage columns (status, owner, notes, resolved_in_release) — this is where
-- "what was learned" and "the solution" live.
CREATE TABLE IF NOT EXISTS telemetry_issues (
  fingerprint        TEXT PRIMARY KEY,
  flow               TEXT,
  step               TEXT,
  error_code         TEXT,
  title              TEXT,                     -- normalised message template (human-readable)
  first_seen         INTEGER NOT NULL,
  last_seen          INTEGER NOT NULL,
  occurrences        INTEGER NOT NULL DEFAULT 0,
  last_sample_event  TEXT,                     -- event_id of a recent occurrence to drill into
  last_app_version   TEXT,                     -- most recent build it was seen on

  -- human-owned triage (never written by ingest)
  status             TEXT NOT NULL DEFAULT 'open', -- open|investigating|resolved|ignored
  owner              TEXT,
  notes              TEXT,                         -- root cause + what was learned
  resolved_in_release TEXT,                        -- app_version the fix shipped in
  updated_at         INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_issues_status  ON telemetry_issues (status, last_seen);
CREATE INDEX IF NOT EXISTS idx_issues_lastseen ON telemetry_issues (last_seen);
```

"Distinct sessions/wallets affected" is deliberately *not* stored here (maintaining a running distinct-count per fingerprint on every insert is expensive and racy in D1). It's computed on demand in the queries (§8) — cheap because `error_fingerprint` is indexed.

---

## 4. The heart of it: error fingerprinting → "unique issues"

The reason naive error logs are useless for optimisation is that the same bug produces thousands of *different-looking* messages (they embed tx ids, addresses, amounts, nonces, block heights). To get a clean list of **unique issues sorted by how much they hurt**, we normalise the message into a template, then hash a small tuple.

Normalisation (client-side, so the raw values never even leave the browser):

```ts
// src/lib/telemetry/fingerprint.ts
// Collapse volatile substrings so the SAME bug maps to the SAME fingerprint.
export function normaliseMessage(raw: string): string {
  return (raw || '')
    .replace(/0x[0-9a-fA-F]{6,}/g, '0x…')                    // hex / tx ids / hashes
    .replace(/\bS[PT][0-9A-Z]{20,}\b/g, '<addr>')            // stacks addresses
    .replace(/\b[0-9a-fA-F]{64}\b/g, '<hash>')               // 32-byte hashes
    .replace(/\b\d[\d,]*(\.\d+)?\b/g, '<n>')                 // amounts, nonces, heights, fees
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

// Stable 64-bit-ish fingerprint over the tuple that defines an issue's identity.
export async function fingerprint(
  flow: string, step: string | undefined, errorCode: string | undefined, message: string
): Promise<string> {
  const basis = `${flow}|${step ?? ''}|${errorCode ?? ''}|${normaliseMessage(message)}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(basis));
  return Array.from(new Uint8Array(buf).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

So `"Broadcast failed: nonce mismatch, expected 41 got 39 for SP2J…"` and `"Broadcast failed: nonce mismatch, expected 12 got 10 for SP9K…"` both normalise to `broadcast failed: nonce mismatch, expected <n> got <n> for <addr>` → **one** fingerprint → **one** row in your triage list with `occurrences = 2`. That's the difference between "18,432 log lines" and "37 unique issues, here are the top 5."

**Error codes** are a small, curated enum you assign at instrumentation points, so the highest-value failures are labelled regardless of message text. Starter set drawn from your actual flows:

`WALLET_NOT_FOUND`, `WALLET_REJECTED`, `WALLET_LOCKED`, `SESSION_EXPIRED`, `INSUFFICIENT_FUNDS`, `INSUFFICIENT_FEE`, `NONCE_MISMATCH`, `POST_CONDITION_FAILED`, `CONTRACT_ABORT`, `READ_ONLY_BACKOFF` (you already have `ReadOnlyBackoffError`), `BROADCAST_FAILED`, `CONFIRM_TIMEOUT`, `SPONSOR_REJECTED`, `SPONSOR_LOW_FLOAT`, `UPLOAD_FAILED`, `ASSET_TOO_LARGE`, `HIRO_RATE_LIMIT`, `NETWORK_OFFLINE`, `UNCAUGHT` (global handler), `RENDER_CRASH` (ErrorBoundary).

---

## 5. Client capture SDK (`src/lib/telemetry/`)

A small, dependency-free module. Public surface is tiny:

```ts
// src/lib/telemetry/index.ts  (public API — everything else is internal)
export const telemetry = {
  startJourney(flow: Flow, target?: string): Journey,  // returns a handle with attempt tracking
  event(input: TelemetryInput): void,                  // fire-and-forget structured event
  breadcrumb(label: string, data?: Record<string, unknown>): void,
  setWallet(address: string | null, kind?: string): void, // address is hashed server-side and never persisted raw
  flush(reason?: string): void
};
```

### 5.1 Session, journey, attempt

```ts
// src/lib/telemetry/session.ts
// Session: one per tab load, persisted in sessionStorage so a reload keeps it.
// (Note: artifacts guidance forbids web storage in Claude.ai artifacts, but this
//  is your own app, not an artifact — sessionStorage is the right tool here.)
const SESSION_KEY = 'xt_tel_sid';
export function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(SESSION_KEY, id); }
    return id;
  } catch { return memoisedRandomId(); } // private mode / storage disabled → in-memory
}

// A Journey is minted when the user commits to a goal and reused across retries.
export class Journey {
  readonly id = crypto.randomUUID();
  private n = 0;
  constructor(public flow: Flow, public target?: string) {}
  attempt() { return ++this.n; }               // call at the start of each try
}
```

Usage in a flow (e.g. market buy) reads naturally and makes retries first-class:

```ts
const j = telemetry.startJourney('market_buy', listingId);

async function buy() {
  const attempt = j.attempt();                                   // 1, then 2, 3 on retry
  telemetry.event({ journey: j, attempt, step: 'sign', outcome: 'start' });
  try {
    const signed = await signBuy(...);
    telemetry.event({ journey: j, attempt, step: 'broadcast', outcome: 'start' });
    const txid = await broadcast(signed);
    telemetry.event({ journey: j, attempt, step: 'confirm', outcome: 'success', durationMs, target: listingId });
  } catch (e) {
    telemetry.event({
      journey: j, attempt, step: currentStep, outcome: 'error',
      errorCode: classify(e),                                    // → WALLET_REJECTED, INSUFFICIENT_FEE…
      error: e                                                   // message/stack scrubbed before send
    });
    throw e;                                                     // UX unchanged; we only observed
  }
}
```

The retry button re-invokes `buy()` with the *same* `Journey`, so attempts 2/3 land on the same `journey_id`. That is precisely what makes "did they try again → did they eventually succeed" a one-line query later.

### 5.2 Global safety net (the literal "crashes out")

Installed once in `src/main.tsx`, before render:

```ts
// src/main.tsx  (add near the top, after imports)
import { installGlobalTelemetry, TelemetryBoundary } from './lib/telemetry';
installGlobalTelemetry();   // window.onerror + unhandledrejection + online/offline + pagehide flush
```

```ts
// src/lib/telemetry/global.ts
export function installGlobalTelemetry() {
  window.addEventListener('error', (e) => {
    telemetry.event({ flow: 'app', outcome: 'error', severity: 'fatal',
      errorCode: 'UNCAUGHT', error: e.error ?? e.message, route: location.pathname });
  });
  window.addEventListener('unhandledrejection', (e) => {
    telemetry.event({ flow: 'app', outcome: 'error', severity: 'error',
      errorCode: 'UNCAUGHT', error: e.reason, route: location.pathname });
  });
  // Never lose the event that mattered most — the one right before they closed the tab.
  const flush = () => telemetry.flush('pagehide');
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
}
```

And a React error boundary wrapping each root in `main.tsx` (you render several app roots from one `main.tsx`, so one boundary component reused around each covers all of them):

```tsx
// src/lib/telemetry/TelemetryBoundary.tsx
export class TelemetryBoundary extends React.Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    telemetry.event({ flow: 'app', outcome: 'error', severity: 'fatal',
      errorCode: 'RENDER_CRASH', error, context: { componentStack: info.componentStack } });
  }
  render() { return this.state.failed ? (this.props.fallback ?? <AppCrashFallback />) : this.props.children; }
}
```

```tsx
// main.tsx render — wrap the existing tree:
<TelemetryBoundary>
  <QueryClientProvider client={queryClient}>
    {/* …existing routing… */}
  </QueryClientProvider>
</TelemetryBoundary>
```

### 5.3 Breadcrumbs (the path, cheaply)

A tiny in-memory ring buffer (last ~20 actions). Nothing is sent until an error occurs; then the trail rides along in `context_json`. This gives you "what did they do right before it broke" without a firehose of click events.

```ts
// src/lib/telemetry/breadcrumbs.ts
const ring: Array<{ t: number; label: string; data?: unknown }> = [];
export function breadcrumb(label: string, data?: unknown) {
  ring.push({ t: Date.now(), label, data }); if (ring.length > 20) ring.shift();
}
export function trail() { return ring.slice(-20); }   // attached to error events only
```

### 5.4 Batching + delivery (must never block minting)

```ts
// src/lib/telemetry/queue.ts
const queue: WireEvent[] = [];
let timer: number | null = null;

export function enqueue(ev: WireEvent) {
  queue.push(ev);
  if (ev.outcome === 'error' || ev.severity === 'fatal') return flush('error'); // errors go now
  if (queue.length >= 20) return flush('batch');
  if (timer == null) timer = window.setTimeout(() => flush('timer'), 5000);      // else within 5s
}

export function flush(reason = 'manual') {
  if (timer != null) { clearTimeout(timer); timer = null; }
  if (!queue.length) return;
  const batch = queue.splice(0, queue.length);
  const body = JSON.stringify({ reason, events: batch });
  try {
    // sendBeacon survives tab close; keepalive fetch is the fallback.
    if (!navigator.sendBeacon || !navigator.sendBeacon('/log', new Blob([body], { type: 'application/json' }))) {
      void fetch('/log', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
    }
  } catch { /* fail open: telemetry must never surface to the user */ }
}
```

Everything client-side is wrapped so a telemetry failure, a blocked request, or an ad-blocker is completely invisible to the person using the site.

---

## 6. Backend ingest (`functions/log.ts`)

A single Pages Function, using your existing helpers. It validates, scrubs, hashes the wallet with the secret salt, derives geo/ua/version server-side, and batch-writes. Returns `204` fast.

```ts
// functions/log.ts
import { jsonResponse } from './lib/utils';
import { run, type Env as DbEnv } from './lib/db';

type Env = DbEnv & { TELEMETRY_SALT?: string };

const MAX_EVENTS = 50;
const MAX_STR = 2000;        // clamp any single string field
const clamp = (s: unknown, n = MAX_STR) => (typeof s === 'string' ? s.slice(0, n) : null);

// Hard scrub: seed phrases, keys, signatures, long hex are never persisted.
const SECRET_PATTERNS = [
  /\b([a-z]+\s){11,23}[a-z]+\b/gi,     // BIP-39-ish word runs
  /\bS[PT][0-9A-Z]{20,}(?:\.[a-zA-Z0-9_-]+)?\b/g, // Stacks principals
  /\b[0-9a-fA-F]{64,}\b/g,             // keys / signatures / tx ids / serialized txs
  /(private|secret|seed|mnemonic|priv[_-]?key)[^,;\n]*/gi
];
const scrub = (s: string | null) =>
  s == null ? null : SECRET_PATTERNS.reduce((acc, re) => acc.replace(re, '‹redacted›'), s).slice(0, MAX_STR);

async function hashWallet(addr: string | null, salt: string | undefined) {
  if (!addr || !salt) return null;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + addr.toUpperCase()));
  return Array.from(new Uint8Array(buf).slice(0, 8)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: any;
  try { payload = await request.json(); } catch { return new Response(null, { status: 204 }); }
  const events = Array.isArray(payload?.events) ? payload.events.slice(0, MAX_EVENTS) : [];
  if (!events.length) return new Response(null, { status: 204 });

  const now = Date.now();
  const country = (request as any).cf?.country ?? null;
  const ua = request.headers.get('user-agent') ?? '';
  const { browser, os, device } = parseUa(ua);   // tiny server-side UA classifier (coarse)

  const stmts: Promise<unknown>[] = [];
  for (const e of events) {
    if (!e || typeof e.flow !== 'string' || typeof e.outcome !== 'string') continue; // drop malformed
    const walletHash = await hashWallet(clamp(e.walletAddress), env.TELEMETRY_SALT);
    stmts.push(run(env,
      `INSERT OR IGNORE INTO telemetry_events
        (event_id, ts, received_at, session_id, journey_id, attempt, flow, step, outcome, severity,
         target, duration_ms, error_code, error_fingerprint, error_message, error_stack,
         app_version, route, wallet_hash, wallet_prefix, wallet_kind, network,
         ua_browser, ua_os, device, country, context_json)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [ clamp(e.eventId) ?? crypto.randomUUID(), Number(e.ts) || now, now,
        clamp(e.sessionId), clamp(e.journeyId), Number(e.attempt) || 1,
        clamp(e.flow, 40), clamp(e.step, 40), clamp(e.outcome, 20), clamp(e.severity, 10),
        clamp(e.target, 200), Number(e.durationMs) || null,
        clamp(e.errorCode, 60), clamp(e.errorFingerprint, 32), scrub(clamp(e.errorMessage)),
        scrub(clamp(e.errorStack, 4000)), clamp(e.appVersion, 40), clamp(e.route, 200),
        walletHash, null, clamp(e.walletKind, 20), clamp(e.network, 20),
        clamp(browser, 40), clamp(os, 40), clamp(device, 20), clamp(country, 4),
        scrub(clamp(JSON.stringify(e.context ?? {}), 4000)) ]));
  }
  try { await Promise.all(stmts); } catch { /* never fail the client on telemetry */ }
  return new Response(null, { status: 204 });
};
```

Notes:

- **Salt** is a Pages secret set exactly like your `SPONSOR_KEY`: `wrangler pages secret put TELEMETRY_SALT` for **both** Production and Preview (your `wrangler.toml` comment already documents this two-environment gotcha).
- The endpoint is `POST /log` (root) so `navigator.sendBeacon('/log', …)` is dead simple; the `[[path]]` catch-alls you use elsewhere aren't needed here.
- `INSERT OR IGNORE` on `event_id` makes resends idempotent (beacon + keepalive can occasionally double-fire on tab close).
- An `AFTER INSERT` trigger in `009_telemetry.sql` updates `telemetry_issues`, so a duplicate ignored event cannot increment the issue count.
- For higher volumes, swap the `Promise.all` for a single `env.DB.batch([...])` — your `db.ts` exposes the binding; I kept `run()` for readability.
- **Abuse guard**: this is an unauthenticated public endpoint. Ship it behind a cheap gate — a Cloudflare rate-limiting rule on `/log`, plus the size clamps above. Optionally require a same-origin `Sec-Fetch-Site: same-origin` header check. I'll wire whichever you prefer.

---

## 7. Where to instrument first (your actual crash-out hotspots)

From the code, these are the multi-step, wallet-touching flows where people get stuck — instrument these and you'll capture the overwhelming majority of "crash-outs":

| Flow (`flow`) | Files | Steps to mark (`step`) | High-value error codes |
|---|---|---|---|
| `wallet_connect` | `src/lib/wallet/connect.ts`, `session.ts`, `adapter.ts` | `open`, `select_provider`, `authorize`, `session_persist` | `WALLET_NOT_FOUND`, `WALLET_REJECTED`, `WALLET_LOCKED`, `SESSION_EXPIRED` |
| `market_buy` | `src/lib/market/actions.ts`, `sponsor-client.ts`, `settlement.ts` | `quote`, `sign`, `broadcast`, `confirm`, `settle` | `SPONSOR_REJECTED`, `SPONSOR_LOW_FLOAT`, `POST_CONDITION_FAILED`, `CONFIRM_TIMEOUT` |
| `drop_claim` | `src/lib/drops/sponsored-claim.ts`, `functions/sponsor/[[path]].ts` | `eligibility`, `sign`, `submit`, `confirm` | `WALLET_REJECTED`, `BROADCAST_FAILED`, `SPONSOR_REJECTED` |
| `mint` | `src/CollectionMintLivePage.tsx`, `src/lib/mint/*`, `src/lib/chunking/*` | `reserve`, `upload`, `sign`, `broadcast`, `poll_confirm` | `ASSET_TOO_LARGE`, `UPLOAD_FAILED`, `INSUFFICIENT_FEE`, `NONCE_MISMATCH` |
| `collection_publish` | `functions/collections/[collectionId]/publish.ts`, `readiness.ts` | `readiness`, `reserve`, `publish` | `CONTRACT_ABORT`, `READ_ONLY_BACKOFF` |

Tie-in you already have: your `QueryClient` in `main.tsx` sets `retry` and knows `failureCount`. Add default `onError`/`onSuccess` handlers there and React Query's `failureCount` becomes your `attempt` number for free on every query-driven flow — a lot of retry tracking falls out with almost no extra code.

`classify(e)` is a ~30-line function mapping known error shapes (including your typed `ReadOnlyBackoffError`, Stacks post-condition/nonce errors, Hiro 429s, `navigator.onLine === false`) to the codes above; unknown errors fall through to `UNCAUGHT` and still get fingerprinted by message.

---

## 8. Analysis: the queries that make it useful

These are the saved queries (run via `wrangler d1 execute xtrata-manage --command "…"` or the D1 console, and reused by the dashboard). Each maps directly to one of your asks.

**Q1 — Top unique issues, last 7 days (the triage list).** *Every unique issue, sorted by hurt.*
```sql
SELECT e.error_fingerprint, e.flow, e.step, e.error_code,
       MIN(e.error_message) AS sample,
       COUNT(*)                              AS occurrences,
       COUNT(DISTINCT e.session_id)          AS sessions_hit,
       COUNT(DISTINCT e.wallet_hash)         AS wallets_hit,
       MAX(e.received_at)                    AS last_seen,
       i.status, i.owner, i.resolved_in_release
FROM telemetry_events e
LEFT JOIN telemetry_issues i ON i.fingerprint = e.error_fingerprint
WHERE e.outcome='error' AND e.received_at > (unixepoch()*1000 - 7*86400000)
GROUP BY e.error_fingerprint
ORDER BY occurrences DESC;
```

**Q2 — Failure funnel for one flow.** *Where in the flow do people fall out?*
```sql
SELECT step,
       SUM(outcome='start')   AS started,
       SUM(outcome='success') AS succeeded,
       SUM(outcome='error')   AS errored,
       SUM(outcome='abandon') AS abandoned
FROM telemetry_events
WHERE flow='market_buy' AND received_at > (unixepoch()*1000 - 7*86400000)
GROUP BY step ORDER BY started DESC;
```

**Q3 — Did they retry, did they eventually succeed?** *The core question, per flow.*
```sql
WITH j AS (
  SELECT journey_id, flow,
         MAX(attempt)                 AS attempts,
         MAX(CASE WHEN outcome='error' THEN ts END)   AS last_error,
         MAX(CASE WHEN outcome='success' THEN ts END) AS last_success
  FROM telemetry_events
  WHERE journey_id IS NOT NULL AND received_at > (unixepoch()*1000 - 7*86400000)
  GROUP BY journey_id)
SELECT flow,
       COUNT(*)                                            AS journeys,
       SUM(last_error IS NOT NULL)                         AS journeys_with_error,
       SUM(last_success > last_error)                      AS recovered,
       ROUND(100.0*SUM(last_success > last_error)/NULLIF(SUM(last_error IS NOT NULL),0),1) AS recovery_pct,
       ROUND(AVG(CASE WHEN last_error IS NOT NULL THEN attempts END),2) AS avg_attempts_when_erroring
FROM j GROUP BY flow ORDER BY journeys_with_error DESC;
```

**Q4 — Dead-ends (issues that make people give up).** *Errored, never recovered — ranked by lost users.*
```sql
WITH bad AS (
  SELECT journey_id,
         MAX(CASE WHEN outcome='error' THEN ts END) AS last_error,
         MAX(CASE WHEN outcome='success' THEN ts END) AS last_success
  FROM telemetry_events
  WHERE journey_id IS NOT NULL GROUP BY journey_id
  HAVING last_error IS NOT NULL AND (last_success IS NULL OR last_success <= last_error))
SELECT e.error_fingerprint, e.flow, e.step, MIN(e.error_message) AS sample,
       COUNT(DISTINCT e.journey_id) AS abandoned_journeys,
       COUNT(DISTINCT e.wallet_hash) AS wallets_lost
FROM telemetry_events e JOIN bad ON bad.journey_id = e.journey_id
WHERE e.outcome='error'
GROUP BY e.error_fingerprint ORDER BY abandoned_journeys DESC;
```

**Q5 — One user's path to the crash.** *Paste a `journey_id` (or `session_id`) → the ordered trail.*
```sql
SELECT ts, attempt, flow, step, outcome, error_code, error_message, context_json
FROM telemetry_events WHERE journey_id = ?1 ORDER BY ts ASC;
```

**Q6 — Did the fix work? (iteration proof).** *Occurrences of one issue per day, split by release.*
```sql
SELECT date(received_at/1000,'unixepoch') AS day, app_version, COUNT(*) AS hits
FROM telemetry_events
WHERE error_fingerprint = ?1
GROUP BY day, app_version ORDER BY day;
```

**Q7 — Segment a spike.** *Is it just one wallet / OS / country / route?*
```sql
SELECT wallet_kind, ua_os, device, country, COUNT(*) AS hits
FROM telemetry_events WHERE error_fingerprint = ?1
GROUP BY wallet_kind, ua_os, device, country ORDER BY hits DESC;
```

---

## 9. Reading it day-to-day: the `/debug` dashboard  ✅ BUILT

A plain-language health page at **`xtrata.xyz/debug`**, written for non-specialists: every technical term is surfaced as a readable label and explained in a glossary and in click-to-expand drawers. Self-contained (no external assets), light/dark aware, using the `dataviz` skill's validated palette.

- **Read endpoint** `functions/debug/data.ts` (`GET /debug/data?range=24h|7d|30d`): returns pre-aggregated JSON — KPIs, top unique issues, recovery rate, per-flow failure funnels, a daily trend, and the latest crash-outs — computed from D1. Read-only, `no-store`. Falls back to `ready:false` with a hint if the migration hasn't been applied.
- **Page** `functions/debug.ts` (`GET /debug`): renders that JSON as:
  - KPI tiles — crash-outs, unique issues, people affected, recovery rate — each with a one-line plain explanation.
  - "Where it's going wrong" — crash-outs by area of the site (bars).
  - "Crash-outs over time" — daily trend, to watch a bar shrink after a fix ships.
  - "Do people recover?" — the recovery split (recovered vs gave up) in words and a bar.
  - "The unique issues (most impactful first)" — a table; **click any row** for a plain-English cause, an example message, and how many people/wallets it hit. Each error code carries a triage badge (*usually user-side* / *worth a look* / *needs your attention*).
  - "Step-by-step drop-off" — per-flow funnels (green succeeded / red errored).
  - "Latest crash-outs" — the most recent individual failures.
  - A "How to read this page" intro and a full glossary (nonce, post-condition, session, journey, wallet-hash, …).
- **Access gate:** fail-closed. A strong `DEBUG_VIEW_KEY` Pages secret is mandatory. `/debug` accepts it through a POST form and exchanges it for an eight-hour HttpOnly, Secure, SameSite cookie, so the secret is not retained in browser history or the address bar. `/debug/data` accepts that cookie or an `x-debug-key` header.

> The human-owned triage controls (set `status` / `owner` / `notes` / `resolved_in_release` on `telemetry_issues`) are a small follow-up — a POST endpoint + inline controls on the issue drawer. The read-only view above is live.

---

## 10. The iteration loop (turning data into fewer crashes)

The whole point. A lightweight weekly rhythm:

1. **Triage** — open the dashboard (or run Q1 + Q4). The top of Q4 is where you're losing users; the top of Q1 is where you're burning goodwill.
2. **Diagnose** — click into the issue: read the trail (Q5), segment it (Q7). Often the fix is obvious once you see the path ("everyone who fails `market_buy` at `settle` is on Xverse mobile").
3. **Record what was learned** — set `status='investigating'`, write the root cause into `notes`. This is your institutional memory; the next person doesn't re-derive it.
4. **Fix + tag** — ship the fix in a release; set `resolved_in_release` and `status='resolved'`. Make sure the build stamps `app_version` (below).
5. **Prove it** — a few days later, Q6 for that fingerprint should show occurrences collapsing after the release. If not, reopen. This is "optimise iteratively on real data" made literal.

**Stamp the release** so step 5 works. In `vite.config.ts`, inject a build tag:
```ts
define: { 'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.CF_PAGES_COMMIT_SHA?.slice(0,8) ?? 'dev') }
```
(Cloudflare Pages sets `CF_PAGES_COMMIT_SHA` at build.) The client reads `import.meta.env.VITE_APP_VERSION` into every event's `app_version`.

---

## 11. Privacy, retention, cost

- **No secrets, ever.** Seed phrases, keys, signatures, wallet principals, and long serialized hex are regex-scrubbed from every free-form field at ingest (§6). Wallet addresses used for correlation are salted-hashed server-side; the database holds only the hash and never a raw or partial address.
- **Notice and lawful basis.** Before enabling telemetry in production, update the public privacy notice to describe pseudonymous operational telemetry, purpose, fields, 90/180-day retention, and the applicable lawful basis or consent mechanism for the deployment jurisdictions. A salted wallet hash remains pseudonymous data, not anonymous data.
- **Retention.** `error`/`fatal` rows are retained for at most 180 days and `info`/`start`/`success` rows for at most 90 days. The ingest route applies the indexed purge after each accepted batch:
  ```sql
  DELETE FROM telemetry_events
  WHERE (severity IN ('info','debug') AND received_at < (unixepoch()*1000 - 90*86400000))
     OR received_at < (unixepoch()*1000 - 180*86400000);
  ```
- **Sampling.** Always keep 100% of `error`/`fatal`. If `info`/`start` volume ever gets heavy, sample those client-side (e.g. keep 20%) with a per-session dice roll so whole journeys are kept or dropped coherently. Off by default — your volume almost certainly doesn't need it yet.
- **Cost.** Events are a few hundred bytes; writes are one batched call per flush. Well inside D1's free tier at your scale. If you later outgrow it, add a Workers **Analytics Engine** sink for the high-volume `info` metrics and keep D1 for errors/journeys — the client contract doesn't change.

---

## 12. Testing (matches your vitest culture)

Land tests beside the code, as you already do (`functions/**/__tests__`, `src/**/__tests__`):

- `src/lib/telemetry/__tests__/fingerprint.test.ts` — two differently-numbered nonce errors share a fingerprint; different flows don't collide.
- `src/lib/telemetry/__tests__/queue.test.ts` — batches at 20, flushes on timer, errors flush immediately, `flush()` uses beacon then falls back to keepalive fetch (mock both).
- `functions/__tests__/log.test.ts` — malformed events dropped; secret patterns scrubbed; wallet hashed (and identical for same address+salt, different for different salt); `INSERT OR IGNORE` idempotent on duplicate `event_id`.
- Add to your `smoke:premerge:tests` list so it's covered pre-merge.

---

## 13. Rollout plan (phased, each phase independently shippable)

| Phase | What ships | Files | Value the moment it lands |
|---|---|---|---|
| **0. Storage** | Migration + secrets | `functions/migrations/009_telemetry.sql`; `TELEMETRY_SALT` + `DEBUG_VIEW_KEY` secrets (prod+preview) | Schema live and dashboard fail-closed. |
| **1. Core + safety net** | Client core, global handlers, boundary, ingest | `src/lib/telemetry/*`, `main.tsx`, `functions/log.ts` | **Instantly captures every uncaught crash + unhandled rejection, site-wide.** |
| **2. Instrument top flows** ✅ | `market_buy`, `drop_claim`, `mint`, `wallet_connect` | `useSponsoredBuy.ts`, `sponsored-claim.ts`, `CollectionMintLivePage.tsx`, `wallet/connect.ts` | Structured funnels + retry/success on your revenue + frustration paths. |
| **3. Read surface** ✅ | `/debug` dashboard + JSON endpoint | `functions/debug.ts`, `functions/debug/data.ts` | Plain-language self-serve triage without the D1 console. |
| **4. Iterate** | Purge task + the weekly loop (§10) | scheduled task | Fixes proven against real trend data. |

Phase 1 alone is a big step up from 11 scattered `console.error`s that nobody ever sees.

---

## 14. Production activation checklist

The code is built and tested. Before production activation: apply the migration; set strong `TELEMETRY_SALT` and `DEBUG_VIEW_KEY` secrets in both Production and Preview; add the Cloudflare `/log` rate-limit rule; update the public privacy notice/lawful-basis record; then deploy and verify that `/debug` is inaccessible without its login cookie.

---

### Appendix A — event shape on the wire

```jsonc
{
  "reason": "error",
  "events": [{
    "eventId": "8f3c…", "ts": 1784667012345,
    "sessionId": "a1b2…", "journeyId": "c3d4…", "attempt": 2,
    "flow": "market_buy", "step": "settle", "outcome": "error", "severity": "error",
    "target": "SP3JN…xtrata-market-sponsored-stx-v1-1::listing-42",
    "durationMs": 8421,
    "errorCode": "SPONSOR_REJECTED",
    "errorFingerprint": "3a9f0c11d2",
    "errorMessage": "sponsor submit rejected: post-condition on <addr> failed",
    "appVersion": "b1c2d3e4", "route": "/workspace",
    "walletAddress": "SP2J…8QW7",     // hashed server-side, then dropped
    "walletKind": "xverse", "network": "mainnet",
    "context": { "breadcrumbs": [
      {"t": 1784667004000, "label": "click:buy", "data": {"listing": 42}},
      {"t": 1784667006000, "label": "wallet:sign_ok"},
      {"t": 1784667012000, "label": "sponsor:submit_fail", "data": {"code": 409}}
    ]}
  }]
}
```

### Appendix B — files this touches

Legend: ✅ built in this pass · ◻︎ follow-up (Phase 2+).

```
functions/
  log.ts                                    # ✅ NEW ingest endpoint (POST /log)
  migrations/009_telemetry.sql              # ✅ NEW schema
  lib/telemetry-ingest.ts                   # ✅ NEW pure helpers (scrub, hash, binds)
  lib/debug-auth.ts                         # ✅ NEW fail-closed dashboard auth helpers
  lib/__tests__/telemetry-ingest.test.ts    # ✅ NEW
  __tests__/log.test.ts                     # ✅ NEW
  debug.ts                                  # ✅ NEW dashboard page (GET /debug)
  debug/data.ts                             # ✅ NEW read endpoint (GET /debug/data)
  debug/__tests__/routes.test.ts            # ✅ NEW
src/
  main.tsx                                  # ✅ EDIT: installGlobalTelemetry() + <TelemetryBoundary>
  vite.config.ts                            # ✅ EDIT: inject __XTRATA_APP_VERSION__
  vite-env.d.ts                             # ✅ EDIT: declare __XTRATA_APP_VERSION__
  lib/telemetry/                            # ✅ NEW module: types, fingerprint, classify,
                                            #   client (session/journey/queue), global,
                                            #   TelemetryBoundary, index (+ __tests__)
  lib/wallet/connect.ts                     # ✅ EDIT: instrument wallet_connect
  screens/market/useSponsoredBuy.ts         # ✅ EDIT: instrument market_buy
  lib/drops/sponsored-claim.ts              # ✅ EDIT: instrument drop_claim
  CollectionMintLivePage.tsx                # ✅ EDIT: instrument mint
```

Secrets to set in Cloudflare (Workers & Pages → xtrata → Settings → Variables and
Secrets), for **both** Production and Preview:

- `TELEMETRY_SALT` — required for wallet hashing (`wrangler pages secret put TELEMETRY_SALT`).
- `DEBUG_VIEW_KEY` — required, at least 24 characters; exchanged for an HttpOnly dashboard cookie.
