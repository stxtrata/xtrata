# Adding Ordinal Rush to the casino (not done yet)

Nothing in `public/casino/` was changed for this machine. These are the steps for whoever places it on the floor,
checked against `public/casino/index.html` as it stood on 1 Nov 2026 (six designs: The Drop, Forever Twins, Deep Strata,
Block Fortune, Neon Vault, Plebs & Legends). Other machines are being built at the same time, so re-read the file before
editing: the pack's index (its `type`) is wherever it lands in `PX_MACHINE_PACKS`, and every list below is ordered by
that index.

## 1. The pack

Append the contents of `pack.json` as one more entry of `window.PX_MACHINE_PACKS` (the `<script>window.PX_MACHINE_PACKS=[…];</script>`
line). It has exactly the existing keys: `name`, `description`, `color`, `accent` (`#f7931a`), `model`, `game`, `css`.
Append it as text rather than re-serialising the array, so the other machines' bytes stay identical (`tools/build.mjs`
shows the splice-free way it was produced). No change to the game code is needed: it already uses
`window.parent.ParallaxLAYRAccount` and the canvas-and-controls API.

## 2. Floor position

`buildSlots` puts every design at `zPositions[type]` on both side walls. With six designs both walls are full
(`zPositions=[-7.6,-4.2,-.8,2.6,6,9.4]`), so a seventh design has no side-wall spot. Two free wall spots that clash with
nothing (checked against the room's `solids` list and a top-down render):

* front wall, left of the entrance, facing into the room: `x -4.25, z 10.2, rotation.y = π` (mirrors LAYR-01 at x 4.25);
* back wall, left of LAYR-02, facing into the room: `x -2.2, z -10.2, rotation.y = 0`.

A drop-in for `buildSlots` that keeps every existing spot (keyed by pack name, so pack order doesn't matter):

```js
const extraSpots={'Ordinal Rush':[{x:-4.25,z:10.2,ry:Math.PI},{x:-2.2,z:-10.2,ry:0}]};
[-1,1].forEach(side=>templates.forEach((template,type)=>{if(type>=zPositions.length||extraSpots[window.PX_MACHINE_PACKS[type].name])return;
  /* …existing side-wall body unchanged… */ }));
templates.forEach((template,type)=>(extraSpots[window.PX_MACHINE_PACKS[type].name]||[]).forEach(spot=>{
  const group=new THREE.Group(),model=template.clone(true),bb=new THREE.Box3().setFromObject(model),size=bb.getSize(V3(0,0,0)),scale=2.6/size.y;
  model.scale.multiplyScalar(scale);model.position.y-=bb.min.y*scale;group.add(model);
  group.position.set(spot.x,.012,spot.z);group.rotation.y=spot.ry;group.name='ParallaX · '+window.PX_MACHINE_PACKS[type].name;scene.add(group);
  const animations=[];for(const role of ['crest','recordGroup','core','lever','spinPhysical','armPivot']){const o=model.getObjectByName('px-'+role);if(o)animations.push({o,role,base:o.rotation.clone(),homePosition:o.position.clone()});}
  const item={type,index:room.machines.length,name:window.PX_MACHINE_PACKS[type].name,group,model,animations,occupied:false};room.machines.push(item);
  const plaque=pxSign(group,0,2.94,0,1.52,.27,item.name,'P L A Y   ↗',false);plaque.name='Machine name';
  const glow=group.localToWorld(V3(0,0,.6));glowSprite(glow.x,1.5,glow.z,1.5,parseInt(window.PX_MACHINE_PACKS[type].accent.slice(1),16),.11);
}));
```

The solids list (`room.machines.forEach(m=>solids.push({k:'r',…}))`) already uses each group's position and rotation,
so the new cabinets are walk-blocking without further change. If the floor later gets a second row or a new wing (the
bible's open question), place it there instead and drop `extraSpots`.

## 3. Lists ordered by pack index

* **Floor-glow colours** in `buildSlots`: append `0xf7931a` to `[0x4fe3d2,0x39d8ff,0xffbe70,0xe7c18a,0x80c7bd,0xff2b2b]`
  (unused if the cabinets stand on `extraSpots`, which take the pack's accent).
* **`MACH`** (presence, "other people in the room"): append `'or'`. Also append `'or'` to the floor map's
  `const type = ['drop', 'twins', 'ds', 'bf', 'nv', 'pl'].indexOf(g)`.
* **Cabinet numbers.** `machineSpot`, `place()` and the spectator lookup number cabinets with
  `m.index < window.PX_MACHINE_PACKS.length ? 1 : 2`. That only works while every design has exactly one cabinet per side
  wall; with a seventh pack the right-wall The Drop (index 6) would be numbered 1 and clash with the left-wall one.
  Number per design instead (identical results for today's machines):
  ```js
  const cabNo = (m) => 1 + room.machines.filter((k) => k.type === m.type).indexOf(m);
  const machineSpot = (m) => MACH[m.type] + '.' + cabNo(m);
  // and in place() / the spectator find: String(cabNo(k)) === idx
  ```
* **Machines panel** (`#machinesPanel`): add
  `<button class="machine-choice" data-machine-type="<type>" style="--machine-color:#2a2420;--machine-accent:#f7931a"><b>Ordinal Rush</b><small>Ordinals · inscription reels</small><em>PLAY THE MACHINE ↗</em></button>`
  and update the counts ("Seven original machines. Fourteen cabinets across the floor."; the guide's "… designs · …
  cabinets"; the rules' "The … designs have different bonus games.").
* **Round log and spin cast** (`pxRlPatch` and `spectDocument`): add `'ordinal-rush':'or'` to their `ids` maps. The game's
  engine line matches their regex (`GAME_ID='ordinal-rush', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF)`).

## 4. Server lists (Cloudflare functions)

The room service only accepts known cabinet spots. Until these list `or`, sitting at Ordinal Rush is simply not shared
(the client already treats `no-such-spot` quietly):

* `functions/lib/casino-room.ts`: add `'or.1', 'or.2'` to the spots and `'or'` to `MACHINE_IDS`;
* `functions/lib/casino-ingest.ts`: add `'or'` to `GAME_MACHINES`;
* `functions/lib/casino-social.ts`: add `'or'` to `GAMES`.

## 5. Fullscreen hand-over (`pxMachineFullscreen`)

The fullscreen layout belongs to the game: its screen fills the view with every control except the lever on a bottom bar,
and every panel opens inside it. The browser only grants fullscreen to the page that got the click, so the room does
the browser part and the game does the layout:

```js
// once, after createCasinoEngine(type) has the engine:
engine.api.fullscreenHost(on => on ? enterMachineFullscreen(engine) : exitMachineFullscreen(engine));
// the room's Full screen button (pxMachineFullscreen):
async function enterMachineFullscreen(engine){const f=engine.frame;f.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;border:0;background:#000';f.removeAttribute('aria-hidden');
  try{await f.requestFullscreen({navigationUI:'hide'});}catch(e){/* fixed full-viewport fallback (iPhone Safari) */}
  engine.api.fullscreen(true);f.focus();}
async function exitMachineFullscreen(engine){const f=engine.frame;try{if(document.fullscreenElement)await document.exitFullscreen();}catch(e){}
  engine.api.fullscreen(false);f.style.cssText='';f.setAttribute('aria-hidden','true');}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)/* for the active engine */exitMachineFullscreen(getActiveEngine());});
```

The logic iframe needs `allow="fullscreen"` (the test page sets it). The game's own EXIT button and the F key call the
registered host. `index.html` in this folder does exactly this and is the reference.

## 6. Optional extras the room can use

* `PX_CASINO_ENGINE.mechanics().show` is `{kind, stage}` while a bonus scene runs (`free`, `vault`, `chain`, `jackpot`,
  `gamble`; `trigger`, `intro`, `play`, `outro`). The test page uses it to speed up the coin and pulse the floor glow; the
  room can do the same for its plaque, glow sprite and lights. Older rooms ignore it.
* `PX_CASINO_ENGINE.action()` also accepts `fair`, `gamble`, `skip` and `fullscreen`.
* The bonus buttons (Start, Skip, Odd/Even, Collect, Continue, the nine sats) are in the game's `#featureBar`, which the
  room already ports through `ui().feature`; they are also drawn on the screen and tappable there.

## 7. What the room must provide (already true today)

* `window.ParallaxLAYRAccount` on the parent (the game never opens a second balance).
* The canvas-and-controls host: activate/deactivate, `screen` as a texture, `revision()`, `mechanics()` for the lever
  (`px-lever` rotation.x) and spin button (`px-spinPhysical` z), the crest turning on the room clock.
* Network: live art top-ups load from `https://ordinals.com/content/<id>` (served with `Access-Control-Allow-Origin: *`)
  and the block height from `https://xtrata.xyz/hiro/mainnet/v2/info` (fallback `https://api.hiro.so/v2/info`). Without
  either, the machine plays with its bundled art and shows the height as stale.
* Test hooks (`OrdinalRush.test`) exist only on local development hosts or when the parent sets
  `window.PX_STANDALONE_TEST = true`; the casino must never set that.
