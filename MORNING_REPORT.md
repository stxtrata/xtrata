# Morning report — Audionaut synth polish

**Branch:** `audionaut-synth-polish` (pushed). Base: `audionaut-synth-rename` @ 9608acc. Other branches untouched.
**Open a synth:** serve `xtrata-2.0/public` (`python3 -m http.server 8099`), open `http://localhost:8099/audionaut/daw.html`, pick the synth on any instrument row (folder picker), then the 🎛 button. Host preset menu is in the panel toolbar, grouped by category.

## Shared keyboard (Phase 1) — done
One live-play path for every input (`daw/js/live-keys.js` + `engine.startNote/releaseNote`): notes are now **held** until key-up/note-off, glissando up and down, multi-touch, pointer capture, release on blur/tab switch/pointer leaving the window, computer keys + MIDI + on-screen keys share velocity handling and one octave (Z/X). Lights follow real note state. Drums, mallets, plucks and Lightnode ring out on key-up by design.

## Per synth
| Synth | Status | Presets (was) | Key changes |
|---|---|---|---|
| Whale | done | 58 (8) | centred detune (was drifting sharp); scrollable preset list |
| Privkey | done | 55 (8) | render faster, library across Rhodes/Wurli/piano/clav |
| Cathedral | done | 58 (8) | registrations library, level up slightly |
| ASIC | done | 56 kits (8) | soft limiter, drive make-up, per-drum balance; fixed face resetting custom patches |
| Layers | done | 56 (8) | gain staging (default was under band), choir make-up |
| Ordinal | done | 51 (8) | ~3× faster render; scrollable chips |
| Muneeb | done | 54 (8) | **bug fix:** section detune never sounded; smoother scoop; per-model trims |
| Szabo | done | 64 (8) | level range to 3 (fixes quiet plucks); scrollable list |
| Mempool | done | 56 (9) | cloud render ~200 ms → ~20 ms; riser level trim |
| Lightnode | done | 50 (8) | low-rate render ~5× cheaper; presets pushed to organ/bass/lo-fi/pluck/swell, away from bell glass |
| Schnorr | done | 52 (8) | 4 new materials (reed, bar, sub, cloud), Strike to 2 → basses, leads, keys, hits |
| Coinbase | done | 58 (6) | sine-table renderer + LRU cache (~2× faster); pip row replaced by counter |
| Gm | done | 54 (6) | **clipping fixed** (peaks were up to 2.9, now < 0.56) |
| Taproot | done | 50 (6) | softened onset, cache, seeded noise; 1 harness warning remains (see below) |

**Tests (final run, whole bank):** `measure.mjs all` — 0 FAIL on all 14 (only jiMS10 and Acidals fail, both untouched and failing at baseline). `audionaut-test.mjs` on the 14 — all DAW checks passed (every row plays, panels fit at desktop and 390 px, preset menu + recall, full keyboard suite, save/load, roll dropdown, 4 synths on the transport, console clean). `picker-test.mjs all` — 15 folders, all 28 synths picked on 4 rows.

## Audition list (least sure about, nothing was heard)
- **Whale:** Glass Bass, Hollow Tube, Acid Screamer, 808 Crunch, Clank
- **Privkey / Cathedral:** check the extreme piano/clav and full-organ/drive presets by ear
- **ASIC:** Telephone Kit, Underwater, Muffled Next Door, Laser Toms, Pocket Calculator
- **Layers:** Robot Choir, Iron Drone, Reso Bloom, Rotary Organ, Staccato Strings
- **Ordinal:** Wood Clack, Alien Bowl, Pan Roll, Tine Keys, Bell Drone
- **Muneeb:** Ghost Whistle, Hollow Bow, Orchestra Hit, Musette, Tuba / Double Bass
- **Szabo:** Wood Block, Glitch Scan, Falling Table, Bamboo Knock, Reese Morph
- **Mempool:** Door Slam, Downlifter Sweep, Arctic Blizzard, Laser Wind, Snare Roll Lift
- **Lightnode:** Muted Pluck, Reverse Swell, Ghost Choir, Comet Tail, Hum Organ
- **Schnorr:** Sine Sub / Sub Pluck / Sub Drone (sound an octave down), Noise Tick, Laser Fall, Radio Ghost, Bronze Growl
- **Coinbase:** Noise Burst, Laser Zap, Percussive Organ, Shimmer Swell, Sitar Buzz
- **Gm:** check the whisper / robot presets after the gain fix
- **Taproot:** Sitar Drone, Mbira Buzz, Slap Pop, Frozen Lake, Night Bells

## Compromises and open items
- **Taproot** still trips the harness onset-jump warning (1.07 → 0.64); it is pick noise, not a step — a new excitation design is in IDEAS.md.
- **Uncached render > 20 ms** at some settings: Privkey (~19–35 ms), Ordinal long bells, Coinbase long pads, Lightnode cold first notes (JIT). Timings were taken with up to 8 agents loading 2 CPUs, so absolute numbers are inflated; cached repeats are ~1 ms.
- Engine fixes nudge some existing presets' level/width (Muneeb detune now audible, Whale detune centred). Names and values were kept.
- Not done: CPU check at high polyphony in a real browser, Safari/Firefox/mobile devices, the classic jiMS10 panel is the only non-face panel.
- At 390 px the face toolbar's right-hand buttons are clipped (host CSS, not fixed).

See `DECISIONS.md` and `IDEAS.md` for the full lists; `PROGRESS.md` for status.
