# Local mint simulation

Run the deterministic collection simulation with:

```sh
npm run simulate:mints
```

The simulation uses Clarinet simnet and the test-only Xtrata core. It never connects a wallet, contacts mainnet, broadcasts a transaction, or spends real STX.

It performs the following lifecycle:

1. Locks the registry to the test gateway and sets a valid JavaScript engine inscription.
2. Mints 1,024 seeded HTML inscriptions, split deterministically between two test wallets.
3. Reads every owner through the gateway before registering all editions in atomic batches of at most 25.
4. Mints valid JSON recording children for representative editions, including multiple recordings whose newest child becomes the default.
5. Transfers one collection NFT, proves its former owner can no longer register a recording, and registers a new child from its current owner.
6. Reads and verifies all 32 mosaic pages and all 1,024 edition-to-NFT mappings.

On success, the quiet runner prints one `MINT_SIMULATION_REPORT=` line containing machine-readable JSON. If the test fails, it prints the complete Clarinet/Vitest diagnostics and exits unsuccessfully. This report is evidence of local contract behavior, not evidence of a mainnet mint.
