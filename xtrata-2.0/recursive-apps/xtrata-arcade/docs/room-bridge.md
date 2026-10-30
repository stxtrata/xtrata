# Rooms in the Xtrata Arcade: how a door opens a room, and the room bridge (protocol version 1)

This is for people who make a room that the arcade hall opens through a door, and for the tools that put rooms in the world registry
(`xtrata-world-v2`). The hall side is `src/parts/hall.js` (the room section), `src/parts/world2.js` (the reads) and, for signing,
`src/parts/score-client.js` (`callContract`) and `src/parts/arcade-room.js` (`confirmCall`). Tests: `tests/world2.test.cjs`,
`tests/hall-room.test.cjs`, `tests/hall-bridge.test.cjs`, `tests/hall-lobby.test.cjs`, `tests/hall-parent.test.cjs` (scenario 7).

**The protocol in section 4 is frozen at version 1.** New abilities are added as new message types and new `XA_ROOM` members, never by
changing what an existing one does. `XA_ROOM.version` says which version the hall speaks.

## 1. A door leads to a space

A door is an object with a portal (`set-portal`): `{ to-space, arrival, path }`. The hall reads the destination space **when the door is
used** (when you open it near enough to preload, and again when you walk in; a result is kept for 15 s, a failed read is never kept):

| destination (`get-space`) | what happens |
|---|---|
| the hall's own lobby: `slug` `lobby`, `runtime` 0 (native), state live, and it is the lobby the hall reads its doorways from | the see-through lobby built by the hall, behind the door: you just walk in |
| live (`state` 1) with an `entry` | the room opens: its entry page, full screen |
| live, no `entry` | `THIS DOOR LEADS TO <TITLE> · NOT OPEN YET` |
| draft (0), suspended (2) or retired (3) | `THIS DOOR LEADS TO <TITLE> · CLOSED` (a draft space is closed, not open) |
| the read failed | `COULD NOT CHECK THE DOOR · TRY AGAIN` (never "not open": a failed read is not an answer) |
| `entry.size` over 16 MB | `… TOO BIG TO OPEN HERE (<size>, THE LIMIT IS 16 MB)`; nothing is read |
| no such space | the door has no link (a closed door you can knock on, as before) |

Any runtime other than the hall's own lobby is opened as a page: native (0), composed (1), page (2) and hosted (3). The runtime only decides
what the page may ask the hall for (section 4).

The **title** is shown in the door's prompt (`OPEN THE DOOR · ROYAL FLUSH CASINO`), on the loading screen and on the BACK button. It is
reduced to printable ASCII (the reader) and then to the sign alphabet `A-Z 0-9 . , ! ? : ' & / -` (the hall), upper case, at most 32
characters, and is only ever set as text (`textContent`, or drawn on a canvas), never as HTML.

## 2. The entry page

`entry = { id, hash, size }` (`set-space-entry`): an Xtrata inscription id, its **chain hash** (the Xtrata core's chunked hash: for each
16 KiB chunk `h = sha256(h ‖ chunk)`, starting from 32 zero bytes; the core checks it when the entry is set) and its size in bytes.

The hall fetches the inscription with `XAScores.getInscription(id, hash)`: the xtrata.xyz gateway (`/i/<id>?raw=1`) first, used only if its
chain hash matches; otherwise the chain (`get-inscription-meta`, `get-chunk-batch`), which must match too. Then the size must equal
`entry.size`. Anything else: `THE ROOM COULD NOT BE LOADED. YOU CAN GO BACK`. The bytes are decoded as UTF-8 and framed as `srcdoc`.

The page is one HTML file. It may load nothing it does not carry, with one exception:

- **three.js**: write `<script data-xa-part="three.js"></script>` (empty), or keep the cdnjs r128 tag
  (`<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`) so the file also works on its own. The hall
  replaces the first of these with its own copy of three.js r128 (the `three` pack; the inscribed parent hands it over as
  `window.XA_PARTS.threeText()`). The room gets its own copy, in its own frame.

