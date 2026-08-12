# Forever Twins: Project Blueprint

**Stacks Community DeGrants, Cohort 4. $5,000 awarded 5 August 2026.**
Grantee: Jim Crane (@jimdotbtc, @XtrataLayers). Steward: mrwagmi.btc.
Proposed delivery window: 12 weeks, week commencing Monday 17 August 2026 to Sunday 8 November 2026.

---

## 1. What this is and why it matters

Most NFT art is not on chain. The token is. The picture is a link, and the link points at IPFS or at somebody's server. When the pinning bill goes unpaid the token survives and the art does not. The holder is left owning a receipt for something that no longer exists. This has already happened on every chain and it is happening quietly to Stacks collections now.

Forever Twins fixes that without asking anyone to give anything up. A collection gets a permanent fully on-chain twin, inscribed on Bitcoin through Stacks using Xtrata's live mainnet data layer. The original NFT is never modified. Every twin is hash verified against the source art, so preservation is provably faithful rather than a copy that merely looks right. Ownership of the twin binds to the real owner of the original.

The reason this belongs on Stacks and nowhere else is settlement. The artwork ends up on Bitcoin, which is the only durability story that does not depend on somebody continuing to pay a hosting bill. Preservation is also a reason for a collection to arrive on Stacks that has nothing to do with price, and it works on collections that are not native to Stacks at all.

Three collections are already live: Bitcoin Pepes, LEO Cats and Miami Degens. Those were built with Rapha of Fak.fun as third-party contracts. Bitcoin Pepes is fully preserved. LEO Cats stands at roughly 100 tokens and Miami Degens at one. That is the honest state of it. This grant turns a working proof into public infrastructure that other people can use without me in the room.

I have built on Stacks for six years, entirely self funded. This is the first grant I have taken.

---

## 2. Milestone plan

Two milestones, matching the cohort structure: the first demonstrates concrete delivery, the second demonstrates real-world impact. Plus one internal checkpoint at week 4 that carries no payment and is reported as a Progress Update, because the riskiest engineering happens first and I want it visible early.

Every completion criterion below is an artefact that either exists or does not. A reviewer should be able to open a link, a contract id or a transaction and answer yes or no without asking me anything.

---

### Week 4 checkpoint: tooling proven and open sourced

**Not a milestone. Reported as a Progress Update, due Sunday 13 September 2026.**

**Delivered**

- `xtrata-forever-twin-v1.clar`, a twin contract template generalised from the live production helper. Source collection, asset name and fee are substitution slots. The fee is a hard-coded constant, not an owner-settable variable.
- A prior-binding guard, so one token can never end up bound to two different twins.
- A Clarinet test suite covering the escrow invariant (exactly one side of the pair is liquid at any moment), rejection of non-canonical bytes, and fee routing.
- A hash harvester command line tool. Point it at a Stacks collection and it reads the token URIs, fetches each asset, computes the Xtrata hash chain, writes a canonical manifest and emits the seeding transactions.
- A published list of the metadata and URI patterns the harvester supports, and the ones it does not.

**Evidence of completion**

1. Public repository URL and commit hash holding the template, the tests and the harvester, with an open licence file in the root. The original Fak.fun helper contracts are credited in that repository as the prior art the template generalises.
2. Test suite green in CI at that commit.
3. A correctness proof, not a claim. Harvester output for Bitcoin Pepes reproduces the canonical hashes already seeded on chain, byte exact, across all 2,089 tokens. Published as a diff report showing zero mismatches. Anyone can rerun it.
4. A testnet twin contract id that has been through the full lifecycle: seed, finalise, inscribe, swap out, swap back.

**Why this is first, and why it is not a milestone.** Reading art out of an arbitrary collection is the hardest engineering in the grant and everything downstream waits on it. There is no standard for where NFT art lives. Bitcoin Pepes is the only test where the right answer is already on chain, so it is the only rigorous proof available, and it costs nothing. If this takes four weeks instead of two I want to know that in September with eight weeks left, not in October with two. It is a checkpoint rather than a milestone because it is infrastructure, not something a member of the public can use yet.

---

### Milestone 1: Delivery. The preservation service, registry and documentation are live

**Due end of week 8, Sunday 11 October 2026.**

**Delivered**

