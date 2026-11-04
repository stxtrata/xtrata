# The Archive: adding it to the casino

**Status: not done. Nothing here has been applied to any casino file.** This is the list of steps to carry out by hand later. The machine lives only in this folder (`public/casino-machines/the-archive/`) and plays on its own test page (`index.html`).

| File | What it is |
|---|---|
| `index.html` | Standalone test page. One file, opens from `file://` or any web server. Hosts the machine the way the room does, plus a 3D studio, a stub play-money account and a hidden Test panel. |
| `pack.json` | One `PX_MACHINE_PACKS` entry in the room's own format: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64, `css` is raw. The same text is embedded in `index.html`. |
| `art/` | Art sources: `sources.json` (every image, where it came from, which logos need permission), `logos.json`, `ledger.json`, `degens.json`, `degens.sources.json`, `images/` (PNG copies), `brand/` (the two supplied marks, unmodified). |
| `INTEGRATION.md` | This file. |

Game size inside the pack: game 943 KB, model 3228 KB (before gzip), css 20 KB.

## 1. What the room has to provide

Nothing new. The game uses the room's interfaces and nothing else:

- `PX_CASINO_ENGINE` is the only door in (`screen`, `revision`, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `closeModal`, `stopAuto`, `ui`, `mechanics`, `refreshAccount`) plus the new `fullscreen` object (section 4).
- The game takes the room's `window.parent.ParallaxLAYRAccount` when there is one and falls back to its own embedded account only when the page has none (that is what the test page uses; its storage key is `xtrata.parallax.layr.account.v1`, value `{bank: n}`).
- The lever animation comes from `mechanics().lever` (`{id, elapsed, duration: 900, angle: 1.02}`); the deck button travel from `mechanics().spinZ`. The room's `updateCasinoMachines` already does the rest.
- Round log: the room's `pxRlPatch` finds `GAME_ID='the-archive', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF)` in the game text. That line is untouched, so adding `'the-archive':'archive'` to the `ids` map (step 5 below) is all that is needed. The test page applies the same patch and counts the calls.
- Server side: room presence and the round log use the spot ids `archive.1` and `archive.2`. The room service has to accept them (it already accepts `drop.1` … `nv.2`).

## 2. Edits to `casino/index.html` (find → replace)

Do these on a copy, then check the floor (section 3). Every find string occurs exactly the number of times shown.

| # | Find | Replace with |
|---|---|---|
| 1 | the end of the pack list: `}];</script>\n<script>(function(){` (once) | `},` + the text of `pack.json` + `];</script>\n<script>(function(){` |
| 2 | `<p>Five original machines. Ten cabinets across the floor.` | `<p>Six original machines. Twelve cabinets across the floor.` |
| 3 | `<b>Neon Vault</b><small>Bitcoin · vault bonuses</small><em>PLAY THE MACHINE ↗</em></button></div></section>` | the same text with this button added before `</div></section>`: `<button class="machine-choice" data-machine-type="5" style="--machine-color:#2b1c10;--machine-accent:#c9a46a"><b>The Archive</b><small>Stacks history · real logos, real contracts</small><em>PLAY THE MACHINE ↗</em></button>` |
| 4 | `The five designs have different bonus games.` (review rules) | `The six designs have different bonus games.` |
| 5 | `Fruit machines<small>Five designs · ten cabinets</small>` | `Fruit machines<small>Six designs · twelve cabinets</small>` |
| 6 | `Explore ten fruit machines` | `Explore twelve fruit machines` |
| 7 | `use Machines to choose any of the five games` (help panel) | `use Machines to choose any of the six games` |
| 8 | `const zPositions=[-7.6,-4.2,-.8,2.6,6];` | `const zPositions=[-7.6,-4.2,-.8,2.6,6,8.6];` (see section 3 for why 8.6) |
| 9 | `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd][type]` (floor glow colour) | `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd,0xc9a46a][type]` |
| 10 | `'neon-vault':'nv'},id=ids[m[2]];` (round-log ids, in `pxRlPatch`) | `'neon-vault':'nv','the-archive':'archive'},id=ids[m[2]];` |
| 11 | `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv'];` and its trailing comment | `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv', 'archive'];` (comment: … Neon Vault, The Archive) |
| 12 | `bf: 'Block Fortune', nv: 'Neon Vault' };` (chat game names) | `bf: 'Block Fortune', nv: 'Neon Vault', archive: 'The Archive' };` |
| 13 | `const type = ['drop', 'twins', 'ds', 'bf', 'nv'].indexOf(g);` (goMachine) | `const type = ['drop', 'twins', 'ds', 'bf', 'nv', 'archive'].indexOf(g);` |
| 14 | `(m.index < 5 ? 1 : 2)` (once) | `(m.index < 6 ? 1 : 2)` |
| 15 | `String(k.index < 5 ? 1 : 2) === idx` (twice) | `String(k.index < 6 ? 1 : 2) === idx` |
| 16 | the `REG_SPOTS` list `['drop.1', 'twins.2', 'nv.1', 'bf.2', 'ds.1', 'drop.2', 'twins.1', 'nv.2', 'bf.1', 'ds.2']` | add `'archive.1', 'archive.2'` |
| 17 | the demo list `ALL = [... 'nv.1', 'nv.2']` | add `'archive.1', 'archive.2'` after `'nv.2'` |

