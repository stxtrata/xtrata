# Collection mint v1.5 for core v3.2.3

Review and implementation notes — 14 September 2026.

## Outcome and scope

Built an undeployed v1.5 collection helper against the actual v3.2.3 core, derived from v1.4. Local source: `contracts/clarinet/contracts/xtrata-collection-mint-v1.5.clar`. Generated mainnet candidate: `contracts/live/xtrata-collection-mint-v1.5.clar`. The `live` folder is a source convention, not evidence that this candidate is deployed. No deployment, payment, inscription, or remote storage deletion was performed.

The storage plan below now has an opt-in implementation: [automatic storage cleanup](COLLECTION-STORAGE-AUTOMATION.md). It uses two verification passes, a waiting period and a verified permanent recovery copy before staging eviction; routine cleanup needs no operator approval. It is not deployed or activated. The [manager and public mint integration](COLLECTION-V1.5-CLIENT-INTEGRATION.md) is now implemented locally. New standard manager deployments select v1.5; existing collections and generic SDK workflow defaults remain unchanged. No fictitious deployed address was added to the runtime contract registry.

## Old helper review

The latest checked-in collection helper is v1.4, pinned to **core v2.1.0**, rather than the immediately preceding 3.2.x core. The v1.4 tests exercise v2.1.0. This establishes the repository's tested baseline; it does not independently establish which collection deployment last succeeded on mainnet.

Relevant sources:

- `contracts/clarinet/contracts/xtrata-collection-mint-v1.4.clar`: phases, allowlists, wallet/supply limits, reservations, payout splits, minted index, registered token URIs, operator/finance roles, recipient editors and ownership transfer.
- `contracts/clarinet/contracts/xtrata-v3.2.3.clar`: actual target ABI and storage behavior.
- `contracts/clarinet/contracts/xtrata-preinscribed-collection-sale-v1.0.clar`: separate escrow/sale model for NFTs already inscribed. Reuse an existing NFT through ownership/escrow/transfer; never claim it was newly minted to a buyer merely because its bytes match.

Findings:

1. **ABI mismatch:** v1.4's upload trait takes `(list 50 (buff 16384))`; core v3.2.3 accepts 32. Merely changing the pinned principal is insufficient.
2. **Deduplication changed:** v3.2.3 intentionally allows duplicate inscriptions. `begin-or-get` always starts/resumes and returns `(ok none)`; its historical name must not be interpreted as reuse. `HashToId`/`get-id-by-hash` gives the first recorded ID, not an ownership or collection receipt.
3. **Inventory enforcement was missing:** v1.4's registered URI map provides metadata overrides, not a required list of mintable assets. A buyer can otherwise submit arbitrary content and consume supply.
4. **Reservations were per buyer/hash only:** multiple buyers could upload the same file concurrently. Collection cancellation only frees helper counters, not core upload storage.
5. **Fees occur at different steps:** retain begin → upload → seal, charge the collection price at successful seal, and preserve reserved prices. The small helper path remains atomic begin/upload/seal (maximum 30 chunks); it does not silently switch to the core's separately priced native single-transaction entry point. Obtain live quotes from the core; do not carry forward old fee estimates.

## Implemented helper behavior

- Pin every call and hash check to v3.2.3; use a 32-chunk upload ABI.
- Require admin-registered hashes before opening a session (`u123`). Existing registration functions are reused. Registration is still mutable by configuration admins; it is not an immutable collection commitment.
- Reserve a hash for one buyer within this helper (`u124`) before uploading. Release the hash lock on cancellation, administrative/expired release, successful individual/atomic mint, and batch mint. Supply, wallet and phase accounting retain v1.4 behavior.
- Reject a hash already indexed by this core (`u122`) at begin, upload, individual seal, batch seal and atomic small mint. The seal-time check closes the race where another uploader inscribes after reservation. A rejected transaction does not charge the collection sale price or increase mint counters.
- Emit a `collection-minted` print receipt containing core principal, hash, token ID, buyer and phase for every successful mint, including each batch item. Existing minted indexes and context readers remain available.
- Keep metadata and receipts on-chain, never off-chain URLs or storage credentials in cleanup instructions. The helper itself does not initiate an HTTP request or delete R2 data.

This is a **unique-content collection policy**. It does not support multiple identical-byte editions as separate core NFTs. For editions without duplicating media bytes, inscribe common media once and make each edition a distinct small manifest/wrapper referencing existing dependencies. That edition format and sale integration are a separate build. Do not advertise an `edition_cap > 1` for one identical hash under this helper.

Limits: deduplication covers the pinned core's hash index, not every chain or unmigrated legacy contract. Other callers may still duplicate content directly through the core. Publicly disclosed hashes/bytes can be inscribed first by another party; this helper then rejects that asset instead of charging for someone else's NFT. Hash reservation prevents competition inside one helper, not across all contracts. An existing core session is still keyed by transaction sender and hash, so a buyer can finish it directly outside the helper; that does not create a collection mint receipt or pay the collection price. If enforcing payment for *any* inscription of disclosed content is a requirement, an escrow/controller-owned upload design and restricted delivery flow are needed.

