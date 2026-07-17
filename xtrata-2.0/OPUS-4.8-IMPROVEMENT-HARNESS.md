# Xtrata 2.0 — Improvement Harness (handover to Opus 4.8)

**Date:** 2026-07-09 · **Owner:** Jim · **Prepared by:** Claude (Fable 5) review + Codex optimisation report (verified)

This document is the implementation harness. Each workstream is independently shippable, ordered by priority, with file references, acceptance criteria, and verification commands. Work through workstreams in order; within a workstream, tasks are ordered by dependency.

---

## 0. Ground rules for the implementing agent

- **Repo:** `xtrata-2.0`. Node/Vite/React 18 + TypeScript strict + @tanstack/react-query v5. No router lib — routing is hand-rolled via `data-page` modes in `src/App.tsx` / `src/PublicApp.tsx`. The Inscription Wizard lives at `/wizard` (built from `xtrata-agent-one/wizard`, copied to `public/wizard`).
- **Do not touch** `dist/`, `node_modules/`, `*.timestamp-*.mjs` files, or `contracts/` unless a task says so. Do not change deployed contract addresses in `src/lib/contract/registry.ts` or `fungible-assets.ts`.
- **Sandbox build recipe:** bash calls are capped at 45s. Build in `/tmp/xbuild` (copy sources, symlink or reuse warm `node_modules`), run long steps in background with `nohup … &` and poll. `npm run lint` requires `--max-warnings=0` — fix warnings, don't suppress.
- **Verification after every task:** `npm run test:app` (vitest, 103 test files) and `npm run lint`. Full gate before finishing a workstream: `npm run test` (contracts + app + clarinet).
- **Text vs file split:** text inscribing today is the embedded `/inscribe` single-tx path, not the wizard. Keep that distinction; WS-2 formalises it.
- **Every task:** small commits, one task per commit, message prefixed `[WS-n]`.

---

## WS-1 — MintScreen correctness & performance (P1, from Codex report — verified in code)

Target files: `src/screens/MintScreen.tsx` (4,106 lines), `src/lib/chunking/hash.ts`, `src/lib/viewer/queries.ts`.

### 1.1 Streaming protocol hash + zero-copy chunking
`src/lib/chunking/hash.ts`: `chunkBytes` copies every chunk via `slice()`; the protocol hash repeatedly allocates `concatBytes(previousHash, chunk)`. Replace with:
- `chunkBytes` returning `subarray()` views (or `{offset, length}` descriptors) over the original buffer.
- Incremental hashing using `sha256.create()` from `@noble/hashes` (`.update(previousHash).update(chunk).digest()`), no concat allocation.
- Preserve the exact protocol hash output — add a regression test asserting the new implementation matches known vectors from the existing tests before swapping call sites in `MintScreen.tsx` (~line 1491).

**Accept:** identical hashes on existing test vectors; a new test with a ≥5 MB synthetic buffer; no `slice()` in the chunk hot path.

### 1.2 File-selection race guard
`MintScreen.tsx` `handleFileSelect` (~line 1452) awaits `arrayBuffer()` with no cancellation. Add a monotonically incrementing selection token (ref); after each `await`, bail if the token changed. Apply the same pattern to the preview pipeline (`resetPreview` consumers).

**Accept:** unit test simulating two overlapping selections where the first resolves last — committed state must belong to the second file.

### 1.3 Lazy relationship previews
`MintScreen.tsx` ~line 642 + `src/lib/viewer/queries.ts` ~line 93: up to 50 dependencies + 50 parents each trigger metadata/token-URI/legacy/media reads automatically. Change to: cheap existence/ownership validation on selection; full previews fetched only on an explicit "Show previews" action, first 12 at a time with "Load more".

**Accept:** selecting 50 deps issues only validation reads; preview fetches gated behind user action; existing tests pass.

