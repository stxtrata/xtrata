# ParallaX Casino · Fruit Machine Room

A stand-alone 3D hall that holds every fruit machine in `public/casino-machines/`. It looks like the casino (black marble with gold veins,
brass lines, portals and pilasters, blue velvet rugs, halo chandeliers, the PARALLAX CASINO sign) and lays the machines out the way the
casino floor does: cabinets stand against both side walls facing inwards, 2.6 m tall, each with a name plaque and a floor glow.

**It is not linked to the casino.** It does not read or change anything in `public/casino/` or in any machine folder; it only fetches each
machine's `pack.json`. Open it at `/fruit-machine-room/` on any static server (it needs `casino-machines/` next to it, as in `public/`).

```
fruit-machine-room/
  index.html            the page: HUD, panels, test flags
  registry.js           THE LIST OF MACHINES (the only file to edit to add one)
  room.js               the hall, the streaming cabinets, the game hosting, walking, fullscreen, Bonus Lab
  layr-room-account.js  test LAYR account for the room (own storage keys, one balance for every cabinet)
  vendor/three.r128.min.js   the casino's own three.js build (copied from public/casino/index.html)
  vendor/brand/         the ParallaX Casino sign and wordmark, the Xtrata mark
```

## Adding a machine

1. Build the machine as usual so that `public/casino-machines/<id>/pack.json` exists.
2. Add one line to `machines` in `registry.js`, for example `{ id: 'corgi-kennel', no: 21 },`.
3. Reload. The hall grows by one bay (3.4 m) for every two machines, the pilasters, arches, chandeliers, rugs and ceiling grow with it, and the
   new cabinet gets a plaque, a floor glow, an entry in the Machines list (G) and its screen.

Order is layout: machines are placed in list order, left wall then right wall, starting at the entrance. Everything else (name, colour) is read
from the pack once it loads. Optional fields, all documented at the top of `registry.js`: `no`, `name`, `accent`, `folder`, `labAction`, `inject`, `hidden`.

A machine whose cabinet has an extra animated part can be given a small function in `registry.js`
(`FM_ROOM.extras['hot-wallet'] = (m, t, mech, nowMs) => {...}`), called every frame while its cabinet is loaded. Without one, the room animates
the standard parts the casino animates (`px-crest`, `px-core`, `px-recordGroup`, `px-lever`, `px-spinPhysical`, `px-armPivot`).

## How it works

* **Cabinets** are built with the casino's own packed-cabinet loader (geometries, textures, materials, node tree with `px-<role>` names and
  `pxMachineAction` buttons) and scaled to 2.6 m. On a desktop **every cabinet is loaded while the intro card is up** (a progress bar shows it;
  you can go in once the first four are ready and the rest keep loading) and none is ever swapped back for a stand-in. All 22 together need
  roughly 700 MB of graphics memory, so touch devices (and `?stream=1`) stream them by distance instead: a plain proxy cabinet stands in the
  hall and the real model loads when you are within about 11 m.
* **Games** run in hidden frames exactly as the casino hosts them (`PX_CASINO_ENGINE`: activate, deactivate, screen canvas as the cabinet's
  screen texture, `revision`, `mechanics`, `ui`, `click`, `input`, `tap`, `key`, the animation-frame helper for hidden frames, the touch-device
  lite document). A frame starts when you sit at a cabinet, and at most three are kept alive (the oldest idle one is stood down).
* **One balance.** `layr-room-account.js` is the casino's account adapter with its own storage keys (`xtrata.parallax.test.fruit-room.layr.v1`),
  seeded with 100,000 test LAYR. Every cabinet uses it, each machine keeps its own saved state in it. It can never read or change a real casino balance.
* **Bonus Lab and test panels are on for every machine.** `index.html` sets the test flags the games look for on their parent page
  (`PX_STANDALONE_TEST`, `PX_DEV_LAB`, `CLUBX_TEST_PAGE`, `MH_TEST_PAGE`, `NL_TEST_PAGE`, `SC_TEST_PAGE`, `SAT_TEST_PAGE`, `HALVING_TEST_PAGE`,
  `STACK_TEST_PAGE`, `WIS_TEST_PAGE`, `XO_TEST_PAGE`, `G21_TEST_BUILD`). **The casino must never set these** when this room is linked in.

## Playing

