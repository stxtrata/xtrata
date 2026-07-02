# Repoint Your Collection Playbook

Founder-facing draft.

## When A Collection Needs This

Your collection should consider a permanence upgrade if media or metadata depends on:

- IPFS gateways;
- centralized servers;
- marketplace-hosted files;
- metadata endpoints;
- pinning accounts;
- company-controlled domains;
- a small number of people holding the only backups.

The question is not whether the collection is broken today.

The question is what happens if the media path breaks tomorrow.

## If The Original Contract Can Repoint

If the original contract can update metadata or media paths, the cleanest route may include:

- preserving current media on Xtrata;
- creating a collection manifest;
- updating the original metadata route to reference Xtrata or a hash-bound manifest;
- publishing verification instructions.

Needs per-contract review.

## If The Original Contract Cannot Repoint

If the original contract is immutable or cannot safely update media paths, a Forever Twin flow may be a better fit.

The original collection keeps its identity.

The Xtrata twin gives holders a permanent on-chain counterpart.

## Helper Contract / Clone Contract Options

Options depend on collection needs:

- holder-claim helper contract;
- creator-led migration helper;
- clone/twin collection contract;
- manifest-only mapping for static preservation;
- marketplace-aware resolver.

Bitcoin Pepes helper specifics are TBC with Rapha.

## What Founders Need To Provide

- Original contract address.
- Token ID range and supply.
- Current metadata format.
- Current media sources.
- Original media files where available.
- Trait data.
- Creator/project authority signal.
- Royalty and marketplace preferences.
- Desired holder flow.

## Token ID Mapping

A durable collection needs a clear mapping:

Original token ID -> Xtrata inscription ID.

This can live in a manifest, resolver contract, or both.

## Media Files

Small files may be eligible for one-transaction Xtrata inscription flows.

Larger files can use chunked uploads. Local v3.2.3 source sets a 32 MiB hard cap. Live product limits and UX should be confirmed before quoting publicly.

## Metadata / Trait Manifests

Metadata and traits can be preserved through one or more manifests:

- collection mapping manifest;
- trait manifest;
- migrated-token state manifest;
- rights/license manifest;
- verification manifest.

If the manifest comes from the artist or collection creator, that is the strongest authority signal.

## Holder Claim Flow

Typical holder flow:

1. Connect wallet.
2. Prove ownership of original NFT.
3. Claim or inscribe the permanent counterpart.
4. Verify the Xtrata inscription.
5. Keep, swap, transfer, or sell according to helper-contract rules.

Exact transfer/listing behavior must be confirmed per collection.

## Pricing

Contact Xtrata / Fak.fun for collection setup and pricing.

Commercial split and service pricing are internal until approved for public use.

## Timeline

Bitcoin Pepes helper reportedly took around 24-48 hours as an anecdotal build time. TBC before using publicly.

Practical timeline depends on:

- media availability;
- contract review;
- manifest complexity;
- claim UI;
- marketplace behavior;
- finalization plan.

## Trust Moments

- Source media collection.
- Token ID mapping.
- Manifest creation.
- Helper contract deployment.
- Claim flow launch.
- Canonical hash/finalization, if applicable.

## Verification

Every campaign should ship:

- public contract links;
- read-only verification guide;
- manifest hash;
- Xtrata inscription links;
- transfer/listing caveats;
- finalization status.

## Launch Plan

1. Private audit.
2. Founder approval.
3. Manifest draft.
4. Helper flow test.
5. Holder FAQ.
6. Claim launch.
7. Verification thread.
8. Case study.

