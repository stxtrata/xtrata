# Adding DOG Army to the ParallaX Casino

DOG Army is built standalone in `public/casino-machines/dog-army/` and has **not** been added to the casino. Nothing in `public/casino/` was changed. These are the steps to add it later. Line references are not given; search for the names.

## 1. Add the pack (required)

`pack.json` is one `PX_MACHINE_PACKS` entry in the existing format `{name, description, color, accent, model, game, css}` (name `DOG Army`, color `#0c0a09`, accent `#e7e5e4`), with `model` and `game` gzip+base64. Append it to `window.PX_MACHINE_PACKS=[...]` after the machines already listed; its `type` is its index in that array.

Rebuild any time with `node tools/build-pack.mjs` (after `python3 tools/build-cabinet.py` if the cabinet changed). The build checks the engine hash, the model (parts and deck actions below) and every room hook.

## 2. The machines panel and the MACH list (required)

Add one `.machine-choice` button with the next `data-machine-type`, `--machine-color:#0c0a09;--machine-accent:#e7e5e4`, title `DOG Army`, subtitle `The DOG rune · Airdrop, Dog Tags and March bonuses`, and an entry `{ type: <n>, id: 'dog-army', name: 'DOG Army' }` wherever the room keeps its machine list.

## 3. Floor position and floor glow in `buildSlots` (required)

Add a floor glow colour for the new type (DOG Army's accent is `0xe7e5e4`) and a floor position; the room scales every cabinet to 2.6 m tall.

## 4. Round log and spectators (recommended)

`pxRlPatch` hooks the round log by game id: add `'dog-army'` with a short key of your choice. The game's engine line is exactly the text the room patches, once:

```js
const GAME_ID='dog-army', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
```

`spectDocument`, `npcGameDocument`, `pxLiteDocument` and `pxRafShim` work unchanged: `tools/build-pack.mjs` fails the build unless the LAYR account header, the `connect(ac.destination)` call, the 2800x1920 screen line and `window.PX_CASINO_ENGINE={` each appear exactly once. NPC guests find `#fbGo` and `[data-pick]` in the feature bar (the nine dog tags are `[data-pick]` buttons).

## 5. Fullscreen hand-over: `pxMachineFullscreen` (recommended)

DOG Army's fullscreen belongs to the game: the screen fills the view and every control except the lever sits on one bar along the bottom, labelled with the deck words MARCH, +DOGS, -DOGS, AUTO-MARCH and ORDERS plus the plain action in small type (also fair play, turbo, sound and volume, history, holder pot, balance, MOON and DOOM calls, skip, and Lab/Test when the developer flag is on). Every dialog opens inside it. The game lifts its own logic frame to a fixed full-viewport layer and requests browser fullscreen on it. The room only hands over:

```js
$('pxMachineFullscreen').onclick=()=>{
  const e=getActiveEngine();
  if(e&&typeof e.api.fullscreen==='function'){e.api.fullscreen(true);return;}   // machines that own their fullscreen
  if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Use your browser’s full screen control.'));
};
```

While fullscreen, `api.ui()` returns `fullscreen:true` with empty `modal`/`feature` strings, and the game calls `window.PXMachineFullscreenChanged(on)` if the room defines it.

## 6. Bonus Lab and test panel: developer flag only (recommended)

Shown only when the host sets `window.PX_DEV_LAB = true` before creating the logic frame (or the game page has `?lab=1`). Set it only on testnet. `api.action('lab')` and `api.action('test')` open the panels. Lab runs use a separate lab balance, are marked LAB in History and never touch the LAYR account, the jackpot meters, the Holder Pot or any statistics. The Test panel's HOLDER STATE switch (live stub / none / some / all) simulates holder-wallet states; it never changes a result.

## 7. Cabinet lights (optional)

The room animates `crest`, `lever` (from `mechanics().lever`) and `spinPhysical` as for every machine. DOG Army's `mechanics()` also returns:

- `tags`: eight numbers 0..1, the glow of the cabinet's dog-tag rows `px-tag0` (bottom) .. `px-tag7` (top). Every row is two meshes (left and right column), each with its own cloned emissive material. The tags step in time on wins, sweep during bonuses and all light on the jackpot. Suggested drive: `emissiveIntensity = base + 0.75 * glow` (and `color` scaled), exactly as `index.html` does.
- `lights`: 0..1 excitement. `jackpot`: true during To the Moon. `scene`: the current bonus and stage.
- `buttons`: `{spin, betUp, betDown, auto, pays}`, each 1 for about 150 ms after that button is used (deck click, Space, the fullscreen bar, Auto), else 0. The cabinet's deck caps are the meshes named `btn-<action>` (the cap) and `btnface-<action>` (its label); the big spin cap is `spinPhysical`. `index.html` puts each cap on a spring (a fast, firm sink of about 3 cm model units, then a damped rebound) driven by this value or by the pointer being held on the button, and the lever follows a hand-pulled curve (ease down, rest on the stop, spring back, one small bounce). The room does not need any of this: without it the buttons simply do not move.

Without this loop the machine plays exactly the same.

## 8. What the room must provide

Nothing new: the shared `window.ParallaxLAYRAccount` (the game borrows the parent's, never a second balance), the canvas-and-controls API calls it already makes (`activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `revision`, `screen`, `fullscreen`). Network access to `xtrata.xyz` is optional: the game tries the live ALEX token image only if none is bundled, and works fully offline.

Cabinet contract: parts `screenMesh`, `crest`, `spinPhysical`, `lever`, `tag0`..`tag7`; deck actions `spin`, `betUp`, `betDown`, `auto`, `pays`.

## 9. Before a public launch

- **$DOG logo** (`art/dog/img/dog-logo-black.png` / `dog-logo-white.png`) and the DOG community's OK; until then the moon shows "$DOG" in plain type. Rebuild the cabinet and the pack once the file is supplied.
- **ALEX `runes-dog` and Pontis token images**, and the **Runestone artwork**: permission from their owners (see `needsPermission` in `art/sources.json`).
- **Leonidas**: the wild uses his own PFP, supplied by Jim (`art/supplied/leonidas-pfp.jpg`, cropped from a screenshot he provided). It still needs Leonidas's OK before a public build. If the file is removed the wild falls back to a name card with a crest drawn in code.
- **The snapshot block** (reports give 840,249 or 840,269) must be confirmed on a primary source and marked `verified` in `art/dog/data.json` before a number is shown on the Snapshot crate.
- **Every record** marked brief-only, unconfirmed or unavailable is labelled on its tile and in the Orders panel; resolve them or keep the labels.
- **Holder layer**: `HOLDER_CONFIG.MIN_DOG_PER_WALLET` (Jim sets this); wallet reads, message signing, the weekly snapshot and payout, holder spins, the Runestone cameo royalty and any Collection Cup need a service or contract (named stubs and TODO lines in `src/game.c.js`). Take legal advice before LAYR becomes real STX.

## 10. Sound: real recordings, bundled

The snare, bass drum, snare rolls and trumpet are real recordings from the VS Chamber Orchestra: Community Edition (VSCO 2 CE, CC0 1.0, https://github.com/sgossner/VSCO-2-CE), converted to 16 small mono mp3s (about 150 KB) in `art/audio/` with their licence and source files listed in `art/audio/sources.json`. They are bundled in the pack as `audio/<name>.mp3`, decoded after the first sound unlock, and played through the same calls as before (`snare`, `kick`, `roll`, `brass`), so every scene keeps its timing. If they fail to load the code-made drums and bugle play instead. CC0 needs no permission or credit; credit is given in the Orders panel and in `sources.json`. Nobody has listened to the mix yet.
