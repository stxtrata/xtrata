# Xtrata Marketplace 2.0 — Multi-Asset Trading with Sponsored, STX-Free Buying

**Date:** 2026-07-09 · **Status:** Ready to implement · **Prepared by:** Claude (Fable 5)

Goal: one streamlined marketplace where inscriptions trade in **STX, sBTC, or USDCx**, and sellers can opt into **sponsored sales** — the seller pre-funds the mining fees at listing time, the buyer needs **zero STX** (they pay only the sBTC/USDCx price), and any unused fee budget ("dust") is returned to the seller after the inscription transfers to the buyer.

---

## 1. What already exists (build on, don't rebuild)

| Piece | Where | State |
|---|---|---|
| Per-asset market contracts (escrow list/buy/cancel, fee-bps) | `contracts/clarinet/contracts/xtrata-market-{stx,sbtc,usdc}-v1.0.clar` + clarinet tests | Deployed mainnet (`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.*`), registered in `src/data/market-registry.json` |
| Market lib | `src/lib/market/` (registry, client, actions, settlement, indexer, listing-resolution, cache) | Working; settlement already resolves STX vs sBTC vs USDCx and builds FT post-conditions |
| Market UI | `src/screens/MarketScreen.tsx` (2,186 lines) | Works, but one screen per contract selection; not a unified multi-asset market |
| Sponsored flag in wallet layer | `src/lib/wallet/connect.ts` (`options.sponsored`, lines ~83/516/526) | Plumbed but always `false` — no sponsor backend |
| Deposit/refund state machine | `xtrata-agent-one/svc/deposit-service.mjs` + `SERVICE_SPEC.md` | Proven pattern: quote → deposit → act → deliver → refund dust → receipt → wipe key |
| Pricing/fiat | `src/lib/pricing/` (USD/GBP, per-asset quotes) | Done in prior workstream |

The sponsored-sale design below deliberately reuses the deposit-service lifecycle and the existing v1.0 market escrow semantics.

---

## 2. Architecture decision: how sponsorship works

**Stacks-native sponsored transactions** (auth type 0x05): the buyer signs the `buy` call with `sponsored: true` and fee 0; a sponsor account attaches the fee and broadcasts via `sponsorTransaction()` from `@stacks/transactions`. Mining fees are always paid in STX by the *sponsor account* at broadcast time — a Clarity contract cannot pay a mining fee. Therefore:

- **On-chain:** a new `xtrata-market-sponsored-v1.0.clar` per payment asset (sBTC + USDCx variants) extends the v1.0 escrow with an **STX fee-budget escrow** attached to each listing. `list` takes the NFT into escrow *and* takes `fee-budget` µSTX from the seller. The contract holds the budget; it is not the fee payer — it is the accounting + refund guarantee.
- **Off-chain:** a small **sponsor relayer** (new `xtrata-agent-one/svc/sponsor-service.mjs`, same state-machine style as deposit-service) holds a hot wallet that actually pays fees. After a sponsored `buy` confirms, the relayer calls `claim-fee (listing-id, amount)` on the contract to reimburse itself from that listing's budget (capped, owner-gated); the remainder is refunded to the seller by `settle-refund`.
- **Buyer UX:** buyer needs only sBTC/USDCx. Wallet prompts one signature (price + FT post-condition, fee 0, sponsored). App POSTs the signed payload to the relayer; relayer validates, sponsors, broadcasts.

Why this over alternatives: pure off-chain accounting (deposit-address-per-listing) gives no on-chain refund guarantee to the seller; pure on-chain can't pay mining fees. The hybrid keeps seller funds trust-minimised (budget provably refundable via `cancel`/`settle-refund`) while the relayer's exposure per tx is one mining fee, reimbursed atomically after confirmation.

### Fund flows

