# Fable 5 Handoff — Sponsor Relayer Correctness and Consolidation

**Date:** 2026-07-12  
**Branches reviewed:** `main-staging` → `main-staging-fable`  
**Reviewed target:** `main-staging-fable` at `cd174f28`  
**Primary production component:** `functions/sponsor/[[path]].ts`  
**Reference implementation:** `xtrata-agent-one/svc/sponsor-service.mjs`

## Executive verdict

Do not treat the Cloudflare Pages sponsor relayer as production-equivalent to the Node relayer yet.

The branch is mechanically safe to merge: `main-staging` at `2ae5be1e` is the exact ancestor of `main-staging-fable`, so the merge is a 39-commit fast-forward with no competing commits or textual conflicts. The application test suite and production build pass. The main release risk is instead concentrated in the serverless sponsor relayer.

Three protections present in the Node implementation are absent or incomplete in the Pages implementation:

1. The request's `listingId` is not cryptographically bound to the listing/drop ID inside the buyer-signed transaction.
2. Sponsor-wallet nonce use and job transitions are not serialized across concurrent Cloudflare requests.
3. The per-origin rolling rate limit was dropped from the production port.

The existing 17 relayer tests pass, but they exercise the Node implementation only. They do not import, execute, or validate `functions/sponsor/[[path]].ts`. The Pages file's comments and changelog therefore overstate the assurance provided by that suite.

The recommended direction is not to delete all old relayer code immediately. First extract and share the pure protocol rules, give the Pages adapter direct tests, add a real concurrency owner for the hot wallet, and only then decide whether to remove the Node local-development adapter.

## Current architecture

### Production path

`functions/sponsor/[[path]].ts` is a Cloudflare Pages Function serving:

- `POST /sponsor/quote`
- `POST /sponsor/submit`
- `GET /sponsor/status/:id`

It stores jobs in D1, signs sponsored transactions with `SPONSOR_KEY`, and advances settlement opportunistically on incoming requests.

The mainnet registries point sponsored markets and Drops at the same-origin API (`sponsorApi: "/"`). As of this review, the following four contracts exist on mainnet and all return the same configured sponsor principal:

- `xtrata-market-sponsored-stx-v1-1`
- `xtrata-market-sponsored-sbtc-v1-1`
- `xtrata-market-sponsored-usdcx-v1-1`
- `xtrata-drops-v1-0`

This means the Pages implementation is not dormant scaffolding. It is on the active path selected by the frontend.

### Node reference/local path

`xtrata-agent-one/svc/sponsor-service.mjs` remains mounted by `xtrata-agent-one/server/server.mjs` when `SPONSOR_KEY` is present. It provides local endpoints under `/api/sponsor/*`, persists JSON jobs, runs a background settlement loop, serializes nonce use with an in-process promise lock, and enforces a rolling per-origin limit.

Its test suite is `xtrata-agent-one/svc/tests/sponsor-service.test.mjs`, invoked by `npm run sponsor:test` inside `xtrata-agent-one`.

The Node service is therefore not completely unused. It is a documented local fallback and, more importantly, currently acts as the executable specification for behavior the Pages port claims to mirror.

## Finding 1 — Signed transaction is not bound to the submitted listing ID

**Severity:** P1 / merge blocker for enabling sponsored production traffic  
**Location:** `functions/sponsor/[[path]].ts`, approximately lines 188–221 and 341–371

### Current behavior

`validatePayload` deserializes the buyer transaction and checks:

- sponsored authentication;
- zero origin fee;
- contract-call payload;
- allowlisted contract;
- allowed function name (`buy` or `claim`);
- at least one post-condition;
- deny-mode post-conditions.

The handler then checks that the transaction's contract matches `body.contractId`. However, it never decodes the signed function arguments and never compares the signed listing/drop ID with `body.listingId`.

The relayer subsequently uses the untrusted body value for all of the following:

- the on-chain `get-listing` budget and sold-state check;
- the persisted job's `listing_id`;
- the later `claim-fee` call;
- the later `settle-refund` call.

The actual buyer transaction can operate on a different ID.

### Failure scenario

