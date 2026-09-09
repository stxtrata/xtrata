# Timeloop v1.3.6 — direct game checkpoint publication

A player previously had to download a JSON checkpoint, leave the game and upload it into Xtrata. The enhanced public viewer accepts a narrowly scoped JSON save request from a connected, explicitly registered interactive preview. It reviews the publishing wallet, exact JSON, byte count and live protocol fee, then asks the wallet to mint that checkpoint. The game retains JSON download/manual inscription as the fallback.

## Implementation

- `src/lib/viewer/game-save.ts`: three methods, `xtrata_saveGame`, `xtrata_checkGameSave`, `xtrata_loadGameSave`.
- `src/lib/viewer/public-wallet-bridge.ts`: registered-frame/source/origin/token/consent checks, shared operation lock and account/context guards also cover these methods. Arbitrary contract calls remain rejected.
- `src/home/main.js`: supplies the current client/session, real wallet adapter and host-owned review; entry is loaded by `index.html`. The game's iframe is not replaced during save requests.

Each method requires `{address, network:'mainnet'}` matching the connected wallet. Save accepts `json`; check accepts the 64-character lowercase protocol running `hash`; load accepts a decimal `tokenId`. Methods return `{status,contract,hash}` plus a submitted `txid`, confirmed `tokenId`, or validated loaded `json` as appropriate. A wallet callback alone returns `submitted`, never `confirmed`.

The current integration intentionally targets `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`. Saves use `mint-single-tx-recursive`, MIME `application/json`, URI `meridian-save-v2`, and dependency **3040**, the original immutable game/family anchor. This is a dependency, not supersession; no old inscription is replaced. The host supplies these values, not the requesting game. No contract deployment or backend secret is added.

Direct publication/loading is limited to 32 × 16 KiB (512 KiB); game JSON export/import still supports its existing 4 MB limit. Larger saves use the ordinary inscription interface and manual JSON import. Direct publication requires wallet-labelled version-2 Meridian save envelopes. Loading accepts an absent/null wallet label from manual fallback exports, but still requires on-chain creator = connected wallet, sealed JSON metadata, bounded complete chunks and an exact running-hash match. The game separately verifies replay compatibility and content fingerprint before explicit restore. Wallet metadata by itself never establishes authorship.

The protocol fee is quoted live before review and rechecked after it. A sender STX LessEqual post-condition caps protocol spend at that reviewed quote with Deny mode. Miner fee remains separately reviewed in the wallet. Quotes above 1 STX fail closed into the manual flow. Existing café amounts, fees, recipients, ordinary minting and other wallet operations are unchanged.

The game captures the exact checkpoint before requesting publication, distinguishes pending/unknown/confirmed outcomes, retains a recovery marker, and blocks another publication until a pending request is resolved or explicitly acknowledged as rejected/dropped. It caches the record in local storage when allowed, and retains it in memory across closing/reopening Help when the sandbox blocks storage. Opaque viewers cannot preserve that memory through closing/reloading the whole game: the UI asks users to keep their JSON and transaction reference. The host uses a 90-second wallet callback timeout; late or lost callbacks require confirmation recovery, not automatic resubmission.

## Validation

- 113 targeted tests: new save service, public wallet bridge, runtime fee parsing, wallet compatibility and homepage content.
- `npx vite build` passed (existing large-chunk advisories).
- Game: 121 tests and `npm run typecheck` passed; standalone regenerated as v1.3.6.
- Browser simulation uses the real bridge and save service with the public Archivist identity and mocked chain/wallet ports. No private key, personal wallet or live broadcast adapter is available in that fixture.
- Repository-wide TypeScript checking remains red on existing dependency/test typing issues, including broad Vitest `ExpectStatic` conflicts and `client.ts` sponsored-options types. No production diagnostics were reported in the newly added game-save module or modified public bridge. The scoped check also follows the existing client typing issue; it is not claimed as a clean whole-app typecheck.

## Release sequence

1. Review/merge this branch's viewer changes and deploy the public Xtrata app through the normal flow.
2. Validate the deployed viewer with wizard-only tests; live spending requires an approved budget. No real save or café transaction was broadcast during this implementation.
3. Inscribe the new v1.3.6 standalone HTML from the game release folder. Keep #3040 as the immutable v1.3.5 release/family anchor.
4. Open the new game in `/x/<new-id>` for in-game wallet features. Direct `/i/<new-id>` and downloaded/file HTML still work for offline gameplay and manual JSON export.

The new HTML can be opened before viewer deployment, but direct publishing will fall back until that viewer support is live. Automatic wallet-history discovery is not part of this release: the game displays a confirmed save ID and accepts a save ID for loading. Existing v1.3.5 saves remain compatible; the game rules/save case schema stays at 1.3.5 while the UI release is 1.3.6.

The standalone/game sources and simulation assets remain local in the ignored `AAA-Collection` folder. No media assets should be committed with this viewer patch. This branch is not pushed or deployed automatically.
