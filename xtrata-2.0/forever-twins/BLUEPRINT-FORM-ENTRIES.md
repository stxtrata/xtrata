# Blueprint form: field-by-field entries

Paste-ready text for the DeGrants "Your Project Blueprint" form.
Prepared 17 August 2026.

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
> test suite green, and a twin contract that has been through the full lifecycle of
> seed, finalise, inscribe, swap out and swap back, with the contract id and every
> transaction id published. Rehearsed on testnet and evidenced on mainnet against the
> live core, so the artefact is permanent and independently checkable.
>
> Plus a published replay report against Bitcoin Pepes, which is the reference set
> because it is fully preserved: all 2,089 of its twins were minted through a contract
> that refuses any bytes not matching the token's recorded hash, so every one of those
> hashes has already been confirmed by a successful mint rather than merely asserted.
> For every token whose source art is still retrievable, the harvester's computed hash
> matches that recorded hash exactly, with zero mismatches. Tokens whose source art can
> no longer be fetched are counted and published separately as a link-rot measurement,
> because that number is itself a finding worth having. Anyone can rerun the whole thing.
>
> Target: end of week 4, Sunday 13 September 2026.

**Why this milestone is worth money.** Reading art out of arbitrary collections is the
hardest engineering in the grant and everything downstream waits on it. Bitcoin Pepes
gives a complete reference set to test against, for free, because all 2,089 of its
hashes were validated by the contract at mint time. LEO Cats offers 101 such
validations and Miami Degens one, so Pepes is the only collection that can check the
harvester across a whole collection rather than a handful of tokens. It passes or it
does not.

---

## Field 5: Milestone 2

**Name**

> Public registry, documentation, and the first collection on the new template

**Amount**

> 1500

**Scope of work**

> Open the service to the public and publish the educational material.
>
> **The public registry.** One row per collection: source contract, twin contract, tokens
> preserved, whether the canonical set is finalised, the deployed source hash, and
> whether that hash matches the published template. New contracts appear here as they are
> added, so it is the place to watch as the preserved set grows, and the template
> verification column is what makes a listing mean something rather than just exist.
>
> **What this milestone lets someone do.** Find a collection that already has a twin
> contract, check it is genuine, and preserve their own piece of it. Creating a contract
> for a collection that does not have one yet is milestone 3. This milestone is the
> public record and the way in. Milestone 3 is the ability to start a new one.
>
> **The first collection on the new template.** One collection beyond the three already
> live, preserved on an Xtrata-native contract generated from the milestone 1 template,
> deployed and seeded by me. This is the step that proves the template works in
> production rather than only in tests, and it gives the registry its first row that is
> verifiable against the published source.
>
> **The documentation.** Four long-form documents, fact verified against live contract
> state and published: the state of link rot in 2026, a verify-it-yourself guide, a
> repoint-your-collection playbook, and the Bitcoin Pepes case study. Plus a
> preserve-your-collection how-to and onboarding docs, written from the real run above
> rather than from theory.
>
> **Instrumentation.** Live counters from this point rather than reconstructed at the
> end: collections preserved, twins minted, wallets holding a twin, and contracts
> deployed through the tool.
>
> Completion evidence:
>
> 1. Registry URL, live, listing every collection with its twin contract id and its
>    template verification status.
> 2. For the first new collection: contract id, finalise transaction id, and at least one
>    inscription transaction id.
> 3. Six published document URLs, four long form plus the how-to and the onboarding docs.
> 4. A public repository with a licence covering the template, the harvester and the
>    registry.
>
> Target: end of week 8, Sunday 11 October 2026.

**Why the LEO Cats and Miami Degens successors are not in this milestone.** They pin the
new core as a Clarity constant, so they cannot be written until its address is final or
deployed until it is live, and the core cutover is separate work this grant does not pay
for. Everything left in milestone 2 is deliverable without waiting on anyone. The
successors are not in milestone 3 either. See the sequencing note near the end of this
file for where they went and why.

---

## Field 6: Milestone 3

**Name**

> Self-serve deployer public and impact reported

**Amount**

> 1500

**Scope of work**

> Let anyone start a new one, remove the need to hold STX, and show what it saved.
>
> **The deployer, which is the whole point of this milestone.** Milestone 2 published the
> record and let holders preserve pieces of collections that already had a contract. This
> milestone removes me from the process entirely: a public tool where any wallet can
> generate a Forever Twins contract for a collection that has none, deploy it from their
> own wallet, seed the canonical hashes and finalise the set. I hold no key and no step
> waits on me. It also generates that collection's claim page automatically, so a working
> contract arrives with a working front end. It opens to a short allow list first and goes
> fully public after three clean deployments, which is a deliberate rollout rather than a
> caveat.
>
> **A second collection preserved, making two beyond the three already live.** The first
> was delivered in milestone 2 by me, which proved the template. This one is selected on
> measured evidence published in the registry: how the artwork is hosted, how many public
> gateways currently serve it, and what share of the collection is already unreachable.
> Every collection with off-chain art is at risk in principle, and the survey behind this
> grant found two of nineteen already unreachable, so the useful question is not whether a
> collection is at risk but which are closest to failing and how many people would lose
> something. That measurement is published whether or not a collection is selected.
>
> What "preserved" means here, stated now rather than argued in November: the twin
> contract is live on mainnet, the canonical hash set is seeded and frozen, and at least
> one twin has been inscribed against it. It does not mean every token has been claimed.
> Claiming costs a fee and is the holder's choice, so nothing I do can compel it. A
> collection whose canonical set is frozen is permanently preservable by anyone, for
> ever, and that is the durable thing this grant buys.
>
> **No STX required.** An access path so a holder can have their artwork preserved
> without holding, spending or signing anything. See the note below on why this is
> already possible rather than something that has to be invented.
>
> **The public record.** A metrics page reading live chain state, and a recap post
> covering what shipped, what changed, and what the fee revenue sustains after the grant.
>
> Completion evidence, all of it clickable:
>
> 1. Deployer URL, public and working.
> 2. One mainnet twin contract generated end to end through the tool, with its deploy
>    transaction id.
> 3. For the second new collection: contract id, finalise transaction id, and at least
>    one inscription transaction id. With milestone 2's collection this makes two beyond
>    the three already live.
> 4. One mainnet preservation where the holder paid nothing and signed nothing, with the
>    transaction id showing me as payer and the binding resolving to them as owner.
> 5. A preservation ledger of every piece of artwork saved with grant money, with
>    transaction ids and the holder each twin now binds to.
> 6. The published fragility measurement across the collections surveyed.
> 7. Metrics page URL and recap post URL.
>
> Target: end of week 12, Sunday 8 November 2026.

