# Xtrata Durable Media Network — Technical Design (Path A + Path B)

**Status:** Draft for internal review
**Date:** 23 June 2026
**Author:** Prepared for Xtrata (Jim)
**Scope:** Architecture for storing and distributing large, rights-managed media (e.g. a record-label master catalogue) where **Stacks is the source-of-truth, rights, and settlement layer** and **bytes live off-chain in a content-addressed, encrypted, redundant storage layer**. Covers Path A (anchor-on-Stacks + proven storage backends) and Path B (Xtrata-incentivised guardian storage network).

**Companion docs:** `Xtrata-Stacks-Pruning-SIP-Risk-Report.md` (why bytes must not live in MARF state), `docs/reconstruction-spec.md`, `docs/xtrata-backup-migration-service.md`, XIP-006 (Indexer/Resolver Conformance), XIP-009 (Manifest Authority Registry).

---

## 0. TL;DR

- **Chain holds:** content hashes, manifests, rights/licences, royalty splits, entitlement grants, storage placements, and (Path B) provider stakes + storage proofs. All compact.
- **Off-chain holds:** the actual master bytes — **encrypted by default**, **content-addressed**, **erasure-coded**, replicated across one or more storage backends.
- **Binding:** every off-chain blob is committed to the chain by hash. Any client can verify that the bytes it received are exactly the bytes UMG sealed, without trusting Xtrata.
- **Control:** masters are encrypted; decryption is gated by on-chain entitlements; revocation/takedown is achieved by **crypto-shredding** (destroying keys), not by trying to delete immutable data.
- **Settlement:** storage fees, royalties, and (Path B) provider rewards/slashing settle in **sBTC/STX** on Stacks, which anchors to Bitcoin via Proof-of-Transfer.
- **Path A** ships first on proven backends (Walrus/Storj default, Arweave/Filecoin optional) behind a pluggable adapter. **Path B** adds a staked, audited guardian network as progressive decentralisation — same hashes, same contracts, new storage providers.

---

## 1. Goals & non-goals

### Goals
1. Store multi-GB media durably and cheaply, off the MARF, with cryptographic proof that a given blob is the authentic sealed master.
2. Keep the on-chain footprint small, permanent, and pruning-safe (no `at-block`, no historical-state reads — see risk report).
3. Encrypt content at rest; gate access by on-chain rights; support revocation and legal takedown.
4. Serve a master that is both an archival original and a playable/streamable asset (Spotify-like UX for authorised players).
5. Settle storage, licences, and royalties in sBTC, with an auditable on-chain trail.
6. Be backend-pluggable today (Path A) and evolve into an Xtrata-incentivised storage network (Path B) without changing the on-chain record format.

### Non-goals
1. **Not** storing master bytes in Stacks contract state. (Anti-pattern; see risk report.)
2. **Not** a public "anyone can download the master for free" system. Masters are licensed IP; the network distributes *access*, not piracy.
3. **Not** a new L1 or a fork of Proof-of-Transfer. Path B is an incentive + audit layer settled on Stacks, not a new consensus.
4. **Not** promising "immutable forever" for licensed content — rights expire; the design is durable-but-revocable.

---

## 2. Architecture principles

1. **Chain = source of truth + settlement; storage = off-chain.** This is the canonical Stacks pattern (Gaia/Atlas). The chain never holds bulk bytes; it holds hashes, rights, and money.
2. **Content addressing everywhere.** Every artifact (master, rendition, shard, manifest) is named by its hash. Identity is independent of location; any mirror is trustless because the hash is on-chain.
3. **Encryption by default.** Plaintext masters never leave the ingest boundary. Storage providers only ever hold ciphertext.
4. **Capability, not custody.** Access = holding a key, and keys are released only against on-chain entitlements. UMG retains ultimate control of the master key.
5. **Pluggable storage.** A single `StorageAdapter` interface abstracts Walrus / Storj / Arweave / Filecoin / Xtrata guardians. The rest of the system is backend-agnostic.
6. **Verify on read.** Gateways and clients always recompute hashes before serving/using bytes. A compromised storage node cannot serve tampered content undetected.
7. **Progressive decentralisation.** Start with trusted/known operators (incl. Xtrata-run), open to staked third parties later. The on-chain record format is identical across phases.

---

## 3. System overview

