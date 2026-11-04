# Who Is Satoshi?: putting it into the ParallaX Casino later

**Nothing in this file has been done.** No casino file was edited. These are the steps, in order, for whoever adds the machine by hand. Names below are the ones in `public/casino/index.html` and `public/casino/room.js` as read on 1 Nov 2026; both files have been changed since (chess, 2 Nov), so search for the quoted names. Other new machines (Snow Crash, Genesis 21 and so on) may have been added since, so search for the quoted names rather than trusting any position or index.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, the real packed cabinet and game, a clearly marked **test stub** of `ParallaxLAYRAccount`, the Bonus Lab and a Test panel (T). Serve `public/` and open `/casino-machines/who-is-satoshi/`. It needs a web server (it fetches `pack.json`). `?prod` removes the test hooks (the Lab then needs `?lab=1`), `?nostudio` skips WebGL, `?test` opens the Test panel. |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64. `css` equals the game's head `<style>`. |
| `art/records.json` | The real records the reels are set from: 15 dated Satoshi posts, 59 Patoshi block heights, the key fingerprint, the five published works, the court record. |
| `art/sources.json` | Where every record and image came from, and the logos that still need permission (none). |
| `art/prints/*.jpg` | Jim's own pop-art prints of the people (16 tiles cut from `source-grid.jpg`). They are embedded in the game as data URIs, so the pack stays one file; the copies here are for reference. |
| `art/cabinet/*.png` | The cabinet artwork (door, marquee, folder, cork boards, key bow, deck keys), rendered from SVG at build time. |
| `vendor/three.js` | The same three.js build the casino room uses (copied from `tools/snow-crash/vendor/three.js`), for the test page only. |
| `QA.md` | What was checked and the results (RTP, Lab run-all, fullscreen sessions, reload safety). |

Build sources are in `tools/who-is-satoshi/`. The engine and the LAYR adapter inside the game are copied byte for byte from Forever Twins; `tools/who-is-satoshi/verify.py` checks that against the pack inside `casino/index.html` (read only).

## 1. Add the pack

Append the object in `pack.json` to `window.PX_MACHINE_PACKS=[…]` in `public/casino/index.html`, after the last existing entry. Its position is its machine type index everywhere below (6 if it follows only the original five; later if Snow Crash and others went in first).

```sh
node -e "const p=require('fs').readFileSync('public/casino-machines/who-is-satoshi/pack.json','utf8');console.log(','+p)"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It runs with the room's interfaces unchanged: `window.ParallaxLAYRAccount` (taken from `window.parent`; `acquire`, `ready`, `error`, `machine`, `openGame`, `saveGame` only, state id `who-is-satoshi`, no second balance) and `PX_CASINO_ENGINE` (`screen`, `revision`, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `refreshAccount`, `closeModal`, `stopAuto`, `fullscreen`).

## 2. The room's machine lists

1. **Presence list** (room.js): `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv', …];` → append `'wis'` at the pack's index, and in the name map beside it add `wis: 'Who Is Satoshi?'`. The order must match `PX_MACHINE_PACKS`.
2. **Floor positions: open question.** `buildSlots` places one machine per type at `zPositions=[-7.6,-4.2,-.8,2.6,6]` on both side walls: five positions. The series bible's open question (second row, new wing, or rotation) has to be settled first.
3. **Floor glow.** In `buildSlots`: `glowSprite(…, [0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd, …][type], .11)` → append `0xe0b04a` at the pack's index.
4. **Machines panel copy.** After the last machine button:
   ```html
   <button class="machine-choice" data-machine-type="N" style="--machine-color:#2a1a0e;--machine-accent:#e0b04a"><b>Who Is Satoshi?</b><small>The Satoshi mystery · noir case file</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   (`N` is the index from step 1.)
5. The name plaque (`pxSign(...)`) and the 2.6 m scaling are automatic. Named parts: `screenMesh`, `crest` (the turning brass key with ₿ in its bow), `lever` (brass arm with a magnifying-glass grip, pivots on `rotation.x`), `spinPhysical`, and deck buttons with actions `spin` (INVESTIGATE), `betUp` (+CLUES), `betDown` (−CLUES), `auto` (AUTO-SLEUTH), `pays` (CASE FILE). Two extra roles the room may ignore or animate: `string` (four transparent overlays of the cork-board red string; the test page fades them up on wins using `mechanics().string`, 0–1) and `lamp` (the green banker's lamp group).

## 3. Fullscreen hand-over (`pxMachineFullscreen`)

The game owns its fullscreen: its screen fills the view and every control except the lever is on a bottom bar (INVESTIGATE, −/+ CLUES, MAX CLUES, AUTO-SLEUTH, TURBO, CASE FILE, FAIR PLAY, EVIDENCE, GIFT, LOG, LAYR, SETTINGS, SOUND, VOLUME, the gamble's ₿ SATOSHI and FAKE · NOT, COLLECT, LAB when enabled, EXIT). Change the room's handler to:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=activeMachineEngine&&activeMachineEngine.fullscreen;   // the seated machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}                                     // Who Is Satoshi? (and any pack that offers it)
  /* existing behaviour for the other machines */
};
```

