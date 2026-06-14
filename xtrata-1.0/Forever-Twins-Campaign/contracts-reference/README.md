# Contracts Reference

Local snapshot of contracts and contract-adjacent docs relevant to the Bitcoin Pepes Forever Twins campaign.

## Source URLs

- Fak.fun app route checked: `https://fak.fun/SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`
  - This returned the Fak.fun app shell, not contract source.
- Rapha docs: `https://github.com/Rapha-btc/xtrata/blob/main/xtrata-1.0/contracts/clarinet/contracts/fakfun-idea/README.md`
- Rapha raw folder API: `https://api.github.com/repos/Rapha-btc/xtrata/contents/xtrata-1.0/contracts/clarinet/contracts/fakfun-idea?ref=main`
- Local Xtrata core source copied from `xtrata-1.0/contracts/clarinet/contracts/xtrata-v3.2.3.clar`.

## Current / Deployed-Name References

### Bitcoin Pepes Helper

File: `rapha-fakfun/pepe-4ever-fakfun.clar`

This is the deployed-name helper referenced by the user-provided Fak.fun route:

`SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`

Important facts from source:

- `MASTER` = `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`
- `SOURCE` = `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe`
- `free-threshold` default = `u87`
- `inscribe-fee` default = `u3000000` microSTX, 3 STX
- `payout-b` default = `SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7`
- Stores `Bindings` from Bitcoin Pepe token ID to Xtrata ID, content hash, inscriber, escrow state, and block height.
- Stores `CanonicalHash` by token ID.
- Has `seed-canonical` and `finalize-canonical`.
- Read-only functions include `fee-for`, `get-binding`, `is-inscribed`, `get-fee`, `get-free-threshold`, `get-discount`, `get-payouts`, `get-inscribed-count`, `get-owner`, `get-canonical-hash`, and `is-finalized`.

Live chain state can differ from defaults if owner setters have been called. Check `get-free-threshold`, `get-fee`, `get-inscribed-count`, and `is-finalized` against the deployed contract before posting.

### Xtrata Core

File: `xtrata-core/xtrata-v3.2.3.clar`

Important facts from source:

- Content is stored in fixed `16 KiB` chunks.
- Hard caps: `2048` chunks and `32 MiB`.
- Single-transaction minting is capped at one upload batch: `32` chunks, or `512 KiB`.
- Relevant read-only functions include `get-inscription-meta`, `get-owner`, `get-token-uri`, `get-token-uri-raw`, `get-id-by-hash`, `get-inscription-hash`, `get-inscription-size`, `get-inscription-chunks`, `get-chunk`, `get-chunk-batch`, `get-contract-info`, `quote-single-tx-fee`, and `quote-staged-fee`.

### Bitcoin Pepe Source

File: `rapha-fakfun/bitcoin-pepe.clar`

Copied from Rapha's reference folder for local context. The source contract ID in helper constants is:

`SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe`

## Other Copied Reference Files

- `rapha-fakfun/README.md`: Rapha's explanatory README. Note it describes a generic registry default of first 69 free, while the deployed-name `pepe-4ever-fakfun.clar` currently has `u87`.
- `rapha-fakfun/SIMULATIONS.md`: stxer mainnet-fork simulation notes. It reports 70 / 70 passed for `xtrata-collection-registry-v1.0`, not necessarily the exact deployed-name `pepe-4ever-fakfun.clar`.
- `rapha-fakfun/xtrata-collection-registry-v1.0.clar`: generic registry source with default `u69`.
- `rapha-fakfun/pepe-fakfun-xtrata.clar`, `pepe-fakfun-xtrata-v2.clar`, `xtrata-fakfun-forever-v2.clar`: auxiliary/historical references from the same Rapha folder.
- `rapha-fakfun/xtrata-v3.2.3.rapha-copy.clar`: Xtrata core copy from Rapha's repo.

## Verification Notes

- Do not assume README values override the deployed-name helper file.
- Do not assume source defaults equal live state after admin changes.
- For public promo wording, read `get-free-threshold` from the live deployed helper.
- For claim count, read `get-inscribed-count`.
- For binding verification, read `get-binding(token-id)`.
- For canonical verification, read `get-canonical-hash(token-id)` and `is-finalized`.

