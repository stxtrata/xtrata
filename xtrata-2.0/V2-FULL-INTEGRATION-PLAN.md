# Xtrata 2.0 — Full Integration Plan: retiring the v1.0 workspace

**Date:** 2026-07-09 · **Status:** Market tab shipped; this plan covers the rest

Goal: every user-facing capability lives on the 2.0 site (the data-page homepage shell: one HTML shell, SPA-style tabs, homepage styles/themes, shared wallet session), and `workspace.html` is reduced to an admin-only console, then retired.

## What shipped this session (reference implementation for the pattern)

The new **Market tab** (`/market`) is the template for every migration that follows:

- Router: one segment added to the pre-paint classifier in `index.html` and `classifyPath`/`switchToPage`/`PAGE_TITLES` in `src/home/main.js`.
- Markup: one `<section class="panel panel-market">` in the shared `<main class="workspace">`, styled entirely with existing tokens (`--panel`, `--line`, `--ink`, badges, chips).
- Visibility: CSS `:root[data-page='market']` rules, same pattern as inscribe/xplorer/my-wallet.
- Logic: a self-contained module in `main.js` that **imports the React app's lib layer directly** (`/src/lib/market/registry.ts`, `settlement.ts`, `sponsored.ts`) — vite resolves TS imports in the homepage bundle, so business logic is shared, not duplicated. Read-only data via the existing `callReadOnlyJson`; transactions via the same `showContractCall` and wallet session the inscribe flow uses.
- Nav: `site-nav` link + landing page-card.

This is the core insight for the whole migration: **the homepage is the shell; `src/lib/**` is the single logic layer; only screens/JSX from the workspace need re-homing.**

## Current inventory: v1.0 workspace modules vs 2.0 site

