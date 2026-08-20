# Responding to the Endowment's milestone counter-proposal

Received 17 August 2026, before contracting. Their proposal replaces the three
milestones in `BLUEPRINT-FORM-ENTRIES.md` with two, and removes the initial payment.

---

## 1. What actually changed

| | Panel / your blueprint | Their proposal |
|---|---|---|
| Kickoff payment | $1,000 on blueprint approval | **Gone** |
| First money | ~early September | 13 October |
| Milestones | 3 | 2 |
| New collections by ~11-13 Oct | 1 | **3** |
| New collections by end | 2 | **5 cumulative** |
| Self-serve deployments | reported, not a gate | **2, as a gate** |
| Holder wallets | reported, not a gate | **25, as a gate** |
| End date | 8 November | 24 November |

Two things worth seeing clearly before reacting.

**The dates are more generous, not less.** Their Milestone 1 lands two days after
your Milestone 2 date. Their Milestone 2 lands sixteen days after your Milestone 3
date. They have given you an extra fortnight overall.

**They have already accepted your definition of "preserved".** Their own acceptance
criteria say each preserved collection needs "a verifiable on-chain twin contract and
example twin mint". That is contract live plus one mint. It is not every token
claimed. This is the single most important thing in the letter and it is in your
favour, because it is the difference between roughly 78 seeding transactions and
roughly 15,000 minting transactions.

---

## 2. What is genuinely fine

**Three collections by 13 October, five cumulative by 24 November.** On their own
definition this is a contract deploy, a canonical seed, a finalise and one example
mint per collection. From the cheap end of `COLLECTION-SIZING.md`: Bitcoin Bulls OG
(400 items, 2 seed transactions), Cool Ape (300, 2), NarcotiX (2,407, 13), Stacks
Wizards (2,100, 11), Wasteland Apes (10,000, 50). About 78 seed transactions and five
deploys in total. Protocol fees are negligible at this scope. This is achievable.

**Two collections through the self-serve flow.** Their wording does not say who drives
it. Two of your five going through your own tool satisfies it and proves the tool
works, which is the point of the criterion.

**The open-source, registry, docs and recap items.** Unchanged from what you already
planned.

---

## 3. The two things to fix, and one to ask for

### The kickoff payment

The grant page has displayed "Initial Payment, $1,000, project kickoff funding
released upon blueprint approval" since the grant went active. That is their wording,
in their system, and planning around it was reasonable.

It is also the programme's normal shape rather than a favour. The official DeGrant
project issue template opens with "Upfront money: $xxx" before any milestone line, and
every pilot-cohort grant was structured that way, with 40 to 50 per cent upfront on
the $5,000-size awards.

**Ask: keep the kickoff and apply their own 40/60 split to the remaining $4,000.**
That is $1,000 on contracting, $1,600 at Milestone 1, $2,400 at Milestone 2. Same
total, same proportions, same dates. It accepts their entire structure and only
restores the thing their platform already promised, which makes it hard to refuse
without contradicting their own page.

**Fallback, offer it in the same message:** if kickoff is not possible, add a small
tooling milestone in mid-September at $1,000. That is the checkpoint already in your
blueprint, it is fully evidenced, and it brings the first payment four weeks forward.

### "25 unique holder wallets holding a Forever Twin"

**This is the one criterion that could fail on a definition rather than on work.**

A twin is minted into the collection's escrow contract and bound to whoever owns the
original. That is how all three live collections work today. So on raw chain data the
escrow contract is the only holder, and a naive count returns one wallet no matter how
much art you preserve.

Read as resolved ownership, which is the product's own semantics and what the registry
displays, 25 is straightforward and inside your control: inscribing is permissionless,
so you can preserve 25 pieces owned by 25 distinct wallets for a few STX in total.

Read as raw custody, it requires 25 separate people to actively swap their original
into escrow to take the twin out. That is a genuine adoption ask and not something you
can drive alone.

**Ask: pin the definition in the contract.** Offer to report both numbers, and propose
the threshold applies to resolved holders.

### "At-risk collections"

Undefined, and it is a judgement call sitting on a payment gate. Offer your own
measurement instead: how the art is hosted, how many public gateways still serve it,
what share is already unreachable. Two of nineteen surveyed are already unfetchable.
Offer to publish it and use it as the selection test.

---

## 4. Tone

They asked "let us know if these thresholds feel achievable or if there's another
metric you think better demonstrates real adoption". That is an invitation, not a
final offer. Answer it as one.

Do not raise personal finances. The kickoff argument stands entirely on their own page
and their own template, and it is stronger without it.

---

## 5. Draft reply

Ready to send.

---

Hi,

Thanks for this. The acceptance criteria are clear and I am glad to work to objective
thresholds. Some are sharper than what I proposed and that is fine.

One structural thing I would like to keep. The grant page has shown "Initial Payment,
$1,000, project kickoff funding released upon blueprint approval" since the grant went
active, and I planned the first stretch of work around it. The DeGrants project
template also opens with upfront money, and the pilot cohort grants were structured
that way.

Could we keep the kickoff and apply your 40/60 split to the remainder? That would be
$1,000 on contracting, $1,600 at Milestone 1 and $2,400 at Milestone 2. Same total,
same proportions, same dates. If a kickoff is not possible, an alternative is a small
tooling milestone in mid-September at $1,000, covering the contract template, the hash
harvester and the open-source release, all of which are evidenced by a public
repository and on-chain proof.

Two definitions I would like pinned down in the contract. Both are easy to meet if
agreed now and impossible to settle later.

**Holding a Forever Twin.** A twin is minted into the collection's escrow contract and
bound to whoever owns the original. That is how all three live collections work today,
and it is what the registry displays. Counting raw NFT custody instead would show the
escrow contract as the only holder however much art is preserved. I will report both
figures and propose the 25 threshold applies to resolved holders.

**At-risk.** Every collection with off-chain art is at risk in principle, so I measure
it: how the art is hosted, how many public gateways still serve it, and what share is
already unreachable. Two of the nineteen collections I have surveyed so far are already
unfetchable. Happy to use that as the selection test and publish the measurement.

Everything else looks achievable. Three collections by 13 October and five cumulative
by 24 November both work on the basis your criteria already set, a verifiable twin
contract plus an example twin mint for each.

Thanks,
Jim

---
