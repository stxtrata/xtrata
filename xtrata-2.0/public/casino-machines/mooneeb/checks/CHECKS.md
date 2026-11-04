# Mooneeb checks — 2 November 2026

All run against the final build (Jim's pop-art picks in place). Scripts and raw results are in this folder; screenshots in `screens/`.

| Check | Result | File |
| --- | --- | --- |
| Engine identical to Block Fortune v2 | sha256 `7f619182…c143168`, identical to Forever Twins, The Drop and Block Fortune | `engine-identity.json` |
| pack.json decodes, keys match the live packs, engine inside it identical | Pass (`accent,color,css,description,game,model,name`) | `engine-identity.json` |
| Room text hooks appear exactly once | Pass (LAYR header, GAME_ID line, screen line, `connect(ac.destination)`, `PX_CASINO_ENGINE`) | build output |
| 5M seeded spins (seed 20261102) | **94.137%** vs 94.38% design, within tolerance. Lines 59.65, scatters 1.54, free 8.51, pick 11.80, hold 10.35, jackpot 2.28. Moonshot 1 in 140, Mooney Bags 1 in 141.4, Spell It 1 in 289.8, 39 jackpots | `rtp-5m.json` |
| 5M seeded spins (seed 7) | **94.455%** | `rtp-5m-seed7.json` |
| Bonus Lab "Run all": every item, every stage | All 13 items played; every bonus item showed trigger → intro → play → summary; 71 lab rounds, all tagged LAB; no page errors | `lab-runall.json`, `screens/lab-*` |
| Skip pays the same as playing | Pass for Spell It, Moonshot, Full Mooneeb chain; Skip on Mooney Bags goes to the summary and pays | `behaviour.json` |
| Reduced motion | Pass (at most 3 particles on screen) | `behaviour.json` |
| Lab isolation | Real balance, jackpot meters, Holder Pot and stats unchanged after Lab play | `behaviour.json` |
| Holder Pot | Grows by 1% of a paid bet (100 bet → +1) | `behaviour.json` |
| Cameo records | `{tokenId, collection:'leo-cats', xtrataId, lineWin}` written for twins in winning Moonshot spins | `behaviour.json` |
| Reload mid-spin | Saved round settles once: no reroll, no double credit | `behaviour.json` |
| Buttons ≥ 44px, no sideways scroll | Pass on desktop (1366) and phone (390) | `views.json` |
| Fullscreen session, desktop and phone | See `fullscreen-both.json`: enter, bar targets ≥ 44px, one-row bar on desktop, bet ±, spin, every panel opens and closes inside fullscreen, auto, turbo, sound, each bonus and the gamble played with the bar and screen taps, exit restores the cabinet | `fullscreen-both.json`, `screens/fs-*` |
| Casino files unchanged | Nothing in the casino was edited: this build never had write access to the repo and lives in its own folder | — |

Notes on the fullscreen run:
- Final result: every step passes on desktop and phone (`fullscreen-both.json`). In the last desktop run a Spell It landed inside Moonshot and both played through to their summaries.
- Earlier passes reported false failures from the harness, not the game: it pressed CONTINUE from a stale reading straight after a screenshot (closing a summary before recording it), pressed spin between Lab rounds (collecting a win before the gamble opened), and tried to start the Lab while a real bonus from the auto-spins was still running (the Lab correctly refuses). Each was traced by hand and the harness fixed.
- One real fix came out of it: the floating fullscreen action button covered the WIN readout. It now appears only while Mooney bags wait to be opened, below the screen on phones and on the hint line under the reels on desktop.

## Update — 2 November 2026, evening

- **Screen view** (test page): straight on from just above, solved numerically each time the window resizes: the top of the screen sits under the top bar and the deck buttons sit on the bottom edge, just above the controls, with the controls' strip made dark so nothing of the cabinet shows below them. Checked at 1366×900, 1920×1080 and 390×844.
- **Moo sound**: plays only when a winning line is made of Moo (the cow) or Mooney (the cow jumping over the moon). Removed from other wins, the Mooney Bags trigger and big bag prizes, the Moo or Moon gamble and the Full Mooneeb ladder (now a rising brass crescendo). Checked by spinning on the test page and comparing each spin's winning symbols with the moos it played (`moo` entries in `Mooneeb.soundLog()`).
- **Muneeb tiles**: Jim's pop-art portrait now fills the jackpot tile, drawn at twice the old tile resolution from a 2× Lanczos upscale of the original grid crop (`art/muneeb/portrait-hd.jpg`). Nothing is drawn over his face.
