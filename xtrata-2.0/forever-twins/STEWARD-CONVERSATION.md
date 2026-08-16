# Steward conversation: payment phasing and delivery window

Prepared 12 August 2026, before the blueprint is submitted.
Counterpart: mrwagmi.btc, steward, DeGrants Cohort 4.

---

## 1. The answer

**Short version: the $1,000 / $4,000 split is not a programme rule. It is almost
certainly the portal's default skeleton, shown because the blueprint has not been
submitted yet and there are no real milestone rows to display. Nothing published
forbids a different phasing, and a Cohort 4 project under the same steward already
has three milestone rows. But no public document states the rule either way, so it
has to be asked rather than asserted.**

### DOCUMENTED

- **Two MILESTONES is a real Cohort 4 rule.** "Each funded project will have two
  milestones", delivery first, then impact
  (stacksendowment.co/blog/degrants-cohort-4-now-open).
- **Two PAYMENTS is not a rule anywhere.** No official source states a required
  split, percentage, or number of payments. The only payment-structure sentences in
  the entire corpus are permissive: "If selected, you'll receive starter funding if
  needed, or be paid by milestones" (stacksendowment.co/grants, degrants.xyz, and
  the archived DeGrants handbook, unchanged since 2024), and "Funding is released in
  stages as milestones are completed and verified" (stacks.co).
- **The grantee is expected to price the milestones.** The Endowment's own applicant
  guidance says "Two to four milestones is the right range" and "Tie each line of
  the budget to a specific milestone", and notes this "makes partial funding easier".
- **Disbursement terms are per-grant, not programme-wide.** They live in "a grant
  agreement outlining milestones and disbursement terms" which is not published. The
  old docs.degrants.xyz handbook has no payments page at all.
- **Every earlier cohort paid in three or four tranches.** The programme's own
  tracking repo (github.com/stacksgov/decentralized-grants, issues 1 to 6) publishes
  each pilot grant's split, all labelled "Kickoff payment paid":

  | Project | Structure | Payments |
  |---|---|---|
  | Community Engagement Tooling | $2,500 up front + $1,000 + $1,000 + $720 | 4 |
  | Rising Tide Protocol | $2,000 up front + $1,000 + $1,000 + $1,000 | 4 |
  | 3NS | $2,500 up front + $2,000 + $500 | 3 |
  | Stacks MixTapes | $2,500 up front + $1,250 + $1,250 | 3 |
  | Music for Science | $750 up front + $750 + $750 + $750 | 4 |
  | Golang SDK | $800 up front + $800 + $900 | 3 |

  Up-front share on the $5,000-size grants was 40 to 50 per cent.
- **The official DeGrant issue template has four payment slots**: "Upfront money:
  $xxx", "Milestone 1", "Milestone 2", "Milestone 3". This is the template Jim
  already cites in the blueprint, and citing it is safe.
- **The platform holds an arbitrary-length milestone list.** The Zero Authority
  milestone gig contract allows up to five, the alerting docs use "(e.g. 2/4)" as
  the worked example, the grantee walkthrough steps through a first, second and
  third approve cycle, and a release note records a change to support "one or
  multiple milestones seamlessly". Cohort 3 on this exact platform paid 1, 2, 3 and
  4 milestone schedules, with real `isPaid` and `paidAt` timestamps.
- **The decisive one.** The public funding page carries live grant records. Jim's
  reads `"stage":"blueprint","fundingReceived":0,"milestones":[]`. The array is
  **empty**. "Scaffold Stack" (grantee kenzman, **steward mrwagmi.btc**, $4,000,
  blueprint submitted the same day) has **three** milestones: $1,500 / $1,500 /
  $1,000, each with its own status and payment fields.
- **Payment is gated on verification, not on a calendar.** "Once a milestone is
  completed and verified by the Steward and DeGrants Administrators, the Grantee
  becomes eligible for on-chain payment", executed manually as a one-off
  "Retroactive Gig". Each payout is an independent action, so nothing caps the count.
