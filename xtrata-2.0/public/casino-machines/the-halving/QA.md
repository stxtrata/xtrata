# The Halving: what was checked (2 Nov 2026)

Builds and checks ran twice: in a cloud workspace (headless Chromium, software WebGL) and again on Jim's Mac in `xtrata-2.0` (Python + numpy, textures through node `sharp`). The pack checked on the Mac is the one in this folder.

## 1. Engine and return

| Check | Result |
| --- | --- |
| Engine in the game = `tools/the-halving/src/bf-engine.js` | PASS |
| Engine = the one inside Forever Twins in `public/casino/index.html` | PASS, sha256 `7f619182…`, 11,784 bytes |
| LAYR adapter = Forever Twins' | PASS, sha256 `659bea0c…`, 9,572 bytes |
| 5,000,000 seeded spins (seed 11021, `node tools/the-halving/rtp-sim.mjs 5000000`) | **94.343%** (design figure 94.38%). Lines 59.79 · scatter 1.54 · Halving Cycle 8.76 · Coinbase Messages 11.81 · Hashrate 10.39 · 21 Million 2.04. Halving Cycle 1 in 140 spins, Coinbase Messages 1 in 141, Hashrate 1 in 289, jackpot 1 in 127,643. Same result on the Mac and in the cloud. |

No number in the engine was changed. The Lab forces bonuses only by passing a scripted rng into the engine's own `start(state, rng)`.

## 2. Pack

`python3 tools/the-halving/verify.py`: pack keys, model and game decode (68 geometries, 35 materials, 21 textures), named parts `screenMesh` (once), `core`, `spinPhysical`, `lever`, `flapBoard`, deck actions `spin`/`betUp`/`betDown`/`auto`/`pays`, the room's screen string `screen=canvas(2800,1920)` once, `GAME_ID='the-halving'`, Lab gate `?lab=1`, `css` = the game's head style: all PASS.

Records: all 10 coinbase messages decode from their own raw coinbase hex, and every block's BIP34 height push matches its height (blocks 0 and 210,000 predate BIP34, which began at block 227,931, so they carry no height push to check). PASS.

## 3. Casino files

This build only reads `public/casino/`. It writes to `tools/the-halving/` and `public/casino-machines/the-halving/` and nowhere else.

| File | sha256 at 00:57 UTC, before the build | sha256 at 02:33 UTC | |
| --- | --- | --- | --- |
| `passkey-wallet.js` | `22c17ba2…` | `22c17ba2…` | unchanged |
| `room.js` | `35c6b33d…` | `378822f9…` | **changed at 01:28 by something else** |
| `index.html` | `eaa66fd3…` | `cb66b476…` | **changed at 02:10 by something else** |

