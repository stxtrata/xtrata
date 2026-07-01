# Pricing, Quote, and Treasury Spec

The detail behind Phases 1–3. This is where the easy-to-get-wrong arithmetic lives.

## 1. Decimals (the 100× bug surface)

Every asset amount must be computed in its own base units. Mixing decimals silently
over/undercharges.

| Asset | Decimals | Base unit | Notes |
|-------|----------|-----------|-------|
| STX | 6 | microSTX (uSTX) | engine native; current `requiredUstx` |
| sBTC | 8 | sats | BTC-pegged; volatile vs. USD |
| USDCx | 6 | — | Stacks SIP-010 stable |
| aeUSDC (if used) | 6 | — | Axelar USDC on Stacks |
| USDT (native chain) | 6 | — | confirm per issuing chain |
| USD / GBP | 2 | cents/pence | provider handles minor units |

Rule: `amount_base = round_up( requiredUstx / 1e6 * stxUsd / assetUsd * 10^assetDecimals )`
for crypto; for fiat, `amount_minor = round_up( requiredUstx / 1e6 * stxUsd * fxUsdToCcy * 100 )`.
Always round **up** (matches the existing 0.01-STX round-up in `estimate()`), and keep the
exact `requiredUstx` on the job so settlement targets STX, not the displayed asset amount.

## 2. Quote object

```
Quote {
  quoteId:        string        // uuid; idempotency + funding lock
  asset:          'stx'|'sbtc'|'usdcx'|'aeusdc'|'usdt'|'usd'|'gbp'
  amount:         string        // in base units (string to avoid float drift)
  decimals:       number
  requiredUstx:   string        // the STX the engine will actually spend
  stxUsd:         number        // oracle snapshot used
  assetUsd:       number|null   // null for STX-passthrough
  fxUsdToCcy:     number|null   // fiat only
  bufferBps:      number        // slippage/volatility buffer applied
  expiresAt:      number        // epoch ms
}
```

Store issued quotes server-side; funding validates the received amount against the locked
quote, not a fresh price.

## 3. Buffers and expiry (per asset class)

| Class | Buffer (bps) | TTL | Reason |
|-------|--------------|-----|--------|
| STX | 0 | n/a | passthrough |
| Stable (USDCx/aeUSDC/USDT) | 25–50 | 10–15 min | tiny FX drift only |
| Volatile (sBTC) | 100–200 | 2–5 min | tracks BTC/USD |
| Fiat (USD/GBP) | 50–100 | 10–15 min | FX + provider settlement lag |

On expiry: re-quote, never settle. Under-collection (price moved against us beyond buffer)
is absorbed by the float and flagged for the rebalance job, never charged retroactively to
the user.

## 4. Oracle changes (`functions/prices/spot.ts`, `functions/lib/prices.ts`)

1. Widen `PriceAssetKey` to `'stx' | 'sbtc' | 'usdc' | 'usdt'` and add a `fiat`
   sub-snapshot `{ gbp: number, eur?: number }` (USD is the base).
2. CoinGecko call: add `tether` to `ids` and `usd,gbp` to `vs_currencies`.
   Coinbase fallback: add `USDT-USD`; derive GBP via a dedicated FX pair or a second
   source if Coinbase USD-only.
3. Keep the existing cache headers (`PUBLIC_PRICE_CACHE_CONTROL`) and the
   CoinGecko→Coinbase failover; add a hard staleness guard (reject snapshots older than N
   minutes for settlement-grade quotes).
4. Settlement-grade vs. display-grade: the wizard may show a cached price, but a quote
   that will be settled must use a fresh (≤ TTL) snapshot.

## 5. STX treasury / float (`xtrata-agent-one/svc/treasury.mjs`, new)

The float is what lets a non-STX-paying user inscribe immediately.

Responsibilities:

1. **Gas-dust seeding.** A SIP-010 `transfer` (deposit refund, or paying from a token
   wallet) still costs STX. Before a token-paid `run`/`deliver`, seed the deposit/execution
   wallet with a small STX amount (`REFUND_TX_FEE`-class) from the float.
2. **Fronting STX for execution.** For Model B, the protocol + miner STX is paid from the
   float (or from a hot execution wallet topped up by the float), not from the user's
   token.
3. **Reconciliation ledger.** Per job: `{ jobId, asset, amountReceived, stxFronted,
   stxReclaimed, tokenRefunded, net }`. This is the source of truth for accounting and the
   rebalance job.
4. **Rebalancing.** A scheduled job swaps accumulated tokens → STX (DEX: ALEX/Velar, or
   sBTC→STX) to refill the float and realise margin. Keep swaps off the per-job critical
   path.
5. **Exposure caps + kill-switch.** Max outstanding float, max per-job front, and a flag
   that disables a token rail if the float is low or a price source is stale.

Safety:

- The float keys are hot and must be isolated from the per-job ephemeral deposit keys
  (which are still wiped on deliver).
- Every float movement is logged; the funder-only refund invariant is unchanged (user
  money returns to the user; the float is the agent's own capital).

## 6. Fee/margin interaction

The agent fee (`AGENT_FEE_PCT`, default 10%) is computed on the STX base in `estimate()`.
For non-STX assets, charge the fee on the **STX-equivalent** so margin is asset-neutral,
then convert the total to the payment asset. Document any spread taken on FX/swap
separately from the protocol/agent fee so the receipt is honest.

## 7. Worked example (sBTC)

```
requiredUstx (STX engine cost, incl. fee) = 2,500,000 uSTX = 2.5 STX
stxUsd = 1.80  → USD cost = $4.50
sbtcUsd (BTC) = 65,000 → sBTC = 4.50 / 65,000 = 0.00006923 BTC
+150 bps buffer → 0.00007027 BTC → amount = 7,027 sats (8 dp)
expiresAt = now + 3 min
```

Settlement still targets 2,500,000 uSTX from the float; the 7,027 sats lands in the
treasury and is swept to STX by the rebalance job.
