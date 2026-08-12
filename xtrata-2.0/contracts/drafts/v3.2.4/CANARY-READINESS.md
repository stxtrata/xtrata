# v3.2.4 canary readiness

Synthesis of six parallel audits (clarinet, satellites, deps, wallet, apprefs, template),
each with adversarial verification of its blocking claims. Date: 2026-08-10.

---

## Verdict

**The canary can be run today.** `node contracts/drafts/v3.2.4/build-canary.mjs --check`
exits 0 with "generated files are up to date", `canary.html` contains all 26 declared
steps (P1 through V3), and none of its 10 automated checks depends on anything that is
missing or broken. Every blocking claim raised across the six audits was refuted on
verification, and three of the six areas raised no blocking claim at all. The toolchain
is present (clarinet 3.12.0, node v22.20.0, `@stacks/clarinet-sdk` installed at
`contracts/clarinet/node_modules/`), the candidate compiles clean against
`contracts/clarinet/v3.2.4/Clarinet.toml`, and the five suites wired to
`npm run test:v3.2.4` pass 74 assertions. **What is not true is that the canary should be
run to completion today.** As generated it drives an operator into a known ordering
defect (step C1 reads `next-id` from v3.2.3 *before* step C2 pauses it, so the number can
drift between the read and the set), and it omits the X, D and F phases entirely, so an
operator working only the generated page would deploy an irreversible new core (M1) and
unpause it (C3) with no dependency migration done and no do-not-migrate notice published.
The shortest path to a *safe* first run is short and sequential: merge the C1b/C1c
ordering correction from `CUTOVER-ADDENDUM.md` into `steps.json`, regenerate, and rehearse
phases P and T. Everything else is parallelisable and none of it gates opening the page.

---

## Areas at a glance

| Area | Status | Single most important next action |
| --- | --- | --- |
| clarinet | Ready, plan text stale | Port `contracts/drafts/v3.2.4/xtrata-v3.2.4-sponsored.test.mjs` into `contracts/clarinet/tests/`, repoint its `initSimnet` at `./v3.2.4/Clarinet.toml`, and add it to the `test:v3.2.4` chain. It carries the only assertions on the payer/recipient fee split, the headline v3.2.4 feature. |
| satellites | Chain facts good, plan prose wrong | Correct `MIGRATION-PLAN.md:104-107` and the S3 action text in `steps.json:265`: the "no core reference" and "`<nft-trait>` parameter" rationales are false, those contracts are welded to `xtrata-v2-1-0`. |
| deps | Plan step not executable as written | Split D1 into D1a (migrate the roots Xtrata owns, a fixed list) and D1b (publish a cross-boundary notice). `migrate-from-v3-2-3` transfers from `tx-sender`, so Xtrata cannot migrate third-party roots at any price. |
| wallet | Question answered, plan text stale | Rewrite `CUTOVER-ADDENDUM.md:358-368` with the verified three-state answer and change F5b's verify from "Rapha has confirmed in writing" to "xtrata-inscribe-v2 deployed and per-wallet runbook written". |
| apprefs | Largest silent-failure surface | Widen `src/lib/contract/capabilities.ts` for 3.2.4 first (A1 gates A2), then widen the six version gates outside the files A1/A2 name, starting with `src/home/main.js:283-284,295,305-306`. |
| template | Largest genuine effort, days not hours | Write `contracts/clarinet/contracts/xtrata-forever-twin-v1.clar` from `leo-fakfun-xtrata.clar` verbatim as the code base, plus a Clarity 4 Clarinet manifest, because no existing manifest can compile a helper at all. |

---

## What blocks running the canary

**Nothing.** No blocking claim survived adversarial verification.

Six claims were raised as blocking. All six were refuted. For honesty about the process
rather than to reopen them, here is the shape of the refutations, one line each.

- The `clarinet check` plan-corruption is real but self-repairing inside a single
  `npm run test:v3.2.4` invocation, and the canary never invokes clarinet or npm at all.
- Both P3 test files do run and pass at exactly the counts P3 names once copied one
  directory over, and P3 carries no automated check anyway.
