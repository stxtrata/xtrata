# DOG Army checks

Run on 2 November 2026 in headless Chrome (swiftshader) against the build in this folder. Results: `results/`. Screenshots: `screens/` (curated set in `screens/main/`, every Lab stage in `screens/lab-dist/` and `screens/lab-dist-fixture/`, fullscreen in `screens/fs-*`, panels in `screens/panel-*`, views in `screens/view-*`).

## IMPORTANT: art and data state at the time of these checks

`art/dog/DATA-DONE` never appeared: the ART stream had not written `art/dog/data.json` or any image (its browser session was waiting on an access approval). So the shipped build (`dist/game.html`, `pack.json`) is the **all-fallback build**: every tile is a labelled type tile, the moon shows "$DOG" in plain type with the "logo pending" note, the Snapshot crate says BLOCK TO CONFIRM, Dog Tags and March use type tiles. This is intended fallback behaviour and it was checked as such (`dist`).

To exercise the data-rich paths (Runestone thumbnails and cameos, march transfers, dog-tag milestones, ALEX token image, logo on the moon) I built a **clearly fake test fixture**, `checks/fixture/dog` (`python3 checks/make_fixture.py`), into a separate page, `dist-fixture/game.html` (`FIXTURE=1 node tools/build-pack.mjs`). The fixture is never packed or shipped; all numbers and images in it are placeholders. Checks marked (fixture) ran on it. **When the real `art/dog` lands, rebuild and re-run everything marked (real).**

## Results

| Check | Result |
| --- | --- |
| (a) RTP, `node tools/rtp.mjs 5000000`, seed 20261102 | **94.137%** (target 94.38 +/- 0.3: pass). Lines 59.65, scatters 1.54, free spins 8.51, pick 11.80, hold 10.35, jackpot 2.28. Airdrop 1 in 140.0, Dog Tags 1 in 141.4, March 1 in 289.8. `results/rtp-seed-20261102.json` |
| (a) RTP, seed 7 | **94.455%** (pass). Airdrop 1 in 138.7, Dog Tags 1 in 140.0, March 1 in 288.3. `results/rtp-seed-7.json`. The two seeds straddle 94.38; the spread is jackpot variance (37-39 hits per 5M spins) |
| (b) `node tools/check-engine.mjs` | **Pass**: engine sha256 equals the one recorded from Forever Twins (`7f619182...`); pack.json fields `{name, description, color, accent, model, game, css}` valid (`#0c0a09` / `#e7e5e4`); model and game gzip+base64 round-trip; model has root/geometries/materials/textures; parts screenMesh, crest, spinPhysical, lever, tag0..tag7 present; deck actions spin, betUp, betDown, auto, pays present. **Caveat:** the sandbox cannot reach xtrata.xyz, so "identical to the live Forever Twins pack" was checked against the recorded sha256, not the live casino page (`results/check-engine.log`). `tools/build-pack.mjs` also verifies all five room hooks exactly once |
| (c) Every Lab item through all four stages, Run all (real) | **Pass**: 13 items; free, free + retrigger (incl. retrigger scene), vault, chain, chain-full (March, then jackpot), jackpot, gamble-win, gamble-loss and scatter 3/4/5 show trigger, intro, play and outro. 65 lab rounds, all tagged LAB, no page errors (`results/lab-runall-dist.json`, `screens/lab-dist/`). Same on the fixture (`results/lab-runall-dist-fixture.json`). `parade` and `cameo` are plain spins (no scene): they are covered by checks below |
| (c) Skip keeps the same total (chain, free, chain-full) and Dog Tags Skip pays the summary (real, fixture) | **Pass** (identical totals played vs skipped: 1,600 / 1,340 / 54,302) |
| (c) Reduced motion | **Pass**: at most 3 particles through a whole jackpot (real, fixture) |
| Tag lights | **Pass** (real, fixture): the parade lights tag rows; the jackpot lights all eight (`DogArmy.tags()`, the values `mechanics().tags` returns) |
| Runestone cameo records `{tokenId, collection:'runestone', lineWin}` | **Pass (fixture)**; **cannot be exercised on the real build** (FAIL in `behaviour-dist` only because no Runestone inscriptions are bundled yet: there is no inscription id to record). Re-run when real thumbnails land |
| (d) Whole fullscreen session on the bottom bar only, desktop 1366x900 | **Pass**: enter, bet +/-, spin, auto start/stop, turbo, sound, ORDERS / FAIR PLAY / HISTORY / POT / SETTINGS / LAB / TEST open and close inside fullscreen, free, vault, chain, jackpot and gamble played from trigger to summary, Esc/EXIT restores the cabinet. The bar fits in one row (a 10 px overflow found on the first run was fixed) (`results/fullscreen-desktop.json`) |
| (d) Same, phone 390x844 touch | **Pass**: same steps (dog tags and gamble-loss as the Lab bonuses), bar wraps to five rows inside the view (`results/fullscreen-phone.json`) |
| (e) Touch targets >= 44 px at phone width | **Pass**: 16 buttons on the phone test page, 18 on desktop, none under 44 px; all 22+ fullscreen bar buttons >= 44 px; no horizontal scroll (`results/views.json`, `results/panels-dist.json`) |
| (f) Reload mid-spin | **Pass**: the saved result is settled once, same round id, balance changes exactly once, no reroll (real, fixture) |
| (g) Lab isolation | **Pass**: balance, jackpot meters, Holder Pot and spin count are identical before and after a Lab run (real, fixture) |
| Holder Pot grows 1% of a paid bet | **Pass** (100 bet -> 1) |
| No page errors | Pass in every script |

## Visual review

Looked at: reels, Orders / Fair Play / Holder / History / Settings / Lab / Test / Account panels (desktop and phone), every stage of every bonus, jackpot and gamble in page view and in fullscreen at 1440x900, 1366x900 and 390x844, and the test page's cabinet and screen views. Fixed along the way: the Moon or Doom title and buttons overlapping, the BIG WIN stamp covering the gamble total and bonus trigger titles, fractional digits in the count-up, the standalone page overflowing at phone width, the fullscreen bar overflowing at 1366 px.

## Not tested / limits

- Real art and data (see above). Impact is not installed in the headless browser, so headings render in Arial; layout uses fit-to-width text, but check the real font once on a Mac.
- WebGL cabinet lights are driven from `mechanics().tags` on the test page; the tag rows' emissive result was checked in the cabinet previews of the CABINET stream, not by a pixel test here.
- Real Fullscreen API inside the casino room's hidden frame (only the standalone test page and the game page were run).
- Audio is procedural. The only automated check is that `DogArmy.soundLog()` records the jackpot howl (and reel stops) when the jackpot plays; nobody listened to the snare, bugle or howl, so mix and levels are untested by ear.
- Live ALEX token image fetch (no network here: it fails quietly and the tile stays a type tile).

_Note: the screenshots from the fake-data fixture run (`screens/lab-dist-fixture`) were left out of the delivered folder so placeholder data is never mistaken for real. Regenerate with `python3 checks/make_fixture.py`._
