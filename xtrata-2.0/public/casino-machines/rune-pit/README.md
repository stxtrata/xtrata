# Rune Pit — ParallaX Casino machine (standalone build)

A volcanic forge cabinet where every symbol is a real Bitcoin Rune, drawn from its own data (rune number, spaced name,
symbol, etching block and transaction). It runs the shared **Block Fortune v2 engine byte for byte** (94.38% design RTP)
and is built here on its own; it is not in the casino yet (see `INTEGRATION.md`).

Open `index.html` from a web server (for example `cd /home/claude && python3 -m http.server 8102`, then
`http://localhost:8102/rune-pit/index.html`). It shows the cabinet in a small 3D studio with the real game running on its
screen, a test LAYR balance, Cabinet and Screen views, Full screen, a **Test** panel and the **Bonus Lab**. The forge
hammer on the right of the cabinet is the lever; it strikes an anvil and throws sparks.

## Folder

| Path | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio, deck buttons, clickable hammer with sparks at `px-sparkAnchor`, Space to spin, ported panels, fullscreen hand-over, Test panel, Bonus Lab button. |
| `pack.json` | The machine as one `PX_MACHINE_PACKS` entry (`name, description, color, accent, model, game, css`; model and game gzip+base64). |
| `pack.js` | The same pack as `window.RP_PACK`, so the test page also opens from disk. |
| `INTEGRATION.md` | The casino steps, written down and not carried out. |
| `src/game.js` | The theme layer: rune tiles, screen, the four-stage bonus scenes, fullscreen bar, Bonus Lab, Holder Pot, panels, the room API. |
| `src/cabinet.js`, `src/model.json`, `NOTES-cabinet.md` | The cabinet (made by the cabinet build, `tools/build-cabinet.mjs`; not edited by the game build). |
| `art/art.js` | `window.RP_ART`: the Runestone still (a real Runestone preview) and, only if a file was supplied, the DOG logo. |
| `art/manifest.json` | Rune data for every tile: number, name, symbol, supply, premine-only flag, mint terms, etching block, full txid, and whether the number was confirmed. |
| `art/sources.json` | Where every datum came from, the unverified numbers, the gaps, the DOG logo status, `logosNeedingPermission` and `logosMissing`. |
| `art/runes-source.json`, `art/runestone-source.json` | The collected inputs `tools/build-art.mjs` turns into the three files above. |
| `vendor/` | Test-page libraries copied from the casino (THREE subset, SoftwareRenderer, XLOGO), the LAYR test stub, and the brand SVGs. |
| `tools/build-art.mjs` | Builds `art/art.js`, `art/manifest.json`, `art/sources.json`. |
| `tools/build.mjs` | Builds `dist/rune-pit.html`, `pack.json`, `pack.js` and `vendor/`. Checks the engine's SHA-256; reads the casino for reference only (`PX_CASINO_HTML=…`). |
| `tools/exact-rtp.py` | Exact RTP from the strips (all 33,554,432 reel positions, features in closed form). Prints 94.380%. |
| `tools/rtp-sim.cjs` | Seeded 5,000,000-spin simulation of the engine inside `pack.json`, and a byte comparison with Forever Twins' engine. |
| `tools/test-page.cjs` | End-to-end test of `index.html` (needs Playwright): deck, hammer and sparks, every bonus and every Lab item in four stages (screenshots in `dist/test/`), Skip, reduced motion, fullscreen sessions at desktop and phone width. |

```bash
node tools/build-art.mjs        # only after changing art/runes-source.json or the DOG logo file
node tools/build-cabinet.mjs    # the cabinet agent's script; only after editing src/cabinet.js
PX_CASINO_HTML=/mnt/user-data/uploads/xtrata/xtrata-2.0/public/casino/index.html node tools/build.mjs
python3 tools/exact-rtp.py
PX_CASINO_HTML=… node tools/rtp-sim.cjs 5000000
node tools/test-page.cjs http://localhost:8102/rune-pit/index.html
```

The test launches headless Chromium with `--disable-accelerated-2d-canvas`: without it, software-GL accelerated 2D canvas
stalls on the full-screen glow scenes (a test-environment limit, not a game fault). `ONLY=basic,bonus,skip,reduced,panels,lab,fs,phone`
selects sections; `LAB_ITEMS=a,b` limits the Lab items and `LAB_ALL=1` adds Replay and Run all.

## The reels