1. A caller creates or obtains a correctly signed sponsored `buy`/`claim` transaction for item A.
2. The caller submits that transaction with `body.listingId = B`.
3. The Pages relayer checks B's availability and fee budget.
4. The sponsor pays to broadcast the transaction for A.
5. When A confirms, the job attempts `claim-fee(B, fee)`.
6. B was not sold/claimed by that transaction, so the fee claim aborts or repeatedly fails.

Consequences include:

- sponsorship can be approved using the wrong seller/creator's budget state;
- an underfunded A can be sponsored based on B's sufficient budget;
- the relayer may fail to reimburse the fee it paid;
- settlement targets the wrong record;
- jobs can consume the bounded unsettled capacity until timeout or manual recovery;
- status data attributes the transaction to the wrong listing/drop.

The contracts prevent the sponsor from directly taking B's budget while B is unsold, so this is not a direct theft of B's escrow. It is still a relayer treasury, accounting, and availability defect.

### Required fix

Decode and validate the signed contract-call arguments before any balance, budget, or broadcast operation.

For both `buy` and `claim`, the expected shape is:

1. NFT trait/contract argument.
2. Listing or drop ID as a uint.

Return the decoded facts from the validator, for example:

```ts
type ValidatedSponsorCall = {
  transaction: StacksTransaction;
  contractId: string;
  functionName: 'buy' | 'claim';
  originAddress: string;
  nftContractId: string;
  listingId: bigint;
};
```

Then:

- reject unless `validated.listingId === BigInt(body.listingId)`;
- preferably stop accepting `contractId` and `listingId` as authoritative request data at all;
- derive the contract and listing ID from the signed transaction;
- use the derived ID for lookup, persistence, fee claim, and refund;
- extend `getListing` to return `nft-contract` and reject unless it matches the signed NFT trait principal;
- validate that `body.listingId` is a canonical unsigned decimal if the field remains for compatibility.

The signed transaction must be the source of truth. Request metadata may duplicate signed facts for convenience, but must never override them.

### Required tests

- Accept matching body and signed listing ID.
- Reject signed ID A with body ID B.
- Reject matching ID with mismatched NFT contract argument.
- Reject malformed, missing, negative, decimal, or overflowing request IDs before `uintCV`/`BigInt` use.
- Exercise both market `buy` and Drops `claim` payloads.
- Assert no balance read, nonce allocation, broadcast, or D1 job insertion occurs after a mismatch.

## Finding 2 — Sponsor-wallet nonce and settlement races

**Severity:** P1 / production reliability blocker  
**Location:** `functions/sponsor/[[path]].ts`, approximately lines 151–172, 261–305, and 377–390

### Current behavior

Every submit or settlement transaction independently calls Hiro for `possible_next_nonce`, then signs and broadcasts. There is no serialization primitive around the hot wallet.

Cloudflare can run multiple requests concurrently, potentially in different isolates and data centres. An in-memory promise lock would not be sufficient even if added to the module.

Two submit requests can therefore:

1. both read nonce N;
2. sign different sponsored transactions with N;
3. race to broadcast;
4. cause one transaction to be rejected, replaced, or stranded depending on mempool behavior.

Settlement has an additional race. Every request calls `settleBatch` before routing. Multiple requests can select the same `CONFIRMED` or `CLAIMED` row before either updates it, causing duplicate `claim-fee` or `settle-refund` attempts with colliding sponsor nonces.

The Node implementation explicitly protects sponsorship with `nonceLock`. Its test named `nonce serialization: concurrent submits get distinct, increasing nonces` does not cover the Pages path.

### Why D1 alone is insufficient as currently used

The existing code performs:

- a non-atomic `SELECT` of pending work;
- external nonce lookup;
- external broadcast;
- a later `UPDATE`.

There is no lease, compare-and-swap state transition, unique nonce reservation, or single writer. D1 job persistence does not serialize the external wallet.

### Recommended architecture

Use one globally consistent owner for all operations signed by `SPONSOR_KEY`.

Preferred design:

- A Cloudflare Durable Object keyed by the sponsor address owns nonce allocation and signing order.
- Pages endpoints validate requests and enqueue work to that object.
- The object processes one wallet mutation at a time.
- It refreshes the chain nonce when starting/recovering, tracks reserved nonces, and reconciles broadcast errors.
- Settlement work is claimed with an atomic D1 lease/state transition before the object signs anything.

Acceptable alternative:

- A Cloudflare Queue with a single logical consumer for sponsor-wallet mutations, plus idempotent D1 job transitions.

Avoid relying on:

- module-level promises or mutexes;
- `possible_next_nonce` alone;
- optimistic retries without job leases;
- a D1 transaction that is released before external broadcasting.

### Job-state changes

Introduce explicit intermediate states or leases, for example:

- `RECEIVED`
- `SPONSORING`
- `SPONSORED`
- `CONFIRMED`
- `CLAIMING`
- `CLAIMED`
- `REFUNDING`
- `SETTLED`
- `ABANDONED`

Each transition into a signing state should be an atomic conditional update:

```sql
UPDATE sponsor_jobs
SET state = 'CLAIMING', lease_owner = ?, lease_expires_at = ?
WHERE id = ? AND state = 'CONFIRMED';
```

Proceed only if exactly one row changed. Use idempotency keys for every logical wallet action.

Do not mark a job `SETTLED` merely because `settle-refund` was broadcast. Track broadcast and confirmation separately so status accurately reflects on-chain completion.

### Required tests

- Two simultaneous valid submissions receive distinct sequential sponsor nonces.
- Ten concurrent submissions produce no duplicate nonce reservations.
- Two workers attempting to advance the same confirmed job result in exactly one `claim-fee` broadcast.
- Restart/retry after nonce reservation but before broadcast is recoverable.
- Restart/retry after broadcast but before D1 update does not broadcast a second logical action.
- Rejected/stale nonce responses trigger reconciliation rather than blind resubmission.
- `SETTLED` is reached only after the refund transaction is confirmed successful.
- An aborted fee claim records zero reimbursement and still follows the defined seller-refund policy.

## Finding 3 — Per-origin abuse limit was omitted

**Severity:** P2 / denial-of-service and operational-cost risk  
**Location:** `functions/sponsor/[[path]].ts`, approximately lines 341–375

### Current behavior

The Pages implementation enforces a global maximum of 20 unsettled jobs but has no rolling per-origin limit.

The Node implementation defaults to five jobs per buyer address per hour and tests that behavior. The client error taxonomy already includes `RATE_LIMITED`, but the Pages route never returns it.

One origin can therefore fill the complete global queue, blocking other buyers until jobs settle or time out. Drops makes this especially visible because claims are intended to work for users with no STX and may be submitted rapidly.

### Required fix

Persist and enforce a configurable rolling limit in D1 before nonce allocation or broadcasting.

At minimum:

- default to five accepted jobs per origin per rolling hour;
- count accepted and unsettled jobs, not rejected validation attempts;
- add an index on `(buyer, created_at)`;
- return HTTP 429 with code `RATE_LIMITED`;
- include `Retry-After` where practical;
- make the check and job reservation atomic enough that concurrent submissions cannot all pass the same limit.

Consider also:

- an IP/edge-level rate limit for malformed requests;
- request-body size limits before deserializing transaction hex;
- a separate quote endpoint rate limit to protect Hiro usage;
- per-contract capacity so one Drops campaign cannot starve every market.

Wallet-address throttling is not Sybil-proof, but it is still an important fairness and accidental-loop guard.

### Required tests

- First five jobs from one origin are accepted; the sixth receives `RATE_LIMITED`.
- A different origin remains eligible.
- The origin becomes eligible after the rolling window expires.
- Concurrent submissions cannot exceed the configured limit.
- A validation failure does not consume the user's successful-job quota.

## Test-assurance gap

The Pages source currently says its validation rules are covered by the Node relayer's offline suite. That is not true at the executable level: the Pages handler duplicates the logic rather than importing it.

This duplication is how nonce serialization and the rate limit disappeared while the old tests remained green.

### Suggested module boundaries

Extract runtime-independent code into a shared location such as:

