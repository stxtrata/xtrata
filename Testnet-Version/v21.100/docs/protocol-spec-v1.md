# xStrata Protocol Spec v1 (Constitution)
Status: Draft
Applies to: Genesis Contract v9.2.17 and all successor contracts

## 1) Purpose
Provide a stable, long-lived protocol that preserves lineage from the first
"forever" contract (v9.2.17) while enabling iterative upgrades, improved
features, and recursion across multiple contracts without breaking existing
inscriptions or tooling.

## 2) Scope
This specification defines:
- Contract invariants (minting, sealing, data integrity, admin behavior).
- Required interfaces and metadata for compatibility.
- Lineage, versioning, and upgrade rules.
- Recursion rules within and across contracts.
- Client/resolver expectations for long-term interoperability.

## 3) Definitions
- Contract ID: {address}.{contract-name}
- Genesis Contract: the first forever contract, v9.2.17.
- Successor Contract: any later contract that extends the protocol.
- Inscription: a token minted from uploaded chunks and sealed with a final hash.
- Dependency: a token ID referenced by a recursive inscription.
- Protocol Version: semantic version string of the contract implementation.
- Capability Flags: explicit feature indicators used by clients.

## 4) Constitutional Principles
1. Immutability: once sealed, content and provenance are immutable.
2. Provenance: creator attribution is immutable and must be recorded.
3. Compatibility: upgrades are additive; breaking changes require a new
   major protocol version and explicit migration path.
4. Availability: inscriptions are retrievable indefinitely (cache-first).
5. Transparency: fees, pause state, and governance actions are visible.

## 5) Genesis Contract (v9.2.17) Commitments
The following are permanent and must be honored by all successor tooling:
- Mint flow order: begin -> batch upload -> seal (or seal-recursive).
- Uploads are resumable indefinitely for {uploader, file-hash}.
- No post-mint edits to content or token URIs.
- Dependencies must already exist at seal time.
- Pause halts inscription writes only; transfers and reads remain available.
- Fee unit and royalties are explicit and bounded.

## 6) Versioning and Lineage
- Every successor contract MUST declare:
  - protocolVersion (semver).
  - genesisContractId (the v9.2.17 contract ID).
  - parentContractId (direct predecessor).
- The lineage chain MUST be strictly append-only.
- Successors MUST NOT alter or invalidate tokens minted by prior contracts.

Recommended additions for successor contracts:
- get-protocol-version() -> (response (string-ascii) uint)
- get-genesis-contract() -> (response principal uint)
- get-parent-contract() -> (response principal uint)

## 7) Required Interfaces
All contracts MUST implement SIP-009 nft-trait.
All contracts SHOULD implement SIP-016 metadata conventions for token URIs.

xStrata Core Read-Only (required for successors):
- get-inscription-meta(id)
- get-chunk(id, index)
- get-dependencies(id)
- get-token-uri(id)
- get-owner(id)

xStrata Read-Only (recommended for successors):
- get-chunk-batch(id, indexes)
- get-upload-state(expected-hash, owner)
- get-id-by-hash(hash)
- get-fee-unit()
- is-paused()
- get-admin()
- get-next-token-id()

xStrata Core Public (required for successors):
- begin-inscription(hash, mime, total-size, total-chunks)
- add-chunk-batch(hash, chunks)
- seal-inscription(hash, token-uri)
- seal-recursive(hash, token-uri, dependencies)
- transfer(id, sender, recipient)

## 8) Data Integrity Invariants
Contracts MUST enforce:
- total-chunks > 0.
- batch sizes within bounds.
- running-hash equals expected-hash at seal.
- token-uri is non-empty and ASCII within max length.
- creator is immutable and recorded in metadata.

## 9) Fees and Economics
- Fees MUST be deterministic and queryable.
- Fee unit updates MUST be bounded to prevent governance shocks.
- Fee collection MUST not charge the royalty recipient for self-pay.
- Read-only functions SHOULD expose current fee parameters.

## 10) Admin and Pause Semantics
- Admin actions must be explicit:
  - set-royalty-recipient
  - set-fee-unit
  - set-paused
  - transfer-contract-ownership
- Pause MUST block inscription writes only:
  - begin-inscription, add-chunk-batch, seal-inscription, seal-recursive
- Pause MUST NOT block read-only calls or transfer.

## 11) Recursion Within a Contract
- Dependencies MUST exist at seal time.
- Dependencies MUST point to sealed inscriptions only.
- Dependency lists MUST be bounded (max list size).
- Token IDs MUST remain stable and sequential.

## 12) Cross-Contract Recursion
Cross-contract recursion is supported at the protocol level via metadata
and resolver policy, even if on-chain enforcement is limited.

Minimum requirement (metadata-level):
- properties.xstrata.dependencies[] entries MUST include:
  - contract_id
  - token_id
  - expected_hash (optional but recommended)
- Resolvers and clients MUST validate that dependencies exist and are sealed.

Recommended registry contract (future):
- xstrata-recursion-registry:
  - register-dependency(source-contract, source-id, dep-contract, dep-id)
  - get-dependencies(contract, id)
Successor contracts MAY require registry entries at seal.

## 13) Metadata (SIP-016 Profile)
Token URI SHOULD resolve to SIP-016 with:
- sip: 16
- name
- image or animation_url
- properties.collection (xStrata)
- properties.id ({id})
- properties.raw_media_file_uri/type/signature
- properties.creators (optional but recommended)
- properties.xstrata (contract_id, protocol_version, expected_hash, etc.)

## 14) Client and Resolver Expectations
- Cache-first, avoid redundant calls.
- When rendering, use the same resolved content as the grid.
- Prefer on-chain content; fall back to token URI only when needed.
- Use get-chunk-batch when available; fall back to per-chunk reads if batch calls exceed cost limits.
- Support recursion resolution across contracts using metadata links.

## 15) Upgrade and Migration Rules
- New contracts MUST be additive (no breaking changes to core interfaces).
- If a breaking change is required, increment major protocol version and
  provide explicit tooling for old contracts.
- No migration may invalidate existing token IDs or hashes.

## 16) Governance and Change Process
- Any protocol change requires:
  - A new protocolVersion.
  - A public lineage mapping to genesis.
  - A migration note describing compatibility impact.

## 17) Security and Testing
- All changes to protocol logic MUST include targeted unit tests.
- Regression tests MUST cover parsing, fee math, and read-only responses.

## 18) Non-Goals
- No forced migration or re-minting of historic inscriptions.
- No mutable content for previously sealed tokens.
