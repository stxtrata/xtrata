# ParallaX Casino build prompt: Corgi Kennel (machine 21)

Series Bible 2.1 edition, 3 November 2026. Paste this whole prompt into a new chat with any capable coding assistant. It is fully self-contained: it needs no files, no folder access and no other document. Everything the builder must copy is in part 6.

---

Build one new fruit machine for the ParallaX Casino: **Corgi Kennel**. Everything you need is in this prompt, in five parts:

1. **How to work:** read this first.
2. **Build brief:** where the files are, the hard rules, the cabinet, the screen view, fullscreen, bonus presentation, the Bonus preview and Lab, the Casino Jackpot and Machine Fund display, the standalone build and the checks.
3. **Background:** the standard every machine must meet, the shared engine, the symbol rule, the Casino Jackpot, the Machine Fund and the lessons earlier builds paid for.
4. **Machine treatment:** this machine's reels, where to find every image, its bonus games, fund and cabinet.
5. **Brand assets:** the Xtrata mark, ready to use.
6. **Appendix A, reference code and interfaces:** the engine, the LAYR account script, the host object, fullscreen, the cabinet model format, the screen-view solver, the button and lever motion, the return simulator and the check recipes, verbatim.

# 1. How to work

- **If parts disagree:** the engine maths and the hard rules win over everything. On this machine's look, names, art, bonuses and cabinet, the machine treatment wins.
- **This is a Series Bible 2.1 build.** 22 of the 25 machines are built, and this is one of the last three. The older machines were built in generations, so the same feature exists in up to four forms. Part 2 fixes the best form of each, and part 6 gives the reference code from the newest builds. Do not regress anything it does.
- **Build only this machine, standalone.** Make it as its own test page in its own folder, packaged ready to drop into the casino later (part 2, STANDALONE BUILD). You do not have the casino's files and must not try to integrate it into the room; write the integration steps down instead.
- **Everything you need is in this prompt.** Part 6 holds, verbatim, the engine, the LAYR account script, the host object, the fullscreen hand-over, the cabinet format with its serializer and loader, the screen-view solver, the deck-cap and lever motion, the return simulator and the check recipes. Copy those exactly; build the rest (art, scenes, cabinet, test page) around them. You have no access to my computer or to any other machine's files, and none is needed.
- **Art:** every symbol is real Bitcoin or Stacks material (token logos, NFTs, official logos, on-chain records), never generic or classic casino art. Follow "Finding the art" in part 4 for every symbol, and record each image's source.
- **Standard features:** every row of the checklist at the start of part 3 must be done before the machine is finished.
- **Bonuses:** every bonus, the jackpot and the gamble must be fully designed and animated in the machine's theme, from trigger to summary, with nothing left as a placeholder (part 2, BONUS PRESENTATION; each one's look is described in part 4).
- **Logos:** use the Xtrata SVG in part 5 exactly as given: never redraw, recolour, stretch or crop it. There is no ParallaX Casino wordmark in this edition; leave it out.
- **Data and art reads.** The Hiro API, token metadata, IPFS gateways and the launchpad and DeFi sites are public web sources. If your environment cannot reach one, write the fetch script, state exactly what I need to run and which file it produces, and carry on with clearly labelled placeholders (a typeset tile marked "logo pending", a figure marked SNAPSHOT). Never invent a rate, count, ranking or figure.
- **Before writing code,** tell me in a few lines:
  - that you have read part 6, and which pieces of it you will use as they are;
  - which images or data you could not find, and anything in the treatment you think won't work.

  Then carry on building without waiting, unless something is blocking you.
- **To finish,** run the checks in part 2, write the results file, then give me the test page's path, a file-by-file summary of what you made, the art sources list, the logos that still need permission, and anything you could not do.

# 2. Build brief

WHERE THINGS ARE
- The casino room is not available to you. It loads machines from `window.PX_MACHINE_PACKS`: one object per machine with `name`, `description`, `color`, `accent`, `model` (gzip+base64 packed cabinet JSON), `game` (gzip+base64 self-contained HTML) and `css`. Part 6 (A.4 to A.9) gives every interface it uses.
- Build chain: write small scripts of your own (Node or Python) that build the cabinet model, assemble the game page, check the engine hashes and the five patched texts, and write `pack.json`, as A.7 to A.10 describe, and keep them in a `tools/` folder.
- Forever Twins registry: https://xtrata.xyz/forever-twins/data/registry.v2.json (collections, status, helper contracts). The Machine Fund counts twins from the helpers listed there.
- The room patches each pack's game HTML by exact text: the five anchors in A.4, each exactly once, in the plain `E=LAYR.machine(GAME_ID,BF)` form.

HARD RULES (these keep the return at 94.38%)
1. Copy the Block Fortune v2 engine (A.1) byte for byte: strips, pays, 20 lines, bets 20/40/100/200/500, scatter pays, free spins 8 / +4 / cap 24 / 2x, pick prizes 1,2,2,3,4,5,8,10,15, hold-and-respin values 1,2,3,5,10 at 1 in 25, jackpot seed 500x + 2%. Change no number. Prove it two ways: the sha256 of the engine file is `7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168`, and in the finished game HTML the text from `const BF = (() => {` through the first `\n})();` is 11,429 characters with a sha256 starting `203f873500`, the same as the other built machines. Your build script must fail if either differs.
2. The theme layer changes only NAMES, art, sounds, copy and the cabinet. Map the ten engine slots (cherry, lemon, chip, block, artifact, bitcoin, wild, scatter, vault, chain) exactly as the treatment's reel table says.
3. The result is fixed before any art is chosen. Picking which image shows in a cell uses `Math.random` or its own generator, never the engine's rng, so loaded art can never change a result. Commit the result once before animating; a reload mid-spin settles once with the same round id and can never reroll or double-credit.
4. Build it standalone but ready for the room. The game code must use the room's interfaces unchanged: the shared LAYR account (`window.ParallaxLAYRAccount`, never a second balance or wallet) and the canvas-and-controls API, where the host owns all 3D rendering and cameras. In this build the host is a standalone test page, which supplies a clearly marked test stub of `ParallaxLAYRAccount` with a play balance. Dropping the pack into the casino later must need no change to the game code.
5. The Fair Play panel states 94.38% (lines 59.7%, scatters 1.5%, free spins 8.5%, pick 11.9%, hold and respin 10.3%, jackpot 2.4%), the bonus frequencies (1 in 140, 1 in 140, 1 in 290, jackpot about 1 in 113,000), that the gamble is an even bet, and that this is a design estimate, not a certified RTP. It also says that the Casino Jackpot is shared by every machine and pays whoever hits it, and that the Machine Fund comes out of the house's share and never reduces a player's win.
6. Every symbol is real Bitcoin or Stacks material, never generic or classic casino art: token logos from the token's own metadata, official logo files, and real on-chain records, found as the treatment's "Finding the art" says. Never draw or imitate a project's logo or a collection's characters by hand. A Stacks NFT without a twin shows desaturated with a NOT YET FOREVER stamp. Record every image's source in `sources.json` and list the logos that still need the project's permission. Anything that cannot be what it looks like says so on its tile and in the panels (a snapshot says SNAPSHOT with its date; a missing figure says so; never invent a rate, count or number).
7. No outside-holder code. This machine's theme is art only. There is no wallet linking, no token minimum and no payout to holders of the tokens on the reels (v1's holder hook for this machine is replaced by the Machine Fund below).

CABINET
- A packed model in the same format as the existing packs, about the same proportions (the room scales it to 2.6 m tall). Named parts: `screenMesh` (the live canvas), the topper part named in the treatment (role `crest`) turning on its own clock, `spinPhysical` (big spin button), `lever` or `armPivot`, and deck buttons with `userData` actions `spin`, `betUp`, `betDown`, `auto`, `pays`, each marked as a `pxMachineAction` mesh. Label them as the treatment says. Include the souvenir ticket slot and the Xtrata mark drawn with the XLOGO vector code (no image).
- Idle frames capped near 30 fps; the test page must still draw the game screen when WebGL is unavailable (draw the game canvas to a plain 2D canvas).
- Deck caps: each cap sinks along the deck's own z axis on a spring and its label moves with it (A.8).
- Lever: pulled by a hand. It eases down, rests on the bottom stop, springs back and bounces once off the top stop (`leverCurve` in A.8). Each pull also gives the machine's own flourish (the treatment's lever line).
- `mechanics()` returns both the lever's timing and `buttons` (the cap motion), so the caps and lever move in the room, not only on the test page.
- The controls strip under the deck is dark, so no cabinet shows beneath the buttons in the screen view.

SCREEN VIEW (the standard, pass or fail)
- The whole game screen fills the window, with the deck's physical buttons just beneath it and nothing of the cabinet below them.
- The camera is straight on at a pitch of 0.16 (`SV_PITCH`), slightly above, because a lower angle shows the underside of the marquee over the top of the screen.
- Solve it numerically, as `screenGoal` and `deckBox` do in A.8: a 40-iteration bisection at the start and on every resize, so that the top of the screen sits 10 px under the top bar, the front bottom edge of the deck sits on the top of the controls strip, and the sides keep a 4% margin. The deck is every `pxMachineAction` mesh plus `spinPhysical`; the lever is left out. If the cabinet has a bezel or lintel above the glass, give it an allowance.
- Test at five window sizes: 1440×900, 1366×768, 1024×768, 390×844 and 844×390. At each, assert (do not just screenshot) that the top of the screen is below the top bar, every deck button is inside the window and above the controls strip, and clicking each deck button in screen view fires its action. The recipe is in A.11.

FULLSCREEN MODE
- One API: `fullscreenHost` (A.6). The room owns the frame, so the rest of the page stays clickable. Offer a Fullscreen button (and the F key; Esc exits), falling back to a fixed full-viewport layer where the Fullscreen API is missing (iPhone Safari).
- In fullscreen the game screen fills the view and a control bar runs along the bottom with every control except the lever, as on-screen buttons: Spin (the only way to spin there), Bet − and Bet + with the current bet, Auto, Pays (pay table and rules), Fair Play, Turbo, Sound and volume, History, the Fund panel, the balance, the gamble's two choices whenever a gamble is offered, Collect or cash-out if the machine has one, the Bonus preview (and the Lab and Test panel buttons in the test build), and Exit fullscreen. Each button carries the machine's own deck label (its name for Spin, Bet and the rest) with the plain action in small type beneath.
- Bonus actions (open a pick, respin, collect a feature) stay tappable on the game screen, and the bar also shows one large button for whichever action is waiting.
- Every menu, panel and dialog opens and works inside fullscreen: none only works outside it, and nothing hides behind the bar. No button floats over the bottom of the screen where the balance, bet and win readouts live.
- The bar fits any width: one row on desktop, wrapping to as many rows as it needs on a phone (five rows at 390 wide is normal), touch targets at least 44 px, safe-area insets respected.
- Fullscreen belongs to the game code in the pack, not only the test page. INTEGRATION.md notes the fullscreen hand-over (A.6).

BONUS PRESENTATION (every bonus must feel finished, not a placeholder)
- Each of the machine's bonuses (free spins, pick, hold and respin), its jackpot and its gamble gets its own fully designed scene in the machine's theme, built from the treatment's description and using the machine's real art. No bonus may fall back to plain boxes, default text or a generic overlay.
- Every bonus has four stages, all designed and animated:
  1. **Trigger:** the triggering symbols pulse and lift out of the reels, the cabinet lights and topper react, a themed sting plays, and a title card names the bonus.
  2. **Intro:** a short themed transition into the bonus scene with one plain line of rules (for example "Open three. Each holds a prize.") and a Start button.
  3. **Play:** every action animates: reels re-skin for free spins (with a spins-left counter and a running total), picks open with a reveal animation and the real art behind each prize, hold-and-respin locks land with a stamp, a sound and the cell's value, and the respins-left counter resets visibly. Values count up; big moments get bigger effects.
  4. **Outro:** a summary screen with the bonus total counting up, what made it up (spins played, picks opened, cells locked), then a smooth return to the reels with the win added to the balance.
- The jackpot gets the machine's biggest celebration: a full-screen sequence with the jackpot name, the CASINO JACKPOT meter amount counting up, topper and cabinet light show, and music. The gamble gets its own small animated reveal.
- Results are dealt by the engine before any animation; the presentation only reveals them. A Skip button (and turbo) jumps to the outro with the same total as playing it out. Respect a reduced-motion setting with a calmer version of each scene (at most 3 particles through a whole jackpot).
- Every scene works in the cabinet view, the screen view and fullscreen, at desktop and phone width, with its buttons also on the fullscreen bar. The room overlays its bonus strip (y 780 to 872) and the turbo and gamble buttons (y 890) on every screen, so scene buttons go inside the reel window.

