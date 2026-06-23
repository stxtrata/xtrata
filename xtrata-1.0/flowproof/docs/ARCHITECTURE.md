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

## Pattern B — on-chain composing contract (roadmap)
A `flowproof-treasury` Clarity contract that, in one transaction, calls
`flowvault-v2.deposit` (passing the SIP-010 token trait) and
`xtrata-v3-2-3.mint-single-tx-with-relationships`. Strongest possible
"composability + deep integration" proof. Note: FlowVault rules are
principal-scoped, so the contract becomes the treasury principal — ideal for the
DAO/escrow treasury case, not per-user vaults.

## Trust model
- Receipts are stored *in* the inscription (on-chain bytes), not a link to
  off-chain JSON — nothing to rot or spoof.
- Content hash is independently recomputable by any auditor.
- Lineage edges are on-chain and enforced (dependencies must exist).
- The orchestrator's signer only pays fees + moves the user's configured amounts;
  spend is bounded by post-conditions.
