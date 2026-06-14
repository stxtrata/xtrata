# Source Claims and Citations

Use this register before publishing claims. If a claim is not sourced here, do not use it as a hard public claim.

## General Link Rot / Broken NFT Stats

## Claim

An academic scan of Ethereum NFT contracts found substantial NFT-to-asset fragility, including inaccessible assets across a meaningful share of contracts.

### Approved Public Wording

Academic research has found that NFT-to-asset connections are fragile in practice, including inaccessible off-chain assets across a meaningful share of Ethereum NFT contracts.

### Source

Ziwei Wang, Jiashi Gao, Xuetao Wei, "Do NFTs' Owners Really Possess their Assets? A First Look at the NFT-to-Asset Connection Fragility", arXiv, 2022. https://arxiv.org/abs/2212.11181

### Evidence / Quote

The abstract says the study characterized 12,353 Ethereum NFT contracts covering 6,234,141 NFTs and found that NFT-to-asset connections are fragile in practice. It reports inaccessible assets for 25.24% of Ethereum NFT contracts and duplicated assets in 21.48%.

### Risk Level

Medium.

### Notes / Limitations

This does not verify the earlier "roughly 498,000 NFTs" or "1 in 5 broken" claim. Use the academic-contract phrasing above unless the local report is later found.

## Claim

Top 1,000 collections: 327 use IPFS, 277 use centralized servers, and 98 had dead URLs.

### Approved Public Wording

A study of top NFT collections found a mix of IPFS, centralized hosting, and already dead URLs, showing that infrastructure risk exists even in high-volume collections.

### Source

Needs source. The arXiv fragility paper above supports broader fragility but not these exact top-1000 numbers.

### Evidence / Quote

TBC.

### Risk Level

High until sourced.

### Notes / Limitations

Do not publish numbers until source is attached.

## Claim

A Hedera NFT scan found around 7.6% erroring.

### Approved Public Wording

Some chain-specific scans have found measurable rates of broken NFT metadata or media paths.

### Source

Needs source.

### Evidence / Quote

TBC.

### Risk Level

High until sourced.

### Notes / Limitations

Do not publish exact percentage until source is attached.

## IPFS / Gateway / Pinning Issues

## Claim

NFT media can break because the token points to a gateway or URL that changes, even if the underlying data exists somewhere.

### Approved Public Wording

Even when data still exists somewhere, a token can still display as broken if it points to a gateway, server, or metadata route that no longer resolves.

### Source

General infrastructure claim; needs supporting citation for named examples.

### Evidence / Quote

TBC.

### Risk Level

Medium.

### Notes / Limitations

Safe as a general explanation if phrased carefully. Use named examples only with citations.

## Marketplace / Server Shutdown Issues

## Claim

Marketplace or company-hosted NFT media can become unavailable when a platform shuts down, redirects domains, or changes hosting.

### Approved Public Wording

NFTs that depend on external marketplaces, servers, metadata endpoints, or company-controlled domains can inherit the failure modes of those systems.

### Source

Needs source for named examples.

### Evidence / Quote

TBC.

### Risk Level

Medium.

## Named Historical Examples

## Claim

FTX / Coachella NFTs became a visible example of platform failure affecting NFT access/functionality.

### Approved Public Wording

FTX / Coachella is a public example where NFTs connected to a platform partnership became inaccessible or non-functional for some holders after FTX collapsed.

### Source

Pitchfork, "Coachella NFTs Seemingly Unavailable Amid FTX Crypto Collapse", November 17, 2022. https://pitchfork.com/news/coachella-nfts-seemingly-unavailable-amid-ftx-crypto-collapse/

### Evidence / Quote

Pitchfork reported that Coachella Keys were "in limbo" after FTX's collapse, that some holders could no longer access NFTs stored on FTX, and that one holder who withdrew before bankruptcy said the NFT did not appear functional in a personal wallet.

### Risk Level

Medium.

## Claim

nft.storage Classic / `nftstorage.link` gateway issues affected NFT display.

### Approved Public Wording

Gateway changes can break NFT display paths even when content-addressed data is preserved elsewhere.

### Source

Needs source.

### Evidence / Quote

TBC.

### Risk Level

High until sourced.

