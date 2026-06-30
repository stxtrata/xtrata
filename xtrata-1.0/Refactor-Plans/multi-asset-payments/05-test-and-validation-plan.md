# Test and Validation Plan

The STX regression suite is the safety net: nothing here may change STX behavior.

## 1. Unit — quote & decimals (no network)

1. Fixture-based: feed fixed `{ stxUsd, assetUsd, fxUsdToCcy }` snapshots and assert the
   base-unit amount per asset (STX, sBTC, USDCx, aeUSDC, USDT, USD, GBP).
2. Decimals: assert a 6↔8 dp mix never drifts; assert round-**up** matches the existing
   0.01-STX rounding in `estimate()`.
3. Buffer/expiry: assert buffer bps applied per class; assert an expired quote is rejected
   for settlement and re-quoted.
4. Fee neutrality: assert the agent fee on the STX-equivalent yields the same margin
   across assets.
   - Location: `xtrata-agent-one/svc/__tests__/quote-multiasset.test.mjs`.

## 2. Unit — oracle parsers

1. Extend `functions/lib/__tests__` style coverage for the widened `PriceAssetKey`
   (USDT) and the fiat sub-snapshot (GBP), including CoinGecko→Coinbase failover and the
   staleness guard.

## 3. Unit — treasury/float

1. Gas-dust seeding computes the right STX and never over-seeds.
2. Reconciliation ledger balances: `amountReceived`, `stxFronted`, `stxReclaimed`,
   `tokenRefunded`, `net` are consistent for success, under-collection, and refund cases.
2. Exposure cap + kill-switch trip correctly.
   - Location: `xtrata-agent-one/svc/__tests__/treasury.test.mjs`.

## 4. Mock-mode E2E (extend `XTRATA_MOCK=1`)

Run the full create→status→run→deliver per asset offline:

1. STX — must equal the recorded baseline byte-for-byte (regression gate).
2. sBTC, USDCx — token funding detection, float-fronted run, token refund to funder,
   STX reclaimed.
3. USD, GBP — provider sandbox stub drives funded→run; provider refund on simulated
   inscription failure.
4. Funder-only invariant: assert every refund path targets the detected funder and never
   a preset address, for every asset.

## 5. Contract tests (only if an escrow contract is added)

1. If Phase 2 introduces an on-chain deposit/escrow contract instead of a hot deposit
   wallet, mirror `contracts/clarinet/tests/xtrata-market-sbtc-v1.0.test.ts` /
   `xtrata-market-usdc-v1.0.test.ts` for deposit, settle, refund, and cancel.
2. SIP-010 post-conditions: wrong token, short amount, and over-amount are all rejected.

## 6. Integration — providers (sandbox)

1. On-ramp sandbox: buy STX/sBTC to a deposit address → funding detection resumes flow.
2. Webhook: signature verification passes only for valid signatures; replay of the same
   provider event id is idempotent; out-of-order events are handled.
3. PSP sandbox (if built): checkout → webhook → run; refund path.

## 7. Manual / staging (testnet)

1. Real testnet sBTC/USDCx deposit → inscribe → refund leftover token → confirm float
   reclaim.
2. Quote expiry on a live price feed: let a sBTC quote expire, confirm re-quote.
3. Low-float kill-switch: drain test float, confirm the rail disables and STX still works.

## Acceptance criteria (pack-level)

1. STX path unchanged (baseline regression green).
2. sBTC + USDCx: fund → inscribe → deliver → token refund → float reclaim, on testnet.
3. USD + GBP: sandbox payment → inscribe → deliver; failure auto-refunds via provider.
4. Every refund, every asset, returns to the funder; decimals are exact.
5. No new aggressive polling on the STX path; new polling is per-job and bounded.
