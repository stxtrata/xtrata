# Verify It Yourself Guide

Draft status: needs helper-contract function names, final claim URL, and explorer links.

## 1. What You Are Verifying

You are not just checking that an image appears in a wallet.

You are checking:

- the original Bitcoin Pepe exists;
- the Forever Twin exists on Xtrata;
- the original token and Xtrata twin are mapped together;
- the Xtrata inscription contains reconstructable on-chain bytes;
- the pair's escrow/live state is as described;
- the manifest and canonical record are correct, if available;
- finalization status, if the canonical record has been finalized.

## 2. Simple Holder Version

1. Go to `TBC claim URL`.
2. Connect a supported wallet. Leather first, Xverse also expected. Needs confirmation.
3. Confirm your wallet holds the original Bitcoin Pepe.
4. Use the Fak.fun claim/checker flow to find your Pepe.
5. Claim the Forever Twin.
6. Save the transaction ID.
7. View the resulting Xtrata inscription at `https://xtrata.xyz/inscription/{id}` once the Xtrata inscription ID is known.

## 3. Contract / Explorer Version

Use the Stacks explorer to inspect:

- Original Bitcoin Pepes contract: `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe` TBC final.
- Helper contract: `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun` TBC final.
- Xtrata core contract: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` TBC live explorer.

Read-only function placeholders:

- Claim count: `TBC`.
- Promo threshold: `TBC`.
- Original token to twin mapping: `TBC`.
- Twin to original mapping: `TBC`.
- Escrow state: `TBC`.
- Live side / active side: `TBC`.
- Canonical hash: `TBC`.
- Finalization status: `TBC`.

## 4. Xtrata Explorer Version

For any Xtrata inscription ID:

- Human-facing content URL: `https://xtrata.xyz/inscription/{id}`.
- Compact content URL: `https://xtrata.xyz/i/{id}`.

The local Xtrata docs say both routes return reconstructed bytes through the same runtime content handler, with `/inscription/{id}` preferred for human-facing docs.

## 5. Technical Appendix

Core Xtrata v3.2.3 read-only functions available in local source:

- `get-inscription-meta(id)`
- `get-owner(id)`
- `get-token-uri(id)`
- `get-token-uri-raw(id)`
- `get-inscription-hash(id)`
- `get-inscription-size(id)`
- `get-inscription-chunks(id)`
- `is-inscription-sealed(id)`
- `get-chunk(id, index)`
- `get-chunk-batch(id, indexes)`
- `get-dependencies(id)`
- `get-parents(id)`
- `get-contract-info()`

Verification steps for Xtrata bytes:

1. Read `get-inscription-meta(id)`.
2. Confirm `sealed` is true.
3. Read `total-chunks`, `total-size`, `mime-type`, and `final-hash`.
4. Fetch chunks in order with `get-chunk-batch`.
5. Concatenate bytes.
6. Hash the reconstructed bytes and compare to `final-hash`.
7. Render by `mime-type`.

Helper-contract verification is TBC until the `pepe-4ever-fakfun` ABI/source is confirmed.