| Slot | Symbol | Tile |
| --- | --- | --- |
| `cherry`, `lemon`, `chip`, `block`, `artifact` | Runes (Z•Z•Z•Z•Z•FEHU•Z•Z•Z•Z•Z, DECENTRALIZED, MEME•ECONOMICS, RSIC•GENESIS•RUNE, SATOSHI•NAKAMOTO, with their real symbols) | carved stone: large symbol, spaced name beneath, rune number in the corner. Rune tiles pay no cameo. |
| `bitcoin` | DOG•GO•TO•THE•MOON (jackpot symbol, gold frame) | typeset gold tile; the official logo only if a file is bundled (it is not) |
| `wild` | UNCOMMON•GOODS (#0) | typeset name tile (its symbol is not verified) |
| `scatter` | Etching | the etching of an early rune: name, block, first 8 characters of the real txid, or UNVERIFIED |
| `vault` | Runestone | the bundled Runestone still plus the inscription number; Runestone tiles carry the cameo |
| `chain` | Rune number | `#n` of the first runes |

Art is chosen with `Math.random` after the engine has fixed the result.

## Bonuses (four stages each: trigger, intro, play, summary)

* **Etching Season** (3+ Etchings): 8 free spins at 2×, retrigger +4 up to 24. Molten letters carve a real rune name
  into the pit wall for each spin; spins run on their own.
* **The Airdrop** (3+ Runestones): nine crates, open three; each reveals a real rune and a prize (1× to 15× the bet).
* **First Hundred** (5+ Rune numbers): a stone tablet; each lock carves a real early rune with its number, symbol, name
  and value; three respin lamps refill on every new lock.
* **To the Moon jackpot** (5 DOG•GO•TO•THE•MOON on the centre row, or all 15 cells): a dog rocket, the biggest
  celebration, music and the meter counting up.
* **Etch or Burn** (after a paid base win): a plate, three hammer strikes, then the verdict. ETCH is a call on the
  engine's even draw, BURN on the odd draw; the call is matched against the plate's fate, so the engine's own 50/50
  decides. A win doubles the staked win, a loss burns it.

Skip (or S) jumps to the summary with the same total; Turbo shortens every scene; Reduced motion swaps movement for fades.

## Bonus Lab

Pick any bonus or special event, a bet and press Run: it plays at once through all four stages on a separate lab balance.
Items: Etching Season, Etching Season with a retrigger, The Airdrop, First Hundred, First Hundred full tablet, To the Moon
(centre row), Etch or Burn win, Etch or Burn loss, Scatter 3, 4 and 5. Seeded (a seed repeats the run exactly) or Random,
Hands-free (the Lab presses the buttons), Run, Replay last, Run all, Reset lab balance, Leave the Lab. A run is a real engine
round (the engine's own `start` with scripted reel stops); the engine is neither edited nor bypassed. It never touches the
LAYR balance, the jackpot meters, the Holder Pot or the RTP figures, and its rounds are marked LAB in the chronicle. On the
test page it is always on; in the casino only with `?lab=1` and `LAYR.onChainConnected === false` (see `INTEGRATION.md`).
Key: L.

## Fullscreen

Full screen (or F) gives the screen the whole view with a bar along the bottom: ETCH (the waiting bonus action when one is
due), SKIP, ETCH / BURN / KEEP or ETCH/BURN? when a gamble is offered, COLLECT, −SATS, the bet, +SATS, MAX SATS, AUTO-MINT,
LEDGER (pays), FAIR PLAY, TURBO, SOUND and volume, CHRONICLE, the balance, LAB and TEST (where allowed) and EXIT. Every panel
opens inside fullscreen. Touch targets are at least 44 px; on a phone the bar is a main row plus a scrolling row.

## Holder layer (version 1: meters only)

Holder Pot = 1% of every paid bet, weekly (UTC), stored with the jackpot meters and shown on the screen header with the
share per linked wallet (unknown until holders can link; never a guess). **Runestone cameos:** a Runestone (the `vault`
symbol) never sits on a payline, so the cameo is recorded when The Airdrop is collected: one record
`{tokenId, number, collection, lineWin}` per Runestone that paid in the feature. Rune tiles pay no cameo. `HolderRewards` in
`src/game.js` holds the named stubs (`linkBitcoinAddress`, `countLinkedWallets`, `snapshotPot`, `payCameo`, `claim`), each with
`TODO(holder-layer-v2)`. The test panel's linked-wallets switch (none, some, all) drives the count shown.

## Data and what is unverified

All rune data is in `art/manifest.json`; the reasons and gaps are in `art/sources.json`. Short version:

* Rune numbers are **confirmed on ordiscan only for #1-#10, #12, #13, #15, #17, #19, #20, #23, #32**. Every other number is
  derived or inferred and the game shows it as `#n?`.
* **UNCOMMON•GOODS (#0)**: symbol, supply, etching block and etching transaction are unverified (it has no etching
  transaction). It is a typeset name tile and is excluded from the Etching pool.
* **#45 to #99 were not collected**, so the Rune Number tiles and the First Hundred tablet draw from #0-#44.
* **SATOSHI•NAKAMOTO**: 168,000 is the mint cap; the game never says "fully minted" or states 168,000 as the supply.
* Entries whose supply is premine-only are never shown with that figure as total supply.
* **DOG logo**: an official logo file was found (doggotothemoon.io) but is **not bundled**; the DOG tile is typeset. Listed under
  `logosNeedingPermission` and `logosMissing`. Drop a licensed file at `art/images/dog/dog-logo.png` and run
  `node tools/build-art.mjs` to use it.
* BITCOIN•WIF•HAT was etched twice in block 840000; the second, presumed invalid, was skipped (not confirmed on a page).
