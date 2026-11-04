# Club X: test page and pack

A ParallaX Casino fruit machine for Chemical X. Open `index.html` through a local web server (for example `npx serve public`, then `/casino-machines/club-x/`); it does not work from `file://`.

| File | What it is |
| --- | --- |
| `index.html` | The standalone test page: a small 3D studio with the cabinet, a screen view, the topper view and an orbit view, a clickable fire-door lever, deck buttons, Space to spin, a play-balance LAYR stub with reset, the Bonus Lab (L) and the test panel (T). |
| `pack.json` | The machine as one `PX_MACHINE_PACKS` entry. |
| `vendor/three.js` | three.js for the test page. |
| `art/works.json` | Chemical X's works the reels are set from (contracts and token ids; entries marked `needed` wait on Jim). |
| `art/sources.json` | Every image's source and what still needs permission. |
| `art/cabinet/*.png` | The cabinet's textures, for reference. |
| `INTEGRATION.md` | How to add it to the casino later. |

Source and tools live in `tools/club-x/`: `build.py` (build everything), `verify.py` (checks), `rtp-sim.mjs` (5,000,000-spin RTP), `fetch_art.py` (bundle the works' images offline), `model/` (the cabinet), `src/` (the game).


## Official Chemical X art (supplied by Jim, 2 Nov 2026)
`art/official/cx-01..16.jpg` are 16 official Chemical X images cut from the contact sheet Jim sent (titles in `art/official/official.json` are working descriptions only). `build.py` embeds them in the game as `official:N` entries of the art bundle, so they show offline, in full colour, on the Chemical X (artifact) symbol. They are not on-chain tokens: no contract, no token id, no Xtrata id, so they never take part in the Forever Twins cameo. Four are character portraits (CX hoodie): candidates for the Wild if Chemical X wants one in place of The Mask. Several are pill mosaics and one is a bottle silhouette, which the brief's no-pills rule would normally exclude: remove their ids from `official` in `art/works.json` and rebuild if they should not be on the reels.

### Genuine pink X
`art/brand/cx-pink-x.png` is the pink X from official tile 7 ($€X¥), cut out and keyed to transparent. `build.py` embeds it as `CLUBX_BRAND.pinkX`. It replaces the drawn Stencil X (pink) tile (now "CHEMICAL X") and every pink spray X (Tag tiles and the X Marks the Spot map). All other drawn X marks (chalk, acid stencil, neon, laser, mask, midnight, wristband) are unchanged. The pill-mosaic X is not used (no-pills rule).
