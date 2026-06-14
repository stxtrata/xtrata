# Finalize Event Runbook

Draft status: finalization mechanics are TBC.

## Purpose

Turn the canonical lock/finalization step into a public trust event.

The campaign message:

The art was recorded, verified, and finalized. After that, the canonical record cannot be quietly changed.

## What Finalization Means

TBC from helper contract.

Expected meaning: canonical mapping/hash records are locked so the collection record cannot be altered after finalization.

## What Finalization Does Not Mean

- It does not fix the old IPFS pointer.
- It does not guarantee every old marketplace view works forever.
- It does not make unsourced metadata true.
- It does not replace the need for a manifest.

## Preflight Checks

| Check | Owner | Status |
|---|---|---|
| Finalization function name confirmed | Codex | TBC |
| Operator wallet confirmed | Jim / Rapha | TBC |
| Manifest complete | Jim / Rapha | TBC |
| Token ID mapping reviewed | Rapha / Fak.fun | TBC |
| Canonical hashes reviewed | Jim / Rapha | TBC |
| Dry run complete | Jim / Rapha | TBC |
| Verification guide updated | Codex | TBC |
| Announcement copy approved | Jim / Rapha | TBC |

## Operator Wallet

TBC.

Do not publish operator details until approved.

## Contract Calls

TBC.

Potential calls:

- `finalize-canonical` is present in `pepe-4ever-fakfun.clar`.
- manifest inscription or manifest pointer call. TBC.

## Livestream Run-of-Show

1. Open with the problem: the token can survive while the artwork disappears.
2. Explain what Bitcoin Pepes are doing.
3. Explain what Xtrata stores.
4. Explain what a manifest/canonical record does.
5. Show preflight verification.
6. Execute finalization call.
7. Wait for confirmation.
8. Show read-only finalization status.
9. Post verification links.
10. Thank first 87 / early claimers.

## Script

This is the trust moment.

We are not asking people to believe a screenshot. We are showing the record, the mapping, and the finalization path.

This does not fix the old IPFS pointer. It gives the artwork a permanent on-chain twin, and it makes the canonical record inspectable.

## Backup Plan

- If transaction fails: do not improvise. State the error, pause stream, and publish a short update after diagnosis.
- If explorer lags: show transaction ID and contract call, then update after confirmation.
- If manifest issue is found: do not finalize. Fix manifest first.
- If claim count or mapping mismatch appears: stop and reconcile before proceeding.

## Post-Event Verification

Publish:

- transaction ID;
- helper contract link;
- Xtrata core link;
- manifest link/hash;
- read-only finalization status;
- sample token verification path.

## Announcement Copy

Bitcoin Pepes just hit the trust moment.

The canonical record has been finalized. TBC final wording after contract verification.

This does not fix the old IPFS pointer. It gives the artwork a permanent on-chain twin, with a record holders can verify.

Links:

- Finalization tx: TBC
- Verify guide: TBC
- Claim: TBC
