# Audionaut sample library as FLAC (`audpack/1`)

22 sample packs (2,438 sounds, 98.94 MB; the Real Kit is now the Analog Kit, pack `analogkit`) converted from the approved WAVs to lossless FLAC, plus the FLAC and Opus
decoder modules. Built and verified 7 Oct 2026. **Nothing here is inscribed or broadcast.**

- `REPORT.md`: sizes, per-pack table, verification (hashes, tags, determinism), encoder pin, open decisions.
- `packs/<id>.audpack`: pack container (12-byte header `AUDP`, gzip JSON index, FLAC payload). `*.manifest.json` has the
  container sha256 and chunk count; `*.pcmhashes.json` has the sha256 of each sound's original PCM.
- `codecs/`: `codec-flac.mjs` and `codec-opus.mjs` with extension manifests. Licence and author are still null pending the owner's decision.
- `tools/`: `audpack-reader.mjs`, `verify_packs.mjs` (`node tools/verify_packs.mjs packs codecs/codec-flac.mjs`), and the Python build scripts
  (`build_all.py` rebuilds packs from the downloaded listening-page data: set `AUDIONAUT_SCRATCH` to the folder holding `artifact-files/<artifact id>/`, `AUDIONAUT_OUT` for the output folder and optionally `AUDIONAUT_PACKS=analogkit` for a single pack; it also applies the Real Kit to Analog Kit rename, and rebuilding `analogkit` reproduces the committed pack byte for byte).

Licence tiers: 16 CC0 packs, 5 CC-BY packs (credit travels inside every file), and Classic Machines (licence **unverified**; see its pack notice).
The container layout is provisional until the first inscription. The full plan is `claude/audionaut-onchain-plan.md` in the Audional Sequencer project.

## Web samples (served until the packs are inscribed)

The Audionaut studio (`/audionaut/daw.html`) loads these packs as static files, so every sound is playable before anything is on chain.

- `node audionaut-library/tools/build-web-packs.mjs` copies `packs/*.audpack` to `public/audionaut/daw/media/packs/`, copies `codecs/codec-flac.mjs` to `public/audionaut/daw/js/codecs/`, and regenerates `public/audionaut/daw/js/pack-catalogue.js` (pack list, container sha256, one row per sound with its own licence and credit). Re-run it whenever a pack changes. The copies are byte-identical, so git stores each blob once.
- `public/audionaut/daw/js/pack-library.js` loads a sound: it checks the downloaded pack against the container sha256 in the catalogue, checks the sound's stored FLAC against the pack's index, decodes it with the bundled pure-JS FLAC decoder and checks the decoded PCM against `pcmSha256`. The browser's own FLAC decoder is used only if the bundled one cannot load, and the sound is then reported as unverified.
- The Library tab has one category per pack (`Packs · <name> (<count>) · <tier>`). The selected sound shows its root note, folder, licence and credit. CC-BY sounds say attribution is required; Classic Machines sounds say the licence is unverified.
- A channel loaded from a pack stores `{type: "pack", value: "<pack>/<assetId>", audioSha256: <pcmSha256>}`. Saved projects reload it and refuse it if the installed pack's hash differs.
- Tests: `src/audionaut/__tests__/pack-library.test.ts` (loads, verifies and decodes all 2,438 sounds in Node, plus tamper cases).
- When a pack is inscribed, only the fetch in `pack-library.js` changes (from `media/packs/<id>.audpack` to the inscription); the container hash, sound ids and project sources stay the same.
