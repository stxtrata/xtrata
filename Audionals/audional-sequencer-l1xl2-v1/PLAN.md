# L1xL2 v1 implementation plan and acceptance checklist

## Objective

Build a separate version of Sequencer X that combines its editable waveform arrangement and step grid with the recovered L1 audio catalogue, word-search sampler workflow and useful audio utilities. Keep the existing apps intact and deliver a static, wallet-free application.

## Architecture decisions

- Retain X's Web Audio engine and musical state model rather than mixing it with a second Tone.js engine. This keeps its synths, piano rolls, effects, sequencing and arrangement geometry consistent.
- Bundle compact, attributable catalogue/timing JSON. Fetch audio on demand instead of preloading 1,682 recordings. Keep previews bounded and sample assignments transactional.
- Use one source decoder for Bitcoin, Xtrata, URLs and files. Parse embedded audio without executing inscription HTML or scripts. Support codec parameters in data URIs.
- Place phrases at channel or per-step scope. Save exact normalized regions plus human-readable text, source ID and seconds. Preserve explicit false reverse overrides.
- Give the new app a distinct project format/storage namespace while retaining X/B64x imports. Embed new local files for portable saves; report storage limits visibly.
- Use the actual Xtrata runtime content endpoint and public contract configuration found in the local repository. Access is read-only.

## Delivery phases

1. Create the new directory and retain the complete X foundation.
2. Recover/deduplicate catalogue IDs, curated names, metadata and transcript coverage; include all positive-duration word timings.
3. Build a searchable/paged source browser with destination selection, editable phrase bounds, audition, sampler placement and favourites.
4. Improve decoding, cancellation, source replacement, buffer restoration, local-file portability and project validation.
5. Add analysis/CSV, selected-section WAV, loop-tempo calculation, master-output recording and MIDI input.
6. Test pure logic and browser workflows; inspect desktop/mobile output and publish usage/provenance documentation.

## Acceptance checklist

- [x] Separate application directory and storage namespace.
- [x] Arrangement waveforms and original 64-step controls retained.
- [x] All 1,621 saved catalogue IDs and the deduplicated 1,682-source union included.
- [x] 16,125 positive-duration word records from 638 sources searchable.
- [x] Real L1 phrase previews and exact channel/per-step placement.
- [x] Real L2 inscription 1120 decoded through the loader UI.
- [x] Bitcoin HTML and Base64 JSON decoding verified.
- [x] Cancel/error/stale-load guards; source changes remove stale step overrides.
- [x] Phrase regions/metadata survive project save/load and sequence copying.
- [x] Favourites and portable local-file saves.
- [x] Analysis, CSV and selected-section WAV tools.
- [x] Master-output mix recording.
- [x] Original synth/piano-roll/preset/effects workflows retained; MIDI-message recording tested.
- [x] Automated logic tests and desktop/mobile browser checks pass.
- [x] Usage, provenance, limits and verification documented.

## Deliberate scope boundaries

The saved L1 catalogue is a historical snapshot; no claim of exhaustive current-chain coverage is made. No new recognition model or unverified original transcription generator is included. Index timings need human correction where inaccurate. This version does not convert arbitrary Tone synth patches or every experimental project's format. MIDI hardware still needs a physical-device check. Existing inscription audio is downloaded for playback only when chosen; nothing is inscribed or broadcast.

## Onboard sound library review and expansion plan — 2 October 2026

### Current library and measured findings

The current sample kit contains 24 locally rendered sounds: four kicks, three snares, one clap, three hats, two cymbals, three toms, cowbell, rimshot, shaker, four 808 basses and a zap. The basses use E1, G1 and A1, with a second distorted E1 version. Every sample is mono at 44.1 kHz. Noise generators use fixed seeds and rendered samples are cached by their kit keys. These are working building blocks for drum beats; they are not yet a broad melodic sample library.

