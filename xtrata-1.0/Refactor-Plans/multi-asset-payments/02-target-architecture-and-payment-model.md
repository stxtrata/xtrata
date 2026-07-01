# Target Architecture and Payment Model

This document captures the architectural decisions (ADR-style) before the phased plan.
Each decision lists the choice, the reasoning, and the consequence.

## Mental model

```
                         ┌──────────────────────────────────────────┐
   User pays in:         │         SETTLEMENT LAYER (new)            │     Engine spends:
   ─────────────         │                                          │     ────────────
   STX            ──────▶│  (passthrough)                           │
   sBTC / USDCx   ──────▶│  on-chain SIP-010 deposit  ─┐            │
   USDC / USDT    ──────▶│  bridge / processor         ├─▶ STX float├────▶  STX  ──▶ inscribe
   USD / GBP      ──────▶│  PSP / on-ramp              ─┘            │        (unchanged engine)
                         └──────────────────────────────────────────┘
```

The engine (`runJob`/`deliverJob`) is unchanged. Everything new lives in the settlement
layer and ends by ensuring the deposit/execution wallet holds enough STX.

## Decision 1 — Keep the engine STX-settled; do not tokenize the protocol fee

**Choice:** Do not change `quote-inscription-fee`, the STX post-conditions, or the
on-chain mint path to accept other tokens.
**Why:** The fee model, contracts, and audited mint flow are STX-based and live on
mainnet; re-denominating them is a protocol change with far larger blast radius than a
payment feature. Miner fees are STX regardless.
**Consequence:** Multi-asset is a pricing + settlement concern. STX stays the default and
the universal fallback.

## Decision 2 — Two settlement models, chosen per asset class

**Choice:** Support two settlement models and pick per asset:

- **Model A — Convert-then-inscribe (no float).** Take the user's asset, swap it to STX
  (DEX or processor), then run the existing flow. Simple capital model; exposed to
  swap latency and slippage at settlement time.
- **Model B — Token deposit + STX float (recommended for on-chain tokens).** Accept the
  SIP-010 token into a deposit/treasury; the agent fronts STX from a **float** to inscribe
  immediately; rebalance the float later (periodic swap of accumulated tokens → STX).
  Decouples user-payment asset from execution asset; best UX (no per-job swap on the
  critical path) at the cost of running a float.

**Why:** Model B gives instant settlement and predictable UX; Model A avoids holding a
float but puts a swap on the critical path of every job.
**Consequence:** sBTC/USDCx use Model B. Fiat uses Model B (PSP confirms → float
inscribes). Cross-chain USDC/USDT, if in scope, uses Model A or a processor.

## Decision 3 — Accepted-asset matrix and scope

| Asset | Where it lives | Rail | Settlement | Phase |
|-------|----------------|------|------------|-------|
| **STX** | Stacks native | existing deposit wallet | passthrough | shipped |
| **sBTC** | Stacks SIP-010 (`SM3VDXK3…sbtc-token`) | SIP-010 deposit | Model B (float) | 2 |
| **USDCx** | Stacks SIP-010 (`SP120SBRB…usdcx`) | SIP-010 deposit | Model B (float) | 2 |
| **USDC (native)** | Ethereum/Solana/Tron, or Stacks aeUSDC | bridge / processor / aeUSDC SIP-010 | Model A or processor | 4 (scope-gated) |
| **USDT** | Ethereum/Tron/etc. (≈no Stacks issuance) | bridge / processor | Model A or processor | 4 (scope-gated) |
| **USD** | fiat | PSP or on-ramp | Model B (float) | 3 |
| **GBP** | fiat | PSP or on-ramp | Model B (float) | 3 |

**Open decision (must be made before Phase 4):** does "USDC/USDT" mean
(a) Stacks-native dollar tokens only — i.e. USDCx + aeUSDC, a cheap extra SIP-010 rail —
or (b) USDC/USDT on their native chains, which requires a bridge or a multichain payment
processor plus custody, cross-chain confirmation watching, and bridge-fee handling? The
plan treats (a) as part of Phase 2 token rails and (b) as a separate, larger Phase 4.

## Decision 4 — Fiat goes through a provider; choose on-ramp vs. PSP

**Choice:** Integrate one fiat provider behind a common `PaymentProvider` interface, and
default to a **crypto on-ramp** first.

- **On-ramp (MoonPay / Transak / Banxa):** user buys STX (or sBTC) with USD/GBP, delivered
  straight to the deposit wallet → the existing flow resumes untouched. KYC and card/fraud
  risk sit with the ramp. Least new backend.
- **Card/bank PSP (Stripe / Checkout.com):** user pays us fiat; a signed webhook confirms;
  we inscribe from the STX float. More control and margin, but we carry FX, float,
  refunds, chargebacks, KYC/AML, and money-transmission licensing.

**Why:** the on-ramp gets fiat users live with minimal new surface and no custody of
fiat; the PSP is a later upgrade when margin/control justify the compliance load.
**Consequence:** Phase 3 ships the on-ramp path; the PSP path is specced behind the same
interface but deferred.

## Decision 5 — Quotes are asset-tagged, decimal-correct, and expiring

**Choice:** A quote becomes `{ quoteId, asset, amount, decimals, stxEquivalent,
expiresAt }`. Volatile assets (sBTC) carry a slippage buffer and short TTL; stables and
fiat carry a longer TTL.
**Why:** a price in sBTC moves with BTC between quote and funding; settling a stale quote
under-collects. Decimals differ per token (see `04-...`) and a slip mis-charges by 100×.
**Consequence:** funding is validated against a *locked* quote; expired quotes re-price.

## Decision 6 — Preserve the "funds only return to the funder" invariant per asset

**Choice:** Extend `resolveFunder`/refund so every asset refunds to the address/account
that paid, in the asset that was paid (tokens refund tokens; fiat refunds via the
provider).
**Why:** it is the core safety property of the current design.
**Consequence:** refund logic is per-asset and decimal-correct; fiat refunds are provider
API calls, not chain transfers.

## Non-goals (this pack)

- Re-denominating the protocol fee or changing the mint contracts.
- Running our own bridge or custody stack (we integrate, not build).
- Auctions/royalties/secondary-market changes (covered by other packs).
