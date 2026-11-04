# Test results (2 Nov 2026, headless Chromium + Playwright in a cloud container, software rendering)

| Check | Result |
| --- | --- |
| Exact RTP (`tools/exact-rtp.py`, all 33,554,432 reel positions) | **94.380%** (lines 59.726, scatters 1.536, free spins 8.490, pick 11.874, hold & respin 10.311, jackpot 2.443); free 1 in 140.4, pick 1 in 140.4, hold 1 in 290.2, jackpot 1 in 112,744 paid spins |
| 5,000,000-spin simulation (`tools/rtp-sim.cjs`, seed 20261102) | 94.31% (free 1 in 140.7, pick 1 in 141.2, hold 1 in 287.4, 37 jackpots). Within sampling noise: the 500× jackpot alone swings the result by a few tenths of a percent at this sample size. Output in `dist/rtp-sim.txt`. |
| Engine SHA-256 | `7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e` = the Block Fortune v2 engine, byte for byte (checked by `tools/build.mjs` and `tools/rtp-sim.cjs`) |
| `tools/test-page.cjs` (everything except the Lab) | **88/88** (after the company logos were added; includes two new checks: 16 logos embedded with every timeline row and company exhibit pointing at one, and the Exhibits panel listing all 16 companies with their logos loaded): pack.json decodes and has the pack keys and identity; every cabinet role present; the deck, lever (strike count rises) and Space spin; every bonus, the jackpot and the gamble play trigger → intro → play → outro; Skip lands on the outro with the dealt total; reduced motion; Guide, Fair Play (94.38% and the split, 1 in 140 / 140 / 290 / ~113,000, even bet, design estimate), Exhibits, Timeline (16 rows), Lessons, Cold Storage Pot with none / some / all twins, Settings, Log; fullscreen sessions at desktop (1280×800) and phone (390×844, iPhone 13) driven only by the bottom bar: every control present, touch targets ≥ 44 px, bets, spin, every panel opens inside fullscreen, AUTO-TOUR, volume, every bonus played to the end from the bar, a Lab run from the bar, the Hot or Cold gamble from the bar, exit; no page errors |
| Bonus Lab (`LAB_ITEMS` run) | **34/34**: all 12 items (Time Machine, with a retrigger, the full 16-year tour, Empty Vaults, Timeline, full wall, Heist of the Century, Hot or Cold win and loss, 3 / 4 / 5 Mt. Gox) run hands-free through every stage the run shows, the real account and machine state untouched, the forced gamble win doubles and the forced loss loses the stake, a seeded run repeats exactly, no page errors. Replay last and Run all passed in the earlier full pass (88/88). Screenshots: `dist/evidence/lab-*.jpg` |
| Casino files | not edited. `tools/build.mjs` reads the casino read-only (`casino/index.html` sha256 `e7924ef3331e…`, unchanged by every build). |

Evidence sheets (four stages each): `dist/evidence/bonus-*.jpg` (the five bonuses), `lab-*.jpg` (every Lab item), `fullscreen.jpg`,
`panels.jpg`, `cabinet-and-lever.jpg`, `cabinet-*.png` (the cabinet from several angles). Full-size screenshots are produced by
`tools/test-page.cjs` into `dist/test/`.

Notes: the company logos were added after the first full pass; the non-Lab suite and the Lab were re-run on the final build. A few checks are timing-sensitive under
software rendering; a Time Machine can legitimately total 0. The cloud container could not open the casino room, so floor
placement (INTEGRATION.md) is untested.
