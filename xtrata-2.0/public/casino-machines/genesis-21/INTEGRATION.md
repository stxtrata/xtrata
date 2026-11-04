# Genesis 21: putting it in the casino

**Status: written down, not carried out.** Nothing in `public/casino/` (or any other casino file) was edited to build this machine. Everything here lives in `public/casino-machines/genesis-21/`. Do these steps by hand when you are ready; each says what to search for, because line numbers move while other machines are being built.

Machine slug `genesis-21`. Room id (for the cabinet spots and round log) `g21`. Accent `#5546ff`.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` | Self-contained test page. Plays only Genesis 21: small 3D studio, cabinet view, screen view, full screen, a stub LAYR account, a hidden Test panel. Opens from `file://` or any static server. |
| `pack.json` | The machine as one `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`; `model` and `game` are gzip + base64. Same format as the five packs already in the room. |
| `art/` | `sources.json` (every image's source), `twins/` (30 real twin images bundled in the game), `brand/` (the Xtrata mark and the ParallaX wordmark, exactly as supplied), `README.md` (what could and could not be fetched). |
| `src/` | The sources the pack was built from, and the RTP simulator. See `src/README.md`. |
| `tools/fetch-art.mjs` | Run once on a machine with open internet access to fetch the art for the six collections that could not be fetched here. |

## The engine

The maths is the Block Fortune v2 engine (`BF`), copied byte for byte. It is identical, as text, to the engine inside the Forever Twins, Block Fortune and The Drop packs now in the room (`src/qa/engine-identity.txt`). Only names, art, sound, copy and the cabinet differ. Design RTP is 94.38 %. Seven 5,000,000-spin seeded runs (`src/qa/rtp-*.txt`) gave 93.93, 94.12, 94.14, 94.24, 94.31, 94.47 and 94.48 %, mean 94.24 %, which is within sampling error of 94.38 % (the jackpot is rare and swings a 5M run by about ±0.3 %).

## Steps

### 1. Add the pack
In `public/casino/index.html` find `window.PX_MACHINE_PACKS=[`. Append the contents of `pack.json` as one more element (comma, then the object). The array order sets each machine's `type` number, so Genesis 21 becomes `type = the old length` (5 today: The Drop 0, Forever Twins 1, Deep Strata 2, Block Fortune 3, Neon Vault 4, Genesis 21 5). The room decodes `model` and `game` on load, so this adds about 0.9 MB to the page.

### 2. Add it to the cabinet row (`buildSlots`)
Find `function buildSlots(W,gold)`.
* `zPositions=[-7.6,-4.2,-.8,2.6,6]` is one z per machine type, on both walls (left wall = first half of `room.machines`, right wall = second half). Add a sixth value. The spacing is 3.4 m, so the next slot is `9.4`. The room is 22 m deep (z ±11); a cabinet at 9.4 still clears the end wall. A seventh would not fit at that spacing, and the series brief already lists the floor layout (a second row or a new wing) as an open question, so this is your call.
* The glow list in the same function, `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd][type]`: append `0x5546ff`.
* `occupiedIndex=Math.floor(Math.random()*zPositions.length*2)` picks which cabinet is shown as "In use"; it grows with the list by itself.
* The cabinet is scaled by the room to 2.6 m tall and is not re-centred; the model is built so its origin sits under the cabinet.

### 3. Add it to the room's machine list
Find `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv'];` (in the block that begins "room.js (beside this page) talks to the live room service"). Append `'g21'`.
Two lines below, `const machineSpot = (m) => MACH[m.type] + '.' + (m.index < 5 ? 1 : 2);` has the old pack count written in as `5`. Change it to `m.index < PX_MACHINE_PACKS.length` so the second wall's cabinets get spot `.2`.

### 4. Machines panel
Find the panel behind `#machinesButton` (search `machine-choice`). Add one button after the last one, with the next `data-machine-type` number:

```html
<button class="machine-choice" data-machine-type="5" style="--machine-color:#1a1250;--machine-accent:#5546ff"><b>Genesis 21</b><small>The 2021 Stacks NFT machine · Mainnet Launch, Boombox and Proof of Transfer</small><em>PLAY THE MACHINE ↗</em></button>
```

(`--machine-color` and `--machine-accent` are `color` and `accent` from `pack.json`; the description text is yours to trim, `pack.json` carries a shorter one.)

### 5. Spectator and round-log patches (widen two regular expressions)
`pxRlPatch` and `spectDocument` both look for `GAME_ID='([a-z-]+)', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF)`. Genesis 21's id is `genesis-21`, which has digits, so the pattern does not match and those two patches skip it (the machine still plays; spectating it and its round log do not work). Change `[a-z-]+` to `[a-z0-9-]+` in both. In `pxRlPatch` also add `'genesis-21':'g21'` to the `ids` map (`{'the-drop':'drop','forever-twins':'twins',...}`). Both patches only act when exactly one match exists, which is true for Genesis 21.

### 6. Room service (the people, the spots)
`functions/lib/casino-room.ts` has `SPOTS` (the list that includes `'drop.1'` … `'nv.2'`) and `MACHINE_IDS = ['drop','twins','ds','bf','nv']`. Add `'g21'` to `MACHINE_IDS` and `'g21.1'`, `'g21.2'` to `SPOTS`. Until then, the machine plays but visitors at it are not shown to others. This is server work and was not touched.

### 7. Full screen (hand-over)
The room's `#pxMachineFullscreen` button, and the `F` key handler that clicks it, currently call `document.documentElement.requestFullscreen()` on the whole room page. For Genesis 21 the game has its own full-screen mode (the screen fills the view, a bottom bar carries every control except the lever). Hand over like this:
* On the button (and on `F`), when the open machine's engine has `api.fullscreen`, call `api.fullscreen(!api.isFullscreen())` instead of the room page's own request.
* The game runs inside the room's hidden logic iframe, so that iframe has to be visible while the game is in full screen. The game tells the room with `window.parent.postMessage({type:'px-fullscreen', machine:'genesis-21', on:true|false}, '*')`. In the room, listen for it: on `on:true` give that iframe `position:fixed; inset:0; width:100vw; height:100dvh; z-index:<above the room>` and focus it; on `on:false` put it back where it was. The test page does exactly this (`#game.fs` and the `message` listener in `index.html`), so copy it from there.
* Inside the iframe the game asks the browser for real full screen (`requestFullscreen` on its own document; the iframe needs `allow="fullscreen"`) and falls back to a fixed full-viewport layer where the API is missing (iPhone Safari). `Esc` leaves it; the bar's Exit does too. If the iframe is created without `allow="fullscreen"`, the game quietly uses the fixed layer.
* Menus (Roadmap, Fair Play, History) open inside the full-screen layer and work there; they are the game's own dialogs.

### 8. Things to leave alone
* Do not define `window.G21_TEST_BUILD` anywhere in the casino. It is how the test page switches on the Test panel and the forced-spin hooks; without it they are off and cannot be reached.
* The game reads `window.parent.ParallaxLAYRAccount` (the room's account) exactly as the other machines do. The stub in `index.html` is a test-only stand-in.
* No change is needed to `npcGameDocument` or `pxLiteDocument`: the game contains the strings they look for (`<script>/* One existing LAYR account`, `ac.destination`, `window.PX_CASINO_ENGINE={`, and the `canvas(2800, 1920)` screen line).
* The jackpot, free-spin, pick, hold-and-respin and gamble scenes are drawn entirely on the game's own screen canvas, so the room needs no hook for them. The room's `crest` (the gold "#1" trophy) and `lever` animations work as for the other cabinets.

## After you paste it in: checks
1. The room loads with six machine types and no console errors; the new cabinet shows "Genesis 21" on its plaque and a purple floor glow.
2. Sit at it: spin, bet −/+, Auto, Roadmap, Turbo, Sound, History all work from the room's controls.
3. `F` opens full screen; every control is on the bar; `Esc` leaves it.
4. A reload in the middle of a bonus resumes it (the engine keeps the state in the shared account).
5. Spectate it from another browser (needs steps 5 and 6).

## Holder layer
Version 1 shows meters only (the holder pot, week number and per-twin figure in the top right of the screen). Nothing is paid out and the engine does not read it, so it cannot change any result or the RTP. Paying holders needs a holder snapshot and a payout mechanism, which is a separate build.

## What could not be checked here
No real GPU, touch screen or iPhone was available. The Chromium used for checking draws WebGL in software, so frame rates mean nothing, and iOS full screen (the fixed-layer fallback) was checked only by switching the Fullscreen API off. Real-device checks are listed in the report that came with this build.
