# FAQ and Objections

Draft status: public-facing, but TBC markers must be resolved before final publication.

## What is a Forever Twin?

A Forever Twin is a permanent on-chain counterpart to an existing NFT. For Bitcoin Pepes, the goal is to give each original Pepe a Xtrata-backed twin that preserves the artwork on-chain while keeping the original collection identity intact.

Final name TBC with Rapha.

## Is this just pinning?

No. Pinning keeps a file available somewhere else. Xtrata stores the bytes themselves on-chain in the Xtrata permanence layer.

Pinning can be useful, but it still depends on gateways, services, accounts, mirrors, or infrastructure continuing to work. A Forever Twin is designed to give the holder an owned, on-chain counterpart.

## Does this fix the original IPFS link?

No. This does not fix the old IPFS pointer. It gives the artwork a permanent on-chain twin.

The original pointer may still be fragile. The Xtrata copy remains available through Xtrata and any compatible indexer/viewer.

## Why are there two tokens?

Because the original collection already exists. The campaign should not pretend the old token never happened or force holders into a clean-room migration.

The working model is a bound pair: the original Pepe keeps its identity, and the Xtrata twin gives the art a permanent on-chain counterpart. Exact mechanics need Rapha / contract confirmation.

## Does this double the supply?

The intended answer is no: this does not create two freely circulating Pepes. It creates a bound pair where one side is always escrowed and the holder controls the live side.

Needs Rapha / contract confirmation.

## Can both tokens circulate at once?

The helper source enforces an escrow state in `Bindings`: when `xtrata-escrowed` is true, the registry holds the Xtrata twin and the holder keeps the Pepe; when false, the registry holds the Pepe and the holder keeps the Xtrata twin.

## What is escrowed?

In the expected helper-contract model, one side of the pair is held by the helper contract while the holder controls the other side. The holder can switch which side is live.

Needs Rapha / contract confirmation.

## What do I actually hold?

You hold the live side of the bound pair. Depending on the current state, that may be the original Bitcoin Pepe side or the Xtrata/on-chain twin side.

Exact UI wording TBC.

## What happens if I swap?

In the intended model, swapping moves the currently live side into escrow and releases the counterpart to the holder.

Confirmed in helper source by `swap-pepe-for-xtrata` and `swap-xtrata-for-pepe`.

## What happens if I sell or transfer?

The expected model is that the escrowed counterpart follows the live token's owner, so the pair remains one economic unit. This must be verified before publication.

Public wording until confirmed: sale and transfer behavior depends on the helper contract and marketplace support. Check the final Fak.fun guide before listing or transferring.

## What happens if my Pepe is listed?

TBC. Holders should confirm with Fak.fun before trying to claim from a listed token.

## What does Xtrata store?

Xtrata stores the media bytes on-chain in fixed chunks, with metadata such as mime type, total size, chunk count, sealed status, and final hash. The local v3.2.3 contract source confirms 16 KiB chunks and immutable sealed content.

## Is the full image on-chain?

For the Xtrata inscription, yes: the Xtrata content bytes are stored on-chain and can be reconstructed from chunks.

For the Bitcoin Pepes helper campaign, confirm exact asset and manifest handling before final publication.

## Is metadata also preserved?

TBC. Xtrata can store media, metadata, scripts, manifests, and other file data. The Bitcoin Pepes campaign may use one or more manifests for collection mapping, traits, and original token IDs. Exact scope needs Rapha / Xtrata confirmation.

## What is a manifest?

A manifest is a structured collection document. It can map original collection token IDs to Xtrata inscription IDs, preserve traits, document provenance, define display rules, and explain how the collection can be reconstructed.

## Who controls the manifest?

TBC. The strongest authority signal is a manifest created or signed by the artist, creator, collection owner, or recognized project authority.

## What is finalization?

Finalization is the point where a canonical record is locked so it cannot be quietly changed later. The exact Bitcoin Pepes finalization process and authority need contract verification.

## Can the canonical record change after finalization?

The intended answer is no. Once finalized, the canonical record should not be alterable.

Needs helper-contract verification.

## What if not every holder joins?

The campaign can still preserve the Pepes that claim. Non-claiming holders keep their original NFTs as before. Collection-level manifest and display behavior for partial adoption is TBC.

## Why should I care if my NFT still displays?

Because display today does not prove permanence tomorrow. Your NFT does not feel fragile until it is gone.

Marketplaces, indexers and project teams often have to re-cache, re-pin, re-host, switch gateways, serve from mirrors, or otherwise repair the display layer so broken NFT media appears again. A temporary blank image is a warning shot.

## Could my NFT have gone blank before without me knowing?

Yes, it is possible. A marketplace or indexer may repair the display layer before most holders notice. Someone quietly puts the picture back where the marketplace can find it.

Use this carefully. It is an infrastructure explanation, not an accusation against any project.

## Is this only for Bitcoin Pepes?

No. Bitcoin Pepes are the first public Forever Twins collection, pending final wording confirmation. The same pattern can be adapted for other collections.

## Can other collections use this?

Yes. Collection founders can talk to Xtrata / Fak.fun about a Forever Twin or repointing campaign. Pricing and implementation details are TBC.

## Does this work for music NFTs or larger files?

Xtrata can store larger files, including music and other media. The local v3.2.3 contract source confirms a 32 MiB hard cap and chunked uploads. Larger files may require multiple transactions and an automated flow.

## Is this financial advice or investment-related?

No. This campaign is about media permanence, ownership clarity, and infrastructure risk. It is not investment advice and does not make price or return claims.
