# Sat Hunter: putting it into the ParallaX Casino later

**Nothing in this file has been done.** No casino file was edited. These are the steps, in order, for whoever adds the machine by hand. Names below are the ones in `public/casino/index.html` and `public/casino/room.js` as read on 2 Nov 2026 (sha256 of `index.html` at the start of this build: `830216e7…77b7`, `room.js`: `378822f9…`, all five hashes in `_claude_scratch/sat-hunter-casino-baseline.txt`). Other machines in the series may have gone in since, so search for the quoted names rather than trusting any position or index.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, the real packed cabinet and game, a clearly marked **test stub** of `ParallaxLAYRAccount`, the Bonus Lab and a Test panel (T). Serve `public/` and open `/casino-machines/sat-hunter/`. It needs a web server (it fetches `pack.json`). `?prod` removes the test hooks (the Lab then needs `?lab=1`), `?nostudio` skips WebGL and shows the screen in 2D (the same fallback it uses automatically when WebGL is missing), `?test` opens the Test panel. |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name: 'Sat Hunter', description, color: '#2a1a10', accent: '#00a6fb', model, game, css}`. `model` and `game` are gzip + base64. `css` equals the game's head `<style>`. |
| `art/records.json` | Every real sat on the reels (also embedded in the game as `window.SAT_RECORDS`): ten symbol pools of 8 to 26 records, 21 Hunt block ranges with their finds, the Mythic sat 0 with the genesis block data, 68 sat numbers for Odd Sat or Even Sat, 11 story sats for the Vault tubes, the 2009 timeline, and the definitions shown in the RARITY panel. |
| `art/sources.json` | Every data source: Bitcoin Core's subsidy rule, the sat numbering and naming algorithm (Ordinal Theory Handbook), the Patoshi block list, the pizza transaction facts, the genesis block; each symbol's records; and `logosNeedingPermission` (empty: the only marks are the owner's own Xtrata mark and ParallaX wordmark). |
| `art/cabinet/*.png` | The cabinet artwork (oak, brass, felt, drawers, door, marquee, bezel, topper plate, side tapes, deck labels), rendered at build time. |
| `vendor/three.js` | The same three.js build the casino room uses (r128, copied from `tools/snow-crash/vendor/three.js`), for the test page only. |
| `QA.md` | What was checked and the results. |

Build sources are in `tools/sat-hunter/`. The engine and the LAYR adapter inside the game are copied byte for byte from Forever Twins; `tools/sat-hunter/verify.py` checks that against the pack inside `casino/index.html` (read only) and against the saved copy in `_claude_scratch/sat-hunter/`.

## 1. Add the pack

Append the object in `pack.json` to `window.PX_MACHINE_PACKS=[…]` in `public/casino/index.html`, after the last existing entry. Its position is its machine type index everywhere below.

```sh
node -e "const p=require('fs').readFileSync('public/casino-machines/sat-hunter/pack.json','utf8');console.log(','+p)"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It runs with the room's interfaces unchanged: `window.ParallaxLAYRAccount` (taken from `window.parent`; `acquire`, `ready`, `error`, `machine`, `openGame`, `saveGame` only, state id `sat-hunter`, no second balance) and `PX_CASINO_ENGINE` (`screen`, `revision`, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `refreshAccount`, `closeModal`, `stopAuto`, `fullscreen`), plus four optional extras the room may ignore: `topper` (a 1024×320 canvas) with `topperRevision()`, and `counter` (a 256×1024 canvas) with `counterRevision()`.

## 2. The room's machine lists

1. **Presence list** (room.js): `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv', …];` → append `'sathunter'` at the pack's index, and in the name map beside it add `sathunter: 'Sat Hunter'`. The order must match `PX_MACHINE_PACKS`.
2. **Floor positions: open question.** `buildSlots` places one machine per type at `zPositions=[-7.6,-4.2,-.8,2.6,6]` on both side walls: five positions. The series bible's open question (second row, new wing, or rotation) has to be settled first.
3. **Floor glow.** In `buildSlots`: `glowSprite(…, [0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd, …][type], .11)` → append `0x00a6fb` at the pack's index.
4. **Machines panel copy.** After the last machine button:
   ```html
   <button class="machine-choice" data-machine-type="N" style="--machine-color:#2a1a10;--machine-accent:#00a6fb"><b>Sat Hunter</b><small>Every sat has a story · a Victorian assay bench</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   (`N` is the index from step 1.)
5. The name plaque (`pxSign(...)`) and the 2.6 m scaling are automatic. **Named parts** (model roles, found by `getObjectByName('px-<role>')`):

   | Part | What it is | What the room does |
   | --- | --- | --- |
   | `screenMesh` (once) | the game screen under a sheet of specimen glass | binds `PX_CASINO_ENGINE.screen` as its texture (already done for every machine) |
   | `crest` | the big brass jeweller's loupe turning slowly over a glowing sat: the topper | turn it on its own clock (the room already turns the old `core` part at 0.32 rad/s; do the same for `crest`, about the Y axis) |
   | `topperPlate` | the small plate under the loupe | optional live canvas: `topper` (section 3) |
   | `counterL`, `counterR` | the two side tapes | optional live canvas: `counter` (section 3) |
   | `spinPhysical` | the HUNT button's cap | animated by the room like every other machine |
   | `lever` | the brass gold-panning rocker handle on the right; pivots on `rotation.x`, so the room's `sin(u·π)·angle` pull rocks it down and back | pulled by the room; it also carries `action: 'spin'` |
   | `leds` (9 nodes) | the blue glass lamps | set the colour from `mechanics().leds` (0 to 1); ignored, they stay lit |

   Deck buttons carry the actions `spin` (HUNT), `betUp` (+SATS), `betDown` (−SATS), `auto` (AUTO-HUNT) and `pays` (RARITY). The lower door reads EVERY SAT HAS A STORY beside the Xtrata mark (drawn from the supplied `xtrata.svg`, not redrawn); the ParallaX wordmark is small on the marquee foot; the marquee reads SAT HUNTER.

## 3. Optional: the live topper plate and side counters

Without any room change the topper plate and the side tapes show their baked textures. To show the game's live canvases, map them where the room already binds the screen texture (in the function that creates `machineEngines` entries, after the `px-screenMesh` block):

```js
const live = (name, canvas) => {
  const part = m.model.getObjectByName('px-' + name); if (!part || !canvas) return null;
  const t = new THREE.CanvasTexture(canvas); t.generateMipmaps = false; t.minFilter = t.magFilter = THREE.LinearFilter;
  part.material = part.material.clone(); part.material.map = t; part.material.needsUpdate = true; return t;
};
engine.topperTexture = live('topperPlate', api.topper);          engine.topperRevision = -1;
engine.counterTextures = [live('counterL', api.counter), live('counterR', api.counter)].filter(Boolean); engine.counterRevision = -1;
// and in the per-frame update beside the screen texture:
if (engine.topperTexture) { const r = engine.api.topperRevision(); if (r !== engine.topperRevision) { engine.topperRevision = r; engine.topperTexture.needsUpdate = true; } }
if (engine.counterTextures && engine.counterTextures.length) { const r = engine.api.counterRevision(); if (r !== engine.counterRevision) { engine.counterRevision = r; engine.counterTextures.forEach(t => { t.needsUpdate = true; }); } }
```

`topperPlate`, `counterL` and `counterR` are each a single mesh, so cloning its material is enough. The test page does exactly this (and also lights the plate and tapes a little, since they are meant to glow). The game redraws `topper` when the Mythic meter or the shown sat changes (about once a second at rest, about 30 fps while it animates) and `counter` about 20 times a second while motion is allowed; both bump their revision when they do, so the room only re-uploads what changed. The topper shows the loupe over a glowing sat, the Mythic meter for the current bet level, the Holder Pot with its period countdown and a real sat on the bench; the side tapes scroll real sat numbers past a reading window, and during the Lab's **Rare find** event they ease to a rare sat, stop and glow.

## 4. Fullscreen hand-over (`pxMachineFullscreen`)

The game owns its fullscreen: its screen fills the view and every control except the lever is on a bottom bar (HUNT, −/+ SATS, MAX SATS, AUTO-HUNT, TURBO, RARITY, FAIR PLAY, SATS, HOLDER POT, LOG, LAYR, SETTINGS, SOUND, VOLUME, the gamble's EVEN SAT and ODD SAT, COLLECT, LAB when enabled, EXIT). Every target is at least 44 px and the bar keeps clear of the safe areas (notch, home bar). Change the room's handler to:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=getActiveEngine()?.api?.fullscreen;                     // the seated machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}                                     // Sat Hunter (and any pack that offers it)
  /* existing behaviour for the other machines */
};
```

How it works inside the pack: it restyles its own `window.frameElement` (the hidden `.pxLogicFrame`) with inline `!important` styles, then calls the Fullscreen API on it; where the API is missing (iPhone Safari) it stays a fixed full-viewport layer. **F** toggles it, **Esc** or EXIT leaves and restores the frame (the browser handles Esc when the API is in use; the game handles it in the fixed-layer fallback). `deactivate()` exits fullscreen first. Panels are the game's own native dialogs, so they work inside fullscreen.

## 5. Things the room already does that this machine relies on

- `pxLiteDocument` looks for `screen=canvas(2800,1920)`: present, once.
- `pxRlPatch` (round log) matches `GAME_ID` by id. `sat-hunter` is not a known id, so spins are not in the room's round log until its table is extended. Nothing breaks.
- `pxRafShim` pumps frames for the hidden frame. The game paces itself: idle animation runs at about 20 to 30 fps, and it measures its own draw time and always leaves at least as long again idle, so a slow phone or a software renderer still answers taps and the host between frames.
- **Network: none.** Sat Hunter makes no request of any kind while it runs. Every sat, block, link and fact is bundled in the game, so there is no live read to fail or go stale; the check links on the SATS panel open ordinals.com in a new tab only when a player clicks one.

## 6. The Bonus Lab in the casino

Hidden for players. It appears only with the developer flag `?lab=1` on the casino URL (testnet LAYR). **L** opens it, as do Settings and the bar's LAB button; the test page has it always on. It swaps in a separate practice game (10,000 practice LAYR, its own meters and pot) running on the raw engine; nothing touches the LAYR account, saved game, jackpot meters, Holder Pot or statistics, and its rounds are marked LAB in the log. Items: Satoshi's Stash (free spins), Stash + retrigger, Block 9 Vault (pick), The Hunt (hold and respin), The Hunt full grid (→ Mythic jackpot), Mythic jackpot (centre row), Odd Sat or Even Sat win and loss, scatter pays of 3/4/5, and two machine events: **Rare find** (the side counter pauses and glows as a rare sat passes; no LAYR) and **Period snapshot** (the Holder Pot closes and is divided among linked wallets; display only). Options: bet level, Seeded (seed field) or Random, Auto-advance, Run, Replay last, Run all. Each run passes a scripted rng to the engine's own `start(state, rng)`; the engine is never edited.

## 7. Holder layer (version 1: display only), the Holder Pot

- **Pot:** 1% of every paid bet, from the house edge, stored in the game state (`pot`, `potKey` = `W<Monday date>`, `lastPot`) beside the jackpot meters.
- **Period:** one UTC week, Monday 00:00 UTC to Monday 00:00 UTC, from the device clock; the screen and topper show `PERIOD ENDS IN 3d 4h`. There is no chain read.
- **Who shares it:** linked wallets that hold an uncommon or rarer sat, one share per wallet. Wallet linking and reading a wallet's sats need a server with an ord index, so they are named stubs with `TODO(holder-layer v2)` lines: `linkBitcoinWallet()` and `readWalletSats()` (in `p4_live.js`) and `recordCameos()` (always `[]`: no NFTs on these reels, so no cameo royalty). The machine says **WALLET LINKING: NOT LIVE YET** and **SHARE PER WALLET: UNKNOWN**, never "0 wallets". The Test panel has a linked-wallets sample (none / some / many) that only changes the displayed share.
- Snapshot, payout and claims are stubs (`HolderLayerStubs`, exported as `window.SatHunter.holderLayerStubs`).

## 8. What is stubbed or not yet checked

- **Every sat is `verified: false`.** The numbers are computed offline from the subsidy schedule with ordinal theory's numbering, and `verify.py` recomputes every block, offset, degree, name, rarity and tag independently. They have not yet been opened on ordinals.com from the build machine, so the SATS panel marks each one **not yet checked** next to its check link. Opening them (and setting `verified: true`) is the way to clear the label.
- **Pizza sats have no sat numbers yet.** The tiles carry the verified transaction facts (tx `a1075db5…5d48d`, block 57,043, 22 May 2010) and read SAT RANGE: PENDING INDEX. `build_records.py` uses `art/pizza-ranges.json` when it exists (made by `fetch_pizza.py` on a machine that can reach ordinals.com; not written yet).
- **Patoshi list:** the Nakamoto sats use the first 26 heights of the 59-height subset carried by Who Is Satoshi? (`bensig/patoshi-addresses` @ `414637c`).
- Holder layer: see section 7.

## 9. Before it goes on the public floor

1. **Floor space** (section 2, item 2).
2. **Live canvases and the loupe** (sections 2 and 3) if you want them on the cabinet in the room, not only on the screen and the test page.
3. **Check the sats** on ordinals.com (section 8).
4. **Legal.** The Holder Pot shares machine takings with holders. While LAYR is play money this is a game mechanic; on mainnet it raises licensing and securities questions. Take advice first.
5. The RTP (94.38%) is a design estimate from the engine's model and a seeded simulation, not a certified figure. The Fair Play panel says so.

## 10. Rebuilding

```sh
python3 tools/sat-hunter/build_records.py         # computes art/records.json (self-checks the supply, sat 0's name, known rarities)
python3 tools/sat-hunter/model/build_model.py     # cabinet → model/sat-hunter-model.json + art/cabinet/*.png
python3 tools/sat-hunter/build.py                 # game.html → pack.json → public/casino-machines/sat-hunter/
python3 tools/sat-hunter/verify.py                # engine and adapter identical to Forever Twins; pack decodes; every sat recomputed; casino untouched
node tools/sat-hunter/rtp-sim.mjs 5000000         # seeded 5M-spin return check, must land within 0.3 of 94.38%
```
