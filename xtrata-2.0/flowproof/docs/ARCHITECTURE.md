# FlowProof architecture

## The one-line thesis
Every FlowVault money movement emits a canonical receipt that is inscribed
on-chain via Xtrata v3.2.3 and recursively linked to (a) the asset it concerns
and (b) the previous receipt — producing an immutable, queryable financial
lineage.

## Data flow (Pattern A — implemented)

1. **Configure** — `FlowVault.set-routing-rules` sets split + time-lock.
2. **Pay** — `FlowVault.deposit` runs the deterministic pipeline:
   split → lock → hold (aborts if split + lock > deposit).
3. **Read truth** — `FlowVault.get-vault-state` returns locked/unlocked + rules.
4. **Build receipt** — deterministic JSON (stable key order so identical content
   dedupes to one canonical token).
5. **Inscribe + link** — `Xtrata.mint-single-tx-with-relationships`:
   - `dependencies = [assetInscription]` — the work must already exist
     (contract enforces via `validate-dependencies`).
   - `parents = [prevReceipt]` — the lineage chain (`validate-parents`).
   - single transaction, receipt content stored fully on-chain.
6. **Query lineage** — `get-parents` / `get-dependencies` / `get-inscription-summary`,
   or the Xtrata relationship index (`/index/relations/<contract>?id=`).

## Why v3.2.3 specifically
- **Native single-tx mint** (`mint-single-tx*`) — receipt + lineage in one tx;
  v2 needed a separate small-mint helper.
- **Dual relationship model** — `dependencies` (content/recursion, must exist)
  vs `parents` (lineage). FlowProof maps asset→dependency, prev→parent, which is
  exactly the right semantics for a royalty/payroll chain.
- **Fee quoting on-chain** — `quote-single-tx-fee` drives the STX post-condition
  cap, so spend is bounded precisely (`PostConditionMode.Deny`).
- Limits that matter here: `CHUNK-SIZE` 16384, `MAX-SINGLE-TX-CHUNKS` 32.
  Receipts are < 1 chunk, so always single-tx.

## Hashing invariant
Receipt content hash MUST equal the contract's `process-chunk` chain:
`next = sha256(concat(running, chunk))` from 32 zero bytes. Implemented in
`receipt.ts::computeExpectedHash`. Divergence → `ERR-HASH-MISMATCH (u103)`.

## Pattern B — atomic on-chain composing contract (implemented)
`flowproof-treasury.deposit-and-prove` calls, in ONE transaction:
`flowvault-v2.deposit` (token passed as SIP-010 trait) then
`xtrata-v3-2-3.mint-single-tx-with-relationships`. Both succeed or both revert —
money movement and its permanent record are atomic. This is the composable
primitive (not two SDK calls in sequence).

Key property: `tx-sender` propagates through `contract-call?` (no `as-contract`),
so FlowVault applies the **user's** routing rules and moves the **user's** tokens,
and Xtrata records the **user** as the inscription creator/owner. The treasury
contract is pure glue with no custody. (While Xtrata is paused, the user must be
the Xtrata owner or the treasury must be an allow-listed caller; for the live demo
the deployer is the owner.)

Atomic receipts carry `mode: "atomic"` and an empty `depositTxid` — the receipt's
own mint tx *is* the deposit tx.

## Full lifecycle
Receipts are inscribed for the whole money lifecycle, each linked into the chain:
deposit/split/lock (`royalty-split`, `payroll`, ...) and `withdrawal`. The result
is a complete, append-only, on-chain audit trail per asset/treasury.

## Independent verifier (`scripts/verify.ts`)
Trustless check of any receipt from public chain data only:
1. **Integrity** — recompute the content hash from on-chain chunks; must equal the
   inscription's stored `final-hash`.
2. **Lineage** — on-chain `get-parents`/`get-dependencies` must equal the receipt's
   `links` (prevReceipt / assetInscription).
3. **Money** — the receipt's amounts must equal the real FlowVault `deposit`/
   `withdraw` print event. For atomic receipts the mint tx is found via the NFT
   history API and must be a `flowproof-treasury` call carrying that same event —
   proving the money and the record happened in one transaction.

## Trust model
- Receipts are stored *in* the inscription (on-chain bytes), not a link to
  off-chain JSON — nothing to rot or spoof.
- Content hash is independently recomputable by any auditor.
- Lineage edges are on-chain and enforced (dependencies must exist).
- The orchestrator's signer only pays fees + moves the user's configured amounts;
  spend is bounded by post-conditions.
