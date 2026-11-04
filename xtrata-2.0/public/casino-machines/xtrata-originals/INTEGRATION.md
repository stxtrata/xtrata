# Xtrata Originals: putting it into the ParallaX Casino later

**None of these steps has been done yet.** No casino file was edited. They are listed in order for whoever adds the machine by hand. The names come from `public/casino/index.html` and `room.js` as they stood on 1 Nov 2026 (`casino/index.html` sha256 `baa7750b…`). Search for the quoted names rather than trusting line numbers. Other series machines (Snow Crash, Ordinal Rush, …) may be added first, so the type index below is "the next free one".

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | The standalone test page. It has a 3D studio (dark floor, soft lights, a blue floor glow), the real packed cabinet and game, and a test LAYR account (play balance, Reset). It also has Cabinet, Screen and Orbit views, a clickable lever and deck buttons, Space to spin, F for fullscreen, L for the Bonus Lab and T for the test panel. If WebGL is missing it falls back to the casino's `SoftwareRenderer`. Add `?prod` to see the page as the casino will (no test hooks, no Lab). |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64, and `css` equals the game's head `<style>`. |
| `pack.js` | The same pack as `window.XO_PACK`, so the test page also opens from disk. |
| `art/images/`, `art/sources.json` | Every bundled image and sound as a file, and where each one came from, plus the logos still needed. |
| `vendor/` | `three.js` (r128, test page only) and `software-renderer.js` (the casino's WebGL-less path). |
| `checks/` | The 5,000,000-spin RTP result, the screenshots from the end-to-end test, and `results.json`. |

The build sources live in `tools/xtrata-originals/`: the game script in parts, the page, the cabinet builder, the art capture scripts, `build.py`, `verify.py`, `rtp-sim.mjs` and `test-page.cjs`. The engine, the LAYR adapter and the XLOGO code inside the game are byte-identical to the Forever Twins copies, and `verify.py` checks that.

## 1. Add the pack

In `public/casino/index.html`, find the script that starts `window.PX_MACHINE_PACKS=[{"name":"The Drop", …`. Append the object from `pack.json` as the next entry. Its position in the array is its machine type index everywhere below. With only the five current machines that index is **5**.

```sh
node -e "process.stdout.write(','+require('fs').readFileSync('public/casino-machines/xtrata-originals/pack.json','utf8'))"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It already uses the room's interfaces unchanged:

- `window.ParallaxLAYRAccount`, taken from `window.parent`. It calls only `acquire`, `ready`, `error`, `machine`, `openGame` and `saveGame`, and stores its state under the id `xtrata-originals`. There is no second balance or wallet.
- `PX_CASINO_ENGINE`: `screen` (2800×1920), `revision`, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `refreshAccount`, `closeModal`, `stopAuto`, `fullscreen`, and `lab` (only when the Lab is allowed, see section 4).

## 2. The room's machine lists

1. **Presence list.** In `room.js`, `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv'];`: append `'xo'`. In the name map beside it, add `xo: 'Xtrata Originals'`. The order must match `PX_MACHINE_PACKS`.
2. **Floor position.** This is an open question in the series bible. `buildSlots` places one machine per type at `zPositions=[-7.6,-4.2,-.8,2.6,6]` on both side walls, so a sixth type needs a sixth z, a second row or a new wing.
3. **Floor glow.** In `buildSlots`, append `0x4675b6` to `glowSprite(…, [0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd][type], .11)`. That is Xtrata Originals' accent, `#4675b6`.
4. **Machines panel copy.** After the last machine button, add:
   ```html
   <button class="machine-choice" data-machine-type="5" style="--machine-color:#0b0e14;--machine-accent:#4675b6"><b>Xtrata Originals</b><small>Born on chain · the house machine</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   `data-machine-type` is the index from step 1.
5. **What the room does automatically:** the name plaque (`pxSign(...)`) and the 2.6 m scaling. The cabinet's standard named parts are:
   - `screenMesh`, the live canvas;
   - `crest`, the topper: the three stacked light bands of the X, white, blue and orange, to be turned on its own clock;
   - `lever`, which pulls forward about x;
   - `spinPhysical`, the INSCRIBE cap;
   - deck buttons with the actions `spin` (INSCRIBE), `betUp` (+LAYR), `betDown` (−LAYR), `auto` (AUTO-LAYER) and `pays` (GALLERY).

   Two extra roles are optional and safe to ignore:
   - `portrait`: the 12 framed Audionauts on the flanks. Their textures are already baked into the model.
   - `edgeGlow`: the fine blue and orange edge lines. The test page flashes them on a bonus and cycles white, blue and orange on The X.

   If the room wants that reaction, read `mechanics()`, which now also returns `jackpot` and `win`.

## 3. Fullscreen hand-over (`pxMachineFullscreen`)

The game owns its own fullscreen: its screen fills the view, and every control except the lever sits on a bottom bar. The bar holds INSCRIBE, which becomes the waiting bonus action (START, OPEN n, RESPIN, STEP, COLLECT); −LAYR and +LAYR with the bet; MAX LAYR; AUTO-LAYER; TURBO; the gamble's ₿ BITCOIN and STACKS plus COLLECT whenever a gamble is offered; GALLERY; FAIR PLAY; THE WORK; HOLDER POT; HISTORY; LAYR; SETTINGS; SOUND and a volume slider; LAB (developer flag only); TEST (test page only); and EXIT.

Change the room's handler to hand over:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=activeMachineEngine&&activeMachineEngine.fullscreen;   // the seated machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}                                     // Xtrata Originals (and any pack that offers it)
  /* existing behaviour for the other machines */
};
```

How it works inside the pack:

- It restyles its own `window.frameElement` (the hidden `.pxLogicFrame` iframe) with inline `!important` styles, then calls the Fullscreen API on it.
- Where the API is missing (iPhone Safari), it stays a fixed full-viewport layer.
- Esc or EXIT leaves fullscreen and puts the frame's own style back, and `deactivate()` exits first.
- Panels are the game's own native dialogs, so they open on top of the bar.
- The room may skip drawing its HTML port of `ui().modal` while `fullscreen.active()` is true.
- `fullscreen.addBarButton(label, small, fn)` lets the room add a button of its own to the bar.

## 4. The Bonus Lab in the casino

The Lab is always on the standalone test page. Inside the casino, the game enables it only when the **room's** URL has `?lab=1` **and** the room is on testnet: either `window.PX_NETWORK === 'testnet'` on the room's window, or a host matching `testnet`, `localhost`, `127.0.0.1` or `.local`. Players in production never see it.

If the room has no `PX_NETWORK` flag, set `window.PX_NETWORK='testnet'` on the testnet deployment.

While the Lab is on:

- the game swaps in a separate practice game with 10,000 practice LAYR, on the raw engine;
- every Lab round is marked LAB in History;
- the real LAYR account, the saved game, the jackpot meters, the Holder Pot and the RTP statistics are never touched;
- a yellow ribbon on the screen says so.

`ui().balance` reports the lab balance while the Lab is on (`ui().lab === true`), so the room's balance display should show it as practice LAYR.

## 5. Things the room already does that this machine relies on

- `pxLiteDocument` looks for the exact string `screen=canvas(2800,1920)`. It appears once.
- `pxRlPatch` (the round log) matches games by id. `xtrata-originals` is not in its table yet, so its spins are not in the room's round log until the table is extended. Nothing breaks without it.
- `pxRafShim` pumps frames. The game idles near 30 fps and also exposes `window.__pxPump()` for hosts that drive frames themselves.
- **Network:** the game reads:
  - `https://xtrata.xyz/forever-twins/data/registry.v2.json`, for the core contract;
  - `https://xtrata.xyz/hiro/mainnet/…`, falling back to `api.hiro.so`, for the Audionauts collection's mint events (the Holder Pot's count) and the xtrata.btc and jim.btc holdings (live layer tiles).

  Both results are cached for 6 hours. Everything on the reels is bundled, so nothing fails if these hosts are blocked: the count then reads "unknown". Allow them in any CSP.

