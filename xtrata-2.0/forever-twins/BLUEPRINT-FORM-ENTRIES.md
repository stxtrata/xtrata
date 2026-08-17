# Blueprint form: field-by-field entries

Paste-ready text for the DeGrants "Your Project Blueprint" form.
Prepared 12 August 2026.

Payment shape: $1,000 on blueprint approval (a separate row, not a milestone), then
$4,000 divided across three milestones.

The long-form reasoning lives in `BLUEPRINT-SUBMISSION.md`. This file is only what
goes in the boxes.

---

## Field 1: Overall scope of work

The box is pre-filled with the original pitch text. Replace it. Two reasons: the
pitch says USDCx and sBTC support is "planned to widen access", which the code review
showed is weaker than it sounded, and this text becomes the record against which
delivery is judged.

> Forever Twins gives any NFT collection a permanent, fully on-chain twin, with the
> artwork inscribed directly onto Bitcoin via Stacks, so the culture survives even
> when the original's off-chain image disappears. The original NFT is never modified
> and nothing is taken from any holder. Every twin is hash verified against the source
> art, so preservation is provably faithful rather than an approximation, and each
> twin stays bound to the real owner of the original.
>
> This grant funds the open, reusable preservation infrastructure. A contract template
> and a hash harvester that can read artwork out of a collection and prove it was
> copied faithfully. A public registry that verifies each deployed twin contract
> against the published template, so a tampered fee produces an unlisted contract. A
> self-serve deployer that lets anyone stand up a collection's own Forever Twins
> contract from their own wallet. Educational material on off-chain art fragility and
> how to check any collection yourself.
>
> Holders preserve their twin for a modest fee, with the inscription cost passed
> through transparently. The tooling and registry are open source and reusable by
> anyone. It builds on Xtrata's live mainnet data layer, where three collections are
> already preserved.

Word count 213. If the box is tighter, cut the third paragraph first.

---

## Field 2: Start date

**Monday 17 August 2026.**

Confirm this is right before entering it. Every milestone date below hangs off it.

---

## Field 3: Deadline

**Sunday 29 November 2026.**

Not 8 November. The field says "Allow at least 21 days for project completion and
review", so the deadline needs to sit past the end of the work, not on it. Week 12
ends Sunday 8 November. Twenty-one days after that is 29 November.

This costs nothing and removes an argument. A deadline set to the day the work
finishes leaves no room for the review the form is explicitly asking you to allow for.

---

## Field 4: Milestone 1

**Name**

> Tooling proven and open sourced

**Amount**

> 1000

**Scope of work**

> Deliver the core tooling and prove it is correct before anything depends on it.
>
> A twin contract template generalised from the live production helper, with the
> source collection, asset name and fee as substitution slots and the fee hard coded.
> A guard preventing one token from ever being bound to two different twins. A Clarinet
> test suite covering the escrow invariant, rejection of non-canonical bytes, and fee
> routing. A hash harvester that reads a collection's token URIs, fetches each asset,
> computes the hash chain and emits the seeding transactions.
>
> Completion evidence: a public repository and commit hash with an open licence, the
> test suite green, a testnet contract that has been through the full lifecycle of
> seed, finalise, inscribe and swap in both directions, and a published diff report
> showing the harvester reproduces Bitcoin Pepes' existing on-chain canonical hashes
> byte for byte across all 2,089 tokens, with zero mismatches. Anyone can rerun it.
>
> Target: end of week 4, Sunday 13 September 2026.

**Why this milestone is worth money.** Reading art out of arbitrary collections is the
hardest engineering in the grant and everything downstream waits on it. Bitcoin Pepes
is the only test where the correct answer is already on chain, which makes it the only
rigorous proof available. It passes or it does not.

---

## Field 5: Milestone 2

**Name**

> Preservation service, registry and documentation live

**Amount**

> 1500

**Scope of work**

> Open the service to the public and publish the educational material.
>
> A public preservation registry, one row per collection, showing source contract,
> twin contract, tokens preserved, whether the canonical set is finalised, and whether
> the deployed source hash matches the published template. A public preservation
> service on mainnet. Successor twin contracts for LEO Cats and Miami Degens, seeded
> and finalised, which makes a frozen canonical set true for those collections for the
> first time. Four long-form documents fact verified against live contract state, plus
> a preserve-your-collection how-to and onboarding docs written from a real run.
>
> Completion evidence: registry URL listing every collection with its verification
> status, mainnet contract ids and finalise transaction ids for the two successor
> contracts, six published document URLs, and a public repository with a licence
> covering the template, harvester and registry.
>
> Target: end of week 8, Sunday 11 October 2026.

---

## Field 6: Milestone 3

**Name**

> Self-serve deployer public and impact reported

**Amount**

> 1500

**Scope of work**

> Open preservation to anyone and show what it saved.
>
> A public deployer where any wallet can generate a Forever Twins contract for a
> Stacks collection, deploy it from their own wallet, seed the canonical hashes and
> finalise the set, with no action from me at any point and no key held by me. An
> automatically generated claim page for every registry entry. At least two collections
> beyond the three already live, preserved on template-generated contracts. A payment
> and access path that removes the requirement to hold STX. A public metrics page and
> a recap post.
>
> Completion evidence: deployer URL, a mainnet contract id generated end to end through
> the tool with its deploy transaction, one mainnet preservation completed by a wallet
> holding no STX, the metrics page, the recap post, and a preservation ledger showing
> every piece of at-risk artwork saved with grant money, with transaction ids and the
> holders it now binds to.
>
> Target: end of week 12, Sunday 8 November 2026.

**Note on numbers.** Completion is the metrics page being live and accurate. The
values it reports are outcomes, not commitments. Third-party deployments are reported
with transaction ids, never made a condition of completion.

---

## Field 7: KYC verification

Documents are uploaded here, in this form. This answers the earlier open question, so
there is no need to ask the steward whether KYC is cleared.

Have ready before starting the form, since a part-filled form is easy to lose:

- Government photo ID, passport or driving licence.
- Proof of address if requested, usually a utility bill or bank statement under three
  months old.

KYC is a documented precondition of payment for Cohort 4, so an incomplete upload
stalls the $1,000 regardless of whether the blueprint is approved.

---

## Before pressing submit

1. **Confirm the milestone total the form expects.** The counter reads
   "Total: $0 / $5,000 awarded" while the milestone rows are meant to divide $4,000.
   If the form refuses a $4,000 total, the fix is to add the $1,000 blueprint payment
   as a first milestone and shift the others down. Worth knowing before filling in
   three long text boxes.
2. **Talk to Rapha first.** The template generalises his work and the blueprint may be
   visible beyond the steward.
3. **Confirm the start date**, because every milestone date depends on it.
4. **Send the phasing message** in `STEWARD-CONVERSATION.md`, or fill the amounts in
   as above and let the form make the proposal for you. Do one or the other, not both.

## What is deliberately not in the form

The form has four text boxes and the full blueprint is far longer. Keep the long
version in the public repository and link it from the scope field if a link is
accepted. The detail that does not fit, and does not need to:

- The registry-verifies-the-template enforcement mechanism, in full.
- The definitions of preservation and self-serve.
- The core cutover dependency and the do-not-migrate warning.
- The risk register.
- The sponsorship refinement replacing USDCx.

That last one still needs raising with the steward directly. It is a change from what
was approved and it should not be discovered inside a milestone scope box.