```
                       ┌──────────────────────────────────────────────┐
                       │                 STACKS (L2)                   │
                       │  source of truth · rights · settlement        │
                       │                                               │
   publish/seal  ┌────▶│  asset-registry   rights-registry            │
   (UMG/Xtrata)  │     │  storage-registry royalty/escrow             │
                 │     │  guardian-network (Path B)  manifest-authority│
                 │     └───────────────▲───────────────▲──────────────┘
                 │            anchor hashes │   settle sBTC │ proofs/stakes
   ┌─────────────┴───────┐                  │               │
   │  INGEST PIPELINE     │   register       │               │
   │  fingerprint→encrypt │──placements──────┘               │
   │  →erasure-code→push  │                                  │
   └─────────┬───────────┘                                   │
             │ ciphertext shards                              │
             ▼                                                │
   ┌──────────────────────────────┐        challenge/proof    │
   │   STORAGE LAYER (off-chain)   │◀─────────────────────────┘
   │  StorageAdapter:              │
   │  Walrus · Storj · Arweave ·   │
   │  Filecoin · Xtrata guardians  │
   └─────────┬────────────────────┘
             │ fetch shards (ciphertext)
             ▼
   ┌──────────────────────────────┐   entitlement check + key unwrap
   │   GATEWAY / RESOLVER          │──────────────▶  Authorised players
   │  verify hash · decrypt ·      │   range/stream  (apps, Spotify-like,
   │  transcode-on-the-fly · cache │                  embedded players)
   └──────────────────────────────┘
```

**Reuse of existing Xtrata primitives:** the `xtrata-backup-registry-v1.0` content-hash registry, the manifest-authority registry (XIP-009), the rolling SHA-256 chain hash, the `/runtime/content` gateway with its proof headers, and the deterministic reconstruction engine are the seeds of `asset-registry`, `storage-registry`, the gateway, and the verify-on-read path respectively. This design generalises them from "NFT image backup" to "rights-managed media at catalogue scale."

---

## 4. Data model

### 4.1 Identifiers & hashing

- **`asset-id`** — uint, Xtrata-assigned, stable per master work (the canonical UMG master).
- **`content-hash` (master)** — 32-byte hash of the **plaintext** master (the authenticity fingerprint). Uses the existing rolling SHA-256 chain hash so it's consistent with current Xtrata tooling, plus an optional plain `sha256(file)` for external/marketplace proofs.
- **`cipher-hash`** — 32-byte hash of the **ciphertext** blob actually stored (what providers hold and prove). Distinct from `content-hash` because providers must prove storage without ever seeing plaintext.
- **`shard-hash[]`** — per-shard hashes of erasure-coded fragments (Reed-Solomon). Each shard is independently addressable and provable.
- **`manifest-hash`** — 32-byte hash of the canonical manifest JSON (below). This is the single root a client needs to reconstruct and verify everything.

> Design rule: **the chain stores hashes (32 bytes), never bytes.** A full catalogue is a few hundred bytes of on-chain state per asset regardless of file size.

### 4.2 On-chain objects (Clarity maps)

| Object | Key | Value (fields) | Notes |
|---|---|---|---|
| **Asset** | `asset-id` | `creator`, `rights-holder` (principal), `content-hash`, `cipher-hash`, `manifest-hash`, `mime`, `byte-size`, `sealed` (bool), `created-at` | The canonical master record. Append-then-seal. |
| **Rendition** | `{asset-id, rendition-id}` | `kind` (master/stream-hi/stream-lo/preview), `content-hash`, `cipher-hash`, `codec`, `bitrate`, `byte-size` | Derived playable versions, each independently hash-anchored. |
| **Placement** | `{cipher-hash, provider}` | `backend` (enum), `locator` (string ≤256: blob-id/URL/CID/txid), `shards` (uint), `replication`, `registered-at` | Where ciphertext lives. Many per asset (multi-backend redundancy). |
| **Rights/Licence** | `{asset-id, territory}` | `licence-type`, `valid-from`, `valid-until`, `exclusive` (bool), `terms-hash` | Programmable, time-bounded, territory-aware. `terms-hash` → off-chain legal doc. |
| **RoyaltySplit** | `asset-id` | `(list 50 {payee: principal, bps: uint})` | Basis-point splits; enforced at settlement. |
| **Entitlement (grant)** | `{asset-id, grantee}` | `scope` (stream/download/master), `valid-until`, `wrapped-key-ref`, `revoked` (bool) | The on-chain capability that releases a key. |
| **ManifestAuthority** | `asset-id` | `authority` (principal), `sig-scheme` | Who is authorised to publish/seal manifests (XIP-009). |

