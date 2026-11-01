# Snow Crash: putting it into the ParallaX Casino later

**Nothing in this file has been done.** No casino file was edited. These are the steps, in order, for whoever adds the machine by hand. Names below are the ones in `public/casino/index.html` as read on 1 Nov 2026; the live file has changed since (it is larger than the copy this was written against), so search for the quoted names rather than trusting any position.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, the real packed cabinet and game, a stub LAYR account, a hidden Test panel. Serve `public/` and open `/casino-machines/snow-crash/`. It needs a web server (it fetches `pack.json`). |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64. `css` equals the game's head `<style>`. |
| `art/sources.json` | Where every image came from, and the logos that still need permission. |
| `art/snow-crash-art.json` | The 108 bundled punks (webp data URIs), the tier of every token id, and tier counts. |
| `vendor/three.js` | The same three.js build the casino room uses (r128), for the test page only. |
| `INTEGRATION.md` | This file. |

Build sources are in `tools/snow-crash/` (parts of the game script, the page, the model builder, the build scripts). The engine and the LAYR adapter inside the game are copied byte for byte from Forever Twins; `tools/snow-crash/verify.py` checks that.

## 0. Testing every bonus on the live cabinet: the Bonus lab

The test page's Test panel only exists on the test page (it needs `window.parent.SC_TEST_PAGE`). In the casino the game ships with a **Bonus lab** built in, so every bonus can be tested on the real cabinet without risking anything real.

**Open it** (cabinet must be seated and idle, LAYR connected): press **L**, or Settings → "Bonus lab", or from fullscreen use the bar's Settings button. The Test panel then opens. A yellow ribbon, "BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL", stays on the screen while it is on.

**What it does:** it swaps in a separate practice game (10,000 practice LAYR, its own bet, jackpot meters and Holder Pot) running on the raw Block Fortune engine. While it is on, nothing is written to the LAYR account, the saved game, the round log or the jackpot meters, and the dark-until-100-twins lock does not apply, so it works on the live cabinet today. The panel has a button for each of: Jacked In, The #1 Club, Forever Street, Total Crash, Heads or Hacks (a winning spin, then press GAMBLE), and any win; Twins none/some/all (restored when you leave); Reduced motion; Reset balance; Leave the lab. Every bonus plays its four stages (trigger, intro, play, summary) with Skip, on the room screen, the HTML port and the fullscreen bar.

**Leave it** with "Leave the lab" in the panel, Settings, or by walking away (the machine leaves the lab by itself when the room deactivates it). Leaving restores the real game exactly as it was, and the twins view is restored.

**Caveats:** (1) The room shows `ui().balance`, so the room's balance display shows the practice balance while the lab is on; the ribbon says so. (2) The outcomes are real engine outcomes, with the reel stops chosen to trigger the bonus you asked for. They show how the bonus plays, not how often it occurs. (3) It is open to anyone at the cabinet. That is safe while the lab cannot reach real balances, which is how it is built; if a real-money mode is ever added, gate the lab behind an owner check first. (4) `?prod` on the standalone test page (`/casino-machines/snow-crash/?prod`) removes the test hooks, so you can try the lab exactly as the casino will present it.

## 1. Add the pack

In `public/casino/index.html`, find the script that starts `window.PX_MACHINE_PACKS=[{"name":"The Drop", ...`. Append the object in `pack.json` as a sixth entry, after Neon Vault, so the order becomes The Drop, Forever Twins, Deep Strata, Block Fortune, Neon Vault, **Snow Crash**. The order is the machine type index everywhere below.

