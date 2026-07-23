# Proof of Free — Living Synth v1

This is a new, isolated version of Proof of Free: a 1,024-voice synth whose mosaic and recording history are coordinated by a Clarity smart contract.

## What is included

- A Clarity registry enforcing NFT ownership and immutable Xtrata child relationships.
- A locked, read-only Xtrata v3.2.3 gateway.
- Thirty-two-page mosaic reads for all 1,024 editions.
- A browser player that reconstructs the hash-pinned inscribed engine and each seeded HTML NFT inside a network-denied iframe, with loop capture, JSON saving, fee-aware wallet registration, newest-child mosaic playback, and manual playback of every earlier child.
- A versioned recording JSON Schema.
- Clarinet and frontend tests covering two-step administration, atomic edition batches, content bounds and hashes, ownership, child linkage, MIME enforcement, stale-fee protection, exact wallet postconditions, transfers, history, sandboxing, newest-child defaults, and mosaic paging.

## Start locally

```sh
npm install
npm run check:contract
npm test
npm run simulate:mints
npm run dev
```

Before chain reads and writes can work, deploy the contracts and fill the two blank addresses in `src/config.ts`. The synth and 1,024-cell interface still load without a contract so the interaction can be developed safely.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the state model, [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the launch sequence, and [docs/MINT-SIMULATION.md](docs/MINT-SIMULATION.md) for the deterministic 1,024-mint rehearsal.
