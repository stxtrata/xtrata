# Ordinal Rush — ParallaX Casino machine (standalone build)

A Bitcoin-orange gold-rush cabinet where every symbol is a real inscription loaded from Bitcoin itself. It runs the shared
**Block Fortune v2 engine byte for byte** (94.38% design RTP) and is built here on its own; it is not in the casino yet
(see `INTEGRATION.md`).

Open `index.html` from a web server (for example `python3 -m http.server` in `public/`, then
`/casino-machines/ordinal-rush/`). It shows the cabinet in a small 3D studio with the real game running on its screen, a
test LAYR balance, Cabinet and Screen views, Full screen, and a hidden **Test** panel.

## Folder

| Path | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, deck buttons, clickable lever, Space to spin, ported panels, fullscreen hand-over, Test panel. |
| `pack.json` | The machine as one `PX_MACHINE_PACKS` entry (`name, description, color, accent, model, game, css`; model and game gzip+base64). |
| `pack.js` | The same pack as `window.OR_PACK`, so the test page also opens from disk. |
| `INTEGRATION.md` | The casino steps, written down and not carried out. |
| `src/game.js` | The theme layer: tiles, screen, bonus scenes, fullscreen bar, Holder Pot, cameos, panels, the room API. |
| `src/cabinet.js`, `src/model.json` | The cabinet, built with THREE and exported in the packed-model format. |
| `art/art.js` | The bundled art as data URIs (the Forever Twins `art.js` pattern): pixel art at its own grid, OnChainMonkey and Pizza Ninjas as SVG, the rest at or near native size. |
| `art/images/` | The same 82 images as files (PNG, WebP, SVG), one folder per collection, named by inscription number. |
| `art/sources.json` | Every image's inscription ID, number, content URL, list source and how it was reduced; Bitmap records; permissions. |
| `art/manifest.json` | Every inscription ID and number the machine knows; image collections top up live from it. |
| `vendor/` | Test-page libraries copied from the casino (THREE subset, SoftwareRenderer, XLOGO), the LAYR test stub, and the brand SVGs from the series bible. |
| `tools/build.mjs` | Builds `dist/ordinal-rush.html`, `pack.json`, `pack.js` and `vendor/`. Reads the casino for reference only and checks the engine's SHA-256. |
| `tools/build-cabinet.mjs` | Builds `src/model.json` from `src/cabinet.js` in headless Chromium (`--preview` writes photos to `dist/`). |
| `tools/exact-rtp.py` | Exact RTP from the strips: all 33,554,432 reel positions, features in closed form. Prints 94.380%. |
| `tools/rtp-sim.cjs` | Seeded 5,000,000-spin simulation of the engine inside `pack.json`, and a byte comparison with Forever Twins' engine. |
| `tools/check-sharp.cjs` | Fullscreen on a 2x display: the screen canvas matches the display's pixels and stays readable; saves reel crops and frames of Land Grab respins. |
| `tools/test-page.cjs` | End-to-end test of `index.html`: deck, lever, every bonus in four stages, Skip, reduced motion, fullscreen sessions at desktop and phone width. |

```bash
node public/casino-machines/ordinal-rush/tools/build-cabinet.mjs   # only after editing src/cabinet.js
node public/casino-machines/ordinal-rush/tools/build.mjs
python3 public/casino-machines/ordinal-rush/tools/exact-rtp.py
node public/casino-machines/ordinal-rush/tools/rtp-sim.cjs 5000000
node public/casino-machines/ordinal-rush/tools/test-page.cjs http://localhost:8000/casino-machines/ordinal-rush/index.html
node public/casino-machines/ordinal-rush/tools/check-sharp.cjs http://localhost:8000/casino-machines/ordinal-rush/index.html
```

## Reels