The six playable synth engines are jiMS10 (subtractive), Acidals 303, FMonad (FM), Stacker (detuned voices), Chip-8 and SubZero. Their oscillator/filter/envelope voices can supply many of the new tonal samples without an external instrument or recording library. They currently play as instruments; their presets are not available as labelled, embedded sampler sounds.

All 24 kit sounds were rendered for this review. They total 11.910 seconds and would occupy about 1.05 MB as individual mono 16-bit WAVs, or approximately 1.40 MB with Base64 encoding, before JSON overhead. Eight unattenuated buffers contain samples above ±1: punch/hard kicks, tight/fat/rock snares, closed hat, ride and crash. The largest peak is approximately 1.576 in the rock snare. Channel attenuation can prevent audible clipping during a mix, but unity-gain 16-bit WAV export currently clamps those peaks. The maximum measured absolute DC offset is about 0.00416. Detailed measurements are saved in [the sound audit](reports/onboard-sound-audit.json).

Current gaps are consistent output levels, sample root-note metadata, musical descriptions and tags, velocity variants, loop metadata, tonal sampler presets, and a versioned export/embedding workflow. Timbre variety is also limited: cymbals are filtered noise, tonal basses are closely related sine-based 808 sounds, and the melodic engines have not been curated into a sampler bank. These findings are measurements and a code review, not a listening review of every possible patch.

### Proposed library

Keep the existing 24 sounds available for saved-project compatibility. Add 96 new tonal patches and 24 new percussion patches, for a target of 144 named sounds before velocity layers and multi-note renders. Count patches separately from rendered files: a patch may later have several root notes or velocities.

| New tonal family  | Patches | Useful sounds and approach                                                                                                                                     |
| ----------------- | ------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bass              |      16 | Clean sub, rounded analogue, short acid, FM growl, plucked bass, distorted/reese-like colours; jiMS10, Acidals, SubZero and controlled new oscillators.        |
| Plucks            |      16 | Soft sine pluck, metallic FM, muted string-like pluck, glass, woody and digital variants; FM/subtractive voices, plus a new seeded string-resonator generator. |
| Keys              |      16 | Electric-piano-like, tine, organ, soft digital and synthetic piano-like sounds; FM, additive harmonics and envelopes. Label these as synthesized sounds.       |
| Bells and mallets |      12 | Bell, glock-like, marimba-like, vibraphone-like and gamelan-inspired sounds; tuned harmonic/inharmonic partials with a stated root note.                       |
| Leads             |      12 | Rounded mono, chip pulse, square, saw, vowel-like and octave leads; existing engines with curated filter/envelope settings.                                    |
| Pads              |      12 | Warm, glass, detuned, airy and dark textures; longer envelopes and optional stereo versions with controlled width.                                             |
| Chord stabs       |      12 | Major, minor, sus2/sus4, seventh and fifth-based stabs; bake labelled voicings into short samples that transpose as a whole.                                   |

The additional 24 percussion patches should provide four new kicks, four snares, three claps, three hats, four tuned percussion sounds, three shakers/noise textures and three impacts/fills. Prioritize dry usable sounds and a few distinct metallic/wooden colours over many nearly identical variants. Keep the 808 families and add a compact modern electronic kit, a softer organic-style kit and an experimental kit.

### Delivery order

