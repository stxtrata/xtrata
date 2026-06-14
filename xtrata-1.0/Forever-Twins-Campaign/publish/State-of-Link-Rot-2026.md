# State of Link Rot 2026

Draft status: publishable structure, but statistics and named examples need citations before release.

## NFTs Promised Permanence

NFTs were sold on a simple idea: own a digital object, not just a temporary platform entry.

But for many collections, the token and the media are not the same thing.

The token may be permanent. The artwork may live somewhere else.

## What Most NFTs Actually Store

Many NFTs store a pointer.

That pointer may lead to:

- an IPFS gateway;
- a centralized server;
- a marketplace-hosted file;
- a metadata endpoint;
- a pinning service;
- a company-controlled domain.

If that path breaks, the token can remain valid while the image, animation, audio, or metadata disappears.

## Token vs Media

Ownership is not the same as availability.

A wallet can prove ownership. It cannot make a dead link load.

Most NFTs do not own the art. They own a pointer. If the pointer leads nowhere, the token still exists, but the thing people cared about is gone.

## Link Rot and Invisible Repair

Your NFT may look fine today.

That does not prove it has never broken.

Marketplaces, indexers and project teams often have to re-cache, re-pin, re-host, switch gateways, serve from mirrors, or otherwise repair the display layer so broken NFT media appears again.

To the holder, nothing dramatic happens.

The NFT goes blank for a few hours, a day, or a week. Then it appears again.

That temporary failure is a warning shot.

The system failed once and was rescued.

Next time, the original artist may no longer have the files, the project team may have moved on, the pinning account may have lapsed, the marketplace may have shut down, the gateway may be gone, or the person with the backup may not be around.

That is when temporary failure becomes permanent loss.

## Examples and Data

This section must be filled from `Source-Claims-and-Citations.md` before publication.

Potential claims currently not safe to publish as hard claims:

- scan of roughly 498,000 NFTs;
- roughly 1 in 5 broken metadata or media paths;
- top 1,000 collection storage breakdown;
- Hedera error-rate scan;
- FTX / Coachella;
- nft.storage Classic / gateway issues;
- CloneX / RTFKT;
- Infura gateway deprecation;
- Binance NFT marketplace shutdown;
- KnownOrigin preservation issues.

## Why Pinning Alone Is Not Enough

Pinning can help keep data available.

But pinning does not necessarily fix the pointer embedded in the original token. If the contract points at a dead gateway or endpoint, holders can still see broken media even if the data exists somewhere else.

This is why the campaign should avoid saying "pinning is useless." It is not.

The more precise point is:

Pinning is a backup strategy. A Forever Twin is an owned on-chain counterpart.

## What Permanent Media Should Mean

Permanent media should be reconstructable without relying on one company, one gateway, one marketplace, or one private server staying alive.

It should have:

- on-chain or hash-bound bytes;
- clear token-to-media mapping;
- provenance;
- creator or collection authority where possible;
- verification instructions;
- indexer and marketplace compatibility;
- a manifest for collection-level context.

## Xtrata / Forever Twins as One Live Answer

Xtrata stores content bytes on-chain in chunks and exposes read-only reconstruction paths.

Forever Twins use that permanence layer to give existing NFTs permanent on-chain counterparts.

This does not fix the old IPFS pointer. It gives the artwork a permanent on-chain twin.

## Bitcoin Pepes Case

Bitcoin Pepes are the first public Forever Twins collection. TBC final wording.

The campaign is powered by Xtrata and built with Fak.fun. TBC final wording.

The public promo appears to be first 87 free, then 3 STX. Needs contract and Fak.fun confirmation.

## What Founders Should Do Next

Founders should map their collection's infrastructure:

- What does the token point to?
- Where does the media live?
- What happens if a gateway disappears?
- What happens if a marketplace shuts down?
- Can the original contract update metadata?
- Is there a manifest?
- Can holders verify the media independently?

Optional CTA:

Request a collection permanence audit.

