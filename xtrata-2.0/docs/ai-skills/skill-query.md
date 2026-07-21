---
name: xtrata-query
description: >
  Teach any AI agent to query Xtrata inscription state, metadata, ownership,
  content chunks, dependencies, and relationships — all read-only, no wallet
  or fees required. Minting is `skill-inscribe.md`; moving tokens is
  `skill-transfer.md`.
version: "1.0"
contract: SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0
---

# Xtrata Query Skill

## 1. Scope

Read-only access to everything the protocol knows: token metadata, ownership,
raw content, upload sessions, dependencies, and the relationship index. No
transactions are signed and nothing costs STX.

## 2. Endpoints

| Purpose | Endpoint |
|---|---|
| Read-only contract calls | `POST {api}/v2/contracts/call-read/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v2-1-0/{function}` |
| Mainnet API | `https://stacks-node-api.mainnet.stacks.co` (fallback `https://api.mainnet.hiro.so`) |
| Relationship graph | `GET /index/relations/<contract>?id=<id>` (D1 inscription index) |
| Lineage summaries | `GET /index/page?primary=&lineage=&ids=…` |

With the SDK, prefer `createXtrataReadClient` / `createSimpleSdk` from
`@xtrata/sdk/simple` — they bind the contract once and expose typed snapshot
helpers (`getTokenSnapshot`, `getSnapshot`) over these same functions.

## 3. Core Read Functions

| Question | Function(s) |
|---|---|
| How many tokens exist? | `get-last-token-id`, `get-minted-count` |
| Who owns #id? | `get-owner (id uint)` |
| What is #id? | `get-inscription-meta (id uint)` → owner, creator, mime-type, total-size, total-chunks, sealed, final-hash |
| Token URI | `get-token-uri (id uint)` / `get-token-uri-raw` |
| Does this content already exist? | `get-id-by-hash (hash (buff 32))` — dedupe lookup by incremental hash |
| Is it sealed? | `is-inscription-sealed (id uint)` |
| Raw content | `get-chunk (id, index)` / `get-chunk-batch (id, indexes (list 50 uint))` |
| Recursive dependencies | `get-dependencies (id uint)` → up to 50 parent ids |
| In-flight upload | `get-upload-state (hash, owner)` → current-index, running-hash, last-touched |
| Protocol config | `get-fee-unit`, `is-paused`, `get-admin`, `get-royalty-recipient` |

Preview helpers: `get-svg (id)` and `get-svg-data-uri (id)` return small
on-chain SVG previews where available.

## 4. Reconstructing Full Content

Content is stored as 16,384-byte chunks under an incremental SHA-256 chain
(see `skill-inscribe.md` §4 for the hash algorithm). To rebuild a file:

1. `get-inscription-meta(id)` → `total-chunks`, `final-hash`, `mime-type`.
2. Read chunks in order with `get-chunk-batch` — cap batches at 30 indexes
   per call for cold-cache friendliness (the ABI accepts 50).
3. Concatenate bytes, recompute the incremental hash, and verify it equals
   `final-hash` before presenting the content as authentic.

With the SDK, `@xtrata/reconstruction` does all of this: batch reads,
fallback sources, diagnostics, and hash verification
(`createXtrataReconstructionSources` in `@xtrata/sdk/simple` wires it up).

## 5. Relationships (parents / children / descendants)

The D1 inscription index derives the relationship graph from `seal-recursive`
dependencies and stays current automatically during sync:

- `GET /index/relations/<contract>?id=<id>` — parents and children of a token.
- `GET /index/page?primary=&lineage=&ids=…` — lineage summaries in one query.

Do not attempt to rebuild the graph by scanning every token on-chain; use the
index endpoints.

## 6. Read Etiquette

- Batch reads where the ABI allows lists; never poll faster than once per
  second per endpoint.
- On HTTP 429, back off (the SDK's read client does this automatically and
  raises `ReadOnlyBackoffError` with `retryAfterMs`).
- Cache immutable facts (sealed content, hashes, creators) — they never
  change; only ownership and protocol config are mutable.

## 7. Common Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| `(optional none)` for an id you expect | Token not minted or wrong contract version | Check `get-last-token-id`; legacy content may live on `xtrata-v1.1.1` |
| Hash mismatch after reconstruction | Chunks read from a stale/partial upload | Only reconstruct sealed tokens; verify with `is-inscription-sealed` |
| Owner is a contract principal | Escrow (market listing or Forever Twin helper) | Resolve the real owner via the market listing or the twin's source NFT |
