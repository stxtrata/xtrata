# Launchpad check suite

Run commands from the Launchpad folder. Preserve every result in `checks/results/`.
Use an isolated standalone QA account for browser checks. No wallet or real
funds are involved. Never enable test-only flags in a production room.

## Baseline coverage and retained evidence

| Layer | Status | Evidence and limits |
| --- | --- | --- |
| Common engine identity | PASS | `results/engine.json`; exact 11,429-character span and full SHA-256 |
| Pack decode and budget | PASS | `results/build.json`; seven-key pack, gzip model/game, below 2 MiB |
| Two 5,000,000-round simulations | PASS | `results/rtp-5000000-20261103.json` and `results/rtp-5000000-22012026.json` |
| Engine-only Lab and reload | PASS | `results/lab-engine.json`, `lab-bets.json`, `engine-reload.json` |
| Actual game/account state logic | 19/19 PASS | `results/state-flow.json`; Node stand-in DOM/clock, not browser layout |
| Actual-browser five-size layout/deck | 5/5 PASS | `results/views.json`; software rendering; DOM target dispatch |
| Final Lab stage capture | 12/12 PASS | `results/presentations.json`; explicit capture-only mode, 53 images, no fullscreen sessions in this run |
| Final canvas integrity and painted-stage match | 53/53 integrity PASS; zero frame errors or applicable stage mismatches | `results/stage-index.json`; 52 bonus-stage images plus one Fund-case canvas |
| Desktop/phone fullscreen-fallback controls | 2/2 PASS | `results/presentations-fullscreen.json`; both sizes, seven menus per size and six features per session |
| Actual-browser Run all/reload/reduced motion/RTP Worker | 4/4 PASS | `results/browser-flow.json`; zero test/frame errors; actual Worker UI and browser storage |
| Final reduced-motion capture | PASS | `results/reduced-motion-final.json`; reduced-only mode, four exact painted-stage matches and unchanged account |
| Independent final-image review | Focused PASS | `results/stage-visual-review.md`; 13 final normal originals plus reduced-motion Play inspected; not a review of every new frame |
| Manual cabinet inputs and phone Fund | 3/3 PASS | `results/manual-browser.json`; direct key/lever and LAUNCH-cap raycasts, plus visible phone-width Fund panel; software renderer |
| Real-GPU Safari/Chrome | OWED | No real-GPU sign-off yet |
| Native fullscreen, physical iPhone and audio listening | OWED | Recorded sessions used fallback; dimensions/code checks cannot substitute for these |

The current rebuild results are in [RESULTS.md](../RESULTS.md). The longer historical account is in [BASELINE-RESULTS.md](BASELINE-RESULTS.md).

## Rebuild browser entry points

