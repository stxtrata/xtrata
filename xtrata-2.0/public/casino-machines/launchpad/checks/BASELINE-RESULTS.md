> Historical evidence from the prior Launchpad edition. See [RESULTS.md](../RESULTS.md) for the Appendix A rebuild.

# Launchpad — build and validation results

**Machine 22 · Series Bible 2.1 · 3 November 2026**

The exact shared engine, two five-million-round return simulations, 19 game
state checks, five browser viewports, both fullscreen-fallback control
sessions and all four browser flow checks have passed. The final 12-item
capture run retains **53 images**, with all canvas-integrity checks passing,
zero recorded frame errors and zero mismatches between the requested bonus
stage and the completed painted frame. A separate final reduced-motion run
also passes all four stages. Independent visual review passes its focused
scope of 13 final normal frames and reduced-motion Play. Manual Cabinet-view
raycast checks also passed for the guarded launch key/lever and LAUNCH cap,
and the phone-width fullscreen Fund panel was visually verified. Native
fullscreen/device/GPU, subjective mechanical timing, listening and artwork
approvals remain open. The separate evidence below keeps completed functional
and scoped visual checks distinct from those remaining sign-offs.

## 1. Engine identity and pack

The `const BF = (() => {` through first `\n})();` engine span is **11,429
characters**. SHA-256:

`203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed`

The source, built `game.html`, and decoded `pack.json` game passed the span
check. See [engine.json](results/engine.json). The build report also
records this same hash. The final packaging step must rerun the hash check
after any subsequent build.

The engine was recovered from the existing Forever Twins pack and independently
matched against the current public room's Forever Twins, The Drop and Block
Fortune packs. **DOG Army's source was unavailable. Its source, build chain and
check scripts were not copied or compared directly.** Its deployed paths were
inaccessible, and no DOG Army folder was found in the checked public repository
trees. The unavailable template remains an explicit reference limitation.

| Package check | Recorded result |
| --- | --- |
| Seven required pack keys | `name`, `description`, `color`, `accent`, `model`, `game`, `css` |
| Gzip/base64 model and game decode | PASS |
| Model structure | `root`, `geometries`, `materials`, `textures` |
| Required model roles | `screenMesh`, `crest`, `spinPhysical`, `lever` present |
| Required actions | `spin`, `betUp`, `betDown`, `auto`, `pays` present; standalone `lab` also present |
| Model contents inspected | 49 geometries, 54 materials, 16 textures |
| Pack size | 764,969 bytes, about 0.730 MiB |
| Pack budget | 2,097,152 bytes / 2 MiB — PASS |
| Standalone page size | 2,041,350 bytes, about 1.947 MiB |
| Built game size | 617,392 bytes, about 0.589 MiB |

Sizes are from the build recorded at 17:10:14 UTC on 3 November 2026; later documentation or
packaging changes may alter them. [build.json](results/build.json) is
the machine-readable size/decode record. Work was confined to this independent
Launchpad folder and read-only reference copies. Casino integration was not
performed; the user's Mac checkout was not mounted for a repository-wide diff.

The downloaded public reference copies were checked against the retrieved Git
tree, with all 11 files matching their baseline Git blob hashes. See
[reference-unchanged.json](results/reference-unchanged.json). For the
two casino files, SHA-256 is:

- `casino/index.html`:
  `e7e83b2d888aaae700cb1a29c4d80f8642d9b37e87c4ed769792e4cade3719f4`.
- `casino/room.js`:
  `8ec5da84f86a4bc14cce3c234b62856b13a711a3614151a3f7daa1d68f2615f7`.

This establishes integrity of the downloaded references only, not the state
of the inaccessible Mac files.

## 2. Return simulations: 10,000,000 paid rounds

| Seed | Paid rounds | All spins including free | Wagered | Paid out | Actual RTP | Gate |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 20261103 | 5,000,000 | 5,293,648 | 500,000,000 | 472,297,529 | **94.4595058%** | PASS |
| 22012026 | 5,000,000 | 5,292,704 | 500,000,000 | 472,282,712 | **94.4565424%** | PASS |
| Combined | **10,000,000** | **10,586,352** | **1,000,000,000** | **944,580,241** | **94.4580241%** | PASS |

Both runs lie within ±0.3 percentage points of the **94.38% design estimate**.
This is a simulation result, not certified RTP. See
[seed 20261103](results/rtp-5000000-20261103.json) and
[seed 22012026](results/rtp-5000000-22012026.json).

