# Context Map

Navigation of the files this pack touches and what each is responsible for today.

## Agent One Service (the payment + inscription engine)

1. `xtrata-agent-one/svc/core.mjs`
   Single source of truth for the job lifecycle. STX-specific functions to change:
   - `estimate()` — quotes `requiredUstx` (protocol fee from on-chain
     `quote-inscription-fee` + miner reserve + receipt cost + delivery reserve + agent
     fee %). Pulls live STX/USD via `stxUsdPrice()`.
   - `createJob()` — generates the one-shot deposit wallet, writes job state.
   - `statusJob()` — reads the deposit **STX** balance via `balance()` and compares to
     `requiredUstx` to decide `funded`.
   - `balance()` — hits `/extended/v1/address/<addr>/stx` (STX only).
   - `runJob()` — inscribes from the deposit wallet (spends STX on-chain).
   - `deliverJob()` / `sweepStxTo()` — delivers the NFT, refunds leftover STX to the
     funder via `makeSTXTokenTransfer`, wipes the key.
   - `resolveFunder()` / `detectFunder()` — "who paid" detection (inbound STX sender).
   - MOCK path (`mock:true` / `XTRATA_MOCK=1`) — fakes quote/funding/txids for offline
     create→status→run→deliver.

2. `xtrata-agent-one/server/server.mjs`
   Thin HTTP API over `core.mjs`. Routes today:
   `POST /api/estimate`, `POST /api/upload`, `GET/POST /api/jobs`,
   `GET /api/jobs/:id`, `POST /api/jobs/:id/run|deliver|delete`,
   `GET /api/jobs/:id/receipt`.

3. `xtrata-agent-one/svc/deposit-service.mjs`
   CLI shell over `core.mjs` (`SVC_STEP=create|status|run|deliver`). Mirrors the API and
   must stay in sync for any new asset field.

4. `xtrata-agent-one/svc/core.mjs` constants
   `AGENT_FEE_PCT`, `AGENT_FEE_ADDRESS`, `PERTX_MINER`, `DELIVERY_RESERVE`,
   `REFUND_TX_FEE` — fee/reserve knobs the quote depends on.

## Pricing Oracle

1. `functions/prices/spot.ts`
   Cloudflare Pages function. Fetches STX, sBTC, USDC, BTC USD prices from CoinGecko with
   Coinbase fallback. The natural home for USDT + fiat (GBP) FX.

2. `functions/lib/prices.ts`
   `PriceAssetKey = 'stx' | 'sbtc' | 'usdc'`, snapshot types, and the CoinGecko/Coinbase
   parsers. Widen the key union and add stablecoin/fiat entries here.

3. `functions/lib/fee-guidance.ts`
   Existing STX fee-guidance helper; reference for where fee math lives server-side.

## Wizard Frontend

1. `xtrata-agent-one/wizard/agent-one.js`
   The Inscription Wizard UI. Calls `/api/estimate` and `/api/jobs`, renders the deposit
   address + required STX, polls status. Needs the asset/currency picker and per-asset
   deposit/checkout rendering.

2. `xtrata-agent-one/wizard/agent-one-wallet.js`
   Wallet connect/shim. Where SIP-010 `transfer` post-conditions live if users pay from
   their own Leather/Xverse wallet directly.

3. `src/agent-one/agent-core.ts`, `src/agent-one/agent-one-wallet.ts`
   Typed client-side counterparts used by the bundled app build
   (`vite.agent-one*.config.ts`).

## Token Rails / Contracts (pattern reference)

1. `contracts/live/xtrata-market-sbtc-v1.0.clar`
   SIP-010 accept pattern for sBTC: `PAYMENT-TOKEN-CONTRACT =
   SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token`, escrow via `as-contract`,
   `transfer-payment` helper.

2. `contracts/live/xtrata-market-usdc-v1.0.clar`
   Same pattern for USDCx: `PAYMENT-TOKEN-CONTRACT =
   SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx`.

3. `contracts/live/xtrata-commerce.clar`
   USDCx entitlement listings — reference for fixed-price SIP-010 settlement.

4. `contracts/clarinet/tests/xtrata-market-*-v1.0.test.ts`
   Existing SIP-010 contract tests to mirror if a deposit/escrow contract is introduced.

> Note: these are **secondary-market** contracts (buy/sell NFTs). They are reused here as
> the proven SIP-010 acceptance pattern, **not** as the inscription payment rail itself.

## Reference Docs

- `XTRATA_AGENT_SKILL.md` — fee model (`FEE-MIN`/`FEE-MAX`, `fee-unit`), STX post-condition
  usage, mint flow.
- `AGENTS.md` — agent service conventions.
- `docs/app-reference.md` — app-wide reference linked from sibling packs.