BONUS PREVIEW AND LAB (any bonus can be played in production, safely)
- One in-game module gives every player a **Bonus preview** from the Pays panel and the fullscreen bar's TEST button, and gives the test build the full **Bonus Lab** (the L key, a Lab button on the deck and on the fullscreen bar). The Lab menu lists every bonus round and special event of this machine as a selectable item. At least:
  - free spins, and free spins with a retrigger;
  - the pick bonus;
  - hold and respin, and a forced full-grid run that wins the jackpot;
  - the centre-row jackpot;
  - the gamble, as a win and as a loss;
  - scatter pays of 3, 4 and 5;
  - any machine-specific event in the treatment.
- Choose an item, choose the bet level, press Run: the item plays at once through the full presentation (trigger, intro, play, summary), exactly as a player would see it. Options: Seeded (with a seed field, so a run can be repeated) or Random, Replay last, and Run all (every item in turn).
- How it forces a bonus: pass a scripted rng into the engine's own `start(state, rng)` that picks reel stops landing the wanted symbols (and, for hold and respin, the wanted values). Never edit, duplicate or bypass the engine, so the Lab shows exactly what real play would.
- Production safety (the standard from The Archive and Plebs & Legends, kept):
  - Practice chips and a separate game state: the real state is set aside and put back on exit, and saving is switched off meanwhile.
  - A pristine copy of the engine (`PX_PURE`), so preview rounds never reach the round log, the Casino Jackpot meter, the fund or spectators.
  - Forcing is refused outside the preview, and nothing is exposed on `window`.
  - A strip across the screen reads BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR. Runs are marked LAB in History.
  - Leaving the machine or reconnecting ends it.
  - One test flag, `PX_STANDALONE_TEST` (the game checks `window.parent.PX_STANDALONE_TEST === true` or a localhost host name; the test page sets it and the room never does), enables the extra developer items (the Test panel, twin-state switch, RTP run). The room sets no flag in production. One way in for the room: `action('lab')`.
- The Lab or preview leaves the balance, the jackpot meters, the fund and the spin count exactly as they were.