```text
src/lib/sponsor-protocol/
  types.ts
  payload.ts
  policy.ts
  settlement.ts
```

Responsibilities:

- `payload.ts`: deserialize and validate the signed transaction; return signed facts.
- `policy.ts`: budget, capacity, rate-limit, allowlist, and error rules.
- `settlement.ts`: pure state-transition decisions given job state and chain statuses.
- Pages adapter: D1, Durable Object/Queue, Cloudflare request/response handling.
- Node adapter: filesystem persistence, local HTTP server, local polling.

Both adapters should import the same pure modules and run the same contract tests. Adapter-specific suites should then cover persistence and concurrency behavior.

If placing production protocol code under `src/lib` would pull browser-oriented dependencies into the Function build, use a neutral top-level directory such as `shared/sponsor/`. The important requirement is one implementation of signed-payload validation and state-transition policy.

## Should the Node relayer be deleted?

Not as the first fix.

It remains:

- mounted by the local Agent One server;
- documented as the local-development fallback;
- the only directly tested implementation of several intended protections;
- useful as a behavioral reference during consolidation.

Recommended deletion sequence:

1. Extract shared pure logic from the Node service.
2. Make both adapters consume it.
3. Add direct Pages integration and concurrency tests.
4. Run an end-to-end Pages/D1/mainnet smoke test with a deliberately low-value listing/drop.
5. Decide whether local sponsored development still needs the Node adapter.
6. If not needed, remove:
   - `xtrata-agent-one/svc/sponsor-service.mjs`;
   - `xtrata-agent-one/svc/tests/sponsor-service.test.mjs` only after equivalent tests exist elsewhere;
   - sponsor imports, initialization, interval, and `/api/sponsor/*` routes from `server/server.mjs`;
   - `sponsor:test` from `xtrata-agent-one/package.json`;
   - obsolete Node relayer commands and comments in docs, scripts, deploy console, and client headers.

Do not remove:

- sponsored-market and Drops Clarinet tests;
- `src/lib/market/sponsor-client.ts` or its client tests;
- UI sponsored-buy/deposit tests;
- contract registry and deployment tests;
- newly added direct Pages relayer tests.

If the Node adapter is retained, fix its Drops allowlist construction: `server.mjs` currently maps every `SPONSOR_MARKETS` entry to `{ buyFunction: 'buy' }`, so a Drops contract supplied through that environment variable is not assigned `claim`.

## Additional hardening recommended during the same pass

### Input validation

- Cap `txHex` length before deserialization.
- Require canonical hexadecimal input and reject odd-length or prefixed variants consistently.
- Validate `contractId` format and reject extra dots/empty components.
- Validate `SPONSOR_MARKETS` at startup rather than accepting malformed entries.
- Ensure only mainnet-version transactions are accepted by the mainnet relayer.
- Reject multisig or unsupported origin spending-condition shapes unless address derivation is explicitly supported.

### Idempotency and persistence

- Reserve the payload hash before broadcasting, using the existing unique constraint as part of an atomic insert.
- Return the existing job for an identical retry when safe, rather than always returning a generic duplicate error.
- Store the origin transaction ID and sponsor nonce.
- Record every transition timestamp and last chain status.
- Preserve terminal failure reasons instead of swallowing every settlement exception.
- Add migration/version management for `sponsor_jobs`; avoid relying indefinitely on `CREATE TABLE IF NOT EXISTS` inside every request.

### Chain-status handling

- Distinguish Hiro unavailable/not-found from genuinely pending.
- Do not convert every non-OK transaction lookup into `pending` forever.
- Treat `abort_by_response`, `abort_by_post_condition`, and dropped transactions explicitly.
- Confirm claim success before reporting reimbursement.
- Confirm refund success before reporting settlement complete.

### Operational controls

- Add structured logs with job ID, action, contract, listing ID, nonce, and txid, excluding keys and raw signed payloads.
- Expose an authenticated health/diagnostic view for unsettled counts and oldest-job age.
- Alert on low sponsor balance, repeated nonce errors, settlement backlog, and reimbursement failures.
- Document recovery for jobs stranded between broadcast and persistence.