The simulator called the unchanged engine's `start`, `settle`, `pick`,
`respin`, `collect` and `endFree`. It completed every triggered feature and free
spin, used the first three pick cells, and did not gamble. Only UI history was
cleared after each complete paid round; engine functions and mathematics were
not optimized or substituted. The runs took approximately 267 and 227 seconds.

The measured component reports group free-spin pick/hold payouts under pick
and hold, while their free field contains free line/scatter pay. The Bible's
component allocation groups those differently. Compare the aggregate RTP
directly; do not mislabel these component columns. The 10,000-round report is
a timing benchmark, not the required return gate.

## 3. Core and actual-game state checks

| Check | Result | Evidence |
| --- | --- | --- |
| Reload 20 pending engine rounds | PASS — same IDs, stops, payout and balance; second settle credits nothing | [engine-reload.json](results/engine-reload.json) |
| Private Lab scenarios and replay | PASS — all 12 items; forced scatter counts, retrigger, full grid, centre jackpot and both gamble outcomes | [lab-engine.json](results/lab-engine.json) |
| All five bet levels | PASS — 60 item × bet combinations | [lab-bets.json](results/lab-bets.json) |
| Actual game/account state integration | **19/19 PASS** | [state-flow.json](results/state-flow.json) |

The 19-check integration harness executes the actual engine, account adapter,
Lab and game script with a stand-in DOM, canvas and clock. It is a **Node state
and timer test**, not an actual-browser rendering test. It verifies:

- A pending result and its jackpot flag are committed before animation.
- Reload settles once, and another reload cannot pay again.
- Practice play and all 12 Run all items leave the real account snapshot
  unchanged; a simulated room round-log hook receives no practice starts.
- Replay keeps the recorded seed and bet despite edited options.
- Free-spin play resumes on reconnect; preview exit cancels queued callbacks.
- Failed storage writes retain the latest memory state.
- Auto plays exactly 25 spins when no bonus interrupts it.
- Account acquisition failure refuses activation and spending.
- Private forcing and pristine-engine objects are not exposed on `window`.
- Full play and Skip have identical outcomes for the six comparisons below.

### Exact Skip comparisons

Starting practice balance: **1,000,000**. Bet: **100**. Seed: `launchpad22`.
Pick choices are cells 0, 1 and 2 in both paths. Figures are resulting balances
for the complete round, including its initial paid spin and all features.

| Scenario | Played normally | Skipped | Result |
| --- | ---: | ---: | --- |
| Launch Window | 1,000,590 | 1,000,590 | PASS |
| Launch Window with retrigger | 1,003,650 | 1,003,650 | PASS |
| Pre-launch Seats | 1,001,300 | 1,001,300 | PASS |
| Graduation | 1,001,630 | 1,001,630 | PASS |
| Graduation full grid | 1,054,832 | 1,054,832 | PASS |
| Centre-row Graduation Day | 1,053,437 | 1,053,437 | PASS |

## 4. Actual browser: five viewport checks

**5/5 PASS**, recorded from 16:47:21 to 16:47:39 UTC on 3 November 2026 in
[views.json](results/views.json). These are actual iframe viewports,
real DOM measurements and real control handlers, using the standalone
**software renderer**. They are not mocked layout measurements.

At every size the harness verified the 40-iteration solver, pitch 0.16, screen
below the top bar, screen/deck/targets inside the viewport and above the
controls strip, a 9 px deck-to-controls gap through the explicit
`deckNearControls` assertion, all visible button targets at least 44 × 44 px, no sideways
scroll, bet **100 → 200 → 100**, and dispatch of CURVE, −STX, LAUNCH, +STX,
AUTO-APE and LAB, including stopping Auto. The JSON lists every measured
button individually; there were 22 visible buttons per viewport.

| Viewport | Screen size, px | Gap below top bar, px | Deck bottom to controls, px | Smallest deck target, px | Result |
| --- | --- | ---: | ---: | --- | --- |
| 1440 × 900 | 784.32 × 516.77 | 9.95 | 9.00 | 70.42 × 44 | PASS |
| 1366 × 768 | 624.73 × 411.70 | 9.96 | 9.00 | 56.06 × 44 | PASS |
| 1024 × 768 | 634.40 × 418.06 | 9.96 | 9.00 | 56.94 × 44 | PASS |
| 390 × 844 | 351.51 × 231.79 | 9.98 | 9.00 | 44 × 44 | PASS |
| 844 × 390 | 246.33 × 162.53 | 9.99 | 9.00 | 44 × 44 | PASS |

