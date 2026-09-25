# Milestones

Status as of 25 September 2026. Update the status column and the evidence log in
[reporting.md](reporting.md) as things land.

## Agreed definition of "preserved"

A collection counts as preserved when **a helper contract for it is deployed on mainnet and
anyone can use it**. That means its canonical record is fully seeded and finalised, so every
token in the collection *can* be inscribed. It does **not** mean the whole collection has been
inscribed. The target is at least a handful of real users per collection.

> TBD: confirm with the DeGrants team that this definition is accepted, and whether Milestone 1
> is due at the end of Q3 (30 September 2026) or is simply the first stage of the grant period.

## Milestone 1: Public Preservation Service + Initial Cohort

Tracker status: In progress.

| # | Deliverable (as published) | Status | Notes |
|---|---|---|---|
| 1.1 | Launch the public Forever Twins preservation service | Not started | Needs deployed v3 helpers and a holder-facing page |
| 1.2 | Preserve at least 3 additional at-risk collections beyond Bitcoin Pepes, LEO Cats and Miami Degens | Contracts and tooling ready | v3 passes 453/453 in the real harness; manifest builder, seeding plan and checker built; picks recommended ([collections.md](../project/collections.md)), awaiting Jim; nothing deployed |
| 1.3 | Publish the Forever Twins preservation registry | Built, not published | `ft-harness/registry/`: JSON with the 3 live v1 helpers, a page reading every helper live, `npm run registry:verify`. Add v3 helpers as they deploy |
| 1.4 | Publish an educational explainer and "Preserve Your Collection" guide | Drafts started | [what-is-forever-twins.md](../project/what-is-forever-twins.md), [preserve-your-collection.md](../guides/preserve-your-collection.md) |
| 1.5 | Publish onboarding documentation | Draft started | [onboarding.md](../guides/onboarding.md) |
| 1.6 | Release the preservation tooling and registry as open source | Not started | [open-source-release.md](../operations/open-source-release.md) |

## Milestone 2

| # | Deliverable (as published) | Status | Notes |
|---|---|---|---|
| 2.1 | Launch the public self-serve Forever Twins deployer | Not started | v3 is designed for it: payouts fixed in the template |
| 2.2 | At least 5 additional preserved collections cumulatively, beyond the three live at the start | Not started | Counts Milestone 1's collections |
| 2.3 | At least 2 collections deployed through the self-serve flow | Not started | |
| 2.4 | At least 25 unique wallets with a Forever Twin resolved to them via the registry | Not started | Needs holder swaps, not only sponsor inscriptions |
| 2.5 | Verifiable on-chain Forever Twin mint activity | Not started | `inscribed` events from helpers |
| 2.6 | Public final recap | Not started | Template in [reporting.md](reporting.md) |

The final recap must cover: collections preserved; self-serve deployments; Forever Twins minted;
unique wallets with twins resolved to them; custody figures where applicable; community response
and feedback; preservation-risk findings; key learnings and next steps.

## Self-serve and the registry (Milestone 2 design note)

Because the v3 fee split is written into the template, anyone deploying through the self-serve
tool gets the same payouts. Someone could edit and deploy their own version, so the **registry is
where trust lives**: it lists only helpers whose deployed code matches the published template
exactly, and only one helper per collection (two helpers would allow two twins of one original).
