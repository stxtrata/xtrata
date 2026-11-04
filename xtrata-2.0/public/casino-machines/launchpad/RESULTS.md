# Launchpad · Series Bible 2.1 rebuild

Machine 22 · 3 November 2026

The rebuild starts from the previous Launchpad cabinet, game scenes and art snapshot. It adopts the engine file, shared LAYR account, compatibility guard and screen mark from the supplied Appendix A. Cabinet play uses a separate 10,000-credit standalone test account. The casino room is outside this package.

## Engine and pack

| Check | Result |
| --- | --- |
| Full engine file | `7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168` |
| Embedded BF block | 11,429 characters, SHA-256 `203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed` |
| Room patch anchors | Each of the five appears exactly once |
| Pack | Seven fields, game and model decode, under the 2 MiB budget |
| Cabinet roles | Screen, crest, spin assembly and lever plus five cap-and-face pairs. Lever excluded from deck actions. |

[Build output](checks/results/build.json) · [Independent engine check](checks/results/engine.json)

## Behaviour and browser checks

- The current game and account passed all 19 Node state checks, including a committed spin settling once on reload, practice isolation, Run all, and full-play versus Skip totals. [State results](checks/results/state-flow.json)
- The rebuild passed the Screen and deck suite at 1440×900, 1366×768, 1024×768, 390×844 and 844×390 in Chromium software rendering. The report records projected bounds, the visible button sizes, action dispatch and the 100 → 200 → 100 bet sequence. [Viewport results](checks/results/rebuild-run.json)
- Actual pointer tests passed on the first four viewports. At 844×390, the enlarged LAB target intercepted Auto. The corrected layout passed a dedicated pointer rerun at 844×390. [Pointer evidence before the fix](checks/results/rebuild-pointer-before-landscape-fix.json) · [Landscape rerun](checks/results/rebuild-pointer-844x390.json)
- A click on the guarded cabinet lever emitted its motion payload and settled one committed round. [Lever check](checks/results/rebuild-lever.json)
- Fullscreen fallback checks passed at 1366×900 and 390×844. Desktop controls fit one row, every tested control reached 44 px, and all eight panels opened above the bar and closed. [Fullscreen check](checks/results/rebuild-fullscreen-smoke.json)
- The current browser build completed Launch Window through its eight free spins and summary. A larger SwiftShader browser-flow run timed out during Run all. The current Node Run all and the earlier browser Run all passed. [Current Launch Window trace](checks/results/rebuild-launch-window.jsonl) · [Browser timeout](checks/results/current-flows.json)
- The earlier Launchpad edition passed all 12 Lab scenarios with 53 painted captures, full desktop and phone fullscreen-fallback sessions, reload and isolation checks, and the reduced-motion jackpot. These are baseline results for the reused presentation. [Baseline report](checks/BASELINE-RESULTS.md)

## RTP

Two seeded runs of 5,000,000 paid rounds on the same immutable engine produce **94.4595%** (seed 20261103) and **94.4565%** (seed 22012026). Both are within 0.3 percentage points of the published 94.38% design estimate. The detailed simulator groups feature payouts during free spins separately from the Bible's component display. The total is comparable.

[Seed 20261103](checks/results/rtp-5000000-20261103.json) · [Seed 22012026](checks/results/rtp-5000000-22012026.json)

## Art, services and sign-off

- The nine logos use the sourced artwork listed in [art/sources.json](art/sources.json). Jim's shortlist review and permission for Yeti, Building Blocks, Bucket Coin, Capy, JACKAROO, BAO, Teiko Token, Stacks and BLOCKS are open. Faktory's token-list access returned 401. Teiko's ranking covers the verified STX.City snapshot. The archive contains the historical BLOCKS seat and Capy buy records and an optional research refresh command. [Art review](ART_REVIEW.md)
- The fund is type W. The standalone meter accrues from test play and displays unknown twin counts and previous pay per twin as “checking.” Weekly snapshots, claims and shared jackpot settlement belong to the future Casino Service.
- WebAudio supplies countdown, rocket, lock, win and gamble cues. Mission-control voice recordings and listening sign-off remain open. Real-GPU Safari and Chrome, native fullscreen, physical iPhone use and room integration also remain open.

## Package guide

| File or folder | Role |
| --- | --- |
| `index.html` | Self-contained cabinet, screen and fullscreen test page |
| `game.html` and `pack.json` | Game surface and compressed room entry |
| `fund.json` | Weekly floor-wide fund configuration |
| `src/` and `vendor/` | Game, host, account, model and renderer sources |
| `tools/` | Rebuild, engine validation, RTP and optional source refresh |
| `art/` | Original artwork, runtime copies, provenance and transaction evidence |
| `browser-checks.html` and `checks/` | Reproducible checks, screenshots and recorded evidence |
| `README.md` and `INTEGRATION.md` | How to play, rebuild and hand off to the room |