The initial portrait run exposed excessive space below the deck. The fit was
corrected and the deck alignment assertion added before this repeat run. The
earlier measurements remain in
[views-before-portrait-fit.json](results/views-before-portrait-fit.json)
as correction history; they are superseded by the five passes above.

### Portrait phone controls: 390 × 844

These are measured visible DOM targets, in CSS pixels. All 22 meet the
44 × 44 px minimum, including targets expanded around smaller cabinet meshes.

| Location | Control | Target width × height, px |
| --- | --- | ---: |
| Top bar | Cabinet | 53.00 × 44.00 |
| Top bar | Screen | 53.00 × 44.00 |
| Top bar | Fullscreen | 44.00 × 44.00 |
| Cabinet | CURVE / Pays | 50.08 × 44.00 |
| Cabinet | −STX | 44.80 × 44.00 |
| Cabinet | LAUNCH | 98.13 × 44.00 |
| Cabinet | +STX | 44.09 × 44.00 |
| Cabinet | AUTO-APE | 62.34 × 44.00 |
| Cabinet | LAB | 44.00 × 44.00 |
| Controls strip | −STX | 87.25 × 73.31 |
| Controls strip | LAUNCH | 370.00 × 73.30 |
| Controls strip | +STX | 87.25 × 73.31 |
| Controls strip | AUTO-APE | 87.25 × 73.31 |
| Controls strip | CURVE / Pays | 87.25 × 73.31 |
| Bottom navigation | Fair play | 118.66 × 56.86 |
| Bottom navigation | Turbo | 118.67 × 56.86 |
| Bottom navigation | Sound | 118.66 × 56.86 |
| Bottom navigation | History | 118.66 × 56.88 |
| Bottom navigation | Fund | 118.67 × 56.88 |
| Bottom navigation | Bonus preview | 118.66 × 56.88 |
| Bottom navigation | Lab | 118.66 × 56.88 |
| Bottom navigation | Test | 118.67 × 56.88 |

The physical-control dispatch test uses the visible DOM targets positioned
over the cabinet controls. Its measurements do **not** certify independent
raycast hit areas, lever drag feel, physical-device touch behavior or real-GPU
material appearance. The separate manual key/lever and LAUNCH-cap raycast
checks are recorded in section 5 below.

## 5. Actual-browser presentations, fullscreen and flows

The final capture pass, fullscreen control pass and flow pass are separate
runs. The last presentation edits moved the bonus panel below the practice
banner, separated the jackpot rocket from the amount, and added test-only
read-only metadata identifying the most recently painted scene. Engine,
account and control behavior were unchanged; the engine identity and 19 Node
state checks were rerun after the game polish.

| Evidence | Run on 3 November 2026, UTC | Scope | Result |
| --- | --- | --- | --- |
| [presentations.json](results/presentations.json) | 17:10:55–17:14:55 | Explicit `capture-only` mode: 12 Lab items, 53 final images; no fullscreen sessions in this run | PASS |
| [presentations-fullscreen.json](results/presentations-fullscreen.json) | 16:48:29–16:55:17 | Earlier accepted functional run: 12 Lab items plus desktop and phone fullscreen-fallback controls | PASS |
| [browser-flow.json](results/browser-flow.json) | 16:55:44–16:59:41 | Run all, reduced-motion activation, mid-spin reload/second reload and actual RTP Worker UI | 4/4 PASS |
| [reduced-motion-final.json](results/reduced-motion-final.json) | 17:17:51–17:17:56 | Final layout: reduced-motion jackpot with four exact painted-stage captures | PASS |

All these browser runs used the software renderer. They operated normal UI
handlers and public read-only diagnostics. Private practice scenarios supplied
RNG inputs to the unchanged engine; the tests did not inject completed results
or modify engine functions.

### Final Lab stage captures

The final report explicitly declares `mode: capture-only` and has no
fullscreen-session entries. All 12 Lab items passed. Every preview preserved
its complete saved account snapshot, and the entire capture-only run left the
account unchanged.

