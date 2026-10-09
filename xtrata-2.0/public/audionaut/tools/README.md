# Audionaut synth test harnesses

Headless-Chromium checks for the synth bank and the DAW. No install step beyond Playwright
(found globally or via `npm i -g playwright`); each script starts its own static server.

| Script | What it checks |
|---|---|
| `node tools/measure.mjs [all\|ids…] [--quick] [--levels] [--pitch] [--warns] [--json=f]` | offline renders: defaults level, every preset, velocity, short/long notes, pitch, min/max sweep of every param, source cleanup, render cost |
| `node tools/audionaut-test.mjs [all\|ids…] [--shots=dir] [--skip-keys] [--skip-daw]` | real `daw.html`: every row plays the synth, panel opens + fits (desktop and 390 px), host preset menu + recall, keyboard feel (hold, glissando, leave/re-enter, fast taps, multi-touch, blur, tab switch, computer keys, octave, fake Web MIDI), save/load, roll dropdown, 4 synths on the transport, console clean |
| `node tools/picker-test.mjs [all\|ids…]` | folder picker: 15 folders, none empty, each synth chosen through the UI on all 4 rows |
| `node tools/make-starters.mjs [ids…]` | **builds** (does not check) the starter song library in `daw/data/starters/`: songs are defined in `tools/starter-songs.mjs` (groove id, key, chord progression, four synth parts); the script assembles each one in the real app and sets its levels by measurement. Set `CHROMIUM_PATH` if Playwright has no browser of its own |
| `node tools/chain-shapes.mjs [--json]` | audit (no browser): how every shipped starter and Beats preset shapes its plugin chains (empty, plain, sends at the end, mid-chain sends, both lists, odd types). Guards the plugin tidy-up migration; `src/audionaut/__tests__/chain-shapes.test.ts` fails on any shape the migration does not handle |
| `node tools/chain-null.mjs record\|compare FILE.json.gz [--only=text] [--limit=-90] [--twice]` | audio null test for plugin-chain changes: renders 17 fixed projects (inserts, FX, sends, bypassed, legacy FX object, custom returns, synths) through the real engine on an offline clock. `record` on trusted code, `compare` on the change: every case must null below -90 dB. `--twice` shows the noise floor (about -120 dB or better) |

Run from `xtrata-2.0/public/audionaut/`. Exit code is non-zero on any failure.
