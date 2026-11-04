# Mempool Madness cabinet (`src/cabinet.js` -> `src/model.json`)

A 1970s mission-control console for Bitcoin's mempool: brushed grey steel, rows of status lamps and toggle switches,
hazard-stripe trim, a green-phosphor radar screen, a txid ticker down each side of the screen section and a topper that is a
slowly turning column of translucent fee-coloured blocks. Accent `#14f195`. Same packed format as the other cabinets
(`{root, geometries, materials, textures}`, node = `{p,q,s,visible,role,action?,g?,m?,children}`), about 3.12 m wide x 5.98 m tall
x 1.73 m deep in model units (the room scales the whole model to 2.6 m tall). Nothing here copies another project's art or logo;
the Xtrata mark on the lower door is drawn by `xtrataLogo()` from `vendor/xlogo.js`, unmodified.

## Build

| Command | What it does |
| --- | --- |
| `CANVAS_DIR=/home/claude/cv node tools/build-cabinet-node.mjs` | The canonical build: THREE subset + XLOGO + `art/snapshot.js` in a Node `vm`, textures drawn with `@napi-rs/canvas`. Writes `src/model.json`. |
| `node tools/build-cabinet.mjs [--preview] [--only=front,left,...]` | The same `src/cabinet.js` in headless Chromium (same geometry, nodes and materials; only the pixels of the textures differ slightly). `--preview` photographs the model into `dist/cabinet-*.png`. `--use-model` photographs the existing `src/model.json` (e.g. the Node one) without rebuilding. |
| shots | `front threequarter deck-lever strike topper screen door rear dim left ticker cover-closed lever-side` (`strike` = lever at the end of the pull, `cover-closed` = safety cover shut). |

`src/cabinet.js` reads `window.MM_SNAPSHOT` (loaded from `art/snapshot.js` by both build tools) and draws only
`pending[]` values (txid, feeRate, vsize) on the tickers. It throws if the snapshot is missing; nothing is invented.

## Roles

| Role | Node | What it is / how the room uses it |
| --- | --- | --- |
| `screenMesh` | plane 1.98 x 1.36 at (0, 2.95, 0.5215) | The screen. The host replaces its map with the game canvas. Ships with a placeholder radar still. |
| `radarGlow` | thin rounded-rect ring at (0, 2.95, 0.5305), `MeshBasicMaterial` `#14f195`, transparent, opacity 0.95, no depth write | The neon line round the glass. Pulse its `material.opacity` or `color`. |
| `core` | Group at (0, 5.53, -0.05) | The topper. The room turns it about Y (`rotation.y = base + t * speed`). Children: a chrome spine and `coreBlock0..9`. |
| `coreBlock0` .. `coreBlock9` | 10 translucent slabs, bottom (cool, blue) to top (hot, red), children of `core` | Each is a `Mesh` with its **own** `MeshBasicMaterial` (colour = fee colour, a shared soft-glow alpha map, opacity 0.66, double sided, no depth write). Recolour with `material.color`, pulse with `material.opacity`. Each has one child mesh: a white edge outline (shared material, not recoloured). Colours bottom to top: `#3b6bff #1fa2ff #19d8e0 #14f195 #8be83a #e6e630 #ffb62e #ff7a1f #ff4a2a #ff1f4b` (roughly 0.1 to 50 sat/vB on a log scale). Slabs are offset and yawed a few degrees so the stack reads as a chain while it turns. |
| `spinPhysical` | cap of the big round button, deck-local (0.8, -0.02, 0.19), action `spin` | The room presses it along its local z (`mechanics().spinZ`). Domed green top (child, action `spin`) labelled BROADCAST / SPIN. |
| `lever` | Group, pivot (1.34, 1.3, -0.1) on the right flank, **exported with `rotation.x = 0.28`** | Red launch-control lever. The room adds `sin(u*PI) * 1.02` over 900 ms from the rest rotation read at load; do not reset it to 0. Peak is 1.30 rad (shaft nearly horizontal, pointing at the player). `children[0]` = shaft, **`children[1]` = the red ball grip (the click target)**, then hub, bolt, collars and a counter-weight; every lever mesh has action `spin`. |
| `safetyCover` | Group hinged at its top/back edge, hinge axis x at (1.34, 2.36, -0.07) | Translucent red hood (hazard-stripe rails, chrome hinge pin) that closes over the lever grip. **Exported OPEN: `rotation.x = -0.9` rad** (front edge lifted, tilted up and back, clear of the grip; its top then reaches y 2.663, about 0.03 m under the head trim, so do not open it further). Closed is `rotation.x = 0`. The host may animate it from 0 (closed) to -0.9 (open); lifting it is the "arm" step before a pull. It has no `action`. |
| `sparkAnchor` | empty Group at (1.30, 1.4605, 0.478), machine-local | End of the lever travel on the fan-shaped scale plate, where a green launch-pad lamp sits (the lever shaft lies over it at the peak, u = 0.5, about 450 ms into the pull). Spawn the puff of green sparks (`#14f195`, `#b8ffe4`, `#38ff98`) here: world position = `px-sparkAnchor` world matrix. Velocity mostly +z and +y, plus a little +x. |
| `tickerL`, `tickerR` | planes 0.29 x 1.14 at (-/+1.32, 3.39, 0.4885) | Dark phosphor strips with real pending txids (`a1b2c3d4…f0e1`), `feeRate sat/vB` and `vsize`, coloured cool to hot by fee rate. Texture 256 x 2048, **wrapS/wrapT = RepeatWrapping, repeat (1, 0.5), offset.y 0.5 (L) / 0 (R)**, so half the strip is visible: scroll with `material.map.offset.y`. Each ticker has its own texture and a different row order. Content is `art/snapshot.js` `pending[]` (34 rows), ordered hot/cool alternately so the colours mix; the rows loop seamlessly. |
| deck actions | meshes on the `deck` Group (deck at (0, 1.92, 0.66), `rotation.x = -0.72`) | base, cap and face of each key carry the action: `pays` = FEES (x -0.86), `betDown` = -FEE (-0.48), `betUp` = +FEE (-0.13), `auto` = AUTO-BUMP (0.24), `spin` = the round BROADCAST button (0.8; ring, glow rim, cap, dome). A caption strip under the keys reads PAYS / BET - / BET + / AUTO / SPIN. |

