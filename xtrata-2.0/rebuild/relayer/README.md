# @xtrata/relayer — sponsor relayer for `xtrata-drops-v3`

Off-chain half of the sponsorship component described in
[`docs/05-SPONSORSHIP.md`](../docs/05-SPONSORSHIP.md). The core
(`src/*.ts` minus `cf-adapter.ts`) is platform-agnostic: it runs under vitest in
Node and unmodified inside a Cloudflare Worker/Pages Function. All chain access
goes through the injectable `ChainTransport`, so every test runs against a fake
chain with no network.

```
npm install
npm test          # vitest run
npm run typecheck # tsc --noEmit
```

## Endpoint contract

All routes are mounted under `/sponsor/v3`. Requests and responses are JSON.
Errors are always `{ "ok": false, "code": "<STABLE_CODE>", "detail?": "..." }` —
codes are machine-readable and stable; internals (stack traces, upstream node
bodies) are never returned.

| Method | Path | Body | 2xx response |
|---|---|---|---|
| POST | `/sponsor/v3/quote` | `{ dropId }` | `{ ok, feeUstx, budgetRemaining }` (µSTX as decimal strings) |
| POST | `/sponsor/v3/submit` | `{ txHex, dropId?, contractId?, functionName? }` | `201 { ok, jobId, state, sponsorTxid, existing:false }`, or `200` with `existing:true` for an idempotent resubmit |
| GET | `/sponsor/v3/status/:jobId` | — | `{ ok, jobId, state, dropId, claimer, sponsorTxid, claimFeeTxid, refundTxid, error, createdAt, updatedAt }` |
| POST | `/sponsor/v3/attest` | `{ dropId, claimer }` | `{ ok, dropId, claimer, expiresAt, signature }` (signed-eligibility drops only) |
| GET | `/sponsor/v3/health` | — | `{ ok, sponsorAddress, floatUstx, unsettled, disabled, shutdownDrops }` |

Anything else → `404 NOT_FOUND`. A body that is not a JSON object (including
unparseable JSON, which the adapter maps to `{}`) is treated as empty and fails
the route's own field validation with `400 BAD_REQUEST`.

### submit authorization pipeline

**The signed transaction is the sole source of truth** (threat 17). Body hints
are advisory; any contradiction is `BODY_MISMATCH`. In order:

1. `validate.ts` — decode: sponsored auth, origin fee 0, single-sig P2PKH
   origin, correct network version, contract == `DROPS_CONTRACT_ID`, function ∈
   {`claim`, `claim-signed`, `reserve-claim`}, argument shapes, post-condition
   mode Deny, and at most one post-condition which must be the pinned core
   NFT `sent` condition on the drops contract principal (never STX or an asset
   leaving the claimer).
2. Kill switches: `RELAYER_DISABLED`, per-drop deny list, per-drop exposure
   shutdown.
3. Payload-hash idempotency: an identical `txHex` returns the existing job.
4. Rate limits (per wallet, per origin), `MAX_UNSETTLED` capacity, float floor.
5. `preflight.ts` (read-only chain): drop exists / active / mode 3 / eligibility
   matches the entrypoint / not paused / window open / `budget-remaining ≥ fee`
   / wallet under `per-wallet-limit` / items remaining > 0 (the last two are
   skipped when the claimer holds a reservation).
6. Job insert with `UNIQUE(payload_hash)` and a partial `UNIQUE(drop_id,
   claimer)` over non-terminal states — the off-chain race guard.
7. Lease (`RECEIVED → SIGNING`) → nonce from the single-writer authority →
   `sponsorTransaction` → idempotent broadcast → `SPONSORED`.

### Error codes