| | |
|---|---|
| Walk | `W A S D` / arrows, `Shift` runs (touch: joystick + drag to look) |
| Look | **Click the room once: the pointer disappears and the mouse looks around, no dragging** (as in the casino). `Esc` or `Q` gives the pointer back for buttons and menus; click the room to look again |
| Play a cabinet | `E`, `Enter`, `Space`, or click a cabinet (touch: tap): you are **connected where you stand** (the casino's "Play here"), so you can keep walking and looking · `E`, WALK AWAY, `Esc`, or walking more than 4 m away disconnects (a spin or bonus finishes first) |
| Machines list | `G`, walks you to any cabinet |
| At a cabinet | `Space` spin, `[` `]` bet, `T` turbo, `M` sound, `1`–`9` picks · crosshair on the cabinet's buttons, lever or screen, then click (turbo, gamble and bonus buttons are also drawn on the screen) · `Q` or MORE shows the other controls (auto, guide, Bonus Lab, full screen) and frees the pointer · `V` or CABINET VIEW shows the whole cabinet, then the screen close-up, with the pointer free; PLAY HERE goes back |
| **Full screen** | `F` or FULL SCREEN: the game's own full screen layout with every menu, panel and setting on its bottom bar |
| **Bonus Lab** | `L` or BONUS LAB (also in the Test panel): pick any bonus round or special event and play it now |
| Test panel | reset balance, reset one machine or all, jump to the first or last cabinet, stats |

### Fullscreen: four kinds of game, one button

The machines were built in four generations. The room tells them apart from their engine API and does the right thing for each:
`fullscreenHost` games (Ordinal Rush, Robot Factory, Degen City, Rare Pepe Directory, Rune Pit, Rugged, Mempool Madness, Hot Wallet) get a
full-window frame plus the browser's fullscreen, and the game lays itself out; games with `fullscreen.enter/exit` (Snow Crash, Monkey Hash,
Nine Lives, The Stack, Who Is Satoshi, Xtrata Originals, The Halving, Club X, Sat Hunter, The Archive, Plebs & Legends) and games with
`fullscreen(on)` (Genesis 21, Mooneeb, DOG Army) do their own. Esc, F and each game's own EXIT return to the room.

### Bonus Lab: how each machine is reached

The room tries, in order: the machine's own `labAction` (registry), `action('lab')`, the game's `#labBtn`, `openTest()`, `#testBtn`, `action('preview')`,
then the TEST / LAB button of the game's fullscreen bar. The result is the game's own Lab or test dialog, shown over the room and wired back to the game.

### Same controls as the casino

Walking, mouse look, crosshair, the "E to connect" prompt, Play here / Cabinet view / Screen view, the 4 m auto-disconnect, clicks on the cabinet's
surface and the on-screen turbo / gamble / bonus buttons are ported from `public/casino/index.html` (`WALK`, `tryLock` / `freeMouse`, `lookBy`,
`nearestMachineCandidate`, `handleMachineKey`, `machineSurfaceClick`, `createScreenButtons`) with the same constants (look 0.0022, drag 0.004, eye 1.6 m, walk 3, run 4.6).

## Linking it into the casino later

* The room has a closed door on its entrance wall (sign: "TO THE CASINO FLOOR"). The hall is `W = 16 m` wide, `L` long (see `FM.layout`), and its
  origin is the middle of the floor; the entrance is at `+z`.
* `room.js` is one IIFE with no globals except `window.FM` (a test/linking handle) and `window.FM_ROOM` (the registry).
* To walk through the door, add a portal in the casino and a return door here; both rooms already share the LAYR adapter interface
  (`window.ParallaxLAYRAccount`), so in the casino the real adapter is used and `layr-room-account.js` is simply not loaded.
* Remove the test flags from `index.html` for any build that is not a test build.

### Putting series machines on the /casino floor (done)

Any of the machines in `public/casino-machines/<id>/pack.json` can stand on the floor of `/casino`. Edit `floor` in
`public/casino/machine-rotation.js` (up to five ids; the default is the five built into the page), or preview with
`/casino/?floor=ordinal-rush,hot-wallet,drop,bf,nv`. A rotated-in machine uses the casino's LAYR balance, shows up in the room
service like the original five, and its paid spins feed (and can win) the one progressive jackpot. The room service accepts every
machine at all times (`functions/lib/casino-machines.ts`), so rotating needs no server deploy. The five originals still drive the
daily missions, the slot tournament and the Slot fan badge. A machine's own centre-row jackpot meters stay inside its unchanged
engine (they are part of the 94.38% return). The casino's LAYR is the local balance in the browser; the on-chain token is not built.
Note that machines 21 to 23 (Corgi Kennel, Launchpad, Pool Party) do have packs.

## Known limits

* The room has a single player and no other visitors, chat or spin cast.
* Machines 21–23 (Corgi Kennel, Launchpad, Pool Party) have prompts but no pack yet; they appear as soon as their pack and a registry line exist.
* Cabinet effects beyond the casino's standard animated parts (beacons, tickers, flap boards) are not driven yet; add an `extras` function.
