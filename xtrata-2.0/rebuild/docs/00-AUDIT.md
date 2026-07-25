# Audit of the Existing Implementation

Date: 2026-07-24. Scope: everything Collections/Drops-related in `xtrata-2.0` (authoritative), with `xtrata-1.0` and `Proof-of-Free` confirmed as legacy subsets.

## 1. Xtrata core (production `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0`)

Source: `contracts/live/xtrata-v2.1.0.clar` (1031 lines, Clarity 3).

- SIP-009 NFT `xtrata-inscription`; content-addressed via `HashToId` (seal-once dedupe).
- Lifecycle: `begin-inscription(hash, mime, total-size, total-chunks)` → `add-chunk-batch(hash, list 50 (buff 16384))` → `seal-inscription(hash, uri)` / `seal-inscription-batch(list 50 {hash,uri})` / `seal-recursive(hash, uri, list 50 uint)`.
- Hash chain: `H_0 = 0x00…00 (32 bytes)`, `H_{i+1} = sha256(H_i || chunk_i)`. Order-dependent rolling hash, 16 KiB chunks.
- Limits: `CHUNK-SIZE u16384`, `MAX-BATCH-SIZE u50`, `MAX-TOTAL-CHUNKS u2048` (32 MiB), `UPLOAD-EXPIRY-BLOCKS u4320` (~30 d) with permissionless purge.
- Fees: begin = `fee-unit` (0.1 STX baseline); seal = `fee-unit * (1 + ceil(chunks/50))`. Fee-unit governance bounded (abs [0.001, 1.0] STX; ≤2× up, ≥÷10 down per change). Fee dropped to 0.003 STX on mainnet (2026-03-20).
- `begin-or-get` returns existing token id for an already-sealed hash — the primitive the small single-tx mint path relies on.

Draft successors: `contracts/drafts/xtrata-v3.2.4-draft.clar` (128 MiB, duplicate-content allowed — changes the dedupe invariant), `contracts/other/xtrata-v3.4.0.clar`. **The live Drops/markets pin `.xtrata-v3-2-3` while collection-mint pins `.xtrata-v2-1-0` — the two subsystems target different cores today.** **User directive (2026-07-24): the rebuild targets core v3.2.3 only; v2.1.0 is not handled.** The core is reached via a trait, with the core principal a deploy-time template constant. v3.2.3 interface deltas: `add-chunk-batch` takes `(list 32 (buff 16384))`; native `mint-single-tx`/`-recursive`/`-with-relationships` (≤32 chunks = 512 KiB); duplicate content allowed (HashToId advisory, `begin-or-get` returns `(ok none)`); `seal-with-relationships(hash, uri, deps, parents)`; granular fee units + `quote-inscription-fee`; while paused, inscription restricted to `AllowedCallers` by contract-caller.

## 2. Collection Mint templates (v1.0 → v1.4)

`contracts/live/xtrata-collection-mint-v1.4.clar` (1712 lines, Clarity 3) is current.

- Streamlined payments (v1.2+): begin pays only core begin fee; collection mint price charged at seal via `pay-splits` (artist/marketplace/operator bps, remainder→operator, sum ≤ 10000).
- Reservations: `MintSessions{owner,hash}`; `minted + reserved < max-supply` asserted **before** reserving. Release: admin, admin-after-expiry (1440 blocks), self-service cancel.
- Phases: `Phases{phase-id}` with enable/start/end/price/per-wallet/supply/allowlist-mode (inherit/public/global/phase); global + per-phase wallet stats.
- Collection ordering: own `MintedIndex{index}→token-id` + `TokenMintContext` — independent of the core's global ids. **Keep this idea.**
- v1.4 adds `mint-small-single-tx` (≤30 chunks = 480 KiB in one tx).
- Roles: owner (two-step transfer), operator-admin, finance-admin; v1.3 scoped `RecipientEditors` granted by the *core* admin.
- Limitations: core hard-pinned; `mint-seal-batch` can't carry per-item recursive deps; `set-max-supply` one-shot; no v1.2 test suite.

## 3. Drops (v1.0 → v1.2, Clarity 4)

`contracts/live/xtrata-drops-v1.2.clar` (934 lines). Pre-inscribed distribution only: NFTs escrowed per-drop with a per-item fee budget.

- Campaigns: `create-campaign` → escrow drops while `intake-open` (`create-campaign-drops` batch ≤25, atomic) → `set-campaign-active` requires fully loaded (`drops-created == max-supply`).
- Claims: `claim-campaign` with secp256k1 attestation over `{bns-key, campaign-id, chain-id, claimer, contract, drop-id, expires-at}` checked against on-chain attestor pubkey hash; one-per-wallet / one-per-bns policy gates.
- Sponsorship settlement: sponsor `claim-fee` (≤ budget, ≤ 2 STX cap), `settle-refund` (sponsor immediately, creator after 144 blocks), creator `cancel` escape hatch.
- Unfinished: no v1.2 tests; batch escrow hardcodes `.xtrata-v3-2-3` instead of a trait param; relayer allowlist still points at v1.1.
- **Structural gap vs the rebuild goal:** drops are token-by-token escrow — there is no "select whole collection / range / all unassigned" primitive, no claim reservations, and inventory selection is relayer-directed rather than on-chain.

