# Monkey Hash: putting it into the ParallaX Casino later

**Nothing in this file has been done.** No casino file was edited. These are the steps, in order, for whoever adds the machine by hand. Names below are the ones used in `public/casino/index.html` when the sibling machines were built; the live file has changed since, so search for the quoted names rather than trusting any position.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | Standalone test page: 3D studio (cabinet / screen / orbit views, clickable lever and deck buttons, Space to spin), the real packed cabinet and game, a stub LAYR account with a play balance and Reset, and a Test panel (key **T**, or `?test`): twins none / some / all, reset balance, RTP simulation, and the Bonus Lab (key **L**). Serve `public/` and open `/casino-machines/monkey-hash/`. It needs a web server (it fetches `pack.json`). |
| `pack.json` | One `PX_MACHINE_PACKS` entry: `{name, description, color, accent, model, game, css}`. `model` and `game` are gzip + base64. `css` equals the game's head `<style>`. |
| `art/sources.json` | Where every image came from, and the logos that still need permission. |
| `art/monkey-hash-art.json` | The bundled art (webp data URIs), the rarity tier of every token id, and tier counts. |
| `art/image-log.json` | Every picture fetched by `fetch_art.py`, with its URL, plus the token ids that wear the gold frame. |
| `vendor/three.js` | The same three.js build the casino room uses (r128), for the test page only. |
| `INTEGRATION.md` | This file. |

Build sources are in `tools/monkey-hash/` (parts of the game script, the page, the cabinet model builder, `fetch_art.py`, `build.py`, `verify.py`, `rtp-sim.mjs`). The Block Fortune v2 engine (`const BF`, STATE_VERSION 2, 94.38% RTP) and the LAYR adapter inside the game are copied byte for byte from Forever Twins; `tools/monkey-hash/verify.py` checks that.

## 0. The Bonus Lab

A menu of every bonus round and special event, run on a **separate LAB balance** through the full presentation (trigger, intro, play, summary, outro). Items: Jungle Drums, Drums retrigger, Monkey Store, Forever Vines, Vines full grid (wins the Block Reward), Block Reward (centre row), Gamble win, Gamble loss, Scatters ×3 / ×4 / ×5, Idol Monkey wild, Twin cameo (twins: all), NOT YET FOREVER (twins: none), Holder Pot new week. Choose an item, a bet level, **Seeded** (with a seed field, so a run can be repeated) or **Random**, then Run. **Replay last** repeats the last run with the same seed. **Run all** plays every item in turn with the flow driven automatically.

How it forces a round: the lab passes a scripted rng into the engine's own `start(state, rng)` that picks reel stops landing the wanted symbols (and, for the full-grid run, the locks). The engine is never edited, copied or bypassed.

It uses a fresh practice state (100,000 LAB LAYR, its own jackpot meters and Holder Pot) on the raw engine. While it is on nothing touches the real LAYR account, the saved game, the jackpot meters, the Holder Pot or the RTP statistics; rounds are marked **LAB** in History; a yellow ribbon, "BONUS LAB · PRACTICE LAYR", stays on the screen.

- **Standalone test page:** always available (Lab button on the deck and the header, key **L**).
- **In the casino:** only with `?lab=1` in the page URL on a non-mainnet network (the game reads `window.parent.location`). Players in production never see it.
- Leave it with "Leave the lab" in the menu or Settings, or by walking away: the machine leaves the lab by itself when the room deactivates it. The real game is restored exactly as it was.
- Caveat: the room shows `ui().balance`, so the room's balance display shows the lab balance while the lab is on.
- `?prod` on the test page removes the test hooks (`engine.test`), so you can try the Lab exactly as the casino will present it (add `lab=1` too).

## 1. Add the pack

In `public/casino/index.html`, find the script that starts `window.PX_MACHINE_PACKS=[`. Append the object in `pack.json` as the **next entry after the last existing machine**. The order of this array is the machine type index everywhere below.

```sh
node -e "const p=require('fs').readFileSync('public/casino-machines/monkey-hash/pack.json','utf8');console.log(','+p)"
# paste the output just before the closing ] of the PX_MACHINE_PACKS array
```

Do not edit the game inside the pack. It runs with the room's interfaces unchanged: `window.ParallaxLAYRAccount` (taken from `window.parent`) and `window.PX_CASINO_ENGINE` (screen canvas, `activate`, `deactivate`, `action`, `tap`, `key`, `click`, `input`, `ui`, `mechanics`, `revision`, `refreshAccount`, `closeModal`, `stopAuto`, plus `fullscreen`).

