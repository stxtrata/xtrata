# Draft replies for builds-with-xtrata

**Not posted.** Jim's to review, edit and paste. `gh` is not installed on this machine, so
I cannot post these myself.

Every factual claim below was checked against `contracts/live/xtrata-v3.2.3.clar`, which is
byte-identical to the deployed source, or read from mainnet at Stacks tip 8,702,017.

Two things to decide before posting:

1. **Issue 3** has no date in it. Add one or leave it open.
2. **Issue 1** describes `set-parent-delegate`, which was designed today and has not been
   reviewed by anyone but us. It is presented as a proposal with a question attached, not a
   commitment. Cut that section if you would rather not float it yet.

---

## Issue #1: recipient parameter on mint-single-tx

> Good news. This exists, in a candidate core, and it does a bit more than you asked for.
>
> Three new functions, each mirroring an existing one with `recipient` added as the first
> argument:
>
> | Existing | New |
> |---|---|
> | `mint-single-tx` | `mint-single-tx-to` |
> | `mint-single-tx-recursive` | `mint-single-tx-recursive-to` |
> | `mint-single-tx-with-relationships` | `mint-single-tx-with-relationships-to` |
>
> The recipient becomes **both owner and creator**. You asked for payer to differ from
> owner. You also get payer differing from creator, so your writer holds full on-chain
> authorship and the platform appears only as a `payer` field on the emitted event. That
> closes the provenance caveat Jim raised in DM back in July.
>
> The fee still leaves `tx-sender`, so your existing `<=` post-condition pattern needs no
> change.
>
> Two things worth knowing.
>
> **It is a candidate, not a deployment.** Written and tested, never deployed to mainnet or
> testnet. No date from me yet. Your use case is the reason it exists, so you will hear when
> that changes.
>
> **Parent links needed more thought than the mint did.** A parent link is gated on
> ownership, so today the children of your inscription are exactly the ones you made. We did
> not want to weaken that just to make sponsored minting work, because it would mean anyone
> could hang junk off your collection and gift it to you.
>
> So the default does not move. Instead an owner can opt in, once:
>
> ```clarity
> (set-parent-delegate (delegate principal) (allowed bool))
> ```
>
> After your author calls that naming your signer, your signer can attach children to
> inscriptions that author owns, but only children that mint back to that author. It cannot
> be used to build someone else's lineage, it is specific to one delegate rather than a
> blanket opt-in, and it is revocable at any time. It is not an admin function, so we are
> not in the middle of it.
>
> It transfers no STX, which matters for you: sponsored transactions do cover the miner fee
> on a call like this, unlike the protocol fee. So it is a one-time handshake your author
> signs and you sponsor, and they still never need a funded wallet.
>
> **Question back to you.** Is a one-time opt-in per author acceptable in your flow, or does
> even that extra signature hurt? It is a design still open to change and yours is the use
> case driving it.

---

## Issue #2: fee-schedule change notification practice

> Straight answer first: there is no announcement channel today. Polling the read-onlys is
> the intended practice, and you are right that it is not much of a practice.
>
> But there is more protection already deployed than either of us mentioned, and it is
> better than a notice period because nobody has to remember it. `assert-valid-fee-update`
> runs on every fee setter in the live core:
>
> | Guard | Value |
> |---|---|
> | Absolute ceiling per fee unit | 1 STX. The transaction reverts above it |
> | Most a fee can rise in one change | 2x |
> | Most a fee can fall in one change | to one tenth |
>
> So no single transaction can more than double a fee, and there is a hard ceiling nobody
> can cross. From today's `single-tx-fee-unit` of 10,000 microSTX it would take seven
> separate owner transactions to reach that ceiling.
>
> Current live values, read at Stacks tip 8,702,017:
>
> ```
> single-tx-fee-unit     10000
> upload-chunk-fee-unit   1000
> begin-fee-unit        100000
> upload-batch-fee-unit 100000
> seal-fee-unit         100000
> paused                 false
> ```
>
> A typical article at one chunk quotes 11,000 microSTX single-tx, which matches what you
> measured.
>
> **What is missing, and what we are doing about it.** Rate limiting is not notice. A change
> still lands in the block it is sent in, you cannot see it coming, and we cannot take back
> a mistake. Rather than promise a notice period, which is only as good as one person's
> memory, we are looking at putting it in the contract: increases proposed then confirmed
> after a wait, decreases instant, a cancel, and a read-only so you can ask the contract
> whether a change is pending and when it lands.
>
> That last part is the bit that actually answers your question, because it makes the notice
> machine-readable instead of depending on us posting.
>
> No commitment on timing yet. Worth saying it is a proposal, not a promise.

---

## Issue #3: testnet 3-2-3 instance