Also search the file once for any other count of machines (`indexOf(` on a machine-id list, `% 5`, `* 5`, `length === 10`). None was found when this list was made, but the file changes often.

Machine order matters: the pack's position in `PX_MACHINE_PACKS` is its `type` (it is the sixth, so `type` 5), `MACH[5]` is `archive`, and `m.index` counts cabinets left wall first.

## 3. Floor space (a sixth slot per wall)

The walls hold five cabinets each at z = -7.6, -4.2, -.8, 2.6, 6. A sixth at z = 9.4 collides with the planter at x = ±11, z = 9.7 and the sconce beside it. **z = 8.6 was clear in a render** (the room test was run on a scratch copy of the room, since removed), with the cabinet group at `x = ±(W/2 − .67)` facing the room like the others. The gap to the fifth cabinet becomes 2.6 m instead of the 3.4 m used between the others. Look at the gap and at the lever swing in the room before settling on 8.6.

## 4. Full screen

The game owns its full-screen mode (the fullscreen bar, the controls, the Fullscreen API with a fixed-layer fallback for iPhone Safari). It exposes `PX_CASINO_ENGINE.fullscreen = { enter(), exit(), active(), toggle() }` and tells the page when it changes with `parent.postMessage({px: 'archive-fullscreen', on: true | false}, '*')`.

The room's game frames are hidden (`.pxLogicFrame`: `left:-10000px; visibility:hidden; pointer-events:none`) so `pxMachineFullscreen` has to hand over to the game instead of fullscreening the room:

1. When the room creates the frame (`createCasinoEngine`), add `frame.setAttribute('allow','fullscreen')` and `allowfullscreen`.
2. Add a CSS rule that beats the hiding rule and the phone rule (`.pxLogicFrame.pxLite` is 160 × 136 px):
   `.pxLogicFrame.fs,.pxLogicFrame.pxLite.fs{left:0!important;top:0!important;width:100vw!important;height:100dvh!important;visibility:visible!important;pointer-events:auto!important;z-index:2147483000!important;background:#000}`
