# Recursive inscription and deployment

Keep the registry paused through the complete collection audit.

## 1. Local release gate

```sh
npm ci
npm run check:contract
npm test
npm run build
npm run simulate:mints
```

Record the Git commit, Node version, contract source hashes, and canonical
engine SHA-256 in the release notes.

## 2. Inscribe the engine

1. Use `artifacts/proof-of-free-engine.js` without minifying or rewriting it.
2. Inscribe it through Xtrata as `text/javascript`, with no dependencies and no
   parents.
3. Seal it and compare Xtrata's final hash with the local file hash.
4. Record the resulting engine inscription ID.

Engine content must exist before a seed can be sealed; Xtrata does not permit a
forward dependency reference.

## 3. Generate the final seed release

```sh
npm run release:build -- --engine-id <ENGINE_ID>
npm run release:verify
```

Do not edit the resulting HTML or manifest. Every seed uses `/i/<ENGINE_ID>` and
declares the same engine in its JSON identity.

## 4. Test recursive resolution

Before the full collection:

1. Inscribe editions 1, 2, 512, 1000, and 1024 as `text/html`.
2. Give each seed exactly `[ENGINE_ID]` as its Xtrata dependencies and no
   parents.
3. Confirm `get-dependencies` returns the engine.
4. Confirm the `/i/<ENGINE_ID>` route returns the exact engine bytes.
5. Open each seed in the Xtrata viewer and the Living Synth sandbox.
6. Compare its final hash with `manifest-recursive.json`.
7. Exercise pointer down, movement, release, audio stop, and replay.

Repeat this gate on testnet before mainnet.

## 5. Mint the collection

Set the collection mint contract's default dependencies to `[ENGINE_ID]`.
Dependencies require sequential sealing: use one seal transaction per item even
if uploads are batched. Maintain a resumable ledger containing edition,
filename, expected hash, Xtrata ID, owner, seal transaction, and confirmation
height.

For every confirmed seed, verify:

- MIME is `text/html`;
- sealed is true;
- size and hash equal the release manifest;
- dependencies equal `[ENGINE_ID]`;
- parents are empty;
- IDs and editions are unique.
- all 1,024 manifest trait profiles and hue values are unique.

Stop on the first mismatch. Never shift later editions to compensate for a
failed or duplicate mint.

## 6. Deploy and initialize contracts

Deploy from the same operator account:

1. `contracts/xtrata-v3-2-3-gateway.clar`
2. `contracts/proof-of-free-living-synth-v2.clar`

Then:

1. `lock-core-contract(gateway)` — irreversible.
2. `set-engine(gateway, ENGINE_ID)` — irreversible in v2.
3. Configure recording fee and recipient if required.
4. Register editions while paused.

`register-edition` performs all Xtrata checks on-chain. For the 41 batch
transactions, supply each `{edition, nft-id, content-hash}` only after an
off-chain audit of the same Xtrata checks. A failed batch is atomic.

## 7. Final audit and launch

1. Read all 32 mosaic pages and confirm exactly 1,024 mappings.
2. Read all 1,024 edition hashes and compare them with the manifest.
3. Re-read the engine ID and hash.
4. Re-run representative browser playback from Xtrata.
5. Archive the manifest, settings, transaction ledger, contract sources, and
   audit report.
6. Call `set-paused(false)`.
7. Configure the deployed gateway and registry addresses in `src/config.ts`,
   rebuild the web app, and deploy that exact build.

## 8. Recording flow

The owner saves a recording JSON, inscribes it as `application/json` with their
seed NFT ID in `parents`, then calls `register-recording`. The app re-reads the
fee immediately before opening the wallet and applies an exact deny-mode STX
postcondition.