CASINO JACKPOT AND MACHINE FUND (display and stubs; the service comes later)
- **Casino Jackpot:** five meters, one per bet level, shared by every machine (part 3). The topper shows the meter for the player's bet level under the label CASINO JACKPOT, and the machine keeps its own jackpot name and celebration. The Casino Service does not exist yet, so keep the engine's own jackpot behaviour exactly as it is in A.1 (the maths must not change), and put every read and write of the meter behind one small, clearly named block (`casinoJackpot.get(level)`, `.contribute(level, bet)`, `.settle(level)`) with a TODO that the Casino Service replaces it. Each spin's recorded result carries `jackpot: {level, hit}` before any animation.
- **Machine Fund (replaces v1's Holder Pot):** 1% of this machine's paid bets, taken from the house edge. This machine is type **W**: one share per Forever Twin in any live collection (part 3). Write `fund.json` with `{ "type": "W", "collections": "all-live", "period": "weekly", "periodStart": "Monday 00:00 UTC", "split": null }`. Show the fund balance, the period end and last period's pay per twin on the topper or marquee, and a Fund panel (also on the fullscreen bar) that explains in plain words who earns, how a claim works and that nothing is required to play. A failed twin read shows "checking", never zero.
- No cameo records on this machine: it has no twin art on its reels.
- Anything that needs a server or contract (snapshots, claims, the Casino Service, Forever Fund refunds) is out of scope: leave a clearly named stub and a TODO line. Payouts are display-only on testnet.

STANDALONE BUILD (do this; do not integrate into the casino yet)
- Put everything in a new folder, `casino-machines/corgi-kennel/`:
  - `index.html`: a self-contained test page that opens on its own and plays only this machine. It hosts the cabinet in a small 3D studio (dark floor, soft lights, the machine's floor glow) using the same packed model and the same canvas-and-controls API the room uses. Preview with the room's own renderer settings (Three r128, ACES tone mapping at 1.15, linear output). It offers a cabinet view (drag to orbit) and the solved screen view, a clickable lever and deck buttons, Space to spin, and the test stub of `ParallaxLAYRAccount` with a play balance and a reset button.
  - The Bonus preview and Lab (above), plus a small Test panel behind `PX_STANDALONE_TEST`: switch twins state (none / some / all) to check the NOT YET FOREVER look, reset the balance, and run the RTP simulation and show the result.
  - `pack.json`: the machine as one `PX_MACHINE_PACKS` entry (`{name, description, color, accent, model, game, css}`, model and game gzip+base64), exactly the format of the existing packs.
  - `art/` with the bundled images and `sources.json` (every image's source and date, and the logos that still need permission).
  - `fund.json`, `README.md` (how to open it, the keys, the machine's symbol table) and `INTEGRATION.md`: the steps for whoever adds it to the room later: the pack entry, a machines-panel button (colour pair, title, one-line subtitle), a floor glow colour, a floor position, the round-log hook id, the fullscreen hand-over (A.6) and anything the room must provide. Do not carry them out.
  - `checks/` (your scripts, per A.11) and `checks/results/`, plus `RESULTS.md` summarising every check.
- Keep the pack within a stated size budget (the built machines run 1 to 7 MB; aim for 1 to 2) and say what it came to. Do not leave `_to_delete` folders behind.
- Sound: record or take a free (CC0) recording where one exists, with code-made sound as the fallback, and list every file and its licence in a sources file (the best builds ship about 16 small CC0 mp3s). Nobody has listened to any machine's audio by ear, so list the sound as "listening sign-off owed".

CHECK BEFORE YOU FINISH (write every result to `checks/results/` and summarise it in `RESULTS.md`)
- Run the engine with a seeded rng for 5,000,000 spins (A.10, `node rtp.mjs 5000000`) and report the RTP (expect 94.38%, within about 0.3%; try two seeds). Compute and report the two hashes from rule 1.
- The five-size screen-view test, pass or fail, at 1440×900, 1366×768, 1024×768, 390×844 and 844×390.
- The deck check: bet up goes 100 to 200 and back, the labels read the machine's own names in order, and the spin cap starts a spin.
- Open the standalone test page, play spins with the lever and the deck buttons, and screenshot the cabinet view and the screen view. Check phone width: no button under 44 px and no sideways scroll at 390 wide, listed button by button.
- Play every Lab item (and Run all) through all four stages, screenshot each stage, and confirm none uses placeholder art or text. Skip pays the same total as playing it out, checked with real numbers. Reduced motion holds (at most 3 particles through a whole jackpot). A reload mid-spin settles once with the same round id. The Lab or preview leaves balance, jackpot meters, fund and spin count exactly as they were.
- Enter fullscreen and play a whole session using only the bottom bar (spin, bets, auto, pays, Fund, Fair Play, History, the gamble and every bonus), at desktop and at phone width; check every menu opens and closes inside fullscreen, then exit.
- Confirm an unknown twin count shows as unknown, untwinned art carries the NOT YET FOREVER stamp, and every unverified datum is labelled on its tile.
- Confirm that `pack.json` decodes to a valid pack in the existing format.
- Checks so far across the series ran in software rendering. Say so, and say that a real-GPU pass in Safari and Chrome is still owed.
- Tell me what you changed, file by file, and anything you could not do.

BRAND ASSETS
- Put the Xtrata mark (part 5) on the lower door; you may also use it on the topper base, the deck or the souvenir ticket.

# 3. Background

## Standard features (every machine)

Every machine in the series ships with all of these, whatever its theme. A machine is not finished until every row is done.

| Feature | What every machine must have |
| --- | --- |
| Engine and maths | The v2 engine copied exactly (hash in rule 1), 94.38% return, the Fair Play panel |
| Real art only | Every symbol real Stacks or Bitcoin material, sources recorded in `sources.json`, logos needing permission listed |
| Player controls | Spin, Bet − and Bet +, Auto (stops on any bonus, low balance, a panel opening or leaving the tab), Turbo, Sound and volume, Pays and rules, Fair Play, History, Fund, balance, the gamble's two choices |
| Three views | Cabinet view (lever and deck buttons), the solved screen view (whole screen plus the deck's buttons), and fullscreen |
| Screen view | The standard solver at pitch 0.16, tested pass or fail at five window sizes |
| Cabinet mechanics | Spring-loaded deck caps, a hand-pulled lever with a bounce, `mechanics()` returning lever timing and `buttons` |
| Fullscreen | `fullscreenHost`; every control and menu except the lever on a bar along the bottom; every panel works inside; F to enter, Esc to exit; fits a phone |
| Finished bonuses | Every bonus, the jackpot and the gamble fully designed and animated in four stages (trigger, intro, play, summary), with Skip and reduced motion |
| Bonus preview and Lab | One module: practice chips, a pristine engine copy, every bonus selectable, seeded or random, Replay, Run all. Open to every player as a preview; the developer extras only behind `PX_STANDALONE_TEST` |
| Casino Jackpot and Machine Fund | The shared jackpot meter on the topper, the fund balance, period and last pay per twin, the Fund panel, `fund.json` |
| Safe results | Each result fixed and saved before any animation; a reload never rerolls or pays twice |
| Access and devices | Keyboard (Space to spin, F for fullscreen, L for the Lab, Esc to close), touch targets of at least 44 px, phone width, reduced motion |
| Packaging | Standalone folder with the test page, `pack.json`, `art/`, `sources.json`, `fund.json`, `README.md`, `INTEGRATION.md`, `checks/` and `RESULTS.md` |
| Checks | 5-million-spin return, engine hash, five-size screen-view test, deck check, every Lab item played and screenshotted, Skip totals, reduced motion, reload mid-spin, Lab isolation, a fullscreen session at desktop and phone width |

## The shared engine

This machine is a reskin of the Block Fortune v2 engine that Forever Twins and every other built machine already run. The maths stays fixed; only names, art, sound and the cabinet change. That is what keeps it at 94.38%.

| Part | Rule | Share of the 94.38% |
| --- | --- | --- |
| Reels and lines | 5 reels × 3 rows, five weighted 32-stop strips, 20 fixed lines. Bets 20, 40, 100, 200, 500 LAYR | 59.7% |
| Scatter + free spins (bonus style 1) | 3, 4 or 5 scatters anywhere pay 2×, 5×, 10× total bet and start 8 free spins at 2×. Retrigger +4, cap 24 | 1.5% + 8.5% |
| Pick bonus (bonus style 2) | 3+ pick symbols anywhere: 9 sealed prizes drawn from 1, 2, 2, 3, 4, 5, 8, 10, 15 × total bet. Open 3 | 11.9% |
| Hold and respin (bonus style 3) | 5+ respin symbols lock with values 1, 2, 3, 5, 10 × bet. 3 respins; each empty cell locks at 1 in 25; any new lock resets to 3. Fill all 15 for the jackpot too | 10.3% |
| Jackpot | 5 top symbols on the centre row (wilds don't count), or a full hold-and-respin grid | 2.4% |
| Gamble | After a paid base win with no bonus: one 50/50 double-or-nothing call | 0% (even bet) |

Free spins and the pick bonus each arrive about 1 in 140 spins, hold and respin about 1 in 290, the jackpot about 1 in 113,000.

**The ten symbol slots every machine renames.** Line pays are multiples of the line bet (total bet ÷ 20) for 3, 4 and 5 of a kind:

| Engine slot | Role | 3 / 4 / 5 |
| --- | --- | --- |
| `cherry` | Low 1 | 6 / 16 / 50 |
| `lemon` | Low 2 | 7 / 20 / 60 |
| `chip` | Low 3 | 9 / 28 / 90 |
| `block` | Low 4 | 13 / 38 / 140 |
| `artifact` | High 2 | 20 / 80 / 300 |
| `bitcoin` | High 1, the jackpot symbol | 35 / 150 / 700 |
| `wild` | Wild, substitutes for line symbols | 80 / 400 / 2500 |
| `scatter` | Triggers free spins | pays × total bet, see above |
| `vault` | Triggers the pick bonus | — |
| `chain` | Triggers hold and respin | — |

**What a machine may change without new maths:** names, art, sounds, cabinet and the wording of the gamble. Anything else (extra multipliers, more picks, a bigger jackpot) needs a new exhaustive model before it ships.

**The symbol rule: nothing generic.** The engine's slot names (`cherry`, `lemon` and so on) are internal ids only and never appear on screen. Every symbol a player sees is real Bitcoin or Stacks material, of these kinds:

| Kind | Where it comes from | How it is shown |
| --- | --- | --- |
| Stacks NFT, forevered | Its Forever Twins twin on Xtrata, found through the collection's helper in the Forever Twins registry | Full colour, with a ∞ badge, token number and Xtrata ID |
| Stacks NFT, not yet forevered | The token's own art, from `get-token-uri` on its source contract (Hiro API read-only call), resolved through an IPFS gateway | Desaturated, with a "NOT YET FOREVER" stamp |
| Project, token or app logo | The official file from the project's own website, brand kit, GitHub or token metadata (`/metadata/v1/ft/<contract>` on Hiro), saved with its source URL | As supplied; until a file is found, the name set in type on a tile in the project's colour, marked "logo pending" |
| Real on-chain record | Block heights, contract names, transactions, pool data read from public APIs at build time | Drawn as data tiles in the machine's style, with the read's date; a failed read falls back to the last snapshot marked SNAPSHOT |

Art is never drawn or imitated by hand. About 18 images per symbol are fetched at build time and bundled as small data URIs, so the reels show real art offline; live loading tops them up. Each machine records every image's source in a `sources.json`. Logos of other projects go on a public machine only with that project's OK, so the builder records which logos still need permission. Use exact contract ids, never a name or symbol alone, because copycat tokens abound.

**The art rule carries over to every machine:** the result is fixed first, and only then does the machine choose which image to show in each cell. Art loaded from the chain can never change a result.

**Cabinet anatomy the room expects.** Each cabinet is a packed 3D model with named parts: `screenMesh` (the live game canvas), a topper part that turns on its own clock, `spinPhysical` (the big spin button), a `lever` or `armPivot`, and deck buttons with the actions `spin`, `betUp`, `betDown`, `auto` and `pays`. The room scales every cabinet to 2.6 m tall, puts a name plaque on top and a coloured floor glow in front, and plays the machine in place: coin in and pull the lever, or zoom to the screen and buttons.

## The Casino Jackpot

One set of five meters, one per bet level, shared by every machine on the floor. Every machine pays into the meter for the bet level being played.

| Bet level (LAYR) | 20 | 40 | 100 | 200 | 500 |
| --- | --- | --- | --- | --- | --- |
| Seed after each hit (500× bet) | 10,000 | 20,000 | 50,000 | 100,000 | 250,000 |

- It fills from 2% of every paid bet on any machine. Free spins, Bonus preview and Lab runs, and gamble stakes add nothing.
- It pays on the same result as today: five top symbols on the centre row (wilds don't count) or a full hold-and-respin grid. Odds stay about 1 in 113,000 spins on each machine.
- It pays whoever's spin hit, the full meter at that moment, with no holding or wallet condition. The meter then resets to its seed.
- Each machine keeps its own jackpot name and celebration, but the amount and the label CASINO JACKPOT are shared.
- Of each paid bet: 91.98% base game and bonuses, 2.4% Casino Jackpot (2.0% into the meter, about 0.4% is the seed the house refills), 1.0% Machine Fund, 0.6% cameo royalty, 0.3% Forever Fund, about 3.72% house. The player return of 94.38% is unchanged.

## The Machine Fund

Each machine's fund is 1% of that machine's paid bets, taken from the house edge and shared out every period to holders of Xtrata twins or inscriptions, who claim it. It replaces v1's Holder Pot. A share is always one Xtrata inscription.

- **This machine is type W:** one share per Forever Twin in any live collection. The theme on the reels stays as art only. There is no linking of Bitcoin addresses, no token threshold and no payout to holders of outside assets.
- **What counts:** a sealed inscription on the Xtrata core contract (`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`), here any twin of a collection that has a Forever Twins helper.
- **Held for the whole period:** the wallet must hold it at the period's first block and at its snapshot block. Shares count inscriptions, not wallets, so splitting holdings across wallets gains nothing.
- **Period:** weekly (Monday 00:00 UTC); the snapshot block is public.
- **Claims are pull, not push:** each period's fund is divided by the number of twins counted from the collection helpers, the holder of each twin claims its share, and unclaimed shares roll into the next period.
- **Unknown is not zero:** a failed read shows "checking" and never counts as no twins.
- **Not a gate:** a player with or without a twin plays, wins and hits the Casino Jackpot on equal terms. The fund is the house sharing its margin, never a cut of anyone's winnings.
- **Topper line:** fund balance, period end, and last period's pay per twin (for example "LAST CYCLE: 412 LAYR PER TWIN").
- While LAYR is play money on testnet this is a game mechanic. Once it is real STX on mainnet, sharing machine profits with NFT holders raises gambling-licence and securities questions, so legal advice comes first.

## Lessons earlier builds already paid for

- The Three.js build in the machines is a subset: no `ConeGeometry` or `FrontSide`.
- Never draw many strips while `shadowBlur` is set; it starved the software canvas in Rugged's jackpot.
- Tile makers are called `maker(item, sym)`, so the second argument is not a number.
- The room renders with Three r128, ACES tone mapping at 1.15 and linear output. Preview cabinets with the same settings or the colours look washed out.
- Call `updateMatrixWorld(true)` after scaling a cabinet before measuring it with `Box3`.
- Reel tiles are drawn at 352 device px. Draw photos and logos at 480 px to stay sharp.
- Test harnesses must re-read the scene after each screenshot and finish any real bonus before starting a Lab item. Headless Chromium can mis-composite a fully opaque fixed bar over WebGL, so use a near-opaque colour.

# 4. Machine treatment: Corgi Kennel

**Machine number:** 21. **Slug:** `corgi-kennel`. **Accent colour:** #f59e0b (floor glow, trim and highlights). **Fund type:** W (floor-wide).

A kennel-club dog show for Welshcorgicoin ($WELSH), which describes itself as the first memecoin built on Stacks. It launched on 24 November 2021 with 10 billion tokens; its original developers later stepped back and the community took it over. Since then it has bred a whole family of real descendant tokens, and they're all entered in the show. Every symbol is a real token's own logo or a real on-chain record. The tokens are art only: holding them earns nothing from this machine.

**Reels:**

| Slot | Symbol | Contract (use this exact one) |
| --- | --- | --- |
| `cherry` | Baby Welshcorgicoin (BABYWELSH) | `SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.tokensoft-token-v4kjvtr37ht` |
| `lemon` | Generational Welsh (gWELSH) | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.generational-welsh` |
| `chip` | Phoenix Welsh (PWEL) | `SP3S2565C4DP2MGR3CMANMGYDCDA314Q258CG2R7C.phoenix-welsh-faktory` |
| `block` | Liquid Staked Welsh (sWELSH) | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh-v2` |
| `artifact` | Anonymous Welsh CVLT (CVLT) | `SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.anonymous-welsh-cvlt` |
| `bitcoin` | Welshcorgicoin (WELSH), jackpot symbol, rosette frame | `SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token` |
| `wild` | Happy Welsh: an NFT from the community's 2,000-piece collection | Its Gamma collection contract |
| `scatter` | Day One: the WELSH launch transaction of 24 November 2021 | On-chain record |
| `vault` | LEO-WELSH: the liquidity pool where the cat and the corgi meet | `SP22KATK6MJF40987KB2KSZQ6E027HQ0CPP73C9Y.leo-welsh-v1` |
| `chain` | Pedigree card: a real WELSH-family token from the chain | On-chain record |

**Finding the art:**

- Token logos: each token's `image_uri` from Hiro's token metadata API (`/metadata/v1/ft/<contract>`), which serves the token's own image. Use only the exact contracts above. Many copycat tokens share these names, so never pick a token by name or symbol alone. The WELSH logo file is also in the community's GitHub repo.
- Happy Welsh: find the collection contract on its Gamma page, then load art through `get-token-uri` and an IPFS gateway. If it has no Forever Twins helper in the registry yet, show it desaturated with the NOT YET FOREVER stamp; check the registry at build time and say what you found.
- Day One: read the WELSH deploy transaction from the Hiro API (contract `welshcorgicoin-token`, deployed 24 November 2021) and show its block height and date. If the read fails, say so on the tile.
- Pedigree cards: real tokens whose names contain "Welsh", from Hiro's token search (`/metadata/v1/ft?name=welsh`, which lists over 60). Keep only those with a logo and valid metadata, and exclude anything offensive. Show name, symbol and logo. Bundle 15 or more.
- Every logo is that project's own artwork, so list them all as needing permission before a public build.

**Bonus games:**

- **Community Takeover** (free spins): 3+ Day One symbols. The judges' table empties, the crowd takes over the ring, and every spin is a lap of honour; all wins 2×.
- **Fetch!** (pick): 3+ LEO-WELSH pool tokens. Nine balls thrown across the show ring; pick three, and each comes back with a prize.
- **Pedigree** (hold and respin): 5+ pedigree cards. A family tree fills in; each lock adds a real descendant token with its value. Complete the tree for the jackpot.
- **Jackpot: Best in Show.** Five WELSH on the centre row; the rosette spins, confetti falls and the crowd cheers. The meter shown is the shared CASINO JACKPOT.
- **Gamble: Sit or Stay.**

**Machine Fund.** Type W, weekly (part 2 and part 3). Every Forever Twin in any live collection earns a share, and Happy Welsh twins join automatically once that collection has a helper. The WELSH family is not required for anything. The Fund panel says so in plain words. No cameo records.

**Cabinet:**

- **Topper (`crest`):** a large Best in Show rosette in WELSH colours, turning slowly with its ribbons fluttering. The CASINO JACKPOT meter and the fund line sit on its marquee.
- **Body:** kennel-club green and gold, with show-ring rails along the base and a judges' scoreboard down each side.
- **Screen:** framed as the show ring seen from the stands.
- **Deck buttons:** FETCH (`spin`), +TREATS / −TREATS (`betUp` / `betDown`), AUTO-WALK (`auto`), PEDIGREE (`pays`).
- **Arm (`lever`):** a leather dog lead on a brass ring; each pull gives a tug and a happy bark.
- **Lower door:** "WELSH · THE FIRST MEMECOIN ON STACKS", with the Xtrata mark.
- **Sound:** a show-ring brass band, barks on reel stops, applause on wins.

# 5. Brand assets

Use these as given: never redraw, recolour, stretch or crop them.

## Xtrata mark (SVG, 851 x 851 viewBox, transparent)

The same trace as the XLOGO vector code already in every machine.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 851 851" width="851" height="851"><title>Xtrata</title><defs><filter id="xsh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000" flood-opacity="0.8"/></filter><linearGradient id="xblue" gradientUnits="userSpaceOnUse" x1="0" y1="240" x2="0" y2="640"><stop offset="0" stop-color="#6593cf"/><stop offset=".5" stop-color="#4675b6"/><stop offset="1" stop-color="#315c95"/></linearGradient><linearGradient id="xorange" gradientUnits="userSpaceOnUse" x1="0" y1="495" x2="0" y2="790"><stop offset="0" stop-color="#f2aa5a"/><stop offset=".5" stop-color="#e28c3b"/><stop offset="1" stop-color="#c9762c"/></linearGradient><linearGradient id="xwhite" gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="0" y2="392"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e2e3e1"/><stop offset="1" stop-color="#b9bbb8"/></linearGradient></defs><g fill="none" stroke-linejoin="miter" stroke-miterlimit="6" stroke-linecap="butt"><path d="M38,192 L68,238" stroke="#2b4a78" stroke-opacity="0.667" stroke-width="6"/><path d="M813,192 L783,238" stroke="#2b4a78" stroke-opacity="0.667" stroke-width="6"/><path d="M38,683 L68,640" stroke="#2b4a78" stroke-opacity="0.667" stroke-width="6"/><path d="M813,683 L783,640" stroke="#2b4a78" stroke-opacity="0.667" stroke-width="6"/><g filter="url(#xsh)" stroke="url(#xblue)" stroke-width="13"><path d="M31,244 L229,244 L405,439 L227,634 L31,634 L100,559 L196,559 L304,438 L197,320 L100,320 Z"/><path d="M120,320 L197,320 L304,438 L196,559 L120,559 L221,439 Z"/><path d="M820,244 L622,244 L446,439 L624,634 L820,634 L751,559 L655,559 L547,438 L654,320 L751,320 Z"/><path d="M731,320 L654,320 L547,438 L655,559 L731,559 L630,439 Z"/></g><g stroke="#ffffff" stroke-opacity="0.2" stroke-width="2"><path d="M31,244 L229,244 L405,439 L227,634 L31,634 L100,559 L196,559 L304,438 L197,320 L100,320 Z"/><path d="M120,320 L197,320 L304,438 L196,559 L120,559 L221,439 Z"/><path d="M820,244 L622,244 L446,439 L624,634 L820,634 L751,559 L655,559 L547,438 L654,320 L751,320 Z"/><path d="M731,320 L654,320 L547,438 L655,559 L731,559 L630,439 Z"/></g><g filter="url(#xsh)" stroke="url(#xorange)" stroke-width="13"><path d="M24,691 L250,691 L425.5,500 L601,691 L827,691 L827,784 L563,784 L425.5,635 L288,784 L24,784 Z"/></g><g stroke="#ffffff" stroke-opacity="0.2" stroke-width="2"><path d="M24,691 L250,691 L425.5,500 L601,691 L827,691 L827,784 L563,784 L425.5,635 L288,784 L24,784 Z"/></g><g filter="url(#xsh)" stroke="url(#xwhite)" stroke-width="13"><path d="M24,70 L290,70 L425.5,218 L561,70 L827,70 L827,186 L606,186 L425.5,382 L245,186 L24,186 Z"/><path d="M24,112 L273,112 L425.5,276 L578,112 L827,112"/></g><g stroke="#ffffff" stroke-opacity="0.2" stroke-width="2"><path d="M24,70 L290,70 L425.5,218 L561,70 L827,70 L827,186 L606,186 L425.5,382 L245,186 L24,186 Z"/></g></g></svg>
```

# 6. Appendix A: reference code and interfaces

Everything a builder needs to make a machine that the casino room accepts, copied verbatim from the newest finished builds (DOG Army, machine 24, and Hot Wallet, machine 25). Nothing outside this document is needed. Where a piece of code refers to a function of the game that is not shown (for example `spinClick`, `openRules`, `drawScreen`), that function is the machine's own and each machine writes it for itself; the interface is the point.

| Part | What it is |
| --- | --- |
| A.1 | The Block Fortune v2 engine: copied byte for byte, never edited |
| A.2 | The LAYR account script: the one account the room and every cabinet share |
| A.3 | Compatibility guard, the canvas stand-in renderer and the Xtrata mark's vector code |
| A.4 | How the game page is assembled and the exact text the room patches |
| A.5 | The host object `window.PX_CASINO_ENGINE`: the canvas-and-controls API the room calls |
| A.6 | Fullscreen: the game's side and the room's side |
| A.7 | The packed cabinet model: format, serializer, loader and required parts |
| A.8 | Screen view solver, deck-cap spring and lever curve |
| A.9 | The pack entry (`pack.json`) |
| A.10 | The return simulator |
| A.11 | The check recipes |

## A.1 The engine (copy byte for byte)

This is the whole file `engine.js`. Two hashes prove a copy is exact. The sha256 of the whole file is `7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168`. In the finished game page, the text from `const BF = (() => {` through the first `\n})();` after it (inclusive) is exactly 11,429 characters and its sha256 starts `203f873500`. Every built machine carries this block. Do not reformat it, minify it, rename anything in it or change one number. The engine is pure logic: no DOM, no timers, every random draw goes through the `rng` argument (`rng(n)` returns an integer from 0 to n−1), so a seeded generator makes runs repeatable. State is a plain object from `BF.fresh()`; the functions are `start`, `settle`, `feature`, `featureDone`, `pick`, `respin`, `collect`, `endFree`, `gamble`.

```js
/* Block Fortune v2 engine. Pure game logic: no DOM, no timers. Every random draw goes through the
   rng argument (defaults to crypto with rejection sampling), so tests can be seeded and a future
   on-chain version can supply block-hash randomness. Exported for Node tests via module.exports. */
const BF = (() => {
  'use strict';
  const STATE_VERSION = 2;
  const CODE = { C: 'cherry', L: 'lemon', M: 'chip', K: 'block', I: 'artifact', B: 'bitcoin', W: 'wild', S: 'scatter', V: 'vault', N: 'chain' };
  // Five weighted 32-stop strips. A spin picks one stop per reel; the window shows that stop and the
  // next two (wrapping). One confirmation and one vault key per reel, so a reel never shows two of
  // either. Chain nodes sit in N.N pairs (N..N on reel 3), so a reel shows at most two.
  const stripCodes = [
    'NCNLLCWILBSIMKCKIBKMLVCCBMMLKMIC',
    'NWNLBIMKILSICMCMCKLKBVKCBLLMIKLM',
    'NCMNWCILKCSCIMLBKKKMMVIIMCKMLBBL',
    'NBNCCBLKMLSKLLIKIICMIVCLCBLKMWMK',
    'NCNIMLCIKCSLKLMLBKICBVIWMCKMBMLC'
  ];
  const strips = Object.freeze(stripCodes.map(s => Object.freeze([...s].map(c => CODE[c]))));
  const symbols = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild', 'scatter', 'vault', 'chain'];
  const NAMES = { cherry: 'Cherry', lemon: 'Lemon', chip: 'Mining chip', block: 'Block', artifact: 'Inscription', bitcoin: 'Bitcoin', wild: 'Wild', scatter: 'Confirmation', vault: 'Vault key', chain: 'Chain node' };
  // Multiples of the line bet (total bet / 20) for 3, 4 and 5 of a kind.
  const pays = Object.freeze({ cherry: [6, 16, 50], lemon: [7, 20, 60], chip: [9, 28, 90], block: [13, 38, 140], artifact: [20, 80, 300], bitcoin: [35, 150, 700], wild: [80, 400, 2500] });
  const lines = [[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],[1,0,1,2,1],[1,2,1,0,1],[0,1,0,1,0],[2,1,2,1,2],[1,1,0,1,1],[1,1,2,1,1],[0,2,0,2,0],[2,0,2,0,2],[0,2,1,2,0]];
  const bets = [20, 40, 100, 200, 500];
  const scatterPays = { 3: 2, 4: 5, 5: 10 };          // x total bet, doubled in free spins
  const vaultPrizes = [1, 2, 2, 3, 4, 5, 8, 10, 15];  // x total bet, each tile drawn independently
  const chainValues = [1, 2, 3, 5, 10];               // x total bet, each node drawn independently
  const CHAIN_ODDS = 25;                              // each empty cell locks with chance 1/25 (4%) per respin
  const FREE_SPINS = 8, RETRIGGER = 4, FREE_CAP = 24, FREE_MULT = 2;
  const JACKPOT_RATE = 0.02, JACKPOT_SEED = 500;      // Genesis Block: seed 500x bet, +2% of each paid bet at that level

  function randomInt(n) {
    if (!Number.isInteger(n) || n < 1) throw Error('Invalid random range');
    const a = new Uint32Array(1), cap = Math.floor(4294967296 / n) * n;
    do { crypto.getRandomValues(a); } while (a[0] >= cap);
    return a[0] % n;
  }
  const windowAt = (c, stop) => [0, 1, 2].map(r => strips[c][(stop + r) % strips[c].length]);
  function spinReels(rng = randomInt) {
    const stops = strips.map(s => rng(s.length));
    return { stops, grid: stops.map((s, c) => windowAt(c, s)) };
  }
  function evaluate(g, bet, mult = 1) {
    if (!bets.includes(bet)) throw Error('Invalid bet');
    const wins = []; let lineTotal = 0;
    lines.forEach((line, index) => {
      let best = null;
      for (const [sym, p] of Object.entries(pays)) {
        let count = 0;
        for (let x = 0; x < 5; x++) { const id = g[x][line[x]]; if (id === sym || (id === 'wild' && sym !== 'wild')) count++; else break; }
        if (count >= 3) { const amount = p[count - 3] * (bet / 20) * mult; if (!best || amount > best.amount) best = { line: index, symbol: sym, count, amount }; }
      }
      if (best) { wins.push(best); lineTotal += best.amount; }
    });
    const flat = g.flat(), count = s => flat.filter(x => x === s).length;
    const scatters = count('scatter'), vaults = count('vault'), chains = count('chain');
    const scatterPay = scatters >= 3 ? scatterPays[Math.min(5, scatters)] * bet * mult : 0;
    return { wins, lineTotal, scatters, vaults, chains, scatterPay, total: lineTotal + scatterPay,
      triggers: { chain: chains >= 5, vault: vaults >= 3, free: scatters >= 3 },
      jackpot: g.every(col => col[1] === 'bitcoin') };
  }
  const seedFor = bet => bet * JACKPOT_SEED;
  const freshJackpots = () => Object.fromEntries(bets.map(b => [b, seedFor(b)]));
  const meter = (state, bet) => (state.jackpots && state.jackpots[bet] != null) ? state.jackpots[bet] : seedFor(bet);
  function claimJackpot(state, bet) { const win = Math.floor(meter(state, bet) + 1e-6); state.jackpots[bet] = seedFor(bet); return win; }
  function makeVault(bet, free, rng) {
    return { type: 'vault', bet, free, awards: Array.from({ length: 9 }, () => vaultPrizes[rng(vaultPrizes.length)]), picks: [] };
  }
  function makeChain(g, bet, free, rng) {
    let cells = Array(15).fill(0);
    g.forEach((col, x) => col.forEach((s, y) => { if (s === 'chain') cells[y * 5 + x] = chainValues[rng(chainValues.length)]; }));
    const frames = [{ cells: [...cells], left: 3, added: [] }]; let left = 3;
    while (left && cells.includes(0)) {
      const added = [];
      cells = cells.map((v, i) => { if (v || rng(CHAIN_ODDS) !== 0) return v; added.push(i); return chainValues[rng(chainValues.length)]; });
      left = added.length ? 3 : left - 1;
      frames.push({ cells: [...cells], left, added });
    }
    return { type: 'chain', bet, free, frames, index: 0, sum: cells.reduce((a, v) => a + v, 0), full: cells.every(Boolean) };
  }
  
  const roundId = rng => Array.from({ length: 16 }, () => rng(256).toString(16).padStart(2, '0')).join('');
  function busy(state) { return !!state.pending || state.features.length > 0; }
  function start(state, rng = randomInt) {
    if (busy(state)) throw Error('Finish the current spin or feature first');
    const free = state.free > 0, bet = free ? state.freeBet : state.bet;
    if (!bets.includes(bet)) throw Error('Invalid bet');
    if (!free && state.balance < bet) throw Error('Insufficient LAYR in the shared account');
    state.gamble = 0; state.lastWin = 0;
    if (!state.jackpots) state.jackpots = freshJackpots();
    if (free) state.free--;
    else { state.balance -= bet; state.wagered += bet; state.jackpots[bet] = Math.round((meter(state, bet) + bet * JACKPOT_RATE) * 1e4) / 1e4; }
    const spin = spinReels(rng);
    const ev = evaluate(spin.grid, bet, free ? FREE_MULT : 1), features = [];
    if (ev.triggers.chain) features.push(makeChain(spin.grid, bet, free, rng));
    if (ev.triggers.vault) features.push(makeVault(bet, free, rng));
    state.pending = { id: roundId(rng), time: Date.now(), grid: spin.grid, stops: spin.stops, bet, free, features };
    return state.pending;
  }
  function credit(state, amount) { state.balance += amount; state.paidOut += amount; }
  function settle(state) {
    const p = state.pending; if (!p) return null;
    state.pending = null;
    const r = evaluate(p.grid, p.bet, p.free ? FREE_MULT : 1);
    r.jackpotWin = r.jackpot ? claimJackpot(state, p.bet) : 0;
    r.total += r.jackpotWin;
    credit(state, r.total);
    state.grid = p.grid; state.stops = p.stops; state.lastWin = r.total;
    state.spins++;
    if (p.free) { state.freeTotal += r.total; state.freeCount++; }
    r.freeAward = 0;
    if (r.triggers.free) {
      if (!state.freeActive) { state.freeActive = true; state.freeAwarded = 0; state.freeTotal = 0; state.freeCount = 0; state.freeBet = p.bet; }
      const add = state.freeAwarded === 0 ? FREE_SPINS : Math.min(RETRIGGER, FREE_CAP - state.freeAwarded);
      state.free += add; state.freeAwarded += add; r.freeAward = add;
    }
    for (const f of p.features) { f.roundId = p.id; state.features.push(f); }
    state.gamble = (!p.free && !p.features.length && !r.triggers.free && r.total > 0) ? r.total : 0;
    const feature = [r.jackpotWin ? 'GENESIS BLOCK' : '', ...p.features.map(f => f.type === 'chain' ? 'CHAIN' : 'VAULT'), r.triggers.free ? (p.free ? 'RETRIGGER' : 'FREE SPINS') : ''].filter(Boolean).join(' + ');
    state.history.unshift({ id: p.id, time: p.time, bet: p.free ? 0 : p.bet, win: r.total, kind: p.free ? 'Free spin' : 'Spin', feature, grid: p.grid });
    state.history = state.history.slice(0, 50);
    r.round = p;
    return r;
  }
  const feature = state => state.features[0] || null;
  function pick(state, index) {
    const f = feature(state);
    if (!f || f.type !== 'vault' || f.picks.length >= 3 || f.picks.includes(index) || !(index >= 0 && index < 9)) return null;
    f.picks.push(index); return { multiple: f.awards[index], amount: f.awards[index] * f.bet };
  }
  function respin(state) {
    const f = feature(state);
    if (!f || f.type !== 'chain' || f.index >= f.frames.length - 1) return null;
    f.index++; return f.frames[f.index];
  }
  function featureDone(f) { return f.type === 'vault' ? f.picks.length === 3 : f.index === f.frames.length - 1; }
  function collect(state) {
    const f = feature(state); if (!f || !featureDone(f)) return null;
    let amount = f.type === 'vault' ? f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet : f.sum * f.bet;
    const jackpotWin = f.type === 'chain' && f.full ? claimJackpot(state, f.bet) : 0;
    amount += jackpotWin;
    credit(state, amount);
    state.lastWin += amount;
    if (f.free) state.freeTotal += amount;
    const h = state.history.find(x => x.id === f.roundId); if (h) h.win += amount;
    state.features.shift();
    return { type: f.type, amount, jackpotWin };
  }
  function endFree(state) {
    if (!state.freeActive || state.free || busy(state)) return null;
    state.freeActive = false; state.freeAwarded = 0;
    return { total: state.freeTotal, count: state.freeCount };
  }
  function gamble(state, choice, rng = randomInt) {
    if (!state.gamble || busy(state) || state.free || !['odd', 'even'].includes(choice)) return null;
    const stake = state.gamble, odd = rng(2) === 1, win = (choice === 'odd') === odd;
    const digits = odd ? '13579bdf' : '02468ace';
    const hash = Array.from({ length: 63 }, () => '0123456789abcdef'[rng(16)]).join('') + digits[rng(8)];
    state.balance += win ? stake : -stake; state.gambleNet += win ? stake : -stake;
    state.lastWin = win ? stake * 2 : 0; state.gamble = 0;
    return { win, hash, parity: odd ? 'odd' : 'even', amount: win ? stake * 2 : 0, stake };
  }
  function fresh() {
    const stops = [1, 2, 13, 5, 16];
    return { version: STATE_VERSION, bet: 100, lastWin: 0, spins: 0, wagered: 0, paidOut: 0, gambleNet: 0,
      free: 0, freeBet: 100, freeAwarded: 0, freeTotal: 0, freeCount: 0, freeActive: false, 
      jackpots: freshJackpots(), stops, grid: stops.map((s, c) => windowAt(c, s)), pending: null, features: [], gamble: 0,
      history: [], muted: false, volume: 0.4, ambient: false, turbo: false, reduced: false, showLines: false, quality: 'auto', notes: [] };
  }
  function load(raw) {
    const base = fresh();
    if (!raw || raw.version !== STATE_VERSION || !bets.includes(raw.bet) || !Array.isArray(raw.grid) || raw.grid.length !== 5) return base;
    return { ...base, ...raw, jackpots: { ...base.jackpots, ...(raw.jackpots || {}) }, features: raw.features || [], history: raw.history || [], notes: [] };
  }
  const weights = symbols.map(sym => strips.map(st => st.filter(x => x === sym).length));
  return { STATE_VERSION, symbols, NAMES, strips, stripCodes, weights, pays, lines, bets, scatterPays, vaultPrizes, chainValues, CHAIN_ODDS,
    FREE_SPINS, RETRIGGER, FREE_CAP, FREE_MULT, JACKPOT_RATE, JACKPOT_SEED, randomInt, windowAt, spinReels, evaluate, meter, seedFor,
    fresh, load, start, settle, feature, featureDone, pick, respin, collect, endFree, gamble, busy };
})();
if (typeof module !== 'undefined') module.exports = BF;
```

## A.2 The LAYR account script (the room's shared account)

Paste this script first in the game page, unchanged. Its first line is the text the room searches for. In the room, the cabinet runs in a frame and this script reuses the room's account (`window.parent.ParallaxLAYRAccount`); on a standalone page it creates a local one. `LAYR.machine(GAME_ID, BF)` wraps the engine so every state change is one committed transaction on the shared balance.

```js
/* One existing LAYR account for the room and every cabinet.
   This local adapter does not claim to verify or transfer on-chain tokens. */
(() => {
  'use strict';
  try {
    if (window.parent !== window && window.parent.ParallaxLAYRAccount) {
      window.ParallaxLAYRAccount = window.parent.ParallaxLAYRAccount;
      return;
    }
  } catch (_) {}
  const KEY = 'xtrata.parallax.layr.account.v1', LEGACY_KEY='royalflush_v2', LOCK = 'xtrata.parallax.layr.account.v1';
  let owned = false, acquiring = null, releaseLock = null, room = null, draft = null, fault = '';
  const LEASE_KEY='xtrata.parallax.layr.lease.v1',LEASE_MS=60000;
  let leaseDB=null,leaseToken=null,leaseTimer=null,leaseFallback=false;
  const metadata = new WeakMap(), listeners = new Set();
  const copy = value => JSON.parse(JSON.stringify(value));
  function amount(value) {
    if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(Math.round(value * 100))) throw Error('Invalid LAYR amount.');
    return Math.round(value * 100) / 100;
  }
  function read() {
    const raw = localStorage.getItem(KEY),legacy=raw===null?localStorage.getItem(LEGACY_KEY):null,r = raw ? JSON.parse(raw) : legacy ? JSON.parse(legacy) : {};
    if (!r || typeof r !== 'object' || Array.isArray(r)) throw Error('The shared LAYR account could not be read.');
    // Preserve an existing room balance; a new installation starts at zero.
    r.bank = typeof r.bank === 'number' ? amount(r.bank) : 0;
    r.layrGames = r.layrGames && typeof r.layrGames === 'object' && !Array.isArray(r.layrGames) ? r.layrGames : {};
    return r;
  }
  function ready(){
    if(!owned)return false;
    if(!leaseFallback)return true;
    try{const lease=JSON.parse(localStorage.getItem(LEASE_KEY)||'null');return !!lease&&lease.id===leaseToken&&lease.expires>Date.now()+5000;}catch(_){return false;}
  }
  function assertOwned() { if (!ready()) throw Error(fault || 'The LAYR account is active in another tab or its lease has paused. Reconnect before playing.'); }
  function publish() { for (const fn of listeners) { try { fn(); } catch (e) { console.warn('LAYR display could not refresh.', e); } } }
  function write(r) {
    assertOwned();
    r.bank = amount(r.bank); r.layrSchema = 1; r.layrMode = 'local';
    delete r.cashier; // The former STX faucet and unverified exchange receipts are retired.
    localStorage.setItem(KEY, JSON.stringify(r));
  }
  function balance() {
    try { return draft ? draft.bank : amount(room ? room.available() : read().bank); }
    catch (e) { fault = e.message; return 0; }
  }
  async function openLeaseDB(){
    if(leaseDB)return leaseDB;
    if(!window.indexedDB)throw Error('Shared LAYR storage is unavailable in this browser.');
    leaseDB=await new Promise((resolve,reject)=>{
      const request=indexedDB.open('xtrata-parallax-account-lock',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('leases');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    return leaseDB;
  }
  async function leaseOperation(release=false){
    const db=await openLeaseDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('leases','readwrite'),store=tx.objectStore('leases'),request=store.get(LOCK);let next=null,accepted=false;
      request.onsuccess=()=>{
        const current=request.result,now=Date.now();
        if(release){if(current?.id===leaseToken){store.delete(LOCK);accepted=true;}return;}
        // IndexedDB serializes simultaneous acquisition and renewal attempts.
        if(current&&current.id!==leaseToken&&current.expires>now)return;
        next={id:leaseToken,expires:now+LEASE_MS};store.put(next,LOCK);accepted=true;
      };
      tx.oncomplete=()=>{
        if(accepted){
          try{
            if(release){const mirror=JSON.parse(localStorage.getItem(LEASE_KEY)||'null');if(mirror?.id===leaseToken)localStorage.removeItem(LEASE_KEY);}
            else localStorage.setItem(LEASE_KEY,JSON.stringify(next));
          }catch(e){reject(e);return;}
        }
        resolve(accepted);
      };
      tx.onerror=tx.onabort=()=>reject(tx.error||Error('LAYR account lock failed.'));
    });
  }
  async function acquireFallback(){
    try{
      read();leaseFallback=true;
      if(!leaseToken)leaseToken=Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('-');
      if(!await leaseOperation()){fault='The LAYR account is active in another tab. Close it, then reload or reconnect.';return false;}
      owned=true;
      if(!leaseTimer)leaseTimer=setInterval(()=>{
        if(!owned)return;
        leaseOperation().then(ok=>{if(!ok){owned=false;fault='The LAYR account moved to another tab. Reconnect before playing.';publish();}}).catch(e=>{owned=false;fault=e.message;publish();});
      },10000);
      publish();return true;
    }catch(e){fault=e.message;owned=false;return false;}
  }
  async function acquire() {
    if (ready()) return true;
    if (acquiring) return acquiring;
    fault = '';
    if(!navigator.locks){acquiring=acquireFallback().finally(()=>{acquiring=null;});return acquiring;}
    acquiring = new Promise(resolve => {
      navigator.locks.request(LOCK, { ifAvailable: true }, async lock => {
        if (!lock) { fault = 'The LAYR account is active in another tab. Close it, then reload or reconnect.'; resolve(false); return; }
        try { read(); } catch (e) { fault = e.message; resolve(false); return; }
        owned = true;
        const held = new Promise(done => { releaseLock = done; });
        resolve(true); publish(); await held;
        owned = false; releaseLock = null;
      }).catch(e => { fault = e.message; resolve(false); });
    }).finally(() => { acquiring = null; });
    return acquiring;
  }
  function serialize(state) {
    const saved = copy(state);
    for (const key of ['balance', 'cashouts', 'previewPaid', 'freePreview']) delete saved[key];
    return saved;
  }
  function attach(state, id, revision = 0) {
    delete state.balance;
    Object.defineProperty(state, 'balance', { configurable: true, enumerable: false,
      get: balance,
      set(value) {
        if (!draft || draft.state !== state) throw Error('Only a committed game action can change the shared LAYR balance.');
        draft.bank = amount(value);
      }
    });
    metadata.set(state, { id, revision });
    return state;
  }
  function commitState(state, r, nextBank) {
    const meta = metadata.get(state); if (!meta) throw Error('Machine is not linked to the LAYR account.');
    const previous = r.layrGames[meta.id];
    if ((previous?.revision || 0) !== meta.revision) throw Error('Machine state changed. Disconnect and reconnect before playing.');
    const revision = meta.revision + 1;
    r.layrGames[meta.id] = { revision, state: serialize(state) };
    r.bank = amount(nextBank + (room ? room.held() : 0));
    // Funds and the resulting pending/settled game state are one storage write.
    write(r); meta.revision = revision;
    if (room) { try { room.changed(nextBank); } catch (e) { console.warn('LAYR room display could not refresh.', e); } }
    publish();
  }
  function transact(state, fn) {
    assertOwned(); if (draft) throw Error('A LAYR transaction is already running.');
    const before = serialize(state), r = read();
    draft = { state, bank: balance() };
    try {
      const result = fn(), next = draft.bank;
      draft = null;
      commitState(state, r, next);
      return result;
    } catch (e) {
      draft = null;
      for (const key of Object.keys(state)) delete state[key];
      Object.assign(state, before);
      throw e;
    }
  }
  function saveGame(state) {
    if (!ready()) return false;
    if (draft) return true;
    commitState(state, read(), balance()); return true;
  }
  function machine(id, engine) {
    const api = { ...engine };
    api.fresh = () => attach(engine.fresh(), id);
    api.load = raw => attach(engine.load ? engine.load(raw) : { ...engine.fresh(), ...(raw || {}) }, id);
    for (const name of ['start', 'settle', 'pick', 'respin', 'collect', 'endFree', 'gamble']) {
      if (typeof engine[name] === 'function') api[name] = (state, ...args) => transact(state, () => engine[name](state, ...args));
    }
    return Object.freeze(api);
  }
  function openGame(id, engine) {
    const saved = read().layrGames[id], state = engine.load(saved?.state);
    return attach(state, id, saved?.revision || 0);
  }
  function saveRoom(values) {
    if (!ready()) return false;
    const r = read(); Object.assign(r, values); write(r); publish(); return true;
  }
  window.ParallaxLAYRAccount = Object.freeze({
    version: '1.0.0', mode: 'local', onChainConnected: false,
    acquire, ready, error: () => fault, balance, machine, openGame, saveGame, saveRoom,
    bindRoom(callbacks) { room = callbacks; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    roomState(){const r=read();return {bank:r.bank,hands:r.hands||0,net:r.net||0};},
    snapshot() { const r = read(); return { balance: balance(), currency: 'LAYR', mode: 'local', onChainConnected: false, available: ready(), games: Object.keys(r.layrGames) }; }
  });
  addEventListener('pagehide', () => { owned=false;if(releaseLock)releaseLock();if(leaseFallback){clearInterval(leaseTimer);leaseOperation(true).catch(()=>{});} });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&leaseFallback&&owned)leaseOperation().then(ok=>{if(!ok){owned=false;publish();}}).catch(()=>{owned=false;publish();});});
})();
```

## A.3 Compatibility guard, canvas stand-in and the Xtrata mark's vector code

`compat.js` goes in the game page straight after the account script. `canvasengine.js` is the stand-in renderer the room hands a cabinet that has no WebGL; it only has to exist as shown. `xlogo.js` draws the Xtrata mark as vector strokes (no image) onto any 2D canvas; the cabinet's lower door and the reel screen use it.

```js
(function(){
 'use strict';
 function show(title,detail){var l=document.getElementById('loading');if(!l||window.__bfReady)return;l.innerHTML='<div class="error-panel"><h2>'+title+'</h2><p>'+detail+'</p></div>';l.style.opacity=1;}
 var missing=[];
 try{new Function('var a={b:1};return a?.b??2;');}catch(e){missing.push('modern JavaScript (optional chaining)');}
 if(!(window.crypto&&crypto.getRandomValues))missing.push('secure random numbers');
 if(!(window.HTMLDialogElement&&HTMLDialogElement.prototype.showModal))missing.push('dialog windows');
 var c=document.createElement('canvas');if(!(c.getContext&&c.getContext('2d')))missing.push('canvas graphics');
 if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{value:function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return i<0||i>=this.length?undefined:this[i];},writable:true,configurable:true});
 var P=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
 if(P&&!P.roundRect)P.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(typeof r==='number'?r:(r&&r[0])||0,w/2,h/2));this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();};
 if(missing.length){window.__bfUnsupported=true;show('This browser is too old','Block Fortune needs '+missing.join(', ')+'. Please open it in an up-to-date Chrome, Edge, Firefox or Safari.');return;}
 window.addEventListener('error',function(e){show('Something went wrong','The machine could not start ('+(e&&e.message?String(e.message).slice(0,140):'unknown error')+'). Try reloading the page or another browser.');});
 window.addEventListener('unhandledrejection',function(e){show('Something went wrong','The machine could not start ('+String((e&&e.reason&&e.reason.message)||e.reason||'unknown error').slice(0,140)+').');});
})();
```

```js
class CasinoCanvasEngineRenderer{constructor(){this.domElement=document.createElement('canvas');this.software=true;this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>16};this.info={render:{calls:0,triangles:0}};}setPixelRatio(){}setSize(){}setClearColor(){}render(){}compileAsync(){return Promise.resolve();}}
```

```js
/* Xtrata logo, traced from the brand mark onto an 851-unit grid and drawn as vector strokes (no image data). */
const XLOGO = (() => {
  const M = 851, mirror = pts => pts.map(([x, y]) => [M - x, y]);
  const outer = [[31, 244], [229, 244], [405, 439], [227, 634], [31, 634], [100, 559], [196, 559], [304, 438], [197, 320], [100, 320]];
  const inner = [[120, 320], [197, 320], [304, 438], [196, 559], [120, 559], [221, 439]];
  return {
    white: [[[24, 70], [290, 70], [425.5, 218], [561, 70], [827, 70], [827, 186], [606, 186], [425.5, 382], [245, 186], [24, 186]]],
    whiteOpen: [[[24, 112], [273, 112], [425.5, 276], [578, 112], [827, 112]]],
    blue: [outer, inner, mirror(outer), mirror(inner)],
    orange: [[[24, 691], [250, 691], [425.5, 500], [601, 691], [827, 691], [827, 784], [563, 784], [425.5, 635], [288, 784], [24, 784]]],
    depth: [[[38, 192], [68, 238]], [[813, 192], [783, 238]], [[38, 683], [68, 640]], [[813, 683], [783, 640]]]
  };
})();
function xtrataLogo(g, cx, cy, size) {
  const s = size / 851; g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(s, s); g.lineJoin = 'miter'; g.miterLimit = 6; g.lineCap = 'butt';
  const path = (pts, closed) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (closed) g.closePath(); };
  const metal = (c1, c2, c3, y0, y1) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c1); gr.addColorStop(.5, c2); gr.addColorStop(1, c3); return gr; };
  g.lineWidth = 6; g.strokeStyle = '#2b4a78aa'; XLOGO.depth.forEach(p => { path(p); g.stroke(); });
  const layers = [['blue', metal('#6593cf', '#4675b6', '#315c95', 240, 640)], ['orange', metal('#f2aa5a', '#e28c3b', '#c9762c', 495, 790)], ['white', metal('#ffffff', '#e2e3e1', '#b9bbb8', 64, 392)]];
  for (const [k, stroke] of layers) {
    g.shadowColor = '#000c'; g.shadowBlur = 10; g.shadowOffsetY = 5; g.lineWidth = 13; g.strokeStyle = stroke;
    XLOGO[k].forEach(p => { path(p, true); g.stroke(); });
    if (k === 'white') XLOGO.whiteOpen.forEach(p => { path(p); g.stroke(); });
    g.shadowColor = 'transparent'; g.lineWidth = 2; g.strokeStyle = '#ffffff33'; XLOGO[k].forEach(p => { path(p, true); g.stroke(); });
  }
  g.restore();
}
```

## A.4 How the game page is assembled, and the exact text the room patches

The game is one self-contained HTML file. Its scripts come in this order: the LAYR account script (A.2), the compatibility guard (A.3), the engine (A.1), the Xtrata mark (A.3), the machine's bundled art as one script that sets a global, then the machine's own game code. All art, sound and data are inlined as data URIs, so the page works offline.

The game draws its whole screen onto one 2D canvas of 2800×1920 pixels with a 2× transform (so the drawing space is 1400×960). That canvas is what the cabinet's `screenMesh` shows and what the host object returns as `screen`. The page works two ways: opened on its own it claims the account and plays in a page view (it detects this with `HOSTED`, true when it sits in a frame); inside the room or a test host it waits for the host to call `activate()`.

The room patches the page's text by exact match, so each of these must appear **exactly once**, in exactly this form (replace `my-slug` with the machine's id). The machine's build script must fail if any count is not one:

```text
1. the text  <script>/* One existing LAYR account            (the start of the account script, A.2)
2. a regular expression match of
   GAME_ID='my-slug', *LAYR=window\.ParallaxLAYRAccount, *E=LAYR\.machine\(GAME_ID,BF\)
   (always this plain form: not "E0=...; let E=E0" and not "E_REAL")
3. a regular expression match of
   const screen *= *canvas\(2800, *1920\), *sg *= *screen\.getContext\('2d'\); *sg\.setTransform\(2, *0, *0, *2, *0, *0\);
4. a regular expression match of   connect\(\s*ac\.destination\s*\)     (the Web Audio output)
5. the text  window.PX_CASINO_ENGINE={                       (the host object, A.5)
```

The room also looks for `#fbGo` (the main feature-bar button) and `[data-pick]` elements (pick-bonus choices) so that its non-player guests can play a machine.

## A.5 The host object `window.PX_CASINO_ENGINE`

This is the whole contract between a game and whatever hosts it (the room or a test page). It is DOG Army's, shown exactly, with the surrounding session code. Every machine provides the same members: `screen` (the 2800×1920 canvas), `revision()` (a number that changes whenever the screen has been redrawn), `mechanics()`, `activate()`, `deactivate()`, `action(name)`, `stopAuto()`, `tap(x, y)` (in the 1400×960 drawing space), `key(code, key)`, `closeModal()`, `click(token)`, `input(token, value, checked, event)`, `fullscreen(on)`, `fullscreenHost(fn)` (see A.6), `refreshAccount()`, `ui()` and `dev`.

`mechanics()` is how the cabinet moves in the room: `lever` is `{id, elapsed, duration, angle}` while the lever is being pulled (the id changes with each pull) and null otherwise; `buttons` is `{spin, betUp, betDown, auto, pays}` where each is 1 for about 150 ms after that control is used (a deck click, Space, the fullscreen bar, Auto) and 0 otherwise; `lights` is 0 to 1 excitement; `scene` names the current bonus and stage; `jackpot` is true during the jackpot scene. Machines may add more (DOG Army adds `tags`, the glow of its eight dog-tag rows). Without these the machine plays the same, but the caps and lever do not move in the room.

`action(name)` accepts at least `spin`, `betUp`, `betDown`, `auto`, `pays`, `settings`, `history`, `account`, `fairplay`, `skip`, `primary`, `lab`, `test`, `fullscreen`, `gamble`, `max`, `sound`, `turbo`, and the machine's own words (DOG Army adds `holder`, `moon`, `doom`). `action('lab')` is the one way the room opens the Bonus preview and Lab. `ui()` returns what the room needs to mirror the machine's state in its own interface (the HTML of any open modal and of the feature bar, with data-px-source tokens that `click` and `input` use to drive them).

```js
// Cached cabinets borrow the room's LAYR account; they never own a second wallet.
let pxSessionOwned=false,pxSessionEpoch=0,pxSessionPending=null;
function pxReleaseLease(){pxSessionEpoch++;pxSessionOwned=false;sessionLock=true;}
async function pxClaimSession(){
  if(pxSessionOwned&&LAYR.ready())return true;
  if(pxSessionPending)return pxSessionPending;
  const epoch=pxSessionEpoch;
  pxSessionPending=(async()=>{
    if(!await LAYR.acquire()||epoch!==pxSessionEpoch){sessionLock=true;update();status(LAYR.error()||'LAYR connection was cancelled.');return false;}
    sessionLock=false;state=LAYR.openGame(GAME_ID,E);resume();pxSessionOwned=true;return true;
  })().finally(()=>{pxSessionPending=null;});
  return pxSessionPending;
}

// A canvas-and-controls API. The casino owns all visible 3D rendering and cameras.
const pxSourceElements=new Map(),pxSourceTokens=new WeakMap();let pxToken=0;
function pxPort(element){if(!element)return '';for(const n of [element,...element.querySelectorAll('*')]){if(!pxSourceTokens.has(n)){const id=String(++pxToken);pxSourceTokens.set(n,id);pxSourceElements.set(id,n);}n.setAttribute('data-px-source',pxSourceTokens.get(n));}return element.outerHTML;}
function pxControl(action){
  const map={spin:spinClick,betDown:()=>changeBet(-1),betUp:()=>changeBet(1),auto:autoClick,pays:openRules,settings:openSettings,history:openHistory,account:openAccount,fairplay:openFairPlay,holder:openHolder,skip:skipScene,primary:primaryAction,lab:openLab,test:openTest,fullscreen:()=>setFullscreen(!fsOn),gamble:openGamble,moon:()=>scene?callGamble('moon'):openGamble(),doom:()=>scene?callGamble('doom'):openGamble(),max:()=>changeBet(0,true),
    sound:()=>$('sound').click(),turbo:()=>$('turbo').click()};
  (map[action]||(()=>{}))();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenRev,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // lever and spin button as the room expects; lights, tags and topper excitement are extras a host may use for the light show.
  // tags: eight numbers 0..1, the glow of the cabinet's px-tag0 (bottom) .. px-tag7 (top) rows: they step in time on wins, sweep during bonuses and all light on the jackpot.
  mechanics(){return {lever:leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:null,armZ:null,buttons:{spin:pressing('spin'),betUp:pressing('betUp'),betDown:pressing('betDown'),auto:pressing('auto'),pays:pressing('pays')},lights:excite,tags:tagGlow.slice(),scene:scene?scene.kind+':'+scene.stage:freeMode?'free:play':'',jackpot:!!(scene&&scene.kind==='jackpot')};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;animate.last=performance.now();screenDirty=true;update();drawScreen(performance.now());},
  deactivate(){if(spinning)return false;stopAuto();if(fsOn)setFullscreen(false);clearTimeout(freeTimer);music(false);if(labRun)endLab();if(pxEngineActive)save();pxEngineActive=false;if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name){if(pxEngineActive)pxControl(name);},
  stopAuto(){stopAuto();},
  tap(x,y){screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  fullscreen(on){setFullscreen(on===undefined?!fsOn:!!on);return fsOn;},
  dev:DEV,
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'MARCH',spinDisabled:$('spin').disabled,betDownDisabled:$('minus').disabled,betUpDisabled:$('plus').disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,lab:!!labRun,scene:scene?scene.kind+':'+scene.stage:'',modal:modal?.open&&!fsOn?pxPort(modal):'',feature:bar&&!bar.hidden&&!fsOn?pxPort(bar):''};}
};
// Opened on its own (not inside a casino or test host), the page claims the account and plays in page view.
if(!HOSTED){window.PX_CASINO_ENGINE.activate().catch(e=>toast(e.message));}
```

`pxPort`, `pxControl` and the session functions above are shown in full. `spinClick`, `changeBet`, `autoClick`, `openRules`, `openSettings`, `openHistory`, `openAccount`, `openFairPlay`, `openHolder`, `skipScene`, `primaryAction`, `openLab`, `openTest`, `setFullscreen`, `openGamble`, `callGamble`, `screenTap`, `drawScreen`, `update`, `save`, `resume`, `stopAuto`, `music` and the variables around them are the machine's own code. `pxEngineActive` gates everything so a cached cabinet does nothing until activated, and `deactivate()` returns false while a spin is running.

## A.6 Fullscreen: `fullscreenHost`

The game owns the fullscreen layout (the screen fills the view; one bar along the bottom carries every control except the lever, labelled with the machine's own deck words and the plain action in small type; every panel opens inside it). The browser only grants fullscreen to the page that received the click, so the room does the browser part and the game does the layout. The game side (Hot Wallet's, with its own button list as an example; use your own labels and actions):

```js
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'TIME TRAVEL', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['hot', 'HOT', 'call hot', 'fb gold'], ['cold', 'COLD', 'call cold', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'HOT OR COLD?', 'gamble win', 'fb gold'], ['collect', 'COLLECT', 'take the prize', 'fb gold'],
  ['betDown', '−YEARS', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+YEARS', 'bet up', 'fb'], ['max', 'MAX YEARS', 'max bet', 'fb'], ['auto', 'AUTO-TOUR', 'auto', 'fb'],
  ['pays', 'GUIDE', 'pays & rules', 'fb'], ['exhibits', 'EXHIBITS', 'every tile, sourced', 'fb'], ['timeline', 'TIMELINE', '2011 to 2026', 'fb'], ['lessons', 'LESSONS', 'and words', 'fb'], ['pot', 'POT', 'cold storage pot', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'LOG', 'rounds', 'fb'],
  ['account', 'ACCOUNT', 'LAYR account', 'fb'], ['settings', 'SETTINGS', 'make it yours', 'fb'], ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), hot: () => callGamble('hot'), cold: () => callGamble('cold'), keep: () => keepWin(), gamble: () => openGamble(), collect: () => { const f = feature(); if (scene && f && E.featureDone(f)) collectScene(); }, betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), exhibits: () => openCollections(), timeline: () => openTimeline(), lessons: () => openLessons(), pot: () => openHolders(), account: () => openAccount(), settings: () => openSettings(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => openLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 7).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(7).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free, f = feature();
  q('primary').querySelector('b').textContent = spinning ? 'TRAVELLING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('hot', gambleIntro); show('cold', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0); show('collect', !!(scene && scene.stage === 'play' && f && E.featureDone(f)));
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance); q('balance').querySelector('small').textContent = lab ? 'LAB balance' : 'LAYR balance';
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-TOUR';
  q('turbo').setAttribute('aria-pressed', String(!!state.turbo)); q('sound').querySelector('b').textContent = state.muted ? 'SOUND OFF' : 'SOUND'; q('volume').querySelector('input').value = state.volume; show('test', TEST_OK); show('lab', LAB_OK); q('lab').setAttribute('aria-pressed', String(!!lab));
}
function fitFs() { if (!fsOn) return; const st = $('fsStage'), w = st.clientWidth - 16, h = st.clientHeight - 16, k = Math.max(.1, Math.min(w / 1400, h / 960)); screen.style.width = `${Math.floor(1400 * k)}px`; screen.style.height = `${Math.floor(960 * k)}px`; }
// Show or hide the fullscreen layout. Hosts call this through PX_CASINO_ENGINE.fullscreen(on) once they have made the frame visible.
function setFullscreenLayout(on) { fsOn = !!on; $('fs').hidden = !fsOn; document.body.classList.toggle('fs-on', fsOn);
  if (fsOn) { $('fsStage').appendChild(screen); fitFs(); updateFsBar(); } else if (screen.parentNode) screen.remove(); screenDirty = true; return fsOn; }
async function requestFullscreen(on) { if (fsHost) { fsHost(!!on); return; }
  if (on) { setFullscreenLayout(true); fsSelf = true; try { if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) { /* the fixed full-viewport layer stays as the fallback */ } }
  else { fsSelf = false; try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) {} setFullscreenLayout(false); } }
