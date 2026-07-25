# Xtrata Collections & Drops v3 — Architecture

New production baseline. Not a compatibility upgrade: new contract family, new client, new UI, new deployment process. The standard inscription Wizard is not required anywhere.

## 1. Terminology

- **Core** — the approved Xtrata inscription contract (**`xtrata-v3-2-3`** on mainnet — user directive 2026-07-24: v2.1.0 is out of scope), reached via a trait; the only external dependency of the family. v3.2.3 deltas that shape the design: chunk batches are `(list 32 …)` (not 50), native `mint-single-tx*` with a 32-chunk limit, duplicate content allowed (HashToId advisory — collection-level dedupe must be self-contained), `seal-with-relationships` (deps + parents), granular fee units with `quote-inscription-fee`.
- **Collection** — one deployed instance of `xtrata-collection-v3` (template-substituted per collection). Owns identity, supply, sessions, phases, and the ordered index.
- **Item / index** — a 0-based deterministic position in a collection, assigned at seal time. One item = one core inscription token.
- **Session** — an in-flight reservation + inscription upload for one item, keyed `{owner, content-hash}`. Counts against supply from creation.
- **Drop** — one distribution campaign in `xtrata-drops-v3`, holding an immutable resolved inventory drawn from exactly one collection.
- **Assignment** — the on-chain marking of a collection item as belonging to a drop (prevents inventory duplication across drops).
- **Sponsor budget** — STX escrowed in the drops contract per drop, from which the relayer reimburses transaction fees for genuinely free claims.
- **Manifest** — the client-side versioned, checksummed plan for a collection (files, hashes, order, metadata, batch plan). A cache/plan, never the source of truth; the chain is.

## 2. Contract boundaries

