# Milestones

Status as of 6 October 2026. Update the status column and the evidence log in
[reporting.md](reporting.md) as things land.

## Agreed definition of "preserved"

A collection counts as preserved when **a helper contract for it is deployed on mainnet and
anyone can use it**. That means its canonical record is fully seeded and finalised, so every
token in the collection *can* be inscribed. It does **not** mean the whole collection has been
inscribed. The target is at least a handful of real users per collection.

> Confirmed with the DeGrants team (Andrea), reported by Jim on 6 October 2026: a publicly
> accessible contract that anyone can use counts as preserved; an open preservation gateway is
> enough. Milestone 1 is due **Tuesday 13 October 2026** ($1,600 on approval); the plan is to
> submit on Monday 12 October in the grants tracker.

## Milestone 1: Public Preservation Service + Initial Cohort

Tracker status: In progress.

| # | Deliverable (as published) | Status | Notes |
|---|---|---|---|
| 1.1 | Launch the public Forever Twins preservation service | Live | Shared collection pages at `/forever-twins/collection/<key>`, collections directory, community pages, resolver at `/ft/<collection>/<id>.json` |
| 1.2 | Preserve at least 3 additional at-risk collections beyond Bitcoin Pepes, LEO Cats and Miami Degens | Done (evidence being collected) | NYC Degens, Megapont Ape Club and Bitcoin Monkeys: helpers deployed, seeded and finalised on mainnet, source hashes match the pinned template, each with test inscriptions. Ordinal Pepe is ready as a fourth. Evidence bundle in progress |
| 1.3 | Publish the Forever Twins preservation registry | Published | `/forever-twins/data/registry.v2.json` (six live collections, helper source hashes, manifests, recovered counts) and `/forever-twins/collections/`; `npm run registry:verify` checks the helpers against the chain |
| 1.4 | Publish an educational explainer and "Preserve Your Collection" guide | Published | `/forever-twins/guides/what-is-forever-twins`, `/forever-twins/guides/preserve-your-collection` (the markdown in this folder is the older draft) |
| 1.5 | Publish onboarding documentation | Published | `/forever-twins/guides/onboarding` and `/forever-twins/guides/verify-it-yourself` |
| 1.6 | Release the preservation tooling and registry as open source | In progress | Repository is public; README written; licence not yet chosen; see [open-source-release.md](../operations/open-source-release.md) |

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
