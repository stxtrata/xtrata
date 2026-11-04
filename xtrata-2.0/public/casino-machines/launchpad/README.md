# Launchpad · machine 22

Series Bible 2.1 standalone build, **3 November 2026**. A Stacks launchpad mission-control cabinet with a guarded lever, spring deck caps, rotating rocket topper and the unchanged Block Fortune v2 game engine. All wagering uses **LAYR play credits**; the −STX / +STX labels are theme copy.

## Open and play

Open **`index.html`** in a modern browser. The page embeds its game, model, art, Three.js and test account, so normal play works offline without installation. It requires the browser's `DecompressionStream('gzip')` API. `dist/index.html` is the same built page. `game.html` is the packed game surface. It uses the room account when framed. When opened directly, the Appendix A account adapter uses the browser’s shared local LAYR balance. Use `index.html` for the 10,000-credit standalone test.

The clearly labelled standalone account starts with **10,000 play credits** and saves locally. Use **Systems → Reset** when idle to restore the test balance. If browser storage is unavailable, the page uses an in-memory account and reports the limitation. No wallet, deposit or on-chain payment is connected.

| Control | Action |
| --- | --- |
| Cabinet / Screen | Orbit the cabinet, or use the numerically fitted screen-and-deck view |
| Drag / wheel in Cabinet view | Orbit / zoom |
| Lever or LAUNCH cap; Space | Start a spin |
| CURVE / −STX / +STX / AUTO-APE | Pays and rules / lower bet / raise bet / auto play |
| Fullscreen or F | Game fullscreen, with a fixed-viewport fallback |
| L or LAB | Standalone Bonus Lab |
| Esc | Close the active panel; leave fullscreen |

The game provides Sound and volume, Turbo, History, Fair Play, Fund, Bonus preview and reduced motion. Fullscreen contains its own controls and panels, including bonus actions and APE / FADE. Auto stops for a bonus, an opened panel, insufficient balance or leaving the page.

## Reel mapping and genuine sources

| Engine slot | Launchpad role | Bundled material |
| --- | --- | --- |
| `cherry` | Launch tier IV | Yeti |
| `lemon` | Launch tier III | Building Blocks |
| `chip` | Launch tier II | Bucket Coin |
| `block` | Launch tier I | Capy |
| `artifact` | Graduate | JACKAROO / BAO |
| `bitcoin` | Moonshot | Teiko Token |
| `wild` | STX | Original official Stacks SVG |
| `scatter` | Countdown | Successful historical Teiko deployment |
| `vault` | Pre-launch Seat | BLOCKS artwork and historical Faktory launch records |
| `chain` | Curve Step | Seven successful historical Capy buys |

The bundle retains **nine sourced original reel-art files**, eight compact WebP derivatives and historical transaction evidence. The separate Xtrata vector is supplied in the brief. Snapshot labels are dated 3 November 2026. Rankings use the retrieved STX.City dataset's reported-volume field; its unit and period are unverified. The side panel plots seven historical execution prices, not a live quote or complete curve history. See [ART_REVIEW.md](ART_REVIEW.md) and [art/sources.json](art/sources.json) for exact contracts, URLs, hashes, exclusions and limitations.

## Build and check

From this folder, with Node.js and Python/Pillow available:

```sh
python3 tools/build-cabinet.py
node tools/build-pack.mjs
node tools/check-engine.mjs
node checks/state-flow.mjs
node tools/rtp.mjs 5000000 20261103
node tools/rtp.mjs 5000000 22012026
```

The cabinet builder uses DejaVu fonts at the path declared in the script; adjust that build-time path on another system. No package install is required for the Node tools. Build outputs are `index.html`, `game.html`, `pack.json` and `dist/`. The pack budget is 2 MiB; measured sizes and decode results are recorded in `checks/results/build.json`.

Open **`browser-checks.html`** or **`dist/checks.html`** to use **Run five-size checks**, **Run presentation suite**, **Capture all stages**, **Check reduced motion**, or **Run reload / Run all checks** and download the reports. The full flow suite exercises Run all, a genuine mid-spin reload and second reload, reduced-motion jackpot and the Systems RTP Worker through its real 10,000-round UI control. The capture-only and reduced-only buttons provide focused visual follow-ups. Images use 1400 × 960 WebP at quality 0.93, with the 2800 × 1920 source dimensions recorded. The three `checks/browser-runner.html`, `checks/presentation-runner.js` and `checks/browser-flow-runner.js` files are test source; rebuild after changing them and keep the build unchanged during a run. The Node state suite uses a stand-in DOM and cannot establish browser appearance.

Recorded browser evidence is deliberately separated: **presentations.json** is the final 17:10:55–17:14:55 UTC capture-only run, passing all 12 Lab items with 53 indexed images, complete account isolation, zero painted-stage mismatches and zero frame errors. **presentations-fullscreen.json** records the earlier passing desktop/phone fullscreen-fallback control sessions. **browser-flow.json** records all four passing functional flow checks, including single settlement on reload and unchanged account after the real Worker run. **reduced-motion-final.json** adds four exact final painted-stage captures. Independent visual review passes its focused 13-frame normal sample plus reduced-motion Play, confirming the earlier clipping, warning, jackpot-layout and stage-capture defects are corrected in that scope. **manual-browser.json** records successful direct raycasts on the guarded key/lever and physical LAUNCH cap, plus the visible phone-width fullscreen Fund panel. Native fullscreen, physical-device/GPU, subjective lever timing and listening sign-offs remain separate. [RESULTS.md](RESULTS.md) and [CHECKS.md](checks/CHECKS.md) give the precise measurements, report scopes and outstanding approvals.

## Source layout and boundaries

`src/engine.js` is the immutable engine; `src/game.js`, `game.css` and `game-shell.html` implement presentation and controls. `src/lab-scenarios.js` supplies private practice scenarios. `src/host.*` and `test-account.js` implement the standalone studio and test-only account. `src/cabinet.json` and `cabinet-meta.json` describe the packed model. `tools/` rebuilds and verifies; `art/` retains sources and evidence; `checks/` retains reproducible checks. [INTEGRATION.md](INTEGRATION.md) describes later room work; [notes/DESIGN.md](notes/DESIGN.md) records design decisions.

This edition reuses the prior Launchpad cabinet, game presentation and sourced art. The engine, shared account, compatibility guard and canvas Xtrata mark come from the attached Appendix A. The build checks both engine hashes and the five patch anchors. The files are scoped to this standalone machine.

Jim's final shortlist review and project logo permissions remain open. The art set is focused and does not supply approximately 18 variants per symbol. The shared Casino Service, fund snapshots and claims remain future services; current fund information is display-only. Audio uses procedural fallbacks, with **listening sign-off owed**. See [LICENSES.md](LICENSES.md) and [art/sound-sources.json](art/sound-sources.json).
