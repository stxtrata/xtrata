# Cicada.btc Master Engine v11.3.5

One deterministic generative system for the full 3,301-piece collection. Every seed
produces a complete identity: artwork, animation, movement behaviour, fingerprinted
signature call, group chorus, traits, rarity score, metadata, and playback behaviour.
The same seed always recreates the same result — visually and acoustically.

**v11.3.5** is a hardening release on top of v11.3.4: dead-code removal, a
safer trait-gating fallback, PRNG deduplication, a DOM cleanup fix, and a
regenerated export bundle. Full-collection metadata output is byte-identical
to v11.3.4 (verified by CSV diff and `tools/verify-determinism.mjs`).

**Note on `rarityScore`:** rank and score are computed from the pre-policy
trait roll and frozen against v10.4.0. The visual rarity policy then rewrites
display traits, so the published `rarityScore` intentionally does not equal
the sum of the displayed `traitBreakdown` points. This preserves rank
stability across versions.

**v11.3.4** keeps the v11.3 photographic bark placement and gallery filters, then
refines the new live-gallery behaviours. Acoustic responses now queue instead of
resetting existing singers, so repeated clicks can build delayed call waves. Call cascades
can spread through related cicadas with rarity-capped wildfire-style delays. Flight
contagion is now source-linked: if a clicked cicada stays airborne, its triggered
followers stay airborne too and land when the source lands. Bark remains assigned
post-rank and never feeds the score or the sort. See `CHANGELOG-v11.3.md` (this release)
and `CHANGELOG-v11.md` (the v11.0.0 base).


## v11.3.4 Gallery interaction

- `src/gallery-listener.js` handles rarity-capped acoustic call-and-response with per-cicada queues.
- Repeated calls no longer stop existing singers; they queue another signature call and allow delayed cascades.
- `src/gallery-flight-network.js` handles rarity-capped visual flight contagion with source-linked followers.
- Triggered flyers remain airborne while the source remains airborne, then land when the source lands.
- Common launches remain capped to a tiny local startle; Mythic launches wake the whole visible gallery.

## Setup

This folder is ready to serve as-is: `src/cicada-renderer.js` and
`src/export-bundle-source.js` are already present. The bark photos live in
`assets/bark/` and are referenced by the renderer (`assets/bark/<slug>.jpg`).

If you ever regenerate the export bundle (after editing a runtime module), run:

```bash
node tools/build-export-bundle.mjs
```

`tools/scaffold-from-v10.mjs` remains available to re-copy the renderer from the
v10.4.0 sibling if needed.

## Run locally

```bash
python3 -m http.server 8092
# open http://localhost:8092
```

## Self check

Open `tests/self-check.html` (served, after scaffolding). It verifies, in the browser,
that all 3,301 seeds build, ranks form a clean 1..N permutation, `metadata.csv` has one
row per seed, signature-call renders are byte-identical on repeat (determinism), and the
audio fingerprint round-trips (the decoder recovers each seed with a valid checksum).

## What's new in v11 (summary)

- **Performance:** non-blocking chunked startup index with progress; off-screen gallery
  cells paused via IntersectionObserver; export bundle loaded lazily.
- **Accessibility:** keyboard + screen-reader access to the artwork (F/Enter/Space = fly,
  C = signature call); global `prefers-reduced-motion` support plus a Motion toggle;
  `aria-live` announcements; `:focus-visible` rings; skip link. The accessible core also
  ships inside every exported inscription.
- **UX:** Find a Piece (jump by rank or filter by tier + trait); deep-linkable, persisted
  seeds (`#seed=N`); always-visible touch Fly / Call controls; export size estimate.

## What v10 unified (preserved)

The Seed Builder (visual collection, traits, rarity, gallery, inscription export) and the
Solo Abdomen + Group Sound Lab (rhythm genome, extreme chirp genes, abdomen motion rig,
audio fingerprint encode/decode, group chorus) are one engine. Every seed carries a
complete deterministic identity — artwork, motion rig, fingerprinted signature call, group
chorus, and verifiable audio seed encoding — and head-click (or the **C** key) performs the
seed's signature call with the full abdomen motion rig. See `CHANGELOG-v11.md` for the
complete v9.5.x–v10.4 lineage, all of which remains accurate for the preserved systems.

## Inscription export

“Export Seed HTMLs + Module” still produces one shared module set plus 3,301 tiny seed
HTML files, fully self-contained for offline / on-chain use. In v11 the shared module set
(`export-bundle-source.js`) is a generated artifact (`tools/build-export-bundle.mjs`)
rather than a hand-maintained file, and it is loaded lazily in the builder. v11.3 adds an
optional self-contained export mode that base64-embeds the bark photos as a single shared
`bark-assets.js` module, removing any external `assets/bark/` dependency from the exported
inscriptions.
