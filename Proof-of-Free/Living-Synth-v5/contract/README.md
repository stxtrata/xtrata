# Proof of Free — recording-fee contract (`recording-fees`)

A deliberately tiny Clarity contract. **Everything else runs on Xtrata's native
infrastructure** — the editions are Xtrata inscriptions (SIP-009 tokens), so
ownership, transfers and marketplaces are Xtrata's; child recordings that evolve a
synth are inscribed as Xtrata **parent-child** links; and a tile is revealed in the
mosaic simply by its **ownership** (it's held by someone other than the treasury). None
of that belongs in a contract.

This contract does **one thing**: collect the fee to inscribe a derivative recording,
paid to the treasury with an on-chain receipt, at an owner-updatable price.

## Function

```clarity
(pay-inscription-fee (kind uint) (parent uint) (ref (string-ascii 80)))
```

- `kind u0` — a **child performance** (`xtrata-performance` JSON that evolves a synth) → **0.1 STX**
- `kind u1` — a **live set** (`xtrata-session` JSON) → **1 STX**
- `parent` — the edition being evolved (`u0` for a live set)
- `ref` — the recording's Xtrata inscription id or content hash

It transfers the fee to the treasury, stores a receipt, and prints a `recording-fee`
event for indexers. The mosaic / your backend treats a recording as paid-for by matching
its receipt.

## Admin (owner-only)

`set-child-fee` · `set-live-set-fee` · `set-treasury` · `transfer-ownership`.

## Read-only

`get-fees` · `get-receipt (rid)` · `get-receipts-count` · `get-treasury` · `get-owner`.

## Tests

```sh
npm install
npm test          # vitest + clarinet-sdk — 8 tests, all green
```

Coverage: default fees (0.1 / 1 STX), child + live-set payments move the right amount to
the treasury and log a receipt, unknown kind rejected, owner-updatable fees applied,
non-owner locked out of admin, treasury re-routing, and ownership hand-over.
