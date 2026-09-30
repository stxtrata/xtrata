# Xtrata Arcade Room (v3.0 prototype, all 21 cabinets at v2)

One recursive parent that hosts an arcade room of cabinets. Every cabinet is its
own leaf inscription and posts to the **same** score contract
(`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-arcade-scores-v1-3`) under its
own `game-id`. Adding game #4…#21 means inscribing one more cartridge and a new
parent that lists it.

| Cabinet     | Leaf                         | game-id          | Controls |
|-------------|------------------------------|------------------|----------|
| Neon Snake  | `modules/game-neon-snake.js` | `xa_neon_snake`  | arrows/WASD, swipe, d-pad · stages, portals, power-ups |
| Block Drop  | `modules/game-block-drop.js` | `xa_block_drop`  | ←→ ↑/X Z Space C, swipes, 7 pads · Marathon + **Sprint 40** (time board), T-spins, 5 themes |
| Cave Diver  | `modules/game-cave-diver.js` | `xa_cave_diver`  | hold Space/↑, touch-and-hold · four lit depth zones, submersible, oxygen, jellyfish/eels/falling rocks, air/shield/flare/magnet, treasure pockets |
| Orbit Merge | `modules/game-orbit-merge.js` | `xa_orbit_merge` | mouse aim + click, ←→ Space, drag + lift · 10 planet tiers, bomb/stardust/tremor, supernova levels |
| Block Runner | `modules/game-block-runner.js` | `xa_block_runner` | Space/↑ jump (hold = higher), ↓ duck, tap / swipe down · 4 worlds, shield/magnet/double jump/dash |
| Brick Breaker | `modules/game-brick-breaker.js` | `xa_brick_breaker` | mouse or ←→, Space launch/laser, drag + tap · 20 levels, 4 bosses |
| Rock Drift | `modules/game-rock-drift.js` | `xa_rock_drift` | ←→ turn, ↑ thrust, Space fire; 4 touch pads · ice/metal/explosive rocks, pickups, boss every 5 waves |
| Stack Tower | `modules/game-stack-tower.js` | `xa_stack_tower` | Space / click / tap to drop · climb to space, gold/wide/ice slabs, perfect repairs |
| Road Hopper | `modules/game-road-hopper.js` | `xa_road_hopper` | arrows/WASD, swipe or tap, d-pad · 5 biomes, trains, sinking logs, crocs, ice, 6 unlockable hoppers |
| Tile Tap | `modules/game-tile-tap.js` | `xa_tile_tap` | ← ↓ ↑ → or 1–4, click/tap a lane · 3 charted songs, holds + doubles, timing grades + **Rush 100** (time board) |
| Merge 2048 | `modules/game-merge-2048.js` | `xa_merge_2048` | arrows/WASD, swipe, d-pad · animated slides, 4 skins, earned Undo/Swap/Smash tokens + **Race to 512** (time board) |
| Block Defence | `modules/game-block-defence.js` | `xa_block_defence` | click/tap to fire; arrows + Space, Z X C per silo · splitters, smart bombs, bombers, darts, supply depot between waves, day→night |
| Maze Muncher | `modules/game-maze-muncher.js` | `xa_maze_muncher` | arrows/WASD, swipe, d-pad · 5 mazes, 4 glitch personalities, warp gates, items, freeze/boost |
| Invader Wave | `modules/game-invader-wave.js` | `xa_invader_wave` | ←→ + Space (hold to fire); ◀ ▶ FIRE pads · 8 formations, divers/shielded/splitters/bombers, mothership boss, power-ups, crumbling bunkers, CRT look |
| Helix Drop | `modules/game-helix-drop.js` | `xa_helix_drop` | drag or ←→ to spin · levels with finish platforms, 4 worlds, glass/boost/slider segments, fireball, shield |
| Bubble Pop | `modules/game-bubble-pop.js` | `xa_bubble_pop` | mouse aim + click, or ←→ + Space; C swaps · 11 designed boards, bomb/rainbow/stone/ice, bounce aim guide, falling orphans |
| Swerve | `modules/game-swerve.js` | `xa_swerve` | mouse / drag to steer, or ←→ · 4 zones, sliding gates/rotors/chokes/pillars, boost pads, shield, slow-mo, near-miss chains |
| Lunar Lander | `modules/game-lunar-lander.js` | `xa_lunar_lander` | ←→ rotate, ↑ / Space thrust; ⟲ ⟳ THRUST pads · 5 worlds (wind, ice, thermals, heavy gravity), fuel caches, cargo rescue, ground zoom |
| Reflex Tap | `modules/game-reflex-tap.js` | `xa_reflex_tap` | click/tap, or keys 1–9 · 8 target kinds, 8 rule rounds + **Hit 50** (time board) |
| Mine Sprint | `modules/game-mine-sprint.js` | `xa_mine_sprint` | click reveal, hold to flag (or flag mode); arrows + Space, F · no-guess boards (built-in solver), growing board ladder, 4 themes + **Classic** (time board) |
| Pong Streak | `modules/game-pong-streak.js` | `xa_pong_streak` | mouse / drag or ←→ · 6-machine ladder with a boss, spin and curve, multiball/big/slow/curve power-ups, arenas |

