# Blueprint decisions memo

Companion to `BLUEPRINT-SUBMISSION.md`. Not for the steward. This is the reasoning behind every choice in the submission, what Jim still has to decide, and what to ask before pressing submit.

---

## The one mechanic that drove every decision

The panel says the $4,000 is "Locked until all milestones are completed". That is an AND gate, not a progress bar. Every milestone is a separate way for somebody to hold 80% of the money, and no extra milestone adds a single dollar.

So the blueprint aims at **minimum honest surface area**. Three milestones. Every completion criterion is an artefact that exists or does not. Nothing depends on a stranger saying yes.

The pitch listed eleven deliverables. All eleven are still in the blueprint. Only seven of them are completion criteria, and the rest are reported evidence.

---

## Milestone structure: why three

The pitch had two milestones, at weeks 6 and 12. Cohort 4 was designed as delivery then impact. Draft A proposed four milestones, Draft B proposed five. Three is the answer.

- **Fewer than three** puts the harvester (the hardest, riskiest engineering) inside a single week-6 delivery gate with no early checkpoint. A slip there is invisible until it is fatal.
- **More than three** adds veto points that carry no money.
- Three gives one early technical checkpoint that de-risks the whole plan, one delivery milestone matching the public Cohort 4 description, and one impact milestone matching the payment.

The milestones are:

1. **Tooling proven and open sourced**, end of week 4, Sunday 13 September 2026.
2. **The preservation service, registry and documentation are live**, end of week 8, Sunday 11 October 2026.
3. **Self-serve deployer public, access widened, and the public record**, end of week 12, Sunday 8 November 2026.

Milestone 2 moved from week 6 to week 8. Reason: week 7 is the successor helper contracts for LEO Cats and Miami Degens, which is real engineering that scores zero against the cohort deliverable. Squeezing it into six weeks alongside the registry and the docs was the least honest thing in either draft.

**Contingency already written into the submission.** Section 5 says that if the steward will not split the payment, milestone 2 folds into a Progress Update. A formal gate with no money attached is pure downside. That sentence is deliberate. It makes the split question consequential rather than a favour to be granted.

---

## What changed from the pitch, and why

Nothing approved was dropped silently. Every change is flagged inside the submission itself, in section 4 or section 8.

### 1. USDCx is proposed for deferral, replaced by sponsorship

**The pitch said:** optional USDCx and sBTC alongside STX, framed as widening access.

**What the code says:** the inscription fee paid to the Xtrata core is STX in code, in a part of the flow this grant does not change. A user paying the service fee in USDCx still needs STX to inscribe. The accessibility claim is false as pitched.

**What the blueprint says:** ship sBTC for the service fee, put the rest of that budget line into sponsorship, defer USDCx and say so publicly.

**Why this framing.** It is proposed for approval, not announced. The closing line "If you would rather I deliver the payment rails exactly as pitched, say so and I will" is load-bearing. It makes the refinement a choice the steward gets to make, which removes the whole "grantee quietly reduced scope" reading.

**The milestone criterion is one transaction:** a mainnet preservation completed by a wallet that held no STX. That is binary, it is inside Jim's control, and it proves the goal in a way a checkout button never could. sBTC work is funded and reported but is not a second binary gate. One accessibility artefact beats two.

**Passkey collaboration is upside, explicitly not a gate.** Named in the submission because it is genuinely good (two Cohort 4 grants compounding) and because naming it protects against later criticism that the obvious collaboration was missed. But it depends on DeOrganized's timeline, so it never touches a completion criterion.

### 2. "A first cohort" became "at least two"

**The pitch said:** a first cohort of at-risk collections preserved. No number, no test for "at risk", no threshold for "preserved".

**Why that is dangerous:** the strict reading of "preserved" is every token has a twin. Applied to Jim's own three live collections, that fails on two of them today. LEO Cats is at roughly 100, Miami Degens at one, and `finalize-canonical` has never been called on either.