- The three satellite claims (`xtrata-preinscribed-collection-sale-v1-0` not deployed, the
  "no core reference" rows, the non-sponsored markets) are all correct as facts but land
  on rows whose Action column already reads "Nothing".
- The missing F phase is the addendum's own declared status, not drift, and
  `build-canary.mjs --check` exits 0.

Of the 26 steps, 16 carry `"check": {"kind": "manual"}` and 10 are automated
(2 contract-exists, 6 read-only, 1 has-function, 1 abort-scan). Every automated check
targets the new core, which does not exist yet, so they fail closed until M1 lands. That
is the design, not a defect.

---

## What must be correct before the cutover completes

Ordered by consequence, not by area.

### 1. The C1 / C2 ordering defect is still live in the generated canary

`steps.json` orders C1 "Read the current next-id from v3.2.3" before C2 "Pause v3.2.3".
The addendum's C1b/C1c corrections that fix this are unmerged, and
`contracts/drafts/v3.2.4/CUTOVER-ADDENDUM.md` is untracked in git. Any mint landing
between the read and the pause makes the number written down stale, and C3 sets it
irreversibly on the new core. This is the single highest-consequence item in the whole
audit and it is a five-minute edit.

### 2. `mint-single-tx-to` has zero runnable test coverage

`grep -rn "'mint-single-tx-to'" contracts/clarinet/tests/` returns nothing. The
payer-charged / recipient-charged-nothing invariant is asserted only at
`contracts/drafts/v3.2.4/xtrata-v3.2.4-sponsored.test.mjs:71-74`, which is not in the
runnable tree. M1 is marked irreversible. Shipping the core the cutover exists for with
its headline function untested is not acceptable.

### 3. A stale 1663-line draft sits beside the 1811-line candidate

`contracts/drafts/xtrata-v3.2.4-draft.clar` (md5 3e5c3324) is missing five public and
read-only functions and the `ParentDelegates` map relative to
`contracts/drafts/v3.2.4/xtrata-v3.2.4-candidate.clar` (md5 6d28ba05). The guard intended
to catch a trait leak into the deployable file is vacuous: `draft.core.test.mjs:30-31`
read the same path into both `cl` and `live`, so line 35's comparison cannot fail. Delete
the draft or make the guard real. A leaked `.sip009-nft-trait` in the candidate would
deploy a core that does not implement the mainnet SIP-009 trait.

### 4. The app pivot misses the gates that actually select the core

The A1/A2 grep patterns undercount by 208 lines repo-wide (98 in live code) because the
deciding predicates are written as bare `'3.2.3'` or `includes('v3-2-3')`. Concretely:
`src/home/main.js:283-284` returns weight 0 for an unrecognised version, sorting v3-2-4
below v2-1-0, and `:305-306` prefers 3.4.0 or 3.2.3, so **the home page keeps defaulting
to the old core after a correct A2**. Separately `src/lib/contract/capabilities.ts:199`
returns the 1.1.1 capability set for an unknown version, which silently disables
`supportsNativeSingleTx` rather than failing loudly. That is precisely the error-versus-empty
bug class named in `CLAUDE.md`.

### 5. A2's ordering and rollback text are both wrong

`isValidEntry` (`src/lib/contract/registry.ts:21-23`) filters out any registry entry whose
`protocolVersion` is not in `PROTOCOL_VERSIONS`, so A1 must land before A2 or A2 is a
no-op plus a TypeScript error. A2's instruction to swap rather than append conflicts with
its own instruction to set `legacyContractId` to the 3.2.3 id, because `getLegacyContract`
resolves through the registry map and returns null when the target is absent. And A2's
rollback ("Point the registry back at 3.2.3. The app is the only thing that moves") is
false after C1, because 3.2.3 is paused by then. Two edge workers additionally derive the
default core from array order (`functions/g/[[path]].ts:24-27`,
`functions/inscription/handler.ts:20-24`), so swap-versus-append changes behaviour there.

