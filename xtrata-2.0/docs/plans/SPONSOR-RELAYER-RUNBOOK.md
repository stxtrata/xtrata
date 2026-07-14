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

4. **Activate the serverless relayer** (no server, no extra cost — it ships with the site as the Cloudflare Pages Function `functions/sponsor/`):
   ```
   npx wrangler pages secret put SPONSOR_KEY --project-name xtrata
   ```
   Paste the hot-wallet key when prompted, then redeploy the site. Canonical hex and a conventional `0x`-prefixed key are accepted; any other value returns `RELAYER_KEY_INVALID` before a claim is reserved. Probe: `curl -X POST https://<your-site>/sponsor/quote` returns a budget quote (503 RELAYER_DISABLED until the secret is set). Settlement is traffic-driven — each incoming relayer request also advances up to 4 pending settlements; if traffic ever stops, sellers can still self-refund after 144 blocks, so nothing strands. Job state lives in the site's existing D1 database. The Node relayer in `xtrata-agent-one/svc/sponsor-service.mjs` remains available for local development (`SPONSOR_KEY=... node server/server.mjs`).

## End-to-end smoke test (mainnet, small amounts)

Cast: **Seller** = a wallet holding an inscription + a little STX. **Buyer** = a second wallet holding a tiny amount of sBTC (or USDCx) and **zero STX** — that's the whole point.

1. **List**: `/market` (or workspace Market panel) with the sponsored sBTC market selected → pick an inscription, set a small price (e.g. 0.0001 sBTC), the sponsorship deposit field prefills from the relayer quote (~0.05–0.1 STX) → sign. Verify on the explorer: the contract holds the NFT and the deposit.
2. **Buy (the real test)**: from the STX-empty buyer wallet, open the listing → "Buy — no STX needed" → the wallet asks for ONE signature with fee 0. This is also the moment that verifies the wallet returns the signed sponsored tx (`txRaw`); if it doesn't, the UI says so and offers self-paid — report which wallet/version.
3. **Watch settlement** (automatic, ~2 blocks): relayer log shows SPONSORED → CONFIRMED → CLAIMED → SETTLED. On the explorer: buy tx (sponsored, fee paid by relayer) → `claim-fee` (relayer reimbursed) → `settle-refund` (dust back to seller).
4. **Verify balances**: buyer spent exactly the sBTC price and 0 STX; seller received price minus fee-bps plus the unused deposit; relayer float back to ~where it started.
5. **Escape hatch check (optional)**: list + buy again, stop the relayer before settlement, wait 144 blocks (~24h), call `settle-refund` from the seller wallet — the deposit comes back without the relayer.

## Free Claims smoke test (Xverse + Leather)

The public `/drops` page contains a persistent **Claim diagnostics** panel. Each click starts a numbered round and logs the last completed stage without exposing raw transaction hex or private wallet data. Copy the log after a failed round before retrying.

Run this matrix against one active drop. Use a fresh address with **zero STX** so a successful result proves the sponsored path was used.

| Round | Wallet | Expected wallet response | Expected diagnostic stages | Pass condition |
| --- | --- | --- | --- | --- |
| 1 | disconnected | no wallet call | `BLOCK` at connected-wallet preflight | no prompt, broadcast, or relayer request |
| 2 | Xverse | signed `transaction` from `XverseProviders.BitcoinProvider`, `broadcast:false` | `START` → `PREFLIGHT` → `PLAN` → `NONCE_REQUEST` → `ORIGIN_NONCE` → `SIGNING_INPUT` → `WALLET_REQUEST` → signed-tx checks → `RELAY_ACCEPTED` → status states | `SETTLED`, NFT owned by claimer, claimer STX unchanged |
| 3 | Leather | signed `txHex` from `stx_signTransaction({ txHex, stxAddress, network })` | same sequence as Xverse | same result as Xverse |
| 4 | either, reject prompt | cancellation callback | `CANCELLED` | no relayer job created; retry remains enabled |
| 5 | double-click/reload during an active job | existing reservation returned | `DUPLICATE` or `LISTING_BUSY`, then resume existing job | only one sponsored broadcast and one settlement chain |

The signed transaction gate must pass all of these checks before `/sponsor/submit` is called: decodable transaction, mainnet network, sponsored authorization, origin fee `0`, contract-call payload, exact drops contract, `claim` function, exact NFT/drop arguments, deny post-condition mode, exactly one NFT-send post-condition for the selected inscription, and an origin matching the connected address. Any failure is a hard block; free claims never silently fall back to a self-paid transaction.

The signing method for rounds 2 and 3 must be `stx_signTransaction`, never `stx_callContract`: the latter signs and immediately broadcasts the origin-only transaction before the relayer can attach its sponsor signature, which Xverse surfaces as `SignatureValidation`. Xverse receives `{ transaction, broadcast:false }` through `XverseProviders.BitcoinProvider.request`. Leather's sign-only API receives `{ txHex, stxAddress, network }`; its documented method does not use Xverse's `broadcast` parameter shape.