| Lab item | Recorded presentation | Final captures | Result |
| --- | --- | ---: | --- |
| Launch Window | Trigger, intro, play, summary | 4 | PASS |
| Launch Window with retrigger | Four free-spin stages plus a naturally occurring four-stage Seats feature | 8 | PASS |
| Pre-launch Seats | Trigger, intro, play, summary | 4 | PASS |
| Graduation | Trigger, intro, play, summary | 4 | PASS |
| Graduation full grid | Four Graduation stages followed by all four jackpot stages | 8 | PASS |
| Centre-row Graduation Day | Trigger, intro, play, summary | 4 | PASS |
| APE / FADE win | Trigger, intro, play, summary | 4 | PASS |
| APE / FADE loss | Trigger, intro, play, summary | 4 | PASS |
| Three Countdowns | Trigger, intro, play, summary | 4 | PASS |
| Four Countdowns | Trigger, intro, play, summary | 4 | PASS |
| Five Countdowns | Trigger, intro, play, summary | 4 | PASS |
| Fund | Information panel; unavailable reader values remain “checking” | 1 | PASS |

[stage-index.json](results/stage-index.json) identifies **53 final
files** in [stages/](results/stages/): 52 bonus-stage images and one
Fund-case canvas image, totaling **3,976,778 bytes**. The files are **1400 × 960
WebP** at quality **0.93**, from a **2800 × 1920** source canvas. DOM panel text
and bounds are recorded separately; a game-canvas image does not show an HTML
menu drawn above it.

All **53/53** final captures pass the status-panel integrity check. Four
positions spanning the lower panel—x = 100, 500, 900 and 1300 at y = 820 in
logical canvas pixels—have the expected opaque color. This specifically
checks for the previously leaked reel clipping region or an aborted draw.
The game-frame error listener recorded **zero uncaught errors**.

The capture harness now waits for the game to report a completed draw of the
requested scene and stage. Every one of the **52 applicable bonus-stage
images** matches its saved `renderedScene` kind and stage: **zero mismatches**.
Fund is an information panel and has no four-stage bonus requirement. This
addresses the earlier timing problem in which UI state could advance before
the canvas had painted it. These targeted checks supplement visual inspection;
they do not establish every aspect of artwork, animation or physical-device
legibility.

The final independent report,
[stage-visual-review.md](results/stage-visual-review.md), records a
**focused PASS for 13 final normal originals plus reduced-motion Play**.
It targets the former problems and confirms the unobscured practice warning,
separate jackpot rocket and award panel, and correctly painted pick/chain/
jackpot stages and both gamble Play screens. No remaining defect was found
in that inspected scope. This follow-up is not a claim that every one of the
53 new files was individually opened; the earlier full-thumbnail reviews
remain separately documented.

### Desktop and phone fullscreen controls

The completed fullscreen report is
[presentations-fullscreen.json](results/presentations-fullscreen.json).
Its image index is
[stage-index-fullscreen-run.json](results/stage-index-fullscreen-run.json),
with its earlier images preserved in
[stages-before-layout-polish/](results/stages-before-layout-polish/).
This report remains the evidence for the two full control sessions; the final
capture-only run does not claim to have repeated them.

| Viewport | Recorded fullscreen mode | Bottom controls | Menus | Feature cases | Result |
| --- | --- | --- | --- | --- | --- |
| 1440 × 900 | Fixed-viewport fallback; native `false` | 65 px high; every target at least 44 × 44 px | 7/7 inside frame and above controls | 6/6 PASS | PASS |
| 390 × 844 | Fixed-viewport fallback; native `false` | 211 px high; every target at least 44 × 44 px | 7/7 inside frame and above controls | 6/6 PASS | PASS |

Both sessions verified bet **100 → 200 → 100**, a regular spin, Auto start
and stop, Sound, volume, Turbo, no sideways scroll and Exit. Pays, Fair Play,
History, Fund, Bonus preview, Lab and Systems opened inside the frame and above
the bottom controls. Launch Window, Seats, Graduation, jackpot and both gamble
outcomes each completed four stages in both sessions. No uncollected regular
win was offered during these runs, so the conditional regular-win Collect
button has no separate pass claim here.

All **24 previews** in that earlier complete report—12 initial Lab items and
six feature cases per fullscreen session—preserved their complete account
snapshots. Its ordinary Spin/Auto control tests deliberately made four paid
spins: the overall account moved from 10,000 to **9,775** credits, with **400
wagered and 175 paid out**. That normal play is separate from preview isolation.

Both sessions explicitly report `native: false` and `fallback: true`. They
verify actual-browser fullscreen fallback and controls, not native browser
fullscreen, physical-phone touch/safe areas or GPU appearance.

### Four actual-browser flow checks

[browser-flow.json](results/browser-flow.json) records **4/4 PASS**
with zero test errors and zero recorded frame errors.