## 4. Sponsorship (x402 relay)

- Active backend: `functions/sponsor/[[path]].ts` (Cloudflare Pages, D1). quote/submit/status/attest-campaign/drop-policy. Sponsored-auth txs signed with origin fee 0, deny-mode PCs; contract+function allowlist; arg-count and exact-NFT-post-condition binding; `sponsorTransaction` with hot `SPONSOR_KEY`; traffic-driven settlement state machine (RECEIVED→…→SETTLED); rate limits (5/hr/wallet), `MAX_UNSETTLED 20`, low-balance floor 5 STX.
- `FABLE-5-SPONSOR-RELAYER-HANDOFF.md` P1 findings that bind the rebuild: (1) the **signed transaction must be the sole source of truth** — decode args, never trust request-body ids; (2) **single-writer nonce authority** for the hot wallet (Durable Object / queue) + atomic D1 leases; (3) per-origin rate limiting.
- Client: `packages/xtrata-sdk/src/sponsor.ts` + `src/lib/drops/sponsored-claim.ts` — clean, reusable.

## 5. Client layer

- Canonical hash/chunk helpers: `src/lib/chunking/hash.ts` (zero-copy) — duplicate slower copy in `packages/xtrata-sdk/src/mint.ts`. Consolidate.
- `packages/xtrata-sdk/src/upload-guard.ts` (resume/reconcile decisions, blind-seal guard) and `safe.ts` (guided flow state machine) — directly reusable concepts.
- Clarity read-parsers duplicated (`src/lib/protocol/clarity.ts` ≡ SDK `clarity.ts`).
- `@stacks/transactions` v6 in app/SDK vs v7 in clarinet tests — the rebuild standardizes on **v7**.
- Deploy: SDK `makeContractDeploy` with **`clarityVersion` pinned explicitly** (wallets ignore the hint and publish at network-latest — Clarity 4 broke `as-contract` deploys). Template substitution engine (`replaceLine` markers) in `src/lib/deploy/collection-template.ts` — pattern worth keeping.
- Schemas: `schemas/manifest-envelope.schema.json` (versioned, `supersedes`) and the L3 collection manifest — extend, don't replace.
- Tests: clarinet-sdk + vitest harness in `contracts/clarinet/` (~40 suites); no property/model tests; premerge smoke scripts.

## 6. UI (see 01-audit addendum when UI agent report lands; key facts folded into 06-UI-CLIENT.md)

Known from planning docs: homepage is a vanilla shell + `src/lib` single-logic-layer rule; Wizard and Collection Foundry keep batch state browser-locally (the core defect the rebuild eliminates); Drops claim UI + Proof-of-Free flow exist; a drops-v1.2 deployment-canary helper exists (`src/lib/deploy/drops-v1-2-canary.ts`) plus `/wallet-canary/` diagnostics.

## 7. Invariants worth carrying forward (with proof they exist today)

| Invariant | Where enforced today |
|---|---|
| Reservations count against supply immediately | collection-mint v1.4 `ensure-mint-session` (lines 1288–1318) |
| Payment only on successful completion | mint price charged at seal (1396/1433/1483) |
| Reservations expire and are recoverable | `release-expired-reservation` / `cancel-reservation` (1250–1284); core purge (689–721) |
| Batch validates before committing | `mint-seal-batch` uniqueness/session/count checks; drops `create-campaign-drops` atomic rollback |
| Two-step ownership transfer | collection-mint pending-owner (822–867) |
| Operational vs financial permission split | operator-admin / finance-admin / RecipientEditors |
| Deterministic collection indexes | `MintedIndex` assigned at seal |
| Pinned dependencies | `ALLOWED-XTRATA-CONTRACT` + `assert-core-contract` |
| Bounded transactions | list ≤50 (chunks/seals), ≤30 chunks single-tx, ≤25 escrow batch |
| Sponsor exposure bounded | budget-remaining + claim-cap + refund delay + cancel escape hatch |

## 8. Clarity cost boundaries that shape batch sizes

- 16 KiB per chunk buffer; **50** chunks or seals per list/tx; **30** chunks max for a full begin+upload+seal in one tx; **25** NFT escrows per tx (cross-contract transfer is the expensive op). These are the empirically proven budgets — the new contracts reuse them rather than rediscovering limits.
- The test-plan sizes 30/31 and 50/51 straddle exactly these boundaries.
