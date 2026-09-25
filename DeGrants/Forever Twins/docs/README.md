# Forever Twins docs

Working documentation for **Xtrata Forever Twins** and its Stacks Endowment grant
(DeGrants Cohort 4). Last updated 25 September 2026.

Forever Twins gives an NFT a permanent, fully on-chain twin whose artwork is inscribed on
Bitcoin via Stacks, so the art survives even if the original's off-chain image disappears.
The original NFT is never modified.

## Contents

| Folder | Document | What it covers |
|---|---|---|
| grant/ | [overview.md](grant/overview.md) | The grant as published: track, cohort, timeline, scope, pitch |
| grant/ | [milestones.md](grant/milestones.md) | Milestone 1 and 2 deliverables, agreed definitions, live status |
| grant/ | [milestone-1-plan.md](grant/milestone-1-plan.md) | Day-by-day plan to finish Milestone 1 |
| grant/ | [reporting.md](grant/reporting.md) | Evidence log and the final recap template Milestone 2 requires |
| grant/ | [session-2026-09-25.md](grant/session-2026-09-25.md) | What changed on 25 Sep, test results, and what needs Jim's decision |
| project/ | [what-is-forever-twins.md](project/what-is-forever-twins.md) | Plain-language explainer (draft for the public explainer) |
| project/ | [architecture.md](project/architecture.md) | How the pieces fit: core, helpers, canonical record, swaps, registry |
| project/ | [helper-v3.md](project/helper-v3.md) | The v3 helper contract: fee split, admin model, what nobody can do |
| project/ | [decisions.md](project/decisions.md) | Decision log with reasons |
| project/ | [collections.md](project/collections.md) | Live, tested and candidate collections, with research still needed |
| project/ | [risks.md](project/risks.md) | Risk register and open questions |
| guides/ | [preserve-your-collection.md](guides/preserve-your-collection.md) | Draft guide for holders and collection communities |
| guides/ | [onboarding.md](guides/onboarding.md) | Draft onboarding for a collection being added |
| operations/ | [deployment-runbook.md](operations/deployment-runbook.md) | Step-by-step for deploying and launching one helper |
| operations/ | [open-source-release.md](operations/open-source-release.md) | Checklist for publishing the tooling and registry |
| reference/ | [contract-interface.md](reference/contract-interface.md) | v3 public, read-only functions and events |
| reference/ | [error-codes.md](reference/error-codes.md) | All helper error codes |
| reference/ | [glossary.md](reference/glossary.md) | Terms used across these docs |

## Source material

- Grant page: https://grants.stacksendowment.co/projects/bb0dcef3-08df-47f3-ad17-bcc42c2815a4
- `Contracts/forever-twins-g1-g2-templates.patch`: G1/G2 templates, family test suite (v2)
- `forever-twins-v3-fixed-fee.patch`: v3 template, renderer, suite, `V3-FIXED-FEE.md`
- Branch `forever-twins-v3` in the `xtrata` repo: both patches applied, plus
  `ft-harness/manifest/` (builder, seeding plan, checker) and `ft-harness/registry/` (registry v1)
- In the repo (not in this folder): `docs/forever-twins-v2-spec.md` (FT-SPEC-2),
  `forever-twins/Forever-Twins-Collection-Families.md`, `forever-twins/ft-harness/`

Items marked **TBD** are genuinely unknown or undecided, not placeholders for filler.