### 6. Four deployed contracts stop dead at the pause

`leo-fakfun-xtrata` (verified from the deployed source: `MASTER` at line 10, called at
line 103, no `set-master` in its define-public list), `pepe-4ever-fakfun`,
`miami-degens-fakfun-xtrata` and `xtrata-inscribe` all inscribe through v3.2.3 via a
`define-constant` with no setter. That is the complete set. Everything else that touches
v3.2.3 only calls `transfer`, which the deployed core explicitly exempts from the pause
(`contracts/live/xtrata-v3.2.3.clar:621`).

### 7. The passkey extension path exists but is unreachable

`fakfun-wallet-v16.mainnet.clar` has `whitelist-extension` (L630) and
`execute-pending-whitelist` (L639), the only writers to `whitelisted-extensions` besides
`onboard`. But the entry point is gated on `(is-admin-calling tx-sender)` with no passkey
alternative, and `onboard` seeds the burn address `SP000000000000000000002Q6VF78` as the
sole admin (L2219, L2226). Every extension-capable wallet sampled on chain is in exactly
that un-initialised state, so the path is dead until the one-time admin-init flow runs
(propose / accept / confirm, `pubkey-cooldown-period` u432 burn blocks, about three days).
Also settled: `extension-call` is typed `(buff 2048)` in already-deployed wallets, so the
addendum's "widen the payload buffer" suggestion at L383-387 requires a new wallet version,
not a new extension.

### 8. D1 as written cannot be executed by Xtrata

`xtrata-v3.2.4-candidate.clar:1009` transfers the source token from `tx-sender`, and
v3.2.3's `transfer` asserts `tx-sender` is the owner. Only the current owner can migrate a
root. A 600-transaction scan of the 1281 against v3.2.3 found 75 distinct ids used as
dependencies or parents, contributed by 29 distinct wallets, of which the deployer
contributed 3. The Xtrata-controlled set is small and cheap: token #107 plus up to twelve
arcade module leaves, at most 1.3 STX of protocol fee, waived entirely if the migrating
wallet is the royalty-recipient. Migration does not require the transitive closure:
`migrate-from-v3-2-3` copies deps and parents unvalidated (`:1022-1024`) and `get-chunk`
falls through `MigrationSource` (`:1623-1639`).

### 9. Migrating #107 alone does not restore the agent journal

Journal entries 7 onward went through `xtrata-small-mint-v1-1`, which still points at
`xtrata-v3-2-1` (`contracts/live/xtrata-small-mint-v1.1.clar:18`) and is paused by default
(`:30-31`). Unlike the Forever Twins helpers this one is repointable via `set-core-contract`
(`:141`), but v3.2.4 must satisfy `xtrata-v3-2-1-trait` (`:20-28`), which nobody has checked.

### 10. Three plan rows assert deployment facts the chain contradicts

`xtrata-preinscribed-collection-sale-v1-0` is not deployed under that name or four
variants at the deployer address. `xtrata-v2-1-1`'s deploy transaction aborted
(`abort_by_response`, block 8205504) yet the app still offers it as a selectable core at
`src/data/contract-registry.json:15-22`. And the "no core reference" cells on
collection-mint, commerce and vault are wrong: all three weld `xtrata-v2-1-0` as an
enforced constant. None of this blocks anything, all of it makes the plan untrustworthy
at the exact moment someone is reading it under pressure.

### 11. Two live surfaces phase S does not mention at all

`proof-of-free-v1` is a sponsored drops-class satellite
(`functions/sponsor/[[path]].ts:98-101`) whose generator hardens
`set-nft-allowed` so it can only ever allow `PRIMARY-NFT-CONTRACT`
(`src/lib/deploy/proof-of-free-v1.ts:216-221`) and requires that constant to be literally
`<deployer>.xtrata-v3-2-3` (`:281`). Already-deployed PoF collections are v3.2.3-only
forever, by design. Separately `functions/warm.ts:15` and `functions/g/[[path]].ts:213`
hardcode the v3.2.3 principal server-side, outside `src/`, so an A4 grep scoped to `src/`
misses them.

