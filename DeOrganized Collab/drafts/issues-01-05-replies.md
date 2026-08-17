Copy each block below into the matching issue on
github.com/DeOrganized/builds-with-xtrata. Nothing here is posted.

#1 and #2 have been posted and are archived in ../posted/. They are no longer
in this file, so anything here is genuinely still to send.

One edit needed before posting: **issue #3 has a `[DATE]` placeholder.**

═══════════════════════════════════════════════════════════════════════
ISSUE #3 — testnet 3-2-3 instance


Not up yet. Holiday got in the way of the deploy, so this is still owed. Targeting [DATE].

Nothing has changed about the plan or the address you gave us. When it lands the contract identifier goes here.

One thing worth flagging ahead of it, since it will affect how you deploy anything of your own against the same lineage. These cores must be deployed with **Clarity 3**. Under Clarity 4 they fail to compile with `use of unresolved function 'as-contract'`. Wallets default to Clarity 4, so deployment has to go through the SDK with the version pinned. We hit this ourselves, so passing it on.

═══════════════════════════════════════════════════════════════════════
ISSUE #4 — staged path practical details


All three answerable from the contract, so here they are.

**(a) Ordering and concurrency.** `add-chunk-batch` is strictly sequential and there is no index parameter. Each call resumes from the `current-index` and `running-hash` held in `UploadState` and appends to the hash chain from there.

So batches must go in order, one at a time, and you should confirm each before sending the next. Do not fire two in parallel. Both would build on whichever state they happened to read, and you would either fail the final hash check at seal or commit the wrong content. Max 32 chunks per batch.

**(b) Resume and abandon.** Both supported, cleanly.

| | |
|---|---|
| Resume | `begin-or-get` returns the existing session rather than erroring, so it is safe to call again. Read `get-upload-state` for `current-index` to see where you got to |
| Abandon | `abandon-upload` marks the session immediately expired so it can be purged |
| Expiry | Inactivity. 4320 blocks, but read the note below on which chain's blocks those are, because the answer changed. `last-touched` refreshes on every batch, so it is a rolling window, not a deadline from `begin` |
| Cleanup | `purge-expired-chunk-batch` clears the chunks of an expired session. Anyone can call it |

A partially chunked inscription is resumable indefinitely as long as you keep touching it, and abandonable on demand.

**Your question prompted us to actually measure this, and we found a bug. Thank you.**

On the live v3.2.3 the constant is `UPLOAD-EXPIRY-BLOCKS u4320`, and the comment beside it reads "~30 days at 10-min block cadence". That was true when written, when one Stacks block meant one Bitcoin block. But the check uses `stacks-block-height`, which post-Nakamoto advances every 12 seconds or so. Measured on mainnet across the last 39,000 blocks: mean 12.55 seconds per block, and a 4320-block window ranged from 13.2 to 18.4 hours.

So on the contract you are integrating against today, that window is **about 15 hours, not 30 days**. Our own comment was wrong by roughly fifty times. Plan around half a day.

**Fixed in the candidate.** Expiry there is measured in `burn-block-height`, so 4320 means 4320 Bitcoin blocks and the window means 30 days again regardless of what Stacks block production does next. `last-touched` becomes a Bitcoin height rather than a Stacks one, which matters if you compute deadlines off-chain.

**One more thing worth knowing, unchanged either way.** An expired session cannot be resumed. Both `add-chunk-batch` and `begin-or-get` reject it with `ERR-EXPIRED`. To retry you must purge it first, and `purge-expired-chunk-batch` walks indexes 0 to `total-chunks - 1` in batches of 50. For a 2048 chunk upload that is 41 transactions before you can start again, and then you re-pay the begin fee and re-upload every chunk.

So the number to design around is not total upload time, which can be as long as you like because the window refreshes on every batch. It is the largest gap you can tolerate between batches. On v3.2.3 today, an uploader that stalls overnight loses the session.