`room.js` and `index.html` were modified during the build window by another process working in the same repo (another session's scratch files were also being written in `_claude_scratch/` at the time). The Halving's build never opens either file for writing. The machine list in `index.html` is still the same five packs (The Drop, Forever Twins, Deep Strata, Block Fortune, Neon Vault) and the Forever Twins engine and adapter still match byte for byte. `verify.py` reports these two hashes as FAIL because it compares against the before-build hashes; update `CASINO_HASHES` once you know what changed.

## 4. Test page and screenshots

Served `public/` and opened `/casino-machines/the-halving/`, at 1440×900 and 390×844.

- Cabinet, screen and topper views render (the Mac-built pack was loaded in the cloud browser and looks the same as the cloud build).
- `?nostudio` (no WebGL): the 2D fallback draws the screen and takes taps.
- Idle: the block ticker runs at about 20 fps, animations near 30 fps; the game measures its own draw time and leaves at least as long idle, so the page stays responsive on a software renderer (checked for 30 s inside a bonus intro).
- Reels land on the result they settle on (fixed 2 Nov, 02:45): each reel's animation used to list the window top row first while the reel is drawn from the bottom up, so the reels came to rest with the top and bottom rows swapped and then flipped when the spin settled. Now checked over 8 spins with `engine.test.reels()`: the cells every reel comes to rest on equal the settled grid (8/8; the old code failed 8/8).
- Reload in the middle of a spin: the round settles once (10,000 − 100 + 30 = 9,930), no re-roll.

## 5. Bonus Lab

Every item ran, seeded and random, with Replay and Run all, on its separate 10,000 practice LAYR; rounds show LAB in History; the account, saved game, meters and Epoch Pot were untouched.

| Item | Trigger | Intro | Play | Summary |
| --- | --- | --- | --- | --- |
| Halving Cycle | ✓ | ✓ | ✓ era 50 → 3.125, coin splits | ✓ |
| Halving Cycle + retrigger | ✓ | ✓ | ✓ | ✓ |
| Coinbase Messages | ✓ | ✓ | ✓ real messages under the blocks | ✓ |
| Hashrate | ✓ | ✓ | ✓ chain links grow | ✓ |
| Hashrate full grid → 21 Million | ✓ | ✓ | ✓ | ✓ |
| 21 Million | ✓ | ✓ | ✓ split-flap digits | ✓ |
| Halve or Double, win and loss | ✓ | ✓ | ✓ | ✓ |
| Scatter ×3 / ×4 / ×5 | ✓ | n/a (line pay) | ✓ | ✓ |
| Halving Day (machine event) | ✓ | ✓ | ✓ topper counts down to 1,050,000 | ✓ |
| Epoch snapshot (machine event) | ✓ | ✓ | ✓ pot divided per twin | ✓ |

Every scene has Skip, and Reduced motion cuts them to stills.

**Push buttons (2 Nov, 10:45).** All five deck buttons now travel when pressed: the cap sinks into its yellow collar (MINE's amber cap into its sleeve) and springs back, a 270 ms stroke. It happens whichever way the press comes in: a click on the cabinet, the bottom bar, the Space key, or auto-mine pressing MINE itself. The cap still goes down when the game refuses the press (mid-spin, a panel open). Checked with `engine.test.buttons({...})`, which holds caps down: +HASH, AUTO and MINE shown held next to SCHEDULE and −HASH at rest. A real −HASH press reported 0.81 depth on the next read. The room needs no change for MINE, because it already moves `spinPhysical` by `mechanics().spinZ`.

**The main breaker (2 Nov, 10:30).** Each pull now cuts the power and restores it. About 300 ms in, as the lever reaches the bottom of its swing, the contacts arc: blue-white sparks, a flash and a crackle. The indicator window flips from a green POWER ON to a red TRIPPED and its supply bar falls. The LED rings and marquee go dark, the fans start to coast down and the screen browns out. About 560 ms in, the breaker closes with a relay clunk and the power flickers back: an amber RESTORING, then POWER ON as the fans spin back up. Checked frame by frame using `engine.test.breaker(ms)`, which holds the breaker at one moment of the pull. It is display only, and the spin result is dealt before any of it. Reduced motion keeps the lamp change but drops the sparks, the blackout and the flicker. Turbo skips the screen brown-out. 8 spins rechecked: the reels still land on their settled grid, with no page errors.

**Bonus actions are animated (2 Nov, 10:00).** Each Hashrate respin now plays on screen: the respin light goes out, every empty slot spins as a little reel of real mined blocks with a hash readout, and the slots stop one after another from left to right. A slot that misses flashes NO BLOCK. A slot that lands thumps in with a MINED stamp, the chain link draws out to it, and all three respin lights relight. When the bonus opens, the blocks that triggered it link up one by one. While a respin is playing the RESPIN button reads MINING… and ignores presses. The engine deals each respin before the show starts, so the animation can't change a result. Elsewhere: in Coinbase Messages, once three blocks are open the other six seals crack open in turn; the Epoch snapshot counts the pot and the share per twin up; idle Hashrate slots tick through nonces and the chain links and the hashrate trace drift slowly. Each Hashrate slot now shows a different real block. Run all passed with normal and reduced motion, with no page errors. That run also found and fixed an error in the Halving Day summary that drew nothing.

## 6. Fullscreen sessions (bar only)

Desktop 1440×900 and phone 390×844, using only the bottom bar: spin, −/+ HASH, MAX, AUTO-MINE on and off, all seven panels (Schedule, Fair Play, Records, Epoch Pot, Log, LAYR, Settings) open inside fullscreen and close, a Lab gamble and a Coinbase Messages pick played from the bar, EXIT and Esc restore the frame. Every bar button is at least 44 px. No console errors.

## 7. Live chain data

Tip height via `mempool.space`, falling back to the Hiro API (the cloud test used the Hiro fallback; mempool.space was not reachable there). Forever Twins count read live: 2,605 twins in 7 collections. Chain "stale" (marked STALE, pot period frozen), "3 blocks left" and "live" were each forced from the Test panel.

## Not checked

- Inside the real casino room: by design, nothing was integrated. See `INTEGRATION.md`.
- On a real phone or GPU: browser checks used software WebGL in headless Chromium.
- mempool.space from the cloud (blocked there); the Hiro fallback was used instead.
