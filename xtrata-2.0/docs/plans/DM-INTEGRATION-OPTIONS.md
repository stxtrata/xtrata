# DeOrganized Media (D.M.) — Xtrata Integration Options

Prepared 2026-07-29. Every claim below was checked against live mainnet or the current source; the two corrections in §1 change advice that has already been given to D.M.

## 1. Two corrections before the options

**The `xtrata-small-mint` helper is not a usable integration surface today.** D.M. were pointed at `xtrata-small-mint-v1.0`. It *is* deployed, but:
- `get-core-contract` returns **`xtrata-v2-1-0`** — the retired core, the same one the marketplace hides as "legacy". Minting through it puts D.M.'s authors on the wrong core.
- `is-paused` returns **`(ok true)`** — it is paused, so every call reverts with `ERR-PAUSED (u101)`.
- The newer `v1.1` and `v3.0.0-patched` sources exist in the repo but are **not deployed**, and both still target `xtrata-v3-2-1`, one version behind the live core.

This costs nothing to route around: **core `xtrata-v3-2-3` has a native `mint-single-tx`**, so the helper is redundant. D.M. should call the core directly. But nobody should build against the helper as described.

**The legal-consent signature is not enforced anywhere — including by Xtrata.** D.M. were told it is "an Xtrata app-layer requirement" they would need to replicate. In fact it is a *specification only*: the program is written up in the Huge-Sphinx knowledge repo, but `xtrata-2.0` has no `docs/LEGAL/` directory, no consent endpoint in `functions/`, and zero consent code in the three screens the spec names as protected (`MintScreen.tsx`, `CollectionMintLivePage.tsx`, `DeployWizardPanel.tsx`). So this is a shared gap, not a D.M. to-do. If consent matters legally, it needs building on the Xtrata side first, and D.M. can then adopt the same signed-message spec.

## 2. The constraint that shapes everything

The sponsor relayer will not sponsor a mint. `functions/sponsor/[[path]].ts` allowlists five contracts (three sponsored markets, two drops) and rejects any function other than `buy`, `claim`, or `claim-campaign`.

The deeper issue is not the allowlist, it is **where the money comes from**. Every sponsored path today draws its fee from a budget *escrowed in the contract being called* — a seller's deposit on a listing, a creator's deposit on a drop. A mint has no listing and no drop, so there is no escrow to draw against and no per-item cap. Adding sponsored minting means adding a funding model, not just an allowlist entry. That is the single biggest cost driver in the options below.

Also worth knowing: the relayer's post-condition validation asserts the transaction authorises *exactly one NFT claim*, which is shaped for claims and buys, not for a mint that creates a token.

## 3. Costs today (live figures)

For a ~50 KB file (4 chunks) via `mint-single-tx` on `xtrata-v3-2-3`:

| | |
|---|---|
| Protocol fee | **0.014 STX** |
| Same file via the staged route | 0.204 STX (~14× more) |
| Miner fee | typically 0.01–0.03 STX |
| **Author's realistic total** | **~0.03–0.05 STX** |

Single-transaction minting is capped at **32 chunks / 512 KiB**. Larger files must use the staged route and cost proportionally more.

## 4. The options

### Option A — Direct self-paid mint from D.M.'s own UI
The author's wallet calls `mint-single-tx` on the core. The author is `tx-sender`, so they are recorded as both owner and creator; D.M.'s UI never custodies anything.

| | |
|---|---|
| **Xtrata effort** | **Very low.** Publish the ABI, the chunking/hashing reference and a worked example. Perhaps a day. |
| **D.M. effort** | **Moderate.** Wallet connect, file chunking at 16 KiB, the incremental SHA-256 chain (`H₀ = 32 zero bytes`, `Hₙ₊₁ = sha256(Hₙ ‖ chunk)`), transaction build with post-conditions, confirmation polling. The hash chain is the only genuinely fiddly part and we have working reference code to hand over. Call it 1–2 weeks. |
| **Author pays** | ~0.03–0.05 STX per inscription. |
| **Ready** | **Today.** |

The honest trade: authors need a funded Stacks wallet. For a media publisher onboarding non-crypto writers, that is the friction point.

### Option B — Sponsored mint (author pays nothing)
The author signs a fee-0 transaction; someone else pays. Two ways to get there.

**B1 — Xtrata extends the relayer.**

