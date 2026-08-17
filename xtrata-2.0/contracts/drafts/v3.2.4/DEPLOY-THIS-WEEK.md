# Getting v3.2.4 in place by Friday 21 August 2026

Decision taken: the new core ships this week. This is the plan that does that
without the irreversible mistake.

Live state read 17 August 2026 from `xtrata-v3-2-3`:

| | |
|---|---|
| `get-next-token-id` | **2992** |
| `get-minted-count` | 2887 |
| `is-paused` | false |
| `set-allowed-caller` calls, lifetime | 0 (allow-list empty) |

---

## 1. The distinction that makes this week possible

**Deploying the core is not the same as cutting over to it.** They have completely
different risk profiles and only one of them fits in a week.

A freshly deployed core is **paused by default** (`(define-data-var paused bool true)`)
and its allow-list starts empty. Nothing can mint, so `next-id` stays at `u0`, so
`set-next-id` stays available. That state is stable indefinitely and costs one
transaction to leave.

So the contract can be on mainnet, verified, and publicly readable by Wednesday, with
every irreversible decision still ahead of you.

---

## 2. Three end states. Pick one before Wednesday.

### A. Deployed and idle

Deployed, paused, `next-id` untouched, fee units set. The contract exists, its interface
is public, its source is verifiable.

- **Risk:** effectively none. Nothing is irreversible.
- **Time:** comfortably by Wednesday.
- **What it does not do:** DeOrganized cannot use `mint-single-tx-to`, because a paused
  core mints for nobody.

### B. Deployed and live on a reserved id band  ← recommended

Set `next-id` to a number comfortably above where `v3-2-3` will ever reach, allow-list
DeOrganized, unpause. Both cores mint, in non-overlapping ranges. `v3-2-3` keeps serving
existing users and the three Forever Twins helpers. `v3-2-4` serves DeOrganized and new
work.

**Sizing it.** `v3-2-3` is at 2,992. The largest thing that could still land there is
finishing LEO Cats on the existing helper, 9,899 tokens, plus Miami Degens at 419.
**Set `next-id` to 50,000.** That leaves 47,008 ids for `v3-2-3`, roughly five times the
worst realistic case. The unused range is a permanent cosmetic gap in the sequence and
nothing more.

- **Risk:** `set-next-id` is one-shot, so the number is permanent. But see below, this is
  the easier decision, not the harder one.
- **Time:** by Friday if the prerequisites in section 3 are done first.
- **What it does:** DeOrganized gets the recipient split this week.

### C. Full cutover

Pause `v3-2-3`, hand the counter over exactly, migrate dependency roots, pivot the app,
deploy the Forever Twins successors, publish the do-not-migrate notice.

- **Not achievable safely this week.** The app pivot alone is three to five days, and
  `src/home/main.js` would keep defaulting to the old core until it is done. Dependency
  root migration still needs the arcade leaf ownership question answered.
- This is the thing to schedule after grant milestone 1.

---

## 3. I have changed my assessment of the reserved band

Earlier I argued against reserving an id band, on the grounds that it leaves two cores
minting and depends on a one-shot guess. Given the decision to ship this week, that
judgement inverts, and the reason is worth stating plainly.

**Option C's exact handover requires getting a one-shot irreversible number exactly
right, under time pressure, immediately after pausing production.** You pause, wait for
settling, read twice, and commit. Any mempool straggler makes the number stale and there
is no second attempt.

**Option B requires picking a number comfortably larger than a known value.** 2,992 today,
so 50,000 has an enormous margin. There is no timing pressure and no race, because
`v3-2-3` is never paused during the operation.

Same irreversible call, vastly easier to get right. The cost is a permanent gap in the
id sequence, which is cosmetic, and two live cores to reason about until the full
cutover, which is a documentation problem rather than a correctness one.

When the full cutover eventually happens, `v3-2-3` simply gets paused and `v3-2-4`
carries on from wherever it has reached. No further continuity call is needed or possible.

---

## 4. Prerequisites. None of these are optional.

