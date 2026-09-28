# Xtrata Arcade Room (v2.1 prototype, all 21 cabinets + music engine)

One recursive parent that hosts an arcade room of cabinets. Every cabinet is its
own leaf inscription and posts to the **same** score contract
(`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-arcade-scores-v1-3`) under its
own `game-id`. Adding game #4…#21 means inscribing one more cartridge and a new
parent that lists it.

| Cabinet     | Leaf                         | game-id          | Controls |
|-------------|------------------------------|------------------|----------|
| Neon Snake  | `modules/game-neon-snake.js` | `xa_neon_snake`  | arrows/WASD, swipe, d-pad · stages, portals, power-ups |
| Block Drop  | `modules/game-block-drop.js` | `xa_block_drop`  | ←→ ↑/X Z Space C, swipes, 7 pads |
| Cave Diver  | `modules/game-cave-diver.js` | `xa_cave_diver`  | hold Space/↑, touch-and-hold · four depth zones |
| Orbit Merge | `modules/game-orbit-merge.js` | `xa_orbit_merge` | mouse aim + click, ←→ Space, drag + lift |
| Block Runner | `modules/game-block-runner.js` | `xa_block_runner` | Space/↑ jump (hold = higher), ↓ duck, tap / swipe down |
| Brick Breaker | `modules/game-brick-breaker.js` | `xa_brick_breaker` | mouse or ←→, Space launch/laser, drag + tap · 20 levels, 4 bosses |
| Rock Drift | `modules/game-rock-drift.js` | `xa_rock_drift` | ←→ turn, ↑ thrust, Space fire; 4 touch pads |
| Stack Tower | `modules/game-stack-tower.js` | `xa_stack_tower` | Space / click / tap to drop |
| Road Hopper | `modules/game-road-hopper.js` | `xa_road_hopper` | arrows/WASD, swipe or tap, d-pad |
| Tile Tap | `modules/game-tile-tap.js` | `xa_tile_tap` | ← ↓ ↑ → or 1–4, click/tap a lane |
| Merge 2048 | `modules/game-merge-2048.js` | `xa_merge_2048` | arrows/WASD, swipe, d-pad |
| Block Defence | `modules/game-block-defence.js` | `xa_block_defence` | click/tap to fire; arrows + Space, Z X C per silo |
| Maze Muncher | `modules/game-maze-muncher.js` | `xa_maze_muncher` | arrows/WASD, swipe, d-pad |
| Invader Wave | `modules/game-invader-wave.js` | `xa_invader_wave` | ←→ + Space (hold to fire); ◀ ▶ FIRE pads |
| Helix Drop | `modules/game-helix-drop.js` | `xa_helix_drop` | drag or ←→ to spin |
| Bubble Pop | `modules/game-bubble-pop.js` | `xa_bubble_pop` | mouse aim + click, or ←→ + Space; C swaps |
| Swerve | `modules/game-swerve.js` | `xa_swerve` | mouse / drag to steer, or ←→ |
| Lunar Lander | `modules/game-lunar-lander.js` | `xa_lunar_lander` | ←→ rotate, ↑ / Space thrust; ⟲ ⟳ THRUST pads |
| Reflex Tap | `modules/game-reflex-tap.js` | `xa_reflex_tap` | click/tap, or keys 1–9 |
| Mine Sprint | `modules/game-mine-sprint.js` | `xa_mine_sprint` | click reveal, hold to flag (or flag mode); arrows + Space, F |
| Pong Streak | `modules/game-pong-streak.js` | `xa_pong_streak` | mouse / drag or ←→ |

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

Leaves total ~399 KB for all 21 games plus the music engine (Astro Blaster's leaves are ~590 KB for one).

## Cartridge contract

A cartridge never sees the wallet. `create(api)` receives:

`W, H, input, audio, fx, rng (seeded), seed, shake(n), addScore(n), setScore(n), getScore(), setStatus(text), gameOver(), pointer()`

`pointer()` returns `{ x, y, down, moved }` in playfield units; `moved` ticks on every move so a game can tell pointer steering from key steering. `input.hit('release')` fires once per touch/click release.

and returns `{ update(dt), render(ctx) }`. The room runs a fixed 60 Hz step,
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

## Still needed on the host (xtrata.xyz)

The public viewer (`src/lib/viewer/public-wallet-bridge.ts`) refuses contract
calls, which is why Astro Blaster scores never landed for other players. Add a
narrow method alongside the existing `GAME_SAVE_METHODS` precedent:

- method `xtrata_submitArcadeScore`, contract pinned to `xtrata-arcade-scores-v1-3`,
  function pinned to `submit-score`
- validate `gameId` `^[a-z0-9_]{3,32}$`, `score` positive integer, `name` 3–12 printable ASCII
- read `get-fee-unit` on the host, build a Deny-mode STX post-condition `≤ fee`
- host-owned review dialog: game, score, name, fee
- follow WALLET-PLAYBOOK §10 (tests, bundle rebuild, desktop + mobile canary)

Until then, posting works when the arcade runs inside the `/runtime` page.

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
```

## Known limits (v1.3 contract)

- No score cap and no registered game-id list, so any wallet can post any number
  under any id. A v1.4 with per-game max score and an admin game registry is the fix.
- One wallet can hold several top-10 slots.
- Test hooks (`instance.debug()`) are read-only and only report what is already
  on screen; Mine Sprint deliberately never exposes mine positions.
- Scores are client-reported. Runs use a seeded RNG (`api.seed`), so a later
  version could submit seed + input log for replay verification.