The hall puts one script at the very top of `<head>` (or of the page, if it has no `<head>`): the bridge (section 4).

### The room's frame

```
<iframe sandbox="allow-scripts allow-pointer-lock allow-downloads" allow="autoplay; fullscreen; clipboard-write" srcdoc="…">
```

Never `allow-same-origin`, whatever the runtime. So the room has an opaque origin (`window.origin === 'null'`): no `localStorage`, no
cookies, no access to the hall's page, wallet or storage (`parent.document` throws). It can `fetch` public APIs that answer with CORS
(e.g. Hiro: the hall's read hosts are in `XA_ROOM.apiBases`). It cannot navigate the hall. Keep anything you store in memory, or wrap
storage in `try/catch` and carry on without it.

## 3. The door's entry picture (optional)

A door may carry a picture of the room's first view, shown in the open doorway with parallax and used for the glide when you walk in.
Its params (the door object's own params, or the bay's state patch; the bay's own params win over a `door-<style>` child's):

| key | value |
|---|---|
| `still` | inscription id of the colour picture (PNG, JPEG or WebP; 2304×1296 at 80° vertical field of view, see `build/snap-room.cjs`) |
| `stillHash` | its chain hash, 64 hex characters |
| `depth` | inscription id of the depth map (768×432, 12 bits packed in R and G over 0..32 m) |
| `depthHash` | its chain hash |

Both are fetched hash-checked like a poster's picture. A door without a (loadable) still simply has none.

## 4. The bridge: `window.XA_ROOM` (version 1, frozen)

Available before any of the page's own scripts run:

```js
window.__XA_FROM_ARCADE   // 1: you were opened by the arcade (start walking just inside your door)
window.XA_ENTRY           // frozen { from, door, arrival }
                          //   from:    slug of the space you came from ('lobby', 'hall', or a room's slug)
                          //   door:    name of the door object you came through ('bay-0'… in the hall and lobby, or a room's own door name)
                          //   arrival: the portal's arrival (an object id in YOUR space to put the player at, or 0)
window.XA_ROOM            // frozen:
  .version                //   1
  .title .slug .runtime   //   your space's title (sign alphabet), slug, runtime code
  .network                //   'mainnet' | 'testnet'
  .apiBases               //   the hall's read hosts (Hiro, or a site proxy), for your own read-only calls
  .ready()                //   tell the hall you have drawn your first frames (it shows you then; without it, 2.5 s after load)
  .leave()                //   go back (as the BACK button)
  .go(doorName)           //   -> Promise; walk through one of YOUR space's doors (rejects when refused; when accepted your page
                          //      is replaced at once, so do not wait for it to resolve)
  .call(req)              //   -> Promise<txid>; hosted rooms only
  .account()              //   -> Promise<address | null>; hosted rooms only
```

Rejections are `Error`s with a `code`:

| code | meaning |
|---|---|
| `unknown-door` | your space has no visible object of that name with a portal |
| `closed`, `not-open`, `too-big` | the destination is closed / live without an entry / over 16 MB (the hall also shows the line over your page) |
| `could-not-check` | a read failed (the door, the destination, or `is-approved`); nothing happened, try again |
| `busy` | another `go` or `call` is still in progress |
| `not-hosted` | `call`/`account` from a room whose runtime is not 3 (hosted) |
| `not-approved` | the contract is not on the registry's approved list (`is-approved`) at the time of the call |
| `bad-request:<field>` | `contract`, `fn`, `args`, `maxStx` or `postConditions` is malformed |
| `cancelled` | the player said no (in the hall's dialog or in the wallet) |
| `not-available` | this hall cannot do it here (no registry, a preview room) |
| any other text | the wallet's own error, e.g. an account other than the one confirmed ("… Nothing was signed.") |

### `go(doorName)`

The hall reads your space's objects (`get-objects-8`, the lowest id with that `name`, object state visible, its active state not hidden,
with a portal), then the destination exactly as for a hall door (section 1). A destination that is the hall's own lobby takes the player
back into the 3D hall. Otherwise the new room replaces yours (your frame is removed: everything you built is freed) and gets
`XA_ENTRY = { from: <your slug>, door: <doorName>, arrival: <portal arrival> }`.

**Back at any depth.** The hall keeps where you came from. BACK (or `leave()`) re-opens the room before, read again from the chain, with
`XA_ENTRY = { from: <the room you are leaving>, door: <the door you went through>, arrival: <that door's object id> }`, so it can put
the player back at that door. At the bottom you are back in the hall, a step in front of the door you came in by. The button says
`BACK TO <TITLE>`, or `BACK TO THE LOBBY` / `BACK TO THE HALL` at the bottom. A destination whose entry or state changes while you are
inside changes nothing until you leave.

### `call(req)` (hosted rooms only)

```js
XA_ROOM.call({
  contract: 'SP….casino-holdem-v1',   // must be approved on the registry (is-approved), checked at the moment of the call
  fn: 'join-table',                   // Clarity function name
  args: ['0x0100…'],                  // Clarity values, hex (with or without 0x), at most 32
  maxStx: '0.25',                     // the most the call may spend, in STX (a decimal string or number, up to 6 places)
  postConditions: [{ type: 'stx', amount: '250000' }]   // optional; may only restate the cap (micro-STX <= maxStx)
}).then((txid) => …)
```

The hall then shows its own dialog (the room's title, the contract, the function, the cap and the network-fee warning). On "Open my
wallet" it signs through the hall's wallet path (`XAScores.callContract`, the same routes and rules as a score post, see
`docs/WALLET-PLAYBOOK.md`): no `sender`; post-condition mode **deny** with exactly one STX post-condition, "the connected account sends
at most maxStx", so the call can move nothing else (no tokens, no NFTs, no more STX); bare-hex arguments; an account other than the one the
dialog named aborts the call. The promise resolves with the txid once the wallet has broadcast it; wait for confirmation yourself
(`XA_ROOM.apiBases` + `/extended/v1/tx/<txid>`).

### `account()` (hosted rooms only)

The address the hall's wallet is connected as, or `null`. It never opens the wallet.

### Messages (what the script sends; for reference)

The script talks to `window.parent` with `postMessage`; the hall listens only to the current room frame's own window and answers it:

| room → hall | hall → room |
|---|---|
| `{xa:'room-ready'}` | |
| `{xa:'leave-room'}` | |
| `{xa:'go', id, door}` | `{xa:'result', id, ok:true}` or `{…, ok:false, error}` |
| `{xa:'call', id, contract, fn, args, postConditions, maxStx}` | `{xa:'result', id, ok:true, txid}` or `{…, ok:false, error}` |
| `{xa:'account', id}` | `{xa:'result', id, ok:true, address}` or `{…, ok:false, error}` |

Pages written for earlier halls that post `{xa:'room-ready'}` and `{xa:'leave-room'}` themselves keep working.

## 4b. Music in every room: the radio dock (part of the hall, not of any room)

The hall puts one small **RADIO** button (bottom left, above the room, below the BACK button's layer) on every screen where you can walk or are in a room.
It opens Xtrata Radio (`https://radio.xtrata.xyz/radio`, the one origin the listening wallet trusts) in a panel that belongs to the hall page, so:

- A room does nothing to get it, and cannot see, move or reach it (rooms run in their own sandboxed frames). A room should leave the bottom-left corner clear.
- It keeps playing as you go through doors: closing the panel only hides it. The radio is loaded the first time it is asked for, never at start.
- During a game the button steps aside (games take the whole screen); the music carries on.
- The panel's frame grants passkeys to the radio origin only, and is sandboxed so it cannot navigate the hall away. All money, passkey and album logic stays in the radio page; the hall holds none.
- The hall's own machine music turns off the first time the radio is opened (the hall's music button brings it back).

- The panel asks the radio for its compact one-screen layout with `?dock=1` (`RADIO_URL` is `/radio?dock=1`). That layout is opt-in inside the radio page: without the flag the standard radio is unchanged.
- **POP OUT** (in the panel's bar) opens the same radio in its own small window. That window is a top-level page, so Xverse, the listening wallet and passkeys work and paid plays count; inside the panel they cannot (the listening wallet only allows radio.xtrata.xyz as its parent, and extension wallets inject into the top page only). Popping out takes the panel's copy down so there is one radio; the RADIO button then focuses the pop-out; closing it brings the panel back. If the browser blocks the window, the link opens a tab and the panel stays.
- On a branch preview (`*.pages.dev`) the hall loads that branch's own `/radio?dock=1`, so a radio-page change can be seen before it ships.

A future room type needs nothing here: it inherits the dock because the dock lives in the hall's own frame.

## 5. A minimal room

```html
<!doctype html>
<html><head><meta charset="utf-8"><title>My room</title>
<script data-xa-part="three.js"></script>
</head><body style="margin:0;background:#000">
<script>
  const R = window.XA_ROOM;                      // undefined when the page is opened on its own
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.05, 60);
  const gl = new THREE.WebGLRenderer({ antialias: true }); gl.setSize(innerWidth, innerHeight); document.body.appendChild(gl.domElement);
  scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())); camera.position.set(0, 1.6, 3);
  let frames = 0;
  (function loop() { gl.render(scene, camera); if (++frames === 3 && R) R.ready(); requestAnimationFrame(loop); })();
  // where did the player come in?
  if (window.XA_ENTRY) console.log('came from', XA_ENTRY.from, 'through', XA_ENTRY.door);
  // a door of this room's own space (an object named "to-gallery" with a portal)
  addEventListener('keydown', (e) => {
    if (e.key === 'g' && R) R.go('to-gallery').catch((x) => console.log('not now:', x.code));
    if (e.key === 'Escape' && R) R.leave();
  });
</script>
</body></html>
```

Inscribe it, then `set-space-entry(space, { id, hash: <chain hash>, size })`, `set-space-runtime` if it is not native, and set the space
live. A door anywhere in the world that portals to the space now opens it.

## 6. Registry schema additions the hall relies on (for `contracts/arcade-world/docs/HALL-V2-SCHEMA.md`)

- **Reads** the hall makes: `get-version`, `resolve-path`, `get-space`, `get-object-ids` (16 ids a page, at most 8 pages per space, up to
  its `object-slots`), `get-object-view` per id, `get-kinds` (<= 20 ids), `get-objects-8` (doors of a room's own space, at most 16 pages),
  `is-approved` (at call time). Never `get-objects` or `get-children` (over the node's read limit).
- **Only a live space is open.** Draft, suspended and retired spaces: their bays show posters and a door to them says CLOSED (the schema
  doc's "a space that is not draft/live" becomes "a space that is not live").
- **Lobby doorways:** the lobby space holds `bay-0` … `bay-5`; the hall shows as many doorways as the highest present index + 1 (two on the
  back wall first, then the side walls). `rooms.lobby.bays` is never shorter than two entries (the two old places; `null` where there
  is no object), up to six. The hall's bays stay `bay-0` … `bay-3`.
- **Destination fields** read from `get-space`: `slug`, `title`, `state`, `runtime`, `entry {id, hash (chain hash), size}`, `parent`.
  `scene.link` from the reader: `{ 'target-room': <slug>, 'arrival-bay': 0, path: '', to, arrival, title, lobby, still, depth }`;
  `lobby` is true only for the hall's own lobby space when it is live and native.
- **Door params:** `still`, `stillHash`, `depth`, `depthHash` (inscription ids and chain hashes) on the bay object (or its state patch) or on
  its `door-<style>` child.
- **Portal `arrival`** is passed to the room as `XA_ENTRY.arrival`; room doors are found by object `name` in the room's own space.
- **Hosted rooms** (runtime 3) may ask the player to sign calls to contracts on the registry's approved list (`approve`/`is-approved`).
- **Entry size**: the hall opens at most 16 MB.
