# Detailed Implementation Plan

Phases are ordered by value-per-risk. Each phase is independently shippable behind a flag
and leaves the STX path untouched. File touchpoints reference real paths
(see `07-context-map.md`).

## Phase 0: Baseline, Invariants, and Asset Abstraction (Low Risk)

Goal: introduce the seams for multi-asset without changing any behavior.

1. Capture baseline: run the STX create→status→run→deliver flow in `XTRATA_MOCK=1` and
   record the exact quote/`requiredUstx` math as the regression oracle.
2. Add a payment-asset descriptor module: `xtrata-agent-one/svc/assets.mjs` (new).
   - `ASSETS` registry: `{ key, kind: 'native'|'sip010'|'fiat', decimals, contract?,
     coingeckoId?, flagEnv }`.
   - Seed with `stx` only; the registry is the single place new assets are added.
3. Thread an optional `paymentAsset` (default `'stx'`) through job state in `core.mjs`
   (`createJob`) and persist it; all existing code paths treat absent/`'stx'` as today.
4. Record the invariant checklist:
   - STX quote/`requiredUstx` identical to baseline,
   - refunds still resolve to the on-chain funder only,
   - no new read-only/poll volume on the STX path.

Acceptance:

1. STX flow byte-for-byte unchanged; `paymentAsset` defaults make it a no-op.
2. New asset registry exists and is unit-tested.

## Phase 1: Multi-Asset Quote (Low Risk, no funds movement)

Goal: quote any asset's required amount; still settle only STX.

1. Extend the oracle: `functions/lib/prices.ts` — widen `PriceAssetKey` to add `usdt` and
   fiat keys; `functions/prices/spot.ts` — add USDT to the CoinGecko/Coinbase fetch and a
   fiat FX source (CoinGecko `vs_currencies=usd,gbp`). See `04-...`.
2. Add `quoteForAsset()` in `xtrata-agent-one/svc/core.mjs` that wraps `estimate()`:
   converts `requiredUstx` → target asset using the oracle and the asset's `decimals`,
   returns `{ quoteId, asset, amount, decimals, requiredUstx, stxUsd, expiresAt }`.
3. Update `POST /api/estimate` in `server/server.mjs` to accept `?asset=` / body `asset`
   and return the asset-tagged quote (STX response shape preserved when `asset=stx`).
4. Persist issued quotes (in-memory + job-state) so funding can validate against a locked
   quote.

Acceptance:

1. `/api/estimate?asset=sbtc|usdcx|usd|gbp` returns a decimal-correct amount and an
   expiry; `asset=stx` is unchanged.
2. Quote math is unit-tested against fixed price fixtures (no live network in tests).

## Phase 2: On-Chain SIP-010 Rails — sBTC + USDCx (Medium Risk)

Goal: accept Stacks-native tokens end-to-end via Model B (token deposit + STX float).

1. Funding detection: add `tokenBalance(network, addr, assetContract, hiroKey)` in
   `core.mjs` reading `/extended/v1/address/<addr>/balances` → `fungible_tokens[<id>]`.
   Branch `statusJob()` on `paymentAsset.kind === 'sip010'`.
2. STX float / gas seeding: introduce `xtrata-agent-one/svc/treasury.mjs` (new) — see
   `04-...`. On `run` for a token-paid job, ensure the deposit/execution wallet holds
   enough STX (seed gas-dust + protocol/miner STX from the float).
3. Refund path: add `sweepTokenTo()` (SIP-010 `transfer`) alongside `sweepStxTo()`; on
   `deliver`, refund leftover **token** to the funder and reclaim seeded STX to the float.
   Preserve the funder-only invariant.
4. Wire `runJob()`/`deliverJob()` to select STX vs. token sweep by `paymentAsset`.
5. API/CLI: `POST /api/jobs` accepts `paymentAsset`; status returns token balance vs.
   required. Mirror in `deposit-service.mjs`.
6. Contracts: no new contract required for the deposit-wallet model. Reuse the SIP-010
   accept pattern from `contracts/live/xtrata-market-sbtc-v1.0.clar` /
   `xtrata-market-usdc-v1.0.clar`. (If an escrow contract is later preferred over a hot
   deposit wallet, add it here with clarinet tests — see `05-...`.)

Acceptance:

1. A user can fund a job in sBTC or USDCx; the inscription completes from the STX float;
   leftover token refunds to the funder; seeded STX returns to the float.