| Slot | Symbol | Art |
| --- | --- | --- |
| `cherry` | Bitcoin Frogs | 576 px image inscriptions that are 8x copies of a 72 x 72 grid; stored at the grid, lossless |
| `lemon` | Pizza Ninjas | recursive HTML inscriptions that paint SVG trait layers; stored as one SVG with the same layers |
| `chip` | OnChainMonkey | recursive HTML inscriptions; the SVG they draw, stored as drawn |
| `block` | Ordinal Maxi Biz | 336 px JPEG inscriptions (full size bundled; the original loads live) |
| `artifact` | Quantum Cats | recursive HTML inscriptions; stills from their own 600 px canvas at 512 px |
| `bitcoin` | NodeMonkes (jackpot symbol, gold frame) | 28 × 28 PNG inscriptions, original bytes |
| `wild` | Bitcoin Puppets (orange frame) | 256 px image inscriptions, original bytes |
| `scatter` | Runestone | every Runestone delegates to one 3D model; a 768 px still from the ordinals.com preview, each tile with its own number |
| `vault` | Taproot Wizards | 800 px image inscriptions (512 px bundled; the original loads live) |
| `chain` | Bitmap | real `.bitmap` text inscriptions; tile = block number over a district grid |

Each tile shows the inscription number. Art is picked with `Math.random` after the engine has fixed the result.

### Sharp at any size

Tiles are never pre-rendered: each one is drawn straight onto the screen at the size it is shown, and in fullscreen the
screen canvas is resized to the display's real pixels (it stays 2800 x 1920 as the cabinet texture). Pixel art is drawn only
by whole-number nearest-neighbour scaling, so every source pixel is an exact square; upscaled pixel art loaded live (a
576 px Frog) is detected and reduced to its grid first. SVG art is drawn at the size shown. Other images are scaled pixel for
pixel when shown larger than native, as ordinals.com shows them, and with high-quality smoothing when smaller.

## Bonuses (four stages each: trigger, intro, play, summary)

* **The Airdrop** (3+ Runestones): 8 free spins at 2×, retrigger +4 up to 24. Runestones rain, the reels re-skin to a
  night sky, a ribbon counts spins left and the running total; spins run on their own.
* **Wizard Vault** (3+ Taproot Wizards): nine sealed sats; each opened seal cracks, a Wizard rises and the sat's rarity
  and prize count up (Common 1× … Legendary 15×).
* **Bitmap Land Grab** (5+ Bitmaps): every respin rolls: the empty parcels spin through block numbers, a scan sweeps the
  map and the spent lamp drains, then new parcels stamp down one by one (lamps refill) or the empties flash and a banner
  says NO NEW PARCELS.
* **Inscription #0 Jackpot** (5 NodeMonkes on the centre row, or all 15 parcels): rays, chasing bulbs, music, Inscription
  #0 itself and the meter counting up. The intro button is REVEAL (the prize is the LAYR meter, not the inscription).
* **Odd Sat / Even Sat** (after a paid base win): a sat coin, then the sat number's digits roll and lock; call the last digit.

Skip (or S) jumps to the summary with the same total; Turbo shortens every scene; Reduced motion swaps movement for fades.

## Fullscreen

Full screen (or F) gives the screen the whole view with a bar along the bottom: INSCRIBE (the waiting bonus action when
one is due), SKIP, ODD SAT / EVEN SAT / KEEP or ODD/EVEN? when a gamble is offered, −SATS, the bet, +SATS, MAX SATS,
AUTO-MINE, RARITY (pays), FAIR PLAY, TURBO, SOUND and volume, HISTORY, the balance, TEST (test build only) and EXIT.
Every panel opens inside fullscreen. Touch targets are at least 44 px; on a phone the bar is a main row plus a scrolling
row, with safe-area insets.

## Holder layer (version 1: meters only)

Holder Pot = 1% of every paid bet, weekly (UTC), stored with the jackpot meters and shown on the screen header with the
share per linked inscription (unknown until holders can link; never a guess). Cameos record
`{tokenId, number, collection, lineWin}` per winning line. `HolderRewards` in `src/game.js` holds the named stubs
(address linking by signed message, linked-inscription count, snapshot, claim, holder spins, Forever Fund), each with a
`TODO(holder-layer-v2)`.
