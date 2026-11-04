# Sat Hunter: what was checked (2 Nov 2026)

Everything below was run on the build in `public/casino-machines/sat-hunter/`: the maths and file checks on Jim's Mac in `xtrata-2.0`, the browser checks in a cloud workspace (headless Chromium 153, software WebGL) against that same pack. Nothing was run inside the real casino room (see the end).

## 1. Engine and return

| Check | Result |
| --- | --- |
| Engine in the game = `tools/sat-hunter/src/bf-engine.js` | PASS |
| Engine = the one inside Forever Twins in `public/casino/index.html` and in `_claude_scratch/sat-hunter/forever-twins-game.html` | PASS, sha256 `7f619182…`, 11,784 bytes |
| LAYR adapter = Forever Twins' (both places) | PASS, sha256 `659bea0c…`, 9,572 bytes |
| 5,000,000 seeded spins (seed 11021, `node tools/sat-hunter/rtp-sim.mjs 5000000`, 91 s) | **94.343%**, within 0.3 of the design figure 94.38% (the script exits with a failure if it is not). Lines 59.79 · scatter 1.54 · Satoshi's Stash 8.76 · Block 9 Vault 11.81 · The Hunt 10.39 · Mythic jackpot 2.04. Stash 1 in 140 spins, Vault 1 in 141, Hunt 1 in 289, jackpot 1 in 127,643. |

No number in the engine was changed. The Lab forces bonuses only by passing a scripted rng into the engine's own `start(state, rng)`.

## 2. Pack and records (`python3 tools/sat-hunter/verify.py`: 50 PASS, 0 FAIL)

- Pack keys; model and game decode (95 geometries, 56 materials, 31 textures); named parts `screenMesh` (once), `crest`, `topperPlate`, `counterL`, `counterR`, `spinPhysical`, `lever`, `leds`; deck actions `spin`/`betUp`/`betDown`/`auto`/`pays`; the room's screen string `screen=canvas(2800,1920)` once; `GAME_ID='sat-hunter'`; name Sat Hunter, accent `#00a6fb`; Lab gate `?lab=1`; `css` = the game's head style.
- The game carries `window.SAT_RECORDS`, contains no network call (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, mempool, Hiro), and none of the Halving's on-screen words are left in its theme script, markup or css. All five scripts pass `node --check`; the theme script is checked as one piece, so a name declared twice by two parts would be caught.
- **Every sat recomputed from first principles:** 589 sats (the ten symbol pools, 21 hunt ranges with 399 finds, 11 story sats, the Mythic sat 0), plus 68 gamble sats and the timeline. `verify.py` has its own copy of the subsidy rule, block lookup, naming algorithm, degree notation, rarity rule and tag rules, and compares block, offset, decimal, degree, name, rarity, tags, subsidy and check link of each record; slot membership (e.g. Epic sats are first sats of blocks divisible by 210,000, Rare sats of blocks divisible by 2,016, Nakamoto sats in the Patoshi list); each hunt's range, finds (first, last, palindromes, no repeats, all inside the range); gamble parities; and sat 0 = `nvtdijuwxlp`, `0°0′0″0‴`, genesis headline. Zero mismatches.
- **Not checked against ordinals.com.** All 207 pool records are `verified: false`; the SATS panel marks every one "not yet checked" beside its check link. The pizza sats have transaction facts only (SAT RANGE: PENDING INDEX).

## 3. Casino files

`verify.py` compares the five files in `public/casino/` (`chess.js`, `index.html`, `passkey-wallet.js`, `room.js`, `xchess-engine-3049.js`) with `_claude_scratch/sat-hunter-casino-baseline.txt`: all five unchanged. This build only reads `public/casino/`; it writes to `tools/sat-hunter/` and `public/casino-machines/sat-hunter/`.

## 4. Test page, game and panels (headless Chromium, 1440×900)

