# Local 1,024-item rehearsal

Run:

```sh
npm run simulate:mints
```

The v2 simulation builds the canonical release model with engine ID 1 and then
uses the real engine and seed SHA-256 values in Clarinet simnet. It:

1. Locks the gateway and permanently sets the engine.
2. Mints 1,024 HTML entries with 1,024 unique content hashes.
3. Proves all 1,024 full trait profiles and visual hue values are unique.
4. Verifies every seed has the engine dependency.
5. Registers all edition/hash commitments in 41 atomic batches.
5. Audits 32 mosaic pages, 1,024 NFT mappings, and 1,024 registry hashes.
6. Exercises recording ownership, history, transfers, and newest-child rules.

It makes no network calls, broadcasts no transactions, and spends no real STX.
The emitted `MINT_SIMULATION_REPORT` is local evidence, not proof of mainnet
minting.
