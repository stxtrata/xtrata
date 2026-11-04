# Plebs & Legends: putting it in the casino

**Status: written down, not carried out.** Nothing in `public/casino/` (or any other casino file) was edited to build this machine. Everything lives in `public/casino-machines/plebs-legends/`. Do these steps by hand when you are ready; each says what to search for, because line numbers move while other machines are being built.

Machine slug `plebs-legends` (the game's `GAME_ID`). Room id for cabinet spots and the round log: `pl`. Accent `#ff2b2b`.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` | Stand-alone test page. Plays only this machine: the real cabinet in 3D (Cabinet view and Screen view), lever, deck buttons, the machine's own menus and bonus bar, Fullscreen, a stub LAYR account, and a hidden Test panel (`?test`, the `T` key, or triple-click the title). Opens from `file://` or any static server. |
| `pack.json` | The machine as one `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`; `model` and `game` are gzip + base64, the same format as the packs already in the room. |
| `pack.js` | The same JSON as `window.PL_TEST_PACK=...;`, only so the test page can read it from `file://`. Not for the casino. |
| `vendor/three.r128.min.js` | three.js r128, copied unchanged from the room's own inline copy, so the test page draws the cabinet the way the room does. Not for the casino. |
| `art/` | `sources.json` (the source of every image), `logos-needing-permission.md`, `img/` (the twin art bundled in the game), `xtrata-logo.svg` and `parallax-casino-wordmark.svg` (both exactly as supplied). |
| `seats.json` | The opt-in seat list. Ships with nobody seated. |

## The engine

The maths is the Block Fortune v2 engine (`BF`), byte for byte the one in Forever Twins (checked as text). 94.38 % design RTP, 20 lines, bets 20 / 40 / 100 / 200 / 500, free spins 8 +4 (cap 24, 2x), Pizza Day picks 1,2,2,3,4,5,8,10,15, Signed hold-and-respin values 1,2,3,5,10 at 1 in 25, jackpot seed 500x plus 2 %. A seeded 5,000,000-spin run gave 94.27 %.

## Steps

### 1. Add the pack
In `public/casino/index.html` find `window.PX_MACHINE_PACKS=[`. Append the contents of `pack.json` as one more element. The array order is each machine's `type` number, so this becomes `type = the old length`. Adds about 2.2 MB to the page.

### 2. Add it to the cabinet row (`buildSlots`)
Find `function buildSlots(W,gold)`.
* `zPositions=[-7.6,-4.2,-.8,2.6,6]`: add one more z. The obvious next slot is `9.4`, but the corner plants sit near `(±11, 9.7)`, so use `8.9` (or look at the floor first). A cabinet at 8.9 is 2.1 m from the end wall at z 11.
* The glow list `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd][type]`: append `0xff2b2b`.
* The cabinet is scaled by the room to 2.6 m tall; the model's origin sits under the cabinet.
* If another machine has already added a sixth entry, add yours after it and keep `type`, `zPositions` and the glow list in the same order.

### 3. The cabinet's moving parts
The model has these roles (they become `px-<role>` names): `screenMesh`, `crest` (the microphone, which turns like the other crests), `onAir` (the ON AIR lamp), `lever`, `spinPhysical`, plus deck buttons carrying the actions `spin`, `pays`, `betDown`, `betUp`, `auto`.
* In `buildSlots` the animation list is `['crest','recordGroup','core','lever','spinPhysical','armPivot']`. `crest` and `lever` and `spinPhysical` already work. Add `'onAir'` to that list if you want the lamp to follow the game.
* In `updateCasinoMachines`, `live = api.mechanics()` already carries `live.lamp` (true while a spin runs or a win is showing). The test page's version, in `index.html` (`lamps` and the loop), clones the lamp's materials and dims or lights them. Copy that: it is about six lines, and it must clone the materials so the rest of the cabinet does not glow with it.
* Clicking the lever (or the big deck button) calls the `spin` action, as the room's `cabinetAction` already does for `pxMachineAction` nodes. The lever node itself has no action; the test page treats any hit under `px-lever` as `spin`. In the room, only the deck-button nodes carry actions, so lever clicks need the same one-liner in `machineSurfaceClick` if you want them.

### 4. Add it to the room's machine list
Find `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv'];`. Append `'pl'` (after any ids other machines have added). Two lines below, `const machineSpot = (m) => MACH[m.type] + '.' + (m.index < 5 ? 1 : 2);` has the old pack count written in as `5`. Change it to `m.index < PX_MACHINE_PACKS.length`.

### 5. Machines panel
Find `machine-choice` (inside `#machinesPanel`). Add one button after the last one, with the next `data-machine-type`:

```html
<button class="machine-choice" data-machine-type="5" style="--machine-color:#2a0c10;--machine-accent:#ff2b2b"><b>Plebs &amp; Legends</b><small>Talk show · real twins</small><em>PLAY THE MACHINE ↗</em></button>
```

The panel's intro text counts the machines ("Five original machines. Ten cabinets across the floor.") and the room intro says how many there are: change those numbers to match.

### 6. Round log (one id)
`pxRlPatch` already matches this game's text (`GAME_ID='plebs-legends', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF)` appears exactly once). It only skips because its `ids` map has no entry: add `'plebs-legends':'pl'` to `{'the-drop':'drop','forever-twins':'twins',...}`. `spectDocument` uses the same pattern; check whether it needs the same map entry.

### 7. Room service (the people, the spots)
`functions/lib/casino-room.ts` has `SPOTS` (`'drop.1'` ... `'nv.2'`) and `MACHINE_IDS = ['drop','twins','ds','bf','nv']`. Add `'pl'` to `MACHINE_IDS` and `'pl.1'`, `'pl.2'` to `SPOTS`. Related lists may live in `casino-ingest.ts` and `casino-progress.ts`. This is server work and was not touched. Until it is done the machine plays, but visitors at it are not shown to others. (The game also tries `/casino/room/ws` and `casino-status` when it is not inside the room; both fail quietly with a console message on the test page.)

### 8. Full screen: how the room's `pxMachineFullscreen` should hand over
The room's `#pxMachineFullscreen` button (and any F-key shortcut that clicks it) currently request full screen for the whole room page (`document.documentElement.requestFullscreen()`). This game has its own full-screen mode: the screen fills the view, and a bottom bar carries every control except the lever (spin, bet -/+, auto, pay table, fair play, history, turbo, sound with volume, gamble, skip, and exit). Hand over like this:
* When the open machine's engine API has `fullscreen`, call it instead of the room's own request. `api.fullscreen` is a function and an object: `api.fullscreen()` toggles, `api.fullscreen(true)` / `api.fullscreen(false)` enter / leave, and `api.fullscreen.enter()`, `.exit()`, `.toggle()`, `.active()`, `.onChange(cb)` do the same by name. `api.isFullscreen()` reports the state.
* The game runs in the room's hidden logic iframe, which has to be visible while the game is in full screen. The game tells its parent with `window.parent.postMessage({type:'px-fullscreen', machine:'plebs-legends', on:true|false}, '*')`. In the room, listen for it: on `on:true` give that iframe `position:fixed; inset:0; width:100vw; height:100dvh; z-index:` (above everything) `; opacity:1; pointer-events:auto` and focus it; on `on:false` put it back. The test page does exactly this (the `message` listener and `body.gfs iframe#logic` in `index.html`); copy it from there.
* Create the logic iframe with `allow="fullscreen"` so the browser's real full screen works. Without it the game uses a fixed full-window layer, which is also what iPhone Safari gets. `Esc` leaves either; so does the bar's Exit.
* Menus (pay table, fair play, history, settings) are `<dialog>`s in the game's own document and open on top of the full-screen layer, so every menu works inside full screen. Bonus scenes are drawn on the game's screen canvas and in the bar, so they work there too.

### 9. The menus and the bonus bar in the room
The game's menus and bonus bar reach the room through `api.ui().modal` and `api.ui().feature` (HTML with `data-px-source` tokens, pressed through `api.click(token)` and `api.input(...)`), exactly as for the other machines. `ui()` also returns `fullscreen` (bool) and `scene` (`{kind, stage}` while a bonus scene is showing, else `null`). The game's own scene buttons (Start, Skip, the picks) are drawn on its screen and can be tapped there with `api.tap`.

One thing to look at when you first run it: the room's on-screen button overlay (`pxOvOffers`) also copies the bonus bar's buttons onto the screen. The game already draws its own Start and Skip on the screen during a scene, so you may see them twice. If so, in `pxOvOffers` skip the `bonus` offer when `getActiveEngine().api.ui().scene` is not `null`. This was not run inside the room.

### 10. Things to leave alone
* Do not define `window.__PL_TEST__` in the casino. It switches on the Test panel and the forced-spin hooks (`PlebsLegends.test.force`); without it they are off and cannot be reached. The test page sets it only for `?test` or after you press `T`.
* The game reads `window.parent.ParallaxLAYRAccount` (the room's account) exactly as the other machines do. The stub in `index.html` is a test-only stand-in; it is the game's own local account adapter with another storage key and a 1,000,000 play-money start.
* No change is needed to `npcGameDocument` or `pxLiteDocument`: the game contains the strings they look for (`<script>/* One existing LAYR account`, one `ac.destination` connect, `window.PX_CASINO_ENGINE={`, the `canvas(2800, 1920)` screen line, and exactly two `renderer.render(scene, camera)` calls).
* The ParallaX Casino wordmark is drawn small in the screen footers and in the test page header. It is not on the 3D marquee.

## Testing every bonus in production: Bonus test

Players and testers can test each bonus round in the live casino with no setup and no risk. Open **Pay table (BIOS)** and press **BONUS TEST** at the top, or press **BONUS TEST** in the fullscreen bar (the test page also has a **Bonus test** button in its header; `PX_CASINO_ENGINE.action('bonusTest')` opens it too, and `action('test')` opens it when `__PL_TEST__` is off). Then press one of:

* **Whitepaper**: the free spins (8 spins, bonus coins)
* **Pizza Day**: the vault pick (open three boxes)
* **Signed**: the hold-and-respin chain
* **Block 0 jackpot**: the jackpot scene
* **Win, then gamble**: a small win followed by the Long or Short gamble (the preset seed ends in a loss, so it exercises the lose path)

It is a normal menu, so it works from the room, from full screen (bar: PAY TABLE) and on the test page. Each preview runs the real four stages (trigger, intro, play, summary) with the real scenes, sounds and bonus bar, and shows a red **PREVIEW · NOTHING IS SPENT OR WON** pill on the screen and **PREVIEW** in the bar. It leaves by itself about 1.4 seconds after the last scene (status line: PREVIEW OVER · NOTHING WAS SPENT OR WON).

What it guarantees:

* It plays on a practice copy of the account (balance at least 100,000, bet 100). The real balance, spins, features, free spins and saved account are not touched, and `save()` is skipped while it runs.
* It uses a pristine copy of the engine (`BF0`, taken before the room's round-log hook is applied), so previews never reach the round log, the jackpot meter, the holder pot or spectators.
* It cannot start while a spin, scene, free spin, pending feature or auto-play is active, or while the machine is locked, and it ends cleanly if the machine is deactivated or the account refreshes.
* Each button uses the same fixed seed as the test hooks, so a bonus looks the same every time. That is what makes it a test of the scene, not of the odds.

What it does not test: real account crediting. For that, play normally.

This is separate from `window.__PL_TEST__`. Keep that undefined in the casino: it would expose forced-win hooks.

## After you paste it in: checks
1. The room loads with the new machine type and no console errors; the cabinet shows "Plebs & Legends" on its plaque and a red floor glow.
2. Sit at it: spin, bet -/+, Auto, pay table, Turbo, Sound, History all work from the room's controls.
3. Trigger each bonus (or play until one lands): Whitepaper, Pizza Day, Signed and the Block 0 jackpot each run four stages (trigger, intro with one plain rules line and Start, play, summary), and Skip works at every stage.
4. Fullscreen: every control is on the bar; `Esc` leaves it; menus open inside it.
5. A reload in the middle of a bonus resumes it (the engine keeps the state in the shared account).
6. Twinned and un-twinned art: un-twinned Stacks NFTs show greyed with a NOT YET FOREVER stamp. Their images load from IPFS gateways, which could not be reached from where this was built (see `art/sources.json`).

## Holder layer
Version 1 shows meters only (holder pot, week number and per-twin figure at the top of the screen, and the Fair Play panel). Nothing is paid out and the engine does not read it, so it cannot change any result or the RTP. Paying holders needs a holder snapshot and a payout mechanism: a separate build.

## What could not be checked here
No real GPU, touch screen or iPhone was available; WebGL ran in software, so frame rates mean nothing. iPhone's fixed-layer fullscreen was checked only with the Fullscreen API switched off. The casino room itself was not run with this pack (casino files are read-only for this build), so steps 2 to 9 above are written from reading the room's code, not from a run.

## Fullscreen bar never moves

Every control in the fullscreen bottom bar keeps its exact position and size through spins, wins, gambles and bonuses (checked by sampling every button's position through a win on desktop and phone: nothing moves). Buttons that only exist at certain moments (START, SKIP, LONG OR SHORT, LONG, SHORT, KEEP WIN, the nine pizza boxes) float in a row over the bottom of the screen instead of sitting in the bar. During a bonus scene the spin, bet and auto buttons are greyed out rather than removed. The 3D deck button no longer wobbles while spinning; it stays pressed in at a fixed depth.

## Bonus animation (show juice)

The bonus scenes carry extra motion, all drawn on the machine's own 1400 x 960 screen, so it shows in the room, the screen view and fullscreen with nothing to wire up. It only decorates results the engine has already dealt; no result, balance or odds change. Reduced motion (the Backstage setting or the OS setting) switches the moving parts off.

* **Signed respins**: each respin mines for about 0.8 s (spinning hashes, a scan sweep, ticking sound), then signatures slam in one at a time with shockwaves, floating values and a small shake. A miss shatters a respin light, a reset lights all three, the last respin gets a red pulse, and sealing or filling all 15 gets a full celebration. A respin now fires by itself about 1.5 s after the previous one finishes (a bar under the panel shows the countdown). Pressing RESPIN goes sooner, and a press during an animation is queued. Turbo shortens everything.
* **Whitepaper**: paper rushes behind the reels while they turn, light streaks and a brighter frame on each spin, wins fly up (bigger and with a flash and shake above 5x and 20x the bet), the spins-left number pops, the running total ticks up, there is a 2x badge, a progress bar and a red LAST SPIN warning, and a retrigger gets a flash, shake and "+N SPINS" banner.
* **Pizza Day**: boxes bob and shine, wiggle for a beat before they open, then burst, ring and float the prize; big prizes flash and shake; ordering all three gets a banner and confetti.
* **Block 0 jackpot**: opening flash and shake, repeating shockwaves, orbiting sparks, a big finish when the count lands, and a "BLOCK 0 IS YOURS" stamp.
* **Long or Short**: a tension vignette that speeds up as the hash is drawn, a glowing price tip, then a green burst and "+stake" on a win, or a red flash, shake, falling sparks and "-stake" on a loss.
* **Every stage** has an entry burst (trigger, intro, play, summary), and the intro sets have orbiting sparks.
