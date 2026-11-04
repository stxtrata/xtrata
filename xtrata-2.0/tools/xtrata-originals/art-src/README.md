# Art capture for Xtrata Originals

These scripts made the captures in `raw/`, which is not committed. `build_art.py` turns them into `../art/xo-art.json` and `../art/images/`. Run each one from this folder. They need network access to xtrata.xyz and Playwright.

1. `python3 fetch_auds.py`: reads every `collection-minted` event on the Audionauts collection contract, giving `raw/aud-mints.json`.
2. `python3 fetch_eds.py`: reads each minted token's HTML from `/i/<id>` for its edition and seed (`raw/aud-editions.json`), and saves master player #3060.
3. `node render_auds.cjs`: draws each Audionaut's portrait with master #3060, with no user gesture, so no audio ever starts and the star song is never touched. Writes `raw/aud/NNN.png` and `raw/aud-names.json`.
4. `node astro2.cjs`: Astro Blaster 3 (#3074). Saves its title screen and eight attract-mode frames of its canvas.
5. `python3 layers.py`, then `python3 fetch_layer_imgs.py`: the inscriptions held by xtrata.btc and jim.btc, and thumbnails of the image ones.
6. Cicadas: copy `cicada-harness.html` into the Cicada.btc master engine folder (`cicada-v3/Cicada-v3/cicada-btc-master-engine-v11.3.6/` as `harness.html`) and serve that folder on port 8092. Then run `node cic_meta.cjs` (all 3,301 seeds' tier and rank), then `OV='{"xOffset":0,"yOffset":0}' node render_cicadas.cjs <seeds>` (stills plus the signature-call PCM).
7. `node extract-analogkit.mjs <sound ids…>`: run it from `audionaut-library/`. It pulls the CC0 Analog Kit hits for Session Mode out of `packs/analogkit.audpack`; copy the `.flac` files to `raw/kit/`.
8. `python3 build_art.py`: bundles everything (WebP tiles, MP3 calls and kit hits, the call envelopes, the layer records).
