# AudioNaut beta-pro validation

Run `npm ci` in `xtrata-2.0`, then `npx playwright install chromium` and `npm run build:audionaut-beta-pro`. Run the combined workstation checks with:

```sh
node public/audionaut-beta-pro/tools/pro-suite.mjs
npx vitest run functions/lib/__tests__/audionaut-pro-auth.test.ts
```

The Pro suites cover timeline/MIDI/routing models, recovery and strict import, 28 synths and 20 effects, all faces and user presets, playback/recording, WAV/stems/archive export, the complete workspace workflow, the signed membership gate, original/beta compatibility, storage isolation and a real-time endurance loop. `pro-ui-review-test.mjs`, `pro-fidelity-test.mjs` and `pro-transport-test.mjs` cover cross-module integration, freeze audio/frame-count equality, tempo changes and scheduling stalls.

Use `SOAK_SECONDS=600` for a ten-minute run or `SOAK_SECONDS=7200` for a two-hour run. Endurance checks monitor voice/timer cleanup, cache bounds and scheduler diagnostics; they are not an audio-interface latency certification. No personal wallet or paid transaction is used.

`AUDIONAUT_TEST_BROWSER=firefox` or `webkit` selects another installed Playwright browser. `PLAYWRIGHT_BROWSERS_PATH` can select a temporary installation. `CHROMIUM_PATH` is used only for Chromium. Desktop WebKit testing does not replace testing Safari/iOS devices.

`gate-test.mjs` delegates to `pro-gate-test.mjs`; the beta-pro suite also runs separate server authorization tests. Shared wallet helpers remain unchanged.

## Inherited diagnostic tools

Headless-Chromium checks for the synth bank and the DAW. No install step beyond Playwright
(found globally or via `npm i -g playwright`); each script starts its own static server.

| Script | What it checks |
|---|---|
| `node tools/measure.mjs [all\|ids…] [--quick] [--levels] [--pitch] [--warns] [--json=f]` | offline renders: defaults level, every preset, velocity, short/long notes, pitch, min/max sweep of every param, source cleanup, render cost |
| `node tools/audionaut-test.mjs [all\|ids…] [--shots=dir] [--skip-keys] [--skip-daw]` | real `daw.html`: every row plays the synth, panel opens + fits (desktop and 390 px), host preset menu + recall, keyboard feel (hold, glissando, leave/re-enter, fast taps, multi-touch, blur, tab switch, computer keys, octave, fake Web MIDI), save/load, roll dropdown, 4 synths on the transport, console clean |
| `node tools/picker-test.mjs [all\|ids…]` | folder picker: 15 folders, none empty, each synth chosen through the UI on all 4 rows |
| `node tools/performance-regression.mjs` | shared instrument selection, two MIDI ports, sustain, pitch bend, disconnect and permission races, generic panels, real-time arp, audio-clock recording, loop continuation and Roll editing |
| `node tools/voice-lifecycle-test.mjs` | all 28 voices, held notes beyond 30 seconds, source cleanup, Stop/Panic, overlapping lights, bend, polyphony, removed channels, scheduler stalls and offline scheduling |
| `node tools/persistence-history-test.mjs` | transaction undo and memory bounds, portable audio assets, IndexedDB versions, migration, quota failures, races, retention and garbage collection |
| `node tools/async-project-test.mjs` | slow file reads, starter fetches, New and inscription handoffs preserve newer edits |
| `node tools/updates-integration-test.mjs` | gain undo, remembered synth patches, effect fine/reset gestures, audible WAV export, both inscription handoffs, recovery/reload and responsive controls |
| `node tools/storage-isolation-test.mjs` | beta never reads, migrates, changes or deletes the original workstation's saves and preferences |
| `node tools/backward-compatibility-test.mjs` | files exported by the actual original workstation load in beta, including embedded audio, notes, patches and shipped starter songs |
| `node tools/gate-test.mjs` | real shared membership gate: no early iframe, denied nonmembers, verified member opens beta and disconnect unloads it |
| `node tools/make-starters.mjs [ids…]` | **builds** (does not check) the starter song library in `daw/data/starters/`: songs are defined in `tools/starter-songs.mjs` (groove id, key, chord progression, four synth parts); the script assembles each one in the real app and sets its levels by measurement. Set `CHROMIUM_PATH` if Playwright has no browser of its own |
| `node tools/chain-shapes.mjs [--json]` | audit (no browser): how every shipped starter and Beats preset shapes its plugin chains (empty, plain, sends at the end, mid-chain sends, both lists, odd types). Guards the plugin tidy-up migration; `src/audionaut-beta-pro/__tests__/chain-shapes.test.ts` fails on any shape the migration does not handle |
| `node tools/chain-null.mjs record\|compare FILE.json.gz [--only=text] [--limit=-90] [--twice]` | audio null test for plugin-chain changes: renders 17 fixed projects (inserts, FX, sends, bypassed, legacy FX object, custom returns, synths) through the real engine on an offline clock. `record` on trusted code, `compare` on the change: every case must null below -90 dB. `--twice` shows the noise floor (about -120 dB or better) |

Run from `xtrata-2.0/public/audionaut-beta-pro/`. Exit code is non-zero on any failure.

If dependencies are outside the project, set `PLAYWRIGHT_MODULE` to the installed
Playwright entry point and `CHROMIUM_PATH` to a Chrome/Chromium executable. The new
regressions use local browser simulations; they do not connect a wallet or send a
transaction. `SCREENSHOT_DIR` optionally saves integration screenshots locally.

The gate check uses the beta-pro bundle generated by `npm run build:audionaut-beta-pro`. Server responses and disposable browser sessions are simulated; the actual beta-pro gate code is exercised.
