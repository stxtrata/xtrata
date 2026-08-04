# Wizard Fleet — Round 2 Plan

Scenarios 2–10: the market half. Round 1 proved the fleet can write to the chain; round 2 proves it can trade.

## Budget

Fleet holds **14.713 STX** across three wallets (~4.9 each) after round 1.

| Guard | Value | Why |
|---|---|---|
| Per-round cap | 0.5 STX | A full nine-scenario round costs ~0.3–0.4 STX in miner fees. Listing deposits and sale prices are recoverable or circulate within the fleet. A runaway costs ~3% of the float. |
| Session cap across rounds | 1.5 STX | Three rounds' headroom, then it stops regardless of what any single round believes. |
| Wallet floor, unattended | 4 STX | The backstop if both caps fail. Caps fleet-wide unsupervised exposure at ~2.7 STX. The supervised floor stays 1 STX. |

Only miner fees are truly spent. Listing deposits return on cancel or settle; sale prices move between wizards and stay in the fleet.

## The one structural constraint

**Fresh v3-2-3 inscriptions can only be listed on the sponsored markets.** All three standard markets hardcode `ALLOWED-NFT-CONTRACT` to the retired `xtrata-v2-1-0` and reject v3-2-3 at `list-token`. The sponsored trio answers `is-nft-allowed(v3-2-3)` → `(ok true)`.

This is very likely a large part of why the market is dormant, and round 2 is the first thing that will exercise those contracts with real inventory.

**Listing for sBTC or USDCx requires holding neither.** `list-token` escrows only the NFT plus an STX fee budget; the payment token moves solely in `buy`. So scenarios 3 and 4 are fully reachable, and only the *purchase* leg needs the token — which is exactly what scenario 8 is designed to prove fails cleanly.

## Scenarios

| # | Scenario | Proves | Reachable? |
|---|---|---|---|
| 2 | list on sponsored STX | escrow + deposit | Yes |
| 3 | list on sponsored sBTC | cross-currency listing with zero sBTC | Yes |
| 4 | list on sponsored USDCx | as above | Yes |
| 5 | self-paid buy | the path every real buyer takes today | Yes |
| 6 | sponsored buy via relayer | the market plan's Stage 3 rehearsal | Yes, or SKIP if the relayer refuses |
| 7 | cancel | NFT and full deposit return | Yes |
| 8 | buy sBTC listing → clean failure | out-of-reach fails legibly, not silently | Yes |
| 9 | relist at a new price | cancel-then-list, the only price change the contracts support | Yes |
| 10 | settlement | `settle-refund` arithmetic; seller made whole | Partial — sponsor-only half unreachable; seller half needs 144 blocks (~24h) |

Scenario 10 will SKIP on a same-day run with the block count remaining, and is worth revisiting the next day rather than blocking the round.

## Loop behaviour

**Runs to completion, logging as it goes.** A pass, a legitimate skip, a designed failure (scenario 8), or an unexpected single-scenario failure all continue — the failure is isolated and recorded so the round yields a full picture rather than a partial one and a guess. Transient *read* errors retry; broadcasts never do.

**Halts immediately** on: an unresolved broadcast (the crash window), any safety rail firing (spend cap, kill switch, balance floor, nonce ambiguity, refused parent quote), chain state disagreeing with a step that claimed success, anything permanent going wrong (bad inscription, stranded escrow, uncancellable listing), or a proposed patch that would weaken a rail.

The principle: continue through the environment being awkward; stop when the system looks wrong.

## Between rounds

The loop writes a round report, diffs against the previous round, and classifies every delta. It applies **test additions and documentation corrections** itself — neither can affect spending or permanence. Everything touching the runners, the inscribe path, or a safety constant is staged as a diff with rationale and carried forward, so the operator gets one review at the end rather than an interruption per finding.

It must refuse to propose any patch that weakens a rail, and instead flag: *this round failed because a rail fired; the rail may be right.* A self-improving loop that optimises away its own safety is the specific failure mode being designed against.

## Cleanup

Every round ends by reporting fleet state: any listing left open, any NFT still in escrow, each with the command to recover it. A round that leaves the fleet in an unknown state has failed even if every scenario passed.

## Definition of done for round 2

- Scenarios 2–9 have a verdict, each verified from chain rather than from a receipt.
- Scenario 10 has a verdict or a recorded skip with the blocks remaining.
- No NFT stranded in escrow, no listing left open unintentionally.
- Fleet spend within the round cap, and reconciled against the journal.
- A round report with proposed patches staged for review.

## After round 2

Round 3 is the drops path — campaign creation, escrow, sponsored claim — which is the other half of the sponsorship system and currently the only sponsored flow proven in production. That needs BNS names on the wizards, so it is a deliberate step rather than a continuation.

Longer term, the fleet is the natural harness for the Collections + Drops v3 rebuild on `ms-rebuild` once it reaches testnet: same scenario runner, different contract targets, which is why the runner takes contracts as configuration rather than constants.
