# Proof of Free — reveal contract (`proof-of-free-reveal`)

A SIP-009 NFT contract on **Stacks (Clarity 2)** that is the on-chain source of
truth the mosaic reads. The mosaic starts empty and lights up a tile the **first
time that tile's token leaves the Xtrata treasury wallet** — gifted or sold — so
distribution drives the reveal and you keep full control of pace.

## How the reveal works

- Every edition mints into the **treasury** (the Xtrata wallet, `set-treasury`).
- The standard SIP-009 `transfer` flips a per-token **reveal bit** the first time
  a token's `sender` is the treasury. Secondary transfers (holder → holder) never
  change the reveal set, and a token that returns to treasury and leaves again is
  not double-counted.
- Reveal state is a **1,024-bit map** stored as 32 × 32-bit chunks
  (`get-revealed-chunks` → `(list 32 uint)`), so the mosaic reads the whole set in
  one call.

## Verifiable random placement (pre-committed shuffle)

Token `#k` maps to mosaic position `S[k-1]`, where `S` is a Fisher–Yates shuffle of
`1..1024` seeded by a **committed** seed. The seed is committed as a hash at deploy
(`commit-seed`) and revealed later (`reveal-seed-value`, which checks
`sha256(seed) == hash`). The permutation is computed **off-chain** by the mosaic and
any verifier — the contract only guarantees the seed's integrity, so nobody can
re-pick a favourable placement after the fact. Canonical algorithm: splitmix32 seeded
from the revealed seed, Fisher–Yates over `[1..1024]` (matches the mosaic's `shuffleOrder`).

## Recording-inscription fees (owner-updatable)

Owners pay to inscribe a recording, collected to the treasury with an on-chain log:

- `child-recording-fee` — **0.1 STX** (100,000 µSTX) — a parent/child performance (`xtrata-performance`).
- `live-set-fee` — **1 STX** (1,000,000 µSTX) — a live set (`xtrata-session`).
- `pay-recording-fee (kind parent recording-hash)` — `kind u0` = child, `u1` = live set.
- `set-child-recording-fee`, `set-live-set-fee` — owner updates the price any time.

## Public functions

`mint`, `mint-many` (owner → treasury) · `transfer` (SIP-009, reveals on treasury exit) ·
`commit-seed`, `reveal-seed-value` · `pay-recording-fee` · `set-child-recording-fee`,
`set-live-set-fee` · `set-inscription` (position → Bitcoin inscription id) ·
`set-treasury`, `set-base-uri`, `transfer-ownership`.

## Read-only (what the mosaic / verifiers call)

`get-revealed-chunks` · `is-revealed (id)` · `get-revealed-count` · `get-minted-count` ·
`get-reveal-hash` · `get-reveal-seed` · `get-fees` · `get-inscription (id)` ·
`get-recording (rid)` · `get-treasury` · `get-config` · SIP-009 `get-last-token-id` /
`get-token-uri` / `get-owner`.

## Deploy + operate sequence

1. **Deploy** `nft-trait` then `proof-of-free-reveal` (treasury/owner default to the deployer).
2. `commit-seed <sha256(seed)>` — commit the placement seed's hash.
3. `reveal-seed-value <seed>` — reveal it (before distributing, so the mosaic can place tiles).
4. `mint` / `mint-many` — mint each inscribed batch's editions into the treasury; `set-inscription` records each Bitcoin inscription id.
5. **Distribute** — `transfer` tokens out of treasury (gift or sale); each first exit reveals its tile.

## Tests

```sh
npm install
npm test          # vitest + clarinet-sdk — 18 tests, all green
```

Coverage: config/defaults, owner gating, minting (single/batch, dup/range), reveal-on-exit
(first exit only, secondary no-op, no double-count, cross-chunk bit), commit/reveal (wrong
seed rejected, single reveal), fees (0.1 / 1 STX moved to treasury, updated fee applied,
bad kind), inscription registry, and the revealed-chunks view.
