# Adding Hot Wallet to the casino (not done yet)

Nothing in `public/casino/` was changed for this machine. These are the steps for whoever places it on the floor, written
against `public/casino/index.html` as it stood on 2 Nov 2026. Other machines are being built at the same time, so re-read
the file before editing: the pack's index (its `type`) is wherever it lands in `PX_MACHINE_PACKS`, and every list below is
ordered by that index.
Machine id for Hot Wallet everywhere below: `hw`; game id `hot-wallet`.

## 1. The pack

Append the contents of `pack.json` as one more entry of `window.PX_MACHINE_PACKS` (the
`<script>window.PX_MACHINE_PACKS=[…];</script>` line). It has exactly the existing keys: `name` (`Hot Wallet`),
`description` (`The Heist Museum · real exchange hacks, 2011 to 2026`), `color` (`#1a0d0a`), `accent` (`#e11d48`), `model`,
`game`, `css`. Append it as text rather than re-serialising the array, so the other machines' bytes stay identical. No change
to the game code is needed: it uses `window.parent.ParallaxLAYRAccount` and the canvas-and-controls API.
`tools/build.mjs` can read the casino file (`PX_CASINO_HTML=/path/to/casino/index.html node tools/build.mjs`), only to copy
the shared parts and check the engine hash; it never writes to it.

The cabinet model uses WebP data URLs for its transparent textures and JPEG for opaque ones. Both load through
`new Image()`; the casino's packed-cabinet loader already does that, and the test page proves it loads in Chromium.

## 2. Floor position