## 6. Holder layer (version 1: display only)

- **Holder Pot:** the Audionauts Holder Pot. 1% of every paid bet goes in, from the house edge, and it runs weekly (UTC). It is stored in the game state as `pot`, `potKey` and `lastPot`, beside the jackpot meters. The screen and the HOLDER POT panel show pot ÷ minted Audionauts. A failed read shows "unknown", never zero.
- **Cameo:** when an Audionaut (or CALLISTO) is on a winning line, the win message shows its edition, name and Xtrata ID, and History records `{tokenId, collection: 'audionauts', edition, name, lineWin}`.
- **Stubs:** `HolderLayerStubs` covers snapshot, claim, `starSongSplit` (the optional 20% to each Audionaut's star-song artist), holder spins, Forever Fund and Collection Cup, each marked `TODO(holder-layer v2)`. The star-song split must be server-side, because naming the artist on the client would reveal the hidden song.

## 7. Before it goes on the public floor

1. The **Audionals logo** file is missing, and a typed tile stands in for it. The cicada art and calls come from Jim's `cicada-v3` engine, which isn't inscribed yet; confirm it may be shown. See `art/sources.json`.
2. Decide the floor space (section 2, item 2).
3. **Legal:** the Holder Pot shares machine takings with holders. Take advice before LAYR becomes real STX.
4. **RTP:** 94.38% is a design estimate, not a certified figure. The seeded 5M-spin run gives 94.359% (`checks/rtp-5m.json`).

## 8. Rebuilding

```sh
python3 tools/xtrata-originals/art-src/build_art.py                      # only after new captures (needs ./raw from the art-src scripts)
node tools/xtrata-originals/model/build-cabinet.mjs --preview            # only after editing model/cabinet.js (reads THREE from casino/index.html)
python3 tools/xtrata-originals/build.py                                  # game.html → pack.json, pack.js, index.html, vendor/, art/
python3 tools/xtrata-originals/verify.py                                 # engine, adapter and XLOGO identical to Forever Twins; pack decodes
node tools/xtrata-originals/rtp-sim.mjs 5000000                          # seeded RTP
node tools/xtrata-originals/test-page.cjs http://localhost:8000/casino-machines/xtrata-originals/   # end-to-end (serve public/ first)
```
