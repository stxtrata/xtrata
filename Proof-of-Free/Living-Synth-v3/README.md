# Proof of Free — Living Synth v3

A ground-up, streamlined rebuild that merges the best of v1/v2 with the
genome-based "1,024-part on-chain modular instrument" design.

**One universal engine. 1,024 deterministic genomes. Gestures, not audio.**

## What was kept from v2

- The immutable engine + tiny HTML seed inscription model (`/i/<engine-id>`).
- The bijective 10-bit slot permutation — every edition still owns a unique
  (palette, tone class, waveform) tuple and a unique hue.
- Strict, bounds-checked payload validation with genesis fallback.
- The two-pass, machine-independent, byte-identical release build.

## What is new in v3

- **Compact genome** (`packages/genome/genome.js`): edition → full instrument
  (dual oscillator, filter, ADSR, tempo-synced delay, distortion, melody
  pattern, pad behaviour, mosaic position). `engineVersion` is baked into
  every genome. One splitmix32 PRNG, no `Math.random` anywhere.
- **Shared musical framework**: D dorian, 132 BPM, 4 bars × 16 steps,
  96 PPQ tick transport. Every pitch in every instrument — genesis melodies
  and quantised pad X-axis alike — comes from the shared scale, so tiles
  combine as an ensemble.
- **Orchestration map**: the 32×32 grid position assigns a musical role
  (bass / lead / motif / texture / pulse / drone); the "X" diagonals carry
  the leads and motifs, so the logo is literally the score.
- **Deterministic genesis melody** per genome (same notes forever).
- **Mountable engine** instead of a document-takeover singleton:
  `ProofOfFree.mount(container, {edition, mode})` supports dormant → preview
  → instrument states, a shared AudioContext, and a 6-voice cap with
  oldest-first stealing. One page can host the whole mosaic without 1,024
  audio graphs. Seed inscriptions still auto-boot via `#pof-seed`.
- **Claim-gated master mode**: the same engine mounts the 32×32 mosaic,
  verifies the exact controller, engine fingerprint, supply, and mandatory
  BNS/wallet policy, and reveals/triggers only successfully claimed editions.
  Registry failure or any policy mismatch fails closed to 1,024 black cells.
- **`xtrata-performance` v1** (`packages/performance-codec/`): tick-based
  gesture event stream (down/move/up + x/y/pressure) bound to parent
  edition, genome hash, and engine version. Record, replay, export, import —
  the event stream is the canonical work.
- **Simulated default registry** in the prototype: revision history exactly
  as the ownership-gated Clarity contract would store it (Revision 0 is
  always the genesis composition).

## Layout

```
packages/genome/               deterministic genome + melody + music framework
packages/performance-codec/    xtrata-performance v1 create/validate
engine/engine-core.js          universal synth/UI engine (mount + seed boot)
artifacts/proof-of-free-engine-v3.js   built inscription artifact (concat)
scripts/build-collection.mjs   builder + invariant verifier + manifest
scripts/build-contract.mjs     engine-pinned Proof of Free controller generator
manifests/collection-v3.json   1,024 hashes, bytes, mosaic map, roles
apps/mosaic/mosaic.html        prototype dashboard (needs the artifact path)
living-synth-v3-demo.html      self-contained single-file demo
```

## Run

```sh
node scripts/build-collection.mjs                         # engine candidate
node scripts/build-collection.mjs --engine-id 12345 --seeds
npm test
open living-synth-v3-demo.html               # play it
```

Builder invariants: rebuild determinism, no silent instrument, 1,024 unique
genome hashes, 1,024 unique trait tuples, 1,024 unique hues.

## Demo controls

Hover the mosaic to inspect a genome, click a tile to preview its genesis
loop (voice-capped), double-click to open the full chaos pad. Record captures
gestures as ticks; export/load round-trips the performance JSON with full
validation; "propose as default" appends a revision to the simulated
registry. "Play the mosaic" scans the logo column by column on the shared
transport.

## Launch

Use [DEPLOYMENT.md](DEPLOYMENT.md). The required order is engine inscription,
engine-pinned controller deployment, campaign initialization, seed
inscriptions and escrow, master inscription, then opening. The controller is
`proof-of-free-v1`; canonical Xtrata remains the NFT contract.