1. **Make export quality reliable.** Add an explicit render-finalization stage: inspect finite samples, remove unwanted DC, set intentional peak/headroom targets, trim unnecessary silence, apply short edge fades and retain measured duration/peak/RMS. Target roughly −3 dBFS sample peak as a starting point; calibrate perceived loudness by family so a quiet sub is not boosted simply to match a noisy snare. Avoid baking master mix effects into every sound. Preserve old kit keys/renders and introduce versioned improved definitions so old projects do not unexpectedly change.
2. **Deliver a 32-patch tonal pilot.** Eight basses, eight plucks, eight keys, four bells and four pads. Use existing voices first, with one canonical root note per patch and dry mono files by default. Each patch should have a genuinely different musical role. Review them in house, hip-hop, ambient, breaks and the combined presets before growing the catalogue.
3. **Make tonal samples easy to sequence.** Add family, root note, tuning, sustain/one-shot and duration tags; audition a sample at its root. Add a note picker to sample steps that converts target MIDI note to playback rate using the source root. Keep pitch changes explicit because ordinary sample transposition also changes duration. Baked chord stabs work within the current single-trigger step format; do not imply that the existing sampler already has a polyphonic note editor.
4. **Expand to the full bank.** Grow the tonal pilot to 96 patches and add the 24 percussion patches. Add extra octave roots only where listening shows that a single sample becomes thin or artificial when transposed. Start with up to three sensible roots per tonal patch rather than rendering every semitone. Use velocity layers selectively for keys/mallets; vary attack or brightness as well as volume.
5. **Embed approved sounds and update beats.** Export selected buffers as audio assets, create embedded banks and wire the approved bank into the library and combined presets. Add tonal beat variants that demonstrate bass, pluck, key, pad and chord roles. Keep the current original, L1-only and combined groups selectable.
6. **Prepare L2 publication.** Build and verify the actual packaged files and source manifest first. Inscription/deployment is a separate future action, with approved final assets and authorized publishing tooling.

### Generation and embedded formats

Use `OfflineAudioContext` for the render pipeline, reusing the synth voice API with frozen parameters, a fixed root MIDI note, gate time, velocity, sample rate and seed. Capture the complete release tail. Noise seeds make recipes reproducible, but Web Audio implementations can produce small differences between browsers; designate a canonical render environment and hash the final exported bytes. Store the recipe alongside the approved audio rather than assuming a future browser will regenerate identical bytes.

For the first bank, use mono 44.1 kHz 16-bit PCM WAV for short sounds. Support optional stereo pads, but account for doubled size. Retain a higher-precision local working render before quantizing the embedded asset. After quality review, consider alternative codecs only if size savings justify their attack/loop behaviour and supported decoding. Do not bake delay/reverb into every asset: dry samples are easier to mix, and the sequencer already provides those effects.

The current decoder accepts both raw WAV and JSON with Base64 `audioData` plus `filename`. A planned bank entry should additionally include stable `soundId`, library/render version, category, tags, generator and parameters, seed, `rootMidi`, tuning, sample rate/channels, duration, peak/RMS, optional loop start/end, chord voicing, and the audio-byte hash. Extend metadata extraction to carry those fields into the sampler. For looped pads, store and validate a sustain loop; the current sampler does not yet repeat an internal loop automatically, so that playback feature needs implementing before calling those assets sustained instruments.

A one-second mono WAV is about 88.2 KB; Base64 increases that to about 117.7 KB. A four-second mono pad is about 352.8 KB as WAV or 470.4 KB as Base64; stereo doubles those figures. Use separate family packs and lazy decoding instead of decoding the whole bank on app startup. Measure the actual proposed pack sizes before committing to an on-chain format or cost. The current 64 MB remote cache should remain bounded; apply a similar budget to the enlarged local render cache, which is currently unbounded but small at 24 sounds.

### L1/L2 source continuity

The combined collection now contains 96 presets: three versions of each original beat, using all 24 existing built-in sounds across the collection and genuine L1 percussion. L1 inscription IDs stay attached to their channels. Built-in keys remain stable and are visibly described as **local today / planned L2**; no L2 IDs have been invented.

When approved embedded sounds are actually inscribed, add a manifest that maps stable sound IDs and audio hashes to the verified Xtrata content references and network/contract. Extend combined-kit validation and source resolution for those real L2 sources. Retain local playback for existing `synth` project references, and provide an explicit manifest-based migration so users can choose the on-chain version. Validate L2-decoded audio against the packaged hash and metadata, then verify saved projects and the combined beat catalogue again. Keep beat instructions separate from audio assets and record provenance for both.

