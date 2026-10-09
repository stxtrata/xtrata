# Brief: polish one Audionaut synth to production quality

You are one of several agents working in parallel in the same git checkout
`/home/claude/xtrata` (branch `audionaut-synth-polish`). Nobody is available to answer questions:
never stop to ask, make the best call, and list each decision (one line + reason) in your final report.

## Where things are
- App: `xtrata-2.0/public/audionaut/daw.html`, code in `xtrata-2.0/public/audionaut/daw/js/`.
- Folder synths: `daw/js/synths/<folder>/<file>.js`, each exports `<ID>_SYNTHS = { <id>: def }`.
- Inline originals Coinbase (`fm4`), Gm (`vox`), Taproot (`pluck`) live in `daw/js/synths-voices.js`. Leave them there.
- Every one of the 14 synths has a custom front panel ("face") in `daw/js/synth-faces/<id>.js`, hosted by
  `synth-faces/runtime.js` (helpers on `P`: bind, sub, keyboard, surface, scope, presets, loadPreset …).
  A face declares its OWN copy of the param list (`params: [{ id, label, min, max, step, def, options, fmt }]`)
  with face-native values: knobs use real units, selects use the INDEX into the synth's option list.
  If you change a synth param's range, default or options, update the face's copy to match.
  Faces may also contain a local `presets` array from the design stage — the host ignores it
  (P.presets comes from the synth def). Leave it or delete it; never rely on it.
- The host toolbar above every face now has a preset `<select>` grouped by each preset's `cat`.

## Hard rules (the synth contract)
- Plain browser ES modules, no build, no npm, NO imports between synth modules (copy small helpers), no network, no samples.
- `voice(ctx, dest, {pitch, vel, time, dur}, P)`, one-shot, no AudioWorklet; schedule everything relative to `time`.
  Parameter changes affect only new notes. No mutable state shared between notes (caches of immutable data are fine).
- Every note cleans up: every oscillator / looping source gets `stop()` at the end of its release tail, and the output
  gain disconnects in an `onended`. No endless tails. The host may also call `stop()` earlier (held-note release).
- No NaN/Infinity, no clicks (never ramp to exactly 0 — use 0.0001; exponential ramps never to 0).
- Default patch: velocity-1 A3 note → peak < 0.9 and rms ≈ 0.04–0.12 (harness band). Every preset: peak < 0.9.
- Offline-rendered voices: < 20 ms per uncached note at typical settings, keep the LRU cache.
- KEEP the synth id, every existing parameter `key`, and every existing preset (same name, same params/meaning).
  You may re-order presets (keep index 0 as the Init sound) and you may add `cat` to them. New params are allowed only
  if the default reproduces today's sound; prefer not to add any.
- Modules get inscribed on-chain as self-contained files: keep them compact. Store presets as data
  (e.g. a compact table expanded by a tiny helper), not repeated logic.
- Do NOT edit shared host files (`engine.js`, `live-keys.js`, `synth-panel.js`, `synth-faces/runtime.js`, `ui.js`,
  css, `synths.js` except your own inline synth if you own fm4/vox/pluck). If you need a host change, describe it in
  your report instead. Do NOT touch other synths' files. Do NOT git commit (the coordinator commits).
- Keyboard: the face must use `P.keyboard()` (or `P.surface()` for fixed bars/pads); never write keyboard logic in a face.
  Held notes: the host plays a voice with a long gate (`def.live.hold`, default 8 s) and on key-up fades it over
  `def.live.release(P)` or `P.release`/`P.rel` (0.25 s fallback). `live: { oneShot: true, gate }` makes key-up a no-op
  (drums, mallets, plucks). Tune the `live` field for your synth if needed.

## What to do (time box ≈ 35 minutes; leave it in a solid working state whatever happens)
1. Read the module and its face. Run the baseline: `cd xtrata-2.0/public/audionaut && node tools/measure.mjs <id> --levels --warns`.
2. Review engine, signal path, panel, controls and bugs. Enhance carefully (improve, don't rewrite): sound design,
   sensible ranges, smoothing (setTargetAtTime / short ramps for per-note modulation), proper envelopes, filter
   behaviour, gain staging (consistent level across presets, nothing clipping).
3. Preset library: AT LEAST 48 presets total (existing ones count, keep them), up to 96 only if the engine really
   produces that many clearly different sounds. Varied, musical, clearly named, no near-duplicates, each with a
   `cat` (5–9 short categories that suit the instrument, e.g. "Bass", "Keys", "Pads", "Leads", "FX"; for percussive
   ones use a cat containing "Perc"/"Hit"/"Pluck"/"Drum" so the harness allows a lower rms). Order: Init first, then
   grouped by category. Every preset should sit at a consistent level (rms ≈ 0.05–0.11 on the harness unless percussive).
   Presets must only use existing param keys and in-range values (the harness checks).
4. Melodic preset `lines` (DSL `step:note:len[:vel]`, steps 0–63): keep the existing ones, add a couple if the synth
   type calls for it (4–6 total, in a register that suits it).
5. Panel (the face): make sure the face's own preset browser copes with 48–96 entries (scrollable list, no overflowing
   pips/chips; if it shows one dot per preset, cap or replace that with a compact counter), labels are clear, nothing
   overlaps or overflows. Keep the face's visual identity. Check screenshots:
   `node tools/audionaut-test.mjs <id> --skip-daw --shots=/tmp/claude-0/shots-<id>` then Read the PNGs
   (`<id>.png` desktop 1400×900, `<id>-mobile.png` 390 px).
6. Tests — all must pass before you report done:
   - `node tools/measure.mjs <id> --levels --warns` → 0 FAIL; fix warnings where sensible (quiet/hot presets, clicks).
   - `node tools/audionaut-test.mjs <id> --skip-daw` → "all DAW checks passed" (keyboard feel, panel fit, preset menu, console clean).
   Other agents run harnesses at the same time, so render timings are inflated by CPU contention; judge render cost
   by re-running or by relative change.

## Final report (your last message), concise:
- What changed (engine / ranges / panel), with reasons.
- Preset count and categories (count per cat).
- Test results (paste the measure summary line and the DAW test result).
- The 5 presets you are least sure about (cannot be checked by ear) and any compromise.
- Decisions (one line each) and ideas for later.
- The exact list of files you changed.