- **Timeline is the grantee's to propose.** Applicants submit "your expected
  timeline", and the programme scores it for realism ("Feasible scope and timeline").
  No minimum or maximum project duration is published for any cohort.

### INFERRED (strong, but say it as inference)

- The three rows in the panel are a **default skeleton, not a populated schedule**.
  Jim's milestone array being empty while a same-steward peer has three rows is the
  cleanest available explanation: the rows are created from the blueprint.
- **Payments and milestones are separable, and Jim's own panel proves it.** Row 1
  pays on *blueprint approval*, which is not Milestone 1 (Delivery) under the
  documented scheme. The programme is already paying on an event that is not one of
  the two documented milestones. The payment schedule is a layer on top of the
  milestone structure, not identical to it.
- Cohort 3 published a hard "Cohort End Date" of 6 February 2026, roughly 16 weeks
  after grantees were announced. If Cohort 4 held that shape from 31 July it would
  end around late November. **This is arithmetic on a precedent, not a fact. Do not
  assert it. Ask.**

### UNKNOWN, and worth admitting

- Where the $1,000 / $4,000 numbers come from. They appear in **no** public source.
  Endowment policy, steward decision, or portal default cannot be distinguished.
- Whether Cohort 4 has an end date, and what it is.
- Turnaround from milestone submission to funds landing. Two human approvals are
  documented (steward, then admin) with no SLA and no escalation path published.
- Whether Jim's individual KYC is cleared. KYC is a documented precondition of
  payment and its latency does not shrink no matter what the schedule says.
- Whether Scaffold Stack's initial payment is additional to or carved out of its
  three milestones. Its three rows already sum to the full $4,000 award.
- The words "blueprint", "impact report" and "project complete" appear **nowhere**
  in any DeGrants or Endowment documentation. Those stage names are a Cohort 4
  platform layer with no published spec. Jim is not missing a document. The document
  does not exist. That is a reasonable thing to say out loud to the steward.

---

## 2. What to ask for

The strongest position is a specific proposal, not an open question. An open question
invites "that's how the system works". A specific proposal that breaks no published
rule invites a yes.

**The distinction that is the whole opening:** the cohort post requires two
**milestones**. It says nothing about the number of **payments**. Ask to re-phase the
disbursement while explicitly keeping the two documented milestones intact. That asks
for nothing any document forbids.

### Primary ask

**Split the $4,000 into $2,000 on Milestone 1 and $2,000 on Milestone 2, and move
Milestone 1 from week 8 to week 6 by re-cutting it to contain only work Jim
controls.**

Resulting shape: $1,000 on blueprint approval (unchanged), $2,000 at week 6, $2,000
at week 12. Same total, same two milestones, same twelve week outer window.

The re-cut is the part that makes the ask about delivery rather than about money.
Milestone 1 currently mixes two kinds of work and puts the payment gate after both:

| Currently in M1 | Who controls the date |
|---|---|
| Template, tests, harvester, Pepes replay proof, open repo | Jim |
| Registry live with source-hash verification | Jim |
| Six published documents | Jim |
| At least two new collections deployed and finalised | founders |
| LEO Cats and Miami Degens successors | the core cutover |

Cut at that line. Everything Jim controls lands at end of week 6. The collections and
the successors move to Milestone 2, where they belong anyway because they are
evidence of use rather than evidence of build.

This is a better plan regardless of the money. A payment gate a stranger can delay by
not replying is a badly designed payment gate, and that argument is one a steward can
agree with without granting a favour.

Honest cost, worth knowing before proposing it: it thins the publicly visible
artefacts in the delivery milestone. Mitigate by keeping the registry live and the
Bitcoin Pepes byte-exact diff report in M1. Those are the two most reviewable things
in the whole grant and both are entirely Jim's.

### Fallback, offered in the same message

**Keep the milestone dates exactly as the blueprint has them (week 8 and week 12) and
still split the $4,000 into $2,000 and $2,000.** This changes nothing except which
row the money sits on, and gets $2,000 at week 8 instead of week 12.

Offering both in one message means one reply settles it.

