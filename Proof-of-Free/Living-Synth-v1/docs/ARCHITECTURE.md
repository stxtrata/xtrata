# Architecture

The system separates immutable media from mutable selection:

1. The collection NFT and recording JSON are Xtrata inscriptions.
2. The recording is minted with the collection NFT ID in Xtrata's `parents` list.
3. The registry verifies current ownership of both inscriptions, JSON MIME type, and the parent link in one transaction.
4. The registry charges the configured recording fee, records the child permanently in the NFT's history, and makes the newest child active.
5. The mosaic reads 32 fixed pages of 32 cells from the registry. Each cell exposes the NFT ID, recording count, active recording, and revision.
6. The browser reconstructs the seeded NFT HTML, shared engine, and active JSON recording from Xtrata chunks; checks every final SHA-256 hash; and runs the HTML/engine pair inside a script-only iframe with network, navigation, forms, media, and same-origin access denied.

## Trust boundary

The registry locks its gateway contract once. The gateway is an immutable ABI adapter around mainnet `xtrata-v3-2-3`; it owns no state and cannot write to Xtrata. This prevents callers from providing a counterfeit ownership contract.

The JSON body cannot be interpreted by Clarity. The contract guarantees that it is a sealed, non-empty `application/json` Xtrata child no larger than 256 KiB, while the browser validates the complete `proof-of-free/living-recording` schema, point/time bounds, and embedded contract/NFT/edition before playback. The engine is separately restricted to sealed `text/javascript` content no larger than 128 KiB and its hash is pinned in registry state.

## Transfer semantics

Recognized recordings remain as playable history when an NFT transfers. The newest recognized child is always the mosaic default. Only the current NFT owner can add another recording; older children can be played manually but cannot replace the newest child as the mosaic default. A recording NFT does not need to follow the parent after registration because its content and parent relationship are immutable.

## Recording fee

`register-recording` charges an on-chain STX fee before changing any registry state. It defaults to `100000` microSTX (0.1 STX), is bounded between `1000` microSTX (0.001 STX) and `1000000` microSTX (1 STX), and defaults to the registry deployer. The caller supplies the fee it tested; a stale value is rejected. The frontend also pins the exact spend with a deny-mode postcondition. Only the current two-step contract owner can change the amount or recipient.

## Mosaic freshness

Every state change increments both a per-NFT revision and a global revision and emits a print event. A production indexer may subscribe to events for instant updates, while periodic `get-system-state` and `get-mosaic-page` reads provide authoritative recovery without trusting the indexer.