document.addEventListener('fullscreenchange', () => { if (fsSelf && !document.fullscreenElement) { fsSelf = false; setFullscreenLayout(false); } fitFs(); });
addEventListener('resize', fitFs);
```

The members the host object exposes for it:

```js
  fullscreen(on){return setFullscreenLayout(on);},
  fullscreenHost(fn){fsHost=typeof fn==='function'?fn:null;},
```

The room's side: once it has the engine it registers a host; its Full screen button then calls `enterMachineFullscreen`. Without a registered host the game fullscreens its own document, falling back to a fixed full-viewport layer where the Fullscreen API is missing (iPhone Safari). The logic frame needs `allow="fullscreen"`. The game's own Exit button, the F key and Esc call the registered host.

```js
// once, after createCasinoEngine(type) has the engine:
engine.api.fullscreenHost(on => on ? enterMachineFullscreen(engine) : exitMachineFullscreen(engine));
// the room's Full screen button (pxMachineFullscreen) calls enterMachineFullscreen(engine):
async function enterMachineFullscreen(engine){const f=engine.frame;f.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;border:0;background:#000';f.removeAttribute('aria-hidden');
  try{await f.requestFullscreen({navigationUI:'hide'});}catch(e){/* fixed full-viewport fallback (iPhone Safari) */}
  engine.api.fullscreen(true);f.focus();}
