# Deployment and launch

## 1. Verify locally

```sh
npm install
npm run check:contract
npm test
npm run build
```

## 2. Deploy contracts

Deploy in this order from the same collection operator account:

1. `contracts/xtrata-v3-2-3-gateway.clar`
2. `contracts/proof-of-free-living-synth-v1.clar`

Both contracts are verified as Clarity 4 and can be deployed through the dedicated gated section in the central Xtrata Deploy Console. The console hashes the bundled sources, checks the on-chain interface after every publish, and keeps later steps locked until the preceding state test succeeds.

The supplied gateway targets mainnet Xtrata `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`. Create a separately named gateway with the correct core constant for testnet; do not reuse a mainnet registry initialized with a test gateway.

## 3. Initialize once

From the registry deployer:

1. Call `lock-core-contract` with the deployed gateway trait reference. This is irreversible.
2. Test that the engine is a sealed, non-empty `text/javascript` inscription no larger than 128 KiB, then call `set-engine`. The registry permanently pins its 32-byte content hash with the ID.
3. Confirm the default recording fee (0.1 STX to the deployer), or call `set-recording-fee` / `set-fee-recipient` within the 0.001–1 STX bounds.
4. Load the claimed/minted edition manifest. The console checks each NFT and empty slot, then calls `register-edition-batch` atomically in groups of at most 25. A partial manifest is supported; every supplied mapping must match the on-chain count.
5. Audit all 32 `get-mosaic-page` responses and the supplied manifest mappings.
6. Call `set-paused(false)` to let owners register recordings.

Keep the registry paused while initial edition mappings are loaded. Duplicate editions and duplicate NFT IDs reject the entire batch without partial writes. If administration needs to move, use `initiate-contract-ownership-transfer`; the nominated address must independently call `accept-contract-ownership`, and the current owner can cancel before acceptance.

## 4. Configure the app

Set the deployed gateway and registry addresses in `src/config.ts`, then run `npm run build`. The resulting `dist/` folder is the front-end artifact. No write operation is available until both addresses are present.

## 5. Owner recording flow

1. Connect the wallet that currently owns the collection NFT.
2. Select its cell, record a loop, and save the JSON.
3. Inscribe it through Xtrata as `application/json`, with the collection NFT inscription ID in `parents`.
4. Enter the new inscription ID and choose **Register child**.
5. After confirmation, the recording is the NFT's default mosaic playback.

The app re-reads the fee immediately before opening the wallet, supplies it as `expected-fee`, and uses deny mode with an exact STX postcondition. If the fee changes meanwhile, the transaction fails instead of charging a different value. The registry also enforces the 0.001–1 STX bounds, current NFT owner, sealed non-empty JSON content no larger than 256 KiB, and immutable child relationship. The Xtrata parent must be set while minting; a JSON field that merely claims a parent is not sufficient. Every registered child stays in the playable history, while only the newest child is returned as the mosaic default.
