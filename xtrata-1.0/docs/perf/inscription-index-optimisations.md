# Inscription index — performance optimisations

Running log of caching/loading optimisations for the D1-backed inscription
index that powers the homepage explorer grids and the React grids.

## Task 1 — Edge/HTTP caching on `/index/<contract>` GET (done)

**File:** `functions/index/[contract].ts` (GET path)

- Query params are normalised before use: `?ids=` values are de-duplicated and
  sorted, so equivalent requests (same ids in a different order, or with
  duplicates) collapse to a single cache entry. Range requests normalise
  `from`/`limit`/`order`.
- GET responses now carry
  `Cache-Control: public, max-age=15, s-maxage=60, stale-while-revalidate=300`.
- Responses are stored in and served from the Cloudflare Cache API
  (`caches.default`) under the normalised key. A hot page (e.g. page 1 of a
  popular gallery) is served from the edge with **zero Worker D1 work**.
- POST (sync / targeted refresh) and error responses remain uncached.
- The lazy background sync still runs on cache misses, so new mints and
  owner/migration changes self-heal as before.

**Notes / trade-offs**

- A page can be edge-cached for up to ~60s even while the index is still
  `behind` (mid-sync). This is acceptable: unsynced ids fall back to the chain
  on the client, and SWR revalidates silently. If we ever want strict freshness
  we can skip `cache.put` when `syncedCount < mintedCount`.
- Could not run `tsc`/`npm test` in this session (sandbox unavailable — host
  disk space). The `Cache` typing mirrors existing usage in
  `functions/runtime/cache.ts`. Run `npm run lint` / build locally before deploy.

## Task 3 — D1 index tuning (done)

**File:** `functions/migrations/004_inscription_index_tuning.sql` (new)

- Dropped `idx_inscription_index_contract_id` — an exact duplicate of the
  `PRIMARY KEY (contract, token_id)` that only added write cost on every upsert.
- Added `idx_inscription_index_refresh ON inscription_index(contract, updated_at)`
  for the rolling owner-refresh query
  (`... WHERE contract = ? ORDER BY updated_at ASC LIMIT ?`), which otherwise
  scans + sorts every row for the contract on each completed sync.

**Apply:**
`wrangler d1 migrations apply xtrata-manage --config functions/wrangler.toml`
(add `--remote` for the live D1).

## Task 2 — Combined lineage endpoint, one round-trip (done)

**Files:** `functions/index/page.ts` (new), `src/lib/viewer/index-summaries.ts`

- New endpoint `GET /index/page?primary=<id>&lineage=<id,id>&ids=1,2,3` resolves
  the whole lineage in **one D1 query** (`WHERE contract IN (...) AND token_id IN
  (...)`), dedupes primary-first server-side, and returns each token attributed
  to its `sourceContract`. SVG rows are skipped (chain fallback) — identical
  semantics to the previous client-side fan-out.
- Edge-cached with the same `Cache-Control` / Cache API pattern as task 1, keyed
  on normalised `primary`+`lineage`+`ids`. One cache entry per page instead of
  one per contract.
- Lazy freshness: for each contract that is behind/stale it fires that
  contract's own `POST /index/<contract>` in the background (`waitUntil`), so the
  existing sync logic is reused, not duplicated.
- Client: `fetchIndexedSummaries` now calls the combined endpoint first and
  falls back to the per-contract fan-out on any error (covers older deploys
  without `/index/page`). Both the homepage and React grids use this function, so
  both drop from 3 requests/page (v3/v2/v1) to 1.

**Notes**

- Routing: `functions/index/page.ts` (static segment) takes precedence over
  `functions/index/[contract].ts`. Real contract ids always contain a dot
  (`address.name`), so `page` can never shadow a contract.
- Same caveat as task 1 re: running tsc/tests locally before deploy (sandbox
  unavailable in-session).

## Next

- Task 5 — SVG tokens still chain-fall-back; store preview/data-uri in R2 so
  cold SVG-heavy grids stop hitting the chain.
