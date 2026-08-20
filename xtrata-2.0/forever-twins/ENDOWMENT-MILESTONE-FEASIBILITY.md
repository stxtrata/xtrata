# Can the Endowment's milestones actually be delivered?

Comprehensive assessment against verified repo and chain state, 17 August 2026.
Payment amounts ignored. Deliverables and dates only.

**Verdict: both milestones are comfortably achievable. Neither is close to the edge.**

The reason is that far more exists than the milestone list implies. Three of the largest
deliverables are already built or are new instances of patterns already shipped. The one
genuine hazard is not a workload at all, it is a definition.

Window: 8 weeks to Milestone 1 (13 October), a further 6 weeks to Milestone 2
(24 November). Roughly 40 and 30 working days.

---

## 1. What was verified, and how

Everything below was checked directly rather than assumed.

| Claim | How verified |
|---|---|
| Preservation service is live | HTTP 200 on all four public URLs |
| Claim pages are functional, not brochures | Contract calls present in page source |
| Claim pages are runtime-parameterised | Contract addresses read from DOM inputs |
| Claim pages are ~90% identical | Normalised diff, 277 differing lines of ~2,850 |
| Hash chain is already implemented | `packages/xtrata-sdk/src/mint.ts` |
| Chunking and batching are already implemented | Same SDK |
| Template-based contract deploy already exists | `src/lib/deploy/`, 1,942 lines, 4 contract types |
| A deploy wizard UI already exists | `src/manage/components/DeployWizardPanel.tsx` |
| Twin resolver is generic and tested | `src/lib/twins/`, 709 lines |
| Candidate collections measured | `COLLECTION-SIZING.md`, 19 collections |
| Contract compatibility near-universal | 32 of 32 mainnet contracts pass SIP-009 checks |

---

## 2. The asset inventory that decides everything

**The public preservation service is already live.** `xtrata.xyz/forever-twins/` plus
three collection pages, all returning 200. The claim pages call `inscribe`,
`swap-nft-for-xtrata`, `swap-xtrata-for-nft`, `get-binding`, `get-canonical-hash` and
`fee-for`. Full working lifecycle, in public, today.

**The claim pages are already generic.** The three contract addresses are DOM inputs
with hardcoded defaults, read at runtime:

```js
const XTRATA_CORE_CONTRACT       = () => $('masterContract').value.trim();
const FOREVER_TWINS_REGISTRY_CONTRACT = () => $('helperContract').value.trim();
const COLLECTION_SOURCE_CONTRACT = () => $('sourceContract').value.trim();
```

A new collection's page is three changed `value=` attributes plus a colour theme and
artwork. The 277 lines that differ between LEO Cats and Miami Degens are almost entirely
CSS custom properties and image paths. No logic differs.

**The harvester is mostly assembled already.**

| Step | State |
|---|---|
| Read supply, resolve token URIs, fetch art | Done. `measure-collection.mjs`, 263 lines, run across 19 collections |
| Split into chunks | Done. `chunkBytes` in the SDK |
| Compute the hash chain | Done. `computeExpectedHash` in the SDK |
| Batch chunks for transactions | Done. `batchChunks` in the SDK |
| Write a canonical manifest | To build. Small |
| Emit seed transactions | To build. Small |

**The deployer is a new instance of a shipped pattern.** `src/lib/deploy/` already does
template source, substitution, contract-name derivation and deploy-from-user-wallet for
artist collections, proof-of-free, drops and living-synth. `DeployWizardPanel.tsx` is
the existing UI. Forever Twins becomes a fifth template type, not a new machine.

---

## 3. Milestone 1, by 13 October

| # | Deliverable | Difficulty | Effort | Risk | Control | Confidence |
|---|---|---|---|---|---|---|
| 1 | Public preservation service live | 1 | 0 days | 1 | Yours | 99% |
| 2 | 3 additional collections preserved | 3 | 6 to 8 days | 2 | Yours | 92% |
| 3 | Preservation registry published | 2 | 3 to 4 days | 1 | Yours | 96% |
| 4 | Explainer and preserve-your-collection guide | 1 | 3 to 4 days | 2 | Yours | 96% |
| 5 | Onboarding documentation | 1 | 1 to 2 days | 1 | Yours | 98% |
| 6 | Tooling and registry open sourced | 1 | 1 to 2 days | 1 | Yours | 98% |

