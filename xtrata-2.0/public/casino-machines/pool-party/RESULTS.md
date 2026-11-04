# Pool Party — build and verification results

**Version 2.1.1, corrected 3 November 2026. Standalone test build; casino integration is deferred as requested.**

## Result

This release corrects the reel animation in the playable page and room pack. The final room pack is **1,564,769 bytes (1.49 MiB)**, within the 2 MiB budget. The self-contained standalone HTML is **2,210,744 bytes (2.21 MB)**, including Three r128, the software fallback, the packed cabinet, game, exact official art and dated data. The game inside the pack is **467,722 bytes**.

Final fingerprints:

| Artifact | SHA-256 |
| --- | --- |
| Standalone `index.html` | `cd5f0f39aa0743239b840c57153574bb970a7e059f6cab7ededed265f0c621ab` |
| `pack.json` | `e741f477757fdd603b6e3d26122fa7ba138f1a4d7587240ef7ecec21c6c99eed` |
| Packed/self-contained game | `8ad450d4d23855ab720eb6f625443cda3611b643d3c352c81978da364c845b70` |
| Exact canonical engine source | `7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168` |
| Exact 11,429-character `const BF` block | `203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed` |

The canonical engine remains STATE_VERSION2, copied byte for byte from the supplied DOG Army reference. All five exact room patch anchors occur once. The final packed model contains187 nodes,89 geometries,60 materials and24 textures, with every required role and action.

## Version 2.1.1 — frozen reels correction

The original delivery scheduled both reel drawing and spin completion through the offscreen game iframe's own `requestAnimationFrame`. The visible cabinet only copied that canvas. A browser pausing the hidden frame could therefore accept a spin, commit its pending result and play sounds without moving or completing the reels.

The corrected game schedules one loop on the visible same-origin parent window and uses the game's own `performance.now()` for every callback. This keeps reel starts, scene timers and frame updates on the same clock. The loading transition uses that scheduler too. A direct game page keeps its local scheduler; a detached iframe stops requesting callbacks. No engine, wager, payout, reel-strip, saved-state or account-format change was made.

The regression explicitly suppresses only the offscreen child's animation callbacks. On the archived original, all five reel crops remained identical, the canvas revision advanced zero times and the pending spin never settled. On the corrected build with the existing CPU cabinet renderer, the five reels produced **5, 7, 8, 9 and 9** distinct sampled images while spinning; the canvas revision advanced 27 times. The round completed with one history entry and exactly `balance before − stake + win`. This is an intentionally injected browser-throttling case, not a claim that every tested browser naturally reproduces the freeze.

The ten source-function clock tests also pass: host scheduling, local time conversion despite divergent parent timestamps, waiting for the final reel, exactly one settlement, one successor callback, inactive/reactivated behavior, direct-page and inaccessible-parent fallback, and detached-frame cleanup. The final source/pack check passes all 17 engine and integration checks; both canonical engine hashes are unchanged.

The final native Chromium 140 sequence opened the exact standalone file offline at 1366×900, with the default WebGL cabinet, no `lite` query and no modified animation clock. All four control paths passed:

| Actual control path | Distinct sampled images on reels 1–5 | Round completion and accounting |
| --- | --- | --- |
| Cabinet SWAP button | 3, 3, 3, 3, 3 | Pass: one round, one history entry, exact debit/payout |
| Fullscreen SWAP button | 6, 6, 7, 7, 6 | Pass: one round, one history entry, exact debit/payout |
| Cabinet SWAP after leaving fullscreen | 3, 4, 4, 4, 4 | Pass: one round, one history entry, exact debit/payout |
| Physical cabinet lever | 2, 2, 3, 3, 3 | Pass: one round, one history entry, exact debit/payout |

Lever motion was observed. Playwright's background-throttling overrides were removed. These sampled counts prove changing reel images, not a frame-rate guarantee: SwiftShader renders this 3D scene slowly in the test environment. The run produced no JavaScript errors and logged two Fullscreen API policy warnings. It verified the expanded fullscreen game layer and return to the cabinet; native OS fullscreen was not separately asserted. In the report name, “native” means no animation-callback fault injection. Sequence evidence: `checks/results/reels-motion-fixed-native.json`.

