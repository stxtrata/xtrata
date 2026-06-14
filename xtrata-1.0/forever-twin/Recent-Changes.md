# Recent Changes

## 2026-06-14 - Move Bitcoin Pepes campaign into live operations

### Summary

Updated the Forever Twins campaign pack from prelaunch / launch-prep framing to post-launch live operations for the Bitcoin Pepes Forever Twins rollout.

### Changes

- Reframed the campaign as live: helper contract live, claims running, and Bitcoin Pepes holders already creating Forever Twins on Xtrata through Fak.fun.
- Added the working Fak.fun claim route across holder-facing, social, verification, and operating docs.
- Updated copy to describe Bitcoin Pepes as the first public Forever Twins collection, powered by Xtrata and built with Fak.fun.
- Replaced hard `TBC` claim-count placeholders with approximate `around 200` language for casual copy, while requiring fresh `get-inscribed-count` reads before formal publication.
- Moved remaining unknowns into live verification, support, or finalization work instead of launch blockers.
- Updated the next-steps article so completed copy/doc updates are marked done and the remaining checklist focuses on contract facts, proof capture, support, outreach, and finalization.

### Notes

- Exact claim count, current fee state, promo status, transfer/listing behavior, wallet guidance, and finalization status still need live read-only verification before hard public claims.
- The working claim route is `https://fak.fun/SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`; confirm whether an approved redirect should replace it in public materials.
- `docs/app-reference.md` is referenced by the repo instructions but was not present in this workspace, so it could not be reviewed.

### Verification

- Ran consistency scans for stale prelaunch and claim URL placeholders.
- No automated tests were run because this change set is documentation and campaign copy only.
