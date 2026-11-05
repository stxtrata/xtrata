# Casino machines: one folder, one standard (migration plan)

Status: PLAN, nothing here is built yet. Written 4 Nov 2026, on top of branch `claude/casino-machine-rotation`.
Scope: `/casino` and `public/casino-machines/`. `/casino-b` and `/casino-c` are left alone.

## The goal

1. Every machine lives in `public/casino-machines/<id>/`, including the original five (The Drop, Forever Twins, Deep Strata, Block Fortune, Neon Vault).
2. Every machine has the same functions (fullscreen with every menu reachable, a Bonus Lab to play any bonus on demand, LAYR through the casino adapter, the round log and shared jackpot feed, the holder layer), built from one shared kit and not copied by hand.
3. The casino page has no machines of its own. A machine is "on the floor" or "off the floor", nothing else.

## What is true today (measured, not assumed)

**The original five have no home.** They exist only as gzip+base64 blobs inside `public/casino/index.html` (16.6 MB of its 24 MB), with duplicates in `public/casino-b/`. There is no source folder, no build script, no README. Each blob is a model (3.3 to 4.3 MB glb), a game document (620 to 720 KB) and a css string. The game documents are readable, line-structured source, so extraction can be lossless.

**They speak the same language as the series.** All five expose `window.PX_CASINO_ENGINE` and use `window.parent.ParallaxLAYRAccount`. Three use the Block Fortune v2 engine (Drop, Twins, Block Fortune), Deep Strata uses `BF.create(DEEP_STRATA_RULES)` (as Robot Factory does), and Neon Vault uses a different engine, `NV`. Neon Vault is the only non-BF machine in the whole set.

**They differ from the series in these ways:**

| | Original five | Series (25) |
| --- | --- | --- |
| Where | blob in the casino page | `casino-machines/<id>/pack.json` |
| Bonus Lab / test panel | none | 21 of 25 |
| Holder layer | Forever Twins only | 21 of 25 |
| Renderer | a full three.js copy inside every game (521 KB) | vendored `three-subset` + software renderer |
| Ids | short id (`drop`) differs from game id (`the-drop`) | one id (folder = game id = short id) |
| Drives | missions, tournament rotation, Slot fan badge | nothing |

**The series is not actually streamlined yet.** Only 8 of 25 folders contain a build script and all 8 are different. `software-renderer.js` exists in 3 variants, `layr-test-stub.js` in 9 copies, and every folder carries its own copy of the engine. `pack.json` plus `pack.js` repeat each other (65 MB + 40 MB), and the folder is 245 MB in total. Four machines lack the Bonus Lab (Genesis 21, Ordinal Rush, Plebs & Legends, The Archive), four lack the holder layer (Corgi Kennel, Genesis 21, Launchpad, Pool Party) and two lack a test button (Launchpad, The Archive). So "the same functionality everywhere" has to be built, not just moved.

**Things that hang off the original five and must survive the move:**

* Saved games are keyed by the game id passed to `LAYR.machine(GAME_ID, ...)`. These must not change: `the-drop`, `forever-twins`, `deep-strata`, `block-fortune`, `neon-vault`.
* The room service and the round log store the short keys `drop`, `twins`, `ds`, `bf`, `nv` (D1 `casino_events`, the progress/mission code, tournament rotation by day, the Slot fan badge).
* The casino page hard-codes the five (`MACH`, the floor-key table in the floor loader, spectator and NPC paths use the pack index).
* Three separate lists of "which machines exist" now: `functions/lib/casino-machines.ts`, `public/casino/machine-rotation.js` (catalog) and `public/fruit-machine-room/registry.js`.

## Decisions I need from Jim before Phase 3

1. **Keep the old short ids as permanent aliases?** Recommended yes. The manifest says `the-drop` is also known as `drop`; stored rows, missions and the tournament keep working with no data migration. The alternative is a one-off D1 migration to rename keys, which gains nothing visible.
2. **Neon Vault's engine.** Recommended: keep `NV` exactly as it is (it is its own maths) and give it the same host features. Rebuilding it on BF v2 would change its return and its feel.
3. **Which machines count as "core" for missions, the tournament and the Slot fan badge** once there is no built-in five. Recommended: a `core: true` flag in the manifest, set on the original five, so nothing about daily missions or the tournament changes. Later you can decide which machines earn that flag.
4. **Renderer.** The originals carry a full three.js each. Recommended: leave it in Phase 1 to 3 (zero visual risk) and treat a move to the shared lightweight renderer as an optional Phase 6, done with screenshot comparison.
5. **The unified jackpot.** The series bible wants one casino-wide jackpot plus per-machine holder funds. Today only the server's progressive jackpot is shared and each machine keeps its own centre-row meters inside the engine. This plan does not change that; it is a separate design (flagged again at the end).

## The plan, in order. Each phase is its own PR and can be reverted alone.

### Phase 0: freeze a baseline (no code change)

* For each of the five: record the sha256 of the decoded game, model and css; take screenshots of the cabinet in the room, at the screen, in fullscreen, and a bonus; record a seeded spin sequence (engine state in, state out) so the maths can be compared exactly later.
* Record what the casino sends to the room service for one spin on each (the `log` message and key).
* Save all of it in `docs/plans/baseline/` (hashes and the small files; screenshots stay out of git, per the repo rule on local media).

### Phase 1: lossless extraction and loading by pack (the page stops carrying machines)