- Loads, activates and plays: the button reads HUNT; Space spins; a spin settles (10,000 → 9,900 and a history row).
- **No network.** Every request the page made was to the local server: zero external requests, with the game idle, spinning, in every panel and through every Lab item. No console errors or page errors (one browser warning about the iframe's `allow` attribute, which the Halving page also has).
- Panels (RARITY, FAIR PLAY, SATS, HOLDER POT, LOG, LAYR, SETTINGS) open and close. SATS lists all ten symbols with check links, `not yet checked` marks, the NOT YET MINED · DUE ABOUT … ribbons on unmined Epic sats, SAT RANGE: PENDING INDEX on the pizza tiles, sat 0 and the genesis headline. HOLDER POT shows WALLET LINKING: NOT LIVE YET, SHARE PER WALLET: UNKNOWN and the period countdown (`6d 12h` at the time of the run). The wallet sample (none / some / many / unknown) changes only the displayed share (12 wallets: ≈ 0.08 LAYR at a pot of 1).
- Panel icons are 72 px thumbnails: the first run found the full-size tile data URLs made the RARITY panel 1.4 MB and the SATS panel 2.2 MB of HTML for the cabinet port to copy 10 times a second; fixed, rebuilt and re-run.
- **Bonus Lab, all 13 items, seeded, Auto-advance, on the separate practice balance:** Satoshi's Stash, Stash + retrigger, Block 9 Vault, The Hunt, The Hunt full grid (→ Mythic), Mythic jackpot, scatter ×3/×4/×5, Rare find and Period snapshot each ran trigger → intro → play → summary → outro and returned to idle (Lab rounds are marked LAB in the log). The two Odd Sat or Even Sat items deal the paid win and then wait for the player's ODD SAT / EVEN SAT call, as the Halving's gamble does. Run all, Replay last and Random mode share the Halving's code path and were not re-run separately.

## 5. 3D studio (software WebGL)

Cabinet, Screen, Topper and Orbit views render and are now framed from the model's own bounds. The test page maps the game's `topper` canvas onto `topperPlate` (1 texture) and the `counter` canvas onto `counterL` and `counterR` (2 textures); the topper showed the live Mythic meter, the Holder Pot with its countdown and a real sat on the bench, and the side tapes scrolled real sat numbers. The crest (loupe) turns on its own clock. `?nostudio` (2D fallback) plays and takes taps.

## 6. Fullscreen

Desktop 1440×900 and phone 390×844. F enters; the bottom bar holds every control except the lever (19 visible buttons and controls), **none under 44 px** in either size; a panel opens and closes inside fullscreen; a browser exit (what Esc does) restores the frame; EXIT restores it; with the Fullscreen API removed (the fixed-layer fallback used on iPhone Safari) the layer still fills the view, Esc leaves it and F toggles it.

## Not checked

- Inside the real casino room: by design nothing was integrated. See `INTEGRATION.md`.
- On a real phone or a GPU: the browser checks used software WebGL in headless Chromium.
- The check links on ordinals.com (see section 2): every sat is "not yet checked".
- Sound was not listened to (the audio code runs without errors, but a headless browser has no ears).

## Official rarity art (added 2 Nov 2026)

The coin emblems are now the owner-supplied reference set: the Xverse rare-sat badges for Epic, Rare, Uncommon, Palindrome, Vintage, Nakamoto, Block 9 and Pizza, and the Magic Eden "Black sats" tile (cropped round) for Black sats. Mythic, Legendary and Sat range have no official art on that sheet and keep the machine's own engraving.

- Files: `art/official/*.png` (cut out of the sheet, background removed, enlarged 4x), embedded in the game as `window.SAT_OFFICIAL` and copied to `public/casino-machines/sat-hunter/art/official/`. Drawn by `officialFace()` in `src/game/p3_art.js`; until a picture has decoded the coin draws its own engraving.
- **Third-party artwork.** Both sets are listed under `logosNeedingPermission` in `art/sources.json` and must be cleared or credited before a public release. `verify.py` now expects exactly those two entries.
- The badges are small in the sheet (about 50 to 75 px), so on large coins they are soft. A larger source from Xverse or Magic Eden would sharpen them: drop the PNGs into `art/official/` with the same names and rebuild.
- Checked: build, `verify.py` (all pass), the 2D game screen and the 3D cabinet screen. The Bonus Lab scenes use the same `coinFace`, so they pick the art up; I looked at the reels and the vault intro only.
