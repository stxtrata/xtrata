# Milestone 1 plan

Working plan from 25 September 2026. Target: **Friday 2 October**, pending confirmation of the
due date (see [milestones.md](milestones.md)).

The critical path is: tests in the real harness -> choose collections -> manifest and seeding
script -> mainnet-fork runs -> deploy. Docs, the registry page and the open-source release run
alongside.

## Fri 25 / weekend: verify and choose
- [x] Apply `forever-twins-g1-g2-templates.patch`, then `forever-twins-v3-fixed-fee.patch` (`git am`).
      Done 25 Sep on branch `forever-twins-v3`.
- [x] Run `npm test` and `npm run test:v3` against the real `xtrata-v3-2-3`. 959/959.
- [ ] Choose 3 collections plus 1 backup from [collections.md](../project/collections.md).
      At least one G2, to prove both templates on mainnet.
- [x] For each: supply, largest art file (must be <= 512 KB), where the art is hosted,
      whether it currently resolves, token-uri pattern. Recommendation in collections.md; Jim to pick.
- [ ] Payout addresses for Jim and Rapha (own wallets, seed backed up, not exchange addresses).
- [ ] Owner key on a hardware wallet.
- [ ] Confirm the Milestone 1 due date and "preserved" definition with DeGrants.

## Mon 28: pipeline
- [x] Build the manifest builder: fetch art, sha256, mime, size, fixed token-uri per token;
      write the manifest JSON and its sha256.
- [x] Build the seeding script (100 entries per `seed-canonical` call) and a checker that
      compares on-chain `get-canonical` with the manifest.
- [ ] Mainnet-fork (stxer) runs for the chosen collections.
- [ ] Start the explainer from [what-is-forever-twins.md](../project/what-is-forever-twins.md).

## Tue 29: first live collection
- [ ] Deploy helper #1 following [deployment-runbook.md](../operations/deployment-runbook.md).
- [ ] Seed, publish the manifest, finalise.
- [ ] First real inscription and swap; check `get-custody-state` and `live-check`.

## Wed 30: collections 2 and 3, registry v1
- [ ] Deploy, seed, finalise helpers #2 and #3.
- [x] Registry v1: static JSON plus a page reading `get-twin-interface` from every helper,
      including the live Bitcoin Pepes, LEO Cats and Miami Degens helpers. (Built; publish
      and add v3 helpers as they deploy.)
- [ ] Finish the "Preserve Your Collection" guide.

## Thu 1: public launch
- [ ] Holder-facing preservation and swap page, with "never send your NFT directly to the
      helper" and (G2) "unlist before swapping" warnings.
- [ ] Publish explainer, guide, onboarding docs.
- [ ] Make the repo public ([open-source-release.md](../operations/open-source-release.md)).
- [ ] Announce from @XtrataLayers; one post per newly preserved collection.

## Fri 2: buffer and evidence
- [ ] Backup collection if one stalled.
- [ ] Get a handful of real users per collection.
- [ ] Fill in the evidence log in [reporting.md](reporting.md) and update the tracker.
