# Proof of Free — Living Synth v6

The recursive collection release. **One inscribed engine, 33 seed wrappers, and an
open tail** — every edition is a ~370-byte HTML file that iframes the same engine
with a fragment selector. Nothing else is inscribed per edition.

This is a different lineage from [Living Synth v5](../Living-Synth-v5), which is the
1,024-tile playable mosaic. v6 shares v5's module layout, not its engine.

## The artwork

Every edition draws **one aperture curve at different depths**. There is no separate
renderer per family — family only weights the layers of that single system:

| layer | what it is | Thresholds | Signals | Names |
|---|---|---|---|---|
| depth | receding copies of the aperture | 17 rigid | 13 soft | 9 wide |
| blades | iris that never fully closes | — | full | partial |
| flow | light released *through* the aperture | 0.60 | 1.00 | 0.72 |
| ring | the zero / front frame | 1.00 | 0.86 | 1.10 |
| mark | base-36 edition glyph + corona | — | — | yes |

Motion runs **charge → open → release → seal**. Tap or click fires a seal flash and a
two-oscillator tone pitched from the edition's `baseHz`. Thresholds additionally take an
architectural portal shape (ellipse, arch, hex, gateway, diamond, …) that the whole
tunnel inherits, so the recession reads as a doorway rather than concentric rings.

Editions 1–33 are fixed by the `V` motion table. Edition 34 onward is derived
deterministically from `hash32("pof-" + n)`, so the same edition always renders the same
artwork. `?seed=…` overrides the label for one-off commissions.

Opening the engine with **no selector** shows the cover: the engine running behind a
canvas wordmark that morphs `PoF` → `Proof of Free`, with the `o` landing on the
aperture's vanishing point.

## Selectors

```
/i/<engine>            cover
/i/<engine>#1          edition 1
/i/<engine>?n=333      edition 333
/i/<engine>?n=34&seed=my-seed
/i/<engine>#first-light        by slug
/i/<engine>#337919             by published seed value (1-33 only)
```

## Build

```bash
node scripts/build-collection.mjs                                   # placeholder URL
node scripts/build-collection.mjs https://xtrata.xyz/i/2839 --engine-id 2839
node scripts/build-collection.mjs /i/2839 --engine-id 2839          # root-relative
```

Regenerates `wrappers/`, `apps/gallery/index.html` and `manifests/collection-v6.json`.

Before writing anything it **extracts `TITLES`, `SLUGS`, `PALETTES`, `V` and `PORTALS`
back out of the engine artifact and deep-compares them against the genome**, and exits
non-zero on mismatch. The engine has to embed those tables to be self-contained once
inscribed, so this is the only thing stopping the two copies drifting apart.

Root-relative (`/i/N`) works because the runtime injects `<base href="null">`, which
resolves against the serving origin. A bare relative path does **not** work.

## Modules

```
packages/collection-genome/genome.js   tables + metaFor(n); builder's source of truth
artifacts/                             the engine — this is what gets inscribed
wrappers/                              33 seed files, generated
apps/gallery/index.html                local viewer for all 33, generated
apps/wrapper-generator/index.html      browser ZIP generator for editions 34+
scripts/build-collection.mjs           builder + drift verifier
manifests/collection-v6.json           engine hashes, per-edition traits, trait counts
docs/inscription-runbook.md            hashes, lineage, wallet constraint, tx order
```

## Lineage

The engine is inscribed as a **child of `2838`** (the previous engine) via
`parents: [u2838]` on `xtrata-v3-2-3`. `dependencies` stays empty — v6 never fetches
2838 at runtime, and claiming a content dependency it does not have would be false.

`parents` is ownership-checked: the seal must come from the wallet that owns 2838. See
[docs/inscription-runbook.md](docs/inscription-runbook.md) for the address and the
transaction order.

## Provenance

v6 fixes three defects carried by the inscribed 2838 engine, all reproduced before
being fixed:

1. The render RNG was fed a **string** seed for every edition ≥ 34, returning `0`
   forever — the particle field collapsed to a single stacked point and
   `ctx.rotate(NaN)` silently dropped the glyph rotation. Two-thirds of the open tail
   would have shipped visibly degenerate and permanent.
2. The seed-value selector alias was unbounded, so genuine editions `330000 + 7919k`
   aliased onto editions 1–33.
3. Wrapper padding disagreed with engine display for editions 34–99.

Editions 1–33 were never affected by any of them.
