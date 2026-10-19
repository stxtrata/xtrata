# Xtrata Arcade: poster and world contracts

Three contracts for the next Xtrata Arcade (see the Project plans `arcade-world-contracts-plan.md` and `door-skins-plan.md`).
**Nothing here is deployed.** Mainnet only on Jim's explicit go-ahead.

| Contract | What it does |
|---|---|
| `xtrata-posters-v1` | Poster registry: kinds template/image/sheet/live, bounded live set (64), publisher caps, review lane, pins, suppress-by-index, future-start windows |
| `xtrata-world-v1` | Rooms, bays, timed scenes (by burn block height), looks registry (tiers 0 to 3), retract, compact |
| `xtrata-door-skins-v1` | Door skin registry: unique skin keys, tier 0 built-in / tier 1 data recipe (inscription), allowed door styles (bit mask), default frame, hardware, sound and wear, publisher caps, review lane, hide/approve |
| `mock-xtrata-core` | Simnet stand-in for `xtrata-v3-2-3` (five read-only functions) |

Both share: admin (two-step hand-over), pause, successor pointer with one-way lock, version counter
bumped on every write, `print` events on every write, read interface frozen at v1.

## Commands
- `npm test` runs the simnet tests (posters, world, door skins, ops tools, live-variant parity).
- `npm run make-live` writes `../live/xtrata-posters-v1.clar`, `../live/xtrata-world-v1.clar` and `../live/xtrata-door-skins-v1.clar`.
  Only the five lines tagged `;; @principal core` differ from the simnet sources (same pattern as the duels contracts).
- `npm run test:integration` runs the contracts against the real core source (`xtrata-v3.2.3`).

## Admin
Deploy from the admin wallet: the deployer becomes admin (`tx-sender` at deploy).
Planned admin: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`. Use `propose-admin` / `accept-admin` to move it later.

## Door skins
A scene picks a door SHAPE with its door look (`door-gothic`, ...) and a FINISH with the built-in
`door-skin` overlay look, whose params name a skin key: `{"skin":"oak","frame":"stone","hardware":"brass","tint":"#8a5a2b","wear":30}`.
`xtrata-door-skins-v1` is the catalogue of valid skin keys. The world contract never calls it, so skins
can be added without touching rooms, bays or scenes. Register the built-in set with
`node ops/skins.mjs` (dry run by default). New skins after a hall is inscribed are tier 1 recipes
(see `recursive-apps/xtrata-arcade/docs/door-skin-recipe.md`).