### 12. The Forever Twins successor template does not exist as a file

Roughly 330 lines of new Clarity plus about 250 lines of test plus a Clarinet 4 manifest
that does not exist today (no helper is registered in any manifest, and the v3.2.4
sub-manifest is deliberately pinned to Clarity 3 because `as-contract` does not resolve
under 4). All three forever-twins scripts are TODO stubs that exit 1. Two facts change
the shape of this work in Xtrata's favour: the canonical hash manifests are recoverable
byte-exact from the old helpers' `seed-canonical` transaction arguments rather than
needing a fresh IPFS harvest for LEO Cats, and `finalize-canonical` has never been called
on either the LEO or the Miami helper, so no "frozen canonical set" claim about those two
is currently true. Also flagged: `src/lib/twins/resolver.ts` keys its reverse-index cache
on `collection.key` (`:66,94,95`), so addendum step F11's requirement to register old and
new helper generations together would make the second entry silently inherit the first's
index.

---

## Ordered path to the first canary run

The page opens today. This path is what makes opening it worth doing. Steps 1 to 3 are
strictly sequential. Tracks A through E after that run in parallel and do not gate each
other. The live cutover run is gated on all of them.

**1. Merge the C ordering correction. (minutes, blocks everything downstream)**
Take C1b and C1c from `CUTOVER-ADDENDUM.md`, merge into `steps.json` so that the pause
precedes the read, correct A2's rollback field in the same pass, then run
`node contracts/drafts/v3.2.4/build-canary.mjs` and confirm `--check` exits 0. Commit the
addendum, which is currently untracked. Nothing else should be merged in this pass.

**2. Rewrite P1, P2, P3 and S3 to match what is on disk. (about an hour, sequential after 1)**
P1 should name `contracts/clarinet/v3.2.4/Clarinet.toml:29-32` as the registration that
already exists, P2 should point at `contracts/clarinet/contracts/xtrata-v3.2.4.clar` as
the already-swapped copy, P3 should say `npm run test:v3.2.4` from `contracts/clarinet`
with the real assertion counts, and S3 should say to spot check a sponsored market and a
template-deployed collection rather than asserting "no core reference". Regenerate.

**3. Rehearse phases P and T against the corrected page. (about an hour, sequential after 2)**
This is the first honest canary run. It is a dry run: the T-phase automated checks will
fail closed because `xtrata-v3-2-4` returns HTTP 404 on the interface endpoint today, and
that is the expected result. What it proves is that the checklist is drivable and that its
prose matches the repo.

After step 3 the following run in parallel.

**Track A, test coverage. (hours)** Port the sponsored suite into
`contracts/clarinet/tests/` and wire it to `test:v3.2.4`. Decide the fate of
`contracts/drafts/xtrata-v3.2.4-draft.clar` and its test, and replace the vacuous trait
guard with a real two-file comparison. Gate on: nothing. Gates: M1.

**Track B, app pivot. (days)** A1 (capabilities widening) then A2 (registry), strictly in
that order, then the six unnamed version gates, then the edge and radio paths
(`functions/warm.ts:15`, `functions/g/[[path]].ts:213`,
`src/home/radio.js:447,793,821`, `src/migrate-ui.ts:19`,
`src/contract-studio/ContractStudioPage.tsx:30`), then the agent bundle with the five-place
cache-buster bump verified on a static serve per `CLAUDE.md`, then regenerate
`public/llms.txt` from `scripts/sdk/llms-generate.mjs` rather than hand-editing. A1 and the
gate widening can be unit-tested now. A2 cannot be verified end to end until M1 lands.
Gate on: nothing for A1. Gates: C3.

**Track C, dependency roots. (hours, plus one open ownership question)** Split D1 into D1a
and D1b in `steps.json`. Confirm ownership of arcade leaves 68, 69, 70, 71, 72, 80, 87,
2789, 2797, 2798, 2803, 2804 before committing them to D1a. Pair #107's migration with
repointing `xtrata-small-mint-v1-1`. Gate on: M1 and C2 for execution, nothing for
planning. Gates: C3.

