# Sponsor Relayer Runbook

The relayer pays buyers' mining fees on the sponsored markets and reimburses itself from seller fee budgets. It holds a **hot wallet with a small STX float only** — treat it like a prepaid card, never a treasury.

## One-time setup

1. **Generate the hot wallet** (fresh key, never a personal seed):
   ```
   node scripts/make-sponsor-wallet.mjs
   ```
   Save the printed `SPONSOR_KEY` somewhere safe (password manager / server env). Never commit it.

2. **Fund it**: send ~20 STX to the printed address from any wallet. Economics: each sponsorship fronts one mining fee (~0.003–0.03 STX) and is reimbursed after the buy confirms, so 20 STX covers hundreds of concurrent sales; the float only shrinks by fees on *failed* buys.

3. **Authorise it on-chain**: open the deploy console (`/web/deploy-console.html`), connect the admin wallet, "Re-run preflight" on each sponsored market card, paste the relayer address into the post-deploy step, and sign `set-sponsor` — once per contract. Until this step the sponsor defaults to the deployer, and the relayer's `claim-fee` calls would fail.

4. **Start the relayer** (from `xtrata-agent-one/`):
   ```
   SPONSOR_KEY=<hex key> \
   SPONSOR_MARKETS=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-sbtc-v1-0,SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-usdcx-v1-0 \
   node server/server.mjs
   ```
   Startup log should show `sponsor relayer enabled: <address> markets=2`. Probe: `curl -X POST http://127.0.0.1:8787/api/sponsor/quote` returns a budget quote.

## End-to-end smoke test (mainnet, small amounts)

Cast: **Seller** = a wallet holding an inscription + a little STX. **Buyer** = a second wallet holding a tiny amount of sBTC (or USDCx) and **zero STX** — that's the whole point.

1. **List**: `/market` (or workspace Market panel) with the sponsored sBTC market selected → pick an inscription, set a small price (e.g. 0.0001 sBTC), the sponsorship deposit field prefills from the relayer quote (~0.05–0.1 STX) → sign. Verify on the explorer: the contract holds the NFT and the deposit.
2. **Buy (the real test)**: from the STX-empty buyer wallet, open the listing → "Buy — no STX needed" → the wallet asks for ONE signature with fee 0. This is also the moment that verifies the wallet returns the signed sponsored tx (`txRaw`); if it doesn't, the UI says so and offers self-paid — report which wallet/version.
3. **Watch settlement** (automatic, ~2 blocks): relayer log shows SPONSORED → CONFIRMED → CLAIMED → SETTLED. On the explorer: buy tx (sponsored, fee paid by relayer) → `claim-fee` (relayer reimbursed) → `settle-refund` (dust back to seller).
4. **Verify balances**: buyer spent exactly the sBTC price and 0 STX; seller received price minus fee-bps plus the unused deposit; relayer float back to ~where it started.
5. **Escape hatch check (optional)**: list + buy again, stop the relayer before settlement, wait 144 blocks (~24h), call `settle-refund` from the seller wallet — the deposit comes back without the relayer.

## Ongoing ops

- **Top-up**: send STX to the relayer address whenever the float runs low; the service refuses new sponsorships below `SPONSOR_LOW_BALANCE_USTX` (default 10 STX) rather than failing mid-flight.
- **Key rotation**: generate a new wallet, `set-sponsor` to the new address on both contracts, restart with the new key, sweep the old float.
- **Kill switch**: stop the relayer. Nothing strands — buyers fall back to self-paid buys, sellers can self-refund after the 144-block window.
- **Hosted deployment**: when the relayer moves off your machine, update `sponsorApi` in `src/data/market-registry.json` (currently `http://127.0.0.1:8787/api`) and rebuild.
