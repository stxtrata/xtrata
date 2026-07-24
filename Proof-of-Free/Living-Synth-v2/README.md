# Proof of Free — Living Synth v2

Living Synth v2 is a recursive Xtrata collection: one immutable JavaScript
engine and exactly 1,024 deterministic HTML seed inscriptions. Each seed lists
the engine inscription as its Xtrata dependency. Owners can later inscribe
bounded recording JSON as a child of their seed NFT.

## What v2 adds

- A canonical engine API (`proof-of-free/engine-api-v2`) with complete
  on/move/off gesture playback.
- A deterministic two-pass release builder and independent verifier.
- Exactly 1,024 unique, self-identifying HTML seeds using `/i/<engine-id>`.
- Exactly 1,024 collision-free trait profiles. A bijective 10-bit mapping gives
  every edition a unique palette/root/waveform tuple and a unique visual hue.
- A reproducible manifest containing every byte length, SHA-256, dependency,
  MIME type, edition, and filename.
- A one-time engine lock in the registry.
- Seed MIME, seal, size, engine-dependency, and content-hash enforcement.
- Browser verification of seed identity, on-chain dependency, registry hash,
  and engine hash before sandboxed execution.
- A 1,024-item simnet rehearsal using the real generated artifact hashes.

## Verify locally

```sh
npm install
npm run check:contract
npm test
npm run build
npm run simulate:mints
```

During development, `http://localhost:4173/engine-preview.html` exercises the
canonical engine directly with edition 512.

To run the complete simnet mint rehearsal and open all 1,024 playable canonical
seeds in a local collection gallery:

```sh
npm run preview:mints
```

The gallery serves the simulated engine inscription at `/i/1`, matching the
recursive route embedded in every generated seed. No transaction is broadcast
and no STX is spent.

## Build inscription artifacts

First inscribe and seal `artifacts/proof-of-free-engine.js` as
`text/javascript`. Once its Xtrata ID is known:

```sh
npm run release:build -- --engine-id 12345
npm run release:verify
```

The ignored `release/` directory will contain:

```text
engine/proof-of-free-engine.js
seeds/proof-of-free-0001.html
…
seeds/proof-of-free-1024.html
manifest-recursive.json
```

The verifier rebuilds the expected release independently and rejects altered,
missing, extra, non-canonical, misidentified, or trait-colliding seeds.

See `docs/ARCHITECTURE.md` for the trust model and `docs/DEPLOYMENT.md` for the
testnet/mainnet inscription sequence.
