# Automatic collection storage cleanup

Implemented 2026-09-14. This extends the v1.5 helper work in
[COLLECTION-MINT-V1.5-AND-STORAGE.md](COLLECTION-MINT-V1.5-AND-STORAGE.md).
The feature is opt-in; this change does not apply remote migrations, deploy a
helper/worker, change live bucket policies, or remove live files.

## Automatic lifecycle

1. Verified uploads hash actual bytes using Xtrata's rolling 16 KiB chunk hash.
   An immutable upload intent and unique per-collection content claim reuse one
   staging key for identical bytes, including concurrent uploads. Asset manifests
   must match the recorded hash, byte count and chunk count. Limit: 32 MiB.
2. A bounded scheduled scan adopts legacy staging objects and discovers abandoned
   uploads. Referenced files require an allowlisted core, a deployed v1.5 helper,
   a sealed hash lookup at least six blocks behind the tip, and full on-chain
   reconstruction with the same hash. Hash presence alone is insufficient.
3. The first successful check records evidence and waits 24 hours by default.
   Unreferenced objects must first be at least seven days old and have no live
   upload intent. Orphans also receive the additional 24-hour waiting period.
4. A later worker invocation rechecks the original block's canonical status,
   reconstructs content again, and checks current helper reservations and all
   database references. Changed evidence restarts verification. SQL version
   checks and mutation guards freeze relevant references during eviction.
5. The worker writes a content-addressed copy to a **different private R2 bucket**
   using a conditional create, reads the complete copy back and verifies its hash
   and size. Only then may it delete the staging object. Recovery copies are
   deduplicated across collections and retained indefinitely.
6. The database retains asset, reservation, proof and audit records. Existing
   preview URLs fall back to the recovery copy. Cleanup does not infer a sale,
   mint a second NFT, or update sale history merely because another inscription
   has the same hash. Normal status reconciliation remains available after cleanup.

Routine files need no human approval. Failed checks leave bytes in storage and
appear in the manager's Storage cleanup queue. An optional “Keep in staging”
override excludes an item from further automation. Authenticated operators can
inspect a specific key or run a bounded pass; cron needs no interactive session.
Unsettled reservations that cannot be reconciled from chain evidence remain
exceptions. The worker does not guess ownership or cancel reservations.

## Why the recovery copy is permanent

The v3.2.3 core reproduction documented in the v1.5 plan shows that later upload
cleanup for the same creator/hash can remove chunks used by a sealed inscription.
A delayed hash check cannot prevent future loss of those chunks. Therefore this
implementation automates removal of staging duplicates, while retaining one
verified recovery copy. It never calls core purge and has no recovery-delete path.
This is safe staging cleanup, not a claim that all off-chain bytes can be discarded.

## Deployment prerequisites and rollout

Use isolated test D1 and R2 resources first. Existing preview deployments must not
share production cleanup resources. The example configuration intentionally has
invalid placeholder resource names and cannot be deployed unchanged.

1. Apply `functions/migrations/010_collection_storage_review.sql` to the target
   database after existing migrations. Preserve a database backup. Migration
   creates tracking tables and SQL guards; it performs no R2 operations.
2. Configure Pages Functions and the scheduled worker with the same D1 database
   and staging bucket; bind `COLLECTION_RECOVERY` to a physically different private
   bucket. Do not use two aliases of the same physical bucket. The runtime rejects
   identical handles but cannot prove Cloudflare binding identity.
3. The recovery bucket must have no expiration rule, public bucket URL, or other
   writer that overwrites/deletes its content-addressed objects. Restrict other
   credentials accordingly. Asset previews still use the existing application
   route and its existing visibility/cache rules.
4. Enable `COLLECTION_STORAGE_V2=1` on **every** Pages deployment/writer sharing
   these resources. Retire old direct PUT/presigned upload paths, direct-delete
   paths and out-of-band writers. Wait out every previously issued signed URL.
   Start with `COLLECTION_CLEANUP_MODE=report-only`. Do not roll back immutable
   writer enforcement while automatic cleanup is enabled.
5. Configure allowlisted core IDs and collection metadata `coreContractId` plus
   the full helper `contract_address`. v1.4 and pre-inscribed sale contracts lack
   v1.5's reservation API and are deliberately held for verification; no legacy
   contract is assumed safe. The v1.5 helper is an undeployed candidate. The subsequent
   [client integration](COLLECTION-V1.5-CLIENT-INTEGRATION.md) selects it for new
   standard manager deployments and implements granular public mint fee caps.