The direct production `dist/game.html` page was also tested with no developer flag. Its local animation scheduler produced 15, 18, 21, 23 and 25 sampled moving reel images, completed exactly one round, and accounted for a 100-credit stake and 90-credit win as 100,000 → 99,990. Evidence: `checks/results/reels-motion-direct.json`; reproduce with `python3 checks/reels-direct-pool.py`.

Evidence: `checks/results/reels-motion-original-starved.json`, `reels-motion-fixed-starved-software.json`, `reels-clock.json`, and `engine-source.json`. The original failed result is deliberately retained to demonstrate the regression. The earlier feature, layout and return-simulation evidence below predates this correction. Those checks did not assert continuous reel movement in the hidden-frame cabinet path; the new checks cover that omission.

An additional WebGL run with the synthetic hidden-frame fault was inconclusive: Playwright timed out while scrolling the visible Spin button into view, before starting a round. It is recorded separately in `reels-motion-fixed-starved.json` and is not counted as a passed reel test. The regression runner uses the completed CPU-renderer starvation case, alongside the completed unmodified-clock WebGL case.

## Return simulations

These are fresh runs of the unchanged engine, not copied reference results. Each run completed every feature and the final paid spin's free-spin tail. Component accounting equals total paid out. No pending round remained.

| Seed | Paid spins | Completed free spins | Measured RTP | Jackpot hits | Required band |
| --- | ---: | ---: | ---: | ---: | --- |
| 20261102 | 5,000,000 | 294,184 | **94.137040%** | 39 | Pass:94.08–94.68% |
| 7 | 5,000,000 | 296,800 | **94.454737%** | 37 | Pass:94.08–94.68% |

94.38% remains a design estimate, not certified RTP. The Fair Play panel displays the supplied rounded component estimates and frequencies. The canonical engine doubles free-spin line/scatter wins; separate pick and hold prizes remain1×. That engine rule takes precedence over the treatment's broader wording.

Evidence: `checks/results/rtp-5000000-seed-20261102.json`, `rtp-5000000-seed-7.json`, `engine.json`, `engine-data.json`.

## Screen view and cabinet

The final screen-view suite passed all geometry assertions and **all25 physical button actions**:

| Window | Screen below header | Deck above footer | 4% side margin | Five action raycasts |
| --- | --- | --- | --- | --- |
| 1440×900 | Pass | Pass | Pass | Pass |
| 1366×768 | Pass | Pass | Pass | Pass |
| 1024×768 | Pass | Pass | Pass | Pass |
| 390×844 | Pass | Pass | Pass | Pass |
| 844×390 | Pass | Pass | Pass | Pass |

Every fit uses yaw0, pitch0.16,40-iteration bisection and the lintel allowance. Lever descendants are excluded from the deck bounds. All screen/deck corners are considered for the side margins. The short landscape layout keeps its header/footer compact instead of reducing the game to a tiny strip.

Actual pointer checks verified the cap and label moving together by−0.034 along deck-local z, returning after release, lever click reaching Spin, host lever/jet motion, the independent crest clock, and the API's simultaneous lever timing/button pulse. A separate11-check source/model suite executes the actual host spring and lever functions: full down stroke1.02rad, dwell, rebound, return, spin-group travel−0.05 and water-jet peak1.18 all pass.

**Rendering limitation:** CPU/SwiftShader frame timing can miss short animation peaks. The runtime mechanics check establishes action wiring, observable motion and return; the exact curve is checked separately. Smooth visual timing on real hardware is not claimed. The required real-GPU Safari/Chrome pass remains owed.

Evidence: `views.json`, `mechanics.json`, `mechanics-source.json`, `build/cabinet-report.json`.

## Fullscreen

The consolidated authoritative result is **`checks/results/fullscreen-summary.json`**.

- Desktop1366×768: one bar row, including active Happy Hour, Yield Farm, Deep Liquidity and gamble controls.
- Portrait phone390×844: four rows idle, five during the tested features; no horizontal overflow.
- Landscape844×390: two rows, including the widest feature/gamble states; no horizontal overflow.
- Actual targets are at least44px, including the volume range itself at48×44px.
- Native fullscreen targets the visible host HTML root. The fixed-frame fallback fills the viewport when native APIs are removed.
- Bets, real paid spin, autoplay start/stop, turbo, mute, volume, all eight panels, canvas picks, both gamble outcomes, Skip, Collect and Exit respond through the UI.
- Panels remain inside the fullscreen frame. The bottom bar does not obscure canvas balance/bet/win readouts.
- Full pool→Cannonball and direct Cannonball were retested with their summaries actually observed.
- Zero JavaScript errors in completed runs.

