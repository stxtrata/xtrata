# Door skin recipe: `door-skin-recipe/1`

A **skin** is a door's finish: leaf material, frame, hardware, sound and wear. The door **shape** stays a world door look; the finish is chosen with the built-in overlay look `door-skin`:

```json
{ "skin": "oak", "frame": "brass", "hardware": "chrome", "tint": "#2060ff", "wear": 40 }
```

All fields are optional. `frame`/`hardware` empty = the skin's own; `wear` 0..100, absent = the skin's own. Unknown skin keys fall back to `neon`.

## Where skins live (`xtrata-door-skins-v1`)

| Tier | What | Who can add it |
|---|---|---|
| 0 built-in | code in the hall release (`src/parts/door-skins.js`); the contract holds only its metadata | admin only (`ops/skins.mjs`) |
| 1 data recipe | a sealed inscription (<= 8192 bytes) holding the JSON below | publishers (review lane on by default: hidden until `approve-skin`) |

The contract verifies the inscription against core (sealed, hash, size, creator). The hall re-validates and clamps every recipe, so a hostile recipe can only ever produce a texture. Registration is append-only; keys are unique, `[a-z0-9-]{2,24}`.

## Recipe

```json
{ "format": "door-skin-recipe/1", "base": "#8a5a2b", "rough": 0.55, "metal": 0, "opacity": 1,
  "layers": [ { "op": "grain", "scale": 18 } ],
  "wear": { "mode": "scuff", "color": "#5a3a1a" },
  "emissive": { "color": "#3be6ff", "intensity": 0.8 },
  "pane": { "base": "#ffffff", "layers": [ { "op": "cells" } ] } }
```

- `base` hex colour; `rough`/`metal` 0..1; `opacity` 0.3..1.
- `layers`: at most **8**, applied in order. Unknown ops and unknown params are ignored (with a warning); every value is clamped into the ranges below.
- `wear.mode`: `none`, `scuff`, `chip`, `rust`.
- `pane`: a second recipe painted inside the door's panel fields (glass). Panes do not nest.
- Output: albedo, opacity, roughness, metal, height, groove and a normal map, up to 512x512, deterministic for a given recipe + seed. No code, no network, no external images.

## Layer ops (name: param range, default)

- `grain`: color2, scale 2-80 (18), stretch 1-80 (24), contrast 0-1 (0.6), warp 0-1 (0.5), knots 0-5 (0)
- `planks`: count 1-8 (3), seam 0-1 (0.6), vary 0-0.4 (0.1)
- `brush`: dir h|v, freq 40-900 (300), amount 0-1 (0.5)
- `speckle`: amount 0-1 (0.1), scale 20-600 (220)
- `blotch`: color, amount 0-1, scale 0.5-14, th 0-1, soft 0.01-0.5, h -1..1, r -1..1, bias -1..1
- `plates`: rows 1-8, cols 1-4, seam 0-1, rivets 0|1, vary 0-0.4
- `stripes`: color, color2, width 0.02-0.3, angle 0-90
- `cells`: palette (<= 8 hex colours), count 4-64, lead 0.002-0.03, leadColor, opacity 0.3-1 (stained glass)
- `frost`: amount 0-1, scale 20-400, opacity 0.3-1
- `scratches`: count 0-80, len 0.02-0.4, color, amount 0-1
- `blocks`: rows 2-12, cols 1-6, mortar 0-1, vary 0-0.4, color

(`SPEC` in `door-skins.js` is the source of truth.)

## Door styles a skin may dress

`styles` is a bit mask in this fixed order: rect0 tall1 wide2 arch3 gothic4 double5 cathedral6 circle7 oval8 hexagon9 octagon10 industrial11 vintage12 scifi13. Admin can change it later with `set-skin-styles`.

## What a skin controls in the hall

- **Leaf**: the recipe, lit (albedo, roughness, metal, normal from the door style's own panel lines). `pane` areas glow softly, so stained glass reads as lit from behind.
- **Frame**: the frame finish paints the band round the opening and a threshold sill.
- **Hardware**: lever, rose, hinge straps and latch bolt are small lit metal parts in the hardware finish.
- **Sound**: the skin's sound (wood, metal, tech, glass) replaces the door style's, whatever the shape. Glass adds a chime on knocks and a shimmer on rattles.
- **Wear**: scuffs and chips, or rust and verdigris that bloom from edges, seams and the foot of the door. 0 = clean.
- **Lamp**: the bay's lamp lights the door like anything else in the hall.
- Low-end devices (2 cores or fewer, or `window.XA_LOWFX`) render the maps at 256 px instead of 512.

## Frames and hardware

Frames: `none, wood, painted, stone, steel, brass, iron`. Hardware: `brass, chrome, bronze, black-iron`. These are hall-side tables; adding one is a hall release.

## Built-in skins (19)

oak, walnut, pine, ebony, white, racing-green, oxblood, navy, mustard, brushed-steel, brass, verdigris, iron, hazard, frosted, stained, stone-oak, composite, neon.

## Tools

- `node build/door-skins-sheet.cjs --out DIR [--skins a,b] [--styles rect,arch,gothic] [--maps]`: renders preview sheets (software-lit; not the in-hall look).
- `node ../../contracts/arcade-world/ops/skins.mjs ...`: registers the built-ins (dry run by default).
