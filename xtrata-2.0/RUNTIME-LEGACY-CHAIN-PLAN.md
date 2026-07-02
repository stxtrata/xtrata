# Plan: full legacy-chain walking in the content runtime

**Problem.** Migrated tokens keep their id on the current core, but their content
chunks stay on the core they were minted on. `resolveRuntimeMeta` /
`resolveRuntimeContent` (`functions/runtime/lib.ts`) accept exactly ONE
`fallbackContract`, and `functions/inscription/handler.ts` supplies only the
default contract's `legacyContractId` (v3-2-3 → v2-1-0). v1-era ids therefore
fail with `Missing chunk 0` on `/inscription/<id>`, `/i/<id>`, and everything
downstream. The Studio, `/g` pages, and homepage currently work around it with
client-side ladders — this plan removes the need for the workaround at the source.

**Goal.** A single request for any token id resolves by walking the full chain
`v3-2-3 → v2-1-0 → v1-1-1` (derived from `contract-registry.json`
`legacyContractId` links, not hardcoded), with tests proving each behaviour, and
an iterate-until-green loop against real mainnet ids before it ships.

---

## Step 0 — Baseline and safety net (no behaviour change)

1. Branch: `runtime-legacy-chain`. All work behind it; production untouched.
2. Run the existing suites and record the baseline:
   `npx vitest run functions/runtime` (content.test.ts, lib.test.ts, cache.test.ts must be green before and after every step).
3. Add a **characterisation test** capturing today's behaviour: primary miss +
   single fallback hit resolves; primary miss + fallback miss throws
   `Missing chunk`. This pins the semantics we must not regress.

## Step 1 — Derive the chain from the registry (pure function, test-first)

New helper in `functions/runtime/lib.ts` (or a small `legacy-chain.ts`):

```ts
buildLegacyChain(startContractId, registry): RuntimeContractRef[]
// v3-2-3 -> [v3-2-3, v2-1-0, v1-1-1]
```

Rules, each with a unit test written BEFORE the implementation:
- follows `legacyContractId` links transitively from the start contract;
- de-duplicates and **detects cycles** (a registry typo must not loop forever — cap depth at 8);
- unknown start contract → chain of just itself;
- explicit `fallbackContractId` query param, when present, is appended (deduped) after the derived chain — preserving today's API;
- network-aware: only follows entries whose `network` matches.

## Step 2 — Generalise resolution from `fallback: one` to `chain: many`

Refactor `resolveRuntimeMeta` and `resolveRuntimeContent` to take
`contracts: RuntimeContractRef[]` (primary first) instead of
`primaryContract` + `fallbackContract`:

- Keep the old two-arg signatures as thin wrappers (`[primary, fallback]`) so
  `content.ts` call sites and any other importers keep compiling — mechanical,
  zero-risk step verified by the Step 0 characterisation tests.
- The internal loop becomes: for each contract in order → try meta; on success,
  read chunks from THAT contract (meta and chunks must come from the same core —
  add a test asserting we never mix meta from one core with chunks from another);
  on failure, record the diagnostic and continue.
- Error shape when all fail: keep `Missing chunk N.` message but extend
  `diagnostics` with `chainTried: [contractIds…]` so future debugging is trivial.
- Diagnostics/headers: `X-Xtrata-Runtime-Reconstruction-Fallback` becomes the
  index/id of the contract that served the content (existing header semantics
  preserved when index ≤ 1).

Unit tests (mock the Hiro fetches, as lib.test.ts already does):
- hit on 1st / 2nd / 3rd contract;
- all miss → error with full `chainTried`;
- upstream 429/5xx on one core → continues to next, retries per `readRetries`;
- caching: the cache key must record the SERVING contract (a v1-served token
  cached under the v3 key must still purge/serve correctly — extend
  cache.test.ts).

## Step 3 — Wire the chain into the entry points

- `functions/runtime/content.ts`: build the chain via `buildLegacyChain` from
  the requested `contractId` (+ optional explicit `fallbackContractId`).
- `functions/inscription/handler.ts`: stop computing the single
  `fallbackContractId` itself; pass through and let the runtime derive.
- Grep for other callers of `resolveRuntimeMeta/Content` and `fallbackContractId`
  (runtime/[tokenId].ts, modules/*) and migrate them the same way.

Integration tests in `content.test.ts`: request → chain walk → correct body,
headers, and diagnostics for a v1-era id, using mocked chain data.

## Step 4 — The "loop until fully functional" phase (real-world verification)

Scripted live check, iterated until it passes 100%:

1. Add `scripts/verify-legacy-chain.mjs`: takes a list of token ids spanning all
   eras — at minimum `1,2,3,4,5` (v1), a v2-1-0-minted batch, `1017,1111` and
   other native v3 ids, plus the curated-gallery lists in `src/home/config.js` —
   and hits `<base-url>/inscription/<id>` for each, asserting HTTP 200 and a
   non-JSON-error content type. Prints a pass/fail table with the serving core
   from the response header.
2. Loop: `npm run build` → `npx wrangler pages deploy dist --project-name=xtrata-2-0`
   → `node scripts/verify-legacy-chain.mjs https://xtrata-2-0.pages.dev` →
   fix whatever fails → repeat until the table is fully green **twice in a row**
   (second run confirms cache behaviour, not just cold resolution).
3. Also verify: latency of a native v3 id is unchanged (the chain must
   short-circuit on first success — no extra upstream calls on the happy path;
   assert `upstreamRequests` in diagnostics stays flat), and one deliberately
   bogus id (e.g. 999999999) fails fast with the chainTried diagnostic.

## Step 5 — Remove the client-side workarounds

Once Step 4 is green: delete the `CORES` ladders from
`xtrata-agent-one/wizard/manifests.html` and `functions/g/[[path]].ts`
(tiles/thumbnails go back to plain `/inscription/<id>`), redeploy, and re-run
the verify script plus a manual pass over the Studio preview, a `/g` gallery,
and the homepage v1-origins gallery. The homepage's explicit v1 gallery config
can stay — it's an optimisation, not a workaround.

## Step 6 — Ship

- Full suite: `npx vitest run` + `npm run test:contracts` green.
- Update `CHANGELOG-2.0.md` and note in `docs/app-reference.md` that the runtime
  now derives the full legacy chain from `contract-registry.json` — adding a
  future core only requires a registry entry with `legacyContractId` set.
- Deploy to xtrata-2-0.pages.dev, soak for a day, then production via the
  normal cutover flow.

**Rollback:** each step is a separate commit; Steps 1–2 are behaviour-preserving
by construction (wrappers + characterisation tests), so a bad Step 3/4 reverts
to a working single-fallback runtime in one `git revert`.

**Estimated shape:** ~1 new file (chain builder + tests), ~60 lines changed in
`lib.ts`, ~20 in `content.ts`/`handler.ts`, 1 verify script; the bulk of the
time goes into Step 4's deploy-verify loop, which is exactly where it should go.
