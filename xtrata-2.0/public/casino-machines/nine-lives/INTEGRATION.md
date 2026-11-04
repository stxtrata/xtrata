# Nine Lives: putting it into the ParallaX Casino later

**Nothing in this file has been done.** No casino file was edited. These are the steps, in order, for whoever adds the machine by hand. Names below are the ones in `public/casino/index.html` as read on 2 Nov 2026; search for the quoted names rather than trusting any position.

Nine Lives is a ParallaX Casino fruit machine themed on **LEO Cats** (the 10,000-cat Stacks collection) and **$LEO**. It reskins the unchanged Block Fortune v2 engine (94.38% RTP, design estimate). Only names, art, sound, copy and the cabinet differ from Forever Twins.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, the real packed cabinet and game, a stub LAYR account, a hidden Test panel with an RTP sim. Serve `public/` and open `/casino-machines/nine-lives/`. It needs a web server (it fetches `pack.json`). |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64. `css` equals the game's head `<style>`. |
| `art/sources.json` | Where every image came from, the 101 bundled twins, and the logos that still need permission. |
| `art/nine-lives-art.json` | The 101 bundled twin images (webp data URIs), the tier of every token id (10,000 characters) and tier counts. |
| `vendor/three.js` | The same three.js build the casino room uses (r128), for the test page only. |
| `INTEGRATION.md` | This file. |

Build sources are in `tools/nine-lives/` (game script parts, the page, `model/build_model.py` and `textures.js`, build and verify scripts, `rtp-sim.mjs`). The engine and the LAYR adapter inside the game are copied byte for byte from Forever Twins; `tools/nine-lives/verify.py` checks that.

## 0. Testing every bonus: the Bonus lab

The Test panel on the test page only exists there. In the casino the game ships with a **Bonus lab** so every bonus can be tested on the real cabinet without risking anything real.

**Open it** (cabinet seated, idle, LAYR connected): press **L**, or Settings → "Bonus lab". A ribbon, "BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL", stays on screen. It swaps in a separate practice game (10,000 practice LAYR, its own meters and Holder Pot) on the raw engine; nothing is written to the LAYR account, saved game, round log or jackpot meters, and the dark-until-100-twins lock does not apply. Buttons: Night Prowl, If It Fits, Rooftops, Ninth Life, Heads or Tails (a winning spin, then press GAMBLE), any win, Twins none/some/all, Reduced motion, Reset balance, Leave. Each bonus plays trigger, intro, play, summary with Skip. `?prod` on the test page removes the test hooks.

## 1. Add the pack

In `public/casino/index.html`, find the script that starts `window.PX_MACHINE_PACKS=[`. Append the object in `pack.json` as the last entry. Its position is the machine type index used below.

```sh
node -e "const p=require('fs').readFileSync('public/casino-machines/nine-lives/pack.json','utf8');console.log(','+p)"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It runs against the room's interfaces unchanged: `window.ParallaxLAYRAccount` (from `window.parent`) and `PX_CASINO_ENGINE`.

## 2. The room's machine lists

1. **Presence list.** `const MACH = [...]` in the room.js section: add `'nl'`; in the name map add `nl: 'Nine Lives'`. The order must match `PX_MACHINE_PACKS`.
2. **Floor position: open question.** `buildSlots` places one machine per type at `zPositions`. Add a position or decide which wall space it takes before adding the machine.
3. **Floor glow.** In `buildSlots`, the `glowSprite(…, [0x4fe3d2, …][type], .11)` colour array: append `0x12b5a6` (Nine Lives' accent, `#12b5a6`, the same as the LEO Cats registry accent).
4. **Machines panel copy.**
   ```html
   <button class="machine-choice" data-machine-type="N" style="--machine-color:#0a1530;--machine-accent:#12b5a6"><b>Nine Lives</b><small>LEO Cats · $LEO · Forever Twins</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   (`N` is the index from step 1.)
5. **Cabinet parts.** Named parts: `screenMesh`, `crest` (the crescent-moon topper with the cat), `spinPhysical` (POUNCE), `lever` (the tail lever), and deck buttons with actions `spin`, `betUp`, `betDown`, `auto`, `pays`. There is **no `rain` part** (no rain on this cabinet). The marquee has 14 flicker windows named `win0` to `win13` (small lit overlays on dark painted windows). **The room only animates the roles it knows**, so unless the room is taught to toggle `.visible` on `win0..win13` (a couple swapping every 400 to 900 ms, faster during wins) they show a fixed, good-looking pattern. The test page does this flicker itself; copy its few lines if you want it in the room.

## 3. Fullscreen hand-over (`pxMachineFullscreen`)

The game owns its fullscreen: the screen fills the view and every control except the lever sits on a bottom bar (Spin, Bet, Max Bet, Auto-Prowl, Turbo, Paws, Fair Play, The cats, Holder Pot, History, LAYR account, Settings, Sound, Heads/Tails, Collect, Exit). Change the room's handler to hand over:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=activeMachineEngine&&activeMachineEngine.fullscreen;   // the seated machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}
  /* existing behaviour for the other machines */
};
```

