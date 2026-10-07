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
