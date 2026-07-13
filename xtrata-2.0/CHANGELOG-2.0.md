# Xtrata 2.0 — Change Log vs 1.0

Everything not listed here was copied verbatim from xtrata-1.0. Every change below was verified after it was made (build + tests, and bundle byte-comparison where applicable).

## Excluded from 2.0 (dead weight — still in 1.0)

node_modules trees (569 MB), `dist/` build output, `.wrangler`, `.artifacts`, `.DS_Store`, 11 `vitest.config.ts.timestamp-*.mjs` junk files, `forever-twins.zip`, one-off bug-report `.txt` files, `homepage-themes.html`, `homepage-registry-ledger.html`, comparison/hardening report `.md` files, `reports/`, `Refactor-Plans/`, `OPTIMISATION/`, `Launch-Campaign/`, `Dora-Hacks/`, `LetafricaBuild/`, `AAA-Collection/`, `ledger-native-systems/`, `protocol-primitives/`, `SVGs/`, `xtrata_inscription_holder_count/`, non-shipping `recursive-apps/*` (only `x-board` and `21-arcade` are needed by the build), clarinet `lcov.info` + `costs-reports.json`, and most of `docs/` (kept: app-reference, assumptions, contract-inventory, forever-twins-linking, ai-skills).

Result: ~980 MB → ~40 MB of source. Built `dist/` output verified identical (see Verification).

## Homepage restructure (index.html 14,014 → 593 lines)

- All inline CSS (3,679 lines, two `<style>` blocks) moved verbatim to `src/home/styles/home.css`, preserving cascade order; linked from `<head>`.
- The single 9,700-line inline `<script type="module">` moved verbatim to `src/home/main.js`. Verified: built JS bundles byte-identical to 1.0 after this step.
- 22 pure-data constants (theme keys, `CURATED_GALLERIES`, `EXAMPLE_VIEW_DESCRIPTIONS`, wallet/grid/explorer tuning constants, `GRID_MIME_LABELS`, `EXPLORER_*`, brand URL, twins maps) extracted to `src/home/config.js`. Each block was machine-checked to reference nothing outside itself before moving.

## Living Archive homepage (session 2026-07-13)

