# Bitcoin Pepes Case Study

Draft status: live case-study draft. Fill exact fresh numbers, screenshots, claim data, and verified contract behavior before formal publication.

## Context

Bitcoin Pepes are the first public Forever Twins collection, powered by Xtrata and built with Fak.fun.

This campaign is a joint effort between Xtrata and Rapha / Fak.fun. Xtrata provides the permanence layer. Rapha / Fak.fun built the Bitcoin Pepes helper flow.

## Problem

Your NFT can survive while the art disappears.

For many NFTs, the token points to media somewhere else. If that media path breaks, the token may remain valid while the thing people cared about becomes unavailable.

## Why Bitcoin Pepes

Pepes are meme-native, culturally legible, and holder-driven. If any art deserves not to disappear, it is the art communities actually care about.

## What Rapha / Fak.fun Built

Rapha / Fak.fun built a helper contract and claim flow that lets Bitcoin Pepes holders create or claim a Forever Twin connected to their original Pepe.

## What Xtrata Provides

Xtrata provides on-chain media storage and reconstruction.

The local Xtrata v3.2.3 contract source confirms:

- 16 KiB chunked storage;
- sealed immutable content;
- 32 MiB hard cap;
- single-transaction small-file path up to 32 chunks;
- read-only chunk and metadata functions.

## How The Twin Flow Works

1. Holder owns original Bitcoin Pepe.
2. Holder claims/inscribes a Forever Twin through Fak.fun.
3. Xtrata stores the media bytes on-chain.
4. The helper contract binds the original and twin.
5. One side is live and one side is escrowed.
6. The holder can switch between the original side and the Xtrata side.
7. The pair remains one economic unit.

## Current Claim Stats

- Current claimed: around 200 in casual copy; pull `get-inscribed-count` before publishing a hard number.
- Promo threshold: helper source default first 87; live state TBC.
- Paid price after promo: helper source default 3 STX; live state TBC.
- Network transaction fee behavior: TBC.

## First 87 Promo

The deployed-name helper source defaults to first 87 free, then 3 STX. Confirm live `get-free-threshold` and `get-fee` before publication.

## Verification Links

- Claim URL: `https://fak.fun/SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`.
- Original contract explorer: TBC.
- Helper contract explorer: TBC.
- Xtrata contract explorer: TBC.
- Xtrata inscription URL pattern: `https://xtrata.xyz/inscription/{id}`.

## Manifest / Finalization Status

- Collection manifest: TBC.
- Trait manifest: TBC.
- Token ID mapping manifest: TBC.
- Finalization function: TBC.
- Finalization date or condition: TBC.
- Finalization authority: TBC.

## Lessons For Other Collections

- Do not wait for media failure to become permanent.
- Map the original token IDs to permanent media IDs.
- Preserve creator or collection authority through a manifest.
- Make verification public.
- Avoid overclaiming: this gives holders a permanent counterpart; it does not magically fix old pointers.

## Placeholder Screenshots

- Claim page.
- Wallet confirmation.
- Transaction success.
- Xtrata inscription view.
- Contract read-only verification.
- Claim counter.
