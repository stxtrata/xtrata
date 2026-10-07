# Audionaut sample library as FLAC (`audpack/1`)

22 sample packs (2,438 sounds, 98.94 MB) converted from the approved WAVs to lossless FLAC, plus the FLAC and Opus
decoder modules. Built and verified 7 Oct 2026. **Nothing here is inscribed or broadcast.**

- `REPORT.md`: sizes, per-pack table, verification (hashes, tags, determinism), encoder pin, open decisions.
- `packs/<id>.audpack`: pack container (12-byte header `AUDP`, gzip JSON index, FLAC payload). `*.manifest.json` has the
  container sha256 and chunk count; `*.pcmhashes.json` has the sha256 of each sound's original PCM.
- `codecs/`: `codec-flac.mjs` and `codec-opus.mjs` with extension manifests. Licence and author are still null pending the owner's decision.
- `tools/`: `audpack-reader.mjs`, `verify_packs.mjs` (`node tools/verify_packs.mjs packs codecs/codec-flac.mjs`), and the Python build scripts
  (`build_all.py` has the build machine's scratch paths hard-coded and reads the listening-page artifacts, so it documents the process rather than running as is).

Licence tiers: 16 CC0 packs, 5 CC-BY packs (credit travels inside every file), and Classic Machines (licence **unverified**; see its pack notice).
The container layout is provisional until the first inscription. The full plan is `claude/audionaut-onchain-plan.md` in the Audional Sequencer project.
