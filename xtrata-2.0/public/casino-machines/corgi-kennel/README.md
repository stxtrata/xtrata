# Corgi Kennel

**ParallaX Casino · Machine 21 · Series Bible 2.1 standalone build**

A playable green-and-brass kennel-club machine, with a rotating Best in Show rosette, stitched leather lead, spring-loaded physical buttons, authentic WELSH-family artwork and three animated bonus games.

## Open and play

Open **index.html** in a current desktop browser. It contains the cabinet, renderer, artwork, audio, account test stub and game in one file. No installation or network request is required to play. An initial account receives **10,000 test LAYR**, once; an existing zero balance is not automatically refilled.

The extracted package includes editable sources, verification results and the casino pack.

Use **Cabinet** to orbit the full machine, **Screen** for the screen and physical deck, or **Fullscreen** for the complete touchscreen interface. Pull or click the brass lead, press the physical **FETCH** button, or press **Space**.

Paid paylines appear automatically. Each gold trace stops at the last paying symbol and shows its line number and award. Multiple wins cycle while the reels are idle.

| Control | Action |
| --- | --- |
| FETCH | Spin; advance the currently waiting feature action |
| −TREATS / +TREATS | Change the total bet: 20 / 40 / 100 / 200 / 500 |
| AUTO-WALK | Up to 25 paid rounds; stops for a bonus, insufficient balance, a panel or leaving the tab |
| PEDIGREE | Pay table, rules, all 20 paylines and Bonus preview |
| QUICK STEP | Turbo presentation |
| BRASS BAND | Sound on/off; volume is in Fullscreen and Settings |
| SHOW RECORD / History | Latest 50 actions; export the session record |
| THE FUND | Weekly type-W fund explanation and local display accrual |
| Bonus Lab / Bonus preview | All 12 practice scenarios, seeded/random, Replay and Run all |
| F | Enter/exit fullscreen |
| L | Open Bonus preview |
| M | Toggle sound |
| Esc | Close a panel, exit fullscreen or leave a preview |

The full developer **Test** panel exists only when the standalone host sets `PX_STANDALONE_TEST`. It can reset the play balance, simulate twin artwork states and run an independent return simulation. “∞ · TEST VISUAL ONLY” is explicitly a test override, not a claim that a twin exists.

## Game and bonus rules

The original Block Fortune v2 engine is unchanged: five 32-stop strips, five reels × three rows, 20 fixed lines and the original five bet levels.

- **Community Takeover:** three or more Day One records award eight free spins at 2×. A retrigger adds four, capped at 24 awarded spins.
- **Fetch!:** three or more LEO–WELSH symbols open nine balls. Pick three. Their values were dealt by the engine before the reveal.
- **Pedigree:** five or more pedigree symbols start hold-and-respin. New arrivals visibly lock and reset the counter to three. A complete 15-cell tree also wins the jackpot.
- **Best in Show:** five WELSH on the centre row, without wild substitution, or a full Pedigree grid.
- **Sit or Stay:** one optional 50/50 double-or-nothing call after a qualifying paid win. Sit = odd, Stay = even.

Every bonus has trigger, intro, play and summary stages. The summary never credits a win a second time. Skip reveals the same dealt outcomes; for unfinished Fetch! picks it chooses the lowest-numbered unopened balls. To compare a manual Fetch! run with Skip, use those same picks.

## Authentic symbol mapping

| Engine slot | Player-facing symbol | Source / presentation |
| --- | --- | --- |
| cherry | BABYWELSH | Exact contract verified; original image is unavailable, so LOGO PENDING is shown |
| lemon | gWELSH | Official metadata-linked artwork |
| chip | Phoenix Welsh | Exact contract verified; original image is unavailable, so LOGO PENDING is shown |
| block | sWELSH | Official metadata-linked artwork |
| artifact | WELSH CVLT | Official metadata-linked artwork |
| bitcoin | WELSH | Official GitHub logo in a rosette frame |
| wild | Happy Welsh | Ten individual, verified NFT images; desaturated and NOT YET FOREVER |
| scatter | Day One | Verified deployment record, Stacks block 39,013; dated snapshot |
| vault | LEO–WELSH | The genuine 4×4-pixel image supplied by its exact token metadata |
| chain | Pedigree | 15 selected real token contracts on the reels; 17 verified source records retained |