**Track D, satellites and wallets. (hours to days)** Correct the MIGRATION-PLAN deployment
column. Add a phase-S step for `proof-of-free-v1`. Rewrite X1 to combine the tx-history
scan with four direct `is-allowed-caller` reads via the SDK client. Deploy
`xtrata-inscribe-v2` against the new core, which can happen any time after M1 and should
not gate C1. Write the two-branch per-wallet remediation runbook (one day for an
initialised wallet, about four days for an un-initialised one). Gate on: M1 for the
deploy. Gates: nothing hard, but it sizes the user-visible regression.

**Track E, Forever Twins. (days to weeks, the long pole)** Write
`xtrata-forever-twin-v1.clar`, add a Clarity 4 manifest, write the escrow-invariant tests,
build `recover-canonical.mjs`, then the genuine harvester for the Miami remainder. Fix
`src/lib/twins/resolver.ts` cache keying before F11. Everything except the `MASTER` line
can be written and tested before M1. Gate on: M1 for the final `MASTER` value only.
Gates: F12, which must land before C3 unpause.

**Live cutover run.** Gated on tracks A through E reaching their stated gates, plus the
D, F and X phases being merged into `steps.json` per the section below.

---

## Still unknown

| Unknown | What would determine it |
| --- | --- |
| Who owns arcade module leaves 68 through 2804 on v3.2.3 | Page two of the deployer's 71 holdings, `GET /extended/v1/tokens/nft/holdings?principal=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X&asset_identifiers=...xtrata-v3-2-3::xtrata-inscription&offset=50`. Decides whether the arcade cluster is migratable at all. |
| Does v3.2.4 satisfy `xtrata-v3-2-1-trait` | Read `contracts/live/xtrata-small-mint-v1.1.clar:20-28` against the candidate's public interface. If not, the agent journal needs a successor helper the way LEO Cats and Miami Degens do. |
| Which extension-capable wallets have `is-initialized = true` | Per-wallet contract state. Read-only calls via the SDK client (the raw `/v2/contracts/call-read-only` path 404s here), or a full scan of `fakfun-wallet-core` `admin-added` events. Sample of four is not the population. |
| Who holds the admin principal on an initialised wallet, fak.fun or the end user | Ask Rapha. Observed admins are SM-prefixed multisig principals. Decides whether remediation is one coordinated batch or a per-user support burden. |
| Is a `proof-of-free-v1` collection actually live | `POF_CONTRACT_ID` is a Cloudflare Pages dashboard variable, not in `wrangler.toml`. Check Workers and Pages, xtrata, Settings, Variables, for Production and Preview. |
| Has `SPONSOR_MARKETS` been overridden in the dashboard | Same place. `functions/sponsor/[[path]].ts:183` lets an env var replace `DEFAULT_MARKETS` entirely. |
| Actual total supply of LEO Cats and Miami Degens | Decode all 50 LEO and 3 Miami `seed-canonical` transaction argument lists offline. `get-last-token-id` is unreachable here. F2 needs this. |
| Was `finalize-canonical` ever called on `pepe-4ever-fakfun` | Enumerate its 2106 transactions. Confirmed never called on LEO or Miami. Decides what the campaign pages may claim about Bitcoin Pepes. |
| Does the cutover include a successor drops contract | A decision, not a lookup. The deployed `xtrata-drops-v1-1` pins v3-2-3 as a constant, so either drops v1-2 ships against the new core or collection drops stay a v3.2.3-only feature. S1 to S5 do not say. |
| Is `3.4.0` in `capabilities.ts:138-155` a planned core or dead scaffolding | Ask. `versionWeight` in `src/home/main.js:280-281` ranks it above everything, so it affects whether 3.2.4 sorts as newest once the gates are widened. |
| What is `supportsSponsoredMint` gating | No consumer exists in `src/` yet. Determine whether the UI branch is in scope for this cutover. |
| Exact count of backward-looking dependency roots | Run the remaining 14 pages of the v3.2.3 tx scan (offsets 600 to 1250) at 1.3s spacing. Extrapolation gives 110 to 130. Informs the D1b notice, not the migration list. |