With Playwright and Chromium installed, run the scripts from the machine folder. Set `PLAYWRIGHT_MODULE` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` only when using a custom installation.

- `node checks/current-viewport.cjs` checks physical pointer dispatch at five sizes. Add `844x390` to check that one size.
- `node checks/current-fullscreen.cjs` checks both fullscreen fallback layouts and panels.
- `node checks/current-lever.cjs` checks the guarded lever raycast and committed round.

## 1. Rebuild and verify the immutable span

```sh
python3 tools/build-cabinet.py
node tools/build-pack.mjs
node tools/check-engine.mjs
```

The cabinet builder needs Python/Pillow and its configured font path. The
Node tools use built-in modules. The engine tool checks source, built game and
the decoded pack whenever those outputs exist. Required span:

- Length: **11,429 characters**.
- SHA-256: `203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed`.

Run the hash/decode checks once more after the final build. Do not edit or
replace engine code to make a hash or return test pass.

## 2. Return simulations

```sh
node tools/rtp.mjs 5000000 20261103
node tools/rtp.mjs 5000000 22012026
```

These call the unchanged engine, including all free spins and both features.
The completed measurements are **94.4595058%** and **94.4565424%**, both within
±0.3 percentage points of the 94.38% design estimate. Aggregate over ten
million paid rounds: **94.4580241%**. The small 10,000-round file is a timing
benchmark, not an RTP gate. Component grouping is explained in each report.

## 3. Actual-game state regression tests

```sh
node checks/state-flow.mjs
```

This loads the real engine, account, scenario and game scripts into a Node
context. Rendering and DOM layout are stand-ins. It verifies commit-first,
reload idempotence, preview isolation, Replay, callback cancellation,
free-spin reconnect, storage failure fallback, 25-spin Auto, all Run all
items, room-hook isolation, rejected account acquisition and six exact Skip
comparisons. It writes `results/state-flow.json` and exits nonzero on failure.

Do not describe this as a browser, touch, animation-quality or fullscreen
layout test. Its strength is precise state/timer assertions.

## 4. Five-size actual-browser check

Open `browser-checks.html` or `dist/checks.html` through the supported preview
or a local HTTP server. Use **Run five-size checks**. The harness loads the
standalone into real viewports at:

1. 1440 × 900
2. 1366 × 768
3. 1024 × 768
4. 390 × 844
5. 844 × 390

It asserts solver iterations/pitch, screen and deck containment, a 9 px
deck-to-controls gap through `deckNearControls`, 44 px touch
targets, no sideways scroll, the 100 → 200 → 100 bet change and all physical
DOM target actions. Download the report as `results/views.json`.

Current report: **5/5 PASS**, recorded on 3 November 2026 from 16:47:21 to
16:47:39 UTC, software renderer. Every visible button is listed
with dimensions. These dispatch tests click the visible DOM targets aligned
with the cabinet. The separate direct-pointer checks of the key/lever and
LAUNCH cap are now recorded in `results/manual-browser.json`; subjective
mechanical timing and physical-device touch remain separate.

All five current measurements place the deck bottom **9.00 px** above the
controls strip. The earlier portrait gap was corrected; its superseded record
is retained as `results/views-before-portrait-fit.json`. The current report
asserts the corrected deck position as well as containment and minimum target
size. The complete 390 × 844 phone control table is in RESULTS.md.

## 5. Actual-browser presentations and fullscreen

The test-only module `checks/presentation-runner.js` exposes
`runPresentationChecks(outerIframe, notify, options)`. The browser runner
provides isolated QA accounts and downloadable reports. Never include the
QA module in `pack.game`.

| Browser control | Scope |
| --- | --- |
| **Run presentation suite** | Twelve Lab items, account isolation and desktop/phone fullscreen sessions |
| **Capture all stages** | Twelve Lab items and all applicable stage captures; explicitly `capture-only`, without repeating fullscreen sessions |
| **Check reduced motion** | Targeted reduced-motion jackpot run, four painted-stage captures and account isolation |

Fund is an informational panel with no four-stage wager sequence. Full-grid
Graduation includes the subsequent jackpot sequence; the seeded retrigger
case also produces a nested Seats feature.

### Current accepted evidence

The final **17:10:55–17:14:55 UTC** capture-only run on 3 November 2026 is
`results/presentations.json`. It passed all **12 items**, preserved every
preview's account snapshot and left the complete account unchanged across the
whole run. Its **53 final WebP images** occupy **3,976,778 bytes** and are
indexed by `results/stage-index.json` in `results/stages/`.

Every final capture passes the four-point lower-status-panel pixel check;
all **52 applicable bonus-stage images** match the completed `renderedScene`
kind/stage. There are **zero stage mismatches, zero test errors and zero
recorded frame errors**. The capture waits for a completed paint, not merely
an updated UI state. Fund is the remaining information-panel case. These
checks detect the prior clip leak and stale-frame regression; they do not
replace visual inspection.

Fullscreen evidence is deliberately separate:
`results/presentations-fullscreen.json`, recorded **16:48:29–16:55:17 UTC**,
passes both **1440 × 900 and 390 × 844** sessions. Both report `native: false`
and `fallback: true`, seven contained menus, minimum 44 px targets, bet changes,
Spin/Auto, sound/volume/Turbo and Exit. Each session completes six feature
cases. All 24 previews across that full report preserve their account
snapshots; its deliberate ordinary spins are not practice. The corresponding
older images are indexed by `results/stage-index-fullscreen-run.json` in
`results/stages-before-layout-polish/`.

Independent final review in `results/stage-visual-review.md` passes its
focused scope: **13 final normal originals plus reduced-motion Play**. It
confirms the full practice warning, separate rocket/amount composition and
corrected stage examples, including both genuine gamble Play screens. It
does not claim every one of the 53 new images was individually opened. The
prior broader thumbnail reviews and failed evidence remain in the correction
history described in RESULTS.md.

Keep the preview build unchanged while a suite runs: a live-reload rebuild
terminates the active test. Save the full JSON, or extracted WebP captures and
metadata, without discarding failed cases. Images use **1400 × 960 WebP at
quality 0.93**, with the **2800 × 1920 source/backing dimensions** recorded.
These are game-canvas images; HTML menus and fullscreen controls are measured
separately. Syntax checking alone is not a browser pass.

## 6. Actual-browser flow and final reduced motion

The test-only `checks/browser-flow-runner.js` exposes
`runBrowserFlowChecks(outerIframe, notify, options)`. **Run reload / Run all
checks** runs four functional checks. The completed **16:55:44–16:59:41 UTC**
report is `results/browser-flow.json`: **4/4 PASS, zero test or frame errors**.

1. Run all completes every one of the 12 items at normal speed through the
   visible Lab controls and preserves the complete saved account.
2. The Systems reduced-motion toggle applies to the jackpot; four stages
   complete and the saved account remains unchanged.
3. A genuine paid spin is reloaded mid-animation, preserving the exact
   embedded page and QA key. Pending round
   `d9782996eb318a48f33f9f12609920d0` settles once with the same grid. One history
   entry and one spin remain after a second reload; the checked account state
   does not change again.
4. Systems selects **10,000 paid rounds** and clicks **RUN SIMULATION** in its
   actual separate Worker. It displays **96.8301% observed RTP** without an
   error and leaves the complete account snapshot unchanged. This is a
   functional browser Worker/UI check, not another return-tolerance gate.

Any naturally triggered feature is completed through normal controls before
the Worker baseline. Do not inject a result or bypass the engine to obtain a
convenient test outcome. For embedded `srcdoc`, reload the whole standalone
frame with the same bytes and QA identifier. Reloading only the inner game
could leave the host with an old API/canvas reference.

After the final layout polish, **Check reduced motion** was run separately at
**17:17:51–17:17:56 UTC**. Its explicit `reduced-motion-only` report is
`results/reduced-motion-final.json`, with four images in
`results/reduced-motion-final/`. All four exact painted-stage and integrity
checks pass, reduced mode remains active, no errors are recorded, and the
account is unchanged. This one-check targeted report supplements the full
four-check flow report; it does not claim to repeat Run all, reload or Worker.

Keep the **three-particle source cap** distinct from observed motion. The
source draws three fixed, unrotated rectangles in reduced mode; a still is
not an automated pixel count or proof of the whole animation over time.
The inspected final reduced Play frame passes its focused visual review.
`results/flow-before-render-fix.json` remains historical evidence only.

## 7. Manual/device sign-off

The completed manual record, `results/manual-browser.json`, has **3/3 PASS**.
In the 1024 × 768 Cabinet view, direct raycast clicks on the guarded launch
key/lever and physical LAUNCH cap each produced a distinct settled 100-credit
spin, moving the balance 10,000 → 9,900 → 9,800. At 390 × 844, the scrollable
fullscreen Fund panel remained visible with its controls and unknown values
labelled Checking. Evidence is `results/cabinet-final.jpg`, `screen-final.jpg`,
`phone-fund-final.jpg` and `phone-fullscreen-final.jpg`.

These observations use the software renderer and verify dispatch/presentation,
not subjective 1,100 ms lever timing, audio, native fullscreen or physical
device behavior. Remaining sign-offs are:

- Assess spring travel and lever dwell/return/bounce feel on the target setup;
  check direct touch on a physical device.
- Inspect every retained bonus-stage capture for legibility, clipping,
  placeholder art and coherent transitions.
- Check fullscreen on real desktop Safari/Chrome and iPhone Safari, including
  native/fallback behavior, safe areas, panels and Exit/Esc.
- Test with a real GPU; the saved five-size report uses software rendering.
- Listen to all sounds and check mute, volume, clipping and repeated cues.
  Mission-control chatter is not currently bundled.
- Complete the art shortlist review and permissions listed in
  `art/sources.json`, supply the unavailable official ParallaX wordmark asset,
  and compare the source with DOG Army when available.

These remaining sign-offs are open until their specific evidence is recorded.