3. Route the room's full-screen button and the `F` key (`$('pxMachineFullscreen').onclick`) to `getActiveEngine().api.fullscreen.toggle()` when the active engine has `fullscreen`; keep the old document fullscreen for the other machines.
4. Listen for the message: `addEventListener('message', e => { if (e.data?.px === 'archive-fullscreen' && e.source === frame.contentWindow) frame.classList.toggle('fs', !!e.data.on) })`, and when it turns off also remove `aria-hidden`/`tabIndex` changes you made. `index.html` has a working copy (`setFs`, with a watchdog that hides the frame if `fullscreen.active()` goes false without a message).
5. **While the frame is really full screen, the rest of the page cannot be clicked** (Chromium treats the full-screen element as modal; even a popover opened above it shows but ignores clicks). Anything the room needs to show above the game must be put inside the frame's own document. The test page does this for its Test panel (a shadow-root element moved into the frame while it is full screen, moved back after). On the test page the game's TEST button posts `{px:'archive-test-panel'}` to ask for that panel; in the room (no `PX_TEST_MODE`) the same button opens the in-game Bonus preview menu instead, which lives inside the game's own dialog and so needs nothing above the frame (section 5).
6. While the frame is on top, the room can skip its own 3D rendering and the `pumpMachineFrames` call (a visible frame animates natively). The test page does both.

## 5. Testing the bonus rounds in production (Bonus preview)

The machine carries its own production-safe way to trigger and play every bonus round, with no test flags: the **Bonus preview**. It is part of the game code, so it ships inside the pack and works in the room, in fullscreen and on the test page.

**How to open it**
- Open **Pays** (the deck's CATALOGUE button, or `PX_CASINO_ENGINE.action('pays')`) and press **Try the bonus preview** at the foot of the panel. This needs no room changes: the modal is mirrored like every other game modal.
- In fullscreen, the bar's **TEST** button opens the same menu.
- Optional room hook: `PX_CASINO_ENGINE.action('preview')` opens the menu directly, so the room can add its own button.
- While it is on, a strip along the top of the machine screen says **BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR**; tapping it (also from the room's Screen view) reopens the menu.

**What it does**
- Start the preview, then pick **Rewind**, **City Mining**, **The Ledger**, **Back to Blockstack**, or **Stamp It or Shred It: win / lose**. The next spin is dealt to land that bonus, and then plays out exactly as a real one would (trigger, intro, play, summary), including Skip, reduced motion and the fullscreen bar. Options: forever twins on the reels (none, one city, all), reduced motion, refill practice chips, exit.
- It runs on **1,000,000 practice chips** in a separate game state. The real state is set aside untouched and put back on exit; `save()` is disabled meanwhile; nothing is written to the LAYR account, the saved game, the Forever Fund or the room's HUD balance.
- The preview uses `PX_PURE`, a pristine copy of the engine taken *before* the room's round-log and spin-cast hooks wrap `BF`. So preview rounds never reach `PXRoundLog` or `PXSpinCast`. (A hook that wraps `BF.start` and `BF.gamble` in place, as the test page's stub does, logged 1 round for the one real spin and still 1 after a full run through all six preview bonuses.)
- Leaving the machine (`deactivate()`), reconnecting or a new session always ends the preview and restores the real state first.
- The forcing code is only reachable from the preview menu. Outside the preview, forcing is refused. Nothing is exposed on `window`.

**Things to know**
- `ui().balance` (and anything the room shows from it) reads the practice chips while the preview is on. `ui().practice` is `true` during the preview, so the room can label or hide its own balance read-out (the test page appends "· practice chips"). The room's own HUD balance comes from the shared LAYR account and does not move.
- The line `GAME_ID='the-archive', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF)` is unchanged in shape (declared with `let` instead of `const`, so the preview can swap `E`), so the room's `PXRoundLog.hook` replacement in section 2 still matches it.
- If you would rather not show the menu to every player, hide the Pays-panel button in the game's `openRules` (or ask for a build that only shows it behind a flag). The preview cannot touch real LAYR either way.

**Test hooks for the standalone page only.** The test page also gives the game `TheArchive.test` (`force`, `setTwins`, `skip`, `reduced`, `rtp`, `state`) by setting `window.PX_TEST_MODE` before the game script runs; the casino never does, so those hooks are absent in the room. Open the test page with `?prod=1` to run it exactly as the casino will (no test hooks; the TEST button opens the Bonus preview). The engine block (`const BF`) is byte-identical to the Block Fortune v2 engine.

## 6. Limits to know about

- **Static textures.** The cabinet's printed parts (topper, deck date card, door) are pictures baked into the model, so they cannot show live numbers. The Forever Fund meter and the stacking-cycle line are drawn on the screen canvas instead.
- **On-screen button overlay.** The room draws its own see-through button layer on the screen (`createScreenButtons`). It finds the game's controls through the mirrored feature/modal DOM, so it needs no change; check it once with the bonus scenes.
- **Holder layer is meters and display only.** Every payout is a stub that returns `{ok:false, reason:'TODO…'}`. Nothing is paid, and the room must not pretend otherwise. The stubs (`HOLDER_STUBS` in the game):
  - `snapshot`: TODO(server): snapshot the twin holders at the period-end Bitcoin block and credit shares in LAYR.
  - `claim`: TODO(contract): on-chain claim once LAYR is a token.
  - `cameoRoyalty`: TODO(server): pay the holder of a twin shown in City Mining 1% of the prize, from state.holder.cameos.
  - `holderSpins`: TODO(server): five free spins a week per forevered twin, capped per wallet.
  - `foreverFundRefund`: TODO(contract): refund the inscription fee of new twins from the closed periods in state.holder.closed, first come first served.
  - `collectionCup`: TODO(server): floor-wide leaderboard bonus from the shared reserve.
- **Fair Play text.** The in-game Fair Play panel (`build/js_panels.js`) states the maths: weighted 32-stop reel strips, one stop per reel from the browser's cryptographic random generator, and a long-run return to player of **94.38%** (lines 59.7%, scatters 1.5%, free spins 8.5%, pick bonus 11.9%, hold and respin 10.3%, jackpot 2.4%), confirmed by 5-million-spin simulations. Do not change the text without re-running the RTP check (`sim.js`, or the Test panel's RTP button).

