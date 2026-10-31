# ParallaX Casino: your own Adrian, a "behind me" view, and personal space (plan)

Written 2026-10-31. **Status: PLAN ONLY.** Nothing built.

Goals (Jim, 2026-10-31):
1. The player has their own Adrian, and can switch the view so the camera sits behind them: they see themselves walk the
   floor, sit at tables and play machines.
2. Personal space: you cannot walk through other players' Adrians; you walk round them. The only exception is a visitor who
   is not signed into the room: they are invisible to everyone, so they are no obstacle, and nobody is an obstacle to them.

## 0. The plan in eight lines

1. Everything needed already exists in `public/casino/index.html`: first-person walking (`player`, `walkMove`, `collide`),
   one camera loop, the Adrian figures (`XA_HOSTS`, `adrian.glb`) drawn for other players, and clothes chosen from the address
   (`wearOf`), so your own Adrian can look exactly the way everyone else already sees you.
2. **Own Adrian:** two figure specs (standing/walking and seated), driven every frame from `player` and `mySpot()`, with the
   same Walk/Idle switching the walkers use. Drawn only in the behind view (in first person the camera is inside its head).
3. **Behind view:** a second camera mode. The camera hangs on a short boom behind and above your Adrian, follows your facing,
   and shortens when a wall or table is in the way. Toggle with **V** or a HUD button; remembered per browser.
4. **Tables and machines:** in the behind view, a seat gets an over-the-shoulder shot of your Adrian and the table; a machine's
   play close-up stays as it is (you need the reels), with the wider shot showing you at the cabinet when you step back.
5. **Personal space:** players walking the floor become obstacles in the existing collider list (`solids`), in the same way
   players standing at machines already are. Each client stops its own player at someone else's Adrian, so it works both ways
   with no server change.
6. It applies only while you are signed into the room (visible). Signed out, you are invisible and pass through, and with
   anonymous watching off you do not see anyone anyway.
