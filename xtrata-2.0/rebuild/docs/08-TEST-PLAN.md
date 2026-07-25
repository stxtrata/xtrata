# Test Plan — Collections & Drops v3

Layers: contract (clarinet-sdk/vitest, simnet), model/property (fast-check operation sequences against invariants), client unit (planner/hash/resume), integration (simnet end-to-end), browser (Playwright over Studio/Builder/Canary with mocked wallet + simnet-backed reads).

## Collection-size matrix
Plans of 1, 30, 31, 50, 51, 100, 500, 1000 items. Sizes 1–100 run end-to-end on simnet (mixed small-single-tx and staged items); 500 and 1000 run at planner + reconciliation level (batch counts, cost totals, resume correctness) with sampled on-chain execution. Boundary cases from the v3.2.3 core: 32 vs 33 chunks (single-tx limit), 32-chunk upload batches, 50 vs 51 seal-batch items, exact supply exhaustion at each size.

## Contract suites
**Collection:** reservation-counts-against-supply incl. N concurrent wallets racing last slot; dense index + free-list recycling; duplicate hash rejected at reserve (collection HashIndex — core allows duplicates, we must not); full staged flow with real hash chains; single-tx 32/33 boundary; seal-batch atomicity (one bad session fails all) and 50/51 boundary; payment-only-at-seal + split math incl. remainder and self-recipient skip; phases (schedule windows, per-wallet, per-phase supply, all four allowlist modes); expiry + permissionless release; pause (mint blocked, cancel/release/unassign still work); role separation + unauthorized admin attempts; two-step ownership; close-supply one-way; finalize requires dense+complete and freezes config; assign/unassign/assign-range double-assignment and wrong-caller rejection; paused-core AllowedCallers scenario.

**Drops:** inventory resolution — whole collection, index range, explicit ids, all-unassigned; immutability after activation; duplication attempts (same item to two drops, re-adding to same drop); pre-inscribed escrow batches (25/26 boundary) and activation gate (fully escrowed); zero-price and sponsored mint modes; public/allowlist/signed eligibility; signature replay (other drop, other claimer, other contract, other chain-id, expired); per-wallet and total limits; concurrent claims racing last item; claim reservation expiry + release; pause/cancel/end; unclaimed recovery returns NFTs + budget + clears assignments; sponsor: claim-fee caps, budget exhaustion mid-drop, settle-refund delay, non-sponsor rejection.

## Model-based tests
fast-check sequences over ops {reserve, upload-batch, seal, cancel, expire-advance, release, assign, claim-reserve, claim, claim-expire, cancel-drop, fund, claim-fee} with random interleavings and 2–4 actors. Assert after every op: supply invariant, index density ∪ free-list = [0, next-index), one-assignment-per-item, claimed+reserved ≤ inventory, budget-remaining never negative, no strandable funds (sum of recoverable = sum escrowed − sum settled).

## Client/engine
Hash chain vs Node reference impl (property: random chunkings of same bytes → same final hash per fixed chunk size, order sensitivity). Planner: deterministic ordering, duplicate file collapse, mixed sizes (single-tx vs staged split), batch/cost totals vs quote-inscription-fee. Resume decisions: interrupted at every state (reserved / begun / k-of-n batches / staged / seal-submitted / seal-confirmed-unseen-locally); wallet rejection mid-plan; broadcast-succeeded-response-lost (retry must no-op); manifest export→import→resume on "new device" (no browser state); reconcile against chain fixtures with stale/contradictory local snapshots (chain wins).

## Integration scenarios (simnet e2e)
Creator inscribes 100 items across mixed batches → one dense collection → whole-collection drop in one selection action → each of the three modes → claims (concurrent, expiring, exhausting) → recovery of leftovers → finalize. Wrong-network guard tests at the client layer (SP vs ST principals). Deployment failure injection: bad dependency address, name conflict, source mismatch — canary logic must detect each.

## Browser (Playwright)
Studio: import 100 files (fixtures), plan review, start, kill page mid-batch, reload → resume from chain; per-item status states render correctly. Builder: select-all-unassigned single action for a multi-batch collection; sponsor exposure figure shown before funding. Canary: stage gating (cannot skip), typed confirmation for irreversible steps, report download. Claim page: sponsored claim happy path + relayer error normalization.

## Gates
`clarinet check` clean; all vitest suites green; premerge smoke script; testnet canary (stages 5–11 of the deployment pipeline) before any production step. Mainnet requires explicit user approval.