| Capability | v1.0 workspace (React) | 2.0 site today | Action |
|---|---|---|---|
| Inscribe (file/text) | MintScreen | `/inscribe` (native, done) | None — retire MintScreen for public use |
| Viewer/Explorer | ViewerScreen | `/xplorer` (native, done) | None |
| Wallet grid + transfers | MyWalletScreen | `/my-wallet` (native, done) | None |
| Market (browse/buy) | MarketScreen | `/market` (native, **this session**) | Extend (Phase 1) |
| List / cancel / seller dashboard | MarketScreen | — | Phase 1 |
| Sponsored (no-STX) buy | MarketScreen + SponsoredBuySection | Badge + plain buy only | Phase 1 |
| Commerce (direct sales) | CommerceScreen / PublicCommerceScreen | — | Phase 2 |
| Collection mint (public) | CollectionMintScreen / CollectionMintLivePage | — | Phase 2 |
| Vault | VaultScreen | — | Phase 2 |
| Campaign console | CampaignConsoleScreen | — | Phase 3 (admin) |
| Contract admin / diagnostics / owner console | ContractAdminScreen, AdminDiagnosticsScreen, V323OwnerConsoleScreen | — | Phase 3 (admin — stays in workspace) |
| Collection manager (artist tooling) | src/manage/* | — | Phase 3 (admin) |

## Phase 1 — Complete the Market tab (highest value, pattern proven)

1.1 **Sell flow on `/market`.** "List an inscription" card: token picker fed from the connected wallet's grid data (reuse the my-wallet loader), price input with asset label from the selected market contract, sponsored-market deposit field (port `SponsorshipDepositField` behaviour to the vanilla module; quote via `sponsorApi`), `list-token` via `showContractCall` with NFT + STX-budget post-conditions (logic already in `src/lib/market` + `sponsored.ts`).

1.2 **Sponsored buy on `/market`.** Port the `useSponsoredBuy` state machine to the vanilla module (it is already framework-independent logic: sign with `sponsored: true`, POST `txRaw` to `sponsorApi`, poll status). The React implementation stays for the admin workspace; both consume `sponsor-client.ts`.

1.3 **Seller dashboard on `/market`.** "My listings" section when a wallet is connected: live/sold listings across registry contracts, cancel button, sponsored budget columns (deposited/claimed/remaining) and "Reclaim deposit" (`settle-refund`) using `getSellerBudgetSummary`.

1.4 **Listing enrichment.** Media previews on market cards: reuse the xplorer's token-media loader (same shell, already loaded) keyed by nftContract+tokenId; USD/GBP price echo via `src/lib/pricing`.

Tests: the market module's pure helpers (listing parse from cvToJSON, filtering, formatting) get extracted to `src/home/market-lib.js` (or `.ts`) so they run under vitest node env — the homepage monolith itself stays untested, its logic layer doesn't.

## Phase 2 — Public commerce surfaces onto the 2.0 site

2.1 **Collection mint page** (`/mint/<collection>`): new data-page rendering a collection's mint UI in homepage style. Logic from `src/lib/collection-mint` (already a lib). The React `CollectionMintLivePage` remains for embedding/legacy links until parity, then redirects.

2.2 **Commerce** (`/shop` or per-seller pages): same recipe from `src/lib/commerce`.

2.3 **Vault** (`/vault`): read/withdraw views from `src/lib` vault client (check `contracts/xtrata-vault.clar` client coverage first).

Each page: router segment + panel + `:root[data-page=…]` rules + module importing the lib. One page per PR, with a live-test checklist entry (pattern: `docs/plans/LIVE-TEST-CHECKLIST-main-staging.md`).

## Phase 3 — Workspace becomes admin-only, then link it accordingly

3.1 Strip public screens from `workspace.html` React app once Phase 1–2 reach parity (delete routes/sections from `App.tsx`, keep admin: ContractAdmin, Diagnostics, OwnerConsole, Campaign, Collection manager, PreinscribedCollection admin).

3.2 Gate `workspace.html` behind the existing `AdminGate`, rename the entry "Admin console", remove it from any public nav.

3.3 Redirects: any deep links into removed workspace sections → the equivalent 2.0 page.

## Phase 4 — Streamlining & consistency pass (all tabs)

4.1 **Single wallet session everywhere:** homepage tabs already share one adapter; ensure the wizard (`/wizard`, agent-one server) reads the same session via the existing wallet bridge instead of its own connect state where possible.

4.2 **Design QA per tab against the homepage system:** typography scale, badge palette, chip components, `--radius`/`--line` usage, dark/light theme correctness (all pages must respect the theme select), mobile grid breakpoints.

4.3 **Shared nav everywhere:** the `site-nav` (Home / Inscribe / Xplorer / My Wallet / Market / Wizard) should render identically on wizard pages, which currently carry their own header.

4.4 **Perf:** `/market` read-only calls are N+1 per contract (get-last-id + K listings). Add a Cloudflare function (`functions/`) that serves cached listing snapshots (same approach as the existing lineage endpoint), falling back to direct reads — removes rate-limit exposure from the Hiro API.

4.5 **Accessibility:** each new page keyboard-navigable; chips/tabs get proper `role`/`aria-selected` (market toolbar already does); run the a11y checklist per tab.

## Sequencing & sizing

| # | Item | Size | Blocked by |
|---|---|---|---|
| 1 | 1.1 sell flow + 1.3 seller dashboard | M | contracts deployed for sponsored parts |
| 2 | 1.2 sponsored buy (vanilla port) | S–M | relayer live + wallet txRaw spike |
| 3 | 1.4 previews + fiat echo | S | — |
| 4 | 2.1 collection mint page | M | — |
| 5 | 2.2 commerce, 2.3 vault | M | — |
| 6 | 3.x admin-only workspace + redirects | M | 1–2 parity |
| 7 | 4.x streamlining pass | M | rolling |

## Definition of done

A first-time visitor can browse, buy (incl. STX-free sponsored), sell, mint, inscribe, and view their wallet entirely on the 2.0 site without ever seeing `workspace.html`; the workspace is an authenticated admin console; every tab passes the design-QA and a11y checklist in both themes; `npm run test` and the live-test checklist stay green at each phase boundary.