### 1.4 HTML preview cap
~line 1555: HTML files are decoded in full. Cap the source/text representation at the same 4,000-byte budget used for text, show a size warning, and feed the iframe the original Blob URL instead of a decoded string.

**Accept:** a 10 MB HTML file previews without a full decode; iframe still renders.

---

## WS-2 — Wizard/Mint UX: Standard vs Advanced (P1)

### 2.1 Standard-mode layout
Restructure `MintScreen.tsx` render (~line 3060–3800) to the Codex layout:
1. "What would you like to inscribe?" — **File | Paste text** chooser
2. Content card (name/type/size/preview)
3. "Cost and approvals" — single decision card: "You will approve: N transaction(s)", total estimate, includes/excludes hint; the current seven-part fee grid moves into a disclosure
4. Primary action — "Inscribe file" / "Inscribe text"
5. **Advanced options** (collapsed): metadata URI, batch size, dependencies, parents, delegate clone, diagnostic logs

Keep the automatic small-file single-tx route, resumability, duplicate detection, and progress steps untouched.

### 2.2 Text-inscription path
Add the Paste-text flow: textarea + filename + MIME preset (text/plain, application/json, text/markdown, text/html) + live byte counter → constructs a `File` internally and reuses the shared mint pipeline. This aligns with the existing single-tx `/inscribe` text path — reuse its MIME presets/constants where they exist rather than duplicating.

### 2.3 Token URI honesty
`src/lib/mint/constants.ts` line 4: `DEFAULT_TOKEN_URI` is an opaque ArDrive URL silently pre-filled as "required". Change to an explicit choice: "Use Xtrata default metadata" (shows what it is) vs "Enter my own URI". Never inscribe the default without an affirmative selection.

**Accept (WS-2):** basic file inscribe reachable in ≤3 interactions with no advanced fields visible; text inscribe works end-to-end in devnet mocks; no tx can be built with the default URI unless explicitly chosen; a11y — disclosure is keyboard-operable, chooser is a labelled radio group.

---

## WS-3 — Multi-asset payments: sBTC / USDCx / USDC / USDT + USD/GBP display (project goal)

Existing foundation (do not rebuild): `src/lib/pricing/` (`PriceAssetKey = 'stx' | 'sbtc' | 'usdc'`, USD spot price book with staleness), `src/lib/contract/fungible-assets.ts` (mainnet USDCx + sBTC SIP-010 configs), `src/lib/contract/post-conditions.ts`, `flowproof/` (USDCx treasury/orchestration scripts), commerce/market settlement libs.

### 3.1 Extend the asset registry
- Add USDT (and canonical Stacks USDC if/when distinct from USDCx) to `KNOWN_FUNGIBLE_ASSETS` with correct decimals and `priceAssetKey`. Extend `PriceAssetKey` with `'usdt'`. **Verify current mainnet contract IDs before hardcoding — search the web / Hiro explorer; do not trust training data.**
- Price book: add USDT quote sourcing alongside the existing provider; keep the fallback/staleness semantics in `types.ts`.

### 3.2 Payment-asset selection in the mint/wizard flow
- Add an asset picker to the cost card (WS-2.1): STX (default) | sBTC | USDCx/USDC | USDT. For each non-STX asset build the SIP-010 `transfer` payment leg with exact-amount fungible post-conditions (extend `src/lib/contract/post-conditions.ts`; tests already exist in `__tests__/post-conditions.test.ts` — follow their pattern).
- Gate assets by contract capability: only offer an asset if the target contract version accepts it (`src/lib/contract/capabilities.ts`). If current contracts only accept STX, the picker ships behind a capability flag and the contract-side work is logged as a follow-up in `contracts/` — do not fake it in the UI.

