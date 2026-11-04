# Adding Mooneeb to the ParallaX Casino

Mooneeb is built standalone in `public/casino-machines/mooneeb/` and has **not** been added to the casino. Nothing in `public/casino/` was changed. These are the exact steps to add it later. Line references are to `public/casino/index.html` as served on 2 November 2026.

## 1. Add the pack (required)

`pack.json` is one `PX_MACHINE_PACKS` entry in exactly the existing format: `{name, description, color, accent, model, game, css}`, with `model` and `game` gzip+base64. Append it as the **sixth** entry of `window.PX_MACHINE_PACKS=[…]` (after Neon Vault), so it gets `type` 5:

```js
window.PX_MACHINE_PACKS=[{…The Drop…},{…Forever Twins…},{…Deep Strata…},{…Block Fortune…},{…Neon Vault…}, /* paste the contents of pack.json here */];
```

Rebuild it any time with `node tools/build-pack.mjs` (after `python3 tools/build-cabinet.py` if the cabinet changed).

## 2. The MACH list and the machines panel (required)

The machines panel (`#machinesPanel`, the `.machine-choice` buttons with `data-machine-type`) lists the five machines. Add a sixth button with the same markup:

```html
<button class="machine-choice" data-machine-type="5" style="--machine-color:#2b145e;--machine-accent:#c084fc"><b>Mooneeb</b><small>Word ladder · Moonshot bonuses</small><em>PLAY THE MACHINE ↗</em></button>
```

Wherever the room keeps its `MACH` list of machine names / ids, add `{ type: 5, id: 'mooneeb', name: 'Mooneeb' }` (or the same shape as the existing entries).

## 3. Floor positions and floor glow in `buildSlots` (required)

`buildSlots(W, gold)` places one cabinet of each type per side at `zPositions=[-7.6,-4.2,-.8,2.6,6]` and picks a floor glow colour from `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd][type]`.

- **Floor glow:** add Mooneeb's accent as the sixth colour: `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd,0xc084fc]`.
- **Floor space:** five positions per side are already used. Either add a sixth z position (for example `9.4`, if the room is long enough), or decide the second row / new wing from the series bible's open question first. Mooneeb needs nothing special: the room scales it to 2.6 m like the others.

## 4. Round log and spectators (recommended)

`pxRlPatch` hooks the round log only for the ids it knows: `{'the-drop':'drop','forever-twins':'twins','deep-strata':'ds','block-fortune':'bf','neon-vault':'nv'}`. Add `'mooneeb':'mooneeb'`. The game's engine line is exactly the pattern it expects, once:

```js
const GAME_ID='mooneeb', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
```

`spectDocument`, `npcGameDocument`, `pxLiteDocument` and `pxRafShim` already work unchanged: the build checks that the LAYR account header, the `connect(ac.destination)` call, the 2800×1920 screen line and `window.PX_CASINO_ENGINE={` each appear exactly once. NPC guests find `#fbGo` and `[data-pick]` in the feature bar as they do on the other machines.

## 5. Fullscreen hand-over: `pxMachineFullscreen` (recommended)

Mooneeb's fullscreen belongs to the game: the screen fills the view and every control except the lever sits on one bar along the bottom (bets, spin, auto, Moonmap, fair play, turbo, sound and volume, history, holder pot, balance, the gamble's two calls, skip, and Lab/Test when the developer flag is on). Every dialog opens inside it.

Because the game runs in the room's hidden logic frame, it lifts **its own frame** to a fixed full-viewport layer and requests browser fullscreen on that frame (falling back to the fixed layer where the Fullscreen API is missing, as on iPhone Safari). When it leaves, it puts the frame's original style back. The room only needs to hand over:

```js
// in bindConnectedCabinets(), replace the pxMachineFullscreen handler:
$('pxMachineFullscreen').onclick=()=>{
  const e=getActiveEngine();
  if(e&&typeof e.api.fullscreen==='function'){e.api.fullscreen(true);return;}   // machines that own their fullscreen (Mooneeb)
  if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Use your browser’s full screen control.'));
};
```

The room's `KeyF` handler already clicks `pxMachineFullscreen`, so F works too. While the game is fullscreen, `api.ui()` returns `fullscreen:true` and empty `modal`/`feature` strings, so the room's ported UI stays hidden (the game shows its own). The game calls `window.PXMachineFullscreenChanged(on)` on the room if it exists, so the room can pause its own rendering while the machine fills the screen (optional). Esc, or the browser leaving fullscreen, returns to the cabinet.

## 6. Bonus Lab and test panel: developer flag only (recommended)

The game shows the Bonus Lab and the test panel only when the host sets `window.PX_DEV_LAB = true` before creating the logic frame (or the game page has `?lab=1`). In the casino, set it only on testnet with `?lab=1`:

```js
window.PX_DEV_LAB = /[?&]lab=1\b/.test(location.search) && /* your testnet check */ true;
```

Never set it for players in production. With it set, `api.action('lab')` and `api.action('test')` open the panels, and the L key can be mapped to `cabinetAction('lab')`. Lab runs use a separate lab balance and are marked LAB in History; they never touch the shared LAYR account, the jackpot meters, the Holder Pot or any statistics.

## 7. Cabinet lights (optional)

The room animates `crest` (turning on its own clock), `lever` (from `mechanics().lever`) and `spinPhysical` as it does for every machine. Mooneeb's `mechanics()` also returns:

- `ladder`: five numbers 0–1, the glow of each word-ladder rung (M, MOO, MOON, MOONEY, MOONEEB) as its symbol wins; the jackpot lights them all, rung by rung.
- `lights`: 0–1 excitement after wins and during bonuses.
- `jackpot`: true during the Full Mooneeb celebration. `scene`: the current bonus and stage.

The cabinet's neon rungs are named `px-rung0` … `px-rung4` (two meshes each, one per side). The standalone test page shows how it lights them, pulses the trims and speeds the topper; the room can copy that loop into `updateCasinoMachines` if it wants the light show on the floor. Without it the machine still plays exactly the same.

## 8. What the room must provide

Nothing new: the shared `window.ParallaxLAYRAccount` (the game borrows the parent's, never a second balance), the canvas-and-controls API calls it already makes (`activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `revision`, `screen`), and network access to `xtrata.xyz` for live LEO Cats twins (bundled twins show offline).

## 9. Before a public launch

- Official files for the **STX** and **$LEO** logos (run `node tools/fetch-logos.mjs`, then rebuild) and both projects' OK.
- **Muneeb's** own OK for the portrait on the jackpot tiles. It is shown now at Jim's request (`art/muneeb/approval.json`); record Muneeb's OK there (who, when, where) before a public launch, or set `approved` to false to bring back the crowned MOONEEB name card.
- Holder payouts, holder spins, the Forever Fund and the Collection Cup need a snapshot service or contract (stubs and TODOs are in the game). Take legal advice before LAYR becomes real STX.
