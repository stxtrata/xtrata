# Proof of Free — Living Synth v4

A logo-driven rebuild of v3. The 1,024 tiles now assemble into the **Xtrata
logo** (black ground / grey head / blue field / orange core) as a *living*
animated mosaic, every synth is a **square Kaoss pad**, and each tile animates
a theme from the "proof of free / nothing / zero" vocabulary. Sound is higher
quality and far more varied, driven by the tile's position in the logo.

## What changed from v3

**Colour → the logo, not a rainbow.** An embedded 32×32 `LOGO_MASK` classifies
every tile into a family — `dark`, `white`, `blue`, `orange` — and each family
has its own deterministic palette ramp. The assembled mosaic reproduces the
Xtrata composition instead of a hue wheel. Regenerate the mask from a real PNG
any time with `node scripts/sample-logo.mjs logo.png` (zero-dependency PNG
sampler; paste its output over `LOGO_MASK`).

**Sound → an orchestration map.** Family assigns a musical **role** with its own
register, waveforms, envelope, filter and density:

| region | families | roles | character |
|--------|----------|-------|-----------|
| head / light | white | bell, lead | bright, high, shimmering, melodic |
| field | blue | pad, bass | deep, slow, sustained |
| core | orange | pulse, lead | aggressive, driven, rhythmic |
| ground | dark | drone, atmos | sparse, low, atmospheric |

All still share one framework (D dorian, 132 BPM, 96-PPQ tick transport), so
tiles combine as an ensemble. Genome now carries dual osc **+ sub**, an **LFO**
(cutoff/pitch/amp), tempo-synced delay, a **reverb** send, drive and stereo pan.

**Voice → higher fidelity.** Shared `AudioContext` with a convolver reverb bus
and a soft-clip master limiter; every voice has sub-oscillator, waveshaper
drive, resonant/band filter, LFO, feedback delay, panning and an analyser tap.

**Animation → high-resolution themes.** Each tile gets `glyph` (0 / ZERO /
PROOF / FREE / NOTHING / OPEN / BLOCK / CLAIM / SIGNAL / WITNESS / FOREVER / X),
`bars` (FFT spectrum), `scope` (oscilloscope), or `orbit`. Dormant tiles render
cheaply on one shared, ~30fps canvas via a pre-rendered glyph atlas — no audio
graphs until a tile is previewed or opened. The opened pad is **square** and
draws a live, audio-reactive version of its theme (the "0" breathes and spins
to the sound; spectrum/scope come from the real FFT).

## Layout

```
packages/genome/               logo mask + family palettes + roles + melody
packages/performance-codec/    xtrata-performance v1 (unchanged, still valid)
engine/engine-core.js          voice + square pad + animations + mosaic renderer
artifacts/proof-of-free-engine-v4.js   built inscription artifact (concat)
scripts/build-collection.mjs   builder + invariants + manifest
scripts/sample-logo.mjs        regenerate LOGO_MASK from a real PNG
manifests/collection-v4.json   1,024 hashes, families, roles, animations, mask
apps/mosaic/mosaic.html        dashboard (needs the built artifact path)
living-synth-v4-demo.html      self-contained single-file demo
```

## Run

```sh
node scripts/build-collection.mjs                 # verify + manifest
node scripts/build-collection.mjs --seeds --engine-id 12345   # emit 1,024 seeds
open living-synth-v4-demo.html                    # play it
node scripts/sample-logo.mjs path/to/xtrata.png   # optional: exact logo
```

Builder invariants: deterministic rebuild (byte-identical manifest), no silent
instrument, 1,024 unique genome hashes. Colours/roles intentionally repeat by
family — that repetition is what draws the logo.

Current distribution: families dark 335 · white 268 · blue 225 · orange 196;
animations glyph 541 · orbit 186 · scope 162 · bars 135.

## Demo controls

Hover a tile to inspect its genome; click to preview its genesis loop
(voice-capped at 6, oldest-stolen); double-click to open the square pad. Record
captures gestures as ticks; export/load round-trips the performance JSON with
full validation; "propose as default" appends a revision to the simulated
registry. "Play the mosaic" scans the logo column by column on the shared
transport.

## Note on the mask

The embedded `LOGO_MASK` is reconstructed from the reference render by region
geometry, so it matches the composition rather than being pixel-exact. Drop the
real Xtrata artwork through `sample-logo.mjs` for a 1:1 map — everything
downstream (colours, roles, mosaic) updates automatically and deterministically.

## Next

Phase 4–5: port the v2 Clarity default-performance registry to
`xtrata-performance`, keeping the v2 browser verification chain (engine hash,
seed hash, dependency, canonical `/i/<engine-id>` route).