## Suggested implementation plan for Fable 5

### Phase 1 — Regression tests first

1. Add a test harness that calls the Pages handler with mocked D1, cache, fetch, and chain-broadcast functions.
2. Encode the three findings as failing tests.
3. Add a valid Drops `claim` fixture alongside the existing market `buy` fixture.
4. Confirm the existing production source fails these new tests before changing behavior.

### Phase 2 — Shared protocol core

1. Extract signed-payload parsing and validation.
2. Derive contract, function, NFT principal, origin, and listing ID exclusively from the signed transaction.
3. Extract budget/capacity/rate-limit decisions.
4. Extract pure settlement-transition decisions.
5. Point the Node tests at the shared core so existing coverage remains useful.

### Phase 3 — Concurrency owner

1. Introduce a Durable Object or single-consumer Queue for sponsor-wallet actions.
2. Add atomic job leases and intermediate states in D1.
3. Persist sponsor nonce and action idempotency keys.
4. Confirm broadcasts and reconcile crashes at every boundary.

### Phase 4 — Pages adapter tests and smoke

1. Run unit and integration tests for handler validation, D1 limits, leases, and status responses.
2. Run concurrent submission and concurrent settlement tests.
3. Run `npm run test:app`, sponsor tests, relevant Clarinet suites, and `npm run build`.
4. Deploy to a preview environment with a separate low-balance sponsor wallet.
5. Smoke: list/create → sponsored buy/claim → claim fee → refund dust → verify balances and final D1 state.

### Phase 5 — Cleanup

1. Decide whether the local Node adapter still provides value.
2. Remove it only after production tests cover its guarantees.
3. Update stale changelog/runbook/deploy-console language.
4. Keep a concise architecture and recovery runbook for the surviving implementation.

## Acceptance criteria

The relayer work is complete when all of the following are true:

- The signed call's contract, function, NFT principal, and listing/drop ID are the sole authoritative transaction facts.
- Mismatched request metadata is rejected before any sponsor-wallet or D1 job mutation.
- Concurrent wallet actions cannot reserve or broadcast the same sponsor nonce.
- A logical claim/refund action cannot be broadcast twice after worker races or restarts.
- Per-origin rate limiting is enforced and returns HTTP 429/`RATE_LIMITED`.
- Pages-specific tests fail if any of those protections are removed.
- Job status distinguishes broadcast from confirmed settlement.
- Every mainnet registry contract is covered by a valid payload fixture or adapter integration test.
- Node relayer code is either intentionally retained and shares the protocol core, or deliberately removed with all references cleaned up.
- Full app tests, relevant Clarinet suites, sponsor suites, and production build pass.
- A preview-environment end-to-end smoke confirms fee reimbursement and seller/creator dust refund.

## Verification already completed during review

- Remote refs refreshed on 2026-07-12.
- `main-staging` is the exact ancestor of `main-staging-fable` (`0` vs `39` unique commits).
- Application tests: **771/771 passed** across 145 files.
- Node sponsor tests: **17/17 passed**.
- Production build: completed successfully.
- Four active sponsored contracts: mainnet interface checks returned HTTP 200.
- Four `get-sponsor` calls returned the configured principal `SP3EHW9BYF23GNAQ3CC6818J1ZZRWVQM3DSRSN0AF`.
- No merge or production mutation was performed as part of the review.

## Files Fable 5 should inspect first

1. `functions/sponsor/[[path]].ts`
2. `xtrata-agent-one/svc/sponsor-service.mjs`
3. `xtrata-agent-one/svc/tests/sponsor-service.test.mjs`
4. `xtrata-agent-one/server/server.mjs`
5. `src/lib/market/sponsor-client.ts`
6. `src/lib/market/__tests__/sponsor-client.test.ts`
7. `src/lib/market/sponsored.ts`
8. `contracts/clarinet/contracts/xtrata-market-sponsored-stx-v1.1.clar`
9. `contracts/clarinet/contracts/xtrata-drops-v1.0.clar`
10. `docs/plans/SPONSOR-RELAYER-RUNBOOK.md`

