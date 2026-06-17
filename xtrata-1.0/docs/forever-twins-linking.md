# Forever Twins: Collection Linking & Escrow Display

This document is the canonical reference for how Xtrata links an inscription id
to an original collection token, how escrow is detected and displayed, and the
streamlined process for scaling the system to new collections and contracts.

## What the system does

When an existing NFT collection is ported into Xtrata via a Forever Twin helper
contract, each original token (e.g. **Bitcoin Pepe #44**) is bound to a minted
Xtrata inscription (e.g. **Xtrata #512**). The app surfaces both identities in
the viewer and, when the twin is held in escrow, shows an `Escrowed` state plus
the **real owner** — the current holder of the original collection NFT.

```
Bitcoin Pepe #44  ⇄  Xtrata inscription #512
```

## On-chain model (source of truth)

The helper/escrow contract for each collection is itself the on-chain twin
index. It is **not** a separate registry contract. Every helper exposes the same
shape:

- A `Bindings` map keyed by the original (local) token id:
  `{ xtrata-id, content-hash, inscriber, xtrata-escrowed, at }`.
- `get-binding (local-token-id)` read-only returning that tuple.
- An `inscribed` print event carrying `{ token-id, xtrata-id }` at mint time.
- `get-inscribed-count`, plus swap functions that flip `xtrata-escrowed`.

### Escrow lifecycle

| Action | Effect | `xtrata-escrowed` |
|---|---|---|
| `inscribe` | Twin minted to the helper; original stays with holder | `true` |
| `swap-pepe-for-xtrata` | Holder deposits original, receives twin | `false` |
| `swap-xtrata-for-pepe` | Holder deposits twin, receives original | `true` |

A twin is **escrowed** whenever its on-chain owner is a registered helper
contract. In that state the displayed owner is resolved from the source NFT's
`get-owner (local-token-id)`.

### The one gap: no reverse lookup

`Bindings` is keyed by **local** id, and the contracts expose no
`xtrata-id → local-id` function. The resolver reconstructs that direction by
scanning the helper's `inscribed` print events into a cached reverse index, then
confirms the live binding with `get-binding`. This works for every bound token,
including those minted straight into escrow that never had a swap transaction.

## Code map

| File | Responsibility |
|---|---|
| `src/lib/twins/registry.ts` | **Single source of truth** — `FOREVER_TWIN_COLLECTIONS` and helper lookups. |
| `src/lib/twins/hiro.ts` | Cross-contract read layer: `call-read`, event streaming, Clarity decoding. |
| `src/lib/twins/resolver.ts` | Reverse index, `get-binding`, source `get-owner`, `resolveTwinOwnership`. |
| `src/lib/twins/index.ts` | Barrel export. |
| `src/screens/ViewerScreen.tsx` | React viewer: `Escrowed` badge, real owner, collection token. |
| `index.html` | Standalone Xplorer: `PEPE_ESCROW_RESOLVERS` + `buildTwinReverseIndex` + `resolvePepeEscrowHolder`. |
| `forever-twins/data/contracts.json` | Reference data for the deployed contracts. |

The React app and the resolver are **fully generic** over the registry. Never
hard-code a collection in resolver or UI logic — add it to the registry instead.

## Adding a new Forever Twin collection (or contract)

This is the streamlined, scale-friendly checklist. Steps 1–2 are the only code
changes required for a standard helper; the rest keep docs and tests in sync.

1. **Register it (React/app).** Append an entry to `FOREVER_TWIN_COLLECTIONS` in
   `src/lib/twins/registry.ts`:

   ```ts
   {
     key: 'my-collection',
     name: 'My Collection',
     itemNoun: 'My Item',
     network: 'mainnet',
     masterContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
     helperContractId: 'SP….my-helper',
     sourceContractId: 'SP….my-collection',
     sourceAssetName: 'my-collection',
     claimUrl: 'https://…' // optional
   }
   ```

2. **Mirror it (standalone viewer).** Add the same collection to
   `PEPE_ESCROW_RESOLVERS` in `index.html`, keyed by the helper contract id.
   This duplication is intentional: `index.html` is a self-contained bundle. Keep
   the two registries in lockstep.

3. **Verify the contract shape.** Confirm the new helper exposes a `Bindings`
   map keyed by local id with `xtrata-id` + `xtrata-escrowed`, a `get-binding`
   read-only, and an `inscribed` print event with `token-id` + `xtrata-id`. If a
   future contract diverges (different function or field names), extend the
   registry entry to carry the differing names and branch on them in
   `resolver.ts` — do **not** special-case a single collection inline.

4. **Update reference data + inventory.** Add the contract ids to
   `forever-twins/data/contracts.json` and the Forever Twin Helper Contracts
   table in `docs/contract-inventory.md`.

5. **Add tests.** Extend `src/lib/twins/__tests__/resolver.test.ts` with the new
   collection's reverse-index and escrow cases.

6. **Run checks.** `npx vitest run src/lib/twins` and a full `npx vitest run`
   before publishing.

## Design notes for future scaling

- **Registry-driven, not branch-driven.** Adding collections should be data, not
  logic. The moment a change needs an `if (collection === …)` in the resolver,
  promote the difference into a registry field instead.
- **Caching.** Reverse indexes are cached per collection for the session; call
  `clearTwinCaches()` after a swap if a fresh read is required.
- **Network reads.** All reads go through the Hiro proxy
  (`functions/hiro/[network]/…`) via `getApiBaseUrls`, with fallback bases, so no
  new endpoint wiring is needed per collection.
- **A future on-chain reverse index** (the `xtrata-forever-twin-index-v1` plan in
  `forever-twins/xtrata-twin-index-v1.md`) could replace the event-scan step; if
  deployed, swap `buildReverseIndex` to read it while keeping the same registry
  and public resolver API.
