# Launchpad — verified engine results

This is the engine and state-check portion of the build report. It does not
replace the visual, device, fullscreen, accessibility or real-GPU checks.

## Exact common engine

The Block Fortune v2 engine is unchanged. Its `const BF = (() => {` through the
first `\n})();` span is **11,429 characters** and has SHA-256:

`203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed`

`node tools/check-engine.mjs` verifies that span in source and any built game/pack
present. The completed pack must be checked again after the last build.

The source was recovered from the user's existing Forever Twins pack. The
current public GitHub casino's Forever Twins, The Drop and Block Fortune packs
independently contain that same span and hash.

**DOG Army was not supplied or recovered.** Its deployed source paths returned
HTTP 403, and it was not present in the public GitHub main tree or the checked
casino branches. This build must not be described as having read or copied DOG
Army's source/build chain. The available original engine and current public
host interfaces were used as verified references instead. The exact DOG Army
template remains a comparison/sign-off dependency.

## Full unchanged-engine return simulations

| Seed | Paid rounds | Spins including free spins | Paid out | Wagered | Observed RTP | ±0.3 percentage-point gate |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 20261103 | 5,000,000 | 5,293,648 | 472,297,529 | 500,000,000 | 94.4595058% | PASS |
| 22012026 | 5,000,000 | 5,292,704 | 472,282,712 | 500,000,000 | 94.4565424% | PASS |
| Combined | 10,000,000 | 10,586,352 | 944,580,241 | 1,000,000,000 | 94.4580241% | PASS |

Each simulation called the engine's own `start`, `settle`, `pick`, `respin`,
`collect` and `endFree`. Every triggered free spin and feature was completed.
Picks used cells 0, 1 and 2. No gamble was played. The only bookkeeping
optimization cleared history after a whole paid round was complete; no engine
function or outcome logic was changed. History clearing cannot change a result.

Reports: `results/rtp-5000000-20261103.json` and
`results/rtp-5000000-22012026.json`. Runtime was about 267 and 227 seconds.

The measured component fields group all pick and hold payouts together,
including features occurring within free spins. The free field includes free
line/scatter pay. This differs from the Bible's component allocation; aggregate
return is the direct comparison. The **94.38% remains a design estimate, not a
certified RTP**.

The 10,000-round result is a timing benchmark, not the required return gate.

## Engine persistence and private scenarios

| Check | Result | Evidence |
| --- | --- | --- |
| Reload 20 pending rounds | PASS — same round ID, stops, payout and balance | `results/engine-reload.json` |
| Settle each recovered round a second time | PASS — returns null; no credit added | `results/engine-reload.json` |
| Twelve Lab items | PASS — all applicable spins/features settle | `results/lab-engine.json` |
| Repeat scenarios with the same seed | PASS — identical engine outcomes | `results/lab-engine.json` |
| All twelve items at all five bet levels | PASS — 60 cases | `results/lab-bets.json` |
| Forced 3 / 4 / 5 scatters | PASS — exact counts from genuine reel stops | `results/lab-engine.json` |
| Free-spin retrigger | PASS — first free spin retriggers +4 | `results/lab-engine.json` |
| Full hold grid and centre-row jackpot | PASS — genuine engine jackpot paths | `results/lab-engine.json` |
| Gamble win/loss for odd and even calls | PASS | `results/lab-engine.json`, `results/lab-bets.json` |

`src/lab-scenarios.js` creates only a lexical `LaunchpadLab` object, not a window
property. It supplies fresh practice states and scripted RNG inputs to the
unchanged engine. It never injects grids, awards or completed outcomes.

## Actual game/account state integration

`node checks/state-flow.mjs` executes the actual engine, test account, private
Lab and game scripts together. The DOM and canvas are no-op stand-ins: these
checks exercise runtime state and timers, **not browser rendering or layout**.
The current source passes all 19 checks in `results/state-flow.json`:

- Pending outcome and jackpot flag are saved before animation.
- Reload settles once; a second reload cannot pay again.
- Practice play preserves the entire real account snapshot.
- Replay uses the recorded seed and bet despite newly edited options.
- Reconnecting resumes an interrupted live free-spin scene.
- Exiting preview cancels queued Run all callbacks.
- A failed storage write retains the newest in-memory state.
- Auto makes exactly 25 spins when no bonus interrupts it.
- Run all completes all 12 items without changing the real account.
- A simulated room round-log hook sees the real spin and no practice spins.
- Neither the private forcing module nor the pristine engine is exposed on
  `window`.
- Failed acquisition of the shared LAYR account refuses activation and cannot
  spend or start a spin.
- Six playing-versus-Skip comparisons produce identical balances:

| Scenario | Played balance | Skipped balance |
| --- | ---: | ---: |
| Launch Window | 1,000,590 | 1,000,590 |
| Launch Window + retrigger | 1,003,650 | 1,003,650 |
| Pre-launch Seats | 1,001,300 | 1,001,300 |
| Graduation | 1,001,630 | 1,001,630 |
| Graduation full grid | 1,054,832 | 1,054,832 |
| Centre-row Graduation Day | 1,053,437 | 1,053,437 |

These comparisons use a 1,000,000 practice balance, a 100 bet, seed
`launchpad22`, and the same first-three seat choices. UI rendering,
accessibility, real-browser storage and device fullscreen remain separate
checks.

## Host integration constraints

The recovered current public host uses packed `{root, geometries, materials,
textures}` data. A node's `role` becomes the `px-<role>` object name; `action`
becomes `userData.pxMachineAction`.

The current public room's round-log maps cover its original five machines;
Launchpad needs its own mapping when integrated. The recovered room does not
yet consume the new spring-cap `mechanics().buttons` data or the requested
lever timing curve. These host updates belong in `INTEGRATION.md`, not in this
standalone build.

## Later browser and delivery evidence

This note began as the engine-only report and was subsequently extended with
the actual-game Node state checks. It is not the final status list for browser
work. The actual-browser five-viewport suite has since passed; its raw record
is `results/views.json`. It uses software rendering and visible DOM control
targets. A repeat run after the portrait-fit correction verifies a 9 px
deck-to-controls gap at all five sizes; the current measurements and retained
earlier report are linked from the final results.

See [RESULTS.md](../RESULTS.md) for the current presentation/fullscreen,
Run all/reload/reduced-motion, device/GPU, listening, artwork and permission
status. Any completed browser evidence is recorded there independently; it
is not implied by the Node or engine PASS results above.

No casino write or integration was performed. The user's Mac checkout was
not accessible, so no claim of a verified repository-wide Mac diff is made.
