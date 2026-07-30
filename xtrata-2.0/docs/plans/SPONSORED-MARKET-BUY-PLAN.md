# Sponsored Market Buy — Safe Implementation Plan

Status: **Stages 0–2 done (2026-07-30). Buying is wired; nothing advertises it yet.**

- A buyer clicking Buy on a sponsored listing now goes through the relayer and pays no network fee. Every refusal falls through to the normal self-paid purchase, so no buyer is ever left without a way to buy.
- No buyer-facing copy claims free checkout. That is Stage 3, and it is gated on the testnet rehearsal in §5 — restoring the promise before the flow has been run against a real relayer would repeat the original defect.
- Sellers still cannot list on sponsored markets: `SPONSORED_CHECKOUT_ENABLED` stays `false` until the Stage 4 deposit disclosure ships.

Stages 3–5 remain. This document is the route through them.

## 1. Why this is worth doing

A buyer holding only sBTC or USDCx cannot buy an sBTC/USDCx listing today, because settling still costs STX for the miner fee. Sponsored checkout removes that: the seller escrows a small STX deposit at list time, the buyer signs a fee-0 transaction, and the relayer pays the fee and reimburses itself from the deposit. **This is the feature's real purpose — it matters most for the non-STX markets, and only marginally for STX listings where the buyer already holds STX.**

## 2. What already exists (do not rebuild)

| Layer | State | Location |
|---|---|---|
| Contracts | **Deployed and tested.** `xtrata-market-sponsored-{stx,sbtc,usdcx}-v1-1`, Clarity 4, 12 Clarinet tests each including a µSTX-conservation fuzz | `contracts/live/`, `contracts/clarinet/tests/` |
| Relayer | **Live and allowlists exactly these three contracts for `buy`.** Signed-tx-is-truth validation, D1 job leases, traffic-driven settlement | `functions/sponsor/[[path]].ts` |
| Sponsor client | Quote / submit / status / error taxonomy with `fallbackToSelfPaid` | `src/lib/market/sponsor-client.ts` |
| Eligibility logic | `getSponsoredBuyEligibility` — reasons `not-sponsored-market`, `listing-sold`, `budget-exhausted`, `relayer-unavailable` | `src/lib/market/sponsored.ts` |
| Buy state machine | `idle → signing → submitting → sponsoring → settled\|failed`, 4s polling, telemetry | `src/screens/market/useSponsoredBuy.ts` |
| Buy UI | Sponsored button + self-paid fallback + progress labels, 9 tests | `src/screens/market/SponsoredBuySection.tsx` |
| Deposit field | Quote-driven deposit input, 3 tests | `src/screens/market/SponsorshipDepositField.tsx` |

**The gap is one seam only**: `marketBuy` in `src/home/main.js` calls `showContractCall` unconditionally. Everything above it is React-only, mounted exclusively under `/admin`. The work is porting that seam to the vanilla page — not building a feature.

## 3. Economics — state these in the UI

| Cost | Who pays |
|---|---|
| Miner fee for the buy | Relayer up front, reimbursed from the seller's escrowed deposit via `claim-fee` |
| The deposit itself | **Seller**, escrowed in STX at list time, on every sponsored market including sBTC/USDCx |
| Unused deposit | Refunded to the seller by `settle-refund` after the sale, or in full on `cancel` |
| Failed/abandoned sponsored attempt | Relayer absorbs the fee; the deposit is only drawn against a confirmed sale |
| Marketplace fee | Buyer, out of the sale price (`fee-bps`, ≤10%, currently 0) |

Contract bounds: deposit ≥ `MIN-FEE-BUDGET` 50,000 µSTX (0.05 STX); per-listing sponsor draw ≤ `claim-cap` 2 STX; seller may self-refund `REFUND-DELAY` 144 blocks (~24h) after a sale if the relayer never settles. **Worst-case seller exposure is the deposit; it is never more.**

The seller is buying liquidity: paying ~0.06 STX so a buyer with no STX can transact. The listing form must say this plainly — deposit amount, that it is refundable, and that it is charged in STX regardless of the listing currency.

## 4. Implementation stages

Each stage is independently shippable and leaves the page correct. Do not merge a later stage before the earlier ones are green.

### Stage 0 — Baseline (done)
Promise removed, sell selector gated, six regression guards in `src/home/__tests__/market-sponsored-claims.test.ts` including a premise test that fails if `marketBuy` gains a sponsored path while the copy still claims self-paid.

### Stage 1 — Extract the buy flow into a shared, testable module (done)
`src/lib/market/sponsored-buy.ts` holds every decision: which phase a signing error, a relayer refusal or a job-state reading produces, and whether a self-paid fallback is safe to offer. No DOM, no React, no direct network — wallet, client and clock are injected. `useSponsoredBuy.ts` and `SponsoredBuySection.tsx` import it, so the two surfaces cannot answer the same question differently. `submitSponsorClaimWithRetry` gained an optional `flow` so market and drops journeys stay distinguishable in telemetry.