- A public preservation service, live on mainnet, where a collection's twin contract can be found, verified against the published template, and used to inscribe a twin.
- A public preservation registry. One row per collection: source contract, twin contract, tokens preserved, whether the canonical set is finalised, deployed source hash, and whether that hash matches the published template.
- **At least two collections beyond the three already live**, on Xtrata-native contracts generated from the template, with their canonical hash sets seeded and finalised and at least one twin inscribed on chain each. Selection is by evidence of fragile art hosting, and that evidence is recorded in the registry. I expect to beat two. Two is the number I commit to unilaterally.
- Successor twin contracts for LEO Cats and Miami Degens, seeded and finalised. `finalize-canonical` has never been called on either existing helper, so today neither collection can honestly claim a frozen canonical set. This makes that claim true and checkable.
- Four long-form documents, fact verified against live contract state and published: the state of link rot in 2026, a verify-it-yourself guide, a repoint-your-collection playbook, and the Bitcoin Pepes case study. Every collection named as at risk is named with a reproducible check a reader can run.
- A "preserve your collection" how-to and onboarding docs, written from a real run rather than from theory.
- Live counters instrumented from this date rather than reconstructed at the end: collections preserved, twins minted, distinct wallets holding a twin, contracts deployed through the tool.

**Evidence of completion**

1. Registry URL, live, listing every collection with its twin contract id and its template verification status.
2. Mainnet contract id, finalise transaction id and at least one inscription transaction id for each of the two or more new collections.
3. Mainnet contract id and finalise transaction id for the LEO Cats and Miami Degens successors.
4. Six published document URLs (four long form, the how-to, the onboarding docs).
5. Public repository URL with a licence file covering the template, the harvester and the registry.

**Two definitions, stated now rather than argued in November.**

*Preservation of a collection* means the twin contract is live and the canonical hash set is fixed. It does not mean every token has been claimed. Claiming is the holder's choice and cannot be compelled by anybody.

*No founder's permission is required.* Inscribing is permissionless in the contract, and only the owner of an original can ever swap. A twin can therefore be created without the source project agreeing to anything, and it still binds to the real owner. Founders are notified as a courtesy and offered ownership of the registry entry. The plan does not depend on them replying.

**How the hard-coded fee is really enforced.** The escrow uses Clarity's `as-contract?` with `with-nft`, and an NFT asset name must be a compile-time literal. So a single factory contract is not possible. Each collection needs its own contract, deployed from the user's own wallet, which means anyone could edit the fee before deploying. Enforcement therefore moves to the registry. The registry compares the deployed source hash against the published template automatically and lists only exact matches. Edit the fee and you get a contract that works but is unlisted, unverified and shown nowhere. This is stronger than a promise about a constant, and it gives the educational material something concrete to teach.

---

### Milestone 2: Impact. Self-serve deployer public, access widened, and art demonstrably saved

**Due end of week 12, Sunday 8 November 2026.**

This is the impact milestone, so it has to show that somebody actually used or benefited from the work. The beneficiaries here are the collections and the holders whose artwork is now on Bitcoin instead of on a server somebody stopped paying for. That benefit is real, on chain, and verifiable, and it does not require a stranger to volunteer.

**Delivered**

- A public deployer at a stated URL. From it, any wallet can generate a Forever Twins contract for a Stacks collection, deploy it from their own wallet, seed the canonical hashes and finalise the set, with no action from me at any point. I hold no key in the process.
- An automatically generated claim page at a predictable URL for every contract listed in the registry.
- A payment and access path that removes the requirement to hold STX, described in section 4 below.
- A public metrics page reporting collections preserved, contracts deployed through the self-serve tool, distinct wallets holding a Forever Twin, and mint transaction count, updated from chain state.
- A public recap post covering what shipped, what changed and why, and what the fee revenue sustains after the grant ends.

**Evidence of completion**

1. Deployer URL, public and working.
2. A mainnet twin contract id generated and deployed end to end through the tool, with its deploy transaction id.
3. One mainnet preservation completed by a wallet that held no STX at the time, with the transaction id.
4. Metrics page URL, live and accurate.
5. Public recap post URL.

**Evidence that the work was used and benefited someone**

6. A preservation ledger: every piece of at-risk artwork saved with grant money, with its transaction id, the collection it belongs to, and the holder it now binds to. These are people who get their art preserved without having to turn up for it.
7. A published measurement of how much Stacks NFT artwork is already unreachable, produced as a by-product of running the harvester across the prospect list. Nobody has measured this. It is a public good on its own and it is the clearest possible statement of why this work mattered.
8. Every deployment, twin and wallet recorded on the metrics page, including any carried out by people other than me, each with a transaction id.
9. Community response captured as it happens, including from the collections onboarded.