**The blueprint says:** at least two beyond the three already live, with a stated definition. Preservation means the twin contract is live and the canonical set is fixed, not that every token has been claimed. Both drafts said four. The floor is two because a floor is a floor, and the submission says plainly "I expect to beat two. Two is the number I commit to unilaterally."

**The decisive unlock:** inscribing is permissionless. No founder consent is needed. That sentence is in the submission because it converts the cohort from a recruitment problem into an engineering problem Jim controls. It also defuses the "you preserved my collection without asking" story before anyone else tells it, by stating that founders are notified and offered the registry entry.

### 3. "No need for me to be in the loop" is gone

**Why it had to go:** it contradicts the architecture. Fee enforcement is registry verification. If a human checks the hash before listing, Jim is in the loop permanently by design.

**The fix, and it is a feature:** the registry compares the deployed source hash to the published template **automatically** and lists only exact matches. That makes the phrase true and turns a contradiction into something the educational content can teach.

**Self-serve is now defined explicitly:** run the harvester, review the manifest, sign roughly one deploy, eleven seeds and one finalise for a 2,000 token collection. Not one click. Defined in August rather than argued in November.

### 4. Third-party deployment moved out of the milestone gate

`GRANT-DECISIONS.md` section 7 proposed defining self-serve as "demonstrated by at least one deployment by someone other than the grantee". As evidence that is excellent. As a completion criterion it hands one unnamed stranger a veto over $4,000.

It is now reported in the impact report. Jim should still privately line somebody up in week 0 by name. Rapha, mrwagmi, or the DeOrganized team are all plausible and all already in orbit.

### 5. Adoption metrics: reporting, not achieving

The pitch said "adoption metrics" with no floor, which invites a reviewer to supply their own floor. The blueprint says completion is the page being live and accurate, and "the values it reports are outcomes, not commitments". Draft A's phrasing, kept verbatim. It is the single most protective sentence in the document.

Also moved: instrumentation lands in week 5, not week 11. Reconstructing chain history in week 12 is a week of work nobody budgets for.

### 6. Additions that were in neither the pitch nor the panel

- **An out-of-scope section.** Free protection. Seven lines, all of them things a hostile reviewer could otherwise assert.
- **A dependencies section** naming the v3.2.4 cutover, framed as a dependency and not a blocker, with the 128 MiB cap raise as a concrete upside inside the grant window.
- **The "do not migrate your twin" communications obligation**, stated as an obligation rather than a milestone.
- **Staged opening of the deployer**, allow list first, public after three clean deployments. Written down now so it is a plan, not a retreat.
- **The preservation fund** as a named budget item rather than an unbudgeted improvisation.
- **A week 0 row in the timeline**, which is where the steward questions, the Rapha conversation, the prospect harvest and the unverified-claims clearance all live.

---

## Where the two drafts disagreed, and what was chosen

| Question | Draft A | Draft B | Chosen | Reason |
|---|---|---|---|---|
| Milestone count | 4 | 5 | **3** | Every milestone is a veto point that carries no money |
| Cohort size | 4 collections | 4 collections | **at least 2** | A floor you beat is better than a target you miss |
| Third-party deployment | reported only | milestone gate with testnet fallback | **reported only** | A fallback is still a stranger's decision inside a gate |
| Opening framing | defensive summary | mission and why-Stacks | **mission** | Stewards score relevance and ecosystem impact. Draft B's opening is stronger and costs nothing |
| Delivery milestone date | week 6 | week 6 | **week 8** | Week 7 is the successor contracts, which score zero against the cohort |
| sBTC as a gate | yes | yes | **no** | The no-STX transaction proves the goal. Two binary gates for one outcome is bad trade |
| 100 twins inscribed | committed | not committed | **not committed** | A number is a promise about other people's behaviour |
| Budget detail | by line | itemised to the dollar | **by outcome** | Itemising to the dollar invites line-by-line audit of a $5,000 grant |

---

## What Jim must decide before submitting

Six things. None can be decided by research.

1. **The start date.** The blueprint is anchored to Monday 17 August 2026. If the clock does not start then, every date in section 3 moves and the table must be regenerated. Do not submit until the anchor is confirmed.