Two decisions were sharpened during the port rather than copied:

- **Poll timeout is broadcast-aware.** The React hook polls forever. `runSponsoredBuy` stops, and only offers the self-paid fallback while the relayer demonstrably has not broadcast anything. Offering it after broadcast would invite a second miner fee on a purchase that may still confirm.
- **Wallet cancellation is recognised two ways.** React signals it by resolving null; the vanilla adapter throws a `WALLET_CANCELLED`-coded error. Both return quietly to idle.

*Tests:* `src/lib/market/__tests__/sponsored-buy.test.ts`, 21 cases — happy path, both cancellation shapes, relayer refusal with and without fallback, `ABANDONED`, an already-terminal duplicate submit, buy-txid preservation, both timeout variants, a throwing status endpoint, and no duplicate phase for an unchanged job state. Three parity cases assert the hook and the vanilla path reach the same phase from the same input.

### Stage 2 — Wire `marketBuy` to it (done)
`marketBuy(listing, options)` branches to `marketSponsoredBuy` when the market is sponsored and `forceSelfPaid` is not set. The branch returns true only when it took ownership of the purchase; every other outcome — no relayer configured, relayer down, budget exhausted, quote failure — returns false and drops through to the unchanged `showContractCall`. An already-sold listing is the one refusal that stops rather than falls through, because a self-paid retry cannot fix it.

A recoverable failure renders "Pay my own network fee instead", which re-enters `marketBuy` with `forceSelfPaid: true`. It is withheld when `fallbackToSelfPaid` is false. Relayer-supplied strings are escaped before reaching `innerHTML`.

*Tests:* `market-sponsored-claims.test.ts` grew from 6 guards to 15. The premise guard flipped: it now asserts the branch exists *and* that the self-paid path survives beside it, while the copy guards still assert nothing promises free checkout. One guard asserts the only zero-fee statement on the page sits inside the settled branch, so it reports an outcome instead of promising one.

**Not done in Stage 2, and deliberately:** there is no market-specific equivalent of `inspectSponsoredClaimTransaction`. The drops flow validates the wallet-signed transaction locally before handing it to the relayer; the market path relies on the relayer's own signed-tx-is-truth validation, which checks the contract allowlist, the function name, the arguments and the post-condition mode. That is adequate for a flow gated behind a testnet rehearsal, but it should be added before Stage 3 turns the copy back on.

### Stage 3 — Restore honest sponsored copy
**Blocked on the testnet rehearsal in §5, and on the local signed-tx inspector noted in Stage 2.** Wiring the branch is not the same as knowing it works against a real relayer, and the copy is the part that costs a buyer money when it is wrong.

Only then reintroduce buyer-facing sponsorship copy, worded to the truth: "Buyer pays no network fee — seller prepaid it." Show remaining budget and degrade to self-paid wording when the budget is exhausted or the relayer is down. Note that eligibility is resolved at click time from a live quote, so a badge rendered at list time cannot honestly reflect it — the copy needs to be either conditional on a fresh probe or phrased as a possibility.

*Tests:* update the copy guards to assert the new strings appear **only** when the sponsored branch exists; assert exhausted-budget and relayer-down listings do not advertise free checkout.

### Stage 4 — Seller-side deposit UX
Re-enable sponsored entries in the sell selector by flipping `SPONSORED_CHECKOUT_ENABLED`. Port `SponsorshipDepositField`'s behaviour: live quote, explicit "you are depositing X STX, refundable", validation against `MIN-FEE-BUDGET` and the 2 STX useful maximum. **Fix the inverted comparator** in `populateSellMarkets` (`Number(isSponsoredMarket(a)) - Number(isSponsoredMarket(b))` currently sorts standard first) so sponsored markets lead for sBTC/USDCx.

*Tests:* deposit below minimum rejected before the wallet opens; quote failure falls back to 0.06 STX with honest copy; option ordering asserted; STX post-condition equals the deposit exactly.

### Stage 5 — Post-action refresh
The market page never refreshes after a buy, cancel, or list — a sold listing keeps a live Buy button until manual reload. Sponsored settlement makes this worse because the flow is asynchronous. Re-read listings on terminal states.

*Tests:* settled sponsored buy removes the card; failed buy leaves it purchasable.

## 5. Testing strategy

**Contract (Clarinet).** Already comprehensive; re-run unchanged as the regression floor. No contract changes are planned — if any are proposed, they need a new contract version, not an edit.

