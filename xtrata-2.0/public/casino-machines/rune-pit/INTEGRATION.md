# Adding Rune Pit to the casino (not done yet)

Nothing in `public/casino/` was changed for this machine. These are the steps for whoever places it on the floor, written
against `public/casino/index.html` as it stood on 1 Nov 2026 (six designs: The Drop, Forever Twins, Deep Strata, Block
Fortune, Neon Vault, Plebs & Legends). Other machines are being built at the same time, so re-read the file before editing:
the pack's index (its `type`) is wherever it lands in `PX_MACHINE_PACKS`, and every list below is ordered by that index.
Machine id for Rune Pit everywhere below: `rp`; game id `rune-pit`.

## 1. The pack

Append the contents of `pack.json` as one more entry of `window.PX_MACHINE_PACKS` (the
`<script>window.PX_MACHINE_PACKS=[…];</script>` line). It has exactly the existing keys: `name` (`Rune Pit`), `description`
(`Bitcoin Runes · volcanic forge reels`), `color` (`#1a1214`), `accent` (`#d64545`), `model`, `game`, `css`. Append it as
text rather than re-serialising the array, so the other machines' bytes stay identical. No change to the game code is
needed: it uses `window.parent.ParallaxLAYRAccount` and the canvas-and-controls API. `tools/build.mjs` can read the casino
file (`PX_CASINO_HTML=/path/to/casino/index.html node tools/build.mjs`), only to copy the shared parts and check the engine
hash; it never writes to it.

The cabinet model uses WebP data URLs for its transparent textures (the lava-crack overlays) and JPEG for opaque ones.
Both load through `new Image()`; the casino's packed-cabinet loader already does that, and the test page proves it loads in
Chromium.

## 2. Floor position