| | |
|---|---|
| **Xtrata effort** | **High.** Needs a funding model (a prepaid D.M. balance, or a new escrow contract holding a D.M. budget), per-function argument and post-condition validation for the mint shape, per-author rate limiting and abuse caps, and monitoring. Realistically 3–5 weeks including tests, plus a contract deployment if we go the escrow route. |
| **D.M. effort** | **Low.** Sign fee-0, POST to the relayer, poll status. A few days once the endpoint exists. |
| **Ready** | No — needs design sign-off first. |

**B2 — D.M. runs their own sponsor endpoint.**

| | |
|---|---|
| **Xtrata effort** | **Low.** Hand over the relayer design, the threat model and the hardening notes. A few days of consulting. |
| **D.M. effort** | **High.** They inherit a hot wallet, single-writer nonce authority, replay protection, atomic job leases, budget caps, float monitoring and an emergency shutdown. Our own relayer needed a dedicated hardening pass to get these right. 4–6 weeks, and it is ongoing operational burden, not a one-off build. |
| **Ready** | No. |

B2 gives D.M. full control of their spend and removes a dependency on us. B1 is less work overall and keeps the security-critical component in one place. **I would recommend B1 if sponsored minting is the goal**, precisely because the hard parts are the parts we have already got wrong once and fixed.

### Option C — Pre-inscribed drops distribution
Content is inscribed up front, then claimed free by D.M.'s audience. This is the **one sponsored path that genuinely works in production today** — the drops claim flow is proven end to end.

| | |
|---|---|
| **Xtrata effort** | **Low–moderate.** Create the campaign, escrow the items, fund the budget. Existing tooling; days not weeks. |
| **D.M. effort** | **Very low.** Link to or embed the claim page. |
| **Claimer pays** | **Nothing.** Genuinely zero STX. |
| **Ready** | **Today.** |

The constraint: this is distribution, not author self-service. Someone inscribes in advance. It fits "D.M. publishes a piece and gives it away to readers", not "authors publish their own work on demand". Current drops also gate claims by BNS attestation (one per wallet, one per BNS name), which may or may not suit the audience.

### Option D — Embed the existing Xtrata Wizard
An iframe. Near-zero work either side.

| | |
|---|---|
| **Xtrata effort** | **Near zero.** |
| **D.M. effort** | **Near zero.** A day. |
| **Ready** | **Today.** |

The caveats are real, though: it is Xtrata-branded rather than D.M.-branded, and its job state (including an ephemeral wallet key) lives in the author's browser storage, so a lost device is a lost job. That browser-local model is exactly what the Collections rebuild replaces. Good for a pilot, poor as a permanent foundation.

### Option E — A D.M.-owned collection contract
D.M. get their own collection with supply policy, mint phases, pricing and payout splits — authors mint into a branded, ordered collection rather than as loose inscriptions.

| | |
|---|---|
| **Xtrata effort** | **Moderate.** Template substitution and deployment against the current live template, plus configuration. 1–2 weeks. |
| **D.M. effort** | **Moderate.** Mint UI against the collection contract — similar to Option A plus phase/allowlist handling. 2–3 weeks. |
| **Ready** | Current template: today. |

Worth flagging: the rebuilt Collections + Drops system on the `ms-rebuild` branch is a much better foundation for this (resumable batch inscription, deterministic ordering, one-action drop creation) — but it has **never been deployed to testnet**, so it is not something to commit D.M. to yet.

## 5. Recommendation

**Start with A or C depending on what D.M. actually want**, and treat B as a phase two.

- If the goal is *authors publishing their own work*, Option A is the only thing ready today, and the wallet-funding friction is the honest cost.
- If the goal is *D.M. distributing content to readers at no cost to them*, Option C already does exactly that and is proven.
- Option D is a reasonable two-week pilot to validate demand before anyone builds anything.
- Option B is where this ends up if author-pays friction proves fatal, and it is worth scoping properly rather than promising early. The funding model is the design question to settle first.

## 6. Open questions for D.M.

1. Do authors already have funded Stacks wallets, or is onboarding non-crypto users part of the job? This decides A versus B outright.
2. Who is expected to pay — the author, D.M., or the reader?
3. Self-service publishing, or curated distribution? A/B versus C.
4. Does D.M. need their own branded collection and ordering, or are loose inscriptions enough?
5. Does D.M. have a legal-consent requirement of their own? If so we should build the signed-message gate once, to a shared spec, rather than twice.
6. Typical file sizes? Under 512 KiB keeps everything in the cheap single-transaction path.
