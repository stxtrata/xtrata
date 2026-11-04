# The Stack: putting it into the ParallaX Casino later

**Nothing in this file has been done.** No casino file was edited. These are the steps, in order, for whoever adds the machine by hand. Names below are the ones in `public/casino/index.html` and `public/casino/room.js` as read on 2 Nov 2026 (sha256 of `index.html` at the start of this build: `830216e7…77b7`). Other machines in the series may have gone in since, so search for the quoted names rather than trusting any position or index.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, the real packed cabinet and game, a clearly marked **test stub** of `ParallaxLAYRAccount`, the Bonus Lab and a Test panel (T). Serve `public/` and open `/casino-machines/the-stack/`. It needs a web server (it fetches `pack.json`). `?prod` removes the test hooks (the Lab then needs `?lab=1`), `?nostudio` skips WebGL and shows the screen in 2D (the same fallback it uses automatically when WebGL is missing), `?test` opens the Test panel. |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64. `css` equals the game's head `<style>`. |
| `art/records.json` | The real chain records the reels are set from: the PoX state (cycle 146, ends at Bitcoin block 974,750), 20 stacking cycles (127–146: STX stacked, signers, start block), 20 Stacks blocks (#9,394,826–#9,394,845, each with its Bitcoin anchor) and 6 Bitcoin burn blocks, read from the Hiro API on 2 Nov 2026. |
| `art/logos/*.svg` | The official logo files on the reels and marquee (Leather, Xverse, Bitflow, Zest, sBTC, StackingDAO, Stacks), byte for byte as bundled in `@leather.io/ui` 1.111.2 (and `@stacks/connect-ui` 6.6.0 for the `-connect` alternatives). |
| `art/sources.json` | Where every image and record came from (with sha256 for each logo), and **the logos that still need permission (all seven project logos)**. |
| `art/bitcoin-mark.svg` | The Bitcoin mark, Bitcoin.org's public-domain file (as saved by The Halving build). |
| `art/cabinet/*.png` | The cabinet artwork, rendered from SVG at build time. |
| `vendor/three.js` | The same three.js build the casino room uses (r128, copied from `tools/snow-crash/vendor/three.js`), for the test page only. |
| `QA.md` | What was checked and the results. |

Build sources are in `tools/the-stack/` (started from The Halving's pipeline). The engine and the LAYR adapter inside the game are copied byte for byte from Forever Twins; `tools/the-stack/verify.py` checks that against the pack inside `casino/index.html` (read only).

## 1. Add the pack

Append the object in `pack.json` to `window.PX_MACHINE_PACKS=[…]` in `public/casino/index.html`, after the last existing entry. Its position is its machine type index everywhere below.

```sh
node -e "const p=require('fs').readFileSync('public/casino-machines/the-stack/pack.json','utf8');console.log(','+p)"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It runs with the room's interfaces unchanged: `window.ParallaxLAYRAccount` (taken from `window.parent`; `acquire`, `ready`, `error`, `machine`, `openGame`, `saveGame` only, state id `the-stack`, no second balance) and `PX_CASINO_ENGINE` (`screen`, `revision`, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `refreshAccount`, `closeModal`, `stopAuto`, `fullscreen`), plus four optional extras the room may ignore: `topper` (1024×256 canvas) with `topperRevision()`, and `ticker` (512×1024 canvas) with `tickerRevision()`.

## 2. The room's machine lists

1. **Presence list** (room.js): `const MACH = ['drop', 'twins', 'ds', 'bf', 'nv', …];` → append `'stack'` at the pack's index, and in the name map beside it add `stack: 'The Stack'`. The order must match `PX_MACHINE_PACKS`.
2. **Floor positions: open question.** `buildSlots` places one machine per type at `zPositions=[-7.6,-4.2,-.8,2.6,6]` on both side walls: five positions. The series bible's open question (second row, new wing, or rotation) has to be settled first.
3. **Floor glow.** In `buildSlots`: `glowSprite(…, [0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd, …][type], .11)` → append `0xfc6432` at the pack's index.
4. **Machines panel copy.** After the last machine button:
   ```html
   <button class="machine-choice" data-machine-type="N" style="--machine-color:#0b0b12;--machine-accent:#fc6432"><b>The Stack</b><small>Stacks today · sBTC, stacking and fast blocks</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   (`N` is the index from step 1.)
5. The name plaque (`pxSign(...)`) and the 2.6 m scaling are automatic. The cabinet is a little taller than The Halving's (the slab topper rises to about 6.6 units before scaling). Named parts: `screenMesh` (same size and place as the other packs), `core` (the turning stack of three slabs, each the official Stacks logo outline extruded, purple at the base and orange at the top; the room already turns `core`), `lever` (matte black with an orange knob on the right pillar; pivots on `rotation.x`, so the room's `sin(u·π)·angle` pull swings it), `spinPhysical` (the orange STACK cap; the room already sets its `position.z` from `mechanics().spinZ`), and deck buttons with actions `spin` (STACK), `betUp` (+STX), `betDown` (−STX), `auto` (AUTO-STACK), `pays` (DOCS). Every lever part also carries `action: 'spin'`, so clicking the lever spins.

## 3. Optional: the live topper display, side tickers and edge lights

Without any room change, the topper display shows a baked texture (**THE FLOOR POT · CYCLE 146 · ENDS AT BITCOIN BLOCK 974,750**) and both side panels show the heights at build time, marked AT BUILD. To show them live, map the game's canvases where the room already binds the screen texture (in the function that creates `machineEngines` entries, after the `px-screenMesh` block):

```js
const bind = (name, canvas) => { const t = new THREE.CanvasTexture(canvas); t.generateMipmaps = false; t.minFilter = t.magFilter = THREE.LinearFilter;
  m.model.traverse(o => { if (o.name === name) { o.material = o.material.clone(); o.material.map = t; o.material.needsUpdate = true; } }); return t; };
if (api.topper) { engine.topperTexture = bind('px-potBoard', api.topper); engine.topperRevision = -1; }   // CYCLE <n> · ENDS IN 3d 4h · <pot> LAYR
if (api.ticker) { engine.tickerTexture = bind('px-tickerPanel', api.ticker); engine.tickerRevision = -1; } // latest Bitcoin and Stacks heights, both sides
// and in the per-frame update beside the screen texture:
for (const [tex, rev, key] of [['topperTexture', 'topperRevision', 'topperRevision'], ['tickerTexture', 'tickerRevision', 'tickerRevision']])
  if (engine[tex]) { const r = engine.api[key](); if (r !== engine[rev]) { engine[rev] = r; engine[tex].needsUpdate = true; } }
```

Roles the test page animates and the room may ignore (ignored, they simply stay lit):
- `edge` (purple edge lights on every cabinet edge, the pillar slabs and the topper halo) and `edge2` (the orange belt line and the upper pillar slabs). The test page lerps the purple from dim to bright with `max(breath, mechanics().leds, mechanics().newBlock)`; `newBlock` (0–1) pulses for 1.6 s whenever a real new Stacks block arrives while the machine is active. Orange follows `mechanics().win`, and both flash with `mechanics().jackpot`.
- `slab` (the three topper slabs): raise each one's `emissiveIntensity` gently with time and with `newBlock`.
- `buttonCap`: DOCS, −STX, +STX and AUTO caps. Set each group's `position.z` to its home z − 0.03 × `mechanics().buttons[group.userData.pxMachineAction]` to show presses.
- `lit`: the marquee (plain, no breaker on this machine; `mechanics().power` is always 1).

## 4. Fullscreen hand-over (`pxMachineFullscreen`)

The game owns its fullscreen: its screen fills the view and every control except the lever is on a bottom bar (STACK, −/+ STX, MAX STX, AUTO-STACK, TURBO, DOCS, FAIR PLAY, THE REELS, FLOOR POT, LOG, LAYR, SETTINGS, SOUND, VOLUME, the gamble's ▲ STACK and ▼ UNSTACK, COLLECT, LAB when enabled, EXIT). Change the room's handler to:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=getActiveEngine()?.api?.fullscreen;                     // the seated machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}                                     // The Stack (and any pack that offers it)
  /* existing behaviour for the other machines */
};
```

It works the same way as The Halving's: it restyles its own `window.frameElement` with inline `!important` styles, then calls the Fullscreen API on it, staying a fixed full-viewport layer where the API is missing (iPhone Safari). `Esc` or EXIT leaves and restores the frame. `deactivate()` exits fullscreen first. Panels are native dialogs, so they work inside fullscreen.

## 5. Things the room already does that this machine relies on

- `pxLiteDocument` looks for `screen=canvas(2800,1920)`: present, once.
- `pxRlPatch` (round log) matches `GAME_ID` by id. `the-stack` is not a known id, so spins are not in the room's round log until its table is extended. Nothing breaks.
- `pxRafShim` pumps frames for the hidden frame. The game paces itself (ticker ~20 fps idle, animations near 30 fps, adaptive to its own draw cost).
- **Network** (all read-only, all optional, Hiro through `https://xtrata.xyz/hiro/mainnet` first, then `https://api.hiro.so`):
  - Bitcoin tip and the latest burn blocks: `/extended/v2/burn-blocks?limit=6` (fallback `https://mempool.space/api/blocks/tip/height`). The stacking cycle is computed from it: `floor((tip − 666,050) ÷ 2,100)`.
  - Latest Stacks blocks: `/extended/v1/block?limit=20`. Each new one plays a soft chime (up to four per read) and pulses the tickers.
  - PoX state: `/v2/pox`, every 5 minutes, for the cycle number and STX stacked.
  - Forever Twins register and helper events (the Floor Pot's twin count): `xtrata.xyz`, as the other machines do.
  - Read on activation and every 20 s while the machine is active (3 requests per read, plus one every 5 minutes: well inside Hiro's public rate limit). On a failed read the last known values are shown marked **STALE** (cached in `localStorage` under `xtrata.thestack.live`), never a guess; with no read at all it falls back to the values bundled at build (Bitcoin #974,247, Stacks #9,394,845). A stale tip never rolls the Floor Pot's period over.

## 6. The Bonus Lab in the casino

Hidden for players. It appears only with the developer flag `?lab=1` on the casino URL (testnet LAYR). L opens it, as do Settings and the bar's LAB button. It swaps in a separate practice game (10,000 practice LAYR, its own meters and pot) running on the raw engine; nothing touches the LAYR account, saved game, jackpot meters, Floor Pot or statistics, and its rounds are marked LAB in History. Items: Stacking Season, Stacking Season + retrigger, Reward Slots, Fast Blocks, Fast Blocks full grid (→ Bitcoin Finality), Bitcoin Finality (centre row), Stack or Unstack win and loss, scatter pays of 3/4/5, and two machine events: **Cycle Turnover** (the prepare phase's last blocks count down, the ring completes and the next cycle begins; no LAYR) and **Cycle Snapshot** (the cycle ends and the Floor Pot is divided per twin; display only). Options: bet level, Seeded (seed field) or Random, Auto-advance, Run, Replay last, Run all. Each run passes a scripted rng to the engine's own `start(state, rng)`; the engine is never edited.

## 7. Holder layer (version 1: display only) — the Floor Pot

- **Pot:** 1% of every paid bet, from the house edge, stored in the game state (`pot`, `potKey` = `C<cycle>`, `lastPot`) beside the jackpot meters.
- **Period:** one stacking cycle (2,100 Bitcoin blocks, about two weeks), read live from the Bitcoin tip; the topper shows `CYCLE <n> · ENDS IN 3d 4h · <pot> LAYR`. The period rolls only on a fresh (not stale) tip read. The snapshot block is the next cycle's first reward block: `666,050 + (cycle + 1) × 2,100`.
- **Who shares it:** every forevered twin in every live Forever Twins collection, per twin. A collection whose count can't be read is "unknown", never zero.
- **Cameo royalty:** none on this machine: its reels carry logos and records, not NFTs.
- Snapshot, payout and claims are stubs (`HolderLayerStubs`) with `TODO(holder-layer v2)` lines.

## 8. Before it goes on the public floor

1. **Logo permissions.** Leather, Xverse, Bitflow, Zest Protocol, sBTC and Stacks (Stacks Foundation), and StackingDAO each need to agree to appear (list in `art/sources.json`). Until then it stays on the testnet build. To swap a project, replace its file in `tools/the-stack/art/logos/`, update `logos.json` and `LOGO_OF`/`NAMES`/`WHAT` in `src/game/p1_head.js`, and rebuild; the maths doesn't change.
2. **Floor space** (section 2, item 2).
3. **Live hooks** (section 3) if you want the live pot and tickers on the cabinet in the room, not only on the screen and the test page.
4. **Legal.** The pot shares machine takings with NFT holders. While LAYR is play money this is a game mechanic; on mainnet it raises licensing and securities questions. Take advice first.
5. The RTP (94.38%) is a design estimate from the engine's model and a seeded simulation, not a certified figure. The Fair Play panel says so.

## 9. Rebuilding

```sh
python3 tools/the-stack/model/build_model.py    # cabinet → model JSON + art/cabinet/*.png (numpy; CairoSVG, or node + sharp from the repo)
python3 tools/the-stack/build.py                # game.html → pack.json → public/casino-machines/the-stack/
python3 tools/the-stack/verify.py               # engine and adapter identical to Forever Twins; pack decodes; records and logo hashes; casino untouched
node tools/the-stack/rtp-sim.mjs 5000000        # seeded 5M-spin return check
```

To refresh the bundled chain data, re-read `/v2/pox`, `/extended/v2/pox/cycles?limit=20`, `/extended/v1/block?limit=20` and `/extended/v2/burn-blocks?limit=6` from the Hiro API into `art/records.json` (same shape), then rebuild.
