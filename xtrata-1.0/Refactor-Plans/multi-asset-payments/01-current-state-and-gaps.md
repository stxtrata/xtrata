# Current State and Gaps

## Current payment flow (STX-only)

Agent One inscribes on behalf of a user through a deposit-wallet escrow. The lifecycle
lives in `xtrata-agent-one/svc/core.mjs` and is exposed by `server/server.mjs` (HTTP) and
`deposit-service.mjs` (CLI):

1. **Estimate** — `POST /api/estimate` → `estimate()` computes `requiredUstx` =
   protocol fee (on-chain `quote-inscription-fee`, in microSTX) + miner reserve +
   receipt protocol/miner cost + `DELIVERY_RESERVE` + margin, then adds the agent fee
   (`AGENT_FEE_PCT`, default 10%) and rounds **up** to the nearest 0.01 STX. It also
   attaches `stxUsd` (live STX/USD) so the UI can show a dollar figure.

2. **Create** — `POST /api/jobs` → `createJob()` generates a fresh BIP-39 one-shot
   **deposit wallet**, stores the job with `status: AWAITING_DEPOSIT`, and returns the
   deposit address + `requiredUstx`.

3. **Fund** — the user sends *exactly* `requiredUstx` microSTX to the deposit address.
   `statusJob()` reads the address's **STX** balance via `balance()`
   (`/extended/v1/address/<addr>/stx`) and flips `funded` when it covers `requiredUstx`.

4. **Run** — `POST /api/jobs/:id/run` → `runJob()` inscribes from the deposit wallet,
   spending STX for both the protocol fee and the Stacks miner fees.

5. **Deliver** — `POST /api/jobs/:id/deliver` → `deliverJob()` transfers the NFT to the
   user, sweeps the leftover STX back to the on-chain funder (`sweepStxTo()` /
   `makeSTXTokenTransfer`), and **wipes the ephemeral key**.

## The constraint that defines the problem

The engine is STX-denominated end to end:

- The **protocol fee** is quoted and enforced in microSTX. `XTRATA_AGENT_SKILL.md`
  records `FEE-MIN u1000` (0.001 STX), `FEE-MAX u1000000` (1.0 STX), a default
  `fee-unit` of 100,000 microSTX, and STX post-conditions
  (`makeStandardSTXPostCondition`).
- The **miner/network fee** for every begin/batch/seal/transfer/refund tx is paid in STX.
- The **deposit, funding check, and refund** are all STX (`balance()` reads the STX
  endpoint; refunds use `makeSTXTokenTransfer`).

**Implication:** no matter what a user pays with, the deposit wallet must end up holding
STX to execute. Accepting another asset means converting it — by swap, by treasury float,
or by an off-chain processor — into the STX the engine spends. This is not an engine
rewrite; it is a settlement layer in front of an unchanged engine.

## What already exists in our favour

- **A price oracle with multi-asset support.** `functions/prices/spot.ts` +
  `functions/lib/prices.ts` already fetch STX, sBTC, and USDC USD prices (CoinGecko,
  Coinbase fallback). `PriceAssetKey` is `'stx' | 'sbtc' | 'usdc'`.
- **A proven SIP-010 acceptance pattern, in our own contracts.**
  `contracts/live/xtrata-market-sbtc-v1.0.clar` and `xtrata-market-usdc-v1.0.clar`
  already take payment in sBTC (`SM3VDXK3…sbtc-token`) and USDCx
  (`SP120SBRB…usdcx`) via `contract-call? <token> transfer …` with `as-contract`
  escrow. These are market contracts, but the token-accept mechanics transfer directly.
- **A mock mode** (`XTRATA_MOCK=1`) that fakes the full create→deliver flow offline —
  the test harness we extend per asset.
- **A "funds only return to the funder" invariant** already enforced in `core.mjs`
  (`resolveFunder`/`detectFunder`), which we must preserve for every new asset.

## Gaps (what is missing for multi-asset / fiat)

1. **Quote is single-asset.** `estimate()` returns only `requiredUstx`. There is no
   per-asset amount, no decimals handling, no quote id, and no expiry.
2. **Funding detection is STX-only.** `statusJob()`/`balance()` watch the native STX
   balance; there is no SIP-010 fungible-token balance check
   (`/extended/v1/address/<addr>/balances` → `fungible_tokens`).
3. **Refund/sweep is STX-only.** `sweepStxTo()` uses `makeSTXTokenTransfer`; no SIP-010
   `transfer` refund path, and no handling of the STX gas-dust a token refund needs.
4. **No STX treasury/float.** There is no component that fronts STX for a non-STX-paying
   user and reconciles it against the token received.
5. **No off-chain settlement.** No PSP/on-ramp integration, no payment webhook endpoint,
   no fiat→crypto reconciliation, no KYC/refund/chargeback handling.
6. **"USDC/USDT" scope is undefined.** The USDC/USDT most users hold are on Ethereum /
   Solana / Tron, not Stacks. On Stacks the dollar tokens are USDCx (supported in our
   contracts) and Axelar aeUSDC; native USDT is effectively absent. On-chain vs.
   cross-chain is an unmade decision (see `02-...`).
7. **No FX.** GBP/USD pricing requires a fiat FX source; the oracle is USD-only.
8. **Frontend has no asset/currency selector** and renders STX-only deposit instructions
   (`wizard/agent-one.js`).
9. **No per-asset accounting/reconciliation** for treasury, fees, and tax.
