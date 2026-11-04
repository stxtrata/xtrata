# Test results (2 Nov 2026, headless Chromium 153 + Playwright in a cloud container)

| Check | Result |
| --- | --- |
| Exact RTP (`tools/exact-rtp.py`, all 33,554,432 positions) | **94.380%** (lines 59.726, scatters 1.536, free spins 8.490, pick 11.874, hold & respin 10.311, jackpot 2.443); free 1 in 140.4, pick 1 in 140.4, hold 1 in 290.2, jackpot 1 in 112,744 |
| 5,000,000-spin simulation (`tools/rtp-sim.cjs`, seed 20261101) | 94.18% (free 1 in 140.7, pick 1 in 141.6, hold 1 in 294.8, 51 jackpots). Within sampling noise: the jackpot (1 in ~113,000 spins, 500× payout) alone swings a 5M-spin RTP by about ±0.2 points. |
| Engine SHA-256 | `7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e` = the Block Fortune v2 engine, byte for byte (checked by `tools/build.mjs` and `tools/rtp-sim.cjs`) |
| `tools/test-page.cjs`, desktop | every bonus, the jackpot and the gamble play trigger → intro → play → outro; Skip lands on the outro with the dealt total for each; reduced motion plays all four stages; every Bonus Lab item (free, free-retrigger, pick, hold, hold-full, jackpot, gamble-win, gamble-loss, scatter3/4/5), seeded repeat, Replay last and Run all leave the real account untouched; no page errors |
| Fullscreen sessions | desktop (1280×720) and phone (390×844): bar has every control, touch targets ≥ 44 px, bets, spin, panels open inside fullscreen, AUTO-BUMP, volume, every bonus played to the end from the bar, Lab run from the bar, exit |
| `tools/live-mock-test.cjs` | with a mocked mempool.space: SNAPSHOT → LIVE, live figures replace the snapshot, a new block raises `mechanics().pulse` and the tip, two failed reads in a row → STALE, recovery → LIVE (7/7) |
| Casino files | not edited. `tools/build.mjs` reads the casino read-only (`casino/index.html` sha256 `830216e7513f…`, unchanged by the build). |

Notes: a few checks are timing-sensitive under software rendering (one phone Rush Hour run and one Run-all poll missed their window once and passed on rerun); a Rush Hour can legitimately total 0. The cloud container cannot reach mempool.space, so the real live endpoints were never called from here; the mocked test covers the code path, the snapshot covers offline. Screenshots (JPEG, 1600 px) are in `dist/test/`.