| Check | Measured result |
| --- | --- |
| Normal-speed Run all | All 12 items completed through visible controls; complete saved account unchanged |
| Reduced-motion jackpot | Systems toggle applied, trigger/intro/play/summary recorded, account unchanged |
| Mid-spin reload and second reload | Same pending round settled once with the same grid; one history entry; second reload left the checked state unchanged |
| Systems RTP Worker | Actual 10,000-round option/button produced **96.8301% observed RTP**; complete account snapshot unchanged |

The reload used genuine pending round
`d9782996eb318a48f33f9f12609920d0`, with stops **11, 8, 29, 22, 5**.
It preserved the exact embedded standalone page and QA account key across
both reloads. The account had 10,000 credits before the paid spin, **9,900**
after commitment, **9,900** after the first reload and **9,900** after the
second. Spin count changed from zero to one and stayed at one; the round
appeared in history exactly once. The second-reload comparison includes the
bank, spin count, wagered/paid totals, jackpot meters, pending result and
history. This is a real browser startup/storage check in addition to the Node
state tests in section 3.

The RTP check opened Systems, selected 10,000 paid rounds and clicked the
actual simulation button. Its separate Worker completed without an error and
displayed `Observed RTP: 96.8301%`. The run checks the Worker/UI connection and
account isolation; this small sample is **not** another ±0.3-point RTP gate
and does not replace the two five-million-round simulations.

### Final reduced-motion capture

After the presentation layout changes, the targeted reduced-motion check was
repeated on the final game. It passed in
[reduced-motion-final.json](results/reduced-motion-final.json), with
four images in [reduced-motion-final/](results/reduced-motion-final/).
All four report reduced mode active, exact painted-stage matches and passing
canvas integrity; no errors were recorded, and the account was unchanged.

The game source's reduced-motion branch caps jackpot particles at **three**.
That is a structural source check, not an automated count of visible pixels.
The new trigger, intro, play and summary captures provide separate visual
evidence of the selected mode. The final reduced Play frame was independently
inspected and passed its focused composition/warning review; a single still
does not prove the complete animation's temporal behavior.

### Manual cabinet inputs and phone Fund panel

[manual-browser.json](results/manual-browser.json) records three
manual checks in the actual browser. The cabinet checks used a **1024 × 768**
viewport and the software renderer; the Fund check used **390 × 844**
fullscreen fallback.

| Manual check | Recorded result | Status |
| --- | --- | --- |
| Guarded launch key / lever raycast | Direct Cabinet-view click at screenshot coordinate **645,552** started a 100-credit spin; balance **10,000 → 9,900**, settled round prefix `5ad64cc86c`, payout 0 | PASS |
| Physical LAUNCH cap raycast | Direct Cabinet-view click at **503,559** started a distinct 100-credit spin; balance **9,900 → 9,800**, settled round prefix `27f5f0871c`, payout 0; earlier history retained | PASS |
| Phone-width fullscreen Fund | Scrollable Fund panel visible at 390 × 844, fullscreen controls retained, unavailable reader values shown as **Checking** | PASS |

Retained evidence includes [cabinet-final.jpg](results/cabinet-final.jpg),
[screen-final.jpg](results/screen-final.jpg),
[phone-fund-final.jpg](results/phone-fund-final.jpg) and
[phone-fullscreen-final.jpg](results/phone-fullscreen-final.jpg).
Unlike the earlier canvas-only snapshots, the phone screenshots show the
actual HTML Fund panel and fullscreen controls.

The two cabinet input checks establish direct raycast dispatch and distinct,
single settled spins for the selected physical controls. They do not measure
the subjective 1,100 ms lever motion, dwell/bounce feel, mechanical audio or
physical-device touch. Software rendering and browser-sized phone views do
not establish real-GPU, native-fullscreen or actual-phone behavior.

### Correction history

The first failed metadata report remains in
[presentations-first-run.json](results/presentations-first-run.json).
It exposed Continue staying disabled on gamble summaries because a reveal
marker persisted, and a picker test advancing after an animation rejected a
tap. The game disables the button only during active play; the test waits for
readiness and an accepted choice. The first oversized PNG export could not be
retained, but its metadata and errors are preserved.

A later functionally passing run exposed a persistent canvas clip leak during
image inspection. It is archived as
[presentations-before-render-fix.json](results/presentations-before-render-fix.json),
[its index](results/stage-index-before-render-fix.json) and
[its images](results/stages-before-render-fix/). A cosmetic animation
could compute a negative reel phase when its RAF timestamp preceded the input
event's spin-start time; an exception could leave the reel clipping region
active. The fix uses one monotonic clock, clamps elapsed time to zero or greater,
and restores canvas state in `finally` blocks. Subsequent pixel/error checks
and independent inspection confirmed that clipping correction.