**Total: 14 to 20 days against 40 available.**

### Item 1: the service

Already satisfied. The URLs work today. The only work is adding new collections to the
landing page as they arrive. Nothing to build.

### Item 2: three collections

The substantive item, and it carries the tooling with it. Decomposed:

| Task | Effort | Note |
|---|---|---|
| Contract template from the live helper | 1 to 2 days | 295-line LEO helper, plus a 3-line prior-binding guard, plus fee and payouts as constants |
| Finish the harvester | 2 to 3 days | Manifest writer and seed-transaction emitter only. Fetch, chunk, hash and batch all exist |
| Verify escrow transfer per collection | 0.5 days | One test transfer each |
| Deploy, seed, finalise, inscribe, per collection | 0.5 days each | Mostly transaction time |
| Claim page per collection | 0.25 days each | Three input defaults plus theme |

Five candidates are already measured: Bitcoin Bulls OG (400 items, 2 seed transactions),
Cool Ape (300, 2), NarcotiX (2,407, 13), Stacks Wizards (2,100, 11), Wasteland Apes
(10,000, 50). Protocol fees for three collections at the acceptance bar of one example
mint each are under 50 STX.

No founder permission is required, because inscribing is permissionless. That is what
keeps this entirely in your control, which is unusual for a deliverable of this kind.

### Item 3: the registry

`index.html` is a 619-line landing page with three collection cards. It needs to become a
registry: contract ids, tokens preserved, canonical finalised yes or no, deployed source
hash, and whether that hash matches the published template.

The data layer is done. `src/lib/twins/` is 709 tested lines and fully generic over the
collection registry. Fix the `resolver.ts` reverse-index cache keyed on `collection.key`
before listing two helper generations for one collection.

### Items 4 to 6

457 lines already drafted across four documents. The work is fact verification against
live contract state, not authorship, and the README already enumerates what is unchecked.
Onboarding docs fall out of doing item 2. Open sourcing is packaging and a licence.

### Not required by their criteria

Their acceptance criteria do not mention the Clarinet test suite or the Bitcoin Pepes
replay proof. Those are your own quality bars. So the unmeasured Clarity 4 Clarinet
manifest problem gates your tests, not their milestone. Worth doing anyway, but it cannot
fail this milestone.

---

## 4. Milestone 2, by 24 November

| # | Deliverable | Difficulty | Effort | Risk | Control | Confidence |
|---|---|---|---|---|---|---|
| 1 | Public self-serve deployer | 3 | 5 to 8 days | 2 | Yours | 90% |
| 2 | 5 collections cumulatively | 2 | 2 days | 1 | Yours | 96% |
| 3 | 2 collections via the self-serve flow | 2 | 0 extra | 2 | Yours | 90% |
| 4 | 25 wallets, **resolved ownership** | 1 | 1 day | 1 | Yours | 96% |
| 4b | 25 wallets, **raw custody** | 5 | n/a | 5 | **Theirs** | **25%** |
| 5 | Verifiable on-chain mint activity | 1 | 0 | 1 | Yours | 99% |
| 6 | Public recap | 1 | 1 to 2 days | 1 | Yours | 98% |

**Total: 9 to 13 days against 30 available.**

### Item 1: the deployer

I previously scored this 4 for difficulty and 12 to 15 days. That was wrong, and the
correction is the most useful thing in this report.

`src/lib/deploy/` is 1,942 lines implementing exactly this pattern for four other
contract types, and `DeployWizardPanel.tsx` is a working wizard UI already wired to it.
The building blocks in `deploy.ts` are `buildArtistDeployContractSource`,
`deriveArtistContractName`, `deriveArtistCollectionSlug` and template substitution.

Forever Twins is a fifth template type. What is genuinely new is the seed-then-finalise
step, since no existing template needs a canonical set loaded after deploy, and the
manifest review screen.

