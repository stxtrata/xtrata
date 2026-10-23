# The hall on xtrata-world-v2: object, state and params schema

This is the contract between the **reader** (`recursive-apps/xtrata-arcade/src/parts/world2.js`, run inside the hall) and the
**tools** that fill the registry (`ops/v2.mjs`, `ops/lib/v2.mjs`). `xtrata-world-v2` stores all of it as opaque text and numbers
(it never parses params or patches); everything below is a convention both sides keep, and the tests keep them honest
(`tests/hall-v2-seed.test.mjs` runs the tools against the real contract and reads the result with the hall's own reader;
`recursive-apps/xtrata-arcade/tests/world2.test.cjs` and `hall-world2.test.cjs` run the reader and the hall on recorded results).

The hall reads this **only** when `XA_WORLD_CONFIG.registry` is set. Posters stay on `xtrata-posters-v1` and the centre screen on
`xtrata-screen-v1`. With no `registry` the hall behaves exactly as before (v1 scene contract or nothing).

## Hall configuration

```js
window.XA_WORLD_CONFIG = {
  posters:  'ST…deployer.xtrata-posters-v1',
  registry: 'ST…deployer.xtrata-world-v2',      // switches the bays to the object registry (replaces `world`)
  path:      ['arcade', 'hall'],                  // default: the hall's space
  lobbyPath: ['arcade', 'lobby']                  // default: path minus its last slug, plus 'lobby'
};
```

## Spaces

```
root (1)
└── arcade   domain  (kind 0)   children <= 16, tiers all
    ├── hall   room (kind 1)    leaf; tier-0 (built-in) kinds only; native runtime; no bindings; objects <= 128
    └── lobby  room (kind 1)    same, objects <= 64
```
Owner on testnet: the deployer wizard (root owner). All three are set live (state 1) after creation (a portal target must be live).
The reader resolves `path` with `resolve-path` and reads that space's objects; a space that is not draft/live (suspended, retired),
or a path that does not resolve, is an empty room: its bays show posters.