The next independent review identified a covered practice banner, early
jackpot rocket/text overlap and stale-stage captures. The final presentation
polish places the panel below the practice warning, moves the rocket left of
the award panel and waits for a completed painted stage before capture.
The final 53-file set replaces the earlier images for stage evidence, and the
focused independent follow-up confirms the three recorded visual defects are
resolved in the inspected frames. The review and its follow-up are recorded in
[stage-visual-review.md](results/stage-visual-review.md).

The earlier flow report
[flow-before-render-fix.json](results/flow-before-render-fix.json)
remains historical evidence only. The current accepted functional flow record
is `browser-flow.json`; the final visual follow-up is `reduced-motion-final.json`.
The shared engine span and hash remained unchanged through these corrections.

## 6. Artwork, data and service qualifications

The bundle contains **nine sourced original reel-art files** (seven STX.City
token logos, BLOCKS and the official Stacks SVG), eight runtime WebP
derivatives, and historical transaction records. It does **not** provide
approximately 18 independent artworks per engine slot. The focused set is
explicitly documented rather than presented as a larger collection.

The dated ranking covers **927 exact-suffix STX.City contracts** in a retrieved
996-record platform snapshot, including 53 graduated records. Its reported
`trading_volume` unit and time period were not independently established.
Teiko is the leading graduate within that eligible snapshot, not a verified
largest token by market capitalization or across both platforms. Faktory's
comparative token-list endpoint returned HTTP 401, so no cross-platform
ranking is claimed.

Faktory Seats use verified historical BLOCKS pre-launch data. The historical
launch had 20 seats; the game's nine prize choices are the unchanged engine's
pick mechanic and do not sell, award or promise actual seats. The side chart
plots seven historical Capy execution prices, not a live quote, full trading
history or an invented continuously rising price curve.

See [ART_REVIEW.md](ART_REVIEW.md), [art/sources.json](../art/sources.json) and
[LICENSES.md](LICENSES.md). Jim's final token shortlist review remains open.
Project permissions before public use remain outstanding for **Yeti, Building
Blocks, Bucket Coin, Capy, JACKAROO, BAO, Teiko Token, Stacks and BLOCKS**.
The supplied Xtrata mark and official Stacks SVG retain their original form;
the original files and derivative hashes are documented.

The required project asset
`machine-series/brand/parallax-casino-wordmark.svg` was unavailable. The
standalone host currently uses plain **PARALLAX CASINO** text, not an
authenticated official wordmark. No replacement logo was invented; this
brand requirement remains incomplete until the exact asset is supplied.

Launchpad has no twin NFT art, so NOT YET FOREVER art styling and cameo records
are not applicable. Unknown twin counts and last pay-per-twin display
**checking**. The Casino Service, shared ledger, verified fund snapshots and
claims are named future integration points. Current gameplay uses the exact
engine's local meters and a display-only type-W fund; no real payment, wallet
link or holder condition is connected.

## 7. Remaining sign-offs and exact limits

- Assess lever dwell/return/bounce feel and physical-device touch separately.
  Direct software-view raycasts for the guarded key/lever and LAUNCH cap, and
  DOM dispatch for the deck controls, are already verified; this is not an
  independent timing or tactile-quality sign-off.
- Perform a **real-GPU pass in both Safari and Chrome**, including cabinet
  materials, lighting, motion and performance. All five recorded viewport
  checks used the software renderer.
- Verify native browser fullscreen, and perform a real iPhone/Safari
  fullscreen-fallback and safe-area test. The two recorded sessions used
  fixed-viewport fallback; an iframe at phone dimensions does not establish
  actual iPhone behavior.
- **Listening sign-off is owed.** Audio currently uses procedural WebAudio
  fallbacks; no mission-control voice/chatter or external CC0 recordings are
  bundled. Code checks do not establish loudness, timbre, clipping or device
  audio behavior. See [sound-sources.json](../art/sound-sources.json).
- Complete Jim's artwork review and the recorded third-party permissions.
- Supply and apply the exact
  `machine-series/brand/parallax-casino-wordmark.svg` asset. Current host text
  is a plain label and does not satisfy the official-wordmark requirement.
- Compare with the actual DOG Army source when supplied; no exact-template
  comparison is claimed in this build.

These limits concern the evidence and remaining approvals. They must remain
visible even when the tested standalone gameplay is delivered.
