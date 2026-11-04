# Pool Party integration handoff

**This build is standalone. No casino room or other machine file has been edited.**

Target folder on Jim's machine:

`xtrata-2.0/public/casino-machines/pool-party/`

Machine id: `pool-party`. Pack name: `Pool Party`. The only intended room deliverable is the `pack.json` object (plus this handoff); `index.html` is the separate test host.

## 1. Import the pack

Read `pack.json`, then add that object as one entry in the room's `window.PX_MACHINE_PACKS`. It has the same `name`, `description`, `color`, `accent`, `model`, `game` and `css` structure as the supplied reference. `model` and `game` are gzip-compressed UTF-8, then base64 encoded. The model decodes to `root`, `geometries`, `materials` and `textures`.

The room scales the cabinet to 2.6 m high and stands it on the floor. Call `updateMatrixWorld(true)` after scaling and before computing camera bounds. Render with Three r128, ACES tone mapping at exposure 1.15 and the room's existing linear-output settings. The supplied `SoftwareRenderer` remains available for a WebGL-less path.

Map the game's 2800×1920 `api.screen` canvas to the `screenMesh` role and update the texture when `api.revision()` changes. `api.topper` is an optional 1800×136 live marquee canvas. Map it to `marqueeMeter` with linear filtering and no mipmaps. It carries the jackpot, Fund balance, period end and last-period share. Use the same revision signal for both textures.

As of 2.1.1, the game schedules its animation callbacks on its same-origin parent window, because browsers may pause the hidden game iframe's own `requestAnimationFrame`. It converts every callback to the game's local `performance.now()` so reel starts and scene timers share one clock. There is still one game animation loop; the host must not add a second game-tick loop. Opening `dist/game.html` directly uses that page's own scheduler. No new room API or patch anchor is required.

## 2. Keep the exact patch anchors

The pack builder and engine checker assert these room-patching anchors exactly once:

- The script beginning `/* One existing LAYR account`.
- `const GAME_ID='pool-party', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);`
- `const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);`
- `connect(ac.destination)`.
- `window.PX_CASINO_ENGINE={`.

Add `pool-party` to the room's round-log id mapping if that mapping is explicit. Keep the plain `E=LAYR.machine(GAME_ID,BF)` form. Do not put another balance, wallet or account wrapper in the packed game. `src/host.html` supplies a clearly marked test account solely to the standalone test page; do not copy that stub into the casino.

The canonical engine remains **v2**, exactly as requested. The Series Bible's future engine/service language is not permission to modify its math or state version in this build. The engine identity is checked both as a full source file and as the exact embedded `const BF` block. The separately named `PX_PURE` copy is for practice only and is intentionally outside the room's real-play log hooks.

## 3. Host API and mechanics

Activate the selected machine with `await api.activate()` and release it with `api.deactivate()`. A real spin in progress may refuse deactivation. Practice is cancelled before the machine leaves. Account reconnection ends practice and resumes any real pending round exactly once.

The room uses `action(name)`, `tap(x,y)` in 1400×960 logical coordinates, `ui()`, `click(token)`, `input(token,value,checked,event)` and `closeModal()` as in the supplied reference. The game owns its result and canvas; the host owns the 3D scene and camera. `ui()` provides ported modal/feature markup when outside fullscreen.

| Cabinet role/action | Host behavior |
| --- | --- |
| `screenMesh` | Live game canvas |
| `marqueeMeter` | Live `api.topper` canvas |
| `crest` | Independently rotating STX swim ring |
| `waterJet` | Optional local `scale.y` pulse on a lever pull |
| `lever` | Use the reference ease/down-stop/return/bounce curve |
| `spinPhysical` | Spin cap group, including its label |
| `btn-*`, `btnface-*` | Local-z cap/label spring motion |
| `tag0`–`tag7` | Eight pool-light rows, two meshes per row |
| `deckSurface` | Deck geometry for camera-fit bounds |
| `spin` | SWAP |
| `betUp` / `betDown` | +SLIPPAGE / −SLIPPAGE |
| `auto` | AUTO-SWAP |
| `pays` | POOLS |

Action meshes carry `pxMachineAction` in the reconstructed model. Follow action metadata up the object parent chain when raycasting. Cap and label must move together exactly once: the large spin control is already grouped.

`mechanics()` returns `lever` timing, `buttons`, `lights`, eight `tags`, `scene`, `jackpot` and `reduced`. Respect `reduced` with steady lighting and a calmer crest. The standalone host pulses the water jet by up to 18% using the same lever curve. No host animation is allowed to select or alter a game result.