## Storage actually implemented

| Layer | Current implementation | Cleanup behavior / gap |
|---|---|---|
| Collection staging bytes | R2 `COLLECTION_ASSETS`, bucket `xtrata-manage-assets`; fallback bindings `ASSETS` and `R2` | Upload keys are `collectionId/randomUUID`, so equal files can occupy multiple objects. Direct PUT through the Pages route is supported; a `getUploadUrl` adapter branch exists but is not the native R2 Workers API. |
| Asset and reservation records | D1 `DB`, tables `collections`, `assets`, `reservations` | Stores expected hash, byte/chunk count, R2 key, edition cap and timestamps. Default asset TTL is 3 days; default manifest-accounted cap is 500 MiB per collection. Timestamps do not schedule deletion. |
| Manual staging deletion | `functions/collections/[collectionId]/assets.ts` | Rejects sold-out assets and assets with reservation history. Checks remaining key references, but deletes D1 first and catches R2 failure, potentially leaving an untracked object. |
| Whole collection deletion | `functions/collections/[collectionId].ts` | Deletes R2 objects/prefix and D1 records. This is a manual destructive operation, not per-mint reconciliation. |
| Reconciliation diagnostics | `functions/collections/[collectionId]/oversight.ts` | Reports R2/D1 drift and storage counts; does not repair it. |
| Viewing caches | `src/lib/viewer/cache.ts`; `functions/runtime/cache.ts` | IndexedDB browser cache plus separate `RUNTIME_CONTENT_CACHE` R2 bucket, with edge-cache fallback. Runtime keys include content identity and use a separate 5 GiB configured warning budget. `runtime/cache-purge.ts` is a protected operational purge route. These caches serve already-inscribed content and are not mint staging inventory. |
| Core pending upload | `UploadState` and `Chunks` maps | Owner/hash upload session, sequential batches, 4,320 Stacks-block inactivity expiry. `abandon-upload` marks expiry; permissionless `purge-expired-chunk-batch` takes sequential index batches of up to 50. No wall-clock scheduler is inside the contract. |
| Core sealed inscription | `InscriptionMeta`, `HashToId`, `Chunks` and migration source | Seal deletes the upload-state row and keeps chunks as the permanent content. A sealed token's bytes are not temporary storage. |

Sources: `wrangler.toml`, `functions/migrations/001_create_collections.sql`, `functions/collections/[collectionId]/{assets,upload-url,reserve,oversight,asset-preview}.ts`, the collection DELETE route and runtime/cache sources. The current `reserve.ts` confirmation route accepts a supplied action/transaction ID; its status is not cryptographic proof of a successful mint. No scheduled mint-driven staging cleaner was found in these implementations. Preview and production currently share the configured D1/R2 bindings, so destructive worker tests must use isolated bindings.

## Critical core cleanup hazard

The local simulation reproduces an existing v3.2.3 issue: sealed content and pending upload chunks use the same `{hash, creator, index}` keys. A creator can open a second session for an already sealed hash. After expiry, purging that second session can remove bytes still used by the first NFT, even when the second session uploaded no new chunks. `is-inscription-sealed` can remain true after bytes are missing.

Therefore **do not automate on-chain purge from hash presence**, and do not use sealed metadata alone as proof that a staging copy can be discarded. `HashToId` is first-seen only, so inspecting that one token cannot prove no other sealed token references a creator/hash chunk namespace. Core hardening should separate immutable sealed content from temporary sessions or maintain a complete sealed-reference guard; a new helper cannot patch an already deployed core. Until that is addressed, do not promise permanent recoverability from a hash lookup alone. The v1.5 tests include a local reproduction so this limitation remains visible.

## Recommended cleanup and reuse process

Yes: use core read-only state as a trigger for **off-chain** cleanup, with a reconciler making the R2 deletion. Start verification when the hash appears; physical deletion must wait for evidence and retention policy.

