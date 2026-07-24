# Living Synth v2 architecture

## Immutable artifact graph

The engine is inscribed first. Every seed is then sealed with the engine ID in
its Xtrata `dependencies` list:

```text
engine E (text/javascript)
  ├── dependency of seed edition 1 (text/html)
  ├── dependency of seed edition 2 (text/html)
  └── dependency of seed edition 1024 (text/html)

recording R (application/json)
  └── parent: seed NFT
```

Dependencies and parents are intentionally different. A seed depends on shared
executable content; a recording is an owner-authored descendant of one NFT.
The engine does not list 1,024 dependencies. Each of the 1,024 seeds lists the
single engine, staying within Xtrata's 50-dependency bound.

## Artifact protocol

The engine exposes an immutable `globalThis.ProofOfFree` API:

```text
protocol: proof-of-free/engine-api-v2
edition: number
engineId: number
gesture({ x, y, pressure, gate })
stop()
```

Each canonical seed contains one JSON payload:

```json
{
  "protocol": "proof-of-free/seed",
  "version": 2,
  "edition": 1,
  "engineId": 12345,
  "traits": {
    "profile": 422,
    "hue": 148.007813,
    "palette": "Aqua",
    "rootNote": "A2",
    "rootMidi": 45,
    "waveform": "triangle"
  }
}
```

and one script reference: `/i/12345`.

## Collision-free traits

Edition numbers are deterministically permuted across all 1,024 ten-bit values.
Those values decompose into 16 palettes, 16 root notes, and four waveforms, so
the full categorical trait tuple occurs exactly once. The 1,024 visual hue
values are unique as well. Traits are embedded in each seed, recomputed by the
engine and browser, and included in the canonical manifest. Building or
verifying a release fails if any full trait profile repeats.

The release manifest has no timestamp or machine-specific fields. Given the
same canonical engine and engine ID, a rebuild produces byte-identical seeds
and manifest.

## Registry trust boundary

The registry permanently locks one gateway and one engine. `set-engine` fails
after its first success, after registration starts, or while unpaused.

Single-edition registration verifies through the locked gateway:

- the inscription exists;
- it is sealed, non-empty `text/html`;
- it is no larger than 65,536 bytes;
- its dependencies contain the locked engine;
- and its Xtrata final hash is stored as the edition commitment.

Batch registration remains an operator-attested optimization because a Clarity
fold cannot safely carry the dynamic trait reference through each entry. It is
only available while paused, only after the engine is locked, and requires the
manifest content hash for every item. Deployment must audit each supplied NFT's
metadata, dependency, and hash before broadcasting a batch.

## Browser verification

Before an edition executes, the app independently downloads complete Xtrata
chunks and verifies:

1. Xtrata final SHA-256 for both engine and seed.
2. Engine hash equals the registry's permanently pinned hash.
3. Seed hash equals the registry's edition hash.
4. Seed Xtrata dependencies contain the engine ID.
5. Seed JSON declares the selected edition and locked engine.
6. Seed script source is the canonical `/i/<engine-id>` route.

The verified bytes are reconstructed in an iframe with scripts only. Network,
same-origin access, forms, media, frames, and navigation are denied. The
external script tag is replaced with the already hash-verified engine bytes.

## Recordings

Recording JSON continues to use `proof-of-free/living-recording` version 1.
The registry requires current ownership of both inscriptions, sealed bounded
JSON, and the collection NFT in the recording's immutable Xtrata parents list.
Every recognized recording stays in history; the newest becomes the default.