## 7. Art

Everything on the reels is real Stacks or Bitcoin material; `art/sources.json` records the source of every image. Read it before going live:

- **Logos of other projects need permission** before this goes to the public: Blockstack, Blockstack Browser, Hiro Wallet, StackSwap, MiamiCoin, NYCCoin.
- **No era-correct file was found** for: StacksArt, App Mining, STXNFT. They are shown as a period-type tile that says `LOGO FILE NOT FOUND` and are never drawn as a logo.
- The Xtrata mark and the ParallaX Casino wordmark are the supplied files, unmodified (`art/brand/`).
- A Stacks NFT without a twin shows desaturated with a NOT YET FOREVER stamp (the game does this; only three Degens twins exist today).
- No Internet Archive snapshots could be used (the host was blocked from this build's network).

## 8. Checks

Run on the final build (game 965,577 bytes). Screenshots are in `checks/`.

| Check | Result |
|---|---|
| Seeded RTP, 5,000,000 spins (`TheArchive.test.rtp`, same sim as `sim.js`) | **94.181%** (design figure 94.38%, tolerance ±0.3%, so inside it). Base game 4,724,188 spins; one in 141 spins starts Rewind, 1 in 139 City Mining, 1 in 293 The Ledger, 1 in 162,903 the jackpot. |
| Engine source vs the Block Fortune v2 template | The `BF` block (11,429 bytes) is **byte-identical** to `ft/game.html` and to `engine.js` (same SHA-256 prefix 203f8735007d8df9). Only the theme layer differs. |
| Bonuses played trigger → intro → play → summary, with all four stages captured | Rewind, City Mining, The Ledger, Back to Blockstack and the gamble (Stamp It / Shred It), on the screen view and in fullscreen: `checks/scene-*.jpg`. Jackpot and gamble were forced from the Test hooks. |
| Skip | Skip runs the same engine calls without the animation, so the total is the one dealt at the trigger (run through Skip on the screen view and in fullscreen at desktop and phone width; balances were credited and the scene returned to play). |
| Reduced motion (`prefers-reduced-motion` and `test.reduced(true)`) | Trigger → intro about 1.2–1.4 s; Skip from intro reaches the summary for Rewind, City Mining, The Ledger and the jackpot; the gamble loss reaches its outro: `checks/reduced-motion-skip.jpg`. No page errors. |
| Whole session in fullscreen using only the bar (desktop 1400×960, phone 390×844) | Spin, bet −/+, Auto, Pays, Fair Play, Turbo, Sound, History, balance, gamble choices, Collect, Skip, the big bonus button, Test and Exit all work; Pays and Fair Play open inside fullscreen with nothing behind the bar; Esc and the Exit button leave it. No page errors: `checks/fullscreen-desk.jpg`, `checks/fullscreen-phone.jpg`. |
| Touch targets | None under 44 px on the cabinet page or the fullscreen bar at desktop, phone and no-WebGL widths. No sideways scroll. |
| Test page (desktop 1400×900, phone 390×844, no WebGL) | Connects with 100,000 LAYR on first visit; Space, a raycast click on a deck button and the clickable lever each spin; Cabinet and Screen views render; Reset restores the balance; the stub's round-log hook patch applies (2 calls); host Full screen toggles the game's own fullscreen and exit restores the hidden frame; the TEST button inside fullscreen opens the Test panel above the frame; hooks `force`, `setTwins`, `skip`, `reduced`, `rtp`, `state` all return. |
| **Bonus preview in production** (no `PX_TEST_MODE`, no `TheArchive.test`; only what the casino will have) | Opened from the Pays panel and, in fullscreen, the bar's TEST button. Each of Rewind, City Mining, The Ledger, Back to Blockstack and Stamp It or Shred It (win and lose) was triggered from the menu and played from trigger to summary, at desktop width (normal view) and phone width (fullscreen bar only). Practice chips 1,000,000; real balance 5,000,000 before and after, and **localStorage byte-identical** after exit; a real spin afterwards moved the real balance. `checks/preview-*.jpg`. |
| Bonus preview through the room's mirror (test page with `?prod=1`, driving only `ui()` modal and feature HTML and `click(token)`) | Same six bonuses on desktop and phone. The stub round-log hook (which wraps `BF.start` and `BF.gamble` in place, as the room's does) counted **1 round** for the one real spin and **still 1** after the six preview bonuses and exit; balance restored on exit. |
| Preview safety | Forcing is refused outside the preview; preview ends on leaving the machine, reconnecting or a new session; `save()` is disabled during it; the engine used is a pristine copy taken before the room hooks `BF`. |
| Casino files | None were opened for writing. The only casino file read was `casino/index.html`, to lift the three.js r128 build (cached in `build/three.r128.min.js`). |
| `pack.json` | Decodes: one pack object `{name, description, color, accent, model, game, css}`; the game decodes to the same bytes as `out/game.html`, the model to `{root, geometries, materials, textures}`, and css matches `out/game.css`. |
| Placeholders | None on screen: untwinned Stacks NFT art is shown desaturated with the NOT YET FOREVER stamp; the three logos not found are period-type tiles labelled LOGO FILE NOT FOUND. |
| Wild symbol | Draws the supplied Xtrata mark unmodified: `checks/paytable-xtrata-wild.jpg`. |

Not covered: the room-side behaviour (cabinet light and topper reacting to bonuses) needs the casino, which was not touched. Holder payouts are stubs and "twins paid for" reads 0.

## 9. How to rebuild

Everything is generated from the build folder (`/home/claude/archive`):

1. `gen/textures.js` + `gen/prep_tex.py` draw the cabinet textures; `gen/cabinet.mjs` builds `out/model.json`.
2. `build/assemble_game.py` assembles `out/game.html` and `out/game.css` from the Block Fortune v2 template (`ft/`) and the theme blocks `build/js_*.js`.
3. `build/make_standalone.py` packs the model, game and css into `pack.json`, extracts the three.js build that the casino embeds (r128, read only from the casino's `index.html`, cached in `build/three.r128.min.js`), and writes this folder to `dist/the-archive/`.
4. Checks: `sim.js` (the RTP sim), `gtest.js` / `gtest2.js` (the game on its own), the test page's Test panel.