### A third option, only if the steward is receptive

The week 4 checkpoint **already exists** in the blueprint, is already artefact-based,
and is already scheduled as a Progress Update. Ask whether a tranche can attach to it.
That is $1,000 at week 4 with zero schedule change and zero new promises. Do not lead
with this. It implies four payments and needs more permission than the primary ask.

### Ask in the same breath, because they cost nothing

- Is KYC cleared, or still outstanding?
- What asset is the $5,000 paid in, and at what conversion? Twelve weeks is a long
  time for that to move. (Already question 2 in the blueprint.)
- Does Cohort 4 have an end date?
- Expected turnaround from milestone submission to funds landing?

---

## 3. On compressing to 8 to 10 weeks

**No. Do not offer it. It is the one move that makes his position worse in exchange
for nothing.**

The reasoning, in the terms that matter to someone self funded:

**Compression does not get the money sooner.** Payment is gated on completion and
approval, not on speed. Finishing in eight weeks pays the same $4,000 as finishing in
twelve, and it arrives at the same point in the sequence either way. Re-phasing the
tranches moves money forward. Working faster does not.

**The 12 weeks is not padded.** It is roughly 14 weeks of work already compressed
into a 12 week window, and the compression is paid for by exactly one buffer week
(week 4) sitting in front of the riskiest item. The core cutover is not in the
timeline table at all and is another two weeks of the same person's time. Real slack
across the whole plan is about a week and a half.

**Compression shortens the only window that produces the impact evidence.** Milestone
2 is 80 per cent of the money and it turns on other people showing up. Under 12 weeks
the deployer is public around week 10 to 12, giving roughly two weeks for third-party
deployments to accrue. Under 8 weeks it is public around week 7, giving about one.
Every item in the plan responds to working harder except the two that gate most of
the money: a founder replying, and a stranger deploying.

**The failure mode is not lateness, it is being wrong on chain.** The harvester's
danger is not that it runs late but that it runs, produces a manifest, and is subtly
wrong. A gateway timeout read as "this token has no art" produces a canonical hash
that is confidently incorrect, `seed-canonical` writes it and `finalize-canonical`
makes it permanent. No re-seed, no correction, and that token can never have a twin.
Schedule pressure is exactly what turns "prove it byte-exact across all 2,089" into
"spot check 200 and move on". That would take down the "provably faithful rather than
a copy" claim publicly and permanently, under a grant deliverable.

**Second failure mode, more likely and less catastrophic.** The Clarity 4 helper
needs a Clarinet manifest that does not exist today, the v3.2.4 sub-manifest is
deliberately pinned to Clarity 3 because `as-contract` does not resolve under 4, and
nobody has measured how big that problem is. It sits at the very front and blocks the
whole test suite. On 12 weeks it eats the week 4 buffer. On 8 weeks there is nothing
for it to eat.

**And the core cutover gets more dangerous, not just later.** `steps.json` still
orders C1 before C2, the corrections are unmerged, and `set-next-id` works only while
`next-id` is zero. It is one shot and getting the number wrong forks the inscription
id space permanently. The F12 safety notice is not in the generated checklist. The
target version is not even decided between v3.2.4 and v3.4.1. Compression raises the
chance of an irreversible on-chain error made under deadline pressure. The blueprint's
fallback (if the cutover slips past week 7, ship on the current core and let the
successors follow) needs a week 7 to exist. Compression deletes it.

**Better middle option, and it is the primary ask above:** keep the 12 week outer
window, re-cut Milestone 1 to week 6, move the third-party-dependent items into
Milestone 2, and re-phase the tranches. That gets paid earlier without promising
anything new.

If the steward pushes for a shorter window, the honest answer is that a shorter plan
is a **smaller** plan, not a faster one, and Jim should offer it as descoping (fewer
new collections in the delivery milestone) rather than as speed.

---

## 4. Draft message to mrwagmi.btc

Ready to send. 245 words.

---

Hi mrwagmi,

Blueprint is nearly ready. There is one thing I would rather agree now than
restructure later.

