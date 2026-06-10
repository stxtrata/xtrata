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

## SVG grid rendering fix (done)

**Files:** `index.html`, `src/components/TokenCardMedia.tsx`

**Bug:** `image/svg+xml` inscriptions rendered in the large preview canvas but
showed as blank tiles in the grid (both the inline homepage and the React
explorer). Root cause: the grid builds thumbnails by rasterising the image to a
`<canvas>` (`createImageThumbnail` → `createImageBitmap`). Generative SVGs
usually declare no intrinsic width/height, so the bitmap is 0×0,
`maxDimension <= 0`, and the function returns `null` — no thumbnail, blank tile.
The preview canvas always worked because it renders the SVG straight into an
`<img>` (browser scales it), never rasterising. (The "XML" tile label is just
`getGridMimeLabel` collapsing any `+xml` mime to "XML"; these are real SVGs.)

**Fix — render SVG as a direct `<img>` from the runtime content endpoint**
(served as `image/svg+xml`), bypassing the rasteriser:

- Homepage: `getTokenRuntimeImageUrl` now also returns the runtime URL for
  `svg`; a new grid branch renders SVGs via `renderGridRuntimeImage` (direct
  `<img>`) when there's no precomputed `svgDataUri`. No rasterising for SVGs.
- React `TokenCardMedia`: added an `svg-runtime` image source
  (`buildRuntimeInscriptionContentUrl`) preferred for SVG tokens without a
  data-uri, with an error fallback to the existing on-chain bytes path. React
  already skipped rasterising for `svg`, so this mainly covers SVGs served from
  the D1 index and those above the eager-load window.

**Safety:** both paths fall back to the prior behaviour on `<img>` error;
non-SVG tiles are untouched. Verify on an SVG-heavy gallery (e.g. the bullseye /
droplet XML tokens) in both the homepage explorer and the React explorer.

## Task #4 — Sync-stampede guard (done)

**Files:** `functions/migrations/005_inscription_index_sync_lock.sql` (new),
`functions/index/[contract].ts`

- Added `sync_lock_until` to `inscription_index_state`. `sync()` now acquires a
  soft, self-expiring lock (TTL 120s) via a conditional `UPDATE ... WHERE
  sync_lock_until <= now` and backs off (`{ skipped: true }`) if another sync
  holds it; the lock is released in a `finally`. The body moved to `runSync()`.
- Prevents concurrent page views (GET lazy trigger + `/index/page` POST fan-out)
  from launching redundant chain reads/writes. A crashed run can't wedge the
  index — the lock expires.
- Apply: `wrangler d1 migrations apply xtrata-manage --config functions/wrangler.toml`
  (`--remote` for live). Remote tracker note from migration 004 still applies if
  003 shows as pending.

## Task #6 — Persist index summaries client-side (done)

**File:** `src/lib/viewer/index-summaries.ts`

- `fetchIndexedSummaries` now seeds from the shared IndexedDB token-summaries
  store first (keyed by the primary contract), fetches only the misses, and
  persists freshly fetched summaries. Return visits / reloads paint the grid
  instantly from disk. TTL 5 min (owner/migration freshness handled
  authoritatively by the edge cache + rolling sync).
- Best-effort: cache errors are swallowed; SVGs are never index-cached (still
  chain-fallback). Both homepage and React use this function.

## Task #7 — React short-circuit index hits (done)

**File:** `src/lib/viewer/queries.ts`

- `useTokenSummaries` per-token queries now take `initialData` from the batch
  index map: index hits render immediately with no loading flash and never
  schedule `queryFn`; misses fall through to the normal per-token chain fetch.

## Next

- Task #5 — store SVG previews in R2 so the runtime SVG render is itself cached
  (the SVG grid fix removes the blank-tile bug; R2 caching would further cut cold
  cost). Larger change — own branch.
