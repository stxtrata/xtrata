# Multi-Asset & Fiat Payments Implementation Pack

Purpose: implementation-ready plan to extend Xtrata Agent One so users can pay for
inscriptions in assets other than STX — Stacks-native tokens (sBTC, USDCx), bridged
stablecoins (USDC, USDT), and fiat (USD, GBP) — without changing the on-chain
inscription engine, which remains STX-settled.

This pack is written so a new assistant can execute without rediscovery.

## The single fact that shapes the whole pack

The inscription itself is settled on Stacks. The protocol fee (`quote-inscription-fee`
returns microSTX) and the Stacks miner/network fee are **both paid in STX**. Today the
entire Agent One flow assumes STX-in / STX-out. "Accept other currencies" therefore does
not change the engine — it adds a **pricing + settlement layer** that converts any
accepted asset into the STX the engine spends. Every path below ends in STX on-chain.

## Documents

1. `01-current-state-and-gaps.md`
   Current STX-only flow (`estimate → deposit wallet → fund → run → deliver`), the
   STX-settlement constraint, and concrete gaps.

2. `02-target-architecture-and-payment-model.md`
   ADR-style decisions: settlement model, the accepted-asset matrix, and
   convert-then-inscribe vs. token-deposit + STX-float.

3. `03-implementation-plan.md`
   Phased implementation plan with file-level touchpoints and acceptance criteria.

4. `04-pricing-quote-and-treasury-spec.md`
   Multi-asset quoting, decimals, FX (GBP), quote expiry/slippage, and the STX
   treasury/float mechanics.

5. `05-test-and-validation-plan.md`
   Unit/contract/manual test plan and acceptance criteria, including mock-mode coverage.

6. `06-rollout-checklist.md`
   Execution runbook: feature flags, per-asset enablement order, kill-switches.

7. `07-context-map.md`
   Navigation map of the relevant files and their current responsibilities.

## Quick Start

1. Read `01-current-state-and-gaps.md` and `XTRATA_AGENT_SKILL.md`.
2. Read the decisions in `02-target-architecture-and-payment-model.md` and confirm the
   asset scope (esp. the "USDC/USDT" on-chain vs. cross-chain decision).
3. Implement phases in `03-implementation-plan.md`, using `04-...` for the quote/treasury
   detail.
4. Validate using `05-test-and-validation-plan.md`; ship with `06-rollout-checklist.md`.

## Guardrails (must hold after each phase)

- The STX inscription path is unchanged: `estimate → createJob → run → deliver` for STX
  behaves exactly as today; STX remains the default and the fallback.
- No funds can be delivered to anywhere except the on-chain funder of a job (the existing
  "money only returns to the wallet it came from" invariant in `core.mjs`).
- Every new asset is gated behind its own flag and ships dark until its tests pass.
- A quote always carries the asset, the decimals, and an expiry; an expired quote is
  re-priced, never settled.
