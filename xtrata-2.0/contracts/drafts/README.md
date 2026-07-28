# Xtrata draft contracts

This folder is for draft, archival, experimental, or abandoned contract versions.

## Current live contract

The current live Xtrata contract is:

- `xtrata-v3.2.3`

## Draft contract notes

- `xtrata-v3.2.4-draft.clar` is **not live**.
- It is **not** the current production contract.
- It is **not** registered in the active Clarinet deployment plan.
- It is preserved for reference/back-up only.
- It may never be deployed or used.

The matching draft test file is also preserved here as reference material, but it is not part of the active Clarinet test suite.

## `v3.2.4/` — active candidate

`v3.2.4/` is different from the loose files above. It is a worked-up candidate
with a migration plan, not a preserved back-up.

- Still **not live** and **not** in the active Clarinet deployment plan.
- `xtrata-v3.2.4-candidate.clar` is `xtrata-v3.2.4-draft.clar` plus a
  payer/recipient split, so a publisher can fund an author's inscription in one
  transaction and the author still owns and is credited for it.
- Start at `v3.2.4/MIGRATION-PLAN.md`. It covers what the migration costs, which
  satellite contracts need admin calls rather than redeploys, and the open
  decisions.
- `v3.2.4/steps.json` is the single source of truth for the deployment steps.
  Edit it and run `node v3.2.4/build-canary.mjs` to regenerate `canary.html` and
  the step table in the plan. Do not hand-edit either.