2. Float exposure per job is bounded and logged; failure mid-run is recoverable
   (`recover-deposit.mjs` path extended for tokens).

## Phase 3: Fiat — USD + GBP via On-Ramp (Medium/High Risk)

Goal: let a user pay fiat and receive an inscription, settling from the STX float.

1. Define a `PaymentProvider` interface in `xtrata-agent-one/svc/providers/` (new):
   `createCheckout(quote)`, `verifyWebhook(req)`, `refund(paymentId, amount)`.
2. Implement the on-ramp provider first (e.g. Transak/MoonPay): user buys STX/sBTC to the
   job's deposit address → existing funding detection (Phase 2) resumes the flow.
3. Add `POST /api/payments/webhook` in `server.mjs`: verify provider signature, map
   payment → `quoteId`/job, mark funded, trigger `run`. Idempotent on provider event id.
4. Quote handling: fiat quotes (USD/GBP) use the FX from Phase 1 and a longer TTL;
   on settlement, reconcile fiat received vs. STX fronted.
5. Refunds: implement provider `refund()`; fiat refunds go back through the provider, not
   the chain.

Acceptance:

1. Sandbox fiat payment in USD and GBP drives a mock inscription end-to-end.
2. Webhook is signature-verified, idempotent, and replay-safe; a failed inscription
   auto-refunds via the provider.

## Phase 4 (scope-gated): Cross-chain USDC / USDT (High Risk)

Only if Decision 3(b) is chosen. Goal: accept USDC/USDT on their native chains.

1. Choose mechanism: multichain payment processor (e.g. Coinbase Commerce-style) vs.
   bridge-to-Stacks. Prefer a processor to avoid running bridge/custody.
2. Add the provider behind the same `PaymentProvider` interface; settle via Model A
   (received stable → STX) feeding the float.
3. Cross-chain confirmation watcher with per-chain confirmation depth.

Acceptance:

1. A USDC or USDT payment on a supported chain results in an inscription, with
   chain-appropriate confirmations and reconciliation.

## Phase 5: Frontend Asset/Currency UX (Medium Risk)

1. `xtrata-agent-one/wizard/agent-one.js`: add an asset/currency picker; render per-asset
   deposit instructions (token contract id + the STX-dust note) or a fiat checkout
   redirect; show the quote amount, USD/GBP equivalent, and an expiry countdown.
2. `xtrata-agent-one/wizard/agent-one-wallet.js`: optional "pay from my wallet" path with
   SIP-010 `transfer` post-conditions (Leather/Xverse) for sBTC/USDCx.
3. Mirror types in `src/agent-one/agent-core.ts` / `agent-one-wallet.ts` for the bundled
   build.

Acceptance:

1. The wizard lets a user pick an asset, see a decimal-correct quote with a live expiry,
   and complete payment via deposit or fiat checkout.

## Phase 6: Docs

1. Update `XTRATA_AGENT_SKILL.md` and `docs/app-reference.md` for the asset registry,
   quote shape, and webhook.
2. Link this pack from `Refactor-Plans/README.md`.

## File Touchpoints

New files:

1. `xtrata-agent-one/svc/assets.mjs`
2. `xtrata-agent-one/svc/treasury.mjs`
3. `xtrata-agent-one/svc/providers/` (interface + on-ramp impl)
4. `xtrata-agent-one/svc/__tests__/quote-multiasset.test.mjs`
5. `xtrata-agent-one/svc/__tests__/treasury.test.mjs`

Modified files:

1. `xtrata-agent-one/svc/core.mjs` (`estimate`/`quoteForAsset`, `statusJob`,
   `tokenBalance`, `runJob`, `deliverJob`, `sweepTokenTo`)
2. `xtrata-agent-one/server/server.mjs` (`/api/estimate`, `/api/jobs`,
   `/api/payments/webhook`)
3. `xtrata-agent-one/svc/deposit-service.mjs` (asset parity with API)
4. `functions/prices/spot.ts`, `functions/lib/prices.ts` (USDT + fiat FX)
5. `xtrata-agent-one/wizard/agent-one.js`, `agent-one-wallet.js`
6. `src/agent-one/agent-core.ts`, `src/agent-one/agent-one-wallet.ts`
7. `XTRATA_AGENT_SKILL.md`, `docs/app-reference.md`, `Refactor-Plans/README.md`