`BAD_REQUEST`, `BAD_TX`, `TX_TOO_LARGE`, `NOT_SPONSORED`, `NONZERO_FEE`,
`NOT_CONTRACT_CALL`, `CONTRACT_NOT_ALLOWED`, `FUNCTION_NOT_ALLOWED`, `BAD_ARGS`,
`WRONG_NETWORK`, `PC_MODE`, `WRONG_POST_CONDITIONS`, `UNSUPPORTED_ORIGIN`,
`BODY_MISMATCH`, `DUPLICATE_CLAIM`, `JOB_RACE` → **400**;
`DROP_NOT_FOUND` → **404**; `DROP_NOT_ACTIVE`, `DROP_NOT_SPONSORED`,
`CONTRACT_PAUSED`, `WINDOW_CLOSED`, `BUDGET_EXHAUSTED`, `WALLET_LIMIT`,
`SOLD_OUT`, `WRONG_ELIGIBILITY` → **400**; `RATE_LIMITED` → **429**;
`CAPACITY`, `LOW_FLOAT`, `RELAYER_DISABLED`, `DROP_SHUTDOWN`,
`ATTESTOR_NOT_CONFIGURED` → **503**; `BROADCAST_REJECTED`, `SPONSOR_ERROR` →
**502**; unexpected failures → **500 `INTERNAL`**.

## Fee policy

```
fee = min(estimate × FEE_MULTIPLIER(3), maxFeeUstx(2 STX), on-chain claim-fee-cap)
```

The quote is the fee that will actually be attached; a drop whose
`fee-budget-remaining` cannot cover it is `BUDGET_EXHAUSTED` (the relayer never
attaches a smaller, likely-unmineable fee just because the budget is low).
Settlement calls (`claim-fee`, `settle-refund`) are priced the same way.

## Job state machine

```
RECEIVED ──lease──▶ SIGNING ──broadcast──▶ SPONSORED ──tx success──▶ CONFIRMED
   │                   │                       │                        │
   │                   └── reject/reap ────────┤                        │ claim-fee
   │                        back to RECEIVED   │ abort/dropped          ▼
   └────────────▶ FAILED ◀──────────────────── ┘                  FEE_CLAIMING
                                                                        │ broadcast ok
                                                                        ▼
                                            SETTLED ◀── REFUNDING ◀─ FEE_CLAIMED
                                               ▲          (drop ended,     │
                                               └──────────  budget left)───┘
```

* Every transition is `UPDATE … SET state=? WHERE id=? AND state=?` and only
  proceeds when exactly one row changed (threat 18). Illegal transitions throw.
* In-flight states hold a lease (`LEASE_TIMEOUT` 15 min). `reapExpiredLeases`
  reverts a crashed worker's job one state back — `SIGNING→RECEIVED`,
  `FEE_CLAIMING→CONFIRMED`, `REFUNDING→FEE_CLAIMED` — so nothing strands and
  nothing is double-signed.
* Unsettled states (counted against `MAX_UNSETTLED`): `RECEIVED`, `SIGNING`,
  `SPONSORED`, `CONFIRMED`, `FEE_CLAIMING`.
* Settlement is **traffic-driven**: `settle()` runs on every request and
  advances at most `settleBatch` jobs. If traffic stops nothing is lost — the
  contract lets creators self-refund 144 blocks after end/cancel.
* Broadcast is idempotent: the exact txid is checked with the node before and
  after any send, so a lost response or an "already known" rejection advances
  the job instead of re-signing with a fresh nonce (threat 19).
* `reserve-claim` jobs settle without a `claim-fee` call; the follow-up `claim`
  job settles the fee.

## Exposure invariant & kill switches

Per drop the relayer tracks `Σ fees fronted − Σ claim-fee reimbursed`. Crossing
`maxFloatLossUstx` sets that drop's shutdown flag: further submits return
`DROP_SHUTDOWN` and the drop id appears in `/health`. An operator clears it with
`relayer.clearShutdown(dropId)`. Other switches: `RELAYER_DISABLED` (global),
`DENIED_DROPS` (per drop), and on-chain `set-sponsor` rotation, which
invalidates the relayer entirely.

> **Known limitation.** The audit ledger and the claim-fee pending map are
> in-memory (per isolate); `sponsor_audit_v3` in `schema.sql` is provisioned but
> not yet written. Reimbursement confirmation falls back to the durable job row,
> so a restart cannot inflate exposure, but exposure totals themselves reset
> with the isolate. Persisting the ledger to D1 is the remaining work for a
> fully durable invariant.

## Environment

