# Xtrata Arcade Room (v1 prototype)

One recursive parent that hosts an arcade room of cabinets. Every cabinet is its
own leaf inscription and posts to the **same** score contract
(`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-arcade-scores-v1-3`) under its
own `game-id`. Adding game #4…#21 means inscribing one more cartridge and a new
parent that lists it.

| Cabinet     | Leaf                         | game-id          | Controls |
|-------------|------------------------------|------------------|----------|
| Neon Snake  | `modules/game-neon-snake.js` | `xa_neon_snake`  | arrows/WASD, swipe, d-pad |
| Block Drop  | `modules/game-block-drop.js` | `xa_block_drop`  | ←→ ↑/X Z Space C, swipes, 7 pads |
| Cave Diver  | `modules/game-cave-diver.js` | `xa_cave_diver`  | hold Space/↑, touch-and-hold |

The `xa_` prefix keeps these boards separate from the older 21-arcade slots.

## Layout

```
modules/
  arcade-room.css     room + HUD + pads styles
  arcade-kit.js       registry, input (keys/pads/swipe/hold), synth audio, particles
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
  smoke.test.cjs      Playwright: parent loader, 3 games, submit via mock host
  mock-host.html      fake xtrata.xyz wallet bridge for the smoke test
index.html            local dev page (not for inscription)
```

Leaves total ~116 KB (Astro Blaster's leaves are ~590 KB).

## Cartridge contract

A cartridge never sees the wallet. `create(api)` receives:

`W, H, input, audio, fx, rng (seeded), seed, shake(n), addScore(n), setScore(n), getScore(), setStatus(text), gameOver()`

and returns `{ update(dt), render(ctx) }`. The room runs a fixed 60 Hz step,
countdown, pause, shake, particles and the game-over screen.

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
2. Inscribe the 7 leaves in manifest order (css, kit, scores, room, snake, blocks, cave)
3. `node parent/fill-ids.mjs --css <id> --kit <id> --scores <id> --room <id> --snake <id> --blocks <id> --cave <id>`
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
- Scores are client-reported. Runs use a seeded RNG (`api.seed`), so a later
  version could submit seed + input log for replay verification.
