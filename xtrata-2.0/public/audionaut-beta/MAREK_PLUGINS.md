# Marek collection · first versions (27 November 2026)

Five custom plugins designed from the tools producer Marek (three artist aliases) uses most. Each is an original design for the Audionaut runtime, inspired by a type of instrument rather than a copy of any product. The names nod to Marek's artist aliases. The same files ship in Beta Pro and the community Beta.

| ID | Name | Where | What it is | Inspired by |
|---|---|---|---|---|
| `mavrekt` | MAVREKT | Leads | Two-layer virtual-analogue trance poly. Part A (up to 7 unison voices) and Part B (up to 5), each with its own low-pass. Drive, decay/sustain, tempo-locked 16-step trance gate. | Sylenth1-style workflow |
| `element` | ELEMENT | Wavetable, Phase & West-Coast | Six-frame wavetables (analog, formant, digital, glass, growl, organ) scanned per note from a start to an end position. Five warp modes. Unison, sub, noise, LP12/LP24/HP/BP filter with envelope. Live scope of the start frame. | Serum 2-style sound design |
| `lostwave` | LOSTWAVE | Leads | Four multi-mode oscillators (saw, square, HYPER stack up to 9, FM, hard sync, AM, noise), two filters in series or parallel, PUNCH onset and soft clip. | Spire-style EDM leads |
| `valorium` | VALORIUM | Pianos & Electric Pianos (sample instrument) | Four sample layers through a shared filter, drive and ADSR. Starter pack is modelled in code: keys, pluck, guitar, strings, pad, choir, bell. Layer A can play a custom pack of key/velocity zones (imported or Xtrata-linked samples) through the existing sample-instrument editor. | Nexus-style layered rompler |
| `neon` `iron` `titanium` `carbon` `helium` `mercury` | ELEMENTS suite | Add effect → Elements | NEON parametric EQ (drag bands on a live spectrum), IRON compressor (four characters, phase-aligned parallel mix), TITANIUM lookahead limiter (wraps the mastering limiter), CARBON three-band saturation, HELIUM generated-impulse reverb (room/hall/plate/chamber), MERCURY tempo delay (ping-pong, feedback tone, wow, drive). One shared face layout with a periodic-table tile. | FabFilter-style visual mixing |

## Host changes

- `synths/index.js` registers the four instruments. `pro-instruments-config.js`, `pro-instruments.js`, `live-player-setup.js` and `pro-devices-ui.js` add `valorium` as a sample instrument (zones reuse the Concert Piano schema; starter roots are prefetched before playback).
- `engine.js` adds `bpm` to each synth note (used by the trance gate) and passes the project tempo to tempo-synced plugins (`tempoSync: true`), re-applying them when the BPM changes.
- `plugins.js` spreads `ELEMENT_EFFECT_TYPES` from `elements-fx.js` into the registry and asks it for latency and tail. `plugin-faces/index.js` lazy-loads `plugin-faces/elements.js` for all six.
- New type IDs only: existing projects, synths and effects are unchanged.

## Verification

`tools/pro-marek-synths-test.mjs` and `tools/pro-elements-fx-test.mjs` (both in `pro-suite.mjs`) run in headless Chrome:

- Synths: default level, all 8 presets, every parameter at min and max and every select option, short and held notes, pitch at E2/A3/A4 within 35 cents, no leaked sources, trance gate timing, wavetable scan brightening. VALORIUM: each starter family's level and pitch, presets, parameter sweep, held loop and release, tail estimate, custom zone pitch.
- Effects: default, all-min/all-max and every option finite; NEON null at defaults and an exact +6 dB bell; IRON gain reduction and a parallel mix aligned to the input within 2e-3; TITANIUM never above the ceiling; CARBON flat within 0.1 dB across both splits; HELIUM decaying, stereo, deterministic tail; MERCURY first echo at 375 ms (1/8. at 120 BPM) on the left only, second on the right. Each face mounts, loads presets and accepts display drags.
- `audionaut-test.mjs` and `picker-test.mjs` pass for the four instruments in both editions (rows play, panels fit at desktop and 390 px, keyboard, save/load, picker). Existing `pro-faces`, `pro-new-effects`, `pro-devices-integration`, `pro-new-instruments`, `voice-lifecycle`, `performance-regression` and `pro-five-synths` suites still pass.

## Not verified / known limits

- Nothing has been auditioned by ear. Levels and timbre were checked by measurement only.
- `pro-chain-integration-test` (needs `@stacks/transactions`) and `chain-null.mjs` (fails on the untouched code with "Pattern refers to unavailable tracks") could not run here.
- The trance gate reads the project BPM at note-on; tempo-map changes inside a held note are not followed.
- VALORIUM starter roots render on first use (about 5–55 ms each, cached per audio context). The sequencer prefetches them; live playing of an unprefetched root can hitch once.
- CARBON runs without oversampling (oversampling delay would misalign the bands), so very high drive on the high band can alias.
- Generic panels are used for the four instruments; bespoke faces are a follow-up.

## Review fixes (27 November 2026)

- Held notes: cutoff and resonance (and LOSTWAVE filter 2 cutoff) now move the sounding voice. Controls that still rebuild the voice join its envelopes, gate and wavetable scan at their true age instead of restarting them. The filter envelope now runs on the filter's detune.
- VALORIUM pluck and guitar are on pitch at every starter root (they were up to 92 cents sharp near C7).
- CARBON's Mix blends phase-matched paths (it notched both splits by 20 dB at 50%), and a 10 Hz high-pass removes drive DC.
- ELEMENT's analog table keeps its fundamental through a scan; warp amounts step in 21 values and the wave, gate and sync caches are bounded.
- IRON's characters shape timing and knee only (the input drive is gone). Makeup is ±12/+18 dB and output ±12 dB.
- MERCURY's export tail follows the project tempo (`render-mix.js` passes `bpm`).
- HELIUM waits for a control to rest before rebuilding its impulse, and keeps only one convolver loaded.

Each has a regression check in `marek-synth-checks.js` or `elements-fx-checks.js`, except the HELIUM live debounce, which only runs in a live audio context and is untested.

## Voice budget (live playback)

`daw/js/voice-budget.js` adds a load-aware limit on top of the original note
limits (64 notes, 16 per instrument).

- **What is counted.** Each note records how many sources (oscillators and
  sample players) it built. Measured per note: MAVREKT 3–12, LOSTWAVE 2–18,
  ELEMENT 4–25, the older synths 1–2.
- **Budgets.** Desktop: 64 notes, 16 per instrument, 480 sources. Touch devices
  (`hover: none` and `pointer: coarse`): 32 notes, 10 per instrument, 160
  sources. These numbers are first estimates and have not been tuned on real
  phones.
- **Which note gives way.** A note already released and fading, then the oldest
  held note that is not the instrument's lowest, then the oldest of anything.
  The cut uses the existing 5 ms fade.
- **Export is unchanged.** Offline renders keep the original limits and victim
  order, so a saved project renders the same as before.
- **Where to see it.** Diagnostics shows sources in use, the peak, and how many
  notes were cut. `engine.voiceBudget` can be changed at run time.
