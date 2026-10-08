# Audionaut synth polish — progress

Branch `audionaut-synth-polish` (from `audionaut-synth-rename` @ 9608acc). Resume from this file alone.
App: `xtrata-2.0/public/audionaut/daw.html`. Harnesses: `xtrata-2.0/public/audionaut/tools/` (see tools/README.md).

Status values: not started / in progress / done / blocked.

## Phases

| Phase | Status | Notes |
|---|---|---|
| 0 Audit | done | branch verified, renames present, harnesses recreated in `audionaut/tools/` |
| 1 Keyboard feel (shared) | done | `live-keys.js` + `engine.startNote/releaseNote`; all 14 pass the keyboard suite |
| 2 Synths | not started | order below |
| Final regression + report | not started | |

## Phase 0 audit (baseline, before any change)

Branch `audionaut-synth-rename` exists; HEAD 9608acc "rename 14 stock synths and give each its chosen front panel".
All 14 display names are in the bank and every one plays (finite output) — baseline `node tools/measure.mjs all --quick`.
DAW loads in headless Chromium with 4 instrument rows, every picker lists 28 synths in 15 folders. Only console noise is
blocked external fonts (no network in the test box).

### Keyboard / note input today

| Input | Where | Behaviour |
|---|---|---|
| On-screen keys, 13 face panels | `synth-faces/runtime.js` `P.keyboard()` (shared by every face) | pointerdown only: fixed 0.6 s note (`NOTE_LEN`), no glissando, key-up does nothing, velocity from click height 0.4–0.9. Lights via `synth-note` events but toggled per event (overlapping notes on one key unlight early). |
| ASIC pads / Ordinal bars | `synth-faces/kit.js`, `modal.js` own handlers → `P.noteOn/noteOff` | `noteOff` is a no-op |
| jiMS10 classic panel keys | `synth-panel.js` `buildKeys()` | per-key pointerdown, 0.45 s fixed note; pointerleave releases light only |
| Computer keys (A–L, Z/X octave) | `synth-panel.js` `onKey` (window, capture) | fixed 0.45 s note, vel 1; light held until key-up |
| Web MIDI (panel open) | `synth-panel.js` `onMidi` | fixed 0.45 s note, light until note-off |
| Web MIDI (no editor open) | `midi-input.js` `liveFallback` | fixed 0.45 s note |
| MIDI roll typed / MIDI | `pianoroll.js` | note length = roll note length (audition) — left as is |
| Engine | `engine.triggerNote(i,pitch,vel,time,dur)` | one-shot voice + timed light on/off |

Shared vs per-synth: everything above is shared host code except the face layouts (which only place the keyboard) and
the ASIC pads / Ordinal bars. Root problem: voices are one-shot with the gate fixed at trigger time, so nothing can hold
or release a live note.

### The 14 synths at baseline

| # | Name (id) | params | presets | nodes/note | uncached ms | default rms / peak | known problems |
|---|---|---|---|---|---|---|---|
| 1 | Whale (jibass) | 19 | 8 | 10 | 5 | .060 / .41 | few presets |
| 2 | Privkey (tine) | 14 | 8 | 3 (offline) | 30 | .091 / .33 | render > 20 ms |
| 3 | Cathedral (tonewheel) | 21 | 8 | 14 | 7 | .081 / .24 | |
| 4 | ASIC (kit) | 19 | 8 | 22 | 5 | .047 / .69 | "Dub Toms & Rims" quiet |
| 5 | Layers (ensemble) | 21 | 8 | 33 | 8 | .039 / .27 | default under band; "Slow Swell Drone" quiet |
| 6 | Ordinal (modal) | 13 | 8 | 3 (offline) | 38 | .051 / .36 | render > 20 ms |
| 7 | Muneeb (winds) | 15 | 8 | 15 | 5 | .077 / .46 | |
| 8 | Szabo (morph) | 21 | 8 | 14 | 10 | .062 / .27 | "Buchla Pluck" quiet |
| 9 | Mempool (texture) | 17 | 9 | 46 | 56 (first note builds noise) | .051 / .33 | |
| 10 | Lightnode (lantern) | 15 | 8 | 1 (offline) | 127 | .065 / .28 | render 6× over budget |
| 11 | Schnorr (prism) | 15 | 8 | 38 | 3 | .087 / .45 | glass timbres too alike |
| 12 | Coinbase (fm4) | 19 | 6 | 1 (offline) | 34–40 | .102 / .43 | render > 20 ms |
| 13 | Gm (vox) | 13 | 6 | 17 | 6 | .157 / 1.09 | CLIPS: defaults peak 1.09, presets up to 2.9 |
| 14 | Taproot (pluck) | 10 | 6 | 2 (offline) | 14–19 | .061 / .76 | onset jump (pluck transient) |

Presets for all 13 face synths are shown inside the face (lists / pips / chips); the face toolbar has no host preset menu.

## Phase 1 — what changed

- New `daw/js/live-keys.js`: the single live-play path. `noteOn(src, inst, pitch, vel)` / `noteOff(src)` keyed by the input that holds the note; `attachKeyboard()` gives Pointer Events glissando (up/down), multi-touch, capture, release on up / cancel / lost capture / blur / tab switch; one shared octave for computer keys and every on-screen keyboard.
- `engine.startNote / releaseNote / releaseAll`: held notes. The voice gets a long gate (`synth.live.hold`, default 8 s) into a per-note gate gain; key-up fades the gate over the patch release and stops every source the voice made (captured through a ctx proxy), so the voice's own onended cleanup runs. `live: { oneShot }` synths (ASIC, Ordinal, Lightnode, Taproot) ring out; offline-rendered Privkey and Coinbase hold a 2.5 s render.
- Face runtime: `P.keyboard()` and new `P.surface()` (Ordinal bars) use `attachKeyboard`; key lights are reference-counted from engine note events (MIDI, typed, sequencer all light them); keyboards follow Z/X octave.
- Classic panel keys, typed keys and Web MIDI (panel open or not) all go through `live-keys.js`.
- Face toolbar now has the host preset menu (grouped by preset `cat`), kept in sync with the face's own preset display.
- Verified: `tools/audionaut-test.mjs` keyboard suite on all 14 (hold, gliss up/down/black-key zone, leave/re-enter, release outside window, 24 fast taps = 24 notes, two-finger touch, blur, hidden tab, typed + auto-repeat, octave shift while held, fake MIDI with velocity), panels fit at 1400×900 and 390×844.

## Phase 2 — per synth

| # | Synth | Status | Presets | Commit | Notes |
|---|---|---|---|---|---|
| 1 | Whale | not started | 8 | | |
| 2 | Privkey | not started | 8 | | |
| 3 | Cathedral | not started | 8 | | |
| 4 | ASIC | not started | 8 | | |
| 5 | Layers | not started | 8 | | |
| 6 | Ordinal | not started | 8 | | |
| 7 | Muneeb | not started | 8 | | |
| 8 | Szabo | not started | 8 | | |
| 9 | Mempool | not started | 9 | | |
| 10 | Lightnode | not started | 8 | | |
| 11 | Schnorr | not started | 8 | | |
| 12 | Coinbase | not started | 6 | | |
| 13 | Gm | not started | 6 | | |
| 14 | Taproot | not started | 6 | | |