**Hall only first.** `node ops/v2.mjs seed <hall file> --hall-only` builds the arcade and the hall and nothing of the lobby (no lobby
space, no lobby bay objects): the reader's `lobbyPath` then does not resolve and the lobby reads as an empty room. `node ops/v2.mjs lobby
[lobby file]` adds the lobby later (space, live, its two bays, the delegates' grants there, any lobby scenes). A hall-only seed refuses a
hall scene that links to the lobby: leave that bay out, plan the lobby, then seed that bay.

**Rooms that open from an entry.** `node ops/v2.mjs room --slug casino --title "…" --entry <inscription id>` plans `create-space`,
`set-space-entry` (id, hash and size read from the core: `get-inscription-hash`, `get-inscription-size`, refused unless
`is-inscription-sealed`) and `set-space-state` live, in that order. The hall reads `get-space(id).entry` and opens the room from that
inscription. `--entry` on a room that exists plans only `set-space-entry`.

## Contract rules the hall and tools rely on (second review, 23 Oct 2026)

* **Moderation is sticky by level.** Suspending a space (state 2), pausing it from above (paused 2) and moderating an object (state 3)
  record who did it: **3** the root owner, **2** an admin (MOD; PAUSE for pauses), **1** the owner of an ancestor space. Only that level
  or higher lifts or changes it, and never the space's own owner (unless they are the root owner): a plot owner cannot lift what the root
  placed on a room inside her plot. Read it with `get-moderation(id)` → `{ space: { state, pause }, object }` (0 = none). `get-space` and
  `get-object` are unchanged. The reader treats a suspended space or a moderated object as before (posters / left out).
* **Review lane.** Where a space's effective policy has `review` on, `add-state`, `add-states`, `set-space-title` and `set-space-entry`
  from anyone but the space's owner, the root owner or a moderator fail with **u320** (`ERR-REVIEW`); objects, bindings and doors from
  delegates still go in hidden until the owner shows them. The hall's spaces have no review lane; the reader is unchanged.
* **Delegate-issued grants** hold only while the issuer still holds GRANT through its own grant on that space (revoked, expired or
  downgraded issuer: everything it issued stops). Delegates issue only where they hold such a grant (not through an inherited one).
* **Publisher / bot grants are STATE only** (`--delegate publisher [--delegate-expires +30d]`): they change what existing objects show
  and never add objects, bindings or doors.
* **A CHILD holder** may create a space owned by itself (how plots are claimed) and keeps it after its grant ends. Never grant CHILD on
  the arcade domain or any system space; moderation from above still applies to such a space.
* **Doors, consents, approvals and kinds are checked when they are set.** The hall re-checks at use time: the target is live (`is-open`),
  a consent is still in the target's epoch, a binding's contract is still approved, a kind is still approved and not hidden.

## Kinds (registered once, tier 0 = built-in, by the root owner or a KINDS admin)

`register-kind(space=1, category, name, tier=0, builtin=<key>, src-id=0, src-hash=0x, src-size=0)`. The reader never relies on
kind *ids*; it reads `get-kinds` for the ids its objects use and goes by the `builtin` key. Order on a fresh registry (ids 0..23):

| builtin key | category | engine slot | what |
|---|---|---|---|
| `bay` | 7 door | – | a wall bay (category 7 because only category-7 objects can carry a portal) |
| `curtain-house` | 8 cover | 1 | the curtain |
| `sign-board` | 6 display | 2 overlay | a sign |
| `caution-tape` | 3 prop | 2 overlay | tape across the bay |
| `work-site`, `hum` | 5 audio | 3 sound | work sounds, room hum |
| `light-steady`, `light-pulse`, `light-flicker` | 4 light | 4 light | the lamp |
| `door-skin` | 1 material | 2 overlay | a door's finish (also expressible in the door's own params) |
| `door-rect`, `-tall`, `-wide`, `-arch`, `-gothic`, `-double`, `-cathedral`, `-circle`, `-oval`, `-hexagon`, `-octagon`, `-industrial`, `-vintage`, `-scifi` | 7 door | 0 door | the door styles (`DOOR_STYLES` in `bays.js`) |

Only tier-0, approved, not-hidden kinds with a key the bay engine knows are drawn. Anything else is ignored. **New kinds** (a
new built-in key shipped with a later hall, or a data recipe) are registered later with another `register-kind`; objects of an
unknown kind are skipped by an older hall.

## Bay objects

In the hall space: four objects with `parent-obj = 0`, kind `bay`, `name = "bay-0"` … `"bay-3"`:

| name | place | `hall.js` code |
|---|---|---|
| `bay-0` | far left | `L` |
| `bay-1` | far right | `R` |
| `bay-2` | near left (entrance end) | `NL` |
| `bay-3` | near right | `NR` |

In the lobby space: `bay-0`, `bay-1` (the two back-wall doorways; the engine's bays 4 and 5). Transform is unused (x=y=z=0, yaw 0,
scale 100). Object params are `{}` (a bay may carry default keys that its states' patches add to).

**Bay states** (the timeline of the bay object) say what the bay *is*:

* `patch` JSON: `{"base":"posters"|"wall"|"door"}` (anything else is `posters`).
* `visibility`: `0` shown, `1` hidden. A hidden active state shows posters.
* `interaction`: `0` none, `1` knock, `2` peek, `3` enter. `3` needs a portal on the bay object.
* **No active state = posters, with nothing added.** (The children are only drawn while the bay has an active, visible state.)
  Children of a bay whose base is `posters` are still drawn (a sign over the posters), as in v1.
* The bay object's own state `hidden`/`retired`/`moderated`, or a bay object that is missing or of a hidden/unapproved `bay` kind,
  also means posters (the bay reads as `null`).
* **Portal** (`set-portal` on the bay object): `{to-space, arrival: 0, path: ""}` to a live space, or `{to-space: 0, path: "/site/path"}`.
  The reader turns it into `scene.link = { 'target-room': <destination slug>, 'arrival-bay': 0, path }` (the shape `hall.js` reads:
  `link['target-room'] === 'lobby'` makes the lobby open behind that door). A portal that cannot be read (unknown space, unsafe
  path) is no link, and `enter` is downgraded to `knock` (door) or `none`.

## Layer objects (children of a bay)

One object per element, `parent-obj = <bay object id>`, same space, nesting depth 2, at most **32 per bay** (the contract's own
limit), at most 128 objects read per space. Name: any short name (the tools use `sign`, `sign-2`, `curtain`, `tape`, `lamp`, `door`, `skin`, `work`, `hum`).

* **Own timeline.** Each child's `params` (<= 512 chars) are its look; each state's `patch` (<= 256 chars) is a *difference from
  the object's params* that applies while the state is active. Active state replaces the previous one *entirely* (patches are not
  cumulative), so a patch always states every key that differs from the object's params.
* `visibility 1` on the active state hides the child. `visibility 0` (or no active state) shows it. A child whose object state is
  hidden/retired/moderated, or whose kind is hidden, is omitted. `interaction` on child states is unused (0).
* Resolved params = `params` merged with the active `patch` (a patch key replaces; a patch value `null` removes the key). They
  are cleaned: at most 16 keys; key `[A-Za-z][A-Za-z0-9_-]{0,23}`; values are strings (printable ASCII, <= 160), finite numbers,
  booleans or a list of up to 8 short strings; anything else is dropped. JSON that does not parse, is not an object, or is
  longer than the limits gives `{}`. Then the bay engine clamps each value with its own `norm()` (`bays.js`).
* Reserved key **`state`**: becomes the layer's `state` (`curtain-house`: `open` | `half` | `closed`; `work-site`, `hum`, lights:
  `off`). It is not passed on as a param. Opening a curtain is one `add-state` with `{"state":"open"}`.
* **Order and slots.** Children are ordered by object id (creation order). The engine takes one cover, one sound and one light
  (the newest wins) and up to 4 overlays (signs, tape, door-skin; the oldest first). A door-skin from the door's own params counts
  as the first overlay.
* **Door.** When the bay's base is `door`, the newest visible `door-<style>` child is the door: `scene.doorLook` is its kind id and
  the engine uses the style from its key (a bay with base `door` and no door child gets the classic door). A door's own params may
  carry `skin`, `frame`, `hardware`, `tint`, `wear` (the `door-skin` param names): a non-empty `skin` becomes a door-skin layer
  (look `v2:door-skin`) in front of any skin child objects. When the base is not `door`, door children are ignored.

### Params per kind (the hall clamps everything)

| key | params |
|---|---|
| `curtain-house` | `color` `#rrggbb`, `trim` `#rrggbb`, `openness` 0..1, `speed` 0.1..5, `state` |
| `sign-board` | `text` (<= 22), `sub` (<= 34), `tone` blue/orange/gold/white/red/green, `x` -3..3, `y` 0.4..2.9, `w` 0.4..3, `front` bool |
| `caution-tape` | `y` 0.4..2.6 |
| `work-site` | `kinds` (list or comma text of hammer, saw, drill, clatter), `volume` 0..1, `radius` 2..12, `gap` 0.3..8, `state` |
| `hum` | `volume`, `radius`, `pitch` 40..400, `state` |
| `light-steady`, `light-pulse`, `light-flicker` | `tone`, `intensity` 0..2, `rate` 0.2..8, `state` |
| `door-skin`, `door-*` | `skin`, `frame`, `hardware`, `tint`, `wear` (see `door-skins.js`) |