`buildSlots` puts every design at `zPositions[type]` on both side walls, so a new design needs wall spots of its own. I did
**not** verify a free spot against the room's `solids` list for this machine, so check the room again and pick two that are
free. The cabinet is about 1.36 m wide at the room's 2.6 m scale (3.07 × 6.10 × 1.73 model units), and the vault-door lever
sticks out on its right side (the player's left as they face it, local +x), so leave 0.5 m free there. Use the `extraSpots`
drop-in from the other machines' INTEGRATION.md files (keyed by pack name) with
`{'Hot Wallet':[{x:…,z:…,ry:…},{x:…,z:…,ry:…}]}`. Nothing about the walk-blocking `solids` code changes.

## 3. Roles the room animates

* `px-crest` (the topper) turns about Y on the room clock exactly like the other toppers: `rotation.y = base + t * speed`
  (faster while `mechanics().show` is set and its stage is not `outro`). Its child `px-crestWheel` is the brass vault wheel;
  turn it about its own z for the "vault opens" moment (the test page does this on a Heist of the Century trigger and on every
  lever strike, see `HW_STUDIO.openVault`).
* `px-beaconL` / `px-beaconR` are the red alarm beacons on the head corners. Each has its **own** `MeshBasicMaterial`,
  exported dim (`#6b1022`); lit colour `#ff2a4a`. Light them during bonus triggers and the jackpot (`mechanics().show`), and
  for about 260 ms on each lever strike. Alternate-flash them for the jackpot.
* `px-lever` (the vault-door lever). Its rest pose is `rotation.x = 0.28`, baked into the model. The pull is
  `rotation.x = base + sin(u*π) * 1.02` over 900 ms, where `base` is the rotation read at load. Do not reset it to 0. Click
  target: any mesh of the lever carries `userData.pxMachineAction = 'spin'` (`children[1]` is the T-grip). The strike is at
  u = 0.5, about 450 ms after `mechanics().lever` first appears.
* `px-spinPhysical` (the TIME TRAVEL button cap) slides along local z with `mechanics().spinZ`.
* `px-screenMesh` gets the game canvas as its map; `px-screenGlow` is the crimson ring round the glass and can be left as is
  or pulsed through `material.opacity`.
* Deck keys on the `deck` group carry their actions: `pays` = GUIDE, `betDown` = −YEARS, `betUp` = +YEARS, `auto` = AUTO-TOUR,
  `spin` = TIME TRAVEL. `index.html` in this folder is a working reference for all of it.

`mechanics()` returns `{lever, spinZ, armZ, pulse, potMsLeft, weekMs, show}`. `show` is `{kind, stage}` for the scene on screen
(`free`, `vault`, `chain`, `jackpot`, `gamble`; `trigger`, `intro`, `play`, `outro`), or `{kind:'free', stage:'play'}` during free
spins. `potMsLeft` and `weekMs` count down to the Cold Storage Pot's weekly boundary if the room wants a clock on the cabinet.

## 4. Lists ordered by pack index

* **Floor-glow colours** in `buildSlots`: append `0xe11d48`. If a neighbour already uses a red, use `0xff6b81`.
* **`MACH`** (presence, "other people in the room"): append `'hw'`. Also append `'hw'` to the floor map's `type` list.
* **Cabinet numbers.** `machineSpot`, `place()` and the spectator lookup number cabinets with
  `m.index < window.PX_MACHINE_PACKS.length ? 1 : 2`, which only works while every design has one cabinet per side wall.
  Number per design instead (same result for today's machines):
  ```js
  const cabNo = (m) => 1 + room.machines.filter((k) => k.type === m.type).indexOf(m);
  const machineSpot = (m) => MACH[m.type] + '.' + cabNo(m);
  // and in place() / the spectator find: String(cabNo(k)) === idx
  ```
* **Machines panel** (`#machinesPanel`): add
  `<button class="machine-choice" data-machine-type="<type>" style="--machine-color:#1a0d0a;--machine-accent:#e11d48"><b>Hot Wallet</b><small>The Heist Museum · real exchange hacks, 2011 to 2026</small><em>PLAY THE MACHINE ↗</em></button>`
  and update the machine and cabinet counts in the panel, the guide and the rules text.
* **Round log and spin cast** (`pxRlPatch` and `spectDocument`): optional, and **not applied by default**. `pxRlPatch` only knows
  five games (`the-drop`, `forever-twins`, `deep-strata`, `block-fortune`, `neon-vault`) and returns any other pack unchanged,
  so Hot Wallet simply has no round-log or spin-cast hook until someone adds it. To add it, add `'hot-wallet':'hw'` to the `ids`
  maps and widen the regex, because this game's engine line reads
  `GAME_ID='hot-wallet', LAYR=window.ParallaxLAYRAccount, E_REAL=LAYR.machine(GAME_ID,BF); let E=E_REAL;` (it keeps the real
  engine and a separate Lab engine side by side), so `E=LAYR` must become `E(?:_REAL)?=LAYR`. The Mempool Madness game has the
  same engine line.

## 5. Server lists (Cloudflare functions)

The room service only accepts known cabinet spots. Until these list `hw`, sitting at Hot Wallet is simply not shared
(the client already treats `no-such-spot` quietly):

* `functions/lib/casino-room.ts`: add `'hw.1', 'hw.2'` to the spots and `'hw'` to `MACHINE_IDS`;
* `functions/lib/casino-ingest.ts`: add `'hw'` to `GAME_MACHINES`;
* `functions/lib/casino-social.ts`: add `'hw'` to `GAMES`.

## 6. Fullscreen hand-over (`pxMachineFullscreen`)

The fullscreen layout belongs to the game: its screen fills the view with every control except the lever on a bottom bar
(TIME TRAVEL, SKIP, HOT / COLD / KEEP, HOT OR COLD?, COLLECT, −YEARS, the bet, +YEARS, MAX YEARS, AUTO-TOUR, GUIDE, EXHIBITS,
TIMELINE, LESSONS, POT, FAIR PLAY, TURBO, SOUND and volume, LOG, ACCOUNT, SETTINGS, the balance, LAB and TEST where allowed,
EXIT), and every panel opens inside it. The browser only grants fullscreen to the page that got the click, so the room does the
browser part and the game does the layout:

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

The logic iframe needs `allow="fullscreen"`. The game's own EXIT button, the F key and Esc call the registered host
(`PX_CASINO_ENGINE.fullscreenHost`). Without a registered host the game falls back to fullscreening its own document.
`index.html` in this folder does exactly this and is the reference.

## 7. The Bonus Lab and `?lab=1` (developer flag)

The Lab (pick any bonus or special event and play it now, on a separate balance) is always on the standalone test page.
In the casino it is hidden unless **both** hold: the room's address has `?lab=1`, **and** `LAYR.onChainConnected === false`
(the local, testnet LAYR account). On a production on-chain account the Lab never appears, whatever the address says. The game
decides this itself (`LAB_OK` in `src/game.js`) and exposes `PX_CASINO_ENGINE.labAvailable()`. The room can offer a LAB control
through `PX_CASINO_ENGINE.action('lab')`; the game's own fullscreen bar and the L key already do. Lab rounds run the real engine
on a separate lab state with a scripted random generator for the reel stops: they never touch the shared LAYR balance, the
jackpot meters, the Cold Storage Pot or the RTP figures, and are marked LAB in the log. Items: Time Machine, with a retrigger,
the full 16-year tour, The Empty Vaults, The Timeline, the full wall, Heist of the Century, Hot or Cold (a forced win and a
forced loss), and three, four and five Mt. Gox. No code needs adding to the casino for this; do not set
`PX_STANDALONE_TEST` there.

## 8. The Cold Storage Pot (holder layer, version 1)

The machine keeps a pot of 1% of every paid bet (never taken from a stake or a win; the house edge pays for it). Each week
(Monday 00:00 UTC) half of the finished week's pot is shared out per forevered twin and half goes to the Forever Fund. The panel
shows the pot, the time left in the week, and the share per twin when the twin count could be read (Forever Twins registry, a
checked read cached six hours; **unknown is shown as unknown, never as zero**). The meter lives in the player's saved game state
in this browser. Everything that needs a server or a contract is a named stub in `src/game.js` (`HolderRewards`: `snapshotPot`,
`claim`, `holderSpins`, `foreverFund`), each marked `TODO(holder-layer-v2)`:

* at each weekly boundary, read every forevered twin of every live collection and divide the twin half of the finished week's
  pot by the twin count, crediting each twin's current holder (an on-chain claim once LAYR is a token);
* the Forever Fund half needs a contract for the refund;
* the Cameo royalty needs NFT symbols on the reels, which this machine does not have (the reels are museum exhibits), so none is
  recorded.

## 9. What the room must provide (already true today)

* `window.ParallaxLAYRAccount` on the parent (the game never opens a second balance).
* The canvas-and-controls host: activate/deactivate, `screen` as a texture, `revision()`, `mechanics()` for the lever
  (`px-lever` rotation.x), TIME TRAVEL cap (`px-spinPhysical` z), the crest, the beacons.
* **Network.** The museum is bundled in the pack (`art/facts.js`, original tiles drawn in the game, BTC and ETH symbol files as
  data URIs), so the reels need no network and no live data. The frame makes only these calls, if the room sets a
  Content-Security-Policy, `connect-src` must allow them: `https://xtrata.xyz/forever-twins/data/registry.v2.json` and the Hiro
  read (`https://xtrata.xyz/hiro/mainnet`, fallback `https://api.hiro.so`) for the twin count, at most once every six hours.
  Without the network the pot shows the twin count as unknown.
* Test hooks (`HotWallet.test`, `HotWallet.lab`) exist only on local development hosts or when the parent sets
  `window.PX_STANDALONE_TEST = true`; the casino must never set that.

## 10. Content notes for whoever reviews the museum

* Company logos (the files Jim supplied, `art/logos/`, 16 of them) appear on the reels, Timeline clippings, panels and the cabinet's evidence bags. They are the companies' trademarks and none has given permission, so clear this before launch (`sources.json` lists them under `logosNeedingPermission`). The FBI and Justice Department seals were not used. BTC and ETH use the official symbol files in `art/coins/`; other coins
  (for example NEM) are shown as tickers in type. See `art/sources.json` for every source and `art/FACTS-NOTES.md` for what was
  checked, corrected against the brief, or could not be verified.
* The Binance October 2026 exhibit is shown **as reported, 2 November 2026**, attribution alleged. It is the jackpot symbol, so
  re-check its figures against `art/FACTS-NOTES.md` before launch and update `art/_gen_facts.py` if they have moved
  (`python3 -I art/_gen_facts.py && node tools/build-art.mjs && node tools/build.mjs`).
* The museum names no attackers and shows no faces. Each exhibit has one plain "how" line and a lesson, never instructions.