Inside the pack, the game restyles its own `window.frameElement` (the hidden `.pxLogicFrame`) with inline `!important` styles and calls the Fullscreen API on it (a fixed full-viewport layer where the API is missing). `Esc` or its Exit button leaves; `engine.deactivate()` exits first, so walking away cannot leave a stuck layer.

## 4. Things the room already does that Nine Lives relies on

- `pxLiteDocument` looks for the exact string `screen=canvas(2800,1920)`: present once.
- `pxRlPatch` (round log) matches by game id; `nine-lives` is not a known id, so its spins are not in the room's round log until that table is extended. Nothing breaks.
- LAYR: only `acquire`, `ready`, `error`, `machine`, `openGame`, `saveGame` are used. State is stored under the id `nine-lives`. There is no second balance.
- Network: the game reads `https://xtrata.xyz/forever-twins/data/registry.v2.json` and the LEO Cats helper's event log through `xtrata.xyz/hiro/...`, twin art from `xtrata.xyz/inscription/...`, and untwinned cat art from Hiro's thumbnail host and two IPFS gateways. Allow those in any CSP. Everything needed to draw the reels at launch is bundled, so nothing fails if they are blocked.

## 5. Holder layer and dark mode (version 1: display only)

- **Holder Pot:** 1% of every paid bet, weekly period, kept in the game state beside the jackpot meters. The screen shows the estimated share per twin (pot ÷ twins counted).
- **Dark mode:** the cabinet stays dark ("THE CATS ARE ASLEEP · COMING SOON", then "N / 100 TWINS") until LEO Cats has a Forever Twins helper with at least 100 twins. The registry already lists the LEO Cats helper (`SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata`) and 101 twins existed on 2 Nov 2026, so it opens on its own. Twin counts only go up, so if Xtrata cannot be read the bundled snapshot (101) keeps the cabinet open, and the screen says "last known". A failed read is never shown as zero. A testnet power-up button and Settings toggle exist to run it earlier.
- **Cameos:** a cat on a winning line is recorded in the spin history as `{tokenId, collection: 'leo-cats', lineWin, forever, xtrataId}`. In **If It Fits**, each twin cat that pops out of a box is recorded with `boxPrize` and `holderShare` (1% of the box prize). **Display and history only: nothing is paid.** The source of the 1% (house edge, as for the pot, or a separate share) is not specified; the code records it and leaves a `TODO(holder-layer v2)`. Paying it needs a server or contract.
- **Stubs:** `HolderLayerStubs` lists snapshot, claim, holder spins, Forever Fund and Collection Cup, each with a TODO line.

## 6. Before it goes on the public floor

1. **Logo permission.** `art/sources.json` lists them: **Fak.fun** (scatter), the **$LEO token logo** (cherry) and the **LEO Cats Forever Twin logo** (vault). Fak.fun's and $LEO's exact source URLs were not recorded at fetch time: confirm them. Ask each owner before launch.
2. **Floor space** (section 2, item 2).
3. **Gold is thin.** Only 3 of the 101 bundled twins are in gold frames. Gold and silver cats that have no twin yet are loaded live (Hiro thumbnail, then IPFS), so a browser that cannot reach those shows fewer gold faces. The reels never fail: pools fall back to the bundled twins and placeholders.
4. **Legal.** The Holder Pot and the 1% cameo share machine takings with NFT holders. While LAYR is play money this is a game mechanic; on mainnet it raises licensing and securities questions. Take advice first.
5. The RTP (94.38%) is a design estimate from the engine's exhaustive model and a seeded simulation, not a certified figure. The Fair Play panel says so.

## 7. Rebuilding

```sh
python3 tools/nine-lives/build.py      # game.html → pack.json → public/casino-machines/nine-lives/
python3 tools/nine-lives/verify.py     # engine and adapter identical to Forever Twins; pack.json decodes
node tools/nine-lives/rtp-sim.mjs 5000000 1 100
```