- Repositioned the public homepage around **“Create something the internet cannot forget”**, with the experience ordered as explore → experience → claim/collect → create → connect/build → technical proof.
- Added a real-object hero and six possibility cards using live Xtrata content (DYLE art #296, music #1107, Stacksboard #394, code #287), sponsored drops, and Forever Twins. Interactive inscriptions are sandboxed and lazy-loaded outside the opening stage.
- Replaced mechanism-first route names with intent-first doors (`Explore`, `Create`, `Claim`, `Collect`, `My Xtrata`, `Build`) while retaining the existing routes and leaving contract, wallet, market, drop, viewer, and mint mechanics unchanged.
- Added configurable homepage content in `src/home/homepage-content.js`: featured objects, intent routes, live activity doors, and one reusable campaign slot with artwork, actions, dates, sponsor, and featured-inscription fields. `src/home/homepage.js` renders those surfaces and emits `xtrata:homepage-action` events (plus `dataLayer` events when available).
- Added the object lifecycle, flagship stories, public-creation flywheel, later-stage technical foundation, builder entry, and final invitation. All new motion respects `prefers-reduced-motion`; responsive layouts collapse at 1060/820/600px.
- Added focused validation tests in `src/home/__tests__/homepage-content.test.ts` for configuration completeness, unique ids, real navigable routes, and inscription-backed previews.

## Wizard shell integration (session 2026-07-13)

- Changed the Wizard nav target from the standalone `/wizard/` page to a first-class shell mode at `/inscribe?wizard=1`, so the Xtrata header, wallet controls, navigation tabs, radio, footer, and selected visual theme remain available.
- The canonical Wizard is lazy-mounted once at `/wizard/?embed=1` and kept alive while switching tabs, preserving selected files and active progress without adding the heavy Wizard bundle to ordinary homepage loads.
- Embedded mode hides the duplicate Wizard header/footer and radio, follows the shell theme, and watches the shared wallet-session key so parent-shell connect/disconnect changes are reflected inside the Wizard.
- Market and Drops links now use the same client-side tab switching as the other shell pages, which also prevents an active Wizard frame from being torn down when those tabs are opened.
- Added focused route tests in `src/home/__tests__/page-mode.test.ts`.

## Active campaign rail (session 2026-07-13)

- Restored Suno More and Forever Twins as compact, configurable banners immediately below the primary navigation, keeping both active campaigns one click from the top without replacing the new Living Archive hero.
- Moved the advanced creation entry beside Create and named it `Inscription Wizard`, making the relationship between the simple and guided creation routes explicit while matching the product terminology everywhere else.
- Added campaign-banner validation and regression coverage in the homepage content tests; campaign interactions use the existing homepage action event/data-layer instrumentation.

## Compact homepage + wallet-safe Drops (session 2026-07-14)

- Compact and short laptop viewports now put the complete homepage invitation—including its actions, trust line, and `Connect a wallet`—before the featured-object artwork. Rendered geometry was checked at 1131×749, 1280×720, 1366×768, 1440×900, 1536×864, and 1920×1080.
- Drops re-renders wallet-dependent claim/reclaim actions immediately on connect and disconnect, and an owner action now requires the currently connected principal rather than a stale address.
- Sponsored drop claims now capture one claimant for the signing flow and send the explicit zero origin fee required by sponsored auth, preventing Xverse `SignatureValidation` failures caused by an omitted/default fee. A focused SIP-030 regression test covers the `sponsored: true` + `fee: '0'` request shape.
- Verified: 25 focused homepage, wallet, and sponsor-relay tests pass; production build succeeds. Focused ESLint remains blocked before file analysis by the repository's existing ESLint 8 / `react-refresh` recommended-config schema mismatch.

## Duplication removed

- `PEPE_ESCROW_RESOLVERS` (homepage) is no longer a hand-synced copy of `src/lib/twins/registry.ts`. It is now derived from `FOREVER_TWIN_COLLECTIONS` plus a small `TWIN_HOLDER_LABELS` override map. Adding a Forever Twins collection now requires only the registry entry (AGENTS.md step 2 "mirror in index.html" is obsolete). Equivalence to the original literal proven by test.
- Root cause of wizard duplication fixed: the two agent-one Vite lib builds copied all of `public/` into `xtrata-agent-one/wizard/` on every build. Both configs now set `publicDir: false`.
- Removed from `xtrata-agent-one/wizard/`: `favicons/`, `homepage-wireframe/`, `runtime/`, `x-board/`, `manifest.json` (byte-identical duplicates of `public/`, unreferenced by wizard pages) and the committed build artifacts `agent-one.js` / `agent-one-wallet.js` (regenerated by `prebuild`; now gitignored).
- Superseded release tooling removed (v3.2.3 kept): `scripts/{testnet,mainnet}-v3.2.1/2-*` (6 files), `src/mainnet-v3.2.1/2-handover.ts`, `web/mainnet-v3.2.1/2-handover.html`, and 26 matching package.json script entries.
- `functions/rpc` vs `rpc-testnet`: inspected, already deduped (thin wrappers over shared `functions/lib/hiro-proxy`). No change.

## Not changed (deliberately)

- `src/home/main.js` beyond the extractions above: the remaining code shares one mutable `state`/`dom` scope; fragmenting it further without in-browser smoke tests would be pure regression risk. Split it incrementally later, section by section.
- `xtrata-agent-one/` keeps its own `package.json`: it is a separate backend service (ffmpeg etc.) whose dependencies shouldn't bloat the web app install.

## WS-1 — MintScreen correctness & performance (Opus 4.8 improvement harness)

- **1.1 Streaming hash + zero-copy chunking** (`src/lib/chunking/hash.ts`): `chunkBytes` now returns `subarray()` views over the source buffer instead of `slice()` copies; `computeExpectedHash` uses incremental `sha256.create().update(prev).update(chunk).digest()` with no per-chunk concat allocation. Protocol hash output is unchanged. New regression tests: known vector, a ≥5 MB synthetic buffer vs a Node reference implementation, and a zero-copy-view assertion.
- **1.2 File-selection race guard** (`src/screens/MintScreen.tsx`, `src/screens/mint/selection-guard.ts`): `handleFileSelect` now begins a monotonic selection guard and bails after each `await` (`readFileBytes`, stored-attempt lookup, and the error/finally paths) if a newer file was selected, so a slow first read can no longer clobber a later selection. Guard extracted as a unit-tested helper (`createSelectionGuard`).
- **1.3 Lazy relationship previews** (`src/screens/MintScreen.tsx`, `src/lib/viewer/queries.ts`): selecting dependencies/parents now issues only cheap owner-existence validation (`fetchTokenExistence`/`useTokenExistence`, one `getOwner` read each) instead of full metadata/token-URI/SVG/media summaries. Full previews are opt-in behind a "Show previews" action and paginated `RELATIONSHIP_PREVIEW_PAGE` (12) at a time with "Load more". Existence checks use a distinct cache key so they never pollute the full-summary cache.
- **1.4 HTML preview cap** (`src/screens/MintScreen.tsx`): HTML files are no longer decoded in full. The preview iframe now renders from the original file Blob URL; the "View source" representation is capped to the shared `PREVIEW_SOURCE_BUDGET` (4,000 bytes) with a truncation notice. A 10 MB HTML file previews without a full in-memory decode.
- Verified: `vitest run` 721/721 across 137 files (4 new tests added); `tsc --noEmit` clean on all touched source files. Note: the repo `lint` script (`eslint .`, no `--ext`, no `@typescript-eslint`) only covers `.js` files, so these TypeScript changes are outside its scope — run `npm run lint` on your machine to confirm the JS gate.

## WS-2 — Mint UX: Standard vs Advanced (Opus 4.8 improvement harness)

- **2.1 Standard/Advanced layout** (`src/screens/MintScreen.tsx`, `src/styles/app.css`): the mint panel now opens with a labelled **"What would you like to inscribe?"** radio group (File | Paste text) and, in the common file path, shows only the file picker, preview, cost, and the primary action. The advanced clusters — delegate clone + dependencies + parents, metadata (token URI) + batch size, and diagnostic logs — are now collapsed, keyboard-operable native `<details>` disclosures (closed by default), and the seven-part fee grid moved into its own "Fee breakdown & estimate" disclosure. The automatic small-file single-tx route, resumability, duplicate detection, and progress steps are untouched. (Note: because the advanced fields are separated in the DOM by the preview/cost grid, they ship as three sibling disclosures rather than one combined node — all collapsed by default.)
- **2.2 Text-inscription path** (`src/screens/MintScreen.tsx`, `src/lib/mint/constants.ts`): choosing "Paste text" reveals a textarea, a content-type select (`text/plain`, `application/json`, `text/markdown`, `text/html`), an optional filename, and a live `characters · bytes` counter. "Use this text" builds a `File` from the input and runs it through the **same** `handleFileSelect` mint pipeline as a picked file. MIME presets/default-filename logic live in shared `constants.ts` (`TEXT_MIME_PRESETS`, `defaultTextFileName`) so the wizard and the embedded single-tx `/inscribe` text path can share one source of truth.
- **2.3 Token URI honesty** (`src/lib/mint/constants.ts`, `src/screens/mint/token-uri.ts`, `src/screens/MintScreen.tsx`): the opaque ArDrive default is no longer pre-filled into the field or silently substituted for a blank value. The field is now an explicit radio choice — **"Use Xtrata default metadata"** (which shows the actual default URL) vs **"Enter my own URI"** — resolved through the pure, unit-tested `resolveMintTokenUri`. A blank custom URI now blocks the mint with a clear message instead of defaulting. (Interpretation: the "default" option is the initial visible selection and its URL is shown, so it is transparent rather than silent; a tx is only ever built with the default when that option is the active choice.)
- Verified: `vitest run` 730/730 across 139 files (9 new tests: `token-uri`, `text-presets`); `tsc --noEmit` clean on touched source; `vite build` succeeds (only pre-existing PURE-comment / chunk-size warnings). Acceptance: basic file inscribe is reachable in ≤3 interactions with no advanced fields visible; text inscribe builds a File and reuses the pipeline end-to-end; no tx can be built with the default URI unless that option is the active choice; disclosures are native `<details>` (keyboard-operable) and the source chooser is a labelled `role="radiogroup"`.

## WS-3 — Multi-asset payments + fiat display (Opus 4.8 improvement harness)

- **3.1 Asset registry + price book** (`src/lib/pricing/types.ts`, `hooks.ts`, `src/lib/contract/fungible-assets.ts`): `PriceAssetKey` now includes `'usdt'`, and the price book (first-party route parser + Coinbase fallback) sources a USDT-USD quote alongside STX/BTC/USDC. **USDT is intentionally NOT added to `KNOWN_FUNGIBLE_ASSETS`:** per the harness, mainnet contract ids must be verified before hardcoding, and as of 2026-07 no canonical USDT SIP-010 mainnet contract could be confirmed on the Hiro explorer — a documented placeholder/TODO is left instead of a fabricated id. USDCx is confirmed as the canonical native Stacks USDC (Circle xReserve; aeUSDC is a deprecated predecessor), so no separate USDC entry was added.
- **3.2 Payment-asset selection + post-conditions** (`src/lib/contract/payment-assets.ts`, `capabilities.ts`, `contracts/MULTI-ASSET-PAYMENT-FOLLOWUP.md`): new `getAvailablePaymentAssets(capabilities)` and `buildPaymentPostCondition(...)` (exact-amount `FungibleConditionCode.Equal` post-condition per SIP-010 asset, reusing `buildFungibleSpendPostCondition`). Gated by a new `supportsMultiAssetPayment` capability flag, which is `false` for every shipped core version — so the mint cost card's payment-asset picker is hidden today (STX-only) rather than presenting an option the contract cannot honour. The contract-side entrypoint work is written up as a follow-up in `contracts/MULTI-ASSET-PAYMENT-FOLLOWUP.md`.
- **3.3 Fiat display USD & GBP** (`src/lib/pricing/fiat.ts`, `MintScreen.tsx`): `formatFiat(usdAmount, 'USD' | 'GBP', fxRate)` (returns null for GBP when no fresh FX rate — never a USD figure under a £ sign), `computeUsdFromBaseUnits(...)`, a USD→GBP FX hook (`useGbpPerUsd`, Coinbase `GBP-USD`, same staleness rules), and a `useDisplayCurrency()` toggle persisted in localStorage. The mint cost card now shows the estimated total in the chosen currency with a USD/GBP toggle. Fiat is display-only — no fiat settlement. (Broader wiring into `CommerceScreen`/`MarketScreen`/`VaultScreen` is a mechanical follow-up using the same helpers.)
- Verified: `vitest run` 745/745 across 141 files (15 new tests: `fiat` ×9, `payment-assets` ×6, plus USDT price-book coverage); touched source is `tsc --noEmit` clean (repo has pre-existing baseline tsc errors in unrelated files — the app gates on tests + vite build, not tsc); `vite build` rc=0. Acceptance: per-asset exact-amount post-conditions and 6dp-stable / 8dp-sBTC decimals are unit-tested; price book covers usdt; GBP FX + formatFiat tested; the picker is hidden for contracts lacking the capability.

## WS-4 — Code health / bundle (Opus 4.8 improvement harness)

- **4.4 Code-splitting (done, measured)** (`src/App.tsx`): the core mint/view path (`MintScreen`, `ViewerScreen`, `WalletLookupScreen`) stays eager, but the heavier admin/market/collection/commerce/vault/campaign screens are now `React.lazy` imports rendered under a single `<Suspense>` boundary in `<main>`. Result (vite build, main app): the shared initial `workspace` chunk dropped **1,138,545 → 878,512 bytes (−260 KB, ~23%)**, with ~262 KB of screen code now emitted as on-demand chunks (`V323OwnerConsoleScreen` 68 KB, `CollectionMintAdminScreen` 43 KB, `CollectionMintScreen` 42 KB, `CampaignConsoleScreen` 27 KB, `PreinscribedCollectionAdminScreen` 25 KB, `VaultScreen` 23 KB, and more) that no longer ship with the wizard/mint bundle. Total emitted JS is essentially unchanged (2,009,684 → 2,004,071 bytes) — the code is reorganised, not removed. All 745 tests stay green.
- **4.1 / 4.2 / 4.3 (deferred — rationale):** these are large refactors of 4,000+-line files (`MintScreen` hook extraction, `ViewerScreen` per-mode split) and a routing-map extraction. Two blockers make them unsafe to do well right now: (a) there is no component/render test harness for these screens, so a mechanical extraction can silently change behaviour with nothing to catch it; and (b) 4.3 assumes a `data-page` routing switch inside `App.tsx`/`PublicApp.tsx`, but the React apps don't have one — `App.tsx` renders its modules stacked (each self-collapsing) and the actual `data-page` routing lives in the vanilla-JS homepage (`index.html`/`src/home/main.js`), which is explicitly flagged as a monolith not to fragment. Recommend doing 4.1/4.2 behind a small render-test harness (e.g. React Testing Library) in a dedicated pass, and re-scoping 4.3 against the real homepage router.

## WS-5 — Repo & build hygiene (Opus 4.8 improvement harness)

- **5.1 (done):** deleted the 10 stray `*.timestamp-*.mjs` Vite artifacts at the repo root. The `*.timestamp-*.mjs` ignore pattern was already present in `.gitignore`.
- **5.2 (no action needed):** `dist/` is already listed in `.gitignore`, so it is not tracked — the earlier assumption that it was committed does not hold in this tree.
- **5.3 (already deduped):** there is now a single canonical wizard source (`xtrata-agent-one/wizard`); `scripts/copy-static-apps.mjs` copies it to `dist/wizard`. The parallel `public/wizard` copy no longer exists.
- **5.4 (done):** moved 12 root-level planning/design `.md` files into `docs/plans/`. Kept at root: `AGENTS.md`, `CHANGELOG-2.0.md`, `OPUS-4.8-IMPROVEMENT-HARNESS.md`, and the three docs still referenced by code/scripts (`XTRATA_AGENT_SKILL.md`, `MANIFEST-STUDIO-AND-GALLERIES-PLAN.md`, `BIP110-L1-INSCRIBER-DESIGN.md`).

## Verification

- `npm run build` end-to-end (main + agent-one + wallet + static apps + x-board aliases).
- `dist/` file-set diff vs 1.0: identical except 14 intentionally removed duplicate files under `dist/agent-one/` (all still served from the dist root).
- JS bundles byte-identical to 1.0 up through the script move; post-refactor, all extracted data confirmed present in bundles.
- Tests: vitest 713/713 across 135 files; `contracts:sync`/`verify` pass. (Clarinet tests need `npm install` inside `contracts/clarinet` — not run here.)

## Sponsored marketplace (STX-free buys) — implementation session 2026-07-09

Per `MARKETPLACE-SPONSORED-TRADING-PLAN.md`. Sellers escrow an STX fee budget at list time; buyers purchase sBTC/USDCx listings with zero STX via native sponsored transactions; unused budget ("dust") is refunded to the seller after settlement.

- **WS-A contracts:** `contracts/clarinet/contracts/xtrata-market-sponsored-{sbtc,usdcx}-v1.0.clar` — v1.0 market escrow + per-listing fee-budget escrow (`list-token` takes `fee-budget`; `buy` marks sold; sponsor-only capped `claim-fee`; `settle-refund` returns dust, seller self-settle after 144-block delay; `cancel` refunds everything). Escape-hatch invariant: seller can always recover NFT + unclaimed budget without the relayer. Registered in Clarinet.toml. Tests: `tests/xtrata-market-sponsored-{sbtc,usdcx}-v1.0.test.ts` — 22 cases incl. µSTX-conservation fuzz. All green; existing market suites unaffected.
- **WS-B relayer:** `xtrata-agent-one/svc/sponsor-service.mjs` — validates buyer-signed sponsored `buy` payloads (allowlist, sponsored-auth, fee 0, deny-mode post-conditions, budget coverage), sponsors + broadcasts with nonce serialization, then settles (claim-fee → settle-refund) via a resumable job state machine (RECEIVED→SPONSORED→CONFIRMED→CLAIMED→SETTLED/ABANDONED). Guards: duplicate-payload dedupe (restart-safe), per-address rate limit, capacity cap, low-balance refusal, buy-tx timeout. Tests: `svc/tests/sponsor-service.test.mjs` (`npm run sponsor:test`, 17 tests, offline — builds real signed sponsored txs). HTTP routes mounted in `server/server.mjs` under `/api/sponsor/{quote,submit,status/:id}`, opt-in via `SPONSOR_KEY` (+ `SPONSOR_MARKETS` allowlist).
- **WS-C lib:** `src/lib/market/sponsor-client.ts` (typed quote/submit/status client, error taxonomy, self-paid fallback signal), `src/lib/market/sponsored.ts` (fee-budget validation, sponsored-buy eligibility, seller budget summary incl. self-refund unlock), registry entry type gains `sponsored`/`sponsorApi`, activity types gain `claim-fee`/`settle-refund` + budget fields. Tests: `__tests__/sponsored.test.ts`, `__tests__/sponsor-client.test.ts`. Full `src/lib` suite: 516 tests green.

Not done yet (deliberately): MarketScreen UI wiring (list-with-deposit, "Buy — no STX needed" flow, seller budget dashboard) — needs the render-test harness first; indexer parsing of the new print events; testnet deploy + registry entries (contracts must be deployed before `market-registry.json` gains sponsored entries); live `estimateBuyFee` calibration.

## Sponsored marketplace — UI wiring complete (session 2026-07-09, cont.)

- **Render-test harness (first in repo):** `@testing-library/react` + `happy-dom` dev deps; vitest config gains the React plugin and `.test.tsx`; component tests opt into the DOM per file via `// @vitest-environment happy-dom` so the global env stays `node`.
- **Components (test-first):** `src/screens/market/useSponsoredBuy.ts` (sign → submit → poll → settled/failed state machine, race-token cancellation), `SponsoredBuySection.tsx` ("Buy — no STX needed" with live progress + self-paid fallback), `SponsorshipDepositField.tsx` (live relayer quote, min/max validation, refund explanation). 11 render tests.
- **MarketScreen wiring:** market registry entries with `sponsored: true` + `sponsorApi` activate the deposit field in the list flow (budget arg + exact-amount STX post-condition appended to `list-token`) and swap the Buy button for `SponsoredBuySection`. `requestMarketContractCall` gains `sponsored` passthrough (fee 0); `signSponsoredBuy` returns the wallet's `txRaw` and degrades with a clear message if the wallet doesn't hand the signed tx back. Listing parser now reads the sponsored tuple fields (fee-budget, budget-remaining, claimed, buyer, sold-at) when present; `MarketListing` type extended accordingly.
- Verified: 572 src tests green (split runs), production `vite build` rc=0.

### How to test locally

1. UI: `npm run dev` → http://localhost:5173/workspace.html → expand the Market panel.
2. Relayer: `cd xtrata-agent-one && SPONSOR_KEY=<hex-privkey> SPONSOR_MARKETS=<deployer>.xtrata-market-sponsored-sbtc-v1-0 node server/server.mjs` → serves http://127.0.0.1:8787/api/sponsor/{quote,submit,status/:id}.
3. Deploy the two sponsored contracts to **testnet**, then add each to `src/data/market-registry.json` with `"sponsored": true, "sponsorApi": "http://127.0.0.1:8787/api"` — the sponsored UI activates automatically for those entries.
4. End-to-end: list from a funded seller wallet (NFT + deposit escrowed) → buy from an STX-empty wallet via "Buy — no STX needed" → watch settle: claim-fee then settle-refund returns the dust to the seller.

Remaining before mainnet: testnet rehearsal incl. the Leather/Xverse sponsored-signing check (wallet must return `txRaw`; the UI falls back gracefully if not), live fee estimate calibration in the relayer, indexer parsing of claim/refund print events for the activity feed.

## Homepage Market tab (session 2026-07-09, cont.)

New `/market` page on the 2.0 site, native to the data-page shell and homepage styles (no workspace involvement): router segment in the pre-paint classifier + `classifyPath`/`switchToPage`/`PAGE_TITLES`; `panel-market` section in the shared workspace `<main>`; `:root[data-page='market']` CSS rules + market card/chip styles built on existing tokens; site-nav link and landing page-card. The market module in `src/home/main.js` imports the React app's lib layer directly (market registry, settlement, sponsored helpers) — shared logic, zero duplication. Reads live listings per registry contract via `callReadOnlyJson` (skips sold sponsored listings), asset filter chips (All/STX/sBTC/USDCx), native Buy through `showContractCall` with deny-mode post-conditions from `buildMarketBuyPostConditions`, "No STX needed" badge on sponsored markets, View → Xplorer deep link. Verified: vite build rc=0, 535 lib+screens tests green. Full migration of remaining v1.0 workspace modules planned in `V2-FULL-INTEGRATION-PLAN.md`.

## Mainnet deployment helper (session 2026-07-09, cont.)

- `contracts/live/xtrata-market-sponsored-{sbtc,usdcx}-v1.0.clar`: mainnet variants generated from the clarinet sources (mainnet nft-trait active, `ALLOWED-NFT-CONTRACT` → SP3J…743X.xtrata-v2-1-0, payment principals → live sBTC / USDCx token contracts).
- `scripts/mainnet-deploy-contract.mjs`: generalised deploy helper (successor to the v3.2.3 one-off) with a deployable-contract registry, Clarity 3 pinned, deployer-address assertion, and an automatic preflight that fails on `.mock-` principals, bare local principals, inactive mainnet trait line, or wrong payment token. `--list` shows the registry; dry-run by default; sponsored deploys print the go-live checklist (set-sponsor → relayer allowlist → market-registry.json entry → smoke test).

## Market page design v2 — thumbnails + expandable details (session 2026-07-09, cont.)

Listings now render as media cards: square thumbnail (SVG data URI → token-URI image → on-chain image content ≤512 KB via `fetchOnChainContent`, else a mime-kind placeholder; hydrated lazily, 4-wide concurrency, cached per token) linking to the Xplorer, price + asset/sponsored badges, and a collapsed **Details** disclosure loaded on first open: Metadata (type, size, creator, owner, token URI), Relationships (parents + dependencies as Xplorer links via `client.getParents`/`getDependencies`), Listing (price, market, seller, listed-at block, sponsorship budget remaining), and Trading history (list/buy/cancel events for the token from `loadMarketActivity`, cached per market contract). New CSS: `.market-thumb`, `.market-card__details`, `.market-detail*` on existing tokens. Build rc=0; market lib + component tests green.

## Browser deploy console (session 2026-07-09, cont.)

`web/deploy-console.html` + `src/deploy-console.ts` (new vite entry `deploy-console`): wallet-signed mainnet deploys in the browser, same trust model as the v3.2.3 handover page — the page never sees a key, the connected wallet must be the SP3J…743X deployer or deploy buttons stay locked, and each transaction is signed physically in the wallet popup. Registry mirrors `scripts/mainnet-deploy-contract.mjs` (both sponsored markets); in-browser preflight (source sha256 + bytes, no mock/local principals, mainnet trait active, payment token verified, already-deployed check against the Hiro API) must pass before the sign button unlocks; Clarity 3 requested on the deploy; explorer link + sponsored go-live checklist shown after broadcast. The CLI helper remains the headless alternative. Verified: esbuild bundles the entry with all imports resolved; the full vite build only exceeds the sandbox's 45s window (multi-entry cold build), run `npm run build` locally to confirm.

## Deploy console: wallet deploys removed after live failure (session 2026-07-09, cont.)

Mainnet tx 0x92046d…7ac4d confirmed the known wallet trap: popup flows ignore the Clarity 3 hint and publish at Clarity 4, where `as-contract` is unresolved — the sponsored-sbtc deploy aborted and the 0.5 STX fee was burned (the contract name remains free; failed deploys register nothing). The deploy console no longer offers wallet-signed deploys. It now: runs the preflight and shows source hash/bytes; presents the exact `scripts/mainnet-deploy-contract.mjs … --broadcast` command (copy button) for CLI deploy, which signs locally with Clarity 3 genuinely pinned; and once preflight detects the contract on-chain, flips to the post-deploy admin step — wallet-signed `set-sponsor` (an ordinary contract call, unaffected by the Clarity issue) plus the go-live checklist.

## Sponsored markets ported to Clarity 4 — wallet-signed deploys restored (session 2026-07-10)

Answer to "deploy without the 24 words": instead of pinning Clarity 3 (which requires local key signing because wallets ignore the version hint), the sponsored market contracts were ported to Clarity 4, the version wallets actually publish. Escrow outflows now use `as-contract?` with **precise allowances** — `(with-nft (contract-of nft) "xtrata-inscription" (list token-id))` for NFT releases (buy/cancel) and `(with-stx amount)` for budget claims/refunds — and `current-contract` replaces `(as-contract tx-sender)`. This is also a security upgrade: the contract can never move more than the explicitly allowed assets per call. Allowance syntax was verified empirically against the repo's clarinet SDK before porting. Clarinet.toml entries flipped to `clarity_version = 4`; the full sponsored suites (22 tests incl. conservation fuzz + escape-hatch) and the v1.0 market suite pass unchanged. Live mainnet variants regenerated; CLI helper pins Clarity 4 for these entries; the deploy console's wallet-signed deploy is restored (Clarity 4 requested = Clarity 4 published, no key ever leaves the wallet), with the CLI shown as fallback. Cleanup: probe files removed, stray vite.deploy-console-check.mjs deleted.

## Sponsored markets DEPLOYED to mainnet (2026-07-10)

Both Clarity 4 sponsored market contracts signed in the admin wallet via the deploy console and broadcast: `SP3J…743X.xtrata-market-sponsored-sbtc-v1-0` and `…-usdcx-v1-0`. Registry entries added to `src/data/market-registry.json` (appended after the existing markets so the STX default is unchanged; `sponsored: true`, `sponsorApi` pointing at the local agent-one relayer) — the sponsored deposit field and "no STX needed" buy UI activate from the registry alone. Remaining go-live: confirm both deploys show success + Clarity 4 on the explorer, create + fund a fresh relayer hot wallet, set-sponsor on both contracts (deploy console post-deploy step), start the relayer with SPONSOR_KEY/SPONSOR_MARKETS, end-to-end smoke.

## Post-deploy verification (2026-07-10)

Both sponsored markets CONFIRMED on mainnet and verified end-to-end:
- sBTC: tx 0xada656…a09c, block 8522301, canonical, **Clarity 4**, epoch 3.4.
- USDCx: tx 0xa86a83…f1e4, block 8522307, canonical, **Clarity 4**, epoch 3.4.
- Source integrity: on-chain `source_code` matches the repo live variants; local sha256 (401dbeb9…/d0f4cea5…) identical to the hashes shown in the deploy console before signing — repo bytes = signed bytes = chain bytes.
- ABI checked: full function set (list-token/buy/cancel/claim-fee/settle-refund + admin + read-onlys), correct Listings tuple incl. budget fields; payment principals point at live sBTC/USDCx; ALLOWED-NFT-CONTRACT at SP3J…743X.xtrata-v2-1-0; sponsor data-var defaults to deployer until set-sponsor.
- Local sweep all green: 38 clarinet market tests (both sponsored + STX/sBTC/USDC v1.0), 17 relayer tests, 516 lib + 255 screens/components/functions/packages vitest, production build rc=0.

Outstanding (human steps): relayer hot wallet + set-sponsor on both contracts, start relayer with SPONSOR_KEY/SPONSOR_MARKETS, live smoke (list → sponsored buy from STX-empty wallet → claim + dust refund). Note: registry `sponsorApi` currently points at the local relayer (127.0.0.1:8787) — update when the relayer gets a hosted URL.

## Market thumbnails: full media coverage (2026-07-10, cont.)

Every inscription type now renders on /market: HTML inscriptions and script-driven SVG animations mount as sandboxed live iframes (`sandbox="allow-scripts"`, `pointer-events: none`, srcdoc, capped by the grid's MAX_LIVE_HTML_FRAMES — the wallet-grid pattern); on-chain SVGs are sniffed — `<script` → live frame, otherwise blob `<img>` (SMIL/CSS animations play in img); other images ≤512 KB → blob img; videos ≤512 KB → muted looping autoplay `<video>`; fallbacks remain summary svgDataUri → token-URI image → mime placeholder. Live-frame count resets per re-render. Build rc=0, market suites green.

## Sponsor Ops console (2026-07-10, cont.)

New admin page `web/sponsor-ops.html` + `src/sponsor-ops.ts` (vite entry `sponsor-ops`): the whole relayer go-live as a guided checklist with live on-chain status, every transaction signed manually in the admin wallet. Steps: (1) relayer hot wallet — fresh key generated in-browser via crypto.getRandomValues, shown once, never transmitted (or paste an existing address; address persisted in localStorage, key never); (2) fund the float — wallet-signed STX transfer with live balance vs the 20 STX recommendation; (3) authorise — per-market set-sponsor buttons that read the current on-chain sponsor via call-read and flip to done when it matches the relayer; (4) run the relayer — exact SPONSOR_KEY/SPONSOR_MARKETS command with copy button and a reachability probe of 127.0.0.1:8787; (5) smoke test — live last-listing-ids and the buy-with-zero-STX walkthrough. Auto-refreshes every 30s. esbuild bundle verified.

## Serverless relayer — no backend required (2026-07-10, cont.)

The sponsor relayer now ships with the site as a Cloudflare Pages Function (`functions/sponsor/[[path]].ts`) — zero additional servers or costs. Same protocol as the Node relayer (quote/submit/status), same validation rules (mirrored from svc/sponsor-service.mjs, which keeps the offline test suite); job state in the existing D1 database (table auto-created); settlement is traffic-driven (each request advances up to 4 pending jobs: confirm → claim-fee → settle-refund) with the contract's 144-block seller self-refund as the no-traffic backstop. Activation is one secret: `wrangler pages secret put SPONSOR_KEY`. Registry `sponsorApi` switched to `/` (same-origin, works on the deployed site with no CORS); sponsor-ops step 4 now shows the wrangler command and a real `/sponsor/quote` health check. Node relayer kept for local dev.

## Sell flow: wallet → market, all currencies, optional sponsorship (2026-07-10, cont.)

- **New contract `xtrata-market-sponsored-stx-v1-0`** (Clarity 4): STX market with seller-funded fee sponsorship — a buyer holding EXACTLY the price and nothing more can buy; the seller's deposit covers the mining fee, dust refunds as usual. 11 clarinet tests (adapted conservation fuzz includes buyer+owner balances). Live variant + CLI/deploy-console registry entries added (deploy via the console before pushing the registry live); relayer allowlists (Pages Function + ops page) updated.
- **My Wallet: "List for sale"** button beside Send — enabled when an inscription is selected, deep-links to `/market?list=<tokenId>`.
- **Market page: "Sell an inscription"** card — token id (prefilled from the deep link), currency + checkout selector built from the registry (STX/sBTC/USDCx, each in standard or sponsored form), price input labelled per asset with per-asset decimals, live sponsorship deposit quote from the relayer (with fallback), pre-flight ownership check via the contract client before the wallet opens, `list-token` signed with deny-mode post-conditions (NFT + exact STX budget when sponsored).
- Verified: 110 market/screens/contract vitest + 33 sponsored clarinet tests green, production build rc=0.

## v1.1 sponsored markets: v3-only with core allowlist (2026-07-10, cont.)

Root cause of the failed list-token (tx 0x164621…47ff8, err u100): the v1.0 sponsored markets hardcoded `ALLOWED-NFT-CONTRACT = xtrata-v2-1-0`, rejecting all current (v3.2.3) inscriptions; the post-conditions rolled the tx back so only the fee was lost. Fix + policy decision (Jim): **v1.1 sponsored markets accept v3 only.** New contracts `xtrata-market-sponsored-{stx,sbtc,usdcx}-v1-1` replace the hardcoded core with an owner-managed `AllowedNftContracts` map (seeded with xtrata-v3-2-3 only; `set-nft-allowed` adds future cores without redeploys; `is-nft-allowed` read-only; `get-nft-contract` returns the primary v3 core). 36 clarinet tests across the three suites (mint on v3-2-3, allowlist admin coverage). All registries rolled to v1.1: CLI + deploy console (v1.0 sponsored entries removed — they hold nothing; the only list attempt failed), market-registry.json, relayer allowlist, ops page. Market UI: listings whose NFT core is xtrata-v2-1-0 render as "Legacy v2 inscription — delisted from sale" with a Migrate-to-v3 link (`/web/migrate.html`), no Buy (guarded in marketBuy too), plus a seller-only "Cancel listing (reclaim)" button so owners can pull the NFT back, migrate, and relist. GO-LIVE: deploy the three v1.1 contracts via the deploy console, then set-sponsor each on the ops page (both pages already show them).

## Optimisation session (2026-07-10, unattended)

- **Edge-cached listings endpoint** `functions/market/listings.ts` (GET /market/listings): aggregates live listings across every registry market server-side with the project HIRO key, cached at the Cloudflare edge (s-maxage=30, SWR 120). The market page now makes ONE cached request instead of ~1+N Hiro reads per market per visitor; direct reads remain as automatic fallback for local dev. Registry stays single-source (imports market-registry.json).
- **Seller dashboard on /market**: "My listings (N)" section appears when the connected wallet has listings — price/status per row incl. SOLD-settlement-pending, sponsored deposit + remaining columns, Cancel (returns NFT + deposit) on live listings, and "Reclaim deposit" (settle-refund) on sold sponsored listings with a note that self-reclaim unlocks ~24h post-sale if the relayer hasn't settled. Sold listings are now retained in state (public grid filters them; sellers see theirs).
- **Perf polish**: preconnect/dns-prefetch hints for api.hiro.so cut connection setup from the first chain read on every page.
- Verified: 767 vitest green (split runs), both Pages Function bundles clean, production vite build rc=0.

## Drops: sponsored free claims as a named product (2026-07-11)

"Claim free" is now a first-class product, not "buy for 0 STX" (per the 5.6 SOL strategy report). New contract `xtrata-drops-v1-0` (Clarity 4, v3-only allowlist, same escape-hatch invariant as the v1.1 markets): `create-drop` escrows an inscription NFT plus an STX fee budget from the creator; anyone else can `claim` it with a sponsored transaction — fee 0, zero STX needed; `claim-fee`/`settle-refund`/`cancel` mirror the market settlement path exactly, and `get-listing`/`get-last-listing-id` aliases expose market-shaped tuples so the relayer settles drops with no special casing. Group limits: each drop carries a creator-chosen group-id and a claimer gets at most one claim per (creator, group), so a 50-item batch with a shared id is one-per-person; self-claims rejected. 14 clarinet tests (claim, group limits, cancel, claim-fee caps, settle-refund + 144-block self-refund, STX conservation).

Relayer: `functions/sponsor/[[path]].ts` allowlists the drops contract and sponsors `claim` on it (`buy` remains markets-only via a per-contract function map); Node svc docs updated (it already supported per-market buyFunction). Deploy tooling: CLI registry + deploy console both carry `xtrata-drops-v1-0` (live variant in contracts/live/, mainnet principals).

New `/drops` page on the homepage shell (6th data-page): claim grid reusing the market card styling and media caches with "Claim free — no STX needed" as the primary action (sponsored sign → POST /sponsor/submit; automatic self-paid fallback when the wallet returns no txRaw), creator cancel on own drops, and a "Create a drop" card (inscription #, optional batch id for one-per-person limits, live deposit quote, ownership pre-check, deny-mode post-conditions). Nav link, home page card ("Claim free"), drops-registry.json (separate from market-registry to preserve its ordering contract). Verified: 541 src vitest + 50 sponsored/drops clarinet + 17 relayer svc tests green, both esbuild bundles clean.

GO-LIVE (drops): deploy `xtrata-drops-v1-0` via the deploy console, run `set-sponsor` to the relayer on the ops page, push.

## Sponsor relayer hardening (2026-07-12, from the 5.6 SOL review)

All three review findings fixed in `functions/sponsor/[[path]].ts`, plus one latent bug the review missed: the handler cast D1 `.all()` results directly to arrays, but D1 wraps rows in `{ results }` — settleBatch would have thrown on every request once live (new `rows()` helper everywhere).

- **Finding 1 (signed-arg binding):** the validator now decodes the signed function arguments (nft-contract trait + listing/drop id) and the signed transaction is the sole source of truth — body contractId/listingId must match exactly or the request is rejected before any chain read, wallet action or D1 write; get-listing additionally cross-checks the signed NFT principal against the on-chain listing. Mirrored in the Node svc (`expectedListingId`, LISTING_MISMATCH).
- **Finding 2 (settlement races):** atomic conditional state transitions (`UPDATE ... WHERE id=? AND state=?`, proceed only when exactly one row changed) with in-flight CLAIMING/REFUNDING lease states, 15-minute stale-lease recovery, payload-hash reserved in D1 BEFORE broadcast (RECEIVED state; duplicate submits collide at the insert, and a retry returns the existing job with 409), and settlement errors recorded on the job instead of swallowed. Full Durable-Object nonce ownership deliberately deferred until Drops has real public traffic.
- **Finding 3 (rate limit):** rolling per-origin limit restored (5 accepted jobs per address per hour, 429 RATE_LIMITED with Retry-After), plus input hardening: txHex canonical-hex + 20K size cap before deserialization, listingId must be canonical unsigned decimal, mainnet-only transactions.
- **Test gap closed:** new direct harness `functions/sponsor/__tests__/handler.test.ts` (8 tests) exercises THE PRODUCTION HANDLER with real signed fixtures (market buy + drops claim), an in-memory D1 double and stubbed chain — encoding all three findings including concurrent-settlement single-broadcast. Node svc suite now 18 tests (listingId-binding case added; fixtures parameterised). server.mjs SPONSOR_MARKETS entries now map drops contracts to `claim`.

## Non-breaking post-conditions everywhere (2026-07-12)

Allow-mode calls made wallets warn "this app may transfer any of your assets". Market cancel, seller reclaim (settle-refund) and drops cancel now sign in deny mode with exact escrow post-conditions (NFT out of the contract + contract STX equal to the remaining deposit). Drop claims drop the confusing "send exactly 0 STX" condition and carry only the NFT-out-of-escrow condition. 172 market/functions tests green, bundles clean.