6. Set `COLLECTION_CLEANUP_WRITERS_LOCKED=1` only after the writer/bucket conditions
   above hold, then set `COLLECTION_CLEANUP_MODE=auto-quarantine`. Deploy the
   scheduled worker using an actual private config derived from
   `workers/collection-storage/wrangler.example.toml`. This is deployment setup,
   not a per-file approval requirement.
7. Confirm an isolated complete mint-to-recovery-preview run before production
   activation. Observe worker failures and the exception queue during rollout.
   To stop new evictions, set mode to `report-only` on both worker and Pages.
   Already-running invocations may finish; the recovery copy remains available.

| Configuration | Default / requirement |
| --- | --- |
| `COLLECTION_STORAGE_V2` | Disabled unless exactly `1` |
| `COLLECTION_CLEANUP_MODE` | Report only unless `auto-quarantine` or explicit `quarantine`; only `auto-quarantine` advances jobs automatically |
| `COLLECTION_CLEANUP_WRITERS_LOCKED` | Must be `1` before staging eviction |
| `COLLECTION_CLEANUP_GRACE_MS` | 86400000; minimum 3600000 |
| `COLLECTION_CLEANUP_ORPHAN_GRACE_MS` | 604800000; minimum 86400000 |
| `COLLECTION_CLEANUP_CONFIRMATIONS` | 6; minimum 6 |
| `COLLECTION_CLEANUP_CORES` | Comma-separated exact core IDs; defaults to the known mainnet v3.2.3 core |
| `COLLECTION_CLEANUP_ADMIN_TOKEN` | Pages secret, at least 32 random characters; authorizes queue and overrides |
| `COLLECTION_CLEANUP_SCAN_TOKEN` | Separate worker secret, at least 32 random characters; authorizes POST sweep only |
| `HIRO_API_KEY` | Server-side chain-read credential; existing key-list settings also supported |

The operations key is held only in component memory, never browser storage or a
URL. Cron uses its own binding access. No wallet, signing or transaction broadcast
is involved. Never put secrets in the example config or Git.

## Bounded work and recovery

Each sweep selects one collection, advances at most one eligible job, scans one
referenced key and one independently paginated R2 key. The example cron runs every
five minutes. Waiting periods are minima, not completion deadlines; large queues
need appropriately provisioned Worker limits and scheduling. Full reconstruction
uses batches of 50 chunks and can require many RPC calls for large files. Resource
limits or RPC failures retain data; validate capacity with representative file
sizes in isolated infrastructure before enabling production.

Conditional recovery writes, leases and retained proofs make retries safe after
R2 success with lost D1 acknowledgement. A completed immutable upload whose D1
acknowledgement was lost can be adopted after its intent expires. A corrupt or
missing source/recovery object prevents deletion. Discovery errors are returned
by the sweep; monitored Worker invocation results and the queue should both be
checked. Recovery objects do not have an automated expiry or restoration writer.

## Validation notes

- Node 22.20: targeted storage, chain, existing staging/preview and upload tests
  pass, including real SQLite migration/trigger execution and a Clarinet v1.5 /
  v3.2.3 mint-to-cleanup-to-preview simulation. The simulation stubs block anchoring;
  separate RPC tests check confirmations, canonical block evidence and reorgs.
- Fault tests cover corrupt recovery data, failed writes, lost D1 acknowledgement,
  concurrent workers/uploads, stale references, delayed upload recovery, retention
  overrides, auth isolation and existing-content versus collection-sale evidence.
- SQL/simnet tests require Node 22 with `node:sqlite`; install the Clarinet
  project's dependencies for the integration test. These tests skip on older Node.
- Vite application build and local Worker bundling are validation gates. Production
  infrastructure and real network behavior require the isolated deployment step.
- The repository-wide Functions TypeScript check remains failing in existing
  tests/shared modules; it reports no errors in the new storage modules or changed
  collection routes. Targeted runtime tests and both bundles pass.

API references checked for this implementation: [Cloudflare R2 conditional writes](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
(returning null on a failed condition) and [Stacks read-only RPC](https://docs.stacks.co/reference/node-operations/rpc-api/smart-contracts)
(specific historical tip IDs are 64 hex characters without the `0x` prefix).