```
LIST (seller signs, pays own mining fee):
  NFT → market escrow;  fee-budget µSTX → market escrow;  listing{price, asset, budget} recorded

BUY (buyer signs sponsored, fee 0; relayer sponsors + broadcasts):
  buyer's sBTC/USDCx → seller (minus fee-bps);  NFT → buyer
  relayer hot wallet pays the actual mining fee in STX

SETTLE (relayer, after buy confirms):
  claim-fee: budget → relayer (≤ actual fee paid, ≤ budget, ≤ per-listing cap)
  settle-refund: remaining budget → seller   ← the "dust return"

CANCEL (seller):
  NFT → seller;  full remaining budget → seller
```

### Fee-budget sizing

Quoted at list time by the relayer's `/quote` endpoint: `budget = estimated_buy_fee × safety_multiplier (default 3) `, floor 0.05 STX, ceiling 2 STX (configurable). Seller sees "Sponsorship deposit: X STX (unused portion refunded when sold or cancelled)".

---

## 3. Workstreams

### WS-A — Clarity: `xtrata-market-sponsored-v1.0` (sBTC + USDCx variants)

Start from `xtrata-market-sbtc-v1.0.clar`. Additions:

- `Listings` map gains `fee-budget: uint`, `budget-remaining: uint`, `sponsor: principal` (the authorised relayer principal, set per contract by owner).
- `list(nft-contract, token-id, price, fee-budget)` — additionally `stx-transfer?` fee-budget from seller to contract. Assert `fee-budget >= MIN-BUDGET`.
- `buy(nft-contract, listing-id)` — unchanged semantics (works for both direct and sponsored buys; in a sponsored tx `tx-sender` is still the buyer). Marks listing `sold: buyer` instead of deleting, so settlement can still read it.
- `claim-fee(listing-id, amount)` — only callable by `sponsor`; only on sold listings; `amount <= budget-remaining` and cumulative claims `<= MAX-CLAIM-PER-LISTING`; transfers STX contract→sponsor.
- `settle-refund(listing-id)` — callable by sponsor **or seller** (permissionless for the seller so a dead relayer can't strand funds); transfers `budget-remaining` to seller and deletes the listing. Guard: only after `sold` or a timeout of `REFUND-DELAY` blocks post-sale (sponsor gets that window to claim first; after it, seller sweep takes priority).
- `cancel(listing-id)` — v1.0 behaviour + refund full `budget-remaining` to seller.
- `set-sponsor(principal)`, `set-claim-cap(uint)` — owner-gated.
- Events (`print`) for list/buy/claim/refund/cancel including budget figures, so the indexer needs no guesswork.

**Escape-hatch invariant (write it as a test first):** in every reachable state, the seller can recover NFT + unclaimed budget without the relayer's cooperation.

**Clarinet tests** (`contracts/clarinet/tests/xtrata-market-sponsored-v1.0.test.ts`, mirror the existing market test files, run against `mock-sbtc`/`mock-usdcx`):

1. list escrows NFT + exact budget; balances asserted
2. buy transfers NFT to buyer, price−fee to seller, fee-bps to owner (reuse v1.0 cases)
3. claim-fee: sponsor-only; rejects over-budget, over-cap, unsold listing, double-claim beyond cap
4. settle-refund: pays seller exactly budget−claims; deletes listing; idempotence (second call errs)
5. seller self-refund after REFUND-DELAY when sponsor never claims
6. cancel returns NFT + full budget; cancel after sold rejected
7. fuzz: random claim/refund/cancel orderings never mint or lose µSTX (sum of balances conserved)
8. non-sponsor cannot claim; non-seller cannot cancel; re-list of same token blocked while listed

### WS-B — Sponsor relayer service (`xtrata-agent-one/svc/sponsor-service.mjs`)

Same conventions as deposit-service (job-state files, resumable, receipts):

- `POST /quote` → `{budgetMicroStx, expiresAt}` for a proposed listing (current fee estimate × multiplier).
- `POST /sponsor` — body: buyer's signed sponsored tx (hex) + listing-id + market contract id. Validation before signing: deserialize; assert contract+function are an allowlisted market `buy`; assert fee=0, sponsored auth; assert listing exists, unsold, and `budget-remaining >= fee we'd attach`; assert buyer post-conditions present (FT exact-amount). Then `sponsorTransaction({transaction, sponsorPrivateKey, fee, sponsorNonce})`, broadcast, persist job `SPONSORED`.
- Settlement loop (poll like deposit-service): on buy confirmation → `claim-fee` (actual fee paid) → `settle-refund` → job `SETTLED`, emit receipt (txids for buy/claim/refund, dust amount). On buy rejection/timeout → job `ABANDONED` (nothing spent but a possible fee on a failed tx — claim it only if the contract call actually consumed budget rules allow; default: eat it, log it).
- Hot-wallet management: dedicated sponsor key (env), nonce queue (serialize sponsorships), low-balance alarm threshold, per-address and global rate limits, max concurrent unsettled jobs.
- `GET /status/:jobId` for the frontend to poll.

**Service tests** (`xtrata-agent-one/svc/__tests__/sponsor-service.test.mjs`, node test runner like existing svc tests, chain mocked):

1. rejects: wrong contract, wrong function, nonzero fee, non-sponsored auth, missing post-conditions, unknown/sold listing, budget too small
2. happy path: sponsor → broadcast → confirm → claim → refund; receipt contains all four txids and correct dust math
3. crash-resume at every state (kill after SPONSORED, after CLAIMED — resumes to SETTLED)
4. nonce collision: two concurrent sponsorships serialize correctly
5. rate-limit and low-balance refusal paths

### WS-C — Frontend: unified marketplace + sponsored flows

**C1. Unified market view.** Today MarketScreen shows one contract at a time. Add an aggregated listings view: query all registry entries for the active network in parallel (react-query, one query per contract, merged + sorted), with asset filter chips (All | STX | sBTC | USDCx), price-in-fiat toggle (existing `fiat.ts`), and per-listing asset badge (badge variants already exist in `settlement.ts`). Keep the per-contract admin/detail behaviour underneath.

**C2. Seller: list with sponsorship.** In the list flow, when the chosen market is a sponsored variant: fetch `/quote`, show "Sponsorship deposit X STX — buyers won't need STX; unused deposit refunded after sale", build the `list` call with the budget arg + STX post-condition for `price ∪ budget`. Extend `validateListAction` for budget presence/min.

**C3. Buyer: STX-free purchase.** On a sponsored listing, the buy button becomes "Buy with sBTC — no STX needed": build `buy` with `sponsored: true`, fee 0, FT post-condition; on wallet return, POST payload to relayer `/sponsor`; poll `/status/:jobId`; surface states (Sponsoring → Broadcast → Confirmed → Settled). Fallback: if relayer is down, offer the normal self-paid buy path.
   - `connect.ts`: sponsored calls must **return the signed tx** instead of letting the wallet broadcast — verify the installed `@stacks/connect@7` behaviour with each target wallet (Leather/Xverse) early; this is the highest integration risk in the plan. If a wallet insists on broadcasting sponsored txs itself, gate that wallet out of the sponsored path with a clear message.

**C4. Seller dashboard.** "My listings" gains budget columns: deposited / claimed / refunded, with a "Reclaim deposit" button that calls `settle-refund` directly when eligible (the trust-minimised path).

**C5. Indexer/settlement lib.** Extend `src/lib/market/types.ts` + `indexer.ts` for the new events (`claim-fee`, `settle-refund`, budget fields); extend `parsers.ts`; unified activity feed shows "Sold — sponsored (buyer paid no STX)".

**Vitest** (extend existing suites in `src/lib/market/__tests__/`):

1. `actions.test.ts`: list validation with budget (missing/min/max), sponsored-buy validation (asset resolved, relayer reachable flag)
2. `parsers.test.ts` + `indexer.test.ts`: new event shapes round-trip
3. `settlement.test.ts`: post-conditions for sponsored buy (FT exact, no STX condition on buyer)
4. new `sponsor-client.test.ts` (`src/lib/market/sponsor-client.ts`): quote/sponsor/status fetch wrappers, error taxonomy, relayer-down fallback
5. aggregated-listings merge/sort/filter unit tests
6. component-level: budget quote render + buy-flow state machine (this is the render-test harness seed the WS-4 review asked for — build it here on MarketScreen's new subcomponents, which are small and fresh)

### WS-D — Deployment & ops

1. Deploy `xtrata-market-sponsored-sbtc-v1.0` + `-usdcx-v1.0` to **testnet**; run the live checklist (pattern: `docs/plans/LIVE-TEST-CHECKLIST-main-staging.md`).
2. Relayer on staging with a testnet hot wallet; end-to-end rehearsal: list → sponsored buy from an STX-empty buyer wallet → dust refund verified on explorer.
3. Mainnet deploy via the existing `scripts/mainnet-*-deploy.mjs` pattern; add entries to `market-registry.json` (`sponsored: true` flag on the entry type); `set-sponsor` to the production relayer principal.
4. Runbook (`docs/plans/SPONSOR-RELAYER-RUNBOOK.md`): hot-wallet top-up procedure, low-balance alert, stuck-job recovery, key rotation (`set-sponsor`), kill switch (relayer refuses new sponsorships; sellers can still self-refund — by design nothing is stranded).

---

## 4. Security & economics checklist (each item gets a test or a runbook entry)

- **Griefing the relayer:** attacker lists cheap item, buys it themselves repeatedly? Each sale still reimburses fee from the seller-funded budget — attacker pays. Failed sponsored txs are the only relayer loss → validate hard before signing, rate-limit per address.
- **Fee spikes:** budget quoted at list time may be insufficient later. Relayer refuses to sponsor if `budget-remaining < intended fee`; UI then offers self-paid buy, seller can cancel/re-list. Never sponsor at a loss silently.
- **Replay/duplication:** sponsor nonce serialization; relayer keeps signed-payload hash dedupe.
- **Post-conditions:** buyer FT exact-amount always; seller list tx STX condition covers budget; claim/refund txs use contract-principal STX conditions.
- **Relayer key compromise:** worst case = drain of *claimable* budgets on sold listings (capped per listing) + hot wallet balance. Keep hot wallet small; `set-sponsor` rotation documented.
- **Contract owner powers:** owner sets sponsor/caps but can never take NFTs or budgets (assert in tests).

---

## 5. Execution order & sizing

| # | Item | Size | Depends on |
|---|---|---|---|
| 1 | WS-A contracts + full clarinet suite | M | — |
| 2 | C3 wallet spike: sponsored signing returns payload (Leather/Xverse) | S | — (do in parallel, de-risks everything) |
| 3 | WS-B relayer + tests | M | WS-A |
| 4 | WS-C5 lib/indexer + C1 unified view | M | WS-A |
| 5 | C2/C3/C4 flows | M | 2, 3, 4 |
| 6 | WS-D testnet rehearsal → mainnet | S–M | all |

Definition of done: an STX-empty buyer wallet purchases a testnet inscription priced in sBTC with one signature; seller receives sBTC minus fee-bps, then receives the unused fee budget automatically; every clarinet + vitest + service test green; `npm run test` full gate passes; runbook exists.

## 6. Open questions for Jim (defaults chosen, flag if wrong)

1. Relayer hosting: alongside the existing agent-one server (`xtrata-agent-one/server/server.mjs`)? **Default: yes**, same process family, separate key.
2. Should sponsored listings also cover the *seller's* list-tx fee (fully STX-free selling via the deposit-wallet pattern)? **Default: no for v1** — seller pays their own list fee; note as v1.1 (deposit-service already gives the recipe).
3. Marketplace fee-bps on sponsored contracts: same as v1.0 markets? **Default: same.**
4. STX market: keep unsponsored (an STX buyer by definition has STX). **Default: yes.**
