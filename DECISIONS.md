# Decisions (synth polish run)

One line each: what was decided and why.

- Harnesses `measure.mjs`, `audionaut-test.mjs`, `picker-test.mjs` were not in this checkout or the cloud box (they were last kept on the local machine, which had no folder connected and nobody to approve access). Recreated equivalents in `xtrata-2.0/public/audionaut/tools/` (next to `daw.html`), self-contained with their own static server.
- Measure pass criteria follow the synth-module brief: defaults at A3 / vel 1 / 1.5 s gate / 4 s render, rms 0.04–0.14, peak < 0.9; presets peak < 0.9 and rms 0.02–0.17 unless the preset is percussive (`cat` names a hit/pluck/drum).
- A non-looping AudioBufferSource that is never stopped is not a leak (it ends at its buffer end), so the harness only demands an explicit stop() for oscillators and looping buffers.
- The original non-polish synths (jiMS10, Acidals) fail peak < 0.9 at baseline; they are out of scope and were not touched (logged in IDEAS.md).
- Held notes within the one-shot contract: the host plays the voice with a long gate into a per-note gain and, on key-up, fades that gain over the patch's `release` and stops the voice's own sources early. No synth code changes needed; synths can tune it with an optional `live` field.
- Struck / plucked / drum synths (ASIC, Ordinal, Taproot, Lightnode) ignore key-up (`live.oneShot`): like a real mallet or string, the note rings out. Key lights still follow the key.
- Offline-rendered synths that sustain (Privkey, Coinbase) cap a held note at a 2.5 s render: an 8 s render costs 60–75 ms per uncached note.
- Pointer velocity = key height (0.45 at the top, 1.0 at the front edge), computer keys 0.8, MIDI its own velocity.
- Fixed-layout playing surfaces (Ordinal's bars) do not follow the octave shift, because each bar is labelled with its note.
- The host preset menu was added to the face toolbar (the faces' own preset strips cannot hold 48–96 entries); faces keep their own browsers and both stay in sync.
- Phase 2 was run as parallel agents (one per synth, brief in `audionaut/tools/POLISH-BRIEF.md`), each restricted to its own module + face; the coordinator ran the shared suites and committed.
- Face preset lists now receive each preset's `cat` from the host (`runtime.js presetList`), so faces that group by category show headers.
- Several engines got fixes that slightly change existing presets' level or width (Muneeb section detune now actually sounds; Whale detune centred; Layers/ASIC/Mempool gain staging). Preset names and parameter values are unchanged.
- Schnorr gained 4 material options (reed, bar, sub, cloud) and Strike range 0–2; Szabo `level` max 1.5→3. Defaults and existing values unchanged.
