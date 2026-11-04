# Rare Pepe Directory

Machine 12 of the ParallaX Casino series: a five-reel, twenty-line Block Fortune v2 slot themed on the Rare Pepe Directory
(Counterparty cards on Bitcoin since 2016). **Standalone build.** The casino is not touched; see `INTEGRATION.md`.

## Open it
Serve this folder over http (a `file://` page cannot decode the pack) and open `index.html`:

    cd xtrata-2.0/public/casino-machines/rare-pepe-directory && python3 -m http.server 8765
    # then http://localhost:8765/index.html

Drag to orbit, scroll or pinch to zoom, click the lever or TRADE (or press Space), F for fullscreen, L for the Bonus Lab.
`dist/rare-pepe-directory.html` is the game on its own (no studio).

## Game
- Engine: Block Fortune v2, byte for byte (`const BF`, `STATE_VERSION 2`), RTP 94.38%, 5×3 reels, 20 lines, bets 20 / 40 / 100 / 200 / 500.
- Symbols: Fake Rares (cherry), Rare Pepe S26–36 (lemon), S13–25 (chip), S2–12 (block), Bitcoin Pepes (artifact, Stacks twins),
  Series 1 (bitcoin, gold-foil jackpot symbol), Ordinal Pepe (wild, greyed NOT YET FOREVER until its helper is live), PEPECASH (scatter),
  Rare Pepe Wallet (vault), Directory card (chain).
- Bonuses, each with trigger / intro / play / outro, Skip, turbo and reduced motion: **PEPECASH Rain** (free spins 2×),
  **Open a Pack** (pick), **The Directory** (hold and respin, 15-pocket binder), **Series 1, Card 1** (jackpot), **Rare or Fake** (gamble).
- Every step of a bonus is shown, not just its result. In **The Directory** each respin rolls a strip of cards through every empty
  pocket, stops them one by one (a hit stamps in with a shockwave and a coin burst, a miss thuds back to empty), holds the last pocket
  longer on the final respin or when only one or two pockets are left, spends and refills the three respin lamps, and flashes gold
  when the binder fills. **Open a Pack** cards charge up before they turn (longer for the big ones). Turbo shortens all of it and
  reduced motion swaps the roll for a short fade.
- Art: 225 Rare Pepe and 57 Fake Rare card pictures plus the PEPECASH and Rare Pepe Wallet logos are bundled (`art/cards`, `art/logos`;
  source and permission status of every one in `art/cards-sources.csv`, all "unconfirmed"). `tools/make-art.py` bundles them at 288 px
  as WebP (`--full` keeps the originals); the originals stay untouched on disk. The machine prefers cards that have a picture.
- Holder layer v1: Holder Pot (1% of paid bets), weekly period, cameo records; payouts are stubs.

## Folder
| Path | What |
| --- | --- |
| `index.html` | Test page: 3D studio, cabinet and screen views, lever, deck buttons, test stub account, test panel |
| `pack.json`, `pack.js` | The machine as one `PX_MACHINE_PACKS` entry (`pack.js` assigns it to `window.RPD_PACK` for the test page) |
| `dist/rare-pepe-directory.html` | The built game page (what `pack.json` carries gzipped) |
| `src/` | `game.js` (the whole game), `style.css`, `cabinet.js` (cabinet builder), `model.json` (packed cabinet), `shared/` HTML parts |
| `art/` | Bundled art (`img/`, `art.js`), `sources.json`, `logos-needing-permission.md`, card and logo drop folders |
| `vendor/` | three subset, software renderer, XLOGO, the test LAYR stub, brand SVGs |
| `tools/` | `build.mjs`, `build-cabinet.mjs`, `make-art.py`, `fetch-art.py` (downloads card pictures into art/cards; run it on a computer with internet access), `make-manifest.py`, checks (below) |
| `INTEGRATION.md` | Steps for adding it to the casino later (not carried out) |

## Checks
    node tools/build.mjs                                 # builds dist/, pack.json, pack.js; verifies the engine SHA-256
    node tools/rtp-sim.cjs 5000000                       # seeded 5M-spin RTP + engine identity
    python3 tools/exact-rtp.py                           # exact RTP over all 33,554,432 positions (about 10 min)
    node tools/check-lab-plans.cjs                       # Lab reel stops vs the engine
    node tools/test-page.cjs http://localhost:8765/index.html dist/test   # end to end with screenshots (needs playwright)

The Bonus Lab (L, or the LAB button) plays every bonus on a separate LAB balance: seeded or random, replay last, Run all.
It never touches the real LAYR balance, jackpot meters, Holder Pot or RTP statistics. In the casino it appears only behind `?lab=1`.