> Not up yet. Holiday got in the way of the deploy, so this is still owed.
>
> Nothing has changed about the plan or the address you gave us. When it lands the contract
> identifier goes here.
>
> One thing worth flagging ahead of it, since it will affect how you deploy anything of your
> own against the same lineage: these cores must be deployed with **Clarity 3**. Under
> Clarity 4 they fail to compile with `use of unresolved function 'as-contract'`. Wallets
> default to Clarity 4, so deployment has to go through the SDK with the version pinned. We
> hit this ourselves, so passing it on.

---

## Issue #4: staged path practical details

> All three answerable from the contract, so here they are.
>
> **(a) Ordering and concurrency.** `add-chunk-batch` is strictly sequential and there is no
> index parameter. Each call resumes from the `current-index` and `running-hash` held in
> `UploadState` and appends to the hash chain from there.
>
> So batches must go in order, one at a time, and you should confirm each before sending the
> next. Do not fire two in parallel. Both would build on whichever state they happened to
> read, and you would either fail the final hash check at seal or commit the wrong content.
> Max 32 chunks per batch.
>
> **(b) Resume and abandon.** Both supported, cleanly.
>
> | | |
> |---|---|
> | Resume | `begin-or-get` returns the existing session rather than erroring, so it is safe to call again. Read `get-upload-state` for `current-index` to see where you got to |
> | Abandon | `abandon-upload` marks the session immediately expired so it can be purged |
> | Expiry | Sessions expire after 4320 Stacks blocks of inactivity. `last-touched` refreshes on every batch, so it is a rolling window, not a deadline from `begin` |
> | Cleanup | `purge-expired-chunk-batch` clears the chunks of an expired session. Anyone can call it |
>
> A partially chunked inscription is therefore resumable indefinitely as long as you keep
> touching it, and abandonable on demand.
>
> **(c) Seal fee at runtime.** Yes. `quote-staged-fee(total-size, total-chunks)` returns a
> tuple including `begin-fee`, `seal-fee`, `total-fee` and `upload-batches`. Quote it the
> same way you quote single-tx.
>
> **One thing that will surprise you, so plan for it.** The staged fee is not spread evenly
> across the three steps:
>
> | Step | Charge |
> |---|---|
> | `begin-inscription` | `begin-fee-unit`, currently 100,000 |
> | `add-chunk-batch` | **free**, however many batches |
> | `seal` | everything else |
>
> And the seal fee has a cliff. It is `seal-fee-unit` plus the first batch's chunks at
> `upload-chunk-fee-unit` each, plus **every additional batch at `upload-batch-fee-unit`**,
> currently 100,000 each. At today's values:
>
> | Chunks | Batches | Staged total |
> |---|---|---|
> | 1 | 1 | 201,000 |
> | 32 | 1 | 232,000 |
> | **33** | **2** | **332,000** |
> | 100 | 4 | 532,000 |
>
> One extra chunk between rows two and three costs 100,000 microSTX, not 1,000. Every 32
> chunks crosses another cliff. Worth knowing before you price larger media.
>
> Those are live readings from `quote-staged-fee` at tip 8,702,017, not arithmetic. As
> always, quote at runtime rather than computing it yourself, and cap with `<=`.

---

## Issue #5: mint path has no idempotency

> Your read is correct, and thank you for writing it up properly. Confirming it against the
> deployed source rather than from memory:
>
> | Your claim | Verified |
> |---|---|
> | `existed` is hardcoded `false` | Yes, line 1329 |
> | `HashToId` is advisory, `map-insert` keeps the first entry | Yes, line 514 |
> | The `ERR-DUPLICATE` guard checks `UploadState` | Yes, line 1297 |
> | Identical re-mint succeeds with a new token id and a second fee | Yes |
>
> One correction, and it is narrow rather than important. You wrote that the guard "can
> never fire on `mint-single-tx`". It can. It fires when the same sender has an open
> **staged** upload in flight for that same hash, which stops someone straddling both paths
> for one piece. What it does not do, and what you are right about, is dedupe two single-tx
> mints of identical content.
>
> So the conclusion stands unchanged, and your integrator guidance is what we would tell
> anyone: write the intent record before broadcasting, reconcile by txid, use
> `get-id-by-hash` as a free pre-flight.
>
> **On the posture question.** Yes, dedup is the integrator's responsibility, and that is
> deliberate rather than an oversight. Identical bytes are not always a mistake. Two people
> can legitimately inscribe the same content, and the same person can legitimately want a
> second copy. A contract-side unique constraint would make that impossible and would push
> everyone into hash-collision workarounds.
>
> The candidate core does not change this, so it is safe to build on the assumption that it
> stays. If that ever changes it would be additive, an opt-in flag rather than a new default.
