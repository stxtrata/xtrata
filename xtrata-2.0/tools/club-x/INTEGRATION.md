# Club X: adding it to the casino later

Nothing here has been carried out. No casino file was read for writing or edited by this build (`verify.py` checks the recorded hashes).
Club X is one `PX_MACHINE_PACKS` entry plus four small edits in `public/casino/index.html`, written against the file as of 2 Nov 2026
(five machines: The Drop, Forever Twins, Deep Strata, Block Fortune, Neon Vault). Line numbers will have moved; search for the names.

## 1. The pack
`public/casino-machines/club-x/pack.json` is one pack object in exactly the existing format:
`{name:'Club X', description, color:'#15171a', accent:'#e6ff00', model, game, css}` (`model` and `game` are gzip+base64).
Append it to `window.PX_MACHINE_PACKS` (after Neon Vault, so it is index 5): `window.PX_MACHINE_PACKS=[...existing..., <contents of pack.json>]`.
Rebuild it any time with `python3 tools/club-x/build.py` (the game source is in `tools/club-x/src/game/`).

## 2. The MACH list
`const MACH = ['drop','twins','ds','bf','nv'];` is indexed by `PX_MACHINE_PACKS` order. Add `'cx'`: `['drop','twins','ds','bf','nv','cx']`.
Anything keyed on those ids (spot names `cx.1` / `cx.2`, social, tournament, jackpot hooks) then picks Club X up.

## 3. buildSlots: the floor glow and the position
In `buildSlots(W, gold)`:
- `zPositions=[-7.6,-4.2,-.8,2.6,6]` has five entries for five machines. A sixth needs a position: either extend the room, or re-space the six (for example `[-8.6,-5.5,-2.4,.7,3.8,6.9]`; check the end walls and the doorway).
- The glow colour list `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd][type]` needs a sixth colour: **`0xe6ff00`** (Club X's acid yellow).
- The cabinet is scaled to 2.6 m tall from its bounding box. Club X's crest and lasers make its bounding box taller than the others (about 6.4 units against the Halving's 5.9), so it will look slightly slimmer at 2.6 m. If that is too slim, scale from the body height instead (the part named `px-body`, if you add it) or trim the laser length in `model/build_model.py`.
- The room animates parts named `px-crest`, `px-lever`, `px-spinPhysical` (and `core`, `recordGroup`, `armPivot` for others): Club X uses `crest` (the turning mirror X), `lever` (the fire-door push bar) and `spinPhysical` (DROP). The extra parts `lasers`, `haze` and `leds` are decorative and animate only if the room (or the test page, which does) looks them up by name.

## 4. The machines panel copy
Wherever the machines panel / directory lists the five machines (name, one-line description, accent), add:
`Club X · "Chemical X · follow the chalk X to the warehouse" · accent #e6ff00`. Suggested longer line: *"London, 1991. Follow the chalk X. Chemical X's own works on Stacks, a Holder Pot per twin, and 10% to a cause he chooses."*

## 5. Fullscreen: hand over to the game
Club X has its own fullscreen with the bottom control bar, so the room's button should not fullscreen the whole page for this machine.
In `pxMachineFullscreen`'s click handler, before the generic `document.documentElement.requestFullscreen`, add:
```js
const eng = machineEngines.get(MACH[activeCabinet.type]);   // however the room names the active PX_CASINO_ENGINE
if (eng && eng.fullscreen) { eng.fullscreen.toggle(); return; }
```
`PX_CASINO_ENGINE.fullscreen` offers `enter()`, `exit()`, `toggle()`, `active()`. It uses the Fullscreen API on the game's own iframe and falls back to a fixed full-viewport layer (iPhone Safari). F toggles it, Esc leaves it.

## What the room must provide (all already true for the other machines)
- `window.ParallaxLAYRAccount` with `machine(id, BF)`, `openGame`, `saveGame`, `acquire`, `ready`, `error`. Club X never owns a second balance. (The test page supplies a clearly marked stub with a 10,000 LAYR play balance and a reset button.)
- The canvas-and-controls API: `PX_CASINO_ENGINE.screen` (2800×1920 canvas), `revision()`, `mechanics()`, `activate()`/`deactivate()`, `action(name)` for `spin, betUp, betDown, auto, pays, fair, fullscreen, settings, history, account, lab, records, pot`, `ui()`, `tap(x,y)`.
- **New for the topper:** `PX_CASINO_ENGINE.topper` (a 1024×320 canvas) and `topperRevision()`. Map `topper` onto the cabinet part with role `flapBoard` (the topper sign) and re-upload the texture when `topperRevision()` changes. If the room ignores it, the baked sign reads "Holder Pot / Number One jackpot / 10% to a cause Chemical X chooses". The other machines don't use this and are unaffected.
- The Bonus Lab: on the test page it is always on. In the casino it appears only with the developer flag `?lab=1` on testnet (the game checks the page URL; it is never offered to players in production).

## Art the room's network must allow
Chemical X's works are loaded at run time from the Hiro metadata API (`api.hiro.so/metadata/v1/nft/<contract>/<id>`, tried first through `xtrata.xyz/hiro/mainnet`) and the token's own image from an IPFS gateway (`ipfs.io`, `cloudflare-ipfs.com`, `dweb.link`). For the reels to show real art offline, run `python3 tools/club-x/fetch_art.py` once on a computer that can reach those hosts, then rebuild: it writes `art/bundle.json`, which the build embeds as `window.CLUBX_ART`. Without it, art loads live; a work that cannot be reached shows its name set in type on a tile (never a drawn imitation). Images load with `crossOrigin="anonymous"` so the canvas is never tainted; a gateway that sends no CORS header simply falls through to the next one.

## Holder layer (version 1: display only)
- The Holder Pot is a meter in the saved game (`state.pot`, `state.potKey`, `state.lastPot`, `state.cause`): 1% of every paid bet, from the house edge. Weekly, ISO week in UTC, closing Monday 00:00 UTC.
- At each close, 10% of the pot is recorded as set aside for the cause Chemical X chooses and the rest is shown as a per-twin share (pot ÷ forevered twins). **There is no This Is Number One helper in the Forever Twins registry yet**, so the twin count is 0 and the pot just builds; every work shows desaturated with NOT YET FOREVER. The game reads the registry (`/forever-twins/data/registry.v2.json`) and treats any live collection whose entry mentions one of the works' contracts as a twin source; a read that fails is shown as *unknown*, never as zero twins.
- Cameos: when a forevered twin sits on a winning line, its token number and Xtrata ID are in the win message and `{tokenId, collection, xtrataId, lineWin}` is stored in the spin history.
- Out of scope (named stubs and `TODO(holder-layer v2)` lines in `p9_panels.js`): snapshots, claims, paying the cause, the cameo royalty, holder spins, Forever Fund, Collection Cup.


## Official Chemical X art (supplied by Jim, 2 Nov 2026)
`art/official/cx-01..16.jpg` are 16 official Chemical X images cut from the contact sheet Jim sent (titles in `art/official/official.json` are working descriptions only). `build.py` embeds them in the game as `official:N` entries of the art bundle, so they show offline, in full colour, on the Chemical X (artifact) symbol. They are not on-chain tokens: no contract, no token id, no Xtrata id, so they never take part in the Forever Twins cameo. Four are character portraits (CX hoodie): candidates for the Wild if Chemical X wants one in place of The Mask. Several are pill mosaics and one is a bottle silhouette, which the brief's no-pills rule would normally exclude: remove their ids from `official` in `art/works.json` and rebuild if they should not be on the reels.