The ten Happy Welsh token IDs are **1, 3, 4, 5, 7, 8, 11, 12, 13 and 18**. Eight other attempted images could not be recovered and are not presented as bundled. Distinct real token contracts sometimes use the same official artwork; the build never claims those are distinct artworks.

The full exact-contract source list, permissions and dated evidence are in **art/ART-SOURCES.md**, **art/sources.json** and **art/metadata/**. The official registry snapshot contains no Happy Welsh helper. Unavailable live fund counts and prior-period rates show **Checking**, never a fabricated zero.

All project logos and Happy Welsh artwork need the requested public-use clearance. Two CC0 recordings provide the bark and applause; the brass stings are original synthesis. Audio credits are in **art/audio/LICENSES.md**. **Listening sign-off is owed.**

## Account, persistence and service boundaries

The game uses `window.ParallaxLAYRAccount` and the exact `E=LAYR.machine(GAME_ID,BF)` anchor. The standalone host supplies the authentic account adapter under unique test storage keys. The game does not introduce a separate real balance or wallet.

A paid result is saved before artwork or animation. Pending results survive reloads, retain their round IDs, and settle once. The account adapter writes the balance and resulting game state together. Bonus previews use a pristine copy of the engine functions, a separate practice state and disabled real persistence; no real round-log hooks, fund accrual or jackpot contributions are reached.

The **Casino Service is not implemented** in this build. BF v2’s local jackpot behaviour is preserved behind `casinoJackpot.get`, `contribute` and `settle` adapters. The engine already contributes its 2%; the adapters do not contribute again. A live pool across machines, snapshots, claims and on-chain payouts remain service/contract work.

The type-W fund displays 1% of this machine’s paid test bets, taken from the house’s share. Token holdings are never a gate. There is no Bitcoin address linking, token minimum, outside-holder payout or cameo ledger.

## Engine verification

The engine block is **11,429 characters** with SHA-256:

`203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed`

It was recovered from the official Xtrata source and independently matched to the public Forever Twins, Block Fortune and The Drop packs. The private/local **DOG Army folder was not available**, so no claim is made that its source or check scripts were copied. The available authentic references and the written 2.1 requirements were used to implement the host and presentation.

| Exact-engine sample | Paid spins | Observed RTP |
| --- | ---: | ---: |
| Seed 20261103 | 5,000,000 | 94.4223784% |
| Seed 20261104 | 5,000,000 | 94.4361688% |
| Combined | 10,000,000 | 94.4292736% |

Both samples fall within the requested ±0.3 percentage-point band around the **94.38% design estimate**. This is not certification. All simulation credit, balance and feature-completion invariants passed. Read **RESULTS.md** for the complete verification status, including browser limits.

## Rebuild

Node 20 or later is recommended. Install the build/test dependencies:

```bash
npm install
npm install --prefix checks
node tools/build-cabinet.mjs
node tools/build-pack.mjs
node tools/check-engine.mjs
node tools/check-lab.mjs
node tools/check-controller.mjs
node tools/check-lease.mjs
```

Repeat the long numerical checks with:

```bash
node tools/rtp.mjs 5000000 20261102
node tools/rtp.mjs 5000000 20261103
```

For the in-browser acceptance runner, serve this folder locally and open `checks/browser.html`:

```bash
python3 -m http.server 8000
```

The runner tests the five required viewport sizes, physical actions, all bonus stages, Skip equality, preview isolation, reduced motion, reload recovery and desktop/phone fullscreen. It can export JSON results plus captured game canvases. The command-line controller suite executes the **actual packed game and authentic account adapter** with DOM/canvas/audio mocks; it does not substitute a rewritten controller. Layout and GPU checks are separate.

`tools/refresh-art.py` refreshes exact-contract metadata and stages changed artwork for review. It retains verified snapshots when sources fail. Rebuild after accepting changed artwork. Do not replace the two missing logos with similarly named tokens.

## Packaging and integration

The pack format is exactly `{name, description, color, accent, model, game, css}`; `model` and `game` are gzip + base64. The budget is **3 MiB** for `pack.json`. Fifteen pedigree records were selected for the runtime to keep genuine artwork offline without including two large photographic variants; all seventeen source records remain available.

The single-file page embeds the same model and game as the pack. It uses official **Three r128**, ACES tone mapping at **1.15**, linear output, and a software renderer when WebGL is unavailable. The software host projects the live screen and meter as crisp canvases over the same 3D planes. WebGL rendering is capped at approximately 30 fps. The software fallback caches unchanged screen/meter pixels and samples cabinet geometry at 5–10 fps while keeping the live game canvas eligible for 30 fps updates.

No casino files were changed. **INTEGRATION.md** records the later room changes, including modern button/lever mechanics, the game-owned fullscreen hand-over and round-log mapping. Do not present the pack as integrated or publicly cleared before those steps and the remaining sign-offs are complete.

## File-by-file guide

| File | Purpose |
| --- | --- |
| `index.html` | Complete offline standalone machine, including the 3D cabinet and isolated play account |
| `pack.json` | Casino-ready model/game payloads and presentation fields; integration is a separate step |
| `pack.js` | JavaScript wrapper around the same pack for development |
| `src/engine.js`, `engine.sha256` | Exact immutable BF v2 engine and reference checksum |
| `src/game.js` | Actual game controller, canvas artwork, bonus scenes, panels, service boundaries and fullscreen bar |
| `src/game.css`, `src/game.html` | Game-owned responsive UI and accessible dialog/control structure |
| `src/lab-rng.js` | Private seeded/random practice scenarios using valid original-engine draws |
| `src/layr-account.js` | Authentic shared room account script; unchanged for the game pack |
| `src/cabinet.js` | Editable Three.js cabinet construction, named parts, materials, deck caps and lead lever |
| `src/model.json`, `src/model-stats.json` | Packed cabinet output and geometry/material counts |
| `src/host.html`, `src/host.css`, `src/host.js` | Standalone studio, camera solver, physical interaction, live textures and frame ownership |
| `vendor/three-r128.min.js`, `vendor/three-LICENSE.txt` | Official bundled Three r128 and its licence |
| `vendor/software-renderer.js` | WebGL-less cabinet renderer |
| `vendor/xlogo.js` | Original Xtrata vector mark used by the cabinet builder |
| `vendor/layr-test-stub.js` | Test-only account adapter with isolated keys and safe document hand-over |
| `art/assets.json` | Verified symbol/pedigree/NFT/audio mapping used by the builder |
| `art/sources.json`, `art/ART-SOURCES.md` | Exact artwork sources, retrieval dates, provenance and permissions list |
| `art/*.webp`, `art/brand/`, `art/metadata/` | Bundled genuine artwork and original source evidence |
| `art/audio/` | Bark/applause recordings and licence records |
| `fund.json` | Type-W, all-live, Monday 00:00 UTC weekly fund configuration |
| `tools/build-cabinet.mjs`, `tools/build-pack.mjs` | Reproducible model and standalone/pack builders |
| `tools/check-engine.mjs`, `tools/check-lab.mjs`, `tools/check-controller.mjs`, `tools/check-lease.mjs` | Exact-block, original-engine practice, actual-controller and reload-ownership regressions |
| `tools/rtp.mjs` | Appendix A.10 seeded return simulation |
| `tools/check-browser.cjs` | Playwright viewport, physical deck and browser acceptance runner |
| `tools/refresh-art.py` | Guarded exact-contract artwork refresh and review staging |
| `tools/render-cabinet.mjs` | Static software cabinet render for inspection |
| `checks/browser.html`, `checks/browser-checks.js` | In-browser acceptance controls, pinned-build reloads and scene-capture export |
| `checks/results/` | Retained numerical, controller, browser and visual evidence |
| `brief/` | Unedited machine brief and Series Bible 2.1 supplied for this build |
| `checks/reference-provenance.json` | Dated official reference URLs and source checksums |
| `BUILD-PLAN.md`, `checks/ACCEPTANCE-MATRIX.md` | Initial design plan and required evidence checklist |
| `RESULTS.md` | Actual verification outcomes and explicit outstanding sign-offs |
| `INTEGRATION.md` | Exact later room steps; no casino integration is performed by this package |
| `package.json`, `checks/package.json` | Build and test dependencies; runtime play needs neither |
| `dist/corgi-kennel-game.html` | Extracted game payload for inspection; use `index.html` to play the standalone machine |
