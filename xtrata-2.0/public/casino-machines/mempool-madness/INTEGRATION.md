# Adding Mempool Madness to the casino (not done yet)

Nothing in `public/casino/` was changed for this machine. These are the steps for whoever places it on the floor, written
against `public/casino/index.html` as it stood on 1 Nov 2026. Other machines are being built at the same time (Rune Pit,
Ordinal Rush and more), so re-read the file before editing: the pack's index (its `type`) is wherever it lands in
`PX_MACHINE_PACKS`, and every list below is ordered by that index.
Machine id for Mempool Madness everywhere below: `mm`; game id `mempool-madness`.

## 1. The pack

Append the contents of `pack.json` as one more entry of `window.PX_MACHINE_PACKS` (the
`<script>window.PX_MACHINE_PACKS=[…];</script>` line). It has exactly the existing keys: `name` (`Mempool Madness`),
`description` (`Bitcoin mempool · live fee reels`), `color` (`#0b130f`), `accent` (`#14f195`), `model`, `game`, `css`.
Append it as text rather than re-serialising the array, so the other machines' bytes stay identical. No change to the game
code is needed: it uses `window.parent.ParallaxLAYRAccount` and the canvas-and-controls API. `tools/build.mjs` can read the
casino file (`PX_CASINO_HTML=/path/to/casino/index.html node tools/build.mjs`), only to copy the shared parts and check the
engine hash; it never writes to it.

The cabinet model uses WebP data URLs for its transparent textures and JPEG for opaque ones. Both load through
`new Image()`; the casino's packed-cabinet loader already does that, and the test page proves it loads in Chromium.

## 2. Floor position