**Self-serve, defined.** A collection owner can complete the whole process unaided from a public tool, by running the harvester, reviewing the generated manifest, and signing a sequence of transactions from their own wallet. Canonical hashes seed 200 at a time, so a 2,000 token collection is roughly one deploy, eleven seeds and one finalise. That is self-serve. It is not one click and it is not zero technical skill, and I would rather define it in August than argue about it in November.

**Staged opening.** The deployer opens to an allow list first and goes fully public after three clean deployments. Strangers deploying escrow contracts generated by my codegen, against collections I do not control, with my name on the registry, is a surface worth managing deliberately. This is a plan, not a retreat, which is why it is written down now.

**On the numbers.** Completion of the metrics deliverable is the page being live and accurate. The values it reports are outcomes, not commitments. I will report deployments carried out by people other than me, with transaction ids, in the impact report. I will not make somebody else's decision a condition of my own milestone.

---

## 3. Timeline

Twelve weeks from the week commencing Monday 17 August 2026, matching the approved application.

**These dates are ceilings, not targets.** If a milestone is complete earlier I will file it earlier, and I would rather commit to dates I can hold than to dates that need revising. The week 4 checkpoint exists so that the riskiest engineering is either proven or visibly in trouble by mid-September, with eight weeks still in hand.

| Week | Commencing | Focus | Milestone |
|---|---|---|---|
| 0 | before start | Steward questions agreed. Rapha conversation on licence, credit and the 50/50 split. Prospect collections harvested and hashed immediately. Unverified public claims cleared. | |
| 1 | Mon 17 Aug | Template contract written against the current core. | |
| 2 | Mon 24 Aug | Harvester built. Bitcoin Pepes replay proof run. | |
| 3 | Mon 31 Aug | Testnet lifecycle end to end. Clarinet suite finished. | |
| 4 | Mon 7 Sep | Repository published with licence. Diff report published. | *Checkpoint, Sun 13 Sep* |
| 5 | Mon 14 Sep | Registry data model. Template source hash verification. Counters instrumented. | |
| 6 | Mon 21 Sep | Documents fact checked against live contract state and published. How-to written from a real run. | |
| 7 | Mon 28 Sep | LEO Cats and Miami Degens successor contracts. Seed and finalise. | |
| 8 | Mon 5 Oct | Cohort collections deployed, seeded, finalised, first twins inscribed. Service live. | **Milestone 1 due Sun 11 Oct** |
| 9 | Mon 12 Oct | Deployer built on top of the week 1 to 4 tooling. Codegen and review step. | |
| 10 | Mon 19 Oct | Claim page generation. Allow-listed deployments. | |
| 11 | Mon 26 Oct | Access path. Sponsorship. Preservation fund spent on absent-holder inscriptions. | |
| 12 | Mon 2 Nov | Deployer fully public. Metrics published. Recap posted. Impact report submitted. | **Milestone 2 due Sun 8 Nov** |

---

## 4. Two proposed refinements, for your approval

The pitch set the direction. The blueprint sets the measurements. Two places where building against the code has taught me something that changes the right answer. I am raising both now rather than quietly delivering something different in November.

### 4.1 Sponsorship instead of USDCx

The pitch offered optional USDCx and sBTC payment alongside STX, framed as widening access. Having gone through the code properly, that framing is weaker than it sounded. The service fee can accept another asset, but the inscription fee paid to the Xtrata core is STX in code, in a part of the flow this grant does not change. So a user paying the service fee in USDCx would still need STX in their wallet to inscribe. Adding a second way to pay one of two fees does not widen access.

What removes the barrier is **sponsorship**, where somebody else covers the network cost and the user needs no STX at all. I already run sponsor relayer infrastructure in this repository. Alongside it, **passkey wallets** remove the seed phrase, and Rapha has already written a 29-line smart-wallet extension (`SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.xtrata-inscribe`) that lets a passkey wallet inscribe with no seed phrase at all. Passkey Hot Wallet is a funded Cohort 4 sibling and I already have a working relationship and a collaboration plan with that team.

**What I propose.** Deliver sBTC for the service fee, because it is real and it is the on-brand Bitcoin story, and put the remaining effort from that budget line into sponsorship so a user genuinely needs nothing but a wallet. Defer USDCx and say so publicly in the recap rather than dropping it quietly. Same budget line, same goal, and it is the difference between a second way to pay and genuinely not needing STX.

