# Who Is Satoshi? — checks run on 1 Nov 2026

The build was made on Jim's Mac (`tools/who-is-satoshi/build.py`). Its `pack.json` and `index.html` were then served from a cloud Linux machine and driven with Playwright in headless Chrome, using software WebGL (swiftshader). Nothing ran on the Mac's own browser, so check that once on the Mac (see the end).

## 1. Engine and return

| Check | Result |
| --- | --- |
| `verify.py`: engine byte-identical to Forever Twins | PASS · sha256 `7f619182ada01119…` · 11,784 bytes |
| `verify.py`: LAYR adapter byte-identical to Forever Twins | PASS · sha256 `659bea0c6afc283f…` · 9,572 bytes |
| `verify.py`: pack decodes (67 geometries, 34 materials, 21 textures), named parts, deck actions, screen string once, css = head style | PASS |
| Casino files unchanged (`index.html`, `room.js`, `passkey-wallet.js`) | PASS · same sha256 as before the build. On 2 Nov `index.html` and `room.js` were changed overnight by the chess work, not by this build; the baseline was re-recorded (`casino-baseline.json`) |
| `node rtp-sim.mjs 5000000` (seed 11021, run on the Mac) | **94.343%** (design figure 94.38%). Lines 59.79%, scatter 1.54%, The Forum 8.76%, Unmask Satoshi 11.81%, Patoshi Pattern 10.39%, Satoshi's Key 2.04%. One in 140 spins (The Forum), 141 (Unmask), 289 (Patoshi), 127,643 (Satoshi's Key). 81.6 s |

## 2. Bonus Lab

- **Run all** played all 13 items at bet 100, seeded 7. The Lab captured the four stages (trigger, intro, play, summary, then outro) for The Forum, the retrigger, Unmask Satoshi, The Patoshi Pattern, the full grid into Satoshi's Key, Satoshi's Key, Satoshi or Not? (win and loss), the scatter pays of 3/4/5, and Satoshi's Gift. The Forgery is a stamp on a winning line rather than a bonus. Its FAKE · NOT SATOSHI stamp and the line win were checked on their own.
- **Retrigger:** 12 posts gave 12 Forum spins.
- **Skip** goes straight to the summary.
- **Reduced motion:** stills and fades only.
- **Leaving the Lab:**
  - the real balance, the Satoshi's Gift pot and the history are untouched;
  - Lab rounds are labelled `LAB · …` in the Log;
  - the Lab never writes to the LAYR account.
- **Gating:** `?prod` hides the test hooks and the Lab, and `?prod&lab=1` shows the Lab.

## 3. Cabinet and reload safety

- **Cabinet controls:**
  - clicking the lever in 3D spins the reels;
  - +CLUES raises the bet (100 → 200);
  - INVESTIGATE spins;
  - CASE FILE opens the rules.
- **Reload mid-spin:** the pending round was saved before the animation and settled exactly once. History ids stayed unique, and a second reload changed nothing.
- **Satoshi's Gift pool:** read live from the Forever Twins registry, 7 collections and 2,605 twins.

## 4. Fullscreen

Sessions at **1440×900** (desktop) and **390×844** (phone, touch) were run using only the bottom bar. Both behaved the same way:

| Check | Result |
| --- | --- |
| F / FULL SCREEN enters, EXIT leaves | PASS, frame restored on exit |
| Touch targets under 44px | none |
| +CLUES / −CLUES | PASS (bet 100 → 200) |
| CASE FILE, FAIR PLAY, EVIDENCE, GIFT, LOG, LAYR, SETTINGS open and close inside fullscreen | PASS, all seven |
| AUTO-SLEUTH runs and STOP stops it | PASS |
| Satoshi or Not? gamble via the bar's ₿ SATOSHI / FAKE · NOT | PASS, played to its summary |
| COLLECT | PASS |
| Unmask Satoshi (pick bonus) inside fullscreen | PASS, envelopes picked, played to its summary |
| Bonus Lab opens from the bar (phone) | PASS |
| Page errors | none |

## 5. The prints (added 2 Nov 2026)

Jim's 4×4 grid of pop-art prints was cut into 16 tiles (`art/prints/`) and applied to the people in the game:

| Where | Prints |
| --- | --- |
| RPOW, Bit Gold, b-money, Hashcash symbols | Finney, Szabo, Dai, Back (two colourways each, chosen at random per cell after the result is fixed), with the year in a corner chip |
| The Whitepaper (wild) | Satoshi, both colourways, in a brass frame |
| The Forgery | Wright (with a small NOT SATOSHI · HIGH COURT stamp, clear of the face), Mellor, and the typed case-file card |
| Unmask Satoshi | each opened envelope pulls out the suspect's print, then STILL ANONYMOUS |
| The Patoshi Pattern | Lerner (top left) and Lopp (top right) |
| CASE FILE / EVIDENCE | symbol icons are the prints; the Patoshi row shows Lerner and Lopp |

Checked in the cloud browser: reels, the Forgery win, Unmask Satoshi summary, Patoshi play, Evidence panel, phone fullscreen. No page errors. The engine is unchanged (verify.py) and which print shows never affects a result. `pack.json` grows from 1.66 MB to 2.03 MB.

## 6. Respin animation (added 2 Nov 2026)

The Patoshi Pattern now animates every respin; the engine still fixes and saves each respin before anything moves.
- Every unlocked cell spins through Patoshi blocks (motion blur, slowing down) and stops column by column, left to right, with a stop click per column and a teleprinter whirr while it searches.
- A found block lands with a bounce, a pop and LOCKED; the tally counts up as blocks land; a respin dot goes out when the search starts and all three refill with a pop when a block lands.
- Entering the bonus, all 15 cells search once and the trigger blocks land.
- Between respins the grid stays alive: a scan line runs down each empty cell, BLOCK ? breathes, locked blocks glow softly, and the current respin dot pulses.
- RESPIN reads SEARCHING… and ignores presses until the search ends; Skip mid-search goes straight to the summary; auto-advance waits for each search; reduced motion keeps the old instant reveal.
Checked in the cloud browser (entry, three respins, a press mid-search, Skip mid-search, a full auto run, reduced motion): no page errors.

## Still to check on the Mac

1. Open `/casino-machines/who-is-satoshi/` from the local dev server in Safari and Chrome, at desktop and phone width.
2. Check the sound, which headless Chrome cannot judge.
3. Check the real Fullscreen API: headless Chrome used the fixed-layer fallback.