| Var / binding | Required | Purpose |
|---|---|---|
| `SPONSOR_KEY` | yes | Sponsor hot-wallet private key (hex + `01` suffix). Signs sponsorships, `claim-fee`, `settle-refund`. |
| `ATTESTOR_KEY` | signed drops only | Attestor private key. Absent → `/attest` returns `503 ATTESTOR_NOT_CONFIGURED`. Its `hash160(pubkey)` must equal the contract's `attestor-pubkey-hash`. |
| `DROPS_CONTRACT_ID` | yes | **The allowlist.** The only contract the relayer will sponsor, e.g. `SP….xtrata-drops-v3`. |
| `NFT_CONTRACT_ID` | yes | Pinned core NFT contract; the accepted post-condition asset is `${NFT_CONTRACT_ID}::xtrata-inscription`. |
| `DB` | yes | D1 binding for `sponsor_jobs_v3` (see `src/schema.sql`). |
| `SPONSOR_NONCE` | production | Durable Object namespace holding the single-writer nonce authority (one instance keyed `sponsor`). Without it the adapter falls back to an in-memory authority — safe only for single-isolate local dev. |
| `HIRO_API_KEY` | recommended | Sent as `x-api-key` to `api.hiro.so`. |
| `RELAYER_DISABLED` | no | `1`/`true` → global kill switch. |
| `DENIED_DROPS` | no | Comma-separated drop ids to refuse. |

Non-secret tuning lives in `defaultConfig` (`src/types.ts`): `feeMultiplier 3`,
`maxFeeUstx 2 STX`, `floatFloorUstx 5 STX`, `maxUnsettled 20`,
`ratePerWallet 5`, `ratePerOrigin 20`, `rateWindowMs 1h`, `settleBatch 4`,
`leaseTimeoutMs 15m`, `maxFloatLossUstx 10 STX`, `attestationTtlBlocks 100`,
`maxTxHexChars 20000`.

## Cloudflare deployment

1. Create the D1 database and apply the schema **once** (never per request):
   `wrangler d1 execute <db> --file=src/schema.sql`.
2. Bind it as `DB`; bind the nonce Durable Object namespace as `SPONSOR_NONCE`
   (the DO class runs an `InMemoryNonceAuthority` per sponsor address behind
   `POST /lease` → `{ nonce, leaseId }` and `POST /complete` →
   `{ leaseId, outcome }`; see `DurableObjectNonceAuthority` in `src/nonce.ts`).
   One instance keyed by sponsor address is what makes it globally
   single-writer — do not shard it.
3. Put secrets in with `wrangler secret put SPONSOR_KEY` / `ATTESTOR_KEY`;
   `DROPS_CONTRACT_ID` and `NFT_CONTRACT_ID` are plain vars, updated only after
   the canary has verified the deployed contracts (threat 16).
4. Re-export the entrypoint from the Pages Function that owns the route, e.g.
   `functions/sponsor/v3/[[path]].ts`:
   ```ts
   export { onRequest } from '../../../relayer/src/cf-adapter.js';
   ```
   The adapter handles CORS (`OPTIONS` → 204, `Cache-Control: no-store`), JSON
   translation, and uses `cf-connecting-ip` as the per-origin rate-limit key.
5. Rotating the sponsor: fund the new hot wallet, call `set-sponsor` on chain,
   then swap `SPONSOR_KEY`. The old key can no longer claim fees, so drain any
   in-flight settlement first (`/health` `unsettled` → 0).

## Tests

| File | Covers |
|---|---|
| `tests/validate.test.ts` | signed-tx decoding, post-condition policy, body hints |
| `tests/nonce.test.ts` | single-writer serialization, gaps, conflicts |
| `tests/jobs.test.ts` | CAS transitions, unique guards, lease reaping, counters |
| `tests/preflight.test.ts` | every read-only reject code and the drop readers |
| `tests/sponsor.test.ts` | quote/submit/settlement orchestration, concurrency, exposure |
| `tests/attest.test.ts` | digest byte-parity with the contract, tampering, `/attest` policy |
| `tests/http.test.ts` | route handlers, status/code mapping, health, 404s |
