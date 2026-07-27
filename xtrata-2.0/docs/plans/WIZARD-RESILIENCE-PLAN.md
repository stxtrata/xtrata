# Wizard resilience — failsafes and buffers, without wasting money

Written after a night of live failures. Everything here is grounded in something
that actually happened, with the evidence attached, rather than defensive coding
for its own sake. The organising principle: **never destroy work that is
recoverable, never spend money that is avoidable, and never state something as
fact that was actually a failed read.**

Status of the code this plan builds on: agent build `2026-07-25.12`.

---

## P0 — a stray inscription must not void the job — ✅ DONE 2026-07-27

Both abort paths are gone. A stray is now logged, the job carries on, and the
delivery tail sends it back to whoever sent it (`returnStrays` / `sweepStrays`).
`parentsStatus().ok` answers "can this job mint?", which a stray never changes,
and `wrong inscription received` has been removed from `FATAL_ERR`. Covered by
`src/agent-one/__tests__/stray-inscription.test.ts`, verified to fail against the
pre-fix code.

Original write-up below.

---

Live tonight, at 416/459 chunks uploaded and
~35 minutes in:

```
⚠ Inscription #2887 arrived but was not declared as a parent —
  everything will be returned to the sender automatically.
```

The declared parent was **#2878**. The stray was **#2887** — a digit
transposition, which is exactly the mistake a human makes at midnight.

Two code paths treat this as fatal:

- `agent-core.ts:1496` — `autoRun` sees `ps.unexpected` and calls
  `refundAndClose` immediately.
- `agent-core.ts:1166` — the inscribe path throws "wrong inscription received",
  which matches `FATAL_ERR` and routes straight to the refund.

So a mistyped token id destroys a nearly-complete upload and forfeits the miner
fees already spent on thirteen batches. The rule was written to protect the mint
— "the contract requires the minter to own every parent, and a mid-mint abort
burns fees" — but a stray does not threaten the mint at all. It is a safety rule
aimed at the wrong risk.

**What it should do instead:** return the stray to whoever sent it, log it
loudly, and carry on. `returnAllHeldNfts` already sends strays back to their
sender, so the return machinery exists — it is only the abort that has to go.

Keep one genuine guard: if the stray is still held at *seal* time it must not be
swept into the mint, and the deposit wallet must not be keyless while it holds
someone else's inscription. Both are already covered by the never-strand checks.

**Also worth fixing while in here:** the message says "everything will be
returned to the sender", which reads as though the *user's* deposit is being
taken away. Even once the abort is gone, the wording should distinguish "we are
sending #2887 back to whoever sent it" from anything happening to their job.

---

## P1 — nonce discipline: never queue behind a stuck transaction

Observed tonight on `SP39KB…C84KY`:

```
confirmed  nonce 0–13   begin-or-get + 13 × add-chunk-batch, 0.524661 STX each
pending    nonce 14     add-chunk-batch  0.524661 STX   21 minutes
pending    nonce 15     transfer         0.000434 STX   15 minutes
pending    nonce 16     add-chunk-batch  0.524661 STX    2 minutes
```

Stacks confirms nonces strictly in order, so 15 and 16 could never land while 14
sat. Worse, the agent *created* 15 and 16 while 14 was visibly stuck: `safeNonce`
returns `possible_next_nonce`, which counts the mempool, so each retry politely
took a new number and joined the back of a queue that could not move.

Replace-by-fee (shipped in `.12`) fixes the head of the queue. The remaining work
is not to add to it:

- Before broadcasting, if an earlier nonce from this job is still pending, do not
  issue a new one — escalate the pending one instead.
- Extend the escalation to `sendNft` and `sendStx`. The stuck `transfer` at nonce
  15 had no escalation path at all; only `send()` got one.
- Surface it: "waiting on transaction 14 of 16" is a true and calming statement.
  Silence is what makes a working job look broken.

---

## P1 — size-aware fee strategy

Measured against mainnet tonight:

| transaction | bytes | low | middle | high |
|---|---|---|---|---|
| `seal-inscription` | 227 | 0.000227 | 0.001191 (5.2×) | 0.007937 |
| `add-chunk-batch` | 524,661 | 0.524661 | 0.524661 | 0.524661 |

For small transactions the low estimate is a real saving and completely safe. For
a 512 KiB batch **all three estimates collapse onto the 1 µSTX/byte floor** — the
estimator has no opinion above the floor at that size, so "pay low" and "pay
high" are the same instruction, and the result is the least attractive
transaction in the mempool.

