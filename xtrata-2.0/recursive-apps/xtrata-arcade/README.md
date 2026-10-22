# Xtrata Arcade Hall

The 3D hall of 21 cabinets. v1.0–v1.3 were inscribed as single ~3.9 MB files
(#3076, #3077, #3078). From v1.4 the hall is built from **parts**, grouped into
five **packs**, and assembled on-chain by a small **parent**, so a release only
inscribes what changed.

## Layout

```
src/parts/           one file per part: the source of truth (edit these)
src/skeleton.html    the single-file layout with @@part:NAME@@ slots
build/hall-parts.cjs shared split / pack logic (also inlined into the parent)
build/modular.mjs    split | check | build
parent/              parent.template.html + ids.json (inscription ids)
tests/               hall-parent.test.cjs: boots the real hall from a mocked chain
release/             the inscribed single-file versions (v1.3 = #3078)
dist/                build output: packs/, parent, single-file build, manifest.json
```

## Packs

| Pack | Parts | Size | Changes |
|---|---|---|---|
| `assets` | fonts, cabinet art, logo, sprite sheet | ~1.6 MB | rarely: new art only |
| `three` | Three.js | ~590 KB | never |
| `engine` | room CSS, kit, music, score client, replay, room, boot | ~150 KB | wallet / scoring fixes |
| `games` | the 21 cartridges | ~1.3 MB | game updates (or override one game) |
| `hall` | hall CSS, markup, 3D hall code | ~190 KB | most often |

The parent (~19 KB) takes each part from, in order:
1. its own inscription (`parts` in `parent/ids.json`, e.g. one updated game),
2. its pack (`packs`),
3. the single-file release in `bundleId` (#3078).

So packs that did not change never need inscribing: they come out of #3078.

Each of those inscriptions is fetched whole from the xtrata.xyz gateway (`/i/<id>?raw=1`,
served from R2) and used only if its SHA-256 matches `CONFIG.hashes`, which the build writes
for every id the parent loads. If the gateway is unreachable or a copy does not match, that
inscription is read chunk by chunk from the chain instead. So the gateway makes loading fast
(3 requests instead of about 270 chunk reads), but it can never change what runs.

## Releasing

The launch canary does all of this on chain, in order and checked: see
`canaries/arcade-launch/README.md` (`npm run build:canary:arcade-launch`). By hand:

1. Edit `src/parts/*`.
2. `node build/modular.mjs build`: it prints which packs changed since #3078.
3. Inscribe only the changed packs from `dist/packs/` (and/or single parts).
4. Put their ids in `parent/ids.json`, run the build again, inscribe
   `dist/xtrata-arcade-parent.html`.
5. `node tests/hall-parent.test.cjs` before inscribing (see below).

`node build/modular.mjs check` proves the split still rebuilds #3078 byte for byte.

## v1.4

- **Top 10 on idle cabinets.** Each idle screen cycles: its attract loop, then
  the Top 10 over the still-running attract, then any timed-variant Top 10.
  The #1 name stays in a strip along the top during the attract loop.
  Empty or unreadable boards are skipped. Timings: `SCREEN_BOARD` in `hall.js`.
- **Connect before you sit down.** A run is bound to the wallet it starts with,
  so a practice run can't be posted afterwards. When not connected, the ready
  card now leads with **Connect wallet** (Enter/Space), practice is secondary and
  labelled as unpostable, and connecting reopens the machine as a ranked run.
  The hall's START prompt shows RANKED / PRACTICE before you walk up.
- **Leather fix.** Post-conditions and args go to wallets as bare hex (Leather
  rejects `0x`: "Not a serialized post condition"). The parent also strips `0x`
  for Leather, which fixes older engine packs too.

This release inscribes only `engine` (~150 KB) + `hall` (~190 KB) + the parent.

## v1.4.2

- **No false hope after a practice run.** A practice run can never be posted (its replay is not
  bound to a wallet). Game over used to say "That run makes the top 10 at #N. Post it on-chain…"
  and offer Connect wallet; connecting then changed nothing on screen. Now it says the run would
  have been #N but practice runs can't be posted, connects in place ("Check your wallet…"), shows
  "✓ Connected as …" as soon as the wallet answers (also if it connects from the hall's button),
  and offers **▶ Play a ranked run**.
- **Wallet choice.** On a top-level page (`/i/<id>`) the arcade used to take Leather whenever it was
  installed, without asking. With more than one wallet present, Connect now asks "Connect with which
  wallet?" (Leather / Xverse) every time, and later signing uses the wallet picked.

Engine pack only (`arcade-room.js`, `score-client.js`).

## v1.5.0

Any score can be posted, however long the run.

- **Smaller replays.** Format 2 stores events in columns (step gaps, buttons, pointer moves as deltas) before deflate: about 18% smaller than format 1 on the 52 mainnet replays. Formats 1 and 2 both verify.
- **Four-hour runs.** `MAX_STEPS` is 864,000 (was 30 minutes).
- **Long runs, option 1: inscribe.** A replay over 60,000 bytes is inscribed on the Xtrata core with `mint-single-tx` (up to 512 KB, one transaction). The score entry stores a small format-3 pointer (`0x01`, inscription id, chain hash, length). The pointer keeps the run's header, so the contract's pilot check still passes. Two wallet approvals; the cost (inscription fee plus network fee) is shown first. An existing inscription of the same bytes is re-used.
- **Long runs, option 2: seal.** The score entry stores the header plus fingerprints (`0x02`, Xtrata chain hash, sha256, length). The replay file is saved to the player's device and a copy kept in the browser. One approval, no inscription. Anyone holding the file can check it against the board ("🔒 sealed" on the entry); if the same bytes are ever inscribed on Xtrata, the chain hash finds them and the run plays from the chain. Runs over 512 KB can only be sealed.
- **Nothing is lost.** Every Top 10 run is kept locally until posted; "post a saved run" posts it later from a file.
- **No contract change.** `xtrata-arcade-scores-v2` is unchanged. `resolve()` checks size, chain hash and header bytes 4..44 before trusting any replay it fetched.

Site: `src/arcade-submit/long.ts` (`postRun`), bridge payload limit 800 KB, seals accepted by `verifyArcade`.
Engine pack changed (`arcade-replay.js`, `score-client.js`, `arcade-room.js`) plus `hall.js`. Test: `tests/long-replay.test.cjs` (20 checks on a mock chain).

## Tests

```bash
# needs playwright + @stacks/transactions on NODE_PATH, Chromium with SwiftShader
node build/modular.mjs check
node build/modular.mjs build
CHROME_PATH=/path/to/chromium node tests/hall-parent.test.cjs [shotsDir]
```

## The world preview page

`public/arcade-world-preview/index.html` (live at `/arcade-world-preview/`) is the real hall plus a small head script of sample data, so the four bays and their skinned doors can be seen without any contract. It is a static file: it only changes when regenerated and merged.

    node build/modular.mjs build     # src/ -> dist/
    node build/preview.mjs           # dist + build/preview-head.html -> public/arcade-world-preview/index.html
    node build/preview.mjs --check   # fails if the committed page is out of date

Edit `build/preview-head.html` to change the sample scenes or the button panel.

### The door latch

Closing a door holds the handle down (the latch bolt stays pulled in) until the leaf is home, then lets it go so the bolt snaps into the frame. A leaf pushed into the last 4 degrees has its bolt pushed in by the strike the same way, and a catch spring pulls it shut, so a door never rests ajar with the bolt against the frame. The slam bounce is capped so it cannot leave that zone. Tests: `tests/doors.test.cjs`.

The latch itself is a real bolt (3 cm long, bevelled, 1.8 cm throw) that slides out of a faceplate on the leaf's edge into a strike set in the frame: a keep (a block of the frame finish beside the leaf) with a metal strike plate and a dark mortise. The part of the bolt inside the keep is hidden by it, so it reads as going into the frame. Pulled back by the handle it sits fully inside the leaf. Double doors meet in the middle and have no keep. Test: `tests/hall-latch.test.cjs`.

### Elements are separate layers

A bay is made of independent elements, each its own layer in the world contract: the base (wall or door), a curtain (cover, kind 1) in front of it, signs and tape (overlays, kind 2), the lamp (kind 4) and work sounds (kind 3). Any curtain can hang in front of any door and any sign can go on any wall. A `sign-board` takes `x` (across the bay, in metres from its centre), `y` (height), `w` (width) and `front` (in front of the curtain, or on the wall behind it); they are clamped to the bay's wall. In the preview, "COMPOSE A BAY" picks each of these on its own.

## The lobby (a room behind a door)

A bay door whose scene has `interaction: 3` and a link to `target-room: "lobby"` has a real, bare room built behind its wall (`buildLobby` in `src/parts/hall.js`). When the door opens its doorway is see-through (`portal()` in `doors.js`: the opening is cut out of the doorway picture and an invisible copy of it writes the stencil, which the wall materials on both sides skip), so you see the room and just walk in, with no loading, fade, teleport or button. While you are inside the door is held open, and looking back shows the hall through the same opening. The wall between the rooms has a thickness (`WALL_T`, 20 cm: a drywall cavity), so the doorway is a short tunnel; its sides are a plaster-coloured reveal built from the opening's outline. The two walls write separate stencil bits (1 for the hall's wall, 2 for the lobby's), so each skips only its own opening. Only one bay at a time can lead to the lobby. Any other target still says "THIS DOOR LEADS TO <ROOM> · NOT OPEN YET". Test: `tests/hall-lobby.test.cjs`.

### Doors inside the lobby, and rooms that take the whole screen

The lobby has two doorways of its own on its back wall. They are bays 4 and 5 of the same bay engine (the hall's four come first); the engine places them in the lobby's own frame (`def.parent`) so they move with it, and `setScope` limits what you can look at and use to the hall's bays or the lobby's, depending on which side of the wall you are. They are read from the world contract as the room `lobby` (`snap.rooms.lobby.bays`: `get-bays "lobby"` in `src/parts/world.js`; if the contract has nothing for it or the read fails, they are plain walls and the hall is untouched).

A door whose link names a room listed in `window.XA_ROOMS` opens that room's page over the whole screen instead of building it behind the wall:

    window.XA_ROOMS = { casino: { src: 'casino-room.html', title: 'Royal Flush Casino' } };

There is no button at a doorway: you open the door (E or click, as any door) and walk into it. A door to a room starts loading that room's page quietly (hidden, behind the hall) as soon as it is open and you are within a few steps of it, so by the time you walk in there is little or nothing to wait for. Walking into the open doorway then shows a short loading screen (at least 0.7 s, 0.25 s if the page was already loaded, so it never flashes), then the page in a full-screen frame with a BACK TO THE LOBBY button above it. The hall sleeps and its sound is shut away while you are in the room. Going back removes the frame (the room frees what it built) and puts you a step in front of the door, facing into the lobby; the room is not preloaded again until you have moved away or shut the door. A room can also leave on its own with `parent.postMessage({xa:'leave-room'}, '*')`, which is what the casino's back door does. A target not listed in `XA_ROOMS` still says "NOT OPEN YET" when you walk into its open doorway. `src` is any URL the hall may frame: a file beside the hall, or an inscription's content path; the hall adds `?from=arcade` to it so the room knows to start walking.

### The casino walks like the hall

The casino is a page of its own, but it uses the hall's walking and looking numbers, so moving between the two feels the same: the hall's `WALK` constants (field of view 68, eye 1.6 m, walk 3 / run 4.6 m/s, step bob, mouse 0.0022 locked and 0.004 dragged per pixel, touch look 0.005, pitch limit 1.2 rad) are copied into the casino page as its own `WALK`, the camera is set straight from yaw and pitch (YXZ order), the mouse turns you from the first pixel and also while the camera settles after standing up, and with `?from=arcade` it starts walking just inside its door with no overview. If you change one, change the other: `tests/casino-walk.test.cjs` fails when they disagree, and when the same mouse drag turns the two differently.

The casino's entrance wall has a real door with a velvet rope that is open in the middle (the way to the carpet). Walk up to it and it opens, walk through and the page tells the hall to leave; on its own (no parent page) it just says where the way out is.

In the preview the lobby's first door is CASINO (gold sign, skinned door, `link: casino`) and the page is `build/rooms/casino-room.html`, copied beside the preview by `build/preview.mjs` (also checked by `--check`). That page loads three.js from a CDN. Tests: `tests/hall-room.test.cjs` (a stub page stands in for the casino) and `tests/casino-walk.test.cjs`, which runs the real casino page and needs a local three.js r128 (`THREE_JS=<three.min.js>`, see its header; it skips without it).

**Walking into a room: the entry still, with depth.** A room in `window.XA_ROOMS` may carry `still: 'casino-entry.jpg'` and `depth: 'casino-entry-depth.png'`: a colour picture and a depth map of the first view you get inside it. `build/snap-room.cjs` takes both from the room's own page opened with `?from=arcade` (colour at 80° vfov, 2304x1296; depth 768x432, 12 bits packed in R and G over 0..32 m; glow, dust, sprites and instanced bits are left out of the depth pass). Re-run it, then `node build/preview.mjs`, whenever the room's entry view changes. The numbers in `snap-room.cjs` must equal `ROOM` in `doors.js` (test G checks). The hall uses the pair three ways. **In the doorway:** an open door shows a window (`doors.js windowTo`, driven from `bays.js update`): for every pixel of the opening a ray from your eye is marched (96 steps and a binary refine) through the depth map, so you get real parallax, and from the doorway it is exactly the room's own first view (eye 1.6 m, pitch -0.08, fov 68, the casino's `startAtDoor`). Rays that leave the picture continue over a carpet extension taken from its bottom row, the picture's edge fades softly, and a warm light spill lies on the hall floor in front of an open door. It is drawn raw (no tone mapping) because it is already a finished screen shot. **At the threshold, the glide** (`walkIn`): a second small WebGL canvas draws the same ray march while the camera glides from where you stand to the room's entry pose (`ROOM.glide` 1500 ms), and the live room, already loaded behind it, takes over when it posts `{xa:'room-ready'}` (the casino does after three frames; a room that never does is shown 2.5 s after it loads). **Fallbacks:** no depth map gives the flat CSS still that moves in a little; only a slow room (3.5 s) gets the loading screen. The hall's own buttons are hidden while you are in a room. Known limits: a heightfield smears thin things (rope stanchions) and very oblique angles show a flat carpet smear; the real-GPU cost of the 96-step march has not been measured. Ops: `--rooms "casino=casino-room.html|ROYAL FLUSH CASINO|casino-entry.jpg|casino-entry-depth.png"`. Tests: `tests/hall-room-still.test.cjs`.

**The Strata Salon and Adrian, the house's host (PvP tables in the room).** Behind the casino's back wall, through a lit arch beside the bar (centre x -6), is THE STRATA SALON: an ink-and-emerald private room holding two player-versus-player tables built into the floor itself — heads-up no-limit Hold'em (station id `pvpholdem`, buy-ins $100/$200/$500, blinds $5/$10) and Liar's Dice (`liars`, stakes $10-$100). They are the casino-pvp handoff's stations brought in beside the classic five (stations 6 and 7, keys 6 and 7): each runs `PvpCore`'s exact JS twin of the testnet contract (`casino-holdem-v1` / `casino-liars-dice-v1`) against a practice opponent on a simulated chain (3 s blocks), with the 2% rake, committed seeds and timeout claims of the real rules; `PVP_CHAIN` is the single chain object to swap for wallet-backed calls later. The three inlined models (`DiceModel`, `HoldemModel`, `PvpCore`) load before the room script. Panel rule kept from that build: a ticking value (the turn clock) lives in `<b class="pvpclk">` filled by `update()`, never in the `game` HTML string, so the strip does not rebuild under a click — `tests/casino-pvp.test.cjs` locks this. **Adrian** is the room's human host: one 1.8 m GLB (`build/rooms/adrian.glb`, 5.4 MB, 163 bones, 15 baked clips, from the Xtrata character atelier) fetched beside the page, parsed by a small inline GLB reader, cloned six times and recoloured per post — blackjack (emerald), roulette (burgundy), baccarat (plum), the two salon dealers (ink/emerald and teal) and a greeter by the entrance ropes. He blinks, follows you with his eyes within 4 m, smiles when he greets, and plays dealing/present/celebrate clips on the stations' cues (`XA_HOSTS.cue`); far hosts animate at a lower rate. If `adrian.glb` cannot be fetched (bare file:// open, missing asset) the original low-poly dealers stay — nothing breaks. The `⛓ Strata Club` button still opens the overlay pages (practice + "Watch a testnet game"); the intro's second row now walks you to the salon tables instead.

**The Strata Club tables (testnet rules).** The casino room has a `⛓ Strata Club` button (top bar) and two intro buttons that open the player-versus-player tables over the floor in a full-screen frame: `strata-holdem.html` and `strata-liars-dice.html`, with `strata-club.css` and the two rule models `strata-dice-model.js` / `strata-holdem-model.js` (all in `build/rooms/`, copied beside the preview with the room). The models are the JS twins of the testnet contracts `casino-liars-dice-v1` and `casino-holdem-v1` (same rules, error codes and order of checks), so the practice table (simulated chain, bot opponent) plays exactly what the contract would. Each page's "Watch a testnet game" tab reads the real contract's events from `api.testnet.hiro.so` and replays a game. `XA_STRATA.open('sc-th' | 'sc-td')` / `.close()` drive the overlay; Escape or "Back to the floor" closes it. **Not wired yet:** signing real chip moves from these pages (the table pages have no wallet code; the testnet games so far were played by the casino wizards through offline signing). Do that through the wallet playbook, not ad hoc. Test: `tests/strata-club.test.cjs` (no browser).

## Network-fee warning on score posts

Wallets estimate their own network (miner) fee for a score post and have suggested 0.5 STX. The post panel
(`arcade-room.js`) now tells players to set the small figure from `networkFeeHintUstx` in `score-client.js`
(3000 µSTX = 0.003 STX; one number, used by all the copy):

- a red banner above the Post button, with "How do I change the fee?" steps for a custom fee;
- a "Before your wallet opens" notice the first time in each session (`sessionStorage` flag `xa:feeNotice`,
  plus an in-memory flag when storage is blocked); "Not now" backs out without opening the wallet;
- a reminder line under the wallet message while the wallet is open.

The two-approval long-run (inscribe) flow shows a warning without a fixed figure, because the network fee for a
big transaction legitimately grows with its size. `networkFeePerByteUstx` (default 0, off) can scale the figure
if measurement shows larger posts need it. The fee is not yet passed to the wallet: that is a separate wallet
change (see `docs/WALLET-PLAYBOOK.md`). Test: `tests/long-replay.test.cjs` (needs `@stacks/transactions` v6).

## The casino as its own inscription (rooms)

A room that is its own page (the casino) is inscribed on its own and the parent pins it, so the casino is on chain
like everything else and is reached only through the world contract's lobby door.

- `build/rooms/casino-room.html` is inscribed as it is (about 231 KB). `parent/ids.json` has `"rooms": { "casino": 0 }`:
  put the inscription id there. With id 0 the parent has no casino, and the lobby door says "not open yet".
- `node build/modular.mjs build` copies the room to `dist/rooms/`, writes its hash into the parent's `hashes`, and adds
  `rooms: { casino: { id, title } }` to the parent's CONFIG.
- The parent sets `window.XA_ROOMS.casino = { title, load }`. `load()` reads the room by id (gateway first, only if the
  SHA-256 matches; otherwise from the chain), then frames it as `srcdoc`. Nothing is read until the door opens it.
- **three.js is not fetched from a CDN.** The standalone room file has a cdnjs `<script>` for three.js r128 (so it
  still opens on its own and in the preview); `load()` swaps that tag for the arcade's own three.js, which is the
  `three` pack read from #3078. Both are r128. The room runs in its own frame with its own copy of the library.
- The hall adds `window.__XA_FROM_ARCADE = 1` to the room, so it starts walking just inside its door (a srcdoc page
  has no `?from=arcade`). A room that cannot be loaded shows "THE ROOM COULD NOT BE LOADED" and BACK TO THE LOBBY works.
- **The contract is the switch.** The door, its sign and its link (`target-room: casino`) come from the world contract's
  lobby room. Write the scene to turn the casino on; retract it (or revert the bay to a wall) to turn it off. The page
  is only ever loaded through that door.

Tests: `tests/hall-parent.test.cjs` (scenario 7: the real casino runs inside its frame on the arcade's three.js; tampered
gateway copy refused) and `tests/hall-room.test.cjs` (F, G: a room from a loader, and one that fails).
