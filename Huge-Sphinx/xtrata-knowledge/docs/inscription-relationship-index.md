# Inscription relationship index — operations & maintenance

How the D1-backed inscription index records parent/child relationships, how it
stays current **automatically**, and the one **manual maintenance** action
(parent-edge backfill) — including the auth it now requires.

Audience: operators and agents maintaining the homepage/Xplorer relationship
navigation. For the caching/performance history of the index, see
[`perf/inscription-index-optimisations.md`](perf/inscription-index-optimisations.md).

---

## 1. What the index is

The index is a D1 (SQLite) cache populated from the core contracts' read-only
functions, so a page render is one D1 query instead of N per-token chain reads.

| Table | Holds |
| --- | --- |
| `inscription_index` | One summary row per token (owner, creator, hashes, mime, size, sealed, token-uri, migration source). |
| `inscription_parents` | One row per **edge**: `(contract, child_id, parent_id)`. The graph that powers relationship navigation. |
| `inscription_index_state` | Per-contract sync bookkeeping: `minted_count`, `synced_count`, `updated_at`, `sync_lock_until`. |

Endpoints (`functions/index/`):

| Endpoint | Purpose |
| --- | --- |
| `GET /index/<contract>?ids=…` or `?from=&limit=&order=` | Token summaries for a contract, served from D1 (edge-cached). |
| `GET /index/page?primary=&lineage=&ids=…` | Whole lineage resolved in one D1 query, deduped primary-first. |
| `GET /index/relations/<contract>?id=<id>` | Derived relationship graph for a token (see §3). |
| `POST /index/<contract>` | Sync / targeted refresh / **backfill** (see §2 and §4). |

`<contract>` is the full `address.name` id, e.g.
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.

---

## 2. Automated indexing (the default — no action needed)

Ongoing relationship indexing is automatic. New mints and edits flow into the
index over normal traffic; you do **not** run anything by hand for day-to-day
operation.

The flow, all in `functions/index/[contract].ts`:

1. **Sync reads summaries.** `sync()` → `runSync()` walks the contract's
   minted-id list (v3) or token range (v1/v2) and calls `readSummary()` per
   token. `readSummary()` extracts the `parents` list from
   `get-inscription-summary` (v3.2.0+ cores; older cores carry no parents).
2. **Upsert writes the edges.** `upsertToken()` writes the summary row, then
   calls `syncTokenParents()`, which **replaces** that child's rows in
   `inscription_parents` (delete-then-insert) with the current parent set.
   New parents on a fresh mint therefore create edges with no extra step.
3. **Lazy background sync.** `GET /index/<contract>` and `GET /index/page` fire
   a throttled background `sync()` (via `waitUntil`) whenever the contract is
   `behind` (`synced_count < minted_count`) or `stale` (`updated_at` older than
   ~60s). The backlog fills over successive page views; there is no cron (Pages
   has none).
4. **Stampede guard.** `sync()` takes a soft, self-expiring D1 lock
   (`sync_lock_until`, TTL ~120s) so concurrent page views don't launch
   redundant chain reads; a crashed run can't wedge the index — the lock
   expires.
5. **Relations are derived on read.** `GET /index/relations/<contract>` walks
   `inscription_parents`:
   - parents / ancestors: `child_id -> parent_id`
   - children / descendants: `parent_id -> child_id`
   - siblings: shared parent

**Net:** once migration 006 is applied (§5) and the table is populated, every
new mint that carries parents creates its `inscription_parents` rows during the
normal sync. The manual backfill in §4 is only for **old rows that predate the
edge table**.

---

## 3. Reading relationships

```bash
curl "https://<host>/index/relations/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3?id=287"
```

Returns the derived graph for token `287` (parents, ancestors, children,
descendants, siblings). Example expectation from the production backfill:
`id=287` resolves `children: [577]` with descendants including `577`, `688`,
`689`.

`<host>` is the deployment serving the functions — the Pages alias
(`opus.xtrata.pages.dev`, `main-staging.xtrata.pages.dev`) or the production
custom domain once it is confirmed to point at that deployment (see §7).

---

## 4. Maintenance: parent-edge backfill (manual, occasional)

**When you need it:** only after the edge table is introduced (migration 006) or
after importing old summary rows that predate edge indexing. In those cases the
summary rows already exist and the main sync may report complete, so there is no
natural backlog pass left to populate `inscription_parents` for the old rows.

**What it does:** `POST /index/<contract>?parents=backfill` walks existing
`inscription_index` rows, re-reads each token's summary from the chain, and
repopulates its edges via the same `syncTokenParents()` path used by normal
sync. It only reads public chain data and writes idempotent rows.

### Auth (required when configured)

The backfill is gated by an **opt-in** secret:

- If the Pages env var **`INDEX_ADMIN_TOKEN`** is set, every backfill call must
  send a matching **`x-admin-token`** header, or it returns `401`.
