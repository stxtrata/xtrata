# Later casino integration

**Instructions only; not carried out.** Reference: the public [stxtrata/xtrata casino source](https://github.com/stxtrata/xtrata/blob/main/xtrata-2.0/public/casino/index.html), retrieved 3 November 2026. That snapshot contains the original five machine identifiers. Reconcile these edits with the target branch before applying them; DOG Army's newer host was unavailable.

## 1. Register the pack and floor placement

Append the parsed **`pack.json` object** to `window.PX_MACHINE_PACKS`—one entry, with `model` and `game` still gzip + base64. Keep the pack's `color: '#e6ece7'` and `accent: '#f97316'`. Do not install the standalone host or `src/test-account.js` in the casino. Production supplies the shared `window.ParallaxLAYRAccount`; it must not set `PX_STANDALONE_TEST`.

Use machine identifier **`lp`** for room presence/log routing, and **`launchpad`** for the game's account ID. Append `lp` at the same index as the pack in `MACH = ['drop', 'twins', 'ds', 'bf', 'nv']` and the corresponding floor-entry type lookup. Inspect every copy of those five identifiers, including spectator/presence routing and any server allowlists accepting machine spots.

In `buildSlots`, extend or replace `zPositions = [-7.6,-4.2,-.8,2.6,6]` with a collision-checked placement for every pack. Simply appending a pack leaves its z position undefined. Add **`0xf97316`** at Launchpad's index in the floor-glow colour list. Keep the room's 2.6 m height normalization, updating world matrices before measuring the model. Check both walls and walking clearance after choosing positions.

Replace assumptions that five cabinets form one wall. The current `machineSpot`, presence `place(spot)` and spectator lookups use `index < 5 ? 1 : 2`. Derive a cabinet's number from its type instead, for example:

```js
const cabinetNumber = m =>
  1 + room.machines.filter(k => k.type === m.type).indexOf(m);
// machineSpot: MACH[m.type] + '.' + cabinetNumber(m)
// presence/spectator lookup: match id and String(cabinetNumber(k))
```

In `#machinesPanel`, add a `machine-choice` button at the actual new `data-machine-type` index: title **Launchpad**, subtitle **Stacks launchpads · from curve to pool**, action **PLAY THE MACHINE ↗**, cream/orange CSS variables as above. Update the sentence describing machine and cabinet counts to match the completed floor.

## 2. Preserve account, patch and canvas contracts

In `pxRlPatch`, add **`'launchpad':'lp'`** to the existing `ids` object. Its regular expression must still match exactly once. The spectator `spectDocument` patch uses the same engine anchor; it has no equivalent ID map in this snapshot. Check that presence/spectator routing accepts `lp.1` and `lp.2` and that live rounds reach `PXRoundLog` / `PXSpinCast` once.

Preserve the game's LAYR account script and these source anchors:

```js
const GAME_ID='launchpad', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
// Also preserve: connect(ac.destination) and window.PX_CASINO_ENGINE={
```

Keep `PX_PURE` copied **before** the patched account/engine line, so preview outcomes cannot enter logs or spectators. Continue the room's `pxRlPatch` → `pxLiteDocument` → `pxRafShim` loading pipeline. The game owns pixels and controls; the host owns Three.js and cameras. `tap(x,y)` uses logical **1400 × 960** coordinates, even when the backing canvas is 2800 × 1920. Port `ui().feature` and `ui().modal` as HTML and forward their `data-px-source` tokens through `click()` and `input()`. The feature markup exposes `#fbGo` and available `[data-pick]` controls. `featureLabel` is available as a text-only fallback.

## 3. Consume the new cabinet mechanics

The packed model uses `{root, geometries, materials, textures}`. The current unpacker maps each node's `role` to **`px-<role>`** and its `action` to **`userData.pxMachineAction`**.

Also preserve each node's supplied `userData` when unpacking, before assigning the action. Launchpad uses it for the deck's motion metadata and `softwareLayer` painter bias. For example, initialize `out.userData = { ...(n.userData || {}), role: n.role || '' }`, then assign `out.userData.pxMachineAction = n.action` when present. The bias keeps left-hand keycaps and their labels above the large deck plane in the software renderer; it does not change WebGL geometry.

| Role | Action / motion |
| --- | --- |
| `screenMesh` | Live canvas material |
| `crest` | Rocket; independent slow y rotation, celebration lift |
| `lever` | Physical input dispatches `action('lever')`; rotation around local x |
| `launchCover` | Guard opens with lever pull |
| `spinPhysical` | `spin`; LAUNCH spring cap |
| `btn-pays`, `btn-betDown`, `btn-betUp`, `btn-auto` | `pays`, `betDown`, `betUp`, `auto` |
| `btn-lab` | `lab`; expose developer extras only with the test flag |
| `jackpotMeter`, `fundMeter` | Dynamic display surfaces |

Port the standalone host's **ancestor-aware raycast dispatch**. The current public room handler tests only the mesh returned by the raycaster, whereas the lever action belongs to its parent group. Walk from the hit mesh towards the cabinet root: a `lever` or `launchCover` role (or the corresponding `px-` name) dispatches **`api.action('lever')`**; another `pxMachineAction` dispatches its named action. A click on the guard should arm and pull the same lever. Do not turn the physical lever into a plain `spin` action: that starts a round without creating its lever-mechanics signal. Keep the ordinary LAUNCH cap mapped to `spin`. If the topper fund display is made clickable in the room, route its `fundMeter` role to `action('fund')`; it deliberately has no deck action tag, so a generic deck-bounds scan cannot include the topper.

Use Appendix A.8's local-z springs. `mechanics().buttons[action]` pulses to 1 for 150 ms, and the host returns the cap to rest using the spring. The standard `btn-*` and `btnface-*` roles share a deck axis. `spinPhysical` is the common parent for `btn-spin` and `btnface-spin`.

On a new `mechanics().lever.id`, use its `elapsed`, `duration` and `angle` to apply the host's lever curve. The angle is the maximum travel in radians. The pull lasts 900 ms and includes a bottom dwell and return bounce. `mechanics().scene` has the form `kind:stage`. Use `lights`, `jackpot` and `reduced` for the topper and lighting.

## 4. Hand fullscreen to the game

After `createCasinoEngine` has the `{api,frame}` pair, register **`api.fullscreenHost(on => …)`**. Port the behavior of `setFullscreen` in `src/host.js` into the room: make this engine's frame a fixed full-viewport layer on entry, undo the hidden `pxLogicFrame` opacity/visibility/pointer-events, enable focus and input, and call **`api.fullscreen(on)`**. Restore its original hidden-frame styles on exit. Set iframe `allow="autoplay; fullscreen"`. Request native fullscreen only as an enhancement; the fixed layer must remain usable when that API is unavailable, including iPhone Safari.

Replace the current `pxMachineFullscreen` handler, which only toggles document fullscreen, with a guarded call to the active game's **`api.action(api.ui().fullscreen ? 'fullscreenExit' : 'fullscreen')`**. Keep a fallback for older packs without `fullscreenHost`. Route F/Esc and native `fullscreenchange` through the same transition; restore focus on exit and exit fullscreen before machine deactivation. In the visible frame, the game renders its own bottom controls, modal panels and bonus actions; the host must not lay a second control strip over them.

## 5. Future services and acceptance

The `casinoJackpot.get / contribute / settle` adapter is a **future shared Casino Service boundary**. The unchanged engine still owns the local five meters and accounting; do not add another contribution or credit. Persisted spin outcomes include `jackpot: {level,hit}` before presentation. A shared singleton service is not connected in this build.

`fund.json` is type W, all live collections, weekly from Monday 00:00 UTC. Current accrual is a display derived from paid wagers; eligible count and last pay remain **checking**. Future services must implement first-block and snapshot-block sealed-twin ownership, per-inscription shares, holder claims and unclaimed rollover. The 1% comes from the house share. No reel-token holding requirement or holder payout belongs here.

After integrating, rerun the exact-engine check, five viewport/deck assertions, fullscreen sessions, interrupted-round settlement, and practice isolation against room logs/spectators. Verify reduced motion and sound in real-GPU Safari and Chrome. The standalone's checks do not prove room integration; record new results separately.