`buildSlots` puts every design at `zPositions[type]` on both side walls. With six designs both walls are full
(`zPositions=[-7.6,-4.2,-.8,2.6,6,9.4]`), so a seventh design has no side-wall spot. Two free wall spots that clash with
nothing (checked against the room's `solids` list and a top-down render):

* front wall, left of the entrance, facing into the room: `x -4.25, z 10.2, rotation.y = π` (mirrors LAYR-01 at x 4.25);
* back wall, left of LAYR-02, facing into the room: `x -2.2, z -10.2, rotation.y = 0`.

If another new machine is placed in the same spots, one of them needs another wall. The cabinet is wider than the others on
its right side (anvil block, about 3.1 m overall against 2.6 m of body), so leave 0.5 m free to the machine's right (the
player's left as they face it, local +x).

A drop-in for `buildSlots` that keeps every existing spot (keyed by pack name, so pack order doesn't matter):

```js
const extraSpots={'Rune Pit':[{x:-4.25,z:10.2,ry:Math.PI},{x:-2.2,z:-10.2,ry:0}]};
[-1,1].forEach(side=>templates.forEach((template,type)=>{if(type>=zPositions.length||extraSpots[window.PX_MACHINE_PACKS[type].name])return;
  /* …existing side-wall body unchanged… */ }));
templates.forEach((template,type)=>(extraSpots[window.PX_MACHINE_PACKS[type].name]||[]).forEach(spot=>{
  const group=new THREE.Group(),model=template.clone(true),bb=new THREE.Box3().setFromObject(model),size=bb.getSize(V3(0,0,0)),scale=2.6/size.y;
  model.scale.multiplyScalar(scale);model.position.y-=bb.min.y*scale;group.add(model);
  group.position.set(spot.x,.012,spot.z);group.rotation.y=spot.ry;group.name='ParallaX · '+window.PX_MACHINE_PACKS[type].name;scene.add(group);
  const animations=[];for(const role of ['core','crest','recordGroup','lever','spinPhysical','armPivot']){const o=model.getObjectByName('px-'+role);if(o)animations.push({o,role,base:o.rotation.clone(),homePosition:o.position.clone()});}
  const item={type,index:room.machines.length,name:window.PX_MACHINE_PACKS[type].name,group,model,animations,occupied:false};room.machines.push(item);
  const plaque=pxSign(group,0,2.94,0,1.52,.27,item.name,'P L A Y   ↗',false);plaque.name='Machine name';
  const glow=group.localToWorld(V3(0,0,.6));glowSprite(glow.x,1.5,glow.z,1.5,parseInt(window.PX_MACHINE_PACKS[type].accent.slice(1),16),.11);
}));
```

The solids list (`room.machines.forEach(m=>solids.push({k:'r',…}))`) uses each group's position and rotation, so the new
cabinets are walk-blocking without further change (the anvil block adds about 0.5 m on one side; widen the solid if the
room uses a fixed footprint).

## 3. Roles the room animates

* `px-core` (the topper ring) turns about Y on the room clock, exactly where Ordinal Rush used `px-crest`:
  `rotation.y = base + t * speed` (faster while `mechanics().show` is set and its stage is not `outro`).
  The room's role list for `animations` should include `core` (it already does in the template above).
* `px-lever` (the forge hammer). Its rest pose is `rotation.x = 0.28`, baked into the model. The pull is
  `rotation.x = base + sin(u*π) * 1.02` over 900 ms, where `base` is the rotation read at load. Do not reset it to 0.
* `px-spinPhysical` (the ETCH button cap) slides along local z with `mechanics().spinZ`.
* **Hammer sparks.** The strike lands at u = 0.5, about 450 ms after `mechanics().lever` first appears. Spawn 30 to 40
  additive points at the world position of `px-sparkAnchor` (child of `px-anvil`): colours `#ffd27a #ff8a3d #ff5a1a`,
  velocity mostly +y with a spread in x/z and a bit of +z, gravity, life 0.5 to 0.9 s, fading, plus a 120 ms warm point
  light. `index.html` (`strikeSparks()`, `stepSparks()`) is a working reference using `THREE.Points`.

## 4. Lists ordered by pack index

* **Floor-glow colours** in `buildSlots`: append `0xd64545` to `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd,0xff2b2b]`
  (unused if the cabinets stand on `extraSpots`, which take the pack's accent). Both reds are close: if a neighbour is
  Plebs & Legends (`0xff2b2b`), use the ember `0xff6a1f` for Rune Pit's glow sprite instead.
* **`MACH`** (presence, "other people in the room"): append `'rp'`. Also append `'rp'` to the floor map's
  `const type = ['drop', 'twins', 'ds', 'bf', 'nv', 'pl'].indexOf(g)`.
* **Cabinet numbers.** `machineSpot`, `place()` and the spectator lookup number cabinets with
  `m.index < window.PX_MACHINE_PACKS.length ? 1 : 2`, which only works while every design has exactly one cabinet per side
  wall. Number per design instead (identical results for today's machines):
  ```js
  const cabNo = (m) => 1 + room.machines.filter((k) => k.type === m.type).indexOf(m);
  const machineSpot = (m) => MACH[m.type] + '.' + cabNo(m);
  // and in place() / the spectator find: String(cabNo(k)) === idx
  ```
* **Machines panel** (`#machinesPanel`): add
  `<button class="machine-choice" data-machine-type="<type>" style="--machine-color:#1a1214;--machine-accent:#d64545"><b>Rune Pit</b><small>Bitcoin Runes · volcanic forge reels</small><em>PLAY THE MACHINE ↗</em></button>`
  and update the counts ("Seven original machines. Fourteen cabinets across the floor."; the guide's "… designs · …
  cabinets"; the rules' "The … designs have different bonus games.").
* **Round log and spin cast** (`pxRlPatch` and `spectDocument`): add `'rune-pit':'rp'` to their `ids` maps. The game's
  engine line matches their regex (`GAME_ID='rune-pit', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF)`).

## 5. Server lists (Cloudflare functions)

The room service only accepts known cabinet spots. Until these list `rp`, sitting at Rune Pit is simply not shared (the
client already treats `no-such-spot` quietly):

* `functions/lib/casino-room.ts`: add `'rp.1', 'rp.2'` to the spots and `'rp'` to `MACHINE_IDS`;
* `functions/lib/casino-ingest.ts`: add `'rp'` to `GAME_MACHINES`;
* `functions/lib/casino-social.ts`: add `'rp'` to `GAMES`.

## 6. Fullscreen hand-over (`pxMachineFullscreen`)

The fullscreen layout belongs to the game: its screen fills the view with every control except the hammer on a bottom bar
(ETCH, SKIP, ETCH / BURN / KEEP, −SATS, the bet, +SATS, MAX SATS, AUTO-MINT, LEDGER, FAIR PLAY, TURBO, SOUND and volume,
CHRONICLE, the balance, LAB and TEST where allowed, EXIT), and every panel opens inside it. The browser only grants
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
control through `PX_CASINO_ENGINE.action('lab')`; the game's own fullscreen bar and the L key already do. Lab rounds run
the real engine on a separate lab state: they never touch the shared LAYR balance, the jackpot meters, the Holder Pot or
the RTP figures, and are marked LAB in the chronicle. No code needs adding to the casino for this; do not set
`PX_STANDALONE_TEST` there.

## 8. Optional extras the room can use

* `PX_CASINO_ENGINE.mechanics().show` is `{kind, stage}` while a bonus scene runs (`free`, `vault`, `chain`, `jackpot`,
  `gamble`; `trigger`, `intro`, `play`, `outro`; free spins report `{kind:'free', stage:'play'}`). The test page uses it
  to speed up the topper and pulse the floor glow; the room can do the same for its plaque, glow sprite and lights.
* `PX_CASINO_ENGINE.action()` also accepts `fair`, `gamble`, `skip`, `fullscreen` and `lab`.
* The bonus buttons are in the game's `#featureBar`, which the room already ports through `ui().feature`; they are also
  drawn on the screen and tappable there.

## 9. What the room must provide (already true today)

* `window.ParallaxLAYRAccount` on the parent (the game never opens a second balance).
* The canvas-and-controls host: activate/deactivate, `screen` as a texture, `revision()`, `mechanics()` for the hammer
  (`px-lever` rotation.x) and ETCH button (`px-spinPhysical` z), the `core` topper turning on the room clock.
* Network: only the block height (`https://xtrata.xyz/hiro/mainnet/v2/info`, fallback `https://api.hiro.so/v2/info`).
  Every rune tile is drawn from bundled data; nothing else is fetched. Without the network the machine plays with its
  bundled data and shows the height as stale.
* Test hooks (`RunePit.test`) exist only on local development hosts or when the parent sets
  `window.PX_STANDALONE_TEST = true`; the casino must never set that.