- If `INDEX_ADMIN_TOKEN` is **not** set, backfill stays open (unchanged).
- The guard is scoped to the backfill branch only. Normal sync and targeted
  refresh (which the app fires automatically) are never gated.

Set a **different** token per environment (preview vs production) in
Cloudflare → Pages → Settings → Environment variables, marked **Encrypt**.
Never commit the token; the code only reads `env.INDEX_ADMIN_TOKEN`.

### Parameters

| Param | Default | Notes |
| --- | --- | --- |
| `from` | `1` | First `token_id` to scan (inclusive). |
| `limit` | `50` | Rows per call, **capped at 100**. |

Response includes `refreshed`, `scanned`, `fromTokenId`, `lastTokenId`,
`nextFromTokenId`, `complete` (true when fewer than `limit` rows remained), and
an `upstream` diagnostic (`hiroKeyCount`, `hiroOnly`, `apiBaseCount`). The reread
uses **Hiro-only** API bases when Hiro keys are configured (including the
capability probe), to avoid `429` from the unauthenticated public fallback.

### Run it (paginated loop)

```bash
HOST="https://opus.xtrata.pages.dev"
CONTRACT="SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3"
TOKEN="<the INDEX_ADMIN_TOKEN for this environment>"   # omit -H if env var unset
FROM=1

while : ; do
  resp=$(curl -s -X POST \
    -H "x-admin-token: $TOKEN" \
    "$HOST/index/$CONTRACT?parents=backfill&from=$FROM&limit=100")
  echo "$resp"
  complete=$(echo "$resp" | jq -r '.complete')
  next=$(echo "$resp" | jq -r '.nextFromTokenId')
  [ "$complete" = "true" ] || [ "$next" = "null" ] && break
  FROM="$next"
done
```

Run once per contract that has pre-existing rows. After it completes, ongoing
indexing is automatic again (§2).

---

## 5. Migrations

Relationship indexing depends on:

- `functions/migrations/005_inscription_index_sync_lock.sql` — sync stampede lock.
- `functions/migrations/006_inscription_parents.sql` — the edge table.

Apply (add `--remote` for live D1):

```bash
wrangler d1 migrations apply xtrata-manage --config functions/wrangler.toml --remote
```

`syncTokenParents()` is wrapped defensively: if 006 has not been applied yet
(no `inscription_parents` table), core summary indexing still works — only edge
writes are skipped — so a partial deploy can't break the index.

---

## 6. Verification checklist (after deploy / merge)

- `GET /index/page?primary=<c>&lineage=<…>&ids=753,…,768` returns `tokens`, not
  an empty array. (Empty index pages are intentionally **not** edge-cached, so a
  targeted refresh shows up immediately — see §7.)
- `GET /index/relations/<v3-contract>?id=287` returns child/descendant data
  (e.g. `children: [577]`).
- Mint a token with parents and confirm `inscription_parents` rows appear
  **without** running the backfill.
- `GET /index/relations/...` no longer errors with
  `no such table: inscription_parents` (confirms 006 applied).

---

## 7. Operational notes

- **Empty pages are not cached.** `/index/page` returns `Cache-Control:
  no-store` for empty results and skips writing them to `caches.default`, so a
  targeted refresh that populates D1 is visible immediately instead of being
  shadowed by a stale empty edge-cache entry. Non-empty pages are still
  edge-cached (`s-maxage=60`, SWR 300).
- **Deployment/domain mapping.** Confirm which deployment the production custom
  domain (`xtrata.xyz`) maps to before assuming production serves the latest
  functions. During testing, `opus.xtrata.pages.dev` served the new functions
  while `xtrata.xyz` lagged/pointed elsewhere; use the Pages alias to validate
  function behaviour, then verify the custom-domain mapping in the Pages
  dashboard.
- **Rate limits.** Configure Hiro API keys so sync and backfill use authenticated
  Hiro bases; the backfill (probe + rereads) is Hiro-only when keys are present.
- **Backfill bounds.** `limit` is capped at 100 per call; the loop in §4 paginates
  via `nextFromTokenId`.

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `no such table: inscription_parents` | Migration 006 not applied | Apply migrations (§5). |
| Relations return parents but no children for old tokens | Edge table added after those summaries were indexed | Run the backfill (§4). |
| Backfill returns `401` | `INDEX_ADMIN_TOKEN` is set; header missing/wrong | Send `x-admin-token` matching that environment's secret. |
| Backfill / sync hits `429` | Unauthenticated public fallback under load | Configure Hiro API keys (reads go Hiro-only when keyed). |
| `/index/page` keeps returning empty after a refresh | (Pre-fix) stale empty edge-cache entry | Resolved: empty pages are now `no-store`; redeploy if on an old build. |
