# Corgi Kennel verification

3 November 2026 · ParallaX Casino machine 21 · Series Bible 2.1

The build starts from an existing Corgi Kennel implementation and updates it against the supplied complete brief. The cabinet and art remain independently playable offline with a 10,000-chip test account.

## Build and engine

- The build verifies the five exact room patch anchors, all required deck actions and model roles, the cabinet schema and both gzip payload round trips. `checks/results/build.json` records the exact byte counts. The pack is about 2.39 MB, under its 3 MiB budget and above the 1–2 MB target range.
- The entire Appendix A.1 file has SHA-256 `7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168`.
- The embedded 11,429-character BF block has SHA-256 `203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed`. The controller, build and Lab tests use this same engine. See `checks/results/engine.json`.
- Two fresh Appendix A.10 runs of 5,000,000 paid spins returned **94.1370%** (seed 20261102) and **94.4595%** (seed 20261103). Both are within 0.3 percentage points of the 94.38% design estimate. See `checks/results/rtp-appendix-*.json`.

## Standalone Chromium geometry

Software rendering was forced to exercise the no-WebGL route. The live screen and meter are projected canvas layers. They were visually checked after correcting Chromium’s backface culling of those layers.

| Viewport | Screen and deck geometry | Physical deck clicks |
| --- | --- | --- |
| 1440 × 900 | Pass | 5 / 5 |
| 1366 × 768 | Pass | 5 / 5 |
| 1024 × 768 | Pass | 5 / 5 |
| 390 × 844 | Pass | 5 / 5 |
| 844 × 390 | Pass | 5 / 5 |

The camera keeps a four-percent side margin, clears the top bar and aligns the deck’s front edge with the controls strip. On narrow portrait screens width limits zoom, leaving more room above the glass. The check uses actual pointer clicks at the projected physical cap centres and checks bet up, bet down, Pays, Auto and Spin separately. See `checks/results/current-viewport.json` and the `current-screen-*.png` captures.

## Practice and account behavior

| Suite | Result |
| --- | --- |
| Lab engine | 60 cases across all 12 events and five bets |
| Packed controller | 13 / 13, including Run All, Skip equality, preview isolation, reconnect and cancelled animation |
| Account lease | 10 / 10, including exclusivity, rollback and mid-spin reload |
| Prior browser scene evidence | Individual Lab scenes, Skip comparisons, panels and selected fullscreen features were captured in the earlier build. See `checks/results/scenes-final/` and the archived browser reports. |

At a 100-chip stake, the controller’s paired play and Skip runs matched at 1,590 chips for Community Takeover, 1,135 chips for Pedigree and 55,737 chips for the full-grid run. The controller’s reload test recovers the same round ID and verifies a single debit, fund contribution and settlement. The practice tests verify unchanged account bytes and zero calls to the room’s instrumented engine methods.

## Art and release items

- BABYWELSH and Phoenix Welsh are labelled as unavailable on their tiles. `art/ART-SOURCES.md` and `art/sources.json` include provenance and the permission list. All project logos and the Happy Welsh artwork require public-use clearance.
- The registry snapshot dated 3 November 2026 lists no Happy Welsh helper. Unverified eligible-twin counts display **checking**. The pooled Casino Jackpot, snapshots and claims use documented standalone stubs.
- Real-GPU Safari and Chrome checks, listening sign-off and live room integration acceptance remain open.

## Scope of browser acceptance

The current full browser sweep exceeded the runner’s 380-second timeout. The five viewport checks completed separately, and the current engine, controller and lease suites passed. Prior scene captures are retained as visual evidence for the inherited scenes. A complete current-build browser sweep of every bonus using only the fullscreen bar, plus native Safari and Chrome GPU testing, remains open.

The host uses the Appendix A.8 pitch and 40-iteration screen solve adapted to the cabinet’s deck front edge and physical hit targets. The supplied lever excerpt ends mid-function, so this package retains the working stop-and-rebound motion from the base build.

The direct local-file smoke test passed at 1366 × 900 and at 390 × 844 with touch and device scale 2. The brass grip started a committed spin, the fullscreen bet, Auto-Walk, Turbo and Sound controls responded, seven panels opened and closed at both sizes, and all measured bottom-bar controls were at least 44 px with no horizontal overflow. See `checks/results/current-file-smoke.json`.

## Winning payline overlay

Verified in fullscreen on headless Chromium. A deterministic two-line win displayed both gold traces in turn, with each trace stopping at the third reel, the last reel that paid. The overlay remained visible after five seconds and cleared on a subsequent losing spin. Engine, controller and lease checks passed after rebuilding the pack. See `checks/results/payline-overlay.json` and `payline-overlay.png`.
