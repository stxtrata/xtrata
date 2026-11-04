# Degen City cabinet notes (written by the cabinet agent)

Files: `src/cabinet.js` (builder), `tools/build-cabinet-node.mjs` (builds `src/model.json` in plain Node: `vendor/three-subset.js` + `vendor/xlogo.js` + `@napi-rs/canvas`),
`tools/check-cabinet.mjs` (structural check, exits 1 on a missing role/action, NaN, blank texture, mirrored coin face, model over 2.5 MB; `--dump-textures` writes the textures to `dist/test/cabinet-textures/`),
`tools/preview-cabinet.mjs` (z-buffered software preview PNGs of the packed model into `dist/test/cabinet-previews/`, no browser), `src/model.json` (about 2.0 MB).
Rebuild: `npm i @napi-rs/canvas` in `~/chromebox` (or set `CANVAS_DIR`), then `node tools/build-cabinet-node.mjs && node tools/check-cabinet.mjs`.
`tools/build-cabinet.mjs` (browser path) is the old Rare Pepe one and is not used. Fonts are DejaVu Sans / Sans Condensed (baked into textures, so the player's fonts do not matter).

## Export format
Same as the siblings: `{root, geometries, materials, textures}`, node `{p, q, s, visible, role, action?, g?, m?, children}`; loaders name a node `px-<role>`. Opaque textures are JPEG, transparent overlays WebP. Geometry precision 4 decimals (positions) / 3 (normals, uv). Overall size 2.87 x 6.03 x 1.66, x -1.33..1.54 (lever side), y 0.015..6.045, z -0.73..0.93 (deck). `index.html` scales by height to 2.6 m, as for the siblings.

## Roles (userData.role, exported as `role`)
| role | node | notes |
| --- | --- | --- |
| `screenMesh` | plane 1.98 x 1.36 at (0, 2.95, 0.5215), direct child of the root | live canvas goes here |
| `crest` | Group at (0, 5.5, -0.05) | the two-sided coin. Turns about Y (`rotation.y = base + t * speed` works unchanged). See "Coin" below |
| `spinPhysical` | cylinder cap of the DRIVE button, child of the deck group at local (0, 0.03, 0.19) | the room presses it by setting `position.z` (rest 0.19, same as the siblings) |
| `lever` | Group (pivot) at (1.36, 2.45, 0.08) | chrome arm, grip fading orange (bottom) to blue (top). **Rest pose `rotation.x = -0.10`** (baked in the node quaternion; leans back slightly). Test page / room: `rotation.x = base + sin(u*PI) * angle`, the arm swings toward the player (+z). Children: `[0]` shaft, `[1]` grip (click target for `test-page.cjs`, world (1.36, 3.14, 0.01) at rest), then end rings, knob (chrome ball, top at y about 3.54), boot, pivot ball. All carry `action: spin` |

The deck is an unnamed Group at (0, 1.92, 0.66), `rotation.x = -0.72`.

Deck buttons carry `action` on base, cap/top and face meshes (3 each): `pays` RATES (local x -0.95), `betDown` -STAKE (-0.57), `betUp` +STAKE (0.57), `auto` AUTO-PILOT (0.95). `spin` is on DRIVE (centre, local x 0): ring, neon half-rings, cap (`spinPhysical`) and cap label, and on every part of the lever. Captions under the buttons: PAYS / BET - (minus sign) / SPIN / BET + / AUTO. The -STAKE label uses U+2212.

## Coin (`crest`)
- A thin disc, axis along z (radius 0.47 faces, chrome rim to 0.54, thickness about 0.085, chrome reeded edge, small stand and cup on the marquee roof). Spinning `crest.rotation.y` spins it like a coin on edge.
- **`rotation.y = 0` (mod 2*PI): the +z face toward the player = MIAMI sunset** (palms, sea, striped sun, "MIAMI" arc).
- **`rotation.y = PI` (mod 2*PI): the -z face toward the player = NEW YORK night skyline** (towers with lit windows, moon, water, "NEW YORK" arc). Both faces read upright and un-mirrored from the front of their side (checked by sampling the packed textures in `check-cabinet.mjs`).
- To ease to the leading city, ease `rotation.y` to `2*PI*k` (Miami) or `2*PI*k + PI` (NYC). Faces are basic (unlit) materials so they stay readable from both sides.

## Marquee and leaderboard bar
- Marquee texture plane 2.3 x 0.59 at (0, 4.43, 0.495). DEGEN (warm orange neon) on the left half, CITY (blue neon) on the right. There is no seam strip in front of the marquee screen. A tiny "PARALLAX CASINO" sits at the foot (about 1/11 of the lettering height).
- **Leaderboard bar (static texture)**: world rectangle x -1.00..1.00, y 4.230..4.355, on the marquee plane (z 0.495). Left half (x < 0) Miami orange, right half (x > 0) NYC blue, chrome centre pip/start line at x = 0, chequered finish blocks at both ends (x about +-0.98), tick marks every 0.04 m (long every 5th, 24 per half), labels MIAMI (left, x about -0.88) and NEW YORK (right). Intended reading: each city's lead pushes toward its own end; the live race is drawn on the game screen.
- Chasing bulbs: static spheres round the marquee frame in a 3-step lit / mid / dim pattern per half (warm on the left, cool on the right), mirrored so the chase runs outward from the seam. Nothing is animated here.

## Split rule
Everything that has colour is cut at x = 0: lacquer body, trim, bezel frame (left half orange, right half blue), deck, door plate, marquee, plinth, neon strips. A chrome seam runs down the lower body, door medallion, deck and the back; nothing is placed in front of the marquee or the main screen. `check-cabinet.mjs` confirms all 146 orange/blue meshes sit on their own side. Seen from behind the halves are naturally swapped (NYC on the viewer's left); the rear label, service panel and marquee back are drawn that way so text colours match the body.

## Look
- Lower door: plate "MIAMI DEGENS · NYC DEGENS" / "FOREVER ON STACKS", chrome medallion with the Xtrata mark drawn with `xtrataLogo()` (no image, not recoloured, on a dark disc), souvenir ticket slot (chrome housing, orange lip, TICKET label) at (-0.62, 1.66, 0.59).
- Flanks: left Miami street (orange neon strips, art-deco stripes in cream/pink/teal, palm-frond cut-outs against a sunset glow, striped sun), right NYC (blue neon, brick courses, lit window grid, fire-escape lines). Original shapes only; no brand logos or text. Marquee sides carry matching neon strips.
- Nothing suggests a win is due: no text or art about "next", "due", "hot" or streaks.

## For the game / test page
- `index.html` and `tools/test-page.cjs` already use `crest` and the other roles: no change needed.
- The cabinet leaves `screenMesh` the only thing the game draws on. The idle screen baked into the model is a placeholder (DEGEN | CITY split, "DRIVE TO START"); the game replaces its map.
- Left-over files from the Rare Pepe scaffold that are not mine and were not touched: `tools/build-cabinet.mjs`, `tools/test-page.cjs`, `index.html`.
