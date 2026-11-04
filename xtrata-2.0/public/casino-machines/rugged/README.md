# Rugged

Machine 18 of the ParallaX Casino series: a bazaar rug stall for the oldest joke in crypto, turned into a rescue story.
Stacks art whose own link went dark is woven back into rugs, and the machine's Rescue Pot pays to put that art on chain for
good. It is a five-reel, twenty-line Block Fortune v2 slot (94.38% design RTP), built **standalone**: the casino is not touched
(see `INTEGRATION.md`).

## Open it
Serve this folder over http (a `file://` page cannot decode the pack) and open `index.html`:

    cd xtrata-2.0/public/casino-machines/rugged && python3 -m http.server 8790
    # then http://localhost:8790/index.html

- Drag to orbit; scroll or pinch to zoom.
- Click the loom beater (the lever) or WEAVE, or press Space, to spin.
- F is fullscreen, L is the Bonus Lab, and TEST opens the test panel.

`dist/rugged.html` is the game on its own, without the studio.

## The reels (every symbol is real material)
| Slot | Symbol | What it is |
| --- | --- | --- |
| `cherry` `lemon` `chip` `block` | Rescued rug, Tier IV to I | A real Bitcoin Birds twin from Xtrata, woven: each pixel of the bird is a knot, with a dyed border, fringe and a cloth wave. Tiers follow mint order (#300–399 up to #0–99), because the birds have no trait metadata. |
| `artifact` | Forever Twins ∞ | The Xtrata mark (XLOGO vector code) with ∞ on a brass medallion |
| `bitcoin` | Flying Carpet (jackpot) | A twinned bird woven as a landscape rug, lifted and rippling, gold-fringed |
| `wild` | WELSH | Welshcorgicoin's official logo, as named by the token's own metadata (never woven or recoloured) |
| `scatter` | 404 | A broken gilt frame round the dead page of the art link the contract still returns: `https://www.stacksart.com/assets/birds.json` |
| `vault` | Rolled rug | A twinned bird's rug, rolled and tied |
| `chain` | Knot | An original Turkish knot, its yarn dyed with a real bird's colours (named on the tile) |

Art is chosen with `Math.random` after the engine has fixed the result, so loaded art can never change a result.

## Bonuses (each with four stages: trigger, intro, play, summary; plus Skip, turbo and reduced motion)
- **404** (3+ broken frames): the screen glitches to the dead web page. Then each of the 8 free spins weaves a rescued rug back
  in, the page dissolving knot row by knot row. All wins pay 2×. Retriggers add 4, up to 24.
- **Unroll** (3+ rolled rugs): nine rolled rugs on the stall's shelves. Unroll three: each roll runs out across the shelf to
  reveal a real rescued rug and its prize.
- **Fully Woven** (5+ knots): the 15 cells are 15 bands of one real bird on a loom. The shuttle runs through each bare band; a
  hit ties the band's knots in with a thud. Weave all 15 to finish the rug, which wins the jackpot as well.
- **Magic Carpet Ride** (jackpot): the carpet lifts off the reels and flies a figure-of-eight over the bazaar under the stars.
  On the test page a 3D carpet also loops round the cabinet.
- **Pull or Hold** (gamble): someone tugs the rug three times. Call PULL (it whips away) or HOLD (it stays put). PULL is the
  engine's odd draw and HOLD its even draw. Losing shows "RUGGED!".

## Holder layer: the Rescue Pot
1% of every paid bet, weekly, funded from the house edge. Half is shared per twin among rescued collections' twin holders
(the twin count is read live from the Bitcoin Birds helper; a failed read shows as unknown). Half goes to the Forever Fund for
twinning listed collections that are not yet saved. The screen header shows ART SAVED and STILL AT RISK from
`rescued-list.json`. Cameos `{tokenId, xtrataId, collection, lineWin}` are recorded per round. Payouts are named stubs.

## Folder
| Path | What |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, cabinet and screen views, lever, deck buttons, test LAYR stub, test panel, Bonus Lab button |
| `pack.json`, `pack.js` | The machine as one `PX_MACHINE_PACKS` entry (`pack.js` assigns it to `window.RUG_PACK`) |
| `rescued-list.json` | The rescued list Jim approves: reason and evidence per collection |
| `dist/rugged.html` | The built game page (what `pack.json` carries gzipped); `dist/cabinet-*.png` cabinet previews; `dist/test/` check screenshots (WebP) |
| `src/game/01..06-*.js` | The theme layer in six parts (core and audio, weave and tiles, screen, scenes, play and panels, fullscreen/Lab/API) |
| `src/style.css`, `src/cabinet.js`, `src/model.json`, `src/shared/` | Styles, the cabinet builder and its packed output, and the casino's shared parts byte for byte (engine, LAYR adapter, XLOGO, browser check) |
| `art/` | `birds/bitcoin-birds/*.png` (all 400 twins, SHA-256 verified), `logos/welsh.png`, `art.js` (97 bundled), `manifest.json`, `fetched.json` (every read), `sources.json` |
| `vendor/` | THREE subset, SoftwareRenderer, XLOGO, the test LAYR stub, brand SVGs |
| `tools/` | `fetch-art.py`, `make-art.mjs`, `build-cabinet.mjs`, `build.mjs`, `rtp-sim.cjs`, `exact-rtp.py`, `check-lab-plans.cjs`, `test-page.cjs` |

## Build and check
    python3 tools/fetch-art.py                 # reads the registry, helper, contract and twins (needs xtrata.xyz)
    node tools/make-art.mjs                    # art.js, manifest.json, sources.json
    node tools/build-cabinet.mjs --preview     # src/model.json (+ dist/cabinet-*.png); needs playwright
    node tools/build.mjs                       # dist/, pack.json, pack.js; verifies the engine's SHA-256
    node tools/rtp-sim.cjs 5000000             # seeded 5M-spin RTP and the engine identity
    python3 tools/exact-rtp.py                 # exact RTP over all 33,554,432 reel positions
    node tools/check-lab-plans.cjs             # the Lab's scripted reel stops against the engine
    node tools/test-page.cjs http://localhost:8790/index.html dist/test
