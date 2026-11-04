# Degen City: adding it to the casino later

**Nothing here has been done.** This machine was built standalone. No file under `casino/` (or anywhere outside
`public/casino-machines/degen-city/`) was changed or integrated. These are the steps for whoever wires it in.

## 1. The pack entry
`pack.json` is one `PX_MACHINE_PACKS` entry in the existing format:

```
{ name: 'Degen City', description: 'Miami Degens vs NYC Degens · the city race', color: '#1a0f12', accent: '#e8590c',
  model: <gzip+base64 of the packed cabinet>, game: <gzip+base64 of the whole game page>, css: '<the game dialog styles>' }
```

Append it to the `window.PX_MACHINE_PACKS=[ ... ];` array in `casino/index.html` (or paste `pack.js`'s value).
`pack.js` is the same object assigned to `window.DC_PACK`, only used by the standalone test page.

## 2. The room's lists (names in the existing code)
1. **MACH list**: add a slot for `'Degen City'` next to the other machines, with the same `name` as the pack.
2. **Floor-glow colour list in `buildSlots`**: add the accent `#e8590c` (Miami orange; the cabinet also carries NYC blue `#1f5fe0`).
3. **Machines panel copy**: add one line, e.g. "Degen City: Miami Degens against NYC Degens, the leading city wears the gold."
4. Keep the Block Fortune family wording in Fair Play untouched; it is part of the pack.

## 3. What the room must provide (same as the other machines)
- `window.ParallaxLAYRAccount` (the real account). The pack only calls the methods the other machines call.
- The canvas-and-controls API the pack exposes as `window.PX_CASINO_ENGINE`: `screen`, `revision`, `mechanics`,
  `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `closeModal`, `fullscreen`, `fullscreenHost`, `ui`, `refreshAccount`.
- Deck button actions on the model: `spin`, `betUp`, `betDown`, `auto`, `pays`. Named parts: `screenMesh`, `crest`, `spinPhysical`, `lever`.
- The frame pump (`pxRafShim`) the room already injects into hidden frames.
- The game reads Forever Twin data from `https://xtrata.xyz/...` (registry and Hiro proxy). The room's page must allow those requests
  (its content security policy, if any). If they fail the machine still plays; Degens just show as unknown/greyed.

## 4. Fullscreen hand-over (`pxMachineFullscreen`)
The game owns its fullscreen layout and bottom bar. The room's button should:
1. call `PX_CASINO_ENGINE.fullscreenHost(fn)` once, where `fn(on)` shows the machine frame full viewport
   (and calls the browser Fullscreen API with the user's own gesture) when `on`, and puts it back when not;
2. after the frame is visible, call `PX_CASINO_ENGINE.fullscreen(true)`; on exit call `fullscreen(false)`.
`index.html` in this folder does exactly this (`enterFs` / `exitFs`) and is the reference. Without a host the game asks for
fullscreen itself and falls back to a fixed full-viewport layer (iPhone Safari).

## 5. The crest
The cabinet's `crest` (the coin on the topper) is a screen of its own. The game settles it on the **leading city's colour** once the
race is known; if the room restyles crests, keep that part.

## 6. Test-only code
- The **TEST** panel exists only when `window.parent.PX_STANDALONE_TEST === true` or on localhost / `.test` hosts. The
  casino never sets that flag, so it is absent on the public room.
- The **Bonus Lab** (L key, LAB button) exists in the test build and in the casino **only** behind `?lab=1` in the room's URL.
  It plays on its own LAB balance, never touches the real LAYR, jackpot meters, Holder Pot or RTP statistics, and marks rounds LAB in History.

## 7. Holder layer, version 1 and the city race
- Holder Pot meter: 1% of paid bets, weekly period, shown on the screen header. The linked-card count is a stub.
- Weekly split: 60% of the pot to the twins of the leading city, 40% to the other city, divided by the twins each city holds.
- Cameo records `{tokenId, collection, lineWin}` are written into spin history when a Degen twin is on a winning line.
- The race changes only art (which city's Degens carry gold and silver), never the maths.
- Stubs with TODO lines (`holderState`, snapshot, payout, claims, holder spins, Forever Fund refunds): wire these to the real weekly snapshot and payout when they exist.

## 8. Twins
- Miami Degens (`miami-degens`, helper `SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.miami-degens-fakfun-xtrata`) and NYC Degens
  (`nyc-degens`, helper `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-nyc-degens`) are read from the Xtrata registry v2.
- A Degen without a twin is desaturated with the NOT YET FOREVER stamp. Cache key `xtrata.degen-city.twins`, six hours.

## 9. Art
`art/sources.json` lists every image and its source. `art/logos-needing-permission.md` lists the logos to clear (MiamiCoin, NYCCoin,
CityCoins, Miami Degens; the NYC Degens logo was not found). Untwinned originals are loaded live from IPFS in the browser; bundle them with
`python3 tools/build-art.py` on a computer that can reach IPFS, then `node tools/build.mjs`.