## Claim

CloneX / RTFKT had a media display issue tied to hosting/service-layer problems.

### Approved Public Wording

Even major branded NFT projects can face service-layer media display failures.

### Source

Needs source.

### Evidence / Quote

TBC.

### Risk Level

High until sourced.

## Claim

Infura gateway deprecation broke tokens that had hardcoded gateway URLs.

### Approved Public Wording

Hardcoded gateway URLs create long-term infrastructure risk when gateway providers change endpoints or policies.

### Source

Needs source.

### Evidence / Quote

TBC.

### Risk Level

High until sourced.

## Claim

Binance NFT marketplace shutdown may orphan hosted assets.

### Approved Public Wording

Marketplace shutdowns are a live reminder that NFT display should not depend solely on a single platform staying online.

### Source

Needs current source.

### Evidence / Quote

TBC.

### Risk Level

High until sourced.

## Xtrata-Specific Claims

## Claim

Xtrata v3.2.3 stores inscription content on-chain in fixed 16 KiB chunks.

### Approved Public Wording

Xtrata stores the content bytes on-chain in fixed chunks.

### Source

`xtrata-1.0/contracts/clarinet/contracts/xtrata-v3.2.3.clar`

### Evidence / Quote

Contract comments and constants define `CHUNK-SIZE u16384`, chunk maps, and read-only chunk access.

### Risk Level

Low.

## Claim

Xtrata v3.2.3 has a hard cap of 32 MiB per inscription.

### Approved Public Wording

The current local v3.2.3 contract source sets a 32 MiB hard cap per inscription.

### Source

`xtrata-1.0/contracts/clarinet/contracts/xtrata-v3.2.3.clar`

### Evidence / Quote

Contract comments say hard caps are total chunks <= 2048 and total size <= 32 MiB. Constants define `MAX-TOTAL-CHUNKS u2048`, `CHUNK-SIZE u16384`, and `MAX-TOTAL-SIZE`.

### Risk Level

Low for local source, medium for live deployed state until explorer verified.

## Claim

Small files can be minted in a single transaction on v3.2.3 up to 32 chunks.

### Approved Public Wording

The v3.2.3 core has a single-transaction small-file path for files that fit within one upload batch.

### Source

`xtrata-1.0/contracts/clarinet/contracts/xtrata-v3.2.3.clar`

### Evidence / Quote

Contract comments mention "Small-file single-tx minting is core-native and capped at one upload batch." Constants define `MAX-SINGLE-TX-CHUNKS u32`.

### Risk Level

Low for local source, medium for live helper flow.

## Bitcoin Pepes-Specific Claims

## Claim

Bitcoin Pepes are the first public Forever Twins collection.

### Approved Public Wording

Bitcoin Pepes are the first public Forever Twins collection, powered by Xtrata and built with Fak.fun. Holders are already claiming Forever Twins on Fak.fun.

### Source

Campaign notes from Jim / user prompt and local contract reference route.

### Evidence / Quote

TBC.

### Risk Level

Medium.

## Claim

The deployed-name helper source defaults to first 87 free, then 3 STX.

### Approved Public Wording

The deployed-name helper source defaults to first 87 Forever Twins free, then 3 STX. Confirm live state before posting because owner setters can change threshold and fee.

### Source

`contracts-reference/rapha-fakfun/pepe-4ever-fakfun.clar`.

### Evidence / Quote

`free-threshold` is `u87`; `inscribe-fee` is `u3000000`.

### Risk Level

Low for source default. Medium for live state until `get-free-threshold` and `get-fee` are read from the deployed contract.

## Claims Not Yet Safe To Use Publicly

- 498,000 NFT scan and 1 in 5 broken.
- Top 1,000 collection storage breakdown numbers.
- Hedera 7.6% erroring.
- FTX / Coachella details.
- nft.storage Classic / `nftstorage.link` display impact.
- CloneX / RTFKT details.
- Infura gateway deprecation impact.
- Binance NFT marketplace timing and asset orphaning details.
- KnownOrigin shutdown/preservation details.
- Bitcoin Pepes exact current claim count. Casual wording may use "around 200" until refreshed from `get-inscribed-count`.
- Exact free promo threshold and live fee.