---

## What the canary itself must gain

The addendum proposes an X assertion phase, a D dependency-migration phase, an F Forever
Twins phase, F5b for the passkey extension, and the C1b/C1c ordering correction. None of
them are in `steps.json`, which declares exactly 7 phases (P, T, M, C, S, A, V) and 26
steps. That absence is the addendum's own declared status
(`CUTOVER-ADDENDUM.md:3`, "Status: planning. Nothing here has been deployed or merged into
`steps.json`"), not silent drift.

Merging is cheap mechanically. `build-canary.mjs` regenerates both `canary.html` and the
MIGRATION-PLAN table from `steps.json`, and `--check` verifies they are in sync. The
constraint is that each phase carries a precondition that is not yet met.

- **C1b / C1c ordering.** Precondition: none. This one is mergeable today and should be
  merged today, ahead of everything else. It is the only correction whose absence can
  cause an unrecoverable outcome during a run that otherwise looks like it is going well.
- **X assertion phase.** Precondition: rewrite X1 so it does not depend on enumeration.
  The deployed v3.2.3 does expose `is-allowed-caller` as a read-only
  (`contracts/live/xtrata-v3.2.3.clar:1592`), so X1 can be four direct positive checks
  against the four contracts that break at pause, rather than a scan of 1281 transactions.
  Mergeable as soon as that rewrite is done.
- **D phase.** Precondition: D1 must be split into D1a and D1b, because as a single step
  it promises an enumeration Xtrata could not act on even if it were complete. D1a also
  needs the arcade leaf ownership question answered before its list can be fixed. Merge
  D1b (a comms step) now and D1a once ownership is confirmed.
- **F phase.** Precondition: three of the thirteen F steps are un-mergeable today. F3's
  fee and Rapha's payout principal are unconfirmed, F4 needs the new core address that
  only exists after M1, and the wallet-whitelist question depends on Rapha's wallet list.
  The other ten are mergeable now. Merge them now rather than waiting, because F12
  ("publish the do-not-migrate notice") must land before C3 unpause and an operator
  driving only the generated canary today would never see it. By HC5 a twin migrated out
  of escrow can never be swapped back.
- **F5b.** Precondition: its verify condition must change. "Rapha has confirmed in writing
  whether already-onboarded wallets can add it post-onboard" is a question the contract
  source already answers. Replace with "xtrata-inscribe-v2 deployed against v3.2.4 and the
  per-wallet remediation runbook written". Keep it pre-C1 as currently flagged.

One structural note for whoever does the merge. All new steps should carry an explicit
`check` kind. 16 of the current 26 are `{"kind": "manual"}`, and `build-canary.mjs:57,73-77`
renders those as a bare checkbox reading "No automatic check. Confirm by hand." That is
fine for a decision but weak for a fact that can be read from the chain. X1, D4 and F9 in
particular should be automated reads, not checkboxes.

---

## Effort, honestly

- Ordering correction and plan-text rewrites: half a day.
- Test coverage (Track A): one day.
- App pivot (Track B): three to five days, dominated by the version gates and the agent
  bundle verification loop on a static serve.
- Dependency roots (Track C): one day of planning, plus execution time gated on M1.
- Satellites and wallets (Track D): two to three days, plus an unknown coordination tail
  with Rapha.
- Forever Twins (Track E): two to three weeks. New Clarity, a test harness that does not
  exist, a harvester that does not exist, and three script stubs that currently exit 1.

The plan's headline claim that "No satellite contract needs redeploying" does not survive
the audit. `xtrata-collection-mint-v1-4` has no setter for `ALLOWED-XTRATA-CONTRACT`, so
after S1 the only markets that can list a 3.2.4 token are the three sponsored ones and
there is no collection-mint path for previously deployed collections at all. Either accept
sponsored-only and say so, or add a v1-5 redeploy to the plan and revise the headline.
