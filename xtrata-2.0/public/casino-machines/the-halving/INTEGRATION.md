# The Halving: putting it into the ParallaX Casino later

**Nothing in this file has been done.** No casino file was edited. These are the steps, in order, for whoever adds the machine by hand. Names below are the ones in `public/casino/index.html` and `public/casino/room.js` as read on 2 Nov 2026 (sha256 of `index.html` at the start of this build: `eaa66fd3…0656`). Other machines in the series may have gone in since, so search for the quoted names rather than trusting any position or index.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, the real packed cabinet and game, a clearly marked **test stub** of `ParallaxLAYRAccount`, the Bonus Lab and a Test panel (T). Serve `public/` and open `/casino-machines/the-halving/`. It needs a web server (it fetches `pack.json`). `?prod` removes the test hooks (the Lab then needs `?lab=1`), `?nostudio` skips WebGL and shows the screen in 2D (the same fallback it uses automatically when WebGL is missing), `?test` opens the Test panel. |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64. `css` equals the game's head `<style>`. |
| `art/records.json` | The real records the reels are set from: the four halving blocks, the next halving, the subsidy schedule, 10 coinbase messages (with their raw coinbase hex), 30 recent blocks with pools, the tip and epoch at build time. |
| `art/sources.json` | Where every record and image came from, and the logos that still need permission (none). |
| `art/bitcoin-mark.svg` | The Bitcoin mark, taken as supplied from Bitcoin.org's `logotop.svg` (public domain). |
| `art/cabinet/*.png` | The cabinet artwork (door, marquee, bezel, split-flap board, fan grille and blades, deck buttons, breaker plate), rendered from SVG at build time. |
| `vendor/three.js` | The same three.js build the casino room uses (r128, copied from `tools/snow-crash/vendor/three.js`), for the test page only. |
| `QA.md` | What was checked and the results. |

Build sources are in `tools/the-halving/`. The engine and the LAYR adapter inside the game are copied byte for byte from Forever Twins; `tools/the-halving/verify.py` checks that against the pack inside `casino/index.html` (read only).

## 1. Add the pack

Append the object in `pack.json` to `window.PX_MACHINE_PACKS=[…]` in `public/casino/index.html`, after the last existing entry. Its position is its machine type index everywhere below.

```sh
node -e "const p=require('fs').readFileSync('public/casino-machines/the-halving/pack.json','utf8');console.log(','+p)"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It runs with the room's interfaces unchanged: `window.ParallaxLAYRAccount` (taken from `window.parent`; `acquire`, `ready`, `error`, `machine`, `openGame`, `saveGame` only, state id `the-halving`, no second balance) and `PX_CASINO_ENGINE` (`screen`, `revision`, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `refreshAccount`, `closeModal`, `stopAuto`, `fullscreen`), plus two optional extras the room may ignore: `topper` (a 1024×320 canvas) and `topperRevision()`.

## 2. The room's machine lists

1. **Presence list** (room.js): `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv', …];` → append `'halving'` at the pack's index, and in the name map beside it add `halving: 'The Halving'`. The order must match `PX_MACHINE_PACKS`.
2. **Floor positions: open question.** `buildSlots` places one machine per type at `zPositions=[-7.6,-4.2,-.8,2.6,6]` on both side walls: five positions. The series bible's open question (second row, new wing, or rotation) has to be settled first.
3. **Floor glow.** In `buildSlots`: `glowSprite(…, [0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd, …][type], .11)` → append `0xffd23f` at the pack's index.
4. **Machines panel copy.** After the last machine button:
   ```html
   <button class="machine-choice" data-machine-type="N" style="--machine-color:#1b1d20;--machine-accent:#ffd23f"><b>The Halving</b><small>Bitcoin's halvings · a brutalist mining rig</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   (`N` is the index from step 1.)
5. The name plaque (`pxSign(...)`) and the 2.6 m scaling are automatic. Named parts: `screenMesh`, `core` (the steel frame turning round the split-flap topper; the room already turns `core` at 0.32 rad/s), `lever` (the red industrial breaker on the right tower; pivots on `rotation.x`, so the room's `sin(u·π)·angle` pull snaps it down and back), `spinPhysical` (the amber MINE cap: a group that sinks into its sleeve; the room already sets its `position.z` from `mechanics().spinZ`, which the game now reports while MINE is pressed, 0 to −0.04, so the room shows the press with no change), and deck buttons with actions `spin` (MINE), `betUp` (+HASH), `betDown` (−HASH), `auto` (AUTO-MINE), `pays` (SCHEDULE). Every lever part also carries `action: 'spin'`, so clicking the breaker spins.

## 3. Optional: the live split-flap topper, fans and LEDs

Without any room change the topper's flap board shows a baked texture, **NEXT HALVING · BLOCK 1,050,000**, which is always true. To show the live count of blocks to the halving (and the Epoch Pot), map the game's topper canvas onto the `flapBoard` part where the room already binds the screen texture (in the function that creates `machineEngines` entries, after the `px-screenMesh` block):

```js
const flap = m.model.getObjectByName('px-flapBoard');
if (flap && api.topper) { const t = new THREE.CanvasTexture(api.topper); t.generateMipmaps = false; t.minFilter = t.magFilter = THREE.LinearFilter;
  flap.material = flap.material.clone(); flap.material.map = t; flap.material.needsUpdate = true; engine.topperTexture = t; engine.topperRevision = -1; }