The original full-session report retains two superseded test-harness observation failures. Delayed test clicks passed through an automatic jackpot summary before the next observation. The corrected test waits through automatic play; both targeted retests pass. `fullscreen-summary.json` explicitly records the observations and resolution. Final layout checks re-verified the shortened secondary labels; the final ribbon-only canvas change did not change DOM or control geometry.

## Bonus presentation, Skip and practice safety

All13 Lab items completed through Run All in declared order. The run captured70 distinct item/stage images and produced62 LAB-marked history records. It observed the retrigger increasing awarded free spins from8 to12, the exact3/4/5 initial scatter demonstrations, all five planned Poolside showcase rounds and the Fund information event. Real account bytes, balance, meters, Fund and spin/RTP statistics were identical before and after.

| Same seed/choices | Played net change | Skip net change | Result |
| --- | ---: | ---: | --- |
| Yield Farm | 2,090 | 2,090 | Pass |
| Deep Liquidity | 1,600 | 1,600 | Pass |
| Full pool plus jackpot | 54,302 | 54,302 | Pass |
| Happy Hour | 1,340 | 1,340 | Pass |

Yield Farm comparisons use the same three picks. Skip opens remaining cards in index order; a different manual selection is allowed to pay differently.

A separate regression clicked Skip while the first Happy Hour free-spin result was committed but still animating. The machine retained the pending round id, settled it once, drained the remaining free spins, reached the summary and returned the same1,340 net result without changing the real account.

Reduced-motion Cannonball produced **zero dynamic particles**. Its calm drawing uses only three static water drops. The final top practice strip remains visible above both Yield Farm and Cannonball; five targeted banner/Fund checks pass.

Production safety was tested on `dist/game.html` without any developer flag: no `PoolParty`, `startLab` or `findStops` window helper; `api.dev=false`; hidden developer controls; refused Test action; public POOLS→Bonus preview works; End preview restores the entire persisted real account. Forcing remains closure-local and drives only the pristine practice engine through its own public start API.

Evidence: `lab-all.json`, `behavior-pool.json`, `behavior-pending-free.json`, `production-pool.json`, `banner.json`. Run All's page remained immutable while a later on-disk cosmetic build completed; the report retains that loaded-source fingerprint. The separate final banner suite checks the cosmetic revision.

## Persistence, offline and fallback

A real pending round and its `jackpot:{level,hit}` metadata were observed in storage before animation finished. Reload settled the same id once; a second reload did not credit or count it again. Observed spins were0→1→1, and Fund accrual0→1→1. Opening the preview stopped autoplay9→0.

The standalone page opened as `file://` with network disabled, made **zero external requests**, decoded its embedded gzip payloads, loaded all six official marks, changed bets, spun, settled and saved. Both normal WebGL and deliberately unavailable-WebGL paths drew and played. CPU fallback reload restored its saved round without duplicate settlement. All21 offline/fallback checks pass.

## Art, data and services

All24 art/data evidence checks pass. Official image hashes and exact token contracts match the bundled evidence. Each of the four record families contains18 dated records. APR remains null/unavailable, and tiles say APR UNAVAILABLE; APY has not been substituted. The twin count and last-period pay remain Checking when unresolved.

No outside-token-holder code or cameo record exists. The source account, compatibility, rendering and XLOGO helpers retain their supplied bytes. Only this standalone machine's directory was authored; no live casino or other machine was integrated or edited.

As the brief specifies, shared Casino Service, Fund snapshots/claims and refunds remain named service stubs. Local play-credit behavior is functional; the build does not perform on-chain settlement. Permissions remain outstanding for USDA,DIKO,CHA,VELAR,ALEX and STX. Audio is original procedural water/lounging synthesis with no sampled recording. Audible listening sign-off is still owed.

## Reproduce and review

See `checks/CHECKS.md` for commands. The playable/source archive contains the scripts and compact JSON reports. The separate visual-check archive includes an offline `index.html` gallery and proportionally resized WebP review images with original and review hashes. This preserves reviewability without adding the122MB of raw Lab PNGs to the main download.

Final remaining sign-offs: real-GPU Safari and Chrome sessions, listening on speakers/headphones, third-party logo permission before public release, and the separately scoped casino/service integration.
