# Second review fixes (23 Oct 2026)

An independent second review of `xtrata-world-v2`, `xtrata-screen-v1` and `xtrata-posters-v1` (and the v2 operator tools). Each
finding, what changed, and the regression test that keeps it fixed. Nothing here is deployed.

New test files: `tests/world2-review2.test.mjs` (world), `tests/screen-review2.test.mjs` (screen), `tests/hall-v2-review2.test.mjs`
(tools). `tests/world2-costs.mjs` builds the worst-case rows and measures reads (`node tests/world2-costs.mjs` prints the table).

## xtrata-world-v2

| Finding | Fix | Test |
|---|---|---|
| **H2** reads too heavy: a full `get-objects` page is 3 + 16 + 16 map reads; a stock node allows 30 per read-only call | New reads `get-object-ids(space, page)` → `(list 16 (optional uint))` (ids only) and `get-objects-8(space, page)` (the `get-objects` row shape, 8 per page); the same pair for children: `get-child-ids`, `get-children-8`. `get-objects` / `get-children` kept for compatibility (35 reads at a full page: do not use from the hall). | `H2 every read the hall makes stays within 24 reads and 90,000 read_length in the worst case`; `H2 get-object-ids and get-objects-8 page the same slots as get-objects; …` |
| **M1** moderation not sticky: any ancestor owner counted as a moderator, so a plot owner could lift the root's suspension / moderation / pause on a room in her own plot, and an intermediate owner or MOD admin could lift the root's moderation of someone else's room | Moderation levels: 3 root owner, 2 admin (MOD; PAUSE for pauses), 1 ancestor owner; never the space's own owner (unless root owner). The level is recorded in new maps `SpaceMod` (suspension, pause) and `ObjectMod` (so `get-space` / `get-object` keep their frozen shapes) and read with `get-moderation(id)`. Lifting or changing a suspension, a pause from above or a "moderated" object needs that level or higher. The owner's side may still retire a moderated object. A PAUSE admin's pause is now a pause from above (review A10). | `M1 (review A4) …`, `M1 (review A4b) …`, `M1 a MOD admin who owns the space cannot lift moderation on it; …`, `M1 (review A10) …` |
| **M2** review lane skipped by states, title and entry | In a space whose effective policy has `review` on, `add-state` / `add-states` / `set-space-title` / `set-space-entry` from anyone but the owner, the root owner or a moderator are refused with **`u320` ERR-REVIEW** (refuse, not pending: the hall's reader is unchanged). | `M2 (review A9) in a review space a delegate's states, title and entry are refused; …` |
| **L1** delegate-issued grants outlive the issuer | `caps-step` honours a grant whose `by` is not the space's owner only while the issuer's own grant row on that space is live (same epoch, unexpired) and carries GRANT. `grant` lets a delegate issue only where it holds such a row (not through an inherited grant), so the check never recurses. States stay keyed by epoch (no epoch bump). | `L1 (review A2) a grant a delegate issued lapses as soon as the issuer loses GRANT …`; `L1 a delegate issues grants only where it holds GRANT through its own grant …` |
| **L2** `buy-space` could charge more than the price (the flat fee) | `buy-space(id, expected-price, expected-version, max-total)`: refused with **`u321` ERR-MAX-TOTAL** when `max(price, max(price × bps / 10000, flat))` exceeds `max-total`. | `L2 (review D1) buy-space refuses when price plus Xtrata's share exceeds the buyer's max-total` |
| **L4** treasury could be set to the registry (fees lost) | `set-treasury` refuses `current-contract` (`u303`). Other contracts (a multisig) stay allowed. | `L4 the treasury cannot be the registry itself` |
| **L7** doors, consents, approvals checked only when set | Documented in the contract header and `HALL-V2-SCHEMA.md`: the hall re-checks at use time. | (documentation) |
| **L10** a CHILD delegate can create a space it owns | **Kept** (it is how plots are claimed), documented in the header, README and `HALL-V2-SCHEMA.md`: grant CHILD only on land, never on a system domain. Not restricted for system spaces: the plots domain is itself a root-locked system space, so any rule keyed on "system space" would break plot claims, and the root controls who holds CHILD there; moderation from above (now sticky) still applies. | `L10 (review N1, kept) …` |

Also in the contract: `caps-step` reads each space's owner from the row it already loaded (one map read less per level on every
capability check) with the same result. Existing world tests changed only where they called `buy-space` with three arguments.

**Size.** The contract grew from 68,757 to 74,464 bytes (+5.7 KB: about 3.2 KB code, 2.5 KB comments). The source counts towards
read_length on every read-only call; the heaviest hall read (`get-objects-8`, 8 worst-case rows) is 87,945 of the 90,000 budget.

### Measured read costs (worst case, simnet cost tracker)

Worst case: 24-char names, 512-char params, 4 bindings to 40-char contract names, a 64-char door path, 8 live states of 256-char
patches, 20 kinds with the longest names, a 6-deep chain of 24-char slugs, 16 children with the longest slugs and titles.

| read | reads | read_length |
|---|---|---|
| `get-version` | 4 | 74,483 |
| `resolve-path` (6 slugs) | 9 | 74,957 |
| `get-space` | 4 | 75,367 |
| `get-object-ids` (16) | 19 | 75,553 |
| `get-objects-8` | 19 | 87,945 |
| `get-kinds` (20) | 23 | 80,547 |
| `get-object-view` (8 states) | 10 | 79,606 |
| `get-timeline` (8) | 4 | 75,057 |
| `get-child-ids` (16) | 19 | 75,569 |
| `get-children-8` | 19 | 82,233 |
| `get-moderation` | 5 | 74,553 |
| `get-objects` (16, compatibility) | 35 | 101,425 |
| `get-children` (16, compatibility) | 35 | 90,001 |

## xtrata-screen-v1 (review L9)

| Finding | Fix | Test |
|---|---|---|
| A later `set-limits` (review window) could delay a pending buyer's refund | The deadline is fixed per item at purchase (`Deadlines` map, `added-at + window`); `approve` and `sweep` use it. `get-paid-status(id)` → `{ deadline, escrow, unearned }`. | `L9 the review window is fixed when a slot is bought: …` |
| A paid item hidden or retired during its run kept the buyer's money | Approve no longer releases the escrow: it stays in the contract and is earned a day at a time (a day counts once started). `settle(id)` (anyone, also while paused) pays what is earned to the fee recipient of that moment. A reviewer hiding (closes it, reason **5**) or retiring a paid item during its run pays the earned days to the fee recipient and refunds the unused days to the buyer (all of it if it never ran). Escrow total = pending + running escrow; every uSTX of it is refundable or settleable. | `L9 hiding a paid item during its run refunds the unused days …`, `L9 a run ended in the block it was approved refunds everything; …`, `L9 retiring a paid item mid-run refunds pro rata, after a partial settle, …`, `L9 a gift sent to the contract is never paid out …` |

Existing screen tests changed where they expected the payout at approval (`paid slots: approve starts the run; the escrow is earned day
by day …`, `… fee recipient is read at settlement`, the escrow invariant now counts running items, `R1` settles before checking the gift).

## xtrata-posters-v1

The 32-pin change is consistent: `Pins` is `(list 32 …)`, `set-pin` caps at `u32`, the test fills 32 and refuses the 33rd, the hall reads
`get-pins` without a bound, the error text is "pin list full". The stale `integration/contracts/xtrata-posters-v1.clar` (still 16) is
regenerated by `npm run test:integration` and committed with the other integration copies and `../live/*.clar`.

## Operator tools (ops/)

| Item | Change | Test (`tests/hall-v2-review2.test.mjs`) |
|---|---|---|
| Hall only | `planSeed(docs, { hallOnly: true })` / `seed --hall-only`: no lobby space, no lobby bays; `planLobby(manifest, docs)` / `lobby` adds it later | `seed --hall-only builds no lobby; the lobby comes later …` |
| **L8** publisher grant | STATE only (was STATE + OBJECT), `delegateExpires` / `--delegate-expires` | `the publisher grant is STATE only (review L8) and can expire …` |
| Room entry | `planRoom(m, { slug, title, entry })` / `room --entry N`: hash and size read from the core (`readEntry`), refused unless sealed; plans create, `set-space-entry`, live | `room --entry: the hash and size come from the core; …` |
| Browser call list | `ops/lib/v2-plan.mjs` (no imports): `launchCalls({ network, owner, … })`, `clarityArg`, `verifyManifest`, frozen `HALL_KINDS`; `ops/lib/v2.mjs` re-exports it, API unchanged | `the pure planner has no imports …`, `launchCalls: the whole hall-only launch …` |
| Predicted ids | `verify` / `read --verify`: reads back in plan order, stops at the first mismatch | `verify stops at the first predicted id the chain does not hold` |
| CLI | the flags above | `the command line: seed --hall-only, lobby, room --entry …` |

## Not changed (outside this brief)

- **C1** after `accept-root-owner`, spaces the old root owner created keep the old owner in their row (the new root owner cannot build there).
- **C2** an ownership change bumps the epoch, and scheduled states belong to the epoch they were added in, so moving the hall to a new
  owner drops its scheduled scenes.
- `create-space` has no `max-fee` argument: a parent owner can raise `create-fee` before a creation lands. Wallets must set STX
  post-conditions on paid calls (as the header says).

## Third review (23 Oct 2026, diff 6412706..afea1a2)

Verdict: the contracts are safe to deploy; the one High was in the hall's reader (still calling `get-objects`), fixed in the hall
work. Taken from its Low/Note list:

| Finding | Fix | Test |
|---|---|---|
| A delegate-issued grant kept a power its issuer had since lost (until the issued grant expired) | `caps-step` now ANDs a delegate-issued grant with the issuer's current own-row caps (`granter-caps`); no extra map read | `L1 (third review P2) a grant a delegate issued never carries a power its issuer has since lost` |
| Screen comments said escrow is released at approval; day counting is `ceil(ran/144)` (the approval block is free, in the buyer's favour) | Comments corrected; arithmetic unchanged; operations note: `settle` every running item before `set-fee-recipient` | (documentation) |

Documented, not changed: two ancestor owners are both moderation level 1, so one can lift the other's moderation (an owner who
wants it to stick suspends the intermediate room, or the root/admin moderates); the review lane does not cover CHILD (a CHILD delegate
may create and show a space it owns: grant CHILD only where that is wanted); a PAUSE admin who also owns an ancestor pauses at level 1.