An `ORIGIN_NONCE` value of `0` is valid and expected for a fresh Stacks address that has never originated a transaction. It must proceed to signing. This is the primary zero-STX onboarding case, not an error or missing-account sentinel.

### Retry capture checklist

After deploying a change, hard-refresh `/drops`, disconnect, reconnect the wallet, and start one new claim round. Copy the embedded Claim diagnostics first; once it contains `WALLET_RESPONSE` and the signed-transaction checks, expanded browser console objects are redundant. Include `[wallet:connect]` or `[wallet]` console entries only when connection or signing stops before the embedded panel records a wallet response.

- Leather selection must log `PROVIDER_SELECTED` with `providerId: LeatherProvider` (new Connect UI) or `provider-object` (older Connect UI), plus `resolved: true` and `requestBridge: true`. It should then log `CAPABILITIES`, `REQUEST: getAddresses`, and `CONNECTED`. `resolved: false` means the extension did not inject the advertised provider; record the Leather version and browser profile.
- Xverse must log only the modern connection request (`REQUEST: wallet_connect`) and `CONNECTED`; a cascade of ``request` function is not implemented` messages means the page is still using an older cached adapter build.
- `ORIGIN_NONCE_UNAVAILABLE` / `ORIGIN_NONCE_INVALID` isolates the failure to the Hiro nonce preflight; the wallet is never opened.
- `[wallet:sponsored-sign] SIGNING_REQUEST` records `provider`, `originBinding`, and `broadcast` without printing keys or transaction bytes. Xverse normally reports `wallet-public-key`; Leather may correctly report `connected-address-hash` because its documented `getAddresses` response can omit the STX public key.
- `WALLET_SIGNING_UNSUPPORTED` or a method-not-found response means the installed wallet does not expose `stx_signTransaction`; no broadcast or relayer request occurs.
- A `SignatureValidation` popup before `WALLET_RESPONSE` normally means an old cached build is still using `stx_callContract`. Confirm that `PLAN` explicitly says `stx_signTransaction with broadcast=false` before testing again.
- Bare provider errors such as `cancel` are logged as `WALLET_ERROR`, not `CANCELLED`. Only an explicit user rejection/cancellation or standard user-rejection code is classified as `CANCELLED`.
- `RELAYER_REJECTED` records the HTTP status, safe relayer stage, server request id, and Cloudflare trace id. The server stages are `REQUEST_PREFLIGHT`, `DB_INIT`, `SETTLEMENT`, `SUBMIT_PARSE`, `SUBMIT_VALIDATE`, `SUBMIT_RATE_LIMIT`, `SPONSOR_BALANCE`, `LISTING_READ`, `FEE_ESTIMATE`, `JOB_RESERVATION`, `SPONSOR_NONCE`, `SPONSOR_SIGN`, `BROADCAST`, and `STATUS`. Use the request id to correlate the attempt with the server's `[sponsor:request]` log; server exception text is logged there but is never returned to the browser.

The relayer independently repeats the security-critical checks, reserves `contractId:dropId` so concurrent clicks cannot spend the sponsor twice, and returns the active job on `DUPLICATE`/`LISTING_BUSY`. The page then polls that job through `RECEIVED` → `SPONSORED` → `CONFIRMED` → `CLAIMING` → `CLAIMED` → `REFUNDING` → `SETTLED`, or logs `ABANDONED`/timeout with the last known transaction ids.

Useful failure labels:

- `BLOCK`: local preflight or signed transaction shape is unsafe; inspect the immediately preceding check.
- `CANCELLED` / `WALLET_ERROR`: the wallet did not return a usable signed transaction; record wallet name and version.
- `VALIDATION`: the relayer rejected a payload that passed the client; compare the logged contract, drop, and post-condition checks with server logs.
- `LISTING_BUSY` / `DUPLICATE`: expected concurrency protection; the UI should resume the returned job.
- `LOW_BALANCE` / `AT_CAPACITY` / `RELAYER_UNAVAILABLE`: relayer operations issue; no self-paid free-claim fallback occurs.
- `RELAYER_KEY_INVALID`: the Pages secret is not usable Stacks private-key hex; replace it and redeploy.
- `RELAYER_INTERNAL`: use its named stage and request id to find the precise server-side exception.
- `BROADCAST`: signing completed but the Stacks node rejected the fully sponsored transaction; the returned reason is safe to copy.
- `ABANDONED`: inspect the logged claim/reimbursement/refund tx ids and the relayer job error.

## Ongoing ops

- **Top-up**: send STX to the relayer address whenever the float runs low; the service refuses new sponsorships below `SPONSOR_LOW_BALANCE_USTX` (default 10 STX) rather than failing mid-flight.
- **Key rotation**: generate a new wallet, `set-sponsor` to the new address on both contracts, restart with the new key, sweep the old float.
- **Kill switch**: stop the relayer. Nothing strands — buyers fall back to self-paid buys, sellers can self-refund after the 144-block window.
- **Hosted deployment**: when the relayer moves off your machine, update `sponsorApi` in `src/data/market-registry.json` (currently `http://127.0.0.1:8787/api`) and rebuild.