## What the reader hands the engine

`XAWorld.snapshot()` is the same shape as with v1:

```
bays[0..3]            exactly four entries; null when there is no (usable) bay object
rooms.lobby.bays[0..1]
bays[i] = { scene: null | { base, baseId, interaction, doorLook, layers: [{slot, look, params, state, obj}], link, fromHeight, params },
            nextHeight, height }
looks   = { <kind id>: { kind: <slot 0..4>, name, tier, builtin, hidden, approved },  'v2:door-skin': {…} }
src     = <registry id>          (the snapshot cache is only reused for the same registry)
```
`layer.params` is a JSON string, or an object when the merge is longer than 256 characters (`bays.js` accepts both).
`nextHeight` is the earliest `next-height` of the bay and all its children; the hall reads again when the chain height reaches it.

## Reading, polling and failure

* **Read budget.** A stock node allows 30 map reads per read-only call (and caps read_length). A full 16-row page of `get-objects` or
  `get-children` is 35 reads: those two stay for compatibility only. The hall uses the light pages below; every read it makes is held
  to **<= 24 reads and <= 90,000 read_length** in the worst case the contract accepts (`tests/world2-review2.test.mjs`, H2; print the
  table with `node tests/world2-costs.mjs`). The contract source (~74.5 KB) counts towards read_length on every call.

  | read | returns | worst case |
  |---|---|---|
  | `get-object-ids(space, page)` | `(list 16 (optional uint))`: the object ids at slots page*16 .. +15 (no object rows) | 19 reads, ~75.6 K |
  | `get-objects-8(space, page)` | the `get-objects` row shape, 8 per page (slots page*8 .. +7) | 19 reads, ~88 K |
  | `get-child-ids(parent, page)` | `(list 16 (optional uint))`: child space ids at slots page*16 .. +15 | 19 reads, ~75.6 K |
  | `get-children-8(parent, page)` | the `get-children` row shape, 8 per page | 19 reads, ~82 K |
  | `get-kinds` (20 ids), `get-object-view` (8 states), `get-space`, `resolve-path` (6), `get-timeline`, `get-version` | as before | <= 23 reads, <= 81 K |

  Either read objects with `get-objects-8` pages up to the space's `object-slots`, or `get-object-ids` and then only the rows needed.