## 2. The room's machine lists

1. **Presence list.** `const MACH = [...]` → add `'mh'`; in the name map beside it add `mh: 'Monkey Hash'`. The order must match `PX_MACHINE_PACKS`.
2. **Floor positions: open question.** `buildSlots` places one machine per type at fixed z positions on both side walls. Check there is a free position for one more machine, or decide which wall space it takes.
3. **Floor glow.** In `buildSlots` the glow colour list is indexed by machine type → append `0xd9a300` (Monkey Hash's accent, `#d9a300`).
4. **Machines panel copy.** Add after the last machine's button:
   ```html
   <button class="machine-choice" data-machine-type="N" style="--machine-color:#1d2b22;--machine-accent:#d9a300"><b>Monkey Hash</b><small>Bitcoin Monkeys · BANANA · Serums</small><em>PLAY THE MACHINE ↗</em></button>
   ```
   (`N` is the index from step 1.)
5. The room's name plaque and cabinet scaling are automatic. The cabinet's named parts are `screenMesh`, `core` (topper stone wheel), `waterfall` (two meshes), `firefly` (animated lights, optional), `lever`, `spinPhysical`, and deck buttons with actions `spin`, `betUp`, `betDown`, `auto`, `pays`. The room only needs `screenMesh`, `lever`, `spinPhysical` and the actions; unknown roles are ignored.

## 3. Fullscreen hand-over (`pxMachineFullscreen`)

Fullscreen belongs to the game: its screen fills the view and every control except the lever is on a bottom bar (SWING, −BANANAS / +BANANAS, Max Bet, AUTO-SWING, Turbo, MAP, Fair, Monkeys, Pot, Log, LAYR account, Settings, Sound, Left Vine / Right Vine, Collect, Exit), each deck label with its plain action beneath, touch targets at least 44 px, safe-area padding for phones. Menus and bonus controls work inside it.

The room's button currently toggles `document.documentElement` fullscreen. For Monkey Hash, hand over to the game:

```js
$('pxMachineFullscreen').onclick=()=>{
  const fs=activeMachineEngine&&activeMachineEngine.fullscreen;           // the loaded machine's window.PX_CASINO_ENGINE
  if(fs){fs.toggle();return;}                                             // Monkey Hash (and any pack that offers it)
  /* existing behaviour for the other machines */
};
```

`activeMachineEngine` is whichever `PX_CASINO_ENGINE` the room keeps for the seated machine. The `F` key clicks this button, so it hands over too. Inside the pack:

- The game restyles its own `window.frameElement` (the hidden `.pxLogicFrame` iframe) with inline `!important` styles (fixed, full viewport, high z-index), then calls the Fullscreen API on it. Where the API is missing (iPhone Safari) it stays as a fixed full-viewport layer.
- `Esc` (browser) or its own Exit button leaves; the frame's original style is restored. `engine.deactivate()` exits fullscreen first, so walking away from the machine cannot leave a stuck layer.
- Panels inside fullscreen are the game's own native dialogs. The room's HTML port of the dialog (`ui().modal`) fills underneath; harmless, but the room can skip it while `fullscreen.active()` is true.
- `fullscreen.addBarButton(label, small, fn)` lets the room add a button to the bar.

## 4. Things the room already does that Monkey Hash relies on

- `pxLiteDocument` patches the game text and looks for the exact string `screen=canvas(2800,1920)`. It is present, once, in the game.
- The round-log hook matches the game's `GAME_ID` by id; `monkey-hash` is not a known id until that table is extended. Nothing breaks.
- The game uses plain `requestAnimationFrame`, idles at about 30 fps, and draws its 2800×1920 screen only when something changed or is animating. A WebGL-less browser still plays: the game logic runs in its own frame, and the test page shows a plain message if three.js cannot start.
- LAYR: the game calls only `acquire`, `ready`, `error`, `machine`, `openGame`, `saveGame`. State is stored under the id `monkey-hash`. There is no second balance.
- Network: the game reads `https://xtrata.xyz/forever-twins/data/registry.v2.json`, the Bitcoin Monkeys helper's events through `https://xtrata.xyz/hiro/mainnet/...`, twin pictures from `https://xtrata.xyz/i/<id>`, and (to top up the reels) original monkey and Serum pictures from `images.gamma.io`, `stxnft.mypinata.cloud`, `ipfs.io` and `cloudflare-ipfs.com`. Allow those hosts in any CSP. Everything needed to draw the reels is bundled as typed record tiles, so nothing fails if they are blocked.

## 5. Holder layer (version 1: display only)

- **Holder Pot:** 1% of every paid bet, weekly period (ISO week), stored in the game state (`pot`, `potKey`, `lastPot`) beside the jackpot meters. Shown on the screen with the estimated share per twin (pot ÷ twins counted from the helper; "unknown" if the read fails, never "no twins").
- **Cameo:** a Bitcoin Monkey on a winning line is shown in the win message with its token number and Xtrata ID (or NOT YET FOREVER) and recorded as `{tokenId, collection: 'bitcoin-monkeys', lineWin, forever, xtrataId}` in the spin history. No royalty is paid.
- **Stubs** (nothing pays out): `HolderLayerStubs` in the game script lists snapshot, claim, holder spins, Forever Fund and Collection Cup, each with a `TODO(holder-layer v2)` line. They need a server or a contract.
- The helper is live, so this machine never ships dark; it opens as soon as the LAYR account connects.

## 6. Before it goes on the public floor

1. **Logos.** `art/sources.json` lists them. The **BANANA logo, the Bitcoin Monkeys logo and the Monkey Store logo were not found**; those tiles show the name in type. Drop the files into `tools/monkey-hash/art/logos/` as `banana.svg`, `bitcoin-monkeys.svg`, `monkey-store.svg` (`.png` / `.webp` also work) and rebuild; each owner's permission is needed first.
2. **Mutant Monkeys.** Contract `SP125J1ADVYWGWB9NQRCVGKYAG73R17ZNMV17XEJ7.mutant-monkeys` (from the series contracts sheet; confirmed on Hiro, 5,000 max). Hiro only returns a `token_uri` pointing at an off-chain metadata host, which the build container could not reach, so the Mutant tile is still typed in the bundle. Run `python3 tools/monkey-hash/fetch_art.py` (the contract is now the default) and rebuild to bundle real pictures; the game also tries to load them live and falls back to the typed tile if the host refuses a browser.
3. **Pictures.** The build sandbox could only reach xtrata.xyz, so the bundle holds the six twinned monkeys' real pictures and record tiles (token number and tier) for the rest. The game tops the reels up in the player's browser (up to 30 originals and one picture per Serum batch). To bundle more, run `python3 tools/monkey-hash/fetch_art.py` on a machine with normal internet access and rebuild.
4. **Serum naming.** The brief says the second batch is "MM3"; on chain it is **MM2** (token ids 3501 to 5000; MM1 is 1 to 3500). The tiles say MM2.
5. **Floor space** (section 2, item 2).
6. **Legal.** The Holder Pot shares machine takings with NFT holders. While LAYR is play money this is a game mechanic; on mainnet it raises licensing and securities questions. Take advice first.
7. The RTP (94.38%) is a design estimate from the engine's exhaustive model and a seeded simulation, not a certified figure. The Fair Play panel says so.

## 7. Rebuilding

```sh
python3 tools/monkey-hash/model/build_model.py   # cabinet → model/monkey-hash-model.json (needs Playwright + numpy)
python3 tools/monkey-hash/fetch_art.py           # optional: more pictures, Mutants (needs normal internet)
python3 tools/monkey-hash/build.py               # game.html → pack.json → public/casino-machines/monkey-hash/
python3 tools/monkey-hash/verify.py              # engine and adapter identical to Forever Twins; pack.json decodes
node tools/monkey-hash/rtp-sim.mjs 5000000       # seeded RTP check
```


## Deck buttons

Each of the five deck buttons is a fixed gold bezel plus a cap group that slides in 0.05 along the deck's z axis when pressed and springs back out. Model roles: `deckPays`, `deckDown`, `deckUp`, `deckAuto` and `spinPhysical` (the SWING button). The test page animates all five (held while the pointer is down, plus a short pulse for taps, Space and lever pulls). The casino room only animates `spinPhysical` today (it sets its `position.z` from `mechanics().spinZ`), so in the room the other four caps stay still until the room gets a small hook that moves the `px-deck*` objects the same way. That hook was not added, because no casino file was edited.