`buildSlots` puts every design at `zPositions[type]` on both side walls, which is full once six designs are placed, so a
new design needs wall spots of its own. I did **not** verify a free spot against the room's `solids` list for this machine:
the two spots that were free on 1 Nov 2026 are the ones Rune Pit's own INTEGRATION.md already claims, so check the room again
and pick two that are free. The cabinet is 1.36 m wide at the room's 2.6 m scale (3.12 × 5.98 model units), and the launch
lever and its safety cover stick out on its right side (the player's left as they face it, local +x), so leave 0.5 m free
there. Use the `extraSpots` drop-in from Rune Pit's INTEGRATION.md (keyed by pack name) with
`{'Mempool Madness':[{x:…,z:…,ry:…},{x:…,z:…,ry:…}]}`. It already animates `core`, `lever` and `spinPhysical`; nothing about
the walk-blocking `solids` code changes.

## 3. Roles the room animates

* `px-core` (the topper: ten stacked translucent blocks, `px-coreBlock0` bottom, blue, to `px-coreBlock9` top, red) turns
  about Y on the room clock exactly where Ordinal Rush used `px-crest`: `rotation.y = base + t * speed` (faster while
  `mechanics().show` is set and its stage is not `outro`).
* **Counting blocks left.** `mechanics()` also returns `blocksLeft` (blocks until the Daily Pot's next 144-block payout) and
  `dayBlocks` (144). The topper counts them down: show the first `ceil(10 * blocksLeft / dayBlocks)` blocks and hide the
  rest (`px-coreBlock<i>.visible = i < n`). `index.html` (`coreBlocks`) is a working reference.
* `mechanics().pulse` is a counter that goes up every time a new Bitcoin block is seen. When it changes, flash the topper
  (the test page scales the blocks by up to 8% for 1.1 s).
* `px-lever` (the big red launch lever). Its rest pose is `rotation.x = 0.28`, baked into the model. The pull is
  `rotation.x = base + sin(u*π) * 1.02` over 900 ms, where `base` is the rotation read at load. Do not reset it to 0. Click
  target: any mesh of the lever carries `userData.pxMachineAction = 'spin'`.
* `px-safetyCover` is the flip-up cover over the lever grip. It is exported **open** (`rotation.x = -0.9`; closed is 0).
  The room may leave it open (that is how the test page shows it) or animate it closed → open at the start of a pull.
* `px-spinPhysical` (the BROADCAST button cap) slides along local z with `mechanics().spinZ`.
* `px-tickerL` / `px-tickerR` are the side tickers of real pending transaction ids. Scroll them by changing
  `material.map.offset.y` (the texture repeats, repeat y 0.5); a speed of about 0.02 per second reads well.
* **Launch sparks.** The pull ends at u = 0.5, about 450 ms after `mechanics().lever` first appears. Spawn 30 to 40 additive
  points at the world position of `px-sparkAnchor` (green pad at the end of the lever's travel): colours `#d9fff0 #14f195
  #7ee7b8`, velocity mostly +y with a spread in x/z, gravity, life 0.5 to 0.9 s, fading, plus a 120 ms green point light.
  `index.html` (`strikeSparks()`, `stepSparks()`) is a working reference using `THREE.Points`.
* `px-radarGlow` is a basic-material ring at the glass edge; it can be left as is.

## 4. Lists ordered by pack index

* **Floor-glow colours** in `buildSlots`: append `0x14f195`. If a neighbour already uses a green, use `0x7dffc8`.
* **`MACH`** (presence, "other people in the room"): append `'mm'`. Also append `'mm'` to the floor map's `type` list.
* **Cabinet numbers.** `machineSpot`, `place()` and the spectator lookup number cabinets with
  `m.index < window.PX_MACHINE_PACKS.length ? 1 : 2`, which only works while every design has one cabinet per side wall.
  Number per design instead (same result for today's machines):
  ```js
  const cabNo = (m) => 1 + room.machines.filter((k) => k.type === m.type).indexOf(m);
  const machineSpot = (m) => MACH[m.type] + '.' + cabNo(m);
  // and in place() / the spectator find: String(cabNo(k)) === idx
  ```
* **Machines panel** (`#machinesPanel`): add
  `<button class="machine-choice" data-machine-type="<type>" style="--machine-color:#0b130f;--machine-accent:#14f195"><b>Mempool Madness</b><small>Bitcoin mempool · live fee reels</small><em>PLAY THE MACHINE ↗</em></button>`
  and update the machine and cabinet counts in the panel, the guide and the rules text.
* **Round log and spin cast** (`pxRlPatch` and `spectDocument`): add `'mempool-madness':'mm'` to their `ids` maps. The game's
  engine line matches their regex (`GAME_ID='mempool-madness', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF)`).

## 5. Server lists (Cloudflare functions)

The room service only accepts known cabinet spots. Until these list `mm`, sitting at Mempool Madness is simply not shared
(the client already treats `no-such-spot` quietly):

* `functions/lib/casino-room.ts`: add `'mm.1', 'mm.2'` to the spots and `'mm'` to `MACHINE_IDS`;
* `functions/lib/casino-ingest.ts`: add `'mm'` to `GAME_MACHINES`;
* `functions/lib/casino-social.ts`: add `'mm'` to `GAMES`.

## 6. Fullscreen hand-over (`pxMachineFullscreen`)

The fullscreen layout belongs to the game: its screen fills the view with every control except the launch lever on a bottom
bar (BROADCAST, SKIP, CONFIRM / EVICT / KEEP, −FEE, the bet, +FEE, MAX FEE, AUTO-BUMP, FEES, FAIR PLAY, TURBO, SOUND and
volume, LOG, the balance, LAB and TEST where allowed, EXIT), and every panel opens inside it. The browser only grants
fullscreen to the page that got the click, so the room does the browser part and the game does the layout:

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
(the local, testnet LAYR account). On a production on-chain account the Lab never appears, whatever the address says. The
game decides this itself (`LAB_OK` in `src/game.js`) and exposes `PX_CASINO_ENGINE.labAvailable()`. The room can offer a LAB
control through `PX_CASINO_ENGINE.action('lab')`; the game's own fullscreen bar and the L key already do. Lab rounds run the
real engine on a separate lab state with a scripted random generator for the reel stops: they never touch the shared LAYR
balance, the jackpot meters, the Daily Pot or the RTP figures, and are marked LAB in the log. No code needs adding to the
casino for this; do not set `PX_STANDALONE_TEST` there.

## 8. The Daily Pot (holder layer, version 1)

The machine keeps a pot of 1% of every paid bet (never taken from a stake or a win; the house edge pays for it), shows it in
the header with the blocks left until the next 144-block boundary, and shows the share per twin when the twin count could be
read (Forever Twins registry and helpers, a checked read cached six hours; unknown is shown as unknown, never as zero). The
meter lives in the player's saved game state in this browser. Everything that needs a server or a contract is a named stub in
`src/game.js` (`HolderRewards`: `snapshotPot`, `claim`, `holderSpins`, `foreverFund`), each marked `TODO(holder-layer-v2)`:

* at each 144-block boundary, read every forevered twin of every live collection and divide the finished period's pot by the
  twin count, crediting each twin's current holder (an on-chain claim once LAYR is a token);
* the Cameo royalty needs NFT symbols on the reels, which this machine does not have, so none is recorded.

## 9. What the room must provide (already true today)

* `window.ParallaxLAYRAccount` on the parent (the game never opens a second balance).
* The canvas-and-controls host: activate/deactivate, `screen` as a texture, `revision()`, `mechanics()` for the lever
  (`px-lever` rotation.x), BROADCAST cap (`px-spinPhysical` z), the `core` topper and its `blocksLeft` / `pulse` extras.
* **Network** (the frame calls these itself; if the room sets a Content-Security-Policy, `connect-src` must allow them):
  * `https://mempool.space/api` : `/v1/fees/recommended`, `/v1/fees/mempool-blocks`, `/mempool`, `/blocks/tip/height`,
    `/mempool/recent`, `/v1/blocks`, `/block/:hash/txs/:start`, `/tx/:id/status`, about every 30 seconds while the machine
    is active and the tab is visible;
  * `https://xtrata.xyz/forever-twins/data/registry.v2.json` and the Hiro read (`https://xtrata.xyz/hiro/mainnet`, fallback
    `https://api.hiro.so`) for the twin count, at most once every six hours.
  Without the network, or when mempool.space fails twice in a row, the machine plays from the snapshot bundled in the pack
  (`art/snapshot.js`) and the screen's badge says SNAPSHOT (STALE if it had been live before). It never invents a figure.
* Test hooks (`MempoolMadness.test`) exist only on local development hosts or when the parent sets
  `window.PX_STANDALONE_TEST = true`; the casino must never set that.