How it works inside the pack (same as Snow Crash): it restyles its own `window.frameElement` (the hidden `.pxLogicFrame`) with inline `!important` styles, then calls the Fullscreen API on it, staying a fixed full-viewport layer where the API is missing (iPhone Safari). `Esc` or EXIT leaves and restores the frame. `deactivate()` exits fullscreen first. Panels are the game's own native dialogs, so they work inside fullscreen.

## 4. Things the room already does that this machine relies on

- `pxLiteDocument` looks for `screen=canvas(2800,1920)`: present, once.
- `pxRlPatch` (round log) matches `GAME_ID` by id. `who-is-satoshi` is not a known id, so spins are not in the room's round log until its table is extended. Nothing breaks.
- `pxRafShim` pumps frames for the hidden frame. The game idles near 30 fps and redraws only when something changed or is animating.
- Network: the game reads `https://xtrata.xyz/forever-twins/data/registry.v2.json` and each live helper's events (via `xtrata.xyz/hiro/mainnet`, falling back to `api.hiro.so`) to count twins for Satoshi's Gift. Everything on the reels is bundled; if those reads fail the cabinet shows "twin count unknown", never zero.

## 5. The Bonus Lab in the casino

Hidden for players. It appears only with the developer flag `?lab=1` on the casino URL (testnet LAYR). L opens it, as do Settings and the bar's LAB button. It swaps in a separate practice game (10,000 practice LAYR, its own meters and pot) running on the raw engine; nothing touches the LAYR account, saved game, jackpot meters, Satoshi's Gift or statistics, and its rounds are marked LAB in History. Items: The Forum, The Forum + retrigger, Unmask Satoshi, The Patoshi Pattern, Patoshi full grid (→ Satoshi's Key), Satoshi's Key (centre row), Satoshi or Not? win and loss, scatter pays of 3/4/5, The Forgery (FAKE stamp), Satoshi's Gift draw. Options: bet level, Seeded (seed field) or Random, Auto-advance, Run, Replay last, Run all. Each run passes a scripted rng to the engine's own `start(state, rng)`; the engine is never edited.

## 6. Holder layer (version 1: display only) — Satoshi's Gift

- **Pot:** 1% of every paid bet, weekly period (`weekKey`), stored in the game state (`pot`, `potKey`, `lastPot`) beside the jackpot meters, from the house edge. Shown on the screen with the number of twins in the draw and the odds per twin.
- **The draw:** the whole pot of a period goes to one twin from every live Forever Twins collection; index = snapshot block hash mod twin count (`giftIndex`, exposed as `HolderLayerStubs.satoshisGiftDraw`). Payout, snapshot and claim are stubs with `TODO(holder-layer v2)` lines.
- **Cameo royalty:** none on this machine: its reels carry no NFTs, only records.

## 7. Before it goes on the public floor

1. **Wording and faces.** The Forgery follows the COPA v Wright judgment as reported, and now carries the Wright and Mellor prints (Wright's with a small NOT SATOSHI · HIGH COURT stamp). Szabo, Back and Dai, whose prints are on the reels, have publicly denied being Satoshi. Check you are happy with both before the public floor.
2. **Key fingerprint.** Taken from the Bitcoin Foundation bylaws on GitHub because the archived `Satoshi_Nakamoto.asc` could not be fetched from the build machine; compare against the archived key file once.
3. **Floor space** (section 2, item 2).
4. **Legal.** The pot shares machine takings with NFT holders. While LAYR is play money this is a game mechanic; on mainnet it raises licensing and securities questions. Take advice first.
5. The RTP (94.38%) is a design estimate from the engine's model and a seeded simulation, not a certified figure. The Fair Play panel says so.

## 8. Rebuilding

```sh
python3 tools/who-is-satoshi/model/build_model.py   # cabinet → model JSON + art/cabinet/*.png (numpy, cairosvg)
python3 tools/who-is-satoshi/build.py               # game.html → pack.json → public/casino-machines/who-is-satoshi/
python3 tools/who-is-satoshi/verify.py              # engine and adapter identical to Forever Twins; pack.json decodes; casino untouched
node tools/who-is-satoshi/rtp-sim.mjs 5000000       # seeded 5M-spin return check
```