## 4. Screen-view fit

Use `src/host.html`'s solver, not an older fixed camera distance:

- Straight-on yaw, `SV_PITCH = 0.16`.
- Forty iterations for distance and vertical target at start and resize.
- Screen top below the header plus 10 px, with a 0.2-model-unit lintel allowance.
- Deck front bottom on the top of the dark controls strip.
- Project every screen/deck bounding-box corner when enforcing the 4% side margins.
- Include every action mesh and `spinPhysical`; exclude all descendants of `lever` or `armPivot`. The lever is outside the fitted deck.
- Refit when the header/footer layout changes, including narrow windows and conditional controls.

The standalone checks assert geometry and raycast actions at 1440×900, 1366×768, 1024×768, 390×844 and 844×390. The footer is opaque/dark so the lower cabinet cannot show beneath the physical controls in screen view.

## 5. Fullscreen handover

Use **`api.fullscreenHost(true)`**, and `api.fullscreenHost(false)` to leave. It belongs to the packed game. Do not implement a second independent fullscreen screen in the room.

The game lifts its logic frame to a fixed, visible, full-viewport layer and renders its own canvas, bottom bar and dialogs there. The host may expose:

```js
window.PXMachineFullscreenHost = {
  enter(frame) { /* request native fullscreen on the visible room document */ },
  exit(frame)  { /* leave native fullscreen if active */ }
};
window.PXMachineFullscreenChanged = on => {
  // Pause room rendering and input while the game's frame is foregrounded.
};
```

The standalone implementation requests fullscreen on the visible host document, not the previously off-screen iframe. When the browser lacks that API, the fixed viewport layer still works. The game's Exit button restores the frame's previous style and accessibility state. Root-document `fullscreenchange` handles native Escape. F toggles the mode; menus and their Close buttons remain in the frame.

All normal controls are on the bar. A bonus replaces the ordinary Spin key with one large pending-action key, so it does not duplicate the action or push Exit off-screen. Gamble choices and Collect appear when appropriate. At narrow widths the bar wraps. All DOM button targets are at least 44 px. Keep the game canvas's balance/bet/win line unobscured.

## 6. Preview safety

Production entry is `action('lab')` or the public Bonus preview button in POOLS/fullscreen. Leave `PX_STANDALONE_TEST` unset in the room. It only enables the extra Test controls, twin-display switch and read-only test diagnostics.

Forcing helpers are closure-local. A preview uses the engine's own `start(state,rng)` with a scripted RNG, an independent `PX_PURE` instance and practice chips. Saving and service calls are suppressed; the real account state is set aside and restored afterward. The display strip identifies practice clearly and history rows are labelled LAB. Do not route `PX_PURE` through the room's live round logger, spectators or jackpot service.

## 7. Future service boundaries

**Casino Jackpot:** `casinoJackpot.get(level)`, `contribute(level,bet)` and `settle(level)` are in `src/game.c.js`. The unchanged canonical core currently owns local meter accrual and payouts. The adapter's write methods acknowledge those existing actions; they do not write again. Replacing the adapter with the future shared service needs a separate, coordinated engine/service migration to prevent double contribution or double payout. Do not add a second 2% contribution beside the current core.

Before animation, every pending round carries `jackpot: {level,hit}`. The `hit` value covers actual five-STX centre rows and predealt full-grid hold features. Local meter behavior stays exactly as in the reference.

**Machine Fund:** `fund.json` is type W, all-live, weekly Monday 00:00 UTC. The local accrual is 1% of paid bets from the house share. `FundService.readTwins`, `snapshot` and `claim` are explicit stubs. Resolve the live collections and their helper contracts from the specified Forever Twins registry, verify each inscription at the required period boundaries, and keep unknown data unknown. No entitlement or claim transaction is manufactured by this test build.

Snapshots, claims, shared jackpot accounting and Forever Fund refunds are intentionally outside this standalone scope. No reel-token-holder reward or cameo hook should be added.

## 8. Final room acceptance

Before adding the machine to the live room, run the included checks against the integrated frame, verify the exact patch hooks still match, and perform real-GPU Safari and Chrome checks for the camera, clickable controls, full sessions, audio and fullscreen transitions. Confirm the shared account/round log sees real rounds once and preview rounds never. Obtain the listed project-logo permissions before a public build. These are the remaining integration sign-offs; the standalone does not claim they already happened.
