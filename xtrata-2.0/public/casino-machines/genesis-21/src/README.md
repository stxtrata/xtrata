# Genesis 21: sources

These are the files `pack.json` and `index.html` were built from. They are here so the machine can be rebuilt and audited; the casino does not load anything from this folder.

## How the game is made
Genesis 21 is a reskin of the Block Fortune v2 engine (`BF`). The engine (`engine/bf-engine.js`) is copied byte for byte from the Forever Twins pack and is never edited: it deals every outcome (reel stops, bonus prizes, jackpot, gamble) before any picture is chosen. Everything else is presentation.

```
ft/                the Forever Twins pack's scripts and shell, taken from the room (script3.js is the engine; script8.js is the game code this machine was reskinned from; script2.js is the bundled three.js subset; script4.js its software renderer)
game/p_*.js        the Genesis 21 parts: art and tiles (p_art), account stub (p_stub), screen (p_screen), panels and copy (p_panels), frame, test hooks and engine bridge (p_frame), bonus scenes (p_scenes), Test panel (p_test), full-screen mode (p_fs)
game/make_*.py     assemble the parts onto script8.js: make_game.py (reskin), make_game2.py (scenes, full screen, test panel, exact Xtrata mark), make_shell.py (page shell and CSS)
game/index.template.html   the test page (3D studio, stub LAYR account)
cabinet/cabinet.mjs        builds the cabinet model JSON (43 geometries, 28 materials, 14 textures); the door uses art/brand/xtrata-logo.svg as supplied
build/assemble.py          game HTML + model -> pack.json (gzip + base64)
build/package.py           writes index.html, pack.json and art/ into the machine folder
build/bundle_art.cjs       bundles the twin images and the 150 real Stacks blocks (data/chain.json) into the game
qa/                        RTP simulator (sim.mjs on engine.cjs), results, the engine identity check, and the browser checks that were run
```

The scripts were written against a scratch folder that held `ft/`, `gen/`, `cab/`, `build/` and `chain/` side by side (`gen/` here is `game/`). To rebuild, recreate that layout (rename `game/` to `gen/`, put `data/chain.json` at `chain/chain.json`, put the twin images from `art/twins/` and the manifests from `art/manifests/` at `art/` beside them), then run `build/rebuild.sh`.

## Checks
* `qa/engine-identity.txt`: the engine text is contained verbatim in the Forever Twins, Block Fortune and The Drop packs from the room and in the Genesis 21 game.
* `qa/rtp-summary.txt`: seven 5,000,000-spin seeded runs. `node qa/sim.mjs 5000000 <seed>` reproduces any of them.
* `qa/browser/`: the Playwright (Python) checks that drove the test page in Chromium at desktop and phone width.

## Art
`art/sources.json` (one level up) records the source of every image. `tools/fetch-art.mjs` fetches the six collections that could not be fetched while building. Nothing is redrawn: a Stacks NFT with no twin shows desaturated with a NOT YET FOREVER stamp; the Genesis block and Bitcoin anchor tiles are drawn from real Stacks block data.
