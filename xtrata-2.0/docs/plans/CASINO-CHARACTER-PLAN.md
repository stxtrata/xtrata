# ParallaX Casino: cube characters

Status: **built 2026-11-12, not committed, not deployed.** Page `/casino` (`public/casino/index.html`, `cube-avatars.js`,
`character.js`), room client `src/casino-room/main.ts` (`room.js`), room Worker (`workers/casino-room/index.ts`,
`functions/lib/casino-look.ts`, `casino-room.ts`, `casino-progress.ts`). Part of the overhaul in `CASINO-OVERHAUL-PLAN.md`.

**The ask.** Bring the cube-headed characters of the "Xtrata Cube Comparison & Material Lab" (edition 2.2) into the casino as player
characters: a player chooses the humanoid or the floating cube as their profile, customises it, and is seen as it by everyone in the
room. Work out selection, persistence and how a look reaches other players; keep it light for phones and cheap for the room Worker.

## 1. What a player gets

- **Three bodies.** The classic human figure (as before, and still the default), the **humanoid cube** and the **floating cube**.
  The lab's third body, the Classic CubeBot (cube as torso and head), is not offered: the brief asked for the humanoid and the
  floating cube. It can be added as a fourth body later with no change to the room (see section 6).
- **For the cubes:** the frame (the lab's eight material presets, or any colour), the accent colour (the screens' graphics and the
  body's lights), the face on the front screen (six), the screens' finish (the lab's six) and the walk (natural, swagger, tipsy).
- **A live preview** in the panel: the character turns, stands and walks on the spot; drag to turn it.
- **Where to find it:** Menu, You, **Your character**; and a line under ENTER THE CASINO on the welcome card ("Your character:
  you are the classic figure · change").
- **Who sees it.** Everyone in the room, at seats, at machines and walking. A guest (not signed in) sees their own choice on
  themselves in the behind-you view and keeps it for when they join.
- **A look from the lab.** The panel takes the lab's "Material settings / JSON" and uses its frame colour (as a preset when it is
  one) and its front screen's finish. The JSON is parsed as data and nothing in it is run.

## 2. The look is one short code

`<body><frame><finish><face><gait>-<accent>[-<frame colour>]`, for example `h000n-4ed5bd` or `fx40n-b48cff-2a1a4a`.
At most 19 characters, one pattern (`LOOK_PATTERN`), and nothing a player types ever reaches another player's page: the
room refuses anything that is not exactly this shape, and the page parses it again before drawing.

| Part | Values |
| --- | --- |
| body | `p` human figure · `h` humanoid cube · `f` floating cube |
| frame | `0`-`7` porcelain, titanium, obsidian, copper, carbon, walnut, mint, cobalt · `x` own colour (the last part) |
| finish | `0`-`5` glass, satin, matte, frosted, smoked, CRT |
| face | `0`-`5` happy, calm, wink, wow, cool, focus |
| gait | `n` natural · `s` swagger · `t` tipsy |
| accent | six hex digits |

The lists live twice, once for the room (`functions/lib/casino-look.ts`) and once for the page (`public/casino/cube-avatars.js`,
a plain script); `functions/lib/__tests__/casino-look.test.ts` loads the page's file and fails if they differ.

## 3. Where a look lives, and how it reaches other players

1. **This browser** (`localStorage` `parallax.look.v1`), so the choice exists before anyone signs in.
2. **The player's room profile** (`lk` on the `p:` record the room already keeps for levels and missions), once they are signed in.
   So it follows the wallet to another device.
3. **The connection** (`lk` in the socket's attachment, which survives hibernation), so the room can list it without reading storage.

The messages, all small:

- Page to room: `{ t: 'look', v: '<code>' | null }` (null: back to the human figure). Only sent on Save, only when the room lists the
  `look` feature and the player is signed in.
- Room to everyone who can see the room: `{ t: 'look', a: '<address>', v }`; to the sender, the same with `mine: true` as the receipt.
- On arrival, every player in the `room` message's `players` list carries `lk` when they are a cube; when a cube player joins, the
  others get one `look` after the `join`, the way `lvl` already follows it.

Which copy wins: the room's, on arrival, unless this browser holds a change the room has not confirmed (`parallax.look.unsent.v1`),
which is sent first. That covers choosing a look as a guest and then joining, and a room that was unreachable when Save was pressed.

## 4. What it costs

**The room Worker.** Nothing while nobody changes their look: the code is read with the profile the room already reads when a
player connects (no extra read), and rides in the attachment. A change is one profile read, one profile write and one small message
to each connection. Changes have their own limit (one every 1.5 s, twelve a minute), so they cannot slow seats or chat. No timers.

**The page.** Measured in the real room (headless Chromium, software rendering, so counts are exact and frame times are not):

| | Humanoid cube | Floating cube | Human figure |
| --- | --- | --- | --- |
| Draw calls | 11 | 3 (with its floor glow) | (a 163-bone skinned mesh) |
| Triangles | about 6,500 (5,800 on phones) | about 470 | |
| Own texture | one, 768 x 512 (384 x 256 on phones) | the same | shares the 2048 px skin |
| Shadow passes | 2 meshes | 1 mesh | all of it |

Eight characters on the floor (four of each) added 56 draw calls and 28,000 triangles to a 2,100-call, 580,000-triangle frame. Every character
shares the same vertex data; only a small colour table and the screen texture are its own. On phones and tablets (LITE) the bodies
are lit per vertex, the screens are plain textures, and cubes cast no shadows.

**No human figure is built for a cube player.** Seats and walkers for cubes have their own entries, so a phone that draws at most
6 human figures can also draw up to 12 cubes (desktop: 16 and 24). A room of cubes is the light case, not the heavy one.

**Why not the lab's own runtime.** It is about 1 MB, brings its own copy of three.js (r170; the casino runs r128), and gives every
character six 512 px canvases and about a hundred meshes. `cube-avatars.js` is 39 KB and draws to the lab's measurements instead.

## 5. What is faithful to the lab, and what is not

Faithful: the cube (1.02, radius 0.072), bezels and screens (0.948 and 0.9); the humanoid's pelvis, tapered chest, collar, shoulder
fairings, neck gimbal and rear yoke, with the cube head at 0.87; the six default screens (face, name and wave, energy, network,
ring, dot grid); the eight frame presets' colours, roughness and metalness; the six finishes; idle, walk, run, the wave, and the
swagger and tipsy styles; the floating cube's bob, pitch into its travel and bank into a turn.

Not carried over: frame **textures** (brushed, carbon weave, hammered, wood grain: only the colour and the metal come across),
per-face finishes and tints (one finish for all six screens), custom screen content (inscriptions, images, video), the hands'
fingers, leg-length presets, the seated stool, jump, present and acknowledge, GLB export. The lab remains the place for those.

Scale: the lab's humanoid is 2.94 units tall. In the room it stands 1.65 m, a little shorter than the human figures (about
1.8 m), because its head is half a metre across: at 1.92 m a seated neighbour's head covered a third of the screen at a table.
Seated on a 0.57 m stool it sits tall (1.91 m to the top of the head), because its legs are short. Name tags follow the head.
The floating cube is 0.51 m across with its centre 1.22 m up.

**Never in the way.** A cube whose head is within 1.5 m of the camera is drawn as a faint ghost, and not at all within 0.55 m. So
your own cube at a table (the camera sits a metre behind your seat) never covers the felt or the cards, and nobody's cube can fill
your screen by standing close.

## 6. Decisions for Jim

1. **The Classic CubeBot as a fourth body?** Not built (the brief named two). Adding it is page-only: a new letter in the code.
2. **The player's name on the back screen.** The back screen shows the BNS name or short address (the lab shows "CUBE"). Keep, or
   put the lab's panel back?
3. **Cubes close to the camera are ghosts** (see section 5). The alternative for your own cube at a table is a higher camera for
   cube players; I did not change the table cameras, which were tuned so the cards are never covered.
4. **Looks for guests.** A guest cannot be seen, so their look is theirs alone until they join. No change proposed.

## 7. Tests

- Unit (`casino-look.test.ts`, 13 tests): the code's shape, the limit, the room's rules, that the page and the room agree.
- End to end (the real page, the real room code, headless Chromium): a player picks a cube and a second player sees a cube where
  they stand, with no human figure built; the look is in the profile; a later arrival and a guest get it from the `room` message;
  seated; a change to the floating cube; back to the human figure (a human figure is built again); a second device takes the
  room's copy. Touch-emulated phone: the panel opened from the menu, a body and a face chosen and saved by taps.
- Looked at (screenshots): the panel on desktop and phone; a room of cube and human players, walking and seated; the behind-you
  view of your own cube; a table with a cube neighbour and your own cube as a ghost.
- Not tested: a real phone or tablet (frame rate, memory), two real devices, real wallets.