* New `tools/extract-original-machines.mjs`: reads the blobs from `public/casino/index.html` and writes, for each of the five, `casino-machines/<game-id>/pack.json` (same shape as every other pack), `src/game.html` (the readable game), `src/model.glb`, `src/theme.css`, plus a README and INTEGRATION.md in the series style.
* Verification: re-encode and compare sha256 with Phase 0, and refuse to continue if any byte differs.
* The casino floor loader (already in the rotation branch) loads these five from `casino-machines/` like any other machine. The embedded blobs stay in the page for one release as the fallback if a fetch fails, then are deleted. That takes about 16 MB out of the page.
* `machine-rotation.js` default floor becomes the five folder ids.
* Risk to watch: today the five are in the page, so they appear instantly; fetched packs add a network step on first visit. Mitigation: prefetch the default floor at the top of the page, long cache headers with a version in the url, and the existing "a built-in machine stands in if a pack cannot load" behaviour until the blobs are removed.
* Expected result: identical gameplay, identical hashes, a much smaller page.

### Phase 2: one manifest

* New `casino-machines/manifest.json`, one row per machine: `id` (folder = game id), `legacyKey` (`drop`, ...), `number`, `name`, `accent`, `engine` (`bf-v2`, `bf-deep-strata`, `nv`), `core`, `features`.
* Generate from it (a small script, run in tests so drift fails CI): `functions/lib/casino-machines.ts`, the catalog in `machine-rotation.js`, and `fruit-machine-room/registry.js`. The three hand-kept lists go away.
* The casino's `PX_FLOOR_BY_GAME` / `MACH` read the manifest, and the legacy keys map exactly as today (so D1 rows, missions and the tournament are unchanged).
* The server side stays on the short keys it stores, behind `legacyKey`; new machines use their folder id.

### Phase 3: the shared kit

* New `casino-machines/_kit/` holding the one copy of each of these: the engines (BF v2 with its sha check, Deep Strata rules, NV), vendored three-subset, software renderer and logo code, the host shell (the `PX_CASINO_ENGINE` adapter, the room API, `mechanics()`, session claim and lease), the fullscreen bar, the Bonus Lab, the holder layer, the LAYR stub for standalone pages.
* One `tools/build-machine.mjs <id>`: reads `machine.json` and the machine's own `src/` (theme, symbols, scenes, art), builds the game document, the pack, and the standalone test page. It replaces the 8 different build scripts. `pack.js` becomes generated on demand and stops being committed (about 40 MB saved).
* One `tools/check-machines.mjs`: for every machine, the engine sha is the expected one, the folder name equals `GAME_ID`, `PX_CASINO_ENGINE` has the full set of members, the Bonus Lab and fullscreen entry points exist, no test flag is set by default, and `LAYR.machine(GAME_ID, ...)` matches the round-log splice (this is the check that caught 13 of 25 packs failing the old matcher). Runs in vitest.
* Rebuild all 25 series machines from the kit first; the output must keep the same engine sha, and each machine's seeded spin test must give the same results as before.

### Phase 4: bring the original five up to the standard, one at a time

Order by risk: Block Fortune, The Drop, Forever Twins, Deep Strata, then Neon Vault last (different engine).

For each: move onto the kit shell, add the Bonus Lab (reach every bonus on demand, gated as in the series), confirm fullscreen reaches every menu, add the holder layer (Forever Twins already has one and becomes the reference), and confirm the machine's own data and look are untouched. After each: baseline comparison (seeded spins identical, screenshots reviewed by Jim), then merge, then the next.

### Phase 5: remove the special case for "the built-in five"

* Delete the embedded blobs and the fallback; the floor is purely `machine-rotation.js` plus the manifest.
* The four places that hard-code five (`MACH` table, spectator, NPC regulars, cabinet colour table, machines panel text) read the manifest.
* The tests that pin "five" (`casino-room-spots`, `casino-progress`, `casino-room-play`) change to "manifest rows", and one new test asserts the missions, tournament rotation and badge still use exactly the `core` machines, in the same order, so the daily tournament schedule cannot shift by accident.

### Phase 6: clean-up and performance (optional, any time after Phase 3)

* Drop the committed `dist/` and duplicate `pack.js`, compress the glb files (3 to 4 MB each, 25 of them), and lazy-load only the five on the floor, which is already the case.
* Optionally move the originals off their embedded three.js onto the shared lightweight renderer, machine by machine, with screenshot comparison. Skip any that do not look identical.

## Checks that gate every PR

* Server: casino test files green, plus the new manifest-drift test.
* Maths: seeded spin sequences identical to Phase 0 for the five and to the current packs for the 25.
* Browser: default floor identical to today; each machine opens, spins, shows fullscreen and the Bonus Lab; a paid spin sends one `log` message with the right key and feeds the shared jackpot; no test flags set by the casino.
* Data: existing saves load on the same game ids; yesterday's round-log rows still read.
* Never use personal, hot, deployer or sponsor wallets for any test (repo rule); simulations and disposable wallets only.

## Not in this plan

* A unified casino-wide jackpot replacing the per-machine centre-row meters (maths-locked inside each engine; it needs a design decision on what moves where).
* On-chain LAYR, passkey-wallet settlement and the per-machine on-chain addresses from the series bible.
* `/casino-b` and `/casino-c`: they keep their own copies of the five. If you later want them on the shared folder it is a small follow-up once Phase 1 exists.
