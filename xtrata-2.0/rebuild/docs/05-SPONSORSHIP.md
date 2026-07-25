# Sponsorship Component — Design

On-chain half: the budget/settlement functions inside `xtrata-drops-v3` (fund-budget, claim-fee ≤ budget ∧ ≤ cap, settle-refund with 144-block creator fallback, cancel recovery). Everything below is the off-chain relayer, a rebuild of `functions/sponsor/[[path]].ts` implementing all FABLE-5 handoff findings.

## Endpoints
`POST /sponsor/v3/quote` · `POST /sponsor/v3/submit` · `GET /sponsor/v3/status/:jobId` · `POST /sponsor/v3/attest` (signed-eligibility drops only) · `GET /sponsor/v3/health`.

## Authorization pipeline (submit)
1. Decode the submitted signed transaction. **The signed tx is the sole source of truth** — request-body hints are advisory and any mismatch is a hard reject.
2. Require: sponsored-auth, origin fee 0, post-condition mode Deny, contract ∈ allowlist (`xtrata-drops-v3` only), function ∈ {`claim`, `reserve-claim`}, decoded args well-formed, post-conditions authorize at most one NFT movement to the tx sender and zero STX from the sender.
3. On-chain preflight (read-only): drop exists, status active, mode sponsored, window open, budget-remaining ≥ fee-quote, wallet under per-wallet limit, item availability > 0.
4. Rate limits: per-wallet (5/hr) and per-origin; global MAX_UNSETTLED (20); hot-wallet float floor (refuse below 5 STX).
5. Job row inserted with UNIQUE(drop-id, claimer) for one-per-wallet drops — off-chain race guard ahead of the on-chain one.

## Concurrency (FABLE-5 P1 fixes)
- **Single-writer nonce authority**: one Durable Object (or single-consumer queue) owns the sponsor key's nonce; all signing requests serialize through it. Nonces allocated only after the job row is leased.
- **Atomic leases**: every state transition is `UPDATE jobs SET state=?, lease=? WHERE id=? AND state=?` — proceed only if exactly one row changed. States: RECEIVED → SIGNING → SPONSORED → CONFIRMED → FEE_CLAIMING → FEE_CLAIMED → SETTLED / ABANDONED / FAILED. Lease timeout 15 min reaps crashed transitions.
- Broadcast idempotency: before rebroadcast, check the exact txid via the node; a known txid advances state instead of resending.

## Budget accounting
Fee attached = min(estimate × multiplier 3, claim-fee-cap, budget-remaining). `claim-fee` settles after claim confirmation; failed sponsored broadcasts that consumed a fee are recorded against the drop's audit log (and reimbursed via claim-fee only when the chain actually charged). Per-drop audit table: every sponsored txid, fee paid, claim-fee reimbursement, refund. Exposure invariant (monitorable): Σ(sponsor fees fronted − claim-fee reimbursed) ≤ configured float loss threshold → alert + auto-shutdown of sponsoring for that drop.

## Monitoring & emergency
Health endpoint exposes float balance, unsettled count, per-drop budget remaining. Kill switches: global env flag; per-drop deny list; on-chain `set-sponsor` rotation invalidates the relayer entirely. Alerts on: float below floor, settlement backlog > threshold, repeated preflight/confirm divergence (indexer lag or attack).

## Who pays what
Documented in 01-ARCHITECTURE §6 (table). UI rule restated: only mode-3 drops may be described as "free"; zero-price mint copy must state the claimer pays network fees.
