# Rugged: adding it to the casino later

**Nothing here has been done.** Rugged was built standalone. No file under `casino/` (or anywhere outside
`public/casino-machines/rugged/`) was edited, and the machine is not integrated. These are the steps for whoever wires it in.

## 1. The pack entry
`pack.json` is one `PX_MACHINE_PACKS` entry in the existing format:

```
{ name: 'Rugged', description: 'Rescued Stacks art · woven back', color: '#2a1408', accent: '#b5532c',
  model: <gzip+base64 of the packed cabinet>, game: <gzip+base64 of the whole game page>, css: '<the game dialog styles>' }
```

Append it to the `window.PX_MACHINE_PACKS=[ ... ];` array in `casino/index.html` (or paste `pack.js`'s value; `pack.js` assigns
the same object to `window.RUG_PACK` and is only used by the standalone test page).

## 2. The room's lists (names in the existing code)
1. **MACH list**: add a slot for `'Rugged'` beside the other machines, with the same `name` as the pack.
2. **Floor-glow colour list in `buildSlots`**: add the accent `#b5532c`.
3. **Machines panel copy**: add one line, for example
   "Rugged: abandoned Stacks art woven back into rugs. Its pot pays rescued holders and twins the art still at risk."
4. The room holds five machine types per side today. This is the twenty-third on the plan, so it needs the second row or new wing
   the series bible leaves open.

## 3. What the room must provide (same as the other machines)
- `window.ParallaxLAYRAccount`, the real shared account. The pack only calls the methods the other machines call
  (`machine`, `openGame`, `saveGame`, `ready`, `error`, `acquire`); it never opens a second balance or wallet.
- The canvas-and-controls API the pack exposes as `window.PX_CASINO_ENGINE`: `screen`, `revision`, `mechanics`, `activate`,
  `deactivate`, `action`, `stopAuto`, `tap`, `key`, `click`, `input`, `closeModal`, `fullscreen`, `fullscreenHost`, `ui`,
  `refreshAccount`. Extra actions the pack understands: `fair`, `gamble`, `skip`, `fullscreen`, `settings`, `history`,
  `account`, `pot` (the Rescue Pot panel) and `lab` (developer flag only).
- Named parts on the model: `screenMesh`, `crest` (the flying carpet, turning on its own clock), `spinPhysical` (WEAVE),
  `lever` (the brass loom beater). Deck buttons carry `spin`, `betUp` (+KNOTS), `betDown` (−KNOTS), `auto` (AUTO-WEAVE),
  `pays` (CATALOGUE).
- The frame pump (`pxRafShim`) the room already injects into hidden frames.

### Optional room touches (the test page does both; the room works without them)
- **Magic Carpet Ride in 3D.** While `PX_CASINO_ENGINE.mechanics().show` is `{kind:'jackpot', stage:'play'}`, clone the crest's
  carpet mesh and fly it in a loop round the cabinet. See `flyer` in `index.html`.
- **Hanging rugs that change as art loads.** The two side rugs are named `sideRug` (`px-sideRug` once loaded). Every few seconds
  the host may call `window.Rugged.rugCanvas()` in the game frame and use the returned canvas as that mesh's map. It is
  cosmetic only. See `sideRugs` in `index.html`.

## 4. Fullscreen hand-over (`pxMachineFullscreen`)
The game owns its fullscreen layout and its bottom bar. The room's fullscreen button should:
1. call `PX_CASINO_ENGINE.fullscreenHost(fn)` once, where `fn(on)` shows the machine frame full-viewport (and calls the browser
   Fullscreen API with the user's own gesture) when `on`, and puts it back when not;
2. once the frame is visible, call `PX_CASINO_ENGINE.fullscreen(true)`, and on exit call `fullscreen(false)`.

`index.html` in this folder does exactly this (`enterFs` / `exitFs`) and is the reference. Without a host, the game asks for
fullscreen itself and falls back to a fixed full-viewport layer (iPhone Safari).

## 5. Test-only code
- The **TEST** panel exists only when `window.parent.PX_STANDALONE_TEST === true` or on localhost / `.test` hosts. The casino
  never sets that flag, so the panel is absent in the public room.
- The **Bonus Lab** (the L key, the LAB button) is always on the test page. In the casino it appears **only** with `?lab=1` in
  the room's URL (use it on testnet only). It plays on its own LAB balance and never touches the real LAYR, the jackpot meters,
  the Rescue Pot or the RTP statistics. Its rounds are marked LAB in History.

## 6. Holder layer, version 1 (the Rescue Pot)
- 1% of every paid bet goes into the Rescue Pot, kept in the saved game beside the jackpot meters, on a weekly UTC period. It is
  funded from the house edge and never reduces a win. The screen header shows the pot, the period and the share per twin:
  half the pot divided by the twin count read from the Bitcoin Birds helper (`inscribed-count`). If that read fails, the
  count is shown as stale or unknown, never as "no twins".
- The other half is earmarked for the Forever Fund: twinning collections on the rescued list that are not yet saved.
- Cameo records `{tokenId, xtrataId, collection, lineWin}` are written into each round's history when a twinned rug is on a
  winning line.
- `HolderRewards` in `src/game/01-core.js` holds the named stubs (`snapshotPot`, `claim`, `payCameo`, `holderSpins`,
  `foreverFund`), each with a `TODO(holder-layer-v2)`. Snapshots, payouts and refunds need a server or contract.

## 7. The rescued list
`rescued-list.json` is the list Jim approves. It currently holds Bitcoin Birds (reason: dead art link) with the evidence.
To add a collection:
1. add it with `approved:false` and its evidence;
2. once Jim approves it, run `python3 tools/fetch-art.py`, `node tools/make-art.mjs` and `node tools/build.mjs`.

A collection with no Forever Twins helper would show desaturated with NOT YET FOREVER and count towards STILL AT RISK. One
whose art can't be found anywhere is listed in `art/sources.json` under `artLost` / `twinningPriority`; its tiles would show
the dead link and ART LOST. The game reads only `RUG_ART.collections[0]` (Bitcoin Birds) for the reels today. Mixing several
rescued collections into the tiers is a small change in `buildPools` (`src/game/02-tiles.js`).

## 8. Art and permissions
`art/sources.json` lists every bundled image with its URL, its SHA-256 and what it was verified against, plus the on-chain
records. Logos that still need the project's permission:
- **Welshcorgicoin (WELSH)**: the official logo named by the token's own metadata. Ask the Welshcorgicoin community.

The Bitcoin Birds artwork belongs to its artist. The registry notes the creator has not been reached, so the art is shown
pending their OK, as on the Forever Twins page.
