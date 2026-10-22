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

* Full read (about 20 read-only calls for the demo; concurrency 4): `get-version`; `resolve-path` x2; `get-space` x2; `get-objects`
  pages (16 per page, at most 8 pages per space, only up to the space's `object-slots`); `get-kinds` (<= 20 ids per call);
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
  state counts. Object ids come from one counter shared by spaces and objects (`next-id`, starts at 2); the tools predict them,
  so the relay packs must land in order and in full. Verify with `node ops/v2.mjs read`.
* The timeline holds **8 live states per object**; `--compact` prepends `compact-object` (drops past states). `retract-state` also frees a slot.
* A scene file (`arcade-scene-file/1`) becomes: the bay's states (one per scene), one child object per element identity (kind +
  occurrence in the scene), created with the params of its first appearance, plus hide/show/patch states where a later scene
  differs. `link` becomes `set-portal` on the bay (one per bay). v1's per-scene `state` (curtain `closed`) is the `state` param.
