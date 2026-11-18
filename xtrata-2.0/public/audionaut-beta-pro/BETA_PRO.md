# AudioNaut beta-pro

A separate, token-gated community test edition at `/audionaut-beta-pro`.

The original `/audionaut` and `/audionaut-beta` directories are unchanged. This edition has its own code, browser settings, project database, recordings database, preset bank and workspace preferences. Files move between editions only when the member explicitly downloads and opens them.

## What is new

- **Song arrangement:** stable track and clip identities; up to 32 instruments and 64 sample tracks; editable pattern, MIDI and audio clips; split, move, resize, duplicate, slip, fades and gain; tempo and meter changes, markers, loop and punch ranges. The original pattern editor remains available.
- **Mixer:** stereo pan, input trim, groups, effects buses, pre/post-fader sends, master effects and mono monitoring, external sidechain detectors, and compensation for supported effect latency. Imported songs retain their original fader order.
- **Automation:** editable lanes and points for levels, pan, synth controls, effect parameters and pitch bend; linear/step curves; read, touch, latch and write modes. Continuous parameters use scheduled AudioParams; topology/model changes are discrete or crossfaded according to the instrument/effect.
- **Recording:** uncompressed audio input, optional monitoring, count-in and metronome, punch recording, recoverable audio chunks, named takes and range comping. Armed instruments record MIDI with input/channel routing, timestamp compensation, raw timing, adjustable quantization, ties across pattern boundaries, pitch bend and controller expression. Standard MIDI file import/export and the full 128-note editor range are included.
- **Sampler:** worker-based time stretching and duration-preserving pitch shifts, transient slicing, loop crossfade copies, note/velocity zones, sample loops and envelopes. Processing creates separate audio copies. The source remains available.
- **Sound engine:** shared live/export playback plans, improved pause/resume, active sample mute, explicit voice lifecycle and live parameter changes, short-envelope and long-note fixes, bounded preparation caches, deterministic random sources, corrected stereo dynamics, limiter ceiling protection and runaway-feedback protection.
- **Mix delivery:** 16-bit, 24-bit and float WAV; sample-rate selection; stems in a ZIP archive; explicit or automatic effect tails; progress and cancellation; reversible freeze/unfreeze. A frozen track retains its editable source and downstream routing.
- **Projects:** version 3 documents with legacy import, immutable binary assets, metadata-only project listings, named/pinned versions, deduplication, bounded checkpoints, clock-independent revision ordering and concurrent-tab conflict copies. Collect-all portable projects and verified missing-asset relinking support archiving.
- **Workspace:** separate editing views, command search, editable shortcuts, keyboard clip/point controls, dialog focus handling, saved view preferences, lazy-loaded instrument/effect faces, bounded timeline rendering and diagnostics.
- **Metering:** stereo peak/RMS, DC, correlation, momentary/short-term/gated integrated loudness and a labelled 4× FIR true-peak estimate. These are engineering meters, not a claim of certified broadcast compliance.
- **Access:** the same Audionaut collection determines membership. Beta-pro additionally requires a signed Xtrata sign-in and server-side ownership verification for workstation resources. Sign-in is a message proof, not a transaction. An expired access check pauses playback, checkpoints the project and retains the open frame for reauthentication or download.

## File compatibility

The importer accepts the original workstation format, the existing beta format, and supported legacy Audional formats. All 20 original starter songs, all 28 original synth patches, embedded WAV audio and pinned clip metadata are covered by compatibility tests. Version 3 preserves dynamic tracks, timeline clips, automation, routing, takes and original raw note timing. Unknown versions or invalid project structures are rejected before replacing the open project.

New beta-pro files are not guaranteed to retain their new features when opened in earlier editions. Keep the original file when experimenting. Saved recovery histories in the earlier editions are neither read nor migrated automatically.

## Practical limits

This is a community beta. Browser scheduling, audio-device drivers and permissions still matter. External MIDI hardware, real recording interfaces and wallet-extension interactions need community validation on each target platform.

The project model allows 32 instruments, 64 sample tracks, 32 buses, 64 legacy patterns and 10,000 clips. Recordings use bounded chunk storage; offline render preparation has a 512 MiB working-memory budget. Sample processing accepts mono/stereo material up to 128 MiB per operation and offers cancellation. Freeze can reduce live synthesis work. Multi-hour sessions can be exercised through the manual CI endurance input; the shipped tests do not promise unlimited browser capacity.

Rendered and granular instruments use crossfaded sustain regions where appropriate; they are not streaming models with unlimited internal evolution. Continuous synth automation is available for explicitly bound parameters; other controls use discrete updates or crossfades.

Time stretching uses a stereo-coherent WSOLA processor. It is useful for ordinary loop editing but is not a claim of transparent processing at every ratio or for every source. Loudness/true-peak readings are estimates. Seeded exports preserve the musical render; native floating-point summing may differ at inaudible numerical levels between browsers or independent audio contexts.

## Validation and release

`tools/pro-suite.mjs` runs the automated model, recovery, DSP, browser workflow, export, access, compatibility, storage-isolation and endurance checks. `functions/lib/__tests__/audionaut-pro-auth.test.ts` tests server authorization with disposable generated signers and mocked ownership responses. No personal wallet or paid transaction is used.

The dedicated GitHub Actions workflow runs the suite for this branch and relevant pull requests. The gate bundle is built by `npm run build:audionaut-beta-pro` and included in the normal site build. Production deployment adds the beta-pro route; it does not replace the original or beta route.