async function exitMachineFullscreen(engine){const f=engine.frame;try{if(document.fullscreenElement)await document.exitFullscreen();}catch(e){}
  engine.api.fullscreen(false);f.style.cssText='';f.setAttribute('aria-hidden','true');}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)/* for the active engine */exitMachineFullscreen(getActiveEngine());});
```

## A.7 The packed cabinet model

A cabinet is a tree of nodes plus shared lists, serialized as JSON and gzip+base64'd into the pack. It is built with Three.js r128 (a subset build: no `ConeGeometry`, no `FrontSide`). The room scales every cabinet to 2.6 m tall, stands it on the floor, and finds parts by name.

**Format.** `{ root, geometries, materials, textures }`. A node is `{ p:[x,y,z], q:[x,y,z,w], s:[x,y,z], visible, role, children:[...] }`; a mesh node adds `g` (an index into `geometries`), `m` (an index, or an array of indexes, into `materials`) and, for a deck button, `action` (a string). A geometry is `{ attributes: { position, normal, uv }, index?, groups? }` where each attribute is `{ size, array }`, `index` is an array of vertex indexes and a group is `{ start, count, materialIndex }`. A material is `{ type: 'standard' | 'basic', color, roughness, metalness, transparent, opacity, side, depthWrite, alphaTest, flatShading, map, emissive, emissiveIntensity }` (colours as integers, `map` an index into `textures` or null). A texture is `{ image (a data URL), wrapS, wrapT, repeat:[x,y], offset:[x,y], flipY }`. The serializer, exactly:

```js
function packCabinet(THREE, root) {
  const geos = [], gIdx = new Map(), mats = [], mIdx = new Map(), texs = [], tIdx = new Map();
  const R = v => Math.round(v * 1e5) / 1e5, R4 = v => Math.round(v * 1e4) / 1e4, R3 = v => Math.round(v * 1e3) / 1e3;
  const colorInt = c => c ? c.getHex() : 0;
  function texture(t) { if (!t) return null; if (tIdx.has(t.uuid)) return tIdx.get(t.uuid); const img = t.image, opaque = t.userData && t.userData.opaque, q = (t.userData && t.userData.q) || .9; const data = img.toDataURL ? img.toDataURL(opaque ? 'image/jpeg' : 'image/png', q) : img.src; texs.push({ image: data, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); tIdx.set(t.uuid, texs.length - 1); return texs.length - 1; }
  function material(m) { if (mIdx.has(m.uuid)) return mIdx.get(m.uuid); const basic = m.isMeshBasicMaterial; mats.push({ type: basic ? 'basic' : 'standard', color: colorInt(m.color), roughness: basic ? 1 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texture(m.map), emissive: basic ? 0 : colorInt(m.emissive), emissiveIntensity: basic ? 1 : m.emissiveIntensity }); mIdx.set(m.uuid, mats.length - 1); return mats.length - 1; }
  function geometry(g) { if (gIdx.has(g.uuid)) return gIdx.get(g.uuid); const out = { attributes: {} }; for (const k of ['position', 'normal', 'uv']) { const a = g.attributes[k]; if (a) out.attributes[k] = { size: a.itemSize, array: Array.from(a.array, k === 'normal' ? R3 : R4) }; } if (g.index) out.index = Array.from(g.index.array); if (g.groups && g.groups.length) out.groups = g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex })); geos.push(out); gIdx.set(g.uuid, geos.length - 1); return geos.length - 1; }
  function node(o) { const n = { p: o.position.toArray().map(R), q: o.quaternion.toArray().map(R), s: o.scale.toArray().map(R), visible: o.visible, role: (o.userData && o.userData.role) || '', children: [] }; if (o.isMesh) { n.g = geometry(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(material) : material(o.material); } if (o.userData && typeof o.userData.action === 'string') n.action = o.userData.action; o.children.forEach(c => n.children.push(node(c))); return n; }
  return { root: node(root), geometries: geos, materials: mats, textures: texs };
}
```

**The loader** the test host (and the room) uses to turn it back into Three.js objects. A node with a `role` is named `px-<role>`, and a node with an `action` gets `userData.pxMachineAction`:

```js
function packedCabinet(data){
  const geos=data.geometries.map(g=>{const out=new THREE.BufferGeometry();for(const [key,a] of Object.entries(g.attributes))out.setAttribute(key,new THREE.BufferAttribute(new Float32Array(a.array),a.size));if(g.index)out.setIndex(g.index);for(const group of g.groups||[])out.addGroup(group.start,group.count,group.materialIndex);out.computeBoundingSphere();return out;});
  const textures=data.textures.map((t,i)=>{const out=new THREE.Texture(data.images[i]);out.wrapS=t.wrapS;out.wrapT=t.wrapT;out.repeat.fromArray(t.repeat);out.offset.fromArray(t.offset);out.flipY=t.flipY;out.anisotropy=16;out.needsUpdate=true;return out;});
  const mats=data.materials.map(m=>{const props={color:m.color,map:m.map==null?null:textures[m.map],transparent:m.transparent,opacity:m.opacity,side:m.side,depthWrite:m.depthWrite,alphaTest:m.alphaTest};if(m.type==='basic')return new THREE.MeshBasicMaterial(props);return new THREE.MeshStandardMaterial(Object.assign(props,{roughness:m.roughness,metalness:m.metalness,emissive:m.emissive,emissiveIntensity:m.emissiveIntensity,flatShading:m.flatShading,envMap:envTex,envMapIntensity:.65}));});
  function node(n){const out=n.g==null?new THREE.Group():new THREE.Mesh(geos[n.g],Array.isArray(n.m)?n.m.map(id=>mats[id]):mats[n.m]);out.position.fromArray(n.p);out.quaternion.fromArray(n.q);out.scale.fromArray(n.s);out.visible=n.visible;if(n.role)out.name='px-'+n.role;if(n.action)out.userData.pxMachineAction=n.action;out.castShadow=!!out.isMesh;out.receiveShadow=!!out.isMesh;n.children.forEach(c=>out.add(node(c)));return out;}
  const out=node(data.root);out.updateMatrixWorld(true);return out;
}
// The room scales every cabinet to 2.6 m tall and stands it on the floor.
const model = packedCabinet(data), bb = new THREE.Box3().setFromObject(model), size = bb.getSize(new THREE.Vector3()), k = 2.6 / size.y;
model.scale.multiplyScalar(k); model.position.y -= bb.min.y * k; const cabinet = new THREE.Group(); cabinet.add(model); scene.add(cabinet);
```

**Required parts.** Roles: `screenMesh` (the plane that shows the game canvas), `crest` (the topper, turning on its own clock), `spinPhysical` (the big spin button), `lever` (the arm, pivoting about its own origin so rotating it about x pulls it down), and for the deck caps `btn-<action>` (the cap) and `btnface-<action>` (its label) for each of `spin`, `betUp`, `betDown`, `auto`, `pays`. Deck button meshes carry `action` set to exactly one of `spin`, `betUp`, `betDown`, `auto`, `pays`. A machine may add its own roles (DOG Army adds `tag0` to `tag7`, rows of lights with their own cloned emissive materials). The cabinet model must be about 2.6 m tall once scaled, with the screen facing +z.

**Colour pipeline.** The room renders with Three r128, ACES tone mapping at exposure 1.15 and linear output (no sRGB encoding). Preview with the same settings or the colours look washed out. `updateMatrixWorld(true)` before measuring with `Box3`.

## A.8 Screen view solver, deck-cap spring and lever curve

These are the standard from DOG Army (the test page's copy; the room does the same). The top and bottom bars in the solver are the test page's own elements (`#topbar`, `#hud`, `#hint`), so name them whatever your page calls its top bar and its controls strip.

