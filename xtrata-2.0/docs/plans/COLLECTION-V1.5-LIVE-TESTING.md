# Collection v1.5 live testing plan

## Verified deployment — 15 September 2026

Contract: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-collection-mint-v1-5`.
Transaction: `0x6394d38a0e8b8fcb572343ddc8879b480eb065b96824cf88d9e3901bd46bc3e3`.
Canonical successful publication at Stacks block 8994852. Exact source SHA-256:
`0f2dcba375a863a8c3c4ef8516d81fbd305a3c208961a85612f3ee9eb38ede57`.
The transaction API returned no Clarity version; do not infer it from that field.
Local unchanged-source simulation suite passes with the helper set to Clarity 4.

Read-only checks confirmed expected owner and v3.2.3 core, paused=true,
max-supply/minted/reserved/price=0, all splits=0, recipients=deployer,
finalized=false. No configuration or transactions changed during verification.

## 1. Local regression gate

Already passed: 20 collection/core simulations, 26 canary/browser tests and Vite
build. Before funded testing, extend coverage for admin/finance/operator permissions,
invalid split totals, metadata/inventory controls, phase dates/caps, expiry and
one-time supply/finalization. Use local simulations for destructive or intentionally
failing transactions. Verify exact source stays pinned and compilation stays at 4.

## 2. Isolated on-chain smoke test

Use disposable wizard wallets A/B and a separate helper instance of the same
source, administered by a disposable wallet. Never use personal, production
deployer or sponsor wallets for testing. Production max-supply is single-use:
do not configure it merely to run a small test. Keep the deployed production helper
paused until its actual collection terms and inventory are chosen.

Prepare unique tiny fixtures with the protocol rolling hash (not ordinary file
SHA-256), expected bytes/MIME/URI, and a manifest recording each role and expected
outcome. Use a fresh hash for each independent happy path. Collect a current fee
quote and obtain explicit authorization for a capped spending/transaction budget
before funding, deploying the test instance or broadcasting mint calls.

| Test | Expected evidence |
| --- | --- |
| Staged begin/upload/seal | Buyer owns one NFT; reconstructed bytes/hash match; receipt maps buyer/hash/core/token; counters increment once; both reservation maps clear |
| Atomic small mint | Same evidence; one atomic transaction and no residual session |
| Valid two-item batch | Two distinct NFT IDs and receipts; consistent minted index and counters |
| A reserves, cancels; B reserves same hash | Lock transfers only after cancellation; supply/phase/wallet reservation counters return correctly |
| Existing sealed hash | Local simulation rejects begin/upload/seal/atomic duplicates without minting or collecting collection price |
| Foreign seal after reservation | Local simulation rejects stale seal and batch atomically; no price collection or partial index change |
| Recursive dependency | Expected existing dependency recorded; no duplicate inscription of dependency bytes |

For paid distribution, use separate disposable recipients and a small explicitly
approved collection price. Compare actual recipient deltas to split calculations,
separating miner fees and core protocol fees. Test changed-price reservations,
failed-payment rollback, wrong buyer, invalid core and duplicate batch entries
locally first. No intentional failing mainnet transactions are needed.

## 3. Storage lifecycle gate

Validate off-chain staging, database and worker configuration independently of
contract deployment. Start with isolated buckets/database and deletion disabled.
Confirm rolling-hash identity, exact core and token ID, complete reconstruction,
required confirmations, and an independently readable recovery copy. Reconcile
receipts only after canonical confirmation; a hash appearing on-chain alone does
not authorize deletion.

Exercise incomplete uploads, corrupt/missing chunks, wrong core, reorg or changed
verification, shared references, concurrent mint/cleanup, retries after each
storage/DB failure, duplicate uploads and expired orphan staging. Verify a second
full reconstruction after the configured grace period (current design: at least
six confirmations and 24 hours), then delete only eligible staging objects.
Recovery copies remain retained. Never invoke core purge for sealed hash data.

Pass evidence: staging removed only after both checks; recovery restored bytes
match exactly; no active references broken; audit trail complete; retries do not
repeat minting or remove recovery copies. Then enable a small bounded production
cleanup batch with the same gates.

## 4. Production release gate

Approve actual supply, price, recipients/splits, phases, dependencies, inventory
and wallet caps. Confirm the deployed contract's owner/admins, source and core,
register inventory while paused, and review a read-only readiness report. Only
then authorize configuration/signing and the first intended production mint.
Keep finalization and ownership handover outside the smoke test.

Deliverable: evidence report with source hash, manifest, transaction IDs, balances,
receipts, counters, reconstructed hashes and cleanup/recovery audit records.
Any source mismatch, wrong recipient/owner, accounting divergence or missing
recovery copy stops progression. No mainnet transaction budget is yet authorized.
