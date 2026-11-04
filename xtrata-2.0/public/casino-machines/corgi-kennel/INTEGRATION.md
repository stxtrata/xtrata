# Later casino integration — instructions only

This standalone build has not modified `casino/index.html` or any existing casino file. Its account is isolated test LAYR. The shared Casino Service, snapshots and live claims remain pending.

## 1. Place the standalone package

Copy this directory to `xtrata-2.0/public/casino-machines/corgi-kennel/`. Keep source, tools, art, source evidence and results alongside `index.html` and `pack.json`. When replacing an earlier extracted package on the Mac, use an overwrite-capable extraction so stale files cannot silently survive.

## 2. Register the pack and room copy

After reviewing the standalone results and permissions, parse `pack.json` and append **that complete object** to `window.PX_MACHINE_PACKS`. Preserve gzip/base64 bytes and the six presentation fields. Add Corgi Kennel to the room’s `MACH` listing and machine-selection/panel descriptions, and add **#f59e0b** to the machine floor-glow colour list used by `buildSlots`.

Choose a free floor slot near the arcade aisle, reserving approach clearance for the lead on the cabinet’s right. Use slug/game ID **corgi-kennel**, title **Corgi Kennel**, machine number **21**, body colour **#163e2c**, accent **#f59e0b**. Do not integrate any copy of the standalone account stub; the room’s existing `ParallaxLAYRAccount` owns the balance.

The public reference room’s round-log and spectator mapping only recognises its original five machine IDs. Add `corgi-kennel` to those mappings when integrating. Preserve the room’s established account/session ownership model.

## 3. Preserve exact game patch anchors

The game retains these anchors:

```js
const GAME_ID='corgi-kennel', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
const screen=canvas(2800,1920),sg=screen.getContext('2d');
window.PX_CASINO_ENGINE={
```

It includes the genuine shared LAYR account script and `connect(ac.destination)` audio destination anchor. Do not rename the plain `E` declaration or route it through an alias. A frozen pristine function copy named `PX_PURE` is captured **before** the room can wrap `BF` at the `GAME_ID` line. Preview calls must continue to use that copy and must not reach the real round log, fund, meters or spectators.

The complete Appendix A.1 file has SHA-256 `7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168`. The embedded `STATE_VERSION = 2` block is 11,429 characters with SHA-256 `203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed`. Do not migrate it ad hoc to v3. A future centrally verified engine migration should replace the shared core across the series together.

## 4. Host the canvas and interactions

The room owns visible 3D rendering and cameras. Use:

| API | Meaning |
| --- | --- |
| `screen` | Live 2800×1920 canvas; logical hit coordinates 1400×960 |
| `revision()` | Incrementing redraw version |
| `activate()` / `deactivate()` | Account/session lifecycle; deactivation cancels practice |
| `action(name)` | spin, lever, betUp, betDown, auto, pays, fair, fund, history, sound, turbo, settings, lab |
| `tap(x,y)` | Logical canvas hit test, including bonus actions |
| `key(code,key)` | Keyboard forwarding |
| `mechanics()` | Lever timing/progress, independent button-cap motion and celebration strength |
| `ui()` | Readouts, flags, token-addressed modal HTML, feature state |
| `click(token)` / `input(...)` / `closeModal()` | The established room dialog port |
| `stopAuto()` | Stop paid autoplay |
| `refreshAccount()` | Refresh canvas/readouts after a host account update |

Use the packed model’s `screenMesh`, `crest`, `spinPhysical`, `lever`, `deck` and `pxMachineAction` meshes. `lever` is a group carrying a brass ring and stitched leather lead. Its invisible centre target is an interaction surface, not visible artwork. Route physical lead hits to **action('lever')**, which animates the pull and plays the bark; ordinary spin caps call **action('spin')**.

For each cap, apply `mechanics().buttons[action]` to its initial local deck-z position with the same spring depth as the standalone host. Move the cap group so its label travels with it. For the lead, use `mechanics().lever.progress` when supplied; the timing fields `{id,elapsed,duration,angle}` also remain available. The older public room’s sine-only lever motion and missing button loop must be upgraded to meet the 2.1 standard.

The model adds optional `jackpotMeter`, `ribbon-left` and `ribbon-right` roles. The standalone host updates the metre texture and ribbon flutter. If the room supports them, use the same updates; otherwise provide the jackpot/fund display through its shared marquee/kit.

## 5. Camera and fallback

Use the same packed model and renderer settings: Three r128, ACES tone mapping exposure 1.15 and linear output. Call `updateMatrixWorld(true)` after scaling to 2.6 m and before measurement. Screen view uses pitch **0.16**, a 40-iteration fit and the projected screen/deck bounds. It excludes the lever from the deck fit, keeps a 4% side margin and a 10 px top offset, and masks the lower cabinet below the deck.

The standalone fallback uses the existing SoftwareRenderer with corrected action-surface ordering. To preserve readable screen/meter text without WebGL, copy its projected-canvas overlays or an equivalent exact projection. Do not silently drop all rendering when WebGL creation fails.

## 6. Fullscreen hand-over

The pack owns the complete screen, responsive bottom bar and dialogs. The host owns only the frame and browser fullscreen request:

```js
const api = gameFrame.contentWindow.PX_CASINO_ENGINE;
api.fullscreenHost(async on => {
  if (on) {
    // Make the frame visible and viewport-sized before requesting browser fullscreen.
    await expandMachineFrame(gameFrame);
    api.fullscreen(true);
  } else {
    await restoreMachineFrame(gameFrame);
    api.fullscreen(false);
  }
});

// The room toolbar uses the same request path.
api.fullscreenHost.enter();
api.fullscreenHost.exit();
```

Keep a fixed-full-viewport fallback for browsers without the Fullscreen API. Do not request fullscreen on a hidden child frame. Keep panel and canvas actions inside that same frame. The game also emits `PX_PANEL` and `PX_FULLSCREEN` messages; verify `event.source` before acting on them. All real host interaction must remain clickable after leaving fullscreen.

The bar contains Fetch, bets, Auto, Pays, Fair Play, Turbo, Sound/volume, History, Fund, Settings, balance, the two gamble choices/Collect when offered, Bonus preview, the waiting feature action and Exit. No lever is used in fullscreen.

## 7. Service adapters and fund configuration

Load `fund.json` as type W, all-live collections, weekly Monday 00:00 UTC, split null. The game’s local `casinoJackpot` adapter observes the unchanged engine’s existing contribution/settlement; do not double-add its 2%. Round records carry `jackpot: {level,hit}` before presentation.

The future Casino Service must centrally serialize contributions and jackpot hits across machines, supply five meters, read qualifying twins and closed-period rates, and implement snapshots/claims with conservation tests. Replace the clearly named stubs, not the reel probabilities or payouts. Failed twin reads remain unknown/“Checking”. This machine has no cameo records and no outside-token holder payments.

## 8. Production flag and release checks

The room must **not** set `PX_STANDALONE_TEST`. The public Bonus preview remains available through Pays, the bottom bar and `action('lab')`; developer Test controls and inspection hooks disappear. Preview state is separate and cannot write a real account or trigger hooked real engine functions. Leaving or reconnecting ends it.

Before public integration: resolve the two missing logos or retain their honest marked name tiles, obtain third-party artwork permissions, complete listening sign-off and real-GPU Safari/Chrome checks, and run the room’s own round-log, spectator, frame lifecycle and fullscreen integration checks. DOG Army-specific parity is unverified because that folder was not accessible for this build.