**Finding the deck and animating the topper** (the model has been scaled and stood on the floor first):

```js
const animations = []; for (const role of ['crest', 'recordGroup', 'core', 'lever', 'spinPhysical', 'armPivot']) { const o = model.getObjectByName('px-' + role); if (o) animations.push({ o, role, base: o.rotation.clone(), homePosition: o.position.clone() }); }
```

**Deck caps on a spring.** Each cap and its label sink along the deck's own z axis; held by the pointer or pulsed by `mechanics().buttons`; released with a small rebound:

```js
// Deck buttons: each cap (and its label) sits on a spring and moves along the deck's own z axis (out of the panel face).
// Held down by the pointer, or pulsed for a moment by the game itself (Space, the fullscreen bar, Bet +/-); released with a small rebound.
const caps = {}, heldAction = { a: null };
model.traverse(o => { const m = /^px-(btn|btnface)-(\w+)$/.exec(o.name || ''); if (m) (caps[m[2]] = caps[m[2]] || { parts: [], x: 0, v: 0, hold: false, depth: .034 }).parts.push({ o, z0: o.position.z }); });
{ const sp = animations.find(a => a.role === 'spinPhysical'); if (sp) caps.spin = { parts: [{ o: sp.o, z0: sp.o.position.z }], x: 0, v: 0, hold: false, depth: .05 }; }
function stepCaps(dt, mech) { let moving = false; const b = mech.buttons || {};
  for (const k in caps) { const c = caps[k], target = (c.hold || b[k]) ? 1 : 0, w = target ? 62 : 36, z = target ? 1 : .36; let x = c.x, v = c.v; const n = Math.max(4, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) { v += (-w * w * (x - target) - 2 * z * w * v) * h; x += v * h; }
    c.x = Math.max(-.14, Math.min(1.03, x)); c.v = v; if (Math.abs(c.x - target) > .002 || Math.abs(v) > .02) moving = true; else { c.x = target; c.v = 0; }
    for (const p of c.parts) p.o.position.z = p.z0 - c.x * c.depth; }
  return moving; }
```