**Relayer.** Existing 35 handler tests cover market buys. Add: budget exhausted mid-flight, listing sold between quote and submit, concurrent submits for one listing (exactly one sponsorship), signed-tx/body mismatch for the market path.

**Client unit.** Stage 1's suite is the core. Plus eligibility matrix across all four refusal reasons and both surfaces.

**Regression guards.** `market-sponsored-claims.test.ts` is the anti-drift mechanism: copy and capability must move together. Extend it at Stages 2, 3 and 4 rather than deleting it.

**The dev server cannot exercise the sponsored path.** `/sponsor/*` is a Cloudflare Pages function, so under `vite dev` a quote returns HTTP 404, eligibility fails `relayer-unavailable`, and every sponsored buy falls through to self-paid. Correct degradation, but it means Playwright coverage needs a stubbed relayer rather than the real one — and that a manual dev-server pass can only ever confirm the fall-through, never the sponsorship.

**There are currently no live sponsored listings on mainnet.** `get-last-listing-id` reads 0 / 2 / 0 for STX / sBTC / USDCx, and both sBTC listings return `none`. So the sponsored branch cannot be clicked through on production either until someone lists — which is itself gated on Stage 4. The testnet rehearsal is therefore the first real exercise of this code, not a formality.

**Browser (Playwright).** The market page has **no behavioural UI test at all** — the fifteen guards in `market-sponsored-claims.test.ts` are structural assertions against `main.js` source, not rendering. Stage 1 closed most of the gap by moving the decisions into a module with real unit tests, but the ~100 lines of DOM glue in `marketSponsoredBuy` are still only structurally checked. This is the same gap that let the drops history ship broken, and it remains the largest risk in this plan. Minimum before Stage 3 ships the copy: sponsored buy happy path against a stubbed relayer; relayer-down fallback. Before Stage 4: list-with-deposit; cancel returns NFT and deposit.

**Manual testnet rehearsal.** Before mainnet: list on each of the three sponsored markets, buy each from a **genuinely zero-STX wallet** (the actual claim being made), confirm `claim-fee` and `settle-refund` settle, and confirm seller self-refund works after 144 blocks with the relayer deliberately stopped.

## 6. Known defects to fix along the way

1. **Errors reported as cancellations.** `showContractCall` routes failures to `onCancel` when no `onError` is given (`src/lib/wallet/connect.ts:1895`). Only `marketBuy` passes one, so failed `marketList` / `marketCancel` / `marketReclaim` display "Listing cancelled." — a seller may believe they cancelled when the listing is still live. Still open; fix before Stage 4. (The sponsored buy path added in Stage 2 does pass `onError`, and distinguishes cancellation from failure by error code.)
2. **React `MarketScreen` cancel omits the STX post-condition** on sponsored markets under `PostConditionMode.Deny`, so `cancel` aborts where the deposit is returned. `main.js` gets this right. Fix if that surface stays.
3. **`listings.ts` swallows per-ID fetch errors** (`functions/market/listings.ts:114`) and cannot distinguish a deleted listing from a rate-limited read, then caches the short result as healthy for 30s. Sponsored listings disappearing intermittently would be indistinguishable from settlement.
4. **`xtrata-market-v1-0` is in the registry but `buy` always aborts** (contract-to-contract transfer inside `as-contract`). Blocked in the UI, still scanned on every request.
5. **`set-nft-allowed` can strand escrow.** The Clarity-4 allowances hardcode the asset name `xtrata-inscription`; allowlisting a core with a different asset name lets `list-token` succeed while `cancel` and `buy` fail. Add validation or document the constraint as owner-operational.
6. **Sponsor can claim more than it spent.** `claim-fee` is bounded only by budget and `claim-cap`, not by the actual fee paid. Bounded (≤2 STX/listing) and the relayer is well-behaved, but it is a trust assumption — record it in the threat model rather than discovering it later.

## 7. Definition of done

- A wallet holding **zero STX** completes an sBTC or USDCx purchase on mainnet.
- Every sponsorship claim in the UI is conditional on the sponsored path actually executing.
- Relayer down, budget exhausted, and listing-sold all degrade to a working self-paid purchase.
- A seller sees the exact deposit before signing, and recovers it by cancelling or after a sale.
- Contract, relayer, client and browser suites green; the regression guards updated in step with each capability.
- Defects 1–4 in §6 fixed; 5 and 6 documented and accepted.

## 8. Rollback

`SPONSORED_CHECKOUT_ENABLED = false` restores today's behaviour for sellers. Reverting Stage 2 restores self-paid buying for everyone. **No contract state is at risk in either direction** — escrowed NFTs and deposits are always recoverable by the seller through `cancel` (unsold) or `settle-refund` after 144 blocks (sold), regardless of relayer or frontend state. That escape hatch is the reason this can be rolled out incrementally.