The panel shows $1,000 on blueprint approval and $4,000 after the final impact
report. Could the $4,000 be split across the two milestones instead, $2,000 on each?
Same two milestones the cohort requires, same total, same twelve week window. Only
the tranche moves.

The reason is a change I want to make to milestone 1 anyway. As drafted it mixes work
I control with work I do not, and the payment gate sits after both. So I have re-cut
it to contain only what I can finish on my own: the contract template, the test
suite, the harvester with a byte-exact replay proof against Bitcoin Pepes, the open
repository, the live registry and the six published documents. That lands at week 6
rather than week 8. The new collections and the successor contracts move to milestone
2, where they fit better anyway because they are evidence of use rather than evidence
of build. A milestone a founder can hold up by not replying is a poor gate for both
of us.

If re-cutting is awkward, I am happy to leave the dates at week 8 and week 12 and
just split the money. Either version works and I will deliver on the current
structure if neither does.

Two quick ones while we are here. Is my KYC cleared, and what asset is the $5,000
paid in?

Jim

---

## 5. What not to say

- **Do not claim any published rule permits extra payments.** No document addresses
  payment count in either direction. Claiming otherwise is checkable and wrong, and
  it converts a reasonable request into a credibility problem. The honest framing is
  "nothing published sets a payment schedule".
- **Do not name Scaffold Stack or its grantee.** The record is public, but citing
  another grantee's terms back to their own steward reads as surveillance and invites
  a defensive answer. If evidence of shape is needed, cite the official DeGrant issue
  template, which carries upfront money plus three separately priced milestones. It
  makes the same point and it is the programme's own document.
- **Do not explain the financial position.** One clause at most, and only if it comes
  up. "I have funded six years of Stacks work myself and this is the first grant I
  have taken" is enough context for a whole conversation. Anything past that turns a
  delivery discussion into a hardship request and gives away the position.
- **Do not offer 8 to 10 weeks**, and do not mention it as available if asked to be
  flexible. Once said it cannot be unsaid, and it commits to a date for work whose
  scope is not yet decided (v3.2.4 versus v3.4.1 is still open), whose test harness
  does not exist yet, and whose two payment-gating deliverables run on other people's
  clocks.
- **Do not promise a number of third-party deployments, founder sign-ups, or wallets.**
  The blueprint already gets this right ("I will not make somebody else's decision a
  condition of my own milestone"). Keep it that way in conversation too.
- **Do not attach the core cutover to a grant date.** It is separate work the grant
  does not pay for. Naming it as a dependency is right. Committing to a cutover date
  in front of a steward is not.
- **Do not ask an open question like "how does payment usually work?"** It invites
  "that's the standard structure". Propose the structure.
- **Do not make the request conditional on starting.** The blueprint already says
  "Neither blocks starting", which is the correct posture and worth keeping.
- **Do not push after one no.** A single graceful acceptance keeps the relationship
  clean for the milestone approvals, which is where the steward's discretion actually
  matters.

---

## Sources

Programme: stacksendowment.co/blog/degrants-cohort-4-now-open,
stacksendowment.co/docs/degrants-track, stacksendowment.co/docs/eligibility-evaluation,
stacksendowment.co/grants, degrants.xyz, stacks.co "everything you need to know about
applying for a Stacks Endowment grant".
Platform: docs.zeroauthority.xyz/community-grants/degrants-3 (and /endowment-grants),
docs.zeroauthority.xyz/gigs/gigs-onchain/milestone-gigs-onchain,
zeroauthoritydao.com/funding/projects, zeroauthoritydao.com/funding/degrants.
Precedent: github.com/stacksgov/decentralized-grants issues 1 to 6 and the DeGrant
project issue template, stacks.foundation/degrants-pilot-cohort,
stacks.foundation/degrants-archive/cohort3.
Internal: `forever-twins/BLUEPRINT-SUBMISSION.md`, `forever-twins/GRANT-DECISIONS.md`,
`forever-twins/COLLECTION-SIZING.md`,
`contracts/drafts/v3.2.4/CANARY-READINESS.md`.