### 4.3 Off-chain objects

- **Encrypted blob** — the master ciphertext (AES-256-GCM), addressed by `cipher-hash`.
- **Erasure-coded shards** — Reed-Solomon `(k, n)` fragments of the blob (e.g. 10/16), each addressed by `shard-hash`. Any `k` of `n` reconstruct the blob; survives provider churn.
- **Renditions** — transcoded, separately encrypted streamable versions.
- **Manifest JSON** — the canonical, content-addressed descriptor (extends `xtrata.collection-backup.v1` from the backup service). Sufficient to locate, reconstruct, verify, and (if entitled) decrypt:

```json
{
  "schema": "xtrata.media-manifest.v1",
  "assetId": 1234,
  "rightsHolder": "SP...umg",
  "master": {
    "contentHash": "sha256-rolling:…",      // plaintext fingerprint
    "cipherHash":  "sha256:…",              // stored ciphertext
    "mime": "audio/x-wav",
    "byteSize": 412345678,
    "encryption": { "alg": "AES-256-GCM", "kdf": "HKDF-SHA256", "keyRef": "cek:asset:1234" },
    "erasure": { "scheme": "reed-solomon", "k": 10, "n": 16, "shardHashes": ["…","…"] }
  },
  "renditions": [
    { "id": "stream-hi", "codec": "aac", "bitrate": 256000, "contentHash": "…", "cipherHash": "…" },
    { "id": "preview-30s", "codec": "aac", "bitrate": 96000, "contentHash": "…", "cipherHash": "…" }
  ],
  "placements": [
    { "backend": "walrus",  "cipherHash": "…", "locator": "blob:…", "shards": 16 },
    { "backend": "storj",   "cipherHash": "…", "locator": "sj://…" },
    { "backend": "arweave", "cipherHash": "…", "locator": "ar://…" }
  ],
  "rights": { "termsHash": "sha256:…", "royaltySplitRef": "chain:asset:1234" },
  "provenance": [ { "event": "ingest", "by": "SP…", "at": 901234 }, { "event": "seal", "txid": "0x…" } ]
}
```

The manifest is itself stored off-chain and its hash (`manifest-hash`) is on-chain. A client with only `asset-id` resolves `manifest-hash` from the chain, fetches the manifest from any mirror, verifies it against the hash, and proceeds.

---

## 5. Encryption & key management

### 5.1 Envelope encryption

- Each asset has a **Content Encryption Key (CEK)** — a random AES-256 key that encrypts the master (and a separate CEK per rendition, so a streaming key never exposes the master).
- The CEK is **wrapped** (encrypted) for each authorised consumer using their public key (or a KMS/HSM key). Wrapped keys are stored off-chain (key service / the manifest), and the **entitlement that authorises unwrapping is on-chain**.
- Storage providers and gateways never hold the CEK in a form they can use without an entitlement; they hold ciphertext only.

### 5.2 Entitlement-gated key release

Flow for an authorised player requesting a stream:

1. Player presents identity (Stacks principal / signed request).
2. Key service calls `check-entitlement(asset-id, grantee, scope)` (read-only) on Stacks.
3. If a valid, unrevoked, in-window entitlement exists, the key service returns the **rendition CEK wrapped to the player's session key** (short-lived).
4. Player decrypts the stream locally; the master CEK is never released for a stream-scope grant.

Master-scope access (e.g. UMG retrieving the original) requires a `master` entitlement and ideally **m-of-n approval** (threshold/MPC) so no single Xtrata key unlocks a master.

### 5.3 Revocation, takedown & "crypto-shredding"

You cannot delete data from an immutable mirror (Arweave) or guarantee deletion across many providers. Instead:

