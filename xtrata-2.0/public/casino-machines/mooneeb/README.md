# Mooneeb — ParallaX Casino machine 16

A standalone build of **Mooneeb**, the word-ladder machine: **M → MOO → MOON → MOONEY → MOONEEB**. It runs the Block Fortune v2 engine unchanged (94.38% design return) and is packaged as one `PX_MACHINE_PACKS` entry, ready to drop into the casino later. The casino itself is untouched; see `INTEGRATION.md`.

## Open it

Serve this folder and open `index.html` (the standalone test page):

```sh
cd public/casino-machines/mooneeb
python3 -m http.server 8765      # or any static server
# then open http://localhost:8765/index.html   (add ?lite=1 on slow devices)
```

`index.html` also opens straight from disk in Chrome. It shows the cabinet in a small 3D studio (drag to orbit, Cabinet and Screen views), with a clickable lever and deck, the HUD, Fullscreen, the **Bonus Lab**, the **Test panel**, and a clearly marked **test stub** of `ParallaxLAYRAccount` with a 100,000 play balance and a reset.

Keys: Space spins (and presses whatever a bonus is waiting for), F fullscreen, Esc leaves it, L Bonus Lab, S skips a bonus to its summary, 1–9 open Mooney bags, [ ] bet, T turbo, M mute.

## The machine

| Slot | Mooneeb symbol | Art |
| --- | --- | --- |
| `cherry` | M | Jim's pop-art M (`art/ladder/pop/m.jpg`) |
| `lemon` | Moo, the cow | Jim's pop-art cow face |
| `chip` | Moon | Jim's pop-art full moon |
| `block` | Mooney: the cow jumping over the moon | Jim's pop-art leaping cow, after the traditional rhyme |
| `artifact` | Leopold ($LEO) | Official token image (type tile until the file is added) |
| `bitcoin` | Mooneeb (jackpot) | Jim's pop-art portrait of Muneeb (`art/muneeb/portrait-hd.jpg`, 2× from the original grid), shown at Jim's request; the crowned MOONEEB name card returns if `approval.json` is set back to false |
| `wild` | STX | Official Stacks logo (type tile until the file is added) |
| `scatter` | Moonshot rocket | Jim's pop-art rocket |
| `vault` | Mooney bag | Original SVG until a pop-art bag is supplied |
| `chain` | Letter tile M·O·O·N·E·E·B | Drawn in code to match the pop-art M |

Also from Jim's grids: the MOO! burst (big wins, Moo gamble wins), the astronaut (Moonshot intro), the herd (jackpot backdrop), the crescent moon and a map of **Mooney Mooney, NSW** (the Mooney Bags field). `tools/prepare-supplied.py` crops and sizes them from `art/supplied/`.

The moo is kept for cows: it sounds only when a winning line is made of Moo (the cow) or Mooney (the cow jumping over the moon), never for other wins or bonuses.

Bonuses, each with trigger → intro → play → summary, Skip and a reduced-motion version: **Moonshot** (free spins in a starfield, the cow floats by in a space helmet, a real LEO Cats twin drifts through each spin), **Mooney Bags** (nine bags on a moonlit field), **Spell It** (hold and respin that spells MOONEEB twice and ends on the Stacks wild), **Full Mooneeb** (the ladder lights rung by rung with a rising brass crescendo), and the **Moo or Moon** coin gamble. The LEO Cats Holder Pot (1% of paid bets, weekly) shows on the screen; cameo records are written to History.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Standalone test page (studio, HUD, ported dialogs, LAYR test stub) |
| `pack.json` | The machine as one `PX_MACHINE_PACKS` entry (`name, description, color, accent, model, game, css`) |
| `pack.js` | Same pack as a script, so the test page works from `file://` |
| `dist/game.html` | The game page inside the pack, uncompressed, for reading |
| `src/engine.js` | Block Fortune v2 engine, byte-for-byte from Forever Twins (`src/engine.sha256`) |
| `src/game.*.js`, `src/game.css`, `src/game-body.html` | The Mooneeb game (scenes, Lab, fullscreen, holder layer, API) |
| `src/layr.js`, `src/compat.js`, `src/xlogo.js`, `src/software.js` | Copied unchanged from the Forever Twins pack |
| `src/cabinet.js` | The cabinet, built with THREE r128 and exported to the packed model format |
| `art/` | Ladder SVGs, LEO Cats twins, brand SVGs, `sources.json` |
| `vendor/three.r128.min.js` | The room's own THREE build, for the test page |
| `tools/` | `prepare-supplied.py`, `build-cabinet.py`, `build-pack.mjs`, `rtp.mjs`, `check-engine.mjs`, `fetch-twins.mjs`, `fetch-logos.mjs` |
| `checks/` | Check scripts, results (`*.json`) and screenshots (`screens/`) |
| `INTEGRATION.md` | Exact steps to add it to the casino later |

## Rebuild

```sh
python3 -m http.server 8765 &          # the cabinet builder runs in headless Chrome
python3 tools/prepare-supplied.py       # → art/ladder/pop/*.jpg from the supplied grids
python3 tools/build-cabinet.py         # → build/model.json + preview renders
node tools/build-pack.mjs              # → dist/game.html, pack.json, pack.js, art/sources.json
node tools/rtp.mjs 5000000             # seeded 5M-spin return check
node tools/check-engine.mjs            # engine identical to Forever Twins; pack.json valid
```

`build-pack.mjs` refuses to build if `src/engine.js` differs from the Forever Twins engine, and checks that every text hook the room patches appears exactly once.