```sh
node -e "const p=require('fs').readFileSync('public/casino-machines/snow-crash/pack.json','utf8');console.log(','+p)"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It already runs with the room's interfaces unchanged: `window.ParallaxLAYRAccount` (taken from `window.parent`), `PX_CASINO_ENGINE` (screen canvas, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `revision`, `refreshAccount`, `closeModal`, `stopAuto`).

## 2. The room's machine lists

1. **Presence list.** In the room.js section: `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv'];` → add `'sc'`. In the name map beside it (`drop: 'The Drop', … nv: 'Neon Vault'`) add `sc: 'Snow Crash'`. The comment says the order matches `PX_MACHINE_PACKS`; it must.
2. **Floor positions: open question.** `buildSlots` places one machine per type at `zPositions=[-7.6,-4.2,-.8,2.6,6]` on both side walls. That is five positions for five machines. A sixth needs a sixth z (about 8.4, if the hall is long enough) or a decision about which wall space it takes. The room's `occupiedIndex` picks one cabinet at random using `zPositions.length*2`, so changing the array length is safe. Decide where it goes before adding it.
3. **Floor glow.** In `buildSlots`: `glowSprite(…, [0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd][type], .11)` → append `0xff3ea5` (Snow Crash's accent, `#ff3ea5`).
4. **Machines panel copy.** In the panel markup add, after Neon Vault's button:
   ```html
   <button class="machine-choice" data-machine-type="5" style="--machine-color:#1c0d2b;--machine-accent:#ff3ea5"><b>Snow Crash</b><small>Crash Punks · six rarity tiers</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   (`data-machine-type` is the index from step 1.)
5. The room's name plaque (`pxSign(...)`) and the 2.6 m scaling are automatic. The cabinet's named parts are `screenMesh`, `crest` (topper), `rain` (four meshes), `lever`, `spinPhysical` and deck buttons with actions `spin`, `betUp`, `betDown`, `auto`, `pays`.

## 3. Fullscreen hand-over (`pxMachineFullscreen`)

The room's button currently does:

```js
$('pxMachineFullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('…'));};
```

For Snow Crash, hand over to the game. The game owns its fullscreen: its screen fills the view and every control except the lever is on a bottom bar (Spin, Bet −/+, Max Bet, Autopilot, Turbo, Pays, Fair Play, Punks, Holder Pot, History, LAYR account, Settings, Sound, the gamble's Heads and Hacks, Collect, Exit). Change the handler to:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=activeMachineEngine&&activeMachineEngine.fullscreen;           // the loaded machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}                                             // Snow Crash (and any pack that offers it)
  /* existing behaviour for the other five machines */
};
```

`activeMachineEngine` is whichever `PX_CASINO_ENGINE` the room already keeps for the seated machine (the `machineEngines` map). The `F` key already clicks this button, so it hands over too. How it works inside the pack:

- The game restyles its own `window.frameElement` (the hidden `.pxLogicFrame` iframe) with inline `!important` styles (fixed, full viewport, high z-index). The room's CSS hides that frame with `!important`; an inline `!important` declaration wins.
- It then calls the Fullscreen API on that frame. Where the API is missing (iPhone Safari) it stays as a fixed full-viewport layer.
- `Esc` (browser) or its own Exit button leaves; the frame's original style is restored.
- `engine.deactivate()` exits fullscreen first, so walking away from the machine cannot leave a stuck layer.
- Inside fullscreen, panels are the game's own native dialogs. The room's HTML port of the dialog (`ui().modal`) will also fill, underneath; harmless, but the room can skip drawing it while `fullscreen.active()` is true.
- `fullscreen.addBarButton(label, small, fn)` lets the room add its own button to the bar if it ever needs to.

## 4. Things the room already does that Snow Crash relies on

- `pxLiteDocument` patches the game text and looks for the exact string `screen=canvas(2800,1920)`. It is present, once, in the game.
- `pxRlPatch` (round log) matches the game's `GAME_ID`/`E` line by id. `snow-crash` is not a known id, so Snow Crash's spins are **not** hooked into the room's round log until its table is extended. Nothing breaks.
- `pxRafShim` wraps `requestAnimationFrame` and pumps frames for the hidden frame. The game uses plain `requestAnimationFrame`, idles at about 30 fps, and draws its 2800×1920 screen only when something changed or is animating.
- LAYR: the game calls only `acquire`, `ready`, `error`, `machine`, `openGame`, `saveGame`. State is stored under the id `snow-crash`. There is no second balance.
- Network: the game reads `https://xtrata.xyz/forever-twins/data/registry.v2.json` and, once a Crash Punks helper exists, the helper's twins and their images from Xtrata. Allow those hosts in any CSP. Everything needed to draw the reels is bundled, so nothing fails if they are blocked; the cabinet then shows "twin count unknown".

## 5. Holder layer and dark mode (version 1: display only)

- **Holder Pot:** 1% of every paid bet, weekly period, stored in the game state (`pot`, `potKey`, `lastPot`) beside the jackpot meters. Shown on the screen with the estimated share per twin (pot ÷ twins counted from the helper; "unknown" if the read fails).
- **Dark mode:** Crash Punks has no Forever Twins helper yet, so the cabinet ships dark: "COMING TO FOREVER TWINS", then "N / 100 TWINS TO SWITCH ON" once a helper exists. At 100 twins it opens by itself. The testnet build has a power-up button and a Settings toggle ("Testnet mode") to run it earlier.
- **Cameo:** a punk on a winning line is recorded as `{tokenId, collection, lineWin, forever, xtrataId}` in the spin history. No royalty is paid.
- **Stubs** (nothing pays out): `HolderLayerStubs` in the game script lists snapshot, claim, holder spins, Forever Fund and Collection Cup, each with a `TODO(holder-layer v2)` line. They need a server or a contract.

## 6. Before it goes on the public floor

1. **Logo permission.** `art/sources.json` lists them. The This Is #1 mark needs the platform's OK, and its exact source URL should be confirmed. The official **Crash Punks logo was not found**: the scatter tile and the topper show the name in type until the file and the project's OK arrive.
2. **Floor space** (section 2, item 2).
3. **Legal.** The Holder Pot shares machine takings with NFT holders. While LAYR is play money this is a game mechanic; on mainnet it raises licensing and securities questions. Take advice first.
4. The RTP (94.38%) is a design estimate from the engine's exhaustive model and a seeded simulation, not a certified figure. The Fair Play panel says so.

## 7. Rebuilding

```sh
python3 tools/snow-crash/build.py      # game.html → pack.json → public/casino-machines/snow-crash/
python3 tools/snow-crash/verify.py     # engine and adapter identical to Forever Twins; pack.json decodes
```