- **Revoke entitlements on-chain** (`revoke-entitlement`) → key service stops releasing keys → access ends immediately for new sessions.
- **Crypto-shred** for hard takedown: destroy/rotate the CEK and all wrapped copies. The ciphertext may persist somewhere, but it is permanently undecryptable. This is the standard, legally-recognised mechanism for "deletion" of encrypted data and satisfies most takedown / right-to-erasure requirements.
- **Territory/time gating** is enforced both at the key service (won't release out-of-window/territory) and on-chain (entitlements carry `valid-until`).

### 5.4 Key custody options (pick per deal)

- **Xtrata-managed KMS/HSM** (fastest; Xtrata is trusted custodian).
- **UMG-held master key** (UMG runs the root key; Xtrata never holds plaintext master access) — strongest for label trust.
- **Threshold/MPC** (keys split across UMG + Xtrata + escrow; m-of-n to unwrap a master) — recommended for the flagship deal.

### 5.5 Threat model (summary)

| Threat | Mitigation |
|---|---|
| Storage provider reads the master | Only ciphertext is ever stored; CEK never shared with providers. |
| Provider serves tampered bytes | Verify-on-read against `cipher-hash`/`shard-hash`; mismatch rejected. |
| Provider drops data | Erasure coding (k-of-n) + multi-backend replication + Path B audits/slashing. |
| Gateway leaks keys | Short-lived session-wrapped keys; gateways hold no long-lived CEKs; master needs m-of-n. |
| Unauthorised playback | Entitlement check + key gating; no entitlement → no usable key. |
| Legal takedown / expiry | Revoke entitlements + crypto-shred CEK. |
| Sybil providers (Path B) | sBTC/STX staking bond + slashing. |

---

## 6. Storage layer (Path A) — pluggable adapter

### 6.1 `StorageAdapter` interface (off-chain service contract)

```
put(cipherBytes, opts)      -> { locator, backend, shardHashes[] }
get(locator | cipherHash)   -> cipherBytes            // verified against hash by caller
locate(cipherHash)          -> [ {backend, locator} ] // all known placements
prove(cipherHash, challenge)-> proof                   // backend-native, optional (Path B uses our own)
cost(byteSize, durability)  -> quote
```

Every backend implements this; the ingest pipeline and gateway never special-case a backend.

### 6.2 Recommended default stack (pluggable, not locked)

| Tier | Backend | Why | Role |
|---|---|---|---|
| **Durable master** | **Walrus** | Reed-Solomon erasure coding, on-chain blob certification, ~100× cheaper than Arweave/Filecoin, fast verification | Primary store for encrypted masters + shards |
| **Hot streaming** | **Storj** (S3-compatible) | Erasure-coded, retrieval as fast as centralised cloud; good for low-latency playback | Serve stream renditions; origin behind CDN/edge cache |
| **Permanent reference** | **Arweave** (optional) | Pay-once permanence; the "this will outlive us" copy | Optional immutable reference copy of the encrypted master |
| **Cold archival** | **Filecoin** (optional) | Cheapest bulk cold storage | Deep-archive redundancy |
| **Sovereign / Path B** | **Xtrata guardians** | Bitcoin-settled, you control economics | Progressive decentralisation; see §8 |

Default policy for a master: **Walrus (k-of-n shards) + Storj (renditions) + Arweave (1 permanent encrypted reference)**. Hot path served from Storj/origin via gateway cache. All addressed by hash; all interchangeable.

### 6.3 Redundancy & repair

- Erasure-code each blob to `(k, n)`; distribute shards across ≥2 backends/regions so no single backend loss is fatal.
- A **repair/healing** job periodically verifies shard availability (and, in Path B, reads audit results) and re-replicates under-replicated blobs.

---

## 7. Gateway / resolver

A **stateless, replaceable** service that turns on-chain records + off-chain ciphertext into verified, authorised media. Anyone can run one; trust comes from hashes, not from the operator. Extends the existing `/runtime/content` runtime.

### 7.1 Read / stream path

1. Resolve `manifest-hash` from chain by `asset-id` (or accept a manifest directly); fetch + verify manifest.
2. Select rendition (e.g. `stream-hi`) and its `placements`.
3. Fetch shards/blob via `StorageAdapter.get`; **verify against `cipher-hash`/`shard-hash`**; reconstruct from any `k` shards.
4. `check-entitlement` on chain; obtain session-wrapped CEK from key service.
5. Decrypt; serve with **HTTP range support** for seeking/streaming; cache ciphertext at edge (still encrypted) for hot assets.
6. Emit proof/debug headers (reuse `X-Xtrata-Runtime-Reconstruction-*`, add `X-Xtrata-Content-Verified`, `X-Xtrata-Entitlement`): clients can independently confirm integrity.

### 7.2 Ingest / publish path (UMG → network)

1. UMG (or Xtrata's ingest service) supplies the master.
2. **Fingerprint:** compute `content-hash` (rolling SHA-256) of plaintext → the authenticity anchor.
3. **Transcode:** derive stream/preview renditions.
4. **Encrypt:** generate CEKs; AES-256-GCM encrypt master + renditions → `cipher-hash` each.
5. **Erasure-code:** Reed-Solomon shards → `shard-hash[]`.
6. **Distribute:** `StorageAdapter.put` to the policy's backends → `placements`.
7. **Manifest:** build + hash the manifest → `manifest-hash`.
8. **Anchor on chain:** `register-asset` → `set-rendition*` → `register-placement*` → `set-rights` / `set-royalty-split` → `seal-asset`. Settle storage fee into escrow.
9. Provenance event (`print`) for indexers (SIP-019 style) — notification only, never the system of record.

### 7.3 Trust-minimisation

"No privileged Xtrata API required" remains a published property: the manifest + on-chain records + any mirror are sufficient for a third party to verify integrity and (with an entitlement + key) decrypt. The gateway is a convenience and a key-release point, not a gatekeeper of truth.

---

## 8. Path B — Xtrata-incentivised guardian network

Path B replaces/augments third-party backends with a **staked, audited storage market settled in sBTC on Stacks**. Same hashes, same asset records — new providers. This is "Storj-lite settled on Bitcoin," not a new chain.

### 8.1 Roles

- **Guardian (storage provider):** stakes sBTC/STX, stores assigned ciphertext shards, answers audits, serves retrieval, earns rewards.
- **Publisher (e.g. UMG/Xtrata):** funds a per-asset **storage escrow** that drips to guardians over time.
- **Challenger/auditor:** anyone (or a VRF/oracle) that issues storage challenges; verification is on-chain and cheap.
- **Gateway/client:** issues signed **retrieval receipts** acknowledging a guardian served bytes (bandwidth incentive).

### 8.2 Economic primitives

- **Stake & slash:** guardians post a bond ≥ value-at-risk for their shards. Failing audits or proven data-withholding → **slash** a fraction; repeated failure → ejection + bond loss.
- **Storage rewards:** escrow releases per epoch to guardians who pass audits, proportional to bytes·time stored.
- **Retrieval rewards:** signed receipts accrue micro-payments for served bandwidth (separate from storage rewards — the Filecoin lesson: storage ≠ retrieval).
- **Replication target:** each shard set must be held by ≥ R distinct guardians; the contract tracks coverage and repairs by re-bidding shards.

### 8.3 Proof of storage (challenge–response)

Cheap, on-chain-verifiable, no novel cryptography:

1. Each epoch, a VRF/oracle (or the contract from a beacon) selects, per `(cipher-hash, guardian)`, a **random offset**.
2. The guardian returns a **Merkle proof** that the byte(s) at that offset hash into the committed `shard-hash`/`cipher-hash` Merkle root.
3. The contract verifies the Merkle path — a handful of hashes, not the data. Pass → reward eligibility; miss/timeout → slash.

This is the same family as Filecoin Proof-of-Spacetime, Storj audits, and 0G Proof-of-Random-Access — adapted to a Clarity-verifiable Merkle check. (Genuinely hard parts — retrievability guarantees and bandwidth economics — are mitigated by retrieval receipts + gateways/caching covering the hot path regardless.)

### 8.4 Progressive decentralisation

- **B0 (permissioned):** Xtrata + a few known operators run guardians; staking/audit contracts live but the set is allow-listed. UMG gets predictable SLAs.
- **B1 (semi-open):** vetted third parties stake and join; audits + slashing active; Xtrata backstops coverage.
- **B2 (open):** permissionless staking; Xtrata becomes one participant; the network self-heals via economics.

The on-chain asset/placement format is identical across A, B0, B1, B2 — you migrate storage without touching the record of truth.

---

## 9. Clarity contract interfaces

Illustrative signatures (Clarity-flavoured, consistent with existing Xtrata naming). Errors follow the existing `(err uXXX)` convention.

### 9.1 `xtrata-asset-registry`

```clarity
;; --- maps ---
(define-map Assets uint {
  creator: principal, rights-holder: principal,
  content-hash: (buff 32), cipher-hash: (buff 32), manifest-hash: (buff 32),
  mime: (string-ascii 64), byte-size: uint, sealed: bool, created-at: uint })
(define-map Renditions { asset-id: uint, rendition-id: (string-ascii 24) }
  { kind: (string-ascii 16), content-hash: (buff 32), cipher-hash: (buff 32),
    codec: (string-ascii 16), bitrate: uint, byte-size: uint })

;; --- publish/seal (manifest-authority gated) ---
(define-public (register-asset (content-hash (buff 32)) (cipher-hash (buff 32))
                               (mime (string-ascii 64)) (byte-size uint)) ;; -> (ok uint asset-id)
(define-public (set-rendition (asset-id uint) (rendition-id (string-ascii 24)) (r {…})) )
(define-public (set-manifest (asset-id uint) (manifest-hash (buff 32))) )
(define-public (seal-asset (asset-id uint)) )            ;; locks the master record

;; --- read-only (no at-block; current-state only) ---
(define-read-only (get-asset (asset-id uint)) )
(define-read-only (get-manifest-hash (asset-id uint)) )
(define-read-only (verify-content (asset-id uint) (h (buff 32))) ) ;; h == content-hash?
```

### 9.2 `xtrata-storage-registry`

```clarity
(define-map Placements { cipher-hash: (buff 32), provider: principal }
  { backend: (string-ascii 16), locator: (string-ascii 256),
    shards: uint, replication: uint, registered-at: uint })

(define-public (register-placement (cipher-hash (buff 32)) (backend (string-ascii 16))
                                   (locator (string-ascii 256)) (shards uint)) )
(define-public (revoke-placement  (cipher-hash (buff 32))) )
(define-read-only (get-placements (cipher-hash (buff 32))) ) ;; -> list of providers/locators
```

### 9.3 `xtrata-rights`

```clarity
(define-map Rights { asset-id: uint, territory: (string-ascii 8) }
  { licence-type: (string-ascii 24), valid-from: uint, valid-until: uint,
    exclusive: bool, terms-hash: (buff 32) })
(define-map RoyaltySplits uint (list 50 { payee: principal, bps: uint }))
(define-map Entitlements { asset-id: uint, grantee: principal }
  { scope: (string-ascii 12), valid-until: uint, wrapped-key-ref: (string-ascii 128), revoked: bool })

(define-public (set-rights (asset-id uint) (territory (string-ascii 8)) (r {…})) )
(define-public (set-royalty-split (asset-id uint) (split (list 50 {payee: principal, bps: uint}))) )
(define-public (grant-entitlement (asset-id uint) (grantee principal)
                                  (scope (string-ascii 12)) (valid-until uint)
                                  (wrapped-key-ref (string-ascii 128))) )
(define-public (revoke-entitlement (asset-id uint) (grantee principal)) ) ;; -> triggers key-service stop + crypto-shred policy
(define-read-only (check-entitlement (asset-id uint) (grantee principal) (scope (string-ascii 12))) ) ;; -> bool
```

### 9.4 `xtrata-royalty-escrow` (sBTC settlement)

```clarity
;; pay-per-stream or licence purchase splits to payees by bps; settles in sBTC
(define-public (purchase-licence (asset-id uint) (territory (string-ascii 8))) ) ;; pulls sBTC, grants entitlement, splits royalties
(define-public (settle-royalties (asset-id uint)) )      ;; distribute accrued sBTC by RoyaltySplits
(define-read-only (get-accrued (asset-id uint)) )
```

### 9.5 `xtrata-guardian-network` (Path B)

```clarity
(define-map Guardians principal { stake: uint, active: bool, joined-at: uint, slashed: uint })
(define-map ShardAssignments { cipher-hash: (buff 32), guardian: principal }
  { shard-root: (buff 32), last-proof: uint, missed: uint })
(define-map StorageEscrow (buff 32) { funder: principal, balance: uint, rate-per-epoch: uint })

(define-public (register-guardian (stake uint)) )                 ;; locks sBTC/STX bond
(define-public (fund-storage (cipher-hash (buff 32)) (amount uint) (rate uint)) )
(define-public (accept-assignment (cipher-hash (buff 32)) (shard-root (buff 32))) )
(define-public (submit-proof (cipher-hash (buff 32)) (offset uint) (merkle-proof (list 20 (buff 32))) (leaf (buff 32))) )
(define-public (settle-epoch (cipher-hash (buff 32))) )           ;; reward passers from escrow
(define-public (slash (guardian principal) (cipher-hash (buff 32))) ) ;; on proven miss/withholding
(define-public (submit-retrieval-receipt (receipt {…signed by client…})) )
(define-public (withdraw-stake) )
(define-read-only (get-coverage (cipher-hash (buff 32))) )        ;; replication count vs target
```

**Design invariants (enforced in code review):** no `at-block`; no historical-height reads; all reads are current-state; bulk bytes never enter contract state (only 32-byte hashes and short locators). Keeps the whole system pruning-safe per the risk report.

---

## 10. How the pieces deliver the UMG use case

- **"One file that is the master and can be played":** the master is fingerprinted and sealed (authenticity); stream/preview renditions are derived from it and hash-anchored to the same `asset-id`. One canonical record, many playable forms.
- **"People can pull it from the chain like Spotify":** authorised players resolve the manifest, fetch verified ciphertext from the storage layer, get a short-lived key against an on-chain entitlement, and stream — with range/seek and edge caching. "From the chain" = the chain proves *what* it is and *who may play it*; the bytes flow from the storage layer.
- **"Keep song data small":** on-chain state per asset is a few hundred bytes (hashes + rights). The gigabytes live off-chain, encrypted, redundant.
- **"Tied back to Bitcoin":** storage fees, licences, royalties, and guardian rewards/slashing settle in sBTC; all records anchor to Stacks, which commits to Bitcoin via PoX. Genuinely Bitcoin-aligned in a way Arweave/Filecoin are not.

---

## 11. Phasing & milestones

| Phase | Scope | Exit criteria |
|---|---|---|
| **P1 — Path A pilot** | asset/rights/royalty/storage registries; ingest pipeline; gateway; Walrus+Storj+Arweave via adapter; KMS or m-of-n keys; sBTC royalty settlement | A UMG catalogue slice ingested, sealed, verifiably reconstructed, streamed to an authorised player; royalties settle in sBTC; takedown demonstrated via crypto-shred |
| **P2 — Path B (B0/B1)** | guardian staking + challenge/response audits + slashing + storage escrow; permissioned then vetted operators; repair/healing | N guardians passing audits over M epochs; coverage ≥ target; one slashing event exercised on testnet; storage migrates with zero change to asset records |
| **P3 — Open network** | permissionless staking; retrieval markets; broader publisher onboarding | Self-healing under churn; third-party publishers beyond UMG |

---

## 12. Open questions / risks

1. **Retrievability vs storage:** proving bytes are *served on demand* (not just held) is the hard, partially-unsolved part industry-wide. Mitigate with retrieval receipts + gateways/edge caching for the hot path; don't over-promise audit-only retrievability.
2. **Key custody model for the flagship deal:** KMS vs UMG-held vs threshold/MPC — pick early; it shapes trust and integration. Recommendation: threshold/MPC for masters.
3. **Streaming latency from decentralised backends:** Arweave/Filecoin are too slow for live playback; rely on Storj/origin + CDN for hot, decentralised tiers for durability/archival.
4. **Legal:** territory/term enforcement, takedown SLAs, and GDPR/erasure must be lawyer-reviewed; crypto-shredding is the technical backbone but contracts must define obligations.
5. **sBTC maturity & fees:** confirm sBTC settlement throughput/fees fit per-stream micro-royalties; may need batching/rollup of micro-payments.
6. **Cost model:** model $/GB/month × catalogue × replication vs licence/stream revenue; ensure escrow economics are sustainable before B2.
7. **Guardian economics & sybil:** stake sizing, slashing fractions, and reward curves need simulation before opening the set.

---

## 13. Appendix — backend comparison (decision support)

| | Walrus | Storj | Arweave | Filecoin | Xtrata guardians (B) |
|---|---|---|---|---|---|
| Redundancy | RS erasure coding | RS erasure coding (80/29) | full replication (miners) | replication (deals) | RS + R-replication |
| Retrieval speed | fast | **fastest (S3-grade)** | slow | slow | tunable (caching) |
| Cost | **very low** | low | high (pay-once permanent) | lowest cold | you set it |
| Permanence model | staked/renewable | contract/renewable | **pay-once forever** | deal-term | escrow + stake |
| On-chain verification | blob certification | audits | proof-of-access | PoRep/PoSt | Clarity Merkle proofs |
| Bitcoin alignment | via Xtrata anchor | via Xtrata anchor | via Xtrata anchor | via Xtrata anchor | **native (sBTC settle)** |
| Best role | durable master+shards | hot streaming origin | permanent reference copy | deep archive | sovereign/decentralised tier |

Sources for landscape claims: decentralized-storage comparisons and the Walrus paper (see companion report's sources). All backend bytes are encrypted ciphertext addressed by hash; switching or combining backends never changes the on-chain record.
