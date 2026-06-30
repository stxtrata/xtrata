# Rollout Checklist

Execution runbook for safe delivery. Every asset ships dark, behind its own flag, after
its tests pass. STX is never gated.

## Flags & config

- `PAY_ASSET_SBTC`, `PAY_ASSET_USDCX`, `PAY_ASSET_USD`, `PAY_ASSET_GBP`,
  `PAY_ASSET_USDC`, `PAY_ASSET_USDT` — per-rail enable (env, mirrored in
  `assets.mjs` registry `flagEnv`).
- `TREASURY_FLOAT_ADDRESS`, `TREASURY_MAX_OUTSTANDING_USTX`, `TREASURY_MAX_PER_JOB_USTX`.
- `QUOTE_TTL_*`, `QUOTE_BUFFER_BPS_*` per asset class.
- `PAYMENT_PROVIDER`, provider API keys, `PAYMENT_WEBHOOK_SECRET`.
- Price staleness: `PRICE_MAX_AGE_SETTLEMENT_MS`.

## Pre-flight (before enabling any new rail)

1. Baseline regression (STX mock E2E) green; quote math matches recorded oracle.
2. Oracle returns fresh prices for the rail's asset; staleness guard verified.
3. Treasury float funded; exposure caps set; kill-switch tested.
4. Reconciliation ledger writing and queryable.
5. Secrets in place (provider keys, webhook secret) and never logged.
6. Refund path rehearsed on testnet/sandbox for the rail.

## Sequenced enablement

1. **Phase 1 (quote-only):** ship multi-asset `/api/estimate` with all rails **off** —
   quotes display, no funding accepted. Watch for quote/decimal errors in logs.
2. **sBTC + USDCx (testnet):** enable on testnet; run the manual matrix in `05-...`.
3. **sBTC + USDCx (mainnet, capped):** low `TREASURY_MAX_*`; enable for internal/allowlist
   first; monitor float and reconciliation for N days.
4. **USD + GBP (on-ramp sandbox → live):** enable provider sandbox; verify webhook idempotency;
   go live with low limits.
5. **USDC/USDT (only if Decision 3b approved):** enable processor/bridge path last.
6. **Frontend UX:** reveal the asset picker per rail as each backend rail goes live.

## Monitoring & alarms

- Per-rail: funded-but-not-run count, run failures, refund failures, average
  settlement latency.
- Treasury: outstanding float vs. cap, STX balance low-water, rebalance success.
- Pricing: oracle failover rate, stale-snapshot rejections.
- Webhooks: signature failures, replays, unmatched events.
- Reconciliation drift: `net` per job and aggregate vs. expected margin.

## Kill-switches (must be one-action)

1. Disable a single rail flag → wizard hides it, API rejects new jobs for it; in-flight
   jobs drain or refund.
2. Float low / price stale → auto-disable affected rails, keep STX live.
3. Provider outage → disable fiat rails; STX/token rails unaffected.

## Rollback triggers

- Any STX-path regression → revert the pack's flags to all-off (STX path is unchanged
  code, so this fully restores today's behavior).
- Reconciliation drift beyond threshold → freeze new token/fiat jobs, settle/refund
  outstanding, investigate before re-enable.

## Post-launch

1. Reconcile the treasury ledger against on-chain + provider statements.
2. Tune buffers/TTLs from observed slippage and failover rates.
3. Update `XTRATA_AGENT_SKILL.md` / `docs/app-reference.md` and this pack with actuals.