### Acceptance checks for the expansion

- Every named patch has a musical role, frozen recipe, root/voicing metadata and an approved audition.
- Exported audio has no non-finite values or unintended clipping, and its attack/release edges are clean; measure level/DC and listen to representative layered mixes.
- Tonal roots are verified; notes transpose correctly, and duration changes are reflected in Arrange and exported audio.
- Sustained assets have tested loop boundaries and explicit playback support; stereo assets remain usable in mono.
- Embedded assets decode with the existing raw/JSON loader path plus new metadata handling; cancelled/failed loads leave the session intact.
- Approved byte hashes match the manifest, and save/reopen retains source identity, version, regions and pitched steps.
- Preview stays responsive on a phone-sized layout; loading is lazy, cache use is bounded, and pack bytes/durations are reported.
- L2 source labels/links appear only for verified deployed assets, with local and L1 alternatives still available.

## Expansion implementation result — 2 October 2026

The full bank is implemented: 144 named patches, 184 canonical assets, nine embedded family packs and individual publication payloads. The original 24 legacy renders remain compatible; the improved studio versions have separate v2 keys. The 32-patch pilot recipes were expanded into the complete 96 tonal patches in the same release. Selected three-root recordings and soft/bright layers, versioned recipes, SHA-256 checks, source metadata, root-relative step notes, stereo pads and explicit sustain gates are available.

- [x] Finite audio, DC correction, silence trimming, edge fades, family headroom and measurements.
- [x] All planned family counts and frozen generator recipes.
- [x] Canonical WAV bytes, Float32 working renders, family packs and 184 publication payloads with file/audio hashes.
- [x] Root/layer selection, step notes, baked voicings, internal pad loops and gate controls.
- [x] Matching playback, Arrange duration/waveform repetition, note labels and gated/pitched WAV export.
- [x] Lazy bank loading; bounded 64 MB decoded/legacy caches and 24 MB encoded-pack cache.
- [x] Hash and metadata validation; transactional loads and save/reopen of rooted/layered sources and notes.
- [x] 32 onboard tonal beats plus 32 new melodic combined beats; original 32, L1 96 and the existing combined 96 retained.
- [x] Publication manifest and read-only, verified replacement migration for genuine future L2 mappings; no fabricated IDs.
- [x] 45 offline tests, all 184 browser decodes, root tuning check, sustain/stereo/mono checks, corrupted-payload rejection and phone layout.
- [ ] Human listening approval of every individual timbre and selective variants. Numerical checks do not replace listening.
- [ ] Actual L2 publication and verification against those newly deployed inscriptions. Publishing remains a separate authorized action.

See README.md for use and reproduction, and reports/onboard-expansion-audit.json for the complete asset measurements. Embedded packs total 30,813,832 bytes, of which the canonical WAVs occupy 22,962,570 bytes. All generated media remains local; nothing is staged or pushed.



## Beat catalogue upgrade

Implemented 96 Original presets and enhanced the existing 96 core Combined presets. Both independently cover all 144 named patches and all 184 root/layer assets, with 96 distinct four-bar rhythm arrangements. Three variations retain each historic style’s tempo/swing and core rhythm while adding ghost notes, fills, rooted bass lines, two melodic parts and gated textures or baked chords. Role-based rotation keeps every patch in use; layered keys receive additional appearances to cover their six assets. The Combined IDs and three L1 lanes are retained, alongside the 32 additional ensembles (128 total). L1-only 96 and tonal demonstrations 32 remain separate.

Acceptance: catalogue counts and distinct rhythms; complete patch/asset coverage; in-range pitches with coherent source roots and chord palettes; correct variant deduplication; persisted beat identity and kit size; real-audio preparation of every upgraded preset; uninterrupted switching and source filtering/details in desktop and phone-sized popups. Coverage data is in reports/beat-library-coverage.json. No new audio renders or publication were required.