**Note on numbers.** Completion is the metrics page being live and accurate. The
values it reports are outcomes, not commitments. Third-party deployments are reported
with transaction ids, never made a condition of completion.

For the record, so the number is not disputed later: "wallets holding a Forever Twin"
counts the resolved owner, not the raw NFT holder. A twin sitting in escrow is owned
on chain by the helper contract, and the registry resolves it to whoever holds the
original. Counting raw holders would report the helper as one wallet and everybody
else as none, which would be true on chain and useless as a measure.

**Where the LEO Cats and Miami Degens successor contracts went.** They are no longer a
milestone deliverable anywhere, deliberately. They only become *necessary* if the Xtrata
core is superseded during the grant window, because the existing helpers pin the old
core as a Clarity constant and stop minting when it is paused. If the core upgrade does
not happen in these twelve weeks, the existing helpers keep working and the successors
are not needed at all. So they are reported as a Progress Update if they happen, never
as a payment gate. See the sequencing note at the end of this file.

**Why the no-STX criterion is safe to commit to.** Inscribing is permissionless in the
helper contract. Anyone can inscribe any token's twin, the caller pays both fees, the
twin mints into escrow, and the binding resolves ownership to the current holder of the
original. So a holder with an empty wallet who signs nothing still ends up with their
artwork on Bitcoin and their twin bound to them. This needs no sponsor relayer and no
passkey wallet, both of which are currently poor bets. See
`MILESTONE-FEASIBILITY.md` for why.

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

## Sequencing: the core upgrade versus milestone 1

**The question.** The Xtrata core is due to be superseded from `xtrata-v3-2-3` to
either `v3-2-4` or `v3-4-1`. That is unpaid work with its own audited 26-step plan, and
if it takes the first fortnight it eats half of milestone 1's window. Should it be a
milestone 1 deliverable instead?

**No, and it should not be in any milestone. Here is why, and what to do instead.**

### No milestone technically needs the new core

- The harvester does not touch the core at all.
- The contract template works against `v3-2-3` today, which is live and unpaused.
- The lifecycle proof can run on mainnet against `v3-2-3` right now.
- The two new collections are small. Wasteland Apes is about 6.5 KB per item and one
  chunk, Bitcoin Bulls OG is 1,688 bytes. Neither needs v3.2.4's larger size cap.

### The upgrade creates grant work rather than enabling it

The LEO Cats and Miami Degens successor contracts exist **only because** pausing
`v3-2-3` stops the existing helpers minting. No upgrade, no successors needed, and the
existing helpers carry on exactly as today. So doing the cutover inside the grant window
adds two contract deploys, roughly 53 seeding transactions and a holder communications
obligation, in exchange for nothing any milestone requires.

### Putting it in a milestone imports the worst risk in the project

`set-next-id` can be called exactly once and cannot be corrected. Getting it wrong forks
the inscription id space permanently. The target version is still undecided between
v3.2.4 and v3.4.1, three ordering defects in the cutover plan are unmerged, and a
faithful testnet rehearsal needs four large contract deploys in strict order. None of
that belongs behind a payment gate.

### Decided, 17 August 2026

**Grant first. The mainnet cutover waits until after the grant, or for gaps once
milestone 2 has landed.** The cutover has no external deadline. The grant has three dates
and a steward.

**DeOrganized gets a testnet v3.2.4 instead**, within the next few days. They are waiting
on `mint-single-tx-to`, which only ships with the new core, and today they work around it
by minting from a temporary wallet and transferring on, which costs an extra transaction
and records the wrong creator. A testnet deployment lets them build against the real
interface immediately, at no risk to mainnet and no cost to the grant timeline. It also
doubles as the T-phase rehearsal the cutover needs later, so none of it is throwaway.

This is why **milestone 1 stays at week 4**. The decision was originally going to cost
that week, and this route avoids it.

Three things to do this week, none of them grant work:

1. Settle whether the successor is v3.2.4 or v3.4.1. Nothing can be deployed until this
   is decided, even to testnet.
2. Port the `mint-single-tx-to` tests into the runnable tree. It has zero coverage today
   and it is the exact function DeOrganized will be exercising, so testnet is where a
   defect should surface.
3. Deploy to testnet and tell them. See `contracts/drafts/v3.2.4/DEPLOY-THIS-WEEK.md`
   for the ordered steps, and `forever-twins/TESTNET-SETUP.md` for the trait gotcha:
   the `[TESTNET]` address baked into the source does not exist and has to be deployed
   first.

### Either way, do this in week 1

Spike whether Clarinet can compile a Clarity 4 helper at all. It gates milestone 1's
whole test suite, nobody has measured it, and it is independent of the core question.

---

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