2. **Whether to submit the payment split request inside the blueprint or ask first.** The submission contains it in section 5. That is the recommendation, because it is on the record and it is a normal shape. But if Jim would rather ask informally first and then submit a clean blueprint, delete section 5's "A request on payment timing" and send the message below instead. Do not do both.

3. **Whether the fallback sentence stays.** Section 5 says that if the split is refused, milestone 2 folds into a Progress Update. That is honest and it gives the steward a reason to say yes. It also signals a willingness to restructure, which some readers dislike. Recommendation: keep it. It is the only thing that makes the ask consequential.

4. **The Rapha conversation must happen before submission, not before announcement.** Until question 5 to the steward is answered, treat the blueprint as potentially public. It names his contract address, credits Fak.fun, commits to open sourcing a template generalised from his code, and states the 50/50 split. He should hear all of that from Jim. The version where he reads it somewhere else is the only version that goes badly.

5. **Whether the floor is two or three collections.** Two is written. Three is defensible if the week 0 harvest goes well and the prospect list firms up. Do not raise it above three under any circumstances.

6. **KYC.** Verified 2026-08-12 against <https://stacksendowment.co/blog/degrants-cohort-4-now-open>, which states: "Selected grantees must be willing and able to complete individual KYC before payment can be processed." Note this is the applications post, not the results post at `/blog/degrants-cohort-4`, which does not mention KYC at all. Nothing in the grant panel mentions it either. It gates the $1,000. Start it now, in parallel with the blueprint, not after approval.

7. **The cohort requires exactly two milestones, and the second must show impact.** Same source: "Each funded project requires two specific milestones." The first demonstrates concrete delivery, for example a live tool or published content. The second measures real-world impact through metrics such as user numbers, engagement or community feedback, proving somebody actually used or benefited from the work.

   The blueprint was restructured to match. What was milestone 1 (tooling proven) is now a week 4 checkpoint reported as a Progress Update, carrying no payment. Delivery is milestone 1 at week 8. Impact is milestone 2 at week 12.

   This creates one real tension with the defensive strategy. "No adoption number is promised" is sound, but a milestone that measures nothing would not satisfy the stated requirement. The resolution is to be precise about who the beneficiary is. The people who benefit are the collections and holders whose artwork is now on Bitcoin, and that benefit is deliverable unilaterally through the preservation fund. Specific adoption numbers stay uncommitted. Evidence that the work was used and benefited someone does not.

---

## What to raise with the steward

Nine questions. The first four should be answered before the blueprint is final, because the answers change what is written. The rest can follow.

**Before submitting**

1. **Is there a blueprint template or required field list?** The format is not documented publicly anywhere. No example blueprint from any grantee of any cohort exists in public. Ask rather than guess, and be ready for the answer to be "just fill in the form".
2. **Can the $4,000 be split?** See the phrasing below.
3. **Are milestones editable after blueprint approval, or frozen?** This is the highest-value unasked question in the whole process. If milestones can be revised through the Risk / Blocker channel, slightly more ambition is affordable. If they cannot, every word is permanent. Nobody has asked it.
4. **Is the blueprint published publicly, or visible only to stewards and admins?** Changes how much to say about Rapha, contract addresses and unshipped work. Until answered, assume public.

**Can follow**

5. **Must milestone amounts total exactly $5,000, and is upfront money available?** The only supporting evidence for a sum-to-total rule is a retired 2021 Grant.io constraint. It may or may not persist.
6. **When does the twelve week clock start, and has it started?**
7. **Who is the approving steward and who is the admin?** Payment needs both signatures under the documented flow. Is mrwagmi.btc both, or only the steward?
8. **What evidence format satisfies the impact milestone?** Metrics dashboard, written report, on-chain query, or a public recap post. The blueprint offers all four, which is safe but ask anyway.
9. **What is the KYC process and lead time?**

### How to phrase the payment split ask