// and in the per-frame update beside the screen texture:
if (engine.topperTexture) { const r = engine.api.topperRevision(); if (r !== engine.topperRevision) { engine.topperRevision = r; engine.topperTexture.needsUpdate = true; } }
```

**The main breaker.** Every spin swings the lever down to OFF and back to ON (the room already does this from `mechanics().lever`). The game also browns its own screen out for a moment at the bottom of the swing and brings it back with a flicker, so that part shows in the room with no change. `mechanics()` additionally reports `power` (0–1: it drops to near 0 when the contacts open about 300 ms into the 900 ms pull, and flickers back about 560 ms in), `breaker` (`'on'` or `'off'`) and `spark` (0–1, the arc as the contacts open). The test page uses them for the rest of the effect, which a room can copy if wanted:
- `breakerLamp`: the indicator window on the breaker plate. Baked as a green POWER ON lamp. The test page redraws it live as a canvas (green POWER ON → red TRIPPED with the supply bar falling → amber RESTORING → POWER ON).
- `lit`: the backlit marquee. Multiply its material colour by `.22 + .78 × power`, and likewise the `flapBoard`.
- LEDs and fans: multiply the LED colour by `power`, and let the fans coast down and spin back up with a smoothed `power`.
- The arc: when `spark > 0` on a new lever id, burst ~50 additive blue-white points from just inside the lever hub (lever position + (−0.085, −0.03, 0.16)), with a small flash sprite and a short-range point light scaled by `spark`.

**The other push buttons.** SCHEDULE, −HASH, +HASH and AUTO are `buttonCap` groups (the yellow collars stay put). `mechanics().buttons` gives how far each is pressed, 0–1, keyed by its action (`spin`, `betUp`, `betDown`, `auto`, `pays`). A press is a 270 ms stroke, recorded whenever the action comes in from the cabinet, the bar, a key, or auto-mine pressing MINE. To show the press in the room, set each `px-buttonCap` group's `position.z` to its home z − 0.03 × `buttons[group.userData.pxMachineAction]`.

Two more roles the test page animates and the room may ignore: `fan` (eight ASIC fan blade discs; rotate `rotation.z`, faster while `mechanics().leds > .55`) and `leds` (amber LED rings, strips and the topper beacon; set the material colour from `mechanics().leds`, 0–1, which pulses with each spin and on wins). Ignored, they simply stay lit.

## 4. Fullscreen hand-over (`pxMachineFullscreen`)

The game owns its fullscreen: its screen fills the view and every control except the lever is on a bottom bar (MINE, −/+ HASH, MAX HASH, AUTO-MINE, TURBO, SCHEDULE, FAIR PLAY, RECORDS, EPOCH POT, LOG, LAYR, SETTINGS, SOUND, VOLUME, the gamble's ×2 DOUBLE and ½ HALVE, COLLECT, LAB when enabled, EXIT). Change the room's handler to:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=getActiveEngine()?.api?.fullscreen;                     // the seated machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}                                     // The Halving (and any pack that offers it)
  /* existing behaviour for the other machines */
};
```

How it works inside the pack (same as Snow Crash and Who Is Satoshi?): it restyles its own `window.frameElement` (the hidden `.pxLogicFrame`) with inline `!important` styles, then calls the Fullscreen API on it, staying a fixed full-viewport layer where the API is missing (iPhone Safari). `Esc` or EXIT leaves and restores the frame. `deactivate()` exits fullscreen first. Panels are the game's own native dialogs, so they work inside fullscreen.