## Parts that are plain meshes (no role)

| Part | Where | Notes |
| --- | --- | --- |
| Marquee | box at y 4.42, sign plane 2.94 x 0.60 at z 0.4925 (and the same sign on the back) | MEMPOOL MADNESS is the largest text on the machine: glowing accent lettering, 60 bulb dots round the trim, four fee-coloured block icons each side; PARALLAX CASINO tiny at the foot. |
| Radar bezel | slab 2.26 x 1.72 round the screen | Heavy dark bezel with an etched graticule (tick scale, 000/090/180/270 bearings, range-ring arcs, crosshair notches), a rounded glass-lip frame in front of the glass, soft green halo, fee readout plate along the bottom (`FEE 1 5 20 50 sat/vB`, static; the host draws live numbers on the screen canvas). |
| Wings | head is 2.98 wide above y 2.72, neck 2.3 wide below | The tickers sit in steel frames with hazard-stripe feet. The head overhangs the right flank, so the lever sweep and the cover stay below y 2.65. |
| Flanks | left lower: relay rack (32 lamps, 16 toggles, 2 gauges); left neck: peer lamps and toggles; both head sides: MEMPOOL MONITOR board (vents, 40 lamps, 8 toggles); right neck: lamp column | Engraved tags: RELAY 01-32, FEE ESTIMATOR, ORPHAN POOL, ARM / HOLD, TX IN / TX OUT / RBF / ORPHAN. |
| Lever housing | fan-shaped steel plate on the right flank (x 1.15 to 1.27) with a fee-coloured travel scale (ARM to LAUNCH), a tower behind it with a LAUNCH stencil plate, an ARMED lamp and the cover hinge | Nothing but the lever and the cover moves. |
| Lower door | plane 1.72 x 0.96 at (0, 0.93, 0.572) | Steel hatch, the Xtrata mark (`xtrataLogo`, 218 px, undistorted), stencil text `EVERYONE WAITS` / `FOR THE NEXT BLOCK`, door frame and hinges, lamp column left, toggle column right. |
| Ticket slot | housing at (-0.62, 1.66, 0.59) | Dark slot with a glowing accent lip and a TICKET plate under it (same place as before). |
| Rear | back panels with louvres, data plates and the sign | Seen only from behind. |

## Size

About 1.97 MB of JSON (1971 KB): 34 textures (JPEG for opaque ones, WebP for transparent ones; steel tile 512 px, tickers 256 x 2048,
door 1100 x 640), 153 geometries, 76 materials. Idle: nothing in the model animates itself.
