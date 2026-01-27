# u64bxr-v9.2.17 — xStrata Optimized Protocol (SIP-009 Compatible)

This contract implements an open, chunked-upload inscription minting flow on Stacks, producing SIP-009 compatible NFTs (“xstrata-inscription”). Content is uploaded in fixed-size chunks, verified by an on-chain running hash, and permanently sealed (minted) once complete.

---

## Quick summary

- **Anyone can inscribe** (fees apply).
- Upload happens in **batches of up to 50 chunks**, each chunk up to **16 KB**.
- An upload is keyed by `{uploader, expected-hash}` and is **resumable** with no expiry.
- Sealing requires:
  - all chunks uploaded (`current-index == total-chunks`)
  - computed running hash equals `expected-hash`
  - non-empty token URI (<= 256 ASCII)
- After sealing, content is **immutable** (no post-mint edits).
- Supports optional **recursive dependencies** (up to 50 IDs), with **no forward references**.
- Includes admin controls for:
  - fee unit (bounded)
  - pause/unpause (blocks inscription writes only)
  - royalty recipient
  - contract ownership transfer
- Implements SIP-009 trait for wallet/indexer compatibility.

---

## NFT and token IDs

- NFT: `xstrata-inscription`
- Token IDs are sequential starting at `u0`.
- `next-id` is stored as a data-var; minting increments it by 1.

SIP-009 ID helpers:
- `get-next-token-id()` -> next mintable ID
- `get-last-token-id()` -> last minted ID (or 0 if none minted)

---

## Fees and royalties

The contract uses a **one-knob fee model** with `fee-unit` (microSTX).

Defaults and bounds:
- default: `u100000` (0.1 STX)
- min: `u1000` (0.001 STX)
- max: `u1000000` (1.0 STX)

Fee moments:

1) **Begin inscription** (charged once per new upload session)
- amount: `fee-unit`

2) **Seal (mint)** (charged at seal time)
- `batches = ceil(total-chunks / 50)`
- `seal-fee = fee-unit * (1 + batches)`

Recipient:
- fees are paid to `royalty-recipient`
- if `tx-sender == royalty-recipient`, transfer is skipped (no-op)

---

## Pause behavior

`paused` is an admin-controlled boolean.

When paused, these are blocked:
- `begin-inscription`
- `add-chunk-batch`
- `seal-inscription`
- `seal-recursive`
- `abandon-upload`

Not blocked:
- `transfer` (NFT transfers always work)
- all read-only functions (viewing metadata/chunks)

---

## Data model (storage)

### Data vars
- `contract-owner: principal`
- `next-id: uint`
- `royalty-recipient: principal`
- `fee-unit: uint`
- `paused: bool`

### Maps
- `TokenURIs: uint -> (string-ascii 256)`

- `InscriptionMeta: uint -> { owner, creator, mime-type, total-size, total-chunks, sealed, final-hash }`

- `InscriptionDependencies: uint -> (list 50 uint)` (optional)

- `UploadState: { owner: principal, hash: (buff 32) } -> { mime-type, total-size, total-chunks, current-index, running-hash }`

- `Chunks: { context: (buff 32), creator: principal, index: uint } -> (buff 16384)`

**Chunk addressing:**
- Pre-seal: `context = expected-hash` (the upload hash)
- Post-seal: `context = final-hash` stored in `InscriptionMeta`

---

## Content verification (hashing)

The contract verifies content by maintaining a running SHA-256:

- Initial `running-hash` is 32 bytes of zero.
- For each chunk in order:
  - `running-hash = sha256(running-hash || chunk-bytes)`

Sealing requires:
- `running-hash == expected-hash`

---

## Core public functions

### `begin-inscription(expected-hash, mime, total-size, total-chunks) -> (ok true)`
Start or resume an upload session.

- If a session `{tx-sender, expected-hash}` does not exist:
  - charges begin fee: `fee-unit`
  - inserts `UploadState` with `current-index=0` and zeroed running hash
- If it exists:
  - treated as resume (no fee)
  - parameters must match exactly (prevents silent mutation)