### 3.3 Fiat display (USD & GBP)
- USD is already computed via the price book. Add GBP: a USD→GBP FX quote in the pricing provider (same staleness rules), `formatFiat(amount, 'USD' | 'GBP')` in `src/lib/pricing/format.ts`, and a currency toggle persisted in localStorage.
- Show fiat equivalents next to every asset amount in cost cards, commerce, and market screens (`CommerceScreen`, `MarketScreen`, `VaultScreen` already import pricing hooks).
- Fiat is **display only** — no fiat settlement in this workstream. If actual USD/GBP checkout is wanted later, that's a separate on-ramp integration (e.g. payment processor) and needs its own plan.

**Accept:** unit tests for each asset's post-conditions and decimal formatting (8dp sBTC, 6dp stables); price-book tests cover usdt + gbp; picker hidden for contracts lacking capability; `npm run test:app` green.

---

## WS-4 — Code health: decompose the monoliths (P2)

Top offenders: `ViewerScreen.tsx` 4,421 · `MintScreen.tsx` 4,106 (partially handled by WS-1/2) · `CollectionMintLivePage.tsx` 4,277 · `CollectionSettingsPanel.tsx` 3,209 · `PublicApp.tsx` 2,799 · `App.tsx` 1,914.

- 4.1 Extract MintScreen's non-render logic into hooks: `useFilePreparation`, `useMintCostModel`, `useRelationshipSelection`, `useMintExecution` under `src/screens/mint/`. Do this **after** WS-1/2 land so the extraction captures the fixed logic.
- 4.2 Split ViewerScreen by mode (`type ViewerMode` already exists) into per-mode components.
- 4.3 `App.tsx`: extract the `data-page` routing switch into `src/lib/routing/pages.ts` with a typed page map; both `App.tsx` and `PublicApp.tsx` consume it (respect the existing page-modes/wizard rename constraints in `PAGE-MODES-AND-WIZARD-NOTES.md`).
- 4.4 Code-split: wrap screen components in `React.lazy` + `Suspense` (none today) so the wizard/mint bundle doesn't ship admin/market/viewer code. Measure with `vite build` output before/after; record numbers in the PR.

**Accept:** no file over ~1,500 lines among the touched ones; no behaviour change (existing 103 test files green); main bundle size reduced and recorded.

---

## WS-5 — Repo & build hygiene (P3, quick wins)

- 5.1 Delete stray `*.timestamp-*.mjs` vite artifacts at repo root and add `*.timestamp-*.mjs` to `.gitignore`.
- 5.2 `dist/` is committed and huge; confirm with Jim whether it's intentionally tracked (it appears to serve static apps). If deliberate, add a README note; if not, gitignore it.
- 5.3 Deduplicate the wizard: `xtrata-agent-one/wizard/` and `public/wizard/` are parallel copies. Make one canonical (agent-one) and have the build copy it (`scripts/copy-static-apps.mjs` already exists) — never hand-edit both.
- 5.4 Root-level planning `.md` files (15+) → move to `docs/plans/`, keep `AGENTS.md`/`README` at root.

**Accept:** clean `git status` after build; wizard served identically (diff the built output).

---

## Suggested execution order & sizing

| Order | Workstream | Size | Risk |
|---|---|---|---|
| 1 | WS-1 (perf/correctness) | M | Low — pure fixes, test-guarded |
| 2 | WS-2 (Standard/Advanced UX) | L | Medium — big render refactor |
| 3 | WS-3 (payments) | L | Medium-high — contract capability dependency; verify token contract IDs online |
| 4 | WS-4 (decomposition) | L | Low-medium — mechanical, after 1–2 |
| 5 | WS-5 (hygiene) | S | Low |

## Final gate (before handback)

1. `npm run lint` (zero warnings)
2. `npm run test` (contracts sync/verify + vitest + clarinet)
3. `npm run build` and confirm `public/wizard` output diff is expected
4. Manual smoke on devnet: file inscribe (small + chunked), text inscribe, one non-STX payment path if capability-enabled, fiat toggle USD↔GBP
5. Update `CHANGELOG-2.0.md` per workstream