**1. `mint-single-tx-to` has zero runnable test coverage.** This is the headline feature,
it is exactly what DeOrganized is waiting for, and a deployed Clarity contract cannot be
patched. The payer/recipient invariant is asserted only in
`contracts/drafts/v3.2.4/xtrata-v3.2.4-sponsored.test.mjs`, which is not in the runnable
tree. Port it into `contracts/clarinet/tests/`, repoint `initSimnet` at
`./v3.2.4/Clarinet.toml`, and wire it into `npm run test:v3.2.4`. Hours, not days.

**2. Resolve the two candidate files.** `contracts/drafts/xtrata-v3.2.4-draft.clar` is
1,663 lines and missing five functions including `mint-single-tx-to`.
`contracts/drafts/v3.2.4/xtrata-v3.2.4-candidate.clar` is 1,811 lines and is the
deployable one. Delete the draft or clearly mark it dead. Also fix the trait guard in
`draft.core.test.mjs:30-31`, which reads the same file into both `cl` and `live` and
therefore cannot fail. A leaked local trait would deploy a core that does not implement
the mainnet SIP-009 trait.

**3. Smoke the mint flows on testnet first.** Do not use the four-deploy chain for this.
Deploy a variant with the `migrate-from-*` functions stripped: it has no same-deployer
dependencies, so it deploys standalone, and it exercises exactly what needs testing.
Test a plain `mint-single-tx`, a `mint-single-tx-to` with a second wallet as recipient,
and confirm the recipient is recorded as both owner and creator.

---

## 5. The week

**Monday 17** Port the sponsored test suite into the runnable tree. Kill or mark the
stale draft. Fix the vacuous trait guard. Decide A or B.

**Tuesday 18** Testnet. Deploy `sip009-nft-trait`, point the `[TESTNET]` lines at it,
deploy the migrate-stripped core, set fee units, unpause, run all three mint flows plus
the staged path. This is also the T-phase rehearsal the cutover needs later, so it is not
throwaway work.

**Wednesday 19** Mainnet. Deploy the full candidate, Clarity 3, from the SDK, never a
wallet. Verify the deployed interface before touching anything else. Set the five fee
units, in several calls each where the doubling bound requires it. **Stop here if
option A.**

```bash
node scripts/mainnet-deploy-contract.mjs xtrata-v3-2-4          # dry run first
node scripts/mainnet-deploy-contract.mjs xtrata-v3-2-4 --broadcast
```

The script will print `Requires first: .xtrata-v1-1-1, .xtrata-v2-1-0, .xtrata-v3-2-3`.
On mainnet all three exist at the deployer, so that is a notice rather than a problem.

**Thursday 20** If option B: `set-next-id 50000`, allow-list DeOrganized's contract,
unpause, and run one `mint-single-tx-to` in anger with a recipient who holds no STX.

**Friday 21** DeOrganized smoke test from their side. Write up what shipped. Watch for
post-condition aborts.

---

## 6. What this costs the grant, and the one cheap insurance

Week 1 of the grant goes to the core. Milestone 1 then has weeks 2 to 4, which is
24 August to 13 September, for the template, the harvester and the Bitcoin Pepes replay
proof. The harvester is partly built already, so that is tight but not unreasonable.

**Recommendation: move milestone 1 from week 4 to week 5, Sunday 20 September, before
submitting the blueprint.** Milestones 2 and 3 stay where they are. It costs nothing
today, it is a single date in a form that has not been submitted, and it buys back
exactly the week this decision spends. Changing it after approval is a Risk update
instead.

---

## 7. What is explicitly still deferred

- Pausing `v3-2-3`. Not this week, not this month unless the app pivot is done.
- The Forever Twins successor contracts for LEO Cats and Miami Degens. Not needed while
  `v3-2-3` is unpaused, because the existing helpers keep working.
- Dependency root migration. Cannot happen before `set-next-id` and is not needed until
  something on the new core wants a recursive dependency on an old token.
- The app pivot. `src/home/main.js` will keep defaulting to `v3-2-3`, which under option
  B is correct behaviour rather than a bug.
- The do-not-migrate notice. Becomes mandatory only when `migrate-from-v3-2-3` is
  reachable, which means when the new core is unpaused. **Under option B that is
  Thursday**, so the notice moves into this week. It is one paragraph on the claim pages
  and a pinned message. Do not skip it: a holder who migrates an escrowed twin out and
  back breaks their pairing permanently.
