# Harness Review — Opus 4.8 Implementation Audit

**Date:** 2026-07-09 · **Reviewer:** Claude (Fable 5) · **Scope:** OPUS-4.8-IMPROVEMENT-HARNESS.md WS-1..WS-5

## Verdict

The work is solid and matches the harness. I verified the code directly (not just the changelog) and re-ran the new and adjacent test suites: chunking, mint/, pricing, payment-assets, lib/mint, lib/viewer — **209 tests, all passing**. No regressions found in the areas touched. Four deferred items and three new issues remain; details below.

## Verified complete

- **WS-1.1** `hash.ts` now uses `subarray()` views and incremental `sha256.create().update().digest()` — no chunk copies, regression vectors in `__tests__/hash.test.ts` pass.
- **WS-1.2** `src/screens/mint/selection-guard.ts` + wired into `MintScreen.tsx`; race test passes.
- **WS-1.3** `useTokenExistence` (owner-only reads) replaces automatic full summaries; "Show previews" / "Load more (N more)" paginated opt-in present for both deps and parents.
- **WS-1.4** `PREVIEW_SOURCE_BUDGET = 4000` applied to HTML.
- **WS-2** File | Paste text `role=radiogroup` chooser, `TEXT_MIME_PRESETS` in constants, byte counter, three collapsed advanced clusters, explicit default-URI choice card (`src/screens/mint/token-uri.ts`, tested).
- **WS-3 (partial by design)** `PriceAssetKey` extended with `usdt`; `src/lib/pricing/fiat.ts` (USD/GBP, FX staleness, tested); `src/lib/contract/payment-assets.ts` with post-condition builder (tested); `supportsMultiAssetPayment` capability flag added, `false` on all contracts so the picker is correctly hidden; `contracts/MULTI-ASSET-PAYMENT-FOLLOWUP.md` created.
- **WS-4.4** 11 screens moved to `React.lazy` under a single `Suspense`; recorded initial-chunk reduction ~260 KB (~23%).
- **WS-5** Timestamp artifacts cleaned + gitignored (note: running vitest regenerates them locally — harmless, ignored); `dist/` already untracked; wizard already single-source (`xtrata-agent-one/wizard` → `dist/wizard` via `copy-static-apps.mjs`); 12 planning docs moved to `docs/plans/`.

Good judgment calls I endorse: USDCx confirmed as the canonical native Stacks USDC (no duplicate USDC entry), and **USDT deliberately not hardcoded** into `KNOWN_FUNGIBLE_ASSETS` because no canonical mainnet SIP-010 contract could be verified — right call; a wrong hardcoded token contract is a fund-loss risk.

## Outstanding — deferred items (agreed, but track them)

1. **WS-4.1 / 4.2** MintScreen hook extraction and ViewerScreen split were skipped because there is no render-test harness for these 4,000-line components. Correct call, but the debt remains and MintScreen has grown further with WS-2. **Next step:** add a minimal React Testing Library harness (happy-path render + chooser/disclosure interaction snapshots) first, then extract `useFilePreparation` / `useMintCostModel` / `useRelationshipSelection` / `useMintExecution`.
2. **WS-4.3** was mis-scoped in my harness — App/PublicApp have no data-page switch (that routing lives in the vanilla-JS homepage). No action needed; noting the correction.
3. **Fiat wiring beyond MintScreen.** USD/GBP display is only in the mint cost card. `CommerceScreen`, `MarketScreen`, `VaultScreen` have zero `formatFiat`/`useDisplayCurrency` references. Mechanical follow-up using the existing hooks.
4. **Contract-side multi-asset payment.** The UI is ready but dormant; the Clarity work in `contracts/MULTI-ASSET-PAYMENT-FOLLOWUP.md` (accept SIP-010 payment legs, then flip `supportsMultiAssetPayment` per contract version) is the real unlock for sBTC/USDCx payments. This is the largest remaining piece of the project's payment goal.

## New issues found during review

5. **Lint does not cover TypeScript.** `eslint .` in this repo only lints `.js` (no `@typescript-eslint`, no `--ext`). All the new TS from this pass is unlinted; the harness's "lint gate" is weaker than intended. **Fix:** add `typescript-eslint` flat config for `src/**/*.{ts,tsx}` with `react-hooks` rules; budget time for the warning backlog it will surface.
6. **Pre-existing baseline tsc errors** in untouched files (`TokenContentPreview`, `wallet/connect`, `vite.config`, V323 console, etc.). The repo gates on tests+build, not `tsc`, so nothing is broken, but these block ever adding a typecheck gate. Worth a dedicated cleanup pass, then add `tsc --noEmit` to CI.
7. **USDT remains display-only in the price book.** Before any USDT payment support, re-verify whether a canonical Stacks USDT SIP-010 exists (none verifiable as of 2026-07). Do not proceed on an unverified contract ID.

## Remaining verification (needs Jim / a full-length session)

- Full gate: `npm run test` (contracts sync/verify + clarinet) — I only re-ran the vitest suites reachable within sandbox time limits; the prior session recorded 745/745 + `vite build` rc=0.
- Manual devnet smoke: small + chunked file inscribe, paste-text inscribe, fiat toggle USD↔GBP, confirm asset picker stays hidden.
- Git commit on your Mac — the sandbox mount has no `.git`, so none of this is committed yet.

## Suggested next-phase order

1. Contract-side multi-asset payments (item 4) — unlocks the project goal
2. Fiat wiring in Commerce/Market/Vault (item 3) — small, high-visibility
3. TS lint + tsc baseline cleanup (items 5–6) — protects everything after it
4. Render-test harness → WS-4.1/4.2 decomposition (item 1)