The milestone 2 completion criterion reflects this: one mainnet preservation by a wallet holding no STX. That single transaction proves the accessibility goal in a way a USDCx checkout button never could.

The passkey collaboration is upside and is deliberately **not** a milestone gate. It depends on another team's timeline and it would be wrong to hold this grant's completion against their schedule.

If you would rather I deliver the payment rails exactly as pitched, say so and I will.

### 4.2 A preservation fund inside the onboarding line

The collections most worth rescuing are the ones whose holders walked away years ago. So "the holder pays a small fee to preserve their own twin" has a hole in the middle of it.

Inscribing is permissionless in the contract and only the owner can ever swap. So a patron can pay to preserve art on behalf of an absent holder, and the twin still binds correctly to the real owner. Nothing is taken from anybody and nothing needs anybody's consent.

I propose reserving part of the onboarding budget as a preservation fund that pays the on-chain cost of preserving art for holders who are no longer around. Every transaction paid from it will be published. This turns "a drive to preserve at-risk collections" from a phrase into transactions you can click on.

---

## 5. Budget

The three approved lines, restated by outcome.

**$2,500 development and tooling**

- The twin contract template, the Clarinet suite and the prior-binding guard.
- The hash harvester and the Bitcoin Pepes replay proof that shows it is correct. This is the largest single item and the hardest engineering in the grant.
- The registry, including automatic template source-hash verification and the counter instrumentation that makes the final report checkable.
- The deployer: code generation, the manifest review step, and the deploy, seed and finalise flow from the user's own wallet.

**$1,500 access and onboarding**

- Removing the requirement to hold STX: the sBTC service fee path and its post conditions, and the sponsorship path.
- Cohort onboarding across weeks 5 to 8, including the deployment costs of collections that would not otherwise arrive.
- A preservation fund, roughly a third of this line, covering the on-chain cost of preserving art for collections whose holders are no longer active. Published as a ledger.

**$1,000 educational content and docs**

- Fact verification and publication of the four long-form documents. These are drafted already, so the money buys checking every claim against live contract state before anything goes out under a grant deliverable. Publishing an unverified number is cheap to do and expensive to be wrong about.
- The preserve-your-collection how-to and the onboarding docs.
- The verification guide, the repository docs and licence, and the public recap.

### A request on payment timing

The panel releases $1,000 on blueprint approval and $4,000 after the final impact report is approved. That leaves roughly eleven of the twelve weeks self funded, with two real deliverables landing before anything is paid against them.

I will do the work either way. I have funded six years of Stacks work myself and this is the first grant I have taken. But the blueprint is the moment to ask rather than after, so two questions.

1. **Can the $4,000 be split to match the delivery**, for example $2,000 on milestone 1 and $2,000 on the final impact report? The official DeGrant project template carries upfront money plus separately priced milestones, so I do not think this is an unusual shape. If the answer is no, that is fine and nothing changes. If the answer is no that is fine and nothing changes, and I would rather agree it now than restructure later.
2. **What asset is the $5,000 paid in, and at what conversion?** Twelve weeks is a long time for that to move.

Neither blocks starting.

---

## 6. Dependencies

One dependency is worth naming plainly rather than discovering at milestone review.

The Xtrata core these contracts mint through is being superseded from `xtrata-v3-2-3` to `xtrata-v3-2-4`. That is separate work with its own 26-step deployment canary and an audited readiness report, and the grant does not pay for it. Twin contracts pin the core as a Clarity constant, which can never be changed after deployment, so LEO Cats and Miami Degens need successor contracts rather than an upgrade. That is why week 7 exists in the timeline.

**Why this is a dependency and not a blocker.** Every function the twin contracts call is unchanged between the two versions. The upgrade is additive. Everything in the new contracts except one constant line can be written and tested against the current core before the new one is live, so the ordering risk is a redeploy rather than a rewrite. If the cutover slips past week 7, milestone 1 delivers the new collections on the current core and the successors follow behind, and I will file a Risk update at the time rather than at the end.

**There is a direct upside.** v3.2.4 raises the inscription size cap from 2,048 to 8,192 chunks, which is 128 MiB. That is a fourfold increase in what artwork can be preserved, and it lands inside the grant window.

**Existing twins must not be migrated, and holders will be told.** A twin sitting in escrow is owned by the helper contract, and there is no sequence of transactions that migrates it while it stays bound to its original. A holder who swaps out, migrates, then tries to swap back would break their own pairing permanently. Existing twins stay on v3.2.3, where they work exactly as they do today. A clear "do not migrate your twin" warning goes on the claim pages and in the docs before the cutover. Custody is safe unconditionally. This is a communications obligation and it is not optional.

