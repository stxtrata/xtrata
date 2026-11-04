# Robot Factory

Machine 6 of 20 in the ParallaX Casino series (accent `#7048e8`): a five-reel, twenty-line slot on **Deep Strata's engine, byte for byte**
(Block Fortune v2 with the cascade rule, `BF.create(DEEP_STRATA_RULES)`), themed on Megapont. The cascade is the **Assembly Line**.
**Standalone build.** The casino is not touched; see `INTEGRATION.md`.

## Open it
Serve this folder over http (a `file://` page cannot decode the pack) and open `index.html`:

    cd xtrata-2.0/public/casino-machines/robot-factory && python3 -m http.server 8765
    # then http://localhost:8765/index.html

Drag to orbit, scroll or pinch to zoom, pull the lever or press PRESS (or Space), F for fullscreen, L for the Bonus Lab.
`dist/robot-factory.html` is the game on its own (no studio).

## Game
- Return to player 94.38% (design model): lines incl. cascade 59.7%, Megapont scatter 1.5%, Overdrive 8.5%, Robot Crates 11.9%, Full Build 10.3%, Megapont Prime 2.4%.
  Seeded 5,000,000-spin simulations: 94.18% (seed 20261101) and 94.39% (seed 7). Max 30 drops, ladder 1×, 2×, 3×, 5×.
- Symbols (all real Megapont material): Megapont Ape Club apes by rarity tier (cherry/lemon/chip = tier III/II/I, purple/blue/red frame), Space Agency NFTs (block),
  Robots (artifact), the rarest 2% of apes in a gold frame (bitcoin, the jackpot symbol), a twinned ape in a mech-suit frame (wild), the Megapont logo (scatter),
  a stencilled Robot Crate (vault) and Robot Components (chain). Forevered Stacks NFTs show in full colour with a ∞ badge; others are greyed with NOT YET FOREVER.
- Bonuses, each with trigger / intro / play / outro, Skip, turbo and reduced motion: **Overdrive** (8 free spins at 2×, amber lights, faster conveyors),
  **Robot Crates** (open 3 of 9), **Full Build** (hold-and-respin, 15-bay robot), jackpot **Megapont Prime** (5 gold apes on the centre row or a full robot),
  gamble **Red Wire or Blue Wire**.
- Fullscreen (button, F, Esc), Bonus Lab (L; every bonus, seeded or random, replay, Run all; separate LAB balance), Holder Pot v1 (1% of paid bets), Fair Play panel.

## Art status
Only six apes have Forever Twins on Bitcoin today. Everything else needs `tools/fetch-art.py` run on a computer with internet access; until then it shows a clearly marked
ART PENDING name tile. See `INTEGRATION.md` section 8.

## Folder
| Path | What |
| --- | --- |
| `index.html` | Test page: 3D studio, cabinet and screen views, lever, deck buttons, test LAYR stub, test panel |
| `pack.json`, `pack.js` | The machine as one `PX_MACHINE_PACKS` entry (`pack.js` assigns it to `window.RF_PACK` for the test page) |
| `dist/robot-factory.html` | The built game page (what `pack.json` carries gzipped) |
| `src/` | `game.js`, `style.css`, `cabinet.js` (cabinet builder), `model.json` (packed cabinet), `shared/` (engine + rules byte-identical to Deep Strata, LAYR adapter, etc.) |
| `art/` | `art.js` (bundled art), `apes/` (twin images), `apes-index.json`, `sources.json`, `logos-needing-permission.md` |
| `vendor/` | three subset, software renderer, XLOGO, the test LAYR stub, brand SVGs |
| `tools/` | `build.mjs`, `build-cabinet.mjs`, `make-art.py`, `fetch-art.py`, `fetch-apes.py`, checks (below) |
| `INTEGRATION.md` | Steps for adding it to the casino later (not carried out) |

## Checks
    node tools/build.mjs                                  # builds dist/, pack.json, pack.js; verifies the engine and rules SHA-256
    node tools/rtp-sim.cjs 5000000                        # seeded 5M-spin RTP + engine identity
    node tools/check-lab-plans.cjs                        # Lab reel stops vs the engine
    node tools/test-page.cjs http://localhost:8765/index.html dist/test   # end to end with screenshots (needs playwright)
