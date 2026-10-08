# Audionaut synth test harnesses

Headless-Chromium checks for the synth bank and the DAW. No install step beyond Playwright
(found globally or via `npm i -g playwright`); each script starts its own static server.

| Script | What it checks |
|---|---|
| `node tools/measure.mjs [all\|ids…] [--quick] [--levels] [--pitch] [--warns] [--json=f]` | offline renders: defaults level, every preset, velocity, short/long notes, pitch, min/max sweep of every param, source cleanup, render cost |
| `node tools/audionaut-test.mjs [all\|ids…] [--shots=dir] [--skip-keys] [--skip-daw]` | real `daw.html`: every row plays the synth, panel opens + fits (desktop and 390 px), host preset menu + recall, keyboard feel (hold, glissando, leave/re-enter, fast taps, multi-touch, blur, tab switch, computer keys, octave, fake Web MIDI), save/load, roll dropdown, 4 synths on the transport, console clean |
| `node tools/picker-test.mjs [all\|ids…]` | folder picker: 15 folders, none empty, each synth chosen through the UI on all 4 rows |

Run from `xtrata-2.0/public/audionaut/`. Exit code is non-zero on any failure.