**(c) Seal fee at runtime.** Yes. `quote-staged-fee(total-size, total-chunks)` returns a tuple including `begin-fee`, `seal-fee`, `total-fee` and `upload-batches`. Quote it the same way you quote single-tx.

**One thing that will surprise you, so plan for it.** The staged fee is not spread across the three steps the way you would assume:

| Step | Charge |
|---|---|
| `begin-inscription` | `begin-fee-unit`, currently 100,000 |
| `add-chunk-batch` | free, however many batches |
| `seal` | everything else |

And the seal fee has a cliff. It is `seal-fee-unit`, plus the first batch's chunks at `upload-chunk-fee-unit` each, plus **every additional batch at `upload-batch-fee-unit`**, currently 100,000 each. At today's values:

| Chunks | Batches | Staged total |
|---|---|---|
| 1 | 1 | 201,000 |
| 32 | 1 | 232,000 |
| **33** | **2** | **332,000** |
| 100 | 4 | 532,000 |

One extra chunk between rows two and three costs 100,000 microSTX, not 1,000. Every 32 chunks crosses another cliff. Worth knowing before you price larger media.

Those are live `quote-staged-fee` readings at tip 8,702,017, not arithmetic. As always, quote at runtime rather than computing it yourself, and cap with `<=`.

═══════════════════════════════════════════════════════════════════════
ISSUE #5 — mint path has no idempotency


Your read is correct, and thank you for writing it up properly. Confirming against the deployed source rather than from memory:

| Your claim | Verified |
|---|---|
| `existed` is hardcoded `false` | Yes, line 1329 |
| `HashToId` is advisory, `map-insert` keeps the first entry | Yes, line 514 |
| The `ERR-DUPLICATE` guard checks `UploadState` | Yes, line 1297 |
| Identical re-mint succeeds with a new token id and a second fee | Yes |

Those line numbers are against the source Hiro returns for the deployed contract, so they should match whatever you are reading. Worth checking that in general, by the way. There are several copies of this contract in circulation and they are not all the same file. We caught ourselves citing a mirror that was about 95 lines offset. Pull the deployed source and diff before trusting a line number.

One correction, narrow rather than important. You wrote that the guard "can never fire on `mint-single-tx`". It can. It fires when the same sender has an open **staged** upload in flight for that same hash, which stops someone straddling both paths for one piece. What it does not do, and what you are right about, is dedupe two single-tx mints of identical content.

So your conclusion stands unchanged, and your integrator guidance is what we would tell anyone. Write the intent record before broadcasting, reconcile by txid, use `get-id-by-hash` as a free pre-flight.

**We went back and proved all of this in simnet rather than reasoning about it, and turned up three things worth having.**

First, the exact shape of that guard. It fires on `{tx-sender, expected-hash}` while a staged session is open. It is **not** a global content lock. Another principal can mint the same hash through the single-tx path while your staged session is still in flight, and it succeeds.

Second, `get-id-by-hash` always names the **first** token minted for a hash, never the most recent. Good as a pre-flight, but do not treat it as a current-state lookup after duplicates exist.

Third, and this one is useful rather than cautionary: `begin-or-get` is genuinely idempotent on the fee. Re-calling it for a session you already opened resumes it and charges **nothing**. So a crashed uploader can safely call it again on restart without paying the begin fee twice. Worth building into your retry logic.

One more, since it may affect how you think about cost. Chunks are keyed `{final-hash, creator, index}` and written with `map-set`. So when the same creator re-inscribes identical bytes, the second mint rewrites the same rows rather than storing a second copy. You pay a second protocol fee, but you are not paying to store the same bytes twice.

On the posture question. Yes, dedup is the integrator's responsibility, and that is deliberate rather than an oversight. Identical bytes are not always a mistake. Two people can legitimately inscribe the same content, and the same person can legitimately want a second copy. A contract-side unique constraint would make that impossible and would push everyone into hash-collision workarounds.

The candidate core does not change this, so it is safe to build on the assumption that it stays. If it ever changed it would be additive, an opt-in flag rather than a new default.
