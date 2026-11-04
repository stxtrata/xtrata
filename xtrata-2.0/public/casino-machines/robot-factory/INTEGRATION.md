# Robot Factory: adding it to the casino later

**Nothing here has been done.** This machine was built standalone. No file under `casino/` (or anywhere outside
`public/casino-machines/robot-factory/`) was edited or integrated. These are the steps for whoever wires it in.

## 1. The pack entry
`pack.json` is one `PX_MACHINE_PACKS` entry in the existing format:

```
{ name: 'Robot Factory', description: 'Megapont Apes, Robots and Components · Assembly Line cascade', color: '#1a1033', accent: '#7048e8',
  model: <gzip+base64 of the packed cabinet>, game: <gzip+base64 of the whole game page>, css: '<the game dialog styles>' }
```

Append it to the `window.PX_MACHINE_PACKS=[ ... ];` array in `casino/index.html` (or paste `pack.js`'s value).
`pack.js` assigns the same object to `window.RF_PACK`, used only by the standalone test page.

## 2. The room's lists (names in the existing code)
1. **MACH list**: add a slot for `'Robot Factory'` (machine 6) next to the other machines, with the same `name` as the pack.
2. **Floor-glow colour list in `buildSlots`**: add the accent `#7048e8`.
3. **Machines panel copy**: add one line, e.g. "Robot Factory: real Megapont apes, robots and parts on an Assembly Line."
4. Leave the Fair Play wording in the pack as it is: it states the Deep Strata engine, 94.38% and the split.

## 3. What the room must provide (same as the other machines)
- `window.ParallaxLAYRAccount` (the real account). The pack only calls the methods the other machines call.
- The canvas-and-controls API the pack exposes as `window.PX_CASINO_ENGINE`: `screen`, `revision`, `mechanics`,
  `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `closeModal`, `fullscreen`, `fullscreenHost`, `ui`, `refreshAccount`.
- Deck button actions on the model: `spin`, `betUp`, `betDown`, `auto`, `pays`. Named parts: `screenMesh`, `armPivot`, `crest`, `spinPhysical`, `lever`.
  The room swings `armPivot` and turns `crest`; the buttons are PRESS, +VOLTS, −VOLTS, AUTO-BUILD, BLUEPRINT.
- Button feel: a press plunges in about 40 ms, bottoms out for 25 ms and springs back in about 130 ms. The PRESS cap needs nothing new: the room already moves
  `spinPhysical` to `mechanics().spinZ`, and the pack now returns a fast plunge-and-spring there (0.034 of travel). Optional for the four small buttons:
  `mechanics().press` is `{action, id, depth}` (depth 0 to 1) while a press is in flight; sink the button's cap and face meshes (the two with local z above 0.15)
  by `0.03 * depth` along the deck's z. `action(name, {noPress: true})` skips the press, for a lever pull. The test page does all this (see `index.html`).
- The frame pump (`pxRafShim`) the room already injects into hidden frames.

## 4. Fullscreen hand-over (`pxMachineFullscreen`)
The game owns its fullscreen layout and bottom bar (every control except the lever, ≥ 44 px targets, safe-area insets). The room's button should:
1. call `PX_CASINO_ENGINE.fullscreenHost(fn)` once, where `fn(on)` shows the machine frame full viewport
   (and calls the browser Fullscreen API with the user's own gesture) when `on`, and puts it back when not;
2. after the frame is visible, call `PX_CASINO_ENGINE.fullscreen(true)`; on exit call `fullscreen(false)`.
`index.html` in this folder does exactly this (`enterFs` / `exitFs`) and is the reference.

## 5. The engine
`src/shared/engine.html` and `src/shared/rules.html` are Deep Strata's engine and rules, byte for byte
(`tools/build.mjs` checks both SHA-256 values). The game runs `BF.create(DEEP_STRATA_RULES)`: ladder 1×, 2×, 3×, 5×, at most 30 drops.
Here the cascade is the "Assembly Line". If the casino's Deep Strata engine ever changes, rebuild this pack from the new files.

## 6. Test-only code
- The **TEST** panel exists only when `window.parent.PX_STANDALONE_TEST === true` or on localhost / `.test` hosts. The casino never sets that flag.
- The **Bonus Lab** (L key, LAB button) exists in the test build and in the casino **only** behind `?lab=1` in the room's URL.
  It plays on its own LAB balance and never touches the real LAYR, jackpot meters, Holder Pot or RTP statistics. Rounds are marked LAB in History.

## 7. Holder layer, version 1
- Holder Pot meter: 1% of paid bets, weekly period, shown on the screen header. The linked-twin count is a stub.
- Cameo records `{tokenId, collection, lineWin}` are written into each round's history when a Megapont NFT is on a winning line.
- Stubs with TODO lines: weekly snapshot, payout, claims. Nothing pays out yet.

## 8. Art and Forever Twins
- Only six Megapont Ape Club twins are inscribed on Bitcoin so far (apes 1, 2, 3, 4, 5 and 871). They are bundled and shown in full colour with the ∞ badge.
  More are read live through the xtrata.xyz Hiro proxy from `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-megapont-ape-club` once a player connects;
  a failed read means "unknown", never "none".
- Robots, Robot Components and Space Agency NFTs have no twin yet: always desaturated with the NOT YET FOREVER stamp.
- **Run `python3 tools/fetch-art.py` on a computer with open internet access** (the build sandbox could reach neither api.megapont.com nor IPFS), then
  `python3 tools/make-art.py && node tools/build.mjs`. That fetches the ape rarity map (gold 2% / tiers I, II, III), pictures of un-twinned apes, Robots,
  Components and Space Agency NFTs. The official Megapont logo is already bundled (`art/logos/megapont.png`, supplied by Jim). Until then those tiles show the real name in type marked ART PENDING and apes are dealt across the
  tiers in the right proportions (their tiles say only "APE #id", never a tier the machine cannot prove).
- `art/sources.json` lists every picture and contract; `art/logos-needing-permission.md` lists what needs clearing before a public launch.