Fails with:
- `ERR-PAUSED` if paused
- `ERR-INVALID-BATCH` if `total-chunks == 0` or mismatched resume params

---

### `add-chunk-batch(hash, chunks) -> (ok true)`
Upload chunks in a batch.

Rules:
- `1 <= len(chunks) <= 50`
- `current-index + len(chunks) <= total-chunks`

Behavior:
- stores each chunk in `Chunks` at `{context=hash, creator=tx-sender, index=current-index}`
- updates running hash for each chunk
- increments `current-index` accordingly in `UploadState`

Fails with:
- `ERR-PAUSED`
- `ERR-NOT-FOUND` (no upload session)
- `ERR-INVALID-BATCH`

---

### `seal-inscription(expected-hash, token-uri-string) -> (ok new-id)`
Seals the upload and mints a token.

Requires:
- not paused
- all chunks uploaded: `current-index == total-chunks`
- hash match: `running-hash == expected-hash`
- non-empty token URI

Does:
- charges seal fee
- mints `xstrata-inscription` at `new-id = next-id`
- stores `InscriptionMeta` and `TokenURIs`
- deletes `UploadState`
- increments `next-id`

Fails with:
- `ERR-PAUSED`, `ERR-INVALID-BATCH`, `ERR-HASH-MISMATCH`, `ERR-INVALID-URI`

---

### `seal-recursive(expected-hash, token-uri-string, dependencies) -> (ok new-id)`
Like `seal-inscription`, but also stores a dependency list.

Dependency rule:
- A dependency “exists” iff `dep-id < next-id` at seal time.
- No burns are supported; IDs are assumed sequential.

Fails with:
- `ERR-DEPENDENCY-MISSING` if any dep is not considered existing

---

### `abandon-upload(expected-hash) -> (ok true)`
Uploader-only cleanup.

- Deletes only the `UploadState` record for `{tx-sender, expected-hash}`
- **Does not delete chunks**

Fails with:
- `ERR-PAUSED`
- `ERR-NOT-FOUND`

---

## SIP-009 functions (wallet/indexer compatibility)

- `get-last-token-id() -> (ok uint)`
- `get-next-token-id() -> (ok uint)`
- `get-token-uri(id) -> (ok (optional (string-ascii 256)))`
- `get-owner(id) -> (ok (optional principal))`
- `transfer(id, sender, recipient) -> (ok true)`  
  Requires `tx-sender == sender` and sender owns token.

Transfers are **not** paused.

---

## Read-only “viewer” utilities

- `get-inscription-meta(id) -> (optional meta)`
- `get-chunk(id, index) -> (optional (buff 16384))`  
  Looks up `final-hash` and `creator` from meta, then fetches chunk.

- `get-dependencies(id) -> (list 50 uint)` (empty list if none)
- `get-upload-state(expected-hash, owner) -> (optional state)`
- `get-pending-chunk(hash, creator, index) -> (optional (buff 16384))`

---

## Admin functions

Admin is `contract-owner`.

- `set-royalty-recipient(recipient)`
- `set-fee-unit(new-fee)`  
  Bounds:
  - min/max absolute
  - max 2× increase per change
  - max 10× decrease per change

- `set-paused(bool)`
- `transfer-contract-ownership(new-owner)`

Read-only admin helpers:
- `get-admin()`
- `get-royalty-recipient()`
- `get-fee-unit()`
- `is-paused()`

---

## Built-in SVG helpers (static icon)

- `get-svg(id) -> (ok (some svg))` if token exists
- `get-svg-data-uri(id) -> (ok (some data-uri))` if token exists

This is a single static SVG used as a safe fallback preview.

---

## Error codes

- `u100` ERR-NOT-AUTHORIZED
- `u101` ERR-NOT-FOUND
- `u102` ERR-INVALID-BATCH
- `u103` ERR-HASH-MISMATCH
- `u107` ERR-INVALID-URI
- `u109` ERR-PAUSED
- `u110` ERR-INVALID-FEE
- `u111` ERR-DEPENDENCY-MISSING