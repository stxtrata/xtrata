# Marek collection · first versions (27 November 2026)

Five custom plugins designed from the tools producer Marek (mvrek / Lost Element / Nu Valorem) uses most. Each is an original design for the Audionaut runtime, inspired by a type of instrument rather than a copy of any product. The names nod to Marek's artist aliases. The same files ship in Beta Pro and the community Beta.

| ID | Name | Where | What it is | Inspired by |
|---|---|---|---|---|
| `mvrek` | jiMVREK | Leads | Two-layer virtual-analogue trance poly. Part A (up to 7 unison voices) and Part B (up to 5), each with its own low-pass. Drive, decay/sustain, tempo-locked 16-step trance gate. | Sylenth1-style workflow |
| `element` | jiELEMENT | Wavetable, Phase & West-Coast | Six-frame wavetables (analog, formant, digital, glass, growl, organ) scanned per note from a start to an end position. Five warp modes. Unison, sub, noise, LP12/LP24/HP/BP filter with envelope. Live scope of the start frame. | Serum 2-style sound design |
| `lostwave` | jiLOSTWAVE | Leads | Four multi-mode oscillators (saw, square, HYPER stack up to 9, FM, hard sync, AM, noise), two filters in series or parallel, PUNCH onset and soft clip. | Spire-style EDM leads |
| `valorem` | jiVALOREM | Pianos & Electric Pianos (sample instrument) | Four sample layers through a shared filter, drive and ADSR. Starter pack is modelled in code: keys, pluck, guitar, strings, pad, choir, bell. Layer A can play a custom pack of key/velocity zones (imported or Xtrata-linked samples) through the existing sample-instrument editor. | Nexus-style layered rompler |
| `neon` `iron` `titanium` `carbon` `helium` `mercury` | ELEMENTS suite | Add effect → Elements | NEON parametric EQ (drag bands on a live spectrum), IRON compressor (four characters, phase-aligned parallel mix), TITANIUM lookahead limiter (wraps the mastering limiter), CARBON three-band saturation, HELIUM generated-impulse reverb (room/hall/plate/chamber), MERCURY tempo delay (ping-pong, feedback tone, wow, drive). One shared face layout with a periodic-table tile. | FabFilter-style visual mixing |

## Host changes

- `synths/index.js` registers the four instruments. `pro-instruments-config.js`, `pro-instruments.js`, `live-player-setup.js` and `pro-devices-ui.js` add `valorem` as a sample instrument (zones reuse the Concert Piano schema; starter roots are prefetched before playback).
- `engine.js` adds `bpm` to each synth note (used by the trance gate) and passes the project tempo to tempo-synced plugins (`tempoSync: true`), re-applying them when the BPM changes.
- `plugins.js` spreads `ELEMENT_EFFECT_TYPES` from `elements-fx.js` into the registry and asks it for latency and tail. `plugin-faces/index.js` lazy-loads `plugin-faces/elements.js` for all six.
- New type IDs only: existing projects, synths and effects are unchanged.

## Verification

`tools/pro-marek-synths-test.mjs` and `tools/pro-elements-fx-test.mjs` (both in `pro-suite.mjs`) run in headless Chrome:

- Synths: default level, all 8 presets, every parameter at min and max and every select option, short and held notes, pitch at E2/A3/A4 within 35 cents, no leaked sources, trance gate timing, wavetable scan brightening. jiVALOREM: each starter family's level and pitch, presets, parameter sweep, held loop and release, tail estimate, custom zone pitch.
- Effects: default, all-min/all-max and every option finite; NEON null at defaults and an exact +6 dB bell; IRON gain reduction and a parallel mix aligned to the input within 2e-3; TITANIUM never above the ceiling; CARBON flat within 0.1 dB across both splits; HELIUM decaying, stereo, deterministic tail; MERCURY first echo at 375 ms (1/8. at 120 BPM) on the left only, second on the right. Each face mounts, loads presets and accepts display drags.
- `audionaut-test.mjs` and `picker-test.mjs` pass for the four instruments in both editions (rows play, panels fit at desktop and 390 px, keyboard, save/load, picker). Existing `pro-faces`, `pro-new-effects`, `pro-devices-integration`, `pro-new-instruments`, `voice-lifecycle`, `performance-regression` and `pro-five-synths` suites still pass.

## Not verified / known limits

- Nothing has been auditioned by ear. Levels and timbre were checked by measurement only.
- `pro-chain-integration-test` (needs `@stacks/transactions`) and `chain-null.mjs` (fails on the untouched code with "Pattern refers to unavailable tracks") could not run here.
- The trance gate reads the project BPM at note-on; tempo-map changes inside a held note are not followed.
- jiVALOREM starter roots render on first use (about 5–55 ms each, cached per audio context). The sequencer prefetches them; live playing of an unprefetched root can hitch once.
- CARBON runs without oversampling (oversampling delay would misalign the bands), so very high drive on the high band can alias.
- Generic panels are used for the four instruments; bespoke faces are a follow-up.