---

## 7. Risks

**1. The harvester may be harder than two weeks.** Collections store metadata inconsistently, gateways fail, file sizes vary wildly, and some links are already dead. This is unbounded work if I promise it handles everything, so I am not promising that. Managed by building it first, in weeks 1 and 2, proving it against a collection whose correct hashes are already on chain, and publishing the list of supported patterns. An unsupported pattern gets named, not hidden.

**2. Art decays while you plan.** You cannot preserve a dead link. A collection whose pinning lapses in September is not rescuable in October. Managed by harvesting and hashing every prospect collection in week 0, before anything is built, whether or not anyone has agreed to anything. Storage is nearly free and a hashed archive is itself a preservation act.

**3. Unverified public claims.** Existing campaign material carries claim counts, promotional terms and URLs that have not been checked against live contract state. Publishing those under a grant deliverable raises the cost of being wrong from embarrassing to reportable. Managed by clearing that list in week 0.

**4. The partnership.** This grant funds an in-house version of contracts that Rapha at Fak.fun built with me, and the template generalises his work. Managed by talking to him before anything is submitted or announced, agreeing the licence and the credit, listing his three contracts in the registry as the originals with Fak.fun credited, and keeping the payout split on the successor contracts at 50/50 with him, hard coded, exactly as it is today.

**5. Solo delivery.** I am one person. Managed by scheduling the riskiest item first, by keeping the milestone count at three, and by making sure nothing in the plan is bottlenecked on another person. The successor contracts need no permission from Rapha or from any source collection. The cohort needs no founder to say yes.

**6. Cash flow.** Covered in section 5. Managed by asking now and by pacing the twelve weeks on the assumption that the answer is no.

---

## 8. Out of scope

Stated up front so that nobody has to guess in November.

- Forever Twins does not modify the original NFT in any way.
- It does not guarantee that any particular collection participates. Participation is not required for preservation, and it is not promised.
- It does not support every metadata pattern on Stacks. The supported patterns are published and the unsupported ones are named.
- Preservation of a collection does not mean every token in it has been claimed. Claiming is the holder's choice.
- A one-click experience for a non-technical user is not in scope. Self-serve is defined in milestone 2.
- USDCx payment is proposed for deferral, with reasoning, in section 4.1.
- No adoption number is promised. Numbers are reported, not committed to.

---

## 9. How progress will be reported

A running grant log lives in the public repository and is appended weekly with dates, transaction ids, links and numbers. Evidence is captured as it happens rather than reconstructed in November, because that is how impact reports end up vague. Screenshots of community response are taken at the time, because threads get deleted.

Mapped to the panel's six update types.

**Progress Update.** Fortnightly at minimum and at every milestone close. What shipped, with transaction ids and public URLs, and which milestone it advances. No prose.

**Impact Update.** At both milestones. Numbers only: collections preserved, tokens preserved, self-deployments, distinct wallets holding a Forever Twin, mint transactions, plus the preservation fund ledger showing which at-risk art was saved with grant money and for whom.

**Learning Update.** At least twice. Week 4 covers what the Bitcoin Pepes replay proof taught about how Stacks collections actually store art, including which gateways fail and how much of the ecosystem's art is already partly unreachable. Nobody has measured that and it is a public good on its own. Week 9 covers what onboarding real at-risk collections taught.

**Risk / Blocker Update.** Filed within one working day of anything that moves a milestone date, naming the milestone and the new date. The core cutover dependency in section 6 will be filed as a Risk update in the first fortnight, on the record early rather than late. The risks in section 7 are declared in advance so a blocker update is news rather than a surprise.

**Next Steps Update.** At each milestone close, stating what the next block of weeks contains and anything I need from the steward or the ecosystem.

**All Milestones Complete Update.** Week 12, filed with the final impact report and a complete evidence pack: every contract id, every transaction id, every public URL, the metrics, the recap, and a plain account of what was delivered as promised, what changed and why, and what was not done.

---

## 10. What success looks like in November

A public registry of collections whose art is on Bitcoin permanently, verifiable by anyone. A tool anyone can run without asking me. Art that would otherwise have gone quiet in 2027, saved in 2026, some of it paid for by this grant on behalf of people who were not there to ask. And a reason for collections to come to Stacks that has nothing to do with price.
