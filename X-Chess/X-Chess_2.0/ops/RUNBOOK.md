# Runbook: operating a permanent thing

Everything else in `ops/` describes getting **to** launch. This is what to do
afterwards, which has been the state since 2026-08-09.

It is organised **by lever**, not by scenario, because the levers are finite and
knowable and the scenarios are not. There are exactly five owner-gated functions
and eight settings behind them. Nothing else can be changed without a new
contract, and the inscribed page cannot be changed at all.

Updated 2026-08-13.

---

## The question this exists to answer

> A bug is found in a file that cannot be edited. Now what?

Four answers, in order of cost. Work out which one you are in before doing
anything.

| the fault is | what it costs | example |
|---|---|---|
| **1. Only display** | nothing, until the next inscription | the board drew every square the wrong colour for four days |
| **2. A number the owner sets** | one transaction | sponsorship sold at two rebates instead of forty-five |
| **3. Anything else in the app** | a new inscription: money, and a split user base | the endpoint failover never recovering |
| **4. A result already recorded** | **nothing anybody can do** | replay reading a finished game differently |

Category 4 is the one worth internalising. The log is the log. If a change to
replay would alter a result a real player already has, the answer is not to fix
it quietly — it is `tests/legacy/live-games.test.ts`, which exists to make that
impossible to do by accident.

---

## Triage, before touching anything

1. **Does it affect money?** A wrong fee, an uncovered post condition, a
   sponsorship that pays the wrong amount. Stop and read the lever table below;
   most money faults are category 2.
2. **Does it affect a result already recorded?** Replay, rules recovery, ranked
   eligibility, elo. Category 4. Do not "fix" it without reading ADR-0007.
3. **Otherwise it is display or behaviour**, category 1 or 3, and waits for the
   next inscription. Write it in `ERRATA.md` so the next person knows.

---

## The levers

Five owner-gated functions in `contracts/xchess-core-v1.clar`. Every one asserts
`is-owner` first, and `tests/clarity/core.test.ts` asserts that this is the whole
set — so a new setter cannot be added without that test failing and sending
somebody back here.

### `set-open-fee` — what a game costs to open

- **Bound** `OPEN-FEE-CEILING`, 10 STX. Refuses above it.
- **Affects** games opened afterwards. Nothing already open.
- **The board reads it live**, so a change is visible on the next load; the price
  is cached per session, not per build.

### `set-sponsorship` — the four numbers behind sponsored play

`bootstrap`, `rebate`, `rebate-count`, `margin`. Four of the eight settings.

- **Bounds** 1 STX, 0.1 STX, 200, 1 STX respectively. Refuses above any.
- **Affects nobody already funded.** A row captures its rebate and count when it
  is funded, and there is a test that halves the rebate and proves a funded row
  still pays its own.
- **`rebate` is mirrored in the wallet layer** as `REBATE_CEILING`, because every
  submission's post condition is written for it. The contract's ceiling and the
  mirrored constant are pinned to each other in Clarinet. If you ever raise the
  ceiling in the contract, that test fails — which is the point.
- **This is the lever that has already been pulled by accident.** The canary's
  exhaustion step sets the count to 2 to prove the ran-out path, and did not
  restore it, so live sponsorships bought two rebates instead of forty-five.

### `set-expiry-blocks` — how long a sponsorship reserve lasts

- **NO CEILING.** The only setter without one. It will accept any number,
  including zero, which would make every new sponsorship expire immediately.
- **Affects rows funded or topped up afterwards.** Expiry is captured absolutely
  when a row is funded, so changing this does not extend anything already live.
- **The default, 4320 blocks, is about fifteen hours post-Nakamoto** — shorter
  than a correspondence game.

> **Read this before deciding it is fine.** `settle-sponsorship` asserts only
> that the row is unsettled and that the height has passed. **Any principal may
> call it.** After that the beneficiary can never be sponsored on that game again
> by anyone, and the leftover becomes withdrawable treasury.
>
> So a **live** correspondence game's funding can be permanently killed by a
> passing stranger about half a day after it was funded — and the operator has a
> direct financial incentive to do it. `RISKS.md` R10 says "no game's reserve is
> ever stranded", which reads as reassurance against exactly this and is not.
>
> **Part of the fix is free:** one `set-expiry-blocks` transaction. Refunding the
> remainder to whoever funded it needs a new contract, and overturns a published
> decision — `SPONSORSHIP-V1.md` states that settlement moves no money.

### `withdraw` — taking the surplus

- **Bound** by `get-withdrawable`, which is balance minus reserved. It cannot
  take money owed to a game; the assertion is in the contract, not in a habit.

### `transfer-ownership` — including renouncing

- **Passing `none` renounces permanently.** `is-owner` can never be true again.
- **It also gives up the treasury forever.** A renounced contract can never
  withdraw its surplus, so it stays in the contract for good. Sponsorship
  settlement still works, because anyone may call it, so no game's reserve is
  trapped — only revenue.
- **Bias against.** This is the one irreversible lever, and there is no scenario
  below that calls for it. If it is ever done, it should have its own ADR
  written first, not after.

---

## If a new contract is ever deployed

The live inscription **hardcodes `xchess-core-v1-canary` and cannot be
repointed.** So a second contract means a second inscription, and 2988 keeps
talking to the first one regardless. Decide which is production before promoting
anything.

**If `settle-sponsorship` ever starts moving money** — the refund discussed
above — then `packages/chain/client.ts` declares `contractSends: 0n` for it
today, and `tests/wallet/outflows.test.ts` asserts that. Both must change in the
SAME commit, or every settlement aborts after the contract has already
succeeded. That is ADR-0008's exact failure, and it is the easiest way to
reproduce it.

---

## What is deliberately not being done

Recorded so that "why has nobody fixed X" has an answer.

- **Refunding an unspent sponsorship reserve.** Needs a new contract, and
  overturns `SPONSORSHIP-V1.md`. The free half — a longer expiry — does not.
- **Minimum and maximum bounds on `set-expiry-blocks`.** Same reason.
- **Extending expiry on each rebate**, so an active game cannot be settled out
  from under its players. Same reason, and the most attractive of the three.
- **A rules-preimage attester, and a batched-read view contract.** Both are
  riders for a deployment that happens for another reason, never a reason to
  deploy on their own.

---

## Errata

`ERRATA.md` is the list of what is wrong with each inscription, per id,
append-only. A permanent artefact needs one for the same reason a printed book
does: the only remedy available is telling people.
