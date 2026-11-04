# Degen City

Machine 9 of the ParallaX Casino series: a five-reel, twenty-line Block Fortune v2 slot built on the Forever Twins of **Miami Degens**
and **NYC Degens**. Two cities race on one set of reels; the city with more Forever Twins leads, and its Degens wear the gold jackpot frame.
**Standalone build.** The casino is not touched; see `INTEGRATION.md`.

## Open it
Serve this folder over http (a `file://` page cannot decode the pack) and open `index.html`:

    cd xtrata-2.0/public/casino-machines/degen-city && python3 -m http.server 8765
    # then http://localhost:8765/index.html

Drag to orbit, scroll or pinch to zoom, click the lever or DRIVE (or press Space), F for fullscreen, L for the Bonus Lab,
A / N to call Miami / New York in the gamble. `dist/degen-city.html` is the game on its own (no studio).

## Game
- Engine: Block Fortune v2, byte for byte (`const BF`, `STATE_VERSION 2`, SHA-256 `7a5ae848…7b98e`), RTP 94.38%, 5×3 reels, 20 lines, bets 20 / 40 / 100 / 200 / 500.
  The theme layer changes only names, art, sounds, copy and the cabinet. The result is fixed before the art is chosen (`Math.random` picks art only).
- Symbols: MiamiCoin (cherry) and NYCCoin (lemon) token logos; Miami Degens (orange frame, chip) and NYC Degens (blue frame, block);
  the **trailing city's** Degens (silver frame, artifact); the **leading city's** Degens (gold frame, the jackpot symbol, bitcoin);
  the Split Degen (wild, frame half orange and half blue); CityCoins (scatter); the two Degens collection logos (vault box); city blocks (hold and respin).
- Bonuses, each with trigger / intro / play / outro, Skip, turbo and reduced motion: **Mining Season** (free spins at 2×),
  **City Vault** (pick three of nine safe-deposit boxes), **Block Party** (hold and respin on a city map, Miami left, New York right),
  **Key to the City** (jackpot), **Miami or New York** (50/50 coin gamble).
- Forever Twins: a Degen with a permanent Xtrata twin is shown in full colour. One without is **desaturated with a NOT YET FOREVER stamp**.
  Twin lists come from the Xtrata registry (`xtrata.xyz/forever-twins/data/registry.v2.json`) through the Hiro proxy and are cached for six hours;
  a failed read is "unknown", never "no twins". The bundled snapshot has few twins so far (Miami 1, NYC 2), so most Degens look greyed until more exist.
- Holder layer v1: Holder Pot (1% of paid bets, weekly), split 60/40 between the leading and trailing city's twins, cameo records in spin history; payouts are stubs with TODO lines.
- Fair Play panel carries the 94.38% breakdown; the Rates and Rules panels show the leading and trailing city live.

## Folder
| Path | What |
| --- | --- |
| `index.html` | Test page: 3D studio, cabinet and screen views, lever, deck buttons, test LAYR stub, test panel (twins none / some / all, balance reset, RTP simulation), Bonus Lab |
| `pack.json`, `pack.js` | The machine as one `PX_MACHINE_PACKS` entry (`pack.js` assigns it to `window.DC_PACK` for the test page) |
| `dist/degen-city.html` | The built game page (what `pack.json` carries gzipped) |
| `src/` | `game.js` (the whole game), `style.css`, `cabinet.js` (cabinet builder), `model.json` (packed cabinet), `shared/` HTML parts |
| `art/` | Bundled art (`art.js`), `manifest.json`, `sources.json`, `logos-needing-permission.md` |
| `vendor/` | three subset, software renderer, XLOGO, the test LAYR stub, brand SVGs |
| `tools/` | `build.mjs`, `build-art.py`, cabinet tools (`build-cabinet-node.mjs`, `check-cabinet.mjs`, `preview-cabinet.mjs`), checks (below) |
| `NOTES-cabinet.md` | Cabinet design notes and named parts |
| `INTEGRATION.md` | Steps for adding it to the casino later (not carried out) |

## Checks
    node tools/build.mjs                                 # builds dist/, pack.json, pack.js; verifies the engine SHA-256
    node tools/rtp-sim.cjs 5000000                       # seeded 5M-spin RTP + engine identity
    python3 tools/exact-rtp.py                           # exact RTP over all 33,554,432 positions (about 10 min)
    node tools/check-lab-plans.cjs                       # Lab reel stops vs the engine
    node tools/test-page.cjs http://localhost:8765/index.html dist/test   # end to end with screenshots (needs playwright)

The Bonus Lab (L, or the LAB button) plays every bonus on a separate LAB balance: seeded or random, replay last, Run all, plus two
City race items that show each city leading. It never touches the real LAYR balance, jackpot meters, Holder Pot or RTP statistics.
In the casino it appears only behind `?lab=1`.

## Art
`art/sources.json` lists every image and where it came from. Logos that need permission are in `art/logos-needing-permission.md`.
Untwinned Degen originals (IPFS) could not be fetched from the build environment, so they load live in the browser; re-run
`python3 tools/build-art.py` on a computer with IPFS access to bundle them, then `node tools/build.mjs`.
