# Campaign Facts and Open Questions

This is the control document for the Forever Twins campaign. Use it to separate verified facts from working assumptions.

## Confirmed Facts

- Xtrata spelling is `Xtrata`.
- Fak.fun spelling should be `Fak.fun` unless public docs prove otherwise.
- The campaign strategy is pain first, solution second.
- Core line: "Your NFT can survive while the art disappears."
- The Xtrata v3.2.3 core contract source exists locally at `xtrata-1.0/contracts/clarinet/contracts/xtrata-v3.2.3.clar`.
- Contract reference snapshots now live in `contracts-reference/`.
- The deployed-name Bitcoin Pepes helper source is copied to `contracts-reference/rapha-fakfun/pepe-4ever-fakfun.clar`.
- The helper source sets `MASTER` to `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.
- The helper source sets `SOURCE` to `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe`.
- The helper source default `free-threshold` is `u87`, not 69.
- The helper source default `inscribe-fee` is `u3000000`, 3 STX.
- The helper source exposes `get-binding`, `is-inscribed`, `get-fee`, `get-free-threshold`, `get-inscribed-count`, `get-canonical-hash`, and `is-finalized`.
- The helper source includes `seed-canonical` and `finalize-canonical`.
- The local v3.2.3 contract comments and constants say Xtrata stores content in fixed `16 KiB` chunks.
- The local v3.2.3 contract comments and constants say hard caps are `2048` chunks and `32 MiB`.
- The local v3.2.3 contract has a core-native small-file single-transaction mint path capped at `32` chunks.
- The local v3.2.3 contract stores inscription metadata including owner, creator, mime type, total size, total chunks, sealed status, and final hash.
- The local v3.2.3 contract exposes read-only functions including `get-inscription-meta`, `get-owner`, `get-token-uri`, `get-chunk`, `get-chunk-batch`, `get-inscription-hash`, `get-inscription-size`, `get-inscription-chunks`, `get-contract-info`, `quote-single-tx-fee`, and `quote-staged-fee`.
- Xtrata docs say human-facing raw bytes can use `https://xtrata.xyz/inscription/{id}` and compact references can use `https://xtrata.xyz/i/{id}`.
- Xtrata manifest docs support collection-level manifests that map collection items to Xtrata inscriptions, preserve provenance, document resolver contracts, and provide reconstruction rules.

## Likely But Needs Verification

- Working public name: `Forever Twins`.
- Alternative names: `Bitcoin Pepes Forever`, `Pepe 4ever`, `Bitcoin Pepes Forever Twins`.
- Public promo in the deployed-name helper source defaults to first 87 Forever Twins free, then 3 STX. Live state still needs checking because owner setters can change threshold and fee.
- Bitcoin Pepes assets are small enough for a one-transaction claim flow.
- For this Bitcoin Pepes flow, media files are around 5 KB each.
- Leather and Xverse are both supported, with Leather listed first.
- Holders claim through Fak.fun.
- The helper contract is deployed at `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`.
- Bitcoin Pepes original contract is `SP16SRR777TVB1WS5XSS9QT3YEZEC9JQFKYZENRAJ.bitcoin-pepe`.
- Xtrata master/core is `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.
- Bitcoin Pepes have already started inscribing twins.
- The helper contract creates a bound pair where one side is live and one side is escrowed.
- The buyer can later switch between the original/IPFS-side token and the Xtrata/on-chain-side token.

## Needs Rapha Confirmation

1. Final public campaign name?
2. Is public messaging definitely first 87 free, then 3 STX, matching `pepe-4ever-fakfun.clar`, or has live state/public copy changed?
3. Were early 1 STX inscriptions an issue, and should that be ignored publicly?
4. Current claim count?
5. Exact claim URL?
6. Does Fak.fun have a token ID checker?
7. Which wallet should be recommended first?
8. What happens if a Pepe is listed on a marketplace?
9. What happens on sale/transfer after twin creation?
10. Does the escrowed counterpart definitely follow the live token?
11. Is there ever a moment where both circulate freely?
12. Exact read-only functions for verification?
13. Who can create the collection manifest?
14. Who can finalize canonical hashes?
15. Planned manifest/finalization date or condition?
16. Preferred wording: "powered by Xtrata", "built on Xtrata", or "Xtrata permanence layer"?
17. Is this line approved: "This does not fix the old IPFS pointer. It gives the artwork a permanent on-chain twin."
18. Is this line approved: "Your NFT may already have gone blank before. You just never saw it, because someone repaired the display layer."

## Needs Contract Verification

- Helper contract source or ABI for `pepe-4ever-fakfun`.
- Live values for promo threshold and fee via deployed read-only calls.
- Whether normal network transaction fees apply during the free promo.
- Claim count via `get-inscribed-count`.
- Token-to-twin mapping via `get-binding`.
- Canonical hash via `get-canonical-hash`.
- Escrow state via `get-binding(token-id).xtrata-escrowed`.
- Finalization via `is-finalized`; finalization authority remains owner-only in source.
- Transfer and sale behavior for bound pairs.
- Whether both sides can ever circulate freely.
- Whether listed tokens can claim.

## Public Wording Decisions

- Use "Your NFT can survive while the art disappears."
- Use "The token can survive while the artwork disappears."
- Use "Most NFTs do not own the art. They own a pointer. If the pointer leads nowhere, the token still exists, but the thing people cared about is gone."
- Use "The original pointer may still be fragile. The Forever Twin gives the artwork a permanent on-chain counterpart that the holder owns."
- Use "The on-chain Xtrata copy remains available through Xtrata and any compatible indexer/viewer."
- Use "Any NFT that depends on external gateways, servers, metadata endpoints or pinning arrangements has infrastructure risk."

## Do-Not-Say List

- Do not say "Xtrata fixes the old IPFS link."
- Do not say "This guarantees every old marketplace view will work forever."
- Do not say "Every IPFS NFT is doomed."
- Do not mock broken collections or holders.
- Do not imply financial returns.
- Do not publish the possible early 1 STX issue unless Rapha explicitly wants it public.
- Do not name specific at-risk collections publicly unless evidence has been reviewed.

## Open Questions Before Launch Push

- Exact public name and claim URL.
- Exact promo threshold and fee.
- Exact claim count.
- Wallet support and recommended holder instructions.
- Whether marketplace-listed tokens can claim.
- Verification read-only calls and explorer URLs.

## Open Questions Before Founder Outreach

- Commercial model and public pricing language.
- Whether "free collection permanence audit" is approved.
- What partner wording Fak.fun wants.
- Whether Xtrata or Fak.fun leads founder conversations.
- Which Stacks collections are warm targets.

## Open Questions Before Press

- Jim quote.
- Rapha quote.
- Whether first public collection wording is approved.
- Whether claim counts and transaction examples can be shared.
- Which evidence claims have citations strong enough for press.
- Whether finalization is scheduled or should be described as upcoming.