1. **Upload once:** compute Xtrata's chunk-fold hash (`H0 = 32 zero bytes; Hn = SHA256(Hn-1 || chunkn)`, 16,384-byte chunks). This is not ordinary whole-file SHA-256. Validate actual uploaded bytes server-side. Use an immutable content object ID, deduplicate within an authorized collection/tenant, and attach asset references. Keep an upload-intent record before PUT so failed manifest registration is recoverable. Never deduplicate on filename, claimed hash or size alone.
2. **Check before staging and before mint:** query the exact network/core hash index. If content exists, verify its bytes and offer reference/reuse, or an ownership-checked preinscribed sale. Do not open a second inscription solely to deliver the same media. If another owner holds it, mark a conflict or explicitly reference it; do not mark the intended sale fulfilled.
3. **Discover completions:** use successful canonical `collection-minted` receipts plus bounded hash polling/backfill for missed events and external inscriptions. Persist block hash/height, transaction ID, event index, core, token ID and rolling hash. Treat mempool status, client confirmation, upload-started events and a pending running hash as insufficient.
4. **Verify:** re-read canonical chain state after the configured confirmation window; confirm receipt origin/helper, core/network, actual token metadata, content hash, size and chunk count. Reconstruct through migration-aware chunk reads and verify the bytes, including migrated inscriptions. Settlement separately verifies buyer/mint context and any escrow ownership. A later NFT transfer must not undo a historically valid sale receipt.
5. **Separate sale state from storage state:** an external same-hash inscription may justify a verified reference, but is not a sale. Keep the asset manifest, reservation history, ownership/escrow records and accounting after bytes are removed. Resolve active reservations before eviction. Existing previews must fall back to the confirmed chain reference when a staging key is removed.
6. **Queue deletion durably:** transition storage through `staged → verified → delete-pending → deleted` with a retryable D1 outbox, immutable object key, complete reference checks and a claim/lease. In a transaction, disallow new references/uploads while deletion is claimed. Retain rows until R2 deletion succeeds; then record deletion time. If R2 succeeds and D1 acknowledgement fails, retry the same key idempotently. Do not catch-and-forget failures or delete the asset record first.
7. **Retain safely:** define a confirmation/grace interval and verified recovery copy policy before enabling byte eviction, especially given the core aliasing hazard. An off-chain recovery cache/backup does not duplicate anything on-chain. Default rollout is report-only, then controlled deletion with a retained verified copy until core durability is addressed. Avoid publishing unrevealed assets into a public runtime cache during staging.
8. **Sweep other garbage separately:** abandoned PUT objects need a paginated orphan scan joined against upload intents and all live references, with age/grace checks. Expired reservations need retryable reconciliation, not blind timestamp deletion during pending transactions. Unminted asset TTL needs owner-visible retention rules. Viewing cache eviction uses its own capacity policy, never the staging cleanup signal. Core pending-chunk purge stays disabled in this cleanup service.

R2's Workers `delete(key)` API does not provide a compare-and-delete condition; prevent overwrites and reference creation with application-level object lifecycle controls. D1 and R2 are not one atomic transaction. [Cloudflare R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/). The observer can query core state without broadcasting transactions. [Stacks read-only calls](https://docs.stacks.co/stacks.js/read-only-calls).

## Remaining integration plan

1. Review the candidate's unique-content/registered-inventory policy, payout roles and mutable metadata policy. Resolve core sealed-chunk protection before enabling irreversible automatic deletion.
2. Add storage object/reference, upload-intent, verified-chain-proof and cleanup-outbox tables with unique keys and lifecycle constraints. Backfill existing UUID objects by server-verified content hash; do not rewrite or delete old keys without a reference audit.
3. Build an authenticated bounded reconciler and scheduled runner against isolated D1/R2 bindings. Add tests for malformed/untrusted confirmations, wrong networks, token ID zero, reorgs, unavailable/missing chunks, migration fallback, concurrent reservations/references, overwrite attempts, lost acknowledgements, R2 failure, and orphan pagination.
4. Integrate the manager/SDK with v1.5's 32-chunk ABI, mandatory registration, hash locks, `u122/u123/u124`, receipts, verified existing-content handling and post-eviction previews. Do not use the legacy template editor to change only the core constant: this candidate also has a static pinned-core hash-check call. `contracts:sync` generates both references together.
5. Deploy/configure a separate helper per collection through the existing user-driven deploy flow; verify the deployed source/interface and add its real registry entry. Allowlisting is needed only when the core is paused and this caller must bypass that pause, not for normal participation in an unpaused core. Review staged/small fee quotes and wallet postconditions.
6. Run an isolated end-to-end staging → reserve → begin/upload/seal → confirmed receipt → preview fallback → queued R2 eviction test. Begin production reconciliation in report-only mode, inspect its evidence, then enable the approved retention policy. No automatic payment/signing or production deletion is authorized by local testing.

## Validation and handoff

- `npm --prefix contracts/clarinet test -- tests/xtrata-collection-mint-v1.5.test.ts tests/xtrata-collection-mint-v1.4.test.ts`: **31 passed** (20 new candidate/core-behavior checks, 11 existing v1.4 regressions).
- Coverage includes actual v3.2.3 trait compatibility, buyer ownership and exact receipt, registered inventory, duplicate begin/upload/seal/atomic/batch rejection, one-buyer hash locks, cancellation/admin/expiry release, phase counters, wallet/pause controls, 32-chunk upload, recursion, price snapshots, payment-failure rollback, invalid-begin rollback and the inherited core purge hazard.
- `clarinet check --manifest-path contracts/clarinet/Clarinet.toml`: 51 contracts compile. Clarinet also reports unchecked-data warnings; passing compilation is not a security audit.
- `npm run contracts:verify` and targeted ESLint for `scripts/contract-variants.mjs` passed.
- The generated simnet deployment plan includes the new helper after its core dependency. Tests use disposable local simulated accounts only. No media assets, wallet secrets, runtime registry defaults or remote storage were changed.