* Full read (about 20 read-only calls for the demo; concurrency 4): `get-version`; `resolve-path` x2; `get-space` x2; object pages
  (`get-objects-8`, 8 per page, only up to the space's `object-slots`; older halls used `get-objects`); `get-kinds` (<= 20 ids per call);
  `get-object-view` for each bay and each child; `get-space` for each portal destination (slug).
* Poll every 240 s (`pollMs`): `get-version` of the posters and the registry. If the registry's global version is unchanged:
  nothing else. If it moved (any write anywhere in the world): `resolve-path` x2, `get-space` x2 and `get-kinds` for the kinds in
  use; the hall reloads only if the hall/lobby spaces' version/object count/state or a used kind's hidden/approved flag changed.
* Scheduled changes need no write, so `onHeight` re-reads once the chain height passes the earliest `nextHeight` (at most every 30 s).
* **A read that fails throws; `world.js` keeps the last good snapshot** (or the localStorage copy, key `xa-world-snap-v1`, used only
  if its `src` equals the configured registry). With nothing at all the hall shows its posters, exactly #3111. A registry that
  answers but has nothing for the hall gives four `null` bays: posters.

## Tool conventions (`ops/v2.mjs`)

* A **manifest** (`ops/out/v2/hall-v2.manifest.json`) records ids, each object's base params, the patch it shows now, and the
  state counts. Object ids come from one counter shared by spaces and objects (`next-id`, starts at 2); the tools **predict** them,
  so the relay packs must land in order and in full. `node ops/v2.mjs verify` (or `read --verify`) reads the chain back in plan order
  (kinds, spaces and entries, objects, grants) and **stops at the first mismatch**: everything after it in the manifest is wrong.
* **For a browser.** `ops/lib/v2-plan.mjs` has no imports at all. `launchCalls({ network, owner, publisher?, publisherExpires?, rooms? })`
  returns `{ contract, calls: [{ fn, args, note }], manifest }`, the whole hall-only launch in order; `clarityArg(arg, Cl)` turns each
  argument into a Clarity value with the page's own `@stacks/transactions`; `verifyManifest(manifest, read)` checks the result.
  `HALL_KINDS` there is a frozen copy of the kind list the Node tools read from the hall's source (a test keeps them equal).
* The timeline holds **8 live states per object**; `--compact` prepends `compact-object` (drops past states). `retract-state` also frees a slot.
* A scene file (`arcade-scene-file/1`) becomes: the bay's states (one per scene), one child object per element identity (kind +
  occurrence in the scene), created with the params of its first appearance, plus hide/show/patch states where a later scene
  differs. `link` becomes `set-portal` on the bay (one per bay). v1's per-scene `state` (curtain `closed`) is the `state` param.