Send this before or alongside submission. The frame is that the pitch set the direction and the blueprint sets the measurements, which is what a blueprint stage is for. This is not a walk-back.

> Before I submit the blueprint I want to agree a few things, so that what I am measured against in November is the same thing we both think I am building.
>
> On money. The pitch had a real deliverable landing before the end and the panel has no payment against it, so about eleven of the twelve weeks are self funded. Can the $4,000 be split to match the milestones, say $2,000 at milestone 2 and $2,000 on the final report. The official DeGrant project template has upfront money plus separately priced milestones, so I do not think this is unusual. If the answer is no that is fine, I will fold that milestone into a progress update rather than leave a gate with no payment attached. Also, what asset is the $5,000 paid in and at what rate, and does the twelve week clock start at blueprint approval or at first payment.
>
> On process. Can milestones be revised after the blueprint is approved if something in the plan turns out differently, and is that what the Risk or Blocker update is for. And is the blueprint visible publicly or only to you and the admins.
>
> On one deliverable. The pitch offered USDCx and sBTC payment to widen access. Having built against the code, that does not achieve the goal. The inscription fee paid to the core contract is STX regardless, so a user paying in USDCx still needs STX. What actually removes the barrier is a sponsored transaction, where somebody else covers the network cost and the user needs no STX at all. I already have sponsor infrastructure running. I would like to deliver sBTC for the service fee plus sponsorship for the network cost, and defer USDCx. Same budget line, same goal, and it is the difference between a second way to pay and genuinely not needing STX. Happy to do it as pitched if you would rather.
>
> One more thing, so it is on the record early rather than late. The Xtrata core these contracts mint through is being superseded in the same window. Existing twins are safe and holders are unaffected, but new collections need contracts on the new core. I can write and test everything except one line before that lands, so it is a dependency rather than a blocker. I would rather you heard it now than in week ten.

File that last paragraph again as a formal Risk / Blocker Update in the first fortnight. A dependency logged in week 1 is diligence. The same dependency raised in week 10 is an excuse.

---

## Open questions the research could not resolve

Stated plainly so nobody assumes these were checked.

- **The "Project Blueprint" format is undocumented.** The exact phrase returns nothing on stacksendowment.co, degrants.xyz, zeroauthoritydao.com or docs.zeroauthority.xyz. It appears to be a Cohort 4 platform stage with no public spec. The submission is written as a self-contained document with clear headings so it can be pasted into whatever fields exist, or attached whole.
- **No published example blueprint exists from any grantee of any cohort.**
- **No public statement on whether payment splits are negotiable at blueprint stage.** Nothing confirms or denies it. The precedent cited (upfront plus three priced milestones) is real but comes from the SIP-31 interim programme and the official DeGrant issue template, not from Cohort 4 itself.
- **The six Add Project Update types are not documented publicly.** Section 9 maps to them from the panel UI only.
- **No Cohort 4 steward names or rubric document are public.**
- **Whether the delivery milestone genuinely carries no money.** This is inferred from the panel showing only two payments. High confidence, but it is an inference. If the steward says the delivery milestone does carry a payment, question 2 answers itself.
- **Whether the published Cohort 4 description or the full original pitch is the yardstick.** The public post lists only deployer, registry, docs and at-risk preservation. It omits USDCx, sBTC, claim pages and adoption metrics. The blueprint covers everything in the pitch anyway, so this only matters if a scope argument starts.

---

## Week zero, in order

1. Ask the steward questions 1 to 4. Nothing else goes first.
2. Talk to Rapha. Licence, credit, the 50/50 on successors, and the fact that the template generalises his contract.
3. Start KYC.
4. Harvest and hash the art of all five prospect collections plus Miami Degens. It costs a day and it decays if you wait.
5. Fill in `data/founder-prospects.csv`. Five rows of TBC is not a pipeline. Contract addresses and media storage type at minimum.
6. Clear the nine unverified claims in `forever-twins/README.md` before any of it becomes a grant deliverable.
7. Line up a named third party who will run a deployment, privately, so the impact report has one.
