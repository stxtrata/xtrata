# Rare Pepe Directory: adding it to the casino later

**Nothing here has been done.** This machine was built standalone. No file under `casino/` (or anywhere outside
`public/casino-machines/rare-pepe-directory/`) was read for editing, changed or integrated. These are the steps for whoever
wires it in.

## 1. The pack entry
`pack.json` is one `PX_MACHINE_PACKS` entry in the existing format:

```
{ name: 'Rare Pepe Directory', description: 'Rare Pepes · Counterparty cards', color: '#0f2d1a', accent: '#3fb950',
  model: <gzip+base64 of the packed cabinet>, game: <gzip+base64 of the whole game page>, css: '<the game dialog styles>' }
```

Append it to the `window.PX_MACHINE_PACKS=[ ... ];` array in `casino/index.html` (or paste `pack.js`'s value).
`pack.js` is the same object assigned to `window.RPD_PACK`, only used by the standalone test page.

## 2. The room's lists (names in the existing code)
1. **MACH list**: add a slot for `'Rare Pepe Directory'` next to the other machines, with the same `name` as the pack.
2. **Floor-glow colour list in `buildSlots`**: add the accent `#3fb950`.
3. **Machines panel copy**: add one line, e.g. "Rare Pepe Directory: trade Rare Pepes, open packs, fill the binder."
4. Keep the Block Fortune family wording in Fair Play untouched; it is part of the pack.

## 3. What the room must provide (same as the other machines)
- `window.ParallaxLAYRAccount` (the real account). The pack only calls the methods the other machines call.
- The canvas-and-controls API the pack exposes as `window.PX_CASINO_ENGINE`: `screen`, `revision`, `mechanics`,
  `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `closeModal`, `fullscreen`, `fullscreenHost`, `ui`, `refreshAccount`.
- Deck button actions on the model: `spin`, `betUp`, `betDown`, `auto`, `pays`. Named parts: `screenMesh`, `crest`, `spinPhysical`, `lever`.
- The frame pump (`pxRafShim`) the room already injects into hidden frames.

## 4. Fullscreen hand-over (`pxMachineFullscreen`)
The game owns its fullscreen layout and bottom bar. The room's button should:
1. call `PX_CASINO_ENGINE.fullscreenHost(fn)` once, where `fn(on)` shows the machine frame full viewport
   (and calls the browser Fullscreen API with the user's own gesture) when `on`, and puts it back when not;
2. after the frame is visible, call `PX_CASINO_ENGINE.fullscreen(true)`; on exit call `fullscreen(false)`.
`index.html` in this folder does exactly this (`enterFs` / `exitFs`) and is the reference. Without a host the game asks for
fullscreen itself and falls back to a fixed full-viewport layer (iPhone Safari).

## 5. Test-only code
- The **TEST** panel exists only when `window.parent.PX_STANDALONE_TEST === true` or on localhost / `.test` hosts. The
  casino never sets that flag, so it is absent on the public room.
- The **Bonus Lab** (L key, LAB button) exists in the test build and in the casino **only** behind `?lab=1` in the room's URL.
  It plays on its own LAB balance, never touches the real LAYR, jackpot meters, Holder Pot or RTP statistics, and marks rounds LAB in History.

## 6. Holder layer, version 1
- Holder Pot meter: 1% of paid bets, weekly period, shown on the screen header. The linked-card count is a stub.
- Cameo records `{tokenId, collection, lineWin}` are written into spin history when a Bitcoin Pepes twin is on a winning line.
- Stubs with TODO lines: weekly snapshot, payout, claims, holder spins, Forever Fund refunds.

## 7. Twins and the Ordinal Pepe wild
- Bitcoin Pepes (Stacks twins) are read from the Xtrata registry v2 and the helper
  `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-4ever-fakfun`; a failed read is "unknown", never "no twins".
- The Ordinal Pepe wild uses one shared GIF and is **greyed with NOT YET FOREVER** until its helper is live. Flip it by
  setting the placeholder's `forever` flag when the helper exists (see `c-tiles.js`, `loadLive`).

## 8. Art
`art/sources.json` lists every image and its source. `art/logos-needing-permission.md` lists the logos to clear. Card,
PEPECASH, Rare Pepe Wallet and Ordinal Pepe pictures could not be fetched from the build environment (the hosts were blocked),
so those tiles are typographic; save permission-cleared files as `art/cards/<ASSETNAME>.png` (and `art/logos/pepecash.png`, `art/logos/wallet.png`), then run `python3 tools/make-art.py` and `node tools/build.mjs`.
