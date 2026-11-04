# Hot Wallet cabinet (`src/cabinet.js` -> `src/model.json`)

A walnut-and-brass museum display case for the heist timeline: dark walnut with procedural grain, brass corner posts and plates,
chrome fittings, a crimson-lit glass display frame round the screen, year-roll strips down each side of the head, sealed
evidence-bag cases on the head flanks, and a topper that is a brass-and-chrome vault wheel. Accent `#e11d48`.
Same packed format as the other cabinets (`{root, geometries, materials, textures}`, node = `{p,q,s,visible,role,action?,g?,m?,children}`),
about 3.07 m wide x 6.10 m tall x 1.73 m deep in model units (the room scales the whole model to 2.6 m tall).
Nothing here copies another project's art or logo; the Xtrata mark on the lower door is drawn by `xtrataLogo()` from `vendor/xlogo.js`,
unmodified. The evidence bags carry the companies' own logos (supplied by Jim, `art/logos/`); the old drawn generic icons (key, coin, padlock, chip,
USB stick) and year labels only.

## Build

| Command | What it does |
| --- | --- |
| `node tools/build-cabinet.mjs [--preview] [--only=front,left,...]` | Builds `src/model.json` from `src/cabinet.js` in headless Chromium (about 20 s). `--preview` photographs the model into `dist/cabinet-*.png`. `--use-model` photographs the existing `src/model.json` without rebuilding. |
| shots | `front threequarter deck-lever strike topper screen door rear dim left evidence beacons-lit lever-side` (`strike` = lever at the end of the pull, `beacons-lit` = both beacons in the lit colour). |
| `tools/build-cabinet-node.mjs` | **Unmaintained.** Copied from Mempool Madness; it still reads `art/snapshot.js` (which Hot Wallet does not have) and needs `@napi-rs/canvas`, which is not installed. Use the Chromium build above. |

`src/cabinet.js` has no data dependency: nothing is read from a snapshot and nothing is invented.

## Roles

| Role | Node | What it is / how the room uses it |
| --- | --- | --- |
| `screenMesh` | plane 1.98 x 1.36 at (0, 2.95, 0.5215) | The screen. The host replaces its map with the game canvas. Ships with a placeholder "THE HEIST MUSEUM 2011 TO 2026" still. |
| `screenGlow` | thin rounded-rect ring at (0, 2.95, 0.5305), `MeshBasicMaterial` `#e11d48`, transparent, opacity 0.9, no depth write | The crimson neon line round the glass. Pulse its `material.opacity` or `color`. |
| `crest` | Group at (0, 5.6, -0.05) | The topper. The room turns it about Y (`rotation.y = base + t * speed`) like the other toppers; the studio page swivels it gently instead so it faces the player. Children: stem, flange and `crestWheel`. |
| `crestWheel` | Group at the crest origin, child of `crest` | The vault wheel: rim torus (r .36, tube .04), crimson inner ring, web disc, hub with a dial plane on **both faces** (so it reads from either side), 12 brass bolts, 5 chrome spokes with brass ball handles. Faces +z. Turn it about its own local z (`rotation.z`). Because it is double-sided, the room's continuous Y rotation also works. |
| `beaconL`, `beaconR` | sphere lenses at (-/+1.36, 4.9, 0.3), machine group | Red beacons on the head corners. Each has its **own** `MeshBasicMaterial`, exported dim `#6b1022`; lit colour `#ff2a4a`. Pulse or alternate-flash with `material.color`. |
| `spinPhysical` | cap of the big round TIME TRAVEL button, deck-local (0.8, -0.02, 0.19), action `spin` | The room presses it along its local z (`mechanics().spinZ`). Crimson domed top (child, action `spin`). |
| `lever` | Group, pivot (1.34, 1.3, -0.1) on the right flank, **exported with `rotation.x = 0.28`** | The TIME LEVER. The room adds `sin(u*PI) * 1.02` over 900 ms from the rest rotation read at load; do not reset it to 0. Peak is 1.30 rad. `children[0]` = chrome shaft, **`children[1]` = the T-grip (the click target)**, then caps, ridges, hub, collars and tail; every lever mesh has action `spin`. A fan-shaped walnut housing with a brass year scale, a vault-door boss and a brass pilaster (TIME LEVER / PULL TO TRAVEL plate and a READY lamp) stay fixed. |
| deck actions | meshes on the `deck` Group (deck at (0, 1.92, 0.66), `rotation.x = -0.72`) | base, cap and face of each key carry the action: `pays` = GUIDE (x -0.86), `betDown` = -YEARS (-0.48), `betUp` = +YEARS (-0.13), `auto` = AUTO-TOUR (0.24), `spin` = the round TIME TRAVEL button (0.8). A caption strip under the keys reads PAYS / BET - / BET + / AUTO / SPIN. |

## Parts that are plain meshes (no role)

| Part | Where | Notes |
| --- | --- | --- |
| Marquee | box at the top of the head | HOT WALLET in crimson neon (largest text on the machine), THE HEIST MUSEUM beneath, PARALLAX CASINO tiny at the foot, warm bulb dots round the trim. Same sign on the back. |
| Display case | frame round the screen | Brass-and-walnut frame with a crimson glow ring; a brass plaque "THE HEIST MUSEUM · 2011 to 2026" sits above the screen between two sconces. |
| Year strips | both head sides, left 2011-2018, right 2019-2026 | Engraved year rolls with pin markers. |
| Evidence cases | both head flanks | 16 sealed evidence bags (8 per side), one for each of the 16 timeline rows in date order (left 2011-2019, right 2019-2026), each with its year and the company's own logo on a plate of the logo's own colour. `tools/build-cabinet.mjs` loads the logos and rows before building; without them it falls back to generic icons. |
| Flanks | left lower: security console (lamps, toggles, 2 gauges); left neck and right neck: lamp columns; back of head: plate | Engraved zone tags. |
| Lower door | plane at (0, 0.93, 0.572) | Steel hatch, the Xtrata mark (`xtrataLogo`, 210 px), brass plate `NOT YOUR KEYS, / NOT YOUR COINS`, door frame, exhibit lamps, footer `EXHIBIT HALL · NO FLASH PHOTOGRAPHY`. |
| Ticket slot | housing at (-0.62, 1.66, 0.59) | Dark slot with a glowing accent lip and a TICKET plate under it. |
| Rear | back panels with louvres, brass data plates `HOT WALLET · HM-001` | Seen only from behind. |

## Studio hooks (in `index.html`)

`window.HW_STUDIO` = `{ flashBeacons(on), openVault(ms), strikes(), vaults(), beaconsFlashing() }`. `window.HWTest` exposes
`{ strikes, vaults, hasCrest, hasWheel, beacons, studio, api, RP, frame, setView, enterFs, exitFs, model, camera, renderer }` for the
Playwright test. The page picks up the pack from `window.HW_PACK || window.MM_PACK` and the game API from
`frame.contentWindow.HotWallet || frame.contentWindow.MempoolMadness`.

## Size

About 2.12 MB of JSON (2115 KB): 30 textures (JPEG for opaque ones, WebP for transparent ones), 134 geometries, 64 materials.
Bounding box [3.07, 6.097, 1.728]. Idle: nothing in the model animates itself; all motion (wheel turn, swivel, beacon pulse,
vault-open spin) is driven by the studio page.