**The lever.** A hand pulls it down (ease in and out), it rests against the bottom stop, then springs back and bounces once off the top stop. `s` is seconds since the pull began (0 to 0.9); the result is 0 to 1, multiplied by `mechanics().lever.angle`:

```js
// The lever: a hand pulls it down (ease in and out), it rests against the bottom stop, then springs back and bounces once off the top stop.
function leverCurve(s) { if (s < .26) { const u = s / .26; return u * u * (3 - 2 * u); } if (s < .38) return 1 + .02 * Math.sin((s - .26) * 70) * Math.exp(-(s - .26) * 12);
```

**How the frame loop applies them** (`mech` is `api.mechanics()`; the lever's `id` changing starts a new pull):

```js
function frameLoop(now) {
  requestAnimationFrame(frameLoop);
  const rev = api.revision(); if (rev !== revision) { revision = rev; texture.needsUpdate = true; if (!webglOK) $('fallback2d').getContext('2d').drawImage(api.screen, 0, 0, 1400, 960); }
  const mech = api.mechanics(), t = now / 1000;
  if (mech.lever && mech.lever.id !== lastLever) { lastLever = mech.lever.id; leverPull = { start: now - mech.lever.elapsed, duration: mech.lever.duration, angle: mech.lever.angle }; }
  const kick = mech.lights || 0, capsMoving = stepCaps(Math.min(.12, Math.max(.001, (now - (frameLoop.last || now)) / 1000)), mech); frameLoop.last = now;
  for (const a of animations) {
    if (a.role === 'lever') { const u = leverPull ? Math.max(0, Math.min(1, (now - leverPull.start) / leverPull.duration)) : 1; a.o.rotation.x = a.base.x + (leverPull && u < 1 ? leverCurve(u * leverPull.duration / 1000) * leverPull.angle : 0); if (u >= 1) leverPull = null; }
    else if (a.role === 'spinPhysical') { /* moved by the button spring below */ }
    else a.o.rotation.y = a.base.y + t * (.4 + kick * 1.6);   // the crest turns on its own clock, faster when the machine is excited
  }
```

**Screen view.** Straight on at a pitch of 0.16 (`SV_PITCH`), slightly above, because a lower angle shows the underside of the marquee over the top of the screen. It is solved numerically with a 40-iteration bisection at the start and on every resize, so that the top of the screen sits 10 px under the top bar, the front bottom edge of the deck sits on the top of the controls strip, and the sides keep a 4% margin. The deck is every `pxMachineAction` mesh plus `spinPhysical`; the lever is left out. If the cabinet has a bezel or lintel above the glass, give the top edge an allowance (0.45 for Club X, 0.3 for The Halving, in model units). `screenBox` is the world-space `Box3` of `screenMesh`.

```js
// Screen view: straight on, zoomed so the top of the screen sits under the top bar and the deck buttons sit on the bottom edge
// of the view (just above the controls), with nothing of the cabinet showing below them.
const deckBox = new THREE.Box3(); model.traverse(o => { if (o.isMesh && (o.userData.pxMachineAction || /spinPhysical/.test(o.name) || (o.parent && (o.parent.userData.pxMachineAction || /spinPhysical/.test(o.parent.name))))) deckBox.expandByObject(o); });
function fitDist(cab) { const a = innerWidth / innerHeight; return a < .75 ? 9.2 : a < 1.1 ? 7.4 : 6.2; }
// Solved numerically with a test camera: a player's-eye view from slightly above, looking down over the deck.
const SV_PITCH = .16, svCam = new THREE.PerspectiveCamera();
function svProject(p, ty, dist, tx, tz) { const cp = Math.cos(SV_PITCH); svCam.position.set(tx, ty + Math.sin(SV_PITCH) * dist, tz + dist * cp); svCam.lookAt(tx, ty, tz); svCam.updateMatrixWorld(); return p.clone().project(svCam); }
function screenGoal() {
  const H = innerHeight, W = innerWidth; svCam.fov = camera.fov; svCam.aspect = W / H; svCam.near = camera.near; svCam.far = camera.far; svCam.updateProjectionMatrix();
  const topPx = Math.max($('topbar').getBoundingClientRect().bottom, $('hint').offsetParent ? $('hint').getBoundingClientRect().bottom : 0) + 10, botPx = $('hud').getBoundingClientRect().top;
  const nT = 1 - 2 * topPx / H, nB = 1 - 2 * botPx / H, tx = (screenBox.min.x + screenBox.max.x) / 2, tz = screenBox.getCenter(new THREE.Vector3()).z;
  const topP = new THREE.Vector3(tx, screenBox.max.y, screenBox.max.z), botP = new THREE.Vector3(tx, deckBox.min.y, deckBox.max.z);
  const halfW = Math.max(screenBox.max.x - screenBox.min.x, deckBox.max.x - deckBox.min.x) / 2 * 1.04, sideP = new THREE.Vector3(tx + halfW, (deckBox.min.y + screenBox.max.y) / 2, Math.max(screenBox.max.z, deckBox.max.z));
  const tyFor = dist => { let lo = -5, hi = 10; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (svProject(botP, m, dist, tx, tz).y > nB) lo = m; else hi = m; } return (lo + hi) / 2; };   // the deck's front bottom edge on the bottom line
  let lo = .3, hi = 30;
  for (let i = 0; i < 40; i++) { const d = (lo + hi) / 2, ty = tyFor(d), fitsTop = svProject(topP, ty, d, tx, tz).y <= nT, fitsSide = svProject(sideP, ty, d, tx, tz).x <= .98; if (fitsTop && fitsSide) hi = d; else lo = d; }
  const dist = hi; return { target: new THREE.Vector3(tx, tyFor(dist), tz), dist, pitch: SV_PITCH };
}
function setView(v) { view = v; document.body.classList.toggle('sv', v === 'screen'); $('vCab').setAttribute('aria-pressed', String(v === 'cabinet')); $('vScr').setAttribute('aria-pressed', String(v === 'screen')); if (v === 'screen') { const sgoal = screenGoal(); goal.yaw = 0; goal.pitch = sgoal.pitch; goal.dist = sgoal.dist; goal.target.copy(sgoal.target); } else { goal.yaw = .3; goal.pitch = .12; goal.dist = fitDist(true); goal.target.set(0, 1.45, 0); } }
```

## A.9 The pack entry (`pack.json`)

One object in the same format as every machine in the room's `window.PX_MACHINE_PACKS` list: `{ name, description, color, accent, model, game, css }`. `model` is the cabinet JSON (A.7) and `game` is the whole game page (A.4), each gzip (level 9) then base64; `color` and `accent` are CSS hex colours; `css` is a string of any extra styles the room panel needs (may be empty). The build script round-trips it (decode, compare to the source page, parse the model, check the four model keys), checks the five patched texts of A.4 appear once each, and checks the model has every required part and the five deck actions of A.7. A machine's position in the list is its `type`. The room's machines panel gets one button per machine with `data-machine-type`, a colour pair, a title and a one-line subtitle, plus a floor glow colour and a floor position.

## A.10 The return simulator

Runs the engine as shipped, seeded, plays every bonus to completion, counts paid spins only and reports the return by part against 94.38%. Run it as `node rtp.mjs 5000000 20261102` from a folder where `../src/engine.js` is the engine file of A.1 (or change the path). Expect 94.38% within about 0.3%; two different seeds should straddle it. It exits non-zero when out of tolerance. Adapt the labels in the `frequency` object to the machine's own bonus names.

```js
// Seeded return-to-player check on the exact engine DOG Army ships (src/engine.js, the Block Fortune v2 engine).
//   node tools/rtp.mjs [spins=5000000] [seed=20261102]
// Plays every bonus to completion (Dog Tags flips three tags; prizes are independent so which three doesn't matter),
// counts paid spins only, and reports the return by part against the published 94.38%.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const BF = require(join(dirname(fileURLToPath(import.meta.url)), '../src/engine.js'));
const N = Number(process.argv[2] || 5e6), SEED = Number(process.argv[3] || 20261102);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED), rng = n => Math.floor(rnd() * n);
const st = BF.fresh(); st.balance = 1e15; st.bet = 100;
const parts = { lines: 0, scatters: 0, free: 0, pick: 0, hold: 0, jackpot: 0 }, trig = { free: 0, vault: 0, chain: 0, jackpot: 0 };
let paid = 0; const t0 = Date.now();
while (paid < N) {
  const freeSpin = st.free > 0; if (!freeSpin) paid++;
  BF.start(st, rng); const r = BF.settle(st);
  if (freeSpin) parts.free += r.total - r.jackpotWin;
  else { parts.lines += r.lineTotal; parts.scatters += r.scatterPay; if (r.triggers.free) trig.free++; if (r.triggers.vault) trig.vault++; if (r.triggers.chain) trig.chain++; }
  parts.jackpot += r.jackpotWin; if (r.jackpotWin) trig.jackpot++;
  // Bonuses landed during free spins count towards free spins, as in the published breakdown.
  while (st.features.length) { const f = BF.feature(st), inFree = f.free; if (f.type === 'vault') { BF.pick(st, 0); BF.pick(st, 1); BF.pick(st, 2); } else while (BF.respin(st)); const c = BF.collect(st), base = c.amount - c.jackpotWin; if (inFree) parts.free += base; else if (c.type === 'vault') parts.pick += base; else parts.hold += base; parts.jackpot += c.jackpotWin; if (c.jackpotWin) trig.jackpot++; }
  if (st.freeActive && !st.free) BF.endFree(st);
  st.history.length = 0; st.gamble = 0;
}
const pct = v => (v / st.wagered * 100).toFixed(3) + '%', rtp = st.paidOut / st.wagered * 100;
const out = { spins: N, seed: SEED, seconds: (Date.now() - t0) / 1000, rtp: +rtp.toFixed(4), target: 94.38, withinTolerance: Math.abs(rtp - 94.38) <= .3,
  parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, pct(v)])), published: { lines: '59.7%', scatters: '1.5%', free: '8.5%', pick: '11.9%', hold: '10.3%', jackpot: '2.4%' },
  frequency: { airdrop: `1 in ${(N / trig.free).toFixed(1)}`, dogTags: `1 in ${(N / trig.vault).toFixed(1)}`, march: `1 in ${(N / trig.chain).toFixed(1)}`, jackpots: trig.jackpot } };
console.log(JSON.stringify(out, null, 2));
if (!out.withinTolerance) process.exit(1);
```

## A.11 The check recipes

Write these with Playwright (headless Chromium with software rendering is fine) against a local static server, and keep every result in a results folder.

- **Five-size screen-view test, pass or fail.** For each of 1440×900, 1366×768, 1024×768, 390×844 and 844×390: open the test page, switch to the screen view, wait for the camera to settle, then assert from the page (expose a function that projects `screenBox`'s top edge and each deck button's box to pixels): the top of the screen is below the top bar, every deck button's box is inside the window and above the controls strip, and clicking each deck button (by its projected centre) fires its action. Screenshot each size.
- **Touch targets and scrolling.** At 390×844 (mobile emulation, touch, device scale 2): list every visible button with its width and height and fail if any is under 44 px; fail if `document.documentElement.scrollWidth > innerWidth + 1`. Repeat at 1440×900.
- **Deck check.** Bet up goes 100 to 200 and back, the deck labels read the machine's own names in order, and the spin cap starts a spin.
- **Lab, every item.** Run each item of the Lab through all four stages, taking a screenshot at each stage; then Run all. Re-read the scene after every screenshot and finish any real bonus before starting a Lab item.
- **Skip totals.** For free spins, the hold-and-respin bonus and the full-grid run, play it out and record the total; run the same seed with Skip and require the same total (DOG Army's were 1,600, 1,340 and 54,302).
- **Reduced motion.** With reduced motion on, count particles through a whole jackpot: at most 3.
- **Reload mid-spin.** Reload during a spin: it settles once, with the same round id, and the balance changes once.
- **Lab isolation.** Record balance, the five jackpot meters, the fund and the spin count; run Lab items and the preview; require them unchanged.
- **Fullscreen session.** At 1366×900 and at 390×844 with touch: enter fullscreen, then using only the bottom bar spin, change the bet, start and stop Auto, toggle Turbo and Sound, open and close every panel (pays, fair play, history, fund, settings, lab and test where available), play the gamble and every bonus, then exit. Record each step.
- **Software rendering note.** Headless Chromium can mis-composite a fully opaque fixed bar over WebGL; use a near-opaque colour. Say in the results that the checks ran in software rendering and that a real-GPU pass in Safari and Chrome is owed.
