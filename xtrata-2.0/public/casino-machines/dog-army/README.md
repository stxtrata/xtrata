# DOG Army — ParallaX Casino machine 24

A standalone build of **DOG Army**, a military-parade machine on the DOG rune (Runes #3, 840,000:3). It runs the Block Fortune v2 engine unchanged (94.38% design return) and is packaged as one `PX_MACHINE_PACKS` entry, ready to drop into the casino later. The casino itself is untouched; see `INTEGRATION.md`.

It is a re-theme of the finished machine 16 build: the same engine, Lab, fullscreen, holder layer, test page and checks, with a new theme, art, scenes, sounds and copy. No maths changed.

## Open it

```sh
cd dog-army
python3 -m http.server 8765      # or any static server
# then open http://localhost:8765/index.html   (add ?lite=1 on slow devices)
```

`index.html` is the standalone test page: the cabinet in a small 3D studio (drag to orbit, Cabinet and Screen views), a clickable lever and deck, the HUD, Fullscreen, the **Bonus Lab**, the **Test panel** and a clearly marked **test stub** of `ParallaxLAYRAccount` (100,000 play balance, reset). The game alone is `dist/game.html` (add `?lab=1` for Lab and Test).

Keys: Space marches (and presses whatever a bonus is waiting for), F fullscreen, Esc leaves it, L Bonus Lab, S skips a bonus to its summary, 1-9 flip dog tags, T turbo, M mute.

## The machine

| Slot | Player-facing symbol | Art |
| --- | --- | --- |
| `cherry` | Block 840,000 (the halving block) | Data tile drawn in code (number, hash and time from `art/dog/data.json` when present) |
| `lemon` | Rune #3 (DOG•GO•TO•THE•MOON) | Data tile drawn in code |
| `chip` | 889,806 DOG per Runestone | Data tile drawn in code |
| `block` | DOG on Stacks | ALEX `runes-dog` token image if bundled, else a type tile |
| `artifact` | Runestone | Real inscription thumbnails with their numbers, chosen with `Math.random` after the result is fixed (never the engine rng) |
| `bitcoin` | $DOG (jackpot symbol) | The official logo on a full moon if `art/dog/img/dog-logo-*.png` is bundled; otherwise "$DOG" in plain type and a "logo pending" note in the Orders panel. The logo and the mascot are never drawn by hand |
| `wild` | Leonidas | Leonidas's own PFP (supplied by Jim, `art/supplied/leonidas-pfp.jpg`) in a red-hot ring. Needs his OK before public use. If the file is missing, a name card with a Spartan crest is drawn instead |
| `scatter` | Snapshot (parachute crate) | Drawn in code. A number appears only if `data.json` marks the snapshot block `verified`; otherwise it says SNAPSHOT / BLOCK TO CONFIRM |
| `vault` | Dog tag | A real milestone (label and value) stamped on a tag |
| `chain` | March | A real DOG transfer (amount and block) |

Everything that is not verified is labelled on its tile and in the Orders panel (the records table) and Fair Play. A missing file always falls back to a labelled type tile; the page never crashes and works offline.

Bonuses, each with trigger, intro, play and summary, Skip, turbo and a reduced-motion version, usable in the cabinet, screen and fullscreen at desktop and phone width (buttons sit inside the reel window):

- **The Airdrop** (free spins): parachute crates drift down a night parade ground and burst into DOG; wins pay 2x; spins left and running total shown.
- **Dog Tags** (pick): nine tags on a barracks board, flip three; each shows a real milestone and a prize of 1, 2, 2, 3, 4, 5, 8, 10 or 15x.
- **March of the Army** (hold and respin): each lock adds a rank and a real DOG transfer marches across; the respins counter visibly resets to 3; all 15 also win the jackpot.
- **To the Moon** (jackpot, five $DOG on the centre row): the army looks up as the moon fills the screen, the meter counts up, a procedural howl.
- **Moon or Doom** (gamble, even 50/50): a moon coin lands full moon or eclipse.

Sounds are procedural WebAudio only: a marching snare as the base rhythm, a bugle on bonuses, a formant-like howl on the jackpot.

## The Holder layer (version 1)

The **DOG Army Holder Pot** takes 1% of every paid bet (weekly), is stored next to the jackpot meters, never reduces a win and shows on the screen. Bridged DOG holders are read from the Stacks wallet (`runes-dog` or the Pontis token); native-Bitcoin holders link by signing a message; one share per wallet above a minimum **Jim sets**: `HOLDER_CONFIG.MIN_DOG_PER_WALLET` in `src/game.c.js` is `null` (`TODO(Jim sets this)`), so the screen says "SHARE PER WALLET: TBC (MINIMUM NOT SET)" and invents no number. Wallet reads, message signing, payouts, holder spins and the royalty are named stubs with TODO lines (`HolderService`).

Cameo: a Runestone on a winning line puts its inscription number in the win message and records `{tokenId: inscriptionId, collection: 'runestone', lineWin}` in the spin history.

## Deliberate deviation from the Forever Twins test panel

The Test panel's "twins state" switch (NOT YET FOREVER look) is replaced by a **holder state** switch (live stub / none / some / all). There is no NOT YET FOREVER look because Runestones are Ordinals and always shown in full colour. The switch drives the Holder Pot readout, the holder-wallet states and whether cameo records are kept, and never changes a result. The balance reset and the in-page RTP run are kept.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Standalone test page (studio, HUD, ported dialogs, LAYR test stub, tag-row light show) |
| `pack.json`, `pack.js` | The machine as one `PX_MACHINE_PACKS` entry (`name, description, color, accent, model, game, css`) / the same as a script |
| `dist/game.html` | The game page inside the pack, uncompressed |
| `src/engine.js` | Block Fortune v2 engine, byte-for-byte from Forever Twins (`src/engine.sha256`) |
| `src/game.a.js` .. `game.e.js`, `game.scenes.js`, `game.css`, `game-body.html` | The DOG Army game: a audio and constants, b art and tiles, c screen and holder layer, scenes (parade ground, tag board, march, moon), d spin and bonus flow, e panels, Lab, fullscreen, API |
| `src/layr.js`, `compat.js`, `xlogo.js`, `software.js`, `canvasengine.js` | Copied unchanged |
| `src/cabinet.js`, `tools/build-cabinet.py`, `build/` | The cabinet (CABINET stream) |
| `art/dog/` | The on-chain data and images (ART stream); `art/sources.json` lists every source |
| `tools/build-pack.mjs` | Bundles `art/dog` into `window.DOGARMY_ART`, builds `dist/game.html`, `pack.json`, `pack.js`; adds `gameBundle` to `art/sources.json` without touching the ART stream's entries |
| `tools/rtp.mjs`, `tools/check-engine.mjs` | Return check and engine-identity / pack check |
| `checks/` | Scripts, results (`results/`, `*.json`), screenshots (`screens/`), `CHECKS.md`, and `fixture/` (see below) |

## Rebuild and check

```sh
node tools/build-pack.mjs            # dist/game.html, pack.json, pack.js
node tools/rtp.mjs 5000000 20261102  # expect 94.38% +/- 0.3
node tools/check-engine.mjs
python3 checks/views.py && python3 checks/behaviour.py && python3 checks/lab_runall.py && python3 checks/fullscreen_session.py
```

`checks/fixture/` holds **clearly fake** test data and placeholder images used only to exercise the data-rich paths (Runestone cameos, march transfers, dog-tag milestones, logo on the moon) while real data is missing. `FIXTURE=1 node tools/build-pack.mjs` builds only `dist-fixture/game.html` from it; it is never packed or shipped.

## Added after the first delivery
- `art/supplied/leonidas-pfp.jpg`: Leonidas's PFP (from a screenshot Jim supplied), the wild's face. Needs Leonidas's OK before a public build.
- `art/audio/`: 16 real CC0 drum and trumpet recordings (VSCO 2 CE) with `sources.json`; the game plays them instead of the code-made sounds.
- Deck buttons sink and rebound on a spring; the lever follows a hand-pulled curve (`index.html`; `mechanics().buttons` for a host).
- March of the Army: empty ranks spin during every respin, stop in a staggered bounce, locks shake the board and burst sparks, a running WIN counter, a red LAST RESPIN tension phase, and a full parade fires Leonidas's red eye beams.