Three contracts + no registry. (A registry was evaluated and rejected: collection discovery is served by each collection contract's read-only surface plus the existing manifest/BNS resolver; adding an on-chain registry would add an admin surface and a deployment dependency without changing any trust property.)

1. **`xtrata-collection-v3`** (Clarity 3, template) — collection identity/metadata, roles, supply policy, reservations & sessions (proxying core begin/chunk/seal), phases/pricing/allowlists/limits, payout splits, deterministic `MintedIndex`, drop-assignment ledger, pause/finalize.
   - Clarity 3 because it must proxy the Clarity-3 core (`as-contract` composition proven in collection-mint v1.x) and because collection templates deploy via SDK with pinned `ClarityVersion.Clarity3`.
2. **`xtrata-drops-v3`** (Clarity 4, singleton) — drop lifecycle, inventory resolution (whole collection / index range / explicit ids / all-unassigned), claim eligibility (public, allowlist, signed attestation), claim reservations + expiry, per-wallet/total limits, escrowed NFTs for pre-inscribed mode, sponsor budgets + `claim-fee`/`settle-refund` settlement, cancellation and unclaimed-inventory recovery.
   - Clarity 4 for `as-contract?` precise allowances (`with-stx`, `with-nft`) — the escrow contract should never hold blanket authority.
3. **Sponsorship** — on-chain: the budget/settlement functions inside `xtrata-drops-v3` (escrow-side) — no separate contract; a separate sponsor contract would split the atomicity of claim+fee accounting. Off-chain: a rebuilt relayer (`rebuild/relayer` design) implementing the FABLE-5 handoff requirements: signed-tx-as-sole-source-of-truth, single-writer nonce authority, atomic job leases, per-origin and per-wallet rate limits, budgets checked on-chain before broadcast.

Key structural change vs the old system: **drops reference collection items by (collection principal, index) with an on-chain assignment ledger in the collection contract**, instead of per-token NFT escrow rows created 25-at-a-time. Pre-inscribed drops still escrow NFTs (transfer to drops contract at assignment), but selection is expressed as ranges/sets over the collection index, so "select all 100 items" is one creator action planned into a bounded, resumable transaction sequence rather than 100 individual selections. (All three drop modes distribute from escrow — see §4.1.)

## 3. Collection contract — state model

Vars: `owner`, `pending-owner`, `operator-admin`, `finance-admin`, `paused` (deploy default true), `finalized`, `supply-mode` (fixed | open | capped-closable), `max-supply` (0 = open until closed), `reserved-count`, `minted-count`, `next-index`, `reservation-expiry-blocks`, `active-phase-id`, collection metadata (name/symbol/description/artwork-uri/base-uri), `default-dependencies (list 50 uint)`, payout recipients + bps (artist/marketplace/operator, sum ≤ 10000), `drops-authority (optional principal)` (the drops contract permitted to assign/mint items).

Maps:
- `Sessions {owner, hash} → {index, phase-id, price, created-at, item-uri (optional)}` — the reservation. `index` is pre-assigned at reservation (deterministic ordering across batches; released indexes return to a free-list — see §3.1).
- `Items {index} → {token-id, owner-at-mint, phase-id, minted-at, content-hash}` — the ordered collection.
- `HashIndex {hash} → index` — collection-level duplicate detection (independent of core dedupe).
- `Assignments {index} → {drop-contract, drop-id, assigned-at}` — inventory ledger; an item may belong to at most one drop.
- `Phases`, `PhaseStats`, `Allowlist`, `PhaseAllowlist`, `WalletStats`, `PhaseWalletStats` — as proven in collection-mint v1.4 (modes inherit/public/global/phase).
- `FreeIndexes {slot} → index` + `free-count` — recycled indexes from expired/cancelled reservations, so ordering stays dense and deterministic.

### 3.1 Deterministic ordering with recovery
Reservation assigns `index = (pop free-list) or next-index++`. Expiry/cancel pushes the index back to the free-list. Invariant: at finalize, `Items` is dense over `[0, minted-count)` and `free-count == 0`.

### 3.2 Invariants (all machine-checked in tests)
1. `minted-count + reserved-count ≤ effective-max-supply` at all times (reservation counts immediately; concurrent sessions cannot oversubscribe).
2. Mint price is transferred only inside seal (payment on completion); begin only forwards the core begin fee.
3. Every sealed item has a unique dense index; index assignment is independent of which tx batch sealed it.
4. An index appears in `Assignments` at most once; assignment requires `drops-authority` and an unassigned, minted item (or, for mint-mode drops, an authorized future range).
5. Finalize requires `reserved-count == 0` and (fixed mode) `minted-count == max-supply`; finalize freezes all config.
6. Two-step ownership; operator-admin cannot touch funds/recipients; finance-admin cannot pause/configure phases.
7. Core principal is a compile-time constant; every core call passes `assert-core-contract`.
8. All entrypoints bounded: chunk batches ≤ 32 per tx (v3.2.3 core limit), seal batches ≤ 50, single-tx mint ≤ 32 chunks (512 KiB), admin batch lists ≤ 200 small tuples.

### 3.3 Lifecycle entrypoints
`reserve` (standalone reservation, returns index) · `mint-begin` (reserve-or-resume + core begin) · `mint-add-chunk-batch` · `mint-seal` / `mint-seal-batch (≤50)` / `mint-seal-recursive` · `mint-small-single-tx[-recursive]` (≤32 chunks, proxying core `mint-single-tx*`) · `cancel-reservation` / `release-expired-reservation` (permissionless after expiry — improvement over v1.4's admin-only) · `close-supply` (capped-closable → fixed at current minted+reserved) · `finalize`. Read-only pagination: `get-item(index)`, `get-items(list 50 uint)`, `get-unassigned-scan(start, count≤50)`, `get-session`, `get-phase`, counts/config getters.

## 4. Drop contract — state model

Vars: `owner`, `pending-owner`, `sponsor` (relayer principal), `attestor-pubkey-hash (optional)`, `claim-fee-cap`, `next-drop-id`, `paused`.

Maps:
- `Drops {drop-id} → {creator, collection, mode (pre-inscribed|zero-price|sponsored-mint), status (draft|funded|active|paused|ended|cancelled), start-block, end-block, total-limit, per-wallet-limit, eligibility (public|allowlist|signed), price (0 for free modes), fee-budget-total, fee-budget-remaining, inventory-count, claimed-count, reserved-count, created-at}`.
- `DropRanges {drop-id, seq} → {start-index, end-index}` (≤ bounded segments) + `DropExplicit {drop-id, slot} → index` — the immutable resolved inventory, built while `status = draft` via bounded `add-inventory-range` / `add-inventory-items (list 50)` calls that call the collection's `assign-to-drop` (which enforces no-double-assignment). "Whole collection" = the span `[0, minted-count)` split into ceil(n/50) calls (the collection caps a range call at 50 indexes); "all unassigned" = client-computed ranges from `get-unassigned-scan`, each validated on-chain at assignment. Each call consumes one of `MAX-RANGES` (25) stored segments, so **range-based inventory tops out at 1250 items per drop**; larger drops mix ranges with `add-inventory-items` batches or use several drops.
- `ClaimReservations {drop-id, claimer} → {index, reserved-at}` — reservation before settlement; expiry recoverable.
- `Claims {drop-id, slot} → {index, claimer, claimed-at}` + `WalletClaims {drop-id, claimer} → count` + `ItemClaimed {drop-id, index} → bool`.
- `Allowlist {drop-id, wallet} → allowance`.
- `Cursor {drop-id} → next-slot` for deterministic sequential allocation; optional VRF-style randomized allocation derives slot from `sha256(drop-id ‖ claimer ‖ id-header-hash)` mod remaining, with linear probing over unclaimed slots (bounded probe ≤ 50, else fall back to cursor) — documented as pseudo-random, not manipulation-proof against miners, and only offered for cosmetic ordering.

### 4.1 Modes

**As implemented (`xtrata-drops-v3`), all three modes distribute from escrow.** Every mode requires the inventory minted, assigned, and escrowed to the drops contract via bounded `escrow-batch (≤25)` calls; `activate-drop` asserts `escrowed-count == inventory-count` for all modes, and claims always pay out of `EscrowedTokens`. The modes therefore differ **economically, not mechanically**:

1. **Pre-inscribed** (mode 1): the creator inscribed the inventory up front. Claiming transfers an existing collection item. The claimer pays their own transaction fee.
2. **Zero-price** (mode 2): no mint price is charged, but the collector still pays the network transaction fee — UI copy must say so and must not call this free.
3. **Sponsored** (mode 3): as above plus a fee budget (`≥ MIN-FEE-BUDGET × effective-limit`, checked at activation). The claimer signs a fee-0 sponsored transaction; the relayer sponsors it, then settles `claim-fee` (≤ budget-remaining, ≤ claim-fee-cap) and `settle-refund` (sponsor immediately; creator after REFUND-DELAY 144). This is the only mode that may be described as free.

Creator `cancel-drop` recovers unclaimed escrow + remaining budget at any point before or during the drop (ending it).

> **Superseded design note.** An earlier draft of this section specified mode 2 as claim-time minting — the drop authorizing a future index range and the claimer running the collection mint path with price 0. That was deliberately not built: mint-through-drop would require the collection to call back into the drop for eligibility during seal, coupling the two contracts in both directions and creating a partial-mint failure mode with no clean recovery. Distribution-from-escrow keeps the dependency one-directional (drops → collection) and makes every claim a single atomic transfer. Direct mint-through-drop remains available as a future iteration if creators need inscription deferred to claim time.

### 4.2 Invariants
1. Inventory is immutable after activation; every inventory item is assigned exactly once in its collection.
2. `claimed-count + reserved-count ≤ inventory-count`; one `ItemClaimed` row per index; claim reservations expire and release.
3. Eligibility signature (when required) binds `{drop-id, claimer, collection, index-or-any, chain-id, contract, expires-at}` — replay-proof across drops, contracts, networks, and claimers.
4. Sponsor exposure ≤ `fee-budget-total`; `claim-fee` only by `sponsor`, only ≤ remaining, only for confirmed claims; refunds always recoverable by creator after delay (no funds strandable).
5. Unclaimed inventory (after end/cancel) returns to creator: escrowed NFTs transfer back, assignments cleared in the collection (`unassign-from-drop`, drops-authority-gated), budgets refunded.
6. Pause stops claims but never blocks creator recovery.

## 5. Transaction flows (per mode)

**Inscribe a 100-item collection (creator):** deploy collection (1 tx) → for each item ≤512 KiB: `mint-small-single-tx` (creator-phase, price 0) — 100 txs, batched by the ingestion engine ~1 per block window with nonce laddering; larger files: `mint-begin` + ceil(chunks/32) `mint-add-chunk-batch` + seal, with `mint-seal-batch` collapsing up to 50 seals per tx. Resume at any point: engine reads `get-session`/core `get-upload-state`/`HashIndex` and recomputes the remaining plan — no local state trusted.

**Whole-collection Drop:** `create-drop(collection, mode, config)` → `add-inventory-range` × ceil(n/50) covering `[0, minted-count)` (the collection bounds `assign-range-to-drop` at 50 indexes per call; the collection validates and assigns each) → `escrow-batch` × ceil(n/25) → [sponsored: `fund-budget`] → `activate-drop`.

This is **one creator action** in the Drop Builder, planned into bounded transactions — not one transaction. For a 100-item collection: 2 range calls + 4 escrow calls + activate.

**Sponsored claim:** claimer wallet signs `claim(drop-id)` fee-0 sponsored-auth, deny-mode PCs, exactly-one-NFT allowance → POST to relayer → relayer decodes signed tx (sole source of truth), checks drop on-chain (active, budget, limits), reserves job row, sponsors + broadcasts → confirmation → relayer `claim-fee` → `settle-refund`.

## 6. Sponsorship economics

Who pays what, by mode:

Direct minting from the collection (creator or public phases) is priced by the collection contract. Drops distribute already-inscribed items, so all three drop modes have the same inscription cost profile — the creator paid it during inscription — and differ only in who pays at claim time.

| Cost | Collection mint (paid) | Drop mode 1 pre-inscribed | Drop mode 2 zero-price | Drop mode 3 sponsored |
|---|---|---|---|---|
| Inscription storage (core fees) | minter | creator, up front | creator, up front | creator, up front |
| Mint price | minter | — | — | — |
| Claim/mint tx network fee | minter | claimer | claimer | sponsor budget |
| Failed tx / retries | whoever broadcast it | claimer | claimer | sponsor pays only sponsored broadcasts; a failed sponsored tx consumes budget only when the chain actually charged a fee — the relayer records both |
| Relayer settlement txs (`claim-fee`, `settle-refund`) | — | — | — | sponsor, reimbursed from budget |

Only mode 3 is free to the collector. Mode 2 means "no mint price", not "no cost".

Worst-case sponsor exposure per drop = `fee-budget-total` (hard on-chain cap) — publish this number in the Drop Builder before funding. Relayer refuses to sponsor when float < 5 STX, per-origin rate limits, and never fronts more than `claim-fee-cap` per claim.

## 7. Threat model (summary — full table in 07-THREATS.md)

Chain + approved contracts are authoritative; browser storage and indexers are caches. Top mitigations: reservation-before-anything for supply races; assignment ledger for fake membership/duplicate inventory; `ItemClaimed` + wallet counters for double claims; signed-tx decoding + nonce authority + D1 unique claims for relay replay/races; on-chain budget caps for sponsor draining; expiry + permissionless release for abandonment griefing; principal-prefix network guards + chain-id in signatures for network mismatch; role separation + two-step transfer for admin compromise; template constants + canary source-parity checks for wrong dependency addresses; ordered deploy-canary with per-stage verification for partial deployment.

## 8. Client & UI architecture

`rebuild/client` (new package, `@stacks/transactions` v7, no carryover of duplicated v6 helpers):
- `protocol/` — Clarity codecs, error normalization (single error taxonomy across both contracts).
- `collection/`, `drops/`, `sponsor/` — typed contract clients (read + tx builders, post-conditions, spend caps).
- `ingest/` — hashing (zero-copy chain hash, lifted from `src/lib/chunking/hash.ts`), dedupe, deterministic ordering, manifest build/validate (versioned + checksummed, import/export), batch planner, cost estimator.
- `engine/` — the resumable executor: plan → execute bounded txs in order → reconcile against chain (`get-session`, `get-upload-state`, `HashIndex`, `Items`) → retry-safe (idempotency = content hash) → per-item state machine: prepared → reserved → begun → partially-uploaded → staged → seal-submitted → confirmed → indexed → (failed|expired) → assigned → claimed.
- Persistence: manifest + progress snapshots are exportable files and browser cache **only**; every resume starts with chain reconciliation.

UI (`rebuild/ui`, new Vite entries on the existing MPA): **Collection Studio** (`/studio`), **Drop Builder + claim page** (`/drops3`), **Deployment Canary** (`/deploy-canary`). Reuse only `src/lib/wallet/connect.ts` (hardened provider layer) and network config.

## 9. Deployment dependency graph

```
core (already deployed, approved)  ──►  xtrata-drops-v3 (singleton, deploy once per network)
        ▲                                     ▲
        └── xtrata-collection-v3 (template, deployed per collection; constants: core principal, drops-authority = drops-v3 principal)
```
Order: verify core → deploy drops-v3 → verify → collections deploy per-creator thereafter (each canaried by the Studio's deploy step). Relayer config points at drops-v3 only after on-chain verification. All deploys SDK- or wallet-driven with explicitly pinned Clarity version and source-hash parity checks; contract names are versioned (`-v3-0-0`) since deployed contracts are immutable — recovery = new version + routing change.

## 10. Test plan (summary — full matrix in 08-TEST-PLAN.md)

Clarinet vitest suites per contract + property/model tests (fast-check over operation sequences: reserve/upload/seal/expire/cancel/claim orderings asserting §3.2/§4.2 invariants), client unit tests (planner, hash chain vs reference impl, resume decisions), integration tests on simnet for collection sizes 1/30/31/50/51/100 and planner-level 500/1000, plus the full scenario list from the brief (concurrency, duplicates, interrupted uploads, wallet rejection, unseen broadcasts, expiry, exhaustion, replay, wrong network, pause/recovery). Browser tests: Playwright over Studio/Builder/Canary against simnet-backed mocks.

## 11. Implementation plan

Stage order (tasks #2–#9): collection contract + tests → drops contract + tests → sponsorship (contract paths + relayer spec) → typed client + ingestion engine → Studio → Drop Builder/claim → deployment canary → integration/browser tests → testnet canary → production-readiness report. **No mainnet deployment without explicit approval.**
