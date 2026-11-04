# Pool Party checks

The JSON reports in `results/` are the actual executed evidence. `fullscreen-summary.json` consolidates the full session, final-layout and corrected jackpot observations; read it before interpreting superseded observations in the first full-session report.

## Pure source, data and math

Run from the machine folder with Node.js:

```sh
node tools/check-engine.mjs
node checks/engine-data.mjs
node checks/engine-data-art.mjs
node checks/mechanics-source.mjs
node checks/reels-clock.mjs
node tools/rtp.mjs 5000000 20261102
node tools/rtp.mjs 5000000 7
```

The last two commands are real five-million-paid-spin simulations. They can take several minutes. The stored results already cover the final unchanged core, so a presentation-only change does not require repeating them.

## Browser checks

Install Python Playwright and Chromium. Set `CHROME` to a Chromium executable, or let `run-browser-checks.py` locate Playwright's installed browser. The runner maps both CHROME and CHROMIUM_PATH for the individual scripts and runs suites sequentially to avoid software-renderer contention.

```sh
python3 checks/run-browser-checks.py
```

Individual suites:

| Script | Scope |
| --- | --- |
| `reels-motion-pool.py` | Actual local-file cabinet Spin; independent pixel hashes from each reel; spin completion |
| `reels-motion-pool.py --starve --software` | The same check with the existing CPU cabinet renderer while deliberately suppressing only the hidden child frame's animation callbacks |
| `reels-motion-pool.py --sequence` | Additional fullscreen, return-to-cabinet and physical lever rounds |
| `reels-direct-pool.py` | Direct production `dist/game.html` spin, local scheduler, reel pixels and exact balance accounting |
| `views-pool.py` | Five viewports; all action raycasts; screen/deck/header/footer margins |
| `mechanics-pool.py` | Actual pointer, cap/label motion and lever/crest/jet observations in CPU fallback |
| `behaviour-pool.py` | Skip equivalence, persistence, account isolation, reduced motion, autoplay stop |
| `behaviour-pool.py --pending-free-only` | Skip during an already committed free-spin animation |
| `production-pool.py` | Public preview safety with no developer flag |
| `fullscreen-pool.py` | Full desktop/phone/native/fixed-fallback sessions |
| `POOL_QA_MODE=layout … fullscreen-pool.py` | Active desktop, portrait and landscape control fit |
| `POOL_QA_MODE=retest … fullscreen-pool.py` | Full pool and direct Cannonball summaries |
| `fallback-pool.py` | Offline local-file, WebGL and forced CPU fallback |
| `lab-all-pool.py` | All13 items with real UI, auto-advance, source fingerprints and stage captures |
| `banner-pool.py` | Final practice ribbon over pick/jackpot scenes and the Fund dialog |

Most scripts start their own temporary local server in the same process. The offline suite intentionally uses `file://`. No fabricated art or test-only result mutation is used; bonus setup uses the public preview UI and its canonical scripted RNG. Diagnostics are read-only.

The reel-motion suite also opens the actual standalone file with networking disabled. It removes Playwright's background-throttling overrides, observes actual per-reel pixels during spins, and checks completion through the real controls. `--starve` is an explicitly injected browser-throttling failure, not a native-browser claim. The archived original failed that test; the corrected release must pass it. `--original` is an optional comparison mode that requires the separately retained original delivery at `../recovered/Pool-Party.html`. `--software` selects the existing CPU renderer and `--lite` selects the existing reduced renderer setting; those reports are labelled separately.

`reels-clock.mjs` executes the actual scheduler and animation functions with independent window clocks. Its ten checks cover the hosted and standalone paths, clock-origin mismatch, settlement once after the final reel, one successor callback, inactive/reactivated behavior and detached-frame cleanup. These are timing/lifecycle checks, separate from visible browser movement and account checks.

`mechanics-source.mjs` executes the exact spring/lever functions extracted from the host and tests model role/axis relationships. This is separate from rendered view testing. Software rendering can skip short peak poses, so the runtime check establishes observed movement/return and the source check establishes the full down/dwell/bounce shape. Real-GPU smoothness is a later sign-off.

The visual-check ZIP includes compressed, proportionally resized review versions of the original PNG captures. The gallery manifest records both hashes and source paths. Run All captures precede the final ribbon relocation; the dedicated banner images show the final design.
