# Rune Pit cabinet notes (written by the cabinet agent)

Files: `src/cabinet.js` (builder code), `tools/build-cabinet.mjs` (runs it in headless Chromium with `vendor/three-subset.js` + `vendor/xlogo.js`; `--preview` writes `dist/cabinet-*.png`), `src/model.json` (packed model, about 1.7 MB; Ordinal Rush was 2.2 MB).
Rebuild: `node tools/build-cabinet.mjs [--preview] [--only=front,strike]`. No casino file is read any more; it needs no `PX_CASINO_HTML`.

## Export format
Same as Ordinal Rush: `{root, geometries, materials, textures}`, node = `{p, q, s, visible, role, action?, g?, m?, children}`. The loaders name a node `px-<role>`. Only the texture encoding differs: opaque textures are JPEG data URLs, transparent overlays are WebP data URLs (both load through `new Image()`; Safari 14+/any current Chromium/Firefox). Geometry precision is 4 decimals (positions) and 3 (normals/uv).

## Roles (userData.role, exported as `role`)
| role | node | notes |
| --- | --- | --- |
| `screenMesh` | plane 1.98 x 1.36 at (0, 2.95, 0.5215) | live canvas goes here (same size and place as Ordinal Rush) |
| `core` | Group at (0, 5.5, -0.05) | the topper: turning ring of dark stone, rune names carved round it, glowing from inside. The room turns it with `rotation.y` (it turns about Y; test page: use `core` where it used `crest`, same `rotation.y = base + t * speed`) |
| `spinPhysical` | cylinder cap of the big ETCH button (child of the deck group, local (0.8, -0.02, 0.19)) | the room presses it along local z |
| `lever` | Group (pivot) at (1.34, 1.3, -0.1) | iron forge hammer. **Rest pose is `rotation.x = 0.28`** (baked in the node quaternion; the room and test page read `rotation.x` as the base and add `sin(u*PI) * 1.02` during the 900 ms pull, so the hammer lifts back to rest after the strike). Click target for the test page (`children[1]`) is the hammer head. |
| `anvil` | one Mesh (extruded anvil profile) at (1.34, 1.2725, 0.7575) | stands on a basalt block beside the machine's right foot; its local origin is the centre of the anvil face = the strike point |
| `sparkAnchor` | empty Group, child of `anvil`, at local (0, 0.012, 0) | **spawn sparks here** (world position = anvil face centre) |

Deck buttons carry `action` on base, cap and face meshes: `pays` (LEDGER), `betDown` (-SATS), `betUp` (+SATS), `auto` (AUTO-MINT), and `spin` on the big ETCH button (ring, rim, cap, label) and on every part of the hammer. Small action captions (PAYS / BET - / BET + / AUTO / SPIN) are printed under the buttons.

## Sparks (for the test page / room)
At the end of the pull the hammer face lands on the anvil face. The pull is `sin(u*PI) * 1.02` over 900 ms, so the **strike is at u = 0.5, about 450 ms after `mechanics().lever` appears**. Spawn the shower then:
- origin: world position of `px-sparkAnchor` (`model.getObjectByName('px-sparkAnchor').getWorldPosition(v)`),
- 25-40 small additive points, colours `#ffd27a`, `#ff8a3d`, `#ff5a1a`, velocity up and outward (mostly +y, spread in x/z, a bit of +z towards the player), gravity, life 0.5-0.9 s, fading and shrinking; optionally a 120 ms warm point light at the anchor and a brief brightening of the lava rods (they are plain basic materials).
- The hammer swings in the plane x = 1.34, face travelling down and forward; the anvil horn points toward +z (the player).
Other parts you may want to flash: the lava lip of the `core` ring (inner torus + inner wall are basic materials), the lava rods in the corners, the ticker digits.

## Look (what is in the model)
- Body: black basalt (tileable canvas texture with pits, grain and hairline fissures) plus transparent lava-crack overlays (glow halo, dark rim, lava, hot core) on the lower front/back, upper back, marquee sides. Flanks of both body sections are rows of hexagonal basalt columns with a lava slit behind each joint.
- Corners: iron bands wrapped round a lava rod at every vertical corner (lava shows between the bands), rivets, iron rails with a lava line under them, a molten rim round the plinth foot, a few broken basalt columns at the left foot.
- Screen in a stepped stone tablet (three slabs, carved rune border on the top edge, glowing inner edge, iron corner clamps), "GENESIS BLOCK 840000" plate above.
- Marquee: molten "RUNE PIT" (accent #d64545 / ember #ff8a3d) with ember bulbs; tiny "PARALLAX CASINO" at the foot (far smaller than the name).
- Topper ring: radius 0.68, height 0.7, two rows of carved names glowing orange: UNCOMMON.GOODS, DECENTRALIZED, MEME.ECONOMICS, DOG.GO.TO.THE.MOON / Z.Z.Z.Z.Z.FEHU.Z.Z.Z.Z.Z, RSIC.GENESIS.RUNE, SATOSHI.NAKAMOTO, with hand-drawn rune glyphs between them; open top and bottom with a molten core and glowing lips.
- Lower door: stone plate, iron frame, "RUNES · SINCE BLOCK 840,000", the Xtrata mark drawn with `xtrataLogo()` from `vendor/xlogo.js` (no image), small line "ETCHED ON BITCOIN · APRIL 2024 · PARALLAX CASINO". Souvenir ticket slot (iron housing, glowing lip, TICKET label) at (-0.62, 1.66, 0.59).
- Deck labels: LEDGER, -SATS, +SATS, AUTO-MINT, ETCH.

## For the game agent
- Existing `tools/test-page.cjs` and `index.html` still look for the role `crest`; Rune Pit's topper is `core`. In `index.html` use `part('core')` (rotation.y), and in `test-page.cjs` expect `core` instead of `crest`. The rest of the contract is unchanged. I did not edit those files.
- Idle drawing: nothing here is animated; the ring only turns because the host rotates `core`.
- Bounds: about 3.1 wide (x -1.52 to 1.59, includes the anvil block and left rubble), 5.92 tall, z -0.79 to 1.32 (the anvil/horn). The room scales by height, so the body is the same 2.6 m proportions as Ordinal Rush.
