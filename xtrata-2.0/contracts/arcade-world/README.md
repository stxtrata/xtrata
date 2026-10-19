# Xtrata Arcade: poster and world contracts

Two contracts for the next Xtrata Arcade (see the Project plan `arcade-world-contracts-plan.md`).
**Nothing here is deployed.** Mainnet only on Jim's explicit go-ahead.

| Contract | What it does |
|---|---|
| `xtrata-posters-v1` | Poster registry: kinds template/image/sheet/live, bounded live set (64), publisher caps, review lane, pins, suppress-by-index, future-start windows |
| `xtrata-world-v1` | Rooms, bays, timed scenes (by burn block height), looks registry (tiers 0 to 3), retract, compact |
| `mock-xtrata-core` | Simnet stand-in for `xtrata-v3-2-3` (five read-only functions) |

Both share: admin (two-step hand-over), pause, successor pointer with one-way lock, version counter
bumped on every write, `print` events on every write, read interface frozen at v1.

## Commands
- `npm test` runs 33 simnet tests (posters, world, live-variant parity).
- `npm run make-live` writes `../live/xtrata-posters-v1.clar` and `../live/xtrata-world-v1.clar`.
  Only the five lines tagged `;; @principal core` differ from the simnet sources (same pattern as the duels contracts).
- `npm run test:integration` runs the two contracts against the real core source (`xtrata-v3.2.3`).

## Admin
Deploy from the admin wallet: the deployer becomes admin (`tx-sender` at deploy).
Planned admin: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`. Use `propose-admin` / `accept-admin` to move it later.
