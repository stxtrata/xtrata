# Xtrata Arcade: poster and world contracts

Contracts for the next Xtrata Arcade (see the Project plans `arcade-world-contracts-plan.md` and `door-skins-plan.md`).
**Nothing here is deployed.** Mainnet only on Jim's explicit go-ahead.

| Contract | What it does |
|---|---|
| `xtrata-posters-v1` | Poster registry: kinds template/image/sheet/live, bounded live set (64), publisher caps, review lane, pins, suppress-by-index, future-start windows |
| `xtrata-world-v1` | Rooms, bays, timed scenes (by burn block height), looks registry (tiers 0 to 3), retract, compact |
| `xtrata-door-skins-v1` | Door skin registry: unique skin keys, tier 0 built-in / tier 1 data recipe (inscription), allowed door styles (bit mask), default frame, hardware, sound and wear, publisher caps, review lane, hide/approve |
| `xtrata-world-v2` | **The Xtrata World Standard (XWS v1) registry** replacing world-v1: one tree of spaces and objects, kinds, timed states, capability grants, policy ceilings, doors with consent, bindings, transfer and sale, and Xtrata's fee share. See below. |
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


## xtrata-world-v2 (XWS v1, interface id `xws-1`)
Design: Project doc `claude/xtrata-world-standard.md`. **Not deployed. Replaces `xtrata-world-v1`, which was never deployed.**

- **Spaces** (root, domains, rooms, plots) form a tree: depth <= 6, 64 children each. **Objects** (floors, walls, doors, signs, machines)
  live in a space, nest 4 deep, hold a kind, a transform, 512 bytes of JSON params (stored, never parsed), up to 4 bindings,
  an optional portal (doors) and a timeline of states by burn block height (8 live).
- **Authority flows down.** A space's policy can only be narrower than its parent's (children, descendants, objects, depth, runtimes,
  kind tiers, binding interfaces, approval, door rules, review lane). Ancestors moderate (suspend, hide, evict) but never edit.
  Owners and delegates build; delegates hold capability bits with inherit and expiry; every grant lapses when the space changes owner (epoch).
- **Root owner and admins.** Two-step hand-over; the owner may be a contract (a multi-signature owner). Admins hold narrow caps:
  PAUSE, KINDS, TRUST, MOD. Only the owner touches fees, admins, treasury and the system lock.
- **Money never sits in the contract.** Creation fees, sales and transfer fees are split in the same transaction: payer to treasury, payer to
  recipient. Xtrata's share is `max(price x bps / 10000, flat)`, rounded down, applied at every level; the root owner creates for free.
  Caps are in the code (25% and 50 STX); increases take effect after 144 burn blocks, decreases at once. Everything is zero at launch.
- **Bindings** attach behaviour contracts. The interface code says how the hall reads the contract (1 display, 2 state, 3 gate, 4 action).
  Action contracts (anything that can move money) must be on the approved list in every space; other interfaces only where a space requires approval.
  There is no on-chain traits contract: the hall reads bindings by function name, and a traits contract can be added later without touching this one.
- Kinds with inscriptions (recipes and modules) and space entries are checked against the core (sealed, hash and size match; kinds also need the creator).

Codes are listed at the top of `contracts/xtrata-world-v2.clar`. Tests: `tests/world2-spaces.test.mjs`, `tests/world2-objects.test.mjs`
(each test boots its own simnet), `integration/real-core.test.mjs` for the real core. `mock-world-owner-v2` is a simnet-only contract that
acts as a contract-based root owner.