## 5. Things the room already does that this machine relies on

- `pxLiteDocument` looks for `screen=canvas(2800,1920)`: present, once.
- `pxRlPatch` (round log) matches `GAME_ID` by id. `the-halving` is not a known id, so spins are not in the room's round log until its table is extended. Nothing breaks.
- `pxRafShim` pumps frames for the hidden frame. The game paces itself: the block ticker scrolls at about 20 fps when idle, animations run near 30 fps, and it measures its own draw time and always leaves at least as long again idle, so a slow phone or a software renderer still answers taps and the host between frames.
- **Network** (all read-only, all optional):
  - Bitcoin tip height: `https://mempool.space/api/blocks/tip/height`, falling back to the Hiro API's burn blocks via `https://xtrata.xyz/hiro/mainnet/extended/v2/burn-blocks?limit=1`, then `https://api.hiro.so`. Read on activation and every 60 s while the machine is active.
  - Latest blocks and pools: `https://mempool.space/api/v1/blocks`.
  - Forever Twins register and helper events (the Epoch Pot's twin count): `xtrata.xyz` as the other machines do.
  - On a failed read the last known values are shown marked **STALE** (cached in `localStorage` under `xtrata.thehalving.live`), never a guess; with no read at all it falls back to the values bundled at build (tip 974,196). A stale tip never rolls the Epoch Pot's period over.

## 6. The Bonus Lab in the casino

Hidden for players. It appears only with the developer flag `?lab=1` on the casino URL (testnet LAYR). L opens it, as do Settings and the bar's LAB button. It swaps in a separate practice game (10,000 practice LAYR, its own meters and pot) running on the raw engine; nothing touches the LAYR account, saved game, jackpot meters, Epoch Pot or statistics, and its rounds are marked LAB in History. Items: Halving Cycle, Halving Cycle + retrigger, Coinbase Messages, Hashrate, Hashrate full grid (→ 21 Million), 21 Million (centre row), Halve or Double win and loss, scatter pays of 3/4/5, and two machine events: **Halving Day** (the topper counts down its last blocks to 1,050,000, the subsidy halves and the coin splits; no LAYR) and **Epoch snapshot** (the difficulty adjustment closes the Epoch Pot and divides it per twin; display only). Options: bet level, Seeded (seed field) or Random, Auto-advance, Run, Replay last, Run all. Each run passes a scripted rng to the engine's own `start(state, rng)`; the engine is never edited.

## 7. Holder layer (version 1: display only) — the Epoch Pot

- **Pot:** 1% of every paid bet, from the house edge, stored in the game state (`pot`, `potKey` = `E<epoch>`, `lastPot`) beside the jackpot meters.
- **Period:** one Bitcoin difficulty epoch (2,016 blocks), read from the live tip; the topper and screen show the blocks left in the epoch. The period rolls only on a fresh (not stale) tip read.
- **Who shares it:** every forevered twin in every live Forever Twins collection, per twin. The screen shows the estimated share per twin; a collection whose count can't be read is "unknown", never zero.
- **Cameo royalty:** none on this machine: its reels carry no NFTs, only records.
- Snapshot, payout and claims are stubs (`HolderLayerStubs`) with `TODO(holder-layer v2)` lines.

## 8. Before it goes on the public floor

1. **Floor space** (section 2, item 2).
2. **Topper hook** (section 3) if you want the live countdown on the cabinet in the room, not only on the screen and the test page.
3. **Legal.** The pot shares machine takings with NFT holders. While LAYR is play money this is a game mechanic; on mainnet it raises licensing and securities questions. Take advice first.
4. The RTP (94.38%) is a design estimate from the engine's model and a seeded simulation, not a certified figure. The Fair Play panel says so.

## 9. Rebuilding

```sh
python3 tools/the-halving/build_records.py        # art/raw/mempool.json → art/records.json (decodes the coinbase scripts, checks BIP34 heights)
python3 tools/the-halving/model/build_model.py    # cabinet → model JSON + art/cabinet/*.png (numpy; CairoSVG, or node + sharp from the repo)
python3 tools/the-halving/build.py                # game.html → pack.json → public/casino-machines/the-halving/
python3 tools/the-halving/verify.py               # engine and adapter identical to Forever Twins; pack decodes; records decode; casino untouched
node tools/the-halving/rtp-sim.mjs 5000000        # seeded 5M-spin return check
```

To refresh the bundled chain data, re-read the blocks into `art/raw/mempool.json` (same format) and rerun `build_records.py`.