7. The arcade-matched walking numbers (`WALK`, checked by the arcade repo's `tests/casino-walk.test.cjs`) do not change; first
   person stays exactly as it is.
8. All of it is page-side (`public/casino/index.html`, plus one small addition to `room.js` so the page knows whether you are
   visible). No server, Worker or wallet change.

## 1. What exists (read from the code, 2026-10-31)

| Piece | Where (`public/casino/index.html`) | What |
| --- | --- | --- |
| Walking | `WALK`, `player {x,z,yaw,pitch,bob}`, `walkMove(dt)`, `EYE = 1.6`, `PR = 0.32` (the player's radius) | First person, the arcade hall's numbers |
| Obstacles | `solids[]`: circles `c`, boxes `b`, ellipses `e`, rotated rects `r`; any entry may have `active()`; `collide()` pushes the player out, two passes | Tables, stools, machines, pillars |
| Camera | Frame loop: while walking, `camera.position = eyePos()`, rotation straight from the mouse; otherwise `camPos/look` ease towards `tgtPos/tgtLook` | One camera, several targets |
| Tables | `setFocus(s, seat)`, `camTargets(s, seat)`, `tableView` buttons | Seated views |
| Machines | `setMachineView(closeup)`, `machineReturn` | Play close-up and step-back views |
| Other people seated / at machines | Presence block: `pool`, `makeEntry(stand)`, `place(spot)`, `show()`; standing entries already have a collider `e.col` active while shown | Each is an `XA_HOSTS` spec (163-bone skinned Adrian) |
| Other people walking | `walkers`, `wpool`, `makeWalker()`, `walkFrame()` (450 ms behind, interpolated, Walk/Idle by speed); comment: they "never block the visitor" | No collider today |
| Your own walking, sent to the room | `ownMoveFrame()` → `px-room-move` (only when signed in, room.js decides) | Others already see you walk |
| Looks | `wearOf(address)`: shirt and trousers from the address hash, `recolour()` | Same for everyone who sees you |
| Cap | `MAXP` = 16 people drawn on desktop, 6 on touch | |

The visitor is never drawn today: `applyPeople` even skips anyone in the visitor's own seat "(the camera would sit inside
their head)".

## 2. Your own Adrian

- `makeSelf()`: two specs added once with `XA_HOSTS.add` (when it has not failed), like `makeEntry(true)` (standing, for the
  floor, machines and pads) and `makeEntry(false)` (seated, `seat: { h: 0.57 }`). Not part of `pool`, so it never takes a
  remote player's slot; it costs one more figure (7 on a phone).
- Clothes: `wearOf(signed address)` when signed into the room, so you see what others see; `wearOf('you')` before that.
  `room.js` tells the page the address (step 5).
- Every frame, in the behind view only:
  - walking: standing spec at `player.x/z`, facing `atan2(-sin yaw, -cos yaw)` (the same conversion `ownMoveFrame` sends);
    Walk when moving, Idle when still, time scale from speed, exactly as `walkFrame` does for others;
  - seated at a table (`mySpot()` is a seat): seated spec at `place(mySpot())`, the same place others draw you;
  - at a machine or a pad: standing spec at `place(mySpot())`.
- Hidden in first person, and faded out when the camera comes within 0.8 m of the head (tight corners).
- Name tag: none for yourself.

## 3. The behind view

- `viewMode`: `'first'` (today) or `'behind'`. Toggle: **V** key, and a small eye button in the top-right tools beside
  Room and Chat. Saved in `localStorage` (`xtrata.parallax.view`), read in a try/catch.
- Walking camera: target = head (`player` + 1.55 m) plus 0.3 m ahead; boom 2.6 m back along the facing, 0.55 m up, tilted by
  `player.pitch` within limits (so looking up or down swings the camera round the head). Mouse and joystick steer `player.yaw`
  exactly as now, so walking feels the same; only the camera moves.
- Boom collision: march the boom from the head outwards in 8 steps and stop at the first point inside the room bounds
  (`RW`, `RD`, salon wall) or inside a solid (the same tests `collide()` uses); keep 0.2 m clear. Cheap: no raycasts.
- Aiming: `findCand()` keeps working from the head and the facing, so seat rings and the SIT / PLAY HERE prompt behave as
  now. The centre crosshair no longer lines up with what you face, so it is hidden in the behind view.
- Leaving through the door, the bar, the LAYR exchange: unchanged (they go by the player's position).

## 4. Tables and machines in the behind view

- Seated: `camTargets()` gets a behind variant: camera 1.3 m behind and 1.9 m above the seat, looking at the table centre,
  so you see your Adrian's back and shoulders and the table. The table-view buttons still switch to the existing table views.
  Card and game panels are HTML overlays, so they are unaffected.
- Machines: the play close-up (`setMachineView(true)`) stays exactly as it is. The step-back view (`machineReturn`, when you
  walk away from the screen) uses the behind camera, so you see yourself at the cabinet.
- Pads (roulette, video poker): standing figure, over-the-shoulder camera like a seat.

## 5. Personal space

- `makeWalker()` gives each walker a collider, like `makeEntry(true)` already does:
  `e.col = { k: 'c', x: 0, z: 0, r: 0.3, active: () => personalSpace() && !!e.key && e.spec.on }`, pushed to `solids`.
  `walkFrame()` updates `e.col.x/z` with the interpolated position it already computes. With `PR = 0.32`, two people stop
  about 0.6 m apart, centre to centre.
- Players standing at machines and pads already block (their `e.col`); seated players are behind their stool colliders.
- `personalSpace()` is true only while the visitor is signed into the room: then they are visible, and others' clients stop
  their players at the visitor's Adrian too. Signed out, they are invisible and walk through everyone (and with anonymous
  watching off, they do not see anyone anyway).
- How the page knows: `room.js` adds one call to the `PXRoomHost` contract, `self({ signed: boolean, address })`, made when
  the session starts, ends or runs out. Older pages ignore it; a page without it treats the visitor as signed out.
- Walkers beyond the figure cap are not drawn and do not block (an invisible obstacle would feel like a bug). Figures are
  given to the nearest walkers first, so anyone close enough to bump into is drawn.
- Remote positions are about half a second behind, so two players walking into each other are each stopped by their own
  client a moment apart. The push-out in `collide()` is smooth, and someone who sits down or stands up on top of you simply
  nudges you aside. No server change.
- Optional: a soft ring on the floor round your feet in the behind view when you are touching someone, so the stop reads
  as "personal space" and not as a glitch.

## 6. Build steps

| # | Step | Where | Ships alone? |
| --- | --- | --- | --- |
| 1 | Personal space: walker colliders + `personalSpace()` + `PXRoomHost.self()` in room.js | page walkers block, room.js | Yes |
| 2 | Own Adrian figures (hidden until the behind view exists) | presence block | Yes |
| 3 | Behind view while walking: toggle, boom, collision, crosshair | walking block, frame loop | Yes |
| 4 | Behind view at tables, pads and machines | `camTargets`, machine views | Yes |
| 5 | Phone pass: 7 figures, boom on small screens, the toggle button size | | |

Room.js is rebuilt with `npm run build:casino-room` (its `?v=` bumped in the page).

## 7. Tests

- Browser (Playwright, as in `scripts/test-casino-wallet-browser.mjs`): `?walkdemo=N` walkers circling; signed in, walk the
  player into one and check the distance never drops below ~0.6 m; signed out, check the player passes through. Toggle V and
  check the camera sits behind the head and the own figure is shown; sit at a table and at a machine in the behind view.
- Boom maths (the 8-step march against `solids`) cut out of the page and unit tested like the LAYR exchange module is
  (`src/casino-room/__tests__/layr-exchange-connect.test.ts` shows how).
- First person unchanged: the arcade's `tests/casino-walk.test.cjs` still passes; the default view is unchanged.
- Frame rate on a phone with `?roomdemo=6&walkdemo=6` plus your own figure.

## 8. Decisions for Jim (each has a default)

1. **Default view.** Default: first person, as today, with V / the eye button to switch. (Or behind by default.)
2. **At tables in the behind view:** over the shoulder by default, with the table-view buttons still there. (Or keep today's
   table cameras and show your Adrian only while walking.)
3. **Personal space size.** Default: about 0.6 m between centres (`r: 0.3` + `PR`).
4. **Your look.** Default: the clothes everyone already sees on you (from your address). Choosing your own outfit: later.
