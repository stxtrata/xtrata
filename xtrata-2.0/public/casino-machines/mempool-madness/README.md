# Mempool Madness — ParallaX Casino machine (standalone build)

A 1970s steel mission-control console where every reel symbol is a live reading of the Bitcoin mempool: the fee a
transaction pays, a whale moving 100+ BTC, a transaction stuck for hours, the block about to be found. It runs the shared
**Block Fortune v2 engine byte for byte** (94.38% design RTP) and is built here on its own; it is not in the casino yet
(see `INTEGRATION.md`). Accent colour `#14f195`; machine id `mm`, game id `mempool-madness`.

Open `index.html` from a web server (for example `cd public/casino-machines && python3 -m http.server 8102`, then
`http://localhost:8102/mempool-madness/index.html`). It shows the cabinet in a small 3D studio with the real game running on
its screen, a test LAYR balance, Cabinet and Screen views (Screen frames the glass, the deck buttons and the lever), Full screen, a **Test** panel and the **Bonus Lab**. The red
launch lever under its flip-up safety cover is on the right of the cabinet; pulling it throws sparks from the launch pad.

## Folder

| Path | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, deck buttons, clickable launch lever with sparks at `px-sparkAnchor`, the topper counting blocks left and pulsing on each new block, Space to spin, fullscreen hand-over, Test panel, Bonus Lab button. |
| `pack.json` | The machine as one `PX_MACHINE_PACKS` entry (`name, description, color, accent, model, game, css`; model and game gzip+base64). |
| `pack.js` | The same pack as `window.MM_PACK`, so the test page also opens from disk. |
| `INTEGRATION.md` | The casino steps, written down and not carried out. |
| `src/game.js` | The theme layer: live mempool data layer, fee-band and data tiles, radar screen, the four-stage bonus scenes, fullscreen bar, Bonus Lab, Daily Pot, panels, the room API (`window.MempoolMadness`). |
| `src/cabinet.js`, `src/model.json`, `NOTES-cabinet.md` | The cabinet (made by `tools/build-cabinet.mjs`; not edited by the game build). |
| `art/snapshot.js` | `window.MM_SNAPSHOT`: the real mempool.space reading bundled as the offline fallback (shown with a SNAPSHOT badge). |
| `art/mempool-source.json` | The collected snapshot `tools/build-art.mjs` turns into `snapshot.js` and `sources.json`. |
| `art/sources.json` | Where every figure came from, the definitions, the honesty notes. No third-party art; `logosNeedingPermission` and `logosMissing` are empty. |
| `vendor/` | Test-page libraries copied from the casino (THREE subset, SoftwareRenderer, XLOGO), the LAYR test stub, and the brand SVGs. |
| `dist/` | `mempool-madness.html` (the game on its own), cabinet preview PNGs, `test/` screenshots. |
| `tools/build-art.mjs` | Builds `art/snapshot.js` and `art/sources.json` from `art/mempool-source.json`. |
| `tools/build.mjs` | Builds `dist/mempool-madness.html`, `pack.json`, `pack.js`, `vendor/`. Checks the engine's SHA-256; reads the casino for reference only and never writes to it. |
| `tools/exact-rtp.py` | Exact RTP from the strips (all 33,554,432 reel positions, features in closed form). Prints 94.380%. |
| `tools/rtp-sim.cjs` | Seeded 5,000,000-spin simulation of the engine inside `pack.json`, with its SHA-256 checked against the Block Fortune v2 engine. |
| `tools/test-page.cjs` | End-to-end test of `index.html` (needs Playwright): deck, lever and sparks, every bonus and every Lab item in four stages (screenshots in `dist/test/`), Skip, reduced motion, panels, fullscreen sessions at desktop and phone width. |

```bash
node tools/build-art.mjs        # only after changing art/mempool-source.json
node tools/build-cabinet.mjs    # only after editing src/cabinet.js
node tools/build.mjs            # PX_CASINO_HTML=/path/to/casino/index.html to read the casino's shared parts
python3 tools/exact-rtp.py
node tools/rtp-sim.cjs 5000000
node tools/test-page.cjs http://localhost:8102/mempool-madness/index.html
```

The test launches headless Chromium with `--disable-accelerated-2d-canvas`. `ONLY=basic,bonus,skip,reduced,panels,lab,fs,phone`
selects sections; `LAB_ITEMS=a,b` limits the Lab items and `LAB_ALL=1` adds Replay and Run all. The cloud sandbox cannot
reach mempool.space, so there the machine shows SNAPSHOT; `MempoolMadness.test` hooks cover the live path.

## The reels

| Slot | Symbol | Meaning |
| --- | --- | --- |
| `cherry`, `lemon`, `chip`, `block` | Fee bands 1 / 5 / 20 / 50 sat/vB | tiles show the queued size at that fee or the live recommended fee. mempool.space exposes no per-band transaction counts, so none are shown. |
| `artifact` | Whale | a real transaction of 100 BTC or more |
| `bitcoin` | Next Block | the jackpot symbol |
| `wild` | RBF | replace-by-fee, substitutes for the rest |
| `scatter` | Fee spike | three or more start Rush Hour |
| `vault` | Stuck transaction | three or more start Accelerate |
| `chain` | Pending transaction | three or more start Block Template |

Tiles are original data art; no logos or third-party images. Figures are read live about every 30 seconds; with no network
the bundled snapshot is used and labelled. Nothing is ever invented. Art is chosen with `Math.random` after the engine has
fixed the result.

## Bonuses (four stages each: trigger, intro, play, summary; Skip and reduced motion on every one)

* **Rush Hour** (free spins, 2×): each spin stacks a projected block.
* **Accelerate** (pick 3 of 9): boost three real stuck transactions.
* **Block Template** (hold and respin): pack pending transactions into a 15-cell template; a full grid pays the jackpot. Each respin animates: every open slot rolls real pending transactions and stops one by one, the winners stamping in; idle open slots shimmer so the screen stays alive.
* **Block Found**: the progressive jackpot, with the launch rocket.
* **Confirm or Evict**: the gamble, an even bet on a transaction's fate.

## Daily Pot, Fair Play, Lab, fullscreen

* **Daily Pot**: 1% of paid bets, per twin, every 144 blocks; the topper counts the blocks left. Server and contract parts
  are `TODO(holder-layer-v2)` stubs.
* **Fair Play** panel: 94.38% design RTP (lines 59.7, scatters 1.5, free spins 8.5, pick 11.9, hold and respin 10.3, jackpot
  2.4), frequencies 1/140, 1/140, 1/290, jackpot about 1/113,000. A design estimate, not a certified RTP.
* **Bonus Lab**: any bonus on a separate lab balance with a scripted random generator; always on the test page, in the casino
  only with `?lab=1` on a non-on-chain account.
* **Fullscreen**: the screen fills the view with every control except the lever on a bottom bar; works at phone width.