That is why nonce 14 sat for 21 minutes while blocks were being produced every
~15 seconds carrying **one transaction each**. There was no queue to beat; miners
fill by fee-per-cost, and a huge transaction at the minimum rate loses to
anything.

Options, cheapest first:

1. **Escalate sooner for large transactions.** `RBF_AFTER_MS` is a flat 90 s.
   Scale it down as the transaction grows — a 512 KiB batch has no realistic
   chance at the floor, so waiting 90 s to learn that is pure delay.
2. **Start large transactions slightly above the floor** (say 1.25×) rather than
   at it. Costs ~0.13 STX per batch and likely removes most stalls outright.
3. Measure before choosing: log `broadcast → confirmed` latency per fee multiple
   for a few real jobs, then set the number from data rather than instinct. The
   harness can now record this.

Whatever is chosen, keep the control that exists: a job that confirms promptly
must still pay the floor and nothing more.

---

## P2 — never destroy recoverable work

The pattern behind several failures: a recoverable condition took the most
destructive branch available.

- Strays abort the job (P0 above).
- `FATAL_ERR` routes to a full refund. It is a regex over error *messages*, which
  is fragile — "could not determine" was in there until tonight and made a Hiro
  hiccup look deterministic. Replace string-matching with explicit error types.
- A job that has uploaded 416 of 459 chunks should be very hard to kill. Consider
  a rule: once >50% of chunks are on-chain, prefer `NEEDS_RECOVERY` (key kept,
  user decides) over an automatic refund, since the uploaded chunks are already
  paid for and are still usable on resume.

---

## P2 — walking away

The tab must stay open because the agent *is* the browser: the deposit key is
generated there and stored in localStorage. Service Workers cannot carry this —
they are killed when no client is attached, and Periodic Background Sync is
Chrome-desktop-only and throttled to hours.

Two things worth doing:

1. **Do not punish a paused job.** `reapTick` expires on wall-clock `progressAt`
   with a 5-minute window mid-inscribe. Close the tab for ten minutes and the job
   can be reaped on reopen rather than resumed. Time when nothing was running
   should not count against it.
2. **Opt-in server handoff.** `xtrata-agent-one/svc/core.mjs` is a complete
   server-side implementation of the same state machine — 1,266 lines, already
   written. A per-job "finish this without me" that hands *that job's* ephemeral
   key to the relayer would let someone inscribing a 9 MB album walk away, with
   custody changing only for the job they choose and only for its lifetime.
   That is a product decision, not an engineering one; the engineering is done.

---

## P2 — say what is true

Several UI states asserted things that were not known:

- "Waiting for payment to land" while the mempool read had been throttled (fixed).
- "Now send the parent" while the job was already minting against it (fixed).
- "Network fees are high — waiting" when the agent had misread its own balance as
  zero (fixed).

The general rule worth adopting: **distinguish "no" from "we could not find
out".** Three states, not two. Where the agent is waiting on someone else — a
miner, a confirmation — say so with a number, because a progress bar that stops
moving is indistinguishable from a crash.

Also: show live spend against budget. The runway warning already computes it and
only prints when things are bad; showing it always is honest and cheap.

---

## P3 — finish the harness

`support/fake-chain.ts` now covers balances, funder detection, the parent gate,
the fee estimator, the mempool, broadcast rejection and replace-by-fee. The last
untested areas are the ones with the most state:

- **`stagedInscribe`** — resume from the on-chain chunk index, the cancel
  checkpoints, the runway ceiling.
- **The job state machine** — `AWAITING_DEPOSIT → AWAITING_PARENT → INSCRIBING →
  DELIVERING → COMPLETE`, plus every refund path. The cancel button has still
  only been proven by one screenshot.

A note on method, learned the hard way: **check each new test against the
unfixed code.** Three tests written tonight passed vacuously — asserting over an
empty array, slicing to an empty string, or comparing pages to each other rather
than to the thing they were supposed to track. A green test that cannot fail is
worse than no test, because it is counted as coverage.

---

## Suggested order

1. **P0 stray** — smallest change, prevents the loss of a nearly-complete job.
2. **P1 nonce discipline + escalation for NFT/STX sends** — completes the work
   `.12` started.
3. **P1 fee sizing** — measure first, then pick the number.
4. **P2 reaper wall-clock** — a few lines, removes the sharpest edge of the
   tab-open model.
5. **P2 error types instead of message matching**.
6. **P3 harness over the staged loop and the state machine.**

Deliberately not on this list: anything that raises what users are quoted without
evidence. Tonight's reserve change was sized from measured congestion (mean
1.53×, worst 2.89× the floor), and the next one should be too.