### Item 3: two through the self-serve flow

Their wording does not say who drives it. Route two of your five collections through your
own tool. It satisfies the criterion and doubles as the proof the tool works. Risk 2
rather than 1 only because it depends on item 1 landing.

### Item 4: the 25 wallets

**This single line is the only thing in either milestone that can fail on something other
than your own work.**

Resolved ownership, which is what the registry displays and how all three live
collections already work: choose 25 tokens owned by 25 distinct wallets, inscribe on
their behalf, done for a couple of STX and a day of work.

Raw NFT custody: 25 separate people must each deposit their original NFT into the escrow
contract to withdraw the twin. You cannot make that happen. A naive on-chain count would
also report the escrow contract as the single holder however much art you had preserved,
which makes the metric measure the opposite of what it intends.

Same work, two readings, 96% or 25%.

---

## 5. Critical path

```
Week 1-2   Contract template  ──┐
           Finish harvester  ───┼──> collections can start
           Escrow checks     ──┘
Week 3-5   Deploy, seed, finalise, inscribe x3   ──> Milestone 1 item 2
           Registry build (parallel, independent)
Week 5-7   Docs fact-check and publish (parallel)
           Open source packaging
Week 8     Milestone 1 submitted, 13 October
Week 9-12  Deployer, as a fifth deploy template
Week 12-13 Two more collections, two routed through the tool
           25 wallets inscribed on holders' behalf
Week 14    Recap, Milestone 2 submitted, 24 November
```

Only one true dependency chain exists: template and harvester before collections. The
registry, the documentation and the open-source release are all independent and can be
done in any gap. The deployer depends on the template existing, which it will by week 3.

---

## 6. Risks, ranked

**1. The 25-wallet definition.** The only item outside your control, and it swings
Milestone 2 from 96% to 25%. Already raised in the reply. This is where negotiating
capital should go, and nowhere else.

**2. Per-collection escrow verification.** Five of 32 surveyed contracts reference
`contract-caller` inside `transfer`, which can reject a transfer made inside
`as-contract?`. None of your five candidates is among them, but each needs one test
transfer before you name it publicly. Cheap to check, awkward to discover late.

**3. `finalize-canonical` is irreversible.** A wrong hash freezes a token out of
preservation permanently. Verify the full seeded set against the harvest before freezing,
not a sample. This is a discipline risk rather than a schedule risk.

**4. Publishing an unverified claim.** The four documents contain figures the README
already flags as unchecked. Publishing one under a grant deliverable raises the cost of
being wrong from embarrassing to reportable.

**5. The Clarity 4 Clarinet manifest.** Unmeasured, and it gates your test suite. It does
not gate their acceptance criteria. Spike it early anyway.

**6. Schedule concentration.** Milestone 2's work is mostly one build. If the deployer
takes twice the estimate it still fits, but there is less parallel work to absorb a
surprise than in Milestone 1.

---

## 7. Stress test

**If the harvester takes three times the estimate**, 9 days instead of 3, Milestone 1
still lands with roughly two weeks to spare.

**If the deployer takes twice the estimate**, 16 days instead of 8, Milestone 2 still
fits inside 30 working days.

**If one candidate collection fails its escrow check**, four alternatives are already
measured and characterised.

**If the Clarity 4 Clarinet manifest cannot be made to work**, testing moves to testnet
and mainnet directly. Slower, but their criteria never asked for simnet tests.

**If the 25-wallet metric is read as raw custody**, Milestone 2 probably fails regardless
of everything else in this document. That is the only scenario where good execution does
not save it.

---

## 8. Bottom line

Milestone 1 needs about 14 to 20 days and has 40. Its headline deliverable is already
live. Confidence: **high, above 90%.**

Milestone 2 needs about 9 to 13 days and has 30, concentrated in one build that follows
an existing, shipped pattern. Confidence: **high, above 90%, conditional entirely on the
wallet definition.**

The thresholds they proposed are fair, and unusually for adoption targets, almost all of
them sit inside your control. Answer their question with a straight yes, subject to the
wallet metric being defined as resolved ownership.