The `xa_` prefix keeps these boards separate from the older 21-arcade slots.

## Layout

```
modules/
  arcade-room.css     room + HUD + pads styles
  arcade-kit.js       registry, input (keys/pads/swipe/hold), synth audio, particles
  arcade-music.js     shared music engine: sequencer + synths, layers, tempo/key/filter, stingers
  score-client.js     ONLY module with network/wallet access: board reads + submit
  arcade-room.js      cabinets, attract screens, scoreboards, sessions, game-over flow
  game-*.js           cartridges: XA.registerGame({ id, size, create(api), attract })
parent/
  xtrata-arcade-parent.template.html   recursive parent (get-chunk loader)
  fill-ids.mjs                          write minted ids into the parent
  build-manifest.mjs                    size + sha256 manifest
  build-preview.mjs                     single-file view-only preview bundle
tests/
  codec.test.cjs      Clarity / c32 / post-condition codec vs @stacks/transactions
  smoke.test.cjs      Playwright: parent loader, all 21 games, submit via mock host
  mock-host.html      fake xtrata.xyz wallet bridge for the smoke test
index.html            local dev page (not for inscription)
```

Leaves total ~1.33 MB for all 21 games plus the music engine (Astro Blaster's leaves are ~590 KB for one).

## Cartridge contract

A cartridge never sees the wallet. `create(api)` receives:

`W, H, input, audio, fx, rng (seeded), seed, shake(n), addScore(n), setScore(n), getScore(), setStatus(text), gameOver(), pointer()`

`pointer()` returns `{ x, y, down, moved }` in playfield units; `moved` ticks on every move so a game can tell pointer steering from key steering. `input.hit('release')` fires once per touch/click release.

and returns `{ update(dt), render(ctx) }`.

### Variants (more than one board per cabinet)

A cartridge can register variants that post under the **same game-id** with a
different contract mode, e.g. Block Drop's Sprint 40 on the time board:

```js
XA.registerGame({ id: 'xa_block_drop', modeLabel: 'Marathon',
  variants: [{ key: 'sprint', label: 'Sprint 40', mode: 'time', tagline: 'Clear 40 lines. Fastest time wins.' }], ... });
```

The cabinet gets an extra play button and the high-score screen gets mode tabs.
`create(api)` then sees `api.mode` (`'score'` or `'time'`) and `api.variant`.
In time mode the score is elapsed centiseconds (lower wins, shown as 1:23.45):
keep it current with `setScore`, call `api.finish()` on completion, and
`gameOver()` without `finish()` is a DID NOT FINISH that can't be posted.
Each variant must use a mode the game doesn't already use, since the contract
keys boards by (game-id, mode). The room runs a fixed 60 Hz step,
countdown, pause, shake, particles and the game-over screen.

## Music engine (`XA.music`)

One sequencer and a small synth rack shared by every cartridge. Songs are data;
games steer them live.

```js
XA.music.play({
  bpm: 104, key: 57, scale: 'minor', chords: [0, 5, 2, 6],       // i–VI–III–VII
  tracks: [
    { name: 'kick', inst: 'kick', layer: 0.25, pattern: 'x...x...x...x...' },
    { name: 'bass', inst: 'bass', layer: 0.1, chord: true, octave: -2, pattern: '0 . 0 . ^0 . 0 .' },
    { name: 'arp',  inst: 'arp',  layer: 0.6, chord: true, octave: 1,
      fn: function (i) { return [0, 2, 4, 7][i.step % 4]; } }   // generative line
  ]
});
XA.music.setIntensity(0.7);           // tracks with layer <= 0.7 fade in
XA.music.setTempo(140, 1.5);          // ramp
XA.music.note('pluck', 4, { chord: true, quantize: '16' });   // in key, on the grid
```

Instruments: kick, snare, clap, hat, shaker, bass, sub, lead, pluck, marimba,
bell, pad, arp, riser. Also `setKey/transpose/setScale`, `setFilter`, `setTrack`,
`stinger`, `duck`, `tapeStop`, `pause/resume`, `pulse()` for beat-synced visuals
and `onStep()` callbacks. The room pauses, resumes, tape-stops and stops music
around every session, and music plays through the kit's master gain, so the mute
button covers it.

How the three showcase games drive it:

- **Neon Snake**: layers unlock as the snake grows, speed sets the tempo, each
  stage modulates up a tone, bites play chord tones, SLOW-MO drops tempo under a
  filter, GHOST switches to a whole-tone scale, MAGNET adds a bell line.
- **Cave Diver**: four zone scores (pentatonic reef, dorian kelp with a 12-over-16
  ostinato, sparse phrygian abyss, harmonic-minor vents) crossfade as you dive;
  depth drives a low-pass filter; pearl chains climb the scale on the beat.
- **Brick Breaker**: each level generates its own theme (key, mode, progression,
  seeded motif); the arrangement fills in as the wall empties; combos walk up the
  scale in 16ths; lasers fire in key; bosses get a heavier track; clears land a
  stinger on the next bar.

Every other cabinet has its own score too, each built around its mechanic:

| Cabinet | Sound | What drives it |
|---|---|---|
| Block Drop | D harmonic minor folk dance, 118 bpm+ | stack height → layers; level → tempo + key; line clears → stinger sized to lines; hard drop → kick |
| Orbit Merge | F lydian space pads, 76 bpm | jar fill → layers, danger line closes the filter; merges → bigger planet, lower bell |
| Block Runner | C major chiptune, 128 bpm | speed → tempo; jump climbs an arp; duck dips the filter; every 500 m → key up |
| Rock Drift | E phrygian heartbeat, 64→136 bpm | rock left in the wave → tempo; thrust opens the filter; splits fall in pitch by size |
| Stack Tower | G major, 100 bpm | each floor plays the next note of a climbing melody; perfects an octave up; every 10 floors → key change |
| Road Hopper | Bb mixolydian swing, 112 bpm | hops walk the scale up/down; roads bring drums, rivers bring pads · 5 biomes, trains, sinking logs, crocs, ice, 6 unlockable hoppers |
| Tile Tap | G major pop, 112 bpm+ | **you play the lead**: each correct tap is the next melody note; tile speed → tempo · 3 charted songs, holds + doubles, timing grades + **Rush 100** (time board) |
| Merge 2048 | Eb lo-fi, 80 bpm swing | merges play degree log2(tile); best tile → layers + stinger; full board closes the filter · animated slides, 4 skins, earned Undo/Swap/Smash tokens + **Race to 512** (time board) |
| Block Defence | D harmonic minor, 124 bpm | warheads on screen → layers; near-miss siren; chain kills climb the scale · splitters, smart bombs, bombers, darts, supply depot between waves, day→night |
| Maze Muncher | C dorian chiptune, 120 bpm | maze eaten → layers; power core → phrygian, faster, frantic arp · 5 mazes, 4 glitch personalities, warp gates, items, freeze/boost |
| Invader Wave | F minor march, 96→188 bpm | invaders left → march tempo; mystery ship → siren track · 8 formations, divers/shielded/splitters/bombers, mothership boss, power-ups, crumbling bunkers, CRT look |
| Helix Drop | C# minor drum & bass, 170 bpm | each gap passed steps a falling run; fireball opens the filter · levels with finish platforms, 4 worlds, glass/boost/slider segments, fireball, shield |
| Bubble Pop | C major pentatonic, 100 bpm | each colour is a note; dropped bubbles cascade; danger adds tension · 11 designed boards, bomb/rainbow/stone/ice, bounce aim guide, falling orphans |
| Swerve | E dorian synthwave, 118 bpm+ | speed → tempo; close shaves → riser + pluck; 500 m → key up · 4 zones, sliding gates/rotors/chokes/pillars, boost pads, shield, slow-mo, near-miss chains |
| Lunar Lander | F lydian ambient, 70 bpm, no drums | thrust opens the filter; altitude bands bring a ticking clock; landing resolves · 5 worlds (wind, ice, thermals, heavy gravity), fuel caches, cargo rescue, ground zoom |
| Reflex Tap | D pentatonic click, 116 bpm+ | each hit plays the next note on the 16th grid; streak → layers · 8 target kinds, 8 rule rounds + **Hit 50** (time board) |
| Mine Sprint | B harmonic minor clock, 96 bpm | revealed numbers are notes (only revealed cells, never hidden mines) · no-guess boards (built-in solver), growing board ladder, 4 themes + **Classic** (time board) |
| Pong Streak | G dorian disco, 108–136 bpm | ball speed → tempo; each hit climbs the chord; rally → layers · 6-machine ladder with a boss, spin and curve, multiball/big/slow/curve power-ups, arenas |

## How a score gets posted

`score-client.js` tries, in order:

1. **Host bridge, narrow method** `xtrata_submitArcadeScore`
   `{ contract, network, address, gameId, mode, score, name }` — the host
   rebuilds the transaction itself. **Not implemented on xtrata.xyz yet** (see below).
2. **Host bridge, generic** `stx_callContract` — supported today by the secure
   `/runtime` page. Deny mode, one STX post-condition `≤ get-fee-unit` from the
   connected address, no `sender` field (wallet playbook §2).
3. **Direct provider** (Leather / Xverse BitcoinProvider) only when the page is
   top-level, same shape with hex post-conditions.
4. Nothing can sign → the game-over panel says so and links to xtrata.xyz.

Board reads that fail show **offline**, never an empty board.

## Host method on xtrata.xyz

The public viewer used to refuse contract calls, which is why Astro Blaster
scores never landed for other players. It now answers the narrow
`xtrata_submitArcadeScore` method (`src/lib/viewer/arcade-score.ts`, wired in
`src/home/main.js`), following the `GAME_SAVE_METHODS` precedent:

- contract pinned to `xtrata-arcade-scores-v1-3`, function pinned to `submit-score`;
  the host rebuilds all four Clarity arguments
- validates `gameId` `^[a-z0-9_]{3,32}$`, `score` positive uint128, `name` 3–12 printable ASCII
- reads `get-fee-unit` itself (a failed read is an error, never zero), host-owned
  review dialog, re-reads the fee after approval, Deny mode with one STX
  post-condition `≤ fee`, no `sender`

It goes live with the next xtrata.xyz deploy, after the WALLET-PLAYBOOK §10
desktop + mobile canary. Until then, posting works inside the `/runtime` page.

## Updating an inscribed arcade without re-inscribing it

The parent can use a single-file arcade inscription (built by
`parent/build-preview.mjs`, e.g. **#3078**) as its base: it reads the bundle
on-chain with `get-chunk`, splits it back into modules by their
`<script>/* file.js */` markers, and uses its own `moduleIds` only for modules
you have re-inscribed. An update is therefore:

1. Inscribe only the changed module file(s) from `modules/`.
2. `node parent/fill-ids.mjs --bundle 3078 --scores <new id>` (one flag per changed module).
3. Inscribe `parent/xtrata-arcade-parent.template.html` (~15 KB).

The parent also rewrites `0x`-prefixed hex to bare hex on Leather
`stx_callContract` calls, which fixes score posting with Leather for score
clients inscribed before that fix, even with no module re-inscribed.
`tests/bundle-patch.test.cjs` checks all of this against a mocked #3078.

## Mint order

1. `node parent/build-manifest.mjs` and check sizes/hashes
2. Inscribe the 26 leaves in manifest order (css, kit, music, scores, room, then the 21 cartridges in `MODULES` order)
3. `node parent/fill-ids.mjs --css <id> --kit <id> --music <id> --scores <id> --room <id> --snake <id> --blocks <id> --cave <id> --merge <id> --runner <id> --bricks <id> --drift <id> --stack <id> --hopper <id> --tiles <id> --merge2048 <id> --defence <id> --muncher <id> --invaders <id> --helix <id> --bubbles <id> --swerve <id> --lander <id> --reflex <id> --mines <id> --pong <id>`
4. Inscribe `parent/xtrata-arcade-parent.template.html`
5. `node parent/fill-ids.mjs --parent <id>` for the runtime deep link (only matters for a re-mint)

Before minting, the parent can be tested over HTTP: ids left at `0` load from `../modules/`.

## Tests

```bash
# needs playwright + @stacks/transactions@6 on NODE_PATH
node tests/codec.test.cjs
CHROME_PATH=/path/to/chromium node tests/smoke.test.cjs /tmp/arcade-shots
# per-cabinet soundtrack check (mashes inputs, reports tempo/layers/notes)
CHROME_PATH=/path/to/chromium node tests/music-check.cjs [xa_game_id ...]
CHROME_PATH=/path/to/chromium node tests/bundle-patch.test.cjs
```

## Known limits (v1.3 contract)

- No score cap and no registered game-id list, so any wallet can post any number
  under any id. A v1.4 with per-game max score and an admin game registry is the fix.
- One wallet can hold several top-10 slots.
- Test hooks (`instance.debug()`) are read-only and only report what is already
  on screen; Mine Sprint deliberately never exposes mine positions.
- Scores are client-reported. Runs use a seeded RNG (`api.seed`), so a later
  version could submit seed + input log for replay verification.
